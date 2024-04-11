import { configureStore } from '@reduxjs/toolkit'
import counterReducer from 'f/counterSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
})
