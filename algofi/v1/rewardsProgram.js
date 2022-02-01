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
var config_1 = require("./config");
var contractStrings_1 = require("../contractStrings");
var utils_1 = require("../utils");
var RewardsProgram = /** @class */ (function () {
    /**
     * Constructor for RewardsProgram class
     *
     * @param algodClient - algod client
     * @param managerState - state of manager application we are interested in
     */
    function RewardsProgram(algodClient, managerState) {
        this.algod = algodClient;
        this.latestRewardsTime = (0, utils_1.get)(managerState, contractStrings_1.managerStrings.latest_rewards_time, 0);
        this.rewardsProgramNumber = (0, utils_1.get)(managerState, contractStrings_1.managerStrings.n_rewards_programs, 0);
        this.rewardsAmount = (0, utils_1.get)(managerState, contractStrings_1.managerStrings.rewards_amount, 0);
        this.rewardsPerSecond = (0, utils_1.get)(managerState, contractStrings_1.managerStrings.rewards_per_second, 0);
        this.rewardsAssetId = (0, utils_1.get)(managerState, contractStrings_1.managerStrings.rewards_asset_id, 0);
        this.rewardsSecondaryRatio = (0, utils_1.get)(managerState, contractStrings_1.managerStrings.rewards_secondary_ratio, 0);
        this.rewardsSecondaryAssetId = (0, utils_1.get)(managerState, contractStrings_1.managerStrings.rewards_secondary_asset_id, 0);
    }
    /**
     * Return a list of current rewards assets
     *
     * @returns rewards asset list
     */
    RewardsProgram.prototype.getRewardsAssetIds = function () {
        var result = [];
        if (this.rewardsAssetId > 1) {
            result.push(this.rewardsAssetId);
        }
        if (this.rewardsSecondaryAssetId > 1) {
            result.push(this.rewardsSecondaryAssetId);
        }
        return result;
    };
    /**
     * Return latest rewards time
     *
     * @returns latest rewards time
     */
    RewardsProgram.prototype.getLatestRewardsTime = function () {
        return this.latestRewardsTime;
    };
    /**
     * Return rewards program number
     *
     * @returns rewards program number
     */
    RewardsProgram.prototype.getRewardsProgramNumber = function () {
        return this.rewardsProgramNumber;
    };
    /**
     * Return rewards amount
     *
     * @returns rewards amount
     */
    RewardsProgram.prototype.getRewardsAmount = function () {
        return this.rewardsAmount;
    };
    /**
     * Return rewards per second
     *
     * @returns rewards per second
     */
    RewardsProgram.prototype.getRewardsPerSecond = function () {
        return this.rewardsPerSecond;
    };
    /**
     * Return rewards asset id
     *
     * @returns rewards asset id
     */
    RewardsProgram.prototype.getRewardsAssetId = function () {
        return this.rewardsAssetId;
    };
    /**
     * Returns rewards secondary ratio
     *
     * @returns rewards secondary ratio
     */
    RewardsProgram.prototype.getRewardsSecondaryRatio = function () {
        return this.rewardsSecondaryRatio;
    };
    /**
     * Return rewards secondary asset id
     *
     * @returns rewards secondary asset id
     */
    RewardsProgram.prototype.getRewardsSecondaryAssetId = function () {
        return this.rewardsSecondaryAssetId;
    };
    /**
     * Return the projected claimable rewards for a given storage address
     *
     * @param storageAddress - storage address of unrealized rewards
     * @param manager - manager for unrealized rewards
     * @param markets - list of markets for unrealized rewards
     * @returns two element list of primary and secondary unrealized rewards
     */
    RewardsProgram.prototype.getStorageUnrealizedRewards = function (storageAddress, manager, markets) {
        return __awaiter(this, void 0, void 0, function () {
            var managerState, managerStorageState, onCurrentProgram, totalUnrealizedRewards, totalSecondaryUnrealizedRewards, totalBorrowUsd, _i, markets_1, market, _a, _b, _c, date, timeElapsed, rewardsIssued, _d, markets_2, market, marketCounterPrefix, coefficient, userCoefficient, marketUnderlyingTvl, projectedCoefficient, _e, _f, _g, _h, _j, _k, marketStorageState, unrealizedRewards, secondaryUnrealizedRewards;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0: return [4 /*yield*/, (0, utils_1.getGlobalState)(this.algod, manager.getManagerAppId())];
                    case 1:
                        managerState = _l.sent();
                        return [4 /*yield*/, (0, utils_1.readLocalState)(this.algod, storageAddress, manager.getManagerAppId())];
                    case 2:
                        managerStorageState = _l.sent();
                        onCurrentProgram = this.getRewardsProgramNumber() === (0, utils_1.get)(managerStorageState, contractStrings_1.managerStrings.user_rewards_program_number, 0);
                        totalUnrealizedRewards = onCurrentProgram ? (0, utils_1.get)(managerStorageState, contractStrings_1.managerStrings.user_pending_rewards, 0) : 0;
                        totalSecondaryUnrealizedRewards = onCurrentProgram
                            ? (0, utils_1.get)(managerStorageState, contractStrings_1.managerStrings.user_secondary_pending_rewards, 0)
                            : 0;
                        totalBorrowUsd = 0;
                        _i = 0, markets_1 = markets;
                        _l.label = 3;
                    case 3:
                        if (!(_i < markets_1.length)) return [3 /*break*/, 7];
                        market = markets_1[_i];
                        _a = totalBorrowUsd;
                        _c = (_b = market.getAsset()).toUSD;
                        return [4 /*yield*/, market.getUnderlyingBorrowed()];
                    case 4: return [4 /*yield*/, _c.apply(_b, [_l.sent()])];
                    case 5:
                        totalBorrowUsd = _a + _l.sent();
                        _l.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 3];
                    case 7:
                        date = new Date();
                        timeElapsed = Math.floor((date.getTime() / 1000) - this.getLatestRewardsTime());
                        rewardsIssued = this.getRewardsAmount() > 0 ? timeElapsed * this.getRewardsPerSecond() : 0;
                        _d = 0, markets_2 = markets;
                        _l.label = 8;
                    case 8:
                        if (!(_d < markets_2.length)) return [3 /*break*/, 14];
                        market = markets_2[_d];
                        marketCounterPrefix = Buffer.from((0, utils_1.intToBytes)(market.getMarketCounter())).toString("utf-8");
                        coefficient = (0, utils_1.get)(managerState, marketCounterPrefix + contractStrings_1.managerStrings.counter_indexed_rewards_coefficient, 0);
                        userCoefficient = onCurrentProgram
                            ? managerStorageState[marketCounterPrefix + contractStrings_1.managerStrings.counter_to_user_rewards_coefficient_initial]
                            : 0;
                        return [4 /*yield*/, market.getUnderlyingBorrowed()];
                    case 9:
                        marketUnderlyingTvl = (_l.sent()) + (market.getActiveCollateral() * market.getBankToUnderlyingExchange()) / config_1.SCALE_FACTOR;
                        _e = coefficient;
                        _g = (_f = Math).floor;
                        _h = rewardsIssued * config_1.REWARDS_SCALE_FACTOR;
                        _k = (_j = market.getAsset()).toUSD;
                        return [4 /*yield*/, market.getUnderlyingBorrowed()];
                    case 10: return [4 /*yield*/, _k.apply(_j, [_l.sent()])];
                    case 11:
                        projectedCoefficient = _e + _g.apply(_f, [_h * (_l.sent()) / (totalBorrowUsd * marketUnderlyingTvl)]);
                        return [4 /*yield*/, market.getStorageState(storageAddress)];
                    case 12:
                        marketStorageState = _l.sent();
                        unrealizedRewards = Math.floor((projectedCoefficient - userCoefficient) *
                            (marketStorageState.active_collateral_underlying + marketStorageState.borrow_underlying) /
                            config_1.REWARDS_SCALE_FACTOR);
                        secondaryUnrealizedRewards = Math.floor((unrealizedRewards * this.getRewardsSecondaryRatio()) / config_1.PARAMETER_SCALE_FACTOR);
                        totalUnrealizedRewards += unrealizedRewards;
                        totalSecondaryUnrealizedRewards += secondaryUnrealizedRewards;
                        _l.label = 13;
                    case 13:
                        _d++;
                        return [3 /*break*/, 8];
                    case 14: return [2 /*return*/, [totalUnrealizedRewards, totalSecondaryUnrealizedRewards]];
                }
            });
        });
    };
    return RewardsProgram;
}());
exports.RewardsProgram = RewardsProgram;
