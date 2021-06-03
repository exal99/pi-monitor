import 'admin-lte';
import $ from 'jquery';

import { Chart, Filler, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import ChartStreaming from 'chartjs-plugin-streaming';
Chart.register(...registerables);
Chart.register(ChartStreaming)


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

function areaChartOption(datasetName, ylabel, yticksFormatter, tooltipFormatter) {
    return {
        datasetFill: true,
        type:'line',
        parsing:{
            xAxisKey: 'time',
            yaxisKey: ylabel,
        },
        scales: {
            x: {
                type: 'time',
                grid: {
                    color: "rgba(200,200,200,0.6)",
                },
                
                time: {
                    isoWeekday: true,
                    //minUnit: 'minutes',
                    tooltipFormat: 'yyyy-MM-dd HH:mm',
                    displayFormats: {
                        hour: 'HH:mm',

                    }
                },

                ticks: {
                    color: "rgba(200,200,200,0.8)"
                }
            },
            y: {
                type: 'linear',
                beginAtZero: true,
                ticks: {
                    color: "rgba(200,200,200,0.8)",
                    callback: yticksFormatter,
                },

                grid: {
                    color: "rgba(200,200,200,0.6)",
                },
            }
        },
        maintainAspectRatio : false,
        responsive : true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (item) => `${item.label}: ${tooltipFormatter(item)}`
                }
            }
        }

    }
}

function createAreaChart(canvas, datasetName, data, ylabel, yticksFormatter=(value, index, ticks) => value, tooltipFormatter=(item) => item.parsed.y) {
    return new Chart(canvas, {
        type: 'line',
        options: areaChartOption(datasetName, ylabel, yticksFormatter, tooltipFormatter),
        data: {
            labels: [],
            datasets: [{
                label: datasetName,
                data: data,
                backgroundColor: 'rgba(60,141,188,0.9)',
                borderColor: 'rgba(60,141,188,0.8)',
                pointRadius: false,
                pointColor: '#3b8bba',
                pointStrokeColor: 'rgba(60,141,188,1)',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(60,141,188,1)',
                parsing: {
                    xAxisKey:'time',
                    yAxisKey: ylabel
                },
                fill: true,
                tension: 0.3,
            }],
            
        },
        
    });
}

function createStreamingOptions(onRefresh, ymax) {
    return {
        scales: {
            x: {
                type: 'realtime',
                realtime: {
                    onRefresh: onRefresh,
                    delay: 2000,
                    duration: 20000,
                },
                time: {
                    isoWeekday: true,
                    tooltipFormat: 'yyyy-MM-dd HH:mm',
                    displayFormats: {
                        hour: 'HH:mm',
                        second: 'HH:mm ss'
                    }
                },
                ticks: {
                    color: "rgba(200,200,200,0.8)"
                },
                grid: {
                    color: "rgba(200,200,200,0.6)"
                }
            },
            y: {
                max: ymax,
                beginAtZero: true,
                ticks: {
                    color: "rgba(200,200,200,0.8)"
                },
                grid: {
                    color: "rgba(200,200,200,0.6)"
                }
            }
        },
        maintainAspectRatio : false,
        responsive : true,
        plugins: {
            legend: {
                display: false
            },
        }
    }
}

function createStreamingChart(canvas, dataSetName, ymax, onRefresh) {
    return new Chart(canvas, {
        type: 'line',
        data: {
            datasets: [{
                data: [],
                backgroundColor: 'rgba(60,141,188,0.9)',
                borderColor: 'rgba(60,141,188,0.8)',
                //pointRadius: false,
                pointColor: '#3b8bba',
                pointStrokeColor: 'rgba(60,141,188,1)',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(60,141,188,1)',
                fill: true,
                tension: 0.2,
            }],
        },
        options: createStreamingOptions(onRefresh, ymax),
    });

}

function updateData(updateFunctions, fetchUrl="/stats") {
    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => updateFunctions.forEach(func => func(data)));
}

