// Behavioral checks without a browser: no requests to WhatsApp or analytics.
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const element = (dataset = {}) => {
  const listeners = {}, attrs = {}, classes = new Set();
  return {dataset, listeners, attrs, value: '', hidden: true,
    classList: {add: x => classes.add(x), remove: x => classes.delete(x), contains: x => classes.has(x), toggle: (x, on) => on ? classes.add(x) : classes.delete(x)},
    addEventListener: (event, handler) => { listeners[event] = handler; },
    setAttribute: (k, v) => { attrs[k] = v; }, removeAttribute: k => delete attrs[k],
    focus() { this.focused = true; }, closest: () => null,
    querySelectorAll: () => [], getAttribute: k => attrs[k]
  };
};
const burger = element(), nav = element(), status = element(), fallback = element(), hdr = element(), dock = element();
const form = element({cta: 'form'}), name = element();
form.elements = {nome: name, studio: {selectedOptions: [{dataset: {location: 'qualiano'}}]}};
const events = [], opened = [];
const values = {sport: 'corsa', obiettivo: 'Performance', studio: 'Qualiano', msg: 'test privato'};
const document = {
  body: element(),
  querySelector: s => ({'.burger': burger, '.header': hdr, '.dock': dock}[s] || null),
  querySelectorAll: () => [],
  getElementById: id => ({nav, 'wa-form': form, 'form-status': status, 'form-fallback': fallback}[id] || null),
  listeners: {}, addEventListener(event, handler) { this.listeners[event] = handler; },
  dispatchEvent: e => events.push(e.detail)
};
const context = {
  document, location: {pathname: '/'}, scrollY: 0,
  matchMedia: () => ({matches: true, addEventListener() {}}),
  CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
  FormData: class { get(k) { return values[k]; } },
  window: {open: (...args) => opened.push(args)}, addEventListener() {}, setTimeout() {}
};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../main.js'), 'utf8'), context);
assert.equal(nav.inert, true);
burger.listeners.click();
assert.equal(nav.inert, false);
assert.equal(burger.attrs['aria-expanded'], 'true');
document.listeners.keydown({key: 'Escape'});
assert.equal(nav.inert, true);
assert.equal(burger.focused, true);
form.listeners.submit({preventDefault() {}});
assert.equal(name.attrs['aria-invalid'], 'true');
assert.equal(opened.length, 0);
name.value = 'Nome di prova';
form.listeners.submit({preventDefault() {}});
assert.equal(opened.length, 1);
assert.equal(fallback.hidden, false);
assert.ok(decodeURIComponent(opened[0][0]).includes('Nome di prova'));
assert.ok(decodeURIComponent(opened[0][0]).includes('Qualiano'));
assert.equal(events.filter(e => e.event === 'contact_form_submit').length, 1);
assert.equal(events[0].location, 'qualiano');
assert.ok(!JSON.stringify(events).includes('Nome di prova'));
assert.ok(!JSON.stringify(events).includes('test privato'));
form.listeners.submit({preventDefault() {}});
assert.equal(opened.length, 1, 'Suppress double submission');
assert.equal(dock.inert, true);
console.log('PASS: mobile menu, Escape/focus, validation, WhatsApp encoding, double submit and PII-free conversion payloads.');
