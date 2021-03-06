/*--------------
a score HUD Item
--------------------- */

var ScoreObject = me.HUD_Item.extend({
    init: function(x, y, val) {
        // call the parent constructor
        this.parent(x, y, val);
        // create a font
        this.font = new me.BitmapFont("32x32_font", 32);
    },

    /* -----

    draw our score

    ------ */
    draw: function(context, x, y) {
        this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
    }

});

var ItemObject = me.HUD_Item.extend({
    init: function(x, y, val, image) {
        // call the parent constructor
        this.parent(x, y, val);
        // create image icon
        this.icon = me.loader.getImage( image );
    },

    /* -----

    draw our score

    ------ */
    draw: function(context, x, y) {
        if (this.value > 0) {
            context.drawImage(this.icon, this.pos.x + x, this.pos.y + y);
        }
    }

});