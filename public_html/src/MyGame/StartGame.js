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
    this.kUIButton = "assets/Game/button.png";
    this.kBG = "assets/Game/forest.png";
    this.kBG_i = "assets/Game/forest_i.png";
    this.kSky = "assets/Game/sky.png";
    this.kCharacters = "assets/Game/characters.png";
    this.kCharacters_i = "assets/Game/characters_i.png";
    this.kMoon = "assets/Game/moon.png";
    this.kObstacle = "assets/Game/obstacle.png";
    //this.kBush = "assets/Game/bush.png";
    
    //letters
    this.kLetters = ["assets/Game/Letters/1_E.png",
                    "assets/Game/Letters/2_S.png",
                    "assets/Game/Letters/3_C.png",
                    "assets/Game/Letters/4_A.png",
                    "assets/Game/Letters/5_P.png",
                    "assets/Game/Letters/6_E.png"]
                
    // Level and Cheats
    this.LevelSelect = null;
    this.mEnterCheat = false;
    this.mEnterCheat2 = false;

    // The camera to view the scene
    this.mCamera = null;
    this.bg = null;
    this.bgs = null;
    this.sky = null;

    // UI Stuffs
    this.UIText = null;
    this.UITextBox = null;
    this.UITextBox1 = null;
    this.UIhealthBar = null;
    this.backButton = null;

    this.cameraFlip = false;
    this.endGame = false;
    this.wonGame = false;

    this.initTime = new Date();
    this.prevTime = new Date();
    this.currTime = new Date();
    this.time = 0;

    this.bgNum = 10;

    // Hero
    this.mHero = null;
    this.mHeroStartPos = null;
    this.mHeroAbleToShoot = true;

    // Magic Bullet
    this.mBulletSet = null;

    // Monsters
    this.mMonsters = null;

    // Light Set
    this.mGlobalLightSet = null;

    // Moon
    this.mMoon = null;
    this.moonDelta = 0;
    this.moonChangeRate = 0;

    //Bush
    //this.mBush = null;
    //this.mBigBush = null;
    
    //letters
    this.letters = [];
    this.smallLetters = [];

    this.mObstacles = null;

    this.mMsg = null;
    this.mRestart = false;
    this.mWin = false;
    this.distTravel = 0;

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
    gEngine.Textures.loadTexture(this.kSky);
    //gEngine.Textures.loadTexture(this.kBush);
    
    for (var i = 0; i < this.kLetters.length; i++){
        gEngine.Textures.loadTexture(this.kLetters[i]);
    }
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
    gEngine.Textures.unloadTexture(this.kSky);
    //gEngine.Textures.unloadTexture(this.kBush);
    
    for (var i = 0; i < this.kLetters.length; i++){
        gEngine.Textures.unloadTexture(this.kLetters[i]);
    }

    if (this.mRestart === true) {
        if (this.LevelSelect === "GameOver") {
            var nextLevel = new EndGame(this.distTravel);  // restart the lvl
            gEngine.Core.startScene(nextLevel);
        }
        else if (this.LevelSelect === "Win") {
            var nextLevel = new WonGame();  // restart the lvl
            gEngine.Core.startScene(nextLevel);
        }

    } else {
        var nextLevel = new MyGame();  // go back to main menu
        gEngine.Core.startScene(nextLevel);
    }
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
    this.mHero = new Hero(this.kCharacters, this.kCharacters_i, 10, 21, maxX, this.mGlobalLightSet, this.UIhealthBar);
    this.mHeroStartPos = this.mHero.getXform().getXPos();
    // init bullet set
    this.mBulletSet = new MagicBulletSet();

    // init monster
    this.mMonsters = new MonsterSet();
    this.mMoon = new Moon(this.kMoon, this.mGlobalLightSet);

    this.moonDelta = this.mMoon.getXform().getXPos() - this.mCamera.getWCCenter()[0];
    this.moonChangeRate = 0.05;

    this.mObstacles = new ObstacleSet();

    /*this.mBush = new LightRenderable(this.kBush);
    this.mBush.getXform().setSize(48, 25);
    this.mBush.getXform().setPosition(80, 29);
    this.bushDelta = this.mBush.getXform().getXPos() - this.mCamera.getWCCenter()[0];

    this.mBigBush = new LightRenderable(this.kBush);
    this.mBigBush.getXform().setSize(48, 30);
    this.mBigBush.getXform().setPosition(80, 31);*/
    

    for (var i = 0; i < this.kLetters.length; i++){
        //setting small letters
        var newLetter = new UITexture(this.kLetters[i], [270 + i*40, 40], [30, 30]);
        this.smallLetters.push(newLetter);
        this.smallLetters[i].makeLight();

        //setting large letters
        var newLetter = new Letter(30 + i*6, 40, this.kLetters[i], this.mHero, this.smallLetters[i]);
        this.letters.push(newLetter);
    }

    //setting floor
    var obstacle = new Obstacle(50, 11, 100, 13.75, 0, .9, this.kObstacle, this.mHero, true);
    this.mObstacles.addToSet(obstacle);

    //100*10 = 1000

    var minPos = 30;
    for (var i = 0; i < 50; i++) {
        var randX = minPos + Math.random() * 50;
        var Y = 29;
        if (0.3 < Math.random() <= 0.6) Y = 32;
        if (Math.random() > 0.6) Y = 35;
        var obstacle = new Obstacle(randX, Y, 10, 3, 0, .9, this.kObstacle, this.mHero, false);
        this.mObstacles.addToSet(obstacle);
        minPos = randX + 10;
    }


};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
StartGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.sky.draw(this.mCamera);

    for (var i = 0; i < this.bgNum; i++) {
        this.bgs[i].draw(this.mCamera);
    }

    this.UIText.draw(this.mCamera);
    this.UITextDistance.draw(this.mCamera);

    if (this.mEnterCheat) {
        this.UITextBox.draw(this.mCamera);
    }

    this.backButton.draw(this.mCamera);
    this.UIhealthBar.draw(this.mCamera);

    var time = new Date();
    if (time - this.initTime > 7000) {
        this.UITextGoal3.draw(this.mCamera);
        this.UITextGoal4.draw(this.mCamera);
    } else if (time - this.initTime > 4000) {
        this.UITextGoal2.draw(this.mCamera);
    } else if (time - this.initTime > 0) {
        this.UITextGoal1.draw(this.mCamera);
    }
    
    this.UITextArrows.draw(this.mCamera);
    this.UITextSpace .draw(this.mCamera);

    this.mMonsters.draw(this.mCamera);
    this.mHero.draw(this.mCamera);

    this.mMoon.draw(this.mCamera);
    this.mBulletSet.draw(this.mCamera);

    this.mObstacles.draw(this.mCamera);
    
    //drawing letters
    for (var i = 0; i < this.kLetters.length; i++){
        this.smallLetters[i].draw(this.mCamera);
        this.letters[i].draw(this.mCamera);
    }

};

