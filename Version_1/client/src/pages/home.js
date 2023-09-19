import { useState, useEffect } from "react";
import axios from "axios";

// Custom hooks for managing user-specific details and JWT token
import { useGetToken } from "../components/hooks/useGetToken";
import useDecodedToken from "../components/hooks/useDecodedToken";
import { useGetUserID } from "../components/hooks/useGetUserID";
import useFormatDate from "../components/hooks/useFormatDate";

/**
 * DataItem component represents each individual data in the list.
 * It provides functionalities such as displaying data and saving the data
 * based on the user's clearance level.
 */
const DataItem = ({ item, saveData, userClearanceLevel, savedData = [] }) => {
    // Utilize the custom hook to obtain a formatted date for the given item
    const formattedDate = useFormatDate(item.date);

    // Function to determine if a data item has already been saved
    const isDataSaved = (id) => savedData.includes(id)

    return (
        // Render each data item's details, including description, clearance level, tags, and date
        <li key={item._id}>
            <div><h2>{item.description}</h2></div>
            <div><p>Item's clearance level: {item.clearanceLevel !== undefined ? item.clearanceLevel : "Not available"}</p></div>
            <div><p>{item.tags.join(', ')}</p></div>
            <div><p>{formattedDate}</p></div>
            <div className="information"><p>{item.info ? item.info : "No information available"}</p></div>
            {userClearanceLevel >= 2 && <button onClick={(
            ) => saveData(item._id)} disabled={isDataSaved(item._id)}
            > 
            { isDataSaved(item._id) ? "Already Saved" : "Save Data"}
            </button>}
        </li>
    );
}

/**
 * Utility function to make authenticated API calls.
 * The function ensures that proper headers (Authorization and Clearance-Level)
 * are set for the API requests.
 */
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

/**
 * Home component serves as the main dashboard view users see upon accessing the app.
 * The component is responsible for fetching, displaying, and managing saved data items.
 */
export const Home = () => {
    // State variables to manage the fetched data and IDs of saved data items
    const [data, setData] = useState([]);
    const [savedData, setSavedData] = useState([]);

    // Use custom hooks to obtain user-specific details and JWT token
    const userID = useGetUserID();
    const token = useGetToken();
    const decodedToken = useDecodedToken(token);
    const userClearanceLevel = decodedToken?.clearanceLevel;

    // Function to handle data saving operations
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
                setSavedData(response.data.savedData)
                alert("Data saved successfully!");
            } else {
                alert("Error saving data.");
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                alert("You don't have permission to save this data.");
            } else {
                alert("An error occurred while saving data.");
            }
            console.error("Error:", error);
        }
    }

    // UseEffect to fetch data and saved data IDs whenever dependencies change
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

    // Conditional rendering based on the user's authentication status and clearance level
    if (!decodedToken) return <div>Access Denied. Please Log In.</div>;
    if (!userClearanceLevel) return <div>You do not have the necessary clearance.</div>;

    return (
        // Render the main view including user's clearance level and list of data items
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
