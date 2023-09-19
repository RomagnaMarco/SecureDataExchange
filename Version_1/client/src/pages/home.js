// Import necessary hooks and libraries from React and axios
import { useState, useEffect } from "react";
import axios from "axios";

// Custom hooks for managing user-specific details and JWT token
import { useGetToken } from "../components/hooks/useGetToken";
import useDecodedToken from "../components/hooks/useDecodedToken";
import { useGetUserID } from "../components/hooks/useGetUserID";
import useFormatDate from "../components/hooks/useFormatDate";

/**
 * DataItem component displays individual data entries.
 * @param {Object} item - The individual data entry.
 * @param {Function} saveData - Function to save data.
 * @param {Function} deleteData - Function to delete data.
 * @param {Number} userClearanceLevel - User's security clearance level.
 * @param {Array} savedData - Array containing IDs of saved data.
 * @returns {JSX.Element}
 */
const DataItem = ({ item, saveData, deleteData, userClearanceLevel, savedData = [] }) => {
    // Format date using the custom hook
    const formattedDate = useFormatDate(item.date);
    
    // Helper function to check if data is already saved
    const isDataSaved = (id) => savedData.includes(id);

    return (
        // Display the details of the data item
        <li key={item._id}>
            <div><h2>{item.description}</h2></div>
            <div><p>Item's clearance level: {item.clearanceLevel !== undefined ? item.clearanceLevel : "Not available"}</p></div>
            <div><p>{item.tags.join(', ')}</p></div>
            <div><p>{formattedDate}</p></div>
            <div className="information"><p>{item.info ? item.info : "No information available"}</p></div>
            
            {/* Buttons to save and delete data, based on user clearance level */}
            {userClearanceLevel >= 2 && <button onClick={() => saveData(item._id)} disabled={isDataSaved(item._id)}>{isDataSaved(item._id) ? "Already Saved" : "Save Data"}</button>}
            {userClearanceLevel === 3 && (
                <button onClick={() => {
                if (window.confirm("Are you sure you want to delete this data?")) {
                    deleteData(item._id);
                }
    }}>
        Delete
    </button>
)}

        </li>
    );
}

/**
 * Utility function to make authenticated API calls.
 * @param {String} url - Endpoint URL.
 * @param {String} token - JWT token.
 * @param {Number} userClearanceLevel - User's security clearance level.
 * @param {String} [method="GET"] - HTTP method.
 * @param {Object} [data=null] - Request payload.
 * @returns {Promise}
 */
const makeApiCall = async (url, token, userClearanceLevel, method = "GET", data = null) => {
    if (!token || !userClearanceLevel) return null;

    // Set up headers for the request
    const headers = {
        Authorization: `Bearer ${token}`,
        "Clearance-Level": userClearanceLevel,
    };

    // Execute the API call and return the result
    try {
        const response = await axios({
            method: method,
            url: url,
            headers: headers,
            data: data
        });
        
        return response.data;
    } catch (err) {
        console.error("Error:", err);
        return null;
    }
}

/**
 * Home component fetches, displays, and manages data.
 * @returns {JSX.Element}
 */
export const Home = () => {
    // State to store the fetched data and saved data
    const [data, setData] = useState([]);
    const [savedData, setSavedData] = useState([]);

    // Fetch user ID and JWT token using custom hooks
    const userID = useGetUserID();
    const token = useGetToken();

    // Decode the JWT token to extract user details
    const decodedToken = useDecodedToken(token);
    const userClearanceLevel = decodedToken?.clearanceLevel;

    /**
     * Save a specific data entry.
     * @param {String} dataID - ID of the data to save.
     */
    const saveData = async (dataID) => {
        try {
            const response = await axios.put("http://localhost:3001/data", { 
                dataID,
                userID,
             }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Handle response from the save data endpoint
            if (response.status === 200) {
                setSavedData(response.data.savedData);
                alert("Data saved successfully!");
            } else {
                alert("Error saving data.");
            }
        } catch (error) {
            // Handle potential errors
            if (error.response && error.response.status === 403) {
                alert("You don't have permission to save this data.");
            } else {
                alert("An error occurred while saving data.");
            }
            console.error("Error:", error);
        }
    }

    /**
     * Delete a specific data entry.
     * @param {String} dataID - ID of the data to delete.
     */
    const deleteData = async (dataID) => {
        const response = await makeApiCall("http://localhost:3001/data", token, userClearanceLevel, "DELETE", { dataID });

        // Remove deleted data from the state
        if (response && response.success) {
            setData(prevData => prevData.filter(item => item._id !== dataID));
        }
    }

    // Effect to fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = await makeApiCall("http://localhost:3001/data", token, userClearanceLevel);
            if (fetchedData) setData(fetchedData);
        }

        fetchData();
    }, [token, userClearanceLevel]);

    // Render based on user's JWT token and clearance level
    if (!decodedToken) return <div>Access Denied. Please Log In.</div>;
    if (!userClearanceLevel) return <div>You do not have the necessary clearance.</div>;

    return (
        <div>
            <h1>Home</h1>
            <p>Your clearance level: {userClearanceLevel}</p>
            <ul>
                {data.map(item => (
                    <DataItem
                        key={item._id}
                        item={item}
                        saveData={saveData}
                        deleteData={deleteData}
                        userClearanceLevel={userClearanceLevel}
                        savedData={savedData}
                    />
                ))}
            </ul>
        </div>
    );
};
