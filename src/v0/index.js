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
exports.getUserAndProtocolData = exports.getProtocolData = exports.claimRewards = exports.repayBorrow = exports.borrow = exports.removeCollateralUnderlying = exports.removeCollateral = exports.addCollateral = exports.burn = exports.mintToCollateral = exports.mint = exports.optInManager = exports.optInUnderlyingAssets = exports.optInStaker = exports.optInMarkets = exports.Base64Encoder = exports.SCALE_FACTOR = exports.PARAMETER_SCALE_FACTOR = exports.SECONDS_PER_YEAR = exports.orderedSupportedMarketAppIds = exports.orderedMarketAppIds = exports.orderedOracleAppIds = exports.assetDictionary = exports.protocolManagerAppId = exports.orderedAssetsAndPlaceholders = exports.orderedAssets = exports.getAccountOptInData = exports.marketStrings = exports.managerStrings = exports.getStorageAddress = exports.getGlobalManagerInfo = exports.getUserManagerData = exports.waitForConfirmation = exports.getParams = void 0;
var algosdk_1 = require("algosdk");
var submissionUtils_1 = require("./submissionUtils");
exports.getParams = submissionUtils_1.getParams;
exports.waitForConfirmation = submissionUtils_1.waitForConfirmation;
var stateUtils_1 = require("./stateUtils");
exports.getStorageAddress = stateUtils_1.getStorageAddress;
exports.getGlobalManagerInfo = stateUtils_1.getGlobalManagerInfo;
exports.getUserManagerData = stateUtils_1.getUserManagerData;
exports.getAccountOptInData = stateUtils_1.getAccountOptInData;
var contractStrings_1 = require("./contractStrings");
exports.managerStrings = contractStrings_1.managerStrings;
exports.marketStrings = contractStrings_1.marketStrings;
var config_1 = require("./config");
exports.orderedAssets = config_1.orderedAssets;
exports.orderedAssetsAndPlaceholders = config_1.orderedAssetsAndPlaceholders;
exports.protocolManagerAppId = config_1.protocolManagerAppId;
exports.assetDictionary = config_1.assetDictionary;
exports.orderedOracleAppIds = config_1.orderedOracleAppIds;
exports.orderedMarketAppIds = config_1.orderedMarketAppIds;
exports.orderedSupportedMarketAppIds = config_1.orderedSupportedMarketAppIds;
exports.SECONDS_PER_YEAR = config_1.SECONDS_PER_YEAR;
exports.PARAMETER_SCALE_FACTOR = config_1.PARAMETER_SCALE_FACTOR;
exports.SCALE_FACTOR = config_1.SCALE_FACTOR;
var encoder_1 = require("./encoder");
exports.Base64Encoder = encoder_1.Base64Encoder;
var NO_EXTRA_ARGS = null;
/**
 * Function to create transactions to opt address into our market contracts
 *
 * @param   {Algodv2}         algoClient
 * @param   {string}          address
 *
 * @return  {Transaction[]}   transaction group to opt into algofi markets contracts
 */
function optInMarkets(algodClient, address) {
    return __awaiter(this, void 0, void 0, function () {
        var params, accountInfo, accountOptInData, accountOptedInApps, _i, _a, app, txns, _b, orderedMarketAppIds_1, marketAppId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, submissionUtils_1.getParams)(algodClient)
                    // get app opt in data
                ];
                case 1:
                    params = _c.sent();
                    return [4 /*yield*/, algodClient.accountInformation(address)["do"]()];
                case 2:
                    accountInfo = _c.sent();
                    return [4 /*yield*/, (0, stateUtils_1.getAccountOptInData)(accountInfo)];
                case 3:
                    accountOptInData = _c.sent();
                    accountOptedInApps = [];
                    for (_i = 0, _a = accountOptInData["apps"]; _i < _a.length; _i++) {
                        app = _a[_i];
                        accountOptedInApps.push(app["id"]);
                    }
                    txns = [];
                    for (_b = 0, orderedMarketAppIds_1 = config_1.orderedMarketAppIds; _b < orderedMarketAppIds_1.length; _b++) {
                        marketAppId = orderedMarketAppIds_1[_b];
                        if (!(marketAppId in accountOptedInApps)) {
                            txns.push(algosdk_1["default"].makeApplicationOptInTxnFromObject({
                                from: address,
                                appIndex: marketAppId,
                                suggestedParams: params,
                                accounts: undefined,
                                foreignApps: undefined,
                                foreignAssets: undefined,
                                rekeyTo: undefined
                            }));
                        }
                    }
                    algosdk_1["default"].assignGroupID(txns);
                    return [2 /*return*/, txns];
            }
        });
    });
}
exports.optInMarkets = optInMarkets;
/**
 * Function to get opt in transactions for algofi supported assets
 *
 * @param   {Algodv2}         algoClient
 * @param   {string}          stakeAsset
 * @param   {string}          address
 * @param   {string}          storageAddress
 * @param   {number}          storageAddressFundingAmount
 *
 * @return  {Transaction[]}   create transactions to opt in to Staker and rekey storage address to manager contract
 */
