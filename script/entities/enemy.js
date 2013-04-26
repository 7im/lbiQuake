/* --------------------------
an enemy Entity
------------------------ */
var EnemyEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        this.range = settings.range || 300;
        this.speed = settings.speed || 0.3;

        // define this here instead of tiled
        settings.image = "enemy_sprite";
        settings.spritewidth = 48;
        settings.spriteheight = 48;

        // call the parent constructor
        this.parent(x, y, settings);

        // walking & jumping speed
        this.setVelocity(2, 2);

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

        // make it collidable
        this.collidable = true;

        this.shootTimer = 0;

        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;

        this.hp = 3;
    },

    updateDirectionString: function()
    {
        if ( this.vel.y > 0.0 )
            this.directionString = "down";
        if ( this.vel.y < 0.0 )
            this.directionString = "up";
        if ( this.vel.x > 0.0 )
            this.directionString = "right";
        if ( this.vel.x < 0.0 )
            this.directionString = "left";
    },

    /** Get a vector to the player. */
    toPlayer: function()
    {
        if ( me.game.player ) {
            return new me.Vector2d(
                me.game.player.pos.x
                    + me.game.player.width / 2
                    - this.pos.x - this.width / 2,
                me.game.player.pos.y
                    + me.game.player.height / 2
                    - this.pos.y - this.height / 2
            );
        }
        return;
    },

    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {

        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        if (this.alive && obj.type === 'bullet') {
            this.flicker(45);
            this.hp -= 1;
            this.collidable = false;
            this.hitTimer = 10;

            if (this.hp <= 0) {
                this.alive = false;
            }

            me.game.remove(obj);
            me.audio.play('dspopain');
            // this.knockback( 1, 2.0, 30 );
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

    // manage the enemy movement
    update: function() {
        // do nothing if not visible
        if (!this.visible)
            return false;

        if (this.alive) {

            this.updateAnimation();

            this.updateDirectionString();

            var direction = this.toPlayer();

            if ( direction ) {
                var dist = direction.length();
                if( dist < this.range ) {
                    direction.normalize();
                    this.vel.x += direction.x * this.speed;
                    this.vel.y += direction.y * this.speed;
                    this.direction = direction;

                    if ( this.shootTimer === 0 ) {
                        this.fireBullet();
                    }
                    if ( dist < this.range - 100 ) {
                        this.vel.x = 0;
                        this.vel.y = 0;
                    }
                } else {
                    this.vel.x = 0;
                    this.vel.y = 0;
                }
            }

            // check for collision
            me.game.collide(this);

            if (this.hitTimer > 0) {
                this.hitTimer--;
            } else {
                this.collidable = true;
            }
            if ( this.shootTimer > 0 ) {
                this.shootTimer--;
            }

        } else {
            this.vel.x = 0;
            this.vel.y = 0;
            this.setCurrentAnimation( "dead" );
        }

        // check and update movement
        this.updateMovement();

        // update animation if necessary
        // need to check collidable to finish flicker?
        if (this.vel.x!=0 || this.vel.y!=0 || !this.collidable) {
            // update object animation
            this.parent();
            return true;
        }
        return false;
    },

    fireBullet: function() {
        // note collide is false as the player checks its own collision, bullet will be recipient & get oncollision call
        var bulletPosX = this.pos.x + this.width / 2,
            bulletPosY = this.pos.y + this.height / 2,
            dir = this.toPlayer();
        dir.normalize();

        var bullet = new Laser(this.pos.x, this.pos.y, dir);
        bullet.type = 'enemyBullet';

        me.game.add( bullet, this.z + 1 );
        me.game.sort();

        this.shootTimer = 180;
        me.audio.play( "dsdshtgn" );
    }

    // knockback: function( damage, amt, length )
    // {
    //     this.hp -= damage;
    //     me.audio.play( "hit" );

    //     // death
    //     if ( this.hp <= 0 )
    //     {
    //         var dPosX = this.pos.x + ( this.width / 2 ) - 48;
    //         var dPosY = this.pos.y + ( this.height / 2 ) - 48;
    //         var deathPart = new PlayerParticle( dPosX, dPosY, "die", 96, 5, [ 0, 1, 2, 3, 4, 5 ], "", false );
    //         me.game.add( deathPart, this.z + 1 );
    //         me.game.remove( this );
    //         me.game.sort();
    //         me.audio.play( this.deathSound );
    //         return;
    //     }

    //     var knockback = amt;

    //     if ( length > 0 && amt > 0 )
    //     {
    //         this.setMaxVelocity( knockback, knockback );

    //         this.collidable = false;
    //         this.flicker( length, function()
    //         { this.setMaxVelocity( this.origVelocity, this.origVelocity );
    //             this.collidable = true; } );

    //         this.vel.x += this.toPlayer().x * knockback * -0.5;
    //         this.vel.y += this.toPlayer().y * knockback * -0.5;
    //     }
    // }
});
