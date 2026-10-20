# Simulation

## Scope

The simulation runs locally against the XSS target service defined in
[`lab.yaml`](../lab.yaml). The Docker service uses an isolated network and
does not require external network access.

## Modes

### Vulnerable mode

The vulnerable path demonstrates what can happen when submitted content is
returned or rendered without the required encoding. Use only the harmless
payload supplied by the lab:

```html
<script>alert('XSS Demonstration')</script>
```

The expected result is a browser-side demonstration event, not access to
credentials, cookies, files, or another system.

### Secure mode

The secure path applies safe rendering or output encoding. The same input is
displayed as text rather than interpreted as executable markup. This confirms
that the mitigation protects the output context instead of relying on the
payload being recognized.

## Suggested Observation Table

| Observation | Vulnerable mode | Secure mode |
| --- | --- | --- |
| Input accepted | Yes | Yes |
| Input treated as markup | Yes, for demonstration | No |
| Browser-side demonstration | Expected | Not expected |
| User data displayed safely | No | Yes |
| Activity logged | Yes | Yes |

## Safety Rules

Perform the exercise only on the local lab instance. Do not use payloads for
credential theft, cookie or session hijacking, persistence, data exfiltration,
LAN scanning, or external network requests. Stop and reset the lab after the
exercise.
