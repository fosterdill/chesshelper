import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { increment } from 's/counterSlice'
import loadNodes from '../load-nodes';

export default function App () {
  // const count = useSelector((state) => state.counter.value)
  // const dispatch = useDispatch()
  // const handleClick = useCallback(() => {
  //   dispatch(increment());
  // }, []);
  useEffect(async () => {
    const allNodes = await loadNodes(window.location.hash.slice(1));
		const whiteNodes = allNodes.whiteNodes;
		const blackNodes = allNodes.blackNodes;
    console.log(allNodes);
  })

  return <div>hi</div>;
};
