# jQuery MLKeyboard

**ML Keyboard** 一款Jquery为基础的虚拟键盘.

#### [原作者github](https://github.com/mBut/jquery.mlkeyboard/)

## 使用
* 下载 <code>jquery.ml-keyboard.min.js</code> 以及 <code>jquery.ml-keyboard.css</code> 并且在项目中引用.
* 通过 <code>$('input').mlKeyboard();</code> 在项目中激活该插件.

### Options
可传入选项.

* (string) **layout:** 暂时只支持英文键盘.

* (boolean) **active_shift:** 当键盘启动时是否自动激活shift键,(默认true).

* (boolean) **active_caps:** 当键盘启动时是否自动激活大写键,(默认false).

* (boolean) **is_hidden:** 是否自动隐藏键盘(默认true).

* (integer) **open_speed:** 键盘开启速度(默认300).

* (integer) **close_speed:** 键盘隐藏速度(默认100).

* (boolean) **enabled:** - 是否自动启用键盘(默认true)(弃用).

* (boolean) **locked(新):**  是否自动启用键盘(默认true).

* (object) **trigger_other(新):** 当键盘采用时候是否添加影响其他元素,当键盘触发时将自动添加或删除所传入的class,默认(undefined). 例子: {selector:".element",class:"smaller"}.

* (string) **elementToAppend(新):** 键盘html内容被添加的位置(默认body), 诸如bootstrap的modal键盘需要被添加在modal内才不会被mask覆盖.

