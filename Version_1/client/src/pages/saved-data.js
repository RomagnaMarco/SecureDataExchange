import { useState, useEffect } from "react";
import axios from "axios";
import { useGetToken } from "../components/hooks/useGetToken";
import useDecodedToken from "../components/hooks/useDecodedToken";
import { useGetUserID } from "../components/hooks/useGetUserID";
import useFormatDate from "../components/hooks/useFormatDate";



const DataItem = ({ item, saveData, removeData, userClearanceLevel, savedData = [] }) => {
    const formattedDate = useFormatDate(item.date);
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

export const SavedData = () => {
    const [data, setData] = useState([]);
    const [savedDataIDs, setSavedDataIDs] = useState([]);

    const userID = useGetUserID();
    const token = useGetToken();
    const decodedToken = useDecodedToken(token);
    const userClearanceLevel = decodedToken?.clearanceLevel;

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
                        removeData={removeData}
                        userClearanceLevel={userClearanceLevel}
                        savedData={savedDataIDs}
                    />
                )}
            </ul>
        </div>
    );
};
