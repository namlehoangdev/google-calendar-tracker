import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    authInfo: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            state.authInfo = action.payload;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.authInfo = null;
        },
    },
});

const { login, logout } = authSlice.actions;
const reducer = authSlice.reducer;
export {
    login, logout, reducer
} 
