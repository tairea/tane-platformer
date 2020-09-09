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
      gravity: { y: 500 },
      debug: true
    }
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image(
    "ground",
    "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fspritesheet_ground.png?v=1597798791918"
  );
  this.load.image(
    "tiles",
    "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fspritesheet_tiles.png?v=1597798793579"
  );
  this.load.image(
    "background",
    "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fbackground.png?v=1597805558340"
  );
  
  this.load.image(
    "spike",
    "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fspikes.png?v=1599014843516"
  );
  this.load.image("detailTiles", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fspritesheet_tiles.png?v=1597798793579");
  
  // ====================== player (atlas) =============================
   this.load.atlas(
    "player",
    "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fkenney_player.png?v=1598396905743",
    "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fkenney_player_atlas.json?v=1598396922994"
  );
  
  // ====================== Tiled JSON map =============================
  this.load.tilemapTiledJSON(
    "map",
    "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Ftest-map-2.json?v=1599013155306"
  );
}

function create() {
  
  // ====================== background =============================
  const backgroundImage = this.add.image(0, 0, "background").setOrigin(0, 0);
  backgroundImage.setScale(2, 0.8);
  
  // ====================== map =============================
  const map = this.make.tilemap({ key: "map" });
  const tileset = map.addTilesetImage("spritesheet_ground", "ground");
  
  // ====================== platforms =============================
  const platforms = map.createStaticLayer("Platforms", tileset, 0, 0).setOrigin(0,0);
  platforms.setCollisionByExclusion(-1, true);
  platforms.setScale(0.25, 0.25);

  // ====================== player =============================
  this.player = this.physics.add.sprite(50, 300, "player");
  this.player.setBounce(0.001);
  this.player.setScale(0.25, 0.25)
  
  // ====================== get the level rectangle =============================
  const level1Rec = map.findObject("level", obj => obj.name === "level1");
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
 
  // ====================== Colliders ======================
  this.physics.add.collider(this.player, platforms);

  
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

  
  // ====================== Adding map layers ======================
  
  // --------- Spikes ----------
  // Create a sprite group for all spikes, set common properties to ensure that sprites in the group don't move via gravity or by player collisions
  this.stuff = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });

  // Let's get the spike objects, these are NOT sprites
  let spikeObjects = map.getObjectLayer("Spikes")["objects"];
  console.log(spikeObjects)

  // Now we create spikes in our sprite group for each object in our map
  spikeObjects.forEach(spikeObject => {
    // Add new spikes to our sprite group, change the start y position to meet the platform
    let spike = this.stuff
      .create(spikeObject.x, spikeObject.y + 200 - spikeObject.height, "spike")
      .setOrigin(0, 0)
      .setScale(0.25, 0.25);
    
    spike.body.setSize(spike.width, spike.height - 20).setOffset(0, 30);
  });
  
  let detailObjects = map.getObjectLayer("Detail")["objects"];
  
  detailObjects.forEach(detailObject => {
    // Add new spikes to our sprite group, change the start y position to meet the platform
    let detail = this.stuff
      .create(detailObject.x, detailObject.y + 200 - detailObject.height, "detailTiles")
      .setOrigin(0, 0)
  });
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
  if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
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

}

