import traderFrames from "./frames/trader-frames.js";
import { subMenuText } from "./sub-menu-text.js";

const gameState = {
  pointer: {},
  textMenu: {},
};

const MENU_ITEMS = [
  { title: "About Me" },
  { title: "What I Do?" },
  { title: "My Blog" },
  { title: "Contact" },
];

const TILE_HEIGHT = 324;

class MainScene extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.loadAssets();
  }

  loadAssets() {
    this.load.image("sky", "assets/1.png");
    this.load.image("ground", "assets/2.png");
    this.load.image("house", "assets/4.png");
    this.load.image("cursor", "assets/cursor.png");

    this.load.spritesheet("traderIdle", "assets/trader/Idle.png", {
      frameWidth: 128,
      frameHeight: 125,
    });

    this.load.spritesheet("traderShow", "assets/trader/show.png", {
      frameWidth: 128,
      frameHeight: 125,
    });

    this.load.image("dialog", "assets/trader/dialog.png");
    this.load.image("soon", "assets/trader/soon.png");
  }

  create() {
    this.createBackground();
    this.createTrader();
    this.setupKeyboardInputs();
  }

  createBackground() {
    gameState.sky = this.add
      .tileSprite(0, 0, this.scale.width, TILE_HEIGHT, "sky")
      .setScale(1.5)
      .setOrigin(0, 0);

    gameState.ground = this.add
      .tileSprite(
        0,
        this.scale.height - TILE_HEIGHT - 100,
        this.scale.width,
        TILE_HEIGHT,
        "ground"
      )
      .setOrigin(0, 0)
      .setScale(1.5);

    gameState.house = this.add
      .tileSprite(
        0,
        this.scale.height - TILE_HEIGHT - 300,
        this.scale.width,
        TILE_HEIGHT,
        "house"
      )
      .setOrigin(0, 0)
      .setScale(2);
  }

  createTrader() {
    gameState.trader = this.add
      .sprite(200, this.scale.height - 200, "traderIdle")
      .setScale(2.5);
    this.createTraderAnimations(this);

    gameState.dialog = this.add
      .image(290, this.scale.height - 260, "dialog")
      .setScale(0.6);
  }

  createTraderAnimations(scene) {
    scene.anims.create({
      key: "idle",
      frames: traderFrames,
      frameRate: 7,
      repeat: -1,
      repeatDelay: 1000,
    });

    scene.anims.create({
      key: "showMerchant",
      frames: scene.anims.generateFrameNumbers("traderShow", {
        start: 0,
        end: 10,
      }),
      frameRate: 7,
      repeat: 0,
    });

    gameState.trader.anims.play("idle", true);
  }

  setupKeyboardInputs() {
    gameState.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on("keydown", this.handleKeydown, this);
    this.input.on(
      "pointerdown",
      () => {
        gameState.soonDialog?.destroy();
        gameState.subMenuContainer?.destroy();
      },
      this
    );
  }

  handleKeydown(event) {
    gameState.soonDialog?.destroy();
    gameState.subMenuContainer?.destroy();

    if (event.key === "Escape" && gameState.open) {
      gameState.subMenuContainer.destroy();
    }

    if (event.key === "Enter" && gameState.open) {
      // When is a link
      if (subMenuText[gameState.currentPointerIndex]?.isLink) {
        return window.open(subMenuText[gameState.currentPointerIndex].href);
      }

      // soon link
      if (subMenuText[gameState.currentPointerIndex]?.soon) {
        gameState.soonDialog?.destroy();
        gameState.soonDialog = this.add
          .image(290, this.scale.height - 250, "soon")
          .setScale(0.6);
        return;
      }

      gameState.subMenuContainer = this.add.container(0, 0);

      gameState.subMenu = this.add
        .rectangle(650, 250, 420, 300, 0x000000, 0.9)
        .setStrokeStyle(5, 0xffffff);

      gameState.subMenuText = this.add.text(
        460,
        130,
        subMenuText[gameState.currentPointerIndex]?.text,
        {
          maxLines: 10,
          lineSpacing: 12,
          wordWrap: { width: 400 },
        }
      );

      gameState.subMenuContainer.add([
        gameState.subMenu,
        gameState.subMenuText,
      ]);
    }

    if (gameState.subMenuContainer?.active) return null;

    if (
      event.key === "ArrowDown" &&
      gameState.open &&
      gameState.currentPointerIndex < MENU_ITEMS.length - 1
    ) {
      this.navigateMenu(1);
    } else if (
      event.key === "ArrowUp" &&
      gameState.open &&
      gameState.currentPointerIndex > 0
    ) {
      this.navigateMenu(-1);
    } else if (event.key === "x" && !gameState.open) {
      this.showTraderMenu();
    }
  }

  navigateMenu(direction) {
    gameState.pointer[gameState.currentPointerIndex].setVisible(false);
    gameState.currentPointerIndex += direction;
    gameState.pointer[gameState.currentPointerIndex].setVisible(true);
  }

  showTraderMenu() {
    gameState.dialog.visible = false;
    gameState.open = true;

    gameState.trader.anims
      .setCurrentFrame(gameState.trader.anims.currentAnim.frames[10])
      .stop();

    gameState.trader.anims
      .play("showMerchant", true)
      .on("animationcomplete", () => {
        this.createMainMenu();
      });
  }

  createMainMenu() {
    gameState.mainMenu = this.add
      .rectangle(350, 150, 420, 300, 0x000000, 0.9)
      .setStrokeStyle(5, 0xffffff)
      .setOrigin(0, 0);

    this.add.text(
      390,
      gameState.mainMenu.y + 30,
      "Hello I'm Lucas Michailian!",
      {
        fontSize: "18px",
        color: "#ffffff",
      }
    );

    MENU_ITEMS.forEach((item, index) => {
      gameState.currentPointerIndex = 0;
      gameState.pointer[index] = this.add
        .image(370, gameState.mainMenu.y + 90 + index * 50, "cursor")
        .setScale(0.5)
        .setVisible(index === 0);

      gameState.textMenu[index] = this.add.text(
        390,
        gameState.mainMenu.y + 80 + index * 50,
        item.title,
        {
          fontSize: "18px",
          color: "#ffffff",
        }
      );

      gameState.textMenu[index].setInteractive();
      gameState.textMenu[index].on("pointerdown", () => {
        Object.keys(gameState.pointer).forEach((index) => {
          gameState.pointer[index].setVisible(false);
        });

        gameState.currentPointerIndex = index;
        gameState.pointer[index].setVisible(true);
      });
    });
  }

  update() {
    gameState.sky.tilePositionX += 0.07;
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: "body",
  scene: MainScene,
  backgroundColor: "#626d7c",
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: {
      arcade: {
        gravity: { y: 200 },
      },
    },
  },
};

const game = new Phaser.Game(config);
