const express = require("express");
const xrpl = require("xrpl");
require("dotenv").config();
const bodyParser = require("body-parser");
const fs = require("fs");
const verifySignature = require("verify-xrpl-signature").verifySignature;
const multer = require("multer");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// app.use(function (req, res) {
//   res.setHeader("Content-Type", "text/plain");
//   res.write("you posted:\n");
//   res.end(JSON.stringify(req.body, null, 2));
// });

const port = 4000;
app.listen(port, () => {
  console.log(`XRPL data vault server listening on port ${port}`);
});

let vaults = [];
let sessions = new Map();

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

/**
 * Checks if all required params were provided for requested endpoint
 * @param {Array} params - list of parameters that are necessary for correct execution of code in checked endpoint
 */
const requireParams = (params) => {
  return (req, res, next) => {
    const reqParamList = Object.keys(req.query);
    const reqValueList = Object.values(req.query);
    const hasAllRequiredParams = params.every((param) =>
      reqParamList.includes(param)
    );
    let hasNonEmptyParams = false;
    if (hasAllRequiredParams) {
      hasNonEmptyParams = reqValueList.every(
        (paramValue) => paramValue.length != 0
      );
    }
    if (!hasAllRequiredParams || !hasNonEmptyParams)
      return res
        .status(400)
        .send(
          `The following parameters are all required for this route: ${params.join(
            ", "
          )}`
        );
    next();
  };
};

/**
 * Checks if all required params were provided for requested endpoint
 * @param {Array} params - list of parameters that are necessary for correct execution of code in checked endpoint
 */
const requireBody = (params) => {
  return (req, res, next) => {
    const reqParamList = Object.keys(req.body);
    const reqValueList = Object.values(req.body);
    console.log(reqValueList);
    const hasAllRequiredParams = params.every((param) =>
      reqParamList.includes(param)
    );
    let hasNonEmptyParams = false;
    if (hasAllRequiredParams) {
      hasNonEmptyParams = reqValueList.every(
        (paramValue) => paramValue.length != 0
      );
    }
    if (!hasAllRequiredParams || !hasNonEmptyParams)
      return res
        .status(400)
        .send(
          `The following parameters are all required for this route: ${params.join(
            ", "
          )}`
        );
    next();
  };
};

const verifyUserSignature = async (account, signature) => {
  const verificationStatus = verifySignature(signature, account);
  console.log(verificationStatus);
  if (!verificationStatus.signatureValid)
    throw new Error("Incorrect signature.");
  if (verificationStatus.signedBy != account)
    throw new Error("Signature is from different account.");

  sessions.set(account, Date.now());
  return true;
};

/**
 * Checks for all NFTs owned by a particular address
 * @param {string} address - The wallet address to check
 * @param {string} [taxon] - An optional parameter used to filter the NFTs by taxon
 * @returns {object[]} - An array of NFTs owned by the given address. If no NFTs are found, returns an empty array
 */
