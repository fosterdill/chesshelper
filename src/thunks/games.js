import loadNodes from '../load-nodes';
import { changeFen, goLastFen } from '../slices/fenSlice';
import { START_FEN } from '../utils';
import localForage from "localforage";
import { Chess } from 'chess.js';

export const fetchAllGames = (username) => {
  return async (dispatch, getState) => {
    const username = window.location.hash.slice(1);
    await loadNodes(username);
    const { edges } = (await localForage.getItem(`${username}_${getState().fen.side}_${START_FEN}`));
    dispatch(changeFen({ fen: START_FEN, edges }));
  }
}

export const makeMove = (moveName) => {
  return async (dispatch, getState) => {
    const chessObj = new Chess(getState().fen.currentFen);
    let moveNameClean = moveName;
    if (moveNameClean.indexOf('.') !== -1) {
      moveNameClean = moveName.indexOf('...') !== -1 ? moveName.slice(moveName.indexOf('...') + 4) : moveName.slice(moveName.indexOf('.') + 2);
    }
    chessObj.move(moveNameClean);
    try {
      const { edges } = (await localForage.getItem(`fosterdill_${getState().fen.side}_${chessObj.fen()}`));
      dispatch(changeFen({ fen: chessObj.fen(), edges }));
    } catch (e) {
      dispatch(changeFen({ fen: chessObj.fen(), edges: {} }));
    }
  }
}

export const changeSide = (newSide) => {
  return async (dispatch, getState) => {
    const { edges } = await localForage.getItem(`fosterdill_${newSide}_${START_FEN}`);
    dispatch(changeFen({ fen: START_FEN, edges, newSide }));
  }
}

export const goBack = () => {
  return async (dispatch, getState) => {
    const previousFens = getState().fen.previousFens;
    try {
      const { edges } = await localForage.getItem(`fosterdill_${getState().fen.side}_${previousFens[previousFens.length - 1]}`);
      dispatch(goLastFen(edges));
    } catch (e) {
      dispatch(goLastFen({}));
    }
  }
}
