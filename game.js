;;/*
Map size:
width: 100 tiles (128x128 each)
height: 14

w: 12800
h: 

*/

const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: 800,
  heigth: 640,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload,
    create,
    update
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false  
    }
  }
};

const game = new Phaser.Game(config);

function preload() {
  
  // ====================== tilesheets =============================
  this.load.image( "ground", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fspritesheet_ground.png?v=1597798791918" );
  this.load.image( "tiles", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fspritesheet_tiles.png?v=1597798793579" );
  
  // ====================== images =============================
  this.load.image( "background", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fbackground.png?v=1597805558340" );
  this.load.image( "spike", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fspikes.png?v=1599014843516" );
  this.load.image( "lavaSquare", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Flava.png?v=1599615845811" );
  this.load.image( "lavaWave", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2FlavaTop_high.png?v=1599615843450" );
  
  // ====================== player (atlas) =============================
   this.load.atlas( "player", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fkenney_player.png?v=1598396905743", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fkenney_player_atlas.json?v=1598396922994" );
  
  // ====================== Tiled JSON map ===========================
   this.load.tilemapTiledJSON("map", "")
 // this.load.tilemapTiledJSON( "map", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d6 3;3:5343%2Ftest-map-2.3.json?v=1599616815139" );
  
}

function create() {
  
  // ====================== player =============================
  this.player = this.physics.add.sprite(50, 100, "player");
  this.player.setBounce(0.1);
  this.player.setScale(0.25, 0.25)
  this.player.setDepth(100)
  
  // ====================== background =============================
  const backgroundImage = this.add.image(0, 0, "background").setOrigin(0, 0);
  backgroundImage.setScale(2, 0.8);
  backgroundImage.setScrollFactor(0.2)
  
  // ====================== map =============================
  const map = this.make.tilemap({ key: "map" });
  
  
  // ====================== tilesets =============================
  const groundTileset = map.addTilesetImage("spritesheet_ground", "ground");
  const detailTiles = map.addTilesetImage("spritesheet_tiles", "tiles");
  
  // ====================== get the level rectangle =============================
  const level1Rec = map.findObject("levels", obj => obj.name === "level1");
  console.log(level1Rec.width)
  console.log(level1Rec.height)
  
  // ====================== world physics =============================
  this.physics.world.bounds.width = level1Rec.width;
  this.physics.world.bounds.height = level1Rec.height;
  this.player.setCollideWorldBounds(true);
  
  // ====================== Camera ======================
  this.cameras.main.setBounds(level1Rec.x, level1Rec.y, level1Rec.width, level1Rec.height, true);
  // Set camera follow player
  this.cameras.main.startFollow(this.player);
  // Set camera fade in
  this.cameras.main.fadeIn(2000, 0, 0, 0);
  this.cameras.main.setZoom(2);
  
  // ====================== Animations ======================
  this.anims.create({
    key: "walk",
    frames: this.anims.generateFrameNames("player", {
      prefix: "robo_player_",
      start: 2,
      end: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: "idle",
    frames: [{ key: "player", frame: "robo_player_0" }],
    frameRate: 10
  });

  this.anims.create({
    key: "jump",
    frames: [{ key: "player", frame: "robo_player_1" }],
    frameRate: 10
  });

  // ====================== Controls ======================
  this.cursors = this.input.keyboard.createCursorKeys();

  
  
  
  // ====================== MAP LAYERS =============================
  
  //----- platforms
  const platforms = map.createStaticLayer("Platforms", groundTileset, 0, 0).setOrigin(0,0);
  platforms.setCollisionByExclusion(-1, true);
  platforms.setScale(0.25, 0.25);
  
  
  //----- object layers
  
  // groups
  this.badStuff = this.physics.add.group({allowGravity: false,immovable: true});
  
  // objects from map
  var lavaObjs = map.createFromObjects('Lava', 148, { key: 'lavaSquare' });
  var spikesObjs = map.createFromObjects('Spikes', 250, { key: 'spike' });
  
  console.log('lavaObjs',lavaObjs)
  console.log('spikesObjs',spikesObjs)
  
  lavaObjs.forEach(lavaObject => {
    let lava = this.badStuff.create(lavaObject.x * 0.25, lavaObject.y  * 0.25, 'lavaSquare').setScale(0.25,0.25)
  });
  
  spikesObjs.forEach(spikeObject => {
    let spike = this.badStuff.create(spikeObject.x * 0.25, spikeObject.y  * 0.25, 'spike').setScale(0.25,0.25)
  });
  
  // other functions to get objects
  // let lavaWaves = map.getObjectLayer("Lava")["objects"];
  // let lavaWaves = map.findObject("Lava", obj => obj.type == "lavaWave");
  
  
  // ====================== Colliders ======================
  this.physics.add.collider(this.player, platforms);
  
  //TODO: 
  // collider with badStuff, call playerHit function
  // this.physics.add.collider(this.player, this.badStuff, playerHit, null, this);
  
}



function update() { 
  // Control the player with left or right keys
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-200);
    if (this.player.body.onFloor()) {
      this.player.play('walk', true);
    }
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(200);
    if (this.player.body.onFloor()) {
      this.player.play('walk', true);
    }
  } else {
    // If no keys are pressed, the player keeps still
    this.player.setVelocityX(0);
    // Only show the idle animation if the player is footed
    // If this is not included, the player would look idle while jumping
    if (this.player.body.onFloor()) {
      this.player.play('idle', true);
    }
  }

  // Player can jump while walking any direction by pressing the space bar
  // or the 'UP' arrow
  if ((this.cursors.space.isDown || this.cursors.up.isDown ) && this.player.body.onFloor()) {
    this.player.setVelocityY(-350);
    this.player.play('jump', true);
  }
  
  // flip player
  if (this.player.body.velocity.x > 0) {
    this.player.setFlipX(false);
  } else if (this.player.body.velocity.x < 0) {
    // otherwise, make them face the other side
    this.player.setFlipX(true);
  }
  
  console.log(this.player.x, this.player.y)
  
}

https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Ftest-map-2.4.json?v=1600219625072