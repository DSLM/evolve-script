// ==UserScript==
// @name         历史数据统计
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  try to take over the world!
// @downloadURL  https://github.com/DSLM/evolve-script/raw/master/evolve_history.user.js
// @author       DSLM
// @match        https://likexia.gitee.io/evolve/
// @match        https://pmotschmann.github.io/Evolve/
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    var histF_times = 0
    var histF;
    var HIST_RESET_LIMIT = 20
    var HIST_SPIRE_LIMIT = 200
    var spirePrepared = false

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
        histRecord();
        spireTimeDataFunc();
    }

    function histRecord()
    {

        //未完全加载
        if(evolve.global == undefined) return;

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
})();
