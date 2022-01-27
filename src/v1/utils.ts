import { Base64Encoder } from "./encode"
import { Transaction, generateAccount, secretKeyToMnemonic, encodeUint64, Algod } from "algosdk"
import { contracts } from "./contracts"
import { Algodv2, assignGroupID } from "algosdk"

//Constants
const PARAMETER_SCALE_FACTOR = 1e3
const SCALE_FACDTOR = 1e9
const REWARDS_SCALE_FACTOR = 1e14

export enum Transactions {
  MINT = 1,
  MINT_TO_COLLATERAL = 2,
  ADD_COLLATERAL = 3,
  REMOVE_COLLATERAL = 4,
  BURN = 5,
  REMOVE_COLLATERAL_UNDERLYING = 6,
  BORROW = 7,
  REPAY_BORROW = 8,
  LIQUIDATE = 9,
  CLAIM_REWARDS = 10
}

export function get(object: {}, key: any, default_value: any): any {
  var result = object[key]
  return typeof result !== "undefined" ? result : default_value
}

//I'm not sure how to implement this function, but it isn't used anywhere else in the py sdk so
//will come back to this later
export function getProgram(definition: {}, variables: {}): Uint8Array {
  return
}

// export function getProgram(definition, variables = undefined) {
//   console.log("GET PROGRAM IN UTILS.TS\n")
//   let template = definition["bytecode"]
//   let templateBytes = toAscii(template)
//   let offset = 0
// }

export function encodeValue(value: number, type: string) {
  console.log("ENCODE VALUE IN UTILS.TS\n")
  if (type === "int") {
    return encodeVarint(value)
  }
  throw new Error(`Unsupported value type ${type}`)
}

export const encodeVarint = (number: number) => {
  console.log("ENCODE VARINT IN UTILS.TS\n")
  /**
   * TOOD: figure out byte logic in javascript
   */
  let buf
}

export const signAndSubmitTransaction = async (client: Algodv2, transactions, signedTransactions, sender, senderSk) => {
  console.log("SIGN AND SUBMIT TRANSACTION IN UTILS.TS")
  for (const [i, txn] of transactions.entries()) {
    if (txn.sender === sender) {
      signedTransactions[i] = txn.signTxn(senderSk)
    }
  }
  let txid = await client.sendRawTransaction(signedTransactions).do()
  return waitForConfirmation(client, txid)
}

const dec = new TextDecoder()

export function formatState(state) {
  console.log("FORMAT STATE IN UTILS.TS\n")
  let formatted = {}
  for (let item of state) {
    let key = item["key"]
    let value = item["value"]
    let formattedKey: string
    let formattedValue: string
    try {
      formattedKey = Base64Encoder._utf8_decode(Base64Encoder.decode(key))
    } catch (e) {
      formattedKey = Base64Encoder.decode(key)
    }
    if (value["type"] === 1) {
      try {
        formattedValue = Base64Encoder._utf8_decode(Base64Encoder.decode(value["bytes"]))
      } catch (e) {
        formattedValue = value["bytes"]
      }
      formatted[formattedKey] = formattedValue
    } else {
      formatted[formattedKey] = value["uint"]
    }
    console.log("format state in utils.ts finished and returned", formatted, "\n")
    return formatted
  }
}

export const getGlobalState = async (algodClient: Algodv2, appId: number) => {
  console.log("GET GLOBAL STATE IN UTILS.TS\n")
  let application = await algodClient.getApplicationByID(appId).do()
  const stateDict = formatState(application["params"]["global-state"])
  console.log("get global state in utils.ts finished and returned", stateDict, "\n")
  return stateDict
}

export const searchGlobalState = (globalState, searchKey) => {
  console.log("SEARCH GLOBAL STATE IN UTILS.TS")
  let value
  for (const entry of globalState) {
    let decodedKey = Base64Encoder.decode(entry.key)
    if (decodedKey === searchKey) {
      if (entry.value.type == 2) {
        value = entry.value.uint
      } else {
        value = entry.value.bytes
      }
    }
  }
  return value
}

//Figure out if we are returning the same file as the python sdk
export async function readLocalState(client: Algodv2, address: string, appId: number) {
  console.log("READ LOCAL STATE IN UTILS.TS\n")
  // Address XLHCUMHYRPZJ6NXGP4XAMZKHF2HE67Q7MXLP7IGOIZIAEBNUVQ3FEGPCWQ
  const results = await client.accountInformation(address).do()
  for (let localState of results["apps-local-state"]) {
    if (localState["id"] === appId) {
      if (!Object.keys(localState).includes("key-value")) {
        console.log("read local state in utils.ts finished and returned {}\n")
        return {}
      }
      console.log("read local state in utils.ts finished and returned", formatState(localState["key-value"]), "\n")
      return formatState(localState["key-value"])
    }
  }
  console.log("read local state in utils.ts finished and returned {}\n")
  return {}
}

