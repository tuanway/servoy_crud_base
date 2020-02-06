/**
 * @override
 * @properties={typeid:24,uuid:"69239016-5DC9-49DF-8FAF-20AD33448D78"}
 */
function new_record() {
	_super.new_record.apply(this, arguments);
	foundset.getSelectedRecord().orderdate = new Date();		
}
