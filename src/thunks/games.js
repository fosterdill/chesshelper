import loadNodes from '../load-nodes';
import { changeFen } from '../slices/fenSlice';
import { START_FEN } from '../utils';
import localForage from "localforage";
import { Chess } from 'chess.js';

export const fetchAllGames = (username) => {
  return async (dispatch, getState) => {
    const username = window.location.hash.slice(1);
    await loadNodes(username);
    const { edges } = (await localForage.getItem(`${username}_white_${START_FEN}`));
    dispatch(changeFen({ fen: START_FEN, edges }));
  }
}

export const makeMove = (moveName) => {
  return async (dispatch, getState) => {
    const chessObj = new Chess(getState().fen.currentFen);
    let moveNameClean = moveName;
    if (moveNameClean.indexOf('.') !== -1) {
      moveNameClean = moveName.indexOf('...') !== -1 ? moveName.slice(5) : moveName.slice(3);
    }
    chessObj.move(moveNameClean);
    const { edges } = (await localForage.getItem(`fosterdill_white_${chessObj.fen()}`));
    dispatch(changeFen({ fen: chessObj.fen(), edges }));
  }
}
