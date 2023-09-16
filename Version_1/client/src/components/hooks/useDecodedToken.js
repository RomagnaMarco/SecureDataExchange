// hooks/useDecodedToken.js
import { useState, useEffect } from "react";

const useDecodedToken = (token) => {
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    if (!token) {
      setDecodedToken(null);
      return;
    }

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

    setDecodedToken(JSON.parse(jsonPayload));
  }, [token]);

  return decodedToken;
};

export default useDecodedToken;
