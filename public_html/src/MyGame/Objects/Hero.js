/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Hero(spriteTexture, atX, atY) {
    this.kDelta = 0.2;
    this.mHero = new SpriteAnimateRenderable(spriteTexture);
    this.mHero.setColor([1, 1, 1, 0]);
    this.mHero.getXform().setPosition(atX, atY);
    this.mHero.getXform().setSize(8.8, 20);
    this.mCurrAlphaChannel = 0;

    this.groundY = atY;
    
    // Set Animation of the top or bottom wing minion{
    this.mHero.setSpriteSequence(960, 210,
        88, 200,
        16,
        0);

    this.mHero.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mHero.setAnimationSpeed(3);
    // show each element for mAnimSpeed updates
    GameObject.call(this, this.mHero);
}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function (atHeadX, atHeadY) {

    GameObject.prototype.update.call(this); // Move the Hero forward
    this.mHero.updateAnimation();

    var Xform = this.getXform();
    var delta = 0.5;

    this.getXform().updateInterpolation();
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        Xform.incXPosBy(delta);
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        Xform.incXPosBy(-delta);
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        if (Xform.getYPos() > this.groundY + 10) {
            var newPosition = vec2.fromValues(Xform.getXPos() + 5, this.groundY);
            this.panTo(newPosition);
        } else {
            Xform.incYPosBy(delta);
        }
    } else {
        var newPosition = vec2.fromValues(Xform.getXPos(), this.groundY);
        this.panTo(newPosition);
    }
    
};

Hero.prototype.hitByDyePack = function (delta) {
    this.mCurrAlphaChannel += delta;
    this.mHero.setColor([1, 1, 1, this.mCurrAlphaChannel]);
};

Hero.prototype.deleteYet = function () {
    return (this.mCurrAlphaChannel >= 1);
};