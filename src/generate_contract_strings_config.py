import sys
sys.path.insert(0, "../../algofi-protocol/contracts")
from globals import *

if __name__ == "__main__":
    f = open("contractStrings.ts", "w")
    
    market_strings = algofi_market_strings()
    f.write("export const marketStrings = {\n")
    for key, value in market_strings.__dict__.items():
        f.write("    {} : \"{}\",\n".format(key, value))
    f.write("}\n")
    
    manager_strings = algofi_manager_strings()
    f.write("export const managerStrings = {\n")
    for key, value in manager_strings.__dict__.items():
        f.write("    {} : \"{}\",\n".format(key, value))
    f.write("}\n")