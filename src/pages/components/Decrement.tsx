import { useState } from "react";
import { ethers } from "ethers";
import abi from "../../utils/counterAbi.json";
import {
 IHybridPaymaster,
 SponsorUserOperationDto,
 PaymasterMode,
} from "@biconomy/paymaster";
import { BiconomySmartAccount } from "@biconomy/account";
import { toast, ToastContainer } from "react-toastify";
import styles from "@/styles/Home.module.css";
import "react-toastify/dist/ReactToastify.css";

const counterAddress = "0x9Fa09F2968DAE1502dE61dd6cF1e4cD95853A945";

interface Props {
 smartAccount: BiconomySmartAccount | any;
 address: string;
 provider: ethers.providers.Provider;
}

const Decrement: React.FC<Props> = ({ smartAccount, address, provider }) => {
 //  const [minted, setMinted] = useState(false);
 const [count, setCount] = useState<number>(0);

 const handleDecrement = async () => {
  const contract = new ethers.Contract(counterAddress, abi, provider);
  console.log(provider);

  try {
   toast.info("Processing count on the blockchain!", {
    position: "top-right",
    autoClose: 15000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
   });
   const countTx = await contract.populateTransaction.decrementCount();
   console.log(Number(countTx.data));
   const tx1 = {
    to: counterAddress,
    data: countTx.data,
   };
   console.log(tx1);
   console.log("here before userop");
   let userOp = await smartAccount.buildUserOp([tx1]);
   console.log({ userOp });
   const biconomyPaymaster =
    smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
   let paymasterServiceData: SponsorUserOperationDto = {
    mode: PaymasterMode.SPONSORED,
    smartAccountInfo: {
     name: "BICONOMY",
     version: "2.0.0",
    },
   };
   const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
    userOp,
    paymasterServiceData
   );

   userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
   const userOpResponse = await smartAccount.sendUserOp(userOp);
   console.log("userOpHash", userOpResponse);
   const { receipt } = await userOpResponse.wait(1);
   console.log("txHash", receipt.transactionHash);
   console.log(receipt);
   //    setCount(true);
   toast.success(
    `Success! Here is your transaction:${receipt.transactionHash} `,
    {
     position: "top-right",
     autoClose: 18000,
     hideProgressBar: false,
     closeOnClick: true,
     pauseOnHover: true,
     draggable: true,
     progress: undefined,
     theme: "dark",
    }
   );
  } catch (err: any) {
   console.error(err);
   console.log(err);
  }
 };
 return (
  <>
   {address && (
    <button onClick={handleDecrement} className={styles.connect}>
     Decrement Count
    </button>
   )}
   <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
   />
  </>
 );
};

export default Decrement;
