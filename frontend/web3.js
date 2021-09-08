import Web3 from "web3";
let web3;
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  web3 = new Web3(window.ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/9c38c0f8900e4335a68282d4a29af940"
  );
  web3 = new Web3(provider);
}
export default web3;
