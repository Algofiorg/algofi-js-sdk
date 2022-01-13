import algosdk, { Algodv2, Transaction } from "algosdk"
import { getParams, waitForConfirmation, buildUserTransaction, getLeadingTxs } from "./extraUtils/submissionUtils"
export { getParams, waitForConfirmation }
import {
  getStorageAddress,
  getPriceInfo,
  getBalanceInfo,
  getGlobalManagerInfo,
  getGlobalMarketInfo,
  getUserManagerData,
  getUserMarketData,
  getAccountOptInData,
  extrapolateMarketData,
  extrapolateUserData,
  updateGlobalUserTotals,
  updateGlobalTotals
} from "./extraUtils/stateUtils"
export { getUserManagerData, getGlobalManagerInfo, getStorageAddress }
import { managerStrings, marketStrings } from "./contractStrings"
export { managerStrings, marketStrings }
import {
  orderedAssets,
  orderedAssetsAndPlaceholders,
  protocolManagerAppId,
  assetDictionary,
  orderedOracleAppIds,
  orderedMarketAppIds,
  orderedSupportedMarketAppIds,
  SECONDS_PER_YEAR,
  PARAMETER_SCALE_FACTOR,
  SCALE_FACTOR,
  foreignAppIds
} from "./config"
import { Base64Encoder } from "./extraUtils/encoder"
export {
  getAccountOptInData,
  orderedAssets,
  orderedAssetsAndPlaceholders,
  protocolManagerAppId,
  assetDictionary,
  orderedOracleAppIds,
  orderedMarketAppIds,
  orderedSupportedMarketAppIds,
  SECONDS_PER_YEAR,
  PARAMETER_SCALE_FACTOR,
  SCALE_FACTOR,
  Base64Encoder
}
import { Asset } from "./asset"
import { prepareAddCollateralTransactions } from "./addCollateral"
import { prepareBorrowTransactions } from "./borrow"
import { prepareBurnTransactions } from "./burn"
import { prepareClaimRewardsTransactions } from "./claimRewards"
import { prepareMintTransactions } from "./mint"
import { prepareMintToCollateralTransactions } from "./mintToCollateral"
import { prepareRemoveCollateralTransactions } from "./removeCollateral"
import { prepareRemoveCollateralUnderlyingTransactions } from "./removeCollateralUnderlying"
import { prepareRepayBorrowTransactions } from "./repayBorrow"

export {
  Asset,
  prepareAddCollateralTransactions,
  prepareBorrowTransactions,
  prepareBurnTransactions,
  prepareClaimRewardsTransactions,
  prepareMintTransactions,
  prepareMintToCollateralTransactions,
  prepareRemoveCollateralTransactions,
  prepareRemoveCollateralUnderlyingTransactions,
  prepareRepayBorrowTransactions
}

/**
 * Function to create transactions to opt address into our market contracts
 *
 * @param   {Algodv2}         algoClient
 * @param   {string}          address
 *
 * @return  {Transaction[]}   transaction group to opt into algofi markets contracts
 */
export async function optInMarkets(algodClient: Algodv2, address: string): Promise<Transaction[]> {
  const params = await getParams(algodClient)

  // get app opt in data
  let accountInfo = await algodClient.accountInformation(address).do()
  let accountOptInData = await getAccountOptInData(accountInfo)

  let accountOptedInApps = []
  for (const app of accountOptInData["apps"]) {
    accountOptedInApps.push(app["id"])
  }

  let txns = []
  for (const marketAppId of orderedMarketAppIds) {
    if (!(marketAppId in accountOptedInApps)) {
      txns.push(
        algosdk.makeApplicationOptInTxnFromObject({
          from: address,
          appIndex: marketAppId,
          suggestedParams: params,
          accounts: undefined,
          foreignApps: undefined,
          foreignAssets: undefined,
          rekeyTo: undefined
        })
      )
    }
  }
  algosdk.assignGroupID(txns)
  return txns
}

/**
 * Function to get opt in transactions for algofi supported assets
 *
 * @param   {Algodv2}         algoClient
 * @param   {string}          stakeAsset
 * @param   {string}          address
 * @param   {string}          storageAddress
 * @param   {number}          storageAddressFundingAmount
 *
 * @return  {Transaction[]}   create transactions to opt in to Staker and rekey storage address to manager contract
 */
