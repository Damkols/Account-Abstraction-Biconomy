import React, { useState, useEffect } from "react";
import { BiconomySmartAccountV2 } from "@biconomy/account";
import abi from "../../utils/counterAbi.json";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
 provider: any;
}

const TotalCountDisplay: React.FC<{ count: number }> = ({ count }) => {
 return <div>Total count is {count}</div>;
};

const Count: React.FC<Props> = ({ provider }) => {
 const [count, setCount] = useState<number>(0);
 const [counterContract, setCounterContract] = useState<any>(null);
 const [isLoading, setIsLoading] = useState<boolean>(false);

 const counterAddress = "0x9Fa09F2968DAE1502dE61dd6cF1e4cD95853A945";

 useEffect(() => {
  setIsLoading(true);
  getCount(false);
 }, []);

 const getCount = async (isUpdating: boolean) => {
  const contract = new ethers.Contract(counterAddress, abi, provider);
  setCounterContract(contract);
  const currentCount = await contract.count();
  setCount(Number(currentCount));
  contract.on("UpdateCount", (newCount, event) => {
   // UpdateCount(uint newCount)
   let countEvent = {
    value: newCount,
    eventData: event,
   };
   console.log(countEvent.value);
   console.log(Number(countEvent.value));
   setCount(Number(countEvent.value));
  });
  if (isUpdating) {
   toast.success("Count has been updated!", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
   });
  }
 };

 return (
  <>
   <TotalCountDisplay count={count} />
   <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={true}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
   />
   <br></br>
  </>
 );
};

export default Count;
