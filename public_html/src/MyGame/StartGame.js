/*
 * File: UIDemo.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function StartGame() {
    this.kHealthBar = "assets/UI/healthbar.png";
    this.kUIButton = "assets/UI/button.png";
    this.kBG = "assets/Game/forest.png";
    this.kBG_i = "assets/Game/forest_i.png";
    this.kCharacters = "assets/Game/characters.png";
    this.kCharacters_i = "assets/Game/characters_i.png";
    this.kMoon = "assets/Game/moon.png";
    this.kObstacle = "assets/Game/obstacle.png";

    // The camera to view the scene
    this.mCamera = null;
    this.bg = null;
    this.bgs = null;
    this.UIText = null;
    this.UITextBox = null;
    this.UIhealthBar = null;
    this.backButton = null;
    this.cameraFlip = false;
    this.endGame = false;

    this.prevTime = new Date();
    this.currTime = new Date();
    this.time = 0;

    this.bgNum = 10;

    // Hero
    this.mHero = null;

    // Magic Bullet
    this.mBulletSetSet = null;

    // Monsters
    this.mMonsters = null;

    // Light Set
    this.mGlobalLightSet = null;

    // Moon
    this.mMoon = null;
    this.moonDelta = 0;
    this.moonChangeRate = 0;

    this.mObstacles = null;

    this.mMsg = null;

}
gEngine.Core.inheritPrototype(StartGame, Scene);


StartGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kHealthBar);
    gEngine.Textures.loadTexture(this.kUIButton);
    gEngine.Textures.loadTexture(this.kBG);
    gEngine.Textures.loadTexture(this.kBG_i);
    gEngine.Textures.loadTexture(this.kCharacters);
    gEngine.Textures.loadTexture(this.kCharacters_i);
    gEngine.Textures.loadTexture(this.kMoon);
    gEngine.Textures.loadTexture(this.kObstacle);
};

StartGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kHealthBar);
    gEngine.Textures.unloadTexture(this.kUIButton);
    gEngine.Textures.unloadTexture(this.kBG);
    gEngine.Textures.unloadTexture(this.kBG_i);
    gEngine.Textures.unloadTexture(this.kCharacters);
    gEngine.Textures.unloadTexture(this.kCharacters_i);
    gEngine.Textures.unloadTexture(this.kMoon);
    gEngine.Textures.unloadTexture(this.kObstacle);
    gEngine.Core.startScene(new MyGame());
};

StartGame.prototype.initialize = function () {

    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

    // init Light Set
    this._initializeLights(); // called from Level Light file

    // init Game UI
    this._initUI();

    // init BackGround with Light
    this._initBackGround();

    // init hero
    var maxX = this.bgs[this.bgNum - 1].getXform().getXPos() + this.bgs[this.bgNum - 1].getXform().getWidth() / 2;
    this.mHero = new Hero(this.kCharacters, this.kCharacters_i, 10, 21, maxX, this.mGlobalLightSet);

    // init bullet set
    this.mBulletSet = new MagicBulletSet();

    // init monster
    this.mMonsters = new MonsterSet();
    this.mMoon = new Moon(this.kMoon, this.mGlobalLightSet);

    this.moonDelta = this.mMoon.getXform().getXPos() - this.mCamera.getWCCenter()[0];
    this.moonChangeRate = 0.05;

    this.mObstacles = new ObstacleSet();

    //setting floor
    var obstacle = new Obstacle(50, 9, 100, 13.75, 0, .9, this.kObstacle, this.mHero, true);
    this.mObstacles.addToSet(obstacle);

    //100*10 = 1000

    for (var i = 0; i < 5; i++) {
        var randX = 50 + Math.random() * 500;
        var Y = 25;
        var obstacle = new Obstacle(randX, Y, 10, 3, 0, .9, this.kObstacle, this.mHero, false);
        this.mObstacles.addToSet(obstacle);
    }

    for (var i = 0; i < 5; i++) {
        var randX = 50 + Math.random() * 500;
        var Y = 30;
        var obstacle = new Obstacle(randX, Y, 10, 3, 0, .9, this.kObstacle, this.mHero, false);
        this.mObstacles.addToSet(obstacle);
    }

};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
StartGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    for (var i = 0; i < this.bgNum; i++) {
        this.bgs[i].draw(this.mCamera);
    }
    this.UIText.draw(this.mCamera);
    this.backButton.draw(this.mCamera);
    this.UIhealthBar.draw(this.mCamera);

    this.mMonsters.draw(this.mCamera);
    this.mHero.draw(this.mCamera);

    this.mMoon.draw(this.mCamera);
    this.mBulletSet.draw(this.mCamera);

    this.mObstacles.draw(this.mCamera);

    // For Testing:
    this.mMsg.draw(this.mCamera);   // only draw status in the main camera
};

StartGame.prototype.update = function () {
    this.mObstacles.update();
    this.backButton.update();
    this.UIhealthBar.update();
    // #region ----------------- Moon Interpolation -----------------
    this.mMoon.update();
    var maxX = this.bgs[this.bgNum - 1].getXform().getXPos() - 15;
    if (this.mHero.getXform().getXPos() > 50 && this.mHero.getXform().getXPos() < maxX) {
        this.mCamera.panTo(this.mHero.getXform().getXPos(), this.mCamera.getWCCenter()[1]);
        //this.moonDelta -= this.moonChangeRate;

        this.mMoon.getXform().setPosition(this.mCamera.getWCCenter()[0] + this.moonDelta,
            this.mMoon.getXform().getYPos());
        this.mObstacles.mSet[0].getXform().setXPos(this.mHero.getXform().getXPos());

    }

    // ----------------- Update Moon Light -----------------
    var moonLight = vec2.clone(this.mMoon.getXform().getPosition());
    this.mGlobalLightSet.getLightAt(1).set2DPosition(moonLight);
    this.mCamera.update();
    // #endregion


    // #region ----------------- Hero Support -------------------
    this.mHero.update(this.UIhealthBar);
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        var heroXPos = this.mHero.getXform().getXPos();
        var heroYPos = this.mHero.getXform().getYPos();
        var bullet = new MagicBullet(this.mHero.getDirection(), heroXPos + 2, heroYPos - 2);
        this.mBulletSet.addToSet(bullet);
    }
    this.mBulletSet.update(true, null);
    this.mBulletSet.delete(this.mCamera); // check if the bullet should be deleted or nah.

    // ----------------- Update Hero Light -----------------
    var heroLight = vec2.clone(this.mHero.getXform().getPosition());
    this.mGlobalLightSet.getLightAt(0).set2DPosition(heroLight);

    // ----------------- Check if hero is killed or not -----------------
    if (this.mHero.deleteYet()) {
        this.endGame = true;
    }
    // #endregion


    // #region ----------------- Randomly spawn Monster -----------------
    this.currTime = new Date();
    if (this.currTime - this.prevTime >= this.time) {
        var monsterType = Math.floor(Math.random() * Math.floor(4));
        var monsterOrigin = this.mCamera.getWCCenter()[0] + this.mCamera.getWCWidth() / 2 + 5;
        var monster = new Monster(this.kCharacters, this.kCharacters_i, this.mHero, monsterOrigin, 21, monsterType);
        this.mMonsters.addToSet(monster);
        this.prevTime = this.currTime;
        this.time = 3000 + Math.random() * 4000;
    }
    this.mMonsters.update();
    this.mMonsters.delete(this.mCamera);
    // Check if collision with anything
    var h = [];
    this.mMonsters.pixelTouches(this.mHero, this.mBulletSet, h);
    // #endregion


    // #region ----------------- End Game -----------------
    if (this.endGame) {

    }
    // #endregion


    // #region ----------------- For Testing -----------------
    this.mMsg.getXform().setPosition(this.mHero.getXform().getPosition()[0], this.mHero.getXform().getPosition()[1] + 20);
    var msg = "Bullet=" + this.mBulletSet.size() + " Monsters=" + this.mMonsters.size();
    this.mMsg.setText(msg)
    // #endregion
};

StartGame.prototype.UITextBoxTest = function () {
    this.UIText.setText(this.UITextBox.getEnteredValue());
};

StartGame.prototype.backSelect = function () {
    gEngine.GameLoop.stop();
};

StartGame.prototype._initUI = function () {
    this.UIText = new UIText("Magic Run", [400, 580], 4, 1, 0, [1, 1, 1, 1]);
    this.UITextBox = new UITextBox([500, 200], 6, 35, [1, 1, 1, 1], [0, 0, 0, 1], this.UITextBoxTest, this);
    this.backButton = new UIButton(this.kUIButton, this.backSelect, this, [80, 20], [160, 40], "Go Back", 4, [1, 1, 1, 1], [1, 1, 1, 1]);
    this.UIhealthBar = new UIHealthBar(this.kHealthBar, [100, 560, 3], [180, 40], 3);
    // For testing
    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(50, 30);
    this.mMsg.setTextHeight(3);
    this.UIText = new UIText("Magic Run", [400, 580], 4, 1, 0, [1, 1, 1, 1]);
}

StartGame.prototype._initBackGround = function () {
    this.bg = new LightRenderable(this.kBG);
    this.bg.getXform().setSize(150, 75);
    this.bg.getXform().setPosition(75, 40);
    this.bg.getXform().setZPos(-5);
    for (var i = 0; i < 2; i++) {
        this.bg.addLight(this.mGlobalLightSet.getLightAt(i));
    }

    this.bgs = [this.bg];
    for (var i = 1; i < this.bgNum; i++) {
        var deltaX = this.bgs[i - 1].getXform().getXPos() + this.bgs[i - 1].getXform().getWidth() / 2;
        if (i % 2 === 0) {
            var bg = new LightRenderable(this.kBG);
        } else {
            var bg = new LightRenderable(this.kBG_i);
        }
        this.bgs.push(bg);
        this.bgs[i].getXform().setSize(150, 75);
        this.bgs[i].getXform().setPosition(deltaX + 75, 40);
        this.bgs[i].getXform().setZPos(-5);
        for (var j = 0; j < 2; j++) {
            this.bgs[i].addLight(this.mGlobalLightSet.getLightAt(j));
        }
    }
}