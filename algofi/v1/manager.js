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
var utils_1 = require("../utils");
var contractStrings_1 = require("../contractStrings");
var rewardsProgram_1 = require("./rewardsProgram");
var Manager = /** @class */ (function () {
    /**
     * This is the constructor for the Manager class.
     *
     * **Note, do not call this to create a new manager**. Instead call
     * the static method init as there are asynchronous set up steps in
     * creating an manager and a constructor can only return an instance of
     * the class and not a promise.
     *
     * #### Example
     * ```typescript
     * //Correct way to instantiate new manager
     * const newManager = await Manager.init(algodClient, managerAppId)
     *
     * //Incorrect way to instantiate new manager
     * const newManager = new Manager(algodClient, managerAppId)
     * ```
     *
     * @param algodClient - algod client
     * @param managerAppId - id of the manager application
     */
    function Manager(algodClient, managerAppId) {
        this.algod = algodClient;
        this.managerAppId = managerAppId;
        this.managerAddress = (0, algosdk_1.getApplicationAddress)(this.managerAppId);
    }
    /**
     * This is the function that should be called when creating a new manager.
     * You pass everything you would to the constructor, but to this function
     * instead and this returns the new and created manager.
     *
     * #### Example
     * ```typescript
     * //Correct way to instantiate new manager
     * const newManager = await Manager.init(algodClient, managerAppId)
     *
     * //Incorrect way to instantiate new manager
     * const newManager = new Manager(algodClient, managerAppId)
     * ```
     *
     * @param algodClient - algod client
     * @param managerAppId - id of the manager application
     * @returns an instance of the manager class fully constructed
     */
    Manager.init = function (algodClient, managerAppId) {
        return __awaiter(this, void 0, void 0, function () {
            var manager;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = new Manager(algodClient, managerAppId);
                        return [4 /*yield*/, manager.updateGlobalState()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, manager];
                }
            });
        });
    };
    /**
     * Method to fetch most recent manager global state
     */
    Manager.prototype.updateGlobalState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var managerState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, utils_1.getGlobalState)(this.algod, this.managerAppId)];
                    case 1:
                        managerState = _a.sent();
                        this.rewardsProgram = new rewardsProgram_1.RewardsProgram(this.algod, managerState);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Return manager app id
     *
     * @returns manager app id
     */
    Manager.prototype.getManagerAppId = function () {
        return this.managerAppId;
    };
    /**
     * Return manager address
     *
     * @returns manager address
     */
    Manager.prototype.getManagerAddress = function () {
        return this.managerAddress;
    };
    /**
     * Returns rewards program
     *
     * @returns rewards program
     */
    Manager.prototype.getRewardsProgram = function () {
        return this.rewardsProgram;
    };
    /**
     * Reeturns the storage addres for the client user
     *
     * @param address - address to get info for
     * @returns storage account address for user
     */
    Manager.prototype.getStorageAddress = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var userManagerState, rawStorageAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, utils_1.readLocalState)(this.algod, address, this.managerAppId)];
                    case 1:
                        userManagerState = _a.sent();
                        rawStorageAddress = (0, utils_1.get)(userManagerState, contractStrings_1.managerStrings.user_storage_address, null);
                        if (!rawStorageAddress) {
                            throw new Error("No storage address found");
                        }
                        return [2 /*return*/, (0, algosdk_1.encodeAddress)(Buffer.from(rawStorageAddress.trim(), "base64"))];
                }
            });
        });
    };
    /**
     * Returns the market local state for the provided address
     *
     * @param address - address to get info for
     * @returns market local state for address
     */
    Manager.prototype.getUserState = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var userState, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.getStorageState;
                        return [4 /*yield*/, this.getStorageAddress(address)];
                    case 1: return [4 /*yield*/, _a.apply(this, [_b.sent()])];
                    case 2:
                        userState = _b.sent();
                        return [2 /*return*/, userState];
                }
            });
        });
    };
    /**
     * Returns the market local state for storage address
     *
     * @param storageAddress - storage address to get info for
     * @returns market local state for storage address
     */
    Manager.prototype.getStorageState = function (storageAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var result, userState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {};
                        return [4 /*yield*/, (0, utils_1.readLocalState)(this.algod, storageAddress, this.managerAppId)];
                    case 1:
                        userState = _a.sent();
                        result["user_global_max_borrow_in_dollars"] = (0, utils_1.get)(userState, contractStrings_1.managerStrings.user_global_max_borrow_in_dollars, 0);
                        result["user_global_borrowed_in_dollars"] = (0, utils_1.get)(userState, contractStrings_1.managerStrings.user_global_borrowed_in_dollars, 0);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Returns projected unrealized rewards for a user address
     *
     * @param address - address to get unrealized rewards for
     * @param markets - list of markets
     * @returns two element list of primary and secondary unrealized rewards
     */
    Manager.prototype.getUserUnrealizedRewards = function (address, markets) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.getStorageUnrealizedRewards;
                        return [4 /*yield*/, this.getStorageAddress(address)];
                    case 1: return [2 /*return*/, _a.apply(this, [_b.sent(), markets])];
                }
            });
        });
    };
    /**
     * Returns projected unrealized rewards for storage address
     *
     * @param storageAddress - storage address to get unrealized rewards for
     * @param markets - list of markets
     * @returns two element list of primary and secondary unrealized rewards
     */
    Manager.prototype.getStorageUnrealizedRewards = function (storageAddress, markets) {
        return __awaiter(this, void 0, void 0, function () {
            var storageUnrealizedRewards;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRewardsProgram().getStorageUnrealizedRewards(storageAddress, this, markets)];
                    case 1:
                        storageUnrealizedRewards = _a.sent();
                        return [2 /*return*/, storageUnrealizedRewards];
                }
            });
        });
    };
    return Manager;
}());
exports.Manager = Manager;
