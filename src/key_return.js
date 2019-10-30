function KeyReturn() {
  Key.call(this, arguments);

  this.id = "mlkeyboard-return";
  this.default_value = 'return';
}

KeyReturn.prototype = new Key();
KeyReturn.prototype.constructor = KeyReturn;

KeyReturn.prototype.defaultClickAction = function() {
  var e = $.Event("keypress", {
    which: 13,
    keyCode: 13
  });
  this.keyboard.$current_input.trigger(e);
  
  if (this.keyboard.options.blur_on_return) {
	  this.keyboard.$current_input.blur();
	  if (this.keyboard.options.hide_on_blur) {
		this.keyboard.hideKeyboard();
	  }
  }
};