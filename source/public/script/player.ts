/**
 * player.ts
 */
/// <reference path="../../../typings/index.d.ts" />
'use strict';

module TrumperTantrum {
  
  export class Player extends Phaser.Sprite {
    
    cursors: Phaser.CursorKeys;
    direction: string;
    
    constructor(game: Phaser.Game, cursors: Phaser.CursorKeys, x: number, 
      y: number) 
    {
      super(game, x, y, 'trump', 0);
      game.physics.arcade.enable(this);
      this.anchor.setTo(0.5, 0);
      
      this.body.bounce.y = 0.1;
      this.body.gravity.y = 800;
      this.body.collideWorldBounds = true;
      
      this.animations.add('right', [1,2], 10, true);
      this.animations.add('left', [3,4], 10, true);
      
      this.cursors = cursors;
      this.direction = 'right';
      
      game.add.existing(this);
    }
    
    update() 
    {
      this.body.velocity.x = 0;
      
      if ( this.cursors.left.isDown ) {
        this.body.velocity.x = -150;
        this.animations.play('left');
        this.direction = 'left';
      } else if ( this.cursors.right.isDown ) {
        this.body.velocity.x = 150;
        this.animations.play('right');
        this.direction = 'right';
      } else {
        this.animations.stop();
        this.frame = this.direction == 'right' ? 0 : 5;
      }
      
      if ( this.cursors.up.isDown && this.body.blocked.down ) {
        this.body.velocity.y = -425;
      }
    }
    
  }
  
}
