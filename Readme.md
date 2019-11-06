
# Meta TX (Delegate TX) 작동버전                <br>

## 차이점 : ERC865  transferPreSigned()  사용       <br>

## Out of Gas 문제 해결방식     <br>
### gas 를 충분히 지급         <br>
예제) 
await (new web3.eth.Contract(abiKingTokenMy, addressKingTokenMy)).methods.transferPreSigned(sig, signer, to, amount, nonce).send({from: accounts[0], gas: 6000000})   <br>

## 테스트 결과화면
![transferPreSigned() 결과화면](https://user-images.githubusercontent.com/24896007/68275763-e1746580-00af-11ea-9a42-a639f00b8933.png)


## Ropsten 배포 내역        배포일자: 2019.11.6::17:38
Deploying 'KingToken'                                                                                   <br>
   ---------------------                                                                                <br>
   > transaction hash:    0x97899e4f92564a23e2f4ea6d4bb19f997102bc50daa4dc39c84a141b5ca5499c            <br>
   > Blocks: 0            Seconds: 13                                                                   <br>
   > contract address:    0x0ccA099F98a43Ce74ff236246bABefeabaEaFbDC                                    <br>
   > block number:        6719874                                                                       <br>
   > block timestamp:     1573029251                                                                    <br>
   > account:             0x83438A43F40b7f442a55a4C63EC20549ba4AD6ae                                    <br>
   > balance:             3.654499649531999967                                                          <br>
   > gas used:            2166814                                                                       <br>
   > gas price:           20 gwei                                                                       <br>
   > value sent:          0 ETH                                                                         <br>
   > total cost:          0.04333628 ETH                                                                <br>