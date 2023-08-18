// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract tToken is ERC20, Ownable {
    uint8 digits = 18;
    uint8 public mintAmount;
    uint16 public mintLeft;
    uint8 public mintForAccount;
    uint8 public feeRate;
    uint16 public fee1Month;
    uint16 public fee3Months;
    uint16 public fee6Months;

    constructor(uint256 initialSupply) ERC20("Test Token", "tTOKEN") {
        _mint(msg.sender, initialSupply);
        digits = 18;
        mintAmount = 50;
        mintLeft = 1000;
        mintForAccount = 5;
        feeRate = 2;
        fee1Month = 5;
        fee3Months = 12;
        fee6Months = 20;
    }

    mapping(address => uint256) private _mintLeftAccount;
    
    function mintToken() public {
        require(mintLeft > 0, "Maximum mint reached");
        require(_mintLeftAccount[msg.sender] < mintForAccount, "Maximum mint reached for the account");
        mintLeft--;
        _mintLeftAccount[msg.sender]++;
        _mint(msg.sender, mintAmount * 10 ** digits);
    }

    function mintLeftAddress(address _account) public view returns (uint) {
        return mintForAccount - _mintLeftAccount[_account];
    }


    function setFeeRate(uint8 _rate) external onlyOwner {
        require(_rate <= 100, "Rate must be <= 100"); // Ensure the rate is a valid percentage
        feeRate = _rate;
    }

    function setFee1Month(uint16 _fee) external onlyOwner {
        fee1Month = _fee;
    }
    function setFee3Months(uint16 _fee) external onlyOwner {
        fee3Months = _fee;
    }
    function setFee6Months(uint16 _fee) external onlyOwner {
        fee6Months = _fee;
    }

    function transfer(address _recipient, uint256 _amount) public override returns (bool) {
        uint256 feeAmount = (_amount * feeRate) / 100;

        _burn(_msgSender(), feeAmount);
        _transfer(_msgSender(), _recipient, _amount - feeAmount);
        return true;
    }

    struct LockedTokens {
        uint256 amount;
        uint8 months;
        uint256 releaseTime;
    }

    mapping(address => LockedTokens[]) public lockedBalances;

    function blockTokens(uint256 _lockAmount, uint8 _months) public {
        require(_months == 1 || _months == 3 || _months == 6, "Invalid lockup period");
        require(balanceOf(_msgSender()) >= _lockAmount);

        // Calculate when the locked tokens will be available for withdrawal
        uint256 releaseTime = block.timestamp + _months * 30 days;
        lockedBalances[_msgSender()].push(LockedTokens({ amount: _lockAmount, months: _months, releaseTime: releaseTime }));

        _burn(_msgSender(), _lockAmount);
    }

    function rewardsCalculation(uint8 _months, uint256 _amount) internal view returns (uint256) {
        if (_months == 1) {
            return _amount * fee1Month / 100;
        }
        if (_months == 3) {
            return _amount * fee3Months / 100;
        }
        if (_months == 6) {
            return _amount * fee6Months / 100;
        }
        return 0;
    }

    function getUnlockedTokens(address _account) public view returns (uint256, uint256) {
        uint256 unlockedAmount = 0;
        uint256 rewardsAmount = 0;

        for (uint256 i = 0; i < lockedBalances[_account].length;) {
            if (block.timestamp >= lockedBalances[_account][i].releaseTime) {
                // token unlocking calculation
                unlockedAmount += lockedBalances[_account][i].amount;
                // reward calculation
                rewardsAmount += rewardsCalculation(lockedBalances[_account][i].months, lockedBalances[_account][i].amount);
            }
            i++;
        }
        return (unlockedAmount, rewardsAmount);
    }

    function withdrawUnlockedTokens() public {
        uint256 unlockedAmount = 0;
        uint256 rewardsAmount = 0;

        for (uint256 i = 0; i < lockedBalances[msg.sender].length;) {
            // expiration check of blocked tokens
            if (block.timestamp >= lockedBalances[msg.sender][i].releaseTime) {
                // adding token to unlock
                unlockedAmount += lockedBalances[msg.sender][i].amount;
                // reward calculation
                rewardsAmount += rewardsCalculation(lockedBalances[msg.sender][i].months, lockedBalances[msg.sender][i].amount);

                if (i < lockedBalances[msg.sender].length - 1) {
                    lockedBalances[msg.sender][i] = lockedBalances[msg.sender][lockedBalances[msg.sender].length - 1];
                }
                lockedBalances[msg.sender].pop();
            } else {
                i++;
            }
        }
        require(unlockedAmount > 0, "No unlocked tokens available");
        _mint(msg.sender, unlockedAmount + rewardsAmount);
    }

}
