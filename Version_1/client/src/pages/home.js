import { useState, useEffect } from "react";
import axios from "axios";

import { useGetUserID } from "../components/hooks/useGetUserID";
import { useGetToken } from "../components/hooks/useGetToken";
import useDecodedToken from "../components/hooks/useDecodedToken";

// The Home component definition
export const Home = () => {

    const [data, setData] = useState([]);
    // use hook to get UserID
    const userID = useGetUserID();
    // use hook for token
    const token = useGetToken();
    // use hook for decododToken
    const decodedToken = useDecodedToken(token);

    const userClearanceLevel = decodedToken.clearanceLevel;


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an HTTP GET request to your server to fetch the data
        const response = await axios.get("http://localhost:3001/data", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the 'Authorization' header
            "Clearance-Level": userClearanceLevel, // Include the clearance level as a custom header
          },
        });

        // Check if the request was successful
        if (response.status === 200) {
          // Assuming your server returns an array of data objects
          const responseData = response.data;

          // Update the 'data' state with the received data
          setData(responseData);
        } else {
          // Handle any errors or unexpected responses here
          console.error("Error fetching data.");
        }
      } catch (error) {
        // Handle any network or client-side errors here
        console.error("Error:", error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, [token, userClearanceLevel]); // Include the token and userClearanceLevel in the dependency array

  return (
    <div>
      <h2>Home</h2>
    </div>
  );
};
