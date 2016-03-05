//Grid列的格式化函数
var GridFormat = {
    DateTimeFormatter: function (value, rec, index, hasTime) {
        if (!$.valid(value)) {
            return "";
        }
        /*json格式时间转js时间格式*/
        var myDate = Date.StringToDate(value);
        if (!myDate)
            return "";

        if (hasTime) {
            return myDate.Format("yyyy-MM-dd HH:mm:ss");
        } else {
            return myDate.Format("yyyy-MM-dd");
        }
    },
    //百分格式
    PercentFormatter: function (num, row, index, symbol, precision, original) {

        if (!$.valid(num))
            return "";

        //if (!$.valid(symbol))
        //    symbol = "%";

        if (!$.isNumeric(num))
            return num;

        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num))
            num = 0;

        if (!original)
            num = Math.AccMul(num, 100);

        var reservedDecimal = 100;
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * reservedDecimal + 0.50000000001);
        cents = num % reservedDecimal;
        num = Math.floor(num / reservedDecimal).toString();
        var scents = '';
        var rat = reservedDecimal / 10;
        while (rat > 1 && Math.floor(cents / rat) <= 0) {
            scents = "0" + scents;
            rat = rat / 10;
        }
        cents = scents + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
        //return (((sign) ? '' : '-') + num + '.' + cents + symbol);
        return (((sign) ? '' : '-') + num + '.' + cents);
    },
    //千分格式
    PermillageFormatter: function (num, row, index, symbol, precision, original) {

        if (!$.valid(num))
            return "";

        if (!$.valid(symbol))
            symbol = "‰";

        if (!$.isNumeric(num))
            return num;


        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num))
            num = 0;

        if (!original)
            num = Math.AccMul(num, 1000);

        if (precision == undefined || precision == null)
            precision = 2;

        var reservedDecimal = Math.pow(10,precision);
        
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * reservedDecimal + 0.50000000001);
        cents = num % reservedDecimal;
        num = Math.floor(num / reservedDecimal).toString();
        var scents = '';
        var rat = reservedDecimal / 10;
        while (rat > 1 && Math.floor(cents / rat) <= 0) {
            scents = "0" + scents;
            rat = rat / 10;
        }
        cents = scents + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num + '.' + cents + symbol);

    },
    CurrencyFormatter: function (num, row, index, symbol, precision) {

        if (!$.valid(num))
            return "";

        if (!$.valid(symbol))
            symbol = "";

        if (!$.isNumeric(num))
            return num;

        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num))
            num = 0;

        if (precision == undefined || precision == null)
            precision = 2;

        var reservedDecimal = Math.pow(10, precision);

        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * reservedDecimal + 0.50000000001);
        cents = num % reservedDecimal;
        num = Math.floor(num / reservedDecimal).toString();
        var scents = '';
        var rat = reservedDecimal / 10;
        while (rat > 1 && Math.floor(cents / rat) <= 0) {
            scents = "0" + scents;
            rat = rat / 10;
        }
        cents = scents + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
        if (num == "0" && cents == "00")
            sign = true;
        return (((sign) ? '' : '-') + symbol + num + '.' + cents);

    },
    QuantityFormatter: function (num, row, index, symbol, precision) {

        if (!$.valid(num))
            return "";

        if (!$.valid(symbol))
            symbol = "";

        if (!$.isNumeric(num))
            return num;

        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num))
            num = 0;

        if (precision == undefined || precision == null)
            precision = (config && config.businessOptions.QuantityPrecision ? config.businessOptions.QuantityPrecision : 4);

        var reservedDecimal = Math.pow(10, precision);

        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * reservedDecimal + 0.50000000001);
        cents = num % reservedDecimal;
        num = Math.floor(num / reservedDecimal).toString();
        var scents = '';
        var rat = reservedDecimal / 10;
        while (rat > 1 && Math.floor(cents / rat) <= 0) {
            scents = "0" + scents;
            rat = rat / 10;
        }
        cents = scents + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num + '.' + cents + symbol);
    },
    UnitWeightFormatter: function (num, row, index, symbol, precision) {
        if (!$.valid(num))
            return "";

        if (!$.valid(symbol))
            symbol = "";

        if (!$.isNumeric(num))
            return num;

        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num))
            num = 0;

        if (precision == undefined || precision == null)
            precision = (config && config.businessOptions.UnitWeightPrecision ? config.businessOptions.UnitWeightPrecision : 4);

        var reservedDecimal = Math.pow(10, precision);

        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * reservedDecimal + 0.50000000001);
        cents = num % reservedDecimal;
        num = Math.floor(num / reservedDecimal).toString();
        var scents = '';
        var rat = reservedDecimal / 10;
        while (rat > 1 && Math.floor(cents / rat) <= 0) {
            scents = "0" + scents;
            rat = rat / 10;
        }
        cents = scents + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num + '.' + cents + symbol);
    },
    UnitNumberFormatter: function (num, row, index, symbol) {

        if (!$.valid(num))
            return "";

        if (!$.valid(symbol))
            symbol = "";

        if (!$.isNumeric(num))
            return num;

        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num))
            num = 0;

        return parseInt(num);
    },
    LengthFormatter: function (num, row, index, symbol, precision) {

        if (!$.valid(num))
            return "";

        if (!$.valid(symbol))
            symbol = "m";

        if (!$.isNumeric(num))
            return num;

        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num))
            num = 0;

        if (precision == undefined || precision == null)
            precision = 2;

        var reservedDecimal = Math.pow(10, precision);

        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * reservedDecimal + 0.50000000001);
        cents = num % reservedDecimal;
        num = Math.floor(num / reservedDecimal).toString();
        var scents = '';
        var rat = reservedDecimal / 10;
        while (rat > 1 && Math.floor(cents / rat) <= 0) {
            scents = "0" + scents;
            rat = rat / 10;
        }
        cents = scents + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num + '.' + cents + symbol);
    },
    RemoveRow: function (unid, table) {
        var idx = $(table).datagrid("getRowIndexWithElement", $("#" + unid));
        if ($.valid(idx)) {
            $(table).datagrid('deleteRow', idx);
        }
    },
    EndEditRow: function (unid, table) {
        var idx = $(table).datagrid("getRowIndexWithElement", $("#" + unid));
        if ($.valid(idx)) {
            $(table).datagrid('endEdit', idx);
        }
    },
    CancelEditRow: function (unid, table) {
        var idx = $(table).datagrid("getRowIndexWithElement", $("#" + unid));
        var rows = $(table).datagrid("getRows");
        if ($.valid(idx)) {
            $(table).datagrid('cancelEdit', idx);
        }
    },
    SetAndReturnRowUnid: function (row) {
        return $.timestemp();
    },
    RemoveRowFormatter: function (num, row, index, tableSelect) {
        var id = GridFormat.SetAndReturnRowUnid(row);
        return "<a title='删除' id='" + id + "' class='icon-remove icon' href=\"javascript:GM.GridFormat.RemoveRow('" + id + "','" + tableSelect + "');\"></a>";
    },
    EndEditRowFormatter: function (num, row, index, tableSelect) {
        var id = GridFormat.SetAndReturnRowUnid(row);
        return "<a title='保存' id='" + id + "' class='icon-save icon' href=\"javascript:GM.GridFormat.EndEditRow('" + id + "','" + tableSelect + "');\"></a>";
    },
    CancelEditRowFormatter: function (num, row, index, tableSelect) {
        var opts = $(tableSelect).datagrid("options");
        var id = GridFormat.SetAndReturnRowUnid(row);
        return "<a title='取消' id='" + id + "' class='icon-undo icon' href=\"javascript:GM.GridFormat.CancelEditRow('" + id + "','" + tableSelect + "');\"></a>";
    }
};
if (window.GM == undefined)
    window.GM = {};
GM.GridFormat = GridFormat;