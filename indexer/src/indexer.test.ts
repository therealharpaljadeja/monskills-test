import { describe, it } from "vitest";
import { createTestIndexer, type GuestBook_MessageSigned } from "generated";
import { TestHelpers } from "envio";

describe("GuestBook contract MessageSigned event tests", () => {
  it("GuestBook_MessageSigned is created correctly", async (t) => {
    const indexer = createTestIndexer();

    // Creating mock for GuestBook contract MessageSigned event
    const event = {
      contract: "GuestBook" as const,
      event: "MessageSigned" as const,
      params: {
        signer: TestHelpers.Addresses.defaultAddress,
        message: "default string value",
        timestamp: 0n,
        id: 0n,
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
    let actualGuestBookMessageSigned = await indexer.GuestBook_MessageSigned.getOrThrow("10143_0_0");

    // Creating the expected entity
    const expectedGuestBookMessageSigned: GuestBook_MessageSigned = {
      id: "10143_0_0",
      signer: event.params.signer,
      message: event.params.message,
      timestamp: event.params.timestamp,
      event_id: event.params.id,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    t.expect(actualGuestBookMessageSigned, "Actual GuestBookMessageSigned should be the same as the expected GuestBookMessageSigned").toEqual(expectedGuestBookMessageSigned);
  });
});

describe("Indexer smoke test", () => {
  it("processes the first block with events on chain 10143", async (t) => {
    const indexer = createTestIndexer();

    const result = await indexer.process({ chains: { 10143: {} } });

    t.expect(result.changes.length, "Should have at least one change").toBeGreaterThan(0);
    t.expect(result.changes[0].chainId).toBe(10143);
    t.expect(result.changes[0].eventsProcessed).toBeGreaterThan(0);
  }, 60_000);
});
