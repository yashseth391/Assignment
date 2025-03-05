import AsyncStorage from "@react-native-async-storage/async-storage";

// AsyncStorage keys


export const getItem = async (key) => {
    try {
        return await AsyncStorage.getItem(key);
    } catch (error) {
        console.error("Error reading from AsyncStorage:", error);
    }
};

export const setItem = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error("Error saving to AsyncStorage:", error);
    }
};

export const removeItem = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error("Error removing from AsyncStorage:", error);
    }
};


