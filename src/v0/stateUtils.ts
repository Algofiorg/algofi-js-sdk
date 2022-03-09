import algosdk, { Algodv2 } from "algosdk"
import {
  orderedAssets,
  marketCounterToAssetName,
  assetIdToAssetName,
  managerAddress,
  assetDictionary,
  SECONDS_PER_YEAR,
  PARAMETER_SCALE_FACTOR,
  SCALE_FACTOR,
  REWARDS_SCALE_FACTOR
} from "./config"
import { Base64Encoder } from "./encoder"
import { managerStrings, marketStrings } from "./contractStrings"

// CONSTANTS
const MIN_BALANCE_PER_ACCOUNT = BigInt(100000)
const MIN_BALANCE_PER_ASSET = BigInt(100000)
const MIN_BALANCE_PER_APP = BigInt(100000)
const MIN_BALANCE_PER_APP_BYTESLICE = BigInt(25000 + 25000)
const MIN_BALANCE_PER_APP_UINT = BigInt(25000 + 3500)
const MIN_BALANCE_PER_APP_EXTRA_PAGE = BigInt(100000)
const NUMBER_OF_MARKETS_TO_OPT_IN = BigInt(13)
// assume we are launching with 8 assets
const NUMBER_OF_ASSETS = BigInt(8)
// local vars = user_storage_address
const BYTES_FOR_PRIMARY_MANAGER = BigInt(1)
// local vars = user_global_max_borrow_in_dollars, user_rewards_asset_id, user_pending_rewards, user_rewards_latest_time + NUMBER_OF_MARKETS (for rewards)
const UINTS_FOR_PRIMARY_MANAGER = BigInt(15)
// local uints = user_active_collateral, user_borrowed_amount, user_borrow_index_initial
const UINTS_FOR_STORAGE_MARKET = BigInt(3)

/**
 * Function to get the storage address for an algofi user. This address is stored in the users local state.
 * If the user clears their local state, their storage contract is irrecoverable.
 *
 * @param   {accountInformation}  accountInfo   - Address of user
 *
 * @return  {string}              storageAccont - Storage address of user
 */
export async function getStorageAddress(accountInfo: any, stakeAsset: string = "ALGO"): Promise<string> {
  let storageAccount = null
  let localManager = accountInfo["apps-local-state"].filter(x => {
    return x.id === assetDictionary[stakeAsset]["managerAppId"] && x["key-value"]
  })
  if (localManager && localManager.length > 0) {
    let storageAccountBytes = localManager[0]["key-value"].filter(x => {
      return Base64Encoder.decode(x.key) == managerStrings.user_storage_address
    })[0].value.bytes
    storageAccount = algosdk.encodeAddress(Buffer.from(storageAccountBytes, "base64"))
  }
  return storageAccount
}

// TODO - we should drive this off of the market oracle and price field
/**
 * Function to get oracle price info
 *
 * @param   {Algodv2}           algodClient
 *
 * @return  {dict<string,int}   prices
 */
export async function getPriceInfo(algodClient: Algodv2): Promise<{}> {
  let oracleAppIds = {}
  let prices = {}
  for (const assetName of orderedAssets) {
    let marketData = await algodClient.getApplicationByID(assetDictionary[assetName]["marketAppId"]).do()
    for (const y of marketData.params["global-state"]) {
      let decodedKey = Base64Encoder.decode(y.key)
      if (decodedKey === marketStrings["oracle_app_id"]) {
        oracleAppIds[assetName] = y.value.uint
      }
    }
    let response = await algodClient.getApplicationByID(oracleAppIds[assetName]).do()
    for (const y of response.params["global-state"]) {
      let decodedKey = Base64Encoder.decode(y.key)
      if (decodedKey === assetDictionary[assetName]["oracleFieldName"]) {
        prices[assetName] = y.value.uint
      }
    }
  }
  return prices
}

/**
 * Get balance info for a given address
 *
 * @param   {Algodv2}           algodClient
 * @param   {string}            address
 *
 * @return  {dict<string,int>}  balanceInfo   - dictionary of asset names to balances
 */
