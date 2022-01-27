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
exports.AlgofiMainnetClient = exports.AlgofiTestnetClient = exports.Client = void 0;
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
        // console.log("CONSTRUCTOR IN CLIENT.TS\n")
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
                    case 0:
                        console.log("GET DEFAULT PARAMS IN CLIENT.TS\n");
                        return [4 /*yield*/, this.algod.getTransactionParams()["do"]()];
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("GET USER INFO IN CLIENT.TS\n");
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var userInfo, appsLocalState, _i, _a, x;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("IS OPTED INTO APP IN CLIENT.TS\n");
                        if (!address) {
                            address = this.userAddress;
                        }
                        return [4 /*yield*/, this.getUserInfo(address)];
                    case 1:
                        userInfo = _b.sent();
                        appsLocalState = [];
                        for (_i = 0, _a = userInfo["apps-local-state"]; _i < _a.length; _i++) {
                            x = _a[_i];
                            appsLocalState.push(x["id"]);
                        }
                        return [2 /*return*/, appsLocalState.includes(appId)];
                }
            });
        });
    };
    Client.prototype.isOptedIntoAsset = function (assetId, address) {
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var userInfo, assets, _i, _a, x;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("IS OPTED INTO ASSET IN CLIENT.TS\n");
                        if (!address) {
                            address = this.userAddress;
                        }
                        return [4 /*yield*/, this.getUserInfo(address)];
                    case 1:
                        userInfo = _b.sent();
                        assets = [];
                        for (_i = 0, _a = userInfo["assets"]; _i < _a.length; _i++) {
                            x = _a[_i];
                            assets.push(x["asset-id"]);
                        }
                        return [2 /*return*/, assets.includes(assetId)];
                }
            });
        });
    };
    Client.prototype.getUserBalances = function (address) {
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var userInfo, balances, _i, _a, asset;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("GET USER BALANCES IN CLIENT.TS\n");
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var userBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("GET USER BALANCE IN CLIENT.TS\n");
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var result, _a, _b, storageAddress, symbol;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("GET USER STATE IN CLIENT.TS\n");
                        result = {};
                        if (!address) {
                            //This is skipped
                            address = this.userAddress;
                        }
                        _a = result;
                        _b = "manager";
                        return [4 /*yield*/, this.manager.getUserState(address)];
                    case 1:
                        _a[_b] = _c.sent();
                        return [4 /*yield*/, this.manager.getStorageAddress(address)];
                    case 2:
                        storageAddress = _c.sent();
                        for (symbol in this.activeOrderedSymbols) {
                            result[symbol] = this.markets[symbol].getStorageState(storageAddress);
                        }
                        console.log("get user state in client.ts finished and returned", result, "\n");
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Client.prototype.getStorageState = function (storageAddress) {
        if (storageAddress === void 0) { storageAddress = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var result, _i, _a, symbol;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("GET STORAGE STATE IN CLIENT.TS\n");
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                console.log("GET USER STAKING CONTRACT STATE IN CLIENT.TS\n");
                result = {};
                if (!address) {
                    address = this.userAddress;
                }
                return [2 /*return*/, this.stakingContracts[stakingContractName].getUserState(address)];
            });
        });
    };
    // GETTERS
    Client.prototype.getManager = function () {
        console.log("GET MANAGER IN CLIENT.TS\n");
        return this.manager;
    };
    Client.prototype.getMarket = function (symbol) {
        console.log("GET MARKET IN CLIENT.TS\n");
        console.log("get market in client.ts finished and returned", this.markets[symbol], "\n");
        return this.markets[symbol];
    };
    Client.prototype.getActiveMarkets = function () {
        console.log("GET ACTIVE MARKETS IN CLIENT.TS\n");
        var temp = {};
        for (var _i = 0, _a = Object.entries(this.markets); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (this.activeOrderedSymbols.includes(key)) {
                temp[key] = value;
            }
        }
        return temp;
    };
    Client.prototype.getStakingContract = function (nam) {
        console.log("GET STAKING CONTRACT IN CLIENT.TS\n");
        return this.stakingContracts[nam];
    };
    Client.prototype.getStakingContracts = function () {
        console.log("GET STAKING CONTRACTS IN CLIENT.TS\n");
        return this.stakingContracts;
    };
    Client.prototype.getAsset = function (symbol) {
        console.log("GET ASSET IN CLIENT.TS\n");
        if (!this.activeOrderedSymbols.includes(symbol)) {
            throw new Error("Unsupported asset");
        }
        return this.markets[symbol].getAsset();
    };
    Client.prototype.getMaxAtomicOptInMarketAppIds = function () {
        console.log("GET MAX ATOMIC OPT IN MARKET APP IDS IN CLIENT.TS\n");
        var temp = [];
        for (var _i = 0, _a = this.maxAtomicOptInOrderedSymbols; _i < _a.length; _i++) {
            var symbol = _a[_i];
            temp.push(this.markets[symbol].getMarketAppId());
        }
        return temp;
    };
    Client.prototype.getActiveAssets = function () {
        console.log("GET ACTIVE ASSETS IN CLIENT.TS\n");
        var temp = {};
        for (var _i = 0, _a = Object.entries(this.getActiveMarkets()); _i < _a.length; _i++) {
            var _b = _a[_i], symbol = _b[0], market = _b[1];
            temp[symbol] = market.getAsset();
        }
        return temp;
    };
    Client.prototype.getActiveAssetIds = function () {
        console.log("GET ACTIVE ASSET IDS IN CLIENT.TS\n");
        var temp = [];
        for (var _i = 0, _a = Object.values(this.getActiveAssets()); _i < _a.length; _i++) {
            var asset = _a[_i];
            temp.push(asset.getUnderlyingAssetId());
        }
        return temp;
    };
    Client.prototype.getActiveBankAssetIds = function () {
        console.log("GET ACTIVE BANK ASSET IDS IN CLIENT.TS\n");
        var temp = [];
        for (var _i = 0, _a = Object.values(this.getActiveAssets()); _i < _a.length; _i++) {
            var asset = _a[_i];
            temp.push(asset.getBankAssetId());
        }
        return temp;
    };
    Client.prototype.getActiveOrderedSymbols = function () {
        console.log("GET ACTIVE ORDERED SYMBOLS IN CLIENT.TS\n");
        return this.activeOrderedSymbols;
    };
    Client.prototype.getRawPrices = function () {
        console.log("GET RAW PRICES IN CLIENT.TS\n");
        //Errors will be fixed once we figure out getActiveMarkets
        var temp = {};
        for (var _i = 0, _a = Object.entries(this.getActiveMarkets()); _i < _a.length; _i++) {
            var _b = _a[_i], symbol = _b[0], market = _b[1];
            temp[symbol] = market.getAsset().getRawPrices();
        }
    };
    Client.prototype.getPrices = function () {
        console.log("GET PRICES IN CLIENT.TS\n");
        var temp = {};
        //Errors will be fixed once we figure out getActiveMarkets
        for (var _i = 0, _a = Object.entries(this.getActiveMarkets()); _i < _a.length; _i++) {
            var _b = _a[_i], symbol = _b[0], market = _b[1];
            temp[symbol] = market.getAsset().getPrice();
        }
    };
    // INDEXER HELPERS
    Client.prototype.getStorageAccounts = function (stakingContractName) {
        if (stakingContractName === void 0) { stakingContractName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var nextPage, accounts, appId, accountData, _i, _a, account;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("GET STORAGE ACCOUNTS IN CLIENT.TS\n");
                        nextPage = "";
                        accounts = [];
                        if (stakingContractName === undefined) {
                            // This error will be fixed when we figure out getActiveMarkets
                            appId = Object.values(this.getActiveMarkets())[0];
                        }
                        else {
                            appId = this.getStakingContract(stakingContractName).getManagerAppId();
                        }
                        _b.label = 1;
                    case 1:
                        if (!(nextPage !== undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.indexerClient.searchAccounts()["do"]()];
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
                            nextPage = undefined;
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, accounts];
                }
            });
        });
    };
    Client.prototype.getActiveOracleAppIds = function () {
        console.log("GET ACTIVE ORACLE APP IDS IN CLIENT.TS\n");
        var temp = [];
        for (var _i = 0, _a = Object.values(this.getActiveMarkets()); _i < _a.length; _i++) {
            var market = _a[_i];
            temp.push(market.getAsset().getOracleAppId());
        }
        return temp;
    };
    Client.prototype.getActiveMarketAppIds = function () {
        console.log("GET ACTIVE MARKET IDS IN CLIENT.TS\n");
        var temp = [];
        for (var _i = 0, _a = Object.values(this.getActiveMarkets()); _i < _a.length; _i++) {
            var market = _a[_i];
            temp.push(market.getMarketAppId());
        }
        return temp;
    };
    Client.prototype.getActiveMarketAddresses = function () {
        console.log("GET ACTIVE MARKET ADDRESSES IN CLIENT.TS\n");
        var temp = [];
        for (var _i = 0, _a = Object.values(this.getActiveMarkets()); _i < _a.length; _i++) {
            var market = _a[_i];
            temp.push(market.getMarketAddress());
        }
        return temp;
    };
    //TRANSACTION BUILDERS
    Client.prototype.prepareOptinTransactions = function (storageAddress, address) {
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("PREPARE OPT IN TRANSACTIONS IN CLIENT.TS\n");
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("PREPARE ADD COLLATERAL TRANSACTIONS IN CLIENT.TS\n");
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("PREPARE BORROW TRANSACTIONS IN CLIENT.TS\n");
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("PREPARE BURN TRANSACTIONS IN CLIENT.TS\n");
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("PREPARE CLAIM REWARDS TRANSACTIONS IN CLIENT.TS\n");
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var borrowMarket, collateralMarket, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("PREPARE LIQUIDATE TRANSACTIONS IN CLIENT.TS\n");
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("PREPARE MINT TRANSACTIONS IN CLIENT.TS\n");
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("PREPARE MINT TO COLLATERAL TRANSACTIONS IN CLIENT.TS\n");
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("PREPARE REMOVE COLLATERAL TRANSACTIONS IN CLIENT.TS\n");
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
                            market.getAsset().bankAssetId(),
                            this.manager.getManagerAppId(),
                            market.getMarketAppId(),
                            this.getActiveMarketAppIds(),
                            this.getActiveOracleAppIds()]))];
                }
            });
        });
    };
    Client.prototype.prepareRemoveCollateralUnderlyingTransactions = function (symbol, amount, address) {
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("PREPARE REMOVE COLLATERAL UNDERLYING TRANSACTIONS IN CLIENT.TS\n");
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("PREPARE REPAY BORROW TRANSACTIONS IN CLIENT.TS\n");
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var stakingContract, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("PREPARE STAKING CONTRACT OPT IN TRANSACTIONS IN CLIENT.TS\n");
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var stakingContract, assetId, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("PREPARE STAKE TRANSACTIONS IN CLIENT.TS\n");
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var stakingContract, assetId, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("PREPARE UNSTAKE TRANSACTIONS IN CLIENT.TS\n");
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
        if (address === void 0) { address = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var stakingContract, assetId, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("PREPARE CLAIM STAKING REWARDS TRANSACTIONS IN CLIENT.TS\n");
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
            var txid, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("SUBMIT IN CLIENT.TS\n");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.algod.sendRawTransaction(transactionGroup)["do"]()];
                    case 2:
                        txid = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log("Error in submitting");
                        return [3 /*break*/, 4];
                    case 4:
                        if (wait) {
                            //not sure about wait rounds (last parameter)
                            return [2 /*return*/, (0, algosdk_1.waitForConfirmation)(this.algod, txid, 10)];
                        }
                        return [2 /*return*/, { txid: txid }];
                }
            });
        });
    };
    return Client;
}());
exports.Client = Client;
function AlgofiTestnetClient(algodClient, indexerClient, userAddress) {
    if (indexerClient === void 0) { indexerClient = undefined; }
    if (userAddress === void 0) { userAddress = undefined; }
    return __awaiter(this, void 0, void 0, function () {
        var historicalIndexerClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("INSTANTIATING TESTNET CLIENT IN CLIENT.TS\n");
                    historicalIndexerClient = new algosdk_1.Indexer("", "https://indexer.testnet.algoexplorerapi.io/", "");
                    if (algodClient === undefined) {
                        algodClient = new algosdk_1.Algodv2("ad4c18357393cb79f6ddef80b1c03ca99266ec99d55dff51b31811143f8b2dff", "https://node.chainvault.io/test", "");
                    }
                    if (indexerClient === undefined) {
                        indexerClient = new algosdk_1.Indexer("", "https://algoindexer.testnet.algoexplorerapi.io/");
                    }
                    return [4 /*yield*/, Client.init(algodClient, indexerClient, historicalIndexerClient, userAddress, "testnet")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.AlgofiTestnetClient = AlgofiTestnetClient;
function AlgofiMainnetClient(algodClient, indexerClient, userAddress) {
    if (indexerClient === void 0) { indexerClient = undefined; }
    if (userAddress === void 0) { userAddress = undefined; }
    return __awaiter(this, void 0, void 0, function () {
        var historicalIndexerClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("INSTANTIATING MAINNET CLIENT IN CLIENT.TS\n");
                    historicalIndexerClient = new algosdk_1.Indexer("", "https://indexer.algoexplorerapi.io/", "");
                    if (algodClient === undefined) {
                        algodClient = new algosdk_1.Algodv2("", "https://algoexplorerapi.io");
                    }
                    if (indexerClient === undefined) {
                        indexerClient = new algosdk_1.Indexer("", "https://algoindexer.algoexplorerapi.io", 8980, { "User-Agent": "algosdk" });
                    }
                    return [4 /*yield*/, Client.init(algodClient, indexerClient, historicalIndexerClient, userAddress, "mainnet")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.AlgofiMainnetClient = AlgofiMainnetClient;
