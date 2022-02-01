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
exports.Asset = void 0;
var utils_1 = require("../utils");
var Asset = /** @class */ (function () {
    /**
     * This is the constructor for the Asset class.
     *
     * **Note, do not call this to create a new asset**. Instead call
     * the static method init as there are asynchronous set up steps in
     * creating an asset and a constructor can only return an instance of
     * the class and not a promise.
     *
     * #### Example
     * ```typescript
     * //Correct way to instantiate new asset
     * const newAsset = await Asset.init(algodClient, underlyingAssetId, bankAssetId, oracleAppId, oraclePriceField, oraclePriceScaleFactor)
     *
     * //Incorrect way to instantiate new asset
     * const newAsset = new Asset(algodClient, underlyingAssetId, bankAssetId, oracleAppId, oraclePriceField, oraclePriceScaleFactor)
     * ```
     *
     * @param algodClient - algod client
     * @param underlyingAssetId - id of underlying asset
     * @param bankAssetId - bank asset id
     * @param oracleAppId - oracle application id of underlying asset
     * @param oraclePriceField - oracle price field of underlying asset
     * @param oraclePriceScaleFactor - oracle price scale factor of underlying asset
     */
    function Asset(algodClient, underlyingAssetId, bankAssetId, oracleAppId, oraclePriceField, oraclePriceScaleFactor) {
        if (oracleAppId === void 0) { oracleAppId = null; }
        if (oraclePriceField === void 0) { oraclePriceField = null; }
        if (oraclePriceScaleFactor === void 0) { oraclePriceScaleFactor = null; }
        this.algod = algodClient;
        this.underlyingAssetId = underlyingAssetId;
        this.bankAssetId = bankAssetId;
        if (oracleAppId !== null) {
            if (oraclePriceField === null) {
                throw Error("oracle price field must be specified");
            }
            else if (oraclePriceScaleFactor === null) {
                throw Error("oracle price scale factor must be specified");
            }
        }
        this.oracleAppId = oracleAppId;
        this.oraclePriceField = oraclePriceField;
        this.oraclePriceScaleFactor = oraclePriceScaleFactor;
    }
    /**
     * This is the function that should be called when creating a new asset.
     * You pass everything you would to the constructor, but to this function
     * instead and this returns the new and created asset.
     *
     * #### Example
     * ```typescript
     * //Correct way to instantiate new asset
     * const newAsset = await Asset.init(algodClient, underlyingAssetId, bankAssetId, oracleAppId, oraclePriceField, oraclePriceScaleFactor)
     *
     * //Incorrect way to instantiate new asset
     * const newAsset = new Asset(algodClient, underlyingAssetId, bankAssetId, oracleAppId, oraclePriceField, oraclePriceScaleFactor)
     * ```
     *
     * @param algodClient - algod client
     * @param underlyingAssetId - id of underlying asset
     * @param bankAssetId - bank asset id
     * @param oracleAppId - oracle application id of underlying asset
     * @param oraclePriceField - oracle price field of underlying asset
     * @param oraclePriceScaleFactor - oracle price scale factor of underlying asset
     * @returns a finished instance of the asset class.
     */
    Asset.init = function (algodClient, underlyingAssetId, bankAssetId, oracleAppId, oraclePriceField, oraclePriceScaleFactor) {
        if (oracleAppId === void 0) { oracleAppId = null; }
        if (oraclePriceField === void 0) { oraclePriceField = null; }
        if (oraclePriceScaleFactor === void 0) { oraclePriceScaleFactor = null; }
        return __awaiter(this, void 0, void 0, function () {
            var asset, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        asset = new Asset(algodClient, underlyingAssetId, bankAssetId, oracleAppId, oraclePriceField, oraclePriceScaleFactor);
                        _a = asset;
                        if (!(underlyingAssetId !== 1)) return [3 /*break*/, 2];
                        return [4 /*yield*/, asset.algod.getAssetByID(underlyingAssetId)["do"]()];
                    case 1:
                        _b = (_d.sent()).params;
                        return [3 /*break*/, 3];
                    case 2:
                        _b = { "decimals": 6 };
                        _d.label = 3;
                    case 3:
                        _a.underlyingAssetInfo = _b;
                        _c = asset;
                        return [4 /*yield*/, asset.algod.getAssetByID(bankAssetId)["do"]()];
                    case 4:
                        _c.bankAssetInfo = (_d.sent()).params;
                        return [2 /*return*/, asset];
                }
            });
        });
    };
    /**
     * Returns underlying asset id
     *
     * @returns underlying asset id
     */
    Asset.prototype.getUnderlyingAssetId = function () {
        return this.underlyingAssetId;
    };
    /**
     * Returns underlying asset info
     *
     * @returns underlying asset info as a dictionary
     */
    Asset.prototype.getUnderlyingAssetInfo = function () {
        return this.underlyingAssetInfo;
    };
    /**
     * Returns bank asset id
     *
     * @returns bank asset id
     */
    Asset.prototype.getBankAssetId = function () {
        return this.bankAssetId;
    };
    /**
     * Returns bank asset info
     *
     * @returns bank asset info as a dictionary
     */
    Asset.prototype.getBankAssetInfo = function () {
        return this.bankAssetInfo;
    };
    /**
     * Returns oracle app id
     *
     * @returns oracle app id
     */
    Asset.prototype.getOracleAppId = function () {
        return this.oracleAppId;
    };
    /**
     * Returns oracle price field
     *
     * @returns oracle price field
     */
    Asset.prototype.getOraclePriceField = function () {
        return this.oraclePriceField;
    };
    /**
     * Returns oracle price scale factor
     *
     * @returns oracle price scale factor
     */
    Asset.prototype.getOraclePriceScaleFactor = function () {
        return this.oraclePriceScaleFactor;
    };
    /**
     * Returns the current raw oracle price
     *
     * @returns oracle price
     */
    Asset.prototype.getRawPrice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var price;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.oracleAppId === null) {
                            throw Error("no oracle app id for asset");
                        }
                        return [4 /*yield*/, (0, utils_1.getGlobalState)(this.algod, this.oracleAppId)];
                    case 1:
                        price = (_a.sent())[Buffer.from(this.oraclePriceField, "base64").toString()];
                        return [2 /*return*/, price];
                }
            });
        });
    };
    /**
     * Returns decimals of asset
     *
     * @returns decimals
     */
    Asset.prototype.getUnderlyingDecimals = function () {
        return this.underlyingAssetInfo.decimals;
    };
    /**
     * Returns the current oracle price
     *
     * @returns oracle price
     */
    Asset.prototype.getPrice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rawPrice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.oracleAppId == null) {
                            throw Error("no oracle app id for asset");
                        }
                        return [4 /*yield*/, this.getRawPrice()];
                    case 1:
                        rawPrice = _a.sent();
                        return [2 /*return*/, (rawPrice * Math.pow(10, this.getUnderlyingDecimals())) / (this.getOraclePriceScaleFactor() * 1e3)];
                }
            });
        });
    };
    /**
     * Returns the usd value of the underlying amount (base units)
     *
     * @param amount - integer amount of base underlying units
     * @returns usd value
     */
    Asset.prototype.toUSD = function (amount) {
        return __awaiter(this, void 0, void 0, function () {
            var price;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPrice()];
                    case 1:
                        price = _a.sent();
                        return [2 /*return*/, (amount * price) / Math.pow(10, this.getUnderlyingDecimals())];
                }
            });
        });
    };
    return Asset;
}());
exports.Asset = Asset;
