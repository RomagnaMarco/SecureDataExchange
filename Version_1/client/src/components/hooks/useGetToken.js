
/**
 * Custom hook to retrieve an authentication token from cookies.
 * Should only be used when the user is logged in. Otherwise, unexpected behaviors might occur.
 * 
 * @returns {string} - The retrieved authentication token.
 */
export const useGetToken = () => {

  // Fetch the token from the cookie.
  const token = getCookie('access_token');

  /**
   * Function to retrieve a cookie value by its name.
   * 
   * @param {string} name - The name of the cookie to be retrieved.
   * @returns {string|null} - The cookie value if found; otherwise, null.
   */
  function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
          const token = parts.pop().split(';').shift();
          return token.trim(); // Remove any leading/trailing whitespaces.
      }
      return null; // Return null if cookie is not found.
  }

  return token;
}
