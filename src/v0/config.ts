export const orderedAssets = ["ALGO", "USDC", "goBTC", "goETH", "STBL", "vALGO"]
export const extraAssets = ["BANK"]
export const orderedAssetsAndPlaceholders = [
  "ALGO",
  "USDC",
  "goBTC",
  "goETH",
  "STBL",
  "vALGO",
  "SEVN",
  "EGHT",
  "NINE",
  "TENN",
  "ELVN",
  "TWLV",
  "TRTN",
  "FRTN",
  "FVTN",
  "SXTN",
  "TM-STBL-ALGO-LP",
  "TM-STBL-USDC-LP",
  "TM-STBL-USDC-LP-V2",
  "TM-STBL-YLDY-LP",
  "AF-STBL-USDC-LP",
  "AF-STBL-ALGO-LP",
  "AF-STBL-USDC-NANO-LP",
  "AF-USDT-USDC-NANO-LP",
  "AF-STBL-USDT-NANO-LP",
  "AF-XET-STBL-LP",
  "AF-DEFLY-STBL-LP",
  "AF-goETH-STBL-LP",
  "AF-goBTC-STBL-LP"
]

export const protocolManagerAppId = 465818260
export const managerAddress = "2SGUKZCOBEVGN3HPKSXPS6DTCXZ7LSP6G3BQF6KVUIUREBBY2QTGSON7WQ"
export const assetDictionary = {
  ALGO: {
    decimals: 6,
    marketCounter: 1,
    marketAppId: 465814065,
    marketAddress: "TY5N6G67JWHSMWFFFZ252FXWKLRO5UZLBEJ4LGV7TPR5PVSKPLDWH3YRXU",
    managerAppId: 465818260,
    bankAssetId: 465818547,
    bankAssetDecimals: 6,
    underlyingAssetId: 1,
    oracleAppId: 531724540,
    oracleFieldName: "latest_twap_price"
  },
  USDC: {
    decimals: 6,
    marketCounter: 2,
    marketAppId: 465814103,
    marketAddress: "ABQHZLNGGPWWZVA5SOQO3HBEECVJSE3OHYLKACOTC7TC4BS52ZHREPF7QY",
    managerAppId: 465818260,
    bankAssetId: 465818553,
    bankAssetDecimals: 6,
    underlyingAssetId: 31566704,
    oracleAppId: 451327550,
    oracleFieldName: "price"
  },
  goBTC: {
    decimals: 8,
    marketCounter: 3,
    marketAppId: 465814149,
    marketAddress: "W5UCMHDSTGKWBOV6YVLDVPJGPE4L4ISTU6TGXC7WRF63Y7GOVFOBUNJB5Q",
    managerAppId: 465818260,
    bankAssetId: 465818554,
    bankAssetDecimals: 8,
    underlyingAssetId: 386192725,
    oracleAppId: 531725044,
    oracleFieldName: "latest_twap_price"
  },
  goETH: {
    decimals: 8,
    marketCounter: 4,
    marketAppId: 465814222,
    marketAddress: "KATD43XBJJIDXB3U5UCPIFUDU3CZ3YQNVWA5PDDMZVGKSR4E3QWPJX67CY",
    managerAppId: 465818260,
    bankAssetId: 465818555,
    bankAssetDecimals: 8,
    underlyingAssetId: 386195940,
    oracleAppId: 531725449,
    oracleFieldName: "latest_twap_price"
  },
  STBL: {
    decimals: 6,
    marketCounter: 5,
    marketAppId: 465814278,
    marketAddress: "OPY7XNB5LVMECF3PHJGQV2U33LZPM5FBUXA3JJPHANAG5B7GEYUPZJVYRE",
    managerAppId: 465818260,
    bankAssetId: 465818563,
    bankAssetDecimals: 6,
    underlyingAssetId: 465865291,
    oracleAppId: 451327550,
    oracleFieldName: "price"
  },
  vALGO: {
    decimals: 6,
    marketCounter: 6,
    marketAppId: 465814318,
    marketAddress: "DAUL5I34T4C4U5OMXS7YBPJIERQ2NH3O7XPZCIJEGKP4NO3LK4UWDCHAG4",
    managerAppId: 465818260,
    bankAssetId: 680408335,
    bankAssetDecimals: 6,
    underlyingAssetId: 1,
    oracleAppId: 531724540,
    oracleFieldName: "latest_twap_price"
  },
  "STBL-STAKE": {
    decimals: 6,
    marketCounter: 5,
    marketAppId: 482608867,
    managerAppId: 482625868,
    marketAddress: "DYLJJES76YQCOUK6D4RALIPJ76U5QT7L6A2KP6QTOH63OBLFKLTER2J6IA",
    bankAssetId: 465818563,
    bankAssetDecimals: 6,
    underlyingAssetId: 465865291,
    oracleAppId: 451327550,
    oracleFieldName: "price"
  },
  "DEFLY-STAKE": {
    decimals: 6,
    managerAppId: 641500474,
    managerAddress: "DHXB5GQTMKJ6L2MFB5VGZ5LWD6GVJ6WJMJAQXWK75SEFZFO5YYCGCBSTZA",
    marketAppId: 641499935,
    marketAddress: "HNZCZYTROWA5Q7EOBGLVYRS5QR22W26OCCO2BVHGBHCRIUGG2ZSCZLRZNM",
    underlyingAssetId: 470842789,
    bankAssetId: 641501566,
    oracleAppId: 451327550
  },
  "OPUL-STAKE": {
    decimals: 10,
    managerAppId: 674527132,
    managerAddress: "BGTIGJPGYEGZZHLB7U6XFDYWEXBRJ6NAGR4GNVDFBSMTKCAUB43XBDLPUI",
    marketAppId: 674526408,
    marketAddress: "Q5UIL7OEKOJEHLACM5QFZYURYNXQ46SSEDTH4KQRTZFY63XBIKXMD6F3NQ",
    underlyingAssetId: 287867876,
    bankAssetId: 674529164,
    oracleAppId: 692392304
  },

  "TM-STBL-ALGO-LP": {
    decimals: 6,
    managerAppId: 514458901,
    managerAddress: "JZYVXQLRZ2TEI6XMIQN5KEHEVA5EA3LQVZUS24SGKLVIBQZTRSP3PTCRJQ",
    marketAppId: 514439598,
    marketAddress: "UMTL7D6YMN463FSG3JN572CFD6VTKRKNSK5KSQYIUK67N7CR3XLDFM42Y4",
    underlyingAssetId: 468634109,
    bankAssetId: 514473977,
    oracleAppId: 451327550,
    bankAssetDecimals: 6,
    oracleFieldName: "price"
  },
  "TM-STBL-USDC-LP": {
    decimals: 6,
    marketAppId: 485244022,
    managerAppId: 485247444,
    managerAddress: "IG3KDYTH7IB46DC5K4ME4Z3R46VJEFXFPHRHVV3KKBTULW5ODHPJL7ZFU4",
    marketAddress: "Z3GWRL5HGCJQYIXP4MINCRWCKWDHZ5VSYJHDLIDLEIOARIZWJX6GLAWWEI",
    creatorAddress: "TFONT6HASLUUWDRE3MEEC4GS5PIMLEKNCE7Z2JMGNBFIHVZZ2QEJ7MODZE",
    oracleAppId: 451327550,
    bankAssetId: 485254141,
    bankAssetDecimals: 6,
    underlyingAssetId: 467020179,
    oracleFieldName: "price"
  },
  "TM-STBL-USDC-LP-V2": {
    decimals: 6,
    managerAppId: 553869413,
    managerAddress: "4SNLE5W7UOTDJZG6RNEVB35R7FU2O2RQSHKZYDFZ3BLRHKOG3T3GRF5SYE",
    marketAppId: 553866305,
    marketAddress: "WICHUQ6FWYQPP777TEEZCO5C3B3MI55H7CORDTEYFWW3NZTJH24USUT6PU",
    underlyingAssetId: 552737686,
    bankAssetId: 553898734,
    creatorAddress: "KG5EXEQN4BNQBLYAO6H3ICFX26ATIMICW2RYVGIQXF35THOC3KRKDTW6JM",
    oracleAppId: 451327550,
    bankAssetDecimals: 6,
    oracleFieldName: "price"
  },
  "TM-STBL-YLDY-LP": {
    decimals: 6,
    managerAppId: 514601080,
    managerAddress: "S53YDCHH3JGJKZWLNLUFDAQKSUZCAWOVNYHWAGMVCOFK2NNROS7NCLDK64",
    marketAppId: 514599409,
    marketAddress: "3VNLTSYGAMVBRSCSAF7PP7KSBAV5AQQIUM2TJXIDVOXX573AW7LMH6RARY",
    underlyingAssetId: 468695586,
    bankAssetId: 514624374,
    creatorAddress: "EJMPGJJX4NHRF3Z7DM373ODLLZF6R3RV76PJ3GZGQKWGC5LFKIEOUG34MQ",
    oracleAppId: 451327550,
    bankAssetDecimals: 6,
    oracleFieldName: "price"
  },
  "AF-STBL-ALGO-LP": {
    decimals: 6,
    managerAppId: 611804624,
    managerAddress: "SKH3QKDUT2BWIZD7WODZMQCR4IKAUVW2NR67UZNSXFH7MXOGASOB3IFCNE",
    marketAppId: 611801333,
    marketAddress: "5VJBR6QI27YEFNMPITUDSOWRM54GZGH3D2OU6HIZFMTWWAIOKDQ7NF72D4",
    underlyingAssetId: 607645566,
    bankAssetId: 611811838,
    creatorAddress: "LEAUT3X2YMLY7EEPS7VVLFSKXEMH5FLAJ7GNCFXZV7O5JYHJVQXGGR3MYU",
    oracleAppId: 451327550,
    bankAssetDecimals: 6,
    oracleFieldName: "price"
  },
  "AF-STBL-USDC-LP": {
    decimals: 6,
    managerAppId: 611869320,
    managerAddress: "PR7HILT7NENYR7SBMGOXDNZLRV5LCED4IUSHQ7N3DNAUKUH3G3BNRXTZTM",
    marketAppId: 611867642,
    marketAddress: "WVCIYSN25IQYEOZUI3AM4DWHNEYFCPRYWEZD34SEYPSJ4VSMB5S5WPCLKQ",
    underlyingAssetId: 609172718,
    bankAssetId: 611871906,
    creatorAddress: "LEAUT3X2YMLY7EEPS7VVLFSKXEMH5FLAJ7GNCFXZV7O5JYHJVQXGGR3MYU",
    oracleAppId: 451327550,
    bankAssetDecimals: 6,
    oracleFieldName: "price"
  },
  "AF-STBL-USDC-NANO-LP": {
    decimals: 6,
    managerAppId: 661193019,
    managerAddress: "ZJ5FA4NOV2TRCV5JQADVFVOFRVUHA75NDOVNGPOQRE6KJYB7IKJA7CAJII",
    marketAppId: 661192413,
    marketAddress: "IPVGR2HWG7SALBBYYJBGS3B6PPEJEKFURDNADN345JWHVGXX7TVS27JAOM",
    underlyingAssetId: 658337286,
    bankAssetId: 661196458,
    creatorAddress: "LEAUT3X2YMLY7EEPS7VVLFSKXEMH5FLAJ7GNCFXZV7O5JYHJVQXGGR3MYU",
    oracleAppId: 451327550,
    bankAssetDecimals: 6,
    oracleFieldName: "price"
  },
  "AF-USDT-USDC-NANO-LP": {
    decimals: 6,
    creator: "NBJ4JCAO4DYHUUKSDP6JECOL64ZSCJWJAN4BWOA2DPSJVX6TV25YMNGXSA",
    managerAppId: 661247364,
    managerAddress: "ZE5LTT3HX2CPA2H4ORQDETPBMYIRD2S4XUKT5JRBLUHJG6EDMP6HCATOVE",
    marketAppId: 661207804,
    marketAddress: "DUM274V35WPXXEPH3BJ4UFE3IDBT4P4ZRHQ2ZV52SVPJMWAJYCPRN4EHEQ",
    underlyingAssetId: 659678778,
    bankAssetId: 661247872,
    oracleAppId: 451327550,
    bankAssetDecimals: 6,
    oracleFieldName: "price"
  },
  "AF-STBL-USDT-NANO-LP": {
    decimals: 6,
    creator: "NBJ4JCAO4DYHUUKSDP6JECOL64ZSCJWJAN4BWOA2DPSJVX6TV25YMNGXSA",
    managerAppId: 661204747,
    managerAddress: "YKY67NAXY7W575PBNZBITCJRSU3PRQ3O7C6V5FDINULVXSNJ2MUVTMF2EQ",
    marketAppId: 661199805,
    marketAddress: "BBCAECU3IP2WCPZZCQ2MHLTSHYH37MYJRHAJZMBC366STNHRW5IUPF5Y2U",
    underlyingAssetId: 659677515,
    bankAssetId: 661205660,
    oracleAppId: 451327550,
    bankAssetDecimals: 6,
    oracleFieldName: "price"
  },
  "AF-XET-STBL-LP": {
    decimals: 6,
    creator: "BXXGBG6U43DIUEFK23X66BCLUBS62CKJOIGDURBBIZVDGVU4YKRZ6FKLXY",
    managerAppId: 635813909,
    managerAddress: "PQT7UC2IXUECGVVW2ZSP3JUU23TQCECI2ULLPZ4VRXVQZWAXFPR66NDJ4A",
    marketAppId: 635812850,
    marketAddress: "OPGEPS7ZW6PIH4JU3WHIYCMME5N4NTOCOZKXOCWYBLURGSLEIQE5ZSBX6Q",
    underlyingAssetId: 635256863,
    bankAssetId: 635830471,
    oracleAppId: 451327550,
    bankAssetDecimals: 6,
    oracleFieldName: "price"
  },
  "AF-ZONE-STBL-LP": {
    decimals: 6,
    creator: "P2HHBT77PKXS6M2ISGRHLYTRJ6D4GRG5RD3IUGIBJCTORXSNAMH7VKC5DI",
    managerAppId: 647785804,
    managerAddress: "JE64YADSGF7XF6DMXH5SEBWUNGVPSTSS6XQDY6LR5ITG3MBGNGFAX4LKBM",
    marketAppId: 647785158,
    marketAddress: "FEQ6DDIY745ZNCSQ5SZUWGRLFIINT2HIVN6KLNSLQNRMG2SDWICJBYIMWY",
    underlyingAssetId: 647801343,
    bankAssetId: 647786241,
    oracleAppId: 451327550,
    bankAssetDecimals: 6,
    oracleFieldName: "price"
  },
  "AF-DEFLY-STBL-LP": {
    decimals: 6,
    creator: "7X4HZLCJOI42P2RNN4SCMFRPNG2YM4S3A34R444EETQRWIC7INCOWBR2EI",
    managerAppId: 639747739,
    managerAddress: "MIOKVGPKOHVZM2KRPDFRNDXYVVA5FZ3TIM5OR2QDTQ5UFB2ICWYY44VCCQ",
    marketAppId: 639747119,
    marketAddress: "2ZAELECBKOA3XULWXVFVL52EVILWQOWBWHQLO3KATEJEXWZHX3KJ5L46G4",
    underlyingAssetId: 624956449,
    bankAssetId: 639748671,
    oracleAppId: 451327550,
    bankAssetDecimals: 6,
    oracleFieldName: "price"
  },
  "AF-goBTC-STBL-LP": {
    decimals: 6,
    creator: "BXXGBG6U43DIUEFK23X66BCLUBS62CKJOIGDURBBIZVDGVU4YKRZ6FKLXY",
    managerAppId: 635863793,
    managerAddress: "NU6F4TIRFAZYMFJAGX3T7DXPCSLPRXVSITT4UF57OIEM4BKECDBG3TNN2Q",
    marketAppId: 635860537,
    marketAddress: "KKZHMTU22UO43EAG7SJGUGDKZNI65CVNRROF3NZ35S23SUZWGODESAOF4Y",
    underlyingAssetId: 635846733,
    bankAssetId: 635866896,
    oracleAppId: 451327550,
    bankAssetDecimals: 6,
    oracleFieldName: "price"
  },
  "AF-goETH-STBL-LP": {
    decimals: 6,
    creator: "BXXGBG6U43DIUEFK23X66BCLUBS62CKJOIGDURBBIZVDGVU4YKRZ6FKLXY",
    managerAppId: 635866213,
    managerAddress: "R4OR4QIGTMUCIJNQA4PV7SUAEBQUPDHXA7TJGTECVUBIF2M4WAF6S7JGTA",
    marketAppId: 635864509,
    marketAddress: "6LIQSNKB3WH226AXLLZU7OL6WXTY7S62N66OYHLVGGBENDUDU3ATKIGDAQ",
    underlyingAssetId: 635854339,
    bankAssetId: 635877693,
    oracleAppId: 451327550,
    bankAssetDecimals: 6,
    oracleFieldName: "price"
  },
  "AF-OPUL-STBL-LP": {
    decimals: 6,
    creator: "Z36ZXH5J7X4PMPTNDE4LSKY6UEQYIAZ57SKWH5JE4JFODFIEOKNPX2GH4U",
    managerAppId: 637795072,
    managerAddress: "ZJ2NAMBLJJABX2J42JUO2Z66ZQHO4FPTL42OUSEXKBTSRDD3MVO6MR6GWI",
    marketAppId: 637793356,
    marketAddress: "SX5YC2N2D657HCEZDQQPVMYB3PAHLFSFWXDQJS5GAGK4PYE3UD3TZTRWXA",
    underlyingAssetId: 637802380,
    bankAssetId: 637808564,
    oracleAppId: 451327550,
    bankAssetDecimals: 6,
    oracleFieldName: "price"
  },
  SEVN: {
    marketCounter: 7,
    marketAppId: 465814371,
    marketAddress: "K75YX4ZN3J43R2JTRWB6M3KXNPWAJJVPFSMIRAGQO77TKXKHKBFKSRZGGA"
  },
  EGHT: {
    marketCounter: 8,
    marketAppId: 465814435,
    marketAddress: "P6B5MK2FMN24IVRYMQMEPZHJPCNN6OUKFI5OSTOUREC47HPQNUXAUKF4TY"
  },
  NINE: {
    marketCounter: 9,
    marketAppId: 465814472,
    marketAddress: "PWVB7SHASD5XJNQFZHC5UAR5UYY33TW62YA6JVOW6PMYNZ7KMARPXKMFRU"
  },
  TENN: {
    marketCounter: 10,
    marketAppId: 465814527,
    marketAddress: "K7TNWBPCKLJKX3KHUZ5VA7YKGWNPHM4E6HQ5HGD7VFVYZ3232RJFGATMTM"
  },
  ELVN: {
    marketCounter: 11,
    marketAppId: 465814582,
    marketAddress: "LEHVWIH62DHSXLXFBPAXHYZZYGO7ONJ4HJHQLX4LJSIXSM66FPN5BXRCPU"
  },
  TWLV: {
    marketCounter: 12,
    marketAppId: 465814620,
    marketAddress: "S6LBCGD4UFECPY3P67QFURVDXCBPWZXG56VJ43UVBK7ODIODF6UOX6BX4A"
  },
  TRTN: {
    marketCounter: 13,
    marketAppId: 465814664,
    marketAddress: "HHHROS6MPEFEXJ7JQOKASR67EEPRM3NRGWLREW54XBUHF6AQ3HYGQQIGCY"
  },
  FRTN: {
    marketCounter: 14,
    marketAppId: 465814701,
    marketAddress: "XFWV3BF47DBLJ2GY2WUUIIA3W4VTOFOALKKEJJNCWFG6DLHWZ6SFUQXPJA"
  },
  FVTN: {
    marketCounter: 15,
    marketAppId: 465814744,
    marketAddress: "BTC4OBXRM53F3WT3YXK5LEP2JYB6OIDGQHM4EOHYPOYORKR4QHY7CMD35M"
  },
  SXTN: {
    marketCounter: 16,
    marketAppId: 465814807,
    marketAddress: "F253XGHUENH36WTAVWR2DE6VPAF2FV7L7H3QESM5Q7QXQTEX5T2C2HT3NU"
  },
  XET: {
    decimals: 9,
    underlyingAssetId: 283820866
  },
  ZONE: {
    decimals: 6,
    underlyingAssetId: 444035862
  },
  DEFLY: {
    decimals: 6,
    underlyingAssetId: 470842789
  },
  OPUL: {
    decimals: 10,
    underlyingAssetId: 287867876
  },
  BANK: {
    decimals: 6,
    underlyingAssetId: 51642940
  },
  USDT: {
    decimals: 6,
    underlyingAssetId: 312769
  }
}
export const foreignAppIds = [465814065, 465814103, 465814149, 465814222, 465814278, 465814318]

