import { createSlice } from '@reduxjs/toolkit';

export const usersSlice = createSlice({
    name : 'loaders',
    initialState: {
        user:null,
    },

    reducers :
    {
        SetUser:(state, action) => {
            state.user = action.payload;
        },
    }
});

export const {SetUser} = usersSlice.actions;

//this is for showing loading process until api is fetched





