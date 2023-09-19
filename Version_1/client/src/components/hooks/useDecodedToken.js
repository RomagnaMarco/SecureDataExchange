
import { useState, useEffect } from "react";

/**
 * Custom hook to decode a JWT token and retrieve its payload.
 * 
 * @param {string} token - The JWT token to be decoded.
 * @returns {object|null} - The decoded payload of the token or null if decoding fails.
 */
const useDecodedToken = (token) => {
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    if (!token) {
      setDecodedToken(null);
      return;
    }

    // Extract payload from JWT token
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    // Parse payload to JSON and set state
    setDecodedToken(JSON.parse(jsonPayload));
  }, [token]);

  return decodedToken;
};

export default useDecodedToken;

