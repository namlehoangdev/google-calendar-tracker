import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiCalendar from '../apiCalendar';
import { TIME_ZONE } from '../config';


const loadAllEventsInCalendar = createAsyncThunk('event/loadAllEventsInCalendar', async (calendarId, queryOptions = {}) => {
  try {
    let pageToken = null;
    let sortedByStartTimeIds = [];
    let events = {};
 
    do {
      const response = await apiCalendar.listEvents({
        singleEvents: true,
        pageToken: pageToken,
        ...queryOptions,
        timeZone: TIME_ZONE
      }, calendarId);

      console.log("EventService loadAllEventsInCalendar response: ", response);

      if (response && response.result && response.result.items) {
        response.result.items.forEach(item => {
          if (events[item.id]) {
            events[item.id] = {
              ...events[item.id],
              ...item,
            }
          } else {
            events[item.id] = item;
            sortedByStartTimeIds = sortedByStartTimeIds.concat(item.id);
          }
        })

        pageToken = response.result.nextPageToken;
      } else {
        pageToken = null;
      }
    } while (pageToken != null && pageToken != undefined && pageToken != '');
 
    // Sort the events by start time
    sortedByStartTimeIds.sort((a, b) => {
      const startTimeA = new Date(events[a].start.dateTime);
      const startTimeB = new Date(events[b].start.dateTime);
      return startTimeA - startTimeB;
    });
 
    return { calendarId, sortedByStartTimeIds, events }
  } catch (error) {
    console.log("EventService.loadAllEventsInCalendar", error);
    throw error;
  }
});

const eventSlice = createSlice({
  name: 'event',
  initialState: {
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadAllEventsInCalendar.fulfilled, (state, action) => {
      const { calendarId, sortedByStartTimeIds, events } = action.payload;
      
      state[calendarId] = {
        calendarId,
        sortedByStartTimeIds,
        events
      }
    });
  },
});

const reducer = eventSlice.reducer;
export { loadAllEventsInCalendar, reducer };
