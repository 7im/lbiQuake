/*-------------------
a player entity
-------------------------------- */
var PlayerEntity = me.ObjectEntity.extend({

    /* -----

    constructor

    ------ */
    bullet: 10000,

    init: function(x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);

        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity(3, 3);

        // adjust the bounding box
        this.updateColRect(8, 48, -1, 0);

        // set player bullet
        // me.gamestat.setValue("bullet", 10);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        me.game.player = this;
    },

    /* -----

    update the player pos

    ------ */
    update: function() {

        if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            this.flipX(true);
            // update the entity velocity
            this.vel.x -= this.accel.x * me.timer.tick;
        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.flipX(false);
            // update the entity velocity
            this.vel.x += this.accel.x * me.timer.tick;
        } else {
            this.vel.x = 0;
        }
        if (me.input.isKeyPressed('up')) {
            // unflip the sprite
            this.flipX(false);
            // gravity will then do the rest
            this.vel.y -= this.accel.y * me.timer.tick;
        } else if (me.input.isKeyPressed('down')) {
            // unflip the sprite
            this.flipX(false);
            // gravity will then do the rest
            this.vel.y += this.accel.y * me.timer.tick;
        } else {
            this.vel.y = 0;
        }

        if (me.input.isKeyPressed('shoot') && this.bullet > 0) {
            var laserEntity = new LaserEntity(this.pos.x + 20, this.pos.y + 5);
            laserEntity.accel.x = 20;
            // laserEntity.vel.x = this.direction==-1?-20:20;
            laserEntity.vel.x = 20;
            laserEntity.vel.y = 0;
            me.game.add(laserEntity, 3);
            me.game.sort();
            this.bullet -= 1;
        }
        // if (me.input.isKeyPressed('jump')) {
        //     // make sure we are not already jumping or falling
        //     if (!this.jumping && !this.falling) {
        //         // set current vel to the maximum defined value
        //         // gravity will then do the rest
        //         this.vel.y = -this.maxVel.y * me.timer.tick;
        //         // set the jumping flag
        //         this.jumping = true;
        //         // play some audio
        //         me.audio.play("jump");
        //     }

        // }

        // check & update player movement
        this.updateMovement();

        // check for collision
        var res = me.game.collide(this);

        if (res) {
            // if we collide with an enemy
            if (res.obj.type == me.game.ENEMY_OBJECT) {
                // check if we jumped on it
                if ((res.y > 0) && ! this.jumping) {
                    // bounce (force jump)
                    this.falling = false;
                    this.vel.y = -this.maxVel.y * me.timer.tick;
                    // set the jumping flag
                    this.jumping = true;
                    // play some audio
                    me.audio.play("stomp");
                } else {
                    // let's flicker in case we touched an enemy
                    this.flicker(45);
                }
            }
        }

        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }

        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    }

});


/*----------------
 a Coin entity
------------------------ */
var CoinEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);
    },

    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision: function() {
        // do something when collected

        // play a "coin collected" sound
        me.audio.play("cling");

        // give some score
        me.game.HUD.updateItemValue("score", 250);

        // make sure it cannot be collected "again"
        this.collidable = false;
        // remove it
        me.game.remove(this);
    }

});
