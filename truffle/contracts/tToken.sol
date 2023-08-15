// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract tToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Test Token", "tTOKEN") {
        _mint(msg.sender, initialSupply);
    }

    uint digits = 18;
    uint _mintAmount = 50;
    uint _mintLeft = 1000;
    uint mintForAccount = 5;
    mapping(address => uint256) private _mintDoneAccount;


    function mintToken() public {
        require(_mintLeft > 0, "Maximum mint reached");
        require(_mintDoneAccount[msg.sender] < mintForAccount, "Maximum mint reached for the account");
        _mint(msg.sender, _mintAmount * 10 ** digits);
        _mintLeft--;
        _mintDoneAccount[msg.sender]++;
    }

    function mintLeft() public view returns (uint) {
        return _mintLeft;
    }

    function mintLeftAddress(address _account) public view returns (uint) {
        return mintForAccount - _mintDoneAccount[_account];
    }

    function mintAmount() public view returns (uint) {
        return _mintAmount;
    }
}
