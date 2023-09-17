import { useState, useEffect } from "react";
import axios from "axios";

// Hooks to manage authentication and user state
import { useGetToken } from "../components/hooks/useGetToken";
import useDecodedToken from "../components/hooks/useDecodedToken";
import { useGetUserID } from "../components/hooks/useGetUserID";

// Utility to convert a given date string into a readable format
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    });
}

// Component representing an individual data item in the list.
// It also allows certain users (based on clearance level) to save data items.
const DataItem = ({ item, saveData, userClearanceLevel, savedData = [] }) => {
    return (
        <li key={item._id}>
            {/* Notify user if the data is already saved */}
            {savedData.includes(item._id) && <h2> ALREADY SAVED </h2>}
            <div><h2>{item.description}</h2></div>
            <div><p>Item's clearance level: {item.clearanceLevel !== undefined ? item.clearanceLevel : "Not available"}</p></div>
            <div><p>{item.tags.join(', ')}</p></div>
            <div><p>{formatDate(item.date)}</p></div>
            <div className="information"><p>{item.info ? item.info : "No information available"}</p></div>
            
            {/* Provide save option only to users with sufficient clearance */}
            {userClearanceLevel >= 2 && <button onClick={() => saveData(item._id)}> Save Data </button>}
        </li>
    );
}

// Utility for making authenticated API calls with proper headers
const makeApiCall = async (url, token, userClearanceLevel, userID = null) => {
    if (!token || !userClearanceLevel) return null;

    const headers = {
        Authorization: `Bearer ${token}`,
        "Clearance-Level": userClearanceLevel,
    };

    try {
        const response = await axios.get(userID ? `${url}/${userID}` : url, { headers });
        return response.status === 200 ? response.data : null;
    } catch (err) {
        console.error("Error:", err);
        return null;
    }
}

// Home component: Represents the main view users see when they access the app
export const Home = () => {
    const [data, setData] = useState([]);
    const [savedData, setSavedData] = useState([]);

    // Retrieve user-specific information and JWT token
    const userID = useGetUserID();
    const token = useGetToken();
    const decodedToken = useDecodedToken(token);
    const userClearanceLevel = decodedToken?.clearanceLevel;

    // Handle saving of data to backend and manage success or error states
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

            if (response.status === 200) {
                alert("Data saved successfully!");
            } else {
                alert("Error saving data.");
            }
        } catch (error) {
            // Handle error based on its type (e.g., lack of permissions)
            if (error.response && error.response.status === 403) {
                alert("You don't have permission to save this data.");
            } else {
                alert("An error occurred while saving data.");
            }
            console.error("Error:", error);
        }
    }

    // Use effect to fetch data and saved data IDs when dependencies change
    useEffect(() => {
        const fetchData = async () => {
            const result = await makeApiCall("http://localhost:3001/data", token, userClearanceLevel);
            if (result) setData(result);
        };

        const fetchSavedData = async () => {
            const result = await makeApiCall("http://localhost:3001/data/saved-data/ids", token, userClearanceLevel, userID);
            if (result && result.savedData) setSavedData(result.savedData);
        };

        fetchData();
        fetchSavedData();
    }, [token, userClearanceLevel, userID]);

    // Access control based on token and clearance level
    if (!decodedToken) return <div>Access Denied. Please Log In.</div>;
    if (!userClearanceLevel) return <div>You do not have the necessary clearance.</div>;

    return (
        <div>
            <h1>Home</h1>
            <p>Your clearance level: {userClearanceLevel}</p>
            <ul>
                {data.map(item => 
                    <DataItem key={item._id}
                        item={item}
                        saveData={saveData}
                        userClearanceLevel={userClearanceLevel}
                        savedData={savedData}
                    />
                )}
            </ul>
        </div>
    );
};
