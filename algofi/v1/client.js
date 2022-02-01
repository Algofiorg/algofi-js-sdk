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
var utils_1 = require("../utils");
var staking_1 = require("./staking");
var removeCollateralUnderlying_1 = require("./removeCollateralUnderlying");
var mintToCollateral_1 = require("./mintToCollateral");
var removeCollateral_1 = require("./removeCollateral");
var addCollateral_1 = require("./addCollateral");
var claimRewards_1 = require("./claimRewards");
var repayBorrow_1 = require("./repayBorrow");
var optin_1 = require("./optin");
var liquidate_1 = require("./liquidate");
var borrow_1 = require("./borrow");
var stakingContract_1 = require("./stakingContract");
var burn_1 = require("./burn");
var mint_1 = require("./mint");
var manager_1 = require("./manager");
var market_1 = require("./market");
var Client = /** @class */ (function () {
    /**
     *
     * This is the constructor for the Client class.
     *
     * **Note, do not call this to create a new client**. Instead call
     * the static method init as there are asynchronous set up steps in
     * creating an client and a constructor can only return an instance of
     * the class and not a promise.
     *
     * #### Example
     * ```typescript
     * //Correct way to instantiate new client
     * const client = await Client.init(algodClient, indexerClient, historicalIndexerClient, userAddress, chain)
     *
     * //Incorrect way to instantiate new client
     * const client = new Client(algodClient, indexerClient, historicalIndexerClient, userAddress, chain)
     * ```
     *
     * @param algodClient - algod client
     * @param indexerClient - indexer client
     * @param historicalIndexerClient - indexer client
     * @param userAddress - account address of user
     * @param chain - specified chain we want the client to run on
     */
    function Client(algodClient, indexerClient, historicalIndexerClient, userAddress, chain) {
        this.scaleFactor = 1e9;
        this.borrowSharesInit = 1e3;
        this.parameterScaleFactor = 1e3;
        this.algod = algodClient;
        this.indexerClient = indexerClient;
        this.historicalIndexer = historicalIndexerClient;
        this.chain = chain;
        this.userAddress = userAddress;
        this.initRound = (0, utils_1.getInitRound)(this.chain);
        this.activeOrderedSymbols = (0, utils_1.getOrderedSymbols)(this.chain);
        this.maxOrderedSymbols = (0, utils_1.getOrderedSymbols)(this.chain, true);
        this.maxAtomicOptInOrderedSymbols = (0, utils_1.getOrderedSymbols)(this.chain, undefined, true);
        this.stakingContractInfo = (0, utils_1.getStakingContracts)(this.chain);
    }
    /**
     * This is the function that should be called when creating a new client.
     * You pass everything you would to the constructor, but to this function
     * instead and this returns the new and created client.
     *
     * #### Example
     * ```typescript
     * //Correct way to instantiate new client
     * const client = await Client.init(algodClient, indexerClient, historicalIndexerClient, userAddress, chain)
     *
     * //Incorrect way to instantiate new client
     * const client = new Client(algodClient, indexerClient, historicalIndexerClient, userAddress, chain)
     * ```
     *
     * @param algodClient - algod client
     * @param indexerClient - indexer client
     * @param historicalIndexerClient - indexer client
     * @param userAddress - account address of user
     * @param chain - specified chain we want the client to run on
     * @returns an instance of the client class fully constructed
     */
    Client.init = function (algodClient, indexerClient, historicalIndexerClient, userAddress, chain) {
        return __awaiter(this, void 0, void 0, function () {
            var client, _i, _a, symbol, _b, _c, _d, _e, title, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        client = new Client(algodClient, indexerClient, historicalIndexerClient, userAddress, chain);
                        client.markets = {};
                        _i = 0, _a = client.maxOrderedSymbols;
                        _j.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        symbol = _a[_i];
                        _b = client.markets;
                        _c = symbol;
                        return [4 /*yield*/, market_1.Market.init(algodClient, historicalIndexerClient, (0, utils_1.getMarketAppId)(client.chain, symbol))];
                    case 2:
                        _b[_c] = _j.sent();
                        _j.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        client.stakingContracts = {};
                        _d = 0, _e = Object.keys(client.stakingContractInfo);
                        _j.label = 5;
                    case 5:
                        if (!(_d < _e.length)) return [3 /*break*/, 8];
                        title = _e[_d];
                        _f = client.stakingContracts;
                        _g = title;
                        return [4 /*yield*/, stakingContract_1.StakingContract.init(client.algod, client.historicalIndexer, client.stakingContractInfo[title])];
                    case 6:
                        _f[_g] = _j.sent();
                        _j.label = 7;
                    case 7:
                        _d++;
                        return [3 /*break*/, 5];
                    case 8:
                        _h = client;
                        return [4 /*yield*/, manager_1.Manager.init(client.algod, (0, utils_1.getManagerAppId)(client.chain))];
                    case 9:
                        _h.manager = _j.sent();
                        return [2 /*return*/, client];
                }
            });
        });
    };
    /**
     * Initializes the transactions parameters for the client.
     *
     * @returns default parameters for transactions
     */
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
    /**
     * Returns a dictionary of information about the user.
     *
     * @param address - address to get info for
     * @returns a dictionary of information about the user
     */
    Client.prototype.getUserInfo = function (address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, userInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        return [4 /*yield*/, this.algod.accountInformation(addr)["do"]()];
                    case 1:
                        userInfo = _a.sent();
                        return [2 /*return*/, userInfo];
                }
            });
        });
    };
    /**
     * Returns a boolean if the user address is opted into an application with id appId.
     *
     * @param appId - id of the application
     * @param address - address to get information for
     * @returns boolean if user is opted into application with id appId
     */
    Client.prototype.isOptedIntoApp = function (appId, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, userInfo, optedInIds, _i, _a, app;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        return [4 /*yield*/, this.getUserInfo(addr)];
                    case 1:
                        userInfo = _b.sent();
                        optedInIds = [];
                        for (_i = 0, _a = userInfo["apps-local-state"]; _i < _a.length; _i++) {
                            app = _a[_i];
                            optedInIds.push(app.id);
                        }
                        return [2 /*return*/, optedInIds.includes(appId)];
                }
            });
        });
    };
    /**
     * Returns a boolean if the user is opted into an asset with id assetId.
     *
     * @param assetId - id of the asset
     * @param address - address to get info for
     * @returns boolean if user is opted into an asset
     */
    Client.prototype.isOptedIntoAsset = function (assetId, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, userInfo, assets, _i, _a, asset;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        return [4 /*yield*/, this.getUserInfo(addr)];
                    case 1:
                        userInfo = _b.sent();
                        assets = [];
                        for (_i = 0, _a = userInfo.assets; _i < _a.length; _i++) {
                            asset = _a[_i];
                            assets.push(asset["asset-id"]);
                        }
                        return [2 /*return*/, assets.includes(assetId)];
                }
            });
        });
    };
    /**
     * Returns a dictionary of user balances by assetid.
     *
     * @param address - address to get info for
     * @returns amount of asset
     */
    Client.prototype.getUserBalances = function (address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, userInfo, balances, _i, _a, asset;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        return [4 /*yield*/, this.getUserInfo(addr)];
                    case 1:
                        userInfo = _b.sent();
                        balances = {};
                        for (_i = 0, _a = userInfo.assets; _i < _a.length; _i++) {
                            asset = _a[_i];
                            balances[asset["asset-id"]] = asset.amount;
                        }
                        balances[1] = userInfo.amount;
                        return [2 /*return*/, balances];
                }
            });
        });
    };
    /**
     * Returns amount of asset in user's balance with asset id assetId.
     *
     * @param assetId - id of the asset,
     * @param address - address to get info for
     * @returns amount of asset that the user has
     */
    Client.prototype.getUserBalance = function (assetId, address) {
        if (assetId === void 0) { assetId = 1; }
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, userBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        return [4 /*yield*/, this.getUserBalances(addr)];
                    case 1:
                        userBalances = _a.sent();
                        return [2 /*return*/, (0, utils_1.get)(userBalances, assetId, 0)];
                }
            });
        });
    };
    /**
     * Returns a dictionary with the lending market state for a given address (must be opted in).
     *
     * @param address - address to get info for; if null, will use address supplied when creating client
     * @returns dictionary that represents the state of user
     */
    Client.prototype.getUserState = function (address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, result, _a, storageAddress, _i, _b, symbol, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        addr = address;
                        result = {};
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        _a = result;
                        return [4 /*yield*/, this.manager.getUserState(addr)];
                    case 1:
                        _a.manager = _e.sent();
                        return [4 /*yield*/, this.manager.getStorageAddress(addr)];
                    case 2:
                        storageAddress = _e.sent();
                        _i = 0, _b = this.activeOrderedSymbols;
                        _e.label = 3;
                    case 3:
                        if (!(_i < _b.length)) return [3 /*break*/, 6];
                        symbol = _b[_i];
                        _c = result;
                        _d = symbol;
                        return [4 /*yield*/, this.markets[symbol].getStorageState(storageAddress)];
                    case 4:
                        _c[_d] = _e.sent();
                        _e.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Returns a dictionary witht he lending market state for a given storage address.
     *
     * @param storageAddress - address to get info for; if null will use address supplied when creating client
     * @returns dictionary that represents the storage state of a user
     */
    Client.prototype.getStorageState = function (storageAddress) {
        if (storageAddress === void 0) { storageAddress = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, result, _i, _a, symbol;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        addr = storageAddress;
                        result = {};
                        if (!!addr) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.manager.getStorageAddress(this.userAddress)];
                    case 1:
                        addr = _b.sent();
                        _b.label = 2;
                    case 2:
                        result.manager = this.manager.getStorageState(addr);
                        for (_i = 0, _a = this.activeOrderedSymbols; _i < _a.length; _i++) {
                            symbol = _a[_i];
                            result[symbol] = this.markets[symbol].getStorageState(addr);
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Returns a dictionary with the staking contract state for the named staking contract and selected address
     *
     * @param stakingContractName - name of the staking contract to query
     * @param address - address to get info for; if null will use address supplied when creating client
     * @returns state representing staking contract info of user
     */
    Client.prototype.getUserStakingContractState = function (stakingContractName, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, userState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        return [4 /*yield*/, this.stakingContracts[stakingContractName].getUserState(addr)];
                    case 1:
                        userState = _a.sent();
                        return [2 /*return*/, userState];
                }
            });
        });
    };
    // GETTERS
    /**
     * Returns the manager object representing the manager of this client.
     *
     * @returns manager
     */
    Client.prototype.getManager = function () {
        return this.manager;
    };
    /**
     * Returns the market object for the given symbol.
     *
     * @param symbol - market symbol
     * @returns market
     */
    Client.prototype.getMarket = function (symbol) {
        return this.markets[symbol];
    };
    /**
     * Returns a dictionary of active markets by symbol
     *
     * @returns markets dictionary
     */
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
    /**
     * Returns a staking contract with the given title
     *
     * @param title - staking contract name
     * @returns staking contract with the given name
     */
    Client.prototype.getStakingContract = function (title) {
        return this.stakingContracts[title];
    };
    /**
     * Returns a ditionary of all staking contracts
     *
     * @returns staking contracts dictionary
     */
    Client.prototype.getStakingContracts = function () {
        return this.stakingContracts;
    };
    /**
     * Returns the asset object for the requested symbol
     *
     * @param symbol - symbol of the asset
     * @returns asset object with the provided symbol
     */
    Client.prototype.getAsset = function (symbol) {
        if (!this.activeOrderedSymbols.includes(symbol)) {
            throw new Error("Unsupported asset");
        }
        return this.markets[symbol].getAsset();
    };
    /**
     * Returns the max opt in market application ids
     *
     * @returns list of max opt in market application ids
     */
    Client.prototype.getMaxAtomicOptInMarketAppIds = function () {
        var maxOptInMarketAppIds = [];
        for (var _i = 0, _a = this.maxAtomicOptInOrderedSymbols; _i < _a.length; _i++) {
            var symbol = _a[_i];
            maxOptInMarketAppIds.push(this.markets[symbol].getMarketAppId());
        }
        return maxOptInMarketAppIds;
    };
    /**
     * Returns a dictionary of the asset objects for each active market
     *
     * @returns dictionary of asset objects
     */
    Client.prototype.getActiveAssets = function () {
        var activeAssets = {};
        for (var _i = 0, _a = Object.entries(this.getActiveMarkets()); _i < _a.length; _i++) {
            var _b = _a[_i], symbol = _b[0], market = _b[1];
            activeAssets[symbol] = market.getAsset();
        }
        return activeAssets;
    };
    /**
     * Returns the active asset ids
     *
     * @returns list of active asset ids
     */
    Client.prototype.getActiveAssetIds = function () {
        var activeAssetIds = [];
        for (var _i = 0, _a = Object.values(this.getActiveAssets()); _i < _a.length; _i++) {
            var asset = _a[_i];
            activeAssetIds.push(asset.getUnderlyingAssetId());
        }
        return activeAssetIds;
    };
    /**
     * Returns the active bank asset ids
     *
     * @returns list of active bank asset ids
     */
    Client.prototype.getActiveBankAssetIds = function () {
        var activeBankAssetIds = [];
        for (var _i = 0, _a = Object.values(this.getActiveAssets()); _i < _a.length; _i++) {
            var asset = _a[_i];
            activeBankAssetIds.push(asset.getBankAssetId());
        }
        return activeBankAssetIds;
    };
    /**
     * Returns the list of symbols of the active assets
     *
     * @returns list of symbols for active assets
     */
    Client.prototype.getActiveOrderedSymbols = function () {
        return this.activeOrderedSymbols;
    };
    /**
     * Returns a dictionary of raw oracle prices of the active assets pulled from their oracles
     *
     * @returns dictionary of int prices
     */
    Client.prototype.getRawPrices = function () {
        var rawPrices = {};
        for (var _i = 0, _a = Object.entries(this.getActiveMarkets()); _i < _a.length; _i++) {
            var _b = _a[_i], symbol = _b[0], market = _b[1];
            rawPrices[symbol] = market.getAsset().getRawPrice();
        }
        return rawPrices;
    };
    /**
     * Returns a dictionary of dollarized float prices of the assets pulled from their oracles
     *
     * @returns dictionary of int prices
     */
    Client.prototype.getPrices = function () {
        var prices = {};
        for (var _i = 0, _a = Object.entries(this.getActiveMarkets()); _i < _a.length; _i++) {
            var _b = _a[_i], symbol = _b[0], market = _b[1];
            prices[symbol] = market.getAsset().getPrice();
        }
        return prices;
    };
    /**
     * Returns a list of storage accounts for the given manager app id
     *
     * @param stakingContractName - name of staking contract
     * @returns list of storage accounts
     */
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
                        for (_i = 0, _a = accountData.accounts; _i < _a.length; _i++) {
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
    /**
     * Returns the list of active oracle app ids
     *
     * @returns list of acdtive oracle app ids
     */
    Client.prototype.getActiveOracleAppIds = function () {
        var activeOracleAppIds = [];
        for (var _i = 0, _a = Object.values(this.getActiveMarkets()); _i < _a.length; _i++) {
            var market = _a[_i];
            activeOracleAppIds.push(market.getAsset().getOracleAppId());
        }
        return activeOracleAppIds;
    };
    /**
     * Returns the list of the active market app ids
     *
     * @returns list of active market app ids
     */
    Client.prototype.getActiveMarketAppIds = function () {
        var activeMarketAppIds = [];
        for (var _i = 0, _a = Object.values(this.getActiveMarkets()); _i < _a.length; _i++) {
            var market = _a[_i];
            activeMarketAppIds.push(market.getMarketAppId());
        }
        return activeMarketAppIds;
    };
    /**
     * Returns the list of the active market addresses
     *
     * @returns list of active market addresses
     */
    Client.prototype.getActiveMarketAddresses = function () {
        var activeMarketAddresses = [];
        for (var _i = 0, _a = Object.values(this.getActiveMarkets()); _i < _a.length; _i++) {
            var market = _a[_i];
            activeMarketAddresses.push(market.getMarketAddress());
        }
        return activeMarketAddresses;
    };
    /**
     * Returns an opt in transaction group
     *
     * @param storageAddress - storage address to fund and rekey
     * @param address - address to send add collateral transaction group from; defulats to client user address
     * @returns
     */
    Client.prototype.prepareOptinTransactions = function (storageAddress, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        _a = optin_1.prepareManagerAppOptinTransactions;
                        _b = [this.manager.getManagerAppId(),
                            this.getMaxAtomicOptInMarketAppIds(),
                            addr,
                            storageAddress];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                }
            });
        });
    };
    /**
     * Returns an add collateral transaction group
     *
     * @param symbol - symbol to add collateral with
     * @param amount - amount of collateral to add
     * @param address - address to send add collateral transaction group from; defaults to clint user address
     * @returns
     */
    Client.prototype.prepareAddCollateralTransactions = function (symbol, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        market = this.getMarket(symbol);
                        _a = addCollateral_1.prepareAddCollateralTransactions;
                        _b = [addr];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(addr)];
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
    /**
     * Returns a borrow transaction group
     *
     * @param symbol - symbol to borrow
     * @param amount - amount to borrow
     * @param address - address to send borrow transaction group from; defaults to client user address
     * @returns borrow transaction group
     */
    Client.prototype.prepareBorrowTransactions = function (symbol, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        market = this.getMarket(symbol);
                        _a = borrow_1.prepareBorrowTransactions;
                        _b = [addr];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(addr)];
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
    /**
     * Returns a burn transaction group
     *
     * @param symbol - symbol to burn
     * @param amount - amount of bAsset to burn
     * @param address - address to send burn transaction group from; defaults to client user address
     * @returns burn transaction group
     */
    Client.prototype.prepareBurnTransactions = function (symbol, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        market = this.getMarket(symbol);
                        _a = burn_1.prepareBurnTransactions;
                        _b = [addr];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(addr)];
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
    /**
     * Returns a claim rewards transaction group
     *
     * @param address - address to send claim rewards from; defaults to client user address
     * @returns claim rewards transaction group
     */
    Client.prototype.prepareClaimRewardsTransactions = function (address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        _a = claimRewards_1.prepareClaimRewardsTransactions;
                        _b = [addr];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(addr)];
                    case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), this.manager.getManagerAppId(),
                            this.getActiveMarketAppIds(),
                            this.getActiveOracleAppIds(),
                            this.manager.getRewardsProgram().getRewardsAssetIds()]))];
                }
            });
        });
    };
    /**
     * Returns a liquidate transaction group
     *
     * @param targetStorageAddress - storage address to liquidate
     * @param borrowSymbol - symbol to repay
     * @param amount - amount to repay
     * @param collateralSymbol - symbol to seize collateral from
     * @param address - address to send liquidate transaction group from; defaults to client user address
     * @returns liquidate transaction group
     */
    Client.prototype.prepareLiquidateTransactions = function (targetStorageAddress, borrowSymbol, amount, collateralSymbol, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, borrowMarket, collateralMarket, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        borrowMarket = this.getMarket(borrowSymbol);
                        collateralMarket = this.getMarket(collateralSymbol);
                        _a = liquidate_1.prepareLiquidateTransactions;
                        _b = [addr];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(addr)];
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
    /**
     * Returns a mint transaction group
     *
     * @param symbol - symbol to mint
     * @param amount - amount of mint
     * @param address - address to send mint transacdtion group from; defaults to client user address
     * @returns mint transaction group
     */
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
    /**
     * Returns a mint to collateral transaction group
     *
     * @param symbol - symbol to mint
     * @param amount - amount to mint to collateral
     * @param address - address to send mint to collateral transaction group from; defaults to client user address
     * @returns mint to collateral transaction group
     */
    Client.prototype.prepareMintToCollateralTransactions = function (symbol, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        market = this.getMarket(symbol);
                        _a = mintToCollateral_1.prepareMintToCollateralTransactions;
                        _b = [addr];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(addr)];
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
    /**
     * Returns a remove collateral transaction group
     *
     * @param symbol - symbol to remove collateral from
     * @param amount - amount of collateral to remove
     * @param address - address to send remove collateral transaction group from; defaults to client user address
     * @returns remove collateral transaction group
     */
    Client.prototype.prepareRemoveCollateralTransactions = function (symbol, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        market = this.getMarket(symbol);
                        _a = removeCollateral_1.prepareRemoveCollateralTransactions;
                        _b = [addr];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(addr)];
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
    /**
     * Returns a remove collateral undrlying transaction group
     *
     * @param symbol - symbol to remove collateral from
     * @param amount - amount of collateral to remove
     * @param address - address to send remove collateral underlying transaction group from; defaults to client user address
     * @returns remove collateral underlying transaction group
     */
    Client.prototype.prepareRemoveCollateralUnderlyingTransactions = function (symbol, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        market = this.getMarket(symbol);
                        _a = removeCollateralUnderlying_1.prepareRemoveCollateralUnderlyingTransactions;
                        _b = [addr];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(addr)];
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
    /**
     * Returns a repay borrow transaction group
     *
     * @param symbol - symbol to repay
     * @param amount - amount of repay
     * @param address - address to send repay borrow transaction group from; defaults to client user address
     * @returns
     */
    Client.prototype.prepareRepayBorrowTransactions = function (symbol, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, market, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        market = this.getMarket(symbol);
                        _a = repayBorrow_1.prepareRepayBorrowTransactions;
                        _b = [addr];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.manager.getStorageAddress(addr)];
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
    /**
     * Returns a staking contract optin transaction group
     *
     * @param stakingContractName - name of staking contract to opt into
     * @param storageAddress - storage address to fund and rekey
     * @param address - address to create optin transaction group for; defaults to client user address
     * @returns staking contract opt in transaction group
     */
    Client.prototype.prepareStakingContractOptinTransactions = function (stakingContractName, storageAddress, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, stakingContract, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        stakingContract = this.getStakingContract(stakingContractName);
                        _a = optin_1.prepareManagerAppOptinTransactions;
                        _b = [stakingContract.getManagerAppId(),
                            [stakingContract.getMarketAppId()],
                            addr,
                            storageAddress];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                }
            });
        });
    };
    /**
     * Returns a staking contract stake transaction group
     *
     * @param stakingContractName - name of staking contract to stake on
     * @param amount - amount of stake
     * @param address - address to send stake transaction group from; defaults to client user address
     * @returns stake transacdtion group
     */
    Client.prototype.prepareStakeTransactions = function (stakingContractName, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, stakingContract, assetId, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        stakingContract = this.getStakingContract(stakingContractName);
                        assetId = stakingContract.getAsset().getUnderlyingAssetId();
                        _a = staking_1.prepareStakeTransactions;
                        _b = [addr];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, stakingContract.getStorageAddress(addr)];
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
    /**
     * Returns a staking contract unstake transactiong group
     *
     * @param stakingContractName - name of staking contract to unstake on
     * @param amount - amount of unstake
     * @param address - address to send unstake transaction group from; defaults to client user address
     * @returns unstake transaction group
     */
    Client.prototype.prepareUnstakeTransactions = function (stakingContractName, amount, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, stakingContract, assetId, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        stakingContract = this.getStakingContract(stakingContractName);
                        assetId = stakingContract.getAsset().getUnderlyingAssetId();
                        _a = staking_1.prepareUnstakeTransactions;
                        _b = [addr];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, stakingContract.getStorageAddress(addr)];
                    case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), amount,
                            stakingContract.getManagerAppId(),
                            stakingContract.getMarketAppId(),
                            stakingContract.getOracleAppId(),
                            assetId > 1 ? assetId : undefined]))];
                }
            });
        });
    };
    /**
     * Returns a staking contract claim rewards transaction group
     *
     * @param stakingContractName - name of staking contract to unstake on
     * @param address - address to send claim rewards transaction group from; defaults to client user address
     * @returns unstake transaction group
     */
    Client.prototype.prepareClaimStakingRewardsTransactions = function (stakingContractName, address) {
        if (address === void 0) { address = null; }
        return __awaiter(this, void 0, void 0, function () {
            var addr, stakingContract, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        addr = address;
                        if (!addr) {
                            addr = this.userAddress;
                        }
                        stakingContract = this.getStakingContract(stakingContractName);
                        _a = staking_1.prepareClaimStakingRewardsTransactions;
                        _b = [addr];
                        return [4 /*yield*/, this.getDefaultParams()];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, stakingContract.getStorageAddress(addr)];
                    case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), stakingContract.getManagerAppId(),
                            stakingContract.getMarketAppId(),
                            stakingContract.getOracleAppId(),
                            stakingContract.getRewardsProgram().getRewardsAssetIds()]))];
                }
            });
        });
    };
    /**
     * Submits and waits for a transaction group to finish if specified
     *
     * @param transactionGroup - signed transaction group
     * @param wait - boolean to tell whether you want to wait or not
     * @returns a dictionary with the txid of the group transaction
     */
    Client.prototype.submit = function (transactionGroup, wait) {
        if (wait === void 0) { wait = false; }
        return __awaiter(this, void 0, void 0, function () {
            var txid, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.algod.sendRawTransaction(transactionGroup)["do"]()];
                    case 1:
                        txid = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        throw new Error(e_1);
                    case 3:
                        if (wait) {
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
/**
 * Creates a new generic testnet client
 *
 * @param algodClient - Algod client for interacting with the network
 * @param indexerClient - Indexer client for interacting with the network
 * @param userAddress - address of the user
 * @returns a new and fuilly constructed algofi testnet client
 */
function newAlgofiTestnetClient(algodClient, indexerClient, userAddress) {
    if (algodClient === void 0) { algodClient = null; }
    if (indexerClient === void 0) { indexerClient = null; }
    if (userAddress === void 0) { userAddress = null; }
    return __awaiter(this, void 0, void 0, function () {
        var historicalIndexerClient, newAlgodClient, newIndexerClient, client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    historicalIndexerClient = new algosdk_1.Indexer("", "https://indexer.testnet.algoexplorerapi.io/", "");
                    if (algodClient === null) {
                        newAlgodClient = new algosdk_1.Algodv2("", "https://api.testnet.algoexplorer.io", "");
                    }
                    if (indexerClient === null) {
                        newIndexerClient = new algosdk_1.Indexer("", "https://algoindexer.testnet.algoexplorerapi.io/", "");
                    }
                    return [4 /*yield*/, Client.init(newAlgodClient, newIndexerClient, historicalIndexerClient, userAddress, "testnet")];
                case 1:
                    client = _a.sent();
                    return [2 /*return*/, client];
            }
        });
    });
}
exports.newAlgofiTestnetClient = newAlgofiTestnetClient;
/**
 * Creates a new generic mainnet client
 *
 * @param algodClient - Algod client for interacting with the network
 * @param indexerClient - Indexer client for interacting with the network
 * @param userAddress - address of the user
 * @returns a new and fully constructed algofi mainnet client
 */
function newAlgofiMainnetClient(algodClient, indexerClient, userAddress) {
    if (algodClient === void 0) { algodClient = null; }
    if (indexerClient === void 0) { indexerClient = null; }
    if (userAddress === void 0) { userAddress = null; }
    return __awaiter(this, void 0, void 0, function () {
        var historicalIndexerClient, newAlgodClient, newIndexerClient, client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    historicalIndexerClient = new algosdk_1.Indexer("", "https://indexer.algoexplorerapi.io/", "");
                    if (algodClient === null) {
                        newAlgodClient = new algosdk_1.Algodv2("", "https://algoexplorerapi.io", "");
                    }
                    if (indexerClient === null) {
                        newIndexerClient = new algosdk_1.Indexer("", "https://algoindexer.algoexplorerapi.io", "");
                    }
                    return [4 /*yield*/, Client.init(newAlgodClient, newIndexerClient, historicalIndexerClient, userAddress, "mainnet")];
                case 1:
                    client = _a.sent();
                    return [2 /*return*/, client];
            }
        });
    });
}
exports.newAlgofiMainnetClient = newAlgofiMainnetClient;
