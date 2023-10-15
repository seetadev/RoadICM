import React, { createContext, useCallback, useEffect, useState } from "react";
import { Xumm } from "xumm";
import { sleep } from "../utils";

export const LedgerContext = createContext({
  xummInstance: null,
  account: null,
  chainId: null,
  connected: false,
  connect: () => {},
  disconnect: () => {},
  getData: () => {},
});

const LedgerProvider = ({ children }) => {
  const [xummInstance, setXummInstance] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [connected, setConnected] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const connect = async () => {
    console.log("Logged in: ", xummInstance);
    setInitialized(true);
    await xummInstance.authorize();
    setConnected(true);
    await xummInstance.user.account.then((a) => {
      setAccount(a ?? "");
      console.log(xummInstance);
      setXummInstance(xummInstance);
    });
    // getData();
    return xummInstance;
  };

  const disconnect = async () => {
    xummInstance.logout();
    setAccount(null);
    setChainId(null);
    setConnected(false);
  };

  const getData = async () => {
    let payloadRes;

    let payload = await xummInstance.payload?.createAndSubscribe(
      {
        Account: account,
        TransactionType: "SignIn",
      },
      async (event) => {
        // Return if signed or not signed (rejected)
        console.log(JSON.stringify(event.data, null, 2));
        // Only return (websocket will live till non void)
        if (Object.keys(event.data).indexOf("signed") > -1) {
          const { payload_uuidv4 } = await xummInstance.environment.jwt;
          const payloadResult = await xummInstance.payload?.get(payload_uuidv4);
          console.log(payloadResult);
          payloadRes = payloadResult.response.hex;
          return true;
        }
      }
    );

    console.log(`payload: `, payload);
    console.log(await xummInstance.payload?.get(payload.created));
    window.open(payload.created.next.no_push_msg_received);

    // xummInstance.on("success", async () => {
    //   // console.log(await xummInstance.payload?.get(payload.created));
    //   const { payload_uuidv4 } = await xummInstance.environment.jwt;
    //   const payloadResult = await xummInstance.payload?.get(payload_uuidv4);
    //   console.log(payloadResult);
    // });

    for (;;) {
      console.log("Waiting for user to sign tx");
      if (payloadRes) {
        console.log(payloadRes);
        return payloadRes;
      } else {
        await sleep(1000);
      }
    }
  };

  useEffect(() => {
    (async () => {
      const xumm = new Xumm("5dd3d912-ed57-4477-8a2d-db6fb7e3d241");
      await xumm.on("ready", async () => {
        // console.log(xummInstance);
        await setXummInstance(xumm);
        console.log("Ready (e.g. hide loading state of page)");
      });
    })();
  }, []);

  useEffect(() => {
    console.log("initialized ", initialized);
    if (!initialized && xummInstance) {
      (async () => {
        console.log(xummInstance);
        const connectedAcc = xummInstance.user.account.then((a) => {
          // console.log("a ", a);
          if (a.length != 0 && !initialized) {
            setInitialized(true);
            console.log("connecting");
            connect();
          }
          return a;
        });
      })();
    }
  }, [xummInstance]);

  return (
    <LedgerContext.Provider
      value={{
        xummInstance,
        account,
        chainId,
        connected,
        connect,
        disconnect,
        getData,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
};

export default LedgerProvider;
