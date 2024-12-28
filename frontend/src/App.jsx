import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

import contractABI from "../contractABI.json"; // Kontrat ABI dosyasını import et

const contractAddress = "0xb061ba9f3bb9a941336d62c0d5e472237840fa1f"; // Kontrat adresini buraya ekle

function App() {
  const [count, setCount] = useState(0); // Sayaç state
  const [account, setAccount] = useState(null); // Kullanıcı cüzdanı

  // Metamask cüzdanını bağla
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Metamask gerekli!");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    console.log("Bağlı cüzdan:", accounts[0]);
  };

  // Kontrat fonksiyonunu çağır
  const getCount = async () => {
    if (!window.ethereum) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    try {
      const currentCount = await contract.retrieve(); // Kontrat getCount fonksiyonu
      setCount(currentCount.toNumber()); // Sayaç değerini güncelle
    } catch (error) {
      console.error("Count alınamadı:", error);
    }
  };

  // Count'u artır
  const increment = async () => {
    if (!window.ethereum) return;
    console.log(window.ethereum);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const tx = await contract.increment();
      console.log(tx); // Kontrat increment fonksiyonu
      await tx.wait(); // İşlemin blockchain'e yazılmasını bekle
      getCount(); // Sayaç değerini güncelle
    } catch (error) {
      console.error("Increment başarısız:", error);
    }
  };

  useEffect(() => {
    if (account) {
      getCount(); // Cüzdan bağlıysa sayacı al
    }
  }, [account]);

  return (
    <div className="App">
      <h1>Counter DApp</h1>
      {!account ? (
        <button onClick={connectWallet}>Cüzdanı Bağla</button>
      ) : (
        <p>Bağlı Hesap: {account}</p>
      )}
      <p>Sayaç: {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
}

export default App;
