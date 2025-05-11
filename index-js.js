import { createWalletClient, custom, createPublicClient, parseEther,defineChain } from "https://esm.sh/viem";
import { contractAddress, abi } from "./constants-js.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");

let walletClient;

async function connect() {
    try {
        if (window.ethereum !== undefined) {
            walletClient = createWalletClient({
                transport: custom(window.ethereum)
            });
            const addresses = await walletClient.requestAddresses();
            console.log("Connected addresses:", addresses);
            connectButton.innerHTML = "Connected!";
        } else {
            connectButton.innerHTML = "Please install MetaMask!";
        }
    } catch (error) {
        console.error("Connection error:", error);
        connectButton.innerHTML = "Connection failed. Please try again.";
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value;
    console.log(`Funding ${ethAmount} ETH...`);

    if (typeof window.ethereum !== "undefined") {

        walletClient = createWalletClient({
            transport: custom(window.ethereum)

        });

        const [connctedAccount] = await walletClient.requestAddresses();
        const currentChain = await getCurrentChain(walletClient);

        let publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })
        const {request} = await publicClient.simulateContract({
            address: contractAddress,
            abi: abi,
            functionName: "fund",
            account: connctedAccount,
            chain: currentChain,
            value: parseEther(ethAmount)
        })
        const hash = await walletClient.writeContract(request)
        console.log("Transaction hash:", hash)
        
    } else {
        fundButton.innerHTML = "Please install MetaMask!";
    }
}

async function getCurrentChain(client) {
    const chainId = await client.getChainId()
    const currentChain = defineChain({
      id: chainId,
      name: "Custom Chain",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: ["http://localhost:8545"],
        },
      },
    })
    return currentChain
  }

connectButton.onclick = connect;
fundButton.onclick = fund;