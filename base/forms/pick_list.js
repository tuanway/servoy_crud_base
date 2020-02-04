/**
 * @properties={typeid:35,uuid:"2B819491-F191-48D1-9A6B-7FA66B8457F3",variableType:-4}
 */
var selection = false;

/**
 * @properties={typeid:35,uuid:"4AF76F00-662D-4C7C-8350-8899D1027C43",variableType:-4}
 */
var dp = []

/**
 * @public
 * @param {JSEvent} event
 * @param listName
 * @param record
 * @properties={typeid:24,uuid:"A09B864C-8E06-48FF-932C-A03BE4516D7E"}
 */
function open(event, listName, record) {
	searchText = '';
	var l = solutionModel.getValueList(listName);
	var ds = l.dataSource;
	var f = solutionModel.getForm(controller.getName());
	f.dataSource = ds;
	controller.recreateUI();
	dp = l.getDisplayDataProviderIds()
	var rp = l.getReturnDataProviderIds();

	if (elements.table.columns) {
		elements.table.removeAllColumns();
	}
	foundset.loadAllRecords();

	for (var i = 0; i < dp.length; i++) {
		var c = elements.table.newColumn(dp[i])
		if (databaseManager.getTable(ds).getColumn(dp[i]).getType() == JSColumn.DATETIME) {
			c.format = 'MM/dd/yyyy'
		}
		c.headerText = dp[i];
	}
	var w = application.createWindow(controller.getName(), JSWindow.MODAL_DIALOG);
	w.title = 'Pick ' + listName
	w.setSize(400, 480)
	w.setLocation(event.getX() - 400, event.getY())

	w.show(controller.getName());

	if (selection) {
		record[rp[0]] = elements.table.foundset.foundset.getSelectedRecord()[rp[0]];
	}
	return;
}

/**
 * Perform the element onclick action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0276B576-F72B-4720-9F60-86EDDA4068B6"}
 */
function onClick$submit(event) {
	selection = true;
	application.getActiveWindow().hide();
}

/**
 * Perform the element onclick action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"99766CC1-88DC-499B-BE27-92DA36112BB8"}
 */
function onClick$cancel(event) {
	selection = false;
	application.getActiveWindow().hide();
}

/**
 * @param {scopes.svySearch.SimpleSearch} s
 * @override
 *
 * @properties={typeid:24,uuid:"3E1E0CD2-4C5D-495C-A78A-B8B6C8B2084B"}
 */
function setupSearchParams(s) {
	for (var i = 0; i < dp.length; i++) {
		s.addSearchProvider(dp[i])
	}
}
