import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_SETTINGS } from "../../src/lib/settings/settings.ts";
import { MODULES, NO_ANSWER, PERSONAS, enabledModules, modulesFor, personaModules, takenOff, togglePersona, withModules } from "../../src/windows/onboarding/personas.ts";

test("each answer picks its own set, and several answers take every module any of them uses", () => {
  assert.deepEqual([...modulesFor(["fun"])].sort(), ["music", "shelf"]);
  assert.ok(modulesFor(["code"]).has("screenshot"));
  assert.ok(modulesFor(["code"]).has("clipboard"));
  assert.ok(!modulesFor(["office"]).has("music"));
  const both = modulesFor(["code", "fun"]);
  assert.ok(both.has("screenshot") && both.has("music"));
  assert.equal(modulesFor([]).size, 0);
});

test("the island gets exactly the modules chosen; clipboard history is not in its settings", () => {
  const settings = withModules(DEFAULT_SETTINGS, new Set(["music", "screenshot", "clipboard"]));
  assert.equal(settings.musicEnabled, true);
  assert.equal(settings.screenshotEnabled, true);
  assert.equal(settings.shelfEnabled, false);
  assert.equal(settings.mailEnabled, false);
  assert.equal("clipboardEnabled" in settings, false);
  assert.equal(settings.opacity, DEFAULT_SETTINGS.opacity, "other settings are kept");
});

test("an answer swaps in its set and remembers what was on, so taking every answer back restores it", () => {
  const before = new Set(["music", "shelf", "mail", "clipboard"]);
  const fun = togglePersona(NO_ANSWER, "fun", before);
  assert.deepEqual([...fun.modules].sort(), ["music", "shelf"]);
  assert.deepEqual(takenOff(fun.answer, fun.modules), ["mail", "clipboard"]);

  const both = togglePersona(fun.answer, "code", fun.modules);
  assert.deepEqual(both.answer.personas, ["fun", "code"]);
  assert.deepEqual(takenOff(both.answer, both.modules), ["mail"]);
  assert.deepEqual(takenOff(both.answer, new Set([...both.modules, "mail"])), [], "a sticker put back is no longer listed");

  const code = togglePersona(both.answer, "fun", both.modules);
  const none = togglePersona(code.answer, "code", code.modules);
  assert.deepEqual(none.answer, NO_ANSWER);
  assert.deepEqual(none.modules, before);
  assert.deepEqual(takenOff(none.answer, none.modules), []);
});

test("what a persona card lists is exactly what it puts on", () => {
  for (const persona of PERSONAS) {
    assert.deepEqual([...modulesFor([persona])].sort(), [...personaModules(persona)].sort());
  }
});

test("the modules on now are read back the same way", () => {
  const chosen = new Set(["music", "clipboard"]);
  assert.deepEqual(enabledModules(withModules(DEFAULT_SETTINGS, chosen), true), chosen);
  assert.ok(!enabledModules(withModules(DEFAULT_SETTINGS, chosen), false).has("clipboard"));
  assert.equal(enabledModules(withModules(DEFAULT_SETTINGS, new Set(MODULES)), true).size, MODULES.length);
});
