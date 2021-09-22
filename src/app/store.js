import {
	configureStore,
	combineReducers,
	getDefaultMiddleware
} from '@reduxjs/toolkit';

import navReducer from '../features/nav/navSlice';
import counterReducer from '../features/counter/counterSlice';
import tictactoeReducer from '../features/tictactoe/tictactoeSlice';
import connectXReducer from '../features/connectX/connectXSlice';

const combinedReducer = combineReducers({
  nav: navReducer,
  counter: counterReducer,
  tictactoe: tictactoeReducer,
  connectX: connectXReducer,
});

const rootReducer = (state, action) => {
// Reducers are supposed to return the initial state when they are called
// with undefined as the first argument, no matter the action
  if (action.type === 'nav/reset') {
    state = undefined;
  }
  return combinedReducer(state, action);
};

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false
});

export default configureStore({
  reducer: rootReducer,
  middleware: [...customizedMiddleware]
});