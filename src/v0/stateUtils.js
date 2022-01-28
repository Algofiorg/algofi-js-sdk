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
exports.getAccountOptInData = exports.updateGlobalUserTotals = exports.updateGlobalTotals = exports.extrapolateUserData = exports.extrapolateMarketData = exports.getGlobalMarketInfo = exports.getUserMarketData = exports.getUserManagerData = exports.getGlobalManagerInfo = exports.getBalanceInfo = exports.getPriceInfo = exports.getStorageAddress = void 0;
var algosdk_1 = require("algosdk");
var config_1 = require("./config");
var encoder_1 = require("./encoder");
var contractStrings_1 = require("./contractStrings");
// CONSTANTS
var MIN_BALANCE_PER_ACCOUNT = BigInt(100000);
var MIN_BALANCE_PER_ASSET = BigInt(100000);
var MIN_BALANCE_PER_APP = BigInt(100000);
var MIN_BALANCE_PER_APP_BYTESLICE = BigInt(25000 + 25000);
var MIN_BALANCE_PER_APP_UINT = BigInt(25000 + 3500);
var MIN_BALANCE_PER_APP_EXTRA_PAGE = BigInt(100000);
var NUMBER_OF_MARKETS_TO_OPT_IN = BigInt(13);
// assume we are launching with 8 assets
var NUMBER_OF_ASSETS = BigInt(8);
// local vars = user_storage_address
var BYTES_FOR_PRIMARY_MANAGER = BigInt(1);
// local vars = user_global_max_borrow_in_dollars, user_rewards_asset_id, user_pending_rewards, user_rewards_latest_time + NUMBER_OF_MARKETS (for rewards)
var UINTS_FOR_PRIMARY_MANAGER = BigInt(15);
// local uints = user_active_collateral, user_borrowed_amount, user_borrow_index_initial
var UINTS_FOR_STORAGE_MARKET = BigInt(3);
/**
 * Function to get the storage address for an algofi user. This address is stored in the users local state.
 * If the user clears their local state, their storage contract is irrecoverable.
 *
 * @param   {accountInformation}  accountInfo   - Address of user
 *
 * @return  {string}              storageAccont - Storage address of user
 */
function getStorageAddress(accountInfo, stakeAsset) {
    if (stakeAsset === void 0) { stakeAsset = "ALGO"; }
    return __awaiter(this, void 0, void 0, function () {
        var storageAccount, localManager, storageAccountBytes;
        return __generator(this, function (_a) {
            storageAccount = null;
            localManager = accountInfo["apps-local-state"].filter(function (x) {
                return x.id === config_1.assetDictionary[stakeAsset]["managerAppId"] && x["key-value"];
            });
            if (localManager && localManager.length > 0) {
                storageAccountBytes = localManager[0]["key-value"].filter(function (x) {
                    return encoder_1.Base64Encoder.decode(x.key) == contractStrings_1.managerStrings.user_storage_address;
                })[0].value.bytes;
                storageAccount = algosdk_1["default"].encodeAddress(Buffer.from(storageAccountBytes, "base64"));
            }
            return [2 /*return*/, storageAccount];
        });
    });
}
exports.getStorageAddress = getStorageAddress;
// TODO - we should drive this off of the market oracle and price field
/**
 * Function to get oracle price info
 *
 * @param   {Algodv2}           algodClient
 *
 * @return  {dict<string,int}   prices
 */