export const getManagerAppId = (chain: string) => {
  console.log("GET MANAGER APP ID IN UTILS.TS\n")
  console.log("get manager app id in utils.ts finished and returned", contracts[chain]["managerAppId"], "\n")
  return contracts[chain]["managerAppId"]
}

export async function waitForConfirmation(algodClient: Algodv2, txId: string): Promise<void> {
  console.log("WAIT FOR CONFIRMATION IN UTILS.TS\n")
  const response = await algodClient.status().do()
  let lastround = response["last-round"]
  while (true) {
    const pendingInfo = await algodClient.pendingTransactionInformation(txId).do()
    if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
      //Got the completed Transaction
      console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"])
      break
    }
    lastround++
    await algodClient.statusAfterBlock(lastround).do()
  }
}

export const getStakingContracts = (chain: string) => {
  console.log("GET STAKING CONTRACTS IN UTILS.TS\n")
  return contracts[chain]["STAKING_CONTRACTS"]
}

export const getMarketAppId = (chain: string, symbol: string) => {
  console.log("GET MARKET APP ID IN UTILS.TS\n")
  return contracts[chain]["SYMBOL_INFO"][symbol]["marketAppId"]
}

export const getInitRound = (chain: string) => {
  console.log("GET INIT ROUND IN UTILS.TS\n")
  console.log("get init round in utils.ts finished and returned", contracts[chain]["initRound"], "\n")
  return contracts[chain]["initRound"]
}

export const readGlobalState = async (client: Algodv2, address: string, appId: number) => {
  console.log("READ GLOBAL STATE IN UTILS.TS")
  const results = await client.accountInformation(address).do()
  const appsCreated = results["created-apps"]
  for (let app of appsCreated) {
    if (app["id"] === appId) {
      return formatState(app["params"]["global-state"])
    }
  }
  return {}
}

export const getOrderedSymbols = (chain: string, max: boolean = false, maxAtomicOptIn: boolean = false) => {
  console.log("GET ORDERED SYMBOLS IN UTILS.TS\n")
  let supportedMarketCount: string[]
  if (max) {
    supportedMarketCount = contracts["maxMarketCount"]
  } else if (maxAtomicOptIn) {
    supportedMarketCount = contracts["maxAtomicOptInMarketCount"]
  } else {
    supportedMarketCount = contracts["supportedMarketCount"]
  }
  // console.log(supportedMarketCount)
  console.log(
    "get ordered symbols in utils.ts finished and returned",
    contracts[chain]["SYMBOLS"].slice(0, supportedMarketCount),
    "\n"
  )
  return contracts[chain]["SYMBOLS"].slice(0, supportedMarketCount)
}

// //Do we not need client to get the reccomended parameters?
// export const preparePaymentTransaction = async (sender : string, suggestedParams, receiver : string, amount : number, rekeyTo = undefined) => {
//   let params = await client.getTransactionParams().do();
//   let txn = makePaymentTxnWithSuggestedParams(sender, receiver, amount, undefined, undefined, params);
//   return;
// }

export const getNewAccount = () => {
  console.log("GET NEW ACCOUNT IN UTILS.TS")
  let newAccount = generateAccount()
  let key = newAccount.sk
  let address = newAccount.addr
  let passphrase = secretKeyToMnemonic(key)

  return [key, address, passphrase]
}

export function intToBytes(int: number) {
  console.log("INT TO BYTES IN UTILS.TS")
  return encodeUint64(int)
}

export class TransactionGroup {
  transactions: Transaction[]
  //figure out type for signedTransactions
  signedTransactions: any
  constructor(transactions: Transaction[]) {
    console.log("CONSTRUCTOR TRANSACTION GROUP IN UTILS.TS")
    this.transactions = assignGroupID(transactions)
    let signedTransactions = []
    for (let _ of this.transactions) {
      signedTransactions.push(undefined)
    }
    this.signedTransactions = signedTransactions
  }

  //figure out how to notate types of privateKey
  //Also address is not used so I took it out of the parameters
  signWithPrivateKey = (privateKey: any) => {
    console.log("SIGN WITH PRIVATE KEY IN UTILS.TS")
    for (let [i, txn] of Object.entries(this.transactions)) {
      this.signedTransactions[i] = txn.signTxn(privateKey)
    }
  }

  signWithPrivateKeys = (privateKeys: any) => {
    console.log("SIGN WITH PRIVATE KEYS IN UTILS.TS")
    //do assertion assert(len(private_keys) == len(self.transactions))
    for (let [i, txn] of Object.entries(this.transactions)) {
      this.signedTransactions[i] = txn.signTxn(privateKeys[i])
    }
  }

  submit = async (algod: Algodv2, wait: boolean = false) => {
    console.log("SUBMIT IN UTILS.TS")
    let txid: string
    try {
      txid = await algod.sendRawTransaction(this.signedTransactions).do()
      //Figure out catching and throwing errors as other aliases
    } catch (e) {
      throw new Error(e)
    }
    if (wait) {
      return waitForConfirmation(algod, txid)
    }
    //formatter is saving this as txid:txid instead of "txid":txid
    return {
      txid: txid
    }
  }
}
