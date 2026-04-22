// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {Guestbook} from "../src/Guestbook.sol";

contract DeployGuestbook is Script {
    function run() external returns (Guestbook guestbook) {
        vm.startBroadcast();
        guestbook = new Guestbook();
        vm.stopBroadcast();
    }
}
