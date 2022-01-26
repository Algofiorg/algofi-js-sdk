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
exports.printStakingContractState = exports.printUserState = exports.printMarketState = void 0;
function printMarketState(market) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log("STARTING PRINT MARKET STATE IN EXAMPLEUTILS.TS\n");
                    market.updateGlobalState();
                    console.log("underlying_cash =", market.getUnderlyingCash());
                    console.log("bank_circulation =", market.getBankCirculation());
                    console.log("active_collateral =", market.getActiveCollateral());
                    _b = (_a = console).log;
                    _c = ["underlying_borrowed ="];
                    return [4 /*yield*/, market.getUnderlyingBorrowed()];
                case 1:
                    _b.apply(_a, _c.concat([_d.sent()]));
                    console.log("total_borrow_interest_rate =", market.getTotalBorrowInterestRate());
                    console.log("\nPRINT MARKET STATE FINISHED\n");
                    return [2 /*return*/];
            }
        });
    });
}
exports.printMarketState = printMarketState;
function printUserState(client, symbol, address) {
    return __awaiter(this, void 0, void 0, function () {
        var userState, _i, _a, _b, key, value, _c, _d, _e, key, value, asset, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    console.log("STARTING PRINT USER STATE IN EXAMPLEUTILS.TS\n");
                    return [4 /*yield*/, client.getUserState(address)];
                case 1:
                    userState = _m.sent();
                    for (_i = 0, _a = Object.entries(userState["manager"]); _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], value = _b[1];
                        console.log(key, "=", value);
                    }
                    for (_c = 0, _d = Object.entries(userState[symbol]); _c < _d.length; _c++) {
                        _e = _d[_c], key = _e[0], value = _e[1];
                        console.log(key, "=", value);
                    }
                    asset = client.getMarket(symbol).getAsset();
                    _g = (_f = console).log;
                    _h = ["user_balance_asset ="];
                    return [4 /*yield*/, client.getUserBalance(asset.getUnderlyingAssetId())];
                case 2:
                    _g.apply(_f, _h.concat([(_m.sent()) / Math.pow(10, asset.get_underlying_asset_info()["decimals"])]));
                    _k = (_j = console).log;
                    _l = ["user_balance_bank_assert ="];
                    return [4 /*yield*/, client.getUserBalance(asset.getBankAssetId())];
                case 3:
                    _k.apply(_j, _l.concat([(_m.sent()) / Math.pow(10, asset.getBankAssetInfo()["decimals"])]));
                    return [2 /*return*/];
            }
        });
    });
}
exports.printUserState = printUserState;
function printStakingContractState(client, stakingContractName, address) {
    var stakingContract = client.getStakingContract(stakingContractName);
    stakingContract.updateGlobalState();
    console.log("staked =", stakingContract.getStaked());
    var stakingContractUserState = stakingContract.getUserState(address);
    console.log("user_staked =", stakingContractUserState["staked"]);
}
exports.printStakingContractState = printStakingContractState;
