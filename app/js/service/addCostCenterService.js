app.service('AddCostCenterService', [
  '$http',
  'APP_CONSTANTS',
  function($http, APP_CONSTANTS) {
    const cs = this;
    const COST_CENTER_API = APP_CONSTANTS.rootUrl;

    cs.createCostCenter = function(costCenter) {
      return $http.post(COST_CENTER_API, costCenter);
    };
  },
]);
