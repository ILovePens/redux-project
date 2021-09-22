import { createSlice } from '@reduxjs/toolkit';
// import { fetchCount } from './tictactoeAPI';

const initialState = {
  // Shared states
  history: [{
    squares: Array(9).fill(null),
  }],
  winSquares: [], 

  // Game only states
  xIsNext: true,
  stepNumber: 0,
  sortIsAsc: true,
};

export const tictactoeSlice = createSlice({
  name: 'tictactoe',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    handleClick: (state, action) => {
      const history = state.history.slice(0, state.stepNumber + 1);
      // We ensure the erasure of any "future" steps if the game is resumed from a history move
      const current = history[history.length - 1];    
      const squares = current.squares.slice();

      if (state.winSquares.length || squares[action.payload] ) {
        return; // Can't play a square if there's a winner or if it has already been played
      }
      // We alternate players, add the current board to the history, and assign the stepNumber based on the new history
      squares[action.payload] = state.xIsNext ? 'X' : 'O';

      state.history = history.concat([{squares: squares}]);
      state.stepNumber = history.length;      
      state.xIsNext = !state.xIsNext      
    },

    jumpTo: (state, action) => {
      state.stepNumber = action.payload;
      state.xIsNext = (action.payload % 2) === 0;
    },

    toggleSort: (state) => {
      state.sortIsAsc = state.sortIsAsc ? false : true;
    },

    reset: (state) => {
      state.history = [{squares: Array(9).fill(null)}];
      state.stepNumber = 0;
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(incrementAsync.pending, (state) => {
  //       state.status = 'loading';
  //     })
  //     .addCase(incrementAsync.fulfilled, (state, action) => {
  //       state.status = 'idle';
  //       state.value += action.payload;
  //     });
  // },
});

export const { handleClick, jumpTo, toggleSort, reset } = tictactoeSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.tictactoe.value)`
export const selectHistory = (state) => state.tictactoe.history;
export const selectStepNumber = (state) => state.tictactoe.stepNumber;
export const selectXIsNext = (state) => state.tictactoe.xIsNext;
export const selectSortIsAsc = (state) => state.tictactoe.sortIsAsc;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd = (amount) => (dispatch, getState) => {
//   const currentValue = selectCount(getState());
//   if (currentValue % 2 === 1) {
//     dispatch(incrementByAmount(amount));
//   }
// };

export default tictactoeSlice.reducer;
