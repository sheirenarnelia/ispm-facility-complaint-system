const test = require('node:test');
const assert = require('node:assert');
const app = require('../server');

let server;
let port;
let baseUrl;

test.before(async () => {
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  return new Promise((resolve) => {
    server.close(resolve);
  });
});

test('GET /api/health should return status healthy', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'healthy');
  assert.strictEqual(data.version, '1.0.0 (Sprint 1 Prototype)');
});

test('GET /api/complaints should return complaints list', async () => {
  const res = await fetch(`${baseUrl}/api/complaints`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.ok(Array.isArray(data.data));
  assert.ok(data.data.length > 0);
});

test('GET /api/complaints/stats/summary should return dashboard metrics', async () => {
  const res = await fetch(`${baseUrl}/api/complaints/stats/summary`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.ok(typeof data.data.total === 'number');
  assert.ok(typeof data.data.submitted === 'number');
  assert.ok(typeof data.data.inProgress === 'number');
  assert.ok(typeof data.data.resolved === 'number');
});

test('POST /api/complaints should create a new complaint record', async () => {
  const payload = {
    reporterName: 'Test Student Automated',
    reporterEmail: 'test.student@president.ac.id',
    building: 'Building B (Integrated Laboratories)',
    room: 'Network Lab B-201',
    category: 'Electricity & Air Conditioning',
    priority: 'Urgent',
    description: 'Automated test complaint for CI/CD pipeline verification.'
  };

  const res = await fetch(`${baseUrl}/api/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  assert.strictEqual(res.status, 201);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.data.reporterName, payload.reporterName);
  assert.strictEqual(data.data.status, 'Submitted');
  assert.ok(data.data.id.startsWith('FAC-2026-'));
});

test('PATCH /api/complaints/:id/status should update status to In Progress', async () => {
  const res = await fetch(`${baseUrl}/api/complaints/FAC-2026-001/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'In Progress',
      staffNotes: 'Technician dispatched on-site for hardware inspection.'
    })
  });

  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.data.status, 'In Progress');
});