function getPriceInfo(algodClient) {
    return __awaiter(this, void 0, void 0, function () {
        var oracleAppIds, prices, _i, orderedAssets_1, assetName, marketData, _a, _b, y, decodedKey, response, _c, _d, y, decodedKey;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    oracleAppIds = {};
                    prices = {};
                    _i = 0, orderedAssets_1 = config_1.orderedAssets;
                    _e.label = 1;
                case 1:
                    if (!(_i < orderedAssets_1.length)) return [3 /*break*/, 5];
                    assetName = orderedAssets_1[_i];
                    return [4 /*yield*/, algodClient.getApplicationByID(config_1.assetDictionary[assetName]["marketAppId"])["do"]()];
                case 2:
                    marketData = _e.sent();
                    for (_a = 0, _b = marketData.params["global-state"]; _a < _b.length; _a++) {
                        y = _b[_a];
                        decodedKey = encoder_1.Base64Encoder.decode(y.key);
                        if (decodedKey === contractStrings_1.marketStrings["oracle_app_id"]) {
                            oracleAppIds[assetName] = y.value.uint;
                        }
                    }
                    return [4 /*yield*/, algodClient.getApplicationByID(oracleAppIds[assetName])["do"]()];
                case 3:
                    response = _e.sent();
                    for (_c = 0, _d = response.params["global-state"]; _c < _d.length; _c++) {
                        y = _d[_c];
                        decodedKey = encoder_1.Base64Encoder.decode(y.key);
                        if (decodedKey === config_1.assetDictionary[assetName]["oracleFieldName"]) {
                            prices[assetName] = y.value.uint;
                        }
                    }
                    _e.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/, prices];
            }
        });
    });
}
exports.getPriceInfo = getPriceInfo;
/**
 * Get balance info for a given address
 *
 * @param   {Algodv2}           algodClient
 * @param   {string}            address
 *
 * @return  {dict<string,int>}  balanceInfo   - dictionary of asset names to balances
 */
function getBalanceInfo(algodClient, address) {
    return __awaiter(this, void 0, void 0, function () {
        var accountInfo, balanceInfo, _i, orderedAssets_2, assetName, _a, _b, asset, _c, orderedAssets_3, assetName;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, algodClient.accountInformation(address)["do"]()];
                case 1:
                    accountInfo = _d.sent();
                    balanceInfo = {};
                    balanceInfo["ALGO"] = accountInfo["amount"];
                    for (_i = 0, orderedAssets_2 = config_1.orderedAssets; _i < orderedAssets_2.length; _i++) {
                        assetName = orderedAssets_2[_i];
                        if (assetName != "ALGO") {
                            balanceInfo[assetName] = 0;
                        }
                        balanceInfo["b" + assetName] = 0;
                    }
                    for (_a = 0, _b = accountInfo.assets; _a < _b.length; _a++) {
                        asset = _b[_a];
                        for (_c = 0, orderedAssets_3 = config_1.orderedAssets; _c < orderedAssets_3.length; _c++) {
                            assetName = orderedAssets_3[_c];
                            if (assetName != "ALGO" && asset["asset-id"] === config_1.assetDictionary[assetName]["underlyingAssetId"]) {
                                balanceInfo[assetName] = Number(asset["amount"]);
                            }
                            else if (asset["asset-id"] === config_1.assetDictionary[assetName]["bankAssetId"]) {
                                balanceInfo["b" + assetName] = Number(asset["amount"]);
                            }
                        }
                        if (asset["asset-id"] == 468634109) {
                            balanceInfo["STBL-ALGO-LP"] = Number(asset["amount"]);
                        }
                        if (asset["asset-id"] == 467020179) {
                            balanceInfo["STBL-USDC-LP"] = Number(asset["amount"]);
                        }
                        if (asset["asset-id"] == 468695586) {
                            balanceInfo["STBL-YLDY-LP"] = Number(asset["amount"]);
                        }
                    }
                    return [2 /*return*/, balanceInfo];
            }
        });
    });
}
exports.getBalanceInfo = getBalanceInfo;
/**
 * Function to get manager global state
 *
 * @param   {Algodv2}           algodClient
 *
 * @return  {dict<string,int>}  results       - dictionary of global state for this market
 */
