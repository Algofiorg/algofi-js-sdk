"use strict";
exports.__esModule = true;
exports.prepareClaimStakingRewardsTransactions = exports.prepareUnstakeTransactions = exports.prepareStakeTransactions = exports.prepareStakingContractOptinTransactions = void 0;
var algosdk_1 = require("algosdk");
var prepend_1 = require("./prepend");
var utils_1 = require("./utils");
var contractStrings_1 = require("./contractStrings");
var OPT_IN_MIN_BALANCE = 0.65;
var enc = new TextEncoder();
function prepareStakingContractOptinTransactions(managerAppId, marketAppId, sender, storageAddress, suggestedParams) {
    console.log("PREPARE STAKING CONTRACT OPT IN TRANSACDTIONS IN STAKING.TS\n");
    var txnPayment = algosdk_1["default"].makePaymentTxnWithSuggestedParams(sender, storageAddress, 1000000 * OPT_IN_MIN_BALANCE, undefined, undefined, suggestedParams);
    var txnMarket = algosdk_1["default"].makeApplicationOptInTxn(sender, suggestedParams, marketAppId);
    var txnUserOptInManager = algosdk_1["default"].makeApplicationOptInTxn(sender, suggestedParams, managerAppId);
    var appAddress = algosdk_1["default"].getApplicationAddress(managerAppId);
    //Figure out how to get this cleaner
    var txnStorageOptInManager = algosdk_1["default"].makeApplicationOptInTxn(storageAddress, suggestedParams, managerAppId, undefined, undefined, undefined, undefined, undefined, undefined, appAddress);
    var temp = [];
    temp.push(txnPayment);
    temp.push(txnMarket);
    temp.push(txnUserOptInManager);
    temp.push(txnStorageOptInManager);
    return temp;
}
exports.prepareStakingContractOptinTransactions = prepareStakingContractOptinTransactions;
function prepareStakeTransactions(sender, suggestedParams, storageAccount, amount, managerAppId, marketAppId, marketAddress, oracleAppId, assetId) {
    if (assetId === void 0) { assetId = undefined; }
    var supportedOracleAppIds = [oracleAppId];
    var supportedMarketAppIds = [marketAppId];
    var prefixTransactions = (0, prepend_1.getInitTxns)(utils_1.Transactions.MINT_TO_COLLATERAL, sender, suggestedParams, managerAppId, supportedMarketAppIds, supportedOracleAppIds, storageAccount);
    var enc = new TextEncoder();
    var txn0 = algosdk_1["default"].makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [
        enc.encode(contractStrings_1.managerStrings.mint_to_collateral)
    ]);
    var txn1 = algosdk_1["default"].makeApplicationNoOpTxn(sender, suggestedParams, marketAppId, [enc.encode(contractStrings_1.managerStrings.mint_to_collateral)], [storageAccount], [managerAppId]);
    var txn2;
    if (assetId) {
        txn2 = algosdk_1["default"].makeAssetTransferTxnWithSuggestedParams(sender, marketAddress, undefined, undefined, amount, undefined, assetId, suggestedParams);
    }
    else {
        txn2 = algosdk_1["default"].makePaymentTxnWithSuggestedParams(sender, marketAddress, amount, undefined, undefined, suggestedParams);
    }
    var temp = [];
    temp.push(prefixTransactions);
    temp.push(txn0);
    temp.push(txn1);
    temp.push(txn2);
    return temp;
}
exports.prepareStakeTransactions = prepareStakeTransactions;
function prepareUnstakeTransactions(sender, suggestedParams, storageAccount, amount, managerAppId, marketAppId, oracleAppId, assetId) {
    if (assetId === void 0) { assetId = undefined; }
    console.log("PREPARE UNSTAKE TRANSACTIONS IN STAKING.TS\n");
    var supportedMarketAppIds = [marketAppId];
    var supportedOracleAppIds = [oracleAppId];
    var prefixTransactions = (0, prepend_1.getInitTxns)(utils_1.Transactions.REMOVE_COLLATERAL_UNDERLYING, sender, suggestedParams, managerAppId, supportedMarketAppIds, supportedOracleAppIds, storageAccount);
    var txn0 = algosdk_1["default"].makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [
        enc.encode(contractStrings_1.managerStrings.remove_collateral_underlying),
        (0, utils_1.intToBytes)(amount)
    ]);
    var txn1;
    if (assetId) {
        var txn1_1 = algosdk_1["default"].makeApplicationNoOpTxn(sender, suggestedParams, marketAppId, [enc.encode(contractStrings_1.managerStrings.remove_collateral_underlying)], [storageAccount], [managerAppId], [assetId]);
    }
    else {
        var txn1_2 = algosdk_1["default"].makeApplicationNoOpTxn(sender, suggestedParams, marketAppId, [enc.encode(contractStrings_1.managerStrings.remove_collateral_underlying)], [storageAccount], [managerAppId]);
    }
    var txnGroup = [];
    for (var _i = 0, prefixTransactions_1 = prefixTransactions; _i < prefixTransactions_1.length; _i++) {
        var txn = prefixTransactions_1[_i];
        txnGroup.push(txn);
    }
    txnGroup.push(txn0);
    txnGroup.push(txn1);
    return txnGroup;
}
exports.prepareUnstakeTransactions = prepareUnstakeTransactions;
function prepareClaimStakingRewardsTransactions(sender, suggestedParams, storageAccount, managerAppId, marketAppId, oracleAppId, foreignAssets) {
    console.log("PREPARE CLAIM STAKING REWARDS TRANSACTIONS IN STAKING.TS\n");
    var supportedMarketAppIds = [marketAppId];
    var supportedOracleAppIds = [oracleAppId];
    var prefixTransactions = (0, prepend_1.getInitTxns)(utils_1.Transactions.CLAIM_REWARDS, sender, suggestedParams, managerAppId, supportedMarketAppIds, supportedOracleAppIds, storageAccount);
    var txn0 = algosdk_1["default"].makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [enc.encode(contractStrings_1.managerStrings.claim_rewards)], [storageAccount], undefined, foreignAssets);
}
exports.prepareClaimStakingRewardsTransactions = prepareClaimStakingRewardsTransactions;