export async function getBalanceInfo(algodClient: Algodv2, address: string): Promise<{}> {
  let accountInfo = await algodClient.accountInformation(address).do()
  let balanceInfo = {}
  balanceInfo["ALGO"] = accountInfo["amount"]

  for (const assetName of orderedAssets) {
    if (assetName != "ALGO") {
      balanceInfo[assetName] = 0
    }
    balanceInfo["b" + assetName] = 0
  }
  for (const asset of accountInfo.assets) {
    for (const assetName of orderedAssets) {
      if (assetName != "ALGO" && asset["asset-id"] === assetDictionary[assetName]["underlyingAssetId"]) {
        balanceInfo[assetName] = Number(asset["amount"])
      } else if (asset["asset-id"] === assetDictionary[assetName]["bankAssetId"]) {
        balanceInfo["b" + assetName] = Number(asset["amount"])
      }
    }
    if (asset["asset-id"] == 468634109) {
      balanceInfo["TM-STBL-ALGO-LP"] = Number(asset["amount"])
    }
    if (asset["asset-id"] == 467020179) {
      balanceInfo["TM-STBL-USDC-LP"] = Number(asset["amount"])
    }
    if (asset["asset-id"] == 552737686) {
      balanceInfo["TM-STBL-USDC-LP-V2"] = Number(asset["amount"])
    }
    if (asset["asset-id"] == 468695586) {
      balanceInfo["TM-STBL-YLDY-LP"] = Number(asset["amount"])
    }
    if (asset["asset-id"] == 607645566) {
      balanceInfo["AF-STBL-ALGO-LP"] = Number(asset["amount"])
    }
    if (asset["asset-id"] == 609172718) {
      balanceInfo["AF-STBL-USDC-LP"] = Number(asset["amount"])
    }
    if (asset["asset-id"] == 635256863) {
      balanceInfo["AF-XET-STBL-LP"] = Number(asset["amount"])
    }
    if (asset["asset-id"] == 647801343) {
      balanceInfo["AF-ZONE-STBL-LP"] = Number(asset["amount"])
    }
    if (asset["asset-id"] == 624956449) {
      balanceInfo["AF-DEFLY-STBL-LP"] = Number(asset["amount"])
    }
    if (asset["asset-id"] == 635846733) {
      balanceInfo["AF-goBTC-STBL-LP"] = Number(asset["amount"])
    }
    if (asset["asset-id"] == 635854339) {
      balanceInfo["AF-goETH-STBL-LP"] = Number(asset["amount"])
    }
    if (asset["asset-id"] == 637802380) {
      balanceInfo["AF-OPUL-STBL-LP"] = Number(asset["amount"])
    }
  }

  return balanceInfo
}

/**
 * Function to get manager global state
 *
 * @param   {Algodv2}           algodClient
 *
 * @return  {dict<string,int>}  results       - dictionary of global state for this market
 */
export async function getGlobalManagerInfo(algodClient: Algodv2, stakeAsset: string = "ALGO"): Promise<{}> {
  let response = await algodClient.getApplicationByID(assetDictionary[stakeAsset]["managerAppId"]).do()
  let results = {}

  // get manager balance
  //
  const managerBalances = await getBalanceInfo(algodClient, managerAddress)

  response.params["global-state"].forEach(x => {
    let decodedKey = Base64Encoder.decode(x.key)

    if (decodedKey.slice(-6) === managerStrings.price_string) {
      results[marketCounterToAssetName[decodedKey.charCodeAt(7)] + managerStrings.price_string] = x.value.uint
    } else if (decodedKey.slice(-3) === managerStrings.counter_indexed_rewards_coefficient) {
      results[marketCounterToAssetName[decodedKey.charCodeAt(7)] + managerStrings.counter_indexed_rewards_coefficient] =
        x.value.uint
    } else if (decodedKey === managerStrings.rewards_asset_id) {
      results[decodedKey] = x.value.uint
      results["rewards_asset"] = assetIdToAssetName[x.value.uint]
      results["rewards_asset_balance"] = managerBalances[results["rewards_asset"]]
    } else if (decodedKey === managerStrings.rewards_secondary_asset_id) {
      results[decodedKey] = x.value.uint
      if (x.value.uint && assetIdToAssetName[x.value.uint]) {
        results["rewards_secondary_asset"] = assetIdToAssetName[x.value.uint]
        results["rewards_secondary_asset_balance"] = managerBalances[results["rewards_secondary_asset"]]
      } else if (x.value.uint) {
        // the ALGOFI protocol will only ever support one unexpected rewards symbol -- BANK
        results["rewards_secondary_asset"] = "BANK"
        results["rewards_secondary_asset_balance"] = 0
      }
    } else {
      results[decodedKey] = x.value.uint
    }
  })
  return results
}

