import {createSlice} from '@reduxjs/toolkit';

import type {CounterState} from '../../../types/auth';

const initialState: CounterState = {
    value: 0,
};

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state: CounterState) => {
            state.value += 1;
        },
        decrement: (state: CounterState) => {
            state.value -= 1;
        }
    }
});

export const {increment, decrement} = counterSlice.actions;
export default counterSlice.reducer;
