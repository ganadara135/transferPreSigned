
# Meta TX (Delegate TX) 작동버전                <br>

## 차이점 : ERC865  transferPreSigned()  사용       <br>

## Out of Gas 문제 해결방식     <br>
### gas 를 충분히 지급         <br>
예제) 
await (new web3.eth.Contract(abiKingTokenMy, addressKingTokenMy)).methods.transferPreSigned(sig, signer, to, amount, nonce).send({from: accounts[0], gas: 6000000})   <br>

