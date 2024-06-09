const convertEtherToWei = require("../convertEtherToWei");
const ContractInstances = require("../ContractInstances");
const { expect } = require("chai");

const BalanceOf = () => {
  let addr1;
  let DefiInstances;
  let owner;
  let addr2;
  let ERC20Hardhat;

  beforeEach(async () => {
    ({ owner, addr1, addr2, DefiInstances, ERC20Hardhat } =
      await ContractInstances());
  });

  it("should revert when the stream doesnot exist", async () => {
    await expect(DefiInstances.balanceOf(0, addr1.address))
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("The stream dosnot exists");
  });
  it("Should return the balance of address  after stream is created with Ether ", async () => {
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    const createStream = await DefiInstances.CreateStreamForEth(
      timestampBefore + 400,
      timestampBefore + 1,
      addr1.address,
      20,
      { value: convertEtherToWei("10") }
    );
    await createStream.wait();
    await ethers.provider.send("evm_increaseTime", [25]);
    await ethers.provider.send("evm_mine");

    expect(await DefiInstances.balanceOf(0, addr1.address)).to.equal(
      "626566416040100250"
    );
    expect(await DefiInstances.balanceOf(0, owner.address)).to.equal(
      "9373433583959899750"
    );
  });
  it("Should return the balance of address  after stream is created with Token ", async () => {
    await ERC20Hardhat.approve(DefiInstances.address, convertEtherToWei("10"));
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    const createStream = await DefiInstances.CreateStreamForToken(
      timestampBefore + 401,
      timestampBefore + 2,
      convertEtherToWei("10"),
      ERC20Hardhat.address,
      addr1.address,
      20
    );
    await createStream.wait();
    await ethers.provider.send("evm_increaseTime", [26]);
    await ethers.provider.send("evm_mine");

    expect(await DefiInstances.balanceOf(0, addr1.address)).to.equal(
      "626566416040100250"
    );
    expect(await DefiInstances.balanceOf(0, owner.address)).to.equal(
      "9373433583959899750"
    );
  });
};

module.exports = BalanceOf;
