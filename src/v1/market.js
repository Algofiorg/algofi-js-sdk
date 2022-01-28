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
exports.Market = void 0;
var utils_1 = require("./utils");
var algosdk_1 = require("algosdk");
var v0_1 = require("../v0");
var contractStrings_1 = require("./contractStrings");
var asset_1 = require("./asset");
var Market = /** @class */ (function () {
    function Market(algodClient, historicalIndexerClient, marketAppId) {
        this.algod = algodClient;
        this.historicalIndexer = historicalIndexerClient;
        this.marketAppId = marketAppId;
        //possibly incorrect but I feel like i've tested this before
        this.marketAddress = (0, algosdk_1.getApplicationAddress)(this.marketAppId);
    }
    Market.init = function (algodClient, historicalIndexerClient, marketAppId) {
        return __awaiter(this, void 0, void 0, function () {
            var market;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        market = new Market(algodClient, historicalIndexerClient, marketAppId);
                        // I'm not sure if I was looking at a different file or something but this seems to be the right way to do it
                        // await market.initializeMarketState()
                        return [4 /*yield*/, market.updateGlobalState()];
                    case 1:
                        // I'm not sure if I was looking at a different file or something but this seems to be the right way to do it
                        // await market.initializeMarketState()
                        _a.sent();
                        return [2 /*return*/, market];
                }
            });
        });
    };
    Market.prototype.updateGlobalState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var marketState, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, utils_1.getGlobalState)(this.algod, this.marketAppId)];
                    case 1:
                        marketState = _c.sent();
                        this.marketCounter = marketState[contractStrings_1.marketStrings.manager_market_counter_var];
                        // market asset info
                        this.underlyingAssetId = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.asset_id, null);
                        this.bankAssetId = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.bank_asset_id, null);
                        // market parameters
                        this.oracleAppId = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.oracle_app_id, null);
                        this.oraclePriceField = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.oracle_price_field, null);
                        this.oraclePriceScaleFactor = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.oracle_price_scale_factor, null);
                        this.collateralFactor = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.collateral_factor, null);
                        this.liquidationIncentive = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.liquidation_incentive, null);
                        this.reserveFactor = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.reserve_factor, null);
                        this.baseInterestRate = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.base_interest_rate, null);
                        this.slope1 = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.slope_1, null);
                        this.slope2 = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.slope_2, null);
                        this.utilizationOptimal = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.utilization_optimal, null);
                        this.marketSupplyCapInDollars = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.market_supply_cap_in_dollars, null);
                        this.marketBorrowCapInDollars = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.market_borrow_cap_in_dollars, null);
                        // balance info
                        this.activeCollateral = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.active_collateral, 0);
                        this.bankCirculation = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.bank_circulation, 0);
                        this.bankToUnderlyingExchange = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.bank_to_underlying_exchange, 0);
                        this.underlyingBorrowed = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.underlying_borrowed, 0);
                        this.outstandingBorrowShares = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.outstanding_borrow_shares, 0);
                        this.underlyingCash = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.underlying_cash, 0);
                        this.underlyingReserves = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.underlying_reserves, 0);
                        this.totalBorrowInterestRate = (0, utils_1.get)(marketState, contractStrings_1.marketStrings.total_borrow_interest_rate, 0);
                        _a = this;
                        if (!this.underlyingAssetId) return [3 /*break*/, 3];
                        return [4 /*yield*/, asset_1.Asset.init(this.algod, this.underlyingAssetId, this.bankAssetId, this.oracleAppId, this.oraclePriceField, this.oraclePriceScaleFactor)];
                    case 2:
                        _b = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _b = null;
                        _c.label = 4;
                    case 4:
                        _a.asset = _b;
                        return [2 /*return*/];
                }
            });
        });
    };
    Market.prototype.getMarketAppId = function () {
        return this.marketAppId;
    };
    Market.prototype.getMarketAddress = function () {
        return this.marketAddress;
    };
    Market.prototype.getMarketCounter = function () {
        return this.marketCounter;
    };
    Market.prototype.getAsset = function () {
        return this.asset;
    };
    Market.prototype.getActiveCollateral = function () {
        return this.activeCollateral;
    };
    Market.prototype.getBankCirculation = function () {
        return this.bankCirculation;
    };
    Market.prototype.getBankToUnderlyingExchange = function () {
        return this.bankToUnderlyingExchange;
    };
    //need to figure out the js equivalent of historical_indexer.applications
    Market.prototype.getUnderlyingBorrowed = function (block) {
        if (block === void 0) { block = null; }
        return __awaiter(this, void 0, void 0, function () {
            var data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!block) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.historicalIndexer.lookupApplications(this.marketAppId)["do"]()];
                    case 2:
                        data = _a.sent();
                        data = data["application"]["params"]["global-state"];
                        return [2 /*return*/, (0, utils_1.searchGlobalState)(data, contractStrings_1.marketStrings.underlying_borrowed)];
                    case 3:
                        e_1 = _a.sent();
                        throw new Error("Issue getting data");
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, this.underlyingBorrowed];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Market.prototype.getOutstandingBorrowShares = function () {
        return this.outstandingBorrowShares;
    };
    Market.prototype.getUnderlyingCash = function (block) {
        if (block === void 0) { block = null; }
        return __awaiter(this, void 0, void 0, function () {
            var data, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!block) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.historicalIndexer.lookupApplications(this.marketAppId)["do"]()];
                    case 2:
                        data = _a.sent();
                        data = data["application"]["params"]["global-state"];
                        return [2 /*return*/, (0, utils_1.searchGlobalState)(data, contractStrings_1.marketStrings.underlying_cash)];
                    case 3:
                        e_2 = _a.sent();
                        throw new Error("Issue getting data");
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, this.underlyingCash];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Market.prototype.getUnderlyingReserves = function (block) {
        if (block === void 0) { block = null; }
        return __awaiter(this, void 0, void 0, function () {
            var data, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!block) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.historicalIndexer.lookupApplications(this.marketAppId)["do"]()];
                    case 2:
                        data = _a.sent();
                        data = data["application"]["params"]["global-state"];
                        return [2 /*return*/, (0, utils_1.searchGlobalState)(data, contractStrings_1.marketStrings.underlying_reserves)];
                    case 3:
                        e_3 = _a.sent();
                        throw new Error("Issue getting data");
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, this.underlyingReserves];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Market.prototype.getTotalBorrowInterestRate = function (block) {
        if (block === void 0) { block = null; }
        return __awaiter(this, void 0, void 0, function () {
            var data, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!block) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.historicalIndexer.lookupApplications(this.marketAppId)["do"]()];
                    case 2:
                        data = _a.sent();
                        data = data["application"]["params"]["global-state"];
                        return [2 /*return*/, (0, utils_1.searchGlobalState)(data, contractStrings_1.marketStrings.total_borrow_interest_rate)];
                    case 3:
                        e_4 = _a.sent();
                        throw new Error("Issue getting data");
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, this.totalBorrowInterestRate];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Market.prototype.getCollateralFactor = function () {
        return this.collateralFactor;
    };
    Market.prototype.getLiquidationIncentive = function () {
        return this.liquidationIncentive;
    };
    // User functions
    Market.prototype.getStorageState = function (storageAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var result, userState, asset, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        result = {};
                        return [4 /*yield*/, (0, utils_1.readLocalState)(this.algod, storageAddress, this.marketAppId)];
                    case 1:
                        userState = _e.sent();
                        asset = this.getAsset();
                        result["active_collateral_bank"] = (0, utils_1.get)(userState, contractStrings_1.marketStrings.user_active_collateral, 0);
                        // Need to figure out how to convert this into an int
                        result["active_collateral_underlying"] =
                            (result["active_collateral_bank"] * this.bankToUnderlyingExchange) / v0_1.SCALE_FACTOR;
                        _a = result;
                        _b = "active_collateral_usd";
                        return [4 /*yield*/, asset.toUSD(result["active_collateral_underlying"])];
                    case 2:
                        _a[_b] = _e.sent();
                        result["active_collateral_max_borrow_usd"] =
                            (result["active_collateral_usd"] * this.collateralFactor) / v0_1.PARAMETER_SCALE_FACTOR;
                        result["borrow_shares"] = (0, utils_1.get)(userState, contractStrings_1.marketStrings.user_borrow_shares, 0);
                        //Need to figure out how to convert this into an int
                        result["borrow_underlying"] = Math.floor((this.underlyingBorrowed * result["borrow_shares"]) / this.outstandingBorrowShares);
                        _c = result;
                        _d = "borrow_usd";
                        return [4 /*yield*/, asset.toUSD(result["borrow_underlying"])];
                    case 3:
                        _c[_d] = _e.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return Market;
}());
exports.Market = Market;
