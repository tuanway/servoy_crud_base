/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"85049AF2-7FF1-410D-A61B-B5B44E0F5396"}
 */
var searchText = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"9EFEA074-6E9B-4ECF-B94F-A835B74D2041"}
 */
var selectedForm = '';

/**
 * @public
 * @param {String|Object} fname form that we want to customize
 * @properties={typeid:24,uuid:"5236B8B4-64DF-4136-B245-DE1F05A72CBC"}
 */
function customizeForms(fname) {
	//get all relevant forms
	var formsList = [fname];
	function getRelevantForms(c, fr) {
		var f = solutionModel.getForm(fr);
		if (!c) {
			c = f.getTabPanels();
		}
		for (var i = 0; i < c.length; i++) {
			/** @type {Array} */
			var tabs = c[i].getTabs();
			for (var j = 0; j < tabs.length; j++) {
				if (tabs[j].containsForm) {
					formsList.push(tabs[j].containsForm.name);
					getRelevantForms(null, tabs[j].containsForm.name)
				}
			}
		}
	}
	getRelevantForms(null, fname);
	open(formsList)
}

/**
 * @param {String} f
 * @param {Boolean} [reset]
 * @properties={typeid:24,uuid:"7B1E6540-4437-44BE-8974-21568D8EF28C"}
 * @AllowToRunInFind
 */
function getElementsInForm(f, reset) {
	foundset.loadAllRecords();
	foundset.deleteAllRecords();
	if (!forms[f]) return;
	var el = forms[f].elements.allnames;
	var c = databaseManager.getTable(foundset.getDataSource()).getColumnNames();
	for (var i = 0; i < el.length; i++) {
		var e = forms[f].elements[el[i]];
		var ce;
		switch (e.getElementType()) {
		case 'LABEL':
			ce = solutionModel.getForm(f).getLabel(el[i]);
			break;
		case 'TEXT_FIELD':
			ce = solutionModel.getForm(f).getField(el[i]);
			break;
		case 'TYPE_AHEAD':
			ce = solutionModel.getForm(f).getField(el[i]);
			break;
		default:
			break;
		}
		if (e.getElementType() == 'TABPANEL' || e.getElementType() == 'BUTTON' || el[i] == 'search_box' || el[i] == 'grid_overlay') continue;
		if (!ce) continue;
		var pos = solutionModel.getForm(f).getComponent(el[i]).cssPosition;
		foundset.newRecord();
		var r = foundset.getSelectedRecord();
		r.el_form = f;
		r.el_name = el[i];
		r.el_desc = el[i];
		r.el_top = pos.getTop();
		r.el_bot = pos.getBottom();
		r.el_right = pos.getRight();
		r.el_left = pos.getLeft();
		r.el_width = pos.getWidth();
		r.el_height = pos.getHeight();
		r.el_enabled = ce.enabled;
		r.el_visible = ce.visible;
		r.el_text = ce['text'];
		r.el_dataprovider = ce.dataProviderID;

		//store original records
		var re = datasources.mem.customize_reset.getFoundSet();
		re.find();
		re.el_form = f;
		re.el_name = el[i];
		re.search();
		if (!re.getSize()) {
			re.newRecord();
			//store reseted records
			for (var j = 0; j < c.length; j++) {
				re[c[j]] = r[c[j]];
			}
		} else {
			if (reset) {
				//recover reseted records
				for (j = 0; j < c.length; j++) {
					r[c[j]] = re[c[j]];
				}
			}
		}

		if (!reset) {
			var st = datasources.mem.customize_stored.getFoundSet();
			st.find()
			st.el_form = f;
			st.el_name = el[i];
			st.search();

			if (st.getSize()) {
				var strec = st.getSelectedRecord();
				//update record with those that are stored
				for (j = 0; j < c.length; j++) {
					r[c[j]] = strec[c[j]];
				}
			}
		}

	}
	databaseManager.saveData();

	return foundset.getSize();
}

/**
 * @properties={typeid:24,uuid:"EEE494FF-F8AE-4BDC-870A-63D41346D826"}
 */
