// ==UserScript==
// @name         世界超级对撞机队列
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  try to take over the world!
// @downloadURL  https://github.com/DSLM/evolve-script/raw/master/evolve_world_controller.user.js
// @author       DSLM
// @match        https://g8hh.github.io/evolve/
// @match        https://pmotschmann.github.io/Evolve/
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function($) {
    'use strict';

    //机甲
	var WC_times = 0
	var WC;

	//初始化
	WC = window.setInterval(SeqCollider, 5000);

    function SeqCollider()
    {
		WC_times = WC_times + 1;
		//判断是否需要初始化
		if(WC_times > 500)
		{
			var WC_temp = WC
			WC_times = 0;
			WC = window.setInterval(SeqCollider, 5000);
			clearInterval(WC_temp)
			return;
		}
        try
        {
            if(evolve.global.space.world_controller.count > 0)
            {
                clearInterval(WC)
                return;
            }

            if(evolve.global.space.world_collider.count < 10)
                return;
        }
        catch(err)
        {
            return;
        }

        document.dispatchEvent(new KeyboardEvent("keydown", {key: evolve.global.settings.keyMap.q}));
        document.dispatchEvent(new KeyboardEvent("keydown", {key: evolve.global.settings.keyMap.x25}));
        document.dispatchEvent(new KeyboardEvent("keydown", {key: evolve.global.settings.keyMap.x100}));
        document.querySelector("#space-world_collider > a.button > span.aTitle").click();

        document.dispatchEvent(new KeyboardEvent("keyup", {key: evolve.global.settings.keyMap.q}));
        document.dispatchEvent(new KeyboardEvent("keyup", {key: evolve.global.settings.keyMap.x25}));
        document.dispatchEvent(new KeyboardEvent("keyup", {key: evolve.global.settings.keyMap.x100}));


    }
})(jQuery);
