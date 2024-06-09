const convertEtherToWei = require("../../convertEtherToWei");
const ContractInstances = require("../../ContractInstances");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const CancelStreamIdOfToken = () => {
  let addr1;
  let DefiInstances;
  let owner;
  let addr2;
  let ERC20Hardhat;
  let startTime;
  let endTime;

  beforeEach(async () => {
    ({ owner, addr1, addr2, DefiInstances, ERC20Hardhat } =
      await ContractInstances());
    await ERC20Hardhat.approve(DefiInstances.address, convertEtherToWei("10"));
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    startTime = timestampBefore + 1;
    endTime = timestampBefore + 400;
    const createStream = await DefiInstances.CreateStreamForToken(
      endTime,
      startTime,
      convertEtherToWei("10"),
      ERC20Hardhat.address,
      addr1.address,
      20
    );
    await createStream.wait();
  });

  it("should revert when the stream doesnot exist", async () => {
    await expect(DefiInstances.CancelStream(1))
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("The stream dosnot exists");
  });

  it("Should revert When the the caller is nor receiver or sender", async () => {
    await expect(DefiInstances.connect(addr2).CancelStream(0))
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("The Caller Is not Receiver or Sender");
  });
  it("Shouldnot revert When the the caller is  receiver or sender", async () => {
    await expect(DefiInstances.connect(addr1).CancelStream(0)).to.be
      .revertedWithCustomError;
    await expect(DefiInstances.CancelStream(0)).to.be.revertedWithCustomError;
  });

  it("The stream should be cancelled and blances should be transferred", async () => {
    await ethers.provider.send("evm_increaseTime", [24]);
    await ethers.provider.send("evm_mine");

    await expect(
      DefiInstances.connect(addr1).CancelStream(0)
    ).to.changeTokenBalances(
      ERC20Hardhat,
      [DefiInstances.address, addr1.address, owner.address],
      [convertEtherToWei("-10"), "626566416040100250", "9373433583959899750"]
    );

    const res = await DefiInstances.getStreamDetails(0);
    expect(res.Exist).to.equal(false);

    // Now the other function doesnot  works
    await expect(DefiInstances.CancelStream(0))
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("The stream dosnot exists");
    await expect(DefiInstances.withdrawFromStream(0))
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("The stream dosnot exists");
  });

  it("event should be emmited when  stream is cancelled", async () => {
    await ethers.provider.send("evm_increaseTime", [24]);
    await ethers.provider.send("evm_mine");
    await expect(DefiInstances.CancelStream(0))
      .to.emit(DefiInstances, "CancelStreamWithToken")
      .withArgs(
        0,
        owner.address,
        addr1.address,
        ERC20Hardhat.address,
        "9373433583959899750",
        "626566416040100250"
      );
  });
};

module.exports = CancelStreamIdOfToken;
