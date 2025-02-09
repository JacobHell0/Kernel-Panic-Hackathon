from flask import request

LANG_MAP = {
    "ces": "ces_Latn",  # Czech
    "dan": "dan_Latn",  # Danish
    "nld": "nld_Latn",  # Dutch
    "eng": "eng_Latn",  # English       works
    "est": "est_Latn",  # Estonian
    "fin": "fin_Latn",  # Finnish
    "fra": "fra_Latn",  # French        works
    "deu": "deu_Latn",  # German
    "ell": "ell_Grek",  # Greek
    "ita": "ita_Latn",  # Italian
    "nor": "nor_Latn",  # Norwegian
    "pol": "pol_Latn",  # Polish
    "por": "por_Latn",  # Portuguese
    "slv": "slv_Latn",  # Slovene
    "spa": "spa_Latn",  # Spanish
    "swe": "swe_Latn",  # Swedish
    "tur": "tur_Latn"   # Turkish
}


def json_post(request):
    """This function takes in a request and attempts to parse it as json.
    It also ensures all required fields are passed. Returns a json object with
    a response code."""
    data = request.get_json()
    print(f"data: {data}")

    # Check if required request_type exists before processing it
    if ('text' in data) and ('request_type' in data):
        req_type = data['request_type']

    else: # return user error (400)
        return {'error': 'json request does not contain "text" or ' +
                '"request_type" fields'}, 400

    # Check if the required keys exist for translate
    if req_type == "translate" and \
       ('source_lang' in data) and ('target_lang' in data) :

        # ensure source and target are valid
        if not (data['source_lang'] in LANG_MAP.keys() and \
                data['target_lang'] in LANG_MAP.keys()):
            return {'error': 'source or target is not a 3 letter abbreviation' +
                    ' or in the list of supported languages'}, 400

        response = {
            'text': data['text'],
            'request_type': data['request_type'],
            'source_lang': LANG_MAP[data['source_lang']],
            'target_lang': LANG_MAP[data['target_lang']],
        }
        return response, 200  # Return the dictionary as JSON response with status 200

    # form the summarize dictionary
    elif req_type == "summarize":

        response = {
            'text': data['text'],
            'request_type': data['request_type'],
        }

        return response, 200

    else:
        # If keys are missing, return an error message
        return {'error': 'Invalid JSON data'}, 400
