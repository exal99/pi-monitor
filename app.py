from flask import Flask, render_template, url_for
import subprocess
import psutil

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")


def get_system_stats():
    return {
        **get_storage_stats(),
        **get_cpu_stats()
    }

def get_cpu_stats():
    return {
        "cpu_temp": psutil.sensors_temperatures()["cpu_thermal"][0].current,
        "cpu_usage": psutil.cpu_percent(percpu=True),
        "ram": psutil.virtual_memory()._asdict()
    }

def get_storage_stats():
    return {
        "hdd": psutil.disk_usage("/mnt/disk")._asdict(),
        "sd": psutil.disk_usage("/")._asdict()
    }


@app.route("/stats")
@app.route("/stats/<sub_stats>")
def stats(sub_stats=''):
    match sub_stats:
        case "cpu":
            return get_cpu_stats()
        case "storage":
            return get_storage_stats()
        case _:
            return get_system_stats()
    return get_system_stats()

