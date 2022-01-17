// ==UserScript==
// @name         自动智械造船配置
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  try to take over the world!
// @downloadURL  https://github.com/DSLM/evolve-script/raw/master/evolve_truePathShip.user.js
// @author       DSLM
// @match        https://likexia.gitee.io/evolve/
// @match        https://pmotschmann.github.io/Evolve/
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// ==/UserScript==

// TODO: 导入导出配置；压制满了不造

(function($) {
    'use strict';

    var SA_times = 0
    var SA;

    var currStytle = {};
    var inputName = ["location", "class", "power", "weapon", "armor", "engine", "sensor", "count"];
    var partsName = ["class", "power", "weapon", "armor", "engine", "sensor"];
    var shipPartsName = {"class" : ["corvette", "frigate", "destroyer", "cruiser", "battlecruiser", "dreadnought"],
    "power" : ["solar", "diesel", "fission", "fusion", "elerium"],
    "weapon" : ["railgun", "laser", "p_laser", "plasma", "phaser", "disruptor"],
    "armor" : ["steel", "alloy", "neutronium"],
    "engine" : ["ion", "tie", "pulse", "photon", "vacuum"],
    "sensor" : ["visual", "radar", "lidar", "quantum"]};
    //let a = [];Object.keys(evolve.actions.space).forEach(function(location){if (evolve.actions.space[location].info.syndicate() || location === 'spc_dwarf'){a.push(location);}})
    var shipLocations = ['spc_moon', 'spc_red', 'spc_gas', 'spc_gas_moon', 'spc_belt', 'spc_dwarf', 'spc_titan', 'spc_enceladus', 'spc_triton', 'spc_kuiper', 'spc_eris'];

    SA = window.setInterval(shipAuto, 1001);

    function shipAuto()
    {
        SA_times = SA_times + 1;
        //判断是否需要初始化
        if(SA_times > 500)
        {
            var SA_temp = SA
            SA_times = 0;
            SA = window.setInterval(shipAuto, 1001);
            clearInterval(SA_temp)
            return;
        }

        //未完全加载
        if(evolve.global == undefined) return;


        let buildList = JSON.parse(localStorage.getItem("shipBuildList"));
        if(buildList == null)
        {
            buildList = [{}];
        }

        //共用窗口
        let sideWindow = $("#sideWindow");
        if(sideWindow.length === 0)
        {
            sideWindow = $("<div id='sideWindow' style='position: absolute; top: 20%; height: 60%; right: 0px; display:flex; flex-direction: row; justify-content: flex-end; align-items: flex-end;'><div id='titleListWindow' style='display:flex; flex-direction: column; justify-content: flex-end; align-items: flex-end;'></div></div>");
            $("body").append(sideWindow);
        }

        //独有窗口
        let smallShipTitle = $("#smallShipTitle");
        let shipContent = $("#shipContent");
        let shipButton = $("#shipButton");
        let shipSave = $("#shipSave");
        let shipAdd = $("#shipAdd");
        let shipTotalStatus = $("#shipTotalStatus");
        let shipTable = $("#shipTable");
        let shipTableBody = $("#shipTableBody");

        if(smallShipTitle.length === 0)
        {
            smallShipTitle = $("<div id='smallShipTitle' class='resource alt has-text-caution' onclick='(function (){if($(\"#shipContent\").css(\"display\") == \"none\"){$(\".sideContentWindow\").hide();$(\"#shipContent\").show();}else{$(\"#shipContent\").hide();}})()'>舰船</div>");
            shipContent = $("<div id='shipContent' class='resource alt vscroll sideContentWindow' style='height: 100%; display: none;'><div id='longShipTitle' class='has-text-caution'>智械黎明舰船设置</div></div>");
            shipButton = $('<div id="shipButton" style="float: top; display:flex; flex-direction: row; justify-content: flex-start; align-items: center;"></div>');
            shipSave = $('<button id="shipSave" class="button">保存舰船设置</button>');
            shipAdd = $('<button id="shipAdd" class="button">添加</button>');
            shipTotalStatus = $('<div id="shipTotalStatus"></div>');
            shipTable = $(`<table><thead class="has-text-plain"><tr><th>目的地</th><th>${evolve.loc("outer_shipyard_class")}</th><th>${evolve.loc("outer_shipyard_power")}</th><th>${evolve.loc("outer_shipyard_weapon")}</th><th>${evolve.loc("outer_shipyard_armor")}</th><th>${evolve.loc("outer_shipyard_engine")}</th><th>${evolve.loc("outer_shipyard_sensor")}</th><th>数量</th><th>状态</th><th>删除</th></tr></thead><tbody id="shipTableBody" class="ui-sortable"></tbody></table>`);

            shipSave.click(saveShipList);
            shipAdd.click(function(){addShipList({"location":"spc_moon","class":"corvette","power":"solar","weapon":"railgun","armor":"steel","engine":"ion","sensor":"visual","count":"0"})});

            shipButton.append(shipSave);
            shipButton.append(shipAdd);
            shipButton.append(shipTotalStatus);

            shipContent.append(shipButton);
            shipContent.append(shipTable);

            sideWindow.prepend(shipContent);
            $("#titleListWindow").append(smallShipTitle);

            shipTableBody = $("#shipTableBody");

            for (let i = 0; i < buildList.length; i++)
            {
                addShipList(buildList[i]);
            }

            shipTableBody.sortable({
                items: "tr:not(.unsortable)",
                helper: sorterHelper,
            });

        }

        let bodyStytle = document.body.currentStyle ? document.body.currentStyle : window.getComputedStyle(document.body, null);
        if(bodyStytle.color != currStytle.color)
        {
            currStytle.color = bodyStytle.color;
            let styles = $(`<style type='text/css' id='truePathShipCSS'>
            .has-text-plain th {
                color: ${bodyStytle["color"]};
                font-weight: ${bodyStytle["font-weight"]};
                font-size: ${bodyStytle["font-size"]};
                padding: 0.5em 0.75em;
            }
            #shipTableBody td {
                padding: 0.5em 0.75em;
            }
            </style>`);
            if($("#truePathShipCSS"))
            {
                $("#truePathShipCSS").remove();
            }
            $("head").append(styles);
        }


        //未完全加载
        try
        {
            if(evolve.global.space.shipyard.ships == undefined)
            {
                shipTotalStatus.html("<span class='has-text-danger'>船坞未出现</span>");
                return;
            }
        }
        catch(e)
        {
            shipTotalStatus.html("<span class='has-text-danger'>船坞未出现</span>");
            return;
        }

        let dropPra = $("#shipPlans");
        let shipLoc = $("#shipList");
        let shipList = evolve.global.space.shipyard.ships;

        for (let i = 0; i < buildList.length; i++)
        {
            let count = buildList[i]["count"];
            let yardShips = [];

            //检查配置解锁没
            if(!buildCheck(buildList[i]))
            {
                shipTableBody.children().eq(i).children().eq(inputName.length).html("<span class='has-text-danger'>舰船部件未解锁</span>");
                continue;
            }

            //查找同配置的船
            for (let j = 0; j < shipList.length; j++)
            {
                if(sameship(buildList[i], shipList[j]))
                {
                    if(buildList[i]["location"] == shipList[j]["location"])
                    {
                        count--;
                    }
                    else if("spc_dwarf" == shipList[j]["location"])
                    {
                        yardShips.push(j);
                    }
                }
            }

            //船够了下一个
            if(count <= 0)
            {
                shipTableBody.children().eq(i).children().eq(inputName.length).html("<span class='has-text-success'>已完成</span>");
                continue;
            }

            //看船坞够不够
            if(count <= yardShips.length)
            {
                for (let j = 0; j < count; j++)
                {
                    //转DOM对象模拟点击
                    shipLoc.find(".dropdown-menu-animation").eq(yardShips[j]).find("." + buildList[i]["location"]).get(0).click()
                }
            }
            else
            {
                for (let j = 0; j < yardShips.length; j++)
                {
                    //转DOM对象模拟点击
                    shipLoc.find(".dropdown-menu-animation").eq(yardShips[j]).find("." + buildList[i]["location"]).get(0).click()
                }

                switch(tryBuild(buildList[i]))
                {
                    case 0://成功构建，结束本轮
                        shipTotalStatus.text("");
                        return;
                        break;

                    case 1://部件没解锁，下一个
                        shipTableBody.children().eq(i).children().eq(inputName.length).html("<span class='has-text-danger'>舰船部件未解锁</span>");
                        continue;
                        break;

                    case 2://电不够，下一个
                        shipTableBody.children().eq(i).children().eq(inputName.length).html("<span class='has-text-danger'>舰船设计电力不足</span>");
                        continue;
                        break;
                }
            }
        }
        shipTotalStatus.text("");

        try
        {
            //关掉大脚本保留资源选项
            localStorage.setItem("keepResourcesForShips", "false");
        }
        catch(e)
        {
            //console.log(e);
        }
    }

    function sorterHelper(event, ui)
    {
        let clone = $(ui).clone();
        ui.children().each((index, element) => {
            let copyVal = $(element).children().val();
            if(copyVal.length > 0)
            {
                clone.children().eq(index).children().val($(element).children().val());
            }
        });
        clone.css('position','absolute');
        return clone.get(0);
    }

    function buildCheck(curOne)
    {
        for (let i = 0; i < partsName.length; i++)
        {
            if ($("#shipPlans").find("div.dropdown-menu-animation").eq(i).find("[data-val='" + curOne[partsName[i]] + "']").eq(0).css("display") == "none")
            {
                return false;
            }
        }
        if (!evolve.actions.space[curOne["location"]].info.syndicate())
        {
            return false;
        }
        return true;
    }

    function tryBuild(curOne)
    {
        for (let i = 0; i < partsName.length; i++)
        {
            if ($("#shipPlans").find("div.dropdown-menu-animation").eq(i).find("[data-val='" + curOne[partsName[i]] + "']").eq(0).css("display") != "none")
            {
                $("#shipPlans").find("div.dropdown-menu-animation").eq(i).find("[data-val='" + curOne[partsName[i]] + "']").eq(0).get(0).click()
            }
            else
            {
                //部件没有
                return 1;
            }
        }

        //电不够
        if(parseInt(document.querySelector("#shipPlans > div.stats > div:nth-child(3) > span:nth-child(2)").innerText) < 0)
        {
            return 2;
        }

        document.querySelector("#shipPlans > div.assemble > button").click();

        try
        {
            //打开大脚本保留资源选项
            localStorage.setItem("keepResourcesForShips", "true");
        }
        catch(e)
        {
            //console.log(e);
        }
        return 0;
    }

    function sameship(obj1, obj2)
    {

        for (let i = 0; i < partsName.length; i++)
        {
            if (obj1[partsName[i]] != obj2[partsName[i]])
            {
                return false;
            }
        }

        return true;
    }

    function saveShipList()
    {
        let buildList = [];
        $("#shipTableBody").children().each(function(index, value) {
            let line = {};
            for (let i = 0; i < inputName.length; i++)
            {
                line[inputName[i]] = $(value).children().eq(i).children().eq(0).val().trim();
            }
            buildList.push(line);
        });
        localStorage.setItem("shipBuildList", JSON.stringify(buildList));
    }

    function addShipList(values)
    {
        let shipTableBody = $("#shipTableBody");
        let tempTR = $(`<tr class="ui-sortable-handle"></tr>`);

        //目的地
        let tempTD = $(`<td></td>`);
        let tempSelect = $(`<select class="location"></select>`);
        for (let value of shipLocations)
        {
            tempSelect.append($(`<option value="${value}">${(typeof evolve.actions.space[value].info.name === 'string') ? evolve.actions.space[value].info.name : evolve.actions.space[value].info.name()}</option>`));
        }
        tempSelect.val(values["location"]);
        tempTD.append(tempSelect);
        tempTR.append(tempTD);

        //配置
        for (let key of Object.keys(shipPartsName))
        {
            let tempTD = $(`<td></td>`);
            let tempSelect = $(`<select class="key"></select>`);
            for (let value of shipPartsName[key])
            {
                tempSelect.append($(`<option value="${value}">${evolve.loc("outer_shipyard_" + key + "_" + value)}</option>`));
            }
            tempSelect.val(values[key]);
            tempTD.append(tempSelect);
            tempTR.append(tempTD);
        }

        //数量
        tempTD = $(`<td></td>`);
        let tempInput = $(`<input class="count" type="text" pattern="[0-9]" style="width: 100px;" value="${values['count']}">`);
        tempInput.on("change", function() {
            tempInput.val($.trim(tempInput.val()).replace(/\b(0+)/gi,""));
        });
        tempTD.append(tempInput);
        tempTR.append(tempTD);

        //状态
        tempTD = $(`<td></td>`);
        tempTR.append(tempTD);

        //删除
        tempTD = $(`<td></td>`);
        let tempButton = $(`<button id="shipHide" class="button">删除</button>`);
        tempButton.click(function () {
            var pare = $(this).parent().parent();
            pare.remove();
        });
        tempTD.append(tempButton);
        tempTR.append(tempTD);

        shipTableBody.append(tempTR);
    }

})(jQuery);
