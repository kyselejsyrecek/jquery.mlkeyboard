(function($){
  // jQuery extension.
  @@include('focusable.js');
  
  // Keyboard internals.
  @@include('key.js')
  @@include('key_delete.js')
  @@include('key_tab.js')
  @@include('key_caps_lock.js')
  @@include('key_return.js')
  @@include('key_shift.js')
  @@include('key_space.js')
  @@include('keyboard.js')

  $.fn.mlKeyboard = function(options) {
    var keyboard = new Keyboard(this.selector, options);
    keyboard.init();

    this.each(function(){
      keyboard.setUpFor($(this));
    });
	
	return keyboard;
  };

})(jQuery);

// Keyboard layouts.
@@include('layouts/en_US.js')
@@include('layouts/ru_RU.js')
@@include('layouts/es_ES.js')
@@include('layouts/pt_PT.js')
@@include('layouts/pt_BR.js')
@@include('layouts/it_IT.js')
@@include('layouts/fr_FR.js')
@@include('layouts/de_DE.js')
