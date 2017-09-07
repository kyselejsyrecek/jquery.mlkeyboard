(function($) {

function Keyboard(selector, options){
	this.defaults = {
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
		keys_count: 53,
		custom_class: ""
	};

	this.global_options = $.extend({}, this.defaults, options);
	this.options = $.extend({}, {}, this.global_options);

	this.keys = [];

	this.$keyboard = $("<div/>").attr("id", "mlkeyboard");
	if(options.custom_class.length)
	{
		this.$keyboard.addClass(options.custom_class);
	}
	this.$modifications_holder = $("<ul/>").addClass('mlkeyboard-modifications');
	this.$current_input = $(selector);
}

$.fn.mlKeyboard = function(options) {
	var keyboard = new Keyboard(this.selector, options);
	keyboard.init();

	this.each(function(){
		keyboard.setUpFor($(this));
	});
};

})(jQuery);