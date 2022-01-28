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
exports.prepareLiquidateTransactions = void 0;
var algosdk_1 = require("algosdk");
var utils_1 = require("./utils");
var contractStrings_1 = require("./contractStrings");
var prepend_1 = require("./prepend");
var enc = new TextEncoder();
function prepareLiquidateTransactions(sender, suggestedParams, storageAccount, liquidateeStorageAccount, amount, managerAppId, borrowMarketAppId, borrowMarketAddress, collateralMarketAppId, supportedMarketAppIds, supportedOracleAppIds, collateralBankAssetId, borrowAssetId) {
    if (borrowAssetId === void 0) { borrowAssetId = null; }
    var prefixTransactions = (0, prepend_1.getInitTxns)(utils_1.Transactions.LIQUIDATE, sender, suggestedParams, managerAppId, supportedMarketAppIds, supportedOracleAppIds, liquidateeStorageAccount);
    var txn0 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, managerAppId, [enc.encode(contractStrings_1.managerStrings.liquidate)], undefined, supportedMarketAppIds);
    var txn1 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, borrowMarketAppId, [enc.encode(contractStrings_1.managerStrings.liquidate)], [liquidateeStorageAccount], [managerAppId, collateralMarketAppId]);
    var txn2;
    if (borrowAssetId) {
        txn2 = (0, algosdk_1.makeAssetTransferTxnWithSuggestedParams)(sender, borrowMarketAddress, undefined, undefined, amount, undefined, borrowAssetId, suggestedParams);
    }
    else {
        txn2 = (0, algosdk_1.makePaymentTxnWithSuggestedParams)(sender, borrowMarketAddress, amount, undefined, undefined, suggestedParams);
    }
    var txn3 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, collateralMarketAppId, [enc.encode(contractStrings_1.managerStrings.liquidate)], [liquidateeStorageAccount, storageAccount], [managerAppId, borrowMarketAppId], [collateralBankAssetId]);
    return new utils_1.TransactionGroup(__spreadArray(__spreadArray([], prefixTransactions, true), [txn0, txn1, txn2, txn3], false));
}
exports.prepareLiquidateTransactions = prepareLiquidateTransactions;
