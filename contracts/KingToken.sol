pragma solidity >=0.4.21 <0.6.0;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';
// import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol';
// import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';


contract KingToken is ERC20Mintable {
  using SafeMath for uint256;

  string public constant name = "KING";
  string public constant symbol = "KING";
  uint public constant decimals = 18;
  uint public constant INITIAL_SUPPLY = 1000 * (10 ** decimals);
  //mapping (address => uint256) private _balances;
  address public owner;
  uint public constant feeOfregister = 50;
  // 테스트 체크용 상태 변수
  uint public count = 0;

  //event Register(address _writer, uint256 _amount);
  event LogMessage2 (address msg_sender, address _signer, address _destination, uint _value, uint256 _nonce, bytes32 _hashed);
  event LogEtherBalances(uint msg_sender, uint _signer, uint _destination);
  event LogTokenBalances(uint msg_sender, uint _signer, uint _destination);

  // Airdrop
  mapping (address => uint256) public airDropHistory;
  event MintAirDrop(address _receiver, uint256 _amount);


  constructor() public {
    _mint(msg.sender, INITIAL_SUPPLY);      // ERC20 _totalSupply 값도 초기화 시켜줌
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "only Owner can use");
    _;
  }

  function mintAirDrop(address _to, uint256 _amount)  public onlyOwner returns (bool) {
    require(_to != address(0),"Don't use Null Address");
    require(_amount != 0, "Not to input 0 of amount");

    _mint(_to, _amount);
    airDropHistory[_to].add(_amount);

    emit MintAirDrop(_to,_amount);
 //   emit Transfer(address(0), _to, _amount);  // 첫번재 인자는 Null
    return true;
  }


//   //  게시글 등록시 호출하는 메소드, 게시글 등록시에 50 토큰이 차감됨
//   function registerArticle(address _from, uint _amount, address _allowedCaller)  public returns (bool) {
//     require(_from != address(0),"ERC20: using from the zero address");
//     require(balanceOf(_from) > feeOfregister, "Not enough token");
//     require(_allowedCaller == owner, "허용된 호출자가 아님");   // 시그니처로 검증해야 하나 간단하게 했습니다

//     emit LogMessage2(msg.sender, _from, _amount, _allowedCaller, owner);


//     //_balances[_to] = _balances[_to].sub(50);    // 50  토큰 차감 (KingToken)
//     _burn(_from, feeOfregister);
//     //_burn(_from, _amount);

//     emit Register(_from, feeOfregister);  // 첫번재 인자는 Null
//     return true;
//   }


//   function addAmount(uint256 amount) public returns (bool) {
//     count = count + amount;
//     return true;
//   }



    mapping(address => uint) public nonce;
    mapping(bytes32 => bool) private hashed;

    function signerVerify(bytes32 _hash, bytes memory _signature, address signer) internal pure returns (bool) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        if (_signature.length != 65) {
          return false;
        }

        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        if (v != 27 && v != 28) {
            return false;
        } else {
            return signer == ecrecover(keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash)
            ), v, r, s);
        }
    }

    function transferPreSignedHashing(address _from, address _to, uint256 _value, uint256 _nonce) public pure returns (bytes32)
    {
        /* "0x5c4b4c12": transferPreSignedHashing(address,address,uint256,uint256) */
        return keccak256(abi.encodePacked(bytes4(0x5c4b4c12), _from, _to, _value, _nonce));
    }
    function transferPreSigned( bytes memory sig, address signer, address destination, uint value, uint256 _nonce) public {
        bytes32 _hash = transferPreSignedHashing(signer, destination, value, _nonce);
        
        emit LogMessage2(msg.sender,signer,destination,value,_nonce, _hash);

        require(!hashed[_hash], "used meta tx");
        require(signerVerify(_hash,sig,signer),"SignerVerify is not allowed");
        nonce[signer]++;
        hashed[_hash] = true;
       
        emit LogEtherBalances(msg.sender.balance, signer.balance, destination.balance);
        _transfer(signer, destination, value);
        emit LogTokenBalances(balanceOf(msg.sender), balanceOf(signer),balanceOf(destination));
    }
}