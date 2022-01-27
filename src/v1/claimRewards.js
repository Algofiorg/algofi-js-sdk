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
exports.prepareClaimRewardsTransactions = void 0;
var algosdk_1 = require("algosdk");
var prepend_1 = require("./prepend");
var utils_1 = require("./utils");
var contractStrings_1 = require("./contractStrings");
var enc = new TextEncoder();
function prepareClaimRewardsTransactions(sender, suggestedParams, storageAccount, managerAppId, supportedMarketAppIds, supportedOracleAppIds, foreignAssets) {
    console.log("PREPARE CLAIM REWARDS TRANSACTIONS IN CLAIMREWARDS.TS\n");
    var prefixTransactions = (0, prepend_1.getInitTxns)(utils_1.Transactions.CLAIM_REWARDS, sender, suggestedParams, managerAppId, supportedMarketAppIds, supportedOracleAppIds, storageAccount);
    var txn0 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, managerAppId, [enc.encode(contractStrings_1.managerStrings.claim_rewards)], [storageAccount], undefined, foreignAssets);
    var temp = __spreadArray([], prefixTransactions, true);
    temp.push(txn0);
    return new utils_1.TransactionGroup(temp);
}
exports.prepareClaimRewardsTransactions = prepareClaimRewardsTransactions;
