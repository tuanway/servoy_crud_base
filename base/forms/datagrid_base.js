
/**
 * Called when the columns data is changed.
 *
 * @param {Number} foundsetindex
 * @param {Number} [columnindex]
 * @param {object} [oldvalue]
 * @param {object} [newvalue]
 *
 * @return {boolean}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"C18298F5-36EC-4D09-BD5F-4B84EA08F578"}
 */
function onColumnDataChange(foundsetindex, columnindex, oldvalue, newvalue) {
	_super.onElementDataChange(oldvalue,newvalue,null)
	return true;
	
}

/**
 * Called when the mouse is clicked on a row/cell (foundset and column indexes are given).
 * the foundsetindex is always -1 when there are grouped rows
 * the record is not an actual JSRecord but an object having the dataprovider values of the clicked record
 *
 * @param {Number} foundsetindex
 * @param {Number} [columnindex]
 * @param {object} [record]
 * @param {JSEvent} [event]
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"96A662FE-4D38-4598-A0B0-446D54BC28A6"}
 */
function onCellClick(foundsetindex, columnindex, record, event) {
}
