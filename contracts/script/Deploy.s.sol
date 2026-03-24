// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/BuyMeACoffee.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        BuyMeACoffee coffee = new BuyMeACoffee();
        console.log("BuyMeACoffee deployed at:", address(coffee));
        vm.stopBroadcast();
    }
}
