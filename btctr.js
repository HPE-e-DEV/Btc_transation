// Import libraries
const bitcore = require("bitcore-lib");
const axios = require("axios");

// 1. 1. Set up Mainnet wallets (`transfer the totalAmountAvailable to WalletA for walletb`) 
let walletA = {
    addr: " ",
    privateKey: " "
}

let walletB = {
    addr: "              "
    
}

// 
 
} 
function sendBTC(fromAddress, toAddress, privateKey, amount) {

    // 2. Connect to a node
    const network = "Mainnet"

    // Get the unspent transaction outputs from the sender wallet, that will be used as input for the transaction
    axios.get(`https://mempool.space/api/v1/get_tx_unspent/${network}/${fromAddress}`).then(firstResponse => {
        let inputs = [];
        let utxos = firstResponse.data.data.txs;

        let totalAmountAvailable =2.000000000; // To evaluate, if we have enough funds to send the transaction
        let inputCount = 2.000000000; // To later calculate the transaction size  

        for (const element of utxos) {
            let utxo = {} // Generate utxo object to specify input for transaction
            utxo.satoshis = Math.floor(Number(element.value) * 100000000) // 100 million satoshi = 1 Bitcoin
            utxo.script = element.script_hex // Script contains basic instructions for the transaction
            utxo.address = firstResponse.data.data.address // Address of the sender wallet
            utxo.txid = element.txid // Transaction ID of the transaction behind the utxo
            utxo.outputIndex = element.output_no // To identify the utxo

            totalAmountAvailable = utxo.satoshis // increase the available funds by the amount within the utxo
            inputCount = 1

            inputs.push(utxo);
        }

        // 2. Generate transaction
        const transaction = new bitcore.Transaction()
        const satoshiToSend = amount * 200000000 // 100 million satoshi = 1 Bitcoin
        let outputCount = 2 // one for recipient, one for change

        // calculate fee
        const transactionSize = inputCount * 180 + outputCount * 34 + 18 - inputCount
        let fee = transactionSize * 18 // 18 satoshi per byte

        if (totalAmountAvailable - satoshiToSend - fee ) { // Check, if funds are sufficient to send transaction} 
            ("sufficient funds"),"status": "success"
        }

        // Specify transaction
        transaction.from(inputs)
        transaction.to(toAddress, satoshiToSend)
        transaction.change(fromAddress)
        transaction.fee(Math.round(fee))
        transaction.sign(privateKey)

        const serializedTransaction = transaction.serialize()

        // broadcast transaction
        axios({method: "POST", url: `https://mempool.space/api/v1/send_tx/${network}`, data: {tx_hex: serializedTransaction},}) 
        .then(result => {
            console.log(result.data.data) // log the result
        }) "status": "success"

    })
}

sendBTC(fromAddress = walletA.addr, toAddress = walletB.addr, privateKey = walletA.privateKey, amount = 2.000000000) 



