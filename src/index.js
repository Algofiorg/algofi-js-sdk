import algosdk from "algosdk"
import { getParams, waitForConfirmation, buildUserTransaction, getLeadingTxs } from "./submissionUtils.js"
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
} from "./stateUtils.js"
import {
  orderedAssets,
  orderedAssetsAndPlaceholders,
  managerAppId,
  assetDictionary,
  orderedOracleAppIds,
  orderedMarketAppIds,
  orderedSupportedMarketAppIds,
  SECONDS_PER_YEAR,
  PARAMETER_SCALE_FACTOR,
  SCALE_FACTOR
} from "./config.js"
import { Base64Encoder } from "./encoder.js"
export {
  // FOR TESTING
  getPriceInfo,
  getBalanceInfo,
  getUserMarketData,
  getGlobalMarketInfo,
  extrapolateMarketData,
  extrapolateUserData,
  updateGlobalUserTotals,
  updateGlobalTotals,
  getStorageAddress,
  getGlobalManagerInfo,
  Base64Encoder,
  //
  getAccountOptInData,
  orderedAssets,
  orderedAssetsAndPlaceholders,
  managerAppId,
  assetDictionary,
  orderedOracleAppIds,
  orderedMarketAppIds,
  orderedSupportedMarketAppIds,
  SECONDS_PER_YEAR,
  PARAMETER_SCALE_FACTOR,
  SCALE_FACTOR
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
          suggestedParams: params
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
 * @param   {string}          address
 *
 * @return  {Transaction[]}   get opt in transactions for non opted in algofi assets
 */
export async function optInAssets(algodClient, address) {
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
  let bank_asset_txns = []
  for (const assetName of orderedAssets) {
    // get underlying and bank asset ids
    let bankAssetId = assetDictionary[assetName]["bankAssetId"]
    let underlyingAssetId = assetDictionary[assetName]["underlyingAssetId"]
    // opt into underlying asset if not already opted in
    if (!(underlyingAssetId in accountOptedInAssets) && underlyingAssetId != 1) {
      underlying_asset_txns.push(
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
    if (!(bankAssetId in accountOptedInAssets)) {
      bank_asset_txns.push(
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
  }
  if (underlying_asset_txns.length + bank_asset_txns.length > 16) {
    algosdk.assignGroupID(underlying_asset_txns)
    algosdk.assignGroupID(bank_asset_txns)
    return [underlying_asset_txns, bank_asset_txns]
  } else {
    let combinedAssets = underlying_asset_txns.concat(bank_asset_txns)
    algosdk.assignGroupID(combinedAssets)
    return combinedAssets
  }
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
  let bankAssetId = assetDictionary[assetName]["bankAssetId"]
  let underlyingAssetId = assetDictionary[assetName]["underlyingAssetId"]

  let txns = await buildUserTransaction(
    algodClient,
    address,
    storageAddress,
    marketAppId,
    bankAssetId,
    "mint",
    NO_EXTRA_ARGS,
    marketAddress,
    underlyingAssetId,
    amount
  )
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
  let bankAssetId = assetDictionary[assetName]["bankAssetId"]
  let underlyingAssetId = assetDictionary[assetName]["underlyingAssetId"]

  let txns = await buildUserTransaction(
    algodClient,
    address,
    storageAddress,
    marketAppId,
    bankAssetId,
    "mint_to_collateral",
    NO_EXTRA_ARGS,
    marketAddress,
    underlyingAssetId,
    amount
  )
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
  let bankAssetId = assetDictionary[assetName]["bankAssetId"]
  let underlyingAssetId = assetDictionary[assetName]["underlyingAssetId"]

  let txns = await buildUserTransaction(
    algodClient,
    address,
    storageAddress,
    marketAppId,
    underlyingAssetId,
    "burn",
    NO_EXTRA_ARGS,
    marketAddress,
    bankAssetId,
    amount
  )
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
  let bankAssetId = assetDictionary[assetName]["bankAssetId"]
  let underlyingAssetId = assetDictionary[assetName]["underlyingAssetId"]

  let txns = await buildUserTransaction(
    algodClient,
    address,
    storageAddress,
    marketAppId,
    underlyingAssetId,
    "add_collateral",
    NO_EXTRA_ARGS,
    marketAddress,
    bankAssetId,
    amount
  )
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
  let bankAssetId = assetDictionary[assetName]["bankAssetId"]
  let underlyingAssetId = assetDictionary[assetName]["underlyingAssetId"]

  let txns = await buildUserTransaction(
    algodClient,
    address,
    storageAddress,
    marketAppId,
    bankAssetId,
    "remove_collateral",
    algosdk.encodeUint64(amount)
  )
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
  let bankAssetId = assetDictionary[assetName]["bankAssetId"]
  let underlyingAssetId = assetDictionary[assetName]["underlyingAssetId"]

  let txns = await buildUserTransaction(
    algodClient,
    address,
    storageAddress,
    marketAppId,
    underlyingAssetId,
    "remove_collateral_underlying",
    algosdk.encodeUint64(amount)
  )
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
  let bankAssetId = assetDictionary[assetName]["bankAssetId"]
  let underlyingAssetId = assetDictionary[assetName]["underlyingAssetId"]

  let txns = await buildUserTransaction(
    algodClient,
    address,
    storageAddress,
    marketAppId,
    underlyingAssetId,
    "borrow",
    algosdk.encodeUint64(amount)
  )
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
  let bankAssetId = assetDictionary[assetName]["bankAssetId"]
  let underlyingAssetId = assetDictionary[assetName]["underlyingAssetId"]

  let txns = await buildUserTransaction(
    algodClient,
    address,
    storageAddress,
    marketAppId,
    underlyingAssetId,
    "repay_borrow",
    NO_EXTRA_ARGS,
    marketAddress,
    underlyingAssetId,
    amount
  )
  algosdk.assignGroupID(txns)
  return txns
}

/**
 * Function to create transaction array for algofi repay_borrow operation
 *
 * @param   {AlgodV2}   algodClient
 * @param   {string}    address
 * @param   {string}    storageAddress
 * @param   {string}       assetName
 * @param   {string}    assetName2
 *
 * @return {Transaction[]} array of transactions to be sent as group transaction to perform repay_borrow operation
 */
export async function claimRewards(algodClient, address, storageAddress, assetName = "ALGO", assetName2 = "ALGO") {
  let primaryRewardsAsset = assetDictionary[assetName]["underlyingAssetId"]
  let secondaryRewardsAsset = assetDictionary[assetName2]["underlyingAssetId"]

  // initialize encoder
  const enc = new TextEncoder()

  let txns = []

  // get preamble transactions
  let leadingTxs = await getLeadingTxs(algodClient, address, storageAddress)
  leadingTxs.forEach(txn => {
    txns.push(txn)
  })

  let foreign_assets = []
  if (primaryRewardsAsset != 1) {
    foreign_assets.push(primaryRewardsAsset)
  }
  if (secondaryRewardsAsset != 1) {
    foreign_assets.push(secondaryRewardsAsset)
  }

  // construct manager pseudo-function transaction
  const params = await getParams(algodClient)
  const claimRewardsTxn = algosdk.makeApplicationNoOpTxnFromObject({
    from: address,
    appIndex: managerAppId,
    appArgs: [enc.encode("claim_rewards")],
    suggestedParams: params,
    foreignAssets: foreign_assets,
    accounts: [storageAddress],
    note: enc.encode("Manager: Claim rewards")
  })
  txns.push(claimRewardsTxn)

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
  // initialize return variables
  let userResults = { maxBorrowUSD: 0, borrowUSD: 0, collateralUSD: 0 }
  let globalResults = { underlying_supplied_extrapolatedUSD: 0, underlying_borrowed_extrapolatedUSD: 0 }

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
    // set balances
    userResults[assetName]["balance"] = balances[assetName]
    userResults[bAssetName]["balance"] = balances[bAssetName]

    // get storage account data
    let userMarketData = null
    if (storageAccount) {
      let userMarketData = await getUserMarketData(storageAccountInfo, assetName)
      if (userMarketData && Object.keys(userMarketData).length > 0) {
        for (const [key, value] of Object.entries(userMarketData)) {
          userResults[assetName][key] = value
        }
      }
    }

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
      await updateGlobalTotals(globalResults, assetName)
    }

    if (storageAccount) {
      let userMarketData = await getUserMarketData(storageAccountInfo, assetName)
      if (userMarketData && Object.keys(userMarketData).length > 0) {
        for (const [key, value] of Object.entries(userMarketData)) {
          userResults[assetName][key] = value
        }

        // get extrapolated user data
        if (userResults && Object.keys(userResults).length > 0) {
          let userExtrapolatedData = await extrapolateUserData(userResults, globalResults, assetName)
          for (const [key, value] of Object.entries(userExtrapolatedData)) {
            userResults[assetName][key] = value
          }
          await updateGlobalUserTotals(userResults, assetName)
        }
      }
    }
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
