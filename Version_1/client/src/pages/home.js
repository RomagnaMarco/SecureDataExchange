import { useState, useEffect } from "react";
import axios from "axios";

import { useGetToken } from "../components/hooks/useGetToken";
import useDecodedToken from "../components/hooks/useDecodedToken";

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

const DataItem = ({ item, saveData, userClearanceLevel }) => {
    return (
        <li key={item._id}>
            <div>
                <h2>{item.description}</h2>
            </div>
            <div>
                <p>Item's clearance level: {item.clearanceLevel !== undefined ? item.clearanceLevel : "Not available"}</p>
            </div>
            <div>
                <p>{item.tags.join(', ')}</p>
            </div>
            <div>
                <p>{formatDate(item.date)}</p>
            </div>
            <div className="information">
                <p>{item.info ? item.info : "No information available"}</p>
            </div>
            {userClearanceLevel >= 2 && <button onClick={() => saveData(item._id)}> Save Data </button>}
        </li>
    );
}

export const Home = () => {
    const [data, setData] = useState([]);
    const token = useGetToken();
    const decodedToken = useDecodedToken(token);

    let userClearanceLevel;
    if (decodedToken && decodedToken.clearanceLevel) {
        userClearanceLevel = decodedToken.clearanceLevel;
    }

    const saveData = async (dataID) => {
        try {
            const response = await axios.put("http://localhost:3001/data", { dataID }, {
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
            if (!token || !userClearanceLevel) {
                return;
            }

            try {
                const response = await axios.get("http://localhost:3001/data", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Clearance-Level": userClearanceLevel,
                    },
                });

                if (response.status === 200) {
                    setData(response.data);
                } else {
                    console.error("Error fetching data.");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, [token, userClearanceLevel]);

    if (!decodedToken) {
        return <div>Access Denied. Please Log In.</div>;
    }

    if (!userClearanceLevel) {
        return <div>You do not have the necessary clearance.</div>;
    }

    return (
        <div>
            <h1>Home</h1>
            
            {/* Displaying the user's clearance level directly */}
            <p>Your clearance level: {userClearanceLevel}</p>

            <ul>
                {data.map(item => <DataItem key={item._id} item={item} saveData={saveData} userClearanceLevel={userClearanceLevel} />)}
            </ul>
        </div>
    );
};
