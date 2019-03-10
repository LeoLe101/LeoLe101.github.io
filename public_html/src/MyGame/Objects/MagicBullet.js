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
    this.mBulletBoundW = 3;
    this.mBulletBoundH = 3;

    this.mDestroy = false;
    this.mBox = null;
    this._initialize();
}

/** Private */
MagicBullet.prototype._initialize = function () {
    // // sets the background to gray
    // gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    this.mBox = new BoundingBox(this.mBulletBoundPos, this.mBulletBoundW, this.mBulletBoundH);
    this.mSnow = new Snow(this.mBulletBoundPos[0], this.mBulletBoundPos[1], 1, 0, 3, 0, -1, 3, 4, 0, 4.5, 1);
};


MagicBullet.prototype._configBound = function () {
    this.mBox.setBounds(this.mBulletBoundPos, this.mBulletBoundW, this.mBulletBoundH);
};

/** Public */
MagicBullet.prototype.draw = function (camera) {
    this.mSnow.draw(camera);
};

MagicBullet.prototype.update = function (forwardDir, boundStat) {
    gEngine.ParticleSystem.update(this.mSnow);

    if (this.mFlagForward) {
        this.mSnow.setxAcceleration(this.mSnowForWard);
        this.mSnow.setPos(this.mSnow.getPos()[0] += 1, this.mSnow.getPos()[1]);
    } else {
        this.mSnow.setxAcceleration(this.mSnowBackWard);
        this.mSnow.setPos(this.mSnow.getPos()[0] -= 1, this.mSnow.getPos()[1]);
    }

    // Update bounding box when bullet move
    this._configBound();
};

MagicBullet.prototype.collideOther = function (boundingBox) {
    return this.mBox.boundCollideStatus(boundingBox);
};

MagicBullet.prototype.shouldDelete = function () {
    return this.mDestroy;
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