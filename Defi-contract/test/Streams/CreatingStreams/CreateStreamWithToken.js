const convertEtherToWei = require("../../convertEtherToWei");
const ContractInstances = require("../../ContractInstances");
const { expect } = require("chai");

const CreateStreamWithToken = () => {
  let addr1;
  let DefiInstances;
  let owner;
  let startTime;
  let endTime;
  let ERC20Hardhat;

  beforeEach(async () => {
    ({ owner, addr1, DefiInstances, ERC20Hardhat } = await ContractInstances());
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    const _startTime = timestampBefore;
    const _endTime = timestampBefore + 400;
    startTime = _startTime;
    endTime = _endTime;
    await ERC20Hardhat.approve(DefiInstances.address, convertEtherToWei("10"));
  });

  it("Should revert if tokenAddress is zero address ", async () => {
    await expect(
      DefiInstances.CreateStreamForToken(
        endTime,
        startTime,
        convertEtherToWei("10"),
        ethers.constants.AddressZero,
        addr1.address,
        20
      )
    )
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("Token Address is a zero address");
  });

  it("should revert if stream to zero address", async () => {
    await expect(
      DefiInstances.CreateStreamForToken(
        endTime,
        startTime,
        convertEtherToWei("10"),
        ERC20Hardhat.address,
        ethers.constants.AddressZero,

        20
      )
    )
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("stream to the zero address");
  });
  it("should revert if stream to contract itself", async () => {
    await expect(
      DefiInstances.CreateStreamForToken(
        endTime,
        startTime,
        convertEtherToWei("10"),
        ERC20Hardhat.address,
        DefiInstances.address,
        20
      )
    )
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("stream to the contract itself");
  });
  it("should revert if stream to caller", async () => {
    await expect(
      DefiInstances.CreateStreamForToken(
        endTime,
        startTime,
        convertEtherToWei("10"),
        ERC20Hardhat.address,
        owner.address,
        20
      )
    )
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("stream to the caller");
  });
  it("should revert if deposit is zero", async () => {
    await expect(
      DefiInstances.CreateStreamForToken(
        endTime,
        startTime,
        convertEtherToWei("0"),
        ERC20Hardhat.address,
        addr1.address,
        20
      )
    )
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("deposit is zero");
  });
  it("should revert if startTime is less than current Time", async () => {
    await expect(
      DefiInstances.CreateStreamForToken(
        endTime,
        startTime - 400,
        convertEtherToWei("10"),
        ERC20Hardhat.address,
        addr1.address,
        20
      )
    )
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("StartTime less than current Time");
  });
  it("should revert if stop time before the start time", async () => {
    await expect(
      DefiInstances.CreateStreamForToken(
        endTime,
        startTime + 500,
        convertEtherToWei("10"),
        ERC20Hardhat.address,
        addr1.address,
        20
      )
    )
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("stop time before the start time");
  });
  it("event should be emmited when stream is created  ", async () => {
    await expect(
      DefiInstances.CreateStreamForToken(
        endTime,
        startTime + 200,
        convertEtherToWei("10"),
        ERC20Hardhat.address,
        addr1.address,
        20
      )
    )
      .to.emit(DefiInstances, "CreatingStreamWithToken")
      .withArgs(
        addr1.address,
        owner.address,
        0,
        ERC20Hardhat.address,
        convertEtherToWei("10"),
        startTime + 200,
        endTime
      );
  });
};

module.exports = CreateStreamWithToken;
