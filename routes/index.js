
/*
 * GET home page.
 */
var audioCasterCode=new Array();
var audioCasterName=new Array();
var videoCasterCode=new Array();
var videoCasterName=new Array();
exports.audioCasterCode=audioCasterCode;
exports.audioCasterName=audioCasterName;
exports.videoCasterCode=videoCasterCode;
exports.videoCasterName=videoCasterName;

exports.index = function(req, res){
  res.render('index', { title: 'Tulsa Tech Talk'  })
};
exports.control = function(req, res){
  res.render('control', { title: 'Tulsa Tech Talk'  })
};
exports.caster = function(req, res){
  if(req.params.type=="audio"){
    if(audioCasterCode.length){
      for(var i=0;i<audioCasterCode.length;i++){
        if(audioCasterCode[i]=req.params.code){res.render('caster', { title: 'Audio Caster', name:audioCasterName[i]}, type:'audio'); return true;}
      }
  res.render('error', { title: 'Error', text: 'Invalid audio access code' })
  return false;
  }res.render('error', { title: 'Error', text: 'No current audio access codes' })
  }
  if(req.params.type=="video"){
  if(videoCasterCode.length){
      for(var i=0;i<videoCasterCode.length;i++){
        if(videoCasterCode[i]=req.params.code){res.render('caster', { title: 'Video Caster', name:videoCasterName[i]}, type:'video'); return true;}
      }
  res.render('error', { title: 'Error', text: 'Invalid video access code' })
  return false;
  }res.render('error', { title: 'Error', text: 'No current video access codes' })
  }
};
