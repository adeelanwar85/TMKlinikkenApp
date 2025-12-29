/* Minification failed. Returning unminified contents.
(2238,14): run-time error JS1004: Expected ';'
(2246,22): run-time error JS1004: Expected ';'
(2253,34-42): run-time error JS1006: Expected ')': function
(2253,45): run-time error JS1004: Expected ';'
(2255,26): run-time error JS1004: Expected ';'
(2256,18-19): run-time error JS1195: Expected expression: ,
(2256,25): run-time error JS1004: Expected ';'
(2256,25-26): run-time error JS1195: Expected expression: )
(2265,14): run-time error JS1004: Expected ';'
(2292,33): run-time error JS1004: Expected ';'
(2310,38-46): run-time error JS1006: Expected ')': function
(2310,64): run-time error JS1004: Expected ';'
(2312,40): run-time error JS1004: Expected ';'
(2315,40): run-time error JS1004: Expected ';'
(2321,14-15): run-time error JS1195: Expected expression: )
 */
(function (angular) {
    'use strict';

    angular
        .module('app')
        .factory('AnalyticService', AnalyticService);

    AnalyticService.$inject = ['$window', 'DepartmentService', '$location', '$cookies'];

    function AnalyticService($window, DepartmentService, $location, $cookies) {        

        var service = {
            sendAnalytics: sendAnalytics
        };
        return service;

        function sendAnalytics(value) {
            var prefs = DepartmentService.getDepartmentPreferences();
            var canSendAnalytics = false;

            var consentParamStr = $cookies.getObject("HanoCookieConsentInforNew");
            if (consentParamStr !== null && consentParamStr !== undefined) {
                var consentParam = JSON.parse(consentParamStr);
                var hostStr = $location.host();
                var protocolStr = $location.protocol();
                var hpUrl = protocolStr + '://' + hostStr;

                if (consentParam && consentParam.type && consentParam.url &&
                    hpUrl == consentParam.url && consentParam.type == 'all')
                    canSendAnalytics = true;
            }

            if (prefs.cust2016_EnableGoogleTracking && canSendAnalytics) {
                if (prefs.cust2016_CustGoogleTagManagerId.trim().length > 0) {
                    $window.dataLayer.push({
                        'event': 'Pageview',
                        'pagePath': value,
                        'pageTitle': value
                    });
                } else {
                    gtag('event', 'page_view', {
                        page_title: value,
                        page_path: value,
                        send_to: prefs.cust2016_CustGoogleTrackingId.toString()
                    });
                }
            }            
        }
    }

})(window.angular);


