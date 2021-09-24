import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDatabase, ref, set, push, remove } from "firebase/database";
import '../../base';
import { loadState } from '../../localStorage';
import { compareGameState,  readGamePlayers, readPlayers} from './connectXAPI';

const initialState = {
  history: [{
    slots: Array(42).fill(0),
    boardFlip: 0,
  }],
  turnAction: {number:0, action:0},
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
};

const actionsPerTurn = 2;

export const initPlayersAsync = createAsyncThunk(
  'connectX/readPlayers',
  async (arg, thunkAPI) => {
    let response = await readPlayers();
    if (!response) response = [];
    const playerCount = Object.keys(response).length;    
    if (playerCount > 2) {
      thunkAPI.dispatch(removePlayers());
      thunkAPI.dispatch(requestGame(loadState()));
      response = [];
    }
    return response;
  }
);

export const updateStateAsync = createAsyncThunk(
  'connectX/compareGameState',
  async (stepNumber) => {
    const response = await compareGameState(stepNumber);
    return response;
  }
);

export const requestGameAsync = createAsyncThunk(
  'connectX/readGamePlayers',
  async (arg, thunkAPI) => {
    const response = await readGamePlayers();
    let players = response.players;
    const playerCount = Object.keys(players).length;

    if (playerCount === 1) {
      set(ref(getDatabase(), '/gameIsOn/'), false);  
    } else if (playerCount === 2) {
      if (response.gameIsOn) {
        thunkAPI.dispatch(reset(false));
      } else {
        thunkAPI.dispatch(reset(true));
      }
    }
    if (playerCount > 2) {
      thunkAPI.dispatch(removePlayers());
      thunkAPI.dispatch(requestGame(loadState()));
      players = [];
    } 
    return players;
  }
);

