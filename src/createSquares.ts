import { SquareType } from "./types";

export
function createSquares(gridSize:number,squares:SquareType[][],squareSize:number): void {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        squares[i][j] = {
          ...squares[i][j],
          x: i * squareSize,
          y: j * squareSize,
        };
      }
    }
  }