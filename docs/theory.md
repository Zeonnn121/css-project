# Theory

## What is XSS?

Cross-Site Scripting (XSS) is a vulnerability in which attacker-controlled
input is interpreted as active content by a user's browser. The application
does not keep data and code separate, so markup or script supplied as data can
change the page or execute in the browser's security context.

## How XSS Happens

The common data flow is:

```text
Untrusted input -> application -> unsafe rendering -> browser parsing -> script execution
```

XSS generally requires a controllable input and an unsafe output context. The
browser is not able to determine whether markup came from a trusted developer
or from an attacker; the application must make that distinction through safe
rendering.

## Main Types

| Type | Description | Typical delivery |
| --- | --- | --- |
| Reflected XSS | Input is returned immediately in a response. | Query parameter or form submission |
| Stored XSS | Input is saved and later shown to other users. | Comment, profile, or message |
| DOM-based XSS | Client-side code places input into an unsafe DOM sink. | URL fragment or browser storage |

## Prevention

- Encode output for the context in which it is inserted.
- Prefer text rendering and safe DOM APIs such as `textContent`.
- Validate input using an allowlist where the application has a known format.
- Sanitize HTML only when a feature genuinely requires user-authored markup.
- Add a restrictive Content Security Policy as defense in depth.
- Avoid unsafe sinks such as untrusted `innerHTML` assignments and equivalent
  raw-HTML rendering APIs.

The lab intentionally presents vulnerable and secure paths side by side so
that the effect of these controls can be observed without connecting to an
external network.
