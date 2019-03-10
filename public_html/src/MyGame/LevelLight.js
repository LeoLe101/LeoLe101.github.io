/*
 * File: GameLevel_Lights: support the creation of light for LevelLight
 */
/*jslint node: true, vars: true */
/*global gEngine, LevelLight, Light, LightSet */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

StartGame.prototype._createALight = function (type, pos, dir, color, n, f, inner, outer, intensity, dropOff) {
    var light = new Light();
    light.setLightType(type);
    light.setColor(color);
    light.setXPos(pos[0]);
    light.setYPos(pos[1]);
    light.setZPos(pos[2]);
    light.setDirection(dir);
    light.setNear(n);
    light.setFar(f);
    light.setInner(inner);
    light.setOuter(outer);
    light.setIntensity(intensity);
    light.setDropOff(dropOff);
    light.setLightCastShadowTo(true);
    return light;
};

StartGame.prototype._initializeLights = function () {
    this.mGlobalLightSet = new LightSet();

    var l = this._createALight(Light.eLightType.ePointLight,
        [0, 0, 5],         // position
        [0, 0, 0],          // Direction 
        [1, 1, 1, 0.5],        // some color
        5, 8,               // near and far distances
        0, 150,            // inner and outer cones
        1,                   // intensity
        1                  // drop off
    );
    this.mGlobalLightSet.addToSet(l);

    l = this._createALight(Light.eLightType.ePointLight,
        [0, 0, 5],         // position
        [0, 0, 0],          // Direction 
        [1, 1, 1, 0.5],        // some color
        10, 15,               // near and far distances
        100, 150,            // inner and outer cones
        1,                   // intensity
        100                  // drop off
    );
    this.mGlobalLightSet.addToSet(l);
};


