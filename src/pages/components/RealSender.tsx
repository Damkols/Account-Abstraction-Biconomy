import React, { useState, useEffect } from "react";
import { BiconomySmartAccountV2 } from "@biconomy/account";
import abi from "../../utils/counterAbi.json";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
 provider: any;
}

const TotalCountDisplay: React.FC<{ addr: string }> = ({ addr }) => {
 return <div>Last Caller is {addr}</div>;
};

const RealSender: React.FC<Props> = ({ provider }) => {
 const [addr, setAddr] = useState<string>("");
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
  const currentAddr = await contract.getActualSender();
  setAddr(String(currentAddr));
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
   <TotalCountDisplay addr={addr} />
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

export default RealSender;
