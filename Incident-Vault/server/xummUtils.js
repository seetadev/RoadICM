const { XummSdk } = require("xumm-sdk");
const Sdk = new XummSdk(
  import.meta.env.VITE_XUMM_KEY,
  import.meta.env.VITE_XUMM_SECRET
);

const main = async () => {
  const appInfo = await Sdk.ping();
  console.log(appInfo.application.name);

  const request = {
    TransactionType: "Payment",
    Destination: "rPmpEHzTCfhvzo8fDv8GjeapBA1kqehXj6",
    Amount: "10000",
    Memos: [
      {
        Memo: {
          MemoData: "F09F988E20596F7520726F636B21",
        },
      },
    ],
  };

  //   const payload = await Sdk.payload.create(request, true);
  //   console.log(payload);

  const subscription = await Sdk.payload.createAndSubscribe(
    request,
    (event) => {
      console.log("New payload event:", event.data);

      if (event.data.signed === true) {
        // No need to console.log here, we'll do that below
        return event.data;
      }

      if (event.data.signed === false) {
        // No need to console.log here, we'll do that below
        return false;
      }
    }
  );

  console.log(subscription.created);

  /**
   * Now let's wait until the subscription resolved (by returning something)
   * in the callback function.
   */
  const resolveData = await subscription.resolved;

  if (resolveData.signed === false) {
    console.log("The sign request was rejected :(");
  }

  if (resolveData.signed === true) {
    console.log("Woohoo! The sign request was signed :)");

    /**
     * Let's fetch the full payload end result, and get the issued
     * user token, we can use to send our next payload per Push notification
     */
    const result = await Sdk.payload.get(resolveData.payload_uuidv4);
    console.log("User token:", result.application.issued_user_token);
  }
};

main();
