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
    this.kHealthBar = "assets/UI/healthbar_green.png";
    this.kEnergyBar = "assets/UI/healthbar_yellow.png";
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
    this.mSmallCamera = null;
    this.bg = null;
    this.bgs = null;
    this.sky = null;

    // UI Stuffs
    this.UIText = null;
    this.UITextBox = null;
    this.UITextBox1 = null;
    this.UIhealthBar = null;
    this.UIEnergyBar = null;
    this.backButton = null;
    this.UITextGoal1 = null;
    this.UITextGoal2 = null;
    this.UITextGoal3 = null;
    this.UITextGoal4 = null;
    this.UITextHP = null;
    this.UITextEN = null;

    this.cameraFlip = false;
    this.endGame = false;
    this.wonGame = false;

    this.initTime = new Date();
    this.prevTime = new Date();
    this.currTime = new Date();
    this.prevTime1 = new Date();
    this.currTime1 = new Date();
    this.prevTime2 = new Date();
    this.currTime2 = new Date();
    this.time = 0;
    this.time1 = 0;

    this.bgNum = 6;

    // Hero
    this.mHero = null;
    this.mHeroStartPos = null;
    this.mHeroAbleToShoot = true;

    // Magic Bullet
    this.mHeroBulletSet = null;
    this.mMonsterBulletSet = null;

    // Monsters
    this.mMonsters = null;
    this.mShooterIndex = 0;

    // Light Set
    this.mGlobalLightSet = null;

    // Moon
    this.mMoon = null;
    this.moonDelta = 0;
    this.skyDelta = 0;
    this.moonChangeRate = 0;

    //Bush
    //this.mBush = null;
    //this.mBigBush = null;

    //letters
    this.letters = [];
    this.smallLetters = [];
    this.letterNames = ["E1", "S2", "C3", "A4", "P5", "E6"];

    this.mObstacles = null;

    this.mMsg = null;
    this.mSpecialMonsterNum = 0;
    this.mRestart = false;
    this.mWin = false;
    this.distTravel = 0;

}
gEngine.Core.inheritPrototype(StartGame, Scene);


StartGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kHealthBar);
    gEngine.Textures.loadTexture(this.kEnergyBar);
    gEngine.Textures.loadTexture(this.kUIButton);
    gEngine.Textures.loadTexture(this.kBG);
    gEngine.Textures.loadTexture(this.kBG_i);
    gEngine.Textures.loadTexture(this.kCharacters);
    gEngine.Textures.loadTexture(this.kCharacters_i);
    gEngine.Textures.loadTexture(this.kMoon);
    gEngine.Textures.loadTexture(this.kObstacle);
    gEngine.Textures.loadTexture(this.kSky);
    //gEngine.Textures.loadTexture(this.kBush);

    for (var i = 0; i < this.kLetters.length; i++) {
        gEngine.Textures.loadTexture(this.kLetters[i]);
    }
};

StartGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kHealthBar);
    gEngine.Textures.unloadTexture(this.kEnergyBar);
    gEngine.Textures.unloadTexture(this.kUIButton);
    gEngine.Textures.unloadTexture(this.kBG);
    gEngine.Textures.unloadTexture(this.kBG_i);
    gEngine.Textures.unloadTexture(this.kCharacters);
    gEngine.Textures.unloadTexture(this.kCharacters_i);
    gEngine.Textures.unloadTexture(this.kMoon);
    gEngine.Textures.unloadTexture(this.kObstacle);
    gEngine.Textures.unloadTexture(this.kSky);
    //gEngine.Textures.unloadTexture(this.kBush);

    for (var i = 0; i < this.kLetters.length; i++) {
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

    // Step A: set up the main camera
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 1100, 800]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

    // Step B: set up the small camera
    this.mSmallCamera = new Camera(
        vec2.fromValues(430, 40),    // will be updated at each cycle to point to hero
        860,
        [0, 810, 1100, 100],         // viewport (orgX, orgY, width, height)
        2
    );
    this.mSmallCamera.setBackgroundColor([0.18, 0.21, 0.33, 1]);
    // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

    // init Light Set
    this._initializeLights(); // called from Level Light file

    // init Game UI
    this._initUI();

    // init BackGround with Light
    this._initBackGround();

    // init hero
    var maxX = this.bgs[this.bgNum - 1].getXform().getXPos() + this.bgs[this.bgNum - 1].getXform().getWidth() / 4 - 3;
    this.mHero = new Hero(this.kCharacters, this.kCharacters_i, 10, 21, maxX, this.mGlobalLightSet, this.UIhealthBar, this.UIEnergyBar);
    this.mHeroStartPos = this.mHero.getXform().getXPos();
    // init bullet set
    this.mHeroBulletSet = new MagicBulletSet();
    this.mMonsterBulletSet = new MagicBulletSet();

    // init monster
    this.mMonsters = new MonsterSet();
    this.mMoon = new Moon(this.kMoon, this.mGlobalLightSet);

    this.moonDelta = this.mMoon.getXform().getXPos() - this.mCamera.getWCCenter()[0];
    this.skyDelta = 0;
    this.moonChangeRate = 0.05;

    this.mObstacles = new ObstacleSet();

    for (var i = 0; i < this.kLetters.length; i++) {
        //setting small letters
        var newLetter = new UITexture(this.kLetters[i], [270 + i * 40, 65], [30, 30]);
        this.smallLetters.push(newLetter);
        this.smallLetters[i].makeLight();

        //setting large letters
        var newLetter = new Letter(30 + i * 6, 21, this.kLetters[i], this.mHero, this.smallLetters[i], this.letterNames[i]);
        this.letters.push(newLetter);
    }

    this.letters = this._shuffle(this.letters);

    //setting floor
    var obstacle = new Obstacle(50, 11, 100, 13.75, 0, .9, this.kObstacle, this.mHero, true);
    this.mObstacles.addToSet(obstacle);

    var X = [0, 0, 0];
    var Y = [0, 0, 0];
    var sig = 1;
    var j = 0;
    //creating platform obstacles: 39 of them
    var minPos = 30;
    for (var i = 0; i < 12; i++) {

        X[0] = minPos + Math.random() * 50;
        X[1] = Math.max(X[0] + 13 + Math.random() * 20, X[0] + 11);
        X[2] = Math.max(X[1] + 13 + Math.random() * 20, X[1] + 11);

        Y[0] = 30;
        Y[1] = Y[0] + 5 + Math.random() * 5;
        Y[2] = Math.max(Y[1] + sig * (Math.random() * 2), Y[0]);

        var max = 2;
        var min = 0;
        var rand = Math.floor(Math.random() * (max - min + 1)) + min;

        if (X[0] > 855) break;
        var obstacle1 = new Obstacle(X[0], Y[0], 10, 3, 0, .9, this.kObstacle, this.mHero, false);
        this.mObstacles.addToSet(obstacle1);

        if (X[1] > 855) break;
        var obstacle2 = new Obstacle(X[1], Y[1], 10, 3, 0, .9, this.kObstacle, this.mHero, false);
        this.mObstacles.addToSet(obstacle2);

        if (X[2] > 855) break;
        var obstacle3 = new Obstacle(X[2], Y[2], 10, 3, 0, .9, this.kObstacle, this.mHero, false);
        this.mObstacles.addToSet(obstacle3);

        minPos = X[2] + 15 + Math.random() * 25;

        sig = sig * -1;

        if (i % 2 === 0) {
            this.letters[j].getXform().setPosition(X[rand], Y[rand] + 4);
            j++;
        }
    }

    for (j; j < 6; j++) {
        var max = 840;
        var min = 50;
        var rand = Math.random() * (max - min + 1) + min;
        this.letters[j].getXform().setPosition(rand, 21);
    }
};

StartGame.prototype._shuffle = function (array) {
    var ctr = array.length, temp, index;

    // While there are elements in the array
    while (ctr > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * ctr);
        // Decrease ctr by 1
        ctr--;
        // And swap the last element with it
        temp = array[ctr];
        array[ctr] = array[index];
        array[index] = temp;
    }
    return array;
};

StartGame.prototype.drawWith = function (camera, shouldShowUI) {
    camera.setupViewProjection();

    if (shouldShowUI) {
        this.sky.draw(camera);
        this.mMoon.draw(camera);
    }

    for (var i = 0; i < this.bgNum; i++) {
        this.bgs[i].draw(camera);
    }

    if (shouldShowUI) {

        var time = new Date();
        if (time - this.initTime > 7000) {
            this.UITextGoal3.draw(camera);
            this.UITextGoal4.draw(camera);
        } else if (time - this.initTime > 4000) {
            this.UITextGoal2.draw(camera);
        } else if (time - this.initTime > 0) {
            this.UITextGoal1.draw(camera);
        }

        this.UITextHP.draw(camera);
        this.UITextEN.draw(camera);
        this.UITextArrows.draw(camera);
        this.UITextSpace.draw(camera);

        this.UIText.draw(camera);
        //this.UITextDistance.draw(camera);

        if (this.mEnterCheat) {
            this.UITextBox.draw(camera);
        }

        this.backButton.draw(camera);
        this.UIhealthBar.draw(camera);
        this.UIEnergyBar.draw(camera);
    }



    this.mMonsters.draw(camera);
    this.mHero.draw(camera);

    this.mHeroBulletSet.draw(camera);
    this.mMonsterBulletSet.draw(camera);
    //this.mMsg.draw(camera);
    this.mObstacles.draw(camera);

    //drawing letters
    for (var i = 0; i < this.kLetters.length; i++) {
        this.letters[i].draw(camera);
        if (shouldShowUI) this.smallLetters[i].draw(camera);
    }

};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
StartGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.drawWith(this.mSmallCamera, false);
    this.drawWith(this.mCamera, true);


};

