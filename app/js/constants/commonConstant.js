angular
  .module('costCenter.constant', ['costcenter.config'])
  .factory('APP_CONSTANTS', [
    'ENV',
    function(ENV) {
      return {
        rootUrl: ENV.API,
        hostName: ENV.HOST,
        pageSize: 8,
        status: {
          active: 'Active',
          inActive: 'Inactive',
        },
      };
    },
  ]);