/**
 * Function to get manager global state
 *
 * @param   {AccountInformation}  accountInfo
 *
 * @return  {dict<string,int>}    results       - dictionary of global state for this market
 */
export async function getUserManagerData(accountInfo: any, stakeAsset: string = "ALGO"): Promise<{}> {
  let results = {}
  let managerData = accountInfo["apps-local-state"].filter(x => {
    return x.id === assetDictionary[stakeAsset]["managerAppId"] && x["key-value"]
  })[0]
  if (managerData) {
    managerData["key-value"].forEach(x => {
      let decodedKey = Base64Encoder.decode(x.key)
      if (decodedKey.slice(-3) === managerStrings.counter_to_user_rewards_coefficient_initial) {
        results[
          marketCounterToAssetName[decodedKey.charCodeAt(7)] +
            managerStrings.counter_to_user_rewards_coefficient_initial
        ] = x.value.uint
      } else {
        results[decodedKey] = x.value.uint
      }
    })
  }
  return results
}

/**
 * Function to get a users local state in a given market
 *
 * @param   {AccountInformation}  accountInfo
 * @param   {any}                 globalData
 * @param   {string}              assetName
 *
 * @return  {dict<string,int>}    results       - dictionary of user market local state
 */
export async function getUserMarketData(accountInfo: any, globalData: {}, assetName: string): Promise<{}> {
  let results = {}
  let marketData = accountInfo["apps-local-state"].filter(x => {
    return x.id === assetDictionary[assetName]["marketAppId"] && x["key-value"]
  })[0]
  if (marketData) {
    marketData["key-value"].forEach(y => {
      let decodedKey = Base64Encoder.decode(y.key)
      if (decodedKey === marketStrings.user_borrow_shares) {
        results["borrowed"] = Math.floor(
          (y.value.uint * globalData[assetName]["underlying_borrowed_extrapolated"]) /
            globalData[assetName][marketStrings.outstanding_borrow_shares]
        )
      } else if (decodedKey === marketStrings.user_active_collateral) {
        results["active_collateral"] = Number(y.value.uint)
      } else {
        results[decodedKey] = y.value.uint
      }
    })
  }
  return results
}

/**
 * Function to get market global state
 *
 * @param   {Algodv2}           algodClient
 * @param   {number}            marketId
 *
 * @return  {dict<string,int>}  results       - dictionary of global state for this market
 */
export async function getGlobalMarketInfo(algodClient: Algodv2, marketId: number): Promise<{}> {
  let response = await algodClient.getApplicationByID(marketId).do()
  let results = {}
  response.params["global-state"].forEach(x => {
    let decodedKey = Base64Encoder.decode(x.key)
    results[decodedKey] = x.value.uint
  })
  return results
}

/**
 * Function to get extrapolate additional data from market global state
 *
 * @param   {dict<string,int>}  globalData        - dictionary of market global state
 * @param   {dict<string,int>}  prices
 * @param   {string}            assetName
 *
 * @return  {dict<string,int>}  extrapolatedData  - dictionary of market extrapolated values
 */
