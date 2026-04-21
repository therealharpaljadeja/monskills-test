/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import { GuestBook } from "generated";
import type {
  GuestBook_MessageSigned,
} from "generated";

GuestBook.MessageSigned.handler(async ({ event, context }) => {
  const entity: GuestBook_MessageSigned = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    signer: event.params.signer,
    message: event.params.message,
    timestamp: event.params.timestamp,
    event_id: event.params.id,
  };

  context.GuestBook_MessageSigned.set(entity);
});
