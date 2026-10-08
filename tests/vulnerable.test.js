import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import axios from 'axios';

const TARGET_URL = 'http://localhost:3000';

describe('XSS Lab - Vulnerable Endpoint', () => {
  it('should accept and store comments without encoding', async () => {
    const response = await axios.post(`${TARGET_URL}/api/vulnerable/submit`, {
      username: 'TestUser',
      comment: 'Normal comment'
    });

    expect(response.status).toBe(200);
    expect(response.data.mode).toBe('vulnerable');
    expect(response.data.success).toBe(true);
  });

  it('should allow XSS payload in vulnerable mode', async () => {
    const payload = '<script>alert("XSS")</script>';
    const response = await axios.post(`${TARGET_URL}/api/vulnerable/submit`, {
      username: 'Attacker',
      comment: payload
    });

    expect(response.status).toBe(200);
    expect(response.data.entry.comment).toBe(payload);
    expect(response.data.mode).toBe('vulnerable');
  });
});

describe('XSS Lab - Secure Endpoint', () => {
  it('should encode special characters in secure mode', async () => {
    const payload = '<script>alert("XSS")</script>';
    const response = await axios.post(`${TARGET_URL}/api/secure/submit`, {
      username: 'SecureUser',
      comment: payload
    });

    expect(response.status).toBe(200);
    expect(response.data.mode).toBe('secure');
    // Check that encoding occurred
    expect(response.data.entry.comment).toContain('&lt;');
    expect(response.data.entry.comment).toContain('&gt;');
  });
});

describe('XSS Lab - API Health', () => {
  it('should return health status', async () => {
    const response = await axios.get(`${TARGET_URL}/api/health`);

    expect(response.status).toBe(200);
    expect(response.data.status).toBe('healthy');
  });
});
