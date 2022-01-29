import requests

achiFile = open('./traits/evolve_traits.user.js', 'w', encoding="utf-8")
codeFile = open('./traits/evolve_traits_pre.user.js', 'r', encoding="utf-8")
addedStr = ""

url = 'https://raw.githubusercontent.com/pmotschmann/Evolve/master/src/races.js'
res = requests.get(url)

sourData = res.text.find("const traits = {")
endIndex = sourData + len("const traits = {")
brackets = 1
while brackets > 0:
    if res.text[endIndex] == "{":
        brackets += 1
    elif res.text[endIndex] == "}":
        brackets -= 1
    endIndex += 1
addedStr += res.text[sourData : endIndex].replace("\n","\n\t").replace("global","evolve.global") +"\n\t"

achiFile.write(codeFile.read().replace("//此处插入数据",addedStr))
