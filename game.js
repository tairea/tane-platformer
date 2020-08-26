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
  this.load.atlas(
    "player",
    "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fkenney_player.png?v=1598396905743",
    "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fkenney_player_atlas.json?v=1598396922994"
  );
  // Load the export Tiled JSON
  this.load.tilemapTiledJSON(
    "map",
    "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2FMap%202.json?v=1598399322987"
  );
}

function create() {
  const backgroundImage = this.add.image(0, 0, "background").setOrigin(0, 0);
  backgroundImage.setScale(2, 0.8);

  const map = this.make.tilemap({ key: "map" });

  const tileset = map.addTilesetImage("spritesheet_ground", "ground");

  const platforms = map.createStaticLayer("Platforms", tileset, 0, 200);
  platforms.setCollisionByExclusion(-1, true);
  platforms.setScale(0.25, 0.25);

  this.player = this.physics.add.sprite(50, 300, "player");
  this.player.setBounce(0.1);
  this.player.setCollideWorldBounds(true);
  this.physics.add.collider(this.player, platforms);
  this.player.setScale(0.5, 0.5);
  
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
    key: "jump",
    frames: [{ key: "player", frame: "robo_player_1" }],
    frameRate: 10
  });
  
  this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  this.cameras.main.startFollow(this.player);
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
  
}
