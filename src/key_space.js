function KeySpace() {
  Key.call(this, arguments);

  this.key_class = "mlkeyboard-space";
  this.default_value = ' ';
}

KeySpace.prototype = new Key();
KeySpace.prototype.constructor = KeySpace;