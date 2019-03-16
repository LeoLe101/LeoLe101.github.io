/*
 * File: MagicBullet.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MagicBullet(dir, atX, atY) {
    // The camera to view the scene
    this.mSnow = null;
    this.mSnowForWard = -9;
    this.mSnowBackWard = 9;

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
MagicBullet.prototype._initialize = function () {
    this.mSnow = new Snow(this.mBulletBoundPos[0], this.mBulletBoundPos[1], 1, 0, 3, 0, -1, 5, 4, 0, 4.5, 1);
};

/** Public */
MagicBullet.prototype.draw = function (camera) {
    this.mSnow.draw(camera);
};

MagicBullet.prototype.update = function () {
    gEngine.ParticleSystem.update(this.mSnow);

    if (this.mFlagForward) {
        if (!this.mHit) {
            this.mSnow.setxAcceleration(this.mSnowForWard);
            this.mSnow.setPos(this.mSnow.getPos()[0] += this.mDelta, this.mSnow.getPos()[1]);
        }
        if (this.mSnow.getPos()[0] === (this.mBulletBoundPos[0] + 20)) {
            this.shouldSplash();
            this.destroy();
        }
    } else {
        if (!this.mHit) {
            this.mSnow.setxAcceleration(this.mSnowBackWard);
            this.mSnow.setPos(this.mSnow.getPos()[0] -= this.mDelta, this.mSnow.getPos()[1]);
        }
        if (this.mSnow.getPos()[0] === (this.mBulletBoundPos[0] - 20)) {
            this.shouldSplash();
            this.destroy();
        }
    }

    if (this.mHit) {
        this.destroy();
    }
};

MagicBullet.prototype.destroy = function () {
    this.currTime = new Date();
    if (this.currTime - this.prevTime >= 1000) {
        this.mDestroy = true;
    }
};

MagicBullet.prototype.shouldDelete = function () {
    return this.mDestroy;
};

MagicBullet.prototype.shouldSplash = function () {
    this.mDelta = 0;
    this.mSnow.setxAcceleration(0);
    this.mSnow.setWidth(2);
    this.mSnow.setLife(2);
    this.mSnow.setyAcceleration(-30);
    this.mSnow.setPos(this.mSnow.getPos()[0], this.mSnow.getPos()[1]);
    this.mHit = true;
};

MagicBullet.prototype.isBulletInViewport = function (camera) {
    var dcX = this.mSnow.getPos()[0];
    var dcY = this.mSnow.getPos()[1];
    var orX = camera.getWCCenter()[0];
    var orY = camera.getWCCenter()[1];
    //if (dcX <= 125 || dcX >= -25 || dcY <= 105 || dcY >= -35) return true;
    return ((dcX >= orX - (camera.getWCWidth() / 2 + 30)) && (dcX < orX + (camera.getWCWidth() / 2 + 30)) &&
        (dcY >= orY - camera.getWCHeight()) && (dcY < orY + camera.getWCHeight()));
};

MagicBullet.prototype.getSnow = function () {
    return this.mSnow;
};