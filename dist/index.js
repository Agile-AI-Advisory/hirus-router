"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var merge = require("lodash.merge");
;
;
var Router = /** @class */ (function () {
    function Router(routes, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var defaultProps = {
            port: 3000,
            limit: '5mb',
            onSetup: function () { },
            onStart: function () { },
            onSuccess: function () { },
            onError: function () { }
        };
        var props = merge(defaultProps, options);
        // Register Express application
        this.app = express();
        this.app.use(bodyParser.urlencoded({ extended: false, limit: props.limit }));
        this.app.use(bodyParser.json());
        this.app.use(cors());
        props.onSetup(this.app, express);
        // Register routes
        routes.forEach(function (route) {
            var middleware = [];
            if (route.middleware !== undefined) {
                route.middleware.forEach(function (method) {
                    middleware.push(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                        var err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, method(req, res)];
                                case 1:
                                    _a.sent();
                                    next();
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_1 = _a.sent();
                                    res.json({ error: err_1.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                });
            }
            _this.app[route.method](route.path, middleware, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var response, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 6]);
                            return [4 /*yield*/, route.action(req, res)];
                        case 1:
                            response = _a.sent();
                            if (!!res.headersSent) return [3 /*break*/, 3];
                            return [4 /*yield*/, props.onSuccess(res, response)];
                        case 2:
                            _a.sent();
                            if (!res.headersSent) {
                                res.json({ error: false, data: response });
                            }
                            _a.label = 3;
                        case 3: return [3 /*break*/, 6];
                        case 4:
                            err_2 = _a.sent();
                            return [4 /*yield*/, props.onError(res, err_2)];
                        case 5:
                            _a.sent();
                            if (!res.headersSent) {
                                res.json({ error: err_2.message });
                            }
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
        });
        // Run application
        this.app.listen(props.port, props.onStart);
    }
    return Router;
}());
;
module.exports = Router;
