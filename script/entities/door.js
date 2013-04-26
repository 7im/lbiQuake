var DoorEntity = me.CollectableEntity.extend({
	// extending the init function is not mandatory
	// unless you need to add some extra initialization
	init: function(x, y, settings) {
		// call the parent constructor
		this.parent(x, y, settings);

		this.isOpen = false;
		this.toggleDoor = false;
	},

	onCollision: function(res, obj) {
		if (this.isOpen) {
			return  false;
		}
		if (obj.type === 'mainPlayer' || obj.type === me.game.ENEMY_OBJECT) {
			this.toggleDoor = true;
		}
		if (obj.type === 'bullet' || obj.type === 'enemyBullet') {
			me.game.remove(obj);
		}
	},

	update: function() {
            me.game.collide(this);
		if (this.toggleDoor) {
			this.isOpen = true;
			this.toggleDoor = false;

			// play a "door open" sound
			me.audio.play("dsdoropn");
			this.setAnimationFrame(1);
			return true;
		}
		return false;
	}
});
