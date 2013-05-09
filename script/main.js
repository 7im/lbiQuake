/*!
 *
 *   melonJS
 *   http://www.melonjs.org
 *
 *   Step by step game creation tutorial
 *
 **/

// game resources
var g_resources = [{
    name: "lbi10",
    type: "image",
    src: "data/maps_tileset/lbi10.png"
}, {
    name: "furntiture",
    type: "image",
    src: "data/maps_tileset/furntiture.png"
}, {
    name: "metatiles32x32",
    type: "image",
    src: "data/maps_tileset/metatiles32x32.png"
}, {
    name: "level01",
    type: "tmx",
    src: "data/level01.tmx"
}, {
    name: "level02",
    type: "tmx",
    src: "data/level02.tmx"
}, {
    name: "player_sprite",
    type: "image",
    src: "data/sprite/player_sprite.png"
},
// our enemty entity
{
    name: "enemy_sprite",
    type: "image",
    src: "data/sprite/enemy_sprite.png"
},
// doors entity
{
    name: "top_door",
    type: "image",
    src: "data/sprite/top_door.png"
},
{
    name: "bottom_door",
    type: "image",
    src: "data/sprite/bottom_door.png"
},
{
    name: "right_door",
    type: "image",
    src: "data/sprite/right_door.png"
},
{
    name: "top_door_red",
    type: "image",
    src: "data/sprite/top_door_red.png"
},
{
    name: "bottom_door_red",
    type: "image",
    src: "data/sprite/bottom_door_red.png"
},
{
    name: "right_door_red",
    type: "image",
    src: "data/sprite/right_door_red.png"
},
{
    name: "red_card",
    type: "image",
    src: "data/sprite/red_card.png"
},
// the title screen
{
    name: "title_screen",
    type: "image",
    src: "data/GUI/title_screen.png"
},
{
	name: "game_over_screen",
	type: "image",
	src: "data/GUI/game_over_screen.jpg"
},
// the parallax background
{
    name: "parallax1",
    type: "image",
    src: "data/background_images/parallax1a.jpg"
}, {
    name: "parallax2",
    type: "image",
    src: "data/background_images/parallax2a.png"
},
// the spinning coin spritesheet
{
    name: "spinning_coin_gold",
    type: "image",
    src: "data/sprite/spinning_coin_gold.png"
},
{
    name: "ammo",
    type: "image",
    src: "data/sprite/ammo.png"
},
// the laser
{
    name:"bullet",
    type: "image",
    src:"data/sprite/bullet.png"
},
{
    name:"laser_light",
    type: "image",
    src:"data/sprite/tmplaser.png"
},
// game font
{
    name: "32x32_font",
    type: "image",
    src: "data/sprite/32x32_font.png"
},

// audio resources
{
    name: "music",
    type: "audio",
    src: "data/audio/",
    channel: 1
},
{
    name: "pickup",
    type: "audio",
    src: "data/audio/",
    channel: 2
}, {
    name: "dsdoropn",
    type: "audio",
    src: "data/audio/",
    channel: 2
}, {
    name: "dsdshtgn",
    type: "audio",
    src: "data/audio/",
    channel: 3
}, {
    name: "dspistol",
    type: "audio",
    src: "data/audio/",
    channel: 3
}, {
    name: "dspopain",
    type: "audio",
    src: "data/audio/",
    channel: 4
}, {
    name: "dspldeth",
    type: "audio",
    src: "data/audio/",
    channel: 4
}];


var jsApp	=
{
    config: {
        width: 960,
        height: 720
    },

	/* ---

		Initialize the jsApp

		---			*/
	onload: function()
	{

		// init the video
		if (!me.video.init('jsapp', this.config.width, this.config.height, false, 1.0))
		{
			alert("Sorry but your browser does not support html 5 canvas.");
         return;
		}

		// Global settings
		me.sys.gravity = 0;

		// Debugging settings
		// me.debug.renderHitBox = true;
        // me.debug.displayFPS = true;


        // initialize the "audio"
        me.audio.init("mp3,ogg");

        // set all resources to be loaded
        me.loader.onload = this.loaded.bind(this);

        // set all resources to be loaded
        me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);
	},


	/* ---

		callback when everything is loaded

		---										*/
	loaded: function () {
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.MENU, new TitleScreen());

		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());
        // me.state.set(me.state.GAME_END, new WinScreen());
        me.state.set(me.state.GAME_OVER, new LoseScreen());
        me.state.set(999, new QuestionScreen());

        // set a global fading transition for the screen
        me.state.transition("fade", "#FFFFFF", 250);

		// add our player entity in the entity pool
		me.entityPool.add("mainPlayer", PlayerEntity);
        me.entityPool.add("AmmoEntity", AmmoEntity);
		me.entityPool.add("CardEntity", CardEntity);
        me.entityPool.add("EnemyEntity", EnemyEntity);
		me.entityPool.add("Door", DoorEntity);

		// enable the keyboard
		me.input.bindKey(me.input.KEY.LEFT,  "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.UP,    "up");
        me.input.bindKey(me.input.KEY.DOWN,  "down");
        me.input.bindKey(me.input.KEY.SPACE, "shoot");
		me.input.bindKey(me.input.KEY.P,     "pause", true);
		// me.input.bindKey(me.input.KEY.X,     "jump", true);

		// start the game
        me.state.change(me.state.MENU);
	}

}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

   onResetEvent: function() {
		// play the audio track
        me.audio.playTrack( "music" );

		// load a level
		me.levelDirector.loadLevel("level01");

        // add a default HUD to the game mngr
        me.game.addHUD(0, jsApp.config.height - 60, jsApp.config.width, 60);

        // add a new HUD item
        me.game.HUD.addItem("score", new ScoreObject(jsApp.config.width - 10, 10));
        me.game.HUD.addItem("bullet", new ScoreObject(280, 10, me.game.player.bullet));
        me.game.HUD.addItem("bulletLabel", new ScoreObject(160, 10, 'AMMO'));
        me.game.HUD.addItem("hp", new ScoreObject(480, 10, me.game.player.hp));
        me.game.HUD.addItem("hpLabel", new ScoreObject(420, 10, 'HP'));
        me.game.HUD.addItem("card", new ItemObject(600, 20, 0, 'red_card'));

        // make sure everyhting is in the right order
        me.game.sort();
	},


	/* ---

		action to perform when game is finished (state change)

		---	*/
	onDestroyEvent: function() {
		// remove the HUD
        me.game.disableHUD();

		// stop the current audio track
		me.audio.stopTrack();
    }

});

