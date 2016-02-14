'use strict';
$.getScript('/libs/enchant.min.js', ready);

var HEIGHT = 320,
    WIDTH = 320,
    U_HEIGHT = 32,
    U_WIDTH = 20

var scenes = [],
    terrain = [],
    hair = [],
    f_projectiles = [],
    enemies = [],
    forward = true,
    posX = 0;

var Q_DOWN = false;

function loadLevel(game, scene) {
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
    for (var d=0; d<level.hair.length; d++) {
      for (var r=0; r<level.hair[d].span; r++) {
        var h = new Sprite(32,32);
        h.image = game.assets['/assets/sprites.png'];
        h.x = level.hair[d].x + r*32;
        h.y = level.hair[d].y;
        h.frame = [10, 10, 10, 10, 11, 11, 11, 11, 10, 10, 10, 10, 
          12, 12, 12, 12];
        scene.addChild(h);
        hair.push(h);
      } 
    }
    for (var d=0; d<level.enemies.length; d++) {
      var e = new Sprite(32, 32);
      e.image = game.assets['/assets/sprites.png'];
      e.x = level.enemies[d].x;
      e.y = level.enemies[d].y;
      e.frame = level.enemies[d].frames;
      e.tl.moveBy(level.enemies[d].range, 0, level.enemies[d].speed)
          .scaleTo(-1, 1, level.enemies[d].speed / 5)      // turn left
          .moveBy(level.enemies[d].range * -1, 0, level.enemies[d].speed)
          .scaleTo(1, 1, level.enemies[d].speed / 5)       // turn right
          .loop();                 // loop it
      scene.addChild(e);
      enemies.push(e);
    }
  });
}

function ready() {
  enchant(); // initialize
  var game = new Core(HEIGHT, WIDTH); // game stage
  game.preload('/assets/sprites.png'); // preload image
  game.preload('/assets/audio/what_am_I_saying.mp3');
  game.fps = 20;
  game.keybind(65, 'left');	
  game.keybind(68, 'right');
  game.keybind(87, 'up');
  game.keybind(83, 'down');
  game.keybind(81, 'money');
  game.keybind(82, 'yell');

  game.onload = function() {
    var scene = new Scene();
    var bear = new Sprite(U_WIDTH, U_HEIGHT);
    bear.image = game.assets['/assets/sprites.png'];
    var score = new Label('Score: 0');
    score.val = 0;
    score.x = 5;
    score.y = 5;
    scene.addChild(score);    
    
    scene.addChild(bear);
    game.pushScene(scene);
    bear.frame = [1, 1, 2, 2];   // select sprite frame
    bear.y = 200;
    bear.x = WIDTH / 2;
    bear.dy = 0;
    bear.dx = 0;
    bear.jump = 0;
    
    loadLevel(game, scene);
    
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
      
      /* attacks */
      if (game.input.money && ! Q_DOWN) {
        var m = new Sprite(32,32);
        m.image = game.assets['/assets/sprites.png'];
        m.x = bear.x;
        m.y = bear.y;
        m.frame = [13];
        var dest = forward ? 100 : -100;
        m.tl.moveBy(dest, 0, 10)
            .then(function() {
              f_projectiles.splice(m, 1);
            })
            .removeFromScene();
        f_projectiles.push(m);
        scene.addChild(m);
        Q_DOWN = true;
      } else if (! game.input.money) {
        Q_DOWN = false;
      }
      if (game.input.yell) {
        game.assets['/assets/audio/what_am_I_saying.mp3'].play();
        bear.frame = [3];
      }
      
      /* collisions */
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
            if (bear.y <= terrain[t].y - 16) {
              bear.y = terrain[t].y-32;
              bear.jump = 0;
              bear.dy = 0;
            } else {
              bear.y = terrain[t].y+32;
            }
            bear.dy = 0;
          }
        }
        // slide the terain
        terrain[t].x -= bear.dx;
      }
      
      for (var h=0; h<hair.length; h++) {
        if (bear.within(hair[h], 15)) {
          score.val += 10;
          scene.removeChild(hair[h]);
          hair.splice(h, 1);
        } else {
          hair[h].x -= bear.dx;
        }
      }
      
      for (var e=0; e<enemies.length; e++) {
        enemies[e].x -= bear.dx;
        if ( enemies[e].within(bear, 20) ) {
          // GAME OVER!
          var gameover = new Label('GAME OVER');
          gameover.x = WIDTH / 5;
          gameover.y = HEIGHT / 3;
          gameover.font = '32px bold Helvetica,Arial,sans-serif';
          scene.addChild(gameover);
          var subtitle = new Label('Press Enter to Restart');
          subtitle.x = WIDTH / 3.2;
          subtitle.y = HEIGHT / 2.2;
          scene.addChild(subtitle);
          $(document).on('keydown', function(event) {
            if (event.which === 13) {
              restart(scene);
              $(document).off();
            }
          });
          game.stop();
        }
      }
      
      for (var p=0; p<f_projectiles.length; p++) {
        f_projectiles[p].x -= bear.dx;
        var hit = false;
        for (var e=0; e<enemies.length; e++) {
          if (f_projectiles[p].within(enemies[e], 10)) {
            scene.removeChild( f_projectiles[p] );
            f_projectiles.splice(p, 1);
            scene.removeChild( enemies[e] );
            enemies.splice(e, 1);
            hit = true;
            score.val += 50;
            continue;
          }
        }
        if (hit) {
          continue;
        }
      }
      
      score.text = "Score: " + score.val;
    });
    
  };
  game.start(); // start your game!
}

function restart(scene) {
  scenes = [];
  terrain = [];
  hair = [];
  f_projectiles = [];
  enemies = [];
  forward = true;
  posX = 0;
  scene.remove();
  ready();
}