const convertEtherToWei = require("../../convertEtherToWei");
const ContractInstances = require("../../ContractInstances");
const { expect } = require("chai");

const CreateStreamWithEth = () => {
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
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    const _startTime = timestampBefore;
    const _endTime = timestampBefore + 400;
    startTime = _startTime;
    endTime = _endTime;
  });

  it("should revert if stream to zero address", async () => {
    await expect(
      DefiInstances.CreateStreamForEth(
        startTime,
        endTime,
        ethers.constants.AddressZero,
        20,
        {
          value: convertEtherToWei("10"),
        }
      )
    )
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("stream to the zero address");
  });
  it("should revert if stream to contract itself", async () => {
    await expect(
      DefiInstances.CreateStreamForEth(
        startTime,
        endTime,
        DefiInstances.address,
        20,
        {
          value: convertEtherToWei("10"),
        }
      )
    )
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("stream to the contract itself");
  });
  it("should revert if stream to caller", async () => {
    await expect(
      DefiInstances.CreateStreamForEth(startTime, endTime, owner.address, 20, {
        value: convertEtherToWei("10"),
      })
    )
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("stream to the caller");
  });
  it("should revert if deposit is zero", async () => {
    await expect(
      DefiInstances.CreateStreamForEth(startTime, endTime, addr1.address, 20, {
        value: convertEtherToWei("0"),
      })
    )
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("deposit is zero");
  });
  it("should revert if startTime is less than current Time", async () => {
    await expect(
      DefiInstances.CreateStreamForEth(
        endTime,
        startTime - 400,
        addr1.address,
        20,
        {
          value: convertEtherToWei("10"),
        }
      )
    )
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("StartTime less than current Time");
  });
  it("should revert if stop time before the start time", async () => {
    await expect(
      DefiInstances.CreateStreamForEth(
        endTime,
        startTime + 500,
        addr1.address,
        20,
        {
          value: convertEtherToWei("10"),
        }
      )
    )
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("stop time before the start time");
  });
  it("event should be emmited when stream is created  ", async () => {
    await expect(
      DefiInstances.CreateStreamForEth(
        endTime,
        startTime + 200,
        addr1.address,
        20,
        { value: convertEtherToWei("10") }
      )
    )
      .to.emit(DefiInstances, "CreatingStreamWithEth")
      .withArgs(
        addr1.address,
        owner.address,
        0,
        convertEtherToWei("10"),
        startTime + 200,
        endTime
      );
  });
  it("The balances of contract and caller should be updated  ", async () => {
    await expect(
      DefiInstances.CreateStreamForEth(
        endTime,
        startTime + 200,
        addr1.address,
        20,
        { value: convertEtherToWei("10") }
      )
    ).to.changeEtherBalances(
      [DefiInstances.address, owner.address],
      [convertEtherToWei("10"), convertEtherToWei("-10")]
    );
  });
};

module.exports = CreateStreamWithEth;
