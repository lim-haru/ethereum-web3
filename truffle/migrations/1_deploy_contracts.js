var tToken = artifacts.require("tToken");

module.exports = function(deployer) {
  deployer.deploy(tToken, '1000000000000000000000000');
};