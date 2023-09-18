import { useState, useEffect } from "react";
import axios from "axios";

// Hooks to manage authentication and user state
import { useGetToken } from "../components/hooks/useGetToken";
import useDecodedToken from "../components/hooks/useDecodedToken";
import { useGetUserID } from "../components/hooks/useGetUserID";

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

const DataItem = ({ item, saveData, userClearanceLevel, savedData = [] }) => {
    const isDataSaved = (id) => savedData.includes(id);

    return (
        <li key={item._id}>
            <div><h2>{item.description}</h2></div>
            <div><p>Item's clearance level: {item.clearanceLevel !== undefined ? item.clearanceLevel : "Not available"}</p></div>
            <div><p>{item.tags.join(', ')}</p></div>
            <div><p>{formatDate(item.date)}</p></div>
            <div className="information"><p>{item.info ? item.info : "No information available"}</p></div>

            {userClearanceLevel >= 2 && <button onClick={() => saveData(item._id)} disabled={isDataSaved(item._id)}>
                {isDataSaved(item._id) ? "Saved" : "Save Data"}
            </button>}
        </li>
    );
}

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

export const SavedData = () => {
    const [data, setData] = useState([]);
    const [savedDataIDs, setSavedDataIDs] = useState([]);

    const userID = useGetUserID();
    const token = useGetToken();
    const decodedToken = useDecodedToken(token);
    const userClearanceLevel = decodedToken?.clearanceLevel;

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
                setSavedDataIDs(response.data.savedData);
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
                        userClearanceLevel={userClearanceLevel}
                        savedData={savedDataIDs}
                    />
                )}
            </ul>
        </div>
    );
};
