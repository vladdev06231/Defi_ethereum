const { ethers } = require("hardhat");

const convertEtherToWei = (n) => ethers.utils.parseEther(n);
module.exports = convertEtherToWei;
