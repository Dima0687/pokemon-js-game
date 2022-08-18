import { context } from '../index.mjs';

class Sprite {
  constructor({ position, image, frames = { max: 1 }, sprites }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    }
    this.moving = false;
    this.sprites = sprites;
  }
  draw(){
    context.drawImage(
      this.image,
      this.frames.val * this.width, // crop img x
      0, // crop img y
      this.image.width / this.frames.max, // crop img how far x
      this.image.height, // crop img how far y
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );

    if(!this.moving) return;

    if(this.frames.max > 1){
      this.frames.elapsed++
    }

    if(this.frames.elapsed % 10 === 0) {
      if(this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

export {
  Sprite
}