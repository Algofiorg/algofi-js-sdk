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
exports.prepareRemoveCollateralTransactions = void 0;
var algosdk_1 = require("algosdk");
var utils_1 = require("./utils");
var contractStrings_1 = require("./contractStrings");
var prepend_1 = require("./prepend");
var enc = new TextEncoder();
function prepareRemoveCollateralTransactions(sender, suggestedParams, storageAccount, amount, bankAssetId, managerAppId, marketAppId, supportedMarketAppIds, supportedOracleAppIds) {
    var prefixTransactions = (0, prepend_1.getInitTxns)(utils_1.Transactions.REMOVE_COLLATERAL, sender, suggestedParams, managerAppId, supportedMarketAppIds, supportedOracleAppIds, storageAccount);
    var txn0 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, managerAppId, [
        enc.encode(contractStrings_1.managerStrings.remove_collateral),
        (0, utils_1.intToBytes)(amount)
    ]);
    var txn1 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, marketAppId, [enc.encode(contractStrings_1.managerStrings.remove_collateral)], [storageAccount], [managerAppId], [bankAssetId]);
    return new utils_1.TransactionGroup(__spreadArray(__spreadArray([], prefixTransactions, true), [txn0, txn1], false));
}
exports.prepareRemoveCollateralTransactions = prepareRemoveCollateralTransactions;
