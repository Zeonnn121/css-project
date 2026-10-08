import { logger } from './logger.js';

/**
 * SECURE IMPLEMENTATION
 * This endpoint demonstrates safe HTML encoding.
 * Escapes user input to prevent XSS.
 */

function escapeHtml(text) {
  // Server-side escape (no DOM available in Node.js)
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function secureRoute(req, res) {
  const { username, comment } = req.body;

  if (!username || !comment) {
    logger.log('warning', 'Missing username or comment in secure mode');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // SECURE: HTML entities are escaped
  const escapedUsername = escapeHtml(username);
  const escapedComment = escapeHtml(comment);

  const entry = {
    id: Date.now(),
    username: escapedUsername,
    comment: escapedComment,
    timestamp: new Date().toISOString(),
    mode: 'secure',
    htmlContent: `<div class="comment"><strong>${escapedUsername}</strong>: ${escapedComment}</div>`
  };

  global.comments = global.comments || [];
  global.comments.push(entry);

  logger.log('success', `Secure submission: ${username} (escaped and safe)`);

  res.json({
    success: true,
    entry: entry,
    mode: 'secure',
    message: 'Comment submitted securely (output encoded)'
  });
}
