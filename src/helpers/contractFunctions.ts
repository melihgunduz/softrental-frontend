//Get projects contract
import { ethers } from 'ethers';
import { contractABI, contractAddress } from 'src/smart-contract/contract';

export const getEthereumContract = async () => {
  // Connect current user as signer and get smart contract.
  if (!window.ethereum) return alert('Metamask is not installed.'); // Check if metamask installed.
  const provider = new ethers.BrowserProvider(window.ethereum); // Get provider
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer); // Return smart contract
};

export const getProperties = async () => {
  const contract = await getEthereumContract();
  try {
    await contract.getProperties().then(async (tx: any) => {
      console.log(await tx);
    });
  } catch (e) {
    throw new Error(e);
  }
};
export const createProperty = async (name: string, sort: string, adres: string, price: number) => {
  const contract = await getEthereumContract();
  try {
    await contract.createProperty(name, sort, adres, price).then(async (tx: any) => {
      console.log(await tx);
    });
  } catch (e) {
    throw new Error(e);
  }
};
