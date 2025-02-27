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