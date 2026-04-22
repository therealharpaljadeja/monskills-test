/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import { Guestbook } from "generated";
import type {
  Guestbook_MessageSigned,
} from "generated";

Guestbook.MessageSigned.handler(async ({ event, context }) => {
  const entity: Guestbook_MessageSigned = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    event_id: event.params.id,
    signer: event.params.signer,
    message: event.params.message,
    timestamp: event.params.timestamp,
  };

  context.Guestbook_MessageSigned.set(entity);
});
