import algosdk from "algosdk"
import { getParams, waitForConfirmation, getCore } from "./submissionUtils.js"
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

export async function optInMarkets(algodClient, address) {
  const params = await getParams(algodClient)
  let txns = []
  for (const assetName of orderedAssets) {
    txns.push(
      algosdk.makeApplicationOptInTxnFromObject({
        from: address,
        appIndex: assetDictionary[assetName]["marketAppId"],
        suggestedParams: params
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
          from: address
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
        from: address
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
  if (assetName == "ALGO") {
    txns.push(
      algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: address,
        to: assetDictionary[assetName]["marketAddress"],
        amount: amount,
        suggestedParams: params
      })
    )
  } else {
    txns.push(
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: address,
        to: assetDictionary[assetName]["marketAddress"],
        amount: amount,
        assetIndex: assetDictionary[assetName]["underlyingAssetId"],
        suggestedParams: params
      })
    )
  }
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
  if (assetName == "ALGO") {
    txns.push(
      algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: address,
        to: assetDictionary[assetName]["marketAddress"],
        amount: amount,
        suggestedParams: params
      })
    )
  } else {
    txns.push(
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: address,
        to: assetDictionary[assetName]["marketAddress"],
        amount: amount,
        assetIndex: assetDictionary[assetName]["underlyingAssetId"],
        suggestedParams: params
      })
    )
  }
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
      suggestedParams: params
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
  if (assetName == "ALGO") {
    txns.push(
      algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: address,
        to: assetDictionary[assetName]["marketAddress"],
        amount: amount,
        suggestedParams: params
      })
    )
  } else {
    txns.push(
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: address,
        to: assetDictionary[assetName]["marketAddress"],
        amount: amount,
        assetIndex: assetDictionary[assetName]["underlyingAssetId"],
        suggestedParams: params
      })
    )
  }

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
    "repay_borrow",
    extraFees = 1000
  )
  if (assetName == "ALGO") {
    txns.push(
      algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: address,
        to: assetDictionary[assetName]["marketAddress"],
        amount: amount,
        suggestedParams: params
      })
    )
  } else {
    txns.push(
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: address,
        to: assetDictionary[assetName]["marketAddress"],
        amount: amount,
        assetIndex: assetDictionary[assetName]["underlyingAssetId"],
        suggestedParams: params
      })
    )
  }

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
  if (assetName == "ALGO") {
    txns.push(
      algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: address,
        to: assetDictionary[assetName]["marketAddress"],
        amount: amount,
        suggestedParams: params
      })
    )
  } else {
    txns.push(
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: address,
        to: assetDictionary[assetName]["marketAddress"],
        amount: amount,
        assetIndex: assetDictionary[assetName]["underlyingAssetId"],
        suggestedParams: params
      })
    )
  }
  txns.push(
    algosdk.makeApplicationNoOpTxnFromObject({
      from: address,
      appIndex: marketAppId,
      foreignApps: [managerAppId],
      appArgs: [enc.encode("liquidate")],
      accounts: [liquidateStorageAddress, storageAddress],
      suggestedParams: params,
      note: enc.encode("Market: " + functionString)
    })
  )
  algosdk.assignGroupID(txns)
  return txns
}

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
