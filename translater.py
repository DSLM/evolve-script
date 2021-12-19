# coding=utf-8

oldFile = open("evolve_automation.user.js", "r", encoding="utf-8")
newFile = open("evolve_automation_chinese.user.js", "w", encoding="utf-8")

content = oldFile.read()

replaceLsit = {
     # NOTE: 开头
    'https://gist.github.com/Vollch/b1a5eec305558a48b7f4575d317d7dd1/raw/evolve_automation.user.js':'https://github.com/DSLM/evolve-script/raw/master/evolve_automation_chinese.user.js',
    '// @match        https://pmotschmann.github.io/Evolve/':'''// @match        https://pmotschmann.github.io/Evolve/
// @match        https://likexia.gitee.io/evolve/''',
    '// This script forked from TMVictor\'s script version 3.3.1. Original script: https://gist.github.com/TMVictor/3f24e27a21215414ddc68842057482da':'// This script forked from TMVictor\'s script version 3.3.1. Original script: https://gist.github.com/TMVictor/3f24e27a21215414ddc68842057482da\n// Removed downloadURL in case that script got screwed up. Original downloadURL: @downloadURL  https://gist.github.com/Vollch/b1a5eec305558a48b7f4575d317d7dd1/raw/evolve_automation.user.js',

     # NOTE: 侧边栏高级设置
    ">Variable 1<": ">变量1<",
    ">Check<": ">运算<",
    ">Variable 2<": ">变量2<",
    ">Result<": ">结果<",
    ">Value<": ">值<",
    '>Type<':'>类型<',
    'let types = Object.entries(checkCompare).map(([id, fn]) => `<option value="${id}" title="${fn.toString().substr(10)}">${id}</option>`).join();':'let translateCondition = {"AND":"与", "OR":"或", "NOR":"或非", "NAND":"与非", "XOR":"异或", "XNOR":"同或", "AND!":"与(变量2取非)", "OR!":"或(变量2取非)"}; let types = Object.entries(checkCompare).map(([id, fn]) => `<option value="${id}" title="${fn.toString().substr(10)}">${typeof(translateCondition[id])!="undefined"?translateCondition[id]:id}</option>`).join();',
    'let types = Object.entries(checkTypes).map(([id, type]) => `<option value="${id}" title="${type.desc}">${id.replace(/([A-Z])/g, \' $1\').trim()}</option>`).join();':'let types = Object.entries(checkTypes).map(([id, type]) => `<option value="${id}" title="${type.desc}">${type.title}</option>`).join();',
    'desc: "Returns string"':'desc: "返回字符串的值", title:"字符串"',
    'desc: "Returns number"':'desc: "返回数值的值", title:"数值"',
    'desc: "Returns boolean"':'desc: "返回布尔值的值", title:"布尔值"',
    'desc: "Returns default value of setting, types varies"':'desc: "返回默认设置的值，数值类型可变", title:"默认设置"',
    'desc: "Returns current value of setting, types varies"':'desc: "返回当前设置的值，数值类型可变", title:"当前设置"',
    'desc: "Returns result of evaluating code"':'desc: "返回代码求值后的值", title:"求值"',
    'desc: "Return true when building is unlocked"':'desc: "如果建筑已解锁，则返回真值", title:"建筑是否解锁"',
    'desc: "Return true when building have all required resources, and can be purchased"':'desc: "如果建筑满足所有建造条件并可以建造，则返回真值", title:"建筑是否可点击"',
    'desc: "Return true when building is affordable, i.e. costs of all resources below storage caps"':'desc: "如果建筑足够资源建造，则返回真值", title:"建筑是否足够资源建造"',
    'desc: "Returns amount of buildings as number"':'desc: "以数值形式返回建筑数量", title:"建筑数量"',
    'desc: "Returns amount of powered buildings as number"':'desc: "以数值形式返回建筑已供能的数量", title:"建筑启用数量"',
    'desc: "Returns amount of unpowered buildings as number"':'desc: "以数值形式返回建筑未供能的数量", title:"建筑停用数量"',
    'desc: "Return true when project is unlocked"':'desc: "如果ARPA项目已解锁，则返回真值", title:"ARPA项目是否解锁"',
    'desc: "Returns amount of projects as number"':'desc: "以数值形式返回ARPA项目数量", title:"ARPA项目数量"',
    'desc: "Returns progress of projects as number"':'desc: "以数值形式返回ARPA项目的进度", title:"ARPA项目进度"',
    'desc: "Returns true when job is unlocked"':'desc: "如果工作已解锁，则返回真值", title:"工作是否解锁"',
    'desc: "Returns current amount of assigned workers as number"':'desc: "以数值形式返回已分配的工人数量", title:"工作数量"',
    'desc: "Returns maximum amount of assigned workers as number"':'desc: "以数值形式返回可分配的工人上限数量", title:"工作上限"',
    'desc: "Returns true when research is unlocked"':'desc: "如果研究已解锁，则返回真值", title:"研究是否解锁"',
    'desc: "Returns true when research is complete"':'desc: "如果研究已完成，则返回真值", title:"研究是否完成"',
    'desc: "Returns true when resource or support is unlocked"':'desc: "如果资源已解锁，则返回真值", title:"资源是否解锁"',
    'desc: "Returns current amount of resource or support as number"':'desc: "以数值形式返回当前资源或支持的数量", title:"资源数量"',
    'desc: "Returns maximum amount of resource or support as number"':'desc: "以数值形式返回资源或支持上限的数量", title:"资源上限"',
    'desc: "Returns current income of resource or unused support as number"':'desc: "以数值形式返回当前资源收入或未使用的支持的数量", title:"资源收入"',
    'desc: "Returns storage ratio of resource as number. Number 0.5 means that storage is 50% full, and such."':'desc: "以数值形式返回当前资源与上限比值的数量。0.5意味着资源到达了储量上限的50%，以此类推。", title:"资源比例"',
    'desc: "Returns true when current amount of resource above maximum costs"':'desc: "如果当前资源超过了最大花费，则返回真值。", title:"资源是否满足"',
    'desc: "Returns true when resource is demanded, i.e. missed by some prioritized task, such as queue or trigger"':'desc: "如果资源目前需要，则返回真值。例如，当前队列或者触发器的消耗包含此项资源。", title:"资源是否需要"',
    'desc: "Returns ID of selected race as string"':'desc: "以字符串形式返回所选择种族的类别", title:"种族类别"',
    'desc: "Returns true when selected race pillared at current star level"':'desc: "如果当前种族已经在当前成就等级下在永恒立柱上嵌入水晶，则返回真值", title:"种族是否已嵌水晶"',
    'desc: "Returns true when playing selected genus"':'desc: "如果当前种群为所选择的种群，则返回真值", title:"当前种群"',
    'desc: "Returns true when mimicking selected genus"':'desc: "如果拟态特质选择的种群为所选择的种群，则返回真值", title:"拟态种群"',
    'desc: "Returns trait level as number"':'desc: "以数值形式返回特质的等级", title:"特质等级"',
    'desc: "Returns true when selected reset is active"':'desc: "如果正在进行所选择的重置类型，则返回真值", title:"重置类型"',
    'desc: "Returns true when selected challenge is active"':'desc: "如果当前游戏激活了相应的挑战，则返回真值", title:"挑战"',
    'desc: "Returns true when playing in selected universe"':'desc: "如果当前宇宙为所选择的宇宙，则返回真值", title:"宇宙"',
    'desc: "Returns true when selected government is active"':'desc: "如果当前社会体制为所选择的社会体制，则返回真值", title:"社会体制"',
    'desc: "Returns true when selected governor is active"':'desc: "如果当前游戏激活了相应的总督，则返回真值", title:"总督"',
    'desc: "Returns amount of items in queue as number"':'desc: "以数值形式返回队列中内容的数量", title:"队列"',
    'desc: "Returns ingame date as number"':'desc: "以数值形式返回游戏中天数的数量", title:"天数"',
    'desc: "Returns amount of soldiers as number"':'desc: "以数值形式返回士兵的数量", title:"士兵数"',
    'desc: "Returns true when playing in selected biome"':'desc: "如果当前行星的生物群系为所选择的生物群系，则返回真值", title:"行星生物群系"',
    'desc: "Returns true when planet have selected trait"':'desc: "如果当前行星的星球特性为所选择的星球特性，则返回真值", title:"行星星球特性"',
    '[{val: "species", label: "Current Race", hint: "Current race"},':'[{val: "species", label: "当前种族", hint: "当前种族"},',
    '{val: "gods", label: "Fanaticism Race", hint: "Gods race"},':'{val: "gods", label: "狂热信仰种族", hint: "狂热信仰的种族"},',
    '{val: "old_gods", label: "Deify Race", hint: "Old gods race"},':'{val: "old_gods", label: "神化先祖种族", hint: "神化先祖的种族"},',
    '{val: "protoplasm", label: "Protoplasm", hint: "Race is not chosen yet"},':'{val: "protoplasm", label: "原生质", hint: "还未选择种族"},',
    '[{val: "bigbang", label: "Big Bang", hint: "Universe is not chosen yet"},':'[{val: "bigbang", label: "大爆炸", hint: "还未选择宇宙"},',
    '[{val: "none", label: "None", hint: "No governor selected"},':'[{val: "none", label: "无", hint: "还未选择总督"},',
    '[{val: "queue", label: "Building", hint: "Buildings and projects queue"},':'[{val: "queue", label: "建筑", hint: "建筑队列"},',
    '{val: "r_queue", label: "Research", hint: "Research queue"},':'{val: "r_queue", label: "研究", hint: "研究队列"},',
    '{val: "evo", label: "Evolution", hint: "Evolution queue"}]},':'{val: "evo", label: "进化", hint: "进化队列"}]},',
    '[{val: "day", label: "Day (Year)", hint: "Day of year"},':'[{val: "day", label: "天数(年)", hint: "一年中的第几天"},',
    '{val: "moon", label: "Day (Month)", hint: "Day of month"},':'{val: "moon", label: "天数(月)", hint: "一月中的第几天"},',
    '{val: "total", label: "Day (Total)", hint: "Day of run"},':'{val: "total", label: "天数(总)", hint: "本轮游戏天数"},',
    '{val: "year", label: "Year", hint: "Year of run"},':'{val: "year", label: "年数", hint: "本轮游戏年数"},',
    '{val: "orbit", label: "Orbit", hint: "Planet orbit in days"}]},':'{val: "orbit", label: "公转天数", hint: "行星公转的天数"}]},',
    '[{val: "workers", label: "Total Soldiers"},':'[{val: "workers", label: "士兵总数"},',
    '{val: "max", label: "Total Soldiers Max"},':'{val: "max", label: "士兵总上限"},',
    '{val: "currentCityGarrison", label: "City Soldiers"},':'{val: "currentCityGarrison", label: "非地狱维度士兵数"},',
    '{val: "maxCityGarrison", label: "City Soldiers Max"},':'{val: "maxCityGarrison", label: "非地狱维度士兵上限"},',
    '{val: "hellSoldiers", label: "Hell Soldiers"},':'{val: "hellSoldiers", label: "地狱维度士兵数"},',
    '{val: "hellGarrison", label: "Hell Garrison"},':'{val: "hellGarrison", label: "地狱维度驻扎士兵"},',
    '{val: "hellPatrols", label: "Hell Patrols"},':'{val: "hellPatrols", label: "地狱维度巡逻队数量"},',
    '{val: "hellPatrolSize", label: "Hell Patrol Size"},':'{val: "hellPatrolSize", label: "地狱维度巡逻队规模"},',
    '{val: "wounded", label: "Wounded Soldiers"},':'{val: "wounded", label: "伤兵数"},',
    '{val: "deadSoldiers", label: "Dead Soldiers"},':'{val: "deadSoldiers", label: "士兵阵亡数"},',
    '{val: "crew", label: "Ship Crew"}]},':'{val: "crew", label: "船员数"}]},',
    "All values passed checks will be added or removed from list": "所有满足条件的数值将添加入列表，或者从列表中移除",
    "First value passed check will be used. Default value:": "从上往下，首个条件满足时，将使用相应数值。默认值为：",

     # NOTE: 侧边栏按钮
    'function createSettingToggle(node, settingKey, title':'function createSettingToggle(node, settingKey, label, title',
    '<span class="check"></span><span>${settingKey}</span>':'<span class="check"></span><span>${label}</span>',
    'scriptNode.append(`<label id="autoScriptInfo">More script options available in Settings tab<br>Ctrl+click options to open <span class="inactive-row">advanced configuration</span></label><br>`);':'scriptNode.append(`<label id="autoScriptInfo">设置选项卡中可以进行更详细的设置<br>按住Ctrl键再点击选项，可以开启<span class="inactive-row">进阶设置</span></label><br>`);',
    "createSettingToggle(scriptNode, 'masterScriptToggle', 'Stop taking any actions on behalf of the player.');":"createSettingToggle(scriptNode, 'masterScriptToggle', '启用脚本', '在玩家需要的时候，停止所有脚本的活动。');",
    "createSettingToggle(scriptNode, 'showSettings', 'You can disable rendering of settings UI once you\\\'ve done with configuring script, if you experiencing performance issues. It can help a little.', buildScriptSettings, removeScriptSettings);":"createSettingToggle(scriptNode, 'showSettings', '显示设置', '在设置选项卡中是否显示脚本相关设置。可能略微提升游戏速度。', buildScriptSettings, removeScriptSettings);",
    "createSettingToggle(scriptNode, 'autoEvolution', 'Runs through the evolution part of the game through to founding a settlement. In Auto Achievements mode will target races that you don\\\'t have extinction\\\\greatness achievements for yet.');":"createSettingToggle(scriptNode, 'autoEvolution', '自动进化', '自动进行进化阶段。如果选择自动完成成就，则会优先考虑还未完成过毁灭类成就或者伟大类成就的种族。');",
    "createSettingToggle(scriptNode, 'autoFight', 'Sends troops to battle whenever Soldiers are full and there are no wounded. Adds to your offensive battalion and switches attack type when offensive rating is greater than the rating cutoff for that attack type.');":"createSettingToggle(scriptNode, 'autoFight', '自动战斗', '当士兵已满员且没有伤兵时让他们进行战斗。当战斗评级足够以后，会自动切换战役类型。');",
    "createSettingToggle(scriptNode, 'autoHell', 'Sends soldiers to hell and sends them out on patrols. Adjusts maximum number of powered attractors based on threat.');":"createSettingToggle(scriptNode, 'autoHell', '自动地狱维度', '将士兵派往地狱维度并自动分配巡逻队。根据恶魔生物数量自动调节吸引器信标的数量。');",
    "createSettingToggle(scriptNode, 'autoMech', 'Builds most effective large mechs for current spire floor. Least effective will be scrapped to make room for new ones.', createMechInfo, removeMechInfo);":"createSettingToggle(scriptNode, 'autoMech', '自动机甲', '建造效率最高的大型机甲。将根据当前的情况调整机甲配置。', createMechInfo, removeMechInfo);",
    "createSettingToggle(scriptNode, 'autoFleet', 'Manages Andromeda fleet to supress piracy');":"createSettingToggle(scriptNode, 'autoFleet', '自动仙女座舰队', '自动分配仙女座星系的舰队以压制海盗活动');",
    "createSettingToggle(scriptNode, 'autoTax', 'Adjusts tax rates if your current morale is greater than your maximum allowed morale. Will always keep morale above 100%.');":"createSettingToggle(scriptNode, 'autoTax', '自动税率', '如果当前的士气高于上限，则会自动调整税率。会尽可能将士气保持在100%以上。');",
    "createSettingToggle(scriptNode, 'autoCraft', 'Automatically produce craftable resources, thresholds when it happens depends on current demands and stocks.', createCraftToggles, removeCraftToggles);":"createSettingToggle(scriptNode, 'autoCraft', '自动锻造', '自动将资源转换为锻造物，进行转换的阈值根据当前需求和储量而定。', createCraftToggles, removeCraftToggles);",
    "createSettingToggle(scriptNode, 'autoTrigger', 'Purchase triggered buildings, projects, and researches once conditions met');":"createSettingToggle(scriptNode, 'autoTrigger', '自动触发器', '满足条件时，购买相应的建筑，项目或者研究');",
    "createSettingToggle(scriptNode, 'autoBuild', 'Construct buildings based on their weightings(user configured), and various rules(e.g. it won\\\'t build building which have no support to run)', createBuildingToggles, removeBuildingToggles);":"createSettingToggle(scriptNode, 'autoBuild', '自动建筑', '根据玩家设置的权重自动建造建筑，同时需要满足一定条件(例如：不会在支持不够时建造消耗相应支持的建筑)', createBuildingToggles, removeBuildingToggles);",
    "createSettingToggle(scriptNode, 'autoARPA', 'Builds ARPA projects if user enables them to be built.', createArpaToggles, removeArpaToggles);":"createSettingToggle(scriptNode, 'autoARPA', '自动ARPA', '自动建造玩家允许建造的ARPA项目。', createArpaToggles, removeArpaToggles);",
    "createSettingToggle(scriptNode, 'autoPower', 'Manages power based on a priority order of buildings. Also disables currently useless buildings to save up resources.');":"createSettingToggle(scriptNode, 'autoPower', '自动供能', '根据建筑的优先级自动管理供能。同时会自动关闭无用的建筑，以节省资源。');",
    "createSettingToggle(scriptNode, 'autoStorage', 'Assigns crates and containers to resources needed for buildings enabled for Auto Build, queued buildings, researches, and enabled projects', createStorageToggles, removeStorageToggles);":"createSettingToggle(scriptNode, 'autoStorage', '自动存储', '自动分配箱子来管理自动建造、队列中的建筑、研究、以及ARPA项目所需的资源存储。', createStorageToggles, removeStorageToggles);",
    "createSettingToggle(scriptNode, 'autoMarket', 'Allows for automatic buying and selling of resources once specific ratios are met. Also allows setting up trade routes until a minimum specified money per second is reached. The will trade in and out in an attempt to maximise your trade routes.', createMarketToggles, removeMarketToggles);":"createSettingToggle(scriptNode, 'autoMarket', '自动市场', '当资源到达某个比例以后自动买卖相应资源。也可以设置自动使用贸易路线进行交易，并且可以设置交易时最小的资金收入。将尽可能使用所有的贸易路线。', createMarketToggles, removeMarketToggles);",
    "createSettingToggle(scriptNode, 'autoGalaxyMarket', 'Manages galaxy trade routes');":"createSettingToggle(scriptNode, 'autoGalaxyMarket', '自动星际贸易', '自动管理星际贸易路线');",
    "createSettingToggle(scriptNode, 'autoResearch', 'Performs research when minimum requirements are met.');":"createSettingToggle(scriptNode, 'autoResearch', '自动研究', '当满足相应条件时自动进行研究。');",
    "createSettingToggle(scriptNode, 'autoJobs', 'Assigns jobs in a priority order with multiple breakpoints. Starts with a few jobs each and works up from there. Will try to put a minimum number on lumber / stone then fill up capped jobs first.');":"createSettingToggle(scriptNode, 'autoJobs', '自动工作', '以相应优先级和多个阈值来自动分配工作。将先满足第一阈值后，再考虑第二阈值，然后再考虑最终阈值。在考虑其他工作前会先考虑伐木工人和石工数量。');",
    "createSettingToggle(scriptNode, 'autoCraftsmen', 'With this option autoJobs will also manage craftsmens.');":"createSettingToggle(scriptNode, 'autoCraftsmen', '自动工匠', '自动分配工匠。');",
    "createSettingToggle(scriptNode, 'autoAlchemy', 'Manages alchemic transmutations');":"createSettingToggle(scriptNode, 'autoAlchemy', '自动炼金术', '自动管理炼金术转化');",
    "createSettingToggle(scriptNode, 'autoPylon', 'Manages pylon rituals');":"createSettingToggle(scriptNode, 'autoPylon', '自动水晶塔', '自动管理水晶塔符文');",
    "createSettingToggle(scriptNode, 'autoQuarry', 'Manages rock quarry stone to chrysotile ratio for smoldering races');":"createSettingToggle(scriptNode, 'autoQuarry', '自动温石棉控制', '烈焰种族自动管理石头和温石棉的比例');",
    "createSettingToggle(scriptNode, 'autoSmelter', 'Manages smelter fuel and production.');":"createSettingToggle(scriptNode, 'autoSmelter', '自动冶炼', '自动管理冶炼厂的生产。');",
    "createSettingToggle(scriptNode, 'autoFactory', 'Manages factory production.');":"createSettingToggle(scriptNode, 'autoFactory', '自动工厂', '自动管理工厂的生产。');",
    "createSettingToggle(scriptNode, 'autoMiningDroid', 'Manages mining droid production.');":"createSettingToggle(scriptNode, 'autoMiningDroid', '自动采矿机器人', '自动管理采矿机器人的生产。');",
    "createSettingToggle(scriptNode, 'autoGraphenePlant', 'Manages graphene plant. Not user configurable - just uses least demanded resource for fuel.');":"createSettingToggle(scriptNode, 'autoGraphenePlant', '自动石墨烯厂', '自动管理石墨烯厂的燃料。无法手动控制，会自动使用需求最少的燃料。');",
    "createSettingToggle(scriptNode, 'autoAssembleGene', 'Automatically assembles genes only when your knowledge is at max. Stops when DNA Sequencing is researched.');":"createSettingToggle(scriptNode, 'autoAssembleGene', '自动组装基因', '当知识满了以后，自动进行基因重组。进行首次测序时不生效。');",
    "createSettingToggle(scriptNode, 'autoMinorTrait', 'Purchase minor traits using genes according to their weighting settings.');":"createSettingToggle(scriptNode, 'autoMinorTrait', '自动次要基因', '根据相应的权重，自动使用基因购买次要特质。');",
    "createSettingToggle(scriptNode, 'autoEject', 'Eject excess resources to black hole. Normal resources ejected when they close to storage cap, craftables - when above requirements.', createEjectToggles, removeEjectToggles);":"createSettingToggle(scriptNode, 'autoEject', '自动质量喷射', '将多余的资源用于黑洞质量喷射。普通资源将在接近上限时用于喷射，锻造物将在超过需求时用于喷射。', createEjectToggles, removeEjectToggles);",
    "createSettingToggle(scriptNode, 'autoSupply', 'Send excess resources to Spire. Normal resources sent when they close to storage cap, craftables - when above requirements. Takes priority over ejector.', createSupplyToggles, removeSupplyToggles);":"createSettingToggle(scriptNode, 'autoSupply', '自动补给', '将多余的资源用于补给。普通资源将在接近上限时用于补给，锻造物将在超过需求时用于补给。优先级高于质量喷射器。', createSupplyToggles, removeSupplyToggles);",
    "createSettingToggle(scriptNode, 'autoNanite', 'Consume resources to produce Nanite. Normal resources sent when they close to storage cap, craftables - when above requirements. Takes priority over supplies and ejector.');":"createSettingToggle(scriptNode, 'autoNanite', '自动纳米体', '将资源转化为纳米体。普通资源将在接近上限时用于转化，锻造物将在超过需求时用于转化。优先级高于补给和质量喷射器。');",
    '$(`<div style="cursor: pointer;" id="${optionsElementId}">${optionsDisplayName} Options</div>`);':'$(`<div style="cursor: pointer;" id="${optionsElementId}">${optionsDisplayName}选项</div>`);',
    "createQuickOptions(scriptNode, \"s-quick-prestige-options\", \"Prestige\", buildPrestigeSettings);":"createQuickOptions(scriptNode, \"s-quick-prestige-options\", \"威望重置\", buildPrestigeSettings);",

    # NOTE: 栏目标题
    '>${sectionName} Settings<':'>${sectionName}设置<',
    '>Reset ${sectionName} Settings<':'>${sectionName}设置还原<',
    'let sectionName = "General";':'let sectionName = "常规";',
    'let sectionName = "Prestige";':'let sectionName = "威望重置";',
    'let sectionName = "Government";':'let sectionName = "政府";',
    'let sectionName = "Evolution";':'let sectionName = "进化";',
    'let sectionName = "Planet Weighting";':'let sectionName = "星球权重";',
    'let sectionName = "Trigger";':'let sectionName = "触发器";',
    'let sectionName = "Research";':'let sectionName = "研究";',
    'let sectionName = "Foreign Affairs";':'let sectionName = "外交事务";',
    'let sectionName = "Hell";':'let sectionName = "地狱维度";',
    'let sectionName = "Fleet";':'let sectionName = "舰队";',
    'let sectionName = "Mech & Spire";':'let sectionName = "机甲及尖塔";',
    'let sectionName = "Ejector, Supply & Nanite";':'let sectionName = "质量喷射、补给及纳米体";',
    'let sectionName = "Market";':'let sectionName = "市场";',
    'let sectionName = "Storage";':'let sectionName = "存储";',
    'let sectionName = "Traits";':'let sectionName = "次要特质";',
    'let sectionName = "Magic";':'let sectionName = "魔法";',
    'let sectionName = "Production";':'let sectionName = "生产";',
    'let sectionName = "Job";':'let sectionName = "工作";',
    'let sectionName = "AutoBuild Weighting";':'let sectionName = "自动建筑权重";',
    'let sectionName = "Building";':'let sectionName = "建筑";',
    'let sectionName = "A.R.P.A.";':'let sectionName = "ARPA";',
    'let sectionName = "Logging";':'let sectionName = "日志";',

    # NOTE: 威望重置设置
    '<span>Prestige Type</span>':'<span>威望重置类型：</span>',
    '{val: "none", label: "None", hint: "Endless game"},':'{val: "none", label: "无", hint: "不会自动重置"},',
    '{val: "mad", label: "Mutual Assured Destruction", hint: "MAD prestige once MAD has been researched and all soldiers are home"},':'{val: "mad", label: "核弹重置", hint: "当研究相互毁灭，且士兵全部存活时，进行核弹重置"},',
    '{val: "bioseed", label: "Bioseed", hint: "Launches the bioseeder ship to perform prestige when required probes have been constructed"},':'{val: "bioseed", label: "播种重置", hint: "当太空探测器数量达到指定值以后，进行播种重置"},',
    '{val: "cataclysm", label: "Cataclysm", hint: "Perform cataclysm reset by researching Dial It To 11 once available"},':'{val: "cataclysm", label: "大灾变重置", hint: "自动研究把刻度盘拨到11，触发大灾变重置"},',
    '{val: "whitehole", label: "Whitehole", hint: "Infuses the blackhole with exotic materials to perform prestige"},':'{val: "whitehole", label: "黑洞重置", hint: "自动选择奇异灌输，触发黑洞重置"},',
    '{val: "vacuum", label: "Vacuum Collapse", hint: "Build Mana Syphons until the end"},':'{val: "vacuum", label: "真空坍缩", hint: "自动建造法力虹吸，触发真空坍缩"},',
    '{val: "apocalypse", label: "AI Apocalypse", hint: "Perform AI Apocalypse reset by researching Protocol 66 once available"},':'{val: "apocalypse", label: "人工智能觉醒", hint: "自动研究《第66号技术协议》，触发人工智能觉醒"},',
    '{val: "ascension", label: "Ascension", hint: "Allows research of Incorporeal Existence and Ascension. Ascension Machine managed by autoPower. User input still required to trigger reset, and create custom race."},':'{val: "ascension", label: "飞升重置", hint: "允许研究无形存在和飞升。飞升装置由自动供能进行管理。仍然需要玩家手动触发飞升并创建自建种族。"},',
    '{val: "demonic", label: "Demonic Infusion", hint: "Sacrifice your entire civilization to absorb the essence of a greater demon lord"}]);':'{val: "demonic", label: "恶魔灌注", hint: "注入恶魔之力，牺牲整个文明，成为恶魔领主"}]);',
    'addSettingsToggle(currentNode, "prestigeWaitAT", "Use all Accelerated Time", "Delay reset until all accelerated time will be used");':'addSettingsToggle(currentNode, "prestigeWaitAT", "是否在重置前用完所有的加速时间", "直到用完所有的加速时间才进行重置");',
    'addSettingsToggle(currentNode, "prestigeBioseedConstruct", "Ignore useless buildings", "Space Dock, Bioseeder Ship and Probes will be constructed only when Bioseed prestige enabled. World Collider won\'t be constructed during Bioseed. Jump Ship won\'t be constructed during Whitehole. Stellar Engine won\'t be constucted during Vacuum Collapse.");':'addSettingsToggle(currentNode, "prestigeBioseedConstruct", "忽略无用的建筑", "只在需要进行播种重置时建造星际船坞、生命播种飞船和星际探测器，并且不建造世界超级对撞机。进行黑洞重置时不建造跃迁飞船。进行真空坍缩时不建造恒星引擎。");',
    'addSettingsNumber(currentNode, "prestigeEnabledBarracks", "Percent of active barracks after unification", "Percent of barracks to keep enabled after unification, disabling some of them can reduce stress. All barracks will be enabled back when Bioseeder Ship will be at 90%, or after building World Collider");':'addSettingsNumber(currentNode, "prestigeEnabledBarracks", "研究统一后的兵营比例", "研究统一后进行供能的兵营比例，取消供能可以提升士气。当生命播种飞船达到90段分项工程，或者是建造世界超级对撞机后，所有兵营将全部恢复供能。");',
    'addSettingsHeader1(currentNode, "Mutual Assured Destruction");':'addSettingsHeader1(currentNode, "核弹重置");',
    'addSettingsToggle(currentNode, "prestigeMADIgnoreArpa", "Pre-MAD: Ignore A.R.P.A.", "Disables building A.R.P.A. projects until MAD is researched");':'addSettingsToggle(currentNode, "prestigeMADIgnoreArpa", "是否在研究相互毁灭前不建造ARPA项目", "直到研究相互毁灭之前，不建造ARPA项目");',
    'addSettingsToggle(currentNode, "prestigeMADWait", "Wait for maximum population", "Wait for maximum population and soldiers to maximize plasmids gain");':'addSettingsToggle(currentNode, "prestigeMADWait", "是否等待人口达到最大", "等待市民和士兵达到最大以后再进行重置，以尽可能多地获得质粒");',
    'addSettingsNumber(currentNode, "prestigeMADPopulation", "Required population", "Required number of workers and soldiers before performing MAD reset");':'addSettingsNumber(currentNode, "prestigeMADPopulation", "人口阈值", "达到相应数量的市民和士兵后，才进行核弹重置");',
    'addSettingsHeader1(currentNode, "Bioseed");':'addSettingsHeader1(currentNode, "播种重置");',
    'addSettingsNumber(currentNode, "prestigeBioseedProbes", "Required probes", "Required number of probes before launching bioseeder ship");':'addSettingsNumber(currentNode, "prestigeBioseedProbes", "播种前至少需要的太空探测器数量", "达到太空探测器所需数量后，才进行播种重置");',
    'addSettingsHeader1(currentNode, "Whitehole");':'addSettingsHeader1(currentNode, "黑洞重置");',
    'addSettingsToggle(currentNode, "prestigeWhiteholeSaveGems", "Save up Soul Gems for reset", "Save up enough Soul Gems for reset, only excess gems will be used. This option does not affect triggers.");':'addSettingsToggle(currentNode, "prestigeWhiteholeSaveGems", "是否保留重置所需数量的灵魂宝石", "保留重置所需数量的灵魂宝石，只使用超过相应数量的灵魂宝石。不影响触发器。");',
    'addSettingsNumber(currentNode, "prestigeWhiteholeMinMass", "Minimum solar mass for reset", "Required minimum solar mass of blackhole before prestiging. Script do not stabilize on blackhole run, this number will need to be reached naturally");':'addSettingsNumber(currentNode, "prestigeWhiteholeMinMass", "太阳质量阈值，达到后才会进行黑洞重置", "达到太阳质量阈值后，才进行黑洞重置。脚本不会在威望重置类型为黑洞重置时稳定黑洞，需要自然达到此质量");',
    'addSettingsHeader1(currentNode, "Ascension");':'addSettingsHeader1(currentNode, "飞升重置");',
    'addSettingsToggle(currentNode, "prestigeAscensionSkipCustom", "Skip Custom Race", "Perform reset without making any changes to custom. This option is required, script won\'t ascend automatically without it enabled.");':'addSettingsToggle(currentNode, "prestigeAscensionSkipCustom", "是否忽略自建种族", "不对自建种族进行任何修改就进行重置。只有开启此项才能自动进行飞升重置。");',
    'addSettingsToggle(currentNode, "prestigeAscensionPillar", "Wait for Pillar", "Wait for Pillar before ascending, unless it was done earlier");':'addSettingsToggle(currentNode, "prestigeAscensionPillar", "是否等待永恒之柱", "直到永恒之柱上嵌入水晶后才进行重置");',
    'addSettingsHeader1(currentNode, "Demonic Infusion");':'addSettingsHeader1(currentNode, "恶魔灌注");',
    'addSettingsNumber(currentNode, "prestigeDemonicFloor", "Minimum spire floor for reset", "Perform reset after climbing up to this spire floor");':'addSettingsNumber(currentNode, "prestigeDemonicFloor", "进行恶魔灌注的层数阈值", "到达相应层数后才进行恶魔灌注");',
    'addSettingsNumber(currentNode, "prestigeDemonicPotential", "Maximum mech potential for reset", "Perform reset only if current mech team potential below given amount. Full bay of best mechs will have `1` potential. This allows to postpone reset if your team is still good after reaching target floor, and can quickly clear another floor");':'addSettingsNumber(currentNode, "prestigeDemonicPotential", "进行恶魔灌注的最大机甲潜力", "只在当前机甲潜力低于相应数值后才进行恶魔灌注。机甲舱充满最好设计的机甲时潜力为1。这样就可以在机甲战斗力还较高的时候延迟恶魔灌注，同时也可以更快地通过一些楼层。");',
    'addSettingsToggle(currentNode, "prestigeDemonicBomb", "Use Dark Energy Bomb", "Kill Demon Lord with Dark Energy Bomb");':'addSettingsToggle(currentNode, "prestigeDemonicBomb", "是否使用暗能量炸弹", "用暗能量炸弹送恶魔领主上西天");',


    # NOTE: 常规设置
    'addSettingsNumber(currentNode, "tickRate", "Script tick rate", "Script runs once per this amount of game ticks. Game tick every 250ms, thus with rate 4 script will run once per second. You can set it lower to make script act faster, or increase it if you have performance issues. Tick rate should be a positive integer.");':'addSettingsNumber(currentNode, "tickRate", "脚本运算频率", "每达到相应时刻后脚本就进行一次运算。游戏每250毫秒达到一个时刻，因此设为4以后脚本将每秒运算一次。您可以将此值调低以使脚本更快运行，也可以将此值调高来避免卡顿。时刻数值需要为正整数。");',
    'addSettingsHeader1(currentNode, "Prioritization");':'addSettingsHeader1(currentNode, "优先级");',
    '[{val: "ignore", label: "Ignore", hint: "Does nothing"},':'[{val: "ignore", label: "忽略", hint: "什么都不做"},',
    '{val: "save", label: "Save", hint: "Missing resources preserved from using."},':'{val: "save", label: "保留", hint: "缺失的资源保留下来不使用。"},',
    '{val: "req", label: "Request", hint: "Production and buying of missing resources will be prioritized."},':'{val: "req", label: "请求", hint: "优先生产和购买缺失的资源。"},',
    '{val: "savereq", label: "Request & Save", hint: "Missing resources will be prioritized, and preserved from using."}];':'{val: "savereq", label: "保留及请求", hint: "优先生产和购买缺失的资源，并保留它们不使用。"}];',
    'addSettingsToggle(currentNode, "useDemanded", "Allow using prioritized resources for crafting", "When disabled script won\'t make craftables out of prioritized resources in foundry and factory.");':'addSettingsToggle(currentNode, "useDemanded", "允许使用优先生产和购买的资源进行锻造和生产", "如果关闭此项，则脚本不会使用优先的资源来制造锻造物和工厂产品。");',
    'addSettingsToggle(currentNode, "researchRequest", "Prioritize resources for Pre-MAD researches", "Readjust trade routes and production to resources required for unlocked and affordable researches. Works only with no active triggers, or queue. Missing resources will have 100 priority where applicable(autoMarket, autoGalaxyMarket, autoFactory, autoMiningDroid), or just \'top priority\' where not(autoTax, autoCraft, autoCraftsmen, autoQuarry, autoSmelter).");':'addSettingsToggle(currentNode, "researchRequest", "资源是否优先分配给相互毁灭前的研究", "将贸易路线和生产资源调整为已解锁且上限足够的研究所需要的资源。只在触发器和队列中没有内容激活时生效。缺少的资源对于自动贸易、自动银河贸易、自动工厂和自动采矿机器人来说权重为100，对于自动税率、自动锻造、自动温石棉控制、自动冶炼来说为最高优先级。");',
    'addSettingsToggle(currentNode, "researchRequestSpace", "Prioritize resources for Space+ researches", "Readjust trade routes and production to resources required for unlocked and affordable researches. Works only with no active triggers, or queue. Missing resources will have 100 priority where applicable(autoMarket, autoGalaxyMarket, autoFactory, autoMiningDroid), or just \'top priority\' where not(autoTax, autoCraft, autoCraftsmen, autoQuarry, autoSmelter).");':'addSettingsToggle(currentNode, "researchRequestSpace", "资源是否优先分配给太空后的研究", "将贸易路线和生产资源调整为已解锁且上限足够的研究所需要的资源。只在触发器和队列中没有内容激活时生效。缺少的资源对于自动贸易、自动银河贸易、自动工厂和自动采矿机器人来说权重为100，对于自动税率、自动锻造、自动温石棉控制、自动冶炼来说为最高优先级。");',
    'addSettingsToggle(currentNode, "missionRequest", "Prioritize resources for missions", "Readjust trade routes and production to resources required for unlocked and affordable missions. Missing resources will have 100 priority where applicable(autoMarket, autoGalaxyMarket, autoFactory, autoMiningDroid), or just \'top priority\' where not(autoTax, autoCraft, autoCraftsmen, autoQuarry, autoSmelter).");':'addSettingsToggle(currentNode, "missionRequest", "资源是否优先分配给任务", "将贸易路线和生产资源调整为已解锁且上限足够的任务所需要的资源。缺少的资源对于自动贸易、自动银河贸易、自动工厂和自动采矿机器人来说权重为100，对于自动税率、自动锻造、自动温石棉控制、自动冶炼来说为最高优先级。");',
    'addSettingsSelect(currentNode, "prioritizeQueue", "Queue", "Alter script behaviour to speed up queued items, prioritizing missing resources.", priority);':'addSettingsSelect(currentNode, "prioritizeQueue", "队列", "调整脚本处理队列中项目的方式，优先缺失的资源。", priority);',
    'addSettingsSelect(currentNode, "prioritizeTriggers", "Triggers", "Alter script behaviour to speed up triggers, prioritizing missing resources.", priority);':'addSettingsSelect(currentNode, "prioritizeTriggers", "触发器", "调整脚本处理触发器中项目的方式，优先缺失的资源。", priority);',
    'addSettingsSelect(currentNode, "prioritizeUnify", "Unification", "Alter script behaviour to speed up unification, prioritizing money required to purchase foreign cities.", priority);':'addSettingsSelect(currentNode, "prioritizeUnify", "统一", "调整脚本处理统一的方式，优先使用资金来收购周边国家。", priority);',
    'addSettingsSelect(currentNode, "prioritizeOuterFleet", "Ship (The True Path)", "Alter script behaviour to assist fleet building, prioritizing resources required for current design of ship.", priority);':'addSettingsSelect(currentNode, "prioritizeOuterFleet", "舰船(智械黎明模式)", "调整脚本分配舰队建筑的方式，优先舰船缺失的资源。", priority);',
    'addSettingsHeader1(currentNode, "Auto clicker");':'addSettingsHeader1(currentNode, "自动点击");',
    'addSettingsToggle(currentNode, "buildingAlwaysClick", "Always autoclick resources", "By default script will click only during early stage of autoBuild, to bootstrap production. With this toggled on it will continue clicking forever");':'addSettingsToggle(currentNode, "buildingAlwaysClick", "是否总是自动收集资源", "默认情况下脚本只在游戏初期自动收集资源，开启此项后将一直自动收集资源");',
    'addSettingsNumber(currentNode, "buildingClickPerTick", "Maximum clicks per tick", "Number of clicks performed at once, each script tick. Will not ever click more than needed to fill storage.");':'addSettingsNumber(currentNode, "buildingClickPerTick", "每时刻最高点击次数", "每时刻自动收集资源的点击次数。只在库存未满的范围内有效。");',

    # NOTE: 政府设置
    'addSettingsNumber(currentNode, "generalMinimumTaxRate", "Minimum allowed tax rate", "Minimum tax rate for autoTax. Will still go below this amount if money storage is full");':'addSettingsNumber(currentNode, "generalMinimumTaxRate", "最低允许税率", "自动税率使用的最低税率。如果资金满了，将可能低于此数值。");',
    'addSettingsNumber(currentNode, "generalMinimumMorale", "Minimum allowed morale", "Use this to set a minimum allowed morale. Remember that less than 100% can cause riots and weather can cause sudden swings");':'addSettingsNumber(currentNode, "generalMinimumMorale", "最低允许士气", "设置最低允许的士气。少于100%士气可能引起税收抵制，请尽量不要设置到100%以下。另外请记得天气的影响");',
    'addSettingsNumber(currentNode, "generalMaximumMorale", "Maximum allowed morale", "Use this to set a maximum allowed morale. The tax rate will be raised to lower morale to this maximum");':'addSettingsNumber(currentNode, "generalMaximumMorale", "最高允许士气", "设置最高允许的士气。如果士气超过此数值，将提高税率");',
    'addSettingsToggle(currentNode, "govManage", "Manage changes of government", "Manage changes of government when they become available");':'addSettingsToggle(currentNode, "govManage", "是否管理社会体制变化", "当可能的时候，自动改变社会体制");',
    'addSettingsSelect(currentNode, "govInterim", "Interim Government", "Temporary low tier government until you research other governments", governmentOptions);':'addSettingsSelect(currentNode, "govInterim", "临时社会体制", "当研究其他社会体制之前，用于过渡的临时社会体制", governmentOptions);',
    'addSettingsSelect(currentNode, "govFinal", "Second Government", "Second government choice, chosen once becomes available. Can be the same as above", governmentOptions);':'addSettingsSelect(currentNode, "govFinal", "第二社会体制", "第二社会体制，当此社会体制可用后立刻进行切换。可以与上面的社会体制相同。", governmentOptions);',
    'addSettingsSelect(currentNode, "govSpace", "Space Government", "Government for bioseed+. Chosen once you researched Quantum Manufacturing. Can be the same as above", governmentOptions);':'addSettingsSelect(currentNode, "govSpace", "太空社会体制", "用于播种之后的社会体制，当研究量子制造以后立刻进行切换。可以与上面的社会体制相同。", governmentOptions);',
    'addSettingsSelect(currentNode, "govGovernor", "Governor", "Chosen governor will be appointed.", governorsOptions);':'addSettingsSelect(currentNode, "govGovernor", "总督", "将使用选中的总督。", governorsOptions);',
    '[{val: "none", label: "None", hint: "Do not select governor"}':'[{val: "none", label: "无", hint: "不选择总督"}',

    # NOTE: 进化设置
    '[{val: "none", label: "None", hint: "Wait for user selection"},':'[{val: "none", label: "无", hint: "等待玩家选择"},',
    'addSettingsSelect(currentNode, "userUniverseTargetName", "Target Universe", "Chosen universe will be automatically selected after appropriate reset", universeOptions);':'addSettingsSelect(currentNode, "userUniverseTargetName", "欲选择的宇宙", "在特定重置后自动选择相应的宇宙", universeOptions);',
    '[{val: "none", label: "None", hint: "Wait for user selection"},':'[{val: "none", label: "无", hint: "等待玩家选择"},',
    '{val: "habitable", label: "Most habitable", hint: "Picks most habitable planet, based on biome and trait"},':'{val: "habitable", label: "最宜居", hint: "根据生物群系和星球特性，选择最佳的星球"},',
    '{val: "achieve", label: "Most achievements", hint: "Picks planet with most unearned achievements. Takes in account extinction achievements for planet exclusive races, and greatness achievements for planet biome, trait, and exclusive genus."},':'{val: "achieve", label: "最多成就", hint: "选择可以尽可能多完成成就的星球。将考虑毁灭类成就中星球特有的种族，以及伟大类成就中生物群系，星球特征和特有的种群。"},',
    '{val: "weighting", label: "Highest weighting", hint: "Picks planet with highest weighting. Should be configured in Planet Weighting Settings section."}];':'{val: "weighting", label: "最高权重", hint: "选择星球权重最高的星球。可以在下面的星球权重设置中进行更进一步的设置。"}];',
    'addSettingsSelect(currentNode, "userPlanetTargetName", "Target Planet", "Chosen planet will be automatically selected after appropriate reset", planetOptions);':'addSettingsSelect(currentNode, "userPlanetTargetName", "欲选择的星球", "在特定重置后自动选择相应的星球", planetOptions);',
    '[{val: "auto", label: "Auto Achievements", hint: "Picks race giving most achievements upon completing run. Tracks all achievements limited to specific races and resets. Races unique to current planet biome are prioritized, when available."},':'[{val: "auto", label: "自动完成成就", hint: "优先选择可以获得更多成就的种族，会将所有种族和种群限定，或是重置方式限定的成就纳入考虑。生物群系特有的种族如果可以选择，将优先进行选择。"},',
    'addSettingsSelect(currentNode, "userEvolutionTarget", "Target Race", "Chosen race will be automatically selected during next evolution", raceOptions)':'addSettingsSelect(currentNode, "userEvolutionTarget", "欲进化的种族", "下个进化阶段自动选择相应的种族", raceOptions)',
    'addSettingsToggle(currentNode, "evolutionBackup", "Soft Reset", "Perform soft resets until you\'ll get chosen race. Useless after getting mass exintion perk.");':'addSettingsToggle(currentNode, "evolutionBackup", "是否进行软重置", "直到选中想要选择的种族之前一直进行软重置。在获得大灭绝特权后就没有必要选择了。");',
    'addStandardHeading(currentNode, "Evolution Queue");':'addStandardHeading(currentNode, "进化队列");',
    'addSettingsToggle(currentNode, "evolutionQueueEnabled", "Queue Enabled", "When enabled script with evolve with queued settings, from top to bottom. During that script settings will be overriden with settings stored in queue. Queued target will be removed from list after evolution.");':'addSettingsToggle(currentNode, "evolutionQueueEnabled", "是否开启进化队列", "按照队列从上至下进行进化。队列中有项目存在时，优先于脚本的进化设置生效。在完成进化后，相应的队列项目将被移除。");',
    'addSettingsToggle(currentNode, "evolutionQueueRepeat", "Repeat Queue", "When enabled applied evolution targets will be moved to the end of queue, instead of being removed");':'addSettingsToggle(currentNode, "evolutionQueueRepeat", "是否重复队列", "开启后，队列中的项目在完成进化后将回到队列末尾，而不是被移除");',
    '<label for="script_evolution_prestige">Prestige for new evolutions:</label>':'<label for="script_evolution_prestige">新一轮进化使用的威望重置类型：</label>',
    '<option value = "auto" title = "Inherited from current Prestige Settings">Current Prestige</option>':'<option value = "auto" title = "与当前的威望重置类型一致">当前的威望重置类型</option>',
    '<button id="script_evlution_add" class="button">Add New Evolution</button>':'<button id="script_evlution_add" class="button">添加进化队列</button>',
    '<th class="has-text-warning" style="width:25%">Race</th>':'<th class="has-text-warning" style="width:25%">种族</th>',
    '<th class="has-text-warning" style="width:70%" title="Settings applied before evolution. Changed settings not limited to initial template, you can manually add any script options to JSON.">Settings</th>':'<th class="has-text-warning" style="width:70%" title="进化之前生效的设置。不仅限于模板，您还可以将其他的脚本设置以JSON形式输入。">设置</th>',
    'prestigeName = "Unrecognized prestige!";':'prestigeName = " 威望重置类型无法识别！";',
    '{mad: "MAD", bioseed: "Bioseed", cataclysm: "Cataclysm", vacuum: "Vacuum", whitehole: "Whitehole", apocalypse: "AI Apocalypse", ascension: "Ascension", demonic: "Infusion"};':'{mad: "核弹重置", bioseed: "播种重置", cataclysm: "大灾变重置", vacuum: "真空坍缩", whitehole: "黑洞重置", apocalypse: "人工智能觉醒", ascension: "飞升重置", demonic: "恶魔灌注"};',
    '>This race have special requirements:':'>此种族的特殊要求为：',
    '. This condition is met.':'。当前满足此条件。',
    '>Warning! This race have special requirements:':'>警告！此种族的特殊要求为：',
    '. This condition is not met.':'。当前不满足此条件。',
    '. This condition is bypassed. Race will have ${100 - suited * 100}% penalty.':'。当前可使用此种族，但受到 ${100 - suited * 100}% 的产量惩罚。',
    'return "Oceanic planet";':'return "海洋星球";',
    'return "Forest planet";':'return "森林星球";',
    'return "Desert planet";':'return "沙漠星球";',
    'return "Volcanic planet";':'return "火山星球";',
    'return "Tundra planet";':'return "苔原星球";',
    'return "Hellscape planet";':'return "地狱星球";',
    'return "Eden planet";':'return "伊甸园星球";',

    # NOTE: 星球权重设置
    "Planet Weighting = Biome Weighting + Trait Weighting + (Extras Intensity * Extras Weightings)": "星球权重 = 群系权重 + 特性权重 + (其他项数值 * 其他项权重)",
    '>Biome<':'>群系<',
    '>Trait<':'>特性<',
    'buildTableLabel(i == 0 ? "None"':'buildTableLabel(i == 0 ? "无"',
    '>Extra<':'>其他<',
    'buildTableLabel(extraList[i])':'buildTableLabel(i == 0 ? "成就" : game.loc("resource_" + extraList[i] + "_name"))',
    '>Weighting<':'>权重<',

    # NOTE: 特质设置
    '[{val: "ignore", label: "Ignore", hint: "Do not shift genus"},':'[{val: "ignore", label: "忽略", hint: "不变换种群"},',
    'addSettingsSelect(currentNode, "shifterGenus", "Mimic genus", "Mimic selected genus, if avaialble. If you want to add some conditional overrides to this setting, keep in mind changing genus redraws game page, too frequent(every tick or few) changes can drastically harm game performance.", genusOptions);':'addSettingsSelect(currentNode, "shifterGenus", "拟态种群", "拟态特质选择相应种群。如果您想要对此项进行进阶设置，请注意切换拟态特质将刷新游戏页面，切换过于频繁将影响游戏运行。", genusOptions);',
    '>Minor Trait<':'>次要特质<',
    '>Enabled<':'>是否启用<',

    # NOTE: 触发器设置
    '>Add New Trigger<':'>添加新触发器<',
    '>Requirement<':'>需求<',
    '>Action<':'>行动<',
    '>Id<':'>Id<',
    '>Count<':'>计数<',
    '<option value = "unlocked" title = "This condition is met when technology is shown in research tab">Unlocked</option>':'<option value = "unlocked" title = "当相应研究解锁后，视为满足条件">解锁时</option>',
    '<option value = "researched" title = "This condition is met when technology is researched">Researched</option>':'<option value = "researched" title = "当进行相应研究后，视为满足条件">研究后</option>',
    '<option value = "built" title = "This condition is met when you have \'count\' or greater amount of buildings">Built</option>':'<option value = "built" title = "当相应建筑的数量达到相应数值后，视为满足条件">建造时</option>',
    '<option value = "research" title = "Research technology">Research</option>':'<option value = "research" title = "进行相应研究">研究</option>',
    '<option value = "build" title = "Build buildings up to \'count\' amount">Build</option>':'<option value = "build" title = "建造建筑，数量上限为计数">建造</option>',
    '<option value = "arpa" title = "Build projects up to \'count\' amount">A.R.P.A.</option>':'<option value = "arpa" title = "建造ARPA项目，数量上限为计数">A.R.P.A.</option>',

    # NOTE: 研究设置
    '[{val: "auto", label: "Script Managed", hint: "Picks Anthropology for MAD prestige, and Fanaticism for others. Achieve-worthy combos are exception, on such runs Fanaticism will be always picked."},':'[{val: "auto", label: "由脚本管理", hint: "进行核弹重置时选择人类学，其余情况下选择狂热信仰。需要狂热信仰祖先才能完成成就时例外，此时将一直选择狂热信仰。"},',
    'addSettingsSelect(currentNode, "userResearchTheology_1", "Target Theology 1", "Theology 1 technology to research, have no effect after getting Transcendence perk", theology1Options);':'addSettingsSelect(currentNode, "userResearchTheology_1", "神学研究分支1", "神学研究分支1的选择，获得超越特权以后失效", theology1Options);',
    '[{val: "auto", label: "Script Managed", hint: "Picks Deify for Ascension prestige, and Study for others"},':'[{val: "auto", label: "由脚本管理", hint: "进行飞升重置时选择神化先祖，其余情况下选择研究先祖"},',
    'addSettingsSelect(currentNode, "userResearchTheology_2", "Target Theology 2", "Theology 2 technology to research", theology2Options);':'addSettingsSelect(currentNode, "userResearchTheology_2", "神学研究分支2", "神学研究分支2的选择", theology2Options);',
    'addSettingsList(currentNode, "researchIgnore", "Ignored researches", "Listed researches won\'t be purchased without manual input, or user defined trigger. On top of this list script will also ignore some other special techs, such as Limit Collider, Dark Energy Bomb, Exotic Infusion, etc.", techIds);':'addSettingsList(currentNode, "researchIgnore", "忽略的研究", "脚本将不会进行相应的自动研究。部分特殊研究同样不会自动进行，例如限制对撞机，暗能量炸弹和奇异灌输等。", techIds);',
    '>Add<':'>增加<',
    '>Remove<':'>移除<',
    '<input type="text" style="height: 25px; width: 150px; float: right;" placeholder="Research...">':'<input type="text" style="height: 25px; width: 150px; float: right;" placeholder="研究……">',

    # NOTE: 外交事务设置
    'addSettingsHeader1(currentNode, "Foreign Powers");':'addSettingsHeader1(currentNode, "外国势力相关");',
    'addSettingsToggle(currentNode, "foreignPacifist", "Pacifist", "Turns attacks off and on");':'addSettingsToggle(currentNode, "foreignPacifist", "是否为和平主义者", "是否进攻敌国");',
    'addSettingsToggle(currentNode, "foreignUnification", "Perform unification", "Perform unification once all three powers are controlled. autoResearch should be enabled for this to work.");':'addSettingsToggle(currentNode, "foreignUnification", "是否进行统一", "是否在控制了三个敌对国家后进行统一。需要开启自动研究后此项才能生效。");',
    'addSettingsToggle(currentNode, "foreignOccupyLast", "Occupy last foreign power", "Occupy last foreign power once other two are controlled, and unification is researched to speed up unification. Disable if you want annex\\\\purchase achievements.");':'addSettingsToggle(currentNode, "foreignOccupyLast", "是否占领最后一个未占领的国家", "当控制其他两个国家并研究统一后，自动占领最后一个国家。它可以加速统一。除非您是要做统一方式相关的成就，否则不建议关闭此项。");',
    'addSettingsToggle(currentNode, "foreignForceSabotage", "Sabotage foreign power when useful", "Perform sabotage against current target if it\'s useful(power above 50), regardless of required power, and default action defined above");':'addSettingsToggle(currentNode, "foreignForceSabotage", "在有必要的时候对敌对国家进行破坏活动", "在有需要的时候(军事力量大于50)，对当前的目标进行破坏活动。将无视下方选项的相应设置。");',
    'addSettingsToggle(currentNode, "foreignTrainSpy", "Train spies", "Train spies to use against foreign powers");':'addSettingsToggle(currentNode, "foreignTrainSpy", "派遣间谍", "训练间谍用于在外国势力执行任务");',
    'addSettingsNumber(currentNode, "foreignSpyMax", "Maximum spies", "Maximum spies per foreign power");':'addSettingsNumber(currentNode, "foreignSpyMax", "最大间谍数", "每个敌对国家最多训练的间谍数");',
    'addSettingsNumber(currentNode, "foreignPowerRequired", "Military Power to switch target", "Switches to attack next foreign power once its power lowered down to this number. When exact numbers not know script tries to approximate it.");':'addSettingsNumber(currentNode, "foreignPowerRequired", "改变目标至少需要的军事力量", "当一个国家的军事实力低于此数值时，转为攻击它。如果确切数字无法看到，则脚本会尝试进行估计。");',
    '[{val: "Ignore", label: "Ignore", hint: ""},':'[{val: "Ignore", label: "忽略", hint: ""},',
    '{val: "Occupy", label: "Occupy", hint: ""}];':'{val: "Occupy", label: "占领", hint: ""}];',
    'addSettingsSelect(currentNode, "foreignPolicyInferior", "Inferior Power", "Perform this against inferior foreign power, with military power equal or below given threshold. Complex actions includes required preparation - Annex and Purchase will incite and influence, Occupy will sabotage, until said options will be available.", policyOptions);':'addSettingsSelect(currentNode, "foreignPolicyInferior", "对较弱小的国家进行的间谍活动", "对较弱小的国家进行的间谍活动类型，较弱小指军事力量不高于上方数值的国家。复杂的活动将首先进行相应的准备——吞并和收购将先进行煽动和亲善，占领将先进行破坏，直到相应的选项可用为止。", policyOptions);',
    'addSettingsSelect(currentNode, "foreignPolicySuperior", "Superior Power", "Perform this against superior foreign power, with military power above given threshold. Complex actions includes required preparation - Annex and Purchase will incite and influence, Occupy will sabotage, until said options will be available.", policyOptions);':'addSettingsSelect(currentNode, "foreignPolicySuperior", "对较强大的国家进行的间谍活动", "对较强大的国家进行的间谍活动类型，较强大指军事力量高于上方数值的国家。复杂的活动将首先进行相应的准备——吞并和收购将先进行煽动和亲善，占领将先进行破坏，直到相应的选项可用为止。", policyOptions);',
    '{val: "Influence", label: "Alliance", hint: ""},':'{val: "Influence", label: "联盟", hint: ""},',
    '{val: "Sabotage", label: "War", hint: ""}];':'{val: "Sabotage", label: "战斗", hint: ""}];',
    'addSettingsSelect(currentNode, "foreignPolicyRival", "Rival Power (The True Path)", "Perform this against rival foreign power.", rivalOptions);':'addSettingsSelect(currentNode, "foreignPolicyRival", "竞争国家(智械黎明模式)", "对竞争国家进行的间谍活动类型。", rivalOptions);',
    'addSettingsHeader1(currentNode, "Campaigns");':'addSettingsHeader1(currentNode, "战役相关");',
    'addSettingsNumber(currentNode, "foreignAttackLivingSoldiersPercent", "Minimum percentage of alive soldiers for attack", "Only attacks if you ALSO have the target battalion size of healthy soldiers available, so this setting will only take effect if your battalion does not include all of your soldiers");':'addSettingsNumber(currentNode, "foreignAttackLivingSoldiersPercent", "只在士兵生存人数大于此比例时进攻", "下方的未受伤士兵比例也会生效，因此只在未让所有士兵进攻时生效");',
    'addSettingsNumber(currentNode, "foreignAttackHealthySoldiersPercent", "Minimum percentage of healthy soldiers for attack", "Set to less than 100 to take advantage of being able to heal more soldiers in a game day than get wounded in a typical attack");':'addSettingsNumber(currentNode, "foreignAttackHealthySoldiersPercent", "只在未受伤士兵人数大于此比例时进攻", "合理设置为某个低于100的值，可以有效利用游戏内的自然愈合机制");',
    'addSettingsNumber(currentNode, "foreignHireMercMoneyStoragePercent", "Hire mercenary if money storage greater than percent", "Hire a mercenary if remaining money after purchase will be greater than this percent");':'addSettingsNumber(currentNode, "foreignHireMercMoneyStoragePercent", "如果资金存量大于此比例，则聘请雇佣兵", "如果聘请后剩余资金大于此比例，则聘请雇佣兵");',
    'addSettingsNumber(currentNode, "foreignHireMercCostLowerThanIncome", "OR if cost lower than money earned in X seconds", "Combines with the money storage percent setting to determine when to hire mercenaries");':'addSettingsNumber(currentNode, "foreignHireMercCostLowerThanIncome", "或者聘请花费小于此秒数的资金产量，则聘请雇佣兵", "结合剩余资金比例，可以管理聘请雇佣兵的时机");',
    'addSettingsNumber(currentNode, "foreignHireMercDeadSoldiers", "AND amount of dead soldiers above this number", "Hire a mercenary only when current amount of dead soldiers above given number");':'addSettingsNumber(currentNode, "foreignHireMercDeadSoldiers", "并且需要阵亡士兵数量大于此数值，才会聘请雇佣兵", "只在阵亡士兵数量超过此数值时聘请雇佣兵");',
    'addSettingsNumber(currentNode, "foreignMinAdvantage", "Minimum advantage", "Minimum advantage to launch campaign, ignored during ambushes. 100% chance to win will be reached at approximately(influenced by traits and selected campaign) 75% advantage.");':'addSettingsNumber(currentNode, "foreignMinAdvantage", "最低优势", "进行相应战役类型最少需要的优势。进行伏击时忽略此项。大概在75%优势(受特质和战役类型影响)附近可以做到100%胜率。");',
    'addSettingsNumber(currentNode, "foreignMaxAdvantage", "Maximum advantage", "Once campaign is selected, your battalion will be limited in size down to this advantage, reducing potential loses");':'addSettingsNumber(currentNode, "foreignMaxAdvantage", "最高优势", "当选择相应战役类型后，参加战斗的士兵数将限制在尽可能接近此优势的数量，以减少损失");',
    'addSettingsNumber(currentNode, "foreignMaxSiegeBattalion", "Maximum siege battalion", "Maximum battalion for siege campaign. Only try to siege if it\'s possible with up to given amount of soldiers. Siege is expensive, if you\'ll be doing it with too big battalion it might be less profitable than other combat campaigns. This option does not applied to unifying sieges, it affect only looting.");':'addSettingsNumber(currentNode, "foreignMaxSiegeBattalion", "最高围城士兵数", "进行围城的最大士兵数。只在此数值的士兵数量可以进行围城时这么做。围城的损失通常很大，如果需要大量士兵才能进行的话，收益将无法弥补损失。此项不影响统一时的围城士兵数。");',
    '[{val: "never", label: "Never", hint: "No additional limits to battalion size. Always send maximum soldiers allowed with current Max Advantage."},':'[{val: "never", label: "永不", hint: "不限制参加战斗的士兵数。永远尽可能使用最高优势对应的士兵数。"},',
    '{val: "always", label: "Always", hint: "Limit battalions to sizes which will neven suffer any casualties in successful fights. You still will lose soldiers after failures, increasing minimum advantage can improve winning odds. This option designed to use with armored races favoring frequent attacks, with no approppriate build it may prevent any attacks from happening."},':'{val: "always", label: "常时", hint: "将参加战斗的士兵数限制为战斗胜利后不损失任何士兵的数值。战败则仍然可能损失士兵，此时提升最低优势可以增加胜率。此项是供有装甲相关特质的种族优化进攻频率使用，如果设置不当，可能会导致士兵永远不进攻。"},',
    '{val: "auto", label: "Auto", hint: "Tries to maximize total number of attacks, alternating between full and safe attacks based on soldiers condition, to get most from both healing and recruiting."}];':'{val: "auto", label: "自动", hint: "尽可能增加战斗总次数，根据士兵情况，自动在前两个选项之间切换，以优化战斗结果。"}];',
    'addSettingsSelect(currentNode, "foreignProtect", "Protect soldiers", "Configures safety of attacks. This option does not applies to unifying sieges, it affect only looting.", protectOptions);':'addSettingsSelect(currentNode, "foreignProtect", "是否保护士兵", "设置士兵攻击的烈度。此项不影响统一时的围城士兵数。", protectOptions);',

    # NOTE: 地狱维度设置
    'addSettingsHeader1(currentNode, "Entering Hell");':'addSettingsHeader1(currentNode, "进入地狱维度");',
    'addSettingsNumber(currentNode, "hellHomeGarrison", "Soldiers to stay out of hell", "Home garrison maximum");':'addSettingsNumber(currentNode, "hellHomeGarrison", "不进入地狱维度的士兵人数", "驻军上限");',
    'addSettingsNumber(currentNode, "hellMinSoldiers", "Minimum soldiers to be available for hell (pull out if below)", "Don\'t enter hell if not enough soldiers, or get out if already in");':'addSettingsNumber(currentNode, "hellMinSoldiers", "进入地狱维度最少士兵总数(低于此值时撤出)", "如果士兵不足，不进入地狱维度，如果已经进入，则撤出所有士兵");',
    'addSettingsNumber(currentNode, "hellMinSoldiersPercent", "Alive soldier percentage for entering hell", "Don\'t enter hell if too many soldiers are dead, but don\'t get out");':'addSettingsNumber(currentNode, "hellMinSoldiersPercent", "进入地狱维度需拥有生存士兵的比例", "如果阵亡士兵过多，不进入地狱维度，但不会撤出士兵");',
    'addSettingsHeader1(currentNode, "Hell Garrison");':'addSettingsHeader1(currentNode, "地狱维度驻扎士兵");',
    'addSettingsNumber(currentNode, "hellTargetFortressDamage", "Target wall damage per siege (overestimates threat)", "Actual damage will usually be lower due to patrols and drones");':'addSettingsNumber(currentNode, "hellTargetFortressDamage", "围攻后城墙耐久减少为相应数值(尽量高估威胁)", "实际上由于有巡逻队和机器人，耐久不会减少那么多");',
    'addSettingsNumber(currentNode, "hellLowWallsMulti", "Garrison bolster factor for damaged walls", "Multiplies target defense rating by this when close to 0 wall integrity, half as much increase at half integrity");':'addSettingsNumber(currentNode, "hellLowWallsMulti", "受损城墙驻扎士兵增援因子", "当城墙剩余耐久接近0时，将堡垒防御评级增强到乘以此因子的数值，城墙剩余耐久为一半时，增强到乘以此因子一半的数值");',
    'addSettingsHeader1(currentNode, "Patrol Size");':'addSettingsHeader1(currentNode, "巡逻队规模");',
    'addSettingsToggle(currentNode, "hellHandlePatrolSize", "Automatically adjust patrol size", "Sets patrol attack rating based on current threat, lowers it depending on buildings, increases it to the minimum rating, and finally increases it based on dead soldiers. Handling patrol count has to be turned on.");':'addSettingsToggle(currentNode, "hellHandlePatrolSize", "自动调整巡逻队规模", "根据当前恶魔生物数量调整巡逻队规模，建筑作用下将减少之，低于最低战斗评级及士兵阵亡时将增加之。必须开启调整巡逻队数量。");',
    'addSettingsNumber(currentNode, "hellPatrolMinRating", "Minimum patrol attack rating", "Will never go below this");':'addSettingsNumber(currentNode, "hellPatrolMinRating", "单支巡逻队最低战斗评级", "不会低于此数值");',
    'addSettingsNumber(currentNode, "hellPatrolThreatPercent", "Percent of current threat as base patrol rating", "Demon encounters have a rating of 2 to 10 percent of current threat");':'addSettingsNumber(currentNode, "hellPatrolThreatPercent", "恶魔生物基础评级与数量比例", "作为参考，每次激战的恶魔评级为当前恶魔数量的2%至10%");',
    'addSettingsNumber(currentNode, "hellPatrolDroneMod", "&emsp;Lower Rating for each active Predator Drone by", "Predators reduce threat before patrols fight");':'addSettingsNumber(currentNode, "hellPatrolDroneMod", "&emsp;每个掠食者无人机减少恶魔生物评级", "掠食者无人机在巡逻队战斗前就减少恶魔生物数量");',
    'addSettingsNumber(currentNode, "hellPatrolDroidMod", "&emsp;Lower Rating for each active War Droid by", "War Droids boost patrol attack rating by 1 or 2 soldiers depending on tech");':'addSettingsNumber(currentNode, "hellPatrolDroidMod", "&emsp;每个战斗机器人减少恶魔生物评级", "根据研究情况，战斗机器人可以增加1至2名士兵的巡逻队战斗评级");',
    'addSettingsNumber(currentNode, "hellPatrolBootcampMod", "&emsp;Lower Rating for each Bootcamp by", "Bootcamps help regenerate soldiers faster");':'addSettingsNumber(currentNode, "hellPatrolBootcampMod", "&emsp;每个新兵训练营减少恶魔生物评级", "新兵训练营使士兵更快完成训练");',
    'addSettingsNumber(currentNode, "hellBolsterPatrolRating", "Increase patrol rating by up to this when soldiers die", "Larger patrols are less effective, but also have fewer deaths");':'addSettingsNumber(currentNode, "hellBolsterPatrolRating", "士兵阵亡时增加巡逻队战斗评级至此数值", "更大的巡逻队效率更低，但阵亡也更少");',
    'addSettingsNumber(currentNode, "hellBolsterPatrolPercentTop", "&emsp;Start increasing patrol rating at this home garrison fill percent", "This is the higher number");':'addSettingsNumber(currentNode, "hellBolsterPatrolPercentTop", "&emsp;当驻军到达此比例时开始增加巡逻队战斗评级", "较高数值");',
    'addSettingsNumber(currentNode, "hellBolsterPatrolPercentBottom", "&emsp;Full patrol rating increase below this home garrison fill percent", "This is the lower number");':'addSettingsNumber(currentNode, "hellBolsterPatrolPercentBottom", "&emsp;当驻军低于此比例时将巡逻队战斗评级增加到最大", "较低数值");',
    'addSettingsHeader1(currentNode, "Attractors");':'addSettingsHeader1(currentNode, "吸引器信标");',
    'addSettingsNumber(currentNode, "hellAttractorBottomThreat", "&emsp;All Attractors on below this threat", "Turn more and more attractors off when getting nearer to the top threat. Auto Power needs to be on for this to work.");':'addSettingsNumber(currentNode, "hellAttractorBottomThreat", "&emsp;恶魔生物数量低于此数值时开启所有吸引器信标", "越接近最大恶魔数量，关闭越多吸引器信标。需要开启自动供能此项才能生效。");',
    'addSettingsNumber(currentNode, "hellAttractorTopThreat", "&emsp;All Attractors off above this threat", "Turn more and more attractors off when getting nearer to the top threat. Auto Power needs to be on for this to work.");':'addSettingsNumber(currentNode, "hellAttractorTopThreat", "&emsp;恶魔生物数量高于此数值时关闭所有吸引器信标", "越接近最大恶魔数量，关闭越多吸引器信标。需要开启自动供能此项才能生效。");',

    # NOTE: 机甲及尖塔设置
    '[{val: "none", label: "None", hint: "Nothing will be scrapped automatically"},':'[{val: "none", label: "无", hint: "不自动解体机甲"},',
    '{val: "single", label: "Full bay", hint: "Scrap mechs only when mech bay is full, and script need more room to build mechs"},':'{val: "single", label: "机甲满舱", hint: "只在机甲舱满且需要更多机舱空间的时候解体机甲"},',
    '{val: "all", label: "All inefficient", hint: "Scrap all inefficient mechs immediately, using refounded resources to build better ones"},':'{val: "all", label: "所有低效", hint: "解体所有效率低的机甲，并更换为更好的机甲。"},',
    '{val: "mixed", label: "Excess inefficient", hint: "Scrap as much inefficient mechs as possible, trying to preserve just enough of old mechs to fill bay to max by the time when next floor will be reached, calculating threshold based on progress speed and resources incomes"}];':'{val: "mixed", label: "超过低效", hint: "在保留差不多刚好能够到达下一层的机甲前提下，尽可能解体所有低效的机甲"}];',
    'addSettingsSelect(currentNode, "mechScrap", "Scrap mechs", "Configures what will be scrapped. Infernal mechs won\'t ever be scrapped.", scrapOptions);':'addSettingsSelect(currentNode, "mechScrap", "解体机甲", "设置解体机甲的情况。不会解体地狱化的机甲。", scrapOptions);',
    'addSettingsNumber(currentNode, "mechScrapEfficiency", "Scrap efficiency", "Scrap mechs only when \'((OldMechRefund / NewMechCost) / (OldMechDamage / NewMechDamage))\' more than given number.&#xA;For the cases when exchanged mechs have same size(1/3 refund) it means that with 1 eff. script allowed to scrap mechs under 33.3%. 1.5 eff. - under 22.2%, 2 eff. - under 16.6%, 0.5 eff. - under 66.6%, 0 eff. - under 100%, etc.&#xA;Efficiency below \'1\' is not recommended, unless scrap set to \'Full bay\', as it\'s a breakpoint when refunded resources can immidiately compensate lost damage, resulting with best damage growth rate.&#xA;Efficiency above \'1\' is useful to save resources for more desperate times, or to compensate low soul gems income.");':'addSettingsNumber(currentNode, "mechScrapEfficiency", "解体效率", "只在(旧机甲返还资源/新机甲资源花费)/(旧机甲攻击力/新机甲攻击力)超过相应数字时解体机甲。.");',
    'addSettingsNumber(currentNode, "mechCollectorValue", "Collector value", "Collectors can\'t be directly compared with combat mechs, having no firepower. Script will assume that one collector/size is equal to this amount of scout/size. If you feel that script is too reluctant to scrap old collectors - you can decrease this value. Or increase, to make them more persistant. 1 value - 50% collector equial to 50% scout, 0.5 value - 50% collector equial to 25% scout, 2 value - 50% collector equial to 100% scout, etc.");':'addSettingsNumber(currentNode, "mechCollectorValue", "搜集机甲价值", "搜集机甲没有战斗力，所以无法直接与其他机甲进行比较。脚本将以设定的比例来衡量搜集机甲的价值。如果您觉得脚本不太愿意解体旧的搜集机甲，您可以降低此数值，反之也可以提高此数值。设为1的情况下视为与侦察机甲等同战斗力，设为0.5则视为一半，设为2则视为两倍，以此类推。");',
    '[{val: "none", label: "None", hint: "Nothing will be build automatically"},':'[{val: "none", label: "无", hint: "不自动制造机甲"},',
    '{val: "random", label: "Random good", hint: "Build random mech with size chosen below, and best possible efficiency"},':'{val: "random", label: "最佳设计", hint: "制造大小为下方选择的，效率最高的机甲"},',
    '{val: "user", label: "Current design", hint: "Build whatever currently set in Mech Lab"}];':'{val: "user", label: "当前设计", hint: "按照机甲实验室当前的设计来制造机甲"}];',
    'addSettingsSelect(currentNode, "mechBuild", "Build mechs", "Configures what will be build. Infernal mechs won\'t ever be build.", buildOptions);':'addSettingsSelect(currentNode, "mechBuild", "制造机甲", "设置制造机甲的情况。不会制造地狱化的机甲。", buildOptions);',
    '[{val: "auto", label: "Damage Per Size", hint: "Select affordable mech with most damage per size on current floor"},':'[{val: "auto", label: "每空间战斗力", hint: "根据当前层的每空间战斗力，尽可能选择最佳的机甲"},',
    '{val: "gems", label: "Damage Per Gems", hint: "Select affordable mech with most damage per gems on current floor"},':'{val: "gems", label: "每宝石战斗力", hint: "根据当前层的每宝石战斗力，尽可能选择最佳的机甲"},',
    '{val: "supply", label: "Damage Per Supply", hint: "Select affordable mech with most damage per supply on current floor"},':'{val: "supply", label: "每补给战斗力", hint: "根据当前层的每补给战斗力，尽可能选择最佳的机甲"},',
    'addSettingsSelect(currentNode, "mechSize", "Preferred mech size", "Size of random mechs", sizeOptions);':'addSettingsSelect(currentNode, "mechSize", "偏好的机甲尺寸", "最佳设计的机甲尺寸", sizeOptions);',
    'addSettingsSelect(currentNode, "mechSizeGravity", "Gravity mech size", "Override preferred size with this on floors with high gravity", sizeOptions);':'addSettingsSelect(currentNode, "mechSizeGravity", "重力环境下的机甲尺寸", "重力环境下自动制造的机甲尺寸", sizeOptions);',
    '[{val: "always", label: "Always", hint: "Add special equipment to all mechs"},':'[{val: "always", label: "常时", hint: "所有机甲都使用特殊装备"},',
    '{val: "prefered", label: "Preferred", hint: "Add special equipment when it doesn\'t reduce efficiency for current floor"},':'{val: "prefered", label: "偏好", hint: "当特殊装备不降低当前层效率时使用特殊装备"},',
    '{val: "random", label: "Random", hint: "Special equipment will have same chance to be added as all others"},':'{val: "random", label: "随机", hint: "所有特殊装备都可能使用"},',
    '{val: "never", label: "Never", hint: "Never add special equipment"}];':'{val: "never", label: "永不", hint: "永不使用特殊装备"}];',
    'addSettingsSelect(currentNode, "mechSpecial", "Special mechs", "Configures special equip", specialOptions);':'addSettingsSelect(currentNode, "mechSpecial", "特殊装备", "设置特殊装备", specialOptions);',
    'addSettingsNumber(currentNode, "mechWaygatePotential", "Maximum mech potential for Waygate", "Fight Demon Lord only when current mech team potential below given amount. Full bay of best mechs will have `1` potential. Damage against Demon Lord does not affected by floor modifiers, all mechs always does 100% damage to him. Thus it\'s most time-efficient to fight him at times when mechs can\'t make good progress against regular monsters, and waiting for rebuilding. Auto Power needs to be on for this to work.");':'addSettingsNumber(currentNode, "mechWaygatePotential", "进入地狱之门的机甲潜力阈值", "只在机甲潜力低于相应数值时与恶魔领主进行战斗。机甲舱充满最好设计的机甲时潜力为1。恶魔领主的强度不受楼层和武器装备影响，所以在普通敌人需要时间太久时转为攻击恶魔领主会更有效率。需要开启自动供能此项才能生效。");',
    'addSettingsNumber(currentNode, "mechMinSupply", "Minimum supply income", "Build collectors if current supply income below given number");':'addSettingsNumber(currentNode, "mechMinSupply", "最低补给收入", "如果当前补给收入低于相应数字，则开始建造搜集机甲");',
    'addSettingsNumber(currentNode, "mechMaxCollectors", "Maximum collectors ratio", "Limiter for above option, maximum space used by collectors");':'addSettingsNumber(currentNode, "mechMaxCollectors", "搜集机甲最高比例", "限制上方选项的搜集机甲数量。");',
    'addSettingsNumber(currentNode, "mechSaveSupplyRatio", "Save up supplies for next floor", "Ratio of supplies to save up for next floor. Script will stop spending supplies on new mechs when it estimates that by the time when floor will be cleared you\'ll be under this supply ratio. That allows build bunch of new mechs suited for next enemy right after entering new floor. With 1 value script will try to start new floors with full supplies, 0.5 - with half, 0 - any, effectively disabling this option, etc.");':'addSettingsNumber(currentNode, "mechSaveSupplyRatio", "为下一层提前积攒补给的比例", "为下一层保留的补给比例。脚本将估计您在这一层剩余的时间，如果通过这一层时补给会低于这个比例，则将开始保留补给。这样您就可以在进入新一层时立刻建造最佳的机甲了。设为1则将以满补给进入下一层，设为0.5则将以一半补给进入下一层，设为0则将无视此项，以此类推。");',
    'addSettingsNumber(currentNode, "mechScouts", "Minimum scouts ratio", "Scouts compensate terrain penalty of suboptimal mechs. Build them up to this ratio.");':'addSettingsNumber(currentNode, "mechScouts", "侦察机甲最低比例", "侦察机甲可以抵消楼层生态对机甲的惩罚。以此比例建造它们。");',
    'addSettingsToggle(currentNode, "mechInfernalCollector", "Build infernal collectors", "Infernal collectors have incresed supply cost, and payback time, but becomes more profitable after ~30 minutes of uptime.");':'addSettingsToggle(currentNode, "mechInfernalCollector", "是否建造地狱化搜集机甲", "地狱化搜集机甲需要花费更多补给，但收益也更高，如果建造完以后可以持续30分钟左右运行，则净收益将超过普通搜集机甲。");',
    'addSettingsToggle(currentNode, "mechScoutsRebuild", "Rebuild scouts", "Scouts provides full bonus to other mechs even being infficient, this option prevent rebuilding them saving resources.");':'addSettingsToggle(currentNode, "mechScoutsRebuild", "是否重新建造侦察机甲", "侦察机甲即使在效率下降时，对其他机甲的加成也不会受到影响，此项可以阻止脚本重新建造侦察机甲，以节省资源。");',
    'addSettingsToggle(currentNode, "mechFillBay", "Build smaller mechs when preferred not available", "Build smaller mechs when preferred size can\'t be used due to low remaining bay space, or supplies cap");':'addSettingsToggle(currentNode, "mechFillBay", "当无法再建造偏好机甲时建造尺寸更小的机甲", "当机舱空间不足或补给上限不足，无法制造偏好尺寸的机甲时，制造尺寸更小的机甲");',
    'addSettingsToggle(currentNode, "buildingMechsFirst", "Build spire buildings only with full bay", "Fill mech bays up to current limit before spending resources on additional spire buildings");':'addSettingsToggle(currentNode, "buildingMechsFirst", "是否在建造尖塔建筑之前先填满剩余的机舱空间", "在花费资源建造尖塔建筑之前，先建造机甲填满剩余的机舱空间");',
    'addSettingsToggle(currentNode, "mechBaysFirst", "Scrap mechs only after building maximum bays", "Scrap old mechs only when no new bays and purifiers can be builded");':'addSettingsToggle(currentNode, "mechBaysFirst", "是否在解体机甲之前先最大化建造机甲舱", "只在无法建造机甲舱和空气净化器时解体机甲");',
    'addStandardHeading(currentNode, "Mech Stats");':'addStandardHeading(currentNode, "机甲属性计算");',
    '<label class="switch" title="This switch have no ingame effect, and used to configure calculator below">':'<label class="switch" title="用于下方计算">',
    '<label class="switch" title="This input have no ingame effect, and used to configure calculator below">':'<label class="switch" title="用于下方计算">',
    '<span class="check"></span><span style="margin-left: 10px;">${option}</span>':'<span class="check"></span><span style="margin-left: 10px;">${{Compact: "小型化", Efficient: "补给中", Special: "特殊", Gravity: "重力"}[option]}</span>',
    '>Scouts<':'>侦察机甲<',
    'let rows = [[""], ["Damage Per Size"], ["Damage Per Supply (New)"], ["Damage Per Gems (New)"], ["Damage Per Supply (Rebuild)"], ["Damage Per Gems (Rebuild)"]];':'let rows = [[""], ["每空间战斗力"], ["每补给战斗力(新)"], ["每宝石战斗力(新)"], ["每补给战斗力(重新制造)"], ["每宝石战斗力(重新制造)"]];',

    # NOTE: 舰队设置
    'addStandardHeading(currentNode, "Andromeda");':'addStandardHeading(currentNode, "仙女座星云");',
    'addSettingsToggle(currentNode, "fleetMaxCover", "Maximize protection of prioritized systems", "Adjusts ships distribution to fully supress piracy in prioritized regions. Some potential defence will be wasted, as it will use big ships to cover small holes, when it doesn\'t have anything fitting better. This option is not required: all your dreadnoughts still will be used even without this option.");':'addSettingsToggle(currentNode, "fleetMaxCover", "优先级高的地区尽可能最大化保护", "会优先分配舰船给优先级高的地区以完全压制相应地区的海盗活动。可能会在大船较多小船较少时浪费舰船。即使不开启此项，无畏舰仍然会正常进行分配。");',
    'addSettingsNumber(currentNode, "fleetEmbassyKnowledge", "Mininum knowledge for Embassy", "Building Embassy increases maximum piracy up to 100, script won\'t Auto Build it until this knowledge cap is reached.");':'addSettingsNumber(currentNode, "fleetEmbassyKnowledge", "建造大使馆的知识阈值", "建造大使馆后，海盗的活动会更加剧烈，因此脚本只会在到达相应数值的知识上限时进行建造。");',
    'addSettingsNumber(currentNode, "fleetAlienGiftKnowledge", "Mininum knowledge for Alien Gift", "Researching Alien Gift increases maximum piracy up to 250, script won\'t Auto Research it until this knowledge cap is reached.");':'addSettingsNumber(currentNode, "fleetAlienGiftKnowledge", "研究外星礼物的知识阈值", "研究外星礼物后，海盗的活动会更加剧烈，因此脚本只会在到达相应数值的知识上限时进行研究。");',
    'addSettingsNumber(currentNode, "fleetAlien2Knowledge", "Mininum knowledge for Alien 2 Assault", "Assaulting Alien 2 increases maximum piracy up to 500, script won\'t do it until this knowledge cap is reached. Regardless of set value it won\'t ever try to assault until you have big enough fleet to do it without loses.");':'addSettingsNumber(currentNode, "fleetAlien2Knowledge", "进行第五星系任务的知识阈值", "进行第五星系任务后，海盗的活动会更加剧烈，因此脚本只会在到达相应数值的知识上限时进行研究。另外，除非您能够无损伤地完成任务，否则脚本也不会自动进行此任务。");',
    '[{val: "ignore", label: "Manual assault", hint: "Won\'t ever launch assault mission on Chthonian"},':'[{val: "ignore", label: "不自动进行", hint: "不会自动进行幽冥星系任务"},',
    '{val: "high", label: "High casualties", hint: "Unlock Chthonian using mixed fleet, high casualties (1250+ total fleet power, 500 will be lost)"},':'{val: "high", label: "严重损失", hint: "使用混合舰队进行幽冥星系任务，损失极大(1250以上总战力，损失500左右战力的舰队)"},',
    '{val: "avg", label: "Average casualties", hint: "Unlock Chthonian using mixed fleet, average casualties (2500+ total fleet power, 160 will be lost)"},':'{val: "avg", label: "一般损失", hint: "使用混合舰队进行幽冥星系任务，损失一般(2500以上总战力，损失160左右战力的舰队)"},',
    '{val: "low", label: "Low casualties", hint: "Unlock Chthonian using mixed fleet, low casualties (4500+ total fleet power, 80 will be lost)"},':'{val: "low", label: "低损失", hint: "使用混合舰队进行幽冥星系任务，损失低(4500以上总战力，损失80左右战力的舰队)"},',
    '{val: "frigate", label: "Frigate", hint: "Unlock Chthonian loosing Frigate ship(s) (4500+ total fleet power, suboptimal for banana\\\\instinct runs)"},':'{val: "frigate", label: "损失大型护卫舰", hint: "只损失大型护卫舰进行幽冥星系任务(4500以上总战力，对于香蕉共和国挑战或直觉特质的种族更好一些)"},',
    '{val: "dread", label: "Dreadnought", hint: "Unlock Chthonian with Dreadnought suicide mission"}];':'{val: "dread", label: "损失无畏舰", hint: "看着无畏舰燃烧吧"}];',
    'addSettingsSelect(currentNode, "fleetChthonianLoses", "Chthonian Mission", "Assault Chthonian when chosen outcome is achievable. Mixed fleet formed to clear mission with minimum possible wasted ships, e.g. for low causlities it can sacriface 8 scouts, or 2 corvettes and 2 scouts, or frigate, and such. Whatever will be first available. It also takes in account perks and challenges, adjusting fleet accordingly.", assaultOptions);':'addSettingsSelect(currentNode, "fleetChthonianLoses", "幽冥星系任务条件", "当满足任务条件时自动进行幽冥星系任务。会尽可能少损失舰队，同时会考虑特权和挑战来调整舰队。", assaultOptions);',
    '>Region<':'>地区<',
    'galaxyRegions[i] === "gxy_alien1" ? "Alien 1 System"':'galaxyRegions[i] === "gxy_alien1" ? "第四星系"',
    'galaxyRegions[i] === "gxy_alien2" ? "Alien 2 System"':'galaxyRegions[i] === "gxy_alien2" ? "第五星系"',
    'addStandardHeading(currentNode, "Outer Solar");':'addStandardHeading(currentNode, "太阳系外围");',
    'addSettingsNumber(currentNode, "fleetOuterCrew", "Minimum idle soldiers", "Only build ships when amount of idle soldiers, excluding wounded ones, above give number.");':'addSettingsNumber(currentNode, "fleetOuterCrew", "空闲士兵下限", "只在空闲士兵数量(不包括伤兵)大于此数值时建造舰船。");',
    'addSettingsNumber(currentNode, "fleetOuterMinSyndicate", "Minimum syndicate", "Send ships only to regions with syndicate activity above given level.");':'addSettingsNumber(currentNode, "fleetOuterMinSyndicate", "辛迪加战力下限", "只对辛迪加战力超过相应数值的区域派遣舰船。");',
    '[{val: "none", label: "None", hint: "Ship buildign disabled"},':'[{val: "none", label: "无", hint: "不建造舰船"},',
    '{val: "user", label: "Current design", hint: "Build whatever currently set in Ship Yard"},':'{val: "user", label: "当前设计", hint: "按照船坞当前的设计来建造舰船"},',
    '{val: "custom", label: "Preset", hint: "Build ships with components configured below. All components need to be unlocked, and resulting design should have enough power"}];':'{val: "custom", label: "预设", hint: "按照下方的组件配置来建造舰船。所有的组件必须都解锁了，而且最终设计的动力必须足够"}];',
    'addSettingsSelect(currentNode, "fleetOuterShips", "Ships to build", "Once avalable and affordable script will build ship of selected design, and send it to region with most piracy * weighting", shipOptions);':'addSettingsSelect(currentNode, "fleetOuterShips", "舰船建造类型", "当舰船可以建造时，脚本将按照选项建造舰船，并派往 敌人战力*权重 最高的地区", shipOptions);',

    # NOTE: 质量喷射设置
    # NOTE: 市场设置
    # NOTE: 存储设置
    # NOTE: 魔法设置
    # NOTE: 生产设置
    # NOTE: 工作设置
    # NOTE: 建筑设置
    # NOTE: 自动建筑权重设置
    # NOTE: ARPA设置
    # NOTE: 日志设置
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',

     # NOTE: 资源
    'Population: new Population("Population", "Population")':'Population: new Population("人口", "Population")',
    'Antiplasmid: new AntiPlasmid("Anti-Plasmid", "Antiplasmid")':'Antiplasmid: new AntiPlasmid("反质粒", "Antiplasmid")',
    'Power: new Power("Power", "Power")':'Power: new Power("电力", "Power")',
    'StarPower: new StarPower("Star Power", "StarPower")':'StarPower: new StarPower("星", "StarPower")',
    'Morale: new Morale("Morale", "Morale")':'Morale: new Morale("士气", "Morale")',
    '"Moon Support"':'"月球支持"',
    '"Red Support"':'"红色行星支持"',
    '"Sun Support"':'"蜂群支持"',
    '"Belt Support"':'"小行星带支持"',
    '"Titan Support"':'"最大卫星支持"',
    '"Electrolysis Plant"':'"电解工厂"',
    '"Enceladus Support"':'"第六大卫星支持"',
    '"Eris Support"':'"矮行星支持"',
    '"Alpha Support"':'"半人马座α星系支持"',
    '"Nebula Support"':'"螺旋星云支持"',
    '"Gateway Support"':'"星门支持"',
    '"Alien Support"':'"第五星系支持"',
    '"Lake Support"':'"湖泊支持"',
    '"Spire Support"':'"尖塔支持"',


    # NOTE: 硬编码汉化部分
    '() => "Locked",':'() => "未解锁",',
    '() => "Queued building, processing...",':'() => "处理建筑队列……",',
    '() => "Active trigger, processing...",':'() => "处理触发器……",',
    '() => "AutoBuild disabled",':'() => "自动建筑已关闭",',
    '() => "Maximum amount reached",':'() => "已达建造上限",',
    '(chance) => `${Math.round(chance*100)}% chance of successful launch`,':'(chance) => `发射成功率为 ${Math.round(chance*100)}%`,',
    '() => "Miners disabled in Andromeda",':'() => "到达仙女座星云后禁用矿工",',
    '() => "Piracy fully supressed",':'() => "海盗活动已肃清",',
    'return "Building mechs...";':'return "正在建造机甲……";',
    'return "Saving supplies for new mech";':'return "为下一层建造机甲而保留补给";',
    '() => "Too low gate supression",':'() => "安全指数不足",',
    '() => "Saving up Soul Gems for prestige",':'() => "为重置而保留灵魂宝石",',
    '(other) => `${other.title} gives more Supplies`,':'(other) => `${other.title}可以提供更多补给`,',
    '(other) => `${other.title} gives more Max Supplies`,':'(other) => `${other.title}可以提供更多补给上限`,',
    '() => `${getNumberString(settings.fleetEmbassyKnowledge)} Max Knowledge required`,':'() => `知识上限需要到达 ${getNumberString(settings.fleetEmbassyKnowledge)}`,',
    '() => "Wrong shrine",':'() => "圣地月相不符",',
    'return "Slave pens already full";':'return "奴隶围栏已满";',
    'return "Buying slaves only with excess money";':'return "只使用多余的资金购买奴隶";',
    'return "Too low population";':'return "市民太少";',
    'return "Sacrifices performed only with full population";':'return "只在市民达到上限时献祭市民";',
    'return "Parasites sacrificed only during windy weather";':'return "拥有寄生虫特质的种族只在有风时献祭";',
    'return "No default workers to sacrifice";':'return "默认工作没有可献祭的市民";',
    'return "Sacrifice bonus already high enough";':'return "献祭加成已经足够高了";',
    '(resource) => `Missing ${resource.name} to operate`,':'(resource) => `缺少${resource.title}，无法运作`,',
    '(support) => `Missing ${support.name} to operate`,':'(support) => `缺少${support.name}，无法运作`,',
    '(support) => `Provided ${support.name} not currently needed`,':'(support) => `暂时不需要提供${support.name}`,',
    '() => "Still have some non operating buildings",':'() => "存在未供能的建筑",',
    '() => "Not needed for current prestige",':'() => "当前重置类型不需要建造",',
    '() => "Not needed for Bioseed prestige",':'() => "播种重置不需要建造",',
    '() => "Not needed for Whitehole prestige",':'() => "黑洞重置不需要建造",',
    '() => "Not needed for Vacuum Collapse prestige",':'() => "真空坍缩不需要建造",',
    '() => "Not needed for Ascension prestige",':'() => "飞升重置不需要建造",',
    '() => "Awaiting MAD prestige",':'() => "等待核爆重置",',
    '() => "New building",':'() => "新解锁建筑",',
    '() => "Need more energy",':'() => "需要更多电力",',
    '() => "No need for more energy",':'() => "无需更多电力",',
    '() => "Not enough energy",':'() => "电力不足",',
    '() => "No need for more knowledge",':'() => "无需更多知识上限",',
    '() => "Need more knowledge",':'() => "需要更多知识上限",',
    '() => "Still have some unused ejectors",':'() => "存在未供能的喷射器",',
    '() => "Still have some unused storage",':'() => "存在未使用的箱子",',
    '() => "Need more fuel",':'() => "需要更多燃料",',
    '() => "No more Horseshoes needed",':'() => "无需更多马蹄铁",',
    '() => "No more Meditation Space needed",':'() => "无需更多禅冥想空间",',
    '() => "Gate demons fully supressed",':'() => "恶魔活动已肃清",',
    '() => "Need more storage",':'() => "需要构建更多箱子",',
    '() => "No more houses needed",':'() => "无需更多住房",',
    'GameLog.logSuccess("special", `Revolution! Government changed to ${game.loc("govern_" + government)}.`, [\'events\', \'major_events\']);':' GameLog.logSuccess("special", `发生革命！社会体制切换为 ${game.loc("govern_" + government)} 。`, [\'events\', \'major_events\']);',
    'GameLog.logSuccess("spying", `Performing "${game.loc("civics_spy_" + espionageToPerform)}" covert operation against ${getGovName(govIndex)}.`, [\'spy\']);':'GameLog.logSuccess("spying", `对${getGovName(govIndex)}进行"${game.loc("civics_spy_" + espionageToPerform)}"隐秘行动。`, [\'spy\']);',
    'GameLog.logSuccess("mech_build", `${this.mechDesc(mech)} mech has been assembled.`, [\'hell\']);':'GameLog.logSuccess("mech_build", `${this.mechDesc(mech)} 机甲已建造。`, [\'hell\']);',
    'building.extraDescription = "AutoBuild weighting: " + getNiceNumber(building.weighting) + "<br>" + building.extraDescription;':'building.extraDescription = "自动建造权重：" + getNiceNumber(building.weighting) + "<br>" + building.extraDescription;',
    'project.extraDescription = "Locked<br>";':'project.extraDescription = "未解锁<br>";',
    'project.extraDescription = "AutoBuild disabled<br>";':'project.extraDescription = "未启用自动建造<br>";',
    'project.extraDescription = "Maximum amount reached<br>";':'project.extraDescription = "已达建造上限<br>";',
    'project.extraDescription = "Projects ignored PreMAD<br>";':'project.extraDescription = "核爆重置阶段之前忽略项目<br>";',
    'project.extraDescription = "Queued project, processing...<br>";':'project.extraDescription = "处理建筑队列中的项目……<br>";',
    'project.extraDescription = "Active trigger, processing...<br>";':'project.extraDescription = "处理触发器中的项目……<br>";',
    'project.extraDescription = `AutoARPA weighting: ${getNiceNumber(project.weighting)} (${project.currentStep}%)<br>${project.extraDescription}`;':'project.extraDescription = `自动ARPA权重：${getNiceNumber(project.weighting)} (${project.currentStep}%)<br>${project.extraDescription}`;',
    'GameLog.logSuccess("special", `Attempting evolution of ${state.evolutionTarget.name}.`, [\'progress\']);':'GameLog.logSuccess("special", `尝试进化为${state.evolutionTarget.name}。`, [\'progress\']);',
    'GameLog.logSuccess("mercenary", `Hired a mercenary to join the garrison.`, [\'combat\']);':'GameLog.logSuccess("mercenary", `雇佣了 1 名雇佣兵。`, [\'combat\']);',
    'GameLog.logSuccess("mercenary", `Hired ${mercenariesHired} mercenaries to join the garrison.`, [\'combat\']);':'GameLog.logSuccess("mercenary", `雇佣了 ${mercenariesHired} 名雇佣兵。`, [\'combat\']);',
    'GameLog.logSuccess("spying", `Training a spy to send against ${getGovName(foreign.id)}.`, [\'spy\']);':'GameLog.logSuccess("spying", `针对${getGovName(foreign.id)}训练一名间谍。`, [\'spy\']);',
    'GameLog.logSuccess("attack", `Launching ${campaignTitle} campaign against ${getGovName(currentTarget.id)} with ${currentTarget.gov.spy < 1 ? "~" : ""}${advantagePercent}% advantage.`, [\'combat\']);':'GameLog.logSuccess("attack", `对${getGovName(currentTarget.id)}发动${campaignTitle}战役，拥有${currentTarget.gov.spy < 1 ? "约" : ""}${advantagePercent}%优势。`, [\'combat\']);',
    'building.extraDescription += `Conflicts with ${conflict.obj.name} for ${conflict.res.name} (${conflict.obj.cause})<br>`;':'building.extraDescription += `与${conflict.obj.name}因${conflict.res.title}而冲突 (${conflict.obj.cause})<br>`;',
    'building.extraDescription += `Conflicts with ${other.title} for ${resource.name}<br>`;':'building.extraDescription += `与${other.title}因${resource.title}而冲突<br>`;',
    'return "Ignored research";':'return "研究已忽略";',
    'return "Saving up Soul Gems for prestige";':'return "为重置而保留灵魂宝石";',
    'return "Reset research";':'return "不触发重置";',
    'return "Dark Bomb disabled";':'return "不使用暗能量炸弹";',
    'return "Not needed for current prestige";':'return "当前重置类型不需要建造";',
    'return `${getNumberString(settings.fleetAlienGiftKnowledge)} Max Knowledge required`;':'return `知识上限需要到达 ${getNumberString(settings.fleetAlienGiftKnowledge)}`;',
    'return "Unification disabled";':'return "不进行统一";',
    'return "Blackhole stabilization disabled";':'return "不稳定黑洞";',
    'return "Disabled during whilehole reset";':'return "黑洞重置时不稳定黑洞";',
    'return "Undesirable theology path";':'return "不是想要的神学研究分支";',
    'building.extraDescription = `Missing ${Math.ceil(building.powered - availablePower)} MW to power on<br>${building.extraDescription}`;':'building.extraDescription = `缺少${Math.ceil(building.powered - availablePower)}MW电力，无法启用<br>${building.extraDescription}`;',
    'buildings.SpirePurifier.extraDescription = `Supported Supplies: ${Math.floor(bestSupplies)}<br>${buildings.SpirePurifier.extraDescription}`;':'buildings.SpirePurifier.extraDescription = `提供补给：${Math.floor(bestSupplies)}<br>${buildings.SpirePurifier.extraDescription}`;',
    'GameLog.logSuccess("outer_fleet", `${name} mech has been assembled, and dispatched to ${targetName}.`, [\'combat\']);':'GameLog.logSuccess("outer_fleet", `${name}已建造，并派往${targetName}。`, [\'combat\']);',
    'GameLog.logSuccess("mech_scrap", `${trashMechs.length} mechs (~${Math.round(rating * 100)}%) has been scrapped.`, [\'hell\']);':'GameLog.logSuccess("mech_scrap", `${trashMechs.length}机甲(~${Math.round(rating * 100)}%)已解体。`, [\'hell\']);',
    'GameLog.logSuccess("mech_scrap", `${m.mechDesc(trashMechs[0])} mech has been scrapped.`, [\'hell\']);':'GameLog.logSuccess("mech_scrap", `${m.mechDesc(trashMechs[0])}机甲已解体。`, [\'hell\']);',
    'notes.push(`Next level will increase total consumption by ${getCitadelConsumption(obj.stateOnCount+1) - getCitadelConsumption(obj.stateOnCount)} MW`);':'notes.push(`下次建造将多耗电 ${getCitadelConsumption(obj.stateOnCount+1) - getCitadelConsumption(obj.stateOnCount)} MW`);',
    'notes.push(`Current team potential: ${getNiceNumber(MechManager.mechsPotential)}`);':'notes.push(`当前机甲潜力：${getNiceNumber(MechManager.mechsPotential)}`);',
    'notes.push(`Supplies collected: ${getNiceNumber(supplyCollected)} /s`);':'notes.push(`补给获取：${getNiceNumber(supplyCollected)}/s`);',
    'notes.push(`Conflicts with ${conflict.obj.name} for ${conflict.res.name} (${conflict.obj.cause})`);':'notes.push(`与${conflict.obj.name}因${conflict.res.title}而冲突 (${conflict.obj.cause})`);',
    'notes.push("Queued research, processing...");':'notes.push("处理研究队列……");',
    'notes.push("Active trigger, processing...");':'notes.push("处理触发器中的研究……");',
    'notes.push(`Next level will increase ${buildings.AlphaExchange.title} storage by +${getNiceNumber(total)}% (+${getNiceNumber(crew)}% per crew)`);':'notes.push(`下次建造将使${buildings.AlphaExchange.title}的储量上限 +${getNiceNumber(total)}% (每名船员 +${getNiceNumber(crew)}%)`);',
    'notes.push(`Next level will increase ${buildings.AlphaExchange.title} storage by +${getNiceNumber(total)}% (+${getNiceNumber(crew)}% per crew)`);':'notes.push(`下次建造将使${buildings.AlphaExchange.title}的储量上限 +${getNiceNumber(total)}% (每名船员 +${getNiceNumber(crew)}%)`);',
    'notes.push(`~${getNiceNumber(heal)} seconds to heal soldier`);':'notes.push(`约需要 ${getNiceNumber(heal)} 秒才能治愈一名伤兵`);',
    'notes.push(`~${getNiceNumber(growth)} seconds to increase population`);':'notes.push(`约需要 ${getNiceNumber(growth)} 秒才能新增一位市民`);',
    'notes.push(`Up to ~${getNiceNumber(wreck)} seconds to break car (with full supression)`);':'notes.push(`约 ${getNiceNumber(wreck)} 秒后有一辆勘探车损坏（假设已经完全压制）`);',
    'notes.push(`${getNiceNumber(wallRepair)} seconds to repair 1% of wall`);':'notes.push(`约需要 ${getNiceNumber(wallRepair)} 秒修复1%城墙耐久`);',
    'notes.push(`${getNiceNumber(carRepair)} seconds to repair car`);':'notes.push(`约需要 ${getNiceNumber(carRepair)} 秒修复一辆勘探车`);',
    'notes.push(`~${getNiceNumber(drop)}% chance to find ${resources.Soul_Gem.title} in encounter (Pity ignored)`);':'notes.push(`约 ${getNiceNumber(drop)}% 概率在遭遇恶魔时获得${resources.Soul_Gem.title}（忽略保底）`);',
    'notes.push(`Up to ~${getNiceNumber(influx*10)}-${getNiceNumber(influx*50)} demons spawned per day`);':'notes.push(`每日约刷新 ${getNiceNumber(influx*10)}-${getNiceNumber(influx*50)} 名恶魔`);',
    'notes.push(`${getNiceNumber(spoilage)}% of stored ${resources.Food.title} spoiled per second`);':'notes.push(`每秒消耗 ${getNiceNumber(spoilage)}% 的${resources.Food.title}储量`);',
    'importExportNode.append(\' <button id="script_settingsImport" class="button">Import Script Settings</button>\');':'importExportNode.append(\' <button id="script_settingsImport" class="button">导入脚本设置</button>\');',
    'importExportNode.append(\' <button id="script_settingsExport" class="button">Export Script Settings</button>\');':'importExportNode.append(\' <button id="script_settingsExport" class="button">导出脚本设置</button>\');',
    'confirmationText = "MAD has already been researched. You may prestige immediately. Are you sure you want to toggle this prestige?";':'confirmationText = "相互毁灭已研究。选择此项后可能会立刻进行核爆重置。您确定要这么做吗？";',
    'confirmationText = "Required probes are built, and bioseeder ship is ready to launch. You may prestige immediately. Are you sure you want to toggle this prestige?";':'confirmationText = "生命播种飞船已经就绪，选择此项后可能会立刻进行播种重置。您确定要这么做吗？";',
    'confirmationText = "Dial It To 11 is unlocked. You may prestige immediately. Are you sure you want to toggle this prestige?";':'confirmationText = "把刻度盘拨到11已经就绪，选择此项后可能会立刻进行大灾变重置。您确定要这么做吗？";',
    'confirmationText = "Required mass is reached, and exotic infusion is unlocked. You may prestige immediately. Are you sure you want to toggle this prestige?";':'confirmationText = "奇异灌输已经可以研究了，选择此项后可能会立刻进行黑洞重置。您确定要这么做吗？";',
    'confirmationText = "Protocol 66 is unlocked. You may prestige immediately. Are you sure you want to toggle this prestige?";':'confirmationText = "《第66号技术协议》已经可以研究了，选择此项后可能会立刻进行人工智能觉醒。您确定要这么做吗？";',
    'confirmationText = "Ascension machine is built and powered. Custom race won\'t be changed. You may prestige immediately. Are you sure you want to toggle this prestige?";':'confirmationText = "飞升装置已经建造并供能，不会对自建种族进行任何操作。选择此项后可能会立刻进行飞升重置。您确定要这么做吗？";',
    'confirmationText = "Required floor is reached, and demon lord is already dead. You may prestige immediately. Are you sure you want to toggle this prestige?";':'confirmationText = "已经到达了设定的楼层，且已击杀恶魔领主，选择此项后可能会立刻进行恶魔灌注。您确定要这么做吗？";',
    'label += ` (${gameName})`;':'label = `${gameName}`;  //label += ` (${gameName})`;',
    '<div><input id="script_buildingSearch" class="script-searchsettings" type="text" placeholder="Search for buildings..."></div>':'<div><input id="script_buildingSearch" class="script-searchsettings" type="text" placeholder="搜索建筑……"></div>',
    'let statsString = `<div class="cstat"><span class="has-text-success">Previous Game</span></div>`;':'let statsString = `<div class="cstat"><span class="has-text-success">上周目数据</span></div>`;',
    '$("#market .market-item[id] .buy span").text("B");':'$("#market .market-item[id] .buy span").text("买");',
    '$("#market .market-item[id] .sell span").text("S");':'$("#market .market-item[id] .sell span").text("卖");',
    '$("#market .market-item[id] .trade > :first-child").text("R");':'$("#market .market-item[id] .trade > :first-child").text("线");',
    '<span class="has-text-success" style="width: 2.75rem; margin-right: 0.3em; display: inline-block; text-align: center;">Buy</span>':'<span class="has-text-success" style="width: 2.75rem; margin-right: 0.3em; display: inline-block; text-align: center;">买</span>',
    '<span class="has-text-danger" style="width: 2.75rem; margin-right: 0.3em; display: inline-block; text-align: center;">Sell</span>':'<span class="has-text-danger" style="width: 2.75rem; margin-right: 0.3em; display: inline-block; text-align: center;">卖</span>',
    '<span class="has-text-warning" style="width: 2.75rem; margin-right: 0.3em; display: inline-block; text-align: center;">In</span>':'<span class="has-text-warning" style="width: 2.75rem; margin-right: 0.3em; display: inline-block; text-align: center;">线买</span>',
    '<span class="has-text-warning" style="width: 2.75rem; display: inline-block; text-align: center;">Away</span>':'<span class="has-text-warning" style="width: 2.75rem; display: inline-block; text-align: center;">线卖</span>',
    '<span class="has-text-warning" style="width: 2.75rem; margin-right: 0.3em; display: inline-block; text-align: center;">Auto</span>':'<span class="has-text-warning" style="width: 2.75rem; margin-right: 0.3em; display: inline-block; text-align: center;">自动</span>',
    '<span class="has-text-warning" style="width: 2.75rem; display: inline-block; text-align: center;">Over</span>':'<span class="has-text-warning" style="width: 2.75rem; display: inline-block; text-align: center;">溢出</span>',
    'state.conflictTargets.push({name: obj.title, cause: "Queue", cost: obj.cost});':'state.conflictTargets.push({name: obj.title, cause: "队列", cost: obj.cost});',
    'state.conflictTargets.push({name: techIds["tech-unification"].title, cause: "Purchase", cost: {Money: SpyManager.purchaseMoney}});':'state.conflictTargets.push({name: techIds["tech-unification"].title, cause: "收购", cost: {Money: SpyManager.purchaseMoney}});',
    'state.conflictTargets.push({name: game.global.space.shipyard.blueprint.name ?? "Unnamed ship", cause: "Ship", cost: FleetManagerOuter.nextShipCost});':'state.conflictTargets.push({name: game.global.space.shipyard.blueprint.name ?? "无名舰船", cause: "舰船", cost: FleetManagerOuter.nextShipCost});',
    'state.conflictTargets.push({name: obj.title, cause: "Fleet", cost: obj.cost});':'state.conflictTargets.push({name: obj.title, cause: "战舰", cost: obj.cost});',
    'state.conflictTargets.push({name: obj.title, cause: "Trigger", cost: obj.cost});':'state.conflictTargets.push({name: obj.title, cause: "触发器", cost: obj.cost});',

     # NOTE: 将翻译代码注入脚本
    """'use strict';""":"""'use strict';
    var translateFinish = false;""",
    """// Make sure we have jQuery UI even if script was injected without *monkey""":"""
        if(!translateFinish)
        {
            //建筑翻译注入
            let theKeys = Object.keys(buildings)
            let difList = {
                "Proxima Dyson Sphere (Orichalcum)": "奥利哈刚戴森球",
                "Windmill (Evil)": "风车（邪恶种群）",
                "Sirius Ascension Machine (Complete)":"飞升装置（已完成）",
                "Shed":"仓库",
                "Alpha Warehouse":"半人马座α星系仓库",
                "Titan Habitat":"最大卫星定居点",
                "Alpha Habitat":"半人马座定居点",
                "Red Mine":"红色星球行星矿井",
                "Titan Mine":"最大卫星行星矿井",
                "Dwarf Mass Relay":"质量中继器",
                "Dwarf Mass Relay (Complete)":"质量中继器（已完成）",
                '':'',
                '':'',
                '':'',
                '':'',
                '':'',
                '':'',
                '':'',
                '':'',
                '':''
            }
            for(let i = 0; i < theKeys.length; i++)
            {
                let buildObj = buildings[theKeys[i]]
                let tempTitle
                let tempB1 = buildObj._tab
                let tempB2 = buildObj._id

                if(Object.keys(difList).includes(buildObj.name)){
                    buildObj.name = difList[buildObj.name];
                    continue;
                }

                if(typeof(evolve.actions[tempB1][tempB2])  == "undefined")
                {
                    let tempSubObList = Object.keys(evolve.actions[tempB1]);
                    for(let j = 0; j < tempSubObList.length; j++)
                    {
                        if(!(typeof(evolve.actions[tempB1][tempSubObList[j]][tempB2])  == "undefined"))
                        {
                            tempTitle = evolve.actions[tempB1][tempSubObList[j]][tempB2].title;
                            break;
                        }
                    }
                }
                else
                {
                    tempTitle = evolve.actions[tempB1][tempB2].title
                }
                buildObj.name = (typeof(tempTitle) == "function") ? tempTitle() : tempTitle
            }
            //资源翻译注入
            theKeys = Object.keys(resources)
            for(let i = 0; i < theKeys.length; i++)
            {
                switch(resources[theKeys[i]].constructor.name)
                {
                    case "Resource":
                        resources[theKeys[i]].name = game.global.resource[resources[theKeys[i]]._id].name
                        break;
                    case "SpecialResource":
                    case "Supply":
                        resources[theKeys[i]].name = game.loc("resource_"+resources[theKeys[i]]._id+"_name")
                        break;
                    case "Support":
                    case "BeltSupport":
                    case "ElectrolysisSupport":
                        break;
                    default:
                        //console.log(resources[theKeys[i]].constructor.name)
                        break;
                }
            }
            //arpa翻译注入
            theKeys = Object.keys(projects)
            for(let i = 0; i < theKeys.length; i++)
            {
                let tempObj = game.actions.arpa[projects[theKeys[i]]._id].title
                projects[theKeys[i]].name = (typeof(tempObj) == "function") ?  tempObj() : tempObj
            }
            translateFinish = true
        }
        // Make sure we have jQuery UI even if script was injected without *monkey"""
}

for key in replaceLsit.keys():
    content = content.replace(key,replaceLsit[key])

newFile.write(content)



oldFile.close()
newFile.close()
