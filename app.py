import argparse
from typing import IO
from flask import Flask, render_template
import psutil
import datetime
from flask_apscheduler import APScheduler
from collections import namedtuple
import pickle
import os


DataPoint = namedtuple("DataPoint", ['cpu_temp', 'cpu_usage', 'ram_usage'])

app = Flask(__name__)
scheduler = APScheduler()
scheduler.api_enabled = True
scheduler.init_app(app)


data_log = {}
MEMORY_LOG_SIZE: int = 60
MAX_FILE_RECORD_SIZE: int = 10080
LOG_FILE: str = 'data_log.bin'

@scheduler.task('interval', id='monitor', minutes=1, misfire_grace_time=20)
def monitor() -> None:
    stats = get_cpu_stats()
    cpu_temp: float = stats["cpu_temp"]
    cpu_usage: float = sum(stats["cpu_usage"])/len(stats["cpu_usage"])
    ram_usage: int = stats["ram"]["available"]
    timestamp = datetime.datetime.now().timestamp() * 1000
    data_log[timestamp] = DataPoint(cpu_temp=cpu_temp, cpu_usage=cpu_usage, ram_usage=ram_usage)

    if len(data_log) > MEMORY_LOG_SIZE:
        dump_data()

def get_stored_data(file: IO[bytes]) -> dict:
    try:
        return pickle.load(file)
    except EOFError:
        return {}

def move_log() -> None:
    new_name = "logs/" + datetime.datetime.now().strftime("%Y-%W") + ".log"
    os.rename(LOG_FILE, new_name)
    open(LOG_FILE, 'a').close()
    
def dump_data() -> None:
    open(LOG_FILE, 'a').close()
    with open(LOG_FILE, 'rb') as log_file, open(LOG_FILE + ".tmp", "wb") as log_file_write:
        prev_data: dict = get_stored_data(log_file)
        if (len_sum := len(prev_data)) > MAX_FILE_RECORD_SIZE:
            prev_data.clear()
            move_log()
        prev_data.update(data_log)
        pickle.dump(prev_data, log_file_write, pickle.HIGHEST_PROTOCOL)
        os.rename(LOG_FILE + ".tmp", LOG_FILE)
        data_log.clear()


scheduler.start()

@app.route("/")
def index():
    return render_template("index.html")


def get_system_stats() -> dict:
    return {
        **get_storage_stats(),
        **get_cpu_stats(),
        **get_uptime()
    }

def get_cpu_stats() -> dict:
    return {
        "cpu_temp": psutil.sensors_temperatures()["cpu_thermal"][0].current,
        "cpu_usage": psutil.cpu_percent(percpu=True),
        "ram": psutil.virtual_memory()._asdict()
    }

def get_storage_stats() -> dict:
    return {
        "hdd": psutil.disk_usage("/mnt/disk")._asdict(),
        "sd": psutil.disk_usage("/")._asdict()
    }

def get_uptime() -> dict:
    boot_time = psutil.boot_time()
    delta = datetime.datetime.now().timestamp() - boot_time
    y, r = divmod(delta, 60*60*24*365)
    d, r = divmod(r, 60*60*24)
    h, r = divmod(r, 60*60)
    m, r = divmod(r, 60)
    vals = [y,d,h,m]
    return {"uptime": list(map(round, vals))}

def get_history() -> dict:
    with open(LOG_FILE, 'rb') as log_file:
        file_data: dict = get_stored_data(log_file)
        file_data.update(data_log)
        return file_data


@app.route("/stats")
@app.route("/stats/<sub_stats>")
def stats(sub_stats=''):
    match sub_stats:
        case "cpu":
            return get_cpu_stats()
        case "storage":
            return get_storage_stats()
        case "uptime":
            return get_uptime()
        case _:
            return get_system_stats()

@app.route("/history")
def history():
    return get_history()

def get_args():
    parser = argparse.ArgumentParser(description="Run the system monitor web server", add_help=False)
    parser.add_argument("-h", "--host", metavar="<hostname|ip>", type=str, default="0.0.0.0", help="The interface to bind to. Default 0.0.0.0")
    parser.add_argument("-p", "--port", metavar="<port>", type=int, default="5000", help="The port to bind to. Default 5000")
    parser.add_argument("-d", "--debug", action="store_true", help="Start in debug mode.")
    parser.add_argument("--help", action="store_true", help="show this help message and exit")

    p = parser.parse_args()

    if p.help:
        parser.print_help()
        parser.exit()

    return p

if __name__ == '__main__':
    args = get_args()
 
    app.run(host=args.host, port=args.port,debug=args.debug)
