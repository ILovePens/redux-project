import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDatabase, ref, set, push, remove } from "firebase/database";
import '../../base';
import { compareGameState,  readPlayers} from './connectXAPI';

const initialState = {
  history: [{
    slots: Array(42).fill(0),
    boardFlip: 0,
  }],
  stepNumber: 0,
  gameSettings: {
    width: 7,
    height: 6,
    scoreTarget: 4 
  },
  nextPlayer: 'X',
  sortIsAsc: true,
  gravIsOn: true,
  transitions: {slots:0, board:0},
  players: [],
  turnAction: {number:0, action:0},
};

const actionsPerTurn = 2;

export const updateStateAsync = createAsyncThunk(
  'connectX/compareGameState',
  async (stepNumber) => {
    const response = await compareGameState(stepNumber);
    return response;
  }
);

export const requestGameAsync = createAsyncThunk(
  'connectX/readPlayers',
  async (arg, thunkAPI) => {
    const response = await readPlayers();
    const players = response.players;
    // console.log("thunkAPI",thunkAPI);
    if (Object.keys(players).length >= 2) {
      if (response.gameIsOn) {
        thunkAPI.dispatch(reset(false));
      } else {
        thunkAPI.dispatch(reset(true));
      }
    }
    return response;
  }
);

export const connectXSlice = createSlice({
  name: 'connectX',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    fillSlot: (state, action) => {
      // We ensure the erasure of any "future" steps if the game is resumed from a history move
      let stepNumber = state.stepNumber;
      let history = state.history.slice(0, stepNumber + 1);
      const current = history[stepNumber];    
      const slots = current.slots.slice();
      let slotIndex = action.payload;
      // Can't play a slot if it has already been played
      if (slots[slotIndex]) return;

      // Make slotValue the right value depending on stepNumber and turnAction
      const slotValue = state.nextPlayer;
      // console.log(turnAction.action, slotValue);

      if(state.gravIsOn) {
        let width = state.gameSettings.width,
            height = state.gameSettings.height;
        if (current.boardFlip % 2 !== 0) {
          width = state.gameSettings.height;
          height = state.gameSettings.width;
        }

        var transitions = Array(width * height).fill(0);

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
            if(!slots[i]) {
              slotIndex = i;
              break;
            }
            slotScore--;
          }
          // We fill the appropriate slot with the value and the height it will travel during animation
          slots[slotIndex] = slotValue;
          if (slotScore) {
            transitions[slotIndex] = slotScore;
          } else {
            transitions = null;
          }
        }
      }

      // Or we simply put in the value if it hasn't already
      if(!slots[slotIndex]) slots[slotIndex] = slotValue;

      const turnAction = state.turnAction;
      if (!turnAction.action) stepNumber++;
      state.stepNumber = stepNumber;

      const isEndTurn = turnAction.number + 1 === actionsPerTurn;
      console.log("isEndTurn fillSlot", isEndTurn);
      if (isEndTurn) {
        state.turnAction = {number:0, action:0};
        state.nextPlayer = slotValue === 'X' ? 'O' : 'X';
      } else {
        state.turnAction.number += 1;
        state.turnAction.action = 1;
      }

      // We add the current board to the history, and assign the stepNumber based on the new history
      history = history.slice(0, stepNumber);      
      state.history = history.concat([{slots: slots, boardFlip: current.boardFlip}]);

      state.transitions = transitions && transitions.find(e => e !== 0) !== -1 ? {slots: transitions, board: 0} : {slots:0, board:0};;
      if (state.players.length === 2) {
        console.log("set db handleClick");
        const db = getDatabase();
        let baseRef = ref(db, `/history/${stepNumber}`);
        set(baseRef, {slots: slots, boardFlip: current.boardFlip});
        if (isEndTurn) {
          baseRef = ref(db, '/stepNumber/');
          set(baseRef, stepNumber);
          baseRef = ref(db, '/nextPlayer/');
          set(baseRef, state.nextPlayer);        
        }
        baseRef = ref(db, '/turnAction/');
        set(baseRef, state.turnAction.number);
        baseRef = ref(db, '/transitions/');
        set(baseRef, state.transitions);
      }
    },

    changeStep: (state, action) => {
      state.stepNumber = action.payload;
      state.transitions = {slots:0, board:0};
    },

    toggleSort: (state) => {
      state.sortIsAsc = state.sortIsAsc ? false : true;
      state.transitions = {slots:0, board:0};
    },

    toggleGravity: (state, action) => {
      const launchedWithClick = action.payload;
      const turnAction = state.turnAction;

      let isEndTurn;
      if (launchedWithClick) {
        state.gravIsOn = state.gravIsOn ? false : true;
        isEndTurn = turnAction.number + 1 === actionsPerTurn;
      } else {
        isEndTurn = turnAction.number === actionsPerTurn
      }
      console.log("isEndTurn toggleGravity", isEndTurn);
      // We get the slots of the currently displayed move
      let stepNumber = state.stepNumber;
      let history = state.history.slice(0, stepNumber + 1);
      const current = history[stepNumber];
      const slots = current.slots.slice();  

      const gravIsOn = state.gravIsOn;

      if (gravIsOn) {
        let width = state.gameSettings.width;
        const height = state.gameSettings.height;
        if (current.boardFlip % 2 !== 0) width = height;

        var transitions = Array(width * height).fill(0);
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
              if(slots[index] && !slots[targetIndex]) {
                // If the slot is filled and the destination is free, we switch the values
                // (l) provides the height indication for the animation
                slots[targetIndex] = slots[index];
                slots[index] = 0;
                transitions[targetIndex] = l;
                break;
              }
            }
          }
          count++;
        }
      }

      if (!turnAction.action) stepNumber++;
      state.stepNumber = stepNumber;
      if (isEndTurn) {
        console.log("gravity",!turnAction.action);
        state.turnAction = {number:0, action:0};
        state.nextPlayer = state.nextPlayer === 'X' ? 'O' : 'X';        
      } else {
        state.turnAction.number = launchedWithClick ? turnAction.number + 1 : turnAction.number;
        state.turnAction.action = launchedWithClick ? 2 : turnAction.action;
      }

      history = history.slice(0, stepNumber);
      state.history = history.concat([{slots: slots, boardFlip: current.boardFlip}]);
      // If the toggle was called with a click, we clear the board transition,
      // if the gravity is turned off, we clear the slots transitions
      state.transitions = {slots: gravIsOn ? transitions : 0, board: launchedWithClick ? 0 : state.transitions.board};

      if (state.players.length === 2) {  
        console.log("set db toggleGravity"); 
        const db = getDatabase();      
        let baseRef = ref(db, '/gravIsOn/');
        set(baseRef, gravIsOn);
        baseRef = ref(db, `/history/${stepNumber}`);
        set(baseRef, {slots: slots, boardFlip: current.boardFlip});
        if (isEndTurn) {
          baseRef = ref(db, '/stepNumber/');
          set(baseRef, stepNumber);
          baseRef = ref(db, '/nextPlayer/');
          set(baseRef, state.nextPlayer);
        }          
        baseRef = ref(db, '/turnAction/');
        set(baseRef, state.turnAction.number);
        baseRef = ref(db, '/transitions/');
        set(baseRef, state.transitions);
      }  
    },

    flipBoardState: (state, action) => {
      // Modify the way the values are placed inside the slots and replace the current history move with it

      // We get the slots of the currently displayed move
      let stepNumber = state.stepNumber;      
      let history = state.history.slice(0, stepNumber + 1);
      const current = history[stepNumber];
      const slots = current.slots.slice();

      // We deduce the future flip state of the board with the payload (1 ou -1)
      const flipValue = action.payload;
      let boardFlip = current.boardFlip + flipValue;
      if (boardFlip === -1) boardFlip = 3;
      if (boardFlip === 4) boardFlip = 0;

      // Adjust the board params to that flip state to iterate through properly through the future board
      let width = state.gameSettings.width,
          height = state.gameSettings.height;
      if (current.boardFlip % 2 !== 0) {
        width = state.gameSettings.height;
        height = state.gameSettings.width;
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

      const turnAction = state.turnAction;
      const isEndTurn = turnAction.number + 1 === actionsPerTurn;
      console.log("isEndTurn flipBoard", isEndTurn);
      const gravIsOff = !state.gravIsOn;
      if (!turnAction.action) stepNumber++;        
      state.stepNumber = stepNumber;
      if (isEndTurn && gravIsOff) {
        state.turnAction = {number:0, action:0};
        state.nextPlayer = state.nextPlayer === 'X' ? 'O' : 'X';        
      } else {
        state.turnAction.number += 1;
        state.turnAction.action = 3;
      }

      history = history.slice(0, stepNumber);
      state.history = history.concat([{slots: newSlots, boardFlip: boardFlip}]);
      state.transitions = {slots: 0, board: flipValue * -90};

      if (gravIsOff && state.players.length === 2) {
        console.log("set db flipBoard");
        const db = getDatabase();
        let baseRef = ref(db, `/history/${stepNumber}`);
        set(baseRef, {slots: newSlots, boardFlip: boardFlip});
        if (isEndTurn) {
          baseRef = ref(db, '/stepNumber/');
          set(baseRef, stepNumber);
          baseRef = ref(db, '/nextPlayer/');
          set(baseRef, state.nextPlayer);
        }          
        baseRef = ref(db, '/turnAction/');
        set(baseRef, state.turnAction.number);        
        baseRef = ref(db, '/transitions/');
        set(baseRef, state.transitions);
      } 
    },

    endTurn: (state) => {
      const turnAction = {number:0, action:0};
      state.turnAction = turnAction;
      state.nextPlayer = state.nextPlayer === 'X' ? 'O' : 'X';
      const transitions = {slots: 0, board: 0};
      state.transitions = transitions;
      if (state.players.length === 2) {
        console.log("set db endTurn");
        const db = getDatabase();
        let baseRef = ref(db, '/turnAction/');
        set(baseRef, turnAction);
        baseRef = ref(db, '/nextPlayer/');
        set(baseRef, state.nextPlayer);
        baseRef = ref(db, '/transitions/');
        set(baseRef, transitions);
      }
    },

    setGameSettings: (state, action) => {
      const settings = action.payload;
      state.gameSettings = settings;
      state.history = [{
        slots: Array(settings.width * settings.height).fill(0),
        boardFlip: 0
      }];
    },

    reset: (state, action) => {
      const isDbReset = action.payload;
      const history = state.history.slice(0,1);
      history[0].boardFlip = 0;
      const transitions = {slots:0, board:0};        
      if (isDbReset) {
        const db = getDatabase();
        let baseRef = ref(db, '/stepNumber/');
        set(baseRef, 0);
        baseRef = ref(db, '/history/');
        set(baseRef, history);      
        baseRef = ref(db, '/nextPlayer/');
        set(baseRef, 'X');      
        baseRef = ref(db, '/transitions/');
        set(baseRef, transitions);
        baseRef = ref(db, '/gravIsOn/');
        set(baseRef, true);
        baseRef = ref(db, '/gameIsOn/');
        set(baseRef, true);        
      }
      state.stepNumber = 0;
      state.history = history;
      state.nextPlayer = 'X';      
      state.transitions = transitions;
      state.gravIsOn = true;
    },

    endTwoPlayersGame: (state) => {
      const db = getDatabase();
      set(ref(db, 'gameIsOn'), false).then(() => {
        remove(ref(db, '/players/'));
      });
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(updateStateAsync.pending, (state) => {
        console.log("updateStateAsync pending");
      })
      .addCase(updateStateAsync.fulfilled, (state, action) => {
        const data = action.payload;
        console.log("updateStateAsync",data);

        if (data === null) {
          window.alert('Your opponent left! Reload the page to exit the current game');
          state.players = [];
        } else {
          state.history = data.history;
          state.stepNumber = data.stepNumber;
          const transitions = data.transitions;
          state.transitions = {slots: transitions.slots, board: transitions.board};
          state.gravIsOn = data.gravIsOn;
          const turnAction = data.turnAction;
          state.turnAction.number = turnAction === actionsPerTurn ? 0 : turnAction;
        }
      })
      .addCase(requestGameAsync.pending, (state) => {
        console.log("requestGameAsync pending");
      })      
      .addCase(requestGameAsync.fulfilled, (state, action) => {
        const data = action.payload;
        const players = data.players;
        console.log("requestGameAsync",players);
        const playersRefs = Object.keys(players);

        if(playersRefs.length === 1) {
          state.players = [{pseudo: players[playersRefs[0]].pseudo, sign: 'O'}];
          state.transitions = {slots:0, board:0};
        } else if (playersRefs.length >= 2) {
          const firstPlayer = state.players.slice();
          state.players = firstPlayer.concat([{pseudo: players[playersRefs[1]].pseudo, sign: 'X'}]);          
        }
      });
  }  
});

