function KeyDelete() {
  Key.call(this, arguments);

  this.id = "mlkeyboard-backspace";
  this.default_value = '⟵';
}

KeyDelete.prototype = new Key();
KeyDelete.prototype.constructor = KeyDelete;

KeyDelete.prototype.defaultClickAction = function() {
  this.keyboard.deleteChar();
};