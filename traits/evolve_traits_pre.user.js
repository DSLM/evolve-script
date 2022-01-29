// ==UserScript==
// @name         自动增删特质
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  try to take over the world!
// @downloadURL  https://github.com/DSLM/evolve-script/raw/master/traits/evolve_traits.user.js
// @author       DSLM
// @match        https://likexia.gitee.io/evolve/
// @match        https://pmotschmann.github.io/Evolve/
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// ==/UserScript==

(function($) {
    'use strict';

    var TR_times = 0
    var TR;

    var removeTr = [], addTr = [];
    removeTr = JSON.parse(localStorage.getItem("removeTr"));
    if(removeTr == null)
    {
        removeTr = [];
    }
    addTr = JSON.parse(localStorage.getItem("addTr"));
    if(addTr == null)
    {
        addTr = [];
    }

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


    //初始化
    TR = window.setInterval(triatAuto, 5000);

    function triatAuto()
    {
        TR_times = TR_times + 1;
        //判断是否需要初始化
        if(TR_times > 500)
        {
            var TR_temp = TR
            TR_times = 0;
            TR = window.setInterval(triatAuto, 5000);
            clearInterval(TR_temp)
            return;
        }

        //共用窗口
        let sideWindow = $("#sideWindow");
        if(sideWindow.length === 0)
        {
            sideWindow = $("<div id='sideWindow' style='position: absolute; top: 20%; height: 60%; right: 0px; display:flex; flex-direction: row; justify-content: flex-end; align-items: flex-end;'><div id='titleListWindow' style='display:flex; flex-direction: column; justify-content: flex-end; align-items: flex-end;'></div></div>");
            $("body").append(sideWindow);
        }

        //独有窗口
        let smallTraitTitle = $("#smallTraitTitle");
        let traitContent = $("#traitContent");
        let traitAdd = $("#traitAdd");
        let traitRemove = $("#traitRemove");
        let traitButton = $("#traitButton");
        let traitSave = $("#traitSave");

        if(smallTraitTitle.length === 0)
        {
            smallTraitTitle = $("<div id='smallTraitTitle' class='has-text-caution' onclick='(function (){$(\"#titleListWindow\").children().removeClass(\"has-text-warning\");if($(\"#traitContent\").css(\"display\") == \"none\"){$(\".sideContentWindow\").hide();$(\"#traitContent\").show();$(\"#smallTraitTitle\").addClass(\"has-text-warning\");}else{$(\"#traitContent\").hide();}})()'>特质</div>");
            traitContent = $("<div id='traitContent' class='vscroll sideContentWindow' style='height: 100%; display: none;'><div id='longTraitTitle' class='has-text-caution'>自动增删特质</div></div>");
            traitAdd = $("<div id='traitAdd' style='float: right;'></div>");
            traitRemove = $("<div id='traitRemove' style='float: right;'></div>");
            traitButton = $('<div id="traitButton" style="float: top;"></div>');
            traitSave = $('<button id="traitSave" class="button">保存特质设置</button>');

            traitSave.click(saveTraitList);

            traitButton.append(traitSave);

            traitContent.append(traitButton);
            traitContent.append(traitRemove);
            traitContent.append(traitAdd);

            Object.keys(traits).sort().forEach(function (trait){
                if (traits[trait].type === 'major' || traits[trait].type === 'genus'){
                    let color = (traits[trait].val >= 0) ? "has-text-success" : "has-text-danger";
                    let thePanel = (traits[trait].val >= 0) ? traitAdd : traitRemove;
                    let theList = (traits[trait].val >= 0) ? addTr : removeTr;
                    thePanel.append(`<div class="${color}" title="${traits[trait].desc()}"><input id="checkbox_${trait}" type="checkbox" value="${trait}" ${theList.includes(trait)?'checked="true"':''}/>${traits[trait].name()}<div>`);
                }
            });

            sideWindow.prepend(traitContent);
            $("#titleListWindow").append(smallTraitTitle);
        }

        //软泥怪不运作
        if(evolve.global.race.species == "sludge")
        {
            return;
        }
        //无法增删
        if(evolve.global.tech.genesis < 5)
            return;
        if(evolve.global.genes.mutation < 3)
            return;

        //删的特质
        removeTr.forEach(function(element) {
            if(document.querySelector(".remove" + element) != null)
            {
                document.querySelector(".remove" + element).click();
            }
        });

        //加的特质
        addTr.forEach(function(element) {
            if(document.querySelector(".add" + element) != null && !removeTr.includes(element))
            {
                document.querySelector(".add" + element).click();
            }
        });
    }

    function saveTraitList()
    {
        addTr = [];
        $("#traitAdd").find("input:checked:checked").each(function(index,ele){
            addTr.push(ele.value)
        })
        localStorage.setItem("addTr", JSON.stringify(addTr));
        removeTr = [];
        $("#traitRemove").find("input:checked:checked").each(function(index,ele){
            removeTr.push(ele.value)
        })
        localStorage.setItem("removeTr", JSON.stringify(removeTr));
    }



    function loc(key, variables)
    {
        return function(){return evolve.loc(key, variables)};
    }

    //此处插入数据
 })(jQuery);
