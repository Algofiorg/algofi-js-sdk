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
var utils_1 = require("../utils");
var contractStrings_1 = require("../contractStrings");
var prepend_1 = require("./prepend");
var enc = new TextEncoder();
/**
 * Returns a transaction group object representing a remove collateral
 * underlying group transaction against the algofi protocol. Functionally equivalent to
 * remove collateral + burn. The sender requests to remove collateral from a market acount
 * after which the application determines if the removal puts the sender's health ratio
 * below 1. If not, the account sends back the user the amount of asset underlying their posted collateral.
 *
 * @param sender - account address for the sender
 * @param suggestedParams - suggested transaction params
 * @param storageAccount - storage account address for sender
 * @param amount - amount of collateral to remove from the market
 * @param assetId - asset id of the asset underlying the collateral
 * @param managerAppId - id of the manager application
 * @param marketAppId - id of the market application of the collateral
 * @param supportedMarketAppIds - list of supported market application ids
 * @param supportedOracleAppIds - list of supported oracle application ids
 * @returns transaction group object representing a remove collateral underlying group transaction
 */
function prepareRemoveCollateralUnderlyingTransactions(sender, suggestedParams, storageAccount, amount, assetId, managerAppId, marketAppId, supportedMarketAppIds, supportedOracleAppIds) {
    var prefixTransactions = (0, prepend_1.getInitTxns)(utils_1.Transactions.REMOVE_COLLATERAL_UNDERLYING, sender, suggestedParams, managerAppId, supportedMarketAppIds, supportedOracleAppIds, storageAccount);
    var txn0 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, managerAppId, [
        enc.encode(contractStrings_1.managerStrings.remove_collateral_underlying),
        (0, utils_1.intToBytes)(amount)
    ]);
    var txn1 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, marketAppId, [enc.encode(contractStrings_1.managerStrings.remove_collateral_underlying)], [storageAccount], [managerAppId], [assetId]);
    return new utils_1.TransactionGroup(__spreadArray(__spreadArray([], prefixTransactions, true), [txn0, txn1], false));
}
exports.prepareRemoveCollateralUnderlyingTransactions = prepareRemoveCollateralUnderlyingTransactions;
