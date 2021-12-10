import sys
sys.path.insert(0, "../../algofi-protocol/contracts")
from globals import *

if __name__ == "__main__":
    f = open("contractStrings.ts", "w")
    
    f.write("export const marketStrings = {\n")
    for key, value in algofi_market_strings.__dict__.items():
        f.write("    {} : \"{}\",\n".format(key, value))
    f.write("}\n")
    
    f.write("export const managerStrings = {\n")
    for key, value in algofi_manager_strings.__dict__.items():
        f.write("    {} : \"{}\",\n".format(key, value))
    f.write("}\n")
