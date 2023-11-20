import { configureStore } from '@reduxjs/toolkit';
import { reducer as authReducer } from './services/authService';
import { reducer as calendarReducer } from './services/calendarsService';
import { reducer as eventReducer } from './services/eventsService';
import { reducer as commonReducer } from './services/commonService';


const store = configureStore({
  reducer: {
    auth: authReducer,
    calendar: calendarReducer,
    event: eventReducer,
    common: commonReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;