/**
 * index.ts
 */
/// <reference path="../../../typings/index.d.ts" />
'use strict';

const WIDTH = 600;
const HEIGHT = 400;

let cursors = undefined;
let direction = 'right';
let game = undefined;
let platforms = undefined;
let player = undefined;

$(document).ready(init);

/**
 * 
 */
function init(): void {
  game = new Phaser.Game( WIDTH, HEIGHT, Phaser.AUTO, '', { 
    preload: preload, create: create, update: update } );
}

/**
 * 
 */
function preload(): void {
  
  game.load.image('sky', '/assets/background.png');
  game.load.image('whitehouse', '/assets/whitehouse.png');
  game.load.spritesheet('blocks', '/assets/sprites.png', 32, 32);
  game.load.spritesheet('trump', '/assets/trump.png', 32, 32);
  
}

/**
 * 
 */
function create(): void {
  
  game.physics.startSystem(Phaser.Physics.ARCADE);
  let sky = game.add.sprite(0, 0, 'sky');
  sky.scale.setTo(1.3,1.3);
  
  platforms = game.add.group();
  platforms.enableBody = true;
  
  for (let i=0; i<10; i++) {
    let ground = platforms.create(32*i, game.world.height - 32, 'blocks');
    ground.frame = 15;
    ground.body.immovable = true;
  }
  
  player = game.add.sprite(32, game.world.height - 150, 'trump');
  game.physics.arcade.enable(player);
  
  player.body.bounce.y = 0.1;
  player.body.gravity.y = 500;
  player.body.collideWorldBounds = true;
  
  player.animations.add('right', [1,2], 10, true);
  player.animations.add('left', [3,4], 10, true);
  
  cursors = game.input.keyboard.createCursorKeys();
  
}

/**
 * 
 */
function update(): void {
  
  game.physics.arcade.collide(player, platforms);
  
  player.body.velocity.x = 0;
  
  if ( cursors.left.isDown ) {
    player.body.velocity.x = -150;
    player.animations.play('left');
    direction = 'left';
  } else if ( cursors.right.isDown ) {
    player.body.velocity.x = 150;
    player.animations.play('right');
    direction = 'right';
  } else {
    player.animations.stop();
    player.frame = direction == 'right' ? 0 : 5;
  }
  
  if ( cursors.up.isDown && player.body.touching.down ) {
    player.body.velocity.y = -200;
  }
  
}
