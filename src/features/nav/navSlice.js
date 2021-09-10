import { createSlice } from '@reduxjs/toolkit';
// import { fetchCount } from './navAPI';

const initialState = {
};

export const navSlice = createSlice({
  name: 'nav',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    reset: state => {
      // From here we can take action only at this "counter" state
      // But, as we have taken care of this particular "logout" action
      // in rootReducer, we can use it to CLEAR the complete Redux Store's state
    }
  }
});

export const { reset } = navSlice.actions;

// export const selectSortIsAsc = (state) => state.nav.sortIsAsc;

export default navSlice.reducer;
