import { Base64Encoder } from "./extraUtils/encoder"
import { Transaction, Algodv2, waitForConfirmation } from "algosdk" 


let toAscii = (word: string) => {
  let temp = [];
  for (let i = 0; i < word.length; i ++){
    temp.push(word.charCodeAt(i)):
  }
  return temp;
}

export const getProgram = (definition, variables = undefined) => {
  /**
   * Return a byte array to be used in LogicSig
   * 
   * TODO: finish implementation of this function after convertin lambda functions
   * to js
  */
 let template = definition['bytecode'];
 let templateBytes = toAscii(template);
 let offset = 0;
}

export const encodeValue = (value, type) => {
  if (type === "int"){
    return encodeVarint(value)
  }
  throw new Error(`Unsoported value type ${type}`);
}

export const encodeVarint = (number: number) => {
  /**
   * TOOD: figure out byte logic in javascript
   */
  let buf;
}

export const signAndSubmitTransaction = async (client : Algodv2, transactions, signedTransactions, sender, senderSk) => {
  for (const [i, txn] of transactions.entries()){
    if (txn.sender === sender){
      signedTransactions[i] = txn.signTxn(senderSk);
    }
  }
  let txid = await client.sendRawTransaction(signedTransactions).do();
  return waitForConfirmation(client, txid, 5);
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
  const results = await client.accountInformation(address).do();
  for (const local_state in results["apps-local-state"]){
    if (local_state["id"] === app_id) {
      if (!(local_state.includes('key-value'))){
        return {}
      }
    }
  }
  return {}
}
