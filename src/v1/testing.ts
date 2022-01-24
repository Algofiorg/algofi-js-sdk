import { Algodv2 } from "algosdk"
const token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
const server = "http://localhost"
const port = 4001
const client = new Algodv2(token, server, port)

// const foo = async (address: string) => {
//   const a = await client.accountInformation(address).do()
//   console.log(a)
// }

// foo("HLTOSATJWLJSBPICJZPR5KBYNDNJ7S47SQCSRNNOBEEH7JGWUEQPZAIS44")

const foo = async () => {
  const a = await client.getAssetByID(408947).do()
  console.log(a)
}

foo()
