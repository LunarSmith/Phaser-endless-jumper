
import Phaser from '../lib/phaser.js'

//create class of carrot as sprite class
// we create as class to hide config that used in this sprite/chracter only
// as we willuse in physic group we can change from Phaser.GameObjects.Sprite
// export default class Carrot extends Phaser.GameObjects.Sprite
// to
export default class Carrot extends Phaser.Physics.Arcade.Sprite
{
    // create local variable to use under Carrot class only
    /**
    * @param {Phaser.Scene} scene
    * @param {number} x
    * @param {number} y
    * @param {string} texture
    */

    //call everytime this class called
    // we custom made variable 'texture' as key to load image used for sprite
    constructor (scene, x, y, texture)
    {
        // called parent class Phaser.sprite with param  scene, x pos , y pos , texture
        super(scene, x, y, texture)
        this.setScale(0.5)
    }

}