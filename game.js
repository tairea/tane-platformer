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
  this.load.image('tiles', 'https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fspritesheet_ground.png?v=1597798791918);
  this.load.image('tiles', 'https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fspritesheet_tiles.png?v=1597798793579);
  // Load the export Tiled JSON
  this.load.tilemapTiledJSON('map', 'https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Ftest-map.tmx?v=1597798825593');
}

function create() { 

}

function update() { 

}