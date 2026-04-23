import { Guestbook } from "generated";
import type { Guestbook_Signed } from "generated";

Guestbook.Signed.handler(async ({ event, context }) => {
  const entity: Guestbook_Signed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    event_id: event.params.id,
    signer: event.params.signer,
    timestamp: event.params.timestamp,
    message: event.params.message,
    blockNumber: BigInt(event.block.number),
    txHash: event.transaction.hash,
  };

  context.Guestbook_Signed.set(entity);
});
