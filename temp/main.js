/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 * @override 
 * @private
 *
 * @properties={typeid:24,uuid:"9BEB7D62-BA49-44D8-8660-E00463B867FD"}
 */
function onLoad(event) {
	_super.onLoad(event);
	var menu = [{
			id: 'intro',
			text: "Scotia Home",
			iconStyleClass: "glyphicon glyphicon glyphicon-menu-hamburger"
		}, {
			isDivider: true
		},
		//		{
		//			id: 'crimes',
		//			text: "crime number table",
		//			iconStyleClass: "glyphicon glyphicon-menu-right"
		//		},
		{
			id: 'incident',
			text: "Incident",
			iconStyleClass: "fas fa-book-reader"
		}, /* {
		 id: 'example',
		 text: "UI Example 1",
		 iconStyleClass: "fas fa-coins"
		 }, {
		 id: 'example_2',
		 text: "UI Example 2",
		 iconStyleClass: "fas fa-coins"

		 }, {
		 id: 'example_3',
		 text: "UI Example 3",
		 iconStyleClass: "fas fa-coins"
		 }, {
		 id: 'example_4',
		 text: "UI Example 4",
		 iconStyleClass: "fas fa-id-card"
		 },*/ {
			id: 'support_tables',
			text: "Support Tables",
			iconStyleClass: "fas fa-table",
			menuItems: [{
				id: 'st_common_codes',
				text: "Common Codes",
				iconStyleClass: "glyphicon glyphicon-menu-right"
			}, { isDivider: true }, {
				id: 'agency',
				text: "Agency",
				iconStyleClass: "glyphicon glyphicon-menu-right"
			}, {
				id: 'assessqitems',
				text: "Assessment Questions",
				iconStyleClass: "glyphicon glyphicon-menu-right"
			}, {
				id: 'attorney',
				text: "Attorney",
				iconStyleClass: "glyphicon glyphicon-menu-right"
			}, {
				id: 'chargecode',
				text: "Charge Codes",
				iconStyleClass: "glyphicon glyphicon-menu-right"
			}, {
				id: 'cities',
				text: "Cities",
				iconStyleClass: "glyphicon glyphicon-menu-right"
			}]

		}, {
			id: 'theme',
			text: "Theme",
			iconStyleClass: "glyphicon glyphicon glyphicon-tasks"
		}, {
			id: 'configure',
			text: "Configure",
			iconStyleClass: "glyphicon glyphicon glyphicon-cog"
		}, {
			isDivider: true
		}, {
			id: 'logout',
			text: 'Exit',
			styleClass: "sn-large",
			iconStyleClass: "glyphicon glyphicon-off"
		}];

	elements.nav.setRootMenuItems(menu);
	setUserThemeProperties();
}

/**
 * @param {String} menuItemId
 * @param {JSEvent} event
 *
 * @return {boolean}
 * @override 
 * @private
 *
 * @properties={typeid:24,uuid:"76DF6447-582F-470F-ADAE-CBD3149362E3"}
 */
function onMenuItemSelected(menuItemId, event) {
	//add sticky menu
	if (menuItemId == 'intro') {
		elements.nav.open = !elements.nav.open;
		return true;
	}

	if (menuItemId == 'logout') {
		security.logout();
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

	if (menuItemId != 'support_tables') {
		elements.nav.containedForm = menuItemId;
		var item = new scopes.svyNavigation.NavigationItem(menuItemId);
		scopes.svyNavigation.open(item);		
	}
	return true;
}

/**
 * Set user theme on load
 * @properties={typeid:24,uuid:"FFC4DBD0-D311-4A1D-B81C-9663EBF24C84"}
 */
function setUserThemeProperties() {
	try {
		var userTheme = scopes.svyProperties.getUserPropertyValue('theme', 'string')
		if (userTheme) {
			application.overrideStyle('scotia.less', userTheme)
		}
	} catch (e) {
		application.output("error in main.js, setUserThemeProperties. " + e.message, LOGGINGLEVEL.ERROR);
	}
}
