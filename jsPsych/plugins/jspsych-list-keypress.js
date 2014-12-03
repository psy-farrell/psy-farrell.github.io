/**
 * Simon Farrell
 * June 2014
 * 
 * This is a plugin to present a list of stimuli, and then collect a series of keypress responses.
 * 
//  parameters
//      stimuli: array of array of stimuli to present. One stimulus array per trial, each element of
//                  the trial array being a single item. Each inner elements of the array can be 
//                  either paths to images or HTML strings
//      stim_time: how long to display each item. Can be either an array of arrays, or a single scalar.
//                  Defaults to 1000 ms
//      stim_isi: blank pause between item n and N+1. Can be array of arrays or a single scalar.
//                  Is also used to set the time between final item and recall period (last element)
//                  of array. Defaults to 0 ms
//      timing_post_trial: how long to show a blank screen after the trial ends.
//      nResponses: How many typed responses to collect before moving to next trial.
//                  Defaults to the number of stimuli for each trial
//      fix_time: A 2-element vector representing the duration of a fixation cross, and blank time
//                  following the cross. If set to [0, 0], no fixation cross is shown
//
//      is_html: must set to true when using HTML strings as the stimuli.
//      prompt: optional HTML string to prompt for typed recall.
//      data: the optional data object
 * 
 */
 
 (function( $ ) {
 	jsPsych["list-keypress"] = (function(){

 		var plugin = {};

 		plugin.create = function(params) {
 			var trials = new Array(params.stimuli.length);
 			for(var i = 0; i < trials.length; i++)
 			{
 				trials[i] = {};
 				trials[i].type = "list-keypress";
 				trials[i].stims = params.stimuli[i];

 				trials[i].stim_time = {};
                if (typeof params.stim_time ==='undefined'){
                    for (var j=0; j<trials[i].stims.length; j++){
                        trials[i].stim_time[j] = 1000;
                    }
                } else if (params.stim_time instanceof Array){
                    trials[i].stim_time = params.stim_time[i];
                } else{
                    for (var j=0; j<trials[i].stims.length; j++){
                      trials[i].stim_time[j] = params.stim_time;
                    }
                }

                trials[i].stim_isi = {};
                if (typeof params.stim_isi ==='undefined'){
                    for (var j=0; j<(trials[i].stims.length); j++){
                        trials[i].stim_isi[j] = 0;
                    }
                } else if (params.stim_isi instanceof Array){
                    trials[i].stim_isi = params.stim_isi[i];
                } else {
                    for (var j=0; j<trials[i].stims.length; j++){
                        trials[i].stim_isi[j] = params.stim_isi;
                    }
                }

 				trials[i].prompt = (typeof params.prompt === 'undefined') ? "?" : params.prompt;
 				trials[i].data = (typeof params.data === 'undefined') ? {} : params.data[i];
 				trials[i].is_html = (typeof params.is_html === 'undefined') ? true : params.is_html;
 				trials[i].timing_post_trial = (typeof params.timing_post_trial === 'undefined') ? 1000 : params.timing_post_trial;
                trials[i].nResponses = (typeof params.n_responses === 'undefined') ? trials[i].stims.length : params.n_responses;
                trials[i].fix_time = (typeof params.n_responses === 'undefined') ? [500, 500] : params.fix_time;


 				// should be "none","letters","topnumbers","numpad","list"
 				trials[i].restricted = (typeof params.restricted === 'undefined') ? "list" : params.restricted;
 			}
 			return trials;
 		};

 		plugin.trial = function(display_element, block, trial, part) {

			// allow variables as functions
			trial = jsPsych.pluginAPI.normalizeTrialVariables(trial);

			switch (part) {
				
			case 1:

				// list presentation

				var interval_time = trial.stim_time + trial.stim_isi;

                if (trial.fix_time[0]>0){
                    display_element.html("+");
                    setTimeout(function(){
                        display_element.html("");
                        setTimeout(function(){
                            show_next_stimulus(0);
                        }, trial.fix_time[1]);
                    }, trial.fix_time[0]);
                } else {
                    show_next_stimulus(0);
                }

				function show_next_stimulus(stim_pos) {

	            	display_element.html(""); // clear everything

	            	// show stimulus
	            	if (!trial.is_html) {
	            		display_element.append($('<img>', {
	            			src: trial.stims[stim_pos],
	            			id: 'jspsych-stimulus-sequence'
	            		}));
	            	}
	            	else {
	            		display_element.append($('<div>', {
	            			html: trial.stims[stim_pos],
	            			id: 'jspsych-stimulus-sequence'
	            		}));
	            	}

	            	setTimeout(function(){
                        if (stim_pos==trial.stims.length){
                            if (trial.stim_isi[stim_pos] > 0){
                                pause_before_recall(stim_pos);
                            } else {
                                plugin.trial(display_element, block, trial, part + 1);
                            }
                        } else if (trial.stim_isi[stim_pos] > 0){
                            blank_pause(stim_pos);
                        } else {
                            show_next_stimulus(stim_pos+1);
                        }
                    }, trial.stim_time[stim_pos]);

                }

                function blank_pause (stim_pos){
                    $('#jspsych-stimulus-sequence').css('visibility', 'hidden');
                    setTimeout(function() {
                        show_next_stimulus(stim_pos+1);
                    }, trial.stim_isi[stim_pos]);
                }

                function pause_before_recall (stim_pos){
                    $('#jspsych-stimulus-sequence').css('visibility', 'hidden');
                    setTimeout(function() {
                        plugin.trial(display_element, block, trial, part + 1);  
                    }, trial.stim_isi[stim_pos]);
                }

	            break;

	        case 2:

                var responses = [];
                var rt = [];
                var ndone = 0;

				// list recall; keypress responses
	        	
	        	display_element.html(""); // clear everything

	        	if (trial.prompt !== "") {
                    display_element.append(trial.prompt);
                }

	        	// start measuring response time
                var oldSecs = (new Date()).getTime();

                $(document).keydown(function(e) {

                    console.log(ndone)

                	var flag = false; // true when a valid key is chosen
                    var this_resp = String.fromCharCode(e.which);

                	//TODO: at some point, allow trial.restricted to be an array of keycodes
                	switch (trial.restricted){

                	case "none":
                		flag = true;
                		break;

                	case "letters": // these are the letter keys on the keyboard
                		if ((e.which >= 65) && (e.which <= 90)){
                			flag=true;
                		}
                		break;

                	case "numpad": // these are the numbers on the number pad
                		if ((e.which >= 96) && (e.which <= 105)){
                			flag=true;
                		}
                		break;

                	case "topnumbers": // these are the numbers on the top row of keyboard pad
                		if ((e.which >= 48) && (e.which <= 57)){
                			flag=true;
                		}
                		break;

                	case "list": //an item/number from the list
                		var dc = 0;
                		var code = trial.stims[0].charCodeAt(0);

						if ( (code >= 48) && (code <= 57) ) {
							dc = (96-48);
						}

                		for (var i = 0; i < trial.stims.length; i++) {
                			if ((e.which-dc) == trial.stims[i].charCodeAt(0)) {
                                this_resp = String.fromCharCode(e.which-dc);
                				flag = true;
                				break;
                			}
                		}
                		break;
                	}

                	if (flag){
                        ndone++;
                        var nowSecs = (new Date()).getTime();
                        rt.push(nowSecs - oldSecs);
                        oldSecs = nowSecs;
                        responses.push(this_resp)
                		display_element.append(this_resp);
                        if (ndone>=trial.nResponses){
                            endTrial("");
                        }
                	}
                });

		        function endTrial(msg) {
	                
                    display_element.html(msg);

                    $(document).unbind('keydown');
	                
	                block.writeData($.extend({}, {
	                	"trial_type": "list-keypress",
	                	"trial_index": block.trial_idx,
	                    "responses": responses,
                        "rt": rt
	                }, trial.data));

	                if(trial.timing_post_trial > 0){
	                	setTimeout(function() {
	                		block.next();
	                	}, trial.timing_post_trial);
	                } else {
	                	block.next();
	                }
	            }
	            break;
        	}
        };

        return plugin;
    })();
}) (jQuery);