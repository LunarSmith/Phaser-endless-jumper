// console.log('Hello, World!')
import Phaser from './lib/phaser.js'
import Game from './scenes/Game.js'

// console.dir(Phaser)

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    // name of scene that we want to export
    scene: Game,
    physics: {
        default: 'arcade',
        // can add physic mode as custom name and config inside of json
        arcade: {
            gravity: {
                y: 200
            },
            debug: true
        }
    }
    
})
    
