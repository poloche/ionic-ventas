var aquarellaControllers = angular.module('aquarellaControllers', []);
aquarellaControllers.controller('CreditsController', function ($scope, PersonaDAO, ProductoDAO, CreditoDAO, $ionicModal) {
    $scope.items = [];
    $scope.persons = [];
    $scope.products = [];
    $scope.selectedProducts = [];
    $scope.persona = {};

    PersonaDAO.getAll().then(function (items) {
        $scope.items = items;
        $scope.persons = items;
    });
    ProductoDAO.getAllActivos().then(function (items) {
        $scope.products = items;
    });
    $scope.doRefresh = function () {
        PersonaDAO.getAll().then(function (items) {
            $scope.items = items;

            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.findPerson = function () {
        $ionicModal.fromTemplateUrl('js/views/findPerson.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function (modal) {
            $scope.modalFindPerson = modal;
            $scope.modalFindPerson.show();
        });
    };
    $scope.findProduct = function () {
        $ionicModal.fromTemplateUrl('js/views/findProduct.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function (modal) {
            $scope.modalFindProduct = modal;
            $scope.modalFindProduct.show();
        });
    };
    $scope.showAddCredit = function () {
        $ionicModal.fromTemplateUrl('js/views/newCredit.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };


    // function to close the modal
    $scope.closeModal = function (modalWindow) {
        $scope[modalWindow].hide();
    };

    //Cleanup the modal when we're done with it!
    //$scope.$on('$destroy', function () {
    //    $scope.modal.remove();
    //});

    //function to add items to the existing list
    $scope.AddCredit = function () {
        var total = 0;
        for (var p in $scope.products) {
            total += $scope.products[p].precio;
        }
        var credit = {"person": $scope.persona, "products": $scope.selectedProducts, "total": total};
        CreditoDAO.saveCredit(credit);
        $scope.closeModal('modal');
        $scope.persona = {};
        $scope.selectedProducts = [];
    };

    $scope.AddSelectedPerson = function (person) {
        $scope.persona = person;
        $scope.closeModal("modalFindPerson");
    };
    $scope.AddSelectedProduct = function (product) {
        $scope.selectedProducts.push(product);
        $scope.closeModal("modalFindProduct");
    };
});

aquarellaControllers.controller('PeopleController', function ($scope, PersonaDAO, $ionicModal) {
    $scope.persons = [];

    $scope.doRefresh = function () {
        PersonaDAO.getAll().then(function (items) {
            $scope.persons = items;

            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $ionicModal.fromTemplateUrl('js/views/newContact.html', {
        scope: $scope,
        animation: 'slide-in-down'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    $scope.AddItem = function (data) {
        PersonaDAO.savePerson(data);
        data = {};
        $scope.closeModal();
        $scope.doRefresh();
    };

});
aquarellaControllers.controller('ProductController', function ($scope, ProductoDAO, $ionicModal) {
    $scope.products = [];
    $scope.doRefresh = function () {
        ProductoDAO.getAll().then(function (items) {
            $scope.products = items;

            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.doRefresh();

    $ionicModal.fromTemplateUrl('js/views/newProduct.html', {
        scope: $scope,
        animation: 'slide-in-down'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    $scope.AddItem = function (data) {
        ProductoDAO.saveProduct(data);
        data = {};
        $scope.closeModal();
        $scope.doRefresh();
    };
});