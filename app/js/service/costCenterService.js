app.service('CostCenterService', [
  '$http',
  'APP_CONSTANTS',
  function($http, APP_CONSTANTS) {
    const cs = this;
    const COST_CENTER_RESOURCE = APP_CONSTANTS.rootUrl;

    const COST_CENTER_BY_ID = function(id) {
      return COST_CENTER_RESOURCE + '/' + id;
    };

    cs.fetchAllCostCenters = function(search) {
      if (!search) {
        search = '';
      }

      return $http.get(COST_CENTER_RESOURCE + '?q=' + search);
    };

    cs.fetchCostCenters = function(page, pageSize, search) {
      if (!search) {
        search = '';
      }
      return $http.get(
        COST_CENTER_RESOURCE +
          '?_sort=createdAt&_order=desc&_page=' +
          page +
          '&_limit=' +
          pageSize +
          '&q=' +
          search
      );
    };

    cs.deleteCostCenter = function(id) {
      return $http.delete(COST_CENTER_BY_ID(id));
    };

    cs.markStatusCostCenter = function(id, costCenter) {
      return $http.put(COST_CENTER_BY_ID(id), costCenter);
    };
  },
]);
