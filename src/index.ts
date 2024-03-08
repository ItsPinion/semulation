import { getColor } from "./color";
import { createSquares } from "./createSquares";
import { drawSquares } from "./drawSquares";
import { moveSquare } from "./moveSquare";
import { nextMove } from "./nextMove";
import { SquareType, lastPath, path } from "./types";

const canvas = document.getElementById("canves") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const squareSize = 10;
const gridSize = 50;
let bestPath: path = [];
let lastPath: lastPath = {
  foundPath: false,
  path: [],
};
let squares: SquareType[][] = [];

function newGen() {
  return new Promise<void>((resolve) => {
    let again = true;
    squares.forEach((innerSquares, i) => {
      innerSquares.forEach((square, j) => {
        if (square.player && !square.moved) {
          const moveTo = nextMove({ i, j }, gridSize, squares, lastPath);
          moveTo
            ? moveSquare(
                { i, j },
                { k: moveTo.i, l: moveTo.j },
                squares,
                lastPath
              )
            : (again = false);
          lastPath.foundPath && (again = false);
        }
      });
    });

    drawSquares(ctx, squares, getColor);

    if (again) {
      requestAnimationFrame(() => {
        newGen().then(resolve);
      });
    } else {
      resolve();
    }
  });
}

function bestGen(index = 0) {
  if (index >= bestPath.length - 1) {
    return;
  }

  const moveTo = bestPath[index + 1];
  if (moveTo) {
    moveSquare(
      bestPath[index],
      { k: moveTo.i, l: moveTo.j },
      squares,
      lastPath
    );
    drawSquares(ctx, squares, getColor);
  }

  setTimeout(() => {
    bestGen(index + 1);
  }, 50);
}

function resetSquare() {
  lastPath = { foundPath: false, path: [] };
  squares = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => ({
      x: 0,
      y: 0,
      size: squareSize,
      player: false,
      wall: false,
      checkPoint: false,
      moved: false,
    }))
  );

  squares[0][0].player = true;
  squares[20][20].checkPoint = true;

  createSquares(gridSize, squares, squareSize);
  drawSquares(ctx, squares, getColor);
}

function executeAction() {
  return new Promise<void>((resolve) => {
    console.log(lastPath);

    resetSquare();
    newGen().then(() => {
      resolve();
    });
  });
}
async function executeActionSequentially() {
  const buttons = document.getElementById("ctrl") as HTMLDivElement;
  buttons.hidden = true;

  do {
    await executeAction();

    if (lastPath.foundPath) {
      (bestPath.length > lastPath.path.length || bestPath.length < 1) &&
        (bestPath = [...lastPath.path]);
    }
  } while (!lastPath.foundPath);
  
  buttons.hidden = false;
}

document.getElementById("new")?.addEventListener("click", () => {
  executeActionSequentially();
});

document.getElementById("best")?.addEventListener("click", () => {
  resetSquare();
  bestGen();
});

export default {};
