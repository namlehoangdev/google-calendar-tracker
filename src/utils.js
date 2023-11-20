
import { DateTime } from 'luxon';
import { TIME_ZONE } from './config';
import moment from 'moment-timezone';

window.nam = moment;

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

function getMonthDiff(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const diffYears = d2.getUTCFullYear() - d1.getUTCFullYear();
    const diffMonths = d2.getUTCMonth() - d1.getUTCMonth();

    return diffYears * 12 + diffMonths;
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

    return `${day} ${month}`
}




export { getCurrentTimeISO8601, convertToISOWithTimeZone, getBeautyTimeISO8601, getMonthDiff, simpleShortDays };