export async function optInStaker(
  algodClient: Algodv2,
  stakeAsset: string,
  address: string,
  storageAddress: string,
  storageAddressFundingAmount: number
) {
  const params = await getParams(algodClient)

  let txns = []

  // fund storage account
  txns.push(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: address,
      amount: storageAddressFundingAmount,
      to: storageAddress,
      suggestedParams: params,
      closeRemainderTo: undefined,
      rekeyTo: undefined
    })
  )

  // opt in storage account
  txns.push(
    algosdk.makeApplicationOptInTxnFromObject({
      from: storageAddress,
      appIndex: assetDictionary[stakeAsset]["marketAppId"],
      suggestedParams: params,
      accounts: undefined,
      foreignApps: undefined,
      foreignAssets: undefined,
      rekeyTo: undefined
    })
  )

  // opt user into manager
  txns.push(
    algosdk.makeApplicationOptInTxnFromObject({
      from: address,
      appIndex: assetDictionary[stakeAsset]["managerAppId"],
      suggestedParams: params,
      foreignApps: [assetDictionary[stakeAsset]["marketAppId"]],
      accounts: undefined,
      foreignAssets: undefined,
      rekeyTo: undefined
    })
  )

  // opt storage account into manager
  txns.push(
    algosdk.makeApplicationOptInTxnFromObject({
      from: storageAddress,
      appIndex: assetDictionary[stakeAsset]["managerAppId"],
      suggestedParams: params,
      rekeyTo: algosdk.getApplicationAddress(assetDictionary[stakeAsset]["managerAppId"]),
      foreignApps: undefined,
      accounts: undefined,
      foreignAssets: undefined
    })
  )

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
export async function optInUnderlyingAssets(
  algodClient: Algodv2,
  address: string
): Promise<Transaction[][] | Transaction[]> {
  // get currently opted in assets
  let accountInfo = await algodClient.accountInformation(address).do()
  let accountOptInData = await getAccountOptInData(accountInfo)

  let accountOptedInAssets = []
  for (const asset of accountOptInData["assets"]) {
    accountOptedInAssets.push(asset["asset-id"])
  }
  accountOptedInAssets.push(1)

  const params = await getParams(algodClient)
  let underlying_asset_txns = []
  for (const assetName of orderedAssets) {
    // get underlying and bank asset ids
    let underlyingAssetId = assetDictionary[assetName]["underlyingAssetId"]
    // opt into underlying asset if not already opted in
    if (!accountOptedInAssets.includes(underlyingAssetId) && underlyingAssetId != 1) {
      underlying_asset_txns.push(
        algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          // Escrow txn
          suggestedParams: params,
          to: address,
          amount: 0,
          assetIndex: underlyingAssetId,
          from: address,
          rekeyTo: undefined,
          revocationTarget: undefined
        })
      )
    }
  }
  let combinedAssets = underlying_asset_txns
  algosdk.assignGroupID(combinedAssets)
  return combinedAssets
}

/**
 * Function to get opt in transactions for algofi supported assets
 *
 * @param   {Algodv2}         algoClient
 * @param   {string}          address
 * @param   {string}          storageAddress
 * @param   {number}          storageAddressFundingAmount
 *
 * @return  {Transaction[]}   create transactions to opt in to manager and rekey storage address to manager contract
 */
export async function optInManager(
  algodClient: Algodv2,
  address: string,
  storageAddress: string,
  storageAddressFundingAmount: number
): Promise<Transaction[]> {
  const params = await getParams(algodClient)
  // initialize encoder
  const enc = new TextEncoder()

  let txns = []
  // fund storage account
  txns.push(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: address,
      amount: storageAddressFundingAmount,
      to: storageAddress,
      suggestedParams: params,
      closeRemainderTo: undefined,
      rekeyTo: undefined
    })
  )

  // opt storage account into markets
  for (const marketAppId of orderedMarketAppIds.slice(0, 13)) {
    txns.push(
      algosdk.makeApplicationOptInTxnFromObject({
        from: storageAddress,
        appIndex: marketAppId,
        suggestedParams: params,
        accounts: undefined,
        foreignApps: undefined,
        foreignAssets: undefined,
        rekeyTo: undefined
      })
    )
  }

  // opt user into manager
  txns.push(
    algosdk.makeApplicationOptInTxnFromObject({
      from: address,
      appIndex: protocolManagerAppId,
      suggestedParams: params,
      accounts: undefined,
      foreignApps: foreignAppIds,
      foreignAssets: undefined,
      rekeyTo: undefined
    })
  )

  // opt storage account into manager
  txns.push(
    algosdk.makeApplicationOptInTxnFromObject({
      from: storageAddress,
      appIndex: protocolManagerAppId,
      suggestedParams: params,
      rekeyTo: algosdk.getApplicationAddress(protocolManagerAppId),
      foreignApps: undefined,
      accounts: undefined,
      foreignAssets: undefined
    })
  )

  algosdk.assignGroupID(txns)
  return txns
}

