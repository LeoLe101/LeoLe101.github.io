/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Moon(spriteTexture) {
    this.kDelta = 0.3;

    this.mMoon = new SpriteRenderable(spriteTexture);
    this.mMoon.setColor([1, 1, 1, 0]);
    this.mMoon.getXform().setPosition(80, 60);
    this.mMoon.getXform().setSize(4, 4);
    this.mMoon.setElementPixelPositions(0, 512, 0, 512);
    GameObject.call(this, this.mMoon);
}
gEngine.Core.inheritPrototype(Moon, GameObject);

Moon.prototype.update = function () {
    
    this.getXform().updateInterpolation();
    
};