function optInStaker(algodClient, stakeAsset, address, storageAddress, storageAddressFundingAmount) {
    return __awaiter(this, void 0, void 0, function () {
        var params, txns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, submissionUtils_1.getParams)(algodClient)];
                case 1:
                    params = _a.sent();
                    txns = [];
                    // fund storage account
                    txns.push(algosdk_1["default"].makePaymentTxnWithSuggestedParamsFromObject({
                        from: address,
                        amount: storageAddressFundingAmount,
                        to: storageAddress,
                        suggestedParams: params,
                        closeRemainderTo: undefined,
                        rekeyTo: undefined
                    }));
                    // opt in storage account
                    txns.push(algosdk_1["default"].makeApplicationOptInTxnFromObject({
                        from: storageAddress,
                        appIndex: config_1.assetDictionary[stakeAsset]["marketAppId"],
                        suggestedParams: params,
                        accounts: undefined,
                        foreignApps: undefined,
                        foreignAssets: undefined,
                        rekeyTo: undefined
                    }));
                    // opt user into manager
                    txns.push(algosdk_1["default"].makeApplicationOptInTxnFromObject({
                        from: address,
                        appIndex: config_1.assetDictionary[stakeAsset]["managerAppId"],
                        suggestedParams: params,
                        foreignApps: [config_1.assetDictionary[stakeAsset]["marketAppId"]],
                        accounts: undefined,
                        foreignAssets: undefined,
                        rekeyTo: undefined
                    }));
                    // opt storage account into manager
                    txns.push(algosdk_1["default"].makeApplicationOptInTxnFromObject({
                        from: storageAddress,
                        appIndex: config_1.assetDictionary[stakeAsset]["managerAppId"],
                        suggestedParams: params,
                        rekeyTo: algosdk_1["default"].getApplicationAddress(config_1.assetDictionary[stakeAsset]["managerAppId"]),
                        foreignApps: undefined,
                        accounts: undefined,
                        foreignAssets: undefined
                    }));
                    algosdk_1["default"].assignGroupID(txns);
                    return [2 /*return*/, txns];
            }
        });
    });
}
exports.optInStaker = optInStaker;
/**
 * Function to get opt in transactions for algofi supported assets
 *
 * @param   {Algodv2}         algoClient
 * @param   {string}          address
 *
 * @return  {Transaction[]}   get opt in transactions for non opted in algofi assets
 */
