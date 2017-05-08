module.exports = function(app) {
  app.run([
    '$templateCache',
    function($templateCache) {
      // Create the component markup.
      $templateCache.put('formio/components/display.html',
        '<ng-form>' +
          '<form-builder-option property="label"></form-builder-option>' +
          '<form-builder-option property="customClass"></form-builder-option>' +
          '<form-builder-option property="tabindex"></form-builder-option>' +
          '<form-builder-option property="inline" type="checkbox" label="Inline Layout" title="Displays the component horizontally."></form-builder-option>' +
          '<form-builder-option property="clearOnHide"></form-builder-option>' +
          '<form-builder-option property="protected"></form-builder-option>' +
          '<form-builder-option property="persistent"></form-builder-option>' +
          '<form-builder-option property="hidden"></form-builder-option>' +
          '<form-builder-option property="disabled"></form-builder-option>' +
          '<form-builder-option property="tableView"></form-builder-option>' +
        '</ng-form>'
      );

      $templateCache.put('formio/components/settings.html',
        '<form id="component-settings" novalidate>' +
          '<div class="row">' +
            '<div class="col-md-6">' +
              '<p class="lead" ng-if="::formComponent.title" style="margin-top:10px;">{{::formComponent.title}} {{\'Component\' | formioTranslate}}</p>' +
            '</div>' +
            '<div class="col-md-6">' +
              '<div class="pull-right" ng-if="::formComponent.documentation" style="margin-top:10px; margin-right:20px;">' +
                '<a ng-href="{{ ::formComponent.documentation }}" target="_blank"><i class="glyphicon glyphicon-new-window"></i> {{\'Help!\' | formioTranslate}}</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="row">' +
            '<div class="col-xs-6">' +
              '<uib-tabset>' +
                '<uib-tab ng-repeat="view in ::formComponent.views" heading="{{ ::view.name | formioTranslate }}"><ng-include src="::view.template"></ng-include></uib-tab>' +
              '</uib-tabset>' +
            '</div>' +
            '<div class="col-xs-6">' +
              '<div class="panel panel-default preview-panel" style="margin-top:44px;">' +
                '<div class="panel-heading">{{\'Preview\' | formioTranslate}}</div>' +
                '<div class="panel-body">' +
                  '<div class="form-group" ng-if="component.wysiwyg && editorVisible">' +
                    '<label for="editor-preview" class="control-label" ng-if="component.label">{{ component.label }}</label>' +
                    '<textarea class="form-control" id="editor-preview" ng-if="component.wysiwyg && editorVisible" ckeditor="component.wysiwyg"></textarea>' +
                  '</div>' +
                  '<formio-component ng-if="!component.wysiwyg" component="component" data="{}" formio="::formio"></formio-component>' +
                '</div>' +
              '</div>' +
              '<formio-settings-info component="component" data="{}" formio="::formio"></formio-settings-info>' +
              '<div class="form-group">' +
                '<button type="submit" class="btn btn-success" ng-click="closeThisDialog(true)">{{\'Save\' | formioTranslate}}</button>&nbsp;' +
                '<button type="button" class="btn btn-default" ng-click="closeThisDialog(false)" ng-if="!component.isNew">{{\'Cancel\' | formioTranslate}}</button>&nbsp;' +
                '<button type="button" class="btn btn-danger" ng-click="removeComponent(component, formComponents[component.type].confirmRemove); closeThisDialog(false)">{{\'Remove\' | formioTranslate}}</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</form>'
      );

      $templateCache.put('formio/components/data-with-datasource.html',
        '<ng-form>' +
          '<div class="form-group">' +
            '<label for="dataSrc" form-builder-tooltip="The source to use for the component data. Values lets you provide your own values and labels. JSON lets you provide raw JSON data. URL lets you provide a URL to retrieve the JSON data from.">Data Source Type</label>' +
            '<select class="form-control" id="dataSrc" name="dataSrc" ng-model="component.dataSrc" ng-options="value as label for (value, label) in dataSources"></select>' +
          '</div>' +
          '<ng-switch on="component.dataSrc">' +
            '<div class="form-group" ng-switch-when="json">' +
              '<label for="data.json" form-builder-tooltip="A raw JSON array to use as a data source.">Data Source Raw JSON</label>' +
              '<textarea class="form-control" id="data.json" name="data.json" ng-model="component.data.json" placeholder="Raw JSON Array" json-input rows="3">{{ component.data.json }}</textarea>' +
            '</div>' +
            '<form-builder-option ng-switch-when="url" property="data.url" label="Data Source URL" placeholder="Data Source URL" title="A URL that returns a JSON array to use as the data source."></form-builder-option>' +
            '<value-builder ng-switch-when="values" data="component.data.values" label="Data Source Values" tooltip-text="Values to use as the data source. Labels are shown in the select field. Values are the corresponding values saved with the submission."></value-builder>' +
          '<div class="form-group" ng-switch-when="resource">' +
            '<label for="placeholder" form-builder-tooltip="The resource to be used with this field.">Resource</label>' +
            '<ui-select ui-select-required ui-select-open-on-focus ng-model="component.data.resource" theme="bootstrap">' +
              '<ui-select-match class="ui-select-match" placeholder="">' +
                '{{$select.selected.title}}' +
              '</ui-select-match>' +
              '<ui-select-choices class="ui-select-choices" repeat="value._id as value in resources | filter: $select.search" refresh="refreshSubmissions($select.search)" refresh-delay="250">' +
                '<div ng-bind-html="value.title | highlight: $select.search"></div>' +
              '</ui-select-choices>' +
            '</ui-select>' +
          '</div>' +
          '</ng-switch>' +
          '<form-builder-option ng-hide="component.dataSrc !== \'url\'" property="selectValues" label="Data Path" type="text" placeholder="The object path to the iterable items." title="The property within the source data, where iterable items reside. For example: results.items or results[0].items"></form-builder-option>' +
          '<form-builder-option ng-hide="component.dataSrc == \'values\' || component.dataSrc == \'resource\' || component.dataSrc == \'custom\'" property="valueProperty" label="Value Property" placeholder="The selected item\'s property to save." title="The property of each item in the data source to use as the selected value. If not specified, the item itself will be used."></form-builder-option>' +
          '<form-builder-option ng-hide="component.type == \'select\' || component.dataSrc == \'values\' || component.dataSrc == \'resource\' || component.dataSrc == \'custom\'" property="labelProperty" label="Label Property" placeholder="The selected item\'s property to display." title="The property of each item in the data source to use as the label. If not specified, the item itself will be used."></form-builder-option>' +
          '<div class="form-group" ng-hide="component.dataSrc !== \'resource\' || !component.data.resource || resourceFields.length == 0">' +
            '<label for="placeholder" form-builder-tooltip="The field to use as the value.">Value</label>' +
            '<select class="form-control" id="valueProperty" name="valueProperty" ng-options="value.property as value.title for value in resourceFields" ng-model="component.valueProperty"></select>' +
          '</div>' +
          '<div class="form-group" ng-if="component.dataSrc == \'resource\' && component.valueProperty === \'\'">' +
          '  <label for="placeholder" form-builder-tooltip="The properties on the resource to return as part of the options. Separate property names by commas. If left blank, all properties will be returned.">Select Fields</label>' +
          '  <input type="text" class="form-control" id="selectFields" name="selectFields" ng-model="component.selectFields" placeholder="Comma separated list of fields to select." value="{{ component.selectFields }}">' +
          '</div>' +
          // aca es distinto. lina de abajo
          '<form-builder-option ng-show="component.type == \'select\' && (component.dataSrc == \'url\' || component.dataSrc == \'resource\')" property="searchField" label="Search Query Name" placeholder="Name of URL query parameter" title="The name of the search querystring parameter used when sending a request to filter results with. The server at the URL must handle this query parameter."></form-builder-option>' +
          '<form-builder-option ng-show="component.dataSrc == \'url\' || component.dataSrc == \'resource\'" property="filter" label="Filter Query" placeholder="The filter query for results." title="Use this to provide additional filtering using query parameters."></form-builder-option>' +
          '<form-builder-option ng-show="component.type == \'select\' && (component.dataSrc == \'url\' || component.dataSrc == \'resource\' || component.dataSrc == \'json\')" property="limit" label="Limit" placeholder="Maximum number of items to view per page of results." title="Use this to limit the number of items to request or view."></form-builder-option>' +
          '<div class="form-group" ng-show="component.type == \'select\' && component.dataSrc == \'json\'">' +
          '  <label for="filter" form-builder-tooltip="The filter type for search.">Search Filter</label>' +
          '  <select class="form-control" id="filter" name="filter" ng-model="component.filter" ng-options="value as label for (value, label) in {none: \'No Search\', contains: \'Contains\', startsWith: \'Starts With\'}"></select>' +
          '</div>' +
          '<div class="form-group" ng-show="component.dataSrc == \'custom\'">' +
          '  <label for="custom" form-builder-tooltip="Write custom code to return the value options. The form data object is available.">Custom Values</label>' +
          '  <textarea class="form-control" rows="10" id="custom" name="custom" ng-model="component.data.custom" placeholder="/*** Example Code ***/\nvalues = data[\'mykey\'];">{{ component.data.custom }}</textarea>' +
          '</div>' +
          '<div class="form-group" ng-show="component.type == \'select\'">' +
            '<label for="placeholder" form-builder-tooltip="The HTML template for the result data items.">Item Template</label>' +
            '<textarea class="form-control" id="template" name="template" ng-model="component.template" rows="3">{{ component.template }}</textarea>' +
          '</div>' +
          '<div class="form-group" ng-hide="component.dataSrc == \'values\' || component.dataSrc == \'json\'">' +
          '  <label for="placeholder" form-builder-tooltip="Refresh data when another field changes.">Refresh On</label>' +
          '  <select class="form-control" id="refreshOn" name="refreshOn" ng-options="field.key as field.label for field in formFields" ng-model="component.refreshOn"></select>' +
          '</div>' +
          '<form-builder-option ng-show="component.dataSrc == \'resource\' || component.dataSrc == \'url\' || component.dataSrc == \'custom\'" property="clearOnRefresh"></form-builder-option>' +
          '<form-builder-option ng-show="component.dataSrc == \'url\'" property="authenticate"></form-builder-option>' +
          '<form-builder-option property="defaultValue"></form-builder-option>' +
        '</ng-form>'
      );

      // Create the common API tab markup.
      $templateCache.put('formio/components/common/data.html',
        '<form-builder-option property="defaultValue"></form-builder-option>' +
        '<uib-accordion>' +
        '  <div uib-accordion-group heading="Custom Default Value" class="panel panel-default">' +
        '    <textarea class="form-control" rows="5" id="customDefaultValue" name="customDefaultValue" ng-model="component.customDefaultValue" placeholder="/*** Example Code ***/\nvalue = data[\'mykey\'] + data[\'anotherKey\'];"></textarea>' +
        '    <small>' +
        '      <p>Enter custom default value code.</p>' +
        '      <p>You must assign the <strong>value</strong> variable as the result you want for the default value.</p>' +
        '      <p>The global variable <strong>data</strong> is provided, and allows you to access the data of any form component, by using its API key.</p>' +
        '      <p>Default Values are only calculated on form load. Use Calculated Value for a value that will update with the form.</p>' +
        '    </small>' +
        '  </div>' +
        '  <div uib-accordion-group heading="Calculated Value" class="panel panel-default">' +
        '    <textarea class="form-control" rows="5" id="calculateValue" name="calculateValue" ng-model="component.calculateValue" placeholder="/*** Example Code ***/\nvalue = data[\'mykey\'] + data[\'anotherKey\'];"></textarea>' +
        '    <small>' +
        '      <p>Enter code to calculate a value.</p>' +
        '      <p>You must assign the <strong>value</strong> variable as the result you want for the default value.</p>' +
        '      <p>The global variable <strong>data</strong> is provided, and allows you to access the data of any form component, by using its API key.</p>' +
        '    </small>' +
        '  </div>' +
        '</uib-accordion>'
      );

      // Create the common API tab markup.
      $templateCache.put('formio/components/common/api.html',
        '<ng-form>' +
          '<form-builder-option-key></form-builder-option-key>' +
          '<form-builder-option-tags></form-builder-option-tags>' +
        '</ng-form>'
      );

      // Create the common Layout tab markup.
      $templateCache.put('formio/components/common/layout.html',
        '<ng-form>' +
          // Need to use array notation to have dash in name
          '<form-builder-option property="style[\'margin-top\']"></form-builder-option>' +
          '<form-builder-option property="style[\'margin-right\']"></form-builder-option>' +
          '<form-builder-option property="style[\'margin-bottom\']"></form-builder-option>' +
          '<form-builder-option property="style[\'margin-left\']"></form-builder-option>' +
          '<uib-accordion>' +
          '  <div uib-accordion-group heading="Overlay" class="panel panel-default">' +
          '    <div class="form-group">' +
          '      <label for="overlay-style">Style</label>' +
          '      <input class="form-control" id="overlay-style" name="overlay-style" ng-model="component.overlay.style"></input>' +
          '    </div>' +
          '    <div class="form-group">' +
          '      <label for="overlay-left">Left</label>' +
          '      <input class="form-control" id="overlay-left" name="overlay-left" ng-model="component.overlay.left"></input>' +
          '    </div>' +
          '    <div class="form-group">' +
          '      <label for="overlay-right">Top</label>' +
          '      <input class="form-control" id="overlay-top" name="overlay-top" ng-model="component.overlay.top"></input>' +
          '    </div>' +
          '    <div class="form-group">' +
          '      <label for="overlay-width">Width</label>' +
          '      <input class="form-control" id="overlay-width" name="overlay-width" ng-model="component.overlay.width"></input>' +
          '    </div>' +
          '    <div class="form-group">' +
          '      <label for="overlay-height">Height</label>' +
          '      <input class="form-control" id="overlay-height" name="overlay-height" ng-model="component.overlay.height"></input>' +
          '    </div>' +
          '  </div>' +
          '</uib-accordion>' +
        '</ng-form>'
      );

      // Create the common Layout tab markup.
      $templateCache.put('formio/components/common/conditional.html',
        '<form-builder-conditional></form-builder-conditional>'
      );

      $templateCache.put('formio/components/validate.html',
        '<ng-form>' +
          '<form-builder-option property="validate.required"></form-builder-option>' +
          '<form-builder-option-custom-validation></form-builder-option-custom-validation>' +
        '</ng-form>'
      );
    }
  ]);
};