;
(function (angular) {
    'use strict';

    angular
        .module('app')
        .factory('AuthService', AuthService);

    AuthService.$inject = ["$timeout", '$http', 'localStorageService', '$q', '$state', '$window', '$translate', 'toastr', '$cookies', 'UtilityService', 'DepartmentService'];

    /* > ngInject < */
    function AuthService($timeout, $http, localStorageService, $q, $state, $window, $translate, toastr, $cookies, UtilityService, DepartmentService) {
        var _authentication = {
            isAuth: false,
            userName: ""
        };

        var service = {
            login: login,
            register: register,
            logout: logout,
            getAuth: getAuth,
            getAuthorizationDataLocalStorage: getAuthorizationDataLocalStorage,
            fillAuthData: fillAuthData,
            sendPasswordReminder: sendPasswordReminder,
            performExternalLogin: performExternalLogin,
            sendOneTimePassword: sendOneTimePassword,
            registerFromOneTimePasswordLogin: registerFromOneTimePasswordLogin
        };
        return service;

        ////////////////

        function login(loginData) {
            var data = "grant_type=password&username=" + encodeURIComponent(loginData.userName) + "&password=" + encodeURIComponent(loginData.password) + "&loginType=" + loginData.loginType;
            var deferred = $q.defer();
            $http.post(globalApiURLs.tokenEndpoint, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (response) {
                var tokenResponse = response.data;
                tokenResponse.userName = tokenResponse.name;
                setLocalStorageCredentials(tokenResponse);
                deferred.resolve(tokenResponse);
                $translate('You_have_been_logged_in').then(function (translatedValue) {
                    toastr.success(translatedValue);
                });
                if ($state.current.name === 'mandatoryLogin' || $state.current.name === 'login') {
                    $state.go("home");
                }

                var prefs = DepartmentService.getDepartmentPreferences();
                if (prefs.cust2016_AllowReservationRule == "true") {
                    $window.location.reload();
                    return;
                }
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
        function logout(silent) {
            var prefs = DepartmentService.getDepartmentPreferences();

            sessionStorage.removeItem("VippsAuthData");
            sessionStorage.removeItem("VippsBookingItems");
            sessionStorage.removeItem("VippsAuthState");

            localStorageService.remove('authorizationData');

            removeDomainAuthorizationCookie();

            if (_authentication.isAuth && !silent) {
                $translate('You_have_been_logged_out').then(function (translatedValue) {
                    toastr.success(translatedValue);
                });
            }

            _authentication.isAuth = false;
            _authentication.userName = "";

            if (prefs.cust2016_mandatoryLogin === 'true') {
                $state.go("mandatoryLogin");
            }
            else {
                $state.go("home");
            }

            var prefs = DepartmentService.getDepartmentPreferences();
            if (prefs.cust2016_AllowReservationRule == "true") {
                $window.location.reload();
                return;
            }
        }
        function register(newUser) {
            var deferred = $q.defer();
            $http.post(globalApiURLs.userAccount, newUser).then(function (data) {
                if (_authentication.isAuth) {
                    logout(true);
                }
                setLocalStorageCredentials(data.data.tokenResponse);
                deferred.resolve(data.data.customer);
                $translate('You_have_been_logged_in').then(function (translatedValue) {
                    toastr.success(translatedValue);
                });
                if ($state.current.name === 'mandatoryLogin' || $state.current.name === 'login') {
                    $state.go("home");
                }

                var prefs = DepartmentService.getDepartmentPreferences();
                if (prefs.cust2016_AllowReservationRule == "true") {
                    $window.location.reload();
                    return;
                }

            }, function (response) {
                deferred.reject(response);
            });
            return deferred.promise;
        }


        function registerFromOneTimePasswordLogin(newUser) {
            var deferred = $q.defer();
            $http.post(globalApiURLs.userAccount, newUser).then(function (data) {

                if (_authentication.isAuth) {
                    logout(true);
                }
                deferred.resolve(data.data.customer);

            }, function (response) {
                deferred.reject(response);
            });
            return deferred.promise;
        }


        function getAuth() {
            return _authentication;
        }
        function getAuthorizationDataLocalStorage() {
            return localStorageService.get('authorizationData');
        }
        function fillAuthData() {
            var cookieAuthData = $cookies.getObject("authorizationData");
            if (cookieAuthData !== null && cookieAuthData !== undefined) {
                localStorageService.set('authorizationData', cookieAuthData);
                removeDomainAuthorizationCookie();
            }

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                testIfCorrectCredentials();
            }

        }
        function sendPasswordReminder(field, value) {
            var passwordReminder = {
                field: field,
                value: value
            }
            return $http.post(globalApiURLs.userAccount + "/sendPasswordReminder", passwordReminder);
        }

        function sendOneTimePassword(customerId) {
            return $http.post(globalApiURLs.userAccount + "/SendOneTimePassword?customerId=" + customerId);
        }

        function performExternalLogin(token, username) {
            var tokenResponse = {
                access_token: token,
                userName: username
            }
            setLocalStorageCredentials(tokenResponse);
        }

        //------------------------FUNCTIONS NOT RETURNED BY AUTH SERVICE-------------------------------------//
        function setLocalStorageCredentials(tokenResponse) {
            localStorageService.set('authorizationData', { token: tokenResponse.access_token, userName: tokenResponse.userName });
            _authentication.isAuth = true;
            _authentication.userName = tokenResponse.userName;
        }
        function testIfCorrectCredentials() {
            $http.get(globalApiURLs.userAccount + "/getcurrentcustomer");
        }
        function removeDomainAuthorizationCookie() {
            var domain = UtilityService.getCurrentDomain();
            $cookies.remove("authorizationData");
            $cookies.putObject("authorizationData", null, { domain: domain, path: "/" });
        }
    }

})(window.angular);


;
(function (angular) {
	'use strict';

	angular
        .module('app')
        .factory('BonusPointService', BonusPointService);

    BonusPointService.$inject = ['$http'];

	/* > ngInject < */
    function BonusPointService($http) {
        var service = {
            getPointBalance: getPointBalance
		};
		return service;

		////////////////

        function getPointBalance() {
			return $http.get(globalApiURLs.userAccount + "/bonusPoints");
		}

	}

})(window.angular);


;
(function (angular) {
	'use strict';

	angular
		.module('app')
		.factory('BookingService', BookingService);

	BookingService.$inject = ['$http', 'SignalService', 'DepartmentService', '$rootScope', '$window'];

	/* > ngInject < */
	function BookingService($http, SignalService, DepartmentService, $rootScope, $window) {

		var departmentPreferences = DepartmentService.getDepartmentPreferences();

		var service = {
			createBookingForLoginWithoutPassword: createBookingForLoginWithoutPassword,
			checkIfTimesCanBeReservedForLoginWithoutPassword: checkIfTimesCanBeReservedForLoginWithoutPassword,
			getAvailableTimesForService: getAvailableTimesForService,
			getAvailableTimesLastBooking: getAvailableTimesLastBooking,
			cancelBooking: cancelBooking,
			cancelCombinedBooking: cancelCombinedBooking,
			getAvailableStartTimesForDate: getAvailableStartTimesForDate,
			getFreeDatesInDateRange: getFreeDatesInDateRange,
			createBooking: createBooking,
			checkIfTimesCanBeReserved: checkIfTimesCanBeReserved,
			getReceiptHtml: getReceiptHtml,
			getNonMonetaryReceiptHtml: getNonMonetaryReceiptHtml,
			getInvoicePdf: getInvoicePdf,
			validateGiftCertificate: validateGiftCertificate,
			beginKlarnaCheckout: beginKlarnaCheckout,
			getKlarnaConfirmationSnippet: getKlarnaConfirmationSnippet,
			createBookingOnlyProduct: createBookingOnlyProduct,
			getQuick2SearchData: getQuick2SearchData,
			getPublishedWeeks: getPublishedWeeks
		};
		return service;

		///////////////////////////////////////////////////////////

		function getPublishedWeeks(service, resourceList) {	
			var resList = angular.copy(resourceList);
			if (resList && resList.length > 0) {
				var avResourceList = [];
				for (var i = 0; i < resList.length; i++) {
					avResourceList.push({ id: resList[i].id });
				}
				resList = avResourceList;
			}
			var wizardData = {
				services: [service],
				availableResources: resList
			};
			return $http.post(globalApiURLs.time + "/publishedWeeks", wizardData);
		}

		function getQuick2SearchData(week, year, service, resourceId) {
			var quickSearchBooking = {
				week: week,
				year: year,
				resourceId: resourceId,
				service: service
			};
			return $http.post(globalApiURLs.time + "/getQuick2SearchData", quickSearchBooking);
		}

		function getAvailableTimesForService(startDate, resourceId, displayType, endDate, service, bookingsFromShoppingCart) {
			var searchBookingsModel = {
				startDate: startDate,
				resourceId: resourceId,
				displayType: displayType,
				endDate: endDate,
				service: service,
				bookingsFromShoppingCart: bookingsFromShoppingCart
			};
			return $http.post(globalApiURLs.time, searchBookingsModel);
		}
		function cancelBooking(activity) {
			return $http.post(globalApiURLs.booking + "/CancelBooking", activity);
		}
		function cancelCombinedBooking(activity) {
			return $http.post(globalApiURLs.booking + "/cancelCombinedBooking", activity);
		}
		function getAvailableTimesLastBooking() {
			return $http.get(globalApiURLs.time + "/GetTimesLastBooking");
		}
		function getAvailableStartTimesForDate(wizardData) {
			var wData = angular.copy(wizardData);
			if (wData.resource)
				wData.resource = { id: wData.resource.id };

			if (wData.availableResources && wData.availableResources.length > 0) {
				var avResourceList = [];
				for (var i = 0; i < wData.availableResources.length; i++) {
					avResourceList.push({ id: wData.availableResources[i].id });
				}
				wData.availableResources = avResourceList;
			}

			return $http.post(globalApiURLs.time + "/getAvailableStartTimesForDate", wData);
		}
		function getFreeDatesInDateRange(wizardData) {
			var wData = angular.copy(wizardData);
			if (wData.resource) 
				wData.resource = { id: wData.resource.id };

			if (wData.availableResources && wData.availableResources.length > 0) {
				var avResourceList = [];
				for (var i = 0; i < wData.availableResources.length; i++) {
					avResourceList.push({ id: wData.availableResources[i].id });
				}
				wData.availableResources = avResourceList;
			}

			return $http.post(globalApiURLs.time + "/getFreeDatesInDateRange", wData);
		}
		function createBooking(postRequestReservation) {
			return $http.post(globalApiURLs.booking + "/startreservation", postRequestReservation).then(function (response) {
				var transactionId = response.data.transactionId;
				if (departmentPreferences.cust2016_EnablePaymentSystem === "false") {
					$rootScope.$broadcast("PaymentDone", "");
				} else if (postRequestReservation.paymentMethod === "vipps") {
					SignalService.subscribeToPaymentHub(transactionId);
					$window.location.href = response.data.vippsRedirectUrl;
				} else if (postRequestReservation.paymentMethod === "klarna") {
					//what to do if klarna
				}
				else {
					$rootScope.$broadcast("PaymentDone", postRequestReservation.paymentMethod, response.data.invoiceId);
				}

				return response;
			});
		}
		function createBookingForLoginWithoutPassword(postRequestReservation, fieldName, fieldValue, customerId) {
			return $http.post(globalApiURLs.booking + "/startReservationForLoginWithoutPassword?fieldName=" + fieldName + 
				"&fieldValue=" + fieldValue + "&customerId=" + customerId, postRequestReservation).then(function (response) {
				$rootScope.$broadcast("PaymentDone", "");
				return response;
			});
		}
		function createBookingOnlyProduct(purchaseRequestDto) {
			return $http.post(globalApiURLs.booking + "/createBookingOnlyProduct", purchaseRequestDto).then(function (response) {
				$rootScope.$broadcast("OrderProductsDone", response);
				return response;
			});
		}
		function checkIfTimesCanBeReserved(postRequestActivity) {
			return $http.post(globalApiURLs.booking + "/checkIfTimesCanBeReserved", postRequestActivity);
		}
		function checkIfTimesCanBeReservedForLoginWithoutPassword(postRequestActivity, fieldName, fieldValue, customerId) {
			return $http.post(globalApiURLs.booking + "/checkIfTimesCanBeReservedForLoginWithoutPassword?fieldName=" + 
				fieldName + "&fieldValue=" + fieldValue + "&customerId=" + customerId, postRequestActivity);
		}
		function getReceiptHtml(invoiceId) {
			return $http.get(globalApiURLs.booking + "/invoice/" + invoiceId + "/receipt");
		}
        function getNonMonetaryReceiptHtml(invoiceId, nonMonetaryReceiptId) {
            return $http.get(globalApiURLs.booking + "/invoice/" + invoiceId + "/nonmonetaryreceipt?nonmonetaryreceiptid=" + nonMonetaryReceiptId);
        }
		function getInvoicePdf(invoiceId) {
			return $http.get(globalApiURLs.booking + "/invoice/" + invoiceId, { responseType: 'blob' }).then(function (response) {
				var blob = response.data;
				var link = document.createElement('a');
				link.href = window.URL.createObjectURL(blob);
				var fileName = response.headers('x-filename') || 'invoice.pdf';
				link.download = fileName;

				link.click();
				//var octetStreamMime = 'application/octet-stream';
				//var fileName = response.headers('x-filename') || 'invoice.pdf';
				//var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
				//var blob = new Blob([response.data], { type: octetStreamMime });
				//var url = urlCreator.createObjectURL(blob);

				//var a = document.createElement("a");
				//a.style = "display: none";
				//a.href = url;
				//a.download = fileName;

				//document.body.appendChild(a);
				//a.click();
				//window.URL.revokeObjectURL(url);
			});
		}
		function validateGiftCertificate(validationRequest) {
			return $http.post(globalApiURLs.booking + "/giftcertificate/validate", validationRequest);
		}

		function beginKlarnaCheckout(klarnaCheckoutRequest) {
			return $http.post(globalApiURLs.booking + "/beginKlarnaCheckout", klarnaCheckoutRequest);
		}

		function getKlarnaConfirmationSnippet(orderId) {
			return $http.get(globalApiURLs.booking + "/klarna/" + orderId);
		}
	}

})(window.angular);


;
(function (angular) {
	'use strict';

	angular
		.module('app')
		.factory('CustomerGroupService', CustomerGroupService);

    CustomerGroupService.$inject = ['$http'];

	/* > ngInject < */
    function CustomerGroupService($http) {
        var service = {
            getCustomerGroups: getCustomerGroups
		};
		return service;

		///////////////////////////////////////////////////////////

        function getCustomerGroups() {

            // TODO: we need the current customer id so we can check which
            //       groups they are eligible for membership of
            return $http.get(globalApiURLs.customerGroup);
		}
		
    }


})(window.angular);


;
(function (angular) {
	'use strict';

	angular
		.module('app')
		.factory('DepartmentService', DepartmentService);

	DepartmentService.$inject = ['$http', '$q'];

	function DepartmentService($http, $q) {
		var _departmentInfo = null;
		var _prefs = null;
		var _nouns = null;
		var _selectedCountries = null;

		return {
			getDepartmentInfo: getDepartmentInfo,
			fillDepartmentInfo: fillDepartmentInfo,
			getDepartmentPreferences: getDepartmentPreferences,
			fillDepartmentPreferences: fillDepartmentPreferences,
			fillDepartmentNouns: fillDepartmentNouns,
			getDepartmentNouns: getDepartmentNouns,
			getActivityScheme: getActivityScheme,
			getLinkedDatabases: getLinkedDatabases,
			GetChainedDatabasesWithSharedCustomerRegister: GetChainedDatabasesWithSharedCustomerRegister,
			getSelectedCountries: getSelectedCountries,
			getKlarnaTerms: getKlarnaTerms
		};

		function getDepartmentInfo() {
			return _departmentInfo;
		}

		function fillDepartmentInfo(departmentInfo) {
			_departmentInfo = departmentInfo;
		}

		function fillDepartmentPreferences(prefs) {
			//setting up google analytics
			prefs['cust2016_EnableGoogleTracking'] = prefs['cust2016_CustGoogleTrackingId'].trim().length > 0 ||
				prefs['cust2016_CustGoogleTagManagerId'].trim().length > 0;

			_prefs = prefs;
		}

		function getDepartmentPreferences() {
			return _prefs;
		}

		function fillDepartmentNouns(nouns) {
			_nouns = nouns;
		}

		function getDepartmentNouns() {
			return _nouns;
		}

		function getActivityScheme() {
			return $http.get(globalApiURLs.activityScheme);
		}

		function getLinkedDatabases() {
			return $http.get(globalApiURLs.department + "/GetLinkedDatabases");
		}

		function GetChainedDatabasesWithSharedCustomerRegister() {
			return $http.get(globalApiURLs.department + "/GetChainedDatabasesWithSharedCustomerRegister");
		}

		function getSelectedCountries(force) {
			if (!_selectedCountries || force) {
				return $http.get(globalApiURLs.department + "/GetSelectedCountries").then(function (data) {
					_selectedCountries = data.data;

					return data.data;
				});
			}

			var deferred = $q.defer();

			deferred.resolve(_selectedCountries);

			return deferred.promise;
		}

		function getKlarnaTerms() {
			return $http.get(globalApiURLs.department + "/GetKlarnaTerms");
		}
	}
})(window.angular);
;
(function (angular) {
    'use strict';

    angular
        .module('app')
        .factory('ExternalLoginService', ExternalLoginService);

    ExternalLoginService.$inject = ['$http', '$location', 'AuthService', 'ModalService', 'toastr', '$translate', '$window'];

    /* > ngInject < */
    function ExternalLoginService($http, $location, AuthService, ModalService, toastr, $translate, $window) {
        var service = {
            linkCustomerIdToExternalId: linkCustomerIdToExternalId,
            unlinkCustomerIdFromExternalId: unlinkCustomerIdFromExternalId,
            loginWithFacebook: loginWithFacebook,
            checkIfConnectedCustomerIdToExternalId: checkIfConnectedCustomerIdToExternalId,
            checkIfConnectedExternalIdToCustomerId: checkIfConnectedExternalIdToCustomerId,
            loginWithOneTimePassword: loginWithOneTimePassword,
            getVippsLoginConfig: getVippsLoginConfig,
            getVippsApiUrl: getVippsApiUrl,
            getVippsAuthCode: getVippsAuthCode,
            performVippsLogin: performVippsLogin,
            authenticateWithVipps: authenticateWithVipps,
            getConnectedCustomerAndLoginWithFacebook: getConnectedCustomerAndLoginWithFacebook,
            loginWithPersonalNrAndMobile: loginWithPersonalNrAndMobile
        };
        return service;

        ////////////////

        function loginWithPersonalNrAndMobile(personallNr, mobile) {
            var resObj = {
                PersonalNumber: personallNr,
                Mobile: mobile
            };
            return $http.post(globalApiURLs.externalLogin + "/LoginWithPersonalNrAndMobile", resObj);
        }

        function getConnectedCustomerAndLoginWithFacebook(customer) {
            return $http.post(globalApiURLs.externalLogin + "/getConnectedCustomerAndLoginWithFacebook", customer);
		}


        function linkCustomerIdToExternalId(accessToken) {
            return $http.get(globalApiURLs.externalLogin + "/linkCustomerIdToExternalId?accessToken=" + accessToken);
        }

        function unlinkCustomerIdFromExternalId() {
            return $http.get(globalApiURLs.externalLogin + "/unlinkCustomerIdFromExternalId");
        }

        function loginWithFacebook(accessToken) {
            return $http.get(globalApiURLs.externalLogin + "/loginWithFacebook?accessToken=" + accessToken);
        }

        function checkIfConnectedCustomerIdToExternalId() {
            return $http.get(globalApiURLs.externalLogin + "/checkIfConnectedCustomerIdToExternalId");
        }

        function checkIfConnectedExternalIdToCustomerId(accessToken) {
            return $http.get(globalApiURLs.externalLogin + "/checkIfConnectedExternalIdToCustomerId?accessToken=" + accessToken);
        }

        function loginWithOneTimePassword(customerId, code) {
            return $http.post(globalApiURLs.externalLogin + "/LoginWithOneTimePassword?customerId=" + customerId + "&code=" + code);
        }

        function getVippsLoginConfig() {
            return $http.post(globalApiURLs.externalLogin + "/GetVippsLoginConfig");
        }

        function getVippsApiUrl() {
            return $http.get(globalApiURLs.externalLogin + "/GetVippsApiUrl");
        }

        function loginWithVipps(code, redirectUrl) {
            return $http.post(globalApiURLs.externalLogin + "/LoginWithVipps?code=" + code + "&redirectUrl=" + redirectUrl);
        }

        function authenticateWithVipps(customerId, code) {
            return $http.post(globalApiURLs.externalLogin + "/AuthenticateWithVipps?customerId=" + customerId + "&code=" + code);
        }

        function getVippsAuthCode() {
            var hasE = false;
            var errorMsg = '';
            var code = '';
            var redirectU = $location.protocol() + "://" + $location.host() + rootApplicationURL;
            var hasLoginWithVippsState = false;

            var qsParts = $location.absUrl().split('?');

            if (qsParts.length > 1 && qsParts[1] !== "") {
                var qsVal = qsParts[1].replace('#', '').replace('!', '');

                var slashIndex = qsVal.indexOf('/');
                if (slashIndex > -1) {
                    qsVal = qsVal.substring(0, slashIndex);
                }

                var qsArray = qsVal.split('&');

                if (qsArray.length > 0) {
                    var qsDic = [];

                    $.each(qsArray, function (index, value) {
                        var qsKeyVal = value.split('=');

                        if (qsKeyVal.length > 1 && qsKeyVal[0] !== "" && qsKeyVal[1] !== "")
                            qsDic.push({ key: qsKeyVal[0], value: qsKeyVal[1] });
                    });

                    hasLoginWithVippsState = qsDic.filter(function (p) {
                        return p.key === "state" && p.value === sessionStorage.getItem("VippsAuthState");
                    }).length > 0;

                    var errorObj = qsDic.filter(function (p) {
                        return p.key === "error";
                    });

                    if (hasLoginWithVippsState) {
                        if (errorObj.length > 0) {
                            hasE = true;

                            var errorDes = qsDic.filter(function (p) {
                                return p.key === "error_description";
                            });

                            errorMsg = errorObj[0].value;

                            if (errorDes.length > 0)
                                errorMsg = errorMsg + ' : ' + errorDes[0].value;
                        }
                        else {
                            var codeObj = qsDic.filter(function (p) {
                                return p.key === "code";
                            });

                            if (codeObj.length > 0)
                                code = codeObj[0].value;
                        }
                    }
				}
            }
            return {
                hasLoginWithVippsS: hasLoginWithVippsState,
                hasError: hasE,
                errorMessage: errorMsg,
                authCode: code,
                redirectUrl: redirectU
            };
        }

        function performVippsLogin(prefAllowReservationRule) {
            var authCodeObj = getVippsAuthCode();
            if (authCodeObj.hasLoginWithVippsS) return;

            var resObj = JSON.parse(sessionStorage.getItem("VippsAuthData"));
            var bookingItems = JSON.parse(sessionStorage.getItem("VippsBookingItems"));

            sessionStorage.removeItem("VippsAuthData");
            sessionStorage.removeItem("VippsBookingItems");
            sessionStorage.removeItem("VippsAuthState");

            var hasBookingItems = bookingItems != undefined && bookingItems !== null && bookingItems.length > 0;

            if (resObj !== null && resObj.hasLoginWithVippsS) {

                if (!resObj.hasError && resObj.authCode !== '') {

                    var redirectUrl = $location.protocol() + "://" + $location.host() + rootApplicationURL;

                    loginWithVipps(resObj.authCode, redirectUrl).then(function (data) {

                        if (data.data.errorMsg !== "")
                            toastr.error(data.data.errorMsg);
                        else if (data.data.vippsLoginCustomerListDto.length > 0){
                            if (data.data.vippsLoginCustomerListDto.length > 1) {

                                ModalService.displayLoginForm(hasBookingItems ? function () { ModalService.displayConfirmPurchase(bookingItems, []); } : null,
                                    {
                                        type: 'Vipps',
                                        customerListWithSameMobile: data.data.vippsLoginCustomerListDto,
                                        code: data.data.code
                                    });
                            }
                            else if (!data.data.vippsLoginCustomerListDto[0].isNewCustomer) {

                                authenticateWithVipps(data.data.vippsLoginCustomerListDto[0].id, data.data.code).then(function (data) {
                                    if (data.data.valid) {
                                        AuthService.performExternalLogin(data.data.access_token, data.data.username);

                                        $translate('You_have_been_logged_in').then(function (translatedValue) {
                                            toastr.success(translatedValue);
                                        });

                                        if (hasBookingItems)
                                            ModalService.displayConfirmPurchase(bookingItems, []);

                                        if (prefAllowReservationRule === "true") {
                                            $window.location.reload();
                                            return;
                                        }
                                    }
                                });
                            }
                            else {
                                ModalService.displayRegisterForm(hasBookingItems ? function () { ModalService.displayConfirmPurchase(bookingItems, []);} : null,
                                    {
                                        newCustomer: true,
                                        fields: [
                                            { key: "phone2", value: data.data.vippsLoginCustomerListDto[0].phoneNumber },
                                            { key: "name", value: data.data.vippsLoginCustomerListDto[0].firstName },
                                            { key: "surname", value: data.data.vippsLoginCustomerListDto[0].surName }
                                        ],
                                        type: 'Vipps'
                                });
                            }
                        }
                        else
                            toastr.error("Customer list is empty.");
                        
                    }, function (response) {
                            toastr.error("Error");
                    });
                }
                else if (resObj.hasError && resObj.errorMessage !== '')
                    toastr.error(resObj.errorMessage);
            }
        }

    }

})(window.angular);


;
(function (angular) {
	'use strict';

	angular
        .module('app')
        .factory('FeedbackService', FeedbackService);

	FeedbackService.$inject = ['$http'];

	/* > ngInject < */
	function FeedbackService($http) {
		var service = {
			updateFeedback: updateFeedback,
			getFeedback: getFeedback,
			getResourceFeedbacks: getResourceFeedbacks,
			getProductFeedbacks: getProductFeedbacks,
			canCustomerRateThisProduct: canCustomerRateThisProduct,
			getProductFeedbackByCustomer: getProductFeedbackByCustomer,
			updateProductFeedback: updateProductFeedback,
			getServiceRating: getServiceRating
		};
		return service;

		////////////////

		function updateFeedback(feedback) {
			return $http.post(globalApiURLs.feedback, feedback);
		} 
		function getFeedback(id) {
			return $http.get(globalApiURLs.feedback + "?historyId=" + id);
		}
		function getResourceFeedbacks(resourceId) {
			return $http.get(globalApiURLs.feedback + "/getResourceFeedbacks?resourceId=" + resourceId);
		}
		function getProductFeedbacks(productId) {
			return $http.get(globalApiURLs.productFeedback + "/GetLatestProductFeedbacks?productId=" + productId);
		}
		function canCustomerRateThisProduct(productId) {
			return $http.get(globalApiURLs.productFeedback + "/canCustomerRateThisProduct?productId=" + productId);
		}
		function getProductFeedbackByCustomer(productId) {
			return $http.get(globalApiURLs.productFeedback + "/getProductFeedbackByCustomer?productId=" + productId);
		}
		function updateProductFeedback(productId,message,rate) {
			return $http.post(globalApiURLs.productFeedback + "?productId=" + productId + "&message=" + message + "&rate=" + rate);
		}
		function getServiceRating(serviceId) {
			return $http.get(globalApiURLs.feedback + "/getServiceRating?serviceId=" + serviceId);
		}
	}

})(window.angular);


;
(function (angular) {
	'use strict';

	angular
		.module('app')
		.factory('IdleService', IdleService);

	IdleService.$inject = ['Idle', '$rootScope', 'AuthService', '$location', '$window', 'ModalService'];

	function IdleService(Idle, $rootScope, AuthService, $location, $window, ModalService) {
		var handlersRegistered;
		var modal;

		return {
			start: start,
			kickOut: kickOut
		};

		// kick current customer from session
		function kickOut() {
			AuthService.logout(false);

			var path = $location.path();

			// navigate to root url if current page is not "Home" page
			if (path !== '/') {
				$window.location.href = rootApplicationURL;
			} else {
				start();
			}
		}

		// start watching for idling events
		function start() {
			if (Idle.running()) {
				return;
			}

			Idle.watch();

			if (handlersRegistered) {
				return;
			}

			// fires when customer is detected to be idling
			$rootScope.$on('IdleStart', function () {
				var path = $location.path();

				if (path !== '/') {
					modal = ModalService.displayKioskKickoutAlert();
					Idle.unwatch();
				}
			});

			// fires when customer is idle of a fixed amout of time
			$rootScope.$on('IdleTimeout', function () {
				kickOut();
			});

			handlersRegistered = true;
		}
	}
})(window.angular);
;
(function (angular) {
	'use strict';

	angular
        .module('app')
        .factory('LanguageService', LanguageService);

	LanguageService.$inject = ['DepartmentService','$http','tmhDynamicLocale','$translate','localStorageService'];

	/* > ngInject < */
	function LanguageService(DepartmentService,$http, tmhDynamicLocale, $translate, localStorageService) {
		var _databaseDefaultLanguage = "";
		var _languageOptions = [
			{
				label: "english",
				value: "en-US"
			},
			{
				label: "norwegian",
				value: "nb-NO"
			},
			{
				label: "swedish",
				value: "sv-SE"
			}];
		//--------------------------//

		var service = {
			getLanguageOptions: getLanguageOptions,
			setLanguageLocalStorage: setLanguageLocalStorage,
			removeLanguageFromLocalStorage: removeLanguageFromLocalStorage,
			getLanguageFromLocalStorage: getLanguageFromLocalStorage,
			getLocalizationCode: getLocalizationCode,
			setLocalizationCode: setLocalizationCode,
			getDatabaseDefaultLanguage: getDatabaseDefaultLanguage,
			fillDatabaseDefaultLanguage: fillDatabaseDefaultLanguage
		};
		return service;
		//--------------------------//

		function getLanguageOptions() {
			return _languageOptions;
		}
		function setLanguageLocalStorage(languageCode) {
			localStorageService.set("language", languageCode);
			languageCode = getLanguageFromLocalStorage();
			$translate.use(languageCode);
		}
		function removeLanguageFromLocalStorage() {
			localStorageService.remove("language");
		}
		function getLocalizationCode() {
			var languageFromLocalStorage = getLanguageFromLocalStorage();
			var localizationCode = languageFromLocalStorage.toLowerCase();
			return localizationCode;
		}
		function setLocalizationCode() {
			var localizationCode = getLocalizationCode();
			tmhDynamicLocale.set(localizationCode);
		}
		function fillDatabaseDefaultLanguage(language) {
			_databaseDefaultLanguage = language;
		}
		function getDatabaseDefaultLanguage() {
			return _databaseDefaultLanguage;
		}
		function getLanguageFromLocalStorage() {
			var language = localStorageService.get("language");
			/*if (language === undefined || language === null) {
				language = getDatabaseDefaultLanguage();
			}
			var correctLanguage = false;
			for (var i = 0; i < _languageOptions.length; i++) {
				if (_languageOptions[i].value === language) {
					correctLanguage = true;
				}
			}
			if (!correctLanguage) {
				language = getDatabaseDefaultLanguage();
			}
			var prefs = DepartmentService.getDepartmentPreferences();
			if (prefs.cust2016_EnableLanguageChanges === 'false') {
				language = getDatabaseDefaultLanguage();
			}*/

			language = getDatabaseDefaultLanguage();
			return language;
		}
	
	}

})(window.angular);


;
(function (angular) {
    'use strict';

    angular
        .module('app')
        .factory('ModalService', ModalService);

    ModalService.$inject = ['$aside', '$uibModal', 'AuthService', '$window', 'UserAccountService', '$state', '$translate', 'AnalyticService'];

    /* > ngInject < */
    function ModalService($aside, $uibModal, AuthService, $window, UserAccountService, $state, $translate, AnalyticService) {
        var _authData = AuthService.getAuth();

        var service = {
            displayLoginWithoutPasswordForm: displayLoginWithoutPasswordForm,
            displayLoginForm: displayLoginForm,
            displayResourceInformation: displayResourceInformation,
            displayServicesInformation: displayServicesInformation,
            displayBookingInfoModal: displayBookingInfoModal,
            displayActivityInfoModal: displayActivityInfoModal,
            showFeedbackModal: showFeedbackModal,
            displayRegisterForm: displayRegisterForm,
            displayForgotPasswordForm: displayForgotPasswordForm,
            displayProductInfo: displayProductInfo,
            displayPurchaseNotCompletedModal: displayPurchaseNotCompletedModal,
            displayPurchaseCompleted: displayPurchaseCompleted,
            displayConfirmPurchase: displayConfirmPurchase,
            displayWaitListInfoModal: displayWaitListInfoModal,
            displayFirstTimeLoginFromExternalAccount: displayFirstTimeLoginFromExternalAccount,
            displayReceipt: displayReceipt,
            displayPunchCardSelect: displayPunchCardSelect,
            displayGiftCertificateSelect: displayGiftCertificateSelect,
            displayKioskKickoutAlert: displayKioskKickoutAlert,
            displayGiftCertificatePayment: displayGiftCertificatePayment,
            displayGiftCertificateOptions: displayGiftCertificateOptions,
            displayScheduleTimeInfo: displayScheduleTimeInfo,
            displayServiceDescription: displayServiceDescription,
            displayResourceDescription: displayResourceDescription
        };
        return service;

        ////////////////
        function displayLoginWithoutPasswordForm(callbackFunction, options, bookingItems) {
            UserAccountService.validateLoginWithoutPassword().then(function (data) {
                if (data.data.isValid) {
                    var cusSchemeField = data.data.customerSchemeField;
                    var modal = $uibModal.open({
                        templateUrl: globalPartialURLs.loginWithoutPassword,
                        size: 'md',
                        controllerAs: "lwpc",
                        controller: "loginWithoutPasswordCtrl",
                        resolve: {
                            callbackFunction: function () {
                                return callbackFunction;
                            },
                            options: function () {
                                return options;
                            },
                            onlyBookingItems: function () {
                                return bookingItems;
                            },
                            customerSchemeField: function () {
                                return cusSchemeField;
							}
                        }
                    });
                }
                else {
                    displayLoginForm(callbackFunction, options, bookingItems, false);
				}
            });
            
		}

        function displayLoginForm(callbackFunction, options, bookingItems, displayLoginWithoutPassword) {
            AnalyticService.sendAnalytics('modals/login');

            if (displayLoginWithoutPassword) {
                displayLoginWithoutPasswordForm(callbackFunction, options, bookingItems);
                return;
			}

            var aside = $aside({
                animation: "am-slide-right",
                placement: "right",
                templateUrl: globalPartialURLs.login,
                show: false,
                controllerAs: "lc",
                resolve: {
                    callbackFunction: function () {
                        return callbackFunction;
                    },
                    options: function () {
                        return options;
                    },
                    bookingItems: function () {
                        return bookingItems;
                    }
                },
                controller: "loginCtrl"
            });
            aside.$promise.then(aside.show);
        }


        function displayResourceInformation(resource) {
            var modal = $uibModal.open({
                templateUrl: globalPartialURLs.resourceInfo,
                size: 'lg',
                controllerAs: "ric",
                controller: "resourceInfoCtrl",
                resolve: {
                    resource: function () {
                        return resource;
                    }
                }
            });
        }

        function displayServicesInformation(service) {
            var modal = $uibModal.open({
                templateUrl: globalPartialURLs.serviceInfo,
                controllerAs: "sic",
                controller: "serviceInfoCtrl",
                resolve: {
                    service: function () {
                        return service;
                    }
                }
            });
        }

        function displayServiceDescription(service) {
            var modal = $uibModal.open({
                templateUrl: globalPartialURLs.serviceDescription,
                controllerAs: "sdc",
                controller: "serviceDescriptionCtrl",
                resolve: {
                    service: function () {
                        return service;
                    }
                }
            });
        }

        function displayBookingInfoModal(selectedTime) {
            var bookingInfoModal = $uibModal.open({
                templateUrl: globalPartialURLs.bookingInfo,
                windowClass: "high-z-index",
                backdropClass: "medium-z-index",
                controllerAs: "bic",
                controller: "bookingInfoCtrl",
                resolve: {
                    selectedTime: function () {
                        return selectedTime;
                    }
                }
            });
            return bookingInfoModal;
        }

        function displayActivityInfoModal(selectedTime) {
            var bookingInfoModal = $uibModal.open({
                templateUrl: globalPartialURLs.activityInfo,
                windowClass: "high-z-index",
                backdropClass: "medium-z-index",
                controllerAs: "aic",
                controller: "activityInfoCtrl",
                resolve: {
                    selectedTime: function () {
                        return selectedTime;
                    }
                }
            });
            return bookingInfoModal;
        }

        function showFeedbackModal(booking) {
            var modal = $uibModal.open({
                templateUrl: globalPartialURLs.feedbackInfo,
                controllerAs: "fic",
                resolve: {
                    booking: function () {
                        return booking;
                    }
                },
                controller: 'feedbackInfoCtrl'
            });
            return modal;
        }

        function displayRegisterForm(callbackFunction, newCustomerOptions) {
            AnalyticService.sendAnalytics('modals/register');

            var aside = $aside({
                animation: "am-slide-left",
                placement: "left",
                templateUrl: globalPartialURLs.register,
                backdrop: 'static',
                show: false,
                controllerAs: "rc",
                resolve: {
                    callbackFunction: function () {
                        return callbackFunction;
                    },
                    customerFields: ["UserAccountService", function (UserAccountService) {
                        return UserAccountService.getCustomerScheme()
                            .then(function (data) {
                                return data.data;
                            });
                    }],
                    newCustomerOptions: function () {
                        return newCustomerOptions;
                    }
                },
                controller: "registerCtrl"
            });
            aside.$promise.then(aside.show);
        }

        function displayForgotPasswordForm() {
            AnalyticService.sendAnalytics('modals/forgotpassword');

            var aside = $aside({
                animation: "am-slide-left",
                placement: "left",
                templateUrl: globalPartialURLs.forgotPassword,
                show: false,
                controllerAs: "fpc",
                resolve: {

                },
                controller: "forgotPasswordCtrl"
            });
            aside.$promise.then(aside.show);
        }

        function displayProductInfo(product) {
            var modal = $uibModal.open({
                templateUrl: globalPartialURLs.productInfo,
                windowClass: "high-z-index",
                backdropClass: "medium-z-index",
                controllerAs: "pic",
                resolve: {
                    product: function () {
                        if (product.productGroup === null) {
                            product.productGroup = {
                                name: "#"
                            }
                        }
                        return product;
                    }
                },
                controller: 'productInfoCtrl'
            });
            return modal;
        }

        function displayPurchaseNotCompletedModal(notPurchasedItems, purchasedItems) {
            var modal = $uibModal.open({
                templateUrl: globalPartialURLs.purchaseNotCompleted,
                controllerAs: "pncc",
                resolve: {
                    notPurchasedItems: function () {
                        return notPurchasedItems;
                    },
                    purchasedItems: function () {
                        return purchasedItems;
                    }
                },
                controller: 'purchaseNotCompletedCtrl'
            });
            return modal;
        }

        function displayPurchaseCompleted(listOfTimes, listOfProducts, errors, paymentMethod, invoiceId) {
            AnalyticService.sendAnalytics('modals/purchaseCompleted');

            var modal = $uibModal.open({
                templateUrl: globalPartialURLs.purchaseCompleted,
                resolve: {
                    listOfTimes: function () {
                        return listOfTimes;
                    },
                    listOfProducts: function () {
                        return listOfProducts;
                    },
                    errors: function () {
                        return errors;
                    },
                    paymentMethod: function () {
                        return paymentMethod;
                    },
                    invoiceId: function () {
                        return invoiceId;
                    }
                },
                size: 'lg',
                controller: "purchaseCompletedCtrl",
                controllerAs: "pcc"
            });
            return modal;
        }        

        function displayConfirmPurchase(onlyBookingItems, onlyProductItems, requireResource) {


            UserAccountService.validateCustomerSchemeForExistingCustomer().then(function (data) {
                if (!data.data) {
                    alert($translate.instant("customer_account_not_filled_correctly"));

                    var bItems = {
                        onlyBookingItems: onlyBookingItems,
                        onlyProductItems: onlyProductItems,
                        requireResource: requireResource
                    };
                    $state.go("userAccount", { bookingItems: bItems });
                    return;
                }

                AnalyticService.sendAnalytics('modals/confirmPurchase');

                var modal = $uibModal.open({
                    templateUrl: globalPartialURLs.confirmPurchase,
                    resolve: {
                        onlyBookingItems: function () {
                            return onlyBookingItems;
                        },
                        onlyProductItems: function () {
                            return onlyProductItems;
                        },
                        requireResource: function () {
                            return requireResource;
                        },
                        customerInfo: ['UserAccountService', function (UserAccountService) {
                            return UserAccountService.getCustomerInfo().then(function (data) {
                                return data.data;
                            });
                        }],
                        activityFields: ['DepartmentService', function (DepartmentService) {
                            return DepartmentService.getActivityScheme().then(function (data) {
                                return data.data;
                            });
                        }]
                    },
                    size: 'md',
                    controller: "confirmPurchaseCtrl",
                    controllerAs: "cpc",
                    keyboard: false,
                    backdrop: 'static'
                });

                return modal;
            });
        }



        function displayWaitListInfoModal() {
            var modal = $uibModal.open({
                templateUrl: globalPartialURLs.waitList,
                size: 'md',
                controller: "waitListCtrl",
                controllerAs: "wlc"
            });

            return modal;
        }

        function displayFirstTimeLoginFromExternalAccount(externalAccessToken, callbackFunction) {
            AnalyticService.sendAnalytics('modals/facebookLogin');

            var modal = $uibModal.open({
                templateUrl: globalPartialURLs.firstTimeLoginFromExternalAccount,
                size: 'md',
                resolve: {
                    externalAccessToken: function () {
                        return externalAccessToken;
                    },
                    callbackFunction: function () {
                        return callbackFunction;
                    }
                },
                controller: "firstTimeLoginFromExternalAccountCtrl",
                controllerAs: "ftlcc"
            });

            return modal;
        }

        function displayReceipt(receiptHtmlString) {
            var modal = $uibModal.open({
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.close = function () {
                        $uibModalInstance.dismiss();
                    };
                }],
                size: 'md',
                backdrop: 'static',
                template: "<div style=\"margin:20px;\"><div class=\"modal-header\"><h3 class=\"modal-title\"><span>{{'Payment_receipt'|translate}}</span><i ng-click=\"close()\" class=\"fa fa-remove cursor-pointer pull-right\"></i></h3></div><div class=\"modal-body\">" + receiptHtmlString + "</div></div>"
            });

            return modal;
        }

        function displayPunchCardSelect(punchCardDetails) {
            var modal = $uibModal.open({
                controller: "punchCardSelectController",
                controllerAs: "pcscc",
                backdrop: 'static',
                template: "<div style=\"margin:20px;\"><div class=\"modal-header\"><h3 class=\"modal-title\"><span>{{'Payment_receipt'|translate}}</span><i ng-click=\"close()\" class=\"fa fa-remove cursor-pointer pull-right\"></i></h3></div><div class=\"modal-body\">" + receiptHtmlString + "</div></div>"
            });

            return modal;
        }

        function displayGiftCertificateSelect(activities, products) {
            var modal = $uibModal.open({
                templateUrl: globalPartialURLs.giftCertificateModal,
                controller: "giftCertificateSelectController",
                controllerAs: "gcsc",
                backdrop: 'static',
                resolve: {
                    activities: function () {
                        return activities;
                    },
                    products: function () {
                        return products;
                    }
                }
            });

            return modal;
        }

        function displayKioskKickoutAlert() {
            var modal = $uibModal.open({
                controller: "kioskKickoutAlertCtrl",
                size: 'lg',
                controllerAs: 'kka',
                templateUrl: globalPartialURLs.kioskKickoutAlertModal
            });

            return modal;
        }

        function displayGiftCertificatePayment() {
            AnalyticService.sendAnalytics('modals/GiftCertificatePayment');

            var modal = $uibModal.open({
                controller: "giftCertificatePaymentController",
                controllerAs: 'gcpac',
                size: 'md',
                backdrop: 'static',
                templateUrl: globalPartialURLs.giftCertificatePayment
            });

            return modal;

        }

        function displayGiftCertificateOptions() {
            AnalyticService.sendAnalytics('modals/GiftCertificateOptions');

            var modal = $uibModal.open({
                controller: "giftCertificateOptionsController",
                controllerAs: 'gcoc',
                size: 'md',
                backdrop: 'static',
                templateUrl: globalPartialURLs.giftCertificateOptions
            });

            return modal;

        }

        function displayResourceDescription(resourceDescription) {
            AnalyticService.sendAnalytics('modals/ResourceDescription');

            var modal = $uibModal.open({
                controller: "resourceDescriptionController",
                controllerAs: 'rdc',
                size: 'md',
                backdrop: 'static',
                templateUrl: globalPartialURLs.resourceDescription,
                resolve: {
                    resourceDescription: function () {
                        return resourceDescription;
                    }
                }
            });

            return modal;
        }

        function displayScheduleTimeInfo(resourceList, service, selectedDate) {
            AnalyticService.sendAnalytics('modals/ScheduleTimeInfo');

            var modal = $uibModal.open({
                controller: "scheduleTimeInfoController",
                controllerAs: 'stic',
                size: selectedDate !== null && resourceList.length > 1 && resourceList.length < 7 ? 'sm' : 'md',
                backdrop: 'static',
                templateUrl: globalPartialURLs.scheduleTimeInfo,
                resolve: {
                    resourceList: function () {
                        return resourceList;
                    },
                    service: function () {
                        return service;
                    },
                    selectedDate: function () {
                        return selectedDate;
                    }
                }
            });

            return modal;
        }
    }

})(window.angular);
;
(function (angular) {
	'use strict';

	angular
		.module('app')
		.factory('NikitaService', NikitaService);

	NikitaService.$inject = ['AuthService', '$location'];

	/* > ngInject < */
	function NikitaService(AuthService, $location) {

		var _nikitaSettings = {
			isNikita: false,
			externalIframeDomain: "",
			iframeUrl: ""
		}
		var nikitaUserPageExternalIframeController = "/ExternalAuth/LocalStorage";

		var keyToSearchToken = "HANO.authorizationData";
		var iframe = $("#nikitaLocalStorageIframe")[0];


		var service = {
			fillNikitaSettings: fillNikitaSettings,
			getNikitaSettings: getNikitaSettings,
			getAndSetAccessTokenFromUserPages: getAndSetAccessTokenFromUserPages,
			sendAccessTokenToUserPages: sendAccessTokenToUserPages,
			removeAccessTokenFromUserPages: removeAccessTokenFromUserPages,
			getComplimentTermsUrl: getComplimentTermsUrl
		};
		return service;

		////////////////

		function fillNikitaSettings(settings) {
			//--------------------------------------------------- FOR DEBUG UNCOMMENT THIS--------------------------------------------------------
			//_nikitaSettings.isNikita = true;;
			//_nikitaSettings.externalIframeDomain = "http://nikita.localhost.no";
			//_nikitaSettings.iframeUrl = "http://nikita.localhost.no/NikitaUserPage-trunk/ExternalAuth/LocalStorage";

			//--------------------------------------------------- FOR LIVE UNCOMMENT THIS--------------------------------------------------------
			if (!settings.isNikita) {
					//iframe.remove();
					iframe.parentNode.removeChild(iframe);
				return;
			}
			_nikitaSettings.isNikita = settings.isNikita;;
			_nikitaSettings.externalIframeDomain = settings.externalIframeDomain;
			_nikitaSettings.iframeUrl = settings.externalIframeDomain + nikitaUserPageExternalIframeController;
		}

		function getNikitaSettings() {
			return _nikitaSettings;
		}


		function getComplimentTermsUrl() {

			return "https://nikita.no/compliments-fordelsprogram/betingelser-og-vilkar-compliments/";

			//determine if the database belongs to SE or NO
			//return "https://nikita.no/compliments-fordelsprogram/betingelser-og-vilkar-compliments/";
			//return "http://nikitahair.se/kundklubb/villkor-och-bestammelser/";
		}

		function getAndSetAccessTokenFromUserPages(waitList) {
			if (!_nikitaSettings.isNikita) {
				return;
			}
			var win;
			try {
				win = iframe.contentWindow;
			} catch (e) {
				win = iframe.contentWindow;
			}
			win.postMessage(JSON.stringify({ key: keyToSearchToken, method: "get" }), "*");
			window.onmessage = function (e) {
				if (e.origin != _nikitaSettings.externalIframeDomain) {
					return;
				}
				if (e.data) {
					var token_response = JSON.parse(e.data);
					AuthService.performExternalLogin(token_response.token, token_response.userName);
				} else {
					AuthService.logout(true);
				}
			};
		}

		function sendAccessTokenToUserPages() {
			if (!_nikitaSettings.isNikita) {
				return;
			}
			var win;
			try {
				win = iframe.contentWindow;
			} catch (e) {
				win = iframe.contentWindow;
			}
			var token = AuthService.getAuthorizationDataLocalStorage();
			if (token) {
				win.postMessage(JSON.stringify({ key: keyToSearchToken, method: "set", data: token }), "*");
			}

		}

		function removeAccessTokenFromUserPages() {
			if (!_nikitaSettings.isNikita) {
				return;
			}
			var win;
			try {
				win = iframe.contentWindow;
			} catch (e) {
				win = iframe.contentWindow;
			}
			if (AuthService.getAuth().isAuth) {
				win.postMessage(JSON.stringify({ key: keyToSearchToken, method: "remove" }), "*");
			}

		}
	}

})(window.angular);


