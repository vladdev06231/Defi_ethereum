const CancelStreamIdOfEth = require("./Streams/CancelStream/CancelStreamIdOfEth");
const CancelStreamIdOfToken = require("./Streams/CancelStream/CancelStreamOfToken");
const CreateStreamWithEth = require("./Streams/CreatingStreams/CreateStreamWithEth");
const CreateStreamWithToken = require("./Streams/CreatingStreams/CreateStreamWithToken");
const WithdrawDepositFromStreamEth = require("./Streams/WithddrawStream/WithdrawFromStreamEth");
const WithdrawDepositFromStreamToken = require("./Streams/WithddrawStream/WithdrawFromStreamToken");
const BalanceOf = require("./View/BalanceOf");
const GetStreamDetails = require("./View/getStreamDetails");
describe("Defi", () => {
  describe("BalanceOf Function", BalanceOf);
  describe("Getting Details of particular Streams", GetStreamDetails);
  describe("Creating Stream With Id", CreateStreamWithEth);
  describe("Creating Stream With Token", CreateStreamWithToken);
  describe(
    "Withdrwaing Deposits From Streams  with Eth",
    WithdrawDepositFromStreamEth
  );
  describe(
    "Withdrwaing Deposits From Streams with Token Id",
    WithdrawDepositFromStreamToken
  );
  describe("Cancelling Stream with Eth", CancelStreamIdOfEth);
  describe("Cancelling Stream with Token", CancelStreamIdOfToken);
});
