import { FlatList, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { axiosClient } from "../../config/axiosClient";
import RenderItem from "../components/RenderItem";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOutDown,
} from "react-native-reanimated";
import { getItem, setItem } from "../../config/AsyncStoreManager";

const INDEX_STORAGE_KEY = "spacexLaunchData";

const Index = () => {
  const [launchData, setLaunchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data...");
      setLoading(true);

      try {
        // Try to get from AsyncStorage first
        const storedDataString = await getItem(INDEX_STORAGE_KEY);
        console.log("Raw data from storage:", storedDataString);

        if (storedDataString) {
          try {
            // Parse the JSON string back into an array/object
            const storedData = JSON.parse(storedDataString);
            console.log("Parsed stored data:", typeof storedData, Array.isArray(storedData) ? storedData.length : 'not array');

            if (Array.isArray(storedData) && storedData.length > 0) {
              setLaunchData(storedData);
              setLoading(false);
              return; // Exit early if we have valid data
            }
          } catch (parseError) {
            console.error("Error parsing stored data:", parseError);
            // Continue to API fetch if parsing fails
          }
        }

        // If we get here, either no data in storage or invalid data
        // Fetch from API
        const response = await axiosClient.get("/");

        if (response.data) {
          let dataToStore;

          if (Array.isArray(response.data)) {
            console.log(`Received ${response.data.length} launches from API`);
            setLaunchData(response.data);
            dataToStore = response.data;
          } else {
            // Single object, wrap in array
            console.log("Received single launch from API, wrapping in array");
            setLaunchData([response.data]);
            dataToStore = [response.data];
          }

          // Store as JSON string
          const jsonString = JSON.stringify(dataToStore);
          console.log("Storing JSON data, length:", jsonString.length);
          await setItem(INDEX_STORAGE_KEY, jsonString);
        } else {
          setError("No data received from API");
        }
      } catch (error) {
        console.error("Error in data fetching:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.statusText}>Loading launch data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={styles.container}
      entering={FadeInDown.duration(2000)}
    >
      <Text style={styles.title}>SpaceX Launches</Text>

      <Text style={styles.subtitle}>
        {launchData.length} launches found
      </Text>

      <FlatList
        data={launchData}
        renderItem={({ item }) => <RenderItem item={item} />}
        keyExtractor={(item) => item.id || String(item.flight_number)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.statusText}>No launches to display</Text>
        }
      />
    </Animated.View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#151718',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151718',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "white",
    marginTop: 50,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: "#aaaaaa",
    marginBottom: 20,
    textAlign: 'center',
  },
  statusText: {
    marginTop: 10,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
});