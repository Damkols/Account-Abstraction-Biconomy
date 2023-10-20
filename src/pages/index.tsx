import Head from "next/head";
// import { ParticleAuthModule, ParticleProvider } from "@biconomy/particle-auth";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import { IBundler, Bundler } from "@biconomy/bundler";
import {
 BiconomySmartAccountV2,
 DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import {
 ECDSAOwnershipValidationModule,
 DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";
import { ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import Counter from "./components/Counter";
import Counter2 from "./components/Counter";
import Decrement from "./components/Decrement";
import Count from "./components/Count";

export default function Home() {
 const [address, setAddress] = useState<string>("");
 const [loading, setLoading] = useState<boolean>(false);
 const [smartAccount, setSmartAccount] =
  useState<BiconomySmartAccountV2 | null>(null);
 const [provider, setProvider] = useState<ethers.providers.Provider | null>(
  null
 );

 const bundler: IBundler = new Bundler({
  bundlerUrl:
   "https://bundler.biconomy.io/api/v2/5/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  chainId: ChainId.GOERLI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
 });

 const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl:
   "https://paymaster.biconomy.io/api/v1/5/k2NdQhapM.8812ad4d-c71e-4e7a-9406-c97b0160f8b4",
 });

 const connect = async () => {
  try {
   setLoading(true);
   // const userInfo = await particle.auth.login();
   // console.log("Logged in user:", userInfo);
   // const particleProvider = new ParticleProvider(particle.auth);
   const web3Provider = new ethers.providers.Web3Provider(
    window.ethereum,
    "goerli"
   );
   setProvider(web3Provider);
   console.log(provider);

   const module = await ECDSAOwnershipValidationModule.create({
    signer: web3Provider.getSigner(),
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
   });

   let biconomySmartAccount = await BiconomySmartAccountV2.create({
    chainId: ChainId.GOERLI,
    bundler: bundler,
    paymaster: paymaster,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    defaultValidationModule: module,
    activeValidationModule: module,
   });
   setAddress(await biconomySmartAccount.getAccountAddress());
   setSmartAccount(biconomySmartAccount);
   setLoading(false);
  } catch (error) {
   console.error(error);
  }
 };

 return (
  <>
   <Head>
    <title>Based Account Abstraction</title>
    <meta name="description" content="Based Account Abstraction" />
   </Head>
   <main className={styles.main}>
    <h1>Based Account Abstraction</h1>
    <h2>Connect to Access Counter</h2>
    {!loading && !address && (
     <button onClick={connect} className={styles.connect}>
      Connect to Based Web3
     </button>
    )}
    {loading && <p>Loading Smart Account...</p>}
    {address && <h2>Smart Account: {address}</h2>}

    {loading && <p>Loading Smart Account...</p>}
    {smartAccount && provider && (
     <div>
      <Count provider={provider} />
      <Counter2
       smartAccount={smartAccount}
       address={address}
       provider={provider}
      />
      <Decrement
       smartAccount={smartAccount}
       address={address}
       provider={provider}
      />
     </div>
    )}
   </main>
  </>
 );
}
