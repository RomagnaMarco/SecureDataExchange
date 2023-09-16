//only should be used when logged in. Otherwise something will fail and things have gone terribly wrong
export const useGetUserID = () => {
    return window.localStorage.getItem("userID")
}