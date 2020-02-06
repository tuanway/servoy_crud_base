
/**
 * @param {scopes.svySearch.SimpleSearch} s
 * @override
 *
 * @properties={typeid:24,uuid:"B6FB5481-9AAB-46E4-82C2-1303C0BD8A4A"}
 */
function setupSearchParams(s) {
	s.addSearchProvider('companyname');	
	s.addSearchProvider('customers_to_orders.shipcountry');
	s.addSearchProvider('customers_to_orders.shipcity');
}
