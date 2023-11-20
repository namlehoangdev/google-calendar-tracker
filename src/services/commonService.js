import { createSlice } from '@reduxjs/toolkit';
import { TIME_ZONE } from '../config';
import { getCurrentTimeISO8601 } from '../utils';


const initialState = {
    currentTimeISO8601: getCurrentTimeISO8601()
};

const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        triggerUpdateTime(state, action) {
            state.currentTimeISO8601 = action.payload;
            state.timeZone = TIME_ZONE
        },

    },
});

const { triggerUpdateTime } = commonSlice.actions;
const reducer = commonSlice.reducer;
export {
    triggerUpdateTime, reducer
} 
