import { ethers } from 'ethers';
import { contractABI, contractAddress } from 'src/smart-contract/contract';
import { useWalletStore } from 'stores/wallet-store';

//Get projects contract
export const getEthereumContract = async () => {
  // Connect current user as signer and get smart contract.
  if (!window.ethereum) return alert('Metamask is not installed.'); // Check if metamask installed.
  const provider = new ethers.BrowserProvider(window.ethereum); // Get provider
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer); // Return smart contract
};

// Check if user connected his wallet
export const checkWalletIsConnected = async () => {
  const walletStore = useWalletStore();
  return walletStore.User.connected;
};

// Send request to metamask and connect wallet
export const connectWallet = async () => {
  const walletStore = useWalletStore();
  const isConnected = await checkWalletIsConnected();
  if (!window.ethereum) return alert('Metamask is not installed.'); // check is metamask installed
  if (!isConnected) {
    await window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(async (val: Array<string>) => {
        if (val.length !== 0) {
          const userAddress = ethers.getAddress(val[0]);
          walletStore.setUser(userAddress, true);
        } else {
          walletStore.setUser();
        }
      })
      .catch((e) => {
        return e.code;
      });
  }
};
