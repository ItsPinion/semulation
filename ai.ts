const canvas = document.getElementById("canves") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const squareSize = 10;
const gridSize = 50;

const squares: SquareType[][] = Array.from({ length: gridSize }, () =>
  Array.from({ length: gridSize }, () => ({
    x: 0,
    y: 0,
    size: squareSize,
    player: false,
    wall: true,
    moved: false,
    moves: [],
  }))
);

type SquareType = {
  x: number;
  y: number;
  size: number;
  player: boolean;
  wall: boolean;
  moved: boolean;
  moves: string[];
};

function getColor({
  player,
  wall,
}: {
  player: boolean;
  wall: boolean;
}): string {
  if (player) return "#810000";
  if (wall) return "#cfcfcf";
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
}

function nextMove({ i, j }: { i: number; j: number }): string | null {
  const directions = ["left", "right", "up", "down"];
  const possibleMoves = directions.filter((dir) => {
    const [di, dj] =
      dir === "left"
        ? [-1, 0]
        : dir === "right"
        ? [1, 0]
        : dir === "up"
        ? [0, -1]
        : [0, 1];
    const ni = i + di;
    const nj = j + dj;
    return (
      ni >= 0 &&
      ni < gridSize &&
      nj >= 0 &&
      nj < gridSize &&
      !squares[ni][nj].wall
    );
  });
  return possibleMoves.length
    ? possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
    : null;
}

function animate() {
  squares.forEach((innerSquares, i) => {
    innerSquares.forEach((square, j) => {
      if (square.player && !square.moved) {
        const move = nextMove({ i, j });
        if (move) {
          let moveTo;
          switch (move) {
            case "left":
              moveTo = { k: i - 1, l: j };
              break;
            case "right":
              moveTo = { k: i + 1, l: j };
              break;
            case "up":
              moveTo = { k: i, l: j - 1 };
              break;
            case "down":
              moveTo = { k: i, l: j + 1 };
              break;
          }
          moveTo && moveSquare({ i, j }, moveTo);
        }
      }
    });
  });
  drawSquares();
  setTimeout(() => {
    requestAnimationFrame(animate);
  }, 50);
}

squares[0][0].player = true;
squares[1][0].player = true;

squares[1].forEach((square, j) => {
  j < gridSize / 2 && (square.wall = false);
});

createSquares();
drawSquares();

document.getElementById("button")?.addEventListener("click", () => {
  animate();
});

export default {};
