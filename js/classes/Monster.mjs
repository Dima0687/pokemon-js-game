import { Sprite } from './Sprite.mjs';
import { 
  queue,
  /* battleAnimationId, */
  animate as animateFunc
} from '../index.mjs';

class Monster extends Sprite {
  constructor({
    position, 
    image, 
    frames, 
    sprites,
    animate,
    rotation,
    isEnemy = false,
    name,
    attacks
  }){
    super({ 
      position, 
      image, 
      frames, 
      sprites,
      animate,
      rotation,
    });
    this.health = 100;
    this.isEnemy = isEnemy;
    this.name = name;
    this.healthBar = '#enemy-health-bar';
    this.dialogBox = document.querySelector('#dialog-box');
    this.attacks = attacks;
  }

  faint() {
    const dialogBox = document.querySelector('#dialogue-box');
    dialogBox.style = `
      display: flex;
    `;
    dialogBox.innerText = `${this.name} fainted`;

    gsap.to(this.position, {
      y: this.position.y + 20
    });

    gsap.to(this, {
      opacity: 0,
      onComplete: () => {
        
      }
    });

  }

  attack({ attack, recipient, renderedSprites }) {
    const dialogBox = document.querySelector('#dialogue-box');
    dialogBox.style = `
      display: flex;
    `;
    dialogBox.innerText = `${this.name} used ${attack.name}`;

    const timeline = gsap.timeline();
    let movementDistance = 20;
    let healthBar = '#enemy-health-bar';
    let rotation = 1;

    recipient.health -= attack.damage;
    
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
              width: `${recipient.health}%`
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
              width: `${recipient.health}%`
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
  Monster
}