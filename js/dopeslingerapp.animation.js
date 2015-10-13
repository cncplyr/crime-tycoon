angular
	.module('dopeslingerApp')
	.animation('.dealer-hire-anim', function() {
		return { 
			enter : function(element, done) {
	    	    element.hide().slideDown(1000,done);
	        },
			leave: function (element, done) {
				element.slideUp(1000,done);
			}
  		};
	})
	.animation('.drug-anim', function() {
		return { 
			enter : function(element, done) {
	    	    element.hide().fadeIn(done);
	        },
			leave: function (element, done) {
				element.fadeOut(done);
			}
  		};
	})
	.animation('.research-anim', function() {
		return { 
			enter : function(element, done) {
	    	    element.hide().fadeIn(done);
	        },
			leave: function (element, done) {
				element.fadeOut(done);
			}
  		};
	})
    .animation('.content-open', function () {
        return {
            enter: function (element, done) {
                //run the animation here and call done when the animation is complete
                return function (cancelled) {
                    //this (optional) function will be called when the animation
                    //completes or when the animation is cancelled (the cancelled
                    //flag will be set to true if cancelled).
                };
            },
            beforeAddClass: function (element, className, done) {
                element.css('display', 'none');
                done();
            },
            //animation that can be triggered after the class is added
            addClass: function (element, className, done) {
                element.slideDown(done);
				$(window).trigger('resize');
            },

            //animation that can be triggered after the class is added
            beforeRemoveClass: function (element, className, done) {
                element.slideUp(done);
            }
        };
    });