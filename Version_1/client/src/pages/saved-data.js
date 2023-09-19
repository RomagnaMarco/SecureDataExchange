import { useState, useEffect } from "react";
import axios from "axios";
// Importing custom hooks for various functionalities
import { useGetToken } from "../components/hooks/useGetToken";
import useDecodedToken from "../components/hooks/useDecodedToken";
import { useGetUserID } from "../components/hooks/useGetUserID";
import useFormatDate from "../components/hooks/useFormatDate";

/**
 * Individual data item component that displays data and provides
 * options based on user's clearance level.
 */
const DataItem = ({ item, saveData, removeData, userClearanceLevel, savedData = [] }) => {
    // Use custom hook to format the date
    const formattedDate = useFormatDate(item.date);

    // Helper function to check if data is saved
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
 * Generic function to make authenticated API calls with clearance level.
 */
const makeApiCall = async (url, token, userClearanceLevel, method = "GET", data = null) => {
    // Ensure token and userClearanceLevel are available before making API call
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
 * Main component to fetch and display saved data for the authenticated user.
 */
export const SavedData = () => {
    // States to manage fetched data and saved data IDs
    const [data, setData] = useState([]);
    const [savedDataIDs, setSavedDataIDs] = useState([]);

    // Fetch necessary values using custom hooks
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

    // Function to remove saved data
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

    // Fetch saved data on component mount or upon changes in dependencies
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

    // Display messages based on the user's authentication status and clearance level
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