export const connectXSlice = createSlice({
  name: 'connectX',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    fillSlot: (state, action) => {
      // We ensure the erasure of any "future" steps if the game is resumed from a history move
      const data = action.payload;
      let stepNumber = data.stepNumber;
      let history = data.history;
      const current = data.current;
      const slots = data.slots;
      const slotIndex = data.slotIndex;
      const slotValue = state.nextPlayer;

      slots[slotIndex] = slotValue;

      const turnAction = state.turnAction;
      if (!turnAction.action) stepNumber++;
      state.stepNumber = stepNumber;

      const isEndTurn = turnAction.number + 1 === actionsPerTurn;
      const gravIsOff = !state.gravIsOn;
      if (isEndTurn && gravIsOff) {
        state.turnAction = {number:0, action:0};
        state.nextPlayer = slotValue === 'X' ? 'O' : 'X';
      } else {
        state.turnAction.number += 1;
        state.turnAction.action = 1;
      }
    // state.transitions = transitions && transitions.find(e => e !== 0) !== -1 ? {slots: transitions, board: 0} : {slots:0, board:0};
      // We add the current board to the history, and assign the stepNumber based on the new history
      history = history.slice(0, stepNumber);      
      state.history = history.concat([{slots: slots, boardFlip: current.boardFlip}]);
      if (gravIsOff) state.transitions = {slots:0, board:0};
      if (state.players && state.players.length === 2 && gravIsOff) {
        console.log("set db fillSlot");
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

    toggleGravity: (state, action) => {
      const slotIndex = action.payload.slotIndex;
      const singleSlotMode = typeof slotIndex === 'undefined' ? false : true;

      // We get the slots of the currently displayed move
      let stepNumber = state.stepNumber;  
      let history = state.history.slice(0, stepNumber + 1);
      const current = history[stepNumber];
      const slots = current.slots.slice();

      const isAction = action.payload.toggle;
      const turnAction = state.turnAction;
      let isEndTurn;
      if (isAction) {
        state.gravIsOn = state.gravIsOn ? false : true;
        isEndTurn = turnAction.number + 1 === actionsPerTurn;
      } else {
        isEndTurn = turnAction.number === actionsPerTurn
      }
      const gravIsOn = state.gravIsOn;

      if (gravIsOn) {
        let width = state.gameSettings.width,
            height = state.gameSettings.height;
        if (current.boardFlip % 2 !== 0) {
          width = state.gameSettings.height;
          height = state.gameSettings.width;
        }

        let count = 1; 
        if (singleSlotMode) {
          var slotScore = 0;
          // We start iterating at the second to last row
          for(let i = height - 1; i > 0; i--) {
            // We then determine the height the slot sits at by testing its index,
            // we make it a score that represents the distance that this slot can be potentially pushed down
            if(slotIndex >= (i - 1) * width && slotIndex <= i * width - 1) {
              slotScore = height - i;
              break;
            }
          }        
          count = slotScore;
        }
        var transitions = Array(width * height).fill(0);
        // We iterate through every rows, counting it (count), starting from the second to last one and going up
        for (let i = slots.length - 1 - count * width; i >= 0; i -= width) {
          // We then iterate through each row, to get to each and every slot
          for (let j = 0; j < width; j++) {
            // We store (count) as a relative height we're at from the first row we go through,
            // giving us a score (l) of how many slots we'll try to "push down" the value of the slot.
            // If it fails, we loop and try to push it one slot shorter
            let index = i - j;
            if (slots[index] && (!singleSlotMode || slotIndex === index)) {
              for (let l = count; l > 0; l--) {
                const targetIndex = index + width * l;
                if(!slots[targetIndex]) {
                  // If the slot is filled and the destination is free, we switch the values
                  // (l) provides the height indication for the animation
                  slots[targetIndex] = slots[index];
                  slots[index] = 0;
                  transitions[targetIndex] = l;
                  break;
                }
              }
              if (slotIndex === index) break;
            }
          }
          if (singleSlotMode) break;
          count++;
        }
      }

      if (!turnAction.action) stepNumber++;
      state.stepNumber = stepNumber;
      if (isEndTurn) {
        state.turnAction = {number:0, action:0};
        state.nextPlayer = state.nextPlayer === 'X' ? 'O' : 'X';        
      } else {
        state.turnAction.number = isAction ? turnAction.number + 1 : turnAction.number;
        state.turnAction.action = isAction ? 2 : turnAction.action;
      }

      history = history.slice(0, stepNumber);
      state.history = history.concat([{slots: slots, boardFlip: current.boardFlip}]);

      // We check if there is any slotScore > 0 so we dont expect a transition callback when there isn't
      const hasTransitions = transitions && transitions.filter(el => {return el !== 0;}).length > 0 ? true : false;
      // If the toggle was called with a click, we clear the board transition,
      // if the gravity is turned off, we clear the slots transitions
      state.transitions = {slots: gravIsOn ? hasTransitions ? transitions : 0 : 0, board: isAction ? 0 : turnAction.action !== 3 ? 0 : state.transitions.board};
      if (state.players && state.players.length === 2) {  
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
      if (!turnAction.action) stepNumber++;        
      state.stepNumber = stepNumber;
      
      const isEndTurn = turnAction.number + 1 === actionsPerTurn;
      const gravIsOff = !state.gravIsOn;

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

      if (state.players && state.players.length === 2 && gravIsOff) {
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
      if (state.players && state.players.length === 2) {
        console.log("set db endTurn");
        const db = getDatabase();
        let baseRef = ref(db, '/turnAction/');
        set(baseRef, turnAction.number);
        baseRef = ref(db, '/nextPlayer/');
        set(baseRef, state.nextPlayer);
        baseRef = ref(db, '/transitions/');
        set(baseRef, transitions);
      }
    },

    changeStep: (state, action) => {
      state.stepNumber = action.payload;
      state.nextPlayer = state.stepNumber % 2 === 0 ? 'X' : 'O';      
      state.turnAction = {number:0, action:0};          
      state.transitions = {slots:0, board:0};
    },

    toggleSort: (state) => {
      state.sortIsAsc = state.sortIsAsc ? false : true;
      state.transitions = {slots:0, board:0};
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
        baseRef = ref(db, '/turnAction/');
        set(baseRef, 0);        
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
      state.turnAction = {number:0, action:0};      
      state.transitions = transitions;
      state.gravIsOn = true;
    },

    removePlayers: (state) => {
      // As this is called on window.onunload, we only have time for one call to be made
      const db = getDatabase();
      set(ref(db, '/players/'),0);
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
        const players = action.payload;
        console.log("requestGameAsync",players);
        const playersRefs = Object.keys(players);

        if(playersRefs.length === 0) {
          // state.players = [];
          // window.alert('There was an issue, please try again!');          
        } else if(playersRefs.length === 1) {  
          state.players = [{pseudo: players[playersRefs[0]].pseudo, sign: 'O'}];
          state.transitions = {slots:0, board:0};
        } else if (playersRefs.length === 2) {
          state.players = [{pseudo: players[playersRefs[0]].pseudo, sign: 'O'},
                           {pseudo: players[playersRefs[1]].pseudo, sign: 'X'}];          
        }
      })
      .addCase(initPlayersAsync.pending, (state) => {
        console.log("initPlayersAsync pending");
      })      
      .addCase(initPlayersAsync.fulfilled, (state, action) => {
        const players = action.payload;
        console.log("initPlayersAsync",players);
        const playersRefs = Object.keys(players);

        if(playersRefs.length === 0) {
          state.players = null;     
        } else if(playersRefs.length === 1) {  
          state.players = [{pseudo: players[playersRefs[0]].pseudo, sign: 'O'}];
        } else if (playersRefs.length === 2) {
          state.players = [{pseudo: players[playersRefs[0]].pseudo, sign: 'O'},
                           {pseudo: players[playersRefs[1]].pseudo, sign: 'X'}];          
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
  removePlayers,
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


export const playSlot = (slotIndex) => (dispatch, getState) => {
  const stepNumber = selectStepNumber(getState());
  const history = selectHistory(getState()).slice(0, stepNumber + 1);
  const current = history[stepNumber];    
  const slots = current.slots.slice();
  const gravIsOn = selectGravityState(getState());
  // Can't play a slot if it has already been played
  if (slots[slotIndex]) return; 

  const data = {stepNumber, history, current, slots, slotIndex, gravIsOn};
  dispatch(fillSlot(data));

  if(gravIsOn) {
    dispatch(toggleGravity({toggle:false, slotIndex}));
  }
};

export const flipBoard = (direction) => (dispatch, getState) => {
  dispatch(flipBoardState(direction));
  if(selectGravityState(getState())) {
    dispatch(toggleGravity({toggle:false}));
  }
};

export const jumpTo = (stepNumber) => (dispatch, getState) => {
  if (selectPlayers(getState()).length < 2) { 
    dispatch(changeStep(stepNumber));
    if(selectGravityState(getState())) {
      dispatch(toggleGravity({toggle:false}));
    }
  }
};

export const sendGameSettings = (settings) => (dispatch) => {
  dispatch(reset());
  dispatch(setGameSettings(settings));
};

// CALL TO ASYNC
export const initPlayers = (players) => (dispatch) => {
  console.log("hey call to async",players)
  if (players) {
    dispatch(initPlayersAsync());
  }
};

export const requestGame = (pseudo) => (dispatch, getState) => {
  set(push(ref(getDatabase(), 'players')), {
    pseudo
  })
  .then(() => {
    dispatch(requestGameAsync());
    const watchTimer = setInterval(() => {
      if (selectPlayers(getState()).length < 2) {
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
      if (selectPlayers(getState()).length === 2) {
        dispatch(updateStateAsync(selectTurnAction(getState()).number));
      } else {
        clearInterval(watchTimer);
      }    
    }, 4000);
};    

export default connectXSlice.reducer;
