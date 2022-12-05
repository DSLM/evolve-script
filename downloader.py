import requests
url = 'https://gist.github.com/Vollch/b1a5eec305558a48b7f4575d317d7dd1/raw/eb64f7a4e6c1de02fc696763b818dedf8326f585/evolve_automation.user.js'
res = requests.get(url)

newFile = open('evolve_automation.user.js', 'w', encoding="utf-8")
newFile.write(res.text)
