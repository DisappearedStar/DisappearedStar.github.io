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
  
  $.getJSON('goods-new.json', function (json) {
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
    console.log("clickk");
		$(this).next().next().slideToggle("slow").siblings("p:visible").slideUp("slow", function() {resizeContainer();});
		$(this).toggleClass("active");
		$(this).siblings(".h5").removeClass("active");
	});  
  
  $(document).on('click', '.my-list', function () {
		$("#goods").toggleClass("hidden", true);
    $("#my").toggleClass("hidden", false);
    $(".my-list").css('background', '#a6d8ec');
    $(".goods-list").css('background', '');
    $("#my").empty();
    $('input:checkbox:checked.cb-goods').map(function (o, i) 
    {
      $("#my").append('<span id="cg' + this.value +'">' + getGoodNameById(this.value)+'</span><span class="delete-good noselect"></span><br>');
    });
	});
  
  $(document).on('click', '.goods-list', function () {
    $("#my").toggleClass("hidden", true);
		$("#goods").toggleClass("hidden", false);
    $(".goods-list").css('background', '#a6d8ec');
    $(".my-list").css('background', '');
	});
  
  $(document).on('click', '.delete-good', function () {
    var id = $(this).prev("span").attr('id').slice(2);
    $("#cb"+id).prop('checked', false);
    var br = $(this).next("br");
    $(this).prev("span").fadeOut();
    $(this).fadeOut(function(){br.remove();redrawMap();});
	});
  
  $(document).on('click', '.save-button', function () {
    if(getCheckedGoodsIds().length)
    {
      $('#overlay').fadeIn(400,	function()
      {
        makeModalWindow("save");
      });
    }
	});
  
  $(document).on('click', '.load-button', function () {
      $('#overlay').fadeIn(400,	function()
      {
        makeModalWindow("load");
        //$('#modal_form').css('display', 'block').animate({opacity: 1, top: '50%'}, 200);
      });
	});
  
  $(document).on('click', '#lists-clear', function () {
    if($.cookie("names"))
    {
      var names = $.parseJSON($.cookie("names"));
      names.map(function(name){
        $.cookie(name, '');
      });
      $.cookie("names", '');
      $("#my-saved-lists").empty();
    }
	});
  
  $(document).on('click', '.modal-save', function () {
    var name = $("#list-name-input").val();
    if(name && (name != 'null'))
    {
      console.log("77");
      if(!($.cookie("names")) || ($.cookie("names") == 'null'))
      {
        console.log("69");
        $.cookie("names", JSON.stringify([name]), {expires:999});
      }
      var names = $.parseJSON($.cookie("names"));
      if(names.length >= 10)
      {
        $(".modal-result").append("Нельзя сохранить больше 10 списков").css("color", "red").fadeIn(500, modal_close);
      }
      else
      {
        if(names.indexOf(name) == -1)
        {
          names.push(name);
        }
        var values = getCheckedGoodsIds();
        $.cookie(name, JSON.stringify(values), {expires:999});
        $.cookie("names", JSON.stringify(names), {expires:999});
        $(".modal-result").append("Сохранено").css("color", "green").fadeIn(500, modal_close);
      }
    }
	});
  
  $(document).on('click', '.modal-load', function () {
    var ids = $.parseJSON($.cookie($("#my-saved-lists option:selected").text()));
    console.log(ids);
    ids.map(function(id){
      $("#cb"+id).prop('checked', true);
    });
    $(".modal-result").append("Загружено").css("color", "green").fadeIn(500, modal_close);
    $(".my-list").trigger("click");
    redrawMap();
	});
  
  $(document).on('click', '#modal_close, #overlay', modal_close);
  
  function modal_close()
  {
    $(".modal-result").fadeOut(600, function(){
      $(".modal-result").empty();
      $(".modal-submit").remove();
      $(".margin-wrap").prev().empty();
      //$("#list-name-input").val('');
      $('.modal').animate({opacity: 0, top: '45%'}, 200,	function()
      {
        $(this).css('display', 'none');
        $('#overlay').fadeOut(400);
      });
    });
    //$(".modal").attr('id', '');
  }
  
  $(document).on('click', '.clear-selection-button', function () {
    $('input:checkbox:checked.cb-goods').map(function () 
    { $(this).prop('checked', false); });
    if(!$("#map").parent().hasClass("hidden"))
    {
      redrawMap();      
    } 
    $("#my").empty();
	});  
  
  $(document).on('change', ':checkbox.cb-goods', function () {
    console.log("ya tut");
    if(!$("#map").parent().hasClass("hidden"))
    {
      redrawMap();      
    } 
  });
  
  
  $.getJSON('shops.json', function (json) {
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
    
    var values = getCheckedGoodsIds();
    $.getJSON(u, function (json) {
      map = json;
      resizeContainerWidth(k);
      
      $("#map").attr("width", k*json["width"]).attr("height", k*json["height"]);
      $(".legend-area").first().empty();
      
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
  });
  
  function resizeContainer() {
    console.log("in resize");
    var m = $(".app-area-wrapper").height();
    var l = $(".user-choice-area").height() + 10;
    var r = $(".map-area").height() + $(".legend-area").height() + 40;
    if(l>=m) 
    {
      $(".app-area-wrapper").css("height", l+20+'px');
    }
    m = $(".app-area-wrapper").height();
    l = $(".user-choice-area").height();
    if(m<=r) 
    {
      $(".app-area-wrapper").css("height", r+'px');
      /*(".user-choice-area").css("height", r+5+'px');*/
    }
    /*else
    {
      $(".app-area-wrapper").css("height", l+'px');
    }*/
  }
  function resizeContainerWidth(k) {
    console.log("in resizeWidth");
    var l = $(".user-choice-area").width() + 10 + (k+2)*map["width"];
    $(".app-area-wrapper").css("width", l+'px');
  }
  function getGoodNameById(id)
  {
    for(var category in goods["goods"])
    {
      for(var good in goods["goods"][category])
      {
        if(Number(good) == Number(id))
          return goods["goods"][category][good];
      }
    }
  }
  
  function redrawMap()
  {
    selectedGoods = $('input:checkbox:checked.cb-goods').map(function () 
      { return this.value; }).get();
    drawMap();
  }
  function getCheckedGoodsIds()
  {
    return $('input:checkbox:checked.cb-goods').map(function(){return this.value;}).get();
  }
  
  function makeModalWindow(type)
  {
    console.log("make windows");
    if(type == "save")
    {
      $(".modal").attr('id', 'modal_form');
      $("#modal_close").next().append('Введите название списка:<input id="list-name-input" type="text" size="20" maxlength="20">');
      $(".margin-wrap").prepend('<span class="modal-save modal-submit noselect">Сохранить</span>');
    }
    if(type == "load")
    {
      $(".modal").attr('id', 'load_form');
      var names = null;
      if(($.cookie("names")) && ($.cookie("names") != null) && ($.cookie("names") != 'null'))
      {
        console.log("1234");
        names = $.parseJSON($.cookie("names"));
        console.log(names);
        $("#modal_close").next().append('Выберите список:<br clear="all"><select size="1" id="my-saved-lists" name="my-saved-lists"></select><span id="lists-clear"></span>');
        $("#my-saved-lists").append($("<option />").val("").attr("selected", true).attr("disabled", true));
        names.map(function(name){
          $("#my-saved-lists").append($("<option />").val(name).text(name));
        });
        $(".margin-wrap").prepend('<span class="modal-load modal-submit noselect">Загрузить</span>');
      }
      else
      {
        console.log("5555");
        $(".modal-result").append('У вас нет списков').css("color", "red").fadeIn(500, modal_close);
      }
    }
    $(".modal").css('display', 'block').animate({opacity: 1, top: '50%'}, 200);
  }
})











