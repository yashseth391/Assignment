import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { axiosClient } from "../config/axiosClient";
import Animation, { FadeInDown } from 'react-native-reanimated'
const LaunchesDetail = () => {
  const params = useLocalSearchParams();
  const id = params.id;

  const [launchData, setLaunchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Launch ID from params:", id);

    if (!id) {
      setError("No launch ID provided");
      setLoading(false);
      return;
    }

    console.log("Fetching data for launch ID:", id);
    setLoading(true);

    // Fix: Use the actual ID in the API endpoint
    axiosClient
      .get(`/${id}`)
      .then((res) => {

        if (res.data) {

          setLaunchData(res.data);
          console.log("Launch details response:", res.data);
        } else {
          setError("No data received for this launch");
        }
      })
      .catch((err) => {
        console.error("Error fetching launch data:", err);
        setError("Failed to load launch data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  useEffect(() => {
    console.log("launchData state changed:", launchData);
  }, [launchData]);
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.statusText}>Loading launch details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!launchData) {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>No launch data available</Text>
      </View>
    );
  }

  return (

    <ScrollView style={styles.container}>
      <Animation.View entering={FadeInDown.duration(2000)}>
        <View style={styles.header}>
          <Text style={styles.missionName}>{launchData.name}</Text>
          <Text style={styles.date}>
            {new Date(launchData.date_utc).toLocaleString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mission Status</Text>
          <Text style={[
            styles.statusValue,
            { color: launchData.success ? '#4caf50' : '#f44336' }
          ]}>
            {launchData.success ? 'Successful' : 'Failed'}
          </Text>
        </View>

        {launchData.details && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mission Details</Text>
            <Text style={styles.detailText}>{launchData.details}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Launch Information</Text>
          <Text style={styles.infoText}>Flight Number: #{launchData.flight_number}</Text>
          <Text style={styles.infoText}>Rocket ID: {launchData.rocket}</Text>
          {launchData.launchpad && (
            <Text style={styles.infoText}>Launchpad: {launchData.launchpad}</Text>
          )}
        </View>

        {launchData.failures && launchData.failures.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Failure Information</Text>
            {launchData.failures.map((failure, index) => (
              <View key={index} style={styles.failureItem}>
                <Text style={styles.failureReason}>{failure.reason}</Text>
                <Text style={styles.failureDetail}>
                  Time: T+{failure.time} seconds
                </Text>
              </View>
            ))}
          </View>
        )}
      </Animation.View>
    </ScrollView>

  );
};

export default LaunchesDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#151718',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151718',
  },
  header: {
    marginBottom: 20,
    marginTop: 40,
  },
  missionName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#9BA1A6',
  },
  section: {
    backgroundColor: '#1E2122',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailText: {
    color: '#ECEDEE',
    fontSize: 15,
    lineHeight: 24,
  },
  infoText: {
    color: '#ECEDEE',
    fontSize: 15,
    marginBottom: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#f44336',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  failureItem: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  failureReason: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  failureDetail: {
    color: '#ECEDEE',
    fontSize: 14,
  },
});