;
(function (angular) {
	'use strict';

	angular
        .module('app')
        .factory('ProductGroupService', ProductGroupService);

	ProductGroupService.$inject = ['$http', '$filter','$q','$timeout'];

	/* > ngInject < */
	function ProductGroupService($http, $filter, $q, $timeout) {
		var _allProducts = null;
		var _productGroupTree = null;
		var _productGroups = [];

		var service = {
			getProductGroup: getProductGroup,
			getProductGroupTree: getProductGroupTree,
			getAllProducts: getAllProducts,
			searchProductsByName: searchProductsByName
		};
		return service;

		////////////////

		function getProductGroup(id) {
			return $q(function (resolve, reject) {
				var group = $filter("getById")(_productGroups, id);
				if (group === null) {
					$http.get(globalApiURLs.productGroup + "?id=" + id).then(function (data) {
						group = {
							id: id,
							productGroup: data.data
						}
						_productGroups.push(group);
						resolve(group);
					});
				} else {
					$timeout(function() {
						resolve(group);
						},300);
				}
			});

		}
		function getProductGroupTree() {
			return $q(function (resolve, reject) {
				if (_productGroupTree === null) {
					$http.get(globalApiURLs.productGroup + "/GetProductGroupTree").then(function (data) {
						_productGroupTree = data.data;
						resolve(_productGroupTree);
					});
				} else {
					resolve(_productGroupTree);
				}
			});
		}
		function getAllProducts() {
			return $q(function (resolve, reject) {
				if (_allProducts === null) {
					$http.get(globalApiURLs.product).then(function (data) {
						_allProducts = data;
						resolve(_allProducts);
					});
				} else {
					resolve(_allProducts);
				}
			});
		}
		function searchProductsByName(name) {
			return $http.get(globalApiURLs.product + "/search/" + name);
		}
	}

})(window.angular);


