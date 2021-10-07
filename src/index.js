import algosdk from "algosdk"
import { getParams, waitForConfirmation, getCore } from "./submissionUtils.js"
export { getParams, waitForConfirmation }
import {
  getPriceInfo,
  getBalanceInfo,
  getStorageAddress,
  getGlobalMarketInfo,
  extrapolateMarketData,
  getUserMarketData,
  extrapolateUserData,
} from "./stateUtils.js"
import {
  orderedAssets,
  managerAppId,
  assetDictionary,
  orderedOracleAppIds,
  orderedMarketAppIds,
  SECONDS_PER_YEAR,
  RESERVE_RATIO,
  SCALE_FACTOR,
  CREATOR_ADDRESS,
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
  CREATOR_ADDRESS,
}

export async function optInMarkets(algodClient, address) {
  const params = await getParams(algodClient)
  let txns = []
  for (const assetName of orderedAssets) {
    txns.push(
      algosdk.makeApplicationOptInTxnFromObject({
        from: address,
        appIndex: assetDictionary[assetName]["marketAppId"],
        suggestedParams: params,
      })
    )
  }
  algosdk.assignGroupID(txns)
  return txns
}
export async function optInAssets(algodClient, address) {
  const params = await getParams(algodClient)
  let txns = []
  for (const assetName of orderedAssets) {
    if (assetName != "ALGO") {
      txns.push(
        algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          // Escrow txn
          suggestedParams: params,
          to: address,
          amount: 0,
          assetIndex: assetDictionary[assetName]["underlyingAssetId"],
          from: address,
        })
      )
    }
    txns.push(
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        // Escrow txn
        suggestedParams: params,
        to: address,
        amount: 0,
        assetIndex: assetDictionary[assetName]["bankAssetId"],
        from: address,
      })
    )
  }
  algosdk.assignGroupID(txns)
  return txns
}

export async function optInManager(algodClient, address, storageAddress) {
  const params = await getParams(algodClient)
  let txns = []
  txns.push(
    algosdk.makeApplicationOptInTxnFromObject({
      from: address,
      appIndex: managerAppId,
      suggestedParams: params,
    })
  )
  txns.push(
    algosdk.makeApplicationOptInTxnFromObject({
      from: storageAddress,
      appIndex: managerAppId,
      suggestedParams: params,
      rekeyTo: algosdk.getApplicationAddress(managerAppId),
    })
  )
  algosdk.assignGroupID(txns)
  return txns
}

export async function mint(algodClient, address, storageAddress, amount, assetName) {
  const params = await getParams(algodClient)
  let txns = await getCore(
    algodClient,
    address,
    storageAddress,
    assetDictionary[assetName]["marketAppId"],
    assetDictionary[assetName]["bankAssetId"],
    "mint"
  )
  txns.push(
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: address,
      to: assetDictionary[assetName]["marketAddress"],
      amount: amount,
      assetIndex: assetDictionary[assetName]["underlyingAssetId"],
      suggestedParams: params,
    })
  )
  algosdk.assignGroupID(txns)
  return txns
}

export async function mintToCollateral(algodClient, address, storageAddress, amount, assetName) {
  const params = await getParams(algodClient)
  let txns = await getCore(
    algodClient,
    address,
    storageAddress,
    assetDictionary[assetName]["marketAppId"],
    assetDictionary[assetName]["bankAssetId"],
    "mint_to_collateral"
  )
  txns.push(
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: address,
      to: assetDictionary[assetName]["marketAddress"],
      amount: amount,
      assetIndex: assetDictionary[assetName]["underlyingAssetId"],
      suggestedParams: params,
    })
  )
  algosdk.assignGroupID(txns)
  return txns
}

export async function burn(algodClient, address, storageAddress, amount, assetName) {
  const params = await getParams(algodClient)
  let txns = await getCore(
    algodClient,
    address,
    storageAddress,
    assetDictionary[assetName]["marketAppId"],
    assetDictionary[assetName]["underlyingAssetId"],
    "burn"
  )
  txns.push(
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: address,
      to: assetDictionary[assetName]["marketAddress"],
      amount: amount,
      assetIndex: assetDictionary[assetName]["bankAssetId"],
      suggestedParams: params,
    })
  )
  algosdk.assignGroupID(txns)
  return txns
}

export async function addCollateral(algodClient, address, storageAddress, amount, assetName) {
  const params = await getParams(algodClient)
  let txns = await getCore(
    algodClient,
    address,
    storageAddress,
    assetDictionary[assetName]["marketAppId"],
    assetDictionary[assetName]["underlyingAssetId"],
    "add_collateral"
  )
  txns.push(
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: address,
      to: assetDictionary[assetName]["marketAddress"],
      amount: amount,
      assetIndex: assetDictionary[assetName]["bankAssetId"],
      suggestedParams: params,
    })
  )
  algosdk.assignGroupID(txns)
  return txns
}

