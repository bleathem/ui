/// <reference path="../../../typings/tsd.d.ts" />

export class OSDService {
    config: Array<any>;
    rest: restangular.ICollection;
    static $inject: Array<string> = ['Restangular'];
    constructor(rest:restangular.ICollection) {
        this.rest = rest;
    }

    // **getList**
    // **@returns** a promise with all osds.
    getList() {
        return this.rest.all('osds').getList().then(function(osds) {
            return osds;
        });
    }

    // **get**
    // **@returns** a promise with osd metadata.
    get(id) {
        return this.rest.one('osds', id).get().then(function(osd) {
            return osd;
        });
    }

    // **create**
    // **@param** osds - Information about the list of osds.
    // **@returns** a promise which returns a request id to track the task.
    create(osds) {
        return this.rest.all('osds').post(osds);
    }
}
