# Redux Side Effects

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

Example of handling side effects when using Redux for state management.

To try it out yourself:

1. Clone the repo
1. Run ```npm i```
1. Run ```npm start```
1. Check it out on  ```http://localhost:3000/``` in your browser
1. Click the button to increase the counter (via side effects)

To run the tests:

1. Run ```npm i```
1. Run ```npm test``` 

## The example explained

Pretty much the bare bones create-react-app Redux template app, with some modifications (in the following files).

### Counter.js

Slimmed down from the Redux template version to only have one button. Get the counter value and fetching status from state. Clicking the button will dispatch a plain action.

### counterSlice.js

Two more state variables than the Redux template version, ```submitted``` and  ```fetching``` (the former symbolising that the user submitted a form and the latter that a service  is being fetched).

The userSubmit action, which is the one used by the Counter component, only changes a state variable (no side effects).

The magic instead happens in the ```sideEffects``` function. It runs after every action, checks the current state and only performs side effects when they should happen. The side effects dispatch plain actions that only change state.

### counterSlice.test.js

This is perhaps the money shot. Since all business logic is located in plain and simple Javascript functions it is very easy to test (with some dependency injection where needed). We can easily check our state after each dispatched action and make sure our "should" functions always answer correctly.

We can also easily check our sideEffects function (with dependency injection) and see that it dispatches the correct actions.

### index.js

This is where we set up the subscription to the store to make sure that potential side effects are checked after each action.

### App.test.js

If we want to we can also check that the application is wired correctly (and not just test the functions individually). We can easily make sure that clicking the button actually increments the counter (and use dependency injection to have synchronous component tests even when there is "fetching" involved).

## Motivation

None of the popular methods when looking up side effects handling in Redux were satisfactory. The following is highly subjective and based on my experiences of good (frontend) software architecture (state and side effects management).

**Must have**
1. Separation between components and state
1. Centralised state management
1. Data driven side effects (instead of imperative)
1. Testable

**Nice to have**
1. Tooling
1. Performance optimisation

Redux ticks all boxes except the one on side effects. This seems however to be mainly due to the way Redux is being used, and not Redux itself.

**Q:** What is an imperative side effect?  
**A:** A side effects that happens because of an action. E.g. Click button -> service fetched

**Q:** What is a data driven side effect?  
**A:** A separate system reads the application state and decides when side effects should happen. E.g. Click button -> modify application state -> side effect system reads state and performs side effect

**Q:** What is the difference between those two?  
**A:** In the imperative version the way you reached a state is important. In the data driven version only the current state matters (like a Markov process/chain in mathematics). The difference becomes more clear with more complex examples, such as sequential or duplicated events.

**Q:** Do you have such an example?  
**A:** A quite common practise in navigation systems is to navigate by pushing to history. If clicking a button means pushing to history you will have to make sure it is only clicked once. If instead the click sets a state "the user wants to navigate" the side effects system can then read this and make sure pushing to history only happens once, regardless of the number of times the user manages to click the button.

**Q:** Why not use thunks/sagas/observables/whatever?  
**A:** They are too imperative (side effects are tied to actions rather than state) and/or complicated.

**Q:** Checking for side effects in each render cycle (after each action) sounds bad for performance  
**A:** It is true that performing a side effect immediately on for example a button click has better performance than having a separate side effects systems that has to check the application state all the time. However, the side effect checks (basically just if/elses) are cheap in the grand scheme of things, and I have never seen any performance issues due to this method.

**Q:** This example seems complicated or has too much code  
**A:** With this pattern you can handle all possible side effects. You will learn quickly. Some extra code is a small price to pay for all the benefits.

### The benefits

#### Simple code / separation of concerns

Components (render functions) will only handle visualising the current state and have no hidden effects (pure).

By having all side effects collected in one place it is easy to coordinate them. No more spaghetti code!

#### Plain Javascript functions

No new concepts. No fuss. Can you write if/else statements? Good, then you can handle all possible side effects.

#### Testable

It is much easier to test plain functions over components. With all business logic in one place testing becomes easier. (Rather than having to test some special case hidden away in an onClick function somewhere.) When testing is easy it actually gets done. 

#### Speed over time

With everything neatly organised and separated you will maintain the same development speed over time. This is worth any initial slowdown due to setting up a more robust framework.

#### Open to change

Being open to change is important today with everybody working in agile ways. Now you don't want a side effect to happen in some certain case anymore? Just find the right function and change the logic slightly. Having a large test suite makes this safe.