function optInUnderlyingAssets(algodClient, address) {
    return __awaiter(this, void 0, void 0, function () {
        var accountInfo, accountOptInData, accountOptedInAssets, _i, _a, asset, params, underlying_asset_txns, _b, orderedAssets_1, assetName, underlyingAssetId, combinedAssets;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, algodClient.accountInformation(address)["do"]()];
                case 1:
                    accountInfo = _c.sent();
                    return [4 /*yield*/, (0, stateUtils_1.getAccountOptInData)(accountInfo)];
                case 2:
                    accountOptInData = _c.sent();
                    accountOptedInAssets = [];
                    for (_i = 0, _a = accountOptInData["assets"]; _i < _a.length; _i++) {
                        asset = _a[_i];
                        accountOptedInAssets.push(asset["asset-id"]);
                    }
                    accountOptedInAssets.push(1);
                    return [4 /*yield*/, (0, submissionUtils_1.getParams)(algodClient)];
                case 3:
                    params = _c.sent();
                    underlying_asset_txns = [];
                    for (_b = 0, orderedAssets_1 = config_1.orderedAssets; _b < orderedAssets_1.length; _b++) {
                        assetName = orderedAssets_1[_b];
                        underlyingAssetId = config_1.assetDictionary[assetName]["underlyingAssetId"];
                        // opt into underlying asset if not already opted in
                        if (!accountOptedInAssets.includes(underlyingAssetId) && underlyingAssetId != 1) {
                            underlying_asset_txns.push(algosdk_1["default"].makeAssetTransferTxnWithSuggestedParamsFromObject({
                                // Escrow txn
                                suggestedParams: params,
                                to: address,
                                amount: 0,
                                assetIndex: underlyingAssetId,
                                from: address,
                                rekeyTo: undefined,
                                revocationTarget: undefined
                            }));
                        }
                    }
                    combinedAssets = underlying_asset_txns;
                    algosdk_1["default"].assignGroupID(combinedAssets);
                    return [2 /*return*/, combinedAssets];
            }
        });
    });
}
exports.optInUnderlyingAssets = optInUnderlyingAssets;
/**
 * Function to get opt in transactions for algofi supported assets
 *
 * @param   {Algodv2}         algoClient
 * @param   {string}          address
 * @param   {string}          storageAddress
 * @param   {number}          storageAddressFundingAmount
 *
 * @return  {Transaction[]}   create transactions to opt in to manager and rekey storage address to manager contract
 */
function optInManager(algodClient, address, storageAddress, storageAddressFundingAmount) {
    return __awaiter(this, void 0, void 0, function () {
        var params, enc, txns, _i, _a, marketAppId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, submissionUtils_1.getParams)(algodClient)
                    // initialize encoder
                ];
                case 1:
                    params = _b.sent();
                    enc = new TextEncoder();
                    txns = [];
                    // fund storage account
                    txns.push(algosdk_1["default"].makePaymentTxnWithSuggestedParamsFromObject({
                        from: address,
                        amount: storageAddressFundingAmount,
                        to: storageAddress,
                        suggestedParams: params,
                        closeRemainderTo: undefined,
                        rekeyTo: undefined
                    }));
                    // opt storage account into markets
                    for (_i = 0, _a = config_1.orderedMarketAppIds.slice(0, 13); _i < _a.length; _i++) {
                        marketAppId = _a[_i];
                        txns.push(algosdk_1["default"].makeApplicationOptInTxnFromObject({
                            from: storageAddress,
                            appIndex: marketAppId,
                            suggestedParams: params,
                            accounts: undefined,
                            foreignApps: undefined,
                            foreignAssets: undefined,
                            rekeyTo: undefined
                        }));
                    }
                    // opt user into manager
                    txns.push(algosdk_1["default"].makeApplicationOptInTxnFromObject({
                        from: address,
                        appIndex: config_1.protocolManagerAppId,
                        suggestedParams: params,
                        accounts: undefined,
                        foreignApps: config_1.foreignAppIds,
                        foreignAssets: undefined,
                        rekeyTo: undefined
                    }));
                    // opt storage account into manager
                    txns.push(algosdk_1["default"].makeApplicationOptInTxnFromObject({
                        from: storageAddress,
                        appIndex: config_1.protocolManagerAppId,
                        suggestedParams: params,
                        rekeyTo: algosdk_1["default"].getApplicationAddress(config_1.protocolManagerAppId),
                        foreignApps: undefined,
                        accounts: undefined,
                        foreignAssets: undefined
                    }));
                    algosdk_1["default"].assignGroupID(txns);
                    return [2 /*return*/, txns];
            }
        });
    });
}
exports.optInManager = optInManager;
/**
 * Function to create transaction array for algofi mint operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 * @param   {int}       amount
 * @param   {string}    assetName
 *
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform mint operation
 */
