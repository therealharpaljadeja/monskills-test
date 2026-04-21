import { createPublicClient, http, parseAbiItem, type Log } from 'viem'
import { monadTestnet } from 'wagmi/chains'
import { GUEST_BOOK_ADDRESS } from '@/config/wagmi'
import type { GuestBookEntry } from './indexer'

const client = createPublicClient({
  chain: monadTestnet,
  transport: http('https://testnet-rpc.monad.xyz'),
})

const event = parseAbiItem(
  'event MessageSigned(address indexed signer, string message, uint256 timestamp, uint256 indexed id)'
)

export async function fetchEntriesOnchain({
  limit = 20,
}: {
  limit?: number
}): Promise<GuestBookEntry[]> {
  const logs = await client.getLogs({
    address: GUEST_BOOK_ADDRESS,
    event,
    fromBlock: 'earliest',
    toBlock: 'latest',
  })

  return logs
    .slice()
    .reverse()
    .slice(0, limit)
    .map((log: Log & { args?: { signer?: `0x${string}`; message?: string; timestamp?: bigint; id?: bigint } }) => ({
      id: `${log.blockNumber}_${log.logIndex}`,
      signer: (log.args?.signer ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      message: log.args?.message ?? '',
      timestamp: String(log.args?.timestamp ?? BigInt(0)),
      event_id: String(log.args?.id ?? BigInt(0)),
    }))
}
