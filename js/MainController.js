/*jslint node: true*/
/*jslint nomen: true*/
/*global angular*/
/*global PouchDB*/
/*jslint es5: true */
'use strict';

var app = angular.module("pouchapp");

//start the main controller
app.controller("MainController", ['$scope', '$rootScope', '$state', '$stateParams', '$pouchDB', function ($scope, $rootScope, $state, $stateParams, $pouchDB) {
        
    //initiate $scope items
    $scope.items = {};

    //initialize service?
    $pouchDB.startListening();

// Listen for changes which include create or update events
    $rootScope.$on("$pouchDB:change", function (event, data) {
        $scope.items[data.doc._id] = data.doc;
        $scope.$apply();
    });

// Listen for changes which include only delete events
    $rootScope.$on("$pouchDB:delete", function (event, data) {
        delete $scope.items[data.doc._id];
        $scope.$apply();
    });

// Look up a document if we landed in the info screen for editing a document
    if ($stateParams.documentId) {
        $pouchDB.get($stateParams.documentId).then(function (result) {
            $scope.inputForm = result;
        });
    }

// Save a document with either an update or insert
    $scope.save = function (firstname, lastname, email) {
        var jsonDocument = {
            "firstname": firstname,
            "lastname": lastname,
            "email": email
        };
    // If we're updating, provide the most recent revision and document id
        if ($stateParams.documentId) {
            jsonDocument._id = $stateParams.documentId;
            jsonDocument._rev = $stateParams.documentRevision;
        }
        $pouchDB.save(jsonDocument).then(function (response) {
            $state.go("list");
        }, function (error) {
            console.log("ERROR -> " + error);
        });
    };

    $scope.delete = function (id, rev) {
        $pouchDB.delete(id, rev);
    };

}]); //end controller

