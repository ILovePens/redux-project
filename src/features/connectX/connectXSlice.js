import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { fetchCount } from './connectXAPI';

const initialState = {
  history: [{
    slots: Array(42).fill(null),
    boardFlip: 0,
  }],
  stepNumber: 0,
  gameSettings: {
    width: 7,
    height: 6,
    scoreTarget: 4 
  },
  sortIsAsc: true,
  gravIsOn: false,
  transitions: {},
};

export const connectXSlice = createSlice({
  name: 'connectX',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    syncBase: (state, action) => {
      const base = action.payload;

      // base.syncState('/history', {
      //   context: this,
      //   state: 'history'
      // });

      // base.syncState('/', {
      //   context: this,
      //   state: 'history'
      // });      
    },

    handleClick: (state, action) => {
      // We ensure the erasure of any "future" steps if the game is resumed from a history move
      const stepNumber = state.stepNumber;
      const history = state.history.slice(0, stepNumber + 1);
      const current = history[stepNumber];    
      const slots = current.slots.slice();
      let slotIndex = action.payload;
      // Can't play a slot if it has already been played
      if (slots[slotIndex]) return;

      if(state.gravIsOn) {
        if (current.boardFlip % 2 === 0) {
          var width = state.gameSettings.width,
              height = state.gameSettings.height;
        } else {
          var width = state.gameSettings.height,
              height = state.gameSettings.width;
        }

        var transitions = Array(width * height).fill(null);

        let slotScore = 0;
        // We start iterating at the second to last row
        for(let i = height - 1; i > 0; i--) {
          // We then determine the height the slot sits at by testing its index,
          // we make it a score that represents the distance that this slot can be potentially pushed down
          if(slotIndex >= (i - 1) * width && slotIndex <= i * width - 1) {
            slotScore = height - i;
            break;
          }
        }        

        if(slotScore) {
          // We iterate on the column the slot sits in and try to push it down, decreasing the score each time it fails
          for (let i = slotIndex + slotScore * width; i > slotIndex; i -= width) {
            if(slots[i] === null) {
              slotIndex = i;
              break;
            }
            slotScore--;
          }
          // We fill the appropriate slot with the value and the height it will travel during animation
          slots[slotIndex] = (state.stepNumber % 2) === 0 ?  'X' : 'O';
          if (slotScore) {
            transitions[slotIndex] = slotScore;
          } else {
            transitions = null;
          }
        }
      }

      // Or we simply put in the value if it hasn't already
      if(!slots[slotIndex]) slots[slotIndex] = (state.stepNumber % 2) === 0 ?  'X' : 'O';

      // We add the current board to the history, and assign the stepNumber based on the new history
      state.history = history.concat([{slots: slots, boardFlip: current.boardFlip}]);
      state.stepNumber = history.length;    
      state.transitions = {slots: transitions, board: null};
    },

    changeStep: (state, action) => {
      state.stepNumber = action.payload;
      state.transitions = {};
    },

    toggleSort: (state) => {
      state.sortIsAsc = state.sortIsAsc ? false : true;
      state.transitions = {};
    },

    toggleGravity: (state, action) => {
      const launchedWithClick = action.payload;
      if(launchedWithClick) {
        state.gravIsOn = state.gravIsOn ? false : true;
      }
      ///// USE TRANSFORM(,) FOR GRAVITY ////////
      if(state.gravIsOn) {
        // We get the slots of the currently displayed move
        const stepNumber = state.stepNumber;
        let history = state.history.slice(0, stepNumber + 1);
        const current = history[stepNumber];
        const slots = current.slots.slice();  

        let slotsChanged = false;

        let width = state.gameSettings.width;
        const height = state.gameSettings.height;
        let transitions = Array(width * height).fill(null);

        if (current.boardFlip % 2 !== 0) width = height;

        let count = 1;
        // We iterate through every rows, counting it (count), starting from the second to last one and going up
        for (let i = slots.length - width - 1; i >= 0; i -= width) {
          // We then iterate through each row, to get to each and every slot
          for (let j = 0; j < width; j++) {
            // We store (count) as a relative height we're at from the first row we go through,
            // giving us a score (l) of how many slots we'll try to "push down" the value of the slot.
            // If it fails, we loop and try to push it one slot shorter
            for (let l = count; l > 0; l--) {
              let index = i - j;
              let targetIndex = index + width * l;
              if(slots[index] && slots[targetIndex] === null) {
                // If the slot is filled and the destination is free, we switch the values
                // (l) provides the height indication for the animation
                slots[targetIndex] = slots[index];
                slots[index] = null;

                slotsChanged = true;
                transitions[targetIndex] = l;
                break;
              }
            }
          }
          count++;
        }
        // We only update the board if gravity brought change
        if(slotsChanged) { 
          history = history.slice(0, stepNumber);
          state.history = history.concat([{slots: slots, boardFlip: current.boardFlip}]);
          state.stepNumber = history.length;
          // If the gravity was turned on with a click, we clear the board transition
          state.transitions = {slots: transitions, board: launchedWithClick ? null : state.transitions.board};
        }
      } else {
        state.transitions = {};
      }
    },

    flipBoardState: (state, action) => {
      // Modify the way the values are placed inside the slots and replace the current history move with it

      // We get the slots of the currently displayed move
      const stepNumber = state.stepNumber;      
      let history = state.history.slice(0, stepNumber + 1);
      const current = history[stepNumber];
      const slots = current.slots.slice();

      // We deduce the future flip state of the board with the payload (1 ou -1)
      const flipValue = action.payload;
      let boardFlip = current.boardFlip + flipValue;
      if (boardFlip === -1) boardFlip = 3;
      if (boardFlip === 4) boardFlip = 0;

      // Adjust the board params to that flip state to iterate through properly through the future board
      if (boardFlip % 2 === 0) {
        var width = state.gameSettings.height,
            height = state.gameSettings.width;
      } else {
        var width = state.gameSettings.width,
            height = state.gameSettings.height;
      }

      let newSlots = slots.slice();
      let rowCount = height;
      // We iterate through every rows, counting it (count)
      for (let i = slots.length - 1; i >= 0; i -= width) {
        // We then iterate through each row, to get to each and every slot
        for (let j = 0; j < width; j++) {
          const index = i - j;
          // Here are the two formulaes corresponding to flipping the board clockwise and counter clockwise
          // They take the initial index of the slot as well as the number of the row it sits in (first row = 1) as parameters
          const newIndex = flipValue === 1 ? height * (index + 1 - (rowCount - 1) * width) - rowCount : height * (rowCount * width - 1 - index) + rowCount - 1;
          newSlots[newIndex] = slots[index];
        }
        rowCount--;
      }

      history = history.slice(0, stepNumber);
      state.history = history.concat([{slots: newSlots, boardFlip: boardFlip}]);
      state.stepNumber = history.length;
      state.transitions = {slots: null, board: flipValue * -90};
    },

    setGameSettings: (state, action) => {
      state.gameSettings = action.payload;
      state.history = [{
        slots: Array(action.payload.width * action.payload.height).fill(null),
        boardFlip: 0
      }];
    },

    reset: (state) => {
      state.history = state.history.slice(0,1);
      state.stepNumber = 0;
      state.transitions = {};
      state.sortIsAsc = true;
      state.gravIsOn = false;
    }
  },
});

