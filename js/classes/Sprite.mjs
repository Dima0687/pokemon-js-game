import { context } from '../index.mjs';

class Sprite {
  constructor({ 
      position, 
      image, 
      frames = {
         max: 1, 
         hold: 10 
        }, 
      sprites,
      animate = false ,
      rotation = 0
    }) {
    this.position = position;
    this.image = new Image();
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    }
    this.image.src = image.src;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.rotation = rotation;
  }
  draw(){
    context.save();
    context.translate(
      this.position.x + this.width / 2, 
      this.position.y + this.height / 2
    );

    context.rotate(this.rotation);

    context.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );

    context.globalAlpha = this.opacity;
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
    
    context.restore();

    if(!this.animate) return;

    if(this.frames.max > 1){
      this.frames.elapsed++
    }

    if(this.frames.elapsed % this.frames.hold === 0) {
      if(this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

export {
  Sprite
}