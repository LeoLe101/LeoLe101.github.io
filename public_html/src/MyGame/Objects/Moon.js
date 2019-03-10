/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Moon(spriteTexture, lightSet) {
    this.kDelta = 0.3;

    this.mMoon = new LightRenderable(spriteTexture);
    this.mMoon.setColor([1, 1, 1, 0]);
    this.mMoon.getXform().setPosition(80, 60);
    this.mMoon.getXform().setSize(4, 4);
    this.mMoon.setElementPixelPositions(0, 512, 0, 512);

    // Get some lights on this Moon!
    this.light = this._createPointLight();
    lightSet.addToSet(this.light);
    this.mMoon.addLight(this.light);

    GameObject.call(this, this.mMoon);
}
gEngine.Core.inheritPrototype(Moon, GameObject);

Moon.prototype.update = function () {
    this.light.set2DPosition(this.getXform().getPosition());
    this.getXform().updateInterpolation();
};

Moon.prototype._createPointLight = function () {
    var lgt = new Light();
    lgt.setLightType(0);
    lgt.setColor([1, 1, 1, 0.5]);
    lgt.setXPos(0);
    lgt.setYPos(0);
    lgt.setZPos(1);
    lgt.setNear(5);
    lgt.setFar(8);
    lgt.setIntensity(0.1);
    lgt.setDropOff(20);
    lgt.setLightCastShadowTo(true);
    return lgt;
};