export async function extrapolateMarketData(globalData: {}, prices: {}, assetName: string): Promise<{}> {
  let extrapolatedData = {}

  // get current time
  let currentUnixTime = Date.now()
  currentUnixTime = Math.floor(currentUnixTime / 1000)

  // initialize total_borrow_interest_rate if unset
  if (!globalData[marketStrings.total_borrow_interest_rate]) {
    globalData[marketStrings.total_borrow_interest_rate] = 0
  }

  // get reserve mults
  let reserveMultiplier = globalData[marketStrings.reserve_factor] / PARAMETER_SCALE_FACTOR
  let reserveFreeMultiplier =
    (PARAMETER_SCALE_FACTOR - globalData[marketStrings.reserve_factor]) / PARAMETER_SCALE_FACTOR

  // borrow_index_extrapolated = last borrow index + current calculated next borrow index
  extrapolatedData["borrow_index_extrapolated"] = Math.floor(
    globalData[marketStrings.borrow_index] *
      (1 +
        ((globalData[marketStrings.total_borrow_interest_rate] / 1e9) *
          (currentUnixTime - globalData[marketStrings.latest_time])) /
          SECONDS_PER_YEAR)
  )

  // underlying_borrowed_extrapolated
  extrapolatedData["underlying_borrowed_extrapolated"] =
    extrapolatedData["borrow_index_extrapolated"] > 0
      ? (globalData[marketStrings.underlying_borrowed] * extrapolatedData["borrow_index_extrapolated"]) /
        globalData[marketStrings.implied_borrow_index]
      : globalData[marketStrings.underlying_borrowed]

  // underlying_reserves_extrapolated
  extrapolatedData["underlying_reserves_extrapolated"] =
    extrapolatedData["underlying_borrowed_extrapolated"] > 0
      ? (extrapolatedData["underlying_borrowed_extrapolated"] - globalData[marketStrings.underlying_borrowed]) *
          reserveMultiplier +
        globalData[marketStrings.underlying_reserves]
      : globalData[marketStrings.underlying_reserves]

  // underlying_supplied
  extrapolatedData["underlying_supplied"] =
    globalData[marketStrings.underlying_cash] +
    globalData[marketStrings.underlying_borrowed] -
    globalData[marketStrings.underlying_reserves]
  extrapolatedData["underlying_supplied_extrapolated"] =
    globalData[marketStrings.underlying_cash] +
    extrapolatedData["underlying_borrowed_extrapolated"] -
    extrapolatedData["underlying_reserves_extrapolated"]

  // total_lend_interest_rate_earned = (total interest less reserve factor) / (total supply)
  const ALGO_STAKING_APY = Number(0.0007 * 1e9)
  const borrowUtil =
    globalData[marketStrings.underlying_borrowed] / extrapolatedData["underlying_supplied_extrapolated"]
  extrapolatedData["total_lend_interest_rate_earned"] =
    globalData[marketStrings.underlying_borrowed] > 0
      ? globalData[marketStrings.total_borrow_interest_rate] * borrowUtil * reserveFreeMultiplier
      : 0
  if (assetName == "ALGO") {
    extrapolatedData["total_lend_interest_rate_earned"] += ALGO_STAKING_APY * (1 - borrowUtil)
  }

  // bank_to_underlying_exchange_extrapolated
  extrapolatedData["bank_to_underlying_exchange_extrapolated"] =
    globalData[marketStrings.bank_circulation] > 0
      ? (extrapolatedData["underlying_supplied_extrapolated"] * SCALE_FACTOR) /
        globalData[marketStrings.bank_circulation]
      : globalData[marketStrings.bank_to_underlying_exchange]

  // active_collateral_extrapolated
  extrapolatedData["active_collateral_extrapolated"] = globalData[marketStrings.active_collateral]
    ? (globalData[marketStrings.active_collateral] * extrapolatedData["bank_to_underlying_exchange_extrapolated"]) /
      SCALE_FACTOR
    : 0

  // calculate USD values
  extrapolatedData["underlying_borrowed_extrapolatedUSD"] =
    extrapolatedData["underlying_borrowed_extrapolated"] *
    (prices[assetName] / SCALE_FACTOR) *
    1000 * // multiply by 1000 b/c we scale orcale by 1000
    (1 / 10 ** assetDictionary[assetName]["decimals"])

  extrapolatedData["underlying_supplied_extrapolatedUSD"] =
    extrapolatedData["underlying_supplied_extrapolated"] *
    (prices[assetName] / SCALE_FACTOR) *
    1000 * // multiply by 1000 b/c we scale orcale by 1000
    (1 / 10 ** assetDictionary[assetName]["decimals"])

  // active_collateral_extrapolatedUSD
  extrapolatedData["active_collateral_extrapolatedUSD"] =
    extrapolatedData["active_collateral_extrapolated"] *
    (prices[assetName] / SCALE_FACTOR) *
    1000 * // multiply by 1000 b/c we scale orcale by 1000
    (1 / 10 ** assetDictionary[assetName]["decimals"])

  return extrapolatedData
}

/**
 * Function to extrapolate data from user data
 *
 * @param   {dict<string,int>}  userResults
 * @param   {dict<string,int>}  userResults
 * @param   {string}            assetName
 *
 * @return  {dict<string,int>}  extroplatedData
 */
