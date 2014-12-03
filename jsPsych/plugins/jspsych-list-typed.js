/**
 * Simon Farrell
 * June 2014
 * 
 * This is a plugin to present a list of stimuli, and then collect a series of typed responses.
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
//      time_limit: Timeout for recall period. Defaults to 1 minute.
//      terminate_key: Optional parameter indicating keycode of key that can be used to terminate trial
//      fix_time: A 2-element vector representing the duration of a fixation cross, and blank time
//                  following the cross. If set to [0, 0], no fixation cross is shown
//
//      is_html: must set to true when using HTML strings as the stimuli.
//      prompt: optional HTML string to prompt for typed recall.
//      data: the optional data object
 * 
 */
 
 (function( $ ) {
 	jsPsych["list-typed"] = (function(){

 		var plugin = {};

 		plugin.create = function(params) {

 			var trials = new Array(params.stimuli.length);
 			for(var i = 0; i < trials.length; i++)
 			{
 				trials[i] = {};
 				trials[i].type = "list-typed";
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

                if (typeof params.prompt ==='undefined'){
                    trials[i].prompt = '';
                } else if (params.prompt instanceof Array){
                    trials[i].prompt = params.prompt[i];
                } else {
                    trials[i].prompt = params.prompt;
                }
                
 				trials[i].data = (typeof params.data === 'undefined') ? {} : params.data[i];
 				trials[i].is_html = (typeof params.is_html === 'undefined') ? true : params.is_html;
 				trials[i].timing_post_trial = (typeof params.timing_post_trial === 'undefined') ? 0 : params.timing_post_trial;

 				trials[i].nResponses = (typeof params.nResponses === 'undefined') ? trials[i].stims.length : params.nResponses;
 				trials[i].timeLimit = (typeof params.time_limit === 'undefined') ? 60000 : params.time_limit;
 				trials[i].terminate_key = (typeof params.terminate_key === 'undefined') ? 0 : params.terminate_key;
                trials[i].fix_time = (typeof params.n_responses === 'undefined') ? [500, 500] : params.fix_time;
 			}
 			return trials;
 		};

 		plugin.trial = function(display_element, block, trial, part) {

			// allow variables as functions
			trial = jsPsych.pluginAPI.normalizeTrialVariables(trial);

			// To initially run the function:
            
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
	            		
	            		if (stim_pos==(trial.stims.length-1)){
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

				// list recall; typed responses

				var ndone = 0;
				var responses = []; // typed responses
                var rt = []; // response times (pressing enter to complete a word is taken as response)

				if (trial.prompt !== "") {
					display_element.html(trial.prompt);
				} else {
					display_element.html("");
				}

				display_element.append('<br><input name="typed_resp" type="text" id="response" style="font-size: 24pt" autocomplete="off"/>');

                $("#response").focus();

                $("#response").keydown( function(e){

                	if (e.which == 13)
                    {
                    	nowSecs = (new Date()).getTime();
                        responses.push($("#response").val());
                        rt.push(nowSecs-oldSecs);
                        oldSecs = nowSecs;
                    	$("#response").val("");
                    	ndone++;
                    	if (ndone>=trial.nResponses){
                    		endTrial("Thanks, that's enough responses.");
                    	}
                    } else if (e.which == trial.terminate_key){
                    	endTrial("Trial terminated.");
                    }
                });

                var nowSecs;
                var oldSecs = (new Date()).getTime();

				var trialTimer = setTimeout(function () {endTrial("Out of time.");}, trial.timeLimit);

		        function endTrial(msg) {
	                
                    if (typeof trialTimer !== 'undefined'){
                        clearTimeout(trialTimer);
                    }

	                display_element.html(msg);

	                display_element.append("<br><br>Press space bar to continue.");

                    block.writeData($.extend({}, {
                        "trial_type": "list-typed",
                        "trial_index": block.trial_idx,
                        "responses": responses,
                        "rt": rt
                    }, trial.data));


                	$(document).keydown(function(e){
                		if (e.which == 32){
                			$(document).unbind('keydown');
                			if(trial.timing_post_trial > 0){
                				setTimeout(function() {
                					block.next();
                				}, trial.timing_post_trial);
                			} else {
                				block.next();
                			}

                		}
                	});       

                }
                break;
            }
        };

        return plugin;
    })();
}) (jQuery);