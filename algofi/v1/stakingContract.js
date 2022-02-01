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
    /**
     * This is the constructor for the StakingContract class.
     *
     * **Note, do not call this to create a new staking contract**. Instead call
     * the static method init as there are asynchronous set up steps in
     * creating an staking contract and a constructor can only return an instance of
     * the class and not a promise.
     *
     * #### Example
     * ```typescript
     * //Correct way to instantiate new staking contract
     * const newStakingContract = await StakingContract.init(algodClient, historicalIndexerClient, stakingContractInfo)
     *
     * //Incorrect way to instantiate new staking contract
     * const newStakingContract = new StakingContract(algodClient, historicalIndexerClient)
     * ```
     * @param algodClient - algod client
     * @param historicalIndexerClient - historical indexer client
     */
    function StakingContract(algodClient, historicalIndexerClient) {
        this.algodClient = algodClient;
        this.historicalIndexerClient = historicalIndexerClient;
    }
    /**
     * This is the function that should be called when creating a new staking contract.
     * You pass everything you would to the constructor with an additional staking contract info
     * dictionary, but to this function instead and this returns the new and created staking contract.
     *
     * #### Example
     * ```typescript
     * //Correct way to instantiate new staking contract
     * const newStakingContract = await StakingContract.init(algodClient, historicalIndexerClient, stakingContractInfo)
     *
     * //Incorrect way to instantiate new staking contract
     * const newStakingContract = new StakingContract(algodClient, historicalIndexerClient)
     * ```
     * @param algodClient - algod client
     * @param historicalIndexerClient - historical indexer client
     * @param stakingContractInfo - dictionary of information on staking contract
     */
    StakingContract.init = function (algodClient, historicalIndexerClient, stakingContractInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var stakingContract, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        stakingContract = new StakingContract(algodClient, historicalIndexerClient);
                        _a = stakingContract;
                        return [4 /*yield*/, manager_1.Manager.init(stakingContract.algodClient, stakingContractInfo.managerAppId)];
                    case 1:
                        _a.manager = _c.sent();
                        _b = stakingContract;
                        return [4 /*yield*/, market_1.Market.init(algodClient, historicalIndexerClient, stakingContractInfo.marketAppId)];
                    case 2:
                        _b.market = _c.sent();
                        return [4 /*yield*/, stakingContract.updateGlobalState()];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, stakingContract];
                }
            });
        });
    };
    /**
     * Method to fetch most recent staking contract global state
     */
    StakingContract.prototype.updateGlobalState = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getManager().updateGlobalState()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getMarket().updateGlobalState()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Return staking contract manager
     *
     * @returns manager
     */
    StakingContract.prototype.getManager = function () {
        return this.manager;
    };
    /**
     * Return staking contract market
     *
     * @returns market
     */
    StakingContract.prototype.getMarket = function () {
        return this.market;
    };
    /**
     * Return asset object for this market
     *
     * @returns asset
     */
    StakingContract.prototype.getAsset = function () {
        return this.getMarket().getAsset();
    };
    /**
     * Return manager app id
     *
     * @returns manager app id
     */
    StakingContract.prototype.getManagerAppId = function () {
        return this.getManager().getManagerAppId();
    };
    /**
     * Return manager address
     *
     * @returns manager address
     */
    StakingContract.prototype.getManagerAddress = function () {
        return this.getManager().getManagerAddress();
    };
    /**
     * Return the market app id
     *
     * @returns market app id
     */
    StakingContract.prototype.getMarketAppId = function () {
        return this.getMarket().getMarketAppId();
    };
    /**
     * Return the market address
     *
     * @returns market address
     */
    StakingContract.prototype.getMarketAddress = function () {
        return this.getMarket().getMarketAddress();
    };
    /**
     * Return oracle app id
     *
     * @returns oracle app id
     */
    StakingContract.prototype.getOracleAppId = function () {
        return this.getMarket()
            .getAsset()
            .getOracleAppId();
    };
    /**
     * Return staked amount
     *
     * @returns staked
     */
    StakingContract.prototype.getStaked = function () {
        return this.getMarket().getActiveCollateral();
    };
    /**
     * Return rewards program
     *
     * @returns rewards program
     */
    StakingContract.prototype.getRewardsProgram = function () {
        return this.getManager().getRewardsProgram();
    };
    /**
     * Return the staking contract storage address for given address or null if it does not exist
     *
     * @param address - address to get info for
     * @returns storage account address for user
     */
    StakingContract.prototype.getStorageAddress = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var storageAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getManager().getStorageAddress(address)];
                    case 1:
                        storageAddress = _a.sent();
                        return [2 /*return*/, storageAddress];
                }
            });
        });
    };
    /**
     * Return the staking contract local state for address
     *
     * @param address - address to get info for
     * @returns staking contract local state for address
     */
    StakingContract.prototype.getUserState = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var storageAddress, userState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getStorageAddress(address)];
                    case 1:
                        storageAddress = _a.sent();
                        if (!storageAddress) {
                            throw new Error("no storage address found");
                        }
                        return [4 /*yield*/, this.getStorageState(storageAddress)];
                    case 2:
                        userState = _a.sent();
                        return [2 /*return*/, userState];
                }
            });
        });
    };
    /**
     * Return the staking contract local state for storage address
     *
     * @param storageAddress -storage address to get info for
     * @returns staking contract local state for address
     */
    StakingContract.prototype.getStorageState = function (storageAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var result, _a, unrealizedRewards, secondaryUnrealizedRewards, userMarketState;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = {};
                        return [4 /*yield*/, this.getManager().getStorageUnrealizedRewards(storageAddress, [this.getMarket()])];
                    case 1:
                        _a = _b.sent(), unrealizedRewards = _a[0], secondaryUnrealizedRewards = _a[1];
                        result.unrealized_rewards = unrealizedRewards;
                        result.secondary_unrealized_rewards = secondaryUnrealizedRewards;
                        return [4 /*yield*/, this.getMarket().getStorageState(storageAddress)];
                    case 2:
                        userMarketState = _b.sent();
                        result.staked_bank = userMarketState.active_collateral_bank;
                        result.stake_underlying = userMarketState.active_collateral_underlying;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return StakingContract;
}());
exports.StakingContract = StakingContract;
