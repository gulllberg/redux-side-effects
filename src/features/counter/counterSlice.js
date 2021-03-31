import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        value: 0,
        submitted: false,
        fetching: false,
    },
    reducers: {
        userSubmit: state => {
            state.submitted = true;
        },
        fetchingStarted: state => {
            state.fetching = true;
        },
        fetchingFinished: (state, action) => {
            // Receive other data via action payload
            state.fetching = false;
            state.submitted = false;
            state.value++;
        },
    },
});

export const { userSubmit, fetchingStarted, fetchingFinished } = counterSlice.actions;

export const selectCount = state => state.counter.value;
export const selectFetching = state => state.counter.fetching;

export function shouldFetch(state) {
    return state.counter.submitted && !state.counter.fetching;
}

export function sideEffects({ getState, dispatch, fetch }) {
    // Dependency inject things like fetch
    const state = getState();
    if (shouldFetch(state)) {
        // Change state to make sure side effect only fires once
        dispatch(fetchingStarted());

        // Do the side effect (in this example a fake fetch api that takes an url and a callback)
        fetch('someUrl', function () {
            // Dispatch, potentially with extra data in payload
            dispatch(fetchingFinished());
        });
    }
}

export default counterSlice.reducer;
