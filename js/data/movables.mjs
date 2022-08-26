import { canvas } from "./canvas.mjs";
import { monsters } from "./index.mjs";
import { collisionsMap } from "./collisions.mjs";
import { battleZonesMap } from "./battleZones.mjs";
import { Monster, Sprite, Boundary } from "../classes/index.mjs";
import { offset } from "./offset.mjs";
import { 
  backgroundImage, 
  foregroundImage, 
  playerImage, 
  battleBackgroundImage,
} from '../images/index.mjs';

// charakter

const player = new Sprite({
  position: {
    x: canvas.width + 192, // x coord
    y: canvas.height + 150, // y coord
  },
  image: playerImage.down,
  frames: {
    max: 4,
    hold: 10
  },
  sprites: playerImage
});

// maps

const background = new Sprite({ 
  position: {
    x: offset.x,
    y: offset.y
  },
  image: backgroundImage
});

const foreground = new Sprite({ 
  position: {
    x: offset.x,
    y: offset.y
  },
  image: foregroundImage
});

// battleground

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage
});


// boundaries

const symbolNumber = 1025;
const boundaries = [];
collisionsMap.forEach( ( row, i )=> {
  row.forEach( (symbol, j) => {
    if(symbol === symbolNumber) {
      boundaries.push( new Boundary({ position: {
        x: j * Boundary.width + offset.x,
        y: i * Boundary.height + offset.y
      }}));
    }
  });
});


const battleZones = [];
battleZonesMap.forEach( (row, i ) => {
  row.forEach( (symbol, j) => {
    if(symbol === symbolNumber) {
      battleZones.push( new Boundary( { position: {
        x: j * Boundary.width + offset.x,
        y: i * Boundary.height + offset.y
      }}))
    }
  })
});

export {
  // maps
  background,
  foreground,
  // boundaries & activators
  boundaries,
  battleZones,
  // charakter
  player,
  // battleground
  battleBackground
}