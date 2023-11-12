//Get projects contract
import { ethers } from 'ethers';
import { contractABI, contractAddress } from 'src/smart-contract/contract';
import { usePropertiesStore } from 'stores/properties-store';

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
export const getEthereumContract = async () => {
  // Connect current user as signer and get smart contract.
  if (!window.ethereum) return alert('Metamask is not installed.'); // Check if metamask installed.
  const provider = new ethers.BrowserProvider(window.ethereum); // Get provider
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer); // Return smart contract
};

export const getPropertyIds: () => Promise<string> = async () => {
  const contract = await getEthereumContract();
  try {
    return await contract.getProperties().then(async (properties: Array<string>) => {
      return properties ? properties : [];
    });
  } catch (e) {
    throw new Error(e);
  }
};
export const getProperty = async (id: string) => {
  const propertiesStore = usePropertiesStore();
  const contract = await getEthereumContract();
  await contract.getPropertyInfo(id).then(async (property: any) => {
    propertiesStore.addProperty(property);
  });
};
export const getRentRequests = async (id: string) => {
  const contract = await getEthereumContract();
  return await contract.getRentRequests(id).then(async (requests: Array<string>) => {
    return requests;
  });
};
export const rent = async (id: string, address: string, time: number) => {
  const contract = await getEthereumContract();
  return await contract.rentProperty(id, address, time);
};

export const sendRentRequest = async (propertyId: string) => {
  const contract = await getEthereumContract();
  await contract.rentRequest(propertyId).then((val: object) => {
    return val;
  });
};