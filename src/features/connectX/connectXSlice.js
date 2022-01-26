import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDatabase, ref, set, push } from "firebase/database";
import '../../base';
import { loadSessionItems } from '../../localStorage';
import { compareGameState, readGameState } from './connectXAPI';

const initialState = {
  history: [{
    slots: Array(42).fill(0),
    boardFlip: 0,
  }],
  turnAction: {number:0, type:0},
  stepNumber: 0,
  gameSettings: {
    width: 7,
    height: 6,
    scoreTarget: 4
  },
  asyncStatus: '',
  currentSign: 'X',
  players: null,
  gravityState: true,
  transitions: {slots:0, board:0, status:0},
  animations: 0,
  movesHistory: {show: true, sortIsAsc:false},
};

const actionsPerTurn = 2;

export const updateStateAsync = createAsyncThunk(
  'connectX/compareGameState',
  async (turnData) => {
    const response = await compareGameState(turnData);
    return response;
  }
);

export const setGameStateAsync = createAsyncThunk(
  'connectX/readGameState',
  async (isInit, thunkAPI) => {
    const response = await readGameState(isInit);
    let players = response.players;
    if (isInit) {
      if (selectPlayers(thunkAPI.getState())) {
        return;
      } else {
        if (!players) players = [];
      }     
    } else {
      const playerCount = Object.keys(players).length;

      if (playerCount === 1) {
        set(ref(getDatabase(), '/gameSettings/'), selectGameSettings(thunkAPI.getState()));
        set(ref(getDatabase(), '/gameIsOn/'), false);
      } else if (playerCount === 2) {
        if (response.gameIsOn) {
          thunkAPI.dispatch(sendGameSettings(response.gameSettings));
        } else {
          thunkAPI.dispatch(reset(true));
        }
      }
      if (playerCount > 2) {
        thunkAPI.dispatch(removePlayers());
        thunkAPI.dispatch(requestGame(loadSessionItems()));
        players = [];
      } 
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
      const slotValue = state.currentSign;

      slots[slotIndex] = slotValue;

      const turnAction = state.turnAction;
      const startOfTurn = !turnAction.type;
      if (startOfTurn) stepNumber++;
      state.stepNumber = stepNumber;

      const isEndTurn = turnAction.number + 1 === actionsPerTurn;
      const gravIsOff = !state.gravityState;
      if (gravIsOff) {
        const width = state.gameSettings.width,
            height = state.gameSettings.height;
        const isFloating = current.boardFlip % 2 === 0 ? slots[slotIndex + width] === 0 : slots[slotIndex + height] === 0;
        if (isFloating) {
          let animations = state.animations ? state.animations.slice() : Array(width * height).fill(0);
          animations[slotIndex] = 'floating';      
          state.animations = animations;
        }

        state.transitions.slots = 0;
        state.transitions.board = 0;
        if (isEndTurn) {
          // state.turnAction = {number:0, type:0};
          state.turnAction.number = 0;
          state.currentSign = slotValue === 'X' ? 'O' : 'X';
        } else {
          state.turnAction.number += 1;
          state.turnAction.type = 1;
        }
      } else {
        state.turnAction.number += 1;
        state.turnAction.type = 1;
      }
      // We add the current board to the history, and assign the stepNumber based on the new history
      history = history.slice(0, stepNumber);      
      state.history = history.concat([{slots: slots, boardFlip: current.boardFlip}]);
      
      const players = state.players;
      if (players && players.length === 2) state.turnAction.action = true;

      // if (state.players && state.players.length === 2) {
      //   console.log("set db fillSlot");
      //   const db = getDatabase();
      //   let baseRef = ref(db, '/stepNumber/');
      //   if (startOfTurn) {
      //     set(baseRef, stepNumber);
      //   }
      //   if (gravIsOff) {
      //     baseRef = ref(db, `/history/${stepNumber}`);
      //     set(baseRef, {slots: slots, boardFlip: current.boardFlip});
      //     if (isEndTurn) {
      //       baseRef = ref(db, '/currentSign/');
      //       set(baseRef, state.currentSign);        
      //     }
      //     baseRef = ref(db, '/turnAction/');
      //     set(baseRef, state.turnAction.number);
      //     baseRef = ref(db, '/transitions/');
      //     set(baseRef, {slots:0, board:0});        
      //   }
      // }
    },

    gravity: (state, action) => {
      const slotIndex = action.payload.slotIndex;
      const singleSlotMode = typeof slotIndex === 'undefined' ? false : true;

      // We get the slots of the currently displayed move
      let stepNumber = state.stepNumber;  
      let history = state.history.slice(0, stepNumber + 1);
      const current = history[stepNumber];
      const slots = current.slots.slice();

      const isAction = action.payload.toggle;
      let gravityState = state.gravityState;
      const turnAction = state.turnAction;
      let isEndTurn;
        console.log("isAction", isAction)
      if (isAction) {
        console.log("gravityState", gravityState)
        gravityState = gravityState ? false : true;
        const players = state.players;
        if (players && players.length === 2) state.turnAction.action = true;        
        isEndTurn = turnAction.number + 1 === actionsPerTurn;
      } else {
        isEndTurn = turnAction.number === actionsPerTurn;
        console.log("isEndTurn",isEndTurn);
      }

      const noEditMode = action.payload.noEdit;
      if (gravityState || noEditMode) {
        state.animations = 0;
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
        var animations = transitions.slice();
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
                  if (noEditMode) {
                    animations[index] = 'floating';
                  } else {
                    // If the destination is free, we switch the values
                    // (l) provides the height indication for the animation
                    slots[targetIndex] = slots[index];
                    slots[index] = 0;
                    transitions[targetIndex] = l;
                  }
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

      const startOfTurn = !turnAction.type;
      if (noEditMode) {
        state.animations = animations;
      } else {
        if (startOfTurn) stepNumber++;
        state.stepNumber = stepNumber;
        if (isEndTurn) {
          // state.turnAction = {number:0, type:0, action:turnAction.action};
          state.turnAction = {number:0, type:turnAction.type, action:turnAction.action};     
          state.currentSign = state.currentSign === 'X' ? 'O' : 'X';        
          state.transitions.status = 1;       
        } else {
          state.turnAction.number = isAction ? turnAction.number + 1 : turnAction.number;
          state.turnAction.type = isAction ? 2 : turnAction.type;
        }

        history = history.slice(0, stepNumber);
        state.history = history.concat([{slots: slots, boardFlip: current.boardFlip}]);
        state.gravityState = gravityState;
        // We check if there is any slotScore > 0 so we dont expect a transition callback when there isn't
        const hasTransitions = transitions && transitions.filter(el => {return el !== 0;}).length > 0 ? true : false;
        // If the toggle was called with a click, we clear the board transition,
        // if the gravity is turned off, we clear the slots transitions
        state.transitions.slots = gravityState ? hasTransitions ? transitions : 0 : 0;
        state.transitions.board = isAction ? 0 : turnAction.type !== 3 ? 0 : state.transitions.board;       
        // state.transitions = {slots: gravityState ? hasTransitions ? transitions : 0 : 0, board: isAction ? 0 : turnAction.type !== 3 ? 0 : state.transitions.board};
      }


      // if (state.players && state.players.length === 2) {  
      //   console.log("set db toggleGravity"); 
      //   const db = getDatabase();    
      //   let baseRef = ref(db, '/gravityState/');
      //   if (isAction) {
      //     set(baseRef, gravityState);
      //   }
      //   if (!noEditMode) {
      //     baseRef = ref(db, `/history/${stepNumber}`);
      //     set(baseRef, {slots: slots, boardFlip: current.boardFlip});
      //     if (startOfTurn) {
      //       baseRef = ref(db, '/stepNumber/');
      //       set(baseRef, stepNumber);
      //     }
      //     if (isEndTurn) {
      //       baseRef = ref(db, '/currentSign/');
      //       set(baseRef, state.currentSign);
      //     }          
      //     baseRef = ref(db, '/turnAction/');
      //     set(baseRef, state.turnAction.number);
      //     baseRef = ref(db, '/transitions/');
      //     set(baseRef, state.transitions);
      //   } else {
      //     baseRef = ref(db, '/animations/');
      //     set(baseRef, state.animations);
      //   }
      // }  
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
      const startOfTurn = !turnAction.type;
      if (startOfTurn) stepNumber++;        
      state.stepNumber = stepNumber;
      
      const isEndTurn = turnAction.number + 1 === actionsPerTurn;
      const gravIsOff = !state.gravityState;

      if (isEndTurn && gravIsOff) {
        // state.turnAction = {number:0, type:0};
        state.turnAction.number = 0;
        state.currentSign = state.currentSign === 'X' ? 'O' : 'X';
        state.transitions.status = 1;          
      } else {
        state.turnAction.number += 1;
      }
      state.turnAction.type = 3;

      history = history.slice(0, stepNumber);
      state.history = history.concat([{slots: newSlots, boardFlip: boardFlip}]);

      state.transitions.slots = 0;
      state.transitions.board = flipValue * -90;
      // state.transitions = {slots: 0, board: flipValue * -90};

      const players = state.players;
      if (players && players.length === 2) state.turnAction.action = true;

      // if (state.players && state.players.length === 2) {
      //   console.log("set db flipBoard");
      //   const db = getDatabase();
      //   let baseRef = ref(db, '/stepNumber/');
      //   if (startOfTurn) {
      //     set(baseRef, stepNumber);
      //   }
      //   if (gravIsOff) {
      //     baseRef = ref(db, `/history/${stepNumber}`);
      //     set(baseRef, {slots: slots, boardFlip: current.boardFlip});
      //     if (isEndTurn) {
      //       baseRef = ref(db, '/currentSign/');
      //       set(baseRef, state.currentSign);        
      //     }
      //     baseRef = ref(db, '/turnAction/');
      //     set(baseRef, state.turnAction.number);
      //     baseRef = ref(db, '/transitions/');
      //     set(baseRef, state.transitions);        
      //   }
      // } 
    },

    endTurn: (state) => {
      // const turnAction = {number:0, type:0, action:true};
      state.turnAction = {number:0, type:4, action:true};
      state.currentSign = state.currentSign === 'X' ? 'O' : 'X';
      state.transitions = {slots:0, board:0, status:1};
      // if (state.players && state.players.length === 2) {
      //   console.log("set db endTurn");
      //   const db = getDatabase();
      //   let baseRef = ref(db, '/turnAction/');
      //   set(baseRef, turnAction.number);
      //   baseRef = ref(db, '/currentSign/');
      //   set(baseRef, state.currentSign);
      //   baseRef = ref(db, '/transitions/');
      //   set(baseRef, {slots:0, board:0});
      // }
    },

    changeStep: (state, action) => {
      state.stepNumber = action.payload;
      state.currentSign = state.stepNumber % 2 === 0 ? 'X' : 'O';      
      state.turnAction = {number:0, type:0};          
      state.transitions = {slots:0, board:0, status:0};
    },

    toggleSort: (state) => {
      state.movesHistory.sortIsAsc = state.movesHistory.sortIsAsc ? false : true;
      state.transitions = {slots:0, board:0, status:0};
    },

    toggleHistory: (state) => {
      state.movesHistory.show = state.movesHistory.show ? false : true;
      state.transitions = {slots:0, board:0, status:0};
    },

    setGameSettings: (state, action) => {
      const settings = action.payload;
      state.gameSettings = settings;
      state.history = [{
        slots: Array(settings.width * settings.height).fill(0),
        boardFlip: 0
      }];
    },

    setAsyncStatus: (state, action) => {
      state.asyncStatus = action.payload;
    },

    reset: (state, action) => {
      const isDbReset = action.payload;
      const history = state.history.slice(0,1);
      history[0].boardFlip = 0;      
      if (isDbReset) {
        const db = getDatabase();
        let baseRef = ref(db, '/stepNumber/');
        set(baseRef, 0);
        baseRef = ref(db, '/gameSettings/');
        set(baseRef, state.gameSettings);        
        baseRef = ref(db, '/history/');
        set(baseRef, history);   
        baseRef = ref(db, '/turnAction/');
        set(baseRef, 0);        
        baseRef = ref(db, '/currentSign/');
        set(baseRef, 'X');      
        baseRef = ref(db, '/transitions/');
        set(baseRef, {slots:0, board:0});
        baseRef = ref(db, '/gravityState/');
        set(baseRef, true);
        baseRef = ref(db, '/gameIsOn/');
        set(baseRef, true);        
      }
      state.stepNumber = 0;
      state.history = history;
      state.currentSign = 'X';      
      state.turnAction = {number:0, type:0};      
      state.transitions = {slots:0, board:0, status:0};
      state.gravityState = true;
    },

    removePlayers: (state) => {
      // As this is called on window.onunload, we only have time for one API call to be made
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

        if (data === 0) {
          window.alert('Your opponent left! Reload the page to exit the current game');
          state.players = null;
          state.asyncStatus = '';
        } else {
          state.history = data.history;
          state.stepNumber = data.stepNumber;
          const transitions = data.transitions;
          state.transitions.slots = transitions.slots;
          state.transitions.board = transitions.board;
          // state.transitions = {slots: transitions.slots, board: transitions.board};
          state.gravityState = data.gravityState;
          const turnAction = data.turnAction;
          state.turnAction.number = turnAction === actionsPerTurn ? 0 : turnAction;
          state.asyncStatus = state.currentSign === data.currentSign ? 'watching' : '';
          state.currentSign = data.currentSign;
        }
      })
      .addCase(setGameStateAsync.pending, (state) => {
        console.log("setGameStateAsync pending");
      })      
      .addCase(setGameStateAsync.fulfilled, (state, action) => {
        const players = action.payload;
        console.log("setGameStateAsync",players);
        if (players) {
          const playersRefs = Object.keys(players);
          const playersCount = playersRefs.length; 
          console.log('playersCount',playersCount);
          if(!playersCount || !state.players) {
            console.log("setGameStateAsync []");
            state.players = [];
            // window.alert('There was an issue, please try again!');          
          } 

          if (playersCount) {
            let statePlayers = state.players;
            const statePlayersCount = statePlayers.length;
            console.log('statePlayersCount',statePlayersCount);
            if (!statePlayersCount || playersCount === 2) {
              const signs = ['O', 'X'];

              if (statePlayersCount === 1) statePlayers = [];
              for (let i in playersRefs) {
                statePlayers = statePlayers.concat({player: players[playersRefs[i]], sign: signs[i]});
                console.log('statePlayers',statePlayers);
                state.players = statePlayers;
              }
              state.transitions = {slots:0, board:0, status:0};
            }  
          }
        }
      });
  }  
});

