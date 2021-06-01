from flask import Flask, render_template, url_for
import psutil
import datetime

app = Flask(__name__)

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
