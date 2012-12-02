(function( window, $, undefined ) {

	/*
	* smartresize: debounced resize event for jQuery
	*
	* latest version and complete README available on Github:
	* https://github.com/louisremi/jquery.smartresize.js
	*
	* Copyright 2011 @louis_remi
	* Licensed under the MIT license.
	*/

	var $event = $.event, resizeTimeout;

	$event.special.smartresize 	= {
		setup: function() {
			$(this).bind( "resize", $event.special.smartresize.handler );
		},
		teardown: function() {
			$(this).unbind( "resize", $event.special.smartresize.handler );
		},
		handler: function( event, execAsap ) {
			// Save the context
			var context = this,
				args 	= arguments;

			// set correct event type
			event.type = "smartresize";

			if ( resizeTimeout ) { clearTimeout( resizeTimeout ); }
			resizeTimeout = setTimeout(function() {
				jQuery.event.handle.apply( context, args );
			}, execAsap === "execAsap"? 0 : 100 );
		}
	};

	$.fn.smartresize 			= function( fn ) {
		return fn ? this.bind( "smartresize", fn ) : this.trigger( "smartresize", ["execAsap"] );
	};

	$.Slideshow 				= function( options, element ) {

		this.$el			= $( element );

		/***** images ****/

		// list of image items
		this.$list			= this.$el.find('ul.one-by-one-slider-large');
		// image items
		this.$imgItems		= this.$list.children('li');
		// total number of items
		this.itemsCount		= this.$imgItems.length;
		// images
		this.$images		= this.$imgItems.find('img:first');

		/***** thumbs ****/

		// thumbs wrapper
		this.$sliderthumbs	= this.$el.find('ul.one-by-one-slider-thumbs').hide();
		// slider elements
		this.$sliderElems	= this.$sliderthumbs.children('li');
		// sliding div
		this.$sliderElem	= this.$sliderthumbs.children('li.one-by-one-slider-element');
		// thumbs
		this.$thumbs		= this.$sliderElems.not('.one-by-one-slider-element');

		// initialize slideshow
		this._init( options );

	};

	$.Slideshow.defaults 		= {
		// animation types:
		// "sides" : new slides will slide in from left / right
		// "center": new slides will appear in the center
		animation			: 'sides', // sides || center
		// if true the slider will automatically slide, and it will only stop if the user clicks on a thumb
		autoplay			: false,
		// interval for the slideshow
		slideshow_interval	: 3000,
		// speed for the background animation
		speed			: 800,
		// easing for the background animation
		easing			: '',
		// maximum width for the thumbs in pixels
		thumbMaxWidth		: 150
    };

	$.Slideshow.prototype 		= {
		_init 				: function( options ) {

			this.options 		= $.extend( true, {}, $.Slideshow.defaults, options );

			// set the opacity of the title elements and the image items
			this.$imgItems.css( 'opacity', 0 );
			this.$imgItems.find('div.slider-content > *').css( 'opacity', 0 );

			// index of current visible slider
			this.current		= 0;

			var _self			= this;

			// preload images
			// add loading status
			this.$loading		= $('<div class="one-by-one-slider-loading">Loading</div>').prependTo( _self.$el );

			$.when( this._preloadImages() ).done( function() {

				// hide loading status
				_self.$loading.hide();

				// calculate size and position for each image
				_self._setImagesSize();

				// configure thumbs container
				_self._initThumbs();

				// show first
				_self.$imgItems.eq( _self.current ).css({
					'opacity' 	: 1,
					'z-index'	: 10
				}).show().find('div.slider-content > *').css( 'opacity', 1 )
					  .addClass(function() {
					var animat = $(this).data('animation');
					return 'animated '+animat;
				})
					  .css('-moz-animation-duration', function() {
					var durat = $(this).data('duration');
					return durat + 's';
				})
                      .css('-moz-animation-delay',  1 + 's')
                      .css('-moz-backface-visibility',  'hidden')
                      .css('-webkit-animation-duration', function() {
					var durat = $(this).data('duration');
					return durat + 's';
				})
                      .css('-webkit-animation-delay',  1 + 's')
                      .css('-webkit-backface-visibility',  'hidden')
                      .css('-ms-animation-duration', function() {
					var durat = $(this).data('duration');
					return durat + 's';
				})
                      .css('-ms-animation-delay',  1 + 's')
                      .css('-ms-backface-visibility',  'hidden')
                      .css('-o-animation-duration', function() {
					var durat = $(this).data('duration');
					return durat + 's';
				})
                      .css('-o-animation-delay',  1 + 's')
                      .css('-o-backface-visibility',  'hidden')
					  .end();

				// if autoplay is true
				if( _self.options.autoplay ) {

					_self._startSlideshow();

				}

				// initialize the events
				_self._initEvents();

			});

		},
		_preloadImages		: function() {

			// preloads all the large images

			var _self	= this,
				loaded	= 0;

			return $.Deferred(

				function(dfd) {

					_self.$images.each( function( i ) {

						$('<img/>').load( function() {

							if( ++loaded === _self.itemsCount ) {

								dfd.resolve();

							}

						}).attr( 'src', $(this).attr('src') );

					});

				}

			).promise();

		},
		_setImagesSize		: function() {

			// save slider's width
			this.elWidth	= this.$el.width();

			var _self	= this;

			this.$images.each( function( i ) {

				var $img	= $(this);
					imgDim	= _self._getImageDim( $img.attr('src') );

				$img.css({
					width		: imgDim.width,
					height		: imgDim.height,
					marginLeft	: imgDim.left,
					marginTop	: imgDim.top
				});

			});

		},
		_getImageDim		: function( src ) {

			var $img    = new Image();

			$img.src    = src;

			var c_w		= this.elWidth,
				c_h		= this.$el.height(),
				r_w		= c_h / c_w,

				i_w		= $img.width,
				i_h		= $img.height,
				r_i		= i_h / i_w,
				new_w, new_h, new_left, new_top;

			if( r_w > r_i ) {

				new_h	= c_h;
				new_w	= c_h / r_i;

			}
			else {

				new_h	= c_w * r_i;
				new_w	= c_w;

			}

			return {
				width	: new_w,
				height	: new_h,
				left	: ( c_w - new_w ) / 2,
				top		: ( c_h - new_h ) / 2
			};

		},
		_initThumbs			: function() {



			// set the max-width of the slider and show it
			this.$sliderthumbs.css( 'max-width', this.options.thumbMaxWidth * this.itemsCount + 'px' ).show();

		},
		_startSlideshow		: function() {

			var _self	= this;

			this.slideshow	= setTimeout( function() {

				var pos;

				( _self.current === _self.itemsCount - 1 ) ? pos = 0 : pos = _self.current + 1;

				_self._slideTo( pos );

				if( _self.options.autoplay ) {

					_self._startSlideshow();

				}

			}, this.options.slideshow_interval);

		},

		// shows the clicked thumb's slide
		_slideTo			: function( pos ) {

			// return if clicking the same element or if currently animating
			if( pos === this.current || this.isAnimating )
				return false;

			this.isAnimating	= true;

			var $currentSlide	= this.$imgItems.eq( this.current ),
				$nextSlide		= this.$imgItems.eq( pos ),
				_self			= this,

				preCSS			= {zIndex	: 10},
				animCSS			= {opacity	: 1};

			// new slide will slide in from left or right side
			if( this.options.animation === 'sides' ) {

				preCSS.left		= ( pos > this.current ) ? -1 * this.elWidth : this.elWidth;
				animCSS.left	= 0;

			}

			// content animation
			$nextSlide.find('div.slider-content > *')
					  .stop()
					  .addClass(function() {
					var animat = $(this).data('animation');
					return 'animated '+animat;
				})
					  .css('-moz-animation-duration', function() {
					var durat = $(this).data('duration');
					return durat + 's';
				})
                      .css('-moz-animation-delay',  1 + 's')
                      .css('-moz-backface-visibility',  'hidden')
                      .css('-webkit-animation-duration', function() {
					var durat = $(this).data('duration');
					return durat + 's';
				})
                      .css('-webkit-animation-delay',  1 + 's')
                      .css('-webkit-backface-visibility',  'hidden')
                      .css('-ms-animation-duration', function() {
					var durat = $(this).data('duration');
					return durat + 's';
				})
                      .css('-ms-animation-delay',  1 + 's')
                      .css('-ms-backface-visibility',  'hidden')
                      .css('-o-animation-duration', function() {
					var durat = $(this).data('duration');
					return durat + 's';
				})
                      .css('-o-animation-delay',  1 + 's')
                      .css('-o-backface-visibility',  'hidden')
					  .end()


               //Get All Animations

			     var AllAnimations = $currentSlide.find('div.slider-content > *').map(function ()  {
                 return $(this).data('animation');
                   }).get().join(' ');






			$.when(


				// fade out current titles
				$currentSlide.css( 'z-index' , 1 ).find('div.slider-content > *').stop().fadeOut( this.options.speed / 2, function() {
					// reset style
					$(this).show().css( 'opacity', 0 );
				}),

				// animate next slide in
				$nextSlide.css( preCSS ).stop().animate( animCSS, this.options.speed, this.options.easing ),

				// "sliding div" moves to new position
				this.$sliderElem.stop().animate({
					left	: this.$thumbs.eq( pos ).position().left
				}, this.options.speed )

			).done( function() {

				// reset values
				$currentSlide.css( 'opacity' , 0 ).find('div.slider-content > *').css( 'opacity', 0 ).css('-moz-animation-duration', 0).css('-moz-animation-delay',  0).css('-webkit-animation-duration', 0).css('-webkit-animation-delay',  0).css('-ms-animation-duration', 0).css('-ms-animation-delay',  0).css('-o-animation-duration', 0).css('-o-animation-delay',  0).removeClass('animated '+AllAnimations);
					_self.current	= pos;
					_self.isAnimating		= false;

				});

		},
		_initEvents			: function() {

			var _self	= this;

			// window resize
			$(window).on( 'smartresize.onebyoneslider', function( event ) {

				// resize the images
				_self._setImagesSize();

				// reset position of thumbs sliding div
				_self.$sliderElem.css( 'left', _self.$thumbs.eq( _self.current ).position().left );

			});

			// click the thumbs
			this.$thumbs.on( 'click.onebyoneslider', function( event ) {

				if( _self.options.autoplay ) {

					clearTimeout( _self.slideshow );
					_self.options.autoplay	= false;
				}

				var $thumb	= $(this),
					idx		= $thumb.index() - 1; // exclude sliding div

				_self._slideTo( idx );

				return false;

			});



               this.$el.wipetouch(
				{
					wipeLeft: function(result) { _self._slideTo(_self.current - 1);},
					wipeRight: function(result) { _self._slideTo(_self.current + 1); },

				});


		}
	};


	var logError 				= function( message ) {

		if ( this.console ) {

			console.error( message );

		}

	};

	$.fn.onebyoneslider			= function( options ) {

		if ( typeof options === 'string' ) {

			var args = Array.prototype.slice.call( arguments, 1 );

			this.each(function() {

				var instance = $.data( this, 'onebyoneslider' );

				if ( !instance ) {
					logError( "cannot call methods on onebyoneslider prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				}

				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
					logError( "no such method '" + options + "' for onebyoneslider instance" );
					return;
				}

				instance[ options ].apply( instance, args );

			});

		}
		else {

			this.each(function() {

				var instance = $.data( this, 'onebyoneslider' );
				if ( !instance ) {
					$.data( this, 'onebyoneslider', new $.Slideshow( options, this ) );
				}

			});

		}

		return this;

	};

})( window, jQuery );