function mint(algodClient, address, storageAddress, amount, assetName) {
    return __awaiter(this, void 0, void 0, function () {
        var marketAppId, marketAddress, bankAssetId, underlyingAssetId, txns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    marketAppId = config_1.assetDictionary[assetName]["marketAppId"];
                    marketAddress = config_1.assetDictionary[assetName]["marketAddress"];
                    bankAssetId = config_1.assetDictionary[assetName]["bankAssetId"];
                    underlyingAssetId = config_1.assetDictionary[assetName]["underlyingAssetId"];
                    return [4 /*yield*/, (0, submissionUtils_1.buildUserTransaction)(algodClient, address, storageAddress, marketAppId, bankAssetId, contractStrings_1.managerStrings.mint, NO_EXTRA_ARGS, marketAddress, underlyingAssetId, amount, assetName)];
                case 1:
                    txns = _a.sent();
                    algosdk_1["default"].assignGroupID(txns);
                    return [2 /*return*/, txns];
            }
        });
    });
}
exports.mint = mint;
/**
 * Function to create transaction array for algofi mint_to_collateral operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 * @param   {int}       amount
 * @param   {string}    assetName
 *
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform mint_to_collateral operation
 */
function mintToCollateral(algodClient, address, storageAddress, amount, assetName) {
    return __awaiter(this, void 0, void 0, function () {
        var marketAppId, marketAddress, bankAssetId, underlyingAssetId, txns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    marketAppId = config_1.assetDictionary[assetName]["marketAppId"];
                    marketAddress = config_1.assetDictionary[assetName]["marketAddress"];
                    bankAssetId = config_1.assetDictionary[assetName]["bankAssetId"];
                    underlyingAssetId = config_1.assetDictionary[assetName]["underlyingAssetId"];
                    return [4 /*yield*/, (0, submissionUtils_1.buildUserTransaction)(algodClient, address, storageAddress, marketAppId, bankAssetId, contractStrings_1.managerStrings.mint_to_collateral, NO_EXTRA_ARGS, marketAddress, underlyingAssetId, amount, assetName)];
                case 1:
                    txns = _a.sent();
                    algosdk_1["default"].assignGroupID(txns);
                    return [2 /*return*/, txns];
            }
        });
    });
}
exports.mintToCollateral = mintToCollateral;
/**
 * Function to create transaction array for algofi burn operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 * @param   {int}       amount
 * @param   {string}    assetName
 *
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform burn operation
 */
function burn(algodClient, address, storageAddress, amount, assetName) {
    return __awaiter(this, void 0, void 0, function () {
        var marketAppId, marketAddress, bankAssetId, underlyingAssetId, txns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    marketAppId = config_1.assetDictionary[assetName]["marketAppId"];
                    marketAddress = config_1.assetDictionary[assetName]["marketAddress"];
                    bankAssetId = config_1.assetDictionary[assetName]["bankAssetId"];
                    underlyingAssetId = config_1.assetDictionary[assetName]["underlyingAssetId"];
                    return [4 /*yield*/, (0, submissionUtils_1.buildUserTransaction)(algodClient, address, storageAddress, marketAppId, underlyingAssetId, contractStrings_1.managerStrings.burn, NO_EXTRA_ARGS, marketAddress, bankAssetId, amount, assetName)];
                case 1:
                    txns = _a.sent();
                    algosdk_1["default"].assignGroupID(txns);
                    return [2 /*return*/, txns];
            }
        });
    });
}
exports.burn = burn;
/**
 * Function to create transaction array for algofi add_collateral operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 * @param   {int}       amount
 * @param   {string}    assetName
 *
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform add_collateral operation
 */
function addCollateral(algodClient, address, storageAddress, amount, assetName) {
    return __awaiter(this, void 0, void 0, function () {
        var marketAppId, marketAddress, bankAssetId, underlyingAssetId, txns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    marketAppId = config_1.assetDictionary[assetName]["marketAppId"];
                    marketAddress = config_1.assetDictionary[assetName]["marketAddress"];
                    bankAssetId = config_1.assetDictionary[assetName]["bankAssetId"];
                    underlyingAssetId = config_1.assetDictionary[assetName]["underlyingAssetId"];
                    return [4 /*yield*/, (0, submissionUtils_1.buildUserTransaction)(algodClient, address, storageAddress, marketAppId, underlyingAssetId, contractStrings_1.managerStrings.add_collateral, NO_EXTRA_ARGS, marketAddress, bankAssetId, amount, assetName)];
                case 1:
                    txns = _a.sent();
                    algosdk_1["default"].assignGroupID(txns);
                    return [2 /*return*/, txns];
            }
        });
    });
}
exports.addCollateral = addCollateral;
/**
 * Function to create transaction array for algofi remove_collateral operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 * @param   {int}       amount
 * @param   {string}    assetName
 *
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform remove_collateral operation
 */
