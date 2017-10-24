const walk = require('walk');
const gm = require('gm');
const async = require('async');
const _ = require('lodash');
const fs = require('fs');
const path = require('path')
const covertFilename = function(originUrl, size) {
  if (!originUrl) {
    return false
  }

  if (!size) {
    return originUrl;
  }
  size = size.toString();
  size = '_' + size
  if (Array.isArray(originUrl)) {
    var arr = []
    _.each(originUrl, function(url) {
      url = url.replace(/(\.[\w\d_-]+)$/i, size + '$1');
      arr.push(url)
    })
    return arr;
  } else {
    return originUrl.replace(/(\.[\w\d_-]+)$/i, size + '$1');

  }
};

var files = [];
var walker = walk.walk('./filestore', { followLinks: false });
walker.on('file', function(root, stat, next) {
  files.push(root + '/' + stat.name);
  next()
});
walker.on("errors", function(err) {
  console.log(err)
})
walker.on('end', function() {
  _.each(files, file => {
    renderThumb(file)
  })
});


const renderThumb = (file) => {
  if (file.indexOf('_') == -1) {
    var sm = covertFilename(file, 'sm');
    gm(file).resize(200, null).noProfile().write(sm, function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log(file + ' sm_thumb rendered')
      }
    })
    var mid = covertFilename(file, 'mid');
    gm(file).resize(540, null).noProfile().write(mid, function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log(file + ' mid_thumb rendered')
      }
    })
  }

}