/*----------------------

    A title screen

    ----------------------*/

var TitleScreen = me.ScreenObject.extend({    // constructor
    init: function() {
        this.parent(true);

        // title screen image
        this.title = null;

        this.font = null;
        this.scrollerfont = null;
        this.scrollertween = null;

        this.scroller = "A TEAM ROMERO PRODUCTION...                         ";
        this.scrollerpos = 600;
    },

    // reset function
    onResetEvent: function() {
        if (this.title === null) {
            // init stuff if not yet done
            this.title = me.loader.getImage("title_screen");
            // font to display the menu items
            this.font = new me.BitmapFont("32x32_font", 32);
            this.font.set("left");

            // set the scroller
            this.scrollerfont = new me.BitmapFont("32x32_font", 32);
            this.scrollerfont.set("left");

        }

        // reset to default value
        this.scrollerpos = 640;

        // a tween to animate the arrow
        this.scrollertween = new me.Tween(this).to({
            scrollerpos: -2200
        }, 10000).onComplete(this.scrollover.bind(this)).start();

        // enable the keyboard
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);

        // play something
        me.audio.play("pickup");

    },

    // some callback for the tween objects
    scrollover: function() {
        // reset to default value
        this.scrollerpos = 640;
        this.scrollertween.to({
            scrollerpos: -2200
        }, 10000).onComplete(this.scrollover.bind(this)).start();
    },

    // update function
    update: function() {
        // enter pressed ?
        if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }
        return true;
    },

    // draw function
    draw: function(context) {
        context.drawImage(this.title, 0, 0);

        this.font.draw(context, "PRESS ENTER TO PLAY", 160, 480);
        this.scrollerfont.draw(context, this.scroller, this.scrollerpos, 640);
    },

    // destroy function
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);

        //just in case
        this.scrollertween.stop();
    }

});

var LoseScreen = me.ScreenObject.extend({
    init: function() {
        this.parent(true);

        // title screen image
        this.screen = null;
        this.text = null;
    },
    onResetEvent: function() {
        if (this.screen === null) {
            // init stuff if not yet done
            this.screen = me.loader.getImage("game_over_screen");
            // font to display the menu items
            this.text = new me.BitmapFont("32x32_font", 32);
            this.text.set("left");
        }

        // enable the keyboard
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
    },
    // update function
    update: function() {
        // enter pressed ?
        if (me.input.isKeyPressed('enter')) {
            me.state.change(999);
        }
        return true;
    },
    // draw function
    draw: function(context) {
        context.drawImage(this.screen, 0, 0);
        this.text.draw(context, "GAME OVER", 320, 280);
    },
    // destroy function
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
    }
});

var QuestionScreen = me.ScreenObject.extend({
    init: function() {
        this.parent(true);

        // title screen image
        this.screen = null;
        this.text = null;
    },
    onResetEvent: function() {
        if (this.screen === null) {
            // init stuff if not yet done
            this.screen = me.loader.getImage("title_screen");
            // font to display the menu items
            this.text = new me.BitmapFont("32x32_font", 32);
            this.text.set("left");
        }

        // enable the keyboard
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
    },
    // update function
    update: function() {
        // enter pressed ?
        if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.MENU);
        }
        return true;
    },
    // draw function
    draw: function(context) {
        context.drawImage(this.screen, 0, 0);
        this.text.draw(context, "ANY QUESTION?", 260, 420);
    },
    // destroy function
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
    }
});

//bootstrap :)
window.onReady(function()
{
	jsApp.onload();
});
