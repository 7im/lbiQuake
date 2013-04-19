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
    name: "metatiles32x32",
    type: "image",
    src: "data/maps_tileset/metatiles32x32.png"
}, {
    name: "level01",
    type: "tmx",
    src: "data/level01.tmx"
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
// the title screen
{
	name: "title_screen",
	type: "image",
	src: "data/GUI/title_screen.png"
},
// the parallax background
{
    name: "parallax1",
    type: "image",
    src: "data/background_images/parallax1.png"
}, {
    name: "parallax2",
    type: "image",
    src: "data/background_images/parallax2.png"
},
// the laser
{
    name: "spinning_coin_gold",
    type: "image",
    src: "data/sprite/spinning_coin_gold.png"
},
// the spinning coin spritesheet
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
    name: "cling",
    type: "audio",
    src: "data/audio/",
    channel: 2
}, {
    name: "stomp",
    type: "audio",
    src: "data/audio/",
    channel: 1
}, {
    name: "jump",
    type: "audio",
    src: "data/audio/",
    channel: 1
}, {
    name: "DST-InertExponent",
    type: "audio",
    src: "data/audio/",
    channel: 1
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
        me.debug.displayFPS = true;


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
        // me.state.set(me.state.GAME_OVER, new LoseScreen());

        // set a global fading transition for the screen
        me.state.transition("fade", "#FFFFFF", 250);

		// add our player entity in the entity pool
		me.entityPool.add("mainPlayer", PlayerEntity);
		me.entityPool.add("CoinEntity", CoinEntity);
		me.entityPool.add("EnemyEntity", EnemyEntity);

		// enable the keyboard
		me.input.bindKey(me.input.KEY.LEFT,  "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.UP,    "up");
        me.input.bindKey(me.input.KEY.DOWN,  "down");
        me.input.bindKey(me.input.KEY.SPACE, "shoot");
		me.input.bindKey(me.input.KEY.ALT,   "dash");
		// me.input.bindKey(me.input.KEY.X,     "jump", true);

		// start the game
		me.state.change(me.state.PLAY);
		// me.state.change(me.state.MENU);
	}

}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

   onResetEvent: function() {
		// play the audio track
		// me.audio.playTrack("DST-InertExponent");

		// load a level
		me.levelDirector.loadLevel("level01");

        // add a default HUD to the game mngr
        me.game.addHUD(0, jsApp.config.height - 60, jsApp.config.width, 60);

        // add a new HUD item
        me.game.HUD.addItem("score", new ScoreObject(jsApp.config.width - 10, 10));
        me.game.HUD.addItem("bullet", new ScoreObject(280, 10, me.game.player.bullet));
        me.game.HUD.addItem("bulletLabel", new ScoreObject(160, 10, 'AMMO'));

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

        this.scroller = "A SMALL STEP BY STEP TUTORIAL FOR GAME CREATION WITH MELONJS       ";
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
        me.audio.play("cling");

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

        this.font.draw(context, "PRESS ENTER TO PLAY", 20, 240);
        this.scrollerfont.draw(context, this.scroller, this.scrollerpos, 440);
    },

    // destroy function
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);

        //just in case
        this.scrollertween.stop();
    }

});
//bootstrap :)
window.onReady(function()
{
	jsApp.onload();
});
