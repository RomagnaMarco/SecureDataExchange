import { useState, useEffect } from "react";
import axios from "axios";

// Custom hooks for managing user-specific details, JWT token, and formatting
import { useGetToken } from "../components/hooks/useGetToken";
import useDecodedToken from "../components/hooks/useDecodedToken";
import { useGetUserID } from "../components/hooks/useGetUserID";
import useFormatDate from "../components/hooks/useFormatDate";

/**
 * DataItem Component:
 * Renders individual data items along with relevant options based on user's clearance level.
 * 
 * Props:
 * - item: The data item to display
 * - saveData: Callback function to handle saving data
 * - removeData: Callback function to handle removing saved data
 * - userClearanceLevel: User's current clearance level
 * - savedData: List of IDs of saved data items
 */
const DataItem = ({ item, saveData, removeData, userClearanceLevel, savedData = [] }) => {
    // Formatting the date of the data item
    const formattedDate = useFormatDate(item.date);

    // Helper function to determine if the current data item is saved
    const isDataSaved = (id) => savedData.includes(id);

    return (
        <li key={item._id}>
            <div><h2>{item.description}</h2></div>
            <div><p>Item's clearance level: {item.clearanceLevel !== undefined ? item.clearanceLevel : "Not available"}</p></div>
            <div><p>{item.tags.join(', ')}</p></div>
            <div><p>{formattedDate}</p></div>
            <div className="information"><p>{item.info ? item.info : "No information available"}</p></div>
            {userClearanceLevel >= 2 && (
                <>
                    {isDataSaved(item._id) && (
                        <button onClick={() => removeData(item._id)}>
                            Remove Data
                        </button>
                    )}
                </>
            )}
        </li>
    );
}

/**
 * Helper function to make authenticated API calls with appropriate headers.
 * 
 * @param {string} url - Endpoint URL
 * @param {string} token - JWT token for user
 * @param {number} userClearanceLevel - User's clearance level
 * @param {string} method - HTTP method (default is 'GET')
 * @param {object} data - Optional payload for the request
 */
const makeApiCall = async (url, token, userClearanceLevel, method = "GET", data = null) => {
    if (!token || !userClearanceLevel) return null;

    const headers = {
        Authorization: `Bearer ${token}`,
        "Clearance-Level": userClearanceLevel,
    };

    try {
        const response = await axios({
            method: method,
            url: url,
            headers: headers,
            data: data
        });
        
        return response.status === 200 ? response.data : null;
    } catch (err) {
        console.error("Error:", err);
        return null;
    }
}

/**
 * SavedData Component:
 * Main component to display and manage user's saved data.
 */
export const SavedData = () => {
    // State management for fetched data and list of saved data IDs
    const [data, setData] = useState([]);
    const [savedDataIDs, setSavedDataIDs] = useState([]);

    // Retrieving user-specific details and JWT token using custom hooks
    const userID = useGetUserID();
    const token = useGetToken();
    const decodedToken = useDecodedToken(token);
    const userClearanceLevel = decodedToken?.clearanceLevel;

    // Function to save specific data
    const saveData = async (dataID) => {
        const result = await makeApiCall(
            "http://localhost:3001/data", 
            token, 
            userClearanceLevel, 
            "PUT",
            { dataID, userID }
        );

        if (result && result.savedData) {
            setSavedDataIDs(result.savedData);
            alert("Data saved successfully!");
        } else {
            alert("An error occurred while saving data.");
        }
    }

    // Function to remove specific saved data
    const removeData = async (dataID) => {
        const result = await makeApiCall(
            `http://localhost:3001/data/saved-data/${userID}/${dataID}`, 
            token, 
            userClearanceLevel, 
            "DELETE"
        );

        if (result) {
            setSavedDataIDs(prevIDs => prevIDs.filter(id => id !== dataID));
            setData(prevData => prevData.filter(item => item._id !== dataID));
            alert("Data removed successfully!");
        } else {
            alert("An error occurred while removing data.");
        }
    }

    // Fetch the user's saved data on initial render or when dependencies change
    useEffect(() => {
        const fetchData = async () => {
            const result = await makeApiCall(`http://localhost:3001/data/saved-data/${userID}`, token, userClearanceLevel);
            if (result && result.savedData) {
                setData(result.savedData);
                setSavedDataIDs(result.savedData.map(item => item._id));
            }
        };

        fetchData();
    }, [token, userClearanceLevel, userID]);

    // Render appropriate messages based on user's authentication status and clearance level
    if (!decodedToken) return <div>Access Denied. Please Log In.</div>;
    if (!userClearanceLevel) return <div>You do not have the necessary clearance.</div>;

    return (
        <div>
            <h1>Saved Data</h1>
            <p>Your clearance level: {userClearanceLevel}</p>
            <ul>
                {data.map(item => 
                    <DataItem key={item._id}
                        item={item}
                        saveData={saveData}
                        removeData={removeData}
                        userClearanceLevel={userClearanceLevel}
                        savedData={savedDataIDs}
                    />
                )}
            </ul>
        </div>
    );
};