function getGlobalManagerInfo(algodClient, stakeAsset) {
    if (stakeAsset === void 0) { stakeAsset = "ALGO"; }
    return __awaiter(this, void 0, void 0, function () {
        var response, results, managerBalances;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, algodClient.getApplicationByID(config_1.assetDictionary[stakeAsset]["managerAppId"])["do"]()];
                case 1:
                    response = _a.sent();
                    results = {};
                    return [4 /*yield*/, getBalanceInfo(algodClient, config_1.managerAddress)];
                case 2:
                    managerBalances = _a.sent();
                    response.params["global-state"].forEach(function (x) {
                        var decodedKey = encoder_1.Base64Encoder.decode(x.key);
                        if (decodedKey.slice(-6) === contractStrings_1.managerStrings.price_string) {
                            results[config_1.marketCounterToAssetName[decodedKey.charCodeAt(7)] + contractStrings_1.managerStrings.price_string] = x.value.uint;
                        }
                        else if (decodedKey.slice(-3) === contractStrings_1.managerStrings.counter_indexed_rewards_coefficient) {
                            results[config_1.marketCounterToAssetName[decodedKey.charCodeAt(7)] + contractStrings_1.managerStrings.counter_indexed_rewards_coefficient] =
                                x.value.uint;
                        }
                        else if (decodedKey === contractStrings_1.managerStrings.rewards_asset_id) {
                            results[decodedKey] = x.value.uint;
                            results["rewards_asset"] = config_1.assetIdToAssetName[x.value.uint];
                            results["rewards_asset_balance"] = managerBalances[results["rewards_asset"]];
                        }
                        else if (decodedKey === contractStrings_1.managerStrings.rewards_secondary_asset_id) {
                            results[decodedKey] = x.value.uint;
                            if (x.value.uint && config_1.assetIdToAssetName[x.value.uint]) {
                                results["rewards_secondary_asset"] = config_1.assetIdToAssetName[x.value.uint];
                                results["rewards_secondary_asset_balance"] = managerBalances[results["rewards_secondary_asset"]];
                            }
                            else if (x.value.uint) {
                                // the ALGOFI protocol will only ever support one unexpected rewards symbol -- BANK
                                results["rewards_secondary_asset"] = "BANK";
                                results["rewards_secondary_asset_balance"] = 0;
                            }
                        }
                        else {
                            results[decodedKey] = x.value.uint;
                        }
                    });
                    return [2 /*return*/, results];
            }
        });
    });
}
exports.getGlobalManagerInfo = getGlobalManagerInfo;
/**
 * Function to get manager global state
 *
 * @param   {AccountInformation}  accountInfo
 *
 * @return  {dict<string,int>}    results       - dictionary of global state for this market
 */
function getUserManagerData(accountInfo, stakeAsset) {
    if (stakeAsset === void 0) { stakeAsset = "ALGO"; }
    return __awaiter(this, void 0, void 0, function () {
        var results, managerData;
        return __generator(this, function (_a) {
            results = {};
            managerData = accountInfo["apps-local-state"].filter(function (x) {
                return x.id === config_1.assetDictionary[stakeAsset]["managerAppId"] && x["key-value"];
            })[0];
            if (managerData) {
                managerData["key-value"].forEach(function (x) {
                    var decodedKey = encoder_1.Base64Encoder.decode(x.key);
                    if (decodedKey.slice(-3) === contractStrings_1.managerStrings.counter_to_user_rewards_coefficient_initial) {
                        results[config_1.marketCounterToAssetName[decodedKey.charCodeAt(7)] +
                            contractStrings_1.managerStrings.counter_to_user_rewards_coefficient_initial] = x.value.uint;
                    }
                    else {
                        results[decodedKey] = x.value.uint;
                    }
                });
            }
            return [2 /*return*/, results];
        });
    });
}
exports.getUserManagerData = getUserManagerData;
/**
 * Function to get a users local state in a given market
 *
 * @param   {AccountInformation}  accountInfo
 * @param   {any}                 globalData
 * @param   {string}              assetName
 *
 * @return  {dict<string,int>}    results       - dictionary of user market local state
 */