export async function removeCollateral(algodClient, address, storageAddress, amount, assetName) {
  let txns = await getCore(
    algodClient,
    address,
    storageAddress,
    assetDictionary[assetName]["marketAppId"],
    assetDictionary[assetName]["bankAssetId"],
    "remove_collateral",
    algosdk.encodeUint64(amount)
  )
  algosdk.assignGroupID(txns)
  return txns
}

export async function removeCollateralUnderlying(algodClient, address, storageAddress, amount, assetName) {
  let txns = await getCore(
    algodClient,
    address,
    storageAddress,
    assetDictionary[assetName]["marketAppId"],
    assetDictionary[assetName]["underlyingAssetId"],
    "remove_collateral_underlying",
    algosdk.encodeUint64(amount)
  )
  algosdk.assignGroupID(txns)
  return txns
}

export async function borrow(algodClient, address, storageAddress, amount, assetName) {
  let txns = await getCore(
    algodClient,
    address,
    storageAddress,
    assetDictionary[assetName]["marketAppId"],
    assetDictionary[assetName]["underlyingAssetId"],
    "borrow",
    algosdk.encodeUint64(amount)
  )
  algosdk.assignGroupID(txns)
  return txns
}

export async function repayBorrow(algodClient, address, storageAddress, amount, assetName) {
  const params = await getParams(algodClient)
  let txns = await getCore(
    algodClient,
    address,
    storageAddress,
    assetDictionary[assetName]["marketAppId"],
    assetDictionary[assetName]["underlyingAssetId"],
    "repay_borrow"
  )
  txns.push(
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: address,
      to: assetDictionary[assetName]["marketAddress"],
      amount: amount,
      assetIndex: assetDictionary[assetName]["underlyingAssetId"],
      suggestedParams: params,
    })
  )
  algosdk.assignGroupID(txns)
  return txns
}

//// HAS NOT BEEN TESTED...
export async function liquidate(algodClient, address, storageAddress, liquidateStorageAddress, amount, assetName) {
  const params = await getParams(algodClient)
  let txns = await getCore(
    algodClient,
    address,
    liquidateStorageAddress,
    assetDictionary[assetName]["marketAppId"],
    assetDictionary[assetName]["underlyingAssetId"],
    "liquidate"
  )
  txns.push(
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: address,
      to: assetDictionary[assetName]["marketAddress"],
      amount: amount,
      assetIndex: assetDictionary[assetName]["underlyingAssetId"],
      suggestedParams: params,
    })
  )
  txns.push(
    algosdk.makeApplicationNoOpTxnFromObject({
      from: address,
      appIndex: marketAppId,
      foreignApps: [managerAppId],
      appArgs: [enc.encode("liquidate")],
      accounts: [liquidateStorageAddress, storageAddress],
      suggestedParams: params,
      note: enc.encode("Market: " + functionString),
    })
  )
  algosdk.assignGroupID(txns)
  return txns
}

export async function getUserAndProtocolData(algodClient, address) {
  let userResults = {}
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
      balance: 0,
    }
    userResults["b" + assetName] = { balance: 0, minted: 0 }

    let userData = null
    if (storageAccount) {
      userData = await getUserMarketData(storageAccountInfo, assetName)
    }

    let globalData = await getGlobalMarketInfo(algodClient, assetDictionary[assetName]["marketAppId"])

    if (globalData && Object.keys(globalData).length > 0) {
      globalResults[assetName] = globalData
      let globalExtrpolatedData = await extrapolateMarketData(globalData)
      globalResults[assetName] = Object.assign({}, globalResults[assetName], globalExtrpolatedData)
      globalData["price"] = prices[assetName]
      globalData["underlying_supplied"] = globalData["underlying_cash"] + globalData["underlying_borrowed"]
    }

    if (userData && Object.keys(userData).length > 0) {
      userResults[assetName] = userData
      userResults[assetName]["balance"] = balances[assetName]
      userResults["b" + assetName]["balance"] = balances["b" + assetName]
      userResults["b" + assetName]["minted"] = userResults[assetName]["minted"]
      delete userResults[assetName]["minted"]
    }
    if (globalData && userData && Object.keys(userData).length > 0 && Object.keys(globalData).length > 0) {
      let userExtrapolatedData = await extrapolateUserData(userData, globalData)
      userResults[assetName] = Object.assign({}, userResults[assetName], userExtrapolatedData)
    }
  }
  return [userResults, globalResults]
}
