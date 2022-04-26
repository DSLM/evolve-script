// ==UserScript==
// @name         蜂群建造
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  try to take over the world!
// @downloadURL  https://github.com/DSLM/evolve-script/raw/master/evolve_swarm_satellite.user.js
// @author       DSLM
// @match        https://g8hh.github.io/evolve/
// @match        https://wdjwxh.github.io/Evolve-Scripting-Edition/
// @match        https://wdjwxh.gitee.io/evolve-scripting-edition/
// @match        https://tmvictor.github.io/Evolve-Scripting-Edition/
// @match        https://pmotschmann.github.io/Evolve/
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function($) {
    'use strict';

	var SS_times = 0;
	var SS;

    let whichKeys = {1:{},
                    10:{10:true},
                    25:{25:true},
                    100:{100:true},
                    250:{10:true, 25:true},
                    1000:{10:true, 100:true},
                    2500:{25:true, 100:true},
                    25000:{10:true, 25:true, 100:true}};
    let sizes = Object.keys(whichKeys);

	//初始化
	SS = window.setInterval(swarmSatellite, 5000);

    function swarmSatellite()
    {
		SS_times = SS_times + 1;
		//判断是否需要初始化
		if(SS_times > 500)
		{
			var SS_temp = SS
			SS_times = 0;
			SS = window.setInterval(swarmSatellite, 5000);
			clearInterval(SS_temp)
			return;
		}
        try
        {
            if(evolve.actions.space.spc_sun.swarm_satellite.cost.Money() > 0)
                return;
        }
        catch(err)
        {
            return;
        }

        let pressKeys = [];
        for (let i = sizes.length - 1; i >= 0; i--)
        {
            if(evolve.actions.space.spc_sun.swarm_satellite.cost.Money(Number(sizes[i])) == 0)
            {
                pressKeys = whichKeys[sizes[i]];
                break;
            }
        }

        if(pressKeys == [])
        {
            return;
        }

        if(pressKeys[10])
            document.dispatchEvent(new KeyboardEvent("keydown", {key: evolve.global.settings.keyMap.x10}));
        if(pressKeys[25])
            document.dispatchEvent(new KeyboardEvent("keydown", {key: evolve.global.settings.keyMap.x25}));
        if(pressKeys[100])
            document.dispatchEvent(new KeyboardEvent("keydown", {key: evolve.global.settings.keyMap.x100}));
        document.getElementById("space-swarm_satellite").__vue__.action();

        document.dispatchEvent(new KeyboardEvent("keyup", {key: evolve.global.settings.keyMap.x10}));
        document.dispatchEvent(new KeyboardEvent("keyup", {key: evolve.global.settings.keyMap.x25}));
        document.dispatchEvent(new KeyboardEvent("keyup", {key: evolve.global.settings.keyMap.x100}));


    }
})(jQuery);
