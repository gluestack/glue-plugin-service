"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
exports.PluginInstanceContainerController = void 0;
var _a = require("@gluestack/helpers"), SpawnHelper = _a.SpawnHelper, DockerodeHelper = _a.DockerodeHelper;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var file_exists_1 = require("./helpers/file-exists");
var PluginInstanceContainerController = (function () {
    function PluginInstanceContainerController(app, callerInstance) {
        this.status = "down";
        this.app = app;
        this.callerInstance = callerInstance;
        this.setStatus(this.callerInstance.gluePluginStore.get("status"));
        this.setPortNumber(this.callerInstance.gluePluginStore.get("port_number"));
        this.setContainerId(this.callerInstance.gluePluginStore.get("container_id"));
    }
    PluginInstanceContainerController.prototype.getCallerInstance = function () {
        return this.callerInstance;
    };
    PluginInstanceContainerController.prototype.installScript = function () {
        return ["npm", "install"];
    };
    PluginInstanceContainerController.prototype.buildScript = function () {
        return ["npm", "run", "build"];
    };
    PluginInstanceContainerController.prototype.runScript = function () {
    };
    PluginInstanceContainerController.prototype.getEnv = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4, this.getPortNumber()];
                    case 1: return [2, (_a.APP_PORT = _b.sent(),
                            _a)];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.getDockerJson = function () {
        return {};
    };
    PluginInstanceContainerController.prototype.getStatus = function () {
        return this.status;
    };
    PluginInstanceContainerController.prototype.getPortNumber = function (returnDefault) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        if (_this.portNumber) {
                            return resolve(_this.portNumber);
                        }
                        var ports = _this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
                        DockerodeHelper.getPort(9000, ports)
                            .then(function (port) {
                            _this.setPortNumber(port);
                            ports.push(port);
                            _this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);
                            return resolve(_this.portNumber);
                        })["catch"](function (e) {
                            reject(e);
                        });
                    })];
            });
        });
    };
    PluginInstanceContainerController.prototype.getContainerId = function () {
        return this.containerId;
    };
    PluginInstanceContainerController.prototype.setStatus = function (status) {
        this.callerInstance.gluePluginStore.set("status", status || "down");
        return (this.status = status || "down");
    };
    PluginInstanceContainerController.prototype.setPortNumber = function (portNumber) {
        this.callerInstance.gluePluginStore.set("port_number", portNumber || null);
        return (this.portNumber = portNumber || null);
    };
    PluginInstanceContainerController.prototype.setContainerId = function (containerId) {
    };
    PluginInstanceContainerController.prototype.getConfig = function () { };
    PluginInstanceContainerController.prototype.up = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    PluginInstanceContainerController.prototype.down = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    PluginInstanceContainerController.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, SpawnHelper.run(this.callerInstance.getInstallationPath(), this.installScript())];
                    case 1:
                        _a.sent();
                        return [4, SpawnHelper.run(this.callerInstance.getInstallationPath(), this.buildScript())];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.getRoutes = function () {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, Promise, function () {
            var routes, path, _d, _e, functionsPath, dirents, _f, dirents_1, dirents_1_1, dirent, e_1_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        routes = [];
                        _d = node_path_1.join;
                        _e = [process.cwd()];
                        return [4, this.callerInstance.getInstallationPath()];
                    case 1:
                        path = _d.apply(void 0, _e.concat([_g.sent()]));
                        functionsPath = (0, node_path_1.join)(path, 'functions');
                        return [4, (0, file_exists_1.fileExists)(functionsPath)];
                    case 2:
                        if (!(_g.sent())) {
                            return [2, routes];
                        }
                        return [4, (0, promises_1.readdir)(functionsPath, {
                                withFileTypes: true
                            })];
                    case 3:
                        dirents = _g.sent();
                        _g.label = 4;
                    case 4:
                        _g.trys.push([4, 9, 10, 15]);
                        _f = true, dirents_1 = __asyncValues(dirents);
                        _g.label = 5;
                    case 5: return [4, dirents_1.next()];
                    case 6:
                        if (!(dirents_1_1 = _g.sent(), _a = dirents_1_1.done, !_a)) return [3, 8];
                        _c = dirents_1_1.value;
                        _f = false;
                        try {
                            dirent = _c;
                            if (dirent.isDirectory()) {
                                routes.push({
                                    method: "POST",
                                    path: dirent.name
                                });
                                routes.push({
                                    method: "GET",
                                    path: dirent.name
                                });
                                routes.push({
                                    method: "PUT",
                                    path: dirent.name
                                });
                                routes.push({
                                    method: "DELETE",
                                    path: dirent.name
                                });
                            }
                        }
                        finally {
                            _f = true;
                        }
                        _g.label = 7;
                    case 7: return [3, 5];
                    case 8: return [3, 15];
                    case 9:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 15];
                    case 10:
                        _g.trys.push([10, , 13, 14]);
                        if (!(!_f && !_a && (_b = dirents_1["return"]))) return [3, 12];
                        return [4, _b.call(dirents_1)];
                    case 11:
                        _g.sent();
                        _g.label = 12;
                    case 12: return [3, 14];
                    case 13:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 14: return [7];
                    case 15: return [2, Promise.resolve(routes)];
                }
            });
        });
    };
    return PluginInstanceContainerController;
}());
exports.PluginInstanceContainerController = PluginInstanceContainerController;
//# sourceMappingURL=PluginInstanceContainerController.js.map