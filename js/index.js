//以下為出境、入境圖
const margin_entry_exit = {
  left: 80,
  right: 20,
  top: 60,
  bottom: 60
};
const padding = 10;
const width_entry_exit = 800;
const height_entry_exit = 300;

const white = "#fff";
const black = "#000";
const levelColors = ["#70def1", "#fee698", "#ffbbbe", "#dd84a1"];

let formatComma = d3.format(",d");

let status = document.querySelector("#status");
let country = document.querySelector("#country");
let countryName = document.querySelector("#countryName");
let note = document.querySelector("#note");

// init graph of Japan
selectCountry();

function selectStatus(devMode, isDeparture = false) {
  // if not development mode
  if (!devMode) {
    if (!isDeparture) {
      status.value = "arrival";
    } else {
      status.value = "departure";
    }
  }

  selectCountry();
}

function selectCountry() {
  d3.select('#chart svg').remove();

  // set country name
  countryName.innerHTML = country.options[country.selectedIndex].text + " (" + status.options[status.selectedIndex].text + ")";
  // clear note
  note.innerHTML = "";

  if (status.value == "arrival") {
    drawArrival(arrivalData[country.value]);
  } else if (status.value == "departure") {
    drawDeparture(departureData[country.value]);
  }
}

function drawArrival(data) {
  let chart = d3.select('#chart')
    .append('svg')
    .attr('width', width_entry_exit)
    .attr('height', height_entry_exit);

  let xScale = d3.scaleBand()
    .domain(["12月", "1月", "2月", "3月"])
    .range([margin_entry_exit.left, width_entry_exit - margin_entry_exit.right])
    .padding(0.1);

  let yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.number)])
    .range([height_entry_exit - margin_entry_exit.bottom, margin_entry_exit.top]);

  let axis = chart.append('g').attr('class', 'axis');
  // x axis
  axis.append('g')
    .attr("transform", `translate(0, ${height_entry_exit - margin_entry_exit.bottom})`)
    .call(d3.axisBottom(xScale)
      .tickPadding(padding));
  // y axis
  axis.append('g')
    .attr('transform', `translate(${margin_entry_exit.left}, 0)`)
    .call(d3.axisLeft(yScale)
      .tickPadding(padding))
    .selectAll('text')
    .style('fill', black)
    .style('font-weight', 'bold');
  // x axis title
  axis.append('text')
    .attr('text-anchor', 'middle')
    .attr('x', (width_entry_exit - margin_entry_exit.right + margin_entry_exit.left) / 2)
    .attr('y', height_entry_exit - 5)
    .text('月份');
  // y axis title
  axis.append('text')
    .attr('text-anchor', 'end')
    .attr('x', margin_entry_exit.left - padding)
    .attr('y', margin_entry_exit.top - 20)
    .text('入境人數');

  axis.selectAll('text')
    .style('font-size', 14);

  // line chart
  let lineChart = chart.append('g').attr('class', 'line-chart');
  // draw line tooltip
  let line_tooltip = d3.tip()
    .attr('class', 'd3-tip line-tip')
    .offset([-30, 0])
    .html(d => `<div>入境人數 (${d.month})</div><div>${formatComma(d.number)} 人</div>`);
  lineChart.call(line_tooltip);
  // draw line
  let line = lineChart.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', black)
    .attr('stroke-width', 2)
    .attr('d', d3.line()
      .x(d => xScale(d.month) + xScale.bandwidth() / 2)
      .y(d => yScale(d.number)));
  let totalLength = line.node().getTotalLength();
  line.attr('stroke-dasharray', totalLength + " " + totalLength)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .duration(1500)
    .ease(d3.easeLinear)
    .attr('stroke-dashoffset', 0);
  // draw dot
  let dot = lineChart.selectAll('.dot').data(data);
  dot.enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', d => xScale(d.month) + xScale.bandwidth() / 2)
    .attr('cy', d => yScale(d.number))
    .attr('fill', d => white)
    .attr('stroke', black)
    .attr('stroke-width', 2)
    .attr('r', 0)
    .on("mouseover", line_tooltip.show)
    .on("mouseout", line_tooltip.hide)
    .transition()
    .duration(375)
    .delay((d, i) => i * 375)
    .ease(d3.easeLinear)
    .attr('r', 5);
  // draw dot label
  let dotLabel = lineChart.selectAll('.dot-label').data(data);
  dotLabel.enter()
    .append('text')
    .attr('class', 'dot-label')
    .text(d => formatComma(d.number))
    .attr('x', d => xScale(d.month) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.number) - 15)
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('opacity', 0)
    .transition()
    .duration(375)
    .delay((d, i) => i * 375)
    .ease(d3.easeLinear)
    .attr('opacity', 1);
}

