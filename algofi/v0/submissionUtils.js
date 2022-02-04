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
exports.buildUserTransaction = exports.getLeadingTxs = exports.waitForConfirmation = exports.getParams = void 0;
var algosdk_1 = require("algosdk");
var _1 = require(".");
var config_1 = require("./config");
var contractStrings_1 = require("./contractStrings");
var encoder_1 = require("./encoder");
/**
 * Function that returns standard transaction parameters
 *
 * @param {Algodv2} algodClient
 *
 * @return params
 */
function getParams(algodClient) {
    return __awaiter(this, void 0, void 0, function () {
        var params;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, algodClient.getTransactionParams()["do"]()];
                case 1:
                    params = _a.sent();
                    params.fee = 1000;
                    params.flatFee = true;
                    return [2 /*return*/, params];
            }
        });
    });
}
exports.getParams = getParams;
/**
 * Helper function to wait for a transaction to be completed
 *
 * @param   {Algodv2}   algofClient
 * @param   {string}    txid
 *
 * @return  {none}
 */
function waitForConfirmation(algodClient, txId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, lastround, pendingInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, algodClient.status()["do"]()];
                case 1:
                    response = _a.sent();
                    lastround = response["last-round"];
                    _a.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 5];
                    return [4 /*yield*/, algodClient.pendingTransactionInformation(txId)["do"]()];
                case 3:
                    pendingInfo = _a.sent();
                    if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                        //Got the completed Transaction
                        console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
                        return [3 /*break*/, 5];
                    }
                    lastround++;
                    return [4 /*yield*/, algodClient.statusAfterBlock(lastround)["do"]()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.waitForConfirmation = waitForConfirmation;
// TODO rename to getPreambleTxs
/**
 * Function to generate preamble transactions
 *
 * @param   {Algodv2}}  algodclient
 * @param   {string}    senderAccount         - user account address
 * @param   {string}    dataAccount           - user storage account address
 *
 * @return  {Transaction[]}     preamble transaction array
 */
function getLeadingTxs(algodClient, senderAccount, dataAccount, asset) {
    if (asset === void 0) { asset = "ALGO"; }
    return __awaiter(this, void 0, void 0, function () {
        var params, enc, isStaking, applTx00, oracleAppIds, _i, orderedAssets_1, assetName, marketData, _a, _b, y, decodedKey, applTx01, applTx02, applTx03, applTx04, applTx05, applTx06, applTx07, applTx08, applTx09, applTx10, applTx11;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getParams(algodClient)
                    // initialize text encoder
                ];
                case 1:
                    params = _c.sent();
                    enc = new TextEncoder();
                    isStaking = asset.includes("LP") || asset.includes("STAKE");
                    applTx00 = algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                        from: senderAccount,
                        appIndex: isStaking ? _1.assetDictionary[asset]["managerAppId"] : config_1.protocolManagerAppId,
                        foreignApps: isStaking ? [_1.assetDictionary[asset]["marketAppId"]] : config_1.orderedSupportedMarketAppIds,
                        appArgs: [enc.encode(contractStrings_1.managerStrings.fetch_market_variables)],
                        suggestedParams: params,
                        note: enc.encode("Fetch Variables"),
                        accounts: undefined,
                        foreignAssets: undefined,
                        rekeyTo: undefined
                    });
                    oracleAppIds = [];
                    _i = 0, orderedAssets_1 = config_1.orderedAssets;
                    _c.label = 2;
                case 2:
                    if (!(_i < orderedAssets_1.length)) return [3 /*break*/, 5];
                    assetName = orderedAssets_1[_i];
                    return [4 /*yield*/, algodClient.getApplicationByID(_1.assetDictionary[assetName]["marketAppId"])["do"]()];
                case 3:
                    marketData = _c.sent();
                    console.log("marketData=", marketData);
                    for (_a = 0, _b = marketData.params["global-state"]; _a < _b.length; _a++) {
                        y = _b[_a];
                        decodedKey = encoder_1.Base64Encoder.decode(y.key);
                        if (decodedKey === contractStrings_1.marketStrings["oracle_app_id"]) {
                            console.log("found oracle for market app id =", _1.assetDictionary[assetName]["marketAppId"]);
                            oracleAppIds.push(y.value.uint);
                        }
                    }
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    console.log("oracleAppIds=", oracleAppIds);
                    // update prices
                    // TODO why do we need these extra fees?
                    params.fee = 2000;
                    applTx01 = algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                        from: senderAccount,
                        appIndex: isStaking ? _1.assetDictionary[asset]["managerAppId"] : config_1.protocolManagerAppId,
                        foreignApps: isStaking ? [_1.assetDictionary[asset]["oracleAppId"]] : oracleAppIds,
                        appArgs: [enc.encode(contractStrings_1.managerStrings.update_prices)],
                        suggestedParams: params,
                        note: enc.encode("Update Prices"),
                        accounts: undefined,
                        foreignAssets: undefined,
                        rekeyTo: undefined
                    });
                    // update protocol
                    params.fee = 1000;
                    applTx02 = algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                        from: senderAccount,
                        appIndex: isStaking ? _1.assetDictionary[asset]["managerAppId"] : config_1.protocolManagerAppId,
                        foreignApps: isStaking ? [_1.assetDictionary[asset]["marketAppId"]] : config_1.orderedSupportedMarketAppIds,
                        appArgs: [enc.encode(contractStrings_1.managerStrings.update_protocol_data)],
                        accounts: [dataAccount],
                        suggestedParams: params,
                        note: enc.encode("Update Protocol"),
                        foreignAssets: undefined,
                        rekeyTo: undefined
                    });
                    applTx03 = algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                        from: senderAccount,
                        appIndex: isStaking ? _1.assetDictionary[asset]["managerAppId"] : config_1.protocolManagerAppId,
                        foreignApps: undefined,
                        appArgs: [enc.encode("dummy_one")],
                        suggestedParams: params,
                        note: enc.encode("First Dummy Txn"),
                        accounts: undefined,
                        foreignAssets: undefined,
                        rekeyTo: undefined
                    });
                    applTx04 = algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                        from: senderAccount,
                        appIndex: isStaking ? _1.assetDictionary[asset]["managerAppId"] : config_1.protocolManagerAppId,
                        foreignApps: undefined,
                        appArgs: [enc.encode("dummy_two")],
                        suggestedParams: params,
                        note: enc.encode("Second Dummy Txn"),
                        accounts: undefined,
                        foreignAssets: undefined,
                        rekeyTo: undefined
                    });
                    applTx05 = algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                        from: senderAccount,
                        appIndex: isStaking ? _1.assetDictionary[asset]["managerAppId"] : config_1.protocolManagerAppId,
                        foreignApps: undefined,
                        appArgs: [enc.encode("dummy_three")],
                        suggestedParams: params,
                        note: enc.encode("Third Dummy Txn"),
                        accounts: undefined,
                        foreignAssets: undefined,
                        rekeyTo: undefined
                    });
                    applTx06 = algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                        from: senderAccount,
                        appIndex: isStaking ? _1.assetDictionary[asset]["managerAppId"] : config_1.protocolManagerAppId,
                        foreignApps: undefined,
                        appArgs: [enc.encode("dummy_four")],
                        suggestedParams: params,
                        note: enc.encode("Fourth Dummy Txn"),
                        accounts: undefined,
                        foreignAssets: undefined,
                        rekeyTo: undefined
                    });
                    applTx07 = algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                        from: senderAccount,
                        appIndex: isStaking ? _1.assetDictionary[asset]["managerAppId"] : config_1.protocolManagerAppId,
                        foreignApps: undefined,
                        appArgs: [enc.encode("dummy_five")],
                        suggestedParams: params,
                        note: enc.encode("Fifth Dummy Txn"),
                        accounts: undefined,
                        foreignAssets: undefined,
                        rekeyTo: undefined
                    });
                    applTx08 = algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                        from: senderAccount,
                        appIndex: isStaking ? _1.assetDictionary[asset]["managerAppId"] : config_1.protocolManagerAppId,
                        foreignApps: undefined,
                        appArgs: [enc.encode("dummy_six")],
                        suggestedParams: params,
                        note: enc.encode("Sixth Dummy Txn"),
                        accounts: undefined,
                        foreignAssets: undefined,
                        rekeyTo: undefined
                    });
                    applTx09 = algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                        from: senderAccount,
                        appIndex: isStaking ? _1.assetDictionary[asset]["managerAppId"] : config_1.protocolManagerAppId,
                        foreignApps: undefined,
                        appArgs: [enc.encode("dummy_seven")],
                        suggestedParams: params,
                        note: enc.encode("Seventh Dummy Txn"),
                        accounts: undefined,
                        foreignAssets: undefined,
                        rekeyTo: undefined
                    });
                    applTx10 = algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                        from: senderAccount,
                        appIndex: isStaking ? _1.assetDictionary[asset]["managerAppId"] : config_1.protocolManagerAppId,
                        foreignApps: undefined,
                        appArgs: [enc.encode("dummy_eight")],
                        suggestedParams: params,
                        note: enc.encode("Eighth Dummy Txn"),
                        accounts: undefined,
                        foreignAssets: undefined,
                        rekeyTo: undefined
                    });
                    applTx11 = algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                        from: senderAccount,
                        appIndex: isStaking ? _1.assetDictionary[asset]["managerAppId"] : config_1.protocolManagerAppId,
                        foreignApps: undefined,
                        appArgs: [enc.encode("dummy_nine")],
                        suggestedParams: params,
                        note: enc.encode("Nineth Dummy Txn"),
                        accounts: undefined,
                        foreignAssets: undefined,
                        rekeyTo: undefined
                    });
                    // send transaction array
                    return [2 /*return*/, [
                            applTx00,
                            applTx01,
                            applTx02,
                            applTx03,
                            applTx04,
                            applTx05,
                            applTx06,
                            applTx07,
                            applTx08,
                            applTx09,
                            applTx10,
                            applTx11
                        ]];
            }
        });
    });
}
exports.getLeadingTxs = getLeadingTxs;
/**
 * Function to get generic function transactions to the manager and market less any needed payment transactions
 *
 * @param   {Algodv2}   algodClient
 * @param   {string}    senderAccount
 * @param   {string}    dataAccount
 * @param   {int}       marketAppId
 * @param   {int}       foreignAssetId
 * @param   {string}    functionString        - contract psuedo-function string
 * @param   {[]}        extraCallArgs         - additional application arguments for the manager transaction
 *
 * @return  {Transaction[]}                   - array of primary pseudo-function stransactions
 */
