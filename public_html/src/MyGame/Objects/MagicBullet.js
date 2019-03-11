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
    // // sets the background to gray
    // gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    this.mBox = new BoundingBox(this.mBulletBoundPos, this.mBulletBoundW, this.mBulletBoundH);
    this.mSnow = new Snow(this.mBulletBoundPos[0], this.mBulletBoundPos[1], 1, 0, 3, 0, -1, 5, 4, 0, 4.5, 1);
};


MagicBullet.prototype._configBound = function () {
    this.mBox.setBounds(this.mBulletBoundPos, this.mBulletBoundW, this.mBulletBoundH);
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
            this.currTime = new Date();
            if (this.currTime - this.prevTime >= 1000) {
                this.mDestroy = true;
            }
        }
    } else {
        if (!this.mHit) {
            this.mSnow.setxAcceleration(this.mSnowBackWard);
            this.mSnow.setPos(this.mSnow.getPos()[0] -= this.mDelta, this.mSnow.getPos()[1]);
        }
        if (this.mSnow.getPos()[0] === (this.mBulletBoundPos[0] - 20)) {
            this.shouldSplash();
            this.currTime = new Date();
            if (this.currTime - this.prevTime >= 1000) {
                this.mDestroy = true;
            }
        }
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

MagicBullet.prototype.shouldSplash = function () {
    this.mDelta = 0;
    this.mSnow.setxAcceleration(0);
    this.mSnow.setWidth(2);
    this.mSnow.setLife(2);
    this.mSnow.setyAcceleration(-30);
    this.mSnow.setPos(this.mSnow.getPos()[0], this.mSnow.getPos()[1]);
    this.mHit = true;
};

MagicBullet.prototype.createParticle = function(atX, atY) {
    var life = 30 + Math.random() * 200;
    var p = new ParticleGameObject("assets/particle.png", atX, atY, life);
    p.getRenderable().setColor([1, 0, 0, 1]);
    
    // size of the particle
    var r = 3.5 + Math.random() * 2.5;
    p.getXform().setSize(r, r);
    
    // final color
    var fr = 3.5 + Math.random();
    var fg = 0.4 + 0.1 * Math.random();
    var fb = 0.3 + 0.1 * Math.random();
    p.setFinalColor([fr, fg, fb, 0.6]);
    
    // velocity on the particle
    var fx = 10 * Math.random() - 20 * Math.random();
    var fy = 10 * Math.random();
    p.getPhysicsComponent().setVelocity([fx, fy]);
    
    // size delta
    p.setSizeDelta(0.98);
    
    return p;
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