function drawDeparture(data) {
  let chart = d3.select('#chart')
    .append('svg')
    .attr('width', width_entry_exit)
    .attr('height', height_entry_exit);

  let noteContents = [];
  let sortLevel = function(d) {
    let levelArray = d.level.split(",");
    let dateArray = d.date.split(",");
    let maxLevel;
    if (levelArray.length > 1) {
      maxLevel = levelArray[levelArray.length - 1];
      for (let i = 0; i < levelArray.length; i++) {
        noteContents.push(`第 ${levelArray[i]} 級發布於 ${dateArray[i]}`);
      }
    } else {
      maxLevel = levelArray[0];
      if (dateArray[0] !== "") {
        noteContents.push(`第 ${levelArray[0]} 級發布於 ${dateArray[0]}`);
      }
    }
    return levelColors[maxLevel];
  }

  let xScale = d3.scaleBand()
    .domain([12, 1, 2, 3])
    .range([margin_entry_exit.left, width_entry_exit - margin_entry_exit.right])
    .padding(0);

  let y1Scale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.passenger)])
    .range([height_entry_exit - margin_entry_exit.bottom, margin_entry_exit.top]);
  /*
    let y2Scale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.plane)])
      .range([height_entry_exit - margin_entry_exit.bottom, margin_entry_exit.top]);
  */
  let xAxis = d3.axisBottom(xScale)
    .tickFormat(d => d + " 月")
    .tickPadding(padding);

  let y1Axis = d3.axisLeft(y1Scale)
    .tickFormat(d => formatComma(d))
    .tickPadding(padding);
  /*
    let y2Axis = d3.axisRight(y2Scale)
      .tickPadding(padding);
  */
  let axis = chart.append('g').attr('class', 'axis');
  // x axis
  axis.append('g')
    .attr("transform", `translate(0, ${height_entry_exit - margin_entry_exit.bottom})`)
    .call(xAxis);
  // y axis left
  axis.append('g')
    .attr("transform", `translate(${margin_entry_exit.left - 0.5}, 0)`)
    .call(y1Axis)
    .selectAll('text')
    .style('fill', black)
    .style('font-weight', 'bold');
  /*
    // y axis right
    axis.append('g')
      .attr('transform', `translate(${width_entry_exit - margin_entry_exit.right}, 0)`)
      .call(y2Axis)
      .selectAll('text')
      .style('fill', levelColors[0])
      .style('font-weight', 'bold');
  */
  // x axis title
  axis.append('text')
    .attr('text-anchor', 'middle')
    .attr('x', (width_entry_exit - margin_entry_exit.right + margin_entry_exit.left) / 2)
    .attr('y', height_entry_exit - 5)
    .text('月份');
  // y axis left title
  axis.append('text')
    .attr('text-anchor', 'end')
    .attr('x', margin_entry_exit.left - padding)
    .attr('y', margin_entry_exit.top - 20)
    .text('載客人數');
  /*
    // y axis right title
    axis.append('text')
      .attr('text-anchor', 'start')
      .attr('x', width_entry_exit - margin_entry_exit.right + padding)
      .attr('y', margin_entry_exit.top - 20)
      .text('飛機架數');
  */
  axis.selectAll('text')
    .style('font-size', 14);

  // bar chart
  let barChart = chart.append('g').attr('class', 'bar-chart');
  let bar = barChart.selectAll('.bar').data(data);
  bar.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('fill', d => sortLevel(d))
    .attr('x', d => xScale(d.month))
    .attr('width', xScale.bandwidth())
    .attr('y', d => margin_entry_exit.top)
    .attr('height', d => height_entry_exit - margin_entry_exit.top - margin_entry_exit.bottom)
    .attr('opacity', 0.6);
  /*
    // bar chart
    let barChart = chart.append('g').attr('class', 'bar-chart');
    // draw bar tooltip
    let bar_tooltip = d3.tip()
      .attr('class', 'd3-tip bar-tip')
      .offset([-10, 0])
      .html(d => `<div>飛機架數(${d.month}月)</div><div>${formatComma(d.plane)} 架</div>`);
    barChart.call(bar_tooltip);
    // draw bar
    let bar = barChart.selectAll('.bar').data(data);
    bar.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('fill', d => sortLevel(d))
      .attr('x', d => xScale(d.month))
      .attr('y', d => y2Scale(0))
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .on("mouseover", bar_tooltip.show)
      .on("mouseout", bar_tooltip.hide)
      .transition()
      .duration(375)
      .delay((d, i) => i * 375)
      .ease(d3.easeLinear)
      .attr('y', d => y2Scale(d.plane))
      .attr('height', d => y2Scale(0) - y2Scale(d.plane));
  */
  // line chart
  let lineChart = chart.append('g').attr('class', 'line-chart');
  // draw line tooltip
  let line_tooltip = d3.tip()
    .attr('class', 'd3-tip line-tip')
    .offset([-30, 0])
    .html(d => `<div>載客人數(${d.month}月)</div><div>${formatComma(d.passenger)} 人</div>`);
  lineChart.call(line_tooltip);
  // draw line
  let line = lineChart.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', black)
    .attr('stroke-width', 2)
    .attr('d', d3.line()
      .x(d => xScale(d.month) + xScale.bandwidth() / 2)
      .y(d => y1Scale(d.passenger)));
  let totalLength = line.node().getTotalLength();
  line.attr('stroke-dasharray', totalLength + " " + totalLength)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .duration(1500)
    .ease(d3.easeLinear)
    .attr('stroke-dashoffset', 0);
  // draw dot
  let dot = lineChart.selectAll('.dot').data(data);
  dot.enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', d => xScale(d.month) + xScale.bandwidth() / 2)
    .attr('cy', d => y1Scale(d.passenger))
    .attr('fill', white)
    .attr('stroke', black)
    .attr('stroke-width', 3)
    .attr('r', 0)
    .on("mouseover", line_tooltip.show)
    .on("mouseout", line_tooltip.hide)
    .transition()
    .duration(375)
    .delay((d, i) => i * 375)
    .ease(d3.easeLinear)
    .attr('r', 5);
  // draw dot label
  let dotLabel = lineChart.selectAll('.dot-label').data(data);
  dotLabel.enter()
    .append('text')
    .attr('class', 'dot-label')
    .text('')
    .attr('x', d => xScale(d.month) + xScale.bandwidth() / 2)
    .attr('y', d => y1Scale(d.passenger) - 15)
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .transition()
    .duration(375)
    .delay((d, i) => i * 375)
    .ease(d3.easeLinear)
    .text(d => formatComma(d.passenger));

  // draw level label
  let levelLabel = chart.append('g').attr('class', 'level-label');
  let rectSize = 18;
  for (let i = 0; i < 4; i++) {
    levelLabel.append('rect')
      .attr('x', i * 80)
      .attr('y', 0)
      .attr('width', rectSize)
      .attr('height', rectSize)
      .style('fill', levelColors[i])
      .attr('opacity', 0.6);
    levelLabel.append('text')
      .attr('x', i * 80 + rectSize + 5)
      .attr('y', rectSize - 5)
      .text(() => {
        if (i > 0) {
          return "第 " + i + " 級";
        } else {
          return "未分級";
        }
      })
      .attr('font-size', 12);
  }
  levelLabel.attr('transform', `translate(${(width_entry_exit - 300) / 2}, 0)`);

  // draw note
  note.innerHTML = "*備註：";
  for (let i = 0; i < noteContents.length; i++) {
    note.innerHTML += `${noteContents[i]}`;
    if (i !== noteContents.length - 1) {
      note.innerHTML += "，";
    }
  }
}


