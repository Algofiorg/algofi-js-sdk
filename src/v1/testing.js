"use strict";
exports.__esModule = true;
var algosdk_1 = require("algosdk");
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
var token = "";
var server = "http://localhost";
var port = 8980;
var indexerClient = new algosdk_1["default"].Indexer(token, server, port);
