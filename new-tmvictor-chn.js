// ==UserScript==
// @name         Evolve-新版TMVictor汉化
// @namespace    https://github.com/pengminxuan/new-tmvictor-chn
// @version      1.5
// @description  try to take over the world!
// @downloadURL  https://github.com/pengminxuan/new-tmvictor-chn/raw/main/main.user.js
// @author       天使不见时
// @author       DSLM
// @author       by22dgb
// @match        https://likexia.gitee.io/evolve/
// @match        https://wdjwxh.github.io/Evolve-Scripting-Edition/
// @match        https://wdjwxh.gitee.io/evolve-scripting-edition/
// @match        https://tmvictor.github.io/Evolve-Scripting-Edition/
// @match        https://pmotschmann.github.io/Evolve/
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// ==/UserScript==

// 监听间隔
var LISTENER_TIME = 1000;

/**
 * 汉化配置
 *
 * ==========2021.06.15 换行处理方案==========
 * 使用"\n"来识别原文中的换行，或者对汉化文本进行换行
 *
 * ==========2021.04.17 前缀空格处理方案==========
 * " "(全角空格) => "\xa0"
 *
 * 扒原文title语句：$("#配置项标签id值").find("*").each(function(index, e) {if($(e).attr('title')){console.log($(e).attr('title'))}})
 * 扒原文text语句：$("#配置项标签id值").find("*").each(function(index, e) {if($(e).prop('firstChild').nodeValue){console.log($(e).prop('firstChild').nodeValue)}})
 *
 * 页面中使用<br>换行文本汉化示例
 * 原文：Non-Bioseed: Ignore Space Dock, Bioseeder Ship and Probes<br>Bioseed: Ignore World Collider<br>Whitehole: Ignore Jump Ship
 * 配置项："Non-Bioseed: Ignore Space Dock, Bioseeder Ship and Probes": "非生物种子:忽略太空码头、生物播种船和探测器\n 生物种子:忽略世界超级对撞机\n 黑洞: 忽略跃迁飞船"
 */
