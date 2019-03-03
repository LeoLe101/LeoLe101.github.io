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
    
    // The camera to view the scene
    this.mCamera = null;
    this.bg = null;
    this.bgs = null;
    this.UIText = null;
    this.UITextBox = null;
    this.backButton = null;
    this.cameraFlip = false;
    
    this.bgNum = 10;
    
    //Hero and characters
    this.mHero = null;
}
gEngine.Core.inheritPrototype(StartGame, Scene);


StartGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kHealthBar);
    gEngine.Textures.loadTexture(this.kUIButton);
    gEngine.Textures.loadTexture(this.kBG);
    gEngine.Textures.loadTexture(this.kBG_i);
    gEngine.Textures.loadTexture(this.kCharacters);
    gEngine.Textures.loadTexture(this.kCharacters_i);
};

StartGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kHealthBar);
    gEngine.Textures.unloadTexture(this.kUIButton);
    gEngine.Textures.unloadTexture(this.kBG);
    gEngine.Textures.loadTexture(this.kBG_i);
    gEngine.Textures.unloadTexture(this.kCharacters);
    gEngine.Textures.loadTexture(this.kCharacters_i);
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
    
    this.UIText = new UIText("Magic Run",[400,580],4,1,0,[1,1,1,1]);
    this.UITextBox = new UITextBox([500,200],6,35,[1,1,1,1],[0,0,0,1],this.UITextBoxTest,this);
    this.backButton = new UIButton(this.kUIButton,this.backSelect,this,[80,20],[160,40],"Go Back",4,[1,1,1,1],[1,1,1,1]);
    
    this.bg = new TextureRenderable(this.kBG);
    this.bg.getXform().setSize(150,75);
    this.bg.getXform().setPosition(75,40);
    this.bgs = [this.bg];
    for (var i = 1; i < this.bgNum; i++){
        var deltaX = this.bgs[i-1].getXform().getXPos() + this.bgs[i-1].getXform().getWidth() / 2;
        if (i % 2 === 0){
            var bg = new TextureRenderable(this.kBG);
        } else {
            var bg = new TextureRenderable(this.kBG_i);
        }
        this.bgs.push(bg);
        this.bgs[i].getXform().setSize(150,75);
        this.bgs[i].getXform().setPosition(deltaX + 75,40);
    }
    var maxX = this.bgs[this.bgNum-1].getXform().getXPos() + this.bgs[this.bgNum-1].getXform().getWidth() / 2;
    this.mHero = new Hero(this.kCharacters, this.kCharacters_i, 10, 22, maxX);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
StartGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    for (var i = 0; i < this.bgNum; i++){
        this.bgs[i].draw(this.mCamera);
    }
    this.UIText.draw(this.mCamera);
    this.backButton.draw(this.mCamera);
    this.mHero.draw(this.mCamera);
};

StartGame.prototype.update = function () {

    this.mHero.update();
  
    this.backButton.update();
    
    var maxX = this.bgs[this.bgNum-1].getXform().getXPos() - 15;
    if ( this.mHero.getXform().getXPos() > 10 && this.mHero.getXform().getXPos() < maxX){
        this.mCamera.panTo(this.mHero.getXform().getXPos() + 40, this.mCamera.getWCCenter()[1]);
    }
    this.mCamera.update();
};

StartGame.prototype.UITextBoxTest = function(){
    this.UIText.setText(this.UITextBox.getEnteredValue());
};

StartGame.prototype.backSelect = function(){
    gEngine.GameLoop.stop();
};