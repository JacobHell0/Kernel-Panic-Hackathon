# Python Packages
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from flask_apscheduler import APScheduler

# Scheduler
import requests

# Model Loading
from translation_model import TranslatorModel
from summarize_model import SummarizeModel

# Helper functions
from json_post import json_post

# init app and enable CORS
app = Flask(__name__)
CORS(app)


# uptime tracker -------------------------------------------------------
def uptime_ping():
    """pings healthcheck.io to indicate uptime"""

    requests.get("https://hc-ping.com/b49a4271-be37-4854-9d0d-03c421b76aee")

sched = APScheduler()
sched.add_job(id='job', func=uptime_ping, trigger='cron', minute='*', timezone='UTC')
sched.start()

# -----------------------------------------------------------------------------

# root directory, helpful for checking if the backend is running
@app.route('/')
def home():
    return render_template('index.html')

# quick test of the translator
@app.route('/generate')
def manual_send_j():
    translation = TranslatorModel()
    var = translation.generate("Hello, how are you?")
    return var


# Main API endpoint
@app.route('/json_post', methods=['POST'])
def handle_post_request():
    try:
        # parse json data
        data, response_type = json_post(request)
        if response_type == 400: return data, 400

        # handle translate
        if data["request_type"] == "translate":

            # initialize translator
            translator = TranslatorModel()
            result = translator.generate(data["text"], src_lang=data["source_lang"], tgt_lang=data["target_lang"])
            print("-- successfully translated, returning post now --")
            return jsonify({"text": f"{result}", "request_type": "translate"}), 200

        elif data["request_type"] == "summarize":
            summarizer = SummarizeModel()
            summary = summarizer.summarize(data["text"])
            print("-- successfully summarized, returning post now --")
            return jsonify({"text": f"{summary}", "request_type": "summarize"}), 200

        else:
            return jsonify("request_type not found"), 400

    except:
        return jsonify("program crashed, internal error in json_post function"), 500


if __name__ == '__main__':
    app.run(debug=False, use_reloader=False, host='0.0.0.0', port=8080)