(function($){
  // jQuery extension.
  /*!
 * jQuery UI Focusable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: :focusable Selector
//>>group: Core
//>>description: Selects elements which can be focused.
//>>docs: http://api.jqueryui.com/focusable-selector/

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} ( function( $ ) {

// Selectors
$.focusable = function( element, hasTabindex ) {
	var map, mapName, img, focusableIfVisible, fieldset,
		nodeName = element.nodeName.toLowerCase();

	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap='#" + mapName + "']" );
		return img.length > 0 && img.is( ":visible" );
	}

	if ( /^(input|select|textarea|button|object)$/.test( nodeName ) ) {
		focusableIfVisible = !element.disabled;

		if ( focusableIfVisible ) {

			// Form controls within a disabled fieldset are disabled.
			// However, controls within the fieldset's legend do not get disabled.
			// Since controls generally aren't placed inside legends, we skip
			// this portion of the check.
			fieldset = $( element ).closest( "fieldset" )[ 0 ];
			if ( fieldset ) {
				focusableIfVisible = !fieldset.disabled;
			}
		}
	} else if ( "a" === nodeName ) {
		focusableIfVisible = element.href || hasTabindex;
	} else {
		focusableIfVisible = hasTabindex;
	}

	return focusableIfVisible && $( element ).is( ":visible" ) && visible( $( element ) );
};

// Support: IE 8 only
// IE 8 doesn't resolve inherit to visible/hidden for computed values
function visible( element ) {
	var visibility = element.css( "visibility" );
	while ( visibility === "inherit" ) {
		element = element.parent();
		visibility = element.css( "visibility" );
	}
	return visibility !== "hidden";
}

$.extend( $.expr.pseudos, {
	focusable: function( element ) {
		return $.focusable( element, $.attr( element, "tabindex" ) != null );
	}
} );

return $.focusable;

} ) );;
  
  // Keyboard internals.
  function unescapeHTML(html) {
    var el = document.createElement('div');
    return html.replace(/\&[#0-9a-z]+;/gi, function (enc) {
        el.innerHTML = enc;
        return el.innerHTML;
    });
}

function Key(params) {
  if (Object.prototype.toString.call(params) == "[object Arguments]") {
    this.keyboard = params[0];
  } else {
    this.keyboard = params;
  }

  this.$key = $("<li/>");
  this.current_value = null;
}

Key.prototype.render = function() {
  if (this.key_class) {
    this.$key.addClass(this.key_class);
  }

  return this.$key;
};

Key.prototype.setCurrentValue = function() {
  if (this.keyboard.upperRegister()) {
    this.current_value = this.preferences.u ? this.preferences.u : this.default_value;
  } else {
    this.current_value = this.preferences.d ? this.preferences.d : this.default_value;
  }
  if (typeof this.current_value == "undefined") {
	  this.current_value = "";
  }
  this.$key.text(unescapeHTML(this.current_value));
};

Key.prototype.setCurrentAction = function() {
  var _this = this;

  this.$key.unbind("mousedown.mlkeyboard");
  
  this.$key.bind("mousedown.mlkeyboard", function(){
    if (typeof(_this.preferences.onClick) === "function") {
      _this.preferences.onClick(_this);
    } else {
      _this.defaultClickAction();
    }
  });
};

Key.prototype.defaultClickAction = function() {
  this.keyboard.destroyModifications();

  if (this.is_modificator) {
    this.keyboard.deleteChar();
    this.keyboard.printChar(this.current_value);
  } else {
    this.keyboard.printChar(this.current_value);
  }

  if (this.preferences.m && Object.prototype.toString.call(this.preferences.m) === '[object Array]') {
    this.showModifications();
  }

  if (this.keyboard.active_shift) this.keyboard.toggleShift(false);
};

Key.prototype.showModifications = function() {
  var _this = this;

  this.keyboard.modifications = [];

  $.each(this.preferences.m, function(i, modification) {
    var key = new Key(_this.keyboard);
    key.is_modificator = true;
    key.preferences = modification;
    _this.keyboard.modifications.push(key);
  });

  this.keyboard.showModifications(this);
};

Key.prototype.toggleActiveState = function() {
  if (this.isActive()) {
    this.$key.addClass('active');
  } else {
    this.$key.removeClass('active');
  }
};

Key.prototype.isActive = function() {
  return false;
};
  function KeyDelete() {
  Key.call(this, arguments);

  this.key_class = "mlkeyboard-backspace";
  this.default_value = '&#10229;';
}

KeyDelete.prototype = new Key();
KeyDelete.prototype.constructor = KeyDelete;

KeyDelete.prototype.defaultClickAction = function() {
  this.keyboard.deleteChar();
  this.keyboard.$current_input.change();
};
  function KeyTab() {
  Key.call(this, arguments);

  this.key_class = "mlkeyboard-tab";
  this.default_value = 'tab';
}

KeyTab.prototype = new Key();
KeyTab.prototype.constructor = KeyTab;

KeyTab.prototype.defaultClickAction = function() {
  var $inputs = $(":input:focusable");
  var offset = (this.keyboard.active_shift) ? -1 : 1;
  var next_index = ($inputs.index(this.keyboard.$current_input) + offset) % $inputs.length;
  var $next_input = $inputs.eq(next_index);
  
  if ($next_input != this.keyboard.$current_input) {
	$next_input.focus();
	
	if (this.keyboard.options.hide_on_tab) {
      this.keyboard.hideKeyboard();
	}
  }
};

  function KeyCapsLock() {
  Key.call(this, arguments);

  this.key_class = "mlkeyboard-capslock";
  this.default_value = 'caps lock';
}

KeyCapsLock.prototype = new Key();
KeyCapsLock.prototype.constructor = KeyCapsLock;

KeyCapsLock.prototype.isActive = function() {
  return this.keyboard.active_caps;
};

KeyCapsLock.prototype.defaultClickAction = function() {
  this.keyboard.toggleCaps();
};
  function KeyReturn() {
  Key.call(this, arguments);

  this.key_class = "mlkeyboard-return";
  this.default_value = 'return';
}

KeyReturn.prototype = new Key();
KeyReturn.prototype.constructor = KeyReturn;

KeyReturn.prototype.setCurrentValue = function() {
  if (this.keyboard.options.enter_key && this.keyboard.$current_input.is("textarea")) {
    this.default_value = "enter";
  }
  else {
    this.default_value = "return";
  }
  Key.prototype.setCurrentValue.call(this, arguments);
}

KeyReturn.prototype.defaultClickAction = function() {
  var e = $.Event("keypress", {
    which: 13,
    keyCode: 13
  });
  this.keyboard.$current_input.trigger(e);
  
  if (this.keyboard.options.enter_key && this.keyboard.$current_input.is("textarea")) {
	this.current_value = this.keyboard.options.line_ending;
    Key.prototype.defaultClickAction.call(this, arguments);
  }
  else {
	if (this.keyboard.options.blur_on_return) {
	  this.keyboard.$current_input.blur();
	}
	if (this.keyboard.options.hide_on_return) {
	  this.keyboard.hideKeyboard();
	}
  }
}
  function KeyShift() {
  Key.call(this, arguments);

  this.key_class = "mlkeyboard-"+arguments[1]+"-shift";
  this.default_value = 'shift';
}

KeyShift.prototype = new Key();
KeyShift.prototype.constructor = KeyShift;

KeyShift.prototype.isActive = function() {
  return this.keyboard.active_shift;
};

KeyShift.prototype.defaultClickAction = function() {
  this.keyboard.toggleShift();
};
  function KeySpace() {
  Key.call(this, arguments);

  this.key_class = "mlkeyboard-space";
  this.default_value = ' ';
}

KeySpace.prototype = new Key();
KeySpace.prototype.constructor = KeySpace;
  var KEYS_COUNT = 53;

function Keyboard(selector, options){
  this.defaults = {
    layout: 'en_US',
    active_shift: true,
    active_caps: false,
    is_hidden: true,
    open_speed: 300,
    close_speed: 300,
    show_on_focus: true,
    hide_on_blur: true,
	hide_on_return: true,
	hide_on_tab: false,
	blur_on_return: true,
	enter_key: true,
	line_ending: "\n",
	class_list: "",
    trigger: undefined,
    enabled: true
  };

  this.global_options = $.extend({}, this.defaults, options);
  this.options = $.extend({}, {}, this.global_options);

  this.keys = [];

  this.$keyboard = $("<div/>").addClass("mlkeyboard " + this.options.class_list);
  this.$modifications_holder = $("<ul/>").addClass('mlkeyboard-modifications');
  this.$current_input = $(selector);
}

Keyboard.prototype.init = function() {
  this.$keyboard.append(this.renderKeys());
  this.$keyboard.append(this.$modifications_holder);
  $("body").append(this.$keyboard);

  if (this.options.is_hidden) this.$keyboard.hide();
  
  this.$keyboard.on("mousedown", function (e) {
	  // Prevent focus stealing.
	  e.preventDefault();
  });

  this.setUpKeys();
};

Keyboard.prototype.setUpKeys = function() {
  var _this = this;

  this.active_shift = this.options.active_shift;
  this.active_caps = this.options.active_caps;

  $.each(this.keys, function(i, key){

    key.preferences = mlKeyboard.layouts[_this.options.layout][i];
    key.setCurrentValue();
    key.setCurrentAction();
    key.toggleActiveState();
  });
};

Keyboard.prototype.renderKeys = function() {
  var $keys_holder = $("<ul/>");

  for (var i = 0; i<= KEYS_COUNT; i++) {
    var key;

    switch(i) {
    case 13:
      key = new KeyDelete(this);
      break;
    case 14:
      key = new KeyTab(this);
      break;
    case 28:
      key = new KeyCapsLock(this);
      break;
    case 40:
      key = new KeyReturn(this);
      break;
    case 41:
      key = new KeyShift(this, "left");
      break;
    case 52:
      key = new KeyShift(this, "right");
      break;
    case 53:
      key = new KeySpace(this);
      break;
    default:
      key = new Key(this);
      break;
    }

    this.keys.push(key);
    $keys_holder.append(key.render());
  }

  return $keys_holder;
};

Keyboard.prototype.setUpFor = function($input) {
  var _this = this;

  if (this.options.show_on_focus) {
    $input.bind('focus', function() { _this.showKeyboard($input); });
  }

  if (this.options.hide_on_blur) {
    $input.bind('blur', function() {
      _this.hideKeyboard();
    });
  }

  if (this.options.trigger) {
    var $trigger = $(this.options.trigger);
    $trigger.bind('mousedown', function(e) {
      // Prevent stealing focus.
      e.preventDefault();

      if (_this.isVisible) { _this.hideKeyboard(); }
      else {
        _this.showKeyboard($input);
        $input.focus();
      }
    });
  }
};

Keyboard.prototype.showKeyboard = function($input) {
  var input_changed = !this.$current_input || $input[0] !== this.$current_input[0];

  if (!this.isVisible || input_changed) {

    this.$current_input = $input;
    this.options = $.extend({}, this.global_options, this.inputLocalOptions());

    if (!this.options.enabled) {
      return;
    }

    if (this.$current_input.val() !== '') {
      this.options.active_shift = false;
    }

    this.setUpKeys();

	if (!this.isVisible) {
      this.isVisible = true;
      this.$keyboard.slideDown(this.options.openSpeed);
    }
  }
};

Keyboard.prototype.hideKeyboard = function() {
  if (this.isVisible) {
    this.isVisible = false;
    this.$keyboard.slideUp(this.options.close_speed);
  }
};

Keyboard.prototype.inputLocalOptions = function() {
  var options = {};
  for (var key in this.defaults) {
    var input_option = this.$current_input.attr("data-mlkeyboard-"+key);
    if (input_option == "false") {
      input_option = false;
    } else if (input_option == "true") {
      input_option = true;
    }
    if (typeof input_option !== 'undefined') { options[key] = input_option; }
  }

  return options;
};

Keyboard.prototype.printChar = function(char) {
  var selStart = this.$current_input[0].selectionStart;
  var selEnd = this.$current_input[0].selectionEnd;
  var textAreaStr = this.$current_input.val();
  var value = textAreaStr.substring(0, selStart) + char + textAreaStr.substring(selEnd);

  if (!this.$current_input.is(":focus")) {
	this.$current_input.focus()
  }

  this.$current_input.val(value).change();
  this.$current_input[0].selectionStart = selStart+1, this.$current_input[0].selectionEnd = selStart+1;

};

Keyboard.prototype.deleteChar = function() {
  var selStart = this.$current_input[0].selectionStart;
  var selEnd = this.$current_input[0].selectionEnd;

  var textAreaStr = this.$current_input.val();
  var after = textAreaStr.substring(0, selStart-1);
  var value = after + textAreaStr.substring(selEnd);

  if (!this.$current_input.is(":focus")) {
	this.$current_input.val(value).focus()
  }

  this.$current_input.val(value);
  this.$current_input[0].selectionStart = selStart-1, this.$current_input[0].selectionEnd = selStart-1;

};

Keyboard.prototype.showModifications = function(caller) {
  var _this = this,
      holder_padding = parseInt(_this.$modifications_holder.css('padding'), 10),
      top, left, width;

  $.each(this.modifications, function(i, key){
    _this.$modifications_holder.append(key.render());

    key.setCurrentValue();
    key.setCurrentAction();
  });

  // TODO: Remove magic numbers
  width = (caller.$key.width() * _this.modifications.length) + (_this.modifications.length * 6);
  top = caller.$key.position().top - holder_padding;
  left = caller.$key.position().left - _this.modifications.length * caller.$key.width()/2;

  this.$modifications_holder.one('mouseleave', function(){
    _this.destroyModifications();
  });

  this.$modifications_holder.css({
    width: width,
    top: top,
    left: left
  }).show();
};

Keyboard.prototype.destroyModifications = function() {
  this.$modifications_holder.empty().hide();
};

Keyboard.prototype.upperRegister = function() {
  return ((this.active_shift && !this.active_caps) || (!this.active_shift && this.active_caps));
};

Keyboard.prototype.toggleShift = function(state) {
  this.active_shift = state ? state : !this.active_shift;
  this.changeKeysState();
};

Keyboard.prototype.toggleCaps = function(state) {
  this.active_caps = state ? state : !this.active_caps;
  this.changeKeysState();
};

Keyboard.prototype.changeKeysState = function() {
  $.each(this.keys, function(_, key){
    key.setCurrentValue();
    key.toggleActiveState();
  });
};


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
var mlKeyboard = mlKeyboard || {layouts: {}};

mlKeyboard.layouts.en_US = [
  {d: '`', u: '~'},
  {d: '1',u: '!'},
  {d: '2',u: '@'},
  {d: '3',u: '#'},
  {d: '4',u: '$'},
  {d: '5',u: '%'},
  {d: '6',u: '^'},
  {d: '7',u: '&'},
  {d: '8',u: '*'},
  {d: '9',u: '('},
  {d: '0',u: ')'},
  {d: '-',u: '_'},
  {d: '=',u: '+'},
  {}, // Delete
  {}, // Tab
  {d: 'q',u: 'Q'},
  {d: 'w',u: 'W'},
  {d: 'e',u: 'E'},
  {d: 'r',u: 'R'},
  {d: 't',u: 'T'},
  {d: 'y',u: 'Y'},
  {d: 'u',u: 'U'},
  {d: 'i',u: 'I'},
  {d: 'o',u: 'O'},
  {d: 'p',u: 'P'},
  {d: ']',u: '}'},
  {d: '[',u: '{'},
  {d: '\\',u: '|'},
  {}, // Caps lock
  {d: 'a',u: 'A'},
  {d: 's',u: 'S'},
  {d: 'd',u: 'D'},
  {d: 'f',u: 'F'},
  {d: 'g',u: 'G'},
  {d: 'h',u: 'H'},
  {d: 'j',u: 'J'},
  {d: 'k',u: 'K'},
  {d: 'l',u: 'L'},
  {d: ';',u: ':'},
  {d: '\'',u: '"'},
  {}, // Return
  {}, // Left shift
  {d: 'z',u: 'Z'},
  {d: 'x',u: 'X'},
  {d: 'c',u: 'C'},
  {d: 'v',u: 'V'},
  {d: 'b',u: 'B'},
  {d: 'n',u: 'N'},
  {d: 'm',u: 'M'},
  {d: ',',u: '<'},
  {d: '.',u: '>'},
  {d: '/',u: '?'},
  {}, // Right shift
  {}  // Space
];

var mlKeyboard = mlKeyboard || {layouts: {}};

mlKeyboard.layouts.ru_RU = [
  {d: 'ё',u: 'Ё'},
  {d: '1',u: '!'},
  {d: '2',u: '\''},
  {d: '3',u: '№'},
  {d: '4',u: '%'},
  {d: '5',u: ':'},
  {d: '6',u: ','},
  {d: '7',u: '.'},
  {d: '8',u: ';'},
  {d: '9',u: '('},
  {d: '0',u: ')'},
  {d: '-',u: '_'},
  {d: '=',u: '+'},
  {}, // Delete
  {}, // Tab
  {d: 'й',u: 'Й'},
  {d: 'ц',u: 'Ц'},
  {d: 'у',u: 'У'},
  {d: 'к',u: 'К'},
  {d: 'е',u: 'Е'},
  {d: 'н',u: 'Н'},
  {d: 'г',u: 'Г'},
  {d: 'ш',u: 'Ш'},
  {d: 'щ',u: 'Щ'},
  {d: 'з',u: 'З'},
  {d: 'х',u: 'Х'},
  {d: 'ъ',u: 'Ъ'},
  {d: '|',u: '\\'},
  {}, // Caps Lock
  {d: 'ф',u: 'Ф'},
  {d: 'ы',u: 'Ы'},
  {d: 'в',u: 'В'},
  {d: 'а',u: 'А'},
  {d: 'п',u: 'П'},
  {d: 'р',u: 'Р'},
  {d: 'о',u: 'О'},
  {d: 'л',u: 'Л'},
  {d: 'д',u: 'Д'},
  {d: 'ж',u: 'Ж'},
  {d: 'э',u: 'Э'},
  {}, // Return
  {}, // Left Shift
  {d: 'я',u: 'Я'},
  {d: 'ч',u: 'Ч'},
  {d: 'с',u: 'С'},
  {d: 'м',u: 'М'},
  {d: 'и',u: 'И'},
  {d: 'т',u: 'Т'},
  {d: 'ь',u: 'Ь'},
  {d: 'б',u: 'Б'},
  {d: 'ю',u: 'Ю'},
  {d: '.',u: ','},
  {}, // Right Shift
  {} // Space
];

var mlKeyboard = mlKeyboard || {layouts: {}};

mlKeyboard.layouts.es_ES = [
  {d: '<', u: '>'},
  {d: '1',u: '¡'},
  {d: '2',u: '!'},
  {d: '3',u: '#'},
  {d: '4',u: '$'},
  {d: '5',u: '%'},
  {d: '6',u: '/'},
  {d: '7',u: '&'},
  {d: '8',u: '*'},
  {d: '9',u: '('},
  {d: '0',u: ')'},
  {d: '-',u: '_'},
  {d: '=',u: '+'},
  {}, // Delete
  {}, // Tab
  {d: 'q',u: 'Q'},
  {d: 'w',u: 'W'},
  {d: 'e',u: 'E', m: [
    {d: 'e', u: 'E'},
    {d: 'é', u: 'É'}
  ]},
  {d: 'r',u: 'R'},
  {d: 't',u: 'T'},
  {d: 'y',u: 'Y'},
  {d: 'u',u: 'U', m: [
    {d: 'u', u: 'U'},
    {d: 'ú', u: 'Ú'},
    {d: 'ü', u: 'Ü'}
  ]},
  {d: 'i',u: 'I', m: [
    {d: 'i', u: 'I'},
    {d: 'í', u: 'Í'}
  ]},
  {d: 'o',u: 'O', m: [
    {d: 'o', u: 'O'},
    {d: 'ó', u: 'Ó'}
  ]},
  {d: 'p',u: 'P'},
  {d: '´',u: 'º'},
  {d: '`',u: '¨'},
  {d: '\'',u: '"'},
  {}, // Caps lock
  {d: 'a',u: 'A', m: [
    {d: 'a', u: 'A'},
    {d: 'á', u: 'Á'}
  ]},
  {d: 's',u: 'S'},
  {d: 'd',u: 'D'},
  {d: 'f',u: 'F'},
  {d: 'g',u: 'G'},
  {d: 'h',u: 'H'},
  {d: 'j',u: 'J'},
  {d: 'k',u: 'K'},
  {d: 'l',u: 'L'},
  {d: 'ñ',u: 'Ñ'},
  {d: ';',u: ':'},
  {}, // Return
  {}, // Left shift
  {d: 'z',u: 'Z'},
  {d: 'x',u: 'X'},
  {d: 'c',u: 'C'},
  {d: 'v',u: 'V'},
  {d: 'b',u: 'B'},
  {d: 'n',u: 'N'},
  {d: 'm',u: 'M'},
  {d: ',',u: '¿'},
  {d: '.',u: '?'},
  {d: 'ç',u: 'Ç'},
  {}, // Right shift
  {}  // Space
];

var mlKeyboard = mlKeyboard || {layouts: {}};

mlKeyboard.layouts.pt_PT = [
  {d: '\/', u: '|'},
  {d: '1',u: '!'},
  {d: '2',u: '"'},
  {d: '3',u: '#'},
  {d: '4',u: '$'},
  {d: '5',u: '%'},
  {d: '6',u: '&'},
  {d: '7',u: '/'},
  {d: '8',u: '('},
  {d: '9',u: ')'},
  {d: '0',u: '='},
  {d: '-',u: '?'},
  {d: '~',u: '^'},
  {}, // Delete
  {}, // Tab
  {d: 'q',u: 'Q'},
  {d: 'w',u: 'W'},
  {d: 'e',u: 'E', m: [
    {d: 'e', u: 'E'},
    {d: 'é', u: 'É'},
    {d: 'ê', u: 'Ê'}
  ]},
  {d: 'r',u: 'R'},
  {d: 't',u: 'T'},
  {d: 'y',u: 'Y'},
  {d: 'u',u: 'U', m: [
    {d: 'u', u: 'U'},
    {d: 'ú', u: 'Ú'}
  ]},
  {d: 'i',u: 'I', m: [
    {d: 'i', u: 'I'},
    {d: 'í', u: 'Í'}
  ]},
  {d: 'o',u: 'O', m: [
    {d: 'o', u: 'O'},
    {d: 'ó', u: 'Ó'},
    {d: 'õ', u: 'Õ'},
    {d: 'ô', u: 'Ô'}
  ]},
  {d: 'p',u: 'P'},
  {d: '´',u: 'º'},
  {d: '`',u: '¨'},
  {d: '\'',u: '"'},
  {}, // Caps lock
  {d: 'a',u: 'A', m: [
    {d: 'a', u: 'A'},
    {d: 'á', u: 'Á'},
    {d: 'à', u: 'À'},
    {d: 'ã', u: 'Ã'},
    {d: 'â', u: 'Â'}
  ]},
  {d: 's',u: 'S'},
  {d: 'd',u: 'D'},
  {d: 'f',u: 'F'},
  {d: 'g',u: 'G'},
  {d: 'h',u: 'H'},
  {d: 'j',u: 'J'},
  {d: 'k',u: 'K'},
  {d: 'l',u: 'L'},
  {d: 'ñ',u: 'Ñ'},
  {d: ';',u: ':'},
  {}, // Return
  {}, // Left shift
  {d: 'z',u: 'Z'},
  {d: 'x',u: 'X'},
  {d: 'c',u: 'C', m: [
    {d: 'c', u: 'C'},
    {d: 'ç', u: 'Ç'}
  ]},
  {d: 'v',u: 'V'},
  {d: 'b',u: 'B'},
  {d: 'n',u: 'N'},
  {d: 'm',u: 'M'},
  {d: ',',u: '¿'},
  {d: '.',u: '?'},
  {d: 'ç',u: 'Ç'},
  {}, // Right shift
  {}  // Space
];

var mlKeyboard = mlKeyboard || {layouts: {}};

mlKeyboard.layouts.pt_BR = [
  {d: '\'', u: '"'},
  {d: '1',u: '!'},
  {d: '2',u: '@'},
  {d: '3',u: '#'},
  {d: '4',u: '$'},
  {d: '5',u: '%'},
  {d: '6',u: '¨'},
  {d: '7',u: '&'},
  {d: '8',u: '*'},
  {d: '9',u: '('},
  {d: '0',u: ')'},
  {d: '-',u: '_'},
  {d: '+',u: '='},
  {}, // Delete
  {}, // Tab
  {d: 'q',u: 'Q'},
  {d: 'w',u: 'W'},
  {d: 'e',u: 'E', m: [
    {d: 'e', u: 'E'},
    {d: 'é', u: 'É'},
    {d: 'ê', u: 'Ê'},
    {d: 'ë', u: 'Ë'}
  ]},
  {d: 'r',u: 'R'},
  {d: 't',u: 'T'},
  {d: 'y',u: 'Y'},
  {d: 'u',u: 'U', m: [
    {d: 'u', u: 'U'},
    {d: 'ú', u: 'Ú'}
  ]},
  {d: 'i',u: 'I', m: [
    {d: 'i', u: 'I'},
    {d: 'í', u: 'Í'}
  ]},
  {d: 'o',u: 'O', m: [
    {d: 'o', u: 'O'},
    {d: 'ó', u: 'Ó'},
    {d: 'õ', u: 'Õ'},
    {d: 'ô', u: 'Ô'}
  ]},
  {d: 'p',u: 'P'},
  {d: '´',u: '`'},
  {d: '{',u: '['},
  {d: '}',u: ']'},
  {}, // Caps lock
  {d: 'a',u: 'A', m: [
    {d: 'a', u: 'A'},
    {d: 'á', u: 'Á'},
    {d: 'à', u: 'À'},
    {d: 'ã', u: 'Ã'},
    {d: 'â', u: 'Â'}
  ]},
  {d: 's',u: 'S'},
  {d: 'd',u: 'D'},
  {d: 'f',u: 'F'},
  {d: 'g',u: 'G'},
  {d: 'h',u: 'H'},
  {d: 'j',u: 'J'},
  {d: 'k',u: 'K'},
  {d: 'l',u: 'L'},
  {d: 'ç',u: 'Ç'},
  {d: '^',u: '~'},
  {}, // Return
  {}, // Left shift
  {d: '\\',u: '|'},
  {d: 'z',u: 'Z'},
  {d: 'x',u: 'X'},
  {d: 'c',u: 'C', m: [
    {d: 'c', u: 'C'},
    {d: 'ç', u: 'Ç'}
  ]},
  {d: 'v',u: 'V'},
  {d: 'b',u: 'B'},
  {d: 'n',u: 'N'},
  {d: 'm',u: 'M'},
  {d: ',',u: '¿'},
  {d: '.',u: '?'},
  {}, // Right shift
  {}  // Space
];

var mlKeyboard = mlKeyboard || {layouts: {}};

mlKeyboard.layouts.it_IT = [
  {d: '\\', u: '|'},
  {d: '1',u: '!'},
  {d: '2',u: '"'},
  {d: '3',u: '£'},
  {d: '4',u: '$'},
  {d: '5',u: '%'},
  {d: '6',u: '&'},
  {d: '7',u: '/'},
  {d: '8',u: '('},
  {d: '9',u: ')'},
  {d: '0',u: '='},
  {d: '\'',u: '?'},
  {d: 'ì',u: '^'},
  {}, // Delete
  {}, // Tab
  {d: 'q',u: 'Q'},
  {d: 'w',u: 'W'},
  {d: 'e',u: 'E'},
  {d: 'r',u: 'R'},
  {d: 't',u: 'T'},
  {d: 'y',u: 'Y'},
  {d: 'u',u: 'U'},
  {d: 'i',u: 'I'},
  {d: 'o',u: 'O'},
  {d: 'p',u: 'P'},
  {d: 'è',u: 'é', m: [
    {d: 'è', u: 'é'},
    {d: '[', u: '{'}
  ]},
  {d: '+',u: '*', m: [
    {d: '+', u:'*'},
    {d: ']', u: '}'}
  ]},
  {d: 'ù',u: '§'},
  {}, // Caps lock
  {d: 'a',u: 'A'},
  {d: 's',u: 'S'},
  {d: 'd',u: 'D'},
  {d: 'f',u: 'F'},
  {d: 'g',u: 'G'},
  {d: 'h',u: 'H'},
  {d: 'j',u: 'J'},
  {d: 'k',u: 'K'},
  {d: 'l',u: 'L'},
  {d: 'ò',u: 'ç', m:[
    {d: 'ò',u: 'ç'},
    {d:'@', u: 'Ç'}
  ]},
  {d: 'à',u: '°', m:[
    {d: 'à',u: '°'},
    {d:'#', u: '∞'}
  ]},
  {}, // Return
  {}, // Left shift
  {d: 'z',u: 'Z'},
  {d: 'x',u: 'X'},
  {d: 'c',u: 'C'},
  {d: 'v',u: 'V'},
  {d: 'b',u: 'B'},
  {d: 'n',u: 'N'},
  {d: 'm',u: 'M'},
  {d: ',',u: ';'},
  {d: '.',u: ':'},
  {d: '-',u: '_'},
  {}, // Right shift
  {}  // Space
];

var mlKeyboard = mlKeyboard || {layouts: {}};

mlKeyboard.layouts.fr_FR = [
  {d: '²', u: ''},
  {d: '&',u: '1'},
  {d: 'é',u: '2', m:[
    {d: 'é',u: '2'},
    {d: '~',u: 'É'}
  ]},
  {d: '"',u: '3', m: [
    {d: '"',u: '3'},
    {d: '#',u: '#'}
  ]},
  {d: '\'',u: '4', m:[
    {d: '\'', u:'4'},
    {d: '{',u: '{'}
  ]},
  {d: '(',u: '5', m:[
    {d: '(',u: '5'},
    {d: '[', u:'['}
  ]},
  {d: '-',u: '6', m:[
    {d: '-',u: '6'},
    {d: '|', u:'|'}
  ]},
  {d: 'è',u: '7', m:[
    {d: 'è',u: '7'},
    {d: '`', u:'È'}
  ]},
  {d: '_',u: '8', m:[
    {d: '_',u: '8'},
    {d: '\\', u:'\\'}
  ]},
  {d: 'ç',u: '9', m:[
    {d: 'ç',u: '9'},
    {d: '^', u:'Ç'}
  ]},
  {d: 'à',u: '0', m:[
    {d: 'à',u: '0'},
    {d: '@', u:'À'}
  ]},
  {d: ')',u: '°', m:[
    {d: ')', u:'°'},
    {d: ']', u:']'}
  ]},
  {d: '=',u: '+', m:[
    {d: '=', u:'+'},
    {d: '}', u:'}'}
  ]},
  {}, // Delete
  {}, // Tab
  {d: 'a',u: 'A', m: [
    {d: 'a', u: 'A'},
    {d: 'á', u: 'Á'},
    {d: 'à', u: 'À'},
    {d: 'ã', u: 'Ã'},
    {d: 'â', u: 'Â'}
  ]},
  {d: 'z',u: 'Z'},
  {d: 'e',u: 'E', m: [
    {d: 'e', u: 'E'},
    {d: 'é', u: 'É'},
    {d: 'ê', u: 'Ê'}
  ]},
  {d: 'r',u: 'R'},
  {d: 't',u: 'T'},
  {d: 'y',u: 'Y'},
  {d: 'u',u: 'U', m: [
    {d: 'u', u: 'U'},
    {d: 'ú', u: 'Ú'},
    {d: 'ü', u: 'Ü'}
  ]},
  {d: 'i',u: 'I', m: [
    {d: 'i', u: 'I'},
    {d: 'í', u: 'Í'}
  ]},
  {d: 'o',u: 'O', m: [
    {d: 'o', u: 'O'},
    {d: 'ó', u: 'Ó'},
    {d: 'õ', u: 'Õ'},
    {d: 'ô', u: 'Ô'}
  ]},
  {d: 'p',u: 'P'},
  {d: '^',u: '¨'},
  {d: '$',u: '£', m: [
	{d: '$', u: '£'},
	{d: '¤', u: '¤'}
  ]},
  {d: '*',u: 'µ'},
  {}, // Caps lock
  {d: 'q',u: 'Q'},
  {d: 's',u: 'S'},
  {d: 'd',u: 'D'},
  {d: 'f',u: 'F'},
  {d: 'g',u: 'G'},
  {d: 'h',u: 'H'},
  {d: 'j',u: 'J'},
  {d: 'k',u: 'K'},
  {d: 'l',u: 'L'},
  {d: 'm',u: 'M'},
  {d: 'ù',u: '%'},
  {}, // Return
  {}, // Left shift
  {d: 'w',u: 'W'},
  {d: 'x',u: 'X'},
  {d: 'c',u: 'C', m: [
    {d: 'c', u: 'C'},
    {d: 'ç', u: 'Ç'}
  ]},
  {d: 'v',u: 'V'},
  {d: 'b',u: 'B'},
  {d: 'n',u: 'N'},
  {d: ',',u: '?'},
  {d: ';',u: '.'},
  {d: ':',u: '/'},
  {d: '!',u: '§'},
  {}, // Right shift
  {}  // Space
];

var mlKeyboard = mlKeyboard || {layouts: {}};

mlKeyboard.layouts.de_DE = [
  {d: '`', u: '~'},
  {d: '1',u: '!'},
  {d: '2',u: '"'},
  {d: '3',u: '§'},
  {d: '4',u: '$'},
  {d: '5',u: '%'},
  {d: '6',u: '&'},
  {d: '7',u: '/'},
  {d: '8',u: '('},
  {d: '9',u: ')'},
  {d: '0',u: '='},
  {d: '-',u: '_'},
  {d: 'ß',u: '?'},
  {}, // Delete,
  {}, // Tab,
  {d: 'q',u: 'Q'},
  {d: 'w',u: 'W'},
  {d: 'e',u: 'E'},
  {d: 'r',u: 'R'},
  {d: 't',u: 'T'},
  {d: 'z',u: 'Z'},
  {d: 'u',u: 'U'},
  {d: 'i',u: 'I'},
  {d: 'o',u: 'O'},
  {d: 'p',u: 'P'},
  {d: 'ü',u: 'Ü'},
  {d: '+',u: '*'},
  {d: '+',u: '*'},
  {}, // Caps lock
  {d: 'a',u: 'A'},
  {d: 's',u: 'S'},
  {d: 'd',u: 'D'},
  {d: 'f',u: 'F'},
  {d: 'g',u: 'G'},
  {d: 'h',u: 'H'},
  {d: 'j',u: 'J'},
  {d: 'k',u: 'K'},
  {d: 'l',u: 'L'},
  {d: 'ö',u: 'Ö'},
  {d: 'ä',u: 'Ä'},
  {}, // Return
  {}, // Left shift
  {d: '<',u: '>'},
  {d: 'y',u: 'Y'},
  {d: 'x',u: 'X'},
  {d: 'c',u: 'C'},
  {d: 'v',u: 'V'},
  {d: 'b',u: 'B'},
  {d: 'n',u: 'N'},
  {d: 'm',u: 'M'},
  {d: ',',u: ';'},
  {d: '.',u: ':'},
  {}, // Right shift
  {}  // Space
];
