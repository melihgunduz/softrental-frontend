import { ethers } from 'ethers';
import { contractABI, contractAddress } from 'src/smart-contract/contract';
import { useWalletStore } from 'stores/wallet-store';

// Check if user connected his wallet
export const checkWalletIsConnected = async () => {
  const walletStore = useWalletStore();
  window.ethereum.request({ method: 'eth_accounts' }).then(async (val: Array<string>) => {
    if (val.length !== 0) {
      walletStore.setUser(ethers.getAddress(val[0]), true);
    }
  });
  return walletStore.User.connected;
};

export const checkNetwork = async () => {
  const testnetChainId = '0x' + (97).toString(16);
  window.ethereum.request({ method: 'eth_chainId' }).then(async (val: string) => {
    if (val !== testnetChainId) {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: testnetChainId,
          },
        ],
      });
    }
  });
};

// Send request to metamask and connect wallet
export const connectWallet = async () => {
  await checkNetwork();
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
