/**
 *
 * @properties={typeid:35,uuid:"BD8B92E4-6C70-43A0-B790-6293644CC29C",variableType:-4}
 */
var editEnabled = false;

/**
 * Open a pick list, and send current selected record dataprovider
 * @param {JSEvent} event
 * @param ListName
 * @properties={typeid:24,uuid:"FFB40B4E-CCA3-49A0-9FB2-ABCCFDE95A13"}
 */
function showPickList(event, ListName) {
	var f = solutionModel.getForm('pick_list_' + ListName);
	if (!f) {
		f = solutionModel.newForm('pick_list_' + ListName);
		f.extendsForm = solutionModel.getForm('pick_list');
	}
	forms['pick_list_' + ListName].open(event, ListName, forms[event.getFormName()].foundset.getSelectedRecord());

	if (forms[event.getFormName()].foundset.getSelectedRecord().hasChangedData()) {
		var pr = forms[event.getFormName()].controller.getFormContext().getRowAsArray(2)[1];
		if (forms[pr].editBegin)
			forms[pr].editBegin();
	}
}
