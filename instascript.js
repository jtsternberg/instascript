window.jQuery = window.jQuery || {};
window.instasScript = window.instasScript || {};

( function( window, document, $, app, undefined ) {
	'use strict';

	/**
	 * Instagram Downloader Script
	 *
	 * Instructions:
	 *
	 * 1. Go to your Instagram profile url (e.g. https://instagram.com/jtsternberg/)
	 * 2. Scroll to the bottom, and click the "LOAD MORE" button. This triggers the auto-loading on scroll - http://b.ustin.co/142xL (if you forget, it will prompt you)
	 * 3. Copy this entire thing to your javascript console. (only tested on chrome)
	 * 4. Hit enter and watch your images download.
	 * 5. To stop the process, close the tab or refresh (or hit your escape key).
	 */


	/**
	 * instagram image - http://b.ustin.co/1aLvI
	 *
	 * @type {String}
	 */
	app.instaImageSelector = '._22yr2';

	/**
	 * Full-size instagram image after the modal opens - http://b.ustin.co/18xhe
	 *
	 * @type {String}
	 */
	app.modalImageSelector = '._n3cp9._d20no ._jjzlb img';

	/**
	 * Full-size instagram video after the modal opens
	 *
	 * @type {String}
	 */
	app.modalVideoSelector = '._n3cp9._d20no ._2tomm video';

	/**
	 * "Load More" button selector
	 *
	 * @type {String}
	 */
	app.loadMoreSelector = '._oidfu';

	/**
	 * Closes the modal
	 *
	 * @type {String}
	 */
	app.closeButtonSelector = '._3eajp';

	/**
	 * Amount of time to allow the image to download. May need to increase this value on a slow connection.
	 *
	 * @type {Number}
	 */
	app.downloadBufferTime = 800;

	/**
	 * Amount of time to allow the freshly-loaded images (after scroll) to load. May need to increase this value on a slow connection.
	 *
	 * @type {Number}
	 */
	app.loadMoreBufferTime = 2000;

	/**
	 * Amount of time to allow the modal to load after triggering it.
	 *
	 * @type {Number}
	 */
	app.waitForModalTime = 200;


	var notified = false;
	var stop = false;

	app.dowloaded = [];

	app.init = function() {

		var go = function() {
			alert( "Ok, we're about to begin! Press the 'escape' key to stop the the downloads." );
			$ = jQuery;

			// Listen for escape to stop the import
			$( document ).on( 'keyup', function( evt ) {
				if ( 27 === evt.keyCode ) {
					console.warn( 'STOP dowload script' );
					stop = true;
				}
			});

			app.processNext();
		};

		if ( ! window.jQuery || ! window.jQuery.fn ) {
			app.loadjQuery();
			setTimeout( go, 1000 );
		} else {
			setTimeout( go, 200 );
		}
	};

	app.start = function() {
		stop = false;
		app.processNext();
	};

	app.loadjQuery = function() {
		var script = document.createElement('script');
		script.async = 1;
		script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.0.0/jquery.min.js';
		var otherscript = document.getElementsByTagName('script')[0];
		otherscript.parentNode.insertBefore(script, otherscript);
	};

	app.processNext = function() {

		if ( stop ) {
			$( app.closeButtonSelector ).trigger( 'click' );
			return alert( "Ok, it's stopped! `instasScript.start()` in your JS console to continue." );
		}

		app.$toClick = $( app.instaImageSelector + ':not(.instadone )' ).first();
		if ( ! app.$toClick.length ) {
			return app.triggerMore();
		}

		app.$toClick.trigger( 'click' );

		setTimeout( app.processThis, app.waitForModalTime );
	};

	app.processThis = function() {

		var $media = $( app.modalImageSelector );
		if ( ! $media.length ) {
			$media = $( app.modalVideoSelector );
		}

		if ( $media.hasClass( 'instadone' ) ) {
			return app.processNext();
		}

		if ( ! $media.length ) {
			return app.processNext();
		}

		var src = $media.attr('src');
		var haveIt = $.inArray( src, app.dowloaded );

		if ( ! src || -1 !== haveIt ) {
			if ( ! src ) {
				console.warn('! src',$media);
			}
			if ( -1 !== haveIt ) {
				console.warn('We have this image!', haveIt, src);
			}
			return app.processNext();
		}

		app.$toClick.addClass( 'instadone' );
		$media.addClass( 'instadone' );

		app.dowloaded.push( app.saveToDisk( src ) );

		$( app.closeButtonSelector ).trigger( 'click' );

		// Wait a bit to give adequate time to download
		setTimeout( app.processNext, app.downloadBufferTime );
	};

	app.triggerMore = function() {

		if ( $( app.loadMoreSelector ).length ) {
			return app.needToClickLoadMore();
		}

		var y = $(window).scrollTop();  // your current y position on the page

		// Jigger the scrolling to trigger the load-more
		$( 'html, body' ).animate( { scrollTop: y-250 }, 200, 'swing', function() {
			$( 'html, body' ).animate( { scrollTop: $( document ).height() }, 200 );
		});

		// Start the processing on the new batch
		setTimeout( app.processNext, app.loadMoreBufferTime );
	};

	app.needToClickLoadMore = function() {
		if ( ! notified ) {
			notified = true;

			$( app.closeButtonSelector ).trigger( 'click' );

			setTimeout( function() {
				$( app.loadMoreSelector ).css({ 'box-shadow' : '0px 2px 108px red', 'border-radius' : '100%' });
				alert( 'click the "LOAD MORE" button! The download script will continue automatically once "infinite scroll" is triggered.' );
			}, 500 );

			$( 'html, body' ).animate( { scrollTop: $( document ).height() }, 200 );
		}

		setTimeout( app.triggerMore, app.downloadBufferTime * 2 );
	};

	app.saveToDisk = function( fileUrl, fileName ) {
		var hyperlink = document.createElement('a');
		hyperlink.href = fileUrl;
		hyperlink.target = '_blank';
		hyperlink.download = fileName || fileUrl;

		console.log( app.dowloaded.length + ') download', hyperlink.download );

		var mouseEvent = new MouseEvent('click', {
			view: window,
			bubbles: true,
			cancelable: true
		});

		hyperlink.dispatchEvent(mouseEvent);
		(window.URL || window.webkitURL).revokeObjectURL(hyperlink.href);

		return fileUrl;
	};

	app.init();

} )( window, document, window.jQuery, window.instasScript );
