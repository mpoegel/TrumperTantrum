'use strict';
$.getScript('/libs/enchant.min.js', ready);

var HEIGHT = 320,
    WIDTH = 320;

var scenes = [],
    terrain = [],
    forward = true,
    posX = 0;

function ready() {
  enchant(); // initialize
  var game = new Core(HEIGHT, WIDTH); // game stage
  game.preload('/assets/sprites.png'); // preload image
  game.fps = 20;
  game.keybind(65, 'left');	
  game.keybind(68, 'right');
  game.keybind(87, 'up');
  game.keybind(83, 'down');

  game.onload = function() {
    var scene = new Scene();
    var bear = new Sprite(32, 32);
    bear.image = game.assets['/assets/sprites.png'];
    
    $.get('/assets/levels/0.json', function(level) {
      for (var td=0; td<level.terrain.length; td++) {
        for (var r=0; r<level.terrain[td].span; r++) {
          var t = new Sprite(32,32);
          t.image = game.assets['/assets/sprites.png'];
          t.x = level.terrain[td].x + r*32;
          t.y = level.terrain[td].y;
          t.frame = level.terrain[td].frames;
          t.name = level.terrain[td].name;
          scene.addChild(t);
          terrain.push(t);
        }
      }
    });
    
    
    scene.addChild(bear);
    game.pushScene(scene);
    bear.frame = [1, 1, 2, 2];   // select sprite frame
    bear.y = 200;
    bear.x = WIDTH / 2;
    bear.dy = 0;
    bear.dx = 0;
    bear.jump = 0;

    // bear.tl.moveBy(288, 0, 90)   // move right
    //     .scaleTo(-1, 1, 10)      // turn left
    //     .moveBy(-288, 0, 90)     // move left
    //     .scaleTo(1, 1, 10)       // turn right
    //     .loop();                 // loop it
    
    game.addEventListener('enterframe', function() {
      if (game.input.right) {
        if (bear.x >= WIDTH/2) {
          bear.dx = 5;
        } else {
          bear.x += 5;
          bear.dx = 0;
        }
        if (! forward) {
          bear.tl.scaleTo(1, 1, 3);
          forward = !forward;
        }
        bear.frame = [1, 1, 2, 2];
      } else if (game.input.left && bear.x > 0) {
        if (posX <= 0) {
          bear.x -= 5;
          bear.dx = 0;
        } else {
          bear.dx = -5;
        }
        if (forward) {
          bear.tl.scaleTo(-1, 1, 3);
          forward = !forward;
        }
        bear.frame = [1, 1, 2, 2];
      } else {
        bear.dx = 0;
        bear.frame = [0];
      }
      posX += bear.dx;
      if (game.input.up && bear.jump < 3) {
        bear.dy -= 5;
        bear.jump++;
      }
      bear.y += bear.dy
      bear.dy += 1;
      
      for (var t=0; t<terrain.length; t++) {
        // check for collisions with the terrain
        if (terrain[t].name === "ground") {
          if (bear.intersect(terrain[t])) {
            bear.y = terrain[t].y-32;
            bear.dy = 0;
            bear.jump = 0;
          }
        } else if (terrain[t].name === "block") {
          if (bear.intersect(terrain[t])) {
            if (bear.dy > 0) {
              bear.y = terrain[t].y-32;
              bear.jump = 0;
            } else {
              bear.y = terrain[t].y+32;
            }
            bear.dy = 0;
          }
        }
        // slide the terain
        terrain[t].x -= bear.dx;
      }
    });
    
    
  };
  game.start(); // start your game!
}
