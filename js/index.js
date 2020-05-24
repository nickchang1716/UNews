// console.log("hello");

//以下為旅行社營收圖js
//動態button
var btnContainer = document.getElementById("btnDiv");
var btns = btnContainer.getElementsByClassName("btn");

for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

//定義圖表左右距離與整體長寬
var margin = {
    top: 40,
    right: 20,
    bottom: 30,
    left: 80
  },
  width = 900 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
.rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
  .range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

var color = d3.scale.ordinal()
  .range(["#DD84A1", "#FFBBBE", "#FEE698", "#CBE3B3", "#40DEF1"]);

var svg = d3.select('#travelAgency').append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//金錢每三位塞入逗點
function formatNumber(number){
    var digits=number.split("");
    var threeDigits=[];

    // 當數字足夠，從後面取出三個位數，轉成字串塞回 threeDigits
    while (digits.length > 3) {
        threeDigits.unshift(digits.splice(digits.length - 3, 3).join(""));
    }
 
    threeDigits.unshift(digits.join(""));
    digits = threeDigits.join(",");
 
    return digits;
}

//更新data，繪製bar chart
function update(data){ 
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
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("transform","translate("+(width-margin.right)+","+margin.right+")")
    .style('font-weight', 'bold')
    .text("年/月");

  //繪製y軸
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("y", -10)
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
    .attr('text-anchor', 'start')
    .attr('fill', '#222')
    .attr('stroke', '#222')
    .attr('font-size',20)
    .text(function (d) { 
        return formatNumber(d.value.toString()) + ' 元'; })
    .attr("x", function(d) {
        return x(d.rate)+20;
      })
    .attr("y", function(d) {
        return y(0);
    })
    .attr("display","none");
    
  //繪製bar
  slice.selectAll("rect")
    .data(function(d) {
      return d.values;
    })
    .enter().append("rect")
    .attr("width", x.rangeBand())
    .attr("x", function(d) {
      return x(d.rate);
    })
    .style("fill", function(d) {
      return color(d.rate)
    })
    .attr("y", function(d) {
      return y(0);
    })
    .attr("height", function(d) {
      return height - y(0);
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
      return height - y(d.value);
    });
  
  //製作動態text
  slice.selectAll("text")
      .transition()
      .delay(100)
      .duration(1000)
      .attr("display","")
      .attr("y", function(d) {
          return y(d.value)-10;
      });
}

//載入時直接匯入data1資料
update(data1)
//旅行社營收圖js結束