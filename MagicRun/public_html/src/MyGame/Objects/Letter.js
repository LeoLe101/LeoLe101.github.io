/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Letter(atX, atY, spriteTexture, hero, smallLetter, name) {
    
    this.kWidth = 5.5;
    this.kHeight = 5.5;
    
    this.name = name;
    this.letterNames = ["E1","S2","C3","A4","P5","E6"];
    
    this.letterVisible = true;
    this.gameEnded = false;
    
    this.mHero = hero;
    this.mSmallLetter = smallLetter;

    this.mLetter = new TextureRenderable(spriteTexture);
    this.mLetter.setColor([1, 1, 1, 0]);
    this.mLetter.getXform().setPosition(atX, atY);
    this.mLetter.getXform().setSize(this.kWidth, this.kHeight);
    
    this.shouldDraw = true;
    
    GameObject.call(this, this.mLetter);

}
gEngine.Core.inheritPrototype(Letter, GameObject);

Letter.prototype.draw = function (aCamera) {
    if (this.shouldDraw)
        this.mLetter.draw(aCamera);

};

Letter.prototype.update = function () {
    this.mLetter.update();
    
    if (!this.letterVisible) return this.gameEnded;
    
    var heroX = this.mHero.getXform().getXPos();
    var heroY = this.mHero.getXform().getYPos();
    
    var letterX = this.mLetter.getXform().getXPos();
    var letterY = this.mLetter.getXform().getYPos();
    
    if ( Math.abs(heroX -letterX) < this.kWidth/2 && Math.abs(heroY -letterY) < this.kHeight/2) {
        this.shouldDraw = false;
        this.mSmallLetter.makeNormal();
        console.log (this.name);
        console.log (this.letterNames[this.mHero.foundLetters]);
        if (this.name === this.letterNames[this.mHero.foundLetters]){ 
            this.mHero.foundLetters++;
            this.letterVisible = false;
            return false; 
        } else {
            //end game
            this.gameEnded = true;
            return true;
        } 
    }
    return false;
};