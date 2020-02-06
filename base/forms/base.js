/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"0287DA9D-4445-4331-8274-40B0DE9DA9CF",variableType:8}
 */
var current_index;

/**
 * An array of required fields
 * @properties={typeid:35,uuid:"CE3DCED9-D021-4E2F-8E04-3E5E2817BD85",variableType:-4}
 */
var requiredFields = [];

/**
 * @properties={typeid:35,uuid:"1F2D408B-6A89-4D1F-851C-E50453BC9C18",variableType:-4}
 */
var failedValidation = []

/**
 * @properties={typeid:24,uuid:"9709FC56-94B6-4B9D-914A-B626B9A8AB48"}
 */
function updateUI() {
	//	application.output('updateUI ' + controller.getName())
	//reset required fields
	requiredFields = [];

	//enable all elements
	for (var i = 0; i < elements.allnames.length; i++) {
		var name = elements.allnames[i];
		var elem = elements[name];

		if (elem.getElementType() == 'TEXT_FIELD' || elem.getElementType() == 'TYPE_AHEAD' || elem.getElementType() == 'TEXT_AREA') {
			if (!foundset.getSelectedRecord()) {
				elem.editable = false;
			} else {
				elem.editable = true;
			}
		}

		if (elem.getElementType() == 'bootstrapcomponents-calendar' || elem.getDesignTimeProperty('pick_list')) {
			if (!foundset.getSelectedRecord()) {
				elem.enabled = false;
			} else {
				elem.enabled = true;
			}
		}

		if (elem.getDesignTimeProperty('required')) {
			requiredFields.push(name);
		}

		if (elem.getElementType() == 'TABPANEL') {
			var len = elem['getMaxTabIndex']();
			for (var j = 0; j < len; j++) {
				if (forms[elem['getTabFormNameAt'](j + 1)] && forms[elem['getTabFormNameAt'](j + 1)].updateUI)
					forms[elem['getTabFormNameAt'](j + 1)].updateUI();
			}
		}

		//if we are in a related foundset, allow editing (child/grandchild)

		if (elem.getElementType() == 'servoyextra-table' || elem.getElementType() == 'aggrid-groupingtable') {
			//get form context
			var ctx = controller.getFormContext()
			application.output(ctx);
			
			//if no relationship
//			application.output(foundset.getRelationName());
			if (!foundset.getRelationName()) {
				if (!security.canDelete(foundset.getDataSource())) {
					/** @type {Array} */
					var c = elem['columns'];
					for (var m = 0; m < c.length; m++) {
						if (c[m].styleClass == 'delete_btn') {
							elem['removeColumn'](m)
						}
					}
				}
				elements['grid_overlay'].visible = scopes.base.editEnabled;
				
				if (ctx.getMaxRowIndex() == 3){
					elements['grid_overlay'].visible = false; 
				}
				
				//check if relationship exists in parent tab
				try {
					var pr;
					for (var l = 1; l <= ctx.getMaxRowIndex(); l++) {
						var row = ctx.getRowAsArray(l);
						if (row[1] == controller.getName()) {
							pr = ctx.getRowAsArray(l - 1)[1];
						}
					}
					var allTabs = solutionModel.getForm(pr).getTabPanels();
					for (var k = 0; k < allTabs.length; k++) {
						
						for (var n = 0; n < allTabs[k].getTabs().length; n++) {
							if (allTabs[k].getTabs()[n].containsForm.name == controller.getName()) {
								if (allTabs[k].getTabs()[n].relationName) {
//									application.output(allTabs[k].getTabs()[n].relationName)
									//if relationship exists for tab, but no parent record, disable editing for child
									elements['grid_overlay'].visible = true;
								}
							}
						}
					}
				} catch (e) {
				}

			} else {
				//if child
				if (elements['grid_overlay'])
					elements['grid_overlay'].visible = false;
			}

		}

		if (elem.hasStyleClass('add_detail_btn')) {
			if (!security.canInsert(foundset.getDataSource())) {
				elem.visible = false;
			}
		}

		if (elem.getElementType() == 'servoyextra-table' || elem.getElementType() == 'aggrid-groupingtable' || elem.getElementType() == 'TABPANEL' || elem.getDesignTimeProperty('crud')) continue;
		//		elem.enabled = scopes.base.editEnabled;
	}

	for (var o = 0; o < requiredFields.length; o++) {
		/** @type {RuntimeTextField} */
		var el = elements[requiredFields[o]];
		el.removeStyleClass('required');
	}

}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"5A7F0EBA-7899-4756-B76D-06ABDB4DC065"}
 */
