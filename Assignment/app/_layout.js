import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { axiosClient } from "../config/axiosClient"
import { LineChart } from 'react-native-gifted-charts';





export default function RootLayout() {
    const [search, setSearch] = useState('')
    const [data, setData] = useState([])
    const [chartData, setChartData] = useState([]);
    const getData = async () => {
        let res = await axiosClient.get('/query', {
            params: {
                function: "TIME_SERIES_INTRADAY",
                symbol: search,
                interval: "5min",
                apikey: "2FAZN4A6PEQG1A1E"
            }
        })
        if (res.status === 200) {
            setData(res.data);
            console.log("working");

            // Transform data for the chart
            const timeSeries = res.data["Time Series (5min)"];
            const chartData = Object.keys(timeSeries).map((time) => ({
                value: parseFloat(timeSeries[time]["4. close"]),
                label: time.split(' ')[1],
            })).reverse();

            setChartData(chartData);
        }
    }


    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <TextInput
                onChangeText={(text) => {
                    setSearch(text)
                }}
                style={{ borderWidth: 1, borderColor: "black", width: 200 }}
            />

            <TouchableOpacity onPress={() => getData()}>
                <Text style={{ color: "red" }}>Search</Text>
            </TouchableOpacity>
            {chartData.length > 0 && (
                <LineChart
                    data={chartData}
                    width={300}
                    height={200}
                    isAnimated
                    initialSpacing={0}
                    spacing={20}
                    color="#4caf50"
                    thickness={2}
                    yAxisColor="#000"
                    xAxisColor="#000"
                    yAxisTextStyle={{ color: '#000' }}
                    xAxisTextStyle={{ color: '#000' }}
                    hideDataPoints
                />)}

        </ScrollView>
    );
}
