app.controller('AddCostCenterController', [
  '$state',
  'AddCostCenterService',
  function($state, AddCostCenterService) {
    const cs = this;
    cs.isSubmittingForm = false;

    const preparePayloadToRequest = function(costCenter) {
      return {
        code: costCenter.code,
        status: costCenter.status,
        createdAt: new Date().toISOString(),
        description: costCenter.description || '',
        companyCode: costCenter.companyCode,
        profitCenter: costCenter.profitCenter || '',
      };
    };

    cs.newCostCenter = {
      status: false,
    };

    cs.onCancelAddCostCenter = function() {
      $state.go('cost-center');
    };

    cs.onAddCostCenterSubmit = function(costCenterForm) {
      cs.costCenterForm = costCenterForm;

      if (
        costCenterForm['code'].$error.required ||
        costCenterForm['companyCode'].$error.required
      ) {
        return;
      }

      cs.isSubmittingForm = true;

      AddCostCenterService.createCostCenter(
        preparePayloadToRequest(cs.newCostCenter)
      )
        .then(function(data) {
          cs.isSubmittingForm = false;
          $state.go('cost-center');
        })
        .catch(function(error) {
          console.log(error);
        });
    };
  },
]);