const getBatchNFTokens = async (address, taxon) => {
  try {
    if (!address) throw new Error("Can't get NFTs without account address.");
    const client = new xrpl.Client(process.env.SELECTED_NETWORK);
    await client.connect();
    let nfts = await client.request({
      method: "account_nfts",
      account: address,
    });
    let accountNfts = nfts.result.account_nfts;
    console.log("Found ", accountNfts.length, " NFTs in account ", address);
    while (true) {
      if (nfts["result"]["marker"] === undefined) {
        break;
      } else {
        nfts = await client.request({
          method: "account_nfts",
          account: address,
          marker: nfts["result"]["marker"],
        });
        accountNfts = accountNfts.concat(nfts.result.account_nfts);
      }
    }
    client.disconnect();
    if (taxon) return accountNfts.filter((a) => a.NFTokenTaxon == taxon);
    return accountNfts;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const checkNftOwnership = async (account, owner) => {
  const accountNfts = await getBatchNFTokens(account);

  for (let i = 0; i != accountNfts.length; i++) {
    if (accountNfts[i].Issuer == owner) {
      return true;
    }
    if (i == accountNfts.length - 1) return false;
  }

  return false;
};

const createDataVault = async (
  name,
  account,
  requiresWhietelist,
  requiresNft,
  whitelistedAdresses,
  ipfsData,
  vaultImg
) => {
  vaults.push({
    id: vaults.length,
    name: name,
    owner: account,
    whitelist: requiresWhietelist,
    whitelistedAdresses: whitelistedAdresses
      .split(",")
      .map((value) => value.trim()),
    requiresNft: requiresNft,
    data: ipfsData,
    vaultImg: vaultImg,
  });
  console.log(vaults);
  return true;
};

const getSessionStatus = async (account) => {
  if (!sessions.has(account)) return false;

  const userSessionTime = sessions.get(account);
  const timeDifferece = Date.now() - userSessionTime;
  console.log(timeDifferece);
  if (timeDifferece > 600000) return false;
  return true;
};

const getVaultData = async (account, vaultId) => {
  const doesUserHaveSession = sessions.has(account);
  console.log(doesUserHaveSession);
  if (!doesUserHaveSession)
    throw new Error(
      "User have to authenticate before retrieving data from vault."
    );

  if (await !getSessionStatus(account))
    throw new Error("User session have expired.");

  if (
    vaults[vaultId].whitelist == "true" &&
    vaults[vaultId].whitelistedAdresses.indexOf(account) == -1
  )
    return false;
  // throw new Error("User is not whitelisted.");

  if (vaults[vaultId].requiresNft == "true") {
    const isNftRequirementMet = await checkNftOwnership(
      account,
      vaults[vaultId].owner
    );
    if (!isNftRequirementMet) return false;
    // throw new Error("User does not have required NFT.");
  }

  if (vaultId >= vaults.length)
    throw new Error("Can't get data for nonexisting vault.");
  return vaults[vaultId];
};

const getPublicVaults = async () => {
  if (vaults.length <= 0) return false;

  const vaultsWithoutSecret = vaults.map((obj) => {
    const { data, ...rest } = obj;
    return rest;
  });

  console.log(vaultsWithoutSecret);

  return vaultsWithoutSecret;
};

/**
 * Uploads provided data to IPFS
 * @param {object} data - Metadata object
 * @returns {string} path - hash of file uploaded to IPFS
 */
const postToIPFS = async (data) => {
  const { create } = await import("ipfs-http-client");
  let ipfs;
  let path = "";
  try {
    const INFURA_DATA = process.env.INFURA_ID + ":" + process.env.INFURA_SECRET;
    const authorization =
      "Basic " + Buffer.from(INFURA_DATA, "utf8").toString("base64");
    ipfs = create({
      url: "https://infura-ipfs.io:5001/api/v0",
      headers: {
        authorization,
      },
    });
    const result = await ipfs.add(data);
    path = `https://ipfs.io/ipfs/${result.path}`;
    //path = `ipfs://${result.path}`;
  } catch (error) {
    console.error("IPFS error ", error);
    return error;
  }
  return path;
};

app.get("/api/login", requireParams(["account", "signature"]), (req, res) => {
  (async () => {
    try {
      const { account, signature } = await req.query;
      console.log(account, signature);
      return res.send({
        result: await verifyUserSignature(account, signature),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        Error: `${error}`,
      });
    }
  })();
});

app.get("/api/checkUserSession", requireParams(["account"]), (req, res) => {
  (async () => {
    try {
      const { account } = await req.query;
      console.log(account);

      return res.send({
        result: await getSessionStatus(account),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        Error: `${error}`,
      });
    }
  })();
});

app.post(
  "/api/addVault",
  requireBody([
    "name",
    "account",
    "requiresWhietelist",
    "requiresNft",
    // "whitelistedAdresses",
    "markdownText",
    "vaultImg",
  ]),
  async (req, res) => {
    try {
      const {
        name,
        account,
        requiresWhietelist,
        requiresNft,
        whitelistedAdresses,
        markdownText,
        vaultImg,
      } = await req.body;

      console.log(req.body);
      console.log(
        name,
        account,
        requiresWhietelist,
        requiresNft,
        whitelistedAdresses,
        vaultImg
      );

      console.log(await postToIPFS(vaultImg));

      const ipfsData = await postToIPFS(JSON.stringify(markdownText));

      return res.send({
        result: await createDataVault(
          name,
          account,
          requiresWhietelist,
          requiresNft,
          whitelistedAdresses,
          ipfsData,
          vaultImg
        ),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        Error: `${error}`,
      });
    }
  }
);

app.get("/api/getVault", requireParams(["account", "vaultId"]), (req, res) => {
  (async () => {
    try {
      const { account, vaultId } = await req.query;
      console.log(account, vaultId);
      return res.send({
        result: await getVaultData(account, vaultId),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        Error: `${error}`,
      });
    }
  })();
});

app.get("/api/displayVaults", (req, res) => {
  (async () => {
    try {
      //   const { account, vaultId } = await req.query;
      return res.status(200).send({
        result: await getPublicVaults(),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        Error: `${error}`,
      });
    }
  })();
});

module.exports = app;
