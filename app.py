from flask import Flask, render_template
import subprocess
import psutil

app = Flask(__name__)

@app.route("/")
def index():
    free_space = subprocess.run(["df", "-h"], capture_output=True)
    return render_template("index.html")


def get_system_stats():
    return {
        "cpu_temp": psutil.sensors_temperatures()["cpu_thermal"][0].current,
        "hdd": psutil.disk_usage("/mnt/disk")._asdict(),
        "sd": psutil.disk_usage("/")._asdict(),
        "cpu_usage": psutil.cpu_percent(percpu=True),
        "ram": psutil.virtual_memory()._asdict()
    }

@app.route("/stats")
def stats():
    return get_system_stats()