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
exports.TransactionGroup = exports.intToBytes = exports.getNewAccount = exports.getOrderedSymbols = exports.readGlobalState = exports.getInitRound = exports.getMarketAppId = exports.getStakingContracts = exports.getManagerAppId = exports.readLocalState = exports.searchGlobalState = exports.getGlobalState = exports.formatState = exports.signAndSubmitTransaction = exports.encodeVarint = exports.encodeValue = exports.getProgram = exports.toAscii = exports.get = exports.Transactions = void 0;
var encode_1 = require("./encode");
var algosdk_1 = require("algosdk");
var contracts_1 = require("./contracts");
var algosdk_2 = require("algosdk");
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
function get(object, key, default_value) {
    var result = object[key];
    return typeof result !== "undefined" ? result : default_value;
}
exports.get = get;
function toAscii(word) {
    var temp = [];
    for (var i = 0; i < word.length; i++) {
        temp.push(word.charCodeAt(i));
    }
    return temp;
}
exports.toAscii = toAscii;
function getProgram(definition, variables) {
    if (variables === void 0) { variables = undefined; }
    console.log("GET PROGRAM IN UTILS.TS\n");
    var template = definition["bytecode"];
    var templateBytes = toAscii(template);
    var offset = 0;
}
exports.getProgram = getProgram;
function encodeValue(value, type) {
    console.log("ENCODE VALUE IN UTILS.TS\n");
    if (type === "int") {
        return (0, exports.encodeVarint)(value);
    }
    throw new Error("Unsupported value type ".concat(type));
}
exports.encodeValue = encodeValue;
var encodeVarint = function (number) {
    console.log("ENCODE VARINT IN UTILS.TS\n");
    /**
     * TOOD: figure out byte logic in javascript
     */
    var buf;
};
exports.encodeVarint = encodeVarint;
var signAndSubmitTransaction = function (client, transactions, signedTransactions, sender, senderSk) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, _a, _b, i, txn, txid;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log("SIGN AND SUBMIT TRANSACTION IN UTILS.TS");
                for (_i = 0, _a = transactions.entries(); _i < _a.length; _i++) {
                    _b = _a[_i], i = _b[0], txn = _b[1];
                    if (txn.sender === sender) {
                        signedTransactions[i] = txn.signTxn(senderSk);
                    }
                }
                return [4 /*yield*/, client.sendRawTransaction(signedTransactions)["do"]()];
            case 1:
                txid = _c.sent();
                return [2 /*return*/, waitForConfirmation(client, txid)];
        }
    });
}); };
exports.signAndSubmitTransaction = signAndSubmitTransaction;
var dec = new TextDecoder();
function formatState(state) {
    console.log("FORMAT STATE IN UTILS.TS\n");
    var formatted = {};
    for (var _i = 0, state_1 = state; _i < state_1.length; _i++) {
        var item = state_1[_i];
        var key = item["key"];
        var value = item["value"];
        var formattedKey = void 0;
        var formattedValue = void 0;
        try {
            formattedKey = encode_1.Base64Encoder._utf8_decode(encode_1.Base64Encoder.decode(key));
        }
        catch (e) {
            formattedKey = encode_1.Base64Encoder.decode(key);
        }
        if (value["type"] === 1) {
            try {
                formattedValue = encode_1.Base64Encoder._utf8_decode(encode_1.Base64Encoder.decode(value["bytes"]));
            }
            catch (e) {
                formattedValue = value["bytes"];
            }
            formatted[formattedKey] = formattedValue;
        }
        else {
            formatted[formattedKey] = value["uint"];
        }
        console.log("format state in utils.ts finished and returned", formatted, "\n");
        return formatted;
    }
}
exports.formatState = formatState;
var getGlobalState = function (algodClient, appId) { return __awaiter(void 0, void 0, void 0, function () {
    var application, stateDict;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("GET GLOBAL STATE IN UTILS.TS\n");
                return [4 /*yield*/, algodClient.getApplicationByID(appId)["do"]()];
            case 1:
                application = _a.sent();
                stateDict = formatState(application["params"]["global-state"]);
                console.log("get global state in utils.ts finished and returned", stateDict, "\n");
                return [2 /*return*/, stateDict];
        }
    });
}); };
exports.getGlobalState = getGlobalState;
var searchGlobalState = function (globalState, searchKey) {
    console.log("SEARCH GLOBAL STATE IN UTILS.TS");
    var value;
    for (var _i = 0, globalState_1 = globalState; _i < globalState_1.length; _i++) {
        var entry = globalState_1[_i];
        var decodedKey = encode_1.Base64Encoder.decode(entry.key);
        if (decodedKey === searchKey) {
            if (entry.value.type == 2) {
                value = entry.value.uint;
            }
            else {
                value = entry.value.bytes;
            }
        }
    }
    return value;
};
exports.searchGlobalState = searchGlobalState;
//Figure out if we are returning the same file as the python sdk
function readLocalState(client, address, appId) {
    return __awaiter(this, void 0, void 0, function () {
        var results, _i, _a, localState;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("READ LOCAL STATE IN UTILS.TS\n");
                    return [4 /*yield*/, client.accountInformation(address)["do"]()];
                case 1:
                    results = _b.sent();
                    for (_i = 0, _a = results["apps-local-state"]; _i < _a.length; _i++) {
                        localState = _a[_i];
                        if (localState["id"] === appId) {
                            if (!Object.keys(localState).includes("key-value")) {
                                console.log("read local state in utils.ts finished and returned {}\n");
                                return [2 /*return*/, {}];
                            }
                            console.log("read local state in utils.ts finished and returned", formatState(localState["key-value"]), "\n");
                            return [2 /*return*/, formatState(localState["key-value"])];
                        }
                    }
                    console.log("read local state in utils.ts finished and returned {}\n");
                    return [2 /*return*/, {}];
            }
        });
    });
}
exports.readLocalState = readLocalState;
var getManagerAppId = function (chain) {
    console.log("GET MANAGER APP ID IN UTILS.TS\n");
    console.log("get manager app id in utils.ts finished and returned", contracts_1.contracts[chain]["managerAppId"], "\n");
    return contracts_1.contracts[chain]["managerAppId"];
};
exports.getManagerAppId = getManagerAppId;
var waitForConfirmation = function (client, txId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, lastround, pendingInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("WAIT FOR CONFIRMATION IN UTILS.TS");
                    return [4 /*yield*/, client.status()["do"]()];
                case 1:
                    response = _a.sent();
                    lastround = response["last-round"];
                    _a.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 5];
                    return [4 /*yield*/, client.pendingTransactionInformation(txId)["do"]()];
                case 3:
                    pendingInfo = _a.sent();
                    if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                        // console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"])
                        return [3 /*break*/, 5];
                    }
                    lastround++;
                    return [4 /*yield*/, client.statusAfterBlock(lastround)["do"]()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
};
var getStakingContracts = function (chain) {
    console.log("GET STAKING CONTRACTS IN UTILS.TS\n");
    return contracts_1.contracts[chain]["STAKING_CONTRACTS"];
};
exports.getStakingContracts = getStakingContracts;
var getMarketAppId = function (chain, symbol) {
    console.log("GET MARKET APP ID IN UTILS.TS\n");
    return contracts_1.contracts[chain]["SYMBOL_INFO"][symbol]["marketAppId"];
};
exports.getMarketAppId = getMarketAppId;
var getInitRound = function (chain) {
    console.log("GET INIT ROUND IN UTILS.TS\n");
    console.log("get init round in utils.ts finished and returned", contracts_1.contracts[chain]["initRound"], "\n");
    return contracts_1.contracts[chain]["initRound"];
};
exports.getInitRound = getInitRound;
var readGlobalState = function (client, address, appId) { return __awaiter(void 0, void 0, void 0, function () {
    var results, appsCreated, _i, appsCreated_1, app;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("READ GLOBAL STATE IN UTILS.TS");
                return [4 /*yield*/, client.accountInformation(address)["do"]()];
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
}); };
exports.readGlobalState = readGlobalState;
var getOrderedSymbols = function (chain, max, maxAtomicOptIn) {
    if (max === void 0) { max = false; }
    if (maxAtomicOptIn === void 0) { maxAtomicOptIn = false; }
    console.log("GET ORDERED SYMBOLS IN UTILS.TS\n");
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
    // console.log(supportedMarketCount)
    console.log("get ordered symbols in utils.ts finished and returned", contracts_1.contracts[chain]["SYMBOLS"].slice(0, supportedMarketCount), "\n");
    return contracts_1.contracts[chain]["SYMBOLS"].slice(0, supportedMarketCount);
};
exports.getOrderedSymbols = getOrderedSymbols;
// //Do we not need client to get the reccomended parameters?
// export const preparePaymentTransaction = async (sender : string, suggestedParams, receiver : string, amount : number, rekeyTo = undefined) => {
//   let params = await client.getTransactionParams().do();
//   let txn = makePaymentTxnWithSuggestedParams(sender, receiver, amount, undefined, undefined, params);
//   return;
// }
var getNewAccount = function () {
    console.log("GET NEW ACCOUNT IN UTILS.TS");
    var newAccount = (0, algosdk_1.generateAccount)();
    var key = newAccount.sk;
    var address = newAccount.addr;
    var passphrase = (0, algosdk_1.secretKeyToMnemonic)(key);
    return [key, address, passphrase];
};
exports.getNewAccount = getNewAccount;
function intToBytes(int) {
    console.log("INT TO BYTES IN UTILS.TS");
    return (0, algosdk_1.encodeUint64)(int);
}
exports.intToBytes = intToBytes;
var TransactionGroup = /** @class */ (function () {
    function TransactionGroup(transactions) {
        var _this = this;
        //figure out how to notate types of privateKey
        //Also address is not used so I took it out of the parameters
        this.signWithPrivateKey = function (privateKey) {
            console.log("SIGN WITH PRIVATE KEY IN UTILS.TS");
            for (var _i = 0, _a = Object.entries(_this.transactions); _i < _a.length; _i++) {
                var _b = _a[_i], i = _b[0], txn = _b[1];
                _this.signedTransactions[i] = txn.signTxn(privateKey);
            }
        };
        this.signWithPrivateKeys = function (privateKeys) {
            console.log("SIGN WITH PRIVATE KEYS IN UTILS.TS");
            //do assertion assert(len(private_keys) == len(self.transactions))
            for (var _i = 0, _a = Object.entries(_this.transactions); _i < _a.length; _i++) {
                var _b = _a[_i], i = _b[0], txn = _b[1];
                _this.signedTransactions[i] = txn.signTxn(privateKeys[i]);
            }
        };
        this.submit = function (algod, wait) {
            if (wait === void 0) { wait = false; }
            return __awaiter(_this, void 0, void 0, function () {
                var txid, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("SUBMIT IN UTILS.TS");
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, algod.sendRawTransaction(this.signedTransactions)["do"]()
                                //Figure out catching and throwing errors as other aliases
                            ];
                        case 2:
                            txid = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            throw new Error(e_1);
                        case 4:
                            if (wait) {
                                return [2 /*return*/, waitForConfirmation(algod, txid)];
                            }
                            //formatter is saving this as txid:txid instead of "txid":txid
                            return [2 /*return*/, {
                                    txid: txid
                                }];
                    }
                });
            });
        };
        console.log("CONSTRUCTOR TRANSACTION GROUP IN UTILS.TS");
        this.transactions = (0, algosdk_2.assignGroupID)(transactions);
        var signedTransactions = [];
        for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
            var _ = _a[_i];
            signedTransactions.push(undefined);
        }
        this.signedTransactions = signedTransactions;
    }
    return TransactionGroup;
}());
exports.TransactionGroup = TransactionGroup;
