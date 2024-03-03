const canvas = document.getElementById("canves") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.height = window.innerHeight - 30;
canvas.width = window.innerWidth - 30;
interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  angle: number;
  age: number;
}

const balls: Ball[] = [
  {
    x: canvas.width / 2,
    y: canvas.height,
    dx: 0.5,
    dy: -0.5,
    radius: 150,
    angle: 90,
    age: 0,
  },
];

function addBall(ball: Ball) {
  balls.unshift({ ...ball, angle: ball.angle - 30 });
}

function drawBall(): void {
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }
}
drawBall();
function animate(): void {
  const parentBalls: Ball[] = [];
  balls.forEach((ball) => {
    if (ball.radius < 5) return;
    const ren = Math.random() * 100;
    const radians = ball.angle * (Math.PI / 180);
    ball.x += ball.dx * Math.cos(radians);
    ball.y += ball.dy * Math.sin(radians);
    ball.radius -= 0.025;
    ball.age++;

    if (ren < 0.1 || ball.age > 1000) {
      ball.age = 0;
      parentBalls.push({ ...ball });
      ball.angle += 30;
    }
  });
  for (let i = 0; i < parentBalls.length; i++) {
    const ball = parentBalls[i];
    addBall(ball);
  }
  drawBall();

  requestAnimationFrame(animate);
}

animate();

export default {};
