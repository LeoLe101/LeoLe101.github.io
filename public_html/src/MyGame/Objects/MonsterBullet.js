/*
 * File: MonsterBullet.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MonsterBullet(dir, atX, atY) {
    // The camera to view the scene
    this.mBullet = null;
    this.mBulletForWard = -9;
    this.mBulletBackWard = 9;

    this.backButton = null;
    this.MainMenuButton = null;

    this.mFlagForward = dir;

    this.mBulletBoundPos = [atX, atY];

    this.mHit = false;
    this.mDestroy = false;
    this.mBox = null;
    this.mDelta = 1;
    this.prevTime = new Date();
    this.currTime = new Date();
    this._initialize();
}

/** Private */
MonsterBullet.prototype._initialize = function () {
    this.mBullet = new Fire(this.mBulletBoundPos[0], this.mBulletBoundPos[1], 1, 0, 2, 0, -1, 7, 4, 0, 1.5, 1);
};

/** Public */
MonsterBullet.prototype.draw = function (camera) {
    this.mBullet.draw(camera);
};

MonsterBullet.prototype.update = function () {
    gEngine.ParticleSystem.update(this.mBullet);

    if (this.mFlagForward) {
        if (!this.mHit) {
            this.mBullet.setxAcceleration(this.mBulletForWard);
            this.mBullet.setPos(this.mBullet.getPos()[0] += this.mDelta, this.mBullet.getPos()[1]);
        }
        if (this.mBullet.getPos()[0] === (this.mBulletBoundPos[0] + 20)) {
            this.shouldSplash();
            this.destroy();
        }
    } else {
        if (!this.mHit) {
            this.mBullet.setxAcceleration(this.mBulletBackWard);
            this.mBullet.setPos(this.mBullet.getPos()[0] -= this.mDelta, this.mBullet.getPos()[1]);
        }
        if (this.mBullet.getPos()[0] === (this.mBulletBoundPos[0] - 20)) {
            this.shouldSplash();
            this.destroy();
        }
    }

    if (this.mHit) {
        this.destroy();
    }
};

MonsterBullet.prototype.destroy = function () {
    this.currTime = new Date();
    if (this.currTime - this.prevTime >= 1000) {
        this.mDestroy = true;
    }
};

MonsterBullet.prototype.shouldDelete = function () {
    return this.mDestroy;
};

MonsterBullet.prototype.shouldSplash = function () {
    this.mDelta = 0;
    this.mBullet.setxAcceleration(0);
    this.mBullet.setWidth(2);
    this.mBullet.setLife(2);
    this.mBullet.setyAcceleration(30);
    this.mBullet.setPos(this.mBullet.getPos()[0], this.mBullet.getPos()[1]);
    this.mHit = true;
};

MonsterBullet.prototype.isBulletInViewport = function (camera) {
    var dcX = this.mBullet.getPos()[0];
    var dcY = this.mBullet.getPos()[1];
    var orX = camera.getWCCenter()[0];
    var orY = camera.getWCCenter()[1];
    //if (dcX <= 125 || dcX >= -25 || dcY <= 105 || dcY >= -35) return true;
    return ((dcX >= orX - (camera.getWCWidth() / 2 + 30)) && (dcX < orX + (camera.getWCWidth() / 2 + 30)) &&
        (dcY >= orY - camera.getWCHeight()) && (dcY < orY + camera.getWCHeight()));
};

MonsterBullet.prototype.getFire = function () {
    return this.mBullet;
};