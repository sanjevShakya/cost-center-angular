app.service('CostCenterService', [
  '$http',
  'APP_CONSTANTS',
  function($http, APP_CONSTANTS) {
    const cs = this;
    const COST_CENTER_RESOURCE = APP_CONSTANTS.rootUrl;

    const COST_CENTER_BY_ID = function(id) {
      return COST_CENTER_RESOURCE + '/' + id;
    };

    cs.fetchCostCenters = function(page, pageSize) {
      return $http.get(
        COST_CENTER_RESOURCE +
          '?_sort=createdAt&_order=desc&_page=' +
          page +
          '&_limit=' +
          pageSize
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

app.controller('CostCenterController', [
  '$http',
  '$state',
  '$location',
  'APP_CONSTANTS',
  'CostCenterService',

  function($http, $state, $location, APP_CONSTANTS, CostCenterService) {
    const cs = this;
    cs.page = 1;
    cs.hasMore = true;
    cs.pageSize = APP_CONSTANTS.pageSize;
    cs.costCenters = [];

    const prepareCostCenterData = function(data) {
      return Object.assign(
        {
          isSelected: false,
          createdDate: new Date(data.createdAt).toLocaleDateString(),
          statusName: data.status
            ? APP_CONSTANTS.status.active
            : APP_CONSTANTS.status.inActive,
        },
        data
      );
    };

    const init = function() {
      CostCenterService.fetchCostCenters(cs.page, cs.pageSize)
        .then(function(data) {
          cs.costCenters = data.data.map(prepareCostCenterData);
        })
        .catch(function(err) {
          console.log(err);
        });
    };

    init();

    const preparePayloadToRequest = function(costCenter) {
      return {
        code: costCenter.code,
        status: costCenter.status,
        createdAt: costCenter.createdAt,
        description: costCenter.description,
        companyCode: costCenter.companyCode,
        profitCenter: costCenter.profitCenter,
      };
    };

    cs.onShowDetail = function(id) {
      console.log('id', id);
      $state.go('cost-center-detail', { costCenterId: id });
    };

    cs.onCostCenterSelect = function(event, value) {
      event.stopPropagation();
      value.isSelected = value.isSelected;
    };

    cs.onActivate = function() {
      const inActiveCostCenters = cs.costCenters
        .filter(function(cs) {
          return (
            cs.statusName === APP_CONSTANTS.status.inActive &&
            cs.isSelected === true
          );
        })
        .map(function(costCenter) {
          return {
            id: costCenter.id,
            status: true,
            createdAt: costCenter.createdAt,
            code: costCenter.code,
            description: costCenter.description,
            companyCode: costCenter.companyCode,
            profitCenter: costCenter.profitCenter,
          };
        });

      if (!inActiveCostCenters) {
        return;
      }

      Promise.all(
        inActiveCostCenters.map(function(costCenter) {
          return CostCenterService.markStatusCostCenter(
            costCenter.id,
            preparePayloadToRequest(costCenter)
          );
        })
      )
        .then(function(data) {
          init();
        })
        .catch(function(error) {
          console.log(error);
        });

      // TODO put req
    };

    cs.onDeactivate = function() {
      const activeCostCenters = cs.costCenters
        .filter(function(cs) {
          return (
            cs.statusName === APP_CONSTANTS.status.active &&
            cs.isSelected === true
          );
        })
        .map(function(costCenter) {
          return {
            id: costCenter.id,
            status: false,
            createdAt: costCenter.createdAt,
            code: costCenter.code,
            description: costCenter.description,
            companyCode: costCenter.companyCode,
            profitCenter: costCenter.profitCenter,
          };
        });

      if (!activeCostCenters) {
        return;
      }

      Promise.all(
        activeCostCenters.map(function(costCenter) {
          return CostCenterService.markStatusCostCenter(
            costCenter.id,
            preparePayloadToRequest(costCenter)
          );
        })
      )
        .then(function(data) {
          init();
        })
        .catch(function(error) {
          console.log(error);
        });
    };

    cs.onAddCostCenter = function() {
      $location.path('/cost-center/add');
    };

    cs.onDeleteClick = function($event, costCenter) {
      $event.stopPropagation();
      CostCenterService.deleteCostCenter(costCenter.id)
        .then(function(data) {
          init();
        })
        .catch(function(error) {
          console.log(error);
        });
    };

    cs.fetchPage = function(page) {
      CostCenterService.fetchCostCenters(page, cs.pageSize)
        .then(function(data) {
          cs.costCenters = data.data.map(prepareCostCenterData);
          cs.page = page;
          if (cs.costCenters.length <= 0) {
            cs.hasMore = false;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    };

    cs.fetchNextPage = function(page) {
      if (!cs.hasMore) {
        return;
      }
      cs.fetchPage(page);
    };

    cs.fetchPrevPage = function(page) {
      cs.hasMore = true;

      if (parseInt(page) <= 0) {
        return;
      }

      cs.fetchPage(page);
    };
  },
]);
