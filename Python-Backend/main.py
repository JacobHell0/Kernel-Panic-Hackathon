# from threading import Thread
# from apscheduler.triggers.cron import CronTrigger
from flask import Flask, render_template
from flask_apscheduler import APScheduler
from flask import send_file
import requests
from testing import generate

app = Flask(__name__)

sched = APScheduler()

# Python compiler library: pyinstaller main.py

def uptime_ping():
    """ping to indicate uptime"""
    # print("sending ping")
    # requests.get("https://hc-ping.com/0ed0d044-b9e5-4341-b772-1e0fa7e28654")
    # print("sent ping")

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/generate')
def manual_send_j():
    var = generate("Hello, how are you?")
    return var



sched.add_job(id='job2', func=uptime_ping, trigger='cron', minute='*', timezone='UTC')

sched.start()


if __name__ == '__main__':
    # app.run(debug=True, use_reloader=False, host='0.0.0.0', port=8080)
    app.run(debug=False, use_reloader=False, host='0.0.0.0', port=8080)