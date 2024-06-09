interface Token {
  name: string;
  address: string;
  decimal?: number;
  icon: string;
  coinGeckoId?: string;
  canPayNiural?: boolean;
}

interface Chain {
  networkName: string;
  isMainnet: boolean;
  safePayContract: string;
  blockExplorer: string;
  tokens: Token[];
}

interface Assets {
  [key: string]: Chain;
}

const usdcImage = "https://i.ibb.co/pQ3Bc71/usdc.png";
const usdtImage = "https://i.ibb.co/f0cQXFN/USDT.png";
const busdImage = "https://i.ibb.co/5BwmxKQ/BUSD.png";
const daiImage = "https://i.ibb.co/zPKqDWv/dai.jpg";
const maticImage = "https://i.ibb.co/4f2v984/matic.png";
const usdsImage = "https://i.ibb.co/vvVGLwp/usds.png";

const Assets: Assets = {
  // Polygon
  // Mumbai Testnet
  "80001": {
    networkName: "polygonmumbai",
    isMainnet: false,
    safePayContract: "0x742B65b24285E9042033E78Ba86d2BDEbfaF7cd6", // correct
    blockExplorer: "https://mumbai.polygonscan.com/tx/",
    tokens: [
      {
        name: "Matic",
        address: "eth",
        icon: maticImage,
        decimal: 18,
      },
      {
        name: "A_CR7",
        address: "0xD68906dB6cc9B1965Df0C9239c11d8Fb97512325",
        icon: "https://i.ibb.co/Bw1VdLx/Ronaldo.jpg",
        decimal: 18,
      },
      {
        name: "USDC",
        address: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747", // correct
        decimal: 6,
        icon: usdcImage,
        coinGeckoId: "usd-coin",
        canPayNiural: true,
      },
      {
        name: "USDT",
        address: "0xf7f730ffaec85455e3ba44f488c2bd2a741953b3", // correct
        decimal: 6,
        icon: usdtImage,
        coinGeckoId: "tether",
        canPayNiural: true,
      },
      {
        name: "USDS",
        address: "0x8bf8210d92Df678f61AaBFd561f0B1F83BA7A3fC", // correct
        decimal: 6,
        icon: usdsImage,
        coinGeckoId: "stableusd",
        canPayNiural: true,
      },
      {
        name: "BUSD",
        address: "0x24e8998a803D7b6dc15071f30FAC618E52362764", // correct
        decimal: 18,
        icon: busdImage,
        coinGeckoId: "binance-usd",
      },
      {
        name: "DAI",
        address: "0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253", // correct
        decimal: 18,
        icon: daiImage,
        coinGeckoId: "dai",
      },
      {
        name: "WMATIC",
        address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889", // correct
        decimal: 18,
        icon: maticImage,
        coinGeckoId: "wmatic",
      },
    ],
  },
  // Ethereum isMainnet
};

export default Assets;
