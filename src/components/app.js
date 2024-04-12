import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import loadNodes from '../load-nodes';
import { START_FEN } from '../utils';
import { fetchAllGames, makeMove } from '../thunks/games';

export default function App () {
  const edges = useSelector((state) => state.fen.edges)
  const dispatch = useDispatch()
  // const handleClick = useCallback(() => {
  //   dispatch(increment());
  // }, []);
  useEffect(() => {
    dispatch(fetchAllGames(window.location.hash.slice(1)));
  }, []);

  const handleClick = useCallback((moveName) => {
    dispatch(makeMove(moveName));
  }, []);

  return (
    <ul>
      {Object.keys(edges).map((edge) => (
        <li onClick={() => handleClick(edge)}>{edge}</li>
      ))}
    </ul>
  );
};
