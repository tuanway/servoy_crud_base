/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"B86C9F65-CA9B-4A9E-8260-7A6E6682B97E"}
 */
var searchText;

/**
 * @type {{SimpleSearch}}
 *
 * @properties={typeid:35,uuid:"C2225C65-7D61-4337-A885-419DE06D1C41",variableType:-4}
 */
var simpleSearch;

/**
 * @properties={typeid:24,uuid:"8CA0EFBE-6015-4B95-8B86-FCD60964BE40"}
 */
function new_record() {

	//get form context
	var ctx = controller.getFormContext()
	//if no relationship
	if (!foundset.getRelationName()) {
		//check if relationship exists in parent tab
		try {
			var pr;
			for (var l = 1; l <= ctx.getMaxRowIndex(); l++) {
				var row = ctx.getRowAsArray(l);
				if (row[1] == controller.getName()) {
					pr = ctx.getRowAsArray(l - 1)[1];
				}
			}

			if (pr == 'main') {
				//if we are at top level parent, and new record has just been created, don't allow new edits.
				if (foundset.getSelectedRecord().isNew()) {
					plugins.dialogs.showInfoDialog('INFO', 'Finish editing first.');
					return;
				}
			}

		} catch (e) {
		}
	}
	scopes.base.editEnabled = true;
	foundset.newRecord();
	//get parent and update UI
	forms[controller.getFormContext().getRowAsArray(2)[1]].updateUI();
	onEditStart();
	validate(true);
}

/**
 * @properties={typeid:24,uuid:"35CE341D-1C0E-4D13-AC83-F1704284B3A5"}
 */
function delete_record() {
	var c = plugins.dialogs.showQuestionDialog('INFO', 'Are you sure you want to delete?', 'Confirm', 'Cancel')
	if (c == 'Confirm') {

		foundset.deleteRecord();
		updateUI();
	}
}

/**
 * @properties={typeid:24,uuid:"6CC302C4-A839-4DA1-8007-8D68A56EACDA"}
 */
function save_record() {
	//validate before committing
	if (!validate()) {
		return;
	}
	//save single record
	//	if (!databaseManager.saveData(foundset.getSelectedRecord())) {
	//save all records
	if (!databaseManager.saveData()) {
		plugins.webnotificationsToastr.clear();
		plugins.webnotificationsToastr.error('Failed to save record. Please contact an Administrator.')
		throw 'failed to save';
	}
	scopes.base.editEnabled = false;
	updateUI();
	onEditEnd();
}

/**
 * @properties={typeid:24,uuid:"BA8CBEC5-EDE5-4BF6-A62E-60E15B4C56A4"}
 */
function cancel_changes() {
	scopes.base.editEnabled = false;
	//undo changes for all records
	databaseManager.revertEditedRecords()
	//undo changes for single record
	//	foundset.getSelectedRecord().revertChanges();
	updateUI();
	onEditEnd();
}

/**
 * @properties={typeid:24,uuid:"EC74F0FC-FEFE-4AAF-AD30-384DEF1ACFF3"}
 */
function next_record() {
	scopes.svyDataUtils.selectNextRecord(foundset);
}

/**
 * @properties={typeid:24,uuid:"D729A1E7-CC37-4F0C-95F7-EC477DEB0664"}
 */
function prev_record() {
	scopes.svyDataUtils.selectPreviousRecord(foundset);
}

/**
 * @properties={typeid:24,uuid:"418993F5-F149-4264-80D9-43E1B95AB669"}
 */
function first_record() {
	scopes.svyDataUtils.selectFirstRecord(foundset);
}

/**
 * @properties={typeid:24,uuid:"2C3FC388-5A27-404A-AB54-ADB84D88B536"}
 */
function last_record() {
	scopes.svyDataUtils.selectLastRecord(foundset);
}

/**
 * @protected
 * @properties={typeid:24,uuid:"79F16FD3-9EAF-4741-BCB7-7AF729DFB72A"}
 */
function search() {
	var s = scopes.svySearch.createSimpleSearch(foundset);
	setupSearchParams(s);
	s.setSearchText(searchText);
	if (!searchText || searchText == '') {
		return foundset.loadAllRecords();
	}
	return s.loadRecords(foundset);
}

/**
 * @param {scopes.svySearch.SimpleSearch} s
 * @protected
 * @properties={typeid:24,uuid:"75CFFCA2-D683-4E04-9E1E-4AF2DC9DA2AC"}
 */
function setupSearchParams(s) { }
