<div align="center">
  <a href="https://particle.network/">
    <img src="https://i.imgur.com/xmdzXU4.png" />
  </a>
  <h3>
 Particle RainbowKit Boilerplate
  </h3>
</div>

# Particle Auth with RainbowKit🌈

⚡️ Boilerplate for a RainbowKit module with native [Particle Auth](https://docs.particle.network/developers/auth-service) integration. This example provides shortcuts for Twitter, Google, and GitHub authentication alongside a general Particle Auth configuration, represented as "Particle."

This app allows you to log in using social logins and other providers from Rainbowkit and interact with the Ethereum Sepolia and Base Sepolia testnets by displaying account information and sending a transfer transaction to an address you can input in the UI.

> The Next application is within the `particle-auth-rainbowkit` directory.

> `src/app/page.tsx` has extensive comments about the logic and usage of those packages.

Built using:

- **Next.js**
- **Particle Auth Core**
- **RainbowKit** (+ Particle extension)
- **Wagmi**
- **ethers.js V6.x.x**
- **TypeScript**
- **`src/` directory**
- **App router**
- **Tailwind CSS**

Dependencies to install when starting from scratch:

```sh
yarn add @particle-network/auth @particle-network/rainbowkit-ext @particle-network/auth-core-modal @particle-network/chains @rainbow-me/rainbowkit wagmi viem @tanstack/react-query
```

## 🔑 Particle Auth
Particle Auth, a component of Particle Network's Wallet-as-a-Service, enables seamless onboarding to an application-embedded MPC-TSS/AA wallet facilitated by social login, such as Google, GitHub, email, phone number, etc.

👉 Try the demo: https://web-demo.particle.network/rainbowKit

👉 Learn more about Particle Network: https://particle.network

![Particle Auth Example](https://i.imgur.com/czZtg37.png)

##

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/TABASCOatw/particle-rainbowkit-boilerplate&env=REACT_APP_PROJECT_ID&env=REACT_APP_CLIENT_KEY&env=REACT_APP_APP_ID&env=REACT_APP_WALLETCONNECT_PROJECT_ID&envDescription=Head%20over%20to%20the%20Particle%20dashboard%20to%20retrieve%20the%20above%20keys.&envLink=https%3A%2F%2Fdashboard.particle.network">
    <img src="https://vercel.com/button" alt="Deploy with Vercel"/>
  </a>
</p>

## 🛠️ Quickstart

### Clone this repository
```
git clone https://github.com/soos3d/particle-auth-rainbowkit-next.git
```

### Install dependencies
```
yarn install
```
OR
```
npm install
```

### Set environment variables
This project requires some keys from Particle Network and WalletConnect to be defined in `.env`. The following should be defined:
- `NEXT_PUBLIC_PROJECT_ID`, the ID of the corresponding application in your [Particle Network dashboard](https://dashboard.particle.network/#/applications).
- `NEXT_PUBLIC_CLIENT_KEY`, the ID of the corresponding project in your [Particle Network dashboard](https://dashboard.particle.network/#/applications).
- `NEXT_PUBLIC_APP_ID`, the client key of the corresponding project in your [Particle Network dashboard](https://dashboard.particle.network/#/applications).

### Start the project
```
npm run dev
```
OR
```
yarn dev
```

## Understanding the RainbowKit integration

The RainbowKit integration allows you to leverage RainbowKit on top of Particle auth. So, the initial configuration of `AuthCoreContextProvider` in `layout.tsx` is similar to the standalone Particle Auth setup. Check `src/app/layout.tsx` to see the config.

In `src/particleWallet/index.ts`, you will learn how to set up the connector instances to include specific social logins. 

In this example, we include:

- Particle Wallet
- Google
- Twitter
- GitHub


In' src/rainbowkit/index.ts, ' you can customize how the UI organizes the providers and which ones you want to offer as options. You can also choose which networks are allowed within the app.

Now, refer to `src/app/page.tsx` to see how to use the provider.