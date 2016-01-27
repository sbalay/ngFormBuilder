app.config([
  'formioComponentsProvider',
  function(formioComponentsProvider) {
    formioComponentsProvider.register('container', {
      fbtemplate: 'formio/formbuilder/container.html',
      views: [{
        name: 'Display',
        template: 'formio/components/container/display.html'
      }, {
        name: 'API',
        template: 'formio/components/common/api.html'
      }],
      documentation: 'http://help.form.io/userguide/#container',
      noDndOverlay: true,
      confirmRemove: true
    });
  }
]);

app.run([
  '$templateCache',
  function($templateCache) {
    $templateCache.put('formio/components/container/display.html',
      '<ng-form>' +
      '<form-builder-option property="label"></form-builder-option>' +
      '<form-builder-option property="customClass"></form-builder-option>' +
      '<form-builder-option property="striped"></form-builder-option>' +
      '<form-builder-option property="bordered"></form-builder-option>' +
      '<form-builder-option property="hover"></form-builder-option>' +
      '<form-builder-option property="condensed"></form-builder-option>' +
      '<form-builder-option property="protected"></form-builder-option>' +
      '<form-builder-option property="persistent"></form-builder-option>' +
      '<form-builder-option property="tableView"></form-builder-option>' +
      '</ng-form>'
    );

    $templateCache.put('formio/formbuilder/container.html',
      '<div class="panel panel-default">' +
      '<div class="panel-heading">' +
      '<h3 class="panel-title">{{ component.label}}</h3>' +
      '</div>' +
      '<div class="panel-body">' +
      '<form-builder-list class="formio-row" component="component" form="form" formio="formio"></form-builder-list>' +
      '</div>' +
      '</div>'
    );
  }
]);