import { ethers } from 'ethers'

interface BlockExplorerConfig {
  baseUrl: string
}

export type ChainConfig = {
  chainId: number
  name: string
  provider: ethers.JsonRpcProvider
  blockExplorer: BlockExplorerConfig
  isTestnet: boolean
}

export enum Networks {
  Mainnet = 1,
  OptimismSepolia = 11155420,
  holesky = 17000,
  optimism = 10
}

const configs: ChainConfig[] = [
  {
    chainId: Networks.Mainnet,
    name: 'mainnet',
    provider: new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_MAINNET_URL),
    isTestnet: false,
    blockExplorer: {
      baseUrl: 'https://etherscan.io'
    }
  },
  {
    chainId: Networks.OptimismSepolia,
    name: 'Optimism Sepolia',
    provider: new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_OPTIMIST_SEPOLIA_URL),
    blockExplorer: {
      baseUrl: 'https://optimism-sepolia.blockscout.com'
    },
    isTestnet: true
  },
  {
    chainId: Networks.holesky,
    name: 'holesky',
    provider: new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_HOLESKY_URL),
    blockExplorer: {
      baseUrl: 'https://optimism-sepolia.blockscout.com'
    },
    isTestnet: true
  },
  {
    chainId: Networks.optimism,
    name: 'optimism',
    provider: new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_OPTIMISM_URL),
    blockExplorer: {
      baseUrl: 'https://optimistic.etherscan.io'
    },
    isTestnet: false
  }
]

/**
 * @deprecated
 */
export default function chainConfig(): ChainConfig {
  const config = configs.find(c => c.chainId === Number(process.env.NEXT_PUBLIC_CHAIN_ID))
  if (!config) throw new Error('chainId not found in chainConfig')
  return config
}

export function chainConfigByChainId(chainId: number): ChainConfig {
  const config = configs.find(c => c.chainId === chainId)
  if (!config) throw new Error('chainId not found in chainConfig')
  return config
}
