var ngAdminJWTAuthService = function($http, ngAdminJWTAuthConfigurator) {

	return {
		authenticate: function(data, successCallback, errorCallback) {
			var url = ngAdminJWTAuthConfigurator.getAuthURL();

			return $http({
				url: url,
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				data: data
			}).then(function(response) {
				localStorage.userToken = response.data.id;

				successCallback(response);

				var customAuthHeader = ngAdminJWTAuthConfigurator.getCustomAuthHeader();
				if (customAuthHeader) {
					$http.defaults.headers.common[customAuthHeader.name] = customAuthHeader.template.replace('{{token}}', response.data.token);
				} else {
					$http.defaults.headers.common.Authorization = response.data.id;
				}
			} , errorCallback);
		},

		isAuthenticated: function() {
			return !!localStorage.userToken;
		},

		logout: function() {
			localStorage.removeItem('userToken');
			return true;
		}
	}

};

ngAdminJWTAuthService.$inject = ['$http', 'ngAdminJWTAuthConfigurator'];

module.exports = ngAdminJWTAuthService;