//出境、入境圖結束

//以下為旅行社營收圖js
//動態button
var btnContainer = document.getElementById("btnDiv");
var btns = btnContainer.getElementsByClassName("btn");

for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("btnActive");
    current[0].className = current[0].className.replace(" btnActive", "");
    this.className += " btnActive";
  });
}

//定義圖表左右距離與整體長寬
var margin_agency = {
    top: 40,
    right: 20,
    bottom: 30,
    left: 80
  },
  width_agency = 800 - margin_agency.left - margin_agency.right,
  height_agency = 400 - margin_agency.top - margin_agency.bottom;

var x = d3.scaleBand()
  .rangeRound([0, width_agency], .1);

var y = d3.scaleLinear()
  .range([height_agency, 0]);

var xAxis_agency = d3.axisBottom(x);

var yAxis_agency = d3.axisLeft(y);

var color = d3.scaleOrdinal()
  .range(["#DD84A1", "#FFBBBE", "#FEE698", "#CBE3B3", "#40DEF1"]);

var svg = d3.select('#travelAgency').append("svg")
  .attr("width", width_agency + margin_agency.left + margin_agency.right)
  .attr("height", height_agency + margin_agency.top + margin_agency.bottom)
  .append("g")
  .attr("transform", "translate(" + margin_agency.left + "," + margin_agency.top + ")");

