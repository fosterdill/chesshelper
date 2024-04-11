import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { increment } from 'f/counterSlice'

export default function App () {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()
  const handleClick = useCallback(() => {
    dispatch(increment());
  }, []);

  return <div onClick={handleClick}>{count}</div>;
};
