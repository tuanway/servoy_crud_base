/**
 * @param {JSEvent} event
 * @override
 *
 * @properties={typeid:24,uuid:"58E900DC-0D09-4EDF-8778-ED109EA17207"}
 */
function onLoad(event) {		
	_super.onLoad(event);
	
	var menu = [{
		id: 'intro',
		text: "Home",
		iconStyleClass: "glyphicon glyphicon glyphicon-menu-hamburger"
	}, {
		isDivider: true
	}, {
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
	}]
	elements.nav.setRootMenuItems(menu);
}
