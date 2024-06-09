const convertEtherToWei = require("../../convertEtherToWei");
const ContractInstances = require("../../ContractInstances");
const { expect } = require("chai");

const WithdrawDepositFromStreamEth = () => {
  let addr1;
  let DefiInstances;
  let owner;
  let addr2;
  let startTime;
  let endTime;

  beforeEach(async () => {
    ({ owner, addr1, addr2, DefiInstances, ERC20Hardhat } =
      await ContractInstances());
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    startTime = timestampBefore + 1;
    endTime = timestampBefore + 400;
    const createStream = await DefiInstances.CreateStreamForEth(
      endTime,
      startTime,
      addr1.address,
      20,
      { value: convertEtherToWei("10") }
    );
    await createStream.wait();
  });

  it("should revert when the stream doesnot exist", async () => {
    await expect(DefiInstances.withdrawFromStream(1))
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("The stream dosnot exists");
  });

  it("Should revert When the the caller is nor receiver or sender", async () => {
    await expect(DefiInstances.connect(addr2).withdrawFromStream(0))
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("The Caller Is not Receiver or Sender");
  });
  it("Shouldnot revert When the the caller is  receiver or sender", async () => {
    await expect(DefiInstances.connect(addr1).withdrawFromStream(0)).to.be
      .revertedWithCustomError;
    await expect(DefiInstances.withdrawFromStream(0)).to.be
      .revertedWithCustomError;
  });

  it("Should revert if The Withdraw function is called before a periodic time", async () => {
    await expect(DefiInstances.connect(addr1).withdrawFromStream(0))
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("Not the time to take the money out");
  });

  it("balances of receiver and contract should be updated ", async () => {
    await ethers.provider.send("evm_increaseTime", [24]);
    await ethers.provider.send("evm_mine");
    await expect(
      DefiInstances.connect(addr1).withdrawFromStream(0)
    ).to.changeEtherBalances(
      [DefiInstances.address, addr1.address],
      ["-626566416040100250", "626566416040100250"]
    );
  });

  it("When the partial money is takenOut", async () => {
    await ethers.provider.send("evm_increaseTime", [24]);
    await ethers.provider.send("evm_mine");
    await DefiInstances.connect(addr1).withdrawFromStream(0);
    const res = await DefiInstances.getStreamDetails(0);
    expect(res.startTime).to.equal(startTime);
    expect(res.calculationTime).to.equal(startTime + 20 * 2);
    expect(res.endTime).to.equal(endTime);
    expect(res.balanceOut).to.equal("626566416040100250");
    expect(res.periodicity).to.equal(20);
    expect(res.deposit).to.equal(convertEtherToWei("10"));
    expect(res.recipient).to.equal(addr1.address);
    expect(res.sender).to.equal(owner.address);
    expect(res.isEth).to.equal(true);
    expect(res.Exist).to.equal(true);
    expect(res.tokenAddress).to.equal(ethers.constants.AddressZero);
  });

  it("When second time  the partial money is takenOut", async () => {
    await ethers.provider.send("evm_increaseTime", [24]);
    await ethers.provider.send("evm_mine");
    await DefiInstances.connect(addr1).withdrawFromStream(0);
    await ethers.provider.send("evm_increaseTime", [24]);
    await ethers.provider.send("evm_mine");
    await DefiInstances.connect(addr1).withdrawFromStream(0);
    const res = await DefiInstances.getStreamDetails(0);
    expect(res.startTime).to.equal(startTime);
    expect(res.calculationTime).to.equal(startTime + 20 * 3);
    expect(res.endTime).to.equal(endTime);
    expect(res.balanceOut).to.equal("1253132832080200500");
    expect(res.periodicity).to.equal(20);
    expect(res.deposit).to.equal(convertEtherToWei("10"));
    expect(res.recipient).to.equal(addr1.address);
    expect(res.sender).to.equal(owner.address);
    expect(res.isEth).to.equal(true);
    expect(res.Exist).to.equal(true);
    expect(res.tokenAddress).to.equal(ethers.constants.AddressZero);
  });

  it("When the full money is takenOut", async () => {
    await ethers.provider.send("evm_increaseTime", [500]);
    await ethers.provider.send("evm_mine");
    await DefiInstances.connect(addr1).withdrawFromStream(0);
    const res = await DefiInstances.getStreamDetails(0);
    expect(res.startTime).to.equal(startTime);
    expect(res.calculationTime).to.equal(startTime + 20 * 2);
    expect(res.endTime).to.equal(endTime);
    expect(res.balanceOut).to.equal(convertEtherToWei("10"));
    expect(res.periodicity).to.equal(20);
    expect(res.deposit).to.equal(convertEtherToWei("10"));
    expect(res.recipient).to.equal(addr1.address);
    expect(res.sender).to.equal(owner.address);
    expect(res.isEth).to.equal(true);
    expect(res.Exist).to.equal(false);
    expect(res.tokenAddress).to.equal(ethers.constants.AddressZero);

    // Now the other function doesnot  works

    await expect(DefiInstances.CancelStream(0))
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("The stream dosnot exists");
    await expect(DefiInstances.withdrawFromStream(0))
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("The stream dosnot exists");
  });
  it("event should be emmited when deposit Withdrawn ", async () => {
    await ethers.provider.send("evm_increaseTime", [24]);
    await ethers.provider.send("evm_mine");
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;

    await expect(DefiInstances.withdrawFromStream(0))
      .to.emit(DefiInstances, "WithdrawDepositOfStreamWithEth")
      .withArgs(
        addr1.address,
        owner.address,
        0,
        "626566416040100250",
        timestampBefore + 1
      );
  });
};

module.exports = WithdrawDepositFromStreamEth;
