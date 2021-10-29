import algosdk from "algosdk"
import { getParams, waitForConfirmation, buildUserTransaction } from "./submissionUtils.js"
export { getParams, waitForConfirmation }
import {
  getStorageAddress,
  getPriceInfo,
  getBalanceInfo,
  getGlobalMarketInfo,
  getUserMarketData,
  extrapolateMarketData,
  extrapolateUserData,
  calculateUserData
} from "./stateUtils.js"
import {
  getAccountOptInData,
  orderedAssets,
  managerAppId,
  assetDictionary,
  orderedOracleAppIds,
  orderedMarketAppIds,
  SECONDS_PER_YEAR,
  RESERVE_RATIO,
  SCALE_FACTOR,
  CREATOR_ADDRESS
} from "./config.js"
export {
  orderedAssets,
  managerAppId,
  assetDictionary,
  orderedOracleAppIds,
  orderedMarketAppIds,
  SECONDS_PER_YEAR,
  RESERVE_RATIO,
  SCALE_FACTOR,
  CREATOR_ADDRESS
}

const NO_EXTRA_ARGS = null

/**
 * Function to create transactions to opt address into our market contracts
 *
 * @param   {Algodv2}         algoClient
 * @param   {string}          address
 * 
 * @return  {Transaction[]}   transaction group to opt into algofi markets contracts
 */
export async function optInMarkets(algodClient, address) {
  const params = await getParams(algodClient)
  let txns = []
  for (const marketAppId in orderedMarketAppIds) {
    txns.push(
      algosdk.makeApplicationOptInTxnFromObject({
        from: address,
        appIndex: marketAppId,
        suggestedParams: params
      })
    )
  }
  algosdk.assignGroupID(txns)
  return txns
}

/**
 * Function to get opt in transactions for algofi supported assets
 *
 * @param   {Algodv2}         algoClient
 * @param   {string}          address
 * 
 * @return  {Transaction[]}   get opt in transactions for non opted in algofi assets
 */
export async function optInAssets(algodClient, address) {
  // get currently opted in assets
  let accountInfo = await algodClient.accountInformation(address).do()
  let accountOptInData = getAccountOptInData(accountInfo)
  console.log(accountOptInData); // TODO remove

  const params = await getParams(algodClient)
  let txns = []
  for (const assetName of orderedAssets) {
    // get underlying and bank asset ids
    let bankAssetId = assetDictionary[assetName]["underlyingAssetId"]
    let underlyingAssetId = assetDictionary[assetName]["bankAssetId"]
    // opt into underlying asset (skip algo)
    if (assetName != "ALGO") {
      txns.push(
        algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          // Escrow txn
          suggestedParams: params,
          to: address,
          amount: 0,
          assetIndex: underlyingAssetId,
          from: address
        })
      )
    }
    // opt into bank asset
    txns.push(
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        // Escrow txn
        suggestedParams: params,
        to: address,
        amount: 0,
        assetIndex: bankAssetId,
        from: address
      })
    )
  }
  algosdk.assignGroupID(txns)
  return txns
}

/**
 * Function to get opt in transactions for algofi supported assets
 *
 * @param   {Algodv2}         algoClient
 * @param   {string}          address
 * @param   {string}          storageAddress
 * 
 * @return  {Transaction[]}   create transactions to opt in to manager and rekey storage address to manager contract
 */
export async function optInManager(algodClient, address, storageAddress) {
  const params = await getParams(algodClient)
  let txns = []
  txns.push(
    algosdk.makeApplicationOptInTxnFromObject({
      from: address,
      appIndex: managerAppId,
      suggestedParams: params
    })
  )
  txns.push(
    algosdk.makeApplicationOptInTxnFromObject({
      from: storageAddress,
      appIndex: managerAppId,
      suggestedParams: params,
      rekeyTo: algosdk.getApplicationAddress(managerAppId)
    })
  )
  algosdk.assignGroupID(txns)
  return txns
}

/**
 * Function to create transaction array for algofi mint operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 * @param   {int}       amount
 * @param   {string}    assetName
 * 
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform mint operation
 */
export async function mint(algodClient, address, storageAddress, amount, assetName) {
  let marketAppId = assetDictionary[assetName]["marketAppId"]
  let marketAddress = assetDictionary[assetName]["marketAddress"]
  let bankAssetId = assetDictionary[assetName]["underlyingAssetId"]
  let underlyingAssetId = assetDictionary[assetName]["bankAssetId"]
  
  let txns = await buildUserTransaction(algodClient, address, storageAddress, marketAppId, bankAssetId, "mint", NO_EXTRA_ARGS, marketAddress, underlyingAssetId, amount)
  algosdk.assignGroupID(txns)
  return txns
}

