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

app.controller('CostCenterDetailController', [
  '$http',
  '$stateParams',
  'CostCenterDetailService',
  function($http, $stateParams, CostCenterDetailService) {
    const cs = this;

    cs.id = $stateParams.costCenterId;
    cs.costCenterDetail = {};

    const init = function() {
      CostCenterDetailService.fetchCostCenterById(cs.id)
        .then(function(data) {
          cs.costCenterDetail = data.data;
        })
        .catch(function(err) {
          // TODO handle error
          console.log(err);
        });
    };

    init();
  },
]);
