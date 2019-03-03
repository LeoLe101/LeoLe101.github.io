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
    this.kCharacters = "assets/Game/characters.png";
    
    // The camera to view the scene
    this.mCamera = null;
    this.bg = null;
    this.UIText = null;
    this.UITextBox = null;
    this.backButton = null;
    this.cameraFlip = false;
    
    //Hero and characters
    this.mHero = null;
}
gEngine.Core.inheritPrototype(StartGame, Scene);


StartGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kHealthBar);
    gEngine.Textures.loadTexture(this.kUIButton);
    gEngine.Textures.loadTexture(this.kBG);
    gEngine.Textures.loadTexture(this.kCharacters);
};

StartGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kHealthBar);
    gEngine.Textures.unloadTexture(this.kUIButton);
    gEngine.Textures.unloadTexture(this.kBG);
    gEngine.Textures.unloadTexture(this.kCharacters);
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
    this.bg = new TextureRenderable(this.kBG);
    this.bg.getXform().setSize(150,75);
    this.bg.getXform().setPosition(75,40);
    this.backButton = new UIButton(this.kUIButton,this.backSelect,this,[80,20],[160,40],"Go Back",4,[1,1,1,1],[1,1,1,1]);
    
    this.mHero = new Hero(this.kCharacters, 10, 22);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
StartGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.bg.draw(this.mCamera);
    this.UIText.draw(this.mCamera);
    this.backButton.draw(this.mCamera);
    this.mHero.draw(this.mCamera);
};

StartGame.prototype.update = function () {
    
    if(this.demoSelect===2||this.demoSelect===4){
        this.UITextBox.update(this.mCamera);
    }

    this.mHero.update();
    
    if (this.mCamera.isMouseInViewport()) {
        var newPosition = vec2.fromValues(this.mCamera.mouseWCX(), this.mCamera.mouseWCY());
        //this.mHero.panTo(newPosition);
    }
    
    this.backButton.update();
    /*var center = this.mCamera.getWCCenter();
    if(this.cameraFlip===false){
        this.mCamera.setWCCenter(center[0]+.1,center[1]);
    }
    else{
        this.mCamera.setWCCenter(center[0]-.1,center[1]);
    }
    if(center[0]>60){
        this.cameraFlip=true;
    }
    else if(center[0]<10){
        this.cameraFlip=false;
    }*/
    this.mCamera.update();
};

StartGame.prototype.hpUp = function() {
    this.UIHealth.incCurrentHP(10);
};

StartGame.prototype.hpDown = function(){
    this.UIHealth.incCurrentHP(-10);
};

StartGame.prototype.setToRed = function() {
    this.radarbox.setColor([1,0,0,1]);
};

StartGame.prototype.setToBlue = function() {
    this.radarbox.setColor([0,0,1,1]);
};

StartGame.prototype.setToGreen = function() {
    this.radarbox.setColor([0,1,0,1]);
};

StartGame.prototype.hpSelect = function(){
    this.demoSelect=1;
};

StartGame.prototype.textBoxSelect = function(){
    this.demoSelect=2;
};

StartGame.prototype.radarSelect = function(){
    this.demoSelect=3;
};

StartGame.prototype.allSelect = function(){
    this.demoSelect=4;
};

StartGame.prototype.UITextBoxTest = function(){
    this.UIText.setText(this.UITextBox.getEnteredValue());
};

StartGame.prototype.backSelect = function(){
    gEngine.GameLoop.stop();
};