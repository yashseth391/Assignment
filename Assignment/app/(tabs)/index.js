import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { axiosClient } from "../../config/axiosClient"
import { TextInput } from 'react-native-web'

const index = () => {
    const [search, setSearch] = useState('')
    const getData = () => {
        const res = axiosClient.get('/query', {
            params: {
                function: TIME_SERIES_INTRADAY,
                symbol: search,
                interval: "5min",
                apikey: "2FAZN4A6PEQG1A1E"
            }
        })
        console.log("working", res)
    }
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <TextInput
                onChangeText={(text) => {
                    setSearch(text)
                }}
                style={{ borderWidth: 1, borderColor: "black", width: 200 }}
            />

            <TouchableOpacity onPress={() => getData()}>
                <Text style={{ color: "red" }}>Search</Text>
            </TouchableOpacity>


        </View>
    )
}

export default index

const styles = StyleSheet.create({})