function onRecordSelection(event) {
	updateUI();
}

/**
 * Handle changed data, return false if the value should not be accepted. In NGClient you can return also a (i18n) string, instead of false, which will be shown as a tooltip.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @return {Boolean}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"A7603122-B8D8-403A-995B-33EED3042A85"}
 */
function onElementDataChange(oldValue, newValue, event) {
	if (event && event.getElementName() == 'search_box') {
		return true;
	}

	try {
		editBegin();
	} catch (e) {

	}
	return true
}

/**
 * @properties={typeid:24,uuid:"1D6818F7-6D5E-49A9-8578-1C8FAACB4BBA"}
 */
function editBegin() {
	if (!foundset.getSelectedRecord()) return;
	scopes.base.editEnabled = true;
	current_index = foundset.getSelectedIndex();
	var pr = controller.getFormContext().getRowAsArray(2)[1]
	forms[pr].updateUI();
	forms[pr].onEditStart();
	forms[pr].validate(true);
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @return {Boolean}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"003251F1-47D0-4BCD-87B1-A9F7A9BAC4F3"}
 */
function onHide(event) {
	return true;
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"70C023B7-EFA5-4F91-B01F-53B97D85509A"}
 */
function onLoad(event) { }

/**
 * @properties={typeid:24,uuid:"DFB5B8B8-6505-45B3-A6E5-969E45964BE0"}
 */
function loadListener() {
	//load key listener
	var fr = solutionModel.getForm(controller.getName())
	var f = fr.getFields();
	for (var i = 0; i < f.length; i++) {
		f[i].setAttribute('keylistener', 'listen');
		f[i].onDataChange = fr.getMethod('onElementDataChange')
	}
	controller.recreateUI();

	//load all listener keys
	for (i = 0; i < elements.allnames.length; i++) {
		var name = elements.allnames[i];
		var elem = elements[name];
		if (elem.getElementType() == 'TABPANEL') {
			var len = elem['getMaxTabIndex']();
			for (var j = 0; j < len; j++) {
				if (forms[elem['getTabFormNameAt'](j + 1)] && forms[elem['getTabFormNameAt'](j + 1)].loadListener)
					forms[elem['getTabFormNameAt'](j + 1)].loadListener();
			}
		}
	}
}

/**
 * @param value
 *
 * @properties={typeid:24,uuid:"5A0B0C2B-AA57-488B-8CF3-2D4D70E7033C"}
 */
function keyCallback(value) {
	//preping us for edit mode if value has changed.
	if (value && value != '' && !scopes.base.editEnabled) {
		editBegin()
	}

}

/**
 * @properties={typeid:24,uuid:"AF6C92BA-4A7C-4BA9-B418-B5AD860309DB"}
 */
function onEditStart() {
	//when edit starts
	for (var i = 0; i < elements.allnames.length; i++) {
		var name = elements.allnames[i];
		var elem = elements[name];
		if (elem.getElementType() == 'TABPANEL') {
			var len = elem['getMaxTabIndex']();
			for (var j = 0; j < len; j++) {
				if (forms[elem['getTabFormNameAt'](j + 1)] && forms[elem['getTabFormNameAt'](j + 1)].onEditStart)
					forms[elem['getTabFormNameAt'](j + 1)].onEditStart();
			}
		}
	}
}

/**
 * @properties={typeid:24,uuid:"05DA15A8-17D2-4D29-B14E-7BA3ACE92D27"}
 */
