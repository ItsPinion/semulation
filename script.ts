const canvas = document.getElementById("canves") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const squareSize = 2;
const gridSize = 250;
const squares: SquareType[][] = Array.from({ length: gridSize }, () =>
  Array.from({ length: gridSize }, () => ({
    x: 0,
    y: 0,
    size: squareSize,
    color: "",
    being: null,
    age: 0,
    hadFood: 0,
    moved: false,
  }))
);
type BeingType = "bull" | "tiger" | "tree" | null;
type SquareType = {
  x: number;
  y: number;
  size: number;
  color: string;
  being: BeingType;
  age: number;
  hadFood: number;
  moved: boolean;
};
function getRandoBeing(): BeingType {
  const randomNumber = Math.random();
  if (randomNumber < 0.01) return "tiger";
  if (randomNumber < 0.02) return "bull";
  if (randomNumber < 0.4) return "tree";
  return null;
}

function getColor(being: BeingType): string {
  switch (being) {
    case "tiger":
      return "#FF7F00";
    case "bull":
      return "#8B4513";
    case "tree":
      return "#008000";
    default:
      return "#B2AFAF";
  }
}

function createSquares(): void {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = i * squareSize;
      const y = j * squareSize;
      const being = getRandoBeing();
      const size = squareSize;
      const color = getColor(being);
      squares[i][j] = { ...squares[i][j], being, size, color, x, y };
    }
  }
}

function drawSquares(): void {
  ctx.clearRect(0, 0, 500, 500);
  squares.forEach((innerSquare) => {
    innerSquare.forEach((square) => {
      square.moved = false;
      ctx.fillStyle = square.color;
      ctx.fillRect(square.x, square.y, square.size, square.size);
    });
  });
}

createSquares();
drawSquares();
function moveSquare(
  from: { i: number; j: number },
  to: { k: number; l: number }
): void {
  const { i, j } = from;
  const { k, l } = to;
  if (squares[i][j].being !== "tree" && squares[i][j].being) {
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
}

function decideDirection(i: number, j: number) {
  const directions = ["left", "right", "up", "down"];
  const availableDirections = directions.filter((direction) => {
    let newI = i,
      newJ = j;
    switch (direction) {
      case "left":
        newJ -= 1;
        break;
      case "right":
        newJ += 1;
        break;
      case "up":
        newI -= 1;
        break;
      case "down":
        newI += 1;
        break;
    }

    return (
      newI >= 0 &&
      newI < gridSize &&
      newJ >= 0 &&
      newJ < gridSize &&
      !squares[newI][newJ].being
    );
  });
  if (availableDirections.length === 0) {
    return null;
  }

  if (availableDirections.length === 1) {
    return availableDirections[0];
  }

  return availableDirections[
    Math.floor(Math.random() * availableDirections.length)
  ];
}

function animate() {
  squares.forEach((innerSquares, i) => {
    innerSquares.forEach((square, j) => {
      const direction = decideDirection(i, j);
      let moveTo = null;
      if (direction === null) {
        return;
      }

      switch (direction) {
        case "left":
          moveTo = { k: i, l: j - 1 };
          break;
        case "right":
          moveTo = { k: i, l: j + 1 };
          break;
        case "up":
          moveTo = { k: i - 1, l: j };
          break;
        case "down":
          moveTo = { k: i + 1, l: j };
          break;
      }

      if (moveTo && !square.moved) {
        moveSquare({ i, j }, moveTo);
      }
    });
  });
  drawSquares();
  setTimeout(() => {
    requestAnimationFrame(animate);
  }, 50);
}

const button = document.getElementById("button") as HTMLButtonElement;
button.addEventListener("click", () => {
  animate();
});
