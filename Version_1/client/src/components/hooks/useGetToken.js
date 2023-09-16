
//only should be used when logged in. Otherwise something will fail and things have gone terribly wrong
export const useGetToken = () => {
    
    // Fetch the token from the cookie
    const token = getCookie('access_token');

    // Function to get a cookie by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const token = parts.pop().split(';').shift();
      return token.trim(); //remove leading/trailing whitespaces
    }
  }

    //returns token to be decoded
    return token;
}