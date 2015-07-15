// Faraday Penetration Test IDE
// Copyright (C) 2013  Infobyte LLC (http://www.infobytesec.com/)
// See the file 'doc/LICENSE' for the license information

angular.module('faradayApp')
    .factory('WebVuln', ['BASEURL', '$http', function(BASEURL, $http) {
        WebVuln = function(data) {
            if(data) {
                this.set(data);
            }
        };

        WebVuln.prototype = {
            set: function(data) {
                var evidence = [],
                id = CryptoJS.SHA1(data.name + "." + data.desc).toString(),
                meta = {},
                now = new Date(),
                date = now.getTime(),
                selected = false;

                if(typeof(data.attachments) != undefined && data.attachments != undefined) {
                    for(var attachment in data.attachments) {
                        if(data.attachments.hasOwnProperty(attachment)) {
                            evidence.push(attachment);
                        }
                    }
                }

                // new vuln
                if(data._id === undefined) {
                    data['_id'] = data.parent + "." + id;
                    meta = {
                        "update_time": date,
                        "update_user": "",
                        "update_action": 0,
                        "creator": "UI Web",
                        "create_time": date,
                        "update_controller_action": "UI Web New",
                        "owner": ""
                    };
                } else {
                    if(data.selected != undefined) {
                        selected = data.selected;
                    }
                    this._rev = data._rev;
                    meta = {
                        "update_time": date,
                        "update_user":  data.metadata.update_user,
                        "update_action": data.metadata.update_action,
                        "creator": data.metadata.creator,
                        "create_time": data.metadata.create_time,
                        "update_controller_action": data.metadata.update_controller_action,
                        "owner": data.metadata.owner
                    };
                }

                this._id = data['_id'];
                this.date = date;
                this.delete = false;
                this.obj_id = id;
                this.owner = "";
                this.metadata = meta;
                this.selected = selected;
                this.type = "VulnerabilityWeb";
                this.web = true;

                // user-generated content
                this._attachments = evidence;
                this.data = data.data;
                this.desc = data.desc;
                this.easeofresolution = data.easeofresolution;
                this.impact = data.impact;
                this.method = data.method;
                this.name = data.name;
                this.owned = data.owned;
                this.params = data.params;
                this.parent = data.parent;
                this.path = data.path;
                this.pname = data.pname;
                this.query = data.query;
                this.refs = data.refs;
                this.request = data.request;
                this.resolution = data.resolution;
                this.response = data.response;
                this.severity = data.severity;
                this.website = data.website;
            },
            remove: function(ws) {
                var self = this,
                url = BASEURL + ws + "/" + self._id;
                return $http.delete(url);
            },
            update: function(ws, data) {
                var self = this,
                url = BASEURL + ws + "/" + self._id;
                return $http.post(url, data)
                    .success(function(data) {
                        self._rev = data.rev;
                    });
            },
            save: function(ws) {
                var self = this,
                url = BASEURL + ws + "/" + self._id,
                vuln = {};
                angular.extend(vuln, self);
                // remove UI-specific fields
                delete vuln.date;
                delete vuln.delete;
                delete vuln.selected;
                delete vuln.web;
                return $http.post(url, vuln)
                    .success(function(data) {
                        self._rev = data.rev;
                    });
            }
        };

        return WebVuln;
    }]);
/*
// Will this work?
    .factory('WebVuln', ['Vuln', 'BASEURL', '$http', function(Vuln, BASEURL, $http) {
        WebVuln = Object.create(Vuln);

        WebVuln = function(data) {
            if(data) {
                this.set(data);
            }
        };

        WebVuln.prototype = {
            set: function(data) {
                if(data._id === undefined) {
                    data['_id'] = CryptoJS.SHA1(data.name).toString();
                    //// couch ID including parent id
                    //var id = $scope.target_selected._id + "." + CryptoJS.SHA1($scope.name + "." + $scope.desc).toString();
                    //// object ID without parent
                    //var sha = CryptoJS.SHA1($scope.name + "." + $scope.desc).toString();
                }
                var evidence = [],
                date = obj.value.date * 1000;
                if(typeof(obj.value.attachments) != undefined && obj.value.attachments != undefined) {
                    for(var attachment in obj.value.attachments) {
                        evidence.push(attachment);
                    }
                }
                this._rev = data.rev;
                this._attachments = evidence;
                this.data = data.data;
                this.date = date;
                this.delete = false;
                this.desc = data.desc;
                this.easeofresolution = data.easeofresolution;
                this.impact = data.impact;
                this.metadata = data.metadata;
                this.method = data.method;
                this.name = data.name;
                this.obj_id = data.obj_id;
                this.owned = data.owned;
                this.owner = data.owner;
                this.params = data.params;
                this.parent = parent;
                this.path = path;
                this.pname = pname;
                this.query = query;
                this.refs = data.refs;
                this.request = request;
                this.resolution = data.resolution;
                this.response = response;
                this.selected = data.selected;
                this.severity = data.severity;
                this.type = "VulnerabilityWeb";
                this.web = true;
                this.website = data.website;
            }
        }

        return WebVuln;
    }]);
*/
