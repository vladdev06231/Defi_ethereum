const { ethers } = require("hardhat");
const convertEtherToWei = require("./convertEtherToWei");

const ContractInstances = async () => {
  [owner, addr1, addr2, addr3] = await ethers.getSigners();

  Defi = await ethers.getContractFactory("Defi");
  DefiInstances = await Defi.deploy();
  await DefiInstances.deployed();
  ERC20 = await ethers.getContractFactory("ERC20Token");
  ERC20Hardhat = await ERC20.deploy(convertEtherToWei("1000"));

  return {
    owner,
    addr1,
    addr2,
    addr3,
    DefiInstances,
    ERC20Hardhat,
  };
};

module.exports = ContractInstances;