export const { handleClick, changeStep, toggleSort, toggleGravity, flipBoardState, setGameSettings, syncBase, reset} = connectXSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.connectX.value)`
export const selectHistory = (state) => state.connectX.history;
export const selectGameSettings = (state) => state.connectX.gameSettings;
export const selectStepNumber = (state) => state.connectX.stepNumber;
export const selectSortIsAsc = (state) => state.connectX.sortIsAsc;
export const selectGravityState = (state) => state.connectX.gravIsOn;
export const selectTransitions = (state) => state.connectX.transitions;

export const jumpTo = (stepNumber) => (dispatch, getState) => {
  dispatch(changeStep(stepNumber));
  // When browsing the steps via the history, we want the game to get up to date if gravity is enabled,
  // thus replacing the move we went to
  if(selectGravityState(getState())) {
    dispatch(toggleGravity(false));
  }
};

export const flipBoard = (direction) => (dispatch, getState) => {
  dispatch(flipBoardState(direction));
  // When browsing the steps via the history, we want the game to get up to date if gravity is enabled,
  // thus replacing the move we went to
  if(selectGravityState(getState())) {
    dispatch(toggleGravity(false));
  }
};

export const sendGameSettings = (settings) => (dispatch) => {
  dispatch(reset());
  dispatch(setGameSettings(settings));
};

export default connectXSlice.reducer;
