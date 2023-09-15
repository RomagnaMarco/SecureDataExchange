import { useState } from "react";
import axios from "axios";

// The add-data component definition
export const AddData = () => {
  // Initialize the 'data' state to hold form inputs and tags
  const [data, setData] = useState({
    clearance: 0,
    description: "",
    tags: [],
    info: "",
  });

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
  
    // Fetch the token from the cookie (replace 'your_cookie_name' with the actual cookie name)
    const token = getCookie('access_token');
  
    try {
      const selectedClearanceLevel = data.clearance;
      
      // Decode the token to access the user's clearance level
      const decodedToken = decodeToken(token);
  
      // Check if the user's clearance level is sufficient
      if (decodedToken.clearanceLevel < selectedClearanceLevel) {
        alert("Insufficient clearance level to submit this data.");
        return;
      }
  
      // Continue with the data submission
      const response = await axios.post("http://localhost:3001/data", data, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the 'Authorization' header
          'Content-Type': 'application/json', // Set the content type to JSON
        },
      });
      alert("Data Added");
    } catch (err) {
      console.error(err);
      alert("Error while submitting data.");
    }
  };
  
  // Function to get a cookie by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const token = parts.pop().split(';').shift();
      return token.trim(); //remove leading/trailing whitespaces
    }
  }
  
  
  
  // Function to decode the JWT token
  function decodeToken(token) {
    if (!token) {
      throw new Error('Token not found.'); 
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }
  

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
