var colors = 
{
  "rackColor": "#a7aaab",
  "passColor": "#d6d6c2",
  "slctColor": "#ff6600"
};
var sizes = null;
var context = null;
var mapData = null;
var selectedGoods = null;
function init(map, goods, k)
{
  context = document.getElementById("map").getContext("2d");
  mapData = map;
  selectedGoods = goods;
  sizes = 
  {
    "step": k,
    "width": k*mapData["width"],
    "height": k*mapData["height"]
  };
  drawMap();
}

function drawMap()
{
  context.shadowOffsetX = 0; 
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;
  context.fillStyle = "#fff";
  context.fillRect(0, 0, sizes.width, sizes.height);
  drawGrid();
  colorMap(mapData, selectedGoods);
}

function drawGrid()
{
  for (var x = 0; x <= sizes.width; x += sizes.step) {
    context.moveTo(x, 0);
    context.lineTo(x, sizes.height);
  }
  
  for (var y = 0; y <= sizes.height; y += sizes.step) {
    context.moveTo(0, y);
    context.lineTo(sizes.width, y);
  }
  
  context.strokeStyle = "#666869";
  context.stroke();
}

function colorMap(mapData, selectedGoods)
{
  for (var row in mapData.rows)
  {
    for (var cell in mapData.rows[row].cells)
    {
      if(Number(mapData.rows[row].cells[cell].toString()) == 0) 
      {
        fillCell(Number(row), Number(cell), colors.passColor);
        continue;
      }
      else if(selectedGoods.indexOf(mapData.rows[row].cells[cell].toString()) != -1)
      {
        fillCell(Number(row), Number(cell), colors.slctColor);
        continue;
      }
      else//(selectedGoods.indexOf(mapData.rows[row].cells[cell].toString()) == -1)
      {
        fillCell(Number(row), Number(cell), colors.rackColor);
        continue;
      }
    }
  }
}

function fillCell(x, y, color)
{
  context.fillStyle = color;
  context.fillRect(sizes.width+2-(sizes.step * (x+1)), sizes.height+2-(sizes.step * (y+1)), sizes.step - 3, sizes.step - 3);
}

function createTooltip(x, y, goods)
{
  drawMap();
  var row = Math.floor((sizes.width - x)/sizes.step);
  var cell = Math.floor((sizes.height - y)/sizes.step);
  var goodId = Number(mapData.rows[row].cells[cell]);
  if(goodId != 0)
  {
    for(var category in goods["goods"])
    {
      for(var good in goods["goods"][category])
      {
        if(Number(good) == goodId)
        {
          context.shadowColor = "black";
          context.font = "14px Helvetica";
          context.fillStyle = "#fff";
          context.shadowBlur = 2;
          var txt = goods["goods"][category][good];
          var xx = x, yy = y;
          if(x > sizes.width - 100)
          {
            xx = sizes.width - 100;
          }
          if(y > sizes.height - 20)
          {
            yy = sizes.height - 20;
          }
          context.shadowOffsetX = 1; 
          context.shadowOffsetY = 1;
          //context.fillText(goods["goods"][category][good], x+5, y+5, 150);
          wrapText(txt, xx+5, yy+5, 100, 20);
          context.shadowOffsetX = -1; 
          context.shadowOffsetY = -1; 
          wrapText(txt, xx+5, yy+5, 100, 20);          

        }
      }
    }
  }
  
}

function wrapText(text, marginLeft, marginTop, maxWidth, lineHeight)
    {
        var words = text.split(" ");
        var countWords = words.length;
        var line = "";
        for (var n = 0; n < countWords; n++) {
            var testLine = line + words[n] + " ";
            var testWidth = context.measureText(testLine).width;
            if (testWidth > maxWidth) {
                context.fillText(line, marginLeft, marginTop);
                line = words[n] + " ";
                marginTop += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, marginLeft, marginTop);
    }












