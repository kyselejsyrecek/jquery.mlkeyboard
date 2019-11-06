function KeyTab() {
  Key.call(this, arguments);

  this.id = "mlkeyboard-tab";
  this.default_value = 'tab';
}

KeyTab.prototype = new Key();
KeyTab.prototype.constructor = KeyTab;

KeyTab.prototype.defaultClickAction = function() {
  var $inputs = $(":input");
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