/**
 * Function to create transaction array for algofi mint_to_collateral operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 * @param   {int}       amount
 * @param   {string}    assetName
 * 
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform mint_to_collateral operation
 */
export async function mintToCollateral(algodClient, address, storageAddress, amount, assetName) {
  let marketAppId = assetDictionary[assetName]["marketAppId"]
  let marketAddress = assetDictionary[assetName]["marketAddress"]
  let bankAssetId = assetDictionary[assetName]["underlyingAssetId"]
  let underlyingAssetId = assetDictionary[assetName]["bankAssetId"]
  
  let txns = await buildUserTransaction(algodClient, address, storageAddress, marketAppId, bankAssetId, "mint_to_collateral", NO_EXTRA_ARGS, marketAddress, underlyingAssetId, amount)
  algosdk.assignGroupID(txns)
  return txns
}

/**
 * Function to create transaction array for algofi burn operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 * @param   {int}       amount
 * @param   {string}    assetName
 * 
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform burn operation
 */
export async function burn(algodClient, address, storageAddress, amount, assetName) {
  let marketAppId = assetDictionary[assetName]["marketAppId"]
  let marketAddress = assetDictionary[assetName]["marketAddress"]
  let bankAssetId = assetDictionary[assetName]["underlyingAssetId"]
  let underlyingAssetId = assetDictionary[assetName]["bankAssetId"]
  
  let txns = await buildUserTransaction(algodClient, address, storageAddress, marketAppId, underlyingAssetId, "burn", NO_EXTRA_ARGS, marketAddress, bankAssetId, amount)
  algosdk.assignGroupID(txns)
  return txns
}

/**
 * Function to create transaction array for algofi add_collateral operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 * @param   {int}       amount
 * @param   {string}    assetName
 * 
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform add_collateral operation
 */
export async function addCollateral(algodClient, address, storageAddress, amount, assetName) {
  let marketAppId = assetDictionary[assetName]["marketAppId"]
  let marketAddress = assetDictionary[assetName]["marketAddress"]
  let bankAssetId = assetDictionary[assetName]["underlyingAssetId"]
  let underlyingAssetId = assetDictionary[assetName]["bankAssetId"]
  
  let txns = await buildUserTransaction(algodClient, address, storageAddress, marketAppId, underlyingAssetId, "add_collateral", NO_EXTRA_ARGS, marketAddress, bankAssetId, amount)
  algosdk.assignGroupID(txns)
  return txns
}

/**
 * Function to create transaction array for algofi remove_collateral operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 * @param   {int}       amount
 * @param   {string}    assetName
 * 
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform remove_collateral operation
 */
export async function removeCollateral(algodClient, address, storageAddress, amount, assetName) {
  let marketAppId = assetDictionary[assetName]["marketAppId"]
  let marketAddress = assetDictionary[assetName]["marketAddress"]
  let bankAssetId = assetDictionary[assetName]["underlyingAssetId"]
  let underlyingAssetId = assetDictionary[assetName]["bankAssetId"]
  
  let txns = await buildUserTransaction(algodClient, address, storageAddress, marketAppId, bankAssetId, "remove_collateral", algosdk.encodeUint64(amount))
  algosdk.assignGroupID(txns)
  return txns
}

/**
 * Function to create transaction array for algofi remove_collateral_underlying operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 * @param   {int}       amount
 * @param   {string}    assetName
 * 
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform remove_collateral_underlying operation
 */
export async function removeCollateralUnderlying(algodClient, address, storageAddress, amount, assetName) {
  let marketAppId = assetDictionary[assetName]["marketAppId"]
  let marketAddress = assetDictionary[assetName]["marketAddress"]
  let bankAssetId = assetDictionary[assetName]["underlyingAssetId"]
  let underlyingAssetId = assetDictionary[assetName]["bankAssetId"]
  
  let txns = await buildUserTransaction(algodClient, address, storageAddress, marketAppId, underlyingAssetId, "remove_collateral_underlying", algosdk.encodeUint64(amount))
  algosdk.assignGroupID(txns)
  return txns
}

/**
 * Function to create transaction array for algofi borrow operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 * @param   {int}       amount
 * @param   {string}    assetName
 * 
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform borrow operation
 */
