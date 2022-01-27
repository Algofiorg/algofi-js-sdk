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
        while (_) try {
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
exports.__esModule = true;
exports.Manager = void 0;
var algosdk_1 = require("algosdk");
var utils_1 = require("./utils");
var contractStrings_1 = require("./contractStrings");
var rewardsProgram_1 = require("./rewardsProgram");
var encode_1 = require("./encode");
var Manager = /** @class */ (function () {
    function Manager(algodClient, managerAppId) {
        console.log("CONSTRUCTOR IN MANAGER.TS\n");
        this.algod = algodClient;
        this.managerAppId = managerAppId;
        this.managerAddress = (0, algosdk_1.getApplicationAddress)(this.managerAppId);
        this.updateGlobalState();
        console.log("constructor in manager.ts finished\n");
    }
    Manager.prototype.updateGlobalState = function () {
        console.log("UPDATE GLOBAL STATE IN MANAGER.TS\n");
        var managerState = (0, utils_1.getGlobalState)(this.algod, this.managerAppId);
        this.rewardsProgram = new rewardsProgram_1.RewardsProgram(this.algod, managerState);
        console.log("update global state in manager.ts finished\n");
    };
    Manager.prototype.getManagerAppId = function () {
        console.log("GET MANAGER APP ID IN MANAGER.TS\n");
        console.log("get manager app id in manager.ts finished and returned", this.managerAppId, "\n");
        return this.managerAppId;
    };
    Manager.prototype.getManagerAddress = function () {
        console.log("GET MANAGER ADDRESS IN MANAGER.TS\n");
        console.log("get manager address in manager.ts finished and returned", this.managerAddress, "\n");
        return this.managerAddress;
    };
    Manager.prototype.getRewardsProgram = function () {
        console.log("GET REWARDS PROGRAM IN MANAGER.TS\n");
        console.log("get rewards program in manager.ts finished and returned", this.rewardsProgram, "\n");
        return this.rewardsProgram;
    };
    Manager.prototype.getStorageAddress = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var userManagerState, rawStorageAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("GET STORAGE ADDRESS MANAGER.TS\n");
                        return [4 /*yield*/, (0, utils_1.readLocalState)(this.algod, address, this.managerAppId)];
                    case 1:
                        userManagerState = _a.sent();
                        rawStorageAddress = (0, utils_1.get)(userManagerState, contractStrings_1.managerStrings.user_storage_address, undefined);
                        if (!rawStorageAddress) {
                            throw new Error("No storage address found");
                        }
                        //Need to figure out if this is correct
                        console.log("get storage address in manager.ts finished and returned:", encode_1.Base64Encoder.decode(rawStorageAddress.trim()), "\n");
                        return [2 /*return*/, encode_1.Base64Encoder.decode(rawStorageAddress.trim())];
                }
            });
        });
    };
    Manager.prototype.getUserState = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        console.log("GET USER STATE IN MANAGER.TS\n");
                        //Address XLHCUMHYRPZJ6NXGP4XAMZKHF2HE67Q7MXLP7IGOIZIAEBNUVQ3FEGPCWQ
                        _b = (_a = console).log;
                        _c = ["get user state in manager.ts finished and returned"];
                        _d = this.getStorageState;
                        return [4 /*yield*/, this.getStorageAddress(address)];
                    case 1: return [4 /*yield*/, _d.apply(this, [_f.sent()])];
                    case 2:
                        //Address XLHCUMHYRPZJ6NXGP4XAMZKHF2HE67Q7MXLP7IGOIZIAEBNUVQ3FEGPCWQ
                        _b.apply(_a, _c.concat([_f.sent(), "\n"]));
                        _e = this.getStorageState;
                        return [4 /*yield*/, this.getStorageAddress(address)];
                    case 3: return [4 /*yield*/, _e.apply(this, [_f.sent()])];
                    case 4: return [2 /*return*/, _f.sent()];
                }
            });
        });
    };
    Manager.prototype.getStorageState = function (storageAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var result, userState;
            return __generator(this, function (_a) {
                console.log("GET STORAGE STATE IN MANAGER.TS\n");
                result = {};
                userState = (0, utils_1.readLocalState)(this.algod, storageAddress, this.managerAppId);
                result["user_global_max_borrow_in_dollars"] = (0, utils_1.get)(userState, contractStrings_1.managerStrings.user_global_max_borrow_in_dollars, 0);
                result["user_global_borrowed_in_dollars"] = (0, utils_1.get)(userState, contractStrings_1.managerStrings.user_global_borrowed_in_dollars, 0);
                console.log("get storage state in manager.ts finished and returned", result, "\n");
                return [2 /*return*/, result];
            });
        });
    };
    Manager.prototype.getUserUnrealizedRewards = function (address, markets) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("GET USER UNREALIZED REWARDS IN MANAGER.TS\n");
                        _a = this.getStorageUnrealizedRewards;
                        return [4 /*yield*/, this.getStorageAddress(address)];
                    case 1: return [2 /*return*/, _a.apply(this, [_b.sent(), markets])];
                }
            });
        });
    };
    Manager.prototype.getStorageUnrealizedRewards = function (storageAddress, markets) {
        console.log("GET STORAGE UNREALIZED REWARDS IN MANAGER.TS\n");
        return this.getRewardsProgram().getStorageUnrealizedRewards(storageAddress, this, markets);
    };
    return Manager;
}());
exports.Manager = Manager;
