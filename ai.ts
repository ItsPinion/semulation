const canvas = document.getElementById("canves") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const squareSize = 10;
const gridSize = 50;
let bestPath: { i: number; j: number }[] = [];
let lastPath: { i: number; j: number }[] = [];
let squares: SquareType[][] = [];

type SquareType = {
  x: number;
  y: number;
  size: number;
  player: boolean;
  wall: boolean;
  moved: boolean;
};

function getColor({
  player,
  wall,
}: {
  player: boolean;
  wall: boolean;
}): string {
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
      ctx.fillStyle = getColor({ player: square.player, wall: square.wall });
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
    moved: true,
  };
  const tamp2: SquareType = {
    ...squares[k][l],
    x: squares[i][j].x,
    y: squares[i][j].y,
  };
  squares[k][l] = tamp1;
  squares[i][j] = tamp2;
  lastPath.push({ i, j });
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
      !lastPath.some((path) => path.i === newI && path.j === newJ)
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
        }
      });
    });
    drawSquares();
    if (again) {
      requestAnimationFrame(() => {
        newGen().then(resolve); // Recursively call newGen until again is false
      });
    } else {
      resolve(); // Resolve the Promise if again is false
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
  lastPath = [];
  squares = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => ({
      x: 0,
      y: 0,
      size: squareSize,
      player: false,
      wall: false,
      moved: false,
    }))
  );

  squares[0][0].player = true;

  createSquares();
  drawSquares();
}

function executeAction() {
  return new Promise<void>((resolve) => {
    bestPath.length < lastPath.length && (bestPath = [...lastPath]);

    resetSquare();
    newGen().then(() => {
      resolve(); // Resolve executeAction's promise when newGen is done
    });
  });
}
async function executeActionSequentially(count: number) {
  const buttons = document.getElementById("ctrl") as HTMLDivElement;
  console.log(buttons.style);
  buttons.hidden = true;
  for (let i = 0; i < count; i++) {
    await executeAction(); // Assuming executeAction returns a promise
  }
  buttons.hidden = false;
}

// Attach the event listener to the button
document.getElementById("new")?.addEventListener("click", () => {
  executeActionSequentially(1000);
});

document.getElementById("best")?.addEventListener("click", () => {
  resetSquare();
  bestGen();
});

export default {};