function getStackGroup(algodClient, senderAccount, dataAccount, marketAppId, foreignAssetId, functionString, extraCallArgs, asset) {
    if (extraCallArgs === void 0) { extraCallArgs = null; }
    if (asset === void 0) { asset = "ALGO"; }
    return __awaiter(this, void 0, void 0, function () {
        var params, enc, managerAppArgs, applTx0, applTx1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getParams(algodClient)
                    // initialize encoder
                ];
                case 1:
                    params = _a.sent();
                    enc = new TextEncoder();
                    managerAppArgs = [];
                    managerAppArgs.push(enc.encode(functionString));
                    if (extraCallArgs) {
                        managerAppArgs.push(extraCallArgs);
                    }
                    applTx0 = algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                        from: senderAccount,
                        appIndex: _1.assetDictionary[asset]["managerAppId"],
                        appArgs: managerAppArgs,
                        suggestedParams: params,
                        note: enc.encode("Manager: " + functionString),
                        accounts: undefined,
                        foreignApps: undefined,
                        foreignAssets: undefined,
                        rekeyTo: undefined
                    });
                    applTx1 = algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                        from: senderAccount,
                        appIndex: marketAppId,
                        foreignApps: [_1.assetDictionary[asset]["managerAppId"]],
                        appArgs: [enc.encode(functionString)],
                        foreignAssets: [foreignAssetId],
                        accounts: [dataAccount],
                        suggestedParams: params,
                        note: enc.encode("Market: " + functionString),
                        rekeyTo: undefined
                    });
                    return [2 /*return*/, [applTx0, applTx1]];
            }
        });
    });
}
/**
 * Function to get payment transaction to indicated market
 *
 * @param   {Algodv2}   algodClient
 * @param   {string}    senderAccount
 * @param   {string}    marketAddres
 * @param   {int}       assetId
 * @param   {int}       amount
 *
 * @return  {Payment Transaction}
 */
