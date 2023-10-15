import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Client,
  getBalanceChanges,
  rippleTimeToISOTime,
  rippleTimeToUnixTime,
} from "xrpl";
import ReactMarkdown from "react-markdown";

const Article = (props) => {
  const [selectedArticle, setSelectedArticle] = useState(`# Introduction

  This is example of **token-gated** article that's visible only to logged in users that have passed required checks and verified that they are users of the provided account.
  
  # Disclaimer
  
  This project is still a work in progress and should not be used in production without throughout code-review and security checks so that any potential vulnerabilities do not result in financial losses.
  
  # Overview
  
  Work in progress
  `);

  useEffect(() => {
    (async () => {
      const loginRes = await fetch(
        `https://xrpl-token-gated.infura-ipfs.io/ipfs/${props.markdown.substring(
          21
        )}`
      );

      let responseToJson = await loginRes.json();

      if (loginRes.status == 200) {
        console.log(responseToJson);
        setSelectedArticle(responseToJson);
      }
    })();
  });

  return (
    <div>
      <div className="border-2 border-gray-800 bg-gray-900 text-gray-200 p-10 rounded-lg w-fit flex flex-col items-center min-h-16 prose-p:text-gray-300 prose-h1:text-gray-300 prose-h2:text-gray-300 prose-h3:text-gray-300 prose-h4:text-gray-300 max-w-none mx-48 prose-strong:text-gray-500 prose-a:text-gray-500 prose-ol:text-gray-500 prose-ul:text-gray-500 prose-li:text-gray-500">
        {!false ? (
          <div className="prose text-left bg-base-200 max-w-none">
            <ReactMarkdown>{selectedArticle}</ReactMarkdown>
          </div>
        ) : (
          "test"
        )}
      </div>
    </div>
  );
};

export default Article;
