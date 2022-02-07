import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import myNFT from "./contracts/MyEpicNFT.json";


const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");

  const askContractToMintNFT = async () => {
    const CONTRACT_ADDRESS = '0xf4e7e1770e1b51E462e8830D44EF3314C323fC60';

    try{
      const {ethereum} = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNFT.abi, signer);

        console.log("going to pop wllet now to pay gas ....");
        let nftTxn = await connectedContract.makeNFT();

        console.log("please wait mining on rinkebyS");
        await nftTxn.wait();

        console.log(`Mined, see nft on opensea or etherscan :::: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`)
        });

      }else{
        console.log("ethereum object doesnt exist");
      }
    }catch(error){
      console.log(error);
    }
  }

  const checkWallet = async () => {
    
    const {ethereum} = window;

    if(!ethereum){
      console.log("you need a metamask for this website ");
    }
    console.log("elam");
    const accounts = await ethereum.request({method: 'eth_accounts'});


    if(accounts.length !== 0){
      const account = accounts[0];
      console.log("Found an authorized account : ", account);
      setCurrentAccount(account);
    }else{
      console.error("account not found");
    }

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
    }
  }

  const connectWallet = async () => {
    try{
      const {ethereum} = window;
   
      if(!ethereum){
        alert('first install metamask')
        return;
      }

      const accounts = await ethereum.request({method: 'eth_requestAccounts'});

      console.log("connected", accounts[0]);

      setCurrentAccount(accounts[0])
    }catch(error){
      console.warn(error);
    }
  }

  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkWallet();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? (
              renderNotConnectedContainer()
            ) : (
              <>
                <h3 style={{color:'white', margin: '5rem'}}>Your Account is <br /><br /> {currentAccount}</h3>
                <button onClick={askContractToMintNFT} className='cta-button connect-wallet-button'>
                  Mint Nft
                </button>
              </>
            )
          }
        </div>
        <div>
          <a className='footer-text' href='https://testnets.opensea.io/collection/the-imps-pxprjaufrf'>
            Go Collection On Opensea
          </a>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            target="_blank"
            href='y'
            rel="noreferrer"
          >Twitter</a>
        </div>
      </div>
    </div>
  );
};

export default App;