var CNZ_MAP = {
    // 侧边栏
    /*
    "More script options available in Settings tab": "设置选项卡中可以进行更详细的设置",
    "Ctrl+click options to open ": "按住Ctrl键再点击选项，可以开启",
    "advanced configuration": "进阶设置",
    "masterScriptToggle": "启用脚本",
    "showSettings": "显示设置",
    "autoEvolution": "自动进化",
    "autoFight": "自动战斗",
    "autoHell": "自动地狱维度",
    "autoMech": "自动机甲",
    "autoFleet": "自动仙女座舰队",
    "autoTax": "自动税率",
    "autoCraft": "自动锻造",
    "autoTrigger": "自动触发器",
    "autoBuild": "自动建筑",
    "autoARPA": "自动ARPA",
    "autoPower": "自动供能",
    "autoStorage": "自动存储",
    "autoMarket": "自动市场",
    "autoGalaxyMarket": "自动星际贸易",
    "autoResearch": "自动研究",
    "autoJobs": "自动工作",
    "autoCraftsmen": "自动工匠",
    "autoAlchemy": "自动炼金术",
    "autoPylon": "自动水晶塔",
    "autoQuarry": "自动温石棉控制",
    "autoSmelter": "自动冶炼",
    "autoFactory": "自动工厂",
    "autoMiningDroid": "自动采矿机器人",
    "autoGraphenePlant": "自动石墨烯厂",
    "autoAssembleGene": "自动组装基因",
    "autoMinorTrait": "自动次要基因",
    "autoEject": "自动质量喷射",
    "autoSupply": "自动补给",
    "autoNanite": "自动纳米体",
    "Prestige Options": "威望重置选项",
    "Bulk Sell": "批量销售",

    "Stop taking any actions on behalf of the player.": "在玩家需要的时候，停止所有脚本的活动。",
    "You can disable rendering of settings UI once you\'ve done with configuring script, if you experiencing performance issues. It can help a little.": "在设置选项卡中是否显示脚本相关设置。可能略微提升游戏速度。",
    "Runs through the evolution part of the game through to founding a settlement. In Auto Achievements mode will target races that you don\'t have extinction\\greatness achievements for yet.": "自动进行进化阶段。如果选择自动完成成就，则会优先考虑还未完成过毁灭类成就或者伟大类成就的种族。",
    "Sends troops to battle whenever Soldiers are full and there are no wounded. Adds to your offensive battalion and switches attack type when offensive rating is greater than the rating cutoff for that attack type.": "当士兵已满员且没有伤兵时让他们进行战斗。当战斗评级足够以后，会自动切换战役类型。",
    "Sends soldiers to hell and sends them out on patrols. Adjusts maximum number of powered attractors based on threat.": "将士兵派往地狱维度并自动分配巡逻队。根据恶魔生物数量自动调节吸引器信标的数量。",
    "Builds most effective large mechs for current spire floor. Least effective will be scrapped to make room for new ones.": "建造效率最高的大型机甲。将根据当前的情况调整机甲配置。",
    "Manages Andromeda fleet to supress piracy": "自动分配仙女座星系的舰队以压制海盗活动",
    "Adjusts tax rates if your current morale is greater than your maximum allowed morale. Will always keep morale above 100%.": "如果当前的士气高于上限，则会自动调整税率。会尽可能将士气保持在100%以上。",
    "Automatically produce craftable resources, thresholds when it happens depends on current demands and stocks.": "自动将资源转换为锻造物，进行转换的阈值根据当前需求和储量而定。",
    "Purchase triggered buildings, projects, and researches once conditions met": "满足条件时，购买相应的建筑，项目或者研究",
    "Construct buildings based on their weightings(user configured), and various rules(e.g. it won\'t build building which have no support to run)": "根据玩家设置的权重自动建造建筑，同时需要满足一定条件(例如：不会在支持不够时建造消耗相应支持的建筑)",
    "Builds ARPA projects if user enables them to be built.": "自动建造玩家允许建造的ARPA项目。",
    "Manages power based on a priority order of buildings. Also disables currently useless buildings to save up resources.": "根据建筑的优先级自动管理供能。同时会自动关闭无用的建筑，以节省资源。",
    "Assigns crates and containers to resources needed for buildings enabled for Auto Build, queued buildings, researches, and enabled projects": "自动分配箱子来管理自动建造、队列中的建筑、研究、以及ARPA项目所需的资源存储。",
    "Allows for automatic buying and selling of resources once specific ratios are met. Also allows setting up trade routes until a minimum specified money per second is reached. The will trade in and out in an attempt to maximise your trade routes.": "当资源到达某个比例以后自动买卖相应资源。也可以设置自动使用贸易路线进行交易，并且可以设置交易时最小的资金收入。将尽可能使用所有的贸易路线。",
    "Manages galaxy trade routes": "自动管理星际贸易路线",
    "Performs research when minimum requirements are met.": "当满足相应条件时自动进行研究。",
    "Assigns jobs in a priority order with multiple breakpoints. Starts with a few jobs each and works up from there. Will try to put a minimum number on lumber / stone then fill up capped jobs first.": "以相应优先级和多个阈值来自动分配工作。将先满足第一阈值后，再考虑第二阈值，然后再考虑最终阈值。在考虑其他工作前会先考虑伐木工人和石工数量。",
    "With this option autoJobs will also manage craftsmens.": "自动分配工匠。",
    "Manages alchemic transmutations": "自动管理炼金术转化",
    "Manages pylon rituals": "自动管理水晶塔符文",
    "Manages rock quarry stone to chrysotile ratio for smoldering races": "烈焰种族自动管理石头和温石棉的比例",
    "Manages smelter fuel and production.": "自动管理冶炼厂的生产。",
    "Manages factory production.": "自动管理工厂的生产。",
    "Manages mining droid production.": "自动管理采矿机器人的生产。",
    "Manages graphene plant. Not user configurable - just uses least demanded resource for fuel.": "自动管理石墨烯厂的燃料。无法手动控制，会自动使用需求最少的燃料。",
    "Automatically assembles genes only when your knowledge is at max. Stops when DNA Sequencing is researched.": "当知识满了以后，自动进行基因重组。进行首次测序时不生效。",
    "Purchase minor traits using genes according to their weighting settings.": "根据相应的权重，自动使用基因购买次要特质。",
    "Eject excess resources to black hole. Normal resources ejected when they close to storage cap, craftables - when above requirements.": "将多余的资源用于黑洞质量喷射。普通资源将在接近上限时用于喷射，锻造物将在超过需求时用于喷射。",
    "Send excess resources to Spire. Normal resources sent when they close to storage cap, craftables - when above requirements. Takes priority over ejector.": "将多余的资源用于补给。普通资源将在接近上限时用于补给，锻造物将在超过需求时用于补给。优先级高于质量喷射器。",
    "Consume resources to produce Nanite. Normal resources sent when they close to storage cap, craftables - when above requirements. Takes priority over supplies and ejector.": "将资源转化为纳米体。普通资源将在接近上限时用于转化，锻造物将在超过需求时用于转化。优先级高于补给和质量喷射器。",
    */
    "eg. 10 equals 10%": "例如：10代表10%",

    // 侧边栏高级设置
    /*
    "Variable 1": "变量1",
    "Check": "运算",
    "Variable 2": "变量2",
    "Result": "结果",
    "Value": "值",
    "AND": "与",
    "OR": "或",
    "NOR": "或非",
    "NAND": "与非",
    "XOR": "异或",
    "XNOR": "同或",
    "AND!": "与(变量2取非)",
    "OR!": "或(变量2取非)",
    "String": "字符串",
    "Returns string": "返回字符串的值",
    "Number": "数值",
    "Returns number": "返回数值的值",
    "Boolean": "布尔值",
    "Returns boolean": "返回布尔值的值",
    "Setting Default": "默认设置",
    "Returns default value of setting, types varies": "返回默认设置的值，数值类型可变",
    "Setting Current": "当前设置",
    "Returns current value of setting, types varies": "返回当前设置的值，数值类型可变",
    "Eval": "求值",
    "Returns result of evaluating code": "返回代码求值后的值",
    "Building Unlocked": "建筑是否解锁",
    "Return true when building is unlocked": "如果建筑已解锁，则返回真值",
    "Building Clickable": "建筑是否可点击",
    "Return true when building have all required resources, and can be purchased": "如果建筑满足所有建造条件并可以建造，则返回真值",
    "Building Affordable": "建筑是否足够资源建造",
    "Return true when building is affordable, i.e. costs of all resources below storage caps": "如果建筑足够资源建造，则返回真值",
    "Building Count": "建筑数量",
    "Returns amount of buildings as number": "以数值形式返回建筑数量",
    "Building Enabled": "建筑启用数量",
    "Returns amount of powered buildings as number": "以数值形式返回建筑已供能的数量",
    "Building Disabled": "建筑停用数量",
    "Returns amount of unpowered buildings as number": "以数值形式返回建筑未供能的数量",
    "Project Unlocked": "ARPA项目是否解锁",
    "Return true when project is unlocked": "如果ARPA项目已解锁，则返回真值",
    "Project Count": "ARPA项目数量",
    "Returns amount of projects as number": "以数值形式返回ARPA项目数量",
    "Project Progress": "ARPA项目进度",
    "Returns progress of projects as number": "以数值形式返回ARPA项目的进度",
    "Job Unlocked": "工作是否解锁",
    "Returns true when job is unlocked": "如果工作已解锁，则返回真值",
    "Job Count": "工作数量",
    "Returns current amount of assigned workers as number": "以数值形式返回已分配的工人数量",
    "Job Max": "工作上限",
    "Returns maximum amount of assigned workers as number": "以数值形式返回可分配的工人上限数量",
    "Research Unlocked": "研究是否解锁",
    "Returns true when research is unlocked": "如果研究已解锁，则返回真值",
    "Research Complete": "研究是否完成",
    "Returns true when research is complete": "如果研究已完成，则返回真值",
    "Resource Unlocked": "资源是否解锁",
    "Returns true when resource or support is unlocked": "如果资源已解锁，则返回真值",
    "Resource Quantity": "资源数量",
    "Returns current amount of resource or support as number": "以数值形式返回当前资源或支持的数量",
    "Resource Storage": "资源上限",
    "Returns maximum amount of resource or support as number": "以数值形式返回资源或支持上限的数量",
    "Resource Income": "资源收入",
    "Returns current income of resource or unused support as number": "以数值形式返回当前资源收入或未使用的支持的数量",
    "Resource Ratio": "资源比例",
    "Returns storage ratio of resource as number. Number 0.5 means that storage is 50% full, and such.": "以数值形式返回当前资源与上限比值的数量。0.5意味着资源到达了储量上限的50%，以此类推。",
    "Resource Satisfied": "资源是否满足",
    "Returns true when current amount of resource above maximum costs": "如果当前资源超过了最大花费，则返回真值。",
    "Resource Demanded": "资源是否需要",
    "Returns true when resource is demanded, i.e. missed by some prioritized task, such as queue or trigger": "如果资源目前需要，则返回真值。例如，当前队列或者触发器的消耗包含此项资源。",
    "Race Id": "种族类别",
    "Returns ID of selected race as string": "以字符串形式返回所选择种族的类别",
    "Race Pillared": "种族是否已嵌水晶",
    "Returns true when selected race pillared at current star level": "如果当前种族已经在当前成就等级下在永恒立柱上嵌入水晶，则返回真值",
    "Race Genus": "当前种群",
    "Returns true when playing selected genus": "如果当前种群为所选择的种群，则返回真值",
    "Current Race": "当前种族",
    "Current race": "当前种族",
    "Fanaticism Race": "狂热信仰种族",
    "Gods race": "狂热信仰的种族",
    "Deify Race": "神化先祖种族",
    "Old gods race": "神化先祖的种族",
    "Protoplasm": "原生质",
    "Race is not chosen yet": "还未选择种族",
    "Mimic Genus": "拟态种群",
    "Returns true when mimicking selected genus": "如果拟态特质选择的种群为所选择的种群，则返回真值",
    "Trait Level": "特质等级",
    "Returns trait level as number": "以数值形式返回特质的等级",
    "Reset Type": "重置类型",
    "Returns true when selected reset is active": "如果正在进行所选择的重置类型，则返回真值",
    "Challenge": "挑战",
    "Returns true when selected challenge is active": "如果当前游戏激活了相应的挑战，则返回真值",
    "Government": "社会体制",
    "Returns true when selected government is active": "如果当前社会体制为所选择的社会体制，则返回真值",
    "Universe": "宇宙",
    "Returns true when playing in selected universe": "如果当前宇宙为所选择的宇宙，则返回真值",
    "Big Bang": "大爆炸",
    "Universe is not chosen yet": "还未选择宇宙",
    "Returns true when selected governor is active": "如果当前游戏激活了相应的总督，则返回真值",
    "No governor selected": "还未选择总督",
    "Returns amount of items in queue as number": "以数值形式返回队列中内容的数量",
    "Evolution": "进化",
    "Date": "天数",
    "Returns ingame date as number": "以数值形式返回游戏中天数的数量",
    "Day (Year)": "天数(年)",
    "Day of year": "一年中的第几天",
    "Day (Month)": "天数(月)",
    "Day of month": "一月中的第几天",
    "Day (Total)": "天数(总)",
    "Day of run": "本轮游戏天数",
    "Year": "年数",
    "Year of run": "本轮游戏年数",
    "Orbit": "公转天数",
    "Planet orbit in days": "行星公转的天数",
    "Soldiers": "士兵数",
    "Returns amount of soldiers as number": "以数值形式返回士兵的数量",
    "Total Soldiers": "士兵总数",
    "Total Soldiers Max": "士兵总上限",
    "City Soldiers": "非地狱维度士兵数",
    "City Soldiers Max": "非地狱维度士兵上限",
    "Hell Soldiers": "地狱维度士兵数",
    "Hell Patrols": "地狱维度巡逻队数量",
    "Hell Patrol Size": "地狱维度巡逻队规模",
    "Wounded Soldiers": "伤兵数",
    "Dead Soldiers": "士兵阵亡数",
    "Ship Crew": "船员数",
    "Planet Biome": "行星生物群系",
    "Returns true when playing in selected biome": "如果当前行星的生物群系为所选择的生物群系，则返回真值",
    "Planet Trait": "行星星球特性",
    "Returns true when planet have selected trait": "如果当前行星的星球特性为所选择的星球特性，则返回真值",
    */
    /*
    "Population": "人口",
    "Slave": "奴隶",
    "Mana": "法力",
    "Zen": "禅",
    "Crates": "板条箱",
    "Containers": "集装箱",
    "Horseshoe": "马蹄铁",
    "Genes": "基因",
    "Soul Gem": "灵魂宝石",
    "Corrupt Gem": "腐化的灵魂宝石",
    "Codex": "法典",
    "Demonic Essence": "恶魔精华",
    "Blood Stone": "鲜血之石",
    "Artifact": "上古遗物",
    "Plasmid": "质粒",
    "Anti-Plasmid": "反质粒",
    "Phage": "噬菌体",
    "Dark": "暗能量",
    "Harmony": "和谐水晶",
    "Supplies": "物资供给",
    "Power": "电力",
    "Star Power": "星辰燃料",
    "Moon Support": "月球支持",
    "Red Support": "红色行星支持",
    "Sun Support": "蜂群支持",
    "Belt Support": "小行星带支持",
    "Alpha Support": "半人马座α星系支持",
    "Nebula Support": "螺旋星云支持",
    "Gateway Support": "星门支持",
    "Alien Support": "第五星系支持",
    "Lake Support": "湖泊支持",
    "Spire Support": "尖塔支持",
    "All values passed checks will be added or removed from list": "所有满足条件的数值将添加入列表，或者从列表中移除",
    "First value passed check will be used. Default value:": "从上往下，首个条件满足时，将使用相应数值。默认值为：",
    */

    // 威望重置设置
    //"Prestige Settings": "威望重置设置",
    //"Reset Prestige Settings": "威望重置设置还原",
    // "Prestige Type": "威望重置类型：",
    // "None": "无",
    // "Mutual Assured Destruction": "核弹重置",
    // "Bioseed": "播种重置",
    // "Cataclysm": "大灾变重置",
    // "Whitehole": "黑洞重置",
    // "Vacuum Collapse": "真空坍缩",
    // "AI Apocalypse": "人工智能觉醒",
    // "Ascension": "飞升重置",
    // "Demonic Infusion": "恶魔灌注",
    // "Use all Accelerated Time": "是否在重置前用完所有的加速时间",
    // "Ignore useless buildings": "忽略无用的建筑",
    // "Percent of active barracks after unification": "研究统一后的兵营比例",
    // "Pre-MAD: Ignore A.R.P.A.": "是否在研究相互毁灭前不建造ARPA项目",
    // "Wait for maximum population": "是否等待人口达到最大",
    // "Required population": "人口阈值",
    // "Required probes": "播种前至少需要的太空探测器数量",
    // "Save up Soul Gems for reset": "是否保留重置所需数量的灵魂宝石",
    // "Minimum solar mass for reset": "太阳质量阈值，达到后才会进行黑洞重置",
    // "Skip Custom Race": "是否忽略自建种族",
    // "Wait for Pillar": "是否等待永恒之柱",
    // "Minimum spire floor for reset": "进行恶魔灌注的层数阈值",
    // "Maximum mech potential for reset": "进行恶魔灌注的最大机甲潜力",
    // "Use Dark Energy Bomb": "是否使用暗能量炸弹",

    // "Endless game": "不会自动重置",
    // "MAD prestige once MAD has been researched and all soldiers are home": "当研究相互毁灭，且士兵全部存活时，进行核弹重置",
    // "Launches the bioseeder ship to perform prestige when required probes have been constructed": "当太空探测器数量达到指定值以后，进行播种重置",
    // "Perform cataclysm reset by researching Dial It To 11 once available": "自动研究把刻度盘拨到11，触发大灾变重置",
    // "Infuses the blackhole with exotic materials to perform prestige": "自动选择奇异灌输，触发黑洞重置",
    // "Build Mana Syphons until the end": "自动建造法力虹吸，触发真空坍缩",
    // "Perform AI Apocalypse reset by researching Protocol 66 once available": "自动研究《第66号技术协议》，触发人工智能觉醒",
    // "Allows research of Incorporeal Existence and Ascension. Ascension Machine managed by autoPower. User input still required to trigger reset, and create custom race.": "允许研究无形存在和飞升。飞升装置由自动供能进行管理。仍然需要玩家手动触发飞升并创建自建种族。",
    // "Sacrifice your entire civilization to absorb the essence of a greater demon lord": "注入恶魔之力，牺牲整个文明，成为恶魔领主",
    // "Delay reset until all accelerated time will be used": "直到用完所有的加速时间才进行重置",
    // "Space Dock, Bioseeder Ship and Probes will be constructed only when Bioseed prestige enabled. World Collider won't be constructed during Bioseed. Jump Ship won't be constructed during Whitehole. Stellar Engine won't be constucted during Vacuum Collapse.": "只在需要进行播种重置时建造星际船坞、生命播种飞船和星际探测器，并且不建造世界超级对撞机。进行黑洞重置时不建造跃迁飞船。进行真空坍缩时不建造恒星引擎。",
    // "Percent of barracks to keep enabled after unification, disabling some of them can reduce stress. All barracks will be enabled back when Bioseeder Ship will be at 90%, or after building World Collider": "研究统一后进行供能的兵营比例，取消供能可以提升士气。当生命播种飞船达到90段分项工程，或者是建造世界超级对撞机后，所有兵营将全部恢复供能。",
    // "Disables building A.R.P.A. projects until MAD is researched": "直到研究相互毁灭之前，不建造ARPA项目",
    // "Wait for maximum population and soldiers to maximize plasmids gain": "等待市民和士兵达到最大以后再进行重置，以尽可能多地获得质粒",
    // "Required number of workers and soldiers before performing MAD reset": "达到相应数量的市民和士兵后，才进行核弹重置",
    // "Required number of probes before launching bioseeder ship": "达到太空探测器所需数量后，才进行播种重置",
    // "Save up enough Soul Gems for reset, only excess gems will be used. This option does not affect triggers.": "保留重置所需数量的灵魂宝石，只使用超过相应数量的灵魂宝石。不影响触发器。",
    // "Required minimum solar mass of blackhole before prestiging. Script do not stabilize on blackhole run, this number will need to be reached naturally": "达到太阳质量阈值后，才进行黑洞重置。脚本不会在威望重置类型为黑洞重置时稳定黑洞，需要自然达到此质量",
    // "Perform reset without making any changes to custom. This option is required, script won't ascend automatically without it enabled.": "不对自建种族进行任何修改就进行重置。只有开启此项才能自动进行飞升重置。",
    // "Wait for Pillar before ascending, unless it was done earlier": "直到永恒之柱上嵌入水晶后才进行重置",
    // "Perform reset after climbing up to this spire floor": "到达相应层数后才进行恶魔灌注",
    // "Perform reset only if current mech team potential below given amount. Full bay of best mechs will have `1` potential. This allows to postpone reset if your team is still good after reaching target floor, and can quickly clear another floor": "只在当前机甲潜力低于相应数值后才进行恶魔灌注。机甲舱充满最好设计的机甲时潜力为1。这样就可以在机甲战斗力还较高的时候延迟恶魔灌注，同时也可以更快地通过一些楼层。",
    // "Kill Demon Lord with Dark Energy Bomb": "用暗能量炸弹送恶魔领主上西天",

    // 常规设置
    //"General Settings": "常规设置",
    //"Reset General Settings": "常规设置还原",
    // "Script tick rate": "脚本运算频率",
    // "Prioritization": "优先级",
    // "Save": "保留",
    // "Request": "请求",
    // "Request & Save": "保留及请求",
    // "Allow using prioritized resources for crafting": "允许使用优先生产和购买的资源进行锻造和生产",
    // "Prioritize resources for Pre-MAD researches": "资源是否优先分配给相互毁灭前的研究",
    // "Prioritize resources for Space+ researches": "资源是否优先分配给太空后的研究",
    // "Prioritize resources for missions": "资源是否优先分配给任务",
    // "Queue": "队列",
    // "Triggers": "触发器",
    // "Unification": "统一",
    // "Ship (The True Path)": "舰船(智械黎明模式)",
    // "Auto clicker": "自动点击",
    // "Always autoclick resources": "是否总是自动收集资源",
    // "Maximum clicks per tick": "每时刻最高点击次数",

    // "Script runs once per this amount of game ticks. Game tick every 250ms, thus with rate 4 script will run once per second. You can set it lower to make script act faster, or increase it if you have performance issues. Tick rate should be a positive integer.": "每达到相应时刻后脚本就进行一次运算。游戏每250毫秒达到一个时刻，因此设为4以后脚本将每秒运算一次。您可以将此值调低以使脚本更快运行，也可以将此值调高来避免卡顿。时刻数值需要为正整数。",
    // "Does nothing": "什么都不做",
    // "Missing resources preserved from using.": "缺失的资源保留下来不使用。",
    // "Production and buying of missing resources will be prioritized.": "优先生产和购买缺失的资源。",
    // "Missing resources will be prioritized, and preserved from using.": "优先生产和购买缺失的资源，并保留它们不使用。",
    // "When disabled script won't make craftables out of prioritized resources in foundry and factory.": "如果关闭此项，则脚本不会使用优先的资源来制造锻造物和工厂产品。",
    // "Readjust trade routes and production to resources required for unlocked and affordable researches. Works only with no active triggers, or queue. Missing resources will have 100 priority where applicable(autoMarket, autoGalaxyMarket, autoFactory, autoMiningDroid), or just 'top priority' where not(autoTax, autoCraft, autoCraftsmen, autoQuarry, autoSmelter).": "将贸易路线和生产资源调整为已解锁且上限足够的研究所需要的资源。只在触发器和队列中没有内容激活时生效。缺少的资源对于自动贸易、自动银河贸易、自动工厂和自动采矿机器人来说权重为100，对于自动税率、自动锻造、自动温石棉控制、自动冶炼来说为最高优先级。",
    // "Readjust trade routes and production to resources required for unlocked and affordable missions. Missing resources will have 100 priority where applicable(autoMarket, autoGalaxyMarket, autoFactory, autoMiningDroid), or just 'top priority' where not(autoTax, autoCraft, autoCraftsmen, autoQuarry, autoSmelter).": "将贸易路线和生产资源调整为已解锁且上限足够的任务所需要的资源。缺少的资源对于自动贸易、自动银河贸易、自动工厂和自动采矿机器人来说权重为100，对于自动税率、自动锻造、自动温石棉控制、自动冶炼来说为最高优先级。",
    // "Alter script behaviour to speed up queued items, prioritizing missing resources.": "调整脚本处理队列中项目的方式，优先缺失的资源。",
    // "Alter script behaviour to speed up triggers, prioritizing missing resources.": "调整脚本处理触发器中项目的方式，优先缺失的资源。",
    // "Alter script behaviour to speed up unification, prioritizing money required to purchase foreign cities.": "调整脚本处理统一的方式，优先使用资金来收购周边国家。",
    // "Alter script behaviour to assist fleet building, prioritizing resources required for current design of ship.": "调整脚本分配舰队建筑的方式，优先舰船缺失的资源。",
    // "By default script will click only during early stage of autoBuild, to bootstrap production. With this toggled on it will continue clicking forever": "默认情况下脚本只在游戏初期自动收集资源，开启此项后将一直自动收集资源",
    // "Number of clicks performed at once, each script tick. Will not ever click more than needed to fill storage.": "每时刻自动收集资源的点击次数。只在库存未满的范围内有效。",

    // 政府设置
    //"Government Settings": "政府设置",
    //"Reset Government Settings": "政府设置还原",
    // "Minimum allowed tax rate": "最低允许税率",
    // "Minimum allowed morale": "最低允许士气",
    // "Maximum allowed morale": "最高允许士气",
    // "Manage changes of government": "是否管理社会体制变化",
    // "Interim Government": "临时社会体制",
    // "Second Government": "第二社会体制",
    // "Space Government": "太空社会体制",
    // "Governor": "总督",
    //
    // "Minimum tax rate for autoTax. Will still go below this amount if money storage is full": "自动税率使用的最低税率。如果资金满了，将可能低于此数值。",
    // "Use this to set a minimum allowed morale. Remember that less than 100% can cause riots and weather can cause sudden swings": "设置最低允许的士气。少于100%士气可能引起税收抵制，请尽量不要设置到100%以下。另外请记得天气的影响",
    // "Use this to set a maximum allowed morale. The tax rate will be raised to lower morale to this maximum": "设置最高允许的士气。如果士气超过此数值，将提高税率",
    // "Manage changes of government when they become available": "当可能的时候，自动改变社会体制",
    // "Temporary low tier government until you research other governments": "当研究其他社会体制之前，用于过渡的临时社会体制",
    // "Second government choice, chosen once becomes available. Can be the same as above": "第二社会体制，当此社会体制可用后立刻进行切换。可以与上面的社会体制相同。",
    // "Government for bioseed+. Chosen once you researched Quantum Manufacturing. Can be the same as above": "用于播种之后的社会体制，当研究量子制造以后立刻进行切换。可以与上面的社会体制相同。",
    // "Do not select governor": "不选择总督",
    // "Chosen governor will be appointed.": "将使用选中的总督。",

    // 进化设置
    // "Evolution Settings": "进化设置",
    // // "Reset Evolution Settings": "进化设置还原",
    // "Target Universe": "欲选择的宇宙",
    // "Target Planet": "欲选择的星球",
    // "Target Race": "欲进化的种族",
    // "Soft Reset": "是否进行软重置",
    // "Evolution Queue": "进化队列",
    // "Queue Enabled": "是否开启进化队列",
    // "Repeat Queue": "是否重复队列",
    // "Prestige for new evolutions:": "新一轮进化使用的威望重置类型：",
    // "Current Prestige": "当前的威望重置类型",
    // "Add New Evolution": "添加进化队列",
    // "Race": "种族",
    // "Settings": "设置",
    // "Auto Achievements (Extinction)": "自动成就(毁灭类)",
    // "Auto Achievements (Greatness)": "自动成就(伟大类)",
    // "Auto Achievements (Pillars)": "自动成就(永恒立柱)",
    //
    // "Chosen universe will be automatically selected after appropriate reset": "在特定重置后自动选择相应的宇宙",
    // "Chosen planet will be automatically selected after appropriate reset": "在特定重置后自动选择相应的星球",
    // "Wait for user selection": "等待玩家选择",
    // "Picks most habitable planet, based on biome and trait": "根据生物群系和星球特性，选择最佳的星球",
    // "Picks planet with most unearned achievements. Takes in account extinction achievements for planet exclusive races, and greatness achievements for planet biome, trait, and exclusive genus.": "选择可以尽可能多完成成就的星球。将考虑毁灭类成就中星球特有的种族，以及伟大类成就中生物群系，星球特征和特有的种群。",
    // "Picks planet with highest weighting. Should be configured in Planet Weighting Settings section.": "选择星球权重最高的星球。可以在下面的星球权重设置中进行更进一步的设置。",
    // "Picks race giving most achievements upon completing run. Tracks all achievements limited to specific races and resets. Races unique to current planet biome are prioritized, when available.": "优先选择可以获得更多成就的种族，会将所有种族和种群限定，或是重置方式限定的成就纳入考虑。生物群系特有的种族如果可以选择，将优先进行选择。",
    // "Chosen race will be automatically selected during next evolution": "下个进化阶段自动选择相应的种族",
    // "Perform soft resets until you'll get chosen race. Useless after getting mass exintion perk.": "直到选中想要选择的种族之前一直进行软重置。在获得大灭绝特权后就没有必要选择了。",
    // "When enabled script with evolve with queued settings, from top to bottom. During that script settings will be overriden with settings stored in queue. Queued target will be removed from list after evolution.": "按照队列从上至下进行进化。队列中有项目存在时，优先于脚本的进化设置生效。在完成进化后，相应的队列项目将被移除。",
    // "When enabled applied evolution targets will be moved to the end of queue, instead of being removed": "开启后，队列中的项目在完成进化后将回到队列末尾，而不是被移除",
    // "Inherited from current Prestige Settings": "与当前的威望重置类型一致",
    // "Settings applied before evolution. Changed settings not limited to initial template, you can manually add any script options to JSON.": "进化之前生效的设置。不仅限于模板，您还可以将其他的脚本设置以JSON形式输入。",

    // 星球独有种族警告
    /*
    "This race have special requirements: Hellscape planet. This condition is met.": "此种族的特殊要求为：地狱星球。当前满足此条件。",
    "This race have special requirements: Eden planet. This condition is met.": "此种族的特殊要求为：伊甸园星球。当前满足此条件。",
    "This race have special requirements: Oceanic planet. This condition is met.": "此种族的特殊要求为：海洋星球。当前满足此条件。",
    "This race have special requirements: Challenge genes unlocked. This condition is met.": "此种族的特殊要求为：已解锁相应挑战基因。当前满足此条件。",
    "This race have special requirements: Forest planet. This condition is met.": "此种族的特殊要求为：森林星球。当前满足此条件。",
    "This race have special requirements: Volcanic planet. This condition is met.": "此种族的特殊要求为：火山星球。当前满足此条件。",
    "This race have special requirements: Tundra planet. This condition is met.": "此种族的特殊要求为：苔原星球。当前满足此条件。",
    "This race have special requirements: Desert planet. This condition is met.": "此种族的特殊要求为：沙漠星球。当前满足此条件。",
    "This race have special requirements: Custom designed race. This condition is met.": "此种族的特殊要求为：已解锁自建种族。当前满足此条件。",
    "Warning! This race have special requirements: Hellscape planet. This condition is not met.": "警告！此种族的特殊要求为：地狱星球。当前不满足此条件。",
    "Warning! This race have special requirements: Eden planet. This condition is not met.": "警告！此种族的特殊要求为：伊甸园星球。当前不满足此条件。",
    "Warning! This race have special requirements: Oceanic planet. This condition is not met.": "警告！此种族的特殊要求为：海洋星球。当前不满足此条件。",
    "Warning! This race have special requirements: Challenge genes unlocked. This condition is not met.": "警告！此种族的特殊要求为：已解锁相应挑战基因。当前不满足此条件。",
    "Warning! This race have special requirements: Forest planet. This condition is not met.": "警告！此种族的特殊要求为：森林星球。当前不满足此条件。",
    "Warning! This race have special requirements: Volcanic planet. This condition is not met.": "警告！此种族的特殊要求为：火山星球。当前不满足此条件。",
    "Warning! This race have special requirements: Tundra planet. This condition is not met.": "警告！此种族的特殊要求为：苔原星球。当前不满足此条件。",
    "Warning! This race have special requirements: Desert planet. This condition is not met.": "警告！此种族的特殊要求为：沙漠星球。当前不满足此条件。",
    "Warning! This race have special requirements: Custom designed race. This condition is not met.": "警告！此种族的特殊要求为：已解锁自建种族。当前不满足此条件。",
    "Warning! This race have special requirements: Hellscape planet. This condition is bypassed. Race will have 20% penalty.": "警告！此种族的特殊要求为：地狱星球。当前可使用此种族，但受到20%的产量惩罚。",
    "Warning! This race have special requirements: Eden planet. This condition is bypassed. Race will have 20% penalty.": "警告！此种族的特殊要求为：伊甸园星球。当前可使用此种族，但受到20%的产量惩罚。",
    "Warning! This race have special requirements: Oceanic planet. This condition is bypassed. Race will have 20% penalty.": "警告！此种族的特殊要求为：海洋星球。当前可使用此种族，但受到20%的产量惩罚。",
    "Warning! This race have special requirements: Forest planet. This condition is bypassed. Race will have 20% penalty.": "警告！此种族的特殊要求为：森林星球。当前可使用此种族，但受到20%的产量惩罚。",
    "Warning! This race have special requirements: Volcanic planet. This condition is bypassed. Race will have 20% penalty.": "警告！此种族的特殊要求为：火山星球。当前可使用此种族，但受到20%的产量惩罚。",
    "Warning! This race have special requirements: Tundra planet. This condition is bypassed. Race will have 20% penalty.": "警告！此种族的特殊要求为：苔原星球。当前可使用此种族，但受到20%的产量惩罚。",
    "Warning! This race have special requirements: Desert planet. This condition is bypassed. Race will have 20% penalty.": "警告！此种族的特殊要求为：沙漠星球。当前可使用此种族，但受到20%的产量惩罚。",
    "Warning! This race have special requirements: Custom designed race. This condition is bypassed. Race will have 20% penalty.": "警告！此种族的特殊要求为：已解锁自建种族。当前可使用此种族，但受到20%的产量惩罚。",
    "Warning! This race have special requirements: Hellscape planet. This condition is bypassed. Race will have 10% penalty.": "警告！此种族的特殊要求为：地狱星球。当前可使用此种族，但受到10%的产量惩罚。",
    "Warning! This race have special requirements: Eden planet. This condition is bypassed. Race will have 10% penalty.": "警告！此种族的特殊要求为：伊甸园星球。当前可使用此种族，但受到10%的产量惩罚。",
    "Warning! This race have special requirements: Oceanic planet. This condition is bypassed. Race will have 10% penalty.": "警告！此种族的特殊要求为：海洋星球。当前可使用此种族，但受到10%的产量惩罚。",
    "Warning! This race have special requirements: Forest planet. This condition is bypassed. Race will have 10% penalty.": "警告！此种族的特殊要求为：森林星球。当前可使用此种族，但受到10%的产量惩罚。",
    "Warning! This race have special requirements: Volcanic planet. This condition is bypassed. Race will have 10% penalty.": "警告！此种族的特殊要求为：火山星球。当前可使用此种族，但受到10%的产量惩罚。",
    "Warning! This race have special requirements: Tundra planet. This condition is bypassed. Race will have 10% penalty.": "警告！此种族的特殊要求为：苔原星球。当前可使用此种族，但受到10%的产量惩罚。",
    "Warning! This race have special requirements: Desert planet. This condition is bypassed. Race will have 10% penalty.": "警告！此种族的特殊要求为：沙漠星球。当前可使用此种族，但受到10%的产量惩罚。",
    "Warning! This race have special requirements: Custom designed race. This condition is bypassed. Race will have 10% penalty.": "警告！此种族的特殊要求为：已解锁自建种族。当前可使用此种族，但受到10%的产量惩罚。",
    "Warning! This race have special requirements: Hellscape planet. This condition is bypassed. Race will have 5% penalty.": "警告！此种族的特殊要求为：地狱星球。当前可使用此种族，但受到5%的产量惩罚。",
    "Warning! This race have special requirements: Eden planet. This condition is bypassed. Race will have 5% penalty.": "警告！此种族的特殊要求为：伊甸园星球。当前可使用此种族，但受到5%的产量惩罚。",
    "Warning! This race have special requirements: Oceanic planet. This condition is bypassed. Race will have 5% penalty.": "警告！此种族的特殊要求为：海洋星球。当前可使用此种族，但受到5%的产量惩罚。",
    "Warning! This race have special requirements: Forest planet. This condition is bypassed. Race will have 5% penalty.": "警告！此种族的特殊要求为：森林星球。当前可使用此种族，但受到5%的产量惩罚。",
    "Warning! This race have special requirements: Volcanic planet. This condition is bypassed. Race will have 5% penalty.": "警告！此种族的特殊要求为：火山星球。当前可使用此种族，但受到5%的产量惩罚。",
    "Warning! This race have special requirements: Tundra planet. This condition is bypassed. Race will have 5% penalty.": "警告！此种族的特殊要求为：苔原星球。当前可使用此种族，但受到5%的产量惩罚。",
    "Warning! This race have special requirements: Desert planet. This condition is bypassed. Race will have 5% penalty.": "警告！此种族的特殊要求为：沙漠星球。当前可使用此种族，但受到5%的产量惩罚。",
    "Warning! This race have special requirements: Custom designed race. This condition is bypassed. Race will have 5% penalty.": "警告！此种族的特殊要求为：已解锁自建种族。当前可使用此种族，但受到5%的产量惩罚。",

    "Challenge mode - no plasmids": "挑战模式-关闭质粒效果",
    "Challenge mode - weak mastery": "挑战模式-弱精通效果",
    "Challenge mode - no trade": "挑战模式-关闭自由贸易",
    "Challenge mode - no manual crafting": "挑战模式-关闭手工制作",
    "Challenge mode - reduced CRISPER effects": "挑战模式-CRISPR弱折扣",
    "Challenge mode - joyless": "挑战模式-无趣",
    "Challenge mode - decay": "挑战模式-衰变",
    "Challenge mode - steelen": "挑战模式-禁钢",
    "Challenge mode - electromagnetic field disruption": "挑战模式-E.M.磁场",
    "Challenge mode - shattered world (no homeworld)": "挑战模式-大灾变",
    "Challenge mode - genetic dead end (Valdi)": "挑战模式-遗传绝境(瓦尔迪)",
    */

    // 星球权重设置
    // "Planet Weighting Settings": "星球权重设置",
    // "Reset Planet Weighting Settings": "星球权重设置还原",
    // "Planet Weighting = Biome Weighting + Trait Weighting + (Extras Intensity * Extras Weightings)": "星球权重 = 群系权重 + 特性权重 + (其他项数值 * 其他项权重)",
    // "Biome": "群系",
    // "Trait": "特性",
    // "Extra": "其他",
    // "Achievement": "成就",

    // 特质设置
    // "Traits Settings": "特质设置",
    // "Reset Traits Settings": "次要特质设置还原",
    // "Mimic genus": "拟态种群",
    // "Minor Trait": "次要特质",
    // "Enabled": "是否启用",
    // "Weighting": "权重",

    // "Do not shift genus": "不变换种群",
    // "Mimic selected genus, if avaialble. If you want to add some conditional overrides to this setting, keep in mind changing genus redraws game page, too frequent(every tick or few) changes can drastically harm game performance.": "拟态特质选择相应种群。如果您想要对此项进行进阶设置，请注意切换拟态特质将刷新游戏页面，切换过于频繁将影响游戏运行。",

    // 触发器设置
    // "Trigger Settings": "触发器设置",
    // "Reset Trigger Settings": "触发器设置还原",
    "Add New Trigger": "添加新触发器",
    "Requirement": "需求",
    "Action": "行动",
    "Type": "类型",
    "Id": "Id",
    "Count": "计数",
    "Built": "建造时",
    "Researched": "研究后",
    "Unlocked": "解锁时",
    "Build": "建造",
    "Technology": "研究",

    "This condition is met when technology is shown in research tab": "当相应研究解锁后，视为满足条件",
    "This condition is met when technology is researched": "当进行相应研究后，视为满足条件",
    "This condition is met when you have 'count' or greater amount of buildings": "当相应建筑的数量达到相应数值后，视为满足条件",
    "Research technology": "进行相应研究",
    "Build buildings up to 'count' amount": "建造建筑，数量上限为计数",
    "Build projects up to 'count' amount": "建造ARPA项目，数量上限为计数",

    // 研究设置
    // "Research Settings": "研究设置",
    // "Reset Research Settings": "研究设置还原",
    "Target Theology 1": "神学研究分支1",
    "Anthropology": "人类学",
    "Fanaticism": "狂热信仰",
    "Target Theology 2": "神学研究分支2",
    "Study": "研究先祖",
    "Deify": "神化先祖",
    "Ignored researches": "忽略的研究",
    "Add": "增加",
    "Remove": "移除",

    "Picks Anthropology for MAD prestige, and Fanaticism for others. Achieve-worthy combos are exception, on such runs Fanaticism will be always picked.": "进行核弹重置时选择人类学，其余情况下选择狂热信仰。需要狂热信仰祖先才能完成成就时例外，此时将一直选择狂热信仰。",
    "Theology 1 technology to research, have no effect after getting Transcendence perk": "神学研究分支1的选择，获得超越特权以后失效",
    "Picks Deify for Ascension prestige, and Study for others": "进行飞升重置时选择神化先祖，其余情况下选择研究先祖",
    "Theology 2 technology to research": "神学研究分支2的选择",
    "Listed researches won't be purchased without manual input, or user defined trigger. On top of this list script will also ignore some other special techs, such as Limit Collider, Dark Energy Bomb, Exotic Infusion, etc.": "脚本将不会进行相应的自动研究。部分特殊研究同样不会自动进行，例如限制对撞机，暗能量炸弹和奇异灌输等。",

    // 外交事务设置
    // "Foreign Affairs Settings": "外交事务设置",
    // "Reset Foreign Affairs Settings": "外交事务设置还原",
    "Foreign Powers": "外国势力相关",
    "Pacifist": "是否为和平主义者",
    "Perform unification": "是否进行统一",
    "Occupy last foreign power": "是否占领最后一个未占领的国家",
    "Sabotage foreign power when useful": "在有必要的时候对敌对国家进行破坏活动",
    "Train spies": "派遣间谍",
    "Maximum spies": "最大间谍数",
    "Military Power to switch target": "改变目标至少需要的军事力量",
    "Inferior Power": "对较弱小的国家进行的间谍活动",
    "Superior Power": "对较强大的国家进行的间谍活动",
    "Rival Power (The True Path)": "竞争国家(智械黎明模式)",
    "Ignore": "忽略",
    "Influence": "亲善",
    "Sabotage": "破坏",
    "Incite": "煽动",
    "Annex": "吞并",
    "Purchase": "收购",
    "Occupy": "占领",
    "Alliance": "联盟",
    "War": "战斗",
    "Campaigns": "战役相关",
    "Minimum percentage of alive soldiers for attack": "只在士兵生存人数大于此比例时进攻",
    "Minimum percentage of healthy soldiers for attack": "只在未受伤士兵人数大于此比例时进攻",
    "Hire mercenary if money storage greater than percent": "如果资金存量大于此比例，则聘请雇佣兵",
    "OR if cost lower than money earned in X seconds": "或者聘请花费小于此秒数的资金产量，则聘请雇佣兵",
    "AND amount of dead soldiers above this number": "并且需要阵亡士兵数量大于此数值，才会聘请雇佣兵",
    "Minimum advantage": "最低优势",
    "Maximum advantage": "最高优势",
    "Maximum siege battalion": "最高围城士兵数",
    "Auto": "自动",
    "Protect soldiers": "是否保护士兵",

    "Turns attacks off and on": "是否进攻敌国",
    "Perform unification once all three powers are controlled. autoResearch should be enabled for this to work.": "是否在控制了三个敌对国家后进行统一。需要开启自动研究后此项才能生效。",
    "Occupy last foreign power once other two are controlled, and unification is researched to speed up unification. Disable if you want annex\\purchase achievements.": "当控制其他两个国家并研究统一后，自动占领最后一个国家。它可以加速统一。除非您是要做统一方式相关的成就，否则不建议关闭此项。",
    "Perform sabotage against current target if it's useful(power above 50), regardless of required power, and default action defined above": "在有需要的时候(军事力量大于50)，对当前的目标进行破坏活动。将无视下方选项的相应设置。",
    "Train spies to use against foreign powers": "训练间谍用于在外国势力执行任务",
    "Maximum spies per foreign power": "每个敌对国家最多训练的间谍数",
    "Switches to attack next foreign power once its power lowered down to this number. When exact numbers not know script tries to approximate it.": "当一个国家的军事实力低于此数值时，转为攻击它。如果确切数字无法看到，则脚本会尝试进行估计。",
    "Perform this against inferior foreign power, with military power equal or below given threshold. Complex actions includes required preparation - Annex and Purchase will incite and influence, Occupy will sabotage, until said options will be available.": "对较弱小的国家进行的间谍活动类型，较弱小指军事力量不高于上方数值的国家。复杂的活动将首先进行相应的准备——吞并和收购将先进行煽动和亲善，占领将先进行破坏，直到相应的选项可用为止。",
    "Perform this against superior foreign power, with military power above given threshold. Complex actions includes required preparation - Annex and Purchase will incite and influence, Occupy will sabotage, until said options will be available.": "对较强大的国家进行的间谍活动类型，较强大指军事力量高于上方数值的国家。复杂的活动将首先进行相应的准备——吞并和收购将先进行煽动和亲善，占领将先进行破坏，直到相应的选项可用为止。",
    "Perform this against rival foreign power.": "对竞争国家进行的间谍活动类型。",
    "Only attacks if you ALSO have the target battalion size of healthy soldiers available, so this setting will only take effect if your battalion does not include all of your soldiers": "下方的未受伤士兵比例也会生效，因此只在未让所有士兵进攻时生效",
    "Set to less than 100 to take advantage of being able to heal more soldiers in a game day than get wounded in a typical attack": "合理设置为某个低于100的值，可以有效利用游戏内的自然愈合机制",
    "Hire a mercenary if remaining money after purchase will be greater than this percent": "如果聘请后剩余资金大于此比例，则聘请雇佣兵",
    "Combines with the money storage percent setting to determine when to hire mercenaries": "结合剩余资金比例，可以管理聘请雇佣兵的时机",
    "Hire a mercenary only when current amount of dead soldiers above given number": "只在阵亡士兵数量超过此数值时聘请雇佣兵",
    "Minimum advantage to launch campaign, ignored during ambushes. 100% chance to win will be reached at approximately(influenced by traits and selected campaign) 75% advantage.": "进行相应战役类型最少需要的优势。进行伏击时忽略此项。大概在75%优势(受特质和战役类型影响)附近可以做到100%胜率。",
    "Once campaign is selected, your battalion will be limited in size down to this advantage, reducing potential loses": "当选择相应战役类型后，参加战斗的士兵数将限制在尽可能接近此优势的数量，以减少损失",
    "Maximum battalion for siege campaign. Only try to siege if it's possible with up to given amount of soldiers. Siege is expensive, if you'll be doing it with too big battalion it might be less profitable than other combat campaigns. This option does not applied to unifying sieges, it affect only looting.": "进行围城的最大士兵数。只在此数值的士兵数量可以进行围城时这么做。围城的损失通常很大，如果需要大量士兵才能进行的话，收益将无法弥补损失。此项不影响统一时的围城士兵数。",
    "No additional limits to battalion size. Always send maximum soldiers allowed with current Max Advantage.": "不限制参加战斗的士兵数。永远尽可能使用最高优势对应的士兵数。",
    "Limit battalions to sizes which will neven suffer any casualties in successful fights. You still will lose soldiers after failures, increasing minimum advantage can improve winning odds. This option designed to use with armored races favoring frequent attacks, with no approppriate build it may prevent any attacks from happening.": "将参加战斗的士兵数限制为战斗胜利后不损失任何士兵的数值。战败则仍然可能损失士兵，此时提升最低优势可以增加胜率。此项是供有装甲相关特质的种族优化进攻频率使用，如果设置不当，可能会导致士兵永远不进攻。",
    "Tries to maximize total number of attacks, alternating between full and safe attacks based on soldiers condition, to get most from both healing and recruiting.": "尽可能增加战斗总次数，根据士兵情况，自动在前两个选项之间切换，以优化战斗结果。",
    "Configures safety of attacks. This option does not applies to unifying sieges, it affect only looting.": "设置士兵攻击的烈度。此项不影响统一时的围城士兵数。",

    // 地狱维度设置
    // "Hell Settings": "地狱维度设置",
    // "Reset Hell Settings": "地狱维度设置还原",
    "Entering Hell": "进入地狱维度",
    "Soldiers to stay out of hell": "不进入地狱维度的士兵人数",
    "Minimum soldiers to be available for hell (pull out if below)": "进入地狱维度最少士兵总数(低于此值时撤出)",
    "Alive soldier percentage for entering hell": "进入地狱维度需拥有生存士兵的比例",
    "Hell Garrison": "地狱维度驻扎士兵",
    "Target wall damage per siege (overestimates threat)": "围攻后城墙耐久减少为相应数值(尽量高估威胁)",
    "Garrison bolster factor for damaged walls": "受损城墙驻扎士兵增援因子",
    "Patrol Size": "巡逻队规模",
    "Automatically adjust patrol size": "自动调整巡逻队规模",
    "Minimum patrol attack rating": "单支巡逻队最低战斗评级",
    "Percent of current threat as base patrol rating": "恶魔生物基础评级与数量比例",
    " Lower Rating for each active Predator Drone by": "\xa0\xa0\xa0\xa0 每个掠食者无人机减少恶魔生物评级",
    " Lower Rating for each active War Droid by": "\xa0\xa0\xa0\xa0 每个战斗机器人减少恶魔生物评级",
    " Lower Rating for each Bootcamp by": "\xa0\xa0\xa0\xa0 每个新兵训练营减少恶魔生物评级",
    "Increase patrol rating by up to this when soldiers die": "士兵阵亡时增加巡逻队战斗评级至此数值",
    " Start increasing patrol rating at this home garrison fill percent": "\xa0\xa0\xa0\xa0 当驻军到达此比例时开始增加巡逻队战斗评级",
    " Full patrol rating increase below this home garrison fill percent": "\xa0\xa0\xa0\xa0 当驻军低于此比例时将巡逻队战斗评级增加到最大",
    "Attractors": "吸引器信标",
    " All Attractors on below this threat": "\xa0\xa0\xa0\xa0 恶魔生物数量低于此数值时开启所有吸引器信标",
    " All Attractors off above this threat": "\xa0\xa0\xa0\xa0 恶魔生物数量高于此数值时关闭所有吸引器信标",

    "Home garrison maximum": "驻军上限",
    "Don't enter hell if not enough soldiers, or get out if already in": "如果士兵不足，不进入地狱维度，如果已经进入，则撤出所有士兵",
    "Don't enter hell if too many soldiers are dead, but don't get out": "如果阵亡士兵过多，不进入地狱维度，但不会撤出士兵",
    "Actual damage will usually be lower due to patrols and drones": "实际上由于有巡逻队和机器人，耐久不会减少那么多",
    "Multiplies target defense rating by this when close to 0 wall integrity, half as much increase at half integrity": "当城墙剩余耐久接近0时，将堡垒防御评级增强到乘以此因子的数值，城墙剩余耐久为一半时，增强到乘以此因子一半的数值",
    "Sets patrol attack rating based on current threat, lowers it depending on buildings, increases it to the minimum rating, and finally increases it based on dead soldiers. Handling patrol count has to be turned on.": "根据当前恶魔生物数量调整巡逻队规模，建筑作用下将减少之，低于最低战斗评级及士兵阵亡时将增加之。必须开启调整巡逻队数量。",
    "Will never go below this": "不会低于此数值",
    "Demon encounters have a rating of 2 to 10 percent of current threat": "作为参考，每次激战的恶魔评级为当前恶魔数量的2%至10%",
    "Predators reduce threat before patrols fight": "掠食者无人机在巡逻队战斗前就减少恶魔生物数量",
    "War Droids boost patrol attack rating by 1 or 2 soldiers depending on tech": "根据研究情况，战斗机器人可以增加1至2名士兵的巡逻队战斗评级",
    "Bootcamps help regenerate soldiers faster": "新兵训练营使士兵更快完成训练",
    "Larger patrols are less effective, but also have fewer deaths": "更大的巡逻队效率更低，但阵亡也更少",
    "This is the higher number": "较高数值",
    "This is the lower number": "较低数值",
    "Turn more and more attractors off when getting nearer to the top threat. Auto Power needs to be on for this to work.": "越接近最大恶魔数量，关闭越多吸引器信标。需要开启自动供能此项才能生效。",

    // 机甲及尖塔设置
    // "Mech & Spire Settings": "机甲及尖塔设置",
    // "Reset Mech & Spire Settings": "机甲及尖塔设置还原",
    "Scrap mechs": "解体机甲",
    "Scrap efficiency": "解体效率",
    "Collector value": "搜集机甲价值",
    "Full bay": "机甲满舱",
    "All inefficient": "所有低效",
    "Excess inefficient": "超过低效",
    "Build mechs": "制造机甲",
    "Random good": "最佳设计",
    "Current design": "当前设计",
    "Damage Per Size": "每空间战斗力",
    "Damage Per Gems": "每宝石战斗力",
    "Damage Per Supply": "每补给战斗力",
    "Preferred mech size": "偏好的机甲尺寸",
    "Gravity mech size": "重力环境下的机甲尺寸",
    "Always": "常时",
    "Preferred": "偏好",
    "Random": "随机",
    "Never": "永不",
    "Special mechs": "特殊装备",
    "Maximum mech potential for Waygate": "进入地狱之门的机甲潜力阈值",
    "Minimum supply income": "最低补给收入",
    "Maximum collectors ratio": "搜集机甲最高比例",
    "Save up supplies for next floor": "为下一层提前积攒补给的比例",
    "Minimum scouts ratio": "侦察机甲最低比例",
    "Build infernal collectors": "是否建造地狱化搜集机甲",
    "Rebuild scouts": "是否重新建造侦察机甲",
    "Build smaller mechs when preferred not available": "当无法再建造偏好机甲时建造尺寸更小的机甲",
    "Build spire buildings only with full bay": "是否在建造尖塔建筑之前先填满剩余的机舱空间",
    "Scrap mechs only after building maximum bays": "是否在解体机甲之前先最大化建造机甲舱",
    "Mech Stats": "机甲属性计算",
    "Compact": "小型化",
    "Efficient": "补给中",
    "Special": "特殊",
    "Gravity": "重力",
    "Scouts": "侦察机甲",
    "Damage Per Size\xa0": "每空间战斗力",
    "Damage Per Supply (New)\xa0": "每补给战斗力(新)",
    "Damage Per Gems (New)\xa0": "每宝石战斗力(新)",
    "Damage Per Supply (Rebuild)\xa0": "每补给战斗力(重新制造)",
    "Damage Per Gems (Rebuild)\xa0": "每宝石战斗力(重新制造)",

    "Configures what will be scrapped. Infernal mechs won't ever be scrapped.": "设置解体机甲的情况。不会解体地狱化的机甲。",
    "Nothing will be scrapped automatically": "不自动解体机甲",
    "Scrap mechs only when mech bay is full, and script need more room to build mechs": "只在机甲舱满且需要更多机舱空间的时候解体机甲",
    "Scrap all inefficient mechs immediately, using refounded resources to build better ones": "解体所有效率低的机甲，并更换为更好的机甲。",
    "Scrap as much inefficient mechs as possible, trying to preserve just enough of old mechs to fill bay to max by the time when next floor will be reached, calculating threshold based on progress speed and resources incomes": "在保留差不多刚好能够到达下一层的机甲前提下，尽可能解体所有低效的机甲",
    "Scrap mechs only when '((OldMechRefund / NewMechCost) / (OldMechDamage / NewMechDamage))' more than given number.\nFor the cases when exchanged mechs have same size(1/3 refund) it means that with 1 eff. script allowed to scrap mechs under 33.3%. 1.5 eff. - under 22.2%, 2 eff. - under 16.6%, 0.5 eff. - under 66.6%, 0 eff. - under 100%, etc.\nEfficiency below '1' is not recommended, unless scrap set to 'Full bay', as it's a breakpoint when refunded resources can immidiately compensate lost damage, resulting with best damage growth rate.\nEfficiency above '1' is useful to save resources for more desperate times, or to compensate low soul gems income.": "只在(旧机甲返还资源/新机甲资源花费)/(旧机甲攻击力/新机甲攻击力)超过相应数字时解体机甲。",
    "Collectors can't be directly compared with combat mechs, having no firepower. Script will assume that one collector/size is equal to this amount of scout/size. If you feel that script is too reluctant to scrap old collectors - you can decrease this value. Or increase, to make them more persistant. 1 value - 50% collector equial to 50% scout, 0.5 value - 50% collector equial to 25% scout, 2 value - 50% collector equial to 100% scout, etc.": "搜集机甲没有战斗力，所以无法直接与其他机甲进行比较。脚本将以设定的比例来衡量搜集机甲的价值。如果您觉得脚本不太愿意解体旧的搜集机甲，您可以降低此数值，反之也可以提高此数值。设为1的情况下视为与侦察机甲等同战斗力，设为0.5则视为一半，设为2则视为两倍，以此类推。",
    "Configures what will be build. Infernal mechs won't ever be build.": "设置制造机甲的情况。不会制造地狱化的机甲。",
    "Nothing will be build automatically": "不自动制造机甲",
    "Build random mech with size chosen below, and best possible efficiency": "制造大小为下方选择的，效率最高的机甲",
    "Build whatever currently set in Mech Lab": "按照机甲实验室当前的设计来制造机甲",
    "Select affordable mech with most damage per size on current floor": "根据当前层的每空间战斗力，尽可能选择最佳的机甲",
    "Select affordable mech with most damage per gems on current floor": "根据当前层的每宝石战斗力，尽可能选择最佳的机甲",
    "Select affordable mech with most damage per supply on current floor": "根据当前层的每补给战斗力，尽可能选择最佳的机甲",
    "Size of random mechs": "最佳设计的机甲尺寸",
    "Override preferred size with this on floors with high gravity": "重力环境下自动制造的机甲尺寸",
    "Add special equipment to all mechs": "所有机甲都使用特殊装备",
    "Add special equipment when it doesn't reduce efficiency for current floor": "当特殊装备不降低当前层效率时使用特殊装备",
    "Special equipment will have same chance to be added as all others": "所有特殊装备都可能使用",
    "Never add special equipment": "永不使用特殊装备",
    "Configures special equip": "设置特殊装备",
    "Fight Demon Lord only when current mech team potential below given amount. Full bay of best mechs will have `1` potential. Damage against Demon Lord does not affected by floor modifiers, all mechs always does 100% damage to him. Thus it's most time-efficient to fight him at times when mechs can't make good progress against regular monsters, and waiting for rebuilding. Auto Power needs to be on for this to work.": "只在机甲潜力低于相应数值时与恶魔领主进行战斗。机甲舱充满最好设计的机甲时潜力为1。恶魔领主的强度不受楼层和武器装备影响，所以在普通敌人需要时间太久时转为攻击恶魔领主会更有效率。需要开启自动供能此项才能生效。",
    "Build collectors if current supply income below given number": "如果当前补给收入低于相应数字，则开始建造搜集机甲",
    "Limiter for above option, maximum space used by collectors": "限制上方选项的搜集机甲数量。",
    "Fill mech bays up to current limit before spending resources on additional spire buildings": "在花费资源建造尖塔建筑之前，先建造机甲填满剩余的机舱空间",
    "Scrap old mechs only when no new bays and purifiers can be builded": "只在无法建造机甲舱和空气净化器时解体机甲",
    "This switch have no ingame effect, and used to configure calculator below": "用于下方计算",
    "This input have no ingame effect, and used to configure calculator below": "用于下方计算",
    "Ratio of supplies to save up for next floor. Script will stop spending supplies on new mechs when it estimates that by the time when floor will be cleared you'll be under this supply ratio. That allows build bunch of new mechs suited for next enemy right after entering new floor. With 1 value script will try to start new floors with full supplies, 0.5 - with half, 0 - any, effectively disabling this option, etc.": "为下一层保留的补给比例。脚本将估计您在这一层剩余的时间，如果通过这一层时补给会低于这个比例，则将开始保留补给。这样您就可以在进入新一层时立刻建造最佳的机甲了。设为1则将以满补给进入下一层，设为0.5则将以一半补给进入下一层，设为0则将无视此项，以此类推。",
    "Scouts compensate terrain penalty of suboptimal mechs. Build them up to this ratio.": "侦察机甲可以抵消楼层生态对机甲的惩罚。以此比例建造它们。",
    "Infernal collectors have incresed supply cost, and payback time, but becomes more profitable after ~30 minutes of uptime.": "地狱化搜集机甲需要花费更多补给，但收益也更高，如果建造完以后可以持续30分钟左右运行，则净收益将超过普通搜集机甲。",
    "Scouts provides full bonus to other mechs even being infficient, this option prevent rebuilding them saving resources.": "侦察机甲即使在效率下降时，对其他机甲的加成也不会受到影响，此项可以阻止脚本重新建造侦察机甲，以节省资源。",
    "Build smaller mechs when preferred size can't be used due to low remaining bay space, or supplies cap": "当机舱空间不足或补给上限不足，无法制造偏好尺寸的机甲时，制造尺寸更小的机甲",
    "Enables special powering logic for Purifier, Port, Base Camp, and Mech Bays. Script will try to maximize supplies cap, building as many ports and camps as possible at best ratio, disabling mech bays when more support needed. With this cap it'll build up as many mech bays as possible, and once maximum bays is built - it'll turn them all on. This option requires Auto Build and Auto Power.": "启用空气净化器，港口，登陆营地和机甲舱专用的供能逻辑。脚本将首先最大化补给上限，以最佳比例建造港口和登陆营地，然后尽可能地建造机甲舱，之后再启用机甲舱。需要开启自动供能和自动建筑此项才能生效。",

    // 舰队设置
    // "Fleet Settings": "舰队设置",
    // "Reset Fleet Settings": "舰队设置还原",
    "Andromeda": "仙女座星云",
    "Maximize protection of prioritized systems": "优先级高的地区尽可能最大化保护",
    "Mininum knowledge for Embassy": "建造大使馆的知识阈值",
    "Mininum knowledge for Alien Gift": "研究外星礼物的知识阈值",
    "Mininum knowledge for Alien 2 Assault": "进行第五星系任务的知识阈值",
    "Chthonian Mission": "幽冥星系任务条件",
    "Manual assault": "不自动进行",
    "High casualties": "严重损失",
    "Average casualties": "一般损失",
    "Low casualties": "低损失",
    "Frigate": "损失大型护卫舰",
    "Dreadnought": "损失无畏舰",
    "Region": "地区",
    "Outer Solar": "太阳系外围",
    "Preset": "预设",
    "Minimum idle soldiers": "空闲士兵下限",
    "Minimum syndicate": "辛迪加战力下限",
    "Ships to build": "舰船建造类型",

    "Adjusts ships distribution to fully supress piracy in prioritized regions. Some potential defence will be wasted, as it will use big ships to cover small holes, when it doesn't have anything fitting better. This option is not required: all your dreadnoughts still will be used even without this option.": "会优先分配舰船给优先级高的地区以完全压制相应地区的海盗活动。可能会在大船较多小船较少时浪费舰船。即使不开启此项，无畏舰仍然会正常进行分配。",
    "Building Embassy increases maximum piracy up to 100, script won't Auto Build it until this knowledge cap is reached.": "建造大使馆后，海盗的活动会更加剧烈，因此脚本只会在到达相应数值的知识上限时进行建造。",
    "Researching Alien Gift increases maximum piracy up to 250, script won't Auto Research it until this knowledge cap is reached.": "研究外星礼物后，海盗的活动会更加剧烈，因此脚本只会在到达相应数值的知识上限时进行研究。",
    "Assaulting Alien 2 increases maximum piracy up to 500, script won't do it until this knowledge cap is reached. Regardless of set value it won't ever try to assault until you have big enough fleet to do it without loses.": "进行第五星系任务后，海盗的活动会更加剧烈，因此脚本只会在到达相应数值的知识上限时进行研究。另外，除非您能够无损伤地完成任务，否则脚本也不会自动进行此任务。",
    "Won't ever launch assault mission on Chthonian": "不会自动进行幽冥星系任务",
    "Unlock Chthonian using mixed fleet, high casualties (1250+ total fleet power, 500 will be lost)": "使用混合舰队进行幽冥星系任务，损失极大(1250以上总战力，损失500左右战力的舰队)",
    "Unlock Chthonian using mixed fleet, average casualties (2500+ total fleet power, 160 will be lost)": "使用混合舰队进行幽冥星系任务，损失一般(2500以上总战力，损失160左右战力的舰队)",
    "Unlock Chthonian using mixed fleet, low casualties (4500+ total fleet power, 80 will be lost)": "使用混合舰队进行幽冥星系任务，损失低(4500以上总战力，损失80左右战力的舰队)",
    "Unlock Chthonian loosing Frigate ship(s) (4500+ total fleet power, suboptimal for banana\\instinct runs)": "只损失大型护卫舰进行幽冥星系任务(4500以上总战力，对于香蕉共和国挑战或直觉特质的种族更好一些)",
    "Unlock Chthonian with Dreadnought suicide mission": "看着无畏舰燃烧吧",
    "Assault Chthonian when chosen outcome is achievable. Mixed fleet formed to clear mission with minimum possible wasted ships, e.g. for low causlities it can sacriface 8 scouts, or 2 corvettes and 2 scouts, or frigate, and such. Whatever will be first available. It also takes in account perks and challenges, adjusting fleet accordingly.": "当满足任务条件时自动进行幽冥星系任务。会尽可能少损失舰队，同时会考虑特权和挑战来调整舰队。",
    "Ship buildign disabled": "不建造舰船",
    "Build whatever currently set in Ship Yard": "按照船坞当前的设计来建造舰船",
    "Build ships with components configured below. All components need to be unlocked, and resulting design should have enough power": "按照下方的组件配置来建造舰船。所有的组件必须都解锁了，而且最终设计的动力必须足够",
    "Only build ships when amount of idle soldiers, excluding wounded ones, above give number.": "只在空闲士兵数量(不包括伤兵)大于此数值时建造舰船。",
    "Send ships only to regions with syndicate activity above given level.": "只对辛迪加战力超过相应数值的区域派遣舰船。",
    "Once avalable and affordable script will build ship of selected design, and send it to region with most piracy * weighting": "当舰船可以建造时，脚本将按照选项建造舰船，并派往 敌人战力*权重 最高的地区",
    "Preset ship component": "预设舰船组件",

    // 质量喷射设置
    // "Ejector, Supply & Nanite Settings": "质量喷射、补给及纳米体设置",
    // "Reset Ejector, Supply & Nanite Settings": "质量喷射、补给及纳米体设置还原",
    "Eject mode": "质量喷射模式",
    "Supply mode": "补给模式",
    "Nanite mode": "纳米体模式",
    "Capped": "达到上限",
    "Excess": "多余",
    "All": "所有",
    "Capped > Excess": "上限 > 多余",
    "Capped > Excess > All": "上限 > 多余 > 所有",
    "Stabilize blackhole": "是否稳定黑洞",
    "Atomic Mass": "原子质量",
    "Eject": "允许喷射",
    "Nanite": "纳米体用",
    "Supply Value": "补给价值",
    "Supply": "允许补给",
    "Export ": "使用",
    ", Gain ": "，获得",

    "Configures threshold when script will be allowed to use resources. With any option script will try to use most expensive of allowed resources within selected group. Craftables, when enabled, always use excess amount as threshold, having no cap.": "设置脚本使用资源的阈值。无论使用什么选项，脚本都会优先考虑价值最高的资源。若选择的是锻造物，则阈值永远为多余模式，因为它们没有上限。",
    "Use capped resources": "使用达到上限的资源",
    "Use excess resources": "使用多余的资源",
    "Use all resources. This option can prevent script from progressing, and intended to use with additional conditions.": "使用所有的资源。使用此项后可能会导致脚本进度卡顿，请谨慎使用。",
    "Use capped resources first, switching to excess resources when capped alone is not enough.": "首先使用达到上限的资源，如果资源不足，再使用多余的资源。",
    "Use capped first, then excess, then everything else. Same as 'All' option can be potentialy dungerous.": "首先使用达到上限的资源，然后使用多余的资源，最后再使用所有的资源。请注意使用此项带来的风险。",
    "Stabilizes the blackhole with exotic materials, disabled on whitehole runs": "一直选择稳定黑洞，进行黑洞重置时无效",

    // 市场设置
    // "Market Settings": "市场设置",
    // "Reset Market Settings": "市场设置还原",
    "Manual trade minimum money": "手动贸易保留的资金数量",
    "Manual trade minimum money percentage": "手动贸易保留的资金比例",
    "Trade minimum money /s": "贸易允许的每秒资金收入最低值",
    "Trade minimum money percentage /s": "贸易允许的每秒资金收入最低比例",
    "Sell excess resources": "是否出售多余的资源",
    "Manual Trades": "手动贸易",
    "Trade Routes": "贸易路线",
    "Resource": "资源名称",
    "Buy": "购买",
    "Sell": "出售",
    "In": "购买用路线数",
    "Away": "出售用路线数",
    "Ratio": "比例",
    "Priority": "优先级",
    "Galaxy Trades": "星际贸易",

    "Minimum money to keep after bulk buying": "批量购买后至少保留相应的资金数量",
    "Minimum percentage of money to keep after bulk buying": "批量购买后至少保留相应的资金比例",
    "Uses the highest per second amount of these two values. Will trade for resources until this minimum money per second amount is hit": "两项中较高的数值生效。达到每秒资金收入最低值后，才会购买资源",
    "Uses the highest per second amount of these two values. Will trade for resources until this percentage of your money per second amount is hit": "两项中较高的数值生效。达到每秒资金收入最低比例后，才会购买资源",
    "With this option enabled script will be allowed to sell resources above amounts needed for constructions or researches, without it script sell only capped resources. As side effect boughts will also be limited to that amounts, to avoid 'buy up to cap -> sell excess' loops.": "开启后将在建造或研究不需要的时候出售相应的资源，否则只会在接近上限时出售。同时，购买相应资源时也有会类似限制，以避免进入购买-出售的死循环。",
    "Galaxy Market will buy resources only when all selling materials above given ratio": "星际贸易只在所有出售的材料都高于保底产量时购买相应资源",

    // 存储设置
    // "Storage Settings": "存储设置",
    // "Reset Storage Settings": "存储设置还原",
    "Limit Pre-MAD Storage": "限制核弹重置之前阶段的存储",
    "Reassign only empty storages": "只在板条箱或集装箱有空余时进行重新分配",
    "Assign buffer storage": "是否分配缓冲用的存储",
    "Assign per buildings": "根据每种建筑分配存储",
    "Store Overflow": "是否对溢出部分分配存储",
    "Max Crates": "最大板条箱",
    "Max Containers": "最大集装箱",

    "Saves resources and shortens run time by limiting storage pre-MAD": "限制核弹重置之前阶段的存储来节省资源和相应时间",
    "Wait until storage is empty before reassigning containers to another resource, to prevent overflowing and wasting resources": "直到相应的板条箱或集装箱未装有相应资源时才考虑将它重新分配给其他资源，以防止资源溢出浪费",
    "Assigns 3% extra strorage above required amounts, ensuring that required quantity will be actually reached, even if other part of script trying to sell\\eject\\switch production, etc. When manual trades enabled applies additional adjust derieved from selling threshold.": "以超过需要数值的3%进行分配，以保证能达到所需要的数值，以避免脚本其他功能的干扰。",
    "Assign storage based on individual costs of each enabled buildings, instead of going for maximums. Allows to prioritize storages for queue and trigger, and skip assigning for unaffordable expensive buildings. Experimental feature.": "根据启用的建筑每一个的花费来分配存储，而不是考虑总量来分配。可以优先对触发器或队列等所需要的资源分配存储，并可以跳过超过储量上限的建筑。实验性的功能。",

    // 魔法设置
    // "Magic Settings": "魔法设置",
    // "Reset Magic Settings": "魔法设置还原",
    "Alchemy": "炼金术",
    "Mana income used": "法力产量使用的比例",
    "Ritual": "仪式",

    "Income portion to use on alchemy. Setting to 1 is not recommended, leftover mana will be used for rituals.": "炼金术使用的法力产量比例。不建议设为1。剩余的法力将用于仪式。",
    "Income portion to use on rituals. Setting to 1 is not recommended, as it will halt mana regeneration. Applied only when mana not capped - with capped mana script will always use all income.": "仪式使用的法力产量比例。不建议设为1，这样会使法力产量为零。只在法力未达到上限时生效，达到上限后将使用所有法力产量。",

    // 生产设置
    // "Production Settings": "生产设置",
    // "Reset Production Settings": "生产设置还原",
    "Chrysotile weighting": "温石棉权重",
    "Smelter": "冶炼厂",
    "Smelters production": "冶炼厂生产",
    "Prioritize Iron": "优先熔炼铁",
    "Prioritize Steel": "优先熔炼钢",
    "Up to full storages": "直到达到上限",
    "Up to required amounts": "直到达到需求数量",
    "Iridium ratio (The True Path)": "铱冶炼比例(智械黎明模式)",
    "Fuel": "燃料使用顺序",
    "Inferno": "炼狱燃料",
    "Wood": "木材",
    "Star": "星辰",
    "Foundry": "铸造厂",
    "Weightings adjustments": "锻造物权重",
    "Prioritize demanded": "优先制造需要的",
    "Buildings weightings": "按建筑权重",
    "Min Materials": "锻造物原料保底产量",
    "Factory": "工厂",
    "Minimum materials to preserve": "原料保底产量",
    "Mining Drone": "采矿机器人",
    "Pylon": "水晶塔",

    "Chrysotile weighting for autoQuarry, applies after adjusting to difference between current amounts of Stone and Chrysotile": "自动温石棉控制使用的权重，根据当前的石头和温石棉差值来应用权重",
    "Produce only Iron, untill storage capped, and switch to Steel after that": "只冶炼铁，直到铁达到存储上限，再切换为冶炼钢",
    "Produce as much Steel as possible, untill storage capped, and switch to Iron after that": "只冶炼钢，直到钢达到存储上限，再切换为冶炼铁",
    "Produce both Iron and Steel at ratio which will fill both storages at same time for both": "以一定的比例同时冶炼铁和钢，保证它们同时达到存储上限",
    "Produce both Iron and Steel at ratio which will produce maximum amount of resources required for buildings at same time for both": "以一定的比例同时冶炼铁和钢，保证它们同时达到建筑的需求",
    "Distribution of smelters between iron and steel": "冶炼厂冶炼铁和钢的方式",
    "Share of smelters dedicated to Iridium": "用于冶炼铱的比例",
    "Configures how exactly craftables will be weighted against each other": "控制锻造物与其他资源相比的权重",
    "Ratio between resources. Script assign craftsmans to resource with lowest 'amount / weighting'. Ignored by manual crafting.": "资源的权重。脚本会优先将工匠分配给(资源数量除以权重)较低的锻造物。手动锻造时无效。",
    "Only craft resource when storage ratio of all required materials above given number. E.g. bricks with 0.1 min materials will be crafted only when cement storage at least 10% filled.": "只在原材料大于相应比例时进行锻造。例如，将砌砖设为0.1，则只会在水泥数量超过库存上限10%的时候锻造砌砖。",
    "Use configured weightings with no additional adjustments, craftables with x2 weighting will be crafted two times more intense than with x1, etc.": "按照正常的权重制造。2倍权重的锻造物将比1倍权重的锻造物多制造1倍，以此类推。",
    "Ignore craftables once stored amount surpass cost of most expensive building, until all missing resources will be crafted. After that works as with 'none' adjustments.": "当锻造物储量超过花费最高的建筑时忽略相应锻造物，直到所有锻造物都超过了相应数值。之后与上方“无”选项效果相同。",
    "Uses weightings of buildings which are waiting for craftables, as multipliers to craftables weighting. This option requires autoBuild.": "使用需要锻造物建筑的权重，计入锻造物的权重。需要开启自动建筑此项才能生效。",
    "Factory will craft resources only when all required materials above given ratio": "工厂只在所有需要的材料都高于保底产量时制造相应产品",

    // 工作设置
    // "Job Settings": "工作设置",
    // "Reset Job Settings": "工作设置还原",
    "Set default job": "设置默认工作",
    "Final Lumberjack Weighting": "最终伐木工人权重",
    "Final Quarry Worker Weighting": "最终石工权重",
    "Final Crystal Miner Weighting": "最终水晶矿工权重",
    "Final Scavenger Weighting": "最终清道夫权重",
    "Disable miners in Andromeda": "到达仙女座星系以后禁用矿工",
    "Craft manually when possible": "如果可以的话，手动进行锻造",
    "Job": "工作",
    "1st Pass Max": "第一阈值",
    "2nd Pass Max": "第二阈值",
    "Final Max": "最终阈值",
    "Unemployed": "失业人口",
    "Hunter": "猎人",
    "Farmer": "农民",
    "Managed": "脚本自动管理",
    "Lumberjack": "伐木工人",
    "Quarry Worker": "石工",
    "Crystal Miner": "水晶矿工",
    "Scavenger": "清道夫",
    "Plywood Crafter": "胶合板工匠",
    "Brick Crafter": "砌砖工匠",
    "Wrought Iron Crafter": "锻铁工匠",
    "Sheet Metal Crafter": "金属板工匠",
    "Mythril Crafter": "秘银工匠",
    "Aerogel Crafter": "气凝胶工匠",
    "Nanoweave Crafter": "纳米织物工匠",
    "Scarletite Crafter": "绯绯色金工匠",
    "Quantium Crafter": "量子工匠",
    "Entertainer": "艺人",
    "Titan Colonist": "卫星行星居民",
    "Scientist": "科学家",
    "Professor": "教授",
    "Cement Worker": "水泥工人",
    "Miner": "矿工",
    "Coal Miner": "煤矿工人",
    "Banker": "银行家",
    "Colonist": "行星居民",
    "Space Miner": "太空矿工",
    "Hell Surveyor": "勘探者",
    "Priest": "牧师",
    "Archaeologist": "考古学家",

    "Automatically sets the default job in order of Quarry Worker -> Lumberjack -> Crystal Miner -> Scavenger -> Hunter -> Farmer": "自动以石工->伐木工人->水晶矿工->清道夫->猎人->农民的顺序设置默认工作",
    "AFTER allocating breakpoints this weighting will be used to split lumberjacks, quarry workers, crystal miners and scavengers": "用于分配伐木工人，石工，水晶矿工和清道夫的数量",
    "Disable Miners and Coal Miners after reaching Andromeda": "到达仙女座星系以后禁用矿工和煤矿工人",
    "Disable foundry crafters when manual craft is allowed": "如果可以手动进行锻造，则禁用可手动锻造资源的所有工匠",

    // 建筑设置
    // "Building Settings": "建筑设置",
    // "Reset Building Settings": "建筑设置还原",
    "Do not wait for resources without income": "忽略无产量的资源",
    "Limit amount of powered buildings": "限制需要供能的建筑数量",
    "Minimum suppression for Towers": "巨塔安全指数阈值",
    "Magnificent Shrine": "圣地种类偏好",
    "Any": "任意类型",
    "Equally": "平均分配",
    "Morale": "士气",
    "Metal": "金属",
    "Knowledge": "知识",
    "Tax": "税收",
    "Building": "建筑物",
    "Auto Build": "是否自动建造",
    "Max Build": "建造上限",
    "Auto Power": "是否自动供能",
    "All Buildings": "所有建筑物",

    "Weighting checks will ignore resources without positive income(craftables, inactive factory goods, etc), buildings with such resources will not delay other buildings.": "权重将忽略无产量的资源(例如锻造物，未进行生产的产物等)，如果有相应的建筑物需要这些资源，则不会因此影响其他建筑的建造。",
    "With this option enabled Max Build will prevent powering extra building. Can be useful to disable buildings with overrided settings.": "开启此项后，脚本只会对建造上限数量的建筑进行供能，超出部分不进行供能。可以用来限制以其他方式建造的建筑供能上限。",
    "East Tower and West Tower won't be built until minimum suppression is reached": "达到相应安全指数以后，才会开始建造西侧巨塔和东侧巨塔",
    "Build any Shrines, whenever have resources for it": "只要资源足够就建造圣地",
    "Build all Shrines equally": "平均建造所有类型的圣地",
    "Build only Morale Shrines": "只建造提升士气的圣地",
    "Build only Metal Shrines": "只建造提升金属产量的圣地",
    "Build only Knowledge Shrines": "只建造提升知识的圣地",
    "Build only Tax Shrines": "只建造提升税收的圣地",
    "Auto Build shrines only at moons of chosen shrine": "只在对应月相时建造相应的圣地",
    "Enables auto building. Triggers ignores this option, allowing to build disabled things.": "开启自动建造。触发器无视此选项。",
    "Maximum amount of buildings to build. Triggers ignores this option, allowing to build above limit. Can be also used to limit amount of enabled buildings, with respective option above.": "建造上限。触发器无视此选项。开启上方相应选项以后还可以用来限制供能的建筑数量。",
    "Script will try to spend 2x amount of resources on building having 2x weighting, and such.": "权重越高，将优先使用越多资源来进行建造",
    "First toggle enables basic automation based on priority, power, support, and consumption. Second enables logic made specially for particlular building, their effects are different, but generally it tries to behave smarter than just staying enabled all the time.": "第一个开关会根据优先级，供能情况，支持，和消耗情况来控制供能。第二个开关可以更好地根据当前情况控制特定建筑的供能。",

    // 自动建筑权重设置
    // "AutoBuild Weighting Settings": "自动建筑权重设置",
    // "Reset AutoBuild Weighting Settings": "自动建筑权重设置还原",
    "Ignore weighting and build if any storage is full": "如果任意相关资源存储已满，则忽略权重进行建造",
    "Target": "目标",
    "Condition": "条件",
    "Multiplier": "倍率",
    "New building": "新建筑",
    "Powered building": "用电建筑",
    "Power plant": "发电厂",
    "Low available energy": "电力不足",
    "Producing more energy than required": "电力过剩",
    "Knowledge storage": "知识上限建筑",
    "Have unlocked unafforable researches": "存在因知识上限不足而无法进行的研究",
    "All unlocked researches already affordable": "不存在因知识上限不足而无法进行的研究",
    "Mass Ejector": "质量喷射器",
    "Existed ejectors not fully utilized": "存在未完全运作的质量喷射器",
    "Not housing, barrack, or knowledge building": "提升人口、士兵或知识上限以外的建筑",
    "MAD prestige enabled, and affordable": "进行核爆重置，且已研究相互毁灭",
    "Freight Yard, Container Port, Munitions Depot": "货场、集装箱港口与弹药库",
    "Have unused crates or containers": "有未使用的板条箱或集装箱",
    "All fuel depots": "所有燃料存储",
    "Missing Oil or Helium for techs and missions": "进行研究或任务需要的石油或氦-3超过存储上限",
    "Building with state (city)": "需要调整供能的建筑(地面)",
    "Some instances of this building are not working": "并非所有建筑都在正常供能",
    "Building with state (space)": "需要调整供能的建筑(太空)",
    "Building with consumption": "供能物资不足的建筑",
    "Missing consumables to operate": "缺少供能物资，无法正常运转",
    "Support consumer": "需要花费支持的建筑",
    "Missing support to operate": "缺少支持，无法正常运转",
    "Support provider": "提供支持的建筑",
    "Provided support not currently needed": "提供的支持超过了目前的需求",
    "Horseshoes": "马蹄铁",
    "No more Horseshoes needed": "暂时不需要马蹄铁",
    "Meditation Chamber": "冥想室",
    "No more Meditation Space needed": "暂时不需要冥想室",
    "Gate Turret": "远古之门炮塔",
    "Gate demons fully supressed": "远古之门的恶魔已经完全压制",
    "Warehouses, Garage, Cargo Yard, Storehouse": "仓库，格纳库，星际货仓，卫星仓库",
    "Need more storage": "需要更多提供储量上限的建筑",
    "Housing": "住房",
    "Less than 90% of houses are used": "有市民居住的住房没有超过90%",

    "Ignore weighting and immediately construct building if it uses any capped resource, preventing wasting them by overflowing. Weight still need to be positive(above zero) for this to happen.": "如果建筑所使用的任意一项资源超过上限，则忽略权重立刻进行建造，以避免浪费资源。权重仍然需要设为正数(大于0)后此项才能生效。",

    // ARPA设置
    // "A.R.P.A. Settings": "ARPA设置",
    // "Reset A.R.P.A. Settings": "ARPA设置还原",
    "Scale weighting with progress": "进度权重",
    "Preferred progress step": "每次建造进度百分比",
    "Project": "项目",
    "Supercollider": "超级对撞机",
    "Stock Exchange": "证券交易所",
    "Monument": "纪念碑",
    "Railway": "铁路",
    "Launch Facility": "发射设施",
    "Nexus": "魔法回路",
    "Asteroid Redirect": "小行星变轨",
    "Mana Syphon": "法力虹吸",

    "Projects weighting scales  with current progress, making script more eager to spend resources on finishing nearly constructed projects.": "随着项目接近完成而提高权重，使脚本更优先进行接近完成的项目。",
    "Projects will be weighted and build in this steps. Increasing number can speed up constructing. Step will be adjusted down when preferred step above remaining amount, or surpass storage caps. Weightings below will be multiplied by current step. Projects builded by triggers will always have maximum possible step.": "每次建造时建造相应百分比的项目。触发器永远使用100%的百分比。",

    // 日志设置
    // "Logging Settings": "日志设置",
    // "Reset Logging Settings": "日志设置还原",
    "Script Messages": "脚本信息",
    "Enable logging": "是否启用日志，下方设置为相关日志类型",
    "Specials": "特殊",
    "Construction": "建造",
    "Multi-part Construction": "分项工程",
    "A.R.P.A Progress": "ARPA项目",
    "Research": "研究",
    "Spying": "间谍",
    "Attack": "进攻",
    "Mercenaries": "雇佣兵",
    "Mech Build": "制造机甲",
    "Mech Scrap": "解体机甲",
    "True Path Fleet": "智械黎明舰队",
    "Game Messages": "游戏信息",
    "Turn off patrol and surveyor log messages": "关闭巡逻队和勘探者相关的日志",
    "List of message IDs to filter, all game messages can be found ": "下方输入需要屏蔽的信息ID，ID列表如下：",
    "here": "点击此处",

    "Master switch to enable logging of script actions in the game message queue": "日志记录的主开关",
    "If logging is enabled then logs Specials actions": "启用后，记录特殊操作",
    "If logging is enabled then logs Construction actions": "启用后，记录建造操作",
    "If logging is enabled then logs Multi-part Construction actions": "启用后，记录分项工程建造操作",
    "If logging is enabled then logs A.R.P.A Progress actions": "启用后，记录ARPA项目建造操作",
    "If logging is enabled then logs Research actions": "启用后，记录研究操作",
    "If logging is enabled then logs Spying actions": "启用后，记录间谍活动",
    "If logging is enabled then logs Attack actions": "启用后，记录进攻行为",
    "If logging is enabled then logs Mercenaries actions": "启用后，记录雇佣兵操作",
    "If logging is enabled then logs Mech Build actions": "启用后，记录制造机甲操作",
    "If logging is enabled then logs Mech Scrap actions": "启用后，记录解体机甲操作",
    "If logging is enabled then logs True Path Fleet actions": "启用后，记录智械黎明舰队操作",
    "Automatically turns off the hell patrol and surveyor log messages": "自动关闭巡逻队和勘探者相关的日志",

    // 种族
    "Script Managed": "由脚本管理",
    // "Auto Achievements": "自动完成成就",
    /*
    "Antid": "蚂蚁人",
    "Mantis": "螳螂人",
    "Scorpid": "蝎子",
    "Human": "人类",
    "Orc": "兽人",
    "Elf": "精灵",
    "Troll": "巨魔",
    "Ogre": "食人魔",
    "Cyclops": "独眼巨人",
    "Kobold": "狗头人",
    "Goblin": "哥布林",
    "Gnome": "侏儒",
    "Cath": "猫族",
    "Wolven": "狼人",
    "Centaur": "人马",
    "Balorg": "炎魔",
    "Imp": "小恶魔",
    "Seraph": "大天使",
    "Unicorn": "独角兽",
    "Arraak": "陆行鸟",
    "Pterodacti": "翼手龙",
    "Dracnid": "天龙",
    "Tortoisan": "乌龟人",
    "Gecko": "壁虎",
    "Slitheryn": "娜迦",
    "Sharkin": "鲨鱼人",
    "Octigoran": "八爪鱼",
    "Ent": "树人",
    "Cacti": "仙人掌",
    "Pinguicula": "捕虫堇",
    "Sporgar": "孢子虫",
    "Shroomi": "蘑菇人",
    "Moldling": "霉菌人",
    "Valdi": "瓦尔迪",
    "Dryad": "树妖",
    "Satyr": "萨提尔",
    "Phoenix": "不死鸟",
    "Salamander": "火蜥蜴",
    "Yeti": "雪怪",
    "Wendigo": "温迪戈",
    "Tuskin": "獠牙人",
    "Kamel": "骆驼人",
    "Custom": "自建种族",
    */

    // 宇宙
    /*
    "Standard": "标准宇宙",
    "Heavy": "高引力宇宙",
    "Antimatter": "反物质宇宙",
    "Evil": "邪恶宇宙",
    "Micro": "微型宇宙",
    "Magic": "魔法宇宙",
    */

    // 星球
    // "Most habitable": "最宜居",
    // "Most achievements": "最多成就",
    // "Highest weighting": "最高权重",

    // 地区
    "Alien 1 System": "第四星系",
    "Alien 2 System": "第五星系",

    // 资源
    /*
    "Orichalcum": "奥利哈刚",
    "Vitreloy": "金属玻璃",
    "Bolognium": "钋",
    "Nano Tube": "纳米管",
    "Stanene": "超导体",
    "Graphene": "石墨烯",
    "Adamantite": "精金",
    "Helium-3": "氦-3",
    "Iridium": "铱",
    "Polymer": "聚合物",
    "Alloy": "合金",
    "Titanium": "钛",
    "Steel": "钢",
    "Uranium": "铀",
    "Oil": "石油",
    "Coal": "煤",
    "Cement": "水泥",
    "Aluminium": "铝",
    "Iron": "铁",
    "Copper": "铜",
    "Furs": "皮毛",
    "Crystal": "水晶",
    "Stone": "石头/琥珀",
    "Lumber": "木头",
    "Chrysotile": "温石棉",
    "Food": "食物",
    "Money": "资金",
    "Water": "水",
    "Deuterium": "氘",
    "Neutronium": "中子",
    "Infernite": "地狱石",
    "Elerium": "超铀",
    "Plywood": "胶合板",
    "Brick": "砌砖",
    "Wrought Iron": "锻铁",
    "Sheet Metal": "金属板",
    "Mythril": "秘银",
    "Aerogel": "气凝胶",
    "Nanoweave": "纳米织物",
    "Scarletite": "绯绯色金",
    "Quantium": "量子",

    // 建筑物
    // 郊外
    "Slave Market": "奴隶市场",
    "Sacrificial Altar": "祭坛",

    // 住宅区
    "Cabin": "小木屋",
    "Cottage": "茅屋",
    "Apartment": "公寓",
    "Farm": "农场",
    "Compost Heap": "堆肥箱",
    "Lodge": "小屋",

    // 商业区
    "Slave Pen": "奴隶围栏",
    "Bank": "银行",
    "Tourist Center": "旅游中心",
    "Amphitheatre": "圆形剧场",
    "Casino": "赌场",
    "Temple": "寺庙",
    "Shrine": "神社",

    // 科学部门
    "University": "大学",
    "Library": "图书馆",
    "Wardenclyffe": "沃登克里弗塔",
    "Bioscience Lab": "生命科学实验室",

    // 军事设施
    "Barracks": "军营",
    "Hospital": "医院",
    "Boot Camp": "新兵训练营",

    // 贸易区
    "Grain Silo": "粮仓",
    "Smokehouse": "烟房",
    "Soul Well": "灵魂井",
    "Shed": "窝棚",
    "Freight Yard": "货场",
    "Container Port": "集装箱港口",
    "Fuel Depot": "燃料库",
    "Trade Post": "贸易站",
    "Wharf": "码头",

    // 工业区
    "Pylon": "水晶塔",
    "Graveyard": "墓地",
    "Lumber Yard": "伐木场",
    "Sawmill": "锯木厂",
    "Rock Quarry": "采石场",
    "Cement Factory": "水泥厂",
    "Foundry": "铸造厂",
    "Factory": "工厂",
    "Smelter": "冶炼厂",
    "Metal Refinery": "金属精炼厂",
    "Mine": "矿井",
    "Coal Mine": "煤矿",
    "Oil Derrick": "石油井架",

    // 公共事业部门
    "Mill (Good Windmill)": "磨坊（非邪恶种族的风车）",
    "Windmill (Evil only)": "风车（邪恶种族）",
    "Coal Powerplant": "煤电厂",
    "Oil Powerplant": "石油发电厂",
    "Fission Reactor": "裂变反应堆",
    "Mass Driver": "质量驱动器",

    // 家园行星
    "Test Launch": "试射",
    "Space Satellite": "人造卫星",
    "Space Gps": "GPS卫星",
    "Space Propellant Depot": "推进剂库",
    "Space Navigation Beacon": "导航灯塔",

    // 月球
    "Moon Mission": "月球任务",
    "Moon Base": "月球基地",
    "Moon Iridium Mine": "铱矿",
    "Moon Helium-3 Mine": "氦-3矿",
    "Moon Observatory": "月球观测站",

    // 红色行星
    "Red Mission": "红色行星任务",
    "Red Spaceport": "太空港",
    "Red Space Control": "航天控制",
    "Red Living Quarters": "生活区",
    "Red VR Center": "VR中心",
    "Red Garage": "格纳库",
    "Red Mine": "红色行星矿井",
    "Red Fabrication": "红色行星铸造厂",
    "Red Factory": "红色行星工厂",
    "Red Biodome": "生物穹顶",
    "Red Exotic Materials Lab": "外星材料实验室",
    "Red Ziggurat": "通灵塔",
    "Red Marine Barracks": "太空驻军",

    // 地狱行星
    "Hell Mission": "地狱行星任务",
    "Hell Geothermal Plant": "地热发电厂",
    "Hell Space Casino": "太空赌场",
    "Hell Swarm Plant": "蜂群工厂",

    // 太阳
    "Sun Mission": "太阳任务",
    "Sun Control Station": "蜂群卫星控制站",
    "Sun Swarm Satellite": "蜂群卫星",

    // 气态巨星
    "Gas Mission": "气态巨星任务",
    "Gas Helium-3 Collector": "氦-3收集器",
    "Gas Fuel Depot": "星系燃料库",
    "Gas Space Dock": "星际船坞",
    "Gas Space Probe": "太空探测器",
    "Gas Bioseeder Ship Segment": "生物播种船",

    // 气体巨行星
    "Gas Moon Mission": "气态巨星卫星任务",
    "Gas Moon Mining Outpost": "采矿前哨",
    "Gas Moon Mining Drone": "采矿无人机",
    "Gas Moon Oil Extractor": "石油提取器",


    // 小行星带
    "Belt Mission": "小行星带任务",
    "Belt Space Station": "深空采矿站",
    "Belt Elerium Mining Ship": "超铀采矿船",
    "Belt Iridium Mining Ship": "铱采矿船",
    "Belt Iron Mining Ship": "铁采矿船",

    // 矮行星
    "Dwarf Mission": "矮行星任务",
    "Dwarf Elerium Storage": "超铀存储",
    "Dwarf Elerium Reactor": "超铀反应堆",
    "Dwarf World Collider": "世界超级对撞机",
    "Dwarf WSC Control": "世界超级对撞机控制器",

    // 半人马座α星系
    "Alpha Centauri Mission": "半人马座α星系任务",
    "Alpha Starport": "星际港口",
    "Alpha Habitat": "定居点",
    "Alpha Mining Droid": "采矿机器人",
    "Alpha Processing": "精金加工设施",
    "Alpha Fusion": "聚变反应堆",
    "Alpha Laboratory": "深空实验室",
    "Alpha Exchange": "星际交易所",
    "Alpha Factory": "石墨烯厂",
    "Alpha Warehouse": "半人马座α星系仓库",
    "Alpha Mega Factory": "大型工厂",
    "Alpha Luxury Condo": "豪华公寓",
    "Alpha Exotic Zoo": "异族动物园",

    // 比邻星
    "Proxima Mission": "比邻星任务",
    "Proxima Transfer Station": "星际转运站",
    "Proxima Cargo Yard": "星际货仓",
    "Proxima Cruiser": "巡逻艇",
    "Proxima Dyson": "戴森网",
    "Proxima Dyson Sphere": "戴森球",
    "Proxima Orichalcum Sphere": "奥利哈刚戴森球",

    // 螺旋星云
    "Nebula Mission": "螺旋星云任务",
    "Nebula Nexus": "星际枢纽站",
    "Nebula Harvester": "气体收集器",
    "Nebula Elerium Prospector": "超铀开采器",

    // 中子星
    "Neutron Mission": "中子星任务",
    "Neutron Miner": "中子矿船",
    "Neutron Citadel Station": "AI中枢要塞",
    "Neutron Stellar Forge": "恒星熔炉",

    // 黑洞
    "Blackhole Mission": "黑洞任务",
    "Blackhole Far Reach": "遥远星际",
    "Blackhole Stellar Engine": "恒星引擎",
    "Blackhole Mass Ejector": "质量喷射器",
    "Blackhole Jump Ship": "跃迁飞船",
    "Blackhole Wormhole Mission": "虫洞任务",
    "Blackhole Stargate": "星际之门",
    "Blackhole Completed Stargate": "完成建造的星际之门",

    // 天狼星
    "Sirius Mission": "天狼星",
    "Sirius B Analysis": "天狼星B研究计划",
    "Sirius Space Elevator": "轨道电梯",
    "Sirius Gravity Dome": "重力穹顶",
    "Sirius Ascension Machine": "飞升装置",
    "Sirius Ascension Trigger": "开始飞升",
    "Sirius ThermalCollector": "集热器",

    // 仙女座

    // 堡垒
    "Portal Laser Turret": "激光炮塔",
    "Portal Surveyor Carport": "勘探车",
    "Portal War Droid": "战斗机器人",
    "Portal Repair Droid": "维修机器人",

    // 废土
    "Portal Predator Drone": "掠食者无人机",
    "Portal Sensor Drone": "探测无人机",
    "Portal Attractor Beacon": "吸引器信标",

    // 陨石坑
    "Portal Pit Mission": "探索陨石坑",
    "Portal Soul Forge": "防卫陨石坑",
    "Portal Soul Attractor": "灵魂锻炉",
    "Portal Gun Emplacement": "自动炮台",
    "Portal AssaultForge": "灵魂引渡器",

    // 遗迹
    "Portal East Tower": "东侧巨塔",
    "Portal West Tower": "西侧巨塔",

    // 未知建筑（请补充归类一下）
    "Portal Inferno Reactor": null,
    "Portal Arcology": null,
    "Alpha Processing Facility": null,
    "Alpha Graphene Plant": null,
    "Moon Launch": null,
    "Sirius Thermal Collector": null,
    "Gateway Mission": null,
    "Gateway Starbase": null,
    "Gateway Ship Dock": null,
    "Stargate Station": null,
    "Stargate Telemetry Beacon": null,
    "Gateway Dreadnought": null,
    "Gateway Cruiser Ship": null,
    "Gateway Frigate Ship": null,
    "Gateway Bolognium Ship": null,
    "Gateway Corvette Ship": null,
    "Gateway Scout Ship": null,
    "Gorddon Mission": null,
    "Gorddon Embassy": null,
    "Gorddon Dormitory": null,
    "Gorddon Symposium": null,
    "Gorddon Freighter": null,
    "Alien 1 Consulate": null,
    "Alien 1 Resort": null,
    "Alien 1 Vitreloy Plant": null,
    "Alien 1 Super Freighter": null,
    "Alien 2 Foothold": null,
    "Alien 2 Scavenger": null,
    "Alien 2 Armed Miner": null,
    "Alien 2 Ore Processor": null,
    "Chthonian Mine Layer": null,
    "Chthonian Excavator": null,
    "Chthonian Raider": null,
    "Blackhole Farpoint": null,
    "Cement Plant": null,
    "Stargate Defense Platform": null,
    "Stargate Depot": null,
    "Portal Ancient Pillars": null,
    "Portal Survey Ruins": null,
    "Portal Guard Post": null,
    "Portal Vault": null,
    "Portal Archaeology": null,
    "Portal Infernal Forge": null,
    "Portal Gate Turret": null,
    "Portal Infernite Mine": null,
*/

    // 杂项
    "Auto Eject": "是否自动喷射",
    "Auto Supply": "是否自动补给",
    "Enable ejecting of this resource. When to eject is set in the Prestige Settings tab.": "允许喷射此项资源。进行喷射的时机在威望重置设置下。",
    "Enable supply of this resource.": "允许使用此项资源进行补给。",
    "Enable buying of this resource.": "允许购买此项资源。",
    "Enable selling of this resource.": "允许出售此项资源。",
    "Enable trading for this resource.": "允许使用贸易路线购买此项资源。",
    "Enable trading this resource away.": "允许使用贸易路线出售此项资源。",
    "Enable storing of this resource.": "允许此项资源的存储分配。",
    "Enable storing overflow of this resource.": "允许此项资源对溢出部分的存储分配。",
};
console.log(Object.keys(CNZ_MAP).length)
/*
(function() {

    console.log("TMVictor（新）汉化开始");

    sidebarListener();
    settingsListener();
    resourceListener();
})();

function sidebarListener() {

    setInterval(function() {

        // 获取侧边栏
        var item = $("#autoScriptContainer");

        // 获取到侧边栏才进行汉化
        if(item.length === 1) {

            // 汉化侧边栏
            textCH(item);

            // 汉化侧边栏的威望重置弹窗
            textCH($("#scriptModal"));
        }

    }, LISTENER_TIME);
}

function settingsListener() {

    setInterval(function() {

        // 获取脚本设置选项
        var item = $("#script_settings");

        // 获取到脚本设置选项才进行汉化
        if(item.length === 1) {

            //建筑名单独汉化
            //buildingNameTextCH();

            //建立建筑名英汉对照框
            //triggerBuildingNameTextCH();

            // 汉化脚本设置
            textCH(item);
        }
    }, LISTENER_TIME);
}

function resourceListener() {

    setInterval(function() {

        // 获取脚本设置选项
        var item = $("#mTabResource");

        // 获取到脚本设置选项才进行汉化
        if(item.length === 1) {

            // 汉化脚本设置
            textCH(item);
        }
    }, LISTENER_TIME);
}

function textCH(target) {

    // 获取目标元素中所有的子元素
    var settingsElems = $(target).find("*");

    // 遍历子元素，汉化其中的title属性和文本内容
    settingsElems.each(function(index, e) {

        // 标签汉化
        var title = $(e).attr('title');
        if (title) {

            var titleCH = CNZ_MAP[title];
            titleCH ? $(e).attr('title', titleCH) : null;
        }

        // 汉化当前节点下所有Text类型（nodeType==3）的子节点
        $(e).contents().filter(function () {
            return this.nodeType == 3;
        }).each(function () {
            var nodeValueCH = CNZ_MAP[this.nodeValue];
            nodeValueCH ? this.nodeValue = nodeValueCH : null;
        })
    });
}

function specialTextCH() {

    $("#s-quick-prestige-options").contents().filter(function(){
        return this.nodeType == 3;
    })[0].nodeValue = '威望重置选项';
}


var buildingCNNameObj = {};
var buildingENNameObj = {};
//建筑名汉化
function buildingNameTextCH()
{
    var buildingList = document.getElementById("script_buildingTableBody").childNodes;

    //防止重复汉化
    //if(document.querySelector("#script_portal-infernite_mineToggle > span").innerText == "地狱石矿井") return;

    for(var i = 1; i < buildingList.length; i++)
    {
        tempA = buildingList[i].getAttribute("value");
        tempL = tempA.indexOf('-')
        tempB1 = tempA.substr(0,tempL)
        tempB2 = tempA.substr(tempL+1)
        var tempTitle
        var tempTitleStr
        if(typeof(evolve.actions[tempB1][tempB2])  == "undefined")
        {
            var tempSubObList = Object.keys(evolve.actions[tempB1]);
            for(var j = 0; j < tempSubObList.length; j++)
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

        if(typeof(tempTitle) == "function")
            tempTitleStr = tempTitle()
        else
            tempTitleStr = tempTitle

        //保存建筑名对照表
        if(typeof(buildingCNNameObj[tempTitleStr]) == "undefined")
        {
           buildingCNNameObj[tempTitleStr] = buildingList[i].getElementsByTagName("span")[0].innerText
           buildingENNameObj[buildingList[i].getElementsByTagName("span")[0].innerText] = tempTitleStr
        }

        //赋值
        buildingList[i].getElementsByTagName("span")[0].innerText = tempTitleStr

        delete tempTitle
        delete tempTitleStr
    }
    //为特殊建筑手动添加对照
    buildingCNNameObj["尖塔"] = "Spire Tower"
    buildingENNameObj["Spire Tower"] = "尖塔"

    buildingCNNameObj["奥利哈刚戴森球"] = "Proxima Dyson Sphere (Orichalcum)"
    buildingENNameObj["Proxima Dyson Sphere (Orichalcum)"] = "奥利哈刚戴森球"
    buildingCNNameObj["戴森球"] = "Proxima Dyson Sphere (Bolognium)"
    buildingENNameObj["Proxima Dyson Sphere (Bolognium)"] = "戴森球"

    buildingCNNameObj["风车（邪恶种群）"] = "Windmill (Evil)"
    buildingENNameObj["Windmill (Evil)"] = "风车（邪恶种群）"
    buildingCNNameObj["风车"] = "Windmill"
    buildingENNameObj["Windmill"] = "风车"

}

function triggerBuildingNameTextCH()
{
    if(document.querySelector("#buildingCNTextField") != null)
        return;
    var buildingCNTextField = document.createElement("div")
    buildingCNTextField.setAttribute("id", "buildingCNTextField")
    buildingCNTextField.setAttribute("style", "margin-top: 10px; margin-bottom: 10px;")
    buildingCNTextField.innerHTML =
        '<a style="width:16%">输入或显示建筑中文名</a>'+
        '<a style="width:18%"><input id="buildingCNTextName"></a>'+
        '<a style="width:11%"></a>'+
        '<a style="width:16%">输入或显示建筑英文名</a>'+
        '<a style="width:18%"><input id="buildingENTextName"></a>'+
        '<a style="width:21%"></a>'

    document.querySelector("#script_triggerContent").insertBefore(buildingCNTextField,document.querySelector("#script_triggerContent").firstChild)
    //中文名列表
    $('#buildingCNTextName').on('click', function () {
        if(!($('#buildingCNTextName').hasClass("ui-autocomplete-input")))
        {
            $('#buildingCNTextName').autocomplete({
                source: Object.keys(buildingCNNameObj),
                delay: 0,
                select: function (event, ui) {
                    $('#buildingENTextName').val(buildingCNNameObj[ui.item.value])
                }
            });
        }
    });
    //英文名列表
    $('#buildingENTextName').on('click', function () {
        if(!($('#buildingENTextName').hasClass("ui-autocomplete-input")))
        {
            $('#buildingENTextName').autocomplete({
                source: Object.keys(buildingENNameObj),
                delay: 0,
                select: function (event, ui) {
                    $('#buildingCNTextName').val(buildingENNameObj[ui.item.value])
                }
            });
        }
    });
}
*/