export const {
  fillSlot,
  changeStep,
  toggleSort,
  toggleHistory,
  gravity,
  flipBoardState,
  endTurn,
  setAsyncStatus,
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
export const selectMovesHistory = (state) => state.connectX.movesHistory;
export const selectGravityState = (state) => state.connectX.gravityState;
export const selectCurrentSign = (state) => state.connectX.currentSign;
export const selectPlayers = (state) => state.connectX.players;
export const selectAsyncStatus = (state) => state.connectX.asyncStatus;
export const selectTurnAction = (state) => state.connectX.turnAction;
export const selectTransitions = (state) => state.connectX.transitions;
export const selectAnimations = (state) => state.connectX.animations;


export const playSlot = (slotIndex) => (dispatch, getState) => {
  const stepNumber = selectStepNumber(getState());
  const history = selectHistory(getState()).slice(0, stepNumber + 1);
  const current = history[stepNumber];    
  const slots = current.slots.slice();
  const gravityState = selectGravityState(getState());
  // Can't play a slot if it has already been played
  if (slots[slotIndex]) return; 

  const data = {stepNumber, history, current, slots, slotIndex, gravityState};
  dispatch(fillSlot(data));

  if(gravityState) {
    dispatch(gravity({toggle:false, slotIndex}));
  }
};

export const flipBoard = (direction) => (dispatch, getState) => {
  dispatch(flipBoardState(direction));
  dispatch(gravity({toggle:false, noEdit: !selectGravityState(getState())}));
};

export const jumpTo = (stepNumber) => (dispatch, getState) => {
  if (selectPlayers(getState()).length < 2) { 
    dispatch(changeStep(stepNumber));
    // if(selectGravityState(getState())) {
    //   dispatch(toggleGravity({toggle:false}));
    // }
  }
};

export const sendGameSettings = (settings) => (dispatch) => {
  dispatch(reset());
  dispatch(setGameSettings(settings));
};

// CALL TO ASYNC
export const initPlayers = () => (dispatch) => {
  dispatch(setGameStateAsync(true));
};

export const requestGame = (playerInfos) => (dispatch, getState) => {
  console.log(playerInfos);

  set(push(ref(getDatabase(), 'players')), {
    pseudo: playerInfos.pseudo,
    stamp: playerInfos.stamp
  })
  .then(() => {
    if (!selectPlayers(getState()).length)
    dispatch(setGameStateAsync(false));
    const watchTimer = setInterval(() => {
      if (selectPlayers(getState()).length < 2) {
        dispatch(setGameStateAsync(false));
      } else {
        clearInterval(watchTimer);
      }
    }, 4000);
  })
  .catch((error) => {
    // The write failed...
  });
};

export const watchGame = (mySign) => (dispatch, getState) => {

  // Genius move
  if (selectAsyncStatus(getState()) !== 'watching') {

    const watchTimer = setInterval(() => {
      const turnData = {turnAction: selectTurnAction(getState()).number, stepNumber: selectStepNumber(getState())};
      // console.log("selectPlayers(getState())",selectPlayers(getState()).length === 2);
      if (mySign === selectCurrentSign(getState()) || selectPlayers(getState()).length !== 2) {
        clearInterval(watchTimer);
      } else {
        dispatch(updateStateAsync(turnData));
      }    
    }, 4000);
  }

  dispatch(setAsyncStatus('watching'));
};    

export default connectXSlice.reducer;
