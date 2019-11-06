# jQuery MLKeyboard

**ML Keyboard** is a jQuery virtual keyboard with features to change input layouts on the flight.

#### [Demo](http://mbut.github.io/jquery.mlkeyboard/)

## Usage
* Download <code>jquery.ml-keyboard.min.js</code> and <code>jquery.ml-keyboard.css</code> files and add to your project.
* Activate the plugin on the input fields with prefered layot <code>$('input').mlKeyboard({layout: 'es_ES'});</code>.
* It's ready.

### Options
The following options are available to pass into ML Keyboard on initialization.

* (string) **layout:** set layout which is applicable to all input fields. Default value - 'en_us', i.e. American English layout.

* (boolean) **active_shift:** initial shift key state (only applicable to the first evocation of the keyboard). Default value - true.

* (boolean) **active_caps:** initial caps lock state (only applicable to the first evocation of the keyboard). Default value - false.

* (boolean) **is_hidden:** change to false if the keyboard should always be visible. Default value - true.

* (integer) **open_speed:** speed at which the keyboard shows up. Default value - 300.

* (integer) **close_speed:** speed at which keyboard hides back. Default value - 300.

* (boolean) **show_on_focus:** display the keyboard when the element it is attached to has gained focus. Default value - true.

* (boolean) **hide_on_blur:** hide the keyboard whenever the element it is attached to loses focus. Default value - true.

* (boolean) **hide_on_return:** hide the keyboard when the return key is pressed. Default value - true.

* (boolean) **hide_on_tab:** hide the keyboard when the tab key is pressed. Default value - false.

* (boolean) **blur_on_return:** remove focus from the element to which the keyboard is attached upon pressing the *return* key. Default value - true.

* (boolean) **enter_key:** return key will be treated as enter key on textareas, adding a new line. Default value - <b>true</b>.

* (string) **line_ending:** inserted into textarea value when pressing enter if the *enter_key* option is enabled. Default value - "\n".

* (string) **trigger:** jQuery selector of an element (or elements) which will trigger the keyboard (show it or hide) when clicked on. Default value - undefined.

* (boolean) **enabled:** change it to false if you want to disable the keyboard temporarily. This parameter is useful when defined as input data attribute (read below how to set up single inputs with data attributes).

To change behaviour of single input field special data attribute should be added to its tag name <code>data-mlkeyboard-&lt;option&gt;="value"</code> where <code>option</code> is the attribute in question.

###### Currently possible layouts</h5>
* **de_DE** - German
* **en_US** - English
* **es_ES** - Spanish
* **fr_FR** - French
* **it_IT** - Italian
* **pt_BR** - Portuguese (Brazil)
* **pt_PT** - Portuguese
* **ru_RU** - Russian