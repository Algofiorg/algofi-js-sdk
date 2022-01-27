// import { Algodv2 } from "algosdk"
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
const enc = new TextEncoder()
console.log(Buffer.from("ac"))
console.log(enc.encode("ac"))