//金錢每三位塞入逗點
function formatNumber(number) {
  var digits = number.split("");
  var threeDigits = [];

  // 當數字足夠，從後面取出三個位數，轉成字串塞回 threeDigits
  while (digits.length > 3) {
    threeDigits.unshift(digits.splice(digits.length - 3, 3).join(""));
  }

  threeDigits.unshift(digits.join(""));
  digits = threeDigits.join(",");

  return digits;
}

//更新data，繪製bar chart
function update(data, color) {
  svg.selectAll("rect").remove();
  svg.selectAll("text").remove();
  svg.selectAll(".y").remove();

  var rateNames = data[0].values.map(function(d) {
    return d.rate;
  });

  x.domain(rateNames);
  y.domain([0, d3.max(data, function(categorie) {
    return d3.max(categorie.values, function(d) {
      return d.value;
    });
  })]);

  //繪製x軸
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height_agency + ")")
    .call(xAxis_agency)
    .attr("stroke-width", 0.8)
    .append("text")
    .attr("transform", "translate(" + width_agency + "," + margin_agency.right + ")")
    .attr('fill', '#000')
    .attr('font-size', 12)
    .style('font-weight', 'bold')
    .text("年/月");

  //繪製y軸
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis_agency)
    .append("text")
    .attr("y", -10)
    .attr('fill', '#000')
    .attr('font-size', 12)
    .style("text-anchor", "end")
    .style('font-weight', 'bold')
    .text("營收");

  var slice = svg.selectAll(".slice")
    .data(data)
    .enter().append("g")
    .attr("class", "g");

  //寫入每條bar的對應數字
  slice.selectAll("text")
    .data(function(d) {
      return d.values;
    })
    .enter()
    .append('text')
    .attr('class', 'bar-label')
    .attr('text-anchor', 'middle')
    .attr('fill', '#222')
    .attr('stroke', '#222')
    .attr('font-size', 20)
    .attr("x", function(d) {
      return x(d.rate) + x.bandwidth() / 2;
    })
    .attr("y", function(d) {
      return y(0);
    })
    .attr("display", "none")
    .text(function(d) {
      return formatNumber("0") + '元';
    })
    .text(function(d) {
      return formatNumber("0") + '元';
    })
    .transition()
    .duration(1000);

  //繪製bar
  slice.selectAll("rect")
    .data(function(d) {
      return d.values;
    })
    .enter().append("rect")
    .attr("width", x.bandwidth() / 2)
    .attr("x", function(d) {
      return x(d.rate) + x.bandwidth() / 4;
    })
    .style("fill", color)
    .attr("y", function(d) {
      return y(0);
    })
    .attr("height", function(d) {
      return height_agency - y(0);
    });


  //製作動態bar
  slice.selectAll("rect")
    .transition()
    .delay(100)
    .duration(1000)
    .attr("y", function(d) {
      return y(d.value);
    })
    .attr("height", function(d) {
      return height_agency - y(d.value);
    });

  //製作動態text
  slice.selectAll("text")
    .transition()
    .delay(100)
    .duration(1000)
    .attr("display", "")
    .attr("y", function(d) {
      return y(d.value) - 10;
    })
    .tween("string", (d) => {
      let i = d3.interpolateRound(0, d.value);
      return function(t) {
        this.textContent = formatNumber(i(t).toString()) + "元";
      }
    });
}

//載入時直接匯入data1資料
update(data1, '#DD84A1')
//旅行社營收圖js結束
