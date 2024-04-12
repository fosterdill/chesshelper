import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import loadNodes from '../load-nodes';
import Chessboard from 'chessboardjsx';
import { START_FEN } from '../utils';
import { Chess } from 'chess.js';
import { fetchAllGames, makeMove, changeSide, goBack } from '../thunks/games';

export default function App () {
  const edges = useSelector((state) => state.fen.edges)
  const currentSide = useSelector((state) => state.fen.side)
  const currentFen = useSelector((state) => state.fen.currentFen)
  const previousFens = useSelector((state) => state.fen.previousFens)
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
    try {
      game.move({
        from: sourceSquare,
        to: targetSquare
      });
      const moveHistory = game.history();
      setOptimisticFen(game.fen());
      dispatch(makeMove(moveHistory[moveHistory.length - 1]));
    } catch (e) {
      console.log(e);
    }
  }, [currentFen]);

  const handleChangeSide = useCallback((event) => {
    dispatch(changeSide(event.target.value));
    setOptimisticFen(START_FEN);
  }, [])

  const handleBackClick = useCallback((event) => {
    event.preventDefault();

    if (currentFen === START_FEN) return;
    setOptimisticFen(previousFens[previousFens.length - 1])
    dispatch(goBack());
  }, [previousFens, currentFen])

  const keyHandler = useCallback((event) => {
    if (event.key === 'ArrowLeft') {
      if (currentFen === START_FEN) return;
      setOptimisticFen(previousFens[previousFens.length - 1])
      dispatch(goBack());
    }
  }, [previousFens, currentFen])

  useEffect(() => {
    window.addEventListener('keydown', keyHandler);

    return () => {
      window.removeEventListener('keydown', keyHandler)
    }
  }, [keyHandler]);

  return (
    <div>
      <select name="side" value={currentSide} onChange={handleChangeSide}>
        <option value="white">White</option>
        <option value="black">Black</option>
      </select>
      <button onClick={handleBackClick}>Back</button>
      <div style={{display: 'flex'}}>
        <div>
          <Chessboard width={500} orientation={currentSide} onDrop={handleDrop} position={optimisticFen} />
        </div>
        <ul>
          {Object.keys(edges).length ? Object.keys(edges).map((edge) => (
            <li key={edge} onClick={() => handleClick(edge)}>{edge}, {((edges[edge].accum.win / edges[edge].accum.total) * 100).toFixed()}% win rate. {edges[edge].accum.total} total games</li>
          )) : "Never been in this position"}
        </ul>
      </div>
    </div>
  );
};
