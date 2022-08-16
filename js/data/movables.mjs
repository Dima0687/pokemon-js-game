import { canvas } from "./canvas.mjs";
import { collisionsMap } from "./collisions.mjs";
import { Sprite, Boundary } from "../classes/index.mjs";
import { offset } from "./offset.mjs";
import { image, playerImage } from '../images/index.mjs';

const player = new Sprite({
  position: {
    x: canvas.width + 192, // x coord
    y: canvas.height + 150, // y coord
  },
  image: playerImage,
  frames: {
    max: 4
  }
})

const background = new Sprite({ 
  position: {
    x: offset.x,
    y: offset.y
  },
  image
});

const boundaries = [];
collisionsMap.forEach( ( row, i )=> {
  row.forEach( (symbol, j) => {
    if(symbol === 1025) {
      boundaries.push( new Boundary({ position: {
        x: j * Boundary.width + offset.x,
        y: i * Boundary.height + offset.y
      }}));
    }
  });
});


export {
  background,
  boundaries,
  player
}