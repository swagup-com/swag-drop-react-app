const apiPaths = {
  accountProduct: id => `${apiPaths.accountProducts}${id}/`,
  accountProducts: '/account-products/',
  addresses: '/addresses/',
  contact: id => `${apiPaths.contacts}${id}/`,
  contacts: '/directory/',
  countries: '/countries/',
  designOrders: id => `${apiPaths.design(id)}orders/`,
  designs: '/designs/',
  employeeOrder: id => `${apiPaths.employeeOrders}${id}/`,
  employeeOrders: '/employee-orders/',
  individualPackPrices: '/shipping-prices/individual-packs/',
  opportunityProofs: id => `${apiPaths.opportunity(id)}proofs/`,
  orders: '/orders/',
  sizes: '/sizes/'
};

export default apiPaths;
