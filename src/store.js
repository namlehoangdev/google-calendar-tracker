import { configureStore } from '@reduxjs/toolkit';
import {reducer as authReducer} from './services/authService';
import {reducer as calendarReducer} from './services/calendarsService';
import {reducer as eventReducer} from './services/eventsService';

const store = configureStore({
  reducer: {
    auth: authReducer,
    calendar: calendarReducer,
    event: eventReducer
  },
});

export default store;