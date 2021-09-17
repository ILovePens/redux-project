import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDatabase, ref, set, push, get, remove, onValue} from "firebase/database";
// import base from '../../base';

import { readStepnumber,  readPlayers} from './connectXAPI';

const initialState = {
  history: [{
    slots: Array(42).fill('null'),
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
  transitions: {slots:0, board:0},
  twoPlayersMode: false,
  players: [],
};

export const updateGameAsync = createAsyncThunk(
  'connectX/readStepnumber',
  async (stepNumber) => {
    const response = await readStepnumber(stepNumber);
    console.log("response",response);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const requestGameAsync = createAsyncThunk(
  'connectX/readPlayers',
  async () => {
    const response = await readPlayers();
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

// export const loadGameAsync = createAsyncThunk(
//   'connectX/readPlayers',
//   async () => {
//     const response = await readPlayers();
//     // The value we return becomes the `fulfilled` action payload
//     return response;
//   }
// );

export const connectXSlice = createSlice({
  name: 'connectX',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Write syncState by hand with
    // Check for differences bewtween the state and the db, if there are, update the state with the db values
    // One function for initializing all the states, and one other, that watches history value for the two players mode
    writeData: (state, action) => {
      // const base = action.payload;
      // console.log("set history",state.history);
      // const rootRef = ref(getDatabase(), '/');
      // let dbHistory;
      // get(rootRef).then((snapshot) => {
      //   if (snapshot.exists()) {
      //     dbHistory = snapshot.val();
      //   } else {
      //     console.log("No data available");
      //   }
      // }).catch((error) => {
      //   console.error(error);
      // });

      // set(rootRef, {
      //   history: state.history
      // });

      // base.syncState('/', {
      //   context: this,
      //   state: 'history'
      // });      
    },
    loadData: (state) => {
      // const base = action.payload;
      console.log("loadData");
      // Check for differences between our local states and the database, update our states if there is
      // ===> all actions that modifies the game state for both players set a particular state (will serve as an indicator)
      // to false for the player initiating the changes, but true for the database
      // We will only watch this indicator state with onValue to call for an update of the state on the other
      // player computer
    // ======> the indicator state will be stepNumber, its a perfect reference for the watch value
    // It'll go along with the new next player determination system, which is that every action count 
    },

    handleClick: (state, action) => {
      // We ensure the erasure of any "future" steps if the game is resumed from a history move
      const stepNumber = state.stepNumber;
      const history = state.history.slice(0, stepNumber + 1);
      const current = history[stepNumber];    
      const slots = current.slots.slice();
      let slotIndex = action.payload;
      // Can't play a slot if it has already been played
      if (slots[slotIndex] !== 'null') return;

      if(state.gravIsOn) {
        if (current.boardFlip % 2 === 0) {
          var width = state.gameSettings.width,
              height = state.gameSettings.height;
        } else {
          var width = state.gameSettings.height,
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
            if(slots[i] === 'null') {
              console.log()
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
      if(slots[slotIndex] === 'null') slots[slotIndex] = (state.stepNumber % 2) === 0 ?  'X' : 'O';

      // We add the current board to the history, and assign the stepNumber based on the new history
      state.history = history.concat([{slots: slots, boardFlip: current.boardFlip}]);
      state.stepNumber = history.length;
      state.transitions = transitions && transitions.find(e => e !== 0) !== -1 ? {slots: transitions, board: 0} : {slots:0, board:0};;
      if (state.twoPlayersMode) {
        console.log("set db handleClick");
        const db = getDatabase();
        let baseRef = ref(db, '/history/');
        set(baseRef, state.history);      
        baseRef = ref(db, '/stepNumber/');
        set(baseRef, state.stepNumber);
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
      const istwoPlayersMode = state.twoPlayersMode;
      const db = getDatabase();      
      let baseRef = ref(db, '/gravIsOn/');
      if (launchedWithClick) {
        state.gravIsOn = state.gravIsOn ? false : true;
        set(baseRef, state.gravIsOn);              
      }
      ///// USE TRANSFORM(,) FOR GRAVITY ////////
      if (state.gravIsOn) {
        // We get the slots of the currently displayed move
        const stepNumber = state.stepNumber;
        let history = state.history.slice(0, stepNumber + 1);
        const current = history[stepNumber];
        const slots = current.slots.slice();  

        let slotsChanged = false;

        let width = state.gameSettings.width;
        const height = state.gameSettings.height;
        let transitions = Array(width * height).fill(0);

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
              if(slots[index] && slots[targetIndex] === 'null') {
                // If the slot is filled and the destination is free, we switch the values
                // (l) provides the height indication for the animation
                slots[targetIndex] = slots[index];
                slots[index] = 'null';

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
          state.transitions = {slots: transitions, board: launchedWithClick ? 0 : state.transitions.board};

          if (state.twoPlayersMode) {
            console.log("set db toggleGravity");
            baseRef = ref(db, '/history/');
            set(baseRef, state.history);
            baseRef = ref(db, '/stepNumber/');
            set(baseRef, state.stepNumber);
            baseRef = ref(db, '/transitions/');
            set(baseRef, state.transitions);
          } 
        }
      } else {
        if (istwoPlayersMode) set(ref(getDatabase(), '/transitions/'), {slots:0, board:0});
        state.transitions = {slots:0, board:0};
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
      state.transitions = {slots: 0, board: flipValue * -90};

      if (!state.gravIsOn && state.twoPlayersMode) {
        console.log("set db flipBoard");
        const db = getDatabase();
        let baseRef = ref(db, '/history/');
        set(baseRef, state.history);      
        baseRef = ref(db, '/stepNumber/');
        set(baseRef, state.stepNumber);
        baseRef = ref(db, '/transitions/');
        set(baseRef, state.transitions);
      } 
    },

    setGameSettings: (state, action) => {
      const settings = action.payload;
      state.gameSettings = settings;
      state.history = [{
        slots: Array(settings.width * settings.height).fill('null'),
        boardFlip: 0
      }];
    },

    reset: (state, action) => {
      const isDbReset = action.payload;
      if (isDbReset) {
        remove(ref(getDatabase(), '/players/'));
      } else {
        state.history = state.history.slice(0,1);
        state.stepNumber = 0;
        state.transitions = {slots:0, board:0};
        state.gravIsOn = false;
        state.sortIsAsc = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateGameAsync.pending, (state) => {
        // state.status = 'loading';
        console.log("updateGameAsync pending");
      })
      .addCase(updateGameAsync.fulfilled, (state, action) => {
        // state.status = 'idle';
        console.log("updateGameAsync");
        const data = action.payload;
        // if (state.twoPlayersMode && !data.players) {
        if (data === null) {
          window.alert('Your opponent left! Reload the page to exit the current game');
          state.twoPlayersMode = false;
          return;
        }

        state.history = data.history;
        state.stepNumber = data.stepNumber;
        const transitions = data.transitions;
        state.transitions = {slots:transitions.slots, board:transitions.board};
        state.gravIsOn = data.gravIsOn;
      })
      .addCase(requestGameAsync.pending, (state) => {
        console.log("requestGameAsync pending");
        return Object.assign({}, state, {
          propOne: true,
        })
      })      
      .addCase(requestGameAsync.fulfilled, (state, action) => {
        console.log("requestGameAsync");
        // state.status = 'idle';
        const players = action.payload;
        const playersRefs = Object.keys(players);
        // response = Array.from(response);
        // console.log("response",response);
        // console.log("response",response);        
        // console.log("fulfilled", Object.keys(action.payload));
        // console.log("fulfilled", Object.keys(players));
        // console.log("fulfilled", [...action.payload]);
        if(playersRefs.length === 1) {
          state.players = [{pseudo: players[playersRefs[0]].pseudo, sign: 'O'}];
          state.transitions = {slots:0, board:0};        
        } else if (playersRefs.length >= 2) {
          const test = players[playersRefs[0]];
          console.log(test);
          state.players = [{pseudo: players[playersRefs[0]].pseudo, sign: 'O'},{pseudo: players[playersRefs[1]].pseudo, sign: 'X'}];
          state.twoPlayersMode = true;

          const history = state.history.slice(0,1);
          state.history = history;
          state.stepNumber = 0;
          const transitions = {slots:0, board:0};
          state.transitions = transitions;
          state.gravIsOn = true;

          console.log("set db requestGame");
          const db = getDatabase();
          let baseRef = ref(db, '/history/');
          set(baseRef, history);      
          baseRef = ref(db, '/stepNumber/');
          set(baseRef, 0);
          baseRef = ref(db, '/transitions/');
          set(baseRef, transitions);
          baseRef = ref(db, '/gravIsOn/');
          set(baseRef, true);                   
        }
      });
  }  
});

export const { handleClick, changeStep, toggleSort, toggleGravity, flipBoardState, setGameSettings, syncBase, loadData, writeData, reset} = connectXSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.connectX.value)`
export const selectHistory = (state) => state.connectX.history;
export const selectGameSettings = (state) => state.connectX.gameSettings;
export const selectStepNumber = (state) => state.connectX.stepNumber;
export const selectSortIsAsc = (state) => state.connectX.sortIsAsc;
export const selectGravityState = (state) => state.connectX.gravIsOn;
export const selectTransitions = (state) => state.connectX.transitions;
export const selectPlayers = (state) => state.connectX.players;
export const selectTwoPlayersMode = (state) => state.connectX.twoPlayersMode;

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
  // const db = getDatabase();
  // const historyRef = ref(db, '/history');
  // historyRef.off();
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

export const requestGame = (pseudo) => (dispatch, getState) => {

  // Prevent double click from same player
  // ==> find a way to "deactivate" data changing game actions during the whole two player process
  // when it's not your turn
  // ===> conditionnally call any reducer using selectPlayers
  // ==> always write the player, even solo, in the db, add logic to make sure the same player isnt added twice,
  // or that more than 2 players are added
  // console.log("requestGame",pseudo)
  set(push(ref(getDatabase(), 'players')), {
    pseudo
  })
  dispatch(requestGameAsync());
  const watchTimer = setInterval(() => {
    if (selectTwoPlayersMode(getState())) clearInterval(watchTimer);
    dispatch(requestGameAsync());
  }, 4000);
};

export const startWatchingStepNumber = () => (dispatch, getState) => {
    const watchTimer = setInterval(() => {
      if (selectTwoPlayersMode(getState())) {
        dispatch(updateGameAsync(selectStepNumber(getState())));
      }
    }, 5500);
};  

export default connectXSlice.reducer;
