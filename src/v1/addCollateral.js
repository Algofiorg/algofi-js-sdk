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
exports.prepareAddCollateralTransactions = void 0;
var utils_1 = require("./utils");
var algosdk_1 = require("algosdk");
var contractStrings_1 = require("./contractStrings");
var prepend_1 = require("./prepend");
var enc = new TextEncoder();
function prepareAddCollateralTransactions(sender, suggestedParams, storageAccount, amount, bankAssetId, managerAppId, marketAppId, marketAddress, supportedMarketAppIds, supportedOracleAppIds) {
    console.log("PREPARE ADD COLLATERAL TRANSACTIONS IN ADDCOLLATERAL.TS\n");
    var prefixTransactions = (0, prepend_1.getInitTxns)(utils_1.Transactions.ADD_COLLATERAL, sender, suggestedParams, managerAppId, supportedMarketAppIds, supportedOracleAppIds, storageAccount);
    var txn0 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, managerAppId, [enc.encode(contractStrings_1.managerStrings.add_collateral)]);
    var txn1 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, marketAppId, [enc.encode(contractStrings_1.managerStrings.add_collateral)], [storageAccount], [managerAppId]);
    var txn2 = (0, algosdk_1.makeAssetTransferTxnWithSuggestedParams)(sender, marketAddress, undefined, undefined, amount, undefined, bankAssetId, suggestedParams);
    var temp = __spreadArray([], prefixTransactions, true);
    temp.push(txn0);
    temp.push(txn1);
    temp.push(txn2);
    var txnGroup = new utils_1.TransactionGroup(temp);
    return txnGroup;
}
exports.prepareAddCollateralTransactions = prepareAddCollateralTransactions;
