import requests
url = 'https://gitee.com/by22dgb/evolvescript/raw/master/evolve_automation.user.js'
res = requests.get(url)
if res.status_code == 200:
    newFile = open('evolve_automation_by22dgb.user.js', 'w', encoding="utf-8")
    newFile.write(res.text)
