let config = {
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    physics: {
        default: "arcade"
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let ball;
let platform;
let blocks;

let left;
let right;

let game = new Phaser.Game(config);

function preload() {
    this.load.image("ball", "res/ball.png");
    this.load.image("particle", "res/particle.png");
    this.load.image("platform", "res/platform.png");
    this.load.image("block", "res/block.png");
}

function create() {
    this.physics.world.setBoundsCollision(true, true, true, false);

    ball = this.physics.add.image(200, 150, "ball");

    ball.setBounce(1);
    ball.setCollideWorldBounds(true);

    ball.setVelocity(0, 100);

    let particles = this.add.particles("particle");

    let emitter = particles.createEmitter({
        speed: 10,
        scale: {
            start: 1,
            end: 0
        },
        alpha: {
            start: 1,
            end: 0
        }
    });

    emitter.startFollow(ball);

    platform = this.physics.add.image(200, 250, "platform");

    platform.setImmovable(true);
    platform.setCollideWorldBounds(true);
    platform.body.checkCollision = {
        up: true,
        down: false,
        left: false,
        right: false
    };
    platform.body.customSeparateX = true;
    platform.body.customSeparateY = true;

    left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    this.physics.add.collider(ball, platform, onPlatformCollision, null, this);

    blocks = this.physics.add.staticGroup({
        key: "block",
        quantity: 32,
        gridAlign: {
            width: 8,
            height: 4,
            cellWidth: 40,
            cellHeight: 20,
            x: 60,
            y: 45
        }
    });

    this.physics.add.collider(ball, blocks, onBlockCollision, null, this);
}

function onPlatformCollision(ball, platform) {
    ball.x -= ball.body.overlapX;
    ball.y -= ball.body.overlapY;

    let angle = (ball.x - platform.x) / 100 * Math.PI / 2;

    ball.setVelocity(100 * Math.sin(angle), -100 * Math.cos(angle));
}

function onBlockCollision(ball, block) {
    block.disableBody();

    this.add.tween({
        targets: block,
        duration: 500,
        alpha: 0,
        onComplete: () => {
            block.setActive(false);
            block.setVisible(false);
        }
    });
}

function update() {
    if (left.isDown) {
        platform.setVelocityX(-200);
    }
    else if (right.isDown) {
        platform.setVelocityX(200);
    }
    else {
        platform.setVelocityX(0);
    }

    if (ball.y > 400) {
        ball.x = 200;
        ball.y = 150;

        ball.setVelocity(0, 100);

        platform.x = 200;
        platform.y = 250;
    }
}