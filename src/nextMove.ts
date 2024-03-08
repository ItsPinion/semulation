import { SquareType, lastPath } from "./types";

export function nextMove(
  { i, j }: { i: number; j: number },
  gridSize: number,
  squares: SquareType[][],
  lastPath: lastPath
) {
  const possibleMoves: { i: number; j: number }[] = [];
  const directions = [
    { i: -1, j: 0 },
    { i: 1, j: 0 },
    { i: 0, j: -1 },
    { i: 0, j: 1 },
  ];

  directions.forEach((dir) => {
    const newI = i + dir.i;
    const newJ = j + dir.j;

    if (
      newI >= 0 &&
      newI < gridSize &&
      newJ >= 0 &&
      newJ < gridSize &&
      !squares[newI][newJ].wall &&
      !lastPath.path.some((path) => path.i === newI && path.j === newJ)
    ) {
      possibleMoves.push({ i: newI, j: newJ });
    }
  });

  return possibleMoves.length > 0
    ? possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
    : null;
}
