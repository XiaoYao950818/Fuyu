import assert from "node:assert/strict";
import test from "node:test";
import { reconcile, switchChanges, withSwitches } from "../../src/features/plugin-kernel/legacySwitches.ts";

const fresh = new Set();

test("before the switch table arrives nothing is switched, mirrored or marked moved", () => {
  const result = reconcile({ mailEnabled: false }, [], null, fresh);
  assert.deepEqual([result.switch, result.mirror, result.migrated], [[], {}, []]);
});

const messages = (config) => [{ id: "messages", kind: "builtin", enabled: true, background: [], config }];
const mail = { plugin: "messages", key: "mail" };

test("a switch kept as a plugin setting reads that setting and only a true or false counts", () => {
  assert.equal(withSwitches({ mailEnabled: true }, messages({ mail: false })).mailEnabled, false);
  assert.equal(withSwitches({ mailEnabled: true }, messages({ mail: "off" })).mailEnabled, true);
  assert.deepEqual(switchChanges({ mailEnabled: true }, { mailEnabled: false }), [[mail, false]]);
});

test("a plugin setting that is not there yet takes the stored value, on or off, and new installs get the default", () => {
  const off = reconcile({ mailEnabled: false }, messages({}), null, new Set());
  assert.deepEqual([off.switch, off.migrated], [[[mail, false]], ["mailEnabled"]]);
  const fresh = reconcile({ mailEnabled: true }, messages({}), null, new Set());
  assert.deepEqual([fresh.switch, fresh.mirror], [[[mail, true]], {}]);
  assert.deepEqual(reconcile({ mailEnabled: true }, [], null, new Set()).switch, []);
});

test("for a plugin setting the side that changed wins: the setting is mirrored, a changed stored value is written", () => {
  const moved = new Set(["mailEnabled"]);
  assert.deepEqual(reconcile({ mailEnabled: true }, messages({ mail: false }), null, moved).mirror, { mailEnabled: false });
  const seen = { stored: { mailEnabled: true }, switched: { mailEnabled: true } };
  assert.deepEqual(reconcile({ mailEnabled: false }, messages({ mail: true }), seen, moved).switch, [[mail, false]]);
});
