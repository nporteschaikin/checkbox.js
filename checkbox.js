/*

* checkbox.js
* The easiest, most functional custom checkboxes and radio buttons around.
* @author Noah Portes Chaikin
* @requires jQuery 1.6+

*/

(function( $ ){
	
	var defaults = {
		'cls': 'checkbox'
	},
	
	methods = {
		
		init: function ( settings ) {
			settings = $.extend( {}, defaults, settings );
			return this.each( 
				function() {
					if ( $( this ).is(':radio, :checkbox') 
					&& !$( this ).data( 'input' ) ) {
						
						// input
						var input = {
							el: $( this ),
							name: $( this ).attr( 'name' ),
							tabindex: $( this ).attr('tabindex'),
							settings: settings,
							ident: $( this ).attr( 'id' )
						}
						
						// data
						data = $( this ).data( 'input' ) || input;
						
						// build
						$build = build( data );
						data.build = $build;
						
						// place
						$( this ).hide();
						$( this ).after( $build );
						
						// save data
						$( this ).data( 'input', data );
						$build.data( 'input', data );
						
						// bind elements
						binder( data );
						
						// if it's selected ...
						if ( $( this ).is(':checked') ) {
							toggle( data, true );
						}
						
					}
				}
			)
		},
		
		toggle: function () {
			return this.each(
				function() {
					
					var data = $( this ).data( 'input' );

					if ( data.el ) {
						
						// simplify calling the input and build
						var el = data.el,
						build = data.build;
						
						// trigger input click
						el.trigger( 'click' );
						
						// trigger change to ALL radio, checkboxes
						// why? to set classes and values
						$( ':radio, :checkbox' ).trigger( 'change' );
						
					}
					
				}
			)
		}
		
	}

	$.fn.checkbox = function( method ) {  
		
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		}
		
  };

	function build ( data ) {
		
		var $build,
		
		// object: forced css for build
		css = {
			'cursor': 'pointer'
		}
		
		// create element
		$build = $('<div class="' + data.settings.cls + '" />');
		
		// apply css
		$build.css ( css );
		
		// set a tabindex,
		// remove tabindex from original el
		if( data.tabindex >= 0 ) {
			$build.attr( 'tabindex', data.tabindex );
			data.el.removeAttr( 'tabindex' );
		}
		
		// done! that was easy
		return $build;
		
	}
	
	function binder ( data ) {
		
		var build = data.build,
		el = data.el;
		
		// on click, trigger
		build.bind( 'click', 
			function( e ) {
				e.preventDefault();
				build.checkbox( 'toggle' );
			}
		)
		
		// on change, toggle
		el.bind( 'change', 
			function() {
				if ( $( this ).is( ':checked' ) ) {
					toggle ( data, true );
				} else {
					toggle ( data, false );
				}
				
			}
		)
		
		// on enter, toggle
		$( document ).bind( 'keydown.checkbox',
			function( e ) {
				if ( build.is(':focus') && e.which == 13 ) {
					el.checkbox( 'toggle' );
				}
			}
		);
		
		// if input has ID, connect it's label 
		if ( data.ident ) {
			
			var label = $( 'label[for="' + data.ident + '"]' );
			label.bind( 'click',
				function(e) {
					e.preventDefault();
					build.trigger( 'click' );
				}
			)
			
		}
		
	}
	
	function toggle ( data, bool ) {
		
		var checked = 'checked';
		
		if ( bool ) {
			data.build.addClass( checked );
		} else {
			data.build.removeClass( checked );
		}
		
	}
	


})( jQuery );