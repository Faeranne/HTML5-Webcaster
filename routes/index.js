
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Tulsa Tech Talk'  })
};
exports.control = function(req, res){
  res.render('control', { title: 'Tulsa Tech Talk'  })
};
