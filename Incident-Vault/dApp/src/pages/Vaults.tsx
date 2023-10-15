import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { useParams, Link } from "react-router-dom";
import { LedgerContext } from "../contexts/LedgerProvider";
import Article from "../components/Article";
import LoadingAnimation from "../components/LoadingAnimation";

function Vaults() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [article, setArticle] = useState("");
  const {
    xummInstance,
    account,
    chainId,
    connected,
    connect,
    disconnect,
    getData,
  } = useContext(LedgerContext);

  let params = useParams();

  async function signInWithXumm() {
    const res = await connect();
  }

  async function fetchArticle() {
    setIsLoading(true);

    try {
      const sessionStatus = await fetch(
        `/api/checkUserSession/?account=${account}`
      );

      let responseToJson = await sessionStatus.json();

      if (sessionStatus.status == 200) {
        console.log(responseToJson.result);
        if (!responseToJson.result) {
          const hex = await getData();
          console.log(hex);

          const loginRes = await fetch(
            `/api/login/?account=${account}&signature=${hex}`
          );

          responseToJson = await loginRes.json();

          if (loginRes.status == 200) {
            console.log(responseToJson.result);
            setIsAuth(true);
            // if (responseToJson.result != false)
            //   setArticle(responseToJson.result);
          }
        } else {
          setIsAuth(true);
        }
      }

      const response = await fetch(
        `/api/getVault/?account=${account}&vaultId=${params.id}`
      );
      responseToJson = await response.json();

      if (response.status == 200) {
        console.log(responseToJson.result);
        if (responseToJson.result != false) setArticle(responseToJson.result);
      }
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    (async () => {
      if (account && connected) fetchArticle();
    })();
  }, [connected, connected]);

  function AllowConainer() {
    return (
      <>
        {!article ? (
          <div>
            <p className="my-48 text-gray-300">
              You're not allowed to view this article
            </p>
          </div>
        ) : (
          <div className="">
            <Article markdown={`${article.data}`} />
          </div>
        )}
      </>
    );
  }

  function ArticleContainer() {
    return (
      <>{!isLoading && isAuth ? <AllowConainer /> : <LoadingAnimation />}</>
    );
  }

  return (
    <>
      <div className="min-w-screen bg-gray-900">
        <div className="flex flex-col items-center p-5">
          {!account ? (
            <button
              className="text-green-300 border border-green-300 rounded-xl px-5 py-2 mt-96"
              onClick={signInWithXumm}
            >
              XUMM login
            </button>
          ) : (
            <div className="flex flex-col items-center p-5">
              <p className="text-6xl font-bold mt-64 mb-16 text-gray-300">
                {article.name}
              </p>
              <ArticleContainer />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Vaults;
