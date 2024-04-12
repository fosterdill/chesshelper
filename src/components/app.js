import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import loadNodes from '../load-nodes';
import Chessboard from 'chessboardjsx';
import { START_FEN } from '../utils';
import { Chess } from 'chess.js';
import { fetchAllGames, makeMove, changeSide } from '../thunks/games';

export default function App () {
  const edges = useSelector((state) => state.fen.edges)
  const currentSide = useSelector((state) => state.fen.side)
  const currentFen = useSelector((state) => state.fen.currentFen)
  const [optimisticFen, setOptimisticFen] = useState(START_FEN);
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchAllGames(window.location.hash.slice(1)));
  }, []);

  const handleClick = useCallback((moveName) => {
    dispatch(makeMove(moveName));
    const game = new Chess(currentFen);
    const moveNameClean = moveName.indexOf('...') !== -1 ? moveName.slice(moveName.indexOf('...') + 4) : moveName.slice(moveName.indexOf('.') + 2);
    game.move(moveNameClean);
    setOptimisticFen(game.fen());
  }, [currentFen]);

  const handleDrop = useCallback(({ sourceSquare, targetSquare}) => {
    const game = new Chess(currentFen);
    game.move({
      from: sourceSquare,
      to: targetSquare
    });
    const moveHistory = game.history();
    setOptimisticFen(game.fen());
    dispatch(makeMove(moveHistory[moveHistory.length - 1]));
  }, [currentFen]);

  const handleChangeSide = useCallback((event) => {
    dispatch(changeSide(event.target.value));
    setOptimisticFen(START_FEN);
  }, [])

  return (
    <div>
      <select name="side" value={currentSide} onChange={handleChangeSide}>
        <option value="white">White</option>
        <option value="black">Black</option>
      </select>
      <div style={{display: 'flex'}}>
        <div>
          <Chessboard width={500} orientation={currentSide} onDrop={handleDrop} position={optimisticFen} />
        </div>
        <ul>
          {Object.keys(edges).map((edge) => (
            <li key={edge} onClick={() => handleClick(edge)}>{edge}, {((edges[edge].accum.win / edges[edge].accum.total) * 100).toFixed()}% win rate. {edges[edge].accum.total} total games</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
