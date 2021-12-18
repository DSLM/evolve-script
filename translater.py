# coding=utf-8

oldFile = open("evolve_automation.user.js", "r", encoding="utf-8")
newFile = open("evolve_automation_chinese.user.js", "w", encoding="utf-8")

content = oldFile.read()

replaceLsit = {
    #开头
    'https://gist.github.com/Vollch/b1a5eec305558a48b7f4575d317d7dd1/raw/evolve_automation.user.js':'https://github.com/DSLM/evolve-script/raw/master/evolve_automation_chinese.user.js',
    '// @match        https://pmotschmann.github.io/Evolve/':'''// @match        https://pmotschmann.github.io/Evolve/
// @match        https://likexia.gitee.io/evolve/''',
    '// This script forked from TMVictor\'s script version 3.3.1. Original script: https://gist.github.com/TMVictor/3f24e27a21215414ddc68842057482da':'// This script forked from TMVictor\'s script version 3.3.1. Original script: https://gist.github.com/TMVictor/3f24e27a21215414ddc68842057482da\n// Removed downloadURL in case that script got screwed up. Original downloadURL: @downloadURL  https://gist.github.com/Vollch/b1a5eec305558a48b7f4575d317d7dd1/raw/evolve_automation.user.js',

    #资源
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

    #种族警告
    '>This race have special requirements:':'>此种族的特殊要求为：',
    '. This condition is met.':'。当前满足此条件。',
    '>Warning! This race have special requirements:':'>警告！此种族的特殊要求为：',
    '. This condition is not met.':'。当前不满足此条件。',
    '. This condition is bypassed. Race will have ${100 - suited * 100}% penalty.':'。当前可使用此种族，但受到 ${100 - suited * 100}% 的产量惩罚。',
    '''case "aquatic":
        return "Oceanic planet";
    case "fey":
        return "Forest planet";
    case "sand":
        return "Desert planet";
    case "heat":
        return "Volcanic planet";
    case "polar":
        return "Tundra planet";
    case "demonic":
        return "Hellscape planet";
    case "angelic":
        return "Eden planet";''':
        '''case "aquatic":
            return "海洋星球";
        case "fey":
            return "森林星球";
        case "sand":
            return "沙漠星球";
        case "heat":
            return "火山星球";
        case "polar":
            return "苔原星球";
        case "demonic":
            return "地狱星球";
        case "angelic":
            return "伊甸园星球";''',

    #侧边栏高级设置
    ">Variable 1<": ">变量1<",
    ">Check<": ">运算<",
    ">Variable 2<": ">变量2<",
    ">Result<": ">结果<",
    ">Value<": ">值<",
    '>Type<':'>类型<',
    '''"AND": (a, b) => a && b,
    "OR": (a, b) => a || b,
    "NOR": (a, b) => !(a || b),
    "NAND": (a, b) => !(a && b),
    "XOR": (a, b) => !a != !b,
    "XNOR": (a, b) => !a == !b,
    "AND!": (a, b) => a && !b,
    "OR!": (a, b) => a || !b,''':
    '''"与": (a, b) => a && b,
    "或": (a, b) => a || b,
    "或非": (a, b) => !(a || b),
    "与非": (a, b) => !(a && b),
    "异或": (a, b) => !a != !b,
    "同或": (a, b) => !a == !b,
    "与(变量2取非)": (a, b) => a && !b,
    "或(变量2取非)": (a, b) => a || !b,''',
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


    '':'',
    '':'',
    '':'',

    #硬编码汉化部分
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

    #将翻译代码注入脚本
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
