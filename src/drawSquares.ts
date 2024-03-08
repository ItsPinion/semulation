import { SquareType } from "./types";

export function drawSquares(
  ctx: CanvasRenderingContext2D,
  squares: SquareType[][],
  getColor: (square: SquareType) => string
): void {
  ctx.clearRect(0, 0, 500, 500);
  squares.forEach((row) => {
    row.forEach((square) => {
      square.moved = false;
      ctx.fillStyle = getColor(square);
      ctx.fillRect(square.x, square.y, square.size, square.size);
    });
  });
}