;
(function (angular) {
    'use strict';

    angular
        .module('app')
        .factory('PurchaseService', PurchaseService);

	PurchaseService.$inject = ["$timeout", '$http', 'BookingService'];

    /* > ngInject < */
	function PurchaseService($timeout, $http, BookingService) {

        return {
			beginGiftCertificatePurchase: beginGiftCertificatePurchase,
			beginPurchase: beginPurchase,
            createBooking: createBooking
        }

        function beginGiftCertificatePurchase(options) {
            return $http.post(globalApiURLs.giftCertificate + "/purchase", options)
                .then(function (response) {
                    return response.data;
                }, function (reason) {
                    console.log('failed creating gift certificate purchase: ' + reason.statusCode);
                    return null;
                });
		}

		function beginPurchase() {
			console.log("purchase start");
		}

        function createBooking(postRequestActivity, successCallback, errorCallback) {
			BookingService.createBooking(postRequestActivity)
						  .then(successCallback, errorCallback);
        }

        

    }

})(window.angular);


;
(function (angular) {
	'use strict';

	angular
        .module('app')
        .factory('ResourceService', ResourceService);

	ResourceService.$inject = ['$http', '$q'];

	/* > ngInject < */
	function ResourceService($http, $q) {
		var _resources = null;
		var _ignoreReservationRules = false;

		var service = {
			getAllResources: getAllResources,
			getResource: getResource,
			getResourcesForService: getResourcesForService,
            getResourcesForServices: getResourcesForServices,
            getResourceCategories: getResourceCategories,
			getResourceCoverage: getResourceCoverage,
			getResourcesWithServicesForCustomer: getResourcesWithServicesForCustomer
		};
		return service;

		////////////////

		function getResourcesWithServicesForCustomer() {
			return $http.get(globalApiURLs.resource + "/getResourcesWithServicesForCustomer");
		}

        function getAllResources(ignoreReservationRules) {

            var params = {
                ignoreReservationRules: false
            }

            if (ignoreReservationRules === true) {
                params.ignoreReservationRules = true;
            }

            return $q(function (resolve, reject) {
				if (_resources === null || _ignoreReservationRules != params.ignoreReservationRules) {
                    $http.get(globalApiURLs.resource, { params: params })
                        .then(function (data) {
							_resources = data.data;
							_ignoreReservationRules = params.ignoreReservationRules;
                            resolve(_resources);
                        });
                } else {
                    resolve(_resources);
                }
            });
        }

		function getResource(id) {
			return $http.get(globalApiURLs.resource, { params: { id: id } });
		}
		function getResourcesForService(selectedService, allResources) {
			var allowedResources = [];

			if (selectedService === undefined || selectedService === null) {
				allowedResources = angular.copy(allResources);
			} else {
				if (selectedService.isCombined) {
					for (var i = 0; i < allResources.length; i++) {
						for (var j = 0; j < allResources[i].providesCombined.length; j++) {
							if (allResources[i].providesCombined[j].id === selectedService.id) {
								allowedResources.push(allResources[i]);
							}
						}
					}
				} else {
					for (var i = 0; i < allResources.length; i++) {
						for (var j = 0; j < allResources[i].provides.length; j++) {
							if (allResources[i].provides[j].id === selectedService.id) {
								allowedResources.push(allResources[i]);
							}
						}
					}
				}
			}
			return allowedResources;
		}
		function getResourcesForServices(services, allresources) {
			var filteredResources = [];
			for (var i = 0; i < allresources.length; i++) {
				var success = true;
				for (var j = 0; j < services.length; j++) {
					var containResource = false;
					for (var k = 0; k < services[j].providedBy.length; k++) {
						if (services[j].providedBy[k].id === allresources[i].id) {
							containResource = true;
						}
					}
					if (!containResource) {
						success = false;
					}
				}
				if (success) {
					filteredResources.push(allresources[i]);
				}
			}
			return filteredResources;
        }

        function getResourceCategories() {
            return $http.get(globalApiURLs.resource + "/getResourceCategory");
        }

        function getResourceCoverage(queryParams) {
            return $http.post(globalApiURLs.resource + "/getResourceCoverage", queryParams);
        }
	}

})(window.angular);


