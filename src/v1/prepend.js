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
exports.getInitTxns = void 0;
var algosdk_1 = require("algosdk");
var utils_1 = require("./utils");
var contractStrings_1 = require("./contractStrings");
var NUM_DUMMY_TXNS = 9;
var dummyTxnNumToWord = {
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten"
};
function getInitTxns(transactionType, sender, suggestedParams, managerAppId, supportedMarketAppIds, supportedOracleAppIds, storageAccount) {
    //We need to do a deep copy here, here it is just a shallow copy
    var suggestedParamsModified = suggestedParams;
    var listTxnTypes = [
        utils_1.Transactions.MINT,
        utils_1.Transactions.BURN,
        utils_1.Transactions.REMOVE_COLLATERAL,
        utils_1.Transactions.REMOVE_COLLATERAL_UNDERLYING,
        utils_1.Transactions.BORROW,
        utils_1.Transactions.REPAY_BORROW,
        utils_1.Transactions.LIQUIDATE,
        utils_1.Transactions.CLAIM_REWARDS
    ];
    if (listTxnTypes.includes(transactionType)) {
        suggestedParamsModified.fee = 2000;
    }
    var enc = new TextEncoder();
    var txn0 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, managerAppId, [enc.encode(contractStrings_1.managerStrings.fetch_market_variables)], undefined, supportedMarketAppIds, undefined, (0, utils_1.intToBytes)((0, utils_1.getRandomInt)(1000000)));
    var txn1 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParamsModified, managerAppId, [enc.encode(contractStrings_1.managerStrings.update_prices)], undefined, supportedOracleAppIds);
    var txn2 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, managerAppId, [enc.encode(contractStrings_1.managerStrings.update_protocol_data)], [storageAccount], supportedMarketAppIds);
    var dummyTxns = [];
    //need to confirm this is correct
    for (var i = 1; i < NUM_DUMMY_TXNS + 1; i++) {
        var txn = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, managerAppId, [enc.encode("dummy_" + dummyTxnNumToWord[i])], undefined, supportedMarketAppIds);
        dummyTxns.push(txn);
    }
    return __spreadArray([txn0, txn1, txn2], dummyTxns, true);
}
exports.getInitTxns = getInitTxns;
