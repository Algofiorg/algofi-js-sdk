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
var utils_1 = require("../utils");
var contractStrings_1 = require("../contractStrings");
var OPT_IN_MIN_BALANCE = 0.65;
var enc = new TextEncoder();
/**
 * Returns a transaction group object representing a staking contract opt in
 * group transaction. The sender and storage account opt in to the staking application
 * and the storage account is rekeyed to the manager account address, rendering it
 * unable to be transacted against by the sender and therefore immutable.
 *
 * @param managerAppId - id of the manager application
 * @param marketAppId - id of the market application
 * @param sender - account address of the sender
 * @param storageAddress - address of the storage account
 * @param suggestedParams - suggested transaction params
 * @returns transaction group object representing a manger opt in group transaction
 */
function prepareStakingContractOptinTransactions(managerAppId, marketAppId, sender, storageAddress, suggestedParams) {
    var txnPayment = (0, algosdk_1.makePaymentTxnWithSuggestedParams)(sender, storageAddress, Math.floor(1000000 * OPT_IN_MIN_BALANCE), undefined, undefined, suggestedParams);
    var txnMarket = (0, algosdk_1.makeApplicationOptInTxn)(sender, suggestedParams, marketAppId);
    var txnUserOptInManager = (0, algosdk_1.makeApplicationOptInTxn)(sender, suggestedParams, managerAppId);
    var appAddress = (0, algosdk_1.getApplicationAddress)(managerAppId);
    var txnStorageOptInManager = (0, algosdk_1.makeApplicationOptInTxn)(storageAddress, suggestedParams, managerAppId, undefined, undefined, undefined, undefined, undefined, undefined, appAddress);
    return new utils_1.TransactionGroup([txnPayment, txnMarket, txnUserOptInManager, txnStorageOptInManager]);
}
exports.prepareStakingContractOptinTransactions = prepareStakingContractOptinTransactions;
/**
 * Returns a transaction group object representing a stake
 * transaction against the algofi protocol. The sender sends assets to the
 * staking account and is credited with a stake.
 *
 * @param sender - account address for the sender
 * @param suggestedParams - suggested transaction params
 * @param storageAccount - storage account address for sender
 * @param amount - amount of asset to supply for minting collateral
 * @param managerAppId - id of the manager application
 * @param marketAppId - id of the asset market application
 * @param marketAddress - account address for the market application
 * @param oracleAppId - id of the aset market application
 * @param assetId - asset id of the asset being supplied, defaults to algo
 * @returns transaction group object representing a mint to collateral group transaction
 */
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
/**
 * Returns a :class:`TransactionGroup` object representing a remove stake
 * group transaction against the algofi protocol. The sender requests to remove stake
 * from a stake acount and if successful, the stake is removed.
 *
 * @param sender - account addres for the sender
 * @param suggestedParams - suggested transaction params
 * @param storageAccount - storage account address for sender
 * @param amount - amount of collateral to remove from the market
 * @param managerAppId - id of the manager application
 * @param marketAppId - id of the market application of the collateral
 * @param oracleAppId - id of the oracle application of the collateral
 * @param assetId - id of the asset to unstake
 * @returns transaction group object representing a unstake group transaction
 */
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
/**
 * Returns a transaction group object representing a claim rewards
 * underlying group transaction against the algofi protocol. The sender requests
 * to claim rewards from the manager acount. If not, the account sends
 * back the user the amount of asset underlying their posted collateral.
 *
 * @param sender - account address for the sender
 * @param suggestedParams - suggested transaction params
 * @param storageAccount - astorage account address for sender
 * @param managerAppId - id of the manager application
 * @param marketAppId - id of the market application of the collateral
 * @param oracleAppId - id of the oracle application
 * @param foreignAssets - list of reward assets in the staking contract
 * @returns transaction group obejct representing a claim rewards transaction
 */
function prepareClaimStakingRewardsTransactions(sender, suggestedParams, storageAccount, managerAppId, marketAppId, oracleAppId, foreignAssets) {
    var supportedMarketAppIds = [marketAppId];
    var supportedOracleAppIds = [oracleAppId];
    var prefixTransactions = (0, prepend_1.getInitTxns)(utils_1.Transactions.CLAIM_REWARDS, sender, suggestedParams, managerAppId, supportedMarketAppIds, supportedOracleAppIds, storageAccount);
    var txn0 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, managerAppId, [enc.encode(contractStrings_1.managerStrings.claim_rewards)], [storageAccount], undefined, foreignAssets);
    return new utils_1.TransactionGroup(__spreadArray(__spreadArray([], prefixTransactions, true), [txn0], false));
}
exports.prepareClaimStakingRewardsTransactions = prepareClaimStakingRewardsTransactions;
