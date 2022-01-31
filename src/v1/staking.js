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
exports.prepareClaimStakingRewardsTransactions = exports.prepareUnstakeTransactions = exports.prepareStakeTransactions = exports.prepareStakingContractOptinTransactions = void 0;
var algosdk_1 = require("algosdk");
var prepend_1 = require("./prepend");
var utils_1 = require("./utils");
var contractStrings_1 = require("./contractStrings");
var OPT_IN_MIN_BALANCE = 0.65;
var enc = new TextEncoder();
function prepareStakingContractOptinTransactions(managerAppId, marketAppId, sender, storageAddress, suggestedParams) {
    //need to convert value to int
    var txnPayment = (0, algosdk_1.makePaymentTxnWithSuggestedParams)(sender, storageAddress, 1000000 * OPT_IN_MIN_BALANCE, undefined, undefined, suggestedParams);
    var txnMarket = (0, algosdk_1.makeApplicationOptInTxn)(sender, suggestedParams, marketAppId);
    var txnUserOptInManager = (0, algosdk_1.makeApplicationOptInTxn)(sender, suggestedParams, managerAppId);
    //make sure this is same as in python implementation
    var appAddress = (0, algosdk_1.getApplicationAddress)(managerAppId);
    //Figure out how to get this cleaner
    var txnStorageOptInManager = (0, algosdk_1.makeApplicationOptInTxn)(storageAddress, suggestedParams, managerAppId, undefined, undefined, undefined, undefined, undefined, undefined, appAddress);
    return new utils_1.TransactionGroup([txnPayment, txnMarket, txnUserOptInManager, txnStorageOptInManager]);
}
exports.prepareStakingContractOptinTransactions = prepareStakingContractOptinTransactions;
function prepareStakeTransactions(sender, suggestedParams, storageAccount, amount, managerAppId, marketAppId, marketAddress, oracleAppId, assetId) {
    if (assetId === void 0) { assetId = null; }
    var supportedOracleAppIds = [oracleAppId];
    var supportedMarketAppIds = [marketAppId];
    var prefixTransactions = (0, prepend_1.getInitTxns)(utils_1.Transactions.MINT_TO_COLLATERAL, sender, suggestedParams, managerAppId, supportedMarketAppIds, supportedOracleAppIds, storageAccount);
    var txn0 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, managerAppId, [
        enc.encode(contractStrings_1.managerStrings.mint_to_collateral)
    ]);
    var txn1 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, marketAppId, [enc.encode(contractStrings_1.managerStrings.mint_to_collateral)], [storageAccount], [managerAppId]);
    var txn2;
    if (assetId) {
        txn2 = (0, algosdk_1.makeAssetTransferTxnWithSuggestedParams)(sender, marketAddress, undefined, undefined, amount, undefined, assetId, suggestedParams);
    }
    else {
        txn2 = (0, algosdk_1.makePaymentTxnWithSuggestedParams)(sender, marketAddress, amount, undefined, undefined, suggestedParams);
    }
    return new utils_1.TransactionGroup(__spreadArray(__spreadArray([], prefixTransactions, true), [txn0, txn1, txn2], false));
}
exports.prepareStakeTransactions = prepareStakeTransactions;
function prepareUnstakeTransactions(sender, suggestedParams, storageAccount, amount, managerAppId, marketAppId, oracleAppId, assetId) {
    if (assetId === void 0) { assetId = null; }
    var supportedMarketAppIds = [marketAppId];
    var supportedOracleAppIds = [oracleAppId];
    var prefixTransactions = (0, prepend_1.getInitTxns)(utils_1.Transactions.REMOVE_COLLATERAL_UNDERLYING, sender, suggestedParams, managerAppId, supportedMarketAppIds, supportedOracleAppIds, storageAccount);
    var txn0 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, managerAppId, [
        enc.encode(contractStrings_1.managerStrings.remove_collateral_underlying),
        (0, utils_1.intToBytes)(amount)
    ]);
    var txn1;
    if (assetId) {
        txn1 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, marketAppId, [enc.encode(contractStrings_1.managerStrings.remove_collateral_underlying)], [storageAccount], [managerAppId], [assetId]);
    }
    else {
        txn1 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, marketAppId, [enc.encode(contractStrings_1.managerStrings.remove_collateral_underlying)], [storageAccount], [managerAppId]);
    }
    return new utils_1.TransactionGroup(__spreadArray(__spreadArray([], prefixTransactions, true), [txn0, txn1], false));
}
exports.prepareUnstakeTransactions = prepareUnstakeTransactions;
function prepareClaimStakingRewardsTransactions(sender, suggestedParams, storageAccount, managerAppId, marketAppId, oracleAppId, foreignAssets) {
    var supportedMarketAppIds = [marketAppId];
    var supportedOracleAppIds = [oracleAppId];
    var prefixTransactions = (0, prepend_1.getInitTxns)(utils_1.Transactions.CLAIM_REWARDS, sender, suggestedParams, managerAppId, supportedMarketAppIds, supportedOracleAppIds, storageAccount);
    var txn0 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, managerAppId, [enc.encode(contractStrings_1.managerStrings.claim_rewards)], [storageAccount], undefined, foreignAssets);
    return new utils_1.TransactionGroup(__spreadArray(__spreadArray([], prefixTransactions, true), [txn0], false));
}
exports.prepareClaimStakingRewardsTransactions = prepareClaimStakingRewardsTransactions;
