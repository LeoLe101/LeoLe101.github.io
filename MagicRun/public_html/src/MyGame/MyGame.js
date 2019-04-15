/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    //this.kUIButton = "assets/UI/button.png";
    this.kUIButton = "assets/Game/play.png";
    this.kBG = "assets/Game/forest.png";
    this.kSky = "assets/Game/sky.png";
    
    // The camera to view the scene
    this.mCamera = null;
    this.mSmallCamera = null;
    this.ParticleButton = null;
    this.PhysicsButton = null;
    this.UIButton = null;
    this.UIText = null;
    this.LevelSelect = null;
    
    this.bg = null;
    this.sky = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kUIButton);
    gEngine.Textures.loadTexture(this.kBG);
    gEngine.Textures.loadTexture(this.kSky);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kUIButton);
    gEngine.Textures.unloadTexture(this.kBG);
    gEngine.Textures.unloadTexture(this.kSky);
    if(this.LevelSelect==="Particle"){
        gEngine.Core.startScene(new ParticleLevel());
    }
    else if(this.LevelSelect==="Physics"){
        gEngine.Core.startScene(new RigidShapeDemo());
    }
    else if(this.LevelSelect==="start"){
        gEngine.Core.startScene(new StartGame());
    }
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 1100, 800]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([48/255, 54/255, 84/255, 1]);
    
    // Step B: set up the small camera
    this.mSmallCamera = new Camera(
        vec2.fromValues(400, 40),    // will be updated at each cycle to point to hero
        800,
        [0, 810, 1100, 100],         // viewport (orgX, orgY, width, height)
        2     
    );
    this.mSmallCamera.setBackgroundColor([0.18, 0.21, 0.33, 1]);
    
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    this.ParticleButton = new UIButton(this.kUIButton,this.particleSelect,this,[400,400],[600,100],"Particle Demos",8,[1,1,1,1],[0,0,0,1]);
    this.PhysicsButton = new UIButton(this.kUIButton,this.physicsSelect,this,[400,200],[500,100],"Physics Demo",8,[1,1,1,1],[0,0,0,1]);
    this.StartButton =  new UIButton(this.kUIButton,this.startSelect,this,[550,400],[320,160],"",8,[1,1,1,1],[0,0,0,1]);
    this.UIText = new UIText("Magic Run",[550,700],8,1,0,[1,1,1,1]);
    
    this.bg = new LightRenderable(this.kBG);
    this.bg.getXform().setSize(150, 75);
    this.bg.getXform().setPosition(75, 40);
    
    this.sky = new LightRenderable(this.kSky);
    this.sky.getXform().setSize(150, 75);
    this.sky.getXform().setPosition(this.mCamera.getWCCenter()[0], 40);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    
    this.mCamera.setupViewProjection();
    this.sky.draw(this.mCamera);
    this.bg.draw(this.mCamera);
    //this.ParticleButton.draw(this.mCamera);
    //this.PhysicsButton.draw(this.mCamera);
    this.StartButton.draw(this.mCamera);
    this.UIText.draw(this.mCamera);
    
    this.mSmallCamera.setupViewProjection();
 
};

MyGame.prototype.update = function () {
    //this.ParticleButton.update();
    //this.PhysicsButton.update();
    this.StartButton.update();
    this.bg.update();
    this.sky.update();

};

MyGame.prototype.particleSelect = function(){
    this.LevelSelect="Particle";
    gEngine.GameLoop.stop();
};

MyGame.prototype.physicsSelect = function(){
    this.LevelSelect="Physics";
    gEngine.GameLoop.stop();
};

MyGame.prototype.startSelect= function(){
    this.LevelSelect="start";
    gEngine.GameLoop.stop();
};