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
      isEnemy = false,
      rotation = 0
    }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    }
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.health = 100;
    this.isEnemy = isEnemy;
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

  attack({ attack, recipient, renderedSprites }) {

    const timeline = gsap.timeline();
    let movementDistance = 20;
    let healthBar = '#enemy-health-bar';
    this.health -= attack.damage;
    let rotation = 1;

    if(this.isEnemy) {
      movementDistance = -20;
      healthBar = '#friend-health-bar';
      rotation = -2.2;
    };

    switch(attack.name){
      case 'Tackle':
        timeline.to(this.position, {
          x: this.position.x - movementDistance
        }).to(this.position, {
          x: this.position.x + movementDistance * 2,
          duration: 0.1,
          onComplete: () => {
            // enemy actually gets hit
            gsap.to(healthBar, {
              width: (this.health <= 0) ? `${this.health = 0}%` : `${this.health}%`
            });

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08
            });

            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08
            });
          }
        }).to(this.position, {
          x: this.position.x
        });
        break;

      case 'Fireball':
        // attacks
        const fireballImage = new Image();
        fireballImage.src = './img/attacks/fireball.png';

        const fireball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y
          },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 10
          },
          animate: true,
          rotation
        });

        renderedSprites.splice(1, 0, fireball);

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            renderedSprites.splice(1,1);

            // enemy actually gets hit
            gsap.to(healthBar, {
              width: (this.health <= 0) ? `${this.health = 0}%` : `${this.health}%`
            });

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08
            });

            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08
            });
          }
        })
        break;
    }

  }
}

export {
  Sprite
}