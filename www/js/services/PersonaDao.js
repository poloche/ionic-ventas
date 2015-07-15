// Include dependency: ngCordova
var aquarellaServices = angular.module('aquarellaServices', []);

aquarellaServices.factory('DBA', function ($cordovaSQLite, $q, $ionicPlatform) {
    var self = this;

    // Handle query's and potential errors
    self.query = function (query, parameters) {
        parameters = parameters || [];
        var q = $q.defer();

        $ionicPlatform.ready(function () {
            $cordovaSQLite.execute(db, query, parameters)
                .then(function (result) {
                    q.resolve(result);
                }, function (error) {
                    console.warn('I found an error');
                    console.warn(error);
                    q.reject(error);
                });
        });
        return q.promise;
    }

    // Proces a result set
    self.getAll = function (result) {
        var output = [];

        for (var i = 0; i < result.rows.length; i++) {
            output.push(result.rows.item(i));
        }
        return output;
    }

    // Proces a single result
    self.getById = function (result) {
        var output = null;
        output = angular.copy(result.rows.item(0));
        return output;
    }

    return self;
});

aquarellaServices.factory('PersonaDAO', function ($cordovaSQLite, DBA) {
    var items = [];
    var self = this;
    return {
        savePerson: function (persona) {
            var parameters = [persona.nombre, persona.apellidos, persona.direcion, persona.telefono, 0, true];
            return DBA.query("INSERT INTO persona (nombre, apellido, direccion, phone, balance, estado) VALUES (?,?,?,?,?,?)", parameters);
        },
        findPerson: function (criteria) {
            var parameters = [criteria.id];
            return DBA.query("SELECT id, nombre FROM persona WHERE id = (?)", parameters)
                .then(function (result) {
                    return DBA.getById(result);
                });
        },
        getAll: function () {
            return DBA.query("SELECT id, nombre, apellido, balance FROM persona")
                .then(function (result) {
                    return DBA.getAll(result);
                });
        }
    }
});

aquarellaServices.factory('ProductoDAO', function ($cordovaSQLite, DBA) {
    var items = [];
    var self = this;
    return {
        saveProduct: function (producto) {
            var parameters = [producto.nombre, producto.detalle, producto.precio, producto.catalogo, producto.pagina, true];
            return DBA.query("INSERT INTO producto (nombre, detalle, precio, catalogo, pagina, estado) VALUES (?,?,?,?,?,?)", parameters);
        },
        findProduct: function (criteria) {
            var parameters = [criteria.id];
            return DBA.query("SELECT id, nombre, detalle, precio, catalogo, pagina, estado FROM producto WHERE id = (?)", parameters)
                .then(function (result) {
                    return DBA.getById(result);
                });
        },
        getAll: function () {
            return DBA.query("SELECT id, nombre, detalle, precio, catalogo, pagina, estado FROM producto")
                .then(function (result) {
                    return DBA.getAll(result);
                });
        },
        getAllActivos: function () {
            return DBA.query("SELECT id, nombre, detalle, precio, catalogo, pagina, estado FROM producto WHERE estado='true'")
                .then(function (result) {
                    return DBA.getAll(result);
                });
        }

    }
});

aquarellaServices.factory('CreditoDAO', function ($cordovaSQLite, DBA) {
    var items = [];
    var self = this;
    return {
        saveCredit: function (credit) {
            var creditParameters = [credit.person.id, new Date(), credit.total, true];
            var pedidoResult = DBA.query("INSERT INTO pedido (persona, fecha, total, estado) VALUES (?,?,?,?)", creditParameters);
            var itemIds = [];
            for (var i = 0; i < credit.products.length; i++) {
                var producto = credit.products[i];
                var productParameters = [producto.id, pedidoResult, producto.cantidad, producto.precio];
                itemIds.push(DBA.query("INSERT INTO item (pedido, producto, cantidad, precio) VALUES (?,?,?,?)", productParameters));
            }
            return pedidoResult;
        },
        findPedido: function (criteria) {
            var parameters = [criteria.id];
            return DBA.query("SELECT id, fecha, total FROM pedido WHERE id = (?)", parameters)
                .then(function (result) {
                    return DBA.getById(result);
                });
        },
        getAll: function () {
            return DBA.query("SELECT id, fecha, total FROM pedido")
                .then(function (result) {
                    return DBA.getAll(result);
                });
        }
    }
});