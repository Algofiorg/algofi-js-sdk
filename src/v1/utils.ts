import { Base64Encoder } from "./extraUtils/encoder"
import { Transaction, generateAccount, secretKeyToMnemonic } from "algosdk"
import { contracts } from "./contracts"
import algosdk from "algosdk"
import { Account } from "algosdk/dist/types/src/client/v2/algod/models/types"

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

export function get(object: any, key: any, default_value: any) {
  var result = object[key]
  return typeof result !== "undefined" ? result : default_value
}

let toAscii = (word: string) => {
  let temp = []
  for (let i = 0; i < word.length; i++) {
    temp.push(word.charCodeAt(i))
  }
  return temp
}

// export const getProgram = (definition, variables = undefined) => {
//   /**
//    * Return a byte array to be used in LogicSig
//    *
//    * TODO: finish implementation of this function after convertin lambda functions
//    * to js
//   */
//  let template = definition['bytecode'];
//  let templateBytes = toAscii(template);
//  let offset = 0;
// }

export const encodeValue = (value, type) => {
  if (type === "int") {
    return encodeVarint(value)
  }
  throw new Error(`Unsupported value type ${type}`)
}

export const encodeVarint = (number: number) => {
  /**
   * TOOD: figure out byte logic in javascript
   */
  let buf
}

export const signAndSubmitTransaction = async (client: Algodv2, transactions, signedTransactions, sender, senderSk) => {
  for (const [i, txn] of transactions.entries()) {
    if (txn.sender === sender) {
      signedTransactions[i] = txn.signTxn(senderSk)
    }
  }
  let txid = await client.sendRawTransaction(signedTransactions).do()
  return waitForConfirmation(client, txid)
}

export const formatState = state => {
  let formatted = {}
  for (const item of state) {
    const key = item["key"]
    const value = item["value"]
    let formattedKey
    let formattedValue
    try {
      formattedKey = Base64Encoder.decode(key)
      if (value["type"] == 1) {
        // note -- this doesn't exactly match functionality of the python impl.
        formattedValue = Base64Encoder.decode(value["bytes"])
      } else {
        formattedValue = value["uint"]
      }
      formatted[formattedKey] = formattedValue
    } catch (err) {}
  }
  return formatted
}

export const getGlobalState = async (algodClient, appId) => {
  const stateDict = await formatState((await algodClient.getApplicationByID(appId).do())["params"]["global-state"])
  return stateDict
}

export const searchGlobalState = (globalState, searchKey) => {
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
export const readLocalState = async (client, address, app_id) => {
  const results = await client.accountInformation(address).do()
  for (const local_state in results["apps-local-state"]) {
    if (local_state["id"] === app_id) {
      if (!local_state.includes("key-value")) {
        return {}
      }
    }
  }
  return {}
}

export const getManagerAppId = (chain: string) => {
  return contracts[chain]["managerAppId"]
}

const waitForConfirmation = async function(client: algosdk.Algodv2, txId: number) {
  const response = await client.status().do()
  let lastround = response["last-round"]
  while (true) {
    const pendingInfo = await client.pendingTransactionInformation(txId).do()
    if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
      console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"])
      break
    }
    lastround++
    await client.statusAfterBlock(lastround).do()
  }
}

export const getStakingContracts = (chain: string) => {
  return contracts[chain]["STAKING_CONTRACTS"]
}

export const getMarketAppId = (chain: string, symbol: string) => {
  return contracts[chain]["SYMBOL_INFO"][symbol]["marketAppId"]
}

export const getInitRound = (chain: string) => {
  return contracts[chain]["initRound"]
}

export const readGlobalState = async (client: Algodv2, address: string, appId: number) => {
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
  let supportedMarketCount: string[]
  if (max) {
    supportedMarketCount = contracts["maxMarketCount"]
  } else if (maxAtomicOptIn) {
    supportedMarketCount = contracts["maxAtomicOptInMarketCount"]
  } else {
    supportedMarketCount = contracts["supportedMarketCount"]
  }
  return contracts["SYMBOLS"].slice(0, supportedMarketCount)
}

// //Do we not need client to get the reccomended parameters?
// export const preparePaymentTransaction = async (sender : string, suggestedParams, receiver : string, amount : number, rekeyTo = undefined) => {
//   let params = await client.getTransactionParams().do();
//   let txn = algosdk.makePaymentTxnWithSuggestedParams(sender, receiver, amount, undefined, undefined, params);
//   return;
// }

export const getNewAccount = () => {
  let newAccount = generateAccount()
  let key = newAccount.sk
  let address = newAccount.addr
  let passphrase = secretKeyToMnemonic(key)

  return [key, address, passphrase]
}

export function intToBytes(int: number) {
  return
}

export class TransactionGroup {
  transactions: Transaction[]
  //figure out type for signedTransactions
  signedTransactions: any
  constructor(transactions: Transaction[]) {
    this.transactions = algosdk.assignGroupID(transactions)
    let signedTransactions = []
    for (let _ of this.transactions) {
      signedTransactions.push(undefined)
    }
    this.signedTransactions = signedTransactions
  }

  //figure out how to notate types of privateKey
  //Also address is not used so I took it out of the parameters
  signWithPrivateKey = (privateKey: any) => {
    for (let [i, txn] of Object.entries(this.transactions)) {
      this.signedTransactions[i] = txn.signTxn(privateKey)
    }
  }

  signWithPrivateKeys = (privateKeys: any) => {
    //do assertion assert(len(private_keys) == len(self.transactions))
    for (let [i, txn] of Object.entries(this.transactions)) {
      this.signedTransactions[i] = txn.signTxn(privateKeys[i])
    }
  }

  submit = async (algod: algosdk.Algodv2, wait: boolean = false) => {
    let txid: number
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
