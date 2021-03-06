(function(){
	'use strict';
	Upload.$inject = ['$http','$parse','$timeout'];
	/**
	 * @ngdoc directive
	 * @name gumga.core:gumgaUpload
	 * @restrict
	 * @description 
	 * 	O componente gumgaUpload pode ser utilizado para fazer upload de imagens. O framework GUMGA usa um método de upload
	 * 	de imagens que faz o upload do arquivo para uma pasta temporária e retorna um token. Quando o registro é salvo, o framework gumga 
	 * 	faz o bind da string que está no atributo com o arquivo temporário.
	 * 	@param {Objet} model Objeto que irá conter as informações da imagem.
	 * 	@param {Function} upload-method Função que será executada para fazer o upload da imagem para o arquivo temporário.
	 * 	@param {Function} delete-method Função que será executada para deletar a imagem do espaço temporário.
	 * 	@param {String} tooltip-text Mensagem que irá aparecer no tooltip da imagem.
	 */
	function Upload($http,$parse,$timeout){  

		var img = 	
		'<div ng-click="fireClick()" ng-show="flag" class="col-md-1" tooltip="{{::tooltipText}}" tooltip-placement="right">'+
		'	<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="128px" height="128px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">'+
		'		<path id="avatar" fill="#cccccc" d="M490.579,383.029c-14.152-22.086-61.763-35.824-108.835-55.453c-47.103-19.633-58.268-26.439-58.268-26.439'+
		'			l-0.445-45.182c0,0,17.646-13.557,23.127-56.074c11.01,3.198,22.619-16.461,23.237-26.824c0.625-9.98-1.508-37.662-14.981-34.877' +
		'			c2.754-20.845,4.741-39.586,3.764-49.505c-3.495-36.295-39.23-74.578-94.182-74.578c-54.95,0-90.7,38.283-94.193,74.578' +
		'			c-0.978,9.919,1.019,28.661,3.758,49.505c-13.455-2.785-15.587,24.897-14.979,34.877c0.635,10.363,12.196,30.021,23.255,26.824' +
		'			c5.462,42.517,23.122,56.074,23.122,56.074l-0.441,45.182c0,0-11.178,6.807-58.268,26.439' +
		'			c-47.104,19.629-94.683,33.367-108.851,55.453c-12.7,19.777-8.882,114.875-8.882,114.875h470.946' +
		'			C499.462,497.904,503.281,402.806,490.579,383.029z"/>' +
		'	</svg>' +
		'</div>'
;loca

		var template =
		'<div class="full-width-without-padding">' +
		img + 
		'   <img src="#" alt="Uploaded Image" ng-show="!flag" class="img-rounded" style="object-fit: cover"/>' +
		'   <input type="file" id="upload" ng-hide="true"/>' +
		'   <div class="col-md-12" style="padding-left: 0">' +
		'   <button type="button" class="btn btn-link" ng-hide="flag" ng-click="deleteImage()"> Delete Image <span class="glyphicon glyphicon-trash"></span></button>' +
		'</div>' +
		'</div>';
		return {
			restrict: 'AE',
			scope: {
				model: '=attribute',
				uploadMethod: '&',
				deleteMethod: '&',
				tooltipText: '@'
			},
			template: template,
			link:function(scope,elm,attrs){
				var model = $parse(attrs.attribute),
				modelSetter = model.assign,
				element = elm.find('input'),
				image = elm.find('img')[0],
				reader = new FileReader();


				scope.fireClick = function(){
					$timeout(function(){
						document.getElementById('upload')
							.click();	
					});
				}

				scope.$watch('model',function(){
					if(scope.model){
						if(scope.model.bytes){
							scope.flag = false;
							image.src = 'data:' + scope.model.mimeType + ';base64,' + scope.model.bytes;
							image.width = 200;
							image.height = 200;
						}
					} else {
						scope.model = {};
					}
				});

				if(!attrs.attribute){
					throw 'You must pass an attribute to GumgaUpload';
				}

				scope.flag = true;

				function scaleSize(maxW, maxH, currW, currH){
					var ratio = currH / currW;
					if(currW >= maxW && ratio <= 1){
						currW = maxW;
						currH = currW * ratio;
					} else if(currH >= maxH){
						currH = maxH;
						currW = currH / ratio;
					}
					return [currW, currH];
				}

				scope.deleteImage = function(){
					image.src = '';
					scope.flag = true;
					element[0].files = [];
					scope.deleteMethod();
				};

				element.bind('change',function(){
					scope.$apply(function(){
						var x;
						modelSetter(scope,element[0].files[0]);
						scope.flag = false;
						reader.onloadend = function(){
							image.src = reader.result;
							image.width = 200;
							image.height =200;
							var x = attrs.attribute.split('.');
							scope.uploadMethod({image: scope[x[0]][x[1]]})
							.then(function(val){
								scope.model.name = val.data;
							});
						};
						reader.readAsDataURL(element[0].files[0]);
					});
				});
			}
		};
	}

	angular.module('gumga.directives.upload',[])
		.directive('gumgaUpload',Upload);

})();