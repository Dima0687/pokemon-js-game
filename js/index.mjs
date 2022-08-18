import { canvas } from "./data/canvas.mjs";
import { boundaries, battleZones, keys, background, foreground, player, battleBackground } from "./data/index.mjs";
import { Sprite, Boundary } from "./classes/index.mjs";


const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const divContainer = document.querySelector('#overlapping-screen');

divContainer.style = `
  position: absolute;
  width: ${canvas.width}px;
  height: ${canvas.height}px;
  background-color: #000;
  opacity: 0;
  pointer-events: none;
` ;

const movables = [ background, foreground, ...boundaries, ...battleZones ];

function rectangularCollision({ rectangle1, rectangle2 }){
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}

const battle = {
  initiated: false
}

function animate() {
  const animationId = window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach( boundary => {
    boundary.draw();
  });

  battleZones.forEach( battleZone => {
    battleZone.draw();
  })

  player.draw();
  foreground.draw();

  let moving = true;
  player.moving = false;

  if(battle.initiated) return;

  // activate battle
  if( keys.up.pressed || keys.down.pressed || keys.right.pressed || keys.left.pressed ) {
    for(let i = 0; i < battleZones.length; i++){
      const battleZone = battleZones[i];
      const overlappingArea = 
      (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) -
      Math.max(player.position.x, battleZone.position.x)) * 
      (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) -
      Math.max(player.position.y, battleZone.position.y));

      if(
        rectangularCollision({ 
          rectangle1: player, 
          rectangle2: battleZone
        }) && 
        overlappingArea > ( player.width * player.height ) / 2 && Math.random() < 0.01
      ) {
        console.log('activate battle');
        // deactivate current animation loop
        window.cancelAnimationFrame(animationId);
        battle.initiated = true;
        gsap.to('#overlapping-screen', {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            // activate a new animation loop
            animateBattle()
          }
        });
        break;
      }
    }
  }

  if(keys.up.pressed && lastKey === 'up') {
    player.moving = true;
    player.image = player.sprites.up;

    for(let i = 0; i < boundaries.length; i++){
      const boundary = boundaries[i];

      if(
        rectangularCollision({ 
          rectangle1: player, 
          rectangle2: { 
            ...boundary, 
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3
            } 
          }
        })
      ) {
        moving = false;
        break;
      }
    }

    if(moving) movables.forEach( movable => movable.position.y +=3);
  }
  
  if(keys.down.pressed && lastKey === 'down') {
    player.moving = true;
    player.image = player.sprites.down;

    for(let i = 0; i < boundaries.length; i++){
      const boundary = boundaries[i];

      if(
        rectangularCollision({ 
          rectangle1: player, 
          rectangle2: { 
            ...boundary, 
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3
            } 
          }
        })
      ) {
        moving = false;
        break;
      }
    }
    if(moving) movables.forEach( movable => movable.position.y -=3);
  }


  if(keys.left.pressed && lastKey === 'left') {
    player.moving = true;
    player.image = player.sprites.left;

    for(let i = 0; i < boundaries.length; i++){
      const boundary = boundaries[i];

      if(
        rectangularCollision({ 
          rectangle1: player, 
          rectangle2: { 
            ...boundary, 
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y
            } 
          }
        })
      ) {
        moving = false;
        break;
      }
    }
    if(moving) movables.forEach( movable => movable.position.x +=3);
  }

  if(keys.right.pressed && lastKey === 'right') {
    player.moving = true;
    player.image = player.sprites.right;

    for(let i = 0; i < boundaries.length; i++){
      const boundary = boundaries[i];

      if(
        rectangularCollision({ 
          rectangle1: player, 
          rectangle2: { 
            ...boundary, 
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y
            } 
          }
        })
      ) {
        moving = false;
        break;
      }
    }
    if(moving) movables.forEach( movable => movable.position.x -=3);
  }
}

// animate();

function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  console.log('animating battle');
  battleBackground.draw();
}

animateBattle();

let lastKey = '';
window.addEventListener('keydown', (e) => {
  switch(true) {
    case e.key === 'w' || e.key === 'ArrowUp': 
      keys.up.pressed = true;
      lastKey = 'up';
      break;
    case e.key === 'a' || e.key === 'ArrowLeft': 
      keys.left.pressed = true;
      lastKey = 'left';
      break;
    case e.key === 's' || e.key === 'ArrowDown': 
      keys.down.pressed = true;
      lastKey = 'down';
      break;
    case e.key === 'd' || e.key === 'ArrowRight': 
      keys.right.pressed = true;
      lastKey = 'right';
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch(true) {
    case e.key === 'w' || e.key === 'ArrowUp': 
      keys.up.pressed = false;
      break;
    case e.key === 'a' || e.key === 'ArrowLeft': 
      keys.left.pressed = false;
      break;
    case e.key === 's' || e.key === 'ArrowDown': 
      keys.down.pressed = false;
      break;
    case e.key === 'd' || e.key === 'ArrowRight': 
      keys.right.pressed = false;
      break;
  }
});

export {
  context
}