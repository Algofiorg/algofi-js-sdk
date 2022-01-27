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
exports.RewardsProgram = void 0;
var contractStrings_1 = require("./contractStrings");
var utils_1 = require("./utils");
var config_1 = require("./config");
var utils_2 = require("./utils");
var RewardsProgram = /** @class */ (function () {
    function RewardsProgram(algodClient, managerState) {
        console.log("CONSTRUCTOR IN REWARDSPROGRAM.TS\n");
        this.algod = algodClient;
        this.latestRewardsTime = (0, utils_2.get)(managerState, contractStrings_1.managerStrings.latest_rewards_time, 0);
        this.rewardsProgramNumber = (0, utils_2.get)(managerState, contractStrings_1.managerStrings.n_rewards_programs, 0);
        this.rewardsAmount = (0, utils_2.get)(managerState, contractStrings_1.managerStrings.rewards_amount, 0);
        this.rewardsPerSecond = (0, utils_2.get)(managerState, contractStrings_1.managerStrings.rewards_per_second, 0);
        this.rewardsAssetId = (0, utils_2.get)(managerState, contractStrings_1.managerStrings.rewards_asset_id, 0);
        this.rewardsSecondaryRatio = (0, utils_2.get)(managerState, contractStrings_1.managerStrings.rewards_secondary_ratio, 0);
        this.rewardsSecondaryAssetId = (0, utils_2.get)(managerState, contractStrings_1.managerStrings.rewards_secondary_asset_id, 0);
    }
    //Getters
    RewardsProgram.prototype.getRewardsAssetIds = function () {
        console.log("GET REWARDS ASSET IDS IN REWARDSPROGRAM.TS\n");
        var result = [];
        if (this.rewardsAssetId > 1) {
            result.push(this.rewardsAssetId);
        }
        if (this.rewardsSecondaryAssetId > 1) {
            result.push(this.rewardsSecondaryAssetId);
        }
        return result;
    };
    RewardsProgram.prototype.getLatestRewardsTime = function () {
        console.log("GET LATEST REWARDS TIME IN REWARDSPROGRAM.TS\n");
        return this.latestRewardsTime;
    };
    RewardsProgram.prototype.getRewardsProgramNumber = function () {
        console.log("GET REWARDS PROGRAM NUMBER IN REWARDSPROGRAM.TS\n");
        return this.rewardsProgramNumber;
    };
    RewardsProgram.prototype.getRewardsAmount = function () {
        console.log("GET REWARDS AMOUNT IN REWARDSPROGRAM.TS\n");
        return this.rewardsAmount;
    };
    RewardsProgram.prototype.getRewardsPerSecond = function () {
        console.log("GET REWARDS PER SECOND IN REWARDSPROGRAM.TS\n");
        return this.rewardsPerSecond;
    };
    RewardsProgram.prototype.getRewardsAssetId = function () {
        console.log("GET REWARDS ASSET ID IN REWARDSPROGRAM.TS\n");
        return this.rewardsAssetId;
    };
    RewardsProgram.prototype.getRewardsSecondaryRatio = function () {
        console.log("GET REWARDS SECONDARY RATIO IN REWARDSPROGRAM.TS\n");
        return this.rewardsSecondaryRatio;
    };
    RewardsProgram.prototype.getRewardsSecondaryAssetId = function () {
        console.log("GET REWARDS SECONDARY ASSET ID IN REWARDSPROGRAM.TS\n");
        return this.rewardsSecondaryAssetId;
    };
    RewardsProgram.prototype.getStorageUnrealizedRewards = function (storageAddress, manager, markets) {
        return __awaiter(this, void 0, void 0, function () {
            var managerState, managerStorageState, onCurrentProgram, totalUnrealizedRewards, totalSecondaryUnrealizedRewards, totalBorrowUsd, _i, markets_1, market, timeElapsed, rewardsIssued, projectedLatestRewardsCoefficient, _a, markets_2, market, marketCounterPrefix, coefficient, userCoefficient, underlyingBorrowed, marketUnderlyingTvl, projectedCoefficient, marketStorageState, unrealizedRewards, secondaryUnrealizedRewards;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("GET STORAGE UNREALIZED REWARDS IN REWARDSPROGRAM.TS\n");
                        managerState = (0, utils_1.getGlobalState)(this.algod, manager.getManagerAppId());
                        managerStorageState = (0, utils_1.readLocalState)(this.algod, storageAddress, manager.getManagerAppId());
                        onCurrentProgram = this.getRewardsProgramNumber === (0, utils_2.get)(managerStorageState, contractStrings_1.managerStrings.user_rewards_program_number, 0);
                        totalUnrealizedRewards = onCurrentProgram ? (0, utils_2.get)(managerStorageState, contractStrings_1.managerStrings.user_pending_rewards, 0) : 0;
                        totalSecondaryUnrealizedRewards = onCurrentProgram
                            ? (0, utils_2.get)(managerStorageState, contractStrings_1.managerStrings.user_secondary_pending_rewards, 0)
                            : 0;
                        totalBorrowUsd = 0;
                        for (_i = 0, markets_1 = markets; _i < markets_1.length; _i++) {
                            market = markets_1[_i];
                            totalBorrowUsd += market.getAsset().toUSD(market.getUnderlyingBorrowed());
                        }
                        rewardsIssued = this.getRewardsAmount() > 0 ? timeElapsed * this.getRewardsPerSecond() : 0;
                        projectedLatestRewardsCoefficient = Number(rewardsIssued * config_1.REWARDS_SCALE_FACTOR);
                        _a = 0, markets_2 = markets;
                        _b.label = 1;
                    case 1:
                        if (!(_a < markets_2.length)) return [3 /*break*/, 4];
                        market = markets_2[_a];
                        marketCounterPrefix = void 0;
                        coefficient = (0, utils_2.get)(managerState, marketCounterPrefix + contractStrings_1.managerStrings.counter_indexed_rewards_coefficient, 0);
                        userCoefficient = onCurrentProgram
                            ? (0, utils_2.get)(managerStorageState, marketCounterPrefix + contractStrings_1.managerStrings.counter_to_user_rewards_coefficient_initial, 0)
                            : 0;
                        return [4 /*yield*/, market.getUnderlyingBorrowed()];
                    case 2:
                        underlyingBorrowed = _b.sent();
                        marketUnderlyingTvl = underlyingBorrowed + (market.getActiveCollateral() * market.getBankToUnderlyingExchange()) / config_1.SCALE_FACTOR;
                        projectedCoefficient = coefficient +
                            Number((rewardsIssued * config_1.REWARDS_SCALE_FACTOR * market.getAsset().toUSD(market.getUnderlyingBorrowed())) /
                                (totalBorrowUsd * marketUnderlyingTvl));
                        marketStorageState = market.getStorageState(storageAddress);
                        unrealizedRewards = Number(((projectedCoefficient - userCoefficient) *
                            (marketStorageState["active_collateral_underlying"] + marketStorageState["borrow_underlying"])) /
                            config_1.REWARDS_SCALE_FACTOR);
                        secondaryUnrealizedRewards = Number((unrealizedRewards * this.getRewardsSecondaryRatio()) / config_1.PARAMETER_SCALE_FACTOR);
                        totalUnrealizedRewards += unrealizedRewards;
                        totalSecondaryUnrealizedRewards += secondaryUnrealizedRewards;
                        _b.label = 3;
                    case 3:
                        _a++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, [totalUnrealizedRewards, totalSecondaryUnrealizedRewards]];
                }
            });
        });
    };
    return RewardsProgram;
}());
exports.RewardsProgram = RewardsProgram;
