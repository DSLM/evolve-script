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
    '<input type="text" style="height: 25px; width: 150px; float: right;" placeholder="Research...">':'<input type="text" style="height: 25px; width: 150px; float: right;" placeholder="研究……">',
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