function getUserMarketData(accountInfo, globalData, assetName) {
    return __awaiter(this, void 0, void 0, function () {
        var results, marketData;
        return __generator(this, function (_a) {
            results = {};
            marketData = accountInfo["apps-local-state"].filter(function (x) {
                return x.id === config_1.assetDictionary[assetName]["marketAppId"] && x["key-value"];
            })[0];
            if (marketData) {
                marketData["key-value"].forEach(function (y) {
                    var decodedKey = encoder_1.Base64Encoder.decode(y.key);
                    if (decodedKey === contractStrings_1.marketStrings.user_borrow_shares) {
                        results["borrowed"] = Math.floor((y.value.uint * globalData[assetName]["underlying_borrowed_extrapolated"]) /
                            globalData[assetName][contractStrings_1.marketStrings.outstanding_borrow_shares]);
                    }
                    else if (decodedKey === contractStrings_1.marketStrings.user_active_collateral) {
                        results["active_collateral"] = Number(y.value.uint);
                    }
                    else {
                        results[decodedKey] = y.value.uint;
                    }
                });
            }
            return [2 /*return*/, results];
        });
    });
}
exports.getUserMarketData = getUserMarketData;
/**
 * Function to get market global state
 *
 * @param   {Algodv2}           algodClient
 * @param   {number}            marketId
 *
 * @return  {dict<string,int>}  results       - dictionary of global state for this market
 */
function getGlobalMarketInfo(algodClient, marketId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, algodClient.getApplicationByID(marketId)["do"]()];
                case 1:
                    response = _a.sent();
                    results = {};
                    response.params["global-state"].forEach(function (x) {
                        var decodedKey = encoder_1.Base64Encoder.decode(x.key);
                        results[decodedKey] = x.value.uint;
                    });
                    return [2 /*return*/, results];
            }
        });
    });
}
exports.getGlobalMarketInfo = getGlobalMarketInfo;
/**
 * Function to get extrapolate additional data from market global state
 *
 * @param   {dict<string,int>}  globalData        - dictionary of market global state
 * @param   {dict<string,int>}  prices
 * @param   {string}            assetName
 *
 * @return  {dict<string,int>}  extrapolatedData  - dictionary of market extrapolated values
 */
