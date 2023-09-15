import { useState } from "react";
import axios from "axios";

// Function to check user's clearance level
const checkClearance = async (clearanceLevel) => {
  try {
    const response = await axios.get(`/auth/check-clearance?clearanceLevel=${clearanceLevel}`);
    return response.data.message;
  } catch (error) {
    console.error(error);
    return 'Error occurred';
  }
};

// The add-data component definition
export const AddData = () => {
  // Initialize the 'data' state to hold form inputs and tags
  const [data, setData] = useState({
    clearance: "",
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

    const selectedClearanceLevel = data.clearance;
    const userClearanceLevel = await checkClearance(selectedClearanceLevel);

    if (userClearanceLevel === 'Error occurred') {
      alert("Error while checking clearance. Please try again.");
      return;
    }

    if (userClearanceLevel === 'Insufficient clearance level.') {
      alert("Insufficient clearance level to submit this data.");
      return;
    }

    try {
      // Send a POST request to submit the data
      await axios.post("http://localhost:3001/data", data);
      alert("Data Added");
    } catch (err) {
      console.error(err);
      alert("Error while submitting data.");
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
