# coding=utf-8

oldFile = open("evolve_automation_by22dgb.user.js", "r", encoding="utf-8")
newFile = open("evolve_automation_DSLM.user.js", "w", encoding="utf-8")

content = oldFile.read()

replaceLsit = {
    "// @downloadURL  https://gitee.com/by22dgb/evolvescript/raw/master/evolve_automation.user.js" : "// @downloadURL  https://github.com/DSLM/evolve-script/raw/master/evolve_automation_DSLM.user.js",
    "// ==/UserScript==" : "// ==/UserScript==\n//炼钢、冶炼和石墨烯厂会在需求资源储量大于10万时继续运作而非关闭",

    #炼钢，冶炼，石墨烯厂
    "if (resource.storageRatio < 0.8" : "if (resource.storageRatio < 0.8 && resource.currentQuantity < 100000",
    "" : "",
    "" : "",
    "" : ""
    }

for key in replaceLsit.keys():
    content = content.replace(key,replaceLsit[key])

newFile.write(content)



oldFile.close()
newFile.close()
