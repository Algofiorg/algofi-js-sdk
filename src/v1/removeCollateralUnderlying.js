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
exports.prepareRemoveCollateralUnderlyingTransactions = void 0;
var algosdk_1 = require("algosdk");
var utils_1 = require("./utils");
var contractStrings_1 = require("./contractStrings");
var prepend_1 = require("./prepend");
var enc = new TextEncoder();
function prepareRemoveCollateralUnderlyingTransactions(sender, suggestedParams, storageAccount, amount, bankAssetId, managerAppId, marketAppId, supportedMarketAppIds, supportedOracleAppIds) {
    console.log("PREPARE REMOVE COLLATERAL UNDERLYING TRANSACTIONS IN REMOVECOLLATERALUNDERLYING.TS\n");
    var prefixTransactions = (0, prepend_1.getInitTxns)(utils_1.Transactions.REMOVE_COLLATERAL_UNDERLYING, sender, suggestedParams, managerAppId, supportedMarketAppIds, supportedOracleAppIds, storageAccount);
    //figure out int_to_bytes
    var txn0 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, managerAppId, [
        enc.encode(contractStrings_1.managerStrings.remove_collateral_underlying),
        (0, utils_1.intToBytes)(amount)
    ]);
    var txn1 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, marketAppId, [enc.encode(contractStrings_1.managerStrings.remove_collateral_underlying)], [storageAccount], [managerAppId], [bankAssetId]);
    var temp = __spreadArray([], prefixTransactions, true);
    temp.push(txn0);
    temp.push(txn1);
    return new utils_1.TransactionGroup(temp);
}
exports.prepareRemoveCollateralUnderlyingTransactions = prepareRemoveCollateralUnderlyingTransactions;
