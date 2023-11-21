
import { TIME_ZONE } from './config';
import moment from 'moment-timezone';


function getCurrentTimeISO8601() {
    const currentTime = moment().tz(TIME_ZONE).format();
    return currentTime;
}

function convertToISOWithTimeZone(customFormat) {
    return customFormat && customFormat.substring(0, 16);
}

function getBeautyTimeISO8601(dateTime) {
    return dateTime && dateTime.substring(0, 16).replace('T', ' ');
}

function getDiffs(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffInMilliseconds = d2 - d1;

    const diffYears = d2.getUTCFullYear() - d1.getUTCFullYear();
    const diffMonths = d2.getUTCMonth() - d1.getUTCMonth();
    const monthDiff = diffYears * 12 + diffMonths;

    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    const weekDiff = Math.floor(diffInMilliseconds / millisecondsPerWeek);

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const dayDiff = Math.floor(diffInMilliseconds / millisecondsPerDay);


    return { monthDiff, weekDiff, dayDiff };
}

const monthNamesShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function simpleShortDays(dateTime) {
    if (!dateTime) {
        return "--"
    }
    const date = new Date(dateTime);

    const month = monthNamesShort[date.getUTCMonth()]; // Months are zero-based, so adding 1 to get the correct month
    const day = date.getUTCDate();
    let year = date.getUTCFullYear().toString();

    return `${day} ${month}`
}



function parseDateTime(dateTime) {
    if (!dateTime) {
        return { time: "--:--", dateString: "--/--/--" };
    }

    const { dateTime: input, isConverted } = dateTime;


    const time = isConverted ? "--:--" : input.substring(11, 16);
    const date = input.substring(8, 10);
    const month = input.substring(5, 7);
    const year = input.substring(0, 4);

    const dateString = `${date}/${month}/${year}`;

    return { time, dateString };
}




export { getCurrentTimeISO8601, convertToISOWithTimeZone, getBeautyTimeISO8601, getDiffs, simpleShortDays, parseDateTime };

