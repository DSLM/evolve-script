// ==UserScript==
// @name         自动增删特质
// @namespace    http://tampermonkey.net/
// @version      1.1.4.1
// @description  try to take over the world!
// @downloadURL  https://github.com/DSLM/evolve-script/raw/master/traits/evolve_traits.user.js
// @author       DSLM
// @match        https://g8hh.github.io/evolve/
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
        orangeSoda:{background_color:"#131516", alt_color:"#292929", primary_border:"#313638", primary_color:"#EBDBB2"},
        dracula:{background_color:"#282a36", alt_color:"#1d2021", primary_border:"#44475a", primary_color:"#f8f8f2"}
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

    const traits = {
	    adaptable: { // Genetic Mutations occur faster from gene tampering
	        name: loc('trait_adaptable_name'),
	        desc: loc('trait_adaptable'),
	        type: 'genus',
	        val: 3,
	        vars(r){ 
	            switch (r || evolve.global.race.adaptable || 1){
	                case 0.25:
	                    return [3];
	                case 0.5:
	                    return [5];
	                case 1:
	                    return [10];
	                case 2:
	                    return [15];
	                case 3:
	                    return [20];
	            }
	        },
	    },
	    wasteful: { // Craftings cost more materials
	        name: loc('trait_wasteful_name'),
	        desc: loc('trait_wasteful'),
	        type: 'genus',
	        val: -3,
	        vars(r){ 
	            switch (r || evolve.global.race.wasteful || 1){
	                case 0.25:
	                    return [14];
	                case 0.5:
	                    return [12];
	                case 1:
	                    return [10];
	                case 2:
	                    return [6];
	                case 3:
	                    return [4];
	            }
	        },
	    },
	    xenophobic: { // Trade posts suffer a -1 penalty per post
	        name: loc('trait_xenophobic_name'),
	        desc: loc('trait_xenophobic'),
	        type: 'genus',
	        val: -5,
	    },
	    carnivore: { // No agriculture tech tree path, however unemployed citizens now act as hunters.
	        name: loc('trait_carnivore_name'),
	        desc: loc('trait_carnivore'),
	        type: 'genus',
	        val: 3,
	    },
	    beast: { // Improved hunting and soldier training
	        name: loc('trait_beast_name'),
	        desc: loc('trait_beast'),
	        type: 'genus',
	        val: 2,
	        vars(r){
	            // [Hunting, Windy Hunting, Training Speed]
	            switch (r || evolve.global.race.beast || 1){
	                case 0.25:
	                    return [4,8,4];
	                case 0.5:
	                    return [5,10,5];
	                case 1:
	                    return [8,15,10];
	                case 2:
	                    return [10,20,15];
	                case 3:
	                    return [12,24,20];
	            }
	        },
	    },
	    cautious: { // Rain reduces combat rating
	        name: loc('trait_cautious_name'),
	        desc: loc('trait_cautious'),
	        type: 'genus',
	        val: -2,
	        vars(r){ 
	            switch (r || evolve.global.race.cautious || 1){
	                case 0.25:
	                    return [14];
	                case 0.5:
	                    return [12];
	                case 1:
	                    return [10];
	                case 2:
	                    return [8];
	                case 3:
	                    return [6];
	            }
	        },
	    },
	    herbivore: { // No food is gained from hunting
	        name: loc('trait_herbivore_name'),
	        desc: loc('trait_herbivore'),
	        type: 'genus',
	        val: -7,
	    },
	    instinct: { // Avoids Danger
	        name: loc('trait_instinct_name'),
	        desc: loc('trait_instinct'),
	        type: 'genus',
	        val: 5,
	        vars(r){
	            // [Surveyor Survival Boost, Reduce Combat Deaths %]
	            switch (r || evolve.global.race.instinct || 1){
	                case 0.25:
	                    return [3,15];
	                case 0.5:
	                    return [5,25];
	                case 1:
	                    return [10,50];
	                case 2:
	                    return [15,60];
	                case 3:
	                    return [20,65];
	            }
	        },
	    },
	    /*forager: { // Will eat just about anything
	        name: loc('trait_forager_name'),
	        desc: loc('trait_forager'),
	        type: 'genus',
	        val: 2,
	    },*/
	    small: { // Reduces cost creep multipliers by 0.01
	        name: loc('trait_small_name'),
	        desc: loc('trait_small'),
	        type: 'genus',
	        val: 6,
	        vars(r){
	            // [Planet Creep, Space Creep]
	            switch (r || evolve.global.race.small || 1){
	                case 0.25:
	                    return [0.0025,0.0015];
	                case 0.5:
	                    return [0.005,0.0025];
	                case 1:
	                    return [0.01,0.005];
	                case 2:
	                    return [0.0125,0.006];
	                case 3:
	                    return [0.015,0.0075];
	            }
	        },
	    },
	    weak: { // Lumberjacks, miners, and quarry workers are 10% less effective
	        name: loc('trait_weak_name'),
	        desc: loc('trait_weak'),
	        type: 'genus',
	        val: -3,
	        vars(r){
	            switch (r || evolve.global.race.weak || 1){
	                case 0.25:
	                    return [14];
	                case 0.5:
	                    return [12];
	                case 1:
	                    return [10];
	                case 2:
	                    return [8];
	                case 3:
	                    return [6];
	            }
	        },
	    },
	    large: { // Increases plantery cost creep multipliers by 0.005
	        name: loc('trait_large_name'),
	        desc: loc('trait_large'),
	        type: 'genus',
	        val: -5,
	        vars(r){
	            switch (r || evolve.global.race.large || 1){
	                case 0.25:
	                    return [0.007];
	                case 0.5:
	                    return [0.006];
	                case 1:
	                    return [0.005];
	                case 2:
	                    return [0.004];
	                case 3:
	                    return [0.003];
	            }
	        },
	    },
	    strong: { // Increased manual resource gain
	        name: loc('trait_strong_name'),
	        desc: loc('trait_strong'),
	        type: 'genus',
	        val: 1,
	        vars(r){
	            switch (r || evolve.global.race.strong || 1){
	                case 0.25:
	                    return [2];
	                case 0.5:
	                    return [3];
	                case 1:
	                    return [5];
	                case 2:
	                    return [8];
	                case 3:
	                    return [10];
	            }
	        },
	    },
	    cold_blooded: { // Weather affects productivity
	        name: loc('trait_cold_blooded_name'),
	        desc: loc('trait_cold_blooded'),
	        type: 'genus',
	        val: -2,
	        vars(r){
	            // [Weather Penalty, Weather Bonus]
	            switch (r || evolve.global.race.cold_blooded || 1){
	                case 0.25:
	                    return [30,6];
	                case 0.5:
	                    return [25,8];
	                case 1:
	                    return [20,10];
	                case 2:
	                    return [15,15];
	                case 3:
	                    return [12,18];
	            }
	        },
	    },
	    scales: { // Minor decrease of soldiers killed in combat
	        name: loc('trait_scales_name'),
	        desc: loc('trait_scales'),
	        type: 'genus',
	        val: 5,
	        vars(r){
	            // [Win, Loss, Hell]
	            switch (r || evolve.global.race.scales || 1){
	                case 0.25:
	                    return [1,0,1];
	                case 0.5:
	                    return [1,1,1];
	                case 1:
	                    return [2,1,1];
	                case 2:
	                    return [2,2,1];
	                case 3:
	                    return [2,2,2];
	            }
	        },
	    },
	    hollow_bones: { // Less Crafted Materials Needed
	        name: loc('trait_hollow_bones_name'),
	        desc: loc('trait_hollow_bones'),
	        type: 'genus',
	        val: 3,
	        vars(r){
	            switch (r || evolve.global.race.hollow_bones || 1){
	                case 0.25:
	                    return [1];
	                case 0.5:
	                    return [2];
	                case 1:
	                    return [5];
	                case 2:
	                    return [8];
	                case 3:
	                    return [10];
	            }
	        },
	    },
	    rigid: { // Crafting production lowered slightly
	        name: loc('trait_rigid_name'),
	        desc: loc('trait_rigid'),
	        type: 'genus',
	        val: -1,
	        vars(r){
	            switch (r || evolve.global.race.rigid || 1){
	                case 0.25:
	                    return [3];
	                case 0.5:
	                    return [2];
	                case 1:
	                    return [1];
	                case 2:
	                    return [0.5];
	                case 3:
	                    return [0.4];
	            }
	        },
	    },
	    high_pop: { // Population is higher, but less productive
	        name: loc('trait_high_pop_name'),
	        desc: loc('trait_high_pop'),
	        type: 'genus',
	        val: 3,
	        vars(r){
	            // [Citizen Cap, Worker Effectiveness, Growth Multiplier]
	            switch (r || evolve.global.race.high_pop || 1){
	                case 0.25:
	                    return [2, 50, 1.5];
	                case 0.5:
	                    return [3, 34, 2.5];
	                case 1:
	                    return [4, 26, 3.5];
	                case 2:
	                    return [5, 21.2, 4.5];
	                case 3:
	                    return [6, 18, 5.5];
	            }
	        },
	    },
	    fast_growth: { // Greatly increases odds of population growth each cycle
	        name: loc('trait_fast_growth_name'),
	        desc: loc('trait_fast_growth'),
	        type: 'genus',
	        val: 2,
	        vars(r){
	            // [bound multi, bound add]
	            switch (r || evolve.global.race.fast_growth || 1){
	                case 0.25:
	                    return [1.5,1];
	                case 0.5:
	                    return [2,1];
	                case 1:
	                    return [2,2];
	                case 2:
	                    return [2.5,3];
	                case 3:
	                    return [3,3];
	            }
	        },
	    },
	    high_metabolism: { // Food requirements increased by 5%
	        name: loc('trait_high_metabolism_name'),
	        desc: loc('trait_high_metabolism'),
	        type: 'genus',
	        val: -1,
	        vars(r){
	            switch (r || evolve.global.race.high_metabolism || 1){
	                case 0.25:
	                    return [10];
	                case 0.5:
	                    return [8];
	                case 1:
	                    return [5];
	                case 2:
	                    return [2];
	                case 3:
	                    return [1];
	            }
	        },
	    },
	    photosynth: { // Reduces food requirements dependant on sunshine.
	        name: loc('trait_photosynth_name'),
	        desc: loc('trait_photosynth'),
	        type: 'genus',
	        val: 3,
	        vars(r){
	            // [Sunny, Cloudy, Rainy]
	            switch (r || evolve.global.race.photosynth || 1){
	                case 0.25:
	                    return [10,5,4];
	                case 0.5:
	                    return [20,10,5];
	                case 1:
	                    return [40,20,10];
	                case 2:
	                    return [50,30,15];
	                case 3:
	                    return [60,35,20];
	            }
	        },
	    },
	    sappy: { // Stone is replaced with Amber.
	        name: loc('trait_sappy_name'),
	        desc: loc('trait_sappy',[loc('resource_Amber_name')]),
	        type: 'genus',
	        val: 4,
	        vars(r){
	            switch (r || evolve.global.race.sappy || 1){
	                case 0.25:
	                    return [0.4];
	                case 0.5:
	                    return [0.5];
	                case 1:
	                    return [0.6];
	                case 2:
	                    return [0.65];
	                case 3:
	                    return [0.7];
	            }
	        },
	    },
	    asymmetrical: { // Trade selling prices are slightly worse then normal
	        name: loc('trait_asymmetrical_name'),
	        desc: loc('trait_asymmetrical'),
	        type: 'genus',
	        val: -3,
	        vars(r){
	            switch (r || evolve.global.race.asymmetrical || 1){
	                case 0.25:
	                    return [30];
	                case 0.5:
	                    return [25];
	                case 1:
	                    return [20];
	                case 2:
	                    return [15];
	                case 3:
	                    return [10];
	            }
	        },
	    },
	    detritivore: { // You eat dead matter
	        name: loc('trait_detritivore_name'),
	        desc: loc('trait_detritivore'),
	        type: 'genus',
	        val: 2,
	        vars(r){
	            switch (r || evolve.global.race.detritivore || 1){
	                case 0.25:
	                    return [65];
	                case 0.5:
	                    return [72];
	                case 1:
	                    return [80];
	                case 2:
	                    return [85];
	                case 3:
	                    return [90];
	            }
	        },
	    },
	    spores: { // Birthrate increased when it's windy
	        name: loc('trait_spores_name'),
	        desc: loc('trait_spores'),
	        type: 'genus',
	        val: 2,
	        vars(r){
	            // [Bound Add, Bound Multi, Bound Add Parasite]
	            switch (r || evolve.global.race.spores || 1){
	                case 0.25:
	                    return [1,1.5,1];
	                case 0.5:
	                    return [2,1.5,1];
	                case 1:
	                    return [2,2,1];
	                case 2:
	                    return [2,2.5,2];
	                case 3:
	                    return [2,3,2];
	            }
	        },
	    },
	    spongy: { // Birthrate decreased when it's raining
	        name: loc('trait_spongy_name'),
	        desc: loc('trait_spongy'),
	        type: 'genus',
	        val: -2,
	    },
	    submerged: { // Immune to weather effects
	        name: loc('trait_submerged_name'),
	        desc: loc('trait_submerged'),
	        type: 'genus',
	        val: 3,
	    },
	    low_light: { // Farming effectiveness decreased
	        name: loc('trait_low_light_name'),
	        desc: loc('trait_low_light'),
	        type: 'genus',
	        val: -2,
	        vars(r){
	            switch (r || evolve.global.race.low_light || 1){
	                case 0.25:
	                    return [14];
	                case 0.5:
	                    return [12];
	                case 1:
	                    return [10];
	                case 2:
	                    return [8];
	                case 3:
	                    return [6];
	            }
	        },
	    },
	    elusive: { // Spies are never caught
	        name: loc('trait_elusive_name'),
	        desc: loc('trait_elusive'),
	        type: 'genus',
	        val: 7,
	        vars(r){
	            switch (r || evolve.global.race.elusive || 1){
	                case 0.25:
	                    return [10];
	                case 0.5:
	                    return [15];
	                case 1:
	                    return [20];
	                case 2:
	                    return [25];
	                case 3:
	                    return [30];
	            }
	        },
	    },
	    iron_allergy: { // Iron mining reduced
	        name: loc('trait_iron_allergy_name'),
	        desc: loc('trait_iron_allergy'),
	        type: 'genus',
	        val: -4,
	        vars(r){
	            switch (r || evolve.global.race.iron_allergy || 1){
	                case 0.25:
	                    return [40];
	                case 0.5:
	                    return [35];
	                case 1:
	                    return [25];
	                case 2:
	                    return [18];
	                case 3:
	                    return [15];
	            }
	        },
	    },
	    smoldering: { // Hot weather is a bonus
	        name: loc('trait_smoldering_name'),
	        desc: loc('trait_smoldering'),
	        type: 'genus',
	        val: 7,
	        vars(r){
	            // [Seasonal Morale, Hot Bonus, High Hot Bonus]
	            switch (r || evolve.global.race.smoldering || 1){
	                case 0.25:
	                    return [3,0.14,0.08];
	                case 0.5:
	                    return [4,0.18,0.1];
	                case 1:
	                    return [5,0.35,0.2];
	                case 2:
	                    return [10,0.38,0.22];
	                case 3:
	                    return [12,0.4,0.24];
	            }
	        },
	    },
	    cold_intolerance: { // Cold weather is a detriment
	        name: loc('trait_cold_intolerance_name'),
	        desc: loc('trait_cold_intolerance'),
	        type: 'genus',
	        val: -4,
	        vars(r){
	            switch (r || evolve.global.race.cold_intolerance || 1){
	                case 0.25:
	                    return [0.35];
	                case 0.5:
	                    return [0.3];
	                case 1:
	                    return [0.25];
	                case 2:
	                    return [0.2];
	                case 3:
	                    return [0.18];
	            }
	        },
	    },
	    chilled: { // Cold weather is a bonus
	        name: loc('trait_chilled_name'),
	        desc: loc('trait_chilled'),
	        type: 'genus',
	        val: 7,
	        vars(r){
	            // [Seasonal Morale, Cold Bonus, High Cold Bonus, Snow Food Bonus, Cold Food Bonus, Sun Food Penalty]
	            switch (r || evolve.global.race.chilled || 1){
	                case 0.25:
	                    return [1,0.14,0.08,5,2,20];
	                case 0.5:
	                    return [2,0.18,0.1,10,5,18];
	                case 1:
	                    return [5,0.35,0.2,20,10,15];
	                case 2:
	                    return [10,0.38,0.22,25,12,10];
	                case 3:
	                    return [12,0.4,0.24,30,14,8];
	            }
	        },
	    },
	    heat_intolerance: { // Hot weather is a detriment
	        name: loc('trait_heat_intolerance_name'),
	        desc: loc('trait_heat_intolerance'),
	        type: 'genus',
	        val: -4,
	        vars(r){
	            switch (r || evolve.global.race.heat_intolerance || 1){
	                case 0.25:
	                    return [0.35];
	                case 0.5:
	                    return [0.3];
	                case 1:
	                    return [0.25];
	                case 2:
	                    return [0.2];
	                case 3:
	                    return [0.18];
	            }
	        },
	    },
	    scavenger: { // scavenger job is always available
	        name: loc('trait_scavenger_name'),
	        desc: loc('trait_scavenger'),
	        type: 'genus',
	        val: 3,
	        vars(r){
	            // [impact, duel bonus]
	            switch (r || evolve.global.race.scavenger || 1){
	                case 0.25:
	                    return [0.08,20];
	                case 0.5:
	                    return [0.1,22];
	                case 1:
	                    return [0.12,25];
	                case 2:
	                    return [0.14,30];
	                case 3:
	                    return [0.16,32];
	            }
	        },
	    },
	    nomadic: { // -1 Trade route from trade post
	        name: loc('trait_nomadic_name'),
	        desc: loc('trait_nomadic'),
	        type: 'genus',
	        val: -5,
	    },
	    immoral: { // Warmonger is a bonus instead of a penalty
	        name: loc('trait_immoral_name'),
	        desc: loc('trait_immoral'),
	        type: 'genus',
	        val: 4,
	        vars(r){
	            switch (r || evolve.global.race.immoral || 1){
	                case 0.25:
	                    return [-30];
	                case 0.5:
	                    return [-20];
	                case 1:
	                    return [0];
	                case 2:
	                    return [20];
	                case 3:
	                    return [30];
	            }
	        },
	    },
	    evil: { // You are pure evil
	        name: loc('trait_evil_name'),
	        desc: loc('trait_evil'),
	        type: 'genus',
	        val: 0,
	    },
	    blissful: { // Low morale penalty is halved and citizens never riot.
	        name: loc('trait_blissful_name'),
	        desc: loc('trait_blissful'),
	        type: 'genus',
	        val: 3,
	        vars(r){
	            switch (r || evolve.global.race.blissful || 1){
	                case 0.25:
	                    return [70];
	                case 0.5:
	                    return [60];
	                case 1:
	                    return [50];
	                case 2:
	                    return [40];
	                case 3:
	                    return [30];
	            }
	        },
	    },
	    pompous: { // Professors are less effective
	        name: loc('trait_pompous_name'),
	        desc: loc('trait_pompous'),
	        type: 'genus',
	        val: -6,
	        vars(r){
	            switch (r || evolve.global.race.pompous || 1){
	                case 0.25:
	                    return [85];
	                case 0.5:
	                    return [80];
	                case 1:
	                    return [75];
	                case 2:
	                    return [65];
	                case 3:
	                    return [60];
	            }
	        },
	    },
	    holy: { // Combat Bonus in Hell
	        name: loc('trait_holy_name'),
	        desc: loc('trait_holy'),
	        type: 'genus',
	        val: 4,
	        vars(r){
	            // [Hell Army Bonus, Hell Suppression Bonus]
	            switch (r || evolve.global.race.holy || 1){
	                case 0.25:
	                    return [25,10];
	                case 0.5:
	                    return [30,15];
	                case 1:
	                    return [50,25];
	                case 2:
	                    return [60,35];
	                case 3:
	                    return [65,40];
	            }
	        },
	    },
	    artifical: {
	        name: loc('trait_artifical_name'),
	        desc: loc('trait_artifical'),
	        type: 'genus',
	        val: 5,
	        vars(r){
	            // [Science Bonus]
	            switch (r || evolve.global.race.artifical || 1){
	                case 0.25:
	                    return [5];
	                case 0.5:
	                    return [10];
	                case 1:
	                    return [20];
	                case 2:
	                    return [25];
	                case 3:
	                    return [30];
	            }
	        },
	    },
	    powered: {
	        name: loc('trait_powered_name'),
	        desc: loc('trait_powered'),
	        type: 'genus',
	        val: -6,
	        vars(r){
	            // [Power Req, Labor Boost]
	            switch (r || evolve.global.race.powered || 1){
	                case 0.25:
	                    return [0.35,5];
	                case 0.5:
	                    return [0.3,8];
	                case 1:
	                    return [0.2,16];
	                case 2:
	                    return [0.1,20];
	                case 3:
	                    return [0.05,24];
	            }
	        },
	    },
	    creative: { // A.R.P.A. Projects are cheaper
	        name: loc('trait_creative_name'),
	        desc: loc('trait_creative'),
	        type: 'major',
	        val: 8,
	        vars(r){
	            switch (r || evolve.global.race.creative || 1){
	                case 0.25:
	                    return [0.0015,5];
	                case 0.5:
	                    return [0.0025,10];
	                case 1:
	                    return [0.005,20];
	                case 2:
	                    return [0.006,22];
	                case 3:
	                    return [0.0065,24];
	            }
	        },
	    },
	    diverse: { // Training soldiers takes longer
	        name: loc('trait_diverse_name'),
	        desc: loc('trait_diverse'),
	        type: 'major',
	        val: -4,
	        vars(r){
	            switch (r || evolve.global.race.diverse || 1){
	                case 0.25:
	                    return [35];
	                case 0.5:
	                    return [30];
	                case 1:
	                    return [25];
	                case 2:
	                    return [20];
	                case 3:
	                    return [15];
	            }
	        },
	    },
	    studious: { // Professors generate an extra 0.25 Knowledge per second, Libraries provide 10% more knowledge cap
	        name: loc('trait_studious_name'),
	        desc: loc('trait_studious'),
	        type: 'major',
	        val: 2,
	        vars(r){
	            // [Prof Bonus, Library Bonus]
	            switch (r || evolve.global.race.studious || 1){
	                case 0.25:
	                    return [0.1,6];
	                case 0.5:
	                    return [0.15,8];
	                case 1:
	                    return [0.25,10];
	                case 2:
	                    return [0.35,12];
	                case 3:
	                    return [0.4,14];
	            }
	        },
	    },
	    arrogant: { // Market prices are higher
	        name: loc('trait_arrogant_name'),
	        desc: loc('trait_arrogant'),
	        type: 'major',
	        val: -2,
	        vars(r){
	            switch (r || evolve.global.race.arrogant || 1){
	                case 0.25:
	                    return [14];
	                case 0.5:
	                    return [12];
	                case 1:
	                    return [10];
	                case 2:
	                    return [8];
	                case 3:
	                    return [6];
	            }
	        },
	    },
	    brute: { // Recruitment costs are 1/2 price
	        name: loc('trait_brute_name'),
	        desc: loc('trait_brute'),
	        type: 'major',
	        val: 7,
	        vars(r){
	            // [Merc Discount, Training Bonus]
	            switch (r || evolve.global.race.brute || 1){
	                case 0.25:
	                    return [20,50];
	                case 0.5:
	                    return [25,60];
	                case 1:
	                    return [50,100];
	                case 2:
	                    return [60,120];
	                case 3:
	                    return [65,140];
	            }
	        },
	    },
	    angry: { // When hungry you get hangry, low food penalty is more severe
	        name: loc('trait_angry_name'),
	        desc: loc('trait_angry'),
	        type: 'major',
	        val: -1,
	        vars(r){
	            switch (r || evolve.global.race.angry || 1){
	                case 0.25:
	                    return [35];
	                case 0.5:
	                    return [30];
	                case 1:
	                    return [25];
	                case 2:
	                    return [20];
	                case 3:
	                    return [15];
	            }
	        },
	    },
	    lazy: { // All production is lowered when the temperature is hot
	        name: loc('trait_lazy_name'),
	        desc: loc('trait_lazy'),
	        type: 'major',
	        val: -4,
	        vars(r){
	            switch (r || evolve.global.race.lazy || 1){
	                case 0.25:
	                    return [14];
	                case 0.5:
	                    return [12];
	                case 1:
	                    return [10];
	                case 2:
	                    return [8];
	                case 3:
	                    return [6];
	            }
	        },
	    },
	    curious: { // University cap boosted by citizen count, curious random events
	        name: loc('trait_curious_name'),
	        desc: loc('trait_curious'),
	        type: 'major',
	        val: 4,
	        vars(r){
	            switch (r || evolve.global.race.curious || 1){
	                case 0.25:
	                    return [0.03];
	                case 0.5:
	                    return [0.05];
	                case 1:
	                    return [0.1];
	                case 2:
	                    return [0.12];
	                case 3:
	                    return [0.13];
	            }
	        },
	    },
	    pack_mentality: { // Cabins cost more, but cottages cost less.
	        name: loc('trait_pack_mentality_name'),
	        desc: loc('trait_pack_mentality'),
	        type: 'major',
	        val: 4,
	        vars(r){
	            // [Cabin Creep penatly, Cottage Creep bonus]
	            switch (r || evolve.global.race.pack_mentality || 1){
	                case 0.25:
	                    return [0.04,0.016];
	                case 0.5:
	                    return [0.035,0.018];
	                case 1:
	                    return [0.03,0.02];
	                case 2:
	                    return [0.026,0.022];
	                case 3:
	                    return [0.024,0.023];
	            }
	        },
	    },
	    tracker: { // 20% increased gains from hunting
	        name: loc('trait_tracker_name'),
	        desc: loc('trait_tracker'),
	        type: 'major',
	        val: 2,
	        vars(r){
	            switch (r || evolve.global.race.tracker || 1){
	                case 0.25:
	                    return [10];
	                case 0.5:
	                    return [15];
	                case 1:
	                    return [20];
	                case 2:
	                    return [25];
	                case 3:
	                    return [30];
	            }
	        },
	    },
	    playful: { // Hunters are Happy
	        name: loc('trait_playful_name'),
	        desc: loc('trait_playful'),
	        type: 'major',
	        val: 5,
	        vars(r){
	            switch (r || evolve.global.race.playful || 1){
	                case 0.25:
	                    return [0.3];
	                case 0.5:
	                    return [0.4];
	                case 1:
	                    return [0.5];
	                case 2:
	                    return [0.6];
	                case 3:
	                    return [0.7];
	            }
	        },
	    },
	    freespirit: { // Job Stress is higher for those who must work mundane jobs
	        name: loc('trait_freespirit_name'),
	        desc: loc('trait_freespirit'),
	        type: 'major',
	        val: -3,
	        vars(r){
	            switch (r || evolve.global.race.freespirit || 1){
	                case 0.25:
	                    return [65];
	                case 0.5:
	                    return [60];
	                case 1:
	                    return [50];
	                case 2:
	                    return [35];
	                case 3:
	                    return [25];
	            }
	        },
	    },
	    beast_of_burden: { // Gains more loot during raids
	        name: loc('trait_beast_of_burden_name'),
	        desc: loc('trait_beast_of_burden'),
	        type: 'major',
	        val: 3
	    },
	    sniper: { // Weapon upgrades are more impactful
	        name: loc('trait_sniper_name'),
	        desc: loc('trait_sniper'),
	        type: 'major',
	        val: 6,
	        vars(r){
	            switch (r || evolve.global.race.sniper || 1){
	                case 0.25:
	                    return [4];
	                case 0.5:
	                    return [6];
	                case 1:
	                    return [8];
	                case 2:
	                    return [9];
	                case 3:
	                    return [10];
	            }
	        },
	    },
	    hooved: { // You require special footwear
	        name: loc('trait_hooved_name'),
	        desc: loc('trait_hooved'),
	        type: 'major',
	        val: -4
	    },
	    rage: { // Wounded soldiers rage with extra power
	        name: loc('trait_rage_name'),
	        desc: loc('trait_rage'),
	        type: 'major',
	        val: 4,
	        vars(r){
	            // [Armor Bonus, Wounded Bonus]
	            switch (r || evolve.global.race.rage || 1){
	                case 0.25:
	                    return [0.3,20];
	                case 0.5:
	                    return [0.5,30];
	                case 1:
	                    return [1,50];
	                case 2:
	                    return [1.25,60];
	                case 3:
	                    return [1.4,65];
	            }
	        },
	    },
	    heavy: { // Some costs increased
	        name: loc('trait_heavy_name'),
	        desc: loc('trait_heavy'),
	        type: 'major',
	        val: -4,
	        vars(r){
	            // [Fuel Costs, Stone Cement and Wrought Iron Costs]
	            switch (r || evolve.global.race.heavy || 1){
	                case 0.25:
	                    return [18,10];
	                case 0.5:
	                    return [15,8];
	                case 1:
	                    return [10,5];
	                case 2:
	                    return [8,4];
	                case 3:
	                    return [6,3];
	            }
	        },
	    },
	    gnawer: { // Population destroys lumber by chewing on it
	        name: loc('trait_gnawer_name'),
	        desc: loc('trait_gnawer'),
	        type: 'major',
	        val: -1,
	        vars(r){
	            switch (r || evolve.global.race.gnawer || 1){
	                case 0.25:
	                    return [0.5];
	                case 0.5:
	                    return [0.4];
	                case 1:
	                    return [0.25];
	                case 2:
	                    return [0.2];
	                case 3:
	                    return [0.15];
	            }
	        },
	    },
	    calm: { // Your are very calm, almost zen like
	        name: loc('trait_calm_name'),
	        desc: loc('trait_calm'),
	        type: 'major',
	        val: 6,
	        vars(r){
	            switch (r || evolve.global.race.calm || 1){
	                case 0.25:
	                    return [7];
	                case 0.5:
	                    return [8];
	                case 1:
	                    return [10];
	                case 2:
	                    return [12];
	                case 3:
	                    return [13];
	            }
	        },
	    },
	    pack_rat: { // Storage space is increased
	        name: loc('trait_pack_rat_name'),
	        desc: loc('trait_pack_rat'),
	        type: 'major',
	        val: 3,
	        vars(r){
	            // [Crate Bonus, Storage Bonus]
	            switch (r || evolve.global.race.pack_rat || 1){
	                case 0.25:
	                    return [5,2];
	                case 0.5:
	                    return [6,3];
	                case 1:
	                    return [10,5];
	                case 2:
	                    return [15,8];
	                case 3:
	                    return [20,10];
	            }
	        },
	    },
	    paranoid: { // Bank capacity reduced by 10%
	        name: loc('trait_paranoid_name'),
	        desc: loc('trait_paranoid'),
	        type: 'major',
	        val: -3,
	        vars(r){
	            switch (r || evolve.global.race.paranoid || 1){
	                case 0.25:
	                    return [14];
	                case 0.5:
	                    return [12];
	                case 1:
	                    return [10];
	                case 2:
	                    return [8];
	                case 3:
	                    return [6];
	            }
	        },
	    },
	    greedy: { // Lowers income from taxes
	        name: loc('trait_greedy_name'),
	        desc: loc('trait_greedy'),
	        type: 'major',
	        val: -5,
	        vars(r){
	            switch (r || evolve.global.race.greedy || 1){
	                case 0.25:
	                    return [17.5];
	                case 0.5:
	                    return [15];
	                case 1:
	                    return [12.5];
	                case 2:
	                    return [10];
	                case 3:
	                    return [8];
	            }
	        },
	    },
	    merchant: { // Better commodity selling prices
	        name: loc('trait_merchant_name'),
	        desc: loc('trait_merchant'),
	        type: 'major',
	        val: 3,
	        vars(r){
	            // [Sell Price, Galactic Buy Volume]
	            switch (r || evolve.global.race.merchant || 1){
	                case 0.25:
	                    return [10,3];
	                case 0.5:
	                    return [15,5];
	                case 1:
	                    return [25,10];
	                case 2:
	                    return [35,12];
	                case 3:
	                    return [40,13];
	            }
	        },
	    },
	    smart: { // Knowledge costs reduced by 10%
	        name: loc('trait_smart_name'),
	        desc: loc('trait_smart'),
	        type: 'major',
	        val: 6,
	        vars(r){
	            switch (r || evolve.global.race.smart || 1){
	                case 0.25:
	                    return [3];
	                case 0.5:
	                    return [5];
	                case 1:
	                    return [10];
	                case 2:
	                    return [12];
	                case 3:
	                    return [13];
	            }
	        },
	    },
	    puny: { // Lowers minium bound for army score roll
	        name: loc('trait_puny_name'),
	        desc: loc('trait_puny'),
	        type: 'major',
	        val: -4,
	        vars(r){
	            switch (r || evolve.global.race.puny || 1){
	                case 0.25:
	                    return [18];
	                case 0.5:
	                    return [15];
	                case 1:
	                    return [10];
	                case 2:
	                    return [6];
	                case 3:
	                    return [4];
	            }
	        },
	    },
	    dumb: { // Knowledge costs increased by 5%
	        name: loc('trait_dumb_name'),
	        desc: loc('trait_dumb'),
	        type: 'major',
	        val: -5,
	        vars(r){
	            switch (r || evolve.global.race.dumb || 1){
	                case 0.25:
	                    return [7];
	                case 0.5:
	                    return [6];
	                case 1:
	                    return [5];
	                case 2:
	                    return [4];
	                case 3:
	                    return [3];
	            }
	        },
	    },
	    tough: { // Mining output increased by 25%
	        name: loc('trait_tough_name'),
	        desc: loc('trait_tough'),
	        type: 'major',
	        val: 4,
	        vars(r){
	            switch (r || evolve.global.race.tough || 1){
	                case 0.25:
	                    return [10];
	                case 0.5:
	                    return [15];
	                case 1:
	                    return [25];
	                case 2:
	                    return [35];
	                case 3:
	                    return [40];
	            }
	        },
	    },
	    nearsighted: { // Libraries are less effective
	        name: loc('trait_nearsighted_name'),
	        desc: loc('trait_nearsighted'),
	        type: 'major',
	        val: -4,
	        vars(r){
	            switch (r || evolve.global.race.nearsighted || 1){
	                case 0.25:
	                    return [18];
	                case 0.5:
	                    return [15];
	                case 1:
	                    return [12];
	                case 2:
	                    return [10];
	                case 3:
	                    return [8];
	            }
	        },
	    },
	    intelligent: { // Professors and Scientists add a evolve.global production bonus
	        name: loc('trait_intelligent_name'),
	        desc: loc('trait_intelligent'),
	        type: 'major',
	        val: 7,
	        vars(r){
	            // [Prof Bonus, Scientist Bonus]
	            switch (r || evolve.global.race.intelligent || 1){
	                case 0.25:
	                    return [0.08,0.15];
	                case 0.5:
	                    return [0.1,0.2];
	                case 1:
	                    return [0.125,0.25];
	                case 2:
	                    return [0.14,0.3];
	                case 3:
	                    return [0.15,0.32];
	            }
	        },
	    },
	    regenerative: { // Wounded soldiers heal 4x as fast
	        name: loc('trait_regenerative_name'),
	        desc: loc('trait_regenerative'),
	        type: 'major',
	        val: 8,
	        vars(r){ return [4]; },
	        vars(r){
	            switch (r || evolve.global.race.regenerative || 1){
	                case 0.25:
	                    return [2];
	                case 0.5:
	                    return [3];
	                case 1:
	                    return [4];
	                case 2:
	                    return [5];
	                case 3:
	                    return [6];
	            }
	        },
	    },
	    gluttony: { // Eats 10% more food per rank
	        name: loc('trait_gluttony_name'),
	        desc: loc('trait_gluttony'),
	        type: 'major',
	        val: -2,
	        vars(r){
	            switch (r || evolve.global.race.gluttony || 1){
	                case 0.25:
	                    return [20];
	                case 0.5:
	                    return [15];
	                case 1:
	                    return [10];
	                case 2:
	                    return [8];
	                case 3:
	                    return [6];
	            }
	        },
	    },
	    slow: { // The game moves at a 10% slower pace
	        name: loc('trait_slow_name'),
	        desc: loc('trait_slow'),
	        type: 'major',
	        val: -5,
	        vars(r){
	            switch (r || evolve.global.race.slow || 1){
	                case 0.25:
	                    return [13];
	                case 0.5:
	                    return [12];
	                case 1:
	                    return [10];
	                case 2:
	                    return [8];
	                case 3:
	                    return [6];
	            }
	        },
	    },
	    armored: { // Less soldiers die in combat
	        name: loc('trait_armored_name'),
	        desc: loc('trait_armored'),
	        type: 'major',
	        val: 4,
	        vars(r){
	            // [Solder % death prevention, Hell Armor Bonus]
	            switch (r || evolve.global.race.armored || 1){
	                case 0.25:
	                    return [15,1];
	                case 0.5:
	                    return [25,1];
	                case 1:
	                    return [50,2];
	                case 2:
	                    return [70,2];
	                case 3:
	                    return [80,2];
	            }
	        },
	    },
	    optimistic: { // Minor reduction to stress
	        name: loc('trait_optimistic_name'),
	        desc: loc('trait_optimistic'),
	        type: 'major',
	        val: 5,
	        vars(r){
	            switch (r || evolve.global.race.optimistic || 1){
	                case 0.25:
	                    return [4];
	                case 0.5:
	                    return [5];
	                case 1:
	                    return [10];
	                case 2:
	                    return [15];
	                case 3:
	                    return [18];
	            }
	        },
	    },
	    chameleon: { // Barracks have less soldiers
	        name: loc('trait_chameleon_name'),
	        desc: loc('trait_chameleon'),
	        type: 'major',
	        val: 6,
	        vars(r){
	            // [Combat Rating Bonus, Ambush Avoid]
	            switch (r || evolve.global.race.chameleon || 1){
	                case 0.25:
	                    return [5,10];
	                case 0.5:
	                    return [10,15];
	                case 1:
	                    return [20,20];
	                case 2:
	                    return [25,25];
	                case 3:
	                    return [30,30];
	            }
	        },
	    },
	    slow_digestion: { // Your race is more resilient to starvation
	        name: loc('trait_slow_digestion_name'),
	        desc: loc('trait_slow_digestion'),
	        type: 'major',
	        val: 1,
	        vars(r){
	            switch (r || evolve.global.race.slow_digestion || 1){
	                case 0.25:
	                    return [0.3];
	                case 0.5:
	                    return [0.5];
	                case 1:
	                    return [0.75];
	                case 2:
	                    return [1];
	                case 3:
	                    return [1.25];
	            }
	        },
	    },
	    hard_of_hearing: { // University science cap gain reduced by 5%
	        name: loc('trait_hard_of_hearing_name'),
	        desc: loc('trait_hard_of_hearing'),
	        type: 'major',
	        val: -3,
	        vars(r){
	            switch (r || evolve.global.race.hard_of_hearing || 1){
	                case 0.25:
	                    return [7];
	                case 0.5:
	                    return [6];
	                case 1:
	                    return [5];
	                case 2:
	                    return [4];
	                case 3:
	                    return [3];
	            }
	        },
	    },
	    resourceful: { // Crafting costs are reduced slightly
	        name: loc('trait_resourceful_name'),
	        desc: loc('trait_resourceful'),
	        type: 'major',
	        val: 4,
	        vars(r){
	            switch (r || evolve.global.race.resourceful || 1){
	                case 0.25:
	                    return [6];
	                case 0.5:
	                    return [8];
	                case 1:
	                    return [12];
	                case 2:
	                    return [16];
	                case 3:
	                    return [18];
	            }
	        },
	    },
	    selenophobia: { // Moon phase directly affects productivity, on average this is slightly negative
	        name: loc('trait_selenophobia_name'),
	        desc: loc('trait_selenophobia'),
	        type: 'major',
	        val: -6,
	        vars(r){
	            // [Max bonus]
	            switch (r || evolve.global.race.selenophobia || 1){
	                case 0.25:
	                    return [2];
	                case 0.5:
	                    return [3];
	                case 1:
	                    return [4];
	                case 2:
	                    return [5];
	                case 3:
	                    return [6];
	            }
	        },
	    },
	    leathery: { // Morale penalty from some weather conditions are reduced.
	        name: loc('trait_leathery_name'),
	        desc: loc('trait_leathery'),
	        type: 'major',
	        val: 2,
	    },
	    pessimistic: { // Minor increase to stress
	        name: loc('trait_pessimistic_name'),
	        desc: loc('trait_pessimistic'),
	        type: 'major',
	        val: -1,
	        vars(r){
	            switch (r || evolve.global.race.pessimistic || 1){
	                case 0.25:
	                    return [4];
	                case 0.5:
	                    return [3];
	                case 1:
	                    return [2];
	                case 2:
	                    return [1];
	                case 3:
	                    return [1];
	            }
	        },
	    },
	    hoarder: { // Banks can store 20% more money
	        name: loc('trait_hoarder_name'),
	        desc: loc('trait_hoarder'),
	        type: 'major',
	        val: 4,
	        vars(r){
	            switch (r || evolve.global.race.hoarder || 1){
	                case 0.25:
	                    return [5];
	                case 0.5:
	                    return [10];
	                case 1:
	                    return [20];
	                case 2:
	                    return [25];
	                case 3:
	                    return [30];
	            }
	        },
	    },
	    solitary: { // Cabins are cheaper however cottages cost more
	        name: loc('trait_solitary_name'),
	        desc: loc('trait_solitary'),
	        type: 'major',
	        val: -1,
	        vars(r){
	            // [Cabin Creep bonus, Cottage Creep malus]
	            switch (r || evolve.global.race.solitary || 1){
	                case 0.25:
	                    return [0.01,0.025];
	                case 0.5:
	                    return [0.01,0.02];
	                case 1:
	                    return [0.02,0.02];
	                case 2:
	                    return [0.025,0.02];
	                case 3:
	                    return [0.025,0.015];
	            }
	        },
	    },
	    kindling_kindred: { // Lumber is no longer a resource, however other costs are increased for anything that would have used lumber to compensate.
	        name: loc('trait_kindling_kindred_name'),
	        desc: loc('trait_kindling_kindred'),
	        type: 'major',
	        val: 8,
	        vars(r){
	            switch (r || evolve.global.race.kindling_kindred || 1){
	                case 0.25:
	                    return [10];
	                case 0.5:
	                    return [8];
	                case 1:
	                    return [5];
	                case 2:
	                    return [4];
	                case 3:
	                    return [3];
	            }
	        },
	    },
	    pyrophobia: { // Smelter productivity is reduced
	        name: loc('trait_pyrophobia_name'),
	        desc: loc('trait_pyrophobia'),
	        type: 'major',
	        val: -4,
	        vars(r){
	            switch (r || evolve.global.race.pyrophobia || 1){
	                case 0.25:
	                    return [14];
	                case 0.5:
	                    return [12];
	                case 1:
	                    return [10];
	                case 2:
	                    return [8];
	                case 3:
	                    return [6];
	            }
	        }
	    },
	    hyper: { // The game moves at a 5% faster pace
	        name: loc('trait_hyper_name'),
	        desc: loc('trait_hyper'),
	        type: 'major',
	        val: 4,
	        vars(r){
	            switch (r || evolve.global.race.hyper || 1){
	                case 0.25:
	                    return [2];
	                case 0.5:
	                    return [3];
	                case 1:
	                    return [5];
	                case 2:
	                    return [6];
	                case 3:
	                    return [7];
	            }
	        }
	    },
	    skittish: { // Thunderstorms lower all production
	        name: loc('trait_skittish_name'),
	        desc: loc('trait_skittish'),
	        type: 'major',
	        val: -4,
	        vars(r){
	            switch (r || evolve.global.race.skittish || 1){
	                case 0.25:
	                    return [18];
	                case 0.5:
	                    return [15];
	                case 1:
	                    return [12];
	                case 2:
	                    return [8];
	                case 3:
	                    return [6];
	            }
	        }
	    },
	    fragrant: { // Reduced Hunting effectiveness
	        name: loc('trait_fragrant_name'),
	        desc: loc('trait_fragrant'),
	        type: 'major',
	        val: -3,
	        vars(r){
	            switch (r || evolve.global.race.fragrant || 1){
	                case 0.25:
	                    return [35];
	                case 0.5:
	                    return [30];
	                case 1:
	                    return [20];
	                case 2:
	                    return [15];
	                case 3:
	                    return [12];
	            }
	        }
	    },
	    sticky: { // Food req lowered, Increase Combat Rating
	        name: loc('trait_sticky_name'),
	        desc: loc('trait_sticky'),
	        type: 'major',
	        val: 3,
	        vars(r){
	            // [Food Consumption, Army Bonus]
	            switch (r || evolve.global.race.sticky || 1){
	                case 0.25:
	                    return [5,5];
	                case 0.5:
	                    return [10,8];
	                case 1:
	                    return [20,15];
	                case 2:
	                    return [25,18];
	                case 3:
	                    return [30,20];
	            }
	        }
	    },
	    infectious: { // Attacking has a chance to infect other creatures and grow your population
	        name: loc('trait_infectious_name'),
	        desc: loc('trait_infectious'),
	        type: 'major',
	        val: 4,
	        vars(r){
	            // [Ambush, Raid, Pillage, Assault, Siege]
	            switch (r || evolve.global.race.infectious || 1){
	                case 0.25:
	                    return [1,2,3,7,18];
	                case 0.5:
	                    return [1,2,4,8,20];
	                case 1:
	                    return [2,3,5,10,25];
	                case 2:
	                    return [2,4,6,12,30];
	                case 3:
	                    return [3,4,7,13,32];
	            }
	        }
	    },
	    parasite: { // You can only reproduce by infecting victims, spores sometimes find a victim when it's windy
	        name: loc('trait_parasite_name'),
	        desc: loc('trait_parasite'),
	        type: 'major',
	        val: -4,
	    },
	    toxic: { // Factory type jobs are more productive
	        name: loc('trait_toxic_name'),
	        desc: loc('trait_toxic'),
	        type: 'major',
	        val: 5,
	        vars(r){
	            // [Lux Fur Alloy Polymer, Nano Stanene, Cement]
	            switch (r || evolve.global.race.toxic || 1){
	                case 0.25:
	                    return [5,3,10];
	                case 0.5:
	                    return [10,5,15];
	                case 1:
	                    return [20,8,30];
	                case 2:
	                    return [25,10,40];
	                case 3:
	                    return [30,12,45];
	            }
	        }
	    },
	    nyctophilia: { // Productivity is lost when it is sunny
	        name: loc('trait_nyctophilia_name'),
	        desc: loc('trait_nyctophilia'),
	        type: 'major',
	        val: -3,
	        vars(r){
	            // [Sunny, Cloudy]
	            switch (r || evolve.global.race.nyctophilia || 1){
	                case 0.25:
	                    return [10,6];
	                case 0.5:
	                    return [8,5];
	                case 1:
	                    return [5,2];
	                case 2:
	                    return [3,1];
	                case 3:
	                    return [2,1];
	            }
	        }
	    },
	    infiltrator: { // Cheap spies and sometimes steal tech from rivals
	        name: loc('trait_infiltrator_name'),
	        desc: loc('trait_infiltrator'),
	        type: 'major',
	        val: 4,
	        vars(r){ // [Steal Cap]
	            switch (r || evolve.global.race.infiltrator || 1){
	                case 0.25:
	                    return [110];
	                case 0.5:
	                    return [100];
	                case 1:
	                    return [90];
	                case 2:
	                    return [85];
	                case 3:
	                    return [80];
	            }
	        }
	    },
	    hibernator: { // Lower activity during winter
	        name: loc('trait_hibernator_name'),
	        desc: loc('trait_hibernator'),
	        type: 'major',
	        val: -3,
	        vars(r){
	            // [Food Consumption, Production]
	            switch (r || evolve.global.race.hibernator || 1){
	                case 0.25:
	                    return [15,8];
	                case 0.5:
	                    return [20,8];
	                case 1:
	                    return [25,8];
	                case 2:
	                    return [30,6];
	                case 3:
	                    return [35,5];
	            }
	        }
	    },
	    cannibalize: { // Eat your own for buffs
	        name: loc('trait_cannibalize_name'),
	        desc: loc('trait_cannibalize'),
	        type: 'major',
	        val: 5,
	        vars(r){
	            switch (r || evolve.global.race.cannibalize || 1){
	                case 0.25:
	                    return [8];
	                case 0.5:
	                    return [10];
	                case 1:
	                    return [15];
	                case 2:
	                    return [20];
	                case 3:
	                    return [22];
	            }
	        }
	    },
	    frail: { // More soldiers die in combat
	        name: loc('trait_frail_name'),
	        desc: loc('trait_frail'),
	        type: 'major',
	        val: -5,
	        vars(r){
	            // [Win Deaths, Loss Deaths]
	            switch (r || evolve.global.race.frail || 1){
	                case 0.25:
	                    return [2,2];
	                case 0.5:
	                    return [1,2];
	                case 1:
	                    return [1,1];
	                case 2:
	                    return [1,0];
	                case 3:
	                    return [1,0];
	            }
	        }
	    },
	    malnutrition: { // The rationing penalty is weaker
	        name: loc('trait_malnutrition_name'),
	        desc: loc('trait_malnutrition'),
	        type: 'major',
	        val: 1,
	        vars(r){
	            switch (r || evolve.global.race.malnutrition || 1){
	                case 0.25:
	                    return [10];
	                case 0.5:
	                    return [12];
	                case 1:
	                    return [25];
	                case 2:
	                    return [40];
	                case 3:
	                    return [50];
	            }
	        }
	    },
	    claws: { // Raises maximum bound for army score roll
	        name: loc('trait_claws_name'),
	        desc: loc('trait_claws'),
	        type: 'major',
	        val: 5,
	        vars(r){
	            switch (r || evolve.global.race.claws || 1){
	                case 0.25:
	                    return [8];
	                case 0.5:
	                    return [12];
	                case 1:
	                    return [25];
	                case 2:
	                    return [32];
	                case 3:
	                    return [35];
	            }
	        }
	    },
	    atrophy: { // More prone to starvation
	        name: loc('trait_atrophy_name'),
	        desc: loc('trait_atrophy'),
	        type: 'major',
	        val: -1,
	        vars(r){
	            switch (r || evolve.global.race.atrophy || 1){
	                case 0.25:
	                    return [0.35];
	                case 0.5:
	                    return [0.25];
	                case 1:
	                    return [0.15];
	                case 2:
	                    return [0.1];
	                case 3:
	                    return [0.08];
	            }
	        }
	    },
	    hivemind: { // Jobs with low citizen counts assigned to them have reduced output, but those with high numbers have increased output.
	        name: loc('trait_hivemind_name'),
	        desc: loc('trait_hivemind'),
	        type: 'major',
	        val: 9,
	        vars(r){
	            switch (r || evolve.global.race.hivemind || 1){
	                case 0.25:
	                    return [12];
	                case 0.5:
	                    return [11];
	                case 1:
	                    return [10];
	                case 2:
	                    return [8];
	                case 3:
	                    return [7];
	            }
	        }
	    },
	    tunneler: { // Mines and Coal Mines are cheaper.
	        name: loc('trait_tunneler_name'),
	        desc: loc('trait_tunneler'),
	        type: 'major',
	        val: 2,
	        vars(r){
	            switch (r || evolve.global.race.tunneler || 1){
	                case 0.25:
	                    return [0.002];
	                case 0.5:
	                    return [0.005];
	                case 1:
	                    return [0.01];
	                case 2:
	                    return [0.015];
	                case 3:
	                    return [0.018];
	            }
	        }
	    },
	    blood_thirst: { // Combat causes a temporary increase in morale
	        name: loc('trait_blood_thirst_name'),
	        desc: loc('trait_blood_thirst'),
	        type: 'major',
	        val: 5,
	        vars(r){
	            // [Cap]
	            switch (r || evolve.global.race.blood_thirst || 1){
	                case 0.25:
	                    return [250000];
	                case 0.5:
	                    return [500000];
	                case 1:
	                    return [1000000];
	                case 2:
	                    return [2000000];
	                case 3:
	                    return [4000000];
	            }
	        }
	    },
	    apex_predator: { // Hunting and Combat ratings are significantly higher, but you can't use armor
	        name: loc('trait_apex_predator_name'),
	        desc: loc('trait_apex_predator'),
	        type: 'major',
	        val: 6,
	        vars(r){
	            // [Combat, Hunting]
	            switch (r || evolve.global.race.apex_predator || 1){
	                case 0.25:
	                    return [15,20];
	                case 0.5:
	                    return [20,30];
	                case 1:
	                    return [30,50];
	                case 2:
	                    return [40,60];
	                case 3:
	                    return [45,65];
	            }
	        }
	    },
	    invertebrate: { // You have no bones
	        name: loc('trait_invertebrate_name'),
	        desc: loc('trait_invertebrate'),
	        type: 'major',
	        val: -2,
	        vars(r){
	            switch (r || evolve.global.race.invertebrate || 1){
	                case 0.25:
	                    return [25];
	                case 0.5:
	                    return [20];
	                case 1:
	                    return [10];
	                case 2:
	                    return [8];
	                case 3:
	                    return [5];
	            }
	        }
	    },
	    suction_grip: { // Global productivity boost
	        name: loc('trait_suction_grip_name'),
	        desc: loc('trait_suction_grip'),
	        type: 'major',
	        val: 4,
	        vars(r){
	            switch (r || evolve.global.race.suction_grip || 1){
	                case 0.25:
	                    return [5];
	                case 0.5:
	                    return [6];
	                case 1:
	                    return [8];
	                case 2:
	                    return [12];
	                case 3:
	                    return [14];
	            }
	        }
	    },
	    befuddle: { // Spy actions complete in 1/2 time
	        name: loc('trait_befuddle_name'),
	        desc: loc('trait_befuddle'),
	        type: 'major',
	        val: 4,
	        vars(r){
	            switch (r || evolve.global.race.befuddle || 1){
	                case 0.25:
	                    return [20];
	                case 0.5:
	                    return [30];
	                case 1:
	                    return [50];
	                case 2:
	                    return [75];
	                case 3:
	                    return [85];
	            }
	        }
	    },
	    environmentalist: { // Use renewable energy instead of dirtly coal & oil power.
	        name: loc('trait_environmentalist_name'),
	        desc: loc('trait_environmentalist'),
	        type: 'major',
	        val: -5,
	    },
	    unorganized: { // Increased time between revolutions
	        name: loc('trait_unorganized_name'),
	        desc: loc('trait_unorganized'),
	        type: 'major',
	        val: -2,
	        vars(r){
	            switch (r || evolve.global.race.unorganized || 1){
	                case 0.25:
	                    return [90];
	                case 0.5:
	                    return [80];
	                case 1:
	                    return [50];
	                case 2:
	                    return [40];
	                case 3:
	                    return [30];
	            }
	        }
	    },
	    musical: { // Entertainers are more effective
	        name: loc('trait_musical_name'),
	        desc: loc('trait_musical'),
	        type: 'major',
	        val: 5,
	        vars(r){
	            switch (r || evolve.global.race.musical || 1){
	                case 0.25:
	                    return [0.25];
	                case 0.5:
	                    return [0.5];
	                case 1:
	                    return [1];
	                case 2:
	                    return [1.1];
	                case 3:
	                    return [1.2];
	            }
	        }
	    },
	    revive: { // Soldiers sometimes self res
	        name: loc('trait_revive_name'),
	        desc: loc('trait_revive'),
	        type: 'major',
	        val: 4,
	        vars(r){
	            // [cold win, normal win, hot win, cold loss, normal loss, hot loss, hell]
	            switch (r || evolve.global.race.revive || 1){
	                case 0.25:
	                    return [7,5,2,8,6,3,4];
	                case 0.5:
	                    return [6,4,2,7,5,2.5,4];
	                case 1:
	                    return [5,3,1.5,6,4,2,3];
	                case 2:
	                    return [4,2,1,5,3,1.5,2];
	                case 3:
	                    return [3,1.5,1,4,2.5,1,2];
	            }
	        }
	    },
	    slow_regen: { // Your soldiers wounds heal slower.
	        name: loc('trait_slow_regen_name'),
	        desc: loc('trait_slow_regen'),
	        type: 'major',
	        val: -4,
	        vars(r){
	            switch (r || evolve.global.race.slow_regen || 1){
	                case 0.25:
	                    return [40];
	                case 0.5:
	                    return [35];
	                case 1:
	                    return [25];
	                case 2:
	                    return [20];
	                case 3:
	                    return [15];
	            }
	        }
	    },
	    forge: { // Smelters do not require fuel, boosts geothermal power
	        name: loc('trait_forge_name'),
	        desc: loc('trait_forge'),
	        type: 'major',
	        val: 4,
	        vars(r){
	            switch (r || evolve.global.race.forge || 1){
	                case 0.25:
	                    return [0.5];
	                case 0.5:
	                    return [1];
	                case 1:
	                    return [2];
	                case 2:
	                    return [2.5];
	                case 3:
	                    return [3];
	            }
	        }
	    },
	    autoignition: { // Library knowledge bonus reduced
	        name: loc('trait_autoignition_name'),
	        desc: loc('trait_autoignition'),
	        type: 'major',
	        val: -4,
	        vars(r){
	            switch (r || evolve.global.race.autoignition || 1){
	                case 0.25:
	                    return [4];
	                case 0.5:
	                    return [3];
	                case 1:
	                    return [2];
	                case 2:
	                    return [1.5];
	                case 3:
	                    return [1];
	            }
	        }
	    },
	    blurry: { // Increased success chance of spies
	        name: loc('trait_blurry_name'),
	        desc: loc('trait_blurry'),
	        type: 'major',
	        val: 5,
	        vars(r){
	            switch (r || evolve.global.race.blurry || 1){
	                case 0.25:
	                    return [10];
	                case 0.5:
	                    return [15];
	                case 1:
	                    return [25];
	                case 2:
	                    return [35];
	                case 3:
	                    return [40];
	            }
	        }
	    },
	    snowy: { // You lose morale if it's not snowing
	        name: loc('trait_snowy_name'),
	        desc: loc('trait_snowy'),
	        type: 'major',
	        val: -3,
	        vars(r){
	            // [Not Hot, Hot]
	            switch (r || evolve.global.race.snowy || 1){
	                case 0.25:
	                    return [4,10];
	                case 0.5:
	                    return [3,8];
	                case 1:
	                    return [2,5];
	                case 2:
	                    return [2,4];
	                case 3:
	                    return [1,3];
	            }
	        }
	    },
	    ravenous: { // Drastically increases food consumption
	        name: loc('trait_ravenous_name'),
	        desc: loc('trait_ravenous'),
	        type: 'major',
	        val: -5,
	        vars(r){
	            // [Extra Food Consumed, Stockpile Divisor]
	            switch (r || evolve.global.race.ravenous || 1){
	                case 0.25:
	                    return [30,2];
	                case 0.5:
	                    return [25,2];
	                case 1:
	                    return [20,3];
	                case 2:
	                    return [15,4];
	                case 3:
	                    return [10,4];
	            }
	        }
	    },
	    ghostly: { // More souls from hunting and soul wells, increased soul gem drop chance
	        name: loc('trait_ghostly_name'),
	        desc: loc('trait_ghostly'),
	        type: 'major',
	        val: 5,
	        vars(r){
	            // [Hunting Food, Soul Well Food, Soul Gem Adjust]
	            switch (r || evolve.global.race.ghostly || 1){
	                case 0.25:
	                    return [20,1.2,5];
	                case 0.5:
	                    return [25,1.25,10];
	                case 1:
	                    return [50,1.5,15];
	                case 2:
	                    return [60,1.6,20];
	                case 3:
	                    return [65,1.7,22];
	            }
	        }
	    },
	    lawless: { // Government lockout timer is reduced by 90%
	        name: loc('trait_lawless_name'),
	        desc: loc('trait_lawless'),
	        type: 'major',
	        val: 3,
	        vars(r){
	            switch (r || evolve.global.race.lawless || 1){
	                case 0.25:
	                    return [30];
	                case 0.5:
	                    return [50];
	                case 1:
	                    return [90];
	                case 2:
	                    return [95];
	                case 3:
	                    return [98];
	            }
	        }
	    },
	    mistrustful: { // Lose standing with rival cities quicker
	        name: loc('trait_mistrustful_name'),
	        desc: loc('trait_mistrustful'),
	        type: 'major',
	        val: -1,
	        vars(r){
	            switch (r || evolve.global.race.mistrustful || 1){
	                case 0.25:
	                    return [4];
	                case 0.5:
	                    return [3];
	                case 1:
	                    return [2];
	                case 2:
	                    return [1];
	                case 3:
	                    return [1];
	            }
	        }
	    },
	    humpback: { // Starvation resistance and miner/lumberjack boost
	        name: loc('trait_humpback_name'),
	        desc: loc('trait_humpback'),
	        type: 'major',
	        val: 4,
	        vars(r){
	            // [Starve Resist, Miner/Lumber boost]
	            switch (r || evolve.global.race.humpback || 1){
	                case 0.25:
	                    return [0.2, 8];
	                case 0.5:
	                    return [0.25, 10];
	                case 1:
	                    return [0.5, 20];
	                case 2:
	                    return [0.75, 25];
	                case 3:
	                    return [0.8, 30];
	            }
	        }
	    },
	    thalassophobia: { // Wharves are unavailable
	        name: loc('trait_thalassophobia_name'),
	        desc: loc('trait_thalassophobia'),
	        type: 'major',
	        val: -4,
	    },
	    fiery: { // Major war bonus
	        name: loc('trait_fiery_name'),
	        desc: loc('trait_fiery'),
	        type: 'major',
	        val: 10,
	        vars(r){
	            // [Combat Bonus, Hunting Bonus]
	            switch (r || evolve.global.race.fiery || 1){
	                case 0.25:
	                    return [30,15];
	                case 0.5:
	                    return [40,18];
	                case 1:
	                    return [65,25];
	                case 2:
	                    return [70,35];
	                case 3:
	                    return [72,38];
	            }
	        }
	    },
	    terrifying: { // No one will trade with you
	        name: loc('trait_terrifying_name'),
	        desc: loc('trait_terrifying'),
	        type: 'major',
	        val: 6,
	        vars(r){
	            // [Titanium Low Roll, Titanium High Roll]
	            switch (r || evolve.global.race.terrifying || 1){
	                case 0.25:
	                    return [8,20];
	                case 0.5:
	                    return [10,25];
	                case 1:
	                    return [12,32];
	                case 2:
	                    return [12,34];
	                case 3:
	                    return [12,36];
	            }
	        }
	    },
	    slaver: { // You capture victims and force them to work for you
	        name: loc('trait_slaver_name'),
	        desc: loc('trait_slaver'),
	        type: 'major',
	        val: 12,
	        vars(r){
	            switch (r || evolve.global.race.slaver || 1){
	                case 0.25:
	                    return [0.1];
	                case 0.5:
	                    return [0.14];
	                case 1:
	                    return [0.28];
	                case 2:
	                    return [0.3];
	                case 3:
	                    return [0.32];
	            }
	        }
	    },
	    compact: { // You hardly take up any space at all
	        name: loc('trait_compact_name'),
	        desc: loc('trait_compact'),
	        type: 'major',
	        val: 10,
	        vars(r){
	            // [Planet Creep, Space Creep]
	            switch (r || evolve.global.race.compact || 1){
	                case 0.25:
	                    return [0.005,0.003];
	                case 0.5:
	                    return [0.01,0.005];
	                case 1:
	                    return [0.015,0.0075];
	                case 2:
	                    return [0.018,0.0085];
	                case 3:
	                    return [0.02,0.009];
	            }
	        }
	    },
	    conniving: { // Better trade deals
	        name: loc('trait_conniving_name'),
	        desc: loc('trait_conniving'),
	        type: 'major',
	        val: 4,
	        vars(r){
	            // [Buy Price, Sell Price]
	            switch (r || evolve.global.race.conniving || 1){
	                case 0.25:
	                    return [2,8];
	                case 0.5:
	                    return [3,10];
	                case 1:
	                    return [5,15];
	                case 2:
	                    return [8,20];
	                case 3:
	                    return [10,24];
	            }
	        }
	    },
	    pathetic: { // You suck at combat
	        name: loc('trait_pathetic_name'),
	        desc: loc('trait_pathetic'),
	        type: 'major',
	        val: -5,
	        vars(r){
	            switch (r || evolve.global.race.pathetic || 1){
	                case 0.25:
	                    return [35];
	                case 0.5:
	                    return [30];
	                case 1:
	                    return [25];
	                case 2:
	                    return [20];
	                case 3:
	                    return [15];
	            }
	        }
	    },
	    spiritual: { // Temples are 13% more effective
	        name: loc('trait_spiritual_name'),
	        desc: loc('trait_spiritual'),
	        type: 'major',
	        val: 4,
	        vars(r){
	            switch (r || evolve.global.race.spiritual || 1){
	                case 0.25:
	                    return [8];
	                case 0.5:
	                    return [10];
	                case 1:
	                    return [13];
	                case 2:
	                    return [15];
	                case 3:
	                    return [18];
	            }
	        }
	    },
	    truthful: { // Bankers are less effective
	        name: loc('trait_truthful_name'),
	        desc: loc('trait_truthful'),
	        type: 'major',
	        val: -7,
	        vars(r){
	            switch (r || evolve.global.race.truthful || 1){
	                case 0.25:
	                    return [75];
	                case 0.5:
	                    return [65];
	                case 1:
	                    return [50];
	                case 2:
	                    return [30];
	                case 3:
	                    return [20];
	            }
	        }
	    },
	    unified: { // Start with unification
	        name: loc('trait_unified_name'),
	        desc: loc('trait_unified'),
	        type: 'major',
	        val: 4,
	    },
	    rainbow: { // Gain a bonus if sunny after raining
	        name: loc('trait_rainbow_name'),
	        desc: loc('trait_rainbow'),
	        type: 'major',
	        val: 3,
	        vars(r){
	            switch (r || evolve.global.race.rainbow || 1){
	                case 0.25:
	                    return [20];
	                case 0.5:
	                    return [30];
	                case 1:
	                    return [50];
	                case 2:
	                    return [80];
	                case 3:
	                    return [100];
	            }
	        }
	    },
	    magnificent: { // construct shrines to receive boons
	        name: loc('trait_magnificent_name'),
	        desc: loc('trait_magnificent'),
	        type: 'major',
	        val: 6,
	    },
	    noble: { // Unable to raise taxes above base value or set very low taxes
	        name: loc('trait_noble_name'),
	        desc: loc('trait_noble'),
	        type: 'major',
	        val: -3,
	        vars(r){
	            // [min tax, max tax]
	            switch (r || evolve.global.race.noble || 1){
	                case 0.25:
	                    return [15,20];
	                case 0.5:
	                    return [12,20];
	                case 1:
	                    return [10,20];
	                case 2:
	                    return [10,24];
	                case 3:
	                    return [10,28];
	            }
	        }
	    },
	    imitation: { // You are an imitation of another species
	        name: loc('trait_imitation_name'),
	        desc: loc('trait_imitation'),
	        type: 'major',
	        val: 6,
	        vars(r){
	            // [Postitive Trait Rank, Negative Trait Rank]
	            switch (r || evolve.global.race.imitation || 1){
	                case 0.25:
	                    return [0.25,0.5];
	                case 0.5:
	                    return [0.25,1];
	                case 1:
	                    return [0.5,1];
	                case 2:
	                    return [0.5,2];
	                case 3:
	                    return [1,2];
	            }
	        }
	    },
	    emotionless: { // You have no emotions, cold logic dictates your decisions
	        name: loc('trait_emotionless_name'),
	        desc: loc('trait_emotionless'),
	        type: 'major',
	        val: -4,
	        vars(r){
	            // [Entertainer Reduction, Stress Reduction]
	            switch (r || evolve.global.race.emotionless || 1){
	                case 0.25:
	                    return [50,10];
	                case 0.5:
	                    return [45,10];
	                case 1:
	                    return [35,13];
	                case 2:
	                    return [25,15];
	                case 3:
	                    return [20,15];
	            }
	        }
	    },
	    logical: { // Citizens add Knowledge
	        name: loc('trait_logical_name'),
	        desc: loc('trait_logical'),
	        type: 'major',
	        val: 6,
	        vars(r){
	            // [Reduce Wardenclyffe Knowledge Cost, Knowledge per Citizen]
	            switch (r || evolve.global.race.logical || 1){
	                case 0.25:
	                    return [25,10];
	                case 0.5:
	                    return [50,15];
	                case 1:
	                    return [100,25];
	                case 2:
	                    return [125,30];
	                case 3:
	                    return [150,32];
	            }
	        }
	    },
	    shapeshifter: {
	        name: loc('trait_shapeshifter_name'),
	        desc: loc('trait_shapeshifter'),
	        type: 'major',
	        val: 10,
	        vars(r){
	            // [Postitive Trait Rank, Negative Trait Rank]
	            switch (r || evolve.global.race.shapeshifter || 1){
	                case 0.25:
	                    return [0.25,0.5];
	                case 0.5:
	                    return [0.25,1];
	                case 1:
	                    return [0.5,1];
	                case 2:
	                    return [0.5,2];
	                case 3:
	                    return [1,2];
	            }
	        }
	    },
	    deconstructor: {
	        name: loc('trait_deconstructor_name'),
	        desc: loc('trait_deconstructor'),
	        type: 'major',
	        val: -4,
	        vars(r){
	            switch (r || evolve.global.race.deconstructor || 1){
	                case 0.25:
	                    return [40];
	                case 0.5:
	                    return [60];
	                case 1:
	                    return [100];
	                case 2:
	                    return [125];
	                case 3:
	                    return [140];
	            }
	        }
	    },
	    linked: {
	        name: loc('trait_linked_name'),
	        desc: loc('trait_linked'),
	        type: 'major',
	        val: 4,
	        vars(r){
	            // [Quantum Bonus per Citizen, Softcap]
	            switch (r || evolve.global.race.linked || 1){
	                case 0.25:
	                    return [0.03,40];
	                case 0.5:
	                    return [0.05,40];
	                case 1:
	                    return [0.1,80];
	                case 2:
	                    return [0.12,100];
	                case 3:
	                    return [0.14,100];
	            }
	        }
	    },
	    ooze: { // you are some kind of ooze, everything is bad
	        name: loc('trait_ooze_name'),
	        desc: loc('trait_ooze'),
	        type: 'major',
	        val: -50,
	        vars(r){
	            // [All jobs worse, Theology weaker, Mastery weaker]
	            switch (r || evolve.global.race.ooze || 1){
	                case 0.25:
	                    return [20,25,40];
	                case 0.5:
	                    return [15,20,35];
	                case 1:
	                    return [12,15,30];
	                case 2:
	                    return [10,12,25];
	                case 3:
	                    return [8,10,20];
	            }
	        }
	    },
	    soul_eater: { // You eat souls for breakfast, lunch, and dinner
	        name: loc('trait_soul_eater_name'),
	        desc: loc('trait_soul_eater'),
	        type: 'special',
	        val: 0,
	    },
	    untapped: { // Untapped Potential
	        name: loc('trait_untapped_name'),
	        desc: loc('trait_untapped'),
	        type: 'special',
	        val: 0,
	    },
	    emfield: { // Your body produces a natural electromagnetic field that disrupts electriciy
	        name: loc('trait_emfield_name'),
	        desc: loc('trait_emfield'),
	        type: 'special',
	        val: -20,
	    },
	    tactical: { // War Bonus
	        name: loc('trait_tactical_name'),
	        desc: loc('trait_tactical'),
	        type: 'minor',
	        vars(r){ return [5]; },
	    },
	    analytical: { // Science Bonus
	        name: loc('trait_analytical_name'),
	        desc: loc('trait_analytical'),
	        type: 'minor',
	        vars(r){ return [1]; },
	    },
	    promiscuous: { // Organics Growth Bonus, Synths Population Discount
	        name: loc('trait_promiscuous_name'),
	        desc: loc('trait_promiscuous'),
	        type: 'minor',
	        vars(r){ return [1,0.02]; },
	    },
	    resilient: { // Coal Mining Bonus
	        name: loc('trait_resilient_name'),
	        desc: loc('trait_resilient'),
	        type: 'minor',
	        vars(r){ return [2]; },
	    },
	    cunning: { // Hunting Bonus
	        name: loc('trait_cunning_name'),
	        desc: loc('trait_cunning'),
	        type: 'minor',
	        vars(r){ return [5]; },
	    },
	    hardy: { // Factory Woker Bonus
	        name: loc('trait_hardy_name'),
	        desc: loc('trait_hardy'),
	        type: 'minor',
	        vars(r){ return [1]; },
	    },
	    ambidextrous: { // Crafting Bonus
	        name: loc('trait_ambidextrous_name'),
	        desc: loc('trait_ambidextrous'),
	        type: 'minor',
	        vars(r){ return [3,2]; },
	    },
	    industrious: { // Miner Bonus
	        name: loc('trait_industrious_name'),
	        desc: loc('trait_industrious'),
	        type: 'minor',
	        vars(r){ return [2]; },
	    },
	    content: { // Morale Bonus
	        name: loc('trait_content_name'),
	        desc: loc('trait_content'),
	        type: 'minor',
	    },
	    fibroblast: { // Healing Bonus
	        name: loc('trait_fibroblast_name'),
	        desc: loc('trait_fibroblast'),
	        type: 'minor',
	        vars(r){ return [2]; },
	    },
	    metallurgist: { // Alloy bonus
	        name: loc('trait_metallurgist_name'),
	        desc: loc('trait_metallurgist'),
	        type: 'minor',
	        vars(r){ return [4]; },
	    },
	    gambler: { // Casino bonus
	        name: loc('trait_gambler_name'),
	        desc: loc('trait_gambler'),
	        type: 'minor',
	        vars(r){ return [4]; },
	    },
	    persuasive: { // Trade bonus
	        name: loc('trait_persuasive_name'),
	        desc: loc('trait_persuasive'),
	        type: 'minor',
	        vars(r){ return [1]; },
	    },
	    fortify: { // gene fortification
	        name: loc('trait_fortify_name'),
	        desc: loc('trait_fortify'),
	        type: 'special',
	    },
	    mastery: { // mastery booster
	        name: loc('trait_mastery_name'),
	        desc: loc('trait_mastery'),
	        type: 'special',
	        vars(r){ return [1]; },
	    }
	}
	
 })(jQuery);
