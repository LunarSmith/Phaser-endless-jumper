import Phaser from '../lib/phaser.js'
import Carrot from './Carrot.js'

export default class Game extends Phaser.Scene
{
        // DECLARE local variable to store attribute of its physics type in variable
        /** @type {Phaser.Physics.Arcade.StaticGroup} */ 
        platforms

        /** @type {Phaser.Physics.Arcade.Sprite} */ 
        player

        /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */ 
        cursors

        //The primary use of a Physics Group is a way to collect together physics enable objects that share the same intrinsic structure into a single pool.
         /** @type {Phaser.Physics.Arcade.Group} */
        carrots

        constructor()
        {
            // every scene must have unique key (unique scene)
            // super() in js = call parent class = call Phaser.Scene with parameter 'game' to assign this scene as 'game'
            super('game')
        }
            // load asset before using in the game
        preload()
        {
            // this = instructor for "Game" Scene
            this.load.image('background', 'assets/bg_layer1.png');
            this.load.image('platform', 'assets/ground_grass.png');
            this.load.image('bunny-stand', 'assets/bunny1_stand.png');
            this.load.image('carrot', 'assets/carrot.png') 
            // assign cursor = keyboard input movement with up down left right
            this.cursors = this.input.keyboard.createCursorKeys()
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


            // create the StaticGroup (group for something)
            // static = not effected by gravity but external force only
            // change to use class property intead of local variable
            // platform = static group
            this.platforms = this.physics.add.staticGroup()
            // then create 5 platforms and assign the group
            for (let i = 0; i < 5; ++i)
                {
                    // make the position random in x axis
                    const x = Phaser.Math.Between(80, 400)

                    const y = 150 * i
                     
                    /* @type {Phaser.Physics.Arcade.Sprite} */
                    //  'platform' = sprite (image) platform
                    const platform = this.platforms.create(x, y, 'platform')
                    platform.scale = 0.5
                    
                    /* @type {Phaser.Physics.Arcade.StaticBody} */
                    // body of
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
            
            //create carrot from class (that we created in toher file)
            const carrot = new Carrot(this, 240, 320, 'carrot')  
            this.add.existing(carrot)
            // set carrot (from const carrot) have physic as Carrot class by add itself to group of classtype Carrot
            this.carrots = this.physics.add.group({ 
                classType: Carrot
            })
            this.carrots.get(240, 320, 'carrot')

        }
        //t ,dt = will work in every frame
        update(t,dt)
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
             // left and right input logic 
            if (this.cursors.left.isDown && !touchingDown) {  
                this.player.setVelocityX(-200)
            }  
            else if (this.cursors.right.isDown && !touchingDown)  { 
            this.player.setVelocityX(200) 
            } else  { 
            // stop movement if not left or right 
            this.player.setVelocityX(0) 
            } 

            // make camera focus the player and keep player in screen
            this.cameras.main.startFollow(this.player)
            // set the horizontal dead zone to 1.5x game width
            //  A dead zone is an area around the player where the camera won’t scroll
            // so camera will not follow player when jump on the same platform
            // that's mean when player doesn't jump higher than 1.5 times of width camera will not go
            this.cameras.main.setDeadzone(this.scale.width * 1.5)


            // call this at last line on update to prevent frame break
            // wrap player to make player stays in frame
            this.horizontalWrap(this.player)

        }

        //creating new function for game
        horizontalWrap(sprite)
        {
            // lock sprite not to exceed half of player by update player position at edge when trying to cross
          const halfWidth= sprite.displayWidth*0.5
          const gameWidth= this.scale.width
          if (sprite.x<-halfWidth)
          {
              sprite.x=gameWidth+halfWidth
          }
          else if (sprite.x >gameWidth+halfWidth)
          {
              sprite.x=-halfWidth
          }
        }
 }
