/*-------------------
a player entity
-------------------------------- */
var PlayerEntity = me.ObjectEntity.extend({

    /* -----

    constructor

    ------ */
    init: function(x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);

        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity(3, 3);

        // initial player shooting direction - right
        this.direction = new me.Vector2d( 1.0, 0.0 );

        // adjust the bounding box
        this.updateColRect(3, 42, -1, 0);

        var directions = [ "down", "left", "up", "right" ];
        for ( var i = 0; i < directions.length; i++ )
        {
            var index = i * 4;
            this.addAnimation( directions[ i ] + "idle", [ index ] );
            this.addAnimation( directions[ i ] + "run",
                [ index, index + 1, index, index + 2 ] );
            this.addAnimation( directions[ i ] + "shoot", [ index + 3 ] );
        }
        this.addAnimation( "dead", [ i * 4 ] );
        this.directionString = "right";

        // set player bullet
        this.bullet = 100;
        this.shootingTimer = 0;
        this.shootingTimerMax = 20;
        // this.origVelocity = new me.Vector2d( 7.0, 7.0 );
        // this.dashTimer = 0;
        // this.dashTimerMax = 30;

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        me.game.player = this;
    },

    checkInput: function() {
        var tempDir = new me.Vector2d( 0.0, 0.0 );

        if ( me.input.isKeyPressed( "left" ) ) {
            tempDir.x = -1.0;
            this.directionString = "left";
        }
        if ( me.input.isKeyPressed( "right" ) ) {
            tempDir.x = 1.0;
            this.directionString = "right";
        }
        if ( me.input.isKeyPressed( "up" ) ) {
            tempDir.y = -1.0;
            this.directionString = "up";
        }
        if ( me.input.isKeyPressed( "down" ) ) {
            tempDir.y = 1.0;
            this.directionString = "down";
        }

        if ( tempDir.x !== 0.0 || tempDir.y !== 0.0 ) {
            this.vel.x = tempDir.x * this.accel.x * me.timer.tick;
            this.vel.y = tempDir.y * this.accel.y * me.timer.tick;
            this.direction = tempDir;
        } else {
            this.vel.x = 0;
            this.vel.y = 0;
        }

        // all attacks have to be on cooldown
        if ( me.input.isKeyPressed( "shoot" )  && this.bullet > 0 && this.shootingTimer === 0 ) {
            var bulletPosX = this.pos.x + this.width / 2,
                bulletPosY = this.pos.y + this.height / 2,
                laserEntity = new Bullet(bulletPosX, bulletPosY, this.direction);

            me.game.add(laserEntity, this.z + 1);
            me.game.sort();

            this.bullet -= 1;
            me.game.HUD.updateItemValue("bullet", -1);
            this.shootingTimer = this.shootingTimerMax;
            // this.weakAttackType = ++this.weakAttackType % 2;
            // this.attack( "weakAttack" );
            // me.audio.play( "weakattack" + this.weakAttackType );

            // this.removeEnemies();
        }

        // dash
        // dash also has to be on cooldown
        if ( me.input.isKeyPressed( "dash" ) && this.dashTimer === 0 ) {
            // this.setMaxVelocity( this.origVelocity.x * 2.5,
            //                      this.origVelocity.y * 2.5 );
            // this.dashTimer = this.dashTimerMax;

            // this.addAnimation( "right", [ 9, 10, 11 ] );
            // this.spawnDashParticle();

            // me.audio.play( "dash" );
        }
    },

    updateAnimation: function() {
        if ( this.shootingTimer > 5 ) {
            this.setCurrentAnimation( this.directionString + "shoot" );
        } else if ( this.vel.x !== 0.0 || this.vel.y !== 0.0 ) {
            this.setCurrentAnimation( this.directionString + "run" );
        } else {
            this.setCurrentAnimation( this.directionString + "idle" );
        }
    },

    /* -----

    update the player pos

    ------ */
    update: function() {

        this.checkInput();
        this.updateAnimation();

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

        if (this.shootingTimer > 0) {
            this.shootingTimer--;
        }
        // if (this.dashTimer > 0) {
        //     this.dashTimer--;
        // }

        // update animation if necessary
        if (this.vel.x !== 0 || this.vel.y !== 0) {
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
