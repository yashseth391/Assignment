import axios from "axios";

const baseURL = "https://www.alphavantage.co";

export const axiosClient = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Helper functions to manage AsyncStorage

axiosClient.interceptors.response.use(
    async (response) => {
        if (response.data.status === 200) {
            return response;
        }

        // If you reach here, there was an issue with the response
        return response; // Return response anyway instead of rejecting with undefined error
    },
    (error) => {
        // Handle network errors or other Axios errors
        return Promise.reject(error);
    }
);