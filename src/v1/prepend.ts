import algosdk, { SuggestedParams } from "algosdk"
import { Transactions } from "./utils"
import { managerStrings } from "./contractStrings"

//Need to figure out how to skip parameters in a function clal for ts

const NUM_DUMMY_TXNS = 9
let dummyTxnNumToWord = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten"
}

export function getInitTxns(
  transactionType: Transactions,
  sender: string,
  suggestedParams: SuggestedParams,
  managerAppId: number,
  supportedMarketAppIds: number[],
  supportedOracleAppIds: number[],
  storageAccount: string
) {
  console.log("GET INIT TXNS IN PREPEND.TS\n")
  //We need to do a deep copy here, here it is just a shallow copy
  let suggestedParamsModified = suggestedParams
  let listTxnTypes = [
    Transactions.MINT,
    Transactions.BURN,
    Transactions.REMOVE_COLLATERAL,
    Transactions.REMOVE_COLLATERAL_UNDERLYING,
    Transactions.BORROW,
    Transactions.REPAY_BORROW,
    Transactions.LIQUIDATE,
    Transactions.CLAIM_REWARDS
  ]
  if (listTxnTypes.includes(transactionType)) {
    suggestedParamsModified.fee = 2000
  }
  const enc = new TextEncoder()

  //Not sure if we have to encode a note here which is a random number
  let txn0 = algosdk.makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    managerAppId,
    [enc.encode(managerStrings.fetch_market_variables)],
    undefined,
    supportedMarketAppIds
  )

  let txn1 = algosdk.makeApplicationNoOpTxn(
    sender,
    suggestedParamsModified,
    managerAppId,
    [enc.encode(managerStrings.update_prices)],
    undefined,
    supportedOracleAppIds
  )

  let txn2 = algosdk.makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    managerAppId,
    [enc.encode(managerStrings.update_protocol_data)],
    [storageAccount],
    supportedMarketAppIds
  )

  let dummyTxns = [txn0, txn1, txn2]

  for (let i = 1; i < NUM_DUMMY_TXNS + 1; i++) {
    let txn = algosdk.makeApplicationNoOpTxn(
      sender,
      suggestedParams,
      managerAppId,
      [enc.encode("dummy_" + dummyTxnNumToWord[i])],
      undefined,
      supportedMarketAppIds
    )
    dummyTxns.push(txn)
  }
  return dummyTxns
}
