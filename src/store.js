import { configureStore } from '@reduxjs/toolkit'
import fenReducer from 's/fenSlice'

export default configureStore({
  reducer: {
    fen: fenReducer,
  },
})
