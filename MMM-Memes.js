/* Magic Mirror
 * Module: MMM-Memes
 *
 * By Mykle1
 *
 */
Module.register("MMM-Memes", {

    // Module config defaults.
    defaults: {
        useHeader: false,                            // false if you don't want a header
        header: "",                                 // Any text you want. useHeader must be true
        maxWidth: "300px",
        animationSpeed: 3000,                       // fade speed
        initialLoadDelay: 3250,
        retryDelay: 2500,
        rotateInterval: 5 * 60 * 1000,              // 5 minutes
        updateInterval: 60 * 60 * 1000,

    },

    getStyles: function() {
        return ["MMM-Memes.css"];
    },

	// Define required scripts.
    getScripts: function() {
        return ["moment.js"];
	},

    start: function() {
        Log.info("Starting module: " + this.name);
		this.sendSocketNotification("CONFIG", this.config);


        //  Set locale.
        this.Memes = {};
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "What's in a meme . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }


	//	Rotating my data
		    var Memes = this.Memes;
		    var MemesKeys = Object.keys(this.Memes);
        if (MemesKeys.length > 0) {
            if (this.activeItem >= MemesKeys.length) {
                this.activeItem = 0;
            }
            var Memes = this.Memes[MemesKeys[this.activeItem]];

            var headline = document.createElement("div");
      			headline.classList.add("small", "bright", "headline");
      			headline.innerHTML = Memes.name;
      			wrapper.appendChild(headline);


            var img = document.createElement("img");
      			img.classList.add("photo");
      			img.src = Memes.url;
      			wrapper.appendChild(img);



			} // <-- end of rotation /////////////////////////

        return wrapper;

    }, // <-- End of getDom()


    processMemes: function(data) {
      //  this.today = data.Today;
        this.Memes = data.data.memes;
        this.loaded = true;
        console.log(this.Memes);
    },


    scheduleCarousel: function() {
        console.log("Carousel of Memes fucktion!");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getMemes();
        }, this.config.updateInterval);
        this.getMemes(this.config.initialLoadDelay);
    },

    getMemes: function() {
        this.sendSocketNotification('GET_MEMES');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "MEMES_RESULT") {
            this.processMemes(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }

        this.updateDom(this.config.initialLoadDelay);
    },
});
