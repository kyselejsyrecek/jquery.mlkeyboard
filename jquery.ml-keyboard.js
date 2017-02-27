(function($){
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
  if (this.id) {
    this.$key.attr("id", this.id);
  }
  return this.$key;
};

Key.prototype.setCurrentValue = function() {
  if (this.keyboard.upperRegister()) {
    this.current_value = this.preferences.u ? this.preferences.u : this.default_value;
  } else {
    this.current_value = this.preferences.d ? this.preferences.d : this.default_value;
  }
  if (this.innerHTML){
    this.$key.html(this.innerHTML);
  }else{
    this.$key.text(this.current_value);
  }
  if (this.css){
    this.$key.addClass(this.css);
  }
};

Key.prototype.setCurrentAction = function() {
  var _this = this;

  this.$key.unbind("click.mlkeyboard");
  this.$key.bind("click.mlkeyboard", function(){
    _this.keyboard.keep_focus = true;

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

  this.css = "mlkeyboard-backspace";
  this.innerHTML = "<i class='fa fa-long-arrow-left'></i>&nbsp;backspace";
}

KeyDelete.prototype = new Key();
KeyDelete.prototype.constructor = KeyDelete;

KeyDelete.prototype.defaultClickAction = function() {
  this.keyboard.deleteChar();
};
  function KeyTab() {
  Key.call(this, arguments);

  this.id = "mlkeyboard-tab";
  this.default_value = 'tab';
}

KeyTab.prototype = new Key();
KeyTab.prototype.constructor = KeyTab;

KeyTab.prototype.defaultClickAction = function() {
  if (!this.keyboard.options.locked){
    this.keyboard.hideKeyboard();
    $(":input").eq($(":input").index(this.keyboard.$current_input)+1).focus();
  }

};

  function KeyCapsLock() {
  Key.call(this, arguments);

  this.css = "mlkeyboard-capslock";
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
  function KeyEnter() {
  Key.call(this, arguments);

  this.css = "mlkeyboard-enter";
  this.default_value = 'enter';
}

KeyEnter.prototype = new Key();
KeyEnter.prototype.constructor = KeyEnter;

KeyEnter.prototype.defaultClickAction = function() {
    if (!this.keyboard.options.locked){
      this.keyboard.hideKeyboard();
    }
};

KeyHide.prototype = new Key();
KeyHide.prototype.constructor = KeyHide;

KeyHide.prototype.defaultClickAction = function() {
  if (!this.keyboard.options.locked){
    this.keyboard.hideKeyboard();
    
  }

  this.keyboard.$current_input.focus();
  
};
  function KeyHide() {
    Key.call(this, arguments);
    
    this.css = "mlkeyboard-hide";
    this.innerHTML = "<i class='fa fa-arrow-down'></i>";
  }

KeyLock.prototype = new Key();
KeyLock.prototype.constructor = KeyLock;

KeyLock.prototype.defaultClickAction = function() {
  if (!this.keyboard.options.locked){
    this.keyboard.options.locked = true;
    $('.mlkeyboard-lock').html("<i class='fa fa-lock' style='color:red'></i>");
  }else{
    this.keyboard.options.locked = false;
    $('.mlkeyboard-lock').html("<i class='fa fa-unlock' style='color:#5cb85c'></i>");
  }
  this.keyboard.$current_input.focus();
};
function KeyLock() {
  Key.call(this, arguments);
  
  this.css = "mlkeyboard-lock";
  this.innerHTML = "<i class='fa fa-unlock' style='color:#5cb85c'></i>";
}


KeyShift.prototype = new Key();
KeyShift.prototype.constructor = KeyShift;

function KeyShift() {
  Key.call(this, arguments);

  this.default_value = 'shift';
  this.css= "mlkeyboard-"+arguments[1]+"-shift";
}


KeyShift.prototype.isActive = function() {
  return this.keyboard.active_shift;
};

KeyShift.prototype.defaultClickAction = function() {
  this.keyboard.toggleShift();
};



KeySpace.prototype = new Key();
KeySpace.prototype.constructor = KeySpace;
  const KEYS_COUNT = 55;

function KeySpace() {
  Key.call(this, arguments);

  this.id = "mlkeyboard-space";
  this.css= 'mlkeyboard_space';
  this.default_value = ' ';
}

function Keyboard(selector, options){
  this.defaults = {
    unique_tag:undefined,
    layout: 'en_US',
    active_shift: true,
    active_caps: false,
    is_hidden: true,
    open_speed: 300,
    close_speed: 100,
    show_on_focus: true,
    hide_on_blur: true,
    trigger: undefined,
    enabled: true,
    show_on_readonly:false,
    locked:false,
    trigger_other:undefined,
    elementToAppend:"body",
    formToSubmit:undefined
  };

  this.global_options = $.extend({}, this.defaults, options);
  this.options = $.extend({}, {}, this.global_options);

  this.keys = [];

  this.$keyboard = $("<div/>").attr("id", "mlkeyboard");
  this.$modifications_holder = $("<ul/>").addClass('mlkeyboard-modifications');
  this.$current_input = $(selector);
}

Keyboard.prototype.init = function() {
  
  this.$keyboard.append(this.renderKeys());
  this.$keyboard.append(this.$modifications_holder);
  $(this.options.elementToAppend).append(this.$keyboard);

  if (this.options.is_hidden) this.$keyboard.hide();

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
      key = new KeyLock(this);
      break;
    case 29:
      key = new KeyCapsLock(this);
      break;
    case 41:
      key = new KeyEnter(this);
      break;
    case 42:
      key = new KeyShift(this, "left");
      break;
    case 53:
      key = new KeyShift(this, "right");
      break;
    case 54:
      key = new KeyHide(this);
      break;
    case 55:
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
    $input.bind('focus', function() { 
      _this.showKeyboard($input); 
    });
  }

    $input.click(function (){
      if (!_this.isVisible){
        if (_this.options.trigger_other){
          $( _this.options.trigger_other.selector ).addClass( _this.options.trigger_other.class );
        }
        _this.isVisible = true;
        _this.$keyboard.slideDown(_this.options.openSpeed);
      }
    });

  if (this.options.hide_on_blur) {
    $input.bind('blur', function(e) {
      if (!_this.options.locked){ //hide keyboard when it's not locked
        var VERIFY_STATE_DELAY = 150;
        // Input focus changes each time when user click on keyboard key
        // To prevent momentary keyboard collapse input state verifies with timers help
        // Any key click action set current inputs keep_focus variable to true
        clearTimeout(_this.blur_timeout);
        _this.blur_timeout = setTimeout(function(){
          if (!($(document.activeElement).attr('id') == _this.$current_input.attr('id'))){
              _this.hideKeyboard();
              _this.keep_focus = false;
          }
          
          // if (!_this.keep_focus) { _this.hideKeyboard(); }
          // else { _this.keep_focus = false; }
        }, VERIFY_STATE_DELAY);
      }

    });
  }

  if (this.options.trigger) {
    var $trigger = $(this.options.trigger);
    $trigger.bind('click', function(e) {
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
  if (!this.keep_focus || input_changed) {
    
    if (input_changed) this.keep_focus = true;
    this.$current_input = $input;
    this.options = $.extend({}, this.global_options, this.inputLocalOptions());

    if (!this.options.enabled) {
      this.keep_focus = false;
      return;
    }

    if (this.$current_input.val() !== '') {
      this.options.active_shift = false;
    }

    if (this.options.trigger_other){
      
      $( this.options.trigger_other.selector ).addClass(this.options.trigger_other.class);
    }

    this.setUpKeys();

    if (this.options.is_hidden) {
      this.isVisible = true;
      this.$keyboard.slideDown(this.options.openSpeed);
    }
  }
};

Keyboard.prototype.hideKeyboard = function() {
  if (this.options.is_hidden) {
    this.isVisible = false;
    this.$keyboard.slideUp(this.options.closeSpeed);
    if (this.options.trigger_other){
      $( this.options.trigger_other.selector ).removeClass(this.options.trigger_other.class);
    }
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
  if (!this.options.locked){
    var selStart = this.$current_input[0].selectionStart;
    var selEnd = this.$current_input[0].selectionEnd;
    var textAreaStr = this.$current_input.val();
    var value = textAreaStr.substring(0, selStart) + char + textAreaStr.substring(selEnd);

    this.$current_input.val(value);
    
    this.$current_input[0].selectionStart = selStart+1, this.$current_input[0].selectionEnd = selStart+1;
  }

  this.$current_input.focus();
};

Keyboard.prototype.deleteChar = function() {
  var selStart = this.$current_input[0].selectionStart;
  var selEnd = this.$current_input[0].selectionEnd;

  var textAreaStr = this.$current_input.val();
  var after = textAreaStr.substring(0, selStart-1);
  var value = after + textAreaStr.substring(selEnd);
  this.$current_input.val(value).focus();
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
  this.$current_input.focus();
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
  };

})(jQuery);

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
  {d: '[',u: '{'},
  {d: ']',u: '}'},
  {d: '\\',u: '|'},
  {},
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
  {}, // Hide Keyboard
  {}  // Space
];