export async function extrapolateUserData(userResults: {}, globalResults: {}, assetName: string): Promise<{}> {
  let extrapolatedData = {}

  // borrwed_extrapolated
  extrapolatedData["borrowed_extrapolated"] = userResults[assetName]["borrowed"]
    ? userResults[assetName]["borrowed"]
    : 0
  // collateral_underlying
  extrapolatedData["collateral"] = userResults[assetName]["active_collateral"]
    ? userResults[assetName]["active_collateral"]
    : 0

  extrapolatedData["collateral_underlying_extrapolated"] =
    userResults[assetName]["active_collateral"] && globalResults[assetName]["bank_to_underlying_exchange_extrapolated"]
      ? (userResults[assetName]["active_collateral"] *
          globalResults[assetName]["bank_to_underlying_exchange_extrapolated"]) /
        SCALE_FACTOR
      : 0
  // borrowUSD
  extrapolatedData["borrowUSD"] =
    extrapolatedData["borrowed_extrapolated"] *
    (globalResults[assetName]["price"] / SCALE_FACTOR) *
    1000 * // multiply by 1000 b/c we scale orcale by 1000
    (1 / 10 ** assetDictionary[assetName]["decimals"])
  // collateralUSD
  extrapolatedData["collateralUSD"] =
    extrapolatedData["collateral_underlying_extrapolated"] *
    (globalResults[assetName]["price"] / SCALE_FACTOR) *
    1000 * // multiply by 1000 b/c we scale orcale by 1000
    (1 / 10 ** assetDictionary[assetName]["decimals"])

  // maxBorrowUSD
  extrapolatedData["maxBorrowUSD"] =
    extrapolatedData["collateralUSD"] * (globalResults[assetName][marketStrings.collateral_factor] / 1000)

  // extrapolated rewards
  let userMarketTVL = extrapolatedData["borrowed_extrapolated"] + extrapolatedData["collateral"]

  if (
    userResults["manager"][managerStrings.user_rewards_program_number] ===
    globalResults["manager"][managerStrings.n_rewards_programs]
  ) {
    extrapolatedData["market_unrealized_rewards"] =
      (userMarketTVL *
        (globalResults["manager"][assetName + managerStrings.counter_indexed_rewards_coefficient] -
          userResults["manager"][assetName + managerStrings.counter_to_user_rewards_coefficient_initial])) /
      REWARDS_SCALE_FACTOR
  } else {
    extrapolatedData["market_unrealized_rewards"] =
      (userMarketTVL * globalResults["manager"][assetName + managerStrings.counter_indexed_rewards_coefficient]) /
      REWARDS_SCALE_FACTOR
  }
  return extrapolatedData
}

function dec2bin(dec) {
  return (dec >>> 0).toString(2)
}

/**
 * Function to extrapolate data from user data
 *
 * @param   {dict<string,int>}  userResults
 *
 * @return  {dict<string,int>}  extroplatedData
 */
