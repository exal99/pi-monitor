import * as adminlte from 'admin-lte';
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

updateData(updateFunctions);
setInterval(updateData, 2000, updateFunctions);*/