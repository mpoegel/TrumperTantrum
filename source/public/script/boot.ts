/**
 * boot.ts
 */
/// <reference path="../../../typings/index.d.ts" />
'use strict';

module TrumperTantrum {
  
  export class Boot extends Phaser.State {
    
    preload() 
    {      
      // foo      
    }
    
    create() 
    {      
      this.input.maxPointers = 1;
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;
      if ( this.game.device.desktop ) {
        // desktop settings
        
      } else {
        // mobile settings
        
      }
      this.game.state.start('Preloader', true, false);
    }
        
  }
  
}

