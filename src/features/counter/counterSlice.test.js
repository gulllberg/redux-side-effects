import reducer, {
    userSubmit,
    fetchingStarted,
    fetchingFinished,
    selectCount,
    selectFetching,
    shouldFetch,
    sideEffects,
} from './counterSlice';

describe('counterSlice', function () {
   test('increment via fetch', function () {
       let counterState = reducer(undefined, {});
       expect(selectCount({ counter: counterState })).toEqual(0);
       expect(selectFetching({ counter: counterState })).toBeFalsy();
       expect(shouldFetch({ counter: counterState })).toBeFalsy();

       counterState = reducer(counterState, userSubmit());
       expect(selectCount({ counter: counterState })).toEqual(0);
       expect(selectFetching({ counter: counterState })).toBeFalsy();
       expect(shouldFetch({ counter: counterState })).toBeTruthy();

       counterState = reducer(counterState, fetchingStarted());
       expect(selectCount({ counter: counterState })).toEqual(0);
       expect(selectFetching({ counter: counterState })).toBeTruthy();
       expect(shouldFetch({ counter: counterState })).toBeFalsy();

       counterState = reducer(counterState, fetchingFinished());
       expect(selectCount({ counter: counterState })).toEqual(1);
       expect(selectFetching({ counter: counterState })).toBeFalsy();
       expect(shouldFetch({ counter: counterState })).toBeFalsy();
   });

    test('user submit while fetching does nothing', function () {
        let counterState = reducer(undefined, {});
        counterState = reducer(counterState, userSubmit());
        counterState = reducer(counterState, fetchingStarted());
        expect(selectCount({ counter: counterState })).toEqual(0);
        expect(selectFetching({ counter: counterState })).toBeTruthy();
        expect(shouldFetch({ counter: counterState })).toBeFalsy();

        counterState = reducer(counterState, userSubmit());
        expect(selectCount({ counter: counterState })).toEqual(0);
        expect(selectFetching({ counter: counterState })).toBeTruthy();
        expect(shouldFetch({ counter: counterState })).toBeFalsy();

        counterState = reducer(counterState, fetchingFinished());
        expect(selectCount({ counter: counterState })).toEqual(1);
        expect(selectFetching({ counter: counterState })).toBeFalsy();
        expect(shouldFetch({ counter: counterState })).toBeFalsy();
    });

   test('sideEffects', function () {
        function fetchMock(url, callback) {
            // Turn the async fetch to sync in test
            callback();
        }
        let actions = [];
        function dispatch(action) {
            actions.push(action);
        }
        let state = {
            counter: {
                value: 0,
                submitted: false,
                fetching: false,
            }
        };
        function getState() {
            return state;
        }

        sideEffects({ getState, dispatch, fetch: fetchMock });
        expect(actions.length).toEqual(0);

        state = {
            counter: {
                value: 0,
                submitted: true,
                fetching: false,
            }
        };
       sideEffects({ getState, dispatch, fetch: fetchMock });
       expect(actions.length).toEqual(2);
       expect(actions[0].type).toEqual('counter/fetchingStarted');
       expect(actions[1].type).toEqual('counter/fetchingFinished');

       actions = [];
       state = {
           counter: {
               value: 0,
               submitted: true,
               fetching: true,
           }
       };
       sideEffects({ getState, dispatch, fetch: fetchMock });
       expect(actions.length).toEqual(0);
   });
});
