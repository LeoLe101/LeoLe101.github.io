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
    this.mMonster = null;
    
    this.mType = type;
    
    this.groundY = atY;
    
    this.spriteTexture = spriteTexture;
    this.spriteTexture_i = spriteTexture_i;
    this.kWidth = 0;
    this.kHeight = 0;
    
    this.prevX = atX;
    this.currX = atX;
    
    this.mMonsterState = Monster.eMonsterState.eRunRight;
    this.mPreviousMonsterState = Monster.eMonsterState.eRunRight;

    this.mMonster = new SpriteAnimateRenderable(spriteTexture);
    this.mMonster.setColor([1, 1, 1, 0]);
    this.mMonster.getXform().setPosition(atX, atY);
    if (this.mType === 0) {
        this.kWidth = 10.35;
        this.kHeight = 10;
        this.mMonster.getXform().setSize(this.kWidth, this.kHeight);
        this.mMonster.setSpriteSequence(725, 138,
            103.5, 100,
            18,
            0);
    } else if (this.mType === 1) {
        this.kWidth = 9.68;
        this.kHeight = 10;
        this.mMonster.getXform().setSize(this.kWidth, this.kHeight);
        this.mMonster.setSpriteSequence(550, 30,
            96.8, 100,
            14,
            0);
    } else if (this.mType === 2) {
        this.kWidth = 8.58;
        this.kHeight = 10;
        this.mMonster.getXform().setSize(this.kWidth, this.kHeight);
        this.mMonster.setSpriteSequence(388, 35,
            85.8, 100,
            18,
            0);
    } else if (this.mType === 3) {
        this.kWidth = 6.93;
        this.kHeight = 10;
        this.mMonster.getXform().setSize(this.kWidth, this.kHeight);
        this.mMonster.setSpriteSequence(215, 43,
            69.3, 100,
            18,
            0);
    }

    this.mMonster.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateLeft);
    this.mMonster.setAnimationSpeed(3);
    GameObject.call(this, this.mMonster);

    this.shouldDestroy = false;
    this.getXform().changeRate(0.0015);
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
    this.panTo(newPosition);

    /*
    if (this.mShake !== null)
        this.localShake = this.mShake;

    if (this.localShake !== null && this.mShake === null)
        this.shouldDestroy = true;

    if (this.kDelta <= 0) {
        this.kDelta = 0;
        this.shouldDestroy = true;
    }*/
    
    this.currX = this.getXform().getXPos();
    if (this.currX < this.prevX) {
        this.mMonsterState = Monster.eMonsterState.eRunRight;
    } else {
        this.mMonsterState = Monster.eMonsterState.eRunLeft;
    }
   this.prevX = this.currX;
   
   this.changeAnimation();

};

Monster.prototype.shouldDelete = function () {
    return this.shouldDestroy;
};

Monster.eMonsterState = Object.freeze({
    eRunRight: 0,
    eRunLeft: 1
});

Monster.prototype.changeAnimation = function () {

    if (this.mMonsterState !== this.mPreviousMonsterState) {
        this.mPreviousMonsterState = this.mMonsterState;
        switch (this.mMonsterState) {
            case Monster.eMonsterState.eRunLeft:
                this.mMonster.getXform().setSize(-this.kWidth, this.kHeight);
                this.mMonster.setAnimationSpeed(3);
                if (this.mType === 0) {
                    this.mMonster.setSpriteSequence(725, 138, 103.5, 100, 18,  0);
                } else if (this.mType === 1) {
                    this.mMonster.setSpriteSequence(550, 30, 96.8, 100, 14, 0);
                } else if (this.mType === 2) {
                    this.mMonster.setSpriteSequence(388, 35, 85.8, 100, 18, 0);
                } else if (this.mType === 3) {
                    this.mMonster.setSpriteSequence(215, 43, 69.3, 100, 18,0);
                }
                break;
            case Monster.eMonsterState.eRunRight:
                this.mMonster.getXform().setSize(this.kWidth, this.kHeight);
                this.mMonster.setAnimationSpeed(3);
                if (this.mType === 0) {
                    this.mMonster.setSpriteSequence(725, 138, 103.5, 100, 18,  0);
                } else if (this.mType === 1) {
                    this.mMonster.setSpriteSequence(550, 30, 96.8, 100, 14, 0);
                } else if (this.mType === 2) {
                    this.mMonster.setSpriteSequence(388, 35, 85.8, 100, 18, 0);
                } else if (this.mType === 3) {
                    this.mMonster.setSpriteSequence(215, 43, 69.3, 100, 18,0);
                }
                break;
        }
    }
};
