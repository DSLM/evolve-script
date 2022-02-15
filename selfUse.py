# coding=utf-8

oldFile = open("evolve_automation_by22dgb.user.js", "r", encoding="utf-8")
newFile = open("evolve_automation_DSLM.user.js", "w", encoding="utf-8")

content = oldFile.read()

replaceLsit = {
    "// @downloadURL  https://gitee.com/by22dgb/evolvescript/raw/master/evolve_automation.user.js" : "// @downloadURL  https://github.com/DSLM/evolve-script/raw/master/evolve_automation_DSLM.user.js",
    "// ==/UserScript==" : "// ==/UserScript==\n//炼钢、冶炼和石墨烯厂会在需求资源储量可以支撑运作10秒以上时继续运作而非关闭\n//让部分背景色随主题变化",

    #炼钢，冶炼，石墨烯厂
    "if (resource.storageRatio < 0.8" : "if (resource.storageRatio < 0.8 && ((resource.currentQuantity/resource.rateOfChange)>-10 && (resource.currentQuantity/resource.rateOfChange)<0)",
    #背景色
    "background-color: #1f2424;" : "border: #ccc solid 0.0625rem;",
    '<div class="script-modal-content">' : '<div class="script-modal-content resource alt">',
    'class="script-collapsible text-center has-text-success"' : 'class="script-collapsible text-center has-text-success resource alt"',
    '' : '',
    '' : '',
    '' : '',
    '' : '',
    '' : '',
    '' : '',
    '' : '',
    '' : '',
    '' : '',
    '' : '',
    '' : '',
    '' : '',
    '' : '',
    '' : '',
    '' : '',
    '' : '',
    '' : '',
    '' : '',
    '' : '',
    '' : '',
    '' : ''
    }

for key in replaceLsit.keys():
    content = content.replace(key,replaceLsit[key])

newFile.write(content)



oldFile.close()
newFile.close()
