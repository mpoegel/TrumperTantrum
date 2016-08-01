/**
 * game.ts
 */
/// <reference path="../../../typings/index.d.ts" />
'use strict';

module TrumperTantrum {
  
  export class Game extends Phaser.Game {
    
    constructor()
    {
      
      super(600, 400, Phaser.AUTO, '', null);
      
      this.state.add('Boot', Boot, false);
      this.state.add('Preloader', Preloader, false);
      this.state.add('Level0', Level0, false);
      
      this.state.start('Boot');
          
    }
    
  }
  
}