;
(function (angular) {
    'use strict';

    angular
        .module('app')
        .factory('ScheduleTimeInfoService', ScheduleTimeInfoService);

    ScheduleTimeInfoService.$inject = ['$http'];

    function ScheduleTimeInfoService($http) {

        var service = {
            getPublishedWeeks: getPublishedWeeks,
            getWeekSchedule: getWeekSchedule,
            getDaySchedule: getDaySchedule
        };
        return service;


        function getPublishedWeeks() {
            return $http.post(globalApiURLs.time + "/publishedWeeks");
        }


        function getWeekSchedule(selectedWeek, resource, service) {
            if (selectedWeek !== null) {
                var weekSchedule = {
                    week: selectedWeek.week,
                    year: selectedWeek.year,
                    starts: selectedWeek.starts,
                    resourceId: resource.id,
                    ends: selectedWeek.ends,
                    serviceId: service.id
                };
                return $http.post(globalApiURLs.time + "/weekSchedule", weekSchedule);
            }            
        }

        function getDaySchedule(selectedDate, resourceIdList, service) {
            if (selectedDate !== null) {
                var daySchedule = {
                    selectedDate: selectedDate,
                    resourceIdList: resourceIdList,
                    serviceId: service.id
                };
                return $http.post(globalApiURLs.time + "/dayScheduleAll", daySchedule);
            }
        }
    }

})(window.angular);


;
(function (angular) {
	'use strict';

	angular
        .module('app')
        .factory('ServiceGroupService', ServiceGroupService);

	ServiceGroupService.$inject = ['$http'];

	/* > ngInject < */
	function ServiceGroupService($http) {
		var _serviceGroups = null;

		///////////////////////////////
		var service = {
			getAllServiceGroups: getAllServiceGroups,
			getServiceGroup: getServiceGroup
		};
		return service;

		////////////////

		function getAllServiceGroups() {
			return $q(function (resolve, reject) {
				if (_serviceGroups === null) {
					$http.get(globalApiURLs.serviceGroup).then(function (data) {
						_serviceGroups = data.data;
						resolve(_serviceGroups);
					});
				} else {
					resolve(_serviceGroups);
				}
			});
		}

		function getServiceGroup(id) {
			return $http.get(globalApiURLs.serviceGroup+"?id="+id);
		}
	}

})(window.angular);


;
(function (angular) {
	'use strict';

	angular
        .module('app')
        .factory('ServiceService', ServiceService);

	ServiceService.$inject = ['$http', '$q'];

	/* > ngInject < */
	function ServiceService($http, $q) {
		var _services = null;
		var _quickServices = null;


		var service = {
			getAllServices: getAllServices,
			getAllBookableServices:getAllBookableServices,
			getService: getService,
			getQuickServices: getQuickServices,
			getQuickService: getQuickService,
			fillQuickServices: fillQuickServices,
			getServicesForResource: getServicesForResource,
			getServicesForServiceGroup: getServicesForServiceGroup
		};
		return service;

		////////////////

		function getAllServices() {
			return $q(function (resolve, reject) {
				if (_services === null) {
					$http.get(globalApiURLs.service).then(function (data) {
						_services = data.data;
						resolve(_services);
					});
				} else {
					resolve(_services);
				}
			});
		}
		function getAllBookableServices() {
			return $q(function (resolve, reject) {
				if (_services === null) {
					$http.get(globalApiURLs.service).then(function (data) {
							_services = data.data;
						var list = angular.copy(_services);
						angular.forEach(list, function (service) {
								if (!service.bookingAllowed) {
									list.splice(list.indexOf(service), 1);
								}
							});
						resolve(list);
					});
				} else {
					var list = angular.copy(_services);
					angular.forEach(list, function (service) {
						if (!service.bookingAllowed) {
							list.splice(list.indexOf(service), 1);
						}
					});
					resolve(list);
				}
			});
		}
		function getService(id, isCombined) {
			return $http.get(globalApiURLs.service, { params: { id: id, isCombined: isCombined } });
		}

		function getQuickServices() {
			return _quickServices;
		}
		function getQuickService(id, isCombined) {
			for (var i = 0; i < _quickServices.length; i++) {
				if (_quickServices[i].id === id && _quickServices[i].isCombined === isCombined) {
					return _quickServices[i];
				}
			}
			return null;
		}
		function fillQuickServices(quickServices) {
			_quickServices = quickServices;
		}

		function getServicesForResource(selectedResource, allServices) {
			var allowedServices = [];
			if (selectedResource === undefined || selectedResource === null  || selectedResource.id === 0) {
				allowedServices = angular.copy(allServices);
			} else {
				for (var i = 0; i < allServices.length; i++) {
					for (var j = 0; j < allServices[i].providedBy.length; j++) {
						if (allServices[i].providedBy[j].id === selectedResource.id) {
							allowedServices.push(allServices[i]);
						}
					}
				}
			}
			return allowedServices;
		}

		function getServicesForServiceGroup(selectedServiceGroup, allServices) {
			var allowedServices = [];
			if (selectedServiceGroup === undefined || selectedServiceGroup === null) {
				allowedServices = allServices;
			} else {
				for (var i = 0; i < selectedServiceGroup.services.length; i++) {
					for (var j = 0; j < allServices.length; j++) {
						if (allServices[j].id === selectedServiceGroup.services[i].id && !allServices[j].isCombined && !selectedServiceGroup.services[i].isCombined) {
							allowedServices.push(allServices[j]);
						}
					}
				}
				for (var i = 0; i < selectedServiceGroup.combinedServices.length; i++) {
					for (var j = 0; j < allServices.length; j++) {
						if (allServices[j].id === selectedServiceGroup.combinedServices[i].id) {
							if (allServices[j].isCombined) {
								allowedServices.push(allServices[j]);
							}
						}
					}
				}
			}
			return allowedServices;
		}
	}

})(window.angular);


