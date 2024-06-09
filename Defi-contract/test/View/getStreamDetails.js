const convertEtherToWei = require("../convertEtherToWei");
const ContractInstances = require("../ContractInstances");
const { expect } = require("chai");

const GetStreamDetails = () => {
  let addr1;
  let DefiInstances;
  let owner;
  let addr2;
  let ERC20Hardhat;

  beforeEach(async () => {
    ({ owner, addr1, addr2, DefiInstances, ERC20Hardhat } =
      await ContractInstances());
  });

  // it("should revert when the stream doesnot exist", async () => {
  //   await expect(DefiInstances.getStreamDetails(0))
  //     .to.be.revertedWithCustomError(DefiInstances, "Errors")
  //     .withArgs("The stream dosnot exists");
  // });
  it("Should return the streamDetails of streamId  after stream is created with Ether ", async () => {
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    const startTime = timestampBefore + 1;
    const endTime = timestampBefore + 400;
    const createStream = await DefiInstances.CreateStreamForEth(
      endTime,
      startTime,
      addr1.address,
      20,
      { value: convertEtherToWei("10") }
    );
    await createStream.wait();
    const res = await DefiInstances.getStreamDetails(0);
    expect(res.startTime).to.equal(startTime);
    expect(res.calculationTime).to.equal(startTime + 20);
    expect(res.endTime).to.equal(endTime);
    expect(res.balanceOut).to.equal(0);
    expect(res.periodicity).to.equal(20);
    expect(res.deposit).to.equal(convertEtherToWei("10"));
    expect(res.recipient).to.equal(addr1.address);
    expect(res.sender).to.equal(owner.address);
    expect(res.isEth).to.equal(true);
    expect(res.Exist).to.equal(true);
    expect(res.tokenAddress).to.equal(ethers.constants.AddressZero);
  });
  it("Should return the streamDetails of streamId  after stream is created with Token ", async () => {
    await ERC20Hardhat.approve(DefiInstances.address, convertEtherToWei("10"));
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    const startTime = timestampBefore + 2;
    const endTime = timestampBefore + 401;
    const createStream = await DefiInstances.CreateStreamForToken(
      endTime,
      startTime,
      convertEtherToWei("10"),
      ERC20Hardhat.address,
      addr1.address,
      20
    );
    const res = await DefiInstances.getStreamDetails(0);
    expect(res.startTime).to.equal(startTime);
    expect(res.calculationTime).to.equal(startTime + 20);
    expect(res.endTime).to.equal(endTime);
    expect(res.balanceOut).to.equal(0);
    expect(res.periodicity).to.equal(20);
    expect(res.deposit).to.equal(convertEtherToWei("10"));
    expect(res.recipient).to.equal(addr1.address);
    expect(res.sender).to.equal(owner.address);
    expect(res.isEth).to.equal(false);
    expect(res.Exist).to.equal(true);
    expect(res.tokenAddress).to.equal(ERC20Hardhat.address);
  });
};

module.exports = GetStreamDetails;
