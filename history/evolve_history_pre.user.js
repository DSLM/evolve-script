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
            let histContent = $("<div id='histContent' class='resource alt sideContentWindow' style='height: 100%; display: none;'><div id='histFlexContent' style='height: 100%;display:flex;flex-direction: column;justify-content: space-between;'><div class='has-text-caution' style='text-align: center;'>数据统计</div></div></div>");

            let histWindow = $("<div id='histWindow' style='height: 100%; display:flex; flex-direction: row; justify-content: flex-end; align-items: flex-end; flex-grow: 1;'><div id='histTitleListWindow' style='height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end;'></div></div>");

            histContent.children().eq(0).append(histWindow);

            sideWindow.prepend(histContent);
            $("#titleListWindow").append(smallHistTitle);
        }

        histRecord();
        spireTimeDataFunc();
        achieveStat();
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
            achiTotalStatus = $("<div id='achiTotalStatus'></div>");
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
            let desc = evolve.loc(`achieve_${ach}_desc`).replace(/（.*）/, "");;

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
                    star += `type_${typ} `;
                });
            }

            //图标
            let icon = $("<span></span>")
            Object.keys(UniLtoS).forEach((uniL) => {
                let starNum = (evolve.global.stats.achieve[ach] && evolve.global.stats.achieve[ach][UniLtoS[uniL]]) ? evolve.global.stats.achieve[ach][UniLtoS[uniL]] : 0;
                icon.append($(`<span title="${evolve.loc("universe_" + uniL)} ${starName[starNum]}"><svg class="svg star${starNum}" version="1.1" x="0px" y="0px" width="16px" height="16px" viewBox="${icons[uniL].viewbox}" xml:space="preserve" data-level="0">${icons[uniL].path}</svg></span>`))
            });

            let line = $(`<div style="display:inline-block; width:${AchiDivWid}px;" class='achiLine ${uni} ${star} '><span title="${desc}">${name}</span></div>`);
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

    //此处插入数据
})();
