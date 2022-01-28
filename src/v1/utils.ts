import {
  Transaction,
  generateAccount,
  secretKeyToMnemonic,
  encodeUint64,
  Algod,
  SuggestedParams,
  makePaymentTxn,
  makePaymentTxnWithSuggestedParams
} from "algosdk"
import { Algodv2, assignGroupID } from "algosdk"
import { contracts } from "./contracts"

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
export function getProgram(definition: {}, variables: {} = null): Uint8Array {
  // """
  // Return a byte array to be used in LogicSig.
  // """
  // template = definition['bytecode']
  // template_bytes = list(b64decode(template))

  // offset = 0
  // for v in sorted(definition['variables'], key=lambda v: v['index']):
  //     name = v['name'].split('TMPL_')[-1].lower()
  //     value = variables[name]
  //     start = v['index'] - offset
  //     end = start + v['length']
  //     value_encoded = encode_value(value, v['type'])
  //     value_encoded_len = len(value_encoded)
  //     diff = v['length'] - value_encoded_len
  //     offset += diff
  //     template_bytes[start:end] = list(value_encoded)

  // return bytes(template_bytes)
  return
}

export function encodeValue(value: number, type: string): Uint8Array {
  console.log("ENCODE VALUE IN UTILS.TS\n")
  if (type === "int") {
    return encodeVarint(value)
  }
  throw new Error(`Unsupported value type ${type}!`)
}

//Again will come back to this function, it doesn't seem to be used anywhere else in the py sdk
//except get_program, but get_program isn't used anywhere else other than its declaration
export function encodeVarint(number: number): Uint8Array {
  console.log("ENCODE VARINT IN UTILS.TS\n")
  return
}