;
(function (angular) {
    'use strict';

    angular
        .module('app')
        .factory('SignalService', SignalService);

    SignalService.$inject = ['$rootScope', 'UtilityService'];


    function SignalService($rootScope, UtilityService) {
        var signalrConnection = $.hubConnection(signalrURL.paymentHub, {
            useDefaultPath: false
        });

        var paymentProxy = signalrConnection.createHubProxy("PaymentHub");
        var connectionStarted = false;
        var startTime;
        var lastPoll = false;

        paymentProxy.on("PaymentSucceeded", function (args) {
            paymentSucceded(args);
        });

        paymentProxy.on("PaymentCancelled", function () {
            paymentCancelled();
        });

        paymentProxy.on("PaymentFailed", function () {
            transactionComplete();
            $rootScope.$broadcast('PaymentFailed');
        });

        signalrConnection.disconnected(function () {
            console.log("connection lost...");
        });

        return {
            subscribeToPaymentHub: subscribeToPaymentHub
        };

        function transactionComplete() {
            signalrConnection.stop();
            connectionStarted = false;
            lastPoll = false;
        }

        function paymentSucceded(args) {
            transactionComplete();
            $rootScope.$broadcast('PaymentDone', args.paymentMethod, args.InvoiceId);
            $rootScope.$broadcast('PaymentDoneEx', args);
        }

        function paymentCancelled() {
            transactionComplete();
            $rootScope.$broadcast('PaymentCancelled');
        }

        function paymentFailed() {
            transactionComplete();
            $rootScope.$broadcast('PaymentFailed');
        }

        // Allows only one connection at a time
        async function subscribeToPaymentHub(transactionId) {
            if (connectionStarted) {
                return;
            }

            signalrConnection.qs = { "transactionId": transactionId };

            try {
                await signalrConnection.start();
                connectionStarted = true;
                lastPoll = false;
                console.log("Payment hub: connection established : " + transactionId);
                startTime = new Date();

                //Wait 30s to start polling.for status
                setTimeout(async function () {
                    console.log('WatchPayment inside setTimeout...')
                    await watchPayment(transactionId);
                }, 30000);

            } catch (e) {
                console.log("Payment hub: connection error");
                connectionStarted = false;
                lastPoll = false;
            }
        }

        async function startPolling(transactionId) {
            console.log('Polling for status...');
            if (!connectionStarted) {
                console.log('Connection not started')
                return false;
            }

            const elapsed = (new Date().getTime() - startTime.getTime()) / 1000;
            const diffInMinutes = Math.floor(elapsed / 60 % 60);

            //No reply within 2 minutes. so, give up
            if (diffInMinutes >= 2) {
                if (!lastPoll) {
                    console.log('Last poll...')
                    lastPoll = true;
                }
                else {
                    console.log('Even last poll did not work. So, Payment failed...')
                    paymentFailed();
                }

                if (diffInMinutes >= 3)
                    paymentFailed();
            }

            //read status from the server
            console.log('Polling for status... ' + transactionId)
            const result = await UtilityService.pollVippsStatus(transactionId, lastPoll);
            if (result.data.transactionId) {
                console.log('Status received... ' + result.data.transactionId)
                const args = {
                    InvoiceId: result.data.invoiceId,
                    TransactionId: result.data.transactionId,
                    GiftCertificates: result.data.giftCertificates
                }
                paymentSucceded(args);
            } else if (result.data.cancelled) {
                console.log('Received status: Payment cancelled... ' + transactionId)
                paymentCancelled();
            }

            return true;
        }

        function watchPayment(transactionId) {
            return new Promise(async function (resolve, reject) {
                try {
                    let polling = await startPolling(transactionId);
                    while (polling) {
                        console.log('Polling is continuing...')
                        polling = await startPolling(transactionId);
                    }
                    resolve();
                } catch (e) {
                    reject();
                }
            });
        }
    }
})(window.angular);
;
(function (angular) {
	'use strict';

	angular
        .module('app')
        .factory('templateService', templateService);

	templateService.$inject = ['$templateCache'];

	/* > ngInject < */
	function templateService($templateCache) {
		var service = {
			fillTemplateCache: fillTemplateCache
		};
		return service;


		function fillTemplateCache() {
			$templateCache.put("userAccountTabNavbar.html",
			  "<div>\n" +
			  "  <div class=\"btn-pref btn-group btn-group-justified btn-group-lg\"  ng-transclude></div>\n" +
			  "  <div class=\"tab-animation\">\n" +
			  "		<div class=\"tab-content well\">\n" +
			  "		 <div class=\"tab-pane\"\n" +
			  "			    ng-repeat=\"tab in tabset.tabs\"\n" +
			  "			   ng-class=\"{active: tabset.active === tab.index}\"\n" +
			  "		     uib-tab-content-transclude=\"tab\">\n" +
			  "		</div>\n" +
			  "		 </div>\n" +
			  "  </div>\n" +
			  "</div>\n" +
		  "");

			$templateCache.put("userAccountTab.html",
				"<div class=\"btn-group\" role=\"group\">" +
				"<button ng-class=\"[{'btn-primary': active, disabled: disabled}, classes]\" ng-click=\"select($event)\" class=\"btn btn-default\">\n" +
				"  <span   uib-tab-heading-transclude>{{heading}}</span>\n" +
				"</button>\n" +
				"</div>" +
			"");

			$templateCache.put("uib/template/datepicker/day.html",
			   "<table class=\"{{datepickerOptions.tableClass}}\" role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
			   "  <thead>\n" +
			   "    <tr>\n" +
			   "      <th><button type=\"button\" class=\"btn btn-default my-btn-no-border btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-left\"></i><span class=\"sr-only\">previous</span></button></th>\n" +
			   "      <th colspan=\"{{::5 + showWeeks}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default  btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
			   "      <th><button type=\"button\" class=\"btn btn-default my-btn-no-border btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-right\"></i><span class=\"sr-only\">next</span></button></th>\n" +
			   "    </tr>\n" +
			   "    <tr>\n" +
			   "      <th ng-if=\"showWeeks\" class=\"text-center\"></th>\n" +
			   "      <th ng-repeat=\"label in ::labels track by $index\" class=\"text-center\"><small aria-label=\"{{::label.full}}\">{{::label.abbr}}</small></th>\n" +
			   "    </tr>\n" +
			   "  </thead>\n" +
			   "  <tbody>\n" +
			   "    <tr class=\"uib-weeks\" ng-repeat=\"row in rows track by $index\" role=\"row\">\n" +
			   "      <td ng-if=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
			   "      <td ng-repeat=\"dt in row\" class=\"uib-day text-center\" role=\"gridcell\"\n" +
			   "        id=\"{{::dt.uid}}\"\n" +
			   "        ng-class=\"::dt.customClass\">\n" +
			   "        <button type=\"button\" ng-class=\"appendCustomClassForBtn(dt)\" class=\"btn btn-default btn-sm my-btn-no-border\"\n" +
			   "          uib-is-class=\"\n" +
			   "            'btn-info' for selectedDt,\n" +
			   "            'active' for activeDt\n" +
			   "            on dt\"\n" +
			   "          ng-click=\"select(dt.date)\"\n" +
			   "          ng-disabled=\"::dt.disabled\"\n" +
			   "          tabindex=\"-1\"><span  ng-class=\"appendCustomClass(dt)\" ng-class=\"::{'text-muted': dt.secondary, 'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
			   "      </td>\n" +
			   "    </tr>\n" +
			   "  </tbody>\n" +
			   "</table>\n" +
			   "");



			$templateCache.put("uib/template/datepicker/month.html",
			  "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
			  "  <thead>\n" +
			  "    <tr>\n" +
			  "      <th><button type=\"button\" class=\"btn btn-default my-btn-no-border btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-left\"></i><span class=\"sr-only\">previous</span></button></th>\n" +
			  "      <th colspan=\"{{::yearHeaderColspan}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
			  "      <th><button type=\"button\" class=\"btn btn-default my-btn-no-border btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-right\"></i><span class=\"sr-only\">next</span></i></button></th>\n" +
			  "    </tr>\n" +
			  "  </thead>\n" +
			  "  <tbody>\n" +
			  "    <tr class=\"uib-months\" ng-repeat=\"row in rows track by $index\" role=\"row\">\n" +
			  "      <td ng-repeat=\"dt in row\" class=\"uib-month text-center\" role=\"gridcell\"\n" +
			  "        id=\"{{::dt.uid}}\"\n" +
			  "        ng-class=\"::dt.customClass\">\n" +
			  "        <button  type=\"button\" class=\"btn btn-default my-btn-no-border\"\n" +
			  "          uib-is-class=\"\n" +
			  "            'btn-info' for selectedDt,\n" +
			  "            'active' for activeDt\n" +
			  "            on dt\"\n" +
			  "          ng-click=\"select(dt.date)\"\n" +
			  "          ng-disabled=\"::dt.disabled\"\n" +
			  "          tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
			  "      </td>\n" +
			  "    </tr>\n" +
			  "  </tbody>\n" +
			  "</table>\n" +
			  "");

			$templateCache.put("uib/template/datepicker/year.html",
			  "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
			  "  <thead>\n" +
			  "    <tr>\n" +
			  "      <th><button type=\"button\" class=\"btn btn-default my-btn-no-border btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-left\"></i><span class=\"sr-only\">previous</span></button></th>\n" +
			  "      <th colspan=\"{{::columns - 2}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
			  "      <th><button type=\"button\" class=\"btn btn-default my-btn-no-border btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-right\"></i><span class=\"sr-only\">next</span></button></th>\n" +
			  "    </tr>\n" +
			  "  </thead>\n" +
			  "  <tbody>\n" +
			  "    <tr class=\"uib-years\" ng-repeat=\"row in rows track by $index\" role=\"row\">\n" +
			  "      <td ng-repeat=\"dt in row\" class=\"uib-year text-center\" role=\"gridcell\"\n" +
			  "        id=\"{{::dt.uid}}\"\n" +
			  "        ng-class=\"::dt.customClass\">\n" +
			  "        <button type=\"button\" class=\"btn btn-default my-btn-no-border\"\n" +
			  "          uib-is-class=\"\n" +
			  "            'btn-info' for selectedDt,\n" +
			  "            'active' for activeDt\n" +
			  "            on dt\"\n" +
			  "          ng-click=\"select(dt.date)\"\n" +
			  "          ng-disabled=\"::dt.disabled\"\n" +
			  "          tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
			  "      </td>\n" +
			  "    </tr>\n" +
			  "  </tbody>\n" +
			  "</table>\n" +
			  "");


			$templateCache.put("wizard.html",
			  "<div>\n" +
			  "    <div class=\"steps\" ng-if=\"indicatorsPosition === 'bottom'\" ng-transclude></div>\n" +
			  "    <ul class=\"steps-indicator steps-{{getEnabledStepsInIndicator().length}}\" ng-if=\"!hideIndicators\">\n" +
			  "      <li ng-hide=\"step.wzData.hideIndicators==true\" ng-class=\"{default: !step.completed && !step.selected, current: step.selected && !step.completed, done: step.completed && !step.selected, editing: step.selected && step.completed}\" ng-repeat=\"step in getEnabledSteps()\">\n" +
			  "        <a ng-click=\"goTo(step)\"><i ng-show=\"step.wzData.indicatorIcon.length>0 && screenOptions.screenSize<350\" class=\"fa fa-2x {{step.wzData.indicatorIcon}}\"></i> <span ng-hide=\"screenOptions.screenSize<350\">{{step.title || step.wzTitle}}</span></a>\n" +
			  "      </li>\n" +
			  "    </ul>\n" +
			  "    <div class=\"steps\" ng-if=\"indicatorsPosition === 'top'\" ng-transclude></div>\n" +
			  "</div>\n" +
			  "");
		}

	}

})(window.angular);


