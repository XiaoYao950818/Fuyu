import assert from "node:assert/strict";
import test from "node:test";
import { dispatchLocalApiRequest } from "../../src/features/island-bridge/dispatch.ts";

test("dispatch finds handlers by own name and turns throws into 500", async () => {
  const handlers = {
    "todos.list": () => ({ ok: true, data: 1 }),
    "todos.add": async () => ({ ok: true, data: 2 }),
    broken: () => {
      throw new Error("boom");
    },
  };
  assert.deepEqual(await dispatchLocalApiRequest(handlers, "todos.list", null), { ok: true, data: 1 });
  assert.deepEqual(await dispatchLocalApiRequest(handlers, "todos.add", null), { ok: true, data: 2 });
  assert.deepEqual(await dispatchLocalApiRequest(handlers, "broken", null), { ok: false, status: 500, error: "boom" });
  assert.equal((await dispatchLocalApiRequest(handlers, "toString", null)).status, 404);
  assert.equal((await dispatchLocalApiRequest(handlers, "missing", null)).status, 404);
});
