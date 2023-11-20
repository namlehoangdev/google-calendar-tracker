import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiCalendar from '../apiCalendar';


const loadCalendars = createAsyncThunk('calendar/loadCalendars', async () => {
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

    return { calendarIds, calendars };

  } catch (error) {
    console.log("CalendarService.loadCalendars error", error);
    throw error;
  }
});

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    calendarIds: [],
    calendars: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadCalendars.fulfilled, (state, action) => {
      state.calendarIds = action.payload.calendarIds;
      state.calendars = action.payload.calendars;
    });
  },
});

const reducer = calendarSlice.reducer;
export { loadCalendars, reducer };