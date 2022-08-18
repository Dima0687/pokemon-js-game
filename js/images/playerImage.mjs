const playerImageUp = new Image();
playerImageUp.src = './img/charakter/playerUp.png';

const playerImageLeft = new Image();
playerImageLeft.src = './img/charakter/playerLeft.png';

const playerImageRight = new Image();
playerImageRight.src = './img/charakter/playerRight.png';

const playerImageDown= new Image();
playerImageDown.src = './img/charakter/playerDown.png';


const playerImage = {
  up: playerImageUp,
  left: playerImageLeft,
  right: playerImageRight,
  down: playerImageDown
}

export {
  playerImage
}