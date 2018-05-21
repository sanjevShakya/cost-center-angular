app.component('spinner', {
  templateUrl: 'partials/spinner.html',
  controller: function() {
    const vm = this;
  },
  controllerAs: 'vm',
  bindings: {
    visible: '=',
  },
});
