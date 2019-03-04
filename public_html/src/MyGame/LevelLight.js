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

    var l = this._createALight(Light.eLightType.eDirectionalLight,
            [0, 0, 3],         // position
            [0, 0, 0],          // Direction 
            [1, 1, 1, 1],        // some color
            5, 10,               // near and far distances
            5, 10,            // inner and outer cones
            2,                   // intensity
            1                  // drop off
            );
    this.mGlobalLightSet.addToSet(l);

    l = this._createALight(Light.eLightType.eDirectionalLight,
            [15, 50, 10],           // position (not used by directional)
            [0, 0, -1],         // Pointing direction 
            [0.7, 0.7, 0.0, 1],     // color
            500, 500,               // near anf far distances: essentially switch this off
            0.1, 0.2,               // inner and outer cones
            2,                      // intensity
            1.0                     // drop off
            );
    this.mGlobalLightSet.addToSet(l);
};