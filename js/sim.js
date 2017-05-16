/*sim.js*/
var lp,nd,n=0;
var pausa = false;

function sim(nv,data,t){
  clearInterval(lp);
  document.getElementById('sim').innerHTML='';
  nd = document.createElement('div');
  document.getElementById('sim').appendChild(nd);
  lp = setInterval(function(){
    loop(nv,data);
  },t);
}

function sim_off(){
  if(lp!=null)
    clearInterval(lp);
}

function loop(nv,data){
  on_sim = true;
  if(n<nv.length){
    for (var id in data.nodes._data) {
      if(data.nodes._data[id].id==nv[n])
        data.nodes._data[id]['group'] = 'init';
    }
  }
  else {
    n=0;
    for (var id in data.nodes._data) {
      data.nodes._data[id].group=null;
    }
    if(opt=='profI' && limp<=li){
      document.getElementById('prof').value = limp+1;
      clearInterval(lp);
      alert("iteracion: "+limp);
      search(e_init,e_end,'proflim',data);
    }
  }
  if(!pausa)
    n++;
  var netw = tree(data,nd);
}
