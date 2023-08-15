var Token;
var userAccount;
var lastBalance;

function startApp() {
    const tokenContract = '0x346E6993E6Fa30826CFcabb509D95363475108cA';
    Token = new web3.eth.Contract(tokenABI, tokenContract);

    var accountInterval = setInterval(function() {
        // Check if the account has been changed
        if (window.ethereum.selectedAddress !== userAccount) {
            // address
            userAccount = window.ethereum.selectedAddress;
            console.log(userAccount);
            // Show address to <span>
            try {
                var sAddress = document.getElementById("address");
                sAddress.innerHTML = userAccount;
            } catch (error) {
                // console.error(error);
            }

            // call function
            totalSupply();
            name();
            symbol();
            mintAmount();
        }
        // Check if your balance has changed
        checkAndUpdateBalance();
        checkAndUpdateBalanceToken(userAccount); 

        // Check if the mint has been changed
        mintLeft();
        mintLeftAddress();
    }, 1000);
}

// Function to update the Ethereum balance
async function checkAndUpdateBalance() {
    try {
        const latestBalance = await web3.eth.getBalance(userAccount, 'latest');
        const result = await ethereum.request({ method: 'eth_getBalance', params: [userAccount, 'latest'] });
        const balance = parseFloat(web3.utils.fromWei(result, 'ether'));
        const balanceFixed = balance.toFixed(9);

        // Check for the presence of the id in the html
        const sBalance = document.getElementById("balance");
        if (sBalance) {
            if (sBalance.innerHTML !== balanceFixed) {
                console.log(balance + " ETH");
                // Show balance in HTML <span> element
                sBalance.innerHTML = balanceFixed;
            }
        }
    } catch (error) {
        console.error("Errore durante l'aggiornamento del saldo:", error);
    }
}

// Function to update the token balance
async function checkAndUpdateBalanceToken(userAccount) {
    try {
        const tokenBalance = await Token.methods.balanceOf(userAccount).call();

        // Check for the presence of the id in the html
        const sTokenBalance = document.getElementById("token-balance");
        if (sTokenBalance) {
            const tokenBalanceFixed = Number(tokenBalance) / 10 ** 18;
            //Show balance in HTML <span> and <input> element
            sTokenBalance.innerHTML = tokenBalanceFixed.toFixed(2);
            sTokenBalance.placeholder = tokenBalanceFixed;
        }
    } catch (error) {
        console.error(error);
    }
}

async function name() {
    try {
        const nameToken = await Token.methods.name().call();

        // Check for the presence of the id in the html
        const sNameToken = document.getElementById("token-name");
        if (sNameToken) {
            sNameToken.innerHTML = nameToken;
        }
    } catch (error) {
        console.error(error);
    }
}

async function symbol() {
    try {
        const symbolToken = await Token.methods.symbol().call();

        // Check for the presence of the id in the html
        const sSymbolToken = document.getElementById("token-symbol");
        if (sSymbolToken) {
            sSymbolToken.innerHTML = symbolToken;
        }
    } catch (error) {
        console.error(error);
    }
}

async function totalSupply() {
    try {
        const totalSupply = await Token.methods.totalSupply().call();

        // Check for the presence of the id in the html
        const sTotalSupply = document.getElementById("token-totalsupply");
        if (sTotalSupply) {
            const totalSupplyFixed = Number(totalSupply) / 10 ** 18;
            sTotalSupply.innerHTML = totalSupplyFixed.toFixed(0);
        }
    } catch (error) {
        console.error(error);
    }
}

async function mint() {
    try {
        const mintToken = await Token.methods.mintToken().send({ from: userAccount })
    } catch (error) {
        console.error(error);
    }
}

async function mintLeft() {
    try {
        const mintLeft = await Token.methods.mintLeft().call();

        // Check for the presence of the id in the html
        const smintLeft = document.getElementById("token-mint-left");
        if (smintLeft) {
            smintLeft.innerHTML = mintLeft;
        }
    } catch (error) {
        console.error(error);
    }
}

async function mintLeftAddress() {
    try {
        const mintLeftAddress = await Token.methods.mintLeftAddress(userAccount).call();

        // Check for the presence of the id in the html
        const smintLeftAddress = document.getElementById("token-mint-left-address");
        if (smintLeftAddress) {
            smintLeftAddress.innerHTML = mintLeftAddress;
        }
    } catch (error) {
        console.error(error);
    }
}

async function mintAmount() {
    try {
        const mintAmount = await Token.methods.mintAmount().call();

        // Check for the presence of the id in the html
        const smintAmount = document.getElementById("token-mint-amount");
        if (smintAmount) {
            smintAmount.innerHTML = mintAmount;
        }
    } catch (error) {
        console.error(error);
    }
}


async function transfer(to, amount) {
    try {
      console.log("Transfer in progress...");
  
      // Perform the transfer
      const tx = await Token.methods.transfer(to, amount).send({ from: userAccount });
  
      console.log("Transaction completed successfully. Transaction hash:", tx.transactionHash);
      return tx.transactionHash;
    } catch (error) {
      console.error("Error transferring token:", error);
      throw error;
    }
  }


// When the Connect Metamask button is pressed
document.getElementById("connect-button").addEventListener("click", event => {
    let account;
    // Verify installed metamask
    if (typeof window.ethereum !== 'undefined') {
        console.log("Metamask Installed!");

        // Set provider
        web3 = new Web3(window.ethereum);

        // Connection account metamask
        ethereum.request({method: 'eth_requestAccounts'})
            .then(accounts => {

            // Change button status
            const connect = document.getElementById("metamask");
            connect.innerHTML = "Connected";
            })

            .catch((error) => {
                console.log('Unable to get access to Metamask:', error);
            });
        


    } else {
        console.log('Please Install MetaMask!'); 
    }

    startApp();

});

// When the Send button is pressed
const sendButton = document.getElementById("send-button");
if (sendButton) {
    sendButton.addEventListener("click", event => {
        // recipient address
        const toAddress = document.querySelector(".send-textinput.input").value;

        // amount of token to send
        const tokenAmount = document.getElementById("token-balance").value;

        transfer(toAddress, web3.utils.toWei(tokenAmount, 'ether'));
    });
}

// When the Mint Token button is pressed
const mintButton = document.getElementById('mint-button');
if (mintButton) {
    mintButton.addEventListener("click", event => {
        // check mints left and mints left for accounts greater than 0
        if (document.getElementById('token-mint-left').innerHTML > 0 && document.getElementById('token-mint-left-address').innerHTML > 0 ) {
            mint();
        }
    });
}

