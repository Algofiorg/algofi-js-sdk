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
exports.StakingContract = void 0;
var manager_1 = require("./manager");
var market_1 = require("./market");
var StakingContract = /** @class */ (function () {
    function StakingContract(algodClient, historicalIndexerClient, stakingContractInfo) {
        var _this = this;
        this.updateGlobalState = function () {
            console.log("UPDATE GLOBAL STATE IN STAKINGCONTRACT.TS\n");
            _this.getManager().updateGlobalState();
            _this.getMarket().updateGlobalState();
        };
        this.getManager = function () {
            console.log("GET MANAGER IN STAKINGCONTRACT.TS\n");
            return _this.manager;
        };
        this.getMarket = function () {
            console.log("GET MARKET IN STAKINGCONTRACT.TS\n");
            return _this.market;
        };
        this.getAsset = function () {
            console.log("GET ASSET IN STAKINGCONTRACT.TS\n");
            return _this.getMarket().getAsset();
        };
        this.getManagerAppId = function () {
            console.log("GET MANAGER APP ID IN STAKINGCONTRACT.TS\n");
            return _this.getManager().getManagerAppId();
        };
        this.getManagerAddress = function () {
            console.log("GET MANAGER ADDRESS IN STAKINGCONTRACT.TS\n");
            return _this.getManager().getManagerAddress();
        };
        this.getMarketAppId = function () {
            console.log("GET MARKET APP ID IN STAKINGCONTRACT.TS\n");
            return _this.getMarket().getMarketAppId();
        };
        this.getMarketAddress = function () {
            console.log("GET MARKET ADDRESS IN STAKINGCONTRACT.TS\n");
            return _this.getMarket().getMarketAddress();
        };
        this.getOracleAppId = function () {
            console.log("GET ORACLE APP ID IN STAKINGCONTRACT.TS\n");
            return _this.getMarket()
                .getAsset()
                .getOracleAppId();
        };
        this.getStaked = function () {
            console.log("GET STAKED IN STAKINGCONTRACT.TS\n");
            return _this.getMarket().getActiveCollateral();
        };
        this.getRewardsProgram = function () {
            console.log("GET REWARDS PROIGRAM IN STAKINGCONTRACT.TS\n");
            return _this.getManager().getRewardsProgram();
        };
        this.getStorageAddress = function (address) {
            console.log("GET STORAGE ADDRESS IN STAKINGCONTRACT.TS\n");
            return _this.getManager().getStorageAddress(address);
        };
        this.getStorageState = function (storageAddress) { return __awaiter(_this, void 0, void 0, function () {
            var result, unrealizedRewards, secondaryUnrealizedRewards, userMarketState;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("GET STORAGE STATE IN STAKINGCONTRACT.TS\n");
                        result = {};
                        return [4 /*yield*/, this.getManager().getStorageUnrealizedRewards(storageAddress, [this.getMarket()])];
                    case 1:
                        _a = _b.sent(), unrealizedRewards = _a[0], secondaryUnrealizedRewards = _a[1];
                        result["unrealized_rewards"] = unrealizedRewards;
                        result["secondary_unrealized_rewards"] = secondaryUnrealizedRewards;
                        userMarketState = this.getMarket().getStorageState(storageAddress);
                        result["staked_bank"] = userMarketState["active_collateral_bank"];
                        result["stake_underlying"] = userMarketState["active_collateral_underlying"];
                        return [2 /*return*/, result];
                }
            });
        }); };
        console.log("CONSTRUCTOR IN STAKINGCONTRACT.TS\n");
        this.algodClient = algodClient;
        this.historicalIndexerClient = historicalIndexerClient;
        this.manager = new manager_1.Manager(this.algodClient, stakingContractInfo["managerAppId"]);
        this.market = new market_1.Market(this.algodClient, this.historicalIndexerClient, stakingContractInfo["marketAppId"]);
        this.updateGlobalState();
    }
    StakingContract.prototype.getUserState = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var storageAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("GET USER SETATE IN STAKINGCONTRACT.TS\n");
                        return [4 /*yield*/, this.getStorageAddress(address)];
                    case 1:
                        storageAddress = _a.sent();
                        if (!storageAddress) {
                            throw new Error("no storage address found");
                        }
                        return [2 /*return*/, this.getStorageState(storageAddress)];
                }
            });
        });
    };
    return StakingContract;
}());
exports.StakingContract = StakingContract;
