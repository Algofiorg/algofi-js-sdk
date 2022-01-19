import { Base64Encoder } from "./extraUtils/encoder"

export const REWARDS_SCALE_FACTOR

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