export async function updateGlobalTotals(globalResults: {}): Promise<void> {
  globalResults["underlying_supplied_extrapolatedUSD"] = 0
  globalResults["underlying_borrowed_extrapolatedUSD"] = 0
  globalResults["active_collateral_extrapolatedUSD"] = 0
  globalResults["active_collateral_weighted_extrapolatedUSD"] = 0
  globalResults["underlying_borrowed_weighted_extrapolatedUSD"] = 0
  globalResults["marketWeights"] = 0

  let rewards_active =
    globalResults["manager"][managerStrings.rewards_start_time] > 0 &&
    globalResults["manager"][managerStrings.rewards_amount] > 0

  let rewards_dist_bitmap
  var marketWeights = []
  if (rewards_active) {
    rewards_dist_bitmap = globalResults["manager"][managerStrings.rewards_distributions_by_market]
    // if bitmap = 0, then assign 1 to each active market;
    if (rewards_dist_bitmap == 0) {
      for (const assetName of orderedAssets) {
        marketWeights.push(1)
      }
    } else {
      let rewardsDistributionMarket = dec2bin(globalResults["manager"][managerStrings.rewards_distributions_by_market])
      const initBinLength = rewardsDistributionMarket.length
      const binLength = Math.ceil(rewardsDistributionMarket.length / 4) * 4
      for (let i = 0; i < binLength - initBinLength; i++) {
        rewardsDistributionMarket = "0" + rewardsDistributionMarket
      }
      let binChunk
      for (let i = 0; i < orderedAssets.length; i++) {
        binChunk = rewardsDistributionMarket.substring(
          rewardsDistributionMarket.length - 4 * (i + 1),
          rewardsDistributionMarket.length - 4 * i
        )
        marketWeights.push(parseInt(binChunk, 2))
      }
    }
  }

  for (let i = 0; i < orderedAssets.length; i++) {
    const assetName = orderedAssets[i]
    if (assetName != "STBL") {
      globalResults["underlying_supplied_extrapolatedUSD"] +=
        globalResults[assetName]["underlying_supplied_extrapolatedUSD"]
    }
    globalResults["active_collateral_extrapolatedUSD"] += globalResults[assetName]["active_collateral_extrapolatedUSD"]
    globalResults["underlying_borrowed_extrapolatedUSD"] +=
      globalResults[assetName]["underlying_borrowed_extrapolatedUSD"]
    if (rewards_active) {
      globalResults["active_collateral_weighted_extrapolatedUSD"] +=
        globalResults[assetName]["active_collateral_extrapolatedUSD"] * marketWeights[i]
      globalResults["underlying_borrowed_weighted_extrapolatedUSD"] +=
        globalResults[assetName]["underlying_borrowed_extrapolatedUSD"] * marketWeights[i]
    }
  }

  const globalWeightedTvl =
    globalResults["active_collateral_weighted_extrapolatedUSD"] +
    globalResults["underlying_borrowed_weighted_extrapolatedUSD"]
  // calculate market APY
  let rewards_per_year = globalResults["manager"][managerStrings.rewards_per_second] * 60 * 60 * 24 * 365

  // TODO account for reward free markets
  let marketTvl = 0
  let marketWeightedTvl = 0
  for (let i = 0; i < orderedAssets.length; i++) {
    const assetName = orderedAssets[i]
    if (rewards_active) {
      marketTvl =
        globalResults[assetName]["active_collateral_extrapolatedUSD"] +
        globalResults[assetName]["underlying_borrowed_extrapolatedUSD"]
      marketWeightedTvl =
        (globalResults[assetName]["active_collateral_extrapolatedUSD"] +
          globalResults[assetName]["underlying_borrowed_extrapolatedUSD"]) *
        marketWeights[i]
      globalResults[assetName]["reward_rate_per_1000USD"] =
        (rewards_per_year * (marketWeightedTvl / globalWeightedTvl) * 1000) / marketTvl
    } else {
      globalResults[assetName]["reward_rate_per_1000USD"] = 0
    }
  }
}

/**
 * Function to extrapolate data from user data
 *
 * @param   {dict<string,int>}  userResults
 * @param   {dict<string,int>}  globalResults
 * @param   {string[]}          activeMarkets
 *
 * @return  {dict<string,int>}  extroplatedData
 */
export async function updateGlobalUserTotals(
  userResults: {},
  globalResults: {},
  activeMarkets: string[]
): Promise<void> {
  userResults["borrowUSD"] = 0
  userResults["collateralUSD"] = 0
  userResults["maxBorrowUSD"] = 0
  userResults["unrealized_rewards"] = 0
  userResults["portfolio_reward_rate_per_1000USD"] = 0
  userResults["portfolio_borrow_reward_rate_per_1000USD"] = 0
  userResults["portfolio_lend_reward_rate_per_1000USD"] = 0
  userResults["portfolio_lend_interest_rate_earned"] = 0
  userResults["portfolio_borrow_interest_rate"] = 0

  userResults["rewards_secondary_ratio"] = globalResults["manager"][managerStrings.rewards_secondary_ratio]
  if (
    globalResults["manager"][managerStrings.rewards_start_time] > 0 &&
    userResults["manager"][managerStrings.user_rewards_program_number] ===
      globalResults["manager"][managerStrings.n_rewards_programs]
  ) {
    userResults["pending_rewards_extrapolated"] = userResults["manager"][managerStrings.user_pending_rewards]
    userResults["pending_secondary_rewards_extrapolated"] =
      userResults["manager"][managerStrings.user_secondary_pending_rewards]
  } else {
    userResults["pending_rewards_extrapolated"] = 0
    userResults["pending_secondary_rewards_extrapolated"] = 0
  }

  for (const assetName of activeMarkets) {
    userResults["borrowUSD"] += userResults[assetName]["borrowUSD"]
    userResults["collateralUSD"] += userResults[assetName]["collateralUSD"]
    userResults["maxBorrowUSD"] += userResults[assetName]["maxBorrowUSD"]
    userResults["unrealized_rewards"] += userResults[assetName]["market_unrealized_rewards"]
  }

  for (const assetName of activeMarkets) {
    userResults["portfolio_reward_rate_per_1000USD"] +=
      (globalResults[assetName]["reward_rate_per_1000USD"] *
        (userResults[assetName]["borrowUSD"] + userResults[assetName]["collateralUSD"])) /
      (userResults["borrowUSD"] + userResults["collateralUSD"])
    userResults["portfolio_borrow_reward_rate_per_1000USD"] +=
      (globalResults[assetName]["reward_rate_per_1000USD"] * userResults[assetName]["borrowUSD"]) /
      userResults["borrowUSD"]
    userResults["portfolio_lend_reward_rate_per_1000USD"] +=
      (globalResults[assetName]["reward_rate_per_1000USD"] * userResults[assetName]["collateralUSD"]) /
      userResults["collateralUSD"]
    userResults["portfolio_lend_interest_rate_earned"] +=
      (globalResults[assetName]["total_lend_interest_rate_earned"] * userResults[assetName]["collateralUSD"]) /
      userResults["collateralUSD"]
    userResults["portfolio_borrow_interest_rate"] +=
      (globalResults[assetName][marketStrings.total_borrow_interest_rate] * userResults[assetName]["borrowUSD"]) /
      userResults["borrowUSD"]
  }
}

