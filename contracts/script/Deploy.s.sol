// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {BuyMeACoffee} from "../src/BuyMeACoffee.sol";

contract Deploy is Script {
    function run() external returns (BuyMeACoffee deployed) {
        address initialOwner = vm.envAddress("INITIAL_OWNER");
        vm.startBroadcast();
        deployed = new BuyMeACoffee(initialOwner);
        vm.stopBroadcast();
    }
}
