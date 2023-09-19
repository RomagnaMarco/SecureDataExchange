
import { useState, useEffect } from 'react';

const useFormatDate = (dateString) => {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        const date = new Date(dateString);
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
        setFormattedDate(formatted);
    }, [dateString]);

    return formattedDate;
}

export default useFormatDate;