export const {
  fillSlot,
  changeStep,
  toggleSort,
  toggleGravity,
  flipBoardState,
  endTurn,
  setGameSettings,
  reset,
  endTwoPlayersGame,
} = connectXSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.connectX.value)`
export const selectHistory = (state) => state.connectX.history;
export const selectGameSettings = (state) => state.connectX.gameSettings;
export const selectStepNumber = (state) => state.connectX.stepNumber;
export const selectSortIsAsc = (state) => state.connectX.sortIsAsc;
export const selectGravityState = (state) => state.connectX.gravIsOn;
export const selectTransitions = (state) => state.connectX.transitions;
export const selectNextPlayer = (state) => state.connectX.nextPlayer;
export const selectPlayers = (state) => state.connectX.players;
export const selectTurnAction = (state) => state.connectX.turnAction;

export const jumpTo = (stepNumber) => (dispatch, getState) => {
  dispatch(changeStep(stepNumber));
  // When browsing the steps via the history, we want the game to get up to date if gravity is enabled,
  // thus replacing the move we went to
  // if(selectGravityState(getState())) {
  //   dispatch(toggleGravity(false));
  // }
};

export const flipBoard = (direction) => (dispatch, getState) => {
  dispatch(flipBoardState(direction));
  if(selectGravityState(getState())) {
    dispatch(toggleGravity(false));
  }
};

export const sendGameSettings = (settings) => (dispatch) => {
  dispatch(reset());
  dispatch(setGameSettings(settings));
};

export const requestGame = (pseudo) => (dispatch, getState) => {
  set(push(ref(getDatabase(), 'players')), {
    pseudo
  })
  .then(() => {
    dispatch(requestGameAsync());
    const watchTimer = setInterval(() => {
      if (selectPlayers(getState()).length) {
        dispatch(requestGameAsync());
      } else {
        clearInterval(watchTimer);
      }
    }, 4000);
  })
  .catch((error) => {
    // The write failed...
  });
};

export const watchGame = () => (dispatch, getState) => {
    const watchTimer = setInterval(() => {
      if (!selectPlayers(getState()).length) {
        dispatch(updateStateAsync(selectTurnAction(getState())));
      } else {
        clearInterval(watchTimer);
      }    
    }, 3500);
};  

export default connectXSlice.reducer;
