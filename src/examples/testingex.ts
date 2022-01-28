import { Indexer, Algodv2 } from "algosdk"
import { readGlobalState, readLocalState } from "../v1/utils"
import { addCollateralExample } from "./addCollateral"
import { formatState } from "../v1/utils"

async function foo() {
  // await addCollateralExample()
  let algodClient = new Algodv2("", "https://api.testnet.algoexplorer.io", "")
  // let indexerClient = new Indexer("", "https://algoindexer.testnet.algoexplorerapi.io", "")
  // console.log(
  //   await indexerClient
  //     .searchAccounts()
  //     .assetID(408947)
  //     .do()
  // )
  console.log(
    await readGlobalState(algodClient, "XLHCUMHYRPZJ6NXGP4XAMZKHF2HE67Q7MXLP7IGOIZIAEBNUVQ3FEGPCWQ", 67288478)
    // await readLocalState(algodClient, "XLHCUMHYRPZJ6NXGP4XAMZKHF2HE67Q7MXLP7IGOIZIAEBNUVQ3FEGPCWQ", 51422788)
  )
  // console.log(await algodClient.getAssetByID(408947).do())
  // console.log(await algodClient.accountInformation("XLHCUMHYRPZJ6NXGP4XAMZKHF2HE67Q7MXLP7IGOIZIAEBNUVQ3FEGPCWQ").do())
}

foo()

// console.log(Buffer.from("9CSRPB4ckcpYmXRaUqRSe3dOV2HWDyUu/nKAXOrpmws=", "base64").toString())
