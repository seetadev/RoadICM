# NFT marketplace on Near blockchain for NFC tags of Monitoring Devices

#### To run this app locally, follow below steps:

##### Clone using command line interface:
```
git clone repo
```

##### Create wallet testnet account
open [wallet testnet account](wallet.testnet.near.org/)


##### From the `market_contract` folder/directory using command CLI, login to near wallet account


`near login`


##### Build the contract
From `market_contract` directory using CLI:

For Windows users:

```
/build.bat
```

For Mac and Linux users:

```
/build.sh
```

##### Create a  Market subaccount

To create subaccount from `market_contract` directory via CLI use command:

```
near create-account  market_contract.youraccountname.testnet --masterAccount youraccountname.testnet


```

##### Deploy the contract
```
near deploy market_contract.youraccountname.testnet --wasmFile res/market_contract.wasm

```





##### Edit contract name

Change the `youraccountname` part of the `MARKET_CONTRACT_NAME` constant in `config.js` file to your own account name.


### Initialize Your contract

 To initialize our market contract from CLI:

```
near call market_contract.youraccountname.testnet new '{"owner_id": "nft-contract.youraccountname.testnet"}' --accountId youraccountname.testnet

```

##### Install packages for frontend

Go to root directory `nft-marketplac-part-1` using CLI and install packages:

```
cd ..
npm install

```

##### Launch frontend

```
npm start

```



