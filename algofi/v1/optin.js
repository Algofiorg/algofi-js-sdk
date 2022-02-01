"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.prepareAssetOptinTransactions = exports.prepareMarketAppOptinTransactions = exports.prepareManagerAppOptinTransactions = void 0;
var algosdk_1 = require("algosdk");
var utils_1 = require("../utils");
var OPT_IN_MIN_BALANCE = 3.5695;
/**
 * Returns a transactiong roup object representing a manager opt in
 * group transaction. The sender and storage account opt in to the manager application
 * and the storage account is rekeyed to the manager account address, rendering it
 * unable to be transacted against by the sender and therefore immutable.
 *
 * @param managerAppId - id of the manager application
 * @param getMaxAtomicOptInMarketAppIds - max opt in market app ids
 * @param sender - account address for the sender
 * @param storageAddress - address of the storage account
 * @param suggestedParams - suggested transaction params
 * @returns transaction group object representing a managet opt in group transaction
 */
function prepareManagerAppOptinTransactions(managerAppId, getMaxAtomicOptInMarketAppIds, sender, storageAddress, suggestedParams) {
    var txnPayment = (0, algosdk_1.makePaymentTxnWithSuggestedParams)(sender, storageAddress, Math.floor(OPT_IN_MIN_BALANCE * 1e6), undefined, undefined, suggestedParams);
    var marketOptinTransactions = [];
    for (var _i = 0, getMaxAtomicOptInMarketAppIds_1 = getMaxAtomicOptInMarketAppIds; _i < getMaxAtomicOptInMarketAppIds_1.length; _i++) {
        var marketAppId = getMaxAtomicOptInMarketAppIds_1[_i];
        marketOptinTransactions.push((0, algosdk_1.makeApplicationOptInTxn)(sender, suggestedParams, marketAppId));
    }
    var txnUserOptinManager = (0, algosdk_1.makeApplicationOptInTxn)(sender, suggestedParams, managerAppId);
    var appAddress = (0, algosdk_1.getApplicationAddress)(managerAppId);
    var txnStorageOptinManager = (0, algosdk_1.makeApplicationOptInTxn)(storageAddress, suggestedParams, managerAppId, undefined, undefined, undefined, undefined, undefined, undefined, appAddress);
    return new utils_1.TransactionGroup(__spreadArray(__spreadArray([txnPayment], marketOptinTransactions, true), [txnUserOptinManager, txnStorageOptinManager], false));
}
exports.prepareManagerAppOptinTransactions = prepareManagerAppOptinTransactions;
/**
 * Returns a transaction group object representing a market opt in
 * group transaction.
 *
 * @param marketAppId -id of the market application
 * @param sender - account address for the sender
 * @param suggestedParams - suggested transaction params
 * @returns transaction group object representing a market opt in group transaction
 */
function prepareMarketAppOptinTransactions(marketAppId, sender, suggestedParams) {
    return new utils_1.TransactionGroup([
        (0, algosdk_1.makeApplicationOptInTxn)(sender, suggestedParams, marketAppId, [(0, utils_1.intToBytes)((0, utils_1.getRandomInt)(1000000))])
    ]);
}
exports.prepareMarketAppOptinTransactions = prepareMarketAppOptinTransactions;
/**
 * Returns a transaction group object representing an asset opt in
 * group transaction.
 *
 * @param assetId - id of the asset to opt into
 * @param sender - account address for the sender
 * @param suggestedParams - suggested transaction params
 * @returns transaction group object representing an asset opt in group transaction
 */
function prepareAssetOptinTransactions(assetId, sender, suggestedParams) {
    var txn = (0, algosdk_1.makeAssetTransferTxnWithSuggestedParams)(sender, sender, undefined, undefined, 0, undefined, assetId, suggestedParams);
    return new utils_1.TransactionGroup([txn]);
}
exports.prepareAssetOptinTransactions = prepareAssetOptinTransactions;
