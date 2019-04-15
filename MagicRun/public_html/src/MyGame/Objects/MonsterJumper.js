/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MonsterJumper(spriteTexture, spriteTexture_i, hero, atX, atY, type) {
    this.kRefWidth = 80;
    this.kRefHeight = 130;
    this.kDelta = 0.6;

    this.mHero = hero; //follow hero
    this.mMonster = null;
    this.mType = type;
    this.healthBar = 100;

    this.gotHit = false;
    this.groundY = atY;

    this.spriteTexture = spriteTexture;
    this.spriteTexture_i = spriteTexture_i;
    this.kWidth = 0;
    this.kHeight = 0;

    this.prevX = atX;
    this.currX = atX;
    this.currTime = new Date();
    this.prevTime = new Date();

    this.mMonsterState = MonsterJumper.eMonsterState.eRunRight;
    this.mPreviousMonsterState = MonsterJumper.eMonsterState.eRunRight;

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

    //add rigidbody
    var r = new RigidCircle(this.getXform(), 2);
    r.setMass(0);
    r.setRestitution(0.5);
    this.setRigidBody(r);

    this.localShake = null;
    //this.localShake = null;
}
gEngine.Core.inheritPrototype(Monster, GameObject);

MonsterJumper.prototype.update = function () {

    GameObject.prototype.update.call(this); // Move the Hero forward
    this.mMonster.updateAnimation();

    var heroXform = this.mHero.getXform();
    var Xform = this.getXform();

    this.generalUpdate();

    var newPosition = vec2.fromValues(heroXform.getXPos(), this.groundY);
    this.panTo(newPosition);


    if (this.mShake !== null)
        this.localShake = this.mShake;

    this.currX = this.getXform().getXPos();
    if (this.currX < this.prevX) {
        this.mMonsterState = MonsterJumper.eMonsterState.eRunRight;
    } else {
        this.mMonsterState = MonsterJumper.eMonsterState.eRunLeft;
    }
    this.prevX = this.currX;

    if (this.gotHit) {
        if (this.healthBar <= 0) {
            this.destroy();
        } else {
            this.healthBar -= Math.floor((Math.random() * 100) + 20);;
            this.gotHit = false;
        }
    }

    this.randomJump();

    this.changeAnimation();

};

MonsterJumper.prototype.randomJump = function () {
    this.currTime = new Date();
    if (this.currTime - this.prevTime >= 2000) {
        var xform = this.getXform();
        xform.incYPosBy(0.9);
        this.prevTime = this.currTime;
        console.log("Mons Jump!");
    }
}

MonsterJumper.prototype.hitByBullet = function (delta) {
    this.healthBar -= delta;
    this.gotHit = true;
};

MonsterJumper.prototype.shouldDelete = function () {
    return this.shouldDestroy;
};

MonsterJumper.prototype.destroy = function () {
    this.shouldDestroy = true;
};

MonsterJumper.eMonsterState = Object.freeze({
    eRunRight: 0,
    eRunLeft: 1
});

MonsterJumper.prototype.changeAnimation = function () {

    if (this.mMonsterState !== this.mPreviousMonsterState) {
        this.mPreviousMonsterState = this.mMonsterState;
        switch (this.mMonsterState) {
            case MonsterJumper.eMonsterState.eRunLeft:
                this.mMonster.getXform().setSize(-this.kWidth, this.kHeight);
                this.mMonster.setAnimationSpeed(3);
                if (this.mType === 0) {
                    this.mMonster.setSpriteSequence(725, 138, 103.5, 100, 18, 0);
                } else if (this.mType === 1) {
                    this.mMonster.setSpriteSequence(550, 30, 96.8, 100, 14, 0);
                } else if (this.mType === 2) {
                    this.mMonster.setSpriteSequence(388, 35, 85.8, 100, 18, 0);
                } else if (this.mType === 3) {
                    this.mMonster.setSpriteSequence(215, 43, 69.3, 100, 18, 0);
                }
                break;
            case MonsterJumper.eMonsterState.eRunRight:
                this.mMonster.getXform().setSize(this.kWidth, this.kHeight);
                this.mMonster.setAnimationSpeed(3);
                if (this.mType === 0) {
                    this.mMonster.setSpriteSequence(725, 138, 103.5, 100, 18, 0);
                } else if (this.mType === 1) {
                    this.mMonster.setSpriteSequence(550, 30, 96.8, 100, 14, 0);
                } else if (this.mType === 2) {
                    this.mMonster.setSpriteSequence(388, 35, 85.8, 100, 18, 0);
                } else if (this.mType === 3) {
                    this.mMonster.setSpriteSequence(215, 43, 69.3, 100, 18, 0);
                }
                break;
        }
    }
};
