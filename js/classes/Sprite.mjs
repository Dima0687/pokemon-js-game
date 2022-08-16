import { context } from '../index.mjs';

class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 }}) {
    this.position = position;
    this.image = image;
    this.frames = frames;
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    }
  }
  draw(){
    context.drawImage(
      this.image,
      0, // crop img x
      0, // crop img y
      this.image.width / this.frames.max, // crop img how far x
      this.image.height, // crop img how far y
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
  }
}

export {
  Sprite
}