function extrapolateMarketData(globalData, prices, assetName) {
    return __awaiter(this, void 0, void 0, function () {
        var extrapolatedData, currentUnixTime, reserveMultiplier, reserveFreeMultiplier, ALGO_STAKING_APY, borrowUtil;
        return __generator(this, function (_a) {
            extrapolatedData = {};
            currentUnixTime = Date.now();
            currentUnixTime = Math.floor(currentUnixTime / 1000);
            // initialize total_borrow_interest_rate if unset
            if (!globalData[contractStrings_1.marketStrings.total_borrow_interest_rate]) {
                globalData[contractStrings_1.marketStrings.total_borrow_interest_rate] = 0;
            }
            reserveMultiplier = globalData[contractStrings_1.marketStrings.reserve_factor] / config_1.PARAMETER_SCALE_FACTOR;
            reserveFreeMultiplier = (config_1.PARAMETER_SCALE_FACTOR - globalData[contractStrings_1.marketStrings.reserve_factor]) / config_1.PARAMETER_SCALE_FACTOR;
            // borrow_index_extrapolated = last borrow index + current calculated next borrow index
            extrapolatedData["borrow_index_extrapolated"] = Math.floor(globalData[contractStrings_1.marketStrings.borrow_index] *
                (1 +
                    ((globalData[contractStrings_1.marketStrings.total_borrow_interest_rate] / 1e9) *
                        (currentUnixTime - globalData[contractStrings_1.marketStrings.latest_time])) /
                        config_1.SECONDS_PER_YEAR));
            // underlying_borrowed_extrapolated
            extrapolatedData["underlying_borrowed_extrapolated"] =
                extrapolatedData["borrow_index_extrapolated"] > 0
                    ? (globalData[contractStrings_1.marketStrings.underlying_borrowed] * extrapolatedData["borrow_index_extrapolated"]) /
                        globalData[contractStrings_1.marketStrings.implied_borrow_index]
                    : globalData[contractStrings_1.marketStrings.underlying_borrowed];
            // underlying_reserves_extrapolated
            extrapolatedData["underlying_reserves_extrapolated"] =
                extrapolatedData["underlying_borrowed_extrapolated"] > 0
                    ? (extrapolatedData["underlying_borrowed_extrapolated"] - globalData[contractStrings_1.marketStrings.underlying_borrowed]) *
                        reserveMultiplier +
                        globalData[contractStrings_1.marketStrings.underlying_reserves]
                    : globalData[contractStrings_1.marketStrings.underlying_reserves];
            // underlying_supplied
            extrapolatedData["underlying_supplied"] =
                globalData[contractStrings_1.marketStrings.underlying_cash] +
                    globalData[contractStrings_1.marketStrings.underlying_borrowed] -
                    globalData[contractStrings_1.marketStrings.underlying_reserves];
            extrapolatedData["underlying_supplied_extrapolated"] =
                globalData[contractStrings_1.marketStrings.underlying_cash] +
                    extrapolatedData["underlying_borrowed_extrapolated"] -
                    extrapolatedData["underlying_reserves_extrapolated"];
            ALGO_STAKING_APY = Number(0.0125 * 1e9);
            borrowUtil = globalData[contractStrings_1.marketStrings.underlying_borrowed] / extrapolatedData["underlying_supplied_extrapolated"];
            extrapolatedData["total_lend_interest_rate_earned"] =
                globalData[contractStrings_1.marketStrings.underlying_borrowed] > 0
                    ? globalData[contractStrings_1.marketStrings.total_borrow_interest_rate] * borrowUtil * reserveFreeMultiplier
                    : 0;
            if (assetName == "ALGO") {
                extrapolatedData["total_lend_interest_rate_earned"] += ALGO_STAKING_APY * (1 - borrowUtil);
            }
            // bank_to_underlying_exchange_extrapolated
            extrapolatedData["bank_to_underlying_exchange_extrapolated"] =
                globalData[contractStrings_1.marketStrings.bank_circulation] > 0
                    ? (extrapolatedData["underlying_supplied_extrapolated"] * config_1.SCALE_FACTOR) /
                        globalData[contractStrings_1.marketStrings.bank_circulation]
                    : globalData[contractStrings_1.marketStrings.bank_to_underlying_exchange];
            // active_collateral_extrapolated
            extrapolatedData["active_collateral_extrapolated"] = globalData[contractStrings_1.marketStrings.active_collateral]
                ? (globalData[contractStrings_1.marketStrings.active_collateral] * extrapolatedData["bank_to_underlying_exchange_extrapolated"]) /
                    config_1.SCALE_FACTOR
                : 0;
            // calculate USD values
            extrapolatedData["underlying_borrowed_extrapolatedUSD"] =
                extrapolatedData["underlying_borrowed_extrapolated"] *
                    (prices[assetName] / config_1.SCALE_FACTOR) *
                    1000 * // multiply by 1000 b/c we scale orcale by 1000
                    (1 / Math.pow(10, config_1.assetDictionary[assetName]["decimals"]));
            extrapolatedData["underlying_supplied_extrapolatedUSD"] =
                extrapolatedData["underlying_supplied_extrapolated"] *
                    (prices[assetName] / config_1.SCALE_FACTOR) *
                    1000 * // multiply by 1000 b/c we scale orcale by 1000
                    (1 / Math.pow(10, config_1.assetDictionary[assetName]["decimals"]));
            // active_collateral_extrapolatedUSD
            extrapolatedData["active_collateral_extrapolatedUSD"] =
                extrapolatedData["active_collateral_extrapolated"] *
                    (prices[assetName] / config_1.SCALE_FACTOR) *
                    1000 * // multiply by 1000 b/c we scale orcale by 1000
                    (1 / Math.pow(10, config_1.assetDictionary[assetName]["decimals"]));
            return [2 /*return*/, extrapolatedData];
        });
    });
}
exports.extrapolateMarketData = extrapolateMarketData;
/**
 * Function to extrapolate data from user data
 *
 * @param   {dict<string,int>}  userResults
 * @param   {dict<string,int>}  userResults
 * @param   {string}            assetName
 *
 * @return  {dict<string,int>}  extroplatedData
 */