function removeCollateral(algodClient, address, storageAddress, amount, assetName) {
    return __awaiter(this, void 0, void 0, function () {
        var marketAppId, marketAddress, bankAssetId, underlyingAssetId, txns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    marketAppId = config_1.assetDictionary[assetName]["marketAppId"];
                    marketAddress = config_1.assetDictionary[assetName]["marketAddress"];
                    bankAssetId = config_1.assetDictionary[assetName]["bankAssetId"];
                    underlyingAssetId = config_1.assetDictionary[assetName]["underlyingAssetId"];
                    return [4 /*yield*/, (0, submissionUtils_1.buildUserTransaction)(algodClient, address, storageAddress, marketAppId, bankAssetId, contractStrings_1.managerStrings.remove_collateral, algosdk_1["default"].encodeUint64(amount), "", 0, 0, assetName)];
                case 1:
                    txns = _a.sent();
                    algosdk_1["default"].assignGroupID(txns);
                    return [2 /*return*/, txns];
            }
        });
    });
}
exports.removeCollateral = removeCollateral;
/**
 * Function to create transaction array for algofi remove_collateral_underlying operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 * @param   {int}       amount
 * @param   {string}    assetName
 *
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform remove_collateral_underlying operation
 */
function removeCollateralUnderlying(algodClient, address, storageAddress, amount, assetName) {
    return __awaiter(this, void 0, void 0, function () {
        var marketAppId, underlyingAssetId, txns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    marketAppId = config_1.assetDictionary[assetName]["marketAppId"];
                    underlyingAssetId = config_1.assetDictionary[assetName]["underlyingAssetId"];
                    return [4 /*yield*/, (0, submissionUtils_1.buildUserTransaction)(algodClient, address, storageAddress, marketAppId, underlyingAssetId, contractStrings_1.managerStrings.remove_collateral_underlying, algosdk_1["default"].encodeUint64(amount), "", 0, 0, assetName)];
                case 1:
                    txns = _a.sent();
                    algosdk_1["default"].assignGroupID(txns);
                    return [2 /*return*/, txns];
            }
        });
    });
}
exports.removeCollateralUnderlying = removeCollateralUnderlying;
/**
 * Function to create transaction array for algofi borrow operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 * @param   {int}       amount
 * @param   {string}    assetName
 *
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform borrow operation
 */
function borrow(algodClient, address, storageAddress, amount, assetName) {
    return __awaiter(this, void 0, void 0, function () {
        var marketAppId, underlyingAssetId, txns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    marketAppId = config_1.assetDictionary[assetName]["marketAppId"];
                    underlyingAssetId = config_1.assetDictionary[assetName]["underlyingAssetId"];
                    return [4 /*yield*/, (0, submissionUtils_1.buildUserTransaction)(algodClient, address, storageAddress, marketAppId, underlyingAssetId, contractStrings_1.managerStrings.borrow, algosdk_1["default"].encodeUint64(amount), "", 0, 0, assetName)];
                case 1:
                    txns = _a.sent();
                    algosdk_1["default"].assignGroupID(txns);
                    return [2 /*return*/, txns];
            }
        });
    });
}
exports.borrow = borrow;
/**
 * Function to create transaction array for algofi repay_borrow operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 * @param   {int}       amount
 * @param   {string}    assetName
 *
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform repay_borrow operation
 */
