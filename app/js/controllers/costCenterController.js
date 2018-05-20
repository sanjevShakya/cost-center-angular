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

app.controller('CostCenterController', [
  '$http',
  '$state',
  '$location',
  'APP_CONSTANTS',
  'CostCenterService',

  function($http, $state, $location, APP_CONSTANTS, CostCenterService) {
    const cs = this;
    cs.searchValue = '';
    cs.isSearchActive = false;
    cs.isListFetching = false;
    cs.isActivatingRecords = false;
    cs.isDeactivatingRecords = false;
    cs.isVisible = false;
    cs.page = 1;
    cs.hasMore = true;
    cs.pageSize = APP_CONSTANTS.pageSize;
    cs.costCenters = [];
    cs.totalCostCenters = 0;
    cs.totalPages = 0;
    cs.pages = [];

    const prepareCostCenterData = function(data) {
      return Object.assign(
        {
          isSelected: false,
          isDeleting: false,
          createdDate: new Date(data.createdAt).toLocaleDateString(),
          statusName: data.status
            ? APP_CONSTANTS.status.active
            : APP_CONSTANTS.status.inActive,
        },
        data
      );
    };

    const fetchTotalCostCenters = function() {
      CostCenterService.fetchAllCostCenters(cs.searchValue)
        .then(function(data) {
          cs.totalCostCenters = data.data.length || 0;
          cs.totalPages = Math.ceil(cs.totalCostCenters / cs.pageSize);
          if (cs.totalPages) {
            const newPages = [];
            for (var i = 1; i <= cs.totalPages; i++) {
              newPages.push(i);
            }
            cs.pages = newPages;
          }
        })
        .catch(function(err) {
          // TODO handle error

          console.log(err);
        });
    };

    const init = function() {
      cs.isListFetching = true;

      fetchTotalCostCenters();

      CostCenterService.fetchCostCenters(cs.page, cs.pageSize)
        .then(function(data) {
          cs.isListFetching = false;
          cs.costCenters = data.data.map(prepareCostCenterData);
        })
        .catch(function(err) {
          cs.isListFetching = false;
          // TODO handle error
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

    const fetchCostCenters = function(page, searchValue) {
      if (!page) {
        page = cs.page;
      }

      if (!searchValue) {
        searchValue = cs.searchValue;
      }

      CostCenterService.fetchCostCenters(page, cs.pageSize, searchValue)
        .then(function(data) {
          cs.costCenters = data.data.map(prepareCostCenterData);
          cs.page = page;
          if (cs.costCenters.length < cs.pageSize && cs.page !== 1) {
            cs.hasMore = false;
          } else {
            cs.hasMore = true;
          }
          cs.isSearchActive = false;
        })
        .catch(function(error) {
          // TODO handle error
          console.log(error);
          cs.isSearchActive = false;
        });
    };

    cs.onShowDetail = function(id) {
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
      cs.isActivatingRecords = true;

      Promise.all(
        inActiveCostCenters.map(function(costCenter) {
          return CostCenterService.markStatusCostCenter(
            costCenter.id,
            preparePayloadToRequest(costCenter)
          );
        })
      )
        .then(function(data) {
          fetchCostCenters(cs.page, cs.searchValue);
          cs.isActivatingRecords = false;
        })
        .catch(function(error) {
          // TODO handle error
          console.log(error);
        });
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

      cs.isDeactivatingRecords = true;

      Promise.all(
        activeCostCenters.map(function(costCenter) {
          return CostCenterService.markStatusCostCenter(
            costCenter.id,
            preparePayloadToRequest(costCenter)
          );
        })
      )
        .then(function(data) {
          fetchCostCenters(cs.page, cs.searchValue);
          cs.isDeactivatingRecords = false;
        })
        .catch(function(error) {
          // TODO handle error
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
          fetchCostCenters(cs.page, cs.searchValue);
        })
        .catch(function(error) {
          // TODO handle error
          console.log(error);
        });
    };

    cs.fetchPage = function(page) {
      fetchCostCenters(page);
    };

    cs.onSearchChange = function() {
      cs.isSearchActive = true;
      fetchCostCenters(cs.page, cs.searchValue);
      fetchTotalCostCenters();
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
