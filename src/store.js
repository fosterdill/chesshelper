import { configureStore } from '@reduxjs/toolkit'
import counterReducer from 's/counterSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
})
