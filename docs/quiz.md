# Quiz

Complete the assessment in the application after reviewing the theory and
running the simulation. The questions should test understanding rather than
memorization.

## Questions

1. What is Cross-Site Scripting, and where does the injected code execute?
2. How does reflected XSS differ from stored XSS?
3. What makes DOM-based XSS different from a server-reflected response?
4. Why is output encoding performed at the point where data is rendered?
5. Why should user-controlled data not be assigned to `innerHTML`?
6. How does using `textContent` change the browser's interpretation of input?
7. What role does Content Security Policy play in a defense-in-depth strategy?
8. Why is a database value still untrusted even if it came from the
   application?
9. What difference should be observed when the lab uses the same input in
   vulnerable and secure modes?
10. Why must this exercise remain isolated from external networks?

## Review Guidance

A complete answer should identify the trust boundary, explain the browser's
parsing behavior, and name an appropriate mitigation. Use
[`docs/viva.md`](./viva.md) for expanded questions and answers, and complete
the in-application assessment for scoring.