function repayBorrow(algodClient, address, storageAddress, amount, assetName) {
    return __awaiter(this, void 0, void 0, function () {
        var marketAppId, marketAddress, underlyingAssetId, txns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    marketAppId = config_1.assetDictionary[assetName]["marketAppId"];
                    marketAddress = config_1.assetDictionary[assetName]["marketAddress"];
                    underlyingAssetId = config_1.assetDictionary[assetName]["underlyingAssetId"];
                    return [4 /*yield*/, (0, submissionUtils_1.buildUserTransaction)(algodClient, address, storageAddress, marketAppId, underlyingAssetId, contractStrings_1.managerStrings.repay_borrow, NO_EXTRA_ARGS, marketAddress, underlyingAssetId, amount, assetName)];
                case 1:
                    txns = _a.sent();
                    algosdk_1["default"].assignGroupID(txns);
                    return [2 /*return*/, txns];
            }
        });
    });
}
exports.repayBorrow = repayBorrow;
/**
 * Function to create transaction array for algofi repay_borrow operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 *
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform repay_borrow operation
 */
function claimRewards(algodClient, asset, address, storageAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var globalManagerData, primaryRewardsAsset, secondaryRewardsAsset, enc, txns, leadingTxs, foreign_assets, params, claimRewardsTxn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, stateUtils_1.getGlobalManagerInfo)(algodClient, asset)];
                case 1:
                    globalManagerData = _a.sent();
                    primaryRewardsAsset = globalManagerData[contractStrings_1.managerStrings.rewards_asset_id];
                    secondaryRewardsAsset = globalManagerData[contractStrings_1.managerStrings.rewards_secondary_asset_id];
                    enc = new TextEncoder();
                    txns = [];
                    return [4 /*yield*/, (0, submissionUtils_1.getLeadingTxs)(algodClient, address, storageAddress, asset)];
                case 2:
                    leadingTxs = _a.sent();
                    leadingTxs.forEach(function (txn) {
                        txns.push(txn);
                    });
                    foreign_assets = [];
                    if (primaryRewardsAsset && primaryRewardsAsset != 1) {
                        foreign_assets.push(primaryRewardsAsset);
                    }
                    if (secondaryRewardsAsset && secondaryRewardsAsset != 1) {
                        foreign_assets.push(secondaryRewardsAsset);
                    }
                    return [4 /*yield*/, (0, submissionUtils_1.getParams)(algodClient)];
                case 3:
                    params = _a.sent();
                    params.fee = 3000;
                    claimRewardsTxn = algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                        from: address,
                        appIndex: config_1.assetDictionary[asset]["managerAppId"],
                        appArgs: [enc.encode(contractStrings_1.managerStrings.claim_rewards)],
                        suggestedParams: params,
                        foreignAssets: foreign_assets,
                        accounts: [storageAddress],
                        note: enc.encode("Manager: Claim rewards"),
                        foreignApps: undefined,
                        rekeyTo: undefined
                    });
                    txns.push(claimRewardsTxn);
                    algosdk_1["default"].assignGroupID(txns);
                    return [2 /*return*/, txns];
            }
        });
    });
}
exports.claimRewards = claimRewards;
/**
 * Funtion to get user data from the protocol as well as totals
 *
 * @param   {Algodv2}   algodClient
 * @param   {string}    address
 *
 * @return  {[dict<string,n>, dict<string,n>]} dictionaries containing the aggregated user protocol data
 */
