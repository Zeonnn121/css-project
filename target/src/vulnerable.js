import { logger } from './logger.js';

/**
 * INTENTIONALLY VULNERABLE
 * This endpoint demonstrates unsafe HTML rendering.
 * Used ONLY for educational purposes in an isolated lab.
 */
export function vulnerableRoute(req, res) {
  const { username, comment } = req.body;

  if (!username || !comment) {
    logger.log('warning', 'Missing username or comment');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // VULNERABLE: Direct string concatenation, no encoding
  // This intentionally allows HTML/JS injection for educational demonstration
  const entry = {
    id: Date.now(),
    username: username,
    comment: comment,  // No encoding - will render as-is
    timestamp: new Date().toISOString(),
    mode: 'vulnerable',
    htmlContent: `<div class="comment"><strong>${username}</strong>: ${comment}</div>`
  };

  global.comments = global.comments || [];
  global.comments.push(entry);

  logger.log('success', `Vulnerable submission: ${username} (${comment.substring(0, 30)}...)`);

  res.json({
    success: true,
    entry: entry,
    mode: 'vulnerable',
    message: 'Comment submitted (VULNERABLE - no encoding)'
  });
}
