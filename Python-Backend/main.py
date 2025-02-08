# from threading import Thread
# from apscheduler.triggers.cron import CronTrigger
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from flask_apscheduler import APScheduler



from translation_model import TranslatorModel

# load json handler
from json_post import json_post


app = Flask(__name__)
CORS(app)




# uptime tracker TODO -------------------------------------------------------
def uptime_ping():
    """ping to indicate uptime"""
    # print("sending ping")
    # requests.get("https://hc-ping.com/0ed0d044-b9e5-4341-b772-1e0fa7e28654")
    # print("sent ping")

sched = APScheduler()
sched.add_job(id='job2', func=uptime_ping, trigger='cron', minute='*', timezone='UTC')
sched.start()

# -----------------------------------------------------------------------------

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/generate')
def manual_send_j():
    translation = TranslatorModel()

    var = translation.generate("Hello, how are you?")
    return var

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
        else:
            return jsonify("request_type not found"), 400

    except:
        return jsonify("program crashed, internal error in json_post function"), 500


if __name__ == '__main__':
    # app.run(debug=True, use_reloader=False, host='0.0.0.0', port=8080)
    app.run(debug=False, use_reloader=False, host='0.0.0.0', port=8080)