function getProtocolData(algodClient) {
    return __awaiter(this, void 0, void 0, function () {
        var globalResults, currentUnixTime, prices, globalManagerData, _i, _a, _b, key, value, _c, orderedAssets_2, assetName, globalData, globalExtrapolatedData, _d, _e, _f, key, value;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    globalResults = {};
                    currentUnixTime = Date.now();
                    currentUnixTime = Math.floor(currentUnixTime / 1000);
                    return [4 /*yield*/, (0, stateUtils_1.getPriceInfo)(algodClient)];
                case 1:
                    prices = _g.sent();
                    globalResults["manager"] = {};
                    return [4 /*yield*/, (0, stateUtils_1.getGlobalManagerInfo)(algodClient)];
                case 2:
                    globalManagerData = _g.sent();
                    if (globalManagerData && Object.keys(globalManagerData).length > 0) {
                        for (_i = 0, _a = Object.entries(globalManagerData); _i < _a.length; _i++) {
                            _b = _a[_i], key = _b[0], value = _b[1];
                            globalResults["manager"][key] = value;
                        }
                    }
                    _c = 0, orderedAssets_2 = config_1.orderedAssets;
                    _g.label = 3;
                case 3:
                    if (!(_c < orderedAssets_2.length)) return [3 /*break*/, 7];
                    assetName = orderedAssets_2[_c];
                    return [4 /*yield*/, (0, stateUtils_1.getGlobalMarketInfo)(algodClient, config_1.assetDictionary[assetName]["marketAppId"])];
                case 4:
                    globalData = _g.sent();
                    if (!(globalData && Object.keys(globalData).length > 0)) return [3 /*break*/, 6];
                    globalResults[assetName] = globalData;
                    globalResults[assetName]["price"] = prices[assetName];
                    return [4 /*yield*/, (0, stateUtils_1.extrapolateMarketData)(globalData, prices, assetName)];
                case 5:
                    globalExtrapolatedData = _g.sent();
                    for (_d = 0, _e = Object.entries(globalExtrapolatedData); _d < _e.length; _d++) {
                        _f = _e[_d], key = _f[0], value = _f[1];
                        globalResults[assetName][key] = value;
                    }
                    _g.label = 6;
                case 6:
                    _c++;
                    return [3 /*break*/, 3];
                case 7: 
                // update global totals
                return [4 /*yield*/, (0, stateUtils_1.updateGlobalTotals)(globalResults)];
                case 8:
                    // update global totals
                    _g.sent();
                    return [2 /*return*/, globalResults];
            }
        });
    });
}
exports.getProtocolData = getProtocolData;
/**
 * Funtion to get user data from the protocol as well as totals
 *
 * @param   {Algodv2}   algodClient
 * @param   {string}    address
 *
 * @return  {[dict<string,n>, dict<string,n>]} dictionaries containing the aggregated user protocol data
 */
