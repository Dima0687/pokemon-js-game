import { canvas } from "./data/canvas.mjs";
import { Sprite, Boundary } from "./classes/index.mjs";
import { boundaries, keys, background, player } from "./data/index.mjs";


const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const movables = [ background, ...boundaries ];

function rectangularCollision({ rectangle1, rectangle2 }){
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach( boundary => {
    boundary.draw();
  });


  player.draw();

  let moving = true;

  if(keys.up.pressed && lastKey === 'up') {
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
        console.log('colliding');
        moving = false;
        break;
      }
    }
    if(moving) movables.forEach( movable => movable.position.y +=3);
  }
  
  if(keys.down.pressed && lastKey === 'down') {
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
        console.log('colliding');
        moving = false;
        break;
      }
    }
    if(moving) movables.forEach( movable => movable.position.y -=3);
  }


  if(keys.left.pressed && lastKey === 'left') {
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
        console.log('colliding');
        moving = false;
        break;
      }
    }
    if(moving) movables.forEach( movable => movable.position.x +=3);
  }

  if(keys.right.pressed && lastKey === 'right') {
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
        console.log('colliding');
        moving = false;
        break;
      }
    }
    if(moving) movables.forEach( movable => movable.position.x -=3);
  }
}

animate();

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