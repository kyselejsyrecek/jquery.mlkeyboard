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