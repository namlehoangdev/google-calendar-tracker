import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { triggerUpdateTime } from './commonService';
import apiCalendar from '../apiCalendar';
import { OFF_FLAG, TIME_ZONE } from '../config';


const loadAllEventsInCalendar = createAsyncThunk('event/loadAllEventsInCalendar',
  async ({ calendarId, queryOptions = {} }, { rejectWithValue, getState }) => {
    try {
      let pageToken = null;
      let sortedByStartTimeIds = [];
      let events = {};

      const { currentTimeISO8601 } = getState().common || {};

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
      return { calendarId, sortedByStartTimeIds, events, currentTimeISO8601 }
    } catch (error) {
      console.log("EventService.loadAllEventsInCalendar", error);
      return rejectWithValue(error.response.data);
    }
  });

function updateEventIds(events, sortedByStartTimeIds, givenTime) {
  const currentTime = new Date(givenTime);


  let happeningIds = [];
  let upcomingIds = [];
  let pastIds = [];

  let pastOff = 0;
  let upcomingOff = 0;
  let happeningOff = 0;

  sortedByStartTimeIds.forEach(eventId => {
    const event = events[eventId];

    const eventStartTime = new Date(event.start.dateTime);
    const eventEndTime = new Date(event.end.dateTime);
    const isOff = event.summary.startsWith(OFF_FLAG);


    if (currentTime < eventStartTime) {
      // Event is in the future
      upcomingIds.push(eventId);
      isOff && upcomingOff++;
    } else if (currentTime >= eventStartTime && currentTime <= eventEndTime) {
      // Event is happening now
      happeningIds.push(eventId);
      isOff && happeningOff++;
    } else {
      // Event is in the past
      pastIds.push(eventId);
      isOff && pastOff++;
    }
  });

  return { happeningIds, upcomingIds, pastIds, pastOff, happeningOff, upcomingOff };

}

const eventSlice = createSlice({
  name: 'event',
  initialState: {
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAllEventsInCalendar.fulfilled, (state, action) => {
        const { calendarId, sortedByStartTimeIds, events, currentTimeISO8601 } = action.payload || {};
        const eventIdGroups = updateEventIds(events, sortedByStartTimeIds, currentTimeISO8601) || {};

        state[calendarId] = {
          calendarId,
          sortedByStartTimeIds,
          events,
          ...eventIdGroups,
          isLoading: false
        }

      })
      .addCase(loadAllEventsInCalendar.rejected, (state, action) => {
        const calendarId = action?.meta?.arg?.calendarId;
        if (calendarId && state[calendarId]) {
          state[calendarId].isLoading = false;
        }
      })
      .addCase(loadAllEventsInCalendar.pending, (state, action) => {
        const calendarId = action?.meta?.arg?.calendarId;
        if (calendarId) {
          if (state[calendarId]) {
            console.log('here:', true);
            state[calendarId].isLoading = true;
          } else {
            console.log('here2:', true);
            state[calendarId] = { isLoading: true }
          }
        }
      })

      .addCase(triggerUpdateTime, (state, action) => {

        if (!state) {
          return;
        }

        const currentTimeISO8601 = action.payload;
        for (let calendarId of Object.keys(state)) {
          const { sortedByStartTimeIds, events } = state[calendarId];
          const { happeningIds, upcomingIds, pastIds, pastOff, happeningOff, upcomingOff } = updateEventIds(events, sortedByStartTimeIds, currentTimeISO8601) || {};
          state[calendarId].happeningIds = happeningIds;
          state[calendarId].upcomingIds = upcomingIds;
          state[calendarId].pastIds = pastIds;

          state[calendarId].passOff = pastOff;
          state[calendarId].happeningOff = happeningOff;
          state[calendarId].upcomingOff = upcomingOff;

        }
      })
  }
});

const reducer = eventSlice.reducer;
export { loadAllEventsInCalendar, reducer };



