/* File: UITexture
 *      a plain textured UI Element
 */
/**
 * Texture for UI
 * @param {texture} myTexture Texture for the UITexture
 * @param {Array[]} position Base position for the UITexture
 * @param {Array[]} size The size for the UITexture
 * @class UITexture
 * @returns {UITexture}
 */
function UITexture(myTexture, position, size) {
    this.mTex = new SpriteRenderable(myTexture);
    this.mIsNormal = false;
    UIElement.call(this, this.mTex, position, size);
}
gEngine.Core.inheritPrototype(UITexture, UIElement);

UITexture.prototype.isNormalColor = function() {
    return this.mIsNormal;
};

UITexture.prototype.makeLight = function() {
    this.mTex.setColor([1, 1, 1, 0.5]);
};

UITexture.prototype.makeNormal = function() {
    this.mTex.setColor([1, 1, 1, 0]);
    this.mIsNormal = true;
};

