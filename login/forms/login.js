/**
 *
 * @return {Boolean} True when successful
 * @override
 *
 * @properties={typeid:24,uuid:"D0355FF6-05EE-4BD4-B7CD-F25EBBE3BE43"}
 */
function login() {
	//Single tenant Security so use a 'Default' Tenant
	tenantName = 'Default';
//	if (application.isInDeveloper()) {
//		return security.login('Admin', 1, ['Administrators']);		
//	} 	
	return _super.login.apply(this, arguments);
}

/**
 * @param {String} error
 * @override
 *
 * @properties={typeid:24,uuid:"4191A940-0387-4CBE-94AF-0C6DEF91A99A"}
 */
function onLoginError(error) {
	plugins.dialogs.showInfoDialog('INFO', error)
}