/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MonsterSet() {
    this.mSet = [];
    this.hasShaken = [];
    GameObject.call(this);
}
gEngine.Core.inheritPrototype(MonsterSet, GameObjectSet);

MonsterSet.prototype.delete = function (camera) {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        if (this.mSet[i].shouldDelete() || !this.mSet[i].isObjectInViewport(camera)) {
            this.mSet.splice(i, 1);
            this.hasShaken.splice(i, 1);
        }
    }
};

MonsterSet.prototype.addOther = function () {
    this.hasShaken.push(false);
};

/*MonsterSet.prototype.pixelTouches = function (otherObj, h) {
    var patrolSet = otherObj.getSet();
    var i, j;
    for (i = 0; i < this.mSet.length; i++) {
        for (j = 0; j < patrolSet.length; j++) {
            if (this.hasShaken[i]) continue;
            if (this.mSet[i].pixelTouches(patrolSet[j].getHead(), h)) {
                this.mSet[i].shake(4, 0.2, 20, 300);
                this.hasShaken[i] = true;
                patrolSet[j].headHit();
            }
            if (this.mSet[i].pixelTouches(patrolSet[j].getWingTop(), h) ) {
                this.mSet[i].shake(4, 0.2, 20, 300);
                this.hasShaken[i] = true;
                patrolSet[j].wingTopHit(0.2);
            }
            if (this.mSet[i].pixelTouches(patrolSet[j].getWingBot(), h) ) {
                this.mSet[i].shake(4, 0.2, 20, 300);
                this.hasShaken[i] = true;
                patrolSet[j].wingBotHit(0.2);
            }
        }
    }
};*/


