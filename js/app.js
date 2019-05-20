(function() {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
        .directive('foundItems', FoundItems);

    function FoundItems() {
        var ddo = {
            restrict: 'E',
            template: '<div class="row"><div ng-repeat="item in menu.foundItems"><div class="clearfix" ng-if="$index % 2 == 0"></div><div class="col-md-6"><div class="jumbotron"><h2>{{item.name}}</h2><h3>{{item.short_name}}</h3><p>{{item.description}}</p><input type="button" ng-click="menu.onRemove({index: $index})" class="btn btn-lg btn-primary" value="Dont want this one!"></div></div></div></div><div class="alert alert-danger" role="alert" ng-show="menu.onEmpty">{{menu.onEmpty}}</div>',
            scope: {
                foundItems: '<',
                onEmpty: '<',
                onRemove: '&'
            },
            controller: NarrowItDownController,
            controllerAs: 'menu',
            bindToController: true
        };

        return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];

    function NarrowItDownController(MenuSearchService) {
        var menu = this;
        menu.shortName = '';

        menu.matchedMenuItems = function(searchTerm) {
            var promise = MenuSearchService.getMatchedMenuItems(searchTerm);

            promise.then(function(items) {
                if (items && items.length > 0) {
                    menu.message = '';
                    menu.found = items;
                } else {
                    menu.message = 'Nothing found!';
                    menu.found = [];
                }
            });
        };

        menu.removeMenuItem = function(itemIndex) {
            menu.found.splice(itemIndex, 1);
        }
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];

    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function(searchTerm) {
            return $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            }).then(function(response) {
                var foundItems = [];

                for (var i = 0; i < response.data['menu_items'].length; i++) {
                    if (searchTerm.length > 0 && response.data['menu_items'][i]['description'].toLowerCase().indexOf(searchTerm) !== -1) {
                        foundItems.push(response.data['menu_items'][i]);
                    }
                }

                return foundItems;
            });
        };
    }
})();
