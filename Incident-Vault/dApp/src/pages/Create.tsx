import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { LedgerContext } from "../contexts/LedgerProvider";
import Article from "../components/Article";

function Create() {
  const [userAddress, setUserAddress] = useState(
    "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
  );
  const [payloadUuid, setPayloadUuid] = useState("");
  const [lastPayloadUpdate, setLastPayloadUpdate] = useState("");
  const [openPayloadUrl, setOpenPayloadUrl] = useState("");
  const { xummInstance, account, chainId, connected, connect, disconnect } =
    useContext(LedgerContext);
  const [formValues, setFormValues] = useState({
    name: "",
    requiresWhietelist: "false",
    requiresNft: "false",
    whitelistedAdresses: "",
    markdownText: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      name,
      // account,
      requiresWhietelist,
      requiresNft,
      whitelistedAdresses,
      markdownText,
      vaultImg,
    } = formValues;

    const response = await fetch("/api/addVault", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Content-Type": "multipart/form-data",
      },
      body: JSON.stringify({
        name,
        account: account,
        requiresWhietelist,
        requiresNft,
        whitelistedAdresses,
        markdownText,
        vaultImg,
      }),
    });

    // const formData = new FormData();
    // formData.append("name", name);
    // formData.append("account", account);
    // formData.append("requiresWhietelist", requiresWhietelist);
    // formData.append("requiresNft", requiresNft);
    // formData.append("whitelistedAdresses", whitelistedAdresses);
    // formData.append("markdownText", markdownText);
    // formData.append("vaultImg", vaultImg);

    // const response = await fetch("/api/addVault", {
    //   method: "POST",
    //   headers: {
    //     // "Content-Type": "application/json",
    //     "Content-Type": "multipart/form-data",
    //   },
    //   body: formData,
    // });

    // console.log(
    //   JSON.stringify({
    //     name,
    //     account,
    //     requiresWhietelist,
    //     requiresNft,
    //     whitelistedAdresses,
    //     markdownText,
    //   })
    // );

    if (response.ok) {
      console.log(response);
      // handle successful response
    } else {
      console.log(response);
      // handle error response
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileChange = (event) => {
    const { name, value } = event.target.files[0];
    setFormValues({ ...formValues, [name]: value });
  };

  async function signInWithXumm() {
    const res = await connect();
  }

  useEffect(() => {
    (async () => {})();
  }, []);

  return (
    <>
      <div className="min-w-screen bg-gray-900">
        <div className="flex flex-col items-center p-5">
          <p className="text-6xl font-bold mt-64 mb-16 text-gray-300">
            Create new vault
          </p>
          {!account ? (
            <button
              className="text-green-300 border border-green-300 rounded-xl px-5 py-2"
              onClick={signInWithXumm}
            >
              XUMM login
            </button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="py-6 px-20 rounded-lg bg-gray-800 w-1/2"
            >
              <div className="mb-4">
                <label
                  className="block text-gray-400 font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="bg-gray-900 shadow appearance-none rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-400 font-bold mb-2"
                  htmlFor="requiresWhietelist"
                >
                  Required whitelist
                </label>

                <div className="flex space-x-4">
                  <div className="flex items-center dark:bg-gray-800">
                    <input
                      type="radio"
                      id="trueOption"
                      name="requiresWhietelist"
                      value="true"
                      checked={formValues.requiresWhietelist === "true"}
                      onChange={handleChange}
                      className="form-radio h-5 w-5 border border-1 border-black"
                    />
                    <label htmlFor="trueOption" className="ml-2 text-gray-300">
                      True
                    </label>
                  </div>
                  <div className="flex items-center ">
                    <input
                      type="radio"
                      id="falseOption"
                      name="requiresWhietelist"
                      value="false"
                      checked={formValues.requiresWhietelist === "false"}
                      onChange={handleChange}
                      className="form-radio h-5 w-5 text-gray-300 bg-gray-700 shadow rounded-full"
                    />
                    <label htmlFor="falseOption" className="ml-2 text-gray-300">
                      False
                    </label>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-400 font-bold mb-2"
                  htmlFor="requiresNft"
                >
                  Required NFT
                </label>

                <div className="flex space-x-4">
                  <div className="flex items-center dark:bg-gray-800">
                    <input
                      type="radio"
                      id="trueOption"
                      name="requiresNft"
                      value="true"
                      checked={formValues.requiresNft === "true"}
                      onChange={handleChange}
                      className="form-radio h-5 w-5 border border-1 border-black"
                    />
                    <label htmlFor="trueOption" className="ml-2 text-gray-300">
                      True
                    </label>
                  </div>
                  <div className="flex items-center ">
                    <input
                      type="radio"
                      id="falseOption"
                      name="requiresNft"
                      value="false"
                      checked={formValues.requiresNft === "false"}
                      onChange={handleChange}
                      className="form-radio h-5 w-5 text-gray-300 bg-gray-700 shadow rounded-full"
                    />
                    <label htmlFor="falseOption" className="ml-2 text-gray-300">
                      False
                    </label>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-400 font-bold mb-2"
                  htmlFor="whitelistedAdresses"
                >
                  Whitelisted adresses (separated by comma)
                </label>
                <input
                  className="bg-gray-900 shadow appearance-none rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                  id="whitelistedAdresses"
                  type="text"
                  placeholder="Enter whitelisted adresses"
                  name="whitelistedAdresses"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-400 font-bold mb-2"
                  htmlFor="whitelistedAdresses"
                >
                  Vault image
                </label>
                <input
                  className="bg-gray-900 shadow appearance-none rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                  id="vaultImg"
                  type="text"
                  name="vaultImg"
                  accept=".png,.jpg, .JPEG"
                  placeholder="Enter link to image"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-400 font-bold mb-2"
                  htmlFor="markdownText"
                >
                  Markdown text
                </label>
                <textarea
                  className="bg-gray-900 shadow appearance-none rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline h-48"
                  id="markdownText"
                  type="text"
                  placeholder="Enter markdown text"
                  name="markdownText"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex justify-center">
                <button
                  className="center content-center self-center text-center bg-green-400 hover:bg-green-500 text-gray-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Create;
