/**
 * Called when the mouse is clicked on a row/cell (foundset and column indexes are given) or.
 * when the ENTER key is used then only the selected foundset index is given
 * Use the record to exactly match where the user clicked on
 *
 * @param {Number} foundsetindex
 * @param {Number} [columnindex]
 * @param {JSRecord} [record]
 * @param {JSEvent} [event]
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"2B68FB79-FF3A-4896-BEAF-ACB832B0C7C0"}
 */
function onCellClick(foundsetindex, columnindex, record, event) {
	if (elements.grid.getColumn(columnindex).styleClass == 'delete_btn') {
		delete_record();
	}
}