;
(function (angular) {
    'use strict';

    angular
        .module('app')
        .factory('UserAccountService', UserAccountService);

    UserAccountService.$inject = ['$http'];

    /* > ngInject < */
    function UserAccountService($http) {
        var service = {
            getCustomerFutureBookingsForLoginWithoutPassword: getCustomerFutureBookingsForLoginWithoutPassword,
            validateLoginWithoutPassword: validateLoginWithoutPassword,
            loginWithoutPassword: loginWithoutPassword,
            getCustomerInfo: getCustomerInfo,
            deleteUser: deleteUser,
            getCustomerScheme: getCustomerScheme,
            validateCustomerSchemeForExistingCustomer: validateCustomerSchemeForExistingCustomer,
            updateCustomerFields: updateCustomerFields,
            getCustomerHistoryBookings: getCustomerHistoryBookings,
            getCustomerProductHistory: getCustomerProductHistory,
            getCustomerFutureBookings: getCustomerFutureBookings,
            getCustomerEmailAndPhone: getCustomerEmailAndPhone,
            checkIfCustomerWithThisFieldAlreadyExists: checkIfCustomerWithThisFieldAlreadyExists,
            getDuplicatedCustomerFields: getDuplicatedCustomerFields,
            getDuplicatedCustomerFieldsForRegisteredUser: getDuplicatedCustomerFieldsForRegisteredUser,
            checkIfCustomerWithThisFieldAlreadyExistsForRegisteredUser: checkIfCustomerWithThisFieldAlreadyExistsForRegisteredUser,
            updateComplimentUser: updateComplimentUser,
            getComplimentUser: getComplimentUser,
            getPunchCardDetails: getPunchCardDetails,
            updateCustomerMobile: updateCustomerMobile,
            checkIfSsnIsValid: checkIfSsnIsValid,
            getCustomerByMobile: getCustomerByMobile
        };
        return service;

        ////////////////

        function validateLoginWithoutPassword() {
            return $http.get(globalApiURLs.userAccount + "/ValidateLoginWithoutPassword");
        }

        function loginWithoutPassword(fieldName, fieldValue, otherRequiredFields) {
            return $http.post(globalApiURLs.userAccount + "/LoginWithoutPassword?fieldName=" +
                fieldName + "&fieldValue=" + fieldValue, otherRequiredFields);
        }

        function updateCustomerMobile(mobileNumber, countryCode) {
            var data = {
                mobileNumber: mobileNumber,
                countryCode: countryCode
            };
            return $http.put(globalApiURLs.userAccount + "/UpdateMobileNumber", data);
        }

        function getPunchCardDetails(serviceIds) {
            var queryString = serviceIds.map(function (id) {
                return 'serviceIds' + '=' + id;
            }).join('&');

            return $http.get(globalApiURLs.userAccount + "/punchcarddetails?" + queryString);
        }

        function getCustomerInfo() {
            return $http.get(globalApiURLs.userAccount + "/GetCurrentCustomer");
        }
        function deleteUser(customerId) {
            return $http.delete(globalApiURLs.userAccount + "/DeleteCustomer");
        }
        function getCustomerFutureBookings() {
            return $http.get(globalApiURLs.userAccount + "/GetActivities");
        }
        function getCustomerFutureBookingsForLoginWithoutPassword(fieldName, fieldValue, customerId) {
            return $http.post(globalApiURLs.userAccount + "/GetActivitiesForLoginWithoutPassword?fieldName=" + 
                fieldName + "&fieldValue=" + fieldValue + "&customerId=" + customerId);
        }
        function getCustomerHistoryBookings(pageNumber, pageSize) {
            return $http.get(globalApiURLs.userAccount + "/GetBookingHistory?pageNumber=" + pageNumber + "&pageSize=" + pageSize);
        }
        function getCustomerScheme() {
            return $http.get(globalApiURLs.customerScheme)
                .then(function (data) {
                    // we want to ensure that the smsreservationlevelid field has the default
                    // value set to the default when creating a new customer
                    var field = data.data.filter(function (f) {
                        return f.name.toLowerCase() === "smsreservationlevelid";
                    });
                    if ((field != null && field.length > 0) && field[0].value === undefined) {
                        field[0].value = field[0].defaultValue;
                    }

                    //all the other fields which have a default value should also be set.[CUST-356]
                    var defaultFields = data.data.filter(function (f) {
                        return f.defaultValue != null || f.defaultValue != undefined;
                    });

                    for (var i = 0; i < defaultFields.length; i++) {
                        var currentField = defaultFields[i];
                        if (currentField.name.toLowerCase() === "customerid")
                            continue;

                        if (currentField.value === undefined) {
                            currentField.value = currentField.defaultValue;
                        }
                    }

                    return data;
                });
        }
        function validateCustomerSchemeForExistingCustomer(customerId) {
            return $http.get(globalApiURLs.customerScheme + "/ValidateCustomerSchemeForExistingCustomer?customerId=" + customerId);
        }
        function updateCustomerFields(customer) {
            return $http.put(globalApiURLs.userAccount, customer);

        }
        function getCustomerProductHistory(pageNumber, pageSize) {
            return $http.get(globalApiURLs.userAccount + "/GetProductPurchaseHistory?pageNumber=" + pageNumber + "&pageSize=" + pageSize);
        }
        function getCustomerEmailAndPhone() {
            return $http.get(globalApiURLs.userAccount + "/getCustomerEmailAndPhone");
        }
        function checkIfCustomerWithThisFieldAlreadyExists(field, value) {
            value = value.replace("+", "%2B");
            return $http.get(globalApiURLs.customerScheme + "/CheckIfCustomerWithThisFieldAlreadyExists?field=" + field + "&value=" + value);
        }
        function checkIfCustomerWithThisFieldAlreadyExistsForRegisteredUser(field, value) {
            value = value.replace("+", "%2B");
            return $http.get(globalApiURLs.customerScheme + "/checkIfCustomerWithThisFieldAlreadyExistsForRegisteredUser?field=" + field + "&value=" + value);
        }
        function checkIfSsnIsValid(value) {
            return $http.get(globalApiURLs.customerScheme + "/CheckIfSsnIsValid?value=" + value);
        }
        function getDuplicatedCustomerFields(customerFields) {
            return $http.post(globalApiURLs.customerScheme + "/GetDuplicatedCustomerFields", customerFields);
        }
        function getDuplicatedCustomerFieldsForRegisteredUser(customerFields) {
            return $http.post(globalApiURLs.customerScheme + "/GetDuplicatedCustomerFieldsForRegisteredUser", customerFields);
        }
        function updateComplimentUser(setAsComplimentUser) {
            return $http.post(globalApiURLs.compliment + "/UpdateComplimentUser?setAsComplimentUser=" + setAsComplimentUser);
        }
        function getComplimentUser() {
            return $http.get(globalApiURLs.compliment + "/getComplimentUser");
        }

        function getCustomerByMobile(mobile) {
            return $http.get(globalApiURLs.userAccount + "/GetCustomerByMobile?mobile=" + mobile);
        }
    }

})(window.angular);


