const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// إعداد اللعبة
let player = { x: 50, y: 150, width: 50, height: 30, color: "green", health: 100 };
let enemies = [];
let bullets = [];
let score = 0;
let isGameOver = false;

// إنشاء عدو جديد
function createEnemy() {
  const enemy = {
    x: canvas.width,
    y: Math.random() * (canvas.height - 30),
    width: 50,
    height: 30,
    color: "blue",
    health: 100,
  };
  enemies.push(enemy);
}

// إطلاق النار
function shoot() {
  bullets.push({ x: player.x + player.width, y: player.y + player.height / 2, width: 10, height: 5 });
}

// تحديث اللعبة
function updateGame() {
  if (isGameOver) return;

  // تحديث اللاعب
  if (player.health <= 0) {
    isGameOver = true;
    alert("لقد خسرت! حاول مجددًا.");
    return;
  }

  // تحريك الأعداء
  enemies.forEach((enemy, index) => {
    enemy.x -= 2;
    if (enemy.x + enemy.width < 0) {
      enemies.splice(index, 1);
    }
  });

  // تحريك الطلقات
  bullets.forEach((bullet, index) => {
    bullet.x += 5;
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        enemy.health -= 10;
        bullets.splice(index, 1);
        if (enemy.health <= 0) {
          enemies.splice(enemyIndex, 1);
          score++;
          if (score >= 5) {
            alert("لقد فزت!");
            isGameOver = true;
          }
        }
      }
    });
  });

  // إضافة أعداء جدد
  if (Math.random() < 0.02) {
    createEnemy();
  }
}

// رسم اللعبة
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // رسم اللاعب
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // رسم الأعداء
  enemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });

  // رسم الطلقات
  bullets.forEach((bullet) => {
    ctx.fillStyle = "red";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // رسم الصحة والنقاط
  ctx.fillStyle = "black";
  ctx.fillText(`Health: ${player.health}`, 10, 20);
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 20);
}

// تشغيل اللعبة
function gameLoop() {
  updateGame();
  drawGame();
  if (!isGameOver) requestAnimationFrame(gameLoop);
}

// بدء اللعبة
document.getElementById("startGame").addEventListener("click", () => {
  isGameOver = false;
  score = 0;
  player.health = 100;
  enemies = [];
  bullets = [];
  gameLoop();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") player.y -= 10;
  if (e.key === "ArrowDown") player.y += 10;
  if (e.key === " ") shoot();
});
