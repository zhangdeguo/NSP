//系统功能分类
var Enum = {
    getEnumText: function (enumobj, enumVal, idf, txtf) {

        for (var i = 0; i < enumobj.length; i++) {
            if (enumobj[i][idf ? idf : "value"] == enumVal) return enumobj[i][txtf?txtf:"text"];
        }
        return enumVal;
    },
    SettlementType: [{ text: "供应商", value: 1 }, { text: "客户", value: 2 }, { text: "物流商", value: 3 }],
    DiscountType: [{ text: "资金占用", value: 0 }, { text: "跑量返利", value: 1 }, { text: "折扣返利", value: 2 }, { text: "其它", value: 3 }],
    SequenceName: [{ text: "PurchaseOrder", value: 'PurchaseBill' }, { text: "PurchaseBill", value: 'PurchaseBill' }],
    Grade: [{ text: "合格品", value: 1 }, { text: "优质品", value: 2 }],
    IsPublish: [{ text: "需要", value: false }, { text: "不需要", value: true }],
    YesOrNo: [{ text: "是", value: true }, { text: "否", value: false }],
    IsEnable: [{text:"全部", value:""},{ text: "有效", value: 1 }, { text: "无效", value: 0 }],
    SysFunctionType : [{ text: "全部", value: "" }, { text: "功能分组", value: "1" }, { text: "页面功能", value: "2" }, { text: "ACTION功能", value: "3" }],
    SqlDbType : [{ text: "varchar", value: "varchar" }, { text: "nvarchar", value: "nvarchar" }, { text: "int", value: "int" }, { text: "bit", value: "bit" }, { text: "datetime", value: "datetime" }],
    BusObjType: [{ text: "表", value: "1" }, { text: "视图", value: "2" }, { text: "存储过程", value: "3" }],
    BusObjMetaRegion: [{ text: "元数据库", value: "0" }, { text: "业务库", value: "1" }],
    ActionType: [{ text: "功能分组", value: "1" }, { text: "页面功能", value: "2" }, { text: "ACTION执行", value: "3" }, { text: "附属ACTION", value: "4" }],
    MoneyLimitType: [{ text: "客户", value: "0" }, { text: "分公司", value: "1" }, { text: "项目组", value: "2" }, { text: "工程", value: "3" }],
    IsState: [{ text: "全部", value: "" }, { text: "已审核", value: 1 }, { text: "未审核", value: 0 }],
    ExpenseData: [{ text: "经营费用", value: 1 }, { text: "管理费用", value: 2 }, { text: "财务费用", value: 3 }],
    DBPublishState: [{ text: "待发布", value: 0 }, { text: "正在发布", value: 1 }, { text: "已发布", value: 2 }, { text: "发布异常", value: 3 }],
    MenuOpenType: [{ text: "不打开", value: "NONE" }, { text: "新窗口", value: "NEW" }, { text: "当前窗口", value: "CUR" }, { text: "新标签", value: "TAB" }, { text: "弹出", value: "WIN" }],
    MenuType: [{ text: "正常", value: 1 }, { text: "快捷", value: 2 }, { text: "隐藏", value: 99 }]
};

if (window.GM == undefined)
    window.GM = {};
GM.Enum = Enum;