(function(){
	'use strict';
  /**
   * @ngdoc directive
   * @name gumga.core:gumgaMinDate
   * @element input
   * @restrict A
   * @description O componente GumgaMinDate serve para validar datas mínimas em entradas de formulários.
   *
   * ## Nota
   * Esta diretiva suporta apenas **inputs** do tipo **date**. O valor do atributo/diretiva é **obrigatório** e deve ser uma **data**.
   *
	 * @param {String} label Usado na integração com {@link gumga.core:gumgaErrors} para indicar em qual campo se encontra o erro.
	 * Se o atributo for omitido, a diretiva usará o atributo name do input.
	 *
   * @example
   *  Um exemplo da directive GumgaMinDate funcionando pode ser encontrado [aqui](http://embed.plnkr.co/AcjqcgvgGhdJqDh72eHA).
   *  <pre>
   *    <form name="myForm">
   *      <input type="date" name="minDate" ng-model="minDate" gumga-min-date="2015-07-20">
   *      <p ng-show="myForm.minDate.$error.mindate" class="text-danger">Data inferior a esperada</p>
   *    </form>
   *  </pre>
  */
	 MinDate.$inject = ['$filter'];
	 function MinDate($filter) {
	 	return {
	 		restrict: 'A',
	 		require: 'ngModel',
	 		link: function (scope, elm, attrs, ctrl) {
	 			if (attrs.type != 'date') {
	 				throw 'Esta diretiva suporta apenas inputs do tipo date';
	 			}
	 			if (!attrs.gumgaMinDate) {
	 				throw "O valor da diretiva gumga-min-date não foi informado.";
	 			}
        // if (!GumgaDateService.validateFormat('YMD', attrs.gumgaMinDate)) {
        //   throw 'O valor da diretiva não corresponde ao formato yyyy-mm-dd';
        // }
        var validateMinDate = function (inputValue) {
					var error = 'mindate';
					var format = 'yyyy-MM-dd';
					var input = $filter('date')(inputValue, format);
					var min = $filter('date')(attrs.gumgaMinDate, format);
					var isValid = input >= min;
					ctrl.$setValidity(error, isValid);
					scope.$broadcast('$error', {
						name: attrs.name,
						label: attrs.label || attrs.name,
						valid: isValid,
						error: error,
						value: attrs.gumgaMinDate
					});
					return inputValue;
				};
				ctrl.$parsers.unshift(validateMinDate);
				ctrl.$formatters.push(validateMinDate);
				attrs.$observe('gumgaMinDate', function () {
					validateMinDate(ctrl.$viewValue);
				});
			}
		}
	}
	angular.module('gumga.directives.form.min.date',[])
	.directive('gumgaMinDate',MinDate);
})();