function extrapolateUserData(userResults, globalResults, assetName) {
    return __awaiter(this, void 0, void 0, function () {
        var extrapolatedData, userMarketTVL;
        return __generator(this, function (_a) {
            extrapolatedData = {};
            // borrwed_extrapolated
            extrapolatedData["borrowed_extrapolated"] = userResults[assetName]["borrowed"]
                ? userResults[assetName]["borrowed"]
                : 0;
            // collateral_underlying
            extrapolatedData["collateral"] = userResults[assetName]["active_collateral"]
                ? userResults[assetName]["active_collateral"]
                : 0;
            extrapolatedData["collateral_underlying_extrapolated"] =
                userResults[assetName]["active_collateral"] && globalResults[assetName]["bank_to_underlying_exchange_extrapolated"]
                    ? (userResults[assetName]["active_collateral"] *
                        globalResults[assetName]["bank_to_underlying_exchange_extrapolated"]) /
                        config_1.SCALE_FACTOR
                    : 0;
            // borrowUSD
            extrapolatedData["borrowUSD"] =
                extrapolatedData["borrowed_extrapolated"] *
                    (globalResults[assetName]["price"] / config_1.SCALE_FACTOR) *
                    1000 * // multiply by 1000 b/c we scale orcale by 1000
                    (1 / Math.pow(10, config_1.assetDictionary[assetName]["decimals"]));
            // collateralUSD
            extrapolatedData["collateralUSD"] =
                extrapolatedData["collateral_underlying_extrapolated"] *
                    (globalResults[assetName]["price"] / config_1.SCALE_FACTOR) *
                    1000 * // multiply by 1000 b/c we scale orcale by 1000
                    (1 / Math.pow(10, config_1.assetDictionary[assetName]["decimals"]));
            // maxBorrowUSD
            extrapolatedData["maxBorrowUSD"] =
                extrapolatedData["collateralUSD"] * (globalResults[assetName][contractStrings_1.marketStrings.collateral_factor] / 1000);
            userMarketTVL = extrapolatedData["borrowed_extrapolated"] + extrapolatedData["collateral"];
            if (userResults["manager"][contractStrings_1.managerStrings.user_rewards_program_number] ===
                globalResults["manager"][contractStrings_1.managerStrings.n_rewards_programs]) {
                extrapolatedData["market_unrealized_rewards"] =
                    (userMarketTVL *
                        (globalResults["manager"][assetName + contractStrings_1.managerStrings.counter_indexed_rewards_coefficient] -
                            userResults["manager"][assetName + contractStrings_1.managerStrings.counter_to_user_rewards_coefficient_initial])) /
                        config_1.REWARDS_SCALE_FACTOR;
            }
            else {
                extrapolatedData["market_unrealized_rewards"] =
                    (userMarketTVL * globalResults["manager"][assetName + contractStrings_1.managerStrings.counter_indexed_rewards_coefficient]) /
                        config_1.REWARDS_SCALE_FACTOR;
            }
            return [2 /*return*/, extrapolatedData];
        });
    });
}
exports.extrapolateUserData = extrapolateUserData;
/**
 * Function to extrapolate data from user data
 *
 * @param   {dict<string,int>}  userResults
 *
 * @return  {dict<string,int>}  extroplatedData
 */
