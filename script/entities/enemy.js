/* --------------------------
an enemy Entity
------------------------ */
var EnemyEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        this.range = settings.range || 400;
        this.speed = settings.speed || 0.3;

        // define this here instead of tiled
        settings.image = "wheelie_right";
        settings.spritewidth = 64;

        // call the parent constructor
        this.parent(x, y, settings);

        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        // size of sprite

        // make him start from the right
        this.pos.x = x + settings.width - settings.spritewidth;
        this.walkLeft = true;

        // walking & jumping speed
        this.setVelocity(2, 2);

        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;

        this.hp = 3;
        this.directionString = "down";



        var directions = [ "down", "left", "up", "right" ];
        for ( var i = 0; i < directions.length; i++ )
        {
            var index = i * 4;
            this.addAnimation( directions[ i ] + "idle", [ index ] );
            this.addAnimation( directions[ i ] + "run",
                [ index, index + 1, index, index + 2 ] );
            this.addAnimation( directions[ i ] + "shoot", [ index + 3 ] );
        }
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
            if (this.hp <= 0) {
                this.alive = false;
            }
            // this.knockback( 1, 2.0, 30 );
        }
    },

    // manage the enemy movement
    update: function() {
        // do nothing if not visible
        if (!this.visible)
            return false;

        if (this.alive) {
            // if (this.walkLeft && this.pos.x <= this.startX) {
            //     this.walkLeft = false;
            // } else if (!this.walkLeft && this.pos.x >= this.endX) {
            //     this.walkLeft = true;
            // }
            // // make it walk
            // this.flipX(this.walkLeft);
            // this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
            this.updateDirectionString();

            var direction = this.toPlayer();
            var move = false;

            if( direction ) {
                var dist = direction.length();
                if( dist < this.range && dist > 150 )
                {
                    direction.normalize();
                    this.vel.x += direction.x * this.speed;
                    this.vel.y += direction.y * this.speed;
                    this.direction = direction;
                    move = true;

                    // if ( this.shootTimer == 0 && dist > 50 )
                    // {
                    //     this.fireBullet( "shooterBullet", 8.0 );
                    //     this.shootTimer = 180;
                    // }
                }
            }

        } else {
            this.vel.x = 0;
        }

        // check and update movement
        this.updateMovement();

        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
        return false;
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
