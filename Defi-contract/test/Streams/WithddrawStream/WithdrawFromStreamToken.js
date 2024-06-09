const convertEtherToWei = require("../../convertEtherToWei");
const ContractInstances = require("../../ContractInstances");
const { expect } = require("chai");

const WithdrawDepositFromStreamToken = () => {
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
    ).to.changeTokenBalances(
      ERC20Hardhat,
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
    expect(res.isEth).to.equal(false);
    expect(res.Exist).to.equal(true);
    expect(res.tokenAddress).to.equal(ERC20Hardhat.address);
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
    expect(res.isEth).to.equal(false);
    expect(res.Exist).to.equal(true);
    expect(res.tokenAddress).to.equal(ERC20Hardhat.address);
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
    expect(res.isEth).to.equal(false);
    expect(res.Exist).to.equal(false);
    expect(res.tokenAddress).to.equal(ERC20Hardhat.address);

    // Now the stream Id Doesnot exist....

    await expect(DefiInstances.withdrawFromStream(0))
      .to.be.revertedWithCustomError(DefiInstances, "Errors")
      .withArgs("The stream dosnot exists");
  });

  it("event should be emmited when deposit Withdrawn", async () => {
    await ethers.provider.send("evm_increaseTime", [24]);
    await ethers.provider.send("evm_mine");
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;

    await expect(DefiInstances.withdrawFromStream(0))
      .to.emit(DefiInstances, "WithdrawDepositOfStreamWithToken")
      .withArgs(
        addr1.address,
        owner.address,
        0,
        ERC20Hardhat.address,
        "626566416040100250",
        timestampBefore + 1
      );
  });
};

module.exports = WithdrawDepositFromStreamToken;
