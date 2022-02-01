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
exports.searchGlobalState = exports.getNewAccount = exports.preparePaymentTransaction = exports.getInitRound = exports.getMarketAppId = exports.getManagerAppId = exports.getOrderedSymbols = exports.getStakingContracts = exports.getGlobalState = exports.readGlobalState = exports.readLocalState = exports.formatState = exports.intToBytes = exports.get = exports.getRandomInt = exports.TransactionGroup = exports.waitForConfirmation = exports.Transactions = void 0;
var algosdk_1 = require("algosdk");
var contracts_1 = require("./v1/contracts");
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
/**
 * Wait for the specified transaction to complete
 *
 * @param algodClient - algod client
 * @param txId - transaction id of transaction we are waiting for
 * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-health)
 */
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
                        console.log("Transaction ".concat(txId, " confirmed in round ").concat(pendingInfo["confirmed-round"]));
                        return [3 /*break*/, 5];
                    }
                    lastround += 1;
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
var TransactionGroup = /** @class */ (function () {
    /**
     * This is the constructor for the TransactionGroup class.
     * You pass in a list of transactions and get back a TransactionGroup object
     *
     * @param transactions - list of transactions
     */
    function TransactionGroup(transactions) {
        this.transactions = (0, algosdk_1.assignGroupID)(transactions);
        var signedTransactions = [];
        for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
            var _ = _a[_i];
            signedTransactions.push(null);
        }
        this.signedTransactions = signedTransactions;
    }
    /**
     * Signs the transactions with specified private key and saves to class state
     *
     * @param address - account address of the user
     * @param privateKey - private key of user
     */
    TransactionGroup.prototype.signWithPrivateKey = function (address, privateKey) {
        for (var _i = 0, _a = Object.entries(this.transactions); _i < _a.length; _i++) {
            var _b = _a[_i], i = _b[0], txn = _b[1];
            this.signedTransactions[i] = txn.signTxn(privateKey);
        }
    };
    /**
     * Signs the transactions with specified private keys and saves to class state
     *
     * @param privateKeys - private keys
     */
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
    /**
     * Submits the signed transactions to the network using the algod client
     *
     * @param algod - algod client
     * @param wait - wait for txn to complete; defaults to false
     * @returns
     */
    TransactionGroup.prototype.submit = function (algod, wait) {
        if (wait === void 0) { wait = false; }
        return __awaiter(this, void 0, void 0, function () {
            var txid, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, algod.sendRawTransaction(this.signedTransactions)["do"]()];
                    case 1:
                        txid = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        throw new Error(e_1);
                    case 3:
                        if (!wait) return [3 /*break*/, 5];
                        return [4 /*yield*/, waitForConfirmation(algod, txid.txId)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [2 /*return*/, {
                            txid: txid.txId
                        }];
                }
            });
        });
    };
    return TransactionGroup;
}());
exports.TransactionGroup = TransactionGroup;
/**
 * Return a random integer between 0 and max
 *
 * @param max - max integer that we want to return
 * @returns random integer between 0 and max
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
exports.getRandomInt = getRandomInt;
/**
 * Return the value for the associated key in the object passed in , or defaultValue if not found
 *
 * @param object - object to parse
 * @param key - key to find value for
 * @param defaultValue - default value to default to when we can't find key
 * @returns the value for the associated key in the object passed in , or defaultValue if not found
 */
function get(object, key, defaultValue) {
    var result = object[key];
    return typeof result !== "undefined" ? result : defaultValue;
}
exports.get = get;
/**
 * Return a byte representation of the passed in number
 *
 * @param num - number to convert to bytes
 * @returns a byte representation of the passed in number
 */
function intToBytes(num) {
    return (0, algosdk_1.encodeUint64)(num);
}
exports.intToBytes = intToBytes;
/**
 * Return a formatted version of state after taking care of decoding and unecessary key values
 *
 * @param state - state we are trying to format
 * @returns a formatted version of state after taking care of decoding and unecessary key values
 */
function formatState(state) {
    var formatted = {};
    for (var _i = 0, state_1 = state; _i < state_1.length; _i++) {
        var item = state_1[_i];
        var key = item.key;
        var value = item.value;
        var formattedKey = void 0;
        var formattedValue = void 0;
        try {
            formattedKey = Buffer.from(key, "base64").toString();
        }
        catch (e) {
            formattedKey = Buffer.from(key).toString();
        }
        if (value.type === 1) {
            if (value.bytes !== "") {
                formattedValue = value.bytes;
            }
            else {
                formattedValue = Buffer.from(value.bytes, "base64").toString();
            }
            formatted[formattedKey] = formattedValue;
        }
        else {
            formatted[formattedKey] = value.uint;
        }
    }
    return formatted;
}
exports.formatState = formatState;
/**
 * Returns dict of local state for address for application with id appId
 *
 * @param client - algod clietn
 * @param address - address of account for which to get state
 * @param appId - is of the application
 * @returns dict of local state of address for application with id appId
 */
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
                        if (localState.id === appId) {
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
/**
 * Returns dict of global state for application with id appId. Address must be that of the creator.
 *
 * @param client - algod client
 * @param address - creator address
 * @param appId - id of the application
 * @returns dict of global state for application with id appId
 */
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
                        if (app.id === appId) {
                            return [2 /*return*/, formatState(app.params["global-state"])];
                        }
                    }
                    return [2 /*return*/, {}];
            }
        });
    });
}
exports.readGlobalState = readGlobalState;
/**
 * Returns dict of global state for application with the given appId
 *
 * @param algodClient - algod client
 * @param appId - id of the application
 * @returns dict of global state for application with id appId
 */
