(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // vendor/topbar.js
  var require_topbar = __commonJS({
    "vendor/topbar.js"(exports, module) {
      (function(window2, document2) {
        "use strict";
        (function() {
          var lastTime = 0;
          var vendors = ["ms", "moz", "webkit", "o"];
          for (var x = 0; x < vendors.length && !window2.requestAnimationFrame; ++x) {
            window2.requestAnimationFrame = window2[vendors[x] + "RequestAnimationFrame"];
            window2.cancelAnimationFrame = window2[vendors[x] + "CancelAnimationFrame"] || window2[vendors[x] + "CancelRequestAnimationFrame"];
          }
          if (!window2.requestAnimationFrame)
            window2.requestAnimationFrame = function(callback, element) {
              var currTime = new Date().getTime();
              var timeToCall = Math.max(0, 16 - (currTime - lastTime));
              var id = window2.setTimeout(function() {
                callback(currTime + timeToCall);
              }, timeToCall);
              lastTime = currTime + timeToCall;
              return id;
            };
          if (!window2.cancelAnimationFrame)
            window2.cancelAnimationFrame = function(id) {
              clearTimeout(id);
            };
        })();
        var canvas, progressTimerId, fadeTimerId, currentProgress, showing, addEvent = function(elem, type, handler) {
          if (elem.addEventListener)
            elem.addEventListener(type, handler, false);
          else if (elem.attachEvent)
            elem.attachEvent("on" + type, handler);
          else
            elem["on" + type] = handler;
        }, options = {
          autoRun: true,
          barThickness: 3,
          barColors: {
            0: "rgba(26,  188, 156, .9)",
            ".25": "rgba(52,  152, 219, .9)",
            ".50": "rgba(241, 196, 15,  .9)",
            ".75": "rgba(230, 126, 34,  .9)",
            "1.0": "rgba(211, 84,  0,   .9)"
          },
          shadowBlur: 10,
          shadowColor: "rgba(0,   0,   0,   .6)",
          className: null
        }, repaint = function() {
          canvas.width = window2.innerWidth;
          canvas.height = options.barThickness * 5;
          var ctx = canvas.getContext("2d");
          ctx.shadowBlur = options.shadowBlur;
          ctx.shadowColor = options.shadowColor;
          var lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          for (var stop in options.barColors)
            lineGradient.addColorStop(stop, options.barColors[stop]);
          ctx.lineWidth = options.barThickness;
          ctx.beginPath();
          ctx.moveTo(0, options.barThickness / 2);
          ctx.lineTo(Math.ceil(currentProgress * canvas.width), options.barThickness / 2);
          ctx.strokeStyle = lineGradient;
          ctx.stroke();
        }, createCanvas = function() {
          canvas = document2.createElement("canvas");
          var style = canvas.style;
          style.position = "fixed";
          style.top = style.left = style.right = style.margin = style.padding = 0;
          style.zIndex = 100001;
          style.display = "none";
          if (options.className)
            canvas.classList.add(options.className);
          document2.body.appendChild(canvas);
          addEvent(window2, "resize", repaint);
        }, topbar2 = {
          config: function(opts) {
            for (var key in opts)
              if (options.hasOwnProperty(key))
                options[key] = opts[key];
          },
          show: function() {
            if (showing)
              return;
            showing = true;
            if (fadeTimerId !== null)
              window2.cancelAnimationFrame(fadeTimerId);
            if (!canvas)
              createCanvas();
            canvas.style.opacity = 1;
            canvas.style.display = "block";
            topbar2.progress(0);
            if (options.autoRun) {
              (function loop() {
                progressTimerId = window2.requestAnimationFrame(loop);
                topbar2.progress("+" + 0.05 * Math.pow(1 - Math.sqrt(currentProgress), 2));
              })();
            }
          },
          progress: function(to) {
            if (typeof to === "undefined")
              return currentProgress;
            if (typeof to === "string") {
              to = (to.indexOf("+") >= 0 || to.indexOf("-") >= 0 ? currentProgress : 0) + parseFloat(to);
            }
            currentProgress = to > 1 ? 1 : to;
            repaint();
            return currentProgress;
          },
          hide: function() {
            if (!showing)
              return;
            showing = false;
            if (progressTimerId != null) {
              window2.cancelAnimationFrame(progressTimerId);
              progressTimerId = null;
            }
            (function loop() {
              if (topbar2.progress("+.1") >= 1) {
                canvas.style.opacity -= 0.05;
                if (canvas.style.opacity <= 0.05) {
                  canvas.style.display = "none";
                  fadeTimerId = null;
                  return;
                }
              }
              fadeTimerId = window2.requestAnimationFrame(loop);
            })();
          }
        };
        if (typeof module === "object" && typeof module.exports === "object") {
          module.exports = topbar2;
        } else if (typeof define === "function" && define.amd) {
          define(function() {
            return topbar2;
          });
        } else {
          this.topbar = topbar2;
        }
      }).call(exports, window, document);
    }
  });

  // ../deps/phoenix_html/priv/static/phoenix_html.js
  "use strict";
  (function() {
    var PolyfillEvent = eventConstructor();
    function eventConstructor() {
      if (typeof window.CustomEvent === "function")
        return window.CustomEvent;
      function CustomEvent2(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: void 0 };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }
      CustomEvent2.prototype = window.Event.prototype;
      return CustomEvent2;
    }
    function buildHiddenInput(name, value) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      return input;
    }
    function handleClick(element, targetModifierKey) {
      var to = element.getAttribute("data-to"), method = buildHiddenInput("_method", element.getAttribute("data-method")), csrf = buildHiddenInput("_csrf_token", element.getAttribute("data-csrf")), form = document.createElement("form"), target = element.getAttribute("target");
      form.method = element.getAttribute("data-method") === "get" ? "get" : "post";
      form.action = to;
      form.style.display = "hidden";
      if (target)
        form.target = target;
      else if (targetModifierKey)
        form.target = "_blank";
      form.appendChild(csrf);
      form.appendChild(method);
      document.body.appendChild(form);
      form.submit();
    }
    window.addEventListener("click", function(e) {
      var element = e.target;
      if (e.defaultPrevented) {
        return;
      }
      while (element && element.getAttribute) {
        var phoenixLinkEvent = new PolyfillEvent("phoenix.link.click", {
          "bubbles": true,
          "cancelable": true
        });
        if (!element.dispatchEvent(phoenixLinkEvent)) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
        if (element.getAttribute("data-method")) {
          handleClick(element, e.metaKey || e.shiftKey);
          e.preventDefault();
          return false;
        } else {
          element = element.parentNode;
        }
      }
    }, false);
    window.addEventListener("phoenix.link.click", function(e) {
      var message = e.target.getAttribute("data-confirm");
      if (message && !window.confirm(message)) {
        e.preventDefault();
      }
    }, false);
  })();

  // ../deps/phoenix/priv/static/phoenix.esm.js
  var closure = (value) => {
    if (typeof value === "function") {
      return value;
    } else {
      let closure22 = function() {
        return value;
      };
      return closure22;
    }
  };
  var globalSelf = typeof self !== "undefined" ? self : null;
  var phxWindow = typeof window !== "undefined" ? window : null;
  var global = globalSelf || phxWindow || void 0;
  var DEFAULT_VSN = "2.0.0";
  var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
  var DEFAULT_TIMEOUT = 1e4;
  var WS_CLOSE_NORMAL = 1e3;
  var CHANNEL_STATES = {
    closed: "closed",
    errored: "errored",
    joined: "joined",
    joining: "joining",
    leaving: "leaving"
  };
  var CHANNEL_EVENTS = {
    close: "phx_close",
    error: "phx_error",
    join: "phx_join",
    reply: "phx_reply",
    leave: "phx_leave"
  };
  var TRANSPORTS = {
    longpoll: "longpoll",
    websocket: "websocket"
  };
  var XHR_STATES = {
    complete: 4
  };
  var Push = class {
    constructor(channel, event, payload, timeout) {
      this.channel = channel;
      this.event = event;
      this.payload = payload || function() {
        return {};
      };
      this.receivedResp = null;
      this.timeout = timeout;
      this.timeoutTimer = null;
      this.recHooks = [];
      this.sent = false;
    }
    resend(timeout) {
      this.timeout = timeout;
      this.reset();
      this.send();
    }
    send() {
      if (this.hasReceived("timeout")) {
        return;
      }
      this.startTimeout();
      this.sent = true;
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload(),
        ref: this.ref,
        join_ref: this.channel.joinRef()
      });
    }
    receive(status, callback) {
      if (this.hasReceived(status)) {
        callback(this.receivedResp.response);
      }
      this.recHooks.push({ status, callback });
      return this;
    }
    reset() {
      this.cancelRefEvent();
      this.ref = null;
      this.refEvent = null;
      this.receivedResp = null;
      this.sent = false;
    }
    matchReceive({ status, response, _ref }) {
      this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
    }
    cancelRefEvent() {
      if (!this.refEvent) {
        return;
      }
      this.channel.off(this.refEvent);
    }
    cancelTimeout() {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    startTimeout() {
      if (this.timeoutTimer) {
        this.cancelTimeout();
      }
      this.ref = this.channel.socket.makeRef();
      this.refEvent = this.channel.replyEventName(this.ref);
      this.channel.on(this.refEvent, (payload) => {
        this.cancelRefEvent();
        this.cancelTimeout();
        this.receivedResp = payload;
        this.matchReceive(payload);
      });
      this.timeoutTimer = setTimeout(() => {
        this.trigger("timeout", {});
      }, this.timeout);
    }
    hasReceived(status) {
      return this.receivedResp && this.receivedResp.status === status;
    }
    trigger(status, response) {
      this.channel.trigger(this.refEvent, { status, response });
    }
  };
  var Timer = class {
    constructor(callback, timerCalc) {
      this.callback = callback;
      this.timerCalc = timerCalc;
      this.timer = null;
      this.tries = 0;
    }
    reset() {
      this.tries = 0;
      clearTimeout(this.timer);
    }
    scheduleTimeout() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.tries = this.tries + 1;
        this.callback();
      }, this.timerCalc(this.tries + 1));
    }
  };
  var Channel = class {
    constructor(topic, params, socket) {
      this.state = CHANNEL_STATES.closed;
      this.topic = topic;
      this.params = closure(params || {});
      this.socket = socket;
      this.bindings = [];
      this.bindingRef = 0;
      this.timeout = this.socket.timeout;
      this.joinedOnce = false;
      this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
      this.pushBuffer = [];
      this.stateChangeRefs = [];
      this.rejoinTimer = new Timer(() => {
        if (this.socket.isConnected()) {
          this.rejoin();
        }
      }, this.socket.rejoinAfterMs);
      this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset()));
      this.stateChangeRefs.push(this.socket.onOpen(() => {
        this.rejoinTimer.reset();
        if (this.isErrored()) {
          this.rejoin();
        }
      }));
      this.joinPush.receive("ok", () => {
        this.state = CHANNEL_STATES.joined;
        this.rejoinTimer.reset();
        this.pushBuffer.forEach((pushEvent) => pushEvent.send());
        this.pushBuffer = [];
      });
      this.joinPush.receive("error", () => {
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.onClose(() => {
        this.rejoinTimer.reset();
        if (this.socket.hasLogger())
          this.socket.log("channel", `close ${this.topic} ${this.joinRef()}`);
        this.state = CHANNEL_STATES.closed;
        this.socket.remove(this);
      });
      this.onError((reason) => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `error ${this.topic}`, reason);
        if (this.isJoining()) {
          this.joinPush.reset();
        }
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.joinPush.receive("timeout", () => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `timeout ${this.topic} (${this.joinRef()})`, this.joinPush.timeout);
        let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), this.timeout);
        leavePush.send();
        this.state = CHANNEL_STATES.errored;
        this.joinPush.reset();
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
        this.trigger(this.replyEventName(ref), payload);
      });
    }
    join(timeout = this.timeout) {
      if (this.joinedOnce) {
        throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
      } else {
        this.timeout = timeout;
        this.joinedOnce = true;
        this.rejoin();
        return this.joinPush;
      }
    }
    onClose(callback) {
      this.on(CHANNEL_EVENTS.close, callback);
    }
    onError(callback) {
      return this.on(CHANNEL_EVENTS.error, (reason) => callback(reason));
    }
    on(event, callback) {
      let ref = this.bindingRef++;
      this.bindings.push({ event, ref, callback });
      return ref;
    }
    off(event, ref) {
      this.bindings = this.bindings.filter((bind) => {
        return !(bind.event === event && (typeof ref === "undefined" || ref === bind.ref));
      });
    }
    canPush() {
      return this.socket.isConnected() && this.isJoined();
    }
    push(event, payload, timeout = this.timeout) {
      payload = payload || {};
      if (!this.joinedOnce) {
        throw new Error(`tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
      }
      let pushEvent = new Push(this, event, function() {
        return payload;
      }, timeout);
      if (this.canPush()) {
        pushEvent.send();
      } else {
        pushEvent.startTimeout();
        this.pushBuffer.push(pushEvent);
      }
      return pushEvent;
    }
    leave(timeout = this.timeout) {
      this.rejoinTimer.reset();
      this.joinPush.cancelTimeout();
      this.state = CHANNEL_STATES.leaving;
      let onClose = () => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `leave ${this.topic}`);
        this.trigger(CHANNEL_EVENTS.close, "leave");
      };
      let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), timeout);
      leavePush.receive("ok", () => onClose()).receive("timeout", () => onClose());
      leavePush.send();
      if (!this.canPush()) {
        leavePush.trigger("ok", {});
      }
      return leavePush;
    }
    onMessage(_event, payload, _ref) {
      return payload;
    }
    isMember(topic, event, payload, joinRef) {
      if (this.topic !== topic) {
        return false;
      }
      if (joinRef && joinRef !== this.joinRef()) {
        if (this.socket.hasLogger())
          this.socket.log("channel", "dropping outdated message", { topic, event, payload, joinRef });
        return false;
      } else {
        return true;
      }
    }
    joinRef() {
      return this.joinPush.ref;
    }
    rejoin(timeout = this.timeout) {
      if (this.isLeaving()) {
        return;
      }
      this.socket.leaveOpenTopic(this.topic);
      this.state = CHANNEL_STATES.joining;
      this.joinPush.resend(timeout);
    }
    trigger(event, payload, ref, joinRef) {
      let handledPayload = this.onMessage(event, payload, ref, joinRef);
      if (payload && !handledPayload) {
        throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");
      }
      let eventBindings = this.bindings.filter((bind) => bind.event === event);
      for (let i = 0; i < eventBindings.length; i++) {
        let bind = eventBindings[i];
        bind.callback(handledPayload, ref, joinRef || this.joinRef());
      }
    }
    replyEventName(ref) {
      return `chan_reply_${ref}`;
    }
    isClosed() {
      return this.state === CHANNEL_STATES.closed;
    }
    isErrored() {
      return this.state === CHANNEL_STATES.errored;
    }
    isJoined() {
      return this.state === CHANNEL_STATES.joined;
    }
    isJoining() {
      return this.state === CHANNEL_STATES.joining;
    }
    isLeaving() {
      return this.state === CHANNEL_STATES.leaving;
    }
  };
  var Ajax = class {
    static request(method, endPoint, accept, body, timeout, ontimeout, callback) {
      if (global.XDomainRequest) {
        let req = new global.XDomainRequest();
        this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
      } else {
        let req = new global.XMLHttpRequest();
        this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback);
      }
    }
    static xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
      req.timeout = timeout;
      req.open(method, endPoint);
      req.onload = () => {
        let response = this.parseJSON(req.responseText);
        callback && callback(response);
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.onprogress = () => {
      };
      req.send(body);
    }
    static xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
      req.open(method, endPoint, true);
      req.timeout = timeout;
      req.setRequestHeader("Content-Type", accept);
      req.onerror = () => {
        callback && callback(null);
      };
      req.onreadystatechange = () => {
        if (req.readyState === XHR_STATES.complete && callback) {
          let response = this.parseJSON(req.responseText);
          callback(response);
        }
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.send(body);
    }
    static parseJSON(resp) {
      if (!resp || resp === "") {
        return null;
      }
      try {
        return JSON.parse(resp);
      } catch (e) {
        console && console.log("failed to parse JSON response", resp);
        return null;
      }
    }
    static serialize(obj, parentKey) {
      let queryStr = [];
      for (var key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
          continue;
        }
        let paramKey = parentKey ? `${parentKey}[${key}]` : key;
        let paramVal = obj[key];
        if (typeof paramVal === "object") {
          queryStr.push(this.serialize(paramVal, paramKey));
        } else {
          queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
        }
      }
      return queryStr.join("&");
    }
    static appendParams(url, params) {
      if (Object.keys(params).length === 0) {
        return url;
      }
      let prefix = url.match(/\?/) ? "&" : "?";
      return `${url}${prefix}${this.serialize(params)}`;
    }
  };
  var LongPoll = class {
    constructor(endPoint) {
      this.endPoint = null;
      this.token = null;
      this.skipHeartbeat = true;
      this.onopen = function() {
      };
      this.onerror = function() {
      };
      this.onmessage = function() {
      };
      this.onclose = function() {
      };
      this.pollEndpoint = this.normalizeEndpoint(endPoint);
      this.readyState = SOCKET_STATES.connecting;
      this.poll();
    }
    normalizeEndpoint(endPoint) {
      return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
    }
    endpointURL() {
      return Ajax.appendParams(this.pollEndpoint, { token: this.token });
    }
    closeAndRetry() {
      this.close();
      this.readyState = SOCKET_STATES.connecting;
    }
    ontimeout() {
      this.onerror("timeout");
      this.closeAndRetry();
    }
    poll() {
      if (!(this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting)) {
        return;
      }
      Ajax.request("GET", this.endpointURL(), "application/json", null, this.timeout, this.ontimeout.bind(this), (resp) => {
        if (resp) {
          var { status, token, messages } = resp;
          this.token = token;
        } else {
          status = 0;
        }
        switch (status) {
          case 200:
            messages.forEach((msg) => {
              setTimeout(() => {
                this.onmessage({ data: msg });
              }, 0);
            });
            this.poll();
            break;
          case 204:
            this.poll();
            break;
          case 410:
            this.readyState = SOCKET_STATES.open;
            this.onopen();
            this.poll();
            break;
          case 403:
            this.onerror();
            this.close();
            break;
          case 0:
          case 500:
            this.onerror();
            this.closeAndRetry();
            break;
          default:
            throw new Error(`unhandled poll status ${status}`);
        }
      });
    }
    send(body) {
      Ajax.request("POST", this.endpointURL(), "application/json", body, this.timeout, this.onerror.bind(this, "timeout"), (resp) => {
        if (!resp || resp.status !== 200) {
          this.onerror(resp && resp.status);
          this.closeAndRetry();
        }
      });
    }
    close(_code, _reason) {
      this.readyState = SOCKET_STATES.closed;
      this.onclose();
    }
  };
  var serializer_default = {
    HEADER_LENGTH: 1,
    META_LENGTH: 4,
    KINDS: { push: 0, reply: 1, broadcast: 2 },
    encode(msg, callback) {
      if (msg.payload.constructor === ArrayBuffer) {
        return callback(this.binaryEncode(msg));
      } else {
        let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
        return callback(JSON.stringify(payload));
      }
    },
    decode(rawPayload, callback) {
      if (rawPayload.constructor === ArrayBuffer) {
        return callback(this.binaryDecode(rawPayload));
      } else {
        let [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
        return callback({ join_ref, ref, topic, event, payload });
      }
    },
    binaryEncode(message) {
      let { join_ref, ref, event, topic, payload } = message;
      let metaLength = this.META_LENGTH + join_ref.length + ref.length + topic.length + event.length;
      let header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
      let view = new DataView(header);
      let offset = 0;
      view.setUint8(offset++, this.KINDS.push);
      view.setUint8(offset++, join_ref.length);
      view.setUint8(offset++, ref.length);
      view.setUint8(offset++, topic.length);
      view.setUint8(offset++, event.length);
      Array.from(join_ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(topic, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(event, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      var combined = new Uint8Array(header.byteLength + payload.byteLength);
      combined.set(new Uint8Array(header), 0);
      combined.set(new Uint8Array(payload), header.byteLength);
      return combined.buffer;
    },
    binaryDecode(buffer) {
      let view = new DataView(buffer);
      let kind = view.getUint8(0);
      let decoder = new TextDecoder();
      switch (kind) {
        case this.KINDS.push:
          return this.decodePush(buffer, view, decoder);
        case this.KINDS.reply:
          return this.decodeReply(buffer, view, decoder);
        case this.KINDS.broadcast:
          return this.decodeBroadcast(buffer, view, decoder);
      }
    },
    decodePush(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let topicSize = view.getUint8(2);
      let eventSize = view.getUint8(3);
      let offset = this.HEADER_LENGTH + this.META_LENGTH - 1;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: joinRef, ref: null, topic, event, payload: data };
    },
    decodeReply(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let refSize = view.getUint8(2);
      let topicSize = view.getUint8(3);
      let eventSize = view.getUint8(4);
      let offset = this.HEADER_LENGTH + this.META_LENGTH;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let ref = decoder.decode(buffer.slice(offset, offset + refSize));
      offset = offset + refSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      let payload = { status: event, response: data };
      return { join_ref: joinRef, ref, topic, event: CHANNEL_EVENTS.reply, payload };
    },
    decodeBroadcast(buffer, view, decoder) {
      let topicSize = view.getUint8(1);
      let eventSize = view.getUint8(2);
      let offset = this.HEADER_LENGTH + 2;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: null, ref: null, topic, event, payload: data };
    }
  };
  var Socket = class {
    constructor(endPoint, opts = {}) {
      this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
      this.channels = [];
      this.sendBuffer = [];
      this.ref = 0;
      this.timeout = opts.timeout || DEFAULT_TIMEOUT;
      this.transport = opts.transport || global.WebSocket || LongPoll;
      this.establishedConnections = 0;
      this.defaultEncoder = serializer_default.encode.bind(serializer_default);
      this.defaultDecoder = serializer_default.decode.bind(serializer_default);
      this.closeWasClean = false;
      this.binaryType = opts.binaryType || "arraybuffer";
      this.connectClock = 1;
      if (this.transport !== LongPoll) {
        this.encode = opts.encode || this.defaultEncoder;
        this.decode = opts.decode || this.defaultDecoder;
      } else {
        this.encode = this.defaultEncoder;
        this.decode = this.defaultDecoder;
      }
      let awaitingConnectionOnPageShow = null;
      if (phxWindow && phxWindow.addEventListener) {
        phxWindow.addEventListener("pagehide", (_e) => {
          if (this.conn) {
            this.disconnect();
            awaitingConnectionOnPageShow = this.connectClock;
          }
        });
        phxWindow.addEventListener("pageshow", (_e) => {
          if (awaitingConnectionOnPageShow === this.connectClock) {
            awaitingConnectionOnPageShow = null;
            this.connect();
          }
        });
      }
      this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 3e4;
      this.rejoinAfterMs = (tries) => {
        if (opts.rejoinAfterMs) {
          return opts.rejoinAfterMs(tries);
        } else {
          return [1e3, 2e3, 5e3][tries - 1] || 1e4;
        }
      };
      this.reconnectAfterMs = (tries) => {
        if (opts.reconnectAfterMs) {
          return opts.reconnectAfterMs(tries);
        } else {
          return [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][tries - 1] || 5e3;
        }
      };
      this.logger = opts.logger || null;
      this.longpollerTimeout = opts.longpollerTimeout || 2e4;
      this.params = closure(opts.params || {});
      this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
      this.vsn = opts.vsn || DEFAULT_VSN;
      this.heartbeatTimer = null;
      this.pendingHeartbeatRef = null;
      this.reconnectTimer = new Timer(() => {
        this.teardown(() => this.connect());
      }, this.reconnectAfterMs);
    }
    replaceTransport(newTransport) {
      this.disconnect();
      this.transport = newTransport;
    }
    protocol() {
      return location.protocol.match(/^https/) ? "wss" : "ws";
    }
    endPointURL() {
      let uri = Ajax.appendParams(Ajax.appendParams(this.endPoint, this.params()), { vsn: this.vsn });
      if (uri.charAt(0) !== "/") {
        return uri;
      }
      if (uri.charAt(1) === "/") {
        return `${this.protocol()}:${uri}`;
      }
      return `${this.protocol()}://${location.host}${uri}`;
    }
    disconnect(callback, code, reason) {
      this.connectClock++;
      this.closeWasClean = true;
      this.reconnectTimer.reset();
      this.teardown(callback, code, reason);
    }
    connect(params) {
      this.connectClock++;
      if (params) {
        console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
        this.params = closure(params);
      }
      if (this.conn) {
        return;
      }
      this.closeWasClean = false;
      this.conn = new this.transport(this.endPointURL());
      this.conn.binaryType = this.binaryType;
      this.conn.timeout = this.longpollerTimeout;
      this.conn.onopen = () => this.onConnOpen();
      this.conn.onerror = (error) => this.onConnError(error);
      this.conn.onmessage = (event) => this.onConnMessage(event);
      this.conn.onclose = (event) => this.onConnClose(event);
    }
    log(kind, msg, data) {
      this.logger(kind, msg, data);
    }
    hasLogger() {
      return this.logger !== null;
    }
    onOpen(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.open.push([ref, callback]);
      return ref;
    }
    onClose(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.close.push([ref, callback]);
      return ref;
    }
    onError(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.error.push([ref, callback]);
      return ref;
    }
    onMessage(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.message.push([ref, callback]);
      return ref;
    }
    onConnOpen() {
      if (this.hasLogger())
        this.log("transport", `connected to ${this.endPointURL()}`);
      this.closeWasClean = false;
      this.establishedConnections++;
      this.flushSendBuffer();
      this.reconnectTimer.reset();
      this.resetHeartbeat();
      this.stateChangeCallbacks.open.forEach(([, callback]) => callback());
    }
    heartbeatTimeout() {
      if (this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null;
        if (this.hasLogger()) {
          this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
        }
        this.abnormalClose("heartbeat timeout");
      }
    }
    resetHeartbeat() {
      if (this.conn && this.conn.skipHeartbeat) {
        return;
      }
      this.pendingHeartbeatRef = null;
      clearTimeout(this.heartbeatTimer);
      setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
    }
    teardown(callback, code, reason) {
      if (!this.conn) {
        return callback && callback();
      }
      this.waitForBufferDone(() => {
        if (this.conn) {
          if (code) {
            this.conn.close(code, reason || "");
          } else {
            this.conn.close();
          }
        }
        this.waitForSocketClosed(() => {
          if (this.conn) {
            this.conn.onclose = function() {
            };
            this.conn = null;
          }
          callback && callback();
        });
      });
    }
    waitForBufferDone(callback, tries = 1) {
      if (tries === 5 || !this.conn || !this.conn.bufferedAmount) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForBufferDone(callback, tries + 1);
      }, 150 * tries);
    }
    waitForSocketClosed(callback, tries = 1) {
      if (tries === 5 || !this.conn || this.conn.readyState === SOCKET_STATES.closed) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForSocketClosed(callback, tries + 1);
      }, 150 * tries);
    }
    onConnClose(event) {
      let closeCode = event && event.code;
      if (this.hasLogger())
        this.log("transport", "close", event);
      this.triggerChanError();
      clearTimeout(this.heartbeatTimer);
      if (!this.closeWasClean && closeCode !== 1e3) {
        this.reconnectTimer.scheduleTimeout();
      }
      this.stateChangeCallbacks.close.forEach(([, callback]) => callback(event));
    }
    onConnError(error) {
      if (this.hasLogger())
        this.log("transport", error);
      let transportBefore = this.transport;
      let establishedBefore = this.establishedConnections;
      this.stateChangeCallbacks.error.forEach(([, callback]) => {
        callback(error, transportBefore, establishedBefore);
      });
      if (transportBefore === this.transport || establishedBefore > 0) {
        this.triggerChanError();
      }
    }
    triggerChanError() {
      this.channels.forEach((channel) => {
        if (!(channel.isErrored() || channel.isLeaving() || channel.isClosed())) {
          channel.trigger(CHANNEL_EVENTS.error);
        }
      });
    }
    connectionState() {
      switch (this.conn && this.conn.readyState) {
        case SOCKET_STATES.connecting:
          return "connecting";
        case SOCKET_STATES.open:
          return "open";
        case SOCKET_STATES.closing:
          return "closing";
        default:
          return "closed";
      }
    }
    isConnected() {
      return this.connectionState() === "open";
    }
    remove(channel) {
      this.off(channel.stateChangeRefs);
      this.channels = this.channels.filter((c) => c.joinRef() !== channel.joinRef());
    }
    off(refs) {
      for (let key in this.stateChangeCallbacks) {
        this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(([ref]) => {
          return refs.indexOf(ref) === -1;
        });
      }
    }
    channel(topic, chanParams = {}) {
      let chan = new Channel(topic, chanParams, this);
      this.channels.push(chan);
      return chan;
    }
    push(data) {
      if (this.hasLogger()) {
        let { topic, event, payload, ref, join_ref } = data;
        this.log("push", `${topic} ${event} (${join_ref}, ${ref})`, payload);
      }
      if (this.isConnected()) {
        this.encode(data, (result) => this.conn.send(result));
      } else {
        this.sendBuffer.push(() => this.encode(data, (result) => this.conn.send(result)));
      }
    }
    makeRef() {
      let newRef = this.ref + 1;
      if (newRef === this.ref) {
        this.ref = 0;
      } else {
        this.ref = newRef;
      }
      return this.ref.toString();
    }
    sendHeartbeat() {
      if (this.pendingHeartbeatRef && !this.isConnected()) {
        return;
      }
      this.pendingHeartbeatRef = this.makeRef();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
      this.heartbeatTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
    }
    abnormalClose(reason) {
      this.closeWasClean = false;
      if (this.isConnected()) {
        this.conn.close(WS_CLOSE_NORMAL, reason);
      }
    }
    flushSendBuffer() {
      if (this.isConnected() && this.sendBuffer.length > 0) {
        this.sendBuffer.forEach((callback) => callback());
        this.sendBuffer = [];
      }
    }
    onConnMessage(rawMessage) {
      this.decode(rawMessage.data, (msg) => {
        let { topic, event, payload, ref, join_ref } = msg;
        if (ref && ref === this.pendingHeartbeatRef) {
          clearTimeout(this.heartbeatTimer);
          this.pendingHeartbeatRef = null;
          setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
        }
        if (this.hasLogger())
          this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);
        for (let i = 0; i < this.channels.length; i++) {
          const channel = this.channels[i];
          if (!channel.isMember(topic, event, payload, join_ref)) {
            continue;
          }
          channel.trigger(event, payload, ref, join_ref);
        }
        for (let i = 0; i < this.stateChangeCallbacks.message.length; i++) {
          let [, callback] = this.stateChangeCallbacks.message[i];
          callback(msg);
        }
      });
    }
    leaveOpenTopic(topic) {
      let dupChannel = this.channels.find((c) => c.topic === topic && (c.isJoined() || c.isJoining()));
      if (dupChannel) {
        if (this.hasLogger())
          this.log("transport", `leaving duplicate topic "${topic}"`);
        dupChannel.leave();
      }
    }
  };

  // ../deps/phoenix_live_view/priv/static/phoenix_live_view.esm.js
  var CONSECUTIVE_RELOADS = "consecutive-reloads";
  var MAX_RELOADS = 10;
  var RELOAD_JITTER = [1e3, 3e3];
  var FAILSAFE_JITTER = 3e4;
  var PHX_EVENT_CLASSES = [
    "phx-click-loading",
    "phx-change-loading",
    "phx-submit-loading",
    "phx-keydown-loading",
    "phx-keyup-loading",
    "phx-blur-loading",
    "phx-focus-loading"
  ];
  var PHX_COMPONENT = "data-phx-component";
  var PHX_LIVE_LINK = "data-phx-link";
  var PHX_TRACK_STATIC = "track-static";
  var PHX_LINK_STATE = "data-phx-link-state";
  var PHX_REF = "data-phx-ref";
  var PHX_TRACK_UPLOADS = "track-uploads";
  var PHX_UPLOAD_REF = "data-phx-upload-ref";
  var PHX_PREFLIGHTED_REFS = "data-phx-preflighted-refs";
  var PHX_DONE_REFS = "data-phx-done-refs";
  var PHX_DROP_TARGET = "drop-target";
  var PHX_ACTIVE_ENTRY_REFS = "data-phx-active-refs";
  var PHX_LIVE_FILE_UPDATED = "phx:live-file:updated";
  var PHX_SKIP = "data-phx-skip";
  var PHX_PRUNE = "data-phx-prune";
  var PHX_PAGE_LOADING = "page-loading";
  var PHX_CONNECTED_CLASS = "phx-connected";
  var PHX_DISCONNECTED_CLASS = "phx-loading";
  var PHX_NO_FEEDBACK_CLASS = "phx-no-feedback";
  var PHX_ERROR_CLASS = "phx-error";
  var PHX_PARENT_ID = "data-phx-parent-id";
  var PHX_MAIN = "data-phx-main";
  var PHX_ROOT_ID = "data-phx-root-id";
  var PHX_TRIGGER_ACTION = "trigger-action";
  var PHX_FEEDBACK_FOR = "feedback-for";
  var PHX_HAS_FOCUSED = "phx-has-focused";
  var FOCUSABLE_INPUTS = ["text", "textarea", "number", "email", "password", "search", "tel", "url", "date", "time"];
  var CHECKABLE_INPUTS = ["checkbox", "radio"];
  var PHX_HAS_SUBMITTED = "phx-has-submitted";
  var PHX_SESSION = "data-phx-session";
  var PHX_VIEW_SELECTOR = `[${PHX_SESSION}]`;
  var PHX_STATIC = "data-phx-static";
  var PHX_READONLY = "data-phx-readonly";
  var PHX_DISABLED = "data-phx-disabled";
  var PHX_DISABLE_WITH = "disable-with";
  var PHX_DISABLE_WITH_RESTORE = "data-phx-disable-with-restore";
  var PHX_HOOK = "hook";
  var PHX_DEBOUNCE = "debounce";
  var PHX_THROTTLE = "throttle";
  var PHX_UPDATE = "update";
  var PHX_KEY = "key";
  var PHX_PRIVATE = "phxPrivate";
  var PHX_AUTO_RECOVER = "auto-recover";
  var PHX_LV_DEBUG = "phx:live-socket:debug";
  var PHX_LV_PROFILE = "phx:live-socket:profiling";
  var PHX_LV_LATENCY_SIM = "phx:live-socket:latency-sim";
  var PHX_PROGRESS = "progress";
  var LOADER_TIMEOUT = 1;
  var BEFORE_UNLOAD_LOADER_TIMEOUT = 200;
  var BINDING_PREFIX = "phx-";
  var PUSH_TIMEOUT = 3e4;
  var DEBOUNCE_TRIGGER = "debounce-trigger";
  var THROTTLED = "throttled";
  var DEBOUNCE_PREV_KEY = "debounce-prev-key";
  var DEFAULTS = {
    debounce: 300,
    throttle: 300
  };
  var DYNAMICS = "d";
  var STATIC = "s";
  var COMPONENTS = "c";
  var EVENTS = "e";
  var REPLY = "r";
  var TITLE = "t";
  var TEMPLATES = "p";
  var EntryUploader = class {
    constructor(entry, chunkSize, liveSocket2) {
      this.liveSocket = liveSocket2;
      this.entry = entry;
      this.offset = 0;
      this.chunkSize = chunkSize;
      this.chunkTimer = null;
      this.uploadChannel = liveSocket2.channel(`lvu:${entry.ref}`, { token: entry.metadata() });
    }
    error(reason) {
      clearTimeout(this.chunkTimer);
      this.uploadChannel.leave();
      this.entry.error(reason);
    }
    upload() {
      this.uploadChannel.onError((reason) => this.error(reason));
      this.uploadChannel.join().receive("ok", (_data) => this.readNextChunk()).receive("error", (reason) => this.error(reason));
    }
    isDone() {
      return this.offset >= this.entry.file.size;
    }
    readNextChunk() {
      let reader = new window.FileReader();
      let blob = this.entry.file.slice(this.offset, this.chunkSize + this.offset);
      reader.onload = (e) => {
        if (e.target.error === null) {
          this.offset += e.target.result.byteLength;
          this.pushChunk(e.target.result);
        } else {
          return logError("Read error: " + e.target.error);
        }
      };
      reader.readAsArrayBuffer(blob);
    }
    pushChunk(chunk) {
      if (!this.uploadChannel.isJoined()) {
        return;
      }
      this.uploadChannel.push("chunk", chunk).receive("ok", () => {
        this.entry.progress(this.offset / this.entry.file.size * 100);
        if (!this.isDone()) {
          this.chunkTimer = setTimeout(() => this.readNextChunk(), this.liveSocket.getLatencySim() || 0);
        }
      });
    }
  };
  var logError = (msg, obj) => console.error && console.error(msg, obj);
  var isCid = (cid) => {
    let type = typeof cid;
    return type === "number" || type === "string" && /^(0|[1-9]\d*)$/.test(cid);
  };
  function detectDuplicateIds() {
    let ids = /* @__PURE__ */ new Set();
    let elems = document.querySelectorAll("*[id]");
    for (let i = 0, len = elems.length; i < len; i++) {
      if (ids.has(elems[i].id)) {
        console.error(`Multiple IDs detected: ${elems[i].id}. Ensure unique element ids.`);
      } else {
        ids.add(elems[i].id);
      }
    }
  }
  var debug = (view, kind, msg, obj) => {
    if (view.liveSocket.isDebugEnabled()) {
      console.log(`${view.id} ${kind}: ${msg} - `, obj);
    }
  };
  var closure2 = (val) => typeof val === "function" ? val : function() {
    return val;
  };
  var clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  var closestPhxBinding = (el, binding, borderEl) => {
    do {
      if (el.matches(`[${binding}]`)) {
        return el;
      }
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1 && !(borderEl && borderEl.isSameNode(el) || el.matches(PHX_VIEW_SELECTOR)));
    return null;
  };
  var isObject = (obj) => {
    return obj !== null && typeof obj === "object" && !(obj instanceof Array);
  };
  var isEqualObj = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);
  var isEmpty = (obj) => {
    for (let x in obj) {
      return false;
    }
    return true;
  };
  var maybe = (el, callback) => el && callback(el);
  var channelUploader = function(entries, onError, resp, liveSocket2) {
    entries.forEach((entry) => {
      let entryUploader = new EntryUploader(entry, resp.config.chunk_size, liveSocket2);
      entryUploader.upload();
    });
  };
  var Browser = {
    canPushState() {
      return typeof history.pushState !== "undefined";
    },
    dropLocal(localStorage, namespace, subkey) {
      return localStorage.removeItem(this.localKey(namespace, subkey));
    },
    updateLocal(localStorage, namespace, subkey, initial, func) {
      let current = this.getLocal(localStorage, namespace, subkey);
      let key = this.localKey(namespace, subkey);
      let newVal = current === null ? initial : func(current);
      localStorage.setItem(key, JSON.stringify(newVal));
      return newVal;
    },
    getLocal(localStorage, namespace, subkey) {
      return JSON.parse(localStorage.getItem(this.localKey(namespace, subkey)));
    },
    updateCurrentState(callback) {
      if (!this.canPushState()) {
        return;
      }
      history.replaceState(callback(history.state || {}), "", window.location.href);
    },
    pushState(kind, meta, to) {
      if (this.canPushState()) {
        if (to !== window.location.href) {
          if (meta.type == "redirect" && meta.scroll) {
            let currentState = history.state || {};
            currentState.scroll = meta.scroll;
            history.replaceState(currentState, "", window.location.href);
          }
          delete meta.scroll;
          history[kind + "State"](meta, "", to || null);
          let hashEl = this.getHashTargetEl(window.location.hash);
          if (hashEl) {
            hashEl.scrollIntoView();
          } else if (meta.type === "redirect") {
            window.scroll(0, 0);
          }
        }
      } else {
        this.redirect(to);
      }
    },
    setCookie(name, value) {
      document.cookie = `${name}=${value}`;
    },
    getCookie(name) {
      return document.cookie.replace(new RegExp(`(?:(?:^|.*;s*)${name}s*=s*([^;]*).*$)|^.*$`), "$1");
    },
    redirect(toURL, flash) {
      if (flash) {
        Browser.setCookie("__phoenix_flash__", flash + "; max-age=60000; path=/");
      }
      window.location = toURL;
    },
    localKey(namespace, subkey) {
      return `${namespace}-${subkey}`;
    },
    getHashTargetEl(maybeHash) {
      let hash = maybeHash.toString().substring(1);
      if (hash === "") {
        return;
      }
      return document.getElementById(hash) || document.querySelector(`a[name="${hash}"]`);
    }
  };
  var browser_default = Browser;
  var DOM = {
    byId(id) {
      return document.getElementById(id) || logError(`no id found for ${id}`);
    },
    removeClass(el, className) {
      el.classList.remove(className);
      if (el.classList.length === 0) {
        el.removeAttribute("class");
      }
    },
    all(node, query, callback) {
      if (!node) {
        return [];
      }
      let array = Array.from(node.querySelectorAll(query));
      return callback ? array.forEach(callback) : array;
    },
    childNodeLength(html) {
      let template = document.createElement("template");
      template.innerHTML = html;
      return template.content.childElementCount;
    },
    isUploadInput(el) {
      return el.type === "file" && el.getAttribute(PHX_UPLOAD_REF) !== null;
    },
    findUploadInputs(node) {
      return this.all(node, `input[type="file"][${PHX_UPLOAD_REF}]`);
    },
    findComponentNodeList(node, cid) {
      return this.filterWithinSameLiveView(this.all(node, `[${PHX_COMPONENT}="${cid}"]`), node);
    },
    isPhxDestroyed(node) {
      return node.id && DOM.private(node, "destroyed") ? true : false;
    },
    markPhxChildDestroyed(el) {
      if (this.isPhxChild(el)) {
        el.setAttribute(PHX_SESSION, "");
      }
      this.putPrivate(el, "destroyed", true);
    },
    findPhxChildrenInFragment(html, parentId) {
      let template = document.createElement("template");
      template.innerHTML = html;
      return this.findPhxChildren(template.content, parentId);
    },
    isIgnored(el, phxUpdate) {
      return (el.getAttribute(phxUpdate) || el.getAttribute("data-phx-update")) === "ignore";
    },
    isPhxUpdate(el, phxUpdate, updateTypes) {
      return el.getAttribute && updateTypes.indexOf(el.getAttribute(phxUpdate)) >= 0;
    },
    findPhxChildren(el, parentId) {
      return this.all(el, `${PHX_VIEW_SELECTOR}[${PHX_PARENT_ID}="${parentId}"]`);
    },
    findParentCIDs(node, cids) {
      let initial = new Set(cids);
      return cids.reduce((acc, cid) => {
        let selector = `[${PHX_COMPONENT}="${cid}"] [${PHX_COMPONENT}]`;
        this.filterWithinSameLiveView(this.all(node, selector), node).map((el) => parseInt(el.getAttribute(PHX_COMPONENT))).forEach((childCID) => acc.delete(childCID));
        return acc;
      }, initial);
    },
    filterWithinSameLiveView(nodes, parent) {
      if (parent.querySelector(PHX_VIEW_SELECTOR)) {
        return nodes.filter((el) => this.withinSameLiveView(el, parent));
      } else {
        return nodes;
      }
    },
    withinSameLiveView(node, parent) {
      while (node = node.parentNode) {
        if (node.isSameNode(parent)) {
          return true;
        }
        if (node.getAttribute(PHX_SESSION) !== null) {
          return false;
        }
      }
    },
    private(el, key) {
      return el[PHX_PRIVATE] && el[PHX_PRIVATE][key];
    },
    deletePrivate(el, key) {
      el[PHX_PRIVATE] && delete el[PHX_PRIVATE][key];
    },
    putPrivate(el, key, value) {
      if (!el[PHX_PRIVATE]) {
        el[PHX_PRIVATE] = {};
      }
      el[PHX_PRIVATE][key] = value;
    },
    updatePrivate(el, key, defaultVal, updateFunc) {
      let existing = this.private(el, key);
      if (existing === void 0) {
        this.putPrivate(el, key, updateFunc(defaultVal));
      } else {
        this.putPrivate(el, key, updateFunc(existing));
      }
    },
    copyPrivates(target, source) {
      if (source[PHX_PRIVATE]) {
        target[PHX_PRIVATE] = source[PHX_PRIVATE];
      }
    },
    putTitle(str) {
      let titleEl = document.querySelector("title");
      let { prefix, suffix } = titleEl.dataset;
      document.title = `${prefix || ""}${str}${suffix || ""}`;
    },
    debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, callback) {
      let debounce = el.getAttribute(phxDebounce);
      let throttle = el.getAttribute(phxThrottle);
      if (debounce === "") {
        debounce = defaultDebounce;
      }
      if (throttle === "") {
        throttle = defaultThrottle;
      }
      let value = debounce || throttle;
      switch (value) {
        case null:
          return callback();
        case "blur":
          if (this.once(el, "debounce-blur")) {
            el.addEventListener("blur", () => callback());
          }
          return;
        default:
          let timeout = parseInt(value);
          let trigger = () => throttle ? this.deletePrivate(el, THROTTLED) : callback();
          let currentCycle = this.incCycle(el, DEBOUNCE_TRIGGER, trigger);
          if (isNaN(timeout)) {
            return logError(`invalid throttle/debounce value: ${value}`);
          }
          if (throttle) {
            let newKeyDown = false;
            if (event.type === "keydown") {
              let prevKey = this.private(el, DEBOUNCE_PREV_KEY);
              this.putPrivate(el, DEBOUNCE_PREV_KEY, event.key);
              newKeyDown = prevKey !== event.key;
            }
            if (!newKeyDown && this.private(el, THROTTLED)) {
              return false;
            } else {
              callback();
              this.putPrivate(el, THROTTLED, true);
              setTimeout(() => this.triggerCycle(el, DEBOUNCE_TRIGGER), timeout);
            }
          } else {
            setTimeout(() => this.triggerCycle(el, DEBOUNCE_TRIGGER, currentCycle), timeout);
          }
          let form = el.form;
          if (form && this.once(form, "bind-debounce")) {
            form.addEventListener("submit", () => {
              Array.from(new FormData(form).entries(), ([name]) => {
                let input = form.querySelector(`[name="${name}"]`);
                this.incCycle(input, DEBOUNCE_TRIGGER);
                this.deletePrivate(input, THROTTLED);
              });
            });
          }
          if (this.once(el, "bind-debounce")) {
            el.addEventListener("blur", () => this.triggerCycle(el, DEBOUNCE_TRIGGER));
          }
      }
    },
    triggerCycle(el, key, currentCycle) {
      let [cycle, trigger] = this.private(el, key);
      if (!currentCycle) {
        currentCycle = cycle;
      }
      if (currentCycle === cycle) {
        this.incCycle(el, key);
        trigger();
      }
    },
    once(el, key) {
      if (this.private(el, key) === true) {
        return false;
      }
      this.putPrivate(el, key, true);
      return true;
    },
    incCycle(el, key, trigger = function() {
    }) {
      let [currentCycle] = this.private(el, key) || [0, trigger];
      currentCycle++;
      this.putPrivate(el, key, [currentCycle, trigger]);
      return currentCycle;
    },
    discardError(container, el, phxFeedbackFor) {
      let field = el.getAttribute && el.getAttribute(phxFeedbackFor);
      let input = field && container.querySelector(`[id="${field}"], [name="${field}"]`);
      if (!input) {
        return;
      }
      if (!(this.private(input, PHX_HAS_FOCUSED) || this.private(input.form, PHX_HAS_SUBMITTED))) {
        el.classList.add(PHX_NO_FEEDBACK_CLASS);
      }
    },
    showError(inputEl, phxFeedbackFor) {
      if (inputEl.id || inputEl.name) {
        this.all(inputEl.form, `[${phxFeedbackFor}="${inputEl.id}"], [${phxFeedbackFor}="${inputEl.name}"]`, (el) => {
          this.removeClass(el, PHX_NO_FEEDBACK_CLASS);
        });
      }
    },
    isPhxChild(node) {
      return node.getAttribute && node.getAttribute(PHX_PARENT_ID);
    },
    firstPhxChild(el) {
      return this.isPhxChild(el) ? el : this.all(el, `[${PHX_PARENT_ID}]`)[0];
    },
    dispatchEvent(target, eventString, detail = {}) {
      let event = new CustomEvent(eventString, { bubbles: true, cancelable: true, detail });
      target.dispatchEvent(event);
    },
    cloneNode(node, html) {
      if (typeof html === "undefined") {
        return node.cloneNode(true);
      } else {
        let cloned = node.cloneNode(false);
        cloned.innerHTML = html;
        return cloned;
      }
    },
    mergeAttrs(target, source, opts = {}) {
      let exclude = opts.exclude || [];
      let isIgnored = opts.isIgnored;
      let sourceAttrs = source.attributes;
      for (let i = sourceAttrs.length - 1; i >= 0; i--) {
        let name = sourceAttrs[i].name;
        if (exclude.indexOf(name) < 0) {
          target.setAttribute(name, source.getAttribute(name));
        }
      }
      let targetAttrs = target.attributes;
      for (let i = targetAttrs.length - 1; i >= 0; i--) {
        let name = targetAttrs[i].name;
        if (isIgnored) {
          if (name.startsWith("data-") && !source.hasAttribute(name)) {
            target.removeAttribute(name);
          }
        } else {
          if (!source.hasAttribute(name)) {
            target.removeAttribute(name);
          }
        }
      }
    },
    mergeFocusedInput(target, source) {
      if (!(target instanceof HTMLSelectElement)) {
        DOM.mergeAttrs(target, source, { except: ["value"] });
      }
      if (source.readOnly) {
        target.setAttribute("readonly", true);
      } else {
        target.removeAttribute("readonly");
      }
    },
    hasSelectionRange(el) {
      return el.setSelectionRange && (el.type === "text" || el.type === "textarea");
    },
    restoreFocus(focused, selectionStart, selectionEnd) {
      if (!DOM.isTextualInput(focused)) {
        return;
      }
      let wasFocused = focused.matches(":focus");
      if (focused.readOnly) {
        focused.blur();
      }
      if (!wasFocused) {
        focused.focus();
      }
      if (this.hasSelectionRange(focused)) {
        focused.setSelectionRange(selectionStart, selectionEnd);
      }
    },
    isFormInput(el) {
      return /^(?:input|select|textarea)$/i.test(el.tagName) && el.type !== "button";
    },
    syncAttrsToProps(el) {
      if (el instanceof HTMLInputElement && CHECKABLE_INPUTS.indexOf(el.type.toLocaleLowerCase()) >= 0) {
        el.checked = el.getAttribute("checked") !== null;
      }
    },
    isTextualInput(el) {
      return FOCUSABLE_INPUTS.indexOf(el.type) >= 0;
    },
    isNowTriggerFormExternal(el, phxTriggerExternal) {
      return el.getAttribute && el.getAttribute(phxTriggerExternal) !== null;
    },
    syncPendingRef(fromEl, toEl, disableWith) {
      let ref = fromEl.getAttribute(PHX_REF);
      if (ref === null) {
        return true;
      }
      if (DOM.isFormInput(fromEl) || fromEl.getAttribute(disableWith) !== null) {
        if (DOM.isUploadInput(fromEl)) {
          DOM.mergeAttrs(fromEl, toEl, { isIgnored: true });
        }
        DOM.putPrivate(fromEl, PHX_REF, toEl);
        return false;
      } else {
        PHX_EVENT_CLASSES.forEach((className) => {
          fromEl.classList.contains(className) && toEl.classList.add(className);
        });
        toEl.setAttribute(PHX_REF, ref);
        return true;
      }
    },
    cleanChildNodes(container, phxUpdate) {
      if (DOM.isPhxUpdate(container, phxUpdate, ["append", "prepend"])) {
        let toRemove = [];
        container.childNodes.forEach((childNode) => {
          if (!childNode.id) {
            let isEmptyTextNode = childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() === "";
            if (!isEmptyTextNode) {
              logError(`only HTML element tags with an id are allowed inside containers with phx-update.

removing illegal node: "${(childNode.outerHTML || childNode.nodeValue).trim()}"

`);
            }
            toRemove.push(childNode);
          }
        });
        toRemove.forEach((childNode) => childNode.remove());
      }
    },
    replaceRootContainer(container, tagName, attrs) {
      let retainedAttrs = /* @__PURE__ */ new Set(["id", PHX_SESSION, PHX_STATIC, PHX_MAIN, PHX_ROOT_ID]);
      if (container.tagName.toLowerCase() === tagName.toLowerCase()) {
        Array.from(container.attributes).filter((attr) => !retainedAttrs.has(attr.name.toLowerCase())).forEach((attr) => container.removeAttribute(attr.name));
        Object.keys(attrs).filter((name) => !retainedAttrs.has(name.toLowerCase())).forEach((attr) => container.setAttribute(attr, attrs[attr]));
        return container;
      } else {
        let newContainer = document.createElement(tagName);
        Object.keys(attrs).forEach((attr) => newContainer.setAttribute(attr, attrs[attr]));
        retainedAttrs.forEach((attr) => newContainer.setAttribute(attr, container.getAttribute(attr)));
        newContainer.innerHTML = container.innerHTML;
        container.replaceWith(newContainer);
        return newContainer;
      }
    },
    getSticky(el, name, defaultVal) {
      let op = (DOM.private(el, "sticky") || []).find(([existingName]) => name === existingName);
      if (op) {
        let [_name, _op, stashedResult] = op;
        return stashedResult;
      } else {
        return typeof defaultVal === "function" ? defaultVal() : defaultVal;
      }
    },
    deleteSticky(el, name) {
      this.updatePrivate(el, "sticky", [], (ops) => {
        return ops.filter(([existingName, _]) => existingName !== name);
      });
    },
    putSticky(el, name, op) {
      let stashedResult = op(el);
      this.updatePrivate(el, "sticky", [], (ops) => {
        let existingIndex = ops.findIndex(([existingName]) => name === existingName);
        if (existingIndex >= 0) {
          ops[existingIndex] = [name, op, stashedResult];
        } else {
          ops.push([name, op, stashedResult]);
        }
        return ops;
      });
    },
    applyStickyOperations(el) {
      let ops = DOM.private(el, "sticky");
      if (!ops) {
        return;
      }
      ops.forEach(([name, op, _stashed]) => this.putSticky(el, name, op));
    }
  };
  var dom_default = DOM;
  var UploadEntry = class {
    static isActive(fileEl, file) {
      let isNew = file._phxRef === void 0;
      let activeRefs = fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      let isActive = activeRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return file.size > 0 && (isNew || isActive);
    }
    static isPreflighted(fileEl, file) {
      let preflightedRefs = fileEl.getAttribute(PHX_PREFLIGHTED_REFS).split(",");
      let isPreflighted = preflightedRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return isPreflighted && this.isActive(fileEl, file);
    }
    constructor(fileEl, file, view) {
      this.ref = LiveUploader.genFileRef(file);
      this.fileEl = fileEl;
      this.file = file;
      this.view = view;
      this.meta = null;
      this._isCancelled = false;
      this._isDone = false;
      this._progress = 0;
      this._lastProgressSent = -1;
      this._onDone = function() {
      };
      this._onElUpdated = this.onElUpdated.bind(this);
      this.fileEl.addEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
    }
    metadata() {
      return this.meta;
    }
    progress(progress) {
      this._progress = Math.floor(progress);
      if (this._progress > this._lastProgressSent) {
        if (this._progress >= 100) {
          this._progress = 100;
          this._lastProgressSent = 100;
          this._isDone = true;
          this.view.pushFileProgress(this.fileEl, this.ref, 100, () => {
            LiveUploader.untrackFile(this.fileEl, this.file);
            this._onDone();
          });
        } else {
          this._lastProgressSent = this._progress;
          this.view.pushFileProgress(this.fileEl, this.ref, this._progress);
        }
      }
    }
    cancel() {
      this._isCancelled = true;
      this._isDone = true;
      this._onDone();
    }
    isDone() {
      return this._isDone;
    }
    error(reason = "failed") {
      this.view.pushFileProgress(this.fileEl, this.ref, { error: reason });
      LiveUploader.clearFiles(this.fileEl);
    }
    onDone(callback) {
      this._onDone = () => {
        this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
        callback();
      };
    }
    onElUpdated() {
      let activeRefs = this.fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      if (activeRefs.indexOf(this.ref) === -1) {
        this.cancel();
      }
    }
    toPreflightPayload() {
      return {
        last_modified: this.file.lastModified,
        name: this.file.name,
        size: this.file.size,
        type: this.file.type,
        ref: this.ref
      };
    }
    uploader(uploaders) {
      if (this.meta.uploader) {
        let callback = uploaders[this.meta.uploader] || logError(`no uploader configured for ${this.meta.uploader}`);
        return { name: this.meta.uploader, callback };
      } else {
        return { name: "channel", callback: channelUploader };
      }
    }
    zipPostFlight(resp) {
      this.meta = resp.entries[this.ref];
      if (!this.meta) {
        logError(`no preflight upload response returned with ref ${this.ref}`, { input: this.fileEl, response: resp });
      }
    }
  };
  var liveUploaderFileRef = 0;
  var LiveUploader = class {
    static genFileRef(file) {
      let ref = file._phxRef;
      if (ref !== void 0) {
        return ref;
      } else {
        file._phxRef = (liveUploaderFileRef++).toString();
        return file._phxRef;
      }
    }
    static getEntryDataURL(inputEl, ref, callback) {
      let file = this.activeFiles(inputEl).find((file2) => this.genFileRef(file2) === ref);
      callback(URL.createObjectURL(file));
    }
    static hasUploadsInProgress(formEl) {
      let active = 0;
      dom_default.findUploadInputs(formEl).forEach((input) => {
        if (input.getAttribute(PHX_PREFLIGHTED_REFS) !== input.getAttribute(PHX_DONE_REFS)) {
          active++;
        }
      });
      return active > 0;
    }
    static serializeUploads(inputEl) {
      let files = this.activeFiles(inputEl);
      let fileData = {};
      files.forEach((file) => {
        let entry = { path: inputEl.name };
        let uploadRef = inputEl.getAttribute(PHX_UPLOAD_REF);
        fileData[uploadRef] = fileData[uploadRef] || [];
        entry.ref = this.genFileRef(file);
        entry.name = file.name || entry.ref;
        entry.type = file.type;
        entry.size = file.size;
        fileData[uploadRef].push(entry);
      });
      return fileData;
    }
    static clearFiles(inputEl) {
      inputEl.value = null;
      inputEl.removeAttribute(PHX_UPLOAD_REF);
      dom_default.putPrivate(inputEl, "files", []);
    }
    static untrackFile(inputEl, file) {
      dom_default.putPrivate(inputEl, "files", dom_default.private(inputEl, "files").filter((f) => !Object.is(f, file)));
    }
    static trackFiles(inputEl, files) {
      if (inputEl.getAttribute("multiple") !== null) {
        let newFiles = files.filter((file) => !this.activeFiles(inputEl).find((f) => Object.is(f, file)));
        dom_default.putPrivate(inputEl, "files", this.activeFiles(inputEl).concat(newFiles));
        inputEl.value = null;
      } else {
        dom_default.putPrivate(inputEl, "files", files);
      }
    }
    static activeFileInputs(formEl) {
      let fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter((el) => el.files && this.activeFiles(el).length > 0);
    }
    static activeFiles(input) {
      return (dom_default.private(input, "files") || []).filter((f) => UploadEntry.isActive(input, f));
    }
    static inputsAwaitingPreflight(formEl) {
      let fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter((input) => this.filesAwaitingPreflight(input).length > 0);
    }
    static filesAwaitingPreflight(input) {
      return this.activeFiles(input).filter((f) => !UploadEntry.isPreflighted(input, f));
    }
    constructor(inputEl, view, onComplete) {
      this.view = view;
      this.onComplete = onComplete;
      this._entries = Array.from(LiveUploader.filesAwaitingPreflight(inputEl) || []).map((file) => new UploadEntry(inputEl, file, view));
      this.numEntriesInProgress = this._entries.length;
    }
    entries() {
      return this._entries;
    }
    initAdapterUpload(resp, onError, liveSocket2) {
      this._entries = this._entries.map((entry) => {
        entry.zipPostFlight(resp);
        entry.onDone(() => {
          this.numEntriesInProgress--;
          if (this.numEntriesInProgress === 0) {
            this.onComplete();
          }
        });
        return entry;
      });
      let groupedEntries = this._entries.reduce((acc, entry) => {
        let { name, callback } = entry.uploader(liveSocket2.uploaders);
        acc[name] = acc[name] || { callback, entries: [] };
        acc[name].entries.push(entry);
        return acc;
      }, {});
      for (let name in groupedEntries) {
        let { callback, entries } = groupedEntries[name];
        callback(entries, onError, resp, liveSocket2);
      }
    }
  };
  var Hooks = {
    LiveFileUpload: {
      activeRefs() {
        return this.el.getAttribute(PHX_ACTIVE_ENTRY_REFS);
      },
      preflightedRefs() {
        return this.el.getAttribute(PHX_PREFLIGHTED_REFS);
      },
      mounted() {
        this.preflightedWas = this.preflightedRefs();
      },
      updated() {
        let newPreflights = this.preflightedRefs();
        if (this.preflightedWas !== newPreflights) {
          this.preflightedWas = newPreflights;
          if (newPreflights === "") {
            this.__view.cancelSubmit(this.el.form);
          }
        }
        if (this.activeRefs() === "") {
          this.el.value = null;
        }
        this.el.dispatchEvent(new CustomEvent(PHX_LIVE_FILE_UPDATED));
      }
    },
    LiveImgPreview: {
      mounted() {
        this.ref = this.el.getAttribute("data-phx-entry-ref");
        this.inputEl = document.getElementById(this.el.getAttribute(PHX_UPLOAD_REF));
        LiveUploader.getEntryDataURL(this.inputEl, this.ref, (url) => {
          this.url = url;
          this.el.src = url;
        });
      },
      destroyed() {
        URL.revokeObjectURL(this.url);
      }
    }
  };
  var hooks_default = Hooks;
  var DOMPostMorphRestorer = class {
    constructor(containerBefore, containerAfter, updateType) {
      let idsBefore = /* @__PURE__ */ new Set();
      let idsAfter = new Set([...containerAfter.children].map((child) => child.id));
      let elementsToModify = [];
      Array.from(containerBefore.children).forEach((child) => {
        if (child.id) {
          idsBefore.add(child.id);
          if (idsAfter.has(child.id)) {
            let previousElementId = child.previousElementSibling && child.previousElementSibling.id;
            elementsToModify.push({ elementId: child.id, previousElementId });
          }
        }
      });
      this.containerId = containerAfter.id;
      this.updateType = updateType;
      this.elementsToModify = elementsToModify;
      this.elementIdsToAdd = [...idsAfter].filter((id) => !idsBefore.has(id));
    }
    perform() {
      let container = dom_default.byId(this.containerId);
      this.elementsToModify.forEach((elementToModify) => {
        if (elementToModify.previousElementId) {
          maybe(document.getElementById(elementToModify.previousElementId), (previousElem) => {
            maybe(document.getElementById(elementToModify.elementId), (elem) => {
              let isInRightPlace = elem.previousElementSibling && elem.previousElementSibling.id == previousElem.id;
              if (!isInRightPlace) {
                previousElem.insertAdjacentElement("afterend", elem);
              }
            });
          });
        } else {
          maybe(document.getElementById(elementToModify.elementId), (elem) => {
            let isInRightPlace = elem.previousElementSibling == null;
            if (!isInRightPlace) {
              container.insertAdjacentElement("afterbegin", elem);
            }
          });
        }
      });
      if (this.updateType == "prepend") {
        this.elementIdsToAdd.reverse().forEach((elemId) => {
          maybe(document.getElementById(elemId), (elem) => container.insertAdjacentElement("afterbegin", elem));
        });
      }
    }
  };
  var DOCUMENT_FRAGMENT_NODE = 11;
  function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;
    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return;
    }
    for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
      attr = toNodeAttrs[i];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      attrValue = attr.value;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
        if (fromValue !== attrValue) {
          if (attr.prefix === "xmlns") {
            attrName = attr.name;
          }
          fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
        }
      } else {
        fromValue = fromNode.getAttribute(attrName);
        if (fromValue !== attrValue) {
          fromNode.setAttribute(attrName, attrValue);
        }
      }
    }
    var fromNodeAttrs = fromNode.attributes;
    for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
      attr = fromNodeAttrs[d];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
          fromNode.removeAttributeNS(attrNamespaceURI, attrName);
        }
      } else {
        if (!toNode.hasAttribute(attrName)) {
          fromNode.removeAttribute(attrName);
        }
      }
    }
  }
  var range;
  var NS_XHTML = "http://www.w3.org/1999/xhtml";
  var doc = typeof document === "undefined" ? void 0 : document;
  var HAS_TEMPLATE_SUPPORT = !!doc && "content" in doc.createElement("template");
  var HAS_RANGE_SUPPORT = !!doc && doc.createRange && "createContextualFragment" in doc.createRange();
  function createFragmentFromTemplate(str) {
    var template = doc.createElement("template");
    template.innerHTML = str;
    return template.content.childNodes[0];
  }
  function createFragmentFromRange(str) {
    if (!range) {
      range = doc.createRange();
      range.selectNode(doc.body);
    }
    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
  }
  function createFragmentFromWrap(str) {
    var fragment = doc.createElement("body");
    fragment.innerHTML = str;
    return fragment.childNodes[0];
  }
  function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
      return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
      return createFragmentFromRange(str);
    }
    return createFragmentFromWrap(str);
  }
  function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;
    if (fromNodeName === toNodeName) {
      return true;
    }
    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0);
    if (fromCodeStart <= 90 && toCodeStart >= 97) {
      return fromNodeName === toNodeName.toUpperCase();
    } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
      return toNodeName === fromNodeName.toUpperCase();
    } else {
      return false;
    }
  }
  function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
  }
  function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
      var nextChild = curChild.nextSibling;
      toEl.appendChild(curChild);
      curChild = nextChild;
    }
    return toEl;
  }
  function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
      fromEl[name] = toEl[name];
      if (fromEl[name]) {
        fromEl.setAttribute(name, "");
      } else {
        fromEl.removeAttribute(name);
      }
    }
  }
  var specialElHandlers = {
    OPTION: function(fromEl, toEl) {
      var parentNode = fromEl.parentNode;
      if (parentNode) {
        var parentName = parentNode.nodeName.toUpperCase();
        if (parentName === "OPTGROUP") {
          parentNode = parentNode.parentNode;
          parentName = parentNode && parentNode.nodeName.toUpperCase();
        }
        if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) {
          if (fromEl.hasAttribute("selected") && !toEl.selected) {
            fromEl.setAttribute("selected", "selected");
            fromEl.removeAttribute("selected");
          }
          parentNode.selectedIndex = -1;
        }
      }
      syncBooleanAttrProp(fromEl, toEl, "selected");
    },
    INPUT: function(fromEl, toEl) {
      syncBooleanAttrProp(fromEl, toEl, "checked");
      syncBooleanAttrProp(fromEl, toEl, "disabled");
      if (fromEl.value !== toEl.value) {
        fromEl.value = toEl.value;
      }
      if (!toEl.hasAttribute("value")) {
        fromEl.removeAttribute("value");
      }
    },
    TEXTAREA: function(fromEl, toEl) {
      var newValue = toEl.value;
      if (fromEl.value !== newValue) {
        fromEl.value = newValue;
      }
      var firstChild = fromEl.firstChild;
      if (firstChild) {
        var oldValue = firstChild.nodeValue;
        if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) {
          return;
        }
        firstChild.nodeValue = newValue;
      }
    },
    SELECT: function(fromEl, toEl) {
      if (!toEl.hasAttribute("multiple")) {
        var selectedIndex = -1;
        var i = 0;
        var curChild = fromEl.firstChild;
        var optgroup;
        var nodeName;
        while (curChild) {
          nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
          if (nodeName === "OPTGROUP") {
            optgroup = curChild;
            curChild = optgroup.firstChild;
          } else {
            if (nodeName === "OPTION") {
              if (curChild.hasAttribute("selected")) {
                selectedIndex = i;
                break;
              }
              i++;
            }
            curChild = curChild.nextSibling;
            if (!curChild && optgroup) {
              curChild = optgroup.nextSibling;
              optgroup = null;
            }
          }
        }
        fromEl.selectedIndex = selectedIndex;
      }
    }
  };
  var ELEMENT_NODE = 1;
  var DOCUMENT_FRAGMENT_NODE$1 = 11;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  function noop() {
  }
  function defaultGetNodeKey(node) {
    if (node) {
      return node.getAttribute && node.getAttribute("id") || node.id;
    }
  }
  function morphdomFactory(morphAttrs2) {
    return function morphdom2(fromNode, toNode, options) {
      if (!options) {
        options = {};
      }
      if (typeof toNode === "string") {
        if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML" || fromNode.nodeName === "BODY") {
          var toNodeHtml = toNode;
          toNode = doc.createElement("html");
          toNode.innerHTML = toNodeHtml;
        } else {
          toNode = toElement(toNode);
        }
      }
      var getNodeKey = options.getNodeKey || defaultGetNodeKey;
      var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
      var onNodeAdded = options.onNodeAdded || noop;
      var onBeforeElUpdated = options.onBeforeElUpdated || noop;
      var onElUpdated = options.onElUpdated || noop;
      var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
      var onNodeDiscarded = options.onNodeDiscarded || noop;
      var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
      var childrenOnly = options.childrenOnly === true;
      var fromNodesLookup = Object.create(null);
      var keyedRemovalList = [];
      function addKeyedRemoval(key) {
        keyedRemovalList.push(key);
      }
      function walkDiscardedChildNodes(node, skipKeyedNodes) {
        if (node.nodeType === ELEMENT_NODE) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = void 0;
            if (skipKeyedNodes && (key = getNodeKey(curChild))) {
              addKeyedRemoval(key);
            } else {
              onNodeDiscarded(curChild);
              if (curChild.firstChild) {
                walkDiscardedChildNodes(curChild, skipKeyedNodes);
              }
            }
            curChild = curChild.nextSibling;
          }
        }
      }
      function removeNode(node, parentNode, skipKeyedNodes) {
        if (onBeforeNodeDiscarded(node) === false) {
          return;
        }
        if (parentNode) {
          parentNode.removeChild(node);
        }
        onNodeDiscarded(node);
        walkDiscardedChildNodes(node, skipKeyedNodes);
      }
      function indexTree(node) {
        if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = getNodeKey(curChild);
            if (key) {
              fromNodesLookup[key] = curChild;
            }
            indexTree(curChild);
            curChild = curChild.nextSibling;
          }
        }
      }
      indexTree(fromNode);
      function handleNodeAdded(el) {
        onNodeAdded(el);
        var curChild = el.firstChild;
        while (curChild) {
          var nextSibling = curChild.nextSibling;
          var key = getNodeKey(curChild);
          if (key) {
            var unmatchedFromEl = fromNodesLookup[key];
            if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
              curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
              morphEl(unmatchedFromEl, curChild);
            } else {
              handleNodeAdded(curChild);
            }
          } else {
            handleNodeAdded(curChild);
          }
          curChild = nextSibling;
        }
      }
      function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
        while (curFromNodeChild) {
          var fromNextSibling = curFromNodeChild.nextSibling;
          if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
            addKeyedRemoval(curFromNodeKey);
          } else {
            removeNode(curFromNodeChild, fromEl, true);
          }
          curFromNodeChild = fromNextSibling;
        }
      }
      function morphEl(fromEl, toEl, childrenOnly2) {
        var toElKey = getNodeKey(toEl);
        if (toElKey) {
          delete fromNodesLookup[toElKey];
        }
        if (!childrenOnly2) {
          if (onBeforeElUpdated(fromEl, toEl) === false) {
            return;
          }
          morphAttrs2(fromEl, toEl);
          onElUpdated(fromEl);
          if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
            return;
          }
        }
        if (fromEl.nodeName !== "TEXTAREA") {
          morphChildren(fromEl, toEl);
        } else {
          specialElHandlers.TEXTAREA(fromEl, toEl);
        }
      }
      function morphChildren(fromEl, toEl) {
        var curToNodeChild = toEl.firstChild;
        var curFromNodeChild = fromEl.firstChild;
        var curToNodeKey;
        var curFromNodeKey;
        var fromNextSibling;
        var toNextSibling;
        var matchingFromEl;
        outer:
          while (curToNodeChild) {
            toNextSibling = curToNodeChild.nextSibling;
            curToNodeKey = getNodeKey(curToNodeChild);
            while (curFromNodeChild) {
              fromNextSibling = curFromNodeChild.nextSibling;
              if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              curFromNodeKey = getNodeKey(curFromNodeChild);
              var curFromNodeType = curFromNodeChild.nodeType;
              var isCompatible = void 0;
              if (curFromNodeType === curToNodeChild.nodeType) {
                if (curFromNodeType === ELEMENT_NODE) {
                  if (curToNodeKey) {
                    if (curToNodeKey !== curFromNodeKey) {
                      if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                        if (fromNextSibling === matchingFromEl) {
                          isCompatible = false;
                        } else {
                          fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                          if (curFromNodeKey) {
                            addKeyedRemoval(curFromNodeKey);
                          } else {
                            removeNode(curFromNodeChild, fromEl, true);
                          }
                          curFromNodeChild = matchingFromEl;
                        }
                      } else {
                        isCompatible = false;
                      }
                    }
                  } else if (curFromNodeKey) {
                    isCompatible = false;
                  }
                  isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                  if (isCompatible) {
                    morphEl(curFromNodeChild, curToNodeChild);
                  }
                } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                  isCompatible = true;
                  if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                    curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                  }
                }
              }
              if (isCompatible) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              if (curFromNodeKey) {
                addKeyedRemoval(curFromNodeKey);
              } else {
                removeNode(curFromNodeChild, fromEl, true);
              }
              curFromNodeChild = fromNextSibling;
            }
            if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
              fromEl.appendChild(matchingFromEl);
              morphEl(matchingFromEl, curToNodeChild);
            } else {
              var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
              if (onBeforeNodeAddedResult !== false) {
                if (onBeforeNodeAddedResult) {
                  curToNodeChild = onBeforeNodeAddedResult;
                }
                if (curToNodeChild.actualize) {
                  curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                }
                fromEl.appendChild(curToNodeChild);
                handleNodeAdded(curToNodeChild);
              }
            }
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
          }
        cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
        var specialElHandler = specialElHandlers[fromEl.nodeName];
        if (specialElHandler) {
          specialElHandler(fromEl, toEl);
        }
      }
      var morphedNode = fromNode;
      var morphedNodeType = morphedNode.nodeType;
      var toNodeType = toNode.nodeType;
      if (!childrenOnly) {
        if (morphedNodeType === ELEMENT_NODE) {
          if (toNodeType === ELEMENT_NODE) {
            if (!compareNodeNames(fromNode, toNode)) {
              onNodeDiscarded(fromNode);
              morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
            }
          } else {
            morphedNode = toNode;
          }
        } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
          if (toNodeType === morphedNodeType) {
            if (morphedNode.nodeValue !== toNode.nodeValue) {
              morphedNode.nodeValue = toNode.nodeValue;
            }
            return morphedNode;
          } else {
            morphedNode = toNode;
          }
        }
      }
      if (morphedNode === toNode) {
        onNodeDiscarded(fromNode);
      } else {
        if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
          return;
        }
        morphEl(morphedNode, toNode, childrenOnly);
        if (keyedRemovalList) {
          for (var i = 0, len = keyedRemovalList.length; i < len; i++) {
            var elToRemove = fromNodesLookup[keyedRemovalList[i]];
            if (elToRemove) {
              removeNode(elToRemove, elToRemove.parentNode, false);
            }
          }
        }
      }
      if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
        if (morphedNode.actualize) {
          morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
        }
        fromNode.parentNode.replaceChild(morphedNode, fromNode);
      }
      return morphedNode;
    };
  }
  var morphdom = morphdomFactory(morphAttrs);
  var morphdom_esm_default = morphdom;
  var DOMPatch = class {
    static patchEl(fromEl, toEl, activeElement) {
      morphdom_esm_default(fromEl, toEl, {
        childrenOnly: false,
        onBeforeElUpdated: (fromEl2, toEl2) => {
          if (activeElement && activeElement.isSameNode(fromEl2) && dom_default.isFormInput(fromEl2)) {
            dom_default.mergeFocusedInput(fromEl2, toEl2);
            return false;
          }
        }
      });
    }
    constructor(view, container, id, html, targetCID) {
      this.view = view;
      this.liveSocket = view.liveSocket;
      this.container = container;
      this.id = id;
      this.rootID = view.root.id;
      this.html = html;
      this.targetCID = targetCID;
      this.cidPatch = isCid(this.targetCID);
      this.callbacks = {
        beforeadded: [],
        beforeupdated: [],
        beforephxChildAdded: [],
        afteradded: [],
        afterupdated: [],
        afterdiscarded: [],
        afterphxChildAdded: [],
        aftertransitionsDiscarded: []
      };
    }
    before(kind, callback) {
      this.callbacks[`before${kind}`].push(callback);
    }
    after(kind, callback) {
      this.callbacks[`after${kind}`].push(callback);
    }
    trackBefore(kind, ...args) {
      this.callbacks[`before${kind}`].forEach((callback) => callback(...args));
    }
    trackAfter(kind, ...args) {
      this.callbacks[`after${kind}`].forEach((callback) => callback(...args));
    }
    markPrunableContentForRemoval() {
      dom_default.all(this.container, "[phx-update=append] > *, [phx-update=prepend] > *", (el) => {
        el.setAttribute(PHX_PRUNE, "");
      });
    }
    perform() {
      let { view, liveSocket: liveSocket2, container, html } = this;
      let targetContainer = this.isCIDPatch() ? this.targetCIDContainer(html) : container;
      if (this.isCIDPatch() && !targetContainer) {
        return;
      }
      let focused = liveSocket2.getActiveElement();
      let { selectionStart, selectionEnd } = focused && dom_default.hasSelectionRange(focused) ? focused : {};
      let phxUpdate = liveSocket2.binding(PHX_UPDATE);
      let phxFeedbackFor = liveSocket2.binding(PHX_FEEDBACK_FOR);
      let disableWith = liveSocket2.binding(PHX_DISABLE_WITH);
      let phxTriggerExternal = liveSocket2.binding(PHX_TRIGGER_ACTION);
      let phxRemove = liveSocket2.binding("remove");
      let added = [];
      let updates = [];
      let appendPrependUpdates = [];
      let pendingRemoves = [];
      let externalFormTriggered = null;
      let diffHTML = liveSocket2.time("premorph container prep", () => {
        return this.buildDiffHTML(container, html, phxUpdate, targetContainer);
      });
      this.trackBefore("added", container);
      this.trackBefore("updated", container, container);
      liveSocket2.time("morphdom", () => {
        morphdom_esm_default(targetContainer, diffHTML, {
          childrenOnly: targetContainer.getAttribute(PHX_COMPONENT) === null,
          getNodeKey: (node) => {
            return dom_default.isPhxDestroyed(node) ? null : node.id;
          },
          onBeforeNodeAdded: (el) => {
            this.trackBefore("added", el);
            return el;
          },
          onNodeAdded: (el) => {
            if (el instanceof HTMLImageElement && el.srcset) {
              el.srcset = el.srcset;
            } else if (el instanceof HTMLVideoElement && el.autoplay) {
              el.play();
            }
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            dom_default.discardError(targetContainer, el, phxFeedbackFor);
            if (dom_default.isPhxChild(el) && view.ownsElement(el)) {
              this.trackAfter("phxChildAdded", el);
            }
            added.push(el);
          },
          onNodeDiscarded: (el) => {
            if (dom_default.isPhxChild(el)) {
              liveSocket2.destroyViewByEl(el);
            }
            this.trackAfter("discarded", el);
          },
          onBeforeNodeDiscarded: (el) => {
            if (el.getAttribute && el.getAttribute(PHX_PRUNE) !== null) {
              return true;
            }
            if (el.parentNode !== null && dom_default.isPhxUpdate(el.parentNode, phxUpdate, ["append", "prepend"]) && el.id) {
              return false;
            }
            if (el.getAttribute && el.getAttribute(phxRemove)) {
              pendingRemoves.push(el);
              return false;
            }
            if (this.skipCIDSibling(el)) {
              return false;
            }
            return true;
          },
          onElUpdated: (el) => {
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            updates.push(el);
          },
          onBeforeElUpdated: (fromEl, toEl) => {
            dom_default.cleanChildNodes(toEl, phxUpdate);
            if (this.skipCIDSibling(toEl)) {
              return false;
            }
            if (dom_default.isIgnored(fromEl, phxUpdate)) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeAttrs(fromEl, toEl, { isIgnored: true });
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (fromEl.type === "number" && (fromEl.validity && fromEl.validity.badInput)) {
              return false;
            }
            if (!dom_default.syncPendingRef(fromEl, toEl, disableWith)) {
              if (dom_default.isUploadInput(fromEl)) {
                this.trackBefore("updated", fromEl, toEl);
                updates.push(fromEl);
              }
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (dom_default.isPhxChild(toEl)) {
              let prevSession = fromEl.getAttribute(PHX_SESSION);
              dom_default.mergeAttrs(fromEl, toEl, { exclude: [PHX_STATIC] });
              if (prevSession !== "") {
                fromEl.setAttribute(PHX_SESSION, prevSession);
              }
              fromEl.setAttribute(PHX_ROOT_ID, this.rootID);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            dom_default.copyPrivates(toEl, fromEl);
            dom_default.discardError(targetContainer, toEl, phxFeedbackFor);
            let isFocusedFormEl = focused && fromEl.isSameNode(focused) && dom_default.isFormInput(fromEl);
            if (isFocusedFormEl) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeFocusedInput(fromEl, toEl);
              dom_default.syncAttrsToProps(fromEl);
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            } else {
              if (dom_default.isPhxUpdate(toEl, phxUpdate, ["append", "prepend"])) {
                appendPrependUpdates.push(new DOMPostMorphRestorer(fromEl, toEl, toEl.getAttribute(phxUpdate)));
              }
              dom_default.syncAttrsToProps(toEl);
              dom_default.applyStickyOperations(toEl);
              this.trackBefore("updated", fromEl, toEl);
              return true;
            }
          }
        });
      });
      if (liveSocket2.isDebugEnabled()) {
        detectDuplicateIds();
      }
      if (appendPrependUpdates.length > 0) {
        liveSocket2.time("post-morph append/prepend restoration", () => {
          appendPrependUpdates.forEach((update) => update.perform());
        });
      }
      liveSocket2.silenceEvents(() => dom_default.restoreFocus(focused, selectionStart, selectionEnd));
      dom_default.dispatchEvent(document, "phx:update");
      added.forEach((el) => this.trackAfter("added", el));
      updates.forEach((el) => this.trackAfter("updated", el));
      if (pendingRemoves.length > 0) {
        liveSocket2.transitionRemoves(pendingRemoves);
        liveSocket2.requestDOMUpdate(() => {
          pendingRemoves.forEach((el) => {
            let child = dom_default.firstPhxChild(el);
            if (child) {
              liveSocket2.destroyViewByEl(child);
            }
            el.remove();
          });
          this.trackAfter("transitionsDiscarded", pendingRemoves);
        });
      }
      if (externalFormTriggered) {
        liveSocket2.disconnect();
        externalFormTriggered.submit();
      }
      return true;
    }
    isCIDPatch() {
      return this.cidPatch;
    }
    skipCIDSibling(el) {
      return el.nodeType === Node.ELEMENT_NODE && el.getAttribute(PHX_SKIP) !== null;
    }
    targetCIDContainer(html) {
      if (!this.isCIDPatch()) {
        return;
      }
      let [first, ...rest] = dom_default.findComponentNodeList(this.container, this.targetCID);
      if (rest.length === 0 && dom_default.childNodeLength(html) === 1) {
        return first;
      } else {
        return first && first.parentNode;
      }
    }
    buildDiffHTML(container, html, phxUpdate, targetContainer) {
      let isCIDPatch = this.isCIDPatch();
      let isCIDWithSingleRoot = isCIDPatch && targetContainer.getAttribute(PHX_COMPONENT) === this.targetCID.toString();
      if (!isCIDPatch || isCIDWithSingleRoot) {
        return html;
      } else {
        let diffContainer = null;
        let template = document.createElement("template");
        diffContainer = dom_default.cloneNode(targetContainer);
        let [firstComponent, ...rest] = dom_default.findComponentNodeList(diffContainer, this.targetCID);
        template.innerHTML = html;
        rest.forEach((el) => el.remove());
        Array.from(diffContainer.childNodes).forEach((child) => {
          if (child.id && child.nodeType === Node.ELEMENT_NODE && child.getAttribute(PHX_COMPONENT) !== this.targetCID.toString()) {
            child.setAttribute(PHX_SKIP, "");
            child.innerHTML = "";
          }
        });
        Array.from(template.content.childNodes).forEach((el) => diffContainer.insertBefore(el, firstComponent));
        firstComponent.remove();
        return diffContainer.outerHTML;
      }
    }
  };
  var Rendered = class {
    static extract(diff) {
      let { [REPLY]: reply, [EVENTS]: events, [TITLE]: title } = diff;
      delete diff[REPLY];
      delete diff[EVENTS];
      delete diff[TITLE];
      return { diff, title, reply: reply || null, events: events || [] };
    }
    constructor(viewId, rendered) {
      this.viewId = viewId;
      this.rendered = {};
      this.mergeDiff(rendered);
    }
    parentViewId() {
      return this.viewId;
    }
    toString(onlyCids) {
      return this.recursiveToString(this.rendered, this.rendered[COMPONENTS], onlyCids);
    }
    recursiveToString(rendered, components = rendered[COMPONENTS], onlyCids) {
      onlyCids = onlyCids ? new Set(onlyCids) : null;
      let output = { buffer: "", components, onlyCids };
      this.toOutputBuffer(rendered, null, output);
      return output.buffer;
    }
    componentCIDs(diff) {
      return Object.keys(diff[COMPONENTS] || {}).map((i) => parseInt(i));
    }
    isComponentOnlyDiff(diff) {
      if (!diff[COMPONENTS]) {
        return false;
      }
      return Object.keys(diff).length === 1;
    }
    getComponent(diff, cid) {
      return diff[COMPONENTS][cid];
    }
    mergeDiff(diff) {
      let newc = diff[COMPONENTS];
      let cache = {};
      delete diff[COMPONENTS];
      this.rendered = this.mutableMerge(this.rendered, diff);
      this.rendered[COMPONENTS] = this.rendered[COMPONENTS] || {};
      if (newc) {
        let oldc = this.rendered[COMPONENTS];
        for (let cid in newc) {
          newc[cid] = this.cachedFindComponent(cid, newc[cid], oldc, newc, cache);
        }
        for (let cid in newc) {
          oldc[cid] = newc[cid];
        }
        diff[COMPONENTS] = newc;
      }
    }
    cachedFindComponent(cid, cdiff, oldc, newc, cache) {
      if (cache[cid]) {
        return cache[cid];
      } else {
        let ndiff, stat, scid = cdiff[STATIC];
        if (isCid(scid)) {
          let tdiff;
          if (scid > 0) {
            tdiff = this.cachedFindComponent(scid, newc[scid], oldc, newc, cache);
          } else {
            tdiff = oldc[-scid];
          }
          stat = tdiff[STATIC];
          ndiff = this.cloneMerge(tdiff, cdiff);
          ndiff[STATIC] = stat;
        } else {
          ndiff = cdiff[STATIC] !== void 0 ? cdiff : this.cloneMerge(oldc[cid] || {}, cdiff);
        }
        cache[cid] = ndiff;
        return ndiff;
      }
    }
    mutableMerge(target, source) {
      if (source[STATIC] !== void 0) {
        return source;
      } else {
        this.doMutableMerge(target, source);
        return target;
      }
    }
    doMutableMerge(target, source) {
      for (let key in source) {
        let val = source[key];
        let targetVal = target[key];
        if (isObject(val) && val[STATIC] === void 0 && isObject(targetVal)) {
          this.doMutableMerge(targetVal, val);
        } else {
          target[key] = val;
        }
      }
    }
    cloneMerge(target, source) {
      let merged = __spreadValues(__spreadValues({}, target), source);
      for (let key in merged) {
        let val = source[key];
        let targetVal = target[key];
        if (isObject(val) && val[STATIC] === void 0 && isObject(targetVal)) {
          merged[key] = this.cloneMerge(targetVal, val);
        }
      }
      return merged;
    }
    componentToString(cid) {
      return this.recursiveCIDToString(this.rendered[COMPONENTS], cid);
    }
    pruneCIDs(cids) {
      cids.forEach((cid) => delete this.rendered[COMPONENTS][cid]);
    }
    get() {
      return this.rendered;
    }
    isNewFingerprint(diff = {}) {
      return !!diff[STATIC];
    }
    templateStatic(part, templates) {
      if (typeof part === "number") {
        return templates[part];
      } else {
        return part;
      }
    }
    toOutputBuffer(rendered, templates, output) {
      if (rendered[DYNAMICS]) {
        return this.comprehensionToBuffer(rendered, templates, output);
      }
      let { [STATIC]: statics } = rendered;
      statics = this.templateStatic(statics, templates);
      output.buffer += statics[0];
      for (let i = 1; i < statics.length; i++) {
        this.dynamicToBuffer(rendered[i - 1], templates, output);
        output.buffer += statics[i];
      }
    }
    comprehensionToBuffer(rendered, templates, output) {
      let { [DYNAMICS]: dynamics, [STATIC]: statics } = rendered;
      statics = this.templateStatic(statics, templates);
      let compTemplates = rendered[TEMPLATES];
      for (let d = 0; d < dynamics.length; d++) {
        let dynamic = dynamics[d];
        output.buffer += statics[0];
        for (let i = 1; i < statics.length; i++) {
          this.dynamicToBuffer(dynamic[i - 1], compTemplates, output);
          output.buffer += statics[i];
        }
      }
    }
    dynamicToBuffer(rendered, templates, output) {
      if (typeof rendered === "number") {
        output.buffer += this.recursiveCIDToString(output.components, rendered, output.onlyCids);
      } else if (isObject(rendered)) {
        this.toOutputBuffer(rendered, templates, output);
      } else {
        output.buffer += rendered;
      }
    }
    recursiveCIDToString(components, cid, onlyCids) {
      let component = components[cid] || logError(`no component for CID ${cid}`, components);
      let template = document.createElement("template");
      template.innerHTML = this.recursiveToString(component, components, onlyCids);
      let container = template.content;
      let skip = onlyCids && !onlyCids.has(cid);
      let [hasChildNodes, hasChildComponents] = Array.from(container.childNodes).reduce(([hasNodes, hasComponents], child, i) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.getAttribute(PHX_COMPONENT)) {
            return [hasNodes, true];
          }
          child.setAttribute(PHX_COMPONENT, cid);
          if (!child.id) {
            child.id = `${this.parentViewId()}-${cid}-${i}`;
          }
          if (skip) {
            child.setAttribute(PHX_SKIP, "");
            child.innerHTML = "";
          }
          return [true, hasComponents];
        } else {
          if (child.nodeValue.trim() !== "") {
            logError(`only HTML element tags are allowed at the root of components.

got: "${child.nodeValue.trim()}"

within:
`, template.innerHTML.trim());
            child.replaceWith(this.createSpan(child.nodeValue, cid));
            return [true, hasComponents];
          } else {
            child.remove();
            return [hasNodes, hasComponents];
          }
        }
      }, [false, false]);
      if (!hasChildNodes && !hasChildComponents) {
        logError("expected at least one HTML element tag inside a component, but the component is empty:\n", template.innerHTML.trim());
        return this.createSpan("", cid).outerHTML;
      } else if (!hasChildNodes && hasChildComponents) {
        logError("expected at least one HTML element tag directly inside a component, but only subcomponents were found. A component must render at least one HTML tag directly inside itself.", template.innerHTML.trim());
        return template.innerHTML;
      } else {
        return template.innerHTML;
      }
    }
    createSpan(text, cid) {
      let span = document.createElement("span");
      span.innerText = text;
      span.setAttribute(PHX_COMPONENT, cid);
      return span;
    }
  };
  var viewHookID = 1;
  var ViewHook = class {
    static makeID() {
      return viewHookID++;
    }
    static elementID(el) {
      return el.phxHookId;
    }
    constructor(view, el, callbacks) {
      this.__view = view;
      this.__liveSocket = view.liveSocket;
      this.__callbacks = callbacks;
      this.__listeners = /* @__PURE__ */ new Set();
      this.__isDisconnected = false;
      this.el = el;
      this.el.phxHookId = this.constructor.makeID();
      for (let key in this.__callbacks) {
        this[key] = this.__callbacks[key];
      }
    }
    __mounted() {
      this.mounted && this.mounted();
    }
    __updated() {
      this.updated && this.updated();
    }
    __beforeUpdate() {
      this.beforeUpdate && this.beforeUpdate();
    }
    __destroyed() {
      this.destroyed && this.destroyed();
    }
    __reconnected() {
      if (this.__isDisconnected) {
        this.__isDisconnected = false;
        this.reconnected && this.reconnected();
      }
    }
    __disconnected() {
      this.__isDisconnected = true;
      this.disconnected && this.disconnected();
    }
    pushEvent(event, payload = {}, onReply = function() {
    }) {
      return this.__view.pushHookEvent(null, event, payload, onReply);
    }
    pushEventTo(phxTarget, event, payload = {}, onReply = function() {
    }) {
      return this.__view.withinTargets(phxTarget, (view, targetCtx) => {
        return view.pushHookEvent(targetCtx, event, payload, onReply);
      });
    }
    handleEvent(event, callback) {
      let callbackRef = (customEvent, bypass) => bypass ? event : callback(customEvent.detail);
      window.addEventListener(`phx:${event}`, callbackRef);
      this.__listeners.add(callbackRef);
      return callbackRef;
    }
    removeHandleEvent(callbackRef) {
      let event = callbackRef(null, true);
      window.removeEventListener(`phx:${event}`, callbackRef);
      this.__listeners.delete(callbackRef);
    }
    upload(name, files) {
      return this.__view.dispatchUploads(name, files);
    }
    uploadTo(phxTarget, name, files) {
      return this.__view.withinTargets(phxTarget, (view) => view.dispatchUploads(name, files));
    }
    __cleanup__() {
      this.__listeners.forEach((callbackRef) => this.removeHandleEvent(callbackRef));
    }
  };
  var JS = {
    exec(eventType, phxEvent, view, el, defaults) {
      let [defaultKind, defaultArgs] = defaults || [null, {}];
      let commands = phxEvent.charAt(0) === "[" ? JSON.parse(phxEvent) : [[defaultKind, defaultArgs]];
      commands.forEach(([kind, args]) => {
        if (kind === defaultKind && defaultArgs.data) {
          args.data = Object.assign(args.data || {}, defaultArgs.data);
        }
        this[`exec_${kind}`](eventType, phxEvent, view, el, args);
      });
    },
    isVisible(el) {
      let style = window.getComputedStyle(el);
      return !(style.opacity === 0 || style.display === "none");
    },
    exec_dispatch(eventType, phxEvent, view, sourceEl, { to, event, detail }) {
      if (to) {
        dom_default.all(document, to, (el) => dom_default.dispatchEvent(el, event, detail));
      } else {
        dom_default.dispatchEvent(sourceEl, event, detail);
      }
    },
    exec_push(eventType, phxEvent, view, sourceEl, args) {
      let { event, data, target, page_loading, loading, value } = args;
      let pushOpts = { page_loading: !!page_loading, loading, value };
      let targetSrc = eventType === "change" ? sourceEl.form : sourceEl;
      let phxTarget = target || targetSrc.getAttribute(view.binding("target")) || targetSrc;
      view.withinTargets(phxTarget, (targetView, targetCtx) => {
        if (eventType === "change") {
          let { newCid, _target, callback } = args;
          if (_target) {
            pushOpts._target = _target;
          }
          targetView.pushInput(sourceEl, targetCtx, newCid, event || phxEvent, pushOpts, callback);
        } else if (eventType === "submit") {
          targetView.submitForm(sourceEl, targetCtx, event || phxEvent, pushOpts);
        } else {
          targetView.pushEvent(eventType, sourceEl, targetCtx, event || phxEvent, data, pushOpts);
        }
      });
    },
    exec_add_class(eventType, phxEvent, view, sourceEl, { to, names, transition, time }) {
      if (to) {
        dom_default.all(document, to, (el) => this.addOrRemoveClasses(el, names, [], transition, time, view));
      } else {
        this.addOrRemoveClasses(sourceEl, names, [], transition, view);
      }
    },
    exec_remove_class(eventType, phxEvent, view, sourceEl, { to, names, transition, time }) {
      if (to) {
        dom_default.all(document, to, (el) => this.addOrRemoveClasses(el, [], names, transition, time, view));
      } else {
        this.addOrRemoveClasses(sourceEl, [], names, transition, time, view);
      }
    },
    exec_transition(eventType, phxEvent, view, sourceEl, { time, to, transition }) {
      let els = to ? dom_default.all(document, to) : [sourceEl];
      let [transition_start, running, transition_end] = transition;
      els.forEach((el) => {
        let onStart = () => this.addOrRemoveClasses(el, transition_start.concat(running), []);
        let onDone = () => this.addOrRemoveClasses(el, transition_end, transition_start.concat(running));
        view.transition(time, onStart, onDone);
      });
    },
    exec_toggle(eventType, phxEvent, view, sourceEl, { to, display, ins, outs, time }) {
      if (to) {
        dom_default.all(document, to, (el) => this.toggle(eventType, view, el, display, ins, outs, time));
      } else {
        this.toggle(eventType, view, sourceEl, display, ins, outs, time);
      }
    },
    exec_show(eventType, phxEvent, view, sourceEl, { to, display, transition, time }) {
      if (to) {
        dom_default.all(document, to, (el) => this.show(eventType, view, el, display, transition, time));
      } else {
        this.show(eventType, view, sourceEl, transition, time);
      }
    },
    exec_hide(eventType, phxEvent, view, sourceEl, { to, display, transition, time }) {
      if (to) {
        dom_default.all(document, to, (el) => this.hide(eventType, view, el, display, transition, time));
      } else {
        this.hide(eventType, view, sourceEl, display, transition, time);
      }
    },
    show(eventType, view, el, display, transition, time) {
      if (!this.isVisible(el)) {
        this.toggle(eventType, view, el, display, transition, null, time);
      }
    },
    hide(eventType, view, el, display, transition, time) {
      if (this.isVisible(el)) {
        this.toggle(eventType, view, el, display, null, transition, time);
      }
    },
    toggle(eventType, view, el, display, ins, outs, time) {
      let [inClasses, inStartClasses, inEndClasses] = ins || [[], [], []];
      let [outClasses, outStartClasses, outEndClasses] = outs || [[], [], []];
      if (inClasses.length > 0 || outClasses.length > 0) {
        if (this.isVisible(el)) {
          let onStart = () => {
            this.addOrRemoveClasses(el, outStartClasses, inClasses.concat(inStartClasses).concat(inEndClasses));
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, outClasses, []);
              window.requestAnimationFrame(() => this.addOrRemoveClasses(el, outEndClasses, outStartClasses));
            });
          };
          view.transition(time, onStart, () => {
            this.addOrRemoveClasses(el, [], outClasses.concat(outEndClasses));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
          });
        } else {
          if (eventType === "remove") {
            return;
          }
          let onStart = () => {
            this.addOrRemoveClasses(el, inStartClasses, outClasses.concat(outStartClasses).concat(outEndClasses));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = display || "block");
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, inClasses, []);
              window.requestAnimationFrame(() => this.addOrRemoveClasses(el, inEndClasses, inStartClasses));
            });
          };
          view.transition(time, onStart, () => {
            this.addOrRemoveClasses(el, [], inClasses.concat(inEndClasses));
          });
        }
      } else {
        let newDisplay = this.isVisible(el) ? "none" : display || "block";
        dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = newDisplay);
      }
    },
    addOrRemoveClasses(el, adds, removes, transition, time, view) {
      let [transition_run, transition_start, transition_end] = transition || [[], [], []];
      if (transition_run.length > 0) {
        let onStart = () => this.addOrRemoveClasses(el, transition_start.concat(transition_run), []);
        let onDone = () => this.addOrRemoveClasses(el, adds.concat(transition_end), removes.concat(transition_run).concat(transition_start));
        return view.transition(time, onStart, onDone);
      }
      window.requestAnimationFrame(() => {
        let [prevAdds, prevRemoves] = dom_default.getSticky(el, "classes", [[], []]);
        let keepAdds = adds.filter((name) => prevAdds.indexOf(name) < 0 && !el.classList.contains(name));
        let keepRemoves = removes.filter((name) => prevRemoves.indexOf(name) < 0 && el.classList.contains(name));
        let newAdds = prevAdds.filter((name) => removes.indexOf(name) < 0).concat(keepAdds);
        let newRemoves = prevRemoves.filter((name) => adds.indexOf(name) < 0).concat(keepRemoves);
        dom_default.putSticky(el, "classes", (currentEl) => {
          currentEl.classList.remove(...newRemoves);
          currentEl.classList.add(...newAdds);
          return [newAdds, newRemoves];
        });
      });
    },
    hasAllClasses(el, classes) {
      return classes.every((name) => el.classList.contains(name));
    },
    isToggledOut(el, outClasses) {
      return !this.isVisible(el) || this.hasAllClasses(el, outClasses);
    }
  };
  var js_default = JS;
  var serializeForm = (form, meta = {}) => {
    let formData = new FormData(form);
    let toRemove = [];
    formData.forEach((val, key, _index) => {
      if (val instanceof File) {
        toRemove.push(key);
      }
    });
    toRemove.forEach((key) => formData.delete(key));
    let params = new URLSearchParams();
    for (let [key, val] of formData.entries()) {
      params.append(key, val);
    }
    for (let metaKey in meta) {
      params.append(metaKey, meta[metaKey]);
    }
    return params.toString();
  };
  var View = class {
    constructor(el, liveSocket2, parentView, flash) {
      this.liveSocket = liveSocket2;
      this.flash = flash;
      this.parent = parentView;
      this.root = parentView ? parentView.root : this;
      this.el = el;
      this.id = this.el.id;
      this.ref = 0;
      this.childJoins = 0;
      this.loaderTimer = null;
      this.pendingDiffs = [];
      this.pruningCIDs = [];
      this.redirect = false;
      this.href = null;
      this.joinCount = this.parent ? this.parent.joinCount - 1 : 0;
      this.joinPending = true;
      this.destroyed = false;
      this.joinCallback = function(onDone) {
        onDone && onDone();
      };
      this.stopCallback = function() {
      };
      this.pendingJoinOps = this.parent ? null : [];
      this.viewHooks = {};
      this.uploaders = {};
      this.formSubmits = [];
      this.children = this.parent ? null : {};
      this.root.children[this.id] = {};
      this.channel = this.liveSocket.channel(`lv:${this.id}`, () => {
        return {
          redirect: this.redirect ? this.href : void 0,
          url: this.redirect ? void 0 : this.href || void 0,
          params: this.connectParams(),
          session: this.getSession(),
          static: this.getStatic(),
          flash: this.flash
        };
      });
      this.showLoader(this.liveSocket.loaderTimeout);
      this.bindChannel();
    }
    setHref(href) {
      this.href = href;
    }
    setRedirect(href) {
      this.redirect = true;
      this.href = href;
    }
    isMain() {
      return this.liveSocket.main === this;
    }
    connectParams() {
      let params = this.liveSocket.params(this.el);
      let manifest = dom_default.all(document, `[${this.binding(PHX_TRACK_STATIC)}]`).map((node) => node.src || node.href).filter((url) => typeof url === "string");
      if (manifest.length > 0) {
        params["_track_static"] = manifest;
      }
      params["_mounts"] = this.joinCount;
      return params;
    }
    isConnected() {
      return this.channel.canPush();
    }
    getSession() {
      return this.el.getAttribute(PHX_SESSION);
    }
    getStatic() {
      let val = this.el.getAttribute(PHX_STATIC);
      return val === "" ? null : val;
    }
    destroy(callback = function() {
    }) {
      this.destroyAllChildren();
      this.destroyed = true;
      delete this.root.children[this.id];
      if (this.parent) {
        delete this.root.children[this.parent.id][this.id];
      }
      clearTimeout(this.loaderTimer);
      let onFinished = () => {
        callback();
        for (let id in this.viewHooks) {
          this.destroyHook(this.viewHooks[id]);
        }
      };
      dom_default.markPhxChildDestroyed(this.el);
      this.log("destroyed", () => ["the child has been removed from the parent"]);
      this.channel.leave().receive("ok", onFinished).receive("error", onFinished).receive("timeout", onFinished);
    }
    setContainerClasses(...classes) {
      this.el.classList.remove(PHX_CONNECTED_CLASS, PHX_DISCONNECTED_CLASS, PHX_ERROR_CLASS);
      this.el.classList.add(...classes);
    }
    showLoader(timeout) {
      clearTimeout(this.loaderTimer);
      if (timeout) {
        this.loaderTimer = setTimeout(() => this.showLoader(), timeout);
      } else {
        for (let id in this.viewHooks) {
          this.viewHooks[id].__disconnected();
        }
        this.setContainerClasses(PHX_DISCONNECTED_CLASS);
      }
    }
    hideLoader() {
      clearTimeout(this.loaderTimer);
      this.setContainerClasses(PHX_CONNECTED_CLASS);
    }
    triggerReconnected() {
      for (let id in this.viewHooks) {
        this.viewHooks[id].__reconnected();
      }
    }
    log(kind, msgCallback) {
      this.liveSocket.log(this, kind, msgCallback);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.liveSocket.transition(time, onStart, onDone);
    }
    withinTargets(phxTarget, callback) {
      if (phxTarget instanceof HTMLElement || phxTarget instanceof SVGElement) {
        return this.liveSocket.owner(phxTarget, (view) => callback(view, phxTarget));
      }
      if (isCid(phxTarget)) {
        let targets = dom_default.findComponentNodeList(this.el, phxTarget);
        if (targets.length === 0) {
          logError(`no component found matching phx-target of ${phxTarget}`);
        } else {
          callback(this, parseInt(phxTarget));
        }
      } else {
        let targets = Array.from(document.querySelectorAll(phxTarget));
        if (targets.length === 0) {
          logError(`nothing found matching the phx-target selector "${phxTarget}"`);
        }
        targets.forEach((target) => this.liveSocket.owner(target, (view) => callback(view, target)));
      }
    }
    applyDiff(type, rawDiff, callback) {
      this.log(type, () => ["", clone(rawDiff)]);
      let { diff, reply, events, title } = Rendered.extract(rawDiff);
      if (title) {
        dom_default.putTitle(title);
      }
      callback({ diff, reply, events });
      return reply;
    }
    onJoin(resp) {
      let { rendered, container } = resp;
      if (container) {
        let [tag, attrs] = container;
        this.el = dom_default.replaceRootContainer(this.el, tag, attrs);
      }
      this.childJoins = 0;
      this.joinPending = true;
      this.flash = null;
      browser_default.dropLocal(this.liveSocket.localStorage, window.location.pathname, CONSECUTIVE_RELOADS);
      this.applyDiff("mount", rendered, ({ diff, events }) => {
        this.rendered = new Rendered(this.id, diff);
        let html = this.renderContainer(null, "join");
        this.dropPendingRefs();
        let forms = this.formsForRecovery(html);
        this.joinCount++;
        if (forms.length > 0) {
          forms.forEach(([form, newForm, newCid], i) => {
            this.pushFormRecovery(form, newCid, (resp2) => {
              if (i === forms.length - 1) {
                this.onJoinComplete(resp2, html, events);
              }
            });
          });
        } else {
          this.onJoinComplete(resp, html, events);
        }
      });
    }
    dropPendingRefs() {
      dom_default.all(this.el, `[${PHX_REF}]`, (el) => el.removeAttribute(PHX_REF));
    }
    onJoinComplete({ live_patch }, html, events) {
      if (this.joinCount > 1 || this.parent && !this.parent.isJoinPending()) {
        return this.applyJoinPatch(live_patch, html, events);
      }
      let newChildren = dom_default.findPhxChildrenInFragment(html, this.id).filter((toEl) => {
        let fromEl = toEl.id && this.el.querySelector(`[id="${toEl.id}"]`);
        let phxStatic = fromEl && fromEl.getAttribute(PHX_STATIC);
        if (phxStatic) {
          toEl.setAttribute(PHX_STATIC, phxStatic);
        }
        return this.joinChild(toEl);
      });
      if (newChildren.length === 0) {
        if (this.parent) {
          this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, events)]);
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
          this.applyJoinPatch(live_patch, html, events);
        }
      } else {
        this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, events)]);
      }
    }
    attachTrueDocEl() {
      this.el = dom_default.byId(this.id);
      this.el.setAttribute(PHX_ROOT_ID, this.root.id);
    }
    applyJoinPatch(live_patch, html, events) {
      this.attachTrueDocEl();
      let patch = new DOMPatch(this, this.el, this.id, html, null);
      patch.markPrunableContentForRemoval();
      this.performPatch(patch, false);
      this.joinNewChildren();
      dom_default.all(this.el, `[${this.binding(PHX_HOOK)}], [data-phx-${PHX_HOOK}]`, (hookEl) => {
        let hook = this.addHook(hookEl);
        if (hook) {
          hook.__mounted();
        }
      });
      this.joinPending = false;
      this.liveSocket.dispatchEvents(events);
      this.applyPendingUpdates();
      if (live_patch) {
        let { kind, to } = live_patch;
        this.liveSocket.historyPatch(to, kind);
      }
      this.hideLoader();
      if (this.joinCount > 1) {
        this.triggerReconnected();
      }
      this.stopCallback();
    }
    triggerBeforeUpdateHook(fromEl, toEl) {
      this.liveSocket.triggerDOM("onBeforeElUpdated", [fromEl, toEl]);
      let hook = this.getHook(fromEl);
      let isIgnored = hook && dom_default.isIgnored(fromEl, this.binding(PHX_UPDATE));
      if (hook && !fromEl.isEqualNode(toEl) && !(isIgnored && isEqualObj(fromEl.dataset, toEl.dataset))) {
        hook.__beforeUpdate();
        return hook;
      }
    }
    performPatch(patch, pruneCids) {
      let removedEls = [];
      let phxChildrenAdded = false;
      let updatedHookIds = /* @__PURE__ */ new Set();
      patch.after("added", (el) => {
        this.liveSocket.triggerDOM("onNodeAdded", [el]);
        let newHook = this.addHook(el);
        if (newHook) {
          newHook.__mounted();
        }
      });
      patch.after("phxChildAdded", (_el) => phxChildrenAdded = true);
      patch.before("updated", (fromEl, toEl) => {
        let hook = this.triggerBeforeUpdateHook(fromEl, toEl);
        if (hook) {
          updatedHookIds.add(fromEl.id);
        }
      });
      patch.after("updated", (el) => {
        if (updatedHookIds.has(el.id)) {
          this.getHook(el).__updated();
        }
      });
      patch.after("discarded", (el) => {
        if (el.nodeType === Node.ELEMENT_NODE) {
          removedEls.push(el);
        }
      });
      patch.after("transitionsDiscarded", (els) => this.afterElementsRemoved(els, pruneCids));
      patch.perform();
      this.afterElementsRemoved(removedEls, pruneCids);
      return phxChildrenAdded;
    }
    afterElementsRemoved(elements, pruneCids) {
      let destroyedCIDs = [];
      elements.forEach((parent) => {
        let components = dom_default.all(parent, `[${PHX_COMPONENT}]`);
        components.concat(parent).forEach((el) => {
          let cid = this.componentID(el);
          if (isCid(cid) && destroyedCIDs.indexOf(cid) === -1) {
            destroyedCIDs.push(cid);
          }
          let hook = this.getHook(el);
          hook && this.destroyHook(hook);
        });
      });
      if (pruneCids) {
        this.maybePushComponentsDestroyed(destroyedCIDs);
      }
    }
    joinNewChildren() {
      dom_default.findPhxChildren(this.el, this.id).forEach((el) => this.joinChild(el));
    }
    getChildById(id) {
      return this.root.children[this.id][id];
    }
    getDescendentByEl(el) {
      if (el.id === this.id) {
        return this;
      } else {
        return this.children[el.getAttribute(PHX_PARENT_ID)][el.id];
      }
    }
    destroyDescendent(id) {
      for (let parentId in this.root.children) {
        for (let childId in this.root.children[parentId]) {
          if (childId === id) {
            return this.root.children[parentId][childId].destroy();
          }
        }
      }
    }
    joinChild(el) {
      let child = this.getChildById(el.id);
      if (!child) {
        let view = new View(el, this.liveSocket, this);
        this.root.children[this.id][view.id] = view;
        view.join();
        this.childJoins++;
        return true;
      }
    }
    isJoinPending() {
      return this.joinPending;
    }
    ackJoin(_child) {
      this.childJoins--;
      if (this.childJoins === 0) {
        if (this.parent) {
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
        }
      }
    }
    onAllChildJoinsComplete() {
      this.joinCallback(() => {
        this.pendingJoinOps.forEach(([view, op]) => {
          if (!view.isDestroyed()) {
            op();
          }
        });
        this.pendingJoinOps = [];
      });
    }
    update(diff, events) {
      if (this.isJoinPending() || this.liveSocket.hasPendingLink()) {
        return this.pendingDiffs.push({ diff, events });
      }
      this.rendered.mergeDiff(diff);
      let phxChildrenAdded = false;
      if (this.rendered.isComponentOnlyDiff(diff)) {
        this.liveSocket.time("component patch complete", () => {
          let parentCids = dom_default.findParentCIDs(this.el, this.rendered.componentCIDs(diff));
          parentCids.forEach((parentCID) => {
            if (this.componentPatch(this.rendered.getComponent(diff, parentCID), parentCID)) {
              phxChildrenAdded = true;
            }
          });
        });
      } else if (!isEmpty(diff)) {
        this.liveSocket.time("full patch complete", () => {
          let html = this.renderContainer(diff, "update");
          let patch = new DOMPatch(this, this.el, this.id, html, null);
          phxChildrenAdded = this.performPatch(patch, true);
        });
      }
      this.liveSocket.dispatchEvents(events);
      if (phxChildrenAdded) {
        this.joinNewChildren();
      }
    }
    renderContainer(diff, kind) {
      return this.liveSocket.time(`toString diff (${kind})`, () => {
        let tag = this.el.tagName;
        let cids = diff ? this.rendered.componentCIDs(diff).concat(this.pruningCIDs) : null;
        let html = this.rendered.toString(cids);
        return `<${tag}>${html}</${tag}>`;
      });
    }
    componentPatch(diff, cid) {
      if (isEmpty(diff))
        return false;
      let html = this.rendered.componentToString(cid);
      let patch = new DOMPatch(this, this.el, this.id, html, cid);
      let childrenAdded = this.performPatch(patch, true);
      return childrenAdded;
    }
    getHook(el) {
      return this.viewHooks[ViewHook.elementID(el)];
    }
    addHook(el) {
      if (ViewHook.elementID(el) || !el.getAttribute) {
        return;
      }
      let hookName = el.getAttribute(`data-phx-${PHX_HOOK}`) || el.getAttribute(this.binding(PHX_HOOK));
      if (hookName && !this.ownsElement(el)) {
        return;
      }
      let callbacks = this.liveSocket.getHookCallbacks(hookName);
      if (callbacks) {
        if (!el.id) {
          logError(`no DOM ID for hook "${hookName}". Hooks require a unique ID on each element.`, el);
        }
        let hook = new ViewHook(this, el, callbacks);
        this.viewHooks[ViewHook.elementID(hook.el)] = hook;
        return hook;
      } else if (hookName !== null) {
        logError(`unknown hook found for "${hookName}"`, el);
      }
    }
    destroyHook(hook) {
      hook.__destroyed();
      hook.__cleanup__();
      delete this.viewHooks[ViewHook.elementID(hook.el)];
    }
    applyPendingUpdates() {
      this.pendingDiffs.forEach(({ diff, events }) => this.update(diff, events));
      this.pendingDiffs = [];
    }
    onChannel(event, cb) {
      this.liveSocket.onChannel(this.channel, event, (resp) => {
        if (this.isJoinPending()) {
          this.root.pendingJoinOps.push([this, () => cb(resp)]);
        } else {
          this.liveSocket.requestDOMUpdate(() => cb(resp));
        }
      });
    }
    bindChannel() {
      this.liveSocket.onChannel(this.channel, "diff", (rawDiff) => {
        this.liveSocket.requestDOMUpdate(() => {
          this.applyDiff("update", rawDiff, ({ diff, events }) => this.update(diff, events));
        });
      });
      this.onChannel("redirect", ({ to, flash }) => this.onRedirect({ to, flash }));
      this.onChannel("live_patch", (redir) => this.onLivePatch(redir));
      this.onChannel("live_redirect", (redir) => this.onLiveRedirect(redir));
      this.channel.onError((reason) => this.onError(reason));
      this.channel.onClose((reason) => this.onClose(reason));
    }
    destroyAllChildren() {
      for (let id in this.root.children[this.id]) {
        this.getChildById(id).destroy();
      }
    }
    onLiveRedirect(redir) {
      let { to, kind, flash } = redir;
      let url = this.expandURL(to);
      this.liveSocket.historyRedirect(url, kind, flash);
    }
    onLivePatch(redir) {
      let { to, kind } = redir;
      this.href = this.expandURL(to);
      this.liveSocket.historyPatch(to, kind);
    }
    expandURL(to) {
      return to.startsWith("/") ? `${window.location.protocol}//${window.location.host}${to}` : to;
    }
    onRedirect({ to, flash }) {
      this.liveSocket.redirect(to, flash);
    }
    isDestroyed() {
      return this.destroyed;
    }
    join(callback) {
      if (!this.parent) {
        this.stopCallback = this.liveSocket.withPageLoading({ to: this.href, kind: "initial" });
      }
      this.joinCallback = (onDone) => {
        onDone = onDone || function() {
        };
        callback ? callback(this.joinCount, onDone) : onDone();
      };
      this.liveSocket.wrapPush(this, { timeout: false }, () => {
        return this.channel.join().receive("ok", (data) => {
          if (!this.isDestroyed()) {
            this.liveSocket.requestDOMUpdate(() => this.onJoin(data));
          }
        }).receive("error", (resp) => !this.isDestroyed() && this.onJoinError(resp)).receive("timeout", () => !this.isDestroyed() && this.onJoinError({ reason: "timeout" }));
      });
    }
    onJoinError(resp) {
      if (resp.reason === "unauthorized" || resp.reason === "stale") {
        this.log("error", () => ["unauthorized live_redirect. Falling back to page request", resp]);
        return this.onRedirect({ to: this.href });
      }
      if (resp.redirect || resp.live_redirect) {
        this.joinPending = false;
        this.channel.leave();
      }
      if (resp.redirect) {
        return this.onRedirect(resp.redirect);
      }
      if (resp.live_redirect) {
        return this.onLiveRedirect(resp.live_redirect);
      }
      this.log("error", () => ["unable to join", resp]);
      return this.liveSocket.reloadWithJitter(this);
    }
    onClose(reason) {
      if (this.isDestroyed()) {
        return;
      }
      if (this.isJoinPending() && document.visibilityState !== "hidden" || this.liveSocket.hasPendingLink() && reason !== "leave") {
        return this.liveSocket.reloadWithJitter(this);
      }
      this.destroyAllChildren();
      this.liveSocket.dropActiveElement(this);
      if (document.activeElement) {
        document.activeElement.blur();
      }
      if (this.liveSocket.isUnloaded()) {
        this.showLoader(BEFORE_UNLOAD_LOADER_TIMEOUT);
      }
    }
    onError(reason) {
      this.onClose(reason);
      this.log("error", () => ["view crashed", reason]);
      if (!this.liveSocket.isUnloaded()) {
        this.displayError();
      }
    }
    displayError() {
      if (this.isMain()) {
        dom_default.dispatchEvent(window, "phx:page-loading-start", { to: this.href, kind: "error" });
      }
      this.showLoader();
      this.setContainerClasses(PHX_DISCONNECTED_CLASS, PHX_ERROR_CLASS);
    }
    pushWithReply(refGenerator, event, payload, onReply = function() {
    }) {
      if (!this.isConnected()) {
        return;
      }
      let [ref, [el], opts] = refGenerator ? refGenerator() : [null, [], {}];
      let onLoadingDone = function() {
      };
      if (opts.page_loading || el && el.getAttribute(this.binding(PHX_PAGE_LOADING)) !== null) {
        onLoadingDone = this.liveSocket.withPageLoading({ kind: "element", target: el });
      }
      if (typeof payload.cid !== "number") {
        delete payload.cid;
      }
      return this.liveSocket.wrapPush(this, { timeout: true }, () => {
        return this.channel.push(event, payload, PUSH_TIMEOUT).receive("ok", (resp) => {
          this.liveSocket.requestDOMUpdate(() => {
            let hookReply = null;
            if (ref !== null) {
              this.undoRefs(ref);
            }
            if (resp.diff) {
              hookReply = this.applyDiff("update", resp.diff, ({ diff, events }) => {
                this.update(diff, events);
              });
            }
            if (resp.redirect) {
              this.onRedirect(resp.redirect);
            }
            if (resp.live_patch) {
              this.onLivePatch(resp.live_patch);
            }
            if (resp.live_redirect) {
              this.onLiveRedirect(resp.live_redirect);
            }
            onLoadingDone();
            onReply(resp, hookReply);
          });
        });
      });
    }
    undoRefs(ref) {
      dom_default.all(this.el, `[${PHX_REF}="${ref}"]`, (el) => {
        let disabledVal = el.getAttribute(PHX_DISABLED);
        el.removeAttribute(PHX_REF);
        if (el.getAttribute(PHX_READONLY) !== null) {
          el.readOnly = false;
          el.removeAttribute(PHX_READONLY);
        }
        if (disabledVal !== null) {
          el.disabled = disabledVal === "true" ? true : false;
          el.removeAttribute(PHX_DISABLED);
        }
        PHX_EVENT_CLASSES.forEach((className) => dom_default.removeClass(el, className));
        let disableRestore = el.getAttribute(PHX_DISABLE_WITH_RESTORE);
        if (disableRestore !== null) {
          el.innerText = disableRestore;
          el.removeAttribute(PHX_DISABLE_WITH_RESTORE);
        }
        let toEl = dom_default.private(el, PHX_REF);
        if (toEl) {
          let hook = this.triggerBeforeUpdateHook(el, toEl);
          DOMPatch.patchEl(el, toEl, this.liveSocket.getActiveElement());
          if (hook) {
            hook.__updated();
          }
          dom_default.deletePrivate(el, PHX_REF);
        }
      });
    }
    putRef(elements, event, opts = {}) {
      let newRef = this.ref++;
      let disableWith = this.binding(PHX_DISABLE_WITH);
      if (opts.loading) {
        elements = elements.concat(dom_default.all(document, opts.loading));
      }
      elements.forEach((el) => {
        el.classList.add(`phx-${event}-loading`);
        el.setAttribute(PHX_REF, newRef);
        let disableText = el.getAttribute(disableWith);
        if (disableText !== null) {
          if (!el.getAttribute(PHX_DISABLE_WITH_RESTORE)) {
            el.setAttribute(PHX_DISABLE_WITH_RESTORE, el.innerText);
          }
          el.innerText = disableText;
        }
      });
      return [newRef, elements, opts];
    }
    componentID(el) {
      let cid = el.getAttribute && el.getAttribute(PHX_COMPONENT);
      return cid ? parseInt(cid) : null;
    }
    targetComponentID(target, targetCtx) {
      if (isCid(targetCtx)) {
        return targetCtx;
      }
      let cidOrSelector = target.getAttribute(this.binding("target"));
      if (isCid(cidOrSelector)) {
        return parseInt(cidOrSelector);
      } else if (targetCtx && cidOrSelector !== null) {
        return this.closestComponentID(targetCtx);
      } else {
        return null;
      }
    }
    closestComponentID(targetCtx) {
      if (isCid(targetCtx)) {
        return targetCtx;
      } else if (targetCtx) {
        return maybe(targetCtx.closest(`[${PHX_COMPONENT}]`), (el) => this.ownsElement(el) && this.componentID(el));
      } else {
        return null;
      }
    }
    pushHookEvent(targetCtx, event, payload, onReply) {
      if (!this.isConnected()) {
        this.log("hook", () => ["unable to push hook event. LiveView not connected", event, payload]);
        return false;
      }
      let [ref, els, opts] = this.putRef([], "hook");
      this.pushWithReply(() => [ref, els, opts], "event", {
        type: "hook",
        event,
        value: payload,
        cid: this.closestComponentID(targetCtx)
      }, (resp, reply) => onReply(reply, ref));
      return ref;
    }
    extractMeta(el, meta, value) {
      let prefix = this.binding("value-");
      for (let i = 0; i < el.attributes.length; i++) {
        if (!meta) {
          meta = {};
        }
        let name = el.attributes[i].name;
        if (name.startsWith(prefix)) {
          meta[name.replace(prefix, "")] = el.getAttribute(name);
        }
      }
      if (el.value !== void 0) {
        if (!meta) {
          meta = {};
        }
        meta.value = el.value;
        if (el.tagName === "INPUT" && CHECKABLE_INPUTS.indexOf(el.type) >= 0 && !el.checked) {
          delete meta.value;
        }
      }
      if (value) {
        if (!meta) {
          meta = {};
        }
        for (let key in value) {
          meta[key] = value[key];
        }
      }
      return meta;
    }
    pushEvent(type, el, targetCtx, phxEvent, meta, opts = {}) {
      this.pushWithReply(() => this.putRef([el], type, opts), "event", {
        type,
        event: phxEvent,
        value: this.extractMeta(el, meta, opts.value),
        cid: this.targetComponentID(el, targetCtx)
      });
    }
    pushFileProgress(fileEl, entryRef, progress, onReply = function() {
    }) {
      this.liveSocket.withinOwners(fileEl.form, (view, targetCtx) => {
        view.pushWithReply(null, "progress", {
          event: fileEl.getAttribute(view.binding(PHX_PROGRESS)),
          ref: fileEl.getAttribute(PHX_UPLOAD_REF),
          entry_ref: entryRef,
          progress,
          cid: view.targetComponentID(fileEl.form, targetCtx)
        }, onReply);
      });
    }
    pushInput(inputEl, targetCtx, forceCid, phxEvent, opts, callback) {
      let uploads;
      let cid = isCid(forceCid) ? forceCid : this.targetComponentID(inputEl.form, targetCtx);
      let refGenerator = () => this.putRef([inputEl, inputEl.form], "change", opts);
      let formData = serializeForm(inputEl.form, { _target: opts._target });
      if (dom_default.isUploadInput(inputEl) && inputEl.files && inputEl.files.length > 0) {
        LiveUploader.trackFiles(inputEl, Array.from(inputEl.files));
      }
      uploads = LiveUploader.serializeUploads(inputEl);
      let event = {
        type: "form",
        event: phxEvent,
        value: formData,
        uploads,
        cid
      };
      this.pushWithReply(refGenerator, "event", event, (resp) => {
        dom_default.showError(inputEl, this.liveSocket.binding(PHX_FEEDBACK_FOR));
        if (dom_default.isUploadInput(inputEl) && inputEl.getAttribute("data-phx-auto-upload") !== null) {
          if (LiveUploader.filesAwaitingPreflight(inputEl).length > 0) {
            let [ref, _els] = refGenerator();
            this.uploadFiles(inputEl.form, targetCtx, ref, cid, (_uploads) => {
              callback && callback(resp);
              this.triggerAwaitingSubmit(inputEl.form);
            });
          }
        } else {
          callback && callback(resp);
        }
      });
    }
    triggerAwaitingSubmit(formEl) {
      let awaitingSubmit = this.getScheduledSubmit(formEl);
      if (awaitingSubmit) {
        let [_el, _ref, _opts, callback] = awaitingSubmit;
        this.cancelSubmit(formEl);
        callback();
      }
    }
    getScheduledSubmit(formEl) {
      return this.formSubmits.find(([el, _ref, _opts, _callback]) => el.isSameNode(formEl));
    }
    scheduleSubmit(formEl, ref, opts, callback) {
      if (this.getScheduledSubmit(formEl)) {
        return true;
      }
      this.formSubmits.push([formEl, ref, opts, callback]);
    }
    cancelSubmit(formEl) {
      this.formSubmits = this.formSubmits.filter(([el, ref, _callback]) => {
        if (el.isSameNode(formEl)) {
          this.undoRefs(ref);
          return false;
        } else {
          return true;
        }
      });
    }
    pushFormSubmit(formEl, targetCtx, phxEvent, opts, onReply) {
      let filterIgnored = (el) => {
        let userIgnored = closestPhxBinding(el, `${this.binding(PHX_UPDATE)}=ignore`, el.form);
        return !(userIgnored || closestPhxBinding(el, "data-phx-update=ignore", el.form));
      };
      let filterDisables = (el) => {
        return el.hasAttribute(this.binding(PHX_DISABLE_WITH));
      };
      let filterButton = (el) => el.tagName == "BUTTON";
      let filterInput = (el) => ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
      let refGenerator = () => {
        let formElements = Array.from(formEl.elements);
        let disables = formElements.filter(filterDisables);
        let buttons = formElements.filter(filterButton).filter(filterIgnored);
        let inputs = formElements.filter(filterInput).filter(filterIgnored);
        buttons.forEach((button) => {
          button.setAttribute(PHX_DISABLED, button.disabled);
          button.disabled = true;
        });
        inputs.forEach((input) => {
          input.setAttribute(PHX_READONLY, input.readOnly);
          input.readOnly = true;
          if (input.files) {
            input.setAttribute(PHX_DISABLED, input.disabled);
            input.disabled = true;
          }
        });
        formEl.setAttribute(this.binding(PHX_PAGE_LOADING), "");
        return this.putRef([formEl].concat(disables).concat(buttons).concat(inputs), "submit", opts);
      };
      let cid = this.targetComponentID(formEl, targetCtx);
      if (LiveUploader.hasUploadsInProgress(formEl)) {
        let [ref, _els] = refGenerator();
        let push = () => this.pushFormSubmit(formEl, targetCtx, phxEvent, opts, onReply);
        return this.scheduleSubmit(formEl, ref, opts, push);
      } else if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
        let [ref, els] = refGenerator();
        let proxyRefGen = () => [ref, els, opts];
        this.uploadFiles(formEl, targetCtx, ref, cid, (_uploads) => {
          let formData = serializeForm(formEl, {});
          this.pushWithReply(proxyRefGen, "event", {
            type: "form",
            event: phxEvent,
            value: formData,
            cid
          }, onReply);
        });
      } else {
        let formData = serializeForm(formEl);
        this.pushWithReply(refGenerator, "event", {
          type: "form",
          event: phxEvent,
          value: formData,
          cid
        }, onReply);
      }
    }
    uploadFiles(formEl, targetCtx, ref, cid, onComplete) {
      let joinCountAtUpload = this.joinCount;
      let inputEls = LiveUploader.activeFileInputs(formEl);
      let numFileInputsInProgress = inputEls.length;
      inputEls.forEach((inputEl) => {
        let uploader = new LiveUploader(inputEl, this, () => {
          numFileInputsInProgress--;
          if (numFileInputsInProgress === 0) {
            onComplete();
          }
        });
        this.uploaders[inputEl] = uploader;
        let entries = uploader.entries().map((entry) => entry.toPreflightPayload());
        let payload = {
          ref: inputEl.getAttribute(PHX_UPLOAD_REF),
          entries,
          cid: this.targetComponentID(inputEl.form, targetCtx)
        };
        this.log("upload", () => ["sending preflight request", payload]);
        this.pushWithReply(null, "allow_upload", payload, (resp) => {
          this.log("upload", () => ["got preflight response", resp]);
          if (resp.error) {
            this.undoRefs(ref);
            let [entry_ref, reason] = resp.error;
            this.log("upload", () => [`error for entry ${entry_ref}`, reason]);
          } else {
            let onError = (callback) => {
              this.channel.onError(() => {
                if (this.joinCount === joinCountAtUpload) {
                  callback();
                }
              });
            };
            uploader.initAdapterUpload(resp, onError, this.liveSocket);
          }
        });
      });
    }
    dispatchUploads(name, filesOrBlobs) {
      let inputs = dom_default.findUploadInputs(this.el).filter((el) => el.name === name);
      if (inputs.length === 0) {
        logError(`no live file inputs found matching the name "${name}"`);
      } else if (inputs.length > 1) {
        logError(`duplicate live file inputs found matching the name "${name}"`);
      } else {
        dom_default.dispatchEvent(inputs[0], PHX_TRACK_UPLOADS, { files: filesOrBlobs });
      }
    }
    pushFormRecovery(form, newCid, callback) {
      this.liveSocket.withinOwners(form, (view, targetCtx) => {
        let input = form.elements[0];
        let phxEvent = form.getAttribute(this.binding(PHX_AUTO_RECOVER)) || form.getAttribute(this.binding("change"));
        js_default.exec("change", phxEvent, view, input, ["push", { _target: input.name, newCid, callback }]);
      });
    }
    pushLinkPatch(href, targetEl, callback) {
      let linkRef = this.liveSocket.setPendingLink(href);
      let refGen = targetEl ? () => this.putRef([targetEl], "click") : null;
      this.pushWithReply(refGen, "live_patch", { url: href }, (resp) => {
        this.liveSocket.requestDOMUpdate(() => {
          if (resp.link_redirect) {
            this.liveSocket.replaceMain(href, null, callback, linkRef);
          } else {
            if (this.liveSocket.commitPendingLink(linkRef)) {
              this.href = href;
            }
            this.applyPendingUpdates();
            callback && callback(linkRef);
          }
        });
      }).receive("timeout", () => this.liveSocket.redirect(window.location.href));
    }
    formsForRecovery(html) {
      if (this.joinCount === 0) {
        return [];
      }
      let phxChange = this.binding("change");
      let template = document.createElement("template");
      template.innerHTML = html;
      return dom_default.all(this.el, `form[${phxChange}]`).filter((form) => form.id && this.ownsElement(form)).filter((form) => form.elements.length > 0).filter((form) => form.getAttribute(this.binding(PHX_AUTO_RECOVER)) !== "ignore").map((form) => {
        let newForm = template.content.querySelector(`form[id="${form.id}"][${phxChange}="${form.getAttribute(phxChange)}"]`);
        if (newForm) {
          return [form, newForm, this.targetComponentID(newForm)];
        } else {
          return [form, null, null];
        }
      }).filter(([form, newForm, newCid]) => newForm);
    }
    maybePushComponentsDestroyed(destroyedCIDs) {
      let willDestroyCIDs = destroyedCIDs.filter((cid) => {
        return dom_default.findComponentNodeList(this.el, cid).length === 0;
      });
      if (willDestroyCIDs.length > 0) {
        this.pruningCIDs.push(...willDestroyCIDs);
        this.pushWithReply(null, "cids_will_destroy", { cids: willDestroyCIDs }, () => {
          this.pruningCIDs = this.pruningCIDs.filter((cid) => willDestroyCIDs.indexOf(cid) !== -1);
          let completelyDestroyCIDs = willDestroyCIDs.filter((cid) => {
            return dom_default.findComponentNodeList(this.el, cid).length === 0;
          });
          if (completelyDestroyCIDs.length > 0) {
            this.pushWithReply(null, "cids_destroyed", { cids: completelyDestroyCIDs }, (resp) => {
              this.rendered.pruneCIDs(resp.cids);
            });
          }
        });
      }
    }
    ownsElement(el) {
      return el.getAttribute(PHX_PARENT_ID) === this.id || maybe(el.closest(PHX_VIEW_SELECTOR), (node) => node.id) === this.id;
    }
    submitForm(form, targetCtx, phxEvent, opts = {}) {
      dom_default.putPrivate(form, PHX_HAS_SUBMITTED, true);
      this.liveSocket.blurActiveElement(this);
      this.pushFormSubmit(form, targetCtx, phxEvent, opts, () => {
        this.liveSocket.restorePreviouslyActiveFocus();
      });
    }
    binding(kind) {
      return this.liveSocket.binding(kind);
    }
  };
  var LiveSocket = class {
    constructor(url, phxSocket, opts = {}) {
      this.unloaded = false;
      if (!phxSocket || phxSocket.constructor.name === "Object") {
        throw new Error(`
      a phoenix Socket must be provided as the second argument to the LiveSocket constructor. For example:

          import {Socket} from "phoenix"
          import LiveSocket from "phoenix_live_view"
          let liveSocket = new LiveSocket("/live", Socket, {...})
      `);
      }
      this.socket = new phxSocket(url, opts);
      this.bindingPrefix = opts.bindingPrefix || BINDING_PREFIX;
      this.opts = opts;
      this.params = closure2(opts.params || {});
      this.viewLogger = opts.viewLogger;
      this.metadataCallbacks = opts.metadata || {};
      this.defaults = Object.assign(clone(DEFAULTS), opts.defaults || {});
      this.activeElement = null;
      this.prevActive = null;
      this.silenced = false;
      this.main = null;
      this.linkRef = 1;
      this.roots = {};
      this.href = window.location.href;
      this.pendingLink = null;
      this.currentLocation = clone(window.location);
      this.hooks = opts.hooks || {};
      this.uploaders = opts.uploaders || {};
      this.loaderTimeout = opts.loaderTimeout || LOADER_TIMEOUT;
      this.localStorage = opts.localStorage || window.localStorage;
      this.sessionStorage = opts.sessionStorage || window.sessionStorage;
      this.boundTopLevelEvents = false;
      this.domCallbacks = Object.assign({ onNodeAdded: closure2(), onBeforeElUpdated: closure2() }, opts.dom || {});
      this.transitions = new TransitionSet();
      window.addEventListener("pagehide", (_e) => {
        this.unloaded = true;
      });
      this.socket.onOpen(() => {
        if (this.isUnloaded()) {
          window.location.reload();
        }
      });
    }
    isProfileEnabled() {
      return this.sessionStorage.getItem(PHX_LV_PROFILE) === "true";
    }
    isDebugEnabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "true";
    }
    enableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "true");
    }
    enableProfiling() {
      this.sessionStorage.setItem(PHX_LV_PROFILE, "true");
    }
    disableDebug() {
      this.sessionStorage.removeItem(PHX_LV_DEBUG);
    }
    disableProfiling() {
      this.sessionStorage.removeItem(PHX_LV_PROFILE);
    }
    enableLatencySim(upperBoundMs) {
      this.enableDebug();
      console.log("latency simulator enabled for the duration of this browser session. Call disableLatencySim() to disable");
      this.sessionStorage.setItem(PHX_LV_LATENCY_SIM, upperBoundMs);
    }
    disableLatencySim() {
      this.sessionStorage.removeItem(PHX_LV_LATENCY_SIM);
    }
    getLatencySim() {
      let str = this.sessionStorage.getItem(PHX_LV_LATENCY_SIM);
      return str ? parseInt(str) : null;
    }
    getSocket() {
      return this.socket;
    }
    connect() {
      let doConnect = () => {
        if (this.joinRootViews()) {
          this.bindTopLevelEvents();
          this.socket.connect();
        }
      };
      if (["complete", "loaded", "interactive"].indexOf(document.readyState) >= 0) {
        doConnect();
      } else {
        document.addEventListener("DOMContentLoaded", () => doConnect());
      }
    }
    disconnect(callback) {
      this.socket.disconnect(callback);
    }
    execJS(el, encodedJS, eventType = null) {
      this.owner(el, (view) => js_default.exec(eventType, encodedJS, view, el));
    }
    triggerDOM(kind, args) {
      this.domCallbacks[kind](...args);
    }
    time(name, func) {
      if (!this.isProfileEnabled() || !console.time) {
        return func();
      }
      console.time(name);
      let result = func();
      console.timeEnd(name);
      return result;
    }
    log(view, kind, msgCallback) {
      if (this.viewLogger) {
        let [msg, obj] = msgCallback();
        this.viewLogger(view, kind, msg, obj);
      } else if (this.isDebugEnabled()) {
        let [msg, obj] = msgCallback();
        debug(view, kind, msg, obj);
      }
    }
    requestDOMUpdate(callback) {
      this.transitions.after(callback);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.transitions.addTransition(time, onStart, onDone);
    }
    onChannel(channel, event, cb) {
      channel.on(event, (data) => {
        let latency = this.getLatencySim();
        if (!latency) {
          cb(data);
        } else {
          console.log(`simulating ${latency}ms of latency from server to client`);
          setTimeout(() => cb(data), latency);
        }
      });
    }
    wrapPush(view, opts, push) {
      let latency = this.getLatencySim();
      let oldJoinCount = view.joinCount;
      if (!latency) {
        if (opts.timeout) {
          return push().receive("timeout", () => {
            if (view.joinCount === oldJoinCount && !view.isDestroyed()) {
              this.reloadWithJitter(view, () => {
                this.log(view, "timeout", () => ["received timeout while communicating with server. Falling back to hard refresh for recovery"]);
              });
            }
          });
        } else {
          return push();
        }
      }
      console.log(`simulating ${latency}ms of latency from client to server`);
      let fakePush = {
        receives: [],
        receive(kind, cb) {
          this.receives.push([kind, cb]);
        }
      };
      setTimeout(() => {
        if (view.isDestroyed()) {
          return;
        }
        fakePush.receives.reduce((acc, [kind, cb]) => acc.receive(kind, cb), push());
      }, latency);
      return fakePush;
    }
    reloadWithJitter(view, log) {
      view.destroy();
      this.disconnect();
      let [minMs, maxMs] = RELOAD_JITTER;
      let afterMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
      let tries = browser_default.updateLocal(this.localStorage, window.location.pathname, CONSECUTIVE_RELOADS, 0, (count) => count + 1);
      log ? log() : this.log(view, "join", () => [`encountered ${tries} consecutive reloads`]);
      if (tries > MAX_RELOADS) {
        this.log(view, "join", () => [`exceeded ${MAX_RELOADS} consecutive reloads. Entering failsafe mode`]);
        afterMs = FAILSAFE_JITTER;
      }
      setTimeout(() => {
        if (this.hasPendingLink()) {
          window.location = this.pendingLink;
        } else {
          window.location.reload();
        }
      }, afterMs);
    }
    getHookCallbacks(name) {
      return name && name.startsWith("Phoenix.") ? hooks_default[name.split(".")[1]] : this.hooks[name];
    }
    isUnloaded() {
      return this.unloaded;
    }
    isConnected() {
      return this.socket.isConnected();
    }
    getBindingPrefix() {
      return this.bindingPrefix;
    }
    binding(kind) {
      return `${this.getBindingPrefix()}${kind}`;
    }
    channel(topic, params) {
      return this.socket.channel(topic, params);
    }
    joinRootViews() {
      let rootsFound = false;
      dom_default.all(document, `${PHX_VIEW_SELECTOR}:not([${PHX_PARENT_ID}])`, (rootEl) => {
        if (!this.getRootById(rootEl.id)) {
          let view = this.newRootView(rootEl);
          view.setHref(this.getHref());
          view.join();
          if (rootEl.getAttribute(PHX_MAIN)) {
            this.main = view;
          }
        }
        rootsFound = true;
      });
      return rootsFound;
    }
    redirect(to, flash) {
      this.disconnect();
      browser_default.redirect(to, flash);
    }
    replaceMain(href, flash, callback = null, linkRef = this.setPendingLink(href)) {
      let oldMainEl = this.main.el;
      let newMainEl = dom_default.cloneNode(oldMainEl, "");
      this.main.showLoader(this.loaderTimeout);
      this.main.destroy();
      this.main = this.newRootView(newMainEl, flash);
      this.main.setRedirect(href);
      this.transitionRemoves();
      this.main.join((joinCount, onDone) => {
        if (joinCount === 1 && this.commitPendingLink(linkRef)) {
          this.requestDOMUpdate(() => {
            oldMainEl.replaceWith(newMainEl);
            callback && callback();
            onDone();
          });
        }
      });
    }
    transitionRemoves(elements) {
      let removeAttr = this.binding("remove");
      elements = elements || dom_default.all(document, `[${removeAttr}]`);
      elements.forEach((el) => {
        if (document.body.contains(el)) {
          this.execJS(el, el.getAttribute(removeAttr), "remove");
        }
      });
    }
    isPhxView(el) {
      return el.getAttribute && el.getAttribute(PHX_SESSION) !== null;
    }
    newRootView(el, flash) {
      let view = new View(el, this, null, flash);
      this.roots[view.id] = view;
      return view;
    }
    owner(childEl, callback) {
      let view = maybe(childEl.closest(PHX_VIEW_SELECTOR), (el) => this.getViewByEl(el)) || this.main;
      if (view) {
        callback(view);
      }
    }
    withinOwners(childEl, callback) {
      this.owner(childEl, (view) => callback(view, childEl));
    }
    getViewByEl(el) {
      let rootId = el.getAttribute(PHX_ROOT_ID);
      return maybe(this.getRootById(rootId), (root) => root.getDescendentByEl(el));
    }
    getRootById(id) {
      return this.roots[id];
    }
    destroyAllViews() {
      for (let id in this.roots) {
        this.roots[id].destroy();
        delete this.roots[id];
      }
    }
    destroyViewByEl(el) {
      let root = this.getRootById(el.getAttribute(PHX_ROOT_ID));
      if (root) {
        root.destroyDescendent(el.id);
      }
    }
    setActiveElement(target) {
      if (this.activeElement === target) {
        return;
      }
      this.activeElement = target;
      let cancel = () => {
        if (target === this.activeElement) {
          this.activeElement = null;
        }
        target.removeEventListener("mouseup", this);
        target.removeEventListener("touchend", this);
      };
      target.addEventListener("mouseup", cancel);
      target.addEventListener("touchend", cancel);
    }
    getActiveElement() {
      if (document.activeElement === document.body) {
        return this.activeElement || document.activeElement;
      } else {
        return document.activeElement || document.body;
      }
    }
    dropActiveElement(view) {
      if (this.prevActive && view.ownsElement(this.prevActive)) {
        this.prevActive = null;
      }
    }
    restorePreviouslyActiveFocus() {
      if (this.prevActive && this.prevActive !== document.body) {
        this.prevActive.focus();
      }
    }
    blurActiveElement() {
      this.prevActive = this.getActiveElement();
      if (this.prevActive !== document.body) {
        this.prevActive.blur();
      }
    }
    bindTopLevelEvents() {
      if (this.boundTopLevelEvents) {
        return;
      }
      this.boundTopLevelEvents = true;
      document.body.addEventListener("click", function() {
      });
      window.addEventListener("pageshow", (e) => {
        if (e.persisted) {
          this.getSocket().disconnect();
          this.withPageLoading({ to: window.location.href, kind: "redirect" });
          window.location.reload();
        }
      }, true);
      this.bindNav();
      this.bindClicks();
      this.bindForms();
      this.bind({ keyup: "keyup", keydown: "keydown" }, (e, type, view, targetEl, phxEvent, eventTarget) => {
        let matchKey = targetEl.getAttribute(this.binding(PHX_KEY));
        let pressedKey = e.key && e.key.toLowerCase();
        if (matchKey && matchKey.toLowerCase() !== pressedKey) {
          return;
        }
        let data = __spreadValues({ key: e.key }, this.eventMeta(type, e, targetEl));
        js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
      });
      this.bind({ blur: "focusout", focus: "focusin" }, (e, type, view, targetEl, phxEvent, eventTarget) => {
        if (!eventTarget) {
          let data = __spreadValues({ key: e.key }, this.eventMeta(type, e, targetEl));
          js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      this.bind({ blur: "blur", focus: "focus" }, (e, type, view, targetEl, targetCtx, phxEvent, phxTarget) => {
        if (phxTarget === "window") {
          let data = this.eventMeta(type, e, targetEl);
          js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      window.addEventListener("dragover", (e) => e.preventDefault());
      window.addEventListener("drop", (e) => {
        e.preventDefault();
        let dropTargetId = maybe(closestPhxBinding(e.target, this.binding(PHX_DROP_TARGET)), (trueTarget) => {
          return trueTarget.getAttribute(this.binding(PHX_DROP_TARGET));
        });
        let dropTarget = dropTargetId && document.getElementById(dropTargetId);
        let files = Array.from(e.dataTransfer.files || []);
        if (!dropTarget || dropTarget.disabled || files.length === 0 || !(dropTarget.files instanceof FileList)) {
          return;
        }
        LiveUploader.trackFiles(dropTarget, files);
        dropTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
      this.on(PHX_TRACK_UPLOADS, (e) => {
        let uploadTarget = e.target;
        if (!dom_default.isUploadInput(uploadTarget)) {
          return;
        }
        let files = Array.from(e.detail.files || []).filter((f) => f instanceof File || f instanceof Blob);
        LiveUploader.trackFiles(uploadTarget, files);
        uploadTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
    eventMeta(eventName, e, targetEl) {
      let callback = this.metadataCallbacks[eventName];
      return callback ? callback(e, targetEl) : {};
    }
    setPendingLink(href) {
      this.linkRef++;
      this.pendingLink = href;
      return this.linkRef;
    }
    commitPendingLink(linkRef) {
      if (this.linkRef !== linkRef) {
        return false;
      } else {
        this.href = this.pendingLink;
        this.pendingLink = null;
        return true;
      }
    }
    getHref() {
      return this.href;
    }
    hasPendingLink() {
      return !!this.pendingLink;
    }
    bind(events, callback) {
      for (let event in events) {
        let browserEventName = events[event];
        this.on(browserEventName, (e) => {
          let binding = this.binding(event);
          let windowBinding = this.binding(`window-${event}`);
          let targetPhxEvent = e.target.getAttribute && e.target.getAttribute(binding);
          if (targetPhxEvent) {
            this.debounce(e.target, e, () => {
              this.withinOwners(e.target, (view) => {
                callback(e, event, view, e.target, targetPhxEvent, null);
              });
            });
          } else {
            dom_default.all(document, `[${windowBinding}]`, (el) => {
              let phxEvent = el.getAttribute(windowBinding);
              this.debounce(el, e, () => {
                this.withinOwners(el, (view) => {
                  callback(e, event, view, el, phxEvent, "window");
                });
              });
            });
          }
        });
      }
    }
    bindClicks() {
      this.bindClick("click", "click", false);
      this.bindClick("mousedown", "capture-click", true);
    }
    bindClick(eventName, bindingName, capture) {
      let click = this.binding(bindingName);
      window.addEventListener(eventName, (e) => {
        if (!this.isConnected()) {
          return;
        }
        let target = null;
        if (capture) {
          target = e.target.matches(`[${click}]`) ? e.target : e.target.querySelector(`[${click}]`);
        } else {
          target = closestPhxBinding(e.target, click);
          this.dispatchClickAway(e);
        }
        let phxEvent = target && target.getAttribute(click);
        if (!phxEvent) {
          return;
        }
        if (target.getAttribute("href") === "#") {
          e.preventDefault();
        }
        this.debounce(target, e, () => {
          this.withinOwners(target, (view) => {
            js_default.exec("click", phxEvent, view, target, ["push", { data: this.eventMeta("click", e, target) }]);
          });
        });
      }, capture);
    }
    dispatchClickAway(e) {
      let binding = this.binding("click-away");
      dom_default.all(document, `[${binding}]`, (el) => {
        if (!(el.isSameNode(e.target) || el.contains(e.target))) {
          this.withinOwners(e.target, (view) => {
            let phxEvent = el.getAttribute(binding);
            if (js_default.isVisible(el)) {
              js_default.exec("click", phxEvent, view, e.target, ["push", { data: this.eventMeta("click", e, e.target) }]);
            }
          });
        }
      });
    }
    bindNav() {
      if (!browser_default.canPushState()) {
        return;
      }
      if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
      }
      let scrollTimer = null;
      window.addEventListener("scroll", (_e) => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          browser_default.updateCurrentState((state) => Object.assign(state, { scroll: window.scrollY }));
        }, 100);
      });
      window.addEventListener("popstate", (event) => {
        if (!this.registerNewLocation(window.location)) {
          return;
        }
        let { type, id, root, scroll } = event.state || {};
        let href = window.location.href;
        this.requestDOMUpdate(() => {
          if (this.main.isConnected() && (type === "patch" && id === this.main.id)) {
            this.main.pushLinkPatch(href, null);
          } else {
            this.replaceMain(href, null, () => {
              if (root) {
                this.replaceRootHistory();
              }
              if (typeof scroll === "number") {
                setTimeout(() => {
                  window.scrollTo(0, scroll);
                }, 0);
              }
            });
          }
        });
      }, false);
      window.addEventListener("click", (e) => {
        let target = closestPhxBinding(e.target, PHX_LIVE_LINK);
        let type = target && target.getAttribute(PHX_LIVE_LINK);
        let wantsNewTab = e.metaKey || e.ctrlKey || e.button === 1;
        if (!type || !this.isConnected() || !this.main || wantsNewTab) {
          return;
        }
        let href = target.href;
        let linkState = target.getAttribute(PHX_LINK_STATE);
        e.preventDefault();
        if (this.pendingLink === href) {
          return;
        }
        this.requestDOMUpdate(() => {
          if (type === "patch") {
            this.pushHistoryPatch(href, linkState, target);
          } else if (type === "redirect") {
            this.historyRedirect(href, linkState);
          } else {
            throw new Error(`expected ${PHX_LIVE_LINK} to be "patch" or "redirect", got: ${type}`);
          }
        });
      }, false);
    }
    dispatchEvent(event, payload = {}) {
      dom_default.dispatchEvent(window, `phx:${event}`, payload);
    }
    dispatchEvents(events) {
      events.forEach(([event, payload]) => this.dispatchEvent(event, payload));
    }
    withPageLoading(info, callback) {
      dom_default.dispatchEvent(window, "phx:page-loading-start", info);
      let done = () => dom_default.dispatchEvent(window, "phx:page-loading-stop", info);
      return callback ? callback(done) : done;
    }
    pushHistoryPatch(href, linkState, targetEl) {
      this.withPageLoading({ to: href, kind: "patch" }, (done) => {
        this.main.pushLinkPatch(href, targetEl, (linkRef) => {
          this.historyPatch(href, linkState, linkRef);
          done();
        });
      });
    }
    historyPatch(href, linkState, linkRef = this.setPendingLink(href)) {
      if (!this.commitPendingLink(linkRef)) {
        return;
      }
      browser_default.pushState(linkState, { type: "patch", id: this.main.id }, href);
      this.registerNewLocation(window.location);
    }
    historyRedirect(href, linkState, flash) {
      let scroll = window.scrollY;
      this.withPageLoading({ to: href, kind: "redirect" }, (done) => {
        this.replaceMain(href, flash, () => {
          browser_default.pushState(linkState, { type: "redirect", id: this.main.id, scroll }, href);
          this.registerNewLocation(window.location);
          done();
        });
      });
    }
    replaceRootHistory() {
      browser_default.pushState("replace", { root: true, type: "patch", id: this.main.id });
    }
    registerNewLocation(newLocation) {
      let { pathname, search } = this.currentLocation;
      if (pathname + search === newLocation.pathname + newLocation.search) {
        return false;
      } else {
        this.currentLocation = clone(newLocation);
        return true;
      }
    }
    bindForms() {
      let iterations = 0;
      this.on("submit", (e) => {
        let phxEvent = e.target.getAttribute(this.binding("submit"));
        if (!phxEvent) {
          return;
        }
        e.preventDefault();
        e.target.disabled = true;
        this.withinOwners(e.target, (view) => {
          js_default.exec("submit", phxEvent, view, e.target, ["push", {}]);
        });
      }, false);
      for (let type of ["change", "input"]) {
        this.on(type, (e) => {
          let input = e.target;
          let phxEvent = input.form && input.form.getAttribute(this.binding("change"));
          if (!phxEvent) {
            return;
          }
          if (input.type === "number" && input.validity && input.validity.badInput) {
            return;
          }
          let currentIterations = iterations;
          iterations++;
          let { at, type: lastType } = dom_default.private(input, "prev-iteration") || {};
          if (at === currentIterations - 1 && type !== lastType) {
            return;
          }
          dom_default.putPrivate(input, "prev-iteration", { at: currentIterations, type });
          this.debounce(input, e, () => {
            this.withinOwners(input.form, (view) => {
              dom_default.putPrivate(input, PHX_HAS_FOCUSED, true);
              if (!dom_default.isTextualInput(input)) {
                this.setActiveElement(input);
              }
              js_default.exec("change", phxEvent, view, input, ["push", { _target: e.target.name }]);
            });
          });
        }, false);
      }
    }
    debounce(el, event, callback) {
      let phxDebounce = this.binding(PHX_DEBOUNCE);
      let phxThrottle = this.binding(PHX_THROTTLE);
      let defaultDebounce = this.defaults.debounce.toString();
      let defaultThrottle = this.defaults.throttle.toString();
      dom_default.debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, callback);
    }
    silenceEvents(callback) {
      this.silenced = true;
      callback();
      this.silenced = false;
    }
    on(event, callback) {
      window.addEventListener(event, (e) => {
        if (!this.silenced) {
          callback(e);
        }
      });
    }
  };
  var TransitionSet = class {
    constructor() {
      this.transitions = /* @__PURE__ */ new Set();
      this.pendingOps = [];
      this.reset();
    }
    reset() {
      this.transitions.forEach((timer) => {
        cancelTimeout(timer);
        this.transitions.delete(timer);
      });
      this.flushPendingOps();
    }
    after(callback) {
      if (this.size() === 0) {
        callback();
      } else {
        this.pushPendingOp(callback);
      }
    }
    addTransition(time, onStart, onDone) {
      onStart();
      let timer = setTimeout(() => {
        this.transitions.delete(timer);
        onDone();
        if (this.size() === 0) {
          this.flushPendingOps();
        }
      }, time);
      this.transitions.add(timer);
    }
    pushPendingOp(op) {
      this.pendingOps.push(op);
    }
    size() {
      return this.transitions.size;
    }
    flushPendingOps() {
      this.pendingOps.forEach((op) => op());
      this.pendingOps = [];
    }
  };

  // js/app.js
  var import_topbar = __toModule(require_topbar());
  var csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  var liveSocket = new LiveSocket("/live", Socket, { params: { _csrf_token: csrfToken } });
  import_topbar.default.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
  window.addEventListener("phx:page-loading-start", (info) => import_topbar.default.show());
  window.addEventListener("phx:page-loading-stop", (info) => import_topbar.default.hide());
  liveSocket.connect();
  window.liveSocket = liveSocket;
})();
/**
 * @license MIT
 * topbar 1.0.0, 2021-01-06
 * https://buunguyen.github.io/topbar
 * Copyright (c) 2021 Buu Nguyen
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXNzZXRzL3ZlbmRvci90b3BiYXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2h0bWwvcHJpdi9zdGF0aWMvcGhvZW5peF9odG1sLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC91dGlscy5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvY29uc3RhbnRzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9wdXNoLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC90aW1lci5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvY2hhbm5lbC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvYWpheC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvbG9uZ3BvbGwuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L3ByZXNlbmNlLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9zZXJpYWxpemVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9zb2NrZXQuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvY29uc3RhbnRzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2VudHJ5X3VwbG9hZGVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3V0aWxzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2Jyb3dzZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZG9tLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3VwbG9hZF9lbnRyeS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9saXZlX3VwbG9hZGVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2hvb2tzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2RvbV9wb3N0X21vcnBoX3Jlc3RvcmVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL25vZGVfbW9kdWxlcy9tb3JwaGRvbS9kaXN0L21vcnBoZG9tLWVzbS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9kb21fcGF0Y2guanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvcmVuZGVyZWQuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvdmlld19ob29rLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2pzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3ZpZXcuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvbGl2ZV9zb2NrZXQuanMiLCAiLi4vLi4vLi4vYXNzZXRzL2pzL2FwcC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyoqXG4gKiBAbGljZW5zZSBNSVRcbiAqIHRvcGJhciAxLjAuMCwgMjAyMS0wMS0wNlxuICogaHR0cHM6Ly9idXVuZ3V5ZW4uZ2l0aHViLmlvL3RvcGJhclxuICogQ29weXJpZ2h0IChjKSAyMDIxIEJ1dSBOZ3V5ZW5cbiAqL1xuKGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50KSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC8xNTc5NjcxXG4gIChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxhc3RUaW1lID0gMDtcbiAgICB2YXIgdmVuZG9ycyA9IFtcIm1zXCIsIFwibW96XCIsIFwid2Via2l0XCIsIFwib1wiXTtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPVxuICAgICAgICB3aW5kb3dbdmVuZG9yc1t4XSArIFwiUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCJdO1xuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID1cbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyBcIkNhbmNlbEFuaW1hdGlvbkZyYW1lXCJdIHx8XG4gICAgICAgIHdpbmRvd1t2ZW5kb3JzW3hdICsgXCJDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIl07XG4gICAgfVxuICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSlcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcbiAgICAgICAgfSwgdGltZVRvQ2FsbCk7XG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgICB9O1xuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKVxuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgICB9O1xuICB9KSgpO1xuXG4gIHZhciBjYW52YXMsXG4gICAgcHJvZ3Jlc3NUaW1lcklkLFxuICAgIGZhZGVUaW1lcklkLFxuICAgIGN1cnJlbnRQcm9ncmVzcyxcbiAgICBzaG93aW5nLFxuICAgIGFkZEV2ZW50ID0gZnVuY3Rpb24gKGVsZW0sIHR5cGUsIGhhbmRsZXIpIHtcbiAgICAgIGlmIChlbGVtLmFkZEV2ZW50TGlzdGVuZXIpIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICBlbHNlIGlmIChlbGVtLmF0dGFjaEV2ZW50KSBlbGVtLmF0dGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGhhbmRsZXIpO1xuICAgICAgZWxzZSBlbGVtW1wib25cIiArIHR5cGVdID0gaGFuZGxlcjtcbiAgICB9LFxuICAgIG9wdGlvbnMgPSB7XG4gICAgICBhdXRvUnVuOiB0cnVlLFxuICAgICAgYmFyVGhpY2tuZXNzOiAzLFxuICAgICAgYmFyQ29sb3JzOiB7XG4gICAgICAgIDA6IFwicmdiYSgyNiwgIDE4OCwgMTU2LCAuOSlcIixcbiAgICAgICAgXCIuMjVcIjogXCJyZ2JhKDUyLCAgMTUyLCAyMTksIC45KVwiLFxuICAgICAgICBcIi41MFwiOiBcInJnYmEoMjQxLCAxOTYsIDE1LCAgLjkpXCIsXG4gICAgICAgIFwiLjc1XCI6IFwicmdiYSgyMzAsIDEyNiwgMzQsICAuOSlcIixcbiAgICAgICAgXCIxLjBcIjogXCJyZ2JhKDIxMSwgODQsICAwLCAgIC45KVwiLFxuICAgICAgfSxcbiAgICAgIHNoYWRvd0JsdXI6IDEwLFxuICAgICAgc2hhZG93Q29sb3I6IFwicmdiYSgwLCAgIDAsICAgMCwgICAuNilcIixcbiAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICB9LFxuICAgIHJlcGFpbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBvcHRpb25zLmJhclRoaWNrbmVzcyAqIDU7IC8vIG5lZWQgc3BhY2UgZm9yIHNoYWRvd1xuXG4gICAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGN0eC5zaGFkb3dCbHVyID0gb3B0aW9ucy5zaGFkb3dCbHVyO1xuICAgICAgY3R4LnNoYWRvd0NvbG9yID0gb3B0aW9ucy5zaGFkb3dDb2xvcjtcblxuICAgICAgdmFyIGxpbmVHcmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCBjYW52YXMud2lkdGgsIDApO1xuICAgICAgZm9yICh2YXIgc3RvcCBpbiBvcHRpb25zLmJhckNvbG9ycylcbiAgICAgICAgbGluZUdyYWRpZW50LmFkZENvbG9yU3RvcChzdG9wLCBvcHRpb25zLmJhckNvbG9yc1tzdG9wXSk7XG4gICAgICBjdHgubGluZVdpZHRoID0gb3B0aW9ucy5iYXJUaGlja25lc3M7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKDAsIG9wdGlvbnMuYmFyVGhpY2tuZXNzIC8gMik7XG4gICAgICBjdHgubGluZVRvKFxuICAgICAgICBNYXRoLmNlaWwoY3VycmVudFByb2dyZXNzICogY2FudmFzLndpZHRoKSxcbiAgICAgICAgb3B0aW9ucy5iYXJUaGlja25lc3MgLyAyXG4gICAgICApO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gbGluZUdyYWRpZW50O1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH0sXG4gICAgY3JlYXRlQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIHZhciBzdHlsZSA9IGNhbnZhcy5zdHlsZTtcbiAgICAgIHN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuICAgICAgc3R5bGUudG9wID0gc3R5bGUubGVmdCA9IHN0eWxlLnJpZ2h0ID0gc3R5bGUubWFyZ2luID0gc3R5bGUucGFkZGluZyA9IDA7XG4gICAgICBzdHlsZS56SW5kZXggPSAxMDAwMDE7XG4gICAgICBzdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBpZiAob3B0aW9ucy5jbGFzc05hbWUpIGNhbnZhcy5jbGFzc0xpc3QuYWRkKG9wdGlvbnMuY2xhc3NOYW1lKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICAgIGFkZEV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgcmVwYWludCk7XG4gICAgfSxcbiAgICB0b3BiYXIgPSB7XG4gICAgICBjb25maWc6IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvcHRzKVxuICAgICAgICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpIG9wdGlvbnNba2V5XSA9IG9wdHNba2V5XTtcbiAgICAgIH0sXG4gICAgICBzaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChzaG93aW5nKSByZXR1cm47XG4gICAgICAgIHNob3dpbmcgPSB0cnVlO1xuICAgICAgICBpZiAoZmFkZVRpbWVySWQgIT09IG51bGwpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShmYWRlVGltZXJJZCk7XG4gICAgICAgIGlmICghY2FudmFzKSBjcmVhdGVDYW52YXMoKTtcbiAgICAgICAgY2FudmFzLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICBjYW52YXMuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgdG9wYmFyLnByb2dyZXNzKDApO1xuICAgICAgICBpZiAob3B0aW9ucy5hdXRvUnVuKSB7XG4gICAgICAgICAgKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgICBwcm9ncmVzc1RpbWVySWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgICAgICAgICAgdG9wYmFyLnByb2dyZXNzKFxuICAgICAgICAgICAgICBcIitcIiArIDAuMDUgKiBNYXRoLnBvdygxIC0gTWF0aC5zcXJ0KGN1cnJlbnRQcm9ncmVzcyksIDIpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcm9ncmVzczogZnVuY3Rpb24gKHRvKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdG8gPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBjdXJyZW50UHJvZ3Jlc3M7XG4gICAgICAgIGlmICh0eXBlb2YgdG8gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICB0byA9XG4gICAgICAgICAgICAodG8uaW5kZXhPZihcIitcIikgPj0gMCB8fCB0by5pbmRleE9mKFwiLVwiKSA+PSAwXG4gICAgICAgICAgICAgID8gY3VycmVudFByb2dyZXNzXG4gICAgICAgICAgICAgIDogMCkgKyBwYXJzZUZsb2F0KHRvKTtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50UHJvZ3Jlc3MgPSB0byA+IDEgPyAxIDogdG87XG4gICAgICAgIHJlcGFpbnQoKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRQcm9ncmVzcztcbiAgICAgIH0sXG4gICAgICBoaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghc2hvd2luZykgcmV0dXJuO1xuICAgICAgICBzaG93aW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChwcm9ncmVzc1RpbWVySWQgIT0gbnVsbCkge1xuICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShwcm9ncmVzc1RpbWVySWQpO1xuICAgICAgICAgIHByb2dyZXNzVGltZXJJZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgaWYgKHRvcGJhci5wcm9ncmVzcyhcIisuMVwiKSA+PSAxKSB7XG4gICAgICAgICAgICBjYW52YXMuc3R5bGUub3BhY2l0eSAtPSAwLjA1O1xuICAgICAgICAgICAgaWYgKGNhbnZhcy5zdHlsZS5vcGFjaXR5IDw9IDAuMDUpIHtcbiAgICAgICAgICAgICAgY2FudmFzLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgZmFkZVRpbWVySWQgPSBudWxsO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZhZGVUaW1lcklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0sXG4gICAgfTtcblxuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHRvcGJhcjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdG9wYmFyO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudG9wYmFyID0gdG9wYmFyO1xuICB9XG59LmNhbGwodGhpcywgd2luZG93LCBkb2N1bWVudCkpO1xuIiwgIlwidXNlIHN0cmljdFwiO1xuXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBQb2x5ZmlsbEV2ZW50ID0gZXZlbnRDb25zdHJ1Y3RvcigpO1xuXG4gIGZ1bmN0aW9uIGV2ZW50Q29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHdpbmRvdy5DdXN0b21FdmVudDtcbiAgICAvLyBJRTw9OSBTdXBwb3J0XG4gICAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcykge1xuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHtidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkfTtcbiAgICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgICByZXR1cm4gZXZ0O1xuICAgIH1cbiAgICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlO1xuICAgIHJldHVybiBDdXN0b21FdmVudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkSGlkZGVuSW5wdXQobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgaW5wdXQudHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgaW5wdXQubmFtZSA9IG5hbWU7XG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhlbGVtZW50LCB0YXJnZXRNb2RpZmllcktleSkge1xuICAgIHZhciB0byA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS10b1wiKSxcbiAgICAgICAgbWV0aG9kID0gYnVpbGRIaWRkZW5JbnB1dChcIl9tZXRob2RcIiwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1ldGhvZFwiKSksXG4gICAgICAgIGNzcmYgPSBidWlsZEhpZGRlbklucHV0KFwiX2NzcmZfdG9rZW5cIiwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNzcmZcIikpLFxuICAgICAgICBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIiksXG4gICAgICAgIHRhcmdldCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidGFyZ2V0XCIpO1xuXG4gICAgZm9ybS5tZXRob2QgPSAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1ldGhvZFwiKSA9PT0gXCJnZXRcIikgPyBcImdldFwiIDogXCJwb3N0XCI7XG4gICAgZm9ybS5hY3Rpb24gPSB0bztcbiAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSBcImhpZGRlblwiO1xuXG4gICAgaWYgKHRhcmdldCkgZm9ybS50YXJnZXQgPSB0YXJnZXQ7XG4gICAgZWxzZSBpZiAodGFyZ2V0TW9kaWZpZXJLZXkpIGZvcm0udGFyZ2V0ID0gXCJfYmxhbmtcIjtcblxuICAgIGZvcm0uYXBwZW5kQ2hpbGQoY3NyZik7XG4gICAgZm9ybS5hcHBlbmRDaGlsZChtZXRob2QpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZm9ybSk7XG4gICAgZm9ybS5zdWJtaXQoKTtcbiAgfVxuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgIHZhciBlbGVtZW50ID0gZS50YXJnZXQ7XG5cbiAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgd2hpbGUgKGVsZW1lbnQgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUpIHtcbiAgICAgIHZhciBwaG9lbml4TGlua0V2ZW50ID0gbmV3IFBvbHlmaWxsRXZlbnQoJ3Bob2VuaXgubGluay5jbGljaycsIHtcbiAgICAgICAgXCJidWJibGVzXCI6IHRydWUsIFwiY2FuY2VsYWJsZVwiOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgaWYgKCFlbGVtZW50LmRpc3BhdGNoRXZlbnQocGhvZW5peExpbmtFdmVudCkpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtbWV0aG9kXCIpKSB7XG4gICAgICAgIGhhbmRsZUNsaWNrKGVsZW1lbnQsIGUubWV0YUtleSB8fCBlLnNoaWZ0S2V5KTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgfVxuICAgIH1cbiAgfSwgZmFsc2UpO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwaG9lbml4LmxpbmsuY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBtZXNzYWdlID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb25maXJtXCIpO1xuICAgIGlmKG1lc3NhZ2UgJiYgIXdpbmRvdy5jb25maXJtKG1lc3NhZ2UpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9LCBmYWxzZSk7XG59KSgpO1xuIiwgIi8vIHdyYXBzIHZhbHVlIGluIGNsb3N1cmUgb3IgcmV0dXJucyBjbG9zdXJlXG5leHBvcnQgbGV0IGNsb3N1cmUgPSAodmFsdWUpID0+IHtcbiAgaWYodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpe1xuICAgIHJldHVybiB2YWx1ZVxuICB9IGVsc2Uge1xuICAgIGxldCBjbG9zdXJlID0gZnVuY3Rpb24gKCl7IHJldHVybiB2YWx1ZSB9XG4gICAgcmV0dXJuIGNsb3N1cmVcbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBnbG9iYWxTZWxmID0gdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogbnVsbFxuZXhwb3J0IGNvbnN0IHBoeFdpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiBudWxsXG5leHBvcnQgY29uc3QgZ2xvYmFsID0gZ2xvYmFsU2VsZiB8fCBwaHhXaW5kb3cgfHwgdGhpc1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfVlNOID0gXCIyLjAuMFwiXG5leHBvcnQgY29uc3QgU09DS0VUX1NUQVRFUyA9IHtjb25uZWN0aW5nOiAwLCBvcGVuOiAxLCBjbG9zaW5nOiAyLCBjbG9zZWQ6IDN9XG5leHBvcnQgY29uc3QgREVGQVVMVF9USU1FT1VUID0gMTAwMDBcbmV4cG9ydCBjb25zdCBXU19DTE9TRV9OT1JNQUwgPSAxMDAwXG5leHBvcnQgY29uc3QgQ0hBTk5FTF9TVEFURVMgPSB7XG4gIGNsb3NlZDogXCJjbG9zZWRcIixcbiAgZXJyb3JlZDogXCJlcnJvcmVkXCIsXG4gIGpvaW5lZDogXCJqb2luZWRcIixcbiAgam9pbmluZzogXCJqb2luaW5nXCIsXG4gIGxlYXZpbmc6IFwibGVhdmluZ1wiLFxufVxuZXhwb3J0IGNvbnN0IENIQU5ORUxfRVZFTlRTID0ge1xuICBjbG9zZTogXCJwaHhfY2xvc2VcIixcbiAgZXJyb3I6IFwicGh4X2Vycm9yXCIsXG4gIGpvaW46IFwicGh4X2pvaW5cIixcbiAgcmVwbHk6IFwicGh4X3JlcGx5XCIsXG4gIGxlYXZlOiBcInBoeF9sZWF2ZVwiXG59XG5cbmV4cG9ydCBjb25zdCBUUkFOU1BPUlRTID0ge1xuICBsb25ncG9sbDogXCJsb25ncG9sbFwiLFxuICB3ZWJzb2NrZXQ6IFwid2Vic29ja2V0XCJcbn1cbmV4cG9ydCBjb25zdCBYSFJfU1RBVEVTID0ge1xuICBjb21wbGV0ZTogNFxufVxuIiwgIi8qKlxuICogSW5pdGlhbGl6ZXMgdGhlIFB1c2hcbiAqIEBwYXJhbSB7Q2hhbm5lbH0gY2hhbm5lbCAtIFRoZSBDaGFubmVsXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgLSBUaGUgZXZlbnQsIGZvciBleGFtcGxlIGBcInBoeF9qb2luXCJgXG4gKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCAtIFRoZSBwYXlsb2FkLCBmb3IgZXhhbXBsZSBge3VzZXJfaWQ6IDEyM31gXG4gKiBAcGFyYW0ge251bWJlcn0gdGltZW91dCAtIFRoZSBwdXNoIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFB1c2gge1xuICBjb25zdHJ1Y3RvcihjaGFubmVsLCBldmVudCwgcGF5bG9hZCwgdGltZW91dCl7XG4gICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbFxuICAgIHRoaXMuZXZlbnQgPSBldmVudFxuICAgIHRoaXMucGF5bG9hZCA9IHBheWxvYWQgfHwgZnVuY3Rpb24gKCl7IHJldHVybiB7fSB9XG4gICAgdGhpcy5yZWNlaXZlZFJlc3AgPSBudWxsXG4gICAgdGhpcy50aW1lb3V0ID0gdGltZW91dFxuICAgIHRoaXMudGltZW91dFRpbWVyID0gbnVsbFxuICAgIHRoaXMucmVjSG9va3MgPSBbXVxuICAgIHRoaXMuc2VudCA9IGZhbHNlXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVvdXRcbiAgICovXG4gIHJlc2VuZCh0aW1lb3V0KXtcbiAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgdGhpcy5yZXNldCgpXG4gICAgdGhpcy5zZW5kKClcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgc2VuZCgpe1xuICAgIGlmKHRoaXMuaGFzUmVjZWl2ZWQoXCJ0aW1lb3V0XCIpKXsgcmV0dXJuIH1cbiAgICB0aGlzLnN0YXJ0VGltZW91dCgpXG4gICAgdGhpcy5zZW50ID0gdHJ1ZVxuICAgIHRoaXMuY2hhbm5lbC5zb2NrZXQucHVzaCh7XG4gICAgICB0b3BpYzogdGhpcy5jaGFubmVsLnRvcGljLFxuICAgICAgZXZlbnQ6IHRoaXMuZXZlbnQsXG4gICAgICBwYXlsb2FkOiB0aGlzLnBheWxvYWQoKSxcbiAgICAgIHJlZjogdGhpcy5yZWYsXG4gICAgICBqb2luX3JlZjogdGhpcy5jaGFubmVsLmpvaW5SZWYoKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHsqfSBzdGF0dXNcbiAgICogQHBhcmFtIHsqfSBjYWxsYmFja1xuICAgKi9cbiAgcmVjZWl2ZShzdGF0dXMsIGNhbGxiYWNrKXtcbiAgICBpZih0aGlzLmhhc1JlY2VpdmVkKHN0YXR1cykpe1xuICAgICAgY2FsbGJhY2sodGhpcy5yZWNlaXZlZFJlc3AucmVzcG9uc2UpXG4gICAgfVxuXG4gICAgdGhpcy5yZWNIb29rcy5wdXNoKHtzdGF0dXMsIGNhbGxiYWNrfSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpe1xuICAgIHRoaXMuY2FuY2VsUmVmRXZlbnQoKVxuICAgIHRoaXMucmVmID0gbnVsbFxuICAgIHRoaXMucmVmRXZlbnQgPSBudWxsXG4gICAgdGhpcy5yZWNlaXZlZFJlc3AgPSBudWxsXG4gICAgdGhpcy5zZW50ID0gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbWF0Y2hSZWNlaXZlKHtzdGF0dXMsIHJlc3BvbnNlLCBfcmVmfSl7XG4gICAgdGhpcy5yZWNIb29rcy5maWx0ZXIoaCA9PiBoLnN0YXR1cyA9PT0gc3RhdHVzKVxuICAgICAgLmZvckVhY2goaCA9PiBoLmNhbGxiYWNrKHJlc3BvbnNlKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2FuY2VsUmVmRXZlbnQoKXtcbiAgICBpZighdGhpcy5yZWZFdmVudCl7IHJldHVybiB9XG4gICAgdGhpcy5jaGFubmVsLm9mZih0aGlzLnJlZkV2ZW50KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjYW5jZWxUaW1lb3V0KCl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dFRpbWVyKVxuICAgIHRoaXMudGltZW91dFRpbWVyID0gbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydFRpbWVvdXQoKXtcbiAgICBpZih0aGlzLnRpbWVvdXRUaW1lcil7IHRoaXMuY2FuY2VsVGltZW91dCgpIH1cbiAgICB0aGlzLnJlZiA9IHRoaXMuY2hhbm5lbC5zb2NrZXQubWFrZVJlZigpXG4gICAgdGhpcy5yZWZFdmVudCA9IHRoaXMuY2hhbm5lbC5yZXBseUV2ZW50TmFtZSh0aGlzLnJlZilcblxuICAgIHRoaXMuY2hhbm5lbC5vbih0aGlzLnJlZkV2ZW50LCBwYXlsb2FkID0+IHtcbiAgICAgIHRoaXMuY2FuY2VsUmVmRXZlbnQoKVxuICAgICAgdGhpcy5jYW5jZWxUaW1lb3V0KClcbiAgICAgIHRoaXMucmVjZWl2ZWRSZXNwID0gcGF5bG9hZFxuICAgICAgdGhpcy5tYXRjaFJlY2VpdmUocGF5bG9hZClcbiAgICB9KVxuXG4gICAgdGhpcy50aW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMudHJpZ2dlcihcInRpbWVvdXRcIiwge30pXG4gICAgfSwgdGhpcy50aW1lb3V0KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBoYXNSZWNlaXZlZChzdGF0dXMpe1xuICAgIHJldHVybiB0aGlzLnJlY2VpdmVkUmVzcCAmJiB0aGlzLnJlY2VpdmVkUmVzcC5zdGF0dXMgPT09IHN0YXR1c1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0cmlnZ2VyKHN0YXR1cywgcmVzcG9uc2Upe1xuICAgIHRoaXMuY2hhbm5lbC50cmlnZ2VyKHRoaXMucmVmRXZlbnQsIHtzdGF0dXMsIHJlc3BvbnNlfSlcbiAgfVxufVxuIiwgIi8qKlxuICpcbiAqIENyZWF0ZXMgYSB0aW1lciB0aGF0IGFjY2VwdHMgYSBgdGltZXJDYWxjYCBmdW5jdGlvbiB0byBwZXJmb3JtXG4gKiBjYWxjdWxhdGVkIHRpbWVvdXQgcmV0cmllcywgc3VjaCBhcyBleHBvbmVudGlhbCBiYWNrb2ZmLlxuICpcbiAqIEBleGFtcGxlXG4gKiBsZXQgcmVjb25uZWN0VGltZXIgPSBuZXcgVGltZXIoKCkgPT4gdGhpcy5jb25uZWN0KCksIGZ1bmN0aW9uKHRyaWVzKXtcbiAqICAgcmV0dXJuIFsxMDAwLCA1MDAwLCAxMDAwMF1bdHJpZXMgLSAxXSB8fCAxMDAwMFxuICogfSlcbiAqIHJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpIC8vIGZpcmVzIGFmdGVyIDEwMDBcbiAqIHJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpIC8vIGZpcmVzIGFmdGVyIDUwMDBcbiAqIHJlY29ubmVjdFRpbWVyLnJlc2V0KClcbiAqIHJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpIC8vIGZpcmVzIGFmdGVyIDEwMDBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtGdW5jdGlvbn0gdGltZXJDYWxjXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVyIHtcbiAgY29uc3RydWN0b3IoY2FsbGJhY2ssIHRpbWVyQ2FsYyl7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgdGhpcy50aW1lckNhbGMgPSB0aW1lckNhbGNcbiAgICB0aGlzLnRpbWVyID0gbnVsbFxuICAgIHRoaXMudHJpZXMgPSAwXG4gIH1cblxuICByZXNldCgpe1xuICAgIHRoaXMudHJpZXMgPSAwXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpXG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VscyBhbnkgcHJldmlvdXMgc2NoZWR1bGVUaW1lb3V0IGFuZCBzY2hlZHVsZXMgY2FsbGJhY2tcbiAgICovXG4gIHNjaGVkdWxlVGltZW91dCgpe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKVxuXG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy50cmllcyA9IHRoaXMudHJpZXMgKyAxXG4gICAgICB0aGlzLmNhbGxiYWNrKClcbiAgICB9LCB0aGlzLnRpbWVyQ2FsYyh0aGlzLnRyaWVzICsgMSkpXG4gIH1cbn1cbiIsICJpbXBvcnQge2Nsb3N1cmV9IGZyb20gXCIuL3V0aWxzXCJcbmltcG9ydCB7XG4gIENIQU5ORUxfRVZFTlRTLFxuICBDSEFOTkVMX1NUQVRFUyxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IFB1c2ggZnJvbSBcIi4vcHVzaFwiXG5pbXBvcnQgVGltZXIgZnJvbSBcIi4vdGltZXJcIlxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdG9waWNcbiAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbil9IHBhcmFtc1xuICogQHBhcmFtIHtTb2NrZXR9IHNvY2tldFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFubmVsIHtcbiAgY29uc3RydWN0b3IodG9waWMsIHBhcmFtcywgc29ja2V0KXtcbiAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkXG4gICAgdGhpcy50b3BpYyA9IHRvcGljXG4gICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKHBhcmFtcyB8fCB7fSlcbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldFxuICAgIHRoaXMuYmluZGluZ3MgPSBbXVxuICAgIHRoaXMuYmluZGluZ1JlZiA9IDBcbiAgICB0aGlzLnRpbWVvdXQgPSB0aGlzLnNvY2tldC50aW1lb3V0XG4gICAgdGhpcy5qb2luZWRPbmNlID0gZmFsc2VcbiAgICB0aGlzLmpvaW5QdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMuam9pbiwgdGhpcy5wYXJhbXMsIHRoaXMudGltZW91dClcbiAgICB0aGlzLnB1c2hCdWZmZXIgPSBbXVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VSZWZzID0gW11cblxuICAgIHRoaXMucmVqb2luVGltZXIgPSBuZXcgVGltZXIoKCkgPT4ge1xuICAgICAgaWYodGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMucmVqb2luKCkgfVxuICAgIH0sIHRoaXMuc29ja2V0LnJlam9pbkFmdGVyTXMpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZVJlZnMucHVzaCh0aGlzLnNvY2tldC5vbkVycm9yKCgpID0+IHRoaXMucmVqb2luVGltZXIucmVzZXQoKSkpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZVJlZnMucHVzaCh0aGlzLnNvY2tldC5vbk9wZW4oKCkgPT4ge1xuICAgICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpXG4gICAgICBpZih0aGlzLmlzRXJyb3JlZCgpKXsgdGhpcy5yZWpvaW4oKSB9XG4gICAgfSlcbiAgICApXG4gICAgdGhpcy5qb2luUHVzaC5yZWNlaXZlKFwib2tcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmpvaW5lZFxuICAgICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpXG4gICAgICB0aGlzLnB1c2hCdWZmZXIuZm9yRWFjaChwdXNoRXZlbnQgPT4gcHVzaEV2ZW50LnNlbmQoKSlcbiAgICAgIHRoaXMucHVzaEJ1ZmZlciA9IFtdXG4gICAgfSlcbiAgICB0aGlzLmpvaW5QdXNoLnJlY2VpdmUoXCJlcnJvclwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZFxuICAgICAgaWYodGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMucmVqb2luVGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgfVxuICAgIH0pXG4gICAgdGhpcy5vbkNsb3NlKCgpID0+IHtcbiAgICAgIHRoaXMucmVqb2luVGltZXIucmVzZXQoKVxuICAgICAgaWYodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgYGNsb3NlICR7dGhpcy50b3BpY30gJHt0aGlzLmpvaW5SZWYoKX1gKVxuICAgICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmNsb3NlZFxuICAgICAgdGhpcy5zb2NrZXQucmVtb3ZlKHRoaXMpXG4gICAgfSlcbiAgICB0aGlzLm9uRXJyb3IocmVhc29uID0+IHtcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGBlcnJvciAke3RoaXMudG9waWN9YCwgcmVhc29uKVxuICAgICAgaWYodGhpcy5pc0pvaW5pbmcoKSl7IHRoaXMuam9pblB1c2gucmVzZXQoKSB9XG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZFxuICAgICAgaWYodGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMucmVqb2luVGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgfVxuICAgIH0pXG4gICAgdGhpcy5qb2luUHVzaC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiB7XG4gICAgICBpZih0aGlzLnNvY2tldC5oYXNMb2dnZXIoKSkgdGhpcy5zb2NrZXQubG9nKFwiY2hhbm5lbFwiLCBgdGltZW91dCAke3RoaXMudG9waWN9ICgke3RoaXMuam9pblJlZigpfSlgLCB0aGlzLmpvaW5QdXNoLnRpbWVvdXQpXG4gICAgICBsZXQgbGVhdmVQdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMubGVhdmUsIGNsb3N1cmUoe30pLCB0aGlzLnRpbWVvdXQpXG4gICAgICBsZWF2ZVB1c2guc2VuZCgpXG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZFxuICAgICAgdGhpcy5qb2luUHVzaC5yZXNldCgpXG4gICAgICBpZih0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5yZWpvaW5UaW1lci5zY2hlZHVsZVRpbWVvdXQoKSB9XG4gICAgfSlcbiAgICB0aGlzLm9uKENIQU5ORUxfRVZFTlRTLnJlcGx5LCAocGF5bG9hZCwgcmVmKSA9PiB7XG4gICAgICB0aGlzLnRyaWdnZXIodGhpcy5yZXBseUV2ZW50TmFtZShyZWYpLCBwYXlsb2FkKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogSm9pbiB0aGUgY2hhbm5lbFxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHRpbWVvdXRcbiAgICogQHJldHVybnMge1B1c2h9XG4gICAqL1xuICBqb2luKHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpe1xuICAgIGlmKHRoaXMuam9pbmVkT25jZSl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cmllZCB0byBqb2luIG11bHRpcGxlIHRpbWVzLiAnam9pbicgY2FuIG9ubHkgYmUgY2FsbGVkIGEgc2luZ2xlIHRpbWUgcGVyIGNoYW5uZWwgaW5zdGFuY2VcIilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50aW1lb3V0ID0gdGltZW91dFxuICAgICAgdGhpcy5qb2luZWRPbmNlID0gdHJ1ZVxuICAgICAgdGhpcy5yZWpvaW4oKVxuICAgICAgcmV0dXJuIHRoaXMuam9pblB1c2hcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSG9vayBpbnRvIGNoYW5uZWwgY2xvc2VcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uQ2xvc2UoY2FsbGJhY2spe1xuICAgIHRoaXMub24oQ0hBTk5FTF9FVkVOVFMuY2xvc2UsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIEhvb2sgaW50byBjaGFubmVsIGVycm9yc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25FcnJvcihjYWxsYmFjayl7XG4gICAgcmV0dXJuIHRoaXMub24oQ0hBTk5FTF9FVkVOVFMuZXJyb3IsIHJlYXNvbiA9PiBjYWxsYmFjayhyZWFzb24pKVxuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgb24gY2hhbm5lbCBldmVudHNcbiAgICpcbiAgICogU3Vic2NyaXB0aW9uIHJldHVybnMgYSByZWYgY291bnRlciwgd2hpY2ggY2FuIGJlIHVzZWQgbGF0ZXIgdG9cbiAgICogdW5zdWJzY3JpYmUgdGhlIGV4YWN0IGV2ZW50IGxpc3RlbmVyXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNvbnN0IHJlZjEgPSBjaGFubmVsLm9uKFwiZXZlbnRcIiwgZG9fc3R1ZmYpXG4gICAqIGNvbnN0IHJlZjIgPSBjaGFubmVsLm9uKFwiZXZlbnRcIiwgZG9fb3RoZXJfc3R1ZmYpXG4gICAqIGNoYW5uZWwub2ZmKFwiZXZlbnRcIiwgcmVmMSlcbiAgICogLy8gU2luY2UgdW5zdWJzY3JpcHRpb24sIGRvX3N0dWZmIHdvbid0IGZpcmUsXG4gICAqIC8vIHdoaWxlIGRvX290aGVyX3N0dWZmIHdpbGwga2VlcCBmaXJpbmcgb24gdGhlIFwiZXZlbnRcIlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICogQHJldHVybnMge2ludGVnZXJ9IHJlZlxuICAgKi9cbiAgb24oZXZlbnQsIGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5iaW5kaW5nUmVmKytcbiAgICB0aGlzLmJpbmRpbmdzLnB1c2goe2V2ZW50LCByZWYsIGNhbGxiYWNrfSlcbiAgICByZXR1cm4gcmVmXG4gIH1cblxuICAvKipcbiAgICogVW5zdWJzY3JpYmVzIG9mZiBvZiBjaGFubmVsIGV2ZW50c1xuICAgKlxuICAgKiBVc2UgdGhlIHJlZiByZXR1cm5lZCBmcm9tIGEgY2hhbm5lbC5vbigpIHRvIHVuc3Vic2NyaWJlIG9uZVxuICAgKiBoYW5kbGVyLCBvciBwYXNzIG5vdGhpbmcgZm9yIHRoZSByZWYgdG8gdW5zdWJzY3JpYmUgYWxsXG4gICAqIGhhbmRsZXJzIGZvciB0aGUgZ2l2ZW4gZXZlbnQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIFVuc3Vic2NyaWJlIHRoZSBkb19zdHVmZiBoYW5kbGVyXG4gICAqIGNvbnN0IHJlZjEgPSBjaGFubmVsLm9uKFwiZXZlbnRcIiwgZG9fc3R1ZmYpXG4gICAqIGNoYW5uZWwub2ZmKFwiZXZlbnRcIiwgcmVmMSlcbiAgICpcbiAgICogLy8gVW5zdWJzY3JpYmUgYWxsIGhhbmRsZXJzIGZyb20gZXZlbnRcbiAgICogY2hhbm5lbC5vZmYoXCJldmVudFwiKVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSByZWZcbiAgICovXG4gIG9mZihldmVudCwgcmVmKXtcbiAgICB0aGlzLmJpbmRpbmdzID0gdGhpcy5iaW5kaW5ncy5maWx0ZXIoKGJpbmQpID0+IHtcbiAgICAgIHJldHVybiAhKGJpbmQuZXZlbnQgPT09IGV2ZW50ICYmICh0eXBlb2YgcmVmID09PSBcInVuZGVmaW5lZFwiIHx8IHJlZiA9PT0gYmluZC5yZWYpKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNhblB1c2goKXsgcmV0dXJuIHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkgJiYgdGhpcy5pc0pvaW5lZCgpIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIGBldmVudGAgdG8gcGhvZW5peCB3aXRoIHRoZSBwYXlsb2FkIGBwYXlsb2FkYC5cbiAgICogUGhvZW5peCByZWNlaXZlcyB0aGlzIGluIHRoZSBgaGFuZGxlX2luKGV2ZW50LCBwYXlsb2FkLCBzb2NrZXQpYFxuICAgKiBmdW5jdGlvbi4gaWYgcGhvZW5peCByZXBsaWVzIG9yIGl0IHRpbWVzIG91dCAoZGVmYXVsdCAxMDAwMG1zKSxcbiAgICogdGhlbiBvcHRpb25hbGx5IHRoZSByZXBseSBjYW4gYmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNoYW5uZWwucHVzaChcImV2ZW50XCIpXG4gICAqICAgLnJlY2VpdmUoXCJva1wiLCBwYXlsb2FkID0+IGNvbnNvbGUubG9nKFwicGhvZW5peCByZXBsaWVkOlwiLCBwYXlsb2FkKSlcbiAgICogICAucmVjZWl2ZShcImVycm9yXCIsIGVyciA9PiBjb25zb2xlLmxvZyhcInBob2VuaXggZXJyb3JlZFwiLCBlcnIpKVxuICAgKiAgIC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiBjb25zb2xlLmxvZyhcInRpbWVkIG91dCBwdXNoaW5nXCIpKVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lb3V0XVxuICAgKiBAcmV0dXJucyB7UHVzaH1cbiAgICovXG4gIHB1c2goZXZlbnQsIHBheWxvYWQsIHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpe1xuICAgIHBheWxvYWQgPSBwYXlsb2FkIHx8IHt9XG4gICAgaWYoIXRoaXMuam9pbmVkT25jZSl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHRyaWVkIHRvIHB1c2ggJyR7ZXZlbnR9JyB0byAnJHt0aGlzLnRvcGljfScgYmVmb3JlIGpvaW5pbmcuIFVzZSBjaGFubmVsLmpvaW4oKSBiZWZvcmUgcHVzaGluZyBldmVudHNgKVxuICAgIH1cbiAgICBsZXQgcHVzaEV2ZW50ID0gbmV3IFB1c2godGhpcywgZXZlbnQsIGZ1bmN0aW9uICgpeyByZXR1cm4gcGF5bG9hZCB9LCB0aW1lb3V0KVxuICAgIGlmKHRoaXMuY2FuUHVzaCgpKXtcbiAgICAgIHB1c2hFdmVudC5zZW5kKClcbiAgICB9IGVsc2Uge1xuICAgICAgcHVzaEV2ZW50LnN0YXJ0VGltZW91dCgpXG4gICAgICB0aGlzLnB1c2hCdWZmZXIucHVzaChwdXNoRXZlbnQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHB1c2hFdmVudFxuICB9XG5cbiAgLyoqIExlYXZlcyB0aGUgY2hhbm5lbFxuICAgKlxuICAgKiBVbnN1YnNjcmliZXMgZnJvbSBzZXJ2ZXIgZXZlbnRzLCBhbmRcbiAgICogaW5zdHJ1Y3RzIGNoYW5uZWwgdG8gdGVybWluYXRlIG9uIHNlcnZlclxuICAgKlxuICAgKiBUcmlnZ2VycyBvbkNsb3NlKCkgaG9va3NcbiAgICpcbiAgICogVG8gcmVjZWl2ZSBsZWF2ZSBhY2tub3dsZWRnZW1lbnRzLCB1c2UgdGhlIGByZWNlaXZlYFxuICAgKiBob29rIHRvIGJpbmQgdG8gdGhlIHNlcnZlciBhY2ssIGllOlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjaGFubmVsLmxlYXZlKCkucmVjZWl2ZShcIm9rXCIsICgpID0+IGFsZXJ0KFwibGVmdCFcIikgKVxuICAgKlxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHRpbWVvdXRcbiAgICogQHJldHVybnMge1B1c2h9XG4gICAqL1xuICBsZWF2ZSh0aW1lb3V0ID0gdGhpcy50aW1lb3V0KXtcbiAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KClcbiAgICB0aGlzLmpvaW5QdXNoLmNhbmNlbFRpbWVvdXQoKVxuXG4gICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmxlYXZpbmdcbiAgICBsZXQgb25DbG9zZSA9ICgpID0+IHtcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGBsZWF2ZSAke3RoaXMudG9waWN9YClcbiAgICAgIHRoaXMudHJpZ2dlcihDSEFOTkVMX0VWRU5UUy5jbG9zZSwgXCJsZWF2ZVwiKVxuICAgIH1cbiAgICBsZXQgbGVhdmVQdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMubGVhdmUsIGNsb3N1cmUoe30pLCB0aW1lb3V0KVxuICAgIGxlYXZlUHVzaC5yZWNlaXZlKFwib2tcIiwgKCkgPT4gb25DbG9zZSgpKVxuICAgICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsICgpID0+IG9uQ2xvc2UoKSlcbiAgICBsZWF2ZVB1c2guc2VuZCgpXG4gICAgaWYoIXRoaXMuY2FuUHVzaCgpKXsgbGVhdmVQdXNoLnRyaWdnZXIoXCJva1wiLCB7fSkgfVxuXG4gICAgcmV0dXJuIGxlYXZlUHVzaFxuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRhYmxlIG1lc3NhZ2UgaG9va1xuICAgKlxuICAgKiBSZWNlaXZlcyBhbGwgZXZlbnRzIGZvciBzcGVjaWFsaXplZCBtZXNzYWdlIGhhbmRsaW5nXG4gICAqIGJlZm9yZSBkaXNwYXRjaGluZyB0byB0aGUgY2hhbm5lbCBjYWxsYmFja3MuXG4gICAqXG4gICAqIE11c3QgcmV0dXJuIHRoZSBwYXlsb2FkLCBtb2RpZmllZCBvciB1bm1vZGlmaWVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZFxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHJlZlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgKi9cbiAgb25NZXNzYWdlKF9ldmVudCwgcGF5bG9hZCwgX3JlZil7IHJldHVybiBwYXlsb2FkIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzTWVtYmVyKHRvcGljLCBldmVudCwgcGF5bG9hZCwgam9pblJlZil7XG4gICAgaWYodGhpcy50b3BpYyAhPT0gdG9waWMpeyByZXR1cm4gZmFsc2UgfVxuXG4gICAgaWYoam9pblJlZiAmJiBqb2luUmVmICE9PSB0aGlzLmpvaW5SZWYoKSl7XG4gICAgICBpZih0aGlzLnNvY2tldC5oYXNMb2dnZXIoKSkgdGhpcy5zb2NrZXQubG9nKFwiY2hhbm5lbFwiLCBcImRyb3BwaW5nIG91dGRhdGVkIG1lc3NhZ2VcIiwge3RvcGljLCBldmVudCwgcGF5bG9hZCwgam9pblJlZn0pXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGpvaW5SZWYoKXsgcmV0dXJuIHRoaXMuam9pblB1c2gucmVmIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlam9pbih0aW1lb3V0ID0gdGhpcy50aW1lb3V0KXtcbiAgICBpZih0aGlzLmlzTGVhdmluZygpKXsgcmV0dXJuIH1cbiAgICB0aGlzLnNvY2tldC5sZWF2ZU9wZW5Ub3BpYyh0aGlzLnRvcGljKVxuICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5qb2luaW5nXG4gICAgdGhpcy5qb2luUHVzaC5yZXNlbmQodGltZW91dClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdHJpZ2dlcihldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luUmVmKXtcbiAgICBsZXQgaGFuZGxlZFBheWxvYWQgPSB0aGlzLm9uTWVzc2FnZShldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luUmVmKVxuICAgIGlmKHBheWxvYWQgJiYgIWhhbmRsZWRQYXlsb2FkKXsgdGhyb3cgbmV3IEVycm9yKFwiY2hhbm5lbCBvbk1lc3NhZ2UgY2FsbGJhY2tzIG11c3QgcmV0dXJuIHRoZSBwYXlsb2FkLCBtb2RpZmllZCBvciB1bm1vZGlmaWVkXCIpIH1cblxuICAgIGxldCBldmVudEJpbmRpbmdzID0gdGhpcy5iaW5kaW5ncy5maWx0ZXIoYmluZCA9PiBiaW5kLmV2ZW50ID09PSBldmVudClcblxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBldmVudEJpbmRpbmdzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGxldCBiaW5kID0gZXZlbnRCaW5kaW5nc1tpXVxuICAgICAgYmluZC5jYWxsYmFjayhoYW5kbGVkUGF5bG9hZCwgcmVmLCBqb2luUmVmIHx8IHRoaXMuam9pblJlZigpKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVwbHlFdmVudE5hbWUocmVmKXsgcmV0dXJuIGBjaGFuX3JlcGx5XyR7cmVmfWAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNDbG9zZWQoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmNsb3NlZCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0Vycm9yZWQoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmVycm9yZWQgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNKb2luZWQoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmpvaW5lZCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0pvaW5pbmcoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmpvaW5pbmcgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNMZWF2aW5nKCl7IHJldHVybiB0aGlzLnN0YXRlID09PSBDSEFOTkVMX1NUQVRFUy5sZWF2aW5nIH1cbn1cbiIsICJpbXBvcnQge1xuICBnbG9iYWwsXG4gIFhIUl9TVEFURVNcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWpheCB7XG5cbiAgc3RhdGljIHJlcXVlc3QobWV0aG9kLCBlbmRQb2ludCwgYWNjZXB0LCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKXtcbiAgICBpZihnbG9iYWwuWERvbWFpblJlcXVlc3Qpe1xuICAgICAgbGV0IHJlcSA9IG5ldyBnbG9iYWwuWERvbWFpblJlcXVlc3QoKSAvLyBJRTgsIElFOVxuICAgICAgdGhpcy54ZG9tYWluUmVxdWVzdChyZXEsIG1ldGhvZCwgZW5kUG9pbnQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCByZXEgPSBuZXcgZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KCkgLy8gSUU3KywgRmlyZWZveCwgQ2hyb21lLCBPcGVyYSwgU2FmYXJpXG4gICAgICB0aGlzLnhoclJlcXVlc3QocmVxLCBtZXRob2QsIGVuZFBvaW50LCBhY2NlcHQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHhkb21haW5SZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjayl7XG4gICAgcmVxLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgcmVxLm9wZW4obWV0aG9kLCBlbmRQb2ludClcbiAgICByZXEub25sb2FkID0gKCkgPT4ge1xuICAgICAgbGV0IHJlc3BvbnNlID0gdGhpcy5wYXJzZUpTT04ocmVxLnJlc3BvbnNlVGV4dClcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHJlc3BvbnNlKVxuICAgIH1cbiAgICBpZihvbnRpbWVvdXQpeyByZXEub250aW1lb3V0ID0gb250aW1lb3V0IH1cblxuICAgIC8vIFdvcmsgYXJvdW5kIGJ1ZyBpbiBJRTkgdGhhdCByZXF1aXJlcyBhbiBhdHRhY2hlZCBvbnByb2dyZXNzIGhhbmRsZXJcbiAgICByZXEub25wcm9ncmVzcyA9ICgpID0+IHsgfVxuXG4gICAgcmVxLnNlbmQoYm9keSlcbiAgfVxuXG4gIHN0YXRpYyB4aHJSZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYWNjZXB0LCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKXtcbiAgICByZXEub3BlbihtZXRob2QsIGVuZFBvaW50LCB0cnVlKVxuICAgIHJlcS50aW1lb3V0ID0gdGltZW91dFxuICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIGFjY2VwdClcbiAgICByZXEub25lcnJvciA9ICgpID0+IHsgY2FsbGJhY2sgJiYgY2FsbGJhY2sobnVsbCkgfVxuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZihyZXEucmVhZHlTdGF0ZSA9PT0gWEhSX1NUQVRFUy5jb21wbGV0ZSAmJiBjYWxsYmFjayl7XG4gICAgICAgIGxldCByZXNwb25zZSA9IHRoaXMucGFyc2VKU09OKHJlcS5yZXNwb25zZVRleHQpXG4gICAgICAgIGNhbGxiYWNrKHJlc3BvbnNlKVxuICAgICAgfVxuICAgIH1cbiAgICBpZihvbnRpbWVvdXQpeyByZXEub250aW1lb3V0ID0gb250aW1lb3V0IH1cblxuICAgIHJlcS5zZW5kKGJvZHkpXG4gIH1cblxuICBzdGF0aWMgcGFyc2VKU09OKHJlc3Ape1xuICAgIGlmKCFyZXNwIHx8IHJlc3AgPT09IFwiXCIpeyByZXR1cm4gbnVsbCB9XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmVzcClcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgIGNvbnNvbGUgJiYgY29uc29sZS5sb2coXCJmYWlsZWQgdG8gcGFyc2UgSlNPTiByZXNwb25zZVwiLCByZXNwKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgc2VyaWFsaXplKG9iaiwgcGFyZW50S2V5KXtcbiAgICBsZXQgcXVlcnlTdHIgPSBbXVxuICAgIGZvcih2YXIga2V5IGluIG9iail7XG4gICAgICBpZighT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSl7IGNvbnRpbnVlIH1cbiAgICAgIGxldCBwYXJhbUtleSA9IHBhcmVudEtleSA/IGAke3BhcmVudEtleX1bJHtrZXl9XWAgOiBrZXlcbiAgICAgIGxldCBwYXJhbVZhbCA9IG9ialtrZXldXG4gICAgICBpZih0eXBlb2YgcGFyYW1WYWwgPT09IFwib2JqZWN0XCIpe1xuICAgICAgICBxdWVyeVN0ci5wdXNoKHRoaXMuc2VyaWFsaXplKHBhcmFtVmFsLCBwYXJhbUtleSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBxdWVyeVN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChwYXJhbUtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbVZhbCkpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBxdWVyeVN0ci5qb2luKFwiJlwiKVxuICB9XG5cbiAgc3RhdGljIGFwcGVuZFBhcmFtcyh1cmwsIHBhcmFtcyl7XG4gICAgaWYoT2JqZWN0LmtleXMocGFyYW1zKS5sZW5ndGggPT09IDApeyByZXR1cm4gdXJsIH1cblxuICAgIGxldCBwcmVmaXggPSB1cmwubWF0Y2goL1xcPy8pID8gXCImXCIgOiBcIj9cIlxuICAgIHJldHVybiBgJHt1cmx9JHtwcmVmaXh9JHt0aGlzLnNlcmlhbGl6ZShwYXJhbXMpfWBcbiAgfVxufVxuIiwgImltcG9ydCB7XG4gIFNPQ0tFVF9TVEFURVMsXG4gIFRSQU5TUE9SVFNcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IEFqYXggZnJvbSBcIi4vYWpheFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvbmdQb2xsIHtcblxuICBjb25zdHJ1Y3RvcihlbmRQb2ludCl7XG4gICAgdGhpcy5lbmRQb2ludCA9IG51bGxcbiAgICB0aGlzLnRva2VuID0gbnVsbFxuICAgIHRoaXMuc2tpcEhlYXJ0YmVhdCA9IHRydWVcbiAgICB0aGlzLm9ub3BlbiA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICB0aGlzLm9uZXJyb3IgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgdGhpcy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgdGhpcy5vbmNsb3NlID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgIHRoaXMucG9sbEVuZHBvaW50ID0gdGhpcy5ub3JtYWxpemVFbmRwb2ludChlbmRQb2ludClcbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLmNvbm5lY3RpbmdcblxuICAgIHRoaXMucG9sbCgpXG4gIH1cblxuICBub3JtYWxpemVFbmRwb2ludChlbmRQb2ludCl7XG4gICAgcmV0dXJuIChlbmRQb2ludFxuICAgICAgLnJlcGxhY2UoXCJ3czovL1wiLCBcImh0dHA6Ly9cIilcbiAgICAgIC5yZXBsYWNlKFwid3NzOi8vXCIsIFwiaHR0cHM6Ly9cIilcbiAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoLiopXFwvXCIgKyBUUkFOU1BPUlRTLndlYnNvY2tldCksIFwiJDEvXCIgKyBUUkFOU1BPUlRTLmxvbmdwb2xsKSlcbiAgfVxuXG4gIGVuZHBvaW50VVJMKCl7XG4gICAgcmV0dXJuIEFqYXguYXBwZW5kUGFyYW1zKHRoaXMucG9sbEVuZHBvaW50LCB7dG9rZW46IHRoaXMudG9rZW59KVxuICB9XG5cbiAgY2xvc2VBbmRSZXRyeSgpe1xuICAgIHRoaXMuY2xvc2UoKVxuICAgIHRoaXMucmVhZHlTdGF0ZSA9IFNPQ0tFVF9TVEFURVMuY29ubmVjdGluZ1xuICB9XG5cbiAgb250aW1lb3V0KCl7XG4gICAgdGhpcy5vbmVycm9yKFwidGltZW91dFwiKVxuICAgIHRoaXMuY2xvc2VBbmRSZXRyeSgpXG4gIH1cblxuICBwb2xsKCl7XG4gICAgaWYoISh0aGlzLnJlYWR5U3RhdGUgPT09IFNPQ0tFVF9TVEFURVMub3BlbiB8fCB0aGlzLnJlYWR5U3RhdGUgPT09IFNPQ0tFVF9TVEFURVMuY29ubmVjdGluZykpeyByZXR1cm4gfVxuXG4gICAgQWpheC5yZXF1ZXN0KFwiR0VUXCIsIHRoaXMuZW5kcG9pbnRVUkwoKSwgXCJhcHBsaWNhdGlvbi9qc29uXCIsIG51bGwsIHRoaXMudGltZW91dCwgdGhpcy5vbnRpbWVvdXQuYmluZCh0aGlzKSwgKHJlc3ApID0+IHtcbiAgICAgIGlmKHJlc3Ape1xuICAgICAgICB2YXIge3N0YXR1cywgdG9rZW4sIG1lc3NhZ2VzfSA9IHJlc3BcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0dXMgPSAwXG4gICAgICB9XG5cbiAgICAgIHN3aXRjaChzdGF0dXMpe1xuICAgICAgICBjYXNlIDIwMDpcbiAgICAgICAgICBtZXNzYWdlcy5mb3JFYWNoKG1zZyA9PiB7XG4gICAgICAgICAgICAvLyBUYXNrcyBhcmUgd2hhdCB0aGluZ3MgbGlrZSBldmVudCBoYW5kbGVycywgc2V0VGltZW91dCBjYWxsYmFja3MsXG4gICAgICAgICAgICAvLyBwcm9taXNlIHJlc29sdmVzIGFuZCBtb3JlIGFyZSBydW4gd2l0aGluLlxuICAgICAgICAgICAgLy8gSW4gbW9kZXJuIGJyb3dzZXJzLCB0aGVyZSBhcmUgdHdvIGRpZmZlcmVudCBraW5kcyBvZiB0YXNrcyxcbiAgICAgICAgICAgIC8vIG1pY3JvdGFza3MgYW5kIG1hY3JvdGFza3MuXG4gICAgICAgICAgICAvLyBNaWNyb3Rhc2tzIGFyZSBtYWlubHkgdXNlZCBmb3IgUHJvbWlzZXMsIHdoaWxlIG1hY3JvdGFza3MgYXJlXG4gICAgICAgICAgICAvLyB1c2VkIGZvciBldmVyeXRoaW5nIGVsc2UuXG4gICAgICAgICAgICAvLyBNaWNyb3Rhc2tzIGFsd2F5cyBoYXZlIHByaW9yaXR5IG92ZXIgbWFjcm90YXNrcy4gSWYgdGhlIEpTIGVuZ2luZVxuICAgICAgICAgICAgLy8gaXMgbG9va2luZyBmb3IgYSB0YXNrIHRvIHJ1biwgaXQgd2lsbCBhbHdheXMgdHJ5IHRvIGVtcHR5IHRoZVxuICAgICAgICAgICAgLy8gbWljcm90YXNrIHF1ZXVlIGJlZm9yZSBhdHRlbXB0aW5nIHRvIHJ1biBhbnl0aGluZyBmcm9tIHRoZVxuICAgICAgICAgICAgLy8gbWFjcm90YXNrIHF1ZXVlLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIEZvciB0aGUgV2ViU29ja2V0IHRyYW5zcG9ydCwgbWVzc2FnZXMgYWx3YXlzIGFycml2ZSBpbiB0aGVpciBvd25cbiAgICAgICAgICAgIC8vIGV2ZW50LiBUaGlzIG1lYW5zIHRoYXQgaWYgYW55IHByb21pc2VzIGFyZSByZXNvbHZlZCBmcm9tIHdpdGhpbixcbiAgICAgICAgICAgIC8vIHRoZWlyIGNhbGxiYWNrcyB3aWxsIGFsd2F5cyBmaW5pc2ggZXhlY3V0aW9uIGJ5IHRoZSB0aW1lIHRoZVxuICAgICAgICAgICAgLy8gbmV4dCBtZXNzYWdlIGV2ZW50IGhhbmRsZXIgaXMgcnVuLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIEluIG9yZGVyIHRvIGVtdWxhdGUgdGhpcyBiZWhhdmlvdXIsIHdlIG5lZWQgdG8gbWFrZSBzdXJlIGVhY2hcbiAgICAgICAgICAgIC8vIG9ubWVzc2FnZSBoYW5kbGVyIGlzIHJ1biB3aXRoaW4gaXQncyBvd24gbWFjcm90YXNrLlxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMub25tZXNzYWdlKHtkYXRhOiBtc2d9KVxuICAgICAgICAgICAgfSwgMClcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMucG9sbCgpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyMDQ6XG4gICAgICAgICAgdGhpcy5wb2xsKClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQxMDpcbiAgICAgICAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLm9wZW5cbiAgICAgICAgICB0aGlzLm9ub3BlbigpXG4gICAgICAgICAgdGhpcy5wb2xsKClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQwMzpcbiAgICAgICAgICB0aGlzLm9uZXJyb3IoKVxuICAgICAgICAgIHRoaXMuY2xvc2UoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgY2FzZSA1MDA6XG4gICAgICAgICAgdGhpcy5vbmVycm9yKClcbiAgICAgICAgICB0aGlzLmNsb3NlQW5kUmV0cnkoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihgdW5oYW5kbGVkIHBvbGwgc3RhdHVzICR7c3RhdHVzfWApXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHNlbmQoYm9keSl7XG4gICAgQWpheC5yZXF1ZXN0KFwiUE9TVFwiLCB0aGlzLmVuZHBvaW50VVJMKCksIFwiYXBwbGljYXRpb24vanNvblwiLCBib2R5LCB0aGlzLnRpbWVvdXQsIHRoaXMub25lcnJvci5iaW5kKHRoaXMsIFwidGltZW91dFwiKSwgKHJlc3ApID0+IHtcbiAgICAgIGlmKCFyZXNwIHx8IHJlc3Auc3RhdHVzICE9PSAyMDApe1xuICAgICAgICB0aGlzLm9uZXJyb3IocmVzcCAmJiByZXNwLnN0YXR1cylcbiAgICAgICAgdGhpcy5jbG9zZUFuZFJldHJ5KClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgY2xvc2UoX2NvZGUsIF9yZWFzb24pe1xuICAgIHRoaXMucmVhZHlTdGF0ZSA9IFNPQ0tFVF9TVEFURVMuY2xvc2VkXG4gICAgdGhpcy5vbmNsb3NlKClcbiAgfVxufVxuIiwgIi8qKlxuICogSW5pdGlhbGl6ZXMgdGhlIFByZXNlbmNlXG4gKiBAcGFyYW0ge0NoYW5uZWx9IGNoYW5uZWwgLSBUaGUgQ2hhbm5lbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgLSBUaGUgb3B0aW9ucyxcbiAqICAgICAgICBmb3IgZXhhbXBsZSBge2V2ZW50czoge3N0YXRlOiBcInN0YXRlXCIsIGRpZmY6IFwiZGlmZlwifX1gXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZXNlbmNlIHtcblxuICBjb25zdHJ1Y3RvcihjaGFubmVsLCBvcHRzID0ge30pe1xuICAgIGxldCBldmVudHMgPSBvcHRzLmV2ZW50cyB8fCB7c3RhdGU6IFwicHJlc2VuY2Vfc3RhdGVcIiwgZGlmZjogXCJwcmVzZW5jZV9kaWZmXCJ9XG4gICAgdGhpcy5zdGF0ZSA9IHt9XG4gICAgdGhpcy5wZW5kaW5nRGlmZnMgPSBbXVxuICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWxcbiAgICB0aGlzLmpvaW5SZWYgPSBudWxsXG4gICAgdGhpcy5jYWxsZXIgPSB7XG4gICAgICBvbkpvaW46IGZ1bmN0aW9uICgpeyB9LFxuICAgICAgb25MZWF2ZTogZnVuY3Rpb24gKCl7IH0sXG4gICAgICBvblN5bmM6IGZ1bmN0aW9uICgpeyB9XG4gICAgfVxuXG4gICAgdGhpcy5jaGFubmVsLm9uKGV2ZW50cy5zdGF0ZSwgbmV3U3RhdGUgPT4ge1xuICAgICAgbGV0IHtvbkpvaW4sIG9uTGVhdmUsIG9uU3luY30gPSB0aGlzLmNhbGxlclxuXG4gICAgICB0aGlzLmpvaW5SZWYgPSB0aGlzLmNoYW5uZWwuam9pblJlZigpXG4gICAgICB0aGlzLnN0YXRlID0gUHJlc2VuY2Uuc3luY1N0YXRlKHRoaXMuc3RhdGUsIG5ld1N0YXRlLCBvbkpvaW4sIG9uTGVhdmUpXG5cbiAgICAgIHRoaXMucGVuZGluZ0RpZmZzLmZvckVhY2goZGlmZiA9PiB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBQcmVzZW5jZS5zeW5jRGlmZih0aGlzLnN0YXRlLCBkaWZmLCBvbkpvaW4sIG9uTGVhdmUpXG4gICAgICB9KVxuICAgICAgdGhpcy5wZW5kaW5nRGlmZnMgPSBbXVxuICAgICAgb25TeW5jKClcbiAgICB9KVxuXG4gICAgdGhpcy5jaGFubmVsLm9uKGV2ZW50cy5kaWZmLCBkaWZmID0+IHtcbiAgICAgIGxldCB7b25Kb2luLCBvbkxlYXZlLCBvblN5bmN9ID0gdGhpcy5jYWxsZXJcblxuICAgICAgaWYodGhpcy5pblBlbmRpbmdTeW5jU3RhdGUoKSl7XG4gICAgICAgIHRoaXMucGVuZGluZ0RpZmZzLnB1c2goZGlmZilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBQcmVzZW5jZS5zeW5jRGlmZih0aGlzLnN0YXRlLCBkaWZmLCBvbkpvaW4sIG9uTGVhdmUpXG4gICAgICAgIG9uU3luYygpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIG9uSm9pbihjYWxsYmFjayl7IHRoaXMuY2FsbGVyLm9uSm9pbiA9IGNhbGxiYWNrIH1cblxuICBvbkxlYXZlKGNhbGxiYWNrKXsgdGhpcy5jYWxsZXIub25MZWF2ZSA9IGNhbGxiYWNrIH1cblxuICBvblN5bmMoY2FsbGJhY2speyB0aGlzLmNhbGxlci5vblN5bmMgPSBjYWxsYmFjayB9XG5cbiAgbGlzdChieSl7IHJldHVybiBQcmVzZW5jZS5saXN0KHRoaXMuc3RhdGUsIGJ5KSB9XG5cbiAgaW5QZW5kaW5nU3luY1N0YXRlKCl7XG4gICAgcmV0dXJuICF0aGlzLmpvaW5SZWYgfHwgKHRoaXMuam9pblJlZiAhPT0gdGhpcy5jaGFubmVsLmpvaW5SZWYoKSlcbiAgfVxuXG4gIC8vIGxvd2VyLWxldmVsIHB1YmxpYyBzdGF0aWMgQVBJXG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gc3luYyB0aGUgbGlzdCBvZiBwcmVzZW5jZXMgb24gdGhlIHNlcnZlclxuICAgKiB3aXRoIHRoZSBjbGllbnQncyBzdGF0ZS4gQW4gb3B0aW9uYWwgYG9uSm9pbmAgYW5kIGBvbkxlYXZlYCBjYWxsYmFjayBjYW5cbiAgICogYmUgcHJvdmlkZWQgdG8gcmVhY3QgdG8gY2hhbmdlcyBpbiB0aGUgY2xpZW50J3MgbG9jYWwgcHJlc2VuY2VzIGFjcm9zc1xuICAgKiBkaXNjb25uZWN0cyBhbmQgcmVjb25uZWN0cyB3aXRoIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcmVzZW5jZX1cbiAgICovXG4gIHN0YXRpYyBzeW5jU3RhdGUoY3VycmVudFN0YXRlLCBuZXdTdGF0ZSwgb25Kb2luLCBvbkxlYXZlKXtcbiAgICBsZXQgc3RhdGUgPSB0aGlzLmNsb25lKGN1cnJlbnRTdGF0ZSlcbiAgICBsZXQgam9pbnMgPSB7fVxuICAgIGxldCBsZWF2ZXMgPSB7fVxuXG4gICAgdGhpcy5tYXAoc3RhdGUsIChrZXksIHByZXNlbmNlKSA9PiB7XG4gICAgICBpZighbmV3U3RhdGVba2V5XSl7XG4gICAgICAgIGxlYXZlc1trZXldID0gcHJlc2VuY2VcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMubWFwKG5ld1N0YXRlLCAoa2V5LCBuZXdQcmVzZW5jZSkgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRQcmVzZW5jZSA9IHN0YXRlW2tleV1cbiAgICAgIGlmKGN1cnJlbnRQcmVzZW5jZSl7XG4gICAgICAgIGxldCBuZXdSZWZzID0gbmV3UHJlc2VuY2UubWV0YXMubWFwKG0gPT4gbS5waHhfcmVmKVxuICAgICAgICBsZXQgY3VyUmVmcyA9IGN1cnJlbnRQcmVzZW5jZS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICAgIGxldCBqb2luZWRNZXRhcyA9IG5ld1ByZXNlbmNlLm1ldGFzLmZpbHRlcihtID0+IGN1clJlZnMuaW5kZXhPZihtLnBoeF9yZWYpIDwgMClcbiAgICAgICAgbGV0IGxlZnRNZXRhcyA9IGN1cnJlbnRQcmVzZW5jZS5tZXRhcy5maWx0ZXIobSA9PiBuZXdSZWZzLmluZGV4T2YobS5waHhfcmVmKSA8IDApXG4gICAgICAgIGlmKGpvaW5lZE1ldGFzLmxlbmd0aCA+IDApe1xuICAgICAgICAgIGpvaW5zW2tleV0gPSBuZXdQcmVzZW5jZVxuICAgICAgICAgIGpvaW5zW2tleV0ubWV0YXMgPSBqb2luZWRNZXRhc1xuICAgICAgICB9XG4gICAgICAgIGlmKGxlZnRNZXRhcy5sZW5ndGggPiAwKXtcbiAgICAgICAgICBsZWF2ZXNba2V5XSA9IHRoaXMuY2xvbmUoY3VycmVudFByZXNlbmNlKVxuICAgICAgICAgIGxlYXZlc1trZXldLm1ldGFzID0gbGVmdE1ldGFzXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGpvaW5zW2tleV0gPSBuZXdQcmVzZW5jZVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXMuc3luY0RpZmYoc3RhdGUsIHtqb2luczogam9pbnMsIGxlYXZlczogbGVhdmVzfSwgb25Kb2luLCBvbkxlYXZlKVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIFVzZWQgdG8gc3luYyBhIGRpZmYgb2YgcHJlc2VuY2Ugam9pbiBhbmQgbGVhdmVcbiAgICogZXZlbnRzIGZyb20gdGhlIHNlcnZlciwgYXMgdGhleSBoYXBwZW4uIExpa2UgYHN5bmNTdGF0ZWAsIGBzeW5jRGlmZmBcbiAgICogYWNjZXB0cyBvcHRpb25hbCBgb25Kb2luYCBhbmQgYG9uTGVhdmVgIGNhbGxiYWNrcyB0byByZWFjdCB0byBhIHVzZXJcbiAgICogam9pbmluZyBvciBsZWF2aW5nIGZyb20gYSBkZXZpY2UuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcmVzZW5jZX1cbiAgICovXG4gIHN0YXRpYyBzeW5jRGlmZihzdGF0ZSwgZGlmZiwgb25Kb2luLCBvbkxlYXZlKXtcbiAgICBsZXQge2pvaW5zLCBsZWF2ZXN9ID0gdGhpcy5jbG9uZShkaWZmKVxuICAgIGlmKCFvbkpvaW4peyBvbkpvaW4gPSBmdW5jdGlvbiAoKXsgfSB9XG4gICAgaWYoIW9uTGVhdmUpeyBvbkxlYXZlID0gZnVuY3Rpb24gKCl7IH0gfVxuXG4gICAgdGhpcy5tYXAoam9pbnMsIChrZXksIG5ld1ByZXNlbmNlKSA9PiB7XG4gICAgICBsZXQgY3VycmVudFByZXNlbmNlID0gc3RhdGVba2V5XVxuICAgICAgc3RhdGVba2V5XSA9IHRoaXMuY2xvbmUobmV3UHJlc2VuY2UpXG4gICAgICBpZihjdXJyZW50UHJlc2VuY2Upe1xuICAgICAgICBsZXQgam9pbmVkUmVmcyA9IHN0YXRlW2tleV0ubWV0YXMubWFwKG0gPT4gbS5waHhfcmVmKVxuICAgICAgICBsZXQgY3VyTWV0YXMgPSBjdXJyZW50UHJlc2VuY2UubWV0YXMuZmlsdGVyKG0gPT4gam9pbmVkUmVmcy5pbmRleE9mKG0ucGh4X3JlZikgPCAwKVxuICAgICAgICBzdGF0ZVtrZXldLm1ldGFzLnVuc2hpZnQoLi4uY3VyTWV0YXMpXG4gICAgICB9XG4gICAgICBvbkpvaW4oa2V5LCBjdXJyZW50UHJlc2VuY2UsIG5ld1ByZXNlbmNlKVxuICAgIH0pXG4gICAgdGhpcy5tYXAobGVhdmVzLCAoa2V5LCBsZWZ0UHJlc2VuY2UpID0+IHtcbiAgICAgIGxldCBjdXJyZW50UHJlc2VuY2UgPSBzdGF0ZVtrZXldXG4gICAgICBpZighY3VycmVudFByZXNlbmNlKXsgcmV0dXJuIH1cbiAgICAgIGxldCByZWZzVG9SZW1vdmUgPSBsZWZ0UHJlc2VuY2UubWV0YXMubWFwKG0gPT4gbS5waHhfcmVmKVxuICAgICAgY3VycmVudFByZXNlbmNlLm1ldGFzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLmZpbHRlcihwID0+IHtcbiAgICAgICAgcmV0dXJuIHJlZnNUb1JlbW92ZS5pbmRleE9mKHAucGh4X3JlZikgPCAwXG4gICAgICB9KVxuICAgICAgb25MZWF2ZShrZXksIGN1cnJlbnRQcmVzZW5jZSwgbGVmdFByZXNlbmNlKVxuICAgICAgaWYoY3VycmVudFByZXNlbmNlLm1ldGFzLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgIGRlbGV0ZSBzdGF0ZVtrZXldXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gc3RhdGVcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcmVzZW5jZXMsIHdpdGggc2VsZWN0ZWQgbWV0YWRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcmVzZW5jZXNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2hvb3NlclxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJlc2VuY2V9XG4gICAqL1xuICBzdGF0aWMgbGlzdChwcmVzZW5jZXMsIGNob29zZXIpe1xuICAgIGlmKCFjaG9vc2VyKXsgY2hvb3NlciA9IGZ1bmN0aW9uIChrZXksIHByZXMpeyByZXR1cm4gcHJlcyB9IH1cblxuICAgIHJldHVybiB0aGlzLm1hcChwcmVzZW5jZXMsIChrZXksIHByZXNlbmNlKSA9PiB7XG4gICAgICByZXR1cm4gY2hvb3NlcihrZXksIHByZXNlbmNlKVxuICAgIH0pXG4gIH1cblxuICAvLyBwcml2YXRlXG5cbiAgc3RhdGljIG1hcChvYmosIGZ1bmMpe1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLm1hcChrZXkgPT4gZnVuYyhrZXksIG9ialtrZXldKSlcbiAgfVxuXG4gIHN0YXRpYyBjbG9uZShvYmopeyByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKSB9XG59XG4iLCAiLyogVGhlIGRlZmF1bHQgc2VyaWFsaXplciBmb3IgZW5jb2RpbmcgYW5kIGRlY29kaW5nIG1lc3NhZ2VzICovXG5pbXBvcnQge1xuICBDSEFOTkVMX0VWRU5UU1xufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIEhFQURFUl9MRU5HVEg6IDEsXG4gIE1FVEFfTEVOR1RIOiA0LFxuICBLSU5EUzoge3B1c2g6IDAsIHJlcGx5OiAxLCBicm9hZGNhc3Q6IDJ9LFxuXG4gIGVuY29kZShtc2csIGNhbGxiYWNrKXtcbiAgICBpZihtc2cucGF5bG9hZC5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpe1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHRoaXMuYmluYXJ5RW5jb2RlKG1zZykpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBwYXlsb2FkID0gW21zZy5qb2luX3JlZiwgbXNnLnJlZiwgbXNnLnRvcGljLCBtc2cuZXZlbnQsIG1zZy5wYXlsb2FkXVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKVxuICAgIH1cbiAgfSxcblxuICBkZWNvZGUocmF3UGF5bG9hZCwgY2FsbGJhY2spe1xuICAgIGlmKHJhd1BheWxvYWQuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKXtcbiAgICAgIHJldHVybiBjYWxsYmFjayh0aGlzLmJpbmFyeURlY29kZShyYXdQYXlsb2FkKSlcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IFtqb2luX3JlZiwgcmVmLCB0b3BpYywgZXZlbnQsIHBheWxvYWRdID0gSlNPTi5wYXJzZShyYXdQYXlsb2FkKVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKHtqb2luX3JlZiwgcmVmLCB0b3BpYywgZXZlbnQsIHBheWxvYWR9KVxuICAgIH1cbiAgfSxcblxuICAvLyBwcml2YXRlXG5cbiAgYmluYXJ5RW5jb2RlKG1lc3NhZ2Upe1xuICAgIGxldCB7am9pbl9yZWYsIHJlZiwgZXZlbnQsIHRvcGljLCBwYXlsb2FkfSA9IG1lc3NhZ2VcbiAgICBsZXQgbWV0YUxlbmd0aCA9IHRoaXMuTUVUQV9MRU5HVEggKyBqb2luX3JlZi5sZW5ndGggKyByZWYubGVuZ3RoICsgdG9waWMubGVuZ3RoICsgZXZlbnQubGVuZ3RoXG4gICAgbGV0IGhlYWRlciA9IG5ldyBBcnJheUJ1ZmZlcih0aGlzLkhFQURFUl9MRU5HVEggKyBtZXRhTGVuZ3RoKVxuICAgIGxldCB2aWV3ID0gbmV3IERhdGFWaWV3KGhlYWRlcilcbiAgICBsZXQgb2Zmc2V0ID0gMFxuXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgdGhpcy5LSU5EUy5wdXNoKSAvLyBraW5kXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgam9pbl9yZWYubGVuZ3RoKVxuICAgIHZpZXcuc2V0VWludDgob2Zmc2V0KyssIHJlZi5sZW5ndGgpXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgdG9waWMubGVuZ3RoKVxuICAgIHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGV2ZW50Lmxlbmd0aClcbiAgICBBcnJheS5mcm9tKGpvaW5fcmVmLCBjaGFyID0+IHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGNoYXIuY2hhckNvZGVBdCgwKSkpXG4gICAgQXJyYXkuZnJvbShyZWYsIGNoYXIgPT4gdmlldy5zZXRVaW50OChvZmZzZXQrKywgY2hhci5jaGFyQ29kZUF0KDApKSlcbiAgICBBcnJheS5mcm9tKHRvcGljLCBjaGFyID0+IHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGNoYXIuY2hhckNvZGVBdCgwKSkpXG4gICAgQXJyYXkuZnJvbShldmVudCwgY2hhciA9PiB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBjaGFyLmNoYXJDb2RlQXQoMCkpKVxuXG4gICAgdmFyIGNvbWJpbmVkID0gbmV3IFVpbnQ4QXJyYXkoaGVhZGVyLmJ5dGVMZW5ndGggKyBwYXlsb2FkLmJ5dGVMZW5ndGgpXG4gICAgY29tYmluZWQuc2V0KG5ldyBVaW50OEFycmF5KGhlYWRlciksIDApXG4gICAgY29tYmluZWQuc2V0KG5ldyBVaW50OEFycmF5KHBheWxvYWQpLCBoZWFkZXIuYnl0ZUxlbmd0aClcblxuICAgIHJldHVybiBjb21iaW5lZC5idWZmZXJcbiAgfSxcblxuICBiaW5hcnlEZWNvZGUoYnVmZmVyKXtcbiAgICBsZXQgdmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpXG4gICAgbGV0IGtpbmQgPSB2aWV3LmdldFVpbnQ4KDApXG4gICAgbGV0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoKVxuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgdGhpcy5LSU5EUy5wdXNoOiByZXR1cm4gdGhpcy5kZWNvZGVQdXNoKGJ1ZmZlciwgdmlldywgZGVjb2RlcilcbiAgICAgIGNhc2UgdGhpcy5LSU5EUy5yZXBseTogcmV0dXJuIHRoaXMuZGVjb2RlUmVwbHkoYnVmZmVyLCB2aWV3LCBkZWNvZGVyKVxuICAgICAgY2FzZSB0aGlzLktJTkRTLmJyb2FkY2FzdDogcmV0dXJuIHRoaXMuZGVjb2RlQnJvYWRjYXN0KGJ1ZmZlciwgdmlldywgZGVjb2RlcilcbiAgICB9XG4gIH0sXG5cbiAgZGVjb2RlUHVzaChidWZmZXIsIHZpZXcsIGRlY29kZXIpe1xuICAgIGxldCBqb2luUmVmU2l6ZSA9IHZpZXcuZ2V0VWludDgoMSlcbiAgICBsZXQgdG9waWNTaXplID0gdmlldy5nZXRVaW50OCgyKVxuICAgIGxldCBldmVudFNpemUgPSB2aWV3LmdldFVpbnQ4KDMpXG4gICAgbGV0IG9mZnNldCA9IHRoaXMuSEVBREVSX0xFTkdUSCArIHRoaXMuTUVUQV9MRU5HVEggLSAxIC8vIHB1c2hlcyBoYXZlIG5vIHJlZlxuICAgIGxldCBqb2luUmVmID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgam9pblJlZlNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGpvaW5SZWZTaXplXG4gICAgbGV0IHRvcGljID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgdG9waWNTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyB0b3BpY1NpemVcbiAgICBsZXQgZXZlbnQgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBldmVudFNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGV2ZW50U2l6ZVxuICAgIGxldCBkYXRhID0gYnVmZmVyLnNsaWNlKG9mZnNldCwgYnVmZmVyLmJ5dGVMZW5ndGgpXG4gICAgcmV0dXJuIHtqb2luX3JlZjogam9pblJlZiwgcmVmOiBudWxsLCB0b3BpYzogdG9waWMsIGV2ZW50OiBldmVudCwgcGF5bG9hZDogZGF0YX1cbiAgfSxcblxuICBkZWNvZGVSZXBseShidWZmZXIsIHZpZXcsIGRlY29kZXIpe1xuICAgIGxldCBqb2luUmVmU2l6ZSA9IHZpZXcuZ2V0VWludDgoMSlcbiAgICBsZXQgcmVmU2l6ZSA9IHZpZXcuZ2V0VWludDgoMilcbiAgICBsZXQgdG9waWNTaXplID0gdmlldy5nZXRVaW50OCgzKVxuICAgIGxldCBldmVudFNpemUgPSB2aWV3LmdldFVpbnQ4KDQpXG4gICAgbGV0IG9mZnNldCA9IHRoaXMuSEVBREVSX0xFTkdUSCArIHRoaXMuTUVUQV9MRU5HVEhcbiAgICBsZXQgam9pblJlZiA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGpvaW5SZWZTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyBqb2luUmVmU2l6ZVxuICAgIGxldCByZWYgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyByZWZTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyByZWZTaXplXG4gICAgbGV0IHRvcGljID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgdG9waWNTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyB0b3BpY1NpemVcbiAgICBsZXQgZXZlbnQgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBldmVudFNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGV2ZW50U2l6ZVxuICAgIGxldCBkYXRhID0gYnVmZmVyLnNsaWNlKG9mZnNldCwgYnVmZmVyLmJ5dGVMZW5ndGgpXG4gICAgbGV0IHBheWxvYWQgPSB7c3RhdHVzOiBldmVudCwgcmVzcG9uc2U6IGRhdGF9XG4gICAgcmV0dXJuIHtqb2luX3JlZjogam9pblJlZiwgcmVmOiByZWYsIHRvcGljOiB0b3BpYywgZXZlbnQ6IENIQU5ORUxfRVZFTlRTLnJlcGx5LCBwYXlsb2FkOiBwYXlsb2FkfVxuICB9LFxuXG4gIGRlY29kZUJyb2FkY2FzdChidWZmZXIsIHZpZXcsIGRlY29kZXIpe1xuICAgIGxldCB0b3BpY1NpemUgPSB2aWV3LmdldFVpbnQ4KDEpXG4gICAgbGV0IGV2ZW50U2l6ZSA9IHZpZXcuZ2V0VWludDgoMilcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgMlxuICAgIGxldCB0b3BpYyA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIHRvcGljU2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgdG9waWNTaXplXG4gICAgbGV0IGV2ZW50ID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgZXZlbnRTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyBldmVudFNpemVcbiAgICBsZXQgZGF0YSA9IGJ1ZmZlci5zbGljZShvZmZzZXQsIGJ1ZmZlci5ieXRlTGVuZ3RoKVxuXG4gICAgcmV0dXJuIHtqb2luX3JlZjogbnVsbCwgcmVmOiBudWxsLCB0b3BpYzogdG9waWMsIGV2ZW50OiBldmVudCwgcGF5bG9hZDogZGF0YX1cbiAgfVxufVxuIiwgImltcG9ydCB7XG4gIGdsb2JhbCxcbiAgcGh4V2luZG93LFxuICBDSEFOTkVMX0VWRU5UUyxcbiAgREVGQVVMVF9USU1FT1VULFxuICBERUZBVUxUX1ZTTixcbiAgU09DS0VUX1NUQVRFUyxcbiAgVFJBTlNQT1JUUyxcbiAgV1NfQ0xPU0VfTk9STUFMXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGNsb3N1cmVcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgQWpheCBmcm9tIFwiLi9hamF4XCJcbmltcG9ydCBDaGFubmVsIGZyb20gXCIuL2NoYW5uZWxcIlxuaW1wb3J0IExvbmdQb2xsIGZyb20gXCIuL2xvbmdwb2xsXCJcbmltcG9ydCBTZXJpYWxpemVyIGZyb20gXCIuL3NlcmlhbGl6ZXJcIlxuaW1wb3J0IFRpbWVyIGZyb20gXCIuL3RpbWVyXCJcblxuLyoqIEluaXRpYWxpemVzIHRoZSBTb2NrZXQgKlxuICpcbiAqIEZvciBJRTggc3VwcG9ydCB1c2UgYW4gRVM1LXNoaW0gKGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbSlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZW5kUG9pbnQgLSBUaGUgc3RyaW5nIFdlYlNvY2tldCBlbmRwb2ludCwgaWUsIGBcIndzOi8vZXhhbXBsZS5jb20vc29ja2V0XCJgLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBcIndzczovL2V4YW1wbGUuY29tXCJgXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFwiL3NvY2tldFwiYCAoaW5oZXJpdGVkIGhvc3QgJiBwcm90b2NvbClcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0c10gLSBPcHRpb25hbCBjb25maWd1cmF0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy50cmFuc3BvcnRdIC0gVGhlIFdlYnNvY2tldCBUcmFuc3BvcnQsIGZvciBleGFtcGxlIFdlYlNvY2tldCBvciBQaG9lbml4LkxvbmdQb2xsLlxuICpcbiAqIERlZmF1bHRzIHRvIFdlYlNvY2tldCB3aXRoIGF1dG9tYXRpYyBMb25nUG9sbCBmYWxsYmFjay5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLmVuY29kZV0gLSBUaGUgZnVuY3Rpb24gdG8gZW5jb2RlIG91dGdvaW5nIG1lc3NhZ2VzLlxuICpcbiAqIERlZmF1bHRzIHRvIEpTT04gZW5jb2Rlci5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5kZWNvZGVdIC0gVGhlIGZ1bmN0aW9uIHRvIGRlY29kZSBpbmNvbWluZyBtZXNzYWdlcy5cbiAqXG4gKiBEZWZhdWx0cyB0byBKU09OOlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIChwYXlsb2FkLCBjYWxsYmFjaykgPT4gY2FsbGJhY2soSlNPTi5wYXJzZShwYXlsb2FkKSlcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy50aW1lb3V0XSAtIFRoZSBkZWZhdWx0IHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIHRyaWdnZXIgcHVzaCB0aW1lb3V0cy5cbiAqXG4gKiBEZWZhdWx0cyBgREVGQVVMVF9USU1FT1VUYFxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLmhlYXJ0YmVhdEludGVydmFsTXNdIC0gVGhlIG1pbGxpc2VjIGludGVydmFsIHRvIHNlbmQgYSBoZWFydGJlYXQgbWVzc2FnZVxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnJlY29ubmVjdEFmdGVyTXNdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgbWlsbHNlY1xuICogc29ja2V0IHJlY29ubmVjdCBpbnRlcnZhbC5cbiAqXG4gKiBEZWZhdWx0cyB0byBzdGVwcGVkIGJhY2tvZmYgb2Y6XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogZnVuY3Rpb24odHJpZXMpe1xuICogICByZXR1cm4gWzEwLCA1MCwgMTAwLCAxNTAsIDIwMCwgMjUwLCA1MDAsIDEwMDAsIDIwMDBdW3RyaWVzIC0gMV0gfHwgNTAwMFxuICogfVxuICogYGBgYFxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5yZWpvaW5BZnRlck1zXSAtIFRoZSBvcHRpb25hbCBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIG1pbGxzZWNcbiAqIHJlam9pbiBpbnRlcnZhbCBmb3IgaW5kaXZpZHVhbCBjaGFubmVscy5cbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbih0cmllcyl7XG4gKiAgIHJldHVybiBbMTAwMCwgMjAwMCwgNTAwMF1bdHJpZXMgLSAxXSB8fCAxMDAwMFxuICogfVxuICogYGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLmxvZ2dlcl0gLSBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gZm9yIHNwZWNpYWxpemVkIGxvZ2dpbmcsIGllOlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGZ1bmN0aW9uKGtpbmQsIG1zZywgZGF0YSkge1xuICogICBjb25zb2xlLmxvZyhgJHtraW5kfTogJHttc2d9YCwgZGF0YSlcbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5sb25ncG9sbGVyVGltZW91dF0gLSBUaGUgbWF4aW11bSB0aW1lb3V0IG9mIGEgbG9uZyBwb2xsIEFKQVggcmVxdWVzdC5cbiAqXG4gKiBEZWZhdWx0cyB0byAyMHMgKGRvdWJsZSB0aGUgc2VydmVyIGxvbmcgcG9sbCB0aW1lcikuXG4gKlxuICogQHBhcmFtIHt7T2JqZWN0fGZ1bmN0aW9uKX0gW29wdHMucGFyYW1zXSAtIFRoZSBvcHRpb25hbCBwYXJhbXMgdG8gcGFzcyB3aGVuIGNvbm5lY3RpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5iaW5hcnlUeXBlXSAtIFRoZSBiaW5hcnkgdHlwZSB0byB1c2UgZm9yIGJpbmFyeSBXZWJTb2NrZXQgZnJhbWVzLlxuICpcbiAqIERlZmF1bHRzIHRvIFwiYXJyYXlidWZmZXJcIlxuICpcbiAqIEBwYXJhbSB7dnNufSBbb3B0cy52c25dIC0gVGhlIHNlcmlhbGl6ZXIncyBwcm90b2NvbCB2ZXJzaW9uIHRvIHNlbmQgb24gY29ubmVjdC5cbiAqXG4gKiBEZWZhdWx0cyB0byBERUZBVUxUX1ZTTi5cbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXQge1xuICBjb25zdHJ1Y3RvcihlbmRQb2ludCwgb3B0cyA9IHt9KXtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzID0ge29wZW46IFtdLCBjbG9zZTogW10sIGVycm9yOiBbXSwgbWVzc2FnZTogW119XG4gICAgdGhpcy5jaGFubmVscyA9IFtdXG4gICAgdGhpcy5zZW5kQnVmZmVyID0gW11cbiAgICB0aGlzLnJlZiA9IDBcbiAgICB0aGlzLnRpbWVvdXQgPSBvcHRzLnRpbWVvdXQgfHwgREVGQVVMVF9USU1FT1VUXG4gICAgdGhpcy50cmFuc3BvcnQgPSBvcHRzLnRyYW5zcG9ydCB8fCBnbG9iYWwuV2ViU29ja2V0IHx8IExvbmdQb2xsXG4gICAgdGhpcy5lc3RhYmxpc2hlZENvbm5lY3Rpb25zID0gMFxuICAgIHRoaXMuZGVmYXVsdEVuY29kZXIgPSBTZXJpYWxpemVyLmVuY29kZS5iaW5kKFNlcmlhbGl6ZXIpXG4gICAgdGhpcy5kZWZhdWx0RGVjb2RlciA9IFNlcmlhbGl6ZXIuZGVjb2RlLmJpbmQoU2VyaWFsaXplcilcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSBmYWxzZVxuICAgIHRoaXMuYmluYXJ5VHlwZSA9IG9wdHMuYmluYXJ5VHlwZSB8fCBcImFycmF5YnVmZmVyXCJcbiAgICB0aGlzLmNvbm5lY3RDbG9jayA9IDFcbiAgICBpZih0aGlzLnRyYW5zcG9ydCAhPT0gTG9uZ1BvbGwpe1xuICAgICAgdGhpcy5lbmNvZGUgPSBvcHRzLmVuY29kZSB8fCB0aGlzLmRlZmF1bHRFbmNvZGVyXG4gICAgICB0aGlzLmRlY29kZSA9IG9wdHMuZGVjb2RlIHx8IHRoaXMuZGVmYXVsdERlY29kZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbmNvZGUgPSB0aGlzLmRlZmF1bHRFbmNvZGVyXG4gICAgICB0aGlzLmRlY29kZSA9IHRoaXMuZGVmYXVsdERlY29kZXJcbiAgICB9XG4gICAgbGV0IGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPSBudWxsXG4gICAgaWYocGh4V2luZG93ICYmIHBoeFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKXtcbiAgICAgIHBoeFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZWhpZGVcIiwgX2UgPT4ge1xuICAgICAgICBpZih0aGlzLmNvbm4pe1xuICAgICAgICAgIHRoaXMuZGlzY29ubmVjdCgpXG4gICAgICAgICAgYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9IHRoaXMuY29ubmVjdENsb2NrXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBwaHhXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2VzaG93XCIsIF9lID0+IHtcbiAgICAgICAgaWYoYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9PT0gdGhpcy5jb25uZWN0Q2xvY2spe1xuICAgICAgICAgIGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPSBudWxsXG4gICAgICAgICAgdGhpcy5jb25uZWN0KClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zID0gb3B0cy5oZWFydGJlYXRJbnRlcnZhbE1zIHx8IDMwMDAwXG4gICAgdGhpcy5yZWpvaW5BZnRlck1zID0gKHRyaWVzKSA9PiB7XG4gICAgICBpZihvcHRzLnJlam9pbkFmdGVyTXMpe1xuICAgICAgICByZXR1cm4gb3B0cy5yZWpvaW5BZnRlck1zKHRyaWVzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFsxMDAwLCAyMDAwLCA1MDAwXVt0cmllcyAtIDFdIHx8IDEwMDAwXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucmVjb25uZWN0QWZ0ZXJNcyA9ICh0cmllcykgPT4ge1xuICAgICAgaWYob3B0cy5yZWNvbm5lY3RBZnRlck1zKXtcbiAgICAgICAgcmV0dXJuIG9wdHMucmVjb25uZWN0QWZ0ZXJNcyh0cmllcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbMTAsIDUwLCAxMDAsIDE1MCwgMjAwLCAyNTAsIDUwMCwgMTAwMCwgMjAwMF1bdHJpZXMgLSAxXSB8fCA1MDAwXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubG9nZ2VyID0gb3B0cy5sb2dnZXIgfHwgbnVsbFxuICAgIHRoaXMubG9uZ3BvbGxlclRpbWVvdXQgPSBvcHRzLmxvbmdwb2xsZXJUaW1lb3V0IHx8IDIwMDAwXG4gICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKG9wdHMucGFyYW1zIHx8IHt9KVxuICAgIHRoaXMuZW5kUG9pbnQgPSBgJHtlbmRQb2ludH0vJHtUUkFOU1BPUlRTLndlYnNvY2tldH1gXG4gICAgdGhpcy52c24gPSBvcHRzLnZzbiB8fCBERUZBVUxUX1ZTTlxuICAgIHRoaXMuaGVhcnRiZWF0VGltZXIgPSBudWxsXG4gICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbFxuICAgIHRoaXMucmVjb25uZWN0VGltZXIgPSBuZXcgVGltZXIoKCkgPT4ge1xuICAgICAgdGhpcy50ZWFyZG93bigoKSA9PiB0aGlzLmNvbm5lY3QoKSlcbiAgICB9LCB0aGlzLnJlY29ubmVjdEFmdGVyTXMpXG4gIH1cblxuICAvKipcbiAgICogRGlzY29ubmVjdHMgYW5kIHJlcGxhY2VzIHRoZSBhY3RpdmUgdHJhbnNwb3J0XG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG5ld1RyYW5zcG9ydCAtIFRoZSBuZXcgdHJhbnNwb3J0IGNsYXNzIHRvIGluc3RhbnRpYXRlXG4gICAqXG4gICAqL1xuICByZXBsYWNlVHJhbnNwb3J0KG5ld1RyYW5zcG9ydCl7XG4gICAgdGhpcy5kaXNjb25uZWN0KClcbiAgICB0aGlzLnRyYW5zcG9ydCA9IG5ld1RyYW5zcG9ydFxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNvY2tldCBwcm90b2NvbFxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgcHJvdG9jb2woKXsgcmV0dXJuIGxvY2F0aW9uLnByb3RvY29sLm1hdGNoKC9eaHR0cHMvKSA/IFwid3NzXCIgOiBcIndzXCIgfVxuXG4gIC8qKlxuICAgKiBUaGUgZnVsbHkgcXVhbGlmZWQgc29ja2V0IHVybFxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgZW5kUG9pbnRVUkwoKXtcbiAgICBsZXQgdXJpID0gQWpheC5hcHBlbmRQYXJhbXMoXG4gICAgICBBamF4LmFwcGVuZFBhcmFtcyh0aGlzLmVuZFBvaW50LCB0aGlzLnBhcmFtcygpKSwge3ZzbjogdGhpcy52c259KVxuICAgIGlmKHVyaS5jaGFyQXQoMCkgIT09IFwiL1wiKXsgcmV0dXJuIHVyaSB9XG4gICAgaWYodXJpLmNoYXJBdCgxKSA9PT0gXCIvXCIpeyByZXR1cm4gYCR7dGhpcy5wcm90b2NvbCgpfToke3VyaX1gIH1cblxuICAgIHJldHVybiBgJHt0aGlzLnByb3RvY29sKCl9Oi8vJHtsb2NhdGlvbi5ob3N0fSR7dXJpfWBcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyB0aGUgc29ja2V0XG4gICAqXG4gICAqIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ2xvc2VFdmVudCNTdGF0dXNfY29kZXMgZm9yIHZhbGlkIHN0YXR1cyBjb2Rlcy5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBPcHRpb25hbCBjYWxsYmFjayB3aGljaCBpcyBjYWxsZWQgYWZ0ZXIgc29ja2V0IGlzIGRpc2Nvbm5lY3RlZC5cbiAgICogQHBhcmFtIHtpbnRlZ2VyfSBjb2RlIC0gQSBzdGF0dXMgY29kZSBmb3IgZGlzY29ubmVjdGlvbiAoT3B0aW9uYWwpLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVhc29uIC0gQSB0ZXh0dWFsIGRlc2NyaXB0aW9uIG9mIHRoZSByZWFzb24gdG8gZGlzY29ubmVjdC4gKE9wdGlvbmFsKVxuICAgKi9cbiAgZGlzY29ubmVjdChjYWxsYmFjaywgY29kZSwgcmVhc29uKXtcbiAgICB0aGlzLmNvbm5lY3RDbG9jaysrXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gdHJ1ZVxuICAgIHRoaXMucmVjb25uZWN0VGltZXIucmVzZXQoKVxuICAgIHRoaXMudGVhcmRvd24oY2FsbGJhY2ssIGNvZGUsIHJlYXNvbilcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gVGhlIHBhcmFtcyB0byBzZW5kIHdoZW4gY29ubmVjdGluZywgZm9yIGV4YW1wbGUgYHt1c2VyX2lkOiB1c2VyVG9rZW59YFxuICAgKlxuICAgKiBQYXNzaW5nIHBhcmFtcyB0byBjb25uZWN0IGlzIGRlcHJlY2F0ZWQ7IHBhc3MgdGhlbSBpbiB0aGUgU29ja2V0IGNvbnN0cnVjdG9yIGluc3RlYWQ6XG4gICAqIGBuZXcgU29ja2V0KFwiL3NvY2tldFwiLCB7cGFyYW1zOiB7dXNlcl9pZDogdXNlclRva2VufX0pYC5cbiAgICovXG4gIGNvbm5lY3QocGFyYW1zKXtcbiAgICB0aGlzLmNvbm5lY3RDbG9jaysrXG4gICAgaWYocGFyYW1zKXtcbiAgICAgIGNvbnNvbGUgJiYgY29uc29sZS5sb2coXCJwYXNzaW5nIHBhcmFtcyB0byBjb25uZWN0IGlzIGRlcHJlY2F0ZWQuIEluc3RlYWQgcGFzcyA6cGFyYW1zIHRvIHRoZSBTb2NrZXQgY29uc3RydWN0b3JcIilcbiAgICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShwYXJhbXMpXG4gICAgfVxuICAgIGlmKHRoaXMuY29ubil7IHJldHVybiB9XG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2VcbiAgICB0aGlzLmNvbm4gPSBuZXcgdGhpcy50cmFuc3BvcnQodGhpcy5lbmRQb2ludFVSTCgpKVxuICAgIHRoaXMuY29ubi5iaW5hcnlUeXBlID0gdGhpcy5iaW5hcnlUeXBlXG4gICAgdGhpcy5jb25uLnRpbWVvdXQgPSB0aGlzLmxvbmdwb2xsZXJUaW1lb3V0XG4gICAgdGhpcy5jb25uLm9ub3BlbiA9ICgpID0+IHRoaXMub25Db25uT3BlbigpXG4gICAgdGhpcy5jb25uLm9uZXJyb3IgPSBlcnJvciA9PiB0aGlzLm9uQ29ubkVycm9yKGVycm9yKVxuICAgIHRoaXMuY29ubi5vbm1lc3NhZ2UgPSBldmVudCA9PiB0aGlzLm9uQ29ubk1lc3NhZ2UoZXZlbnQpXG4gICAgdGhpcy5jb25uLm9uY2xvc2UgPSBldmVudCA9PiB0aGlzLm9uQ29ubkNsb3NlKGV2ZW50KVxuICB9XG5cbiAgLyoqXG4gICAqIExvZ3MgdGhlIG1lc3NhZ2UuIE92ZXJyaWRlIGB0aGlzLmxvZ2dlcmAgZm9yIHNwZWNpYWxpemVkIGxvZ2dpbmcuIG5vb3BzIGJ5IGRlZmF1bHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtpbmRcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1zZ1xuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgbG9nKGtpbmQsIG1zZywgZGF0YSl7IHRoaXMubG9nZ2VyKGtpbmQsIG1zZywgZGF0YSkgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgYSBsb2dnZXIgaGFzIGJlZW4gc2V0IG9uIHRoaXMgc29ja2V0LlxuICAgKi9cbiAgaGFzTG9nZ2VyKCl7IHJldHVybiB0aGlzLmxvZ2dlciAhPT0gbnVsbCB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBjYWxsYmFja3MgZm9yIGNvbm5lY3Rpb24gb3BlbiBldmVudHNcbiAgICpcbiAgICogQGV4YW1wbGUgc29ja2V0Lm9uT3BlbihmdW5jdGlvbigpeyBjb25zb2xlLmluZm8oXCJ0aGUgc29ja2V0IHdhcyBvcGVuZWRcIikgfSlcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uT3BlbihjYWxsYmFjayl7XG4gICAgbGV0IHJlZiA9IHRoaXMubWFrZVJlZigpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5vcGVuLnB1c2goW3JlZiwgY2FsbGJhY2tdKVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIGNsb3NlIGV2ZW50c1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25DbG9zZShjYWxsYmFjayl7XG4gICAgbGV0IHJlZiA9IHRoaXMubWFrZVJlZigpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5jbG9zZS5wdXNoKFtyZWYsIGNhbGxiYWNrXSlcbiAgICByZXR1cm4gcmVmXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGNhbGxiYWNrcyBmb3IgY29ubmVjdGlvbiBlcnJvciBldmVudHNcbiAgICpcbiAgICogQGV4YW1wbGUgc29ja2V0Lm9uRXJyb3IoZnVuY3Rpb24oZXJyb3IpeyBhbGVydChcIkFuIGVycm9yIG9jY3VycmVkXCIpIH0pXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbkVycm9yKGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmVycm9yLnB1c2goW3JlZiwgY2FsbGJhY2tdKVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIG1lc3NhZ2UgZXZlbnRzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbk1lc3NhZ2UoY2FsbGJhY2spe1xuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MubWVzc2FnZS5wdXNoKFtyZWYsIGNhbGxiYWNrXSlcbiAgICByZXR1cm4gcmVmXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uQ29ubk9wZW4oKXtcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgY29ubmVjdGVkIHRvICR7dGhpcy5lbmRQb2ludFVSTCgpfWApXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2VcbiAgICB0aGlzLmVzdGFibGlzaGVkQ29ubmVjdGlvbnMrK1xuICAgIHRoaXMuZmx1c2hTZW5kQnVmZmVyKClcbiAgICB0aGlzLnJlY29ubmVjdFRpbWVyLnJlc2V0KClcbiAgICB0aGlzLnJlc2V0SGVhcnRiZWF0KClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm9wZW4uZm9yRWFjaCgoWywgY2FsbGJhY2tdKSA9PiBjYWxsYmFjaygpKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIGhlYXJ0YmVhdFRpbWVvdXQoKXtcbiAgICBpZih0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYpe1xuICAgICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbFxuICAgICAgaWYodGhpcy5oYXNMb2dnZXIoKSl7IHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIFwiaGVhcnRiZWF0IHRpbWVvdXQuIEF0dGVtcHRpbmcgdG8gcmUtZXN0YWJsaXNoIGNvbm5lY3Rpb25cIikgfVxuICAgICAgdGhpcy5hYm5vcm1hbENsb3NlKFwiaGVhcnRiZWF0IHRpbWVvdXRcIilcbiAgICB9XG4gIH1cblxuICByZXNldEhlYXJ0YmVhdCgpe1xuICAgIGlmKHRoaXMuY29ubiAmJiB0aGlzLmNvbm4uc2tpcEhlYXJ0YmVhdCl7IHJldHVybiB9XG4gICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbFxuICAgIGNsZWFyVGltZW91dCh0aGlzLmhlYXJ0YmVhdFRpbWVyKVxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZW5kSGVhcnRiZWF0KCksIHRoaXMuaGVhcnRiZWF0SW50ZXJ2YWxNcylcbiAgfVxuXG4gIHRlYXJkb3duKGNhbGxiYWNrLCBjb2RlLCByZWFzb24pe1xuICAgIGlmKCF0aGlzLmNvbm4pe1xuICAgICAgcmV0dXJuIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9XG5cbiAgICB0aGlzLndhaXRGb3JCdWZmZXJEb25lKCgpID0+IHtcbiAgICAgIGlmKHRoaXMuY29ubil7XG4gICAgICAgIGlmKGNvZGUpeyB0aGlzLmNvbm4uY2xvc2UoY29kZSwgcmVhc29uIHx8IFwiXCIpIH0gZWxzZSB7IHRoaXMuY29ubi5jbG9zZSgpIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy53YWl0Rm9yU29ja2V0Q2xvc2VkKCgpID0+IHtcbiAgICAgICAgaWYodGhpcy5jb25uKXtcbiAgICAgICAgICB0aGlzLmNvbm4ub25jbG9zZSA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICAgICAgICB0aGlzLmNvbm4gPSBudWxsXG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICB3YWl0Rm9yQnVmZmVyRG9uZShjYWxsYmFjaywgdHJpZXMgPSAxKXtcbiAgICBpZih0cmllcyA9PT0gNSB8fCAhdGhpcy5jb25uIHx8ICF0aGlzLmNvbm4uYnVmZmVyZWRBbW91bnQpe1xuICAgICAgY2FsbGJhY2soKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLndhaXRGb3JCdWZmZXJEb25lKGNhbGxiYWNrLCB0cmllcyArIDEpXG4gICAgfSwgMTUwICogdHJpZXMpXG4gIH1cblxuICB3YWl0Rm9yU29ja2V0Q2xvc2VkKGNhbGxiYWNrLCB0cmllcyA9IDEpe1xuICAgIGlmKHRyaWVzID09PSA1IHx8ICF0aGlzLmNvbm4gfHwgdGhpcy5jb25uLnJlYWR5U3RhdGUgPT09IFNPQ0tFVF9TVEFURVMuY2xvc2VkKXtcbiAgICAgIGNhbGxiYWNrKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy53YWl0Rm9yU29ja2V0Q2xvc2VkKGNhbGxiYWNrLCB0cmllcyArIDEpXG4gICAgfSwgMTUwICogdHJpZXMpXG4gIH1cblxuICBvbkNvbm5DbG9zZShldmVudCl7XG4gICAgbGV0IGNsb3NlQ29kZSA9IGV2ZW50ICYmIGV2ZW50LmNvZGVcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBcImNsb3NlXCIsIGV2ZW50KVxuICAgIHRoaXMudHJpZ2dlckNoYW5FcnJvcigpXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuaGVhcnRiZWF0VGltZXIpXG4gICAgaWYoIXRoaXMuY2xvc2VXYXNDbGVhbiAmJiBjbG9zZUNvZGUgIT09IDEwMDApe1xuICAgICAgdGhpcy5yZWNvbm5lY3RUaW1lci5zY2hlZHVsZVRpbWVvdXQoKVxuICAgIH1cbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmNsb3NlLmZvckVhY2goKFssIGNhbGxiYWNrXSkgPT4gY2FsbGJhY2soZXZlbnQpKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvbkNvbm5FcnJvcihlcnJvcil7XG4gICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgZXJyb3IpXG4gICAgbGV0IHRyYW5zcG9ydEJlZm9yZSA9IHRoaXMudHJhbnNwb3J0XG4gICAgbGV0IGVzdGFibGlzaGVkQmVmb3JlID0gdGhpcy5lc3RhYmxpc2hlZENvbm5lY3Rpb25zXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5lcnJvci5mb3JFYWNoKChbLCBjYWxsYmFja10pID0+IHtcbiAgICAgIGNhbGxiYWNrKGVycm9yLCB0cmFuc3BvcnRCZWZvcmUsIGVzdGFibGlzaGVkQmVmb3JlKVxuICAgIH0pXG4gICAgaWYodHJhbnNwb3J0QmVmb3JlID09PSB0aGlzLnRyYW5zcG9ydCB8fCBlc3RhYmxpc2hlZEJlZm9yZSA+IDApe1xuICAgICAgdGhpcy50cmlnZ2VyQ2hhbkVycm9yKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHRyaWdnZXJDaGFuRXJyb3IoKXtcbiAgICB0aGlzLmNoYW5uZWxzLmZvckVhY2goY2hhbm5lbCA9PiB7XG4gICAgICBpZighKGNoYW5uZWwuaXNFcnJvcmVkKCkgfHwgY2hhbm5lbC5pc0xlYXZpbmcoKSB8fCBjaGFubmVsLmlzQ2xvc2VkKCkpKXtcbiAgICAgICAgY2hhbm5lbC50cmlnZ2VyKENIQU5ORUxfRVZFTlRTLmVycm9yKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGNvbm5lY3Rpb25TdGF0ZSgpe1xuICAgIHN3aXRjaCh0aGlzLmNvbm4gJiYgdGhpcy5jb25uLnJlYWR5U3RhdGUpe1xuICAgICAgY2FzZSBTT0NLRVRfU1RBVEVTLmNvbm5lY3Rpbmc6IHJldHVybiBcImNvbm5lY3RpbmdcIlxuICAgICAgY2FzZSBTT0NLRVRfU1RBVEVTLm9wZW46IHJldHVybiBcIm9wZW5cIlxuICAgICAgY2FzZSBTT0NLRVRfU1RBVEVTLmNsb3Npbmc6IHJldHVybiBcImNsb3NpbmdcIlxuICAgICAgZGVmYXVsdDogcmV0dXJuIFwiY2xvc2VkXCJcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpc0Nvbm5lY3RlZCgpeyByZXR1cm4gdGhpcy5jb25uZWN0aW9uU3RhdGUoKSA9PT0gXCJvcGVuXCIgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0NoYW5uZWx9XG4gICAqL1xuICByZW1vdmUoY2hhbm5lbCl7XG4gICAgdGhpcy5vZmYoY2hhbm5lbC5zdGF0ZUNoYW5nZVJlZnMpXG4gICAgdGhpcy5jaGFubmVscyA9IHRoaXMuY2hhbm5lbHMuZmlsdGVyKGMgPT4gYy5qb2luUmVmKCkgIT09IGNoYW5uZWwuam9pblJlZigpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYG9uT3BlbmAsIGBvbkNsb3NlYCwgYG9uRXJyb3IsYCBhbmQgYG9uTWVzc2FnZWAgcmVnaXN0cmF0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtyZWZzfSAtIGxpc3Qgb2YgcmVmcyByZXR1cm5lZCBieSBjYWxscyB0b1xuICAgKiAgICAgICAgICAgICAgICAgYG9uT3BlbmAsIGBvbkNsb3NlYCwgYG9uRXJyb3IsYCBhbmQgYG9uTWVzc2FnZWBcbiAgICovXG4gIG9mZihyZWZzKXtcbiAgICBmb3IobGV0IGtleSBpbiB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzKXtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Nba2V5XSA9IHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Nba2V5XS5maWx0ZXIoKFtyZWZdKSA9PiB7XG4gICAgICAgIHJldHVybiByZWZzLmluZGV4T2YocmVmKSA9PT0gLTFcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYXRlcyBhIG5ldyBjaGFubmVsIGZvciB0aGUgZ2l2ZW4gdG9waWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjaGFuUGFyYW1zIC0gUGFyYW1ldGVycyBmb3IgdGhlIGNoYW5uZWxcbiAgICogQHJldHVybnMge0NoYW5uZWx9XG4gICAqL1xuICBjaGFubmVsKHRvcGljLCBjaGFuUGFyYW1zID0ge30pe1xuICAgIGxldCBjaGFuID0gbmV3IENoYW5uZWwodG9waWMsIGNoYW5QYXJhbXMsIHRoaXMpXG4gICAgdGhpcy5jaGFubmVscy5wdXNoKGNoYW4pXG4gICAgcmV0dXJuIGNoYW5cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgcHVzaChkYXRhKXtcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKXtcbiAgICAgIGxldCB7dG9waWMsIGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5fcmVmfSA9IGRhdGFcbiAgICAgIHRoaXMubG9nKFwicHVzaFwiLCBgJHt0b3BpY30gJHtldmVudH0gKCR7am9pbl9yZWZ9LCAke3JlZn0pYCwgcGF5bG9hZClcbiAgICB9XG5cbiAgICBpZih0aGlzLmlzQ29ubmVjdGVkKCkpe1xuICAgICAgdGhpcy5lbmNvZGUoZGF0YSwgcmVzdWx0ID0+IHRoaXMuY29ubi5zZW5kKHJlc3VsdCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VuZEJ1ZmZlci5wdXNoKCgpID0+IHRoaXMuZW5jb2RlKGRhdGEsIHJlc3VsdCA9PiB0aGlzLmNvbm4uc2VuZChyZXN1bHQpKSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBuZXh0IG1lc3NhZ2UgcmVmLCBhY2NvdW50aW5nIGZvciBvdmVyZmxvd3NcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIG1ha2VSZWYoKXtcbiAgICBsZXQgbmV3UmVmID0gdGhpcy5yZWYgKyAxXG4gICAgaWYobmV3UmVmID09PSB0aGlzLnJlZil7IHRoaXMucmVmID0gMCB9IGVsc2UgeyB0aGlzLnJlZiA9IG5ld1JlZiB9XG5cbiAgICByZXR1cm4gdGhpcy5yZWYudG9TdHJpbmcoKVxuICB9XG5cbiAgc2VuZEhlYXJ0YmVhdCgpe1xuICAgIGlmKHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiAmJiAhdGhpcy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIH1cbiAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMucHVzaCh7dG9waWM6IFwicGhvZW5peFwiLCBldmVudDogXCJoZWFydGJlYXRcIiwgcGF5bG9hZDoge30sIHJlZjogdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmfSlcbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLmhlYXJ0YmVhdFRpbWVvdXQoKSwgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zKVxuICB9XG5cbiAgYWJub3JtYWxDbG9zZShyZWFzb24pe1xuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IGZhbHNlXG4gICAgaWYodGhpcy5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5jb25uLmNsb3NlKFdTX0NMT1NFX05PUk1BTCwgcmVhc29uKSB9XG4gIH1cblxuICBmbHVzaFNlbmRCdWZmZXIoKXtcbiAgICBpZih0aGlzLmlzQ29ubmVjdGVkKCkgJiYgdGhpcy5zZW5kQnVmZmVyLmxlbmd0aCA+IDApe1xuICAgICAgdGhpcy5zZW5kQnVmZmVyLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2soKSlcbiAgICAgIHRoaXMuc2VuZEJ1ZmZlciA9IFtdXG4gICAgfVxuICB9XG5cbiAgb25Db25uTWVzc2FnZShyYXdNZXNzYWdlKXtcbiAgICB0aGlzLmRlY29kZShyYXdNZXNzYWdlLmRhdGEsIG1zZyA9PiB7XG4gICAgICBsZXQge3RvcGljLCBldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luX3JlZn0gPSBtc2dcbiAgICAgIGlmKHJlZiAmJiByZWYgPT09IHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZil7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmhlYXJ0YmVhdFRpbWVyKVxuICAgICAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZW5kSGVhcnRiZWF0KCksIHRoaXMuaGVhcnRiZWF0SW50ZXJ2YWxNcylcbiAgICAgIH1cblxuICAgICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJyZWNlaXZlXCIsIGAke3BheWxvYWQuc3RhdHVzIHx8IFwiXCJ9ICR7dG9waWN9ICR7ZXZlbnR9ICR7cmVmICYmIFwiKFwiICsgcmVmICsgXCIpXCIgfHwgXCJcIn1gLCBwYXlsb2FkKVxuXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGFubmVscy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLmNoYW5uZWxzW2ldXG4gICAgICAgIGlmKCFjaGFubmVsLmlzTWVtYmVyKHRvcGljLCBldmVudCwgcGF5bG9hZCwgam9pbl9yZWYpKXsgY29udGludWUgfVxuICAgICAgICBjaGFubmVsLnRyaWdnZXIoZXZlbnQsIHBheWxvYWQsIHJlZiwgam9pbl9yZWYpXG4gICAgICB9XG5cbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm1lc3NhZ2UubGVuZ3RoOyBpKyspe1xuICAgICAgICBsZXQgWywgY2FsbGJhY2tdID0gdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5tZXNzYWdlW2ldXG4gICAgICAgIGNhbGxiYWNrKG1zZylcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgbGVhdmVPcGVuVG9waWModG9waWMpe1xuICAgIGxldCBkdXBDaGFubmVsID0gdGhpcy5jaGFubmVscy5maW5kKGMgPT4gYy50b3BpYyA9PT0gdG9waWMgJiYgKGMuaXNKb2luZWQoKSB8fCBjLmlzSm9pbmluZygpKSlcbiAgICBpZihkdXBDaGFubmVsKXtcbiAgICAgIGlmKHRoaXMuaGFzTG9nZ2VyKCkpIHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIGBsZWF2aW5nIGR1cGxpY2F0ZSB0b3BpYyBcIiR7dG9waWN9XCJgKVxuICAgICAgZHVwQ2hhbm5lbC5sZWF2ZSgpXG4gICAgfVxuICB9XG59XG4iLCAiXG5leHBvcnQgY29uc3QgQ09OU0VDVVRJVkVfUkVMT0FEUyA9IFwiY29uc2VjdXRpdmUtcmVsb2Fkc1wiXG5leHBvcnQgY29uc3QgTUFYX1JFTE9BRFMgPSAxMFxuZXhwb3J0IGNvbnN0IFJFTE9BRF9KSVRURVIgPSBbMTAwMCwgMzAwMF1cbmV4cG9ydCBjb25zdCBGQUlMU0FGRV9KSVRURVIgPSAzMDAwMFxuZXhwb3J0IGNvbnN0IFBIWF9FVkVOVF9DTEFTU0VTID0gW1xuICBcInBoeC1jbGljay1sb2FkaW5nXCIsIFwicGh4LWNoYW5nZS1sb2FkaW5nXCIsIFwicGh4LXN1Ym1pdC1sb2FkaW5nXCIsXG4gIFwicGh4LWtleWRvd24tbG9hZGluZ1wiLCBcInBoeC1rZXl1cC1sb2FkaW5nXCIsIFwicGh4LWJsdXItbG9hZGluZ1wiLCBcInBoeC1mb2N1cy1sb2FkaW5nXCJcbl1cbmV4cG9ydCBjb25zdCBQSFhfQ09NUE9ORU5UID0gXCJkYXRhLXBoeC1jb21wb25lbnRcIlxuZXhwb3J0IGNvbnN0IFBIWF9MSVZFX0xJTksgPSBcImRhdGEtcGh4LWxpbmtcIlxuZXhwb3J0IGNvbnN0IFBIWF9UUkFDS19TVEFUSUMgPSBcInRyYWNrLXN0YXRpY1wiXG5leHBvcnQgY29uc3QgUEhYX0xJTktfU1RBVEUgPSBcImRhdGEtcGh4LWxpbmstc3RhdGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9SRUYgPSBcImRhdGEtcGh4LXJlZlwiXG5leHBvcnQgY29uc3QgUEhYX1RSQUNLX1VQTE9BRFMgPSBcInRyYWNrLXVwbG9hZHNcIlxuZXhwb3J0IGNvbnN0IFBIWF9VUExPQURfUkVGID0gXCJkYXRhLXBoeC11cGxvYWQtcmVmXCJcbmV4cG9ydCBjb25zdCBQSFhfUFJFRkxJR0hURURfUkVGUyA9IFwiZGF0YS1waHgtcHJlZmxpZ2h0ZWQtcmVmc1wiXG5leHBvcnQgY29uc3QgUEhYX0RPTkVfUkVGUyA9IFwiZGF0YS1waHgtZG9uZS1yZWZzXCJcbmV4cG9ydCBjb25zdCBQSFhfRFJPUF9UQVJHRVQgPSBcImRyb3AtdGFyZ2V0XCJcbmV4cG9ydCBjb25zdCBQSFhfQUNUSVZFX0VOVFJZX1JFRlMgPSBcImRhdGEtcGh4LWFjdGl2ZS1yZWZzXCJcbmV4cG9ydCBjb25zdCBQSFhfTElWRV9GSUxFX1VQREFURUQgPSBcInBoeDpsaXZlLWZpbGU6dXBkYXRlZFwiXG5leHBvcnQgY29uc3QgUEhYX1NLSVAgPSBcImRhdGEtcGh4LXNraXBcIlxuZXhwb3J0IGNvbnN0IFBIWF9QUlVORSA9IFwiZGF0YS1waHgtcHJ1bmVcIlxuZXhwb3J0IGNvbnN0IFBIWF9QQUdFX0xPQURJTkcgPSBcInBhZ2UtbG9hZGluZ1wiXG5leHBvcnQgY29uc3QgUEhYX0NPTk5FQ1RFRF9DTEFTUyA9IFwicGh4LWNvbm5lY3RlZFwiXG5leHBvcnQgY29uc3QgUEhYX0RJU0NPTk5FQ1RFRF9DTEFTUyA9IFwicGh4LWxvYWRpbmdcIlxuZXhwb3J0IGNvbnN0IFBIWF9OT19GRUVEQkFDS19DTEFTUyA9IFwicGh4LW5vLWZlZWRiYWNrXCJcbmV4cG9ydCBjb25zdCBQSFhfRVJST1JfQ0xBU1MgPSBcInBoeC1lcnJvclwiXG5leHBvcnQgY29uc3QgUEhYX1BBUkVOVF9JRCA9IFwiZGF0YS1waHgtcGFyZW50LWlkXCJcbmV4cG9ydCBjb25zdCBQSFhfTUFJTiA9IFwiZGF0YS1waHgtbWFpblwiXG5leHBvcnQgY29uc3QgUEhYX1JPT1RfSUQgPSBcImRhdGEtcGh4LXJvb3QtaWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9UUklHR0VSX0FDVElPTiA9IFwidHJpZ2dlci1hY3Rpb25cIlxuZXhwb3J0IGNvbnN0IFBIWF9GRUVEQkFDS19GT1IgPSBcImZlZWRiYWNrLWZvclwiXG5leHBvcnQgY29uc3QgUEhYX0hBU19GT0NVU0VEID0gXCJwaHgtaGFzLWZvY3VzZWRcIlxuZXhwb3J0IGNvbnN0IEZPQ1VTQUJMRV9JTlBVVFMgPSBbXCJ0ZXh0XCIsIFwidGV4dGFyZWFcIiwgXCJudW1iZXJcIiwgXCJlbWFpbFwiLCBcInBhc3N3b3JkXCIsIFwic2VhcmNoXCIsIFwidGVsXCIsIFwidXJsXCIsIFwiZGF0ZVwiLCBcInRpbWVcIl1cbmV4cG9ydCBjb25zdCBDSEVDS0FCTEVfSU5QVVRTID0gW1wiY2hlY2tib3hcIiwgXCJyYWRpb1wiXVxuZXhwb3J0IGNvbnN0IFBIWF9IQVNfU1VCTUlUVEVEID0gXCJwaHgtaGFzLXN1Ym1pdHRlZFwiXG5leHBvcnQgY29uc3QgUEhYX1NFU1NJT04gPSBcImRhdGEtcGh4LXNlc3Npb25cIlxuZXhwb3J0IGNvbnN0IFBIWF9WSUVXX1NFTEVDVE9SID0gYFske1BIWF9TRVNTSU9OfV1gXG5leHBvcnQgY29uc3QgUEhYX1NUQVRJQyA9IFwiZGF0YS1waHgtc3RhdGljXCJcbmV4cG9ydCBjb25zdCBQSFhfUkVBRE9OTFkgPSBcImRhdGEtcGh4LXJlYWRvbmx5XCJcbmV4cG9ydCBjb25zdCBQSFhfRElTQUJMRUQgPSBcImRhdGEtcGh4LWRpc2FibGVkXCJcbmV4cG9ydCBjb25zdCBQSFhfRElTQUJMRV9XSVRIID0gXCJkaXNhYmxlLXdpdGhcIlxuZXhwb3J0IGNvbnN0IFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRSA9IFwiZGF0YS1waHgtZGlzYWJsZS13aXRoLXJlc3RvcmVcIlxuZXhwb3J0IGNvbnN0IFBIWF9IT09LID0gXCJob29rXCJcbmV4cG9ydCBjb25zdCBQSFhfREVCT1VOQ0UgPSBcImRlYm91bmNlXCJcbmV4cG9ydCBjb25zdCBQSFhfVEhST1RUTEUgPSBcInRocm90dGxlXCJcbmV4cG9ydCBjb25zdCBQSFhfVVBEQVRFID0gXCJ1cGRhdGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9LRVkgPSBcImtleVwiXG5leHBvcnQgY29uc3QgUEhYX1BSSVZBVEUgPSBcInBoeFByaXZhdGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9BVVRPX1JFQ09WRVIgPSBcImF1dG8tcmVjb3ZlclwiXG5leHBvcnQgY29uc3QgUEhYX0xWX0RFQlVHID0gXCJwaHg6bGl2ZS1zb2NrZXQ6ZGVidWdcIlxuZXhwb3J0IGNvbnN0IFBIWF9MVl9QUk9GSUxFID0gXCJwaHg6bGl2ZS1zb2NrZXQ6cHJvZmlsaW5nXCJcbmV4cG9ydCBjb25zdCBQSFhfTFZfTEFURU5DWV9TSU0gPSBcInBoeDpsaXZlLXNvY2tldDpsYXRlbmN5LXNpbVwiXG5leHBvcnQgY29uc3QgUEhYX1BST0dSRVNTID0gXCJwcm9ncmVzc1wiXG5leHBvcnQgY29uc3QgTE9BREVSX1RJTUVPVVQgPSAxXG5leHBvcnQgY29uc3QgQkVGT1JFX1VOTE9BRF9MT0FERVJfVElNRU9VVCA9IDIwMFxuZXhwb3J0IGNvbnN0IEJJTkRJTkdfUFJFRklYID0gXCJwaHgtXCJcbmV4cG9ydCBjb25zdCBQVVNIX1RJTUVPVVQgPSAzMDAwMFxuZXhwb3J0IGNvbnN0IExJTktfSEVBREVSID0gXCJ4LXJlcXVlc3RlZC13aXRoXCJcbmV4cG9ydCBjb25zdCBSRVNQT05TRV9VUkxfSEVBREVSID0gXCJ4LXJlc3BvbnNlLXVybFwiXG5leHBvcnQgY29uc3QgREVCT1VOQ0VfVFJJR0dFUiA9IFwiZGVib3VuY2UtdHJpZ2dlclwiXG5leHBvcnQgY29uc3QgVEhST1RUTEVEID0gXCJ0aHJvdHRsZWRcIlxuZXhwb3J0IGNvbnN0IERFQk9VTkNFX1BSRVZfS0VZID0gXCJkZWJvdW5jZS1wcmV2LWtleVwiXG5leHBvcnQgY29uc3QgREVGQVVMVFMgPSB7XG4gIGRlYm91bmNlOiAzMDAsXG4gIHRocm90dGxlOiAzMDBcbn1cblxuLy8gUmVuZGVyZWRcbmV4cG9ydCBjb25zdCBEWU5BTUlDUyA9IFwiZFwiXG5leHBvcnQgY29uc3QgU1RBVElDID0gXCJzXCJcbmV4cG9ydCBjb25zdCBDT01QT05FTlRTID0gXCJjXCJcbmV4cG9ydCBjb25zdCBFVkVOVFMgPSBcImVcIlxuZXhwb3J0IGNvbnN0IFJFUExZID0gXCJyXCJcbmV4cG9ydCBjb25zdCBUSVRMRSA9IFwidFwiXG5leHBvcnQgY29uc3QgVEVNUExBVEVTID0gXCJwXCJcbiIsICJpbXBvcnQge1xuICBsb2dFcnJvclxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVudHJ5VXBsb2FkZXIge1xuICBjb25zdHJ1Y3RvcihlbnRyeSwgY2h1bmtTaXplLCBsaXZlU29ja2V0KXtcbiAgICB0aGlzLmxpdmVTb2NrZXQgPSBsaXZlU29ja2V0XG4gICAgdGhpcy5lbnRyeSA9IGVudHJ5XG4gICAgdGhpcy5vZmZzZXQgPSAwXG4gICAgdGhpcy5jaHVua1NpemUgPSBjaHVua1NpemVcbiAgICB0aGlzLmNodW5rVGltZXIgPSBudWxsXG4gICAgdGhpcy51cGxvYWRDaGFubmVsID0gbGl2ZVNvY2tldC5jaGFubmVsKGBsdnU6JHtlbnRyeS5yZWZ9YCwge3Rva2VuOiBlbnRyeS5tZXRhZGF0YSgpfSlcbiAgfVxuXG4gIGVycm9yKHJlYXNvbil7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuY2h1bmtUaW1lcilcbiAgICB0aGlzLnVwbG9hZENoYW5uZWwubGVhdmUoKVxuICAgIHRoaXMuZW50cnkuZXJyb3IocmVhc29uKVxuICB9XG5cbiAgdXBsb2FkKCl7XG4gICAgdGhpcy51cGxvYWRDaGFubmVsLm9uRXJyb3IocmVhc29uID0+IHRoaXMuZXJyb3IocmVhc29uKSlcbiAgICB0aGlzLnVwbG9hZENoYW5uZWwuam9pbigpXG4gICAgICAucmVjZWl2ZShcIm9rXCIsIF9kYXRhID0+IHRoaXMucmVhZE5leHRDaHVuaygpKVxuICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCByZWFzb24gPT4gdGhpcy5lcnJvcihyZWFzb24pKVxuICB9XG5cbiAgaXNEb25lKCl7IHJldHVybiB0aGlzLm9mZnNldCA+PSB0aGlzLmVudHJ5LmZpbGUuc2l6ZSB9XG5cbiAgcmVhZE5leHRDaHVuaygpe1xuICAgIGxldCByZWFkZXIgPSBuZXcgd2luZG93LkZpbGVSZWFkZXIoKVxuICAgIGxldCBibG9iID0gdGhpcy5lbnRyeS5maWxlLnNsaWNlKHRoaXMub2Zmc2V0LCB0aGlzLmNodW5rU2l6ZSArIHRoaXMub2Zmc2V0KVxuICAgIHJlYWRlci5vbmxvYWQgPSAoZSkgPT4ge1xuICAgICAgaWYoZS50YXJnZXQuZXJyb3IgPT09IG51bGwpe1xuICAgICAgICB0aGlzLm9mZnNldCArPSBlLnRhcmdldC5yZXN1bHQuYnl0ZUxlbmd0aFxuICAgICAgICB0aGlzLnB1c2hDaHVuayhlLnRhcmdldC5yZXN1bHQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbG9nRXJyb3IoXCJSZWFkIGVycm9yOiBcIiArIGUudGFyZ2V0LmVycm9yKVxuICAgICAgfVxuICAgIH1cbiAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYilcbiAgfVxuXG4gIHB1c2hDaHVuayhjaHVuayl7XG4gICAgaWYoIXRoaXMudXBsb2FkQ2hhbm5lbC5pc0pvaW5lZCgpKXsgcmV0dXJuIH1cbiAgICB0aGlzLnVwbG9hZENoYW5uZWwucHVzaChcImNodW5rXCIsIGNodW5rKVxuICAgICAgLnJlY2VpdmUoXCJva1wiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW50cnkucHJvZ3Jlc3MoKHRoaXMub2Zmc2V0IC8gdGhpcy5lbnRyeS5maWxlLnNpemUpICogMTAwKVxuICAgICAgICBpZighdGhpcy5pc0RvbmUoKSl7XG4gICAgICAgICAgdGhpcy5jaHVua1RpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlYWROZXh0Q2h1bmsoKSwgdGhpcy5saXZlU29ja2V0LmdldExhdGVuY3lTaW0oKSB8fCAwKVxuICAgICAgICB9XG4gICAgICB9KVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgUEhYX1ZJRVdfU0VMRUNUT1Jcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IEVudHJ5VXBsb2FkZXIgZnJvbSBcIi4vZW50cnlfdXBsb2FkZXJcIlxuXG5leHBvcnQgbGV0IGxvZ0Vycm9yID0gKG1zZywgb2JqKSA9PiBjb25zb2xlLmVycm9yICYmIGNvbnNvbGUuZXJyb3IobXNnLCBvYmopXG5cbmV4cG9ydCBsZXQgaXNDaWQgPSAoY2lkKSA9PiB7XG4gIGxldCB0eXBlID0gdHlwZW9mKGNpZClcbiAgcmV0dXJuIHR5cGUgPT09IFwibnVtYmVyXCIgfHwgKHR5cGUgPT09IFwic3RyaW5nXCIgJiYgL14oMHxbMS05XVxcZCopJC8udGVzdChjaWQpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0RHVwbGljYXRlSWRzKCl7XG4gIGxldCBpZHMgPSBuZXcgU2V0KClcbiAgbGV0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIipbaWRdXCIpXG4gIGZvcihsZXQgaSA9IDAsIGxlbiA9IGVsZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcbiAgICBpZihpZHMuaGFzKGVsZW1zW2ldLmlkKSl7XG4gICAgICBjb25zb2xlLmVycm9yKGBNdWx0aXBsZSBJRHMgZGV0ZWN0ZWQ6ICR7ZWxlbXNbaV0uaWR9LiBFbnN1cmUgdW5pcXVlIGVsZW1lbnQgaWRzLmApXG4gICAgfSBlbHNlIHtcbiAgICAgIGlkcy5hZGQoZWxlbXNbaV0uaWQpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBsZXQgZGVidWcgPSAodmlldywga2luZCwgbXNnLCBvYmopID0+IHtcbiAgaWYodmlldy5saXZlU29ja2V0LmlzRGVidWdFbmFibGVkKCkpe1xuICAgIGNvbnNvbGUubG9nKGAke3ZpZXcuaWR9ICR7a2luZH06ICR7bXNnfSAtIGAsIG9iailcbiAgfVxufVxuXG4vLyB3cmFwcyB2YWx1ZSBpbiBjbG9zdXJlIG9yIHJldHVybnMgY2xvc3VyZVxuZXhwb3J0IGxldCBjbG9zdXJlID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gXCJmdW5jdGlvblwiID8gdmFsIDogZnVuY3Rpb24gKCl7IHJldHVybiB2YWwgfVxuXG5leHBvcnQgbGV0IGNsb25lID0gKG9iaikgPT4geyByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKSB9XG5cbmV4cG9ydCBsZXQgY2xvc2VzdFBoeEJpbmRpbmcgPSAoZWwsIGJpbmRpbmcsIGJvcmRlckVsKSA9PiB7XG4gIGRvIHtcbiAgICBpZihlbC5tYXRjaGVzKGBbJHtiaW5kaW5nfV1gKSl7IHJldHVybiBlbCB9XG4gICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50IHx8IGVsLnBhcmVudE5vZGVcbiAgfSB3aGlsZShlbCAhPT0gbnVsbCAmJiBlbC5ub2RlVHlwZSA9PT0gMSAmJiAhKChib3JkZXJFbCAmJiBib3JkZXJFbC5pc1NhbWVOb2RlKGVsKSkgfHwgZWwubWF0Y2hlcyhQSFhfVklFV19TRUxFQ1RPUikpKVxuICByZXR1cm4gbnVsbFxufVxuXG5leHBvcnQgbGV0IGlzT2JqZWN0ID0gKG9iaikgPT4ge1xuICByZXR1cm4gb2JqICE9PSBudWxsICYmIHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIgJiYgIShvYmogaW5zdGFuY2VvZiBBcnJheSlcbn1cblxuZXhwb3J0IGxldCBpc0VxdWFsT2JqID0gKG9iajEsIG9iajIpID0+IEpTT04uc3RyaW5naWZ5KG9iajEpID09PSBKU09OLnN0cmluZ2lmeShvYmoyKVxuXG5leHBvcnQgbGV0IGlzRW1wdHkgPSAob2JqKSA9PiB7XG4gIGZvcihsZXQgeCBpbiBvYmopeyByZXR1cm4gZmFsc2UgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG5leHBvcnQgbGV0IG1heWJlID0gKGVsLCBjYWxsYmFjaykgPT4gZWwgJiYgY2FsbGJhY2soZWwpXG5cbmV4cG9ydCBsZXQgY2hhbm5lbFVwbG9hZGVyID0gZnVuY3Rpb24gKGVudHJpZXMsIG9uRXJyb3IsIHJlc3AsIGxpdmVTb2NrZXQpe1xuICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgIGxldCBlbnRyeVVwbG9hZGVyID0gbmV3IEVudHJ5VXBsb2FkZXIoZW50cnksIHJlc3AuY29uZmlnLmNodW5rX3NpemUsIGxpdmVTb2NrZXQpXG4gICAgZW50cnlVcGxvYWRlci51cGxvYWQoKVxuICB9KVxufVxuIiwgImxldCBCcm93c2VyID0ge1xuICBjYW5QdXNoU3RhdGUoKXsgcmV0dXJuICh0eXBlb2YgKGhpc3RvcnkucHVzaFN0YXRlKSAhPT0gXCJ1bmRlZmluZWRcIikgfSxcblxuICBkcm9wTG9jYWwobG9jYWxTdG9yYWdlLCBuYW1lc3BhY2UsIHN1YmtleSl7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpKVxuICB9LFxuXG4gIHVwZGF0ZUxvY2FsKGxvY2FsU3RvcmFnZSwgbmFtZXNwYWNlLCBzdWJrZXksIGluaXRpYWwsIGZ1bmMpe1xuICAgIGxldCBjdXJyZW50ID0gdGhpcy5nZXRMb2NhbChsb2NhbFN0b3JhZ2UsIG5hbWVzcGFjZSwgc3Via2V5KVxuICAgIGxldCBrZXkgPSB0aGlzLmxvY2FsS2V5KG5hbWVzcGFjZSwgc3Via2V5KVxuICAgIGxldCBuZXdWYWwgPSBjdXJyZW50ID09PSBudWxsID8gaW5pdGlhbCA6IGZ1bmMoY3VycmVudClcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KG5ld1ZhbCkpXG4gICAgcmV0dXJuIG5ld1ZhbFxuICB9LFxuXG4gIGdldExvY2FsKGxvY2FsU3RvcmFnZSwgbmFtZXNwYWNlLCBzdWJrZXkpe1xuICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpKSlcbiAgfSxcblxuICB1cGRhdGVDdXJyZW50U3RhdGUoY2FsbGJhY2spe1xuICAgIGlmKCF0aGlzLmNhblB1c2hTdGF0ZSgpKXsgcmV0dXJuIH1cbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShjYWxsYmFjayhoaXN0b3J5LnN0YXRlIHx8IHt9KSwgXCJcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpXG4gIH0sXG5cbiAgcHVzaFN0YXRlKGtpbmQsIG1ldGEsIHRvKXtcbiAgICBpZih0aGlzLmNhblB1c2hTdGF0ZSgpKXtcbiAgICAgIGlmKHRvICE9PSB3aW5kb3cubG9jYXRpb24uaHJlZil7XG4gICAgICAgIGlmKG1ldGEudHlwZSA9PSBcInJlZGlyZWN0XCIgJiYgbWV0YS5zY3JvbGwpe1xuICAgICAgICAgIC8vIElmIHdlJ3JlIHJlZGlyZWN0aW5nIHN0b3JlIHRoZSBjdXJyZW50IHNjcm9sbFkgZm9yIHRoZSBjdXJyZW50IGhpc3Rvcnkgc3RhdGUuXG4gICAgICAgICAgbGV0IGN1cnJlbnRTdGF0ZSA9IGhpc3Rvcnkuc3RhdGUgfHwge31cbiAgICAgICAgICBjdXJyZW50U3RhdGUuc2Nyb2xsID0gbWV0YS5zY3JvbGxcbiAgICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShjdXJyZW50U3RhdGUsIFwiXCIsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKVxuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIG1ldGEuc2Nyb2xsIC8vIE9ubHkgc3RvcmUgdGhlIHNjcm9sbCBpbiB0aGUgcmVkaXJlY3QgY2FzZS5cbiAgICAgICAgaGlzdG9yeVtraW5kICsgXCJTdGF0ZVwiXShtZXRhLCBcIlwiLCB0byB8fCBudWxsKSAvLyBJRSB3aWxsIGNvZXJjZSB1bmRlZmluZWQgdG8gc3RyaW5nXG4gICAgICAgIGxldCBoYXNoRWwgPSB0aGlzLmdldEhhc2hUYXJnZXRFbCh3aW5kb3cubG9jYXRpb24uaGFzaClcblxuICAgICAgICBpZihoYXNoRWwpe1xuICAgICAgICAgIGhhc2hFbC5zY3JvbGxJbnRvVmlldygpXG4gICAgICAgIH0gZWxzZSBpZihtZXRhLnR5cGUgPT09IFwicmVkaXJlY3RcIil7XG4gICAgICAgICAgd2luZG93LnNjcm9sbCgwLCAwKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVkaXJlY3QodG8pXG4gICAgfVxuICB9LFxuXG4gIHNldENvb2tpZShuYW1lLCB2YWx1ZSl7XG4gICAgZG9jdW1lbnQuY29va2llID0gYCR7bmFtZX09JHt2YWx1ZX1gXG4gIH0sXG5cbiAgZ2V0Q29va2llKG5hbWUpe1xuICAgIHJldHVybiBkb2N1bWVudC5jb29raWUucmVwbGFjZShuZXcgUmVnRXhwKGAoPzooPzpefC4qO1xccyopJHtuYW1lfVxccypcXD1cXHMqKFteO10qKS4qJCl8Xi4qJGApLCBcIiQxXCIpXG4gIH0sXG5cbiAgcmVkaXJlY3QodG9VUkwsIGZsYXNoKXtcbiAgICBpZihmbGFzaCl7IEJyb3dzZXIuc2V0Q29va2llKFwiX19waG9lbml4X2ZsYXNoX19cIiwgZmxhc2ggKyBcIjsgbWF4LWFnZT02MDAwMDsgcGF0aD0vXCIpIH1cbiAgICB3aW5kb3cubG9jYXRpb24gPSB0b1VSTFxuICB9LFxuXG4gIGxvY2FsS2V5KG5hbWVzcGFjZSwgc3Via2V5KXsgcmV0dXJuIGAke25hbWVzcGFjZX0tJHtzdWJrZXl9YCB9LFxuXG4gIGdldEhhc2hUYXJnZXRFbChtYXliZUhhc2gpe1xuICAgIGxldCBoYXNoID0gbWF5YmVIYXNoLnRvU3RyaW5nKCkuc3Vic3RyaW5nKDEpXG4gICAgaWYoaGFzaCA9PT0gXCJcIil7IHJldHVybiB9XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGhhc2gpIHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGFbbmFtZT1cIiR7aGFzaH1cIl1gKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJyb3dzZXJcbiIsICJpbXBvcnQge1xuICBDSEVDS0FCTEVfSU5QVVRTLFxuICBERUJPVU5DRV9QUkVWX0tFWSxcbiAgREVCT1VOQ0VfVFJJR0dFUixcbiAgRk9DVVNBQkxFX0lOUFVUUyxcbiAgUEhYX0NPTVBPTkVOVCxcbiAgUEhYX0VWRU5UX0NMQVNTRVMsXG4gIFBIWF9IQVNfRk9DVVNFRCxcbiAgUEhYX0hBU19TVUJNSVRURUQsXG4gIFBIWF9NQUlOLFxuICBQSFhfTk9fRkVFREJBQ0tfQ0xBU1MsXG4gIFBIWF9QQVJFTlRfSUQsXG4gIFBIWF9QUklWQVRFLFxuICBQSFhfUkVGLFxuICBQSFhfUk9PVF9JRCxcbiAgUEhYX1NFU1NJT04sXG4gIFBIWF9TVEFUSUMsXG4gIFBIWF9VUExPQURfUkVGLFxuICBQSFhfVklFV19TRUxFQ1RPUixcbiAgVEhST1RUTEVEXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGxvZ0Vycm9yXG59IGZyb20gXCIuL3V0aWxzXCJcblxubGV0IERPTSA9IHtcbiAgYnlJZChpZCl7IHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgfHwgbG9nRXJyb3IoYG5vIGlkIGZvdW5kIGZvciAke2lkfWApIH0sXG5cbiAgcmVtb3ZlQ2xhc3MoZWwsIGNsYXNzTmFtZSl7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpXG4gICAgaWYoZWwuY2xhc3NMaXN0Lmxlbmd0aCA9PT0gMCl7IGVsLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpIH1cbiAgfSxcblxuICBhbGwobm9kZSwgcXVlcnksIGNhbGxiYWNrKXtcbiAgICBpZighbm9kZSl7IHJldHVybiBbXSB9XG4gICAgbGV0IGFycmF5ID0gQXJyYXkuZnJvbShub2RlLnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpKVxuICAgIHJldHVybiBjYWxsYmFjayA/IGFycmF5LmZvckVhY2goY2FsbGJhY2spIDogYXJyYXlcbiAgfSxcblxuICBjaGlsZE5vZGVMZW5ndGgoaHRtbCl7XG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkRWxlbWVudENvdW50XG4gIH0sXG5cbiAgaXNVcGxvYWRJbnB1dChlbCl7IHJldHVybiBlbC50eXBlID09PSBcImZpbGVcIiAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpICE9PSBudWxsIH0sXG5cbiAgZmluZFVwbG9hZElucHV0cyhub2RlKXsgcmV0dXJuIHRoaXMuYWxsKG5vZGUsIGBpbnB1dFt0eXBlPVwiZmlsZVwiXVske1BIWF9VUExPQURfUkVGfV1gKSB9LFxuXG4gIGZpbmRDb21wb25lbnROb2RlTGlzdChub2RlLCBjaWQpe1xuICAgIHJldHVybiB0aGlzLmZpbHRlcldpdGhpblNhbWVMaXZlVmlldyh0aGlzLmFsbChub2RlLCBgWyR7UEhYX0NPTVBPTkVOVH09XCIke2NpZH1cIl1gKSwgbm9kZSlcbiAgfSxcblxuICBpc1BoeERlc3Ryb3llZChub2RlKXtcbiAgICByZXR1cm4gbm9kZS5pZCAmJiBET00ucHJpdmF0ZShub2RlLCBcImRlc3Ryb3llZFwiKSA/IHRydWUgOiBmYWxzZVxuICB9LFxuXG4gIG1hcmtQaHhDaGlsZERlc3Ryb3llZChlbCl7XG4gICAgaWYodGhpcy5pc1BoeENoaWxkKGVsKSl7IGVsLnNldEF0dHJpYnV0ZShQSFhfU0VTU0lPTiwgXCJcIikgfVxuICAgIHRoaXMucHV0UHJpdmF0ZShlbCwgXCJkZXN0cm95ZWRcIiwgdHJ1ZSlcbiAgfSxcblxuICBmaW5kUGh4Q2hpbGRyZW5JbkZyYWdtZW50KGh0bWwsIHBhcmVudElkKXtcbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIilcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBodG1sXG4gICAgcmV0dXJuIHRoaXMuZmluZFBoeENoaWxkcmVuKHRlbXBsYXRlLmNvbnRlbnQsIHBhcmVudElkKVxuICB9LFxuXG4gIGlzSWdub3JlZChlbCwgcGh4VXBkYXRlKXtcbiAgICByZXR1cm4gKGVsLmdldEF0dHJpYnV0ZShwaHhVcGRhdGUpIHx8IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGh4LXVwZGF0ZVwiKSkgPT09IFwiaWdub3JlXCJcbiAgfSxcblxuICBpc1BoeFVwZGF0ZShlbCwgcGh4VXBkYXRlLCB1cGRhdGVUeXBlcyl7XG4gICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSAmJiB1cGRhdGVUeXBlcy5pbmRleE9mKGVsLmdldEF0dHJpYnV0ZShwaHhVcGRhdGUpKSA+PSAwXG4gIH0sXG5cbiAgZmluZFBoeENoaWxkcmVuKGVsLCBwYXJlbnRJZCl7XG4gICAgcmV0dXJuIHRoaXMuYWxsKGVsLCBgJHtQSFhfVklFV19TRUxFQ1RPUn1bJHtQSFhfUEFSRU5UX0lEfT1cIiR7cGFyZW50SWR9XCJdYClcbiAgfSxcblxuICBmaW5kUGFyZW50Q0lEcyhub2RlLCBjaWRzKXtcbiAgICBsZXQgaW5pdGlhbCA9IG5ldyBTZXQoY2lkcylcbiAgICByZXR1cm4gY2lkcy5yZWR1Y2UoKGFjYywgY2lkKSA9PiB7XG4gICAgICBsZXQgc2VsZWN0b3IgPSBgWyR7UEhYX0NPTVBPTkVOVH09XCIke2NpZH1cIl0gWyR7UEhYX0NPTVBPTkVOVH1dYFxuXG4gICAgICB0aGlzLmZpbHRlcldpdGhpblNhbWVMaXZlVmlldyh0aGlzLmFsbChub2RlLCBzZWxlY3RvciksIG5vZGUpXG4gICAgICAgIC5tYXAoZWwgPT4gcGFyc2VJbnQoZWwuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpKSlcbiAgICAgICAgLmZvckVhY2goY2hpbGRDSUQgPT4gYWNjLmRlbGV0ZShjaGlsZENJRCkpXG5cbiAgICAgIHJldHVybiBhY2NcbiAgICB9LCBpbml0aWFsKVxuICB9LFxuXG4gIGZpbHRlcldpdGhpblNhbWVMaXZlVmlldyhub2RlcywgcGFyZW50KXtcbiAgICBpZihwYXJlbnQucXVlcnlTZWxlY3RvcihQSFhfVklFV19TRUxFQ1RPUikpe1xuICAgICAgcmV0dXJuIG5vZGVzLmZpbHRlcihlbCA9PiB0aGlzLndpdGhpblNhbWVMaXZlVmlldyhlbCwgcGFyZW50KSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5vZGVzXG4gICAgfVxuICB9LFxuXG4gIHdpdGhpblNhbWVMaXZlVmlldyhub2RlLCBwYXJlbnQpe1xuICAgIHdoaWxlKG5vZGUgPSBub2RlLnBhcmVudE5vZGUpe1xuICAgICAgaWYobm9kZS5pc1NhbWVOb2RlKHBhcmVudCkpeyByZXR1cm4gdHJ1ZSB9XG4gICAgICBpZihub2RlLmdldEF0dHJpYnV0ZShQSFhfU0VTU0lPTikgIT09IG51bGwpeyByZXR1cm4gZmFsc2UgfVxuICAgIH1cbiAgfSxcblxuICBwcml2YXRlKGVsLCBrZXkpeyByZXR1cm4gZWxbUEhYX1BSSVZBVEVdICYmIGVsW1BIWF9QUklWQVRFXVtrZXldIH0sXG5cbiAgZGVsZXRlUHJpdmF0ZShlbCwga2V5KXsgZWxbUEhYX1BSSVZBVEVdICYmIGRlbGV0ZSAoZWxbUEhYX1BSSVZBVEVdW2tleV0pIH0sXG5cbiAgcHV0UHJpdmF0ZShlbCwga2V5LCB2YWx1ZSl7XG4gICAgaWYoIWVsW1BIWF9QUklWQVRFXSl7IGVsW1BIWF9QUklWQVRFXSA9IHt9IH1cbiAgICBlbFtQSFhfUFJJVkFURV1ba2V5XSA9IHZhbHVlXG4gIH0sXG5cbiAgdXBkYXRlUHJpdmF0ZShlbCwga2V5LCBkZWZhdWx0VmFsLCB1cGRhdGVGdW5jKXtcbiAgICBsZXQgZXhpc3RpbmcgPSB0aGlzLnByaXZhdGUoZWwsIGtleSlcbiAgICBpZihleGlzdGluZyA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIHRoaXMucHV0UHJpdmF0ZShlbCwga2V5LCB1cGRhdGVGdW5jKGRlZmF1bHRWYWwpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnB1dFByaXZhdGUoZWwsIGtleSwgdXBkYXRlRnVuYyhleGlzdGluZykpXG4gICAgfVxuICB9LFxuXG4gIGNvcHlQcml2YXRlcyh0YXJnZXQsIHNvdXJjZSl7XG4gICAgaWYoc291cmNlW1BIWF9QUklWQVRFXSl7XG4gICAgICB0YXJnZXRbUEhYX1BSSVZBVEVdID0gc291cmNlW1BIWF9QUklWQVRFXVxuICAgIH1cbiAgfSxcblxuICBwdXRUaXRsZShzdHIpe1xuICAgIGxldCB0aXRsZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRpdGxlXCIpXG4gICAgbGV0IHtwcmVmaXgsIHN1ZmZpeH0gPSB0aXRsZUVsLmRhdGFzZXRcbiAgICBkb2N1bWVudC50aXRsZSA9IGAke3ByZWZpeCB8fCBcIlwifSR7c3RyfSR7c3VmZml4IHx8IFwiXCJ9YFxuICB9LFxuXG4gIGRlYm91bmNlKGVsLCBldmVudCwgcGh4RGVib3VuY2UsIGRlZmF1bHREZWJvdW5jZSwgcGh4VGhyb3R0bGUsIGRlZmF1bHRUaHJvdHRsZSwgY2FsbGJhY2spe1xuICAgIGxldCBkZWJvdW5jZSA9IGVsLmdldEF0dHJpYnV0ZShwaHhEZWJvdW5jZSlcbiAgICBsZXQgdGhyb3R0bGUgPSBlbC5nZXRBdHRyaWJ1dGUocGh4VGhyb3R0bGUpXG4gICAgaWYoZGVib3VuY2UgPT09IFwiXCIpeyBkZWJvdW5jZSA9IGRlZmF1bHREZWJvdW5jZSB9XG4gICAgaWYodGhyb3R0bGUgPT09IFwiXCIpeyB0aHJvdHRsZSA9IGRlZmF1bHRUaHJvdHRsZSB9XG4gICAgbGV0IHZhbHVlID0gZGVib3VuY2UgfHwgdGhyb3R0bGVcbiAgICBzd2l0Y2godmFsdWUpe1xuICAgICAgY2FzZSBudWxsOiByZXR1cm4gY2FsbGJhY2soKVxuXG4gICAgICBjYXNlIFwiYmx1clwiOlxuICAgICAgICBpZih0aGlzLm9uY2UoZWwsIFwiZGVib3VuY2UtYmx1clwiKSl7XG4gICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgKCkgPT4gY2FsbGJhY2soKSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGV0IHRpbWVvdXQgPSBwYXJzZUludCh2YWx1ZSlcbiAgICAgICAgbGV0IHRyaWdnZXIgPSAoKSA9PiB0aHJvdHRsZSA/IHRoaXMuZGVsZXRlUHJpdmF0ZShlbCwgVEhST1RUTEVEKSA6IGNhbGxiYWNrKClcbiAgICAgICAgbGV0IGN1cnJlbnRDeWNsZSA9IHRoaXMuaW5jQ3ljbGUoZWwsIERFQk9VTkNFX1RSSUdHRVIsIHRyaWdnZXIpXG4gICAgICAgIGlmKGlzTmFOKHRpbWVvdXQpKXsgcmV0dXJuIGxvZ0Vycm9yKGBpbnZhbGlkIHRocm90dGxlL2RlYm91bmNlIHZhbHVlOiAke3ZhbHVlfWApIH1cbiAgICAgICAgaWYodGhyb3R0bGUpe1xuICAgICAgICAgIGxldCBuZXdLZXlEb3duID0gZmFsc2VcbiAgICAgICAgICBpZihldmVudC50eXBlID09PSBcImtleWRvd25cIil7XG4gICAgICAgICAgICBsZXQgcHJldktleSA9IHRoaXMucHJpdmF0ZShlbCwgREVCT1VOQ0VfUFJFVl9LRVkpXG4gICAgICAgICAgICB0aGlzLnB1dFByaXZhdGUoZWwsIERFQk9VTkNFX1BSRVZfS0VZLCBldmVudC5rZXkpXG4gICAgICAgICAgICBuZXdLZXlEb3duID0gcHJldktleSAhPT0gZXZlbnQua2V5XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYoIW5ld0tleURvd24gJiYgdGhpcy5wcml2YXRlKGVsLCBUSFJPVFRMRUQpKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgICAgICB0aGlzLnB1dFByaXZhdGUoZWwsIFRIUk9UVExFRCwgdHJ1ZSlcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy50cmlnZ2VyQ3ljbGUoZWwsIERFQk9VTkNFX1RSSUdHRVIpLCB0aW1lb3V0KVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudHJpZ2dlckN5Y2xlKGVsLCBERUJPVU5DRV9UUklHR0VSLCBjdXJyZW50Q3ljbGUpLCB0aW1lb3V0KVxuICAgICAgICB9XG5cblxuICAgICAgICBsZXQgZm9ybSA9IGVsLmZvcm1cbiAgICAgICAgaWYoZm9ybSAmJiB0aGlzLm9uY2UoZm9ybSwgXCJiaW5kLWRlYm91bmNlXCIpKXtcbiAgICAgICAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgQXJyYXkuZnJvbSgobmV3IEZvcm1EYXRhKGZvcm0pKS5lbnRyaWVzKCksIChbbmFtZV0pID0+IHtcbiAgICAgICAgICAgICAgbGV0IGlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKGBbbmFtZT1cIiR7bmFtZX1cIl1gKVxuICAgICAgICAgICAgICB0aGlzLmluY0N5Y2xlKGlucHV0LCBERUJPVU5DRV9UUklHR0VSKVxuICAgICAgICAgICAgICB0aGlzLmRlbGV0ZVByaXZhdGUoaW5wdXQsIFRIUk9UVExFRClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLm9uY2UoZWwsIFwiYmluZC1kZWJvdW5jZVwiKSl7XG4gICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgKCkgPT4gdGhpcy50cmlnZ2VyQ3ljbGUoZWwsIERFQk9VTkNFX1RSSUdHRVIpKVxuICAgICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHRyaWdnZXJDeWNsZShlbCwga2V5LCBjdXJyZW50Q3ljbGUpe1xuICAgIGxldCBbY3ljbGUsIHRyaWdnZXJdID0gdGhpcy5wcml2YXRlKGVsLCBrZXkpXG4gICAgaWYoIWN1cnJlbnRDeWNsZSl7IGN1cnJlbnRDeWNsZSA9IGN5Y2xlIH1cbiAgICBpZihjdXJyZW50Q3ljbGUgPT09IGN5Y2xlKXtcbiAgICAgIHRoaXMuaW5jQ3ljbGUoZWwsIGtleSlcbiAgICAgIHRyaWdnZXIoKVxuICAgIH1cbiAgfSxcblxuICBvbmNlKGVsLCBrZXkpe1xuICAgIGlmKHRoaXMucHJpdmF0ZShlbCwga2V5KSA9PT0gdHJ1ZSl7IHJldHVybiBmYWxzZSB9XG4gICAgdGhpcy5wdXRQcml2YXRlKGVsLCBrZXksIHRydWUpXG4gICAgcmV0dXJuIHRydWVcbiAgfSxcblxuICBpbmNDeWNsZShlbCwga2V5LCB0cmlnZ2VyID0gZnVuY3Rpb24gKCl7IH0pe1xuICAgIGxldCBbY3VycmVudEN5Y2xlXSA9IHRoaXMucHJpdmF0ZShlbCwga2V5KSB8fCBbMCwgdHJpZ2dlcl1cbiAgICBjdXJyZW50Q3ljbGUrK1xuICAgIHRoaXMucHV0UHJpdmF0ZShlbCwga2V5LCBbY3VycmVudEN5Y2xlLCB0cmlnZ2VyXSlcbiAgICByZXR1cm4gY3VycmVudEN5Y2xlXG4gIH0sXG5cbiAgZGlzY2FyZEVycm9yKGNvbnRhaW5lciwgZWwsIHBoeEZlZWRiYWNrRm9yKXtcbiAgICBsZXQgZmllbGQgPSBlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKHBoeEZlZWRiYWNrRm9yKVxuICAgIC8vIFRPRE86IFJlbW92ZSBpZCBsb29rdXAgYWZ0ZXIgd2UgdXBkYXRlIFBob2VuaXggdG8gdXNlIGlucHV0X25hbWUgaW5zdGVhZCBvZiBpbnB1dF9pZFxuICAgIGxldCBpbnB1dCA9IGZpZWxkICYmIGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGBbaWQ9XCIke2ZpZWxkfVwiXSwgW25hbWU9XCIke2ZpZWxkfVwiXWApXG4gICAgaWYoIWlucHV0KXsgcmV0dXJuIH1cblxuICAgIGlmKCEodGhpcy5wcml2YXRlKGlucHV0LCBQSFhfSEFTX0ZPQ1VTRUQpIHx8IHRoaXMucHJpdmF0ZShpbnB1dC5mb3JtLCBQSFhfSEFTX1NVQk1JVFRFRCkpKXtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoUEhYX05PX0ZFRURCQUNLX0NMQVNTKVxuICAgIH1cbiAgfSxcblxuICBzaG93RXJyb3IoaW5wdXRFbCwgcGh4RmVlZGJhY2tGb3Ipe1xuICAgIGlmKGlucHV0RWwuaWQgfHwgaW5wdXRFbC5uYW1lKXtcbiAgICAgIHRoaXMuYWxsKGlucHV0RWwuZm9ybSwgYFske3BoeEZlZWRiYWNrRm9yfT1cIiR7aW5wdXRFbC5pZH1cIl0sIFske3BoeEZlZWRiYWNrRm9yfT1cIiR7aW5wdXRFbC5uYW1lfVwiXWAsIChlbCkgPT4ge1xuICAgICAgICB0aGlzLnJlbW92ZUNsYXNzKGVsLCBQSFhfTk9fRkVFREJBQ0tfQ0xBU1MpXG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICBpc1BoeENoaWxkKG5vZGUpe1xuICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lEKVxuICB9LFxuXG4gIGZpcnN0UGh4Q2hpbGQoZWwpe1xuICAgIHJldHVybiB0aGlzLmlzUGh4Q2hpbGQoZWwpID8gZWwgOiB0aGlzLmFsbChlbCwgYFske1BIWF9QQVJFTlRfSUR9XWApWzBdXG4gIH0sXG5cbiAgZGlzcGF0Y2hFdmVudCh0YXJnZXQsIGV2ZW50U3RyaW5nLCBkZXRhaWwgPSB7fSl7XG4gICAgbGV0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50U3RyaW5nLCB7YnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogdHJ1ZSwgZGV0YWlsOiBkZXRhaWx9KVxuICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICB9LFxuXG4gIGNsb25lTm9kZShub2RlLCBodG1sKXtcbiAgICBpZih0eXBlb2YgKGh0bWwpID09PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgIHJldHVybiBub2RlLmNsb25lTm9kZSh0cnVlKVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgY2xvbmVkID0gbm9kZS5jbG9uZU5vZGUoZmFsc2UpXG4gICAgICBjbG9uZWQuaW5uZXJIVE1MID0gaHRtbFxuICAgICAgcmV0dXJuIGNsb25lZFxuICAgIH1cbiAgfSxcblxuICBtZXJnZUF0dHJzKHRhcmdldCwgc291cmNlLCBvcHRzID0ge30pe1xuICAgIGxldCBleGNsdWRlID0gb3B0cy5leGNsdWRlIHx8IFtdXG4gICAgbGV0IGlzSWdub3JlZCA9IG9wdHMuaXNJZ25vcmVkXG4gICAgbGV0IHNvdXJjZUF0dHJzID0gc291cmNlLmF0dHJpYnV0ZXNcbiAgICBmb3IobGV0IGkgPSBzb3VyY2VBdHRycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSl7XG4gICAgICBsZXQgbmFtZSA9IHNvdXJjZUF0dHJzW2ldLm5hbWVcbiAgICAgIGlmKGV4Y2x1ZGUuaW5kZXhPZihuYW1lKSA8IDApeyB0YXJnZXQuc2V0QXR0cmlidXRlKG5hbWUsIHNvdXJjZS5nZXRBdHRyaWJ1dGUobmFtZSkpIH1cbiAgICB9XG5cbiAgICBsZXQgdGFyZ2V0QXR0cnMgPSB0YXJnZXQuYXR0cmlidXRlc1xuICAgIGZvcihsZXQgaSA9IHRhcmdldEF0dHJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKXtcbiAgICAgIGxldCBuYW1lID0gdGFyZ2V0QXR0cnNbaV0ubmFtZVxuICAgICAgaWYoaXNJZ25vcmVkKXtcbiAgICAgICAgaWYobmFtZS5zdGFydHNXaXRoKFwiZGF0YS1cIikgJiYgIXNvdXJjZS5oYXNBdHRyaWJ1dGUobmFtZSkpeyB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKG5hbWUpIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCFzb3VyY2UuaGFzQXR0cmlidXRlKG5hbWUpKXsgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShuYW1lKSB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIG1lcmdlRm9jdXNlZElucHV0KHRhcmdldCwgc291cmNlKXtcbiAgICAvLyBza2lwIHNlbGVjdHMgYmVjYXVzZSBGRiB3aWxsIHJlc2V0IGhpZ2hsaWdodGVkIGluZGV4IGZvciBhbnkgc2V0QXR0cmlidXRlXG4gICAgaWYoISh0YXJnZXQgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCkpeyBET00ubWVyZ2VBdHRycyh0YXJnZXQsIHNvdXJjZSwge2V4Y2VwdDogW1widmFsdWVcIl19KSB9XG4gICAgaWYoc291cmNlLnJlYWRPbmx5KXtcbiAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJyZWFkb25seVwiLCB0cnVlKVxuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKFwicmVhZG9ubHlcIilcbiAgICB9XG4gIH0sXG5cbiAgaGFzU2VsZWN0aW9uUmFuZ2UoZWwpe1xuICAgIHJldHVybiBlbC5zZXRTZWxlY3Rpb25SYW5nZSAmJiAoZWwudHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZWwudHlwZSA9PT0gXCJ0ZXh0YXJlYVwiKVxuICB9LFxuXG4gIHJlc3RvcmVGb2N1cyhmb2N1c2VkLCBzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKXtcbiAgICBpZighRE9NLmlzVGV4dHVhbElucHV0KGZvY3VzZWQpKXsgcmV0dXJuIH1cbiAgICBsZXQgd2FzRm9jdXNlZCA9IGZvY3VzZWQubWF0Y2hlcyhcIjpmb2N1c1wiKVxuICAgIGlmKGZvY3VzZWQucmVhZE9ubHkpeyBmb2N1c2VkLmJsdXIoKSB9XG4gICAgaWYoIXdhc0ZvY3VzZWQpeyBmb2N1c2VkLmZvY3VzKCkgfVxuICAgIGlmKHRoaXMuaGFzU2VsZWN0aW9uUmFuZ2UoZm9jdXNlZCkpe1xuICAgICAgZm9jdXNlZC5zZXRTZWxlY3Rpb25SYW5nZShzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKVxuICAgIH1cbiAgfSxcblxuICBpc0Zvcm1JbnB1dChlbCl7IHJldHVybiAvXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYSkkL2kudGVzdChlbC50YWdOYW1lKSAmJiBlbC50eXBlICE9PSBcImJ1dHRvblwiIH0sXG5cbiAgc3luY0F0dHJzVG9Qcm9wcyhlbCl7XG4gICAgaWYoZWwgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmIENIRUNLQUJMRV9JTlBVVFMuaW5kZXhPZihlbC50eXBlLnRvTG9jYWxlTG93ZXJDYXNlKCkpID49IDApe1xuICAgICAgZWwuY2hlY2tlZCA9IGVsLmdldEF0dHJpYnV0ZShcImNoZWNrZWRcIikgIT09IG51bGxcbiAgICB9XG4gIH0sXG5cbiAgaXNUZXh0dWFsSW5wdXQoZWwpeyByZXR1cm4gRk9DVVNBQkxFX0lOUFVUUy5pbmRleE9mKGVsLnR5cGUpID49IDAgfSxcblxuICBpc05vd1RyaWdnZXJGb3JtRXh0ZXJuYWwoZWwsIHBoeFRyaWdnZXJFeHRlcm5hbCl7XG4gICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSAmJiBlbC5nZXRBdHRyaWJ1dGUocGh4VHJpZ2dlckV4dGVybmFsKSAhPT0gbnVsbFxuICB9LFxuXG4gIHN5bmNQZW5kaW5nUmVmKGZyb21FbCwgdG9FbCwgZGlzYWJsZVdpdGgpe1xuICAgIGxldCByZWYgPSBmcm9tRWwuZ2V0QXR0cmlidXRlKFBIWF9SRUYpXG4gICAgaWYocmVmID09PSBudWxsKXsgcmV0dXJuIHRydWUgfVxuXG4gICAgaWYoRE9NLmlzRm9ybUlucHV0KGZyb21FbCkgfHwgZnJvbUVsLmdldEF0dHJpYnV0ZShkaXNhYmxlV2l0aCkgIT09IG51bGwpe1xuICAgICAgaWYoRE9NLmlzVXBsb2FkSW5wdXQoZnJvbUVsKSl7IERPTS5tZXJnZUF0dHJzKGZyb21FbCwgdG9FbCwge2lzSWdub3JlZDogdHJ1ZX0pIH1cbiAgICAgIERPTS5wdXRQcml2YXRlKGZyb21FbCwgUEhYX1JFRiwgdG9FbClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICBQSFhfRVZFTlRfQ0xBU1NFUy5mb3JFYWNoKGNsYXNzTmFtZSA9PiB7XG4gICAgICAgIGZyb21FbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSAmJiB0b0VsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKVxuICAgICAgfSlcbiAgICAgIHRvRWwuc2V0QXR0cmlidXRlKFBIWF9SRUYsIHJlZilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9LFxuXG4gIGNsZWFuQ2hpbGROb2Rlcyhjb250YWluZXIsIHBoeFVwZGF0ZSl7XG4gICAgaWYoRE9NLmlzUGh4VXBkYXRlKGNvbnRhaW5lciwgcGh4VXBkYXRlLCBbXCJhcHBlbmRcIiwgXCJwcmVwZW5kXCJdKSl7XG4gICAgICBsZXQgdG9SZW1vdmUgPSBbXVxuICAgICAgY29udGFpbmVyLmNoaWxkTm9kZXMuZm9yRWFjaChjaGlsZE5vZGUgPT4ge1xuICAgICAgICBpZighY2hpbGROb2RlLmlkKXtcbiAgICAgICAgICAvLyBTa2lwIHdhcm5pbmcgaWYgaXQncyBhbiBlbXB0eSB0ZXh0IG5vZGUgKGUuZy4gYSBuZXctbGluZSlcbiAgICAgICAgICBsZXQgaXNFbXB0eVRleHROb2RlID0gY2hpbGROb2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSAmJiBjaGlsZE5vZGUubm9kZVZhbHVlLnRyaW0oKSA9PT0gXCJcIlxuICAgICAgICAgIGlmKCFpc0VtcHR5VGV4dE5vZGUpe1xuICAgICAgICAgICAgbG9nRXJyb3IoXCJvbmx5IEhUTUwgZWxlbWVudCB0YWdzIHdpdGggYW4gaWQgYXJlIGFsbG93ZWQgaW5zaWRlIGNvbnRhaW5lcnMgd2l0aCBwaHgtdXBkYXRlLlxcblxcblwiICtcbiAgICAgICAgICAgICAgYHJlbW92aW5nIGlsbGVnYWwgbm9kZTogXCIkeyhjaGlsZE5vZGUub3V0ZXJIVE1MIHx8IGNoaWxkTm9kZS5ub2RlVmFsdWUpLnRyaW0oKX1cIlxcblxcbmApXG4gICAgICAgICAgfVxuICAgICAgICAgIHRvUmVtb3ZlLnB1c2goY2hpbGROb2RlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdG9SZW1vdmUuZm9yRWFjaChjaGlsZE5vZGUgPT4gY2hpbGROb2RlLnJlbW92ZSgpKVxuICAgIH1cbiAgfSxcblxuICByZXBsYWNlUm9vdENvbnRhaW5lcihjb250YWluZXIsIHRhZ05hbWUsIGF0dHJzKXtcbiAgICBsZXQgcmV0YWluZWRBdHRycyA9IG5ldyBTZXQoW1wiaWRcIiwgUEhYX1NFU1NJT04sIFBIWF9TVEFUSUMsIFBIWF9NQUlOLCBQSFhfUk9PVF9JRF0pXG4gICAgaWYoY29udGFpbmVyLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gdGFnTmFtZS50b0xvd2VyQ2FzZSgpKXtcbiAgICAgIEFycmF5LmZyb20oY29udGFpbmVyLmF0dHJpYnV0ZXMpXG4gICAgICAgIC5maWx0ZXIoYXR0ciA9PiAhcmV0YWluZWRBdHRycy5oYXMoYXR0ci5uYW1lLnRvTG93ZXJDYXNlKCkpKVxuICAgICAgICAuZm9yRWFjaChhdHRyID0+IGNvbnRhaW5lci5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKSlcblxuICAgICAgT2JqZWN0LmtleXMoYXR0cnMpXG4gICAgICAgIC5maWx0ZXIobmFtZSA9PiAhcmV0YWluZWRBdHRycy5oYXMobmFtZS50b0xvd2VyQ2FzZSgpKSlcbiAgICAgICAgLmZvckVhY2goYXR0ciA9PiBjb250YWluZXIuc2V0QXR0cmlidXRlKGF0dHIsIGF0dHJzW2F0dHJdKSlcblxuICAgICAgcmV0dXJuIGNvbnRhaW5lclxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZXdDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpXG4gICAgICBPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChhdHRyID0+IG5ld0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoYXR0ciwgYXR0cnNbYXR0cl0pKVxuICAgICAgcmV0YWluZWRBdHRycy5mb3JFYWNoKGF0dHIgPT4gbmV3Q29udGFpbmVyLnNldEF0dHJpYnV0ZShhdHRyLCBjb250YWluZXIuZ2V0QXR0cmlidXRlKGF0dHIpKSlcbiAgICAgIG5ld0NvbnRhaW5lci5pbm5lckhUTUwgPSBjb250YWluZXIuaW5uZXJIVE1MXG4gICAgICBjb250YWluZXIucmVwbGFjZVdpdGgobmV3Q29udGFpbmVyKVxuICAgICAgcmV0dXJuIG5ld0NvbnRhaW5lclxuICAgIH1cbiAgfSxcblxuICBnZXRTdGlja3koZWwsIG5hbWUsIGRlZmF1bHRWYWwpe1xuICAgIGxldCBvcCA9IChET00ucHJpdmF0ZShlbCwgXCJzdGlja3lcIikgfHwgW10pLmZpbmQoKFtleGlzdGluZ05hbWUsIF0pID0+IG5hbWUgPT09IGV4aXN0aW5nTmFtZSlcbiAgICBpZihvcCl7XG4gICAgICBsZXQgW19uYW1lLCBfb3AsIHN0YXNoZWRSZXN1bHRdID0gb3BcbiAgICAgIHJldHVybiBzdGFzaGVkUmVzdWx0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0eXBlb2YoZGVmYXVsdFZhbCkgPT09IFwiZnVuY3Rpb25cIiA/IGRlZmF1bHRWYWwoKSA6IGRlZmF1bHRWYWxcbiAgICB9XG4gIH0sXG5cbiAgZGVsZXRlU3RpY2t5KGVsLCBuYW1lKXtcbiAgICB0aGlzLnVwZGF0ZVByaXZhdGUoZWwsIFwic3RpY2t5XCIsIFtdLCBvcHMgPT4ge1xuICAgICAgcmV0dXJuIG9wcy5maWx0ZXIoKFtleGlzdGluZ05hbWUsIF9dKSA9PiBleGlzdGluZ05hbWUgIT09IG5hbWUpXG4gICAgfSlcbiAgfSxcblxuICBwdXRTdGlja3koZWwsIG5hbWUsIG9wKXtcbiAgICBsZXQgc3Rhc2hlZFJlc3VsdCA9IG9wKGVsKVxuICAgIHRoaXMudXBkYXRlUHJpdmF0ZShlbCwgXCJzdGlja3lcIiwgW10sIG9wcyA9PiB7XG4gICAgICBsZXQgZXhpc3RpbmdJbmRleCA9IG9wcy5maW5kSW5kZXgoKFtleGlzdGluZ05hbWUsIF0pID0+IG5hbWUgPT09IGV4aXN0aW5nTmFtZSlcbiAgICAgIGlmKGV4aXN0aW5nSW5kZXggPj0gMCl7XG4gICAgICAgIG9wc1tleGlzdGluZ0luZGV4XSA9IFtuYW1lLCBvcCwgc3Rhc2hlZFJlc3VsdF1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wcy5wdXNoKFtuYW1lLCBvcCwgc3Rhc2hlZFJlc3VsdF0pXG4gICAgICB9XG4gICAgICByZXR1cm4gb3BzXG4gICAgfSlcbiAgfSxcblxuICBhcHBseVN0aWNreU9wZXJhdGlvbnMoZWwpe1xuICAgIGxldCBvcHMgPSBET00ucHJpdmF0ZShlbCwgXCJzdGlja3lcIilcbiAgICBpZighb3BzKXsgcmV0dXJuIH1cblxuICAgIG9wcy5mb3JFYWNoKChbbmFtZSwgb3AsIF9zdGFzaGVkXSkgPT4gdGhpcy5wdXRTdGlja3koZWwsIG5hbWUsIG9wKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBET01cbiIsICJpbXBvcnQge1xuICBQSFhfQUNUSVZFX0VOVFJZX1JFRlMsXG4gIFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCxcbiAgUEhYX1BSRUZMSUdIVEVEX1JFRlNcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2hhbm5lbFVwbG9hZGVyLFxuICBsb2dFcnJvclxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBMaXZlVXBsb2FkZXIgZnJvbSBcIi4vbGl2ZV91cGxvYWRlclwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVwbG9hZEVudHJ5IHtcbiAgc3RhdGljIGlzQWN0aXZlKGZpbGVFbCwgZmlsZSl7XG4gICAgbGV0IGlzTmV3ID0gZmlsZS5fcGh4UmVmID09PSB1bmRlZmluZWRcbiAgICBsZXQgYWN0aXZlUmVmcyA9IGZpbGVFbC5nZXRBdHRyaWJ1dGUoUEhYX0FDVElWRV9FTlRSWV9SRUZTKS5zcGxpdChcIixcIilcbiAgICBsZXQgaXNBY3RpdmUgPSBhY3RpdmVSZWZzLmluZGV4T2YoTGl2ZVVwbG9hZGVyLmdlbkZpbGVSZWYoZmlsZSkpID49IDBcbiAgICByZXR1cm4gZmlsZS5zaXplID4gMCAmJiAoaXNOZXcgfHwgaXNBY3RpdmUpXG4gIH1cblxuICBzdGF0aWMgaXNQcmVmbGlnaHRlZChmaWxlRWwsIGZpbGUpe1xuICAgIGxldCBwcmVmbGlnaHRlZFJlZnMgPSBmaWxlRWwuZ2V0QXR0cmlidXRlKFBIWF9QUkVGTElHSFRFRF9SRUZTKS5zcGxpdChcIixcIilcbiAgICBsZXQgaXNQcmVmbGlnaHRlZCA9IHByZWZsaWdodGVkUmVmcy5pbmRleE9mKExpdmVVcGxvYWRlci5nZW5GaWxlUmVmKGZpbGUpKSA+PSAwXG4gICAgcmV0dXJuIGlzUHJlZmxpZ2h0ZWQgJiYgdGhpcy5pc0FjdGl2ZShmaWxlRWwsIGZpbGUpXG4gIH1cblxuICBjb25zdHJ1Y3RvcihmaWxlRWwsIGZpbGUsIHZpZXcpe1xuICAgIHRoaXMucmVmID0gTGl2ZVVwbG9hZGVyLmdlbkZpbGVSZWYoZmlsZSlcbiAgICB0aGlzLmZpbGVFbCA9IGZpbGVFbFxuICAgIHRoaXMuZmlsZSA9IGZpbGVcbiAgICB0aGlzLnZpZXcgPSB2aWV3XG4gICAgdGhpcy5tZXRhID0gbnVsbFxuICAgIHRoaXMuX2lzQ2FuY2VsbGVkID0gZmFsc2VcbiAgICB0aGlzLl9pc0RvbmUgPSBmYWxzZVxuICAgIHRoaXMuX3Byb2dyZXNzID0gMFxuICAgIHRoaXMuX2xhc3RQcm9ncmVzc1NlbnQgPSAtMVxuICAgIHRoaXMuX29uRG9uZSA9IGZ1bmN0aW9uICgpeyB9XG4gICAgdGhpcy5fb25FbFVwZGF0ZWQgPSB0aGlzLm9uRWxVcGRhdGVkLmJpbmQodGhpcylcbiAgICB0aGlzLmZpbGVFbC5hZGRFdmVudExpc3RlbmVyKFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCwgdGhpcy5fb25FbFVwZGF0ZWQpXG4gIH1cblxuICBtZXRhZGF0YSgpeyByZXR1cm4gdGhpcy5tZXRhIH1cblxuICBwcm9ncmVzcyhwcm9ncmVzcyl7XG4gICAgdGhpcy5fcHJvZ3Jlc3MgPSBNYXRoLmZsb29yKHByb2dyZXNzKVxuICAgIGlmKHRoaXMuX3Byb2dyZXNzID4gdGhpcy5fbGFzdFByb2dyZXNzU2VudCl7XG4gICAgICBpZih0aGlzLl9wcm9ncmVzcyA+PSAxMDApe1xuICAgICAgICB0aGlzLl9wcm9ncmVzcyA9IDEwMFxuICAgICAgICB0aGlzLl9sYXN0UHJvZ3Jlc3NTZW50ID0gMTAwXG4gICAgICAgIHRoaXMuX2lzRG9uZSA9IHRydWVcbiAgICAgICAgdGhpcy52aWV3LnB1c2hGaWxlUHJvZ3Jlc3ModGhpcy5maWxlRWwsIHRoaXMucmVmLCAxMDAsICgpID0+IHtcbiAgICAgICAgICBMaXZlVXBsb2FkZXIudW50cmFja0ZpbGUodGhpcy5maWxlRWwsIHRoaXMuZmlsZSlcbiAgICAgICAgICB0aGlzLl9vbkRvbmUoKVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbGFzdFByb2dyZXNzU2VudCA9IHRoaXMuX3Byb2dyZXNzXG4gICAgICAgIHRoaXMudmlldy5wdXNoRmlsZVByb2dyZXNzKHRoaXMuZmlsZUVsLCB0aGlzLnJlZiwgdGhpcy5fcHJvZ3Jlc3MpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2FuY2VsKCl7XG4gICAgdGhpcy5faXNDYW5jZWxsZWQgPSB0cnVlXG4gICAgdGhpcy5faXNEb25lID0gdHJ1ZVxuICAgIHRoaXMuX29uRG9uZSgpXG4gIH1cblxuICBpc0RvbmUoKXsgcmV0dXJuIHRoaXMuX2lzRG9uZSB9XG5cbiAgZXJyb3IocmVhc29uID0gXCJmYWlsZWRcIil7XG4gICAgdGhpcy52aWV3LnB1c2hGaWxlUHJvZ3Jlc3ModGhpcy5maWxlRWwsIHRoaXMucmVmLCB7ZXJyb3I6IHJlYXNvbn0pXG4gICAgTGl2ZVVwbG9hZGVyLmNsZWFyRmlsZXModGhpcy5maWxlRWwpXG4gIH1cblxuICAvL3ByaXZhdGVcblxuICBvbkRvbmUoY2FsbGJhY2spe1xuICAgIHRoaXMuX29uRG9uZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuZmlsZUVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoUEhYX0xJVkVfRklMRV9VUERBVEVELCB0aGlzLl9vbkVsVXBkYXRlZClcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH1cblxuICBvbkVsVXBkYXRlZCgpe1xuICAgIGxldCBhY3RpdmVSZWZzID0gdGhpcy5maWxlRWwuZ2V0QXR0cmlidXRlKFBIWF9BQ1RJVkVfRU5UUllfUkVGUykuc3BsaXQoXCIsXCIpXG4gICAgaWYoYWN0aXZlUmVmcy5pbmRleE9mKHRoaXMucmVmKSA9PT0gLTEpeyB0aGlzLmNhbmNlbCgpIH1cbiAgfVxuXG4gIHRvUHJlZmxpZ2h0UGF5bG9hZCgpe1xuICAgIHJldHVybiB7XG4gICAgICBsYXN0X21vZGlmaWVkOiB0aGlzLmZpbGUubGFzdE1vZGlmaWVkLFxuICAgICAgbmFtZTogdGhpcy5maWxlLm5hbWUsXG4gICAgICBzaXplOiB0aGlzLmZpbGUuc2l6ZSxcbiAgICAgIHR5cGU6IHRoaXMuZmlsZS50eXBlLFxuICAgICAgcmVmOiB0aGlzLnJlZlxuICAgIH1cbiAgfVxuXG4gIHVwbG9hZGVyKHVwbG9hZGVycyl7XG4gICAgaWYodGhpcy5tZXRhLnVwbG9hZGVyKXtcbiAgICAgIGxldCBjYWxsYmFjayA9IHVwbG9hZGVyc1t0aGlzLm1ldGEudXBsb2FkZXJdIHx8IGxvZ0Vycm9yKGBubyB1cGxvYWRlciBjb25maWd1cmVkIGZvciAke3RoaXMubWV0YS51cGxvYWRlcn1gKVxuICAgICAgcmV0dXJuIHtuYW1lOiB0aGlzLm1ldGEudXBsb2FkZXIsIGNhbGxiYWNrOiBjYWxsYmFja31cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtuYW1lOiBcImNoYW5uZWxcIiwgY2FsbGJhY2s6IGNoYW5uZWxVcGxvYWRlcn1cbiAgICB9XG4gIH1cblxuICB6aXBQb3N0RmxpZ2h0KHJlc3Ape1xuICAgIHRoaXMubWV0YSA9IHJlc3AuZW50cmllc1t0aGlzLnJlZl1cbiAgICBpZighdGhpcy5tZXRhKXsgbG9nRXJyb3IoYG5vIHByZWZsaWdodCB1cGxvYWQgcmVzcG9uc2UgcmV0dXJuZWQgd2l0aCByZWYgJHt0aGlzLnJlZn1gLCB7aW5wdXQ6IHRoaXMuZmlsZUVsLCByZXNwb25zZTogcmVzcH0pIH1cbiAgfVxufVxuIiwgImltcG9ydCB7XG4gIFBIWF9ET05FX1JFRlMsXG4gIFBIWF9QUkVGTElHSFRFRF9SRUZTLFxuICBQSFhfVVBMT0FEX1JFRlxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcbmltcG9ydCBVcGxvYWRFbnRyeSBmcm9tIFwiLi91cGxvYWRfZW50cnlcIlxuXG5sZXQgbGl2ZVVwbG9hZGVyRmlsZVJlZiA9IDBcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGl2ZVVwbG9hZGVyIHtcbiAgc3RhdGljIGdlbkZpbGVSZWYoZmlsZSl7XG4gICAgbGV0IHJlZiA9IGZpbGUuX3BoeFJlZlxuICAgIGlmKHJlZiAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHJldHVybiByZWZcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsZS5fcGh4UmVmID0gKGxpdmVVcGxvYWRlckZpbGVSZWYrKykudG9TdHJpbmcoKVxuICAgICAgcmV0dXJuIGZpbGUuX3BoeFJlZlxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXRFbnRyeURhdGFVUkwoaW5wdXRFbCwgcmVmLCBjYWxsYmFjayl7XG4gICAgbGV0IGZpbGUgPSB0aGlzLmFjdGl2ZUZpbGVzKGlucHV0RWwpLmZpbmQoZmlsZSA9PiB0aGlzLmdlbkZpbGVSZWYoZmlsZSkgPT09IHJlZilcbiAgICBjYWxsYmFjayhVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpKVxuICB9XG5cbiAgc3RhdGljIGhhc1VwbG9hZHNJblByb2dyZXNzKGZvcm1FbCl7XG4gICAgbGV0IGFjdGl2ZSA9IDBcbiAgICBET00uZmluZFVwbG9hZElucHV0cyhmb3JtRWwpLmZvckVhY2goaW5wdXQgPT4ge1xuICAgICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKFBIWF9QUkVGTElHSFRFRF9SRUZTKSAhPT0gaW5wdXQuZ2V0QXR0cmlidXRlKFBIWF9ET05FX1JFRlMpKXtcbiAgICAgICAgYWN0aXZlKytcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBhY3RpdmUgPiAwXG4gIH1cblxuICBzdGF0aWMgc2VyaWFsaXplVXBsb2FkcyhpbnB1dEVsKXtcbiAgICBsZXQgZmlsZXMgPSB0aGlzLmFjdGl2ZUZpbGVzKGlucHV0RWwpXG4gICAgbGV0IGZpbGVEYXRhID0ge31cbiAgICBmaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xuICAgICAgbGV0IGVudHJ5ID0ge3BhdGg6IGlucHV0RWwubmFtZX1cbiAgICAgIGxldCB1cGxvYWRSZWYgPSBpbnB1dEVsLmdldEF0dHJpYnV0ZShQSFhfVVBMT0FEX1JFRilcbiAgICAgIGZpbGVEYXRhW3VwbG9hZFJlZl0gPSBmaWxlRGF0YVt1cGxvYWRSZWZdIHx8IFtdXG4gICAgICBlbnRyeS5yZWYgPSB0aGlzLmdlbkZpbGVSZWYoZmlsZSlcbiAgICAgIGVudHJ5Lm5hbWUgPSBmaWxlLm5hbWUgfHwgZW50cnkucmVmXG4gICAgICBlbnRyeS50eXBlID0gZmlsZS50eXBlXG4gICAgICBlbnRyeS5zaXplID0gZmlsZS5zaXplXG4gICAgICBmaWxlRGF0YVt1cGxvYWRSZWZdLnB1c2goZW50cnkpXG4gICAgfSlcbiAgICByZXR1cm4gZmlsZURhdGFcbiAgfVxuXG4gIHN0YXRpYyBjbGVhckZpbGVzKGlucHV0RWwpe1xuICAgIGlucHV0RWwudmFsdWUgPSBudWxsXG4gICAgaW5wdXRFbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpXG4gICAgRE9NLnB1dFByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiLCBbXSlcbiAgfVxuXG4gIHN0YXRpYyB1bnRyYWNrRmlsZShpbnB1dEVsLCBmaWxlKXtcbiAgICBET00ucHV0UHJpdmF0ZShpbnB1dEVsLCBcImZpbGVzXCIsIERPTS5wcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIikuZmlsdGVyKGYgPT4gIU9iamVjdC5pcyhmLCBmaWxlKSkpXG4gIH1cblxuICBzdGF0aWMgdHJhY2tGaWxlcyhpbnB1dEVsLCBmaWxlcyl7XG4gICAgaWYoaW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJtdWx0aXBsZVwiKSAhPT0gbnVsbCl7XG4gICAgICBsZXQgbmV3RmlsZXMgPSBmaWxlcy5maWx0ZXIoZmlsZSA9PiAhdGhpcy5hY3RpdmVGaWxlcyhpbnB1dEVsKS5maW5kKGYgPT4gT2JqZWN0LmlzKGYsIGZpbGUpKSlcbiAgICAgIERPTS5wdXRQcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIiwgdGhpcy5hY3RpdmVGaWxlcyhpbnB1dEVsKS5jb25jYXQobmV3RmlsZXMpKVxuICAgICAgaW5wdXRFbC52YWx1ZSA9IG51bGxcbiAgICB9IGVsc2Uge1xuICAgICAgRE9NLnB1dFByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiLCBmaWxlcylcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYWN0aXZlRmlsZUlucHV0cyhmb3JtRWwpe1xuICAgIGxldCBmaWxlSW5wdXRzID0gRE9NLmZpbmRVcGxvYWRJbnB1dHMoZm9ybUVsKVxuICAgIHJldHVybiBBcnJheS5mcm9tKGZpbGVJbnB1dHMpLmZpbHRlcihlbCA9PiBlbC5maWxlcyAmJiB0aGlzLmFjdGl2ZUZpbGVzKGVsKS5sZW5ndGggPiAwKVxuICB9XG5cbiAgc3RhdGljIGFjdGl2ZUZpbGVzKGlucHV0KXtcbiAgICByZXR1cm4gKERPTS5wcml2YXRlKGlucHV0LCBcImZpbGVzXCIpIHx8IFtdKS5maWx0ZXIoZiA9PiBVcGxvYWRFbnRyeS5pc0FjdGl2ZShpbnB1dCwgZikpXG4gIH1cblxuICBzdGF0aWMgaW5wdXRzQXdhaXRpbmdQcmVmbGlnaHQoZm9ybUVsKXtcbiAgICBsZXQgZmlsZUlucHV0cyA9IERPTS5maW5kVXBsb2FkSW5wdXRzKGZvcm1FbClcbiAgICByZXR1cm4gQXJyYXkuZnJvbShmaWxlSW5wdXRzKS5maWx0ZXIoaW5wdXQgPT4gdGhpcy5maWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0KS5sZW5ndGggPiAwKVxuICB9XG5cbiAgc3RhdGljIGZpbGVzQXdhaXRpbmdQcmVmbGlnaHQoaW5wdXQpe1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZUZpbGVzKGlucHV0KS5maWx0ZXIoZiA9PiAhVXBsb2FkRW50cnkuaXNQcmVmbGlnaHRlZChpbnB1dCwgZikpXG4gIH1cblxuICBjb25zdHJ1Y3RvcihpbnB1dEVsLCB2aWV3LCBvbkNvbXBsZXRlKXtcbiAgICB0aGlzLnZpZXcgPSB2aWV3XG4gICAgdGhpcy5vbkNvbXBsZXRlID0gb25Db21wbGV0ZVxuICAgIHRoaXMuX2VudHJpZXMgPVxuICAgICAgQXJyYXkuZnJvbShMaXZlVXBsb2FkZXIuZmlsZXNBd2FpdGluZ1ByZWZsaWdodChpbnB1dEVsKSB8fCBbXSlcbiAgICAgICAgLm1hcChmaWxlID0+IG5ldyBVcGxvYWRFbnRyeShpbnB1dEVsLCBmaWxlLCB2aWV3KSlcblxuICAgIHRoaXMubnVtRW50cmllc0luUHJvZ3Jlc3MgPSB0aGlzLl9lbnRyaWVzLmxlbmd0aFxuICB9XG5cbiAgZW50cmllcygpeyByZXR1cm4gdGhpcy5fZW50cmllcyB9XG5cbiAgaW5pdEFkYXB0ZXJVcGxvYWQocmVzcCwgb25FcnJvciwgbGl2ZVNvY2tldCl7XG4gICAgdGhpcy5fZW50cmllcyA9XG4gICAgICB0aGlzLl9lbnRyaWVzLm1hcChlbnRyeSA9PiB7XG4gICAgICAgIGVudHJ5LnppcFBvc3RGbGlnaHQocmVzcClcbiAgICAgICAgZW50cnkub25Eb25lKCgpID0+IHtcbiAgICAgICAgICB0aGlzLm51bUVudHJpZXNJblByb2dyZXNzLS1cbiAgICAgICAgICBpZih0aGlzLm51bUVudHJpZXNJblByb2dyZXNzID09PSAwKXsgdGhpcy5vbkNvbXBsZXRlKCkgfVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gZW50cnlcbiAgICAgIH0pXG5cbiAgICBsZXQgZ3JvdXBlZEVudHJpZXMgPSB0aGlzLl9lbnRyaWVzLnJlZHVjZSgoYWNjLCBlbnRyeSkgPT4ge1xuICAgICAgbGV0IHtuYW1lLCBjYWxsYmFja30gPSBlbnRyeS51cGxvYWRlcihsaXZlU29ja2V0LnVwbG9hZGVycylcbiAgICAgIGFjY1tuYW1lXSA9IGFjY1tuYW1lXSB8fCB7Y2FsbGJhY2s6IGNhbGxiYWNrLCBlbnRyaWVzOiBbXX1cbiAgICAgIGFjY1tuYW1lXS5lbnRyaWVzLnB1c2goZW50cnkpXG4gICAgICByZXR1cm4gYWNjXG4gICAgfSwge30pXG5cbiAgICBmb3IobGV0IG5hbWUgaW4gZ3JvdXBlZEVudHJpZXMpe1xuICAgICAgbGV0IHtjYWxsYmFjaywgZW50cmllc30gPSBncm91cGVkRW50cmllc1tuYW1lXVxuICAgICAgY2FsbGJhY2soZW50cmllcywgb25FcnJvciwgcmVzcCwgbGl2ZVNvY2tldClcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQge1xuICBQSFhfQUNUSVZFX0VOVFJZX1JFRlMsXG4gIFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCxcbiAgUEhYX1BSRUZMSUdIVEVEX1JFRlMsXG4gIFBIWF9VUExPQURfUkVGXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCBMaXZlVXBsb2FkZXIgZnJvbSBcIi4vbGl2ZV91cGxvYWRlclwiXG5cbmxldCBIb29rcyA9IHtcbiAgTGl2ZUZpbGVVcGxvYWQ6IHtcbiAgICBhY3RpdmVSZWZzKCl7IHJldHVybiB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfQUNUSVZFX0VOVFJZX1JFRlMpIH0sXG5cbiAgICBwcmVmbGlnaHRlZFJlZnMoKXsgcmV0dXJuIHRoaXMuZWwuZ2V0QXR0cmlidXRlKFBIWF9QUkVGTElHSFRFRF9SRUZTKSB9LFxuXG4gICAgbW91bnRlZCgpeyB0aGlzLnByZWZsaWdodGVkV2FzID0gdGhpcy5wcmVmbGlnaHRlZFJlZnMoKSB9LFxuXG4gICAgdXBkYXRlZCgpe1xuICAgICAgbGV0IG5ld1ByZWZsaWdodHMgPSB0aGlzLnByZWZsaWdodGVkUmVmcygpXG4gICAgICBpZih0aGlzLnByZWZsaWdodGVkV2FzICE9PSBuZXdQcmVmbGlnaHRzKXtcbiAgICAgICAgdGhpcy5wcmVmbGlnaHRlZFdhcyA9IG5ld1ByZWZsaWdodHNcbiAgICAgICAgaWYobmV3UHJlZmxpZ2h0cyA9PT0gXCJcIil7XG4gICAgICAgICAgdGhpcy5fX3ZpZXcuY2FuY2VsU3VibWl0KHRoaXMuZWwuZm9ybSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZih0aGlzLmFjdGl2ZVJlZnMoKSA9PT0gXCJcIil7IHRoaXMuZWwudmFsdWUgPSBudWxsIH1cbiAgICAgIHRoaXMuZWwuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoUEhYX0xJVkVfRklMRV9VUERBVEVEKSlcbiAgICB9XG4gIH0sXG5cbiAgTGl2ZUltZ1ByZXZpZXc6IHtcbiAgICBtb3VudGVkKCl7XG4gICAgICB0aGlzLnJlZiA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1waHgtZW50cnktcmVmXCIpXG4gICAgICB0aGlzLmlucHV0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfVVBMT0FEX1JFRikpXG4gICAgICBMaXZlVXBsb2FkZXIuZ2V0RW50cnlEYXRhVVJMKHRoaXMuaW5wdXRFbCwgdGhpcy5yZWYsIHVybCA9PiB7XG4gICAgICAgIHRoaXMudXJsID0gdXJsXG4gICAgICAgIHRoaXMuZWwuc3JjID0gdXJsXG4gICAgICB9KVxuICAgIH0sXG4gICAgZGVzdHJveWVkKCl7XG4gICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHRoaXMudXJsKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIb29rc1xuIiwgImltcG9ydCB7XG4gIG1heWJlXG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBET01Qb3N0TW9ycGhSZXN0b3JlciB7XG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lckJlZm9yZSwgY29udGFpbmVyQWZ0ZXIsIHVwZGF0ZVR5cGUpe1xuICAgIGxldCBpZHNCZWZvcmUgPSBuZXcgU2V0KClcbiAgICBsZXQgaWRzQWZ0ZXIgPSBuZXcgU2V0KFsuLi5jb250YWluZXJBZnRlci5jaGlsZHJlbl0ubWFwKGNoaWxkID0+IGNoaWxkLmlkKSlcblxuICAgIGxldCBlbGVtZW50c1RvTW9kaWZ5ID0gW11cblxuICAgIEFycmF5LmZyb20oY29udGFpbmVyQmVmb3JlLmNoaWxkcmVuKS5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgIGlmKGNoaWxkLmlkKXsgLy8gYWxsIG9mIG91ciBjaGlsZHJlbiBzaG91bGQgYmUgZWxlbWVudHMgd2l0aCBpZHNcbiAgICAgICAgaWRzQmVmb3JlLmFkZChjaGlsZC5pZClcbiAgICAgICAgaWYoaWRzQWZ0ZXIuaGFzKGNoaWxkLmlkKSl7XG4gICAgICAgICAgbGV0IHByZXZpb3VzRWxlbWVudElkID0gY2hpbGQucHJldmlvdXNFbGVtZW50U2libGluZyAmJiBjaGlsZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmlkXG4gICAgICAgICAgZWxlbWVudHNUb01vZGlmeS5wdXNoKHtlbGVtZW50SWQ6IGNoaWxkLmlkLCBwcmV2aW91c0VsZW1lbnRJZDogcHJldmlvdXNFbGVtZW50SWR9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuY29udGFpbmVySWQgPSBjb250YWluZXJBZnRlci5pZFxuICAgIHRoaXMudXBkYXRlVHlwZSA9IHVwZGF0ZVR5cGVcbiAgICB0aGlzLmVsZW1lbnRzVG9Nb2RpZnkgPSBlbGVtZW50c1RvTW9kaWZ5XG4gICAgdGhpcy5lbGVtZW50SWRzVG9BZGQgPSBbLi4uaWRzQWZ0ZXJdLmZpbHRlcihpZCA9PiAhaWRzQmVmb3JlLmhhcyhpZCkpXG4gIH1cblxuICAvLyBXZSBkbyB0aGUgZm9sbG93aW5nIHRvIG9wdGltaXplIGFwcGVuZC9wcmVwZW5kIG9wZXJhdGlvbnM6XG4gIC8vICAgMSkgVHJhY2sgaWRzIG9mIG1vZGlmaWVkIGVsZW1lbnRzICYgb2YgbmV3IGVsZW1lbnRzXG4gIC8vICAgMikgQWxsIHRoZSBtb2RpZmllZCBlbGVtZW50cyBhcmUgcHV0IGJhY2sgaW4gdGhlIGNvcnJlY3QgcG9zaXRpb24gaW4gdGhlIERPTSB0cmVlXG4gIC8vICAgICAgYnkgc3RvcmluZyB0aGUgaWQgb2YgdGhlaXIgcHJldmlvdXMgc2libGluZ1xuICAvLyAgIDMpIE5ldyBlbGVtZW50cyBhcmUgZ29pbmcgdG8gYmUgcHV0IGluIHRoZSByaWdodCBwbGFjZSBieSBtb3JwaGRvbSBkdXJpbmcgYXBwZW5kLlxuICAvLyAgICAgIEZvciBwcmVwZW5kLCB3ZSBtb3ZlIHRoZW0gdG8gdGhlIGZpcnN0IHBvc2l0aW9uIGluIHRoZSBjb250YWluZXJcbiAgcGVyZm9ybSgpe1xuICAgIGxldCBjb250YWluZXIgPSBET00uYnlJZCh0aGlzLmNvbnRhaW5lcklkKVxuICAgIHRoaXMuZWxlbWVudHNUb01vZGlmeS5mb3JFYWNoKGVsZW1lbnRUb01vZGlmeSA9PiB7XG4gICAgICBpZihlbGVtZW50VG9Nb2RpZnkucHJldmlvdXNFbGVtZW50SWQpe1xuICAgICAgICBtYXliZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50VG9Nb2RpZnkucHJldmlvdXNFbGVtZW50SWQpLCBwcmV2aW91c0VsZW0gPT4ge1xuICAgICAgICAgIG1heWJlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRUb01vZGlmeS5lbGVtZW50SWQpLCBlbGVtID0+IHtcbiAgICAgICAgICAgIGxldCBpc0luUmlnaHRQbGFjZSA9IGVsZW0ucHJldmlvdXNFbGVtZW50U2libGluZyAmJiBlbGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuaWQgPT0gcHJldmlvdXNFbGVtLmlkXG4gICAgICAgICAgICBpZighaXNJblJpZ2h0UGxhY2Upe1xuICAgICAgICAgICAgICBwcmV2aW91c0VsZW0uaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJlbmRcIiwgZWxlbSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgY29udGFpbmVyXG4gICAgICAgIG1heWJlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRUb01vZGlmeS5lbGVtZW50SWQpLCBlbGVtID0+IHtcbiAgICAgICAgICBsZXQgaXNJblJpZ2h0UGxhY2UgPSBlbGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgPT0gbnVsbFxuICAgICAgICAgIGlmKCFpc0luUmlnaHRQbGFjZSl7XG4gICAgICAgICAgICBjb250YWluZXIuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJiZWdpblwiLCBlbGVtKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYodGhpcy51cGRhdGVUeXBlID09IFwicHJlcGVuZFwiKXtcbiAgICAgIHRoaXMuZWxlbWVudElkc1RvQWRkLnJldmVyc2UoKS5mb3JFYWNoKGVsZW1JZCA9PiB7XG4gICAgICAgIG1heWJlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1JZCksIGVsZW0gPT4gY29udGFpbmVyLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyYmVnaW5cIiwgZWxlbSkpXG4gICAgICB9KVxuICAgIH1cbiAgfVxufVxuIiwgInZhciBET0NVTUVOVF9GUkFHTUVOVF9OT0RFID0gMTE7XG5cbmZ1bmN0aW9uIG1vcnBoQXR0cnMoZnJvbU5vZGUsIHRvTm9kZSkge1xuICAgIHZhciB0b05vZGVBdHRycyA9IHRvTm9kZS5hdHRyaWJ1dGVzO1xuICAgIHZhciBhdHRyO1xuICAgIHZhciBhdHRyTmFtZTtcbiAgICB2YXIgYXR0ck5hbWVzcGFjZVVSSTtcbiAgICB2YXIgYXR0clZhbHVlO1xuICAgIHZhciBmcm9tVmFsdWU7XG5cbiAgICAvLyBkb2N1bWVudC1mcmFnbWVudHMgZG9udCBoYXZlIGF0dHJpYnV0ZXMgc28gbGV0cyBub3QgZG8gYW55dGhpbmdcbiAgICBpZiAodG9Ob2RlLm5vZGVUeXBlID09PSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFIHx8IGZyb21Ob2RlLm5vZGVUeXBlID09PSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGF0dHJpYnV0ZXMgb24gb3JpZ2luYWwgRE9NIGVsZW1lbnRcbiAgICBmb3IgKHZhciBpID0gdG9Ob2RlQXR0cnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgYXR0ciA9IHRvTm9kZUF0dHJzW2ldO1xuICAgICAgICBhdHRyTmFtZSA9IGF0dHIubmFtZTtcbiAgICAgICAgYXR0ck5hbWVzcGFjZVVSSSA9IGF0dHIubmFtZXNwYWNlVVJJO1xuICAgICAgICBhdHRyVmFsdWUgPSBhdHRyLnZhbHVlO1xuXG4gICAgICAgIGlmIChhdHRyTmFtZXNwYWNlVVJJKSB7XG4gICAgICAgICAgICBhdHRyTmFtZSA9IGF0dHIubG9jYWxOYW1lIHx8IGF0dHJOYW1lO1xuICAgICAgICAgICAgZnJvbVZhbHVlID0gZnJvbU5vZGUuZ2V0QXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoZnJvbVZhbHVlICE9PSBhdHRyVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0ci5wcmVmaXggPT09ICd4bWxucycpe1xuICAgICAgICAgICAgICAgICAgICBhdHRyTmFtZSA9IGF0dHIubmFtZTsgLy8gSXQncyBub3QgYWxsb3dlZCB0byBzZXQgYW4gYXR0cmlidXRlIHdpdGggdGhlIFhNTE5TIG5hbWVzcGFjZSB3aXRob3V0IHNwZWNpZnlpbmcgdGhlIGB4bWxuc2AgcHJlZml4XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZyb21Ob2RlLnNldEF0dHJpYnV0ZU5TKGF0dHJOYW1lc3BhY2VVUkksIGF0dHJOYW1lLCBhdHRyVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnJvbVZhbHVlID0gZnJvbU5vZGUuZ2V0QXR0cmlidXRlKGF0dHJOYW1lKTtcblxuICAgICAgICAgICAgaWYgKGZyb21WYWx1ZSAhPT0gYXR0clZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZnJvbU5vZGUuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBhdHRyVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGFueSBleHRyYSBhdHRyaWJ1dGVzIGZvdW5kIG9uIHRoZSBvcmlnaW5hbCBET00gZWxlbWVudCB0aGF0XG4gICAgLy8gd2VyZW4ndCBmb3VuZCBvbiB0aGUgdGFyZ2V0IGVsZW1lbnQuXG4gICAgdmFyIGZyb21Ob2RlQXR0cnMgPSBmcm9tTm9kZS5hdHRyaWJ1dGVzO1xuXG4gICAgZm9yICh2YXIgZCA9IGZyb21Ob2RlQXR0cnMubGVuZ3RoIC0gMTsgZCA+PSAwOyBkLS0pIHtcbiAgICAgICAgYXR0ciA9IGZyb21Ob2RlQXR0cnNbZF07XG4gICAgICAgIGF0dHJOYW1lID0gYXR0ci5uYW1lO1xuICAgICAgICBhdHRyTmFtZXNwYWNlVVJJID0gYXR0ci5uYW1lc3BhY2VVUkk7XG5cbiAgICAgICAgaWYgKGF0dHJOYW1lc3BhY2VVUkkpIHtcbiAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0ci5sb2NhbE5hbWUgfHwgYXR0ck5hbWU7XG5cbiAgICAgICAgICAgIGlmICghdG9Ob2RlLmhhc0F0dHJpYnV0ZU5TKGF0dHJOYW1lc3BhY2VVUkksIGF0dHJOYW1lKSkge1xuICAgICAgICAgICAgICAgIGZyb21Ob2RlLnJlbW92ZUF0dHJpYnV0ZU5TKGF0dHJOYW1lc3BhY2VVUkksIGF0dHJOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdG9Ob2RlLmhhc0F0dHJpYnV0ZShhdHRyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmcm9tTm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG52YXIgcmFuZ2U7IC8vIENyZWF0ZSBhIHJhbmdlIG9iamVjdCBmb3IgZWZmaWNlbnRseSByZW5kZXJpbmcgc3RyaW5ncyB0byBlbGVtZW50cy5cbnZhciBOU19YSFRNTCA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJztcblxudmFyIGRvYyA9IHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBkb2N1bWVudDtcbnZhciBIQVNfVEVNUExBVEVfU1VQUE9SVCA9ICEhZG9jICYmICdjb250ZW50JyBpbiBkb2MuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbnZhciBIQVNfUkFOR0VfU1VQUE9SVCA9ICEhZG9jICYmIGRvYy5jcmVhdGVSYW5nZSAmJiAnY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50JyBpbiBkb2MuY3JlYXRlUmFuZ2UoKTtcblxuZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnRGcm9tVGVtcGxhdGUoc3RyKSB7XG4gICAgdmFyIHRlbXBsYXRlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyO1xuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXNbMF07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZyYWdtZW50RnJvbVJhbmdlKHN0cikge1xuICAgIGlmICghcmFuZ2UpIHtcbiAgICAgICAgcmFuZ2UgPSBkb2MuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgcmFuZ2Uuc2VsZWN0Tm9kZShkb2MuYm9keSk7XG4gICAgfVxuXG4gICAgdmFyIGZyYWdtZW50ID0gcmFuZ2UuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHN0cik7XG4gICAgcmV0dXJuIGZyYWdtZW50LmNoaWxkTm9kZXNbMF07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZyYWdtZW50RnJvbVdyYXAoc3RyKSB7XG4gICAgdmFyIGZyYWdtZW50ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2JvZHknKTtcbiAgICBmcmFnbWVudC5pbm5lckhUTUwgPSBzdHI7XG4gICAgcmV0dXJuIGZyYWdtZW50LmNoaWxkTm9kZXNbMF07XG59XG5cbi8qKlxuICogVGhpcyBpcyBhYm91dCB0aGUgc2FtZVxuICogdmFyIGh0bWwgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHN0ciwgJ3RleHQvaHRtbCcpO1xuICogcmV0dXJuIGh0bWwuYm9keS5maXJzdENoaWxkO1xuICpcbiAqIEBtZXRob2QgdG9FbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKi9cbmZ1bmN0aW9uIHRvRWxlbWVudChzdHIpIHtcbiAgICBzdHIgPSBzdHIudHJpbSgpO1xuICAgIGlmIChIQVNfVEVNUExBVEVfU1VQUE9SVCkge1xuICAgICAgLy8gYXZvaWQgcmVzdHJpY3Rpb25zIG9uIGNvbnRlbnQgZm9yIHRoaW5ncyBsaWtlIGA8dHI+PHRoPkhpPC90aD48L3RyPmAgd2hpY2hcbiAgICAgIC8vIGNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudCBkb2Vzbid0IHN1cHBvcnRcbiAgICAgIC8vIDx0ZW1wbGF0ZT4gc3VwcG9ydCBub3QgYXZhaWxhYmxlIGluIElFXG4gICAgICByZXR1cm4gY3JlYXRlRnJhZ21lbnRGcm9tVGVtcGxhdGUoc3RyKTtcbiAgICB9IGVsc2UgaWYgKEhBU19SQU5HRV9TVVBQT1JUKSB7XG4gICAgICByZXR1cm4gY3JlYXRlRnJhZ21lbnRGcm9tUmFuZ2Uoc3RyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3JlYXRlRnJhZ21lbnRGcm9tV3JhcChzdHIpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0d28gbm9kZSdzIG5hbWVzIGFyZSB0aGUgc2FtZS5cbiAqXG4gKiBOT1RFOiBXZSBkb24ndCBib3RoZXIgY2hlY2tpbmcgYG5hbWVzcGFjZVVSSWAgYmVjYXVzZSB5b3Ugd2lsbCBuZXZlciBmaW5kIHR3byBIVE1MIGVsZW1lbnRzIHdpdGggdGhlIHNhbWVcbiAqICAgICAgIG5vZGVOYW1lIGFuZCBkaWZmZXJlbnQgbmFtZXNwYWNlIFVSSXMuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBhXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGIgVGhlIHRhcmdldCBlbGVtZW50XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBjb21wYXJlTm9kZU5hbWVzKGZyb21FbCwgdG9FbCkge1xuICAgIHZhciBmcm9tTm9kZU5hbWUgPSBmcm9tRWwubm9kZU5hbWU7XG4gICAgdmFyIHRvTm9kZU5hbWUgPSB0b0VsLm5vZGVOYW1lO1xuICAgIHZhciBmcm9tQ29kZVN0YXJ0LCB0b0NvZGVTdGFydDtcblxuICAgIGlmIChmcm9tTm9kZU5hbWUgPT09IHRvTm9kZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnJvbUNvZGVTdGFydCA9IGZyb21Ob2RlTmFtZS5jaGFyQ29kZUF0KDApO1xuICAgIHRvQ29kZVN0YXJ0ID0gdG9Ob2RlTmFtZS5jaGFyQ29kZUF0KDApO1xuXG4gICAgLy8gSWYgdGhlIHRhcmdldCBlbGVtZW50IGlzIGEgdmlydHVhbCBET00gbm9kZSBvciBTVkcgbm9kZSB0aGVuIHdlIG1heVxuICAgIC8vIG5lZWQgdG8gbm9ybWFsaXplIHRoZSB0YWcgbmFtZSBiZWZvcmUgY29tcGFyaW5nLiBOb3JtYWwgSFRNTCBlbGVtZW50cyB0aGF0IGFyZVxuICAgIC8vIGluIHRoZSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIlxuICAgIC8vIGFyZSBjb252ZXJ0ZWQgdG8gdXBwZXIgY2FzZVxuICAgIGlmIChmcm9tQ29kZVN0YXJ0IDw9IDkwICYmIHRvQ29kZVN0YXJ0ID49IDk3KSB7IC8vIGZyb20gaXMgdXBwZXIgYW5kIHRvIGlzIGxvd2VyXG4gICAgICAgIHJldHVybiBmcm9tTm9kZU5hbWUgPT09IHRvTm9kZU5hbWUudG9VcHBlckNhc2UoKTtcbiAgICB9IGVsc2UgaWYgKHRvQ29kZVN0YXJ0IDw9IDkwICYmIGZyb21Db2RlU3RhcnQgPj0gOTcpIHsgLy8gdG8gaXMgdXBwZXIgYW5kIGZyb20gaXMgbG93ZXJcbiAgICAgICAgcmV0dXJuIHRvTm9kZU5hbWUgPT09IGZyb21Ob2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGFuIGVsZW1lbnQsIG9wdGlvbmFsbHkgd2l0aCBhIGtub3duIG5hbWVzcGFjZSBVUkkuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgdGhlIGVsZW1lbnQgbmFtZSwgZS5nLiAnZGl2JyBvciAnc3ZnJ1xuICogQHBhcmFtIHtzdHJpbmd9IFtuYW1lc3BhY2VVUkldIHRoZSBlbGVtZW50J3MgbmFtZXNwYWNlIFVSSSwgaS5lLiB0aGUgdmFsdWUgb2ZcbiAqIGl0cyBgeG1sbnNgIGF0dHJpYnV0ZSBvciBpdHMgaW5mZXJyZWQgbmFtZXNwYWNlLlxuICpcbiAqIEByZXR1cm4ge0VsZW1lbnR9XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnROUyhuYW1lLCBuYW1lc3BhY2VVUkkpIHtcbiAgICByZXR1cm4gIW5hbWVzcGFjZVVSSSB8fCBuYW1lc3BhY2VVUkkgPT09IE5TX1hIVE1MID9cbiAgICAgICAgZG9jLmNyZWF0ZUVsZW1lbnQobmFtZSkgOlxuICAgICAgICBkb2MuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSwgbmFtZSk7XG59XG5cbi8qKlxuICogQ29waWVzIHRoZSBjaGlsZHJlbiBvZiBvbmUgRE9NIGVsZW1lbnQgdG8gYW5vdGhlciBET00gZWxlbWVudFxuICovXG5mdW5jdGlvbiBtb3ZlQ2hpbGRyZW4oZnJvbUVsLCB0b0VsKSB7XG4gICAgdmFyIGN1ckNoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgIHZhciBuZXh0Q2hpbGQgPSBjdXJDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgdG9FbC5hcHBlbmRDaGlsZChjdXJDaGlsZCk7XG4gICAgICAgIGN1ckNoaWxkID0gbmV4dENoaWxkO1xuICAgIH1cbiAgICByZXR1cm4gdG9FbDtcbn1cblxuZnVuY3Rpb24gc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsIG5hbWUpIHtcbiAgICBpZiAoZnJvbUVsW25hbWVdICE9PSB0b0VsW25hbWVdKSB7XG4gICAgICAgIGZyb21FbFtuYW1lXSA9IHRvRWxbbmFtZV07XG4gICAgICAgIGlmIChmcm9tRWxbbmFtZV0pIHtcbiAgICAgICAgICAgIGZyb21FbC5zZXRBdHRyaWJ1dGUobmFtZSwgJycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxudmFyIHNwZWNpYWxFbEhhbmRsZXJzID0ge1xuICAgIE9QVElPTjogZnVuY3Rpb24oZnJvbUVsLCB0b0VsKSB7XG4gICAgICAgIHZhciBwYXJlbnROb2RlID0gZnJvbUVsLnBhcmVudE5vZGU7XG4gICAgICAgIGlmIChwYXJlbnROb2RlKSB7XG4gICAgICAgICAgICB2YXIgcGFyZW50TmFtZSA9IHBhcmVudE5vZGUubm9kZU5hbWUudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIGlmIChwYXJlbnROYW1lID09PSAnT1BUR1JPVVAnKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZSA9IHBhcmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBwYXJlbnROYW1lID0gcGFyZW50Tm9kZSAmJiBwYXJlbnROb2RlLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFyZW50TmFtZSA9PT0gJ1NFTEVDVCcgJiYgIXBhcmVudE5vZGUuaGFzQXR0cmlidXRlKCdtdWx0aXBsZScpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZyb21FbC5oYXNBdHRyaWJ1dGUoJ3NlbGVjdGVkJykgJiYgIXRvRWwuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgTVMgRWRnZSBidWcgd2hlcmUgdGhlICdzZWxlY3RlZCcgYXR0cmlidXRlIGNhbiBvbmx5IGJlXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZWQgaWYgc2V0IHRvIGEgbm9uLWVtcHR5IHZhbHVlOlxuICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5taWNyb3NvZnQuY29tL2VuLXVzL21pY3Jvc29mdC1lZGdlL3BsYXRmb3JtL2lzc3Vlcy8xMjA4NzY3OS9cbiAgICAgICAgICAgICAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZSgnc2VsZWN0ZWQnLCAnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZSgnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byByZXNldCBzZWxlY3QgZWxlbWVudCdzIHNlbGVjdGVkSW5kZXggdG8gLTEsIG90aGVyd2lzZSBzZXR0aW5nXG4gICAgICAgICAgICAgICAgLy8gZnJvbUVsLnNlbGVjdGVkIHVzaW5nIHRoZSBzeW5jQm9vbGVhbkF0dHJQcm9wIGJlbG93IGhhcyBubyBlZmZlY3QuXG4gICAgICAgICAgICAgICAgLy8gVGhlIGNvcnJlY3Qgc2VsZWN0ZWRJbmRleCB3aWxsIGJlIHNldCBpbiB0aGUgU0VMRUNUIHNwZWNpYWwgaGFuZGxlciBiZWxvdy5cbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLnNlbGVjdGVkSW5kZXggPSAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzeW5jQm9vbGVhbkF0dHJQcm9wKGZyb21FbCwgdG9FbCwgJ3NlbGVjdGVkJyk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBUaGUgXCJ2YWx1ZVwiIGF0dHJpYnV0ZSBpcyBzcGVjaWFsIGZvciB0aGUgPGlucHV0PiBlbGVtZW50IHNpbmNlIGl0IHNldHNcbiAgICAgKiB0aGUgaW5pdGlhbCB2YWx1ZS4gQ2hhbmdpbmcgdGhlIFwidmFsdWVcIiBhdHRyaWJ1dGUgd2l0aG91dCBjaGFuZ2luZyB0aGVcbiAgICAgKiBcInZhbHVlXCIgcHJvcGVydHkgd2lsbCBoYXZlIG5vIGVmZmVjdCBzaW5jZSBpdCBpcyBvbmx5IHVzZWQgdG8gdGhlIHNldCB0aGVcbiAgICAgKiBpbml0aWFsIHZhbHVlLiAgU2ltaWxhciBmb3IgdGhlIFwiY2hlY2tlZFwiIGF0dHJpYnV0ZSwgYW5kIFwiZGlzYWJsZWRcIi5cbiAgICAgKi9cbiAgICBJTlBVVDogZnVuY3Rpb24oZnJvbUVsLCB0b0VsKSB7XG4gICAgICAgIHN5bmNCb29sZWFuQXR0clByb3AoZnJvbUVsLCB0b0VsLCAnY2hlY2tlZCcpO1xuICAgICAgICBzeW5jQm9vbGVhbkF0dHJQcm9wKGZyb21FbCwgdG9FbCwgJ2Rpc2FibGVkJyk7XG5cbiAgICAgICAgaWYgKGZyb21FbC52YWx1ZSAhPT0gdG9FbC52YWx1ZSkge1xuICAgICAgICAgICAgZnJvbUVsLnZhbHVlID0gdG9FbC52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdG9FbC5oYXNBdHRyaWJ1dGUoJ3ZhbHVlJykpIHtcbiAgICAgICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgVEVYVEFSRUE6IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICB2YXIgbmV3VmFsdWUgPSB0b0VsLnZhbHVlO1xuICAgICAgICBpZiAoZnJvbUVsLnZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgZnJvbUVsLnZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmlyc3RDaGlsZCA9IGZyb21FbC5maXJzdENoaWxkO1xuICAgICAgICBpZiAoZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgLy8gTmVlZGVkIGZvciBJRS4gQXBwYXJlbnRseSBJRSBzZXRzIHRoZSBwbGFjZWhvbGRlciBhcyB0aGVcbiAgICAgICAgICAgIC8vIG5vZGUgdmFsdWUgYW5kIHZpc2UgdmVyc2EuIFRoaXMgaWdub3JlcyBhbiBlbXB0eSB1cGRhdGUuXG4gICAgICAgICAgICB2YXIgb2xkVmFsdWUgPSBmaXJzdENoaWxkLm5vZGVWYWx1ZTtcblxuICAgICAgICAgICAgaWYgKG9sZFZhbHVlID09IG5ld1ZhbHVlIHx8ICghbmV3VmFsdWUgJiYgb2xkVmFsdWUgPT0gZnJvbUVsLnBsYWNlaG9sZGVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmlyc3RDaGlsZC5ub2RlVmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgU0VMRUNUOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgaWYgKCF0b0VsLmhhc0F0dHJpYnV0ZSgnbXVsdGlwbGUnKSkge1xuICAgICAgICAgICAgdmFyIHNlbGVjdGVkSW5kZXggPSAtMTtcbiAgICAgICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gbG9vcCB0aHJvdWdoIGNoaWxkcmVuIG9mIGZyb21FbCwgbm90IHRvRWwgc2luY2Ugbm9kZXMgY2FuIGJlIG1vdmVkXG4gICAgICAgICAgICAvLyBmcm9tIHRvRWwgdG8gZnJvbUVsIGRpcmVjdGx5IHdoZW4gbW9ycGhpbmcuXG4gICAgICAgICAgICAvLyBBdCB0aGUgdGltZSB0aGlzIHNwZWNpYWwgaGFuZGxlciBpcyBpbnZva2VkLCBhbGwgY2hpbGRyZW4gaGF2ZSBhbHJlYWR5IGJlZW4gbW9ycGhlZFxuICAgICAgICAgICAgLy8gYW5kIGFwcGVuZGVkIHRvIC8gcmVtb3ZlZCBmcm9tIGZyb21FbCwgc28gdXNpbmcgZnJvbUVsIGhlcmUgaXMgc2FmZSBhbmQgY29ycmVjdC5cbiAgICAgICAgICAgIHZhciBjdXJDaGlsZCA9IGZyb21FbC5maXJzdENoaWxkO1xuICAgICAgICAgICAgdmFyIG9wdGdyb3VwO1xuICAgICAgICAgICAgdmFyIG5vZGVOYW1lO1xuICAgICAgICAgICAgd2hpbGUoY3VyQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICBub2RlTmFtZSA9IGN1ckNoaWxkLm5vZGVOYW1lICYmIGN1ckNoaWxkLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGVOYW1lID09PSAnT1BUR1JPVVAnKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGdyb3VwID0gY3VyQ2hpbGQ7XG4gICAgICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gb3B0Z3JvdXAuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZU5hbWUgPT09ICdPUFRJT04nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyQ2hpbGQuaGFzQXR0cmlidXRlKCdzZWxlY3RlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBjdXJDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjdXJDaGlsZCAmJiBvcHRncm91cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBvcHRncm91cC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGdyb3VwID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnJvbUVsLnNlbGVjdGVkSW5kZXggPSBzZWxlY3RlZEluZGV4O1xuICAgICAgICB9XG4gICAgfVxufTtcblxudmFyIEVMRU1FTlRfTk9ERSA9IDE7XG52YXIgRE9DVU1FTlRfRlJBR01FTlRfTk9ERSQxID0gMTE7XG52YXIgVEVYVF9OT0RFID0gMztcbnZhciBDT01NRU5UX05PREUgPSA4O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxuZnVuY3Rpb24gZGVmYXVsdEdldE5vZGVLZXkobm9kZSkge1xuICBpZiAobm9kZSkge1xuICAgICAgcmV0dXJuIChub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKSkgfHwgbm9kZS5pZDtcbiAgfVxufVxuXG5mdW5jdGlvbiBtb3JwaGRvbUZhY3RvcnkobW9ycGhBdHRycykge1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG1vcnBoZG9tKGZyb21Ob2RlLCB0b05vZGUsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRvTm9kZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChmcm9tTm9kZS5ub2RlTmFtZSA9PT0gJyNkb2N1bWVudCcgfHwgZnJvbU5vZGUubm9kZU5hbWUgPT09ICdIVE1MJyB8fCBmcm9tTm9kZS5ub2RlTmFtZSA9PT0gJ0JPRFknKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRvTm9kZUh0bWwgPSB0b05vZGU7XG4gICAgICAgICAgICAgICAgdG9Ob2RlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2h0bWwnKTtcbiAgICAgICAgICAgICAgICB0b05vZGUuaW5uZXJIVE1MID0gdG9Ob2RlSHRtbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdG9Ob2RlID0gdG9FbGVtZW50KHRvTm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZ2V0Tm9kZUtleSA9IG9wdGlvbnMuZ2V0Tm9kZUtleSB8fCBkZWZhdWx0R2V0Tm9kZUtleTtcbiAgICAgICAgdmFyIG9uQmVmb3JlTm9kZUFkZGVkID0gb3B0aW9ucy5vbkJlZm9yZU5vZGVBZGRlZCB8fCBub29wO1xuICAgICAgICB2YXIgb25Ob2RlQWRkZWQgPSBvcHRpb25zLm9uTm9kZUFkZGVkIHx8IG5vb3A7XG4gICAgICAgIHZhciBvbkJlZm9yZUVsVXBkYXRlZCA9IG9wdGlvbnMub25CZWZvcmVFbFVwZGF0ZWQgfHwgbm9vcDtcbiAgICAgICAgdmFyIG9uRWxVcGRhdGVkID0gb3B0aW9ucy5vbkVsVXBkYXRlZCB8fCBub29wO1xuICAgICAgICB2YXIgb25CZWZvcmVOb2RlRGlzY2FyZGVkID0gb3B0aW9ucy5vbkJlZm9yZU5vZGVEaXNjYXJkZWQgfHwgbm9vcDtcbiAgICAgICAgdmFyIG9uTm9kZURpc2NhcmRlZCA9IG9wdGlvbnMub25Ob2RlRGlzY2FyZGVkIHx8IG5vb3A7XG4gICAgICAgIHZhciBvbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkID0gb3B0aW9ucy5vbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkIHx8IG5vb3A7XG4gICAgICAgIHZhciBjaGlsZHJlbk9ubHkgPSBvcHRpb25zLmNoaWxkcmVuT25seSA9PT0gdHJ1ZTtcblxuICAgICAgICAvLyBUaGlzIG9iamVjdCBpcyB1c2VkIGFzIGEgbG9va3VwIHRvIHF1aWNrbHkgZmluZCBhbGwga2V5ZWQgZWxlbWVudHMgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLlxuICAgICAgICB2YXIgZnJvbU5vZGVzTG9va3VwID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgdmFyIGtleWVkUmVtb3ZhbExpc3QgPSBbXTtcblxuICAgICAgICBmdW5jdGlvbiBhZGRLZXllZFJlbW92YWwoa2V5KSB7XG4gICAgICAgICAgICBrZXllZFJlbW92YWxMaXN0LnB1c2goa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHdhbGtEaXNjYXJkZWRDaGlsZE5vZGVzKG5vZGUsIHNraXBLZXllZE5vZGVzKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1ckNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuICAgICAgICAgICAgICAgIHdoaWxlIChjdXJDaGlsZCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNraXBLZXllZE5vZGVzICYmIChrZXkgPSBnZXROb2RlS2V5KGN1ckNoaWxkKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHdlIGFyZSBza2lwcGluZyBrZXllZCBub2RlcyB0aGVuIHdlIGFkZCB0aGUga2V5XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0byBhIGxpc3Qgc28gdGhhdCBpdCBjYW4gYmUgaGFuZGxlZCBhdCB0aGUgdmVyeSBlbmQuXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRLZXllZFJlbW92YWwoa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9ubHkgcmVwb3J0IHRoZSBub2RlIGFzIGRpc2NhcmRlZCBpZiBpdCBpcyBub3Qga2V5ZWQuIFdlIGRvIHRoaXMgYmVjYXVzZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXQgdGhlIGVuZCB3ZSBsb29wIHRocm91Z2ggYWxsIGtleWVkIGVsZW1lbnRzIHRoYXQgd2VyZSB1bm1hdGNoZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuZCB0aGVuIGRpc2NhcmQgdGhlbSBpbiBvbmUgZmluYWwgcGFzcy5cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChjdXJDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyQ2hpbGQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhbGtEaXNjYXJkZWRDaGlsZE5vZGVzKGN1ckNoaWxkLCBza2lwS2V5ZWROb2Rlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIGEgRE9NIG5vZGUgb3V0IG9mIHRoZSBvcmlnaW5hbCBET01cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7Tm9kZX0gbm9kZSBUaGUgbm9kZSB0byByZW1vdmVcbiAgICAgICAgICogQHBhcmFtICB7Tm9kZX0gcGFyZW50Tm9kZSBUaGUgbm9kZXMgcGFyZW50XG4gICAgICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IHNraXBLZXllZE5vZGVzIElmIHRydWUgdGhlbiBlbGVtZW50cyB3aXRoIGtleXMgd2lsbCBiZSBza2lwcGVkIGFuZCBub3QgZGlzY2FyZGVkLlxuICAgICAgICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZW1vdmVOb2RlKG5vZGUsIHBhcmVudE5vZGUsIHNraXBLZXllZE5vZGVzKSB7XG4gICAgICAgICAgICBpZiAob25CZWZvcmVOb2RlRGlzY2FyZGVkKG5vZGUpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvbk5vZGVEaXNjYXJkZWQobm9kZSk7XG4gICAgICAgICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2Rlcyhub2RlLCBza2lwS2V5ZWROb2Rlcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAvLyBUcmVlV2Fsa2VyIGltcGxlbWVudGF0aW9uIGlzIG5vIGZhc3RlciwgYnV0IGtlZXBpbmcgdGhpcyBhcm91bmQgaW4gY2FzZSB0aGlzIGNoYW5nZXMgaW4gdGhlIGZ1dHVyZVxuICAgICAgICAvLyBmdW5jdGlvbiBpbmRleFRyZWUocm9vdCkge1xuICAgICAgICAvLyAgICAgdmFyIHRyZWVXYWxrZXIgPSBkb2N1bWVudC5jcmVhdGVUcmVlV2Fsa2VyKFxuICAgICAgICAvLyAgICAgICAgIHJvb3QsXG4gICAgICAgIC8vICAgICAgICAgTm9kZUZpbHRlci5TSE9XX0VMRU1FTlQpO1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgdmFyIGVsO1xuICAgICAgICAvLyAgICAgd2hpbGUoKGVsID0gdHJlZVdhbGtlci5uZXh0Tm9kZSgpKSkge1xuICAgICAgICAvLyAgICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGVsKTtcbiAgICAgICAgLy8gICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIGZyb21Ob2Rlc0xvb2t1cFtrZXldID0gZWw7XG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gLy8gTm9kZUl0ZXJhdG9yIGltcGxlbWVudGF0aW9uIGlzIG5vIGZhc3RlciwgYnV0IGtlZXBpbmcgdGhpcyBhcm91bmQgaW4gY2FzZSB0aGlzIGNoYW5nZXMgaW4gdGhlIGZ1dHVyZVxuICAgICAgICAvL1xuICAgICAgICAvLyBmdW5jdGlvbiBpbmRleFRyZWUobm9kZSkge1xuICAgICAgICAvLyAgICAgdmFyIG5vZGVJdGVyYXRvciA9IGRvY3VtZW50LmNyZWF0ZU5vZGVJdGVyYXRvcihub2RlLCBOb2RlRmlsdGVyLlNIT1dfRUxFTUVOVCk7XG4gICAgICAgIC8vICAgICB2YXIgZWw7XG4gICAgICAgIC8vICAgICB3aGlsZSgoZWwgPSBub2RlSXRlcmF0b3IubmV4dE5vZGUoKSkpIHtcbiAgICAgICAgLy8gICAgICAgICB2YXIga2V5ID0gZ2V0Tm9kZUtleShlbCk7XG4gICAgICAgIC8vICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAvLyAgICAgICAgICAgICBmcm9tTm9kZXNMb29rdXBba2V5XSA9IGVsO1xuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGZ1bmN0aW9uIGluZGV4VHJlZShub2RlKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFIHx8IG5vZGUubm9kZVR5cGUgPT09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUkMSkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJDaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoY3VyQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tTm9kZXNMb29rdXBba2V5XSA9IGN1ckNoaWxkO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gV2FsayByZWN1cnNpdmVseVxuICAgICAgICAgICAgICAgICAgICBpbmRleFRyZWUoY3VyQ2hpbGQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaW5kZXhUcmVlKGZyb21Ob2RlKTtcblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVOb2RlQWRkZWQoZWwpIHtcbiAgICAgICAgICAgIG9uTm9kZUFkZGVkKGVsKTtcblxuICAgICAgICAgICAgdmFyIGN1ckNoaWxkID0gZWwuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHdoaWxlIChjdXJDaGlsZCkge1xuICAgICAgICAgICAgICAgIHZhciBuZXh0U2libGluZyA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoY3VyQ2hpbGQpO1xuICAgICAgICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVubWF0Y2hlZEZyb21FbCA9IGZyb21Ob2Rlc0xvb2t1cFtrZXldO1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB3ZSBmaW5kIGEgZHVwbGljYXRlICNpZCBub2RlIGluIGNhY2hlLCByZXBsYWNlIGBlbGAgd2l0aCBjYWNoZSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAvLyBhbmQgbW9ycGggaXQgdG8gdGhlIGNoaWxkIG5vZGUuXG4gICAgICAgICAgICAgICAgICAgIGlmICh1bm1hdGNoZWRGcm9tRWwgJiYgY29tcGFyZU5vZGVOYW1lcyhjdXJDaGlsZCwgdW5tYXRjaGVkRnJvbUVsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyQ2hpbGQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQodW5tYXRjaGVkRnJvbUVsLCBjdXJDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb3JwaEVsKHVubWF0Y2hlZEZyb21FbCwgY3VyQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZU5vZGVBZGRlZChjdXJDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgLy8gcmVjdXJzaXZlbHkgY2FsbCBmb3IgY3VyQ2hpbGQgYW5kIGl0J3MgY2hpbGRyZW4gdG8gc2VlIGlmIHdlIGZpbmQgc29tZXRoaW5nIGluXG4gICAgICAgICAgICAgICAgICAvLyBmcm9tTm9kZXNMb29rdXBcbiAgICAgICAgICAgICAgICAgIGhhbmRsZU5vZGVBZGRlZChjdXJDaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBuZXh0U2libGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNsZWFudXBGcm9tRWwoZnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkLCBjdXJGcm9tTm9kZUtleSkge1xuICAgICAgICAgICAgLy8gV2UgaGF2ZSBwcm9jZXNzZWQgYWxsIG9mIHRoZSBcInRvIG5vZGVzXCIuIElmIGN1ckZyb21Ob2RlQ2hpbGQgaXNcbiAgICAgICAgICAgIC8vIG5vbi1udWxsIHRoZW4gd2Ugc3RpbGwgaGF2ZSBzb21lIGZyb20gbm9kZXMgbGVmdCBvdmVyIHRoYXQgbmVlZFxuICAgICAgICAgICAgLy8gdG8gYmUgcmVtb3ZlZFxuICAgICAgICAgICAgd2hpbGUgKGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBpZiAoKGN1ckZyb21Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJGcm9tTm9kZUNoaWxkKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luY2UgdGhlIG5vZGUgaXMga2V5ZWQgaXQgbWlnaHQgYmUgbWF0Y2hlZCB1cCBsYXRlciBzbyB3ZSBkZWZlclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHJlbW92YWwgdG8gbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGN1ckZyb21Ob2RlS2V5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiB3ZSBza2lwIG5lc3RlZCBrZXllZCBub2RlcyBmcm9tIGJlaW5nIHJlbW92ZWQgc2luY2UgdGhlcmUgaXNcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgc3RpbGwgYSBjaGFuY2UgdGhleSB3aWxsIGJlIG1hdGNoZWQgdXAgbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tRWwsIHRydWUgLyogc2tpcCBrZXllZCBub2RlcyAqLyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBtb3JwaEVsKGZyb21FbCwgdG9FbCwgY2hpbGRyZW5Pbmx5KSB7XG4gICAgICAgICAgICB2YXIgdG9FbEtleSA9IGdldE5vZGVLZXkodG9FbCk7XG5cbiAgICAgICAgICAgIGlmICh0b0VsS2V5KSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgYW4gZWxlbWVudCB3aXRoIGFuIElEIGlzIGJlaW5nIG1vcnBoZWQgdGhlbiBpdCB3aWxsIGJlIGluIHRoZSBmaW5hbFxuICAgICAgICAgICAgICAgIC8vIERPTSBzbyBjbGVhciBpdCBvdXQgb2YgdGhlIHNhdmVkIGVsZW1lbnRzIGNvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICBkZWxldGUgZnJvbU5vZGVzTG9va3VwW3RvRWxLZXldO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWNoaWxkcmVuT25seSkge1xuICAgICAgICAgICAgICAgIC8vIG9wdGlvbmFsXG4gICAgICAgICAgICAgICAgaWYgKG9uQmVmb3JlRWxVcGRhdGVkKGZyb21FbCwgdG9FbCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgYXR0cmlidXRlcyBvbiBvcmlnaW5hbCBET00gZWxlbWVudCBmaXJzdFxuICAgICAgICAgICAgICAgIG1vcnBoQXR0cnMoZnJvbUVsLCB0b0VsKTtcbiAgICAgICAgICAgICAgICAvLyBvcHRpb25hbFxuICAgICAgICAgICAgICAgIG9uRWxVcGRhdGVkKGZyb21FbCk7XG5cbiAgICAgICAgICAgICAgICBpZiAob25CZWZvcmVFbENoaWxkcmVuVXBkYXRlZChmcm9tRWwsIHRvRWwpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZnJvbUVsLm5vZGVOYW1lICE9PSAnVEVYVEFSRUEnKSB7XG4gICAgICAgICAgICAgIG1vcnBoQ2hpbGRyZW4oZnJvbUVsLCB0b0VsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNwZWNpYWxFbEhhbmRsZXJzLlRFWFRBUkVBKGZyb21FbCwgdG9FbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBtb3JwaENoaWxkcmVuKGZyb21FbCwgdG9FbCkge1xuICAgICAgICAgICAgdmFyIGN1clRvTm9kZUNoaWxkID0gdG9FbC5maXJzdENoaWxkO1xuICAgICAgICAgICAgdmFyIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHZhciBjdXJUb05vZGVLZXk7XG4gICAgICAgICAgICB2YXIgY3VyRnJvbU5vZGVLZXk7XG5cbiAgICAgICAgICAgIHZhciBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB2YXIgdG9OZXh0U2libGluZztcbiAgICAgICAgICAgIHZhciBtYXRjaGluZ0Zyb21FbDtcblxuICAgICAgICAgICAgLy8gd2FsayB0aGUgY2hpbGRyZW5cbiAgICAgICAgICAgIG91dGVyOiB3aGlsZSAoY3VyVG9Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICB0b05leHRTaWJsaW5nID0gY3VyVG9Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJUb05vZGVDaGlsZCk7XG5cbiAgICAgICAgICAgICAgICAvLyB3YWxrIHRoZSBmcm9tTm9kZSBjaGlsZHJlbiBhbGwgdGhlIHdheSB0aHJvdWdoXG4gICAgICAgICAgICAgICAgd2hpbGUgKGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZC5uZXh0U2libGluZztcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlQ2hpbGQuaXNTYW1lTm9kZSAmJiBjdXJUb05vZGVDaGlsZC5pc1NhbWVOb2RlKGN1ckZyb21Ob2RlQ2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUtleSA9IGdldE5vZGVLZXkoY3VyRnJvbU5vZGVDaGlsZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1ckZyb21Ob2RlVHlwZSA9IGN1ckZyb21Ob2RlQ2hpbGQubm9kZVR5cGU7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBtZWFucyBpZiB0aGUgY3VyRnJvbU5vZGVDaGlsZCBkb2VzbnQgaGF2ZSBhIG1hdGNoIHdpdGggdGhlIGN1clRvTm9kZUNoaWxkXG4gICAgICAgICAgICAgICAgICAgIHZhciBpc0NvbXBhdGlibGUgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlVHlwZSA9PT0gY3VyVG9Ob2RlQ2hpbGQubm9kZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJvdGggbm9kZXMgYmVpbmcgY29tcGFyZWQgYXJlIEVsZW1lbnQgbm9kZXNcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJUb05vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIHRhcmdldCBub2RlIGhhcyBhIGtleSBzbyB3ZSB3YW50IHRvIG1hdGNoIGl0IHVwIHdpdGggdGhlIGNvcnJlY3QgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbiB0aGUgb3JpZ2luYWwgRE9NIHRyZWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUtleSAhPT0gY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBjdXJyZW50IGVsZW1lbnQgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlIGRvZXMgbm90IGhhdmUgYSBtYXRjaGluZyBrZXkgc29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxldCdzIGNoZWNrIG91ciBsb29rdXAgdG8gc2VlIGlmIHRoZXJlIGlzIGEgbWF0Y2hpbmcgZWxlbWVudCBpbiB0aGUgb3JpZ2luYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERPTSB0cmVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKG1hdGNoaW5nRnJvbUVsID0gZnJvbU5vZGVzTG9va3VwW2N1clRvTm9kZUtleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZyb21OZXh0U2libGluZyA9PT0gbWF0Y2hpbmdGcm9tRWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciBzaW5nbGUgZWxlbWVudCByZW1vdmFscy4gVG8gYXZvaWQgcmVtb3ZpbmcgdGhlIG9yaWdpbmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERPTSBub2RlIG91dCBvZiB0aGUgdHJlZSAoc2luY2UgdGhhdCBjYW4gYnJlYWsgQ1NTIHRyYW5zaXRpb25zLCBldGMuKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2Ugd2lsbCBpbnN0ZWFkIGRpc2NhcmQgdGhlIGN1cnJlbnQgbm9kZSBhbmQgd2FpdCB1bnRpbCB0aGUgbmV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpdGVyYXRpb24gdG8gcHJvcGVybHkgbWF0Y2ggdXAgdGhlIGtleWVkIHRhcmdldCBlbGVtZW50IHdpdGggaXRzIG1hdGNoaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVsZW1lbnQgaW4gdGhlIG9yaWdpbmFsIHRyZWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgZm91bmQgYSBtYXRjaGluZyBrZXllZCBlbGVtZW50IHNvbWV3aGVyZSBpbiB0aGUgb3JpZ2luYWwgRE9NIHRyZWUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExldCdzIG1vdmUgdGhlIG9yaWdpbmFsIERPTSBub2RlIGludG8gdGhlIGN1cnJlbnQgcG9zaXRpb24gYW5kIG1vcnBoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0LlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IFdlIHVzZSBpbnNlcnRCZWZvcmUgaW5zdGVhZCBvZiByZXBsYWNlQ2hpbGQgYmVjYXVzZSB3ZSB3YW50IHRvIGdvIHRocm91Z2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGByZW1vdmVOb2RlKClgIGZ1bmN0aW9uIGZvciB0aGUgbm9kZSB0aGF0IGlzIGJlaW5nIGRpc2NhcmRlZCBzbyB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsbCBsaWZlY3ljbGUgaG9va3MgYXJlIGNvcnJlY3RseSBpbnZva2VkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21FbC5pbnNlcnRCZWZvcmUobWF0Y2hpbmdGcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSB0aGUgbm9kZSBpcyBrZXllZCBpdCBtaWdodCBiZSBtYXRjaGVkIHVwIGxhdGVyIHNvIHdlIGRlZmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHJlbW92YWwgdG8gbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiB3ZSBza2lwIG5lc3RlZCBrZXllZCBub2RlcyBmcm9tIGJlaW5nIHJlbW92ZWQgc2luY2UgdGhlcmUgaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgIHN0aWxsIGEgY2hhbmNlIHRoZXkgd2lsbCBiZSBtYXRjaGVkIHVwIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21FbCwgdHJ1ZSAvKiBza2lwIGtleWVkIG5vZGVzICovKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBtYXRjaGluZ0Zyb21FbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBub2RlcyBhcmUgbm90IGNvbXBhdGlibGUgc2luY2UgdGhlIFwidG9cIiBub2RlIGhhcyBhIGtleSBhbmQgdGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpcyBubyBtYXRjaGluZyBrZXllZCBub2RlIGluIHRoZSBzb3VyY2UgdHJlZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJGcm9tTm9kZUtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgb3JpZ2luYWwgaGFzIGEga2V5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGlzQ29tcGF0aWJsZSAhPT0gZmFsc2UgJiYgY29tcGFyZU5vZGVOYW1lcyhjdXJGcm9tTm9kZUNoaWxkLCBjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ29tcGF0aWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBmb3VuZCBjb21wYXRpYmxlIERPTSBlbGVtZW50cyBzbyB0cmFuc2Zvcm1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGN1cnJlbnQgXCJmcm9tXCIgbm9kZSB0byBtYXRjaCB0aGUgY3VycmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0YXJnZXQgRE9NIG5vZGUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1PUlBIXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vcnBoRWwoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJGcm9tTm9kZVR5cGUgPT09IFRFWFRfTk9ERSB8fCBjdXJGcm9tTm9kZVR5cGUgPT0gQ09NTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQm90aCBub2RlcyBiZWluZyBjb21wYXJlZCBhcmUgVGV4dCBvciBDb21tZW50IG5vZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbHkgdXBkYXRlIG5vZGVWYWx1ZSBvbiB0aGUgb3JpZ2luYWwgbm9kZSB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoYW5nZSB0aGUgdGV4dCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZUNoaWxkLm5vZGVWYWx1ZSAhPT0gY3VyVG9Ob2RlQ2hpbGQubm9kZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQubm9kZVZhbHVlID0gY3VyVG9Ob2RlQ2hpbGQubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ29tcGF0aWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWR2YW5jZSBib3RoIHRoZSBcInRvXCIgY2hpbGQgYW5kIHRoZSBcImZyb21cIiBjaGlsZCBzaW5jZSB3ZSBmb3VuZCBhIG1hdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBOb3RoaW5nIGVsc2UgdG8gZG8gYXMgd2UgYWxyZWFkeSByZWN1cnNpdmVseSBjYWxsZWQgbW9ycGhDaGlsZHJlbiBhYm92ZVxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTm8gY29tcGF0aWJsZSBtYXRjaCBzbyByZW1vdmUgdGhlIG9sZCBub2RlIGZyb20gdGhlIERPTSBhbmQgY29udGludWUgdHJ5aW5nIHRvIGZpbmQgYVxuICAgICAgICAgICAgICAgICAgICAvLyBtYXRjaCBpbiB0aGUgb3JpZ2luYWwgRE9NLiBIb3dldmVyLCB3ZSBvbmx5IGRvIHRoaXMgaWYgdGhlIGZyb20gbm9kZSBpcyBub3Qga2V5ZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gc2luY2UgaXQgaXMgcG9zc2libGUgdGhhdCBhIGtleWVkIG5vZGUgbWlnaHQgbWF0Y2ggdXAgd2l0aCBhIG5vZGUgc29tZXdoZXJlIGVsc2UgaW4gdGhlXG4gICAgICAgICAgICAgICAgICAgIC8vIHRhcmdldCB0cmVlIGFuZCB3ZSBkb24ndCB3YW50IHRvIGRpc2NhcmQgaXQganVzdCB5ZXQgc2luY2UgaXQgc3RpbGwgbWlnaHQgZmluZCBhXG4gICAgICAgICAgICAgICAgICAgIC8vIGhvbWUgaW4gdGhlIGZpbmFsIERPTSB0cmVlLiBBZnRlciBldmVyeXRoaW5nIGlzIGRvbmUgd2Ugd2lsbCByZW1vdmUgYW55IGtleWVkIG5vZGVzXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoYXQgZGlkbid0IGZpbmQgYSBob21lXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZUtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2luY2UgdGhlIG5vZGUgaXMga2V5ZWQgaXQgbWlnaHQgYmUgbWF0Y2hlZCB1cCBsYXRlciBzbyB3ZSBkZWZlclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGFjdHVhbCByZW1vdmFsIHRvIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRLZXllZFJlbW92YWwoY3VyRnJvbU5vZGVLZXkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTk9URTogd2Ugc2tpcCBuZXN0ZWQga2V5ZWQgbm9kZXMgZnJvbSBiZWluZyByZW1vdmVkIHNpbmNlIHRoZXJlIGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICBzdGlsbCBhIGNoYW5jZSB0aGV5IHdpbGwgYmUgbWF0Y2hlZCB1cCBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tRWwsIHRydWUgLyogc2tpcCBrZXllZCBub2RlcyAqLyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIH0gLy8gRU5EOiB3aGlsZShjdXJGcm9tTm9kZUNoaWxkKSB7fVxuXG4gICAgICAgICAgICAgICAgLy8gSWYgd2UgZ290IHRoaXMgZmFyIHRoZW4gd2UgZGlkIG5vdCBmaW5kIGEgY2FuZGlkYXRlIG1hdGNoIGZvclxuICAgICAgICAgICAgICAgIC8vIG91ciBcInRvIG5vZGVcIiBhbmQgd2UgZXhoYXVzdGVkIGFsbCBvZiB0aGUgY2hpbGRyZW4gXCJmcm9tXCJcbiAgICAgICAgICAgICAgICAvLyBub2Rlcy4gVGhlcmVmb3JlLCB3ZSB3aWxsIGp1c3QgYXBwZW5kIHRoZSBjdXJyZW50IFwidG9cIiBub2RlXG4gICAgICAgICAgICAgICAgLy8gdG8gdGhlIGVuZFxuICAgICAgICAgICAgICAgIGlmIChjdXJUb05vZGVLZXkgJiYgKG1hdGNoaW5nRnJvbUVsID0gZnJvbU5vZGVzTG9va3VwW2N1clRvTm9kZUtleV0pICYmIGNvbXBhcmVOb2RlTmFtZXMobWF0Y2hpbmdGcm9tRWwsIGN1clRvTm9kZUNoaWxkKSkge1xuICAgICAgICAgICAgICAgICAgICBmcm9tRWwuYXBwZW5kQ2hpbGQobWF0Y2hpbmdGcm9tRWwpO1xuICAgICAgICAgICAgICAgICAgICAvLyBNT1JQSFxuICAgICAgICAgICAgICAgICAgICBtb3JwaEVsKG1hdGNoaW5nRnJvbUVsLCBjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0ID0gb25CZWZvcmVOb2RlQWRkZWQoY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob25CZWZvcmVOb2RlQWRkZWRSZXN1bHQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob25CZWZvcmVOb2RlQWRkZWRSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlQ2hpbGQuYWN0dWFsaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSBjdXJUb05vZGVDaGlsZC5hY3R1YWxpemUoZnJvbUVsLm93bmVyRG9jdW1lbnQgfHwgZG9jKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb21FbC5hcHBlbmRDaGlsZChjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVOb2RlQWRkZWQoY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNsZWFudXBGcm9tRWwoZnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkLCBjdXJGcm9tTm9kZUtleSk7XG5cbiAgICAgICAgICAgIHZhciBzcGVjaWFsRWxIYW5kbGVyID0gc3BlY2lhbEVsSGFuZGxlcnNbZnJvbUVsLm5vZGVOYW1lXTtcbiAgICAgICAgICAgIGlmIChzcGVjaWFsRWxIYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgc3BlY2lhbEVsSGFuZGxlcihmcm9tRWwsIHRvRWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IC8vIEVORDogbW9ycGhDaGlsZHJlbiguLi4pXG5cbiAgICAgICAgdmFyIG1vcnBoZWROb2RlID0gZnJvbU5vZGU7XG4gICAgICAgIHZhciBtb3JwaGVkTm9kZVR5cGUgPSBtb3JwaGVkTm9kZS5ub2RlVHlwZTtcbiAgICAgICAgdmFyIHRvTm9kZVR5cGUgPSB0b05vZGUubm9kZVR5cGU7XG5cbiAgICAgICAgaWYgKCFjaGlsZHJlbk9ubHkpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsZSB0aGUgY2FzZSB3aGVyZSB3ZSBhcmUgZ2l2ZW4gdHdvIERPTSBub2RlcyB0aGF0IGFyZSBub3RcbiAgICAgICAgICAgIC8vIGNvbXBhdGlibGUgKGUuZy4gPGRpdj4gLS0+IDxzcGFuPiBvciA8ZGl2PiAtLT4gVEVYVClcbiAgICAgICAgICAgIGlmIChtb3JwaGVkTm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgIGlmICh0b05vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb21wYXJlTm9kZU5hbWVzKGZyb21Ob2RlLCB0b05vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbk5vZGVEaXNjYXJkZWQoZnJvbU5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9ycGhlZE5vZGUgPSBtb3ZlQ2hpbGRyZW4oZnJvbU5vZGUsIGNyZWF0ZUVsZW1lbnROUyh0b05vZGUubm9kZU5hbWUsIHRvTm9kZS5uYW1lc3BhY2VVUkkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEdvaW5nIGZyb20gYW4gZWxlbWVudCBub2RlIHRvIGEgdGV4dCBub2RlXG4gICAgICAgICAgICAgICAgICAgIG1vcnBoZWROb2RlID0gdG9Ob2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobW9ycGhlZE5vZGVUeXBlID09PSBURVhUX05PREUgfHwgbW9ycGhlZE5vZGVUeXBlID09PSBDT01NRU5UX05PREUpIHsgLy8gVGV4dCBvciBjb21tZW50IG5vZGVcbiAgICAgICAgICAgICAgICBpZiAodG9Ob2RlVHlwZSA9PT0gbW9ycGhlZE5vZGVUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb3JwaGVkTm9kZS5ub2RlVmFsdWUgIT09IHRvTm9kZS5ub2RlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vcnBoZWROb2RlLm5vZGVWYWx1ZSA9IHRvTm9kZS5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW9ycGhlZE5vZGU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGV4dCBub2RlIHRvIHNvbWV0aGluZyBlbHNlXG4gICAgICAgICAgICAgICAgICAgIG1vcnBoZWROb2RlID0gdG9Ob2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb3JwaGVkTm9kZSA9PT0gdG9Ob2RlKSB7XG4gICAgICAgICAgICAvLyBUaGUgXCJ0byBub2RlXCIgd2FzIG5vdCBjb21wYXRpYmxlIHdpdGggdGhlIFwiZnJvbSBub2RlXCIgc28gd2UgaGFkIHRvXG4gICAgICAgICAgICAvLyB0b3NzIG91dCB0aGUgXCJmcm9tIG5vZGVcIiBhbmQgdXNlIHRoZSBcInRvIG5vZGVcIlxuICAgICAgICAgICAgb25Ob2RlRGlzY2FyZGVkKGZyb21Ob2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0b05vZGUuaXNTYW1lTm9kZSAmJiB0b05vZGUuaXNTYW1lTm9kZShtb3JwaGVkTm9kZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1vcnBoRWwobW9ycGhlZE5vZGUsIHRvTm9kZSwgY2hpbGRyZW5Pbmx5KTtcblxuICAgICAgICAgICAgLy8gV2Ugbm93IG5lZWQgdG8gbG9vcCBvdmVyIGFueSBrZXllZCBub2RlcyB0aGF0IG1pZ2h0IG5lZWQgdG8gYmVcbiAgICAgICAgICAgIC8vIHJlbW92ZWQuIFdlIG9ubHkgZG8gdGhlIHJlbW92YWwgaWYgd2Uga25vdyB0aGF0IHRoZSBrZXllZCBub2RlXG4gICAgICAgICAgICAvLyBuZXZlciBmb3VuZCBhIG1hdGNoLiBXaGVuIGEga2V5ZWQgbm9kZSBpcyBtYXRjaGVkIHVwIHdlIHJlbW92ZVxuICAgICAgICAgICAgLy8gaXQgb3V0IG9mIGZyb21Ob2Rlc0xvb2t1cCBhbmQgd2UgdXNlIGZyb21Ob2Rlc0xvb2t1cCB0byBkZXRlcm1pbmVcbiAgICAgICAgICAgIC8vIGlmIGEga2V5ZWQgbm9kZSBoYXMgYmVlbiBtYXRjaGVkIHVwIG9yIG5vdFxuICAgICAgICAgICAgaWYgKGtleWVkUmVtb3ZhbExpc3QpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTAsIGxlbj1rZXllZFJlbW92YWxMaXN0Lmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWxUb1JlbW92ZSA9IGZyb21Ob2Rlc0xvb2t1cFtrZXllZFJlbW92YWxMaXN0W2ldXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsVG9SZW1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZU5vZGUoZWxUb1JlbW92ZSwgZWxUb1JlbW92ZS5wYXJlbnROb2RlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNoaWxkcmVuT25seSAmJiBtb3JwaGVkTm9kZSAhPT0gZnJvbU5vZGUgJiYgZnJvbU5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgaWYgKG1vcnBoZWROb2RlLmFjdHVhbGl6ZSkge1xuICAgICAgICAgICAgICAgIG1vcnBoZWROb2RlID0gbW9ycGhlZE5vZGUuYWN0dWFsaXplKGZyb21Ob2RlLm93bmVyRG9jdW1lbnQgfHwgZG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElmIHdlIGhhZCB0byBzd2FwIG91dCB0aGUgZnJvbSBub2RlIHdpdGggYSBuZXcgbm9kZSBiZWNhdXNlIHRoZSBvbGRcbiAgICAgICAgICAgIC8vIG5vZGUgd2FzIG5vdCBjb21wYXRpYmxlIHdpdGggdGhlIHRhcmdldCBub2RlIHRoZW4gd2UgbmVlZCB0b1xuICAgICAgICAgICAgLy8gcmVwbGFjZSB0aGUgb2xkIERPTSBub2RlIGluIHRoZSBvcmlnaW5hbCBET00gdHJlZS4gVGhpcyBpcyBvbmx5XG4gICAgICAgICAgICAvLyBwb3NzaWJsZSBpZiB0aGUgb3JpZ2luYWwgRE9NIG5vZGUgd2FzIHBhcnQgb2YgYSBET00gdHJlZSB3aGljaFxuICAgICAgICAgICAgLy8gd2Uga25vdyBpcyB0aGUgY2FzZSBpZiBpdCBoYXMgYSBwYXJlbnQgbm9kZS5cbiAgICAgICAgICAgIGZyb21Ob2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG1vcnBoZWROb2RlLCBmcm9tTm9kZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbW9ycGhlZE5vZGU7XG4gICAgfTtcbn1cblxudmFyIG1vcnBoZG9tID0gbW9ycGhkb21GYWN0b3J5KG1vcnBoQXR0cnMpO1xuXG5leHBvcnQgZGVmYXVsdCBtb3JwaGRvbTtcbiIsICJpbXBvcnQge1xuICBQSFhfQ09NUE9ORU5ULFxuICBQSFhfRElTQUJMRV9XSVRILFxuICBQSFhfRkVFREJBQ0tfRk9SLFxuICBQSFhfUFJVTkUsXG4gIFBIWF9ST09UX0lELFxuICBQSFhfU0VTU0lPTixcbiAgUEhYX1NLSVAsXG4gIFBIWF9TVEFUSUMsXG4gIFBIWF9UUklHR0VSX0FDVElPTixcbiAgUEhYX1VQREFURVxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBkZXRlY3REdXBsaWNhdGVJZHMsXG4gIGlzQ2lkXG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IERPTVBvc3RNb3JwaFJlc3RvcmVyIGZyb20gXCIuL2RvbV9wb3N0X21vcnBoX3Jlc3RvcmVyXCJcbmltcG9ydCBtb3JwaGRvbSBmcm9tIFwibW9ycGhkb21cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBET01QYXRjaCB7XG4gIHN0YXRpYyBwYXRjaEVsKGZyb21FbCwgdG9FbCwgYWN0aXZlRWxlbWVudCl7XG4gICAgbW9ycGhkb20oZnJvbUVsLCB0b0VsLCB7XG4gICAgICBjaGlsZHJlbk9ubHk6IGZhbHNlLFxuICAgICAgb25CZWZvcmVFbFVwZGF0ZWQ6IChmcm9tRWwsIHRvRWwpID0+IHtcbiAgICAgICAgaWYoYWN0aXZlRWxlbWVudCAmJiBhY3RpdmVFbGVtZW50LmlzU2FtZU5vZGUoZnJvbUVsKSAmJiBET00uaXNGb3JtSW5wdXQoZnJvbUVsKSl7XG4gICAgICAgICAgRE9NLm1lcmdlRm9jdXNlZElucHV0KGZyb21FbCwgdG9FbClcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBjb25zdHJ1Y3Rvcih2aWV3LCBjb250YWluZXIsIGlkLCBodG1sLCB0YXJnZXRDSUQpe1xuICAgIHRoaXMudmlldyA9IHZpZXdcbiAgICB0aGlzLmxpdmVTb2NrZXQgPSB2aWV3LmxpdmVTb2NrZXRcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lclxuICAgIHRoaXMuaWQgPSBpZFxuICAgIHRoaXMucm9vdElEID0gdmlldy5yb290LmlkXG4gICAgdGhpcy5odG1sID0gaHRtbFxuICAgIHRoaXMudGFyZ2V0Q0lEID0gdGFyZ2V0Q0lEXG4gICAgdGhpcy5jaWRQYXRjaCA9IGlzQ2lkKHRoaXMudGFyZ2V0Q0lEKVxuICAgIHRoaXMuY2FsbGJhY2tzID0ge1xuICAgICAgYmVmb3JlYWRkZWQ6IFtdLCBiZWZvcmV1cGRhdGVkOiBbXSwgYmVmb3JlcGh4Q2hpbGRBZGRlZDogW10sXG4gICAgICBhZnRlcmFkZGVkOiBbXSwgYWZ0ZXJ1cGRhdGVkOiBbXSwgYWZ0ZXJkaXNjYXJkZWQ6IFtdLCBhZnRlcnBoeENoaWxkQWRkZWQ6IFtdLFxuICAgICAgYWZ0ZXJ0cmFuc2l0aW9uc0Rpc2NhcmRlZDogW11cbiAgICB9XG4gIH1cblxuICBiZWZvcmUoa2luZCwgY2FsbGJhY2speyB0aGlzLmNhbGxiYWNrc1tgYmVmb3JlJHtraW5kfWBdLnB1c2goY2FsbGJhY2spIH1cbiAgYWZ0ZXIoa2luZCwgY2FsbGJhY2speyB0aGlzLmNhbGxiYWNrc1tgYWZ0ZXIke2tpbmR9YF0ucHVzaChjYWxsYmFjaykgfVxuXG4gIHRyYWNrQmVmb3JlKGtpbmQsIC4uLmFyZ3Mpe1xuICAgIHRoaXMuY2FsbGJhY2tzW2BiZWZvcmUke2tpbmR9YF0uZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayguLi5hcmdzKSlcbiAgfVxuXG4gIHRyYWNrQWZ0ZXIoa2luZCwgLi4uYXJncyl7XG4gICAgdGhpcy5jYWxsYmFja3NbYGFmdGVyJHtraW5kfWBdLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2soLi4uYXJncykpXG4gIH1cblxuICBtYXJrUHJ1bmFibGVDb250ZW50Rm9yUmVtb3ZhbCgpe1xuICAgIERPTS5hbGwodGhpcy5jb250YWluZXIsIFwiW3BoeC11cGRhdGU9YXBwZW5kXSA+ICosIFtwaHgtdXBkYXRlPXByZXBlbmRdID4gKlwiLCBlbCA9PiB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX1BSVU5FLCBcIlwiKVxuICAgIH0pXG4gIH1cblxuICBwZXJmb3JtKCl7XG4gICAgbGV0IHt2aWV3LCBsaXZlU29ja2V0LCBjb250YWluZXIsIGh0bWx9ID0gdGhpc1xuICAgIGxldCB0YXJnZXRDb250YWluZXIgPSB0aGlzLmlzQ0lEUGF0Y2goKSA/IHRoaXMudGFyZ2V0Q0lEQ29udGFpbmVyKGh0bWwpIDogY29udGFpbmVyXG4gICAgaWYodGhpcy5pc0NJRFBhdGNoKCkgJiYgIXRhcmdldENvbnRhaW5lcil7IHJldHVybiB9XG5cbiAgICBsZXQgZm9jdXNlZCA9IGxpdmVTb2NrZXQuZ2V0QWN0aXZlRWxlbWVudCgpXG4gICAgbGV0IHtzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kfSA9IGZvY3VzZWQgJiYgRE9NLmhhc1NlbGVjdGlvblJhbmdlKGZvY3VzZWQpID8gZm9jdXNlZCA6IHt9XG4gICAgbGV0IHBoeFVwZGF0ZSA9IGxpdmVTb2NrZXQuYmluZGluZyhQSFhfVVBEQVRFKVxuICAgIGxldCBwaHhGZWVkYmFja0ZvciA9IGxpdmVTb2NrZXQuYmluZGluZyhQSFhfRkVFREJBQ0tfRk9SKVxuICAgIGxldCBkaXNhYmxlV2l0aCA9IGxpdmVTb2NrZXQuYmluZGluZyhQSFhfRElTQUJMRV9XSVRIKVxuICAgIGxldCBwaHhUcmlnZ2VyRXh0ZXJuYWwgPSBsaXZlU29ja2V0LmJpbmRpbmcoUEhYX1RSSUdHRVJfQUNUSU9OKVxuICAgIGxldCBwaHhSZW1vdmUgPSBsaXZlU29ja2V0LmJpbmRpbmcoXCJyZW1vdmVcIilcbiAgICBsZXQgYWRkZWQgPSBbXVxuICAgIGxldCB1cGRhdGVzID0gW11cbiAgICBsZXQgYXBwZW5kUHJlcGVuZFVwZGF0ZXMgPSBbXVxuICAgIGxldCBwZW5kaW5nUmVtb3ZlcyA9IFtdXG4gICAgbGV0IGV4dGVybmFsRm9ybVRyaWdnZXJlZCA9IG51bGxcblxuICAgIGxldCBkaWZmSFRNTCA9IGxpdmVTb2NrZXQudGltZShcInByZW1vcnBoIGNvbnRhaW5lciBwcmVwXCIsICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmJ1aWxkRGlmZkhUTUwoY29udGFpbmVyLCBodG1sLCBwaHhVcGRhdGUsIHRhcmdldENvbnRhaW5lcilcbiAgICB9KVxuXG4gICAgdGhpcy50cmFja0JlZm9yZShcImFkZGVkXCIsIGNvbnRhaW5lcilcbiAgICB0aGlzLnRyYWNrQmVmb3JlKFwidXBkYXRlZFwiLCBjb250YWluZXIsIGNvbnRhaW5lcilcblxuICAgIGxpdmVTb2NrZXQudGltZShcIm1vcnBoZG9tXCIsICgpID0+IHtcbiAgICAgIG1vcnBoZG9tKHRhcmdldENvbnRhaW5lciwgZGlmZkhUTUwsIHtcbiAgICAgICAgY2hpbGRyZW5Pbmx5OiB0YXJnZXRDb250YWluZXIuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpID09PSBudWxsLFxuICAgICAgICBnZXROb2RlS2V5OiAobm9kZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBET00uaXNQaHhEZXN0cm95ZWQobm9kZSkgPyBudWxsIDogbm9kZS5pZFxuICAgICAgICB9LFxuICAgICAgICBvbkJlZm9yZU5vZGVBZGRlZDogKGVsKSA9PiB7XG4gICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcImFkZGVkXCIsIGVsKVxuICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICB9LFxuICAgICAgICBvbk5vZGVBZGRlZDogKGVsKSA9PiB7XG4gICAgICAgICAgLy8gaGFjayB0byBmaXggU2FmYXJpIGhhbmRsaW5nIG9mIGltZyBzcmNzZXQgYW5kIHZpZGVvIHRhZ3NcbiAgICAgICAgICBpZihlbCBpbnN0YW5jZW9mIEhUTUxJbWFnZUVsZW1lbnQgJiYgZWwuc3Jjc2V0KXtcbiAgICAgICAgICAgIGVsLnNyY3NldCA9IGVsLnNyY3NldFxuICAgICAgICAgIH0gZWxzZSBpZihlbCBpbnN0YW5jZW9mIEhUTUxWaWRlb0VsZW1lbnQgJiYgZWwuYXV0b3BsYXkpe1xuICAgICAgICAgICAgZWwucGxheSgpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKERPTS5pc05vd1RyaWdnZXJGb3JtRXh0ZXJuYWwoZWwsIHBoeFRyaWdnZXJFeHRlcm5hbCkpe1xuICAgICAgICAgICAgZXh0ZXJuYWxGb3JtVHJpZ2dlcmVkID0gZWxcbiAgICAgICAgICB9XG4gICAgICAgICAgLy9pbnB1dCBoYW5kbGluZ1xuICAgICAgICAgIERPTS5kaXNjYXJkRXJyb3IodGFyZ2V0Q29udGFpbmVyLCBlbCwgcGh4RmVlZGJhY2tGb3IpXG4gICAgICAgICAgLy8gbmVzdGVkIHZpZXcgaGFuZGxpbmdcbiAgICAgICAgICBpZihET00uaXNQaHhDaGlsZChlbCkgJiYgdmlldy5vd25zRWxlbWVudChlbCkpe1xuICAgICAgICAgICAgdGhpcy50cmFja0FmdGVyKFwicGh4Q2hpbGRBZGRlZFwiLCBlbClcbiAgICAgICAgICB9XG4gICAgICAgICAgYWRkZWQucHVzaChlbClcbiAgICAgICAgfSxcbiAgICAgICAgb25Ob2RlRGlzY2FyZGVkOiAoZWwpID0+IHtcbiAgICAgICAgICAvLyBuZXN0ZWQgdmlldyBoYW5kbGluZ1xuICAgICAgICAgIGlmKERPTS5pc1BoeENoaWxkKGVsKSl7IGxpdmVTb2NrZXQuZGVzdHJveVZpZXdCeUVsKGVsKSB9XG4gICAgICAgICAgdGhpcy50cmFja0FmdGVyKFwiZGlzY2FyZGVkXCIsIGVsKVxuICAgICAgICB9LFxuICAgICAgICBvbkJlZm9yZU5vZGVEaXNjYXJkZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIGlmKGVsLmdldEF0dHJpYnV0ZSAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1BSVU5FKSAhPT0gbnVsbCl7IHJldHVybiB0cnVlIH1cbiAgICAgICAgICBpZihlbC5wYXJlbnROb2RlICE9PSBudWxsICYmIERPTS5pc1BoeFVwZGF0ZShlbC5wYXJlbnROb2RlLCBwaHhVcGRhdGUsIFtcImFwcGVuZFwiLCBcInByZXBlbmRcIl0pICYmIGVsLmlkKXsgcmV0dXJuIGZhbHNlIH1cbiAgICAgICAgICBpZihlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKHBoeFJlbW92ZSkpe1xuICAgICAgICAgICAgcGVuZGluZ1JlbW92ZXMucHVzaChlbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZih0aGlzLnNraXBDSURTaWJsaW5nKGVsKSl7IHJldHVybiBmYWxzZSB9XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgb25FbFVwZGF0ZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIGlmKERPTS5pc05vd1RyaWdnZXJGb3JtRXh0ZXJuYWwoZWwsIHBoeFRyaWdnZXJFeHRlcm5hbCkpe1xuICAgICAgICAgICAgZXh0ZXJuYWxGb3JtVHJpZ2dlcmVkID0gZWxcbiAgICAgICAgICB9XG4gICAgICAgICAgdXBkYXRlcy5wdXNoKGVsKVxuICAgICAgICB9LFxuICAgICAgICBvbkJlZm9yZUVsVXBkYXRlZDogKGZyb21FbCwgdG9FbCkgPT4ge1xuICAgICAgICAgIERPTS5jbGVhbkNoaWxkTm9kZXModG9FbCwgcGh4VXBkYXRlKVxuICAgICAgICAgIGlmKHRoaXMuc2tpcENJRFNpYmxpbmcodG9FbCkpeyByZXR1cm4gZmFsc2UgfVxuICAgICAgICAgIGlmKERPTS5pc0lnbm9yZWQoZnJvbUVsLCBwaHhVcGRhdGUpKXtcbiAgICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgIERPTS5tZXJnZUF0dHJzKGZyb21FbCwgdG9FbCwge2lzSWdub3JlZDogdHJ1ZX0pXG4gICAgICAgICAgICB1cGRhdGVzLnB1c2goZnJvbUVsKVxuICAgICAgICAgICAgRE9NLmFwcGx5U3RpY2t5T3BlcmF0aW9ucyhmcm9tRWwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoZnJvbUVsLnR5cGUgPT09IFwibnVtYmVyXCIgJiYgKGZyb21FbC52YWxpZGl0eSAmJiBmcm9tRWwudmFsaWRpdHkuYmFkSW5wdXQpKXsgcmV0dXJuIGZhbHNlIH1cbiAgICAgICAgICBpZighRE9NLnN5bmNQZW5kaW5nUmVmKGZyb21FbCwgdG9FbCwgZGlzYWJsZVdpdGgpKXtcbiAgICAgICAgICAgIGlmKERPTS5pc1VwbG9hZElucHV0KGZyb21FbCkpe1xuICAgICAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwidXBkYXRlZFwiLCBmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgICAgIHVwZGF0ZXMucHVzaChmcm9tRWwpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBET00uYXBwbHlTdGlja3lPcGVyYXRpb25zKGZyb21FbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIG5lc3RlZCB2aWV3IGhhbmRsaW5nXG4gICAgICAgICAgaWYoRE9NLmlzUGh4Q2hpbGQodG9FbCkpe1xuICAgICAgICAgICAgbGV0IHByZXZTZXNzaW9uID0gZnJvbUVsLmdldEF0dHJpYnV0ZShQSFhfU0VTU0lPTilcbiAgICAgICAgICAgIERPTS5tZXJnZUF0dHJzKGZyb21FbCwgdG9FbCwge2V4Y2x1ZGU6IFtQSFhfU1RBVElDXX0pXG4gICAgICAgICAgICBpZihwcmV2U2Vzc2lvbiAhPT0gXCJcIil7IGZyb21FbC5zZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04sIHByZXZTZXNzaW9uKSB9XG4gICAgICAgICAgICBmcm9tRWwuc2V0QXR0cmlidXRlKFBIWF9ST09UX0lELCB0aGlzLnJvb3RJRClcbiAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnMoZnJvbUVsKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gaW5wdXQgaGFuZGxpbmdcbiAgICAgICAgICBET00uY29weVByaXZhdGVzKHRvRWwsIGZyb21FbClcbiAgICAgICAgICBET00uZGlzY2FyZEVycm9yKHRhcmdldENvbnRhaW5lciwgdG9FbCwgcGh4RmVlZGJhY2tGb3IpXG5cbiAgICAgICAgICBsZXQgaXNGb2N1c2VkRm9ybUVsID0gZm9jdXNlZCAmJiBmcm9tRWwuaXNTYW1lTm9kZShmb2N1c2VkKSAmJiBET00uaXNGb3JtSW5wdXQoZnJvbUVsKVxuICAgICAgICAgIGlmKGlzRm9jdXNlZEZvcm1FbCl7XG4gICAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwidXBkYXRlZFwiLCBmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgICBET00ubWVyZ2VGb2N1c2VkSW5wdXQoZnJvbUVsLCB0b0VsKVxuICAgICAgICAgICAgRE9NLnN5bmNBdHRyc1RvUHJvcHMoZnJvbUVsKVxuICAgICAgICAgICAgdXBkYXRlcy5wdXNoKGZyb21FbClcbiAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnMoZnJvbUVsKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKERPTS5pc1BoeFVwZGF0ZSh0b0VsLCBwaHhVcGRhdGUsIFtcImFwcGVuZFwiLCBcInByZXBlbmRcIl0pKXtcbiAgICAgICAgICAgICAgYXBwZW5kUHJlcGVuZFVwZGF0ZXMucHVzaChuZXcgRE9NUG9zdE1vcnBoUmVzdG9yZXIoZnJvbUVsLCB0b0VsLCB0b0VsLmdldEF0dHJpYnV0ZShwaHhVcGRhdGUpKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIERPTS5zeW5jQXR0cnNUb1Byb3BzKHRvRWwpXG4gICAgICAgICAgICBET00uYXBwbHlTdGlja3lPcGVyYXRpb25zKHRvRWwpXG4gICAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwidXBkYXRlZFwiLCBmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaWYobGl2ZVNvY2tldC5pc0RlYnVnRW5hYmxlZCgpKXsgZGV0ZWN0RHVwbGljYXRlSWRzKCkgfVxuXG4gICAgaWYoYXBwZW5kUHJlcGVuZFVwZGF0ZXMubGVuZ3RoID4gMCl7XG4gICAgICBsaXZlU29ja2V0LnRpbWUoXCJwb3N0LW1vcnBoIGFwcGVuZC9wcmVwZW5kIHJlc3RvcmF0aW9uXCIsICgpID0+IHtcbiAgICAgICAgYXBwZW5kUHJlcGVuZFVwZGF0ZXMuZm9yRWFjaCh1cGRhdGUgPT4gdXBkYXRlLnBlcmZvcm0oKSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgbGl2ZVNvY2tldC5zaWxlbmNlRXZlbnRzKCgpID0+IERPTS5yZXN0b3JlRm9jdXMoZm9jdXNlZCwgc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZCkpXG4gICAgRE9NLmRpc3BhdGNoRXZlbnQoZG9jdW1lbnQsIFwicGh4OnVwZGF0ZVwiKVxuICAgIGFkZGVkLmZvckVhY2goZWwgPT4gdGhpcy50cmFja0FmdGVyKFwiYWRkZWRcIiwgZWwpKVxuICAgIHVwZGF0ZXMuZm9yRWFjaChlbCA9PiB0aGlzLnRyYWNrQWZ0ZXIoXCJ1cGRhdGVkXCIsIGVsKSlcblxuICAgIGlmKHBlbmRpbmdSZW1vdmVzLmxlbmd0aCA+IDApe1xuICAgICAgbGl2ZVNvY2tldC50cmFuc2l0aW9uUmVtb3ZlcyhwZW5kaW5nUmVtb3ZlcylcbiAgICAgIGxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICAgIHBlbmRpbmdSZW1vdmVzLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgIGxldCBjaGlsZCA9IERPTS5maXJzdFBoeENoaWxkKGVsKVxuICAgICAgICAgIGlmKGNoaWxkKXsgbGl2ZVNvY2tldC5kZXN0cm95Vmlld0J5RWwoY2hpbGQpIH1cbiAgICAgICAgICBlbC5yZW1vdmUoKVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLnRyYWNrQWZ0ZXIoXCJ0cmFuc2l0aW9uc0Rpc2NhcmRlZFwiLCBwZW5kaW5nUmVtb3ZlcylcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYoZXh0ZXJuYWxGb3JtVHJpZ2dlcmVkKXtcbiAgICAgIGxpdmVTb2NrZXQuZGlzY29ubmVjdCgpXG4gICAgICBleHRlcm5hbEZvcm1UcmlnZ2VyZWQuc3VibWl0KClcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGlzQ0lEUGF0Y2goKXsgcmV0dXJuIHRoaXMuY2lkUGF0Y2ggfVxuXG4gIHNraXBDSURTaWJsaW5nKGVsKXtcbiAgICByZXR1cm4gZWwubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIGVsLmdldEF0dHJpYnV0ZShQSFhfU0tJUCkgIT09IG51bGxcbiAgfVxuXG4gIHRhcmdldENJRENvbnRhaW5lcihodG1sKXtcbiAgICBpZighdGhpcy5pc0NJRFBhdGNoKCkpeyByZXR1cm4gfVxuICAgIGxldCBbZmlyc3QsIC4uLnJlc3RdID0gRE9NLmZpbmRDb21wb25lbnROb2RlTGlzdCh0aGlzLmNvbnRhaW5lciwgdGhpcy50YXJnZXRDSUQpXG4gICAgaWYocmVzdC5sZW5ndGggPT09IDAgJiYgRE9NLmNoaWxkTm9kZUxlbmd0aChodG1sKSA9PT0gMSl7XG4gICAgICByZXR1cm4gZmlyc3RcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpcnN0ICYmIGZpcnN0LnBhcmVudE5vZGVcbiAgICB9XG4gIH1cblxuICAvLyBidWlsZHMgSFRNTCBmb3IgbW9ycGhkb20gcGF0Y2hcbiAgLy8gLSBmb3IgZnVsbCBwYXRjaGVzIG9mIExpdmVWaWV3IG9yIGEgY29tcG9uZW50IHdpdGggYSBzaW5nbGVcbiAgLy8gICByb290IG5vZGUsIHNpbXBseSByZXR1cm5zIHRoZSBIVE1MXG4gIC8vIC0gZm9yIHBhdGNoZXMgb2YgYSBjb21wb25lbnQgd2l0aCBtdWx0aXBsZSByb290IG5vZGVzLCB0aGVcbiAgLy8gICBwYXJlbnQgbm9kZSBiZWNvbWVzIHRoZSB0YXJnZXQgY29udGFpbmVyIGFuZCBub24tY29tcG9uZW50XG4gIC8vICAgc2libGluZ3MgYXJlIG1hcmtlZCBhcyBza2lwLlxuICBidWlsZERpZmZIVE1MKGNvbnRhaW5lciwgaHRtbCwgcGh4VXBkYXRlLCB0YXJnZXRDb250YWluZXIpe1xuICAgIGxldCBpc0NJRFBhdGNoID0gdGhpcy5pc0NJRFBhdGNoKClcbiAgICBsZXQgaXNDSURXaXRoU2luZ2xlUm9vdCA9IGlzQ0lEUGF0Y2ggJiYgdGFyZ2V0Q29udGFpbmVyLmdldEF0dHJpYnV0ZShQSFhfQ09NUE9ORU5UKSA9PT0gdGhpcy50YXJnZXRDSUQudG9TdHJpbmcoKVxuICAgIGlmKCFpc0NJRFBhdGNoIHx8IGlzQ0lEV2l0aFNpbmdsZVJvb3Qpe1xuICAgICAgcmV0dXJuIGh0bWxcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY29tcG9uZW50IHBhdGNoIHdpdGggbXVsdGlwbGUgQ0lEIHJvb3RzXG4gICAgICBsZXQgZGlmZkNvbnRhaW5lciA9IG51bGxcbiAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZW1wbGF0ZVwiKVxuICAgICAgZGlmZkNvbnRhaW5lciA9IERPTS5jbG9uZU5vZGUodGFyZ2V0Q29udGFpbmVyKVxuICAgICAgbGV0IFtmaXJzdENvbXBvbmVudCwgLi4ucmVzdF0gPSBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KGRpZmZDb250YWluZXIsIHRoaXMudGFyZ2V0Q0lEKVxuICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFxuICAgICAgcmVzdC5mb3JFYWNoKGVsID0+IGVsLnJlbW92ZSgpKVxuICAgICAgQXJyYXkuZnJvbShkaWZmQ29udGFpbmVyLmNoaWxkTm9kZXMpLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAvLyB3ZSBjYW4gb25seSBza2lwIHRyYWNrYWJsZSBub2RlcyB3aXRoIGFuIElEXG4gICAgICAgIGlmKGNoaWxkLmlkICYmIGNoaWxkLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSAmJiBjaGlsZC5nZXRBdHRyaWJ1dGUoUEhYX0NPTVBPTkVOVCkgIT09IHRoaXMudGFyZ2V0Q0lELnRvU3RyaW5nKCkpe1xuICAgICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZShQSFhfU0tJUCwgXCJcIilcbiAgICAgICAgICBjaGlsZC5pbm5lckhUTUwgPSBcIlwiXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBBcnJheS5mcm9tKHRlbXBsYXRlLmNvbnRlbnQuY2hpbGROb2RlcykuZm9yRWFjaChlbCA9PiBkaWZmQ29udGFpbmVyLmluc2VydEJlZm9yZShlbCwgZmlyc3RDb21wb25lbnQpKVxuICAgICAgZmlyc3RDb21wb25lbnQucmVtb3ZlKClcbiAgICAgIHJldHVybiBkaWZmQ29udGFpbmVyLm91dGVySFRNTFxuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7XG4gIENPTVBPTkVOVFMsXG4gIERZTkFNSUNTLFxuICBURU1QTEFURVMsXG4gIEVWRU5UUyxcbiAgUEhYX0NPTVBPTkVOVCxcbiAgUEhYX1NLSVAsXG4gIFJFUExZLFxuICBTVEFUSUMsXG4gIFRJVExFXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGlzT2JqZWN0LFxuICBsb2dFcnJvcixcbiAgaXNDaWQsXG59IGZyb20gXCIuL3V0aWxzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyZWQge1xuICBzdGF0aWMgZXh0cmFjdChkaWZmKXtcbiAgICBsZXQge1tSRVBMWV06IHJlcGx5LCBbRVZFTlRTXTogZXZlbnRzLCBbVElUTEVdOiB0aXRsZX0gPSBkaWZmXG4gICAgZGVsZXRlIGRpZmZbUkVQTFldXG4gICAgZGVsZXRlIGRpZmZbRVZFTlRTXVxuICAgIGRlbGV0ZSBkaWZmW1RJVExFXVxuICAgIHJldHVybiB7ZGlmZiwgdGl0bGUsIHJlcGx5OiByZXBseSB8fCBudWxsLCBldmVudHM6IGV2ZW50cyB8fCBbXX1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHZpZXdJZCwgcmVuZGVyZWQpe1xuICAgIHRoaXMudmlld0lkID0gdmlld0lkXG4gICAgdGhpcy5yZW5kZXJlZCA9IHt9XG4gICAgdGhpcy5tZXJnZURpZmYocmVuZGVyZWQpXG4gIH1cblxuICBwYXJlbnRWaWV3SWQoKXsgcmV0dXJuIHRoaXMudmlld0lkIH1cblxuICB0b1N0cmluZyhvbmx5Q2lkcyl7XG4gICAgcmV0dXJuIHRoaXMucmVjdXJzaXZlVG9TdHJpbmcodGhpcy5yZW5kZXJlZCwgdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSwgb25seUNpZHMpXG4gIH1cblxuICByZWN1cnNpdmVUb1N0cmluZyhyZW5kZXJlZCwgY29tcG9uZW50cyA9IHJlbmRlcmVkW0NPTVBPTkVOVFNdLCBvbmx5Q2lkcyl7XG4gICAgb25seUNpZHMgPSBvbmx5Q2lkcyA/IG5ldyBTZXQob25seUNpZHMpIDogbnVsbFxuICAgIGxldCBvdXRwdXQgPSB7YnVmZmVyOiBcIlwiLCBjb21wb25lbnRzOiBjb21wb25lbnRzLCBvbmx5Q2lkczogb25seUNpZHN9XG4gICAgdGhpcy50b091dHB1dEJ1ZmZlcihyZW5kZXJlZCwgbnVsbCwgb3V0cHV0KVxuICAgIHJldHVybiBvdXRwdXQuYnVmZmVyXG4gIH1cblxuICBjb21wb25lbnRDSURzKGRpZmYpeyByZXR1cm4gT2JqZWN0LmtleXMoZGlmZltDT01QT05FTlRTXSB8fCB7fSkubWFwKGkgPT4gcGFyc2VJbnQoaSkpIH1cblxuICBpc0NvbXBvbmVudE9ubHlEaWZmKGRpZmYpe1xuICAgIGlmKCFkaWZmW0NPTVBPTkVOVFNdKXsgcmV0dXJuIGZhbHNlIH1cbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZGlmZikubGVuZ3RoID09PSAxXG4gIH1cblxuICBnZXRDb21wb25lbnQoZGlmZiwgY2lkKXsgcmV0dXJuIGRpZmZbQ09NUE9ORU5UU11bY2lkXSB9XG5cbiAgbWVyZ2VEaWZmKGRpZmYpe1xuICAgIGxldCBuZXdjID0gZGlmZltDT01QT05FTlRTXVxuICAgIGxldCBjYWNoZSA9IHt9XG4gICAgZGVsZXRlIGRpZmZbQ09NUE9ORU5UU11cbiAgICB0aGlzLnJlbmRlcmVkID0gdGhpcy5tdXRhYmxlTWVyZ2UodGhpcy5yZW5kZXJlZCwgZGlmZilcbiAgICB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdID0gdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSB8fCB7fVxuXG4gICAgaWYobmV3Yyl7XG4gICAgICBsZXQgb2xkYyA9IHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU11cblxuICAgICAgZm9yKGxldCBjaWQgaW4gbmV3Yyl7XG4gICAgICAgIG5ld2NbY2lkXSA9IHRoaXMuY2FjaGVkRmluZENvbXBvbmVudChjaWQsIG5ld2NbY2lkXSwgb2xkYywgbmV3YywgY2FjaGUpXG4gICAgICB9XG5cbiAgICAgIGZvcihsZXQgY2lkIGluIG5ld2MpeyBvbGRjW2NpZF0gPSBuZXdjW2NpZF0gfVxuICAgICAgZGlmZltDT01QT05FTlRTXSA9IG5ld2NcbiAgICB9XG4gIH1cblxuICBjYWNoZWRGaW5kQ29tcG9uZW50KGNpZCwgY2RpZmYsIG9sZGMsIG5ld2MsIGNhY2hlKXtcbiAgICBpZihjYWNoZVtjaWRdKXtcbiAgICAgIHJldHVybiBjYWNoZVtjaWRdXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZGlmZiwgc3RhdCwgc2NpZCA9IGNkaWZmW1NUQVRJQ11cblxuICAgICAgaWYoaXNDaWQoc2NpZCkpe1xuICAgICAgICBsZXQgdGRpZmZcblxuICAgICAgICBpZihzY2lkID4gMCl7XG4gICAgICAgICAgdGRpZmYgPSB0aGlzLmNhY2hlZEZpbmRDb21wb25lbnQoc2NpZCwgbmV3Y1tzY2lkXSwgb2xkYywgbmV3YywgY2FjaGUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGRpZmYgPSBvbGRjWy1zY2lkXVxuICAgICAgICB9XG5cbiAgICAgICAgc3RhdCA9IHRkaWZmW1NUQVRJQ11cbiAgICAgICAgbmRpZmYgPSB0aGlzLmNsb25lTWVyZ2UodGRpZmYsIGNkaWZmKVxuICAgICAgICBuZGlmZltTVEFUSUNdID0gc3RhdFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmRpZmYgPSBjZGlmZltTVEFUSUNdICE9PSB1bmRlZmluZWQgPyBjZGlmZiA6IHRoaXMuY2xvbmVNZXJnZShvbGRjW2NpZF0gfHwge30sIGNkaWZmKVxuICAgICAgfVxuXG4gICAgICBjYWNoZVtjaWRdID0gbmRpZmZcbiAgICAgIHJldHVybiBuZGlmZlxuICAgIH1cbiAgfVxuXG4gIG11dGFibGVNZXJnZSh0YXJnZXQsIHNvdXJjZSl7XG4gICAgaWYoc291cmNlW1NUQVRJQ10gIT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gc291cmNlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9NdXRhYmxlTWVyZ2UodGFyZ2V0LCBzb3VyY2UpXG4gICAgICByZXR1cm4gdGFyZ2V0XG4gICAgfVxuICB9XG5cbiAgZG9NdXRhYmxlTWVyZ2UodGFyZ2V0LCBzb3VyY2Upe1xuICAgIGZvcihsZXQga2V5IGluIHNvdXJjZSl7XG4gICAgICBsZXQgdmFsID0gc291cmNlW2tleV1cbiAgICAgIGxldCB0YXJnZXRWYWwgPSB0YXJnZXRba2V5XVxuICAgICAgaWYoaXNPYmplY3QodmFsKSAmJiB2YWxbU1RBVElDXSA9PT0gdW5kZWZpbmVkICYmIGlzT2JqZWN0KHRhcmdldFZhbCkpe1xuICAgICAgICB0aGlzLmRvTXV0YWJsZU1lcmdlKHRhcmdldFZhbCwgdmFsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbG9uZU1lcmdlKHRhcmdldCwgc291cmNlKXtcbiAgICBsZXQgbWVyZ2VkID0gey4uLnRhcmdldCwgLi4uc291cmNlfVxuICAgIGZvcihsZXQga2V5IGluIG1lcmdlZCl7XG4gICAgICBsZXQgdmFsID0gc291cmNlW2tleV1cbiAgICAgIGxldCB0YXJnZXRWYWwgPSB0YXJnZXRba2V5XVxuICAgICAgaWYoaXNPYmplY3QodmFsKSAmJiB2YWxbU1RBVElDXSA9PT0gdW5kZWZpbmVkICYmIGlzT2JqZWN0KHRhcmdldFZhbCkpe1xuICAgICAgICBtZXJnZWRba2V5XSA9IHRoaXMuY2xvbmVNZXJnZSh0YXJnZXRWYWwsIHZhbClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1lcmdlZFxuICB9XG5cbiAgY29tcG9uZW50VG9TdHJpbmcoY2lkKXsgcmV0dXJuIHRoaXMucmVjdXJzaXZlQ0lEVG9TdHJpbmcodGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSwgY2lkKSB9XG5cbiAgcHJ1bmVDSURzKGNpZHMpe1xuICAgIGNpZHMuZm9yRWFjaChjaWQgPT4gZGVsZXRlIHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU11bY2lkXSlcbiAgfVxuXG4gIC8vIHByaXZhdGVcblxuICBnZXQoKXsgcmV0dXJuIHRoaXMucmVuZGVyZWQgfVxuXG4gIGlzTmV3RmluZ2VycHJpbnQoZGlmZiA9IHt9KXsgcmV0dXJuICEhZGlmZltTVEFUSUNdIH1cblxuICB0ZW1wbGF0ZVN0YXRpYyhwYXJ0LCB0ZW1wbGF0ZXMpe1xuICAgIGlmKHR5cGVvZiAocGFydCkgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHJldHVybiB0ZW1wbGF0ZXNbcGFydF1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcnRcbiAgICB9XG4gIH1cblxuICB0b091dHB1dEJ1ZmZlcihyZW5kZXJlZCwgdGVtcGxhdGVzLCBvdXRwdXQpe1xuICAgIGlmKHJlbmRlcmVkW0RZTkFNSUNTXSl7IHJldHVybiB0aGlzLmNvbXByZWhlbnNpb25Ub0J1ZmZlcihyZW5kZXJlZCwgdGVtcGxhdGVzLCBvdXRwdXQpIH1cbiAgICBsZXQge1tTVEFUSUNdOiBzdGF0aWNzfSA9IHJlbmRlcmVkXG4gICAgc3RhdGljcyA9IHRoaXMudGVtcGxhdGVTdGF0aWMoc3RhdGljcywgdGVtcGxhdGVzKVxuXG4gICAgb3V0cHV0LmJ1ZmZlciArPSBzdGF0aWNzWzBdXG4gICAgZm9yKGxldCBpID0gMTsgaSA8IHN0YXRpY3MubGVuZ3RoOyBpKyspe1xuICAgICAgdGhpcy5keW5hbWljVG9CdWZmZXIocmVuZGVyZWRbaSAtIDFdLCB0ZW1wbGF0ZXMsIG91dHB1dClcbiAgICAgIG91dHB1dC5idWZmZXIgKz0gc3RhdGljc1tpXVxuICAgIH1cbiAgfVxuXG4gIGNvbXByZWhlbnNpb25Ub0J1ZmZlcihyZW5kZXJlZCwgdGVtcGxhdGVzLCBvdXRwdXQpe1xuICAgIGxldCB7W0RZTkFNSUNTXTogZHluYW1pY3MsIFtTVEFUSUNdOiBzdGF0aWNzfSA9IHJlbmRlcmVkXG4gICAgc3RhdGljcyA9IHRoaXMudGVtcGxhdGVTdGF0aWMoc3RhdGljcywgdGVtcGxhdGVzKVxuICAgIGxldCBjb21wVGVtcGxhdGVzID0gcmVuZGVyZWRbVEVNUExBVEVTXVxuXG4gICAgZm9yKGxldCBkID0gMDsgZCA8IGR5bmFtaWNzLmxlbmd0aDsgZCsrKXtcbiAgICAgIGxldCBkeW5hbWljID0gZHluYW1pY3NbZF1cbiAgICAgIG91dHB1dC5idWZmZXIgKz0gc3RhdGljc1swXVxuICAgICAgZm9yKGxldCBpID0gMTsgaSA8IHN0YXRpY3MubGVuZ3RoOyBpKyspe1xuICAgICAgICB0aGlzLmR5bmFtaWNUb0J1ZmZlcihkeW5hbWljW2kgLSAxXSwgY29tcFRlbXBsYXRlcywgb3V0cHV0KVxuICAgICAgICBvdXRwdXQuYnVmZmVyICs9IHN0YXRpY3NbaV1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkeW5hbWljVG9CdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0KXtcbiAgICBpZih0eXBlb2YgKHJlbmRlcmVkKSA9PT0gXCJudW1iZXJcIil7XG4gICAgICBvdXRwdXQuYnVmZmVyICs9IHRoaXMucmVjdXJzaXZlQ0lEVG9TdHJpbmcob3V0cHV0LmNvbXBvbmVudHMsIHJlbmRlcmVkLCBvdXRwdXQub25seUNpZHMpXG4gICAgfSBlbHNlIGlmKGlzT2JqZWN0KHJlbmRlcmVkKSl7XG4gICAgICB0aGlzLnRvT3V0cHV0QnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dClcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LmJ1ZmZlciArPSByZW5kZXJlZFxuICAgIH1cbiAgfVxuXG4gIHJlY3Vyc2l2ZUNJRFRvU3RyaW5nKGNvbXBvbmVudHMsIGNpZCwgb25seUNpZHMpe1xuICAgIGxldCBjb21wb25lbnQgPSBjb21wb25lbnRzW2NpZF0gfHwgbG9nRXJyb3IoYG5vIGNvbXBvbmVudCBmb3IgQ0lEICR7Y2lkfWAsIGNvbXBvbmVudHMpXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gdGhpcy5yZWN1cnNpdmVUb1N0cmluZyhjb21wb25lbnQsIGNvbXBvbmVudHMsIG9ubHlDaWRzKVxuICAgIGxldCBjb250YWluZXIgPSB0ZW1wbGF0ZS5jb250ZW50XG4gICAgbGV0IHNraXAgPSBvbmx5Q2lkcyAmJiAhb25seUNpZHMuaGFzKGNpZClcblxuICAgIGxldCBbaGFzQ2hpbGROb2RlcywgaGFzQ2hpbGRDb21wb25lbnRzXSA9XG4gICAgICBBcnJheS5mcm9tKGNvbnRhaW5lci5jaGlsZE5vZGVzKS5yZWR1Y2UoKFtoYXNOb2RlcywgaGFzQ29tcG9uZW50c10sIGNoaWxkLCBpKSA9PiB7XG4gICAgICAgIGlmKGNoaWxkLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSl7XG4gICAgICAgICAgaWYoY2hpbGQuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpKXtcbiAgICAgICAgICAgIHJldHVybiBbaGFzTm9kZXMsIHRydWVdXG4gICAgICAgICAgfVxuICAgICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZShQSFhfQ09NUE9ORU5ULCBjaWQpXG4gICAgICAgICAgaWYoIWNoaWxkLmlkKXsgY2hpbGQuaWQgPSBgJHt0aGlzLnBhcmVudFZpZXdJZCgpfS0ke2NpZH0tJHtpfWAgfVxuICAgICAgICAgIGlmKHNraXApe1xuICAgICAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKFBIWF9TS0lQLCBcIlwiKVxuICAgICAgICAgICAgY2hpbGQuaW5uZXJIVE1MID0gXCJcIlxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gW3RydWUsIGhhc0NvbXBvbmVudHNdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYoY2hpbGQubm9kZVZhbHVlLnRyaW0oKSAhPT0gXCJcIil7XG4gICAgICAgICAgICBsb2dFcnJvcihcIm9ubHkgSFRNTCBlbGVtZW50IHRhZ3MgYXJlIGFsbG93ZWQgYXQgdGhlIHJvb3Qgb2YgY29tcG9uZW50cy5cXG5cXG5cIiArXG4gICAgICAgICAgICAgIGBnb3Q6IFwiJHtjaGlsZC5ub2RlVmFsdWUudHJpbSgpfVwiXFxuXFxuYCArXG4gICAgICAgICAgICAgIFwid2l0aGluOlxcblwiLCB0ZW1wbGF0ZS5pbm5lckhUTUwudHJpbSgpKVxuICAgICAgICAgICAgY2hpbGQucmVwbGFjZVdpdGgodGhpcy5jcmVhdGVTcGFuKGNoaWxkLm5vZGVWYWx1ZSwgY2lkKSlcbiAgICAgICAgICAgIHJldHVybiBbdHJ1ZSwgaGFzQ29tcG9uZW50c11cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hpbGQucmVtb3ZlKClcbiAgICAgICAgICAgIHJldHVybiBbaGFzTm9kZXMsIGhhc0NvbXBvbmVudHNdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCBbZmFsc2UsIGZhbHNlXSlcblxuICAgIGlmKCFoYXNDaGlsZE5vZGVzICYmICFoYXNDaGlsZENvbXBvbmVudHMpe1xuICAgICAgbG9nRXJyb3IoXCJleHBlY3RlZCBhdCBsZWFzdCBvbmUgSFRNTCBlbGVtZW50IHRhZyBpbnNpZGUgYSBjb21wb25lbnQsIGJ1dCB0aGUgY29tcG9uZW50IGlzIGVtcHR5OlxcblwiLFxuICAgICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwudHJpbSgpKVxuICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU3BhbihcIlwiLCBjaWQpLm91dGVySFRNTFxuICAgIH0gZWxzZSBpZighaGFzQ2hpbGROb2RlcyAmJiBoYXNDaGlsZENvbXBvbmVudHMpe1xuICAgICAgbG9nRXJyb3IoXCJleHBlY3RlZCBhdCBsZWFzdCBvbmUgSFRNTCBlbGVtZW50IHRhZyBkaXJlY3RseSBpbnNpZGUgYSBjb21wb25lbnQsIGJ1dCBvbmx5IHN1YmNvbXBvbmVudHMgd2VyZSBmb3VuZC4gQSBjb21wb25lbnQgbXVzdCByZW5kZXIgYXQgbGVhc3Qgb25lIEhUTUwgdGFnIGRpcmVjdGx5IGluc2lkZSBpdHNlbGYuXCIsXG4gICAgICAgIHRlbXBsYXRlLmlubmVySFRNTC50cmltKCkpXG4gICAgICByZXR1cm4gdGVtcGxhdGUuaW5uZXJIVE1MXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZW1wbGF0ZS5pbm5lckhUTUxcbiAgICB9XG4gIH1cblxuICBjcmVhdGVTcGFuKHRleHQsIGNpZCl7XG4gICAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKVxuICAgIHNwYW4uaW5uZXJUZXh0ID0gdGV4dFxuICAgIHNwYW4uc2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQsIGNpZClcbiAgICByZXR1cm4gc3BhblxuICB9XG59XG4iLCAibGV0IHZpZXdIb29rSUQgPSAxXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3SG9vayB7XG4gIHN0YXRpYyBtYWtlSUQoKXsgcmV0dXJuIHZpZXdIb29rSUQrKyB9XG4gIHN0YXRpYyBlbGVtZW50SUQoZWwpeyByZXR1cm4gZWwucGh4SG9va0lkIH1cblxuICBjb25zdHJ1Y3Rvcih2aWV3LCBlbCwgY2FsbGJhY2tzKXtcbiAgICB0aGlzLl9fdmlldyA9IHZpZXdcbiAgICB0aGlzLl9fbGl2ZVNvY2tldCA9IHZpZXcubGl2ZVNvY2tldFxuICAgIHRoaXMuX19jYWxsYmFja3MgPSBjYWxsYmFja3NcbiAgICB0aGlzLl9fbGlzdGVuZXJzID0gbmV3IFNldCgpXG4gICAgdGhpcy5fX2lzRGlzY29ubmVjdGVkID0gZmFsc2VcbiAgICB0aGlzLmVsID0gZWxcbiAgICB0aGlzLmVsLnBoeEhvb2tJZCA9IHRoaXMuY29uc3RydWN0b3IubWFrZUlEKClcbiAgICBmb3IobGV0IGtleSBpbiB0aGlzLl9fY2FsbGJhY2tzKXsgdGhpc1trZXldID0gdGhpcy5fX2NhbGxiYWNrc1trZXldIH1cbiAgfVxuXG4gIF9fbW91bnRlZCgpeyB0aGlzLm1vdW50ZWQgJiYgdGhpcy5tb3VudGVkKCkgfVxuICBfX3VwZGF0ZWQoKXsgdGhpcy51cGRhdGVkICYmIHRoaXMudXBkYXRlZCgpIH1cbiAgX19iZWZvcmVVcGRhdGUoKXsgdGhpcy5iZWZvcmVVcGRhdGUgJiYgdGhpcy5iZWZvcmVVcGRhdGUoKSB9XG4gIF9fZGVzdHJveWVkKCl7IHRoaXMuZGVzdHJveWVkICYmIHRoaXMuZGVzdHJveWVkKCkgfVxuICBfX3JlY29ubmVjdGVkKCl7XG4gICAgaWYodGhpcy5fX2lzRGlzY29ubmVjdGVkKXtcbiAgICAgIHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlXG4gICAgICB0aGlzLnJlY29ubmVjdGVkICYmIHRoaXMucmVjb25uZWN0ZWQoKVxuICAgIH1cbiAgfVxuICBfX2Rpc2Nvbm5lY3RlZCgpe1xuICAgIHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCA9IHRydWVcbiAgICB0aGlzLmRpc2Nvbm5lY3RlZCAmJiB0aGlzLmRpc2Nvbm5lY3RlZCgpXG4gIH1cblxuICBwdXNoRXZlbnQoZXZlbnQsIHBheWxvYWQgPSB7fSwgb25SZXBseSA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICByZXR1cm4gdGhpcy5fX3ZpZXcucHVzaEhvb2tFdmVudChudWxsLCBldmVudCwgcGF5bG9hZCwgb25SZXBseSlcbiAgfVxuXG4gIHB1c2hFdmVudFRvKHBoeFRhcmdldCwgZXZlbnQsIHBheWxvYWQgPSB7fSwgb25SZXBseSA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICByZXR1cm4gdGhpcy5fX3ZpZXcud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsICh2aWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgIHJldHVybiB2aWV3LnB1c2hIb29rRXZlbnQodGFyZ2V0Q3R4LCBldmVudCwgcGF5bG9hZCwgb25SZXBseSlcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlRXZlbnQoZXZlbnQsIGNhbGxiYWNrKXtcbiAgICBsZXQgY2FsbGJhY2tSZWYgPSAoY3VzdG9tRXZlbnQsIGJ5cGFzcykgPT4gYnlwYXNzID8gZXZlbnQgOiBjYWxsYmFjayhjdXN0b21FdmVudC5kZXRhaWwpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoYHBoeDoke2V2ZW50fWAsIGNhbGxiYWNrUmVmKVxuICAgIHRoaXMuX19saXN0ZW5lcnMuYWRkKGNhbGxiYWNrUmVmKVxuICAgIHJldHVybiBjYWxsYmFja1JlZlxuICB9XG5cbiAgcmVtb3ZlSGFuZGxlRXZlbnQoY2FsbGJhY2tSZWYpe1xuICAgIGxldCBldmVudCA9IGNhbGxiYWNrUmVmKG51bGwsIHRydWUpXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoYHBoeDoke2V2ZW50fWAsIGNhbGxiYWNrUmVmKVxuICAgIHRoaXMuX19saXN0ZW5lcnMuZGVsZXRlKGNhbGxiYWNrUmVmKVxuICB9XG5cbiAgdXBsb2FkKG5hbWUsIGZpbGVzKXtcbiAgICByZXR1cm4gdGhpcy5fX3ZpZXcuZGlzcGF0Y2hVcGxvYWRzKG5hbWUsIGZpbGVzKVxuICB9XG5cbiAgdXBsb2FkVG8ocGh4VGFyZ2V0LCBuYW1lLCBmaWxlcyl7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3LndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCB2aWV3ID0+IHZpZXcuZGlzcGF0Y2hVcGxvYWRzKG5hbWUsIGZpbGVzKSlcbiAgfVxuXG4gIF9fY2xlYW51cF9fKCl7XG4gICAgdGhpcy5fX2xpc3RlbmVycy5mb3JFYWNoKGNhbGxiYWNrUmVmID0+IHRoaXMucmVtb3ZlSGFuZGxlRXZlbnQoY2FsbGJhY2tSZWYpKVxuICB9XG59XG4iLCAiaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuXG5sZXQgSlMgPSB7XG4gIGV4ZWMoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgZWwsIGRlZmF1bHRzKXtcbiAgICBsZXQgW2RlZmF1bHRLaW5kLCBkZWZhdWx0QXJnc10gPSBkZWZhdWx0cyB8fCBbbnVsbCwge31dXG4gICAgbGV0IGNvbW1hbmRzID0gcGh4RXZlbnQuY2hhckF0KDApID09PSBcIltcIiA/XG4gICAgICBKU09OLnBhcnNlKHBoeEV2ZW50KSA6IFtbZGVmYXVsdEtpbmQsIGRlZmF1bHRBcmdzXV1cblxuICAgIGNvbW1hbmRzLmZvckVhY2goKFtraW5kLCBhcmdzXSkgPT4ge1xuICAgICAgaWYoa2luZCA9PT0gZGVmYXVsdEtpbmQgJiYgZGVmYXVsdEFyZ3MuZGF0YSl7XG4gICAgICAgIGFyZ3MuZGF0YSA9IE9iamVjdC5hc3NpZ24oYXJncy5kYXRhIHx8IHt9LCBkZWZhdWx0QXJncy5kYXRhKVxuICAgICAgfVxuICAgICAgdGhpc1tgZXhlY18ke2tpbmR9YF0oZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgZWwsIGFyZ3MpXG4gICAgfSlcbiAgfSxcblxuICBpc1Zpc2libGUoZWwpe1xuICAgIGxldCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKVxuICAgIHJldHVybiAhKHN0eWxlLm9wYWNpdHkgPT09IDAgfHwgc3R5bGUuZGlzcGxheSA9PT0gXCJub25lXCIpXG4gIH0sXG5cbiAgLy8gcHJpdmF0ZVxuXG4gIC8vIGNvbW1hbmRzXG5cbiAgZXhlY19kaXNwYXRjaChldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwge3RvLCBldmVudCwgZGV0YWlsfSl7XG4gICAgaWYodG8pe1xuICAgICAgRE9NLmFsbChkb2N1bWVudCwgdG8sIGVsID0+IERPTS5kaXNwYXRjaEV2ZW50KGVsLCBldmVudCwgZGV0YWlsKSlcbiAgICB9IGVsc2Uge1xuICAgICAgRE9NLmRpc3BhdGNoRXZlbnQoc291cmNlRWwsIGV2ZW50LCBkZXRhaWwpXG4gICAgfVxuICB9LFxuXG4gIGV4ZWNfcHVzaChldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgYXJncyl7XG4gICAgbGV0IHtldmVudCwgZGF0YSwgdGFyZ2V0LCBwYWdlX2xvYWRpbmcsIGxvYWRpbmcsIHZhbHVlfSA9IGFyZ3NcbiAgICBsZXQgcHVzaE9wdHMgPSB7cGFnZV9sb2FkaW5nOiAhIXBhZ2VfbG9hZGluZywgbG9hZGluZzogbG9hZGluZywgdmFsdWU6IHZhbHVlfVxuICAgIGxldCB0YXJnZXRTcmMgPSBldmVudFR5cGUgPT09IFwiY2hhbmdlXCIgPyBzb3VyY2VFbC5mb3JtIDogc291cmNlRWxcbiAgICBsZXQgcGh4VGFyZ2V0ID0gdGFyZ2V0IHx8IHRhcmdldFNyYy5nZXRBdHRyaWJ1dGUodmlldy5iaW5kaW5nKFwidGFyZ2V0XCIpKSB8fCB0YXJnZXRTcmNcbiAgICB2aWV3LndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCAodGFyZ2V0VmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICBpZihldmVudFR5cGUgPT09IFwiY2hhbmdlXCIpe1xuICAgICAgICBsZXQge25ld0NpZCwgX3RhcmdldCwgY2FsbGJhY2t9ID0gYXJnc1xuICAgICAgICBpZihfdGFyZ2V0KXsgcHVzaE9wdHMuX3RhcmdldCA9IF90YXJnZXQgfVxuICAgICAgICB0YXJnZXRWaWV3LnB1c2hJbnB1dChzb3VyY2VFbCwgdGFyZ2V0Q3R4LCBuZXdDaWQsIGV2ZW50IHx8IHBoeEV2ZW50LCBwdXNoT3B0cywgY2FsbGJhY2spXG4gICAgICB9IGVsc2UgaWYoZXZlbnRUeXBlID09PSBcInN1Ym1pdFwiKXtcbiAgICAgICAgdGFyZ2V0Vmlldy5zdWJtaXRGb3JtKHNvdXJjZUVsLCB0YXJnZXRDdHgsIGV2ZW50IHx8IHBoeEV2ZW50LCBwdXNoT3B0cylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFZpZXcucHVzaEV2ZW50KGV2ZW50VHlwZSwgc291cmNlRWwsIHRhcmdldEN0eCwgZXZlbnQgfHwgcGh4RXZlbnQsIGRhdGEsIHB1c2hPcHRzKVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgZXhlY19hZGRfY2xhc3MoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIHt0bywgbmFtZXMsIHRyYW5zaXRpb24sIHRpbWV9KXtcbiAgICBpZih0byl7XG4gICAgICBET00uYWxsKGRvY3VtZW50LCB0bywgZWwgPT4gdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIG5hbWVzLCBbXSwgdHJhbnNpdGlvbiwgdGltZSwgdmlldykpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKHNvdXJjZUVsLCBuYW1lcywgW10sIHRyYW5zaXRpb24sIHZpZXcpXG4gICAgfVxuICB9LFxuXG4gIGV4ZWNfcmVtb3ZlX2NsYXNzKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCB7dG8sIG5hbWVzLCB0cmFuc2l0aW9uLCB0aW1lfSl7XG4gICAgaWYodG8pe1xuICAgICAgRE9NLmFsbChkb2N1bWVudCwgdG8sIGVsID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBbXSwgbmFtZXMsIHRyYW5zaXRpb24sIHRpbWUsIHZpZXcpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3Nlcyhzb3VyY2VFbCwgW10sIG5hbWVzLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3KVxuICAgIH1cbiAgfSxcblxuICBleGVjX3RyYW5zaXRpb24oZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIHt0aW1lLCB0bywgdHJhbnNpdGlvbn0pe1xuICAgIGxldCBlbHMgPSB0byA/IERPTS5hbGwoZG9jdW1lbnQsIHRvKSA6IFtzb3VyY2VFbF1cbiAgICBsZXQgW3RyYW5zaXRpb25fc3RhcnQsIHJ1bm5pbmcsIHRyYW5zaXRpb25fZW5kXSA9IHRyYW5zaXRpb25cbiAgICBlbHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICBsZXQgb25TdGFydCA9ICgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uX3N0YXJ0LmNvbmNhdChydW5uaW5nKSwgW10pXG4gICAgICBsZXQgb25Eb25lID0gKCkgPT4gdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIHRyYW5zaXRpb25fZW5kLCB0cmFuc2l0aW9uX3N0YXJ0LmNvbmNhdChydW5uaW5nKSlcbiAgICAgIHZpZXcudHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUpXG4gICAgfSlcbiAgfSxcblxuICBleGVjX3RvZ2dsZShldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwge3RvLCBkaXNwbGF5LCBpbnMsIG91dHMsIHRpbWV9KXtcbiAgICBpZih0byl7XG4gICAgICBET00uYWxsKGRvY3VtZW50LCB0bywgZWwgPT4gdGhpcy50b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgaW5zLCBvdXRzLCB0aW1lKSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBzb3VyY2VFbCwgZGlzcGxheSwgaW5zLCBvdXRzLCB0aW1lKVxuICAgIH1cbiAgfSxcblxuICBleGVjX3Nob3coZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIHt0bywgZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZX0pe1xuICAgIGlmKHRvKXtcbiAgICAgIERPTS5hbGwoZG9jdW1lbnQsIHRvLCBlbCA9PiB0aGlzLnNob3coZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZSkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvdyhldmVudFR5cGUsIHZpZXcsIHNvdXJjZUVsLCB0cmFuc2l0aW9uLCB0aW1lKVxuICAgIH1cbiAgfSxcblxuICBleGVjX2hpZGUoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIHt0bywgZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZX0pe1xuICAgIGlmKHRvKXtcbiAgICAgIERPTS5hbGwoZG9jdW1lbnQsIHRvLCBlbCA9PiB0aGlzLmhpZGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZSkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGlkZShldmVudFR5cGUsIHZpZXcsIHNvdXJjZUVsLCBkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lKVxuICAgIH1cbiAgfSxcblxuICAvLyB1dGlscyBmb3IgY29tbWFuZHNcblxuICBzaG93KGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUpe1xuICAgIGlmKCF0aGlzLmlzVmlzaWJsZShlbCkpe1xuICAgICAgdGhpcy50b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgdHJhbnNpdGlvbiwgbnVsbCwgdGltZSlcbiAgICB9XG4gIH0sXG5cbiAgaGlkZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lKXtcbiAgICBpZih0aGlzLmlzVmlzaWJsZShlbCkpe1xuICAgICAgdGhpcy50b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgbnVsbCwgdHJhbnNpdGlvbiwgdGltZSlcbiAgICB9XG4gIH0sXG5cbiAgdG9nZ2xlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIGlucywgb3V0cywgdGltZSl7XG4gICAgbGV0IFtpbkNsYXNzZXMsIGluU3RhcnRDbGFzc2VzLCBpbkVuZENsYXNzZXNdID0gaW5zIHx8IFtbXSwgW10sIFtdXVxuICAgIGxldCBbb3V0Q2xhc3Nlcywgb3V0U3RhcnRDbGFzc2VzLCBvdXRFbmRDbGFzc2VzXSA9IG91dHMgfHwgW1tdLCBbXSwgW11dXG4gICAgaWYoaW5DbGFzc2VzLmxlbmd0aCA+IDAgfHwgb3V0Q2xhc3Nlcy5sZW5ndGggPiAwKXtcbiAgICAgIGlmKHRoaXMuaXNWaXNpYmxlKGVsKSl7XG4gICAgICAgIGxldCBvblN0YXJ0ID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBvdXRTdGFydENsYXNzZXMsIGluQ2xhc3Nlcy5jb25jYXQoaW5TdGFydENsYXNzZXMpLmNvbmNhdChpbkVuZENsYXNzZXMpKVxuICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIG91dENsYXNzZXMsIFtdKVxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgb3V0RW5kQ2xhc3Nlcywgb3V0U3RhcnRDbGFzc2VzKSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHZpZXcudHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBvdXRDbGFzc2VzLmNvbmNhdChvdXRFbmRDbGFzc2VzKSlcbiAgICAgICAgICBET00ucHV0U3RpY2t5KGVsLCBcInRvZ2dsZVwiLCBjdXJyZW50RWwgPT4gY3VycmVudEVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIilcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKGV2ZW50VHlwZSA9PT0gXCJyZW1vdmVcIil7IHJldHVybiB9XG4gICAgICAgIGxldCBvblN0YXJ0ID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBpblN0YXJ0Q2xhc3Nlcywgb3V0Q2xhc3Nlcy5jb25jYXQob3V0U3RhcnRDbGFzc2VzKS5jb25jYXQob3V0RW5kQ2xhc3NlcykpXG4gICAgICAgICAgRE9NLnB1dFN0aWNreShlbCwgXCJ0b2dnbGVcIiwgY3VycmVudEVsID0+IGN1cnJlbnRFbC5zdHlsZS5kaXNwbGF5ID0gKGRpc3BsYXkgfHwgXCJibG9ja1wiKSlcbiAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBpbkNsYXNzZXMsIFtdKVxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgaW5FbmRDbGFzc2VzLCBpblN0YXJ0Q2xhc3NlcykpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICB2aWV3LnRyYW5zaXRpb24odGltZSwgb25TdGFydCwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBbXSwgaW5DbGFzc2VzLmNvbmNhdChpbkVuZENsYXNzZXMpKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbmV3RGlzcGxheSA9IHRoaXMuaXNWaXNpYmxlKGVsKSA/IFwibm9uZVwiIDogKGRpc3BsYXkgfHwgXCJibG9ja1wiKVxuICAgICAgRE9NLnB1dFN0aWNreShlbCwgXCJ0b2dnbGVcIiwgY3VycmVudEVsID0+IGN1cnJlbnRFbC5zdHlsZS5kaXNwbGF5ID0gbmV3RGlzcGxheSlcbiAgICB9XG4gIH0sXG5cbiAgYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBhZGRzLCByZW1vdmVzLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3KXtcbiAgICBsZXQgW3RyYW5zaXRpb25fcnVuLCB0cmFuc2l0aW9uX3N0YXJ0LCB0cmFuc2l0aW9uX2VuZF0gPSB0cmFuc2l0aW9uIHx8IFtbXSwgW10sIFtdXVxuICAgIGlmKHRyYW5zaXRpb25fcnVuLmxlbmd0aCA+IDApe1xuICAgICAgbGV0IG9uU3RhcnQgPSAoKSA9PiB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgdHJhbnNpdGlvbl9zdGFydC5jb25jYXQodHJhbnNpdGlvbl9ydW4pLCBbXSlcbiAgICAgIGxldCBvbkRvbmUgPSAoKSA9PiB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgYWRkcy5jb25jYXQodHJhbnNpdGlvbl9lbmQpLCByZW1vdmVzLmNvbmNhdCh0cmFuc2l0aW9uX3J1bikuY29uY2F0KHRyYW5zaXRpb25fc3RhcnQpKVxuICAgICAgcmV0dXJuIHZpZXcudHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUpXG4gICAgfVxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgbGV0IFtwcmV2QWRkcywgcHJldlJlbW92ZXNdID0gRE9NLmdldFN0aWNreShlbCwgXCJjbGFzc2VzXCIsIFtbXSwgW11dKVxuICAgICAgbGV0IGtlZXBBZGRzID0gYWRkcy5maWx0ZXIobmFtZSA9PiBwcmV2QWRkcy5pbmRleE9mKG5hbWUpIDwgMCAmJiAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpKVxuICAgICAgbGV0IGtlZXBSZW1vdmVzID0gcmVtb3Zlcy5maWx0ZXIobmFtZSA9PiBwcmV2UmVtb3Zlcy5pbmRleE9mKG5hbWUpIDwgMCAmJiBlbC5jbGFzc0xpc3QuY29udGFpbnMobmFtZSkpXG4gICAgICBsZXQgbmV3QWRkcyA9IHByZXZBZGRzLmZpbHRlcihuYW1lID0+IHJlbW92ZXMuaW5kZXhPZihuYW1lKSA8IDApLmNvbmNhdChrZWVwQWRkcylcbiAgICAgIGxldCBuZXdSZW1vdmVzID0gcHJldlJlbW92ZXMuZmlsdGVyKG5hbWUgPT4gYWRkcy5pbmRleE9mKG5hbWUpIDwgMCkuY29uY2F0KGtlZXBSZW1vdmVzKVxuXG4gICAgICBET00ucHV0U3RpY2t5KGVsLCBcImNsYXNzZXNcIiwgY3VycmVudEVsID0+IHtcbiAgICAgICAgY3VycmVudEVsLmNsYXNzTGlzdC5yZW1vdmUoLi4ubmV3UmVtb3ZlcylcbiAgICAgICAgY3VycmVudEVsLmNsYXNzTGlzdC5hZGQoLi4ubmV3QWRkcylcbiAgICAgICAgcmV0dXJuIFtuZXdBZGRzLCBuZXdSZW1vdmVzXVxuICAgICAgfSlcbiAgICB9KVxuICB9LFxuXG4gIGhhc0FsbENsYXNzZXMoZWwsIGNsYXNzZXMpeyByZXR1cm4gY2xhc3Nlcy5ldmVyeShuYW1lID0+IGVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKSkgfSxcblxuICBpc1RvZ2dsZWRPdXQoZWwsIG91dENsYXNzZXMpe1xuICAgIHJldHVybiAhdGhpcy5pc1Zpc2libGUoZWwpIHx8IHRoaXMuaGFzQWxsQ2xhc3NlcyhlbCwgb3V0Q2xhc3NlcylcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBKU1xuIiwgImltcG9ydCB7XG4gIEJFRk9SRV9VTkxPQURfTE9BREVSX1RJTUVPVVQsXG4gIENIRUNLQUJMRV9JTlBVVFMsXG4gIENPTlNFQ1VUSVZFX1JFTE9BRFMsXG4gIFBIWF9BVVRPX1JFQ09WRVIsXG4gIFBIWF9DT01QT05FTlQsXG4gIFBIWF9DT05ORUNURURfQ0xBU1MsXG4gIFBIWF9ESVNBQkxFX1dJVEgsXG4gIFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRSxcbiAgUEhYX0RJU0FCTEVELFxuICBQSFhfRElTQ09OTkVDVEVEX0NMQVNTLFxuICBQSFhfRVZFTlRfQ0xBU1NFUyxcbiAgUEhYX0VSUk9SX0NMQVNTLFxuICBQSFhfRkVFREJBQ0tfRk9SLFxuICBQSFhfSEFTX1NVQk1JVFRFRCxcbiAgUEhYX0hPT0ssXG4gIFBIWF9QQUdFX0xPQURJTkcsXG4gIFBIWF9QQVJFTlRfSUQsXG4gIFBIWF9QUk9HUkVTUyxcbiAgUEhYX1JFQURPTkxZLFxuICBQSFhfUkVGLFxuICBQSFhfUk9PVF9JRCxcbiAgUEhYX1NFU1NJT04sXG4gIFBIWF9TVEFUSUMsXG4gIFBIWF9UUkFDS19TVEFUSUMsXG4gIFBIWF9UUkFDS19VUExPQURTLFxuICBQSFhfVVBEQVRFLFxuICBQSFhfVVBMT0FEX1JFRixcbiAgUEhYX1ZJRVdfU0VMRUNUT1IsXG4gIFBVU0hfVElNRU9VVCxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2xvbmUsXG4gIGNsb3Nlc3RQaHhCaW5kaW5nLFxuICBpc0VtcHR5LFxuICBpc0VxdWFsT2JqLFxuICBsb2dFcnJvcixcbiAgbWF5YmUsXG4gIGlzQ2lkLFxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBCcm93c2VyIGZyb20gXCIuL2Jyb3dzZXJcIlxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IERPTVBhdGNoIGZyb20gXCIuL2RvbV9wYXRjaFwiXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuaW1wb3J0IFJlbmRlcmVkIGZyb20gXCIuL3JlbmRlcmVkXCJcbmltcG9ydCBWaWV3SG9vayBmcm9tIFwiLi92aWV3X2hvb2tcIlxuaW1wb3J0IEpTIGZyb20gXCIuL2pzXCJcblxubGV0IHNlcmlhbGl6ZUZvcm0gPSAoZm9ybSwgbWV0YSA9IHt9KSA9PiB7XG4gIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKVxuICBsZXQgdG9SZW1vdmUgPSBbXVxuXG4gIGZvcm1EYXRhLmZvckVhY2goKHZhbCwga2V5LCBfaW5kZXgpID0+IHtcbiAgICBpZih2YWwgaW5zdGFuY2VvZiBGaWxlKXsgdG9SZW1vdmUucHVzaChrZXkpIH1cbiAgfSlcblxuICAvLyBDbGVhbnVwIGFmdGVyIGJ1aWxkaW5nIGZpbGVEYXRhXG4gIHRvUmVtb3ZlLmZvckVhY2goa2V5ID0+IGZvcm1EYXRhLmRlbGV0ZShrZXkpKVxuXG4gIGxldCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKClcbiAgZm9yKGxldCBba2V5LCB2YWxdIG9mIGZvcm1EYXRhLmVudHJpZXMoKSl7IHBhcmFtcy5hcHBlbmQoa2V5LCB2YWwpIH1cbiAgZm9yKGxldCBtZXRhS2V5IGluIG1ldGEpeyBwYXJhbXMuYXBwZW5kKG1ldGFLZXksIG1ldGFbbWV0YUtleV0pIH1cblxuICByZXR1cm4gcGFyYW1zLnRvU3RyaW5nKClcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlldyB7XG4gIGNvbnN0cnVjdG9yKGVsLCBsaXZlU29ja2V0LCBwYXJlbnRWaWV3LCBmbGFzaCl7XG4gICAgdGhpcy5saXZlU29ja2V0ID0gbGl2ZVNvY2tldFxuICAgIHRoaXMuZmxhc2ggPSBmbGFzaFxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50Vmlld1xuICAgIHRoaXMucm9vdCA9IHBhcmVudFZpZXcgPyBwYXJlbnRWaWV3LnJvb3QgOiB0aGlzXG4gICAgdGhpcy5lbCA9IGVsXG4gICAgdGhpcy5pZCA9IHRoaXMuZWwuaWRcbiAgICB0aGlzLnJlZiA9IDBcbiAgICB0aGlzLmNoaWxkSm9pbnMgPSAwXG4gICAgdGhpcy5sb2FkZXJUaW1lciA9IG51bGxcbiAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gICAgdGhpcy5wcnVuaW5nQ0lEcyA9IFtdXG4gICAgdGhpcy5yZWRpcmVjdCA9IGZhbHNlXG4gICAgdGhpcy5ocmVmID0gbnVsbFxuICAgIHRoaXMuam9pbkNvdW50ID0gdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5qb2luQ291bnQgLSAxIDogMFxuICAgIHRoaXMuam9pblBlbmRpbmcgPSB0cnVlXG4gICAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZVxuICAgIHRoaXMuam9pbkNhbGxiYWNrID0gZnVuY3Rpb24ob25Eb25lKXsgb25Eb25lICYmIG9uRG9uZSgpIH1cbiAgICB0aGlzLnN0b3BDYWxsYmFjayA9IGZ1bmN0aW9uKCl7IH1cbiAgICB0aGlzLnBlbmRpbmdKb2luT3BzID0gdGhpcy5wYXJlbnQgPyBudWxsIDogW11cbiAgICB0aGlzLnZpZXdIb29rcyA9IHt9XG4gICAgdGhpcy51cGxvYWRlcnMgPSB7fVxuICAgIHRoaXMuZm9ybVN1Ym1pdHMgPSBbXVxuICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLnBhcmVudCA/IG51bGwgOiB7fVxuICAgIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXSA9IHt9XG4gICAgdGhpcy5jaGFubmVsID0gdGhpcy5saXZlU29ja2V0LmNoYW5uZWwoYGx2OiR7dGhpcy5pZH1gLCAoKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWRpcmVjdDogdGhpcy5yZWRpcmVjdCA/IHRoaXMuaHJlZiA6IHVuZGVmaW5lZCxcbiAgICAgICAgdXJsOiB0aGlzLnJlZGlyZWN0ID8gdW5kZWZpbmVkIDogdGhpcy5ocmVmIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgcGFyYW1zOiB0aGlzLmNvbm5lY3RQYXJhbXMoKSxcbiAgICAgICAgc2Vzc2lvbjogdGhpcy5nZXRTZXNzaW9uKCksXG4gICAgICAgIHN0YXRpYzogdGhpcy5nZXRTdGF0aWMoKSxcbiAgICAgICAgZmxhc2g6IHRoaXMuZmxhc2hcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMuc2hvd0xvYWRlcih0aGlzLmxpdmVTb2NrZXQubG9hZGVyVGltZW91dClcbiAgICB0aGlzLmJpbmRDaGFubmVsKClcbiAgfVxuXG4gIHNldEhyZWYoaHJlZil7IHRoaXMuaHJlZiA9IGhyZWYgfVxuXG4gIHNldFJlZGlyZWN0KGhyZWYpe1xuICAgIHRoaXMucmVkaXJlY3QgPSB0cnVlXG4gICAgdGhpcy5ocmVmID0gaHJlZlxuICB9XG5cbiAgaXNNYWluKCl7IHJldHVybiB0aGlzLmxpdmVTb2NrZXQubWFpbiA9PT0gdGhpcyB9XG5cbiAgY29ubmVjdFBhcmFtcygpe1xuICAgIGxldCBwYXJhbXMgPSB0aGlzLmxpdmVTb2NrZXQucGFyYW1zKHRoaXMuZWwpXG4gICAgbGV0IG1hbmlmZXN0ID1cbiAgICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX1RSQUNLX1NUQVRJQyl9XWApXG4gICAgICAgIC5tYXAobm9kZSA9PiBub2RlLnNyYyB8fCBub2RlLmhyZWYpLmZpbHRlcih1cmwgPT4gdHlwZW9mICh1cmwpID09PSBcInN0cmluZ1wiKVxuXG4gICAgaWYobWFuaWZlc3QubGVuZ3RoID4gMCl7IHBhcmFtc1tcIl90cmFja19zdGF0aWNcIl0gPSBtYW5pZmVzdCB9XG4gICAgcGFyYW1zW1wiX21vdW50c1wiXSA9IHRoaXMuam9pbkNvdW50XG5cbiAgICByZXR1cm4gcGFyYW1zXG4gIH1cblxuICBpc0Nvbm5lY3RlZCgpeyByZXR1cm4gdGhpcy5jaGFubmVsLmNhblB1c2goKSB9XG5cbiAgZ2V0U2Vzc2lvbigpeyByZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pIH1cblxuICBnZXRTdGF0aWMoKXtcbiAgICBsZXQgdmFsID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NUQVRJQylcbiAgICByZXR1cm4gdmFsID09PSBcIlwiID8gbnVsbCA6IHZhbFxuICB9XG5cbiAgZGVzdHJveShjYWxsYmFjayA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICB0aGlzLmRlc3Ryb3lBbGxDaGlsZHJlbigpXG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlXG4gICAgZGVsZXRlIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXVxuICAgIGlmKHRoaXMucGFyZW50KXsgZGVsZXRlIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLnBhcmVudC5pZF1bdGhpcy5pZF0gfVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmxvYWRlclRpbWVyKVxuICAgIGxldCBvbkZpbmlzaGVkID0gKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKVxuICAgICAgZm9yKGxldCBpZCBpbiB0aGlzLnZpZXdIb29rcyl7XG4gICAgICAgIHRoaXMuZGVzdHJveUhvb2sodGhpcy52aWV3SG9va3NbaWRdKVxuICAgICAgfVxuICAgIH1cblxuICAgIERPTS5tYXJrUGh4Q2hpbGREZXN0cm95ZWQodGhpcy5lbClcblxuICAgIHRoaXMubG9nKFwiZGVzdHJveWVkXCIsICgpID0+IFtcInRoZSBjaGlsZCBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIHBhcmVudFwiXSlcbiAgICB0aGlzLmNoYW5uZWwubGVhdmUoKVxuICAgICAgLnJlY2VpdmUoXCJva1wiLCBvbkZpbmlzaGVkKVxuICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCBvbkZpbmlzaGVkKVxuICAgICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsIG9uRmluaXNoZWQpXG4gIH1cblxuICBzZXRDb250YWluZXJDbGFzc2VzKC4uLmNsYXNzZXMpe1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZShcbiAgICAgIFBIWF9DT05ORUNURURfQ0xBU1MsXG4gICAgICBQSFhfRElTQ09OTkVDVEVEX0NMQVNTLFxuICAgICAgUEhYX0VSUk9SX0NMQVNTXG4gICAgKVxuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKVxuICB9XG5cbiAgc2hvd0xvYWRlcih0aW1lb3V0KXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5sb2FkZXJUaW1lcilcbiAgICBpZih0aW1lb3V0KXtcbiAgICAgIHRoaXMubG9hZGVyVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2hvd0xvYWRlcigpLCB0aW1lb3V0KVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IobGV0IGlkIGluIHRoaXMudmlld0hvb2tzKXsgdGhpcy52aWV3SG9va3NbaWRdLl9fZGlzY29ubmVjdGVkKCkgfVxuICAgICAgdGhpcy5zZXRDb250YWluZXJDbGFzc2VzKFBIWF9ESVNDT05ORUNURURfQ0xBU1MpXG4gICAgfVxuICB9XG5cbiAgaGlkZUxvYWRlcigpe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmxvYWRlclRpbWVyKVxuICAgIHRoaXMuc2V0Q29udGFpbmVyQ2xhc3NlcyhQSFhfQ09OTkVDVEVEX0NMQVNTKVxuICB9XG5cbiAgdHJpZ2dlclJlY29ubmVjdGVkKCl7XG4gICAgZm9yKGxldCBpZCBpbiB0aGlzLnZpZXdIb29rcyl7IHRoaXMudmlld0hvb2tzW2lkXS5fX3JlY29ubmVjdGVkKCkgfVxuICB9XG5cbiAgbG9nKGtpbmQsIG1zZ0NhbGxiYWNrKXtcbiAgICB0aGlzLmxpdmVTb2NrZXQubG9nKHRoaXMsIGtpbmQsIG1zZ0NhbGxiYWNrKVxuICB9XG5cbiAgdHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUgPSBmdW5jdGlvbigpe30pe1xuICAgIHRoaXMubGl2ZVNvY2tldC50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSlcbiAgfVxuXG4gIHdpdGhpblRhcmdldHMocGh4VGFyZ2V0LCBjYWxsYmFjayl7XG4gICAgaWYocGh4VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHwgcGh4VGFyZ2V0IGluc3RhbmNlb2YgU1ZHRWxlbWVudCl7XG4gICAgICByZXR1cm4gdGhpcy5saXZlU29ja2V0Lm93bmVyKHBoeFRhcmdldCwgdmlldyA9PiBjYWxsYmFjayh2aWV3LCBwaHhUYXJnZXQpKVxuICAgIH1cblxuICAgIGlmKGlzQ2lkKHBoeFRhcmdldCkpe1xuICAgICAgbGV0IHRhcmdldHMgPSBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIHBoeFRhcmdldClcbiAgICAgIGlmKHRhcmdldHMubGVuZ3RoID09PSAwKXtcbiAgICAgICAgbG9nRXJyb3IoYG5vIGNvbXBvbmVudCBmb3VuZCBtYXRjaGluZyBwaHgtdGFyZ2V0IG9mICR7cGh4VGFyZ2V0fWApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayh0aGlzLCBwYXJzZUludChwaHhUYXJnZXQpKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgdGFyZ2V0cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwaHhUYXJnZXQpKVxuICAgICAgaWYodGFyZ2V0cy5sZW5ndGggPT09IDApeyBsb2dFcnJvcihgbm90aGluZyBmb3VuZCBtYXRjaGluZyB0aGUgcGh4LXRhcmdldCBzZWxlY3RvciBcIiR7cGh4VGFyZ2V0fVwiYCkgfVxuICAgICAgdGFyZ2V0cy5mb3JFYWNoKHRhcmdldCA9PiB0aGlzLmxpdmVTb2NrZXQub3duZXIodGFyZ2V0LCB2aWV3ID0+IGNhbGxiYWNrKHZpZXcsIHRhcmdldCkpKVxuICAgIH1cbiAgfVxuXG4gIGFwcGx5RGlmZih0eXBlLCByYXdEaWZmLCBjYWxsYmFjayl7XG4gICAgdGhpcy5sb2codHlwZSwgKCkgPT4gW1wiXCIsIGNsb25lKHJhd0RpZmYpXSlcbiAgICBsZXQge2RpZmYsIHJlcGx5LCBldmVudHMsIHRpdGxlfSA9IFJlbmRlcmVkLmV4dHJhY3QocmF3RGlmZilcbiAgICBpZih0aXRsZSl7IERPTS5wdXRUaXRsZSh0aXRsZSkgfVxuXG4gICAgY2FsbGJhY2soe2RpZmYsIHJlcGx5LCBldmVudHN9KVxuICAgIHJldHVybiByZXBseVxuICB9XG5cbiAgb25Kb2luKHJlc3Ape1xuICAgIGxldCB7cmVuZGVyZWQsIGNvbnRhaW5lcn0gPSByZXNwXG4gICAgaWYoY29udGFpbmVyKXtcbiAgICAgIGxldCBbdGFnLCBhdHRyc10gPSBjb250YWluZXJcbiAgICAgIHRoaXMuZWwgPSBET00ucmVwbGFjZVJvb3RDb250YWluZXIodGhpcy5lbCwgdGFnLCBhdHRycylcbiAgICB9XG4gICAgdGhpcy5jaGlsZEpvaW5zID0gMFxuICAgIHRoaXMuam9pblBlbmRpbmcgPSB0cnVlXG4gICAgdGhpcy5mbGFzaCA9IG51bGxcblxuICAgIEJyb3dzZXIuZHJvcExvY2FsKHRoaXMubGl2ZVNvY2tldC5sb2NhbFN0b3JhZ2UsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSwgQ09OU0VDVVRJVkVfUkVMT0FEUylcbiAgICB0aGlzLmFwcGx5RGlmZihcIm1vdW50XCIsIHJlbmRlcmVkLCAoe2RpZmYsIGV2ZW50c30pID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZWQgPSBuZXcgUmVuZGVyZWQodGhpcy5pZCwgZGlmZilcbiAgICAgIGxldCBodG1sID0gdGhpcy5yZW5kZXJDb250YWluZXIobnVsbCwgXCJqb2luXCIpXG4gICAgICB0aGlzLmRyb3BQZW5kaW5nUmVmcygpXG4gICAgICBsZXQgZm9ybXMgPSB0aGlzLmZvcm1zRm9yUmVjb3ZlcnkoaHRtbClcbiAgICAgIHRoaXMuam9pbkNvdW50KytcblxuICAgICAgaWYoZm9ybXMubGVuZ3RoID4gMCl7XG4gICAgICAgIGZvcm1zLmZvckVhY2goKFtmb3JtLCBuZXdGb3JtLCBuZXdDaWRdLCBpKSA9PiB7XG4gICAgICAgICAgdGhpcy5wdXNoRm9ybVJlY292ZXJ5KGZvcm0sIG5ld0NpZCwgcmVzcCA9PiB7XG4gICAgICAgICAgICBpZihpID09PSBmb3Jtcy5sZW5ndGggLSAxKXtcbiAgICAgICAgICAgICAgdGhpcy5vbkpvaW5Db21wbGV0ZShyZXNwLCBodG1sLCBldmVudHMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub25Kb2luQ29tcGxldGUocmVzcCwgaHRtbCwgZXZlbnRzKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBkcm9wUGVuZGluZ1JlZnMoKXsgRE9NLmFsbCh0aGlzLmVsLCBgWyR7UEhYX1JFRn1dYCwgZWwgPT4gZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUYpKSB9XG5cbiAgb25Kb2luQ29tcGxldGUoe2xpdmVfcGF0Y2h9LCBodG1sLCBldmVudHMpe1xuICAgIC8vIEluIG9yZGVyIHRvIHByb3ZpZGUgYSBiZXR0ZXIgZXhwZXJpZW5jZSwgd2Ugd2FudCB0byBqb2luXG4gICAgLy8gYWxsIExpdmVWaWV3cyBmaXJzdCBhbmQgb25seSB0aGVuIGFwcGx5IHRoZWlyIHBhdGNoZXMuXG4gICAgaWYodGhpcy5qb2luQ291bnQgPiAxIHx8ICh0aGlzLnBhcmVudCAmJiAhdGhpcy5wYXJlbnQuaXNKb2luUGVuZGluZygpKSl7XG4gICAgICByZXR1cm4gdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBldmVudHMpXG4gICAgfVxuXG4gICAgLy8gT25lIGRvd25zaWRlIG9mIHRoaXMgYXBwcm9hY2ggaXMgdGhhdCB3ZSBuZWVkIHRvIGZpbmQgcGh4Q2hpbGRyZW5cbiAgICAvLyBpbiB0aGUgaHRtbCBmcmFnbWVudCwgaW5zdGVhZCBvZiBkaXJlY3RseSBvbiB0aGUgRE9NLiBUaGUgZnJhZ21lbnRcbiAgICAvLyBhbHNvIGRvZXMgbm90IGluY2x1ZGUgUEhYX1NUQVRJQywgc28gd2UgbmVlZCB0byBjb3B5IGl0IG92ZXIgZnJvbVxuICAgIC8vIHRoZSBET00uXG4gICAgbGV0IG5ld0NoaWxkcmVuID0gRE9NLmZpbmRQaHhDaGlsZHJlbkluRnJhZ21lbnQoaHRtbCwgdGhpcy5pZCkuZmlsdGVyKHRvRWwgPT4ge1xuICAgICAgbGV0IGZyb21FbCA9IHRvRWwuaWQgJiYgdGhpcy5lbC5xdWVyeVNlbGVjdG9yKGBbaWQ9XCIke3RvRWwuaWR9XCJdYClcbiAgICAgIGxldCBwaHhTdGF0aWMgPSBmcm9tRWwgJiYgZnJvbUVsLmdldEF0dHJpYnV0ZShQSFhfU1RBVElDKVxuICAgICAgaWYocGh4U3RhdGljKXsgdG9FbC5zZXRBdHRyaWJ1dGUoUEhYX1NUQVRJQywgcGh4U3RhdGljKSB9XG4gICAgICByZXR1cm4gdGhpcy5qb2luQ2hpbGQodG9FbClcbiAgICB9KVxuXG4gICAgaWYobmV3Q2hpbGRyZW4ubGVuZ3RoID09PSAwKXtcbiAgICAgIGlmKHRoaXMucGFyZW50KXtcbiAgICAgICAgdGhpcy5yb290LnBlbmRpbmdKb2luT3BzLnB1c2goW3RoaXMsICgpID0+IHRoaXMuYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgZXZlbnRzKV0pXG4gICAgICAgIHRoaXMucGFyZW50LmFja0pvaW4odGhpcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub25BbGxDaGlsZEpvaW5zQ29tcGxldGUoKVxuICAgICAgICB0aGlzLmFwcGx5Sm9pblBhdGNoKGxpdmVfcGF0Y2gsIGh0bWwsIGV2ZW50cylcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yb290LnBlbmRpbmdKb2luT3BzLnB1c2goW3RoaXMsICgpID0+IHRoaXMuYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgZXZlbnRzKV0pXG4gICAgfVxuICB9XG5cbiAgYXR0YWNoVHJ1ZURvY0VsKCl7XG4gICAgdGhpcy5lbCA9IERPTS5ieUlkKHRoaXMuaWQpXG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoUEhYX1JPT1RfSUQsIHRoaXMucm9vdC5pZClcbiAgfVxuXG4gIGFwcGx5Sm9pblBhdGNoKGxpdmVfcGF0Y2gsIGh0bWwsIGV2ZW50cyl7XG4gICAgdGhpcy5hdHRhY2hUcnVlRG9jRWwoKVxuICAgIGxldCBwYXRjaCA9IG5ldyBET01QYXRjaCh0aGlzLCB0aGlzLmVsLCB0aGlzLmlkLCBodG1sLCBudWxsKVxuICAgIHBhdGNoLm1hcmtQcnVuYWJsZUNvbnRlbnRGb3JSZW1vdmFsKClcbiAgICB0aGlzLnBlcmZvcm1QYXRjaChwYXRjaCwgZmFsc2UpXG4gICAgdGhpcy5qb2luTmV3Q2hpbGRyZW4oKVxuICAgIERPTS5hbGwodGhpcy5lbCwgYFske3RoaXMuYmluZGluZyhQSFhfSE9PSyl9XSwgW2RhdGEtcGh4LSR7UEhYX0hPT0t9XWAsIGhvb2tFbCA9PiB7XG4gICAgICBsZXQgaG9vayA9IHRoaXMuYWRkSG9vayhob29rRWwpXG4gICAgICBpZihob29rKXsgaG9vay5fX21vdW50ZWQoKSB9XG4gICAgfSlcblxuICAgIHRoaXMuam9pblBlbmRpbmcgPSBmYWxzZVxuICAgIHRoaXMubGl2ZVNvY2tldC5kaXNwYXRjaEV2ZW50cyhldmVudHMpXG4gICAgdGhpcy5hcHBseVBlbmRpbmdVcGRhdGVzKClcblxuICAgIGlmKGxpdmVfcGF0Y2gpe1xuICAgICAgbGV0IHtraW5kLCB0b30gPSBsaXZlX3BhdGNoXG4gICAgICB0aGlzLmxpdmVTb2NrZXQuaGlzdG9yeVBhdGNoKHRvLCBraW5kKVxuICAgIH1cbiAgICB0aGlzLmhpZGVMb2FkZXIoKVxuICAgIGlmKHRoaXMuam9pbkNvdW50ID4gMSl7IHRoaXMudHJpZ2dlclJlY29ubmVjdGVkKCkgfVxuICAgIHRoaXMuc3RvcENhbGxiYWNrKClcbiAgfVxuXG4gIHRyaWdnZXJCZWZvcmVVcGRhdGVIb29rKGZyb21FbCwgdG9FbCl7XG4gICAgdGhpcy5saXZlU29ja2V0LnRyaWdnZXJET00oXCJvbkJlZm9yZUVsVXBkYXRlZFwiLCBbZnJvbUVsLCB0b0VsXSlcbiAgICBsZXQgaG9vayA9IHRoaXMuZ2V0SG9vayhmcm9tRWwpXG4gICAgbGV0IGlzSWdub3JlZCA9IGhvb2sgJiYgRE9NLmlzSWdub3JlZChmcm9tRWwsIHRoaXMuYmluZGluZyhQSFhfVVBEQVRFKSlcbiAgICBpZihob29rICYmICFmcm9tRWwuaXNFcXVhbE5vZGUodG9FbCkgJiYgIShpc0lnbm9yZWQgJiYgaXNFcXVhbE9iaihmcm9tRWwuZGF0YXNldCwgdG9FbC5kYXRhc2V0KSkpe1xuICAgICAgaG9vay5fX2JlZm9yZVVwZGF0ZSgpXG4gICAgICByZXR1cm4gaG9va1xuICAgIH1cbiAgfVxuXG4gIHBlcmZvcm1QYXRjaChwYXRjaCwgcHJ1bmVDaWRzKXtcbiAgICBsZXQgcmVtb3ZlZEVscyA9IFtdXG4gICAgbGV0IHBoeENoaWxkcmVuQWRkZWQgPSBmYWxzZVxuICAgIGxldCB1cGRhdGVkSG9va0lkcyA9IG5ldyBTZXQoKVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJhZGRlZFwiLCBlbCA9PiB7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQudHJpZ2dlckRPTShcIm9uTm9kZUFkZGVkXCIsIFtlbF0pXG5cbiAgICAgIGxldCBuZXdIb29rID0gdGhpcy5hZGRIb29rKGVsKVxuICAgICAgaWYobmV3SG9vayl7IG5ld0hvb2suX19tb3VudGVkKCkgfVxuICAgIH0pXG5cbiAgICBwYXRjaC5hZnRlcihcInBoeENoaWxkQWRkZWRcIiwgX2VsID0+IHBoeENoaWxkcmVuQWRkZWQgPSB0cnVlKVxuXG4gICAgcGF0Y2guYmVmb3JlKFwidXBkYXRlZFwiLCAoZnJvbUVsLCB0b0VsKSA9PiB7XG4gICAgICBsZXQgaG9vayA9IHRoaXMudHJpZ2dlckJlZm9yZVVwZGF0ZUhvb2soZnJvbUVsLCB0b0VsKVxuICAgICAgaWYoaG9vayl7IHVwZGF0ZWRIb29rSWRzLmFkZChmcm9tRWwuaWQpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJ1cGRhdGVkXCIsIGVsID0+IHtcbiAgICAgIGlmKHVwZGF0ZWRIb29rSWRzLmhhcyhlbC5pZCkpeyB0aGlzLmdldEhvb2soZWwpLl9fdXBkYXRlZCgpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJkaXNjYXJkZWRcIiwgKGVsKSA9PiB7XG4gICAgICBpZihlbC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpeyByZW1vdmVkRWxzLnB1c2goZWwpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJ0cmFuc2l0aW9uc0Rpc2NhcmRlZFwiLCBlbHMgPT4gdGhpcy5hZnRlckVsZW1lbnRzUmVtb3ZlZChlbHMsIHBydW5lQ2lkcykpXG4gICAgcGF0Y2gucGVyZm9ybSgpXG4gICAgdGhpcy5hZnRlckVsZW1lbnRzUmVtb3ZlZChyZW1vdmVkRWxzLCBwcnVuZUNpZHMpXG5cbiAgICByZXR1cm4gcGh4Q2hpbGRyZW5BZGRlZFxuICB9XG5cbiAgYWZ0ZXJFbGVtZW50c1JlbW92ZWQoZWxlbWVudHMsIHBydW5lQ2lkcyl7XG4gICAgbGV0IGRlc3Ryb3llZENJRHMgPSBbXVxuICAgIGVsZW1lbnRzLmZvckVhY2gocGFyZW50ID0+IHtcbiAgICAgIGxldCBjb21wb25lbnRzID0gRE9NLmFsbChwYXJlbnQsIGBbJHtQSFhfQ09NUE9ORU5UfV1gKVxuICAgICAgICBjb21wb25lbnRzLmNvbmNhdChwYXJlbnQpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBsZXQgY2lkID0gdGhpcy5jb21wb25lbnRJRChlbClcbiAgICAgICAgaWYoaXNDaWQoY2lkKSAmJiBkZXN0cm95ZWRDSURzLmluZGV4T2YoY2lkKSA9PT0gLTEpeyBkZXN0cm95ZWRDSURzLnB1c2goY2lkKSB9XG4gICAgICAgIGxldCBob29rID0gdGhpcy5nZXRIb29rKGVsKVxuICAgICAgICBob29rICYmIHRoaXMuZGVzdHJveUhvb2soaG9vaylcbiAgICAgIH0pXG4gICAgfSlcbiAgICAvLyBXZSBzaG91bGQgbm90IHBydW5lQ2lkcyBvbiBqb2lucy4gT3RoZXJ3aXNlLCBpbiBjYXNlIG9mXG4gICAgLy8gcmVqb2lucywgd2UgbWF5IG5vdGlmeSBjaWRzIHRoYXQgbm8gbG9uZ2VyIGJlbG9uZyB0byB0aGVcbiAgICAvLyBjdXJyZW50IExpdmVWaWV3IHRvIGJlIHJlbW92ZWQuXG4gICAgaWYocHJ1bmVDaWRzKXtcbiAgICAgIHRoaXMubWF5YmVQdXNoQ29tcG9uZW50c0Rlc3Ryb3llZChkZXN0cm95ZWRDSURzKVxuICAgIH1cbiAgfVxuXG4gIGpvaW5OZXdDaGlsZHJlbigpe1xuICAgIERPTS5maW5kUGh4Q2hpbGRyZW4odGhpcy5lbCwgdGhpcy5pZCkuZm9yRWFjaChlbCA9PiB0aGlzLmpvaW5DaGlsZChlbCkpXG4gIH1cblxuICBnZXRDaGlsZEJ5SWQoaWQpeyByZXR1cm4gdGhpcy5yb290LmNoaWxkcmVuW3RoaXMuaWRdW2lkXSB9XG5cbiAgZ2V0RGVzY2VuZGVudEJ5RWwoZWwpe1xuICAgIGlmKGVsLmlkID09PSB0aGlzLmlkKXtcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW2VsLmdldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lEKV1bZWwuaWRdXG4gICAgfVxuICB9XG5cbiAgZGVzdHJveURlc2NlbmRlbnQoaWQpe1xuICAgIGZvcihsZXQgcGFyZW50SWQgaW4gdGhpcy5yb290LmNoaWxkcmVuKXtcbiAgICAgIGZvcihsZXQgY2hpbGRJZCBpbiB0aGlzLnJvb3QuY2hpbGRyZW5bcGFyZW50SWRdKXtcbiAgICAgICAgaWYoY2hpbGRJZCA9PT0gaWQpeyByZXR1cm4gdGhpcy5yb290LmNoaWxkcmVuW3BhcmVudElkXVtjaGlsZElkXS5kZXN0cm95KCkgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGpvaW5DaGlsZChlbCl7XG4gICAgbGV0IGNoaWxkID0gdGhpcy5nZXRDaGlsZEJ5SWQoZWwuaWQpXG4gICAgaWYoIWNoaWxkKXtcbiAgICAgIGxldCB2aWV3ID0gbmV3IFZpZXcoZWwsIHRoaXMubGl2ZVNvY2tldCwgdGhpcylcbiAgICAgIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXVt2aWV3LmlkXSA9IHZpZXdcbiAgICAgIHZpZXcuam9pbigpXG4gICAgICB0aGlzLmNoaWxkSm9pbnMrK1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBpc0pvaW5QZW5kaW5nKCl7IHJldHVybiB0aGlzLmpvaW5QZW5kaW5nIH1cblxuICBhY2tKb2luKF9jaGlsZCl7XG4gICAgdGhpcy5jaGlsZEpvaW5zLS1cblxuICAgIGlmKHRoaXMuY2hpbGRKb2lucyA9PT0gMCl7XG4gICAgICBpZih0aGlzLnBhcmVudCl7XG4gICAgICAgIHRoaXMucGFyZW50LmFja0pvaW4odGhpcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub25BbGxDaGlsZEpvaW5zQ29tcGxldGUoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQWxsQ2hpbGRKb2luc0NvbXBsZXRlKCl7XG4gICAgdGhpcy5qb2luQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgdGhpcy5wZW5kaW5nSm9pbk9wcy5mb3JFYWNoKChbdmlldywgb3BdKSA9PiB7XG4gICAgICAgIGlmKCF2aWV3LmlzRGVzdHJveWVkKCkpeyBvcCgpIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLnBlbmRpbmdKb2luT3BzID0gW11cbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlKGRpZmYsIGV2ZW50cyl7XG4gICAgaWYodGhpcy5pc0pvaW5QZW5kaW5nKCkgfHwgdGhpcy5saXZlU29ja2V0Lmhhc1BlbmRpbmdMaW5rKCkpe1xuICAgICAgcmV0dXJuIHRoaXMucGVuZGluZ0RpZmZzLnB1c2goe2RpZmYsIGV2ZW50c30pXG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJlZC5tZXJnZURpZmYoZGlmZilcbiAgICBsZXQgcGh4Q2hpbGRyZW5BZGRlZCA9IGZhbHNlXG5cbiAgICAvLyBXaGVuIHRoZSBkaWZmIG9ubHkgY29udGFpbnMgY29tcG9uZW50IGRpZmZzLCB0aGVuIHdhbGsgY29tcG9uZW50c1xuICAgIC8vIGFuZCBwYXRjaCBvbmx5IHRoZSBwYXJlbnQgY29tcG9uZW50IGNvbnRhaW5lcnMgZm91bmQgaW4gdGhlIGRpZmYuXG4gICAgLy8gT3RoZXJ3aXNlLCBwYXRjaCBlbnRpcmUgTFYgY29udGFpbmVyLlxuICAgIGlmKHRoaXMucmVuZGVyZWQuaXNDb21wb25lbnRPbmx5RGlmZihkaWZmKSl7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQudGltZShcImNvbXBvbmVudCBwYXRjaCBjb21wbGV0ZVwiLCAoKSA9PiB7XG4gICAgICAgIGxldCBwYXJlbnRDaWRzID0gRE9NLmZpbmRQYXJlbnRDSURzKHRoaXMuZWwsIHRoaXMucmVuZGVyZWQuY29tcG9uZW50Q0lEcyhkaWZmKSlcbiAgICAgICAgcGFyZW50Q2lkcy5mb3JFYWNoKHBhcmVudENJRCA9PiB7XG4gICAgICAgICAgaWYodGhpcy5jb21wb25lbnRQYXRjaCh0aGlzLnJlbmRlcmVkLmdldENvbXBvbmVudChkaWZmLCBwYXJlbnRDSUQpLCBwYXJlbnRDSUQpKXsgcGh4Q2hpbGRyZW5BZGRlZCA9IHRydWUgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYoIWlzRW1wdHkoZGlmZikpe1xuICAgICAgdGhpcy5saXZlU29ja2V0LnRpbWUoXCJmdWxsIHBhdGNoIGNvbXBsZXRlXCIsICgpID0+IHtcbiAgICAgICAgbGV0IGh0bWwgPSB0aGlzLnJlbmRlckNvbnRhaW5lcihkaWZmLCBcInVwZGF0ZVwiKVxuICAgICAgICBsZXQgcGF0Y2ggPSBuZXcgRE9NUGF0Y2godGhpcywgdGhpcy5lbCwgdGhpcy5pZCwgaHRtbCwgbnVsbClcbiAgICAgICAgcGh4Q2hpbGRyZW5BZGRlZCA9IHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCB0cnVlKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLmxpdmVTb2NrZXQuZGlzcGF0Y2hFdmVudHMoZXZlbnRzKVxuICAgIGlmKHBoeENoaWxkcmVuQWRkZWQpeyB0aGlzLmpvaW5OZXdDaGlsZHJlbigpIH1cbiAgfVxuXG4gIHJlbmRlckNvbnRhaW5lcihkaWZmLCBraW5kKXtcbiAgICByZXR1cm4gdGhpcy5saXZlU29ja2V0LnRpbWUoYHRvU3RyaW5nIGRpZmYgKCR7a2luZH0pYCwgKCkgPT4ge1xuICAgICAgbGV0IHRhZyA9IHRoaXMuZWwudGFnTmFtZVxuICAgICAgLy8gRG9uJ3Qgc2tpcCBhbnkgY29tcG9uZW50IGluIHRoZSBkaWZmIG5vciBhbnkgbWFya2VkIGFzIHBydW5lZFxuICAgICAgLy8gKGFzIHRoZXkgbWF5IGhhdmUgYmVlbiBhZGRlZCBiYWNrKVxuICAgICAgbGV0IGNpZHMgPSBkaWZmID8gdGhpcy5yZW5kZXJlZC5jb21wb25lbnRDSURzKGRpZmYpLmNvbmNhdCh0aGlzLnBydW5pbmdDSURzKSA6IG51bGxcbiAgICAgIGxldCBodG1sID0gdGhpcy5yZW5kZXJlZC50b1N0cmluZyhjaWRzKVxuICAgICAgcmV0dXJuIGA8JHt0YWd9PiR7aHRtbH08LyR7dGFnfT5gXG4gICAgfSlcbiAgfVxuXG4gIGNvbXBvbmVudFBhdGNoKGRpZmYsIGNpZCl7XG4gICAgaWYoaXNFbXB0eShkaWZmKSkgcmV0dXJuIGZhbHNlXG4gICAgbGV0IGh0bWwgPSB0aGlzLnJlbmRlcmVkLmNvbXBvbmVudFRvU3RyaW5nKGNpZClcbiAgICBsZXQgcGF0Y2ggPSBuZXcgRE9NUGF0Y2godGhpcywgdGhpcy5lbCwgdGhpcy5pZCwgaHRtbCwgY2lkKVxuICAgIGxldCBjaGlsZHJlbkFkZGVkID0gdGhpcy5wZXJmb3JtUGF0Y2gocGF0Y2gsIHRydWUpXG4gICAgcmV0dXJuIGNoaWxkcmVuQWRkZWRcbiAgfVxuXG4gIGdldEhvb2soZWwpeyByZXR1cm4gdGhpcy52aWV3SG9va3NbVmlld0hvb2suZWxlbWVudElEKGVsKV0gfVxuXG4gIGFkZEhvb2soZWwpe1xuICAgIGlmKFZpZXdIb29rLmVsZW1lbnRJRChlbCkgfHwgIWVsLmdldEF0dHJpYnV0ZSl7IHJldHVybiB9XG4gICAgbGV0IGhvb2tOYW1lID0gZWwuZ2V0QXR0cmlidXRlKGBkYXRhLXBoeC0ke1BIWF9IT09LfWApIHx8IGVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0hPT0spKVxuICAgIGlmKGhvb2tOYW1lICYmICF0aGlzLm93bnNFbGVtZW50KGVsKSl7IHJldHVybiB9XG4gICAgbGV0IGNhbGxiYWNrcyA9IHRoaXMubGl2ZVNvY2tldC5nZXRIb29rQ2FsbGJhY2tzKGhvb2tOYW1lKVxuXG4gICAgaWYoY2FsbGJhY2tzKXtcbiAgICAgIGlmKCFlbC5pZCl7IGxvZ0Vycm9yKGBubyBET00gSUQgZm9yIGhvb2sgXCIke2hvb2tOYW1lfVwiLiBIb29rcyByZXF1aXJlIGEgdW5pcXVlIElEIG9uIGVhY2ggZWxlbWVudC5gLCBlbCkgfVxuICAgICAgbGV0IGhvb2sgPSBuZXcgVmlld0hvb2sodGhpcywgZWwsIGNhbGxiYWNrcylcbiAgICAgIHRoaXMudmlld0hvb2tzW1ZpZXdIb29rLmVsZW1lbnRJRChob29rLmVsKV0gPSBob29rXG4gICAgICByZXR1cm4gaG9va1xuICAgIH0gZWxzZSBpZihob29rTmFtZSAhPT0gbnVsbCl7XG4gICAgICBsb2dFcnJvcihgdW5rbm93biBob29rIGZvdW5kIGZvciBcIiR7aG9va05hbWV9XCJgLCBlbClcbiAgICB9XG4gIH1cblxuICBkZXN0cm95SG9vayhob29rKXtcbiAgICBob29rLl9fZGVzdHJveWVkKClcbiAgICBob29rLl9fY2xlYW51cF9fKClcbiAgICBkZWxldGUgdGhpcy52aWV3SG9va3NbVmlld0hvb2suZWxlbWVudElEKGhvb2suZWwpXVxuICB9XG5cbiAgYXBwbHlQZW5kaW5nVXBkYXRlcygpe1xuICAgIHRoaXMucGVuZGluZ0RpZmZzLmZvckVhY2goKHtkaWZmLCBldmVudHN9KSA9PiB0aGlzLnVwZGF0ZShkaWZmLCBldmVudHMpKVxuICAgIHRoaXMucGVuZGluZ0RpZmZzID0gW11cbiAgfVxuXG4gIG9uQ2hhbm5lbChldmVudCwgY2Ipe1xuICAgIHRoaXMubGl2ZVNvY2tldC5vbkNoYW5uZWwodGhpcy5jaGFubmVsLCBldmVudCwgcmVzcCA9PiB7XG4gICAgICBpZih0aGlzLmlzSm9pblBlbmRpbmcoKSl7XG4gICAgICAgIHRoaXMucm9vdC5wZW5kaW5nSm9pbk9wcy5wdXNoKFt0aGlzLCAoKSA9PiBjYihyZXNwKV0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiBjYihyZXNwKSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYmluZENoYW5uZWwoKXtcbiAgICAvLyBUaGUgZGlmZiBldmVudCBzaG91bGQgYmUgaGFuZGxlZCBieSB0aGUgcmVndWxhciB1cGRhdGUgb3BlcmF0aW9ucy5cbiAgICAvLyBBbGwgb3RoZXIgb3BlcmF0aW9ucyBhcmUgcXVldWVkIHRvIGJlIGFwcGxpZWQgb25seSBhZnRlciBqb2luLlxuICAgIHRoaXMubGl2ZVNvY2tldC5vbkNoYW5uZWwodGhpcy5jaGFubmVsLCBcImRpZmZcIiwgKHJhd0RpZmYpID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgdGhpcy5hcHBseURpZmYoXCJ1cGRhdGVcIiwgcmF3RGlmZiwgKHtkaWZmLCBldmVudHN9KSA9PiB0aGlzLnVwZGF0ZShkaWZmLCBldmVudHMpKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHRoaXMub25DaGFubmVsKFwicmVkaXJlY3RcIiwgKHt0bywgZmxhc2h9KSA9PiB0aGlzLm9uUmVkaXJlY3Qoe3RvLCBmbGFzaH0pKVxuICAgIHRoaXMub25DaGFubmVsKFwibGl2ZV9wYXRjaFwiLCAocmVkaXIpID0+IHRoaXMub25MaXZlUGF0Y2gocmVkaXIpKVxuICAgIHRoaXMub25DaGFubmVsKFwibGl2ZV9yZWRpcmVjdFwiLCAocmVkaXIpID0+IHRoaXMub25MaXZlUmVkaXJlY3QocmVkaXIpKVxuICAgIHRoaXMuY2hhbm5lbC5vbkVycm9yKHJlYXNvbiA9PiB0aGlzLm9uRXJyb3IocmVhc29uKSlcbiAgICB0aGlzLmNoYW5uZWwub25DbG9zZShyZWFzb24gPT4gdGhpcy5vbkNsb3NlKHJlYXNvbikpXG4gIH1cblxuICBkZXN0cm95QWxsQ2hpbGRyZW4oKXtcbiAgICBmb3IobGV0IGlkIGluIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXSl7XG4gICAgICB0aGlzLmdldENoaWxkQnlJZChpZCkuZGVzdHJveSgpXG4gICAgfVxuICB9XG5cbiAgb25MaXZlUmVkaXJlY3QocmVkaXIpe1xuICAgIGxldCB7dG8sIGtpbmQsIGZsYXNofSA9IHJlZGlyXG4gICAgbGV0IHVybCA9IHRoaXMuZXhwYW5kVVJMKHRvKVxuICAgIHRoaXMubGl2ZVNvY2tldC5oaXN0b3J5UmVkaXJlY3QodXJsLCBraW5kLCBmbGFzaClcbiAgfVxuXG4gIG9uTGl2ZVBhdGNoKHJlZGlyKXtcbiAgICBsZXQge3RvLCBraW5kfSA9IHJlZGlyXG4gICAgdGhpcy5ocmVmID0gdGhpcy5leHBhbmRVUkwodG8pXG4gICAgdGhpcy5saXZlU29ja2V0Lmhpc3RvcnlQYXRjaCh0bywga2luZClcbiAgfVxuXG4gIGV4cGFuZFVSTCh0byl7XG4gICAgcmV0dXJuIHRvLnN0YXJ0c1dpdGgoXCIvXCIpID8gYCR7d2luZG93LmxvY2F0aW9uLnByb3RvY29sfS8vJHt3aW5kb3cubG9jYXRpb24uaG9zdH0ke3RvfWAgOiB0b1xuICB9XG5cbiAgb25SZWRpcmVjdCh7dG8sIGZsYXNofSl7IHRoaXMubGl2ZVNvY2tldC5yZWRpcmVjdCh0bywgZmxhc2gpIH1cblxuICBpc0Rlc3Ryb3llZCgpeyByZXR1cm4gdGhpcy5kZXN0cm95ZWQgfVxuXG4gIGpvaW4oY2FsbGJhY2spe1xuICAgIGlmKCF0aGlzLnBhcmVudCl7XG4gICAgICB0aGlzLnN0b3BDYWxsYmFjayA9IHRoaXMubGl2ZVNvY2tldC53aXRoUGFnZUxvYWRpbmcoe3RvOiB0aGlzLmhyZWYsIGtpbmQ6IFwiaW5pdGlhbFwifSlcbiAgICB9XG4gICAgdGhpcy5qb2luQ2FsbGJhY2sgPSAob25Eb25lKSA9PiB7XG4gICAgICBvbkRvbmUgPSBvbkRvbmUgfHwgZnVuY3Rpb24oKXt9XG4gICAgICBjYWxsYmFjayA/IGNhbGxiYWNrKHRoaXMuam9pbkNvdW50LCBvbkRvbmUpIDogb25Eb25lKClcbiAgICB9XG4gICAgdGhpcy5saXZlU29ja2V0LndyYXBQdXNoKHRoaXMsIHt0aW1lb3V0OiBmYWxzZX0sICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNoYW5uZWwuam9pbigpXG4gICAgICAgIC5yZWNlaXZlKFwib2tcIiwgZGF0YSA9PiB7XG4gICAgICAgICAgaWYoIXRoaXMuaXNEZXN0cm95ZWQoKSl7XG4gICAgICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB0aGlzLm9uSm9pbihkYXRhKSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5yZWNlaXZlKFwiZXJyb3JcIiwgcmVzcCA9PiAhdGhpcy5pc0Rlc3Ryb3llZCgpICYmIHRoaXMub25Kb2luRXJyb3IocmVzcCkpXG4gICAgICAgIC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiAhdGhpcy5pc0Rlc3Ryb3llZCgpICYmIHRoaXMub25Kb2luRXJyb3Ioe3JlYXNvbjogXCJ0aW1lb3V0XCJ9KSlcbiAgICB9KVxuICB9XG5cbiAgb25Kb2luRXJyb3IocmVzcCl7XG4gICAgaWYocmVzcC5yZWFzb24gPT09IFwidW5hdXRob3JpemVkXCIgfHwgcmVzcC5yZWFzb24gPT09IFwic3RhbGVcIil7XG4gICAgICB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtcInVuYXV0aG9yaXplZCBsaXZlX3JlZGlyZWN0LiBGYWxsaW5nIGJhY2sgdG8gcGFnZSByZXF1ZXN0XCIsIHJlc3BdKVxuICAgICAgcmV0dXJuIHRoaXMub25SZWRpcmVjdCh7dG86IHRoaXMuaHJlZn0pXG4gICAgfVxuICAgIGlmKHJlc3AucmVkaXJlY3QgfHwgcmVzcC5saXZlX3JlZGlyZWN0KXtcbiAgICAgIHRoaXMuam9pblBlbmRpbmcgPSBmYWxzZVxuICAgICAgdGhpcy5jaGFubmVsLmxlYXZlKClcbiAgICB9XG4gICAgaWYocmVzcC5yZWRpcmVjdCl7IHJldHVybiB0aGlzLm9uUmVkaXJlY3QocmVzcC5yZWRpcmVjdCkgfVxuICAgIGlmKHJlc3AubGl2ZV9yZWRpcmVjdCl7IHJldHVybiB0aGlzLm9uTGl2ZVJlZGlyZWN0KHJlc3AubGl2ZV9yZWRpcmVjdCkgfVxuICAgIHRoaXMubG9nKFwiZXJyb3JcIiwgKCkgPT4gW1widW5hYmxlIHRvIGpvaW5cIiwgcmVzcF0pXG4gICAgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC5yZWxvYWRXaXRoSml0dGVyKHRoaXMpXG4gIH1cblxuICBvbkNsb3NlKHJlYXNvbil7XG4gICAgaWYodGhpcy5pc0Rlc3Ryb3llZCgpKXsgcmV0dXJuIH1cbiAgICBpZigodGhpcy5pc0pvaW5QZW5kaW5nKCkgJiYgZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlICE9PSBcImhpZGRlblwiKSB8fFxuICAgICAgKHRoaXMubGl2ZVNvY2tldC5oYXNQZW5kaW5nTGluaygpICYmIHJlYXNvbiAhPT0gXCJsZWF2ZVwiKSl7XG5cbiAgICAgIHJldHVybiB0aGlzLmxpdmVTb2NrZXQucmVsb2FkV2l0aEppdHRlcih0aGlzKVxuICAgIH1cbiAgICB0aGlzLmRlc3Ryb3lBbGxDaGlsZHJlbigpXG4gICAgdGhpcy5saXZlU29ja2V0LmRyb3BBY3RpdmVFbGVtZW50KHRoaXMpXG4gICAgLy8gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBjYW4gYmUgbnVsbCBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMVxuICAgIGlmKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpeyBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKSB9XG4gICAgaWYodGhpcy5saXZlU29ja2V0LmlzVW5sb2FkZWQoKSl7XG4gICAgICB0aGlzLnNob3dMb2FkZXIoQkVGT1JFX1VOTE9BRF9MT0FERVJfVElNRU9VVClcbiAgICB9XG4gIH1cblxuICBvbkVycm9yKHJlYXNvbil7XG4gICAgdGhpcy5vbkNsb3NlKHJlYXNvbilcbiAgICB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtcInZpZXcgY3Jhc2hlZFwiLCByZWFzb25dKVxuICAgIGlmKCF0aGlzLmxpdmVTb2NrZXQuaXNVbmxvYWRlZCgpKXsgdGhpcy5kaXNwbGF5RXJyb3IoKSB9XG4gIH1cblxuICBkaXNwbGF5RXJyb3IoKXtcbiAgICBpZih0aGlzLmlzTWFpbigpKXsgRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBcInBoeDpwYWdlLWxvYWRpbmctc3RhcnRcIiwge3RvOiB0aGlzLmhyZWYsIGtpbmQ6IFwiZXJyb3JcIn0pIH1cbiAgICB0aGlzLnNob3dMb2FkZXIoKVxuICAgIHRoaXMuc2V0Q29udGFpbmVyQ2xhc3NlcyhQSFhfRElTQ09OTkVDVEVEX0NMQVNTLCBQSFhfRVJST1JfQ0xBU1MpXG4gIH1cblxuICBwdXNoV2l0aFJlcGx5KHJlZkdlbmVyYXRvciwgZXZlbnQsIHBheWxvYWQsIG9uUmVwbHkgPSBmdW5jdGlvbiAoKXsgfSl7XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9XG5cbiAgICBsZXQgW3JlZiwgW2VsXSwgb3B0c10gPSByZWZHZW5lcmF0b3IgPyByZWZHZW5lcmF0b3IoKSA6IFtudWxsLCBbXSwge31dXG4gICAgbGV0IG9uTG9hZGluZ0RvbmUgPSBmdW5jdGlvbigpeyB9XG4gICAgaWYob3B0cy5wYWdlX2xvYWRpbmcgfHwgKGVsICYmIChlbC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9QQUdFX0xPQURJTkcpKSAhPT0gbnVsbCkpKXtcbiAgICAgIG9uTG9hZGluZ0RvbmUgPSB0aGlzLmxpdmVTb2NrZXQud2l0aFBhZ2VMb2FkaW5nKHtraW5kOiBcImVsZW1lbnRcIiwgdGFyZ2V0OiBlbH0pXG4gICAgfVxuXG4gICAgaWYodHlwZW9mIChwYXlsb2FkLmNpZCkgIT09IFwibnVtYmVyXCIpeyBkZWxldGUgcGF5bG9hZC5jaWQgfVxuICAgIHJldHVybiAoXG4gICAgICB0aGlzLmxpdmVTb2NrZXQud3JhcFB1c2godGhpcywge3RpbWVvdXQ6IHRydWV9LCAoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYW5uZWwucHVzaChldmVudCwgcGF5bG9hZCwgUFVTSF9USU1FT1VUKS5yZWNlaXZlKFwib2tcIiwgcmVzcCA9PiB7XG4gICAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGhvb2tSZXBseSA9IG51bGxcbiAgICAgICAgICAgIGlmKHJlZiAhPT0gbnVsbCl7IHRoaXMudW5kb1JlZnMocmVmKSB9XG4gICAgICAgICAgICBpZihyZXNwLmRpZmYpe1xuICAgICAgICAgICAgICBob29rUmVwbHkgPSB0aGlzLmFwcGx5RGlmZihcInVwZGF0ZVwiLCByZXNwLmRpZmYsICh7ZGlmZiwgZXZlbnRzfSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKGRpZmYsIGV2ZW50cylcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHJlc3AucmVkaXJlY3QpeyB0aGlzLm9uUmVkaXJlY3QocmVzcC5yZWRpcmVjdCkgfVxuICAgICAgICAgICAgaWYocmVzcC5saXZlX3BhdGNoKXsgdGhpcy5vbkxpdmVQYXRjaChyZXNwLmxpdmVfcGF0Y2gpIH1cbiAgICAgICAgICAgIGlmKHJlc3AubGl2ZV9yZWRpcmVjdCl7IHRoaXMub25MaXZlUmVkaXJlY3QocmVzcC5saXZlX3JlZGlyZWN0KSB9XG4gICAgICAgICAgICBvbkxvYWRpbmdEb25lKClcbiAgICAgICAgICAgIG9uUmVwbHkocmVzcCwgaG9va1JlcGx5KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIClcbiAgfVxuXG4gIHVuZG9SZWZzKHJlZil7XG4gICAgRE9NLmFsbCh0aGlzLmVsLCBgWyR7UEhYX1JFRn09XCIke3JlZn1cIl1gLCBlbCA9PiB7XG4gICAgICBsZXQgZGlzYWJsZWRWYWwgPSBlbC5nZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVEKVxuICAgICAgLy8gcmVtb3ZlIHJlZnNcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGKVxuICAgICAgLy8gcmVzdG9yZSBpbnB1dHNcbiAgICAgIGlmKGVsLmdldEF0dHJpYnV0ZShQSFhfUkVBRE9OTFkpICE9PSBudWxsKXtcbiAgICAgICAgZWwucmVhZE9ubHkgPSBmYWxzZVxuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX1JFQURPTkxZKVxuICAgICAgfVxuICAgICAgaWYoZGlzYWJsZWRWYWwgIT09IG51bGwpe1xuICAgICAgICBlbC5kaXNhYmxlZCA9IGRpc2FibGVkVmFsID09PSBcInRydWVcIiA/IHRydWUgOiBmYWxzZVxuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX0RJU0FCTEVEKVxuICAgICAgfVxuICAgICAgLy8gcmVtb3ZlIGNsYXNzZXNcbiAgICAgIFBIWF9FVkVOVF9DTEFTU0VTLmZvckVhY2goY2xhc3NOYW1lID0+IERPTS5yZW1vdmVDbGFzcyhlbCwgY2xhc3NOYW1lKSlcbiAgICAgIC8vIHJlc3RvcmUgZGlzYWJsZXNcbiAgICAgIGxldCBkaXNhYmxlUmVzdG9yZSA9IGVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUpXG4gICAgICBpZihkaXNhYmxlUmVzdG9yZSAhPT0gbnVsbCl7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IGRpc2FibGVSZXN0b3JlXG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUpXG4gICAgICB9XG4gICAgICBsZXQgdG9FbCA9IERPTS5wcml2YXRlKGVsLCBQSFhfUkVGKVxuICAgICAgaWYodG9FbCl7XG4gICAgICAgIGxldCBob29rID0gdGhpcy50cmlnZ2VyQmVmb3JlVXBkYXRlSG9vayhlbCwgdG9FbClcbiAgICAgICAgRE9NUGF0Y2gucGF0Y2hFbChlbCwgdG9FbCwgdGhpcy5saXZlU29ja2V0LmdldEFjdGl2ZUVsZW1lbnQoKSlcbiAgICAgICAgaWYoaG9vayl7IGhvb2suX191cGRhdGVkKCkgfVxuICAgICAgICBET00uZGVsZXRlUHJpdmF0ZShlbCwgUEhYX1JFRilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcHV0UmVmKGVsZW1lbnRzLCBldmVudCwgb3B0cyA9IHt9KXtcbiAgICBsZXQgbmV3UmVmID0gdGhpcy5yZWYrK1xuICAgIGxldCBkaXNhYmxlV2l0aCA9IHRoaXMuYmluZGluZyhQSFhfRElTQUJMRV9XSVRIKVxuICAgIGlmKG9wdHMubG9hZGluZyl7IGVsZW1lbnRzID0gZWxlbWVudHMuY29uY2F0KERPTS5hbGwoZG9jdW1lbnQsIG9wdHMubG9hZGluZykpfVxuXG4gICAgZWxlbWVudHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKGBwaHgtJHtldmVudH0tbG9hZGluZ2ApXG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX1JFRiwgbmV3UmVmKVxuICAgICAgbGV0IGRpc2FibGVUZXh0ID0gZWwuZ2V0QXR0cmlidXRlKGRpc2FibGVXaXRoKVxuICAgICAgaWYoZGlzYWJsZVRleHQgIT09IG51bGwpe1xuICAgICAgICBpZighZWwuZ2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRSkpe1xuICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUsIGVsLmlubmVyVGV4dClcbiAgICAgICAgfVxuICAgICAgICBlbC5pbm5lclRleHQgPSBkaXNhYmxlVGV4dFxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIFtuZXdSZWYsIGVsZW1lbnRzLCBvcHRzXVxuICB9XG5cbiAgY29tcG9uZW50SUQoZWwpe1xuICAgIGxldCBjaWQgPSBlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpXG4gICAgcmV0dXJuIGNpZCA/IHBhcnNlSW50KGNpZCkgOiBudWxsXG4gIH1cblxuICB0YXJnZXRDb21wb25lbnRJRCh0YXJnZXQsIHRhcmdldEN0eCl7XG4gICAgaWYoaXNDaWQodGFyZ2V0Q3R4KSl7IHJldHVybiB0YXJnZXRDdHggfVxuXG4gICAgbGV0IGNpZE9yU2VsZWN0b3IgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcInRhcmdldFwiKSlcbiAgICBpZihpc0NpZChjaWRPclNlbGVjdG9yKSl7XG4gICAgICByZXR1cm4gcGFyc2VJbnQoY2lkT3JTZWxlY3RvcilcbiAgICB9IGVsc2UgaWYodGFyZ2V0Q3R4ICYmIGNpZE9yU2VsZWN0b3IgIT09IG51bGwpe1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2VzdENvbXBvbmVudElEKHRhcmdldEN0eClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBjbG9zZXN0Q29tcG9uZW50SUQodGFyZ2V0Q3R4KXtcbiAgICBpZihpc0NpZCh0YXJnZXRDdHgpKXtcbiAgICAgIHJldHVybiB0YXJnZXRDdHhcbiAgICB9IGVsc2UgaWYodGFyZ2V0Q3R4KXtcbiAgICAgIHJldHVybiBtYXliZSh0YXJnZXRDdHguY2xvc2VzdChgWyR7UEhYX0NPTVBPTkVOVH1dYCksIGVsID0+IHRoaXMub3duc0VsZW1lbnQoZWwpICYmIHRoaXMuY29tcG9uZW50SUQoZWwpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIHB1c2hIb29rRXZlbnQodGFyZ2V0Q3R4LCBldmVudCwgcGF5bG9hZCwgb25SZXBseSl7XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSl7XG4gICAgICB0aGlzLmxvZyhcImhvb2tcIiwgKCkgPT4gW1widW5hYmxlIHRvIHB1c2ggaG9vayBldmVudC4gTGl2ZVZpZXcgbm90IGNvbm5lY3RlZFwiLCBldmVudCwgcGF5bG9hZF0pXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgbGV0IFtyZWYsIGVscywgb3B0c10gPSB0aGlzLnB1dFJlZihbXSwgXCJob29rXCIpXG4gICAgdGhpcy5wdXNoV2l0aFJlcGx5KCgpID0+IFtyZWYsIGVscywgb3B0c10sIFwiZXZlbnRcIiwge1xuICAgICAgdHlwZTogXCJob29rXCIsXG4gICAgICBldmVudDogZXZlbnQsXG4gICAgICB2YWx1ZTogcGF5bG9hZCxcbiAgICAgIGNpZDogdGhpcy5jbG9zZXN0Q29tcG9uZW50SUQodGFyZ2V0Q3R4KVxuICAgIH0sIChyZXNwLCByZXBseSkgPT4gb25SZXBseShyZXBseSwgcmVmKSlcblxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIGV4dHJhY3RNZXRhKGVsLCBtZXRhLCB2YWx1ZSl7XG4gICAgbGV0IHByZWZpeCA9IHRoaXMuYmluZGluZyhcInZhbHVlLVwiKVxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBlbC5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGlmKCFtZXRhKXsgbWV0YSA9IHt9IH1cbiAgICAgIGxldCBuYW1lID0gZWwuYXR0cmlidXRlc1tpXS5uYW1lXG4gICAgICBpZihuYW1lLnN0YXJ0c1dpdGgocHJlZml4KSl7IG1ldGFbbmFtZS5yZXBsYWNlKHByZWZpeCwgXCJcIildID0gZWwuZ2V0QXR0cmlidXRlKG5hbWUpIH1cbiAgICB9XG4gICAgaWYoZWwudmFsdWUgIT09IHVuZGVmaW5lZCl7XG4gICAgICBpZighbWV0YSl7IG1ldGEgPSB7fSB9XG4gICAgICBtZXRhLnZhbHVlID0gZWwudmFsdWVcblxuICAgICAgaWYoZWwudGFnTmFtZSA9PT0gXCJJTlBVVFwiICYmIENIRUNLQUJMRV9JTlBVVFMuaW5kZXhPZihlbC50eXBlKSA+PSAwICYmICFlbC5jaGVja2VkKXtcbiAgICAgICAgZGVsZXRlIG1ldGEudmFsdWVcbiAgICAgIH1cbiAgICB9XG4gICAgaWYodmFsdWUpe1xuICAgICAgaWYoIW1ldGEpeyBtZXRhID0ge30gfVxuICAgICAgZm9yKGxldCBrZXkgaW4gdmFsdWUpeyBtZXRhW2tleV0gPSB2YWx1ZVtrZXldIH1cbiAgICB9XG4gICAgcmV0dXJuIG1ldGFcbiAgfVxuXG4gIHB1c2hFdmVudCh0eXBlLCBlbCwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgbWV0YSwgb3B0cyA9IHt9KXtcbiAgICB0aGlzLnB1c2hXaXRoUmVwbHkoKCkgPT4gdGhpcy5wdXRSZWYoW2VsXSwgdHlwZSwgb3B0cyksIFwiZXZlbnRcIiwge1xuICAgICAgdHlwZTogdHlwZSxcbiAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgIHZhbHVlOiB0aGlzLmV4dHJhY3RNZXRhKGVsLCBtZXRhLCBvcHRzLnZhbHVlKSxcbiAgICAgIGNpZDogdGhpcy50YXJnZXRDb21wb25lbnRJRChlbCwgdGFyZ2V0Q3R4KVxuICAgIH0pXG4gIH1cblxuICBwdXNoRmlsZVByb2dyZXNzKGZpbGVFbCwgZW50cnlSZWYsIHByb2dyZXNzLCBvblJlcGx5ID0gZnVuY3Rpb24gKCl7IH0pe1xuICAgIHRoaXMubGl2ZVNvY2tldC53aXRoaW5Pd25lcnMoZmlsZUVsLmZvcm0sICh2aWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgIHZpZXcucHVzaFdpdGhSZXBseShudWxsLCBcInByb2dyZXNzXCIsIHtcbiAgICAgICAgZXZlbnQ6IGZpbGVFbC5nZXRBdHRyaWJ1dGUodmlldy5iaW5kaW5nKFBIWF9QUk9HUkVTUykpLFxuICAgICAgICByZWY6IGZpbGVFbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpLFxuICAgICAgICBlbnRyeV9yZWY6IGVudHJ5UmVmLFxuICAgICAgICBwcm9ncmVzczogcHJvZ3Jlc3MsXG4gICAgICAgIGNpZDogdmlldy50YXJnZXRDb21wb25lbnRJRChmaWxlRWwuZm9ybSwgdGFyZ2V0Q3R4KVxuICAgICAgfSwgb25SZXBseSlcbiAgICB9KVxuICB9XG5cbiAgcHVzaElucHV0KGlucHV0RWwsIHRhcmdldEN0eCwgZm9yY2VDaWQsIHBoeEV2ZW50LCBvcHRzLCBjYWxsYmFjayl7XG4gICAgbGV0IHVwbG9hZHNcbiAgICBsZXQgY2lkID0gaXNDaWQoZm9yY2VDaWQpID8gZm9yY2VDaWQgOiB0aGlzLnRhcmdldENvbXBvbmVudElEKGlucHV0RWwuZm9ybSwgdGFyZ2V0Q3R4KVxuICAgIGxldCByZWZHZW5lcmF0b3IgPSAoKSA9PiB0aGlzLnB1dFJlZihbaW5wdXRFbCwgaW5wdXRFbC5mb3JtXSwgXCJjaGFuZ2VcIiwgb3B0cylcbiAgICBsZXQgZm9ybURhdGEgPSBzZXJpYWxpemVGb3JtKGlucHV0RWwuZm9ybSwge190YXJnZXQ6IG9wdHMuX3RhcmdldH0pXG4gICAgaWYoRE9NLmlzVXBsb2FkSW5wdXQoaW5wdXRFbCkgJiYgaW5wdXRFbC5maWxlcyAmJiBpbnB1dEVsLmZpbGVzLmxlbmd0aCA+IDApe1xuICAgICAgTGl2ZVVwbG9hZGVyLnRyYWNrRmlsZXMoaW5wdXRFbCwgQXJyYXkuZnJvbShpbnB1dEVsLmZpbGVzKSlcbiAgICB9XG4gICAgdXBsb2FkcyA9IExpdmVVcGxvYWRlci5zZXJpYWxpemVVcGxvYWRzKGlucHV0RWwpXG4gICAgbGV0IGV2ZW50ID0ge1xuICAgICAgdHlwZTogXCJmb3JtXCIsXG4gICAgICBldmVudDogcGh4RXZlbnQsXG4gICAgICB2YWx1ZTogZm9ybURhdGEsXG4gICAgICB1cGxvYWRzOiB1cGxvYWRzLFxuICAgICAgY2lkOiBjaWRcbiAgICB9XG4gICAgdGhpcy5wdXNoV2l0aFJlcGx5KHJlZkdlbmVyYXRvciwgXCJldmVudFwiLCBldmVudCwgcmVzcCA9PiB7XG4gICAgICBET00uc2hvd0Vycm9yKGlucHV0RWwsIHRoaXMubGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9GRUVEQkFDS19GT1IpKVxuICAgICAgaWYoRE9NLmlzVXBsb2FkSW5wdXQoaW5wdXRFbCkgJiYgaW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBoeC1hdXRvLXVwbG9hZFwiKSAhPT0gbnVsbCl7XG4gICAgICAgIGlmKExpdmVVcGxvYWRlci5maWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0RWwpLmxlbmd0aCA+IDApe1xuICAgICAgICAgIGxldCBbcmVmLCBfZWxzXSA9IHJlZkdlbmVyYXRvcigpXG4gICAgICAgICAgdGhpcy51cGxvYWRGaWxlcyhpbnB1dEVsLmZvcm0sIHRhcmdldEN0eCwgcmVmLCBjaWQsIChfdXBsb2FkcykgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2socmVzcClcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckF3YWl0aW5nU3VibWl0KGlucHV0RWwuZm9ybSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhyZXNwKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB0cmlnZ2VyQXdhaXRpbmdTdWJtaXQoZm9ybUVsKXtcbiAgICBsZXQgYXdhaXRpbmdTdWJtaXQgPSB0aGlzLmdldFNjaGVkdWxlZFN1Ym1pdChmb3JtRWwpXG4gICAgaWYoYXdhaXRpbmdTdWJtaXQpe1xuICAgICAgbGV0IFtfZWwsIF9yZWYsIF9vcHRzLCBjYWxsYmFja10gPSBhd2FpdGluZ1N1Ym1pdFxuICAgICAgdGhpcy5jYW5jZWxTdWJtaXQoZm9ybUVsKVxuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuXG4gIGdldFNjaGVkdWxlZFN1Ym1pdChmb3JtRWwpe1xuICAgIHJldHVybiB0aGlzLmZvcm1TdWJtaXRzLmZpbmQoKFtlbCwgX3JlZiwgX29wdHMsIF9jYWxsYmFja10pID0+IGVsLmlzU2FtZU5vZGUoZm9ybUVsKSlcbiAgfVxuXG4gIHNjaGVkdWxlU3VibWl0KGZvcm1FbCwgcmVmLCBvcHRzLCBjYWxsYmFjayl7XG4gICAgaWYodGhpcy5nZXRTY2hlZHVsZWRTdWJtaXQoZm9ybUVsKSl7IHJldHVybiB0cnVlIH1cbiAgICB0aGlzLmZvcm1TdWJtaXRzLnB1c2goW2Zvcm1FbCwgcmVmLCBvcHRzLCBjYWxsYmFja10pXG4gIH1cblxuICBjYW5jZWxTdWJtaXQoZm9ybUVsKXtcbiAgICB0aGlzLmZvcm1TdWJtaXRzID0gdGhpcy5mb3JtU3VibWl0cy5maWx0ZXIoKFtlbCwgcmVmLCBfY2FsbGJhY2tdKSA9PiB7XG4gICAgICBpZihlbC5pc1NhbWVOb2RlKGZvcm1FbCkpe1xuICAgICAgICB0aGlzLnVuZG9SZWZzKHJlZilcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBwdXNoRm9ybVN1Ym1pdChmb3JtRWwsIHRhcmdldEN0eCwgcGh4RXZlbnQsIG9wdHMsIG9uUmVwbHkpe1xuICAgIGxldCBmaWx0ZXJJZ25vcmVkID0gZWwgPT4ge1xuICAgICAgbGV0IHVzZXJJZ25vcmVkID0gY2xvc2VzdFBoeEJpbmRpbmcoZWwsIGAke3RoaXMuYmluZGluZyhQSFhfVVBEQVRFKX09aWdub3JlYCwgZWwuZm9ybSlcbiAgICAgIHJldHVybiAhKHVzZXJJZ25vcmVkIHx8IGNsb3Nlc3RQaHhCaW5kaW5nKGVsLCBcImRhdGEtcGh4LXVwZGF0ZT1pZ25vcmVcIiwgZWwuZm9ybSkpXG4gICAgfVxuICAgIGxldCBmaWx0ZXJEaXNhYmxlcyA9IGVsID0+IHtcbiAgICAgIHJldHVybiBlbC5oYXNBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9ESVNBQkxFX1dJVEgpKVxuICAgIH1cbiAgICBsZXQgZmlsdGVyQnV0dG9uID0gZWwgPT4gZWwudGFnTmFtZSA9PSBcIkJVVFRPTlwiXG5cbiAgICBsZXQgZmlsdGVySW5wdXQgPSBlbCA9PiBbXCJJTlBVVFwiLCBcIlRFWFRBUkVBXCIsIFwiU0VMRUNUXCJdLmluY2x1ZGVzKGVsLnRhZ05hbWUpXG5cbiAgICBsZXQgcmVmR2VuZXJhdG9yID0gKCkgPT4ge1xuICAgICAgbGV0IGZvcm1FbGVtZW50cyA9IEFycmF5LmZyb20oZm9ybUVsLmVsZW1lbnRzKVxuICAgICAgbGV0IGRpc2FibGVzID0gZm9ybUVsZW1lbnRzLmZpbHRlcihmaWx0ZXJEaXNhYmxlcylcbiAgICAgIGxldCBidXR0b25zID0gZm9ybUVsZW1lbnRzLmZpbHRlcihmaWx0ZXJCdXR0b24pLmZpbHRlcihmaWx0ZXJJZ25vcmVkKVxuICAgICAgbGV0IGlucHV0cyA9IGZvcm1FbGVtZW50cy5maWx0ZXIoZmlsdGVySW5wdXQpLmZpbHRlcihmaWx0ZXJJZ25vcmVkKVxuXG4gICAgICBidXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQsIGJ1dHRvbi5kaXNhYmxlZClcbiAgICAgICAgYnV0dG9uLmRpc2FibGVkID0gdHJ1ZVxuICAgICAgfSlcbiAgICAgIGlucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFBIWF9SRUFET05MWSwgaW5wdXQucmVhZE9ubHkpXG4gICAgICAgIGlucHV0LnJlYWRPbmx5ID0gdHJ1ZVxuICAgICAgICBpZihpbnB1dC5maWxlcyl7XG4gICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFRCwgaW5wdXQuZGlzYWJsZWQpXG4gICAgICAgICAgaW5wdXQuZGlzYWJsZWQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBmb3JtRWwuc2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfUEFHRV9MT0FESU5HKSwgXCJcIilcbiAgICAgIHJldHVybiB0aGlzLnB1dFJlZihbZm9ybUVsXS5jb25jYXQoZGlzYWJsZXMpLmNvbmNhdChidXR0b25zKS5jb25jYXQoaW5wdXRzKSwgXCJzdWJtaXRcIiwgb3B0cylcbiAgICB9XG5cbiAgICBsZXQgY2lkID0gdGhpcy50YXJnZXRDb21wb25lbnRJRChmb3JtRWwsIHRhcmdldEN0eClcbiAgICBpZihMaXZlVXBsb2FkZXIuaGFzVXBsb2Fkc0luUHJvZ3Jlc3MoZm9ybUVsKSl7XG4gICAgICBsZXQgW3JlZiwgX2Vsc10gPSByZWZHZW5lcmF0b3IoKVxuICAgICAgbGV0IHB1c2ggPSAoKSA9PiB0aGlzLnB1c2hGb3JtU3VibWl0KGZvcm1FbCwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgb3B0cywgb25SZXBseSlcbiAgICAgIHJldHVybiB0aGlzLnNjaGVkdWxlU3VibWl0KGZvcm1FbCwgcmVmLCBvcHRzLCBwdXNoKVxuICAgIH0gZWxzZSBpZihMaXZlVXBsb2FkZXIuaW5wdXRzQXdhaXRpbmdQcmVmbGlnaHQoZm9ybUVsKS5sZW5ndGggPiAwKXtcbiAgICAgIGxldCBbcmVmLCBlbHNdID0gcmVmR2VuZXJhdG9yKClcbiAgICAgIGxldCBwcm94eVJlZkdlbiA9ICgpID0+IFtyZWYsIGVscywgb3B0c11cbiAgICAgIHRoaXMudXBsb2FkRmlsZXMoZm9ybUVsLCB0YXJnZXRDdHgsIHJlZiwgY2lkLCAoX3VwbG9hZHMpID0+IHtcbiAgICAgICAgbGV0IGZvcm1EYXRhID0gc2VyaWFsaXplRm9ybShmb3JtRWwsIHt9KVxuICAgICAgICB0aGlzLnB1c2hXaXRoUmVwbHkocHJveHlSZWZHZW4sIFwiZXZlbnRcIiwge1xuICAgICAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgICAgICB2YWx1ZTogZm9ybURhdGEsXG4gICAgICAgICAgY2lkOiBjaWRcbiAgICAgICAgfSwgb25SZXBseSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBmb3JtRGF0YSA9IHNlcmlhbGl6ZUZvcm0oZm9ybUVsKVxuICAgICAgdGhpcy5wdXNoV2l0aFJlcGx5KHJlZkdlbmVyYXRvciwgXCJldmVudFwiLCB7XG4gICAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgICBldmVudDogcGh4RXZlbnQsXG4gICAgICAgIHZhbHVlOiBmb3JtRGF0YSxcbiAgICAgICAgY2lkOiBjaWRcbiAgICAgIH0sIG9uUmVwbHkpXG4gICAgfVxuICB9XG5cbiAgdXBsb2FkRmlsZXMoZm9ybUVsLCB0YXJnZXRDdHgsIHJlZiwgY2lkLCBvbkNvbXBsZXRlKXtcbiAgICBsZXQgam9pbkNvdW50QXRVcGxvYWQgPSB0aGlzLmpvaW5Db3VudFxuICAgIGxldCBpbnB1dEVscyA9IExpdmVVcGxvYWRlci5hY3RpdmVGaWxlSW5wdXRzKGZvcm1FbClcbiAgICBsZXQgbnVtRmlsZUlucHV0c0luUHJvZ3Jlc3MgPSBpbnB1dEVscy5sZW5ndGhcblxuICAgIC8vIGdldCBlYWNoIGZpbGUgaW5wdXRcbiAgICBpbnB1dEVscy5mb3JFYWNoKGlucHV0RWwgPT4ge1xuICAgICAgbGV0IHVwbG9hZGVyID0gbmV3IExpdmVVcGxvYWRlcihpbnB1dEVsLCB0aGlzLCAoKSA9PiB7XG4gICAgICAgIG51bUZpbGVJbnB1dHNJblByb2dyZXNzLS1cbiAgICAgICAgaWYobnVtRmlsZUlucHV0c0luUHJvZ3Jlc3MgPT09IDApeyBvbkNvbXBsZXRlKCkgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMudXBsb2FkZXJzW2lucHV0RWxdID0gdXBsb2FkZXJcbiAgICAgIGxldCBlbnRyaWVzID0gdXBsb2FkZXIuZW50cmllcygpLm1hcChlbnRyeSA9PiBlbnRyeS50b1ByZWZsaWdodFBheWxvYWQoKSlcblxuICAgICAgbGV0IHBheWxvYWQgPSB7XG4gICAgICAgIHJlZjogaW5wdXRFbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpLFxuICAgICAgICBlbnRyaWVzOiBlbnRyaWVzLFxuICAgICAgICBjaWQ6IHRoaXMudGFyZ2V0Q29tcG9uZW50SUQoaW5wdXRFbC5mb3JtLCB0YXJnZXRDdHgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMubG9nKFwidXBsb2FkXCIsICgpID0+IFtcInNlbmRpbmcgcHJlZmxpZ2h0IHJlcXVlc3RcIiwgcGF5bG9hZF0pXG5cbiAgICAgIHRoaXMucHVzaFdpdGhSZXBseShudWxsLCBcImFsbG93X3VwbG9hZFwiLCBwYXlsb2FkLCByZXNwID0+IHtcbiAgICAgICAgdGhpcy5sb2coXCJ1cGxvYWRcIiwgKCkgPT4gW1wiZ290IHByZWZsaWdodCByZXNwb25zZVwiLCByZXNwXSlcbiAgICAgICAgaWYocmVzcC5lcnJvcil7XG4gICAgICAgICAgdGhpcy51bmRvUmVmcyhyZWYpXG4gICAgICAgICAgbGV0IFtlbnRyeV9yZWYsIHJlYXNvbl0gPSByZXNwLmVycm9yXG4gICAgICAgICAgdGhpcy5sb2coXCJ1cGxvYWRcIiwgKCkgPT4gW2BlcnJvciBmb3IgZW50cnkgJHtlbnRyeV9yZWZ9YCwgcmVhc29uXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZXQgb25FcnJvciA9IChjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGFubmVsLm9uRXJyb3IoKCkgPT4ge1xuICAgICAgICAgICAgICBpZih0aGlzLmpvaW5Db3VudCA9PT0gam9pbkNvdW50QXRVcGxvYWQpeyBjYWxsYmFjaygpIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHVwbG9hZGVyLmluaXRBZGFwdGVyVXBsb2FkKHJlc3AsIG9uRXJyb3IsIHRoaXMubGl2ZVNvY2tldClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgZGlzcGF0Y2hVcGxvYWRzKG5hbWUsIGZpbGVzT3JCbG9icyl7XG4gICAgbGV0IGlucHV0cyA9IERPTS5maW5kVXBsb2FkSW5wdXRzKHRoaXMuZWwpLmZpbHRlcihlbCA9PiBlbC5uYW1lID09PSBuYW1lKVxuICAgIGlmKGlucHV0cy5sZW5ndGggPT09IDApeyBsb2dFcnJvcihgbm8gbGl2ZSBmaWxlIGlucHV0cyBmb3VuZCBtYXRjaGluZyB0aGUgbmFtZSBcIiR7bmFtZX1cImApIH1cbiAgICBlbHNlIGlmKGlucHV0cy5sZW5ndGggPiAxKXsgbG9nRXJyb3IoYGR1cGxpY2F0ZSBsaXZlIGZpbGUgaW5wdXRzIGZvdW5kIG1hdGNoaW5nIHRoZSBuYW1lIFwiJHtuYW1lfVwiYCkgfVxuICAgIGVsc2UgeyBET00uZGlzcGF0Y2hFdmVudChpbnB1dHNbMF0sIFBIWF9UUkFDS19VUExPQURTLCB7ZmlsZXM6IGZpbGVzT3JCbG9ic30pIH1cbiAgfVxuXG4gIHB1c2hGb3JtUmVjb3ZlcnkoZm9ybSwgbmV3Q2lkLCBjYWxsYmFjayl7XG4gICAgdGhpcy5saXZlU29ja2V0LndpdGhpbk93bmVycyhmb3JtLCAodmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICBsZXQgaW5wdXQgPSBmb3JtLmVsZW1lbnRzWzBdXG4gICAgICBsZXQgcGh4RXZlbnQgPSBmb3JtLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0FVVE9fUkVDT1ZFUikpIHx8IGZvcm0uZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcImNoYW5nZVwiKSlcblxuICAgICAgSlMuZXhlYyhcImNoYW5nZVwiLCBwaHhFdmVudCwgdmlldywgaW5wdXQsIFtcInB1c2hcIiwge190YXJnZXQ6IGlucHV0Lm5hbWUsIG5ld0NpZDogbmV3Q2lkLCBjYWxsYmFjazogY2FsbGJhY2t9XSlcbiAgICB9KVxuICB9XG5cbiAgcHVzaExpbmtQYXRjaChocmVmLCB0YXJnZXRFbCwgY2FsbGJhY2spe1xuICAgIGxldCBsaW5rUmVmID0gdGhpcy5saXZlU29ja2V0LnNldFBlbmRpbmdMaW5rKGhyZWYpXG4gICAgbGV0IHJlZkdlbiA9IHRhcmdldEVsID8gKCkgPT4gdGhpcy5wdXRSZWYoW3RhcmdldEVsXSwgXCJjbGlja1wiKSA6IG51bGxcblxuICAgIHRoaXMucHVzaFdpdGhSZXBseShyZWZHZW4sIFwibGl2ZV9wYXRjaFwiLCB7dXJsOiBocmVmfSwgcmVzcCA9PiB7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICAgIGlmKHJlc3AubGlua19yZWRpcmVjdCl7XG4gICAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcGxhY2VNYWluKGhyZWYsIG51bGwsIGNhbGxiYWNrLCBsaW5rUmVmKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmKHRoaXMubGl2ZVNvY2tldC5jb21taXRQZW5kaW5nTGluayhsaW5rUmVmKSl7XG4gICAgICAgICAgICB0aGlzLmhyZWYgPSBocmVmXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYXBwbHlQZW5kaW5nVXBkYXRlcygpXG4gICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobGlua1JlZilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KS5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiB0aGlzLmxpdmVTb2NrZXQucmVkaXJlY3Qod2luZG93LmxvY2F0aW9uLmhyZWYpKVxuICB9XG5cbiAgZm9ybXNGb3JSZWNvdmVyeShodG1sKXtcbiAgICBpZih0aGlzLmpvaW5Db3VudCA9PT0gMCl7IHJldHVybiBbXSB9XG5cbiAgICBsZXQgcGh4Q2hhbmdlID0gdGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFxuXG4gICAgcmV0dXJuIChcbiAgICAgIERPTS5hbGwodGhpcy5lbCwgYGZvcm1bJHtwaHhDaGFuZ2V9XWApXG4gICAgICAgIC5maWx0ZXIoZm9ybSA9PiBmb3JtLmlkICYmIHRoaXMub3duc0VsZW1lbnQoZm9ybSkpXG4gICAgICAgIC5maWx0ZXIoZm9ybSA9PiBmb3JtLmVsZW1lbnRzLmxlbmd0aCA+IDApXG4gICAgICAgIC5maWx0ZXIoZm9ybSA9PiBmb3JtLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0FVVE9fUkVDT1ZFUikpICE9PSBcImlnbm9yZVwiKVxuICAgICAgICAubWFwKGZvcm0gPT4ge1xuICAgICAgICAgIGxldCBuZXdGb3JtID0gdGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yKGBmb3JtW2lkPVwiJHtmb3JtLmlkfVwiXVske3BoeENoYW5nZX09XCIke2Zvcm0uZ2V0QXR0cmlidXRlKHBoeENoYW5nZSl9XCJdYClcbiAgICAgICAgICBpZihuZXdGb3JtKXtcbiAgICAgICAgICAgIHJldHVybiBbZm9ybSwgbmV3Rm9ybSwgdGhpcy50YXJnZXRDb21wb25lbnRJRChuZXdGb3JtKV1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFtmb3JtLCBudWxsLCBudWxsXVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmZpbHRlcigoW2Zvcm0sIG5ld0Zvcm0sIG5ld0NpZF0pID0+IG5ld0Zvcm0pXG4gICAgKVxuICB9XG5cbiAgbWF5YmVQdXNoQ29tcG9uZW50c0Rlc3Ryb3llZChkZXN0cm95ZWRDSURzKXtcbiAgICBsZXQgd2lsbERlc3Ryb3lDSURzID0gZGVzdHJveWVkQ0lEcy5maWx0ZXIoY2lkID0+IHtcbiAgICAgIHJldHVybiBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIGNpZCkubGVuZ3RoID09PSAwXG4gICAgfSlcbiAgICBpZih3aWxsRGVzdHJveUNJRHMubGVuZ3RoID4gMCl7XG4gICAgICB0aGlzLnBydW5pbmdDSURzLnB1c2goLi4ud2lsbERlc3Ryb3lDSURzKVxuXG4gICAgICB0aGlzLnB1c2hXaXRoUmVwbHkobnVsbCwgXCJjaWRzX3dpbGxfZGVzdHJveVwiLCB7Y2lkczogd2lsbERlc3Ryb3lDSURzfSwgKCkgPT4ge1xuICAgICAgICAvLyBUaGUgY2lkcyBhcmUgZWl0aGVyIGJhY2sgb24gdGhlIHBhZ2Ugb3IgdGhleSB3aWxsIGJlIGZ1bGx5IHJlbW92ZWQsXG4gICAgICAgIC8vIHNvIHdlIGNhbiByZW1vdmUgdGhlbSBmcm9tIHRoZSBwcnVuaW5nQ0lEcy5cbiAgICAgICAgdGhpcy5wcnVuaW5nQ0lEcyA9IHRoaXMucHJ1bmluZ0NJRHMuZmlsdGVyKGNpZCA9PiB3aWxsRGVzdHJveUNJRHMuaW5kZXhPZihjaWQpICE9PSAtMSlcblxuICAgICAgICAvLyBTZWUgaWYgYW55IG9mIHRoZSBjaWRzIHdlIHdhbnRlZCB0byBkZXN0cm95IHdlcmUgYWRkZWQgYmFjayxcbiAgICAgICAgLy8gaWYgdGhleSB3ZXJlIGFkZGVkIGJhY2ssIHdlIGRvbid0IGFjdHVhbGx5IGRlc3Ryb3kgdGhlbS5cbiAgICAgICAgbGV0IGNvbXBsZXRlbHlEZXN0cm95Q0lEcyA9IHdpbGxEZXN0cm95Q0lEcy5maWx0ZXIoY2lkID0+IHtcbiAgICAgICAgICByZXR1cm4gRE9NLmZpbmRDb21wb25lbnROb2RlTGlzdCh0aGlzLmVsLCBjaWQpLmxlbmd0aCA9PT0gMFxuICAgICAgICB9KVxuXG4gICAgICAgIGlmKGNvbXBsZXRlbHlEZXN0cm95Q0lEcy5sZW5ndGggPiAwKXtcbiAgICAgICAgICB0aGlzLnB1c2hXaXRoUmVwbHkobnVsbCwgXCJjaWRzX2Rlc3Ryb3llZFwiLCB7Y2lkczogY29tcGxldGVseURlc3Ryb3lDSURzfSwgKHJlc3ApID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWQucHJ1bmVDSURzKHJlc3AuY2lkcylcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIG93bnNFbGVtZW50KGVsKXtcbiAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKFBIWF9QQVJFTlRfSUQpID09PSB0aGlzLmlkIHx8XG4gICAgICBtYXliZShlbC5jbG9zZXN0KFBIWF9WSUVXX1NFTEVDVE9SKSwgbm9kZSA9PiBub2RlLmlkKSA9PT0gdGhpcy5pZFxuICB9XG5cbiAgc3VibWl0Rm9ybShmb3JtLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBvcHRzID0ge30pe1xuICAgIERPTS5wdXRQcml2YXRlKGZvcm0sIFBIWF9IQVNfU1VCTUlUVEVELCB0cnVlKVxuICAgIHRoaXMubGl2ZVNvY2tldC5ibHVyQWN0aXZlRWxlbWVudCh0aGlzKVxuICAgIHRoaXMucHVzaEZvcm1TdWJtaXQoZm9ybSwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgb3B0cywgKCkgPT4ge1xuICAgICAgdGhpcy5saXZlU29ja2V0LnJlc3RvcmVQcmV2aW91c2x5QWN0aXZlRm9jdXMoKVxuICAgIH0pXG4gIH1cblxuICBiaW5kaW5nKGtpbmQpeyByZXR1cm4gdGhpcy5saXZlU29ja2V0LmJpbmRpbmcoa2luZCkgfVxufVxuIiwgIi8qKiBJbml0aWFsaXplcyB0aGUgTGl2ZVNvY2tldFxuICpcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZW5kUG9pbnQgLSBUaGUgc3RyaW5nIFdlYlNvY2tldCBlbmRwb2ludCwgaWUsIGBcIndzczovL2V4YW1wbGUuY29tL2xpdmVcImAsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFwiL2xpdmVcImAgKGluaGVyaXRlZCBob3N0ICYgcHJvdG9jb2wpXG4gKiBAcGFyYW0ge1Bob2VuaXguU29ja2V0fSBzb2NrZXQgLSB0aGUgcmVxdWlyZWQgUGhvZW5peCBTb2NrZXQgY2xhc3MgaW1wb3J0ZWQgZnJvbSBcInBob2VuaXhcIi4gRm9yIGV4YW1wbGU6XG4gKlxuICogICAgIGltcG9ydCB7U29ja2V0fSBmcm9tIFwicGhvZW5peFwiXG4gKiAgICAgaW1wb3J0IHtMaXZlU29ja2V0fSBmcm9tIFwicGhvZW5peF9saXZlX3ZpZXdcIlxuICogICAgIGxldCBsaXZlU29ja2V0ID0gbmV3IExpdmVTb2NrZXQoXCIvbGl2ZVwiLCBTb2NrZXQsIHsuLi59KVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0c10gLSBPcHRpb25hbCBjb25maWd1cmF0aW9uLiBPdXRzaWRlIG9mIGtleXMgbGlzdGVkIGJlbG93LCBhbGxcbiAqIGNvbmZpZ3VyYXRpb24gaXMgcGFzc2VkIGRpcmVjdGx5IHRvIHRoZSBQaG9lbml4IFNvY2tldCBjb25zdHJ1Y3Rvci5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5kZWZhdWx0c10gLSBUaGUgb3B0aW9uYWwgZGVmYXVsdHMgdG8gdXNlIGZvciB2YXJpb3VzIGJpbmRpbmdzLFxuICogc3VjaCBhcyBgcGh4LWRlYm91bmNlYC4gU3VwcG9ydHMgdGhlIGZvbGxvd2luZyBrZXlzOlxuICpcbiAqICAgLSBkZWJvdW5jZSAtIHRoZSBtaWxsaXNlY29uZCBwaHgtZGVib3VuY2UgdGltZS4gRGVmYXVsdHMgMzAwXG4gKiAgIC0gdGhyb3R0bGUgLSB0aGUgbWlsbGlzZWNvbmQgcGh4LXRocm90dGxlIHRpbWUuIERlZmF1bHRzIDMwMFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnBhcmFtc10gLSBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gZm9yIHBhc3NpbmcgY29ubmVjdCBwYXJhbXMuXG4gKiBUaGUgZnVuY3Rpb24gcmVjZWl2ZXMgdGhlIGVsZW1lbnQgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW4gTGl2ZVZpZXcuIEZvciBleGFtcGxlOlxuICpcbiAqICAgICAoZWwpID0+IHt2aWV3OiBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW15LXZpZXctbmFtZVwiLCB0b2tlbjogd2luZG93Lm15VG9rZW59XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLmJpbmRpbmdQcmVmaXhdIC0gVGhlIG9wdGlvbmFsIHByZWZpeCB0byB1c2UgZm9yIGFsbCBwaHggRE9NIGFubm90YXRpb25zLlxuICogRGVmYXVsdHMgdG8gXCJwaHgtXCIuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMuaG9va3NdIC0gVGhlIG9wdGlvbmFsIG9iamVjdCBmb3IgcmVmZXJlbmNpbmcgTGl2ZVZpZXcgaG9vayBjYWxsYmFja3MuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMudXBsb2FkZXJzXSAtIFRoZSBvcHRpb25hbCBvYmplY3QgZm9yIHJlZmVyZW5jaW5nIExpdmVWaWV3IHVwbG9hZGVyIGNhbGxiYWNrcy5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gW29wdHMubG9hZGVyVGltZW91dF0gLSBUaGUgb3B0aW9uYWwgZGVsYXkgaW4gbWlsbGlzZWNvbmRzIHRvIHdhaXQgYmVmb3JlIGFwcGx5XG4gKiBsb2FkaW5nIHN0YXRlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnZpZXdMb2dnZXJdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGxvZyBkZWJ1ZyBpbmZvcm1hdGlvbi4gRm9yIGV4YW1wbGU6XG4gKlxuICogICAgICh2aWV3LCBraW5kLCBtc2csIG9iaikgPT4gY29uc29sZS5sb2coYCR7dmlldy5pZH0gJHtraW5kfTogJHttc2d9IC0gYCwgb2JqKVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5tZXRhZGF0YV0gLSBUaGUgb3B0aW9uYWwgb2JqZWN0IG1hcHBpbmcgZXZlbnQgbmFtZXMgdG8gZnVuY3Rpb25zIGZvclxuICogcG9wdWxhdGluZyBldmVudCBtZXRhZGF0YS4gRm9yIGV4YW1wbGU6XG4gKlxuICogICAgIG1ldGFkYXRhOiB7XG4gKiAgICAgICBjbGljazogKGUsIGVsKSA9PiB7XG4gKiAgICAgICAgIHJldHVybiB7XG4gKiAgICAgICAgICAgY3RybEtleTogZS5jdHJsS2V5LFxuICogICAgICAgICAgIG1ldGFLZXk6IGUubWV0YUtleSxcbiAqICAgICAgICAgICBkZXRhaWw6IGUuZGV0YWlsIHx8IDEsXG4gKiAgICAgICAgIH1cbiAqICAgICAgIH0sXG4gKiAgICAgICBrZXlkb3duOiAoZSwgZWwpID0+IHtcbiAqICAgICAgICAgcmV0dXJuIHtcbiAqICAgICAgICAgICBrZXk6IGUua2V5LFxuICogICAgICAgICAgIGN0cmxLZXk6IGUuY3RybEtleSxcbiAqICAgICAgICAgICBtZXRhS2V5OiBlLm1ldGFLZXksXG4gKiAgICAgICAgICAgc2hpZnRLZXk6IGUuc2hpZnRLZXlcbiAqICAgICAgICAgfVxuICogICAgICAgfVxuICogICAgIH1cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5zZXNzaW9uU3RvcmFnZV0gLSBBbiBvcHRpb25hbCBTdG9yYWdlIGNvbXBhdGlibGUgb2JqZWN0XG4gKiBVc2VmdWwgd2hlbiBMaXZlVmlldyB3b24ndCBoYXZlIGFjY2VzcyB0byBgc2Vzc2lvblN0b3JhZ2VgLiAgRm9yIGV4YW1wbGUsIFRoaXMgY291bGRcbiAqIGhhcHBlbiBpZiBhIHNpdGUgbG9hZHMgYSBjcm9zcy1kb21haW4gTGl2ZVZpZXcgaW4gYW4gaWZyYW1lLiAgRXhhbXBsZSB1c2FnZTpcbiAqXG4gKiAgICAgY2xhc3MgSW5NZW1vcnlTdG9yYWdlIHtcbiAqICAgICAgIGNvbnN0cnVjdG9yKCkgeyB0aGlzLnN0b3JhZ2UgPSB7fSB9XG4gKiAgICAgICBnZXRJdGVtKGtleU5hbWUpIHsgcmV0dXJuIHRoaXMuc3RvcmFnZVtrZXlOYW1lXSB9XG4gKiAgICAgICByZW1vdmVJdGVtKGtleU5hbWUpIHsgZGVsZXRlIHRoaXMuc3RvcmFnZVtrZXlOYW1lXSB9XG4gKiAgICAgICBzZXRJdGVtKGtleU5hbWUsIGtleVZhbHVlKSB7IHRoaXMuc3RvcmFnZVtrZXlOYW1lXSA9IGtleVZhbHVlIH1cbiAqICAgICB9XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLmxvY2FsU3RvcmFnZV0gLSBBbiBvcHRpb25hbCBTdG9yYWdlIGNvbXBhdGlibGUgb2JqZWN0XG4gKiBVc2VmdWwgZm9yIHdoZW4gTGl2ZVZpZXcgd29uJ3QgaGF2ZSBhY2Nlc3MgdG8gYGxvY2FsU3RvcmFnZWAuXG4gKiBTZWUgYG9wdHMuc2Vzc2lvblN0b3JhZ2VgIGZvciBleGFtcGxlcy5cbiovXG5cbmltcG9ydCB7XG4gIEJJTkRJTkdfUFJFRklYLFxuICBDT05TRUNVVElWRV9SRUxPQURTLFxuICBERUZBVUxUUyxcbiAgRkFJTFNBRkVfSklUVEVSLFxuICBMT0FERVJfVElNRU9VVCxcbiAgTUFYX1JFTE9BRFMsXG4gIFBIWF9ERUJPVU5DRSxcbiAgUEhYX0RST1BfVEFSR0VULFxuICBQSFhfSEFTX0ZPQ1VTRUQsXG4gIFBIWF9LRVksXG4gIFBIWF9MSU5LX1NUQVRFLFxuICBQSFhfTElWRV9MSU5LLFxuICBQSFhfTFZfREVCVUcsXG4gIFBIWF9MVl9MQVRFTkNZX1NJTSxcbiAgUEhYX0xWX1BST0ZJTEUsXG4gIFBIWF9NQUlOLFxuICBQSFhfUEFSRU5UX0lELFxuICBQSFhfVklFV19TRUxFQ1RPUixcbiAgUEhYX1JPT1RfSUQsXG4gIFBIWF9USFJPVFRMRSxcbiAgUEhYX1RSQUNLX1VQTE9BRFMsXG4gIFBIWF9TRVNTSU9OLFxuICBSRUxPQURfSklUVEVSLFxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBjbG9uZSxcbiAgY2xvc2VzdFBoeEJpbmRpbmcsXG4gIGNsb3N1cmUsXG4gIGRlYnVnLFxuICBpc09iamVjdCxcbiAgbWF5YmVcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgQnJvd3NlciBmcm9tIFwiLi9icm93c2VyXCJcbmltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcbmltcG9ydCBIb29rcyBmcm9tIFwiLi9ob29rc1wiXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuaW1wb3J0IFZpZXcgZnJvbSBcIi4vdmlld1wiXG5pbXBvcnQgSlMgZnJvbSBcIi4vanNcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXZlU29ja2V0IHtcbiAgY29uc3RydWN0b3IodXJsLCBwaHhTb2NrZXQsIG9wdHMgPSB7fSl7XG4gICAgdGhpcy51bmxvYWRlZCA9IGZhbHNlXG4gICAgaWYoIXBoeFNvY2tldCB8fCBwaHhTb2NrZXQuY29uc3RydWN0b3IubmFtZSA9PT0gXCJPYmplY3RcIil7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFxuICAgICAgYSBwaG9lbml4IFNvY2tldCBtdXN0IGJlIHByb3ZpZGVkIGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgdG8gdGhlIExpdmVTb2NrZXQgY29uc3RydWN0b3IuIEZvciBleGFtcGxlOlxuXG4gICAgICAgICAgaW1wb3J0IHtTb2NrZXR9IGZyb20gXCJwaG9lbml4XCJcbiAgICAgICAgICBpbXBvcnQgTGl2ZVNvY2tldCBmcm9tIFwicGhvZW5peF9saXZlX3ZpZXdcIlxuICAgICAgICAgIGxldCBsaXZlU29ja2V0ID0gbmV3IExpdmVTb2NrZXQoXCIvbGl2ZVwiLCBTb2NrZXQsIHsuLi59KVxuICAgICAgYClcbiAgICB9XG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgcGh4U29ja2V0KHVybCwgb3B0cylcbiAgICB0aGlzLmJpbmRpbmdQcmVmaXggPSBvcHRzLmJpbmRpbmdQcmVmaXggfHwgQklORElOR19QUkVGSVhcbiAgICB0aGlzLm9wdHMgPSBvcHRzXG4gICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKG9wdHMucGFyYW1zIHx8IHt9KVxuICAgIHRoaXMudmlld0xvZ2dlciA9IG9wdHMudmlld0xvZ2dlclxuICAgIHRoaXMubWV0YWRhdGFDYWxsYmFja3MgPSBvcHRzLm1ldGFkYXRhIHx8IHt9XG4gICAgdGhpcy5kZWZhdWx0cyA9IE9iamVjdC5hc3NpZ24oY2xvbmUoREVGQVVMVFMpLCBvcHRzLmRlZmF1bHRzIHx8IHt9KVxuICAgIHRoaXMuYWN0aXZlRWxlbWVudCA9IG51bGxcbiAgICB0aGlzLnByZXZBY3RpdmUgPSBudWxsXG4gICAgdGhpcy5zaWxlbmNlZCA9IGZhbHNlXG4gICAgdGhpcy5tYWluID0gbnVsbFxuICAgIHRoaXMubGlua1JlZiA9IDFcbiAgICB0aGlzLnJvb3RzID0ge31cbiAgICB0aGlzLmhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgIHRoaXMucGVuZGluZ0xpbmsgPSBudWxsXG4gICAgdGhpcy5jdXJyZW50TG9jYXRpb24gPSBjbG9uZSh3aW5kb3cubG9jYXRpb24pXG4gICAgdGhpcy5ob29rcyA9IG9wdHMuaG9va3MgfHwge31cbiAgICB0aGlzLnVwbG9hZGVycyA9IG9wdHMudXBsb2FkZXJzIHx8IHt9XG4gICAgdGhpcy5sb2FkZXJUaW1lb3V0ID0gb3B0cy5sb2FkZXJUaW1lb3V0IHx8IExPQURFUl9USU1FT1VUXG4gICAgdGhpcy5sb2NhbFN0b3JhZ2UgPSBvcHRzLmxvY2FsU3RvcmFnZSB8fCB3aW5kb3cubG9jYWxTdG9yYWdlXG4gICAgdGhpcy5zZXNzaW9uU3RvcmFnZSA9IG9wdHMuc2Vzc2lvblN0b3JhZ2UgfHwgd2luZG93LnNlc3Npb25TdG9yYWdlXG4gICAgdGhpcy5ib3VuZFRvcExldmVsRXZlbnRzID0gZmFsc2VcbiAgICB0aGlzLmRvbUNhbGxiYWNrcyA9IE9iamVjdC5hc3NpZ24oe29uTm9kZUFkZGVkOiBjbG9zdXJlKCksIG9uQmVmb3JlRWxVcGRhdGVkOiBjbG9zdXJlKCl9LCBvcHRzLmRvbSB8fCB7fSlcbiAgICB0aGlzLnRyYW5zaXRpb25zID0gbmV3IFRyYW5zaXRpb25TZXQoKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZWhpZGVcIiwgX2UgPT4ge1xuICAgICAgdGhpcy51bmxvYWRlZCA9IHRydWVcbiAgICB9KVxuICAgIHRoaXMuc29ja2V0Lm9uT3BlbigoKSA9PiB7XG4gICAgICBpZih0aGlzLmlzVW5sb2FkZWQoKSl7XG4gICAgICAgIC8vIHJlbG9hZCBwYWdlIGlmIGJlaW5nIHJlc3RvcmVkIGZyb20gYmFjay9mb3J3YXJkIGNhY2hlIGFuZCBicm93c2VyIGRvZXMgbm90IGVtaXQgXCJwYWdlc2hvd1wiXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBwdWJsaWNcblxuICBpc1Byb2ZpbGVFbmFibGVkKCl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX1BST0ZJTEUpID09PSBcInRydWVcIiB9XG5cbiAgaXNEZWJ1Z0VuYWJsZWQoKXsgcmV0dXJuIHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfREVCVUcpID09PSBcInRydWVcIiB9XG5cbiAgZW5hYmxlRGVidWcoKXsgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9ERUJVRywgXCJ0cnVlXCIpIH1cblxuICBlbmFibGVQcm9maWxpbmcoKXsgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9QUk9GSUxFLCBcInRydWVcIikgfVxuXG4gIGRpc2FibGVEZWJ1ZygpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oUEhYX0xWX0RFQlVHKSB9XG5cbiAgZGlzYWJsZVByb2ZpbGluZygpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oUEhYX0xWX1BST0ZJTEUpIH1cblxuICBlbmFibGVMYXRlbmN5U2ltKHVwcGVyQm91bmRNcyl7XG4gICAgdGhpcy5lbmFibGVEZWJ1ZygpXG4gICAgY29uc29sZS5sb2coXCJsYXRlbmN5IHNpbXVsYXRvciBlbmFibGVkIGZvciB0aGUgZHVyYXRpb24gb2YgdGhpcyBicm93c2VyIHNlc3Npb24uIENhbGwgZGlzYWJsZUxhdGVuY3lTaW0oKSB0byBkaXNhYmxlXCIpXG4gICAgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9MQVRFTkNZX1NJTSwgdXBwZXJCb3VuZE1zKVxuICB9XG5cbiAgZGlzYWJsZUxhdGVuY3lTaW0oKXsgdGhpcy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFBIWF9MVl9MQVRFTkNZX1NJTSkgfVxuXG4gIGdldExhdGVuY3lTaW0oKXtcbiAgICBsZXQgc3RyID0gdGhpcy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFBIWF9MVl9MQVRFTkNZX1NJTSlcbiAgICByZXR1cm4gc3RyID8gcGFyc2VJbnQoc3RyKSA6IG51bGxcbiAgfVxuXG4gIGdldFNvY2tldCgpeyByZXR1cm4gdGhpcy5zb2NrZXQgfVxuXG4gIGNvbm5lY3QoKXtcbiAgICBsZXQgZG9Db25uZWN0ID0gKCkgPT4ge1xuICAgICAgaWYodGhpcy5qb2luUm9vdFZpZXdzKCkpe1xuICAgICAgICB0aGlzLmJpbmRUb3BMZXZlbEV2ZW50cygpXG4gICAgICAgIHRoaXMuc29ja2V0LmNvbm5lY3QoKVxuICAgICAgfVxuICAgIH1cbiAgICBpZihbXCJjb21wbGV0ZVwiLCBcImxvYWRlZFwiLCBcImludGVyYWN0aXZlXCJdLmluZGV4T2YoZG9jdW1lbnQucmVhZHlTdGF0ZSkgPj0gMCl7XG4gICAgICBkb0Nvbm5lY3QoKVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiBkb0Nvbm5lY3QoKSlcbiAgICB9XG4gIH1cblxuICBkaXNjb25uZWN0KGNhbGxiYWNrKXsgdGhpcy5zb2NrZXQuZGlzY29ubmVjdChjYWxsYmFjaykgfVxuXG4gIGV4ZWNKUyhlbCwgZW5jb2RlZEpTLCBldmVudFR5cGUgPSBudWxsKXtcbiAgICB0aGlzLm93bmVyKGVsLCB2aWV3ID0+IEpTLmV4ZWMoZXZlbnRUeXBlLCBlbmNvZGVkSlMsIHZpZXcsIGVsKSlcbiAgfVxuXG4gIC8vIHByaXZhdGVcblxuICB0cmlnZ2VyRE9NKGtpbmQsIGFyZ3MpeyB0aGlzLmRvbUNhbGxiYWNrc1traW5kXSguLi5hcmdzKSB9XG5cbiAgdGltZShuYW1lLCBmdW5jKXtcbiAgICBpZighdGhpcy5pc1Byb2ZpbGVFbmFibGVkKCkgfHwgIWNvbnNvbGUudGltZSl7IHJldHVybiBmdW5jKCkgfVxuICAgIGNvbnNvbGUudGltZShuYW1lKVxuICAgIGxldCByZXN1bHQgPSBmdW5jKClcbiAgICBjb25zb2xlLnRpbWVFbmQobmFtZSlcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBsb2codmlldywga2luZCwgbXNnQ2FsbGJhY2spe1xuICAgIGlmKHRoaXMudmlld0xvZ2dlcil7XG4gICAgICBsZXQgW21zZywgb2JqXSA9IG1zZ0NhbGxiYWNrKClcbiAgICAgIHRoaXMudmlld0xvZ2dlcih2aWV3LCBraW5kLCBtc2csIG9iailcbiAgICB9IGVsc2UgaWYodGhpcy5pc0RlYnVnRW5hYmxlZCgpKXtcbiAgICAgIGxldCBbbXNnLCBvYmpdID0gbXNnQ2FsbGJhY2soKVxuICAgICAgZGVidWcodmlldywga2luZCwgbXNnLCBvYmopXG4gICAgfVxuICB9XG5cbiAgcmVxdWVzdERPTVVwZGF0ZShjYWxsYmFjayl7XG4gICAgdGhpcy50cmFuc2l0aW9ucy5hZnRlcihjYWxsYmFjaylcbiAgfVxuXG4gIHRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lID0gZnVuY3Rpb24oKXt9KXtcbiAgICB0aGlzLnRyYW5zaXRpb25zLmFkZFRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lKVxuICB9XG5cbiAgb25DaGFubmVsKGNoYW5uZWwsIGV2ZW50LCBjYil7XG4gICAgY2hhbm5lbC5vbihldmVudCwgZGF0YSA9PiB7XG4gICAgICBsZXQgbGF0ZW5jeSA9IHRoaXMuZ2V0TGF0ZW5jeVNpbSgpXG4gICAgICBpZighbGF0ZW5jeSl7XG4gICAgICAgIGNiKGRhdGEpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhgc2ltdWxhdGluZyAke2xhdGVuY3l9bXMgb2YgbGF0ZW5jeSBmcm9tIHNlcnZlciB0byBjbGllbnRgKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNiKGRhdGEpLCBsYXRlbmN5KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB3cmFwUHVzaCh2aWV3LCBvcHRzLCBwdXNoKXtcbiAgICBsZXQgbGF0ZW5jeSA9IHRoaXMuZ2V0TGF0ZW5jeVNpbSgpXG4gICAgbGV0IG9sZEpvaW5Db3VudCA9IHZpZXcuam9pbkNvdW50XG4gICAgaWYoIWxhdGVuY3kpe1xuICAgICAgaWYob3B0cy50aW1lb3V0KXtcbiAgICAgICAgcmV0dXJuIHB1c2goKS5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiB7XG4gICAgICAgICAgaWYodmlldy5qb2luQ291bnQgPT09IG9sZEpvaW5Db3VudCAmJiAhdmlldy5pc0Rlc3Ryb3llZCgpKXtcbiAgICAgICAgICAgIHRoaXMucmVsb2FkV2l0aEppdHRlcih2aWV3LCAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMubG9nKHZpZXcsIFwidGltZW91dFwiLCAoKSA9PiBbXCJyZWNlaXZlZCB0aW1lb3V0IHdoaWxlIGNvbW11bmljYXRpbmcgd2l0aCBzZXJ2ZXIuIEZhbGxpbmcgYmFjayB0byBoYXJkIHJlZnJlc2ggZm9yIHJlY292ZXJ5XCJdKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcHVzaCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coYHNpbXVsYXRpbmcgJHtsYXRlbmN5fW1zIG9mIGxhdGVuY3kgZnJvbSBjbGllbnQgdG8gc2VydmVyYClcbiAgICBsZXQgZmFrZVB1c2ggPSB7XG4gICAgICByZWNlaXZlczogW10sXG4gICAgICByZWNlaXZlKGtpbmQsIGNiKXsgdGhpcy5yZWNlaXZlcy5wdXNoKFtraW5kLCBjYl0pIH1cbiAgICB9XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZih2aWV3LmlzRGVzdHJveWVkKCkpeyByZXR1cm4gfVxuICAgICAgZmFrZVB1c2gucmVjZWl2ZXMucmVkdWNlKChhY2MsIFtraW5kLCBjYl0pID0+IGFjYy5yZWNlaXZlKGtpbmQsIGNiKSwgcHVzaCgpKVxuICAgIH0sIGxhdGVuY3kpXG4gICAgcmV0dXJuIGZha2VQdXNoXG4gIH1cblxuICByZWxvYWRXaXRoSml0dGVyKHZpZXcsIGxvZyl7XG4gICAgdmlldy5kZXN0cm95KClcbiAgICB0aGlzLmRpc2Nvbm5lY3QoKVxuICAgIGxldCBbbWluTXMsIG1heE1zXSA9IFJFTE9BRF9KSVRURVJcbiAgICBsZXQgYWZ0ZXJNcyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXhNcyAtIG1pbk1zICsgMSkpICsgbWluTXNcbiAgICBsZXQgdHJpZXMgPSBCcm93c2VyLnVwZGF0ZUxvY2FsKHRoaXMubG9jYWxTdG9yYWdlLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsIENPTlNFQ1VUSVZFX1JFTE9BRFMsIDAsIGNvdW50ID0+IGNvdW50ICsgMSlcbiAgICBsb2cgPyBsb2coKSA6IHRoaXMubG9nKHZpZXcsIFwiam9pblwiLCAoKSA9PiBbYGVuY291bnRlcmVkICR7dHJpZXN9IGNvbnNlY3V0aXZlIHJlbG9hZHNgXSlcbiAgICBpZih0cmllcyA+IE1BWF9SRUxPQURTKXtcbiAgICAgIHRoaXMubG9nKHZpZXcsIFwiam9pblwiLCAoKSA9PiBbYGV4Y2VlZGVkICR7TUFYX1JFTE9BRFN9IGNvbnNlY3V0aXZlIHJlbG9hZHMuIEVudGVyaW5nIGZhaWxzYWZlIG1vZGVgXSlcbiAgICAgIGFmdGVyTXMgPSBGQUlMU0FGRV9KSVRURVJcbiAgICB9XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZih0aGlzLmhhc1BlbmRpbmdMaW5rKCkpe1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB0aGlzLnBlbmRpbmdMaW5rXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgIH1cbiAgICB9LCBhZnRlck1zKVxuICB9XG5cbiAgZ2V0SG9va0NhbGxiYWNrcyhuYW1lKXtcbiAgICByZXR1cm4gbmFtZSAmJiBuYW1lLnN0YXJ0c1dpdGgoXCJQaG9lbml4LlwiKSA/IEhvb2tzW25hbWUuc3BsaXQoXCIuXCIpWzFdXSA6IHRoaXMuaG9va3NbbmFtZV1cbiAgfVxuXG4gIGlzVW5sb2FkZWQoKXsgcmV0dXJuIHRoaXMudW5sb2FkZWQgfVxuXG4gIGlzQ29ubmVjdGVkKCl7IHJldHVybiB0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpIH1cblxuICBnZXRCaW5kaW5nUHJlZml4KCl7IHJldHVybiB0aGlzLmJpbmRpbmdQcmVmaXggfVxuXG4gIGJpbmRpbmcoa2luZCl7IHJldHVybiBgJHt0aGlzLmdldEJpbmRpbmdQcmVmaXgoKX0ke2tpbmR9YCB9XG5cbiAgY2hhbm5lbCh0b3BpYywgcGFyYW1zKXsgcmV0dXJuIHRoaXMuc29ja2V0LmNoYW5uZWwodG9waWMsIHBhcmFtcykgfVxuXG4gIGpvaW5Sb290Vmlld3MoKXtcbiAgICBsZXQgcm9vdHNGb3VuZCA9IGZhbHNlXG4gICAgRE9NLmFsbChkb2N1bWVudCwgYCR7UEhYX1ZJRVdfU0VMRUNUT1J9Om5vdChbJHtQSFhfUEFSRU5UX0lEfV0pYCwgcm9vdEVsID0+IHtcbiAgICAgIGlmKCF0aGlzLmdldFJvb3RCeUlkKHJvb3RFbC5pZCkpe1xuICAgICAgICBsZXQgdmlldyA9IHRoaXMubmV3Um9vdFZpZXcocm9vdEVsKVxuICAgICAgICB2aWV3LnNldEhyZWYodGhpcy5nZXRIcmVmKCkpXG4gICAgICAgIHZpZXcuam9pbigpXG4gICAgICAgIGlmKHJvb3RFbC5nZXRBdHRyaWJ1dGUoUEhYX01BSU4pKXsgdGhpcy5tYWluID0gdmlldyB9XG4gICAgICB9XG4gICAgICByb290c0ZvdW5kID0gdHJ1ZVxuICAgIH0pXG4gICAgcmV0dXJuIHJvb3RzRm91bmRcbiAgfVxuXG4gIHJlZGlyZWN0KHRvLCBmbGFzaCl7XG4gICAgdGhpcy5kaXNjb25uZWN0KClcbiAgICBCcm93c2VyLnJlZGlyZWN0KHRvLCBmbGFzaClcbiAgfVxuXG4gIHJlcGxhY2VNYWluKGhyZWYsIGZsYXNoLCBjYWxsYmFjayA9IG51bGwsIGxpbmtSZWYgPSB0aGlzLnNldFBlbmRpbmdMaW5rKGhyZWYpKXtcbiAgICBsZXQgb2xkTWFpbkVsID0gdGhpcy5tYWluLmVsXG4gICAgbGV0IG5ld01haW5FbCA9IERPTS5jbG9uZU5vZGUob2xkTWFpbkVsLCBcIlwiKVxuICAgIHRoaXMubWFpbi5zaG93TG9hZGVyKHRoaXMubG9hZGVyVGltZW91dClcbiAgICB0aGlzLm1haW4uZGVzdHJveSgpXG5cbiAgICB0aGlzLm1haW4gPSB0aGlzLm5ld1Jvb3RWaWV3KG5ld01haW5FbCwgZmxhc2gpXG4gICAgdGhpcy5tYWluLnNldFJlZGlyZWN0KGhyZWYpXG4gICAgdGhpcy50cmFuc2l0aW9uUmVtb3ZlcygpXG4gICAgdGhpcy5tYWluLmpvaW4oKGpvaW5Db3VudCwgb25Eb25lKSA9PiB7XG4gICAgICBpZihqb2luQ291bnQgPT09IDEgJiYgdGhpcy5jb21taXRQZW5kaW5nTGluayhsaW5rUmVmKSl7XG4gICAgICAgIHRoaXMucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICAgICAgb2xkTWFpbkVsLnJlcGxhY2VXaXRoKG5ld01haW5FbClcbiAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgICAgICAgb25Eb25lKClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgdHJhbnNpdGlvblJlbW92ZXMoZWxlbWVudHMpe1xuICAgIGxldCByZW1vdmVBdHRyID0gdGhpcy5iaW5kaW5nKFwicmVtb3ZlXCIpXG4gICAgZWxlbWVudHMgPSBlbGVtZW50cyB8fCBET00uYWxsKGRvY3VtZW50LCBgWyR7cmVtb3ZlQXR0cn1dYClcbiAgICBlbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGlmKGRvY3VtZW50LmJvZHkuY29udGFpbnMoZWwpKXsgLy8gc2tpcCBjaGlsZHJlbiBhbHJlYWR5IHJlbW92ZWRcbiAgICAgICAgdGhpcy5leGVjSlMoZWwsIGVsLmdldEF0dHJpYnV0ZShyZW1vdmVBdHRyKSwgXCJyZW1vdmVcIilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaXNQaHhWaWV3KGVsKXsgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pICE9PSBudWxsIH1cblxuICBuZXdSb290VmlldyhlbCwgZmxhc2gpe1xuICAgIGxldCB2aWV3ID0gbmV3IFZpZXcoZWwsIHRoaXMsIG51bGwsIGZsYXNoKVxuICAgIHRoaXMucm9vdHNbdmlldy5pZF0gPSB2aWV3XG4gICAgcmV0dXJuIHZpZXdcbiAgfVxuXG4gIG93bmVyKGNoaWxkRWwsIGNhbGxiYWNrKXtcbiAgICBsZXQgdmlldyA9IG1heWJlKGNoaWxkRWwuY2xvc2VzdChQSFhfVklFV19TRUxFQ1RPUiksIGVsID0+IHRoaXMuZ2V0Vmlld0J5RWwoZWwpKSB8fCB0aGlzLm1haW5cbiAgICBpZih2aWV3KXsgY2FsbGJhY2sodmlldykgfVxuICB9XG5cbiAgd2l0aGluT3duZXJzKGNoaWxkRWwsIGNhbGxiYWNrKXtcbiAgICB0aGlzLm93bmVyKGNoaWxkRWwsIHZpZXcgPT4gY2FsbGJhY2sodmlldywgY2hpbGRFbCkpXG4gIH1cblxuICBnZXRWaWV3QnlFbChlbCl7XG4gICAgbGV0IHJvb3RJZCA9IGVsLmdldEF0dHJpYnV0ZShQSFhfUk9PVF9JRClcbiAgICByZXR1cm4gbWF5YmUodGhpcy5nZXRSb290QnlJZChyb290SWQpLCByb290ID0+IHJvb3QuZ2V0RGVzY2VuZGVudEJ5RWwoZWwpKVxuICB9XG5cbiAgZ2V0Um9vdEJ5SWQoaWQpeyByZXR1cm4gdGhpcy5yb290c1tpZF0gfVxuXG4gIGRlc3Ryb3lBbGxWaWV3cygpe1xuICAgIGZvcihsZXQgaWQgaW4gdGhpcy5yb290cyl7XG4gICAgICB0aGlzLnJvb3RzW2lkXS5kZXN0cm95KClcbiAgICAgIGRlbGV0ZSB0aGlzLnJvb3RzW2lkXVxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lWaWV3QnlFbChlbCl7XG4gICAgbGV0IHJvb3QgPSB0aGlzLmdldFJvb3RCeUlkKGVsLmdldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCkpXG4gICAgaWYocm9vdCl7IHJvb3QuZGVzdHJveURlc2NlbmRlbnQoZWwuaWQpIH1cbiAgfVxuXG4gIHNldEFjdGl2ZUVsZW1lbnQodGFyZ2V0KXtcbiAgICBpZih0aGlzLmFjdGl2ZUVsZW1lbnQgPT09IHRhcmdldCl7IHJldHVybiB9XG4gICAgdGhpcy5hY3RpdmVFbGVtZW50ID0gdGFyZ2V0XG4gICAgbGV0IGNhbmNlbCA9ICgpID0+IHtcbiAgICAgIGlmKHRhcmdldCA9PT0gdGhpcy5hY3RpdmVFbGVtZW50KXsgdGhpcy5hY3RpdmVFbGVtZW50ID0gbnVsbCB9XG4gICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcylcbiAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcylcbiAgICB9XG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGNhbmNlbClcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGNhbmNlbClcbiAgfVxuXG4gIGdldEFjdGl2ZUVsZW1lbnQoKXtcbiAgICBpZihkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBkb2N1bWVudC5ib2R5KXtcbiAgICAgIHJldHVybiB0aGlzLmFjdGl2ZUVsZW1lbnQgfHwgZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGNhbiBiZSBudWxsIGluIEludGVybmV0IEV4cGxvcmVyIDExXG4gICAgICByZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCB8fCBkb2N1bWVudC5ib2R5XG4gICAgfVxuICB9XG5cbiAgZHJvcEFjdGl2ZUVsZW1lbnQodmlldyl7XG4gICAgaWYodGhpcy5wcmV2QWN0aXZlICYmIHZpZXcub3duc0VsZW1lbnQodGhpcy5wcmV2QWN0aXZlKSl7XG4gICAgICB0aGlzLnByZXZBY3RpdmUgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgcmVzdG9yZVByZXZpb3VzbHlBY3RpdmVGb2N1cygpe1xuICAgIGlmKHRoaXMucHJldkFjdGl2ZSAmJiB0aGlzLnByZXZBY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpe1xuICAgICAgdGhpcy5wcmV2QWN0aXZlLmZvY3VzKClcbiAgICB9XG4gIH1cblxuICBibHVyQWN0aXZlRWxlbWVudCgpe1xuICAgIHRoaXMucHJldkFjdGl2ZSA9IHRoaXMuZ2V0QWN0aXZlRWxlbWVudCgpXG4gICAgaWYodGhpcy5wcmV2QWN0aXZlICE9PSBkb2N1bWVudC5ib2R5KXsgdGhpcy5wcmV2QWN0aXZlLmJsdXIoKSB9XG4gIH1cblxuICBiaW5kVG9wTGV2ZWxFdmVudHMoKXtcbiAgICBpZih0aGlzLmJvdW5kVG9wTGV2ZWxFdmVudHMpeyByZXR1cm4gfVxuXG4gICAgdGhpcy5ib3VuZFRvcExldmVsRXZlbnRzID0gdHJ1ZVxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpeyB9KSAvLyBlbnN1cmUgYWxsIGNsaWNrIGV2ZW50cyBidWJibGUgZm9yIG1vYmlsZSBTYWZhcmlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2VzaG93XCIsIGUgPT4ge1xuICAgICAgaWYoZS5wZXJzaXN0ZWQpeyAvLyByZWxvYWQgcGFnZSBpZiBiZWluZyByZXN0b3JlZCBmcm9tIGJhY2svZm9yd2FyZCBjYWNoZVxuICAgICAgICB0aGlzLmdldFNvY2tldCgpLmRpc2Nvbm5lY3QoKVxuICAgICAgICB0aGlzLndpdGhQYWdlTG9hZGluZyh7dG86IHdpbmRvdy5sb2NhdGlvbi5ocmVmLCBraW5kOiBcInJlZGlyZWN0XCJ9KVxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgIH1cbiAgICB9LCB0cnVlKVxuICAgIHRoaXMuYmluZE5hdigpXG4gICAgdGhpcy5iaW5kQ2xpY2tzKClcbiAgICB0aGlzLmJpbmRGb3JtcygpXG4gICAgdGhpcy5iaW5kKHtrZXl1cDogXCJrZXl1cFwiLCBrZXlkb3duOiBcImtleWRvd25cIn0sIChlLCB0eXBlLCB2aWV3LCB0YXJnZXRFbCwgcGh4RXZlbnQsIGV2ZW50VGFyZ2V0KSA9PiB7XG4gICAgICBsZXQgbWF0Y2hLZXkgPSB0YXJnZXRFbC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9LRVkpKVxuICAgICAgbGV0IHByZXNzZWRLZXkgPSBlLmtleSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpIC8vIGNocm9tZSBjbGlja2VkIGF1dG9jb21wbGV0ZXMgc2VuZCBhIGtleWRvd24gd2l0aG91dCBrZXlcbiAgICAgIGlmKG1hdGNoS2V5ICYmIG1hdGNoS2V5LnRvTG93ZXJDYXNlKCkgIT09IHByZXNzZWRLZXkpeyByZXR1cm4gfVxuXG4gICAgICBsZXQgZGF0YSA9IHtrZXk6IGUua2V5LCAuLi50aGlzLmV2ZW50TWV0YSh0eXBlLCBlLCB0YXJnZXRFbCl9XG4gICAgICBKUy5leGVjKHR5cGUsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXRFbCwgW1wicHVzaFwiLCB7ZGF0YX1dKVxuICAgIH0pXG4gICAgdGhpcy5iaW5kKHtibHVyOiBcImZvY3Vzb3V0XCIsIGZvY3VzOiBcImZvY3VzaW5cIn0sIChlLCB0eXBlLCB2aWV3LCB0YXJnZXRFbCwgcGh4RXZlbnQsIGV2ZW50VGFyZ2V0KSA9PiB7XG4gICAgICBpZighZXZlbnRUYXJnZXQpe1xuICAgICAgICBsZXQgZGF0YSA9IHtrZXk6IGUua2V5LCAuLi50aGlzLmV2ZW50TWV0YSh0eXBlLCBlLCB0YXJnZXRFbCl9XG4gICAgICAgIEpTLmV4ZWModHlwZSwgcGh4RXZlbnQsIHZpZXcsIHRhcmdldEVsLCBbXCJwdXNoXCIsIHtkYXRhfV0pXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLmJpbmQoe2JsdXI6IFwiYmx1clwiLCBmb2N1czogXCJmb2N1c1wifSwgKGUsIHR5cGUsIHZpZXcsIHRhcmdldEVsLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBwaHhUYXJnZXQpID0+IHtcbiAgICAgIC8vIGJsdXIgYW5kIGZvY3VzIGFyZSB0cmlnZ2VyZWQgb24gZG9jdW1lbnQgYW5kIHdpbmRvdy4gRGlzY2FyZCBvbmUgdG8gYXZvaWQgZHVwc1xuICAgICAgaWYocGh4VGFyZ2V0ID09PSBcIndpbmRvd1wiKXtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmV2ZW50TWV0YSh0eXBlLCBlLCB0YXJnZXRFbClcbiAgICAgICAgSlMuZXhlYyh0eXBlLCBwaHhFdmVudCwgdmlldywgdGFyZ2V0RWwsIFtcInB1c2hcIiwge2RhdGF9XSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZSA9PiBlLnByZXZlbnREZWZhdWx0KCkpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBsZXQgZHJvcFRhcmdldElkID0gbWF5YmUoY2xvc2VzdFBoeEJpbmRpbmcoZS50YXJnZXQsIHRoaXMuYmluZGluZyhQSFhfRFJPUF9UQVJHRVQpKSwgdHJ1ZVRhcmdldCA9PiB7XG4gICAgICAgIHJldHVybiB0cnVlVGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0RST1BfVEFSR0VUKSlcbiAgICAgIH0pXG4gICAgICBsZXQgZHJvcFRhcmdldCA9IGRyb3BUYXJnZXRJZCAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkcm9wVGFyZ2V0SWQpXG4gICAgICBsZXQgZmlsZXMgPSBBcnJheS5mcm9tKGUuZGF0YVRyYW5zZmVyLmZpbGVzIHx8IFtdKVxuICAgICAgaWYoIWRyb3BUYXJnZXQgfHwgZHJvcFRhcmdldC5kaXNhYmxlZCB8fCBmaWxlcy5sZW5ndGggPT09IDAgfHwgIShkcm9wVGFyZ2V0LmZpbGVzIGluc3RhbmNlb2YgRmlsZUxpc3QpKXsgcmV0dXJuIH1cblxuICAgICAgTGl2ZVVwbG9hZGVyLnRyYWNrRmlsZXMoZHJvcFRhcmdldCwgZmlsZXMpXG4gICAgICBkcm9wVGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiaW5wdXRcIiwge2J1YmJsZXM6IHRydWV9KSlcbiAgICB9KVxuICAgIHRoaXMub24oUEhYX1RSQUNLX1VQTE9BRFMsIGUgPT4ge1xuICAgICAgbGV0IHVwbG9hZFRhcmdldCA9IGUudGFyZ2V0XG4gICAgICBpZighRE9NLmlzVXBsb2FkSW5wdXQodXBsb2FkVGFyZ2V0KSl7IHJldHVybiB9XG4gICAgICBsZXQgZmlsZXMgPSBBcnJheS5mcm9tKGUuZGV0YWlsLmZpbGVzIHx8IFtdKS5maWx0ZXIoZiA9PiBmIGluc3RhbmNlb2YgRmlsZSB8fCBmIGluc3RhbmNlb2YgQmxvYilcbiAgICAgIExpdmVVcGxvYWRlci50cmFja0ZpbGVzKHVwbG9hZFRhcmdldCwgZmlsZXMpXG4gICAgICB1cGxvYWRUYXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJpbnB1dFwiLCB7YnViYmxlczogdHJ1ZX0pKVxuICAgIH0pXG4gIH1cblxuICBldmVudE1ldGEoZXZlbnROYW1lLCBlLCB0YXJnZXRFbCl7XG4gICAgbGV0IGNhbGxiYWNrID0gdGhpcy5tZXRhZGF0YUNhbGxiYWNrc1tldmVudE5hbWVdXG4gICAgcmV0dXJuIGNhbGxiYWNrID8gY2FsbGJhY2soZSwgdGFyZ2V0RWwpIDoge31cbiAgfVxuXG4gIHNldFBlbmRpbmdMaW5rKGhyZWYpe1xuICAgIHRoaXMubGlua1JlZisrXG4gICAgdGhpcy5wZW5kaW5nTGluayA9IGhyZWZcbiAgICByZXR1cm4gdGhpcy5saW5rUmVmXG4gIH1cblxuICBjb21taXRQZW5kaW5nTGluayhsaW5rUmVmKXtcbiAgICBpZih0aGlzLmxpbmtSZWYgIT09IGxpbmtSZWYpe1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaHJlZiA9IHRoaXMucGVuZGluZ0xpbmtcbiAgICAgIHRoaXMucGVuZGluZ0xpbmsgPSBudWxsXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGdldEhyZWYoKXsgcmV0dXJuIHRoaXMuaHJlZiB9XG5cbiAgaGFzUGVuZGluZ0xpbmsoKXsgcmV0dXJuICEhdGhpcy5wZW5kaW5nTGluayB9XG5cbiAgYmluZChldmVudHMsIGNhbGxiYWNrKXtcbiAgICBmb3IobGV0IGV2ZW50IGluIGV2ZW50cyl7XG4gICAgICBsZXQgYnJvd3NlckV2ZW50TmFtZSA9IGV2ZW50c1tldmVudF1cblxuICAgICAgdGhpcy5vbihicm93c2VyRXZlbnROYW1lLCBlID0+IHtcbiAgICAgICAgbGV0IGJpbmRpbmcgPSB0aGlzLmJpbmRpbmcoZXZlbnQpXG4gICAgICAgIGxldCB3aW5kb3dCaW5kaW5nID0gdGhpcy5iaW5kaW5nKGB3aW5kb3ctJHtldmVudH1gKVxuICAgICAgICBsZXQgdGFyZ2V0UGh4RXZlbnQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUgJiYgZS50YXJnZXQuZ2V0QXR0cmlidXRlKGJpbmRpbmcpXG4gICAgICAgIGlmKHRhcmdldFBoeEV2ZW50KXtcbiAgICAgICAgICB0aGlzLmRlYm91bmNlKGUudGFyZ2V0LCBlLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLndpdGhpbk93bmVycyhlLnRhcmdldCwgdmlldyA9PiB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGUsIGV2ZW50LCB2aWV3LCBlLnRhcmdldCwgdGFyZ2V0UGh4RXZlbnQsIG51bGwpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRE9NLmFsbChkb2N1bWVudCwgYFske3dpbmRvd0JpbmRpbmd9XWAsIGVsID0+IHtcbiAgICAgICAgICAgIGxldCBwaHhFdmVudCA9IGVsLmdldEF0dHJpYnV0ZSh3aW5kb3dCaW5kaW5nKVxuICAgICAgICAgICAgdGhpcy5kZWJvdW5jZShlbCwgZSwgKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLndpdGhpbk93bmVycyhlbCwgdmlldyA9PiB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZSwgZXZlbnQsIHZpZXcsIGVsLCBwaHhFdmVudCwgXCJ3aW5kb3dcIilcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBiaW5kQ2xpY2tzKCl7XG4gICAgdGhpcy5iaW5kQ2xpY2soXCJjbGlja1wiLCBcImNsaWNrXCIsIGZhbHNlKVxuICAgIHRoaXMuYmluZENsaWNrKFwibW91c2Vkb3duXCIsIFwiY2FwdHVyZS1jbGlja1wiLCB0cnVlKVxuICB9XG5cbiAgYmluZENsaWNrKGV2ZW50TmFtZSwgYmluZGluZ05hbWUsIGNhcHR1cmUpe1xuICAgIGxldCBjbGljayA9IHRoaXMuYmluZGluZyhiaW5kaW5nTmFtZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGUgPT4ge1xuICAgICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9XG4gICAgICBsZXQgdGFyZ2V0ID0gbnVsbFxuICAgICAgaWYoY2FwdHVyZSl7XG4gICAgICAgIHRhcmdldCA9IGUudGFyZ2V0Lm1hdGNoZXMoYFske2NsaWNrfV1gKSA/IGUudGFyZ2V0IDogZS50YXJnZXQucXVlcnlTZWxlY3RvcihgWyR7Y2xpY2t9XWApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXQgPSBjbG9zZXN0UGh4QmluZGluZyhlLnRhcmdldCwgY2xpY2spXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hDbGlja0F3YXkoZSlcbiAgICAgIH1cbiAgICAgIGxldCBwaHhFdmVudCA9IHRhcmdldCAmJiB0YXJnZXQuZ2V0QXR0cmlidXRlKGNsaWNrKVxuICAgICAgaWYoIXBoeEV2ZW50KXsgcmV0dXJuIH1cbiAgICAgIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpID09PSBcIiNcIil7IGUucHJldmVudERlZmF1bHQoKSB9XG5cbiAgICAgIHRoaXMuZGVib3VuY2UodGFyZ2V0LCBlLCAoKSA9PiB7XG4gICAgICAgIHRoaXMud2l0aGluT3duZXJzKHRhcmdldCwgdmlldyA9PiB7XG4gICAgICAgICAgSlMuZXhlYyhcImNsaWNrXCIsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXQsIFtcInB1c2hcIiwge2RhdGE6IHRoaXMuZXZlbnRNZXRhKFwiY2xpY2tcIiwgZSwgdGFyZ2V0KX1dKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LCBjYXB0dXJlKVxuICB9XG5cbiAgZGlzcGF0Y2hDbGlja0F3YXkoZSl7XG4gICAgbGV0IGJpbmRpbmcgPSB0aGlzLmJpbmRpbmcoXCJjbGljay1hd2F5XCIpXG4gICAgRE9NLmFsbChkb2N1bWVudCwgYFske2JpbmRpbmd9XWAsIGVsID0+IHtcbiAgICAgIGlmKCEoZWwuaXNTYW1lTm9kZShlLnRhcmdldCkgfHwgZWwuY29udGFpbnMoZS50YXJnZXQpKSl7XG4gICAgICAgIHRoaXMud2l0aGluT3duZXJzKGUudGFyZ2V0LCB2aWV3ID0+IHtcbiAgICAgICAgICBsZXQgcGh4RXZlbnQgPSBlbC5nZXRBdHRyaWJ1dGUoYmluZGluZylcbiAgICAgICAgICBpZihKUy5pc1Zpc2libGUoZWwpKXtcbiAgICAgICAgICAgIEpTLmV4ZWMoXCJjbGlja1wiLCBwaHhFdmVudCwgdmlldywgZS50YXJnZXQsIFtcInB1c2hcIiwge2RhdGE6IHRoaXMuZXZlbnRNZXRhKFwiY2xpY2tcIiwgZSwgZS50YXJnZXQpfV0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBiaW5kTmF2KCl7XG4gICAgaWYoIUJyb3dzZXIuY2FuUHVzaFN0YXRlKCkpeyByZXR1cm4gfVxuICAgIGlmKGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24peyBoaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gXCJtYW51YWxcIiB9XG4gICAgbGV0IHNjcm9sbFRpbWVyID0gbnVsbFxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIF9lID0+IHtcbiAgICAgIGNsZWFyVGltZW91dChzY3JvbGxUaW1lcilcbiAgICAgIHNjcm9sbFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIEJyb3dzZXIudXBkYXRlQ3VycmVudFN0YXRlKHN0YXRlID0+IE9iamVjdC5hc3NpZ24oc3RhdGUsIHtzY3JvbGw6IHdpbmRvdy5zY3JvbGxZfSkpXG4gICAgICB9LCAxMDApXG4gICAgfSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBvcHN0YXRlXCIsIGV2ZW50ID0+IHtcbiAgICAgIGlmKCF0aGlzLnJlZ2lzdGVyTmV3TG9jYXRpb24od2luZG93LmxvY2F0aW9uKSl7IHJldHVybiB9XG4gICAgICBsZXQge3R5cGUsIGlkLCByb290LCBzY3JvbGx9ID0gZXZlbnQuc3RhdGUgfHwge31cbiAgICAgIGxldCBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWZcblxuICAgICAgdGhpcy5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgaWYodGhpcy5tYWluLmlzQ29ubmVjdGVkKCkgJiYgKHR5cGUgPT09IFwicGF0Y2hcIiAmJiBpZCA9PT0gdGhpcy5tYWluLmlkKSl7XG4gICAgICAgICAgdGhpcy5tYWluLnB1c2hMaW5rUGF0Y2goaHJlZiwgbnVsbClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlcGxhY2VNYWluKGhyZWYsIG51bGwsICgpID0+IHtcbiAgICAgICAgICAgIGlmKHJvb3QpeyB0aGlzLnJlcGxhY2VSb290SGlzdG9yeSgpIH1cbiAgICAgICAgICAgIGlmKHR5cGVvZihzY3JvbGwpID09PSBcIm51bWJlclwiKXtcbiAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHNjcm9sbClcbiAgICAgICAgICAgICAgfSwgMCkgLy8gdGhlIGJvZHkgbmVlZHMgdG8gcmVuZGVyIGJlZm9yZSB3ZSBzY3JvbGwuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LCBmYWxzZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xuICAgICAgbGV0IHRhcmdldCA9IGNsb3Nlc3RQaHhCaW5kaW5nKGUudGFyZ2V0LCBQSFhfTElWRV9MSU5LKVxuICAgICAgbGV0IHR5cGUgPSB0YXJnZXQgJiYgdGFyZ2V0LmdldEF0dHJpYnV0ZShQSFhfTElWRV9MSU5LKVxuICAgICAgbGV0IHdhbnRzTmV3VGFiID0gZS5tZXRhS2V5IHx8IGUuY3RybEtleSB8fCBlLmJ1dHRvbiA9PT0gMVxuICAgICAgaWYoIXR5cGUgfHwgIXRoaXMuaXNDb25uZWN0ZWQoKSB8fCAhdGhpcy5tYWluIHx8IHdhbnRzTmV3VGFiKXsgcmV0dXJuIH1cbiAgICAgIGxldCBocmVmID0gdGFyZ2V0LmhyZWZcbiAgICAgIGxldCBsaW5rU3RhdGUgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKFBIWF9MSU5LX1NUQVRFKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBpZih0aGlzLnBlbmRpbmdMaW5rID09PSBocmVmKXsgcmV0dXJuIH1cblxuICAgICAgdGhpcy5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgaWYodHlwZSA9PT0gXCJwYXRjaFwiKXtcbiAgICAgICAgICB0aGlzLnB1c2hIaXN0b3J5UGF0Y2goaHJlZiwgbGlua1N0YXRlLCB0YXJnZXQpXG4gICAgICAgIH0gZWxzZSBpZih0eXBlID09PSBcInJlZGlyZWN0XCIpe1xuICAgICAgICAgIHRoaXMuaGlzdG9yeVJlZGlyZWN0KGhyZWYsIGxpbmtTdGF0ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGV4cGVjdGVkICR7UEhYX0xJVkVfTElOS30gdG8gYmUgXCJwYXRjaFwiIG9yIFwicmVkaXJlY3RcIiwgZ290OiAke3R5cGV9YClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LCBmYWxzZSlcbiAgfVxuXG4gIGRpc3BhdGNoRXZlbnQoZXZlbnQsIHBheWxvYWQgPSB7fSl7XG4gICAgRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBgcGh4OiR7ZXZlbnR9YCwgcGF5bG9hZClcbiAgfVxuXG4gIGRpc3BhdGNoRXZlbnRzKGV2ZW50cyl7XG4gICAgZXZlbnRzLmZvckVhY2goKFtldmVudCwgcGF5bG9hZF0pID0+IHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCwgcGF5bG9hZCkpXG4gIH1cblxuICB3aXRoUGFnZUxvYWRpbmcoaW5mbywgY2FsbGJhY2spe1xuICAgIERPTS5kaXNwYXRjaEV2ZW50KHdpbmRvdywgXCJwaHg6cGFnZS1sb2FkaW5nLXN0YXJ0XCIsIGluZm8pXG4gICAgbGV0IGRvbmUgPSAoKSA9PiBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4OnBhZ2UtbG9hZGluZy1zdG9wXCIsIGluZm8pXG4gICAgcmV0dXJuIGNhbGxiYWNrID8gY2FsbGJhY2soZG9uZSkgOiBkb25lXG4gIH1cblxuICBwdXNoSGlzdG9yeVBhdGNoKGhyZWYsIGxpbmtTdGF0ZSwgdGFyZ2V0RWwpe1xuICAgIHRoaXMud2l0aFBhZ2VMb2FkaW5nKHt0bzogaHJlZiwga2luZDogXCJwYXRjaFwifSwgZG9uZSA9PiB7XG4gICAgICB0aGlzLm1haW4ucHVzaExpbmtQYXRjaChocmVmLCB0YXJnZXRFbCwgbGlua1JlZiA9PiB7XG4gICAgICAgIHRoaXMuaGlzdG9yeVBhdGNoKGhyZWYsIGxpbmtTdGF0ZSwgbGlua1JlZilcbiAgICAgICAgZG9uZSgpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBoaXN0b3J5UGF0Y2goaHJlZiwgbGlua1N0YXRlLCBsaW5rUmVmID0gdGhpcy5zZXRQZW5kaW5nTGluayhocmVmKSl7XG4gICAgaWYoIXRoaXMuY29tbWl0UGVuZGluZ0xpbmsobGlua1JlZikpeyByZXR1cm4gfVxuXG4gICAgQnJvd3Nlci5wdXNoU3RhdGUobGlua1N0YXRlLCB7dHlwZTogXCJwYXRjaFwiLCBpZDogdGhpcy5tYWluLmlkfSwgaHJlZilcbiAgICB0aGlzLnJlZ2lzdGVyTmV3TG9jYXRpb24od2luZG93LmxvY2F0aW9uKVxuICB9XG5cbiAgaGlzdG9yeVJlZGlyZWN0KGhyZWYsIGxpbmtTdGF0ZSwgZmxhc2gpe1xuICAgIGxldCBzY3JvbGwgPSB3aW5kb3cuc2Nyb2xsWVxuICAgIHRoaXMud2l0aFBhZ2VMb2FkaW5nKHt0bzogaHJlZiwga2luZDogXCJyZWRpcmVjdFwifSwgZG9uZSA9PiB7XG4gICAgICB0aGlzLnJlcGxhY2VNYWluKGhyZWYsIGZsYXNoLCAoKSA9PiB7XG4gICAgICAgIEJyb3dzZXIucHVzaFN0YXRlKGxpbmtTdGF0ZSwge3R5cGU6IFwicmVkaXJlY3RcIiwgaWQ6IHRoaXMubWFpbi5pZCwgc2Nyb2xsOiBzY3JvbGx9LCBocmVmKVxuICAgICAgICB0aGlzLnJlZ2lzdGVyTmV3TG9jYXRpb24od2luZG93LmxvY2F0aW9uKVxuICAgICAgICBkb25lKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHJlcGxhY2VSb290SGlzdG9yeSgpe1xuICAgIEJyb3dzZXIucHVzaFN0YXRlKFwicmVwbGFjZVwiLCB7cm9vdDogdHJ1ZSwgdHlwZTogXCJwYXRjaFwiLCBpZDogdGhpcy5tYWluLmlkfSlcbiAgfVxuXG4gIHJlZ2lzdGVyTmV3TG9jYXRpb24obmV3TG9jYXRpb24pe1xuICAgIGxldCB7cGF0aG5hbWUsIHNlYXJjaH0gPSB0aGlzLmN1cnJlbnRMb2NhdGlvblxuICAgIGlmKHBhdGhuYW1lICsgc2VhcmNoID09PSBuZXdMb2NhdGlvbi5wYXRobmFtZSArIG5ld0xvY2F0aW9uLnNlYXJjaCl7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50TG9jYXRpb24gPSBjbG9uZShuZXdMb2NhdGlvbilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgYmluZEZvcm1zKCl7XG4gICAgbGV0IGl0ZXJhdGlvbnMgPSAwXG4gICAgdGhpcy5vbihcInN1Ym1pdFwiLCBlID0+IHtcbiAgICAgIGxldCBwaHhFdmVudCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJzdWJtaXRcIikpXG4gICAgICBpZighcGh4RXZlbnQpeyByZXR1cm4gfVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnRhcmdldC5kaXNhYmxlZCA9IHRydWVcbiAgICAgIHRoaXMud2l0aGluT3duZXJzKGUudGFyZ2V0LCB2aWV3ID0+IHtcbiAgICAgICAgSlMuZXhlYyhcInN1Ym1pdFwiLCBwaHhFdmVudCwgdmlldywgZS50YXJnZXQsIFtcInB1c2hcIiwge31dKVxuICAgICAgfSlcbiAgICB9LCBmYWxzZSlcblxuICAgIGZvcihsZXQgdHlwZSBvZiBbXCJjaGFuZ2VcIiwgXCJpbnB1dFwiXSl7XG4gICAgICB0aGlzLm9uKHR5cGUsIGUgPT4ge1xuICAgICAgICBsZXQgaW5wdXQgPSBlLnRhcmdldFxuICAgICAgICBsZXQgcGh4RXZlbnQgPSBpbnB1dC5mb3JtICYmIGlucHV0LmZvcm0uZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcImNoYW5nZVwiKSlcbiAgICAgICAgaWYoIXBoeEV2ZW50KXsgcmV0dXJuIH1cbiAgICAgICAgaWYoaW5wdXQudHlwZSA9PT0gXCJudW1iZXJcIiAmJiBpbnB1dC52YWxpZGl0eSAmJiBpbnB1dC52YWxpZGl0eS5iYWRJbnB1dCl7IHJldHVybiB9XG4gICAgICAgIGxldCBjdXJyZW50SXRlcmF0aW9ucyA9IGl0ZXJhdGlvbnNcbiAgICAgICAgaXRlcmF0aW9ucysrXG4gICAgICAgIGxldCB7YXQ6IGF0LCB0eXBlOiBsYXN0VHlwZX0gPSBET00ucHJpdmF0ZShpbnB1dCwgXCJwcmV2LWl0ZXJhdGlvblwiKSB8fCB7fVxuICAgICAgICAvLyBkZXRlY3QgZHVwIGJlY2F1c2Ugc29tZSBicm93c2VycyBkaXNwYXRjaCBib3RoIFwiaW5wdXRcIiBhbmQgXCJjaGFuZ2VcIlxuICAgICAgICBpZihhdCA9PT0gY3VycmVudEl0ZXJhdGlvbnMgLSAxICYmIHR5cGUgIT09IGxhc3RUeXBlKXsgcmV0dXJuIH1cblxuICAgICAgICBET00ucHV0UHJpdmF0ZShpbnB1dCwgXCJwcmV2LWl0ZXJhdGlvblwiLCB7YXQ6IGN1cnJlbnRJdGVyYXRpb25zLCB0eXBlOiB0eXBlfSlcblxuICAgICAgICB0aGlzLmRlYm91bmNlKGlucHV0LCBlLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoaW5wdXQuZm9ybSwgdmlldyA9PiB7XG4gICAgICAgICAgICBET00ucHV0UHJpdmF0ZShpbnB1dCwgUEhYX0hBU19GT0NVU0VELCB0cnVlKVxuICAgICAgICAgICAgaWYoIURPTS5pc1RleHR1YWxJbnB1dChpbnB1dCkpe1xuICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUVsZW1lbnQoaW5wdXQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBKUy5leGVjKFwiY2hhbmdlXCIsIHBoeEV2ZW50LCB2aWV3LCBpbnB1dCwgW1wicHVzaFwiLCB7X3RhcmdldDogZS50YXJnZXQubmFtZX1dKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9LCBmYWxzZSlcbiAgICB9XG4gIH1cblxuICBkZWJvdW5jZShlbCwgZXZlbnQsIGNhbGxiYWNrKXtcbiAgICBsZXQgcGh4RGVib3VuY2UgPSB0aGlzLmJpbmRpbmcoUEhYX0RFQk9VTkNFKVxuICAgIGxldCBwaHhUaHJvdHRsZSA9IHRoaXMuYmluZGluZyhQSFhfVEhST1RUTEUpXG4gICAgbGV0IGRlZmF1bHREZWJvdW5jZSA9IHRoaXMuZGVmYXVsdHMuZGVib3VuY2UudG9TdHJpbmcoKVxuICAgIGxldCBkZWZhdWx0VGhyb3R0bGUgPSB0aGlzLmRlZmF1bHRzLnRocm90dGxlLnRvU3RyaW5nKClcbiAgICBET00uZGVib3VuY2UoZWwsIGV2ZW50LCBwaHhEZWJvdW5jZSwgZGVmYXVsdERlYm91bmNlLCBwaHhUaHJvdHRsZSwgZGVmYXVsdFRocm90dGxlLCBjYWxsYmFjaylcbiAgfVxuXG4gIHNpbGVuY2VFdmVudHMoY2FsbGJhY2spe1xuICAgIHRoaXMuc2lsZW5jZWQgPSB0cnVlXG4gICAgY2FsbGJhY2soKVxuICAgIHRoaXMuc2lsZW5jZWQgPSBmYWxzZVxuICB9XG5cbiAgb24oZXZlbnQsIGNhbGxiYWNrKXtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZSA9PiB7XG4gICAgICBpZighdGhpcy5zaWxlbmNlZCl7IGNhbGxiYWNrKGUpIH1cbiAgICB9KVxuICB9XG59XG5cbmNsYXNzIFRyYW5zaXRpb25TZXQge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMudHJhbnNpdGlvbnMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnBlbmRpbmdPcHMgPSBbXVxuICAgIHRoaXMucmVzZXQoKVxuICB9XG5cbiAgcmVzZXQoKXtcbiAgICB0aGlzLnRyYW5zaXRpb25zLmZvckVhY2godGltZXIgPT4ge1xuICAgICAgY2FuY2VsVGltZW91dCh0aW1lcilcbiAgICAgIHRoaXMudHJhbnNpdGlvbnMuZGVsZXRlKHRpbWVyKVxuICAgIH0pXG4gICAgdGhpcy5mbHVzaFBlbmRpbmdPcHMoKVxuICB9XG5cbiAgYWZ0ZXIoY2FsbGJhY2spe1xuICAgIGlmKHRoaXMuc2l6ZSgpID09PSAwKXtcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wdXNoUGVuZGluZ09wKGNhbGxiYWNrKVxuICAgIH1cbiAgfVxuXG4gIGFkZFRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lKXtcbiAgICBvblN0YXJ0KClcbiAgICBsZXQgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMudHJhbnNpdGlvbnMuZGVsZXRlKHRpbWVyKVxuICAgICAgb25Eb25lKClcbiAgICAgIGlmKHRoaXMuc2l6ZSgpID09PSAwKXsgdGhpcy5mbHVzaFBlbmRpbmdPcHMoKSB9XG4gICAgfSwgdGltZSlcbiAgICB0aGlzLnRyYW5zaXRpb25zLmFkZCh0aW1lcilcbiAgfVxuXG4gIHB1c2hQZW5kaW5nT3Aob3ApeyB0aGlzLnBlbmRpbmdPcHMucHVzaChvcCkgfVxuXG4gIHNpemUoKXsgcmV0dXJuIHRoaXMudHJhbnNpdGlvbnMuc2l6ZSB9XG5cbiAgZmx1c2hQZW5kaW5nT3BzKCl7XG4gICAgdGhpcy5wZW5kaW5nT3BzLmZvckVhY2gob3AgPT4gb3AoKSlcbiAgICB0aGlzLnBlbmRpbmdPcHMgPSBbXVxuICB9XG59XG4iLCAiLy8gV2UgaW1wb3J0IHRoZSBDU1Mgd2hpY2ggaXMgZXh0cmFjdGVkIHRvIGl0cyBvd24gZmlsZSBieSBlc2J1aWxkLlxuLy8gUmVtb3ZlIHRoaXMgbGluZSBpZiB5b3UgYWRkIGEgeW91ciBvd24gQ1NTIGJ1aWxkIHBpcGVsaW5lIChlLmcgcG9zdGNzcykuXG5pbXBvcnQgXCIuLi9jc3MvYXBwLmNzc1wiXG5cbi8vIElmIHlvdSB3YW50IHRvIHVzZSBQaG9lbml4IGNoYW5uZWxzLCBydW4gYG1peCBoZWxwIHBoeC5nZW4uY2hhbm5lbGBcbi8vIHRvIGdldCBzdGFydGVkIGFuZCB0aGVuIHVuY29tbWVudCB0aGUgbGluZSBiZWxvdy5cbi8vIGltcG9ydCBcIi4vdXNlcl9zb2NrZXQuanNcIlxuXG4vLyBZb3UgY2FuIGluY2x1ZGUgZGVwZW5kZW5jaWVzIGluIHR3byB3YXlzLlxuLy9cbi8vIFRoZSBzaW1wbGVzdCBvcHRpb24gaXMgdG8gcHV0IHRoZW0gaW4gYXNzZXRzL3ZlbmRvciBhbmRcbi8vIGltcG9ydCB0aGVtIHVzaW5nIHJlbGF0aXZlIHBhdGhzOlxuLy9cbi8vICAgICBpbXBvcnQgXCIuLi92ZW5kb3Ivc29tZS1wYWNrYWdlLmpzXCJcbi8vXG4vLyBBbHRlcm5hdGl2ZWx5LCB5b3UgY2FuIGBucG0gaW5zdGFsbCBzb21lLXBhY2thZ2UgLS1wcmVmaXggYXNzZXRzYCBhbmQgaW1wb3J0XG4vLyB0aGVtIHVzaW5nIGEgcGF0aCBzdGFydGluZyB3aXRoIHRoZSBwYWNrYWdlIG5hbWU6XG4vL1xuLy8gICAgIGltcG9ydCBcInNvbWUtcGFja2FnZVwiXG4vL1xuXG4vLyBJbmNsdWRlIHBob2VuaXhfaHRtbCB0byBoYW5kbGUgbWV0aG9kPVBVVC9ERUxFVEUgaW4gZm9ybXMgYW5kIGJ1dHRvbnMuXG5pbXBvcnQgXCJwaG9lbml4X2h0bWxcIlxuLy8gRXN0YWJsaXNoIFBob2VuaXggU29ja2V0IGFuZCBMaXZlVmlldyBjb25maWd1cmF0aW9uLlxuaW1wb3J0IHtTb2NrZXR9IGZyb20gXCJwaG9lbml4XCJcbmltcG9ydCB7TGl2ZVNvY2tldH0gZnJvbSBcInBob2VuaXhfbGl2ZV92aWV3XCJcbmltcG9ydCB0b3BiYXIgZnJvbSBcIi4uL3ZlbmRvci90b3BiYXJcIlxuXG5sZXQgY3NyZlRva2VuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1ldGFbbmFtZT0nY3NyZi10b2tlbiddXCIpLmdldEF0dHJpYnV0ZShcImNvbnRlbnRcIilcbmxldCBsaXZlU29ja2V0ID0gbmV3IExpdmVTb2NrZXQoXCIvbGl2ZVwiLCBTb2NrZXQsIHtwYXJhbXM6IHtfY3NyZl90b2tlbjogY3NyZlRva2VufX0pXG5cbi8vIFNob3cgcHJvZ3Jlc3MgYmFyIG9uIGxpdmUgbmF2aWdhdGlvbiBhbmQgZm9ybSBzdWJtaXRzXG50b3BiYXIuY29uZmlnKHtiYXJDb2xvcnM6IHswOiBcIiMyOWRcIn0sIHNoYWRvd0NvbG9yOiBcInJnYmEoMCwgMCwgMCwgLjMpXCJ9KVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6cGFnZS1sb2FkaW5nLXN0YXJ0XCIsIGluZm8gPT4gdG9wYmFyLnNob3coKSlcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGh4OnBhZ2UtbG9hZGluZy1zdG9wXCIsIGluZm8gPT4gdG9wYmFyLmhpZGUoKSlcblxuLy8gY29ubmVjdCBpZiB0aGVyZSBhcmUgYW55IExpdmVWaWV3cyBvbiB0aGUgcGFnZVxubGl2ZVNvY2tldC5jb25uZWN0KClcblxuLy8gZXhwb3NlIGxpdmVTb2NrZXQgb24gd2luZG93IGZvciB3ZWIgY29uc29sZSBkZWJ1ZyBsb2dzIGFuZCBsYXRlbmN5IHNpbXVsYXRpb246XG4vLyA+PiBsaXZlU29ja2V0LmVuYWJsZURlYnVnKClcbi8vID4+IGxpdmVTb2NrZXQuZW5hYmxlTGF0ZW5jeVNpbSgxMDAwKSAgLy8gZW5hYmxlZCBmb3IgZHVyYXRpb24gb2YgYnJvd3NlciBzZXNzaW9uXG4vLyA+PiBsaXZlU29ja2V0LmRpc2FibGVMYXRlbmN5U2ltKClcbndpbmRvdy5saXZlU29ja2V0ID0gbGl2ZVNvY2tldFxuXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFNQSxNQUFDLFVBQVUsU0FBUSxXQUFVO0FBQzNCO0FBR0EsUUFBQyxZQUFZO0FBQ1gsY0FBSSxXQUFXO0FBQ2YsY0FBSSxVQUFVLENBQUMsTUFBTSxPQUFPLFVBQVU7QUFDdEMsbUJBQVMsSUFBSSxHQUFHLElBQUksUUFBUSxVQUFVLENBQUMsUUFBTyx1QkFBdUIsRUFBRSxHQUFHO0FBQ3hFLG9CQUFPLHdCQUNMLFFBQU8sUUFBUSxLQUFLO0FBQ3RCLG9CQUFPLHVCQUNMLFFBQU8sUUFBUSxLQUFLLDJCQUNwQixRQUFPLFFBQVEsS0FBSztBQUFBO0FBRXhCLGNBQUksQ0FBQyxRQUFPO0FBQ1Ysb0JBQU8sd0JBQXdCLFNBQVUsVUFBVSxTQUFTO0FBQzFELGtCQUFJLFdBQVcsSUFBSSxPQUFPO0FBQzFCLGtCQUFJLGFBQWEsS0FBSyxJQUFJLEdBQUcsS0FBTSxZQUFXO0FBQzlDLGtCQUFJLEtBQUssUUFBTyxXQUFXLFdBQVk7QUFDckMseUJBQVMsV0FBVztBQUFBLGlCQUNuQjtBQUNILHlCQUFXLFdBQVc7QUFDdEIscUJBQU87QUFBQTtBQUVYLGNBQUksQ0FBQyxRQUFPO0FBQ1Ysb0JBQU8sdUJBQXVCLFNBQVUsSUFBSTtBQUMxQywyQkFBYTtBQUFBO0FBQUE7QUFJbkIsWUFBSSxRQUNGLGlCQUNBLGFBQ0EsaUJBQ0EsU0FDQSxXQUFXLFNBQVUsTUFBTSxNQUFNLFNBQVM7QUFDeEMsY0FBSSxLQUFLO0FBQWtCLGlCQUFLLGlCQUFpQixNQUFNLFNBQVM7QUFBQSxtQkFDdkQsS0FBSztB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
