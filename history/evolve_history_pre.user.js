// ==UserScript==
// @name         历史数据统计
// @namespace    http://tampermonkey.net/
// @version      1.4.4a
// @description  try to take over the world!
// @downloadURL  https://github.com/DSLM/evolve-script/raw/master/history/evolve_history.user.js
// @author       DSLM
// @match        https://likexia.gitee.io/evolve/
// @match        https://pmotschmann.github.io/Evolve/
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://unpkg.com/@popperjs/core@2.9.2/dist/umd/popper.min.js
// @require      https://d3js.org/d3.v7.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/dagre-d3/0.6.4/dagre-d3.min.js
// ==/UserScript==

(function() {
    'use strict';

    var histF_times = 0
    var histF;
    var HIST_RESET_LIMIT = 20
    var HIST_SPIRE_LIMIT = 200

    var spirePrepared = false;

    var UniLtoS = {'standard':'l', 'evil':'e', 'antimatter':'a', 'micro':'m', 'heavy':'h', 'magic':'mg'};
    var UniStoL = {};
    Object.keys(UniLtoS).forEach((lon) => {
        UniStoL[UniLtoS[lon]] = lon;
    });
    var starName = ['未获得', '无星', '白星', '铜星', '银星', '金星'];
    const AchiDivWid = 350, AchiDivCol = 3;
    const FeatDivWid = 150, FeatDivCol = 3;
    const PillDivWid = 140, PillDivCol = 3;
    const CrisDivWid = 140, CrisDivCol = 2;
    const PerkDivWid = 200, PerkDivCol = 2;

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
    let graphBackColor = "";
    Object.keys(cssData).forEach((theme) => {
        //流程图的的CSS
        graphBackColor += `html.${theme} #criGraph, html.${theme} #bloGraph {background-color:${cssData[theme].background_color};}`;
        graphBackColor += `html.${theme} g.node rect {fill:${cssData[theme].background_color};stroke: ${cssData[theme].primary_border};}`;
        graphBackColor += `html.${theme} g.edgePath path {fill:${cssData[theme].primary_border};stroke: ${cssData[theme].primary_border};stroke-width: 1.5px;}`;
        //表格交叉背景色的CSS
        graphBackColor += `html.${theme} #planList>tr:nth-child(odd), html.${theme} #outeList>tr:nth-child(odd) {background-color:${cssData[theme].background_color};}`;
    });

    styles = $(`<style type='text/css' id='graphCSS'>
    ${graphBackColor}
    #spirList > p {
        margin-top: 8px;
    }
    #histWindow>div>div.has-text-advanced.has-text-success {
        background-color:#7957d5;
        color:#fff !important;
    }
    </style>`);
    if($("#graphCSS"))
    {
        $("#graphCSS").remove();
    }
    $("head").append(styles);

    //初始化
    histF = window.setInterval(checkHist, 3000);

    function checkHist()
    {
        histF_times = histF_times + 1;
        //判断是否需要初始化
        if(histF_times > 500)
        {
            var temp = histF
            histF_times = 0;
            histF = window.setInterval(checkHist, 5000);
            clearInterval(temp)
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
        if($("#smallHistTitle").length === 0)
        {
            let smallHistTitle = $("<div id='smallHistTitle' class='has-text-caution' onclick='(function (){$(\"#titleListWindow\").children().removeClass(\"has-text-warning\");if($(\"#histContent\").css(\"display\") == \"none\"){$(\".sideContentWindow\").hide();$(\"#histContent\").show();$(\"#smallHistTitle\").addClass(\"has-text-warning\");}else{$(\"#histContent\").hide();}})()'>统计</div>");
            let histContent = $(`<div id='histContent' class='sideContentWindow' style='height: 100%; display: none;'><div id='histFlexContent' style='height: 100%;display:flex;flex-direction: column;justify-content: space-between;'><div class='has-text-caution' style='text-align: center; padding-bottom: ${padTB};'>数据统计</div></div></div>`);

            let histWindow = $(`<div id='histWindow' style='height: 100%; display:flex; flex-direction: row; justify-content: flex-end; align-items: flex-end; flex-grow: 1;'><div id='histTitleListWindow' style='height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding-left: ${padLR};' align='right'></div></div>`);

            histContent.children().eq(0).append(histWindow);

            sideWindow.prepend(histContent);
            $("#titleListWindow").append(smallHistTitle);
        }

        //未完全加载
        if(evolve.global == undefined) return;
        if(evolve.loc("feat_utopia_name") == undefined) return;

        achieveStat();
        featStat();
        crisprStat();
        bloodStat();
        perkStat();
        recordStat();
        spireStat();
        planetNameStat();
    }



    function planetNameStat()
    {
        //还没有
        if($("#smallPlanTitle").length == 0)
        {

            let smallPlanTitle = $("<div id='smallPlanTitle' class='has-text-advanced' onclick='(function (){$(\"#histTitleListWindow\").children().removeClass(\"has-text-success\");if($(\"#planContent\").css(\"display\") == \"none\"){$(\".sideHistWindow\").hide();$(\"#planContent\").show();$(\"#smallPlanTitle\").addClass(\"has-text-success\");}else{$(\"#planContent\").hide();}})()'>星球名称</div>");
            let planContent = $("<div id='planContent' class='sideHistWindow' style='height: inherit; display: none;'><div style='height: 100%; display:flex;'></div></div>");
            let planTotalStatus = $(`<div style='height: 100%; display:flex; flex-direction: column;'><div id='planFilter'></div><div id='planScroll' class='vscroll' style='flex-grow: 1;'><div id='planList' style='height: 0;'></div></div><div id='outeFilter'></div><div id='outeScroll' class='vscroll' style='flex-grow: 1;'><div id='outeList' style='height: 0;'></div></div></div>`)

            planContent.children().eq(0).append(planTotalStatus);

            smallPlanTitle.one("click", buildPlanetName);

            $("#histWindow").prepend(planContent);
            $("#histTitleListWindow").append(smallPlanTitle);

        }
    }

    function buildPlanetName()
    {
        $("#planFilter").empty();
        $("#planFilter").append($(`<div class='has-text-advanced'>太阳系星球名称对照表：</div>`));


        let planList = $(`#planList`);
        let outeList = $(`#outeList`);
        planList.empty();
        outeList.empty();

        let planet1Types = ["red", "hell", "gas", "gas_moon", "dwarf"];
        let planet2Types = ["titan", "enceladus", "triton", "eris"];

        let races = evolve.races;
        let raceTypes = {};
        delete races.protoplasm;
        if(Object.keys(evolve.races.custom).length == 0) delete races.custom;

        let th1 = $(`<tr class="has-text-warning" style="position: relative;"><td>种族</td><td>地球</td><td>火星</td><td>水星</td><td>木星</td><td>木卫三</td><td>谷神星</td></tr>`);
        planList.append(th1);
        let th2 = $(`<tr class="has-text-warning" style="position: relative;"><td>种群<span style="visibility:hidden;">0000</span></td><td>土卫六</td><td>土卫二</td><td>海卫一</td><td>阋神星</td></tr>`);
        outeList.append(th2);

        Object.keys(races).forEach((race) => {
            raceTypes[races[race].type] = races[race].type;
            let line = $(`<tr><td>${races[race].name}</td><td>${races[race].home}</td></tr>`)
            planet1Types.forEach((name) => {
                line.append($(`<td>${races[race].solar[name]}</td>`));
            });

            planList.append(line);
        });
        Object.keys(raceTypes).forEach((type) => {
            let line = $(`<tr><td>${evolve.loc(`genelab_genus_${type}`)}</td></tr>`)
            planet2Types.forEach((name) => {
                line.append($(`<td>${evolve.loc(`genus_${type}_solar_${name}`)}</td>`));
            });

            outeList.append(line);
        });

        $("#planScroll").on('scroll', function(){
            var scrollTop = $("#planScroll").scrollTop();
            // 当滚动距离大于0时设置top及相应的样式
            if (scrollTop > 0)
            {
                th1.css({
                    "top": scrollTop + 'px',
                    "marginTop": "-1px",
                    "padding": 0
                });
            }
            else
            {
            // 当滚动距离小于0时设置top及相应的样式
                th1.css({
                    "top": scrollTop + 'px',
                    "marginTop": "0",
                });
            }
        });
        $("#outeScroll").on('scroll', function(){
            var scrollTop = $("#outeScroll").scrollTop();
            // 当滚动距离大于0时设置top及相应的样式
            if (scrollTop > 0)
            {
                th2.css({
                    "top": scrollTop + 'px',
                    "marginTop": "-1px",
                    "padding": 0
                });
            }
            else
            {
            // 当滚动距离小于0时设置top及相应的样式
                th2.css({
                    "top": scrollTop + 'px',
                    "marginTop": "0",
                });
            }
        });
    }

    function recordStat()
    {
        //还没有
        if($("#smallRecoTitle").length == 0)
        {
            let historyData = JSON.parse(localStorage.getItem("historyData"));
            if(historyData == null)
            {
                historyData = [];
            }

            let backupString = LZString.decompressFromUTF16(localStorage.getItem('evolveBak'));
            if (backupString) {
                let oldGlobal = JSON.parse(backupString);
                let statsData = {race: oldGlobal.race.species, game_days_played: oldGlobal.stats.days};
                if (oldGlobal.stats.plasmid > 0) {
                    statsData.plasmid_earned = oldGlobal.stats.plasmid;
                }
                if (oldGlobal.stats.antiplasmid > 0) {
                    statsData.antiplasmid_earned = oldGlobal.stats.antiplasmid;
                }
                if (oldGlobal.stats.phage > 0) {
                    statsData.phage_earned = oldGlobal.stats.phage;
                }
                if (oldGlobal.stats.dark > 0) {
                    statsData.dark_earned = oldGlobal.stats.dark;
                }
                if (oldGlobal.stats.harmony > 0) {
                    statsData.harmony_earned = oldGlobal.stats.harmony;
                }
                if (oldGlobal.stats.blood > 0) {
                    statsData.blood_earned = oldGlobal.stats.blood;
                }
                if (oldGlobal.stats.artifact > 0) {
                    statsData.artifact_earned = oldGlobal.stats.artifact;
                }
                if (oldGlobal.stats.reset > 0) {
                    statsData.total_resets = oldGlobal.stats.reset;
                }

                if(historyData.length == 0 || (historyData.length > 0 && historyData[0].total_resets != statsData.total_resets)) historyData.unshift(statsData)
                if(historyData.length > HIST_RESET_LIMIT) historyData.pop()
                localStorage.setItem("historyData", JSON.stringify(historyData));
            }


            let smallRecoTitle = $("<div id='smallRecoTitle' class='has-text-advanced' onclick='(function (){$(\"#histTitleListWindow\").children().removeClass(\"has-text-success\");if($(\"#recoContent\").css(\"display\") == \"none\"){$(\".sideHistWindow\").hide();$(\"#recoContent\").show();$(\"#smallRecoTitle\").addClass(\"has-text-success\");}else{$(\"#recoContent\").hide();}})()'>历史记录</div>");
            let recoContent = $("<div id='recoContent' class='sideHistWindow' style='height: inherit; display: none;'><div style='height: 100%; display:flex;'></div></div>");
            let recoTotalStatus = $(`<div style='height: 100%; display:flex; flex-direction: column;'><div id='recoFilter'></div><div class='vscroll' style='flex-grow: 1;'><div id='recoList' style='height: 0;'></div></div></div>`)

            recoContent.children().eq(0).append(recoTotalStatus);

            smallRecoTitle.one("click", buildRecord);

            $("#histWindow").prepend(recoContent);
            $("#histTitleListWindow").append(smallRecoTitle);

        }
    }

    function buildRecord()
    {
        $("#recoFilter").empty();
        $("#recoFilter").append($(`<div class='has-text-advanced'>历史统计数据（保存${HIST_RESET_LIMIT}组数据）:</div>`));

        $("#recoList").empty();
        let historyData = JSON.parse(localStorage.getItem("historyData"));
        if(historyData == null)
        {
            historyData = [];
        }
        for(var i = 0; i < historyData.length; i++)
        {
            $("#recoList").append($(`<tr><td colspan="2" class="has-text-success">前${i+1}轮：</td></tr>`));
            for (let [label, value] of Object.entries(historyData[i])) {
                //威望物资
                if(label == "race")
                {
                    $("#recoList").append($(`<tr><td class="has-text-warning">种族：</td><td>${evolve.loc("race_" + value)}</td></tr>`));
                }
                else if(label.includes("_earned"))
                {
                    var calData = (i == 0) ? (evolve.global.stats[label.slice(0,-7)] - value) : (historyData[i-1][label] - value);
                    if(calData == 0) continue;
                    $("#recoList").append($(`<tr><td class="has-text-warning">${evolve.loc("achieve_stats_" + label)}</td><td>${calData}</td></tr>`));
                }
                else
                {
                    $("#recoList").append($(`<tr><td class="has-text-warning">${evolve.loc("achieve_stats_" + label)}</td><td>${value}</td></tr>`));
                }
            }
        }
    }

    function spireStat()
    {
        let spireTimeData;
        //还没有
        if($("#smallSpirTitle").length == 0)
        {
            spireTimeData = JSON.parse(localStorage.getItem("spireTimeData"));
            if(spireTimeData == null)
            {
                spireTimeData = {"now":-1, "record":new Array()};
            }

            let smallSpirTitle = $("<div id='smallSpirTitle' class='has-text-advanced' onclick='(function (){$(\"#histTitleListWindow\").children().removeClass(\"has-text-success\");if($(\"#spirContent\").css(\"display\") == \"none\"){$(\".sideHistWindow\").hide();$(\"#spirContent\").show();$(\"#smallSpirTitle\").addClass(\"has-text-success\");}else{$(\"#spirContent\").hide();}})()'>尖塔记录</div>");
            let spirContent = $("<div id='spirContent' class='sideHistWindow' style='height: inherit; display: none;'><div style='height: 100%; display:flex;'></div></div>");
            let spirTotalStatus = $(`<div style='height: 100%; display:flex; flex-direction: column;'><div id='spirFilter'></div><div class='vscroll' style='flex-grow: 1; margin-top: 8px;'><div id='spirList' style='height: 0;'></div></div></div>`)

            spirContent.children().eq(0).append(spirTotalStatus);

            $("#histWindow").prepend(spirContent);
            $("#histTitleListWindow").append(smallSpirTitle);

            $("#spirFilter").empty();
            $("#spirFilter").append($(`<div class='has-text-advanced'>地狱尖塔数据（保存${HIST_SPIRE_LIMIT}条数据）：</div>`));
            let spirList = $("#spirList");
            let nowRecord;
            for(var i = 0; i < spireTimeData["record"].length - 1; i++)
            {
                nowRecord = spireTimeData["record"][i]
                let color = nowRecord["effi"] < spireTimeData["record"][i + 1]["effi"] ? 'has-text-success' : 'has-text-danger';
                spirList.append($(`<p class=${color}>抵达 ${nowRecord["floor"]} 层，花费 ${nowRecord["day"]} 天，效率 ${nowRecord["effi"].toFixed(4)} 天/层，鲜血之石 ${nowRecord["stone"]} 个，效率 ${(nowRecord["effi"] / nowRecord["stone"]).toFixed(4)} 天/个</p>`));
            }
            if(spireTimeData["record"].length > 0)
            {
                nowRecord = spireTimeData["record"][spireTimeData["record"].length - 1]
                spirList.append($(`<p class='has-text-success'>抵达 ${nowRecord["floor"]} 层，花费 ${nowRecord["day"]} 天，效率 ${nowRecord["effi"].toFixed(4)} 天/层，鲜血之石 ${nowRecord["stone"]} 个，效率 ${(nowRecord["effi"] / nowRecord["stone"]).toFixed(4)} 天/个</p>`));
            }
        }

        if(evolve.global.portal == undefined || evolve.global.portal.spire == undefined) return;

        //刷新后初始化
        if(!spirePrepared && evolve.global.portal.spire.count)
        {
            spirePrepared = true;
            spireTimeData = JSON.parse(localStorage.getItem("spireTimeData"));
            if(spireTimeData == null)
            {
                spireTimeData = {"now":evolve.global.portal.spire.count, "record":new Array()};
            }
            spireTimeData["now"] = evolve.global.portal.spire.count;
            localStorage.setItem("spireTimeData", JSON.stringify(spireTimeData));
        }

        //通层
        spireTimeData = JSON.parse(localStorage.getItem("spireTimeData"));
        if(evolve.global.portal.spire.count != spireTimeData["now"])
        {
            spireTimeData["record"].unshift({"floor":evolve.global.portal.spire.count,"day":evolve.global.stats.days, "effi":evolve.global.stats.days/(evolve.global.portal.spire.count - 1), "stone":evolve.alevel()*((evolve.global.genes['blood'] >= 2)?2:1),});
            spireTimeData["now"] = evolve.global.portal.spire.count;
            if(spireTimeData["record"].length > HIST_SPIRE_LIMIT)
            {
                spireTimeData["record"].pop();
            }

            let nowRecord = spireTimeData["record"][0]
            if(spireTimeData["record"].length > 1)
            {
                let color = nowRecord["effi"] < spireTimeData["record"][1]["effi"] ? 'has-text-success' : 'has-text-danger';
                spirList.append($(`<p class=${color}>抵达 ${nowRecord["floor"]} 层，花费 ${nowRecord["day"]} 天，效率 ${nowRecord["effi"].toFixed(4)} 天/层，鲜血之石 ${nowRecord["stone"]} 个，效率 ${(nowRecord["effi"] / nowRecord["stone"]).toFixed(4)} 天/个</p>`));
            }
        }
        localStorage.setItem("spireTimeData", JSON.stringify(spireTimeData));
    }

    function achieveStat()
    {
        //独有窗口
        let smallAchiTitle = $("#smallAchiTitle");
        let achiContent = $("#achiContent");
        let achiTotalStatus = $("#achiTotalStatus");

        if(smallAchiTitle.length === 0)
        {
            smallAchiTitle = $("<div id='smallAchiTitle' class='has-text-advanced' onclick='(function (){$(\"#histTitleListWindow\").children().removeClass(\"has-text-success\");if($(\"#achiContent\").css(\"display\") == \"none\"){$(\".sideHistWindow\").hide();$(\"#achiContent\").show();$(\"#smallAchiTitle\").addClass(\"has-text-success\");}else{$(\"#achiContent\").hide();}})()'>成就</div>");
            achiContent = $("<div id='achiContent' class='sideHistWindow' style='height: inherit; display: none;'><div style='height: 100%; display:flex;'></div></div>");
            achiTotalStatus = $(`<div id='achiTotalStatus' style='padding-right: ${padLR};'></div>`);
            let achiShow = $(`<div style='width: ${AchiDivWid * AchiDivCol + 6}px; height: 100%; display:flex; flex-direction: column;'><div id='achiFilter'></div><div class='vscroll' style='flex-grow: 1;'><div id='achiList' style='height: 0;'></div></div></div>`);

            achiContent.children().eq(0).append(achiTotalStatus);
            achiContent.children().eq(0).append(achiShow);

            smallAchiTitle.one("click", buildAchieve);

            $("#histWindow").prepend(achiContent);
            $("#histTitleListWindow").append(smallAchiTitle);
        }
    }

    function buildAchieve()
    {
        //初始化
        let achiData = {total:{}, complete:{}};
        Object.keys(UniLtoS).forEach((uni) => {
            achiData.total[uni] = [];
            achiData.complete[uni] = {};
        });

        //上限
        Object.keys(achieve_list).forEach((cla) => {
            achieve_list[cla].forEach((ach) => {
                Object.keys(UniLtoS).forEach((uni) => {
                    if(uni == "standard" || !universeExclusives[ach] || universeExclusives[ach].includes(uni))
                    {
                        achiData.total[uni].push(ach);
                    }
                });
            });
        });

        //已有
        Object.keys(evolve.global.stats.achieve).forEach((ach) => {
            Object.keys(evolve.global.stats.achieve[ach]).forEach((uni) => {
                if(evolve.global.stats.achieve[ach][uni] > 0)
                {
                    achiData.complete[UniStoL[uni]][ach] = evolve.global.stats.achieve[ach][uni];
                }
            });
        });

        //总计
        $("#achiTotalStatus").empty();
        $("#achiTotalStatus").append($("<div class='has-text-advanced'>成就统计</div>"));
        Object.keys(UniLtoS).forEach((uni) => {
            let compe = Object.keys(achiData.complete[uni]).length;
            let total = achiData.total[uni].length;
            $("#achiTotalStatus").append(`<tr><td>${evolve.loc("universe_" + uni)}：</td><td><span style='visibility:hidden;'>${Array(4 - (compe +  '').length).join("0")}</span>${compe} / ${total}<span style='visibility:hidden;'>${Array(7 - ((compe / total * 100).toFixed(2) +  '').length).join("0")}</span>（<span class="${(compe == total ? 'has-text-warning' : '')}">${(compe / total * 100).toFixed(2)}%</span>）</td></tr>`);
        });

        //成就筛选
        $("#achiFilter").empty();
        $("#achiFilter").append($("<div class='has-text-advanced'>成就列表</div><table style='width:100%'></table>"));
        $("#achiFilter").children().eq(1).append(buildButtonGroup("宇宙：", "universe", {'all':'所有宇宙', 'standard':'标准宇宙', 'evil':'邪恶宇宙', 'antimatter':'反物质宇宙', 'micro':'微型宇宙', 'heavy':'高引力宇宙', 'magic':'魔法宇宙'}));
        $("#achiFilter").children().eq(1).append(buildButtonGroup("星级：", "star", {'all':'所有', '1_star':'无星', '2_star':'白星', '3_star':'铜星', '4_star':'银星', '5_star':'金星', 'none':'未获得'}));
        $("#achiFilter").children().eq(1).append(buildButtonGroup("种类：", "type", {all: "所有", type_atmosphere: "星球特性", type_biome: "生物群系", type_challenge: "挑战", type_combat: "战斗", type_fanaticism: "狂热信仰", type_genus: "种群", type_perk: "特权", type_progression: "游戏进度", type_reset: "威望重置", type_scenario: "剧情模式", type_species: "种族", type_unification: "统一", type_universe: "宇宙", type_other: "其它"}));

        $("#achiFilter").find("input").off("click");
        $("#achiFilter").find("input").on("click", achiFilter);

        //成就添加
        $("#achiList").empty();
        achiData.total.standard.forEach((ach) => {
            //成就信息
            let name = evolve.loc(`achieve_${ach}_name`).replace(/（.*）/, "");
            let desc = evolve.loc(`achieve_${ach}_desc`).replace(/（.*）/, "");

            //宇宙
            let uni = "";
            if(universeExclusives[ach])
            {
                let tempArr = [];
                universeExclusives[ach].forEach((uniL) => {
                    tempArr.push("universe_" + UniLtoS[uniL]);
                });
                uni += tempArr.join(" ");
            }

            //星级
            let star = "";
            if(evolve.global.stats.achieve[ach])
            {
                Object.keys(evolve.global.stats.achieve[ach]).forEach((uniS) => {
                    star += `${uniS}_${evolve.global.stats.achieve[ach][uniS]}_star `;
                });
            }

            //种类
            let type = "";
            if(typeKeys[ach])
            {
                typeKeys[ach].forEach((typ) => {
                    type += `type_${typ} `;
                });
            }

            //图标
            let icon = $("<span></span>")
            Object.keys(UniLtoS).forEach((uniL) => {
                if(uniL == "standard" || !universeExclusives[ach] || universeExclusives[ach].includes(uniL))
                {
                    let starNum = (evolve.global.stats.achieve[ach] && evolve.global.stats.achieve[ach][UniLtoS[uniL]]) ? evolve.global.stats.achieve[ach][UniLtoS[uniL]] : 0;
                    icon.append($(`<span title="${evolve.loc("universe_" + uniL)} ${starName[starNum]}"><svg class="svg star${starNum}" version="1.1" x="0px" y="0px" width="16px" height="16px" viewBox="${icons[uniL].viewbox}" xml:space="preserve" data-level="0">${icons[uniL].path}</svg></span>`))
                }
                else
                {
                    icon.append($(`<span><svg class="svg" width="16px" height="16px"></svg></span>`))
                }
            });

            let line = $(`<div style="display:inline-block; width:${AchiDivWid}px;" class='achiLine ${uni} ${star} ${type} '><span title="${desc}">${name}</span></div>`);
            line.prepend(icon);
            $("#achiList").append(line);
        });

    }

    function buildButtonGroup(title, groupName, btnGroup)
    {
        let container = $(`<tr class="AchiFiltButtCont_${groupName}"><td>${title}</td></tr>`);
        let td = $(`<td style='display:flex; flex-direction: row; justify-content: space-between;'></td>`);

        Object.keys(btnGroup).forEach((id, index) => {
            let radio = $(`<input class="buttonGroup_${groupName}" type="radio" name="buttonGroup_${groupName}" value="${id}">${btnGroup[id]}</input>`);
            if(index == 0)
            {
                radio.click();
            }
            let span = $(`<span></span>`);

            span.append(radio);
            td.append(span);
        });
        container.append(td);
        return container;
    }

    function achiFilter()
    {
        $(".achiLine").show();

        //宇宙
        let tempUni = $("input[name='buttonGroup_universe']:checked").val();
        if(tempUni != "all")
        {
            let tempArr = Object.keys(UniStoL);
            let tempIndex = tempArr.indexOf(UniLtoS[tempUni]);
            if(tempIndex > -1)
            {
                tempArr.splice(tempIndex, 1);
                $(`.universe_${tempArr.join(`:not(.universe_${UniLtoS[tempUni]}),.universe_`)}:not(.universe_${UniLtoS[tempUni]})`).hide();
            }
        }

        //星级
        let tempStar = $("input[name='buttonGroup_star']:checked").val();
        if(tempStar != "all")
        {
            let tempArr = ["1_star", "2_star", "3_star", "4_star", "5_star"];
            let tempIndex = tempArr.indexOf(tempStar);
            let tempUniS = tempUni == "all" ? "l" : UniLtoS[tempUni];
            if(tempIndex > -1)
            {
                $(`.achiLine:not(.${tempUniS}_${tempStar})`).hide();
            }
            else {
                $(`.${tempUniS}_${tempArr.join(`,.${tempUniS}_`)}`).hide();
            }
        }

        //种类
        let tempType = $("input[name='buttonGroup_type']:checked").val();
        if(tempType != "all")
        {
            $(`.achiLine:not(.${tempType})`).hide();
        }
    }

    function featStat()
    {
        //独有窗口
        let smallFeaTitle = $("#smallFeaTitle");
        let feaContent = $("#feaContent");
        let featStatus = $("#featStatus");
        let pillarStatus = $("#pillarStatus");

        if(smallFeaTitle.length === 0)
        {
            smallFeaTitle = $("<div id='smallFeaTitle' class='has-text-advanced' onclick='(function (){$(\"#histTitleListWindow\").children().removeClass(\"has-text-success\");if($(\"#feaContent\").css(\"display\") == \"none\"){$(\".sideHistWindow\").hide();$(\"#feaContent\").show();$(\"#smallFeaTitle\").addClass(\"has-text-success\");}else{$(\"#feaContent\").hide();}})()'>壮举</div>");
            feaContent = $("<div id='feaContent' class='sideHistWindow' style='height: inherit; display: none;'><div style='height: 100%; display:flex;'></div></div>");
            featStatus = $(`<div style='height: 100%; display:flex; flex-direction: column;'><div id='feaFilter'></div><div class='vscroll' style='flex-grow: 1;'><div id='feaList' style='width: ${FeatDivWid * FeatDivCol + 6}px; height: 0;'></div></div></div>`);
            pillarStatus = $(`<div style='height: 100%; display:flex; flex-direction: column;'><div id='pilFilter'></div><div class='vscroll' style='flex-grow: 1;'><div id='pilList' style='width: ${PillDivWid * PillDivCol + 6}px; height: 0;'></div></div></div>`);

            feaContent.children().eq(0).append(featStatus);
            feaContent.children().eq(0).append($(`<div style='width: ${padLR}; height: 100%;'></div>`));
            feaContent.children().eq(0).append(pillarStatus);

            smallFeaTitle.one("click", buildFeat);
            smallFeaTitle.one("click", buildPillar);

            $("#histWindow").prepend(feaContent);
            $("#histTitleListWindow").append(smallFeaTitle);
        }
    }

    function buildFeat()
    {
        $("#feaFilter").empty();
        $("#feaFilter").append($("<div class='has-text-advanced'>壮举统计</div>"));
        let compe = Object.keys(evolve.global.stats.feat).length;
        let total = Object.keys(feats).length;
        $("#feaFilter").append($(`<tr><td>完成率：</td><td><span style='visibility:hidden;'>${Array(3 - (compe +  '').length).join("0")}</span>${compe} / ${total}<span style='visibility:hidden;'>${Array(7 - ((compe / total * 100).toFixed(2) +  '').length).join("0")}</span>（<span class="${(compe == total ? 'has-text-warning' : '')}">${(compe / total * 100).toFixed(2)}%</span>）</td></tr>`));

        let feaLevel = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[]};

        Object.keys(feats).forEach((fea) => {
            let starNum = evolve.global.stats.feat[fea] ? evolve.global.stats.feat[fea] : 0;
            feaLevel[starNum].push(fea);
            let icon = $(`<span title="${starName[starNum]}"><svg class="svg star${starNum}" version="1.1" x="0px" y="0px" width="16px" height="16px" viewBox="${icons.standard.viewbox}" xml:space="preserve" data-level="0">${icons.standard.path}</svg></span>`);
            let line = $(`<div style="width: ${FeatDivWid}px; display: inline-block;" class='featLine ${starNum}_star'><span title="${evolve.loc("wiki_feat_" + fea)}">${feats[fea].name.apply().replace(/（.*）/, "")}</span></div>`);
            line.prepend(icon);
            $("#feaList").append(line);
        });

        let table = $("<table></table>");
        let tr = $("<tr></tr>");
        [0,1,2].forEach((level) => {
            tr.append($(`<td><span style='visibility:hidden;'>${Array(5 - (feaLevel[level].length +  '').length).join("0")}</span>${feaLevel[level].length} 个</td><td>${starName[level]}</td>`));
        });
        table.append(tr);
        tr = $("<tr></tr>");
        [3,4,5].forEach((level) => {
            tr.append($(`<td><span style='visibility:hidden;'>${Array(5 - (feaLevel[level].length +  '').length).join("0")}</span>${feaLevel[level].length} 个</td><td>${starName[level]}</td>`));
        });
        table.append(tr);
        $("#feaFilter").append(table);
    }

    function buildPillar()
    {
        let races = evolve.races;
        delete races.protoplasm;
        races = Object.keys(races);

        $("#pilFilter").empty();
        $("#pilFilter").append($("<div class='has-text-advanced'>永恒之柱统计</div>"));
        let compe = Object.keys(evolve.global.pillars).length;
        let total = races.length;
        $("#pilFilter").append($(`<tr><td>完成率：</td><td><span style='visibility:hidden;'>${Array(3 - (compe +  '').length).join("0")}</span>${compe} / ${total}<span style='visibility:hidden;'>${Array(7 - ((compe / total * 100).toFixed(2) +  '').length).join("0")}</span>（<span class="${(compe == total ? 'has-text-warning' : '')}">${(compe / total * 100).toFixed(2)}%</span>）</td></tr>`));

        let pilLevel = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[]};

        races.forEach((pil) => {
            let starNum = evolve.global.pillars[pil] ? evolve.global.pillars[pil] : 0;
            pilLevel[starNum].push(pil);
            let icon = $(`<span title="${starName[starNum]}"><svg class="svg star${starNum}" version="1.1" x="0px" y="0px" width="16px" height="16px" viewBox="${icons.standard.viewbox}" xml:space="preserve" data-level="0">${icons.standard.path}</svg></span>`);
            let line = $(`<div style="width: ${PillDivWid}px; display: inline-block;" class='pillLine ${starNum}_star'><span>${evolve.races[pil].name}</span></div>`);
            line.prepend(icon);
            $("#pilList").append(line);
        });

        let table = $("<table></table>");
        let tr = $("<tr></tr>");
        [0,1,2].forEach((level) => {
            tr.append($(`<td><span style='visibility:hidden;'>${Array(5 - (pilLevel[level].length +  '').length).join("0")}</span>${pilLevel[level].length} 个</td><td>${starName[level]}</td>`));
        });
        table.append(tr);
        tr = $("<tr></tr>");
        [3,4,5].forEach((level) => {
            tr.append($(`<td><span style='visibility:hidden;'>${Array(5 - (pilLevel[level].length +  '').length).join("0")}</span>${pilLevel[level].length} 个</td><td>${starName[level]}</td>`));
        });
        table.append(tr);
        $("#pilFilter").append(table);
    }

    function crisprStat()
    {
        //独有窗口
        let smallcriTitle = $("#smallcriTitle");
        let criContent = $("#criContent");
        let crisprStatus = $("#crisprStatus");
        let crisprGraph = $("#crisprGraph");

        if(smallcriTitle.length === 0)
        {
            smallcriTitle = $("<div id='smallcriTitle' class='has-text-advanced' onclick='(function (){$(\"#histTitleListWindow\").children().removeClass(\"has-text-success\");if($(\"#criContent\").css(\"display\") == \"none\"){$(\".sideHistWindow\").hide();$(\"#criContent\").show();$(\"#smallcriTitle\").addClass(\"has-text-success\");}else{$(\"#criContent\").hide();}})()'>CRISPR</div>");
            criContent = $("<div id='criContent' class='sideHistWindow' style='height: inherit; display: none;'><div style='height: 100%; display:flex;'></div></div>");
            crisprStatus = $(`<div style='height: 100%; display:flex; flex-direction: column;'><div id='criFilter'></div><div class='vscroll' style='flex-grow: 1;'><div id='criList' style='width: ${CrisDivWid * CrisDivCol + 6}px; height: 0;'></div></div></div>`);
            crisprGraph = $(`<svg id='criGraph' style='height: 100%;' width=1000 height=0><g/></svg>`);

            criContent.children().eq(0).append(crisprStatus);
            criContent.children().eq(0).append($(`<div style='width: ${padLR}; height: 100%;'></div>`));
            criContent.children().eq(0).append(crisprGraph);

            smallcriTitle.one("click", buildCrisprGraph);
            smallcriTitle.one("click", buildCrisprStat);

            $("#histWindow").prepend(criContent);
            $("#histTitleListWindow").append(smallcriTitle);
        }
    }

    function buildCrisprStat()
    {
        $("#criFilter").empty();
        $("#criFilter").append($("<div class='has-text-advanced'>CRISPR统计</div>"));
        let compe = 0;
        let total = Object.keys(genePool).length;

        Object.keys(genePool).forEach((gene) => {
            if(evolve.global.genes[genePool[gene].grant[0]] && evolve.global.genes[genePool[gene].grant[0]] >= genePool[gene].grant[1])
            {
                compe+=1;
            }
        });

        $("#criFilter").append($(`<tr><td>完成率：</td><td><span style='visibility:hidden;'>${Array(3 - (compe +  '').length).join("0")}</span>${compe} / ${total}<span style='visibility:hidden;'>${Array(7 - ((compe / total * 100).toFixed(2) +  '').length).join("0")}</span>（<span class="${(compe == total ? 'has-text-warning' : '')}">${(compe / total * 100).toFixed(2)}%</span>）</td></tr>`));

        Object.keys(genePool).forEach((gene) => {
            let buy = evolve.global.genes[genePool[gene].grant[0]] && evolve.global.genes[genePool[gene].grant[0]] >= genePool[gene].grant[1];

            let icon = $(`<span title="${buy? "已购买" : "未购买"}"><svg class="svg" fill="${buy? "#32CD32" : "none"}" version="1.1" x="0px" y="0px" width="16px" height="16px" viewBox="${icons.checkmark.viewbox}" xml:space="preserve" data-level="0">${icons.checkmark.path}</svg></span>`);
            let line = $(`<div style="width: ${CrisDivWid}px; display: inline-block;" class='criLine'><span title="${genePool[gene].desc()}">${genePool[gene].title()}</span></div>`);
            line.prepend(icon);
            $("#criList").append(line);
        });
    }

    function buildCrisprGraph()
    {
        var g = new dagreD3.graphlib.Graph().setGraph({rankdir:'LR'});

        let crisprTrees = {};
        Object.keys(genePool).forEach(function (gene){
            let crispr = genePool[gene];
            if (!crisprTrees[crispr.grant[0]]){
                crisprTrees[crispr.grant[0]] = {};
            }
            crisprTrees[crispr.grant[0]][crispr.grant[1]] = {
                name: gene
            };
        });

        Object.keys(genePool).forEach((gene) => {
            let title = typeof genePool[gene].title === 'string' ? genePool[gene].title : genePool[gene].title();
            let color = evolve.global.genes[genePool[gene].grant[0]] && evolve.global.genes[genePool[gene].grant[0]] >= genePool[gene].grant[1] ? 'has-text-success' : '';
            g.setNode(gene, {labelType: "html", label: `<span class="${color}">${title}</span>`, id: "CRISPR_" + gene});

            if (Object.keys(genePool[gene].reqs).length > 0)
            {
                Object.keys(genePool[gene].reqs).forEach(function (req){
                    g.setEdge(crisprTrees[req][genePool[gene].reqs[req]].name, gene, {});
                    /*
                    let color = global.genes[req] && global.genes[req] >= genePool[gene].reqs[req] ? 'success' : 'danger';
                    reqs.append(`${comma ? `, ` : ``}<span><a href="wiki.html#crispr-prestige-${crisprTrees[req][genePool[gene].reqs[req]].name}" class="has-text-${color}" target="_blank">${loc(`wiki_arpa_crispr_${req}`)} ${genePool[gene].reqs[req]}</a></span>`);
                    comma = true;*/
                });
            }
        });

        // Set some general styles
        g.nodes().forEach(function(v) {
          var node = g.node(v);
          node.rx = node.ry = 5;
        });

        var svg = d3.select("#criGraph"),
            inner = svg.select("g");

        // Set up zoom support
        var zoom = d3.zoom().on("zoom", function(e) {
              inner.attr("transform", e.transform);
            });
        svg.call(zoom);

        // Create the renderer
        var render = new dagreD3.render();

        // Run the renderer. This is what draws the final graph.
        render(inner, g);

        // Center the graph
        svg.call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(0.5));

        //提示框
        //此处插入CRISPR特殊条件
        var cri_popper = $(`<div id="CRISPR_popper" class="popper has-background-light has-text-dark pop-desc"></div>`);
        $(`#main`).append(cri_popper);
        var cri_popperRef = false;
        inner.selectAll("g.node")
        .on("mouseover", function (v) {
            let gene = $(this).attr("id").slice("CRISPR_".length)
            if (cri_popperRef || $(`#CRISPR_popper`).length > 0){
                if (cri_popper.data('id') !== gene){
                    cri_popper.hide();
                    if (cri_popperRef){
                        cri_popperRef.destroy();
                        cri_popperRef = false;
                    }
                }
            }
            cri_popper.data('id', gene);
            cri_popper.empty();
            cri_popper.append(`<div class="has-text-warning">${genePool[gene].title()}（${evolve.loc("wiki_arpa_crispr_"+genePool[gene].grant[0])}：${genePool[gene].grant[1]}）</div><div>${genePool[gene].desc()}</div>`);

            if (specialRequirements.hasOwnProperty(gene)){
                let comma = false;
                let specialReq = $(`<div class="reqs"><span class="has-text-caution">${evolve.loc('wiki_arpa_crispr_req_extra')}</span></div>`);
                cri_popper.append(specialReq);
                Object.keys(specialRequirements[gene]).forEach(function (req){
                    let color = specialRequirements[gene][req].color ? 'success' : 'danger';
                    let text = specialRequirements[gene][req].title();
                    specialReq.append(`${comma ? `, ` : ``}<span class="has-text-${color}">${text}</span>`);

                    comma = true;
                });
            }

            cri_popperRef = Popper.createPopper(this,
                document.querySelector(`#CRISPR_popper`),
                {
                    modifiers: [
                        {
                            name: 'flip',
                            enabled: true,
                        },
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 0],
                            },
                        }
                    ],
                }
            );

            cri_popper.show();
        })
        .on("mouseout", function (v) {
            let gene = $(this).attr("id").slice("CRISPR_".length)
            $(`#CRISPR_popper`).hide();
            if (cri_popperRef){
                cri_popperRef.destroy();
                cri_popperRef = false;
            }

        })
    }

    function bloodStat()
    {
        //独有窗口
        let smallbloTitle = $("#smallbloTitle");
        let bloContent = $("#bloContent");
        let bloodStatus = $("#bloodStatus");
        let bloodGraph = $("#bloodGraph");

        if(smallbloTitle.length === 0)
        {
            smallbloTitle = $("<div id='smallbloTitle' class='has-text-advanced' onclick='(function (){$(\"#histTitleListWindow\").children().removeClass(\"has-text-success\");if($(\"#bloContent\").css(\"display\") == \"none\"){$(\".sideHistWindow\").hide();$(\"#bloContent\").show();$(\"#smallbloTitle\").addClass(\"has-text-success\");}else{$(\"#bloContent\").hide();}})()'>鲜血灌注</div>");
            bloContent = $("<div id='bloContent' class='sideHistWindow' style='height: inherit; display: none;'><div style='height: 100%; display:flex;'></div></div>");
            bloodStatus = $(`<div style='height: 100%; display:flex; flex-direction: column;'><div id='bloFilter'></div><div class='vscroll' style='flex-grow: 1;'><div id='bloList' style='width: ${CrisDivWid * CrisDivCol + 6}px; height: 0;'></div></div></div>`);
            bloodGraph = $(`<svg id='bloGraph' style='height: 100%;' width=1000 height=0><g/></svg>`);

            bloContent.children().eq(0).append(bloodStatus);
            bloContent.children().eq(0).append($(`<div style='width: ${padLR}; height: 100%;'></div>`));
            bloContent.children().eq(0).append(bloodGraph);

            smallbloTitle.one("click", buildBloodGraph);
            smallbloTitle.one("click", buildBloodStat);

            $("#histWindow").prepend(bloContent);
            $("#histTitleListWindow").append(smallbloTitle);
        }
    }

    function buildBloodStat()
    {
        $("#bloFilter").empty();
        $("#bloFilter").append($("<div class='has-text-advanced'>鲜血灌注统计</div>"));
        let compe = 0;
        let total = Object.keys(bloodPool).length;

        Object.keys(bloodPool).forEach((blood) => {
            if(evolve.global.blood[bloodPool[blood].grant[0]] && !(evolve.global.blood[bloodPool[blood].grant[0]] < bloodPool[blood].grant[1]))
            {
                compe+=1;
            }
        });

        $("#bloFilter").append($(`<tr><td>完成率：</td><td><span style='visibility:hidden;'>${Array(3 - (compe +  '').length).join("0")}</span>${compe} / ${total}<span style='visibility:hidden;'>${Array(7 - ((compe / total * 100).toFixed(2) +  '').length).join("0")}</span>（<span class="${(compe == total ? 'has-text-warning' : '')}">${(compe / total * 100).toFixed(2)}%</span>）</td></tr>`));

        Object.keys(bloodPool).forEach((blood) => {
            let buy = evolve.global.blood[bloodPool[blood].grant[0]] && !(evolve.global.blood[bloodPool[blood].grant[0]] < bloodPool[blood].grant[1]);

            let icon = $(`<span title="${buy? "已购买" : "未购买"}"><svg class="svg" fill="${buy? "#32CD32" : "none"}" version="1.1" x="0px" y="0px" width="16px" height="16px" viewBox="${icons.checkmark.viewbox}" xml:space="preserve" data-level="0">${icons.checkmark.path}</svg></span>`);
            let line = $(`<div style="width: ${CrisDivWid}px; display: inline-block;" class='bloLine'><span title="${bloodPool[blood].desc()}">${bloodPool[blood].title()}${(buy&&bloodPool[blood].grant[1]=="*")?"（"+evolve.global.blood[bloodPool[blood].grant[0]]+"）":""}</span></div>`);
            line.prepend(icon);
            $("#bloList").append(line);
        });
    }

    function buildBloodGraph()
    {
        var g = new dagreD3.graphlib.Graph().setGraph({rankdir:'TB', ranker:"longest-path"});

        let bloodTrees = {};
        Object.keys(bloodPool).forEach(function (blood){
            if (!bloodTrees[bloodPool[blood].grant[0]]){
                bloodTrees[bloodPool[blood].grant[0]] = {};
            }
            bloodTrees[bloodPool[blood].grant[0]][bloodPool[blood].grant[1]] = {
                name: blood
            };
        });

        //特殊，CRIPS的鲜血3
        g.setNode("essence_absorber", {labelType: "html", label: `<span class="${evolve.global.genes[genePool.essence_absorber.grant[0]] && evolve.global.genes[genePool.essence_absorber.grant[0]] >= genePool.essence_absorber.grant[1] ? 'has-text-success' : ''}">CRISPR升级：${typeof genePool.essence_absorber.title === 'string' ? genePool.essence_absorber.title : genePool.essence_absorber.title()}</span>`, id: "BLOOD_" + "essence_absorber"});

        Object.keys(bloodPool).forEach((blood) => {
            let title = typeof bloodPool[blood].title === 'string' ? bloodPool[blood].title : bloodPool[blood].title();
            let color = evolve.global.blood[bloodPool[blood].grant[0]] && !(evolve.global.blood[bloodPool[blood].grant[0]] < bloodPool[blood].grant[1]) ? 'has-text-success' : '';
            g.setNode(blood, {labelType: "html", label: `<span class="${color}">${title}</span>`, id: "BLOOD_" + blood});

            if (Object.keys(bloodPool[blood].reqs).length > 0)
            {
                Object.keys(bloodPool[blood].reqs).forEach(function (req){
                    g.setEdge(bloodTrees[req][bloodPool[blood].reqs[req]].name, blood, {});
                });
            }
            if (bloodPool[blood].hasOwnProperty('condition')){
                g.setEdge("essence_absorber", blood, {});
            }
        });

        // Set some general styles
        g.nodes().forEach(function(v) {
          var node = g.node(v);
          node.rx = node.ry = 5;
        });

        var svg = d3.select("#bloGraph"),
            inner = svg.select("g");

        // Set up zoom support
        var zoom = d3.zoom().on("zoom", function(e) {
              inner.attr("transform", e.transform);
            });
        svg.call(zoom);

        // Create the renderer
        var render = new dagreD3.render();

        // Run the renderer. This is what draws the final graph.
        render(inner, g);

        // Center the graph
        svg.call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(0.5));

        //提示框
        var blo_popper = $(`<div id="BLOOD_popper" class="popper has-background-light has-text-dark pop-desc"></div>`);
        $(`#main`).append(blo_popper);
        var blo_popperRef = false;
        inner.selectAll("g.node")
        .on("mouseover", function (v) {
            let blood = $(this).attr("id").slice("BLOOD_".length)
            if (blo_popperRef || $(`#BLOOD_popper`).length > 0){
                if (blo_popper.data('id') !== blood){
                    blo_popper.hide();
                    if (blo_popperRef){
                        blo_popperRef.destroy();
                        blo_popperRef = false;
                    }
                }
            }
            blo_popper.data('id', blood);
            blo_popper.empty();
            //特殊，CRIPS的鲜血3
            if(blood == "essence_absorber")
            {
                blo_popper.append(`<div class="has-text-warning">${genePool[blood].title()}（${evolve.loc("wiki_arpa_crispr_"+genePool[blood].grant[0])}：${genePool[blood].grant[1]}）</div><div>${genePool[blood].desc()}</div>`);
            }
            else {
                blo_popper.append(`<div class="has-text-warning">${bloodPool[blood].title()}（${evolve.loc("wiki_arpa_blood_"+bloodPool[blood].grant[0])}：${bloodPool[blood].grant[1]}）</div><div>${bloodPool[blood].desc()}</div>`);
            }

            blo_popperRef = Popper.createPopper(this,
                document.querySelector(`#BLOOD_popper`),
                {
                    modifiers: [
                        {
                            name: 'flip',
                            enabled: true,
                        },
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 0],
                            },
                        }
                    ],
                }
            );

            blo_popper.show();
        })
        .on("mouseout", function (v) {
            let blood = $(this).attr("id").slice("BLOOD_".length)
            $(`#BLOOD_popper`).hide();
            if (blo_popperRef){
                blo_popperRef.destroy();
                blo_popperRef = false;
            }

        })
    }

    function perkStat()
    {
        //独有窗口
        let smallPerTitle = $("#smallPerTitle");
        let perContent = $("#perContent");
        let perkStatus = $("#perkStatus");
        //let perkDetail = $("#perkDetail");

        if(smallPerTitle.length === 0)
        {
            smallPerTitle = $("<div id='smallPerTitle' class='has-text-advanced' onclick='(function (){$(\"#histTitleListWindow\").children().removeClass(\"has-text-success\");if($(\"#perContent\").css(\"display\") == \"none\"){$(\".sideHistWindow\").hide();$(\"#perContent\").show();$(\"#smallPerTitle\").addClass(\"has-text-success\");}else{$(\"#perContent\").hide();}})()'>特权</div>");
            perContent = $("<div id='perContent' class='sideHistWindow' style='height: inherit; display: none;'><div style='height: 100%; display:flex;'></div></div>");
            perkStatus = $(`<div style='height: 100%; display:flex; flex-direction: column;'><div id='perFilter'></div><div class='vscroll' style='flex-grow: 1;'><div id='perList' style='width: ${PerkDivWid * PerkDivCol + 6}px; height: 0;'></div></div></div>`);
            //perkDetail = $(`<div style='' id='perkDetail'></div>`);

            //perContent.children().eq(0).append(perkDetail);
            //perContent.children().eq(0).append($(`<div style='width: ${padLR}; height: 100%;'></div>`));
            perContent.children().eq(0).append(perkStatus);

            smallPerTitle.one("click", buildPerk);

            $("#histWindow").prepend(perContent);
            $("#histTitleListWindow").append(smallPerTitle);
        }
    }

    function buildPerk()
    {
        $("#perFilter").empty();
        $("#perFilter").append($("<div class='has-text-advanced'>特权统计</div>"));
        let compe = 0;
        let total = Object.keys(perks).length;
        let types = {achieve:{fName:"achievements"}, feat:{fName:"feats"}};

        //提示框
        var per_popper = $(`<div id="PERK_popper" class="popper has-background-light has-text-dark pop-desc"></div>`);
        $(`#main`).append(per_popper);
        var per_popperRef = false;

        perks.forEach((per) => {
            let name = evolve.loc(`${per.src[1]}_${per.src[0]}_name`).replace(/（.*）/, "")
            let type = evolve.loc(`wiki_menu_${types[per.src[1]].fName}`)
            let starNum = evolve.global.stats[per.src[1]][per.src[0]] ? (evolve.global.stats[per.src[1]][per.src[0]].l ? evolve.global.stats[per.src[1]][per.src[0]].l : evolve.global.stats[per.src[1]][per.src[0]]) : 0;
            if(starNum > 0) compe += 1;
            let icon = $(`<span title="${starName[starNum]}"><svg class="svg star${starNum}" version="1.1" x="0px" y="0px" width="16px" height="16px" viewBox="${icons.standard.viewbox}" xml:space="preserve" data-level="0">${icons.standard.path}</svg></span>`);
            let line = $(`<div style="width: ${PerkDivWid}px; display: inline-block;" class='perkLine ${starNum}_star'><span id="PERK_${per.src[0]}">${type}：${name}</span></div>`);
            line.prepend(icon);
            $("#perList").append(line);

            //提示框
            line.children(`span:last-of-type`)
            .on("mouseover", function (v) {
                let perk = per.src[0]
                if (per_popperRef || $(`#PERK_popper`).length > 0){
                    if (per_popper.data('id') !== perk){
                        per_popper.hide();
                        if (per_popperRef){
                            per_popperRef.destroy();
                            per_popperRef = false;
                        }
                    }
                }
                per_popper.data('id', perk);
                per_popper.empty();
                let desc = $(`<div></div>`)
                per.desc().forEach((line) => {
                    desc.append($(`<div>${line}</div>`))
                });

                per_popper.append(`<div class="has-text-warning">${name}</div>`);
                per_popper.append(desc);

                per_popperRef = Popper.createPopper(this,
                    document.querySelector(`#PERK_popper`),
                    {
                        modifiers: [
                            {
                                name: 'flip',
                                enabled: true,
                            },
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, 0],
                                },
                            }
                        ],
                    }
                );

                per_popper.show();
            })
            .on("mouseout", function (v) {
                $(`#PERK_popper`).hide();
                if (per_popperRef){
                    per_popperRef.destroy();
                    per_popperRef = false;
                }

            });
        });

        $("#perFilter").append($(`<tr><td>完成率：</td><td><span style='visibility:hidden;'>${Array(3 - (compe +  '').length).join("0")}</span>${compe} / ${total}<span style='visibility:hidden;'>${Array(7 - ((compe / total * 100).toFixed(2) +  '').length).join("0")}</span>（<span class="${(compe == total ? 'has-text-warning' : '')}">${(compe / total * 100).toFixed(2)}%</span>）</td></tr>`));
    }

    function loc(key, variables)
    {
        return function(){return evolve.loc(key, variables)};
    }

    function payCrispr(a)
    {
        //无用的函数
        return true;
    }

    function payBloodPrice(a)
    {
        //无用的函数
        return true;
    }

    //手动维护成就列表
    const typeKeys = {
    	apocalypse: ['reset'],
    	ascended: ['reset'],
    	dreaded: ['reset'],
    	anarchist: ['reset', 'perk'],
    	second_evolution: ['reset', 'fanaticism'],
    	blackhole: ['progression', 'perk'],
    	warmonger: ['combat'],
    	red_tactics: ['combat'],
    	pacifist: ['combat', 'unification'],
    	neutralized: ['combat'],
    	paradise: ['other'],
    	scrooge: ['other'],
    	madagascar_tree: ['fanaticism'],
    	godwin: ['fanaticism'],
    	laser_shark: ['other'],
    	infested: ['fanaticism'],
    	mass_starvation: ['other'],
    	colonist: ['progression'],
    	world_domination: ['unification'],
    	illuminati: ['unification'],
    	syndicate: ['unification'],
    	cult_of_personality: ['unification'],
    	doomed: ['progression'],
    	pandemonium: ['progression'],
    	blood_war: ['progression'],
    	landfill: ['other'],
    	seeder: ['reset'],
    	miners_dream: ['reset', 'perk'],
    	shaken: ['scenario'],
    	blacken_the_sun: ['other'],
    	trade: ['other'],
    	resonance: ['other', 'progression'],
        enlightenment: ['other', 'progression'],
    	gladiator: ['other'],
        corrupted: ['other', 'progression'],
        mass_extinction: ['reset', 'perk'],
    	extinct_human: ['species'],
    	extinct_elven: ['species'],
    	extinct_orc: ['species'],
    	extinct_cath: ['species'],
    	extinct_wolven: ['species'],
    	extinct_vulpine: ['species'],
    	extinct_centaur: ['species'],
    	extinct_rhinotaur: ['species'],
    	extinct_capybara: ['species'],
    	extinct_kobold: ['species'],
    	extinct_goblin: ['species'],
    	extinct_gnome: ['species'],
    	extinct_ogre: ['species'],
    	extinct_cyclops: ['species'],
    	extinct_troll: ['species'],
    	extinct_tortoisan: ['species'],
    	extinct_gecko: ['species'],
    	extinct_slitheryn: ['species'],
    	extinct_arraak: ['species'],
    	extinct_pterodacti: ['species'],
    	extinct_dracnid: ['species'],
    	extinct_entish: ['species'],
    	extinct_cacti: ['species'],
    	extinct_pinguicula: ['species'],
    	extinct_sporgar: ['species'],
    	extinct_shroomi: ['species'],
    	extinct_moldling: ['species'],
    	extinct_mantis: ['species'],
    	extinct_scorpid: ['species'],
    	extinct_antid: ['species'],
    	extinct_sharkin: ['species'],
    	extinct_octigoran: ['species'],
    	extinct_dryad: ['species'],
    	extinct_satyr: ['species'],
    	extinct_phoenix: ['species'],
    	extinct_salamander: ['species'],
    	extinct_yeti: ['species'],
    	extinct_wendigo: ['species'],
    	extinct_tuskin: ['species'],
    	extinct_kamel: ['species'],
    	extinct_balorg: ['species'],
    	extinct_imp: ['species'],
    	extinct_seraph: ['species'],
    	extinct_unicorn: ['species'],
    	extinct_synth: ['species'],
    	extinct_nano: ['species'],
    	extinct_junker: ['species', 'perk', 'scenario'],
    	extinct_sludge: ['species', 'perk', 'challenge'],
    	extinct_custom: ['species'],
        creator: ['reset', 'perk'],
    	genus_humanoid: ['genus'],
    	genus_carnivore: ['genus'],
    	genus_herbivore: ['genus'],
    	genus_small: ['genus'],
    	genus_giant: ['genus'],
    	genus_reptilian: ['genus'],
    	genus_avian: ['genus'],
    	genus_insectoid: ['genus'],
    	genus_plant: ['genus'],
    	genus_fungi: ['genus'],
    	genus_aquatic: ['genus'],
    	genus_fey: ['genus'],
    	genus_heat: ['genus'],
    	genus_polar: ['genus'],
    	genus_sand: ['genus'],
    	genus_demonic: ['genus'],
    	genus_angelic: ['genus', 'universe'],
    	genus_synthetic: ['genus'],
    	explorer: ['biome', 'reset', 'perk'],
    	biome_grassland: ['biome'],
    	biome_oceanic: ['biome'],
    	biome_forest: ['biome'],
    	biome_desert: ['biome'],
    	biome_volcanic: ['biome'],
    	biome_tundra: ['biome'],
    	biome_hellscape: ['biome'],
    	biome_eden: ['biome', 'universe'],
    	atmo_toxic: ['atmosphere'],
    	atmo_mellow: ['atmosphere'],
    	atmo_rage: ['atmosphere'],
    	atmo_stormy: ['atmosphere'],
    	atmo_ozone: ['atmosphere'],
    	atmo_magnetic: ['atmosphere'],
    	atmo_trashed: ['atmosphere'],
    	atmo_elliptical: ['atmosphere'],
    	atmo_flare: ['atmosphere'],
    	atmo_dense: ['atmosphere'],
    	atmo_unstable: ['atmosphere'],
    	vigilante: ['reset', 'universe'],
    	squished: ['reset', 'universe'],
    	double_density: ['universe'],
    	cross: ['universe'],
    	macro: ['universe'],
    	marble: ['universe'],
    	heavyweight: ['reset', 'universe', 'perk'],
    	whitehole: ['reset', 'perk', 'universe'],
    	heavy: ['reset', 'universe'],
    	canceled: ['reset', 'universe'],
    	eviltwin: ['reset', 'universe'],
    	microbang: ['reset', 'universe'],
    	pw_apocalypse: ['reset', 'universe'],
    	fullmetal: ['progression', 'universe'],
    	pass: ['reset'],
        joyless: ['progression', 'challenge'],
    	steelen: ['challenge', 'reset', 'perk'],
    	dissipated: ['reset', 'challenge', 'perk'],
    	technophobe: ['reset', 'challenge', 'perk'],
    	wheelbarrow: ['other', 'challenge', 'perk'],
    	iron_will: ['perk', 'scenario'],
    	failed_history: ['perk', 'scenario'],
    	banana: ['perk', 'scenario'],
    	pathfinder: ['perk', 'scenario'],
    	ashanddust: ['perk', 'scenario'],
    	exodus: ['perk', 'scenario'],
    	obsolete: ['perk', 'scenario'],
    	gross: ['perk', 'challenge'],
    };
    //手动维护特权列表
    const perks = [
        {src:['blackhole', 'achieve' ],
        desc(){
            return [loc("achieve_perks_blackhole",["5% / +10% / +15% / +20% / +25"])()];
        }},
        {src:['trade', 'achieve' ],
        desc(){
            return [loc("achieve_perks_trade",["2% / +4% / +6% / +8% / +10","1% / -2% / -3% / -4% / -5"])()];
        }},
        {src:['creator', 'achieve' ],
        desc(){
            return [loc("achieve_perks_creator",["1.5 / 2 / 2.5 / 3 / 3.5"])()];
        }},
        {src:['mass_extinction', 'achieve' ],
        desc(){
            return [loc("achieve_perks_mass_extinction")(),
                    loc("achieve_perks_mass_extinction2",["0 / 50 / 100 / 150 / 200"])()];
        }},
        {src:['explorer', 'achieve' ],
        desc(){
            return [loc("achieve_perks_explorer",["1 / +2 / +3 / +4 / +5"])()];
        }},
        {src:['miners_dream', 'achieve' ],
        desc(){
            return [loc("achieve_perks_miners_dream",["1 / 2 / 3 / 5 / 7"])()];
        }},
        {src:['extinct_junker', 'achieve' ],
        desc(){
            return [loc("achieve_perks_enlightened")()];
        }},
        {src:['joyless', 'achieve' ],
        desc(){
            return [loc("achieve_perks_joyless",["2% / +4% / +6% / +8% / +10"])()];
        }},
        {src:['steelen', 'achieve' ],
        desc(){
            return [loc("achieve_perks_steelen",["2% / +4% / +6% / +8% / +10"])()];
        }},
        {src:['wheelbarrow', 'achieve' ],
        desc(){
            return [loc("achieve_perks_wheelbarrow",["2% / +4% / +6% / +8% / +10"])()];
        }},
        {src:['extinct_sludge', 'achieve' ],
        desc(){
            return ["+3% / +6% / +9% / +12% / +15% 当前宇宙中的暗能量效果"];
        }},
        {src:['whitehole', 'achieve' ],
        desc(){
            return [loc("achieve_perks_whitehole")(),
                    loc("achieve_perks_whitehole2",["5% / +10% / +15% / +20% / +25"])(),
                    loc("achieve_perks_whitehole3",["1 / +2 / +3 / +4 / +5"])()];
        }},
        {src:['heavyweight', 'achieve' ],
        desc(){
            return [loc("achieve_perks_heavyweight",["4% / -8% / -12% / -16% / -20"])()];
        }},
        {src:['dissipated', 'achieve' ],
        desc(){
            return ["无星："+loc("achieve_perks_dissipated1",[1])(),
                    "白星："+loc("achieve_perks_dissipated3",[1])(),
                    "铜星："+loc("achieve_perks_dissipated2",[1])(),
                    "银星："+loc("achieve_perks_dissipated4",[1])(),
                    "金星："+loc("achieve_perks_dissipated2",[1])()];
        }},
        {src:['banana', 'achieve' ],
        desc(){
            return ["无星："+loc("achieve_perks_banana1",[50])(),
                    "白星："+loc("achieve_perks_banana2",[1])(),
                    "铜星："+loc("achieve_perks_banana3",[10])(),
                    "银星："+loc("achieve_perks_banana4",[3])(),
                    "金星："+loc("achieve_perks_banana5",[0.01])()];
        }},
        {src:['anarchist', 'achieve' ],
        desc(){
            return [loc("achieve_perks_anarchist",["10% / -20% / -30% / -40% / -50"])()];
        }},
        {src:['ascended', 'achieve' ],
        desc(){
            return ["每有一个宇宙的一级成就，自定义种族时的基因点数 +1。（总计上限 30 点）",
                    "和谐水晶减蠕变效果受当前宇宙的成就等级影响"];
        }},
        {src:['technophobe', 'achieve' ],
        desc(){
            return ["无星："+loc("achieve_perks_technophobe1",[25])(),
                    "白星："+loc("achieve_perks_technophobe2",[10])()+"（每在非标准宇宙中完成金星的本成就，集热器效果就再增加 5%）",
                    "铜星："+loc("achieve_perks_technophobe3",[1])()+"（每在非标准宇宙中完成金星的本成就，灵魂宝石就再增加 1）",
                    "银星："+loc("achieve_perks_technophobe2",[15])(),
                    "金星："+loc("achieve_perks_technophobe4",[10])(),
                    loc("achieve_perks_technophobe5",["1 / +2 / +3 / +4 / +5"])()];
        }},
        {src:['iron_will', 'achieve' ],
        desc(){
            return ["无星："+loc("achieve_perks_iron_will1",[0.15])(),
                    "白星："+loc("achieve_perks_iron_will2",[10])(),
                    "铜星："+loc("achieve_perks_iron_will3",[6])(),
                    "银星："+loc("achieve_perks_iron_will4",[1])(),
                    "金星："+loc("achieve_perks_iron_will5")()];
        }},
        {src:['failed_history', 'achieve' ],
        desc(){
            return [loc("achieve_perks_failed_history",[2])()];
        }},
        {src:['gladiator', 'achieve' ],
        desc(){
            return [loc("achieve_perks_gladiator",["20% / +40% / +60% / +80% / +100"])()];
        }},
        {src:['pathfinder', 'achieve' ],
        desc(){
            return ["无星："+loc("achieve_perks_pathfinder1",[10])(),
                    "白星："+loc("achieve_perks_pathfinder2",[10])(),
                    "铜星："+loc("achieve_perks_pathfinder3")(),
                    "银星："+loc("unavailable_content")(),
                    "金星："+loc("unavailable_content")()];
        }},
        {src:['novice', 'feat' ],
        desc(){
            return [loc("achieve_perks_novice",["0.5 / +1 / +1.5 / +2 / +2.5","0.25 / +0.5 / +0.75 / +1 / +1.25"])()];
        }},
        {src:['journeyman', 'feat' ],
        desc(){
            return [loc("achieve_perks_journeyman2",["1 / +1 / +2 / +2 / +3","0 / +1 / +1 / +2 / +2"])()];
        }},
        {src:['adept', 'feat' ],
        desc(){
            return [loc("achieve_perks_adept",["100 / 200 / 300 / 400 / 500","60 / +120 / +180 / +240 / +300"])()];
        }}
    ];

    //此处插入数据

})();
