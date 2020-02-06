/**
 *
 * @return {Boolean}
 * @override
 *
 * @properties={typeid:24,uuid:"62D6026D-A58E-48C5-B919-48900AFE357E"}
 */
function validate() {
	//	application.output('validate orders_main');
	//add your own logic
	return _super.validate.apply(this, arguments);
}

/**
 * @param {JSEvent} event
 * @override
 *
 * @properties={typeid:24,uuid:"0BDCB7A6-8614-48A6-A64C-C99A64C3FA0C"}
 */
function onLoad(event) {
	return _super.onLoad(event)
}

/**
 * @override
 *
 * @properties={typeid:24,uuid:"539A3D42-E0E4-4728-9568-D790030BBB00"}
 */
function onEditStart() {
//	if (foundset.getSelectedRecord().isNew())
//		elements.customerid.requestFocus();
	_super.onEditStart.apply(this, arguments);	
}

/**
 * @param {Array<String>} failed
 * @override
 *
 * @properties={typeid:24,uuid:"FA71A302-65A5-49BF-B657-9B4F080563F2"}
 */
function onFailedValidation(failed) {
	var msg = '';
	for (var i = 0; i < failed.length; i++) {
		msg += failed[i] + ' is a required field.<br>'
		application.output(failed[i] + ' is a required field.')
	}	
	//show a message to user
	plugins.webnotificationsToastr.clear();
	plugins.webnotificationsToastr.info(msg);
	return msg;
	//	plugins.dialogs.showInfoDialog('INFO', msg)
}
