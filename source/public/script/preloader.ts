/**
 * preloader.ts
 */
/// <reference path="../../../typings/index.d.ts" />
'use strict';

module TrumperTantrum {
  
  export class Preloader extends Phaser.State {
    
    preload() {
      this.load.image('sky', '/assets/background.png');
      this.load.image('whitehouse', '/assets/whitehouse.png');
      this.load.spritesheet('blocks', '/assets/sprites.png', 32, 32);
      this.load.spritesheet('trump', '/assets/trump.png', 32, 32);
    }
    
    create() {
      this.game.state.start('Level0');
    }
    
  }
  
}