function updateGlobalTotals(globalResults) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, orderedAssets_4, assetName, rewards_active, rewards_per_year, _a, orderedAssets_5, assetName;
        return __generator(this, function (_b) {
            globalResults["underlying_supplied_extrapolatedUSD"] = 0;
            globalResults["underlying_borrowed_extrapolatedUSD"] = 0;
            globalResults["active_collateral_extrapolatedUSD"] = 0;
            for (_i = 0, orderedAssets_4 = config_1.orderedAssets; _i < orderedAssets_4.length; _i++) {
                assetName = orderedAssets_4[_i];
                if (assetName != "STBL") {
                    globalResults["underlying_supplied_extrapolatedUSD"] +=
                        globalResults[assetName]["underlying_supplied_extrapolatedUSD"];
                }
                globalResults["active_collateral_extrapolatedUSD"] += globalResults[assetName]["active_collateral_extrapolatedUSD"];
                globalResults["underlying_borrowed_extrapolatedUSD"] +=
                    globalResults[assetName]["underlying_borrowed_extrapolatedUSD"];
            }
            rewards_active = globalResults["manager"][contractStrings_1.managerStrings.rewards_start_time] > 0 &&
                globalResults["manager"][contractStrings_1.managerStrings.rewards_amount] > 0;
            rewards_per_year = globalResults["manager"][contractStrings_1.managerStrings.rewards_per_second] * 60 * 60 * 24 * 365;
            // TODO account for reward free markets
            for (_a = 0, orderedAssets_5 = config_1.orderedAssets; _a < orderedAssets_5.length; _a++) {
                assetName = orderedAssets_5[_a];
                if (rewards_active) {
                    globalResults[assetName]["reward_rate_per_1000USD"] =
                        (rewards_per_year *
                            1000 *
                            (globalResults[assetName]["underlying_borrowed_extrapolatedUSD"] /
                                globalResults["underlying_borrowed_extrapolatedUSD"])) /
                            (globalResults[assetName]["active_collateral_extrapolatedUSD"] +
                                globalResults[assetName]["underlying_borrowed_extrapolatedUSD"]);
                }
                else {
                    globalResults[assetName]["reward_rate_per_1000USD"] = 0;
                }
            }
            return [2 /*return*/];
        });
    });
}
exports.updateGlobalTotals = updateGlobalTotals;
/**
 * Function to extrapolate data from user data
 *
 * @param   {dict<string,int>}  userResults
 * @param   {dict<string,int>}  globalResults
 * @param   {string[]}          activeMarkets
 *
 * @return  {dict<string,int>}  extroplatedData
 */
function updateGlobalUserTotals(userResults, globalResults, activeMarkets) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, activeMarkets_1, assetName, _a, activeMarkets_2, assetName;
        return __generator(this, function (_b) {
            userResults["borrowUSD"] = 0;
            userResults["collateralUSD"] = 0;
            userResults["maxBorrowUSD"] = 0;
            userResults["unrealized_rewards"] = 0;
            userResults["portfolio_reward_rate_per_1000USD"] = 0;
            userResults["portfolio_lend_interest_rate_earned"] = 0;
            userResults["portfolio_borrow_interest_rate"] = 0;
            userResults["rewards_secondary_ratio"] = globalResults["manager"][contractStrings_1.managerStrings.rewards_secondary_ratio];
            if (globalResults["manager"][contractStrings_1.managerStrings.rewards_start_time] > 0 &&
                userResults["manager"][contractStrings_1.managerStrings.user_rewards_program_number] ===
                    globalResults["manager"][contractStrings_1.managerStrings.n_rewards_programs]) {
                userResults["pending_rewards_extrapolated"] = userResults["manager"][contractStrings_1.managerStrings.user_pending_rewards];
                userResults["pending_secondary_rewards_extrapolated"] =
                    userResults["manager"][contractStrings_1.managerStrings.user_secondary_pending_rewards];
            }
            else {
                userResults["pending_rewards_extrapolated"] = 0;
                userResults["pending_secondary_rewards_extrapolated"] = 0;
            }
            for (_i = 0, activeMarkets_1 = activeMarkets; _i < activeMarkets_1.length; _i++) {
                assetName = activeMarkets_1[_i];
                userResults["borrowUSD"] += userResults[assetName]["borrowUSD"];
                userResults["collateralUSD"] += userResults[assetName]["collateralUSD"];
                userResults["maxBorrowUSD"] += userResults[assetName]["maxBorrowUSD"];
                userResults["unrealized_rewards"] += userResults[assetName]["market_unrealized_rewards"];
            }
            for (_a = 0, activeMarkets_2 = activeMarkets; _a < activeMarkets_2.length; _a++) {
                assetName = activeMarkets_2[_a];
                userResults["portfolio_reward_rate_per_1000USD"] +=
                    (globalResults[assetName]["reward_rate_per_1000USD"] *
                        (userResults[assetName]["borrowUSD"] + userResults[assetName]["collateralUSD"])) /
                        (userResults["borrowUSD"] + userResults["collateralUSD"]);
                userResults["portfolio_lend_interest_rate_earned"] +=
                    (globalResults[assetName]["total_lend_interest_rate_earned"] * userResults[assetName]["collateralUSD"]) /
                        userResults["collateralUSD"];
                userResults["portfolio_borrow_interest_rate"] +=
                    (globalResults[assetName][contractStrings_1.marketStrings.total_borrow_interest_rate] * userResults[assetName]["borrowUSD"]) /
                        userResults["borrowUSD"];
            }
            return [2 /*return*/];
        });
    });
}
exports.updateGlobalUserTotals = updateGlobalUserTotals;
/**
 * Function to calculate account opt in info
 *
 * @param   {AccountInformation}  accountInfo
 *
 * @return  {dict<string,int>}    userData    - userData with added USD values
 */
