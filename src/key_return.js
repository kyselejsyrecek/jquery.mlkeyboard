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
  
  if (this.keyboard.options.blur_on_return) {
    this.keyboard.$current_input.blur();
    if (this.keyboard.options.hide_on_return) {
      this.keyboard.hideKeyboard();
    }
  }
}