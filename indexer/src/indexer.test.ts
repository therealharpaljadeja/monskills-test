import { describe, it } from "vitest";
import { createTestIndexer, type GuestbookEntry } from "generated";
import { TestHelpers } from "envio";

describe("Guestbook contract Signed event tests", () => {
  it("GuestbookEntry is created correctly", async (t) => {
    const indexer = createTestIndexer();

    const event = {
      contract: "Guestbook" as const,
      event: "Signed" as const,
      params: {
        id: 1n,
        signer: TestHelpers.Addresses.defaultAddress,
        message: "gm monad",
        timestamp: 1_700_000_000n,
      },
    };

    await indexer.process({
      chains: {
        10143: {
          simulate: [event],
        },
      },
    });

    const actual = await indexer.GuestbookEntry.getOrThrow("10143_0_0");

    t.expect(actual.entryId).toBe(1n);
    t.expect(actual.signer).toBe(TestHelpers.Addresses.defaultAddress);
    t.expect(actual.message).toBe("gm monad");
    t.expect(actual.timestamp).toBe(1_700_000_000n);
  });
});
