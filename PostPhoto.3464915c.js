// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
var parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"PostPhoto.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hyperapp = require("hyperapp");

var _effects = require("./effects");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var postPhotoMutation = "\n\tmutation postPhoto($input: PostPhotoInput!) {\n\t\tpostPhoto(input:$input) {\n\t\t\tid\n\t\t\tname\n\t\t\turl\n\t\t}\n\t}\n";

var UpdatePhotos = function UpdatePhotos(state, result) {
  history.replaceState('', 'title', '/');
  return _objectSpread({}, state, {
    route: _objectSpread({}, state.route, {
      match: '/' // ou retour sur state.match, c.a.d. postPhoto

    }),
    allPhotos: _toConsumableArray(state.allPhotos).concat([result.postPhoto])
  });
};

var ErrorResponse = function ErrorResponse(state, error) {
  return _objectSpread({}, state, {
    error: error
  });
};

var postPhoto = function postPhoto(state, event) {
  event.preventDefault();
  var postPhoto = state.postPhoto;
  return [_objectSpread({}, state, {
    error: null,
    postPhoto: {
      name: '',
      description: '',
      category: 'PORTRAIT',
      file: null
    }
  }), (0, _hyperapp.h)(_effects.RequestGraphql, {
    query: postPhotoMutation,
    variables: {
      input: postPhoto
    },
    action: UpdatePhotos,
    error: ErrorResponse
  })];
};

var setNameValue = function setNameValue(state, ev) {
  return _objectSpread({}, state, {
    postPhoto: _objectSpread({}, state.postPhoto, {
      name: ev.target.value
    })
  });
};

var setDescriptionValue = function setDescriptionValue(state, ev) {
  return _objectSpread({}, state, {
    postPhoto: _objectSpread({}, state.postPhoto, {
      description: ev.target.value
    })
  });
};

var setCategoryValue = function setCategoryValue(state, ev) {
  return _objectSpread({}, state, {
    postPhoto: _objectSpread({}, state.postPhoto, {
      category: ev.target.value
    })
  });
};

var setFileValue = function setFileValue(state, ev) {
  var file = ev.target.files && ev.target.files.length ? ev.target.files[0] : '';
  return _objectSpread({}, state, {
    postPhoto: _objectSpread({}, state.postPhoto, {
      file: file
    })
  });
};

var historyBack = function historyBack(state, event) {
  event.preventDefault();
  history.back();
};

var _default = function _default(_ref) {
  var _ref$postPhoto = _ref.postPhoto,
      name = _ref$postPhoto.name,
      description = _ref$postPhoto.description,
      category = _ref$postPhoto.category,
      error = _ref.error;
  return (0, _hyperapp.h)("form", {
    onSubmit: postPhoto,
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
    }
  }, error ? (0, _hyperapp.h)("h4", null, "Error: ".concat(error.message)) : '', (0, _hyperapp.h)("h1", null, "Post a Photo"), (0, _hyperapp.h)("input", {
    type: "text",
    style: {
      margin: '10px'
    },
    placeholder: "photo name...",
    value: name,
    onChange: setNameValue
  }), (0, _hyperapp.h)("textarea", {
    style: {
      margin: '10px'
    },
    placeholder: "photo description...",
    value: description,
    onChange: setDescriptionValue
  }), (0, _hyperapp.h)("select", {
    value: category,
    style: {
      margin: '10px'
    },
    onChange: setCategoryValue
  }, (0, _hyperapp.h)("option", {
    value: "PORTRAIT"
  }, "PORTRAIT"), (0, _hyperapp.h)("option", {
    value: "LANDSCAPE"
  }, "LANDSCAPE"), (0, _hyperapp.h)("option", {
    value: "ACTION"
  }, "ACTION"), (0, _hyperapp.h)("option", {
    value: "GRAPHIC"
  }, "GRAPHIC")), (0, _hyperapp.h)("input", {
    type: "file",
    style: {
      margin: '10px'
    },
    accept: "image/jpeg",
    onChange: setFileValue
  }), (0, _hyperapp.h)("div", {
    style: {
      margin: '10px'
    }
  }, (0, _hyperapp.h)("button", {
    type: "submit"
  }, "Post Photo"), (0, _hyperapp.h)("button", {
    onClick: historyBack
  }, "Cancel")));
};

exports.default = _default;
},{"hyperapp":"../node_modules/hyperapp/src/index.js","./effects":"effects.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "34039" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js"], null)
//# sourceMappingURL=/PostPhoto.3464915c.map