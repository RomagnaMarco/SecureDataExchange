import { useState, useEffect } from "react";
import axios from "axios";

import { useGetToken } from "../components/hooks/useGetToken";
import useDecodedToken from "../components/hooks/useDecodedToken";

const DataItem = ({ item }) => {
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
                <p>{item.date}</p>
            </div>
            <div className="information">
                <p>{item.info ? item.info : "No information available"}</p>
            </div>
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
                {data.map(item => <DataItem key={item._id} item={item} />)}
            </ul>
        </div>
    );
};
