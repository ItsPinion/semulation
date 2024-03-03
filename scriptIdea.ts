// const canvas = document.getElementById("canves") as HTMLCanvasElement;
// const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

// type BeingType = "bull" | "tiger" | "tree" | null;

// function getRandoBeing(): BeingType {
//   const randomNumber = Math.random();
//   if (randomNumber < 0.01) return "tiger";
//   if (randomNumber < 0.02) return "bull";
//   if (randomNumber < 0.4) return "tree";
//   return null;
// }

// function getColor(being: BeingType): string {
//   switch (being) {
//     case "tiger":
//       return "#FF7F00";
//     case "bull":
//       return "#8B4513";
//     case "tree":
//       return "#008000";
//     default:
//       return "#B2AFAF";
//   }
// }

// function drawSquare(squares: SquareType[]): void {
//   squares.forEach((square) => {
//     ctx.fillStyle = getColor(square.being);
//     ctx.fillRect(square.x, square.y, square.size, square.size);
//   });
// }

// type SquareType = {
//   x: number;
//   y: number;
//   size: number;
//   color: string;
//   being: BeingType;
//   age: number;
//   hadFood: number;
// };

// const squares: SquareType[] = [];

// function createSquare(
//   x: number,
//   y: number,
//   size: number,
//   being: BeingType,
//   age: number,
//   hadFood: number
// ): void {
//   const square = { x, y, size, color: getColor(being), being, age, hadFood };
//   squares.push(square);
// }

// const squareSize = 50;
// const gridSize = 10;

// for (let i = 0; i < gridSize; i++) {
//   for (let j = 0; j < gridSize; j++) {
//     const x = i * squareSize;
//     const y = j * squareSize;
//     createSquare(x, y, squareSize, getRandoBeing(), 0, 0);
//   }
// }

// drawSquare(squares);

// function resetSquare(i: number): void {
//   squares[i] = {
//     ...squares[i],
//     being: null,
//     age: 0,
//     hadFood: 0,
//     color: "#B2AFAF",
//   };
// }

// function changeSquare(i: number): void {
//   if (i > 9 && squares[i - 10].being && squares[i].being) {
//     squares[i - 10] = { ...squares[i] };
//     resetSquare(i);
//   }
// }

// console.log(squares);

// function animate() {
//   squares.forEach((_, i) => {
//     changeSquare(i);
//   });
//   drawSquare(squares);
// }

// const button = document.getElementById("button") as HTMLButtonElement;

// button.addEventListener("click", () => {
//   console.log("Click")
//   animate();
// });
