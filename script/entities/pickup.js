
var Item = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings, hud) {
        // call the parent constructor
        this.parent(x, y, settings);
        this.hud = hud;
    },

    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision: function(res, obj) {
        // do something when collected
        if (obj.type !== 'mainPlayer') {
            return false;
        }

        // play a "coin collected" sound
        me.audio.play("pickup");
        for (var i in this.hud) {
            me.game.HUD.updateItemValue(i, this.hud[i]);
            if (i !== 'score') {
                me.game.player[i] += this.hud[i];
            }
        }

        // make sure it cannot be collected "again"
        this.collidable = false;
        // remove it
        me.game.remove(this);
    }

});

/*----------------
 a Ammo entity
------------------------ */
var AmmoEntity = Item.extend({
    init: function(x, y, settings) {
        this.parent(x, y, settings, {
            score: 250,
            bullet: 12
        });
    }
});


/*----------------
 a First Aid entity
------------------------ */
var FirstAidEntity = Item.extend({
    init: function(x, y, settings) {
        this.parent(x, y, settings, {
            score: 500,
            hp: 3
        });
    }
});

/*----------------
 a Card entity
------------------------ */
var CardEntity = Item.extend({
    init: function(x, y, settings) {
        this.parent(x, y, settings, {
            score: 1000,
            card: 1
        });
    }
});