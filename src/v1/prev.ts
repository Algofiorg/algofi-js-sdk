/*
************JAVASCRIPT************

JAVASCRIPT INDEXER

const indexer_token = "";
const indexer_server = "http://localhost";
const indexer_port = 8980;

const indexerClient = new algosdk.Indexer("", http://localhost", 8980);


JAVASCRIPT CLIENT

const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        const algodServer = 'http://localhost';
        const algodPort = 4001;
        let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);




************PYTHON************

PYTHON INDEXER

import json
# requires Python SDK version 1.3 or higher
from algosdk.v2client import indexer

# instantiate indexer client
myindexer = indexer.IndexerClient(indexer_token="", indexer_address="http://localhost:8980")


PYTHON CLIENT

algod_address = "http://localhost:4001"
    algod_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    algod_client = algod.AlgodClient(algod_token, algod_address)

*/

// export class AlgofiTestnetClient extends Client {
//   constructor(algodClient: Algodv2, indexerClient: Indexer = undefined, userAddress: string = undefined) {
//     let historicalIndexerClient = new Indexer("", "https://indexer.testnet.algoexplorerapi.io/", 8980, {
//       "User-Agent": "algosdk"
//     })
//     if (algodClient === undefined) {
//       algodClient = new Algodv2("", "https://api.testnet.algoexplorer.io", 4001, { "User-Agent": "algosdk" })
//     }
//     if (indexerClient === undefined) {
//       indexerClient = new Indexer("", "https://algoindexer.testnet.algoexplorerapi.io", 8980, {
//         "User-Agent": "algosdk"
//       })
//     }

//     super(algodClient, indexerClient, historicalIndexerClient, userAddress, "testnet")
//   }
// }

export async function AlgofiTestnetClient(
  algodClient: Algodv2,
  indexerClient: Indexer = undefined,
  userAddress: string = undefined
) {
  let historicalIndexerClient = new Indexer("", "https://indexer.testnet.algoexplorerapi.io/", "")
  if (algodClient === undefined) {
    algodClient = new Algodv2(
      "ad4c18357393cb79f6ddef80b1c03ca99266ec99d55dff51b31811143f8b2dff",
      "https://node.chainvault.io/test",
      ""
    )
  }
  if (indexerClient === undefined) {
    indexerClient = new Indexer("", "https://algoindexer.testnet.algoexplorerapi.io/")
  }
  algodClient = new Algodv2(
    "ad4c18357393cb79f6ddef80b1c03ca99266ec99d55dff51b31811143f8b2dff",
    "https://node.chainvault.io/test",
    ""
  )
  console.log(await algodClient.status().do())
  return await Client.init(algodClient, indexerClient, historicalIndexerClient, userAddress, "testnet")
}

// export class AlgofiMainnetClient extends Client {
//   constructor(algodClient: Algodv2, indexerClient: Indexer = undefined, userAddress: string = undefined) {
//     let historicalIndexerClient = new Indexer("", "https://indexer.algoexplorerapi.io/", 8980, {
//       "User-Agent": "algosdk"console
//     })
//     if (algodClient === undefined) {
//       algodClient = new Algodv2("", "https://algoexplorerapi.io", 4001, { "User-Agent": "algosdk" })
//     }
//     if (indexerClient === undefined) {
//       indexerClient = new Indexer("", "https://algoindexer.algoexplorerapi.io", 8980, { "User-Agent": "algosdk" })
//     }
//     super(algodClient, indexerClient, historicalIndexerClient, userAddress, "mainnet")
//   }
// }

export async function AlgofiMainnetClient(
  algodClient: Algodv2,
  indexerClient: Indexer = undefined,
  userAddress: string = undefined
) {
  let historicalIndexerClient = new Indexer("", "https://indexer.algoexplorerapi.io/", 8980, {
    "User-Agent": "algosdk"
  })
  if (algodClient === undefined) {
    algodClient = new Algodv2("", "https://algoexplorerapi.io", 4001, { "User-Agent": "algosdk" })
  }
  if (indexerClient === undefined) {
    indexerClient = new Indexer("", "https://algoindexer.algoexplorerapi.io", 8980, { "User-Agent": "algosdk" })
  }
  return await Client.init(algodClient, indexerClient, historicalIndexerClient, userAddress, "mainnet")
}
