import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import getConfig from './config.js';
import * as nearAPI from 'near-api-js'
import 'regenerator-runtime'

async function initContract() {
  const nearConfig = getConfig(process.env.NEAR_ENV || 'testnet');
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore()
  const near =  await nearAPI.connect({keyStore, ...nearConfig})
  const walletConnection = new nearAPI.WalletConnection(near)
  

  let currentUser;

  if (walletConnection.getAccountId()) {
      currentUser = walletConnection.getAccountId()
  }

  return { currentUser, nearConfig, walletConnection}
}


initContract().then(({ currentUser, nearConfig, walletConnection})=> {
  ReactDOM.render(<App currentUser={currentUser} nearConfig={nearConfig} walletConnection={walletConnection}/>,
       document.getElementById('root'));
})
