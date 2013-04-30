var Bullet = me.ObjectEntity.extend({
	config: {
		distance: 75
	},

	// extending the init function is not mandatory
	// unless you need to add some extra initialization
	init: function(x, y, dir, settings) {
		if (!settings) {
			settings = {
				image: 'bullet',
				spritewidth: 10
			};
		}
		this.parent(x, y, settings);

		this.type = 'bullet';
		if (!this.name) {
			this.name = "laserentity";
		}
		// this actually sets the default acceleration values
		this.setVelocity(10, 5);
		//set max velocity
		this.setMaxVelocity(25,0);
		this.setFriction(0,0);
		this.vel.x = dir.x * 6;
		this.vel.y = dir.y * 6;
		this.distance = this.config.distance;

		me.audio.play("dspistol");
	},

	update: function() {
		this.pos.x = this.pos.x + this.vel.x * me.timer.tick;
		this.pos.y = this.pos.y + this.vel.y * me.timer.tick;
		this.distance--;

		var res = me.game.collide(this),
			isOutsideX = this.pos.x < 0 || this.pos.x > me.game.viewport.pos.x + me.game.viewport.width,
			isOutsideY = this.pos.y < 0 || this.pos.y > me.game.viewport.pos.y + me.game.viewport.height;

		this.parent();

		if ( isOutsideX || isOutsideY || this.distance < 1 ) {
			me.game.remove(this);
		}

		// check for collision
		var map_collision = this.collisionMap.checkCollision(this.collisionBox, this.vel);
		if (map_collision && (map_collision.xtile || map_collision.ytile) ) {
			me.game.remove(this);
		}

		return true;
	}
});

var Laser = Bullet.extend({
	init: function(x, y, dir) {
		this.parent(x, y, dir, {
			image: 'laser_light',
			spritewidth: 32
		});
	}
});