StartGame.prototype.update = function () {

    this.distTravel = Math.round(this.mHero.getXform().getXPos() - 10);
    this.sky.update();
    this.mObstacles.update();
    this.backButton.update();
    this.UIhealthBar.update();
    this.UITextBox.update(this.mCamera);
    this.UITextDistance.update();
    this.UITextDistance.setText("Distance: " + this.distTravel + " / 1400");
    
    var allLettersFound = true;
    for (var i = 0; i < this.kLetters.length; i++){
        this.letters[i].update();
        if (!this.smallLetters[i].isNormalColor()) allLettersFound = false;
    }
    if (allLettersFound == true) this.wonGame = true;

    // #region ----------------- Moon Interpolation -----------------
    this.mMoon.update();
    var maxX = this.bgs[this.bgNum - 1].getXform().getXPos() - 15;
    if (this.mHero.getXform().getXPos() > 50 && this.mHero.getXform().getXPos() < maxX) {
        this.mCamera.panTo(this.mHero.getXform().getXPos(), this.mCamera.getWCCenter()[1]);

        this.mMoon.getXform().setPosition(this.mCamera.getWCCenter()[0] + this.moonDelta,
            this.mMoon.getXform().getYPos());
        this.sky.getXform().setPosition(this.mCamera.getWCCenter()[0],
            this.sky.getXform().getYPos());
        /*this.mBush.getXform().setPosition(this.mCamera.getWCCenter()[0] + this.bushDelta,
            this.mBush.getXform().getYPos());
        this.mBigBush.getXform().setPosition(this.mCamera.getWCCenter()[0] + this.bushDelta,
            this.mBigBush.getXform().getYPos());*/

        this.mObstacles.mSet[0].getXform().setXPos(this.mHero.getXform().getXPos());
    }

    /*if (this.mHero.getXform().getXPos() >= maxX) {
        this.wonGame = true;
    }*/

    
    // ----------------- Update Moon Light -----------------
    var moonLight = vec2.clone(this.mMoon.getXform().getPosition());
    this.mGlobalLightSet.getLightAt(1).set2DPosition(moonLight);
    this.mCamera.update();
    // #endregion

    // #region ----------------- Hero Support -------------------
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.K)) {
        //this.mHeroAbleToShoot = !this.mHeroAbleToShoot;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space) && this.mHeroAbleToShoot) {
        var heroXPos = this.mHero.getXform().getXPos();
        var heroYPos = this.mHero.getXform().getYPos();
        var bullet = new MagicBullet(this.mHero.getDirection(), heroXPos + 2, heroYPos - 2);
        this.mBulletSet.addToSet(bullet);
    }
    this.mBulletSet.update();
    this.mBulletSet.delete(this.mCamera); // check if the bullet should be deleted or nah.

    // ----------------- Update Hero Light -----------------
    var heroLight = vec2.clone(this.mHero.getXform().getPosition());
    this.mGlobalLightSet.getLightAt(0).set2DPosition(heroLight);

    // ----------------- Check if hero is killed or not -----------------
    if (this.mHero.deleteYet()) {
        this.endGame = true;
    } else {
        this.mHero.update(this.UIhealthBar); // only update when hero is still alive
    }
    // #endregion


    // #region ----------------- Randomly spawn Monster -----------------
    this.currTime = new Date();
    if (this.currTime - this.prevTime >= this.time) {
        var monsterType = Math.floor(Math.random() * Math.floor(4));
        var monsterOrigin = this.mCamera.getWCCenter()[0] + this.mCamera.getWCWidth() / 2 + 5;
        var monster = new Monster(this.kCharacters, this.kCharacters_i, this.mHero, monsterOrigin, 22.7, monsterType);
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
        var msg = "GAME OVER!";
        this.mMsg.setText(msg)
        this.currTime = new Date();
        if (this.currTime - this.prevTime >= 2000) {
            this.mRestart = true;
            this.LevelSelect = "GameOver";
            gEngine.GameLoop.stop();
        }
    }
    if (this.wonGame) {
        var msg = "YOU WON!";
        this.mMsg.setText(msg)
        this.currTime = new Date();
        if (this.currTime - this.prevTime >= 2000) {
            this.mRestart = true;
            this.LevelSelect = "Win";
            gEngine.GameLoop.stop();
        }
    }
    else {
        // this.mMsg.getXform().setPosition(this.mHero.getXform().getPosition()[0], this.mHero.getXform().getPosition()[1] + 20);
        // var msg = "Bullet=" + this.mBulletSet.size() + " Monsters=" + this.mMonsters.size();
        // this.mMsg.setText(msg)
    }
    // #endregion

    // Cheat
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Enter)) {
        if (!this.mEnterCheat) {
            this.mEnterCheat = true;
        } else {
            this.mEnterCheat = false;
        }
    }

    if (this.UITextBox.getEnteredValue() === "WHOSYOURDADDY") {
        this.UITextBox.setText("");
        this.wonGame = true;
        this.mEnterCheat = false;
    }

    if (this.UITextBox.getEnteredValue() === "WHOSYOURMOMMY") {
        this.UITextBox.setText("");
        this.endGame = true;
        this.mEnterCheat = false;
    }

};

