export class Client {
  SCALE_FACTOR: number
  BORROW_SHARES_INIT: number
  PARAMETER_SCALE_FACTOR: number
  algodClient: any
  indexerClient: any
  historicalIndexerClient: any
  chain: string
  userAddress: string
  initRound: number
  activeOrderedSymbols: string[]
  maxOrderedSymbols: string[]
  maxAtomicOptInOrderedSymbols: string[]
  manager: any
  markets: any

  constructor(algodClient, indexerClient, historicalIndexerClient, userAddress, chain) {
    // constants
    this.SCALE_FACTOR = 1e9
    this.BORROW_SHARES_INIT = 1e3
    this.PARAMETER_SCALE_FACTOR = 1e3

    // clients info
    this.algodClient = algodClient
    this.indexerClient = indexerClient
    this.historicalIndexerClient = historicalIndexerClient
    this.chain = chain

    // user info
    this.userAddress = userAddress

    this.initRound = 0 //get_init_round(this.chain)
    this.activeOrderedSymbols = ["0"] //get_ordered_symbols(this.chain)
    this.maxOrderedSymbols = ["0"] //get_ordered_symbols(this.chain, max=True)
    this.maxAtomicOptInOrderedSymbols = ["0"] //get_ordered_symbols(this.chain, maxAtomicOptIn=True)

    // manager info
    this.manager = 0 //Manager(this.algodClient, get_manager_app_id(this.chain))

    // market info
    this.markets = 0 //{symbol : Market(this.algodClient, this.historicalIndexerClient, get_market_app_id(this.chain, symbol)) for symbol in this.max_ordered_symbols}

    // staking contract info
    //this.staking_contract_info = get_staking_contracts(this.chain)
    //this.staking_contracts = {name : StakingContract(this.algodClient, this.historicalIndexerClient, this.staking_contract_info[name]) for name in this.staking_contract_info.keys()}
  }
}
