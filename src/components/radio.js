var _clone = require('lodash/clone');
module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(formioComponentsProvider) {
      formioComponentsProvider.register('radio', {
        icon: 'fa fa-dot-circle-o',
        views: [
          {
            name: 'Display',
            template: 'formio/components/radio/display.html'
          },
          {
            name: 'Data',
            template: 'formio/components/data-with-datasource.html'
          },
          {
            name: 'Validation',
            template: 'formio/components/radio/validate.html'
          },
          {
            name: 'API',
            template: 'formio/components/common/api.html'
          },
          {
            name: 'Layout',
            template: 'formio/components/common/layout.html'
          },
          {
            name: 'Conditional',
            template: 'formio/components/common/conditional.html'
          }
        ],
        onEdit: ['$scope', 'FormioUtils', function($scope, FormioUtils) {
          $scope.dataSources = {
            values: 'Values',
            json: 'Raw JSON',
            url: 'URL',
            resource: 'Resource',
            custom: 'Custom'
          };
          $scope.resources = [];
          $scope.resourceFields = [];

          // Returns only input fields we are interested in.
          var getInputFields = function(components) {
            var fields = [];
            FormioUtils.eachComponent(components, function(component) {
              if (component.key && component.input && (component.type !== 'button') && component.key !== $scope.component.key) {
                var comp = _clone(component);
                if (!comp.label) {
                  comp.label = comp.key;
                }
                fields.push(comp);
              }
            });
            return fields;
          };

          $scope.formFields = [{label: 'Any Change', key: 'data'}].concat(getInputFields($scope.form.components));

          // Loads the selected fields.
          var loadFields = function() {
            if (!$scope.component.data.resource || ($scope.resources.length === 0)) {
              return;
            }
            var selected = null;
            $scope.resourceFields = [
              {
                property: '',
                title: '{Entire Object}'
              },
              {
                property: '_id',
                title: 'Submission Id'
              }
            ];
            if ($scope.formio.projectId) {
              $scope.component.data.project = $scope.formio.projectId;
            }
            for (var index in $scope.resources) {
              if ($scope.resources[index]._id.toString() === $scope.component.data.resource) {
                selected = $scope.resources[index];
                break;
              }
            }
            if (selected) {
              var fields = getInputFields(selected.components);
              for (var i in fields) {
                var field = fields[i];
                var title = field.label || field.key;
                $scope.resourceFields.push({
                  property: 'data.' + field.key,
                  title: title
                });
              }
              if (!$scope.component.valueProperty && $scope.resourceFields.length) {
                $scope.component.valueProperty = $scope.resourceFields[0].property;
              }
            }
          };

          $scope.$watch('component.dataSrc', function(source) {
            if (($scope.resources.length === 0) && (source === 'resource')) {
              $scope.formio.loadForms({params: {type: 'resource', limit: 4294967295}}).then(function(resources) {
                $scope.resources = resources;
                loadFields();
              });
            }
          });

          // Trigger when the resource changes.
          $scope.$watch('component.data.resource', function(resourceId) {
            if (!resourceId) {
              return;
            }
            loadFields();
          });

          // Update other parameters when the value property changes.
          $scope.currentValueProperty = $scope.component.valueProperty;
          $scope.$watch('component.valueProperty', function(property) {
            if ($scope.component.dataSrc === 'resource' && $scope.currentValueProperty !== property) {
              if (!property) {
                $scope.component.searchField = '';
                $scope.component.template = '<span>{{ item.data }}</span>';
              }
              else {
                $scope.component.searchField = property + '__regex';
                $scope.component.template = '<span>{{ item.' + property + ' }}</span>';
              }
            }
          });

          loadFields();
        }],
        documentation: 'http://help.form.io/userguide/#radio'
      });
    }
  ]);
  app.run([
    '$templateCache',
    function($templateCache) {
      // Create the settings markup.
      $templateCache.put('formio/components/radio/display.html',
        '<ng-form>' +
          '<form-builder-option property="label"></form-builder-option>' +
          '<form-builder-option property="customClass"></form-builder-option>' +
          '<form-builder-option property="tabindex"></form-builder-option>' +
          '<form-builder-option property="inline" type="checkbox" label="Inline Layout" title="Displays the radio buttons horizontally."></form-builder-option>' +
          '<form-builder-option property="clearOnHide"></form-builder-option>' +
          '<form-builder-option property="protected"></form-builder-option>' +
          '<form-builder-option property="persistent"></form-builder-option>' +
          '<form-builder-option property="hidden"></form-builder-option>' +
          '<form-builder-option property="disabled"></form-builder-option>' +
          '<form-builder-option property="tableView"></form-builder-option>' +
        '</ng-form>'
      );
      // Create the API markup.
      $templateCache.put('formio/components/radio/validate.html',
        '<ng-form>' +
          '<form-builder-option property="validate.required"></form-builder-option>' +
          '<form-builder-option-custom-validation></form-builder-option-custom-validation>' +
        '</ng-form>'
      );
    }
  ]);
};
