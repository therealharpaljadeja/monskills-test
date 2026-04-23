import { describe, it } from "vitest";
import { createTestIndexer, type Guestbook_Signed } from "generated";
import { TestHelpers } from "envio";

describe("Guestbook contract Signed event tests", () => {
  it("Guestbook_Signed is created correctly", async (t) => {
    const indexer = createTestIndexer();

    // Creating mock for Guestbook contract Signed event
    const event = {
      contract: "Guestbook" as const,
      event: "Signed" as const,
      params: {
        id: 0n,
        signer: TestHelpers.Addresses.defaultAddress,
        timestamp: 0n,
        message: "default string value",
      },
    };

    await indexer.process({
      chains: {
        10143: {
          simulate: [event],
        },
      },
    });

    // Getting the actual entity from the test indexer
    let actualGuestbookSigned = await indexer.Guestbook_Signed.getOrThrow("10143_0_0");

    // Creating the expected entity
    const expectedGuestbookSigned: Guestbook_Signed = {
      id: "10143_0_0",
      event_id: event.params.id,
      signer: event.params.signer,
      timestamp: event.params.timestamp,
      message: event.params.message,
      blockNumber: 0n,
      txHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    t.expect(actualGuestbookSigned, "Actual GuestbookSigned should be the same as the expected GuestbookSigned").toEqual(expectedGuestbookSigned);
  });
});

describe("Indexer smoke test", () => {
  it("processes the first block with events on chain 10143", async (t) => {
    const indexer = createTestIndexer();

    const result = await indexer.process({ chains: { 10143: {} } });

    t.expect(result.changes.length, "Should have at least one change").toBeGreaterThan(0);
    const first = result.changes[0]!;
    t.expect(first.chainId).toBe(10143);
    t.expect(first.eventsProcessed).toBeGreaterThan(0);
  }, 60_000);
});
