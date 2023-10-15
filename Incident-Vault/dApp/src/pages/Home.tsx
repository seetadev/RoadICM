import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserPlusIcon, CreditCard } from "@heroicons/react/24/solid";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Routes,
} from "react-router-dom";
import { LedgerContext } from "../contexts/LedgerProvider";
import Article from "../components/Article";
import LoadingAnimation from "../components/LoadingAnimation";
import { truncateStr } from "../utils";

function Home() {
  const [userAddress, setUserAddress] = useState(
    "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
  );
  const [payloadUuid, setPayloadUuid] = useState("");
  const [lastPayloadUpdate, setLastPayloadUpdate] = useState("");
  const [openPayloadUrl, setOpenPayloadUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayedVaults, setDisplayedVaults] = useState([]);
  const { xummInstance, account, chainId, connected, connect, disconnect } =
    useContext(LedgerContext);

  const createPayload = async () => {
    // const payload = await xumm.payload?.createAndSubscribe(
    //   {
    //     TransactionType: "Payment",
    //     Destination: "rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ",
    //     Account: account,
    //     Amount: String(1337),
    //   },
    //   (event) => {
    //     // Return if signed or not signed (rejected)
    //     setLastPayloadUpdate(JSON.stringify(event.data, null, 2));
    //     // Only return (websocket will live till non void)
    //     if (Object.keys(event.data).indexOf("signed") > -1) {
    //       return true;
    //     }
    //   }
    // );
    // if (payload) {
    //   setPayloadUuid(payload.created.uuid);
    //   if (xumm.runtime.xapp) {
    //     xumm.xapp?.openSignRequest(payload.created);
    //   } else {
    //     if (
    //       payload.created.pushed &&
    //       payload.created.next?.no_push_msg_received
    //     ) {
    //       setOpenPayloadUrl(payload.created.next.no_push_msg_received);
    //     } else {
    //       window.open(payload.created.next.always);
    //     }
    //   }
    // }
    // return payload;
  };

  async function signInWithXumm() {
    const res = await connect();
    // console.log(res);
    // console.log(xummInstance);
    // console.log(account);
  }

  async function checkForVaults() {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/displayVaults`);
      let responseToJson = await response.json();

      if (response.status == 200) {
        console.log(responseToJson.result);
        if (responseToJson.result != false)
          setDisplayedVaults(responseToJson.result);
      }
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    (async () => {
      // console.log(xummInstance);
      // console.log(account);
      checkForVaults();
    })();
  }, []);

  const ListItem = ({ title, subtitle, whitelist, requiresNft }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [showWl, setShowWl] = useState(false);
    const [showNft, setShowNft] = useState(false);
    return (
      <div className="w-64 h-64 flex flex-col justify-center items-center p-4 rounded-lg shadow-lg bg-gray-800 hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
        <h3 className="text-lg font-bold overflow-hidden w-52">{title}</h3>
        <img
          src={
            "https://media.discordapp.net/attachments/666210030046937088/1090013919235539014/cat_paypal.PNG?width=106&height=103"
          }
          alt="Vault Image"
          className="w-42 h-42 my-4"
        />

        <div className="flex gap-x-2">
          {whitelist ? (
            <div
              onMouseEnter={() => setShowWl(true)}
              onMouseLeave={() => setShowWl(false)}
              className="text-sm text-gray-500 mb-1"
              style={{ position: "relative", display: "inline-block " }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-green-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
                />
              </svg>
              {showWl && (
                <div
                  className="z-50 w-fit"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#2a2a2a",
                    color: "#fff",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  <p className=" w-fit">Whitelist</p>
                </div>
              )}
            </div>
          ) : (
            ""
          )}
          {requiresNft ? (
            <div
              onMouseEnter={() => setShowNft(true)}
              onMouseLeave={() => setShowNft(false)}
              className="text-sm text-gray-500 mb-1"
              style={{ position: "relative", display: "inline-block " }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-green-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
              {showNft && (
                <div
                  className="z-50 w-fit"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#2a2a2a",
                    color: "#fff",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  <p className="w-fit">NFT holders</p>
                </div>
              )}
            </div>
          ) : (
            ""
          )}
          <div
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-sm text-gray-500 mb-1"
            style={{ position: "relative", display: "inline-block " }}
          >
            {truncateStr(subtitle)}
            {showTooltip && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#2a2a2a",
                  color: "#fff",
                  padding: "5px",
                  borderRadius: "5px",
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  function VaultContainer() {
    return (
      <>
        {!isLoading && displayedVaults.length != 0 ? (
          <div className="p-4 text-gray-300">
            <h1 className="text-2xl font-bold mb-4 center text-center">
              Available vaults
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
              {displayedVaults.map((item) => (
                <Link className={`cursor-pointer`} to={`/invault/${item.id}`}>
                  <ListItem
                    key={item.id}
                    title={item.name}
                    subtitle={item.owner}
                    whitelist={item.whitelist}
                    requiresNft={item.requiresNft}
                  />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <LoadingAnimation />
        )}
      </>
    );
  }

  return (
    <>
      <div className="min-w-screen bg-gray-900">
        <div className="flex flex-col items-center p-5">
          <p className="text-6xl font-bold my-64 text-gray-300">
            Your token-gated experience begins here
          </p>
          {!account ? (
            <button
              className="text-green-300 border border-green-300 rounded-xl px-5 py-2"
              onClick={signInWithXumm}
            >
              XUMM login
            </button>
          ) : (
            <VaultContainer />
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
