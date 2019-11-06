const Web3 = require('web3');
// const BN = require('bn.js')
//const BigNumber = Web3.BigNumber;

const KingToken = artifacts.require("KingToken");
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))
const EthUtil = require('ethereumjs-util')

//const Example = artifacts.require("Example.sol");
const BigNumber = web3.BigNumber
const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should()

contract("KingToken", async (accounts) => {

    describe('#KingToken 작동여부 체크', function() {       // 처음에 호출해 줘야 contructor() 작동함
        it("이름호출 ", () => {
            KingToken.deployed()
            .then(instance => instance.name())
            .then(name => {
                //console.log("name : ", name)
                assert.equal(name,"KING","name is not Correct");
            })
            .catch( e => {
                console.log(e);
            });
        });
    });

    const handlerOfKingTokenMy = await KingToken.deployed();
    let abiKingTokenMy = handlerOfKingTokenMy.abi;
    let addressKingTokenMy = handlerOfKingTokenMy.address;
    const kingTokenInstance = new web3.eth.Contract(abiKingTokenMy, addressKingTokenMy);


    // KingToken 에어드랍
    describe('#KingToken 에어드랍 체크', async function() {
        it("accounts[3]에 에어드랍", async () => {
            await kingTokenInstance.methods.mintAirDrop(accounts[3], 1000).send({from: accounts[0]})
            .on('transactionHash', function(hash) {
                //console.log(receipt);
                //hash.should.be.equal()
                assert.equal(hash.length,'0xe1a69685ae0c4babaceba3c77ca8b9bf0ec70c5cb53a3d8c99b13edc00abfde9'.length,"32바이트 길이가 아님")
            }).on('error', console.error);    
        });

        it("accounts[3] 토큰 잔액 확인", async () => {
            await kingTokenInstance.methods.balanceOf(accounts[3]).call({from: accounts[0]})
            .then( function(result){
                //  console.log("잔액할당결과 : ", result)
                result.should.be.equal('1000', "할당 잔액이 같지 않음")
            }).catch( e => console.log(e));
        })
    });

    describe('#meta TX', async function() {
        it("meta TX test", async function() {
    
        const amount = 50
        const signer = accounts[3]
        const to = accounts[1]

        const nonce = 1;// await handlerOfKingTokenMy.nonce.call(accounts[3]) //call({from: accounts[3]})

        let transferPreSignedHashing = await
        (new web3.eth.Contract(abiKingTokenMy, addressKingTokenMy))
        .methods.transferPreSignedHashing(signer, to, amount, nonce).call()

        console.log("signer : ", signer)
        console.log("to : ", to)
        console.log("amount : ", amount)
        console.log("nonce : ", nonce)

        console.log("hashed : ", transferPreSignedHashing);

        // const sig = web3.eth.accounts.sign
        // (transferPreSignedHashing, '0x8608a57e32bd54844c261bd565523a032568c0f5de378d44e4b61bda4a0b9025'); // accounts[3])
    
        let sig = await web3.eth.sign(transferPreSignedHashing, signer)

        console.log('sig : ', sig)

        // meta-tx part test
        await (new web3.eth.Contract(abiKingTokenMy, addressKingTokenMy)).methods.transferPreSigned(sig, signer, to, amount, nonce).send({from: accounts[0], gas: 6000000})
    
        //printTxResult(result);
        await handlerOfKingTokenMy.contract.getPastEvents('LogMessage2',{  }, (err, event) => {
            console.log('err : ', err)
            console.log('event : ', event)
        })

        await handlerOfKingTokenMy.contract.getPastEvents('LogEtherBalances',{  }, (err, event) => {
            console.log('err : ', err)
            console.log('event : ', event)
        })

        await handlerOfKingTokenMy.contract.getPastEvents('LogTokenBalances',{  }, (err, event) => {
            console.log('err : ', err)
            console.log('event : ', event)
        })


        /*
        // signer part test
        const nonce = 1; //await handlerOfKingTokenMy.nonce.call(accounts[3]) //call({from: accounts[3]})
       // let transferPreSignedHashing = 
        (new web3.eth.Contract(abiKingTokenMy, addressKingTokenMy))
        .methods.transferPreSignedHashing(accounts[3], accounts[1], amount, nonce).call()
        .then(async transferPreSignedHashing =>  {
            
            const sig = web3.eth.accounts.sign
        (transferPreSignedHashing, '0x8608a57e32bd54844c261bd565523a032568c0f5de378d44e4b61bda4a0b9025'); // accounts[3])
       // console.log('sig : ', sig)
    
        // meta-tx part test
        (new web3.eth.Contract(abiKingTokenMy, addressKingTokenMy)).methods.transferPreSigned(sig.signature, signer, to, amount, nonce).send({from: accounts[3]})

        }).catch(console.error)
        //const sig = await web3.eth.sign(transferPreSignedHashing, '0x8608a57e32bd54844c261bd565523a032568c0f5de378d44e4b61bda4a0b9025'); // accounts[3])
       // console.log(" @@ : ", transferPreSignedHashing)
        
     //   printTxResult(result)
     */
    
        })
    })

    const tab = "\t\t";
    function printTxResult(result){
        if(!result||!result.receipt){
          console.log("ERROR".red,"MISSING TX HASH".yellow)
        }else{
          console.log(tab, result.receipt.transactionHash.green, (" "+result.receipt.gasUsed).yellow)
        }
    }
})