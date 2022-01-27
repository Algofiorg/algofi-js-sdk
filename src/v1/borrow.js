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
exports.prepareBorrowTransactions = void 0;
var algosdk_1 = require("algosdk");
var utils_1 = require("./utils");
var prepend_1 = require("./prepend");
var utils_2 = require("./utils");
var contractStrings_1 = require("./contractStrings");
var enc = new TextEncoder();
function prepareBorrowTransactions(sender, suggestedParams, storageAccount, amount, assetId, managerAppId, marketAppId, supportedMarketAppIds, supportedOracleAppIds) {
    console.log("PREPARE BORROW TRANSACTIONS IN BORROW.TS\n");
    var prefixTransactions = (0, prepend_1.getInitTxns)(utils_2.Transactions.BORROW, sender, suggestedParams, managerAppId, supportedMarketAppIds, supportedOracleAppIds, storageAccount);
    var txn0 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, managerAppId, [
        enc.encode(contractStrings_1.managerStrings.borrow),
        //figure out intToBytes
        (0, utils_2.intToBytes)(amount)
    ]);
    var txn1 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, marketAppId, [enc.encode(contractStrings_1.managerStrings.borrow)], [storageAccount], [managerAppId], [assetId]);
    var temp = __spreadArray([], prefixTransactions, true);
    temp.push(txn0);
    temp.push(txn1);
    var txnGroup = new utils_1.TransactionGroup(temp);
    return txnGroup;
}
exports.prepareBorrowTransactions = prepareBorrowTransactions;