function onEditEnd() {
	//when edit ends
	for (var i = 0; i < elements.allnames.length; i++) {
		var name = elements.allnames[i];
		var elem = elements[name];
		if (elem.getElementType() == 'TABPANEL') {
			var len = elem['getMaxTabIndex']();
			for (var j = 0; j < len; j++) {
				if (forms[elem['getTabFormNameAt'](j + 1)] && forms[elem['getTabFormNameAt'](j + 1)].onEditEnd)
					forms[elem['getTabFormNameAt'](j + 1)].onEditEnd();
			}
		}
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"14174DB9-EE12-4C47-B5F1-B83317D24DAF"}
 */
function onShow(firstShow, event) {	
	//load customized form
	loadCustomizedForm();
	//load keylistener
	loadListener();
	plugins.keyListener.addKeyListener('listen', keyCallback, true);
	updateUI();

}

/**
 * @protected 
 * @properties={typeid:24,uuid:"340E7FB0-3635-4E55-8D54-5819AB977508"}
 */
function navAfterOpen(data){
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"E5677D84-85E1-4367-96BF-F1C0E8736F18"}
 */
function navBeforeClose(){
	
}

/**
 * @param {Boolean} [reset]
 * @properties={typeid:24,uuid:"304F81A3-B020-4A86-AF9C-16FE90152317"}
 * @AllowToRunInFind
 */
function loadCustomizedForm(reset) {
	var fs;
	if (reset) {
		fs = datasources.mem.customize_reset.getFoundSet();
	} else {
		fs = datasources.mem.customize_stored.getFoundSet();
	}
	fs.find();
	fs.el_form = controller.getName();
	fs.search();
	var f = solutionModel.getForm(controller.getName());
	for (var i = 1; i <= fs.getSize(); i++) {
		var r = fs.getRecord(i);
		var c = f.getComponent(r.el_name);
		if (c.text) c.text = r.el_text;
		c.visible = r.el_visible;
		c.enabled = r.el_enabled;
		c.cssPosition.setTop(r.el_top);
		c.cssPosition.setBottom(r.el_bot);
		c.cssPosition.setLeft(r.el_left);
		c.cssPosition.setRight(r.el_right);
		c.cssPosition.setWidth(r.el_width);
		c.cssPosition.setHeight(r.el_height);
	}
	controller.recreateUI();
}

/**
 * @protected
 * @param {Array<String>} failed list of items that didn't pass validation
 * @properties={typeid:24,uuid:"26CBAE65-9133-4D82-83E3-28CDC6AFB2C2"}
 */
function onFailedValidation(failed) { }

/**
 * @param {Boolean} [init]
 * @return {Boolean}
 * @properties={typeid:24,uuid:"735B544A-C890-4136-8DC4-BD2A66E04D27"}
 */
function validate(init) {
	var valid = true;
	failedValidation = [];
	//validate fields
	for (var k = 0; k < requiredFields.length; k++) {
		/** @type {RuntimeTextField} */
		var el = elements[requiredFields[k]];
		var dp = el.getDataProviderID();
		el.removeStyleClass('required');
		if (!this[dp]) {
			//			failedValidation.push(requiredFields[k]);
			//use label name instead
			failedValidation.push(elements[el.getLabelForElementNames()[0]].text);
			valid = false;
			el.addStyleClass('required');
		}
	}

	if (!valid && !init) {
		onFailedValidation(failedValidation);
		return valid;
	}

	//enable all elements
	for (var i = 0; i < elements.allnames.length; i++) {
		var name = elements.allnames[i];
		var elem = elements[name];
		if (elem.getElementType() == 'TABPANEL') {
			var len = elem['getMaxTabIndex']();
			for (var j = 0; j < len; j++) {
				if (forms[elem['getTabFormNameAt'](j + 1)] && forms[elem['getTabFormNameAt'](j + 1)].validate)
					valid = forms[elem['getTabFormNameAt'](j + 1)].validate(init);
				if (!valid) {
					return valid;
				}
			}
		}
	}
	return valid;
}
