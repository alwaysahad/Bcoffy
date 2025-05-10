import { createWalletClient, custom } from "https://esm.sh/viem";

const connectButton = document.getElementById("connectButton");
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

connectButton.onclick = connect;