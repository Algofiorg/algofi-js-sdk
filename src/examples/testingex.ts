import { Indexer, Algodv2, getApplicationAddress } from "algosdk"
import { readGlobalState, readLocalState, searchGlobalState } from "../v1/utils"
import { addCollateralExample } from "./addCollateral"
import { formatState } from "../v1/utils"
import { marketStrings } from "../v1/contractStrings"
import { Market } from "../v1/market"

// async function getUnderlyingBorrowed(block: number = null): Promise<number> {
//   if (block) {
//     try {
//       let data = await this.historicalIndexer.lookupApplications(this.marketAppId).do()
//       data = data["application"]["params"]["global-state"]
//       return searchGlobalState(data, marketStrings.underlying_borrowed)
//     } catch (e) {
//       throw new Error("Issue getting data")
//     }
//   } else {
//     return this.underlyingBorrowed
//   }
// }

let algodClient = new Algodv2("", "https://api.testnet.algoexplorer.io", "")
let indexerClient = new Indexer("", "https://algoindexer.testnet.algoexplorerapi.io", "")
async function foo() {
  // console.log(await indexerClient.lookupApplications(67288478).do())
  await addCollateralExample()
  // let market = await Market.init(algodClient, indexerClient, 67288478)
  // let a = await market.getUnderlyingBorrowed()
  // console.log(a)
  // // console.log(
  // //   await indexerClient
  // //     .searchAccounts()
  // //     .assetID(408947)
  // //     .do()
  // // )
  // console.log(
  //   await readGlobalState(algodClient, "XLHCUMHYRPZJ6NXGP4XAMZKHF2HE67Q7MXLP7IGOIZIAEBNUVQ3FEGPCWQ", 67288478)
  // await readLocalState(algodClient, "XLHCUMHYRPZJ6NXGP4XAMZKHF2HE67Q7MXLP7IGOIZIAEBNUVQ3FEGPCWQ", 51422788)
  // )
  // console.log(await algodClient.getAssetByID(408947).do())
  // console.log(await algodClient.accountInformation("XLHCUMHYRPZJ6NXGP4XAMZKHF2HE67Q7MXLP7IGOIZIAEBNUVQ3FEGPCWQ").do())
  // getUnderlyingBorrowed()
  // console.log(getApplicationAddress(67288478))
}

foo()

// console.log(Buffer.from("9CSRPB4ckcpYmXRaUqRSe3dOV2HWDyUu/nKAXOrpmws=", "base64").toString())
