'use client'

import { useState } from 'react'
import { SignForm } from '@/components/sign-form'
import { HistoryFeed } from '@/components/history-feed'
import { GUEST_BOOK_ADDRESS } from '@/config/wagmi'

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Monad Guest Book</h1>
        <p className="text-sm text-muted-foreground">
          Leave a permanent message on Monad testnet.{' '}
          <a
            href={`https://testnet.monadscan.com/address/${GUEST_BOOK_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Contract
          </a>
        </p>
      </header>

      <SignForm onSigned={() => setRefreshKey((k) => k + 1)} />
      <HistoryFeed refreshKey={refreshKey} />
    </main>
  )
}