function open(flist) {
	//reset data
	searchText = '';
	selectedForm = '';
	foundset.loadAllRecords();
	foundset.deleteAllRecords();
	/** @type {Array<String>} */
	var lst = [];
	for (var i = 0; i < flist.length; i++) {
		if (getElementsInForm(flist[i])) {
			if (lst.indexOf(flist[i]) != -1) continue;
			lst.push(flist[i]);
		}
	}
	//setup vl
	application.setValueListItems('customforms', lst);
	selectedForm = lst[0];
	getElementsInForm(lst[0]);
	var w = application.createWindow(controller.getName(), JSWindow.MODAL_DIALOG);
	w.title = 'Customize Forms';
	w.setSize(730, 300);
	w.show(controller.getName());
}

/**
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @private
 * @override
 *
 * @properties={typeid:24,uuid:"0B2BEA88-199A-42A8-BDAB-7491FFB7374B"}
 */
function onElementDataChange(oldValue, newValue, event) { }

/**
 * Perform the element onclick action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8A94E114-4FC3-46AF-9082-A8AAC157C454"}
 * @AllowToRunInFind
 */
function onClick$resetAll(event) {
	//	var ans = plugins.dialogs.showQuestionDialog('INFO', 'Do you want to reset all elements for form?', 'Yes', 'No');
	//	if (ans == 'No') return;
	//remove stored record
	var st = datasources.mem.customize_stored.getFoundSet();
	st.loadAllRecords();
	st.deleteAllRecords();
	getElementsInForm(selectedForm, true);
	forms[selectedForm].loadCustomizedForm(true);
}

/**
 * Perform the element onclick action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F58AD342-96CF-481C-B6EB-BD2EE0C2EEE3"}
 * @AllowToRunInFind
 */
function onClick$save(event) {
	//store the changed object in seperate table
	var st = datasources.mem.customize_stored.getFoundSet();
	var ds = databaseManager.getEditedRecords(foundset);
	for (var j = 0; j < ds.length; j++) {
		/** @type {JSRecord<mem:customize_stored>} */
		var rec = ds[j];
		st.find();
		st.el_form = rec.el_form;
		st.el_name = rec.el_name;
		st.search();
		if (!st.getSize()) {
			st.newRecord()
		}
		var strec = st.getSelectedRecord()
		var c = databaseManager.getTable(foundset.getDataSource()).getColumnNames();
		//add record with changes;
		for (var i = 0; i < c.length; i++) {
			strec[c[i]] = rec[c[i]];
		}
		databaseManager.saveData(strec);
	}
	databaseManager.saveData(foundset);
	forms[selectedForm].loadCustomizedForm();
}

/**
 * Perform the element onclick action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"FE439630-26E6-4FDB-8005-6B0CD14A7879"}
 * @AllowToRunInFind
 */
function onClick$search(event) {
	var s = scopes.svySearch.createSimpleSearch(foundset);
	s.addSearchProvider('el_name');
	s.setSearchText(searchText);
	s.loadRecords(foundset);
}

/**
 * Handle changed data, return false if the value should not be accepted. In NGClient you can return also a (i18n) string, instead of false, which will be shown as a tooltip.
 *
 * @param {String} oldValue old value
 * @param {String} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @return {Boolean}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"062C70E3-521F-4B60-9FFD-FC7E6B7D2084"}
 */
function onDataChange(oldValue, newValue, event) {
	getElementsInForm(newValue);
	return true
}

/**
 * Perform the element onclick action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"48BCA061-C25D-4A16-97DB-C53CEA318ED1"}
 * @AllowToRunInFind
 */
function onClick$resetElement(event) {
	foundset.getSelectedRecord().revertChanges();
	//remove stored record
	var st = datasources.mem.customize_stored.getFoundSet();
	var rec = foundset.getSelectedRecord();
	st.find();
	st.el_form = rec.el_form;
	st.search();
	if (st.getSize()) {
		st.deleteRecord();
	}
}
