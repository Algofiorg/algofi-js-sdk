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
var algosdk_1 = require("algosdk");
var asset_1 = require("./asset");
var utils_1 = require("./utils");
var contractStrings_1 = require("./contractStrings");
var v0_1 = require("../v0");
var utils_2 = require("./utils");
var Market = /** @class */ (function () {
    function Market(algodClient, historicalIndexerClient, marketAppId) {
        console.log("CONSTRUCTOR IN MARKET.TS\n");
        this.algod = algodClient;
        this.marketAppId = marketAppId;
        this.marketAddress = algosdk_1["default"].getApplicationAddress(this.marketAppId);
        this.historicalIndexer = historicalIndexerClient;
        this.asset = this.underlyingAssetId
            ? new asset_1.Asset(this.algod, this.underlyingAssetId, this.bankAssetId, this.oracleAppId, this.oraclePriceField, this.oraclePriceScaleFactor)
            : null;
    }
    Market.init = function (algodClient, historicalIndexerClient, marketAppId) {
        return __awaiter(this, void 0, void 0, function () {
            var market;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("INIT IN MARKET.TS\n");
                        market = new Market(algodClient, historicalIndexerClient, marketAppId);
                        return [4 /*yield*/, market.initializeMarketState()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, market];
                }
            });
        });
    };
    Market.prototype.initializeMarketState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var marketState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("INITIALIZE MARKET STATE IN MARKET.TS\n");
                        return [4 /*yield*/, (0, utils_1.getGlobalState)(this.algod, this.marketAppId)];
                    case 1:
                        marketState = _a.sent();
                        this.marketCounter = marketState[contractStrings_1.marketStrings.manager_market_counter_var];
                        this.underlyingAssetId = marketState[contractStrings_1.marketStrings.asset_id];
                        this.bankAssetId = marketState[contractStrings_1.marketStrings.bank_asset_id];
                        this.oracleAppId = marketState[contractStrings_1.marketStrings.oracle_app_id];
                        this.oraclePriceField = marketState[contractStrings_1.marketStrings.oracle_price_field];
                        this.oraclePriceScaleFactor = marketState[contractStrings_1.marketStrings.oracle_price_scale_factor];
                        this.collateralFactor = marketState[contractStrings_1.marketStrings.collateral_factor];
                        this.liquidationIncentive = marketState[contractStrings_1.marketStrings.liquidation_incentive];
                        this.reserveFactor = marketState[contractStrings_1.marketStrings.reserve_factor];
                        this.baseInterestRate = marketState[contractStrings_1.marketStrings.base_interest_rate];
                        this.slope1 = marketState[contractStrings_1.marketStrings.slope_1];
                        this.slope2 = marketState[contractStrings_1.marketStrings.slope_2];
                        this.utilizationOptimal = marketState[contractStrings_1.marketStrings.utilization_optimal];
                        this.marketSupplyCapInDollars = marketState[contractStrings_1.marketStrings.market_supply_cap_in_dollars];
                        this.marketBorrowCapInDollars = marketState[contractStrings_1.marketStrings.market_borrow_cap_in_dollars];
                        this.activeCollateral = marketState[contractStrings_1.marketStrings.active_collateral];
                        this.bankCirculation = marketState[contractStrings_1.marketStrings.bank_circulation];
                        this.bankToUnderlyingExchange = marketState[contractStrings_1.marketStrings.bank_to_underlying_exchange];
                        this.underlyingBorrowed = marketState[contractStrings_1.marketStrings.underlying_borrowed];
                        this.outstandingBorrowShares = marketState[contractStrings_1.marketStrings.outstanding_borrow_shares];
                        this.underlyingCash = marketState[contractStrings_1.marketStrings.underlying_cash];
                        this.underlyingReserves = marketState[contractStrings_1.marketStrings.underlying_reserves];
                        this.totalBorrowInterestRate = marketState[contractStrings_1.marketStrings.total_borrow_interest_rate];
                        return [2 /*return*/];
                }
            });
        });
    };
    Market.prototype.updateGlobalState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var marketState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("UPDATE GLOBAL STATE IN MARKET.TS\n");
                        return [4 /*yield*/, (0, utils_1.getGlobalState)(this.algod, this.marketAppId)];
                    case 1:
                        marketState = _a.sent();
                        this.marketCounter = marketState[contractStrings_1.marketStrings.manager_market_counter_var];
                        // market asset info
                        this.underlyingAssetId = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.asset_id, undefined);
                        this.bankAssetId = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.bank_asset_id, undefined);
                        // market parameters
                        this.oracleAppId = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.oracle_app_id, undefined);
                        this.oraclePriceField = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.oracle_price_field, undefined);
                        this.oraclePriceScaleFactor = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.oracle_price_scale_factor, undefined);
                        this.collateralFactor = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.collateral_factor, undefined);
                        this.liquidationIncentive = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.liquidation_incentive, undefined);
                        this.reserveFactor = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.reserve_factor, undefined);
                        this.baseInterestRate = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.base_interest_rate, undefined);
                        this.slope1 = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.slope_1, undefined);
                        this.slope2 = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.slope_2, undefined);
                        this.utilizationOptimal = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.utilization_optimal, undefined);
                        this.marketSupplyCapInDollars = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.market_supply_cap_in_dollars, undefined);
                        this.marketBorrowCapInDollars = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.market_borrow_cap_in_dollars, undefined);
                        // balance info
                        this.activeCollateral = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.active_collateral, 0);
                        this.bankCirculation = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.bank_circulation, 0);
                        this.bankToUnderlyingExchange = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.bank_to_underlying_exchange, 0);
                        this.underlyingBorrowed = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.underlying_borrowed, 0);
                        this.outstandingBorrowShares = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.outstanding_borrow_shares, 0);
                        this.underlyingCash = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.underlying_cash, 0);
                        this.underlyingReserves = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.underlying_reserves, 0);
                        this.totalBorrowInterestRate = (0, utils_2.get)(marketState, contractStrings_1.marketStrings.total_borrow_interest_rate, 0);
                        this.asset = this.underlyingAssetId
                            ? new asset_1.Asset(this.algod, this.underlyingAssetId, this.bankAssetId, this.oracleAppId, this.oraclePriceField, this.oraclePriceScaleFactor)
                            : undefined;
                        return [2 /*return*/];
                }
            });
        });
    };
    Market.prototype.getMarketAppId = function () {
        console.log("GET MARKET APP ID IN MARKET.TS\n");
        return this.marketAppId;
    };
    Market.prototype.getMarketAddress = function () {
        console.log("GET MARKET ADDRESS IN MARKET.TS\n");
        return this.marketAddress;
    };
    Market.prototype.getMarketCounter = function () {
        console.log("GET MARKET COUNTER IN MARKET.TS\n");
        return this.marketCounter;
    };
    Market.prototype.getAsset = function () {
        console.log("GET ASSET IN MARKET.TS\n");
        return this.asset;
    };
    Market.prototype.getActiveCollateral = function () {
        console.log("GET ACTIVE COLLATERAL IN MARKET.TS\n");
        return this.activeCollateral;
    };
    Market.prototype.getBankCirculation = function () {
        console.log("GET BANK CIRCULATION IN MARKET.TS\n");
        return this.bankCirculation;
    };
    Market.prototype.getBankToUnderlyingExchange = function () {
        console.log("GET BANK TO UNDERLYING EXCHANGE IN MARKET.TS\n");
        return this.bankToUnderlyingExchange;
    };
    //need to figure out the js equivalent of historical_indexer.applications
    Market.prototype.getUnderlyingBorrowed = function (block) {
        if (block === void 0) { block = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("GET UNDERLYING BORROWED IN MARKET.TS\n");
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
        console.log("GET OUTSTANDING BORROW SHARES IN MARKET.TS\n");
        return this.outstandingBorrowShares;
    };
    Market.prototype.getUnderlyingCash = function (block) {
        if (block === void 0) { block = undefined; }
        console.log("GET UNDERLYING CASH IN MARKET.TS\n");
        if (block) {
            try {
                var data = this.historicalIndexer.lookupApplications(this.marketAppId);
                data = data["application"]["params"]["global-state"];
                return (0, utils_1.searchGlobalState)(data, contractStrings_1.marketStrings.underlying_cash);
            }
            catch (e) {
                throw new Error("Issue getting data");
            }
        }
        else {
            return this.underlyingCash;
        }
    };
    Market.prototype.getUnderlyingReserves = function (block) {
        if (block === void 0) { block = undefined; }
        console.log("GET UNDERLYING RESERVES IN MARKET.TS\n");
        if (block) {
            try {
                var data = this.historicalIndexer.lookupApplications(this.marketAppId);
                data = data["application"]["params"]["global-state"];
                return (0, utils_1.searchGlobalState)(data, contractStrings_1.marketStrings.underlying_reserves);
            }
            catch (e) {
                throw new Error("Issue getting data");
            }
        }
        else {
            return this.underlyingReserves;
        }
    };
    Market.prototype.getTotalBorrowInterestRate = function (block) {
        if (block === void 0) { block = undefined; }
        console.log("GET TOTAL BORROW INTEREST RATE IN MARKET.TS\n");
        if (block) {
            try {
                var data = this.historicalIndexer.lookupApplications(this.marketAppId);
                data = data["application"]["params"]["global-state"];
                return (0, utils_1.searchGlobalState)(data, contractStrings_1.marketStrings.total_borrow_interest_rate);
            }
            catch (e) {
                throw new Error("Issue getting data");
            }
        }
        else {
            return this.totalBorrowInterestRate;
        }
    };
    Market.prototype.getCollateralFactor = function () {
        console.log("GET COLLATERAL FACDTOR IN MARKET.TS\n");
        return this.collateralFactor;
    };
    Market.prototype.getLiquidationIncentive = function () {
        console.log("GET LIQUIDATION INCENTIVE IN MARKET.TS\n");
        return this.liquidationIncentive;
    };
    Market.prototype.getStorageState = function (storageAddress) {
        console.log("GET STORAGE STATE IN MARKET.TS\n");
        var result = {};
        var userState = (0, utils_1.readLocalState)(this.algod, storageAddress, this.marketAppId);
        var asset = this.getAsset();
        result["active_collateral_bank"] = (0, utils_2.get)(userState, contractStrings_1.marketStrings.user_active_collateral, 0);
        result["active_collateral_underlying"] = Number((result["active_collateral_bank"] * this.bankToUnderlyingExchange) / v0_1.SCALE_FACTOR);
        result["active_collateral_usd"] = asset.toUSD(result["active_collateral_underlying"]);
        result["active_collateral_max_borrow_usd"] =
            (result["active_collateral_usd"] * this.collateralFactor) / v0_1.PARAMETER_SCALE_FACTOR;
        result["borrow_shares"] = (0, utils_2.get)(userState, contractStrings_1.marketStrings.user_borrow_shares, 0);
        result["borrow_underlying"] = Number((this.underlyingBorrowed * result["borrow_shares"]) / this.outstandingBorrowShares);
        result["borrow_usd"] = asset.toUSD(result["borrow_underlying"]);
        return result;
    };
    return Market;
}());
exports.Market = Market;