function getPaymentTxn(algodClient, senderAccount, marketAddress, assetId, amount, asset) {
    if (asset === void 0) { asset = "ALGO"; }
    return __awaiter(this, void 0, void 0, function () {
        var params, algoPayment, asaPayment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getParams(algodClient)];
                case 1:
                    params = _a.sent();
                    if (assetId == 1) {
                        algoPayment = algosdk_1["default"].makePaymentTxnWithSuggestedParamsFromObject({
                            from: senderAccount,
                            to: marketAddress,
                            amount: amount,
                            suggestedParams: params,
                            rekeyTo: undefined
                        });
                        return [2 /*return*/, algoPayment];
                    }
                    else {
                        asaPayment = algosdk_1["default"].makeAssetTransferTxnWithSuggestedParamsFromObject({
                            from: senderAccount,
                            to: marketAddress,
                            amount: amount,
                            assetIndex: assetId,
                            suggestedParams: params,
                            rekeyTo: undefined,
                            revocationTarget: undefined
                        });
                        return [2 /*return*/, asaPayment];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Function to generate core transactions for user interactions less payment transactions
 *
 * @param   {Algodv2}     algodClient
 * @param   {string}      senderAccount
 * @param   {string}      dataAccount
 * @param   {int}         marketAppId
 * @param   {int}         foreignAssetId
 * @param   {string}      functionString
 * @param   {[]}          extralCallArgs
 * @param   {string}      marketAddress
 * @param   {int}         paymentAssetId
 * @param   {int}         paymentAmount
 *
 * @return {Transaction[]}
 */
function buildUserTransaction(algodClient, senderAccount, dataAccount, marketAppId, foreignAssetId, functionString, extraCallArgs, marketAddress, paymentAssetId, paymentAmout, asset) {
    if (extraCallArgs === void 0) { extraCallArgs = null; }
    if (marketAddress === void 0) { marketAddress = ""; }
    if (paymentAssetId === void 0) { paymentAssetId = 0; }
    if (paymentAmout === void 0) { paymentAmout = 0; }
    if (asset === void 0) { asset = "ALGO"; }
    return __awaiter(this, void 0, void 0, function () {
        var txns, leadingTxs, followingTxs, paymentTxn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    txns = [];
                    return [4 /*yield*/, getLeadingTxs(algodClient, senderAccount, dataAccount, asset)];
                case 1:
                    leadingTxs = _a.sent();
                    leadingTxs.forEach(function (txn) {
                        txns.push(txn);
                    });
                    return [4 /*yield*/, getStackGroup(algodClient, senderAccount, dataAccount, marketAppId, foreignAssetId, functionString, extraCallArgs, asset)];
                case 2:
                    followingTxs = _a.sent();
                    followingTxs.forEach(function (txn) {
                        txns.push(txn);
                    });
                    if (!(paymentAssetId != 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, getPaymentTxn(algodClient, senderAccount, marketAddress, paymentAssetId, paymentAmout, asset)];
                case 3:
                    paymentTxn = _a.sent();
                    txns.push(paymentTxn);
                    _a.label = 4;
                case 4: return [2 /*return*/, txns];
            }
        });
    });
}
exports.buildUserTransaction = buildUserTransaction;
