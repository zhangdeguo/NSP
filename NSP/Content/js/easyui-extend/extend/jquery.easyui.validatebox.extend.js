/**
 * Created with IntelliJ IDEA.
 * Licensed under the GPL licenses
 * http://www.gnu.org/licenses/gpl.txt
 * @author: 爱看书不识字<zjh527@163.com>
 *
 *
 */
(function ($) {

    $.extend($.fn.validatebox.defaults.rules, {
        unequal: {
            validator: function (value, param) {
                return value != param;
            },
            message: $.fn.validatebox.defaults.missingMessage
        },
        minLength: {
            validator: function (value, param) {
                return value.length >= param[0];
            },
            message: '请至少输入{0}个字符。'
        },
        equals: {
            validator: function (value, param) {
                if (/^#/.test(param)) {
                    return value == $(param).val();
                } else {
                    return value == param;
                }
            },
            message: '字段不匹配'
        },
        username: {// 验证用户名 
            validator: function (value) {
                return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value);
            },
            message: '用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'
        },
        name: {// 验证姓名，可以是中文或英文 
            validator: function (value) {
                return /^[\u0391-\uFFE5]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
            },
            message: '请输入中英文姓名'
        },
                mobile: {// 验证手机号码 
            validator: function (value) {
                return /^(13|15|18)\d{9}$/i.test(value);
            },
            message: '手机号码格式不正确'
        },
        email: {
            validator: function (value) {
                return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
            },
            message: '请输入有效的电子邮件账号(例：abc@126.com)'
        },
        comparePsw: {
            validator: function (value, param) {
                if ($("#" + param[0]).val() != "" && value != "") {
                    return $("#" + param[0]).val() == value;
                }
                else {
                    return true;
                }
            },
            message: '两次输入的密码不一致！'
        }
    });

})(jQuery);
