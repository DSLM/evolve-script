// ==UserScript==
// @name         数据监听
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  try to take over the world!
// @downloadURL  https://github.com/DSLM/evolve-script/raw/master/evolve_listener.user.js
// @author       DSLM
// @match        https://g8hh.github.io/evolve/
// @match        https://pmotschmann.github.io/Evolve/
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// ==/UserScript==


(function($) {
    'use strict';

    var LM_times = 0;
    var LM;

    var currStytle = {};

    var evalList = {default:{name:"默认求值", desc:"输入js代码求值", func:(str) => {try{return eval(str);}catch(e){return e;}}},
                    mainScriptCur:{name:"脚本设置当前值", desc:"需搭配修改版脚本", func:(str) => {try{return window.currentScriptSetting[str];}catch(e){return e;}}}
                };
    var dataMap = {note:0, type:1, eval:2};
    var nowOverrides = [];

    //手动CSS颜色
    let cssData = {
        dark:{background_color:"#1f2424", alt_color:"#0f1414", primary_border:"#ccc", primary_color:"#fff"},
        light:{background_color:"#fff", alt_color:"#ddd", primary_border:"#000", primary_color:"#000"},
        night:{background_color:"#000", alt_color:"#1b1b1b", primary_border:"#ccc", primary_color:"#fff"},
        darkNight:{background_color:"#000", alt_color:"#1b1b1b", primary_border:"#ccc", primary_color:"#b8b8b8"},
        redgreen:{background_color:"#000", alt_color:"#1b1b1b", primary_border:"#ccc", primary_color:"#fff"},
        gruvboxLight:{background_color:"#fbf1c7", alt_color:"#f9f5d7", primary_border:"#3c3836", primary_color:"#3c3836"},
        gruvboxDark:{background_color:"#282828", alt_color:"#1d2021", primary_border:"#3c3836", primary_color:"#ebdbb2"},
        orangeSoda:{background_color:"#131516", alt_color:"#292929", primary_border:"#313638", primary_color:"#EBDBB2"}
    };
    //全局CSS
    const padTB = "0.5em";
    const padLR = "0.75em";
    let styleLines = `#sideWindow>div:not(#titleListWindow) {padding: ${padTB} ${padLR};} #sideWindow>div>div.has-text-caution.has-text-warning{background-color:#7957d5;color:#fff !important;}`;
    Object.keys(cssData).forEach((theme) => {
        styleLines += `html.${theme} #sideWindow>div:not(#titleListWindow) {background-color:${cssData[theme].alt_color}; border: ${cssData[theme].primary_border} solid 1px;}`;
        styleLines += `html.${theme} #titleListWindow>div {background-color:${cssData[theme].alt_color};}`;

    });
    let styles = $(`<style type='text/css' id='sideWindowCSS'>${styleLines}</style>`);
    if($("#sideWindowCSS"))
    {
        $("#sideWindowCSS").remove();
    }
    $("head").append(styles);

    //各种统计的的CSS
    let bodyStytle = document.body.currentStyle ? document.body.currentStyle : window.getComputedStyle(document.body, null);

    let listenerColor = "";
    Object.keys(cssData).forEach((theme) => {
        //表格表头的CSS
        listenerColor += `html.${theme} .has-text-plain th {
            color: ${cssData[theme].primary_color};
            font-weight: ${bodyStytle["font-weight"]};
            font-size: ${bodyStytle["font-size"]};
            padding: 0.5em 0.75em;
        }`;
    });
    styles = $(`<style type='text/css' id='listenerCSS'>
    ${listenerColor}
    #listenerWindow>div>div.has-text-advanced.has-text-success {
        background-color:#7957d5;
        color:#fff !important;
    }
    </style>`);
    if($("#listenerCSS"))
    {
        $("#listenerCSS").remove();
    }
    $("head").append(styles);

    LM = window.setInterval(listenerMainFunc, 250);

    function listenerMainFunc()
    {
        LM_times = LM_times + 1;
        //判断是否需要初始化
        if(LM_times > 500)
        {
            var LM_temp = LM
            LM_times = 0;
            LM = window.setInterval(listenerMainFunc, 250);
            clearInterval(LM_temp)
            return;
        }

        //未完全加载
        if(evolve.global == undefined) return;

        //共用窗口
        let sideWindow = $("#sideWindow");
        if(sideWindow.length === 0)
        {
            sideWindow = $("<div id='sideWindow' style='position: absolute; top: 20%; height: 60%; right: 0px; display:flex; flex-direction: row; justify-content: flex-end; align-items: flex-end;'><div id='titleListWindow' style='display:flex; flex-direction: column; justify-content: flex-end; align-items: flex-end;'></div></div>");
            $("body").append(sideWindow);
        }

        //独有窗口
        let smallListenerTitle = $("#smallListenerTitle");
        let listenerContent = $("#listenerContent");
        let listenerWindow = $("#listenerWindow");

        if(smallListenerTitle.length === 0)
        {
            smallListenerTitle = $("<div id='smallListenerTitle' class='has-text-caution' onclick='(function (){$(\"#titleListWindow\").children().removeClass(\"has-text-warning\");if($(\"#listenerContent\").css(\"display\") == \"none\"){$(\".sideContentWindow\").hide();$(\"#listenerContent\").show();$(\"#smallListenerTitle\").addClass(\"has-text-warning\");}else{$(\"#listenerContent\").hide();}})()'>监听</div>");
            listenerContent = $(`<div id='listenerContent' class='sideContentWindow' style='height: 100%; display: none;'><div id='listenerFlexContent' style='height: 100%;display:flex;flex-direction: column;justify-content: space-between;'><div class='has-text-caution' style='text-align: center; padding-bottom: ${padTB};'>数据监听</div></div></div>`);
            listenerWindow = $(`<div id='listenerWindow' style='height: 0; display:flex; flex-direction: row; justify-content: flex-end; align-items: flex-end; flex-grow: 1;'><div id='listenerTitleListWindow' style='height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding-left: ${padLR};' align='right'></div></div>`);

            listenerContent.children().eq(0).append(listenerWindow);

            sideWindow.prepend(listenerContent);
            $("#titleListWindow").append(smallListenerTitle);
        }

        mainListener();
        overrideListener();
    }

    function overrideListener()
    {
        let settings = JSON.parse(localStorage.getItem("settings"));
        if(settings == null)
        {
            return;
        }

        let smallOverrideListenerTitle = $("#smallOverrideListenerTitle");
        let overrideListenerButton = $("#overrideListenerButton");
        let overrideListenerTable = $("#overrideListenerTable");
        let overrideListenerTableBody = $("#overrideListenerTableBody");

        //还没有
        if($("#smallOverrideListenerTitle").length == 0)
        {
            let smallOverrideListenerTitle = $("<div id='smallOverrideListenerTitle' class='has-text-advanced' onclick='(function (){$(\"#listenerTitleListWindow\").children().removeClass(\"has-text-success\");if($(\"#overrideListenerContent\").css(\"display\") == \"none\"){$(\".sideListenerWindow\").hide();$(\"#overrideListenerContent\").show();$(\"#smallOverrideListenerTitle\").addClass(\"has-text-success\");}else{$(\"#overrideListenerContent\").hide();}})()'>脚本高级设置</div>");
            let overrideListenerContent = $("<div id='overrideListenerContent' class='vscroll sideListenerWindow' style='height: 100%; display: none;'></div>");

            overrideListenerButton = $('<div id="overrideListenerButton" style="float: top; display:flex; flex-direction: row; justify-content: flex-start; align-items: center;"></div>');
            overrideListenerTable = $(`<table><thead class="has-text-plain"><tr><th>内部名</th><th>定位</th></tr></thead><tbody id="overrideListenerTableBody"></tbody></table>`);

            overrideListenerContent.append(overrideListenerTable);

            $("#listenerWindow").prepend(overrideListenerContent);
            $("#listenerTitleListWindow").append(smallOverrideListenerTitle);

            overrideListenerTableBody = $("#overrideListenerTableBody");
        }

        //列表是否更新
        let overrideListenerList = settings.overrides;
        if(nowOverrides.toString() == Object.keys(overrideListenerList).toString())
        {
            return;
        }
        else
        {
            nowOverrides = Object.keys(overrideListenerList);
        }

        //监听
        $("#overrideListenerTableBody button").unbind();
        overrideListenerTableBody.empty();
        Object.keys(overrideListenerList).forEach((item) => {
            let tempTR = $(`<tr><td>${item}</td></tr>`);
            let tempTD, tempInput, tempSelect, tempButton;

            tempTD = $(`<td></td>`);
            tempButton = $(`<button id="listenerHide" class="button">定位</button>`);
            tempButton.click(function () {
                for (var i = 0; i < $(`#script_settings`).children().length; i++)
                {
                    let tab = $(`#script_settings>div:nth-child(${i})>div:nth-child(2)`);
                    let target = $(`#script_settings>div:nth-child(${i})>div:nth-child(2) .script_${item}`);
                    if(target.length > 0 && tab.css("display") != "block")
                    {
                        $(`#script_settings>div:nth-child(${i})>h3:nth-child(1)`).click();
                        break;
                    }
                    tab = null;
                    target = null;
                }
                let results = document.getElementsByClassName(`script_${item}`);
                let result = results[results.length - 1];

                document.querySelector("#\\31 7-label").click();
                $("#mainColumn > div > div > section > div").hide();
                $("#settings").show();
                result.scrollIntoView();
                highlight(3, result, item);
                results = null;
                result = null;
            });
            tempTD.append(tempButton);
            tempTR.append(tempTD);
            overrideListenerTableBody.append(tempTR);
        });
    }

    function highlight(times, element, info)
    {
        let toolTip = $(`<div style="color:red; background-color:orange;">${info} 在这里</div>`);
        Popper.createPopper(element, toolTip[0], {
            placement: "right",
        });
        $("body").append(toolTip);
        let timer = setInterval(function(){
            toolTip.remove();
            toolTip = null;
            clearInterval(timer);
            return;
        },1000 * times);
    }

    function mainListener()
    {
        let smallMainListenerTitle = $("#smallMainListenerTitle");
        let mainListenerButton = $("#mainListenerButton");
        let mainListenerSave = $("#mainListenerSave");
        let mainListenerAdd = $("#mainListenerAdd");
        let mainListenerTable = $("#mainListenerTable");
        let mainListenerTableBody = $("#mainListenerTableBody");

        //还没有
        if($("#smallMainListenerTitle").length == 0)
        {
            let smallMainListenerTitle = $("<div id='smallMainListenerTitle' class='has-text-advanced' onclick='(function (){$(\"#listenerTitleListWindow\").children().removeClass(\"has-text-success\");if($(\"#mainListenerContent\").css(\"display\") == \"none\"){$(\".sideListenerWindow\").hide();$(\"#mainListenerContent\").show();$(\"#smallMainListenerTitle\").addClass(\"has-text-success\");}else{$(\"#mainListenerContent\").hide();}})()'>数据监听</div>");
            let mainListenerContent = $("<div id='mainListenerContent' class='vscroll sideListenerWindow' style='height: 100%; display: none;'></div>");

            mainListenerButton = $('<div id="mainListenerButton" style="float: top; display:flex; flex-direction: row; justify-content: flex-start; align-items: center;"></div>');
            mainListenerSave = $('<button id="mainListenerSave" class="button">保存监听项目</button>');
            mainListenerAdd = $('<button id="mainListenerAdd" class="button">添加</button>');
            mainListenerTable = $(`<table><thead class="has-text-plain"><tr><th>备注</th><th>类型</th><th>数据</th><th>结果</th><th>删除</th></tr></thead><tbody id="mainListenerTableBody" class="ui-sortable"></tbody></table>`);

            mainListenerSave.click(saveListenerList);
            mainListenerAdd.click(function(){addNewListener({note:"", type:"default", eval:""})});

            mainListenerButton.append(mainListenerSave);
            mainListenerButton.append(mainListenerAdd);

            mainListenerContent.append(mainListenerButton);
            mainListenerContent.append(mainListenerTable);

            $("#listenerWindow").prepend(mainListenerContent);
            $("#listenerTitleListWindow").append(smallMainListenerTitle);


            let mainListenerList = JSON.parse(localStorage.getItem("listenerList"));
            if(mainListenerList == null)
            {
                mainListenerList = [];
            }

            mainListenerTableBody = $("#mainListenerTableBody");

            for (let i = 0; i < mainListenerList.length; i++)
            {
                addNewListener(mainListenerList[i]);
            }

            mainListenerTableBody.sortable({
                items: "tr:not(.unsortable)",
                helper: sorterHelper,
            });
        }

        //监听
        $("#mainListenerTableBody").children().each(function(index, value) {
            let line = {};
            let resultIndex = 3;
            for (let i of Object.keys(dataMap))
            {
                if($(value).children().eq(dataMap[i]).children().eq(0).data("value"))
                {
                    line[i] = $(value).children().eq(dataMap[i]).children().eq(0).data("value");
                }
                else
                {
                    line[i] = $(value).children().eq(dataMap[i]).children().eq(0).val();
                }
            }
            if(evalList[line.type])
                $(value).children().eq(resultIndex).html(line.note + evalList[line.type].func(line.eval));
        });
    }

    function sorterHelper(event, ui)
    {
        let clone = $(ui).clone();
        ui.children().each((index, element) => {
            if($(element).children().data("value"))
            {
                let copyVal = $(element).children().data("value");
                if(copyVal != undefined && copyVal.length > 0)
                {
                    clone.children().eq(index).children().val(copyVal);
                }
            }
            else
            {
                let copyVal = $(element).children().val();
                if(copyVal != undefined && copyVal.length > 0)
                {
                    clone.children().eq(index).children().val(copyVal);
                }
            }
        });
        clone.css('position','absolute');
        return clone.get(0);
    }

    function saveListenerList()
    {
        let listenerList = [];
        $("#mainListenerTableBody").children().each(function(index, value) {
            let line = {};
            for (let i of Object.keys(dataMap))
            {
                if($(value).children().eq(dataMap[i]).children().eq(0).data("value"))
                {
                    line[i] = $(value).children().eq(dataMap[i]).children().eq(0).data("value").trim();
                }
                else
                {
                    line[i] = $(value).children().eq(dataMap[i]).children().eq(0).val().trim();
                }
                line[i] = `${line[i]}`;
            }
            listenerList.push(line);
        });
        localStorage.setItem("listenerList", JSON.stringify(listenerList));
    }

    function addNewListener(values)
    {
        let mainListenerTableBody = $("#mainListenerTableBody");
        let tempTR = $(`<tr class="ui-sortable-handle"></tr>`);
        let tempTD, tempInput, tempSelect, tempButton;

        //备注
        tempTD = $(`<td></td>`);
        tempInput = $(`<input type="text" style="width: 100px;" value="${values['note']}">`);
        tempTD.append(tempInput);
        tempTR.append(tempTD);

        //类型
        tempTD = $(`<td></td>`);
        tempSelect = $(`<select class="typeSelect"></select>`);
        for (let key of Object.keys(evalList))
        {
            tempSelect.append($(`<option value="${key}" title="${evalList[key].desc}">${evalList[key].name}</option>`));
        }
        tempTD.append(tempSelect);
        tempTR.append(tempTD);

        //公式
        tempTD = $(`<td></td>`);
        tempInput = $(`<input type="text" style="width: 100px;" value="${values["eval"].replaceAll('"', '&quot;')}">`);
        tempTD.append(tempInput);
        tempTR.append(tempTD);

        //状态
        tempTD = $(`<td></td>`);
        tempTR.append(tempTD);

        //删除
        tempTD = $(`<td></td>`);
        tempButton = $(`<button id="listenerHide" class="button">删除</button>`);
        tempButton.click(function () {
            var pare = $(this).parent().parent();
            pare.remove();
        });
        tempTD.append(tempButton);
        tempTR.append(tempTD);

        mainListenerTableBody.append(tempTR);
        tempTR.find(".typeSelect").val(values["type"]);
    }
})(jQuery);
