import React, { useState, useEffect, useContext, useCallback } from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Routes,
} from "react-router-dom";
import { LedgerContext } from "../../contexts/LedgerProvider";
import { truncateStr } from "../../utils";
import Home from "../../pages/Home";
import Vaults from "../../pages/Vaults";
import Create from "../../pages/Create";

const Navbar = () => {
  const {
    xummInstance,
    account,
    chainId,
    connected,
    connect,
    disconnect,
    getData,
  } = useContext(LedgerContext);

  useEffect(() => {
    (async () => {
      // console.log(xummInstance);
      // console.log(account);
    })();
  }, []);

  const signInWithXumm = async () => {
    const res = await connect();
    // console.log(res);
    // console.log(await xummInstance);
    // console.log(account);
  };

  return (
    <div>
      <nav
        className="flex justify-around py-4 bg-gray/80
            backdrop-blur-md shadow-md w-full
            fixed top-0 left-0 right-0 z-10 overflow-hidden"
      >
        <div className="flex items-center">
          <a className="cursor-pointer">
            <h3 className="text-2xl font-medium text-green-300">
              XRP DataVault
            </h3>
          </a>
        </div>

        <div className="items-center hidden space-x-10 lg:flex">
          <Link
            className={`flex text-gray-400 hover:text-green-300
            cursor-pointer transition-colors duration-300`}
            to="/"
          >
            Vaults
          </Link>

          <Link
            className={`flex text-gray-400 hover:text-green-300
            cursor-pointer transition-colors duration-300`}
            to="/create"
          >
            Create
          </Link>
        </div>

        <div className="flex items-center space-x-5">
          <a
            className="flex
                    cursor-pointer transition-colors duration-300
                    font-semibold text-green-300"
          >
            <ArrowRightOnRectangleIcon className="fill-current h-5 w-5 mr-2 mt-0.5 text-green-300" />
            {!account ? (
              <div onClick={() => signInWithXumm()}>XUMM login</div>
            ) : (
              <div onClick={() => disconnect()}>{truncateStr(account)}</div>
            )}
          </a>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="create" element={<Create />} />
        <Route path="inVault/:id" element={<Vaults />} />
      </Routes>
    </div>
  );
};

export default Navbar;
