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
