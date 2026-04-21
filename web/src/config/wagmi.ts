import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { monadTestnet } from 'wagmi/chains'
import { http } from 'wagmi'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'demo'

export const config = getDefaultConfig({
  appName: 'Monad Guest Book',
  projectId,
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http('https://testnet-rpc.monad.xyz'),
  },
  ssr: true,
})

export const GUEST_BOOK_ADDRESS = '0x3a30fe2C13AE29Ad3DC50e82e1767Cb856C75d70' as const
export const GUEST_BOOK_CHAIN_ID = monadTestnet.id

export const GUEST_BOOK_ABI = [
  {
    type: 'function',
    name: 'sign',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'message', type: 'string' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'totalMessages',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'MAX_MESSAGE_LENGTH',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'MessageSigned',
    inputs: [
      { name: 'signer', type: 'address', indexed: true },
      { name: 'message', type: 'string', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
      { name: 'id', type: 'uint256', indexed: true },
    ],
  },
  { type: 'error', name: 'EmptyMessage', inputs: [] },
  { type: 'error', name: 'MessageTooLong', inputs: [] },
] as const
