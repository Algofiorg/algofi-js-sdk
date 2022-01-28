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
exports.newAlgofiMainnetClient = exports.newAlgofiTestnetClient = exports.Client = void 0;
var algosdk_1 = require("algosdk");
var utils_1 = require("./utils");
var manager_1 = require("./manager");
var market_1 = require("./market");
var stakingContract_1 = require("./stakingContract");
var optin_1 = require("./optin");
var addCollateral_1 = require("./addCollateral");
var liquidate_1 = require("./liquidate");
var staking_1 = require("./staking");
var borrow_1 = require("./borrow");
var burn_1 = require("./burn");
var claimRewards_1 = require("./claimRewards");
var mint_1 = require("./mint");
var mintToCollateral_1 = require("./mintToCollateral");
var removeCollateralUnderlying_1 = require("./removeCollateralUnderlying");
var removeCollateral_1 = require("./removeCollateral");
var repayBorrow_1 = require("./repayBorrow");
var Client = /** @class */ (function () {
    function Client(algodClient, indexerClient, historicalIndexerClient, userAddress, chain) {
        // constants
        this.SCALE_FACTOR = 1e9;
        this.BORROW_SHARES_INIT = 1e3;
        this.PARAMETER_SCALE_FACTOR = 1e3;
        // clients info
        this.algod = algodClient;
        this.indexerClient = indexerClient;
        this.historicalIndexer = historicalIndexerClient;
        this.chain = chain;
        // user info
        this.userAddress = userAddress;
        this.initRound = (0, utils_1.getInitRound)(this.chain);
        this.activeOrderedSymbols = (0, utils_1.getOrderedSymbols)(this.chain);
        this.maxOrderedSymbols = (0, utils_1.getOrderedSymbols)(this.chain, true);
        this.maxAtomicOptInOrderedSymbols = (0, utils_1.getOrderedSymbols)(this.chain, undefined, true);
        // manager info
        this.manager = new manager_1.Manager(this.algod, (0, utils_1.getManagerAppId)(this.chain));
        // staking contract info
        this.stakingContractInfo = (0, utils_1.getStakingContracts)(this.chain);
        this.stakingContracts = {};
        for (var _i = 0, _a = Object.keys(this.stakingContractInfo); _i < _a.length; _i++) {
            var _name = _a[_i];
            //the keys are stbl and stbl-usdc-lp-v2
            this.stakingContracts[_name] = new stakingContract_1.StakingContract(this.algod, this.historicalIndexer, this.stakingContractInfo[_name]);
        }
    }
    Client.init = function (algodClient, indexerClient, historicalIndexerClient, userAddress, chain) {
        return __awaiter(this, void 0, void 0, function () {
            var client, _i, _a, symbol, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        client = new Client(algodClient, indexerClient, historicalIndexerClient, userAddress, chain);
                        client.markets = {};
                        _i = 0, _a = client.maxOrderedSymbols;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        symbol = _a[_i];
                        _b = client.markets;
                        _c = symbol;
                        return [4 /*yield*/, market_1.Market.init(algodClient, historicalIndexerClient, (0, utils_1.getMarketAppId)(client.chain, symbol))];
                    case 2:
                        _b[_c] = _d.sent();
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, client];
                }
            });
        });
    };
    Client.prototype.getDefaultParams = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.algod.getTransactionParams()["do"]()];
                    case 1:
                        params = _a.sent();
                        params.flatFee = true;
                        params.fee = 1000;
                        return [2 /*return*/, params];
                }
            });
        });
    };
    Client.prototype.getUserInfo = function (address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        if (!address) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.algod.accountInformation(address)["do"]()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: throw new Error("user_address has not been specified");
                }
            });
        });
    };
    Client.prototype.isOptedIntoApp = function (appId, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var userInfo, optedInIds, _i, _a, app;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        return [4 /*yield*/, this.getUserInfo(address)];
                    case 1:
                        userInfo = _b.sent();
                        optedInIds = [];
                        for (_i = 0, _a = userInfo["apps-local-state"]; _i < _a.length; _i++) {
                            app = _a[_i];
                            optedInIds.push(app["id"]);
                        }
                        return [2 /*return*/, optedInIds.includes(appId)];
                }
            });
        });
    };
    Client.prototype.isOptedIntoAsset = function (assetId, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var userInfo, assets, _i, _a, asset;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        return [4 /*yield*/, this.getUserInfo(address)];
                    case 1:
                        userInfo = _b.sent();
                        assets = [];
                        for (_i = 0, _a = userInfo["assets"]; _i < _a.length; _i++) {
                            asset = _a[_i];
                            assets.push(asset["asset-id"]);
                        }
                        return [2 /*return*/, assets.includes(assetId)];
                }
            });
        });
    };
    Client.prototype.getUserBalances = function (address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var userInfo, balances, _i, _a, asset;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        return [4 /*yield*/, this.getUserInfo(address)];
                    case 1:
                        userInfo = _b.sent();
                        balances = {};
                        for (_i = 0, _a = userInfo["assets"]; _i < _a.length; _i++) {
                            asset = _a[_i];
                            balances[asset["asset-id"]] = asset["amount"];
                        }
                        balances[1] = userInfo["amount"];
                        return [2 /*return*/, balances];
                }
            });
        });
    };
    Client.prototype.getUserBalance = function (assetId, address) {
        if (assetId === void 0) { assetId = 1; }
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var userBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        return [4 /*yield*/, this.getUserBalances(address)];
                    case 1:
                        userBalances = _a.sent();
                        return [2 /*return*/, (0, utils_1.get)(userBalances, assetId, 0)];
                }
            });
        });
    };
    Client.prototype.getUserState = function (address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var result, _a, _b, storageAddress, _i, _c, symbol, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        result = {};
                        if (!address) {
                            address = this.userAddress;
                        }
                        _a = result;
                        _b = "manager";
                        return [4 /*yield*/, this.manager.getUserState(address)];
                    case 1:
                        _a[_b] = _f.sent();
                        console.log(result["manager"]);
                        console.log("this ran");
                        return [4 /*yield*/, this.manager.getStorageAddress(address)];
                    case 2:
                        storageAddress = _f.sent();
                        _i = 0, _c = this.activeOrderedSymbols;
                        _f.label = 3;
                    case 3:
                        if (!(_i < _c.length)) return [3 /*break*/, 6];
                        symbol = _c[_i];
                        _d = result;
                        _e = symbol;
                        return [4 /*yield*/, this.markets[symbol].getStorageState(storageAddress)];
                    case 4:
                        _d[_e] = _f.sent();
                        _f.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, result];
                }
            });
        });
    };
    Client.prototype.getStorageState = function (storageAddress) {
        if (storageAddress === void 0) { storageAddress = null; }
        return __awaiter(this, void 0, void 0, function () {
            var result, _i, _a, symbol;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = {};
                        if (!!storageAddress) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.manager.getStorageAddress(this.userAddress)];
                    case 1:
                        storageAddress = _b.sent();
                        _b.label = 2;
                    case 2:
                        result["manager"] = this.manager.getStorageState(storageAddress);
                        for (_i = 0, _a = this.activeOrderedSymbols; _i < _a.length; _i++) {
                            symbol = _a[_i];
                            result[symbol] = this.markets[symbol].getStorageState(storageAddress);
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Client.prototype.getUserStakingContractState = function (stakingContractName, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        return [4 /*yield*/, this.stakingContracts[stakingContractName].getUserState(address)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // GETTERS
    Client.prototype.getManager = function () {
        return this.manager;
    };
    Client.prototype.getMarket = function (symbol) {
        return this.markets[symbol];
    };
    Client.prototype.getActiveMarkets = function () {
        var activeMarkets = {};
        for (var _i = 0, _a = Object.entries(this.markets); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (this.activeOrderedSymbols.includes(key)) {
                activeMarkets[key] = value;
            }
        }
        return activeMarkets;
    };
    Client.prototype.getStakingContract = function (_name) {
        return this.stakingContracts[_name];
    };
    Client.prototype.getStakingContracts = function () {
        return this.stakingContracts;
    };
    Client.prototype.getAsset = function (symbol) {
        if (!this.activeOrderedSymbols.includes(symbol)) {
            throw new Error("Unsupported asset");
        }
        return this.markets[symbol].getAsset();
    };
    Client.prototype.getMaxAtomicOptInMarketAppIds = function () {
        var MaxOptInMarketAppIds = [];
        for (var _i = 0, _a = this.maxAtomicOptInOrderedSymbols; _i < _a.length; _i++) {
            var symbol = _a[_i];
            MaxOptInMarketAppIds.push(this.markets[symbol].getMarketAppId());
        }
        return MaxOptInMarketAppIds;
    };
    Client.prototype.getActiveAssets = function () {
        var activeAssets = {};
        for (var _i = 0, _a = Object.entries(this.getActiveMarkets()); _i < _a.length; _i++) {
            var _b = _a[_i], symbol = _b[0], market = _b[1];
            activeAssets[symbol] = market.getAsset();
        }
        return activeAssets;
    };
    Client.prototype.getActiveAssetIds = function () {
        var activeAssetIds = [];
        for (var _i = 0, _a = Object.values(this.getActiveAssets()); _i < _a.length; _i++) {
            var asset = _a[_i];
            activeAssetIds.push(asset.getUnderlyingAssetId());
        }
        return activeAssetIds;
    };
    Client.prototype.getActiveBankAssetIds = function () {
        var activeBankAssetIds = [];
        for (var _i = 0, _a = Object.values(this.getActiveAssets()); _i < _a.length; _i++) {
            var asset = _a[_i];
            activeBankAssetIds.push(asset.getBankAssetId());
        }
        return activeBankAssetIds;
    };
    Client.prototype.getActiveOrderedSymbols = function () {
        return this.activeOrderedSymbols;
    };
    Client.prototype.getRawPrices = function () {
        //Errors will be fixed once we figure out getActiveMarkets
        var rawPrices = {};
        for (var _i = 0, _a = Object.entries(this.getActiveMarkets()); _i < _a.length; _i++) {
            var _b = _a[_i], symbol = _b[0], market = _b[1];
            rawPrices[symbol] = market.getAsset().getRawPrice();
        }
        return rawPrices;
    };
    Client.prototype.getPrices = function () {
        var prices = {};
        for (var _i = 0, _a = Object.entries(this.getActiveMarkets()); _i < _a.length; _i++) {
            var _b = _a[_i], symbol = _b[0], market = _b[1];
            prices[symbol] = market.getAsset().getPrice();
        }
        return prices;
    };
    // INDEXER HELPERS
    Client.prototype.getStorageAccounts = function (stakingContractName) {
        if (stakingContractName === void 0) { stakingContractName = null; }
        return __awaiter(this, void 0, void 0, function () {
            var nextPage, accounts, appId, accountData, _i, _a, account;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        nextPage = "";
                        accounts = [];
                        if (stakingContractName === null) {
                            appId = Object.values(this.getActiveMarkets())[0].getMarketAppId();
                        }
                        else {
                            appId = this.getStakingContract(stakingContractName).getManagerAppId();
                        }
                        _b.label = 1;
                    case 1:
                        if (!(nextPage !== null)) return [3 /*break*/, 3];
                        console.log(nextPage);
                        return [4 /*yield*/, this.indexerClient
                                .searchAccounts()
                                .applicationID(appId)
                                .nextToken(nextPage)["do"]()];
                    case 2:
                        accountData = _b.sent();
                        for (_i = 0, _a = accountData["accounts"]; _i < _a.length; _i++) {
                            account = _a[_i];
                            accounts.push(account);
                        }
                        if (accountData.includes("next-token")) {
                            nextPage = accountData["next-token"];
                        }
                        else {
                            nextPage = null;
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, accounts];
                }
            });
        });
    };
    Client.prototype.getActiveOracleAppIds = function () {
        var activeOracleAppIds = [];
        for (var _i = 0, _a = Object.values(this.getActiveMarkets()); _i < _a.length; _i++) {
            var market = _a[_i];
            activeOracleAppIds.push(market.getAsset().getOracleAppId());
        }
        return activeOracleAppIds;
    };
    Client.prototype.getActiveMarketAppIds = function () {
        var activeMarketAppIds = [];
        for (var _i = 0, _a = Object.values(this.getActiveMarkets()); _i < _a.length; _i++) {
            var market = _a[_i];
            activeMarketAppIds.push(market.getMarketAppId());
        }
        return activeMarketAppIds;
    };
    Client.prototype.getActiveMarketAddresses = function () {
        var activeMarketAddresses = [];
        for (var _i = 0, _a = Object.values(this.getActiveMarkets()); _i < _a.length; _i++) {
            var market = _a[_i];
            activeMarketAddresses.push(market.getMarketAddress());
        }
        return activeMarketAddresses;
    };
    //TRANSACTION BUILDERS
    Client.prototype.prepareOptinTransactions = function (storageAddress, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        _a = optin_1.prepareManagerAppOptinTransactions;
                        _b = [this.manager.getManagerAppId(),
                            this.getMaxAtomicOptInMarketAppIds(),
                            address,
                            storageAddress];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                }
            });
        });
    };
    Client.prototype.prepareAddCollateralTransactions = function (symbol, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        market = this.getMarket(symbol);
                        _a = addCollateral_1.prepareAddCollateralTransactions;
                        _b = [address];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(address)];
                    case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), amount,
                            market.getAsset().getBankAssetId(),
                            this.manager.getManagerAppId(),
                            market.getMarketAppId(),
                            market.getMarketAddress(),
                            this.getActiveMarketAppIds(),
                            this.getActiveOracleAppIds()]))];
                }
            });
        });
    };
    Client.prototype.prepareBorrowTransactions = function (symbol, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        market = this.getMarket(symbol);
                        _a = borrow_1.prepareBorrowTransactions;
                        _b = [address];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(address)];
                    case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), amount,
                            market.getAsset().getUnderlyingAssetId(),
                            this.manager.getManagerAppId(),
                            market.getMarketAppId(),
                            this.getActiveMarketAppIds(),
                            this.getActiveOracleAppIds()]))];
                }
            });
        });
    };
    Client.prototype.prepareBurnTransactions = function (symbol, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        market = this.getMarket(symbol);
                        _a = burn_1.prepareBurnTransactions;
                        _b = [address];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(address)];
                    case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), amount,
                            market.getAsset().getUnderlyingAssetId(),
                            market.getAsset().getBankAssetId(),
                            this.manager.getManagerAppId(),
                            market.getMarketAppId(),
                            market.getMarketAddress(),
                            this.getActiveMarketAppIds(),
                            this.getActiveOracleAppIds()]))];
                }
            });
        });
    };
    Client.prototype.prepareClaimRewardsTransactions = function (address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        _a = claimRewards_1.prepareClaimRewardsTransactions;
                        _b = [address];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(address)];
                    case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), this.manager.getManagerAppId(),
                            this.getActiveMarketAppIds(),
                            this.getActiveOracleAppIds(),
                            this.manager.getRewardsProgram().getRewardsAssetIds()]))];
                }
            });
        });
    };
    Client.prototype.prepareLiquidateTransactions = function (targetStorageAddress, borrowSymbol, amount, collateralSymbol, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var borrowMarket, collateralMarket, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        borrowMarket = this.getMarket(borrowSymbol);
                        collateralMarket = this.getMarket(collateralSymbol);
                        _a = liquidate_1.prepareLiquidateTransactions;
                        _b = [address];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(address)];
                    case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), targetStorageAddress,
                            amount,
                            this.manager.getManagerAppId(),
                            borrowMarket.getMarketAppId(),
                            borrowMarket.getMarketAddress(),
                            collateralMarket.getMarketAppId(),
                            this.getActiveMarketAppIds(),
                            this.getActiveOracleAppIds(),
                            collateralMarket.getAsset().getBankAssetId(),
                            borrowSymbol !== "ALGO" ? borrowMarket.getAsset().getUnderlyingAssetId() : undefined]))];
                }
            });
        });
    };
    Client.prototype.prepareMintTransactions = function (symbol, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        market = this.getMarket(symbol);
                        _a = mint_1.prepareMintTransactions;
                        _b = [address];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(address)];
                    case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), amount,
                            market.getAsset().getBankAssetId(),
                            this.manager.getManagerAppId(),
                            market.getMarketAppId(),
                            market.getMarketAddress(),
                            this.getActiveMarketAppIds(),
                            this.getActiveOracleAppIds(),
                            symbol !== "ALGO" ? market.getAsset().getUnderlyingAssetId() : undefined]))];
                }
            });
        });
    };
    Client.prototype.prepareMintToCollateralTransactions = function (symbol, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        market = this.getMarket(symbol);
                        _a = mintToCollateral_1.prepareMintToCollateralTransactions;
                        _b = [address];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(address)];
                    case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), amount,
                            this.manager.getManagerAppId(),
                            market.getMarketAppId(),
                            market.getMarketAddress(),
                            this.getActiveMarketAppIds(),
                            this.getActiveOracleAppIds(),
                            symbol !== "ALGO" ? market.getAsset().getUnderlyingAssetId() : undefined]))];
                }
            });
        });
    };
    Client.prototype.prepareRemoveCollateralTransactions = function (symbol, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        market = this.getMarket(symbol);
                        _a = removeCollateral_1.prepareRemoveCollateralTransactions;
                        _b = [address];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(address)];
                    case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), amount,
                            market.getAsset().getBankAssetId(),
                            this.manager.getManagerAppId(),
                            market.getMarketAppId(),
                            this.getActiveMarketAppIds(),
                            this.getActiveOracleAppIds()]))];
                }
            });
        });
    };
    Client.prototype.prepareRemoveCollateralUnderlyingTransactions = function (symbol, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        market = this.getMarket(symbol);
                        _a = removeCollateralUnderlying_1.prepareRemoveCollateralUnderlyingTransactions;
                        _b = [address];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(address)];
                    case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), amount,
                            market.getAsset().getUnderlyingAssetId(),
                            this.manager.getManagerAppId(),
                            market.getMarketAppId(),
                            this.getActiveMarketAppIds(),
                            this.getActiveOracleAppIds()]))];
                }
            });
        });
    };
    Client.prototype.prepareRepayBorrowTransactions = function (symbol, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        market = this.getMarket(symbol);
                        _a = repayBorrow_1.prepareRepayBorrowTransactions;
                        _b = [address];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(address)];
                    case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), amount,
                            this.manager.getManagerAppId(),
                            market.getMarketAppId(),
                            market.getMarketAddress(),
                            this.getActiveMarketAppIds(),
                            this.getActiveOracleAppIds(),
                            symbol !== "ALGO" ? market.getAsset().getUnderlyingAssetId() : undefined]))];
                }
            });
        });
    };
    //Staking transactions builders
    Client.prototype.prepareStakingContractOptinTransactions = function (stakingContractName, storageAddress, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var stakingContract, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        stakingContract = this.getStakingContract(stakingContractName);
                        _a = optin_1.prepareManagerAppOptinTransactions;
                        _b = [stakingContract.getManagerAppId(),
                            [stakingContract.getMarketAppId()],
                            address,
                            storageAddress];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                }
            });
        });
    };
    Client.prototype.prepareStakeTransactions = function (stakingContractName, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var stakingContract, assetId, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        stakingContract = this.getStakingContract(stakingContractName);
                        assetId = stakingContract.getAsset().getUnderlyingAssetId();
                        _a = staking_1.prepareStakeTransactions;
                        _b = [address];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, stakingContract.getStorageAddress(address)];
                    case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), amount,
                            stakingContract.getManagerAppId(),
                            stakingContract.getMarketAppId(),
                            stakingContract.getMarketAddress(),
                            stakingContract.getOracleAppId(),
                            assetId > 1 ? assetId : undefined]))];
                }
            });
        });
    };
    Client.prototype.prepareUnstakeTransactions = function (stakingContractName, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var stakingContract, assetId, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        stakingContract = this.getStakingContract(stakingContractName);
                        assetId = stakingContract.getAsset().getUnderlyingAssetId();
                        _a = staking_1.prepareUnstakeTransactions;
                        _b = [address];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, stakingContract.getStorageAddress(address)];
                    case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), amount,
                            stakingContract.getManagerAppId(),
                            stakingContract.getMarketAppId(),
                            stakingContract.getOracleAppId(),
                            assetId > 1 ? assetId : undefined]))];
                }
            });
        });
    };
    Client.prototype.prepareClaimStakingRewardsTransactions = function (stakingContractName, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var stakingContract, assetId, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!address) {
                            address = this.userAddress;
                        }
                        stakingContract = this.getStakingContract(stakingContractName);
                        assetId = stakingContract.getAsset().getUnderlyingAssetId();
                        _a = staking_1.prepareClaimStakingRewardsTransactions;
                        _b = [address];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, stakingContract.getStorageAddress(address)];
                    case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), stakingContract.getManagerAppId(),
                            stakingContract.getMarketAppId(),
                            stakingContract.getOracleAppId(),
                            stakingContract.getRewardsProgram().getRewardsAssetIds()]))];
                }
            });
        });
    };
    Client.prototype.submit = function (transactionGroup, wait) {
        if (wait === void 0) { wait = false; }
        return __awaiter(this, void 0, void 0, function () {
            var txid, AlgodHTTPError_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.algod.sendRawTransaction(transactionGroup)["do"]()];
                    case 1:
                        txid = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        AlgodHTTPError_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3:
                        if (wait) {
                            //not sure about wait rounds (last parameter)
                            return [2 /*return*/, (0, algosdk_1.waitForConfirmation)(this.algod, txid, 10)];
                        }
                        return [2 /*return*/, { "txid": txid }];
                }
            });
        });
    };
    return Client;
}());
exports.Client = Client;
function newAlgofiTestnetClient(algodClient, indexerClient, userAddress) {
    if (algodClient === void 0) { algodClient = null; }
    if (indexerClient === void 0) { indexerClient = null; }
    if (userAddress === void 0) { userAddress = null; }
    return __awaiter(this, void 0, void 0, function () {
        var historicalIndexerClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    historicalIndexerClient = new algosdk_1.Indexer("", "https://indexer.testnet.algoexplorerapi.io/", "");
                    if (algodClient === null) {
                        algodClient = new algosdk_1.Algodv2("", "https://api.testnet.algoexplorer.io", "");
                    }
                    if (indexerClient === null) {
                        indexerClient = new algosdk_1.Indexer("", "https://algoindexer.testnet.algoexplorerapi.io/", "");
                    }
                    return [4 /*yield*/, Client.init(algodClient, indexerClient, historicalIndexerClient, userAddress, "testnet")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.newAlgofiTestnetClient = newAlgofiTestnetClient;
function newAlgofiMainnetClient(algodClient, indexerClient, userAddress) {
    if (algodClient === void 0) { algodClient = null; }
    if (indexerClient === void 0) { indexerClient = null; }
    if (userAddress === void 0) { userAddress = null; }
    return __awaiter(this, void 0, void 0, function () {
        var historicalIndexerClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    historicalIndexerClient = new algosdk_1.Indexer("", "https://indexer.algoexplorerapi.io/", "");
                    if (algodClient === null) {
                        algodClient = new algosdk_1.Algodv2("", "https://algoexplorerapi.io", "");
                    }
                    if (indexerClient === null) {
                        indexerClient = new algosdk_1.Indexer("", "https://algoindexer.algoexplorerapi.io", "");
                    }
                    return [4 /*yield*/, Client.init(algodClient, indexerClient, historicalIndexerClient, userAddress, "mainnet")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.newAlgofiMainnetClient = newAlgofiMainnetClient;
