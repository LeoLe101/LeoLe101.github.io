/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Monster(spriteTexture, spriteTexture_i, hero, atX, atY, type) {
    this.kRefWidth = 80;
    this.kRefHeight = 130;
    this.kDelta = 0.6;
    
    this.mHero = hero; //follow hero
    
    this.groundY = atY;
    
    this.spriteTexture = spriteTexture;
    this.spriteTexture_i = spriteTexture_i;

    this.mMonster = new SpriteAnimateRenderable(spriteTexture);
    this.mMonster.setColor([1, 1, 1, 0]);
    this.mMonster.getXform().setPosition(atX, atY);
    if (type === 1) {
        this.mMonster.getXform().setSize(10.35, 10);
        this.mMonster.setSpriteSequence(725, 138,
            103.5, 100,
            18,
            0);
    } else if (type === 2) {
        this.mMonster.getXform().setSize(9.68, 10);
        this.mMonster.setSpriteSequence(550, 30,
            96.8, 100,
            14,
            0);
    } else if (type === 3) {
        this.mMonster.getXform().setSize(10.35, 10);
        this.mMonster.setSpriteSequence(360, 138,
            103.5, 100,
            18,
            0);
    } else if (type === 4) {
        this.mMonster.getXform().setSize(10.35, 10);
        this.mMonster.setSpriteSequence(180, 138,
            103.5, 100,
            18,
            0);
    }

    this.mMonster.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateLeft);
    this.mMonster.setAnimationSpeed(30);
    GameObject.call(this, this.mMonster);

    this.shouldDestroy = false;
    this.getXform().changeRate(0.001);
    //this.localShake = null;
}
gEngine.Core.inheritPrototype(Monster, GameObject);

Monster.prototype.update = function () {
    
    GameObject.prototype.update.call(this); // Move the Hero forward
    this.mMonster.updateAnimation();
    
    var heroXform = this.mHero.getXform();
    var Xform = this.getXform();
    /*var distance = Xform.getXPos() - heroXform.getXPos();
    if (distance > 10) {
        var kDelta = 0.5;
        if (distance > 0 ) kDelta = -0.5;
        Xform.incXPosBy(kDelta);
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S)) {
        this.shake(4, 0.2, 20, 300);
    }*/
    this.generalUpdate();
    
    var newPosition = vec2.fromValues(heroXform.getXPos(), this.groundY);
    //this.panTo(newPosition);

    /*
    if (this.mShake !== null)
        this.localShake = this.mShake;

    if (this.localShake !== null && this.mShake === null)
        this.shouldDestroy = true;

    if (this.kDelta <= 0) {
        this.kDelta = 0;
        this.shouldDestroy = true;
    }*/

    //advance
   // xform.incXPosBy(this.kDelta);

};

Monster.prototype.shouldDelete = function () {
    return this.shouldDestroy;
};

