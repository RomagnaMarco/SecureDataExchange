/**
 * Custom hook to retrieve the user's ID from local storage.
 * This should only be used when the user is logged in. If used otherwise, 
 * unexpected behaviors might occur, indicating a significant problem.
 * 
 * @returns {string|null} - The retrieved user ID or null if not found.
 */
export const useGetUserID = () => {
    return window.localStorage.getItem("userID");
}
