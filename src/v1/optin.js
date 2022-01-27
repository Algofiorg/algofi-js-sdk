"use strict";
exports.__esModule = true;
exports.prepareMarketAppOptinTransactions = exports.prepareManagerAppOptinTransactions = void 0;
var algosdk_1 = require("algosdk");
var utils_1 = require("./utils");
var OPT_IN_MIN_BALANCE = 3.5695;
function prepareManagerAppOptinTransactions(managerAppId, getMaxAtomicOptInMarketAppIds, sender, storageAddress, suggestedParams) {
    console.log("PREPARE MANAGER APP OPTIN TRANSACTIONS IN OPTIN.TS\n");
    var txnPayment = (0, algosdk_1.makePaymentTxnWithSuggestedParams)(sender, storageAddress, OPT_IN_MIN_BALANCE * 1e6, undefined, undefined, suggestedParams);
    var marketOptinTransactions = [];
    for (var _i = 0, getMaxAtomicOptInMarketAppIds_1 = getMaxAtomicOptInMarketAppIds; _i < getMaxAtomicOptInMarketAppIds_1.length; _i++) {
        var marketAppId = getMaxAtomicOptInMarketAppIds_1[_i];
        marketOptinTransactions.push((0, algosdk_1.makeApplicationOptInTxn)(sender, suggestedParams, marketAppId));
    }
    var txnUserOptinManager = (0, algosdk_1.makeApplicationOptInTxn)(sender, suggestedParams, managerAppId);
    var appAddress = (0, algosdk_1.getApplicationAddress)(managerAppId);
    var txnStorageOptinManager = (0, algosdk_1.makeApplicationOptInTxn)(storageAddress, suggestedParams, managerAppId, undefined, undefined, undefined, undefined, undefined, undefined, appAddress);
    var temp = [txnPayment];
    for (var _a = 0, marketOptinTransactions_1 = marketOptinTransactions; _a < marketOptinTransactions_1.length; _a++) {
        var txn = marketOptinTransactions_1[_a];
        temp.push(txn);
    }
    temp.push(txnUserOptinManager);
    temp.push(txnStorageOptinManager);
    return new utils_1.TransactionGroup(temp);
}
exports.prepareManagerAppOptinTransactions = prepareManagerAppOptinTransactions;
//Do I really have to add a random note here?
function prepareMarketAppOptinTransactions(marketAppId, sender, suggestedParams) {
    return new utils_1.TransactionGroup([(0, algosdk_1.makeApplicationOptInTxn)(sender, suggestedParams, marketAppId)]);
}
exports.prepareMarketAppOptinTransactions = prepareMarketAppOptinTransactions;
//not sure if there is a built in asset opt in transaction for js
// export function prepareAssetOptinTransactions(
//   assetId: number,
//   sender: string,
//   suggestedParams: SuggestedParams
// ): TransactionGroup {
//   return new TransactionGroup([makeAssetTransferTxnWithSuggestedParams(sender)])
// }