export async function borrow(algodClient, address, storageAddress, amount, assetName) {
  let marketAppId = assetDictionary[assetName]["marketAppId"]
  let marketAddress = assetDictionary[assetName]["marketAddress"]
  let bankAssetId = assetDictionary[assetName]["underlyingAssetId"]
  let underlyingAssetId = assetDictionary[assetName]["bankAssetId"]
  
  let txns = await buildUserTransaction(algodClient, address, storageAddress, marketAppId, underlyingAssetId, "borrow", algosdk.encodeUint64(amount))
  algosdk.assignGroupID(txns)
  return txns
}

/**
 * Function to create transaction array for algofi repay_borrow operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 * @param   {int}       amount
 * @param   {string}    assetName
 * 
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform repay_borrow operation
 */
export async function repayBorrow(algodClient, address, storageAddress, amount, assetName) {
  let marketAppId = assetDictionary[assetName]["marketAppId"]
  let marketAddress = assetDictionary[assetName]["marketAddress"]
  let bankAssetId = assetDictionary[assetName]["underlyingAssetId"]
  let underlyingAssetId = assetDictionary[assetName]["bankAssetId"]
  
  let txns = await buildUserTransaction(algodClient, address, storageAddress, marketAppId, underlyingAssetId, "repay_borrow", NO_EXTRA_ARGS, marketAddress, underlyingAssetId, amount)
  algosdk.assignGroupID(txns)
  return txns
}

/**
 * Funtion to get user data from the protocol as well as totals
 *
 * @param   {Algodv2}   algodClient
 * @param   {string}    address
 * 
 * @return  {[dict<string,n>, dict<string,n>]} dictionaries containing the aggregated user protocol data
 */
export async function getUserAndProtocolData(algodClient, address) {
  let userResults = { suppliedUSD: 0, maxBorrowUSD: 0, borrowUSD: 0, collateralUSD: 0 }
  let globalResults = {}

  let currentUnixTime = Date.now()
  currentUnixTime = Math.floor(currentUnixTime / 1000)
  let accountInfo = await algodClient.accountInformation(address).do()
  //  let globalInfo = await algodClient.accountInformation(CREATOR_ADDRESS).do()

  let storageAccount = await getStorageAddress(accountInfo)
  userResults["storageAccount"] = storageAccount
  let storageAccountInfo = null
  if (storageAccount) {
    storageAccountInfo = await algodClient.accountInformation(storageAccount).do()
  }
  let balances = await getBalanceInfo(algodClient, address)

  let prices = await getPriceInfo(algodClient)
  for (const assetName of orderedAssets) {
    userResults[assetName] = {
      borrowed: 0,
      collateral: 0,
      initial_index: 0,
      supplied_underlying: 0,
      borrowed_current_extrapolated: 0,
      balance: balances[assetName]
    }
    userResults["b" + assetName] = { balance: balances["b" + assetName], minted: 0 }
    let userData = null
    if (storageAccount) {
      userData = await getUserMarketData(storageAccountInfo, assetName)
    }
    let globalData = await getGlobalMarketInfo(algodClient, assetDictionary[assetName]["marketAppId"])

    if (globalData && Object.keys(globalData).length > 0) {
      globalResults[assetName] = globalData
      globalData["price"] = prices[assetName]
      let globalExtrapolatedData = await extrapolateMarketData(globalData)
      //delete globalResults[assetName]["borrow_index"]
      //delete globalResults[assetName]["underlying_borrowed"]
      //delete globalResults[assetName]["underlying_cash"]
      //delete globalResults[assetName]["underlying_reserves"]
      //delete globalResults[assetName]["bank_to_underlying_exchange"]
      globalResults[assetName] = Object.assign({}, globalResults[assetName], globalExtrapolatedData)
    }

    if (userData && Object.keys(userData).length > 0) {
      for (const [key, value] of Object.entries(userData)) {
        userResults[assetName][key] = value
      }
      userResults["b" + assetName]["minted"] = userResults[assetName]["minted"]
      delete userResults[assetName]["minted"]
    }
    if (globalData && userData && Object.keys(userData).length > 0 && Object.keys(globalData).length > 0) {
      let userExtrapolatedData = await extrapolateUserData(userResults[assetName], globalResults[assetName])
      //delete globalResults[assetName]["borrowed"]
      userResults[assetName] = Object.assign({}, userResults[assetName], userExtrapolatedData)
      userResults = await calculateUserData(userResults, globalResults, assetName)
    }
  }
  return [userResults, globalResults]
}