StartGame.prototype.update = function () {

    this.distTravel = Math.round(this.mHero.getXform().getXPos() - 10);
    this.sky.update();
    this.mObstacles.update();
    this.backButton.update();
    this.UIhealthBar.update();
    this.UIEnergyBar.update();
    this.UITextBox.update(this.mCamera);
    this.UITextDistance.update();
    this.UITextDistance.setText("Distance: " + this.distTravel + " / 1400");

    this.mCamera.update();
    this.mSmallCamera.update();

    var allLettersFound = true;
    for (var i = 0; i < this.kLetters.length; i++) {
        if (!this.endGame) this.endGame = this.letters[i].update();
        if (!this.smallLetters[i].isNormalColor()) allLettersFound = false;
    }
    if (allLettersFound === true) this.wonGame = true;

    // #region ----------------- Moon Interpolation -----------------
    this.mMoon.update();
    var maxX = this.bgs[this.bgNum - 1].getXform().getXPos() - 15;
    if (this.mHero.getXform().getXPos() > 50 && this.mHero.getXform().getXPos() < maxX) {
        this.mCamera.panTo(this.mHero.getXform().getXPos(), this.mCamera.getWCCenter()[1]);

        this.mMoon.getXform().setPosition(this.mCamera.getWCCenter()[0] + this.moonDelta,
            this.mMoon.getXform().getYPos());
        this.sky.getXform().setPosition(this.mCamera.getWCCenter()[0] - this.skyDelta, this.sky.getXform().getYPos());

        this.mObstacles.mSet[0].getXform().setXPos(this.mHero.getXform().getXPos());
    }

    /*if (this.mHero.getXform().getXPos() >= maxX) {
        this.wonGame = true;
    }*/

    // ----------------- Update Moon Light -----------------
    var moonLight = vec2.clone(this.mMoon.getXform().getPosition());
    this.mGlobalLightSet.getLightAt(1).set2DPosition(moonLight);
    // #endregion

    // #region ----------------- Hero Support -------------------
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.K)) {
        //this.mHeroAbleToShoot = !this.mHeroAbleToShoot;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space) && this.mHeroAbleToShoot) {
        if (this.mHero.ableToShoot()) {
            var heroXPos = this.mHero.getXform().getXPos();
            var heroYPos = this.mHero.getXform().getYPos();
            var bullet = new MagicBullet(this.mHero.getDirection(), heroXPos + 2, heroYPos - 2);
            this.mHeroBulletSet.addToSet(bullet);
            this.mHero.shootBullet(30, this.UIEnergyBar);
        }
    }
    this.mHeroBulletSet.update();
    this.mHeroBulletSet.delete(this.mCamera); // check if the bullet should be deleted or nah.

    // ----------------- Update Hero Light -----------------
    var heroLight = vec2.clone(this.mHero.getXform().getPosition());
    this.mGlobalLightSet.getLightAt(0).set2DPosition(heroLight);

    // ----------------- Check if hero is killed or not -----------------
    if (this.mHero.deleteYet()) {
        this.endGame = true;
    } else {
        this.mHero.update(this.UIhealthBar, this.UIEnergyBar); // only update when hero is still alive
        this.currTime1 = new Date();
        if (this.currTime1 - this.prevTime1 >= 4000) {
            this.mHero.rechargeBullet(20, this.UIEnergyBar);
            this.prevTime1 = this.currTime1;
        }
    }
    // #endregion


    // #region ----------------- Randomly spawn Monster -----------------
    this.currTime = new Date();
    if (this.currTime - this.prevTime >= this.time) {
        var monsterType = Math.floor(Math.random() * Math.floor(4));
        var monsterOrigin = this.mCamera.getWCCenter()[0] + this.mCamera.getWCWidth() / 2 + 5;
        if (monsterType == 0) {
            var monster = new Monster(this.kCharacters, this.kCharacters_i, this.mHero, monsterOrigin, 22.7, monsterType);
        } else if (monsterType == 3) {
            var monster = new Monster(this.kCharacters, this.kCharacters_i, this.mHero, monsterOrigin, 22.7, monsterType);
        } else {
            var monster = new Monster(this.kCharacters, this.kCharacters_i, this.mHero, monsterOrigin, 22.7, monsterType);
        }
        this.mMonsters.addToSet(monster);
        this.prevTime = this.currTime;
        this.time = 3000 + Math.random() * 4000;
    }
    this.mMonsters.update();
    this.mMonsters.delete(this.mCamera);
    // Check if collision with anything
    var h = [];
    this.mMonsters.pixelTouches(this.mHero, this.mHeroBulletSet, h);

    // ----------------- Randomly Monster Shoot bullet -----------------
    this.currTime2 = new Date();
    if (this.currTime2 - this.prevTime2 >= this.time1) {
        var monsIndex = Math.floor(Math.random() * (this.mMonsters.size()));
        console.log("monster shooter index", monsIndex);
        if (this.mMonsters.getObjectAt(monsIndex)) {
            if (this.mMonsters.getObjectAt(monsIndex).mType === 3) {
                var monsterXPos = this.mMonsters.getObjectAt(monsIndex).getXform().getXPos();
                var monsterYPos = this.mMonsters.getObjectAt(monsIndex).getXform().getYPos();
                var bullet = new MonsterBullet(this.mMonsters.getObjectAt(monsIndex).getDirection(), monsterXPos + 2, monsterYPos - 3);
                this.mMonsterBulletSet.addToSet(bullet);
            }
        }
        // console.log("shooted", bullet);
        this.prevTime2 = this.currTime2;
        this.time1 = 1000 + Math.random() * 2000;
    }
    this.mMonsterBulletSet.update();
    this.mMonsterBulletSet.delete(this.mCamera); // check if the bullet should be deleted or nah.
    this.mHero.pixelTouches(this.mMonsterBulletSet);
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
        this.mMsg.getXform().setPosition(this.mHero.getXform().getPosition()[0], this.mHero.getXform().getPosition()[1] + 20);
        var msg = "Bullet=" + this.mHeroBulletSet.size() + " Sp Monsters=";
        this.mMsg.setText(msg)
    }
    // #endregion

    // #region ----------------- Cheat -----------------
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
    // #endregion
};

