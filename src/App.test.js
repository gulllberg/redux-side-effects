import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';
import { sideEffects } from './features/counter/counterSlice';

test('Clicking button increments counter via side effects', function () {
    store.subscribe(function () {
        sideEffects({
            ...store,
            fetch: function (url, callback) {
                // Turn the async fetch to sync in test
                callback();
            },
        });
    });

    const { getByTestId } = render(
        <Provider store={store}>
            <App/>
        </Provider>
    );

    expect(getByTestId("sideEffectsCounter").innerHTML).toEqual("0");

    getByTestId("sideEffectsButton").click();

    expect(getByTestId("sideEffectsCounter").innerHTML).toEqual("1");
});
