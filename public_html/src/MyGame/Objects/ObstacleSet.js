/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ObstacleSet() {
    this.mSet = [];
    this.hasShaken = [];
    GameObject.call(this);
}
gEngine.Core.inheritPrototype(ObstacleSet, GameObjectSet);

ObstacleSet.prototype.delete = function (camera) {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        if (this.mSet[i].shouldDelete() || !this.mSet[i].isObjectInViewport(camera)) {
            this.mSet.splice(i, 1);
        }
    }
};
