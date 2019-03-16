/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var kWASDDelta = 0.9;
var delta = 0.4;

function Hero(spriteTexture, spriteTexture_i, atX, atY, maxX, lightSet, healthBar) {
    
    this.foundLetters = 0;
    
    var max = 4;
    this.keySettings = Math.floor(Math.random() * (max + 1));
    
    this.kDelta = 0.2;

    this.kWidth = 8.78;
    this.kHeight = 10;

    this.mHero = new LightRenderable(spriteTexture);
    this.mHero.setColor([1, 1, 1, 0]);
    this.mHero.getXform().setPosition(atX, atY);
    this.mHero.getXform().setSize(this.kWidth, this.kHeight);

    this.healthBar = healthBar.getCurrentHP();
    this.gotHit = false;

    this.spriteTexture = spriteTexture;
    this.spriteTexture_i = spriteTexture_i;

    this.groundY = atY;

    this.minX = 5;
    this.maxX = maxX - 5;

    // Set Animation of the top or bottom wing minion{
    this.mHero.setSpriteSequence(905, 210,
        87.8, 100,
        16,
        0);

    this.mHero.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mHero.setAnimationSpeed(1000000);

    // Get some lights on this girl!

    this.light = this._createPointLight(atX, atY);
    lightSet.addToSet(this.light);
    this.mHero.addLight(this.light);


    this.mHeroState = Hero.eHeroState.eFaceRight;
    this.mPreviousHeroState = Hero.eHeroState.eFaceRight;

    // show each element for mAnimSpeed updates
    GameObject.call(this, this.mHero);

    this.getXform().changeRate(0.1);

    //add rigidbody
    var r = new RigidRectangle(this.getXform(), this.kWidth, this.kHeight);
    r.setMass(20);
    r.setRestitution(50);

    this.localShake = null;
    this.setRigidBody(r);
    //this.toggleDrawRenderable();
    //this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function (healthBar) {

    GameObject.prototype.update.call(this); // Move the Hero forward
    this.mHero.updateAnimation();

    this.getXform().updateInterpolation();

    if (this.mHeroState === Hero.eHeroState.eRunRight) {
        this.mHeroState = Hero.eHeroState.eFaceRight;
    } else if (this.mHeroState === Hero.eHeroState.eRunLeft) {
        this.mHeroState = Hero.eHeroState.eFaceLeft;
    }

    this.light.set2DPosition(this.getXform().getPosition());

    this.keyControl();
    this.changeAnimation();
    this.generalUpdate();

    if (this.gotHit) {
        this.healthBar = healthBar.getCurrentHP();
        healthBar.incCurrentHP(-10);
        this.gotHit = false;
    }
};

Hero.prototype.hitByMonster = function (delta) {
    // this.getXform().incXPosBy(-5);
    this.healthBar -= delta;
    this.gotHit = true;
};

Hero.prototype.deleteYet = function () {
    return (this.healthBar <= 0);
};

Hero.eHeroState = Object.freeze({
    eFaceRight: 0,
    eFaceLeft: 1,
    eRunRight: 2,
    eRunLeft: 3
});

Hero.prototype.changeAnimation = function () {
    if (this.mHeroState !== this.mPreviousHeroState) {
        this.mPreviousHeroState = this.mHeroState;
        switch (this.mHeroState) {
            case Hero.eHeroState.eFaceLeft:
                this.mHero.setSpriteSequence(905, 210, 87.8, 100, 16, 0);
                this.mHero.getXform().setSize(-this.kWidth, this.kHeight);
                this.mHero.setAnimationSpeed(1000000);
                break;
            case Hero.eHeroState.eFaceRight:
                this.mHero.setSpriteSequence(905, 210, 87.8, 100, 16, 0);
                this.mHero.getXform().setSize(this.kWidth, this.kHeight);
                this.mHero.setAnimationSpeed(1000000);
                break;
            case Hero.eHeroState.eRunLeft:
                this.mHero.setSpriteSequence(905, 210, 87.8, 100, 16, 0);
                this.mHero.getXform().setSize(-this.kWidth, this.kHeight);
                this.mHero.setAnimationSpeed(3);
                break;
            case Hero.eHeroState.eRunRight:
                this.mHero.setSpriteSequence(905, 210, 87.8, 100, 16, 0);
                this.mHero.getXform().setSize(this.kWidth, this.kHeight);
                this.mHero.setAnimationSpeed(3);
                break;
        }
    }
};

Hero.prototype.getDirection = function () {
    if (this.mHeroState === Hero.eHeroState.eFaceLeft || this.mHeroState === Hero.eHeroState.eRunLeft) return 0;
    return 1;
};


Hero.prototype.keyControl = function () {

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        this.goUp();   
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        this.goDown();
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        this.goLeft();
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        this.goRight();
    }

    //this.getRigidBody().userSetsState();

};

Hero.prototype.goUp = function () {
    var xform = this.getXform();
    xform.incYPosBy(kWASDDelta);
};

Hero.prototype.goDown = function () {
    var xform = this.getXform();
    if (xform.getYPos() >= this.groundY) {
        xform.incYPosBy(-kWASDDelta);
    }
};

Hero.prototype.goLeft = function () {
    var xform = this.getXform();
    this.mHeroState = Hero.eHeroState.eRunLeft;
    if (xform.getXPos() >= this.minX) {
        xform.incXPosBy(-delta);
    }
};

Hero.prototype.goRight = function () {
    var xform = this.getXform();
    this.mHeroState = Hero.eHeroState.eRunRight;
    if (xform.getXPos() <= this.maxX) {
        xform.incXPosBy(delta);
    }
};

    
Hero.prototype._createPointLight = function (atX, atY) {
    var lgt = new Light();
    lgt.setLightType(0);
    lgt.setColor([1, 1, 1, 0.5]);
    lgt.setXPos(atX);
    lgt.setYPos(atY);
    lgt.setZPos(1);
    lgt.setNear(5);
    lgt.setFar(8);
    lgt.setIntensity(0.5);
    lgt.setDropOff(20);
    lgt.setLightCastShadowTo(true);
    return lgt;

};