/**
 * Function to calculate account opt in info
 *
 * @param   {AccountInformation}  accountInfo
 *
 * @return  {dict<string,int>}    userData    - userData with added USD values
 */
export async function getAccountOptInData(accountInfo: any): Promise<{}> {
  let accountOptInData = {}

  // min balance
  const totalSchema = accountInfo["apps-total-schema"]
  let totalByteSlices = BigInt(0)
  let totalUints = BigInt(0)
  if (totalSchema) {
    if (totalSchema["num-byte-slice"]) {
      totalByteSlices = BigInt(totalSchema["num-byte-slice"])
    }
    if (totalSchema["num-uint"]) {
      totalUints = BigInt(totalSchema["num-uint"])
    }
  }

  const totalExtraPages =
    Number(accountInfo["apps-total-extra-pages"]) > 0 ? BigInt(accountInfo["apps-total-extra-pages"]) : BigInt(0)
  const localApps = accountInfo["apps-local-state"] || []
  const createdApps = accountInfo["created-apps"] || []
  const assets = accountInfo["assets"] || []

  accountOptInData["min_balance"] =
    MIN_BALANCE_PER_ACCOUNT +
    MIN_BALANCE_PER_ASSET * BigInt(assets.length) +
    MIN_BALANCE_PER_APP * BigInt(createdApps.length + localApps.length) +
    MIN_BALANCE_PER_APP_UINT * totalUints +
    MIN_BALANCE_PER_APP_BYTESLICE * totalByteSlices +
    MIN_BALANCE_PER_APP_EXTRA_PAGE * totalExtraPages

  // prep for paul's change, only opt-in storage account to markets
  accountOptInData["min_balance_primary_account"] =
    // BigInt(2) * NUMBER_OF_ASSETS * MIN_BALANCE_PER_ASSET + TODO - uncomment if we need bank assets again
    NUMBER_OF_ASSETS * MIN_BALANCE_PER_ASSET +
    MIN_BALANCE_PER_APP +
    MIN_BALANCE_PER_APP_BYTESLICE * BYTES_FOR_PRIMARY_MANAGER +
    MIN_BALANCE_PER_APP_UINT * UINTS_FOR_PRIMARY_MANAGER

  // prep for paul's change, only opt-in storage account to markets
  accountOptInData["min_balance_storage_account"] =
    NUMBER_OF_MARKETS_TO_OPT_IN * (MIN_BALANCE_PER_APP + MIN_BALANCE_PER_APP_UINT * UINTS_FOR_STORAGE_MARKET) +
    MIN_BALANCE_PER_APP +
    MIN_BALANCE_PER_APP_BYTESLICE * BYTES_FOR_PRIMARY_MANAGER +
    MIN_BALANCE_PER_APP_UINT * UINTS_FOR_PRIMARY_MANAGER +
    MIN_BALANCE_PER_ACCOUNT +
    BigInt(100000)

  // opted in applications
  accountOptInData["apps"] = localApps

  // opted in assets
  accountOptInData["assets"] = assets

  return accountOptInData
}
