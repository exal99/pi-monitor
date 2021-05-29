(()=>{var __webpack_modules__={57:()=>{eval('const BACKGROUND_COLOR = "#363636";\nconst FONT_COLOR = "#FEFEFE";\nconst COLORS = ["#BC6C25", "#708B75", "#DDA15E"];\n\nfunction piChartOptions(deg_cutout, title) {\n  return {\n    circumference: 360 - deg_cutout,\n    rotation: -180 + deg_cutout / 2,\n    plugins: {\n      tooltip: {\n        callbacks: {\n          label: item => `${item.label}: ${autoConvertBytes(item.raw).join(" ")}`\n        }\n      },\n      title: {\n        display: true,\n        text: title,\n        color: FONT_COLOR\n      },\n      legend: {\n        labels: {\n          color: FONT_COLOR\n        }\n      }\n    }\n  };\n}\n\nfunction makePiChart(canvas, datasetName) {\n  return new Chart(canvas, {\n    type: \'doughnut\',\n    options: piChartOptions(120, datasetName),\n    data: {\n      labels: [],\n      datasets: [{\n        label: datasetName,\n        data: [],\n        backgroundColor: []\n      }]\n    }\n  });\n}\n\nfunction round(num, precision = 0) {\n  return Math.floor(num * Math.pow(10, precision) + 0.5) / Math.pow(10, precision);\n}\n\nfunction convertPrefix(num, prefix, precision = 0) {\n  return round(round(num, -(prefix - precision)) / Math.pow(10, prefix), precision);\n}\n\nfunction autoConvertBytes(bytes) {\n  const prefixes = [[12, "TB"], [9, "GB"], [6, "MB"], [3, "KB"]];\n\n  for (const prefix of prefixes) {\n    if (bytes > Math.pow(10, prefix[0])) {\n      return [convertPrefix(bytes, prefix[0], 2), prefix[1]];\n    }\n  }\n\n  return [bytes, "bytes"];\n}\n\nfunction updateRAMChart(chart, data) {\n  let used = data["ram"]["total"] - data["ram"]["available"];\n  let available = data["ram"]["available"];\n  chart.data.datasets[0].data = [used, available];\n  chart.update();\n}\n\nfunction updateDiskSpace(chart, data) {\n  chart.data.datasets[0].data = [data["hdd"]["used"], data["hdd"]["free"]];\n  chart.update();\n}\n\nfunction updateSdSpace(chart, data) {\n  chart.data.datasets[0].data = [data["sd"]["used"], data["sd"]["free"]];\n  chart.update();\n}\n\nfunction updateData(updateFunctions) {\n  fetch("/stats").then(response => response.json()).then(data => updateFunctions.forEach(func => func(data)));\n}\n\nlet ramCanvas = document.getElementById("ramChart");\nlet diskCanvas = document.getElementById("diskChart");\nlet sdCanvas = document.getElementById("sdChart");\nlet ramChart = makePiChart(ramCanvas, "RAM Usage");\nlet diskChart = makePiChart(diskCanvas, "HDD Space");\nlet sdChart = makePiChart(sdCanvas, "SD-Card Space");\nramChart.data.labels = ["Used", "Available"];\nramChart.data.datasets[0].backgroundColor = [COLORS[0], COLORS[1]];\ndiskChart.data.labels = ["Used", "Available"];\ndiskChart.data.datasets[0].backgroundColor = [COLORS[0], COLORS[1]];\nsdChart.data.labels = ["Used", "Available"];\nsdChart.data.datasets[0].backgroundColor = [COLORS[0], COLORS[1]];\nconst updateFunctions = [data => updateRAMChart(ramChart, data), data => updateDiskSpace(diskChart, data), data => updateSdSpace(sdChart, data)];\nupdateData(updateFunctions);\nsetInterval(updateData, 2000, updateFunctions);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9waS1tb25pdG9yLy4vanMvc2NyaXB0LmpzPzhjMmYiXSwibmFtZXMiOlsiQkFDS0dST1VORF9DT0xPUiIsIkZPTlRfQ09MT1IiLCJDT0xPUlMiLCJwaUNoYXJ0T3B0aW9ucyIsImRlZ19jdXRvdXQiLCJ0aXRsZSIsImNpcmN1bWZlcmVuY2UiLCJyb3RhdGlvbiIsInBsdWdpbnMiLCJ0b29sdGlwIiwiY2FsbGJhY2tzIiwibGFiZWwiLCJpdGVtIiwiYXV0b0NvbnZlcnRCeXRlcyIsInJhdyIsImpvaW4iLCJkaXNwbGF5IiwidGV4dCIsImNvbG9yIiwibGVnZW5kIiwibGFiZWxzIiwibWFrZVBpQ2hhcnQiLCJjYW52YXMiLCJkYXRhc2V0TmFtZSIsIkNoYXJ0IiwidHlwZSIsIm9wdGlvbnMiLCJkYXRhIiwiZGF0YXNldHMiLCJiYWNrZ3JvdW5kQ29sb3IiLCJyb3VuZCIsIm51bSIsInByZWNpc2lvbiIsIk1hdGgiLCJmbG9vciIsInBvdyIsImNvbnZlcnRQcmVmaXgiLCJwcmVmaXgiLCJieXRlcyIsInByZWZpeGVzIiwidXBkYXRlUkFNQ2hhcnQiLCJjaGFydCIsInVzZWQiLCJhdmFpbGFibGUiLCJ1cGRhdGUiLCJ1cGRhdGVEaXNrU3BhY2UiLCJ1cGRhdGVTZFNwYWNlIiwidXBkYXRlRGF0YSIsInVwZGF0ZUZ1bmN0aW9ucyIsImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsImZvckVhY2giLCJmdW5jIiwicmFtQ2FudmFzIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImRpc2tDYW52YXMiLCJzZENhbnZhcyIsInJhbUNoYXJ0IiwiZGlza0NoYXJ0Iiwic2RDaGFydCIsInNldEludGVydmFsIl0sIm1hcHBpbmdzIjoiQUFBQSxNQUFNQSxnQkFBZ0IsR0FBRyxTQUF6QjtBQUNBLE1BQU1DLFVBQVUsR0FBRyxTQUFuQjtBQUNBLE1BQU1DLE1BQU0sR0FBRyxDQUFDLFNBQUQsRUFBWSxTQUFaLEVBQXVCLFNBQXZCLENBQWY7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QixDQUE3QztBQUNBNEQsT0FBTyxDQUFDbkMsSUFBUixDQUFhUCxNQUFiLEdBQXNCLENBQUMsTUFBRCxFQUFTLFdBQVQsQ0FBdEI7QUFDQTBDLE9BQU8sQ0FBQ25DLElBQVIsQ0FBYUMsUUFBYixDQUFzQixDQUF0QixFQUF5QkMsZUFBekIsR0FBMkMsQ0FBQzNCLE1BQU0sQ0FBQyxDQUFELENBQVAsRUFBWUEsTUFBTSxDQUFDLENBQUQsQ0FBbEIsQ0FBM0M7QUFFQSxNQUFNOEMsZUFBZSxHQUFHLENBQ25CckIsSUFBRCxJQUFVYSxjQUFjLENBQUNvQixRQUFELEVBQVdqQyxJQUFYLENBREosRUFFbkJBLElBQUQsSUFBVWtCLGVBQWUsQ0FBQ2dCLFNBQUQsRUFBWWxDLElBQVosQ0FGTCxFQUduQkEsSUFBRCxJQUFVbUIsYUFBYSxDQUFDZ0IsT0FBRCxFQUFVbkMsSUFBVixDQUhILENBQXhCO0FBTUFvQixVQUFVLENBQUNDLGVBQUQsQ0FBVjtBQUNBZSxXQUFXLENBQUNoQixVQUFELEVBQWEsSUFBYixFQUFtQkMsZUFBbkIsQ0FBWCIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJBQ0tHUk9VTkRfQ09MT1IgPSBcIiMzNjM2MzZcIjtcbmNvbnN0IEZPTlRfQ09MT1IgPSBcIiNGRUZFRkVcIjtcbmNvbnN0IENPTE9SUyA9IFtcIiNCQzZDMjVcIiwgXCIjNzA4Qjc1XCIsIFwiI0REQTE1RVwiLCBdXG5mdW5jdGlvbiBwaUNoYXJ0T3B0aW9ucyhkZWdfY3V0b3V0LCB0aXRsZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNpcmN1bWZlcmVuY2U6IDM2MCAtIGRlZ19jdXRvdXQsXG4gICAgICAgIHJvdGF0aW9uOiAtMTgwICsgZGVnX2N1dG91dC8yLFxuICAgICAgICBwbHVnaW5zOiB7XG4gICAgICAgICAgICB0b29sdGlwOiB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAoaXRlbSkgPT4gYCR7aXRlbS5sYWJlbH06ICR7YXV0b0NvbnZlcnRCeXRlcyhpdGVtLnJhdykuam9pbihcIiBcIil9YFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aXRsZTp7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0ZXh0OiB0aXRsZSxcbiAgICAgICAgICAgICAgICBjb2xvcjogRk9OVF9DT0xPUlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgIGxhYmVsczp7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBGT05UX0NPTE9SXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1ha2VQaUNoYXJ0KGNhbnZhcywgZGF0YXNldE5hbWUpIHtcbiAgICByZXR1cm4gbmV3IENoYXJ0KGNhbnZhcywge1xuICAgICAgICB0eXBlOiAnZG91Z2hudXQnLFxuICAgICAgICBvcHRpb25zOiBwaUNoYXJ0T3B0aW9ucygxMjAsIGRhdGFzZXROYW1lKSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgbGFiZWxzOiBbXSxcbiAgICAgICAgICAgIGRhdGFzZXRzOiBbe1xuICAgICAgICAgICAgICAgIGxhYmVsOiBkYXRhc2V0TmFtZSxcbiAgICAgICAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFtdLFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHJvdW5kKG51bSwgcHJlY2lzaW9uID0gMCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKG51bSAqIE1hdGgucG93KDEwLCBwcmVjaXNpb24pICsgMC41KS9NYXRoLnBvdygxMCwgcHJlY2lzaW9uKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFByZWZpeChudW0sIHByZWZpeCwgcHJlY2lzaW9uID0gMCkge1xuICAgIHJldHVybiByb3VuZChyb3VuZChudW0sIC0ocHJlZml4IC0gcHJlY2lzaW9uKSkgLyBNYXRoLnBvdygxMCwgcHJlZml4KSwgcHJlY2lzaW9uKTtcbn1cblxuZnVuY3Rpb24gYXV0b0NvbnZlcnRCeXRlcyhieXRlcykge1xuICAgIGNvbnN0IHByZWZpeGVzID0gW1sxMiwgXCJUQlwiXSwgWzksIFwiR0JcIl0sIFs2LCBcIk1CXCJdLCBbMywgXCJLQlwiXV07XG5cbiAgICBmb3IgKGNvbnN0IHByZWZpeCBvZiBwcmVmaXhlcykge1xuICAgICAgICBpZiAoYnl0ZXMgPiBNYXRoLnBvdygxMCwgcHJlZml4WzBdKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtjb252ZXJ0UHJlZml4KGJ5dGVzLCBwcmVmaXhbMF0sIDIpLCBwcmVmaXhbMV1dO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFtieXRlcywgXCJieXRlc1wiXTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlUkFNQ2hhcnQoY2hhcnQsIGRhdGEpIHtcbiAgICBsZXQgdXNlZCA9IGRhdGFbXCJyYW1cIl1bXCJ0b3RhbFwiXSAtIGRhdGFbXCJyYW1cIl1bXCJhdmFpbGFibGVcIl07XG4gICAgbGV0IGF2YWlsYWJsZSA9IGRhdGFbXCJyYW1cIl1bXCJhdmFpbGFibGVcIl07XG4gICAgY2hhcnQuZGF0YS5kYXRhc2V0c1swXS5kYXRhID0gW3VzZWQsIGF2YWlsYWJsZV07XG5cbiAgICBjaGFydC51cGRhdGUoKVxuXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZURpc2tTcGFjZShjaGFydCwgZGF0YSkge1xuICAgIGNoYXJ0LmRhdGEuZGF0YXNldHNbMF0uZGF0YSA9IFtkYXRhW1wiaGRkXCJdW1widXNlZFwiXSwgZGF0YVtcImhkZFwiXVtcImZyZWVcIl1dO1xuICAgIGNoYXJ0LnVwZGF0ZSgpXG59XG5cblxuZnVuY3Rpb24gdXBkYXRlU2RTcGFjZShjaGFydCwgZGF0YSkge1xuICAgIGNoYXJ0LmRhdGEuZGF0YXNldHNbMF0uZGF0YSA9IFtkYXRhW1wic2RcIl1bXCJ1c2VkXCJdLCBkYXRhW1wic2RcIl1bXCJmcmVlXCJdXTtcbiAgICBjaGFydC51cGRhdGUoKVxufVxuXG5mdW5jdGlvbiB1cGRhdGVEYXRhKHVwZGF0ZUZ1bmN0aW9ucykge1xuICAgIGZldGNoKFwiL3N0YXRzXCIpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB1cGRhdGVGdW5jdGlvbnMuZm9yRWFjaChmdW5jID0+IGZ1bmMoZGF0YSkpKTtcbn1cblxubGV0IHJhbUNhbnZhcyAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhbUNoYXJ0XCIpO1xubGV0IGRpc2tDYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRpc2tDaGFydFwiKTtcbmxldCBzZENhbnZhcyAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZENoYXJ0XCIpO1xuXG5sZXQgcmFtQ2hhcnQgID0gbWFrZVBpQ2hhcnQocmFtQ2FudmFzLCAgXCJSQU0gVXNhZ2VcIik7XG5sZXQgZGlza0NoYXJ0ID0gbWFrZVBpQ2hhcnQoZGlza0NhbnZhcywgXCJIREQgU3BhY2VcIik7XG5sZXQgc2RDaGFydCAgID0gbWFrZVBpQ2hhcnQoc2RDYW52YXMsICAgXCJTRC1DYXJkIFNwYWNlXCIpO1xuXG5yYW1DaGFydC5kYXRhLmxhYmVscyA9IFtcIlVzZWRcIiwgXCJBdmFpbGFibGVcIl07XG5yYW1DaGFydC5kYXRhLmRhdGFzZXRzWzBdLmJhY2tncm91bmRDb2xvciA9IFtDT0xPUlNbMF0sIENPTE9SU1sxXV07XG5kaXNrQ2hhcnQuZGF0YS5sYWJlbHMgPSBbXCJVc2VkXCIsIFwiQXZhaWxhYmxlXCJdO1xuZGlza0NoYXJ0LmRhdGEuZGF0YXNldHNbMF0uYmFja2dyb3VuZENvbG9yID0gW0NPTE9SU1swXSwgQ09MT1JTWzFdXTtcbnNkQ2hhcnQuZGF0YS5sYWJlbHMgPSBbXCJVc2VkXCIsIFwiQXZhaWxhYmxlXCJdO1xuc2RDaGFydC5kYXRhLmRhdGFzZXRzWzBdLmJhY2tncm91bmRDb2xvciA9IFtDT0xPUlNbMF0sIENPTE9SU1sxXV07XG5cbmNvbnN0IHVwZGF0ZUZ1bmN0aW9ucyA9IFtcbiAgICAoZGF0YSkgPT4gdXBkYXRlUkFNQ2hhcnQocmFtQ2hhcnQsIGRhdGEpLFxuICAgIChkYXRhKSA9PiB1cGRhdGVEaXNrU3BhY2UoZGlza0NoYXJ0LCBkYXRhKSxcbiAgICAoZGF0YSkgPT4gdXBkYXRlU2RTcGFjZShzZENoYXJ0LCBkYXRhKSxcbl1cblxudXBkYXRlRGF0YSh1cGRhdGVGdW5jdGlvbnMpO1xuc2V0SW50ZXJ2YWwodXBkYXRlRGF0YSwgMjAwMCwgdXBkYXRlRnVuY3Rpb25zKTsiXSwiZmlsZSI6IjU3LmpzIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///57\n')}},__webpack_exports__={};__webpack_modules__[57]()})();