// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Defi is ReentrancyGuard {
    struct StreamDetails {
        uint256 startTime;
        uint256 endTime;
        uint256 balanceOut;
        uint256 periodicity;
        uint256 deposit;
        uint256 calculationTime;
        address tokenAddress;
        address payable recipient;
        address payable sender;
        bool isEth;
        bool Exist;
    }

    uint256 private streamId;

    mapping(uint256 => StreamDetails) public StreamContainer;

    event CreatingStreamWithEth(
        address indexed receiver,
        address indexed sender,
        uint256 indexed streamId,
        uint256 deposit,
        uint256 startTime,
        uint256 endTime
    );
    event CreatingStreamWithToken(
        address indexed receiver,
        address indexed sender,
        uint256 indexed streamId,
        address TokenAddress,
        uint256 deposit,
        uint256 startTime,
        uint256 endTime
    );
    event WithdrawDepositOfStreamWithEth(
        address indexed sender,
        address indexed receiver,
        uint256 indexed streamId,
        uint256 amount,
        uint256 time
    );
    event WithdrawDepositOfStreamWithToken(
        address indexed receiver,
        address indexed sender,
        uint256 indexed streamId,
        address tokenAddress,
        uint256 amount,
        uint256 time
    );
    event CancelStreamWithEth(
        uint256 indexed streamId,
        address indexed sender,
        address indexed recipient,
        uint256 senderBalance,
        uint256 recipientBalance
    );
    event CancelStreamWithToken(
        uint256 indexed streamId,
        address indexed sender,
        address indexed recipient,
        address tokenAddress,
        uint256 senderBalance,
        uint256 recipientBalance
    );

    error Errors(string error);

    modifier IsReceiverOrSender(uint256 _streamId) {
        if (
            msg.sender != StreamContainer[_streamId].recipient &&
            msg.sender != StreamContainer[_streamId].sender
        ) {
            revert Errors("The Caller Is not Receiver or Sender");
        }
        _;
    }

    modifier Exist(uint256 _streamId) {
        if (!StreamContainer[_streamId].Exist) {
            revert Errors("The stream dosnot exists");
        }
        _;
    }

    modifier initialSatisfy(
        uint256 _startTime,
        uint256 _deposit,
        address _tokenAddress,
        address _recipient,
        uint256 _endTime,
        uint256 deposit
    ) {
        if (_recipient == address(0)) {
            revert Errors("stream to the zero address");
        }
        if (_recipient == address(this)) {
            revert Errors("stream to the contract itself");
        }
        if (_recipient == msg.sender) {
            revert Errors("stream to the caller");
        }
        if (deposit < 1) {
            revert Errors("deposit is zero");
        }
        if (_startTime < block.timestamp) {
            revert Errors("StartTime less than current Time");
        }
        if (_endTime < _startTime) {
            revert Errors("stop time before the start time");
        }
        _;
    }


    function getStreamDetails(uint256 _streamId)
        external
        view
        returns (StreamDetails memory)
    {
        return StreamContainer[_streamId];
    }

    function balanceOf(uint256 StreamId, address who)
        public
        view
        Exist(StreamId)
        returns (uint256)
    {
        StreamDetails memory indv = StreamContainer[StreamId];
        uint256 time = block.timestamp - indv.startTime;

        if (block.timestamp > indv.endTime) {
            if (who == indv.recipient) {
                return indv.deposit - indv.balanceOut;
            } else {
                return 0;
            }
        }
        uint256 moneyUptoNow = (indv.deposit /
            (indv.endTime - indv.startTime)) * time;

        uint256 recepientBalance = moneyUptoNow - indv.balanceOut;
        if (who == indv.recipient) {
            return recepientBalance;
        }
        if (who == indv.sender) {
            return indv.deposit - moneyUptoNow;
        }
        return 0;
    }

    function setStreams(
        uint256 _startTime,
        uint256 _deposit,
        uint256 _endTime,
        uint256 _periodicity,
        address _tokenAddress,
        address payable _recipient,
        bool isEth
    )
        private
        initialSatisfy(
            _startTime,
            _deposit,
            _tokenAddress,
            _recipient,
            _endTime,
            _deposit
        )
    {
        StreamDetails storage indv = StreamContainer[streamId];
        indv.startTime = _startTime;
        indv.calculationTime = _startTime + _periodicity;
        indv.endTime = _endTime;
        indv.tokenAddress = _tokenAddress;
        indv.deposit = _deposit;
        indv.isEth = isEth;
        indv.recipient = _recipient;
        indv.sender = payable(msg.sender);
        indv.periodicity = _periodicity;
        indv.Exist = true;
        streamId++;
    }

    function CreateStreamForEth(
        uint256 _endTime,
        uint256 _startTime,
        address payable _recipient,
        uint256 _periodicity
    ) external payable {
        setStreams(
            _startTime,
            msg.value,
            _endTime,
            _periodicity,
            address(0),
            _recipient,
            true
        );
        emit CreatingStreamWithEth(
            _recipient,
            msg.sender,
            streamId - 1,
            msg.value,
            _startTime,
            _endTime
        );
    }

    function CreateStreamForToken(
        uint256 _endTime,
        uint256 _startTime,
        uint256 _deposit,
        address _tokenAddress,
        address payable _recipient,
        uint256 _periodicity
    ) external {
        if (_tokenAddress == address(0)) {
            revert Errors("Token Address is a zero address");
        }
        IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _deposit);
        setStreams(
            _startTime,
            _deposit,
            _endTime,
            _periodicity,
            _tokenAddress,
            _recipient,
            false
        );

        emit CreatingStreamWithToken(
            _recipient,
            msg.sender,
            streamId - 1,
            _tokenAddress,
            _deposit,
            _startTime,
            _endTime
        );
    }

    function withdrawFromStream(uint256 _streamId)
        external
        payable
        Exist(_streamId)
        IsReceiverOrSender(_streamId)
        nonReentrant
    {
        StreamDetails storage indv = StreamContainer[_streamId];
        if (block.timestamp < indv.calculationTime) {
            revert Errors("Not the time to take the money out");
        }
        uint256 recepientBalance = balanceOf(_streamId, indv.recipient);
        indv.balanceOut += recepientBalance;
        indv.calculationTime += indv.periodicity;
        if (indv.isEth) {
            indv.recipient.transfer(recepientBalance);
            emit WithdrawDepositOfStreamWithEth(
                indv.recipient,
                indv.sender,
                _streamId,
                recepientBalance,
                block.timestamp
            );
        } else {
            IERC20(indv.tokenAddress).transfer(
                indv.recipient,
                recepientBalance
            );

            emit WithdrawDepositOfStreamWithToken(
                indv.recipient,
                indv.sender,
                _streamId,
                indv.tokenAddress,
                recepientBalance,
                block.timestamp
            );
        }
        if (indv.balanceOut == indv.deposit) {
            indv.Exist = false;
        }
    }

    function CancelStream(uint256 _streamId)
        external
        nonReentrant
        Exist(_streamId)
        IsReceiverOrSender(_streamId)
    {
        StreamDetails memory indv = StreamContainer[_streamId];
        uint256 recepientBalance = balanceOf(_streamId, indv.recipient);
        uint256 senderBalance = balanceOf(_streamId, indv.sender);
        if (indv.isEth) {
            indv.recipient.transfer(recepientBalance);
            indv.sender.transfer(senderBalance);
            emit CancelStreamWithEth(
                _streamId,
                indv.sender,
                indv.recipient,
                senderBalance,
                recepientBalance
            );
        } else {
            IERC20(indv.tokenAddress).transfer(
                indv.recipient,
                recepientBalance
            );
            IERC20(indv.tokenAddress).transfer(indv.sender, senderBalance);
            emit CancelStreamWithToken(
                _streamId,
                indv.sender,
                indv.recipient,
                indv.tokenAddress,
                senderBalance,
                recepientBalance
            );
        }
        StreamContainer[_streamId].Exist = false;
    }
}
