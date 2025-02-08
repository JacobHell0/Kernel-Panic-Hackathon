# Flask Server JSON POST Handler

This document explains how the Flask server processes POST requests with JSON data, specifically handling translations based on language codes.

## Overview

The `json_post` function handles POST requests to the server. It expects the request to contain a JSON payload with certain required fields and validates the language codes.

### Required JSON Keys:
- `text`: The content to be translated or processed.
- `request_type`: Type of the request.
- `source_lang`: Source language code (must be a valid 3-letter abbreviation).
- `target_lang`: Target language code (must be a valid 3-letter abbreviation).

### Supported Language Codes
The following 3-letter language codes are supported:

- **ces**: Czech
- **dan**: Danish
- **nld**: Dutch
- **eng**: English
- **est**: Estonian
- **fin**: Finnish
- **fra**: French
- **deu**: German
- **ell**: Greek
- **ita**: Italian
- **nor**: Norwegian
- **pol**: Polish
- **por**: Portuguese
- **slv**: Slovene
- **spa**: Spanish
- **swe**: Swedish
- **tur**: Turkish

These codes are mapped to language names (e.g., `"eng": "eng_Latn"` for English, `"fra": "fra_Latn"` for French).

## How to Post Data

1. **Prepare your request**:
   Ensure you send a JSON payload with the required keys (`text`, `request_type`, `source_lang`, `target_lang`).

   Example JSON payload:
   ```json
   {
     "text": "Hello",
     "request_type": "translate",
     "source_lang": "eng",
     "target_lang": "fra"
   }
