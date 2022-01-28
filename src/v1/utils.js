"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.TransactionGroup = exports.searchGlobalState = exports.getNewAccount = exports.preparePaymentTransaction = exports.getInitRound = exports.getMarketAppId = exports.getManagerAppId = exports.getOrderedSymbols = exports.getStakingContracts = exports.getGlobalState = exports.readGlobalState = exports.readLocalState = exports.formatState = exports.getStateBytes = exports.getStateInt = exports.intToBytes = exports.waitForConfirmation = exports.signAndSubmitTransaction = exports.encodeVarint = exports.encodeValue = exports.getProgram = exports.get = exports.getRandomInt = exports.Transactions = void 0;
var algosdk_1 = require("algosdk");
var algosdk_2 = require("algosdk");
var contracts_1 = require("./contracts");
//Constants
var PARAMETER_SCALE_FACTOR = 1e3;
var SCALE_FACDTOR = 1e9;
var REWARDS_SCALE_FACTOR = 1e14;
var Transactions;
(function (Transactions) {
    Transactions[Transactions["MINT"] = 1] = "MINT";
    Transactions[Transactions["MINT_TO_COLLATERAL"] = 2] = "MINT_TO_COLLATERAL";
    Transactions[Transactions["ADD_COLLATERAL"] = 3] = "ADD_COLLATERAL";
    Transactions[Transactions["REMOVE_COLLATERAL"] = 4] = "REMOVE_COLLATERAL";
    Transactions[Transactions["BURN"] = 5] = "BURN";
    Transactions[Transactions["REMOVE_COLLATERAL_UNDERLYING"] = 6] = "REMOVE_COLLATERAL_UNDERLYING";
    Transactions[Transactions["BORROW"] = 7] = "BORROW";
    Transactions[Transactions["REPAY_BORROW"] = 8] = "REPAY_BORROW";
    Transactions[Transactions["LIQUIDATE"] = 9] = "LIQUIDATE";
    Transactions[Transactions["CLAIM_REWARDS"] = 10] = "CLAIM_REWARDS";
})(Transactions = exports.Transactions || (exports.Transactions = {}));
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
exports.getRandomInt = getRandomInt;
function get(object, key, default_value) {
    var result = object[key];
    return typeof result !== "undefined" ? result : default_value;
}
exports.get = get;
//I'm not sure how to implement this function, but it isn't used anywhere else in the py sdk so
//will come back to this later
function getProgram(definition, variables) {
    // """
    // Return a byte array to be used in LogicSig.
    // """
    // template = definition['bytecode']
    // template_bytes = list(b64decode(template))
    if (variables === void 0) { variables = null; }
    // offset = 0
    // for v in sorted(definition['variables'], key=lambda v: v['index']):
    //     name = v['name'].split('TMPL_')[-1].lower()
    //     value = variables[name]
    //     start = v['index'] - offset
    //     end = start + v['length']
    //     value_encoded = encode_value(value, v['type'])
    //     value_encoded_len = len(value_encoded)
    //     diff = v['length'] - value_encoded_len
    //     offset += diff
    //     template_bytes[start:end] = list(value_encoded)
    // return bytes(template_bytes)
    return;
}
exports.getProgram = getProgram;
function encodeValue(value, type) {
    if (type === "int") {
        return encodeVarint(value);
    }
    throw new Error("Unsupported value type ".concat(type, "!"));
}
exports.encodeValue = encodeValue;
//Again will come back to this function, it doesn't seem to be used anywhere else in the py sdk
//except get_program, but get_program isn't used anywhere else other than its declaration
function encodeVarint(number) {
    return;
}
exports.encodeVarint = encodeVarint;
//Again this isn't used anywhere and I'm not sure if the Transaction class is from a previous attempt because
//at least the js sdk for algorand doesn't have sender as a parameter for Transaction class
function signAndSubmitTransaction(client, transactions, signedTransactions, sender, senderSk) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, _b, i, txn, txid;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    for (_i = 0, _a = Object.entries(transactions); _i < _a.length; _i++) {
                        _b = _a[_i], i = _b[0], txn = _b[1];
                        if (true) {
                            signedTransactions[i] = txn.signTxn(senderSk);
                        }
                    }
                    return [4 /*yield*/, client.sendRawTransaction(signedTransactions)["do"]()];
                case 1:
                    txid = _c.sent();
                    return [2 /*return*/, waitForConfirmation(client, txid)];
            }
        });
    });
}
exports.signAndSubmitTransaction = signAndSubmitTransaction;
function waitForConfirmation(algodClient, txId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, lastround, pendingInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, algodClient.status()["do"]()];
                case 1:
                    response = _a.sent();
                    lastround = response["last-round"];
                    _a.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 5];
                    return [4 /*yield*/, algodClient.pendingTransactionInformation(txId)["do"]()];
                case 3:
                    pendingInfo = _a.sent();
                    if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                        //Got the completed Transaction
                        console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
                        return [3 /*break*/, 5];
                    }
                    lastround++;
                    return [4 /*yield*/, algodClient.statusAfterBlock(lastround)["do"]()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.waitForConfirmation = waitForConfirmation;
function intToBytes(num) {
    return (0, algosdk_1.encodeUint64)(num);
}
exports.intToBytes = intToBytes;
//Again this isn't used anywhere will come back to it later
function getStateInt(state, key) {
    if (typeof key === "string") {
    }
    return;
}
exports.getStateInt = getStateInt;
//Again this isn't used anywhere will come back to it later
function getStateBytes(state, key) {
    return;
}
exports.getStateBytes = getStateBytes;
//I think this is correct now, we take in base64 and then convert to a buffer of bytes and then convert
//that to a string with utf-8 encoding
//There actually is probably an error with the algorand docs, they do:
/*
import base64

encoded = "SGksIEknbSBkZWNvZGVkIGZyb20gYmFzZTY0"
decoded = base64.b64decode(encoded).encode('ascii')
print(decoded)
*/
//but bytes object has no property encode, which makes sense because if you are in bytes then you hva ealready encoded it into bytes
//and want to decode it into a charset
function formatState(state) {
    var formatted = {};
    for (var _i = 0, state_1 = state; _i < state_1.length; _i++) {
        var item = state_1[_i];
        var key = item["key"];
        var value = item["value"];
        var formattedKey = void 0;
        var formattedValue = void 0;
        try {
            formattedKey = Buffer.from(key, "base64").toString();
        }
        catch (e) {
            formattedKey = Buffer.from(key).toString();
        }
        if (value["type"] === 1) {
            if (value["bytes"] !== "") {
                formattedValue = value["bytes"];
            }
            else {
                formattedValue = Buffer.from(value["bytes"], "base64").toString();
            }
            formatted[formattedKey] = formattedValue;
        }
        else {
            formatted[formattedKey] = value["uint"];
        }
    }
    return formatted;
}
exports.formatState = formatState;
//Figure out if we are returning the same file as the python sdk
function readLocalState(client, address, appId) {
    return __awaiter(this, void 0, void 0, function () {
        var results, _i, _a, localState;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client.accountInformation(address)["do"]()];
                case 1:
                    results = _b.sent();
                    for (_i = 0, _a = results["apps-local-state"]; _i < _a.length; _i++) {
                        localState = _a[_i];
                        if (localState["id"] === appId) {
                            if (!Object.keys(localState).includes("key-value")) {
                                return [2 /*return*/, {}];
                            }
                            return [2 /*return*/, formatState(localState["key-value"])];
                        }
                    }
                    return [2 /*return*/, {}];
            }
        });
    });
}
exports.readLocalState = readLocalState;
function readGlobalState(client, address, appId) {
    return __awaiter(this, void 0, void 0, function () {
        var results, appsCreated, _i, appsCreated_1, app;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.accountInformation(address)["do"]()];
                case 1:
                    results = _a.sent();
                    appsCreated = results["created-apps"];
                    for (_i = 0, appsCreated_1 = appsCreated; _i < appsCreated_1.length; _i++) {
                        app = appsCreated_1[_i];
                        if (app["id"] === appId) {
                            return [2 /*return*/, formatState(app["params"]["global-state"])];
                        }
                    }
                    return [2 /*return*/, {}];
            }
        });
    });
}
exports.readGlobalState = readGlobalState;
//need to make sure that getApplicationByID is the same thing as client.application_info(app_id) for pysdk
function getGlobalState(algodClient, appId) {
    return __awaiter(this, void 0, void 0, function () {
        var application, stateDict;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, algodClient.getApplicationByID(appId)["do"]()];
                case 1:
                    application = _a.sent();
                    stateDict = formatState(application["params"]["global-state"]);
                    return [2 /*return*/, stateDict];
            }
        });
    });
}
exports.getGlobalState = getGlobalState;
function getStakingContracts(chain) {
    return contracts_1.contracts[chain]["STAKING_CONTRACTS"];
}
exports.getStakingContracts = getStakingContracts;
function getOrderedSymbols(chain, max, maxAtomicOptIn) {
    if (max === void 0) { max = false; }
    if (maxAtomicOptIn === void 0) { maxAtomicOptIn = false; }
    var supportedMarketCount;
    if (max) {
        supportedMarketCount = contracts_1.contracts["maxMarketCount"];
    }
    else if (maxAtomicOptIn) {
        supportedMarketCount = contracts_1.contracts["maxAtomicOptInMarketCount"];
    }
    else {
        supportedMarketCount = contracts_1.contracts["supportedMarketCount"];
    }
    console.log("get ordered symbols in utils.ts finished and returned", contracts_1.contracts[chain]["SYMBOLS"].slice(0, supportedMarketCount), "\n");
    return contracts_1.contracts[chain]["SYMBOLS"].slice(0, supportedMarketCount);
}
exports.getOrderedSymbols = getOrderedSymbols;
function getManagerAppId(chain) {
    return contracts_1.contracts[chain]["managerAppId"];
}
exports.getManagerAppId = getManagerAppId;
function getMarketAppId(chain, symbol) {
    return contracts_1.contracts[chain]["SYMBOL_INFO"][symbol]["marketAppId"];
}
exports.getMarketAppId = getMarketAppId;
function getInitRound(chain) {
    return contracts_1.contracts[chain]["initRound"];
}
exports.getInitRound = getInitRound;
function preparePaymentTransaction(sender, suggestedParams, receiver, amount, rekey_to) {
    if (rekey_to === void 0) { rekey_to = null; }
    var txn = (0, algosdk_1.makePaymentTxnWithSuggestedParams)(sender, receiver, amount, undefined, undefined, suggestedParams);
    var txnGroup = new TransactionGroup([txn]);
    return txnGroup;
}
exports.preparePaymentTransaction = preparePaymentTransaction;
function getNewAccount() {
    //this is actually not asynchronous
    var newAccount = (0, algosdk_1.generateAccount)();
    //tested that these work
    var key = newAccount.sk;
    var address = newAccount.addr;
    //this works as well
    var passphrase = (0, algosdk_1.secretKeyToMnemonic)(key);
    return [key, address, passphrase];
}
exports.getNewAccount = getNewAccount;
function searchGlobalState(globalState, searchKey) {
    for (var _i = 0, _a = Object.keys(globalState); _i < _a.length; _i++) {
        var field = _a[_i];
        var value = field["value"];
        var key = field["key"];
        if (searchKey === Buffer.from(key, "base64").toString()) {
            if (value["type"] == 2) {
                value = value["uint"];
            }
            else {
                value = value["bytes"];
            }
            return value;
        }
    }
    throw new Error("Key not found");
}
exports.searchGlobalState = searchGlobalState;
var TransactionGroup = /** @class */ (function () {
    function TransactionGroup(transactions) {
        this.transactions = (0, algosdk_2.assignGroupID)(transactions);
        var signedTransactions = [];
        for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
            var _ = _a[_i];
            signedTransactions.push(null);
        }
        this.signedTransactions = signedTransactions;
    }
    //figure out how to notate types of privateKey
    //Also address is not used but I can take it out later
    TransactionGroup.prototype.signWithPrivateKey = function (address, privateKey) {
        for (var _i = 0, _a = Object.entries(this.transactions); _i < _a.length; _i++) {
            var _b = _a[_i], i = _b[0], txn = _b[1];
            this.signedTransactions[i] = txn.signTxn(privateKey);
        }
    };
    TransactionGroup.prototype.signWithPrivateKeys = function (privateKeys) {
        if (privateKeys.length !== this.transactions.length) {
            throw new Error("Different number of private keys and transactions");
        }
        for (var _i = 0, _a = Object.entries(this.transactions); _i < _a.length; _i++) {
            var _b = _a[_i], i = _b[0], txn = _b[1];
            this.signedTransactions[i] = txn.signTxn(privateKeys[i]);
        }
    };
    //formatter is saving this as txid:txid instead of "txid":txid
    TransactionGroup.prototype.submit = function (algod, wait) {
        if (wait === void 0) { wait = false; }
        return __awaiter(this, void 0, void 0, function () {
            var txid, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, algod.sendRawTransaction(this.signedTransactions)["do"]()
                            //Figure out catching and throwing errors as other aliases
                        ];
                    case 1:
                        txid = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        throw new Error(e_1);
                    case 3:
                        if (wait) {
                            return [2 /*return*/, waitForConfirmation(algod, txid)];
                        }
                        return [2 /*return*/, {
                                txid: txid
                            }];
                }
            });
        });
    };
    return TransactionGroup;
}());
exports.TransactionGroup = TransactionGroup;
