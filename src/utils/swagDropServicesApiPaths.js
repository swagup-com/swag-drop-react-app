const swagDropServicesApiPaths = {
  redeemPages: '/redeem-pages',
  redeemPage: slug => `/redeem-pages/${slug}`,
  redemptions: 'redemptions',
  verifyAddress: '/verifications/verify-address',
  verifyName: '/verifications/verify-project-name',
  export: id => `/redemptions/export/${id}` 
};

export default swagDropServicesApiPaths;
