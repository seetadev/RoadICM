# Transport Incident Vault

## Features

Incident Vault allows for storing and accessing wallet-permissioned incident images, files, screenshots and documents.

## Potential use-cases

- Sharing wallet-to-wallet encrypted private incident images, files, screenshots and documents.
- Token-gated content for vehicle spare parts NFT collection holders.
- Spare parts services and resources shared only to DAO token holders.

## Prerequisites

- Node.js installed on your system
- An Infura account to upload data to the IPFS network
- An XRPL account to interact with the ledger

## dApp

React application that allows users to interact with the API. The application provides functionality to retrieve files after proving ownership of wallet address.

## Installation

To install this application, clone the repository and run the following command in your terminal:

- `npm i` - to install dependencies
- `npm run dev` - to start the dApp

## Backend

This is a Express.js server that provides a RESTful API to create and access XRPL data vaults. These vaults allow you to store data in a decentralized manner using the XRP Ledger.

### Installation

- Clone this repository to your local machine

- Navigate to the repository directory in your terminal

- Install dependencies by running `npm install`

- Create a `.env` file in the root directory and add the following variables:

`INFURA_ID=<Infura project ID>`
`INFURA_SECRET=<Infura project secret>`
`SELECTED_NETWORK=<Selected XRP network RPC>` e.g. `wss://s.devnet.rippletest.net:51233`

Where `INFURA_ID` and `INFURA_SECRET` are your Infura project ID and secret, respectively.
`SELECTED_NETWORK` is the XRPL network you want to connect to.

- Start the server by running `npm start`

## API Endpoints Documentation

- `GET /Login`

```
openapi: 3.0.0
info:
  version: 1.0.0
  title: Incident vault API
paths:
  /api/login:
    get:
      summary: Verify user signature
      description: Verify the user signature using the account and signature provided in the query parameters
      parameters:
        - name: account
          in: query
          required: true
          description: The user account to verify
          schema:
            type: string
        - name: signature
          in: query
          required: true
          description: The user signature to verify
          schema:
            type: string
      responses:
        '200':
          description: User signature verification result
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: boolean
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  Error:
                    type: string
```

- `GET /CheckUserSession`

```
openapi: 3.0.0
info:
  version: 1.0.0
  title: Incident vault API
paths:
  /api/checkUserSession:
    get:
      summary: Check user session status
      description: Check the session status of the user with the account provided in the query parameters
      parameters:
        - name: account
          in: query
          required: true
          description: The user account to check the session status for
          schema:
            type: string
      responses:
        '200':
          description: User session status
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: boolean
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  Error:
                    type: string
```

- `GET /AddVault`

```
openapi: 3.0.0
info:
  version: 1.0.0
  title: Incident vault API
paths:
  /api/addVault:
    get:
      summary: Add a new data vault
      description: Add a new data vault with the provided details
      parameters:
        - name: name
          in: query
          required: true
          description: The name of the data vault
          schema:
            type: string
        - name: account
          in: query
          required: true
          description: The account of the data vault owner
          schema:
            type: string
        - name: requiresWhietelist
          in: query
          required: true
          description: Whether the data vault requires a whitelist or not
          schema:
            type: boolean
        - name: requiresNft
          in: query
          required: true
          description: Whether the data vault requires an NFT or not
          schema:
            type: boolean
        - name: whitelistedAdresses
          in: query
          required: false
          description: The addresses whitelisted for accessing the data vault
          schema:
            type: array
            items:
              type: string
        - name: markdownText
          in: query
          required: true
          description: The markdown text to be stored in the data vault
          schema:
            type: string
      responses:
        '200':
          description: Data vault created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: boolean
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  Error:
                    type: string
```

- `GET /GetVault`

```
openapi: 3.0.0
info:
  version: 1.0.0
  title: Incident vault API
paths:
  /api/getVault:
    get:
      summary: Get data from a specific data vault
      description: Get the data from the specified data vault owned by the provided account
      parameters:
        - name: account
          in: query
          required: true
          description: The account of the data vault owner
          schema:
            type: string
        - name: vaultId
          in: query
          required: true
          description: The ID of the data vault to retrieve data from
          schema:
            type: string
      responses:
        '200':
          description: Data retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: object
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  Error:
                    type: string

```

- `GET /DisplayVaults`

```
openapi: 3.0.0
info:
  version: 1.0.0
  title: Incident vault API
paths:
  /api/displayVaults:
    get:
      summary: Get a list of public data vaults
      description: Get a list of all public data vaults
      responses:
        '200':
          description: Data retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: string
                        name:
                          type: string
                        owner:
                          type: string
                        requiresWhitelist:
                          type: boolean
                        requiresNft:
                          type: boolean
                        whitelistedAddresses:
                          type: array
                          items:
                            type: string
                        markdownText:
                          type: string
                        createdAt:
                          type: string
                        updatedAt:
                          type: string
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  Error:
                    type: string
```




