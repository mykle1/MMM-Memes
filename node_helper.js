/* Magic Mirror
 * Module: MMM-Memes
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');



module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getMemes: function(url) {
        request({
            url: "https://api.imgflip.com/get_memes",
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
				console.log(result);
                this.sendSocketNotification('MEMES_RESULT', result);
            }
        });
    },



    socketNotificationReceived: function(notification, payload) {
    	if (notification === 'CONFIG'){
			   this.config = payload;
		 } else if (notification === 'GET_MEMES') {
               this.getMemes(payload);
            }
    }
});
