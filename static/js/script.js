import * as adminlte from 'admin-lte';
import $ from 'jquery';

/*import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const BACKGROUND_COLOR = "#363636";
const FONT_COLOR = "#FEFEFE";
const COLORS = ["#BC6C25", "#708B75", "#DDA15E", ]
function piChartOptions(deg_cutout, title) {
    return {
        circumference: 360 - deg_cutout,
        rotation: -180 + deg_cutout/2,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (item) => `${item.label}: ${autoConvertBytes(item.raw).join(" ")}`
                }
            },
            title:{
                display: true,
                text: title,
                color: FONT_COLOR
            },
            legend: {
                labels:{
                    color: FONT_COLOR
                }
            }
        },
        
    }
}

function makePiChart(canvas, datasetName) {
    return new Chart(canvas, {
        type: 'doughnut',
        options: piChartOptions(120, datasetName),
        data: {
            labels: [],
            datasets: [{
                label: datasetName,
                data: [],
                backgroundColor: [],
            }],
            
        },
        
    });
}

function round(num, precision = 0) {
    return Math.floor(num * Math.pow(10, precision) + 0.5)/Math.pow(10, precision);
}

function convertPrefix(num, prefix, precision = 0) {
    return round(round(num, -(prefix - precision)) / Math.pow(10, prefix), precision);
}

function autoConvertBytes(bytes) {
    const prefixes = [[12, "TB"], [9, "GB"], [6, "MB"], [3, "KB"]];

    for (const prefix of prefixes) {
        if (bytes > Math.pow(10, prefix[0])) {
            return [convertPrefix(bytes, prefix[0], 2), prefix[1]];
        }
    }

    return [bytes, "bytes"];
}

function updateRAMChart(chart, data) {
    let used = data["ram"]["total"] - data["ram"]["available"];
    let available = data["ram"]["available"];
    chart.data.datasets[0].data = [used, available];

    chart.update()

}

function updateDiskSpace(chart, data) {
    chart.data.datasets[0].data = [data["hdd"]["used"], data["hdd"]["free"]];
    chart.update()
}


function updateSdSpace(chart, data) {
    chart.data.datasets[0].data = [data["sd"]["used"], data["sd"]["free"]];
    chart.update()
}

function updateData(updateFunctions) {
    fetch("/stats")
        .then(response => response.json())
        .then(data => updateFunctions.forEach(func => func(data)));
}

let ramCanvas  = document.getElementById("ramChart");
let diskCanvas = document.getElementById("diskChart");
let sdCanvas   = document.getElementById("sdChart");

let ramChart  = makePiChart(ramCanvas,  "RAM Usage");
let diskChart = makePiChart(diskCanvas, "HDD Space");
let sdChart   = makePiChart(sdCanvas,   "SD-Card Space");

ramChart.data.labels = ["Used", "Available"];
ramChart.data.datasets[0].backgroundColor = [COLORS[0], COLORS[1]];
diskChart.data.labels = ["Used", "Available"];
diskChart.data.datasets[0].backgroundColor = [COLORS[0], COLORS[1]];
sdChart.data.labels = ["Used", "Available"];
sdChart.data.datasets[0].backgroundColor = [COLORS[0], COLORS[1]];

const updateFunctions = [
    (data) => updateRAMChart(ramChart, data),
    (data) => updateDiskSpace(diskChart, data),
    (data) => updateSdSpace(sdChart, data),
]
*/

const zip = (a,b) => a.map((k, i) => [k, b[i]]);

function round(num, precision = 0) {
    return Math.floor(num * Math.pow(10, precision) + 0.5)/Math.pow(10, precision);
}

function convertPrefix(num, prefix, precision = 0) {
    return round(round(num, -(prefix - precision)) / Math.pow(10, prefix), precision);
}

function autoConvertBytes(bytes) {
    const prefixes = [[12, "TB"], [9, "GB"], [6, "MB"], [3, "KB"]];

    for (const prefix of prefixes) {
        if (bytes > Math.pow(10, prefix[0])) {
            return [convertPrefix(bytes, prefix[0], 2), prefix[1]];
        }
    }

    return [bytes, "bytes"];
}

function updateData(updateFunctions, fetchUrl="/stats") {
    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => updateFunctions.forEach(func => func(data)));
}

function updateTextElements(data) {
    const dataToId = {
        "cpu_temp": [(x) => `${round(x,1)} &deg;C`, "#cpu-temp"],
        "cpu_usage": [(x) => `${round(x.reduce((a,b) => a + b, 0) / x.length, 1)} %`, "#cpu-usage"],
        "ram": [(x) => `${x.percent} %`, "#ram-usage"],
        "hdd": [(x) => autoConvertBytes(x.free).join(" "), "#disk-free"],
        "sd": [(x) => autoConvertBytes(x.free).join(" "), "#sd-free"],
        "uptime": [(x) => {
            const units = ["y", "d", "h", "m"];
            let striped = x.join(",").replace(/^(0,)+/g, '').split(',');

            let ret = [];
            for (const [time, unit] of zip(striped.reverse(), units.reverse())) {
                ret.push(time + unit);
            }

            return ret.reverse().join(":");

        }, "#uptime"]
    }

    const dataToProgress = {
        "cpu_usage": [(x) => `${round(x.reduce((a,b) => a + b, 0) / x.length, 1)}%`, "#cpu-progress"],
        "ram": [(x) => `${x.percent}%`, "#ram-progress"],
        "hdd": [(x) => `${x.percent}%`, "#disk-progress"],
        "sd": [(x) => `${x.percent}%`, "#sd-progress"],
        "cpu_temp": [(x) => `${round((x - 20) * 100/(100 - 20))}%`, "#temp-progress"]
    }

    for (const [dataKey, [func, domId]] of Object.entries(dataToId)) {
        if (dataKey in data) {
            $(domId).html(func(data[dataKey]));
        }
    }

    for (const [dataKey, [func, domId]] of Object.entries(dataToProgress)) {
        if (dataKey in data) {
            $(domId).css("width", func(data[dataKey]));
        }
    }

    $(".small-box-loading").hide()
}

const updateFunctions = [
    (data) => updateTextElements(data),
]
updateData(updateFunctions);
setInterval(updateData, 1000, updateFunctions, "/stats/cpu");
setInterval(updateData, 1000 * 60 * 10, updateFunctions, "/stats/storage");
setInterval(updateData, 1000 * 60, updateFunctions, "/stats/uptime");