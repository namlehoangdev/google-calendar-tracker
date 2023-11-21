import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadAllEventsInCalendar } from './eventsService';
import apiCalendar from '../apiCalendar';


const loadCalendars = createAsyncThunk('calendar/loadCalendars', async (params, { dispatch }) => {
  try {
    let calendarIds = [];
    let calendars = {};
    let pageToken = null;

    do {
      const response = await apiCalendar.listCalendars();
      console.log("CalendarService.loadCalendars", response);

      if (response && response.result && response.result.items) {

        response.result.items.forEach((item) => {
          if (calendars[item.id]) {
            calendars[item.id] = {
              ...calendars[item.id],
              ...item,
            }
          } else {
            calendars[item.id] = item;
            calendarIds = calendarIds.concat(item.id);
          }
        });
      }
    } while (pageToken != null && pageToken != undefined && pageToken != '');

    // Sort calendarIds array by selected field
    calendarIds.sort((a, b) => {
      const calendarA = calendars[a];
      const calendarB = calendars[b];

      if (calendarA.selected && !calendarB.selected) {
        return -1;
      } else if (!calendarA.selected && calendarB.selected) {
        return 1;
      } else {
        return 0;
      }
    });

    for (let calendarId of calendarIds) {
      dispatch(loadAllEventsInCalendar({ calendarId }));
    }
    return { calendarIds, calendars };

  } catch (error) {
    console.log("CalendarService.loadCalendars error", error);
    throw error;
  }
});

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    isLoading: false,
    error: null,
    calendarIds: [],
    calendars: {},
  },
  reducers: {
    reducers: {
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCalendars.fulfilled, (state, action) => {
        state.calendarIds = action.payload.calendarIds;
        state.calendars = action.payload.calendars;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loadCalendars.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(loadCalendars.rejected, (state, action) => {
        state.isLoading = false;
        state.error = {};
      })

  },
});

const reducer = calendarSlice.reducer;
export { loadCalendars, reducer };


