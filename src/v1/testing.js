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
var algosdk_1 = require("algosdk");
// import { AlgofiMainnetClient } from "../v1/client"
// const token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
// const server = "http://localhost"
// const port = 4001
// const client = new Algodv2(token, server, port)
// const foo = async (address: string) => {
//   const a = await client.accountInformation(address).do()
//   console.log(a)
// }
// foo("HLTOSATJWLJSBPICJZPR5KBYNDNJ7S47SQCSRNNOBEEH7JGWUEQPZAIS44")
// const foo = async () => {
//   const a = await client.getAssetByID(408947).do()
//   console.log(a)
// }
// foo()
// const token = ""
// const server = "http://localhost"
// const port = 8980
// const indexerClient = new algosdk.Indexer(token, server, port)
// indexerClient.lookupApplications()
// async function foo() {
//   let algodClient = new Algodv2(
//     "ad4c18357393cb79f6ddef80b1c03ca99266ec99d55dff51b31811143f8b2dff",
//     "https://node.chainvault.io/test",
//     ""
//   )
//   // let testnetClient = AlgofiMainnetClient(algodClient)
//   console.log(await algodClient.accountInformation("XLHCUMHYRPZJ6NXGP4XAMZKHF2HE67Q7MXLP7IGOIZIAEBNUVQ3FEGPCWQ").do())
// }
// foo()
// const decoded = Buffer.from("SGksIEknbSBkZWNvZGVkIGZyb20gYmFzZTY", "base64").toString("base64url")
// // console.log(decoded)
// const something = Buffer.from("hello")
// console.log(something)
// function formatState(state) {
//   let key = state["key"]
//   let value = state["value"]
//   let formattedKey: string
//   let formattedValue: string
//   let formatted = {}
//   try {
//     formattedKey = Buffer.from(key, "base64").toString()
//   } catch (e) {
//     formattedKey = Buffer.from(key).toString()
//   }
//   try {
//     formattedValue = Buffer.from(value["bytes"], "base64").toString()
//   } catch (e) {
//     formattedValue = value["bytes"]
//   }
//   formatted[formattedKey] = formattedValue
//   return formatted
// }
// console.log(
//   formatState({
//     key: "SGksIEknbSBkZWNvZGVkIGZyb20gYmFzZTY0",
//     value: "SGksIEknbSBkZWNvZGVkIGZyb20gYmFzZTY"
//   })
// )
// import { generateAccount, secretKeyToMnemonic } from "algosdk"
// let a = generateAccount()
// console.log(a.addr)
// console.log(a.sk)
// console.log(secretKeyToMnemonic(a.sk))
// const enc = new TextEncoder()
// console.log(Buffer.from("ac"))
// console.log(enc.encode("ac"))
function foo() {
    return __awaiter(this, void 0, void 0, function () {
        var algodClient, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    algodClient = new algosdk_1.Algodv2("ad4c18357393cb79f6ddef80b1c03ca99266ec99d55dff51b31811143f8b2dff", "https://node.chainvault.io/test", "");
                    _b = (_a = console).log;
                    return [4 /*yield*/, algodClient.getAssetByID(408947)["do"]()];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    });
}
foo();
