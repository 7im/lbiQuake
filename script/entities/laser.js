var LaserEntity = me.ObjectEntity.extend({
	// extending the init function is not mandatory
	// unless you need to add some extra initialization
	init: function(x, y, settings) {
		if (!settings) {
			settings = {};
		}
		// call the parent constructor
		settings.image = "laser_light";
		settings.spritewidth = 32;

		this.maxwidth = 32;
		this.parent(x, y, settings);
		this.collidable = true;
		if (!this.name) {
			this.name = "laserentity";
		}
		// this actually sets the default acceleration values
		this.setVelocity(10, 5);
		//set max velocity
		this.setMaxVelocity(25,0);
		this.setFriction(0,0);
		this.vel.x = 20;
		this.vel.y = 0;

		// me.audio.play("sfx_gerbil_laser_1");
	},
	// this function is called by the engine, when
	// an object is touched by something (here collected)
	/*
	onCollision: function(res, obj) {
		if(obj.name!="mainplayer"){
			if(obj.name=="virusentity"){
				//this.collidable = false;
				me.game.remove(this);
				//me.gamestat.add("score.caught",1);
			}else{
				//console.log("virus collided with "+obj.name);
			}
		}
	},*/
	update: function(){
		this.pos.x = this.pos.x + this.vel.x*me.timer.tick;
		var res = me.game.collide(this);
		this.parent();

		if(this.pos.x > me.game.viewport.pos.x + me.game.viewport.width){
			me.game.remove(this);
		}

		// check for collision
		var map_collision = this.collisionMap.checkCollision(this.collisionBox, this.vel);
		if (map_collision && map_collision.xtile) {
			//console.log(map_collision);
			me.game.remove(this);
		}

		return true;
	}
});
