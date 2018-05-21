app.service('CostCenterDetailService', [
  '$http',
  'APP_CONSTANTS',
  function($http, APP_CONSTANTS) {
    const cs = this;
    const COST_CENTER_BY_ID = function(id) {
      return APP_CONSTANTS.rootUrl + '/' + id;
    };

    cs.fetchCostCenterById = function(id) {
      return $http.get(COST_CENTER_BY_ID(id));
    };
  },
]);