StartGame.prototype.UITextBoxTest = function () {
    this.UIText.setText(this.UITextBox.getEnteredValue());
};

StartGame.prototype.backSelect = function () {
    gEngine.GameLoop.stop();
};

StartGame.prototype._initUI = function () {

    this.UITextDistance = new UIText("Distance: ", [950, 780], 2, 1, 0, [1, 1, 1, 1]);
    this.UITextGoal1 = new UIText("Oh no! I forgot the spell to escape this forest!", [550, 600], 2, 1, 0, [1, 0.5, 1, 1]);
    this.UITextGoal2 = new UIText("Can you help me remember it again?", [550, 600], 2, 1, 0, [1, 0.5, 1, 1]);
    this.UITextGoal3 = new UIText("To help Delu remember, collect the letters", [550, 620], 2, 1, 0, [0.5, 1, 1, 1]);
    this.UITextGoal4 = new UIText('that spell "escape" in the correct order!', [550, 580], 2, 1, 0, [0.5, 1, 1, 1]);
    this.UITextBox = new UITextBox([320, 100], 5, 50, [1, 1, 1, 1], [0, 0, 0, 1], null, this);

    this.UITextArrows = new UIText("Use ARROWS to move", [950, 95], 2, 1, 0, [1, 1, 1, 1]);
    this.UITextSpace = new UIText("Use SPACE for magic", [950, 65], 2, 1, 0, [1, 1, 1, 1]);

    this.UITextHP = new UIText("HP", [60, 775], 2, 1, 0, [1, 0.5, 1, 1]);
    this.UIhealthBar = new UIHealthBar(this.kHealthBar, [180, 760, 3], [180, 40], 3);
    this.UITextEN = new UIText("Energy", [50, 715], 2, 1, 0, [1, 0.5, 1, 1]);
    this.UIEnergyBar = new UIHealthBar(this.kEnergyBar, [180, 700, 3], [180, 40], 3);
    this.backButton = new UIButton(this.kUIButton, this.backSelect, this, [80, 65], [120, 60], "Menu", 3, [1, 1, 1, 1], [1, 1, 1, 1]);

    // For testing
    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(50, 30);
    this.mMsg.setTextHeight(3);
    this.UIText = new UIText("Magic Run", [550, 780], 4, 1, 0, [1, 1, 1, 1]);
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
