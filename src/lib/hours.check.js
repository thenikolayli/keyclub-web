// Tiny runnable self-check for the Hours response mapping. No framework.
// Run: node src/lib/hours.check.js
import assert from "node:assert/strict";
import { toHoursView } from "./hours.js";

// Sample payload from the Website Plan.
const sample = {
    name: 'Willian "Will" Badiang',
    all_hours: 710.75,
    term_hours: 250.18,
    grad_year: 2027,
    class: "Junior",
};

const view = toHoursView(sample);

assert.equal(view.name, 'Willian "Will" Badiang');
assert.equal(view.allHours, 710.75);
assert.equal(view.termHours, 250.18);
assert.equal(view.gradYear, 2027);
assert.equal(view.className, "Junior");

console.log("hours.check.js: OK");
