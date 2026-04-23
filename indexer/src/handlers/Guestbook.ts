import { Guestbook } from "generated";
import type { GuestbookEntry } from "generated";

Guestbook.Signed.handler(async ({ event, context }) => {
  const entity: GuestbookEntry = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    entryId: event.params.id,
    signer: event.params.signer,
    message: event.params.message,
    timestamp: event.params.timestamp,
    blockNumber: BigInt(event.block.number),
    txHash: event.transaction.hash,
  };

  context.GuestbookEntry.set(entity);
});
