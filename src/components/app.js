import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import loadNodes from '../load-nodes';
import Chessboard from 'chessboardjsx';
import { START_FEN } from '../utils';
import { Chess } from 'chess.js';
import { fetchAllGames, makeMove } from '../thunks/games';

export default function App () {
  const edges = useSelector((state) => state.fen.edges)
  const currentFen = useSelector((state) => state.fen.currentFen)
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

  const handleDrop = useCallback(({ sourceSquare, targetSquare}) => {
    const game = new Chess(currentFen);
    game.move({
      from: sourceSquare,
      to: targetSquare
    });
    const moveHistory = game.history();
    dispatch(makeMove(moveHistory[moveHistory.length - 1]));
  }, [currentFen]);

  return (
    <div>
      <Chessboard onDrop={handleDrop} position={currentFen} />
      <ul>
        {Object.keys(edges).map((edge) => (
          <li onClick={() => handleClick(edge)}>{edge}</li>
        ))}
      </ul>
    </div>
  );
};
