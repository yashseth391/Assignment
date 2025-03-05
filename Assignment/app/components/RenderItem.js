import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'

const RenderItem = ({ item }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push({
        pathname: '/launchesDetail',

        params: { id: item.id }
      })}
    >
      <View style={styles.card}>
        <Text style={styles.missionName}>{item.name}</Text>
        <Text style={styles.details}>Flight Number: {item.flight_number}</Text>
        <Text style={styles.details}>Date: {new Date(item.date_utc).toLocaleDateString()}</Text>
        {item.details && <Text style={styles.description}>{item.details}</Text>}
      </View>
    </TouchableOpacity>
  )
}

export default RenderItem

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E2122',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  missionName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  details: {
    color: '#9BA1A6', // Using icon color from dark theme
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    color: '#ECEDEE', // Using text color from dark theme
    fontSize: 14,
    marginTop: 8,
  }
})