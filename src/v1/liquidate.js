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
var prepend_1 = require("./prepend");
var utils_1 = require("./utils");
var contractStrings_1 = require("./contractStrings");
var enc = new TextEncoder();
function prepareLiquidateTransactions(sender, suggestedParams, storageAccount, liquidateeStorageAccount, amount, managerAppId, borrowMarketAppId, borrowMarketAddress, collateralMarketAppId, supportedMarketAppIds, supportedOracleAppIds, collateralBankAssetId, borrowAssetId) {
    if (borrowAssetId === void 0) { borrowAssetId = undefined; }
    console.log("PREPARE LIQUIDATE TRANSACTIONS IN LIQUIDATE.TS\n");
    var prefixTransactions = (0, prepend_1.getInitTxns)(utils_1.Transactions.LIQUIDATE, sender, suggestedParams, managerAppId, supportedMarketAppIds, supportedOracleAppIds, storageAccount);
    var txn0 = algosdk_1["default"].makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [enc.encode(contractStrings_1.managerStrings.liquidate)], undefined, supportedMarketAppIds);
    var txn1 = algosdk_1["default"].makeApplicationNoOpTxn(sender, suggestedParams, borrowMarketAppId, [enc.encode(contractStrings_1.managerStrings.liquidate)], [liquidateeStorageAccount], [managerAppId, collateralMarketAppId]);
    var txn2;
    if (borrowAssetId) {
        txn2 = (0, algosdk_1.makeAssetTransferTxnWithSuggestedParams)(sender, borrowMarketAddress, undefined, undefined, amount, undefined, borrowAssetId, suggestedParams);
    }
    var txn3 = (0, algosdk_1.makeAssetTransferTxnWithSuggestedParams)(sender, borrowMarketAddress, undefined, undefined, amount, undefined, undefined, suggestedParams);
    var temp = __spreadArray([], prefixTransactions, true);
    temp.push(txn0);
    temp.push(txn1);
    temp.push(txn2);
    temp.push(txn3);
    return new utils_1.TransactionGroup(temp);
}
exports.prepareLiquidateTransactions = prepareLiquidateTransactions;
