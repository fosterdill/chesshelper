import { createSlice } from '@reduxjs/toolkit'
import { START_FEN } from '../utils'

export const fenSlice = createSlice({
  name: 'fen',
  initialState: {
    currentFen: START_FEN,
    previousFens: [],
    edges: {},
    side: 'white',
  },
  reducers: {
    goLastFen: (state, action) => {
      const nextFen = state.previousFens.pop();
      state.edges = action.payload;
      state.currentFen = nextFen;
    },
    changeFen: (state, action) => {
      if (state.currentFen !== action.payload.fen) {
        state.previousFens.push(state.currentFen);
      }
      state.currentFen = action.payload.fen || state.currentFen;
      state.edges = action.payload.edges || state.edges;
      state.side = action.payload.newSide || state.side;

      if (action.payload.fen === START_FEN) {
        state.previousFens = [];
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const { changeFen, goLastFen } = fenSlice.actions

export default fenSlice.reducer
