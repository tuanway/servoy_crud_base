/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected 
 *
 * @properties={typeid:24,uuid:"B0A35247-6336-4C25-A9D7-5B78D9D0A38E"}
 */
function onLoad(event) {
	//register for navigation event
	scopes.svyNavigation.addNavigationListener(onOpenHandler);
	
	var menu = [{
			id: 'intro',
			text: "Home",
			iconStyleClass: "glyphicon glyphicon glyphicon-menu-hamburger"
		}, {
			isDivider: true
		}]
	elements.nav.setRootMenuItems(menu);
}

/** 
 * @param event
 * @private 
 * @properties={typeid:24,uuid:"DEB48F12-DB76-4F31-B6C5-C6C32CD99057"}
 */
function onOpenHandler(event) {
    if (event.getEventType() == scopes.svyNavigation.NAVIGATION_EVENT.AFTER_OPEN) { 
    	if (scopes.svyNavigation.getCurrentItem().getFormName() && forms[scopes.svyNavigation.getCurrentItem().getFormName()] && forms[scopes.svyNavigation.getCurrentItem().getFormName()].navAfterOpen)
    	forms[scopes.svyNavigation.getCurrentItem().getFormName()].navAfterOpen(scopes.svyNavigation.getCurrentItem().getCustomData());    	    	
    }
    
    if (event.getEventType() == scopes.svyNavigation.NAVIGATION_EVENT.BEFORE_CLOSE) {
    	if (scopes.svyNavigation.getCurrentItem().getFormName() && forms[scopes.svyNavigation.getCurrentItem().getFormName()] && forms[scopes.svyNavigation.getCurrentItem().getFormName()].navBeforeClose)
    	forms[scopes.svyNavigation.getCurrentItem().getFormName()].navBeforeClose();
    }
}

/**
 * @param {String} menuItemId
 * @param {JSEvent} event
 *
 * @return {boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3DBB66C3-337D-4891-9045-B4813C7802B2"}
 */
function onMenuItemSelected(menuItemId, event) {
	//add sticky menu
	if (menuItemId == 'intro') {
		elements.nav.open = !elements.nav.open;
		return true;
	}

	if (menuItemId == 'logout') {
		scopes.svySecurity.logout();
		return true;
	}

	if (menuItemId == 'configure') {
		//customize form
		forms.customize.customizeForms(elements.nav.containedForm);
		return true;
	}

	//check if there are edited records
	var re = databaseManager.getEditedRecords();
	if (re && re.length > 0) {
		plugins.webnotificationsToastr.info('Please finish editing first.');
		return false;
	}

	//if we are dealing with an item that has sub menus, allow opening the menu to see nested items.
	if (elements.nav.getMenuItem(menuItemId).menuItems) {
		if (elements.nav.isMenuItemExpanded(menuItemId)) {
			elements.nav.setMenuItemExpanded(menuItemId, false);
			elements.nav.getMenuItem(menuItemId).enabled = false;
		} else {
			elements.nav.setMenuItemExpanded(menuItemId, true);
			elements.nav.getMenuItem(menuItemId).enabled = true;
			elements.nav.open = true;
		}
		enableItem(menuItemId);
	}

	var item = new scopes.svyNavigation.NavigationItem(menuItemId);
	elements.nav.containedForm = menuItemId;
	scopes.svyNavigation.open(item);
	

	return true;
}

/**
 * @param menuItemId
 * @param {Boolean} [run]
 * @properties={typeid:24,uuid:"9E0C8BDB-E865-4410-A848-CABF4E0E8E71"}
 */
function enableItem(menuItemId, run) {
	if (run) {
		elements.nav.getMenuItem(menuItemId).enabled = true;
	} else {
		var d = new Date();
		d.setMilliseconds(d.getMilliseconds() + 500);
		plugins.scheduler.removeJob('resetMenu')
		plugins.scheduler.addJob('resetMenu', d, enableItem, [menuItemId, true])
	}
}

/**
 * Go to a menu item
 * @param {string} menuItemId
 * @param {Object} customData
 * @properties={typeid:24,uuid:"B5FC3FCD-47CD-4C72-9ED2-641EEF91588A"}
 */
function goTo(menuItemId, customData) {
	elements.nav.containedForm = menuItemId;
	var item = new scopes.svyNavigation.NavigationItem(menuItemId);
	item.setCustomData(customData);
	scopes.svyNavigation.open(item);
}
