import BaseApiCalendar from 'react-google-calendar-api';


const ApiCalendar = new BaseApiCalendar({
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_KEY,
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    scope: "https://www.googleapis.com/auth/calendar",
    discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    ],
})

export { ApiCalendar }