;
(function (angular) {
	'use strict';

	angular
		.module('app')
		.factory('UtilityService', UtilityService);

	UtilityService.$inject = ["$rootScope", "$window", "DepartmentService", "$timeout", "$q", "$http", "localStorageService", "CONST", "$filter", "ngCart", "$location", "$translate", "$state"];

	/* > ngInject < */
	function UtilityService($rootScope, $window, DepartmentService, $timeout, $q, $http, localStorageService, CONST, $filter, ngCart, $location, $translate, $state) {
		var _bootstrapBackgroundColors = {}
		var _colorScheme = {
			color: "",
			themeColorList: ["ontime", "normal", "nikita", "stjarnkliniken", "hairshop", "cerulean", "darkly", "slate", "united", "yeti", "cosmo", "cyborg", "flatly", "journal", "lumen", "paper", "readable", "sandstone", "simplex", "spacelab", "superhero"]
		}
		var _displayTypesOptions = [];
		var _timeplanOrientationOptions = ['horizontal', 'vertical'];
		var _screenOptions = {
			bootstrapClassScreenSize: null,
			screenSize: 0,
			isSmallScreen: false,
			navbarHeight: 50,
			navbarImageHeight: 70
		};

		//-------------------------------------------------fire on start------------------------
		angular.element($window).on('resize',
			function () {
				$rootScope.$apply(function () {
					updateScreenOptions();
				});
			});


		$rootScope.$watch(function () {
			return angular.element('#mainNavbar').height();
		}, function (newVal, oldVal) {
			updateScreenOptions();
		});

		//--------------------------//
		var service = {
			orderArrayByProperty: orderArrayByProperty,
			convertTimezoneToUTC: convertTimezoneToUTC,
			getStylesOfAClass: getStylesOfAClass,
			getBackgroundColorsBookingBlocks: getBackgroundColorsBookingBlocks,
			getFullAvailableTimeName: getFullAvailableTimeName,
			sendEmail: sendEmail,
			getWebsiteColorScheme: getWebsiteColorScheme,
			setWebsiteColorTheme: setWebsiteColorTheme,
			fillColorSchemeData: fillColorSchemeData,
			setTimeplanOrientation: setTimeplanOrientation,
			getTimeplanOrientation: getTimeplanOrientation,
			getTimeplanOrientationOptions: getTimeplanOrientationOptions,
			clearOldServicesFromCart: clearOldServicesFromCart,
			getBookingObjFromShoppingCart: getBookingObjFromShoppingCart,
			getProductsFromShoppingCart: getProductsFromShoppingCart,
			getDisplayTypesOptions: getDisplayTypesOptions,
			fillDisplayTypesOptions: fillDisplayTypesOptions,
			getDefaultDisplayType: getDefaultDisplayType,
			getPasswordStrengthRegex: getPasswordStrengthRegex,
			getOnlyNumbersRegex: getOnlyNumbersRegex,
			stripWhiteSpacesFromString: stripWhiteSpacesFromString,
			getPasswordStrengthRegexMessage: getPasswordStrengthRegexMessage,
			getCurrentDomain: getCurrentDomain,
			getCurrentProtocol: getCurrentProtocol,
			getScreenOptions: getScreenOptions,
			updateScreenOptions: updateScreenOptions,
            getRecommendations: getRecommendations,
            getTotalCostOfShoppingCart: getTotalCostOfShoppingCart,
            isDialogCloseText: isDialogCloseText,
            getDialogCloseText: getDialogCloseText,
            sendGiftCertificateByEmail: sendGiftCertificateByEmail,
			getGiftCertificateImage: getGiftCertificateImage,
			getGiftCertificateImageHtml: getGiftCertificateImageHtml,
			ssnValidationEnabled: ssnValidationEnabled,
			getBookingObject: getBookingObject,
			saveBookingInfoInStorage: saveBookingInfoInStorage,
			getBookingInfoFromStorage: getBookingInfoFromStorage,
			clearBookingInfoFromStorage: clearBookingInfoFromStorage,
			pollVippsStatus: pollVippsStatus,
			saveProductsAndServices: saveProductsAndServices,
			getProductsFromLocalStorage: getProductsFromLocalStorage,
			getServicesFromLocalStorage: getServicesFromLocalStorage,
			removeProductsAndServices: removeProductsAndServices,
			convertMinToHourAndMin: convertMinToHourAndMin
		};
		return service;

		////////////////

        function isDialogCloseText(text) {
            // the escape key press comes from angular-ui and is built-in
            return text === 'escape key press' || text === 'close';
        }

        function getDialogCloseText() {
            return "close";
        }

		function orderArrayByProperty(field) {
			return function compare(a, b) {
				if (a[field] < b[field])
					return -1;
				if (a[field] > b[field])
					return 1;
				return 0;
			}
		}

		function convertTimezoneToUTC(date) {
			var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
			return d;
		}

		//method for gething CSS class property (of background color)
		function getStylesOfAClass(className_) {
			var styleSheets = window.document.styleSheets;
			var styleSheetsLength = styleSheets.length;
			for (var i = 0; i < styleSheetsLength; i++) {
				var classes = styleSheets[i].rules || styleSheets[i].cssRules;
				if (!classes)
					continue;
				var classesLength = classes.length;
				for (var x = 0; x < classesLength; x++) {
					if (classes[x].selectorText === className_) {
						return classes[x].style;
					}
				}
			}
			return null;
		}

		function getBackgroundColorsBookingBlocks() {
			//for now we will disable loading of bootstrap colors, and use our hard-coded colors, but if needed just remove true statement and put pref if we want use bootstrap colors
			if (true) {
				_bootstrapBackgroundColors.primary = "midnightblue";
				_bootstrapBackgroundColors.success = "greenyellow";
				_bootstrapBackgroundColors.warning = "orange";
				_bootstrapBackgroundColors.info = "lightskyblue";
				_bootstrapBackgroundColors.danger = "indianred";
				_bootstrapBackgroundColors.default = "grey";
				_bootstrapBackgroundColors.customGrey = "#bbb";
			} else {
				$timeout(function () {
					_bootstrapBackgroundColors.primary = getStylesOfAClass(".btn-primary").backgroundColor;
					_bootstrapBackgroundColors.success = getStylesOfAClass(".btn-success").backgroundColor;
					_bootstrapBackgroundColors.warning = getStylesOfAClass(".btn-warning").backgroundColor;
					_bootstrapBackgroundColors.info = getStylesOfAClass(".btn-info").backgroundColor;
					_bootstrapBackgroundColors.danger = getStylesOfAClass(".btn-danger").backgroundColor;
					_bootstrapBackgroundColors.default = getStylesOfAClass(".btn-default").backgroundColor;
					_bootstrapBackgroundColors.customGrey = "#bbb";
				}, 500);
			}

			return _bootstrapBackgroundColors;
		}

		function sendEmail(email) {
			return $http.post(globalApiURLs.email + "/SendEmail", email);
		}
		function getWebsiteColorScheme() {
			return _colorScheme;
		}
		function setWebsiteColorTheme(color) {
			if (_colorScheme.themeColorList.indexOf(color) === -1) {
				color = "normal";
			}
			localStorageService.set("websiteColorTheme", color);
			_colorScheme.color = color;
		}
		function fillColorSchemeData() {
			var color = localStorageService.get("websiteColorTheme");
			var defaultColor = DepartmentService.getDepartmentPreferences().cust2016_WebsiteColorScheme;
			var enabledChangingColor = false; /*DepartmentService.getDepartmentPreferences().cust2016_EnableChangingColorScheme;*/

			if (enabledChangingColor === "false") {
				if (_colorScheme.themeColorList.indexOf(defaultColor) === -1) {
					color = "normal";
				} else {
					color = defaultColor;
				}
			} else {
				if (color === null || _colorScheme.themeColorList.indexOf(color) === -1) {
					if (_colorScheme.themeColorList.indexOf(defaultColor) === -1) {
						color = "normal";
					} else {
						color = defaultColor;
					}
				}
				//else color is from local storage
			}
			_colorScheme.color = color;
		}
		function setTimeplanOrientation(orientation) {
			if (_timeplanOrientationOptions.indexOf(orientation) === -1) {
				return;
			}
			localStorageService.set("timeplanOrientation", orientation);
		}
		function getTimeplanOrientation() {
			if (DepartmentService.getDepartmentPreferences().cust2016_EnableTimeplanOrientationChanges === 'true') {
				var orientation = localStorageService.get("timeplanOrientation");
				if (orientation === null || _timeplanOrientationOptions.indexOf(orientation) === -1) {
					return "horizontal";
				}
				return orientation;
			} else {
				var defaultTimeplanVertical = DepartmentService.getDepartmentPreferences().cust2016_DefaultTimeplanVertical;
				if (defaultTimeplanVertical === "true") {
					return "vertical";
				} else {
					return "horizontal";
				}
			}
		}
		function getTimeplanOrientationOptions() {
			return _timeplanOrientationOptions;
		}
		function getFullAvailableTimeName(selectedService, availableTime) {
			return selectedService.name + " " + $filter('date')(availableTime.start, "short") + " - " + $filter('date')(availableTime.end, "shortTime");
		}
		function clearOldServicesFromCart() {
			var date = new Date();
			var listOfIndexesToDelete = [];
			for (var i = 0; i < ngCart.getItems().length; i++) {
				if (ngCart.getItems()[i].getData().product === false) {
					var cartObjDate = new Date(ngCart.getItems()[i].getData().bookingInfo.start);
					if (date.getTime() > cartObjDate.getTime()) {
						listOfIndexesToDelete.push(ngCart.getItems().indexOf(ngCart.getItems()[i]));
					}
				}
			}
			for (var i = 0; i < listOfIndexesToDelete.length; i++) {
				ngCart.removeItem(listOfIndexesToDelete[i]);
			}
		}

        function getTotalCostOfShoppingCart() {
            var allItems = ngCart.getItems();
            var cost = 0;
            for (var i = 0; i < allItems.length; i++) {
                cost += allItems[i].getPrice();
            }
            return cost;
        }

		function getBookingObjFromShoppingCart() {
			var allItems = ngCart.getItems();
			var onlyBookingItems = [];
			for (var i = 0; i < allItems.length; i++) {
				if (allItems[i].getData().product === false) {
					onlyBookingItems.push(allItems[i].getData().bookingInfo);
				}
			}
			return onlyBookingItems;
		}
		function getProductsFromShoppingCart() {
			var allItems = ngCart.getItems();
			var onlyProducts = [];
			for (var i = 0; i < allItems.length; i++) {
				if (allItems[i].getData().product === true) {
					onlyProducts.push(allItems[i]);
				}
			}
			return onlyProducts;
		}
		function getDisplayTypesOptions() {
			return _displayTypesOptions;
		}
		function fillDisplayTypesOptions() {
			var prefs = DepartmentService.getDepartmentPreferences();
			if (prefs.cust2016_DisableTimeplan === 'false') {
				_displayTypesOptions.push("timeplan");
			}
			_displayTypesOptions.push("list");
		}
		function getDefaultDisplayType() {
			var prefs = DepartmentService.getDepartmentPreferences();
			var defaultType = "";
			if (prefs.cust2016_DefaultResultViewTimeplan === 'true') {
				defaultType = 'timeplan';
			} else {
				defaultType = 'list';
			}
			var index = getDisplayTypesOptions().indexOf(defaultType);
			if (index === -1) {
				return getDisplayTypesOptions()[0];
			} else {
				return defaultType;
			}
		}


		function getPasswordStrengthRegex() {
			var prefs = DepartmentService.getDepartmentPreferences();
			var strengthValue = prefs.cust2016_CustomerPasswordStrength;
			var regex;
			if (strengthValue === '8') {
				//strong password (8 letters, one uppercase, one lowercase, one number)
				regex = "(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}";
			} else if (strengthValue === '4') {
				//medium strength  (6 letters, one uppercase, one lowercase)
				regex = "(?=.*?[A-Z])(?=.*?[a-z]).{6,}";
			} else {
				//default set to low strength  (4 letters)
				regex = ".{4,}";
			}
			return regex;
		}

		function getOnlyNumbersRegex() {
				var regex = /^((\d)(\s)*?){8,}$/;
			return regex;
		}
		function stripWhiteSpacesFromString(value) {
			return value.replace(/\s/g, "");
		}

		function getPasswordStrengthRegexMessage() {
			var prefs = DepartmentService.getDepartmentPreferences();
			var strengthValue = prefs.cust2016_CustomerPasswordStrength;
			var message;
			if (strengthValue === '8') {
				//strong password  (8 letters, one uppercase, one lowercase, one number)
				message = $translate.instant("Password_strength_high");
			} else if (strengthValue === '4') {
				//medium strength  (6 letters, one uppercase, one lowercase)
				message = $translate.instant("Password_strength_medium");
			} else {
				//default set to low strength  (4 letters)
				message = $translate.instant("Password_strength_low");
			}
			return message;
		}

		function getCurrentDomain() {
			var domainParts = $location.host().split('.');
			domainParts.shift(); // removes the first item from the array
			var domain = "." + domainParts.join('.');

			return domain;
		}

		function getCurrentProtocol() {
			var protocol = $location.protocol();

			return protocol;
		}

		function getScreenOptions() {
			return _screenOptions;
		}

		function updateScreenOptions() {
			$timeout(function () {
				updateScreenSize();
				updateNavbarHeight();
			});
		}


		function getRecommendations(services, combinedServices, products) {
			return $http.post(globalApiURLs.utility + "/GetRecommendations",
				{
					services: services,
					combinedServices: combinedServices,
					products: products
				});
		}

        function sendGiftCertificateByEmail(giftCertificateId) {
            console.log("send gift certificate with id " + giftCertificateId.toString());
            return $http.post(globalApiURLs.giftCertificate + "/SendByEmail/" + giftCertificateId.toString(), null);
        }

        function getGiftCertificateImage(giftCertificateId) {
            return $http.post(globalApiURLs.giftCertificate + "/GetImage/" + giftCertificateId.toString(), null);
		}

		function getGiftCertificateImageHtml(giftCertificateId) {
			return $http.post(globalApiURLs.giftCertificate + "/GetImageHtml/" + giftCertificateId.toString(), null);
		}

		//----------------------------------------------------------------not exposed to service---------------------------------------
		function updateScreenSize() {
			var envs = ['xs', 'sm', 'md', 'lg'];
			var $el = $('<div>');
			$el.appendTo($('html'));
			for (var i = envs.length - 1; i >= 0; i--) {
				var env = envs[i];
				$el.addClass('hidden-' + env);
				if ($el.is(':hidden')) {
					$el.remove();
					_screenOptions.bootstrapClassScreenSize = env;
					_screenOptions.isSmallScreen = env === 'xs';
					_screenOptions.screenSize = $window.innerWidth;
					return;
				}
			}
        }

        var _updateNavbarHeightResetTimerId = null;

		function updateNavbarHeight() {

            //if (_updateNavbarHeightResetTimerId) {
            //    // timer is active
            //    return;
            //}

            var height;
			if (!_screenOptions.isSmallScreen) {
				height = angular.element('#mainNavbar').height();
			} else {
				height = angular.element('#mainNavbar .navbar-header').height();
			}
			_screenOptions.navbarHeight = height;
            _screenOptions.navbarImageHeight = height + 20;

			// NGR: I think this is why we see the growing image of scissors 
			//      is caused by this firing multiple times in quick succession
			//i
            //_updateNavbarHeightResetTimerId = setTimeout(function () {
            //    clearTimeout(_updateNavbarHeightResetTimerId);
            //    _updateNavbarHeightResetTimerId = null;
            //},
            //250); // at most every 250 ms
		}

		function ssnValidationEnabled() {
			var prefs = DepartmentService.getDepartmentPreferences();
			return prefs.cust2016_ValidateSSN === 'true';
		}

		function getBookingObject(customerSelection, activityFields, onlyBookingItems, onlyProductItems) {

			var activityInfo = {};
			for (var i = 0; i < activityFields.length; i++) {
				activityInfo[activityFields[i].name] = activityFields[i].value;
			}

			var postRequestActivity = {
				activities: [],
				products: [],
				activitiesWithDetails: [],
				sendTextConfirmation: customerSelection.sendTextConfirmation,
				sendEmailConfirmation: customerSelection.sendEmailConfirmation,
				sendTextReminder: customerSelection.textReminderHour > 0,
				sendEmailReminder: customerSelection.emailReminderHour > 0,
				requireResource: customerSelection.requireResource,
				textReminderHour: customerSelection.textReminderHour,
				emailReminderHour: customerSelection.emailReminderHour,
				activityInfo: activityInfo,
				paymentMethod: customerSelection.paymentMethod,
				punchCards: [],
				giftCertificates: [],
				customerMobilePhone: customerSelection.customerMobilePhone
			};

			//Vipps fallback url
			var fallbackUrl = $state.href('vippsfallback', null, { absolute: true });
			var lastIndexOfTransaction = fallbackUrl.lastIndexOf('&tid=');
			if (lastIndexOfTransaction < 0) {
				postRequestActivity.vippsFallbackUrl = fallbackUrl;
			} else {
				postRequestActivity.vippsFallbackUrl = fallbackUrl.substr(0, lastIndexOfTransaction);
			}

			for (var j = 0; j < onlyBookingItems.length; j++) {
				var currentBooking = onlyBookingItems[j];
				postRequestActivity.activities.push({
					timeId: currentBooking.id,
					serviceId: currentBooking.service.id,
					isCombinedService: currentBooking.service.isCombined,
                    isUpsale: currentBooking.isUpsale || false,
                    serviceDurationMinutes: currentBooking.service.duration !== undefined ? currentBooking.service.duration : 0
				});
				postRequestActivity.activitiesWithDetails.push({
					id: currentBooking.id,
					serviceName: currentBooking.service.name,
					starts: currentBooking.start,
					ends: currentBooking.end
				});
			}

			for (var k = 0; k < onlyProductItems.length; k++) {
				var currentProduct = onlyProductItems[k];
				postRequestActivity.products.push({
					productId: currentProduct.getId(),
					quantity: currentProduct.getQuantity()
				});
			}

			return postRequestActivity;
		}

		function getBookingInfoFromStorage() {
			return localStorageService.get("postRequestActivity");
		}

		function saveBookingInfoInStorage(postRequestActivity) {
			localStorageService.set("postRequestActivity", postRequestActivity);
		}

		function clearBookingInfoFromStorage() {
			localStorageService.remove("postRequestActivity");
		}

		function pollVippsStatus(transactionId, lastPoll) {
			return $http.get(globalApiURLs.booking + "/vipps/" + transactionId + "/status?lastPoll=" + lastPoll);
		}

		function saveProductsAndServices(onlyBookingItems, onlyProductItems) {
			localStorageService.set("vippsProductItems", onlyProductItems);
			localStorageService.set("vippsBookingItems", onlyBookingItems);
		}

		function getProductsFromLocalStorage() {
			return localStorageService.get("vippsProductItems");
		}

		function getServicesFromLocalStorage() {
			return localStorageService.get("vippsBookingItems");
		}

		function removeProductsAndServices() {
			localStorageService.remove("vippsBookingItems");
			localStorageService.remove("vippsProductItems");
		}

		function saveProductsAndServices(onlyBookingItems, onlyProductItems) {
			localStorageService.set("vippsProductItems", onlyProductItems);
			localStorageService.set("vippsBookingItems", onlyBookingItems);
		}

		function getProductsFromLocalStorage() {
			return localStorageService.get("vippsProductItems");
		}

		function getServicesFromLocalStorage() {
			return localStorageService.get("vippsBookingItems");
		}

		function removeProductsAndServices() {
			localStorageService.remove("vippsBookingItems");
			localStorageService.remove("vippsProductItems");
		}

		function convertMinToHourAndMin (durationMin) {
			var hours = Math.floor(durationMin / 60);
			var minutes = durationMin % 60;

			if (hours === 0 && minutes > 0) {
				return minutes + " min";
			} else if (hours > 0 && minutes === 0) {
				return hours + "t ";
			}

			return hours + "t " + minutes + "min";
		}
	}


})(window.angular);


;
(function (angular) {
	'use strict';

	angular
		.module('app')
		.factory('WaitListService', WaitListService);

	WaitListService.$inject = ['$http'];

	/* > ngInject < */
	function WaitListService($http) {
		var service = {
			addToWaitList: addToWaitList,
			getWaitListByCustomer: getWaitListByCustomer,
			deleteWaitListItem: deleteWaitListItem
		};
		return service;

		////////////////

		function addToWaitList(waitList) {
			return $http.post(globalApiURLs.waitList, waitList);
		}
		function getWaitListByCustomer() {
			return $http.get(globalApiURLs.waitList);
		}
		function deleteWaitListItem(waitListId) {
			return $http.delete(globalApiURLs.waitList + "?waitListId=" + waitListId);
		}
	}

})(window.angular);


;
