"use strict";
exports.__esModule = true;
exports.getInitTxns = void 0;
var algosdk_1 = require("algosdk");
var utils_1 = require("./utils");
var contractStrings_1 = require("./contractStrings");
//Need to figure out how to skip parameters in a function clal for ts
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
    console.log("GET INIT TXNS IN PREPEND.TS\n");
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
    //Not sure if we have to encode a note here which is a random number
    var txn0 = algosdk_1["default"].makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [enc.encode(contractStrings_1.managerStrings.fetch_market_variables)], undefined, supportedMarketAppIds);
    var txn1 = algosdk_1["default"].makeApplicationNoOpTxn(sender, suggestedParamsModified, managerAppId, [enc.encode(contractStrings_1.managerStrings.update_prices)], undefined, supportedOracleAppIds);
    var txn2 = algosdk_1["default"].makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [enc.encode(contractStrings_1.managerStrings.update_protocol_data)], [storageAccount], supportedMarketAppIds);
    var dummyTxns = [txn0, txn1, txn2];
    for (var i = 1; i < NUM_DUMMY_TXNS + 1; i++) {
        var txn = algosdk_1["default"].makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [enc.encode("dummy_" + dummyTxnNumToWord[i])], undefined, supportedMarketAppIds);
        dummyTxns.push(txn);
    }
    return dummyTxns;
}
exports.getInitTxns = getInitTxns;
