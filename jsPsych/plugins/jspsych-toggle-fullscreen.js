/* TODO: NEED A README */

(function( $ ) {
	jsPsych["toggle-fullscreen"] = (function(){

		var plugin = {};

		// this just sets up a single element array
		plugin.create = function(params) {
			var trials = [];

			trials[0] = {};
			trials[0].type = "toggle-fullscreen";
			trials[0].onoff = (typeof params.onoff === 'undefined') ? -1 : params.onoff;
			trials[0].data = (typeof params.data === 'undefined') ? {} : params.data[0];
			return trials;
		};

		plugin.trial = function(display_element, block, trial, part) {
			
			// I don't think you need next line, but left it in here to be safe...
			trial = jsPsych.pluginAPI.normalizeTrialVariables(trial);

			display_element.html("");
			
			var action = {};

			if (trial.onoff==-1){
				if ((document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard method
      (!document.mozFullScreen && !document.webkitIsFullScreen)) {
					action = 1;
				} else {
					action = 0;
				}

			} else if (trial.onoff==1) {
				action = 1;
			} else if (trial.onoff==0) {
				action = 0;
			}

			// TODO: maybe improve the full screen text here
			if (action==1){
				display_element.html("Click in this window to put your browser into full screen mode");
			} else {
				display_element.html("Click in this window to exit full screen mode");
			}

			var mouse_listener = function() {
				 
				if (action==1) {               // current working methods

	            	if (document.documentElement.requestFullScreen) {
	            		document.documentElement.requestFullScreen();
	            	} else if (document.documentElement.mozRequestFullScreen) {
	            		document.documentElement.mozRequestFullScreen();
	            	} else if (document.documentElement.webkitRequestFullScreen) {
	            		document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	            	}
	            } else {
	            	display_element.html("Taking your browser out of full screen mode...");
	            	if (document.cancelFullScreen) {
	            		document.cancelFullScreen();
	            	} else if (document.mozCancelFullScreen) {
	            		document.mozCancelFullScreen();
	            	} else if (document.webkitCancelFullScreen) {
	            		document.webkitCancelFullScreen();
	            	}
	            }
	            display_element.unbind('click', mouse_listener); 
	            display_element.html("Thank you, please wait a few seconds...");
	            setTimeout(function(){block.next()}, 3000);
	        }

	        //display_element.addEventListener('click', mouse_listener, false);
	        setTimeout(function(){
	        	display_element.click(mouse_listener);
	        }, 1000);

            // TODO: record whether resizing was successful
   //          var trial_data = {
   //          	type: trial.type,
   //          	trial_index: jsPsych.progress().current_trial_global,
			//     // other values to save go here
			// };
			
			// // this line merges together the trial_data object and the generic
			// // data object (trial.data), and then stores them.
			// block.writeData($.extend({}, trial_data, trial.data));
			
			// // this method must be called at the end of the trial
			// block.next();
		};

		return plugin;
	})();
}) (jQuery);