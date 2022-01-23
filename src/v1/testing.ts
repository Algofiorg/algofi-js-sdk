import { contracts } from "./contracts"
import { getManagerAppId, getStakingContracts, getMarketAppId, getInitRound, readGlobalState } from "./utils"
import { Algodv2, SuggestedParams } from "algosdk"
import SuggestedParamsRequest from "algosdk/dist/types/src/client/v2/algod/suggestedParams";
const token  = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const server = "http://localhost";
const port   = 4001;
const client = new Algodv2(token, server, port);

const foo = async (address : string) => {
    const a = await client.accountInformation(address).do();
    console.log(a);
}

foo("HLTOSATJWLJSBPICJZPR5KBYNDNJ7S47SQCSRNNOBEEH7JGWUEQPZAIS44")