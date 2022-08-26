import { attacks } from "./attacks.mjs";

// Images
import { 
  draggleImage,
  embyImage
} from '../images/index.mjs';

// Monster Data
const monsters = {
  Emby: {
    position: {
      x: 280,
      y: 325
    },
    image: embyImage,
    frames: {
      max: 4,
      hold: 10
    },
    animate: true,
    name: 'Emby',
    attacks: [attacks.Tackle, attacks.Fireball]
  },
  Draggle: {
    position: {
      x: 800,
      y: 100
    },
    image: draggleImage,
    frames: {
      max: 4,
      hold: 30
    },
    animate: true,
    isEnemy: true,
    name: 'Draggle',
    attacks: [attacks.Tackle, attacks.Fireball]
  }
}

export {
  monsters
}