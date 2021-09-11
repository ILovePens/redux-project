import {
	configureStore,
	combineReducers,
	getDefaultMiddleware
} from '@reduxjs/toolkit';
// import { connectRouter, routerMiddleware } from "connected-react-router";

import navReducer from '../features/nav/navSlice';
import counterReducer from '../features/counter/counterSlice';
import tictactoeReducer from '../features/tictactoe/tictactoeSlice';
import connectXReducer from '../features/connectX/connectXSlice';

import history from '../history';
// export const store = configureStore({
//   reducer: {
//     counter: counterReducer,
//     tictactoe: tictactoeReducer,
//   },
// });

const combinedReducer = combineReducers({
  nav: navReducer,
  counter: counterReducer,
  tictactoe: tictactoeReducer,
  connectX: connectXReducer,
});

// const rootReducer = (history: history) => ({
//     router: connectRouter(history)
// })

// export default configureStore({
//   reducer: rootReducer(history),
//   middleware: [routerMiddleware(history), ...getDefaultMiddleware()]
// });

const rootReducer = (state, action) => {
// Reducers are supposed to return the initial state when they are called
// with undefined as the first argument, no matter the action
  if (action.type === 'nav/reset') {
    state = undefined;
  }
  return combinedReducer(state, action);
};

export default configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware()]
});