export async function getProtocolData(algodClient: Algodv2): Promise<any> {
  // initialize return variables
  let globalResults = {}
  // get current time in seconds
  let currentUnixTime = Date.now()
  currentUnixTime = Math.floor(currentUnixTime / 1000)
  // initialize accountInfo

  // get prices
  let prices = await getPriceInfo(algodClient)
  globalResults["manager"] = {}
  let globalManagerData = await getGlobalManagerInfo(algodClient)
  if (globalManagerData && Object.keys(globalManagerData).length > 0) {
    for (const [key, value] of Object.entries(globalManagerData)) {
      globalResults["manager"][key] = value
    }
  }

  // get and set data for each market
  for (const assetName of orderedAssets) {
    // get market global data
    let globalData = await getGlobalMarketInfo(algodClient, assetDictionary[assetName]["marketAppId"])
    if (globalData && Object.keys(globalData).length > 0) {
      globalResults[assetName] = globalData
      globalResults[assetName]["price"] = prices[assetName]
      // get extrapolated global data
      let globalExtrapolatedData = await extrapolateMarketData(globalData, prices, assetName)
      for (const [key, value] of Object.entries(globalExtrapolatedData)) {
        globalResults[assetName][key] = value
      }
    }
  }

  // update global totals
  await updateGlobalTotals(globalResults)
  return globalResults
}

/**
 * Funtion to get user data from the protocol as well as totals
 *
 * @param   {Algodv2}   algodClient
 * @param   {string}    address
 *
 * @return  {[dict<string,n>, dict<string,n>]} dictionaries containing the aggregated user protocol data
 */
export async function getUserAndProtocolData(algodClient: Algodv2, address: string): Promise<any> {
  // initialize return variables
  let userResults = {}
  let globalResults = {}
  let userActiveMarkets = []
  // get current time in seconds
  let currentUnixTime = Date.now()
  currentUnixTime = Math.floor(currentUnixTime / 1000)
  // initialize accountInfo
  let accountInfo = await algodClient.accountInformation(address).do()
  // get stoarage account info
  let storageAccount = await getStorageAddress(accountInfo)
  userResults["storageAccount"] = storageAccount
  let storageAccountInfo = null
  if (storageAccount) {
    storageAccountInfo = await algodClient.accountInformation(storageAccount).do()
  }
  // get user storage account info
  userResults["manager"] = {}
  if (storageAccount) {
    let userManagerData = await getUserManagerData(storageAccountInfo)
    for (const [key, value] of Object.entries(userManagerData)) {
      userResults["manager"][key] = value
    }
  }
  // get balances
  let balances = await getBalanceInfo(algodClient, address)
  // get prices
  let prices = await getPriceInfo(algodClient)
  globalResults["manager"] = {}
  let globalManagerData = await getGlobalManagerInfo(algodClient)
  if (globalManagerData && Object.keys(globalManagerData).length > 0) {
    for (const [key, value] of Object.entries(globalManagerData)) {
      globalResults["manager"][key] = value
    }
  }
  // get and set data for each market
  for (const assetName of orderedAssets) {
    let bAssetName = "b" + assetName
    // initialize user market results
    userResults[assetName] = {}
    userResults[bAssetName] = {}
    userResults["STBL-ALGO-LP"] = balances[""]
    userResults["STBL-USDC-LP"] = balances[""]
    userResults["STBL-YLDY-LP"] = balances[""]
    // set balances
    userResults[assetName]["balance"] = balances[assetName]
    userResults[bAssetName]["balance"] = balances[bAssetName]

    // get market global data
    let globalData = await getGlobalMarketInfo(algodClient, assetDictionary[assetName]["marketAppId"])
    if (globalData && Object.keys(globalData).length > 0) {
      globalResults[assetName] = globalData
      globalResults[assetName]["price"] = prices[assetName]
      // get extrapolated global data
      let globalExtrapolatedData = await extrapolateMarketData(globalData, prices, assetName)
      for (const [key, value] of Object.entries(globalExtrapolatedData)) {
        globalResults[assetName][key] = value
      }
    }
    if (storageAccount) {
      let userMarketData = await getUserMarketData(storageAccountInfo, globalResults, assetName)
      if (userMarketData && Object.keys(userMarketData).length > 0) {
        // store active markets to be used for totaling operation
        userActiveMarkets.push(assetName)

        for (const [key, value] of Object.entries(userMarketData)) {
          userResults[assetName][key] = value
        }

        // get extrapolated user data
        if (userResults && Object.keys(userResults).length > 0) {
          let userExtrapolatedData = await extrapolateUserData(userResults, globalResults, assetName)
          for (const [key, value] of Object.entries(userExtrapolatedData)) {
            userResults[assetName][key] = value
          }
        }
      }
    }
  }

  // update global totals
  await updateGlobalTotals(globalResults)

  // update user totals
  if (storageAccount) {
    await updateGlobalUserTotals(userResults, globalResults, userActiveMarkets)
  }

  // get opt in data
  let optInData = await getAccountOptInData(accountInfo)
  userResults["minBalance"] = Number(optInData["min_balance"])
  userResults["minBalancePrimaryAccount"] = Number(optInData["min_balance_primary_account"])
  userResults["minBalanceStorageAccount"] = Number(optInData["min_balance_storage_account"])
  userResults["optedInApps"] = optInData["apps"]
  userResults["optedInAssets"] = optInData["assets"]

  return [userResults, globalResults]
}
