import { canvas } from "./data/canvas.mjs";
import {
  boundaries,
  battleZones,
  keys,
  background,
  foreground,
  player,
  battleBackground,
  attacks,
  monsters,
  audio
} from "./data/index.mjs";
import { Sprite, Boundary, Monster } from "./classes/index.mjs";

const context = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const overlapppingDiv = document.querySelector("#overlapping-screen");

overlapppingDiv.style = `
  width: ${canvas.width}px;
  height: ${canvas.height}px;
`;

const movables = [background, foreground, ...boundaries, ...battleZones];

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

const battle = {
  initiated: false,
};

const newGame = {
  started: false
}

function animate() {
  const animationId = window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });

  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });

  player.draw();
  foreground.draw();

  let moving = true;
  player.animate = false;

  if (battle.initiated || !newGame.started) return;

  // activate battle
  if (
    keys.up.pressed ||
    keys.down.pressed ||
    keys.right.pressed ||
    keys.left.pressed
  ) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));

      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.01
      ) {
        // deactivate current animation loop
        window.cancelAnimationFrame(animationId);

        audio.map.stop();
        audio.initBattle.play();
        audio.battle.play();

        battle.initiated = true;
        gsap.to("#overlapping-screen", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            // activate a new animation loop
            initBattle();
            animateBattle();
          },
        });
        break;
      }
    }
  }

  if (keys.up.pressed && lastKey === "up") {
    player.animate = true;
    player.image = player.sprites.up;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];

      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving) movables.forEach((movable) => (movable.position.y += 3));
  }

  if (keys.down.pressed && lastKey === "down") {
    player.animate = true;
    player.image = player.sprites.down;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];

      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) movables.forEach((movable) => (movable.position.y -= 3));
  }

  if (keys.left.pressed && lastKey === "left") {
    player.animate = true;
    player.image = player.sprites.left;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];

      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) movables.forEach((movable) => (movable.position.x += 3));
  }

  if (keys.right.pressed && lastKey === "right") {
    player.animate = true;
    player.image = player.sprites.right;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];

      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) movables.forEach((movable) => (movable.position.x -= 3));
  }
}

// battleScene
let renderedSprites;
let battleAnimationId;
let queue;

let draggle;
let emby;

const dialogBox = document.querySelector("#dialogue-box");
const enemyHealthBar = document.querySelector("#enemy-health-bar");
const friendHealthBar = document.querySelector("#friend-health-bar");
const attacksContainer = document.querySelector("#attacks-container");
const userInterface = document.querySelector("#user-interface");


function fadeBackToGame() {
  queue.push(() => {
    // fade back to black
    gsap.to("#overlapping-screen", {
      opacity: 1,
      onComplete: () => {
        cancelAnimationFrame(battleAnimationId);
        battle.initiated = false;
        animate();
        audio.map.play();
        userInterface.style.display = "none";
        gsap.to("#overlapping-screen", {
          opacity: 0,
        });
      },
    });
  });
}

function initBattle() {
  userInterface.style.display = "block";
  dialogBox.style.display = "none";
  enemyHealthBar.style.width = "100%";
  friendHealthBar.style.width = "100%";
  attacksContainer.replaceChildren();
  
  draggle = new Monster(monsters.Draggle);
  emby = new Monster(monsters.Emby);
  
  renderedSprites = [draggle, emby];
  emby.attacks.forEach((attack) => {
    const button = document.createElement("button");
    button.innerText = attack.name;
    
    const attacksContainer = document.querySelector("#attacks-container");
    attacksContainer.append(button);
  });
  queue = [];
  
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedAttack = attacks[e.currentTarget.textContent];
      emby.attack({
        attack: selectedAttack,
        recipient: draggle,
        renderedSprites,
      });

      if (draggle.health <= 0) {
        queue.push(() => {
          draggle.faint();
        });
        fadeBackToGame();
      }
      
      // enemy attacks right here
      const maxAttacks = 2;
      const randomNumOfAttacks = Math.ceil(Math.random() * maxAttacks);
      for (let i = 0; i < randomNumOfAttacks; i++) {
        const randomAttack =
          draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];
        queue.push(() => {
          draggle.attack({
            attack: randomAttack,
            recipient: emby,
            renderedSprites,
          });
        });
      }
    });

    const typeText = document.querySelector("#attacks-type-text");
    button.addEventListener("mouseenter", (e) => {
      const selectedAttack = attacks[e.currentTarget.textContent];
      typeText.innerText = selectedAttack.type;
      typeText.style.color = selectedAttack.color;
    });

    button.addEventListener("mouseleave", () => {
      typeText.innerText = "Attack Type";
      typeText.style.color = "black";
    });
  });
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();
  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

animate();
/* 
initBattle();
animateBattle(); */

dialogBox.addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = "none";

  if (emby.health <= 0) {
    queue.push(() => {
      emby.faint();
    });

    fadeBackToGame();
  }
});

let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (true) {
    case e.key === "w" || e.key === "ArrowUp":
      keys.up.pressed = true;
      lastKey = "up";
      break;
    case e.key === "a" || e.key === "ArrowLeft":
      keys.left.pressed = true;
      lastKey = "left";
      break;
    case e.key === "s" || e.key === "ArrowDown":
      keys.down.pressed = true;
      lastKey = "down";
      break;
    case e.key === "d" || e.key === "ArrowRight":
      keys.right.pressed = true;
      lastKey = "right";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (true) {
    case e.key === "w" || e.key === "ArrowUp":
      keys.up.pressed = false;
      break;
    case e.key === "a" || e.key === "ArrowLeft":
      keys.left.pressed = false;
      break;
    case e.key === "s" || e.key === "ArrowDown":
      keys.down.pressed = false;
      break;
    case e.key === "d" || e.key === "ArrowRight":
      keys.right.pressed = false;
      break;
  }
});

// let clicked = false;

const startGameButton = document.querySelector('#start-game');
const startGameBtnContainer = document.querySelector('#start-button-container');

startGameButton.addEventListener('click', () => {
  if(!newGame.started){
    audio.map.play();
    newGame.started = true;
    startGameBtnContainer.style.display = 'none';
  };
})

export { context, queue };
