(function() {
    "use strict";

    angular
        .module("TendrlModule")
        .component("volumeDetail", {

            restrict: "E",
            templateUrl: "/modules/volumes/volume-detail/volume-detail.html",
            bindings: {},
            controller: volumeDetailController,
            controllerAs: "vm"
        });

    /*@ngInject*/
    function volumeDetailController($stateParams, $scope, $rootScope, $interval, $state, brickStore, clusterStore, volumeStore, config) {

        var vm = this;

        vm.setTab = setTab;
        vm.isTabSet = isTabSet;
        vm.isDataLoading = true;

        vm.goToClusterDetail = goToClusterDetail;

        init();

        /**
         * @name init
         * @desc contains the initialisation logic
         * @memberOf volumeDetailController
         */
        function init() {
            vm.clusterId = $stateParams.clusterId;
            vm.volumeId = $stateParams.volumeId;

            if ($rootScope.clusterData) {
                _makeTabList();

                vm.clusterObj = clusterStore.getClusterDetails(vm.clusterId);
                vm.clusterName = vm.clusterObj.cluster_id || "NA";
                vm.clusterStatus = clusterStore.checkStatus(vm.clusterObj);
                if (!volumeStore.volumeList.length) {
                    volumeStore.getVolumeList(vm.clusterId)
                        .then(function(data) {
                            vm.volName = volumeStore.getVolumeObject(vm.volumeId).name ? volumeStore.getVolumeObject(vm.volumeId).name : vm.volumeId;
                            vm.isDataLoading = false;
                        });
                } else {
                    vm.volName = volumeStore.getVolumeObject(vm.volumeId).name ? volumeStore.getVolumeObject(vm.volumeId).name : vm.volumeId;
                    vm.isDataLoading = false;
                }


            } else {
                clusterStore.getClusterList()
                    .then(function(data) {
                        $rootScope.clusterData = data;
                        _makeTabList();

                        vm.clusterObj = clusterStore.getClusterDetails(vm.clusterId);
                        vm.clusterName = vm.clusterObj.cluster_id || "NA";
                        vm.clusterStatus = clusterStore.checkStatus(vm.clusterObj);
                        if (!volumeStore.volumeList.length) {
                            volumeStore.getVolumeList(vm.clusterId)
                                .then(function(data) {
                                    vm.volName = volumeStore.getVolumeObject(vm.volumeId).name ? volumeStore.getVolumeObject(vm.volumeId).name : vm.volumeId;
                                    vm.isDataLoading = false;
                                });
                        } else {
                            vm.volName = volumeStore.getVolumeObject(vm.volumeId).name ? volumeStore.getVolumeObject(vm.volumeId).name : vm.volumeId;
                            vm.isDataLoading = false;
                        }
                    });
            }
        }

        /**
         * @name setTab
         * @desc set tab for a cluster
         * @memberOf volumeDetailController
         */
        function setTab(newTab) {
            vm.activeTab = newTab;
        }

        /**
         * @name isTabSet
         * @desc check if the mentioned tab is set or not
         * @memberOf volumeDetailController
         */
        function isTabSet(tabNum) {
            return vm.activeTab === tabNum;
        }

        function goToClusterDetail() {
            $state.go("cluster-detail", { clusterId: vm.clusterId });
            //TODO: Remove this when UI will render navigation dynamically
            clusterStore.selectedTab = 2;
        }

        $scope.$on("GotClusterData", function(event, data) {
            var clusterData,
                len,
                i;

            if ($rootScope.clusterData !== null && typeof vm.clusterId !== "undefined") {
                clusterData = $rootScope.clusterData;
                len = clusterData.length;

                for (i = 0; i < len; i++) {

                    if (clusterData[i].cluster_id === vm.clusterId) {
                        $rootScope.selectedClusterOption = clusterData[i].cluster_id;
                        break;
                    }
                }
            }
        });

        /***Private Functions***/

        /**
         * @name _makeTabList
         * @desc returns tab list based on sds name
         * @memberOf volumeDetailController
         */
        function _makeTabList() {
            vm.tabList = {
                "Bricks": 1
            };
            vm.activeTab = vm.tabList["Bricks"];
        }

    }

})();
