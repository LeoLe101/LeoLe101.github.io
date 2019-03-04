/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Hero(spriteTexture, spriteTexture_i, atX, atY, maxX) {
    this.kDelta = 0.2;
    
    this.kWidth = 8.78;
    this.kHeight = 10;
    
    this.mHero = new SpriteAnimateRenderable(spriteTexture);
    this.mHero.setColor([1, 1, 1, 0]);
    this.mHero.getXform().setPosition(atX, atY);
    this.mHero.getXform().setSize(this.kWidth, this.kHeight);
    
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
    
    this.mHeroState = Hero.eHeroState.eFaceRight;
    this.mPreviousHeroState = Hero.eHeroState.eFaceRight;
    
    // show each element for mAnimSpeed updates
    GameObject.call(this, this.mHero);
    
    this.getXform().changeRate(0.1);
}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function () {

    GameObject.prototype.update.call(this); // Move the Hero forward
    this.mHero.updateAnimation();

    var Xform = this.getXform();
    var delta = 0.5;

    this.getXform().updateInterpolation();
    
    if (this.mHeroState === Hero.eHeroState.eRunRight) {
        this.mHeroState = Hero.eHeroState.eFaceRight;
    } else if (this.mHeroState === Hero.eHeroState.eRunLeft) {
        this.mHeroState = Hero.eHeroState.eFaceLeft;
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        this.mHeroState = Hero.eHeroState.eRunRight;
        if (Xform.getXPos() <= this.maxX) {
            Xform.incXPosBy(delta);
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        this.mHeroState = Hero.eHeroState.eRunLeft;
        if (Xform.getXPos() >= this.minX) {
            Xform.incXPosBy(-delta);
        }
    }
    
    this.changeAnimation();
};

Hero.prototype.hitByMonster = function (delta) {
    this.mCurrAlphaChannel += delta;
    this.mHero.setColor([1, 1, 1, this.mCurrAlphaChannel]);
};

Hero.prototype.deleteYet = function () {
    return (this.mCurrAlphaChannel >= 1);
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

Hero.prototype.getDirection = function() {
    if (this.mHeroState === Hero.eHeroState.eFaceLeft || this.mHeroState === Hero.eHeroState.eRunLeft) return 0;
    return 1;
};