var app = angular.module('costCenterApp', ['ui.router', 'costCenter.constant']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('cost-center', {
        url: '/cost-center',
        controllerAs: 'cs',
        controller: 'CostCenterController',
        templateUrl: 'partials/cost-center.html',
      })
      .state('cost-center-detail', {
        url: '/cost-center/:costCenterId',
        controllerAs: 'cs',
        controller: 'CostCenterDetailController',
        templateUrl: 'partials/cost-center-detail.html',
      })
      .state('add-cost-center', {
        url: '/cost-center/add',
        controllerAs: 'cs',
        controller: 'AddCostCenterController',
        templateUrl: 'partials/add-cost-center.html',
      });

    $urlRouterProvider.otherwise('/cost-center');
  },
]);

app.component('spinner', {
  templateUrl: 'partials/spinner.html',
  controller: 'SpinnerController',
  controllerAs: 'vm',
  bindings: {
    visible: '=',
  },
});

app.controller('SpinnerController', [
  function() {
    const vm = this;
  },
]);
