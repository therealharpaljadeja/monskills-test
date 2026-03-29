import { BuyMeACoffee } from "generated";

BuyMeACoffee.NewMemo.handler(async ({ event, context }) => {
  const memoId = `${event.transaction.hash}-${event.logIndex}`;

  context.Memo.set({
    id: memoId,
    sender: event.params.from,
    timestamp: event.params.timestamp,
    name: event.params.name,
    message: event.params.message,
    amount: event.params.amount,
    blockNumber: event.block.number,
    transactionHash: event.transaction.hash,
  });
});
