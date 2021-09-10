import tictactoeReducer, {
  increment,
  decrement,
  incrementByAmount,
} from './tictactoeSlice';

describe('tictactoe reducer', () => {
  const initialState = {
    value: 3,
    status: 'idle',
  };
  it('should handle initial state', () => {
    expect(tictactoeReducer(undefined, { type: 'unknown' })).toEqual({
      value: 0,
      status: 'idle',
    });
  });

  it('should handle increment', () => {
    const actual = tictactoeReducer(initialState, increment());
    expect(actual.value).toEqual(4);
  });

  it('should handle decrement', () => {
    const actual = tictactoeReducer(initialState, decrement());
    expect(actual.value).toEqual(2);
  });

  it('should handle incrementByAmount', () => {
    const actual = tictactoeReducer(initialState, incrementByAmount(2));
    expect(actual.value).toEqual(5);
  });
});
