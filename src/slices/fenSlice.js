import { createSlice } from '@reduxjs/toolkit'
import { START_FEN } from '../utils'

export const fenSlice = createSlice({
  name: 'fen',
  initialState: {
    currentFen: START_FEN,
    edges: {},
    side: 'white',
  },
  reducers: {
    changeFen: (state, action) => {
      state.currentFen = action.payload.fen || state.currentFen;
      state.edges = action.payload.edges || state.edges;
      state.side = action.payload.newSide || state.side;
    },
  },
})

// Action creators are generated for each case reducer function
export const { changeFen } = fenSlice.actions

export default fenSlice.reducer