StartGame.prototype.UITextBoxTest = function () {
    this.UIText.setText(this.UITextBox.getEnteredValue());
};

StartGame.prototype.backSelect = function () {
    gEngine.GameLoop.stop();
};

StartGame.prototype._initUI = function () {
    this.UIText = new UIText("Magic Run", [400, 580], 4, 1, 0, [1, 1, 1, 1]);
    this.UITextDistance = new UIText("Distance: ", [700, 580], 2, 1, 0, [1, 1, 1, 1]);
    this.UITextGoal1 = new UIText("Oh no! I forgot the spell to escape this forest!", [400, 480], 3, 1, 0, [1, 0.5, 1, 1]);
    this.UITextGoal2 = new UIText("Can you help me remember it again?", [400, 480], 3, 1, 0, [1, 0.5, 1, 1]);
    this.UITextGoal3 = new UIText("To help Delu remember, collect the letters", [400, 500], 3, 1, 0, [0.5, 1, 1, 1]);
    this.UITextGoal4 = new UIText('that spell "escape" in the correct order!', [400, 460], 3, 1, 0, [0.5, 1, 1, 1]);
    this.UITextBox = new UITextBox([320, 100], 5, 50, [1, 1, 1, 1], [0, 0, 0, 1], null, this);
    
    this.UITextArrows = new UIText("Use ARROWS to move", [680, 60], 2, 1, 0, [1, 1, 1, 1]);
    this.UITextSpace = new UIText("Use SPACE for magic", [680, 40], 2, 1, 0, [1, 1, 1, 1]);

    this.UIhealthBar = new UIHealthBar(this.kHealthBar, [100, 560, 3], [180, 40], 3);
    this.backButton = new UIButton(this.kUIButton, this.backSelect, this, [80, 40], [120, 60], "Menu", 3, [1, 1, 1, 1], [1, 1, 1, 1]);

    // For testing
    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(50, 30);
    this.mMsg.setTextHeight(3);
    this.UIText = new UIText("Magic Run", [400, 580], 4, 1, 0, [1, 1, 1, 1]);
};

StartGame.prototype._initBackGround = function () {

    //setting sky
    this.sky = new LightRenderable(this.kSky);
    this.sky.getXform().setSize(150, 75);
    this.sky.getXform().setPosition(this.mCamera.getWCCenter()[0], 40);
    this.sky.getXform().setZPos(-5);
    for (var i = 0; i < 2; i++) {
        this.sky.addLight(this.mGlobalLightSet.getLightAt(i));
    }

    //setting floor
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
