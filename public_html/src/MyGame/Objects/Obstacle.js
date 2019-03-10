/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*jslint node: true, vars: true, evil: true, bitwise: true */
"use strict";
/* global RigidShape */


function Obstacle(x,y,w,h,res,frct,spriteTexture, hero, isFloor) {
    this.kDelta = 0.3;

    this.kIsFloor = isFloor;
    
    this.mObstacle = null;
    this.mHero = hero;
    
    this.mShapes = new GameObjectSet();
    
    this.createBounds(x,y,w,h,res,frct,spriteTexture);
    
}
gEngine.Core.inheritPrototype(Obstacle, GameObject);

Obstacle.prototype.update = function () {
    
    this.getXform().updateInterpolation();
    
};

Obstacle.prototype.createBounds = function(x,y,w,h,res,frct,texture) {
    
    this.platformAt(x,y,w,h,0,res,frct,texture);
};

Obstacle.prototype.platformAt = function (x, y, w, h, rot, res, frct, texture) {

    var p = new TextureRenderable(texture);
    var xf = p.getXform();
    xf.setSize(w, h);
    xf.setPosition(x, y);
    var g = new GameObject(p);
    var r = new RigidRectangle(xf, w, h);
    g.setRigidBody(r);
    //g.toggleDrawRigidShape();
    if (this.kIsFloor) g.toggleDrawRenderable();
    
    r.setMass(0);
    r.setRestitution(res);
    r.setFriction(frct);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    xf.setRotationInDegree(rot);
    
    this.mObstacle = g;
    GameObject.call(this, this.mObstacle);
  
};


Obstacle.prototype.draw = function(aCamera){
    this.mObstacle.draw(aCamera);

};

Obstacle.prototype.update = function(){
    this.mObstacle.update();
    this.mShapes = new GameObjectSet();
    this.mShapes.addToSet(this.mObstacle);
    this.mShapes.addToSet(this.mHero);
    gEngine.Physics.processCollision(this.mShapes,[]);
};
