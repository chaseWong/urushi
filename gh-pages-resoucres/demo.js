
(function () {
	'use strict';
	var header, onscroll, contextItems, contextItem, localeChangeItem, key, itemCallback, callbackFnc;

	// 画面情報
	var screens = {
		'index' : {
			'id' : 'index',
			'name' : 'DEMO TOP',
			'path' : './',
			'screenFileNm' : 'index'
		},
		'alert' : {
			'id' : 'alert',
			'name' : 'ALERT',
			'path' : '../alert/',
			'screenFileNm' : 'alert'
		},
		'button' : {
			'id' : 'button',
			'name' : 'BUTTON',
			'path' : '../button/',
			'screenFileNm' : 'button'
		},
		'checkbox' : {
			'id' : 'checkbox',
			'name' : 'CHECKBOX',
			'path' : '../checkbox/',
			'screenFileNm' : 'checkbox'
		},
		'contextmenu' : {
			'id' : 'contextmenu',
			'name' : 'CONTEXTMENU',
			'path' : '../contextmenu/',
			'screenFileNm' : 'contextmenu'
		},
		'dialog' : {
			'id' : 'dialog',
			'name' : 'DIALOG',
			'path' : '../dialog/',
			'screenFileNm' : 'dialog'
		},
		'dropdown' : {
			'id' : 'dropdown',
			'name' : 'DROPDOWN',
			'path' : '../dropdown/',
			'screenFileNm' : 'dropdown'
		},
		'hamburger' : {
			'id' : 'hamburger',
			'name' : 'HAMBURGER',
			'path' : '../hamburger/',
			'screenFileNm' : 'hamburger'
		},
		'input' : {
			'id' : 'input',
			'name' : 'INPUT',
			'path' : '../input/',
			'screenFileNm' : 'input'
		},
		'panel' : {
			'id' : 'panel',
			'name' : 'PANEL',
			'path' : '../panel/',
			'screenFileNm' : 'panel'
		},
		'radio' : {
			'id' : 'radio',
			'name' : 'RADIO',
			'path' : '../radio/',
			'screenFileNm' : 'radio'
		},
		'textarea' : {
			'id' : 'textarea',
			'name' : 'TEXTAREA',
			'path' : '../textarea/',
			'screenFileNm' : 'textarea'
		},
		'toast' : {
			'id' : 'toast',
			'name' : 'TOAST',
			'path' : '../toast/',
			'screenFileNm' : 'toast'
		},
		'togglebutton' : {
			'id' : 'togglebutton',
			'name' : 'TOGGLEBUTTON',
			'path' : '../toggle/',
			'screenFileNm' : 'togglebutton'
		},
		'tooltip' : {
			'id' : 'tooltip',
			'name' : 'TOOLTIP',
			'path' : '../tooltip/',
			'screenFileNm' : 'tooltip'
		},
		'for-developers' : {
			'id' : 'forDevelopers',
			'name' : 'FOR DEVELOPERS',
			'path' : './for-developers.html',
			'screenFileNm' : 'for-developers'
		}
	};
	var isLocaleJa = false;
	var LOCALE_JA_JP = 'ja-jp';

	// URLからファイル名取得
	var screenFileNm = window.location.href.split('/').pop().split('.')[0];
	
	// index.htmlの場合
	if(!screenFileNm) {
		screenFileNm = 'index';
	}

	if (window.location.pathname.match(LOCALE_JA_JP)) {
		isLocaleJa = true;
	}

	// コンテキストアイテムのコールバック関数を返す
	itemCallback = function (path) {
		return function() {
			location.href = path;
		};
	};

	// ロケール変更アイテム
	localeChangeItem = {};
	localeChangeItem.id = screens[screenFileNm].id;
	if(isLocaleJa) {
		localeChangeItem.name = 'DEMO TOP';
		localeChangeItem.label = 'DEMO TOP';
		localeChangeItem.path = './../' + screens[screenFileNm].path;
	} else {
		localeChangeItem.name = 'JAPANESE';
		localeChangeItem.label = 'JAPANESE';
		localeChangeItem.path = './' + LOCALE_JA_JP + screens[screenFileNm].path.replace(/./, '');
	}
	localeChangeItem.callback = itemCallback(localeChangeItem.path);

	contextItems = [];
	for(key in screens) {
		if(key !== screenFileNm) {
			callbackFnc = itemCallback(screens[key].path);
			contextItem = {
				id : screens[key].id,
				name : screens[key].name,
				label : screens[key].name,
				callback : callbackFnc
			};
			contextItems.push(contextItem);
		}
	}
	contextItems.push(localeChangeItem);

	require.config(requireConfig);

	// コンテキストメニュー作成
	require(['ContextMenu'], function (ContextMenu) {
		var contextMenu = new ContextMenu({
			id : 'headerContextMenu',
			additionalClass : '',
			items : contextItems
		});
		document.querySelector('#headerContextNarrow').appendChild(contextMenu.getRootNode());
	});

	header = document.getElementById('header');

	onscroll = function () {
		var y = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		if (y && !header.classList.contains('floating')) {
			header.classList.add('floating');
		} else if (!y && header.classList.contains('floating')) {
			header.classList.remove('floating');
		}
	};

	if (document.addEventListener) {
		document.addEventListener('scroll', onscroll, false);
	} else {
		document.attachEvent('on' + 'scroll', onscroll);
	}
	var DemoNm = window.location.href.split('/')[5];
	console.log(DemoNm);	
	require(['Urushi','Alert', 'templateEngine', 'templateConfig','ToastManager'], function(Urushi,Alert,templateEngine,
			templateConfig,ToastManager) {
		if(DemoNm=='dialog'){
		console.log(DemoNm);
		templateEngine.renderDocument(document.body, templateConfig).then(
					function(result) {
						var modules = result.widgets;
						console.log(modules);
						Urushi.addEvent(modules.button1.getRootNode(), 'click',
								modules.button1, function() {
									modules.dialog1.show();
								});
						Urushi.addEvent(modules.button2.getRootNode(), 'click',
								modules.button2, function() {
									modules.dialog2.show();
								});
						done();
					}).otherwise(function(error) {
				done();
			});
		}else if(DemoNm=='toast'){
			templateEngine.renderDocument(document.body, templateConfig).then(
			function(result) {
				var modules = result.widgets, key, manager;
				console.log(modules);
				manager = new ToastManager();
				console.log(manager);
				document.body.appendChild(manager.getRootNode());
				Urushi.addEvent(modules.button.getRootNode(), 'click', manager,
						'show', 'toast demo');
				done();
			}).otherwise(function(error) {
		done();
	});
		}else if(DemoNm=='toast'){
			templateEngine.renderDocument(document.body, templateConfig);
		}
			else{
		templateEngine.renderDocument(document.body, templateConfig).then(
				function(result) {
					var alerts = result.widgets, key;
					for (key in alerts) {
						alerts[key].show();
					}
					flag = true;
					done();
				}).otherwise(function(error) {
			flag = false;
			done();
		});
		}
// require([ 'templateEngine', 'templateConfig', 'Urushi' ], function(
// 		templateEngine, templateConfig, Urushi) {
// 	templateEngine.renderDocument(document.body, templateConfig).then(
// 			function(result) {
// 				var modules = result.widgets;
// 				console.log(modules);
// 				Urushi.addEvent(modules.button1.getRootNode(), 'click',
// 						modules.button1, function() {
// 							modules.dialog1.show();
// 						});
// 				Urushi.addEvent(modules.button2.getRootNode(), 'click',
// 						modules.button2, function() {
// 							modules.dialog2.show();
// 						});
// 				done();
// 			}).otherwise(function(error) {
// 		done();
// 	});

	// require(['templateEngine', 'templateConfig'], function (templateEngine, templateConfig) {
	// 	templateEngine.renderDocument(document.body, templateConfig);
	});
})();