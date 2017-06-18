/*ui.js*/
var network;
var e_init,e_end;
var on_sim = false;
var data;
var nn = 0;
var opt;
var gerarquia = false;

function load(){
  data ={
    nodes:[],
    edges:[]
  };
  data.nodes = new vis.DataSet(data.nodes);
  data.edges = new vis.DataSet(data.edges);
  network = tree(data,document.getElementById('tree'));
}

function load_file(arg) {
  var file = arg[0];
  var reader = new FileReader();
  reader.onload = function(){
    data = JSON.parse(reader.result);
    data.nodes = new vis.DataSet(data.nodes);
    data.edges = new vis.DataSet(data.edges);
    network = tree(data,document.getElementById('tree'));
  };
  reader.readAsText(file);
}

function tree(data,container){
  /*if(e_init!=null || e_end!=null && e_init!=e_end){
    for (var id in data.nodes._data) {
      if (data.nodes._data.hasOwnProperty(id)) {
        if(data.nodes._data[id].id==e_init){
          data.nodes._data[id].group = "init";
        }
        else if(data.nodes._data[id].id==e_end && !on_sim){
          data.nodes._data[id].group = "end";
        }
        else {
          if(!on_sim)
            data.nodes._data[id].group = null;
        }
      }
    }
  }*/
  var dat = {
    nodes: data.nodes,
    edges: data.edges
  };
  var options = {
    interaction:{
      dragNodes:false,
      dragView:false,
      hoverConnectedEdges:false
    },
    physics:{
      enabled:false
    },
    layout:{
      randomSeed: .5,
      hierarchical: gerarquia
    },
    groups:{init:{color:{background:'red'}},
            end:{color:{background:'green'}},
    },
    manipulation: {
      enabled: false,
      addNode: function(nodeData,callback) {
        nodeData.label = nn
        nodeData.id = nn;
        nn++;
        data.nodes.add(nodeData);
        callback(nodeData);
      },
      addEdge: function(edgeData,callback) {
        var p1 = dat.nodes._data[edgeData.from];
        var p2 = dat.nodes._data[edgeData.to];
        edgeData.label = distance(p1,p2).toString();
        data.edges.add(edgeData);
        callback(edgeData);
      }
    }
  };
  nn = data.nodes.length;
  var nw = new vis.Network(container, dat, options);
  return nw;
}

function e_set(t){
  var node = network.getSelectedNodes()[0];
  if(t=="init"){
    e_init = node;
  }
  else{
    e_end = node;
  }
  network = tree(data,document.getElementById('tree'));
}

function init(){
  opt = document.getElementById('opt').options[document.getElementById('opt').selectedIndex].value;
  search(e_init,e_end,opt,data,document.getElementById('tree'));
}

function descargarArchivo(contenidoEnBlob, nombreArchivo) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        save.download = nombreArchivo || 'archivo.dat';
        var clicEvent = new MouseEvent('click', {
            'view': window,
                'bubbles': true,
                'cancelable': true
        });
        save.dispatchEvent(clicEvent);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(contenidoEnBlob);
};

function save_file(){
  var a = {
    'nodes':[data.nodes._data],
    'edges':[data.edges._data]
  }
  var edges=[];
  for (var id in data.edges._data) {
    var e = {};
    e.to = data.edges._data[id].to;
    e.from = data.edges._data[id].from;
    e.label = data.edges._data[id].label;
    edges.push(e);
  }
  var nodes=[];
  for (var id in data.nodes._data) {
    var n = {};
    n.id = data.nodes._data[id].id;
    n.label = data.nodes._data[id].label;
    n.x = data.nodes._data[id].x;
    n.y = data.nodes._data[id].y;
    nodes.push(n);
  }
  var d = {
    nodes:nodes,
    edges:edges
  };
  var j = JSON.stringify(d);
  var b = new Blob([j], {
        type: 'application/json'
    });
  descargarArchivo(b,document.getElementById('fname').value+".json");
}

function checkGa(){
  gerarquia = document.getElementById('sGa').checked;
  network = tree(data,document.getElementById('tree'));
}

function pause(){
  if(pausa)
    document.getElementById('pause').innerHTML = 'pausa';
  else
    document.getElementById('pause').innerHTML = 'reanudar';
  pausa = !pausa;
}

function distance(p1,p2){
  return Math.round(Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2)));
}
