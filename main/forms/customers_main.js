/**
 * @param {Array<String>} failed
 * @override
 *
 * @properties={typeid:24,uuid:"C69CAA3E-AD8E-4EF9-852D-4B5B5121140C"}
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