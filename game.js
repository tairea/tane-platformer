const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  heigth: 640,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: true,
    },
  }
};

const game = new Phaser.Game(config);

  function preload() { 
  this.load.image('ground', 'https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fspritesheet_ground.png?v=1597798791918');
  this.load.image('tiles', 'https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fspritesheet_tiles.png?v=1597798793579');
  this.load.image('background', ' https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fbackground.png?v=1597805558340');
   
  // Load the export Tiled JSON
  this.load.tilemapTiledJSON('map', 'https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Ftest-map.json?v=1597805515636');
}

function create() { 
  const backgroundImage = this.add.image(0, 0,'background').setOrigin(0,0);
  backgroundImage.setScale(2, 0.8);
  
  const map = this.make.tilemap({ key: 'map' });
  
  const tileset = map.addTilesetImage('spritesheet_ground', 'ground');
  
  const platforms = map.createStaticLayer('Platforms', tileset, 0, 200);
  
  platforms.setScale(0.25, 0.25);
}

function update() { 

  }