export const SECONDS_PER_YEAR = 60 * 60 * 24 * 365
export const SCALE_FACTOR = 1e9
export const REWARDS_SCALE_FACTOR = 1e14
export const PARAMETER_SCALE_FACTOR = 1e3

let orderedOracleAppIds = []
let orderedMarketAppIds = []
let orderedMarketData = []
let orderedSupportedMarketAppIds = []
let marketCounterToAssetName = {}
let assetIdToAssetName = {}
for (const assetName of orderedAssets) {
  orderedOracleAppIds.push(assetDictionary[assetName]["oracleAppId"])
  orderedSupportedMarketAppIds.push(assetDictionary[assetName]["marketAppId"])
  marketCounterToAssetName[assetDictionary[assetName]["marketCounter"]] = assetName
  if (assetName != "vALGO") {
    assetIdToAssetName[assetDictionary[assetName]["underlyingAssetId"]] = assetName
  }
  assetIdToAssetName[assetDictionary[assetName]["bankAssetId"]] = "b" + assetName
}
console.log("orderedSupportedMarketAppIds=", orderedSupportedMarketAppIds)
for (const assetName of extraAssets) {
  assetIdToAssetName[assetDictionary[assetName]["underlyingAssetId"]] = assetName
}

for (const assetName of orderedAssetsAndPlaceholders) {
  orderedMarketAppIds.push(assetDictionary[assetName]["marketAppId"])
}
export {
  orderedOracleAppIds,
  orderedMarketAppIds,
  orderedSupportedMarketAppIds,
  marketCounterToAssetName,
  assetIdToAssetName
}
