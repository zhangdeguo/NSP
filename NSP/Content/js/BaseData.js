
//载入基础数据
var BaseData = {
    getComboCompany: function () {
        return this.getComboData("Base.Company.Query", "Company", "Id as value", "Name as text");
    },
    getComboBank: function () {
        return this.getComboData("Base.Bank.Query", "Bank", "Id as value", "Name as text");
    },
    getComboTeam: function () {
        return this.getComboData("Base.Team.Query", "Team", "Id as value", "Name as text");
    },
    getComboSupplier: function () {
        return this.getComboData("Base.Settlement.Query", "Settlement", "Id as value", "Name as text", [{ LExp: "IsSupplier", RExp: 1, Condition: "Equal" }]);
    },
    getComboLogistics: function () {
        return this.getComboData("Base.Settlement.Query", "Settlement", "Id as value", "Name as text", [{ LExp: "IsLogistics", RExp: 1, Condition: "Equal" }]);
    },
    getComboCustomer: function () {
        return this.getComboData("Base.Settlement.Query", "Settlement", "Id as value", "Name as text", [{ LExp: "IsCustomer", RExp: 1, Condition: "Equal" }]);
    },
    getComboProject: function () {
        return this.getComboData("Base.Project.Query", "Project", "Id as value", "Name as text");
    },
    getComboWarehouse: function () {
        return this.getComboData("Base.Warehouse.Query", "Warehouse", "Id as value", "Name as text");
    },
    getComboBuyer: function () {
        return this.getComboData("Base.SysUser.Query", "SysUser", "UNID as value", "NickName as text");
    },
    getComboOrigin: function () {
        return this.getComboData("Base.Origin.Query", "Origin", "Id as value", "Name as text");
    },
    getComboDiscountType: function () {
        return this.getComboEnum("Base.Enum.List", "discount");
    },
    getComboGrade: function () {
        return this.getComboEnum("Base.Enum.List", "grade");
    },
    getComboEnum: function (action, category) {
        var res;
        var sobj = { Category: category };

        GM.Core.doPostAction(action, sobj, function (json) {
            if (json.status == 0) {
                res = json.data;
            }
        }, false);
        return res;
    },
    getComboData: function (action, table, key, value, where) {
        var res;
        var sobj = {
            BusObjs: [{ BusObjName: table }], Props: [{ LExp: key }, { LExp: value }]
                    , Orders: [{ PropName: key, OrderType: "DESC" }]
        };
        if (where) {
            sobj.Wheres = where;
        }

        GM.Core.doPostAction(action, sobj, function (json) {
            if (json.status == 0) {
                res = json.data.rows;
            }
        }, false);
        return res;
    }
};
if (GM == undefined)
    GM = {};
GM.BaseData = BaseData;