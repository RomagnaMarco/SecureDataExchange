
import { useState, useEffect } from 'react';

/**
 * Custom hook to format a given date string to a specific format.
 * 
 * @param {string} dateString - The raw date string to be formatted.
 * @returns {string} - The formatted date string.
 */
const useFormatDate = (dateString) => {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        // Convert the input dateString into a JavaScript Date object.
        const date = new Date(dateString);
        
        // Format the Date object to a specific format.
        const formatted = date.toLocaleString('en-US', {
            timeZone: 'America/Los_Angeles',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });

        // Update the state with the newly formatted date.
        setFormattedDate(formatted);
    }, [dateString]);

    return formattedDate;
}

export default useFormatDate;