function getGlobalState(algodClient, appId) {
    return __awaiter(this, void 0, void 0, function () {
        var application, stateDict;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, algodClient.getApplicationByID(appId)["do"]()];
                case 1:
                    application = _a.sent();
                    stateDict = formatState(application.params["global-state"]);
                    return [2 /*return*/, stateDict];
            }
        });
    });
}
exports.getGlobalState = getGlobalState;
/**
 * Returns list of supported staking contracts for the specified chain. Pulled from hardcoded values in contracts.ts.
 *
 * @param chain - network to query data for
 * @returns list of supported staking contracts
 */
function getStakingContracts(chain) {
    return contracts_1.contracts[chain].STAKING_CONTRACTS;
}
exports.getStakingContracts = getStakingContracts;
/**
 * Returns list of supported symbols for the specified chain. Pulled from hardcoded values in contracts.ts.
 *
 * @param chain - network to query data for
 * @param max - max assets?
 * @param maxAtomicOptIn - list of supported symbols for algofi's protocol on chain
 * @returns
 */
function getOrderedSymbols(chain, max, maxAtomicOptIn) {
    if (max === void 0) { max = false; }
    if (maxAtomicOptIn === void 0) { maxAtomicOptIn = false; }
    var supportedMarketCount;
    if (max) {
        supportedMarketCount = contracts_1.contracts[chain].maxMarketCount;
    }
    else if (maxAtomicOptIn) {
        supportedMarketCount = contracts_1.contracts[chain].maxAtomicOptInMarketCount;
    }
    else {
        supportedMarketCount = contracts_1.contracts[chain].supportedMarketCount;
    }
    return contracts_1.contracts[chain].SYMBOLS.slice(0, supportedMarketCount);
}
exports.getOrderedSymbols = getOrderedSymbols;
/**
 * Returns app id of manager for the specified chain. Pulled from hardcoded values in contracts.ts.
 *
 * @param chain - network to query data for
 * @returns manager app id
 */
function getManagerAppId(chain) {
    return contracts_1.contracts[chain].managerAppId;
}
exports.getManagerAppId = getManagerAppId;
/**
 * Returns market app id of symbol for the specified chain. Pulled from hardcoded values in contracts.ts.
 *
 * @param chain - network to query data for
 * @param symbol - symbol to get market data for
 * @returns market app id
 */
function getMarketAppId(chain, symbol) {
    return contracts_1.contracts[chain].SYMBOL_INFO[symbol].marketAppId;
}
exports.getMarketAppId = getMarketAppId;
/**
 * Returns init round of algofi protocol for a specified chain. Pulled from hardcoded values in contracts.ts.
 *
 * @param chain - network to query data for
 * @returns init round of algofi protocol on specified chain
 */
function getInitRound(chain) {
    return contracts_1.contracts[chain].initRound;
}
exports.getInitRound = getInitRound;
/**
 * Returns a transaction group object representing a payment group transaction
 * for a given sender, receiver, amount and ability to rekey.
 *
 * @param sender - account address for sender
 * @param suggestedParams - suggested transaction params
 * @param receiver - account address for the receiver
 * @param amount - amount of algos to send
 * @returns
 */
function preparePaymentTransaction(sender, suggestedParams, receiver, amount) {
    var txn = (0, algosdk_1.makePaymentTxnWithSuggestedParams)(sender, receiver, amount, undefined, undefined, suggestedParams);
    var txnGroup = new TransactionGroup([txn]);
    return txnGroup;
}
exports.preparePaymentTransaction = preparePaymentTransaction;
/**
 * Returns a three element list with a new key, address and passphrase.
 *
 * @returns a three element list with a new key, address and passphrase.
 */
function getNewAccount() {
    var newAccount = (0, algosdk_1.generateAccount)();
    var key = newAccount.sk;
    var address = newAccount.addr;
    var passphrase = (0, algosdk_1.secretKeyToMnemonic)(key);
    return [key, address, passphrase];
}
exports.getNewAccount = getNewAccount;
/**
 * Returns value from the encoded global state dict of an application
 *
 * @param globalState - global state of an application
 * @param searchKey - utf8 key of a value to search for
 * @returns value for the given key
 */
function searchGlobalState(globalState, searchKey) {
    for (var _i = 0, globalState_1 = globalState; _i < globalState_1.length; _i++) {
        var field = globalState_1[_i];
        var value = field.value;
        var key = field.key;
        if (searchKey === Buffer.from(key, "base64").toString()) {
            if (value.type == 2) {
                value = value.uint;
            }
            else {
                value = value.bytes;
            }
            return value;
        }
    }
    throw new Error("Key not found");
}
exports.searchGlobalState = searchGlobalState;
