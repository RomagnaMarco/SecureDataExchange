import { useState } from "react";
import axios from "axios";

import { useGetUserID } from "../components/hooks/useGetUserID";
import { useGetToken } from "../components/hooks/useGetToken";
import useDecodedToken from "../components/hooks/useDecodedToken";
import { useNavigate } from 'react-router-dom';

/**
 * AddData Component.
 * Allows users to submit new data entries, checking their clearance level and
 * providing inputs for various data attributes like description, tags, and additional info.
 */
export const AddData = () => {
  
  // Retrieve the current user's ID
  const userID = useGetUserID();
  
  // Retrieve the current session's JWT token
  const token = useGetToken();
  
  // Decode the JWT token to access user-related attributes like clearance level
  const decodedToken = useDecodedToken(token);
  
  // State to manage the form data for new data entry
const [data, setData] = useState({
  clearanceLevel: (decodedToken && decodedToken.clearanceLevel) || 0,
  description: "",
  tags: [],
  info: "",
  userOwner: userID,
});


  // Hook to programmatically navigate between routes
  const navigate = useNavigate();

  // Clearance levels available for selection
  const clearanceLevels = [0, 1, 2, 3];

  /**
   * Handles the change of input fields in the form.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  /**
   * Handles the change of tags input fields in the form.
   */
  const handleTagChange = (event, idx) => {
    const { value } = event.target;
    const updatedTags = [...data.tags];
    updatedTags[idx] = value;
    setData({ ...data, tags: updatedTags });
  };

  /**
   * Adds an empty input field for a new tag.
   */
  const addTag = () => {
    setData({ ...data, tags: [...data.tags, ""] });
  };

  /**
   * Handles the submission of the form data to the server.
   */
  const handleSubmitData = async (event) => {
    event.preventDefault();
  
    const selectedClearanceLevel = data.clearanceLevel;

    // Validation: Description is mandatory
    if (!data.description) {
      alert("Description is required.");
      return;
    }

    // Validation: Ensure user's clearance level matches or exceeds the clearance level of the data being submitted
    if (decodedToken.clearanceLevel < selectedClearanceLevel) {
      alert("Insufficient clearance level to submit this data.");
      return;
    }

    const dataToSend = {
      clearanceLevel: selectedClearanceLevel,
      description: data.description,
      tags: data.tags,
      info: data.info,
      userOwner: data.userOwner,
    };

    // Send the data to the server
    try {
      const response = await axios.post("http://localhost:3001/data", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.error) {
        alert("Error while submitting data. Server returned an error.");
      } else {
        alert("Data Added");
        navigate("/") // Navigate back to the home page
      }
    } catch (err) {
      alert("Error while submitting data. An error occurred on the client.");
      console.error("Client Error:", err);
    }
  };

  // Render the component
  return (
    <div className="add-data">
      <h2>Add Data</h2>
      <form onSubmit={handleSubmitData}>
        <label htmlFor="clearanceLevel">Clearance Level</label>
        <select
          id="clearanceLevel"
          name="clearanceLevel"
          onChange={handleChange}
          value={data.clearanceLevel}
        >
          {clearanceLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
          value={data.description}
        ></textarea>

        <label htmlFor="tags">Tags</label>
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
        <button type="button" onClick={addTag}>Add Tag</button>

        <label htmlFor="info">Information</label>
        <textarea
          id="info"
          name="info"
          onChange={handleChange}
          value={data.info}
        ></textarea>

        <button type="submit">Add Data</button>
      </form>
    </div>
  );
};
