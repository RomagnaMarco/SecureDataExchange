import { useState, useEffect } from "react";
import axios from "axios";

import { useGetUserID } from "../components/hooks/useGetUserID";
import { useGetToken } from "../components/hooks/useGetToken";
import  useDecodedToken from "../components/hooks/useDecodedToken"

export const Home = () => {
    const [data, setData] = useState([]);
    const userID = useGetUserID();
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
            <h2>Home</h2>
            {/* Display the data here */}
            {data.map((item, index) => (
                <div key={index}>
                    {/* Assuming data contains 'name' property as an example */}
                    {item.name}
                </div>
            ))}
        </div>
    );
};
