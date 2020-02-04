/**
 * @override
 *
 * @properties={typeid:24,uuid:"0EBA9321-009B-49E2-BA76-AF7A0F902666"}
 * @AllowToRunInFind
 */
function updateUI() {
	_super.updateUI();
	elements.undo.enabled = scopes.base.editEnabled;
	elements.save.enabled = scopes.base.editEnabled;
	elements.first_rec.enabled = !scopes.base.editEnabled;
	elements.next_rec.enabled = !scopes.base.editEnabled;
	elements.prev_rec.enabled = !scopes.base.editEnabled;
	elements.last_rec.enabled = !scopes.base.editEnabled;
	elements.search_box.enabled = !scopes.base.editEnabled;
	elements.search_button.enabled = !scopes.base.editEnabled;
}

/**
 * @param {JSEvent} event
 * @override
 *
 * @properties={typeid:24,uuid:"D631B2FC-50DC-4593-81B0-1C981860AC83"}
 */
function onRecordSelection(event) {
	if (scopes.base.editEnabled && foundset.getSelectedIndex() != current_index) {
		checkEdit();
	}
	_super.onRecordSelection(event);
}

/**
 * @properties={typeid:24,uuid:"485FDC89-D800-4FDB-ADB9-AC4018178EC0"}
 */
function checkEdit() {
	var re = databaseManager.getEditedRecords();
	if (re && re.length > 0) {
		foundset.setSelectedIndex(current_index)
		plugins.dialogs.showInfoDialog('Info', 'Please finish editing first.')
		return false;
	}
	return true;
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
 * @properties={typeid:24,uuid:"9A14A7BE-A67A-4F4E-B9C8-0C47CAC630A3"}
 */
function onHide(event) {
	return checkEdit()
}

/**
 * @override
 *
 * @properties={typeid:24,uuid:"80E65B18-FE1A-44D8-8A8E-07867BF7EFFB"}
 * @AllowToRunInFind
 */
function search() {
	_super.search.apply(this, arguments);
	if (foundset.getSize() == 0) {
		elements.search_box.enabled = true;
		elements.search_box.editable = true;
	}
}
