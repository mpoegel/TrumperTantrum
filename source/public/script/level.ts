/**
 * level.ts
 */
/// <reference path="../../../typings/index.d.ts" />
'use strict';

module TrumperTantrum {
  
  function findObjectsByType(type, map, layerName) {
    let result = new Array();
    map.objects[layerName].forEach(function(element) {
      if (element.properties.type === type) {
        // element.y -= map.tileHeight;
        element.y = 50;
        result.push(element);
      }
    });
    return result;
  }
  
  function createFromTiledObject(element, group) {
    let sprite = group.create(element.x, element.y, element.properties.sprite);
    Object.keys(element.properties).forEach((key) => {
      sprite[key] = element.properties[key];
    });
  }
  
  export class Level0 extends Phaser.State {
    
    map: Phaser.Tilemap;
    backgroundLayer: Phaser.TilemapLayer;
    blockLayer: Phaser.TilemapLayer;
    player: TrumperTantrum.Player;
    cursors: Phaser.CursorKeys;
    hair: Phaser.Group;

    preload()
    {
      this.load.tilemap('level0', '/assets/levels/level0.json', null, 
        Phaser.Tilemap.TILED_JSON);
    }
    
    create() 
    {
      this.physics.startSystem(Phaser.Physics.ARCADE);
      
      this.map = this.game.add.tilemap('level0');
      this.map.addTilesetImage('blocks', 'blocks');
      this.backgroundLayer = this.map.createLayer('background');
      this.blockLayer = this.map.createLayer('blockLayer');
      
      this.map.setCollisionBetween(1, 100, true, 'blockLayer');
      this.backgroundLayer.resizeWorld();
      
      this.loadObjects();
      console.log(this.hair);
      
      this.cursors = this.game.input.keyboard.createCursorKeys();
      this.player = new Player(this.game, this.cursors, 32, 
        this.game.world.height - 150);
      this.game.camera.follow(this.player);
      this.game.physics.arcade.overlap(this.player, this.hair, 
        this.collectHair);
    }
    
    update()
    {
      this.game.physics.arcade.collide(this.player, this.blockLayer, 
        this.playerHit, null, this);
    }
    
    playerHit(player, blockLayer)
    {
      // foo
    }
    
    collectHair(player, hairObject)
    {
      console.log('collect hair');
      // bar
    }
    
    loadObjects()
    {
      this.hair = this.game.add.group();
      this.hair.enableBody = true;
      let result = findObjectsByType('hair', this.map, 'objectLayer');
      console.log(result);
      result.forEach((element) => {
        createFromTiledObject(element, this.hair);
      });
    }
    
  }
  
}
