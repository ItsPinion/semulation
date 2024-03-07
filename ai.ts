const canvas = document.getElementById("canves") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const squareSize = 10;
const gridSize = 50;
let bestPath: { i: number; j: number }[] = [];
let lastPath: { foundPath: boolean; path: { i: number; j: number }[] } = {
  foundPath: false,
  path: [],
};
let squares: SquareType[][] = [];

type SquareType = {
  x: number;
  y: number;
  size: number;
  player: boolean;
  wall: boolean;
  checkPoint: boolean;
  moved: boolean;
};

function getColor({
  checkPoint,
  player,
  wall,
}: {
  checkPoint: boolean;
  player: boolean;
  wall: boolean;
}): string {
  if (checkPoint) return "#8888cf";
  if (player) return "#810000";
  if (wall) return "#080808";

  return "#B2AFAF";
}

function createSquares(): void {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = i * squareSize;
      const y = j * squareSize;
      squares[i][j] = { ...squares[i][j], x, y };
    }
  }
}

function drawSquares(): void {
  ctx.clearRect(0, 0, 500, 500);
  squares.forEach((innerSquare) => {
    innerSquare.forEach((square) => {
      square.moved = false;
      ctx.fillStyle = getColor({
        player: square.player,
        wall: square.wall,
        checkPoint: square.checkPoint,
      });
      ctx.fillRect(square.x, square.y, square.size, square.size);
    });
  });
}

function moveSquare(
  from: { i: number; j: number },
  to: { k: number; l: number }
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
function nextMove({ i, j }: { i: number; j: number }) {
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

function newGen() {
  return new Promise<void>((resolve) => {
    let again = true;
    squares.forEach((innerSquares, i) => {
      innerSquares.forEach((square, j) => {
        if (square.player && !square.moved) {
          const moveTo = nextMove({ i, j });
          moveTo
            ? moveSquare({ i, j }, { k: moveTo.i, l: moveTo.j })
            : (again = false);
          lastPath.foundPath && (again = false);
        }
      });
    });
    drawSquares();
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
    moveSquare(bestPath[index], { k: moveTo.i, l: moveTo.j });
    drawSquares();
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

  createSquares();
  drawSquares();
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