function updateTextElements(data) {
    const dataToId = {
        "cpu_temp": [[(x) => `${round(x,1)} &deg;C`, "#cpu-temp"]],
        "cpu_usage": [[(x) => `${round(x.reduce((a,b) => a + b, 0) / x.length, 1)} %`, "#cpu-usage"]],
        "ram": [
            [(x) => `${x.percent} %`, "#ram-usage"],
            [(x) => autoConvertBytes(x.used).join(' '), "#ram-usage-bytes"],
            [(x) => autoConvertBytes(x.buffers).join(' '), "#buffer-bytes"],
            [(x) => autoConvertBytes(x.cached).join(' '), "#cache-bytes"],
        ],
        "hdd": [[(x) => autoConvertBytes(x.free).join(" "), "#disk-free"]],
        "sd": [[(x) => autoConvertBytes(x.free).join(" "), "#sd-free"]],
        "uptime": [[(x) => {
            const units = ["y", "d", "h", "m"];
            let striped = x.join(",").replace(/^(0,)+/g, '').split(',');

            let ret = [];
            for (const [time, unit] of zip(striped.reverse(), units.reverse())) {
                ret.push(time + unit);
            }

            return ret.reverse().join(":");

        }, "#uptime"]]
    }

    const dataToProgress = {
        "cpu_usage": [[(x) => `${round(x.reduce((a,b) => a + b, 0) / x.length, 1)}%`, "#cpu-progress"]],
        "ram": [
            [(x) => `${x.percent}%`, ".ram-usage-bar"],
            [(x) => `${round(x.buffers/x.total * 100)}%`, ".ram-buffers-bar"],
            [(x) => `${round(x.cached/x.total * 100)}%`, ".ram-cache-bar"]
        ],
        "hdd": [[(x) => `${x.percent}%`, "#disk-progress"]],
        "sd": [[(x) => `${x.percent}%`, "#sd-progress"]],
        "cpu_temp": [[(x) => `${round((x - 20) * 100/(100 - 20))}%`, "#temp-progress"]]
    }

    for (const [dataKey, actions] of Object.entries(dataToId)) {
        if (dataKey in data) {
            for (const [func, domId] of actions) {
                $(domId).html(func(data[dataKey]));
            }
        }
    }

    for (const [dataKey, actions] of Object.entries(dataToProgress)) {
        if (dataKey in data) {
            for (const [func, domId] of actions) {
                $(domId).css("width", func(data[dataKey]));
            }
        }
    }

    $(".small-box-loading").hide()
    $(".card-loading").hide()
}

function updateCores(data) {
    if ('cpu_usage' in data) {
        let cores = data.cpu_usage;

        for (const [i, core] of cores.entries()) {
            $(`#cpu-${i + 1}`).html(`${core} %`);
            $(`#cpu-${i + 1}-bar`).css('width', `${round(core)}%`)
        }
    }
}

function updateCPUStreamChart(data, chart) {
    if ("cpu_usage" in data) {
        chart.data.datasets[0].data.push({x: Date.now(), y: round(data.cpu_usage.reduce((a,b) => a+b, 0)/data.cpu_usage.length, 1)})
        chart.update('quiet');
    }
}

const updateFunctions = [
    (data) => updateTextElements(data),
    (data) => updateCores(data),
    (data) => updateCPUStreamChart(data, cpuStreamChart)
]
updateData(updateFunctions);
setInterval(updateData, 1000, updateFunctions, "/stats/cpu");
setInterval(updateData, 1000 * 60 * 10, updateFunctions, "/stats/storage");
setInterval(updateData, 1000 * 60, updateFunctions, "/stats/uptime");

const ramCanvas = $("#ram-history-chart");
const cpuCanvas = $("#cpu-history-chart");
const cpuStreamCanvas = $("#cpu-stream-chart");
const cpuStreamChart = createStreamingChart(cpuStreamCanvas, "CPU Utilisation", 100, undefined)

cpuStreamCanvas.data('chart', cpuStreamChart)


const chartCreaters = [
    data => createAreaChart(ramCanvas, "RAM Usage History", data.data, 'ram_usage',
                           (value, index, ticks) => `${convertPrefix(value, 9, 2)} GB`,
                           (item) => autoConvertBytes(item.parsed.y).join(' ')),
    data => createAreaChart(cpuCanvas, "CPU Usage History", data.data, 'cpu_usage',
                           (value, index, ticks) => value + " %",
                           (item) => item.parsed.y + " %"),
]

fetch("/history")
    .then((response) => response.json())
    .then(data => chartCreaters.forEach(creater => creater(data)));


$(".btn-play").on('click', (event) => {
    let chart = $('#' + event.currentTarget.dataset.chartId).data('chart');
    chart.options.plugins.streaming.pause = false;
    chart.update()
    $('.btn-' + event.currentTarget.dataset.chartId).toggle()
});
$(".btn-pause").on('click', (event) => {
    let chart = $('#' + event.currentTarget.dataset.chartId).data('chart');
    chart.options.plugins.streaming.pause = true;
    chart.update()
    $('.btn-' + event.currentTarget.dataset.chartId).toggle()
});