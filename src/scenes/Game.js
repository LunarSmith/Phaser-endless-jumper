import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene
{
    constructor()
        {
            // every scene must have unique key (unique scene)
            super('game')
        }
            // load asset before using in the game
        preload()
        {
            // this = instructor for "Game" Scene
            this.load.image('background', 'assets/bg_layer1.png');
            this.load.image('platform', 'assets/ground_grass.png');
            this.load.image('bunny-stand', 'assets/bunny1_stand.png');


        }
        // create() => called when asset are all loaded
        // this will de done only first time game is running
        // only asset that already loaded can be used in create()
        create()
        {
            // we fix cordinate to middle of phaser screen
            // x,y orordinate start from top left ( -> = +x and V = + y)
            // we fix  width: 480, height: 640 so 240,320 = middle of the screen
            // .setScrollFactor(1, 0) = set as not scrollable
            this.add.image(240, 320, 'background').setScrollFactor(1, 0)
            // we should use physic.add because it has to be involved with gravity
            // this.physics.add.image(240, 320, 'platform').setScale(0.5)

            // create the StaticGroup (group for)
            // static = not effected by gravity but external force only
            const platforms = this.physics.add.staticGroup()
            // then create 5 platforms and assign the group
            for (let i = 0; i < 5; ++i)
                {
                    // make the position random in x axis
                    const x = Phaser.Math.Between(80, 400)

                    const y = 150 * i
                    
                    /* @type {Phaser.Physics.Arcade.Sprite} */
                    const platform = platforms.create(x, y, 'platform')
                    platform.scale = 0.5
                    
                    /* @type {Phaser.Physics.Arcade.StaticBody} */
                    const body = platform.body
                    body.updateFromGameObject()
                }

            // create a bunny sprite
            // add player as a class
            this.player = this.physics.add.sprite(240, 320, 'bunny-stand').setScale(0.5)

            // .add.collider(a,b) = set the rule that object a and b will collide
            this.physics.add.collider(platforms, this.player)
            
            // we can set which direction will include in collision checking and which side is not
            // in this case we will check collision on under player body only
            this.player.body.checkCollision.up = false
            this.player.body.checkCollision.left = false
            this.player.body.checkCollision.right = false



        }
        //will work in every scene
        update()
        {   
            //check if body of player sprite touching anything on down (under) side of the sprite
            const touchingDown = this.player.body.touching.down
            if (touchingDown)
            {
                // this makes the bunny jump straight up
                // -y = go up
                this.player.setVelocityY(-300)
            }

            // make camera focus the player and keep player in screen
            this.cameras.main.startFollow(this.player)



        }
 }
