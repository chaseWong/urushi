/*eslint "vars-on-top" : 0*/
define(
	'dropdown.spec',
	['Urushi', 'DropDown', 'templateEngine', 'templateConfig'],
	function (urushi, DropDown, templateEngine, templateConfig) {
		'use strict';

		describe('Dropdown test', function () {
			var button = document.createElement('button'),
				parentNode = document.getElementById('script-modules'),
				dummyEvent = {
					stopPropagation : function () {},
					preventDefault : function () {},
				};

			parentNode.appendChild(button);

			it('init', function () {
				expect((new DropDown()).destroy()).toBe();

			});
			it('addItems', function () {
				parentNode.appendChild(document.createTextNode('addItems'));
				var dd = new DropDown({
					items : [
						{value : 'a', label : 'A'},
						{value : 'b', label : 'B'},
					]
				});
				parentNode.appendChild(dd.rootNode);
				dd.addItems({});
				expect(dd.listNode.childNodes.length).toBe(2);
				dd.addItems([
					{label : 'no value'},
				]);
				expect(dd.listNode.childNodes.length).toBe(2);
				dd.addItems([
					{value : 'c', label : 'C'},
				]);
				expect(dd.listNode.childNodes.length).toBe(3);
				dd.addItems([
					{value : 'd'},// Has no label.
				]);
				expect(dd.listNode.childNodes.length).toBe(4);
				expect(dd.listNode.childNodes[3].innerHTML).toBe('&nbsp;');
				dd.addItems([
					{value : 'e', label : 'has class', class : 'test'},
				]);
				expect(dd.listNode.childNodes.length).toBe(5);
				expect(dd.listNode.childNodes[4].classList.contains('test')).toBe(true);
				dd.addItems([
					{value : 'f', label : 'select', selected : true},
				]);
				expect(dd.listNode.childNodes.length).toBe(6);
				expect(dd.getSelectedValue()).toBe('f');
			});
			it('setSelected', function () {
				parentNode.appendChild(document.createTextNode('setSelected'));
				var dd = new DropDown({
					items : [
						{value : 'a', label : 'A'},
						{value : 'b', label : 'B'},
					]
				});
				parentNode.appendChild(dd.rootNode);
				dd.setSelected('b');
				expect(dd.getSelectedValue()).toBe('b');
				dd.setSelected();
				expect(dd.getSelectedValue()).toBe('b');
				dd.setSelected('nothing');
				expect(dd.getSelectedValue()).toBe('b');
			});
			it('getSelectedValue getSelectedNode', function () {
				parentNode.appendChild(document.createTextNode('getSelectedValue getSelectedNode'));
				var dd = new DropDown({
					items : [
						{value : 'a', label : 'A'},
						{value : 'b', label : 'B'},
					]
				});
				parentNode.appendChild(dd.rootNode);
				expect(dd.getSelectedValue()).toBe(undefined);
				expect(dd.getSelectedNode()).toBe(undefined);
				dd.setSelected('b');
				expect(dd.getSelectedValue()).toBe('b');
				expect(dd.getSelectedNode()).toBe(dd.listNode.childNodes[1]);
				dd.setSelected('a');
				expect(dd.getSelectedValue()).toBe('a');
				expect(dd.getSelectedNode()).toBe(dd.listNode.childNodes[0]);
			});
			
			it('_onSelectItem', function () {
				parentNode.appendChild(document.createTextNode('_onSelectItem'));
				var dd = new DropDown({
					items : [
						{value : 'a', label : 'A'},
						{value : 'b', label : 'B'},
					]
				});
				parentNode.appendChild(dd.rootNode);
				dd.inputNode.focus();
				expect(dd.getSelectedValue()).toBe(undefined);
				expect(dd.getSelectedNode()).toBe(undefined);
				dd.inputNode.focus();
				dd._onSelectItem({target : dd.listNode.childNodes[1]});
				expect(dd.getSelectedValue()).toBe('b');
				expect(dd.getSelectedNode()).toBe(dd.listNode.childNodes[1]);
			});
			it('focus blur', function () {
				parentNode.appendChild(document.createTextNode('focus blur'));
				var dd = new DropDown({
					items : [
						{value : 'a', label : 'A'},
						{value : 'b', label : 'B'},
					]
				});
				parentNode.appendChild(dd.rootNode);
				dd.inputNode.focus();
				waits(20);
				runs(function() {
					button.focus();
				});
				waits(20);
				runs(function() {
					dd.inputNode.focus();
				});
				waits(310);
				runs(function() {
					dd._openDropDownMenu();
					dd._onMousedownList(dummyEvent);
					dd._onBlurInput();
				});
				waits(310);
				runs(function() {
					button.focus();
				});
				waits(310);
			});
			it('focus pattern', function () {
				parentNode.appendChild(document.createTextNode('focus pattern'));
				runs(function() {
					var dd = new DropDown({
						items : [
							{value : 'a', label : 'A'},
							{value : 'b', label : 'B'},
						]
					});
					parentNode.appendChild(dd.rootNode);
					dd.inputNode.click();
					dd.inputNode.focus();
				});
				waits(20);
				runs(function() {
					var dd = new DropDown({
						items : [
						]
					});
					parentNode.appendChild(dd.rootNode);
					dd.inputNode.click();
					dd.inputNode.focus();
				});
				waits(20);
				runs(function() {
					var dd = new DropDown({
						items : [
							{value : 'a', label : 'A'},
							{value : 'b', label : 'B'},
						]
					});
					dd.setDisabled(true);
					parentNode.appendChild(dd.rootNode);
					dd.inputNode.focus();
					dd.inputNode.click();
					dd._onClickInput(dummyEvent);
				});
			});
			it('keyDown', function () {
				var getKeyCode = urushi.getKeyCode;
				parentNode.appendChild(document.createTextNode('keyDown'));
				var items = [];
				for (var i = 0; i < 100; i++) {
					items.push({value : '' + i, label : 'label' + i});
				}
				var dd = new DropDown({
					items : items
				});
				parentNode.appendChild(dd.rootNode);
				dd.inputNode.focus();

				spyOn(dd, '_onBlurInput').andCallThrough();
				spyOn(dd, '_onClickInput').andCallThrough();
				waits(310);
				runs(function() {
					urushi.getKeyCode = function() {return urushi.KEYCODE.COMMA; };
					dd._onKeydownInput(dummyEvent);
					expect(dd._onBlurInput.callCount).toBe(0);
					expect(dd._onClickInput.callCount).toBe(0);
				});
				waits(310);
				runs(function() {
					urushi.getKeyCode = function() {return urushi.KEYCODE.ESCAPE; };
					dd._onKeydownInput(dummyEvent);
					expect(dd._onBlurInput.callCount).toBe(1);
					expect(dd._onClickInput.callCount).toBe(0);
				});
				dd.inputNode.focus();
				waits(310);
				runs(function() {
					urushi.getKeyCode = function() {return urushi.KEYCODE.COMMA; };
					dd._onKeydownInput(dummyEvent);
					expect(dd._onBlurInput.callCount).toBe(1);
					expect(dd._onClickInput.callCount).toBe(0);
				});
				waits(310);
				runs(function() {
					urushi.getKeyCode = function() {return urushi.KEYCODE.ENTER; };
					dd._onKeydownInput(dummyEvent);
					expect(dd._onBlurInput.callCount).toBe(1);
					expect(dd._onClickInput.callCount).toBe(1);
				});
				waits(310);
				runs(function() {
					urushi.getKeyCode = function() {return urushi.KEYCODE.ENTER; };
					dd._onKeydownInput(dummyEvent);
					expect(dd._onBlurInput.callCount).toBe(2);
					expect(dd._onClickInput.callCount).toBe(1);
				});
				waits(310);
				runs(function() {
					urushi.getKeyCode = function() {return urushi.KEYCODE.SPACE; };
					dd._onKeydownInput(dummyEvent);
					expect(dd._onBlurInput.callCount).toBe(2);
					expect(dd._onClickInput.callCount).toBe(2);
				});
				waits(310);
				runs(function() {
					urushi.getKeyCode = function() {return urushi.KEYCODE.ESCAPE; };
					dd._onKeydownInput(dummyEvent);
					expect(dd._onBlurInput.callCount).toBe(3);
					expect(dd._onClickInput.callCount).toBe(2);
				});
				waits(310);
				runs(function() {
					urushi.getKeyCode = function() {return urushi.KEYCODE.UP; };
					dd._onKeydownInput(dummyEvent);
					expect(dd.getSelectedValue()).toBe(undefined);
					expect(dd._onBlurInput.callCount).toBe(3);
					expect(dd._onClickInput.callCount).toBe(3);
				});
				waits(310);
				runs(function() {
					urushi.getKeyCode = function() {return urushi.KEYCODE.ESCAPE; };
					dd._onKeydownInput(dummyEvent);
					expect(dd._onBlurInput.callCount).toBe(4);
					expect(dd._onClickInput.callCount).toBe(3);
				});
				waits(310);
				runs(function() {
					urushi.getKeyCode = function() {return urushi.KEYCODE.DOWN; };
					dd._onKeydownInput(dummyEvent);
					expect(dd.getSelectedValue()).toBe(undefined);
					expect(dd._onBlurInput.callCount).toBe(4);
					expect(dd._onClickInput.callCount).toBe(4);
				});
				waits(310);
				runs(function() {
					urushi.getKeyCode = function() {return urushi.KEYCODE.UP; };
					dd._onKeydownInput(dummyEvent);
					expect(dd.getSelectedValue()).toBe('99');
					expect(dd._onBlurInput.callCount).toBe(4);
					expect(dd._onClickInput.callCount).toBe(4);

					dd = new DropDown({
						items : items
					});
					parentNode.appendChild(dd.rootNode);
					dd.inputNode.focus();
				});
				waits(310);
				runs(function() {
					urushi.getKeyCode = function() {return urushi.KEYCODE.DOWN; };
					dd._onKeydownInput(dummyEvent);
					expect(dd.getSelectedValue()).toBe('0');

					dd = new DropDown({
						items : items
					});
					parentNode.appendChild(dd.rootNode);
					dd.inputNode.focus();
				});
				waits(310);
				runs(function() {
					urushi.getKeyCode = function() {return urushi.KEYCODE.PAGE_UP; };
					dd._onKeydownInput(dummyEvent);
					expect(dd.getSelectedValue()).toBe('99');

					dd = new DropDown({
						items : items
					});
					parentNode.appendChild(dd.rootNode);
					dd.inputNode.focus();
				});
				waits(310);
				runs(function() {
					urushi.getKeyCode = function() {return urushi.KEYCODE.PAGE_DOWN; };
					dd._onKeydownInput(dummyEvent);
					expect(dd.getSelectedValue()).toBe('0');

					dd.setSelected('0');
					urushi.getKeyCode = function() {return urushi.KEYCODE.UP; };
					dd._onKeydownInput(dummyEvent);
					expect(dd.getSelectedValue()).toBe('0');
				
					urushi.getKeyCode = function() {return urushi.KEYCODE.DOWN; };
					dd._onKeydownInput(dummyEvent);
					expect(dd.getSelectedValue()).toBe('1');

					dd.setSelected('99');
					urushi.getKeyCode = function() {return urushi.KEYCODE.DOWN; };
					dd._onKeydownInput(dummyEvent);
					expect(dd.getSelectedValue()).toBe('99');

					urushi.getKeyCode = function() {return urushi.KEYCODE.UP; };
					dd._onKeydownInput(dummyEvent);
					expect(dd.getSelectedValue()).toBe('98');

					urushi.getKeyCode = function() {return urushi.KEYCODE.HOME; };
					dd._onKeydownInput(dummyEvent);
					expect(dd.getSelectedValue()).toBe('0');

					urushi.getKeyCode = function() {return urushi.KEYCODE.END; };
					dd._onKeydownInput(dummyEvent);
					expect(dd.getSelectedValue()).toBe('99');

					dd = new DropDown({
						items : [
							{value : '0', label : 'A'},
							{value : '1', label : 'B'},
						]
					});
					parentNode.appendChild(dd.rootNode);
					dd.inputNode.focus();
				});
				waits(310);
				runs(function() {
					dd.setSelected('1');
					urushi.getKeyCode = function() {return urushi.KEYCODE.UP; };
					dd._onKeydownInput(dummyEvent);
					expect(dd.getSelectedValue()).toBe('0');

					urushi.getKeyCode = getKeyCode;
				});
			});

			it('_initSetScrollVisibleItem', function () {
				parentNode.appendChild(document.createTextNode('_initSetScrollVisibleItem'));
				var items = [];
				for (var i = 0; i < 100; i++) {
					items.push({value : '' + i, label : 'label' + i});
				}
				var dd = new DropDown({
					items : items
				});
				parentNode.appendChild(dd.rootNode);
				var space = document.createElement('div');
				space.innerHTML = 'space';
				space.style.height = '1000px';
				parentNode.appendChild(space);
				dd.setSelected('50');
				window.scrollTo(0, 0);
				waits(10);
				runs(function() {
					dd.inputNode.focus();
				});

				waits(310);
				runs(function() {
					button.focus();
					window.scrollTo(0, 10000);
				});
				waits(10);
				runs(function() {
					dd.inputNode.focus();
				});
				waits(310);
				runs(function() {
				});
			});

			it('setDisabled ', function () {
				parentNode.appendChild(document.createTextNode('setDisabled'));
				var dd = new DropDown({
					items : [
						{value : 'a', label : 'A'},
						{value : 'b', label : 'B'},
					]
				});
				parentNode.appendChild(dd.rootNode);

				dd.setDisabled('d');
				expect(dd.inputNode.getAttribute('disabled')).toBe(null);
				dd.setDisabled(true);
				expect(dd.inputNode.getAttribute('disabled')).toBe('true');
				dd.setDisabled(false);
				expect(dd.inputNode.getAttribute('disabled')).toBe(null);
			});


			it('Empty label', function () {
				parentNode.appendChild(document.createTextNode('Empty label'));
				var dd = new DropDown({
					items : [
						{value : 'empty', label : ''},
					]
				});
				parentNode.appendChild(dd.rootNode);

				expect(dd.listNode.childNodes[0].innerHTML).toBe('&nbsp;');
			});

			it('html escape label', function () {
				parentNode.appendChild(document.createTextNode('html escape label'));
				var dd = new DropDown({
					items : [
						{value : 'escape', label : '<div>escape</div>'},
					]
				});
				parentNode.appendChild(dd.rootNode);

				expect(dd.listNode.childNodes[0].textContent).toBe('<div>escape</div>');
			});

			it('removeItem', function () {
				parentNode.appendChild(document.createTextNode('removeItem'));
				var dd = new DropDown({
					items : [
						{value : 'value1', label : 'item1'},
						{value : 'value2', label : 'item2'},
						{value : 'value3', label : 'item3'},
					]
				});
				parentNode.appendChild(dd.rootNode);

				expect(dd.listNode.childNodes.length).toBe(3);

				dd.removeItem('value2');
				expect(dd.listNode.childNodes.length).toBe(2);
				expect(dd.listNode.childNodes[0].textContent).toBe('item1');
				expect(dd.listNode.childNodes[1].textContent).toBe('item3');

				dd = new DropDown({
					items : [
						{value : 'value1', label : 'item1'},
						{value : 'value2', label : 'item2'},
						{value : 'value3', label : 'item3'},
					]
				});
				parentNode.appendChild(dd.rootNode);

				expect(dd.listNode.childNodes.length).toBe(3);

				dd.removeItem('noexists');
				expect(dd.listNode.childNodes.length).toBe(3);

				//change select
				dd = new DropDown({
					items : [
						{value : 'value1', label : 'item1'},
						{value : 'value2', label : 'item2'},
						{value : 'value3', label : 'item3'},
					]
				});
				parentNode.appendChild(dd.rootNode);

				dd.setSelected('value1');
				dd.removeItem('value1');
				expect(dd.getSelectedValue()).toBe('value2');
				dd.removeItem('value2');
				expect(dd.getSelectedValue()).toBe('value3');
				dd.removeItem('value3');
				expect(dd.listNode.childNodes.length).toBe(0);
			});

			it('removeAllItems', function () {
				parentNode.appendChild(document.createTextNode('removeAllItems'));
				var dd = new DropDown({
					items : [
						{value : 'value1', label : 'item1'},
						{value : 'value2', label : 'item2'},
						{value : 'value3', label : 'item3'},
					]
				});
				parentNode.appendChild(dd.rootNode);

				dd.removeAllItems();
				expect(dd.listNode.childNodes.length).toBe(0);
			});

			it('destroy', function () {
				var dd = new DropDown({
					items : [
						{value : 'a', label : 'A'},
						{value : 'b', label : 'B'},
					]
				});
				parentNode.appendChild(dd.rootNode);
				dd.destroy();
			});

			it('template engine input test', function () {
				templateEngine.renderDocument(document.body, templateConfig).then(function (result) {
					// var modules = result.widgets,
					// 	key;
				});
			});

			// for jscover.
			// Don't delete.
			jscoverReport();
		});
	}
);
