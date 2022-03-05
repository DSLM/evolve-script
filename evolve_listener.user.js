// ==UserScript==
// @name         数据监听
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @downloadURL  https://github.com/DSLM/evolve-script/raw/master/evolve_listener.user.js
// @author       DSLM
// @match        https://likexia.gitee.io/evolve/
// @match        https://pmotschmann.github.io/Evolve/
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// ==/UserScript==


(function($) {
    'use strict';

    var LM_times = 0
    var LM;

    var currStytle = {};

    var evalList = {default:{name:"默认求值", desc:"输入js代码求值", func:(str) => {try{return eval(str);}catch(e){return e;}}},
                    mainScriptCur:{name:"脚本设置当前值", desc:"需搭配修改版脚本", func:(str) => {try{return window.currentScriptSetting[str];}catch(e){return e;}}}
                };
    var dataMap = {note:0, type:1, eval:2};

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

    LM = window.setInterval(listenerMain, 250);

    function listenerMain()
    {
        LM_times = LM_times + 1;
        //判断是否需要初始化
        if(LM_times > 500)
        {
            var LM_temp = LM
            LM_times = 0;
            LM = window.setInterval(listenerMain, 250);
            clearInterval(LM_temp)
            return;
        }

        //未完全加载
        if(evolve.global == undefined) return;


        let listenerList = JSON.parse(localStorage.getItem("listenerList"));
        if(listenerList == null)
        {
            listenerList = [];
        }

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
        let listenerButton = $("#listenerButton");
        let listenerSave = $("#listenerSave");
        let listenerAdd = $("#listenerAdd");
        let listenerTable = $("#listenerTable");
        let listenerTableBody = $("#listenerTableBody");

        if(smallListenerTitle.length === 0)
        {
            smallListenerTitle = $("<div id='smallListenerTitle' class='has-text-caution' onclick='(function (){$(\"#titleListWindow\").children().removeClass(\"has-text-warning\");if($(\"#listenerContent\").css(\"display\") == \"none\"){$(\".sideContentWindow\").hide();$(\"#listenerContent\").show();$(\"#smallListenerTitle\").addClass(\"has-text-warning\");}else{$(\"#listenerContent\").hide();}})()'>监听</div>");
            listenerContent = $("<div id='listenerContent' class='vscroll sideContentWindow' style='height: 100%; display: none;'><div id='longListenerTitle' class='has-text-caution'>数据监听</div></div>");
            listenerButton = $('<div id="listenerButton" style="float: top; display:flex; flex-direction: row; justify-content: flex-start; align-items: center;"></div>');
            listenerSave = $('<button id="listenerSave" class="button">保存监听项目</button>');
            listenerAdd = $('<button id="listenerAdd" class="button">添加</button>');
            listenerTable = $(`<table><thead class="has-text-plain"><tr><th>备注</th><th>类型</th><th>数据</th><th>结果</th><th>删除</th></tr></thead><tbody id="listenerTableBody" class="ui-sortable"></tbody></table>`);

            listenerSave.click(saveListenerList);
            listenerAdd.click(function(){addNewListener({note:"", type:"default", eval:""})});

            listenerButton.append(listenerSave);
            listenerButton.append(listenerAdd);

            listenerContent.append(listenerButton);
            listenerContent.append(listenerTable);

            sideWindow.prepend(listenerContent);
            $("#titleListWindow").append(smallListenerTitle);

            listenerTableBody = $("#listenerTableBody");

            for (let i = 0; i < listenerList.length; i++)
            {
                addNewListener(listenerList[i]);
            }

            listenerTableBody.sortable({
                items: "tr:not(.unsortable)",
                helper: sorterHelper,
            });

        }

        let bodyStytle = document.body.currentStyle ? document.body.currentStyle : window.getComputedStyle(document.body, null);
        if(bodyStytle.color != currStytle.color)
        {
            currStytle.color = bodyStytle.color;
            let styles = $(`<style type='text/css' id='listenerCSS'>
            .has-text-plain th {
                color: ${bodyStytle["color"]};
                font-weight: ${bodyStytle["font-weight"]};
                font-size: ${bodyStytle["font-size"]};
                padding: 0.5em 0.75em;
            }
            #listenerTableBody td {
                padding: 0.5em 0.75em;
            }
            </style>`);
            if($("#listenerCSS"))
            {
                $("#listenerCSS").remove();
            }
            $("head").append(styles);
        }

        //监听
        listenThem();
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

    function listenThem()
    {
        $("#listenerTableBody").children().each(function(index, value) {
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

    function saveListenerList()
    {
        let listenerList = [];
        $("#listenerTableBody").children().each(function(index, value) {
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
        let listenerTableBody = $("#listenerTableBody");
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

        listenerTableBody.append(tempTR);
        tempTR.find(".typeSelect").val(values["type"]);
    }
})(jQuery);