function getAccountOptInData(accountInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var accountOptInData, totalSchema, totalByteSlices, totalUints, totalExtraPages, localApps, createdApps, assets;
        return __generator(this, function (_a) {
            accountOptInData = {};
            totalSchema = accountInfo["apps-total-schema"];
            totalByteSlices = BigInt(0);
            totalUints = BigInt(0);
            if (totalSchema) {
                if (totalSchema["num-byte-slice"]) {
                    totalByteSlices = BigInt(totalSchema["num-byte-slice"]);
                }
                if (totalSchema["num-uint"]) {
                    totalUints = BigInt(totalSchema["num-uint"]);
                }
            }
            totalExtraPages = Number(accountInfo["apps-total-extra-pages"]) > 0 ? BigInt(accountInfo["apps-total-extra-pages"]) : BigInt(0);
            localApps = accountInfo["apps-local-state"] || [];
            createdApps = accountInfo["created-apps"] || [];
            assets = accountInfo["assets"] || [];
            accountOptInData["min_balance"] =
                MIN_BALANCE_PER_ACCOUNT +
                    MIN_BALANCE_PER_ASSET * BigInt(assets.length) +
                    MIN_BALANCE_PER_APP * BigInt(createdApps.length + localApps.length) +
                    MIN_BALANCE_PER_APP_UINT * totalUints +
                    MIN_BALANCE_PER_APP_BYTESLICE * totalByteSlices +
                    MIN_BALANCE_PER_APP_EXTRA_PAGE * totalExtraPages;
            // prep for paul's change, only opt-in storage account to markets
            accountOptInData["min_balance_primary_account"] =
                // BigInt(2) * NUMBER_OF_ASSETS * MIN_BALANCE_PER_ASSET + TODO - uncomment if we need bank assets again
                NUMBER_OF_ASSETS * MIN_BALANCE_PER_ASSET +
                    MIN_BALANCE_PER_APP +
                    MIN_BALANCE_PER_APP_BYTESLICE * BYTES_FOR_PRIMARY_MANAGER +
                    MIN_BALANCE_PER_APP_UINT * UINTS_FOR_PRIMARY_MANAGER;
            // prep for paul's change, only opt-in storage account to markets
            accountOptInData["min_balance_storage_account"] =
                NUMBER_OF_MARKETS_TO_OPT_IN * (MIN_BALANCE_PER_APP + MIN_BALANCE_PER_APP_UINT * UINTS_FOR_STORAGE_MARKET) +
                    MIN_BALANCE_PER_APP +
                    MIN_BALANCE_PER_APP_BYTESLICE * BYTES_FOR_PRIMARY_MANAGER +
                    MIN_BALANCE_PER_APP_UINT * UINTS_FOR_PRIMARY_MANAGER +
                    MIN_BALANCE_PER_ACCOUNT +
                    BigInt(100000);
            // opted in applications
            accountOptInData["apps"] = localApps;
            // opted in assets
            accountOptInData["assets"] = assets;
            return [2 /*return*/, accountOptInData];
        });
    });
}
exports.getAccountOptInData = getAccountOptInData;
