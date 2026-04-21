'use client'

import { useState } from 'react'
import { useAccount, useSwitchChain, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { toast } from 'sonner'
import { GUEST_BOOK_ABI, GUEST_BOOK_ADDRESS, GUEST_BOOK_CHAIN_ID } from '@/config/wagmi'

const MAX_LEN = 280

export function SignForm({ onSigned }: { onSigned?: () => void }) {
  const { address, isConnected, chainId } = useAccount()
  const { switchChain, isPending: switching } = useSwitchChain()
  const [message, setMessage] = useState('')

  const { writeContract, data: hash, isPending, reset } = useWriteContract()
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign the guest book</CardTitle>
          <CardDescription>Connect a wallet to leave a message onchain.</CardDescription>
        </CardHeader>
        <CardContent>
          <ConnectButton />
        </CardContent>
      </Card>
    )
  }

  const wrongChain = chainId !== GUEST_BOOK_CHAIN_ID
  const tooLong = message.length > MAX_LEN
  const disabled = !message.trim() || tooLong || isPending || confirming

  async function handleSign() {
    try {
      writeContract({
        abi: GUEST_BOOK_ABI,
        address: GUEST_BOOK_ADDRESS,
        functionName: 'sign',
        args: [message.trim()],
        chainId: GUEST_BOOK_CHAIN_ID,
      })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to submit')
    }
  }

  if (isSuccess) {
    setTimeout(() => {
      toast.success('Message signed!')
      setMessage('')
      reset()
      onSigned?.()
    }, 0)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Sign the guest book</CardTitle>
            <CardDescription className="font-mono text-xs">{address}</CardDescription>
          </div>
          <ConnectButton accountStatus="avatar" chainStatus="icon" showBalance={false} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="Say something to the chain..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          maxLength={MAX_LEN + 20}
          disabled={isPending || confirming}
        />
        <div className="flex items-center justify-between text-xs">
          <span className={tooLong ? 'text-destructive' : 'text-muted-foreground'}>
            {message.length}/{MAX_LEN}
          </span>
          {wrongChain ? (
            <Button
              size="sm"
              variant="outline"
              disabled={switching}
              onClick={() => switchChain({ chainId: GUEST_BOOK_CHAIN_ID })}
            >
              {switching ? 'Switching...' : 'Switch to Monad Testnet'}
            </Button>
          ) : (
            <Button size="sm" disabled={disabled || wrongChain} onClick={handleSign}>
              {isPending ? 'Confirm in wallet...' : confirming ? 'Confirming...' : 'Sign'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
