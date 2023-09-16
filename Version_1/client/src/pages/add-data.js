import { useState } from "react";
import axios from "axios";

import { useGetUserID } from "../components/hooks/useGetUserID";
import { useGetToken } from "../components/hooks/useGetToken";
import { useDecodedToken } from "../components/hooks/useDecodedToken"
import { useNavigate } from 'react-router-dom'

// The add-data component definition
export const AddData = () => {
  
  // use hook to get UserID
  const userID = useGetUserID();
  // use hook for token
  const token = useGetToken();
  
  // Decode the token pulled from our hook to access the user's clearance level
  const decodedToken = useDecodedToken(token);
  

  // Initialize the 'data' state to hold form inputs and tags
  const [data, setData] = useState({
    clearance: 0,
    description: "",
    tags: [],
    info: "",
    userOwner: userID,
  });

  const navigate = useNavigate()

  // Array of clearance levels (0-3)
  const clearanceLevels = [0, 1, 2, 3];

  // Handle changes for form fields (clearance, description, info, etc.)
  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  // Handle changes for individual tags
  const handleTagChange = (event, idx) => {
    const { value } = event.target;
    const updatedTags = [...data.tags];
    updatedTags[idx] = value;
    setData({ ...data, tags: updatedTags });
  };

  // Add a new empty tag field
  const addTag = () => {
    setData({ ...data, tags: [...data.tags, ""] });
  };

  // Handle data submission
  const handleSubmitData = async (event) => {
    event.preventDefault();
  
    try {
      const selectedClearanceLevel = data.clearance;
  
      // Check if 'description' is empty or null
      if (!data.description) {
        alert("Description is required.");
        return;
      }
  
      // Check if the user's clearance level is sufficient
      if (decodedToken.clearanceLevel < selectedClearanceLevel) {
        alert("Insufficient clearance level to submit this data.");
        return;
      }
  
      // Ensure data being sent is in the correct format.
      const dataToSend = {
        clearance: selectedClearanceLevel,
        description: data.description,
        tags: data.tags,
        info: data.info,
        userOwner: data.userOwner,
      };
  
      // Continue with the data submission
      const response = await axios.post("http://localhost:3001/data", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the 'Authorization' header
          "Content-Type": "application/json", // Set the content type to JSON
        },
      });
  
      // Log the response data
      console.log("Server Response:", response.data);
  
      // Check for any errors in the server response
      if (response.data.error) {
        // Handle server-side errors
        console.error("Server Error:", response.data.error);
        alert("Error while submitting data. Server returned an error.");
      } else {
        alert("Data Added");
        navigate("/") //go back to home page
      }
    } catch (err) {
      console.error("Client Error:", err);
  
      // Handle client-side errors
      alert("Error while submitting data. An error occurred on the client.");
    }
  };

  return (
    <div className="add-data">
      <h2> Add Data </h2>
      <form onSubmit={handleSubmitData}>
        <label htmlFor="clearance"> Clearance Level </label>
        <select
          id="clearance"
          name="clearance"
          onChange={handleChange}
          value={data.clearance}
        >
          {clearanceLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <label htmlFor="description"> Description </label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
          value={data.description}
        ></textarea>

        <label htmlFor="tags"> Tags </label>
        {data.tags.map((tag, idx) => (
          <div key={idx}>
            <input
              type="text"
              name="tags"
              value={tag}
              onChange={(event) => handleTagChange(event, idx)}
            />
          </div>
        ))}
        <button type="button" onClick={addTag}>
          Add Tag
        </button>

        <label htmlFor="info"> Information </label>
        <textarea
          id="info"
          name="info"
          onChange={handleChange}
          value={data.info}
        ></textarea>

        <button type="submit"> Add Data </button>
      </form>
    </div>
  );
};
