import { describe, it } from "vitest";
import { createTestIndexer, type Guestbook_MessageSigned } from "generated";
import { TestHelpers } from "envio";

describe("Guestbook contract MessageSigned event tests", () => {
  it("Guestbook_MessageSigned is created correctly", async (t) => {
    const indexer = createTestIndexer();

    // Creating mock for Guestbook contract MessageSigned event
    const event = {
      contract: "Guestbook" as const,
      event: "MessageSigned" as const,
      params: {
        id: 0n,
        signer: TestHelpers.Addresses.defaultAddress,
        message: "default string value",
        timestamp: 0n,
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
    let actualGuestbookMessageSigned = await indexer.Guestbook_MessageSigned.getOrThrow("10143_0_0");

    // Creating the expected entity
    const expectedGuestbookMessageSigned: Guestbook_MessageSigned = {
      id: "10143_0_0",
      event_id: event.params.id,
      signer: event.params.signer,
      message: event.params.message,
      timestamp: event.params.timestamp,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    t.expect(actualGuestbookMessageSigned, "Actual GuestbookMessageSigned should be the same as the expected GuestbookMessageSigned").toEqual(expectedGuestbookMessageSigned);
  });
});

describe("Indexer smoke test", () => {
  it("processes the first block with events on chain 10143", async (t) => {
    const indexer = createTestIndexer();

    const result = await indexer.process({ chains: { 10143: {} } });

    t.expect(result.changes.length, "Should have at least one change").toBeGreaterThan(0);
    t.expect(result.changes[0]!.chainId).toBe(10143);
    t.expect(result.changes[0]!.eventsProcessed).toBeGreaterThan(0);
  }, 60_000);
});