function getUserAndProtocolData(algodClient, address) {
    return __awaiter(this, void 0, void 0, function () {
        var userResults, globalResults, userActiveMarkets, currentUnixTime, accountInfo, storageAccount, storageAccountInfo, userManagerData, _i, _a, _b, key, value, balances, prices, globalManagerData, _c, _d, _e, key, value, _f, orderedAssets_3, assetName, bAssetName, globalData, globalExtrapolatedData, _g, _h, _j, key, value, userMarketData, _k, _l, _m, key, value, userExtrapolatedData, _o, _p, _q, key, value, optInData;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    userResults = {};
                    globalResults = {};
                    userActiveMarkets = [];
                    currentUnixTime = Date.now();
                    currentUnixTime = Math.floor(currentUnixTime / 1000);
                    return [4 /*yield*/, algodClient.accountInformation(address)["do"]()
                        // get stoarage account info
                    ];
                case 1:
                    accountInfo = _r.sent();
                    return [4 /*yield*/, (0, stateUtils_1.getStorageAddress)(accountInfo)];
                case 2:
                    storageAccount = _r.sent();
                    userResults["storageAccount"] = storageAccount;
                    storageAccountInfo = null;
                    if (!storageAccount) return [3 /*break*/, 4];
                    return [4 /*yield*/, algodClient.accountInformation(storageAccount)["do"]()];
                case 3:
                    storageAccountInfo = _r.sent();
                    _r.label = 4;
                case 4:
                    // get user storage account info
                    userResults["manager"] = {};
                    if (!storageAccount) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, stateUtils_1.getUserManagerData)(storageAccountInfo)];
                case 5:
                    userManagerData = _r.sent();
                    for (_i = 0, _a = Object.entries(userManagerData); _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], value = _b[1];
                        userResults["manager"][key] = value;
                    }
                    _r.label = 6;
                case 6: return [4 /*yield*/, (0, stateUtils_1.getBalanceInfo)(algodClient, address)
                    // get prices
                ];
                case 7:
                    balances = _r.sent();
                    return [4 /*yield*/, (0, stateUtils_1.getPriceInfo)(algodClient)];
                case 8:
                    prices = _r.sent();
                    globalResults["manager"] = {};
                    return [4 /*yield*/, (0, stateUtils_1.getGlobalManagerInfo)(algodClient)];
                case 9:
                    globalManagerData = _r.sent();
                    if (globalManagerData && Object.keys(globalManagerData).length > 0) {
                        for (_c = 0, _d = Object.entries(globalManagerData); _c < _d.length; _c++) {
                            _e = _d[_c], key = _e[0], value = _e[1];
                            globalResults["manager"][key] = value;
                        }
                    }
                    _f = 0, orderedAssets_3 = config_1.orderedAssets;
                    _r.label = 10;
                case 10:
                    if (!(_f < orderedAssets_3.length)) return [3 /*break*/, 17];
                    assetName = orderedAssets_3[_f];
                    bAssetName = "b" + assetName;
                    // initialize user market results
                    userResults[assetName] = {};
                    userResults[bAssetName] = {};
                    userResults["STBL-ALGO-LP"] = balances[""];
                    userResults["STBL-USDC-LP"] = balances[""];
                    userResults["STBL-YLDY-LP"] = balances[""];
                    // set balances
                    userResults[assetName]["balance"] = balances[assetName];
                    userResults[bAssetName]["balance"] = balances[bAssetName];
                    return [4 /*yield*/, (0, stateUtils_1.getGlobalMarketInfo)(algodClient, config_1.assetDictionary[assetName]["marketAppId"])];
                case 11:
                    globalData = _r.sent();
                    if (!(globalData && Object.keys(globalData).length > 0)) return [3 /*break*/, 13];
                    globalResults[assetName] = globalData;
                    globalResults[assetName]["price"] = prices[assetName];
                    return [4 /*yield*/, (0, stateUtils_1.extrapolateMarketData)(globalData, prices, assetName)];
                case 12:
                    globalExtrapolatedData = _r.sent();
                    for (_g = 0, _h = Object.entries(globalExtrapolatedData); _g < _h.length; _g++) {
                        _j = _h[_g], key = _j[0], value = _j[1];
                        globalResults[assetName][key] = value;
                    }
                    _r.label = 13;
                case 13:
                    if (!storageAccount) return [3 /*break*/, 16];
                    return [4 /*yield*/, (0, stateUtils_1.getUserMarketData)(storageAccountInfo, globalResults, assetName)];
                case 14:
                    userMarketData = _r.sent();
                    if (!(userMarketData && Object.keys(userMarketData).length > 0)) return [3 /*break*/, 16];
                    // store active markets to be used for totaling operation
                    userActiveMarkets.push(assetName);
                    for (_k = 0, _l = Object.entries(userMarketData); _k < _l.length; _k++) {
                        _m = _l[_k], key = _m[0], value = _m[1];
                        userResults[assetName][key] = value;
                    }
                    if (!(userResults && Object.keys(userResults).length > 0)) return [3 /*break*/, 16];
                    return [4 /*yield*/, (0, stateUtils_1.extrapolateUserData)(userResults, globalResults, assetName)];
                case 15:
                    userExtrapolatedData = _r.sent();
                    for (_o = 0, _p = Object.entries(userExtrapolatedData); _o < _p.length; _o++) {
                        _q = _p[_o], key = _q[0], value = _q[1];
                        userResults[assetName][key] = value;
                    }
                    _r.label = 16;
                case 16:
                    _f++;
                    return [3 /*break*/, 10];
                case 17: 
                // update global totals
                return [4 /*yield*/, (0, stateUtils_1.updateGlobalTotals)(globalResults)
                    // update user totals
                ];
                case 18:
                    // update global totals
                    _r.sent();
                    if (!storageAccount) return [3 /*break*/, 20];
                    return [4 /*yield*/, (0, stateUtils_1.updateGlobalUserTotals)(userResults, globalResults, userActiveMarkets)];
                case 19:
                    _r.sent();
                    _r.label = 20;
                case 20: return [4 /*yield*/, (0, stateUtils_1.getAccountOptInData)(accountInfo)];
                case 21:
                    optInData = _r.sent();
                    userResults["minBalance"] = Number(optInData["min_balance"]);
                    userResults["minBalancePrimaryAccount"] = Number(optInData["min_balance_primary_account"]);
                    userResults["minBalanceStorageAccount"] = Number(optInData["min_balance_storage_account"]);
                    userResults["optedInApps"] = optInData["apps"];
                    userResults["optedInAssets"] = optInData["assets"];
                    return [2 /*return*/, [userResults, globalResults]];
            }
        });
    });
}
exports.getUserAndProtocolData = getUserAndProtocolData;
