// ==UserScript==
// @name         历史数据统计
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  try to take over the world!
// @downloadURL  https://github.com/DSLM/evolve-script/raw/master/history/evolve_history.user.js
// @author       DSLM
// @match        https://likexia.gitee.io/evolve/
// @match        https://pmotschmann.github.io/Evolve/
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
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

    //全局CSS
    const padTB = "0.5em";
    const padLR = "0.75em";
    let styles = $(`<style type='text/css' id='sideWindowCSS'>
    #sideWindow>div:not(#titleListWindow) {
        padding: ${padTB} ${padLR};
    }
    </style>`);
    if($("#sideWindowCSS"))
    {
        $("#sideWindowCSS").remove();
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
            let smallHistTitle = $("<div id='smallHistTitle' class='resource alt has-text-caution' onclick='(function (){if($(\"#histContent\").css(\"display\") == \"none\"){$(\".sideContentWindow\").hide();$(\"#histContent\").show();}else{$(\"#histContent\").hide();}})()'>统计</div>");
            let histContent = $(`<div id='histContent' class='resource alt sideContentWindow' style='height: 100%; display: none;'><div id='histFlexContent' style='height: 100%;display:flex;flex-direction: column;justify-content: space-between;'><div class='has-text-caution' style='text-align: center; padding-bottom: ${padTB};'>数据统计</div></div></div>`);

            let histWindow = $(`<div id='histWindow' style='height: 100%; display:flex; flex-direction: row; justify-content: flex-end; align-items: flex-end; flex-grow: 1;'><div id='histTitleListWindow' style='height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end; padding-left: ${padLR};'></div></div>`);

            histContent.children().eq(0).append(histWindow);

            sideWindow.prepend(histContent);
            $("#titleListWindow").append(smallHistTitle);
        }

        //未完全加载
        if(evolve.global == undefined) return;
        if(evolve.loc("feat_utopia_name") == undefined) return;

        achieveStat();
        featStat();
        histRecord();
        spireTimeDataFunc();
    }

    function histRecord()
    {
        //还没有
        if($("#historyDataText").length == 0)
        {
            let historyData = JSON.parse(localStorage.getItem("historyData"));
            if(historyData == null)
            {
                historyData = [];
            }

            let backupString = LZString.decompressFromUTF16(localStorage.getItem('evolveBak'));
            if (backupString) {
                let oldStats = JSON.parse(backupString).stats;
                //race: JSON.parse(backupString).race.species,
                let statsData = {/*knowledge_spent: oldStats.know, starved_to_death: oldStats.starved, died_in_combat: oldStats.died, attacks_made: oldStats.attacks,*/ game_days_played: oldStats.days};
                /*if (oldStats.dkills > 0) {
                statsData.demons_kills = oldStats.dkills;
            }
            if (oldStats.sac > 0) {
            statsData.sacrificed = oldStats.sac;
        }*/
        if (oldStats.plasmid > 0) {
            statsData.plasmid_earned = oldStats.plasmid;
        }
        if (oldStats.antiplasmid > 0) {
            statsData.antiplasmid_earned = oldStats.antiplasmid;
        }
        if (oldStats.phage > 0) {
            statsData.phage_earned = oldStats.phage;
        }
        if (oldStats.dark > 0) {
            statsData.dark_earned = oldStats.dark;
        }
        if (oldStats.harmony > 0) {
            statsData.harmony_earned = oldStats.harmony;
        }
        if (oldStats.blood > 0) {
            statsData.blood_earned = oldStats.blood;
        }
        if (oldStats.artifact > 0) {
            statsData.artifact_earned = oldStats.artifact;
        }
        if (oldStats.reset > 0) {
            statsData.total_resets = oldStats.reset;
        }

        if(historyData.length == 0 || (historyData.length > 0 && historyData[0].total_resets != statsData.total_resets)) historyData.unshift(statsData)
        if(historyData.length > HIST_RESET_LIMIT) historyData.pop()
        localStorage.setItem("historyData", JSON.stringify(historyData));
    }

    let historyDataTitle = $(`<div class='has-text-warning' style='margin-top:32px' onclick=\"(function (){if($('#historyDataText').css('display')!='none'){$('#historyDataText').hide();$('#hiddenTip1').show();}else{$('#historyDataText').show();$('#hiddenTip1').hide();}})()\"><span>历史统计数据（保存${HIST_RESET_LIMIT}组数据，点击隐藏/显示）:</span></div>`);
    let historyDataText = $("<div id='historyDataText'style='display: none;'></div>");
    let hiddenTip1 = $("<div id='hiddenTip1'>已隐藏</div>");
    $('#stats').append(historyDataTitle);
    $('#stats').append(hiddenTip1);
    $('#stats').append(historyDataText);

    for(var i = 0; i < historyData.length; i++)
    {
        let statsString = `<div><span class="has-text-success">前${i+1}轮：</span></div>`;
        for (let [label, value] of Object.entries(historyData[i])) {
            //威望物资
            if(label.includes("_earned"))
            {
                var calData = (i == 0) ? (evolve.global.stats[label.slice(0,-7)] - value) : (historyData[i-1][label] - value);
                if(calData == 0) continue;
                statsString += `<div><span class="has-text-warning">${evolve.loc("achieve_stats_" + label)}</span> ${calData.toLocaleString()}</div>`;
            }
            else
            {
                statsString += `<div><span class="has-text-warning">${evolve.loc("achieve_stats_" + label)}</span> ${value.toLocaleString()}</div>`;
            }
        }
        historyDataText.append(statsString);
    }
}
}

    function spireTimeDataFunc()
    {
        var spireTimeData, nowRecord;
        //显示
        //evolve.global.stats.spire["h"]['dlstr']

        let spireTimeDataText = $("#spireTimeDataText");
        if(spireTimeDataText.length === 0)
        {
            let spireTimeDataTitle = $(`<div class='has-text-warning' style='margin-top:32px' onclick=\"(function (){if($('#spireTimeDataText').css('display')!='none'){$('#spireTimeDataText').hide();$('#hiddenTip2').show();}else{$('#spireTimeDataText').show();$('#hiddenTip2').hide();}})()\"><span>地狱尖塔数据（保存${HIST_SPIRE_LIMIT}条数据，点击隐藏/显示）:</span></div>`)
            spireTimeDataText = $("<div id='spireTimeDataText' style='display: none;'></div>");
            let hiddenTip2 = $("<div id='hiddenTip2'>已隐藏</div>");
            $('#stats').append(spireTimeDataTitle);
            $('#stats').append(hiddenTip2);
            $('#stats').append(spireTimeDataText);

            spireTimeData = JSON.parse(localStorage.getItem("spireTimeData"));
            if(spireTimeData == null)
            {
                return;
            }

            for(var i = 0; i < spireTimeData["record"].length - 1; i++)
            {
                nowRecord = spireTimeData["record"][i]
                if(nowRecord["effi"] < spireTimeData["record"][i + 1]["effi"])
                {
                    spireTimeDataText.append($("<p class='has-text-success'>抵达 " + nowRecord["floor"] + " 层，花费 " + nowRecord["day"] + " 天，效率 " + nowRecord["effi"].toFixed(4) + " 天/层，鲜血之石 " + nowRecord["stone"] + " 个，效率 " + (nowRecord["effi"] / nowRecord["stone"]).toFixed(4) + " 天/个</p>"))
                }
                else
                {
                    spireTimeDataText.append($("<p class='has-text-danger'>抵达 " + nowRecord["floor"] + " 层，花费 " + nowRecord["day"] + " 天，效率 " + nowRecord["effi"].toFixed(4) + " 天/层，鲜血之石 " + nowRecord["stone"] + " 个，效率 " + (nowRecord["effi"] / nowRecord["stone"]).toFixed(4) + " 天/个</p>"))
                }
            }
            if(spireTimeData["record"].length > 0)
            {
                nowRecord = spireTimeData["record"][spireTimeData["record"].length - 1]
                spireTimeDataText.append($("<p class='has-text-success'>抵达 " + nowRecord["floor"] + " 层，花费 " + nowRecord["day"] + " 天，效率 " + nowRecord["effi"].toFixed(4) + " 天/层，鲜血之石 " + nowRecord["stone"] + " 个，效率 " + (nowRecord["effi"] / nowRecord["stone"]).toFixed(4) + " 天/个</p>"))
            }

            return;
        }

        if(evolve.global.portal.spire == undefined) return;


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

            nowRecord = spireTimeData["record"][0]
            if(spireTimeData["record"].length > 1)
            {
                if(nowRecord["effi"] < spireTimeData["record"][1]["effi"])
                {
                    spireTimeDataText.prepend($("<p class='has-text-success'>抵达 " + nowRecord["floor"] + " 层，花费 " + nowRecord["day"] + " 天，效率 " + nowRecord["effi"].toFixed(4) + " 天/层，鲜血之石 " + nowRecord["stone"] + " 个，效率 " + (nowRecord["effi"] / nowRecord["stone"]).toFixed(4) + " 天/个</p>"))
                }
                else
                {
                    spireTimeDataText.prepend($("<p class='has-text-danger'>抵达 " + nowRecord["floor"] + " 层，花费 " + nowRecord["day"] + " 天，效率 " + nowRecord["effi"].toFixed(4) + " 天/层，鲜血之石 " + nowRecord["stone"] + " 个，效率 " + (nowRecord["effi"] / nowRecord["stone"]).toFixed(4) + " 天/个</p>"))
                }
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
            smallAchiTitle = $("<div id='smallAchiTitle' class='has-text-advanced' onclick='(function (){if($(\"#achiContent\").css(\"display\") == \"none\"){$(\".sideHistWindow\").hide();$(\"#achiContent\").show();}else{$(\"#achiContent\").hide();}})()'>成就</div>");
            achiContent = $("<div id='achiContent' class='sideHistWindow' style='height: inherit; display: none;'><div style='height: 100%; display:flex;'></div></div>");
            achiTotalStatus = $(`<div id='achiTotalStatus' style='padding-right: ${padLR};'></div>`);
            let achiShow = $(`<div style='width: ${AchiDivWid * AchiDivCol + 6}px; height: 100%; display:flex; flex-direction: column;'><div id='achiFilter'></div><div class='vscroll' style='flex-grow: 1;'><div id='achiList' style='height: 0;'></div></div></div>`);

            achiContent.children().eq(0).append(achiTotalStatus);
            achiContent.children().eq(0).append(achiShow);

            $("#histWindow").prepend(achiContent);
            $("#histTitleListWindow").append(smallAchiTitle);

            buildAchieve();
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
                achiData.complete[UniStoL[uni]][ach] = evolve.global.stats.achieve[ach][uni];
            });
        });

        //总计
        $("#achiTotalStatus").empty();
        $("#achiTotalStatus").append($("<div class='has-text-advanced'>成就统计</div>"));
        Object.keys(UniLtoS).forEach((uni) => {
            let compe = Object.keys(achiData.complete[uni]).length;
            let total = achiData.total[uni].length;
            $("#achiTotalStatus").append(`<tr><td>${evolve.loc("universe_" + uni)}：</td><td><span style='visibility:hidden;'>${Array(4 - (compe +  '').length).join("0")}</span>${compe} / ${total}<span style='visibility:hidden;'>${Array(7 - ((compe / total * 100).toFixed(2) +  '').length).join("0")}</span>（<span class="${+(compe == total ? 'has-text-warning' : '')}">${(compe / total * 100).toFixed(2)}%</span>）</td></tr>`);
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
                let starNum = (evolve.global.stats.achieve[ach] && evolve.global.stats.achieve[ach][UniLtoS[uniL]]) ? evolve.global.stats.achieve[ach][UniLtoS[uniL]] : 0;
                icon.append($(`<span title="${evolve.loc("universe_" + uniL)} ${starName[starNum]}"><svg class="svg star${starNum}" version="1.1" x="0px" y="0px" width="16px" height="16px" viewBox="${icons[uniL].viewbox}" xml:space="preserve" data-level="0">${icons[uniL].path}</svg></span>`))
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
                tempArr.spilce(tempIndex, 1);
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
        let smallfeaTitle = $("#smallfeaTitle");
        let feaContent = $("#feaContent");
        let featStatus = $("#featStatus");
        let pillarStatus = $("#pillarStatus");

        if(smallfeaTitle.length === 0)
        {
            smallfeaTitle = $("<div id='smallfeaTitle' class='has-text-advanced' onclick='(function (){if($(\"#feaContent\").css(\"display\") == \"none\"){$(\".sideHistWindow\").hide();$(\"#feaContent\").show();}else{$(\"#feaContent\").hide();}})()'>壮举</div>");
            feaContent = $("<div id='feaContent' class='sideHistWindow' style='height: inherit; display: none;'><div style='height: 100%; display:flex;'></div></div>");
            featStatus = $(`<div style='height: 100%; display:flex; flex-direction: column;'><div id='feaFilter'></div><div class='vscroll' style='flex-grow: 1;'><div id='feaList' style='width: ${FeatDivWid * FeatDivCol + 6}px; height: 0;'></div></div></div>`);
            pillarStatus = $(`<div style='height: 100%; display:flex; flex-direction: column;'><div id='pilFilter'></div><div class='vscroll' style='flex-grow: 1;'><div id='pilList' style='width: ${PillDivWid * PillDivCol + 6}px; height: 0;'></div></div></div>`);

            feaContent.children().eq(0).append(featStatus);
            feaContent.children().eq(0).append($(`<div style='width: ${padLR}; height: 100%;'></div>`));
            feaContent.children().eq(0).append(pillarStatus);

            $("#histWindow").prepend(feaContent);
            $("#histTitleListWindow").append(smallfeaTitle);

            buildFeat();
            buildPillar();
        }
    }

    function buildFeat()
    {
        $("#feaFilter").empty();
        $("#feaFilter").append($("<div class='has-text-advanced'>壮举统计</div>"));
        let compe = Object.keys(evolve.global.stats.feat).length;
        let total = Object.keys(feats).length;
        $("#feaFilter").append($(`<tr><td>完成率：</td><td><span style='visibility:hidden;'>${Array(3 - (compe +  '').length).join("0")}</span>${compe} / ${total}<span style='visibility:hidden;'>${Array(7 - ((compe / total * 100).toFixed(2) +  '').length).join("0")}</span>（<span class="${+(compe == total ? 'has-text-warning' : '')}">${(compe / total * 100).toFixed(2)}%</span>）</td></tr>`));

        let feaLevel = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[]};

        Object.keys(feats).forEach((fea) => {
            let starNum = evolve.global.stats.feat[fea] ? evolve.global.stats.feat[fea] : 0;
            feaLevel[starNum].push(fea);
            let icon = $(`<span title="${starName[starNum]}"><svg class="svg star${starNum}" version="1.1" x="0px" y="0px" width="16px" height="16px" viewBox="${icons.standard.viewbox}" xml:space="preserve" data-level="0">${icons.standard.path}</svg></span>`);
            let line = $(`<div style="width: ${FeatDivWid}px; display: inline-block;" class='featLine ${starNum}_star'><span title="${feats[fea].desc.apply().replace(/（.*）/, "")}">${feats[fea].name.apply().replace(/（.*）/, "")}</span></div>`);
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
        $("#pilFilter").append($(`<tr><td>完成率：</td><td><span style='visibility:hidden;'>${Array(3 - (compe +  '').length).join("0")}</span>${compe} / ${total}<span style='visibility:hidden;'>${Array(7 - ((compe / total * 100).toFixed(2) +  '').length).join("0")}</span>（<span class="${+(compe == total ? 'has-text-warning' : '')}">${(compe / total * 100).toFixed(2)}%</span>）</td></tr>`));

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

    function loc(key, variables)
    {
        return function(){return evolve.loc(key, variables)};
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

    const achieve_list = {
	    misc: [
	        'apocalypse','ascended','dreaded','anarchist','second_evolution','blackhole','warmonger',
	        'red_tactics','pacifist','neutralized','paradise','scrooge','madagascar_tree','godwin',
	        'laser_shark','infested','mass_starvation','colonist','world_domination','illuminati',
	        'syndicate','cult_of_personality','doomed','pandemonium','blood_war','landfill','seeder',
	        'miners_dream','shaken','blacken_the_sun','trade','resonance','enlightenment','gladiator',
	        'corrupted'
	    ],
	    species: [
	        'mass_extinction','extinct_human','extinct_elven','extinct_orc','extinct_cath','extinct_wolven','extinct_vulpine','extinct_centaur',
	        'extinct_rhinotaur','extinct_capybara','extinct_kobold','extinct_goblin',
	        //'extinct_rhinotaur','extinct_capybara','extinct_bearkin','extinct_porkenari','extinct_hedgeoken','extinct_kobold','extinct_goblin',
	        'extinct_gnome','extinct_ogre','extinct_cyclops','extinct_troll','extinct_tortoisan','extinct_gecko','extinct_slitheryn',
	        'extinct_arraak','extinct_pterodacti','extinct_dracnid','extinct_entish','extinct_cacti','extinct_pinguicula','extinct_sporgar',
	        'extinct_shroomi','extinct_moldling','extinct_mantis','extinct_scorpid','extinct_antid','extinct_sharkin','extinct_octigoran','extinct_dryad',
	        'extinct_satyr','extinct_phoenix','extinct_salamander','extinct_yeti','extinct_wendigo','extinct_tuskin','extinct_kamel','extinct_balorg',
	        'extinct_imp','extinct_seraph','extinct_unicorn','extinct_synth','extinct_nano','extinct_junker','extinct_sludge','extinct_custom'
	    ],
	    genus: [
	        'creator','genus_humanoid','genus_carnivore','genus_herbivore','genus_small','genus_giant','genus_reptilian','genus_avian',
	        //'creator','genus_humanoid','genus_carnivore','genus_omnivore','genus_herbivore','genus_small','genus_giant','genus_reptilian','genus_avian',
	        'genus_insectoid','genus_plant','genus_fungi','genus_aquatic','genus_fey','genus_heat','genus_polar','genus_sand','genus_demonic','genus_angelic','genus_synthetic'
	    ],
	    planet: [
	        'explorer','biome_grassland','biome_oceanic','biome_forest','biome_desert','biome_volcanic','biome_tundra','biome_hellscape','biome_eden',
	        'atmo_toxic','atmo_mellow','atmo_rage','atmo_stormy','atmo_ozone','atmo_magnetic','atmo_trashed','atmo_elliptical','atmo_flare','atmo_dense',
	        'atmo_unstable'
	    ],
	    universe: [
	        'vigilante','squished','double_density','cross','macro','marble','heavyweight','whitehole','heavy','canceled',
	        'eviltwin','microbang','pw_apocalypse','fullmetal','pass'
	    ],
	    challenge: ['joyless','steelen','dissipated','technophobe','wheelbarrow','iron_will','failed_history','banana','pathfinder','ashanddust','exodus','obsolete','gross'],
	}
	const feats = {
	    utopia: {
	        name: loc("feat_utopia_name"),
	        desc: loc("feat_utopia_desc"),
	        flair: loc("feat_utopia_flair")
	    },
	    take_no_advice: {
	        name: loc("feat_take_no_advice_name"),
	        desc: loc("feat_take_no_advice_desc"),
	        flair: loc("feat_take_no_advice_flair")
	    },
	    ill_advised: {
	        name: loc("feat_ill_advised_name"),
	        desc: loc("feat_ill_advised_desc"),
	        flair: loc("feat_ill_advised_flair")
	    },
	    organ_harvester: {
	        name: loc("feat_organ_harvester_name"),
	        desc: loc("feat_organ_harvester_desc"),
	        flair: loc("feat_organ_harvester_flair")
	    },
	    the_misery: {
	        name: loc("feat_the_misery_name"),
	        desc: loc("feat_the_misery_desc"),
	        flair: loc("feat_the_misery_flair")
	    },
	    energetic: {
	        name: loc("feat_energetic_name"),
	        desc: loc("feat_energetic_desc"),
	        flair: loc("feat_energetic_flair")
	    },
	    garbage_pie: {
	        name: loc("feat_garbage_pie_name"),
	        desc: loc("feat_garbage_pie_desc"),
	        flair: loc("feat_garbage_pie_flair")
	    },
	    finish_line: {
	        name: loc("feat_finish_line_name"),
	        desc: loc("feat_finish_line_desc"),
	        flair: loc("feat_finish_line_flair")
	    },
	    blank_slate: {
	        name: loc("feat_blank_slate_name"),
	        desc: loc("feat_blank_slate_desc"),
	        flair: loc("feat_blank_slate_flair")
	    },
	    supermassive: {
	        name: loc("feat_supermassive_name"),
	        desc: loc("feat_supermassive_desc"),
	        flair: loc("feat_supermassive_flair")
	    },
	    steelem: {
	        name: loc("feat_steelem_name"),
	        desc: loc("feat_steelem_desc"),
	        flair: loc("feat_steelem_flair")
	    },
	    banana: {
	        name: loc("feat_banana_name"),
	        desc: loc("feat_banana_desc",[500,500]),
	        flair: loc("feat_banana_flair")
	    },
	    rocky_road: {
	        name: loc("feat_rocky_road_name"),
	        desc: loc("feat_rocky_road_desc"),
	        flair: loc("feat_rocky_road_flair")
	    },
	    demon_slayer: {
	        name: loc("feat_demon_slayer_name"),
	        desc: loc("feat_demon_slayer_desc"),
	        flair: loc("feat_demon_slayer_flair")
	    },
	    equilibrium: {
	        name: loc("feat_equilibrium_name"),
	        desc: loc("feat_equilibrium_desc"),
	        flair: loc("feat_equilibrium_flair")
	    },
	    digital_ascension: {
	        name: loc("feat_digital_ascension_name"),
	        desc: loc("feat_digital_ascension_desc"),
	        flair: loc("feat_digital_ascension_flair")
	    },
	    novice: {
	        name: loc("feat_novice_name"),
	        desc: loc("feat_achievement_hunter_desc",[10]),
	        flair: loc("feat_novice_flair")
	    },
	    journeyman: {
	        name: loc("feat_journeyman_name"),
	        desc: loc("feat_achievement_hunter_desc",[25]),
	        flair: loc("feat_journeyman_flair")
	    },
	    adept: {
	        name: loc("feat_adept_name"),
	        desc: loc("feat_achievement_hunter_desc",[50]),
	        flair: loc("feat_adept_flair")
	    },
	    master: {
	        name: loc("feat_master_name"),
	        desc: loc("feat_achievement_hunter_desc",[75]),
	        flair: loc("feat_master_flair")
	    },
	    grandmaster: {
	        name: loc("feat_grandmaster_name"),
	        desc: loc("feat_achievement_hunter_desc",[100]),
	        flair: loc("feat_grandmaster_flair")
	    },
	    nephilim: {
	        name: loc("feat_nephilim_name"),
	        desc: loc("feat_nephilim_desc"),
	        flair: loc("feat_nephilim_flair")
	    },
	    twisted: {
	        name: loc("feat_twisted_name"),
	        desc: loc("feat_twisted_desc"),
	        flair: loc("feat_twisted_flair")
	    },
	    slime_lord: {
	        name: loc("feat_slime_lord_name"),
	        desc: loc("feat_slime_lord_desc"),
	        flair: loc("feat_slime_lord_flair")
	    },
	    friday: {
	        name: loc("feat_friday_name"),
	        desc: loc("feat_friday_desc"),
	        flair: loc("feat_friday_flair")
	    },
	    valentine: {
	        name: loc("feat_love_name"),
	        desc: loc("feat_love_desc"),
	        flair: loc("feat_love_flair")
	    },
	    leprechaun: {
	        name: loc("feat_leprechaun_name"),
	        desc: loc("feat_leprechaun_desc"),
	        flair: loc("feat_leprechaun_flair")
	    },
	    easter: {
	        name: loc("feat_easter_name"),
	        desc: loc("feat_easter_desc"),
	        flair: loc("feat_easter_flair")
	    },
	    egghunt: {
	        name: loc("feat_egghunt_name"),
	        desc: loc("feat_egghunt_desc"),
	        flair: loc("feat_egghunt_flair")
	    },
	    launch_day: {
	        name: loc("feat_launch_day_name"),
	        desc: loc("feat_launch_day_desc"),
	        flair: loc("feat_launch_day_flair")
	    },
	    solstice: {
	        name: loc("feat_solstice_name"),
	        desc: loc("feat_solstice_desc"),
	        flair: loc("feat_solstice_flair")
	    },
	    firework: {
	        name: loc("feat_firework_name"),
	        desc: loc("feat_firework_desc"),
	        flair: loc("feat_firework_flair")
	    },
	    halloween: {
	        name: loc("feat_boo_name"),
	        desc: loc("feat_boo_desc"),
	        flair: loc("feat_boo_flair")
	    },
	    trickortreat: {
	        name: loc("feat_trickortreat_name"),
	        desc: loc("feat_trickortreat_desc"),
	        flair: loc("feat_trickortreat_flair")
	    },
	    thanksgiving: {
	        name: loc("feat_gobble_gobble_name"),
	        desc: loc("feat_gobble_gobble_desc"),
	        flair: loc("feat_gobble_gobble_flair")
	    },
	    xmas: {
	        name: loc("feat_xmas_name"),
	        desc: loc("feat_xmas_desc"),
	        flair: loc("feat_xmas_flair")
	    },
	    fool: {
	        name: loc("feat_fool_name"),
	        desc: loc("feat_fool_desc"),
	        flair: loc("feat_fool_flair")
	    }
	}
	const universeExclusives = {
	    biome_hellscape: ['standard', 'micro', 'heavy', 'antimatter', 'magic'],
	    biome_eden: ['evil'],
	    cross: ['antimatter'],
	    vigilante: ['evil'],
	    squished: ['micro'],
	    macro: ['micro'],
	    marble: ['micro'],
	    double_density: ['heavy'],
	    heavyweight: ['heavy'],
	    whitehole: ['standard'],
	    heavy: ['heavy'],
	    canceled: ['antimatter'],
	    eviltwin: ['evil'],
	    microbang: ['micro'],
	    pw_apocalypse: ['magic'],
	    pass: ['magic'],
	    fullmetal: ['magic']
	}
	const icons = {
    	standard: {
    		path: '<path d="M320.012 15.662l88.076 215.246L640 248.153 462.525 398.438l55.265 225.9-197.778-122.363-197.778 122.363 55.264-225.9L0 248.153l231.936-17.245z" />',
    		viewbox: '0 0 640 640'
    	},
    	heavy: {
    		path: '<path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />',
    		viewbox: '0 0 24 24'
    	},
    	micro: {
    		path: '<path d="m150.18 114.71c-11.276-6.0279-15.771-19.766-9.9989-30.563 6.0279-11.276 19.766-15.771 30.563-9.9989 11.276 6.0279 15.771 19.766 9.9989 30.563-6.0279 11.276-19.766 15.771-30.563 9.9989z" /><path d="m47.263 265.24c-0.41891-0.4189-0.76165-5.194-0.76165-10.611 0-11.606 2.7184-18.417 9.0231-22.606 3.8412-2.5527 4.2946-2.5798 43.128-2.5798h39.246v-13.71-13.71h10.905c10.055 0 11.124-0.2186 13.71-2.8043 2.5824-2.5824 2.8043-3.66 2.8043-13.619v-10.815l3.3639-0.73883c1.8501-0.40636 5.1713-2.7395 7.3804-5.1847 8.0637-8.9255 9.8103-25.642 3.9223-37.54l-2.9588-5.9787 5.9675-5.9676c9.887-9.887 12.537-24.129 6.6886-35.949-1.3037-2.635-2.1165-4.7908-1.8062-4.7908 0.31024 0 3.5239 1.798 7.1414 3.9955 14.491 8.8026 26.675 25.759 31.636 44.025 2.7168 10.004 2.7314 30.947 0.0286 41.093-4.445 16.685-15.856 33.364-29.027 42.425l-4.9176 3.3834v7.9424 7.9424h10.966c12.713 0 17.226 1.5998 21.944 7.7794 2.828 3.7038 3.1086 5.033 3.464 16.405l0.4 12.38h-90.737c-49.906 0-91.08-0.34274-91.499-0.76165zm17.518-81.497v-9.1398h45.699 45.699v9.1398 9.1398h-45.699-45.699v-9.1398zm32.227-32.318-4.8078-4.8988v-13.72-13.72l-4.5699-4.4624-4.5699-4.4624v-27.527-27.527l4.5699-4.4624c4.5593-4.452 4.5699-4.4831 4.5699-13.37 0-8.6703-0.07402-8.9079-2.7746-8.9079-4.4514 0-6.3652-2.8757-6.3652-9.5641 0-3.2854 0.61694-6.5904 1.371-7.3445 1.9422-1.9422 50.155-1.9422 52.097 0 0.75403 0.75403 1.371 4.3347 1.371 7.9571 0 6.9911-1.4848 8.9515-6.7797 8.9515-2.1833 0-2.3601 0.66715-2.3601 8.9079 0 8.8872 0.0103 8.9183 4.5699 13.37l4.5699 4.4624v9.5554c0 8.412-0.33908 10-2.8338 13.271-6.443 8.4472-7.9966 20.22-4.0419 30.628 2.2572 5.9405 2.2572 5.9661 0 8.3688-1.997 2.1258-2.2642 4.0244-2.2642 16.094v13.684l-4.8988 4.8078c-4.877 4.7864-4.9369 4.8078-13.472 4.8078h-8.5731l-4.8078-4.8988z" />',
    		viewbox: '0 0 276 276'
    	},
    	evil: {
    		path: '<path d="m105.63 236.87c-17.275-2.22-34.678-8.73-49.291-18.44-54.583-36.26-69.355-108.23-33.382-162.64 11.964-18.101 31.389-34.423 51.05-42.899 36.303-15.652 78.013-12.004 110.65 9.678 54.58 36.259 69.36 108.23 33.38 162.65-24.44 36.97-68.62 57.27-112.41 51.65zm9.37-7.17c0-1.12-15.871-50.86-20.804-65.2l-1.719-5-36.926-0.26c-20.309-0.15-37.284 0.09-37.721 0.53-1.104 1.1 4.147 11.87 10.535 21.59 16.439 25.04 41.149 41.59 71.135 47.65 11.07 2.24 15.5 2.44 15.5 0.69zm25.71-0.61c30.52-5.95 55.28-22.38 71.92-47.73 6.39-9.72 11.64-20.49 10.54-21.59-0.44-0.44-17.41-0.68-37.72-0.53l-36.93 0.26-1.72 5c-4.93 14.34-20.8 64.08-20.8 65.2 0 1.77 3.2 1.64 14.71-0.61zm-9.32-38.99c5.25-16.18 9.3-29.79 9.01-30.25-0.28-0.47-9.24-0.85-19.9-0.85s-19.62 0.38-19.9 0.85c-0.46 0.74 17.66 58.14 19.08 60.43 0.3 0.49 0.91 0.52 1.36 0.06s5.11-14.07 10.35-30.24zm-42.19-38.63c0.629-0.63-10.723-36.39-11.936-37.61-0.817-0.81-51.452 35.32-52.097 37.18-0.349 1 63.032 1.43 64.033 0.43zm61.27-20.06c3.65-11.32 6.51-21.41 6.34-22.42-0.32-1.86-34.12-26.99-36.31-26.99s-35.993 25.13-36.308 26.99c-0.169 1.01 2.683 11.1 6.339 22.42l6.647 20.59h46.642l6.65-20.59zm65.36 19.63c-0.64-1.86-51.28-37.99-52.09-37.18-1.22 1.22-12.57 36.98-11.94 37.61 1 1 64.38 0.57 64.03-0.43zm-169.97-24.02c16.09-11.7 29.071-21.78 28.847-22.4-0.397-1.09-12.185-37.499-18.958-58.555-1.846-5.739-3.951-10.632-4.678-10.875-0.727-0.242-4.903 3.259-9.28 7.78-22 22.72-32.81 50.641-31.513 81.39 0.678 16.09 2.371 24.97 4.646 24.37 0.925-0.24 14.846-10.01 30.936-21.71zm183.14 15.73c0.66-3.44 1.44-11.71 1.72-18.39 1.3-30.749-9.51-58.67-31.51-81.39-4.38-4.521-8.55-8.022-9.28-7.78-0.73 0.243-2.83 5.136-4.68 10.875-1.84 5.739-6.93 21.448-11.29 34.908-6.26 19.297-7.68 24.717-6.7 25.627 3.41 3.18 58.29 42.4 59.32 42.4 0.68 0 1.73-2.72 2.42-6.25zm-129.27-54.808c7.573-5.522 13.773-10.467 13.773-10.987 0-1.007-50.318-37.955-51.689-37.955-0.446 0-0.811 0.317-0.811 0.704 0 0.388 3.825 12.484 8.5 26.882s8.5 26.401 8.5 26.674 0.697 2.163 1.548 4.201c1.832 4.389-0.216 5.349 20.179-9.519zm66.613-5.442c3.03-9.35 7.35-22.629 9.59-29.508 4.36-13.403 4.5-13.992 3.26-13.992-1.39 0-51.69 36.953-51.69 37.971 0 1.477 31.75 24.189 32.58 23.309 0.4-0.431 3.22-8.43 6.26-17.78zm-14.4-32.538l29.32-21.329-2.37-1.927c-10.93-8.844-38.4-16.706-58.39-16.706s-47.464 7.862-58.388 16.708l-2.382 1.929 29.885 21.728c16.845 12.25 30.565 21.552 31.435 21.326 0.86-0.22 14.75-9.999 30.89-21.729z" />',
    		viewbox: '0 0 240 240'
    	},
    	antimatter: {
    		path: '<path d="m100 44.189c0-6.796-10.63-11.822-24.783-14.529 1.155-3.322 2.105-6.538 2.764-9.541 2.193-10.025 1.133-16.856-2.981-19.231-1.019-0.588-2.193-0.888-3.49-0.888-5.62 0-13.46 5.665-21.509 15-8.046-9.335-15.886-15-21.511-15-1.294 0-2.47 0.3-3.491 0.888-5.891 3.4-4.918 15.141-0.175 28.767-14.173 2.701-24.824 7.731-24.824 14.534 0 6.799 10.634 11.822 24.79 14.531-1.161 3.323-2.11 6.536-2.767 9.539-2.194 10.027-1.136 16.857 2.976 19.231 1.021 0.589 2.197 0.886 3.491 0.886 5.625 0 13.464-5.667 21.511-14.998 8.047 9.331 15.886 15 21.509 15 1.297 0 2.472-0.299 3.49-0.888 4.114-2.374 5.174-9.204 2.98-19.231-0.658-3.003-1.608-6.216-2.766-9.539 14.156-2.708 24.786-7.732 24.786-14.531zm-28.49-41.605c0.838 0 1.579 0.187 2.199 0.543 3.016 1.741 3.651 7.733 1.747 16.44-0.661 3.022-1.628 6.264-2.814 9.63-4.166-0.695-8.585-1.194-13.096-1.49-2.572-3.887-5.206-7.464-7.834-10.67 7.581-8.861 14.934-14.453 19.798-14.453zm-9.198 48.71c-1.375 2.379-2.794 4.684-4.242 6.9-2.597 0.132-5.287 0.206-8.069 0.206s-5.474-0.074-8.067-0.206c-1.452-2.217-2.87-4.521-4.242-6.9-1.388-2.406-2.669-4.771-3.849-7.081 1.204-2.369 2.477-4.753 3.851-7.13 1.37-2.377 2.79-4.68 4.24-6.901 2.593-0.131 5.285-0.205 8.067-0.205s5.473 0.074 8.069 0.205c1.448 2.222 2.866 4.524 4.239 6.901 1.37 2.37 2.64 4.747 3.842 7.106-1.202 2.362-2.471 4.739-3.839 7.105zm5.259-4.225c1.587 3.303 3 6.558 4.2 9.72-3.25 0.521-6.758 0.926-10.488 1.203 1.104-1.75 2.194-3.554 3.265-5.404 1.062-1.837 2.059-3.681 3.023-5.519zm-11.277 13.78c-2.068 3.019-4.182 5.854-6.293 8.444-2.109-2.591-4.22-5.426-6.294-8.444 2.095 0.088 4.196 0.138 6.294 0.138 2.099-0.001 4.201-0.05 6.293-0.138zm-17.573-2.857c-3.733-0.277-7.241-0.683-10.49-1.203 1.202-3.157 2.611-6.414 4.197-9.72 0.97 1.858 1.979 3.701 3.026 5.519 1.071 1.85 2.161 3.654 3.267 5.404zm-6.304-16.654c-1.636-3.389-3.046-6.653-4.226-9.741 3.26-0.52 6.781-0.931 10.53-1.212-1.107 1.751-2.197 3.553-3.268 5.407-1.067 1.847-2.065 3.701-3.036 5.546zm11.294-13.805c2.07-3.019 4.181-5.855 6.29-8.449 2.111 2.594 4.225 5.43 6.293 8.449-2.093-0.091-4.194-0.14-6.293-0.14-2.098 0.001-4.199 0.049-6.29 0.14zm20.837 8.259c-1.07-1.859-2.16-3.656-3.265-5.407 3.73 0.281 7.238 0.687 10.488 1.205-1.2 3.157-2.613 6.419-4.2 9.722-0.964-1.838-1.961-3.683-3.023-5.52zm-38.254-32.665c0.619-0.359 1.36-0.543 2.196-0.543 4.864 0 12.217 5.592 19.8 14.453-2.626 3.206-5.262 6.783-7.834 10.67-4.526 0.296-8.962 0.802-13.144 1.5-4.886-13.794-5.036-23.762-1.018-26.08zm-23.709 41.062c0-4.637 8.707-9.493 23.096-12.159 1.487 3.974 3.268 8.069 5.277 12.14-2.061 4.14-3.843 8.229-5.323 12.167-14.364-2.664-23.05-7.516-23.05-12.148zm25.905 41.605c-0.848 0-1.564-0.178-2.196-0.538-3.015-1.742-3.652-7.734-1.746-16.442 0.662-3.023 1.626-6.269 2.814-9.633 4.166 0.696 8.586 1.195 13.092 1.491 2.574 3.885 5.207 7.462 7.834 10.671-7.58 8.86-14.934 14.451-19.798 14.451zm46.962-16.981c1.907 8.708 1.272 14.7-1.743 16.442-0.623 0.355-1.361 0.539-2.199 0.539-4.864 0-12.217-5.592-19.798-14.452 2.628-3.209 5.262-6.786 7.837-10.671 4.508-0.296 8.927-0.795 13.093-1.491 1.186 3.365 2.153 6.61 2.81 9.633zm-1.086-12.475c-1.476-3.933-3.254-8.014-5.31-12.148 2.056-4.135 3.834-8.217 5.312-12.148 14.361 2.665 23.049 7.519 23.049 12.148 0 4.631-8.688 9.483-23.051 12.148z" />',
    		viewbox: '0 0 100 88.379'
    	},
    	magic: {
    		path: '<path d="m 2077.0957,2355.0556 c -24.8548,-6.6306 -43.8442,-12.4931 -65.1438,-20.1115 -171.2303,-61.2458 -332.546,-186.5828 -484.656,-376.562 -106.9479,-133.5736 -211.9033,-304.0752 -307.5304,-499.5874 -70.9505,-145.0603 -137.2376,-301.6744 -201.0755,-475.07329 -4.0445,-10.9859 -7.4891,-20.1129 -7.6546,-20.2824 -0.1656,-0.1694 -2.0374,1.7618 -4.1597,4.2917 -41.97221,50.03289 -102.85691,112.12769 -165.25321,168.53769 -153.4012,138.6841 -322.8342,254.6704 -451.2868,308.9308 -4.8375,2.0435 -9.6944,4.102 -10.793,4.5744 l -1.9977,0.8591 14.4133,7.0194 c 72.3515,35.2357 143.3639,78.5554 206.1228,125.7414 218.7562,164.4739 368.1707,393.9487 437.81411,672.4065 3.7109,14.8375 9.1943,38.7303 9.0117,39.2665 -0.069,0.2024 -1.3235,-3.0502 -2.788,-7.228 -74.09121,-211.3582 -207.71511,-385.1177 -394.71211,-513.2685 -102.107,-69.9749 -219.4845,-126.1019 -348.488,-166.6383 -76.1077,-23.9151 -155.9429,-42.2005 -232.883496,-53.3396 -6.991,-1.0121 -12.8528,-1.8883 -13.0261,-1.947 -0.1733,-0.059 2.0738,-1.6288 4.9936,-3.4891 2.9198,-1.8603 15.625,-10.0516 28.2339,-18.2031 204.092496,-131.9427 358.291896,-247.07 478.472596,-357.2338 37.0992,-34.0071 77.0506,-73.8638 107.6314,-107.3762 86.2451,-94.51319 148.9362,-188.57859 189.3356,-284.08999 30.7863,-72.7845 49.1302,-147.8337 55.0585,-225.2576 0.8677,-11.3324 1.6179,-24.3907 1.6179,-28.1635 l 0,-2.8677 -2.3833,-0.2589 c -5.6397,-0.6126 -53.3922,-2.328 -84.3238,-3.0291 -26.1322,-0.5923 -105.9829,-0.2965 -125.748,0.4658 -35.3648,1.3639 -61.1426,2.7941 -86.7072,4.8105 -195.6367,15.431 -343.0035,61.1297 -446.9275,138.593 -2.4968,1.8611 -4.029,2.8664 -3.4048,2.2341 0.9758,-0.9885 397.2225,-336.9788 399.0477,-338.3654 0.4983,-0.3785 8.2687,0.05 30.6293,1.691 273.5285,20.0676 411.83311,27.9616 556.33281,31.7538 29.6737,0.7788 110.952,1.0595 138.2321,0.4775 83.5286,-1.7821 143.7695,-6.6707 194.0695,-15.7487 47.0041,-8.4831 83.1621,-21.2812 103.3974,-36.5973 1.6154,-1.2226 2.9812,-2.1619 3.0353,-2.0872 0.054,0.075 -0.079,2.1785 -0.2952,4.6753 -0.578,6.6693 -0.5481,29.498 0.048,36.3171 3.3368,38.2002 14.0507,70.8483 33.8884,103.2667 18.8519,30.8073 47.6861,61.0826 82.1419,86.2473 37.3245,27.2597 81.564,49.9843 131.8765,67.7412 4.8688,1.7184 8.2555,3.0024 7.5259,2.8535 -0.7295,-0.1489 -6.3473,-1.3924 -12.484,-2.7634 -39.6642,-8.861 -104.6887,-20.5993 -168.0021,-30.328 -137.3768,-21.1093 -273.1583,-35.4146 -362.8049,-38.2235 l -9.8479,-0.3086 -0.224,1.0898 c -0.1233,0.5995 -0.335,2.5199 -0.4706,4.2677 -1.3397,17.2691 -1.7023,22.4205 -2.2846,32.4584 -2.3935,41.2643 -2.3955,89.1364 -0.01,134.8273 11.3803,217.5701 77.3475,473.27869 189.8401,735.87559 89.2575,208.3584 210.5193,422.3508 332.3606,586.5215 22.7139,30.605 33.0709,42.8702 44.5166,52.7187 25.6187,22.0437 46.811,23.8716 65.2335,5.6265 19.5207,-19.3327 34.7161,-60.9422 45.5423,-124.7077 19.3386,-113.9042 23.2932,-297.6572 10.9059,-506.7671 -4.6678,-78.7985 -10.1013,-140.5522 -20.8699,-237.1961 -5.9357,-53.2693 -7.4546,-65.7004 -8.6502,-70.7914 -4.7369,-20.171 -27.3114,-47.5028 -65.7926,-79.6576 -11.906,-9.9486 -20.1748,-16.4224 -39.1544,-30.6551 -8.4267,-6.3191 -15.3189,-11.6171 -15.3159,-11.7734 0,-0.1563 1.2797,-0.9816 2.8373,-1.8339 14.6036,-7.9917 42.9197,-26.1494 64.2088,-41.17369 35.0761,-24.7546 77.4208,-59.2093 108.4143,-88.2139 58.9609,-55.1774 106.4613,-109.4316 139.8321,-159.7139 2.693,-4.0578 4.9524,-7.3218 5.0209,-7.2532 0.069,0.068 -0.9793,4.6953 -2.3284,10.2819 -52.0714,215.624 -73.4586,458.30359 -63.0753,715.71049 8.1008,200.8217 36.667,415.9599 82.2909,619.7502 l 2.6625,11.8924 -4.124,2.8336 c -25.7438,17.6888 -44.4201,32.0283 -57.3292,44.017 -19.4405,18.0544 -30.6873,35.3946 -36.0405,55.5665 -3.2336,12.1849 -4.2393,21.7435 -4.2035,39.9489 0.043,21.9591 1.571,38.7035 9.4024,103.0498 1.3371,10.9859 2.4091,19.9949 2.3823,20.0199 -0.027,0.025 -1.8874,-0.445 -4.1345,-1.0444 z m 326.7144,-985.6489 c -17.4427,-32.7693 -52.6734,-76.4714 -96.8446,-120.1314 -30.3662,-30.0148 -57.7931,-52.8046 -81.5396,-67.7535 -6.8082,-4.2859 -19.6404,-11.0063 -22.8544,-11.9693 -0.9739,-0.2918 -1.7706,-0.6524 -1.7706,-0.8014 0,-0.149 1.2767,-0.754 2.8373,-1.3444 8.1023,-3.0654 22.7254,-11.5869 35.2957,-20.5684 21.4993,-15.3612 43.2465,-34.1516 68.6986,-59.358 42.609,-42.1976 76.3979,-83.8447 94.6619,-116.67699 2.2626,-4.0672 4.2245,-7.6252 4.36,-7.9065 0.1826,-0.3795 0.3097,-0.3795 0.4923,0 0.1354,0.2813 2.0845,3.8162 4.3314,7.8552 18.2956,32.88899 52.1844,74.66389 94.6871,116.72119 25.6446,25.3759 47.2008,44.0026 68.702,59.3651 12.5703,8.9815 27.1934,17.503 35.2957,20.5684 1.5605,0.5904 2.8373,1.1777 2.8373,1.3051 0,0.1274 -1.2768,0.7145 -2.8373,1.305 -1.5605,0.5904 -5.6973,2.5407 -9.1928,4.334 -24.7032,12.6736 -57.8306,39.0407 -94.1346,74.9245 -44.1711,43.66 -79.4018,87.3621 -96.8445,120.1314 -1.5749,2.9588 -2.9656,5.3796 -3.0904,5.3796 -0.1249,0 -1.5156,-2.4208 -3.0905,-5.3796 z M 166.36129,670.71331 c 0.452,-0.4994 0.9239,-0.9079 1.0487,-0.9079 0.1248,0 -0.1428,0.4085 -0.5947,0.9079 -0.4519,0.4993 -0.9238,0.9079 -1.0487,0.9079 -0.1248,0 0.1428,-0.4086 0.5947,-0.9079 z"/>',
            viewbox: '0 0 2666 2666'
    	},
    	checkmark: {
    		path: '<path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" />',
    		viewbox: '0 0 20 20'
    	}
    };

})();