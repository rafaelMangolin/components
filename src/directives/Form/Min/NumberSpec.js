describe('Gumga.core:directives:MinNumber', function() {

  var compile, mockBackend, scope;
  beforeEach(module('gumga.directives.form.min.number'));
  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope;
    var element = angular.element(
      '<form name="myForm">' +
      '<input type="number" name="idade" ng-model="pessoa.idade" gumga-min-number="18">' +
      '</form>'
      );
    scope.pessoa = { idade: null };
    $compile(element)(scope);
    scope.$digest();
    form = scope.myForm;
  }));

  it('should valid input value',function() {
    form.idade.$setViewValue(20);
    expect(scope.pessoa.idade).toEqual(20);
    expect(form.idade.$valid).toBe(true);
  });
  it('should invalid input value',function() {
    form.idade.$setViewValue(15);
    expect(scope.pessoa.idade).toEqual(15);
    expect(form.idade.$valid).toBe(false);
  });
});
