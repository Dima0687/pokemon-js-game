import { context } from '../index.mjs';
class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }){
    this.position = position;
    // 12 tiles * 4 (400% zoom)
    this.width = Boundary.width; 
    this.height = Boundary.height;
  }

  draw() {
    context.fillStyle = '#0000';
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

export {
  Boundary
}