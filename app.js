(function() {
  "use strict";
  const gm = require('gm');
  const _ = require('lodash');


  var walk = require('walk'),
    fs = require('fs'),
    path = require('path'),
    options, walker;


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

  options = {
    followLinks: false
  };

  walker = walk.walk("./filestore", options);

  walker.on("names", function(root, nodeNamesArray) {
    nodeNamesArray.sort(function(a, b) {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });
  });

  walker.on("directories", function(root, dirStatsArray, next) {
    // dirStatsArray is an array of `stat` objects with the additional attributes
    // * type
    // * error
    // * name

    next();
  });

  walker.on("file", function(root, fileStats, next) {
    fs.readFile(path.join(root, fileStats.name), function () {
      renderThumb(path.join(root, fileStats.name))
      next();
    });

  });

  walker.on("errors", function(root, nodeStatsArray, next) {
    next();
  });

  walker.on("end", function() {
    console.log("all done");
  });


  const renderThumb = (file) => {
    if (file.indexOf('_') == -1) {
      var sm = covertFilename(file, 'sm');
      gm(file).resize(160, null).noProfile().write(sm, function(err) {
        if (err) {
          console.log(err)
        } else {
          console.log(file + ' sm_thumb rendered')
          var mid = covertFilename(file, 'mid');
          gm(file).resize(540, null).noProfile().write(mid, function(err) {
            if (err) {
              console.log(err)
            } else {
              console.log(file + ' mid_thumb rendered')
            }
          })
        }
      })

    }

  }
}());