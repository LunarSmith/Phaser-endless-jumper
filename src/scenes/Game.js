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
            // change to use class property intead of local variable
            this.platforms = this.physics.add.staticGroup()
            // then create 5 platforms and assign the group
            for (let i = 0; i < 5; ++i)
                {
                    // make the position random in x axis
                    const x = Phaser.Math.Between(80, 400)

                    const y = 150 * i
                     
                    /* @type {Phaser.Physics.Arcade.Sprite} */
                    const platform = this.platforms.create(x, y, 'platform')
                    platform.scale = 0.5
                    
                    /* @type {Phaser.Physics.Arcade.StaticBody} */
                    const body = platform.body
                    body.updateFromGameObject()
                }

            // create a bunny sprite
            // add player as a class
            this.player = this.physics.add.sprite(240, 320, 'bunny-stand').setScale(0.5)

            // .add.collider(a,b) = set the rule that object a and b will collide
            this.physics.add.collider(this.platforms, this.player)
            
            // we can set which direction will include in collision checking and which side is not
            // in this case we will check collision on under player body only
            this.player.body.checkCollision.up = false
            this.player.body.checkCollision.left = false
            this.player.body.checkCollision.right = false

            
            // set camera to follow player because it is an endless jumper
            this.cameras.main.startFollow(this.player)


        }
        //will work in every scene
        update()
        {   
            // .iterate = make this run forever
            // child = in each time it run (each time platform spawn) it will do child =>{}
            this.platforms.children.iterate(child => {
                /** @type {Phaser.Physics.Arcade.Sprite} */
                const platform = child
                // check y coordinate of platform scroll down (+y = down)
                const scrollY = this.cameras.main.scrollY
                // if platform leave main camera more than 700 pixel (platform is higher than main camera coordinate(player))
                if (platform.y >= scrollY + 700)
                {
                    //let it go down a little bit so we can see platform spawn continueously 
                    //(because if we doesn't do it will think that coordinate is out of screen and will not create)
                    platform.y = scrollY - Phaser.Math.Between(50, 100)
                    platform.body.updateFromGameObject()
                }
            })


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
            // set the horizontal dead zone to 1.5x game width
            //  A dead zone is an area around the player where the camera won’t scroll
            // so camera will not follow player when jump on the same platform
            // that's mean when player doesn't jump higher than 1.5 times of width camera will not go
            this.cameras.main.setDeadzone(this.scale.width * 1.5)

            // wrap [;ayer to make player stays in
            this.horizontalWrap(this.player)


        }

        //creating new function for game
        horizontalWrap(sprite)
        {
          const halfWidth= sprite.displayWidth*0.5
          const gameWidth= this.scale.width
          if (sprite.x<-halfWidth)
          {
              sprite.x=gameWidth+halfWidth
          }
          elseif (sprite.x >gameWidth+halfWidth)
          {
              sprite.x=-halfWidth
          }
        }
 }