//Again this isn't used anywhere and I'm not sure if the Transaction class is from a previous attempt because
//at least the js sdk for algorand doesn't have sender as a parameter for Transaction class
export async function signAndSubmitTransaction(
  client: Algodv2,
  transactions: Transaction[],
  signedTransactions: Uint8Array[],
  sender: string,
  senderSk: Uint8Array
) {
  console.log("SIGN AND SUBMIT TRANSACTION IN UTILS.TS")
  for (const [i, txn] of transactions.entries()) {
    if (true) {
      signedTransactions[i] = txn.signTxn(senderSk)
    }
  }
  let txid = await client.sendRawTransaction(signedTransactions).do()
  return waitForConfirmation(client, txid)
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

export function intToBytes(num: number): Uint8Array {
  return encodeUint64(num)
}

//Again this isn't used anywhere will come back to it later
export function getStateInt(state, key: any): any {
  if (typeof key === "string") {
  }
  return
}

//Again this isn't used anywhere will come back to it later
export function getStateBytes(state: any, key: any): any {
  return
}

//I think this is correct now, we take in base64 and then convert to a buffer of bytes and then convert
//that to a string with utf-8 encoding
//There actually is probably an error with the algorand docs, they do:
/*
import base64

encoded = "SGksIEknbSBkZWNvZGVkIGZyb20gYmFzZTY0"
decoded = base64.b64decode(encoded).encode('ascii')
print(decoded)
*/

//but bytes object has no property encode, which makes sense because if you are in bytes then you hva ealready encoded it into bytes
//and want to decode it into a charset
export function formatState(state: {}[]): {} {
  console.log("FORMAT STATE IN UTILS.TS\n")
  let formatted = {}
  for (let item of state) {
    let key = item["key"]
    let value = item["value"]
    let formattedKey: string
    let formattedValue: string
    try {
      formattedKey = Buffer.from(key, "base64").toString()
    } catch (e) {
      formattedKey = Buffer.from(key).toString()
    }
    if (value["type"] === 1) {
      try {
        formattedValue = Buffer.from(value["bytes"], "base64").toString()
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

//Figure out if we are returning the same file as the python sdk
export async function readLocalState(client: Algodv2, address: string, appId: number): Promise<{}> {
  console.log("READ LOCAL STATE IN UTILS.TS\n")
  let results = await client.accountInformation(address).do()
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

export async function readGlobalState(client: Algodv2, address: string, appId: number): Promise<{}> {
  console.log("READ GLOBAL STATE IN UTILS.TS")
  const results = await client.accountInformation(address).do()
  const appsCreated = results["created-apps"]
  for (let app of appsCreated) {
    if (app["id"] === appId) {
      return formatState(app["params"]["global-state"])
    }
  }
  console.log("format state in utils.ts finished and returned {}\n")
  return {}
}

//need to make sure that getApplicationByID is the same thing as client.application_info(app_id) for pysdk
export async function getGlobalState(algodClient: Algodv2, appId: number): Promise<{}> {
  console.log("GET GLOBAL STATE IN UTILS.TS\n")
  let application = await algodClient.getApplicationByID(appId).do()
  const stateDict = formatState(application["params"]["global-state"])
  console.log("get global state in utils.ts finished and returned", stateDict, "\n")
  return stateDict
}

export function getStakingContracts(chain: string): {} {
  console.log("GET STAKING CONTRACTS IN UTILS.TS\n")
  console.log("get staking contracts in utils.ts finished and returned", contracts[chain]["STAKING_CONTRACTS"], "\n")
  return contracts[chain]["STAKING_CONTRACTS"]
}

export function getOrderedSymbols(chain: string, max: boolean = false, maxAtomicOptIn: boolean = false): string[] {
  console.log("GET ORDERED SYMBOLS IN UTILS.TS\n")
  let supportedMarketCount: number
  if (max) {
    supportedMarketCount = contracts["maxMarketCount"]
  } else if (maxAtomicOptIn) {
    supportedMarketCount = contracts["maxAtomicOptInMarketCount"]
  } else {
    supportedMarketCount = contracts["supportedMarketCount"]
  }
  console.log(
    "get ordered symbols in utils.ts finished and returned",
    contracts[chain]["SYMBOLS"].slice(0, supportedMarketCount),
    "\n"
  )
  return contracts[chain]["SYMBOLS"].slice(0, supportedMarketCount)
}

export function getManagerAppId(chain: string): number {
  console.log("GET MANAGER APP ID IN UTILS.TS\n")
  console.log("get manager app id in utils.ts finished and returned", contracts[chain]["managerAppId"], "\n")
  return contracts[chain]["managerAppId"]
}

export function getMarketAppId(chain: string, symbol: string): number {
  console.log("GET MARKET APP ID IN UTILS.TS\n")
  console.log("get market app id finished and returned", contracts[chain]["SYMBOL_INFO"][symbol]["marketAppId"], "\n")
  return contracts[chain]["SYMBOL_INFO"][symbol]["marketAppId"]
}

export function getInitRound(chain: string): number {
  console.log("GET INIT ROUND IN UTILS.TS\n")
  console.log("get init round in utils.ts finished and returned", contracts[chain]["initRound"], "\n")
  return contracts[chain]["initRound"]
}

export function preparePaymentTransaction(
  sender: string,
  suggestedParams: SuggestedParams,
  receiver: string,
  amount: number,
  rekey_to: string = null
): TransactionGroup {
  console.log("PREPARE PAYMENT TRANSACTION IN UTILS.TS\n")
  let txn = makePaymentTxnWithSuggestedParams(sender, receiver, amount, undefined, undefined, suggestedParams)
  let txnGroup = new TransactionGroup([txn])
  console.log("prepare payment transactions in utils.ts finished and returned", txnGroup, "\n")
  return txnGroup
}

export function getNewAccount(): any[] {
  console.log("GET NEW ACCOUNT IN UTILS.TS")
  //this is actually not asynchronous
  let newAccount = generateAccount()

  //tested that these work
  let key = newAccount.sk
  let address = newAccount.addr

  //this works as well
  let passphrase = secretKeyToMnemonic(key)
  console.log("get new account in utils.ts finished and returned", [key, address, passphrase], "\n")
  return [key, address, passphrase]
}

export function searchGlobalState(globalState: {}, searchKey: any): any {
  console.log("SEARCH GLOBAL STATE IN UTILS.TS")
  for (let field of Object.keys(globalState)) {
    let value = field["value"]
    let key = field["key"]
    if (searchKey === Buffer.from(key, "base64").toString()) {
      if (value["type"] == 2) {
        value = value["uint"]
      } else {
        value = value["bytes"]
      }
      console.log("search global state in utils.ts finished and returned", value, "\n")
      return value
    }
  }
  throw new Error("Key not found")
}

export class TransactionGroup {
  transactions: Transaction[]
  signedTransactions: Uint8Array[]
  constructor(transactions: Transaction[]) {
    console.log("CONSTRUCTOR TRANSACTION GROUP IN UTILS.TS")
    this.transactions = assignGroupID(transactions)
    let signedTransactions = []
    for (let _ of this.transactions) {
      signedTransactions.push(null)
    }
    this.signedTransactions = signedTransactions
  }

  //figure out how to notate types of privateKey
  //Also address is not used but I can take it out later
  signWithPrivateKey(address: string, privateKey: Uint8Array): void {
    console.log("SIGN WITH PRIVATE KEY IN UTILS.TS")
    for (let [i, txn] of this.transactions.entries()) {
      this.signedTransactions[i] = txn.signTxn(privateKey)
    }
    console.log("sign with private key in utils.ts finished\n")
  }

  signWithPrivateKeys(privateKeys: Uint8Array[]): void {
    console.log("SIGN WITH PRIVATE KEYS IN UTILS.TS")
    if (privateKeys.length !== this.transactions.length) {
      throw new Error("Different number of private keys and transactions")
    }
    for (let [i, txn] of this.transactions.entries()) {
      this.signedTransactions[i] = txn.signTxn(privateKeys[i])
    }
    console.log("sign with private keys in utils.ts finished\n")
  }

  //formatter is saving this as txid:txid instead of "txid":txid
  async submit(algod: Algodv2, wait: boolean = false) {
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
    console.log("submit in utils.ts finishe\n")
    return {
      txid: txid
    }
  }
}
