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
exports.addCollateralExample = void 0;
var client_1 = require("../v1/client");
var algosdk_1 = require("algosdk");
var exampleUtils_1 = require("./exampleUtils");
function addCollateralExample(mnemonic) {
    if (mnemonic === void 0) { mnemonic = "biology engine verify maze coral cotton swear laptop surge vital surround entire glance dial oblige bleak friend royal round region divorce elephant law above local"; }
    return __awaiter(this, void 0, void 0, function () {
        var user, sender, key, buffer, IS_MAINNET, client, _a, symbol, assetBalance, txn, bankAssetBalance;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    user = (0, algosdk_1.mnemonicToSecretKey)(mnemonic);
                    sender = user.addr;
                    key = user.sk;
                    buffer = "----------------------------------------------------------------------------------------------------";
                    IS_MAINNET = false;
                    if (!IS_MAINNET) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, client_1.newAlgofiMainnetClient)(undefined, undefined, sender)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, (0, client_1.newAlgofiTestnetClient)(undefined, undefined, sender)];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    client = _a;
                    symbol = client.getActiveOrderedSymbols()[0];
                    console.log(buffer);
                    console.log("Initial State");
                    console.log(buffer);
                    return [4 /*yield*/, (0, exampleUtils_1.printMarketState)(client.getMarket(symbol))];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, (0, exampleUtils_1.printUserState)(client, symbol, sender)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, client.getUserBalance(client
                            .getMarket(symbol)
                            .getAsset()
                            .getUnderlyingAssetId())];
                case 7:
                    assetBalance = _b.sent();
                    if (assetBalance === 0) {
                        throw new Error("User has no balance of asset " + symbol);
                    }
                    console.log(buffer);
                    console.log("Processing add_collateral transaction");
                    console.log(buffer);
                    return [4 /*yield*/, client.prepareMintTransactions(symbol, Math.floor(assetBalance * 0.1), sender)];
                case 8:
                    txn = _b.sent();
                    txn.signWithPrivateKey(undefined, key);
                    return [4 /*yield*/, txn.submit(client.algod, true)];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, client.getUserBalance(client
                            .getMarket(symbol)
                            .getAsset()
                            .getBankAssetId())];
                case 10:
                    bankAssetBalance = _b.sent();
                    return [4 /*yield*/, client.prepareAddCollateralTransactions(symbol, Math.floor(bankAssetBalance * 0.1), sender)];
                case 11:
                    txn = _b.sent();
                    txn.signWithPrivateKey(undefined, key);
                    return [4 /*yield*/, txn.submit(client.algod, true)];
                case 12:
                    _b.sent();
                    console.log(buffer);
                    console.log("Final State");
                    console.log(buffer);
                    return [4 /*yield*/, (0, exampleUtils_1.printMarketState)(client.getMarket(symbol))];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, (0, exampleUtils_1.printUserState)(client, symbol, sender)];
                case 14:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.addCollateralExample = addCollateralExample;
