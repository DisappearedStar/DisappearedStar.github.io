  var data = null;
  var goods = null;
  var map = null;
$(document).ready(function(){
  var cityEl = $("#city");
  var shopEl = $("#shop");
  var addressEl = $("#address");
  var goodsEl = $("#goods");
  var runEl = $("#run");
/*  
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var shops = JSON.parse(this.responseText);
        init(shops);
    }
  };
  xhttp.open("GET", "shops.json", true);
  xhttp.send();
  
  function init(data) {
    console.log(data.city["Новосибирск"].shops["Лента"]);
  }*/
  
  $.getJSON('https://disappearedstar.github.io/secretproject/goods-new.json', function (json) {
    goods = json;
    for(var category in goods["goods"])
    {
      goodsEl.append('<span class="h5 noselect">' + category + "</span><br />");
      goodsEl.append('<p class="goods-items hidden"></p>');
      for(var good in goods["goods"][category])
      {
        $(".goods-items").last().append($("<input />", {'type': 'checkbox', 'class': 'cb-goods', 'id': 'cb'+good, 'value': good}));
        $(".goods-items").last().append($("<label />", {'class': 'noselect', 'for': 'cb'+good, 'text': goods["goods"][category][good]}));
        $(".goods-items").last().append($("<br />"));
      }
    }
    resizeContainer();
  });

  $(document).on('click', '.h5', function () {
		$(this).next().next().slideToggle("slow").siblings("p:visible").slideUp("slow", function() {resizeContainer();});
		$(this).toggleClass("active");
		$(this).siblings(".h5").removeClass("active");
	});  
  
  $.getJSON('https://disappearedstar.github.io/secretproject/shops.json', function (json) {
    data = json;
    for (var city in data.city)
    {
      cityEl.append($("<option />").val(city).text(city));
    }
    cityEl.attr('selectedIndex', 0);
  });
  
  cityEl.change(function() {
    
    if(!$("#address").parent().hasClass("hidden"))
    {
      $("#address").parent().addClass("hidden");
    }
    if(!$("#run").parent().hasClass("hidden"))
    {
      $("#run").parent().addClass("hidden");
    }
    if(!$("#map").parent().hasClass("hidden"))
    {
      $("#map").parent().addClass("hidden");
    }
    $("#shop").parent().removeClass("hidden");
    shopEl.empty().append($("<option />").val("").attr("selected", true).attr("disabled", true));
    var s = data.city[$("#city option:selected").text()].shops;
    for (var shop in s)
    {
      shopEl.append($("<option />").val(shop).text(shop));
    }
    shopEl.attr('selectedIndex', 0);    
    resizeContainer();
  });
  
  shopEl.change(function() {
    $("#address").parent().removeClass("hidden");
    if(!$("#run").parent().hasClass("hidden"))
    {
      $("#run").parent().addClass("hidden");
    }
    if(!$("#map").parent().hasClass("hidden"))
    {
      $("#map").parent().addClass("hidden");
    }
    addressEl.empty().append($("<option />").val("").attr("selected", true).attr("disabled", true));
    var a = data.city[$("#city option:selected").text()].shops[$("#shop option:selected").text()];
    for (var address in a)
    {
      addressEl.append($("<option />").val(address).text(address));
    }
    addressEl.attr('selectedIndex', 0);    
    resizeContainer();
  });  
  
  addressEl.change(function() {
    $("#run").parent().removeClass("hidden");
    if(!$("#map").parent().hasClass("hidden"))
    {
      $("#map").parent().addClass("hidden");
    }
    resizeContainer();
  });
  
  runEl.click(function() 
  {
    var k = 30;
    var u = data.city[$("#city option:selected").text()].shops[$("#shop option:selected").text()][$("#address option:selected").text()];
    
    var values = $('input:checkbox:checked.cb-goods').map(function () 
    { return this.value; }).get();
    $.getJSON(u, function (json) {
      map = json;
      resizeContainerWidth(k);
      
      $("#map").attr("width", k*json["width"]).attr("height", k*json["height"]);
      
      for(var color in colors)
      {
        $(".legend-area").first().append("<span class='legend-el noselect'>" + colors[color].name + "<span>");
        $(".legend-el").last().css('background', colors[color].code);
      }
      $(".legend-area").first().removeClass("hidden");
      $("#map").parent().removeClass("hidden");
      resizeContainer();
      init(json, values, k);
    });
  });
  
  $('#map').on('click', function(e){
    event = e;
    event = event || window.event;
    var canvas = document.getElementById('map'),
        x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;
    createTooltip(x, y, goods);    
    //alert(x + ' ' + y);
  });
  
  function resizeContainer() {
    console.log("in resize");
    var l = $(".user-choice-area").height();
    var r = $(".map-area").height() + $(".legend-area").height() + 5;
    if(l<r) 
    {
      $(".app-area-wrapper").css("height", r);
      $(".user-choice-area").css("height", r+5);
    }
    else
    {
      $(".app-area-wrapper").css("height", l);
    }
  }
  function resizeContainerWidth(k) {
    console.log("in resizeWidth");
    var l = $(".user-choice-area").width() + k*map["width"] + 10;
    $(".app-area-wrapper").css("width", l);
  }
})











