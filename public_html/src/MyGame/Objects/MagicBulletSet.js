"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MagicBulletSet() {
    this.mSet = [];
    GameObjectSet.call(this);
}
gEngine.Core.inheritPrototype(MagicBulletSet, GameObjectSet);

MagicBulletSet.prototype.getSet = function() {
    return this.mSet;
};

MagicBulletSet.prototype.delete = function(camera){
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        if (this.mSet[i].shouldDelete() || !this.mSet[i].isBulletInViewport(camera)) {
            this.mSet.splice(i, 1);
        }
    }
};