/*search.js*/
var lnodes,rnodes,limp,lastn;

function search(ei,ef,tsearch,data,div){
  if(ei == null || ef == null){
    alert("Elige un nodo de inicion y un nodo meta");
    return;
  }
  if(tsearch == 'profI'){
    profI();
    return;
  }
  if(tsearch == 'a*'){
    a(ei,ef,data,function(tree){
      tree.nodes = new vis.DataSet(tree.nodes);
      tree.edges = new vis.DataSet(tree.edges);
      var cont = document.createElement('div');
      var options = {
        layout:{
          hierarchical: true
        },
      };
      div.appendChild(cont);
      var network = new vis.Network(cont, tree, options);
    });
    return;
  }
  if(tsearch == 'avida'){
    avida(ei,ef,data);
    return;
  }
  lnodes = [];
  rnodes = [];
  var np=0;
  lnodes.push(ei);
  if(tsearch == 'costo'){
    costo(ef);
    return;
  }
  do{
    n = eval(tsearch+"()");
    rnodes.push(n);
    for (var id in data.edges._data) {
      if(n<=ef){
        if(data.edges._data[id].from == n)
          lnodes.push(data.edges._data[id].to);
      }
      else {
        if(data.edges._data[id].to == n)
          lnodes.push(data.edges._data[id].from);
      }
    }
    np++;
    if(tsearch=='proflim' && np>=limp){
      alert("Fallo, nodo meta no encontrado");
      break;
    }
  }while (n!=ef);
  rnodes = rnodes.unique();
  var tsh = document.getElementById('opt').options[document.getElementById('opt').selectedIndex].innerHTML;
  var txt="Búsqueda "+tsh+"<br><br>Ruta solucion: <br>";
  for(var i=0;i<rnodes.length;i++){
    txt+=data.nodes._data[rnodes[i]].label+" -> ";
  }
  txt+="<br><br>Numero de pasos: "+np+"<br>";//<br>Nodos visitados: <ul>";
  txt = "</ul><p>"+txt+"<br></p>";
  document.getElementById('data').innerHTML = txt;
  console.log(rnodes);
  console.log(lnodes);
  console.log(np);
  sim(rnodes,data,1000);
}

function profundidad(){
  return lnodes.pop();
}

function amplitud(){
  return lnodes.shift();
}

function proflim(){
  limp = parseInt(document.getElementById('prof').value);
  return profundidad();
}

function profI(){
  li = document.getElementById('prof').value;
  document.getElementById('prof').value=0;
  search(e_init,e_end,'proflim',data);
}

function costo(ef){
  var ns = [];
  var vr = [];
  var v = 0;
  var n = lnodes.pop();
  ns.push(n);
  do{
    for (var i in data.edges._data) {
      if(data.edges._data[i].label==null){
        alert("Todas las aristas deben tener un costo");
        return;
      }
      var p1,p2;
      if(data.edges._data[i].from == n){
        p1 = data.edges._data.to;
        p2 = parseInt(data.edges._data[i].label)+v;
      }
      if(data.edges._data[i].to == n){
        p1 = data.edges._data[i].from;
        p2 = parseInt(data.edges._data[i].label)+v;
      }
      if(p1!=null && p2!=null){
        console.log(p1);
        console.log(p2);
        lnodes.push(p1);
        vr.push(p2);
      }
    }
    var ind = vr.indexOf(vr.min());
    v = vr[ind];
    n = lnodes[ind];
    if(ns.indexOf(n)==-1)
      ns.push(n);
    vr.splice(ind,1);
    lnodes.splice(ind,1);
  }while(n!=ef);
  var tsh = document.getElementById('opt').options[document.getElementById('opt').selectedIndex].innerHTML;
  var txt="Búsqueda "+tsh+"<br><br>Ruta solucion: <br><br>Costo total de ruta: "+v+"<br><br>";
  for(var i=0;i<ns.length;i++){
    txt+=data.nodes._data[ns[i]].label+" -> ";
  }
  txt+="<br><br>Numero de pasos: "+ns.length+"<br>";//<br>Nodos visitados: <ul>";
  txt = "</ul><p>"+txt+"<br></p>";
  document.getElementById('data').innerHTML = txt;
  console.log(ns);
  console.log(v);
  sim(ns,data,1000);
}

Array.prototype.unique = function() {
    var unique = [];
    for (var i = 0; i < this.length; i++) {
        if (unique.indexOf(this[i]) == -1) {
            unique.push(this[i]);
        }
    }
    return unique;
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};
