/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import { BuyMeACoffee } from "generated";
import type {
  BuyMeACoffee_CoffeeBought,
  BuyMeACoffee_OwnershipTransferred,
  BuyMeACoffee_Withdrawn,
} from "generated";

BuyMeACoffee.CoffeeBought.handler(async ({ event, context }) => {
  const entity: BuyMeACoffee_CoffeeBought = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    event_id: event.params.id,
    from: event.params.from,
    amount: event.params.amount,
    name: event.params.name,
    message: event.params.message,
    timestamp: event.params.timestamp,
  };

  context.BuyMeACoffee_CoffeeBought.set(entity);
});

BuyMeACoffee.OwnershipTransferred.handler(async ({ event, context }) => {
  const entity: BuyMeACoffee_OwnershipTransferred = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
  };

  context.BuyMeACoffee_OwnershipTransferred.set(entity);
});

BuyMeACoffee.Withdrawn.handler(async ({ event, context }) => {
  const entity: BuyMeACoffee_Withdrawn = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    to: event.params.to,
    amount: event.params.amount,
  };

  context.BuyMeACoffee_Withdrawn.set(entity);
});
