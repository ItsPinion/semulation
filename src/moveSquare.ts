import { SquareType, lastPath } from "./types";

export function moveSquare(
  from: { i: number; j: number },
  to: { k: number; l: number },
  squares: SquareType[][],
  lastPath: lastPath
): void {
  const { i, j } = from;
  const { k, l } = to;
  const tamp1: SquareType = {
    ...squares[i][j],
    x: squares[k][l].x,
    y: squares[k][l].y,
    checkPoint: squares[k][l].checkPoint,
    moved: true,
  };
  const tamp2: SquareType = {
    ...squares[k][l],
    x: squares[i][j].x,
    y: squares[i][j].y,
    checkPoint: squares[i][j].checkPoint,
  };
  squares[k][l] = tamp1;
  squares[i][j] = tamp2;

  lastPath.foundPath = squares[k][l].checkPoint;

  lastPath.path.push({ i, j });
}
