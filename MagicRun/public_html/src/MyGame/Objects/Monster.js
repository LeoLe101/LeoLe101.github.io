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
    this.time = 3000 + Math.random() * 5000;
    this.goDown = false;
    this.jump = false;

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

    //add rigidbody
    var r = new RigidCircle(this.getXform(), 5);
    r.setMass(0);
    r.setRestitution(0.5);
    this.setRigidBody(r);

    this.localShake = null;
    //this.localShake = null;
}
gEngine.Core.inheritPrototype(Monster, GameObject);

Monster.prototype.update = function () {
    var xform = this.getXform();

    GameObject.prototype.update.call(this); // Move the Hero forward
    this.mMonster.updateAnimation();

    var heroXform = this.mHero.getXform();

    this.generalUpdate();

    var newPosition = vec2.fromValues(heroXform.getXPos(), this.groundY);
    this.panTo(newPosition);


    if (this.mShake !== null)
        this.localShake = this.mShake;

    this.currX = xform.getXPos();
    if (this.currX < this.prevX) {
        this.mMonsterState = Monster.eMonsterState.eRunRight;
    } else {
        this.mMonsterState = Monster.eMonsterState.eRunLeft;
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

    if ((this.mType === 0) && !this.jump) {
        this.randomJump();
    }

    this.doTheJump();

    this.changeAnimation();

};

Monster.prototype.hitByBullet = function (delta) {
    this.healthBar -= delta;
    this.gotHit = true;
};

Monster.prototype.doTheJump = function () {
    var xform = this.getXform();
    if (this.jump) {
        if ((xform.getYPos() <= 30) && !this.goDown) {
            xform.incYPosBy(0.3);
            if ((xform.getYPos() >= 30)) {
                this.goDown = true;
            }
        } else {
            if ((xform.getYPos() >= this.groundY) && this.goDown) {
                xform.incYPosBy(-0.3);
            } else if (xform.getYPos() <= this.groundY) {
                this.jump = false;
                this.goDown = false;
            }
        }
    }
}

Monster.prototype.getDirection = function () {
    if (this.mMonsterState === Monster.eMonsterState.eRunRight) return 0;
    return 1;
}

Monster.prototype.shouldDelete = function () {
    return this.shouldDestroy;
};

Monster.prototype.destroy = function () {
    this.shouldDestroy = true;
};

Monster.eMonsterState = Object.freeze({
    eRunRight: 0,
    eRunLeft: 1
});

Monster.prototype.randomJump = function () {
    this.currTime = new Date();
    if (this.currTime - this.prevTime >= this.time) {
        this.jump = true;
        this.prevTime = this.currTime;
        this.time = 1000 + Math.random() * 8000;
    }
}

Monster.prototype.changeAnimation = function () {

    if (this.mMonsterState !== this.mPreviousMonsterState) {
        this.mPreviousMonsterState = this.mMonsterState;
        switch (this.mMonsterState) {
            case Monster.eMonsterState.eRunLeft:
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
            case Monster.eMonsterState.eRunRight:
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
