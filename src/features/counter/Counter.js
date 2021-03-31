import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    userSubmit,
    selectCount,
    selectFetching,
} from './counterSlice';
import styles from './Counter.module.css';

export function Counter() {
    const count = useSelector(selectCount);
    const fetching = useSelector(selectFetching);
    const dispatch = useDispatch();

    return (
        <div>
            <div className={styles.row}>
        <span
            data-testid="sideEffectsCounter"
            className={styles.value}
        >
          {count}
        </span>
            </div>
            <div className={styles.row}>
                <button
                    data-testid="sideEffectsButton"
                    className={styles.button}
                    // Dispatch a simple action (just sets a state value), free from side effects
                    onClick={() => dispatch(userSubmit())}
                    // No need to for example disable the button. User can click as many times as they want, the side effect does not happen again while already fetching.
                >
                    {/* Update component according to current state (in this case if fetching) */}
                    {`Add With Side Effects${fetching ? ' - fetching' : ''}`}
                </button>
            </div>
        </div>
    );
}
