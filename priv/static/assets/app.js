(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // vendor/topbar.js
  var require_topbar = __commonJS({
    "vendor/topbar.js"(exports, module) {
      (function(window2, document2) {
        "use strict";
        var canvas, currentProgress, showing, progressTimerId = null, fadeTimerId = null, delayTimerId = null, addEvent = function(elem, type, handler) {
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
          canvas.height = options.barThickness * 2;
          var ctx = canvas.getContext("2d");
          ctx.shadowBlur = options.shadowBlur;
          ctx.shadowColor = options.shadowColor;
          var lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          for (var stop in options.barColors)
            lineGradient.addColorStop(stop, options.barColors[stop]);
          ctx.lineWidth = options.barThickness;
          ctx.beginPath();
          ctx.moveTo(0, options.barThickness / 2);
          ctx.lineTo(
            Math.ceil(currentProgress * canvas.width),
            options.barThickness / 2
          );
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
          show: function(delay) {
            if (showing)
              return;
            if (delay) {
              if (delayTimerId)
                return;
              delayTimerId = setTimeout(() => topbar2.show(), delay);
            } else {
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
                  topbar2.progress(
                    "+" + 0.05 * Math.pow(1 - Math.sqrt(currentProgress), 2)
                  );
                })();
              }
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
            clearTimeout(delayTimerId);
            delayTimerId = null;
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
      var to = element.getAttribute("data-to"), method = buildHiddenInput("_method", element.getAttribute("data-method")), csrf = buildHiddenInput("_csrf_token", element.getAttribute("data-csrf")), form = document.createElement("form"), submit = document.createElement("input"), target = element.getAttribute("target");
      form.method = element.getAttribute("data-method") === "get" ? "get" : "post";
      form.action = to;
      form.style.display = "none";
      if (target)
        form.target = target;
      else if (targetModifierKey)
        form.target = "_blank";
      form.appendChild(csrf);
      form.appendChild(method);
      document.body.appendChild(form);
      submit.type = "submit";
      form.appendChild(submit);
      submit.click();
    }
    window.addEventListener("click", function(e) {
      var element = e.target;
      if (e.defaultPrevented)
        return;
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
        if (element.getAttribute("data-method") && element.getAttribute("data-to")) {
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

  // ../deps/phoenix/priv/static/phoenix.mjs
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
  var global = globalSelf || phxWindow || global;
  var DEFAULT_VSN = "2.0.0";
  var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
  var MAX_LONGPOLL_BATCH_SIZE = 100;
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
    /**
     *
     * @param {number} timeout
     */
    resend(timeout) {
      this.timeout = timeout;
      this.reset();
      this.send();
    }
    /**
     *
     */
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
    /**
     *
     * @param {*} status
     * @param {*} callback
     */
    receive(status, callback) {
      if (this.hasReceived(status)) {
        callback(this.receivedResp.response);
      }
      this.recHooks.push({ status, callback });
      return this;
    }
    /**
     * @private
     */
    reset() {
      this.cancelRefEvent();
      this.ref = null;
      this.refEvent = null;
      this.receivedResp = null;
      this.sent = false;
    }
    /**
     * @private
     */
    matchReceive({ status, response, _ref }) {
      this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
    }
    /**
     * @private
     */
    cancelRefEvent() {
      if (!this.refEvent) {
        return;
      }
      this.channel.off(this.refEvent);
    }
    /**
     * @private
     */
    cancelTimeout() {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    /**
     * @private
     */
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
    /**
     * @private
     */
    hasReceived(status) {
      return this.receivedResp && this.receivedResp.status === status;
    }
    /**
     * @private
     */
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
    /**
     * Cancels any previous scheduleTimeout and schedules callback
     */
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
      this.stateChangeRefs.push(
        this.socket.onOpen(() => {
          this.rejoinTimer.reset();
          if (this.isErrored()) {
            this.rejoin();
          }
        })
      );
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
    /**
     * Join the channel
     * @param {integer} timeout
     * @returns {Push}
     */
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
    /**
     * Hook into channel close
     * @param {Function} callback
     */
    onClose(callback) {
      this.on(CHANNEL_EVENTS.close, callback);
    }
    /**
     * Hook into channel errors
     * @param {Function} callback
     */
    onError(callback) {
      return this.on(CHANNEL_EVENTS.error, (reason) => callback(reason));
    }
    /**
     * Subscribes on channel events
     *
     * Subscription returns a ref counter, which can be used later to
     * unsubscribe the exact event listener
     *
     * @example
     * const ref1 = channel.on("event", do_stuff)
     * const ref2 = channel.on("event", do_other_stuff)
     * channel.off("event", ref1)
     * // Since unsubscription, do_stuff won't fire,
     * // while do_other_stuff will keep firing on the "event"
     *
     * @param {string} event
     * @param {Function} callback
     * @returns {integer} ref
     */
    on(event, callback) {
      let ref = this.bindingRef++;
      this.bindings.push({ event, ref, callback });
      return ref;
    }
    /**
     * Unsubscribes off of channel events
     *
     * Use the ref returned from a channel.on() to unsubscribe one
     * handler, or pass nothing for the ref to unsubscribe all
     * handlers for the given event.
     *
     * @example
     * // Unsubscribe the do_stuff handler
     * const ref1 = channel.on("event", do_stuff)
     * channel.off("event", ref1)
     *
     * // Unsubscribe all handlers from event
     * channel.off("event")
     *
     * @param {string} event
     * @param {integer} ref
     */
    off(event, ref) {
      this.bindings = this.bindings.filter((bind) => {
        return !(bind.event === event && (typeof ref === "undefined" || ref === bind.ref));
      });
    }
    /**
     * @private
     */
    canPush() {
      return this.socket.isConnected() && this.isJoined();
    }
    /**
     * Sends a message `event` to phoenix with the payload `payload`.
     * Phoenix receives this in the `handle_in(event, payload, socket)`
     * function. if phoenix replies or it times out (default 10000ms),
     * then optionally the reply can be received.
     *
     * @example
     * channel.push("event")
     *   .receive("ok", payload => console.log("phoenix replied:", payload))
     *   .receive("error", err => console.log("phoenix errored", err))
     *   .receive("timeout", () => console.log("timed out pushing"))
     * @param {string} event
     * @param {Object} payload
     * @param {number} [timeout]
     * @returns {Push}
     */
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
    /** Leaves the channel
     *
     * Unsubscribes from server events, and
     * instructs channel to terminate on server
     *
     * Triggers onClose() hooks
     *
     * To receive leave acknowledgements, use the `receive`
     * hook to bind to the server ack, ie:
     *
     * @example
     * channel.leave().receive("ok", () => alert("left!") )
     *
     * @param {integer} timeout
     * @returns {Push}
     */
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
    /**
     * Overridable message hook
     *
     * Receives all events for specialized message handling
     * before dispatching to the channel callbacks.
     *
     * Must return the payload, modified or unmodified
     * @param {string} event
     * @param {Object} payload
     * @param {integer} ref
     * @returns {Object}
     */
    onMessage(_event, payload, _ref) {
      return payload;
    }
    /**
     * @private
     */
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
    /**
     * @private
     */
    joinRef() {
      return this.joinPush.ref;
    }
    /**
     * @private
     */
    rejoin(timeout = this.timeout) {
      if (this.isLeaving()) {
        return;
      }
      this.socket.leaveOpenTopic(this.topic);
      this.state = CHANNEL_STATES.joining;
      this.joinPush.resend(timeout);
    }
    /**
     * @private
     */
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
    /**
     * @private
     */
    replyEventName(ref) {
      return `chan_reply_${ref}`;
    }
    /**
     * @private
     */
    isClosed() {
      return this.state === CHANNEL_STATES.closed;
    }
    /**
     * @private
     */
    isErrored() {
      return this.state === CHANNEL_STATES.errored;
    }
    /**
     * @private
     */
    isJoined() {
      return this.state === CHANNEL_STATES.joined;
    }
    /**
     * @private
     */
    isJoining() {
      return this.state === CHANNEL_STATES.joining;
    }
    /**
     * @private
     */
    isLeaving() {
      return this.state === CHANNEL_STATES.leaving;
    }
  };
  var Ajax = class {
    static request(method, endPoint, accept, body, timeout, ontimeout, callback) {
      if (global.XDomainRequest) {
        let req = new global.XDomainRequest();
        return this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
      } else {
        let req = new global.XMLHttpRequest();
        return this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback);
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
      return req;
    }
    static xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
      req.open(method, endPoint, true);
      req.timeout = timeout;
      req.setRequestHeader("Content-Type", accept);
      req.onerror = () => callback && callback(null);
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
      return req;
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
  var arrayBufferToBase64 = (buffer) => {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };
  var LongPoll = class {
    constructor(endPoint) {
      this.endPoint = null;
      this.token = null;
      this.skipHeartbeat = true;
      this.reqs = /* @__PURE__ */ new Set();
      this.awaitingBatchAck = false;
      this.currentBatch = null;
      this.currentBatchTimer = null;
      this.batchBuffer = [];
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
      setTimeout(() => this.poll(), 0);
    }
    normalizeEndpoint(endPoint) {
      return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
    }
    endpointURL() {
      return Ajax.appendParams(this.pollEndpoint, { token: this.token });
    }
    closeAndRetry(code, reason, wasClean) {
      this.close(code, reason, wasClean);
      this.readyState = SOCKET_STATES.connecting;
    }
    ontimeout() {
      this.onerror("timeout");
      this.closeAndRetry(1005, "timeout", false);
    }
    isActive() {
      return this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting;
    }
    poll() {
      this.ajax("GET", "application/json", null, () => this.ontimeout(), (resp) => {
        if (resp) {
          var { status, token, messages } = resp;
          this.token = token;
        } else {
          status = 0;
        }
        switch (status) {
          case 200:
            messages.forEach((msg) => {
              setTimeout(() => this.onmessage({ data: msg }), 0);
            });
            this.poll();
            break;
          case 204:
            this.poll();
            break;
          case 410:
            this.readyState = SOCKET_STATES.open;
            this.onopen({});
            this.poll();
            break;
          case 403:
            this.onerror(403);
            this.close(1008, "forbidden", false);
            break;
          case 0:
          case 500:
            this.onerror(500);
            this.closeAndRetry(1011, "internal server error", 500);
            break;
          default:
            throw new Error(`unhandled poll status ${status}`);
        }
      });
    }
    // we collect all pushes within the current event loop by
    // setTimeout 0, which optimizes back-to-back procedural
    // pushes against an empty buffer
    send(body) {
      if (typeof body !== "string") {
        body = arrayBufferToBase64(body);
      }
      if (this.currentBatch) {
        this.currentBatch.push(body);
      } else if (this.awaitingBatchAck) {
        this.batchBuffer.push(body);
      } else {
        this.currentBatch = [body];
        this.currentBatchTimer = setTimeout(() => {
          this.batchSend(this.currentBatch);
          this.currentBatch = null;
        }, 0);
      }
    }
    batchSend(messages, offset = 0) {
      this.awaitingBatchAck = true;
      const next = offset + MAX_LONGPOLL_BATCH_SIZE;
      const batch = messages.slice(offset, next);
      this.ajax("POST", "application/x-ndjson", batch.join("\n"), () => this.onerror("timeout"), (resp) => {
        if (!resp || resp.status !== 200) {
          this.awaitingBatchAck = false;
          this.onerror(resp && resp.status);
          this.closeAndRetry(1011, "internal server error", false);
        } else if (next < messages.length) {
          this.batchSend(messages, next);
        } else if (this.batchBuffer.length > 0) {
          this.batchSend(this.batchBuffer);
          this.batchBuffer = [];
        } else {
          this.awaitingBatchAck = false;
        }
      });
    }
    close(code, reason, wasClean) {
      for (let req of this.reqs) {
        req.abort();
      }
      this.readyState = SOCKET_STATES.closed;
      let opts = Object.assign({ code: 1e3, reason: void 0, wasClean: true }, { code, reason, wasClean });
      this.batchBuffer = [];
      clearTimeout(this.currentBatchTimer);
      this.currentBatchTimer = null;
      if (typeof CloseEvent !== "undefined") {
        this.onclose(new CloseEvent("close", opts));
      } else {
        this.onclose(opts);
      }
    }
    ajax(method, contentType, body, onCallerTimeout, callback) {
      let req;
      let ontimeout = () => {
        this.reqs.delete(req);
        onCallerTimeout();
      };
      req = Ajax.request(method, this.endpointURL(), contentType, body, this.timeout, ontimeout, (resp) => {
        this.reqs.delete(req);
        if (this.isActive()) {
          callback(resp);
        }
      });
      this.reqs.add(req);
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
    // private
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
      this.primaryPassedHealthCheck = false;
      this.longPollFallbackMs = opts.longPollFallbackMs;
      this.fallbackTimer = null;
      this.sessionStore = opts.sessionStorage || global && global.sessionStorage;
      this.establishedConnections = 0;
      this.defaultEncoder = serializer_default.encode.bind(serializer_default);
      this.defaultDecoder = serializer_default.decode.bind(serializer_default);
      this.closeWasClean = false;
      this.disconnecting = false;
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
      if (!this.logger && opts.debug) {
        this.logger = (kind, msg, data) => {
          console.log(`${kind}: ${msg}`, data);
        };
      }
      this.longpollerTimeout = opts.longpollerTimeout || 2e4;
      this.params = closure(opts.params || {});
      this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
      this.vsn = opts.vsn || DEFAULT_VSN;
      this.heartbeatTimeoutTimer = null;
      this.heartbeatTimer = null;
      this.pendingHeartbeatRef = null;
      this.reconnectTimer = new Timer(() => {
        this.teardown(() => this.connect());
      }, this.reconnectAfterMs);
    }
    /**
     * Returns the LongPoll transport reference
     */
    getLongPollTransport() {
      return LongPoll;
    }
    /**
     * Disconnects and replaces the active transport
     *
     * @param {Function} newTransport - The new transport class to instantiate
     *
     */
    replaceTransport(newTransport) {
      this.connectClock++;
      this.closeWasClean = true;
      clearTimeout(this.fallbackTimer);
      this.reconnectTimer.reset();
      if (this.conn) {
        this.conn.close();
        this.conn = null;
      }
      this.transport = newTransport;
    }
    /**
     * Returns the socket protocol
     *
     * @returns {string}
     */
    protocol() {
      return location.protocol.match(/^https/) ? "wss" : "ws";
    }
    /**
     * The fully qualified socket url
     *
     * @returns {string}
     */
    endPointURL() {
      let uri = Ajax.appendParams(
        Ajax.appendParams(this.endPoint, this.params()),
        { vsn: this.vsn }
      );
      if (uri.charAt(0) !== "/") {
        return uri;
      }
      if (uri.charAt(1) === "/") {
        return `${this.protocol()}:${uri}`;
      }
      return `${this.protocol()}://${location.host}${uri}`;
    }
    /**
     * Disconnects the socket
     *
     * See https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes for valid status codes.
     *
     * @param {Function} callback - Optional callback which is called after socket is disconnected.
     * @param {integer} code - A status code for disconnection (Optional).
     * @param {string} reason - A textual description of the reason to disconnect. (Optional)
     */
    disconnect(callback, code, reason) {
      this.connectClock++;
      this.disconnecting = true;
      this.closeWasClean = true;
      clearTimeout(this.fallbackTimer);
      this.reconnectTimer.reset();
      this.teardown(() => {
        this.disconnecting = false;
        callback && callback();
      }, code, reason);
    }
    /**
     *
     * @param {Object} params - The params to send when connecting, for example `{user_id: userToken}`
     *
     * Passing params to connect is deprecated; pass them in the Socket constructor instead:
     * `new Socket("/socket", {params: {user_id: userToken}})`.
     */
    connect(params) {
      if (params) {
        console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
        this.params = closure(params);
      }
      if (this.conn && !this.disconnecting) {
        return;
      }
      if (this.longPollFallbackMs && this.transport !== LongPoll) {
        this.connectWithFallback(LongPoll, this.longPollFallbackMs);
      } else {
        this.transportConnect();
      }
    }
    /**
     * Logs the message. Override `this.logger` for specialized logging. noops by default
     * @param {string} kind
     * @param {string} msg
     * @param {Object} data
     */
    log(kind, msg, data) {
      this.logger && this.logger(kind, msg, data);
    }
    /**
     * Returns true if a logger has been set on this socket.
     */
    hasLogger() {
      return this.logger !== null;
    }
    /**
     * Registers callbacks for connection open events
     *
     * @example socket.onOpen(function(){ console.info("the socket was opened") })
     *
     * @param {Function} callback
     */
    onOpen(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.open.push([ref, callback]);
      return ref;
    }
    /**
     * Registers callbacks for connection close events
     * @param {Function} callback
     */
    onClose(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.close.push([ref, callback]);
      return ref;
    }
    /**
     * Registers callbacks for connection error events
     *
     * @example socket.onError(function(error){ alert("An error occurred") })
     *
     * @param {Function} callback
     */
    onError(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.error.push([ref, callback]);
      return ref;
    }
    /**
     * Registers callbacks for connection message events
     * @param {Function} callback
     */
    onMessage(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.message.push([ref, callback]);
      return ref;
    }
    /**
     * Pings the server and invokes the callback with the RTT in milliseconds
     * @param {Function} callback
     *
     * Returns true if the ping was pushed or false if unable to be pushed.
     */
    ping(callback) {
      if (!this.isConnected()) {
        return false;
      }
      let ref = this.makeRef();
      let startTime = Date.now();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref });
      let onMsgRef = this.onMessage((msg) => {
        if (msg.ref === ref) {
          this.off([onMsgRef]);
          callback(Date.now() - startTime);
        }
      });
      return true;
    }
    /**
     * @private
     */
    transportConnect() {
      this.connectClock++;
      this.closeWasClean = false;
      this.conn = new this.transport(this.endPointURL());
      this.conn.binaryType = this.binaryType;
      this.conn.timeout = this.longpollerTimeout;
      this.conn.onopen = () => this.onConnOpen();
      this.conn.onerror = (error) => this.onConnError(error);
      this.conn.onmessage = (event) => this.onConnMessage(event);
      this.conn.onclose = (event) => this.onConnClose(event);
    }
    getSession(key) {
      return this.sessionStore && this.sessionStore.getItem(key);
    }
    storeSession(key, val) {
      this.sessionStore && this.sessionStore.setItem(key, val);
    }
    connectWithFallback(fallbackTransport, fallbackThreshold = 2500) {
      clearTimeout(this.fallbackTimer);
      let established = false;
      let primaryTransport = true;
      let openRef, errorRef;
      let fallback = (reason) => {
        this.log("transport", `falling back to ${fallbackTransport.name}...`, reason);
        this.off([openRef, errorRef]);
        primaryTransport = false;
        this.replaceTransport(fallbackTransport);
        this.transportConnect();
      };
      if (this.getSession(`phx:fallback:${fallbackTransport.name}`)) {
        return fallback("memorized");
      }
      this.fallbackTimer = setTimeout(fallback, fallbackThreshold);
      errorRef = this.onError((reason) => {
        this.log("transport", "error", reason);
        if (primaryTransport && !established) {
          clearTimeout(this.fallbackTimer);
          fallback(reason);
        }
      });
      this.onOpen(() => {
        established = true;
        if (!primaryTransport) {
          if (!this.primaryPassedHealthCheck) {
            this.storeSession(`phx:fallback:${fallbackTransport.name}`, "true");
          }
          return this.log("transport", `established ${fallbackTransport.name} fallback`);
        }
        clearTimeout(this.fallbackTimer);
        this.fallbackTimer = setTimeout(fallback, fallbackThreshold);
        this.ping((rtt) => {
          this.log("transport", "connected to primary after", rtt);
          this.primaryPassedHealthCheck = true;
          clearTimeout(this.fallbackTimer);
        });
      });
      this.transportConnect();
    }
    clearHeartbeats() {
      clearTimeout(this.heartbeatTimer);
      clearTimeout(this.heartbeatTimeoutTimer);
    }
    onConnOpen() {
      if (this.hasLogger())
        this.log("transport", `${this.transport.name} connected to ${this.endPointURL()}`);
      this.closeWasClean = false;
      this.disconnecting = false;
      this.establishedConnections++;
      this.flushSendBuffer();
      this.reconnectTimer.reset();
      this.resetHeartbeat();
      this.stateChangeCallbacks.open.forEach(([, callback]) => callback());
    }
    /**
     * @private
     */
    heartbeatTimeout() {
      if (this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null;
        if (this.hasLogger()) {
          this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
        }
        this.triggerChanError();
        this.closeWasClean = false;
        this.teardown(() => this.reconnectTimer.scheduleTimeout(), WS_CLOSE_NORMAL, "heartbeat timeout");
      }
    }
    resetHeartbeat() {
      if (this.conn && this.conn.skipHeartbeat) {
        return;
      }
      this.pendingHeartbeatRef = null;
      this.clearHeartbeats();
      this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
    }
    teardown(callback, code, reason) {
      if (!this.conn) {
        return callback && callback();
      }
      let connectClock = this.connectClock;
      this.waitForBufferDone(() => {
        if (connectClock !== this.connectClock) {
          return;
        }
        if (this.conn) {
          if (code) {
            this.conn.close(code, reason || "");
          } else {
            this.conn.close();
          }
        }
        this.waitForSocketClosed(() => {
          if (connectClock !== this.connectClock) {
            return;
          }
          if (this.conn) {
            this.conn.onopen = function() {
            };
            this.conn.onerror = function() {
            };
            this.conn.onmessage = function() {
            };
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
      this.clearHeartbeats();
      if (!this.closeWasClean && closeCode !== 1e3) {
        this.reconnectTimer.scheduleTimeout();
      }
      this.stateChangeCallbacks.close.forEach(([, callback]) => callback(event));
    }
    /**
     * @private
     */
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
    /**
     * @private
     */
    triggerChanError() {
      this.channels.forEach((channel) => {
        if (!(channel.isErrored() || channel.isLeaving() || channel.isClosed())) {
          channel.trigger(CHANNEL_EVENTS.error);
        }
      });
    }
    /**
     * @returns {string}
     */
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
    /**
     * @returns {boolean}
     */
    isConnected() {
      return this.connectionState() === "open";
    }
    /**
     * @private
     *
     * @param {Channel}
     */
    remove(channel) {
      this.off(channel.stateChangeRefs);
      this.channels = this.channels.filter((c) => c !== channel);
    }
    /**
     * Removes `onOpen`, `onClose`, `onError,` and `onMessage` registrations.
     *
     * @param {refs} - list of refs returned by calls to
     *                 `onOpen`, `onClose`, `onError,` and `onMessage`
     */
    off(refs) {
      for (let key in this.stateChangeCallbacks) {
        this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(([ref]) => {
          return refs.indexOf(ref) === -1;
        });
      }
    }
    /**
     * Initiates a new channel for the given topic
     *
     * @param {string} topic
     * @param {Object} chanParams - Parameters for the channel
     * @returns {Channel}
     */
    channel(topic, chanParams = {}) {
      let chan = new Channel(topic, chanParams, this);
      this.channels.push(chan);
      return chan;
    }
    /**
     * @param {Object} data
     */
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
    /**
     * Return the next message ref, accounting for overflows
     * @returns {string}
     */
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
      this.heartbeatTimeoutTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
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
          this.clearHeartbeats();
          this.pendingHeartbeatRef = null;
          this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
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
  var RELOAD_JITTER_MIN = 5e3;
  var RELOAD_JITTER_MAX = 1e4;
  var FAILSAFE_JITTER = 3e4;
  var PHX_EVENT_CLASSES = [
    "phx-click-loading",
    "phx-change-loading",
    "phx-submit-loading",
    "phx-keydown-loading",
    "phx-keyup-loading",
    "phx-blur-loading",
    "phx-focus-loading",
    "phx-hook-loading"
  ];
  var PHX_COMPONENT = "data-phx-component";
  var PHX_LIVE_LINK = "data-phx-link";
  var PHX_TRACK_STATIC = "track-static";
  var PHX_LINK_STATE = "data-phx-link-state";
  var PHX_REF_LOADING = "data-phx-ref-loading";
  var PHX_REF_SRC = "data-phx-ref-src";
  var PHX_REF_LOCK = "data-phx-ref-lock";
  var PHX_PENDING_REFS = "phx-pending-refs";
  var PHX_TRACK_UPLOADS = "track-uploads";
  var PHX_UPLOAD_REF = "data-phx-upload-ref";
  var PHX_PREFLIGHTED_REFS = "data-phx-preflighted-refs";
  var PHX_DONE_REFS = "data-phx-done-refs";
  var PHX_DROP_TARGET = "drop-target";
  var PHX_ACTIVE_ENTRY_REFS = "data-phx-active-refs";
  var PHX_LIVE_FILE_UPDATED = "phx:live-file:updated";
  var PHX_SKIP = "data-phx-skip";
  var PHX_MAGIC_ID = "data-phx-id";
  var PHX_PRUNE = "data-phx-prune";
  var PHX_CONNECTED_CLASS = "phx-connected";
  var PHX_LOADING_CLASS = "phx-loading";
  var PHX_ERROR_CLASS = "phx-error";
  var PHX_CLIENT_ERROR_CLASS = "phx-client-error";
  var PHX_SERVER_ERROR_CLASS = "phx-server-error";
  var PHX_PARENT_ID = "data-phx-parent-id";
  var PHX_MAIN = "data-phx-main";
  var PHX_ROOT_ID = "data-phx-root-id";
  var PHX_VIEWPORT_TOP = "viewport-top";
  var PHX_VIEWPORT_BOTTOM = "viewport-bottom";
  var PHX_TRIGGER_ACTION = "trigger-action";
  var PHX_HAS_FOCUSED = "phx-has-focused";
  var FOCUSABLE_INPUTS = ["text", "textarea", "number", "email", "password", "search", "tel", "url", "date", "time", "datetime-local", "color", "range"];
  var CHECKABLE_INPUTS = ["checkbox", "radio"];
  var PHX_HAS_SUBMITTED = "phx-has-submitted";
  var PHX_SESSION = "data-phx-session";
  var PHX_VIEW_SELECTOR = `[${PHX_SESSION}]`;
  var PHX_STICKY = "data-phx-sticky";
  var PHX_STATIC = "data-phx-static";
  var PHX_READONLY = "data-phx-readonly";
  var PHX_DISABLED = "data-phx-disabled";
  var PHX_DISABLE_WITH = "disable-with";
  var PHX_DISABLE_WITH_RESTORE = "data-phx-disable-with-restore";
  var PHX_HOOK = "hook";
  var PHX_DEBOUNCE = "debounce";
  var PHX_THROTTLE = "throttle";
  var PHX_UPDATE = "update";
  var PHX_STREAM = "stream";
  var PHX_STREAM_REF = "data-phx-stream";
  var PHX_KEY = "key";
  var PHX_PRIVATE = "phxPrivate";
  var PHX_AUTO_RECOVER = "auto-recover";
  var PHX_LV_DEBUG = "phx:live-socket:debug";
  var PHX_LV_PROFILE = "phx:live-socket:profiling";
  var PHX_LV_LATENCY_SIM = "phx:live-socket:latency-sim";
  var PHX_LV_HISTORY_POSITION = "phx:nav-history-position";
  var PHX_PROGRESS = "progress";
  var PHX_MOUNTED = "mounted";
  var PHX_RELOAD_STATUS = "__phoenix_reload_status__";
  var LOADER_TIMEOUT = 1;
  var MAX_CHILD_JOIN_ATTEMPTS = 3;
  var BEFORE_UNLOAD_LOADER_TIMEOUT = 200;
  var DISCONNECTED_TIMEOUT = 500;
  var BINDING_PREFIX = "phx-";
  var PUSH_TIMEOUT = 3e4;
  var DEBOUNCE_TRIGGER = "debounce-trigger";
  var THROTTLED = "throttled";
  var DEBOUNCE_PREV_KEY = "debounce-prev-key";
  var DEFAULTS = {
    debounce: 300,
    throttle: 300
  };
  var PHX_PENDING_ATTRS = [PHX_REF_LOADING, PHX_REF_SRC, PHX_REF_LOCK];
  var DYNAMICS = "d";
  var STATIC = "s";
  var ROOT = "r";
  var COMPONENTS = "c";
  var EVENTS = "e";
  var REPLY = "r";
  var TITLE = "t";
  var TEMPLATES = "p";
  var STREAM = "stream";
  var EntryUploader = class {
    constructor(entry, config, liveSocket2) {
      let { chunk_size, chunk_timeout } = config;
      this.liveSocket = liveSocket2;
      this.entry = entry;
      this.offset = 0;
      this.chunkSize = chunk_size;
      this.chunkTimeout = chunk_timeout;
      this.chunkTimer = null;
      this.errored = false;
      this.uploadChannel = liveSocket2.channel(`lvu:${entry.ref}`, { token: entry.metadata() });
    }
    error(reason) {
      if (this.errored) {
        return;
      }
      this.uploadChannel.leave();
      this.errored = true;
      clearTimeout(this.chunkTimer);
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
      this.uploadChannel.push("chunk", chunk, this.chunkTimeout).receive("ok", () => {
        this.entry.progress(this.offset / this.entry.file.size * 100);
        if (!this.isDone()) {
          this.chunkTimer = setTimeout(() => this.readNextChunk(), this.liveSocket.getLatencySim() || 0);
        }
      }).receive("error", ({ reason }) => this.error(reason));
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
  function detectInvalidStreamInserts(inserts) {
    const errors = /* @__PURE__ */ new Set();
    Object.keys(inserts).forEach((id) => {
      const streamEl = document.getElementById(id);
      if (streamEl && streamEl.parentElement && streamEl.parentElement.getAttribute("phx-update") !== "stream") {
        errors.add(`The stream container with id "${streamEl.parentElement.id}" is missing the phx-update="stream" attribute. Ensure it is set for streams to work properly.`);
      }
    });
    errors.forEach((error) => console.error(error));
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
      if (el.matches(`[${binding}]`) && !el.disabled) {
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
      let entryUploader = new EntryUploader(entry, resp.config, liveSocket2);
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
          window.requestAnimationFrame(() => {
            let hashEl = this.getHashTargetEl(window.location.hash);
            if (hashEl) {
              hashEl.scrollIntoView();
            } else if (meta.type === "redirect") {
              window.scroll(0, 0);
            }
          });
        }
      } else {
        this.redirect(to);
      }
    },
    setCookie(name, value, maxAgeSeconds) {
      let expires = typeof maxAgeSeconds === "number" ? ` max-age=${maxAgeSeconds};` : "";
      document.cookie = `${name}=${value};${expires} path=/`;
    },
    getCookie(name) {
      return document.cookie.replace(new RegExp(`(?:(?:^|.*;s*)${name}s*=s*([^;]*).*$)|^.*$`), "$1");
    },
    deleteCookie(name) {
      document.cookie = `${name}=; max-age=-1; path=/`;
    },
    redirect(toURL, flash) {
      if (flash) {
        this.setCookie("__phoenix_flash__", flash, 60);
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
    isAutoUpload(inputEl) {
      return inputEl.hasAttribute("data-phx-auto-upload");
    },
    findUploadInputs(node) {
      const formId = node.id;
      const inputsOutsideForm = this.all(document, `input[type="file"][${PHX_UPLOAD_REF}][form="${formId}"]`);
      return this.all(node, `input[type="file"][${PHX_UPLOAD_REF}]`).concat(inputsOutsideForm);
    },
    findComponentNodeList(node, cid) {
      return this.filterWithinSameLiveView(this.all(node, `[${PHX_COMPONENT}="${cid}"]`), node);
    },
    isPhxDestroyed(node) {
      return node.id && DOM.private(node, "destroyed") ? true : false;
    },
    wantsNewTab(e) {
      let wantsNewTab = e.ctrlKey || e.shiftKey || e.metaKey || e.button && e.button === 1;
      let isDownload = e.target instanceof HTMLAnchorElement && e.target.hasAttribute("download");
      let isTargetBlank = e.target.hasAttribute("target") && e.target.getAttribute("target").toLowerCase() === "_blank";
      let isTargetNamedTab = e.target.hasAttribute("target") && !e.target.getAttribute("target").startsWith("_");
      return wantsNewTab || isTargetBlank || isDownload || isTargetNamedTab;
    },
    isUnloadableFormSubmit(e) {
      let isDialogSubmit = e.target && e.target.getAttribute("method") === "dialog" || e.submitter && e.submitter.getAttribute("formmethod") === "dialog";
      if (isDialogSubmit) {
        return false;
      } else {
        return !e.defaultPrevented && !this.wantsNewTab(e);
      }
    },
    isNewPageClick(e, currentLocation) {
      let href = e.target instanceof HTMLAnchorElement ? e.target.getAttribute("href") : null;
      let url;
      if (e.defaultPrevented || href === null || this.wantsNewTab(e)) {
        return false;
      }
      if (href.startsWith("mailto:") || href.startsWith("tel:")) {
        return false;
      }
      if (e.target.isContentEditable) {
        return false;
      }
      try {
        url = new URL(href);
      } catch (e2) {
        try {
          url = new URL(href, currentLocation);
        } catch (e3) {
          return true;
        }
      }
      if (url.host === currentLocation.host && url.protocol === currentLocation.protocol) {
        if (url.pathname === currentLocation.pathname && url.search === currentLocation.search) {
          return url.hash === "" && !url.href.endsWith("#");
        }
      }
      return url.protocol.startsWith("http");
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
    findPhxSticky(el) {
      return this.all(el, `[${PHX_STICKY}]`);
    },
    findPhxChildren(el, parentId) {
      return this.all(el, `${PHX_VIEW_SELECTOR}[${PHX_PARENT_ID}="${parentId}"]`);
    },
    findExistingParentCIDs(node, cids) {
      let parentCids = /* @__PURE__ */ new Set();
      let childrenCids = /* @__PURE__ */ new Set();
      cids.forEach((cid) => {
        this.filterWithinSameLiveView(this.all(node, `[${PHX_COMPONENT}="${cid}"]`), node).forEach((parent) => {
          parentCids.add(cid);
          this.filterWithinSameLiveView(this.all(parent, `[${PHX_COMPONENT}]`), parent).map((el) => parseInt(el.getAttribute(PHX_COMPONENT))).forEach((childCID) => childrenCids.add(childCID));
        });
      });
      childrenCids.forEach((childCid) => parentCids.delete(childCid));
      return parentCids;
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
    syncPendingAttrs(fromEl, toEl) {
      if (!fromEl.hasAttribute(PHX_REF_SRC)) {
        return;
      }
      PHX_EVENT_CLASSES.forEach((className) => {
        fromEl.classList.contains(className) && toEl.classList.add(className);
      });
      PHX_PENDING_ATTRS.filter((attr) => fromEl.hasAttribute(attr)).forEach((attr) => {
        toEl.setAttribute(attr, fromEl.getAttribute(attr));
      });
    },
    copyPrivates(target, source) {
      if (source[PHX_PRIVATE]) {
        target[PHX_PRIVATE] = source[PHX_PRIVATE];
      }
    },
    putTitle(str) {
      let titleEl = document.querySelector("title");
      if (titleEl) {
        let { prefix, suffix, default: defaultTitle } = titleEl.dataset;
        let isEmpty2 = typeof str !== "string" || str.trim() === "";
        if (isEmpty2 && typeof defaultTitle !== "string") {
          return;
        }
        let inner = isEmpty2 ? defaultTitle : str;
        document.title = `${prefix || ""}${inner || ""}${suffix || ""}`;
      } else {
        document.title = str;
      }
    },
    debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, callback) {
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
          this.incCycle(el, "debounce-blur-cycle", () => {
            if (asyncFilter()) {
              callback();
            }
          });
          if (this.once(el, "debounce-blur")) {
            el.addEventListener("blur", () => this.triggerCycle(el, "debounce-blur-cycle"));
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
              const t = setTimeout(() => {
                if (asyncFilter()) {
                  this.triggerCycle(el, DEBOUNCE_TRIGGER);
                }
              }, timeout);
              this.putPrivate(el, THROTTLED, t);
            }
          } else {
            setTimeout(() => {
              if (asyncFilter()) {
                this.triggerCycle(el, DEBOUNCE_TRIGGER, currentCycle);
              }
            }, timeout);
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
            el.addEventListener("blur", () => {
              clearTimeout(this.private(el, THROTTLED));
              this.triggerCycle(el, DEBOUNCE_TRIGGER);
            });
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
    // maintains or adds privately used hook information
    // fromEl and toEl can be the same element in the case of a newly added node
    // fromEl and toEl can be any HTML node type, so we need to check if it's an element node
    maintainPrivateHooks(fromEl, toEl, phxViewportTop, phxViewportBottom) {
      if (fromEl.hasAttribute && fromEl.hasAttribute("data-phx-hook") && !toEl.hasAttribute("data-phx-hook")) {
        toEl.setAttribute("data-phx-hook", fromEl.getAttribute("data-phx-hook"));
      }
      if (toEl.hasAttribute && (toEl.hasAttribute(phxViewportTop) || toEl.hasAttribute(phxViewportBottom))) {
        toEl.setAttribute("data-phx-hook", "Phoenix.InfiniteScroll");
      }
    },
    putCustomElHook(el, hook) {
      if (el.isConnected) {
        el.setAttribute("data-phx-hook", "");
      } else {
        console.error(`
        hook attached to non-connected DOM element
        ensure you are calling createHook within your connectedCallback. ${el.outerHTML}
      `);
      }
      this.putPrivate(el, "custom-el-hook", hook);
    },
    getCustomElHook(el) {
      return this.private(el, "custom-el-hook");
    },
    isUsedInput(el) {
      return el.nodeType === Node.ELEMENT_NODE && (this.private(el, PHX_HAS_FOCUSED) || this.private(el, PHX_HAS_SUBMITTED));
    },
    resetForm(form) {
      Array.from(form.elements).forEach((input) => {
        this.deletePrivate(input, PHX_HAS_FOCUSED);
        this.deletePrivate(input, PHX_HAS_SUBMITTED);
      });
    },
    isPhxChild(node) {
      return node.getAttribute && node.getAttribute(PHX_PARENT_ID);
    },
    isPhxSticky(node) {
      return node.getAttribute && node.getAttribute(PHX_STICKY) !== null;
    },
    isChildOfAny(el, parents) {
      return !!parents.find((parent) => parent.contains(el));
    },
    firstPhxChild(el) {
      return this.isPhxChild(el) ? el : this.all(el, `[${PHX_PARENT_ID}]`)[0];
    },
    dispatchEvent(target, name, opts = {}) {
      let defaultBubble = true;
      let isUploadTarget = target.nodeName === "INPUT" && target.type === "file";
      if (isUploadTarget && name === "click") {
        defaultBubble = false;
      }
      let bubbles = opts.bubbles === void 0 ? defaultBubble : !!opts.bubbles;
      let eventOpts = { bubbles, cancelable: true, detail: opts.detail || {} };
      let event = name === "click" ? new MouseEvent("click", eventOpts) : new CustomEvent(name, eventOpts);
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
    // merge attributes from source to target
    // if an element is ignored, we only merge data attributes
    // including removing data attributes that are no longer in the source
    mergeAttrs(target, source, opts = {}) {
      let exclude = new Set(opts.exclude || []);
      let isIgnored = opts.isIgnored;
      let sourceAttrs = source.attributes;
      for (let i = sourceAttrs.length - 1; i >= 0; i--) {
        let name = sourceAttrs[i].name;
        if (!exclude.has(name)) {
          const sourceValue = source.getAttribute(name);
          if (target.getAttribute(name) !== sourceValue && (!isIgnored || isIgnored && name.startsWith("data-"))) {
            target.setAttribute(name, sourceValue);
          }
        } else {
          if (name === "value" && target.value === source.value) {
            target.setAttribute("value", source.getAttribute(name));
          }
        }
      }
      let targetAttrs = target.attributes;
      for (let i = targetAttrs.length - 1; i >= 0; i--) {
        let name = targetAttrs[i].name;
        if (isIgnored) {
          if (name.startsWith("data-") && !source.hasAttribute(name) && !PHX_PENDING_ATTRS.includes(name)) {
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
        DOM.mergeAttrs(target, source, { exclude: ["value"] });
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
      if (focused instanceof HTMLSelectElement) {
        focused.focus();
      }
      if (!DOM.isTextualInput(focused)) {
        return;
      }
      let wasFocused = focused.matches(":focus");
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
      return el.getAttribute && el.getAttribute(phxTriggerExternal) !== null && document.body.contains(el);
    },
    cleanChildNodes(container, phxUpdate) {
      if (DOM.isPhxUpdate(container, phxUpdate, ["append", "prepend", PHX_STREAM])) {
        let toRemove = [];
        container.childNodes.forEach((childNode) => {
          if (!childNode.id) {
            let isEmptyTextNode = childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() === "";
            if (!isEmptyTextNode && childNode.nodeType !== Node.COMMENT_NODE) {
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
    },
    isLocked(el) {
      return el.hasAttribute && el.hasAttribute(PHX_REF_LOCK);
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
    static isPreflightInProgress(file) {
      return file._preflightInProgress === true;
    }
    static markPreflightInProgress(file) {
      file._preflightInProgress = true;
    }
    constructor(fileEl, file, view, autoUpload) {
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
      this.autoUpload = autoUpload;
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
    isCancelled() {
      return this._isCancelled;
    }
    cancel() {
      this.file._preflightInProgress = false;
      this._isCancelled = true;
      this._isDone = true;
      this._onDone();
    }
    isDone() {
      return this._isDone;
    }
    error(reason = "failed") {
      this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
      this.view.pushFileProgress(this.fileEl, this.ref, { error: reason });
      if (!this.isAutoUpload()) {
        LiveUploader.clearFiles(this.fileEl);
      }
    }
    isAutoUpload() {
      return this.autoUpload;
    }
    //private
    onDone(callback) {
      this._onDone = () => {
        this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
        callback();
      };
    }
    onElUpdated() {
      let activeRefs = this.fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      if (activeRefs.indexOf(this.ref) === -1) {
        LiveUploader.untrackFile(this.fileEl, this.file);
        this.cancel();
      }
    }
    toPreflightPayload() {
      return {
        last_modified: this.file.lastModified,
        name: this.file.name,
        relative_path: this.file.webkitRelativePath,
        size: this.file.size,
        type: this.file.type,
        ref: this.ref,
        meta: typeof this.file.meta === "function" ? this.file.meta() : void 0
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
  var LiveUploader = class _LiveUploader {
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
        entry.last_modified = file.lastModified;
        entry.name = file.name || entry.ref;
        entry.relative_path = file.webkitRelativePath;
        entry.type = file.type;
        entry.size = file.size;
        if (typeof file.meta === "function") {
          entry.meta = file.meta();
        }
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
    static trackFiles(inputEl, files, dataTransfer) {
      if (inputEl.getAttribute("multiple") !== null) {
        let newFiles = files.filter((file) => !this.activeFiles(inputEl).find((f) => Object.is(f, file)));
        dom_default.updatePrivate(inputEl, "files", [], (existing) => existing.concat(newFiles));
        inputEl.value = null;
      } else {
        if (dataTransfer && dataTransfer.files.length > 0) {
          inputEl.files = dataTransfer.files;
        }
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
      return this.activeFiles(input).filter((f) => !UploadEntry.isPreflighted(input, f) && !UploadEntry.isPreflightInProgress(f));
    }
    static markPreflightInProgress(entries) {
      entries.forEach((entry) => UploadEntry.markPreflightInProgress(entry.file));
    }
    constructor(inputEl, view, onComplete) {
      this.autoUpload = dom_default.isAutoUpload(inputEl);
      this.view = view;
      this.onComplete = onComplete;
      this._entries = Array.from(_LiveUploader.filesAwaitingPreflight(inputEl) || []).map((file) => new UploadEntry(inputEl, file, view, this.autoUpload));
      _LiveUploader.markPreflightInProgress(this._entries);
      this.numEntriesInProgress = this._entries.length;
    }
    isAutoUpload() {
      return this.autoUpload;
    }
    entries() {
      return this._entries;
    }
    initAdapterUpload(resp, onError, liveSocket2) {
      this._entries = this._entries.map((entry) => {
        if (entry.isCancelled()) {
          this.numEntriesInProgress--;
          if (this.numEntriesInProgress === 0) {
            this.onComplete();
          }
        } else {
          entry.zipPostFlight(resp);
          entry.onDone(() => {
            this.numEntriesInProgress--;
            if (this.numEntriesInProgress === 0) {
              this.onComplete();
            }
          });
        }
        return entry;
      });
      let groupedEntries = this._entries.reduce((acc, entry) => {
        if (!entry.meta) {
          return acc;
        }
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
  var ARIA = {
    anyOf(instance, classes) {
      return classes.find((name) => instance instanceof name);
    },
    isFocusable(el, interactiveOnly) {
      return el instanceof HTMLAnchorElement && el.rel !== "ignore" || el instanceof HTMLAreaElement && el.href !== void 0 || !el.disabled && this.anyOf(el, [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement, HTMLButtonElement]) || el instanceof HTMLIFrameElement || (el.tabIndex >= 0 && el.getAttribute("aria-hidden") !== "true" || !interactiveOnly && el.getAttribute("tabindex") !== null && el.getAttribute("aria-hidden") !== "true");
    },
    attemptFocus(el, interactiveOnly) {
      if (this.isFocusable(el, interactiveOnly)) {
        try {
          el.focus();
        } catch (e) {
        }
      }
      return !!document.activeElement && document.activeElement.isSameNode(el);
    },
    focusFirstInteractive(el) {
      let child = el.firstElementChild;
      while (child) {
        if (this.attemptFocus(child, true) || this.focusFirstInteractive(child, true)) {
          return true;
        }
        child = child.nextElementSibling;
      }
    },
    focusFirst(el) {
      let child = el.firstElementChild;
      while (child) {
        if (this.attemptFocus(child) || this.focusFirst(child)) {
          return true;
        }
        child = child.nextElementSibling;
      }
    },
    focusLast(el) {
      let child = el.lastElementChild;
      while (child) {
        if (this.attemptFocus(child) || this.focusLast(child)) {
          return true;
        }
        child = child.previousElementSibling;
      }
    }
  };
  var aria_default = ARIA;
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
            this.__view().cancelSubmit(this.el.form);
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
    },
    FocusWrap: {
      mounted() {
        this.focusStart = this.el.firstElementChild;
        this.focusEnd = this.el.lastElementChild;
        this.focusStart.addEventListener("focus", (e) => {
          if (!e.relatedTarget || !this.el.contains(e.relatedTarget)) {
            const nextFocus = e.target.nextElementSibling;
            aria_default.attemptFocus(nextFocus) || aria_default.focusFirst(nextFocus);
          } else {
            aria_default.focusLast(this.el);
          }
        });
        this.focusEnd.addEventListener("focus", (e) => {
          if (!e.relatedTarget || !this.el.contains(e.relatedTarget)) {
            const nextFocus = e.target.previousElementSibling;
            aria_default.attemptFocus(nextFocus) || aria_default.focusLast(nextFocus);
          } else {
            aria_default.focusFirst(this.el);
          }
        });
        this.el.addEventListener("phx:show-end", () => this.el.focus());
        if (window.getComputedStyle(this.el).display !== "none") {
          aria_default.focusFirst(this.el);
        }
      }
    }
  };
  var findScrollContainer = (el) => {
    if (["HTML", "BODY"].indexOf(el.nodeName.toUpperCase()) >= 0)
      return null;
    if (["scroll", "auto"].indexOf(getComputedStyle(el).overflowY) >= 0)
      return el;
    return findScrollContainer(el.parentElement);
  };
  var scrollTop = (scrollContainer) => {
    if (scrollContainer) {
      return scrollContainer.scrollTop;
    } else {
      return document.documentElement.scrollTop || document.body.scrollTop;
    }
  };
  var bottom = (scrollContainer) => {
    if (scrollContainer) {
      return scrollContainer.getBoundingClientRect().bottom;
    } else {
      return window.innerHeight || document.documentElement.clientHeight;
    }
  };
  var top = (scrollContainer) => {
    if (scrollContainer) {
      return scrollContainer.getBoundingClientRect().top;
    } else {
      return 0;
    }
  };
  var isAtViewportTop = (el, scrollContainer) => {
    let rect = el.getBoundingClientRect();
    return Math.ceil(rect.top) >= top(scrollContainer) && Math.ceil(rect.left) >= 0 && Math.floor(rect.top) <= bottom(scrollContainer);
  };
  var isAtViewportBottom = (el, scrollContainer) => {
    let rect = el.getBoundingClientRect();
    return Math.ceil(rect.bottom) >= top(scrollContainer) && Math.ceil(rect.left) >= 0 && Math.floor(rect.bottom) <= bottom(scrollContainer);
  };
  var isWithinViewport = (el, scrollContainer) => {
    let rect = el.getBoundingClientRect();
    return Math.ceil(rect.top) >= top(scrollContainer) && Math.ceil(rect.left) >= 0 && Math.floor(rect.top) <= bottom(scrollContainer);
  };
  Hooks.InfiniteScroll = {
    mounted() {
      this.scrollContainer = findScrollContainer(this.el);
      let scrollBefore = scrollTop(this.scrollContainer);
      let topOverran = false;
      let throttleInterval = 500;
      let pendingOp = null;
      let onTopOverrun = this.throttle(throttleInterval, (topEvent, firstChild) => {
        pendingOp = () => true;
        this.liveSocket.execJSHookPush(this.el, topEvent, { id: firstChild.id, _overran: true }, () => {
          pendingOp = null;
        });
      });
      let onFirstChildAtTop = this.throttle(throttleInterval, (topEvent, firstChild) => {
        pendingOp = () => firstChild.scrollIntoView({ block: "start" });
        this.liveSocket.execJSHookPush(this.el, topEvent, { id: firstChild.id }, () => {
          pendingOp = null;
          window.requestAnimationFrame(() => {
            if (!isWithinViewport(firstChild, this.scrollContainer)) {
              firstChild.scrollIntoView({ block: "start" });
            }
          });
        });
      });
      let onLastChildAtBottom = this.throttle(throttleInterval, (bottomEvent, lastChild) => {
        pendingOp = () => lastChild.scrollIntoView({ block: "end" });
        this.liveSocket.execJSHookPush(this.el, bottomEvent, { id: lastChild.id }, () => {
          pendingOp = null;
          window.requestAnimationFrame(() => {
            if (!isWithinViewport(lastChild, this.scrollContainer)) {
              lastChild.scrollIntoView({ block: "end" });
            }
          });
        });
      });
      this.onScroll = (_e) => {
        let scrollNow = scrollTop(this.scrollContainer);
        if (pendingOp) {
          scrollBefore = scrollNow;
          return pendingOp();
        }
        let rect = this.el.getBoundingClientRect();
        let topEvent = this.el.getAttribute(this.liveSocket.binding("viewport-top"));
        let bottomEvent = this.el.getAttribute(this.liveSocket.binding("viewport-bottom"));
        let lastChild = this.el.lastElementChild;
        let firstChild = this.el.firstElementChild;
        let isScrollingUp = scrollNow < scrollBefore;
        let isScrollingDown = scrollNow > scrollBefore;
        if (isScrollingUp && topEvent && !topOverran && rect.top >= 0) {
          topOverran = true;
          onTopOverrun(topEvent, firstChild);
        } else if (isScrollingDown && topOverran && rect.top <= 0) {
          topOverran = false;
        }
        if (topEvent && isScrollingUp && isAtViewportTop(firstChild, this.scrollContainer)) {
          onFirstChildAtTop(topEvent, firstChild);
        } else if (bottomEvent && isScrollingDown && isAtViewportBottom(lastChild, this.scrollContainer)) {
          onLastChildAtBottom(bottomEvent, lastChild);
        }
        scrollBefore = scrollNow;
      };
      if (this.scrollContainer) {
        this.scrollContainer.addEventListener("scroll", this.onScroll);
      } else {
        window.addEventListener("scroll", this.onScroll);
      }
    },
    destroyed() {
      if (this.scrollContainer) {
        this.scrollContainer.removeEventListener("scroll", this.onScroll);
      } else {
        window.removeEventListener("scroll", this.onScroll);
      }
    },
    throttle(interval, callback) {
      let lastCallAt = 0;
      let timer;
      return (...args) => {
        let now = Date.now();
        let remainingTime = interval - (now - lastCallAt);
        if (remainingTime <= 0 || remainingTime > interval) {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          lastCallAt = now;
          callback(...args);
        } else if (!timer) {
          timer = setTimeout(() => {
            lastCallAt = Date.now();
            timer = null;
            callback(...args);
          }, remainingTime);
        }
      };
    }
  };
  var hooks_default = Hooks;
  var ElementRef = class {
    static onUnlock(el, callback) {
      if (!dom_default.isLocked(el) && !el.closest(`[${PHX_REF_LOCK}]`)) {
        return callback();
      }
      const closestLock = el.closest(`[${PHX_REF_LOCK}]`);
      const ref = closestLock.closest(`[${PHX_REF_LOCK}]`).getAttribute(PHX_REF_LOCK);
      closestLock.addEventListener(`phx:undo-lock:${ref}`, () => {
        callback();
      }, { once: true });
    }
    constructor(el) {
      this.el = el;
      this.loadingRef = el.hasAttribute(PHX_REF_LOADING) ? parseInt(el.getAttribute(PHX_REF_LOADING), 10) : null;
      this.lockRef = el.hasAttribute(PHX_REF_LOCK) ? parseInt(el.getAttribute(PHX_REF_LOCK), 10) : null;
    }
    // public
    maybeUndo(ref, phxEvent, eachCloneCallback) {
      if (!this.isWithin(ref)) {
        dom_default.updatePrivate(this.el, PHX_PENDING_REFS, [], (pendingRefs) => {
          pendingRefs.push(ref);
          return pendingRefs;
        });
        return;
      }
      this.undoLocks(ref, phxEvent, eachCloneCallback);
      this.undoLoading(ref, phxEvent);
      dom_default.updatePrivate(this.el, PHX_PENDING_REFS, [], (pendingRefs) => {
        return pendingRefs.filter((pendingRef) => {
          let opts = {
            detail: { ref: pendingRef, event: phxEvent },
            bubbles: true,
            cancelable: false
          };
          if (this.loadingRef && this.loadingRef > pendingRef) {
            this.el.dispatchEvent(
              new CustomEvent(`phx:undo-loading:${pendingRef}`, opts)
            );
          }
          if (this.lockRef && this.lockRef > pendingRef) {
            this.el.dispatchEvent(
              new CustomEvent(`phx:undo-lock:${pendingRef}`, opts)
            );
          }
          return pendingRef > ref;
        });
      });
      if (this.isFullyResolvedBy(ref)) {
        this.el.removeAttribute(PHX_REF_SRC);
      }
    }
    // private
    isWithin(ref) {
      return !(this.loadingRef !== null && this.loadingRef > ref && (this.lockRef !== null && this.lockRef > ref));
    }
    // Check for cloned PHX_REF_LOCK element that has been morphed behind
    // the scenes while this element was locked in the DOM.
    // When we apply the cloned tree to the active DOM element, we must
    //
    //   1. execute pending mounted hooks for nodes now in the DOM
    //   2. undo any ref inside the cloned tree that has since been ack'd
    undoLocks(ref, phxEvent, eachCloneCallback) {
      if (!this.isLockUndoneBy(ref)) {
        return;
      }
      let clonedTree = dom_default.private(this.el, PHX_REF_LOCK);
      if (clonedTree) {
        eachCloneCallback(clonedTree);
        dom_default.deletePrivate(this.el, PHX_REF_LOCK);
      }
      this.el.removeAttribute(PHX_REF_LOCK);
      let opts = { detail: { ref, event: phxEvent }, bubbles: true, cancelable: false };
      this.el.dispatchEvent(new CustomEvent(`phx:undo-lock:${this.lockRef}`, opts));
    }
    undoLoading(ref, phxEvent) {
      if (!this.isLoadingUndoneBy(ref)) {
        if (this.canUndoLoading(ref) && this.el.classList.contains("phx-submit-loading")) {
          this.el.classList.remove("phx-change-loading");
        }
        return;
      }
      if (this.canUndoLoading(ref)) {
        this.el.removeAttribute(PHX_REF_LOADING);
        let disabledVal = this.el.getAttribute(PHX_DISABLED);
        let readOnlyVal = this.el.getAttribute(PHX_READONLY);
        if (readOnlyVal !== null) {
          this.el.readOnly = readOnlyVal === "true" ? true : false;
          this.el.removeAttribute(PHX_READONLY);
        }
        if (disabledVal !== null) {
          this.el.disabled = disabledVal === "true" ? true : false;
          this.el.removeAttribute(PHX_DISABLED);
        }
        let disableRestore = this.el.getAttribute(PHX_DISABLE_WITH_RESTORE);
        if (disableRestore !== null) {
          this.el.innerText = disableRestore;
          this.el.removeAttribute(PHX_DISABLE_WITH_RESTORE);
        }
        let opts = { detail: { ref, event: phxEvent }, bubbles: true, cancelable: false };
        this.el.dispatchEvent(new CustomEvent(`phx:undo-loading:${this.loadingRef}`, opts));
      }
      PHX_EVENT_CLASSES.forEach((name) => {
        if (name !== "phx-submit-loading" || this.canUndoLoading(ref)) {
          dom_default.removeClass(this.el, name);
        }
      });
    }
    isLoadingUndoneBy(ref) {
      return this.loadingRef === null ? false : this.loadingRef <= ref;
    }
    isLockUndoneBy(ref) {
      return this.lockRef === null ? false : this.lockRef <= ref;
    }
    isFullyResolvedBy(ref) {
      return (this.loadingRef === null || this.loadingRef <= ref) && (this.lockRef === null || this.lockRef <= ref);
    }
    // only remove the phx-submit-loading class if we are not locked
    canUndoLoading(ref) {
      return this.lockRef === null || this.lockRef <= ref;
    }
  };
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
    // We do the following to optimize append/prepend operations:
    //   1) Track ids of modified elements & of new elements
    //   2) All the modified elements are put back in the correct position in the DOM tree
    //      by storing the id of their previous sibling
    //   3) New elements are going to be put in the right place by morphdom during append.
    //      For prepend, we move them to the first position in the container
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
    /**
     * The "value" attribute is special for the <input> element since it sets
     * the initial value. Changing the "value" attribute without changing the
     * "value" property will have no effect since it is only used to the set the
     * initial value.  Similar for the "checked" attribute, and "disabled".
     */
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
            if (!curChild) {
              curChild = optgroup.nextSibling;
              optgroup = null;
            }
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
      } else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
        toNode = toNode.firstElementChild;
      }
      var getNodeKey = options.getNodeKey || defaultGetNodeKey;
      var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
      var onNodeAdded = options.onNodeAdded || noop;
      var onBeforeElUpdated = options.onBeforeElUpdated || noop;
      var onElUpdated = options.onElUpdated || noop;
      var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
      var onNodeDiscarded = options.onNodeDiscarded || noop;
      var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
      var skipFromChildren = options.skipFromChildren || noop;
      var addChild = options.addChild || function(parent, child) {
        return parent.appendChild(child);
      };
      var childrenOnly = options.childrenOnly === true;
      var fromNodesLookup = /* @__PURE__ */ Object.create(null);
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
            removeNode(
              curFromNodeChild,
              fromEl,
              true
              /* skip keyed nodes */
            );
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
          var beforeUpdateResult = onBeforeElUpdated(fromEl, toEl);
          if (beforeUpdateResult === false) {
            return;
          } else if (beforeUpdateResult instanceof HTMLElement) {
            fromEl = beforeUpdateResult;
            indexTree(fromEl);
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
        var skipFrom = skipFromChildren(fromEl, toEl);
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
            while (!skipFrom && curFromNodeChild) {
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
                            removeNode(
                              curFromNodeChild,
                              fromEl,
                              true
                              /* skip keyed nodes */
                            );
                          }
                          curFromNodeChild = matchingFromEl;
                          curFromNodeKey = getNodeKey(curFromNodeChild);
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
                removeNode(
                  curFromNodeChild,
                  fromEl,
                  true
                  /* skip keyed nodes */
                );
              }
              curFromNodeChild = fromNextSibling;
            }
            if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
              if (!skipFrom) {
                addChild(fromEl, matchingFromEl);
              }
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
                addChild(fromEl, curToNodeChild);
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
    constructor(view, container, id, html, streams, targetCID, opts = {}) {
      this.view = view;
      this.liveSocket = view.liveSocket;
      this.container = container;
      this.id = id;
      this.rootID = view.root.id;
      this.html = html;
      this.streams = streams;
      this.streamInserts = {};
      this.streamComponentRestore = {};
      this.targetCID = targetCID;
      this.cidPatch = isCid(this.targetCID);
      this.pendingRemoves = [];
      this.phxRemove = this.liveSocket.binding("remove");
      this.targetContainer = this.isCIDPatch() ? this.targetCIDContainer(html) : container;
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
      this.withChildren = opts.withChildren || opts.undoRef || false;
      this.undoRef = opts.undoRef;
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
      let phxUpdate = this.liveSocket.binding(PHX_UPDATE);
      dom_default.all(this.container, `[${phxUpdate}=append] > *, [${phxUpdate}=prepend] > *`, (el) => {
        el.setAttribute(PHX_PRUNE, "");
      });
    }
    perform(isJoinPatch) {
      let { view, liveSocket: liveSocket2, html, container } = this;
      let targetContainer = this.targetContainer;
      if (this.isCIDPatch() && !targetContainer) {
        return;
      }
      if (this.isCIDPatch()) {
        const closestLock = targetContainer.closest(`[${PHX_REF_LOCK}]`);
        if (closestLock) {
          const clonedTree = dom_default.private(closestLock, PHX_REF_LOCK);
          if (clonedTree) {
            targetContainer = clonedTree.querySelector(
              `[data-phx-component="${this.targetCID}"]`
            );
          }
        }
      }
      let focused = liveSocket2.getActiveElement();
      let { selectionStart, selectionEnd } = focused && dom_default.hasSelectionRange(focused) ? focused : {};
      let phxUpdate = liveSocket2.binding(PHX_UPDATE);
      let phxViewportTop = liveSocket2.binding(PHX_VIEWPORT_TOP);
      let phxViewportBottom = liveSocket2.binding(PHX_VIEWPORT_BOTTOM);
      let phxTriggerExternal = liveSocket2.binding(PHX_TRIGGER_ACTION);
      let added = [];
      let updates = [];
      let appendPrependUpdates = [];
      let externalFormTriggered = null;
      function morph(targetContainer2, source, withChildren = this.withChildren) {
        let morphCallbacks = {
          // normally, we are running with childrenOnly, as the patch HTML for a LV
          // does not include the LV attrs (data-phx-session, etc.)
          // when we are patching a live component, we do want to patch the root element as well;
          // another case is the recursive patch of a stream item that was kept on reset (-> onBeforeNodeAdded)
          childrenOnly: targetContainer2.getAttribute(PHX_COMPONENT) === null && !withChildren,
          getNodeKey: (node) => {
            if (dom_default.isPhxDestroyed(node)) {
              return null;
            }
            if (isJoinPatch) {
              return node.id;
            }
            return node.id || node.getAttribute && node.getAttribute(PHX_MAGIC_ID);
          },
          // skip indexing from children when container is stream
          skipFromChildren: (from) => {
            return from.getAttribute(phxUpdate) === PHX_STREAM;
          },
          // tell morphdom how to add a child
          addChild: (parent, child) => {
            let { ref, streamAt } = this.getStreamInsert(child);
            if (ref === void 0) {
              return parent.appendChild(child);
            }
            this.setStreamRef(child, ref);
            if (streamAt === 0) {
              parent.insertAdjacentElement("afterbegin", child);
            } else if (streamAt === -1) {
              let lastChild = parent.lastElementChild;
              if (lastChild && !lastChild.hasAttribute(PHX_STREAM_REF)) {
                let nonStreamChild = Array.from(parent.children).find((c) => !c.hasAttribute(PHX_STREAM_REF));
                parent.insertBefore(child, nonStreamChild);
              } else {
                parent.appendChild(child);
              }
            } else if (streamAt > 0) {
              let sibling = Array.from(parent.children)[streamAt];
              parent.insertBefore(child, sibling);
            }
          },
          onBeforeNodeAdded: (el) => {
            dom_default.maintainPrivateHooks(el, el, phxViewportTop, phxViewportBottom);
            this.trackBefore("added", el);
            let morphedEl = el;
            if (this.streamComponentRestore[el.id]) {
              morphedEl = this.streamComponentRestore[el.id];
              delete this.streamComponentRestore[el.id];
              morph.call(this, morphedEl, el, true);
            }
            return morphedEl;
          },
          onNodeAdded: (el) => {
            if (el.getAttribute) {
              this.maybeReOrderStream(el, true);
            }
            if (el instanceof HTMLImageElement && el.srcset) {
              el.srcset = el.srcset;
            } else if (el instanceof HTMLVideoElement && el.autoplay) {
              el.play();
            }
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            if (dom_default.isPhxChild(el) && view.ownsElement(el) || dom_default.isPhxSticky(el) && view.ownsElement(el.parentNode)) {
              this.trackAfter("phxChildAdded", el);
            }
            added.push(el);
          },
          onNodeDiscarded: (el) => this.onNodeDiscarded(el),
          onBeforeNodeDiscarded: (el) => {
            if (el.getAttribute && el.getAttribute(PHX_PRUNE) !== null) {
              return true;
            }
            if (el.parentElement !== null && el.id && dom_default.isPhxUpdate(el.parentElement, phxUpdate, [PHX_STREAM, "append", "prepend"])) {
              return false;
            }
            if (this.maybePendingRemove(el)) {
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
            this.maybeReOrderStream(el, false);
          },
          onBeforeElUpdated: (fromEl, toEl) => {
            if (fromEl.id && fromEl.isSameNode(targetContainer2) && fromEl.id !== toEl.id) {
              morphCallbacks.onNodeDiscarded(fromEl);
              fromEl.replaceWith(toEl);
              return morphCallbacks.onNodeAdded(toEl);
            }
            dom_default.syncPendingAttrs(fromEl, toEl);
            dom_default.maintainPrivateHooks(fromEl, toEl, phxViewportTop, phxViewportBottom);
            dom_default.cleanChildNodes(toEl, phxUpdate);
            if (this.skipCIDSibling(toEl)) {
              this.maybeReOrderStream(fromEl);
              return false;
            }
            if (dom_default.isPhxSticky(fromEl)) {
              [PHX_SESSION, PHX_STATIC, PHX_ROOT_ID].map((attr) => [attr, fromEl.getAttribute(attr), toEl.getAttribute(attr)]).forEach(([attr, fromVal, toVal]) => {
                if (toVal && fromVal !== toVal) {
                  fromEl.setAttribute(attr, toVal);
                }
              });
              return false;
            }
            if (dom_default.isIgnored(fromEl, phxUpdate) || fromEl.form && fromEl.form.isSameNode(externalFormTriggered)) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeAttrs(fromEl, toEl, { isIgnored: dom_default.isIgnored(fromEl, phxUpdate) });
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (fromEl.type === "number" && (fromEl.validity && fromEl.validity.badInput)) {
              return false;
            }
            let isFocusedFormEl = focused && fromEl.isSameNode(focused) && dom_default.isFormInput(fromEl);
            let focusedSelectChanged = isFocusedFormEl && this.isChangedSelect(fromEl, toEl);
            if (fromEl.hasAttribute(PHX_REF_SRC)) {
              const ref = new ElementRef(fromEl);
              if (ref.lockRef && (!this.undoRef || !ref.isLockUndoneBy(this.undoRef))) {
                if (dom_default.isUploadInput(fromEl)) {
                  dom_default.mergeAttrs(fromEl, toEl, { isIgnored: true });
                  this.trackBefore("updated", fromEl, toEl);
                  updates.push(fromEl);
                }
                dom_default.applyStickyOperations(fromEl);
                let isLocked = fromEl.hasAttribute(PHX_REF_LOCK);
                let clone2 = isLocked ? dom_default.private(fromEl, PHX_REF_LOCK) || fromEl.cloneNode(true) : null;
                if (clone2) {
                  dom_default.putPrivate(fromEl, PHX_REF_LOCK, clone2);
                  if (!isFocusedFormEl) {
                    fromEl = clone2;
                  }
                }
              }
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
            if (this.undoRef && dom_default.private(toEl, PHX_REF_LOCK)) {
              dom_default.putPrivate(fromEl, PHX_REF_LOCK, dom_default.private(toEl, PHX_REF_LOCK));
            }
            dom_default.copyPrivates(toEl, fromEl);
            if (isFocusedFormEl && fromEl.type !== "hidden" && !focusedSelectChanged) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeFocusedInput(fromEl, toEl);
              dom_default.syncAttrsToProps(fromEl);
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            } else {
              if (focusedSelectChanged) {
                fromEl.blur();
              }
              if (dom_default.isPhxUpdate(toEl, phxUpdate, ["append", "prepend"])) {
                appendPrependUpdates.push(new DOMPostMorphRestorer(fromEl, toEl, toEl.getAttribute(phxUpdate)));
              }
              dom_default.syncAttrsToProps(toEl);
              dom_default.applyStickyOperations(toEl);
              this.trackBefore("updated", fromEl, toEl);
              return fromEl;
            }
          }
        };
        morphdom_esm_default(targetContainer2, source, morphCallbacks);
      }
      this.trackBefore("added", container);
      this.trackBefore("updated", container, container);
      liveSocket2.time("morphdom", () => {
        this.streams.forEach(([ref, inserts, deleteIds, reset]) => {
          inserts.forEach(([key, streamAt, limit]) => {
            this.streamInserts[key] = { ref, streamAt, limit, reset };
          });
          if (reset !== void 0) {
            dom_default.all(container, `[${PHX_STREAM_REF}="${ref}"]`, (child) => {
              this.removeStreamChildElement(child);
            });
          }
          deleteIds.forEach((id) => {
            let child = container.querySelector(`[id="${id}"]`);
            if (child) {
              this.removeStreamChildElement(child);
            }
          });
        });
        if (isJoinPatch) {
          dom_default.all(this.container, `[${phxUpdate}=${PHX_STREAM}]`).filter((el) => this.view.ownsElement(el)).forEach((el) => {
            Array.from(el.children).forEach((child) => {
              this.removeStreamChildElement(child, true);
            });
          });
        }
        morph.call(this, targetContainer, html);
      });
      if (liveSocket2.isDebugEnabled()) {
        detectDuplicateIds();
        detectInvalidStreamInserts(this.streamInserts);
        Array.from(document.querySelectorAll("input[name=id]")).forEach((node) => {
          if (node.form) {
            console.error('Detected an input with name="id" inside a form! This will cause problems when patching the DOM.\n', node);
          }
        });
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
      this.transitionPendingRemoves();
      if (externalFormTriggered) {
        liveSocket2.unload();
        const submitter = dom_default.private(externalFormTriggered, "submitter");
        if (submitter && submitter.name && targetContainer.contains(submitter)) {
          const input = document.createElement("input");
          input.type = "hidden";
          const formId = submitter.getAttribute("form");
          if (formId) {
            input.setAttribute("form", formId);
          }
          input.name = submitter.name;
          input.value = submitter.value;
          submitter.parentElement.insertBefore(input, submitter);
        }
        Object.getPrototypeOf(externalFormTriggered).submit.call(externalFormTriggered);
      }
      return true;
    }
    onNodeDiscarded(el) {
      if (dom_default.isPhxChild(el) || dom_default.isPhxSticky(el)) {
        this.liveSocket.destroyViewByEl(el);
      }
      this.trackAfter("discarded", el);
    }
    maybePendingRemove(node) {
      if (node.getAttribute && node.getAttribute(this.phxRemove) !== null) {
        this.pendingRemoves.push(node);
        return true;
      } else {
        return false;
      }
    }
    removeStreamChildElement(child, force = false) {
      if (!force && !this.view.ownsElement(child)) {
        return;
      }
      if (this.streamInserts[child.id]) {
        this.streamComponentRestore[child.id] = child;
        child.remove();
      } else {
        if (!this.maybePendingRemove(child)) {
          child.remove();
          this.onNodeDiscarded(child);
        }
      }
    }
    getStreamInsert(el) {
      let insert = el.id ? this.streamInserts[el.id] : {};
      return insert || {};
    }
    setStreamRef(el, ref) {
      dom_default.putSticky(el, PHX_STREAM_REF, (el2) => el2.setAttribute(PHX_STREAM_REF, ref));
    }
    maybeReOrderStream(el, isNew) {
      let { ref, streamAt, reset } = this.getStreamInsert(el);
      if (streamAt === void 0) {
        return;
      }
      this.setStreamRef(el, ref);
      if (!reset && !isNew) {
        return;
      }
      if (!el.parentElement) {
        return;
      }
      if (streamAt === 0) {
        el.parentElement.insertBefore(el, el.parentElement.firstElementChild);
      } else if (streamAt > 0) {
        let children = Array.from(el.parentElement.children);
        let oldIndex = children.indexOf(el);
        if (streamAt >= children.length - 1) {
          el.parentElement.appendChild(el);
        } else {
          let sibling = children[streamAt];
          if (oldIndex > streamAt) {
            el.parentElement.insertBefore(el, sibling);
          } else {
            el.parentElement.insertBefore(el, sibling.nextElementSibling);
          }
        }
      }
      this.maybeLimitStream(el);
    }
    maybeLimitStream(el) {
      let { limit } = this.getStreamInsert(el);
      let children = limit !== null && Array.from(el.parentElement.children);
      if (limit && limit < 0 && children.length > limit * -1) {
        children.slice(0, children.length + limit).forEach((child) => this.removeStreamChildElement(child));
      } else if (limit && limit >= 0 && children.length > limit) {
        children.slice(limit).forEach((child) => this.removeStreamChildElement(child));
      }
    }
    transitionPendingRemoves() {
      let { pendingRemoves, liveSocket: liveSocket2 } = this;
      if (pendingRemoves.length > 0) {
        liveSocket2.transitionRemoves(pendingRemoves, () => {
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
    }
    isChangedSelect(fromEl, toEl) {
      if (!(fromEl instanceof HTMLSelectElement) || fromEl.multiple) {
        return false;
      }
      if (fromEl.options.length !== toEl.options.length) {
        return true;
      }
      toEl.value = fromEl.value;
      return !fromEl.isEqualNode(toEl);
    }
    isCIDPatch() {
      return this.cidPatch;
    }
    skipCIDSibling(el) {
      return el.nodeType === Node.ELEMENT_NODE && el.hasAttribute(PHX_SKIP);
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
    indexOf(parent, child) {
      return Array.from(parent.children).indexOf(child);
    }
  };
  var VOID_TAGS = /* @__PURE__ */ new Set([
    "area",
    "base",
    "br",
    "col",
    "command",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ]);
  var quoteChars = /* @__PURE__ */ new Set(["'", '"']);
  var modifyRoot = (html, attrs, clearInnerHTML) => {
    let i = 0;
    let insideComment = false;
    let beforeTag, afterTag, tag, tagNameEndsAt, id, newHTML;
    let lookahead = html.match(/^(\s*(?:<!--.*?-->\s*)*)<([^\s\/>]+)/);
    if (lookahead === null) {
      throw new Error(`malformed html ${html}`);
    }
    i = lookahead[0].length;
    beforeTag = lookahead[1];
    tag = lookahead[2];
    tagNameEndsAt = i;
    for (i; i < html.length; i++) {
      if (html.charAt(i) === ">") {
        break;
      }
      if (html.charAt(i) === "=") {
        let isId = html.slice(i - 3, i) === " id";
        i++;
        let char = html.charAt(i);
        if (quoteChars.has(char)) {
          let attrStartsAt = i;
          i++;
          for (i; i < html.length; i++) {
            if (html.charAt(i) === char) {
              break;
            }
          }
          if (isId) {
            id = html.slice(attrStartsAt + 1, i);
            break;
          }
        }
      }
    }
    let closeAt = html.length - 1;
    insideComment = false;
    while (closeAt >= beforeTag.length + tag.length) {
      let char = html.charAt(closeAt);
      if (insideComment) {
        if (char === "-" && html.slice(closeAt - 3, closeAt) === "<!-") {
          insideComment = false;
          closeAt -= 4;
        } else {
          closeAt -= 1;
        }
      } else if (char === ">" && html.slice(closeAt - 2, closeAt) === "--") {
        insideComment = true;
        closeAt -= 3;
      } else if (char === ">") {
        break;
      } else {
        closeAt -= 1;
      }
    }
    afterTag = html.slice(closeAt + 1, html.length);
    let attrsStr = Object.keys(attrs).map((attr) => attrs[attr] === true ? attr : `${attr}="${attrs[attr]}"`).join(" ");
    if (clearInnerHTML) {
      let idAttrStr = id ? ` id="${id}"` : "";
      if (VOID_TAGS.has(tag)) {
        newHTML = `<${tag}${idAttrStr}${attrsStr === "" ? "" : " "}${attrsStr}/>`;
      } else {
        newHTML = `<${tag}${idAttrStr}${attrsStr === "" ? "" : " "}${attrsStr}></${tag}>`;
      }
    } else {
      let rest = html.slice(tagNameEndsAt, closeAt + 1);
      newHTML = `<${tag}${attrsStr === "" ? "" : " "}${attrsStr}${rest}`;
    }
    return [newHTML, beforeTag, afterTag];
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
      this.magicId = 0;
      this.mergeDiff(rendered);
    }
    parentViewId() {
      return this.viewId;
    }
    toString(onlyCids) {
      let [str, streams] = this.recursiveToString(this.rendered, this.rendered[COMPONENTS], onlyCids, true, {});
      return [str, streams];
    }
    recursiveToString(rendered, components = rendered[COMPONENTS], onlyCids, changeTracking, rootAttrs) {
      onlyCids = onlyCids ? new Set(onlyCids) : null;
      let output = { buffer: "", components, onlyCids, streams: /* @__PURE__ */ new Set() };
      this.toOutputBuffer(rendered, null, output, changeTracking, rootAttrs);
      return [output.buffer, output.streams];
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
    resetRender(cid) {
      if (this.rendered[COMPONENTS][cid]) {
        this.rendered[COMPONENTS][cid].reset = true;
      }
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
          ndiff = this.cloneMerge(tdiff, cdiff, true);
          ndiff[STATIC] = stat;
        } else {
          ndiff = cdiff[STATIC] !== void 0 || oldc[cid] === void 0 ? cdiff : this.cloneMerge(oldc[cid], cdiff, false);
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
        let isObjVal = isObject(val);
        if (isObjVal && val[STATIC] === void 0 && isObject(targetVal)) {
          this.doMutableMerge(targetVal, val);
        } else {
          target[key] = val;
        }
      }
      if (target[ROOT]) {
        target.newRender = true;
      }
    }
    // Merges cid trees together, copying statics from source tree.
    //
    // The `pruneMagicId` is passed to control pruning the magicId of the
    // target. We must always prune the magicId when we are sharing statics
    // from another component. If not pruning, we replicate the logic from
    // mutableMerge, where we set newRender to true if there is a root
    // (effectively forcing the new version to be rendered instead of skipped)
    //
    cloneMerge(target, source, pruneMagicId) {
      let merged = __spreadValues(__spreadValues({}, target), source);
      for (let key in merged) {
        let val = source[key];
        let targetVal = target[key];
        if (isObject(val) && val[STATIC] === void 0 && isObject(targetVal)) {
          merged[key] = this.cloneMerge(targetVal, val, pruneMagicId);
        } else if (val === void 0 && isObject(targetVal)) {
          merged[key] = this.cloneMerge(targetVal, {}, pruneMagicId);
        }
      }
      if (pruneMagicId) {
        delete merged.magicId;
        delete merged.newRender;
      } else if (target[ROOT]) {
        merged.newRender = true;
      }
      return merged;
    }
    componentToString(cid) {
      let [str, streams] = this.recursiveCIDToString(this.rendered[COMPONENTS], cid, null);
      let [strippedHTML, _before, _after] = modifyRoot(str, {});
      return [strippedHTML, streams];
    }
    pruneCIDs(cids) {
      cids.forEach((cid) => delete this.rendered[COMPONENTS][cid]);
    }
    // private
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
    nextMagicID() {
      this.magicId++;
      return `m${this.magicId}-${this.parentViewId()}`;
    }
    // Converts rendered tree to output buffer.
    //
    // changeTracking controls if we can apply the PHX_SKIP optimization.
    // It is disabled for comprehensions since we must re-render the entire collection
    // and no individual element is tracked inside the comprehension.
    toOutputBuffer(rendered, templates, output, changeTracking, rootAttrs = {}) {
      if (rendered[DYNAMICS]) {
        return this.comprehensionToBuffer(rendered, templates, output);
      }
      let { [STATIC]: statics } = rendered;
      statics = this.templateStatic(statics, templates);
      let isRoot = rendered[ROOT];
      let prevBuffer = output.buffer;
      if (isRoot) {
        output.buffer = "";
      }
      if (changeTracking && isRoot && !rendered.magicId) {
        rendered.newRender = true;
        rendered.magicId = this.nextMagicID();
      }
      output.buffer += statics[0];
      for (let i = 1; i < statics.length; i++) {
        this.dynamicToBuffer(rendered[i - 1], templates, output, changeTracking);
        output.buffer += statics[i];
      }
      if (isRoot) {
        let skip = false;
        let attrs;
        if (changeTracking || rendered.magicId) {
          skip = changeTracking && !rendered.newRender;
          attrs = __spreadValues({ [PHX_MAGIC_ID]: rendered.magicId }, rootAttrs);
        } else {
          attrs = rootAttrs;
        }
        if (skip) {
          attrs[PHX_SKIP] = true;
        }
        let [newRoot, commentBefore, commentAfter] = modifyRoot(output.buffer, attrs, skip);
        rendered.newRender = false;
        output.buffer = prevBuffer + commentBefore + newRoot + commentAfter;
      }
    }
    comprehensionToBuffer(rendered, templates, output) {
      let { [DYNAMICS]: dynamics, [STATIC]: statics, [STREAM]: stream } = rendered;
      let [_ref, _inserts, deleteIds, reset] = stream || [null, {}, [], null];
      statics = this.templateStatic(statics, templates);
      let compTemplates = templates || rendered[TEMPLATES];
      for (let d = 0; d < dynamics.length; d++) {
        let dynamic = dynamics[d];
        output.buffer += statics[0];
        for (let i = 1; i < statics.length; i++) {
          let changeTracking = false;
          this.dynamicToBuffer(dynamic[i - 1], compTemplates, output, changeTracking);
          output.buffer += statics[i];
        }
      }
      if (stream !== void 0 && (rendered[DYNAMICS].length > 0 || deleteIds.length > 0 || reset)) {
        delete rendered[STREAM];
        rendered[DYNAMICS] = [];
        output.streams.add(stream);
      }
    }
    dynamicToBuffer(rendered, templates, output, changeTracking) {
      if (typeof rendered === "number") {
        let [str, streams] = this.recursiveCIDToString(output.components, rendered, output.onlyCids);
        output.buffer += str;
        output.streams = /* @__PURE__ */ new Set([...output.streams, ...streams]);
      } else if (isObject(rendered)) {
        this.toOutputBuffer(rendered, templates, output, changeTracking, {});
      } else {
        output.buffer += rendered;
      }
    }
    recursiveCIDToString(components, cid, onlyCids) {
      let component = components[cid] || logError(`no component for CID ${cid}`, components);
      let attrs = { [PHX_COMPONENT]: cid };
      let skip = onlyCids && !onlyCids.has(cid);
      component.newRender = !skip;
      component.magicId = `c${cid}-${this.parentViewId()}`;
      let changeTracking = !component.reset;
      let [html, streams] = this.recursiveToString(component, components, onlyCids, changeTracking, attrs);
      delete component.reset;
      return [html, streams];
    }
  };
  var focusStack = [];
  var default_transition_time = 200;
  var JS = {
    // private
    exec(e, eventType, phxEvent, view, sourceEl, defaults) {
      let [defaultKind, defaultArgs] = defaults || [null, { callback: defaults && defaults.callback }];
      let commands = phxEvent.charAt(0) === "[" ? JSON.parse(phxEvent) : [[defaultKind, defaultArgs]];
      commands.forEach(([kind, args]) => {
        if (kind === defaultKind) {
          args = __spreadValues(__spreadValues({}, defaultArgs), args);
          args.callback = args.callback || defaultArgs.callback;
        }
        this.filterToEls(view.liveSocket, sourceEl, args).forEach((el) => {
          this[`exec_${kind}`](e, eventType, phxEvent, view, sourceEl, el, args);
        });
      });
    },
    isVisible(el) {
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length > 0);
    },
    // returns true if any part of the element is inside the viewport
    isInViewport(el) {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      return rect.right > 0 && rect.bottom > 0 && rect.left < windowWidth && rect.top < windowHeight;
    },
    // private
    // commands
    exec_exec(e, eventType, phxEvent, view, sourceEl, el, { attr, to }) {
      let encodedJS = el.getAttribute(attr);
      if (!encodedJS) {
        throw new Error(`expected ${attr} to contain JS command on "${to}"`);
      }
      view.liveSocket.execJS(el, encodedJS, eventType);
    },
    exec_dispatch(e, eventType, phxEvent, view, sourceEl, el, { event, detail, bubbles }) {
      detail = detail || {};
      detail.dispatcher = sourceEl;
      dom_default.dispatchEvent(el, event, { detail, bubbles });
    },
    exec_push(e, eventType, phxEvent, view, sourceEl, el, args) {
      let { event, data, target, page_loading, loading, value, dispatcher, callback } = args;
      let pushOpts = { loading, value, target, page_loading: !!page_loading };
      let targetSrc = eventType === "change" && dispatcher ? dispatcher : sourceEl;
      let phxTarget = target || targetSrc.getAttribute(view.binding("target")) || targetSrc;
      const handler = (targetView, targetCtx) => {
        if (!targetView.isConnected()) {
          return;
        }
        if (eventType === "change") {
          let { newCid, _target } = args;
          _target = _target || (dom_default.isFormInput(sourceEl) ? sourceEl.name : void 0);
          if (_target) {
            pushOpts._target = _target;
          }
          targetView.pushInput(sourceEl, targetCtx, newCid, event || phxEvent, pushOpts, callback);
        } else if (eventType === "submit") {
          let { submitter } = args;
          targetView.submitForm(sourceEl, targetCtx, event || phxEvent, submitter, pushOpts, callback);
        } else {
          targetView.pushEvent(eventType, sourceEl, targetCtx, event || phxEvent, data, pushOpts, callback);
        }
      };
      if (args.targetView && args.targetCtx) {
        handler(args.targetView, args.targetCtx);
      } else {
        view.withinTargets(phxTarget, handler);
      }
    },
    exec_navigate(e, eventType, phxEvent, view, sourceEl, el, { href, replace }) {
      view.liveSocket.historyRedirect(e, href, replace ? "replace" : "push", null, sourceEl);
    },
    exec_patch(e, eventType, phxEvent, view, sourceEl, el, { href, replace }) {
      view.liveSocket.pushHistoryPatch(e, href, replace ? "replace" : "push", sourceEl);
    },
    exec_focus(e, eventType, phxEvent, view, sourceEl, el) {
      aria_default.attemptFocus(el);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => aria_default.attemptFocus(el));
      });
    },
    exec_focus_first(e, eventType, phxEvent, view, sourceEl, el) {
      aria_default.focusFirstInteractive(el) || aria_default.focusFirst(el);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => aria_default.focusFirstInteractive(el) || aria_default.focusFirst(el));
      });
    },
    exec_push_focus(e, eventType, phxEvent, view, sourceEl, el) {
      focusStack.push(el || sourceEl);
    },
    exec_pop_focus(_e, _eventType, _phxEvent, _view, _sourceEl, _el) {
      const el = focusStack.pop();
      if (el) {
        el.focus();
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => el.focus());
        });
      }
    },
    exec_add_class(e, eventType, phxEvent, view, sourceEl, el, { names, transition, time, blocking }) {
      this.addOrRemoveClasses(el, names, [], transition, time, view, blocking);
    },
    exec_remove_class(e, eventType, phxEvent, view, sourceEl, el, { names, transition, time, blocking }) {
      this.addOrRemoveClasses(el, [], names, transition, time, view, blocking);
    },
    exec_toggle_class(e, eventType, phxEvent, view, sourceEl, el, { names, transition, time, blocking }) {
      this.toggleClasses(el, names, transition, time, view, blocking);
    },
    exec_toggle_attr(e, eventType, phxEvent, view, sourceEl, el, { attr: [attr, val1, val2] }) {
      this.toggleAttr(el, attr, val1, val2);
    },
    exec_transition(e, eventType, phxEvent, view, sourceEl, el, { time, transition, blocking }) {
      this.addOrRemoveClasses(el, [], [], transition, time, view, blocking);
    },
    exec_toggle(e, eventType, phxEvent, view, sourceEl, el, { display, ins, outs, time, blocking }) {
      this.toggle(eventType, view, el, display, ins, outs, time, blocking);
    },
    exec_show(e, eventType, phxEvent, view, sourceEl, el, { display, transition, time, blocking }) {
      this.show(eventType, view, el, display, transition, time, blocking);
    },
    exec_hide(e, eventType, phxEvent, view, sourceEl, el, { display, transition, time, blocking }) {
      this.hide(eventType, view, el, display, transition, time, blocking);
    },
    exec_set_attr(e, eventType, phxEvent, view, sourceEl, el, { attr: [attr, val] }) {
      this.setOrRemoveAttrs(el, [[attr, val]], []);
    },
    exec_remove_attr(e, eventType, phxEvent, view, sourceEl, el, { attr }) {
      this.setOrRemoveAttrs(el, [], [attr]);
    },
    // utils for commands
    show(eventType, view, el, display, transition, time, blocking) {
      if (!this.isVisible(el)) {
        this.toggle(eventType, view, el, display, transition, null, time, blocking);
      }
    },
    hide(eventType, view, el, display, transition, time, blocking) {
      if (this.isVisible(el)) {
        this.toggle(eventType, view, el, display, null, transition, time, blocking);
      }
    },
    toggle(eventType, view, el, display, ins, outs, time, blocking) {
      time = time || default_transition_time;
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
          let onEnd = () => {
            this.addOrRemoveClasses(el, [], outClasses.concat(outEndClasses));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
            el.dispatchEvent(new Event("phx:hide-end"));
          };
          el.dispatchEvent(new Event("phx:hide-start"));
          if (blocking === false) {
            onStart();
            setTimeout(onEnd, time);
          } else {
            view.transition(time, onStart, onEnd);
          }
        } else {
          if (eventType === "remove") {
            return;
          }
          let onStart = () => {
            this.addOrRemoveClasses(el, inStartClasses, outClasses.concat(outStartClasses).concat(outEndClasses));
            const stickyDisplay = display || this.defaultDisplay(el);
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, inClasses, []);
              window.requestAnimationFrame(() => {
                dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = stickyDisplay);
                this.addOrRemoveClasses(el, inEndClasses, inStartClasses);
              });
            });
          };
          let onEnd = () => {
            this.addOrRemoveClasses(el, [], inClasses.concat(inEndClasses));
            el.dispatchEvent(new Event("phx:show-end"));
          };
          el.dispatchEvent(new Event("phx:show-start"));
          if (blocking === false) {
            onStart();
            setTimeout(onEnd, time);
          } else {
            view.transition(time, onStart, onEnd);
          }
        }
      } else {
        if (this.isVisible(el)) {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:hide-start"));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
            el.dispatchEvent(new Event("phx:hide-end"));
          });
        } else {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:show-start"));
            let stickyDisplay = display || this.defaultDisplay(el);
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = stickyDisplay);
            el.dispatchEvent(new Event("phx:show-end"));
          });
        }
      }
    },
    toggleClasses(el, classes, transition, time, view, blocking) {
      window.requestAnimationFrame(() => {
        let [prevAdds, prevRemoves] = dom_default.getSticky(el, "classes", [[], []]);
        let newAdds = classes.filter((name) => prevAdds.indexOf(name) < 0 && !el.classList.contains(name));
        let newRemoves = classes.filter((name) => prevRemoves.indexOf(name) < 0 && el.classList.contains(name));
        this.addOrRemoveClasses(el, newAdds, newRemoves, transition, time, view, blocking);
      });
    },
    toggleAttr(el, attr, val1, val2) {
      if (el.hasAttribute(attr)) {
        if (val2 !== void 0) {
          if (el.getAttribute(attr) === val1) {
            this.setOrRemoveAttrs(el, [[attr, val2]], []);
          } else {
            this.setOrRemoveAttrs(el, [[attr, val1]], []);
          }
        } else {
          this.setOrRemoveAttrs(el, [], [attr]);
        }
      } else {
        this.setOrRemoveAttrs(el, [[attr, val1]], []);
      }
    },
    addOrRemoveClasses(el, adds, removes, transition, time, view, blocking) {
      time = time || default_transition_time;
      let [transitionRun, transitionStart, transitionEnd] = transition || [[], [], []];
      if (transitionRun.length > 0) {
        let onStart = () => {
          this.addOrRemoveClasses(el, transitionStart, [].concat(transitionRun).concat(transitionEnd));
          window.requestAnimationFrame(() => {
            this.addOrRemoveClasses(el, transitionRun, []);
            window.requestAnimationFrame(() => this.addOrRemoveClasses(el, transitionEnd, transitionStart));
          });
        };
        let onDone = () => this.addOrRemoveClasses(el, adds.concat(transitionEnd), removes.concat(transitionRun).concat(transitionStart));
        if (blocking === false) {
          onStart();
          setTimeout(onDone, time);
        } else {
          view.transition(time, onStart, onDone);
        }
        return;
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
    setOrRemoveAttrs(el, sets, removes) {
      let [prevSets, prevRemoves] = dom_default.getSticky(el, "attrs", [[], []]);
      let alteredAttrs = sets.map(([attr, _val]) => attr).concat(removes);
      let newSets = prevSets.filter(([attr, _val]) => !alteredAttrs.includes(attr)).concat(sets);
      let newRemoves = prevRemoves.filter((attr) => !alteredAttrs.includes(attr)).concat(removes);
      dom_default.putSticky(el, "attrs", (currentEl) => {
        newRemoves.forEach((attr) => currentEl.removeAttribute(attr));
        newSets.forEach(([attr, val]) => currentEl.setAttribute(attr, val));
        return [newSets, newRemoves];
      });
    },
    hasAllClasses(el, classes) {
      return classes.every((name) => el.classList.contains(name));
    },
    isToggledOut(el, outClasses) {
      return !this.isVisible(el) || this.hasAllClasses(el, outClasses);
    },
    filterToEls(liveSocket2, sourceEl, { to }) {
      let defaultQuery = () => {
        if (typeof to === "string") {
          return document.querySelectorAll(to);
        } else if (to.closest) {
          let toEl = sourceEl.closest(to.closest);
          return toEl ? [toEl] : [];
        } else if (to.inner) {
          return sourceEl.querySelectorAll(to.inner);
        }
      };
      return to ? liveSocket2.jsQuerySelectorAll(sourceEl, to, defaultQuery) : [sourceEl];
    },
    defaultDisplay(el) {
      return { tr: "table-row", td: "table-cell" }[el.tagName.toLowerCase()] || "block";
    },
    transitionClasses(val) {
      if (!val) {
        return null;
      }
      let [trans, tStart, tEnd] = Array.isArray(val) ? val : [val.split(" "), [], []];
      trans = Array.isArray(trans) ? trans : trans.split(" ");
      tStart = Array.isArray(tStart) ? tStart : tStart.split(" ");
      tEnd = Array.isArray(tEnd) ? tEnd : tEnd.split(" ");
      return [trans, tStart, tEnd];
    }
  };
  var js_default = JS;
  var HOOK_ID = "hookId";
  var viewHookID = 1;
  var ViewHook = class {
    static makeID() {
      return viewHookID++;
    }
    static elementID(el) {
      return dom_default.private(el, HOOK_ID);
    }
    constructor(view, el, callbacks) {
      this.el = el;
      this.__attachView(view);
      this.__callbacks = callbacks;
      this.__listeners = /* @__PURE__ */ new Set();
      this.__isDisconnected = false;
      dom_default.putPrivate(this.el, HOOK_ID, this.constructor.makeID());
      for (let key in this.__callbacks) {
        this[key] = this.__callbacks[key];
      }
    }
    __attachView(view) {
      if (view) {
        this.__view = () => view;
        this.liveSocket = view.liveSocket;
      } else {
        this.__view = () => {
          throw new Error(`hook not yet attached to a live view: ${this.el.outerHTML}`);
        };
        this.liveSocket = null;
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
      dom_default.deletePrivate(this.el, HOOK_ID);
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
    /**
     * Binds the hook to JS commands.
     *
     * @param {ViewHook} hook - The ViewHook instance to bind.
     *
     * @returns {Object} An object with methods to manipulate the DOM and execute JavaScript.
     */
    js() {
      let hook = this;
      return {
        /**
         * Executes encoded JavaScript in the context of the hook element.
         *
         * @param {string} encodedJS - The encoded JavaScript string to execute.
         */
        exec(encodedJS) {
          hook.__view().liveSocket.execJS(hook.el, encodedJS, "hook");
        },
        /**
         * Shows an element.
         *
         * @param {HTMLElement} el - The element to show.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.display] - The CSS display value to set. Defaults "block".
         * @param {string} [opts.transition] - The CSS transition classes to set when showing.
         * @param {number} [opts.time] - The transition duration in milliseconds. Defaults 200.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *  Defaults `true`.
         */
        show(el, opts = {}) {
          let owner = hook.__view().liveSocket.owner(el);
          js_default.show("hook", owner, el, opts.display, opts.transition, opts.time, opts.blocking);
        },
        /**
         * Hides an element.
         *
         * @param {HTMLElement} el - The element to hide.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.transition] - The CSS transition classes to set when hiding.
         * @param {number} [opts.time] - The transition duration in milliseconds. Defaults 200.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        hide(el, opts = {}) {
          let owner = hook.__view().liveSocket.owner(el);
          js_default.hide("hook", owner, el, null, opts.transition, opts.time, opts.blocking);
        },
        /**
         * Toggles the visibility of an element.
         *
         * @param {HTMLElement} el - The element to toggle.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.display] - The CSS display value to set. Defaults "block".
         * @param {string} [opts.in] - The CSS transition classes for showing.
         *   Accepts either the string of classes to apply when toggling in, or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-0", "opacity-100"]
         *
         * @param {string} [opts.out] - The CSS transition classes for hiding.
         *   Accepts either string of classes to apply when toggling out, or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-100", "opacity-0"]
         *
         * @param {number} [opts.time] - The transition duration in milliseconds.
         *
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        toggle(el, opts = {}) {
          let owner = hook.__view().liveSocket.owner(el);
          opts.in = js_default.transitionClasses(opts.in);
          opts.out = js_default.transitionClasses(opts.out);
          js_default.toggle("hook", owner, el, opts.display, opts.in, opts.out, opts.time, opts.blocking);
        },
        /**
         * Adds CSS classes to an element.
         *
         * @param {HTMLElement} el - The element to add classes to.
         * @param {string|string[]} names - The class name(s) to add.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.transition] - The CSS transition property to set.
         *   Accepts a string of classes to apply when adding classes or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-0", "opacity-100"]
         *
         * @param {number} [opts.time] - The transition duration in milliseconds.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        addClass(el, names, opts = {}) {
          names = Array.isArray(names) ? names : names.split(" ");
          let owner = hook.__view().liveSocket.owner(el);
          js_default.addOrRemoveClasses(el, names, [], opts.transition, opts.time, owner, opts.blocking);
        },
        /**
         * Removes CSS classes from an element.
         *
         * @param {HTMLElement} el - The element to remove classes from.
         * @param {string|string[]} names - The class name(s) to remove.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.transition] - The CSS transition classes to set.
         *   Accepts a string of classes to apply when removing classes or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-100", "opacity-0"]
         *
         * @param {number} [opts.time] - The transition duration in milliseconds.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        removeClass(el, names, opts = {}) {
          opts.transition = js_default.transitionClasses(opts.transition);
          names = Array.isArray(names) ? names : names.split(" ");
          let owner = hook.__view().liveSocket.owner(el);
          js_default.addOrRemoveClasses(el, [], names, opts.transition, opts.time, owner, opts.blocking);
        },
        /**
         * Toggles CSS classes on an element.
         *
         * @param {HTMLElement} el - The element to toggle classes on.
         * @param {string|string[]} names - The class name(s) to toggle.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.transition] - The CSS transition classes to set.
         *   Accepts a string of classes to apply when toggling classes or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-100", "opacity-0"]
         *
         * @param {number} [opts.time] - The transition duration in milliseconds.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        toggleClass(el, names, opts = {}) {
          opts.transition = js_default.transitionClasses(opts.transition);
          names = Array.isArray(names) ? names : names.split(" ");
          let owner = hook.__view().liveSocket.owner(el);
          js_default.toggleClasses(el, names, opts.transition, opts.time, owner, opts.blocking);
        },
        /**
         * Applies a CSS transition to an element.
         *
         * @param {HTMLElement} el - The element to apply the transition to.
         * @param {string|string[]} transition - The transition class(es) to apply.
         *   Accepts a string of classes to apply when transitioning or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-100", "opacity-0"]
         *
         * @param {Object} [opts={}] - Optional settings.
         * @param {number} [opts.time] - The transition duration in milliseconds.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        transition(el, transition, opts = {}) {
          let owner = hook.__view().liveSocket.owner(el);
          js_default.addOrRemoveClasses(el, [], [], js_default.transitionClasses(transition), opts.time, owner, opts.blocking);
        },
        /**
         * Sets an attribute on an element.
         *
         * @param {HTMLElement} el - The element to set the attribute on.
         * @param {string} attr - The attribute name to set.
         * @param {string} val - The value to set for the attribute.
         */
        setAttribute(el, attr, val) {
          js_default.setOrRemoveAttrs(el, [[attr, val]], []);
        },
        /**
         * Removes an attribute from an element.
         *
         * @param {HTMLElement} el - The element to remove the attribute from.
         * @param {string} attr - The attribute name to remove.
         */
        removeAttribute(el, attr) {
          js_default.setOrRemoveAttrs(el, [], [attr]);
        },
        /**
         * Toggles an attribute on an element between two values.
         *
         * @param {HTMLElement} el - The element to toggle the attribute on.
         * @param {string} attr - The attribute name to toggle.
         * @param {string} val1 - The first value to toggle between.
         * @param {string} val2 - The second value to toggle between.
         */
        toggleAttribute(el, attr, val1, val2) {
          js_default.toggleAttr(el, attr, val1, val2);
        }
      };
    }
    pushEvent(event, payload = {}, onReply) {
      if (onReply === void 0) {
        return new Promise((resolve, reject) => {
          try {
            const ref = this.__view().pushHookEvent(this.el, null, event, payload, (reply, _ref) => resolve(reply));
            if (ref === false) {
              reject(new Error("unable to push hook event. LiveView not connected"));
            }
          } catch (error) {
            reject(error);
          }
        });
      }
      return this.__view().pushHookEvent(this.el, null, event, payload, onReply);
    }
    pushEventTo(phxTarget, event, payload = {}, onReply) {
      if (onReply === void 0) {
        return new Promise((resolve, reject) => {
          try {
            this.__view().withinTargets(phxTarget, (view, targetCtx) => {
              const ref = view.pushHookEvent(this.el, targetCtx, event, payload, (reply, _ref) => resolve(reply));
              if (ref === false) {
                reject(new Error("unable to push hook event. LiveView not connected"));
              }
            });
          } catch (error) {
            reject(error);
          }
        });
      }
      return this.__view().withinTargets(phxTarget, (view, targetCtx) => {
        return view.pushHookEvent(this.el, targetCtx, event, payload, onReply);
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
      return this.__view().dispatchUploads(null, name, files);
    }
    uploadTo(phxTarget, name, files) {
      return this.__view().withinTargets(phxTarget, (view, targetCtx) => {
        view.dispatchUploads(targetCtx, name, files);
      });
    }
    __cleanup__() {
      this.__listeners.forEach((callbackRef) => this.removeHandleEvent(callbackRef));
    }
  };
  var prependFormDataKey = (key, prefix) => {
    let isArray = key.endsWith("[]");
    let baseKey = isArray ? key.slice(0, -2) : key;
    baseKey = baseKey.replace(/([^\[\]]+)(\]?$)/, `${prefix}$1$2`);
    if (isArray) {
      baseKey += "[]";
    }
    return baseKey;
  };
  var serializeForm = (form, opts, onlyNames = []) => {
    const { submitter } = opts;
    let injectedElement;
    if (submitter && submitter.name) {
      const input = document.createElement("input");
      input.type = "hidden";
      const formId = submitter.getAttribute("form");
      if (formId) {
        input.setAttribute("form", formId);
      }
      input.name = submitter.name;
      input.value = submitter.value;
      submitter.parentElement.insertBefore(input, submitter);
      injectedElement = input;
    }
    const formData = new FormData(form);
    const toRemove = [];
    formData.forEach((val, key, _index) => {
      if (val instanceof File) {
        toRemove.push(key);
      }
    });
    toRemove.forEach((key) => formData.delete(key));
    const params = new URLSearchParams();
    const { inputsUnused, onlyHiddenInputs } = Array.from(form.elements).reduce((acc, input) => {
      const { inputsUnused: inputsUnused2, onlyHiddenInputs: onlyHiddenInputs2 } = acc;
      const key = input.name;
      if (!key) {
        return acc;
      }
      if (inputsUnused2[key] === void 0) {
        inputsUnused2[key] = true;
      }
      if (onlyHiddenInputs2[key] === void 0) {
        onlyHiddenInputs2[key] = true;
      }
      const isUsed = dom_default.private(input, PHX_HAS_FOCUSED) || dom_default.private(input, PHX_HAS_SUBMITTED);
      const isHidden = input.type === "hidden";
      inputsUnused2[key] = inputsUnused2[key] && !isUsed;
      onlyHiddenInputs2[key] = onlyHiddenInputs2[key] && isHidden;
      return acc;
    }, { inputsUnused: {}, onlyHiddenInputs: {} });
    for (let [key, val] of formData.entries()) {
      if (onlyNames.length === 0 || onlyNames.indexOf(key) >= 0) {
        let isUnused = inputsUnused[key];
        let hidden = onlyHiddenInputs[key];
        if (isUnused && !(submitter && submitter.name == key) && !hidden) {
          params.append(prependFormDataKey(key, "_unused_"), "");
        }
        params.append(key, val);
      }
    }
    if (submitter && injectedElement) {
      submitter.parentElement.removeChild(injectedElement);
    }
    return params.toString();
  };
  var View = class _View {
    static closestView(el) {
      let liveViewEl = el.closest(PHX_VIEW_SELECTOR);
      return liveViewEl ? dom_default.private(liveViewEl, "view") : null;
    }
    constructor(el, liveSocket2, parentView, flash, liveReferer) {
      this.isDead = false;
      this.liveSocket = liveSocket2;
      this.flash = flash;
      this.parent = parentView;
      this.root = parentView ? parentView.root : this;
      this.el = el;
      dom_default.putPrivate(this.el, "view", this);
      this.id = this.el.id;
      this.ref = 0;
      this.lastAckRef = null;
      this.childJoins = 0;
      this.loaderTimer = null;
      this.disconnectedTimer = null;
      this.pendingDiffs = [];
      this.pendingForms = /* @__PURE__ */ new Set();
      this.redirect = false;
      this.href = null;
      this.joinCount = this.parent ? this.parent.joinCount - 1 : 0;
      this.joinAttempts = 0;
      this.joinPending = true;
      this.destroyed = false;
      this.joinCallback = function(onDone) {
        onDone && onDone();
      };
      this.stopCallback = function() {
      };
      this.pendingJoinOps = this.parent ? null : [];
      this.viewHooks = {};
      this.formSubmits = [];
      this.children = this.parent ? null : {};
      this.root.children[this.id] = {};
      this.formsForRecovery = {};
      this.channel = this.liveSocket.channel(`lv:${this.id}`, () => {
        let url = this.href && this.expandURL(this.href);
        return {
          redirect: this.redirect ? url : void 0,
          url: this.redirect ? void 0 : url || void 0,
          params: this.connectParams(liveReferer),
          session: this.getSession(),
          static: this.getStatic(),
          flash: this.flash,
          sticky: this.el.hasAttribute(PHX_STICKY)
        };
      });
    }
    setHref(href) {
      this.href = href;
    }
    setRedirect(href) {
      this.redirect = true;
      this.href = href;
    }
    isMain() {
      return this.el.hasAttribute(PHX_MAIN);
    }
    connectParams(liveReferer) {
      let params = this.liveSocket.params(this.el);
      let manifest = dom_default.all(document, `[${this.binding(PHX_TRACK_STATIC)}]`).map((node) => node.src || node.href).filter((url) => typeof url === "string");
      if (manifest.length > 0) {
        params["_track_static"] = manifest;
      }
      params["_mounts"] = this.joinCount;
      params["_mount_attempts"] = this.joinAttempts;
      params["_live_referer"] = liveReferer;
      this.joinAttempts++;
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
      this.el.classList.remove(
        PHX_CONNECTED_CLASS,
        PHX_LOADING_CLASS,
        PHX_ERROR_CLASS,
        PHX_CLIENT_ERROR_CLASS,
        PHX_SERVER_ERROR_CLASS
      );
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
        this.setContainerClasses(PHX_LOADING_CLASS);
      }
    }
    execAll(binding) {
      dom_default.all(this.el, `[${binding}]`, (el) => this.liveSocket.execJS(el, el.getAttribute(binding)));
    }
    hideLoader() {
      clearTimeout(this.loaderTimer);
      clearTimeout(this.disconnectedTimer);
      this.setContainerClasses(PHX_CONNECTED_CLASS);
      this.execAll(this.binding("connected"));
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
    // calls the callback with the view and target element for the given phxTarget
    // targets can be:
    //  * an element itself, then it is simply passed to liveSocket.owner;
    //  * a CID (Component ID), then we first search the component's element in the DOM
    //  * a selector, then we search the selector in the DOM and call the callback
    //    for each element found with the corresponding owner view
    withinTargets(phxTarget, callback, dom = document, viewEl) {
      if (phxTarget instanceof HTMLElement || phxTarget instanceof SVGElement) {
        return this.liveSocket.owner(phxTarget, (view) => callback(view, phxTarget));
      }
      if (isCid(phxTarget)) {
        let targets = dom_default.findComponentNodeList(viewEl || this.el, phxTarget);
        if (targets.length === 0) {
          logError(`no component found matching phx-target of ${phxTarget}`);
        } else {
          callback(this, parseInt(phxTarget));
        }
      } else {
        let targets = Array.from(dom.querySelectorAll(phxTarget));
        if (targets.length === 0) {
          logError(`nothing found matching the phx-target selector "${phxTarget}"`);
        }
        targets.forEach((target) => this.liveSocket.owner(target, (view) => callback(view, target)));
      }
    }
    applyDiff(type, rawDiff, callback) {
      this.log(type, () => ["", clone(rawDiff)]);
      let { diff, reply, events, title } = Rendered.extract(rawDiff);
      callback({ diff, reply, events });
      if (typeof title === "string" || type == "mount") {
        window.requestAnimationFrame(() => dom_default.putTitle(title));
      }
    }
    onJoin(resp) {
      let { rendered, container, liveview_version } = resp;
      if (container) {
        let [tag, attrs] = container;
        this.el = dom_default.replaceRootContainer(this.el, tag, attrs);
      }
      this.childJoins = 0;
      this.joinPending = true;
      this.flash = null;
      if (this.root === this) {
        this.formsForRecovery = this.getFormsForRecovery();
      }
      if (this.isMain() && window.history.state === null) {
        browser_default.pushState("replace", {
          type: "patch",
          id: this.id,
          position: this.liveSocket.currentHistoryPosition
        });
      }
      if (liveview_version !== this.liveSocket.version()) {
        console.error(`LiveView asset version mismatch. JavaScript version ${this.liveSocket.version()} vs. server ${liveview_version}. To avoid issues, please ensure that your assets use the same version as the server.`);
      }
      browser_default.dropLocal(this.liveSocket.localStorage, window.location.pathname, CONSECUTIVE_RELOADS);
      this.applyDiff("mount", rendered, ({ diff, events }) => {
        this.rendered = new Rendered(this.id, diff);
        let [html, streams] = this.renderContainer(null, "join");
        this.dropPendingRefs();
        this.joinCount++;
        this.joinAttempts = 0;
        this.maybeRecoverForms(html, () => {
          this.onJoinComplete(resp, html, streams, events);
        });
      });
    }
    dropPendingRefs() {
      dom_default.all(document, `[${PHX_REF_SRC}="${this.refSrc()}"]`, (el) => {
        el.removeAttribute(PHX_REF_LOADING);
        el.removeAttribute(PHX_REF_SRC);
        el.removeAttribute(PHX_REF_LOCK);
      });
    }
    onJoinComplete({ live_patch }, html, streams, events) {
      if (this.joinCount > 1 || this.parent && !this.parent.isJoinPending()) {
        return this.applyJoinPatch(live_patch, html, streams, events);
      }
      let newChildren = dom_default.findPhxChildrenInFragment(html, this.id).filter((toEl) => {
        let fromEl = toEl.id && this.el.querySelector(`[id="${toEl.id}"]`);
        let phxStatic = fromEl && fromEl.getAttribute(PHX_STATIC);
        if (phxStatic) {
          toEl.setAttribute(PHX_STATIC, phxStatic);
        }
        if (fromEl) {
          fromEl.setAttribute(PHX_ROOT_ID, this.root.id);
        }
        return this.joinChild(toEl);
      });
      if (newChildren.length === 0) {
        if (this.parent) {
          this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, streams, events)]);
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
          this.applyJoinPatch(live_patch, html, streams, events);
        }
      } else {
        this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, streams, events)]);
      }
    }
    attachTrueDocEl() {
      this.el = dom_default.byId(this.id);
      this.el.setAttribute(PHX_ROOT_ID, this.root.id);
    }
    // this is invoked for dead and live views, so we must filter by
    // by owner to ensure we aren't duplicating hooks across disconnect
    // and connected states. This also handles cases where hooks exist
    // in a root layout with a LV in the body
    execNewMounted(parent = this.el) {
      let phxViewportTop = this.binding(PHX_VIEWPORT_TOP);
      let phxViewportBottom = this.binding(PHX_VIEWPORT_BOTTOM);
      dom_default.all(parent, `[${phxViewportTop}], [${phxViewportBottom}]`, (hookEl) => {
        if (this.ownsElement(hookEl)) {
          dom_default.maintainPrivateHooks(hookEl, hookEl, phxViewportTop, phxViewportBottom);
          this.maybeAddNewHook(hookEl);
        }
      });
      dom_default.all(parent, `[${this.binding(PHX_HOOK)}], [data-phx-${PHX_HOOK}]`, (hookEl) => {
        if (this.ownsElement(hookEl)) {
          this.maybeAddNewHook(hookEl);
        }
      });
      dom_default.all(parent, `[${this.binding(PHX_MOUNTED)}]`, (el) => {
        if (this.ownsElement(el)) {
          this.maybeMounted(el);
        }
      });
    }
    applyJoinPatch(live_patch, html, streams, events) {
      this.attachTrueDocEl();
      let patch = new DOMPatch(this, this.el, this.id, html, streams, null);
      patch.markPrunableContentForRemoval();
      this.performPatch(patch, false, true);
      this.joinNewChildren();
      this.execNewMounted();
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
    maybeMounted(el) {
      let phxMounted = el.getAttribute(this.binding(PHX_MOUNTED));
      let hasBeenInvoked = phxMounted && dom_default.private(el, "mounted");
      if (phxMounted && !hasBeenInvoked) {
        this.liveSocket.execJS(el, phxMounted);
        dom_default.putPrivate(el, "mounted", true);
      }
    }
    maybeAddNewHook(el) {
      let newHook = this.addHook(el);
      if (newHook) {
        newHook.__mounted();
      }
    }
    performPatch(patch, pruneCids, isJoinPatch = false) {
      let removedEls = [];
      let phxChildrenAdded = false;
      let updatedHookIds = /* @__PURE__ */ new Set();
      this.liveSocket.triggerDOM("onPatchStart", [patch.targetContainer]);
      patch.after("added", (el) => {
        this.liveSocket.triggerDOM("onNodeAdded", [el]);
        let phxViewportTop = this.binding(PHX_VIEWPORT_TOP);
        let phxViewportBottom = this.binding(PHX_VIEWPORT_BOTTOM);
        dom_default.maintainPrivateHooks(el, el, phxViewportTop, phxViewportBottom);
        this.maybeAddNewHook(el);
        if (el.getAttribute) {
          this.maybeMounted(el);
        }
      });
      patch.after("phxChildAdded", (el) => {
        if (dom_default.isPhxSticky(el)) {
          this.liveSocket.joinRootViews();
        } else {
          phxChildrenAdded = true;
        }
      });
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
      patch.perform(isJoinPatch);
      this.afterElementsRemoved(removedEls, pruneCids);
      this.liveSocket.triggerDOM("onPatchEnd", [patch.targetContainer]);
      return phxChildrenAdded;
    }
    afterElementsRemoved(elements, pruneCids) {
      let destroyedCIDs = [];
      elements.forEach((parent) => {
        let components = dom_default.all(parent, `[${PHX_COMPONENT}]`);
        let hooks = dom_default.all(parent, `[${this.binding(PHX_HOOK)}], [data-phx-hook]`);
        components.concat(parent).forEach((el) => {
          let cid = this.componentID(el);
          if (isCid(cid) && destroyedCIDs.indexOf(cid) === -1) {
            destroyedCIDs.push(cid);
          }
        });
        hooks.concat(parent).forEach((hookEl) => {
          let hook = this.getHook(hookEl);
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
    maybeRecoverForms(html, callback) {
      const phxChange = this.binding("change");
      const oldForms = this.root.formsForRecovery;
      let template = document.createElement("template");
      template.innerHTML = html;
      const rootEl = template.content.firstElementChild;
      rootEl.id = this.id;
      rootEl.setAttribute(PHX_ROOT_ID, this.root.id);
      rootEl.setAttribute(PHX_SESSION, this.getSession());
      rootEl.setAttribute(PHX_STATIC, this.getStatic());
      rootEl.setAttribute(PHX_PARENT_ID, this.parent ? this.parent.id : null);
      const formsToRecover = (
        // we go over all forms in the new DOM; because this is only the HTML for the current
        // view, we can be sure that all forms are owned by this view:
        dom_default.all(template.content, "form").filter((newForm) => newForm.id && oldForms[newForm.id]).filter((newForm) => !this.pendingForms.has(newForm.id)).filter((newForm) => oldForms[newForm.id].getAttribute(phxChange) === newForm.getAttribute(phxChange)).map((newForm) => {
          return [oldForms[newForm.id], newForm];
        })
      );
      if (formsToRecover.length === 0) {
        return callback();
      }
      formsToRecover.forEach(([oldForm, newForm], i) => {
        this.pendingForms.add(newForm.id);
        this.pushFormRecovery(oldForm, newForm, template.content.firstElementChild, () => {
          this.pendingForms.delete(newForm.id);
          if (i === formsToRecover.length - 1) {
            callback();
          }
        });
      });
    }
    getChildById(id) {
      return this.root.children[this.id][id];
    }
    getDescendentByEl(el) {
      var _a;
      if (el.id === this.id) {
        return this;
      } else {
        return (_a = this.children[el.getAttribute(PHX_PARENT_ID)]) == null ? void 0 : _a[el.id];
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
        let view = new _View(el, this.liveSocket, this);
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
      this.pendingForms.clear();
      this.formsForRecovery = {};
      this.joinCallback(() => {
        this.pendingJoinOps.forEach(([view, op]) => {
          if (!view.isDestroyed()) {
            op();
          }
        });
        this.pendingJoinOps = [];
      });
    }
    update(diff, events, isPending = false) {
      if (this.isJoinPending() || this.liveSocket.hasPendingLink() && this.root.isMain()) {
        if (!isPending) {
          this.pendingDiffs.push({ diff, events });
        }
        return false;
      }
      this.rendered.mergeDiff(diff);
      let phxChildrenAdded = false;
      if (this.rendered.isComponentOnlyDiff(diff)) {
        this.liveSocket.time("component patch complete", () => {
          let parentCids = dom_default.findExistingParentCIDs(this.el, this.rendered.componentCIDs(diff));
          parentCids.forEach((parentCID) => {
            if (this.componentPatch(this.rendered.getComponent(diff, parentCID), parentCID)) {
              phxChildrenAdded = true;
            }
          });
        });
      } else if (!isEmpty(diff)) {
        this.liveSocket.time("full patch complete", () => {
          let [html, streams] = this.renderContainer(diff, "update");
          let patch = new DOMPatch(this, this.el, this.id, html, streams, null);
          phxChildrenAdded = this.performPatch(patch, true);
        });
      }
      this.liveSocket.dispatchEvents(events);
      if (phxChildrenAdded) {
        this.joinNewChildren();
      }
      return true;
    }
    renderContainer(diff, kind) {
      return this.liveSocket.time(`toString diff (${kind})`, () => {
        let tag = this.el.tagName;
        let cids = diff ? this.rendered.componentCIDs(diff) : null;
        let [html, streams] = this.rendered.toString(cids);
        return [`<${tag}>${html}</${tag}>`, streams];
      });
    }
    componentPatch(diff, cid) {
      if (isEmpty(diff))
        return false;
      let [html, streams] = this.rendered.componentToString(cid);
      let patch = new DOMPatch(this, this.el, this.id, html, streams, cid);
      let childrenAdded = this.performPatch(patch, true);
      return childrenAdded;
    }
    getHook(el) {
      return this.viewHooks[ViewHook.elementID(el)];
    }
    addHook(el) {
      let hookElId = ViewHook.elementID(el);
      if (el.getAttribute && !this.ownsElement(el)) {
        return;
      }
      if (hookElId && !this.viewHooks[hookElId]) {
        let hook = dom_default.getCustomElHook(el) || logError(`no hook found for custom element: ${el.id}`);
        this.viewHooks[hookElId] = hook;
        hook.__attachView(this);
        return hook;
      } else if (hookElId || !el.getAttribute) {
        return;
      } else {
        let hookName = el.getAttribute(`data-phx-${PHX_HOOK}`) || el.getAttribute(this.binding(PHX_HOOK));
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
    }
    destroyHook(hook) {
      const hookId = ViewHook.elementID(hook.el);
      hook.__destroyed();
      hook.__cleanup__();
      delete this.viewHooks[hookId];
    }
    applyPendingUpdates() {
      this.pendingDiffs = this.pendingDiffs.filter(
        ({ diff, events }) => !this.update(diff, events, true)
      );
      this.eachChild((child) => child.applyPendingUpdates());
    }
    eachChild(callback) {
      let children = this.root.children[this.id] || {};
      for (let id in children) {
        callback(this.getChildById(id));
      }
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
      this.eachChild((child) => child.destroy());
    }
    onLiveRedirect(redir) {
      let { to, kind, flash } = redir;
      let url = this.expandURL(to);
      let e = new CustomEvent("phx:server-navigate", { detail: { to, kind, flash } });
      this.liveSocket.historyRedirect(e, url, kind, flash);
    }
    onLivePatch(redir) {
      let { to, kind } = redir;
      this.href = this.expandURL(to);
      this.liveSocket.historyPatch(to, kind);
    }
    expandURL(to) {
      return to.startsWith("/") ? `${window.location.protocol}//${window.location.host}${to}` : to;
    }
    onRedirect({ to, flash, reloadToken }) {
      this.liveSocket.redirect(to, flash, reloadToken);
    }
    isDestroyed() {
      return this.destroyed;
    }
    joinDead() {
      this.isDead = true;
    }
    joinPush() {
      this.joinPush = this.joinPush || this.channel.join();
      return this.joinPush;
    }
    join(callback) {
      this.showLoader(this.liveSocket.loaderTimeout);
      this.bindChannel();
      if (this.isMain()) {
        this.stopCallback = this.liveSocket.withPageLoading({ to: this.href, kind: "initial" });
      }
      this.joinCallback = (onDone) => {
        onDone = onDone || function() {
        };
        callback ? callback(this.joinCount, onDone) : onDone();
      };
      this.wrapPush(() => this.channel.join(), {
        ok: (resp) => this.liveSocket.requestDOMUpdate(() => this.onJoin(resp)),
        error: (error) => this.onJoinError(error),
        timeout: () => this.onJoinError({ reason: "timeout" })
      });
    }
    onJoinError(resp) {
      if (resp.reason === "reload") {
        this.log("error", () => [`failed mount with ${resp.status}. Falling back to page reload`, resp]);
        this.onRedirect({ to: this.root.href, reloadToken: resp.token });
        return;
      } else if (resp.reason === "unauthorized" || resp.reason === "stale") {
        this.log("error", () => ["unauthorized live_redirect. Falling back to page request", resp]);
        this.onRedirect({ to: this.root.href, flash: this.flash });
        return;
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
      if (this.isMain()) {
        this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
        if (this.liveSocket.isConnected()) {
          this.liveSocket.reloadWithJitter(this);
        }
      } else {
        if (this.joinAttempts >= MAX_CHILD_JOIN_ATTEMPTS) {
          this.root.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
          this.log("error", () => [`giving up trying to mount after ${MAX_CHILD_JOIN_ATTEMPTS} tries`, resp]);
          this.destroy();
        }
        let trueChildEl = dom_default.byId(this.el.id);
        if (trueChildEl) {
          dom_default.mergeAttrs(trueChildEl, this.el);
          this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
          this.el = trueChildEl;
        } else {
          this.destroy();
        }
      }
    }
    onClose(reason) {
      if (this.isDestroyed()) {
        return;
      }
      if (this.isMain() && this.liveSocket.hasPendingLink() && reason !== "leave") {
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
      if (this.liveSocket.isConnected()) {
        this.log("error", () => ["view crashed", reason]);
      }
      if (!this.liveSocket.isUnloaded()) {
        if (this.liveSocket.isConnected()) {
          this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
        } else {
          this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_CLIENT_ERROR_CLASS]);
        }
      }
    }
    displayError(classes) {
      if (this.isMain()) {
        dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: { to: this.href, kind: "error" } });
      }
      this.showLoader();
      this.setContainerClasses(...classes);
      this.delayedDisconnected();
    }
    delayedDisconnected() {
      this.disconnectedTimer = setTimeout(() => {
        this.execAll(this.binding("disconnected"));
      }, this.liveSocket.disconnectedTimeout);
    }
    wrapPush(callerPush, receives) {
      let latency = this.liveSocket.getLatencySim();
      let withLatency = latency ? (cb) => setTimeout(() => !this.isDestroyed() && cb(), latency) : (cb) => !this.isDestroyed() && cb();
      withLatency(() => {
        callerPush().receive("ok", (resp) => withLatency(() => receives.ok && receives.ok(resp))).receive("error", (reason) => withLatency(() => receives.error && receives.error(reason))).receive("timeout", () => withLatency(() => receives.timeout && receives.timeout()));
      });
    }
    pushWithReply(refGenerator, event, payload) {
      if (!this.isConnected()) {
        return Promise.reject({ error: "noconnection" });
      }
      let [ref, [el], opts] = refGenerator ? refGenerator() : [null, [], {}];
      let oldJoinCount = this.joinCount;
      let onLoadingDone = function() {
      };
      if (opts.page_loading) {
        onLoadingDone = this.liveSocket.withPageLoading({ kind: "element", target: el });
      }
      if (typeof payload.cid !== "number") {
        delete payload.cid;
      }
      return new Promise((resolve, reject) => {
        this.wrapPush(() => this.channel.push(event, payload, PUSH_TIMEOUT), {
          ok: (resp) => {
            if (ref !== null) {
              this.lastAckRef = ref;
            }
            let finish = (hookReply) => {
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
              resolve({ resp, reply: hookReply });
            };
            if (resp.diff) {
              this.liveSocket.requestDOMUpdate(() => {
                this.applyDiff("update", resp.diff, ({ diff, reply, events }) => {
                  if (ref !== null) {
                    this.undoRefs(ref, payload.event);
                  }
                  this.update(diff, events);
                  finish(reply);
                });
              });
            } else {
              if (ref !== null) {
                this.undoRefs(ref, payload.event);
              }
              finish(null);
            }
          },
          error: (reason) => reject({ error: reason }),
          timeout: () => {
            reject({ timeout: true });
            if (this.joinCount === oldJoinCount) {
              this.liveSocket.reloadWithJitter(this, () => {
                this.log("timeout", () => ["received timeout while communicating with server. Falling back to hard refresh for recovery"]);
              });
            }
          }
        });
      });
    }
    undoRefs(ref, phxEvent, onlyEls) {
      if (!this.isConnected()) {
        return;
      }
      let selector = `[${PHX_REF_SRC}="${this.refSrc()}"]`;
      if (onlyEls) {
        onlyEls = new Set(onlyEls);
        dom_default.all(document, selector, (parent) => {
          if (onlyEls && !onlyEls.has(parent)) {
            return;
          }
          dom_default.all(parent, selector, (child) => this.undoElRef(child, ref, phxEvent));
          this.undoElRef(parent, ref, phxEvent);
        });
      } else {
        dom_default.all(document, selector, (el) => this.undoElRef(el, ref, phxEvent));
      }
    }
    undoElRef(el, ref, phxEvent) {
      let elRef = new ElementRef(el);
      elRef.maybeUndo(ref, phxEvent, (clonedTree) => {
        let patch = new DOMPatch(this, el, this.id, clonedTree, [], null, { undoRef: ref });
        const phxChildrenAdded = this.performPatch(patch, true);
        dom_default.all(el, `[${PHX_REF_SRC}="${this.refSrc()}"]`, (child) => this.undoElRef(child, ref, phxEvent));
        if (phxChildrenAdded) {
          this.joinNewChildren();
        }
      });
    }
    refSrc() {
      return this.el.id;
    }
    putRef(elements, phxEvent, eventType, opts = {}) {
      let newRef = this.ref++;
      let disableWith = this.binding(PHX_DISABLE_WITH);
      if (opts.loading) {
        let loadingEls = dom_default.all(document, opts.loading).map((el) => {
          return { el, lock: true, loading: true };
        });
        elements = elements.concat(loadingEls);
      }
      for (let { el, lock, loading } of elements) {
        if (!lock && !loading) {
          throw new Error("putRef requires lock or loading");
        }
        el.setAttribute(PHX_REF_SRC, this.refSrc());
        if (loading) {
          el.setAttribute(PHX_REF_LOADING, newRef);
        }
        if (lock) {
          el.setAttribute(PHX_REF_LOCK, newRef);
        }
        if (!loading || opts.submitter && !(el === opts.submitter || el === opts.form)) {
          continue;
        }
        let lockCompletePromise = new Promise((resolve) => {
          el.addEventListener(`phx:undo-lock:${newRef}`, () => resolve(detail), { once: true });
        });
        let loadingCompletePromise = new Promise((resolve) => {
          el.addEventListener(`phx:undo-loading:${newRef}`, () => resolve(detail), { once: true });
        });
        el.classList.add(`phx-${eventType}-loading`);
        let disableText = el.getAttribute(disableWith);
        if (disableText !== null) {
          if (!el.getAttribute(PHX_DISABLE_WITH_RESTORE)) {
            el.setAttribute(PHX_DISABLE_WITH_RESTORE, el.innerText);
          }
          if (disableText !== "") {
            el.innerText = disableText;
          }
          el.setAttribute(PHX_DISABLED, el.getAttribute(PHX_DISABLED) || el.disabled);
          el.setAttribute("disabled", "");
        }
        let detail = {
          event: phxEvent,
          eventType,
          ref: newRef,
          isLoading: loading,
          isLocked: lock,
          lockElements: elements.filter(({ lock: lock2 }) => lock2).map(({ el: el2 }) => el2),
          loadingElements: elements.filter(({ loading: loading2 }) => loading2).map(({ el: el2 }) => el2),
          unlock: (els) => {
            els = Array.isArray(els) ? els : [els];
            this.undoRefs(newRef, phxEvent, els);
          },
          lockComplete: lockCompletePromise,
          loadingComplete: loadingCompletePromise,
          lock: (lockEl) => {
            return new Promise((resolve) => {
              if (this.isAcked(newRef)) {
                return resolve(detail);
              }
              lockEl.setAttribute(PHX_REF_LOCK, newRef);
              lockEl.setAttribute(PHX_REF_SRC, this.refSrc());
              lockEl.addEventListener(`phx:lock-stop:${newRef}`, () => resolve(detail), { once: true });
            });
          }
        };
        el.dispatchEvent(new CustomEvent("phx:push", {
          detail,
          bubbles: true,
          cancelable: false
        }));
        if (phxEvent) {
          el.dispatchEvent(new CustomEvent(`phx:push:${phxEvent}`, {
            detail,
            bubbles: true,
            cancelable: false
          }));
        }
      }
      return [newRef, elements.map(({ el }) => el), opts];
    }
    isAcked(ref) {
      return this.lastAckRef !== null && this.lastAckRef >= ref;
    }
    componentID(el) {
      let cid = el.getAttribute && el.getAttribute(PHX_COMPONENT);
      return cid ? parseInt(cid) : null;
    }
    targetComponentID(target, targetCtx, opts = {}) {
      if (isCid(targetCtx)) {
        return targetCtx;
      }
      let cidOrSelector = opts.target || target.getAttribute(this.binding("target"));
      if (isCid(cidOrSelector)) {
        return parseInt(cidOrSelector);
      } else if (targetCtx && (cidOrSelector !== null || opts.target)) {
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
    pushHookEvent(el, targetCtx, event, payload, onReply) {
      if (!this.isConnected()) {
        this.log("hook", () => ["unable to push hook event. LiveView not connected", event, payload]);
        return false;
      }
      let [ref, els, opts] = this.putRef([{ el, loading: true, lock: true }], event, "hook");
      this.pushWithReply(() => [ref, els, opts], "event", {
        type: "hook",
        event,
        value: payload,
        cid: this.closestComponentID(targetCtx)
      }).then(({ resp: _resp, reply: hookReply }) => onReply(hookReply, ref));
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
      if (el.value !== void 0 && !(el instanceof HTMLFormElement)) {
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
    pushEvent(type, el, targetCtx, phxEvent, meta, opts = {}, onReply) {
      this.pushWithReply(() => this.putRef([{ el, loading: true, lock: true }], phxEvent, type, opts), "event", {
        type,
        event: phxEvent,
        value: this.extractMeta(el, meta, opts.value),
        cid: this.targetComponentID(el, targetCtx, opts)
      }).then(({ reply }) => onReply && onReply(reply)).catch((error) => logError("Failed to push event", error));
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
        }).then(({ resp }) => onReply(resp)).catch((error) => logError("Failed to push file progress", error));
      });
    }
    pushInput(inputEl, targetCtx, forceCid, phxEvent, opts, callback) {
      if (!inputEl.form) {
        throw new Error("form events require the input to be inside a form");
      }
      let uploads;
      let cid = isCid(forceCid) ? forceCid : this.targetComponentID(inputEl.form, targetCtx, opts);
      let refGenerator = () => {
        return this.putRef([
          { el: inputEl, loading: true, lock: true },
          { el: inputEl.form, loading: true, lock: true }
        ], phxEvent, "change", opts);
      };
      let formData;
      let meta = this.extractMeta(inputEl.form, {}, opts.value);
      let serializeOpts = {};
      if (inputEl instanceof HTMLButtonElement) {
        serializeOpts.submitter = inputEl;
      }
      if (inputEl.getAttribute(this.binding("change"))) {
        formData = serializeForm(inputEl.form, serializeOpts, [inputEl.name]);
      } else {
        formData = serializeForm(inputEl.form, serializeOpts);
      }
      if (dom_default.isUploadInput(inputEl) && inputEl.files && inputEl.files.length > 0) {
        LiveUploader.trackFiles(inputEl, Array.from(inputEl.files));
      }
      uploads = LiveUploader.serializeUploads(inputEl);
      let event = {
        type: "form",
        event: phxEvent,
        value: formData,
        meta: __spreadValues({
          // no target was implicitly sent as "undefined" in LV <= 1.0.5, therefore
          // we have to keep it. In 1.0.6 we switched from passing meta as URL encoded data
          // to passing it directly in the event, but the JSON encode would drop keys with
          // undefined values.
          _target: opts._target || "undefined"
        }, meta),
        uploads,
        cid
      };
      this.pushWithReply(refGenerator, "event", event).then(({ resp }) => {
        if (dom_default.isUploadInput(inputEl) && dom_default.isAutoUpload(inputEl)) {
          ElementRef.onUnlock(inputEl, () => {
            if (LiveUploader.filesAwaitingPreflight(inputEl).length > 0) {
              let [ref, _els] = refGenerator();
              this.undoRefs(ref, phxEvent, [inputEl.form]);
              this.uploadFiles(inputEl.form, phxEvent, targetCtx, ref, cid, (_uploads) => {
                callback && callback(resp);
                this.triggerAwaitingSubmit(inputEl.form, phxEvent);
                this.undoRefs(ref, phxEvent);
              });
            }
          });
        } else {
          callback && callback(resp);
        }
      }).catch((error) => logError("Failed to push input event", error));
    }
    triggerAwaitingSubmit(formEl, phxEvent) {
      let awaitingSubmit = this.getScheduledSubmit(formEl);
      if (awaitingSubmit) {
        let [_el, _ref, _opts, callback] = awaitingSubmit;
        this.cancelSubmit(formEl, phxEvent);
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
    cancelSubmit(formEl, phxEvent) {
      this.formSubmits = this.formSubmits.filter(([el, ref, _opts, _callback]) => {
        if (el.isSameNode(formEl)) {
          this.undoRefs(ref, phxEvent);
          return false;
        } else {
          return true;
        }
      });
    }
    disableForm(formEl, phxEvent, opts = {}) {
      let filterIgnored = (el) => {
        let userIgnored = closestPhxBinding(el, `${this.binding(PHX_UPDATE)}=ignore`, el.form);
        return !(userIgnored || closestPhxBinding(el, "data-phx-update=ignore", el.form));
      };
      let filterDisables = (el) => {
        return el.hasAttribute(this.binding(PHX_DISABLE_WITH));
      };
      let filterButton = (el) => el.tagName == "BUTTON";
      let filterInput = (el) => ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
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
      let formEls = disables.concat(buttons).concat(inputs).map((el) => {
        return { el, loading: true, lock: true };
      });
      let els = [{ el: formEl, loading: true, lock: false }].concat(formEls).reverse();
      return this.putRef(els, phxEvent, "submit", opts);
    }
    pushFormSubmit(formEl, targetCtx, phxEvent, submitter, opts, onReply) {
      let refGenerator = () => this.disableForm(formEl, phxEvent, __spreadProps(__spreadValues({}, opts), {
        form: formEl,
        submitter
      }));
      dom_default.putPrivate(formEl, "submitter", submitter);
      let cid = this.targetComponentID(formEl, targetCtx);
      if (LiveUploader.hasUploadsInProgress(formEl)) {
        let [ref, _els] = refGenerator();
        let push = () => this.pushFormSubmit(formEl, targetCtx, phxEvent, submitter, opts, onReply);
        return this.scheduleSubmit(formEl, ref, opts, push);
      } else if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
        let [ref, els] = refGenerator();
        let proxyRefGen = () => [ref, els, opts];
        this.uploadFiles(formEl, phxEvent, targetCtx, ref, cid, (_uploads) => {
          if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
            return this.undoRefs(ref, phxEvent);
          }
          let meta = this.extractMeta(formEl, {}, opts.value);
          let formData = serializeForm(formEl, { submitter });
          this.pushWithReply(proxyRefGen, "event", {
            type: "form",
            event: phxEvent,
            value: formData,
            meta,
            cid
          }).then(({ resp }) => onReply(resp)).catch((error) => logError("Failed to push form submit", error));
        });
      } else if (!(formEl.hasAttribute(PHX_REF_SRC) && formEl.classList.contains("phx-submit-loading"))) {
        let meta = this.extractMeta(formEl, {}, opts.value);
        let formData = serializeForm(formEl, { submitter });
        this.pushWithReply(refGenerator, "event", {
          type: "form",
          event: phxEvent,
          value: formData,
          meta,
          cid
        }).then(({ resp }) => onReply(resp)).catch((error) => logError("Failed to push form submit", error));
      }
    }
    uploadFiles(formEl, phxEvent, targetCtx, ref, cid, onComplete) {
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
        let entries = uploader.entries().map((entry) => entry.toPreflightPayload());
        if (entries.length === 0) {
          numFileInputsInProgress--;
          return;
        }
        let payload = {
          ref: inputEl.getAttribute(PHX_UPLOAD_REF),
          entries,
          cid: this.targetComponentID(inputEl.form, targetCtx)
        };
        this.log("upload", () => ["sending preflight request", payload]);
        this.pushWithReply(null, "allow_upload", payload).then(({ resp }) => {
          this.log("upload", () => ["got preflight response", resp]);
          uploader.entries().forEach((entry) => {
            if (resp.entries && !resp.entries[entry.ref]) {
              this.handleFailedEntryPreflight(entry.ref, "failed preflight", uploader);
            }
          });
          if (resp.error || Object.keys(resp.entries).length === 0) {
            this.undoRefs(ref, phxEvent);
            let errors = resp.error || [];
            errors.map(([entry_ref, reason]) => {
              this.handleFailedEntryPreflight(entry_ref, reason, uploader);
            });
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
        }).catch((error) => logError("Failed to push upload", error));
      });
    }
    handleFailedEntryPreflight(uploadRef, reason, uploader) {
      if (uploader.isAutoUpload()) {
        let entry = uploader.entries().find((entry2) => entry2.ref === uploadRef.toString());
        if (entry) {
          entry.cancel();
        }
      } else {
        uploader.entries().map((entry) => entry.cancel());
      }
      this.log("upload", () => [`error for entry ${uploadRef}`, reason]);
    }
    dispatchUploads(targetCtx, name, filesOrBlobs) {
      let targetElement = this.targetCtxElement(targetCtx) || this.el;
      let inputs = dom_default.findUploadInputs(targetElement).filter((el) => el.name === name);
      if (inputs.length === 0) {
        logError(`no live file inputs found matching the name "${name}"`);
      } else if (inputs.length > 1) {
        logError(`duplicate live file inputs found matching the name "${name}"`);
      } else {
        dom_default.dispatchEvent(inputs[0], PHX_TRACK_UPLOADS, { detail: { files: filesOrBlobs } });
      }
    }
    targetCtxElement(targetCtx) {
      if (isCid(targetCtx)) {
        let [target] = dom_default.findComponentNodeList(this.el, targetCtx);
        return target;
      } else if (targetCtx) {
        return targetCtx;
      } else {
        return null;
      }
    }
    pushFormRecovery(oldForm, newForm, templateDom, callback) {
      const phxChange = this.binding("change");
      const phxTarget = newForm.getAttribute(this.binding("target")) || newForm;
      const phxEvent = newForm.getAttribute(this.binding(PHX_AUTO_RECOVER)) || newForm.getAttribute(this.binding("change"));
      const inputs = Array.from(oldForm.elements).filter((el) => dom_default.isFormInput(el) && el.name && !el.hasAttribute(phxChange));
      if (inputs.length === 0) {
        callback();
        return;
      }
      inputs.forEach((input2) => input2.hasAttribute(PHX_UPLOAD_REF) && LiveUploader.clearFiles(input2));
      let input = inputs.find((el) => el.type !== "hidden") || inputs[0];
      let pending = 0;
      this.withinTargets(phxTarget, (targetView, targetCtx) => {
        const cid = this.targetComponentID(newForm, targetCtx);
        pending++;
        let e = new CustomEvent("phx:form-recovery", { detail: { sourceElement: oldForm } });
        js_default.exec(e, "change", phxEvent, this, input, ["push", {
          _target: input.name,
          targetView,
          targetCtx,
          newCid: cid,
          callback: () => {
            pending--;
            if (pending === 0) {
              callback();
            }
          }
        }]);
      }, templateDom, templateDom);
    }
    pushLinkPatch(e, href, targetEl, callback) {
      let linkRef = this.liveSocket.setPendingLink(href);
      let loading = e.isTrusted && e.type !== "popstate";
      let refGen = targetEl ? () => this.putRef([{ el: targetEl, loading, lock: true }], null, "click") : null;
      let fallback = () => this.liveSocket.redirect(window.location.href);
      let url = href.startsWith("/") ? `${location.protocol}//${location.host}${href}` : href;
      this.pushWithReply(refGen, "live_patch", { url }).then(
        ({ resp }) => {
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
        },
        ({ error: _error, timeout: _timeout }) => fallback()
      );
    }
    getFormsForRecovery() {
      if (this.joinCount === 0) {
        return {};
      }
      let phxChange = this.binding("change");
      return dom_default.all(this.el, `form[${phxChange}]`).filter((form) => form.id).filter((form) => form.elements.length > 0).filter((form) => form.getAttribute(this.binding(PHX_AUTO_RECOVER)) !== "ignore").map((form) => {
        const clonedForm = form.cloneNode(false);
        dom_default.copyPrivates(clonedForm, form);
        Array.from(form.elements).forEach((el) => {
          const clonedEl = el.cloneNode(true);
          morphdom_esm_default(clonedEl, el);
          dom_default.copyPrivates(clonedEl, el);
          clonedForm.appendChild(clonedEl);
        });
        return clonedForm;
      }).reduce((acc, form) => {
        acc[form.id] = form;
        return acc;
      }, {});
    }
    maybePushComponentsDestroyed(destroyedCIDs) {
      let willDestroyCIDs = destroyedCIDs.filter((cid) => {
        return dom_default.findComponentNodeList(this.el, cid).length === 0;
      });
      if (willDestroyCIDs.length > 0) {
        willDestroyCIDs.forEach((cid) => this.rendered.resetRender(cid));
        this.pushWithReply(null, "cids_will_destroy", { cids: willDestroyCIDs }).then(() => {
          this.liveSocket.requestDOMUpdate(() => {
            let completelyDestroyCIDs = willDestroyCIDs.filter((cid) => {
              return dom_default.findComponentNodeList(this.el, cid).length === 0;
            });
            if (completelyDestroyCIDs.length > 0) {
              this.pushWithReply(null, "cids_destroyed", { cids: completelyDestroyCIDs }).then(({ resp }) => {
                this.rendered.pruneCIDs(resp.cids);
              }).catch((error) => logError("Failed to push components destroyed", error));
            }
          });
        }).catch((error) => logError("Failed to push components destroyed", error));
      }
    }
    ownsElement(el) {
      let parentViewEl = el.closest(PHX_VIEW_SELECTOR);
      return el.getAttribute(PHX_PARENT_ID) === this.id || parentViewEl && parentViewEl.id === this.id || !parentViewEl && this.isDead;
    }
    submitForm(form, targetCtx, phxEvent, submitter, opts = {}) {
      dom_default.putPrivate(form, PHX_HAS_SUBMITTED, true);
      const inputs = Array.from(form.elements);
      inputs.forEach((input) => dom_default.putPrivate(input, PHX_HAS_SUBMITTED, true));
      this.liveSocket.blurActiveElement(this);
      this.pushFormSubmit(form, targetCtx, phxEvent, submitter, opts, () => {
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
          import {LiveSocket} from "phoenix_live_view"
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
      this.outgoingMainEl = null;
      this.clickStartedAtTarget = null;
      this.linkRef = 1;
      this.roots = {};
      this.href = window.location.href;
      this.pendingLink = null;
      this.currentLocation = clone(window.location);
      this.hooks = opts.hooks || {};
      this.uploaders = opts.uploaders || {};
      this.loaderTimeout = opts.loaderTimeout || LOADER_TIMEOUT;
      this.disconnectedTimeout = opts.disconnectedTimeout || DISCONNECTED_TIMEOUT;
      this.reloadWithJitterTimer = null;
      this.maxReloads = opts.maxReloads || MAX_RELOADS;
      this.reloadJitterMin = opts.reloadJitterMin || RELOAD_JITTER_MIN;
      this.reloadJitterMax = opts.reloadJitterMax || RELOAD_JITTER_MAX;
      this.failsafeJitter = opts.failsafeJitter || FAILSAFE_JITTER;
      this.localStorage = opts.localStorage || window.localStorage;
      this.sessionStorage = opts.sessionStorage || window.sessionStorage;
      this.boundTopLevelEvents = false;
      this.boundEventNames = /* @__PURE__ */ new Set();
      this.serverCloseRef = null;
      this.domCallbacks = Object.assign(
        {
          jsQuerySelectorAll: null,
          onPatchStart: closure2(),
          onPatchEnd: closure2(),
          onNodeAdded: closure2(),
          onBeforeElUpdated: closure2()
        },
        opts.dom || {}
      );
      this.transitions = new TransitionSet();
      this.currentHistoryPosition = parseInt(this.sessionStorage.getItem(PHX_LV_HISTORY_POSITION)) || 0;
      window.addEventListener("pagehide", (_e) => {
        this.unloaded = true;
      });
      this.socket.onOpen(() => {
        if (this.isUnloaded()) {
          window.location.reload();
        }
      });
    }
    // public
    version() {
      return "1.0.18";
    }
    isProfileEnabled() {
      return this.sessionStorage.getItem(PHX_LV_PROFILE) === "true";
    }
    isDebugEnabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "true";
    }
    isDebugDisabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "false";
    }
    enableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "true");
    }
    enableProfiling() {
      this.sessionStorage.setItem(PHX_LV_PROFILE, "true");
    }
    disableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "false");
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
      if (window.location.hostname === "localhost" && !this.isDebugDisabled()) {
        this.enableDebug();
      }
      let doConnect = () => {
        this.resetReloadStatus();
        if (this.joinRootViews()) {
          this.bindTopLevelEvents();
          this.socket.connect();
        } else if (this.main) {
          this.socket.connect();
        } else {
          this.bindTopLevelEvents({ dead: true });
        }
        this.joinDeadView();
      };
      if (["complete", "loaded", "interactive"].indexOf(document.readyState) >= 0) {
        doConnect();
      } else {
        document.addEventListener("DOMContentLoaded", () => doConnect());
      }
    }
    disconnect(callback) {
      clearTimeout(this.reloadWithJitterTimer);
      if (this.serverCloseRef) {
        this.socket.off(this.serverCloseRef);
        this.serverCloseRef = null;
      }
      this.socket.disconnect(callback);
    }
    replaceTransport(transport) {
      clearTimeout(this.reloadWithJitterTimer);
      this.socket.replaceTransport(transport);
      this.connect();
    }
    execJS(el, encodedJS, eventType = null) {
      let e = new CustomEvent("phx:exec", { detail: { sourceElement: el } });
      this.owner(el, (view) => js_default.exec(e, eventType, encodedJS, view, el));
    }
    // private
    execJSHookPush(el, phxEvent, data, callback) {
      this.withinOwners(el, (view) => {
        let e = new CustomEvent("phx:exec", { detail: { sourceElement: el } });
        js_default.exec(e, "hook", phxEvent, view, el, ["push", { data, callback }]);
      });
    }
    unload() {
      if (this.unloaded) {
        return;
      }
      if (this.main && this.isConnected()) {
        this.log(this.main, "socket", () => ["disconnect for page nav"]);
      }
      this.unloaded = true;
      this.destroyAllViews();
      this.disconnect();
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
          setTimeout(() => cb(data), latency);
        }
      });
    }
    reloadWithJitter(view, log) {
      clearTimeout(this.reloadWithJitterTimer);
      this.disconnect();
      let minMs = this.reloadJitterMin;
      let maxMs = this.reloadJitterMax;
      let afterMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
      let tries = browser_default.updateLocal(this.localStorage, window.location.pathname, CONSECUTIVE_RELOADS, 0, (count) => count + 1);
      if (tries >= this.maxReloads) {
        afterMs = this.failsafeJitter;
      }
      this.reloadWithJitterTimer = setTimeout(() => {
        if (view.isDestroyed() || view.isConnected()) {
          return;
        }
        view.destroy();
        log ? log() : this.log(view, "join", () => [`encountered ${tries} consecutive reloads`]);
        if (tries >= this.maxReloads) {
          this.log(view, "join", () => [`exceeded ${this.maxReloads} consecutive reloads. Entering failsafe mode`]);
        }
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
    joinDeadView() {
      let body = document.body;
      if (body && !this.isPhxView(body) && !this.isPhxView(document.firstElementChild)) {
        let view = this.newRootView(body);
        view.setHref(this.getHref());
        view.joinDead();
        if (!this.main) {
          this.main = view;
        }
        window.requestAnimationFrame(() => {
          var _a;
          view.execNewMounted();
          this.maybeScroll((_a = history.state) == null ? void 0 : _a.scroll);
        });
      }
    }
    joinRootViews() {
      let rootsFound = false;
      dom_default.all(document, `${PHX_VIEW_SELECTOR}:not([${PHX_PARENT_ID}])`, (rootEl) => {
        if (!this.getRootById(rootEl.id)) {
          let view = this.newRootView(rootEl);
          if (!dom_default.isPhxSticky(rootEl)) {
            view.setHref(this.getHref());
          }
          view.join();
          if (rootEl.hasAttribute(PHX_MAIN)) {
            this.main = view;
          }
        }
        rootsFound = true;
      });
      return rootsFound;
    }
    redirect(to, flash, reloadToken) {
      if (reloadToken) {
        browser_default.setCookie(PHX_RELOAD_STATUS, reloadToken, 60);
      }
      this.unload();
      browser_default.redirect(to, flash);
    }
    replaceMain(href, flash, callback = null, linkRef = this.setPendingLink(href)) {
      const liveReferer = this.currentLocation.href;
      this.outgoingMainEl = this.outgoingMainEl || this.main.el;
      const stickies = dom_default.findPhxSticky(document) || [];
      const removeEls = dom_default.all(this.outgoingMainEl, `[${this.binding("remove")}]`).filter((el) => !dom_default.isChildOfAny(el, stickies));
      const newMainEl = dom_default.cloneNode(this.outgoingMainEl, "");
      this.main.showLoader(this.loaderTimeout);
      this.main.destroy();
      this.main = this.newRootView(newMainEl, flash, liveReferer);
      this.main.setRedirect(href);
      this.transitionRemoves(removeEls);
      this.main.join((joinCount, onDone) => {
        if (joinCount === 1 && this.commitPendingLink(linkRef)) {
          this.requestDOMUpdate(() => {
            removeEls.forEach((el) => el.remove());
            stickies.forEach((el) => newMainEl.appendChild(el));
            this.outgoingMainEl.replaceWith(newMainEl);
            this.outgoingMainEl = null;
            callback && callback(linkRef);
            onDone();
          });
        }
      });
    }
    transitionRemoves(elements, callback) {
      let removeAttr = this.binding("remove");
      let silenceEvents = (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
      };
      elements.forEach((el) => {
        for (let event of this.boundEventNames) {
          el.addEventListener(event, silenceEvents, true);
        }
        this.execJS(el, el.getAttribute(removeAttr), "remove");
      });
      this.requestDOMUpdate(() => {
        elements.forEach((el) => {
          for (let event of this.boundEventNames) {
            el.removeEventListener(event, silenceEvents, true);
          }
        });
        callback && callback();
      });
    }
    isPhxView(el) {
      return el.getAttribute && el.getAttribute(PHX_SESSION) !== null;
    }
    newRootView(el, flash, liveReferer) {
      let view = new View(el, this, null, flash, liveReferer);
      this.roots[view.id] = view;
      return view;
    }
    owner(childEl, callback) {
      let view;
      const closestViewEl = childEl.closest(PHX_VIEW_SELECTOR);
      if (closestViewEl) {
        view = this.getViewByEl(closestViewEl);
      } else {
        view = this.main;
      }
      return view && callback ? callback(view) : view;
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
      this.main = null;
    }
    destroyViewByEl(el) {
      let root = this.getRootById(el.getAttribute(PHX_ROOT_ID));
      if (root && root.id === el.id) {
        root.destroy();
        delete this.roots[root.id];
      } else if (root) {
        root.destroyDescendent(el.id);
      }
    }
    getActiveElement() {
      return document.activeElement;
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
    bindTopLevelEvents({ dead } = {}) {
      if (this.boundTopLevelEvents) {
        return;
      }
      this.boundTopLevelEvents = true;
      this.serverCloseRef = this.socket.onClose((event) => {
        if (event && event.code === 1e3 && this.main) {
          return this.reloadWithJitter(this.main);
        }
      });
      document.body.addEventListener("click", function() {
      });
      window.addEventListener("pageshow", (e) => {
        if (e.persisted) {
          this.getSocket().disconnect();
          this.withPageLoading({ to: window.location.href, kind: "redirect" });
          window.location.reload();
        }
      }, true);
      if (!dead) {
        this.bindNav();
      }
      this.bindClicks();
      if (!dead) {
        this.bindForms();
      }
      this.bind({ keyup: "keyup", keydown: "keydown" }, (e, type, view, targetEl, phxEvent, _phxTarget) => {
        let matchKey = targetEl.getAttribute(this.binding(PHX_KEY));
        let pressedKey = e.key && e.key.toLowerCase();
        if (matchKey && matchKey.toLowerCase() !== pressedKey) {
          return;
        }
        let data = __spreadValues({ key: e.key }, this.eventMeta(type, e, targetEl));
        js_default.exec(e, type, phxEvent, view, targetEl, ["push", { data }]);
      });
      this.bind({ blur: "focusout", focus: "focusin" }, (e, type, view, targetEl, phxEvent, phxTarget) => {
        if (!phxTarget) {
          let data = __spreadValues({ key: e.key }, this.eventMeta(type, e, targetEl));
          js_default.exec(e, type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      this.bind({ blur: "blur", focus: "focus" }, (e, type, view, targetEl, phxEvent, phxTarget) => {
        if (phxTarget === "window") {
          let data = this.eventMeta(type, e, targetEl);
          js_default.exec(e, type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      this.on("dragover", (e) => e.preventDefault());
      this.on("drop", (e) => {
        e.preventDefault();
        let dropTargetId = maybe(closestPhxBinding(e.target, this.binding(PHX_DROP_TARGET)), (trueTarget) => {
          return trueTarget.getAttribute(this.binding(PHX_DROP_TARGET));
        });
        let dropTarget = dropTargetId && document.getElementById(dropTargetId);
        let files = Array.from(e.dataTransfer.files || []);
        if (!dropTarget || dropTarget.disabled || files.length === 0 || !(dropTarget.files instanceof FileList)) {
          return;
        }
        LiveUploader.trackFiles(dropTarget, files, e.dataTransfer);
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
      this.resetReloadStatus();
      return this.linkRef;
    }
    // anytime we are navigating or connecting, drop reload cookie in case
    // we issue the cookie but the next request was interrupted and the server never dropped it
    resetReloadStatus() {
      browser_default.deleteCookie(PHX_RELOAD_STATUS);
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
            this.debounce(e.target, e, browserEventName, () => {
              this.withinOwners(e.target, (view) => {
                callback(e, event, view, e.target, targetPhxEvent, null);
              });
            });
          } else {
            dom_default.all(document, `[${windowBinding}]`, (el) => {
              let phxEvent = el.getAttribute(windowBinding);
              this.debounce(el, e, browserEventName, () => {
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
      this.on("mousedown", (e) => this.clickStartedAtTarget = e.target);
      this.bindClick("click", "click");
    }
    bindClick(eventName, bindingName) {
      let click = this.binding(bindingName);
      window.addEventListener(eventName, (e) => {
        let target = null;
        if (e.detail === 0)
          this.clickStartedAtTarget = e.target;
        let clickStartedAtTarget = this.clickStartedAtTarget || e.target;
        target = closestPhxBinding(e.target, click);
        this.dispatchClickAway(e, clickStartedAtTarget);
        this.clickStartedAtTarget = null;
        let phxEvent = target && target.getAttribute(click);
        if (!phxEvent) {
          if (dom_default.isNewPageClick(e, window.location)) {
            this.unload();
          }
          return;
        }
        if (target.getAttribute("href") === "#") {
          e.preventDefault();
        }
        if (target.hasAttribute(PHX_REF_SRC)) {
          return;
        }
        this.debounce(target, e, "click", () => {
          this.withinOwners(target, (view) => {
            js_default.exec(e, "click", phxEvent, view, target, ["push", { data: this.eventMeta("click", e, target) }]);
          });
        });
      }, false);
    }
    dispatchClickAway(e, clickStartedAt) {
      let phxClickAway = this.binding("click-away");
      dom_default.all(document, `[${phxClickAway}]`, (el) => {
        if (!(el.isSameNode(clickStartedAt) || el.contains(clickStartedAt))) {
          this.withinOwners(el, (view) => {
            let phxEvent = el.getAttribute(phxClickAway);
            if (js_default.isVisible(el) && js_default.isInViewport(el)) {
              js_default.exec(e, "click", phxEvent, view, el, ["push", { data: this.eventMeta("click", e, e.target) }]);
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
        let { type, backType, id, scroll, position } = event.state || {};
        let href = window.location.href;
        let isForward = position > this.currentHistoryPosition;
        type = isForward ? type : backType || type;
        this.currentHistoryPosition = position || 0;
        this.sessionStorage.setItem(PHX_LV_HISTORY_POSITION, this.currentHistoryPosition.toString());
        dom_default.dispatchEvent(window, "phx:navigate", { detail: { href, patch: type === "patch", pop: true, direction: isForward ? "forward" : "backward" } });
        this.requestDOMUpdate(() => {
          const callback = () => {
            this.maybeScroll(scroll);
          };
          if (this.main.isConnected() && (type === "patch" && id === this.main.id)) {
            this.main.pushLinkPatch(event, href, null, callback);
          } else {
            this.replaceMain(href, null, callback);
          }
        });
      }, false);
      window.addEventListener("click", (e) => {
        let target = closestPhxBinding(e.target, PHX_LIVE_LINK);
        let type = target && target.getAttribute(PHX_LIVE_LINK);
        if (!type || !this.isConnected() || !this.main || dom_default.wantsNewTab(e)) {
          return;
        }
        let href = target.href instanceof SVGAnimatedString ? target.href.baseVal : target.href;
        let linkState = target.getAttribute(PHX_LINK_STATE);
        e.preventDefault();
        e.stopImmediatePropagation();
        if (this.pendingLink === href) {
          return;
        }
        this.requestDOMUpdate(() => {
          if (type === "patch") {
            this.pushHistoryPatch(e, href, linkState, target);
          } else if (type === "redirect") {
            this.historyRedirect(e, href, linkState, null, target);
          } else {
            throw new Error(`expected ${PHX_LIVE_LINK} to be "patch" or "redirect", got: ${type}`);
          }
          let phxClick = target.getAttribute(this.binding("click"));
          if (phxClick) {
            this.requestDOMUpdate(() => this.execJS(target, phxClick, "click"));
          }
        });
      }, false);
    }
    maybeScroll(scroll) {
      if (typeof scroll === "number") {
        requestAnimationFrame(() => {
          window.scrollTo(0, scroll);
        });
      }
    }
    dispatchEvent(event, payload = {}) {
      dom_default.dispatchEvent(window, `phx:${event}`, { detail: payload });
    }
    dispatchEvents(events) {
      events.forEach(([event, payload]) => this.dispatchEvent(event, payload));
    }
    withPageLoading(info, callback) {
      dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: info });
      let done = () => dom_default.dispatchEvent(window, "phx:page-loading-stop", { detail: info });
      return callback ? callback(done) : done;
    }
    pushHistoryPatch(e, href, linkState, targetEl) {
      if (!this.isConnected() || !this.main.isMain()) {
        return browser_default.redirect(href);
      }
      this.withPageLoading({ to: href, kind: "patch" }, (done) => {
        this.main.pushLinkPatch(e, href, targetEl, (linkRef) => {
          this.historyPatch(href, linkState, linkRef);
          done();
        });
      });
    }
    historyPatch(href, linkState, linkRef = this.setPendingLink(href)) {
      if (!this.commitPendingLink(linkRef)) {
        return;
      }
      this.currentHistoryPosition++;
      this.sessionStorage.setItem(PHX_LV_HISTORY_POSITION, this.currentHistoryPosition.toString());
      browser_default.updateCurrentState((state) => __spreadProps(__spreadValues({}, state), { backType: "patch" }));
      browser_default.pushState(linkState, {
        type: "patch",
        id: this.main.id,
        position: this.currentHistoryPosition
      }, href);
      dom_default.dispatchEvent(window, "phx:navigate", { detail: { patch: true, href, pop: false, direction: "forward" } });
      this.registerNewLocation(window.location);
    }
    historyRedirect(e, href, linkState, flash, targetEl) {
      const clickLoading = targetEl && e.isTrusted && e.type !== "popstate";
      if (clickLoading) {
        targetEl.classList.add("phx-click-loading");
      }
      if (!this.isConnected() || !this.main.isMain()) {
        return browser_default.redirect(href, flash);
      }
      if (/^\/$|^\/[^\/]+.*$/.test(href)) {
        let { protocol, host } = window.location;
        href = `${protocol}//${host}${href}`;
      }
      let scroll = window.scrollY;
      this.withPageLoading({ to: href, kind: "redirect" }, (done) => {
        this.replaceMain(href, flash, (linkRef) => {
          if (linkRef === this.linkRef) {
            this.currentHistoryPosition++;
            this.sessionStorage.setItem(PHX_LV_HISTORY_POSITION, this.currentHistoryPosition.toString());
            browser_default.updateCurrentState((state) => __spreadProps(__spreadValues({}, state), { backType: "redirect" }));
            browser_default.pushState(linkState, {
              type: "redirect",
              id: this.main.id,
              scroll,
              position: this.currentHistoryPosition
            }, href);
            dom_default.dispatchEvent(window, "phx:navigate", { detail: { href, patch: false, pop: false, direction: "forward" } });
            this.registerNewLocation(window.location);
          }
          if (clickLoading) {
            targetEl.classList.remove("phx-click-loading");
          }
          done();
        });
      });
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
      let externalFormSubmitted = false;
      this.on("submit", (e) => {
        let phxSubmit = e.target.getAttribute(this.binding("submit"));
        let phxChange = e.target.getAttribute(this.binding("change"));
        if (!externalFormSubmitted && phxChange && !phxSubmit) {
          externalFormSubmitted = true;
          e.preventDefault();
          this.withinOwners(e.target, (view) => {
            view.disableForm(e.target);
            window.requestAnimationFrame(() => {
              if (dom_default.isUnloadableFormSubmit(e)) {
                this.unload();
              }
              e.target.submit();
            });
          });
        }
      });
      this.on("submit", (e) => {
        let phxEvent = e.target.getAttribute(this.binding("submit"));
        if (!phxEvent) {
          if (dom_default.isUnloadableFormSubmit(e)) {
            this.unload();
          }
          return;
        }
        e.preventDefault();
        e.target.disabled = true;
        this.withinOwners(e.target, (view) => {
          js_default.exec(e, "submit", phxEvent, view, e.target, ["push", { submitter: e.submitter }]);
        });
      });
      for (let type of ["change", "input"]) {
        this.on(type, (e) => {
          if (e instanceof CustomEvent && e.target.form === void 0) {
            if (e.detail && e.detail.dispatcher) {
              throw new Error(`dispatching a custom ${type} event is only supported on input elements inside a form`);
            }
            return;
          }
          let phxChange = this.binding("change");
          let input = e.target;
          if (e.isComposing) {
            const key = `composition-listener-${type}`;
            if (!dom_default.private(input, key)) {
              dom_default.putPrivate(input, key, true);
              input.addEventListener("compositionend", () => {
                input.dispatchEvent(new Event(type, { bubbles: true }));
                dom_default.deletePrivate(input, key);
              }, { once: true });
            }
            return;
          }
          let inputEvent = input.getAttribute(phxChange);
          let formEvent = input.form && input.form.getAttribute(phxChange);
          let phxEvent = inputEvent || formEvent;
          if (!phxEvent) {
            return;
          }
          if (input.type === "number" && input.validity && input.validity.badInput) {
            return;
          }
          let dispatcher = inputEvent ? input : input.form;
          let currentIterations = iterations;
          iterations++;
          let { at, type: lastType } = dom_default.private(input, "prev-iteration") || {};
          if (at === currentIterations - 1 && type === "change" && lastType === "input") {
            return;
          }
          dom_default.putPrivate(input, "prev-iteration", { at: currentIterations, type });
          this.debounce(input, e, type, () => {
            this.withinOwners(dispatcher, (view) => {
              dom_default.putPrivate(input, PHX_HAS_FOCUSED, true);
              js_default.exec(e, "change", phxEvent, view, input, ["push", { _target: e.target.name, dispatcher }]);
            });
          });
        });
      }
      this.on("reset", (e) => {
        let form = e.target;
        dom_default.resetForm(form);
        let input = Array.from(form.elements).find((el) => el.type === "reset");
        if (input) {
          window.requestAnimationFrame(() => {
            input.dispatchEvent(new Event("input", { bubbles: true, cancelable: false }));
          });
        }
      });
    }
    debounce(el, event, eventType, callback) {
      if (eventType === "blur" || eventType === "focusout") {
        return callback();
      }
      let phxDebounce = this.binding(PHX_DEBOUNCE);
      let phxThrottle = this.binding(PHX_THROTTLE);
      let defaultDebounce = this.defaults.debounce.toString();
      let defaultThrottle = this.defaults.throttle.toString();
      this.withinOwners(el, (view) => {
        let asyncFilter = () => !view.isDestroyed() && document.body.contains(el);
        dom_default.debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, () => {
          callback();
        });
      });
    }
    silenceEvents(callback) {
      this.silenced = true;
      callback();
      this.silenced = false;
    }
    on(event, callback) {
      this.boundEventNames.add(event);
      window.addEventListener(event, (e) => {
        if (!this.silenced) {
          callback(e);
        }
      });
    }
    jsQuerySelectorAll(sourceEl, query, defaultQuery) {
      let all = this.domCallbacks.jsQuerySelectorAll;
      return all ? all(sourceEl, query, defaultQuery) : defaultQuery();
    }
  };
  var TransitionSet = class {
    constructor() {
      this.transitions = /* @__PURE__ */ new Set();
      this.pendingOps = [];
    }
    reset() {
      this.transitions.forEach((timer) => {
        clearTimeout(timer);
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
        this.flushPendingOps();
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
      if (this.size() > 0) {
        return;
      }
      let op = this.pendingOps.shift();
      if (op) {
        op();
        this.flushPendingOps();
      }
    }
  };

  // js/app.js
  var import_topbar = __toESM(require_topbar());
  var csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  var liveSocket = new LiveSocket("/live", Socket, {
    longPollFallbackMs: 2500,
    params: { _csrf_token: csrfToken }
  });
  import_topbar.default.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
  window.addEventListener("phx:page-loading-start", (_info) => import_topbar.default.show(300));
  window.addEventListener("phx:page-loading-stop", (_info) => import_topbar.default.hide());
  liveSocket.connect();
  window.liveSocket = liveSocket;
})();
/**
 * @license MIT
 * topbar 2.0.0, 2023-02-04
 * https://buunguyen.github.io/topbar
 * Copyright (c) 2021 Buu Nguyen
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXNzZXRzL3ZlbmRvci90b3BiYXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2h0bWwvcHJpdi9zdGF0aWMvcGhvZW5peF9odG1sLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC91dGlscy5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvY29uc3RhbnRzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9wdXNoLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC90aW1lci5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvY2hhbm5lbC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvYWpheC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvbG9uZ3BvbGwuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L3ByZXNlbmNlLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9zZXJpYWxpemVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9zb2NrZXQuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvY29uc3RhbnRzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2VudHJ5X3VwbG9hZGVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3V0aWxzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2Jyb3dzZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZG9tLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3VwbG9hZF9lbnRyeS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9saXZlX3VwbG9hZGVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2FyaWEuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvaG9va3MuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZWxlbWVudF9yZWYuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZG9tX3Bvc3RfbW9ycGhfcmVzdG9yZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9ub2RlX21vZHVsZXMvbW9ycGhkb20vZGlzdC9tb3JwaGRvbS1lc20uanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZG9tX3BhdGNoLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3JlbmRlcmVkLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2pzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3ZpZXdfaG9vay5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy92aWV3LmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2xpdmVfc29ja2V0LmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2luZGV4LmpzIiwgIi4uLy4uLy4uL2Fzc2V0cy9qcy9hcHAuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogQGxpY2Vuc2UgTUlUXG4gKiB0b3BiYXIgMi4wLjAsIDIwMjMtMDItMDRcbiAqIGh0dHBzOi8vYnV1bmd1eWVuLmdpdGh1Yi5pby90b3BiYXJcbiAqIENvcHlyaWdodCAoYykgMjAyMSBCdXUgTmd1eWVuXG4gKi9cbihmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgY2FudmFzLFxuICAgIGN1cnJlbnRQcm9ncmVzcyxcbiAgICBzaG93aW5nLFxuICAgIHByb2dyZXNzVGltZXJJZCA9IG51bGwsXG4gICAgZmFkZVRpbWVySWQgPSBudWxsLFxuICAgIGRlbGF5VGltZXJJZCA9IG51bGwsXG4gICAgYWRkRXZlbnQgPSBmdW5jdGlvbiAoZWxlbSwgdHlwZSwgaGFuZGxlcikge1xuICAgICAgaWYgKGVsZW0uYWRkRXZlbnRMaXN0ZW5lcikgZWxlbS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgIGVsc2UgaWYgKGVsZW0uYXR0YWNoRXZlbnQpIGVsZW0uYXR0YWNoRXZlbnQoXCJvblwiICsgdHlwZSwgaGFuZGxlcik7XG4gICAgICBlbHNlIGVsZW1bXCJvblwiICsgdHlwZV0gPSBoYW5kbGVyO1xuICAgIH0sXG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIGF1dG9SdW46IHRydWUsXG4gICAgICBiYXJUaGlja25lc3M6IDMsXG4gICAgICBiYXJDb2xvcnM6IHtcbiAgICAgICAgMDogXCJyZ2JhKDI2LCAgMTg4LCAxNTYsIC45KVwiLFxuICAgICAgICBcIi4yNVwiOiBcInJnYmEoNTIsICAxNTIsIDIxOSwgLjkpXCIsXG4gICAgICAgIFwiLjUwXCI6IFwicmdiYSgyNDEsIDE5NiwgMTUsICAuOSlcIixcbiAgICAgICAgXCIuNzVcIjogXCJyZ2JhKDIzMCwgMTI2LCAzNCwgIC45KVwiLFxuICAgICAgICBcIjEuMFwiOiBcInJnYmEoMjExLCA4NCwgIDAsICAgLjkpXCIsXG4gICAgICB9LFxuICAgICAgc2hhZG93Qmx1cjogMTAsXG4gICAgICBzaGFkb3dDb2xvcjogXCJyZ2JhKDAsICAgMCwgICAwLCAgIC42KVwiLFxuICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgIH0sXG4gICAgcmVwYWludCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgY2FudmFzLmhlaWdodCA9IG9wdGlvbnMuYmFyVGhpY2tuZXNzICogMjtcblxuICAgICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBjdHguc2hhZG93Qmx1ciA9IG9wdGlvbnMuc2hhZG93Qmx1cjtcbiAgICAgIGN0eC5zaGFkb3dDb2xvciA9IG9wdGlvbnMuc2hhZG93Q29sb3I7XG5cbiAgICAgIHZhciBsaW5lR3JhZGllbnQgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgY2FudmFzLndpZHRoLCAwKTtcbiAgICAgIGZvciAodmFyIHN0b3AgaW4gb3B0aW9ucy5iYXJDb2xvcnMpXG4gICAgICAgIGxpbmVHcmFkaWVudC5hZGRDb2xvclN0b3Aoc3RvcCwgb3B0aW9ucy5iYXJDb2xvcnNbc3RvcF0pO1xuICAgICAgY3R4LmxpbmVXaWR0aCA9IG9wdGlvbnMuYmFyVGhpY2tuZXNzO1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4Lm1vdmVUbygwLCBvcHRpb25zLmJhclRoaWNrbmVzcyAvIDIpO1xuICAgICAgY3R4LmxpbmVUbyhcbiAgICAgICAgTWF0aC5jZWlsKGN1cnJlbnRQcm9ncmVzcyAqIGNhbnZhcy53aWR0aCksXG4gICAgICAgIG9wdGlvbnMuYmFyVGhpY2tuZXNzIC8gMlxuICAgICAgKTtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGxpbmVHcmFkaWVudDtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9LFxuICAgIGNyZWF0ZUNhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICB2YXIgc3R5bGUgPSBjYW52YXMuc3R5bGU7XG4gICAgICBzdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcbiAgICAgIHN0eWxlLnRvcCA9IHN0eWxlLmxlZnQgPSBzdHlsZS5yaWdodCA9IHN0eWxlLm1hcmdpbiA9IHN0eWxlLnBhZGRpbmcgPSAwO1xuICAgICAgc3R5bGUuekluZGV4ID0gMTAwMDAxO1xuICAgICAgc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgaWYgKG9wdGlvbnMuY2xhc3NOYW1lKSBjYW52YXMuY2xhc3NMaXN0LmFkZChvcHRpb25zLmNsYXNzTmFtZSk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgICBhZGRFdmVudCh3aW5kb3csIFwicmVzaXplXCIsIHJlcGFpbnQpO1xuICAgIH0sXG4gICAgdG9wYmFyID0ge1xuICAgICAgY29uZmlnOiBmdW5jdGlvbiAob3B0cykge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb3B0cylcbiAgICAgICAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBvcHRpb25zW2tleV0gPSBvcHRzW2tleV07XG4gICAgICB9LFxuICAgICAgc2hvdzogZnVuY3Rpb24gKGRlbGF5KSB7XG4gICAgICAgIGlmIChzaG93aW5nKSByZXR1cm47XG4gICAgICAgIGlmIChkZWxheSkge1xuICAgICAgICAgIGlmIChkZWxheVRpbWVySWQpIHJldHVybjtcbiAgICAgICAgICBkZWxheVRpbWVySWQgPSBzZXRUaW1lb3V0KCgpID0+IHRvcGJhci5zaG93KCksIGRlbGF5KTtcbiAgICAgICAgfSBlbHNlICB7XG4gICAgICAgICAgc2hvd2luZyA9IHRydWU7XG4gICAgICAgICAgaWYgKGZhZGVUaW1lcklkICE9PSBudWxsKSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoZmFkZVRpbWVySWQpO1xuICAgICAgICAgIGlmICghY2FudmFzKSBjcmVhdGVDYW52YXMoKTtcbiAgICAgICAgICBjYW52YXMuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICAgICAgY2FudmFzLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgdG9wYmFyLnByb2dyZXNzKDApO1xuICAgICAgICAgIGlmIChvcHRpb25zLmF1dG9SdW4pIHtcbiAgICAgICAgICAgIChmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICAgICAgICBwcm9ncmVzc1RpbWVySWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgICAgICAgICAgICB0b3BiYXIucHJvZ3Jlc3MoXG4gICAgICAgICAgICAgICAgXCIrXCIgKyAwLjA1ICogTWF0aC5wb3coMSAtIE1hdGguc3FydChjdXJyZW50UHJvZ3Jlc3MpLCAyKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcm9ncmVzczogZnVuY3Rpb24gKHRvKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdG8gPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBjdXJyZW50UHJvZ3Jlc3M7XG4gICAgICAgIGlmICh0eXBlb2YgdG8gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICB0byA9XG4gICAgICAgICAgICAodG8uaW5kZXhPZihcIitcIikgPj0gMCB8fCB0by5pbmRleE9mKFwiLVwiKSA+PSAwXG4gICAgICAgICAgICAgID8gY3VycmVudFByb2dyZXNzXG4gICAgICAgICAgICAgIDogMCkgKyBwYXJzZUZsb2F0KHRvKTtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50UHJvZ3Jlc3MgPSB0byA+IDEgPyAxIDogdG87XG4gICAgICAgIHJlcGFpbnQoKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRQcm9ncmVzcztcbiAgICAgIH0sXG4gICAgICBoaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChkZWxheVRpbWVySWQpO1xuICAgICAgICBkZWxheVRpbWVySWQgPSBudWxsO1xuICAgICAgICBpZiAoIXNob3dpbmcpIHJldHVybjtcbiAgICAgICAgc2hvd2luZyA9IGZhbHNlO1xuICAgICAgICBpZiAocHJvZ3Jlc3NUaW1lcklkICE9IG51bGwpIHtcbiAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocHJvZ3Jlc3NUaW1lcklkKTtcbiAgICAgICAgICBwcm9ncmVzc1RpbWVySWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIChmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICAgIGlmICh0b3BiYXIucHJvZ3Jlc3MoXCIrLjFcIikgPj0gMSkge1xuICAgICAgICAgICAgY2FudmFzLnN0eWxlLm9wYWNpdHkgLT0gMC4wNTtcbiAgICAgICAgICAgIGlmIChjYW52YXMuc3R5bGUub3BhY2l0eSA8PSAwLjA1KSB7XG4gICAgICAgICAgICAgIGNhbnZhcy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICAgIGZhZGVUaW1lcklkID0gbnVsbDtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBmYWRlVGltZXJJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9LFxuICAgIH07XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB0b3BiYXI7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRvcGJhcjtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnRvcGJhciA9IHRvcGJhcjtcbiAgfVxufSkuY2FsbCh0aGlzLCB3aW5kb3csIGRvY3VtZW50KTtcbiIsICJcInVzZSBzdHJpY3RcIjtcblxuKGZ1bmN0aW9uKCkge1xuICB2YXIgUG9seWZpbGxFdmVudCA9IGV2ZW50Q29uc3RydWN0b3IoKTtcblxuICBmdW5jdGlvbiBldmVudENvbnN0cnVjdG9yKCkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB3aW5kb3cuQ3VzdG9tRXZlbnQ7XG4gICAgLy8gSUU8PTkgU3VwcG9ydFxuICAgIGZ1bmN0aW9uIEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMpIHtcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7YnViYmxlczogZmFsc2UsIGNhbmNlbGFibGU6IGZhbHNlLCBkZXRhaWw6IHVuZGVmaW5lZH07XG4gICAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgICBldnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpO1xuICAgICAgcmV0dXJuIGV2dDtcbiAgICB9XG4gICAgQ3VzdG9tRXZlbnQucHJvdG90eXBlID0gd2luZG93LkV2ZW50LnByb3RvdHlwZTtcbiAgICByZXR1cm4gQ3VzdG9tRXZlbnQ7XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZEhpZGRlbklucHV0KG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIGlucHV0LnR5cGUgPSBcImhpZGRlblwiO1xuICAgIGlucHV0Lm5hbWUgPSBuYW1lO1xuICAgIGlucHV0LnZhbHVlID0gdmFsdWU7XG4gICAgcmV0dXJuIGlucHV0O1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZWxlbWVudCwgdGFyZ2V0TW9kaWZpZXJLZXkpIHtcbiAgICB2YXIgdG8gPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtdG9cIiksXG4gICAgICAgIG1ldGhvZCA9IGJ1aWxkSGlkZGVuSW5wdXQoXCJfbWV0aG9kXCIsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1tZXRob2RcIikpLFxuICAgICAgICBjc3JmID0gYnVpbGRIaWRkZW5JbnB1dChcIl9jc3JmX3Rva2VuXCIsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jc3JmXCIpKSxcbiAgICAgICAgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpLFxuICAgICAgICBzdWJtaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiksXG4gICAgICAgIHRhcmdldCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidGFyZ2V0XCIpO1xuXG4gICAgZm9ybS5tZXRob2QgPSAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1ldGhvZFwiKSA9PT0gXCJnZXRcIikgPyBcImdldFwiIDogXCJwb3N0XCI7XG4gICAgZm9ybS5hY3Rpb24gPSB0bztcbiAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuICAgIGlmICh0YXJnZXQpIGZvcm0udGFyZ2V0ID0gdGFyZ2V0O1xuICAgIGVsc2UgaWYgKHRhcmdldE1vZGlmaWVyS2V5KSBmb3JtLnRhcmdldCA9IFwiX2JsYW5rXCI7XG5cbiAgICBmb3JtLmFwcGVuZENoaWxkKGNzcmYpO1xuICAgIGZvcm0uYXBwZW5kQ2hpbGQobWV0aG9kKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZvcm0pO1xuXG4gICAgLy8gSW5zZXJ0IGEgYnV0dG9uIGFuZCBjbGljayBpdCBpbnN0ZWFkIG9mIHVzaW5nIGBmb3JtLnN1Ym1pdGBcbiAgICAvLyBiZWNhdXNlIHRoZSBgc3VibWl0YCBmdW5jdGlvbiBkb2VzIG5vdCBlbWl0IGEgYHN1Ym1pdGAgZXZlbnQuXG4gICAgc3VibWl0LnR5cGUgPSBcInN1Ym1pdFwiO1xuICAgIGZvcm0uYXBwZW5kQ2hpbGQoc3VibWl0KTtcbiAgICBzdWJtaXQuY2xpY2soKTtcbiAgfVxuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgIHZhciBlbGVtZW50ID0gZS50YXJnZXQ7XG4gICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xuXG4gICAgd2hpbGUgKGVsZW1lbnQgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUpIHtcbiAgICAgIHZhciBwaG9lbml4TGlua0V2ZW50ID0gbmV3IFBvbHlmaWxsRXZlbnQoJ3Bob2VuaXgubGluay5jbGljaycsIHtcbiAgICAgICAgXCJidWJibGVzXCI6IHRydWUsIFwiY2FuY2VsYWJsZVwiOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgaWYgKCFlbGVtZW50LmRpc3BhdGNoRXZlbnQocGhvZW5peExpbmtFdmVudCkpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtbWV0aG9kXCIpICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS10b1wiKSkge1xuICAgICAgICBoYW5kbGVDbGljayhlbGVtZW50LCBlLm1ldGFLZXkgfHwgZS5zaGlmdEtleSk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIGZhbHNlKTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGhvZW5peC5saW5rLmNsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgbWVzc2FnZSA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtY29uZmlybVwiKTtcbiAgICBpZihtZXNzYWdlICYmICF3aW5kb3cuY29uZmlybShtZXNzYWdlKSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfSwgZmFsc2UpO1xufSkoKTtcbiIsICIvLyB3cmFwcyB2YWx1ZSBpbiBjbG9zdXJlIG9yIHJldHVybnMgY2xvc3VyZVxuZXhwb3J0IGxldCBjbG9zdXJlID0gKHZhbHVlKSA9PiB7XG4gIGlmKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICByZXR1cm4gdmFsdWVcbiAgfSBlbHNlIHtcbiAgICBsZXQgY2xvc3VyZSA9IGZ1bmN0aW9uICgpeyByZXR1cm4gdmFsdWUgfVxuICAgIHJldHVybiBjbG9zdXJlXG4gIH1cbn1cbiIsICJleHBvcnQgY29uc3QgZ2xvYmFsU2VsZiA9IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IG51bGxcbmV4cG9ydCBjb25zdCBwaHhXaW5kb3cgPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDogbnVsbFxuZXhwb3J0IGNvbnN0IGdsb2JhbCA9IGdsb2JhbFNlbGYgfHwgcGh4V2luZG93IHx8IGdsb2JhbFxuZXhwb3J0IGNvbnN0IERFRkFVTFRfVlNOID0gXCIyLjAuMFwiXG5leHBvcnQgY29uc3QgU09DS0VUX1NUQVRFUyA9IHtjb25uZWN0aW5nOiAwLCBvcGVuOiAxLCBjbG9zaW5nOiAyLCBjbG9zZWQ6IDN9XG5leHBvcnQgY29uc3QgTUFYX0xPTkdQT0xMX0JBVENIX1NJWkUgPSAxMDA7XG5leHBvcnQgY29uc3QgREVGQVVMVF9USU1FT1VUID0gMTAwMDBcbmV4cG9ydCBjb25zdCBXU19DTE9TRV9OT1JNQUwgPSAxMDAwXG5leHBvcnQgY29uc3QgQ0hBTk5FTF9TVEFURVMgPSB7XG4gIGNsb3NlZDogXCJjbG9zZWRcIixcbiAgZXJyb3JlZDogXCJlcnJvcmVkXCIsXG4gIGpvaW5lZDogXCJqb2luZWRcIixcbiAgam9pbmluZzogXCJqb2luaW5nXCIsXG4gIGxlYXZpbmc6IFwibGVhdmluZ1wiLFxufVxuZXhwb3J0IGNvbnN0IENIQU5ORUxfRVZFTlRTID0ge1xuICBjbG9zZTogXCJwaHhfY2xvc2VcIixcbiAgZXJyb3I6IFwicGh4X2Vycm9yXCIsXG4gIGpvaW46IFwicGh4X2pvaW5cIixcbiAgcmVwbHk6IFwicGh4X3JlcGx5XCIsXG4gIGxlYXZlOiBcInBoeF9sZWF2ZVwiXG59XG5cbmV4cG9ydCBjb25zdCBUUkFOU1BPUlRTID0ge1xuICBsb25ncG9sbDogXCJsb25ncG9sbFwiLFxuICB3ZWJzb2NrZXQ6IFwid2Vic29ja2V0XCJcbn1cbmV4cG9ydCBjb25zdCBYSFJfU1RBVEVTID0ge1xuICBjb21wbGV0ZTogNFxufVxuIiwgIi8qKlxuICogSW5pdGlhbGl6ZXMgdGhlIFB1c2hcbiAqIEBwYXJhbSB7Q2hhbm5lbH0gY2hhbm5lbCAtIFRoZSBDaGFubmVsXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgLSBUaGUgZXZlbnQsIGZvciBleGFtcGxlIGBcInBoeF9qb2luXCJgXG4gKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCAtIFRoZSBwYXlsb2FkLCBmb3IgZXhhbXBsZSBge3VzZXJfaWQ6IDEyM31gXG4gKiBAcGFyYW0ge251bWJlcn0gdGltZW91dCAtIFRoZSBwdXNoIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFB1c2gge1xuICBjb25zdHJ1Y3RvcihjaGFubmVsLCBldmVudCwgcGF5bG9hZCwgdGltZW91dCl7XG4gICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbFxuICAgIHRoaXMuZXZlbnQgPSBldmVudFxuICAgIHRoaXMucGF5bG9hZCA9IHBheWxvYWQgfHwgZnVuY3Rpb24gKCl7IHJldHVybiB7fSB9XG4gICAgdGhpcy5yZWNlaXZlZFJlc3AgPSBudWxsXG4gICAgdGhpcy50aW1lb3V0ID0gdGltZW91dFxuICAgIHRoaXMudGltZW91dFRpbWVyID0gbnVsbFxuICAgIHRoaXMucmVjSG9va3MgPSBbXVxuICAgIHRoaXMuc2VudCA9IGZhbHNlXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVvdXRcbiAgICovXG4gIHJlc2VuZCh0aW1lb3V0KXtcbiAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgdGhpcy5yZXNldCgpXG4gICAgdGhpcy5zZW5kKClcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgc2VuZCgpe1xuICAgIGlmKHRoaXMuaGFzUmVjZWl2ZWQoXCJ0aW1lb3V0XCIpKXsgcmV0dXJuIH1cbiAgICB0aGlzLnN0YXJ0VGltZW91dCgpXG4gICAgdGhpcy5zZW50ID0gdHJ1ZVxuICAgIHRoaXMuY2hhbm5lbC5zb2NrZXQucHVzaCh7XG4gICAgICB0b3BpYzogdGhpcy5jaGFubmVsLnRvcGljLFxuICAgICAgZXZlbnQ6IHRoaXMuZXZlbnQsXG4gICAgICBwYXlsb2FkOiB0aGlzLnBheWxvYWQoKSxcbiAgICAgIHJlZjogdGhpcy5yZWYsXG4gICAgICBqb2luX3JlZjogdGhpcy5jaGFubmVsLmpvaW5SZWYoKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHsqfSBzdGF0dXNcbiAgICogQHBhcmFtIHsqfSBjYWxsYmFja1xuICAgKi9cbiAgcmVjZWl2ZShzdGF0dXMsIGNhbGxiYWNrKXtcbiAgICBpZih0aGlzLmhhc1JlY2VpdmVkKHN0YXR1cykpe1xuICAgICAgY2FsbGJhY2sodGhpcy5yZWNlaXZlZFJlc3AucmVzcG9uc2UpXG4gICAgfVxuXG4gICAgdGhpcy5yZWNIb29rcy5wdXNoKHtzdGF0dXMsIGNhbGxiYWNrfSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpe1xuICAgIHRoaXMuY2FuY2VsUmVmRXZlbnQoKVxuICAgIHRoaXMucmVmID0gbnVsbFxuICAgIHRoaXMucmVmRXZlbnQgPSBudWxsXG4gICAgdGhpcy5yZWNlaXZlZFJlc3AgPSBudWxsXG4gICAgdGhpcy5zZW50ID0gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbWF0Y2hSZWNlaXZlKHtzdGF0dXMsIHJlc3BvbnNlLCBfcmVmfSl7XG4gICAgdGhpcy5yZWNIb29rcy5maWx0ZXIoaCA9PiBoLnN0YXR1cyA9PT0gc3RhdHVzKVxuICAgICAgLmZvckVhY2goaCA9PiBoLmNhbGxiYWNrKHJlc3BvbnNlKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2FuY2VsUmVmRXZlbnQoKXtcbiAgICBpZighdGhpcy5yZWZFdmVudCl7IHJldHVybiB9XG4gICAgdGhpcy5jaGFubmVsLm9mZih0aGlzLnJlZkV2ZW50KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjYW5jZWxUaW1lb3V0KCl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dFRpbWVyKVxuICAgIHRoaXMudGltZW91dFRpbWVyID0gbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydFRpbWVvdXQoKXtcbiAgICBpZih0aGlzLnRpbWVvdXRUaW1lcil7IHRoaXMuY2FuY2VsVGltZW91dCgpIH1cbiAgICB0aGlzLnJlZiA9IHRoaXMuY2hhbm5lbC5zb2NrZXQubWFrZVJlZigpXG4gICAgdGhpcy5yZWZFdmVudCA9IHRoaXMuY2hhbm5lbC5yZXBseUV2ZW50TmFtZSh0aGlzLnJlZilcblxuICAgIHRoaXMuY2hhbm5lbC5vbih0aGlzLnJlZkV2ZW50LCBwYXlsb2FkID0+IHtcbiAgICAgIHRoaXMuY2FuY2VsUmVmRXZlbnQoKVxuICAgICAgdGhpcy5jYW5jZWxUaW1lb3V0KClcbiAgICAgIHRoaXMucmVjZWl2ZWRSZXNwID0gcGF5bG9hZFxuICAgICAgdGhpcy5tYXRjaFJlY2VpdmUocGF5bG9hZClcbiAgICB9KVxuXG4gICAgdGhpcy50aW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMudHJpZ2dlcihcInRpbWVvdXRcIiwge30pXG4gICAgfSwgdGhpcy50aW1lb3V0KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBoYXNSZWNlaXZlZChzdGF0dXMpe1xuICAgIHJldHVybiB0aGlzLnJlY2VpdmVkUmVzcCAmJiB0aGlzLnJlY2VpdmVkUmVzcC5zdGF0dXMgPT09IHN0YXR1c1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0cmlnZ2VyKHN0YXR1cywgcmVzcG9uc2Upe1xuICAgIHRoaXMuY2hhbm5lbC50cmlnZ2VyKHRoaXMucmVmRXZlbnQsIHtzdGF0dXMsIHJlc3BvbnNlfSlcbiAgfVxufVxuIiwgIi8qKlxuICpcbiAqIENyZWF0ZXMgYSB0aW1lciB0aGF0IGFjY2VwdHMgYSBgdGltZXJDYWxjYCBmdW5jdGlvbiB0byBwZXJmb3JtXG4gKiBjYWxjdWxhdGVkIHRpbWVvdXQgcmV0cmllcywgc3VjaCBhcyBleHBvbmVudGlhbCBiYWNrb2ZmLlxuICpcbiAqIEBleGFtcGxlXG4gKiBsZXQgcmVjb25uZWN0VGltZXIgPSBuZXcgVGltZXIoKCkgPT4gdGhpcy5jb25uZWN0KCksIGZ1bmN0aW9uKHRyaWVzKXtcbiAqICAgcmV0dXJuIFsxMDAwLCA1MDAwLCAxMDAwMF1bdHJpZXMgLSAxXSB8fCAxMDAwMFxuICogfSlcbiAqIHJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpIC8vIGZpcmVzIGFmdGVyIDEwMDBcbiAqIHJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpIC8vIGZpcmVzIGFmdGVyIDUwMDBcbiAqIHJlY29ubmVjdFRpbWVyLnJlc2V0KClcbiAqIHJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpIC8vIGZpcmVzIGFmdGVyIDEwMDBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtGdW5jdGlvbn0gdGltZXJDYWxjXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVyIHtcbiAgY29uc3RydWN0b3IoY2FsbGJhY2ssIHRpbWVyQ2FsYyl7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgdGhpcy50aW1lckNhbGMgPSB0aW1lckNhbGNcbiAgICB0aGlzLnRpbWVyID0gbnVsbFxuICAgIHRoaXMudHJpZXMgPSAwXG4gIH1cblxuICByZXNldCgpe1xuICAgIHRoaXMudHJpZXMgPSAwXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpXG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VscyBhbnkgcHJldmlvdXMgc2NoZWR1bGVUaW1lb3V0IGFuZCBzY2hlZHVsZXMgY2FsbGJhY2tcbiAgICovXG4gIHNjaGVkdWxlVGltZW91dCgpe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKVxuXG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy50cmllcyA9IHRoaXMudHJpZXMgKyAxXG4gICAgICB0aGlzLmNhbGxiYWNrKClcbiAgICB9LCB0aGlzLnRpbWVyQ2FsYyh0aGlzLnRyaWVzICsgMSkpXG4gIH1cbn1cbiIsICJpbXBvcnQge2Nsb3N1cmV9IGZyb20gXCIuL3V0aWxzXCJcbmltcG9ydCB7XG4gIENIQU5ORUxfRVZFTlRTLFxuICBDSEFOTkVMX1NUQVRFUyxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IFB1c2ggZnJvbSBcIi4vcHVzaFwiXG5pbXBvcnQgVGltZXIgZnJvbSBcIi4vdGltZXJcIlxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdG9waWNcbiAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbil9IHBhcmFtc1xuICogQHBhcmFtIHtTb2NrZXR9IHNvY2tldFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFubmVsIHtcbiAgY29uc3RydWN0b3IodG9waWMsIHBhcmFtcywgc29ja2V0KXtcbiAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkXG4gICAgdGhpcy50b3BpYyA9IHRvcGljXG4gICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKHBhcmFtcyB8fCB7fSlcbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldFxuICAgIHRoaXMuYmluZGluZ3MgPSBbXVxuICAgIHRoaXMuYmluZGluZ1JlZiA9IDBcbiAgICB0aGlzLnRpbWVvdXQgPSB0aGlzLnNvY2tldC50aW1lb3V0XG4gICAgdGhpcy5qb2luZWRPbmNlID0gZmFsc2VcbiAgICB0aGlzLmpvaW5QdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMuam9pbiwgdGhpcy5wYXJhbXMsIHRoaXMudGltZW91dClcbiAgICB0aGlzLnB1c2hCdWZmZXIgPSBbXVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VSZWZzID0gW11cblxuICAgIHRoaXMucmVqb2luVGltZXIgPSBuZXcgVGltZXIoKCkgPT4ge1xuICAgICAgaWYodGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMucmVqb2luKCkgfVxuICAgIH0sIHRoaXMuc29ja2V0LnJlam9pbkFmdGVyTXMpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZVJlZnMucHVzaCh0aGlzLnNvY2tldC5vbkVycm9yKCgpID0+IHRoaXMucmVqb2luVGltZXIucmVzZXQoKSkpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZVJlZnMucHVzaCh0aGlzLnNvY2tldC5vbk9wZW4oKCkgPT4ge1xuICAgICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpXG4gICAgICBpZih0aGlzLmlzRXJyb3JlZCgpKXsgdGhpcy5yZWpvaW4oKSB9XG4gICAgfSlcbiAgICApXG4gICAgdGhpcy5qb2luUHVzaC5yZWNlaXZlKFwib2tcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmpvaW5lZFxuICAgICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpXG4gICAgICB0aGlzLnB1c2hCdWZmZXIuZm9yRWFjaChwdXNoRXZlbnQgPT4gcHVzaEV2ZW50LnNlbmQoKSlcbiAgICAgIHRoaXMucHVzaEJ1ZmZlciA9IFtdXG4gICAgfSlcbiAgICB0aGlzLmpvaW5QdXNoLnJlY2VpdmUoXCJlcnJvclwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZFxuICAgICAgaWYodGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMucmVqb2luVGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgfVxuICAgIH0pXG4gICAgdGhpcy5vbkNsb3NlKCgpID0+IHtcbiAgICAgIHRoaXMucmVqb2luVGltZXIucmVzZXQoKVxuICAgICAgaWYodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgYGNsb3NlICR7dGhpcy50b3BpY30gJHt0aGlzLmpvaW5SZWYoKX1gKVxuICAgICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmNsb3NlZFxuICAgICAgdGhpcy5zb2NrZXQucmVtb3ZlKHRoaXMpXG4gICAgfSlcbiAgICB0aGlzLm9uRXJyb3IocmVhc29uID0+IHtcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGBlcnJvciAke3RoaXMudG9waWN9YCwgcmVhc29uKVxuICAgICAgaWYodGhpcy5pc0pvaW5pbmcoKSl7IHRoaXMuam9pblB1c2gucmVzZXQoKSB9XG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZFxuICAgICAgaWYodGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMucmVqb2luVGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgfVxuICAgIH0pXG4gICAgdGhpcy5qb2luUHVzaC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiB7XG4gICAgICBpZih0aGlzLnNvY2tldC5oYXNMb2dnZXIoKSkgdGhpcy5zb2NrZXQubG9nKFwiY2hhbm5lbFwiLCBgdGltZW91dCAke3RoaXMudG9waWN9ICgke3RoaXMuam9pblJlZigpfSlgLCB0aGlzLmpvaW5QdXNoLnRpbWVvdXQpXG4gICAgICBsZXQgbGVhdmVQdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMubGVhdmUsIGNsb3N1cmUoe30pLCB0aGlzLnRpbWVvdXQpXG4gICAgICBsZWF2ZVB1c2guc2VuZCgpXG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZFxuICAgICAgdGhpcy5qb2luUHVzaC5yZXNldCgpXG4gICAgICBpZih0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5yZWpvaW5UaW1lci5zY2hlZHVsZVRpbWVvdXQoKSB9XG4gICAgfSlcbiAgICB0aGlzLm9uKENIQU5ORUxfRVZFTlRTLnJlcGx5LCAocGF5bG9hZCwgcmVmKSA9PiB7XG4gICAgICB0aGlzLnRyaWdnZXIodGhpcy5yZXBseUV2ZW50TmFtZShyZWYpLCBwYXlsb2FkKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogSm9pbiB0aGUgY2hhbm5lbFxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHRpbWVvdXRcbiAgICogQHJldHVybnMge1B1c2h9XG4gICAqL1xuICBqb2luKHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpe1xuICAgIGlmKHRoaXMuam9pbmVkT25jZSl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cmllZCB0byBqb2luIG11bHRpcGxlIHRpbWVzLiAnam9pbicgY2FuIG9ubHkgYmUgY2FsbGVkIGEgc2luZ2xlIHRpbWUgcGVyIGNoYW5uZWwgaW5zdGFuY2VcIilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50aW1lb3V0ID0gdGltZW91dFxuICAgICAgdGhpcy5qb2luZWRPbmNlID0gdHJ1ZVxuICAgICAgdGhpcy5yZWpvaW4oKVxuICAgICAgcmV0dXJuIHRoaXMuam9pblB1c2hcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSG9vayBpbnRvIGNoYW5uZWwgY2xvc2VcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uQ2xvc2UoY2FsbGJhY2spe1xuICAgIHRoaXMub24oQ0hBTk5FTF9FVkVOVFMuY2xvc2UsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIEhvb2sgaW50byBjaGFubmVsIGVycm9yc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25FcnJvcihjYWxsYmFjayl7XG4gICAgcmV0dXJuIHRoaXMub24oQ0hBTk5FTF9FVkVOVFMuZXJyb3IsIHJlYXNvbiA9PiBjYWxsYmFjayhyZWFzb24pKVxuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgb24gY2hhbm5lbCBldmVudHNcbiAgICpcbiAgICogU3Vic2NyaXB0aW9uIHJldHVybnMgYSByZWYgY291bnRlciwgd2hpY2ggY2FuIGJlIHVzZWQgbGF0ZXIgdG9cbiAgICogdW5zdWJzY3JpYmUgdGhlIGV4YWN0IGV2ZW50IGxpc3RlbmVyXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNvbnN0IHJlZjEgPSBjaGFubmVsLm9uKFwiZXZlbnRcIiwgZG9fc3R1ZmYpXG4gICAqIGNvbnN0IHJlZjIgPSBjaGFubmVsLm9uKFwiZXZlbnRcIiwgZG9fb3RoZXJfc3R1ZmYpXG4gICAqIGNoYW5uZWwub2ZmKFwiZXZlbnRcIiwgcmVmMSlcbiAgICogLy8gU2luY2UgdW5zdWJzY3JpcHRpb24sIGRvX3N0dWZmIHdvbid0IGZpcmUsXG4gICAqIC8vIHdoaWxlIGRvX290aGVyX3N0dWZmIHdpbGwga2VlcCBmaXJpbmcgb24gdGhlIFwiZXZlbnRcIlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICogQHJldHVybnMge2ludGVnZXJ9IHJlZlxuICAgKi9cbiAgb24oZXZlbnQsIGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5iaW5kaW5nUmVmKytcbiAgICB0aGlzLmJpbmRpbmdzLnB1c2goe2V2ZW50LCByZWYsIGNhbGxiYWNrfSlcbiAgICByZXR1cm4gcmVmXG4gIH1cblxuICAvKipcbiAgICogVW5zdWJzY3JpYmVzIG9mZiBvZiBjaGFubmVsIGV2ZW50c1xuICAgKlxuICAgKiBVc2UgdGhlIHJlZiByZXR1cm5lZCBmcm9tIGEgY2hhbm5lbC5vbigpIHRvIHVuc3Vic2NyaWJlIG9uZVxuICAgKiBoYW5kbGVyLCBvciBwYXNzIG5vdGhpbmcgZm9yIHRoZSByZWYgdG8gdW5zdWJzY3JpYmUgYWxsXG4gICAqIGhhbmRsZXJzIGZvciB0aGUgZ2l2ZW4gZXZlbnQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIFVuc3Vic2NyaWJlIHRoZSBkb19zdHVmZiBoYW5kbGVyXG4gICAqIGNvbnN0IHJlZjEgPSBjaGFubmVsLm9uKFwiZXZlbnRcIiwgZG9fc3R1ZmYpXG4gICAqIGNoYW5uZWwub2ZmKFwiZXZlbnRcIiwgcmVmMSlcbiAgICpcbiAgICogLy8gVW5zdWJzY3JpYmUgYWxsIGhhbmRsZXJzIGZyb20gZXZlbnRcbiAgICogY2hhbm5lbC5vZmYoXCJldmVudFwiKVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSByZWZcbiAgICovXG4gIG9mZihldmVudCwgcmVmKXtcbiAgICB0aGlzLmJpbmRpbmdzID0gdGhpcy5iaW5kaW5ncy5maWx0ZXIoKGJpbmQpID0+IHtcbiAgICAgIHJldHVybiAhKGJpbmQuZXZlbnQgPT09IGV2ZW50ICYmICh0eXBlb2YgcmVmID09PSBcInVuZGVmaW5lZFwiIHx8IHJlZiA9PT0gYmluZC5yZWYpKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNhblB1c2goKXsgcmV0dXJuIHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkgJiYgdGhpcy5pc0pvaW5lZCgpIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIGBldmVudGAgdG8gcGhvZW5peCB3aXRoIHRoZSBwYXlsb2FkIGBwYXlsb2FkYC5cbiAgICogUGhvZW5peCByZWNlaXZlcyB0aGlzIGluIHRoZSBgaGFuZGxlX2luKGV2ZW50LCBwYXlsb2FkLCBzb2NrZXQpYFxuICAgKiBmdW5jdGlvbi4gaWYgcGhvZW5peCByZXBsaWVzIG9yIGl0IHRpbWVzIG91dCAoZGVmYXVsdCAxMDAwMG1zKSxcbiAgICogdGhlbiBvcHRpb25hbGx5IHRoZSByZXBseSBjYW4gYmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNoYW5uZWwucHVzaChcImV2ZW50XCIpXG4gICAqICAgLnJlY2VpdmUoXCJva1wiLCBwYXlsb2FkID0+IGNvbnNvbGUubG9nKFwicGhvZW5peCByZXBsaWVkOlwiLCBwYXlsb2FkKSlcbiAgICogICAucmVjZWl2ZShcImVycm9yXCIsIGVyciA9PiBjb25zb2xlLmxvZyhcInBob2VuaXggZXJyb3JlZFwiLCBlcnIpKVxuICAgKiAgIC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiBjb25zb2xlLmxvZyhcInRpbWVkIG91dCBwdXNoaW5nXCIpKVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lb3V0XVxuICAgKiBAcmV0dXJucyB7UHVzaH1cbiAgICovXG4gIHB1c2goZXZlbnQsIHBheWxvYWQsIHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpe1xuICAgIHBheWxvYWQgPSBwYXlsb2FkIHx8IHt9XG4gICAgaWYoIXRoaXMuam9pbmVkT25jZSl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHRyaWVkIHRvIHB1c2ggJyR7ZXZlbnR9JyB0byAnJHt0aGlzLnRvcGljfScgYmVmb3JlIGpvaW5pbmcuIFVzZSBjaGFubmVsLmpvaW4oKSBiZWZvcmUgcHVzaGluZyBldmVudHNgKVxuICAgIH1cbiAgICBsZXQgcHVzaEV2ZW50ID0gbmV3IFB1c2godGhpcywgZXZlbnQsIGZ1bmN0aW9uICgpeyByZXR1cm4gcGF5bG9hZCB9LCB0aW1lb3V0KVxuICAgIGlmKHRoaXMuY2FuUHVzaCgpKXtcbiAgICAgIHB1c2hFdmVudC5zZW5kKClcbiAgICB9IGVsc2Uge1xuICAgICAgcHVzaEV2ZW50LnN0YXJ0VGltZW91dCgpXG4gICAgICB0aGlzLnB1c2hCdWZmZXIucHVzaChwdXNoRXZlbnQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHB1c2hFdmVudFxuICB9XG5cbiAgLyoqIExlYXZlcyB0aGUgY2hhbm5lbFxuICAgKlxuICAgKiBVbnN1YnNjcmliZXMgZnJvbSBzZXJ2ZXIgZXZlbnRzLCBhbmRcbiAgICogaW5zdHJ1Y3RzIGNoYW5uZWwgdG8gdGVybWluYXRlIG9uIHNlcnZlclxuICAgKlxuICAgKiBUcmlnZ2VycyBvbkNsb3NlKCkgaG9va3NcbiAgICpcbiAgICogVG8gcmVjZWl2ZSBsZWF2ZSBhY2tub3dsZWRnZW1lbnRzLCB1c2UgdGhlIGByZWNlaXZlYFxuICAgKiBob29rIHRvIGJpbmQgdG8gdGhlIHNlcnZlciBhY2ssIGllOlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjaGFubmVsLmxlYXZlKCkucmVjZWl2ZShcIm9rXCIsICgpID0+IGFsZXJ0KFwibGVmdCFcIikgKVxuICAgKlxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHRpbWVvdXRcbiAgICogQHJldHVybnMge1B1c2h9XG4gICAqL1xuICBsZWF2ZSh0aW1lb3V0ID0gdGhpcy50aW1lb3V0KXtcbiAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KClcbiAgICB0aGlzLmpvaW5QdXNoLmNhbmNlbFRpbWVvdXQoKVxuXG4gICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmxlYXZpbmdcbiAgICBsZXQgb25DbG9zZSA9ICgpID0+IHtcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGBsZWF2ZSAke3RoaXMudG9waWN9YClcbiAgICAgIHRoaXMudHJpZ2dlcihDSEFOTkVMX0VWRU5UUy5jbG9zZSwgXCJsZWF2ZVwiKVxuICAgIH1cbiAgICBsZXQgbGVhdmVQdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMubGVhdmUsIGNsb3N1cmUoe30pLCB0aW1lb3V0KVxuICAgIGxlYXZlUHVzaC5yZWNlaXZlKFwib2tcIiwgKCkgPT4gb25DbG9zZSgpKVxuICAgICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsICgpID0+IG9uQ2xvc2UoKSlcbiAgICBsZWF2ZVB1c2guc2VuZCgpXG4gICAgaWYoIXRoaXMuY2FuUHVzaCgpKXsgbGVhdmVQdXNoLnRyaWdnZXIoXCJva1wiLCB7fSkgfVxuXG4gICAgcmV0dXJuIGxlYXZlUHVzaFxuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRhYmxlIG1lc3NhZ2UgaG9va1xuICAgKlxuICAgKiBSZWNlaXZlcyBhbGwgZXZlbnRzIGZvciBzcGVjaWFsaXplZCBtZXNzYWdlIGhhbmRsaW5nXG4gICAqIGJlZm9yZSBkaXNwYXRjaGluZyB0byB0aGUgY2hhbm5lbCBjYWxsYmFja3MuXG4gICAqXG4gICAqIE11c3QgcmV0dXJuIHRoZSBwYXlsb2FkLCBtb2RpZmllZCBvciB1bm1vZGlmaWVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZFxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHJlZlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgKi9cbiAgb25NZXNzYWdlKF9ldmVudCwgcGF5bG9hZCwgX3JlZil7IHJldHVybiBwYXlsb2FkIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzTWVtYmVyKHRvcGljLCBldmVudCwgcGF5bG9hZCwgam9pblJlZil7XG4gICAgaWYodGhpcy50b3BpYyAhPT0gdG9waWMpeyByZXR1cm4gZmFsc2UgfVxuXG4gICAgaWYoam9pblJlZiAmJiBqb2luUmVmICE9PSB0aGlzLmpvaW5SZWYoKSl7XG4gICAgICBpZih0aGlzLnNvY2tldC5oYXNMb2dnZXIoKSkgdGhpcy5zb2NrZXQubG9nKFwiY2hhbm5lbFwiLCBcImRyb3BwaW5nIG91dGRhdGVkIG1lc3NhZ2VcIiwge3RvcGljLCBldmVudCwgcGF5bG9hZCwgam9pblJlZn0pXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGpvaW5SZWYoKXsgcmV0dXJuIHRoaXMuam9pblB1c2gucmVmIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlam9pbih0aW1lb3V0ID0gdGhpcy50aW1lb3V0KXtcbiAgICBpZih0aGlzLmlzTGVhdmluZygpKXsgcmV0dXJuIH1cbiAgICB0aGlzLnNvY2tldC5sZWF2ZU9wZW5Ub3BpYyh0aGlzLnRvcGljKVxuICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5qb2luaW5nXG4gICAgdGhpcy5qb2luUHVzaC5yZXNlbmQodGltZW91dClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdHJpZ2dlcihldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luUmVmKXtcbiAgICBsZXQgaGFuZGxlZFBheWxvYWQgPSB0aGlzLm9uTWVzc2FnZShldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luUmVmKVxuICAgIGlmKHBheWxvYWQgJiYgIWhhbmRsZWRQYXlsb2FkKXsgdGhyb3cgbmV3IEVycm9yKFwiY2hhbm5lbCBvbk1lc3NhZ2UgY2FsbGJhY2tzIG11c3QgcmV0dXJuIHRoZSBwYXlsb2FkLCBtb2RpZmllZCBvciB1bm1vZGlmaWVkXCIpIH1cblxuICAgIGxldCBldmVudEJpbmRpbmdzID0gdGhpcy5iaW5kaW5ncy5maWx0ZXIoYmluZCA9PiBiaW5kLmV2ZW50ID09PSBldmVudClcblxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBldmVudEJpbmRpbmdzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGxldCBiaW5kID0gZXZlbnRCaW5kaW5nc1tpXVxuICAgICAgYmluZC5jYWxsYmFjayhoYW5kbGVkUGF5bG9hZCwgcmVmLCBqb2luUmVmIHx8IHRoaXMuam9pblJlZigpKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVwbHlFdmVudE5hbWUocmVmKXsgcmV0dXJuIGBjaGFuX3JlcGx5XyR7cmVmfWAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNDbG9zZWQoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmNsb3NlZCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0Vycm9yZWQoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmVycm9yZWQgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNKb2luZWQoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmpvaW5lZCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0pvaW5pbmcoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmpvaW5pbmcgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNMZWF2aW5nKCl7IHJldHVybiB0aGlzLnN0YXRlID09PSBDSEFOTkVMX1NUQVRFUy5sZWF2aW5nIH1cbn1cbiIsICJpbXBvcnQge1xuICBnbG9iYWwsXG4gIFhIUl9TVEFURVNcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWpheCB7XG5cbiAgc3RhdGljIHJlcXVlc3QobWV0aG9kLCBlbmRQb2ludCwgYWNjZXB0LCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKXtcbiAgICBpZihnbG9iYWwuWERvbWFpblJlcXVlc3Qpe1xuICAgICAgbGV0IHJlcSA9IG5ldyBnbG9iYWwuWERvbWFpblJlcXVlc3QoKSAvLyBJRTgsIElFOVxuICAgICAgcmV0dXJuIHRoaXMueGRvbWFpblJlcXVlc3QocmVxLCBtZXRob2QsIGVuZFBvaW50LCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgcmVxID0gbmV3IGdsb2JhbC5YTUxIdHRwUmVxdWVzdCgpIC8vIElFNyssIEZpcmVmb3gsIENocm9tZSwgT3BlcmEsIFNhZmFyaVxuICAgICAgcmV0dXJuIHRoaXMueGhyUmVxdWVzdChyZXEsIG1ldGhvZCwgZW5kUG9pbnQsIGFjY2VwdCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjaylcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgeGRvbWFpblJlcXVlc3QocmVxLCBtZXRob2QsIGVuZFBvaW50LCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKXtcbiAgICByZXEudGltZW91dCA9IHRpbWVvdXRcbiAgICByZXEub3BlbihtZXRob2QsIGVuZFBvaW50KVxuICAgIHJlcS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICBsZXQgcmVzcG9uc2UgPSB0aGlzLnBhcnNlSlNPTihyZXEucmVzcG9uc2VUZXh0KVxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2socmVzcG9uc2UpXG4gICAgfVxuICAgIGlmKG9udGltZW91dCl7IHJlcS5vbnRpbWVvdXQgPSBvbnRpbWVvdXQgfVxuXG4gICAgLy8gV29yayBhcm91bmQgYnVnIGluIElFOSB0aGF0IHJlcXVpcmVzIGFuIGF0dGFjaGVkIG9ucHJvZ3Jlc3MgaGFuZGxlclxuICAgIHJlcS5vbnByb2dyZXNzID0gKCkgPT4geyB9XG5cbiAgICByZXEuc2VuZChib2R5KVxuICAgIHJldHVybiByZXFcbiAgfVxuXG4gIHN0YXRpYyB4aHJSZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYWNjZXB0LCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKXtcbiAgICByZXEub3BlbihtZXRob2QsIGVuZFBvaW50LCB0cnVlKVxuICAgIHJlcS50aW1lb3V0ID0gdGltZW91dFxuICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIGFjY2VwdClcbiAgICByZXEub25lcnJvciA9ICgpID0+IGNhbGxiYWNrICYmIGNhbGxiYWNrKG51bGwpXG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmKHJlcS5yZWFkeVN0YXRlID09PSBYSFJfU1RBVEVTLmNvbXBsZXRlICYmIGNhbGxiYWNrKXtcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gdGhpcy5wYXJzZUpTT04ocmVxLnJlc3BvbnNlVGV4dClcbiAgICAgICAgY2FsbGJhY2socmVzcG9uc2UpXG4gICAgICB9XG4gICAgfVxuICAgIGlmKG9udGltZW91dCl7IHJlcS5vbnRpbWVvdXQgPSBvbnRpbWVvdXQgfVxuXG4gICAgcmVxLnNlbmQoYm9keSlcbiAgICByZXR1cm4gcmVxXG4gIH1cblxuICBzdGF0aWMgcGFyc2VKU09OKHJlc3Ape1xuICAgIGlmKCFyZXNwIHx8IHJlc3AgPT09IFwiXCIpeyByZXR1cm4gbnVsbCB9XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmVzcClcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgIGNvbnNvbGUgJiYgY29uc29sZS5sb2coXCJmYWlsZWQgdG8gcGFyc2UgSlNPTiByZXNwb25zZVwiLCByZXNwKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgc2VyaWFsaXplKG9iaiwgcGFyZW50S2V5KXtcbiAgICBsZXQgcXVlcnlTdHIgPSBbXVxuICAgIGZvcih2YXIga2V5IGluIG9iail7XG4gICAgICBpZighT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSl7IGNvbnRpbnVlIH1cbiAgICAgIGxldCBwYXJhbUtleSA9IHBhcmVudEtleSA/IGAke3BhcmVudEtleX1bJHtrZXl9XWAgOiBrZXlcbiAgICAgIGxldCBwYXJhbVZhbCA9IG9ialtrZXldXG4gICAgICBpZih0eXBlb2YgcGFyYW1WYWwgPT09IFwib2JqZWN0XCIpe1xuICAgICAgICBxdWVyeVN0ci5wdXNoKHRoaXMuc2VyaWFsaXplKHBhcmFtVmFsLCBwYXJhbUtleSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBxdWVyeVN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChwYXJhbUtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbVZhbCkpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBxdWVyeVN0ci5qb2luKFwiJlwiKVxuICB9XG5cbiAgc3RhdGljIGFwcGVuZFBhcmFtcyh1cmwsIHBhcmFtcyl7XG4gICAgaWYoT2JqZWN0LmtleXMocGFyYW1zKS5sZW5ndGggPT09IDApeyByZXR1cm4gdXJsIH1cblxuICAgIGxldCBwcmVmaXggPSB1cmwubWF0Y2goL1xcPy8pID8gXCImXCIgOiBcIj9cIlxuICAgIHJldHVybiBgJHt1cmx9JHtwcmVmaXh9JHt0aGlzLnNlcmlhbGl6ZShwYXJhbXMpfWBcbiAgfVxufVxuIiwgImltcG9ydCB7XG4gIFNPQ0tFVF9TVEFURVMsXG4gIFRSQU5TUE9SVFMsXG4gIE1BWF9MT05HUE9MTF9CQVRDSF9TSVpFXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCBBamF4IGZyb20gXCIuL2FqYXhcIlxuXG5sZXQgYXJyYXlCdWZmZXJUb0Jhc2U2NCA9IChidWZmZXIpID0+IHtcbiAgbGV0IGJpbmFyeSA9IFwiXCJcbiAgbGV0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKVxuICBsZXQgbGVuID0gYnl0ZXMuYnl0ZUxlbmd0aFxuICBmb3IobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspeyBiaW5hcnkgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSkgfVxuICByZXR1cm4gYnRvYShiaW5hcnkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvbmdQb2xsIHtcblxuICBjb25zdHJ1Y3RvcihlbmRQb2ludCl7XG4gICAgdGhpcy5lbmRQb2ludCA9IG51bGxcbiAgICB0aGlzLnRva2VuID0gbnVsbFxuICAgIHRoaXMuc2tpcEhlYXJ0YmVhdCA9IHRydWVcbiAgICB0aGlzLnJlcXMgPSBuZXcgU2V0KClcbiAgICB0aGlzLmF3YWl0aW5nQmF0Y2hBY2sgPSBmYWxzZVxuICAgIHRoaXMuY3VycmVudEJhdGNoID0gbnVsbFxuICAgIHRoaXMuY3VycmVudEJhdGNoVGltZXIgPSBudWxsXG4gICAgdGhpcy5iYXRjaEJ1ZmZlciA9IFtdXG4gICAgdGhpcy5vbm9wZW4gPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgdGhpcy5vbmVycm9yID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgIHRoaXMub25tZXNzYWdlID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgIHRoaXMub25jbG9zZSA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICB0aGlzLnBvbGxFbmRwb2ludCA9IHRoaXMubm9ybWFsaXplRW5kcG9pbnQoZW5kUG9pbnQpXG4gICAgdGhpcy5yZWFkeVN0YXRlID0gU09DS0VUX1NUQVRFUy5jb25uZWN0aW5nXG4gICAgLy8gd2UgbXVzdCB3YWl0IGZvciB0aGUgY2FsbGVyIHRvIGZpbmlzaCBzZXR0aW5nIHVwIG91ciBjYWxsYmFja3MgYW5kIHRpbWVvdXQgcHJvcGVydGllc1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5wb2xsKCksIDApXG4gIH1cblxuICBub3JtYWxpemVFbmRwb2ludChlbmRQb2ludCl7XG4gICAgcmV0dXJuIChlbmRQb2ludFxuICAgICAgLnJlcGxhY2UoXCJ3czovL1wiLCBcImh0dHA6Ly9cIilcbiAgICAgIC5yZXBsYWNlKFwid3NzOi8vXCIsIFwiaHR0cHM6Ly9cIilcbiAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoLiopXFwvXCIgKyBUUkFOU1BPUlRTLndlYnNvY2tldCksIFwiJDEvXCIgKyBUUkFOU1BPUlRTLmxvbmdwb2xsKSlcbiAgfVxuXG4gIGVuZHBvaW50VVJMKCl7XG4gICAgcmV0dXJuIEFqYXguYXBwZW5kUGFyYW1zKHRoaXMucG9sbEVuZHBvaW50LCB7dG9rZW46IHRoaXMudG9rZW59KVxuICB9XG5cbiAgY2xvc2VBbmRSZXRyeShjb2RlLCByZWFzb24sIHdhc0NsZWFuKXtcbiAgICB0aGlzLmNsb3NlKGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pXG4gICAgdGhpcy5yZWFkeVN0YXRlID0gU09DS0VUX1NUQVRFUy5jb25uZWN0aW5nXG4gIH1cblxuICBvbnRpbWVvdXQoKXtcbiAgICB0aGlzLm9uZXJyb3IoXCJ0aW1lb3V0XCIpXG4gICAgdGhpcy5jbG9zZUFuZFJldHJ5KDEwMDUsIFwidGltZW91dFwiLCBmYWxzZSlcbiAgfVxuXG4gIGlzQWN0aXZlKCl7IHJldHVybiB0aGlzLnJlYWR5U3RhdGUgPT09IFNPQ0tFVF9TVEFURVMub3BlbiB8fCB0aGlzLnJlYWR5U3RhdGUgPT09IFNPQ0tFVF9TVEFURVMuY29ubmVjdGluZyB9XG5cbiAgcG9sbCgpe1xuICAgIHRoaXMuYWpheChcIkdFVFwiLCBcImFwcGxpY2F0aW9uL2pzb25cIiwgbnVsbCwgKCkgPT4gdGhpcy5vbnRpbWVvdXQoKSwgcmVzcCA9PiB7XG4gICAgICBpZihyZXNwKXtcbiAgICAgICAgdmFyIHtzdGF0dXMsIHRva2VuLCBtZXNzYWdlc30gPSByZXNwXG4gICAgICAgIHRoaXMudG9rZW4gPSB0b2tlblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdHVzID0gMFxuICAgICAgfVxuXG4gICAgICBzd2l0Y2goc3RhdHVzKXtcbiAgICAgICAgY2FzZSAyMDA6XG4gICAgICAgICAgbWVzc2FnZXMuZm9yRWFjaChtc2cgPT4ge1xuICAgICAgICAgICAgLy8gVGFza3MgYXJlIHdoYXQgdGhpbmdzIGxpa2UgZXZlbnQgaGFuZGxlcnMsIHNldFRpbWVvdXQgY2FsbGJhY2tzLFxuICAgICAgICAgICAgLy8gcHJvbWlzZSByZXNvbHZlcyBhbmQgbW9yZSBhcmUgcnVuIHdpdGhpbi5cbiAgICAgICAgICAgIC8vIEluIG1vZGVybiBicm93c2VycywgdGhlcmUgYXJlIHR3byBkaWZmZXJlbnQga2luZHMgb2YgdGFza3MsXG4gICAgICAgICAgICAvLyBtaWNyb3Rhc2tzIGFuZCBtYWNyb3Rhc2tzLlxuICAgICAgICAgICAgLy8gTWljcm90YXNrcyBhcmUgbWFpbmx5IHVzZWQgZm9yIFByb21pc2VzLCB3aGlsZSBtYWNyb3Rhc2tzIGFyZVxuICAgICAgICAgICAgLy8gdXNlZCBmb3IgZXZlcnl0aGluZyBlbHNlLlxuICAgICAgICAgICAgLy8gTWljcm90YXNrcyBhbHdheXMgaGF2ZSBwcmlvcml0eSBvdmVyIG1hY3JvdGFza3MuIElmIHRoZSBKUyBlbmdpbmVcbiAgICAgICAgICAgIC8vIGlzIGxvb2tpbmcgZm9yIGEgdGFzayB0byBydW4sIGl0IHdpbGwgYWx3YXlzIHRyeSB0byBlbXB0eSB0aGVcbiAgICAgICAgICAgIC8vIG1pY3JvdGFzayBxdWV1ZSBiZWZvcmUgYXR0ZW1wdGluZyB0byBydW4gYW55dGhpbmcgZnJvbSB0aGVcbiAgICAgICAgICAgIC8vIG1hY3JvdGFzayBxdWV1ZS5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBGb3IgdGhlIFdlYlNvY2tldCB0cmFuc3BvcnQsIG1lc3NhZ2VzIGFsd2F5cyBhcnJpdmUgaW4gdGhlaXIgb3duXG4gICAgICAgICAgICAvLyBldmVudC4gVGhpcyBtZWFucyB0aGF0IGlmIGFueSBwcm9taXNlcyBhcmUgcmVzb2x2ZWQgZnJvbSB3aXRoaW4sXG4gICAgICAgICAgICAvLyB0aGVpciBjYWxsYmFja3Mgd2lsbCBhbHdheXMgZmluaXNoIGV4ZWN1dGlvbiBieSB0aGUgdGltZSB0aGVcbiAgICAgICAgICAgIC8vIG5leHQgbWVzc2FnZSBldmVudCBoYW5kbGVyIGlzIHJ1bi5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBJbiBvcmRlciB0byBlbXVsYXRlIHRoaXMgYmVoYXZpb3VyLCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSBlYWNoXG4gICAgICAgICAgICAvLyBvbm1lc3NhZ2UgaGFuZGxlciBpcyBydW4gd2l0aGluIGl0cyBvd24gbWFjcm90YXNrLlxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLm9ubWVzc2FnZSh7ZGF0YTogbXNnfSksIDApXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLnBvbGwoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjA0OlxuICAgICAgICAgIHRoaXMucG9sbCgpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0MTA6XG4gICAgICAgICAgdGhpcy5yZWFkeVN0YXRlID0gU09DS0VUX1NUQVRFUy5vcGVuXG4gICAgICAgICAgdGhpcy5vbm9wZW4oe30pXG4gICAgICAgICAgdGhpcy5wb2xsKClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQwMzpcbiAgICAgICAgICB0aGlzLm9uZXJyb3IoNDAzKVxuICAgICAgICAgIHRoaXMuY2xvc2UoMTAwOCwgXCJmb3JiaWRkZW5cIiwgZmFsc2UpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICBjYXNlIDUwMDpcbiAgICAgICAgICB0aGlzLm9uZXJyb3IoNTAwKVxuICAgICAgICAgIHRoaXMuY2xvc2VBbmRSZXRyeSgxMDExLCBcImludGVybmFsIHNlcnZlciBlcnJvclwiLCA1MDApXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKGB1bmhhbmRsZWQgcG9sbCBzdGF0dXMgJHtzdGF0dXN9YClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy8gd2UgY29sbGVjdCBhbGwgcHVzaGVzIHdpdGhpbiB0aGUgY3VycmVudCBldmVudCBsb29wIGJ5XG4gIC8vIHNldFRpbWVvdXQgMCwgd2hpY2ggb3B0aW1pemVzIGJhY2stdG8tYmFjayBwcm9jZWR1cmFsXG4gIC8vIHB1c2hlcyBhZ2FpbnN0IGFuIGVtcHR5IGJ1ZmZlclxuXG4gIHNlbmQoYm9keSl7XG4gICAgaWYodHlwZW9mKGJvZHkpICE9PSBcInN0cmluZ1wiKXsgYm9keSA9IGFycmF5QnVmZmVyVG9CYXNlNjQoYm9keSkgfVxuICAgIGlmKHRoaXMuY3VycmVudEJhdGNoKXtcbiAgICAgIHRoaXMuY3VycmVudEJhdGNoLnB1c2goYm9keSlcbiAgICB9IGVsc2UgaWYodGhpcy5hd2FpdGluZ0JhdGNoQWNrKXtcbiAgICAgIHRoaXMuYmF0Y2hCdWZmZXIucHVzaChib2R5KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRCYXRjaCA9IFtib2R5XVxuICAgICAgdGhpcy5jdXJyZW50QmF0Y2hUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmJhdGNoU2VuZCh0aGlzLmN1cnJlbnRCYXRjaClcbiAgICAgICAgdGhpcy5jdXJyZW50QmF0Y2ggPSBudWxsXG4gICAgICB9LCAwKVxuICAgIH1cbiAgfVxuXG4gIGJhdGNoU2VuZChtZXNzYWdlcywgb2Zmc2V0ID0gMCl7XG4gICAgdGhpcy5hd2FpdGluZ0JhdGNoQWNrID0gdHJ1ZVxuICAgIGNvbnN0IG5leHQgPSBvZmZzZXQgKyBNQVhfTE9OR1BPTExfQkFUQ0hfU0laRVxuICAgIGNvbnN0IGJhdGNoID0gbWVzc2FnZXMuc2xpY2Uob2Zmc2V0LCBuZXh0KVxuICAgIHRoaXMuYWpheChcIlBPU1RcIiwgXCJhcHBsaWNhdGlvbi94LW5kanNvblwiLCBiYXRjaC5qb2luKFwiXFxuXCIpLCAoKSA9PiB0aGlzLm9uZXJyb3IoXCJ0aW1lb3V0XCIpLCByZXNwID0+IHtcbiAgICAgIGlmKCFyZXNwIHx8IHJlc3Auc3RhdHVzICE9PSAyMDApe1xuICAgICAgICB0aGlzLmF3YWl0aW5nQmF0Y2hBY2sgPSBmYWxzZVxuICAgICAgICB0aGlzLm9uZXJyb3IocmVzcCAmJiByZXNwLnN0YXR1cylcbiAgICAgICAgdGhpcy5jbG9zZUFuZFJldHJ5KDEwMTEsIFwiaW50ZXJuYWwgc2VydmVyIGVycm9yXCIsIGZhbHNlKVxuICAgICAgfSBlbHNlIGlmKG5leHQgPCBtZXNzYWdlcy5sZW5ndGgpe1xuICAgICAgICB0aGlzLmJhdGNoU2VuZChtZXNzYWdlcywgbmV4dClcbiAgICAgIH0gZWxzZSBpZih0aGlzLmJhdGNoQnVmZmVyLmxlbmd0aCA+IDApe1xuICAgICAgICB0aGlzLmJhdGNoU2VuZCh0aGlzLmJhdGNoQnVmZmVyKVxuICAgICAgICB0aGlzLmJhdGNoQnVmZmVyID0gW11cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYXdhaXRpbmdCYXRjaEFjayA9IGZhbHNlXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGNsb3NlKGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pe1xuICAgIGZvcihsZXQgcmVxIG9mIHRoaXMucmVxcyl7IHJlcS5hYm9ydCgpIH1cbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLmNsb3NlZFxuICAgIGxldCBvcHRzID0gT2JqZWN0LmFzc2lnbih7Y29kZTogMTAwMCwgcmVhc29uOiB1bmRlZmluZWQsIHdhc0NsZWFuOiB0cnVlfSwge2NvZGUsIHJlYXNvbiwgd2FzQ2xlYW59KVxuICAgIHRoaXMuYmF0Y2hCdWZmZXIgPSBbXVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmN1cnJlbnRCYXRjaFRpbWVyKVxuICAgIHRoaXMuY3VycmVudEJhdGNoVGltZXIgPSBudWxsXG4gICAgaWYodHlwZW9mKENsb3NlRXZlbnQpICE9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgIHRoaXMub25jbG9zZShuZXcgQ2xvc2VFdmVudChcImNsb3NlXCIsIG9wdHMpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uY2xvc2Uob3B0cylcbiAgICB9XG4gIH1cblxuICBhamF4KG1ldGhvZCwgY29udGVudFR5cGUsIGJvZHksIG9uQ2FsbGVyVGltZW91dCwgY2FsbGJhY2spe1xuICAgIGxldCByZXFcbiAgICBsZXQgb250aW1lb3V0ID0gKCkgPT4ge1xuICAgICAgdGhpcy5yZXFzLmRlbGV0ZShyZXEpXG4gICAgICBvbkNhbGxlclRpbWVvdXQoKVxuICAgIH1cbiAgICByZXEgPSBBamF4LnJlcXVlc3QobWV0aG9kLCB0aGlzLmVuZHBvaW50VVJMKCksIGNvbnRlbnRUeXBlLCBib2R5LCB0aGlzLnRpbWVvdXQsIG9udGltZW91dCwgcmVzcCA9PiB7XG4gICAgICB0aGlzLnJlcXMuZGVsZXRlKHJlcSlcbiAgICAgIGlmKHRoaXMuaXNBY3RpdmUoKSl7IGNhbGxiYWNrKHJlc3ApIH1cbiAgICB9KVxuICAgIHRoaXMucmVxcy5hZGQocmVxKVxuICB9XG59XG4iLCAiLyoqXG4gKiBJbml0aWFsaXplcyB0aGUgUHJlc2VuY2VcbiAqIEBwYXJhbSB7Q2hhbm5lbH0gY2hhbm5lbCAtIFRoZSBDaGFubmVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyAtIFRoZSBvcHRpb25zLFxuICogICAgICAgIGZvciBleGFtcGxlIGB7ZXZlbnRzOiB7c3RhdGU6IFwic3RhdGVcIiwgZGlmZjogXCJkaWZmXCJ9fWBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlc2VuY2Uge1xuXG4gIGNvbnN0cnVjdG9yKGNoYW5uZWwsIG9wdHMgPSB7fSl7XG4gICAgbGV0IGV2ZW50cyA9IG9wdHMuZXZlbnRzIHx8IHtzdGF0ZTogXCJwcmVzZW5jZV9zdGF0ZVwiLCBkaWZmOiBcInByZXNlbmNlX2RpZmZcIn1cbiAgICB0aGlzLnN0YXRlID0ge31cbiAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbFxuICAgIHRoaXMuam9pblJlZiA9IG51bGxcbiAgICB0aGlzLmNhbGxlciA9IHtcbiAgICAgIG9uSm9pbjogZnVuY3Rpb24gKCl7IH0sXG4gICAgICBvbkxlYXZlOiBmdW5jdGlvbiAoKXsgfSxcbiAgICAgIG9uU3luYzogZnVuY3Rpb24gKCl7IH1cbiAgICB9XG5cbiAgICB0aGlzLmNoYW5uZWwub24oZXZlbnRzLnN0YXRlLCBuZXdTdGF0ZSA9PiB7XG4gICAgICBsZXQge29uSm9pbiwgb25MZWF2ZSwgb25TeW5jfSA9IHRoaXMuY2FsbGVyXG5cbiAgICAgIHRoaXMuam9pblJlZiA9IHRoaXMuY2hhbm5lbC5qb2luUmVmKClcbiAgICAgIHRoaXMuc3RhdGUgPSBQcmVzZW5jZS5zeW5jU3RhdGUodGhpcy5zdGF0ZSwgbmV3U3RhdGUsIG9uSm9pbiwgb25MZWF2ZSlcblxuICAgICAgdGhpcy5wZW5kaW5nRGlmZnMuZm9yRWFjaChkaWZmID0+IHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFByZXNlbmNlLnN5bmNEaWZmKHRoaXMuc3RhdGUsIGRpZmYsIG9uSm9pbiwgb25MZWF2ZSlcbiAgICAgIH0pXG4gICAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gICAgICBvblN5bmMoKVxuICAgIH0pXG5cbiAgICB0aGlzLmNoYW5uZWwub24oZXZlbnRzLmRpZmYsIGRpZmYgPT4ge1xuICAgICAgbGV0IHtvbkpvaW4sIG9uTGVhdmUsIG9uU3luY30gPSB0aGlzLmNhbGxlclxuXG4gICAgICBpZih0aGlzLmluUGVuZGluZ1N5bmNTdGF0ZSgpKXtcbiAgICAgICAgdGhpcy5wZW5kaW5nRGlmZnMucHVzaChkaWZmKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFByZXNlbmNlLnN5bmNEaWZmKHRoaXMuc3RhdGUsIGRpZmYsIG9uSm9pbiwgb25MZWF2ZSlcbiAgICAgICAgb25TeW5jKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgb25Kb2luKGNhbGxiYWNrKXsgdGhpcy5jYWxsZXIub25Kb2luID0gY2FsbGJhY2sgfVxuXG4gIG9uTGVhdmUoY2FsbGJhY2speyB0aGlzLmNhbGxlci5vbkxlYXZlID0gY2FsbGJhY2sgfVxuXG4gIG9uU3luYyhjYWxsYmFjayl7IHRoaXMuY2FsbGVyLm9uU3luYyA9IGNhbGxiYWNrIH1cblxuICBsaXN0KGJ5KXsgcmV0dXJuIFByZXNlbmNlLmxpc3QodGhpcy5zdGF0ZSwgYnkpIH1cblxuICBpblBlbmRpbmdTeW5jU3RhdGUoKXtcbiAgICByZXR1cm4gIXRoaXMuam9pblJlZiB8fCAodGhpcy5qb2luUmVmICE9PSB0aGlzLmNoYW5uZWwuam9pblJlZigpKVxuICB9XG5cbiAgLy8gbG93ZXItbGV2ZWwgcHVibGljIHN0YXRpYyBBUElcblxuICAvKipcbiAgICogVXNlZCB0byBzeW5jIHRoZSBsaXN0IG9mIHByZXNlbmNlcyBvbiB0aGUgc2VydmVyXG4gICAqIHdpdGggdGhlIGNsaWVudCdzIHN0YXRlLiBBbiBvcHRpb25hbCBgb25Kb2luYCBhbmQgYG9uTGVhdmVgIGNhbGxiYWNrIGNhblxuICAgKiBiZSBwcm92aWRlZCB0byByZWFjdCB0byBjaGFuZ2VzIGluIHRoZSBjbGllbnQncyBsb2NhbCBwcmVzZW5jZXMgYWNyb3NzXG4gICAqIGRpc2Nvbm5lY3RzIGFuZCByZWNvbm5lY3RzIHdpdGggdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1ByZXNlbmNlfVxuICAgKi9cbiAgc3RhdGljIHN5bmNTdGF0ZShjdXJyZW50U3RhdGUsIG5ld1N0YXRlLCBvbkpvaW4sIG9uTGVhdmUpe1xuICAgIGxldCBzdGF0ZSA9IHRoaXMuY2xvbmUoY3VycmVudFN0YXRlKVxuICAgIGxldCBqb2lucyA9IHt9XG4gICAgbGV0IGxlYXZlcyA9IHt9XG5cbiAgICB0aGlzLm1hcChzdGF0ZSwgKGtleSwgcHJlc2VuY2UpID0+IHtcbiAgICAgIGlmKCFuZXdTdGF0ZVtrZXldKXtcbiAgICAgICAgbGVhdmVzW2tleV0gPSBwcmVzZW5jZVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5tYXAobmV3U3RhdGUsIChrZXksIG5ld1ByZXNlbmNlKSA9PiB7XG4gICAgICBsZXQgY3VycmVudFByZXNlbmNlID0gc3RhdGVba2V5XVxuICAgICAgaWYoY3VycmVudFByZXNlbmNlKXtcbiAgICAgICAgbGV0IG5ld1JlZnMgPSBuZXdQcmVzZW5jZS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICAgIGxldCBjdXJSZWZzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLm1hcChtID0+IG0ucGh4X3JlZilcbiAgICAgICAgbGV0IGpvaW5lZE1ldGFzID0gbmV3UHJlc2VuY2UubWV0YXMuZmlsdGVyKG0gPT4gY3VyUmVmcy5pbmRleE9mKG0ucGh4X3JlZikgPCAwKVxuICAgICAgICBsZXQgbGVmdE1ldGFzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLmZpbHRlcihtID0+IG5ld1JlZnMuaW5kZXhPZihtLnBoeF9yZWYpIDwgMClcbiAgICAgICAgaWYoam9pbmVkTWV0YXMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgam9pbnNba2V5XSA9IG5ld1ByZXNlbmNlXG4gICAgICAgICAgam9pbnNba2V5XS5tZXRhcyA9IGpvaW5lZE1ldGFzXG4gICAgICAgIH1cbiAgICAgICAgaWYobGVmdE1ldGFzLmxlbmd0aCA+IDApe1xuICAgICAgICAgIGxlYXZlc1trZXldID0gdGhpcy5jbG9uZShjdXJyZW50UHJlc2VuY2UpXG4gICAgICAgICAgbGVhdmVzW2tleV0ubWV0YXMgPSBsZWZ0TWV0YXNcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgam9pbnNba2V5XSA9IG5ld1ByZXNlbmNlXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdGhpcy5zeW5jRGlmZihzdGF0ZSwge2pvaW5zOiBqb2lucywgbGVhdmVzOiBsZWF2ZXN9LCBvbkpvaW4sIG9uTGVhdmUpXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogVXNlZCB0byBzeW5jIGEgZGlmZiBvZiBwcmVzZW5jZSBqb2luIGFuZCBsZWF2ZVxuICAgKiBldmVudHMgZnJvbSB0aGUgc2VydmVyLCBhcyB0aGV5IGhhcHBlbi4gTGlrZSBgc3luY1N0YXRlYCwgYHN5bmNEaWZmYFxuICAgKiBhY2NlcHRzIG9wdGlvbmFsIGBvbkpvaW5gIGFuZCBgb25MZWF2ZWAgY2FsbGJhY2tzIHRvIHJlYWN0IHRvIGEgdXNlclxuICAgKiBqb2luaW5nIG9yIGxlYXZpbmcgZnJvbSBhIGRldmljZS5cbiAgICpcbiAgICogQHJldHVybnMge1ByZXNlbmNlfVxuICAgKi9cbiAgc3RhdGljIHN5bmNEaWZmKHN0YXRlLCBkaWZmLCBvbkpvaW4sIG9uTGVhdmUpe1xuICAgIGxldCB7am9pbnMsIGxlYXZlc30gPSB0aGlzLmNsb25lKGRpZmYpXG4gICAgaWYoIW9uSm9pbil7IG9uSm9pbiA9IGZ1bmN0aW9uICgpeyB9IH1cbiAgICBpZighb25MZWF2ZSl7IG9uTGVhdmUgPSBmdW5jdGlvbiAoKXsgfSB9XG5cbiAgICB0aGlzLm1hcChqb2lucywgKGtleSwgbmV3UHJlc2VuY2UpID0+IHtcbiAgICAgIGxldCBjdXJyZW50UHJlc2VuY2UgPSBzdGF0ZVtrZXldXG4gICAgICBzdGF0ZVtrZXldID0gdGhpcy5jbG9uZShuZXdQcmVzZW5jZSlcbiAgICAgIGlmKGN1cnJlbnRQcmVzZW5jZSl7XG4gICAgICAgIGxldCBqb2luZWRSZWZzID0gc3RhdGVba2V5XS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICAgIGxldCBjdXJNZXRhcyA9IGN1cnJlbnRQcmVzZW5jZS5tZXRhcy5maWx0ZXIobSA9PiBqb2luZWRSZWZzLmluZGV4T2YobS5waHhfcmVmKSA8IDApXG4gICAgICAgIHN0YXRlW2tleV0ubWV0YXMudW5zaGlmdCguLi5jdXJNZXRhcylcbiAgICAgIH1cbiAgICAgIG9uSm9pbihrZXksIGN1cnJlbnRQcmVzZW5jZSwgbmV3UHJlc2VuY2UpXG4gICAgfSlcbiAgICB0aGlzLm1hcChsZWF2ZXMsIChrZXksIGxlZnRQcmVzZW5jZSkgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRQcmVzZW5jZSA9IHN0YXRlW2tleV1cbiAgICAgIGlmKCFjdXJyZW50UHJlc2VuY2UpeyByZXR1cm4gfVxuICAgICAgbGV0IHJlZnNUb1JlbW92ZSA9IGxlZnRQcmVzZW5jZS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICBjdXJyZW50UHJlc2VuY2UubWV0YXMgPSBjdXJyZW50UHJlc2VuY2UubWV0YXMuZmlsdGVyKHAgPT4ge1xuICAgICAgICByZXR1cm4gcmVmc1RvUmVtb3ZlLmluZGV4T2YocC5waHhfcmVmKSA8IDBcbiAgICAgIH0pXG4gICAgICBvbkxlYXZlKGtleSwgY3VycmVudFByZXNlbmNlLCBsZWZ0UHJlc2VuY2UpXG4gICAgICBpZihjdXJyZW50UHJlc2VuY2UubWV0YXMubGVuZ3RoID09PSAwKXtcbiAgICAgICAgZGVsZXRlIHN0YXRlW2tleV1cbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBzdGF0ZVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGFycmF5IG9mIHByZXNlbmNlcywgd2l0aCBzZWxlY3RlZCBtZXRhZGF0YS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHByZXNlbmNlc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjaG9vc2VyXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcmVzZW5jZX1cbiAgICovXG4gIHN0YXRpYyBsaXN0KHByZXNlbmNlcywgY2hvb3Nlcil7XG4gICAgaWYoIWNob29zZXIpeyBjaG9vc2VyID0gZnVuY3Rpb24gKGtleSwgcHJlcyl7IHJldHVybiBwcmVzIH0gfVxuXG4gICAgcmV0dXJuIHRoaXMubWFwKHByZXNlbmNlcywgKGtleSwgcHJlc2VuY2UpID0+IHtcbiAgICAgIHJldHVybiBjaG9vc2VyKGtleSwgcHJlc2VuY2UpXG4gICAgfSlcbiAgfVxuXG4gIC8vIHByaXZhdGVcblxuICBzdGF0aWMgbWFwKG9iaiwgZnVuYyl7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikubWFwKGtleSA9PiBmdW5jKGtleSwgb2JqW2tleV0pKVxuICB9XG5cbiAgc3RhdGljIGNsb25lKG9iail7IHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpIH1cbn1cbiIsICIvKiBUaGUgZGVmYXVsdCBzZXJpYWxpemVyIGZvciBlbmNvZGluZyBhbmQgZGVjb2RpbmcgbWVzc2FnZXMgKi9cbmltcG9ydCB7XG4gIENIQU5ORUxfRVZFTlRTXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgSEVBREVSX0xFTkdUSDogMSxcbiAgTUVUQV9MRU5HVEg6IDQsXG4gIEtJTkRTOiB7cHVzaDogMCwgcmVwbHk6IDEsIGJyb2FkY2FzdDogMn0sXG5cbiAgZW5jb2RlKG1zZywgY2FsbGJhY2spe1xuICAgIGlmKG1zZy5wYXlsb2FkLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcil7XG4gICAgICByZXR1cm4gY2FsbGJhY2sodGhpcy5iaW5hcnlFbmNvZGUobXNnKSlcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHBheWxvYWQgPSBbbXNnLmpvaW5fcmVmLCBtc2cucmVmLCBtc2cudG9waWMsIG1zZy5ldmVudCwgbXNnLnBheWxvYWRdXG4gICAgICByZXR1cm4gY2FsbGJhY2soSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gICAgfVxuICB9LFxuXG4gIGRlY29kZShyYXdQYXlsb2FkLCBjYWxsYmFjayl7XG4gICAgaWYocmF3UGF5bG9hZC5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpe1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHRoaXMuYmluYXJ5RGVjb2RlKHJhd1BheWxvYWQpKVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgW2pvaW5fcmVmLCByZWYsIHRvcGljLCBldmVudCwgcGF5bG9hZF0gPSBKU09OLnBhcnNlKHJhd1BheWxvYWQpXG4gICAgICByZXR1cm4gY2FsbGJhY2soe2pvaW5fcmVmLCByZWYsIHRvcGljLCBldmVudCwgcGF5bG9hZH0pXG4gICAgfVxuICB9LFxuXG4gIC8vIHByaXZhdGVcblxuICBiaW5hcnlFbmNvZGUobWVzc2FnZSl7XG4gICAgbGV0IHtqb2luX3JlZiwgcmVmLCBldmVudCwgdG9waWMsIHBheWxvYWR9ID0gbWVzc2FnZVxuICAgIGxldCBtZXRhTGVuZ3RoID0gdGhpcy5NRVRBX0xFTkdUSCArIGpvaW5fcmVmLmxlbmd0aCArIHJlZi5sZW5ndGggKyB0b3BpYy5sZW5ndGggKyBldmVudC5sZW5ndGhcbiAgICBsZXQgaGVhZGVyID0gbmV3IEFycmF5QnVmZmVyKHRoaXMuSEVBREVSX0xFTkdUSCArIG1ldGFMZW5ndGgpXG4gICAgbGV0IHZpZXcgPSBuZXcgRGF0YVZpZXcoaGVhZGVyKVxuICAgIGxldCBvZmZzZXQgPSAwXG5cbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCB0aGlzLktJTkRTLnB1c2gpIC8vIGtpbmRcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBqb2luX3JlZi5sZW5ndGgpXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgcmVmLmxlbmd0aClcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCB0b3BpYy5sZW5ndGgpXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgZXZlbnQubGVuZ3RoKVxuICAgIEFycmF5LmZyb20oam9pbl9yZWYsIGNoYXIgPT4gdmlldy5zZXRVaW50OChvZmZzZXQrKywgY2hhci5jaGFyQ29kZUF0KDApKSlcbiAgICBBcnJheS5mcm9tKHJlZiwgY2hhciA9PiB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBjaGFyLmNoYXJDb2RlQXQoMCkpKVxuICAgIEFycmF5LmZyb20odG9waWMsIGNoYXIgPT4gdmlldy5zZXRVaW50OChvZmZzZXQrKywgY2hhci5jaGFyQ29kZUF0KDApKSlcbiAgICBBcnJheS5mcm9tKGV2ZW50LCBjaGFyID0+IHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGNoYXIuY2hhckNvZGVBdCgwKSkpXG5cbiAgICB2YXIgY29tYmluZWQgPSBuZXcgVWludDhBcnJheShoZWFkZXIuYnl0ZUxlbmd0aCArIHBheWxvYWQuYnl0ZUxlbmd0aClcbiAgICBjb21iaW5lZC5zZXQobmV3IFVpbnQ4QXJyYXkoaGVhZGVyKSwgMClcbiAgICBjb21iaW5lZC5zZXQobmV3IFVpbnQ4QXJyYXkocGF5bG9hZCksIGhlYWRlci5ieXRlTGVuZ3RoKVxuXG4gICAgcmV0dXJuIGNvbWJpbmVkLmJ1ZmZlclxuICB9LFxuXG4gIGJpbmFyeURlY29kZShidWZmZXIpe1xuICAgIGxldCB2aWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcilcbiAgICBsZXQga2luZCA9IHZpZXcuZ2V0VWludDgoMClcbiAgICBsZXQgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigpXG4gICAgc3dpdGNoKGtpbmQpe1xuICAgICAgY2FzZSB0aGlzLktJTkRTLnB1c2g6IHJldHVybiB0aGlzLmRlY29kZVB1c2goYnVmZmVyLCB2aWV3LCBkZWNvZGVyKVxuICAgICAgY2FzZSB0aGlzLktJTkRTLnJlcGx5OiByZXR1cm4gdGhpcy5kZWNvZGVSZXBseShidWZmZXIsIHZpZXcsIGRlY29kZXIpXG4gICAgICBjYXNlIHRoaXMuS0lORFMuYnJvYWRjYXN0OiByZXR1cm4gdGhpcy5kZWNvZGVCcm9hZGNhc3QoYnVmZmVyLCB2aWV3LCBkZWNvZGVyKVxuICAgIH1cbiAgfSxcblxuICBkZWNvZGVQdXNoKGJ1ZmZlciwgdmlldywgZGVjb2Rlcil7XG4gICAgbGV0IGpvaW5SZWZTaXplID0gdmlldy5nZXRVaW50OCgxKVxuICAgIGxldCB0b3BpY1NpemUgPSB2aWV3LmdldFVpbnQ4KDIpXG4gICAgbGV0IGV2ZW50U2l6ZSA9IHZpZXcuZ2V0VWludDgoMylcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgdGhpcy5NRVRBX0xFTkdUSCAtIDEgLy8gcHVzaGVzIGhhdmUgbm8gcmVmXG4gICAgbGV0IGpvaW5SZWYgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBqb2luUmVmU2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgam9pblJlZlNpemVcbiAgICBsZXQgdG9waWMgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0b3BpY1NpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIHRvcGljU2l6ZVxuICAgIGxldCBldmVudCA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGV2ZW50U2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgZXZlbnRTaXplXG4gICAgbGV0IGRhdGEgPSBidWZmZXIuc2xpY2Uob2Zmc2V0LCBidWZmZXIuYnl0ZUxlbmd0aClcbiAgICByZXR1cm4ge2pvaW5fcmVmOiBqb2luUmVmLCByZWY6IG51bGwsIHRvcGljOiB0b3BpYywgZXZlbnQ6IGV2ZW50LCBwYXlsb2FkOiBkYXRhfVxuICB9LFxuXG4gIGRlY29kZVJlcGx5KGJ1ZmZlciwgdmlldywgZGVjb2Rlcil7XG4gICAgbGV0IGpvaW5SZWZTaXplID0gdmlldy5nZXRVaW50OCgxKVxuICAgIGxldCByZWZTaXplID0gdmlldy5nZXRVaW50OCgyKVxuICAgIGxldCB0b3BpY1NpemUgPSB2aWV3LmdldFVpbnQ4KDMpXG4gICAgbGV0IGV2ZW50U2l6ZSA9IHZpZXcuZ2V0VWludDgoNClcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgdGhpcy5NRVRBX0xFTkdUSFxuICAgIGxldCBqb2luUmVmID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgam9pblJlZlNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGpvaW5SZWZTaXplXG4gICAgbGV0IHJlZiA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIHJlZlNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIHJlZlNpemVcbiAgICBsZXQgdG9waWMgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0b3BpY1NpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIHRvcGljU2l6ZVxuICAgIGxldCBldmVudCA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGV2ZW50U2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgZXZlbnRTaXplXG4gICAgbGV0IGRhdGEgPSBidWZmZXIuc2xpY2Uob2Zmc2V0LCBidWZmZXIuYnl0ZUxlbmd0aClcbiAgICBsZXQgcGF5bG9hZCA9IHtzdGF0dXM6IGV2ZW50LCByZXNwb25zZTogZGF0YX1cbiAgICByZXR1cm4ge2pvaW5fcmVmOiBqb2luUmVmLCByZWY6IHJlZiwgdG9waWM6IHRvcGljLCBldmVudDogQ0hBTk5FTF9FVkVOVFMucmVwbHksIHBheWxvYWQ6IHBheWxvYWR9XG4gIH0sXG5cbiAgZGVjb2RlQnJvYWRjYXN0KGJ1ZmZlciwgdmlldywgZGVjb2Rlcil7XG4gICAgbGV0IHRvcGljU2l6ZSA9IHZpZXcuZ2V0VWludDgoMSlcbiAgICBsZXQgZXZlbnRTaXplID0gdmlldy5nZXRVaW50OCgyKVxuICAgIGxldCBvZmZzZXQgPSB0aGlzLkhFQURFUl9MRU5HVEggKyAyXG4gICAgbGV0IHRvcGljID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgdG9waWNTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyB0b3BpY1NpemVcbiAgICBsZXQgZXZlbnQgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBldmVudFNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGV2ZW50U2l6ZVxuICAgIGxldCBkYXRhID0gYnVmZmVyLnNsaWNlKG9mZnNldCwgYnVmZmVyLmJ5dGVMZW5ndGgpXG5cbiAgICByZXR1cm4ge2pvaW5fcmVmOiBudWxsLCByZWY6IG51bGwsIHRvcGljOiB0b3BpYywgZXZlbnQ6IGV2ZW50LCBwYXlsb2FkOiBkYXRhfVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgZ2xvYmFsLFxuICBwaHhXaW5kb3csXG4gIENIQU5ORUxfRVZFTlRTLFxuICBERUZBVUxUX1RJTUVPVVQsXG4gIERFRkFVTFRfVlNOLFxuICBTT0NLRVRfU1RBVEVTLFxuICBUUkFOU1BPUlRTLFxuICBXU19DTE9TRV9OT1JNQUxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2xvc3VyZVxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBBamF4IGZyb20gXCIuL2FqYXhcIlxuaW1wb3J0IENoYW5uZWwgZnJvbSBcIi4vY2hhbm5lbFwiXG5pbXBvcnQgTG9uZ1BvbGwgZnJvbSBcIi4vbG9uZ3BvbGxcIlxuaW1wb3J0IFNlcmlhbGl6ZXIgZnJvbSBcIi4vc2VyaWFsaXplclwiXG5pbXBvcnQgVGltZXIgZnJvbSBcIi4vdGltZXJcIlxuXG4vKiogSW5pdGlhbGl6ZXMgdGhlIFNvY2tldCAqXG4gKlxuICogRm9yIElFOCBzdXBwb3J0IHVzZSBhbiBFUzUtc2hpbSAoaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltKVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbmRQb2ludCAtIFRoZSBzdHJpbmcgV2ViU29ja2V0IGVuZHBvaW50LCBpZSwgYFwid3M6Ly9leGFtcGxlLmNvbS9zb2NrZXRcImAsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFwid3NzOi8vZXhhbXBsZS5jb21cImBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgXCIvc29ja2V0XCJgIChpbmhlcml0ZWQgaG9zdCAmIHByb3RvY29sKVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzXSAtIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnRyYW5zcG9ydF0gLSBUaGUgV2Vic29ja2V0IFRyYW5zcG9ydCwgZm9yIGV4YW1wbGUgV2ViU29ja2V0IG9yIFBob2VuaXguTG9uZ1BvbGwuXG4gKlxuICogRGVmYXVsdHMgdG8gV2ViU29ja2V0IHdpdGggYXV0b21hdGljIExvbmdQb2xsIGZhbGxiYWNrIGlmIFdlYlNvY2tldCBpcyBub3QgZGVmaW5lZC5cbiAqIFRvIGZhbGxiYWNrIHRvIExvbmdQb2xsIHdoZW4gV2ViU29ja2V0IGF0dGVtcHRzIGZhaWwsIHVzZSBgbG9uZ1BvbGxGYWxsYmFja01zOiAyNTAwYC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5sb25nUG9sbEZhbGxiYWNrTXNdIC0gVGhlIG1pbGxpc2Vjb25kIHRpbWUgdG8gYXR0ZW1wdCB0aGUgcHJpbWFyeSB0cmFuc3BvcnRcbiAqIGJlZm9yZSBmYWxsaW5nIGJhY2sgdG8gdGhlIExvbmdQb2xsIHRyYW5zcG9ydC4gRGlzYWJsZWQgYnkgZGVmYXVsdC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5kZWJ1Z10gLSBXaGVuIHRydWUsIGVuYWJsZXMgZGVidWcgbG9nZ2luZy4gRGVmYXVsdCBmYWxzZS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5lbmNvZGVdIC0gVGhlIGZ1bmN0aW9uIHRvIGVuY29kZSBvdXRnb2luZyBtZXNzYWdlcy5cbiAqXG4gKiBEZWZhdWx0cyB0byBKU09OIGVuY29kZXIuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMuZGVjb2RlXSAtIFRoZSBmdW5jdGlvbiB0byBkZWNvZGUgaW5jb21pbmcgbWVzc2FnZXMuXG4gKlxuICogRGVmYXVsdHMgdG8gSlNPTjpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiAocGF5bG9hZCwgY2FsbGJhY2spID0+IGNhbGxiYWNrKEpTT04ucGFyc2UocGF5bG9hZCkpXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdHMudGltZW91dF0gLSBUaGUgZGVmYXVsdCB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byB0cmlnZ2VyIHB1c2ggdGltZW91dHMuXG4gKlxuICogRGVmYXVsdHMgYERFRkFVTFRfVElNRU9VVGBcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5oZWFydGJlYXRJbnRlcnZhbE1zXSAtIFRoZSBtaWxsaXNlYyBpbnRlcnZhbCB0byBzZW5kIGEgaGVhcnRiZWF0IG1lc3NhZ2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5yZWNvbm5lY3RBZnRlck1zXSAtIFRoZSBvcHRpb25hbCBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIG1pbGxpc2VjXG4gKiBzb2NrZXQgcmVjb25uZWN0IGludGVydmFsLlxuICpcbiAqIERlZmF1bHRzIHRvIHN0ZXBwZWQgYmFja29mZiBvZjpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbih0cmllcyl7XG4gKiAgIHJldHVybiBbMTAsIDUwLCAxMDAsIDE1MCwgMjAwLCAyNTAsIDUwMCwgMTAwMCwgMjAwMF1bdHJpZXMgLSAxXSB8fCA1MDAwXG4gKiB9XG4gKiBgYGBgXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnJlam9pbkFmdGVyTXNdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgbWlsbGlzZWNcbiAqIHJlam9pbiBpbnRlcnZhbCBmb3IgaW5kaXZpZHVhbCBjaGFubmVscy5cbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbih0cmllcyl7XG4gKiAgIHJldHVybiBbMTAwMCwgMjAwMCwgNTAwMF1bdHJpZXMgLSAxXSB8fCAxMDAwMFxuICogfVxuICogYGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLmxvZ2dlcl0gLSBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gZm9yIHNwZWNpYWxpemVkIGxvZ2dpbmcsIGllOlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGZ1bmN0aW9uKGtpbmQsIG1zZywgZGF0YSkge1xuICogICBjb25zb2xlLmxvZyhgJHtraW5kfTogJHttc2d9YCwgZGF0YSlcbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5sb25ncG9sbGVyVGltZW91dF0gLSBUaGUgbWF4aW11bSB0aW1lb3V0IG9mIGEgbG9uZyBwb2xsIEFKQVggcmVxdWVzdC5cbiAqXG4gKiBEZWZhdWx0cyB0byAyMHMgKGRvdWJsZSB0aGUgc2VydmVyIGxvbmcgcG9sbCB0aW1lcikuXG4gKlxuICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKX0gW29wdHMucGFyYW1zXSAtIFRoZSBvcHRpb25hbCBwYXJhbXMgdG8gcGFzcyB3aGVuIGNvbm5lY3RpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5iaW5hcnlUeXBlXSAtIFRoZSBiaW5hcnkgdHlwZSB0byB1c2UgZm9yIGJpbmFyeSBXZWJTb2NrZXQgZnJhbWVzLlxuICpcbiAqIERlZmF1bHRzIHRvIFwiYXJyYXlidWZmZXJcIlxuICpcbiAqIEBwYXJhbSB7dnNufSBbb3B0cy52c25dIC0gVGhlIHNlcmlhbGl6ZXIncyBwcm90b2NvbCB2ZXJzaW9uIHRvIHNlbmQgb24gY29ubmVjdC5cbiAqXG4gKiBEZWZhdWx0cyB0byBERUZBVUxUX1ZTTi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMuc2Vzc2lvblN0b3JhZ2VdIC0gQW4gb3B0aW9uYWwgU3RvcmFnZSBjb21wYXRpYmxlIG9iamVjdFxuICogUGhvZW5peCB1c2VzIHNlc3Npb25TdG9yYWdlIGZvciBsb25ncG9sbCBmYWxsYmFjayBoaXN0b3J5LiBPdmVycmlkaW5nIHRoZSBzdG9yZSBpc1xuICogdXNlZnVsIHdoZW4gUGhvZW5peCB3b24ndCBoYXZlIGFjY2VzcyB0byBgc2Vzc2lvblN0b3JhZ2VgLiBGb3IgZXhhbXBsZSwgVGhpcyBjb3VsZFxuICogaGFwcGVuIGlmIGEgc2l0ZSBsb2FkcyBhIGNyb3NzLWRvbWFpbiBjaGFubmVsIGluIGFuIGlmcmFtZS4gRXhhbXBsZSB1c2FnZTpcbiAqXG4gKiAgICAgY2xhc3MgSW5NZW1vcnlTdG9yYWdlIHtcbiAqICAgICAgIGNvbnN0cnVjdG9yKCkgeyB0aGlzLnN0b3JhZ2UgPSB7fSB9XG4gKiAgICAgICBnZXRJdGVtKGtleU5hbWUpIHsgcmV0dXJuIHRoaXMuc3RvcmFnZVtrZXlOYW1lXSB8fCBudWxsIH1cbiAqICAgICAgIHJlbW92ZUl0ZW0oa2V5TmFtZSkgeyBkZWxldGUgdGhpcy5zdG9yYWdlW2tleU5hbWVdIH1cbiAqICAgICAgIHNldEl0ZW0oa2V5TmFtZSwga2V5VmFsdWUpIHsgdGhpcy5zdG9yYWdlW2tleU5hbWVdID0ga2V5VmFsdWUgfVxuICogICAgIH1cbiAqXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29ja2V0IHtcbiAgY29uc3RydWN0b3IoZW5kUG9pbnQsIG9wdHMgPSB7fSl7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcyA9IHtvcGVuOiBbXSwgY2xvc2U6IFtdLCBlcnJvcjogW10sIG1lc3NhZ2U6IFtdfVxuICAgIHRoaXMuY2hhbm5lbHMgPSBbXVxuICAgIHRoaXMuc2VuZEJ1ZmZlciA9IFtdXG4gICAgdGhpcy5yZWYgPSAwXG4gICAgdGhpcy50aW1lb3V0ID0gb3B0cy50aW1lb3V0IHx8IERFRkFVTFRfVElNRU9VVFxuICAgIHRoaXMudHJhbnNwb3J0ID0gb3B0cy50cmFuc3BvcnQgfHwgZ2xvYmFsLldlYlNvY2tldCB8fCBMb25nUG9sbFxuICAgIHRoaXMucHJpbWFyeVBhc3NlZEhlYWx0aENoZWNrID0gZmFsc2VcbiAgICB0aGlzLmxvbmdQb2xsRmFsbGJhY2tNcyA9IG9wdHMubG9uZ1BvbGxGYWxsYmFja01zXG4gICAgdGhpcy5mYWxsYmFja1RpbWVyID0gbnVsbFxuICAgIHRoaXMuc2Vzc2lvblN0b3JlID0gb3B0cy5zZXNzaW9uU3RvcmFnZSB8fCAoZ2xvYmFsICYmIGdsb2JhbC5zZXNzaW9uU3RvcmFnZSlcbiAgICB0aGlzLmVzdGFibGlzaGVkQ29ubmVjdGlvbnMgPSAwXG4gICAgdGhpcy5kZWZhdWx0RW5jb2RlciA9IFNlcmlhbGl6ZXIuZW5jb2RlLmJpbmQoU2VyaWFsaXplcilcbiAgICB0aGlzLmRlZmF1bHREZWNvZGVyID0gU2VyaWFsaXplci5kZWNvZGUuYmluZChTZXJpYWxpemVyKVxuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IGZhbHNlXG4gICAgdGhpcy5kaXNjb25uZWN0aW5nID0gZmFsc2VcbiAgICB0aGlzLmJpbmFyeVR5cGUgPSBvcHRzLmJpbmFyeVR5cGUgfHwgXCJhcnJheWJ1ZmZlclwiXG4gICAgdGhpcy5jb25uZWN0Q2xvY2sgPSAxXG4gICAgaWYodGhpcy50cmFuc3BvcnQgIT09IExvbmdQb2xsKXtcbiAgICAgIHRoaXMuZW5jb2RlID0gb3B0cy5lbmNvZGUgfHwgdGhpcy5kZWZhdWx0RW5jb2RlclxuICAgICAgdGhpcy5kZWNvZGUgPSBvcHRzLmRlY29kZSB8fCB0aGlzLmRlZmF1bHREZWNvZGVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW5jb2RlID0gdGhpcy5kZWZhdWx0RW5jb2RlclxuICAgICAgdGhpcy5kZWNvZGUgPSB0aGlzLmRlZmF1bHREZWNvZGVyXG4gICAgfVxuICAgIGxldCBhd2FpdGluZ0Nvbm5lY3Rpb25PblBhZ2VTaG93ID0gbnVsbFxuICAgIGlmKHBoeFdpbmRvdyAmJiBwaHhXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcil7XG4gICAgICBwaHhXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2VoaWRlXCIsIF9lID0+IHtcbiAgICAgICAgaWYodGhpcy5jb25uKXtcbiAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3QoKVxuICAgICAgICAgIGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPSB0aGlzLmNvbm5lY3RDbG9ja1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcGh4V2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlc2hvd1wiLCBfZSA9PiB7XG4gICAgICAgIGlmKGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPT09IHRoaXMuY29ubmVjdENsb2NrKXtcbiAgICAgICAgICBhd2FpdGluZ0Nvbm5lY3Rpb25PblBhZ2VTaG93ID0gbnVsbFxuICAgICAgICAgIHRoaXMuY29ubmVjdCgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuaGVhcnRiZWF0SW50ZXJ2YWxNcyA9IG9wdHMuaGVhcnRiZWF0SW50ZXJ2YWxNcyB8fCAzMDAwMFxuICAgIHRoaXMucmVqb2luQWZ0ZXJNcyA9ICh0cmllcykgPT4ge1xuICAgICAgaWYob3B0cy5yZWpvaW5BZnRlck1zKXtcbiAgICAgICAgcmV0dXJuIG9wdHMucmVqb2luQWZ0ZXJNcyh0cmllcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbMTAwMCwgMjAwMCwgNTAwMF1bdHJpZXMgLSAxXSB8fCAxMDAwMFxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnJlY29ubmVjdEFmdGVyTXMgPSAodHJpZXMpID0+IHtcbiAgICAgIGlmKG9wdHMucmVjb25uZWN0QWZ0ZXJNcyl7XG4gICAgICAgIHJldHVybiBvcHRzLnJlY29ubmVjdEFmdGVyTXModHJpZXMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gWzEwLCA1MCwgMTAwLCAxNTAsIDIwMCwgMjUwLCA1MDAsIDEwMDAsIDIwMDBdW3RyaWVzIC0gMV0gfHwgNTAwMFxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmxvZ2dlciA9IG9wdHMubG9nZ2VyIHx8IG51bGxcbiAgICBpZighdGhpcy5sb2dnZXIgJiYgb3B0cy5kZWJ1Zyl7XG4gICAgICB0aGlzLmxvZ2dlciA9IChraW5kLCBtc2csIGRhdGEpID0+IHsgY29uc29sZS5sb2coYCR7a2luZH06ICR7bXNnfWAsIGRhdGEpIH1cbiAgICB9XG4gICAgdGhpcy5sb25ncG9sbGVyVGltZW91dCA9IG9wdHMubG9uZ3BvbGxlclRpbWVvdXQgfHwgMjAwMDBcbiAgICB0aGlzLnBhcmFtcyA9IGNsb3N1cmUob3B0cy5wYXJhbXMgfHwge30pXG4gICAgdGhpcy5lbmRQb2ludCA9IGAke2VuZFBvaW50fS8ke1RSQU5TUE9SVFMud2Vic29ja2V0fWBcbiAgICB0aGlzLnZzbiA9IG9wdHMudnNuIHx8IERFRkFVTFRfVlNOXG4gICAgdGhpcy5oZWFydGJlYXRUaW1lb3V0VGltZXIgPSBudWxsXG4gICAgdGhpcy5oZWFydGJlYXRUaW1lciA9IG51bGxcbiAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsXG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lciA9IG5ldyBUaW1lcigoKSA9PiB7XG4gICAgICB0aGlzLnRlYXJkb3duKCgpID0+IHRoaXMuY29ubmVjdCgpKVxuICAgIH0sIHRoaXMucmVjb25uZWN0QWZ0ZXJNcylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBMb25nUG9sbCB0cmFuc3BvcnQgcmVmZXJlbmNlXG4gICAqL1xuICBnZXRMb25nUG9sbFRyYW5zcG9ydCgpeyByZXR1cm4gTG9uZ1BvbGwgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyBhbmQgcmVwbGFjZXMgdGhlIGFjdGl2ZSB0cmFuc3BvcnRcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV3VHJhbnNwb3J0IC0gVGhlIG5ldyB0cmFuc3BvcnQgY2xhc3MgdG8gaW5zdGFudGlhdGVcbiAgICpcbiAgICovXG4gIHJlcGxhY2VUcmFuc3BvcnQobmV3VHJhbnNwb3J0KXtcbiAgICB0aGlzLmNvbm5lY3RDbG9jaysrXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gdHJ1ZVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmZhbGxiYWNrVGltZXIpXG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lci5yZXNldCgpXG4gICAgaWYodGhpcy5jb25uKXtcbiAgICAgIHRoaXMuY29ubi5jbG9zZSgpXG4gICAgICB0aGlzLmNvbm4gPSBudWxsXG4gICAgfVxuICAgIHRoaXMudHJhbnNwb3J0ID0gbmV3VHJhbnNwb3J0XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc29ja2V0IHByb3RvY29sXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBwcm90b2NvbCgpeyByZXR1cm4gbG9jYXRpb24ucHJvdG9jb2wubWF0Y2goL15odHRwcy8pID8gXCJ3c3NcIiA6IFwid3NcIiB9XG5cbiAgLyoqXG4gICAqIFRoZSBmdWxseSBxdWFsaWZpZWQgc29ja2V0IHVybFxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgZW5kUG9pbnRVUkwoKXtcbiAgICBsZXQgdXJpID0gQWpheC5hcHBlbmRQYXJhbXMoXG4gICAgICBBamF4LmFwcGVuZFBhcmFtcyh0aGlzLmVuZFBvaW50LCB0aGlzLnBhcmFtcygpKSwge3ZzbjogdGhpcy52c259KVxuICAgIGlmKHVyaS5jaGFyQXQoMCkgIT09IFwiL1wiKXsgcmV0dXJuIHVyaSB9XG4gICAgaWYodXJpLmNoYXJBdCgxKSA9PT0gXCIvXCIpeyByZXR1cm4gYCR7dGhpcy5wcm90b2NvbCgpfToke3VyaX1gIH1cblxuICAgIHJldHVybiBgJHt0aGlzLnByb3RvY29sKCl9Oi8vJHtsb2NhdGlvbi5ob3N0fSR7dXJpfWBcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyB0aGUgc29ja2V0XG4gICAqXG4gICAqIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ2xvc2VFdmVudCNTdGF0dXNfY29kZXMgZm9yIHZhbGlkIHN0YXR1cyBjb2Rlcy5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBPcHRpb25hbCBjYWxsYmFjayB3aGljaCBpcyBjYWxsZWQgYWZ0ZXIgc29ja2V0IGlzIGRpc2Nvbm5lY3RlZC5cbiAgICogQHBhcmFtIHtpbnRlZ2VyfSBjb2RlIC0gQSBzdGF0dXMgY29kZSBmb3IgZGlzY29ubmVjdGlvbiAoT3B0aW9uYWwpLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVhc29uIC0gQSB0ZXh0dWFsIGRlc2NyaXB0aW9uIG9mIHRoZSByZWFzb24gdG8gZGlzY29ubmVjdC4gKE9wdGlvbmFsKVxuICAgKi9cbiAgZGlzY29ubmVjdChjYWxsYmFjaywgY29kZSwgcmVhc29uKXtcbiAgICB0aGlzLmNvbm5lY3RDbG9jaysrXG4gICAgdGhpcy5kaXNjb25uZWN0aW5nID0gdHJ1ZVxuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IHRydWVcbiAgICBjbGVhclRpbWVvdXQodGhpcy5mYWxsYmFja1RpbWVyKVxuICAgIHRoaXMucmVjb25uZWN0VGltZXIucmVzZXQoKVxuICAgIHRoaXMudGVhcmRvd24oKCkgPT4ge1xuICAgICAgdGhpcy5kaXNjb25uZWN0aW5nID0gZmFsc2VcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9LCBjb2RlLCByZWFzb24pXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIFRoZSBwYXJhbXMgdG8gc2VuZCB3aGVuIGNvbm5lY3RpbmcsIGZvciBleGFtcGxlIGB7dXNlcl9pZDogdXNlclRva2VufWBcbiAgICpcbiAgICogUGFzc2luZyBwYXJhbXMgdG8gY29ubmVjdCBpcyBkZXByZWNhdGVkOyBwYXNzIHRoZW0gaW4gdGhlIFNvY2tldCBjb25zdHJ1Y3RvciBpbnN0ZWFkOlxuICAgKiBgbmV3IFNvY2tldChcIi9zb2NrZXRcIiwge3BhcmFtczoge3VzZXJfaWQ6IHVzZXJUb2tlbn19KWAuXG4gICAqL1xuICBjb25uZWN0KHBhcmFtcyl7XG4gICAgaWYocGFyYW1zKXtcbiAgICAgIGNvbnNvbGUgJiYgY29uc29sZS5sb2coXCJwYXNzaW5nIHBhcmFtcyB0byBjb25uZWN0IGlzIGRlcHJlY2F0ZWQuIEluc3RlYWQgcGFzcyA6cGFyYW1zIHRvIHRoZSBTb2NrZXQgY29uc3RydWN0b3JcIilcbiAgICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShwYXJhbXMpXG4gICAgfVxuICAgIGlmKHRoaXMuY29ubiAmJiAhdGhpcy5kaXNjb25uZWN0aW5nKXsgcmV0dXJuIH1cbiAgICBpZih0aGlzLmxvbmdQb2xsRmFsbGJhY2tNcyAmJiB0aGlzLnRyYW5zcG9ydCAhPT0gTG9uZ1BvbGwpe1xuICAgICAgdGhpcy5jb25uZWN0V2l0aEZhbGxiYWNrKExvbmdQb2xsLCB0aGlzLmxvbmdQb2xsRmFsbGJhY2tNcylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50cmFuc3BvcnRDb25uZWN0KClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTG9ncyB0aGUgbWVzc2FnZS4gT3ZlcnJpZGUgYHRoaXMubG9nZ2VyYCBmb3Igc3BlY2lhbGl6ZWQgbG9nZ2luZy4gbm9vcHMgYnkgZGVmYXVsdFxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2luZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbXNnXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqL1xuICBsb2coa2luZCwgbXNnLCBkYXRhKXsgdGhpcy5sb2dnZXIgJiYgdGhpcy5sb2dnZXIoa2luZCwgbXNnLCBkYXRhKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBhIGxvZ2dlciBoYXMgYmVlbiBzZXQgb24gdGhpcyBzb2NrZXQuXG4gICAqL1xuICBoYXNMb2dnZXIoKXsgcmV0dXJuIHRoaXMubG9nZ2VyICE9PSBudWxsIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGNhbGxiYWNrcyBmb3IgY29ubmVjdGlvbiBvcGVuIGV2ZW50c1xuICAgKlxuICAgKiBAZXhhbXBsZSBzb2NrZXQub25PcGVuKGZ1bmN0aW9uKCl7IGNvbnNvbGUuaW5mbyhcInRoZSBzb2NrZXQgd2FzIG9wZW5lZFwiKSB9KVxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25PcGVuKGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm9wZW4ucHVzaChbcmVmLCBjYWxsYmFja10pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBjYWxsYmFja3MgZm9yIGNvbm5lY3Rpb24gY2xvc2UgZXZlbnRzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbkNsb3NlKGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmNsb3NlLnB1c2goW3JlZiwgY2FsbGJhY2tdKVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIGVycm9yIGV2ZW50c1xuICAgKlxuICAgKiBAZXhhbXBsZSBzb2NrZXQub25FcnJvcihmdW5jdGlvbihlcnJvcil7IGFsZXJ0KFwiQW4gZXJyb3Igb2NjdXJyZWRcIikgfSlcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uRXJyb3IoY2FsbGJhY2spe1xuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MuZXJyb3IucHVzaChbcmVmLCBjYWxsYmFja10pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBjYWxsYmFja3MgZm9yIGNvbm5lY3Rpb24gbWVzc2FnZSBldmVudHNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uTWVzc2FnZShjYWxsYmFjayl7XG4gICAgbGV0IHJlZiA9IHRoaXMubWFrZVJlZigpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5tZXNzYWdlLnB1c2goW3JlZiwgY2FsbGJhY2tdKVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBQaW5ncyB0aGUgc2VydmVyIGFuZCBpbnZva2VzIHRoZSBjYWxsYmFjayB3aXRoIHRoZSBSVFQgaW4gbWlsbGlzZWNvbmRzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgcGluZyB3YXMgcHVzaGVkIG9yIGZhbHNlIGlmIHVuYWJsZSB0byBiZSBwdXNoZWQuXG4gICAqL1xuICBwaW5nKGNhbGxiYWNrKXtcbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIGZhbHNlIH1cbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICBsZXQgc3RhcnRUaW1lID0gRGF0ZS5ub3coKVxuICAgIHRoaXMucHVzaCh7dG9waWM6IFwicGhvZW5peFwiLCBldmVudDogXCJoZWFydGJlYXRcIiwgcGF5bG9hZDoge30sIHJlZjogcmVmfSlcbiAgICBsZXQgb25Nc2dSZWYgPSB0aGlzLm9uTWVzc2FnZShtc2cgPT4ge1xuICAgICAgaWYobXNnLnJlZiA9PT0gcmVmKXtcbiAgICAgICAgdGhpcy5vZmYoW29uTXNnUmVmXSlcbiAgICAgICAgY2FsbGJhY2soRGF0ZS5ub3coKSAtIHN0YXJ0VGltZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgdHJhbnNwb3J0Q29ubmVjdCgpe1xuICAgIHRoaXMuY29ubmVjdENsb2NrKytcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSBmYWxzZVxuICAgIHRoaXMuY29ubiA9IG5ldyB0aGlzLnRyYW5zcG9ydCh0aGlzLmVuZFBvaW50VVJMKCkpXG4gICAgdGhpcy5jb25uLmJpbmFyeVR5cGUgPSB0aGlzLmJpbmFyeVR5cGVcbiAgICB0aGlzLmNvbm4udGltZW91dCA9IHRoaXMubG9uZ3BvbGxlclRpbWVvdXRcbiAgICB0aGlzLmNvbm4ub25vcGVuID0gKCkgPT4gdGhpcy5vbkNvbm5PcGVuKClcbiAgICB0aGlzLmNvbm4ub25lcnJvciA9IGVycm9yID0+IHRoaXMub25Db25uRXJyb3IoZXJyb3IpXG4gICAgdGhpcy5jb25uLm9ubWVzc2FnZSA9IGV2ZW50ID0+IHRoaXMub25Db25uTWVzc2FnZShldmVudClcbiAgICB0aGlzLmNvbm4ub25jbG9zZSA9IGV2ZW50ID0+IHRoaXMub25Db25uQ2xvc2UoZXZlbnQpXG4gIH1cblxuICBnZXRTZXNzaW9uKGtleSl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yZSAmJiB0aGlzLnNlc3Npb25TdG9yZS5nZXRJdGVtKGtleSkgfVxuXG4gIHN0b3JlU2Vzc2lvbihrZXksIHZhbCl7IHRoaXMuc2Vzc2lvblN0b3JlICYmIHRoaXMuc2Vzc2lvblN0b3JlLnNldEl0ZW0oa2V5LCB2YWwpIH1cblxuICBjb25uZWN0V2l0aEZhbGxiYWNrKGZhbGxiYWNrVHJhbnNwb3J0LCBmYWxsYmFja1RocmVzaG9sZCA9IDI1MDApe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmZhbGxiYWNrVGltZXIpXG4gICAgbGV0IGVzdGFibGlzaGVkID0gZmFsc2VcbiAgICBsZXQgcHJpbWFyeVRyYW5zcG9ydCA9IHRydWVcbiAgICBsZXQgb3BlblJlZiwgZXJyb3JSZWZcbiAgICBsZXQgZmFsbGJhY2sgPSAocmVhc29uKSA9PiB7XG4gICAgICB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgZmFsbGluZyBiYWNrIHRvICR7ZmFsbGJhY2tUcmFuc3BvcnQubmFtZX0uLi5gLCByZWFzb24pXG4gICAgICB0aGlzLm9mZihbb3BlblJlZiwgZXJyb3JSZWZdKVxuICAgICAgcHJpbWFyeVRyYW5zcG9ydCA9IGZhbHNlXG4gICAgICB0aGlzLnJlcGxhY2VUcmFuc3BvcnQoZmFsbGJhY2tUcmFuc3BvcnQpXG4gICAgICB0aGlzLnRyYW5zcG9ydENvbm5lY3QoKVxuICAgIH1cbiAgICBpZih0aGlzLmdldFNlc3Npb24oYHBoeDpmYWxsYmFjazoke2ZhbGxiYWNrVHJhbnNwb3J0Lm5hbWV9YCkpeyByZXR1cm4gZmFsbGJhY2soXCJtZW1vcml6ZWRcIikgfVxuXG4gICAgdGhpcy5mYWxsYmFja1RpbWVyID0gc2V0VGltZW91dChmYWxsYmFjaywgZmFsbGJhY2tUaHJlc2hvbGQpXG5cbiAgICBlcnJvclJlZiA9IHRoaXMub25FcnJvcihyZWFzb24gPT4ge1xuICAgICAgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgXCJlcnJvclwiLCByZWFzb24pXG4gICAgICBpZihwcmltYXJ5VHJhbnNwb3J0ICYmICFlc3RhYmxpc2hlZCl7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmZhbGxiYWNrVGltZXIpXG4gICAgICAgIGZhbGxiYWNrKHJlYXNvbilcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMub25PcGVuKCgpID0+IHtcbiAgICAgIGVzdGFibGlzaGVkID0gdHJ1ZVxuICAgICAgaWYoIXByaW1hcnlUcmFuc3BvcnQpe1xuICAgICAgICAvLyBvbmx5IG1lbW9yaXplIExQIGlmIHdlIG5ldmVyIGNvbm5lY3RlZCB0byBwcmltYXJ5XG4gICAgICAgIGlmKCF0aGlzLnByaW1hcnlQYXNzZWRIZWFsdGhDaGVjayl7IHRoaXMuc3RvcmVTZXNzaW9uKGBwaHg6ZmFsbGJhY2s6JHtmYWxsYmFja1RyYW5zcG9ydC5uYW1lfWAsIFwidHJ1ZVwiKSB9XG4gICAgICAgIHJldHVybiB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgZXN0YWJsaXNoZWQgJHtmYWxsYmFja1RyYW5zcG9ydC5uYW1lfSBmYWxsYmFja2ApXG4gICAgICB9XG4gICAgICAvLyBpZiB3ZSd2ZSBlc3RhYmxpc2hlZCBwcmltYXJ5LCBnaXZlIHRoZSBmYWxsYmFjayBhIG5ldyBwZXJpb2QgdG8gYXR0ZW1wdCBwaW5nXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5mYWxsYmFja1RpbWVyKVxuICAgICAgdGhpcy5mYWxsYmFja1RpbWVyID0gc2V0VGltZW91dChmYWxsYmFjaywgZmFsbGJhY2tUaHJlc2hvbGQpXG4gICAgICB0aGlzLnBpbmcocnR0ID0+IHtcbiAgICAgICAgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgXCJjb25uZWN0ZWQgdG8gcHJpbWFyeSBhZnRlclwiLCBydHQpXG4gICAgICAgIHRoaXMucHJpbWFyeVBhc3NlZEhlYWx0aENoZWNrID0gdHJ1ZVxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5mYWxsYmFja1RpbWVyKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHRoaXMudHJhbnNwb3J0Q29ubmVjdCgpXG4gIH1cblxuICBjbGVhckhlYXJ0YmVhdHMoKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5oZWFydGJlYXRUaW1lcilcbiAgICBjbGVhclRpbWVvdXQodGhpcy5oZWFydGJlYXRUaW1lb3V0VGltZXIpXG4gIH1cblxuICBvbkNvbm5PcGVuKCl7XG4gICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgYCR7dGhpcy50cmFuc3BvcnQubmFtZX0gY29ubmVjdGVkIHRvICR7dGhpcy5lbmRQb2ludFVSTCgpfWApXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2VcbiAgICB0aGlzLmRpc2Nvbm5lY3RpbmcgPSBmYWxzZVxuICAgIHRoaXMuZXN0YWJsaXNoZWRDb25uZWN0aW9ucysrXG4gICAgdGhpcy5mbHVzaFNlbmRCdWZmZXIoKVxuICAgIHRoaXMucmVjb25uZWN0VGltZXIucmVzZXQoKVxuICAgIHRoaXMucmVzZXRIZWFydGJlYXQoKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Mub3Blbi5mb3JFYWNoKChbLCBjYWxsYmFja10pID0+IGNhbGxiYWNrKCkpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgaGVhcnRiZWF0VGltZW91dCgpe1xuICAgIGlmKHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZil7XG4gICAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsXG4gICAgICBpZih0aGlzLmhhc0xvZ2dlcigpKXsgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgXCJoZWFydGJlYXQgdGltZW91dC4gQXR0ZW1wdGluZyB0byByZS1lc3RhYmxpc2ggY29ubmVjdGlvblwiKSB9XG4gICAgICB0aGlzLnRyaWdnZXJDaGFuRXJyb3IoKVxuICAgICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2VcbiAgICAgIHRoaXMudGVhcmRvd24oKCkgPT4gdGhpcy5yZWNvbm5lY3RUaW1lci5zY2hlZHVsZVRpbWVvdXQoKSwgV1NfQ0xPU0VfTk9STUFMLCBcImhlYXJ0YmVhdCB0aW1lb3V0XCIpXG4gICAgfVxuICB9XG5cbiAgcmVzZXRIZWFydGJlYXQoKXtcbiAgICBpZih0aGlzLmNvbm4gJiYgdGhpcy5jb25uLnNraXBIZWFydGJlYXQpeyByZXR1cm4gfVxuICAgIHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiA9IG51bGxcbiAgICB0aGlzLmNsZWFySGVhcnRiZWF0cygpXG4gICAgdGhpcy5oZWFydGJlYXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZW5kSGVhcnRiZWF0KCksIHRoaXMuaGVhcnRiZWF0SW50ZXJ2YWxNcylcbiAgfVxuXG4gIHRlYXJkb3duKGNhbGxiYWNrLCBjb2RlLCByZWFzb24pe1xuICAgIGlmKCF0aGlzLmNvbm4pe1xuICAgICAgcmV0dXJuIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9XG4gICAgbGV0IGNvbm5lY3RDbG9jayA9IHRoaXMuY29ubmVjdENsb2NrXG5cbiAgICB0aGlzLndhaXRGb3JCdWZmZXJEb25lKCgpID0+IHtcbiAgICAgIGlmKGNvbm5lY3RDbG9jayAhPT0gdGhpcy5jb25uZWN0Q2xvY2speyByZXR1cm4gfVxuICAgICAgaWYodGhpcy5jb25uKXtcbiAgICAgICAgaWYoY29kZSl7IHRoaXMuY29ubi5jbG9zZShjb2RlLCByZWFzb24gfHwgXCJcIikgfSBlbHNlIHsgdGhpcy5jb25uLmNsb3NlKCkgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLndhaXRGb3JTb2NrZXRDbG9zZWQoKCkgPT4ge1xuICAgICAgICBpZihjb25uZWN0Q2xvY2sgIT09IHRoaXMuY29ubmVjdENsb2NrKXsgcmV0dXJuIH1cbiAgICAgICAgaWYodGhpcy5jb25uKXtcbiAgICAgICAgICB0aGlzLmNvbm4ub25vcGVuID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgICAgICAgIHRoaXMuY29ubi5vbmVycm9yID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgICAgICAgIHRoaXMuY29ubi5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgICAgICAgdGhpcy5jb25uLm9uY2xvc2UgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgICAgICAgdGhpcy5jb25uID0gbnVsbFxuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgd2FpdEZvckJ1ZmZlckRvbmUoY2FsbGJhY2ssIHRyaWVzID0gMSl7XG4gICAgaWYodHJpZXMgPT09IDUgfHwgIXRoaXMuY29ubiB8fCAhdGhpcy5jb25uLmJ1ZmZlcmVkQW1vdW50KXtcbiAgICAgIGNhbGxiYWNrKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy53YWl0Rm9yQnVmZmVyRG9uZShjYWxsYmFjaywgdHJpZXMgKyAxKVxuICAgIH0sIDE1MCAqIHRyaWVzKVxuICB9XG5cbiAgd2FpdEZvclNvY2tldENsb3NlZChjYWxsYmFjaywgdHJpZXMgPSAxKXtcbiAgICBpZih0cmllcyA9PT0gNSB8fCAhdGhpcy5jb25uIHx8IHRoaXMuY29ubi5yZWFkeVN0YXRlID09PSBTT0NLRVRfU1RBVEVTLmNsb3NlZCl7XG4gICAgICBjYWxsYmFjaygpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMud2FpdEZvclNvY2tldENsb3NlZChjYWxsYmFjaywgdHJpZXMgKyAxKVxuICAgIH0sIDE1MCAqIHRyaWVzKVxuICB9XG5cbiAgb25Db25uQ2xvc2UoZXZlbnQpe1xuICAgIGxldCBjbG9zZUNvZGUgPSBldmVudCAmJiBldmVudC5jb2RlXG4gICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgXCJjbG9zZVwiLCBldmVudClcbiAgICB0aGlzLnRyaWdnZXJDaGFuRXJyb3IoKVxuICAgIHRoaXMuY2xlYXJIZWFydGJlYXRzKClcbiAgICBpZighdGhpcy5jbG9zZVdhc0NsZWFuICYmIGNsb3NlQ29kZSAhPT0gMTAwMCl7XG4gICAgICB0aGlzLnJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpXG4gICAgfVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MuY2xvc2UuZm9yRWFjaCgoWywgY2FsbGJhY2tdKSA9PiBjYWxsYmFjayhldmVudCkpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uQ29ubkVycm9yKGVycm9yKXtcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBlcnJvcilcbiAgICBsZXQgdHJhbnNwb3J0QmVmb3JlID0gdGhpcy50cmFuc3BvcnRcbiAgICBsZXQgZXN0YWJsaXNoZWRCZWZvcmUgPSB0aGlzLmVzdGFibGlzaGVkQ29ubmVjdGlvbnNcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmVycm9yLmZvckVhY2goKFssIGNhbGxiYWNrXSkgPT4ge1xuICAgICAgY2FsbGJhY2soZXJyb3IsIHRyYW5zcG9ydEJlZm9yZSwgZXN0YWJsaXNoZWRCZWZvcmUpXG4gICAgfSlcbiAgICBpZih0cmFuc3BvcnRCZWZvcmUgPT09IHRoaXMudHJhbnNwb3J0IHx8IGVzdGFibGlzaGVkQmVmb3JlID4gMCl7XG4gICAgICB0aGlzLnRyaWdnZXJDaGFuRXJyb3IoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdHJpZ2dlckNoYW5FcnJvcigpe1xuICAgIHRoaXMuY2hhbm5lbHMuZm9yRWFjaChjaGFubmVsID0+IHtcbiAgICAgIGlmKCEoY2hhbm5lbC5pc0Vycm9yZWQoKSB8fCBjaGFubmVsLmlzTGVhdmluZygpIHx8IGNoYW5uZWwuaXNDbG9zZWQoKSkpe1xuICAgICAgICBjaGFubmVsLnRyaWdnZXIoQ0hBTk5FTF9FVkVOVFMuZXJyb3IpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgY29ubmVjdGlvblN0YXRlKCl7XG4gICAgc3dpdGNoKHRoaXMuY29ubiAmJiB0aGlzLmNvbm4ucmVhZHlTdGF0ZSl7XG4gICAgICBjYXNlIFNPQ0tFVF9TVEFURVMuY29ubmVjdGluZzogcmV0dXJuIFwiY29ubmVjdGluZ1wiXG4gICAgICBjYXNlIFNPQ0tFVF9TVEFURVMub3BlbjogcmV0dXJuIFwib3BlblwiXG4gICAgICBjYXNlIFNPQ0tFVF9TVEFURVMuY2xvc2luZzogcmV0dXJuIFwiY2xvc2luZ1wiXG4gICAgICBkZWZhdWx0OiByZXR1cm4gXCJjbG9zZWRcIlxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzQ29ubmVjdGVkKCl7IHJldHVybiB0aGlzLmNvbm5lY3Rpb25TdGF0ZSgpID09PSBcIm9wZW5cIiB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7Q2hhbm5lbH1cbiAgICovXG4gIHJlbW92ZShjaGFubmVsKXtcbiAgICB0aGlzLm9mZihjaGFubmVsLnN0YXRlQ2hhbmdlUmVmcylcbiAgICB0aGlzLmNoYW5uZWxzID0gdGhpcy5jaGFubmVscy5maWx0ZXIoYyA9PiBjICE9PSBjaGFubmVsKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYG9uT3BlbmAsIGBvbkNsb3NlYCwgYG9uRXJyb3IsYCBhbmQgYG9uTWVzc2FnZWAgcmVnaXN0cmF0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtyZWZzfSAtIGxpc3Qgb2YgcmVmcyByZXR1cm5lZCBieSBjYWxscyB0b1xuICAgKiAgICAgICAgICAgICAgICAgYG9uT3BlbmAsIGBvbkNsb3NlYCwgYG9uRXJyb3IsYCBhbmQgYG9uTWVzc2FnZWBcbiAgICovXG4gIG9mZihyZWZzKXtcbiAgICBmb3IobGV0IGtleSBpbiB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzKXtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Nba2V5XSA9IHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Nba2V5XS5maWx0ZXIoKFtyZWZdKSA9PiB7XG4gICAgICAgIHJldHVybiByZWZzLmluZGV4T2YocmVmKSA9PT0gLTFcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYXRlcyBhIG5ldyBjaGFubmVsIGZvciB0aGUgZ2l2ZW4gdG9waWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjaGFuUGFyYW1zIC0gUGFyYW1ldGVycyBmb3IgdGhlIGNoYW5uZWxcbiAgICogQHJldHVybnMge0NoYW5uZWx9XG4gICAqL1xuICBjaGFubmVsKHRvcGljLCBjaGFuUGFyYW1zID0ge30pe1xuICAgIGxldCBjaGFuID0gbmV3IENoYW5uZWwodG9waWMsIGNoYW5QYXJhbXMsIHRoaXMpXG4gICAgdGhpcy5jaGFubmVscy5wdXNoKGNoYW4pXG4gICAgcmV0dXJuIGNoYW5cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgcHVzaChkYXRhKXtcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKXtcbiAgICAgIGxldCB7dG9waWMsIGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5fcmVmfSA9IGRhdGFcbiAgICAgIHRoaXMubG9nKFwicHVzaFwiLCBgJHt0b3BpY30gJHtldmVudH0gKCR7am9pbl9yZWZ9LCAke3JlZn0pYCwgcGF5bG9hZClcbiAgICB9XG5cbiAgICBpZih0aGlzLmlzQ29ubmVjdGVkKCkpe1xuICAgICAgdGhpcy5lbmNvZGUoZGF0YSwgcmVzdWx0ID0+IHRoaXMuY29ubi5zZW5kKHJlc3VsdCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VuZEJ1ZmZlci5wdXNoKCgpID0+IHRoaXMuZW5jb2RlKGRhdGEsIHJlc3VsdCA9PiB0aGlzLmNvbm4uc2VuZChyZXN1bHQpKSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBuZXh0IG1lc3NhZ2UgcmVmLCBhY2NvdW50aW5nIGZvciBvdmVyZmxvd3NcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIG1ha2VSZWYoKXtcbiAgICBsZXQgbmV3UmVmID0gdGhpcy5yZWYgKyAxXG4gICAgaWYobmV3UmVmID09PSB0aGlzLnJlZil7IHRoaXMucmVmID0gMCB9IGVsc2UgeyB0aGlzLnJlZiA9IG5ld1JlZiB9XG5cbiAgICByZXR1cm4gdGhpcy5yZWYudG9TdHJpbmcoKVxuICB9XG5cbiAgc2VuZEhlYXJ0YmVhdCgpe1xuICAgIGlmKHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiAmJiAhdGhpcy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIH1cbiAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMucHVzaCh7dG9waWM6IFwicGhvZW5peFwiLCBldmVudDogXCJoZWFydGJlYXRcIiwgcGF5bG9hZDoge30sIHJlZjogdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmfSlcbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5oZWFydGJlYXRUaW1lb3V0KCksIHRoaXMuaGVhcnRiZWF0SW50ZXJ2YWxNcylcbiAgfVxuXG4gIGZsdXNoU2VuZEJ1ZmZlcigpe1xuICAgIGlmKHRoaXMuaXNDb25uZWN0ZWQoKSAmJiB0aGlzLnNlbmRCdWZmZXIubGVuZ3RoID4gMCl7XG4gICAgICB0aGlzLnNlbmRCdWZmZXIuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjaygpKVxuICAgICAgdGhpcy5zZW5kQnVmZmVyID0gW11cbiAgICB9XG4gIH1cblxuICBvbkNvbm5NZXNzYWdlKHJhd01lc3NhZ2Upe1xuICAgIHRoaXMuZGVjb2RlKHJhd01lc3NhZ2UuZGF0YSwgbXNnID0+IHtcbiAgICAgIGxldCB7dG9waWMsIGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5fcmVmfSA9IG1zZ1xuICAgICAgaWYocmVmICYmIHJlZiA9PT0gdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmKXtcbiAgICAgICAgdGhpcy5jbGVhckhlYXJ0YmVhdHMoKVxuICAgICAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsXG4gICAgICAgIHRoaXMuaGVhcnRiZWF0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2VuZEhlYXJ0YmVhdCgpLCB0aGlzLmhlYXJ0YmVhdEludGVydmFsTXMpXG4gICAgICB9XG5cbiAgICAgIGlmKHRoaXMuaGFzTG9nZ2VyKCkpIHRoaXMubG9nKFwicmVjZWl2ZVwiLCBgJHtwYXlsb2FkLnN0YXR1cyB8fCBcIlwifSAke3RvcGljfSAke2V2ZW50fSAke3JlZiAmJiBcIihcIiArIHJlZiArIFwiKVwiIHx8IFwiXCJ9YCwgcGF5bG9hZClcblxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuY2hhbm5lbHMubGVuZ3RoOyBpKyspe1xuICAgICAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tpXVxuICAgICAgICBpZighY2hhbm5lbC5pc01lbWJlcih0b3BpYywgZXZlbnQsIHBheWxvYWQsIGpvaW5fcmVmKSl7IGNvbnRpbnVlIH1cbiAgICAgICAgY2hhbm5lbC50cmlnZ2VyKGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5fcmVmKVxuICAgICAgfVxuXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5tZXNzYWdlLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgbGV0IFssIGNhbGxiYWNrXSA9IHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MubWVzc2FnZVtpXVxuICAgICAgICBjYWxsYmFjayhtc2cpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGxlYXZlT3BlblRvcGljKHRvcGljKXtcbiAgICBsZXQgZHVwQ2hhbm5lbCA9IHRoaXMuY2hhbm5lbHMuZmluZChjID0+IGMudG9waWMgPT09IHRvcGljICYmIChjLmlzSm9pbmVkKCkgfHwgYy5pc0pvaW5pbmcoKSkpXG4gICAgaWYoZHVwQ2hhbm5lbCl7XG4gICAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgbGVhdmluZyBkdXBsaWNhdGUgdG9waWMgXCIke3RvcGljfVwiYClcbiAgICAgIGR1cENoYW5uZWwubGVhdmUoKVxuICAgIH1cbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBDT05TRUNVVElWRV9SRUxPQURTID0gXCJjb25zZWN1dGl2ZS1yZWxvYWRzXCJcbmV4cG9ydCBjb25zdCBNQVhfUkVMT0FEUyA9IDEwXG5leHBvcnQgY29uc3QgUkVMT0FEX0pJVFRFUl9NSU4gPSA1MDAwXG5leHBvcnQgY29uc3QgUkVMT0FEX0pJVFRFUl9NQVggPSAxMDAwMFxuZXhwb3J0IGNvbnN0IEZBSUxTQUZFX0pJVFRFUiA9IDMwMDAwXG5leHBvcnQgY29uc3QgUEhYX0VWRU5UX0NMQVNTRVMgPSBbXG4gIFwicGh4LWNsaWNrLWxvYWRpbmdcIiwgXCJwaHgtY2hhbmdlLWxvYWRpbmdcIiwgXCJwaHgtc3VibWl0LWxvYWRpbmdcIixcbiAgXCJwaHgta2V5ZG93bi1sb2FkaW5nXCIsIFwicGh4LWtleXVwLWxvYWRpbmdcIiwgXCJwaHgtYmx1ci1sb2FkaW5nXCIsIFwicGh4LWZvY3VzLWxvYWRpbmdcIixcbiAgXCJwaHgtaG9vay1sb2FkaW5nXCJcbl1cbmV4cG9ydCBjb25zdCBQSFhfQ09NUE9ORU5UID0gXCJkYXRhLXBoeC1jb21wb25lbnRcIlxuZXhwb3J0IGNvbnN0IFBIWF9MSVZFX0xJTksgPSBcImRhdGEtcGh4LWxpbmtcIlxuZXhwb3J0IGNvbnN0IFBIWF9UUkFDS19TVEFUSUMgPSBcInRyYWNrLXN0YXRpY1wiXG5leHBvcnQgY29uc3QgUEhYX0xJTktfU1RBVEUgPSBcImRhdGEtcGh4LWxpbmstc3RhdGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9SRUZfTE9BRElORyA9IFwiZGF0YS1waHgtcmVmLWxvYWRpbmdcIlxuZXhwb3J0IGNvbnN0IFBIWF9SRUZfU1JDID0gXCJkYXRhLXBoeC1yZWYtc3JjXCJcbmV4cG9ydCBjb25zdCBQSFhfUkVGX0xPQ0sgPSBcImRhdGEtcGh4LXJlZi1sb2NrXCJcbmV4cG9ydCBjb25zdCBQSFhfUEVORElOR19SRUZTID0gXCJwaHgtcGVuZGluZy1yZWZzXCJcbmV4cG9ydCBjb25zdCBQSFhfVFJBQ0tfVVBMT0FEUyA9IFwidHJhY2stdXBsb2Fkc1wiXG5leHBvcnQgY29uc3QgUEhYX1VQTE9BRF9SRUYgPSBcImRhdGEtcGh4LXVwbG9hZC1yZWZcIlxuZXhwb3J0IGNvbnN0IFBIWF9QUkVGTElHSFRFRF9SRUZTID0gXCJkYXRhLXBoeC1wcmVmbGlnaHRlZC1yZWZzXCJcbmV4cG9ydCBjb25zdCBQSFhfRE9ORV9SRUZTID0gXCJkYXRhLXBoeC1kb25lLXJlZnNcIlxuZXhwb3J0IGNvbnN0IFBIWF9EUk9QX1RBUkdFVCA9IFwiZHJvcC10YXJnZXRcIlxuZXhwb3J0IGNvbnN0IFBIWF9BQ1RJVkVfRU5UUllfUkVGUyA9IFwiZGF0YS1waHgtYWN0aXZlLXJlZnNcIlxuZXhwb3J0IGNvbnN0IFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCA9IFwicGh4OmxpdmUtZmlsZTp1cGRhdGVkXCJcbmV4cG9ydCBjb25zdCBQSFhfU0tJUCA9IFwiZGF0YS1waHgtc2tpcFwiXG5leHBvcnQgY29uc3QgUEhYX01BR0lDX0lEID0gXCJkYXRhLXBoeC1pZFwiXG5leHBvcnQgY29uc3QgUEhYX1BSVU5FID0gXCJkYXRhLXBoeC1wcnVuZVwiXG5leHBvcnQgY29uc3QgUEhYX0NPTk5FQ1RFRF9DTEFTUyA9IFwicGh4LWNvbm5lY3RlZFwiXG5leHBvcnQgY29uc3QgUEhYX0xPQURJTkdfQ0xBU1MgPSBcInBoeC1sb2FkaW5nXCJcbmV4cG9ydCBjb25zdCBQSFhfRVJST1JfQ0xBU1MgPSBcInBoeC1lcnJvclwiXG5leHBvcnQgY29uc3QgUEhYX0NMSUVOVF9FUlJPUl9DTEFTUyA9IFwicGh4LWNsaWVudC1lcnJvclwiXG5leHBvcnQgY29uc3QgUEhYX1NFUlZFUl9FUlJPUl9DTEFTUyA9IFwicGh4LXNlcnZlci1lcnJvclwiXG5leHBvcnQgY29uc3QgUEhYX1BBUkVOVF9JRCA9IFwiZGF0YS1waHgtcGFyZW50LWlkXCJcbmV4cG9ydCBjb25zdCBQSFhfTUFJTiA9IFwiZGF0YS1waHgtbWFpblwiXG5leHBvcnQgY29uc3QgUEhYX1JPT1RfSUQgPSBcImRhdGEtcGh4LXJvb3QtaWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9WSUVXUE9SVF9UT1AgPSBcInZpZXdwb3J0LXRvcFwiXG5leHBvcnQgY29uc3QgUEhYX1ZJRVdQT1JUX0JPVFRPTSA9IFwidmlld3BvcnQtYm90dG9tXCJcbmV4cG9ydCBjb25zdCBQSFhfVFJJR0dFUl9BQ1RJT04gPSBcInRyaWdnZXItYWN0aW9uXCJcbmV4cG9ydCBjb25zdCBQSFhfSEFTX0ZPQ1VTRUQgPSBcInBoeC1oYXMtZm9jdXNlZFwiXG5leHBvcnQgY29uc3QgRk9DVVNBQkxFX0lOUFVUUyA9IFtcInRleHRcIiwgXCJ0ZXh0YXJlYVwiLCBcIm51bWJlclwiLCBcImVtYWlsXCIsIFwicGFzc3dvcmRcIiwgXCJzZWFyY2hcIiwgXCJ0ZWxcIiwgXCJ1cmxcIiwgXCJkYXRlXCIsIFwidGltZVwiLCBcImRhdGV0aW1lLWxvY2FsXCIsIFwiY29sb3JcIiwgXCJyYW5nZVwiXVxuZXhwb3J0IGNvbnN0IENIRUNLQUJMRV9JTlBVVFMgPSBbXCJjaGVja2JveFwiLCBcInJhZGlvXCJdXG5leHBvcnQgY29uc3QgUEhYX0hBU19TVUJNSVRURUQgPSBcInBoeC1oYXMtc3VibWl0dGVkXCJcbmV4cG9ydCBjb25zdCBQSFhfU0VTU0lPTiA9IFwiZGF0YS1waHgtc2Vzc2lvblwiXG5leHBvcnQgY29uc3QgUEhYX1ZJRVdfU0VMRUNUT1IgPSBgWyR7UEhYX1NFU1NJT059XWBcbmV4cG9ydCBjb25zdCBQSFhfU1RJQ0tZID0gXCJkYXRhLXBoeC1zdGlja3lcIlxuZXhwb3J0IGNvbnN0IFBIWF9TVEFUSUMgPSBcImRhdGEtcGh4LXN0YXRpY1wiXG5leHBvcnQgY29uc3QgUEhYX1JFQURPTkxZID0gXCJkYXRhLXBoeC1yZWFkb25seVwiXG5leHBvcnQgY29uc3QgUEhYX0RJU0FCTEVEID0gXCJkYXRhLXBoeC1kaXNhYmxlZFwiXG5leHBvcnQgY29uc3QgUEhYX0RJU0FCTEVfV0lUSCA9IFwiZGlzYWJsZS13aXRoXCJcbmV4cG9ydCBjb25zdCBQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUgPSBcImRhdGEtcGh4LWRpc2FibGUtd2l0aC1yZXN0b3JlXCJcbmV4cG9ydCBjb25zdCBQSFhfSE9PSyA9IFwiaG9va1wiXG5leHBvcnQgY29uc3QgUEhYX0RFQk9VTkNFID0gXCJkZWJvdW5jZVwiXG5leHBvcnQgY29uc3QgUEhYX1RIUk9UVExFID0gXCJ0aHJvdHRsZVwiXG5leHBvcnQgY29uc3QgUEhYX1VQREFURSA9IFwidXBkYXRlXCJcbmV4cG9ydCBjb25zdCBQSFhfU1RSRUFNID0gXCJzdHJlYW1cIlxuZXhwb3J0IGNvbnN0IFBIWF9TVFJFQU1fUkVGID0gXCJkYXRhLXBoeC1zdHJlYW1cIlxuZXhwb3J0IGNvbnN0IFBIWF9LRVkgPSBcImtleVwiXG5leHBvcnQgY29uc3QgUEhYX1BSSVZBVEUgPSBcInBoeFByaXZhdGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9BVVRPX1JFQ09WRVIgPSBcImF1dG8tcmVjb3ZlclwiXG5leHBvcnQgY29uc3QgUEhYX0xWX0RFQlVHID0gXCJwaHg6bGl2ZS1zb2NrZXQ6ZGVidWdcIlxuZXhwb3J0IGNvbnN0IFBIWF9MVl9QUk9GSUxFID0gXCJwaHg6bGl2ZS1zb2NrZXQ6cHJvZmlsaW5nXCJcbmV4cG9ydCBjb25zdCBQSFhfTFZfTEFURU5DWV9TSU0gPSBcInBoeDpsaXZlLXNvY2tldDpsYXRlbmN5LXNpbVwiXG5leHBvcnQgY29uc3QgUEhYX0xWX0hJU1RPUllfUE9TSVRJT04gPSBcInBoeDpuYXYtaGlzdG9yeS1wb3NpdGlvblwiXG5leHBvcnQgY29uc3QgUEhYX1BST0dSRVNTID0gXCJwcm9ncmVzc1wiXG5leHBvcnQgY29uc3QgUEhYX01PVU5URUQgPSBcIm1vdW50ZWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9SRUxPQURfU1RBVFVTID0gXCJfX3Bob2VuaXhfcmVsb2FkX3N0YXR1c19fXCJcbmV4cG9ydCBjb25zdCBMT0FERVJfVElNRU9VVCA9IDFcbmV4cG9ydCBjb25zdCBNQVhfQ0hJTERfSk9JTl9BVFRFTVBUUyA9IDNcbmV4cG9ydCBjb25zdCBCRUZPUkVfVU5MT0FEX0xPQURFUl9USU1FT1VUID0gMjAwXG5leHBvcnQgY29uc3QgRElTQ09OTkVDVEVEX1RJTUVPVVQgPSA1MDBcbmV4cG9ydCBjb25zdCBCSU5ESU5HX1BSRUZJWCA9IFwicGh4LVwiXG5leHBvcnQgY29uc3QgUFVTSF9USU1FT1VUID0gMzAwMDBcbmV4cG9ydCBjb25zdCBMSU5LX0hFQURFUiA9IFwieC1yZXF1ZXN0ZWQtd2l0aFwiXG5leHBvcnQgY29uc3QgUkVTUE9OU0VfVVJMX0hFQURFUiA9IFwieC1yZXNwb25zZS11cmxcIlxuZXhwb3J0IGNvbnN0IERFQk9VTkNFX1RSSUdHRVIgPSBcImRlYm91bmNlLXRyaWdnZXJcIlxuZXhwb3J0IGNvbnN0IFRIUk9UVExFRCA9IFwidGhyb3R0bGVkXCJcbmV4cG9ydCBjb25zdCBERUJPVU5DRV9QUkVWX0tFWSA9IFwiZGVib3VuY2UtcHJldi1rZXlcIlxuZXhwb3J0IGNvbnN0IERFRkFVTFRTID0ge1xuICBkZWJvdW5jZTogMzAwLFxuICB0aHJvdHRsZTogMzAwXG59XG5leHBvcnQgY29uc3QgUEhYX1BFTkRJTkdfQVRUUlMgPSBbUEhYX1JFRl9MT0FESU5HLCBQSFhfUkVGX1NSQywgUEhYX1JFRl9MT0NLXVxuLy8gUmVuZGVyZWRcbmV4cG9ydCBjb25zdCBEWU5BTUlDUyA9IFwiZFwiXG5leHBvcnQgY29uc3QgU1RBVElDID0gXCJzXCJcbmV4cG9ydCBjb25zdCBST09UID0gXCJyXCJcbmV4cG9ydCBjb25zdCBDT01QT05FTlRTID0gXCJjXCJcbmV4cG9ydCBjb25zdCBFVkVOVFMgPSBcImVcIlxuZXhwb3J0IGNvbnN0IFJFUExZID0gXCJyXCJcbmV4cG9ydCBjb25zdCBUSVRMRSA9IFwidFwiXG5leHBvcnQgY29uc3QgVEVNUExBVEVTID0gXCJwXCJcbmV4cG9ydCBjb25zdCBTVFJFQU0gPSBcInN0cmVhbVwiXG4iLCAiaW1wb3J0IHtcbiAgbG9nRXJyb3Jcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbnRyeVVwbG9hZGVyIHtcbiAgY29uc3RydWN0b3IoZW50cnksIGNvbmZpZywgbGl2ZVNvY2tldCl7XG4gICAgbGV0IHtjaHVua19zaXplLCBjaHVua190aW1lb3V0fSA9IGNvbmZpZ1xuICAgIHRoaXMubGl2ZVNvY2tldCA9IGxpdmVTb2NrZXRcbiAgICB0aGlzLmVudHJ5ID0gZW50cnlcbiAgICB0aGlzLm9mZnNldCA9IDBcbiAgICB0aGlzLmNodW5rU2l6ZSA9IGNodW5rX3NpemVcbiAgICB0aGlzLmNodW5rVGltZW91dCA9IGNodW5rX3RpbWVvdXRcbiAgICB0aGlzLmNodW5rVGltZXIgPSBudWxsXG4gICAgdGhpcy5lcnJvcmVkID0gZmFsc2VcbiAgICB0aGlzLnVwbG9hZENoYW5uZWwgPSBsaXZlU29ja2V0LmNoYW5uZWwoYGx2dToke2VudHJ5LnJlZn1gLCB7dG9rZW46IGVudHJ5Lm1ldGFkYXRhKCl9KVxuICB9XG5cbiAgZXJyb3IocmVhc29uKXtcbiAgICBpZih0aGlzLmVycm9yZWQpeyByZXR1cm4gfVxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5sZWF2ZSgpXG4gICAgdGhpcy5lcnJvcmVkID0gdHJ1ZVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmNodW5rVGltZXIpXG4gICAgdGhpcy5lbnRyeS5lcnJvcihyZWFzb24pXG4gIH1cblxuICB1cGxvYWQoKXtcbiAgICB0aGlzLnVwbG9hZENoYW5uZWwub25FcnJvcihyZWFzb24gPT4gdGhpcy5lcnJvcihyZWFzb24pKVxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5qb2luKClcbiAgICAgIC5yZWNlaXZlKFwib2tcIiwgX2RhdGEgPT4gdGhpcy5yZWFkTmV4dENodW5rKCkpXG4gICAgICAucmVjZWl2ZShcImVycm9yXCIsIHJlYXNvbiA9PiB0aGlzLmVycm9yKHJlYXNvbikpXG4gIH1cblxuICBpc0RvbmUoKXsgcmV0dXJuIHRoaXMub2Zmc2V0ID49IHRoaXMuZW50cnkuZmlsZS5zaXplIH1cblxuICByZWFkTmV4dENodW5rKCl7XG4gICAgbGV0IHJlYWRlciA9IG5ldyB3aW5kb3cuRmlsZVJlYWRlcigpXG4gICAgbGV0IGJsb2IgPSB0aGlzLmVudHJ5LmZpbGUuc2xpY2UodGhpcy5vZmZzZXQsIHRoaXMuY2h1bmtTaXplICsgdGhpcy5vZmZzZXQpXG4gICAgcmVhZGVyLm9ubG9hZCA9IChlKSA9PiB7XG4gICAgICBpZihlLnRhcmdldC5lcnJvciA9PT0gbnVsbCl7XG4gICAgICAgIHRoaXMub2Zmc2V0ICs9IGUudGFyZ2V0LnJlc3VsdC5ieXRlTGVuZ3RoXG4gICAgICAgIHRoaXMucHVzaENodW5rKGUudGFyZ2V0LnJlc3VsdClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBsb2dFcnJvcihcIlJlYWQgZXJyb3I6IFwiICsgZS50YXJnZXQuZXJyb3IpXG4gICAgICB9XG4gICAgfVxuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICB9XG5cbiAgcHVzaENodW5rKGNodW5rKXtcbiAgICBpZighdGhpcy51cGxvYWRDaGFubmVsLmlzSm9pbmVkKCkpeyByZXR1cm4gfVxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5wdXNoKFwiY2h1bmtcIiwgY2h1bmssIHRoaXMuY2h1bmtUaW1lb3V0KVxuICAgICAgLnJlY2VpdmUoXCJva1wiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW50cnkucHJvZ3Jlc3MoKHRoaXMub2Zmc2V0IC8gdGhpcy5lbnRyeS5maWxlLnNpemUpICogMTAwKVxuICAgICAgICBpZighdGhpcy5pc0RvbmUoKSl7XG4gICAgICAgICAgdGhpcy5jaHVua1RpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlYWROZXh0Q2h1bmsoKSwgdGhpcy5saXZlU29ja2V0LmdldExhdGVuY3lTaW0oKSB8fCAwKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCAoe3JlYXNvbn0pID0+IHRoaXMuZXJyb3IocmVhc29uKSlcbiAgfVxufVxuIiwgImltcG9ydCB7XG4gIFBIWF9WSUVXX1NFTEVDVE9SXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCBFbnRyeVVwbG9hZGVyIGZyb20gXCIuL2VudHJ5X3VwbG9hZGVyXCJcblxuZXhwb3J0IGxldCBsb2dFcnJvciA9IChtc2csIG9iaikgPT4gY29uc29sZS5lcnJvciAmJiBjb25zb2xlLmVycm9yKG1zZywgb2JqKVxuXG5leHBvcnQgbGV0IGlzQ2lkID0gKGNpZCkgPT4ge1xuICBsZXQgdHlwZSA9IHR5cGVvZihjaWQpXG4gIHJldHVybiB0eXBlID09PSBcIm51bWJlclwiIHx8ICh0eXBlID09PSBcInN0cmluZ1wiICYmIC9eKDB8WzEtOV1cXGQqKSQvLnRlc3QoY2lkKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRldGVjdER1cGxpY2F0ZUlkcygpe1xuICBsZXQgaWRzID0gbmV3IFNldCgpXG4gIGxldCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIqW2lkXVwiKVxuICBmb3IobGV0IGkgPSAwLCBsZW4gPSBlbGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgaWYoaWRzLmhhcyhlbGVtc1tpXS5pZCkpe1xuICAgICAgY29uc29sZS5lcnJvcihgTXVsdGlwbGUgSURzIGRldGVjdGVkOiAke2VsZW1zW2ldLmlkfS4gRW5zdXJlIHVuaXF1ZSBlbGVtZW50IGlkcy5gKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZHMuYWRkKGVsZW1zW2ldLmlkKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0SW52YWxpZFN0cmVhbUluc2VydHMoaW5zZXJ0cyl7XG4gIGNvbnN0IGVycm9ycyA9IG5ldyBTZXQoKVxuICBPYmplY3Qua2V5cyhpbnNlcnRzKS5mb3JFYWNoKChpZCkgPT4ge1xuICAgIGNvbnN0IHN0cmVhbUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXG4gICAgaWYoc3RyZWFtRWwgJiYgc3RyZWFtRWwucGFyZW50RWxlbWVudCAmJiBzdHJlYW1FbC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcInBoeC11cGRhdGVcIikgIT09IFwic3RyZWFtXCIpe1xuICAgICAgZXJyb3JzLmFkZChgVGhlIHN0cmVhbSBjb250YWluZXIgd2l0aCBpZCBcIiR7c3RyZWFtRWwucGFyZW50RWxlbWVudC5pZH1cIiBpcyBtaXNzaW5nIHRoZSBwaHgtdXBkYXRlPVwic3RyZWFtXCIgYXR0cmlidXRlLiBFbnN1cmUgaXQgaXMgc2V0IGZvciBzdHJlYW1zIHRvIHdvcmsgcHJvcGVybHkuYClcbiAgICB9XG4gIH0pXG4gIGVycm9ycy5mb3JFYWNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKVxufVxuXG5leHBvcnQgbGV0IGRlYnVnID0gKHZpZXcsIGtpbmQsIG1zZywgb2JqKSA9PiB7XG4gIGlmKHZpZXcubGl2ZVNvY2tldC5pc0RlYnVnRW5hYmxlZCgpKXtcbiAgICBjb25zb2xlLmxvZyhgJHt2aWV3LmlkfSAke2tpbmR9OiAke21zZ30gLSBgLCBvYmopXG4gIH1cbn1cblxuLy8gd3JhcHMgdmFsdWUgaW4gY2xvc3VyZSBvciByZXR1cm5zIGNsb3N1cmVcbmV4cG9ydCBsZXQgY2xvc3VyZSA9ICh2YWwpID0+IHR5cGVvZiB2YWwgPT09IFwiZnVuY3Rpb25cIiA/IHZhbCA6IGZ1bmN0aW9uICgpeyByZXR1cm4gdmFsIH1cblxuZXhwb3J0IGxldCBjbG9uZSA9IChvYmopID0+IHsgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSkgfVxuXG5leHBvcnQgbGV0IGNsb3Nlc3RQaHhCaW5kaW5nID0gKGVsLCBiaW5kaW5nLCBib3JkZXJFbCkgPT4ge1xuICBkbyB7XG4gICAgaWYoZWwubWF0Y2hlcyhgWyR7YmluZGluZ31dYCkgJiYgIWVsLmRpc2FibGVkKXsgcmV0dXJuIGVsIH1cbiAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQgfHwgZWwucGFyZW50Tm9kZVxuICB9IHdoaWxlKGVsICE9PSBudWxsICYmIGVsLm5vZGVUeXBlID09PSAxICYmICEoKGJvcmRlckVsICYmIGJvcmRlckVsLmlzU2FtZU5vZGUoZWwpKSB8fCBlbC5tYXRjaGVzKFBIWF9WSUVXX1NFTEVDVE9SKSkpXG4gIHJldHVybiBudWxsXG59XG5cbmV4cG9ydCBsZXQgaXNPYmplY3QgPSAob2JqKSA9PiB7XG4gIHJldHVybiBvYmogIT09IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiAmJiAhKG9iaiBpbnN0YW5jZW9mIEFycmF5KVxufVxuXG5leHBvcnQgbGV0IGlzRXF1YWxPYmogPSAob2JqMSwgb2JqMikgPT4gSlNPTi5zdHJpbmdpZnkob2JqMSkgPT09IEpTT04uc3RyaW5naWZ5KG9iajIpXG5cbmV4cG9ydCBsZXQgaXNFbXB0eSA9IChvYmopID0+IHtcbiAgZm9yKGxldCB4IGluIG9iail7IHJldHVybiBmYWxzZSB9XG4gIHJldHVybiB0cnVlXG59XG5cbmV4cG9ydCBsZXQgbWF5YmUgPSAoZWwsIGNhbGxiYWNrKSA9PiBlbCAmJiBjYWxsYmFjayhlbClcblxuZXhwb3J0IGxldCBjaGFubmVsVXBsb2FkZXIgPSBmdW5jdGlvbiAoZW50cmllcywgb25FcnJvciwgcmVzcCwgbGl2ZVNvY2tldCl7XG4gIGVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgbGV0IGVudHJ5VXBsb2FkZXIgPSBuZXcgRW50cnlVcGxvYWRlcihlbnRyeSwgcmVzcC5jb25maWcsIGxpdmVTb2NrZXQpXG4gICAgZW50cnlVcGxvYWRlci51cGxvYWQoKVxuICB9KVxufVxuIiwgImxldCBCcm93c2VyID0ge1xuICBjYW5QdXNoU3RhdGUoKXsgcmV0dXJuICh0eXBlb2YgKGhpc3RvcnkucHVzaFN0YXRlKSAhPT0gXCJ1bmRlZmluZWRcIikgfSxcblxuICBkcm9wTG9jYWwobG9jYWxTdG9yYWdlLCBuYW1lc3BhY2UsIHN1YmtleSl7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpKVxuICB9LFxuXG4gIHVwZGF0ZUxvY2FsKGxvY2FsU3RvcmFnZSwgbmFtZXNwYWNlLCBzdWJrZXksIGluaXRpYWwsIGZ1bmMpe1xuICAgIGxldCBjdXJyZW50ID0gdGhpcy5nZXRMb2NhbChsb2NhbFN0b3JhZ2UsIG5hbWVzcGFjZSwgc3Via2V5KVxuICAgIGxldCBrZXkgPSB0aGlzLmxvY2FsS2V5KG5hbWVzcGFjZSwgc3Via2V5KVxuICAgIGxldCBuZXdWYWwgPSBjdXJyZW50ID09PSBudWxsID8gaW5pdGlhbCA6IGZ1bmMoY3VycmVudClcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KG5ld1ZhbCkpXG4gICAgcmV0dXJuIG5ld1ZhbFxuICB9LFxuXG4gIGdldExvY2FsKGxvY2FsU3RvcmFnZSwgbmFtZXNwYWNlLCBzdWJrZXkpe1xuICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpKSlcbiAgfSxcblxuICB1cGRhdGVDdXJyZW50U3RhdGUoY2FsbGJhY2spe1xuICAgIGlmKCF0aGlzLmNhblB1c2hTdGF0ZSgpKXsgcmV0dXJuIH1cbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShjYWxsYmFjayhoaXN0b3J5LnN0YXRlIHx8IHt9KSwgXCJcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpXG4gIH0sXG5cbiAgcHVzaFN0YXRlKGtpbmQsIG1ldGEsIHRvKXtcbiAgICBpZih0aGlzLmNhblB1c2hTdGF0ZSgpKXtcbiAgICAgIGlmKHRvICE9PSB3aW5kb3cubG9jYXRpb24uaHJlZil7XG4gICAgICAgIGlmKG1ldGEudHlwZSA9PSBcInJlZGlyZWN0XCIgJiYgbWV0YS5zY3JvbGwpe1xuICAgICAgICAgIC8vIElmIHdlJ3JlIHJlZGlyZWN0aW5nIHN0b3JlIHRoZSBjdXJyZW50IHNjcm9sbFkgZm9yIHRoZSBjdXJyZW50IGhpc3Rvcnkgc3RhdGUuXG4gICAgICAgICAgbGV0IGN1cnJlbnRTdGF0ZSA9IGhpc3Rvcnkuc3RhdGUgfHwge31cbiAgICAgICAgICBjdXJyZW50U3RhdGUuc2Nyb2xsID0gbWV0YS5zY3JvbGxcbiAgICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShjdXJyZW50U3RhdGUsIFwiXCIsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKVxuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIG1ldGEuc2Nyb2xsIC8vIE9ubHkgc3RvcmUgdGhlIHNjcm9sbCBpbiB0aGUgcmVkaXJlY3QgY2FzZS5cbiAgICAgICAgaGlzdG9yeVtraW5kICsgXCJTdGF0ZVwiXShtZXRhLCBcIlwiLCB0byB8fCBudWxsKSAvLyBJRSB3aWxsIGNvZXJjZSB1bmRlZmluZWQgdG8gc3RyaW5nXG5cbiAgICAgICAgLy8gd2hlbiB1c2luZyBuYXZpZ2F0ZSwgd2UnZCBjYWxsIHB1c2hTdGF0ZSBpbW1lZGlhdGVseSBiZWZvcmUgcGF0Y2hpbmcgdGhlIERPTSxcbiAgICAgICAgLy8ganVtcGluZyBiYWNrIHRvIHRoZSB0b3Agb2YgdGhlIHBhZ2UsIGVmZmVjdGl2ZWx5IGlnbm9yaW5nIHRoZSBzY3JvbGxJbnRvVmlldztcbiAgICAgICAgLy8gdGhlcmVmb3JlIHdlIHdhaXQgZm9yIHRoZSBuZXh0IGZyYW1lIChhZnRlciB0aGUgRE9NIHBhdGNoKSBhbmQgb25seSB0aGVuIHRyeVxuICAgICAgICAvLyB0byBzY3JvbGwgdG8gdGhlIGhhc2hFbFxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBsZXQgaGFzaEVsID0gdGhpcy5nZXRIYXNoVGFyZ2V0RWwod2luZG93LmxvY2F0aW9uLmhhc2gpXG4gIFxuICAgICAgICAgIGlmKGhhc2hFbCl7XG4gICAgICAgICAgICBoYXNoRWwuc2Nyb2xsSW50b1ZpZXcoKVxuICAgICAgICAgIH0gZWxzZSBpZihtZXRhLnR5cGUgPT09IFwicmVkaXJlY3RcIil7XG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsKDAsIDApXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlZGlyZWN0KHRvKVxuICAgIH1cbiAgfSxcblxuICBzZXRDb29raWUobmFtZSwgdmFsdWUsIG1heEFnZVNlY29uZHMpe1xuICAgIGxldCBleHBpcmVzID0gdHlwZW9mKG1heEFnZVNlY29uZHMpID09PSBcIm51bWJlclwiID8gYCBtYXgtYWdlPSR7bWF4QWdlU2Vjb25kc307YCA6IFwiXCJcbiAgICBkb2N1bWVudC5jb29raWUgPSBgJHtuYW1lfT0ke3ZhbHVlfTske2V4cGlyZXN9IHBhdGg9L2BcbiAgfSxcblxuICBnZXRDb29raWUobmFtZSl7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNvb2tpZS5yZXBsYWNlKG5ldyBSZWdFeHAoYCg/Oig/Ol58Lio7XFxzKikke25hbWV9XFxzKlxcPVxccyooW147XSopLiokKXxeLiokYCksIFwiJDFcIilcbiAgfSxcblxuICBkZWxldGVDb29raWUobmFtZSl7XG4gICAgZG9jdW1lbnQuY29va2llID0gYCR7bmFtZX09OyBtYXgtYWdlPS0xOyBwYXRoPS9gXG4gIH0sXG5cbiAgcmVkaXJlY3QodG9VUkwsIGZsYXNoKXtcbiAgICBpZihmbGFzaCl7IHRoaXMuc2V0Q29va2llKFwiX19waG9lbml4X2ZsYXNoX19cIiwgZmxhc2gsIDYwKSB9XG4gICAgd2luZG93LmxvY2F0aW9uID0gdG9VUkxcbiAgfSxcblxuICBsb2NhbEtleShuYW1lc3BhY2UsIHN1YmtleSl7IHJldHVybiBgJHtuYW1lc3BhY2V9LSR7c3Via2V5fWAgfSxcblxuICBnZXRIYXNoVGFyZ2V0RWwobWF5YmVIYXNoKXtcbiAgICBsZXQgaGFzaCA9IG1heWJlSGFzaC50b1N0cmluZygpLnN1YnN0cmluZygxKVxuICAgIGlmKGhhc2ggPT09IFwiXCIpeyByZXR1cm4gfVxuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChoYXNoKSB8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBhW25hbWU9XCIke2hhc2h9XCJdYClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCcm93c2VyXG4iLCAiaW1wb3J0IHtcbiAgQ0hFQ0tBQkxFX0lOUFVUUyxcbiAgREVCT1VOQ0VfUFJFVl9LRVksXG4gIERFQk9VTkNFX1RSSUdHRVIsXG4gIEZPQ1VTQUJMRV9JTlBVVFMsXG4gIFBIWF9DT01QT05FTlQsXG4gIFBIWF9IQVNfRk9DVVNFRCxcbiAgUEhYX0hBU19TVUJNSVRURUQsXG4gIFBIWF9NQUlOLFxuICBQSFhfUEFSRU5UX0lELFxuICBQSFhfUFJJVkFURSxcbiAgUEhYX1JFRl9TUkMsXG4gIFBIWF9SRUZfTE9DSyxcbiAgUEhYX1BFTkRJTkdfQVRUUlMsXG4gIFBIWF9ST09UX0lELFxuICBQSFhfU0VTU0lPTixcbiAgUEhYX1NUQVRJQyxcbiAgUEhYX1VQTE9BRF9SRUYsXG4gIFBIWF9WSUVXX1NFTEVDVE9SLFxuICBQSFhfU1RJQ0tZLFxuICBQSFhfRVZFTlRfQ0xBU1NFUyxcbiAgVEhST1RUTEVELFxuICBQSFhfU1RSRUFNLFxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBsb2dFcnJvclxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmxldCBET00gPSB7XG4gIGJ5SWQoaWQpeyByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIHx8IGxvZ0Vycm9yKGBubyBpZCBmb3VuZCBmb3IgJHtpZH1gKSB9LFxuXG4gIHJlbW92ZUNsYXNzKGVsLCBjbGFzc05hbWUpe1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKVxuICAgIGlmKGVsLmNsYXNzTGlzdC5sZW5ndGggPT09IDApeyBlbC5yZW1vdmVBdHRyaWJ1dGUoXCJjbGFzc1wiKSB9XG4gIH0sXG5cbiAgYWxsKG5vZGUsIHF1ZXJ5LCBjYWxsYmFjayl7XG4gICAgaWYoIW5vZGUpeyByZXR1cm4gW10gfVxuICAgIGxldCBhcnJheSA9IEFycmF5LmZyb20obm9kZS5xdWVyeVNlbGVjdG9yQWxsKHF1ZXJ5KSlcbiAgICByZXR1cm4gY2FsbGJhY2sgPyBhcnJheS5mb3JFYWNoKGNhbGxiYWNrKSA6IGFycmF5XG4gIH0sXG5cbiAgY2hpbGROb2RlTGVuZ3RoKGh0bWwpe1xuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZW1wbGF0ZVwiKVxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWxcbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5jaGlsZEVsZW1lbnRDb3VudFxuICB9LFxuXG4gIGlzVXBsb2FkSW5wdXQoZWwpeyByZXR1cm4gZWwudHlwZSA9PT0gXCJmaWxlXCIgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSAhPT0gbnVsbCB9LFxuXG4gIGlzQXV0b1VwbG9hZChpbnB1dEVsKXsgcmV0dXJuIGlucHV0RWwuaGFzQXR0cmlidXRlKFwiZGF0YS1waHgtYXV0by11cGxvYWRcIikgfSxcblxuICBmaW5kVXBsb2FkSW5wdXRzKG5vZGUpe1xuICAgIGNvbnN0IGZvcm1JZCA9IG5vZGUuaWRcbiAgICBjb25zdCBpbnB1dHNPdXRzaWRlRm9ybSA9IHRoaXMuYWxsKGRvY3VtZW50LCBgaW5wdXRbdHlwZT1cImZpbGVcIl1bJHtQSFhfVVBMT0FEX1JFRn1dW2Zvcm09XCIke2Zvcm1JZH1cIl1gKVxuICAgIHJldHVybiB0aGlzLmFsbChub2RlLCBgaW5wdXRbdHlwZT1cImZpbGVcIl1bJHtQSFhfVVBMT0FEX1JFRn1dYCkuY29uY2F0KGlucHV0c091dHNpZGVGb3JtKVxuICB9LFxuXG4gIGZpbmRDb21wb25lbnROb2RlTGlzdChub2RlLCBjaWQpe1xuICAgIHJldHVybiB0aGlzLmZpbHRlcldpdGhpblNhbWVMaXZlVmlldyh0aGlzLmFsbChub2RlLCBgWyR7UEhYX0NPTVBPTkVOVH09XCIke2NpZH1cIl1gKSwgbm9kZSlcbiAgfSxcblxuICBpc1BoeERlc3Ryb3llZChub2RlKXtcbiAgICByZXR1cm4gbm9kZS5pZCAmJiBET00ucHJpdmF0ZShub2RlLCBcImRlc3Ryb3llZFwiKSA/IHRydWUgOiBmYWxzZVxuICB9LFxuXG4gIHdhbnRzTmV3VGFiKGUpe1xuICAgIGxldCB3YW50c05ld1RhYiA9IGUuY3RybEtleSB8fCBlLnNoaWZ0S2V5IHx8IGUubWV0YUtleSB8fCAoZS5idXR0b24gJiYgZS5idXR0b24gPT09IDEpXG4gICAgbGV0IGlzRG93bmxvYWQgPSAoZS50YXJnZXQgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCAmJiBlLnRhcmdldC5oYXNBdHRyaWJ1dGUoXCJkb3dubG9hZFwiKSlcbiAgICBsZXQgaXNUYXJnZXRCbGFuayA9IGUudGFyZ2V0Lmhhc0F0dHJpYnV0ZShcInRhcmdldFwiKSAmJiBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJ0YXJnZXRcIikudG9Mb3dlckNhc2UoKSA9PT0gXCJfYmxhbmtcIlxuICAgIGxldCBpc1RhcmdldE5hbWVkVGFiID0gZS50YXJnZXQuaGFzQXR0cmlidXRlKFwidGFyZ2V0XCIpICYmICFlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJ0YXJnZXRcIikuc3RhcnRzV2l0aChcIl9cIilcbiAgICByZXR1cm4gd2FudHNOZXdUYWIgfHwgaXNUYXJnZXRCbGFuayB8fCBpc0Rvd25sb2FkIHx8IGlzVGFyZ2V0TmFtZWRUYWJcbiAgfSxcblxuICBpc1VubG9hZGFibGVGb3JtU3VibWl0KGUpe1xuICAgIC8vIElnbm9yZSBmb3JtIHN1Ym1pc3Npb25zIGludGVuZGVkIHRvIGNsb3NlIGEgbmF0aXZlIDxkaWFsb2c+IGVsZW1lbnRcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVE1ML0VsZW1lbnQvZGlhbG9nI3VzYWdlX25vdGVzXG4gICAgbGV0IGlzRGlhbG9nU3VibWl0ID0gKGUudGFyZ2V0ICYmIGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcIm1ldGhvZFwiKSA9PT0gXCJkaWFsb2dcIikgfHxcbiAgICAgIChlLnN1Ym1pdHRlciAmJiBlLnN1Ym1pdHRlci5nZXRBdHRyaWJ1dGUoXCJmb3JtbWV0aG9kXCIpID09PSBcImRpYWxvZ1wiKVxuXG4gICAgaWYoaXNEaWFsb2dTdWJtaXQpe1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAhZS5kZWZhdWx0UHJldmVudGVkICYmICF0aGlzLndhbnRzTmV3VGFiKGUpXG4gICAgfVxuICB9LFxuXG4gIGlzTmV3UGFnZUNsaWNrKGUsIGN1cnJlbnRMb2NhdGlvbil7XG4gICAgbGV0IGhyZWYgPSBlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50ID8gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSA6IG51bGxcbiAgICBsZXQgdXJsXG5cbiAgICBpZihlLmRlZmF1bHRQcmV2ZW50ZWQgfHwgaHJlZiA9PT0gbnVsbCB8fCB0aGlzLndhbnRzTmV3VGFiKGUpKXsgcmV0dXJuIGZhbHNlIH1cbiAgICBpZihocmVmLnN0YXJ0c1dpdGgoXCJtYWlsdG86XCIpIHx8IGhyZWYuc3RhcnRzV2l0aChcInRlbDpcIikpeyByZXR1cm4gZmFsc2UgfVxuICAgIGlmKGUudGFyZ2V0LmlzQ29udGVudEVkaXRhYmxlKXsgcmV0dXJuIGZhbHNlIH1cblxuICAgIHRyeSB7XG4gICAgICB1cmwgPSBuZXcgVVJMKGhyZWYpXG4gICAgfSBjYXRjaCB7XG4gICAgICB0cnkge1xuICAgICAgICB1cmwgPSBuZXcgVVJMKGhyZWYsIGN1cnJlbnRMb2NhdGlvbilcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICAvLyBiYWQgVVJMLCBmYWxsYmFjayB0byBsZXQgYnJvd3NlciB0cnkgaXQgYXMgZXh0ZXJuYWxcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZih1cmwuaG9zdCA9PT0gY3VycmVudExvY2F0aW9uLmhvc3QgJiYgdXJsLnByb3RvY29sID09PSBjdXJyZW50TG9jYXRpb24ucHJvdG9jb2wpe1xuICAgICAgaWYodXJsLnBhdGhuYW1lID09PSBjdXJyZW50TG9jYXRpb24ucGF0aG5hbWUgJiYgdXJsLnNlYXJjaCA9PT0gY3VycmVudExvY2F0aW9uLnNlYXJjaCl7XG4gICAgICAgIHJldHVybiB1cmwuaGFzaCA9PT0gXCJcIiAmJiAhdXJsLmhyZWYuZW5kc1dpdGgoXCIjXCIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1cmwucHJvdG9jb2wuc3RhcnRzV2l0aChcImh0dHBcIilcbiAgfSxcblxuICBtYXJrUGh4Q2hpbGREZXN0cm95ZWQoZWwpe1xuICAgIGlmKHRoaXMuaXNQaHhDaGlsZChlbCkpeyBlbC5zZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04sIFwiXCIpIH1cbiAgICB0aGlzLnB1dFByaXZhdGUoZWwsIFwiZGVzdHJveWVkXCIsIHRydWUpXG4gIH0sXG5cbiAgZmluZFBoeENoaWxkcmVuSW5GcmFnbWVudChodG1sLCBwYXJlbnRJZCl7XG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFxuICAgIHJldHVybiB0aGlzLmZpbmRQaHhDaGlsZHJlbih0ZW1wbGF0ZS5jb250ZW50LCBwYXJlbnRJZClcbiAgfSxcblxuICBpc0lnbm9yZWQoZWwsIHBoeFVwZGF0ZSl7XG4gICAgcmV0dXJuIChlbC5nZXRBdHRyaWJ1dGUocGh4VXBkYXRlKSB8fCBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBoeC11cGRhdGVcIikpID09PSBcImlnbm9yZVwiXG4gIH0sXG5cbiAgaXNQaHhVcGRhdGUoZWwsIHBoeFVwZGF0ZSwgdXBkYXRlVHlwZXMpe1xuICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUgJiYgdXBkYXRlVHlwZXMuaW5kZXhPZihlbC5nZXRBdHRyaWJ1dGUocGh4VXBkYXRlKSkgPj0gMFxuICB9LFxuXG4gIGZpbmRQaHhTdGlja3koZWwpeyByZXR1cm4gdGhpcy5hbGwoZWwsIGBbJHtQSFhfU1RJQ0tZfV1gKSB9LFxuXG4gIGZpbmRQaHhDaGlsZHJlbihlbCwgcGFyZW50SWQpe1xuICAgIHJldHVybiB0aGlzLmFsbChlbCwgYCR7UEhYX1ZJRVdfU0VMRUNUT1J9WyR7UEhYX1BBUkVOVF9JRH09XCIke3BhcmVudElkfVwiXWApXG4gIH0sXG5cbiAgZmluZEV4aXN0aW5nUGFyZW50Q0lEcyhub2RlLCBjaWRzKXtcbiAgICAvLyB3ZSBvbmx5IHdhbnQgdG8gZmluZCBwYXJlbnRzIHRoYXQgZXhpc3Qgb24gdGhlIHBhZ2VcbiAgICAvLyBpZiBhIGNpZCBpcyBub3Qgb24gdGhlIHBhZ2UsIHRoZSBvbmx5IHdheSBpdCBjYW4gYmUgYWRkZWQgYmFjayB0byB0aGUgcGFnZVxuICAgIC8vIGlzIGlmIGEgcGFyZW50IGFkZHMgaXQgYmFjaywgdGhlcmVmb3JlIGlmIGEgY2lkIGRvZXMgbm90IGV4aXN0IG9uIHRoZSBwYWdlLFxuICAgIC8vIHdlIHNob3VsZCBub3QgdHJ5IHRvIHJlbmRlciBpdCBieSBpdHNlbGYgKGJlY2F1c2UgaXQgd291bGQgYmUgcmVuZGVyZWQgdHdpY2UsXG4gICAgLy8gb25lIGJ5IHRoZSBwYXJlbnQsIGFuZCBhIHNlY29uZCB0aW1lIGJ5IGl0c2VsZilcbiAgICBsZXQgcGFyZW50Q2lkcyA9IG5ldyBTZXQoKVxuICAgIGxldCBjaGlsZHJlbkNpZHMgPSBuZXcgU2V0KClcblxuICAgIGNpZHMuZm9yRWFjaChjaWQgPT4ge1xuICAgICAgdGhpcy5maWx0ZXJXaXRoaW5TYW1lTGl2ZVZpZXcodGhpcy5hbGwobm9kZSwgYFske1BIWF9DT01QT05FTlR9PVwiJHtjaWR9XCJdYCksIG5vZGUpLmZvckVhY2gocGFyZW50ID0+IHtcbiAgICAgICAgcGFyZW50Q2lkcy5hZGQoY2lkKVxuICAgICAgICB0aGlzLmZpbHRlcldpdGhpblNhbWVMaXZlVmlldyh0aGlzLmFsbChwYXJlbnQsIGBbJHtQSFhfQ09NUE9ORU5UfV1gKSwgcGFyZW50KVxuICAgICAgICAgIC5tYXAoZWwgPT4gcGFyc2VJbnQoZWwuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpKSlcbiAgICAgICAgICAuZm9yRWFjaChjaGlsZENJRCA9PiBjaGlsZHJlbkNpZHMuYWRkKGNoaWxkQ0lEKSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGNoaWxkcmVuQ2lkcy5mb3JFYWNoKGNoaWxkQ2lkID0+IHBhcmVudENpZHMuZGVsZXRlKGNoaWxkQ2lkKSlcblxuICAgIHJldHVybiBwYXJlbnRDaWRzXG4gIH0sXG5cbiAgZmlsdGVyV2l0aGluU2FtZUxpdmVWaWV3KG5vZGVzLCBwYXJlbnQpe1xuICAgIGlmKHBhcmVudC5xdWVyeVNlbGVjdG9yKFBIWF9WSUVXX1NFTEVDVE9SKSl7XG4gICAgICByZXR1cm4gbm9kZXMuZmlsdGVyKGVsID0+IHRoaXMud2l0aGluU2FtZUxpdmVWaWV3KGVsLCBwYXJlbnQpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbm9kZXNcbiAgICB9XG4gIH0sXG5cbiAgd2l0aGluU2FtZUxpdmVWaWV3KG5vZGUsIHBhcmVudCl7XG4gICAgd2hpbGUobm9kZSA9IG5vZGUucGFyZW50Tm9kZSl7XG4gICAgICBpZihub2RlLmlzU2FtZU5vZGUocGFyZW50KSl7IHJldHVybiB0cnVlIH1cbiAgICAgIGlmKG5vZGUuZ2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OKSAhPT0gbnVsbCl7IHJldHVybiBmYWxzZSB9XG4gICAgfVxuICB9LFxuXG4gIHByaXZhdGUoZWwsIGtleSl7IHJldHVybiBlbFtQSFhfUFJJVkFURV0gJiYgZWxbUEhYX1BSSVZBVEVdW2tleV0gfSxcblxuICBkZWxldGVQcml2YXRlKGVsLCBrZXkpeyBlbFtQSFhfUFJJVkFURV0gJiYgZGVsZXRlIChlbFtQSFhfUFJJVkFURV1ba2V5XSkgfSxcblxuICBwdXRQcml2YXRlKGVsLCBrZXksIHZhbHVlKXtcbiAgICBpZighZWxbUEhYX1BSSVZBVEVdKXsgZWxbUEhYX1BSSVZBVEVdID0ge30gfVxuICAgIGVsW1BIWF9QUklWQVRFXVtrZXldID0gdmFsdWVcbiAgfSxcblxuICB1cGRhdGVQcml2YXRlKGVsLCBrZXksIGRlZmF1bHRWYWwsIHVwZGF0ZUZ1bmMpe1xuICAgIGxldCBleGlzdGluZyA9IHRoaXMucHJpdmF0ZShlbCwga2V5KVxuICAgIGlmKGV4aXN0aW5nID09PSB1bmRlZmluZWQpe1xuICAgICAgdGhpcy5wdXRQcml2YXRlKGVsLCBrZXksIHVwZGF0ZUZ1bmMoZGVmYXVsdFZhbCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHV0UHJpdmF0ZShlbCwga2V5LCB1cGRhdGVGdW5jKGV4aXN0aW5nKSlcbiAgICB9XG4gIH0sXG5cbiAgc3luY1BlbmRpbmdBdHRycyhmcm9tRWwsIHRvRWwpe1xuICAgIGlmKCFmcm9tRWwuaGFzQXR0cmlidXRlKFBIWF9SRUZfU1JDKSl7IHJldHVybiB9XG4gICAgUEhYX0VWRU5UX0NMQVNTRVMuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgZnJvbUVsLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpICYmIHRvRWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpXG4gICAgfSlcbiAgICBQSFhfUEVORElOR19BVFRSUy5maWx0ZXIoYXR0ciA9PiBmcm9tRWwuaGFzQXR0cmlidXRlKGF0dHIpKS5mb3JFYWNoKGF0dHIgPT4ge1xuICAgICAgdG9FbC5zZXRBdHRyaWJ1dGUoYXR0ciwgZnJvbUVsLmdldEF0dHJpYnV0ZShhdHRyKSlcbiAgICB9KVxuICB9LFxuXG4gIGNvcHlQcml2YXRlcyh0YXJnZXQsIHNvdXJjZSl7XG4gICAgaWYoc291cmNlW1BIWF9QUklWQVRFXSl7XG4gICAgICB0YXJnZXRbUEhYX1BSSVZBVEVdID0gc291cmNlW1BIWF9QUklWQVRFXVxuICAgIH1cbiAgfSxcblxuICBwdXRUaXRsZShzdHIpe1xuICAgIGxldCB0aXRsZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRpdGxlXCIpXG4gICAgaWYodGl0bGVFbCl7XG4gICAgICBsZXQge3ByZWZpeCwgc3VmZml4LCBkZWZhdWx0OiBkZWZhdWx0VGl0bGV9ID0gdGl0bGVFbC5kYXRhc2V0XG4gICAgICBsZXQgaXNFbXB0eSA9IHR5cGVvZihzdHIpICE9PSBcInN0cmluZ1wiIHx8IHN0ci50cmltKCkgPT09IFwiXCJcbiAgICAgIGlmKGlzRW1wdHkgJiYgdHlwZW9mKGRlZmF1bHRUaXRsZSkgIT09IFwic3RyaW5nXCIpeyByZXR1cm4gfVxuXG4gICAgICBsZXQgaW5uZXIgPSBpc0VtcHR5ID8gZGVmYXVsdFRpdGxlIDogc3RyXG4gICAgICBkb2N1bWVudC50aXRsZSA9IGAke3ByZWZpeCB8fCBcIlwifSR7aW5uZXIgfHwgXCJcIn0ke3N1ZmZpeCB8fCBcIlwifWBcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQudGl0bGUgPSBzdHJcbiAgICB9XG4gIH0sXG5cbiAgZGVib3VuY2UoZWwsIGV2ZW50LCBwaHhEZWJvdW5jZSwgZGVmYXVsdERlYm91bmNlLCBwaHhUaHJvdHRsZSwgZGVmYXVsdFRocm90dGxlLCBhc3luY0ZpbHRlciwgY2FsbGJhY2spe1xuICAgIGxldCBkZWJvdW5jZSA9IGVsLmdldEF0dHJpYnV0ZShwaHhEZWJvdW5jZSlcbiAgICBsZXQgdGhyb3R0bGUgPSBlbC5nZXRBdHRyaWJ1dGUocGh4VGhyb3R0bGUpXG5cbiAgICBpZihkZWJvdW5jZSA9PT0gXCJcIil7IGRlYm91bmNlID0gZGVmYXVsdERlYm91bmNlIH1cbiAgICBpZih0aHJvdHRsZSA9PT0gXCJcIil7IHRocm90dGxlID0gZGVmYXVsdFRocm90dGxlIH1cbiAgICBsZXQgdmFsdWUgPSBkZWJvdW5jZSB8fCB0aHJvdHRsZVxuICAgIHN3aXRjaCh2YWx1ZSl7XG4gICAgICBjYXNlIG51bGw6IHJldHVybiBjYWxsYmFjaygpXG5cbiAgICAgIGNhc2UgXCJibHVyXCI6XG4gICAgICAgIHRoaXMuaW5jQ3ljbGUoZWwsIFwiZGVib3VuY2UtYmx1ci1jeWNsZVwiLCAoKSA9PiB7XG4gICAgICAgICAgaWYoYXN5bmNGaWx0ZXIoKSl7IGNhbGxiYWNrKCkgfVxuICAgICAgICB9KVxuICAgICAgICBpZih0aGlzLm9uY2UoZWwsIFwiZGVib3VuY2UtYmx1clwiKSl7XG4gICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgKCkgPT4gdGhpcy50cmlnZ2VyQ3ljbGUoZWwsIFwiZGVib3VuY2UtYmx1ci1jeWNsZVwiKSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGV0IHRpbWVvdXQgPSBwYXJzZUludCh2YWx1ZSlcbiAgICAgICAgbGV0IHRyaWdnZXIgPSAoKSA9PiB0aHJvdHRsZSA/IHRoaXMuZGVsZXRlUHJpdmF0ZShlbCwgVEhST1RUTEVEKSA6IGNhbGxiYWNrKClcbiAgICAgICAgbGV0IGN1cnJlbnRDeWNsZSA9IHRoaXMuaW5jQ3ljbGUoZWwsIERFQk9VTkNFX1RSSUdHRVIsIHRyaWdnZXIpXG4gICAgICAgIGlmKGlzTmFOKHRpbWVvdXQpKXsgcmV0dXJuIGxvZ0Vycm9yKGBpbnZhbGlkIHRocm90dGxlL2RlYm91bmNlIHZhbHVlOiAke3ZhbHVlfWApIH1cbiAgICAgICAgaWYodGhyb3R0bGUpe1xuICAgICAgICAgIGxldCBuZXdLZXlEb3duID0gZmFsc2VcbiAgICAgICAgICBpZihldmVudC50eXBlID09PSBcImtleWRvd25cIil7XG4gICAgICAgICAgICBsZXQgcHJldktleSA9IHRoaXMucHJpdmF0ZShlbCwgREVCT1VOQ0VfUFJFVl9LRVkpXG4gICAgICAgICAgICB0aGlzLnB1dFByaXZhdGUoZWwsIERFQk9VTkNFX1BSRVZfS0VZLCBldmVudC5rZXkpXG4gICAgICAgICAgICBuZXdLZXlEb3duID0gcHJldktleSAhPT0gZXZlbnQua2V5XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYoIW5ld0tleURvd24gJiYgdGhpcy5wcml2YXRlKGVsLCBUSFJPVFRMRUQpKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgICAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIGlmKGFzeW5jRmlsdGVyKCkpeyB0aGlzLnRyaWdnZXJDeWNsZShlbCwgREVCT1VOQ0VfVFJJR0dFUikgfVxuICAgICAgICAgICAgfSwgdGltZW91dClcbiAgICAgICAgICAgIHRoaXMucHV0UHJpdmF0ZShlbCwgVEhST1RUTEVELCB0KVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmKGFzeW5jRmlsdGVyKCkpeyB0aGlzLnRyaWdnZXJDeWNsZShlbCwgREVCT1VOQ0VfVFJJR0dFUiwgY3VycmVudEN5Y2xlKSB9XG4gICAgICAgICAgfSwgdGltZW91dClcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmb3JtID0gZWwuZm9ybVxuICAgICAgICBpZihmb3JtICYmIHRoaXMub25jZShmb3JtLCBcImJpbmQtZGVib3VuY2VcIikpe1xuICAgICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBBcnJheS5mcm9tKChuZXcgRm9ybURhdGEoZm9ybSkpLmVudHJpZXMoKSwgKFtuYW1lXSkgPT4ge1xuICAgICAgICAgICAgICBsZXQgaW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoYFtuYW1lPVwiJHtuYW1lfVwiXWApXG4gICAgICAgICAgICAgIHRoaXMuaW5jQ3ljbGUoaW5wdXQsIERFQk9VTkNFX1RSSUdHRVIpXG4gICAgICAgICAgICAgIHRoaXMuZGVsZXRlUHJpdmF0ZShpbnB1dCwgVEhST1RUTEVEKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMub25jZShlbCwgXCJiaW5kLWRlYm91bmNlXCIpKXtcbiAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyBiZWNhdXNlIHdlIHRyaWdnZXIgdGhlIGNhbGxiYWNrIGhlcmUsXG4gICAgICAgICAgICAvLyB3ZSBhbHNvIGNsZWFyIHRoZSB0aHJvdHRsZSB0aW1lb3V0IHRvIHByZXZlbnQgdGhlIGNhbGxiYWNrXG4gICAgICAgICAgICAvLyBmcm9tIGJlaW5nIGNhbGxlZCBhZ2FpbiBhZnRlciB0aGUgdGltZW91dCBmaXJlc1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucHJpdmF0ZShlbCwgVEhST1RUTEVEKSlcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckN5Y2xlKGVsLCBERUJPVU5DRV9UUklHR0VSKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgdHJpZ2dlckN5Y2xlKGVsLCBrZXksIGN1cnJlbnRDeWNsZSl7XG4gICAgbGV0IFtjeWNsZSwgdHJpZ2dlcl0gPSB0aGlzLnByaXZhdGUoZWwsIGtleSlcbiAgICBpZighY3VycmVudEN5Y2xlKXsgY3VycmVudEN5Y2xlID0gY3ljbGUgfVxuICAgIGlmKGN1cnJlbnRDeWNsZSA9PT0gY3ljbGUpe1xuICAgICAgdGhpcy5pbmNDeWNsZShlbCwga2V5KVxuICAgICAgdHJpZ2dlcigpXG4gICAgfVxuICB9LFxuXG4gIG9uY2UoZWwsIGtleSl7XG4gICAgaWYodGhpcy5wcml2YXRlKGVsLCBrZXkpID09PSB0cnVlKXsgcmV0dXJuIGZhbHNlIH1cbiAgICB0aGlzLnB1dFByaXZhdGUoZWwsIGtleSwgdHJ1ZSlcbiAgICByZXR1cm4gdHJ1ZVxuICB9LFxuXG4gIGluY0N5Y2xlKGVsLCBrZXksIHRyaWdnZXIgPSBmdW5jdGlvbiAoKXsgfSl7XG4gICAgbGV0IFtjdXJyZW50Q3ljbGVdID0gdGhpcy5wcml2YXRlKGVsLCBrZXkpIHx8IFswLCB0cmlnZ2VyXVxuICAgIGN1cnJlbnRDeWNsZSsrXG4gICAgdGhpcy5wdXRQcml2YXRlKGVsLCBrZXksIFtjdXJyZW50Q3ljbGUsIHRyaWdnZXJdKVxuICAgIHJldHVybiBjdXJyZW50Q3ljbGVcbiAgfSxcblxuICAvLyBtYWludGFpbnMgb3IgYWRkcyBwcml2YXRlbHkgdXNlZCBob29rIGluZm9ybWF0aW9uXG4gIC8vIGZyb21FbCBhbmQgdG9FbCBjYW4gYmUgdGhlIHNhbWUgZWxlbWVudCBpbiB0aGUgY2FzZSBvZiBhIG5ld2x5IGFkZGVkIG5vZGVcbiAgLy8gZnJvbUVsIGFuZCB0b0VsIGNhbiBiZSBhbnkgSFRNTCBub2RlIHR5cGUsIHNvIHdlIG5lZWQgdG8gY2hlY2sgaWYgaXQncyBhbiBlbGVtZW50IG5vZGVcbiAgbWFpbnRhaW5Qcml2YXRlSG9va3MoZnJvbUVsLCB0b0VsLCBwaHhWaWV3cG9ydFRvcCwgcGh4Vmlld3BvcnRCb3R0b20pe1xuICAgIC8vIG1haW50YWluIHRoZSBob29rcyBjcmVhdGVkIHdpdGggY3JlYXRlSG9va1xuICAgIGlmKGZyb21FbC5oYXNBdHRyaWJ1dGUgJiYgZnJvbUVsLmhhc0F0dHJpYnV0ZShcImRhdGEtcGh4LWhvb2tcIikgJiYgIXRvRWwuaGFzQXR0cmlidXRlKFwiZGF0YS1waHgtaG9va1wiKSl7XG4gICAgICB0b0VsLnNldEF0dHJpYnV0ZShcImRhdGEtcGh4LWhvb2tcIiwgZnJvbUVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGh4LWhvb2tcIikpXG4gICAgfVxuICAgIC8vIGFkZCBob29rcyB0byBlbGVtZW50cyB3aXRoIHZpZXdwb3J0IGF0dHJpYnV0ZXNcbiAgICBpZih0b0VsLmhhc0F0dHJpYnV0ZSAmJiAodG9FbC5oYXNBdHRyaWJ1dGUocGh4Vmlld3BvcnRUb3ApIHx8IHRvRWwuaGFzQXR0cmlidXRlKHBoeFZpZXdwb3J0Qm90dG9tKSkpe1xuICAgICAgdG9FbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXBoeC1ob29rXCIsIFwiUGhvZW5peC5JbmZpbml0ZVNjcm9sbFwiKVxuICAgIH1cbiAgfSxcblxuICBwdXRDdXN0b21FbEhvb2soZWwsIGhvb2spe1xuICAgIGlmKGVsLmlzQ29ubmVjdGVkKXtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShcImRhdGEtcGh4LWhvb2tcIiwgXCJcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcihgXG4gICAgICAgIGhvb2sgYXR0YWNoZWQgdG8gbm9uLWNvbm5lY3RlZCBET00gZWxlbWVudFxuICAgICAgICBlbnN1cmUgeW91IGFyZSBjYWxsaW5nIGNyZWF0ZUhvb2sgd2l0aGluIHlvdXIgY29ubmVjdGVkQ2FsbGJhY2suICR7ZWwub3V0ZXJIVE1MfVxuICAgICAgYClcbiAgICB9XG4gICAgdGhpcy5wdXRQcml2YXRlKGVsLCBcImN1c3RvbS1lbC1ob29rXCIsIGhvb2spXG4gIH0sXG5cbiAgZ2V0Q3VzdG9tRWxIb29rKGVsKXsgcmV0dXJuIHRoaXMucHJpdmF0ZShlbCwgXCJjdXN0b20tZWwtaG9va1wiKSB9LFxuXG4gIGlzVXNlZElucHV0KGVsKXtcbiAgICByZXR1cm4gKGVsLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSAmJlxuICAgICAgKHRoaXMucHJpdmF0ZShlbCwgUEhYX0hBU19GT0NVU0VEKSB8fCB0aGlzLnByaXZhdGUoZWwsIFBIWF9IQVNfU1VCTUlUVEVEKSkpXG4gIH0sXG5cbiAgcmVzZXRGb3JtKGZvcm0pe1xuICAgIEFycmF5LmZyb20oZm9ybS5lbGVtZW50cykuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICB0aGlzLmRlbGV0ZVByaXZhdGUoaW5wdXQsIFBIWF9IQVNfRk9DVVNFRClcbiAgICAgIHRoaXMuZGVsZXRlUHJpdmF0ZShpbnB1dCwgUEhYX0hBU19TVUJNSVRURUQpXG4gICAgfSlcbiAgfSxcblxuICBpc1BoeENoaWxkKG5vZGUpe1xuICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lEKVxuICB9LFxuXG4gIGlzUGh4U3RpY2t5KG5vZGUpe1xuICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZShQSFhfU1RJQ0tZKSAhPT0gbnVsbFxuICB9LFxuXG4gIGlzQ2hpbGRPZkFueShlbCwgcGFyZW50cyl7XG4gICAgcmV0dXJuICEhcGFyZW50cy5maW5kKHBhcmVudCA9PiBwYXJlbnQuY29udGFpbnMoZWwpKVxuICB9LFxuXG4gIGZpcnN0UGh4Q2hpbGQoZWwpe1xuICAgIHJldHVybiB0aGlzLmlzUGh4Q2hpbGQoZWwpID8gZWwgOiB0aGlzLmFsbChlbCwgYFske1BIWF9QQVJFTlRfSUR9XWApWzBdXG4gIH0sXG5cbiAgZGlzcGF0Y2hFdmVudCh0YXJnZXQsIG5hbWUsIG9wdHMgPSB7fSl7XG4gICAgbGV0IGRlZmF1bHRCdWJibGUgPSB0cnVlXG4gICAgbGV0IGlzVXBsb2FkVGFyZ2V0ID0gdGFyZ2V0Lm5vZGVOYW1lID09PSBcIklOUFVUXCIgJiYgdGFyZ2V0LnR5cGUgPT09IFwiZmlsZVwiXG4gICAgaWYoaXNVcGxvYWRUYXJnZXQgJiYgbmFtZSA9PT0gXCJjbGlja1wiKXtcbiAgICAgIGRlZmF1bHRCdWJibGUgPSBmYWxzZVxuICAgIH1cbiAgICBsZXQgYnViYmxlcyA9IG9wdHMuYnViYmxlcyA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdEJ1YmJsZSA6ICEhb3B0cy5idWJibGVzXG4gICAgbGV0IGV2ZW50T3B0cyA9IHtidWJibGVzOiBidWJibGVzLCBjYW5jZWxhYmxlOiB0cnVlLCBkZXRhaWw6IG9wdHMuZGV0YWlsIHx8IHt9fVxuICAgIGxldCBldmVudCA9IG5hbWUgPT09IFwiY2xpY2tcIiA/IG5ldyBNb3VzZUV2ZW50KFwiY2xpY2tcIiwgZXZlbnRPcHRzKSA6IG5ldyBDdXN0b21FdmVudChuYW1lLCBldmVudE9wdHMpXG4gICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gIH0sXG5cbiAgY2xvbmVOb2RlKG5vZGUsIGh0bWwpe1xuICAgIGlmKHR5cGVvZiAoaHRtbCkgPT09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgcmV0dXJuIG5vZGUuY2xvbmVOb2RlKHRydWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBjbG9uZWQgPSBub2RlLmNsb25lTm9kZShmYWxzZSlcbiAgICAgIGNsb25lZC5pbm5lckhUTUwgPSBodG1sXG4gICAgICByZXR1cm4gY2xvbmVkXG4gICAgfVxuICB9LFxuXG4gIC8vIG1lcmdlIGF0dHJpYnV0ZXMgZnJvbSBzb3VyY2UgdG8gdGFyZ2V0XG4gIC8vIGlmIGFuIGVsZW1lbnQgaXMgaWdub3JlZCwgd2Ugb25seSBtZXJnZSBkYXRhIGF0dHJpYnV0ZXNcbiAgLy8gaW5jbHVkaW5nIHJlbW92aW5nIGRhdGEgYXR0cmlidXRlcyB0aGF0IGFyZSBubyBsb25nZXIgaW4gdGhlIHNvdXJjZVxuICBtZXJnZUF0dHJzKHRhcmdldCwgc291cmNlLCBvcHRzID0ge30pe1xuICAgIGxldCBleGNsdWRlID0gbmV3IFNldChvcHRzLmV4Y2x1ZGUgfHwgW10pXG4gICAgbGV0IGlzSWdub3JlZCA9IG9wdHMuaXNJZ25vcmVkXG4gICAgbGV0IHNvdXJjZUF0dHJzID0gc291cmNlLmF0dHJpYnV0ZXNcbiAgICBmb3IobGV0IGkgPSBzb3VyY2VBdHRycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSl7XG4gICAgICBsZXQgbmFtZSA9IHNvdXJjZUF0dHJzW2ldLm5hbWVcbiAgICAgIGlmKCFleGNsdWRlLmhhcyhuYW1lKSl7XG4gICAgICAgIGNvbnN0IHNvdXJjZVZhbHVlID0gc291cmNlLmdldEF0dHJpYnV0ZShuYW1lKVxuICAgICAgICBpZih0YXJnZXQuZ2V0QXR0cmlidXRlKG5hbWUpICE9PSBzb3VyY2VWYWx1ZSAmJiAoIWlzSWdub3JlZCB8fCAoaXNJZ25vcmVkICYmIG5hbWUuc3RhcnRzV2l0aChcImRhdGEtXCIpKSkpe1xuICAgICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUobmFtZSwgc291cmNlVmFsdWUpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFdlIGV4Y2x1ZGUgdGhlIHZhbHVlIGZyb20gYmVpbmcgbWVyZ2VkIG9uIGZvY3VzZWQgaW5wdXRzLCBiZWNhdXNlIHRoZVxuICAgICAgICAvLyB1c2VyJ3MgaW5wdXQgc2hvdWxkIGFsd2F5cyB3aW4uXG4gICAgICAgIC8vIFdlIGNhbiBzdGlsbCBhc3NpZ24gaXQgYXMgbG9uZyBhcyB0aGUgdmFsdWUgcHJvcGVydHkgaXMgdGhlIHNhbWUsIHRob3VnaC5cbiAgICAgICAgLy8gVGhpcyBwcmV2ZW50cyBhIHNpdHVhdGlvbiB3aGVyZSB0aGUgdXBkYXRlZCBob29rIGlzIG5vdCBiZWluZyB0cmlnZ2VyZWRcbiAgICAgICAgLy8gd2hlbiBhbiBpbnB1dCBpcyBiYWNrIGluIGl0cyBcIm9yaWdpbmFsIHN0YXRlXCIsIGJlY2F1c2UgdGhlIGF0dHJpYnV0ZVxuICAgICAgICAvLyB3YXMgbmV2ZXIgY2hhbmdlZCwgc2VlOlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9pc3N1ZXMvMjE2M1xuICAgICAgICBpZihuYW1lID09PSBcInZhbHVlXCIgJiYgdGFyZ2V0LnZhbHVlID09PSBzb3VyY2UudmFsdWUpe1xuICAgICAgICAgIC8vIGFjdHVhbGx5IHNldCB0aGUgdmFsdWUgYXR0cmlidXRlIHRvIHN5bmMgaXQgd2l0aCB0aGUgdmFsdWUgcHJvcGVydHlcbiAgICAgICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgc291cmNlLmdldEF0dHJpYnV0ZShuYW1lKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCB0YXJnZXRBdHRycyA9IHRhcmdldC5hdHRyaWJ1dGVzXG4gICAgZm9yKGxldCBpID0gdGFyZ2V0QXR0cnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pe1xuICAgICAgbGV0IG5hbWUgPSB0YXJnZXRBdHRyc1tpXS5uYW1lXG4gICAgICBpZihpc0lnbm9yZWQpe1xuICAgICAgICBpZihuYW1lLnN0YXJ0c1dpdGgoXCJkYXRhLVwiKSAmJiAhc291cmNlLmhhc0F0dHJpYnV0ZShuYW1lKSAmJiAhUEhYX1BFTkRJTkdfQVRUUlMuaW5jbHVkZXMobmFtZSkpeyB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKG5hbWUpIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCFzb3VyY2UuaGFzQXR0cmlidXRlKG5hbWUpKXsgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShuYW1lKSB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIG1lcmdlRm9jdXNlZElucHV0KHRhcmdldCwgc291cmNlKXtcbiAgICAvLyBza2lwIHNlbGVjdHMgYmVjYXVzZSBGRiB3aWxsIHJlc2V0IGhpZ2hsaWdodGVkIGluZGV4IGZvciBhbnkgc2V0QXR0cmlidXRlXG4gICAgaWYoISh0YXJnZXQgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCkpeyBET00ubWVyZ2VBdHRycyh0YXJnZXQsIHNvdXJjZSwge2V4Y2x1ZGU6IFtcInZhbHVlXCJdfSkgfVxuXG4gICAgaWYoc291cmNlLnJlYWRPbmx5KXtcbiAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJyZWFkb25seVwiLCB0cnVlKVxuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKFwicmVhZG9ubHlcIilcbiAgICB9XG4gIH0sXG5cbiAgaGFzU2VsZWN0aW9uUmFuZ2UoZWwpe1xuICAgIHJldHVybiBlbC5zZXRTZWxlY3Rpb25SYW5nZSAmJiAoZWwudHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZWwudHlwZSA9PT0gXCJ0ZXh0YXJlYVwiKVxuICB9LFxuXG4gIHJlc3RvcmVGb2N1cyhmb2N1c2VkLCBzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKXtcbiAgICBpZihmb2N1c2VkIGluc3RhbmNlb2YgSFRNTFNlbGVjdEVsZW1lbnQpeyBmb2N1c2VkLmZvY3VzKCkgfVxuICAgIGlmKCFET00uaXNUZXh0dWFsSW5wdXQoZm9jdXNlZCkpeyByZXR1cm4gfVxuXG4gICAgbGV0IHdhc0ZvY3VzZWQgPSBmb2N1c2VkLm1hdGNoZXMoXCI6Zm9jdXNcIilcbiAgICBpZighd2FzRm9jdXNlZCl7IGZvY3VzZWQuZm9jdXMoKSB9XG4gICAgaWYodGhpcy5oYXNTZWxlY3Rpb25SYW5nZShmb2N1c2VkKSl7XG4gICAgICBmb2N1c2VkLnNldFNlbGVjdGlvblJhbmdlKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpXG4gICAgfVxuICB9LFxuXG4gIGlzRm9ybUlucHV0KGVsKXsgcmV0dXJuIC9eKD86aW5wdXR8c2VsZWN0fHRleHRhcmVhKSQvaS50ZXN0KGVsLnRhZ05hbWUpICYmIGVsLnR5cGUgIT09IFwiYnV0dG9uXCIgfSxcblxuICBzeW5jQXR0cnNUb1Byb3BzKGVsKXtcbiAgICBpZihlbCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgQ0hFQ0tBQkxFX0lOUFVUUy5pbmRleE9mKGVsLnR5cGUudG9Mb2NhbGVMb3dlckNhc2UoKSkgPj0gMCl7XG4gICAgICBlbC5jaGVja2VkID0gZWwuZ2V0QXR0cmlidXRlKFwiY2hlY2tlZFwiKSAhPT0gbnVsbFxuICAgIH1cbiAgfSxcblxuICBpc1RleHR1YWxJbnB1dChlbCl7IHJldHVybiBGT0NVU0FCTEVfSU5QVVRTLmluZGV4T2YoZWwudHlwZSkgPj0gMCB9LFxuXG4gIGlzTm93VHJpZ2dlckZvcm1FeHRlcm5hbChlbCwgcGh4VHJpZ2dlckV4dGVybmFsKXtcbiAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlICYmIGVsLmdldEF0dHJpYnV0ZShwaHhUcmlnZ2VyRXh0ZXJuYWwpICE9PSBudWxsICYmIGRvY3VtZW50LmJvZHkuY29udGFpbnMoZWwpXG4gIH0sXG5cbiAgY2xlYW5DaGlsZE5vZGVzKGNvbnRhaW5lciwgcGh4VXBkYXRlKXtcbiAgICBpZihET00uaXNQaHhVcGRhdGUoY29udGFpbmVyLCBwaHhVcGRhdGUsIFtcImFwcGVuZFwiLCBcInByZXBlbmRcIiwgUEhYX1NUUkVBTV0pKXtcbiAgICAgIGxldCB0b1JlbW92ZSA9IFtdXG4gICAgICBjb250YWluZXIuY2hpbGROb2Rlcy5mb3JFYWNoKGNoaWxkTm9kZSA9PiB7XG4gICAgICAgIGlmKCFjaGlsZE5vZGUuaWQpe1xuICAgICAgICAgIC8vIFNraXAgd2FybmluZyBpZiBpdCdzIGFuIGVtcHR5IHRleHQgbm9kZSAoZS5nLiBhIG5ldy1saW5lKVxuICAgICAgICAgIGxldCBpc0VtcHR5VGV4dE5vZGUgPSBjaGlsZE5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmIGNoaWxkTm9kZS5ub2RlVmFsdWUudHJpbSgpID09PSBcIlwiXG4gICAgICAgICAgaWYoIWlzRW1wdHlUZXh0Tm9kZSAmJiBjaGlsZE5vZGUubm9kZVR5cGUgIT09IE5vZGUuQ09NTUVOVF9OT0RFKXtcbiAgICAgICAgICAgIGxvZ0Vycm9yKFwib25seSBIVE1MIGVsZW1lbnQgdGFncyB3aXRoIGFuIGlkIGFyZSBhbGxvd2VkIGluc2lkZSBjb250YWluZXJzIHdpdGggcGh4LXVwZGF0ZS5cXG5cXG5cIiArXG4gICAgICAgICAgICAgIGByZW1vdmluZyBpbGxlZ2FsIG5vZGU6IFwiJHsoY2hpbGROb2RlLm91dGVySFRNTCB8fCBjaGlsZE5vZGUubm9kZVZhbHVlKS50cmltKCl9XCJcXG5cXG5gKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0b1JlbW92ZS5wdXNoKGNoaWxkTm9kZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRvUmVtb3ZlLmZvckVhY2goY2hpbGROb2RlID0+IGNoaWxkTm9kZS5yZW1vdmUoKSlcbiAgICB9XG4gIH0sXG5cbiAgcmVwbGFjZVJvb3RDb250YWluZXIoY29udGFpbmVyLCB0YWdOYW1lLCBhdHRycyl7XG4gICAgbGV0IHJldGFpbmVkQXR0cnMgPSBuZXcgU2V0KFtcImlkXCIsIFBIWF9TRVNTSU9OLCBQSFhfU1RBVElDLCBQSFhfTUFJTiwgUEhYX1JPT1RfSURdKVxuICAgIGlmKGNvbnRhaW5lci50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IHRhZ05hbWUudG9Mb3dlckNhc2UoKSl7XG4gICAgICBBcnJheS5mcm9tKGNvbnRhaW5lci5hdHRyaWJ1dGVzKVxuICAgICAgICAuZmlsdGVyKGF0dHIgPT4gIXJldGFpbmVkQXR0cnMuaGFzKGF0dHIubmFtZS50b0xvd2VyQ2FzZSgpKSlcbiAgICAgICAgLmZvckVhY2goYXR0ciA9PiBjb250YWluZXIucmVtb3ZlQXR0cmlidXRlKGF0dHIubmFtZSkpXG5cbiAgICAgIE9iamVjdC5rZXlzKGF0dHJzKVxuICAgICAgICAuZmlsdGVyKG5hbWUgPT4gIXJldGFpbmVkQXR0cnMuaGFzKG5hbWUudG9Mb3dlckNhc2UoKSkpXG4gICAgICAgIC5mb3JFYWNoKGF0dHIgPT4gY29udGFpbmVyLnNldEF0dHJpYnV0ZShhdHRyLCBhdHRyc1thdHRyXSkpXG5cbiAgICAgIHJldHVybiBjb250YWluZXJcblxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbmV3Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKVxuICAgICAgT2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goYXR0ciA9PiBuZXdDb250YWluZXIuc2V0QXR0cmlidXRlKGF0dHIsIGF0dHJzW2F0dHJdKSlcbiAgICAgIHJldGFpbmVkQXR0cnMuZm9yRWFjaChhdHRyID0+IG5ld0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoYXR0ciwgY29udGFpbmVyLmdldEF0dHJpYnV0ZShhdHRyKSkpXG4gICAgICBuZXdDb250YWluZXIuaW5uZXJIVE1MID0gY29udGFpbmVyLmlubmVySFRNTFxuICAgICAgY29udGFpbmVyLnJlcGxhY2VXaXRoKG5ld0NvbnRhaW5lcilcbiAgICAgIHJldHVybiBuZXdDb250YWluZXJcbiAgICB9XG4gIH0sXG5cbiAgZ2V0U3RpY2t5KGVsLCBuYW1lLCBkZWZhdWx0VmFsKXtcbiAgICBsZXQgb3AgPSAoRE9NLnByaXZhdGUoZWwsIFwic3RpY2t5XCIpIHx8IFtdKS5maW5kKChbZXhpc3RpbmdOYW1lLF0pID0+IG5hbWUgPT09IGV4aXN0aW5nTmFtZSlcbiAgICBpZihvcCl7XG4gICAgICBsZXQgW19uYW1lLCBfb3AsIHN0YXNoZWRSZXN1bHRdID0gb3BcbiAgICAgIHJldHVybiBzdGFzaGVkUmVzdWx0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0eXBlb2YoZGVmYXVsdFZhbCkgPT09IFwiZnVuY3Rpb25cIiA/IGRlZmF1bHRWYWwoKSA6IGRlZmF1bHRWYWxcbiAgICB9XG4gIH0sXG5cbiAgZGVsZXRlU3RpY2t5KGVsLCBuYW1lKXtcbiAgICB0aGlzLnVwZGF0ZVByaXZhdGUoZWwsIFwic3RpY2t5XCIsIFtdLCBvcHMgPT4ge1xuICAgICAgcmV0dXJuIG9wcy5maWx0ZXIoKFtleGlzdGluZ05hbWUsIF9dKSA9PiBleGlzdGluZ05hbWUgIT09IG5hbWUpXG4gICAgfSlcbiAgfSxcblxuICBwdXRTdGlja3koZWwsIG5hbWUsIG9wKXtcbiAgICBsZXQgc3Rhc2hlZFJlc3VsdCA9IG9wKGVsKVxuICAgIHRoaXMudXBkYXRlUHJpdmF0ZShlbCwgXCJzdGlja3lcIiwgW10sIG9wcyA9PiB7XG4gICAgICBsZXQgZXhpc3RpbmdJbmRleCA9IG9wcy5maW5kSW5kZXgoKFtleGlzdGluZ05hbWUsXSkgPT4gbmFtZSA9PT0gZXhpc3RpbmdOYW1lKVxuICAgICAgaWYoZXhpc3RpbmdJbmRleCA+PSAwKXtcbiAgICAgICAgb3BzW2V4aXN0aW5nSW5kZXhdID0gW25hbWUsIG9wLCBzdGFzaGVkUmVzdWx0XVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3BzLnB1c2goW25hbWUsIG9wLCBzdGFzaGVkUmVzdWx0XSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcHNcbiAgICB9KVxuICB9LFxuXG4gIGFwcGx5U3RpY2t5T3BlcmF0aW9ucyhlbCl7XG4gICAgbGV0IG9wcyA9IERPTS5wcml2YXRlKGVsLCBcInN0aWNreVwiKVxuICAgIGlmKCFvcHMpeyByZXR1cm4gfVxuXG4gICAgb3BzLmZvckVhY2goKFtuYW1lLCBvcCwgX3N0YXNoZWRdKSA9PiB0aGlzLnB1dFN0aWNreShlbCwgbmFtZSwgb3ApKVxuICB9LFxuXG4gIGlzTG9ja2VkKGVsKXtcbiAgICByZXR1cm4gZWwuaGFzQXR0cmlidXRlICYmIGVsLmhhc0F0dHJpYnV0ZShQSFhfUkVGX0xPQ0spXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRE9NXG4iLCAiaW1wb3J0IHtcbiAgUEhYX0FDVElWRV9FTlRSWV9SRUZTLFxuICBQSFhfTElWRV9GSUxFX1VQREFURUQsXG4gIFBIWF9QUkVGTElHSFRFRF9SRUZTXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGNoYW5uZWxVcGxvYWRlcixcbiAgbG9nRXJyb3Jcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVcGxvYWRFbnRyeSB7XG4gIHN0YXRpYyBpc0FjdGl2ZShmaWxlRWwsIGZpbGUpe1xuICAgIGxldCBpc05ldyA9IGZpbGUuX3BoeFJlZiA9PT0gdW5kZWZpbmVkXG4gICAgbGV0IGFjdGl2ZVJlZnMgPSBmaWxlRWwuZ2V0QXR0cmlidXRlKFBIWF9BQ1RJVkVfRU5UUllfUkVGUykuc3BsaXQoXCIsXCIpXG4gICAgbGV0IGlzQWN0aXZlID0gYWN0aXZlUmVmcy5pbmRleE9mKExpdmVVcGxvYWRlci5nZW5GaWxlUmVmKGZpbGUpKSA+PSAwXG4gICAgcmV0dXJuIGZpbGUuc2l6ZSA+IDAgJiYgKGlzTmV3IHx8IGlzQWN0aXZlKVxuICB9XG5cbiAgc3RhdGljIGlzUHJlZmxpZ2h0ZWQoZmlsZUVsLCBmaWxlKXtcbiAgICBsZXQgcHJlZmxpZ2h0ZWRSZWZzID0gZmlsZUVsLmdldEF0dHJpYnV0ZShQSFhfUFJFRkxJR0hURURfUkVGUykuc3BsaXQoXCIsXCIpXG4gICAgbGV0IGlzUHJlZmxpZ2h0ZWQgPSBwcmVmbGlnaHRlZFJlZnMuaW5kZXhPZihMaXZlVXBsb2FkZXIuZ2VuRmlsZVJlZihmaWxlKSkgPj0gMFxuICAgIHJldHVybiBpc1ByZWZsaWdodGVkICYmIHRoaXMuaXNBY3RpdmUoZmlsZUVsLCBmaWxlKVxuICB9XG5cbiAgc3RhdGljIGlzUHJlZmxpZ2h0SW5Qcm9ncmVzcyhmaWxlKXtcbiAgICByZXR1cm4gZmlsZS5fcHJlZmxpZ2h0SW5Qcm9ncmVzcyA9PT0gdHJ1ZVxuICB9XG5cbiAgc3RhdGljIG1hcmtQcmVmbGlnaHRJblByb2dyZXNzKGZpbGUpe1xuICAgIGZpbGUuX3ByZWZsaWdodEluUHJvZ3Jlc3MgPSB0cnVlXG4gIH1cblxuICBjb25zdHJ1Y3RvcihmaWxlRWwsIGZpbGUsIHZpZXcsIGF1dG9VcGxvYWQpe1xuICAgIHRoaXMucmVmID0gTGl2ZVVwbG9hZGVyLmdlbkZpbGVSZWYoZmlsZSlcbiAgICB0aGlzLmZpbGVFbCA9IGZpbGVFbFxuICAgIHRoaXMuZmlsZSA9IGZpbGVcbiAgICB0aGlzLnZpZXcgPSB2aWV3XG4gICAgdGhpcy5tZXRhID0gbnVsbFxuICAgIHRoaXMuX2lzQ2FuY2VsbGVkID0gZmFsc2VcbiAgICB0aGlzLl9pc0RvbmUgPSBmYWxzZVxuICAgIHRoaXMuX3Byb2dyZXNzID0gMFxuICAgIHRoaXMuX2xhc3RQcm9ncmVzc1NlbnQgPSAtMVxuICAgIHRoaXMuX29uRG9uZSA9IGZ1bmN0aW9uKCl7IH1cbiAgICB0aGlzLl9vbkVsVXBkYXRlZCA9IHRoaXMub25FbFVwZGF0ZWQuYmluZCh0aGlzKVxuICAgIHRoaXMuZmlsZUVsLmFkZEV2ZW50TGlzdGVuZXIoUEhYX0xJVkVfRklMRV9VUERBVEVELCB0aGlzLl9vbkVsVXBkYXRlZClcbiAgICB0aGlzLmF1dG9VcGxvYWQgPSBhdXRvVXBsb2FkXG4gIH1cblxuICBtZXRhZGF0YSgpeyByZXR1cm4gdGhpcy5tZXRhIH1cblxuICBwcm9ncmVzcyhwcm9ncmVzcyl7XG4gICAgdGhpcy5fcHJvZ3Jlc3MgPSBNYXRoLmZsb29yKHByb2dyZXNzKVxuICAgIGlmKHRoaXMuX3Byb2dyZXNzID4gdGhpcy5fbGFzdFByb2dyZXNzU2VudCl7XG4gICAgICBpZih0aGlzLl9wcm9ncmVzcyA+PSAxMDApe1xuICAgICAgICB0aGlzLl9wcm9ncmVzcyA9IDEwMFxuICAgICAgICB0aGlzLl9sYXN0UHJvZ3Jlc3NTZW50ID0gMTAwXG4gICAgICAgIHRoaXMuX2lzRG9uZSA9IHRydWVcbiAgICAgICAgdGhpcy52aWV3LnB1c2hGaWxlUHJvZ3Jlc3ModGhpcy5maWxlRWwsIHRoaXMucmVmLCAxMDAsICgpID0+IHtcbiAgICAgICAgICBMaXZlVXBsb2FkZXIudW50cmFja0ZpbGUodGhpcy5maWxlRWwsIHRoaXMuZmlsZSlcbiAgICAgICAgICB0aGlzLl9vbkRvbmUoKVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbGFzdFByb2dyZXNzU2VudCA9IHRoaXMuX3Byb2dyZXNzXG4gICAgICAgIHRoaXMudmlldy5wdXNoRmlsZVByb2dyZXNzKHRoaXMuZmlsZUVsLCB0aGlzLnJlZiwgdGhpcy5fcHJvZ3Jlc3MpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNDYW5jZWxsZWQoKXsgcmV0dXJuIHRoaXMuX2lzQ2FuY2VsbGVkIH1cblxuICBjYW5jZWwoKXtcbiAgICB0aGlzLmZpbGUuX3ByZWZsaWdodEluUHJvZ3Jlc3MgPSBmYWxzZVxuICAgIHRoaXMuX2lzQ2FuY2VsbGVkID0gdHJ1ZVxuICAgIHRoaXMuX2lzRG9uZSA9IHRydWVcbiAgICB0aGlzLl9vbkRvbmUoKVxuICB9XG5cbiAgaXNEb25lKCl7IHJldHVybiB0aGlzLl9pc0RvbmUgfVxuXG4gIGVycm9yKHJlYXNvbiA9IFwiZmFpbGVkXCIpe1xuICAgIHRoaXMuZmlsZUVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoUEhYX0xJVkVfRklMRV9VUERBVEVELCB0aGlzLl9vbkVsVXBkYXRlZClcbiAgICB0aGlzLnZpZXcucHVzaEZpbGVQcm9ncmVzcyh0aGlzLmZpbGVFbCwgdGhpcy5yZWYsIHtlcnJvcjogcmVhc29ufSlcbiAgICBpZighdGhpcy5pc0F1dG9VcGxvYWQoKSl7IExpdmVVcGxvYWRlci5jbGVhckZpbGVzKHRoaXMuZmlsZUVsKSB9XG4gIH1cblxuICBpc0F1dG9VcGxvYWQoKXsgcmV0dXJuIHRoaXMuYXV0b1VwbG9hZCB9XG5cbiAgLy9wcml2YXRlXG5cbiAgb25Eb25lKGNhbGxiYWNrKXtcbiAgICB0aGlzLl9vbkRvbmUgPSAoKSA9PiB7XG4gICAgICB0aGlzLmZpbGVFbC5yZW1vdmVFdmVudExpc3RlbmVyKFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCwgdGhpcy5fb25FbFVwZGF0ZWQpXG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG5cbiAgb25FbFVwZGF0ZWQoKXtcbiAgICBsZXQgYWN0aXZlUmVmcyA9IHRoaXMuZmlsZUVsLmdldEF0dHJpYnV0ZShQSFhfQUNUSVZFX0VOVFJZX1JFRlMpLnNwbGl0KFwiLFwiKVxuICAgIGlmKGFjdGl2ZVJlZnMuaW5kZXhPZih0aGlzLnJlZikgPT09IC0xKXtcbiAgICAgIExpdmVVcGxvYWRlci51bnRyYWNrRmlsZSh0aGlzLmZpbGVFbCwgdGhpcy5maWxlKVxuICAgICAgdGhpcy5jYW5jZWwoKVxuICAgIH1cbiAgfVxuXG4gIHRvUHJlZmxpZ2h0UGF5bG9hZCgpe1xuICAgIHJldHVybiB7XG4gICAgICBsYXN0X21vZGlmaWVkOiB0aGlzLmZpbGUubGFzdE1vZGlmaWVkLFxuICAgICAgbmFtZTogdGhpcy5maWxlLm5hbWUsXG4gICAgICByZWxhdGl2ZV9wYXRoOiB0aGlzLmZpbGUud2Via2l0UmVsYXRpdmVQYXRoLFxuICAgICAgc2l6ZTogdGhpcy5maWxlLnNpemUsXG4gICAgICB0eXBlOiB0aGlzLmZpbGUudHlwZSxcbiAgICAgIHJlZjogdGhpcy5yZWYsXG4gICAgICBtZXRhOiB0eXBlb2YodGhpcy5maWxlLm1ldGEpID09PSBcImZ1bmN0aW9uXCIgPyB0aGlzLmZpbGUubWV0YSgpIDogdW5kZWZpbmVkXG4gICAgfVxuICB9XG5cbiAgdXBsb2FkZXIodXBsb2FkZXJzKXtcbiAgICBpZih0aGlzLm1ldGEudXBsb2FkZXIpe1xuICAgICAgbGV0IGNhbGxiYWNrID0gdXBsb2FkZXJzW3RoaXMubWV0YS51cGxvYWRlcl0gfHwgbG9nRXJyb3IoYG5vIHVwbG9hZGVyIGNvbmZpZ3VyZWQgZm9yICR7dGhpcy5tZXRhLnVwbG9hZGVyfWApXG4gICAgICByZXR1cm4ge25hbWU6IHRoaXMubWV0YS51cGxvYWRlciwgY2FsbGJhY2s6IGNhbGxiYWNrfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge25hbWU6IFwiY2hhbm5lbFwiLCBjYWxsYmFjazogY2hhbm5lbFVwbG9hZGVyfVxuICAgIH1cbiAgfVxuXG4gIHppcFBvc3RGbGlnaHQocmVzcCl7XG4gICAgdGhpcy5tZXRhID0gcmVzcC5lbnRyaWVzW3RoaXMucmVmXVxuICAgIGlmKCF0aGlzLm1ldGEpeyBsb2dFcnJvcihgbm8gcHJlZmxpZ2h0IHVwbG9hZCByZXNwb25zZSByZXR1cm5lZCB3aXRoIHJlZiAke3RoaXMucmVmfWAsIHtpbnB1dDogdGhpcy5maWxlRWwsIHJlc3BvbnNlOiByZXNwfSkgfVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgUEhYX0RPTkVfUkVGUyxcbiAgUEhYX1BSRUZMSUdIVEVEX1JFRlMsXG4gIFBIWF9VUExPQURfUkVGXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IFVwbG9hZEVudHJ5IGZyb20gXCIuL3VwbG9hZF9lbnRyeVwiXG5cbmxldCBsaXZlVXBsb2FkZXJGaWxlUmVmID0gMFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXZlVXBsb2FkZXIge1xuICBzdGF0aWMgZ2VuRmlsZVJlZihmaWxlKXtcbiAgICBsZXQgcmVmID0gZmlsZS5fcGh4UmVmXG4gICAgaWYocmVmICE9PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIHJlZlxuICAgIH0gZWxzZSB7XG4gICAgICBmaWxlLl9waHhSZWYgPSAobGl2ZVVwbG9hZGVyRmlsZVJlZisrKS50b1N0cmluZygpXG4gICAgICByZXR1cm4gZmlsZS5fcGh4UmVmXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldEVudHJ5RGF0YVVSTChpbnB1dEVsLCByZWYsIGNhbGxiYWNrKXtcbiAgICBsZXQgZmlsZSA9IHRoaXMuYWN0aXZlRmlsZXMoaW5wdXRFbCkuZmluZChmaWxlID0+IHRoaXMuZ2VuRmlsZVJlZihmaWxlKSA9PT0gcmVmKVxuICAgIGNhbGxiYWNrKFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSkpXG4gIH1cblxuICBzdGF0aWMgaGFzVXBsb2Fkc0luUHJvZ3Jlc3MoZm9ybUVsKXtcbiAgICBsZXQgYWN0aXZlID0gMFxuICAgIERPTS5maW5kVXBsb2FkSW5wdXRzKGZvcm1FbCkuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoUEhYX1BSRUZMSUdIVEVEX1JFRlMpICE9PSBpbnB1dC5nZXRBdHRyaWJ1dGUoUEhYX0RPTkVfUkVGUykpe1xuICAgICAgICBhY3RpdmUrK1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGFjdGl2ZSA+IDBcbiAgfVxuXG4gIHN0YXRpYyBzZXJpYWxpemVVcGxvYWRzKGlucHV0RWwpe1xuICAgIGxldCBmaWxlcyA9IHRoaXMuYWN0aXZlRmlsZXMoaW5wdXRFbClcbiAgICBsZXQgZmlsZURhdGEgPSB7fVxuICAgIGZpbGVzLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICBsZXQgZW50cnkgPSB7cGF0aDogaW5wdXRFbC5uYW1lfVxuICAgICAgbGV0IHVwbG9hZFJlZiA9IGlucHV0RWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKVxuICAgICAgZmlsZURhdGFbdXBsb2FkUmVmXSA9IGZpbGVEYXRhW3VwbG9hZFJlZl0gfHwgW11cbiAgICAgIGVudHJ5LnJlZiA9IHRoaXMuZ2VuRmlsZVJlZihmaWxlKVxuICAgICAgZW50cnkubGFzdF9tb2RpZmllZCA9IGZpbGUubGFzdE1vZGlmaWVkXG4gICAgICBlbnRyeS5uYW1lID0gZmlsZS5uYW1lIHx8IGVudHJ5LnJlZlxuICAgICAgZW50cnkucmVsYXRpdmVfcGF0aCA9IGZpbGUud2Via2l0UmVsYXRpdmVQYXRoXG4gICAgICBlbnRyeS50eXBlID0gZmlsZS50eXBlXG4gICAgICBlbnRyeS5zaXplID0gZmlsZS5zaXplXG4gICAgICBpZih0eXBlb2YoZmlsZS5tZXRhKSA9PT0gXCJmdW5jdGlvblwiKXsgZW50cnkubWV0YSA9IGZpbGUubWV0YSgpIH1cbiAgICAgIGZpbGVEYXRhW3VwbG9hZFJlZl0ucHVzaChlbnRyeSlcbiAgICB9KVxuICAgIHJldHVybiBmaWxlRGF0YVxuICB9XG5cbiAgc3RhdGljIGNsZWFyRmlsZXMoaW5wdXRFbCl7XG4gICAgaW5wdXRFbC52YWx1ZSA9IG51bGxcbiAgICBpbnB1dEVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfVVBMT0FEX1JFRilcbiAgICBET00ucHV0UHJpdmF0ZShpbnB1dEVsLCBcImZpbGVzXCIsIFtdKVxuICB9XG5cbiAgc3RhdGljIHVudHJhY2tGaWxlKGlucHV0RWwsIGZpbGUpe1xuICAgIERPTS5wdXRQcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIiwgRE9NLnByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiKS5maWx0ZXIoZiA9PiAhT2JqZWN0LmlzKGYsIGZpbGUpKSlcbiAgfVxuXG4gIHN0YXRpYyB0cmFja0ZpbGVzKGlucHV0RWwsIGZpbGVzLCBkYXRhVHJhbnNmZXIpe1xuICAgIGlmKGlucHV0RWwuZ2V0QXR0cmlidXRlKFwibXVsdGlwbGVcIikgIT09IG51bGwpe1xuICAgICAgbGV0IG5ld0ZpbGVzID0gZmlsZXMuZmlsdGVyKGZpbGUgPT4gIXRoaXMuYWN0aXZlRmlsZXMoaW5wdXRFbCkuZmluZChmID0+IE9iamVjdC5pcyhmLCBmaWxlKSkpXG4gICAgICBET00udXBkYXRlUHJpdmF0ZShpbnB1dEVsLCBcImZpbGVzXCIsIFtdLCAoZXhpc3RpbmcpID0+IGV4aXN0aW5nLmNvbmNhdChuZXdGaWxlcykpXG4gICAgICBpbnB1dEVsLnZhbHVlID0gbnVsbFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZXNldCBpbnB1dEVsIGZpbGVzIHRvIGFsaWduIG91dHB1dCB3aXRoIHByb2dyYW1tYXRpYyBjaGFuZ2VzIChpLmUuIGRyYWcgYW5kIGRyb3ApXG4gICAgICBpZihkYXRhVHJhbnNmZXIgJiYgZGF0YVRyYW5zZmVyLmZpbGVzLmxlbmd0aCA+IDApeyBpbnB1dEVsLmZpbGVzID0gZGF0YVRyYW5zZmVyLmZpbGVzIH1cbiAgICAgIERPTS5wdXRQcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIiwgZmlsZXMpXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFjdGl2ZUZpbGVJbnB1dHMoZm9ybUVsKXtcbiAgICBsZXQgZmlsZUlucHV0cyA9IERPTS5maW5kVXBsb2FkSW5wdXRzKGZvcm1FbClcbiAgICByZXR1cm4gQXJyYXkuZnJvbShmaWxlSW5wdXRzKS5maWx0ZXIoZWwgPT4gZWwuZmlsZXMgJiYgdGhpcy5hY3RpdmVGaWxlcyhlbCkubGVuZ3RoID4gMClcbiAgfVxuXG4gIHN0YXRpYyBhY3RpdmVGaWxlcyhpbnB1dCl7XG4gICAgcmV0dXJuIChET00ucHJpdmF0ZShpbnB1dCwgXCJmaWxlc1wiKSB8fCBbXSkuZmlsdGVyKGYgPT4gVXBsb2FkRW50cnkuaXNBY3RpdmUoaW5wdXQsIGYpKVxuICB9XG5cbiAgc3RhdGljIGlucHV0c0F3YWl0aW5nUHJlZmxpZ2h0KGZvcm1FbCl7XG4gICAgbGV0IGZpbGVJbnB1dHMgPSBET00uZmluZFVwbG9hZElucHV0cyhmb3JtRWwpXG4gICAgcmV0dXJuIEFycmF5LmZyb20oZmlsZUlucHV0cykuZmlsdGVyKGlucHV0ID0+IHRoaXMuZmlsZXNBd2FpdGluZ1ByZWZsaWdodChpbnB1dCkubGVuZ3RoID4gMClcbiAgfVxuXG4gIHN0YXRpYyBmaWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0KXtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVGaWxlcyhpbnB1dCkuZmlsdGVyKGYgPT4gIVVwbG9hZEVudHJ5LmlzUHJlZmxpZ2h0ZWQoaW5wdXQsIGYpICYmICFVcGxvYWRFbnRyeS5pc1ByZWZsaWdodEluUHJvZ3Jlc3MoZikpXG4gIH1cblxuICBzdGF0aWMgbWFya1ByZWZsaWdodEluUHJvZ3Jlc3MoZW50cmllcyl7XG4gICAgZW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IFVwbG9hZEVudHJ5Lm1hcmtQcmVmbGlnaHRJblByb2dyZXNzKGVudHJ5LmZpbGUpKVxuICB9XG5cbiAgY29uc3RydWN0b3IoaW5wdXRFbCwgdmlldywgb25Db21wbGV0ZSl7XG4gICAgdGhpcy5hdXRvVXBsb2FkID0gRE9NLmlzQXV0b1VwbG9hZChpbnB1dEVsKVxuICAgIHRoaXMudmlldyA9IHZpZXdcbiAgICB0aGlzLm9uQ29tcGxldGUgPSBvbkNvbXBsZXRlXG4gICAgdGhpcy5fZW50cmllcyA9XG4gICAgICBBcnJheS5mcm9tKExpdmVVcGxvYWRlci5maWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0RWwpIHx8IFtdKVxuICAgICAgICAubWFwKGZpbGUgPT4gbmV3IFVwbG9hZEVudHJ5KGlucHV0RWwsIGZpbGUsIHZpZXcsIHRoaXMuYXV0b1VwbG9hZCkpXG5cbiAgICAvLyBwcmV2ZW50IHNlbmRpbmcgZHVwbGljYXRlIHByZWZsaWdodCByZXF1ZXN0c1xuICAgIExpdmVVcGxvYWRlci5tYXJrUHJlZmxpZ2h0SW5Qcm9ncmVzcyh0aGlzLl9lbnRyaWVzKVxuXG4gICAgdGhpcy5udW1FbnRyaWVzSW5Qcm9ncmVzcyA9IHRoaXMuX2VudHJpZXMubGVuZ3RoXG4gIH1cblxuICBpc0F1dG9VcGxvYWQoKXsgcmV0dXJuIHRoaXMuYXV0b1VwbG9hZCB9XG5cbiAgZW50cmllcygpeyByZXR1cm4gdGhpcy5fZW50cmllcyB9XG5cbiAgaW5pdEFkYXB0ZXJVcGxvYWQocmVzcCwgb25FcnJvciwgbGl2ZVNvY2tldCl7XG4gICAgdGhpcy5fZW50cmllcyA9XG4gICAgICB0aGlzLl9lbnRyaWVzLm1hcChlbnRyeSA9PiB7XG4gICAgICAgIGlmKGVudHJ5LmlzQ2FuY2VsbGVkKCkpe1xuICAgICAgICAgIHRoaXMubnVtRW50cmllc0luUHJvZ3Jlc3MtLVxuICAgICAgICAgIGlmKHRoaXMubnVtRW50cmllc0luUHJvZ3Jlc3MgPT09IDApeyB0aGlzLm9uQ29tcGxldGUoKSB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW50cnkuemlwUG9zdEZsaWdodChyZXNwKVxuICAgICAgICAgIGVudHJ5Lm9uRG9uZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm51bUVudHJpZXNJblByb2dyZXNzLS1cbiAgICAgICAgICAgIGlmKHRoaXMubnVtRW50cmllc0luUHJvZ3Jlc3MgPT09IDApeyB0aGlzLm9uQ29tcGxldGUoKSB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZW50cnlcbiAgICAgIH0pXG5cbiAgICBsZXQgZ3JvdXBlZEVudHJpZXMgPSB0aGlzLl9lbnRyaWVzLnJlZHVjZSgoYWNjLCBlbnRyeSkgPT4ge1xuICAgICAgaWYoIWVudHJ5Lm1ldGEpeyByZXR1cm4gYWNjIH1cbiAgICAgIGxldCB7bmFtZSwgY2FsbGJhY2t9ID0gZW50cnkudXBsb2FkZXIobGl2ZVNvY2tldC51cGxvYWRlcnMpXG4gICAgICBhY2NbbmFtZV0gPSBhY2NbbmFtZV0gfHwge2NhbGxiYWNrOiBjYWxsYmFjaywgZW50cmllczogW119XG4gICAgICBhY2NbbmFtZV0uZW50cmllcy5wdXNoKGVudHJ5KVxuICAgICAgcmV0dXJuIGFjY1xuICAgIH0sIHt9KVxuXG4gICAgZm9yKGxldCBuYW1lIGluIGdyb3VwZWRFbnRyaWVzKXtcbiAgICAgIGxldCB7Y2FsbGJhY2ssIGVudHJpZXN9ID0gZ3JvdXBlZEVudHJpZXNbbmFtZV1cbiAgICAgIGNhbGxiYWNrKGVudHJpZXMsIG9uRXJyb3IsIHJlc3AsIGxpdmVTb2NrZXQpXG4gICAgfVxuICB9XG59XG4iLCAibGV0IEFSSUEgPSB7XG4gIGFueU9mKGluc3RhbmNlLCBjbGFzc2VzKXsgcmV0dXJuIGNsYXNzZXMuZmluZChuYW1lID0+IGluc3RhbmNlIGluc3RhbmNlb2YgbmFtZSkgfSxcblxuICBpc0ZvY3VzYWJsZShlbCwgaW50ZXJhY3RpdmVPbmx5KXtcbiAgICByZXR1cm4gKFxuICAgICAgKGVsIGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQgJiYgZWwucmVsICE9PSBcImlnbm9yZVwiKSB8fFxuICAgICAgKGVsIGluc3RhbmNlb2YgSFRNTEFyZWFFbGVtZW50ICYmIGVsLmhyZWYgIT09IHVuZGVmaW5lZCkgfHxcbiAgICAgICghZWwuZGlzYWJsZWQgJiYgKHRoaXMuYW55T2YoZWwsIFtIVE1MSW5wdXRFbGVtZW50LCBIVE1MU2VsZWN0RWxlbWVudCwgSFRNTFRleHRBcmVhRWxlbWVudCwgSFRNTEJ1dHRvbkVsZW1lbnRdKSkpIHx8XG4gICAgICAoZWwgaW5zdGFuY2VvZiBIVE1MSUZyYW1lRWxlbWVudCkgfHxcbiAgICAgICgoZWwudGFiSW5kZXggPj0gMCAmJiBlbC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiKSAhPT0gXCJ0cnVlXCIpIHx8ICghaW50ZXJhY3RpdmVPbmx5ICYmIGVsLmdldEF0dHJpYnV0ZShcInRhYmluZGV4XCIpICE9PSBudWxsICYmIGVsLmdldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIpICE9PSBcInRydWVcIikpXG4gICAgKVxuICB9LFxuXG4gIGF0dGVtcHRGb2N1cyhlbCwgaW50ZXJhY3RpdmVPbmx5KXtcbiAgICBpZih0aGlzLmlzRm9jdXNhYmxlKGVsLCBpbnRlcmFjdGl2ZU9ubHkpKXsgdHJ5IHsgZWwuZm9jdXMoKSB9IGNhdGNoIHt9IH1cbiAgICByZXR1cm4gISFkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuaXNTYW1lTm9kZShlbClcbiAgfSxcblxuICBmb2N1c0ZpcnN0SW50ZXJhY3RpdmUoZWwpe1xuICAgIGxldCBjaGlsZCA9IGVsLmZpcnN0RWxlbWVudENoaWxkXG4gICAgd2hpbGUoY2hpbGQpe1xuICAgICAgaWYodGhpcy5hdHRlbXB0Rm9jdXMoY2hpbGQsIHRydWUpIHx8IHRoaXMuZm9jdXNGaXJzdEludGVyYWN0aXZlKGNoaWxkLCB0cnVlKSl7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgICBjaGlsZCA9IGNoaWxkLm5leHRFbGVtZW50U2libGluZ1xuICAgIH1cbiAgfSxcblxuICBmb2N1c0ZpcnN0KGVsKXtcbiAgICBsZXQgY2hpbGQgPSBlbC5maXJzdEVsZW1lbnRDaGlsZFxuICAgIHdoaWxlKGNoaWxkKXtcbiAgICAgIGlmKHRoaXMuYXR0ZW1wdEZvY3VzKGNoaWxkKSB8fCB0aGlzLmZvY3VzRmlyc3QoY2hpbGQpKXtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICAgIGNoaWxkID0gY2hpbGQubmV4dEVsZW1lbnRTaWJsaW5nXG4gICAgfVxuICB9LFxuXG4gIGZvY3VzTGFzdChlbCl7XG4gICAgbGV0IGNoaWxkID0gZWwubGFzdEVsZW1lbnRDaGlsZFxuICAgIHdoaWxlKGNoaWxkKXtcbiAgICAgIGlmKHRoaXMuYXR0ZW1wdEZvY3VzKGNoaWxkKSB8fCB0aGlzLmZvY3VzTGFzdChjaGlsZCkpe1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgICAgY2hpbGQgPSBjaGlsZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXG4gICAgfVxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBBUklBXG4iLCAiaW1wb3J0IHtcbiAgUEhYX0FDVElWRV9FTlRSWV9SRUZTLFxuICBQSFhfTElWRV9GSUxFX1VQREFURUQsXG4gIFBIWF9QUkVGTElHSFRFRF9SRUZTLFxuICBQSFhfVVBMT0FEX1JFRlxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuaW1wb3J0IEFSSUEgZnJvbSBcIi4vYXJpYVwiXG5cbmxldCBIb29rcyA9IHtcbiAgTGl2ZUZpbGVVcGxvYWQ6IHtcbiAgICBhY3RpdmVSZWZzKCl7IHJldHVybiB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfQUNUSVZFX0VOVFJZX1JFRlMpIH0sXG5cbiAgICBwcmVmbGlnaHRlZFJlZnMoKXsgcmV0dXJuIHRoaXMuZWwuZ2V0QXR0cmlidXRlKFBIWF9QUkVGTElHSFRFRF9SRUZTKSB9LFxuXG4gICAgbW91bnRlZCgpeyB0aGlzLnByZWZsaWdodGVkV2FzID0gdGhpcy5wcmVmbGlnaHRlZFJlZnMoKSB9LFxuXG4gICAgdXBkYXRlZCgpe1xuICAgICAgbGV0IG5ld1ByZWZsaWdodHMgPSB0aGlzLnByZWZsaWdodGVkUmVmcygpXG4gICAgICBpZih0aGlzLnByZWZsaWdodGVkV2FzICE9PSBuZXdQcmVmbGlnaHRzKXtcbiAgICAgICAgdGhpcy5wcmVmbGlnaHRlZFdhcyA9IG5ld1ByZWZsaWdodHNcbiAgICAgICAgaWYobmV3UHJlZmxpZ2h0cyA9PT0gXCJcIil7XG4gICAgICAgICAgdGhpcy5fX3ZpZXcoKS5jYW5jZWxTdWJtaXQodGhpcy5lbC5mb3JtKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmKHRoaXMuYWN0aXZlUmVmcygpID09PSBcIlwiKXsgdGhpcy5lbC52YWx1ZSA9IG51bGwgfVxuICAgICAgdGhpcy5lbC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChQSFhfTElWRV9GSUxFX1VQREFURUQpKVxuICAgIH1cbiAgfSxcblxuICBMaXZlSW1nUHJldmlldzoge1xuICAgIG1vdW50ZWQoKXtcbiAgICAgIHRoaXMucmVmID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBoeC1lbnRyeS1yZWZcIilcbiAgICAgIHRoaXMuaW5wdXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSlcbiAgICAgIExpdmVVcGxvYWRlci5nZXRFbnRyeURhdGFVUkwodGhpcy5pbnB1dEVsLCB0aGlzLnJlZiwgdXJsID0+IHtcbiAgICAgICAgdGhpcy51cmwgPSB1cmxcbiAgICAgICAgdGhpcy5lbC5zcmMgPSB1cmxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBkZXN0cm95ZWQoKXtcbiAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwodGhpcy51cmwpXG4gICAgfVxuICB9LFxuICBGb2N1c1dyYXA6IHtcbiAgICBtb3VudGVkKCl7XG4gICAgICB0aGlzLmZvY3VzU3RhcnQgPSB0aGlzLmVsLmZpcnN0RWxlbWVudENoaWxkXG4gICAgICB0aGlzLmZvY3VzRW5kID0gdGhpcy5lbC5sYXN0RWxlbWVudENoaWxkXG4gICAgICB0aGlzLmZvY3VzU3RhcnQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIChlKSA9PiB7XG4gICAgICAgIGlmKCFlLnJlbGF0ZWRUYXJnZXQgfHwgIXRoaXMuZWwuY29udGFpbnMoZS5yZWxhdGVkVGFyZ2V0KSl7IFxuICAgICAgICAgIC8vIEhhbmRsZSBmb2N1cyBlbnRlcmluZyBmcm9tIG91dHNpZGUgKGUuZy4gVGFiIHdoZW4gYm9keSBpcyBmb2N1c2VkKVxuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9waG9lbml4ZnJhbWV3b3JrL3Bob2VuaXhfbGl2ZV92aWV3L2lzc3Vlcy8zNjM2XG4gICAgICAgICAgY29uc3QgbmV4dEZvY3VzID0gZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nXG4gICAgICAgICAgQVJJQS5hdHRlbXB0Rm9jdXMobmV4dEZvY3VzKSB8fCBBUklBLmZvY3VzRmlyc3QobmV4dEZvY3VzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIEFSSUEuZm9jdXNMYXN0KHRoaXMuZWwpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLmZvY3VzRW5kLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoZSkgPT4ge1xuICAgICAgICBpZighZS5yZWxhdGVkVGFyZ2V0IHx8ICF0aGlzLmVsLmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCkpeyBcbiAgICAgICAgICAvLyBIYW5kbGUgZm9jdXMgZW50ZXJpbmcgZnJvbSBvdXRzaWRlIChlLmcuIFNoaWZ0K1RhYiB3aGVuIGJvZHkgaXMgZm9jdXNlZClcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9pc3N1ZXMvMzYzNlxuICAgICAgICAgIGNvbnN0IG5leHRGb2N1cyA9IGUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmdcbiAgICAgICAgICBBUklBLmF0dGVtcHRGb2N1cyhuZXh0Rm9jdXMpIHx8IEFSSUEuZm9jdXNMYXN0KG5leHRGb2N1cylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBBUklBLmZvY3VzRmlyc3QodGhpcy5lbClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcInBoeDpzaG93LWVuZFwiLCAoKSA9PiB0aGlzLmVsLmZvY3VzKCkpXG4gICAgICBpZih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsKS5kaXNwbGF5ICE9PSBcIm5vbmVcIil7XG4gICAgICAgIEFSSUEuZm9jdXNGaXJzdCh0aGlzLmVsKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5sZXQgZmluZFNjcm9sbENvbnRhaW5lciA9IChlbCkgPT4ge1xuICAvLyB0aGUgc2Nyb2xsIGV2ZW50IHdvbid0IGJlIGZpcmVkIG9uIHRoZSBodG1sL2JvZHkgZWxlbWVudCBldmVuIGlmIG92ZXJmbG93IGlzIHNldFxuICAvLyB0aGVyZWZvcmUgd2UgcmV0dXJuIG51bGwgdG8gaW5zdGVhZCBsaXN0ZW4gZm9yIHNjcm9sbCBldmVudHMgb24gZG9jdW1lbnRcbiAgaWYoW1wiSFRNTFwiLCBcIkJPRFlcIl0uaW5kZXhPZihlbC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpKSA+PSAwKSByZXR1cm4gbnVsbFxuICBpZihbXCJzY3JvbGxcIiwgXCJhdXRvXCJdLmluZGV4T2YoZ2V0Q29tcHV0ZWRTdHlsZShlbCkub3ZlcmZsb3dZKSA+PSAwKSByZXR1cm4gZWxcbiAgcmV0dXJuIGZpbmRTY3JvbGxDb250YWluZXIoZWwucGFyZW50RWxlbWVudClcbn1cblxubGV0IHNjcm9sbFRvcCA9IChzY3JvbGxDb250YWluZXIpID0+IHtcbiAgaWYoc2Nyb2xsQ29udGFpbmVyKXtcbiAgICByZXR1cm4gc2Nyb2xsQ29udGFpbmVyLnNjcm9sbFRvcFxuICB9IGVsc2Uge1xuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wXG4gIH1cbn1cblxubGV0IGJvdHRvbSA9IChzY3JvbGxDb250YWluZXIpID0+IHtcbiAgaWYoc2Nyb2xsQ29udGFpbmVyKXtcbiAgICByZXR1cm4gc2Nyb2xsQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbVxuICB9IGVsc2Uge1xuICAgIC8vIHdoZW4gd2UgaGF2ZSBubyBjb250YWluZXIsIHRoZSB3aG9sZSBwYWdlIHNjcm9sbHMsXG4gICAgLy8gdGhlcmVmb3JlIHRoZSBib3R0b20gY29vcmRpbmF0ZSBpcyB0aGUgdmlld3BvcnQgaGVpZ2h0XG4gICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gIH1cbn1cblxubGV0IHRvcCA9IChzY3JvbGxDb250YWluZXIpID0+IHtcbiAgaWYoc2Nyb2xsQ29udGFpbmVyKXtcbiAgICByZXR1cm4gc2Nyb2xsQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuICB9IGVsc2Uge1xuICAgIC8vIHdoZW4gd2UgaGF2ZSBubyBjb250YWluZXIgdGhlIHdob2xlIHBhZ2Ugc2Nyb2xscyxcbiAgICAvLyB0aGVyZWZvcmUgdGhlIHRvcCBjb29yZGluYXRlIGlzIDBcbiAgICByZXR1cm4gMFxuICB9XG59XG5cbmxldCBpc0F0Vmlld3BvcnRUb3AgPSAoZWwsIHNjcm9sbENvbnRhaW5lcikgPT4ge1xuICBsZXQgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIHJldHVybiBNYXRoLmNlaWwocmVjdC50b3ApID49IHRvcChzY3JvbGxDb250YWluZXIpICYmIE1hdGguY2VpbChyZWN0LmxlZnQpID49IDAgJiYgTWF0aC5mbG9vcihyZWN0LnRvcCkgPD0gYm90dG9tKHNjcm9sbENvbnRhaW5lcilcbn1cblxubGV0IGlzQXRWaWV3cG9ydEJvdHRvbSA9IChlbCwgc2Nyb2xsQ29udGFpbmVyKSA9PiB7XG4gIGxldCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgcmV0dXJuIE1hdGguY2VpbChyZWN0LmJvdHRvbSkgPj0gdG9wKHNjcm9sbENvbnRhaW5lcikgJiYgTWF0aC5jZWlsKHJlY3QubGVmdCkgPj0gMCAmJiBNYXRoLmZsb29yKHJlY3QuYm90dG9tKSA8PSBib3R0b20oc2Nyb2xsQ29udGFpbmVyKVxufVxuXG5sZXQgaXNXaXRoaW5WaWV3cG9ydCA9IChlbCwgc2Nyb2xsQ29udGFpbmVyKSA9PiB7XG4gIGxldCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgcmV0dXJuIE1hdGguY2VpbChyZWN0LnRvcCkgPj0gdG9wKHNjcm9sbENvbnRhaW5lcikgJiYgTWF0aC5jZWlsKHJlY3QubGVmdCkgPj0gMCAmJiBNYXRoLmZsb29yKHJlY3QudG9wKSA8PSBib3R0b20oc2Nyb2xsQ29udGFpbmVyKVxufVxuXG5Ib29rcy5JbmZpbml0ZVNjcm9sbCA9IHtcbiAgbW91bnRlZCgpe1xuICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyID0gZmluZFNjcm9sbENvbnRhaW5lcih0aGlzLmVsKVxuICAgIGxldCBzY3JvbGxCZWZvcmUgPSBzY3JvbGxUb3AodGhpcy5zY3JvbGxDb250YWluZXIpXG4gICAgbGV0IHRvcE92ZXJyYW4gPSBmYWxzZVxuICAgIGxldCB0aHJvdHRsZUludGVydmFsID0gNTAwXG4gICAgbGV0IHBlbmRpbmdPcCA9IG51bGxcblxuICAgIGxldCBvblRvcE92ZXJydW4gPSB0aGlzLnRocm90dGxlKHRocm90dGxlSW50ZXJ2YWwsICh0b3BFdmVudCwgZmlyc3RDaGlsZCkgPT4ge1xuICAgICAgcGVuZGluZ09wID0gKCkgPT4gdHJ1ZVxuICAgICAgdGhpcy5saXZlU29ja2V0LmV4ZWNKU0hvb2tQdXNoKHRoaXMuZWwsIHRvcEV2ZW50LCB7aWQ6IGZpcnN0Q2hpbGQuaWQsIF9vdmVycmFuOiB0cnVlfSwgKCkgPT4ge1xuICAgICAgICBwZW5kaW5nT3AgPSBudWxsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBsZXQgb25GaXJzdENoaWxkQXRUb3AgPSB0aGlzLnRocm90dGxlKHRocm90dGxlSW50ZXJ2YWwsICh0b3BFdmVudCwgZmlyc3RDaGlsZCkgPT4ge1xuICAgICAgcGVuZGluZ09wID0gKCkgPT4gZmlyc3RDaGlsZC5zY3JvbGxJbnRvVmlldyh7YmxvY2s6IFwic3RhcnRcIn0pXG4gICAgICB0aGlzLmxpdmVTb2NrZXQuZXhlY0pTSG9va1B1c2godGhpcy5lbCwgdG9wRXZlbnQsIHtpZDogZmlyc3RDaGlsZC5pZH0sICgpID0+IHtcbiAgICAgICAgcGVuZGluZ09wID0gbnVsbFxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhhdCB0aGUgRE9NIGlzIHBhdGNoZWQgYnkgd2FpdGluZyBmb3IgdGhlIG5leHQgdGlja1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBpZighaXNXaXRoaW5WaWV3cG9ydChmaXJzdENoaWxkLCB0aGlzLnNjcm9sbENvbnRhaW5lcikpe1xuICAgICAgICAgICAgZmlyc3RDaGlsZC5zY3JvbGxJbnRvVmlldyh7YmxvY2s6IFwic3RhcnRcIn0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgbGV0IG9uTGFzdENoaWxkQXRCb3R0b20gPSB0aGlzLnRocm90dGxlKHRocm90dGxlSW50ZXJ2YWwsIChib3R0b21FdmVudCwgbGFzdENoaWxkKSA9PiB7XG4gICAgICBwZW5kaW5nT3AgPSAoKSA9PiBsYXN0Q2hpbGQuc2Nyb2xsSW50b1ZpZXcoe2Jsb2NrOiBcImVuZFwifSlcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5leGVjSlNIb29rUHVzaCh0aGlzLmVsLCBib3R0b21FdmVudCwge2lkOiBsYXN0Q2hpbGQuaWR9LCAoKSA9PiB7XG4gICAgICAgIHBlbmRpbmdPcCA9IG51bGxcbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoYXQgdGhlIERPTSBpcyBwYXRjaGVkIGJ5IHdhaXRpbmcgZm9yIHRoZSBuZXh0IHRpY2tcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgaWYoIWlzV2l0aGluVmlld3BvcnQobGFzdENoaWxkLCB0aGlzLnNjcm9sbENvbnRhaW5lcikpe1xuICAgICAgICAgICAgbGFzdENoaWxkLnNjcm9sbEludG9WaWV3KHtibG9jazogXCJlbmRcIn0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vblNjcm9sbCA9IChfZSkgPT4ge1xuICAgICAgbGV0IHNjcm9sbE5vdyA9IHNjcm9sbFRvcCh0aGlzLnNjcm9sbENvbnRhaW5lcilcblxuICAgICAgaWYocGVuZGluZ09wKXtcbiAgICAgICAgc2Nyb2xsQmVmb3JlID0gc2Nyb2xsTm93XG4gICAgICAgIHJldHVybiBwZW5kaW5nT3AoKVxuICAgICAgfVxuICAgICAgbGV0IHJlY3QgPSB0aGlzLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBsZXQgdG9wRXZlbnQgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZSh0aGlzLmxpdmVTb2NrZXQuYmluZGluZyhcInZpZXdwb3J0LXRvcFwiKSlcbiAgICAgIGxldCBib3R0b21FdmVudCA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKHRoaXMubGl2ZVNvY2tldC5iaW5kaW5nKFwidmlld3BvcnQtYm90dG9tXCIpKVxuICAgICAgbGV0IGxhc3RDaGlsZCA9IHRoaXMuZWwubGFzdEVsZW1lbnRDaGlsZFxuICAgICAgbGV0IGZpcnN0Q2hpbGQgPSB0aGlzLmVsLmZpcnN0RWxlbWVudENoaWxkXG4gICAgICBsZXQgaXNTY3JvbGxpbmdVcCA9IHNjcm9sbE5vdyA8IHNjcm9sbEJlZm9yZVxuICAgICAgbGV0IGlzU2Nyb2xsaW5nRG93biA9IHNjcm9sbE5vdyA+IHNjcm9sbEJlZm9yZVxuXG4gICAgICAvLyBlbCBvdmVycmFuIHdoaWxlIHNjcm9sbGluZyB1cFxuICAgICAgaWYoaXNTY3JvbGxpbmdVcCAmJiB0b3BFdmVudCAmJiAhdG9wT3ZlcnJhbiAmJiByZWN0LnRvcCA+PSAwKXtcbiAgICAgICAgdG9wT3ZlcnJhbiA9IHRydWVcbiAgICAgICAgb25Ub3BPdmVycnVuKHRvcEV2ZW50LCBmaXJzdENoaWxkKVxuICAgICAgfSBlbHNlIGlmKGlzU2Nyb2xsaW5nRG93biAmJiB0b3BPdmVycmFuICYmIHJlY3QudG9wIDw9IDApe1xuICAgICAgICB0b3BPdmVycmFuID0gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYodG9wRXZlbnQgJiYgaXNTY3JvbGxpbmdVcCAmJiBpc0F0Vmlld3BvcnRUb3AoZmlyc3RDaGlsZCwgdGhpcy5zY3JvbGxDb250YWluZXIpKXtcbiAgICAgICAgb25GaXJzdENoaWxkQXRUb3AodG9wRXZlbnQsIGZpcnN0Q2hpbGQpXG4gICAgICB9IGVsc2UgaWYoYm90dG9tRXZlbnQgJiYgaXNTY3JvbGxpbmdEb3duICYmIGlzQXRWaWV3cG9ydEJvdHRvbShsYXN0Q2hpbGQsIHRoaXMuc2Nyb2xsQ29udGFpbmVyKSl7XG4gICAgICAgIG9uTGFzdENoaWxkQXRCb3R0b20oYm90dG9tRXZlbnQsIGxhc3RDaGlsZClcbiAgICAgIH1cbiAgICAgIHNjcm9sbEJlZm9yZSA9IHNjcm9sbE5vd1xuICAgIH1cblxuICAgIGlmKHRoaXMuc2Nyb2xsQ29udGFpbmVyKXtcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy5vblNjcm9sbClcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy5vblNjcm9sbClcbiAgICB9XG4gIH0sXG4gIFxuICBkZXN0cm95ZWQoKXtcbiAgICBpZih0aGlzLnNjcm9sbENvbnRhaW5lcil7XG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMub25TY3JvbGwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMub25TY3JvbGwpXG4gICAgfVxuICB9LFxuXG4gIHRocm90dGxlKGludGVydmFsLCBjYWxsYmFjayl7XG4gICAgbGV0IGxhc3RDYWxsQXQgPSAwXG4gICAgbGV0IHRpbWVyXG5cbiAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgIGxldCBub3cgPSBEYXRlLm5vdygpXG4gICAgICBsZXQgcmVtYWluaW5nVGltZSA9IGludGVydmFsIC0gKG5vdyAtIGxhc3RDYWxsQXQpXG5cbiAgICAgIGlmKHJlbWFpbmluZ1RpbWUgPD0gMCB8fCByZW1haW5pbmdUaW1lID4gaW50ZXJ2YWwpe1xuICAgICAgICBpZih0aW1lcil7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKVxuICAgICAgICAgIHRpbWVyID0gbnVsbFxuICAgICAgICB9XG4gICAgICAgIGxhc3RDYWxsQXQgPSBub3dcbiAgICAgICAgY2FsbGJhY2soLi4uYXJncylcbiAgICAgIH0gZWxzZSBpZighdGltZXIpe1xuICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGxhc3RDYWxsQXQgPSBEYXRlLm5vdygpXG4gICAgICAgICAgdGltZXIgPSBudWxsXG4gICAgICAgICAgY2FsbGJhY2soLi4uYXJncylcbiAgICAgICAgfSwgcmVtYWluaW5nVGltZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IEhvb2tzXG4iLCAiaW1wb3J0IHtcbiAgUEhYX1JFRl9MT0FESU5HLFxuICBQSFhfUkVGX0xPQ0ssXG4gIFBIWF9SRUZfU1JDLFxuICBQSFhfUEVORElOR19SRUZTLFxuICBQSFhfRVZFTlRfQ0xBU1NFUyxcbiAgUEhYX0RJU0FCTEVELFxuICBQSFhfUkVBRE9OTFksXG4gIFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRVxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVsZW1lbnRSZWYge1xuICBzdGF0aWMgb25VbmxvY2soZWwsIGNhbGxiYWNrKXtcbiAgICBpZighRE9NLmlzTG9ja2VkKGVsKSAmJiAhZWwuY2xvc2VzdChgWyR7UEhYX1JFRl9MT0NLfV1gKSl7IHJldHVybiBjYWxsYmFjaygpIH1cbiAgICBjb25zdCBjbG9zZXN0TG9jayA9IGVsLmNsb3Nlc3QoYFske1BIWF9SRUZfTE9DS31dYClcbiAgICBjb25zdCByZWYgPSBjbG9zZXN0TG9jay5jbG9zZXN0KGBbJHtQSFhfUkVGX0xPQ0t9XWApLmdldEF0dHJpYnV0ZShQSFhfUkVGX0xPQ0spXG4gICAgY2xvc2VzdExvY2suYWRkRXZlbnRMaXN0ZW5lcihgcGh4OnVuZG8tbG9jazoke3JlZn1gLCAoKSA9PiB7XG4gICAgICBjYWxsYmFjaygpXG4gICAgfSwge29uY2U6IHRydWV9KVxuICB9XG5cbiAgY29uc3RydWN0b3IoZWwpe1xuICAgIHRoaXMuZWwgPSBlbFxuICAgIHRoaXMubG9hZGluZ1JlZiA9IGVsLmhhc0F0dHJpYnV0ZShQSFhfUkVGX0xPQURJTkcpID8gcGFyc2VJbnQoZWwuZ2V0QXR0cmlidXRlKFBIWF9SRUZfTE9BRElORyksIDEwKSA6IG51bGxcbiAgICB0aGlzLmxvY2tSZWYgPSBlbC5oYXNBdHRyaWJ1dGUoUEhYX1JFRl9MT0NLKSA/IHBhcnNlSW50KGVsLmdldEF0dHJpYnV0ZShQSFhfUkVGX0xPQ0spLCAxMCkgOiBudWxsXG4gIH1cblxuICAvLyBwdWJsaWNcblxuICBtYXliZVVuZG8ocmVmLCBwaHhFdmVudCwgZWFjaENsb25lQ2FsbGJhY2spe1xuICAgIGlmKCF0aGlzLmlzV2l0aGluKHJlZikpe1xuICAgICAgLy8gd2UgY2Fubm90IHVuZG8gdGhlIGxvY2sgLyBsb2FkaW5nIG5vdywgYXMgdGhlcmUgaXMgYSBuZXdlciBvbmUgYWxyZWFkeSBzZXQ7XG4gICAgICAvLyB3ZSBuZWVkIHRvIHN0b3JlIHRoZSBvcmlnaW5hbCByZWYgd2UgdHJpZWQgdG8gc2VuZCB0aGUgdW5kbyBldmVudCBsYXRlclxuICAgICAgRE9NLnVwZGF0ZVByaXZhdGUodGhpcy5lbCwgUEhYX1BFTkRJTkdfUkVGUywgW10sIChwZW5kaW5nUmVmcykgPT4ge1xuICAgICAgICBwZW5kaW5nUmVmcy5wdXNoKHJlZilcbiAgICAgICAgcmV0dXJuIHBlbmRpbmdSZWZzXG4gICAgICB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gdW5kbyBsb2NrcyBhbmQgYXBwbHkgY2xvbmVzXG4gICAgdGhpcy51bmRvTG9ja3MocmVmLCBwaHhFdmVudCwgZWFjaENsb25lQ2FsbGJhY2spXG5cbiAgICAvLyB1bmRvIGxvYWRpbmcgc3RhdGVzXG4gICAgdGhpcy51bmRvTG9hZGluZyhyZWYsIHBoeEV2ZW50KVxuXG4gICAgLy8gZW5zdXJlIHVuZG8gZXZlbnRzIGFyZSBmaXJlZCBmb3IgcGVuZGluZyByZWZzIHRoYXRcbiAgICAvLyBhcmUgcmVzb2x2ZWQgYnkgdGhlIGN1cnJlbnQgcmVmLCBvdGhlcndpc2Ugd2UnZCBsZWFrIGV2ZW50IGxpc3RlbmVyc1xuICAgIERPTS51cGRhdGVQcml2YXRlKHRoaXMuZWwsIFBIWF9QRU5ESU5HX1JFRlMsIFtdLCAocGVuZGluZ1JlZnMpID0+IHtcbiAgICAgIHJldHVybiBwZW5kaW5nUmVmcy5maWx0ZXIoKHBlbmRpbmdSZWYpID0+IHtcbiAgICAgICAgbGV0IG9wdHMgPSB7XG4gICAgICAgICAgZGV0YWlsOiB7cmVmOiBwZW5kaW5nUmVmLCBldmVudDogcGh4RXZlbnR9LFxuICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5sb2FkaW5nUmVmICYmIHRoaXMubG9hZGluZ1JlZiA+IHBlbmRpbmdSZWYpe1xuICAgICAgICAgIHRoaXMuZWwuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICAgIG5ldyBDdXN0b21FdmVudChgcGh4OnVuZG8tbG9hZGluZzoke3BlbmRpbmdSZWZ9YCwgb3B0cyksXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMubG9ja1JlZiAmJiB0aGlzLmxvY2tSZWYgPiBwZW5kaW5nUmVmKXtcbiAgICAgICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoYHBoeDp1bmRvLWxvY2s6JHtwZW5kaW5nUmVmfWAsIG9wdHMpLFxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGVuZGluZ1JlZiA+IHJlZlxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLy8gY2xlYW4gdXAgaWYgZnVsbHkgcmVzb2x2ZWRcbiAgICBpZih0aGlzLmlzRnVsbHlSZXNvbHZlZEJ5KHJlZikpeyB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX1NSQykgfVxuICB9XG5cbiAgLy8gcHJpdmF0ZVxuXG4gIGlzV2l0aGluKHJlZil7XG4gICAgcmV0dXJuICEoKHRoaXMubG9hZGluZ1JlZiAhPT0gbnVsbCAmJiB0aGlzLmxvYWRpbmdSZWYgPiByZWYpICYmICh0aGlzLmxvY2tSZWYgIT09IG51bGwgJiYgdGhpcy5sb2NrUmVmID4gcmVmKSlcbiAgfVxuXG4gIC8vIENoZWNrIGZvciBjbG9uZWQgUEhYX1JFRl9MT0NLIGVsZW1lbnQgdGhhdCBoYXMgYmVlbiBtb3JwaGVkIGJlaGluZFxuICAvLyB0aGUgc2NlbmVzIHdoaWxlIHRoaXMgZWxlbWVudCB3YXMgbG9ja2VkIGluIHRoZSBET00uXG4gIC8vIFdoZW4gd2UgYXBwbHkgdGhlIGNsb25lZCB0cmVlIHRvIHRoZSBhY3RpdmUgRE9NIGVsZW1lbnQsIHdlIG11c3RcbiAgLy9cbiAgLy8gICAxLiBleGVjdXRlIHBlbmRpbmcgbW91bnRlZCBob29rcyBmb3Igbm9kZXMgbm93IGluIHRoZSBET01cbiAgLy8gICAyLiB1bmRvIGFueSByZWYgaW5zaWRlIHRoZSBjbG9uZWQgdHJlZSB0aGF0IGhhcyBzaW5jZSBiZWVuIGFjaydkXG4gIHVuZG9Mb2NrcyhyZWYsIHBoeEV2ZW50LCBlYWNoQ2xvbmVDYWxsYmFjayl7XG4gICAgaWYoIXRoaXMuaXNMb2NrVW5kb25lQnkocmVmKSl7IHJldHVybiB9XG5cbiAgICBsZXQgY2xvbmVkVHJlZSA9IERPTS5wcml2YXRlKHRoaXMuZWwsIFBIWF9SRUZfTE9DSylcbiAgICBpZihjbG9uZWRUcmVlKXtcbiAgICAgIGVhY2hDbG9uZUNhbGxiYWNrKGNsb25lZFRyZWUpXG4gICAgICBET00uZGVsZXRlUHJpdmF0ZSh0aGlzLmVsLCBQSFhfUkVGX0xPQ0spXG4gICAgfVxuICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUZfTE9DSylcblxuICAgIGxldCBvcHRzID0ge2RldGFpbDoge3JlZjogcmVmLCBldmVudDogcGh4RXZlbnR9LCBidWJibGVzOiB0cnVlLCBjYW5jZWxhYmxlOiBmYWxzZX1cbiAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGBwaHg6dW5kby1sb2NrOiR7dGhpcy5sb2NrUmVmfWAsIG9wdHMpKVxuICB9XG5cbiAgdW5kb0xvYWRpbmcocmVmLCBwaHhFdmVudCl7XG4gICAgaWYoIXRoaXMuaXNMb2FkaW5nVW5kb25lQnkocmVmKSl7XG4gICAgICBpZih0aGlzLmNhblVuZG9Mb2FkaW5nKHJlZikgJiYgdGhpcy5lbC5jbGFzc0xpc3QuY29udGFpbnMoXCJwaHgtc3VibWl0LWxvYWRpbmdcIikpe1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoXCJwaHgtY2hhbmdlLWxvYWRpbmdcIilcbiAgICAgIH1cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmKHRoaXMuY2FuVW5kb0xvYWRpbmcocmVmKSl7XG4gICAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX0xPQURJTkcpXG4gICAgICBsZXQgZGlzYWJsZWRWYWwgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQpXG4gICAgICBsZXQgcmVhZE9ubHlWYWwgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfUkVBRE9OTFkpXG4gICAgICAvLyByZXN0b3JlIGlucHV0c1xuICAgICAgaWYocmVhZE9ubHlWYWwgIT09IG51bGwpe1xuICAgICAgICB0aGlzLmVsLnJlYWRPbmx5ID0gcmVhZE9ubHlWYWwgPT09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlXG4gICAgICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUFET05MWSlcbiAgICAgIH1cbiAgICAgIGlmKGRpc2FibGVkVmFsICE9PSBudWxsKXtcbiAgICAgICAgdGhpcy5lbC5kaXNhYmxlZCA9IGRpc2FibGVkVmFsID09PSBcInRydWVcIiA/IHRydWUgOiBmYWxzZVxuICAgICAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfRElTQUJMRUQpXG4gICAgICB9XG4gICAgICAvLyByZXN0b3JlIGRpc2FibGVzXG4gICAgICBsZXQgZGlzYWJsZVJlc3RvcmUgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUpXG4gICAgICBpZihkaXNhYmxlUmVzdG9yZSAhPT0gbnVsbCl7XG4gICAgICAgIHRoaXMuZWwuaW5uZXJUZXh0ID0gZGlzYWJsZVJlc3RvcmVcbiAgICAgICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFKVxuICAgICAgfVxuXG4gICAgICBsZXQgb3B0cyA9IHtkZXRhaWw6IHtyZWY6IHJlZiwgZXZlbnQ6IHBoeEV2ZW50fSwgYnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogZmFsc2V9XG4gICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGBwaHg6dW5kby1sb2FkaW5nOiR7dGhpcy5sb2FkaW5nUmVmfWAsIG9wdHMpKVxuICAgIH1cblxuICAgIC8vIHJlbW92ZSBjbGFzc2VzXG4gICAgUEhYX0VWRU5UX0NMQVNTRVMuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGlmKG5hbWUgIT09IFwicGh4LXN1Ym1pdC1sb2FkaW5nXCIgfHwgdGhpcy5jYW5VbmRvTG9hZGluZyhyZWYpKXtcbiAgICAgICAgRE9NLnJlbW92ZUNsYXNzKHRoaXMuZWwsIG5hbWUpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGlzTG9hZGluZ1VuZG9uZUJ5KHJlZil7IHJldHVybiB0aGlzLmxvYWRpbmdSZWYgPT09IG51bGwgPyBmYWxzZSA6IHRoaXMubG9hZGluZ1JlZiA8PSByZWYgfVxuICBpc0xvY2tVbmRvbmVCeShyZWYpeyByZXR1cm4gdGhpcy5sb2NrUmVmID09PSBudWxsID8gZmFsc2UgOiB0aGlzLmxvY2tSZWYgPD0gcmVmIH1cblxuICBpc0Z1bGx5UmVzb2x2ZWRCeShyZWYpe1xuICAgIHJldHVybiAodGhpcy5sb2FkaW5nUmVmID09PSBudWxsIHx8IHRoaXMubG9hZGluZ1JlZiA8PSByZWYpICYmICh0aGlzLmxvY2tSZWYgPT09IG51bGwgfHwgdGhpcy5sb2NrUmVmIDw9IHJlZilcbiAgfVxuXG4gIC8vIG9ubHkgcmVtb3ZlIHRoZSBwaHgtc3VibWl0LWxvYWRpbmcgY2xhc3MgaWYgd2UgYXJlIG5vdCBsb2NrZWRcbiAgY2FuVW5kb0xvYWRpbmcocmVmKXsgcmV0dXJuIHRoaXMubG9ja1JlZiA9PT0gbnVsbCB8fCB0aGlzLmxvY2tSZWYgPD0gcmVmIH1cbn1cbiIsICJpbXBvcnQge1xuICBtYXliZVxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRE9NUG9zdE1vcnBoUmVzdG9yZXIge1xuICBjb25zdHJ1Y3Rvcihjb250YWluZXJCZWZvcmUsIGNvbnRhaW5lckFmdGVyLCB1cGRhdGVUeXBlKXtcbiAgICBsZXQgaWRzQmVmb3JlID0gbmV3IFNldCgpXG4gICAgbGV0IGlkc0FmdGVyID0gbmV3IFNldChbLi4uY29udGFpbmVyQWZ0ZXIuY2hpbGRyZW5dLm1hcChjaGlsZCA9PiBjaGlsZC5pZCkpXG5cbiAgICBsZXQgZWxlbWVudHNUb01vZGlmeSA9IFtdXG5cbiAgICBBcnJheS5mcm9tKGNvbnRhaW5lckJlZm9yZS5jaGlsZHJlbikuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICBpZihjaGlsZC5pZCl7IC8vIGFsbCBvZiBvdXIgY2hpbGRyZW4gc2hvdWxkIGJlIGVsZW1lbnRzIHdpdGggaWRzXG4gICAgICAgIGlkc0JlZm9yZS5hZGQoY2hpbGQuaWQpXG4gICAgICAgIGlmKGlkc0FmdGVyLmhhcyhjaGlsZC5pZCkpe1xuICAgICAgICAgIGxldCBwcmV2aW91c0VsZW1lbnRJZCA9IGNoaWxkLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgJiYgY2hpbGQucHJldmlvdXNFbGVtZW50U2libGluZy5pZFxuICAgICAgICAgIGVsZW1lbnRzVG9Nb2RpZnkucHVzaCh7ZWxlbWVudElkOiBjaGlsZC5pZCwgcHJldmlvdXNFbGVtZW50SWQ6IHByZXZpb3VzRWxlbWVudElkfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmNvbnRhaW5lcklkID0gY29udGFpbmVyQWZ0ZXIuaWRcbiAgICB0aGlzLnVwZGF0ZVR5cGUgPSB1cGRhdGVUeXBlXG4gICAgdGhpcy5lbGVtZW50c1RvTW9kaWZ5ID0gZWxlbWVudHNUb01vZGlmeVxuICAgIHRoaXMuZWxlbWVudElkc1RvQWRkID0gWy4uLmlkc0FmdGVyXS5maWx0ZXIoaWQgPT4gIWlkc0JlZm9yZS5oYXMoaWQpKVxuICB9XG5cbiAgLy8gV2UgZG8gdGhlIGZvbGxvd2luZyB0byBvcHRpbWl6ZSBhcHBlbmQvcHJlcGVuZCBvcGVyYXRpb25zOlxuICAvLyAgIDEpIFRyYWNrIGlkcyBvZiBtb2RpZmllZCBlbGVtZW50cyAmIG9mIG5ldyBlbGVtZW50c1xuICAvLyAgIDIpIEFsbCB0aGUgbW9kaWZpZWQgZWxlbWVudHMgYXJlIHB1dCBiYWNrIGluIHRoZSBjb3JyZWN0IHBvc2l0aW9uIGluIHRoZSBET00gdHJlZVxuICAvLyAgICAgIGJ5IHN0b3JpbmcgdGhlIGlkIG9mIHRoZWlyIHByZXZpb3VzIHNpYmxpbmdcbiAgLy8gICAzKSBOZXcgZWxlbWVudHMgYXJlIGdvaW5nIHRvIGJlIHB1dCBpbiB0aGUgcmlnaHQgcGxhY2UgYnkgbW9ycGhkb20gZHVyaW5nIGFwcGVuZC5cbiAgLy8gICAgICBGb3IgcHJlcGVuZCwgd2UgbW92ZSB0aGVtIHRvIHRoZSBmaXJzdCBwb3NpdGlvbiBpbiB0aGUgY29udGFpbmVyXG4gIHBlcmZvcm0oKXtcbiAgICBsZXQgY29udGFpbmVyID0gRE9NLmJ5SWQodGhpcy5jb250YWluZXJJZClcbiAgICB0aGlzLmVsZW1lbnRzVG9Nb2RpZnkuZm9yRWFjaChlbGVtZW50VG9Nb2RpZnkgPT4ge1xuICAgICAgaWYoZWxlbWVudFRvTW9kaWZ5LnByZXZpb3VzRWxlbWVudElkKXtcbiAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudFRvTW9kaWZ5LnByZXZpb3VzRWxlbWVudElkKSwgcHJldmlvdXNFbGVtID0+IHtcbiAgICAgICAgICBtYXliZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50VG9Nb2RpZnkuZWxlbWVudElkKSwgZWxlbSA9PiB7XG4gICAgICAgICAgICBsZXQgaXNJblJpZ2h0UGxhY2UgPSBlbGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgJiYgZWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmlkID09IHByZXZpb3VzRWxlbS5pZFxuICAgICAgICAgICAgaWYoIWlzSW5SaWdodFBsYWNlKXtcbiAgICAgICAgICAgICAgcHJldmlvdXNFbGVtLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyZW5kXCIsIGVsZW0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIGNvbnRhaW5lclxuICAgICAgICBtYXliZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50VG9Nb2RpZnkuZWxlbWVudElkKSwgZWxlbSA9PiB7XG4gICAgICAgICAgbGV0IGlzSW5SaWdodFBsYWNlID0gZWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nID09IG51bGxcbiAgICAgICAgICBpZighaXNJblJpZ2h0UGxhY2Upe1xuICAgICAgICAgICAgY29udGFpbmVyLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyYmVnaW5cIiwgZWxlbSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmKHRoaXMudXBkYXRlVHlwZSA9PSBcInByZXBlbmRcIil7XG4gICAgICB0aGlzLmVsZW1lbnRJZHNUb0FkZC5yZXZlcnNlKCkuZm9yRWFjaChlbGVtSWQgPT4ge1xuICAgICAgICBtYXliZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtSWQpLCBlbGVtID0+IGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIGVsZW0pKVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cbiIsICJ2YXIgRE9DVU1FTlRfRlJBR01FTlRfTk9ERSA9IDExO1xuXG5mdW5jdGlvbiBtb3JwaEF0dHJzKGZyb21Ob2RlLCB0b05vZGUpIHtcbiAgICB2YXIgdG9Ob2RlQXR0cnMgPSB0b05vZGUuYXR0cmlidXRlcztcbiAgICB2YXIgYXR0cjtcbiAgICB2YXIgYXR0ck5hbWU7XG4gICAgdmFyIGF0dHJOYW1lc3BhY2VVUkk7XG4gICAgdmFyIGF0dHJWYWx1ZTtcbiAgICB2YXIgZnJvbVZhbHVlO1xuXG4gICAgLy8gZG9jdW1lbnQtZnJhZ21lbnRzIGRvbnQgaGF2ZSBhdHRyaWJ1dGVzIHNvIGxldHMgbm90IGRvIGFueXRoaW5nXG4gICAgaWYgKHRvTm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSB8fCBmcm9tTm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBhdHRyaWJ1dGVzIG9uIG9yaWdpbmFsIERPTSBlbGVtZW50XG4gICAgZm9yICh2YXIgaSA9IHRvTm9kZUF0dHJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGF0dHIgPSB0b05vZGVBdHRyc1tpXTtcbiAgICAgICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XG4gICAgICAgIGF0dHJOYW1lc3BhY2VVUkkgPSBhdHRyLm5hbWVzcGFjZVVSSTtcbiAgICAgICAgYXR0clZhbHVlID0gYXR0ci52YWx1ZTtcblxuICAgICAgICBpZiAoYXR0ck5hbWVzcGFjZVVSSSkge1xuICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLmxvY2FsTmFtZSB8fCBhdHRyTmFtZTtcbiAgICAgICAgICAgIGZyb21WYWx1ZSA9IGZyb21Ob2RlLmdldEF0dHJpYnV0ZU5TKGF0dHJOYW1lc3BhY2VVUkksIGF0dHJOYW1lKTtcblxuICAgICAgICAgICAgaWYgKGZyb21WYWx1ZSAhPT0gYXR0clZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHIucHJlZml4ID09PSAneG1sbnMnKXtcbiAgICAgICAgICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7IC8vIEl0J3Mgbm90IGFsbG93ZWQgdG8gc2V0IGFuIGF0dHJpYnV0ZSB3aXRoIHRoZSBYTUxOUyBuYW1lc3BhY2Ugd2l0aG91dCBzcGVjaWZ5aW5nIHRoZSBgeG1sbnNgIHByZWZpeFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmcm9tTm9kZS5zZXRBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZyb21WYWx1ZSA9IGZyb21Ob2RlLmdldEF0dHJpYnV0ZShhdHRyTmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChmcm9tVmFsdWUgIT09IGF0dHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGZyb21Ob2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBhbnkgZXh0cmEgYXR0cmlidXRlcyBmb3VuZCBvbiB0aGUgb3JpZ2luYWwgRE9NIGVsZW1lbnQgdGhhdFxuICAgIC8vIHdlcmVuJ3QgZm91bmQgb24gdGhlIHRhcmdldCBlbGVtZW50LlxuICAgIHZhciBmcm9tTm9kZUF0dHJzID0gZnJvbU5vZGUuYXR0cmlidXRlcztcblxuICAgIGZvciAodmFyIGQgPSBmcm9tTm9kZUF0dHJzLmxlbmd0aCAtIDE7IGQgPj0gMDsgZC0tKSB7XG4gICAgICAgIGF0dHIgPSBmcm9tTm9kZUF0dHJzW2RdO1xuICAgICAgICBhdHRyTmFtZSA9IGF0dHIubmFtZTtcbiAgICAgICAgYXR0ck5hbWVzcGFjZVVSSSA9IGF0dHIubmFtZXNwYWNlVVJJO1xuXG4gICAgICAgIGlmIChhdHRyTmFtZXNwYWNlVVJJKSB7XG4gICAgICAgICAgICBhdHRyTmFtZSA9IGF0dHIubG9jYWxOYW1lIHx8IGF0dHJOYW1lO1xuXG4gICAgICAgICAgICBpZiAoIXRvTm9kZS5oYXNBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmcm9tTm9kZS5yZW1vdmVBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRvTm9kZS5oYXNBdHRyaWJ1dGUoYXR0ck5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZnJvbU5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxudmFyIHJhbmdlOyAvLyBDcmVhdGUgYSByYW5nZSBvYmplY3QgZm9yIGVmZmljZW50bHkgcmVuZGVyaW5nIHN0cmluZ3MgdG8gZWxlbWVudHMuXG52YXIgTlNfWEhUTUwgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCc7XG5cbnZhciBkb2MgPSB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogZG9jdW1lbnQ7XG52YXIgSEFTX1RFTVBMQVRFX1NVUFBPUlQgPSAhIWRvYyAmJiAnY29udGVudCcgaW4gZG9jLmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG52YXIgSEFTX1JBTkdFX1NVUFBPUlQgPSAhIWRvYyAmJiBkb2MuY3JlYXRlUmFuZ2UgJiYgJ2NyZWF0ZUNvbnRleHR1YWxGcmFnbWVudCcgaW4gZG9jLmNyZWF0ZVJhbmdlKCk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUZyYWdtZW50RnJvbVRlbXBsYXRlKHN0cikge1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRvYy5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cjtcbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzWzBdO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudEZyb21SYW5nZShzdHIpIHtcbiAgICBpZiAoIXJhbmdlKSB7XG4gICAgICAgIHJhbmdlID0gZG9jLmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgIHJhbmdlLnNlbGVjdE5vZGUoZG9jLmJvZHkpO1xuICAgIH1cblxuICAgIHZhciBmcmFnbWVudCA9IHJhbmdlLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzdHIpO1xuICAgIHJldHVybiBmcmFnbWVudC5jaGlsZE5vZGVzWzBdO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudEZyb21XcmFwKHN0cikge1xuICAgIHZhciBmcmFnbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdib2R5Jyk7XG4gICAgZnJhZ21lbnQuaW5uZXJIVE1MID0gc3RyO1xuICAgIHJldHVybiBmcmFnbWVudC5jaGlsZE5vZGVzWzBdO1xufVxuXG4vKipcbiAqIFRoaXMgaXMgYWJvdXQgdGhlIHNhbWVcbiAqIHZhciBodG1sID0gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhzdHIsICd0ZXh0L2h0bWwnKTtcbiAqIHJldHVybiBodG1sLmJvZHkuZmlyc3RDaGlsZDtcbiAqXG4gKiBAbWV0aG9kIHRvRWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICovXG5mdW5jdGlvbiB0b0VsZW1lbnQoc3RyKSB7XG4gICAgc3RyID0gc3RyLnRyaW0oKTtcbiAgICBpZiAoSEFTX1RFTVBMQVRFX1NVUFBPUlQpIHtcbiAgICAgIC8vIGF2b2lkIHJlc3RyaWN0aW9ucyBvbiBjb250ZW50IGZvciB0aGluZ3MgbGlrZSBgPHRyPjx0aD5IaTwvdGg+PC90cj5gIHdoaWNoXG4gICAgICAvLyBjcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQgZG9lc24ndCBzdXBwb3J0XG4gICAgICAvLyA8dGVtcGxhdGU+IHN1cHBvcnQgbm90IGF2YWlsYWJsZSBpbiBJRVxuICAgICAgcmV0dXJuIGNyZWF0ZUZyYWdtZW50RnJvbVRlbXBsYXRlKHN0cik7XG4gICAgfSBlbHNlIGlmIChIQVNfUkFOR0VfU1VQUE9SVCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZUZyYWdtZW50RnJvbVJhbmdlKHN0cik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNyZWF0ZUZyYWdtZW50RnJvbVdyYXAoc3RyKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdHdvIG5vZGUncyBuYW1lcyBhcmUgdGhlIHNhbWUuXG4gKlxuICogTk9URTogV2UgZG9uJ3QgYm90aGVyIGNoZWNraW5nIGBuYW1lc3BhY2VVUklgIGJlY2F1c2UgeW91IHdpbGwgbmV2ZXIgZmluZCB0d28gSFRNTCBlbGVtZW50cyB3aXRoIHRoZSBzYW1lXG4gKiAgICAgICBub2RlTmFtZSBhbmQgZGlmZmVyZW50IG5hbWVzcGFjZSBVUklzLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gYVxuICogQHBhcmFtIHtFbGVtZW50fSBiIFRoZSB0YXJnZXQgZWxlbWVudFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gY29tcGFyZU5vZGVOYW1lcyhmcm9tRWwsIHRvRWwpIHtcbiAgICB2YXIgZnJvbU5vZGVOYW1lID0gZnJvbUVsLm5vZGVOYW1lO1xuICAgIHZhciB0b05vZGVOYW1lID0gdG9FbC5ub2RlTmFtZTtcbiAgICB2YXIgZnJvbUNvZGVTdGFydCwgdG9Db2RlU3RhcnQ7XG5cbiAgICBpZiAoZnJvbU5vZGVOYW1lID09PSB0b05vZGVOYW1lKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZyb21Db2RlU3RhcnQgPSBmcm9tTm9kZU5hbWUuY2hhckNvZGVBdCgwKTtcbiAgICB0b0NvZGVTdGFydCA9IHRvTm9kZU5hbWUuY2hhckNvZGVBdCgwKTtcblxuICAgIC8vIElmIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBhIHZpcnR1YWwgRE9NIG5vZGUgb3IgU1ZHIG5vZGUgdGhlbiB3ZSBtYXlcbiAgICAvLyBuZWVkIHRvIG5vcm1hbGl6ZSB0aGUgdGFnIG5hbWUgYmVmb3JlIGNvbXBhcmluZy4gTm9ybWFsIEhUTUwgZWxlbWVudHMgdGhhdCBhcmVcbiAgICAvLyBpbiB0aGUgXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCJcbiAgICAvLyBhcmUgY29udmVydGVkIHRvIHVwcGVyIGNhc2VcbiAgICBpZiAoZnJvbUNvZGVTdGFydCA8PSA5MCAmJiB0b0NvZGVTdGFydCA+PSA5NykgeyAvLyBmcm9tIGlzIHVwcGVyIGFuZCB0byBpcyBsb3dlclxuICAgICAgICByZXR1cm4gZnJvbU5vZGVOYW1lID09PSB0b05vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgfSBlbHNlIGlmICh0b0NvZGVTdGFydCA8PSA5MCAmJiBmcm9tQ29kZVN0YXJ0ID49IDk3KSB7IC8vIHRvIGlzIHVwcGVyIGFuZCBmcm9tIGlzIGxvd2VyXG4gICAgICAgIHJldHVybiB0b05vZGVOYW1lID09PSBmcm9tTm9kZU5hbWUudG9VcHBlckNhc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBlbGVtZW50LCBvcHRpb25hbGx5IHdpdGggYSBrbm93biBuYW1lc3BhY2UgVVJJLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIHRoZSBlbGVtZW50IG5hbWUsIGUuZy4gJ2Rpdicgb3IgJ3N2ZydcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbmFtZXNwYWNlVVJJXSB0aGUgZWxlbWVudCdzIG5hbWVzcGFjZSBVUkksIGkuZS4gdGhlIHZhbHVlIG9mXG4gKiBpdHMgYHhtbG5zYCBhdHRyaWJ1dGUgb3IgaXRzIGluZmVycmVkIG5hbWVzcGFjZS5cbiAqXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxuICovXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50TlMobmFtZSwgbmFtZXNwYWNlVVJJKSB7XG4gICAgcmV0dXJuICFuYW1lc3BhY2VVUkkgfHwgbmFtZXNwYWNlVVJJID09PSBOU19YSFRNTCA/XG4gICAgICAgIGRvYy5jcmVhdGVFbGVtZW50KG5hbWUpIDpcbiAgICAgICAgZG9jLmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2VVUkksIG5hbWUpO1xufVxuXG4vKipcbiAqIENvcGllcyB0aGUgY2hpbGRyZW4gb2Ygb25lIERPTSBlbGVtZW50IHRvIGFub3RoZXIgRE9NIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gbW92ZUNoaWxkcmVuKGZyb21FbCwgdG9FbCkge1xuICAgIHZhciBjdXJDaGlsZCA9IGZyb21FbC5maXJzdENoaWxkO1xuICAgIHdoaWxlIChjdXJDaGlsZCkge1xuICAgICAgICB2YXIgbmV4dENoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgIHRvRWwuYXBwZW5kQ2hpbGQoY3VyQ2hpbGQpO1xuICAgICAgICBjdXJDaGlsZCA9IG5leHRDaGlsZDtcbiAgICB9XG4gICAgcmV0dXJuIHRvRWw7XG59XG5cbmZ1bmN0aW9uIHN5bmNCb29sZWFuQXR0clByb3AoZnJvbUVsLCB0b0VsLCBuYW1lKSB7XG4gICAgaWYgKGZyb21FbFtuYW1lXSAhPT0gdG9FbFtuYW1lXSkge1xuICAgICAgICBmcm9tRWxbbmFtZV0gPSB0b0VsW25hbWVdO1xuICAgICAgICBpZiAoZnJvbUVsW25hbWVdKSB7XG4gICAgICAgICAgICBmcm9tRWwuc2V0QXR0cmlidXRlKG5hbWUsICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbnZhciBzcGVjaWFsRWxIYW5kbGVycyA9IHtcbiAgICBPUFRJT046IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICB2YXIgcGFyZW50Tm9kZSA9IGZyb21FbC5wYXJlbnROb2RlO1xuICAgICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgdmFyIHBhcmVudE5hbWUgPSBwYXJlbnROb2RlLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAocGFyZW50TmFtZSA9PT0gJ09QVEdST1VQJykge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSBwYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgcGFyZW50TmFtZSA9IHBhcmVudE5vZGUgJiYgcGFyZW50Tm9kZS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhcmVudE5hbWUgPT09ICdTRUxFQ1QnICYmICFwYXJlbnROb2RlLmhhc0F0dHJpYnV0ZSgnbXVsdGlwbGUnKSkge1xuICAgICAgICAgICAgICAgIGlmIChmcm9tRWwuaGFzQXR0cmlidXRlKCdzZWxlY3RlZCcpICYmICF0b0VsLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdvcmthcm91bmQgZm9yIE1TIEVkZ2UgYnVnIHdoZXJlIHRoZSAnc2VsZWN0ZWQnIGF0dHJpYnV0ZSBjYW4gb25seSBiZVxuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmVkIGlmIHNldCB0byBhIG5vbi1lbXB0eSB2YWx1ZTpcbiAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubWljcm9zb2Z0LmNvbS9lbi11cy9taWNyb3NvZnQtZWRnZS9wbGF0Zm9ybS9pc3N1ZXMvMTIwODc2NzkvXG4gICAgICAgICAgICAgICAgICAgIGZyb21FbC5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gcmVzZXQgc2VsZWN0IGVsZW1lbnQncyBzZWxlY3RlZEluZGV4IHRvIC0xLCBvdGhlcndpc2Ugc2V0dGluZ1xuICAgICAgICAgICAgICAgIC8vIGZyb21FbC5zZWxlY3RlZCB1c2luZyB0aGUgc3luY0Jvb2xlYW5BdHRyUHJvcCBiZWxvdyBoYXMgbm8gZWZmZWN0LlxuICAgICAgICAgICAgICAgIC8vIFRoZSBjb3JyZWN0IHNlbGVjdGVkSW5kZXggd2lsbCBiZSBzZXQgaW4gdGhlIFNFTEVDVCBzcGVjaWFsIGhhbmRsZXIgYmVsb3cuXG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5zZWxlY3RlZEluZGV4ID0gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdzZWxlY3RlZCcpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogVGhlIFwidmFsdWVcIiBhdHRyaWJ1dGUgaXMgc3BlY2lhbCBmb3IgdGhlIDxpbnB1dD4gZWxlbWVudCBzaW5jZSBpdCBzZXRzXG4gICAgICogdGhlIGluaXRpYWwgdmFsdWUuIENoYW5naW5nIHRoZSBcInZhbHVlXCIgYXR0cmlidXRlIHdpdGhvdXQgY2hhbmdpbmcgdGhlXG4gICAgICogXCJ2YWx1ZVwiIHByb3BlcnR5IHdpbGwgaGF2ZSBubyBlZmZlY3Qgc2luY2UgaXQgaXMgb25seSB1c2VkIHRvIHRoZSBzZXQgdGhlXG4gICAgICogaW5pdGlhbCB2YWx1ZS4gIFNpbWlsYXIgZm9yIHRoZSBcImNoZWNrZWRcIiBhdHRyaWJ1dGUsIGFuZCBcImRpc2FibGVkXCIuXG4gICAgICovXG4gICAgSU5QVVQ6IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICBzeW5jQm9vbGVhbkF0dHJQcm9wKGZyb21FbCwgdG9FbCwgJ2NoZWNrZWQnKTtcbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdkaXNhYmxlZCcpO1xuXG4gICAgICAgIGlmIChmcm9tRWwudmFsdWUgIT09IHRvRWwudmFsdWUpIHtcbiAgICAgICAgICAgIGZyb21FbC52YWx1ZSA9IHRvRWwudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRvRWwuaGFzQXR0cmlidXRlKCd2YWx1ZScpKSB7XG4gICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKCd2YWx1ZScpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIFRFWFRBUkVBOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gdG9FbC52YWx1ZTtcbiAgICAgICAgaWYgKGZyb21FbC52YWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIGZyb21FbC52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpcnN0Q2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICAgICAgaWYgKGZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIC8vIE5lZWRlZCBmb3IgSUUuIEFwcGFyZW50bHkgSUUgc2V0cyB0aGUgcGxhY2Vob2xkZXIgYXMgdGhlXG4gICAgICAgICAgICAvLyBub2RlIHZhbHVlIGFuZCB2aXNlIHZlcnNhLiBUaGlzIGlnbm9yZXMgYW4gZW1wdHkgdXBkYXRlLlxuICAgICAgICAgICAgdmFyIG9sZFZhbHVlID0gZmlyc3RDaGlsZC5ub2RlVmFsdWU7XG5cbiAgICAgICAgICAgIGlmIChvbGRWYWx1ZSA9PSBuZXdWYWx1ZSB8fCAoIW5ld1ZhbHVlICYmIG9sZFZhbHVlID09IGZyb21FbC5wbGFjZWhvbGRlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZpcnN0Q2hpbGQubm9kZVZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFNFTEVDVDogZnVuY3Rpb24oZnJvbUVsLCB0b0VsKSB7XG4gICAgICAgIGlmICghdG9FbC5oYXNBdHRyaWJ1dGUoJ211bHRpcGxlJykpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZEluZGV4ID0gLTE7XG4gICAgICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgICAgICAvLyBXZSBoYXZlIHRvIGxvb3AgdGhyb3VnaCBjaGlsZHJlbiBvZiBmcm9tRWwsIG5vdCB0b0VsIHNpbmNlIG5vZGVzIGNhbiBiZSBtb3ZlZFxuICAgICAgICAgICAgLy8gZnJvbSB0b0VsIHRvIGZyb21FbCBkaXJlY3RseSB3aGVuIG1vcnBoaW5nLlxuICAgICAgICAgICAgLy8gQXQgdGhlIHRpbWUgdGhpcyBzcGVjaWFsIGhhbmRsZXIgaXMgaW52b2tlZCwgYWxsIGNoaWxkcmVuIGhhdmUgYWxyZWFkeSBiZWVuIG1vcnBoZWRcbiAgICAgICAgICAgIC8vIGFuZCBhcHBlbmRlZCB0byAvIHJlbW92ZWQgZnJvbSBmcm9tRWwsIHNvIHVzaW5nIGZyb21FbCBoZXJlIGlzIHNhZmUgYW5kIGNvcnJlY3QuXG4gICAgICAgICAgICB2YXIgY3VyQ2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHZhciBvcHRncm91cDtcbiAgICAgICAgICAgIHZhciBub2RlTmFtZTtcbiAgICAgICAgICAgIHdoaWxlKGN1ckNoaWxkKSB7XG4gICAgICAgICAgICAgICAgbm9kZU5hbWUgPSBjdXJDaGlsZC5ub2RlTmFtZSAmJiBjdXJDaGlsZC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGlmIChub2RlTmFtZSA9PT0gJ09QVEdST1VQJykge1xuICAgICAgICAgICAgICAgICAgICBvcHRncm91cCA9IGN1ckNoaWxkO1xuICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IG9wdGdyb3VwLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBlbXB0eSBvcHRncm91cHNcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjdXJDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBvcHRncm91cC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGdyb3VwID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlTmFtZSA9PT0gJ09QVElPTicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJDaGlsZC5oYXNBdHRyaWJ1dGUoJ3NlbGVjdGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWN1ckNoaWxkICYmIG9wdGdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IG9wdGdyb3VwLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0Z3JvdXAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmcm9tRWwuc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkSW5kZXg7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG52YXIgRUxFTUVOVF9OT0RFID0gMTtcbnZhciBET0NVTUVOVF9GUkFHTUVOVF9OT0RFJDEgPSAxMTtcbnZhciBURVhUX05PREUgPSAzO1xudmFyIENPTU1FTlRfTk9ERSA9IDg7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5mdW5jdGlvbiBkZWZhdWx0R2V0Tm9kZUtleShub2RlKSB7XG4gIGlmIChub2RlKSB7XG4gICAgcmV0dXJuIChub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKSkgfHwgbm9kZS5pZDtcbiAgfVxufVxuXG5mdW5jdGlvbiBtb3JwaGRvbUZhY3RvcnkobW9ycGhBdHRycykge1xuXG4gIHJldHVybiBmdW5jdGlvbiBtb3JwaGRvbShmcm9tTm9kZSwgdG9Ob2RlLCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0b05vZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoZnJvbU5vZGUubm9kZU5hbWUgPT09ICcjZG9jdW1lbnQnIHx8IGZyb21Ob2RlLm5vZGVOYW1lID09PSAnSFRNTCcgfHwgZnJvbU5vZGUubm9kZU5hbWUgPT09ICdCT0RZJykge1xuICAgICAgICB2YXIgdG9Ob2RlSHRtbCA9IHRvTm9kZTtcbiAgICAgICAgdG9Ob2RlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2h0bWwnKTtcbiAgICAgICAgdG9Ob2RlLmlubmVySFRNTCA9IHRvTm9kZUh0bWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b05vZGUgPSB0b0VsZW1lbnQodG9Ob2RlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRvTm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSQxKSB7XG4gICAgICB0b05vZGUgPSB0b05vZGUuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgfVxuXG4gICAgdmFyIGdldE5vZGVLZXkgPSBvcHRpb25zLmdldE5vZGVLZXkgfHwgZGVmYXVsdEdldE5vZGVLZXk7XG4gICAgdmFyIG9uQmVmb3JlTm9kZUFkZGVkID0gb3B0aW9ucy5vbkJlZm9yZU5vZGVBZGRlZCB8fCBub29wO1xuICAgIHZhciBvbk5vZGVBZGRlZCA9IG9wdGlvbnMub25Ob2RlQWRkZWQgfHwgbm9vcDtcbiAgICB2YXIgb25CZWZvcmVFbFVwZGF0ZWQgPSBvcHRpb25zLm9uQmVmb3JlRWxVcGRhdGVkIHx8IG5vb3A7XG4gICAgdmFyIG9uRWxVcGRhdGVkID0gb3B0aW9ucy5vbkVsVXBkYXRlZCB8fCBub29wO1xuICAgIHZhciBvbkJlZm9yZU5vZGVEaXNjYXJkZWQgPSBvcHRpb25zLm9uQmVmb3JlTm9kZURpc2NhcmRlZCB8fCBub29wO1xuICAgIHZhciBvbk5vZGVEaXNjYXJkZWQgPSBvcHRpb25zLm9uTm9kZURpc2NhcmRlZCB8fCBub29wO1xuICAgIHZhciBvbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkID0gb3B0aW9ucy5vbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkIHx8IG5vb3A7XG4gICAgdmFyIHNraXBGcm9tQ2hpbGRyZW4gPSBvcHRpb25zLnNraXBGcm9tQ2hpbGRyZW4gfHwgbm9vcDtcbiAgICB2YXIgYWRkQ2hpbGQgPSBvcHRpb25zLmFkZENoaWxkIHx8IGZ1bmN0aW9uKHBhcmVudCwgY2hpbGQpeyByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTsgfTtcbiAgICB2YXIgY2hpbGRyZW5Pbmx5ID0gb3B0aW9ucy5jaGlsZHJlbk9ubHkgPT09IHRydWU7XG5cbiAgICAvLyBUaGlzIG9iamVjdCBpcyB1c2VkIGFzIGEgbG9va3VwIHRvIHF1aWNrbHkgZmluZCBhbGwga2V5ZWQgZWxlbWVudHMgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLlxuICAgIHZhciBmcm9tTm9kZXNMb29rdXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHZhciBrZXllZFJlbW92YWxMaXN0ID0gW107XG5cbiAgICBmdW5jdGlvbiBhZGRLZXllZFJlbW92YWwoa2V5KSB7XG4gICAgICBrZXllZFJlbW92YWxMaXN0LnB1c2goa2V5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3YWxrRGlzY2FyZGVkQ2hpbGROb2Rlcyhub2RlLCBza2lwS2V5ZWROb2Rlcykge1xuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICB2YXIgY3VyQ2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChjdXJDaGlsZCkge1xuXG4gICAgICAgICAgdmFyIGtleSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmIChza2lwS2V5ZWROb2RlcyAmJiAoa2V5ID0gZ2V0Tm9kZUtleShjdXJDaGlsZCkpKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUgc2tpcHBpbmcga2V5ZWQgbm9kZXMgdGhlbiB3ZSBhZGQgdGhlIGtleVxuICAgICAgICAgICAgLy8gdG8gYSBsaXN0IHNvIHRoYXQgaXQgY2FuIGJlIGhhbmRsZWQgYXQgdGhlIHZlcnkgZW5kLlxuICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE9ubHkgcmVwb3J0IHRoZSBub2RlIGFzIGRpc2NhcmRlZCBpZiBpdCBpcyBub3Qga2V5ZWQuIFdlIGRvIHRoaXMgYmVjYXVzZVxuICAgICAgICAgICAgLy8gYXQgdGhlIGVuZCB3ZSBsb29wIHRocm91Z2ggYWxsIGtleWVkIGVsZW1lbnRzIHRoYXQgd2VyZSB1bm1hdGNoZWRcbiAgICAgICAgICAgIC8vIGFuZCB0aGVuIGRpc2NhcmQgdGhlbSBpbiBvbmUgZmluYWwgcGFzcy5cbiAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChjdXJDaGlsZCk7XG4gICAgICAgICAgICBpZiAoY3VyQ2hpbGQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2RlcyhjdXJDaGlsZCwgc2tpcEtleWVkTm9kZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAqIFJlbW92ZXMgYSBET00gbm9kZSBvdXQgb2YgdGhlIG9yaWdpbmFsIERPTVxuICAgICpcbiAgICAqIEBwYXJhbSAge05vZGV9IG5vZGUgVGhlIG5vZGUgdG8gcmVtb3ZlXG4gICAgKiBAcGFyYW0gIHtOb2RlfSBwYXJlbnROb2RlIFRoZSBub2RlcyBwYXJlbnRcbiAgICAqIEBwYXJhbSAge0Jvb2xlYW59IHNraXBLZXllZE5vZGVzIElmIHRydWUgdGhlbiBlbGVtZW50cyB3aXRoIGtleXMgd2lsbCBiZSBza2lwcGVkIGFuZCBub3QgZGlzY2FyZGVkLlxuICAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgICovXG4gICAgZnVuY3Rpb24gcmVtb3ZlTm9kZShub2RlLCBwYXJlbnROb2RlLCBza2lwS2V5ZWROb2Rlcykge1xuICAgICAgaWYgKG9uQmVmb3JlTm9kZURpc2NhcmRlZChub2RlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgfVxuXG4gICAgICBvbk5vZGVEaXNjYXJkZWQobm9kZSk7XG4gICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2Rlcyhub2RlLCBza2lwS2V5ZWROb2Rlcyk7XG4gICAgfVxuXG4gICAgLy8gLy8gVHJlZVdhbGtlciBpbXBsZW1lbnRhdGlvbiBpcyBubyBmYXN0ZXIsIGJ1dCBrZWVwaW5nIHRoaXMgYXJvdW5kIGluIGNhc2UgdGhpcyBjaGFuZ2VzIGluIHRoZSBmdXR1cmVcbiAgICAvLyBmdW5jdGlvbiBpbmRleFRyZWUocm9vdCkge1xuICAgIC8vICAgICB2YXIgdHJlZVdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIoXG4gICAgLy8gICAgICAgICByb290LFxuICAgIC8vICAgICAgICAgTm9kZUZpbHRlci5TSE9XX0VMRU1FTlQpO1xuICAgIC8vXG4gICAgLy8gICAgIHZhciBlbDtcbiAgICAvLyAgICAgd2hpbGUoKGVsID0gdHJlZVdhbGtlci5uZXh0Tm9kZSgpKSkge1xuICAgIC8vICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoZWwpO1xuICAgIC8vICAgICAgICAgaWYgKGtleSkge1xuICAgIC8vICAgICAgICAgICAgIGZyb21Ob2Rlc0xvb2t1cFtrZXldID0gZWw7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG5cbiAgICAvLyAvLyBOb2RlSXRlcmF0b3IgaW1wbGVtZW50YXRpb24gaXMgbm8gZmFzdGVyLCBidXQga2VlcGluZyB0aGlzIGFyb3VuZCBpbiBjYXNlIHRoaXMgY2hhbmdlcyBpbiB0aGUgZnV0dXJlXG4gICAgLy9cbiAgICAvLyBmdW5jdGlvbiBpbmRleFRyZWUobm9kZSkge1xuICAgIC8vICAgICB2YXIgbm9kZUl0ZXJhdG9yID0gZG9jdW1lbnQuY3JlYXRlTm9kZUl0ZXJhdG9yKG5vZGUsIE5vZGVGaWx0ZXIuU0hPV19FTEVNRU5UKTtcbiAgICAvLyAgICAgdmFyIGVsO1xuICAgIC8vICAgICB3aGlsZSgoZWwgPSBub2RlSXRlcmF0b3IubmV4dE5vZGUoKSkpIHtcbiAgICAvLyAgICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGVsKTtcbiAgICAvLyAgICAgICAgIGlmIChrZXkpIHtcbiAgICAvLyAgICAgICAgICAgICBmcm9tTm9kZXNMb29rdXBba2V5XSA9IGVsO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgZnVuY3Rpb24gaW5kZXhUcmVlKG5vZGUpIHtcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUgfHwgbm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSQxKSB7XG4gICAgICAgIHZhciBjdXJDaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoY3VyQ2hpbGQpO1xuICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGZyb21Ob2Rlc0xvb2t1cFtrZXldID0gY3VyQ2hpbGQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gV2FsayByZWN1cnNpdmVseVxuICAgICAgICAgIGluZGV4VHJlZShjdXJDaGlsZCk7XG5cbiAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5kZXhUcmVlKGZyb21Ob2RlKTtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZU5vZGVBZGRlZChlbCkge1xuICAgICAgb25Ob2RlQWRkZWQoZWwpO1xuXG4gICAgICB2YXIgY3VyQ2hpbGQgPSBlbC5maXJzdENoaWxkO1xuICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgIHZhciBuZXh0U2libGluZyA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGN1ckNoaWxkKTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgIHZhciB1bm1hdGNoZWRGcm9tRWwgPSBmcm9tTm9kZXNMb29rdXBba2V5XTtcbiAgICAgICAgICAvLyBpZiB3ZSBmaW5kIGEgZHVwbGljYXRlICNpZCBub2RlIGluIGNhY2hlLCByZXBsYWNlIGBlbGAgd2l0aCBjYWNoZSB2YWx1ZVxuICAgICAgICAgIC8vIGFuZCBtb3JwaCBpdCB0byB0aGUgY2hpbGQgbm9kZS5cbiAgICAgICAgICBpZiAodW5tYXRjaGVkRnJvbUVsICYmIGNvbXBhcmVOb2RlTmFtZXMoY3VyQ2hpbGQsIHVubWF0Y2hlZEZyb21FbCkpIHtcbiAgICAgICAgICAgIGN1ckNoaWxkLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHVubWF0Y2hlZEZyb21FbCwgY3VyQ2hpbGQpO1xuICAgICAgICAgICAgbW9ycGhFbCh1bm1hdGNoZWRGcm9tRWwsIGN1ckNoaWxkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1ckNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gcmVjdXJzaXZlbHkgY2FsbCBmb3IgY3VyQ2hpbGQgYW5kIGl0J3MgY2hpbGRyZW4gdG8gc2VlIGlmIHdlIGZpbmQgc29tZXRoaW5nIGluXG4gICAgICAgICAgLy8gZnJvbU5vZGVzTG9va3VwXG4gICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1ckNoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1ckNoaWxkID0gbmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW51cEZyb21FbChmcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQsIGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAvLyBXZSBoYXZlIHByb2Nlc3NlZCBhbGwgb2YgdGhlIFwidG8gbm9kZXNcIi4gSWYgY3VyRnJvbU5vZGVDaGlsZCBpc1xuICAgICAgLy8gbm9uLW51bGwgdGhlbiB3ZSBzdGlsbCBoYXZlIHNvbWUgZnJvbSBub2RlcyBsZWZ0IG92ZXIgdGhhdCBuZWVkXG4gICAgICAvLyB0byBiZSByZW1vdmVkXG4gICAgICB3aGlsZSAoY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICB2YXIgZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgaWYgKChjdXJGcm9tTm9kZUtleSA9IGdldE5vZGVLZXkoY3VyRnJvbU5vZGVDaGlsZCkpKSB7XG4gICAgICAgICAgLy8gU2luY2UgdGhlIG5vZGUgaXMga2V5ZWQgaXQgbWlnaHQgYmUgbWF0Y2hlZCB1cCBsYXRlciBzbyB3ZSBkZWZlclxuICAgICAgICAgIC8vIHRoZSBhY3R1YWwgcmVtb3ZhbCB0byBsYXRlclxuICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTk9URTogd2Ugc2tpcCBuZXN0ZWQga2V5ZWQgbm9kZXMgZnJvbSBiZWluZyByZW1vdmVkIHNpbmNlIHRoZXJlIGlzXG4gICAgICAgICAgLy8gICAgICAgc3RpbGwgYSBjaGFuY2UgdGhleSB3aWxsIGJlIG1hdGNoZWQgdXAgbGF0ZXJcbiAgICAgICAgICByZW1vdmVOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21FbCwgdHJ1ZSAvKiBza2lwIGtleWVkIG5vZGVzICovKTtcbiAgICAgICAgfVxuICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vcnBoRWwoZnJvbUVsLCB0b0VsLCBjaGlsZHJlbk9ubHkpIHtcbiAgICAgIHZhciB0b0VsS2V5ID0gZ2V0Tm9kZUtleSh0b0VsKTtcblxuICAgICAgaWYgKHRvRWxLZXkpIHtcbiAgICAgICAgLy8gSWYgYW4gZWxlbWVudCB3aXRoIGFuIElEIGlzIGJlaW5nIG1vcnBoZWQgdGhlbiBpdCB3aWxsIGJlIGluIHRoZSBmaW5hbFxuICAgICAgICAvLyBET00gc28gY2xlYXIgaXQgb3V0IG9mIHRoZSBzYXZlZCBlbGVtZW50cyBjb2xsZWN0aW9uXG4gICAgICAgIGRlbGV0ZSBmcm9tTm9kZXNMb29rdXBbdG9FbEtleV07XG4gICAgICB9XG5cbiAgICAgIGlmICghY2hpbGRyZW5Pbmx5KSB7XG4gICAgICAgIC8vIG9wdGlvbmFsXG4gICAgICAgIHZhciBiZWZvcmVVcGRhdGVSZXN1bHQgPSBvbkJlZm9yZUVsVXBkYXRlZChmcm9tRWwsIHRvRWwpO1xuICAgICAgICBpZiAoYmVmb3JlVXBkYXRlUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChiZWZvcmVVcGRhdGVSZXN1bHQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgIGZyb21FbCA9IGJlZm9yZVVwZGF0ZVJlc3VsdDtcbiAgICAgICAgICAvLyByZWluZGV4IHRoZSBuZXcgZnJvbUVsIGluIGNhc2UgaXQncyBub3QgaW4gdGhlIHNhbWVcbiAgICAgICAgICAvLyB0cmVlIGFzIHRoZSBvcmlnaW5hbCBmcm9tRWxcbiAgICAgICAgICAvLyAoUGhvZW5peCBMaXZlVmlldyBzb21ldGltZXMgcmV0dXJucyBhIGNsb25lZCB0cmVlLFxuICAgICAgICAgIC8vICBidXQga2V5ZWQgbG9va3VwcyB3b3VsZCBzdGlsbCBwb2ludCB0byB0aGUgb3JpZ2luYWwgdHJlZSlcbiAgICAgICAgICBpbmRleFRyZWUoZnJvbUVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSBhdHRyaWJ1dGVzIG9uIG9yaWdpbmFsIERPTSBlbGVtZW50IGZpcnN0XG4gICAgICAgIG1vcnBoQXR0cnMoZnJvbUVsLCB0b0VsKTtcbiAgICAgICAgLy8gb3B0aW9uYWxcbiAgICAgICAgb25FbFVwZGF0ZWQoZnJvbUVsKTtcblxuICAgICAgICBpZiAob25CZWZvcmVFbENoaWxkcmVuVXBkYXRlZChmcm9tRWwsIHRvRWwpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZnJvbUVsLm5vZGVOYW1lICE9PSAnVEVYVEFSRUEnKSB7XG4gICAgICAgIG1vcnBoQ2hpbGRyZW4oZnJvbUVsLCB0b0VsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwZWNpYWxFbEhhbmRsZXJzLlRFWFRBUkVBKGZyb21FbCwgdG9FbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9ycGhDaGlsZHJlbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgIHZhciBza2lwRnJvbSA9IHNraXBGcm9tQ2hpbGRyZW4oZnJvbUVsLCB0b0VsKTtcbiAgICAgIHZhciBjdXJUb05vZGVDaGlsZCA9IHRvRWwuZmlyc3RDaGlsZDtcbiAgICAgIHZhciBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgICB2YXIgY3VyVG9Ob2RlS2V5O1xuICAgICAgdmFyIGN1ckZyb21Ob2RlS2V5O1xuXG4gICAgICB2YXIgZnJvbU5leHRTaWJsaW5nO1xuICAgICAgdmFyIHRvTmV4dFNpYmxpbmc7XG4gICAgICB2YXIgbWF0Y2hpbmdGcm9tRWw7XG5cbiAgICAgIC8vIHdhbGsgdGhlIGNoaWxkcmVuXG4gICAgICBvdXRlcjogd2hpbGUgKGN1clRvTm9kZUNoaWxkKSB7XG4gICAgICAgIHRvTmV4dFNpYmxpbmcgPSBjdXJUb05vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgY3VyVG9Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJUb05vZGVDaGlsZCk7XG5cbiAgICAgICAgLy8gd2FsayB0aGUgZnJvbU5vZGUgY2hpbGRyZW4gYWxsIHRoZSB3YXkgdGhyb3VnaFxuICAgICAgICB3aGlsZSAoIXNraXBGcm9tICYmIGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgaWYgKGN1clRvTm9kZUNoaWxkLmlzU2FtZU5vZGUgJiYgY3VyVG9Ob2RlQ2hpbGQuaXNTYW1lTm9kZShjdXJGcm9tTm9kZUNoaWxkKSkge1xuICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1ckZyb21Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICAgIHZhciBjdXJGcm9tTm9kZVR5cGUgPSBjdXJGcm9tTm9kZUNoaWxkLm5vZGVUeXBlO1xuXG4gICAgICAgICAgLy8gdGhpcyBtZWFucyBpZiB0aGUgY3VyRnJvbU5vZGVDaGlsZCBkb2VzbnQgaGF2ZSBhIG1hdGNoIHdpdGggdGhlIGN1clRvTm9kZUNoaWxkXG4gICAgICAgICAgdmFyIGlzQ29tcGF0aWJsZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmIChjdXJGcm9tTm9kZVR5cGUgPT09IGN1clRvTm9kZUNoaWxkLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgLy8gQm90aCBub2RlcyBiZWluZyBjb21wYXJlZCBhcmUgRWxlbWVudCBub2Rlc1xuXG4gICAgICAgICAgICAgIGlmIChjdXJUb05vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgdGFyZ2V0IG5vZGUgaGFzIGEga2V5IHNvIHdlIHdhbnQgdG8gbWF0Y2ggaXQgdXAgd2l0aCB0aGUgY29ycmVjdCBlbGVtZW50XG4gICAgICAgICAgICAgICAgLy8gaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlXG4gICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUtleSAhPT0gY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgIC8vIFRoZSBjdXJyZW50IGVsZW1lbnQgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlIGRvZXMgbm90IGhhdmUgYSBtYXRjaGluZyBrZXkgc29cbiAgICAgICAgICAgICAgICAgIC8vIGxldCdzIGNoZWNrIG91ciBsb29rdXAgdG8gc2VlIGlmIHRoZXJlIGlzIGEgbWF0Y2hpbmcgZWxlbWVudCBpbiB0aGUgb3JpZ2luYWxcbiAgICAgICAgICAgICAgICAgIC8vIERPTSB0cmVlXG4gICAgICAgICAgICAgICAgICBpZiAoKG1hdGNoaW5nRnJvbUVsID0gZnJvbU5vZGVzTG9va3VwW2N1clRvTm9kZUtleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmcm9tTmV4dFNpYmxpbmcgPT09IG1hdGNoaW5nRnJvbUVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciBzaW5nbGUgZWxlbWVudCByZW1vdmFscy4gVG8gYXZvaWQgcmVtb3ZpbmcgdGhlIG9yaWdpbmFsXG4gICAgICAgICAgICAgICAgICAgICAgLy8gRE9NIG5vZGUgb3V0IG9mIHRoZSB0cmVlIChzaW5jZSB0aGF0IGNhbiBicmVhayBDU1MgdHJhbnNpdGlvbnMsIGV0Yy4pLFxuICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIHdpbGwgaW5zdGVhZCBkaXNjYXJkIHRoZSBjdXJyZW50IG5vZGUgYW5kIHdhaXQgdW50aWwgdGhlIG5leHRcbiAgICAgICAgICAgICAgICAgICAgICAvLyBpdGVyYXRpb24gdG8gcHJvcGVybHkgbWF0Y2ggdXAgdGhlIGtleWVkIHRhcmdldCBlbGVtZW50IHdpdGggaXRzIG1hdGNoaW5nXG4gICAgICAgICAgICAgICAgICAgICAgLy8gZWxlbWVudCBpbiB0aGUgb3JpZ2luYWwgdHJlZVxuICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGZvdW5kIGEgbWF0Y2hpbmcga2V5ZWQgZWxlbWVudCBzb21ld2hlcmUgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLlxuICAgICAgICAgICAgICAgICAgICAgIC8vIExldCdzIG1vdmUgdGhlIG9yaWdpbmFsIERPTSBub2RlIGludG8gdGhlIGN1cnJlbnQgcG9zaXRpb24gYW5kIG1vcnBoXG4gICAgICAgICAgICAgICAgICAgICAgLy8gaXQuXG5cbiAgICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiBXZSB1c2UgaW5zZXJ0QmVmb3JlIGluc3RlYWQgb2YgcmVwbGFjZUNoaWxkIGJlY2F1c2Ugd2Ugd2FudCB0byBnbyB0aHJvdWdoXG4gICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGByZW1vdmVOb2RlKClgIGZ1bmN0aW9uIGZvciB0aGUgbm9kZSB0aGF0IGlzIGJlaW5nIGRpc2NhcmRlZCBzbyB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgLy8gYWxsIGxpZmVjeWNsZSBob29rcyBhcmUgY29ycmVjdGx5IGludm9rZWRcbiAgICAgICAgICAgICAgICAgICAgICBmcm9tRWwuaW5zZXJ0QmVmb3JlKG1hdGNoaW5nRnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgICAgICAgICAgIC8vIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHRoZSBub2RlIGlzIGtleWVkIGl0IG1pZ2h0IGJlIG1hdGNoZWQgdXAgbGF0ZXIgc28gd2UgZGVmZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBhY3R1YWwgcmVtb3ZhbCB0byBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGN1ckZyb21Ob2RlS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTk9URTogd2Ugc2tpcCBuZXN0ZWQga2V5ZWQgbm9kZXMgZnJvbSBiZWluZyByZW1vdmVkIHNpbmNlIHRoZXJlIGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICBzdGlsbCBhIGNoYW5jZSB0aGV5IHdpbGwgYmUgbWF0Y2hlZCB1cCBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tRWwsIHRydWUgLyogc2tpcCBrZXllZCBub2RlcyAqLyk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IG1hdGNoaW5nRnJvbUVsO1xuICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIG5vZGVzIGFyZSBub3QgY29tcGF0aWJsZSBzaW5jZSB0aGUgXCJ0b1wiIG5vZGUgaGFzIGEga2V5IGFuZCB0aGVyZVxuICAgICAgICAgICAgICAgICAgICAvLyBpcyBubyBtYXRjaGluZyBrZXllZCBub2RlIGluIHRoZSBzb3VyY2UgdHJlZVxuICAgICAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgb3JpZ2luYWwgaGFzIGEga2V5XG4gICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBpc0NvbXBhdGlibGUgIT09IGZhbHNlICYmIGNvbXBhcmVOb2RlTmFtZXMoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICBpZiAoaXNDb21wYXRpYmxlKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgZm91bmQgY29tcGF0aWJsZSBET00gZWxlbWVudHMgc28gdHJhbnNmb3JtXG4gICAgICAgICAgICAgICAgLy8gdGhlIGN1cnJlbnQgXCJmcm9tXCIgbm9kZSB0byBtYXRjaCB0aGUgY3VycmVudFxuICAgICAgICAgICAgICAgIC8vIHRhcmdldCBET00gbm9kZS5cbiAgICAgICAgICAgICAgICAvLyBNT1JQSFxuICAgICAgICAgICAgICAgIG1vcnBoRWwoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBURVhUX05PREUgfHwgY3VyRnJvbU5vZGVUeXBlID09IENPTU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAvLyBCb3RoIG5vZGVzIGJlaW5nIGNvbXBhcmVkIGFyZSBUZXh0IG9yIENvbW1lbnQgbm9kZXNcbiAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgLy8gU2ltcGx5IHVwZGF0ZSBub2RlVmFsdWUgb24gdGhlIG9yaWdpbmFsIG5vZGUgdG9cbiAgICAgICAgICAgICAgLy8gY2hhbmdlIHRoZSB0ZXh0IHZhbHVlXG4gICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZUNoaWxkLm5vZGVWYWx1ZSAhPT0gY3VyVG9Ob2RlQ2hpbGQubm9kZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZC5ub2RlVmFsdWUgPSBjdXJUb05vZGVDaGlsZC5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc0NvbXBhdGlibGUpIHtcbiAgICAgICAgICAgIC8vIEFkdmFuY2UgYm90aCB0aGUgXCJ0b1wiIGNoaWxkIGFuZCB0aGUgXCJmcm9tXCIgY2hpbGQgc2luY2Ugd2UgZm91bmQgYSBtYXRjaFxuICAgICAgICAgICAgLy8gTm90aGluZyBlbHNlIHRvIGRvIGFzIHdlIGFscmVhZHkgcmVjdXJzaXZlbHkgY2FsbGVkIG1vcnBoQ2hpbGRyZW4gYWJvdmVcbiAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBObyBjb21wYXRpYmxlIG1hdGNoIHNvIHJlbW92ZSB0aGUgb2xkIG5vZGUgZnJvbSB0aGUgRE9NIGFuZCBjb250aW51ZSB0cnlpbmcgdG8gZmluZCBhXG4gICAgICAgICAgLy8gbWF0Y2ggaW4gdGhlIG9yaWdpbmFsIERPTS4gSG93ZXZlciwgd2Ugb25seSBkbyB0aGlzIGlmIHRoZSBmcm9tIG5vZGUgaXMgbm90IGtleWVkXG4gICAgICAgICAgLy8gc2luY2UgaXQgaXMgcG9zc2libGUgdGhhdCBhIGtleWVkIG5vZGUgbWlnaHQgbWF0Y2ggdXAgd2l0aCBhIG5vZGUgc29tZXdoZXJlIGVsc2UgaW4gdGhlXG4gICAgICAgICAgLy8gdGFyZ2V0IHRyZWUgYW5kIHdlIGRvbid0IHdhbnQgdG8gZGlzY2FyZCBpdCBqdXN0IHlldCBzaW5jZSBpdCBzdGlsbCBtaWdodCBmaW5kIGFcbiAgICAgICAgICAvLyBob21lIGluIHRoZSBmaW5hbCBET00gdHJlZS4gQWZ0ZXIgZXZlcnl0aGluZyBpcyBkb25lIHdlIHdpbGwgcmVtb3ZlIGFueSBrZXllZCBub2Rlc1xuICAgICAgICAgIC8vIHRoYXQgZGlkbid0IGZpbmQgYSBob21lXG4gICAgICAgICAgaWYgKGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAvLyBTaW5jZSB0aGUgbm9kZSBpcyBrZXllZCBpdCBtaWdodCBiZSBtYXRjaGVkIHVwIGxhdGVyIHNvIHdlIGRlZmVyXG4gICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHJlbW92YWwgdG8gbGF0ZXJcbiAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IHdlIHNraXAgbmVzdGVkIGtleWVkIG5vZGVzIGZyb20gYmVpbmcgcmVtb3ZlZCBzaW5jZSB0aGVyZSBpc1xuICAgICAgICAgICAgLy8gICAgICAgc3RpbGwgYSBjaGFuY2UgdGhleSB3aWxsIGJlIG1hdGNoZWQgdXAgbGF0ZXJcbiAgICAgICAgICAgIHJlbW92ZU5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbUVsLCB0cnVlIC8qIHNraXAga2V5ZWQgbm9kZXMgKi8pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgIH0gLy8gRU5EOiB3aGlsZShjdXJGcm9tTm9kZUNoaWxkKSB7fVxuXG4gICAgICAgIC8vIElmIHdlIGdvdCB0aGlzIGZhciB0aGVuIHdlIGRpZCBub3QgZmluZCBhIGNhbmRpZGF0ZSBtYXRjaCBmb3JcbiAgICAgICAgLy8gb3VyIFwidG8gbm9kZVwiIGFuZCB3ZSBleGhhdXN0ZWQgYWxsIG9mIHRoZSBjaGlsZHJlbiBcImZyb21cIlxuICAgICAgICAvLyBub2Rlcy4gVGhlcmVmb3JlLCB3ZSB3aWxsIGp1c3QgYXBwZW5kIHRoZSBjdXJyZW50IFwidG9cIiBub2RlXG4gICAgICAgIC8vIHRvIHRoZSBlbmRcbiAgICAgICAgaWYgKGN1clRvTm9kZUtleSAmJiAobWF0Y2hpbmdGcm9tRWwgPSBmcm9tTm9kZXNMb29rdXBbY3VyVG9Ob2RlS2V5XSkgJiYgY29tcGFyZU5vZGVOYW1lcyhtYXRjaGluZ0Zyb21FbCwgY3VyVG9Ob2RlQ2hpbGQpKSB7XG4gICAgICAgICAgLy8gTU9SUEhcbiAgICAgICAgICBpZighc2tpcEZyb20peyBhZGRDaGlsZChmcm9tRWwsIG1hdGNoaW5nRnJvbUVsKTsgfVxuICAgICAgICAgIG1vcnBoRWwobWF0Y2hpbmdGcm9tRWwsIGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgb25CZWZvcmVOb2RlQWRkZWRSZXN1bHQgPSBvbkJlZm9yZU5vZGVBZGRlZChjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgaWYgKG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0KSB7XG4gICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gb25CZWZvcmVOb2RlQWRkZWRSZXN1bHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjdXJUb05vZGVDaGlsZC5hY3R1YWxpemUpIHtcbiAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSBjdXJUb05vZGVDaGlsZC5hY3R1YWxpemUoZnJvbUVsLm93bmVyRG9jdW1lbnQgfHwgZG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZENoaWxkKGZyb21FbCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICB9XG5cbiAgICAgIGNsZWFudXBGcm9tRWwoZnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkLCBjdXJGcm9tTm9kZUtleSk7XG5cbiAgICAgIHZhciBzcGVjaWFsRWxIYW5kbGVyID0gc3BlY2lhbEVsSGFuZGxlcnNbZnJvbUVsLm5vZGVOYW1lXTtcbiAgICAgIGlmIChzcGVjaWFsRWxIYW5kbGVyKSB7XG4gICAgICAgIHNwZWNpYWxFbEhhbmRsZXIoZnJvbUVsLCB0b0VsKTtcbiAgICAgIH1cbiAgICB9IC8vIEVORDogbW9ycGhDaGlsZHJlbiguLi4pXG5cbiAgICB2YXIgbW9ycGhlZE5vZGUgPSBmcm9tTm9kZTtcbiAgICB2YXIgbW9ycGhlZE5vZGVUeXBlID0gbW9ycGhlZE5vZGUubm9kZVR5cGU7XG4gICAgdmFyIHRvTm9kZVR5cGUgPSB0b05vZGUubm9kZVR5cGU7XG5cbiAgICBpZiAoIWNoaWxkcmVuT25seSkge1xuICAgICAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIHdlIGFyZSBnaXZlbiB0d28gRE9NIG5vZGVzIHRoYXQgYXJlIG5vdFxuICAgICAgLy8gY29tcGF0aWJsZSAoZS5nLiA8ZGl2PiAtLT4gPHNwYW4+IG9yIDxkaXY+IC0tPiBURVhUKVxuICAgICAgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgIGlmICh0b05vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICBpZiAoIWNvbXBhcmVOb2RlTmFtZXMoZnJvbU5vZGUsIHRvTm9kZSkpIHtcbiAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChmcm9tTm9kZSk7XG4gICAgICAgICAgICBtb3JwaGVkTm9kZSA9IG1vdmVDaGlsZHJlbihmcm9tTm9kZSwgY3JlYXRlRWxlbWVudE5TKHRvTm9kZS5ub2RlTmFtZSwgdG9Ob2RlLm5hbWVzcGFjZVVSSSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBHb2luZyBmcm9tIGFuIGVsZW1lbnQgbm9kZSB0byBhIHRleHQgbm9kZVxuICAgICAgICAgIG1vcnBoZWROb2RlID0gdG9Ob2RlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gVEVYVF9OT0RFIHx8IG1vcnBoZWROb2RlVHlwZSA9PT0gQ09NTUVOVF9OT0RFKSB7IC8vIFRleHQgb3IgY29tbWVudCBub2RlXG4gICAgICAgIGlmICh0b05vZGVUeXBlID09PSBtb3JwaGVkTm9kZVR5cGUpIHtcbiAgICAgICAgICBpZiAobW9ycGhlZE5vZGUubm9kZVZhbHVlICE9PSB0b05vZGUubm9kZVZhbHVlKSB7XG4gICAgICAgICAgICBtb3JwaGVkTm9kZS5ub2RlVmFsdWUgPSB0b05vZGUubm9kZVZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBtb3JwaGVkTm9kZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUZXh0IG5vZGUgdG8gc29tZXRoaW5nIGVsc2VcbiAgICAgICAgICBtb3JwaGVkTm9kZSA9IHRvTm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtb3JwaGVkTm9kZSA9PT0gdG9Ob2RlKSB7XG4gICAgICAvLyBUaGUgXCJ0byBub2RlXCIgd2FzIG5vdCBjb21wYXRpYmxlIHdpdGggdGhlIFwiZnJvbSBub2RlXCIgc28gd2UgaGFkIHRvXG4gICAgICAvLyB0b3NzIG91dCB0aGUgXCJmcm9tIG5vZGVcIiBhbmQgdXNlIHRoZSBcInRvIG5vZGVcIlxuICAgICAgb25Ob2RlRGlzY2FyZGVkKGZyb21Ob2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRvTm9kZS5pc1NhbWVOb2RlICYmIHRvTm9kZS5pc1NhbWVOb2RlKG1vcnBoZWROb2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG1vcnBoRWwobW9ycGhlZE5vZGUsIHRvTm9kZSwgY2hpbGRyZW5Pbmx5KTtcblxuICAgICAgLy8gV2Ugbm93IG5lZWQgdG8gbG9vcCBvdmVyIGFueSBrZXllZCBub2RlcyB0aGF0IG1pZ2h0IG5lZWQgdG8gYmVcbiAgICAgIC8vIHJlbW92ZWQuIFdlIG9ubHkgZG8gdGhlIHJlbW92YWwgaWYgd2Uga25vdyB0aGF0IHRoZSBrZXllZCBub2RlXG4gICAgICAvLyBuZXZlciBmb3VuZCBhIG1hdGNoLiBXaGVuIGEga2V5ZWQgbm9kZSBpcyBtYXRjaGVkIHVwIHdlIHJlbW92ZVxuICAgICAgLy8gaXQgb3V0IG9mIGZyb21Ob2Rlc0xvb2t1cCBhbmQgd2UgdXNlIGZyb21Ob2Rlc0xvb2t1cCB0byBkZXRlcm1pbmVcbiAgICAgIC8vIGlmIGEga2V5ZWQgbm9kZSBoYXMgYmVlbiBtYXRjaGVkIHVwIG9yIG5vdFxuICAgICAgaWYgKGtleWVkUmVtb3ZhbExpc3QpIHtcbiAgICAgICAgZm9yICh2YXIgaT0wLCBsZW49a2V5ZWRSZW1vdmFsTGlzdC5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICAgICAgICB2YXIgZWxUb1JlbW92ZSA9IGZyb21Ob2Rlc0xvb2t1cFtrZXllZFJlbW92YWxMaXN0W2ldXTtcbiAgICAgICAgICBpZiAoZWxUb1JlbW92ZSkge1xuICAgICAgICAgICAgcmVtb3ZlTm9kZShlbFRvUmVtb3ZlLCBlbFRvUmVtb3ZlLnBhcmVudE5vZGUsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWNoaWxkcmVuT25seSAmJiBtb3JwaGVkTm9kZSAhPT0gZnJvbU5vZGUgJiYgZnJvbU5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgaWYgKG1vcnBoZWROb2RlLmFjdHVhbGl6ZSkge1xuICAgICAgICBtb3JwaGVkTm9kZSA9IG1vcnBoZWROb2RlLmFjdHVhbGl6ZShmcm9tTm9kZS5vd25lckRvY3VtZW50IHx8IGRvYyk7XG4gICAgICB9XG4gICAgICAvLyBJZiB3ZSBoYWQgdG8gc3dhcCBvdXQgdGhlIGZyb20gbm9kZSB3aXRoIGEgbmV3IG5vZGUgYmVjYXVzZSB0aGUgb2xkXG4gICAgICAvLyBub2RlIHdhcyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSB0YXJnZXQgbm9kZSB0aGVuIHdlIG5lZWQgdG9cbiAgICAgIC8vIHJlcGxhY2UgdGhlIG9sZCBET00gbm9kZSBpbiB0aGUgb3JpZ2luYWwgRE9NIHRyZWUuIFRoaXMgaXMgb25seVxuICAgICAgLy8gcG9zc2libGUgaWYgdGhlIG9yaWdpbmFsIERPTSBub2RlIHdhcyBwYXJ0IG9mIGEgRE9NIHRyZWUgd2hpY2hcbiAgICAgIC8vIHdlIGtub3cgaXMgdGhlIGNhc2UgaWYgaXQgaGFzIGEgcGFyZW50IG5vZGUuXG4gICAgICBmcm9tTm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChtb3JwaGVkTm9kZSwgZnJvbU5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiBtb3JwaGVkTm9kZTtcbiAgfTtcbn1cblxudmFyIG1vcnBoZG9tID0gbW9ycGhkb21GYWN0b3J5KG1vcnBoQXR0cnMpO1xuXG5leHBvcnQgZGVmYXVsdCBtb3JwaGRvbTtcbiIsICJpbXBvcnQge1xuICBQSFhfQ09NUE9ORU5ULFxuICBQSFhfUFJVTkUsXG4gIFBIWF9ST09UX0lELFxuICBQSFhfU0VTU0lPTixcbiAgUEhYX1NLSVAsXG4gIFBIWF9NQUdJQ19JRCxcbiAgUEhYX1NUQVRJQyxcbiAgUEhYX1RSSUdHRVJfQUNUSU9OLFxuICBQSFhfVVBEQVRFLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX1JFRl9MT0NLLFxuICBQSFhfU1RSRUFNLFxuICBQSFhfU1RSRUFNX1JFRixcbiAgUEhYX1ZJRVdQT1JUX1RPUCxcbiAgUEhYX1ZJRVdQT1JUX0JPVFRPTSxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgZGV0ZWN0RHVwbGljYXRlSWRzLFxuICBkZXRlY3RJbnZhbGlkU3RyZWFtSW5zZXJ0cyxcbiAgaXNDaWRcbn0gZnJvbSBcIi4vdXRpbHNcIlxuaW1wb3J0IEVsZW1lbnRSZWYgZnJvbSBcIi4vZWxlbWVudF9yZWZcIlxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IERPTVBvc3RNb3JwaFJlc3RvcmVyIGZyb20gXCIuL2RvbV9wb3N0X21vcnBoX3Jlc3RvcmVyXCJcbmltcG9ydCBtb3JwaGRvbSBmcm9tIFwibW9ycGhkb21cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBET01QYXRjaCB7XG4gIGNvbnN0cnVjdG9yKHZpZXcsIGNvbnRhaW5lciwgaWQsIGh0bWwsIHN0cmVhbXMsIHRhcmdldENJRCwgb3B0cz17fSl7XG4gICAgdGhpcy52aWV3ID0gdmlld1xuICAgIHRoaXMubGl2ZVNvY2tldCA9IHZpZXcubGl2ZVNvY2tldFxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyXG4gICAgdGhpcy5pZCA9IGlkXG4gICAgdGhpcy5yb290SUQgPSB2aWV3LnJvb3QuaWRcbiAgICB0aGlzLmh0bWwgPSBodG1sXG4gICAgdGhpcy5zdHJlYW1zID0gc3RyZWFtc1xuICAgIHRoaXMuc3RyZWFtSW5zZXJ0cyA9IHt9XG4gICAgdGhpcy5zdHJlYW1Db21wb25lbnRSZXN0b3JlID0ge31cbiAgICB0aGlzLnRhcmdldENJRCA9IHRhcmdldENJRFxuICAgIHRoaXMuY2lkUGF0Y2ggPSBpc0NpZCh0aGlzLnRhcmdldENJRClcbiAgICB0aGlzLnBlbmRpbmdSZW1vdmVzID0gW11cbiAgICB0aGlzLnBoeFJlbW92ZSA9IHRoaXMubGl2ZVNvY2tldC5iaW5kaW5nKFwicmVtb3ZlXCIpXG4gICAgdGhpcy50YXJnZXRDb250YWluZXIgPSB0aGlzLmlzQ0lEUGF0Y2goKSA/IHRoaXMudGFyZ2V0Q0lEQ29udGFpbmVyKGh0bWwpIDogY29udGFpbmVyXG4gICAgdGhpcy5jYWxsYmFja3MgPSB7XG4gICAgICBiZWZvcmVhZGRlZDogW10sIGJlZm9yZXVwZGF0ZWQ6IFtdLCBiZWZvcmVwaHhDaGlsZEFkZGVkOiBbXSxcbiAgICAgIGFmdGVyYWRkZWQ6IFtdLCBhZnRlcnVwZGF0ZWQ6IFtdLCBhZnRlcmRpc2NhcmRlZDogW10sIGFmdGVycGh4Q2hpbGRBZGRlZDogW10sXG4gICAgICBhZnRlcnRyYW5zaXRpb25zRGlzY2FyZGVkOiBbXVxuICAgIH1cbiAgICB0aGlzLndpdGhDaGlsZHJlbiA9IG9wdHMud2l0aENoaWxkcmVuIHx8IG9wdHMudW5kb1JlZiB8fCBmYWxzZVxuICAgIHRoaXMudW5kb1JlZiA9IG9wdHMudW5kb1JlZlxuICB9XG5cbiAgYmVmb3JlKGtpbmQsIGNhbGxiYWNrKXsgdGhpcy5jYWxsYmFja3NbYGJlZm9yZSR7a2luZH1gXS5wdXNoKGNhbGxiYWNrKSB9XG4gIGFmdGVyKGtpbmQsIGNhbGxiYWNrKXsgdGhpcy5jYWxsYmFja3NbYGFmdGVyJHtraW5kfWBdLnB1c2goY2FsbGJhY2spIH1cblxuICB0cmFja0JlZm9yZShraW5kLCAuLi5hcmdzKXtcbiAgICB0aGlzLmNhbGxiYWNrc1tgYmVmb3JlJHtraW5kfWBdLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2soLi4uYXJncykpXG4gIH1cblxuICB0cmFja0FmdGVyKGtpbmQsIC4uLmFyZ3Mpe1xuICAgIHRoaXMuY2FsbGJhY2tzW2BhZnRlciR7a2luZH1gXS5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKC4uLmFyZ3MpKVxuICB9XG5cbiAgbWFya1BydW5hYmxlQ29udGVudEZvclJlbW92YWwoKXtcbiAgICBsZXQgcGh4VXBkYXRlID0gdGhpcy5saXZlU29ja2V0LmJpbmRpbmcoUEhYX1VQREFURSlcbiAgICBET00uYWxsKHRoaXMuY29udGFpbmVyLCBgWyR7cGh4VXBkYXRlfT1hcHBlbmRdID4gKiwgWyR7cGh4VXBkYXRlfT1wcmVwZW5kXSA+ICpgLCBlbCA9PiB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX1BSVU5FLCBcIlwiKVxuICAgIH0pXG4gIH1cblxuICBwZXJmb3JtKGlzSm9pblBhdGNoKXtcbiAgICBsZXQge3ZpZXcsIGxpdmVTb2NrZXQsIGh0bWwsIGNvbnRhaW5lcn0gPSB0aGlzXG4gICAgbGV0IHRhcmdldENvbnRhaW5lciA9IHRoaXMudGFyZ2V0Q29udGFpbmVyXG4gICAgaWYodGhpcy5pc0NJRFBhdGNoKCkgJiYgIXRhcmdldENvbnRhaW5lcil7IHJldHVybiB9XG5cbiAgICBpZih0aGlzLmlzQ0lEUGF0Y2goKSl7XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9wdWxsLzM5NDJcbiAgICAgIC8vIHdlIG5lZWQgdG8gZW5zdXJlIHRoYXQgbm8gcGFyZW50IGlzIGxvY2tlZFxuICAgICAgY29uc3QgY2xvc2VzdExvY2sgPSB0YXJnZXRDb250YWluZXIuY2xvc2VzdChgWyR7UEhYX1JFRl9MT0NLfV1gKVxuICAgICAgaWYoY2xvc2VzdExvY2spe1xuICAgICAgICBjb25zdCBjbG9uZWRUcmVlID0gRE9NLnByaXZhdGUoY2xvc2VzdExvY2ssIFBIWF9SRUZfTE9DSylcbiAgICAgICAgaWYoY2xvbmVkVHJlZSl7XG4gICAgICAgICAgLy8gaWYgYSBwYXJlbnQgaXMgbG9ja2VkIHdpdGggYSBjbG9uZWQgdHJlZSwgd2UgbmVlZCB0byBwYXRjaCB0aGUgY2xvbmVkIHRyZWUgaW5zdGVhZFxuICAgICAgICAgIHRhcmdldENvbnRhaW5lciA9IGNsb25lZFRyZWUucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIGBbZGF0YS1waHgtY29tcG9uZW50PVwiJHt0aGlzLnRhcmdldENJRH1cIl1gLFxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBmb2N1c2VkID0gbGl2ZVNvY2tldC5nZXRBY3RpdmVFbGVtZW50KClcbiAgICBsZXQge3NlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmR9ID0gZm9jdXNlZCAmJiBET00uaGFzU2VsZWN0aW9uUmFuZ2UoZm9jdXNlZCkgPyBmb2N1c2VkIDoge31cbiAgICBsZXQgcGh4VXBkYXRlID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9VUERBVEUpXG4gICAgbGV0IHBoeFZpZXdwb3J0VG9wID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9WSUVXUE9SVF9UT1ApXG4gICAgbGV0IHBoeFZpZXdwb3J0Qm90dG9tID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9WSUVXUE9SVF9CT1RUT00pXG4gICAgbGV0IHBoeFRyaWdnZXJFeHRlcm5hbCA9IGxpdmVTb2NrZXQuYmluZGluZyhQSFhfVFJJR0dFUl9BQ1RJT04pXG4gICAgbGV0IGFkZGVkID0gW11cbiAgICBsZXQgdXBkYXRlcyA9IFtdXG4gICAgbGV0IGFwcGVuZFByZXBlbmRVcGRhdGVzID0gW11cblxuICAgIGxldCBleHRlcm5hbEZvcm1UcmlnZ2VyZWQgPSBudWxsXG5cbiAgICBmdW5jdGlvbiBtb3JwaCh0YXJnZXRDb250YWluZXIsIHNvdXJjZSwgd2l0aENoaWxkcmVuPXRoaXMud2l0aENoaWxkcmVuKXtcbiAgICAgIGxldCBtb3JwaENhbGxiYWNrcyA9IHtcbiAgICAgICAgLy8gbm9ybWFsbHksIHdlIGFyZSBydW5uaW5nIHdpdGggY2hpbGRyZW5Pbmx5LCBhcyB0aGUgcGF0Y2ggSFRNTCBmb3IgYSBMVlxuICAgICAgICAvLyBkb2VzIG5vdCBpbmNsdWRlIHRoZSBMViBhdHRycyAoZGF0YS1waHgtc2Vzc2lvbiwgZXRjLilcbiAgICAgICAgLy8gd2hlbiB3ZSBhcmUgcGF0Y2hpbmcgYSBsaXZlIGNvbXBvbmVudCwgd2UgZG8gd2FudCB0byBwYXRjaCB0aGUgcm9vdCBlbGVtZW50IGFzIHdlbGw7XG4gICAgICAgIC8vIGFub3RoZXIgY2FzZSBpcyB0aGUgcmVjdXJzaXZlIHBhdGNoIG9mIGEgc3RyZWFtIGl0ZW0gdGhhdCB3YXMga2VwdCBvbiByZXNldCAoLT4gb25CZWZvcmVOb2RlQWRkZWQpXG4gICAgICAgIGNoaWxkcmVuT25seTogdGFyZ2V0Q29udGFpbmVyLmdldEF0dHJpYnV0ZShQSFhfQ09NUE9ORU5UKSA9PT0gbnVsbCAmJiAhd2l0aENoaWxkcmVuLFxuICAgICAgICBnZXROb2RlS2V5OiAobm9kZSkgPT4ge1xuICAgICAgICAgIGlmKERPTS5pc1BoeERlc3Ryb3llZChub2RlKSl7IHJldHVybiBudWxsIH1cbiAgICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgam9pbiBwYXRjaCwgdGhlbiBieSBkZWZpbml0aW9uIHRoZXJlIHdhcyBubyBQSFhfTUFHSUNfSUQuXG4gICAgICAgICAgLy8gVGhpcyBpcyBpbXBvcnRhbnQgdG8gcmVkdWNlIHRoZSBhbW91bnQgb2YgZWxlbWVudHMgbW9ycGhkb20gZGlzY2FyZHMuXG4gICAgICAgICAgaWYoaXNKb2luUGF0Y2gpeyByZXR1cm4gbm9kZS5pZCB9XG4gICAgICAgICAgcmV0dXJuIG5vZGUuaWQgfHwgKG5vZGUuZ2V0QXR0cmlidXRlICYmIG5vZGUuZ2V0QXR0cmlidXRlKFBIWF9NQUdJQ19JRCkpXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHNraXAgaW5kZXhpbmcgZnJvbSBjaGlsZHJlbiB3aGVuIGNvbnRhaW5lciBpcyBzdHJlYW1cbiAgICAgICAgc2tpcEZyb21DaGlsZHJlbjogKGZyb20pID0+IHsgcmV0dXJuIGZyb20uZ2V0QXR0cmlidXRlKHBoeFVwZGF0ZSkgPT09IFBIWF9TVFJFQU0gfSxcbiAgICAgICAgLy8gdGVsbCBtb3JwaGRvbSBob3cgdG8gYWRkIGEgY2hpbGRcbiAgICAgICAgYWRkQ2hpbGQ6IChwYXJlbnQsIGNoaWxkKSA9PiB7XG4gICAgICAgICAgbGV0IHtyZWYsIHN0cmVhbUF0fSA9IHRoaXMuZ2V0U3RyZWFtSW5zZXJ0KGNoaWxkKVxuICAgICAgICAgIGlmKHJlZiA9PT0gdW5kZWZpbmVkKXsgcmV0dXJuIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCkgfVxuXG4gICAgICAgICAgdGhpcy5zZXRTdHJlYW1SZWYoY2hpbGQsIHJlZilcblxuICAgICAgICAgIC8vIHN0cmVhbWluZ1xuICAgICAgICAgIGlmKHN0cmVhbUF0ID09PSAwKXtcbiAgICAgICAgICAgIHBhcmVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIGNoaWxkKVxuICAgICAgICAgIH0gZWxzZSBpZihzdHJlYW1BdCA9PT0gLTEpe1xuICAgICAgICAgICAgbGV0IGxhc3RDaGlsZCA9IHBhcmVudC5sYXN0RWxlbWVudENoaWxkXG4gICAgICAgICAgICBpZihsYXN0Q2hpbGQgJiYgIWxhc3RDaGlsZC5oYXNBdHRyaWJ1dGUoUEhYX1NUUkVBTV9SRUYpKXtcbiAgICAgICAgICAgICAgbGV0IG5vblN0cmVhbUNoaWxkID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbmQoYyA9PiAhYy5oYXNBdHRyaWJ1dGUoUEhYX1NUUkVBTV9SRUYpKVxuICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCBub25TdHJlYW1DaGlsZClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYoc3RyZWFtQXQgPiAwKXtcbiAgICAgICAgICAgIGxldCBzaWJsaW5nID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pW3N0cmVhbUF0XVxuICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgc2libGluZylcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9uQmVmb3JlTm9kZUFkZGVkOiAoZWwpID0+IHtcbiAgICAgICAgICBET00ubWFpbnRhaW5Qcml2YXRlSG9va3MoZWwsIGVsLCBwaHhWaWV3cG9ydFRvcCwgcGh4Vmlld3BvcnRCb3R0b20pXG4gICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcImFkZGVkXCIsIGVsKVxuXG4gICAgICAgICAgbGV0IG1vcnBoZWRFbCA9IGVsXG4gICAgICAgICAgLy8gdGhpcyBpcyBhIHN0cmVhbSBpdGVtIHRoYXQgd2FzIGtlcHQgb24gcmVzZXQsIHJlY3Vyc2l2ZWx5IG1vcnBoIGl0XG4gICAgICAgICAgaWYodGhpcy5zdHJlYW1Db21wb25lbnRSZXN0b3JlW2VsLmlkXSl7XG4gICAgICAgICAgICBtb3JwaGVkRWwgPSB0aGlzLnN0cmVhbUNvbXBvbmVudFJlc3RvcmVbZWwuaWRdXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zdHJlYW1Db21wb25lbnRSZXN0b3JlW2VsLmlkXVxuICAgICAgICAgICAgbW9ycGguY2FsbCh0aGlzLCBtb3JwaGVkRWwsIGVsLCB0cnVlKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBtb3JwaGVkRWxcbiAgICAgICAgfSxcbiAgICAgICAgb25Ob2RlQWRkZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIGlmKGVsLmdldEF0dHJpYnV0ZSl7IHRoaXMubWF5YmVSZU9yZGVyU3RyZWFtKGVsLCB0cnVlKSB9XG5cbiAgICAgICAgICAvLyBoYWNrIHRvIGZpeCBTYWZhcmkgaGFuZGxpbmcgb2YgaW1nIHNyY3NldCBhbmQgdmlkZW8gdGFnc1xuICAgICAgICAgIGlmKGVsIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCAmJiBlbC5zcmNzZXQpe1xuICAgICAgICAgICAgZWwuc3Jjc2V0ID0gZWwuc3Jjc2V0XG4gICAgICAgICAgfSBlbHNlIGlmKGVsIGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudCAmJiBlbC5hdXRvcGxheSl7XG4gICAgICAgICAgICBlbC5wbGF5KClcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoRE9NLmlzTm93VHJpZ2dlckZvcm1FeHRlcm5hbChlbCwgcGh4VHJpZ2dlckV4dGVybmFsKSl7XG4gICAgICAgICAgICBleHRlcm5hbEZvcm1UcmlnZ2VyZWQgPSBlbFxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIG5lc3RlZCB2aWV3IGhhbmRsaW5nXG4gICAgICAgICAgaWYoKERPTS5pc1BoeENoaWxkKGVsKSAmJiB2aWV3Lm93bnNFbGVtZW50KGVsKSkgfHwgRE9NLmlzUGh4U3RpY2t5KGVsKSAmJiB2aWV3Lm93bnNFbGVtZW50KGVsLnBhcmVudE5vZGUpKXtcbiAgICAgICAgICAgIHRoaXMudHJhY2tBZnRlcihcInBoeENoaWxkQWRkZWRcIiwgZWwpXG4gICAgICAgICAgfVxuICAgICAgICAgIGFkZGVkLnB1c2goZWwpXG4gICAgICAgIH0sXG4gICAgICAgIG9uTm9kZURpc2NhcmRlZDogKGVsKSA9PiB0aGlzLm9uTm9kZURpc2NhcmRlZChlbCksXG4gICAgICAgIG9uQmVmb3JlTm9kZURpc2NhcmRlZDogKGVsKSA9PiB7XG4gICAgICAgICAgaWYoZWwuZ2V0QXR0cmlidXRlICYmIGVsLmdldEF0dHJpYnV0ZShQSFhfUFJVTkUpICE9PSBudWxsKXsgcmV0dXJuIHRydWUgfVxuICAgICAgICAgIGlmKGVsLnBhcmVudEVsZW1lbnQgIT09IG51bGwgJiYgZWwuaWQgJiZcbiAgICAgICAgICAgIERPTS5pc1BoeFVwZGF0ZShlbC5wYXJlbnRFbGVtZW50LCBwaHhVcGRhdGUsIFtQSFhfU1RSRUFNLCBcImFwcGVuZFwiLCBcInByZXBlbmRcIl0pKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZih0aGlzLm1heWJlUGVuZGluZ1JlbW92ZShlbCkpeyByZXR1cm4gZmFsc2UgfVxuICAgICAgICAgIGlmKHRoaXMuc2tpcENJRFNpYmxpbmcoZWwpKXsgcmV0dXJuIGZhbHNlIH1cblxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIG9uRWxVcGRhdGVkOiAoZWwpID0+IHtcbiAgICAgICAgICBpZihET00uaXNOb3dUcmlnZ2VyRm9ybUV4dGVybmFsKGVsLCBwaHhUcmlnZ2VyRXh0ZXJuYWwpKXtcbiAgICAgICAgICAgIGV4dGVybmFsRm9ybVRyaWdnZXJlZCA9IGVsXG4gICAgICAgICAgfVxuICAgICAgICAgIHVwZGF0ZXMucHVzaChlbClcbiAgICAgICAgICB0aGlzLm1heWJlUmVPcmRlclN0cmVhbShlbCwgZmFsc2UpXG4gICAgICAgIH0sXG4gICAgICAgIG9uQmVmb3JlRWxVcGRhdGVkOiAoZnJvbUVsLCB0b0VsKSA9PiB7XG4gICAgICAgICAgLy8gaWYgd2UgYXJlIHBhdGNoaW5nIHRoZSByb290IHRhcmdldCBjb250YWluZXIgYW5kIHRoZSBpZCBoYXMgY2hhbmdlZCwgdHJlYXQgaXQgYXMgYSBuZXcgbm9kZVxuICAgICAgICAgIC8vIGJ5IHJlcGxhY2luZyB0aGUgZnJvbUVsIHdpdGggdGhlIHRvRWwsIHdoaWNoIGVuc3VyZXMgaG9va3MgYXJlIHRvcm4gZG93biBhbmQgcmUtY3JlYXRlZFxuICAgICAgICAgIGlmKGZyb21FbC5pZCAmJiBmcm9tRWwuaXNTYW1lTm9kZSh0YXJnZXRDb250YWluZXIpICYmIGZyb21FbC5pZCAhPT0gdG9FbC5pZCl7XG4gICAgICAgICAgICBtb3JwaENhbGxiYWNrcy5vbk5vZGVEaXNjYXJkZWQoZnJvbUVsKVxuICAgICAgICAgICAgZnJvbUVsLnJlcGxhY2VXaXRoKHRvRWwpXG4gICAgICAgICAgICByZXR1cm4gbW9ycGhDYWxsYmFja3Mub25Ob2RlQWRkZWQodG9FbClcbiAgICAgICAgICB9XG4gICAgICAgICAgRE9NLnN5bmNQZW5kaW5nQXR0cnMoZnJvbUVsLCB0b0VsKVxuICAgICAgICAgIERPTS5tYWludGFpblByaXZhdGVIb29rcyhmcm9tRWwsIHRvRWwsIHBoeFZpZXdwb3J0VG9wLCBwaHhWaWV3cG9ydEJvdHRvbSlcbiAgICAgICAgICBET00uY2xlYW5DaGlsZE5vZGVzKHRvRWwsIHBoeFVwZGF0ZSlcbiAgICAgICAgICBpZih0aGlzLnNraXBDSURTaWJsaW5nKHRvRWwpKXtcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgYSBsaXZlIGNvbXBvbmVudCB1c2VkIGluIGEgc3RyZWFtLCB3ZSBtYXkgbmVlZCB0byByZW9yZGVyIGl0XG4gICAgICAgICAgICB0aGlzLm1heWJlUmVPcmRlclN0cmVhbShmcm9tRWwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoRE9NLmlzUGh4U3RpY2t5KGZyb21FbCkpe1xuICAgICAgICAgICAgW1BIWF9TRVNTSU9OLCBQSFhfU1RBVElDLCBQSFhfUk9PVF9JRF1cbiAgICAgICAgICAgICAgLm1hcChhdHRyID0+IFthdHRyLCBmcm9tRWwuZ2V0QXR0cmlidXRlKGF0dHIpLCB0b0VsLmdldEF0dHJpYnV0ZShhdHRyKV0pXG4gICAgICAgICAgICAgIC5mb3JFYWNoKChbYXR0ciwgZnJvbVZhbCwgdG9WYWxdKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYodG9WYWwgJiYgZnJvbVZhbCAhPT0gdG9WYWwpeyBmcm9tRWwuc2V0QXR0cmlidXRlKGF0dHIsIHRvVmFsKSB9XG4gICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihET00uaXNJZ25vcmVkKGZyb21FbCwgcGh4VXBkYXRlKSB8fCAoZnJvbUVsLmZvcm0gJiYgZnJvbUVsLmZvcm0uaXNTYW1lTm9kZShleHRlcm5hbEZvcm1UcmlnZ2VyZWQpKSl7XG4gICAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwidXBkYXRlZFwiLCBmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgICBET00ubWVyZ2VBdHRycyhmcm9tRWwsIHRvRWwsIHtpc0lnbm9yZWQ6IERPTS5pc0lnbm9yZWQoZnJvbUVsLCBwaHhVcGRhdGUpfSlcbiAgICAgICAgICAgIHVwZGF0ZXMucHVzaChmcm9tRWwpXG4gICAgICAgICAgICBET00uYXBwbHlTdGlja3lPcGVyYXRpb25zKGZyb21FbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihmcm9tRWwudHlwZSA9PT0gXCJudW1iZXJcIiAmJiAoZnJvbUVsLnZhbGlkaXR5ICYmIGZyb21FbC52YWxpZGl0eS5iYWRJbnB1dCkpeyByZXR1cm4gZmFsc2UgfVxuICAgICAgICAgIC8vIElmIHRoZSBlbGVtZW50IGhhcyBQSFhfUkVGX1NSQywgaXQgaXMgbG9hZGluZyBvciBsb2NrZWQgYW5kIGF3YWl0aW5nIGFuIGFjay5cbiAgICAgICAgICAvLyBJZiBpdCdzIGxvY2tlZCwgd2UgY2xvbmUgdGhlIGZyb21FbCB0cmVlIGFuZCBpbnN0cnVjdCBtb3JwaGRvbSB0byB1c2VcbiAgICAgICAgICAvLyB0aGUgY2xvbmVkIHRyZWUgYXMgdGhlIHNvdXJjZSBvZiB0aGUgbW9ycGggZm9yIHRoaXMgYnJhbmNoIGZyb20gaGVyZSBvbiBvdXQuXG4gICAgICAgICAgLy8gV2Uga2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgY2xvbmVkIHRyZWUgaW4gdGhlIGVsZW1lbnQncyBwcml2YXRlIGRhdGEsIGFuZFxuICAgICAgICAgIC8vIG9uIGFjayAodmlldy51bmRvUmVmcyksIHdlIG1vcnBoIHRoZSBjbG9uZWQgdHJlZSB3aXRoIHRoZSB0cnVlIGZyb21FbCBpbiB0aGUgRE9NIHRvXG4gICAgICAgICAgLy8gYXBwbHkgYW55IGNoYW5nZXMgdGhhdCBoYXBwZW5lZCB3aGlsZSB0aGUgZWxlbWVudCB3YXMgbG9ja2VkLlxuICAgICAgICAgIGxldCBpc0ZvY3VzZWRGb3JtRWwgPSBmb2N1c2VkICYmIGZyb21FbC5pc1NhbWVOb2RlKGZvY3VzZWQpICYmIERPTS5pc0Zvcm1JbnB1dChmcm9tRWwpXG4gICAgICAgICAgbGV0IGZvY3VzZWRTZWxlY3RDaGFuZ2VkID0gaXNGb2N1c2VkRm9ybUVsICYmIHRoaXMuaXNDaGFuZ2VkU2VsZWN0KGZyb21FbCwgdG9FbClcbiAgICAgICAgICBpZihmcm9tRWwuaGFzQXR0cmlidXRlKFBIWF9SRUZfU1JDKSl7XG4gICAgICAgICAgICBjb25zdCByZWYgPSBuZXcgRWxlbWVudFJlZihmcm9tRWwpXG4gICAgICAgICAgICAvLyBvbmx5IHBlcmZvcm0gdGhlIGNsb25lIHN0ZXAgaWYgdGhpcyBpcyBub3QgYSBwYXRjaCB0aGF0IHVubG9ja3NcbiAgICAgICAgICAgIGlmKHJlZi5sb2NrUmVmICYmICghdGhpcy51bmRvUmVmIHx8ICFyZWYuaXNMb2NrVW5kb25lQnkodGhpcy51bmRvUmVmKSkpe1xuICAgICAgICAgICAgICBpZihET00uaXNVcGxvYWRJbnB1dChmcm9tRWwpKXtcbiAgICAgICAgICAgICAgICBET00ubWVyZ2VBdHRycyhmcm9tRWwsIHRvRWwsIHtpc0lnbm9yZWQ6IHRydWV9KVxuICAgICAgICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgICAgICB1cGRhdGVzLnB1c2goZnJvbUVsKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnMoZnJvbUVsKVxuICAgICAgICAgICAgICBsZXQgaXNMb2NrZWQgPSBmcm9tRWwuaGFzQXR0cmlidXRlKFBIWF9SRUZfTE9DSylcbiAgICAgICAgICAgICAgbGV0IGNsb25lID0gaXNMb2NrZWQgPyBET00ucHJpdmF0ZShmcm9tRWwsIFBIWF9SRUZfTE9DSykgfHwgZnJvbUVsLmNsb25lTm9kZSh0cnVlKSA6IG51bGxcbiAgICAgICAgICAgICAgaWYoY2xvbmUpe1xuICAgICAgICAgICAgICAgIERPTS5wdXRQcml2YXRlKGZyb21FbCwgUEhYX1JFRl9MT0NLLCBjbG9uZSlcbiAgICAgICAgICAgICAgICBpZighaXNGb2N1c2VkRm9ybUVsKXtcbiAgICAgICAgICAgICAgICAgIGZyb21FbCA9IGNsb25lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gbmVzdGVkIHZpZXcgaGFuZGxpbmdcbiAgICAgICAgICBpZihET00uaXNQaHhDaGlsZCh0b0VsKSl7XG4gICAgICAgICAgICBsZXQgcHJldlNlc3Npb24gPSBmcm9tRWwuZ2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OKVxuICAgICAgICAgICAgRE9NLm1lcmdlQXR0cnMoZnJvbUVsLCB0b0VsLCB7ZXhjbHVkZTogW1BIWF9TVEFUSUNdfSlcbiAgICAgICAgICAgIGlmKHByZXZTZXNzaW9uICE9PSBcIlwiKXsgZnJvbUVsLnNldEF0dHJpYnV0ZShQSFhfU0VTU0lPTiwgcHJldlNlc3Npb24pIH1cbiAgICAgICAgICAgIGZyb21FbC5zZXRBdHRyaWJ1dGUoUEhYX1JPT1RfSUQsIHRoaXMucm9vdElEKVxuICAgICAgICAgICAgRE9NLmFwcGx5U3RpY2t5T3BlcmF0aW9ucyhmcm9tRWwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBpZiB3ZSBhcmUgdW5kb2luZyBhIGxvY2ssIGNvcHkgcG90ZW50aWFsbHkgbmVzdGVkIGNsb25lcyBvdmVyXG4gICAgICAgICAgaWYodGhpcy51bmRvUmVmICYmIERPTS5wcml2YXRlKHRvRWwsIFBIWF9SRUZfTE9DSykpe1xuICAgICAgICAgICAgRE9NLnB1dFByaXZhdGUoZnJvbUVsLCBQSFhfUkVGX0xPQ0ssIERPTS5wcml2YXRlKHRvRWwsIFBIWF9SRUZfTE9DSykpXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIG5vdyBjb3B5IHJlZ3VsYXIgRE9NLnByaXZhdGUgZGF0YVxuICAgICAgICAgIERPTS5jb3B5UHJpdmF0ZXModG9FbCwgZnJvbUVsKVxuXG4gICAgICAgICAgLy8gc2tpcCBwYXRjaGluZyBmb2N1c2VkIGlucHV0cyB1bmxlc3MgZm9jdXMgaXMgYSBzZWxlY3QgdGhhdCBoYXMgY2hhbmdlZCBvcHRpb25zXG4gICAgICAgICAgaWYoaXNGb2N1c2VkRm9ybUVsICYmIGZyb21FbC50eXBlICE9PSBcImhpZGRlblwiICYmICFmb2N1c2VkU2VsZWN0Q2hhbmdlZCl7XG4gICAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwidXBkYXRlZFwiLCBmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgICBET00ubWVyZ2VGb2N1c2VkSW5wdXQoZnJvbUVsLCB0b0VsKVxuICAgICAgICAgICAgRE9NLnN5bmNBdHRyc1RvUHJvcHMoZnJvbUVsKVxuICAgICAgICAgICAgdXBkYXRlcy5wdXNoKGZyb21FbClcbiAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnMoZnJvbUVsKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGJsdXIgZm9jdXNlZCBzZWxlY3QgaWYgaXQgY2hhbmdlZCBzbyBuYXRpdmUgVUkgaXMgdXBkYXRlZCAoaWUgc2FmYXJpIHdvbid0IHVwZGF0ZSB2aXNpYmxlIG9wdGlvbnMpXG4gICAgICAgICAgICBpZihmb2N1c2VkU2VsZWN0Q2hhbmdlZCl7IGZyb21FbC5ibHVyKCkgfVxuICAgICAgICAgICAgaWYoRE9NLmlzUGh4VXBkYXRlKHRvRWwsIHBoeFVwZGF0ZSwgW1wiYXBwZW5kXCIsIFwicHJlcGVuZFwiXSkpe1xuICAgICAgICAgICAgICBhcHBlbmRQcmVwZW5kVXBkYXRlcy5wdXNoKG5ldyBET01Qb3N0TW9ycGhSZXN0b3Jlcihmcm9tRWwsIHRvRWwsIHRvRWwuZ2V0QXR0cmlidXRlKHBoeFVwZGF0ZSkpKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBET00uc3luY0F0dHJzVG9Qcm9wcyh0b0VsKVxuICAgICAgICAgICAgRE9NLmFwcGx5U3RpY2t5T3BlcmF0aW9ucyh0b0VsKVxuICAgICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgZnJvbUVsLCB0b0VsKVxuICAgICAgICAgICAgcmV0dXJuIGZyb21FbFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbW9ycGhkb20odGFyZ2V0Q29udGFpbmVyLCBzb3VyY2UsIG1vcnBoQ2FsbGJhY2tzKVxuICAgIH1cblxuICAgIHRoaXMudHJhY2tCZWZvcmUoXCJhZGRlZFwiLCBjb250YWluZXIpXG4gICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgY29udGFpbmVyLCBjb250YWluZXIpXG5cbiAgICBsaXZlU29ja2V0LnRpbWUoXCJtb3JwaGRvbVwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnN0cmVhbXMuZm9yRWFjaCgoW3JlZiwgaW5zZXJ0cywgZGVsZXRlSWRzLCByZXNldF0pID0+IHtcbiAgICAgICAgaW5zZXJ0cy5mb3JFYWNoKChba2V5LCBzdHJlYW1BdCwgbGltaXRdKSA9PiB7XG4gICAgICAgICAgdGhpcy5zdHJlYW1JbnNlcnRzW2tleV0gPSB7cmVmLCBzdHJlYW1BdCwgbGltaXQsIHJlc2V0fVxuICAgICAgICB9KVxuICAgICAgICBpZihyZXNldCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICBET00uYWxsKGNvbnRhaW5lciwgYFske1BIWF9TVFJFQU1fUkVGfT1cIiR7cmVmfVwiXWAsIGNoaWxkID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlU3RyZWFtQ2hpbGRFbGVtZW50KGNoaWxkKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlSWRzLmZvckVhY2goaWQgPT4ge1xuICAgICAgICAgIGxldCBjaGlsZCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGBbaWQ9XCIke2lkfVwiXWApXG4gICAgICAgICAgaWYoY2hpbGQpeyB0aGlzLnJlbW92ZVN0cmVhbUNoaWxkRWxlbWVudChjaGlsZCkgfVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgLy8gY2xlYXIgc3RyZWFtIGl0ZW1zIGZyb20gdGhlIGRlYWQgcmVuZGVyIGlmIHRoZXkgYXJlIG5vdCBpbnNlcnRlZCBhZ2FpblxuICAgICAgaWYoaXNKb2luUGF0Y2gpe1xuICAgICAgICBET00uYWxsKHRoaXMuY29udGFpbmVyLCBgWyR7cGh4VXBkYXRlfT0ke1BIWF9TVFJFQU19XWApXG4gICAgICAgICAgLy8gaXQgaXMgaW1wb3J0YW50IHRvIGZpbHRlciB0aGUgZWxlbWVudCBiZWZvcmUgcmVtb3ZpbmcgdGhlbSwgYXNcbiAgICAgICAgICAvLyBpdCBtYXkgaGFwcGVuIHRoYXQgc3RyZWFtcyBhcmUgbmVzdGVkIGFuZCB0aGUgb3duZXIgY2hlY2sgZmFpbHMgaWZcbiAgICAgICAgICAvLyBhIHBhcmVudCBpcyByZW1vdmVkIGJlZm9yZSBhIGNoaWxkXG4gICAgICAgICAgLmZpbHRlcihlbCA9PiB0aGlzLnZpZXcub3duc0VsZW1lbnQoZWwpKVxuICAgICAgICAgIC5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgICAgIEFycmF5LmZyb20oZWwuY2hpbGRyZW4pLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgICAvLyB3ZSBhbHJlYWR5IHBlcmZvcm1lZCB0aGUgb3duZXIgY2hlY2ssIGVhY2ggY2hpbGQgaXMgZ3VhcmFudGVlZCB0byBiZSBvd25lZFxuICAgICAgICAgICAgICAvLyBieSB0aGUgdmlldy4gVG8gcHJldmVudCB0aGUgbmVzdGVkIG93bmVyIGNoZWNrIGZyb20gZmFpbGluZyBpbiBjYXNlIG9mIG5lc3RlZFxuICAgICAgICAgICAgICAvLyBzdHJlYW1zIHdoZXJlIHRoZSBwYXJlbnQgaXMgcmVtb3ZlZCBiZWZvcmUgdGhlIGNoaWxkLCB3ZSBmb3JjZSB0aGUgcmVtb3ZhbFxuICAgICAgICAgICAgICB0aGlzLnJlbW92ZVN0cmVhbUNoaWxkRWxlbWVudChjaGlsZCwgdHJ1ZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgbW9ycGguY2FsbCh0aGlzLCB0YXJnZXRDb250YWluZXIsIGh0bWwpXG4gICAgfSlcblxuICAgIGlmKGxpdmVTb2NrZXQuaXNEZWJ1Z0VuYWJsZWQoKSl7XG4gICAgICBkZXRlY3REdXBsaWNhdGVJZHMoKVxuICAgICAgZGV0ZWN0SW52YWxpZFN0cmVhbUluc2VydHModGhpcy5zdHJlYW1JbnNlcnRzKVxuICAgICAgLy8gd2FybiBpZiB0aGVyZSBhcmUgYW55IGlucHV0cyBuYW1lZCBcImlkXCJcbiAgICAgIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0W25hbWU9aWRdXCIpKS5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICBpZihub2RlLmZvcm0pe1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJEZXRlY3RlZCBhbiBpbnB1dCB3aXRoIG5hbWU9XFxcImlkXFxcIiBpbnNpZGUgYSBmb3JtISBUaGlzIHdpbGwgY2F1c2UgcHJvYmxlbXMgd2hlbiBwYXRjaGluZyB0aGUgRE9NLlxcblwiLCBub2RlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmKGFwcGVuZFByZXBlbmRVcGRhdGVzLmxlbmd0aCA+IDApe1xuICAgICAgbGl2ZVNvY2tldC50aW1lKFwicG9zdC1tb3JwaCBhcHBlbmQvcHJlcGVuZCByZXN0b3JhdGlvblwiLCAoKSA9PiB7XG4gICAgICAgIGFwcGVuZFByZXBlbmRVcGRhdGVzLmZvckVhY2godXBkYXRlID0+IHVwZGF0ZS5wZXJmb3JtKCkpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGxpdmVTb2NrZXQuc2lsZW5jZUV2ZW50cygoKSA9PiBET00ucmVzdG9yZUZvY3VzKGZvY3VzZWQsIHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpKVxuICAgIERPTS5kaXNwYXRjaEV2ZW50KGRvY3VtZW50LCBcInBoeDp1cGRhdGVcIilcbiAgICBhZGRlZC5mb3JFYWNoKGVsID0+IHRoaXMudHJhY2tBZnRlcihcImFkZGVkXCIsIGVsKSlcbiAgICB1cGRhdGVzLmZvckVhY2goZWwgPT4gdGhpcy50cmFja0FmdGVyKFwidXBkYXRlZFwiLCBlbCkpXG5cbiAgICB0aGlzLnRyYW5zaXRpb25QZW5kaW5nUmVtb3ZlcygpXG5cbiAgICBpZihleHRlcm5hbEZvcm1UcmlnZ2VyZWQpe1xuICAgICAgbGl2ZVNvY2tldC51bmxvYWQoKVxuICAgICAgLy8gY2hlY2sgZm9yIHN1Ym1pdHRlciBhbmQgaW5qZWN0IGl0IGFzIGhpZGRlbiBpbnB1dCBmb3IgZXh0ZXJuYWwgc3VibWl0O1xuICAgICAgLy8gSW4gdGhlb3J5LCBpdCBjb3VsZCBoYXBwZW4gdGhhdCB0aGUgc3RvcmVkIHN1Ym1pdHRlciBpcyBvdXRkYXRlZCBhbmQgZG9lc24ndFxuICAgICAgLy8gZXhpc3QgaW4gdGhlIERPTSBhbnkgbW9yZSwgYnV0IHRoaXMgaXMgdW5saWtlbHksIHNvIHdlIGp1c3QgYWNjZXB0IGl0IGZvciBub3cuXG4gICAgICBjb25zdCBzdWJtaXR0ZXIgPSBET00ucHJpdmF0ZShleHRlcm5hbEZvcm1UcmlnZ2VyZWQsIFwic3VibWl0dGVyXCIpXG4gICAgICBpZihzdWJtaXR0ZXIgJiYgc3VibWl0dGVyLm5hbWUgJiYgdGFyZ2V0Q29udGFpbmVyLmNvbnRhaW5zKHN1Ym1pdHRlcikpe1xuICAgICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKVxuICAgICAgICBpbnB1dC50eXBlID0gXCJoaWRkZW5cIlxuICAgICAgICBjb25zdCBmb3JtSWQgPSBzdWJtaXR0ZXIuZ2V0QXR0cmlidXRlKFwiZm9ybVwiKVxuICAgICAgICBpZihmb3JtSWQpe1xuICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImZvcm1cIiwgZm9ybUlkKVxuICAgICAgICB9XG4gICAgICAgIGlucHV0Lm5hbWUgPSBzdWJtaXR0ZXIubmFtZVxuICAgICAgICBpbnB1dC52YWx1ZSA9IHN1Ym1pdHRlci52YWx1ZVxuICAgICAgICBzdWJtaXR0ZXIucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoaW5wdXQsIHN1Ym1pdHRlcilcbiAgICAgIH1cbiAgICAgIC8vIHVzZSBwcm90b3R5cGUncyBzdWJtaXQgaW4gY2FzZSB0aGVyZSdzIGEgZm9ybSBjb250cm9sIHdpdGggbmFtZSBvciBpZCBvZiBcInN1Ym1pdFwiXG4gICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTEZvcm1FbGVtZW50L3N1Ym1pdFxuICAgICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKGV4dGVybmFsRm9ybVRyaWdnZXJlZCkuc3VibWl0LmNhbGwoZXh0ZXJuYWxGb3JtVHJpZ2dlcmVkKVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgb25Ob2RlRGlzY2FyZGVkKGVsKXtcbiAgICAvLyBuZXN0ZWQgdmlldyBoYW5kbGluZ1xuICAgIGlmKERPTS5pc1BoeENoaWxkKGVsKSB8fCBET00uaXNQaHhTdGlja3koZWwpKXsgdGhpcy5saXZlU29ja2V0LmRlc3Ryb3lWaWV3QnlFbChlbCkgfVxuICAgIHRoaXMudHJhY2tBZnRlcihcImRpc2NhcmRlZFwiLCBlbClcbiAgfVxuXG4gIG1heWJlUGVuZGluZ1JlbW92ZShub2RlKXtcbiAgICBpZihub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZSh0aGlzLnBoeFJlbW92ZSkgIT09IG51bGwpe1xuICAgICAgdGhpcy5wZW5kaW5nUmVtb3Zlcy5wdXNoKG5vZGUpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICByZW1vdmVTdHJlYW1DaGlsZEVsZW1lbnQoY2hpbGQsIGZvcmNlPWZhbHNlKXtcbiAgICAvLyBtYWtlIHN1cmUgdG8gb25seSByZW1vdmUgZWxlbWVudHMgb3duZWQgYnkgdGhlIGN1cnJlbnQgdmlld1xuICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9pc3N1ZXMvMzA0N1xuICAgIC8vIGFuZCBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9pc3N1ZXMvMzY4MVxuICAgIGlmKCFmb3JjZSAmJiAhdGhpcy52aWV3Lm93bnNFbGVtZW50KGNoaWxkKSl7IHJldHVybiB9XG5cbiAgICAvLyB3ZSBuZWVkIHRvIHN0b3JlIHRoZSBub2RlIGlmIGl0IGlzIGFjdHVhbGx5IHJlLWFkZGVkIGluIHRoZSBzYW1lIHBhdGNoXG4gICAgLy8gd2UgZG8gTk9UIHdhbnQgdG8gZXhlY3V0ZSBwaHgtcmVtb3ZlLCB3ZSBkbyBOT1Qgd2FudCB0byBjYWxsIG9uTm9kZURpc2NhcmRlZFxuICAgIGlmKHRoaXMuc3RyZWFtSW5zZXJ0c1tjaGlsZC5pZF0pe1xuICAgICAgdGhpcy5zdHJlYW1Db21wb25lbnRSZXN0b3JlW2NoaWxkLmlkXSA9IGNoaWxkXG4gICAgICBjaGlsZC5yZW1vdmUoKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvbmx5IHJlbW92ZSB0aGUgZWxlbWVudCBub3cgaWYgaXQgaGFzIG5vIHBoeC1yZW1vdmUgYmluZGluZ1xuICAgICAgaWYoIXRoaXMubWF5YmVQZW5kaW5nUmVtb3ZlKGNoaWxkKSl7XG4gICAgICAgIGNoaWxkLnJlbW92ZSgpXG4gICAgICAgIHRoaXMub25Ob2RlRGlzY2FyZGVkKGNoaWxkKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldFN0cmVhbUluc2VydChlbCl7XG4gICAgbGV0IGluc2VydCA9IGVsLmlkID8gdGhpcy5zdHJlYW1JbnNlcnRzW2VsLmlkXSA6IHt9XG4gICAgcmV0dXJuIGluc2VydCB8fCB7fVxuICB9XG5cbiAgc2V0U3RyZWFtUmVmKGVsLCByZWYpe1xuICAgIERPTS5wdXRTdGlja3koZWwsIFBIWF9TVFJFQU1fUkVGLCBlbCA9PiBlbC5zZXRBdHRyaWJ1dGUoUEhYX1NUUkVBTV9SRUYsIHJlZikpXG4gIH1cblxuICBtYXliZVJlT3JkZXJTdHJlYW0oZWwsIGlzTmV3KXtcbiAgICBsZXQge3JlZiwgc3RyZWFtQXQsIHJlc2V0fSA9IHRoaXMuZ2V0U3RyZWFtSW5zZXJ0KGVsKVxuICAgIGlmKHN0cmVhbUF0ID09PSB1bmRlZmluZWQpeyByZXR1cm4gfVxuXG4gICAgLy8gd2UgbmVlZCB0byBzZXQgdGhlIFBIWF9TVFJFQU1fUkVGIGhlcmUgYXMgd2VsbCBhcyBhZGRDaGlsZCBpcyBpbnZva2VkIG9ubHkgZm9yIHBhcmVudHNcbiAgICB0aGlzLnNldFN0cmVhbVJlZihlbCwgcmVmKVxuXG4gICAgaWYoIXJlc2V0ICYmICFpc05ldyl7XG4gICAgICAvLyB3ZSBvbmx5IHJlb3JkZXIgaWYgdGhlIGVsZW1lbnQgaXMgbmV3IG9yIGl0J3MgYSBzdHJlYW0gcmVzZXRcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIHRoZSBlbGVtZW50IGhhcyBhIHBhcmVudCBlbGVtZW50O1xuICAgIC8vIGl0IGRvZXNuJ3QgaWYgd2UgYXJlIGN1cnJlbnRseSByZWN1cnNpdmVseSBtb3JwaGluZyAocmVzdG9yaW5nIGEgc2F2ZWQgc3RyZWFtIGNoaWxkKVxuICAgIC8vIGJlY2F1c2UgdGhlIGVsZW1lbnQgaXMgbm90IHlldCBhZGRlZCB0byB0aGUgcmVhbCBkb207XG4gICAgLy8gcmVvcmRlcmluZyBkb2VzIG5vdCBtYWtlIHNlbnNlIGluIHRoYXQgY2FzZSBhbnl3YXlcbiAgICBpZighZWwucGFyZW50RWxlbWVudCl7IHJldHVybiB9XG5cbiAgICBpZihzdHJlYW1BdCA9PT0gMCl7XG4gICAgICBlbC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShlbCwgZWwucGFyZW50RWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZClcbiAgICB9IGVsc2UgaWYoc3RyZWFtQXQgPiAwKXtcbiAgICAgIGxldCBjaGlsZHJlbiA9IEFycmF5LmZyb20oZWwucGFyZW50RWxlbWVudC5jaGlsZHJlbilcbiAgICAgIGxldCBvbGRJbmRleCA9IGNoaWxkcmVuLmluZGV4T2YoZWwpXG4gICAgICBpZihzdHJlYW1BdCA+PSBjaGlsZHJlbi5sZW5ndGggLSAxKXtcbiAgICAgICAgZWwucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChlbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBzaWJsaW5nID0gY2hpbGRyZW5bc3RyZWFtQXRdXG4gICAgICAgIGlmKG9sZEluZGV4ID4gc3RyZWFtQXQpe1xuICAgICAgICAgIGVsLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGVsLCBzaWJsaW5nKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGVsLCBzaWJsaW5nLm5leHRFbGVtZW50U2libGluZylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubWF5YmVMaW1pdFN0cmVhbShlbClcbiAgfVxuXG4gIG1heWJlTGltaXRTdHJlYW0oZWwpe1xuICAgIGxldCB7bGltaXR9ID0gdGhpcy5nZXRTdHJlYW1JbnNlcnQoZWwpXG4gICAgbGV0IGNoaWxkcmVuID0gbGltaXQgIT09IG51bGwgJiYgQXJyYXkuZnJvbShlbC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuKVxuICAgIGlmKGxpbWl0ICYmIGxpbWl0IDwgMCAmJiBjaGlsZHJlbi5sZW5ndGggPiBsaW1pdCAqIC0xKXtcbiAgICAgIGNoaWxkcmVuLnNsaWNlKDAsIGNoaWxkcmVuLmxlbmd0aCArIGxpbWl0KS5mb3JFYWNoKGNoaWxkID0+IHRoaXMucmVtb3ZlU3RyZWFtQ2hpbGRFbGVtZW50KGNoaWxkKSlcbiAgICB9IGVsc2UgaWYobGltaXQgJiYgbGltaXQgPj0gMCAmJiBjaGlsZHJlbi5sZW5ndGggPiBsaW1pdCl7XG4gICAgICBjaGlsZHJlbi5zbGljZShsaW1pdCkuZm9yRWFjaChjaGlsZCA9PiB0aGlzLnJlbW92ZVN0cmVhbUNoaWxkRWxlbWVudChjaGlsZCkpXG4gICAgfVxuICB9XG5cbiAgdHJhbnNpdGlvblBlbmRpbmdSZW1vdmVzKCl7XG4gICAgbGV0IHtwZW5kaW5nUmVtb3ZlcywgbGl2ZVNvY2tldH0gPSB0aGlzXG4gICAgaWYocGVuZGluZ1JlbW92ZXMubGVuZ3RoID4gMCl7XG4gICAgICBsaXZlU29ja2V0LnRyYW5zaXRpb25SZW1vdmVzKHBlbmRpbmdSZW1vdmVzLCAoKSA9PiB7XG4gICAgICAgIHBlbmRpbmdSZW1vdmVzLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgIGxldCBjaGlsZCA9IERPTS5maXJzdFBoeENoaWxkKGVsKVxuICAgICAgICAgIGlmKGNoaWxkKXsgbGl2ZVNvY2tldC5kZXN0cm95Vmlld0J5RWwoY2hpbGQpIH1cbiAgICAgICAgICBlbC5yZW1vdmUoKVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLnRyYWNrQWZ0ZXIoXCJ0cmFuc2l0aW9uc0Rpc2NhcmRlZFwiLCBwZW5kaW5nUmVtb3ZlcylcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgaXNDaGFuZ2VkU2VsZWN0KGZyb21FbCwgdG9FbCl7XG4gICAgaWYoIShmcm9tRWwgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCkgfHwgZnJvbUVsLm11bHRpcGxlKXsgcmV0dXJuIGZhbHNlIH1cbiAgICBpZihmcm9tRWwub3B0aW9ucy5sZW5ndGggIT09IHRvRWwub3B0aW9ucy5sZW5ndGgpeyByZXR1cm4gdHJ1ZSB9XG5cbiAgICAvLyBrZWVwIHRoZSBjdXJyZW50IHZhbHVlXG4gICAgdG9FbC52YWx1ZSA9IGZyb21FbC52YWx1ZVxuXG4gICAgLy8gaW4gZ2VuZXJhbCB3ZSBoYXZlIHRvIGJlIHZlcnkgY2FyZWZ1bCB3aXRoIHVzaW5nIGlzRXF1YWxOb2RlIGFzIGl0IGRvZXMgbm90IGEgcmVsaWFibGVcbiAgICAvLyBET00gdHJlZSBlcXVhbGl0eSBjaGVjaywgYnV0IGZvciBzZWxlY3Rpb24gYXR0cmlidXRlcyBhbmQgb3B0aW9ucyBpdCB3b3JrcyBmaW5lXG4gICAgcmV0dXJuICFmcm9tRWwuaXNFcXVhbE5vZGUodG9FbClcbiAgfVxuXG4gIGlzQ0lEUGF0Y2goKXsgcmV0dXJuIHRoaXMuY2lkUGF0Y2ggfVxuXG4gIHNraXBDSURTaWJsaW5nKGVsKXtcbiAgICByZXR1cm4gZWwubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIGVsLmhhc0F0dHJpYnV0ZShQSFhfU0tJUClcbiAgfVxuXG4gIHRhcmdldENJRENvbnRhaW5lcihodG1sKXtcbiAgICBpZighdGhpcy5pc0NJRFBhdGNoKCkpeyByZXR1cm4gfVxuICAgIGxldCBbZmlyc3QsIC4uLnJlc3RdID0gRE9NLmZpbmRDb21wb25lbnROb2RlTGlzdCh0aGlzLmNvbnRhaW5lciwgdGhpcy50YXJnZXRDSUQpXG4gICAgaWYocmVzdC5sZW5ndGggPT09IDAgJiYgRE9NLmNoaWxkTm9kZUxlbmd0aChodG1sKSA9PT0gMSl7XG4gICAgICByZXR1cm4gZmlyc3RcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpcnN0ICYmIGZpcnN0LnBhcmVudE5vZGVcbiAgICB9XG4gIH1cblxuICBpbmRleE9mKHBhcmVudCwgY2hpbGQpeyByZXR1cm4gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmluZGV4T2YoY2hpbGQpIH1cbn1cbiIsICJpbXBvcnQge1xuICBDT01QT05FTlRTLFxuICBEWU5BTUlDUyxcbiAgVEVNUExBVEVTLFxuICBFVkVOVFMsXG4gIFBIWF9DT01QT05FTlQsXG4gIFBIWF9TS0lQLFxuICBQSFhfTUFHSUNfSUQsXG4gIFJFUExZLFxuICBTVEFUSUMsXG4gIFRJVExFLFxuICBTVFJFQU0sXG4gIFJPT1QsXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGlzT2JqZWN0LFxuICBsb2dFcnJvcixcbiAgaXNDaWQsXG59IGZyb20gXCIuL3V0aWxzXCJcblxuY29uc3QgVk9JRF9UQUdTID0gbmV3IFNldChbXG4gIFwiYXJlYVwiLFxuICBcImJhc2VcIixcbiAgXCJiclwiLFxuICBcImNvbFwiLFxuICBcImNvbW1hbmRcIixcbiAgXCJlbWJlZFwiLFxuICBcImhyXCIsXG4gIFwiaW1nXCIsXG4gIFwiaW5wdXRcIixcbiAgXCJrZXlnZW5cIixcbiAgXCJsaW5rXCIsXG4gIFwibWV0YVwiLFxuICBcInBhcmFtXCIsXG4gIFwic291cmNlXCIsXG4gIFwidHJhY2tcIixcbiAgXCJ3YnJcIlxuXSlcbmNvbnN0IHF1b3RlQ2hhcnMgPSBuZXcgU2V0KFtcIidcIiwgXCJcXFwiXCJdKVxuXG5leHBvcnQgbGV0IG1vZGlmeVJvb3QgPSAoaHRtbCwgYXR0cnMsIGNsZWFySW5uZXJIVE1MKSA9PiB7XG4gIGxldCBpID0gMFxuICBsZXQgaW5zaWRlQ29tbWVudCA9IGZhbHNlXG4gIGxldCBiZWZvcmVUYWcsIGFmdGVyVGFnLCB0YWcsIHRhZ05hbWVFbmRzQXQsIGlkLCBuZXdIVE1MXG5cbiAgbGV0IGxvb2thaGVhZCA9IGh0bWwubWF0Y2goL14oXFxzKig/OjwhLS0uKj8tLT5cXHMqKSopPChbXlxcc1xcLz5dKykvKVxuICBpZihsb29rYWhlYWQgPT09IG51bGwpeyB0aHJvdyBuZXcgRXJyb3IoYG1hbGZvcm1lZCBodG1sICR7aHRtbH1gKSB9XG5cbiAgaSA9IGxvb2thaGVhZFswXS5sZW5ndGhcbiAgYmVmb3JlVGFnID0gbG9va2FoZWFkWzFdXG4gIHRhZyA9IGxvb2thaGVhZFsyXVxuICB0YWdOYW1lRW5kc0F0ID0gaVxuXG4gIC8vIFNjYW4gdGhlIG9wZW5pbmcgdGFnIGZvciBpZCwgaWYgdGhlcmUgaXMgYW55XG4gIGZvcihpOyBpIDwgaHRtbC5sZW5ndGg7IGkrKyl7XG4gICAgaWYoaHRtbC5jaGFyQXQoaSkgPT09IFwiPlwiICl7IGJyZWFrIH1cbiAgICBpZihodG1sLmNoYXJBdChpKSA9PT0gXCI9XCIpe1xuICAgICAgbGV0IGlzSWQgPSBodG1sLnNsaWNlKGkgLSAzLCBpKSA9PT0gXCIgaWRcIlxuICAgICAgaSsrXG4gICAgICBsZXQgY2hhciA9IGh0bWwuY2hhckF0KGkpXG4gICAgICBpZihxdW90ZUNoYXJzLmhhcyhjaGFyKSl7XG4gICAgICAgIGxldCBhdHRyU3RhcnRzQXQgPSBpXG4gICAgICAgIGkrK1xuICAgICAgICBmb3IoaTsgaSA8IGh0bWwubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIGlmKGh0bWwuY2hhckF0KGkpID09PSBjaGFyKXsgYnJlYWsgfVxuICAgICAgICB9XG4gICAgICAgIGlmKGlzSWQpe1xuICAgICAgICAgIGlkID0gaHRtbC5zbGljZShhdHRyU3RhcnRzQXQgKyAxLCBpKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsZXQgY2xvc2VBdCA9IGh0bWwubGVuZ3RoIC0gMVxuICBpbnNpZGVDb21tZW50ID0gZmFsc2VcbiAgd2hpbGUoY2xvc2VBdCA+PSBiZWZvcmVUYWcubGVuZ3RoICsgdGFnLmxlbmd0aCl7XG4gICAgbGV0IGNoYXIgPSBodG1sLmNoYXJBdChjbG9zZUF0KVxuICAgIGlmKGluc2lkZUNvbW1lbnQpe1xuICAgICAgaWYoY2hhciA9PT0gXCItXCIgJiYgaHRtbC5zbGljZShjbG9zZUF0IC0gMywgY2xvc2VBdCkgPT09IFwiPCEtXCIpe1xuICAgICAgICBpbnNpZGVDb21tZW50ID0gZmFsc2VcbiAgICAgICAgY2xvc2VBdCAtPSA0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbG9zZUF0IC09IDFcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYoY2hhciA9PT0gXCI+XCIgJiYgaHRtbC5zbGljZShjbG9zZUF0IC0gMiwgY2xvc2VBdCkgPT09IFwiLS1cIil7XG4gICAgICBpbnNpZGVDb21tZW50ID0gdHJ1ZVxuICAgICAgY2xvc2VBdCAtPSAzXG4gICAgfSBlbHNlIGlmKGNoYXIgPT09IFwiPlwiKXtcbiAgICAgIGJyZWFrXG4gICAgfSBlbHNlIHtcbiAgICAgIGNsb3NlQXQgLT0gMVxuICAgIH1cbiAgfVxuICBhZnRlclRhZyA9IGh0bWwuc2xpY2UoY2xvc2VBdCArIDEsIGh0bWwubGVuZ3RoKVxuXG4gIGxldCBhdHRyc1N0ciA9XG4gICAgT2JqZWN0LmtleXMoYXR0cnMpXG4gICAgICAubWFwKGF0dHIgPT4gYXR0cnNbYXR0cl0gPT09IHRydWUgPyBhdHRyIDogYCR7YXR0cn09XCIke2F0dHJzW2F0dHJdfVwiYClcbiAgICAgIC5qb2luKFwiIFwiKVxuXG4gIGlmKGNsZWFySW5uZXJIVE1MKXtcbiAgICAvLyBLZWVwIHRoZSBpZCBpZiBhbnlcbiAgICBsZXQgaWRBdHRyU3RyID0gaWQgPyBgIGlkPVwiJHtpZH1cImAgOiBcIlwiXG4gICAgaWYoVk9JRF9UQUdTLmhhcyh0YWcpKXtcbiAgICAgIG5ld0hUTUwgPSBgPCR7dGFnfSR7aWRBdHRyU3RyfSR7YXR0cnNTdHIgPT09IFwiXCIgPyBcIlwiIDogXCIgXCJ9JHthdHRyc1N0cn0vPmBcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3SFRNTCA9IGA8JHt0YWd9JHtpZEF0dHJTdHJ9JHthdHRyc1N0ciA9PT0gXCJcIiA/IFwiXCIgOiBcIiBcIn0ke2F0dHJzU3RyfT48LyR7dGFnfT5gXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGxldCByZXN0ID0gaHRtbC5zbGljZSh0YWdOYW1lRW5kc0F0LCBjbG9zZUF0ICsgMSlcbiAgICBuZXdIVE1MID0gYDwke3RhZ30ke2F0dHJzU3RyID09PSBcIlwiID8gXCJcIiA6IFwiIFwifSR7YXR0cnNTdHJ9JHtyZXN0fWBcbiAgfVxuXG4gIHJldHVybiBbbmV3SFRNTCwgYmVmb3JlVGFnLCBhZnRlclRhZ11cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyZWQge1xuICBzdGF0aWMgZXh0cmFjdChkaWZmKXtcbiAgICBsZXQge1tSRVBMWV06IHJlcGx5LCBbRVZFTlRTXTogZXZlbnRzLCBbVElUTEVdOiB0aXRsZX0gPSBkaWZmXG4gICAgZGVsZXRlIGRpZmZbUkVQTFldXG4gICAgZGVsZXRlIGRpZmZbRVZFTlRTXVxuICAgIGRlbGV0ZSBkaWZmW1RJVExFXVxuICAgIHJldHVybiB7ZGlmZiwgdGl0bGUsIHJlcGx5OiByZXBseSB8fCBudWxsLCBldmVudHM6IGV2ZW50cyB8fCBbXX1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHZpZXdJZCwgcmVuZGVyZWQpe1xuICAgIHRoaXMudmlld0lkID0gdmlld0lkXG4gICAgdGhpcy5yZW5kZXJlZCA9IHt9XG4gICAgdGhpcy5tYWdpY0lkID0gMFxuICAgIHRoaXMubWVyZ2VEaWZmKHJlbmRlcmVkKVxuICB9XG5cbiAgcGFyZW50Vmlld0lkKCl7IHJldHVybiB0aGlzLnZpZXdJZCB9XG5cbiAgdG9TdHJpbmcob25seUNpZHMpe1xuICAgIGxldCBbc3RyLCBzdHJlYW1zXSA9IHRoaXMucmVjdXJzaXZlVG9TdHJpbmcodGhpcy5yZW5kZXJlZCwgdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSwgb25seUNpZHMsIHRydWUsIHt9KVxuICAgIHJldHVybiBbc3RyLCBzdHJlYW1zXVxuICB9XG5cbiAgcmVjdXJzaXZlVG9TdHJpbmcocmVuZGVyZWQsIGNvbXBvbmVudHMgPSByZW5kZXJlZFtDT01QT05FTlRTXSwgb25seUNpZHMsIGNoYW5nZVRyYWNraW5nLCByb290QXR0cnMpe1xuICAgIG9ubHlDaWRzID0gb25seUNpZHMgPyBuZXcgU2V0KG9ubHlDaWRzKSA6IG51bGxcbiAgICBsZXQgb3V0cHV0ID0ge2J1ZmZlcjogXCJcIiwgY29tcG9uZW50czogY29tcG9uZW50cywgb25seUNpZHM6IG9ubHlDaWRzLCBzdHJlYW1zOiBuZXcgU2V0KCl9XG4gICAgdGhpcy50b091dHB1dEJ1ZmZlcihyZW5kZXJlZCwgbnVsbCwgb3V0cHV0LCBjaGFuZ2VUcmFja2luZywgcm9vdEF0dHJzKVxuICAgIHJldHVybiBbb3V0cHV0LmJ1ZmZlciwgb3V0cHV0LnN0cmVhbXNdXG4gIH1cblxuICBjb21wb25lbnRDSURzKGRpZmYpeyByZXR1cm4gT2JqZWN0LmtleXMoZGlmZltDT01QT05FTlRTXSB8fCB7fSkubWFwKGkgPT4gcGFyc2VJbnQoaSkpIH1cblxuICBpc0NvbXBvbmVudE9ubHlEaWZmKGRpZmYpe1xuICAgIGlmKCFkaWZmW0NPTVBPTkVOVFNdKXsgcmV0dXJuIGZhbHNlIH1cbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZGlmZikubGVuZ3RoID09PSAxXG4gIH1cblxuICBnZXRDb21wb25lbnQoZGlmZiwgY2lkKXsgcmV0dXJuIGRpZmZbQ09NUE9ORU5UU11bY2lkXSB9XG5cbiAgcmVzZXRSZW5kZXIoY2lkKXtcbiAgICAvLyB3ZSBhcmUgcmFjaW5nIGEgY29tcG9uZW50IGRlc3Ryb3ksIGl0IGNvdWxkIG5vdCBleGlzdCwgc29cbiAgICAvLyBtYWtlIHN1cmUgdGhhdCB3ZSBkb24ndCB0cnkgdG8gc2V0IHJlc2V0IG9uIHVuZGVmaW5lZFxuICAgIGlmKHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU11bY2lkXSl7XG4gICAgICB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdW2NpZF0ucmVzZXQgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgbWVyZ2VEaWZmKGRpZmYpe1xuICAgIGxldCBuZXdjID0gZGlmZltDT01QT05FTlRTXVxuICAgIGxldCBjYWNoZSA9IHt9XG4gICAgZGVsZXRlIGRpZmZbQ09NUE9ORU5UU11cbiAgICB0aGlzLnJlbmRlcmVkID0gdGhpcy5tdXRhYmxlTWVyZ2UodGhpcy5yZW5kZXJlZCwgZGlmZilcbiAgICB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdID0gdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSB8fCB7fVxuXG4gICAgaWYobmV3Yyl7XG4gICAgICBsZXQgb2xkYyA9IHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU11cblxuICAgICAgZm9yKGxldCBjaWQgaW4gbmV3Yyl7XG4gICAgICAgIG5ld2NbY2lkXSA9IHRoaXMuY2FjaGVkRmluZENvbXBvbmVudChjaWQsIG5ld2NbY2lkXSwgb2xkYywgbmV3YywgY2FjaGUpXG4gICAgICB9XG5cbiAgICAgIGZvcihsZXQgY2lkIGluIG5ld2MpeyBvbGRjW2NpZF0gPSBuZXdjW2NpZF0gfVxuICAgICAgZGlmZltDT01QT05FTlRTXSA9IG5ld2NcbiAgICB9XG4gIH1cblxuICBjYWNoZWRGaW5kQ29tcG9uZW50KGNpZCwgY2RpZmYsIG9sZGMsIG5ld2MsIGNhY2hlKXtcbiAgICBpZihjYWNoZVtjaWRdKXtcbiAgICAgIHJldHVybiBjYWNoZVtjaWRdXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZGlmZiwgc3RhdCwgc2NpZCA9IGNkaWZmW1NUQVRJQ11cblxuICAgICAgaWYoaXNDaWQoc2NpZCkpe1xuICAgICAgICBsZXQgdGRpZmZcblxuICAgICAgICBpZihzY2lkID4gMCl7XG4gICAgICAgICAgdGRpZmYgPSB0aGlzLmNhY2hlZEZpbmRDb21wb25lbnQoc2NpZCwgbmV3Y1tzY2lkXSwgb2xkYywgbmV3YywgY2FjaGUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGRpZmYgPSBvbGRjWy1zY2lkXVxuICAgICAgICB9XG5cbiAgICAgICAgc3RhdCA9IHRkaWZmW1NUQVRJQ11cbiAgICAgICAgbmRpZmYgPSB0aGlzLmNsb25lTWVyZ2UodGRpZmYsIGNkaWZmLCB0cnVlKVxuICAgICAgICBuZGlmZltTVEFUSUNdID0gc3RhdFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmRpZmYgPSBjZGlmZltTVEFUSUNdICE9PSB1bmRlZmluZWQgfHwgb2xkY1tjaWRdID09PSB1bmRlZmluZWQgP1xuICAgICAgICAgIGNkaWZmIDogdGhpcy5jbG9uZU1lcmdlKG9sZGNbY2lkXSwgY2RpZmYsIGZhbHNlKVxuICAgICAgfVxuXG4gICAgICBjYWNoZVtjaWRdID0gbmRpZmZcbiAgICAgIHJldHVybiBuZGlmZlxuICAgIH1cbiAgfVxuXG4gIG11dGFibGVNZXJnZSh0YXJnZXQsIHNvdXJjZSl7XG4gICAgaWYoc291cmNlW1NUQVRJQ10gIT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gc291cmNlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9NdXRhYmxlTWVyZ2UodGFyZ2V0LCBzb3VyY2UpXG4gICAgICByZXR1cm4gdGFyZ2V0XG4gICAgfVxuICB9XG5cbiAgZG9NdXRhYmxlTWVyZ2UodGFyZ2V0LCBzb3VyY2Upe1xuICAgIGZvcihsZXQga2V5IGluIHNvdXJjZSl7XG4gICAgICBsZXQgdmFsID0gc291cmNlW2tleV1cbiAgICAgIGxldCB0YXJnZXRWYWwgPSB0YXJnZXRba2V5XVxuICAgICAgbGV0IGlzT2JqVmFsID0gaXNPYmplY3QodmFsKVxuICAgICAgaWYoaXNPYmpWYWwgJiYgdmFsW1NUQVRJQ10gPT09IHVuZGVmaW5lZCAmJiBpc09iamVjdCh0YXJnZXRWYWwpKXtcbiAgICAgICAgdGhpcy5kb011dGFibGVNZXJnZSh0YXJnZXRWYWwsIHZhbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gdmFsXG4gICAgICB9XG4gICAgfVxuICAgIGlmKHRhcmdldFtST09UXSl7XG4gICAgICB0YXJnZXQubmV3UmVuZGVyID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIC8vIE1lcmdlcyBjaWQgdHJlZXMgdG9nZXRoZXIsIGNvcHlpbmcgc3RhdGljcyBmcm9tIHNvdXJjZSB0cmVlLlxuICAvL1xuICAvLyBUaGUgYHBydW5lTWFnaWNJZGAgaXMgcGFzc2VkIHRvIGNvbnRyb2wgcHJ1bmluZyB0aGUgbWFnaWNJZCBvZiB0aGVcbiAgLy8gdGFyZ2V0LiBXZSBtdXN0IGFsd2F5cyBwcnVuZSB0aGUgbWFnaWNJZCB3aGVuIHdlIGFyZSBzaGFyaW5nIHN0YXRpY3NcbiAgLy8gZnJvbSBhbm90aGVyIGNvbXBvbmVudC4gSWYgbm90IHBydW5pbmcsIHdlIHJlcGxpY2F0ZSB0aGUgbG9naWMgZnJvbVxuICAvLyBtdXRhYmxlTWVyZ2UsIHdoZXJlIHdlIHNldCBuZXdSZW5kZXIgdG8gdHJ1ZSBpZiB0aGVyZSBpcyBhIHJvb3RcbiAgLy8gKGVmZmVjdGl2ZWx5IGZvcmNpbmcgdGhlIG5ldyB2ZXJzaW9uIHRvIGJlIHJlbmRlcmVkIGluc3RlYWQgb2Ygc2tpcHBlZClcbiAgLy9cbiAgY2xvbmVNZXJnZSh0YXJnZXQsIHNvdXJjZSwgcHJ1bmVNYWdpY0lkKXtcbiAgICBsZXQgbWVyZ2VkID0gey4uLnRhcmdldCwgLi4uc291cmNlfVxuICAgIGZvcihsZXQga2V5IGluIG1lcmdlZCl7XG4gICAgICBsZXQgdmFsID0gc291cmNlW2tleV1cbiAgICAgIGxldCB0YXJnZXRWYWwgPSB0YXJnZXRba2V5XVxuICAgICAgaWYoaXNPYmplY3QodmFsKSAmJiB2YWxbU1RBVElDXSA9PT0gdW5kZWZpbmVkICYmIGlzT2JqZWN0KHRhcmdldFZhbCkpe1xuICAgICAgICBtZXJnZWRba2V5XSA9IHRoaXMuY2xvbmVNZXJnZSh0YXJnZXRWYWwsIHZhbCwgcHJ1bmVNYWdpY0lkKVxuICAgICAgfSBlbHNlIGlmKHZhbCA9PT0gdW5kZWZpbmVkICYmIGlzT2JqZWN0KHRhcmdldFZhbCkpe1xuICAgICAgICBtZXJnZWRba2V5XSA9IHRoaXMuY2xvbmVNZXJnZSh0YXJnZXRWYWwsIHt9LCBwcnVuZU1hZ2ljSWQpXG4gICAgICB9XG4gICAgfVxuICAgIGlmKHBydW5lTWFnaWNJZCl7XG4gICAgICBkZWxldGUgbWVyZ2VkLm1hZ2ljSWRcbiAgICAgIGRlbGV0ZSBtZXJnZWQubmV3UmVuZGVyXG4gICAgfSBlbHNlIGlmKHRhcmdldFtST09UXSl7XG4gICAgICBtZXJnZWQubmV3UmVuZGVyID0gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VkXG4gIH1cblxuICBjb21wb25lbnRUb1N0cmluZyhjaWQpe1xuICAgIGxldCBbc3RyLCBzdHJlYW1zXSA9IHRoaXMucmVjdXJzaXZlQ0lEVG9TdHJpbmcodGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSwgY2lkLCBudWxsKVxuICAgIGxldCBbc3RyaXBwZWRIVE1MLCBfYmVmb3JlLCBfYWZ0ZXJdID0gbW9kaWZ5Um9vdChzdHIsIHt9KVxuICAgIHJldHVybiBbc3RyaXBwZWRIVE1MLCBzdHJlYW1zXVxuICB9XG5cbiAgcHJ1bmVDSURzKGNpZHMpe1xuICAgIGNpZHMuZm9yRWFjaChjaWQgPT4gZGVsZXRlIHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU11bY2lkXSlcbiAgfVxuXG4gIC8vIHByaXZhdGVcblxuICBnZXQoKXsgcmV0dXJuIHRoaXMucmVuZGVyZWQgfVxuXG4gIGlzTmV3RmluZ2VycHJpbnQoZGlmZiA9IHt9KXsgcmV0dXJuICEhZGlmZltTVEFUSUNdIH1cblxuICB0ZW1wbGF0ZVN0YXRpYyhwYXJ0LCB0ZW1wbGF0ZXMpe1xuICAgIGlmKHR5cGVvZiAocGFydCkgPT09IFwibnVtYmVyXCIpe1xuICAgICAgcmV0dXJuIHRlbXBsYXRlc1twYXJ0XVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFydFxuICAgIH1cbiAgfVxuXG4gIG5leHRNYWdpY0lEKCl7XG4gICAgdGhpcy5tYWdpY0lkKytcbiAgICByZXR1cm4gYG0ke3RoaXMubWFnaWNJZH0tJHt0aGlzLnBhcmVudFZpZXdJZCgpfWBcbiAgfVxuXG4gIC8vIENvbnZlcnRzIHJlbmRlcmVkIHRyZWUgdG8gb3V0cHV0IGJ1ZmZlci5cbiAgLy9cbiAgLy8gY2hhbmdlVHJhY2tpbmcgY29udHJvbHMgaWYgd2UgY2FuIGFwcGx5IHRoZSBQSFhfU0tJUCBvcHRpbWl6YXRpb24uXG4gIC8vIEl0IGlzIGRpc2FibGVkIGZvciBjb21wcmVoZW5zaW9ucyBzaW5jZSB3ZSBtdXN0IHJlLXJlbmRlciB0aGUgZW50aXJlIGNvbGxlY3Rpb25cbiAgLy8gYW5kIG5vIGluZGl2aWR1YWwgZWxlbWVudCBpcyB0cmFja2VkIGluc2lkZSB0aGUgY29tcHJlaGVuc2lvbi5cbiAgdG9PdXRwdXRCdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0LCBjaGFuZ2VUcmFja2luZywgcm9vdEF0dHJzID0ge30pe1xuICAgIGlmKHJlbmRlcmVkW0RZTkFNSUNTXSl7IHJldHVybiB0aGlzLmNvbXByZWhlbnNpb25Ub0J1ZmZlcihyZW5kZXJlZCwgdGVtcGxhdGVzLCBvdXRwdXQpIH1cbiAgICBsZXQge1tTVEFUSUNdOiBzdGF0aWNzfSA9IHJlbmRlcmVkXG4gICAgc3RhdGljcyA9IHRoaXMudGVtcGxhdGVTdGF0aWMoc3RhdGljcywgdGVtcGxhdGVzKVxuICAgIGxldCBpc1Jvb3QgPSByZW5kZXJlZFtST09UXVxuICAgIGxldCBwcmV2QnVmZmVyID0gb3V0cHV0LmJ1ZmZlclxuICAgIGlmKGlzUm9vdCl7IG91dHB1dC5idWZmZXIgPSBcIlwiIH1cblxuICAgIC8vIHRoaXMgY29uZGl0aW9uIGlzIGNhbGxlZCB3aGVuIGZpcnN0IHJlbmRlcmluZyBhbiBvcHRpbWl6YWJsZSBmdW5jdGlvbiBjb21wb25lbnQuXG4gICAgLy8gTEMgaGF2ZSB0aGVpciBtYWdpY0lkIHByZXZpb3VzbHkgc2V0XG4gICAgaWYoY2hhbmdlVHJhY2tpbmcgJiYgaXNSb290ICYmICFyZW5kZXJlZC5tYWdpY0lkKXtcbiAgICAgIHJlbmRlcmVkLm5ld1JlbmRlciA9IHRydWVcbiAgICAgIHJlbmRlcmVkLm1hZ2ljSWQgPSB0aGlzLm5leHRNYWdpY0lEKClcbiAgICB9XG5cbiAgICBvdXRwdXQuYnVmZmVyICs9IHN0YXRpY3NbMF1cbiAgICBmb3IobGV0IGkgPSAxOyBpIDwgc3RhdGljcy5sZW5ndGg7IGkrKyl7XG4gICAgICB0aGlzLmR5bmFtaWNUb0J1ZmZlcihyZW5kZXJlZFtpIC0gMV0sIHRlbXBsYXRlcywgb3V0cHV0LCBjaGFuZ2VUcmFja2luZylcbiAgICAgIG91dHB1dC5idWZmZXIgKz0gc3RhdGljc1tpXVxuICAgIH1cblxuICAgIC8vIEFwcGxpZXMgdGhlIHJvb3QgdGFnIFwic2tpcFwiIG9wdGltaXphdGlvbiBpZiBzdXBwb3J0ZWQsIHdoaWNoIGNsZWFyc1xuICAgIC8vIHRoZSByb290IHRhZyBhdHRyaWJ1dGVzIGFuZCBpbm5lckhUTUwsIGFuZCBvbmx5IG1haW50YWlucyB0aGUgbWFnaWNJZC5cbiAgICAvLyBXZSBjYW4gb25seSBza2lwIHdoZW4gY2hhbmdlVHJhY2tpbmcgaXMgc3VwcG9ydGVkIChvdXRzaWRlIG9mIGEgY29tcHJlaGVuc2lvbiksXG4gICAgLy8gYW5kIHdoZW4gdGhlIHJvb3QgZWxlbWVudCBoYXNuJ3QgZXhwZXJpZW5jZWQgYW4gdW5yZW5kZXJlZCBtZXJnZSAobmV3UmVuZGVyIHRydWUpLlxuICAgIGlmKGlzUm9vdCl7XG4gICAgICBsZXQgc2tpcCA9IGZhbHNlXG4gICAgICBsZXQgYXR0cnNcbiAgICAgIC8vIFdoZW4gYSBMQyBpcyByZS1hZGRlZCB0byB0aGUgcGFnZSwgd2UgbmVlZCB0byByZS1yZW5kZXIgdGhlIGVudGlyZSBMQyB0cmVlLFxuICAgICAgLy8gdGhlcmVmb3JlIGNoYW5nZVRyYWNraW5nIGlzIGZhbHNlOyBob3dldmVyLCB3ZSBuZWVkIHRvIGtlZXAgYWxsIHRoZSBtYWdpY0lkc1xuICAgICAgLy8gZnJvbSBhbnkgZnVuY3Rpb24gY29tcG9uZW50IHNvIHRoZSBuZXh0IHRpbWUgdGhlIExDIGlzIHVwZGF0ZWQsIHdlIGNhbiBhcHBseVxuICAgICAgLy8gdGhlIHNraXAgb3B0aW1pemF0aW9uXG4gICAgICBpZihjaGFuZ2VUcmFja2luZyB8fCByZW5kZXJlZC5tYWdpY0lkKXtcbiAgICAgICAgc2tpcCA9IGNoYW5nZVRyYWNraW5nICYmICFyZW5kZXJlZC5uZXdSZW5kZXJcbiAgICAgICAgYXR0cnMgPSB7W1BIWF9NQUdJQ19JRF06IHJlbmRlcmVkLm1hZ2ljSWQsIC4uLnJvb3RBdHRyc31cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0dHJzID0gcm9vdEF0dHJzXG4gICAgICB9XG4gICAgICBpZihza2lwKXsgYXR0cnNbUEhYX1NLSVBdID0gdHJ1ZSB9XG4gICAgICBsZXQgW25ld1Jvb3QsIGNvbW1lbnRCZWZvcmUsIGNvbW1lbnRBZnRlcl0gPSBtb2RpZnlSb290KG91dHB1dC5idWZmZXIsIGF0dHJzLCBza2lwKVxuICAgICAgcmVuZGVyZWQubmV3UmVuZGVyID0gZmFsc2VcbiAgICAgIG91dHB1dC5idWZmZXIgPSBwcmV2QnVmZmVyICsgY29tbWVudEJlZm9yZSArIG5ld1Jvb3QgKyBjb21tZW50QWZ0ZXJcbiAgICB9XG4gIH1cblxuICBjb21wcmVoZW5zaW9uVG9CdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0KXtcbiAgICBsZXQge1tEWU5BTUlDU106IGR5bmFtaWNzLCBbU1RBVElDXTogc3RhdGljcywgW1NUUkVBTV06IHN0cmVhbX0gPSByZW5kZXJlZFxuICAgIGxldCBbX3JlZiwgX2luc2VydHMsIGRlbGV0ZUlkcywgcmVzZXRdID0gc3RyZWFtIHx8IFtudWxsLCB7fSwgW10sIG51bGxdXG4gICAgc3RhdGljcyA9IHRoaXMudGVtcGxhdGVTdGF0aWMoc3RhdGljcywgdGVtcGxhdGVzKVxuICAgIGxldCBjb21wVGVtcGxhdGVzID0gdGVtcGxhdGVzIHx8IHJlbmRlcmVkW1RFTVBMQVRFU11cbiAgICBmb3IobGV0IGQgPSAwOyBkIDwgZHluYW1pY3MubGVuZ3RoOyBkKyspe1xuICAgICAgbGV0IGR5bmFtaWMgPSBkeW5hbWljc1tkXVxuICAgICAgb3V0cHV0LmJ1ZmZlciArPSBzdGF0aWNzWzBdXG4gICAgICBmb3IobGV0IGkgPSAxOyBpIDwgc3RhdGljcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIC8vIEluc2lkZSBhIGNvbXByZWhlbnNpb24sIHdlIGRvbid0IHRyYWNrIGhvdyBkeW5hbWljcyBjaGFuZ2VcbiAgICAgICAgLy8gb3ZlciB0aW1lIChhbmQgZmVhdHVyZXMgbGlrZSBzdHJlYW1zIHdvdWxkIG1ha2UgdGhhdCBpbXBvc3NpYmxlXG4gICAgICAgIC8vIHVubGVzcyB3ZSBtb3ZlIHRoZSBzdHJlYW0gZGlmZmluZyBhd2F5IGZyb20gbW9ycGhkb20pLFxuICAgICAgICAvLyBzbyB3ZSBjYW4ndCBwZXJmb3JtIHJvb3QgY2hhbmdlIHRyYWNraW5nLlxuICAgICAgICBsZXQgY2hhbmdlVHJhY2tpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLmR5bmFtaWNUb0J1ZmZlcihkeW5hbWljW2kgLSAxXSwgY29tcFRlbXBsYXRlcywgb3V0cHV0LCBjaGFuZ2VUcmFja2luZylcbiAgICAgICAgb3V0cHV0LmJ1ZmZlciArPSBzdGF0aWNzW2ldXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoc3RyZWFtICE9PSB1bmRlZmluZWQgJiYgKHJlbmRlcmVkW0RZTkFNSUNTXS5sZW5ndGggPiAwIHx8IGRlbGV0ZUlkcy5sZW5ndGggPiAwIHx8IHJlc2V0KSl7XG4gICAgICBkZWxldGUgcmVuZGVyZWRbU1RSRUFNXVxuICAgICAgcmVuZGVyZWRbRFlOQU1JQ1NdID0gW11cbiAgICAgIG91dHB1dC5zdHJlYW1zLmFkZChzdHJlYW0pXG4gICAgfVxuICB9XG5cbiAgZHluYW1pY1RvQnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCwgY2hhbmdlVHJhY2tpbmcpe1xuICAgIGlmKHR5cGVvZiAocmVuZGVyZWQpID09PSBcIm51bWJlclwiKXtcbiAgICAgIGxldCBbc3RyLCBzdHJlYW1zXSA9IHRoaXMucmVjdXJzaXZlQ0lEVG9TdHJpbmcob3V0cHV0LmNvbXBvbmVudHMsIHJlbmRlcmVkLCBvdXRwdXQub25seUNpZHMpXG4gICAgICBvdXRwdXQuYnVmZmVyICs9IHN0clxuICAgICAgb3V0cHV0LnN0cmVhbXMgPSBuZXcgU2V0KFsuLi5vdXRwdXQuc3RyZWFtcywgLi4uc3RyZWFtc10pXG4gICAgfSBlbHNlIGlmKGlzT2JqZWN0KHJlbmRlcmVkKSl7XG4gICAgICB0aGlzLnRvT3V0cHV0QnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCwgY2hhbmdlVHJhY2tpbmcsIHt9KVxuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQuYnVmZmVyICs9IHJlbmRlcmVkXG4gICAgfVxuICB9XG5cbiAgcmVjdXJzaXZlQ0lEVG9TdHJpbmcoY29tcG9uZW50cywgY2lkLCBvbmx5Q2lkcyl7XG4gICAgbGV0IGNvbXBvbmVudCA9IGNvbXBvbmVudHNbY2lkXSB8fCBsb2dFcnJvcihgbm8gY29tcG9uZW50IGZvciBDSUQgJHtjaWR9YCwgY29tcG9uZW50cylcbiAgICBsZXQgYXR0cnMgPSB7W1BIWF9DT01QT05FTlRdOiBjaWR9XG4gICAgbGV0IHNraXAgPSBvbmx5Q2lkcyAmJiAhb25seUNpZHMuaGFzKGNpZClcbiAgICAvLyBUd28gb3B0aW1pemF0aW9uIHBhdGhzIGFwcGx5IGhlcmU6XG4gICAgLy9cbiAgICAvLyAgIDEuIFRoZSBvbmx5Q2lkcyBvcHRpbWl6YXRpb24gd29ya3MgYnkgdGhlIHNlcnZlciBkaWZmIHRlbGxpbmcgdXMgb25seSBzcGVjaWZpY1xuICAgIC8vICAgICBjaWQncyBoYXZlIGNoYW5nZWQuIFRoaXMgYWxsb3dzIHVzIHRvIHNraXAgcmVuZGVyaW5nIGFueSBjb21wb25lbnQgdGhhdCBoYXNuJ3QgY2hhbmdlZCxcbiAgICAvLyAgICAgd2hpY2ggdWx0aW1hdGVseSBzZXRzIFBIWF9TS0lQIHJvb3QgYXR0cmlidXRlIGFuZCBhdm9pZHMgcmVuZGVyaW5nIHRoZSBpbm5lckhUTUwuXG4gICAgLy9cbiAgICAvLyAgIDIuIFRoZSByb290IFBIWF9TS0lQIG9wdGltaXphdGlvbiBnZW5lcmFsaXplcyB0byBhbGwgSEVFeCBmdW5jdGlvbiBjb21wb25lbnRzLCBhbmRcbiAgICAvLyAgICAgd29ya3MgaW4gdGhlIHNhbWUgUEhYX1NLSVAgYXR0cmlidXRlIGZhc2hpb24gYXMgMSwgYnV0IHRoZSBuZXdSZW5kZXIgdHJhY2tpbmcgaXMgZG9uZVxuICAgIC8vICAgICBhdCB0aGUgZ2VuZXJhbCBkaWZmIG1lcmdlIGxldmVsLiBJZiB3ZSBtZXJnZSBhIGRpZmYgd2l0aCBuZXcgZHluYW1pY3MsIHdlIG5lY2Vzc2FyaWx5IGhhdmVcbiAgICAvLyAgICAgZXhwZXJpZW5jZWQgYSBjaGFuZ2Ugd2hpY2ggbXVzdCBiZSBhIG5ld1JlbmRlciwgYW5kIHRodXMgd2UgY2FuJ3Qgc2tpcCB0aGUgcmVuZGVyLlxuICAgIC8vXG4gICAgLy8gQm90aCBvcHRpbWl6YXRpb24gZmxvd3MgYXBwbHkgaGVyZS4gbmV3UmVuZGVyIGlzIHNldCBiYXNlZCBvbiB0aGUgb25seUNpZHMgb3B0aW1pemF0aW9uLCBhbmRcbiAgICAvLyB3ZSB0cmFjayBhIGRldGVybWluaXN0aWMgbWFnaWNJZCBiYXNlZCBvbiB0aGUgY2lkLlxuICAgIC8vXG4gICAgLy8gY2hhbmdlVHJhY2tpbmcgaXMgYWJvdXQgdGhlIGVudGlyZSB0cmVlXG4gICAgLy8gbmV3UmVuZGVyIGlzIGFib3V0IHRoZSBjdXJyZW50IHJvb3QgaW4gdGhlIHRyZWVcbiAgICAvL1xuICAgIC8vIEJ5IGRlZmF1bHQgY2hhbmdlVHJhY2tpbmcgaXMgZW5hYmxlZCwgYnV0IHdlIHNwZWNpYWwgY2FzZSB0aGUgZmxvdyB3aGVyZSB0aGUgY2xpZW50IGlzIHBydW5pbmdcbiAgICAvLyBjaWRzIGFuZCB0aGUgc2VydmVyIGFkZHMgdGhlIGNvbXBvbmVudCBiYWNrLiBJbiBzdWNoIGNhc2VzLCB3ZSBleHBsaWNpdGx5IGRpc2FibGUgY2hhbmdlVHJhY2tpbmdcbiAgICAvLyB3aXRoIHJlc2V0UmVuZGVyIGZvciB0aGlzIGNpZCwgdGhlbiByZS1lbmFibGUgaXQgYWZ0ZXIgdGhlIHJlY3Vyc2l2ZSBjYWxsIHRvIHNraXAgdGhlIG9wdGltaXphdGlvblxuICAgIC8vIGZvciB0aGUgZW50aXJlIGNvbXBvbmVudCB0cmVlLlxuICAgIGNvbXBvbmVudC5uZXdSZW5kZXIgPSAhc2tpcFxuICAgIGNvbXBvbmVudC5tYWdpY0lkID0gYGMke2NpZH0tJHt0aGlzLnBhcmVudFZpZXdJZCgpfWBcbiAgICAvLyBlbmFibGUgY2hhbmdlIHRyYWNraW5nIGFzIGxvbmcgYXMgdGhlIGNvbXBvbmVudCBoYXNuJ3QgYmVlbiByZXNldFxuICAgIGxldCBjaGFuZ2VUcmFja2luZyA9ICFjb21wb25lbnQucmVzZXRcbiAgICBsZXQgW2h0bWwsIHN0cmVhbXNdID0gdGhpcy5yZWN1cnNpdmVUb1N0cmluZyhjb21wb25lbnQsIGNvbXBvbmVudHMsIG9ubHlDaWRzLCBjaGFuZ2VUcmFja2luZywgYXR0cnMpXG4gICAgLy8gZGlzYWJsZSByZXNldCBhZnRlciB3ZSd2ZSByZW5kZXJlZFxuICAgIGRlbGV0ZSBjb21wb25lbnQucmVzZXRcblxuICAgIHJldHVybiBbaHRtbCwgc3RyZWFtc11cbiAgfVxufVxuIiwgImltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcbmltcG9ydCBBUklBIGZyb20gXCIuL2FyaWFcIlxuXG5sZXQgZm9jdXNTdGFjayA9IFtdXG5sZXQgZGVmYXVsdF90cmFuc2l0aW9uX3RpbWUgPSAyMDBcblxubGV0IEpTID0ge1xuICAvLyBwcml2YXRlXG4gIGV4ZWMoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGRlZmF1bHRzKXtcbiAgICBsZXQgW2RlZmF1bHRLaW5kLCBkZWZhdWx0QXJnc10gPSBkZWZhdWx0cyB8fCBbbnVsbCwge2NhbGxiYWNrOiBkZWZhdWx0cyAmJiBkZWZhdWx0cy5jYWxsYmFja31dXG4gICAgbGV0IGNvbW1hbmRzID0gcGh4RXZlbnQuY2hhckF0KDApID09PSBcIltcIiA/XG4gICAgICBKU09OLnBhcnNlKHBoeEV2ZW50KSA6IFtbZGVmYXVsdEtpbmQsIGRlZmF1bHRBcmdzXV1cblxuICAgIGNvbW1hbmRzLmZvckVhY2goKFtraW5kLCBhcmdzXSkgPT4ge1xuICAgICAgaWYoa2luZCA9PT0gZGVmYXVsdEtpbmQpe1xuICAgICAgICAvLyBhbHdheXMgcHJlZmVyIHRoZSBhcmdzLCBidXQga2VlcCBleGlzdGluZyBrZXlzIGZyb20gdGhlIGRlZmF1bHRBcmdzXG4gICAgICAgIGFyZ3MgPSB7Li4uZGVmYXVsdEFyZ3MsIC4uLmFyZ3N9XG4gICAgICAgIGFyZ3MuY2FsbGJhY2sgPSBhcmdzLmNhbGxiYWNrIHx8IGRlZmF1bHRBcmdzLmNhbGxiYWNrXG4gICAgICB9XG4gICAgICB0aGlzLmZpbHRlclRvRWxzKHZpZXcubGl2ZVNvY2tldCwgc291cmNlRWwsIGFyZ3MpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICB0aGlzW2BleGVjXyR7a2luZH1gXShlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIGFyZ3MpXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgaXNWaXNpYmxlKGVsKXtcbiAgICByZXR1cm4gISEoZWwub2Zmc2V0V2lkdGggfHwgZWwub2Zmc2V0SGVpZ2h0IHx8IGVsLmdldENsaWVudFJlY3RzKCkubGVuZ3RoID4gMClcbiAgfSxcblxuICAvLyByZXR1cm5zIHRydWUgaWYgYW55IHBhcnQgb2YgdGhlIGVsZW1lbnQgaXMgaW5zaWRlIHRoZSB2aWV3cG9ydFxuICBpc0luVmlld3BvcnQoZWwpe1xuICAgIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGNvbnN0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gICAgY29uc3Qgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcblxuICAgIHJldHVybiAoXG4gICAgICByZWN0LnJpZ2h0ID4gMCAmJlxuICAgICAgcmVjdC5ib3R0b20gPiAwICYmXG4gICAgICByZWN0LmxlZnQgPCB3aW5kb3dXaWR0aCAmJlxuICAgICAgcmVjdC50b3AgPCB3aW5kb3dIZWlnaHRcbiAgICApXG4gIH0sXG5cbiAgLy8gcHJpdmF0ZVxuXG4gIC8vIGNvbW1hbmRzXG5cbiAgZXhlY19leGVjKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2F0dHIsIHRvfSl7XG4gICAgbGV0IGVuY29kZWRKUyA9IGVsLmdldEF0dHJpYnV0ZShhdHRyKVxuICAgIGlmKCFlbmNvZGVkSlMpeyB0aHJvdyBuZXcgRXJyb3IoYGV4cGVjdGVkICR7YXR0cn0gdG8gY29udGFpbiBKUyBjb21tYW5kIG9uIFwiJHt0b31cImApIH1cbiAgICB2aWV3LmxpdmVTb2NrZXQuZXhlY0pTKGVsLCBlbmNvZGVkSlMsIGV2ZW50VHlwZSlcbiAgfSxcblxuICBleGVjX2Rpc3BhdGNoKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2V2ZW50LCBkZXRhaWwsIGJ1YmJsZXN9KXtcbiAgICBkZXRhaWwgPSBkZXRhaWwgfHwge31cbiAgICBkZXRhaWwuZGlzcGF0Y2hlciA9IHNvdXJjZUVsXG4gICAgRE9NLmRpc3BhdGNoRXZlbnQoZWwsIGV2ZW50LCB7ZGV0YWlsLCBidWJibGVzfSlcbiAgfSxcblxuICBleGVjX3B1c2goZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCBhcmdzKXtcbiAgICBsZXQge2V2ZW50LCBkYXRhLCB0YXJnZXQsIHBhZ2VfbG9hZGluZywgbG9hZGluZywgdmFsdWUsIGRpc3BhdGNoZXIsIGNhbGxiYWNrfSA9IGFyZ3NcbiAgICBsZXQgcHVzaE9wdHMgPSB7bG9hZGluZywgdmFsdWUsIHRhcmdldCwgcGFnZV9sb2FkaW5nOiAhIXBhZ2VfbG9hZGluZ31cbiAgICBsZXQgdGFyZ2V0U3JjID0gZXZlbnRUeXBlID09PSBcImNoYW5nZVwiICYmIGRpc3BhdGNoZXIgPyBkaXNwYXRjaGVyIDogc291cmNlRWxcbiAgICBsZXQgcGh4VGFyZ2V0ID0gdGFyZ2V0IHx8IHRhcmdldFNyYy5nZXRBdHRyaWJ1dGUodmlldy5iaW5kaW5nKFwidGFyZ2V0XCIpKSB8fCB0YXJnZXRTcmNcbiAgICBjb25zdCBoYW5kbGVyID0gKHRhcmdldFZpZXcsIHRhcmdldEN0eCkgPT4ge1xuICAgICAgaWYoIXRhcmdldFZpZXcuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9XG4gICAgICBpZihldmVudFR5cGUgPT09IFwiY2hhbmdlXCIpe1xuICAgICAgICBsZXQge25ld0NpZCwgX3RhcmdldH0gPSBhcmdzXG4gICAgICAgIF90YXJnZXQgPSBfdGFyZ2V0IHx8IChET00uaXNGb3JtSW5wdXQoc291cmNlRWwpID8gc291cmNlRWwubmFtZSA6IHVuZGVmaW5lZClcbiAgICAgICAgaWYoX3RhcmdldCl7IHB1c2hPcHRzLl90YXJnZXQgPSBfdGFyZ2V0IH1cbiAgICAgICAgdGFyZ2V0Vmlldy5wdXNoSW5wdXQoc291cmNlRWwsIHRhcmdldEN0eCwgbmV3Q2lkLCBldmVudCB8fCBwaHhFdmVudCwgcHVzaE9wdHMsIGNhbGxiYWNrKVxuICAgICAgfSBlbHNlIGlmKGV2ZW50VHlwZSA9PT0gXCJzdWJtaXRcIil7XG4gICAgICAgIGxldCB7c3VibWl0dGVyfSA9IGFyZ3NcbiAgICAgICAgdGFyZ2V0Vmlldy5zdWJtaXRGb3JtKHNvdXJjZUVsLCB0YXJnZXRDdHgsIGV2ZW50IHx8IHBoeEV2ZW50LCBzdWJtaXR0ZXIsIHB1c2hPcHRzLCBjYWxsYmFjaylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFZpZXcucHVzaEV2ZW50KGV2ZW50VHlwZSwgc291cmNlRWwsIHRhcmdldEN0eCwgZXZlbnQgfHwgcGh4RXZlbnQsIGRhdGEsIHB1c2hPcHRzLCBjYWxsYmFjaylcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gaW4gY2FzZSBvZiBmb3JtUmVjb3ZlcnksIHRhcmdldFZpZXcgYW5kIHRhcmdldEN0eCBhcmUgcGFzc2VkIGFzIGFyZ3VtZW50XG4gICAgLy8gYXMgdGhleSBhcmUgbG9va2VkIHVwIGluIGEgdGVtcGxhdGUgZWxlbWVudCwgbm90IHRoZSByZWFsIERPTVxuICAgIGlmKGFyZ3MudGFyZ2V0VmlldyAmJiBhcmdzLnRhcmdldEN0eCl7XG4gICAgICBoYW5kbGVyKGFyZ3MudGFyZ2V0VmlldywgYXJncy50YXJnZXRDdHgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXcud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsIGhhbmRsZXIpXG4gICAgfVxuICB9LFxuXG4gIGV4ZWNfbmF2aWdhdGUoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7aHJlZiwgcmVwbGFjZX0pe1xuICAgIHZpZXcubGl2ZVNvY2tldC5oaXN0b3J5UmVkaXJlY3QoZSwgaHJlZiwgcmVwbGFjZSA/IFwicmVwbGFjZVwiIDogXCJwdXNoXCIsIG51bGwsIHNvdXJjZUVsKVxuICB9LFxuXG4gIGV4ZWNfcGF0Y2goZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7aHJlZiwgcmVwbGFjZX0pe1xuICAgIHZpZXcubGl2ZVNvY2tldC5wdXNoSGlzdG9yeVBhdGNoKGUsIGhyZWYsIHJlcGxhY2UgPyBcInJlcGxhY2VcIiA6IFwicHVzaFwiLCBzb3VyY2VFbClcbiAgfSxcblxuICBleGVjX2ZvY3VzKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCl7XG4gICAgQVJJQS5hdHRlbXB0Rm9jdXMoZWwpXG4gICAgLy8gaW4gY2FzZSB0aGUgSlMuZm9jdXMgY29tbWFuZCBpcyBpbiBhIEpTLnNob3cvaGlkZS90b2dnbGUgY2hhaW4sIGZvciBzaG93IHdlIG5lZWRcbiAgICAvLyB0byB3YWl0IGZvciBKUy5zaG93IHRvIGhhdmUgdXBkYXRlZCB0aGUgZWxlbWVudCdzIGRpc3BsYXkgcHJvcGVydHkgKHNlZSBleGVjX3RvZ2dsZSlcbiAgICAvLyBidXQgdGhhdCBydW4gaW4gbmVzdGVkIGFuaW1hdGlvbiBmcmFtZXMsIHRoZXJlZm9yZSB3ZSBuZWVkIHRvIHVzZSB0aGVtIGhlcmUgYXMgd2VsbFxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBBUklBLmF0dGVtcHRGb2N1cyhlbCkpXG4gICAgfSlcbiAgfSxcblxuICBleGVjX2ZvY3VzX2ZpcnN0KGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCl7XG4gICAgQVJJQS5mb2N1c0ZpcnN0SW50ZXJhY3RpdmUoZWwpIHx8IEFSSUEuZm9jdXNGaXJzdChlbClcbiAgICAvLyBpZiB5b3Ugd29uZGVyIGFib3V0IHRoZSBuZXN0ZWQgYW5pbWF0aW9uIGZyYW1lcywgc2VlIGV4ZWNfZm9jdXNcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gQVJJQS5mb2N1c0ZpcnN0SW50ZXJhY3RpdmUoZWwpIHx8IEFSSUEuZm9jdXNGaXJzdChlbCkpXG4gICAgfSlcbiAgfSxcblxuICBleGVjX3B1c2hfZm9jdXMoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsKXtcbiAgICBmb2N1c1N0YWNrLnB1c2goZWwgfHwgc291cmNlRWwpXG4gIH0sXG5cbiAgZXhlY19wb3BfZm9jdXMoX2UsIF9ldmVudFR5cGUsIF9waHhFdmVudCwgX3ZpZXcsIF9zb3VyY2VFbCwgX2VsKXtcbiAgICBjb25zdCBlbCA9IGZvY3VzU3RhY2sucG9wKClcbiAgICBpZihlbCl7XG4gICAgICBlbC5mb2N1cygpXG4gICAgICAvLyBpZiB5b3Ugd29uZGVyIGFib3V0IHRoZSBuZXN0ZWQgYW5pbWF0aW9uIGZyYW1lcywgc2VlIGV4ZWNfZm9jdXNcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IGVsLmZvY3VzKCkpXG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICBleGVjX2FkZF9jbGFzcyhlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtuYW1lcywgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgbmFtZXMsIFtdLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3JlbW92ZV9jbGFzcyhlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtuYW1lcywgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgW10sIG5hbWVzLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3RvZ2dsZV9jbGFzcyhlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtuYW1lcywgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLnRvZ2dsZUNsYXNzZXMoZWwsIG5hbWVzLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3RvZ2dsZV9hdHRyKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2F0dHI6IFthdHRyLCB2YWwxLCB2YWwyXX0pe1xuICAgIHRoaXMudG9nZ2xlQXR0cihlbCwgYXR0ciwgdmFsMSwgdmFsMilcbiAgfSxcblxuICBleGVjX3RyYW5zaXRpb24oZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7dGltZSwgdHJhbnNpdGlvbiwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgW10sIFtdLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3RvZ2dsZShlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtkaXNwbGF5LCBpbnMsIG91dHMsIHRpbWUsIGJsb2NraW5nfSl7XG4gICAgdGhpcy50b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgaW5zLCBvdXRzLCB0aW1lLCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3Nob3coZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7ZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLnNob3coZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmcpXG4gIH0sXG5cbiAgZXhlY19oaWRlKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2Rpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nfSl7XG4gICAgdGhpcy5oaWRlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nKVxuICB9LFxuXG4gIGV4ZWNfc2V0X2F0dHIoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7YXR0cjogW2F0dHIsIHZhbF19KXtcbiAgICB0aGlzLnNldE9yUmVtb3ZlQXR0cnMoZWwsIFtbYXR0ciwgdmFsXV0sIFtdKVxuICB9LFxuXG4gIGV4ZWNfcmVtb3ZlX2F0dHIoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7YXR0cn0pe1xuICAgIHRoaXMuc2V0T3JSZW1vdmVBdHRycyhlbCwgW10sIFthdHRyXSlcbiAgfSxcblxuICAvLyB1dGlscyBmb3IgY29tbWFuZHNcblxuICBzaG93KGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nKXtcbiAgICBpZighdGhpcy5pc1Zpc2libGUoZWwpKXtcbiAgICAgIHRoaXMudG9nZ2xlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIG51bGwsIHRpbWUsIGJsb2NraW5nKVxuICAgIH1cbiAgfSxcblxuICBoaWRlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nKXtcbiAgICBpZih0aGlzLmlzVmlzaWJsZShlbCkpe1xuICAgICAgdGhpcy50b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgbnVsbCwgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmcpXG4gICAgfVxuICB9LFxuXG4gIHRvZ2dsZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCBpbnMsIG91dHMsIHRpbWUsIGJsb2NraW5nKXtcbiAgICB0aW1lID0gdGltZSB8fCBkZWZhdWx0X3RyYW5zaXRpb25fdGltZVxuICAgIGxldCBbaW5DbGFzc2VzLCBpblN0YXJ0Q2xhc3NlcywgaW5FbmRDbGFzc2VzXSA9IGlucyB8fCBbW10sIFtdLCBbXV1cbiAgICBsZXQgW291dENsYXNzZXMsIG91dFN0YXJ0Q2xhc3Nlcywgb3V0RW5kQ2xhc3Nlc10gPSBvdXRzIHx8IFtbXSwgW10sIFtdXVxuICAgIGlmKGluQ2xhc3Nlcy5sZW5ndGggPiAwIHx8IG91dENsYXNzZXMubGVuZ3RoID4gMCl7XG4gICAgICBpZih0aGlzLmlzVmlzaWJsZShlbCkpe1xuICAgICAgICBsZXQgb25TdGFydCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgb3V0U3RhcnRDbGFzc2VzLCBpbkNsYXNzZXMuY29uY2F0KGluU3RhcnRDbGFzc2VzKS5jb25jYXQoaW5FbmRDbGFzc2VzKSlcbiAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBvdXRDbGFzc2VzLCBbXSlcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIG91dEVuZENsYXNzZXMsIG91dFN0YXJ0Q2xhc3NlcykpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBsZXQgb25FbmQgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBvdXRDbGFzc2VzLmNvbmNhdChvdXRFbmRDbGFzc2VzKSlcbiAgICAgICAgICBET00ucHV0U3RpY2t5KGVsLCBcInRvZ2dsZVwiLCBjdXJyZW50RWwgPT4gY3VycmVudEVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIilcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpoaWRlLWVuZFwiKSlcbiAgICAgICAgfVxuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpoaWRlLXN0YXJ0XCIpKVxuICAgICAgICBpZihibG9ja2luZyA9PT0gZmFsc2Upe1xuICAgICAgICAgIG9uU3RhcnQoKVxuICAgICAgICAgIHNldFRpbWVvdXQob25FbmQsIHRpbWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmlldy50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRW5kKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZihldmVudFR5cGUgPT09IFwicmVtb3ZlXCIpeyByZXR1cm4gfVxuICAgICAgICBsZXQgb25TdGFydCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgaW5TdGFydENsYXNzZXMsIG91dENsYXNzZXMuY29uY2F0KG91dFN0YXJ0Q2xhc3NlcykuY29uY2F0KG91dEVuZENsYXNzZXMpKVxuICAgICAgICAgIGNvbnN0IHN0aWNreURpc3BsYXkgPSBkaXNwbGF5IHx8IHRoaXMuZGVmYXVsdERpc3BsYXkoZWwpXG4gICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAvLyBmaXJzdCBhZGQgdGhlIHN0YXJ0aW5nICsgYWN0aXZlIGNsYXNzLCBUSEVOIG1ha2UgdGhlIGVsZW1lbnQgdmlzaWJsZVxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIGlmIHdlIHRvZ2dsZWQgdGhlIHZpc2liaWxpdHkgZWFybGllciBjc3MgYW5pbWF0aW9uc1xuICAgICAgICAgICAgLy8gd291bGQgZmxpY2tlciwgYXMgdGhlIGVsZW1lbnQgYmVjb21lcyB2aXNpYmxlIGJlZm9yZSB0aGUgYWN0aXZlIGFuaW1hdGlvblxuICAgICAgICAgICAgLy8gY2xhc3MgaXMgc2V0IChzZWUgaHR0cHM6Ly9naXRodWIuY29tL3Bob2VuaXhmcmFtZXdvcmsvcGhvZW5peF9saXZlX3ZpZXcvaXNzdWVzLzM0NTYpXG4gICAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgaW5DbGFzc2VzLCBbXSlcbiAgICAgICAgICAgIC8vIGFkZE9yUmVtb3ZlQ2xhc3NlcyB1c2VzIGEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGl0c2VsZiwgdGhlcmVmb3JlIHdlIG5lZWQgdG8gbW92ZSB0aGUgcHV0U3RpY2t5XG4gICAgICAgICAgICAvLyBpbnRvIHRoZSBuZXh0IHJlcXVlc3RBbmltYXRpb25GcmFtZS4uLlxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgIERPTS5wdXRTdGlja3koZWwsIFwidG9nZ2xlXCIsIGN1cnJlbnRFbCA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IHN0aWNreURpc3BsYXkpXG4gICAgICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBpbkVuZENsYXNzZXMsIGluU3RhcnRDbGFzc2VzKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGxldCBvbkVuZCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgW10sIGluQ2xhc3Nlcy5jb25jYXQoaW5FbmRDbGFzc2VzKSlcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LWVuZFwiKSlcbiAgICAgICAgfVxuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LXN0YXJ0XCIpKVxuICAgICAgICBpZihibG9ja2luZyA9PT0gZmFsc2Upe1xuICAgICAgICAgIG9uU3RhcnQoKVxuICAgICAgICAgIHNldFRpbWVvdXQob25FbmQsIHRpbWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmlldy50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRW5kKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKHRoaXMuaXNWaXNpYmxlKGVsKSl7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OmhpZGUtc3RhcnRcIikpXG4gICAgICAgICAgRE9NLnB1dFN0aWNreShlbCwgXCJ0b2dnbGVcIiwgY3VycmVudEVsID0+IGN1cnJlbnRFbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCIpXG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6aGlkZS1lbmRcIikpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LXN0YXJ0XCIpKVxuICAgICAgICAgIGxldCBzdGlja3lEaXNwbGF5ID0gZGlzcGxheSB8fCB0aGlzLmRlZmF1bHREaXNwbGF5KGVsKVxuICAgICAgICAgIERPTS5wdXRTdGlja3koZWwsIFwidG9nZ2xlXCIsIGN1cnJlbnRFbCA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IHN0aWNreURpc3BsYXkpXG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6c2hvdy1lbmRcIikpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHRvZ2dsZUNsYXNzZXMoZWwsIGNsYXNzZXMsIHRyYW5zaXRpb24sIHRpbWUsIHZpZXcsIGJsb2NraW5nKXtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGxldCBbcHJldkFkZHMsIHByZXZSZW1vdmVzXSA9IERPTS5nZXRTdGlja3koZWwsIFwiY2xhc3Nlc1wiLCBbW10sIFtdXSlcbiAgICAgIGxldCBuZXdBZGRzID0gY2xhc3Nlcy5maWx0ZXIobmFtZSA9PiBwcmV2QWRkcy5pbmRleE9mKG5hbWUpIDwgMCAmJiAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpKVxuICAgICAgbGV0IG5ld1JlbW92ZXMgPSBjbGFzc2VzLmZpbHRlcihuYW1lID0+IHByZXZSZW1vdmVzLmluZGV4T2YobmFtZSkgPCAwICYmIGVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKSlcbiAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBuZXdBZGRzLCBuZXdSZW1vdmVzLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgICB9KVxuICB9LFxuXG4gIHRvZ2dsZUF0dHIoZWwsIGF0dHIsIHZhbDEsIHZhbDIpe1xuICAgIGlmKGVsLmhhc0F0dHJpYnV0ZShhdHRyKSl7XG4gICAgICBpZih2YWwyICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAvLyB0b2dnbGUgYmV0d2VlbiB2YWwxIGFuZCB2YWwyXG4gICAgICAgIGlmKGVsLmdldEF0dHJpYnV0ZShhdHRyKSA9PT0gdmFsMSl7XG4gICAgICAgICAgdGhpcy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbW2F0dHIsIHZhbDJdXSwgW10pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbW2F0dHIsIHZhbDFdXSwgW10pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJlbW92ZSBhdHRyXG4gICAgICAgIHRoaXMuc2V0T3JSZW1vdmVBdHRycyhlbCwgW10sIFthdHRyXSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbW2F0dHIsIHZhbDFdXSwgW10pXG4gICAgfVxuICB9LFxuXG4gIGFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgYWRkcywgcmVtb3ZlcywgdHJhbnNpdGlvbiwgdGltZSwgdmlldywgYmxvY2tpbmcpe1xuICAgIHRpbWUgPSB0aW1lIHx8IGRlZmF1bHRfdHJhbnNpdGlvbl90aW1lXG4gICAgbGV0IFt0cmFuc2l0aW9uUnVuLCB0cmFuc2l0aW9uU3RhcnQsIHRyYW5zaXRpb25FbmRdID0gdHJhbnNpdGlvbiB8fCBbW10sIFtdLCBbXV1cbiAgICBpZih0cmFuc2l0aW9uUnVuLmxlbmd0aCA+IDApe1xuICAgICAgbGV0IG9uU3RhcnQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uU3RhcnQsIFtdLmNvbmNhdCh0cmFuc2l0aW9uUnVuKS5jb25jYXQodHJhbnNpdGlvbkVuZCkpXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uUnVuLCBbXSlcbiAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uRW5kLCB0cmFuc2l0aW9uU3RhcnQpKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgbGV0IG9uRG9uZSA9ICgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBhZGRzLmNvbmNhdCh0cmFuc2l0aW9uRW5kKSwgcmVtb3Zlcy5jb25jYXQodHJhbnNpdGlvblJ1bikuY29uY2F0KHRyYW5zaXRpb25TdGFydCkpXG4gICAgICBpZihibG9ja2luZyA9PT0gZmFsc2Upe1xuICAgICAgICBvblN0YXJ0KClcbiAgICAgICAgc2V0VGltZW91dChvbkRvbmUsIHRpbWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWV3LnRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lKVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBsZXQgW3ByZXZBZGRzLCBwcmV2UmVtb3Zlc10gPSBET00uZ2V0U3RpY2t5KGVsLCBcImNsYXNzZXNcIiwgW1tdLCBbXV0pXG4gICAgICBsZXQga2VlcEFkZHMgPSBhZGRzLmZpbHRlcihuYW1lID0+IHByZXZBZGRzLmluZGV4T2YobmFtZSkgPCAwICYmICFlbC5jbGFzc0xpc3QuY29udGFpbnMobmFtZSkpXG4gICAgICBsZXQga2VlcFJlbW92ZXMgPSByZW1vdmVzLmZpbHRlcihuYW1lID0+IHByZXZSZW1vdmVzLmluZGV4T2YobmFtZSkgPCAwICYmIGVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKSlcbiAgICAgIGxldCBuZXdBZGRzID0gcHJldkFkZHMuZmlsdGVyKG5hbWUgPT4gcmVtb3Zlcy5pbmRleE9mKG5hbWUpIDwgMCkuY29uY2F0KGtlZXBBZGRzKVxuICAgICAgbGV0IG5ld1JlbW92ZXMgPSBwcmV2UmVtb3Zlcy5maWx0ZXIobmFtZSA9PiBhZGRzLmluZGV4T2YobmFtZSkgPCAwKS5jb25jYXQoa2VlcFJlbW92ZXMpXG5cbiAgICAgIERPTS5wdXRTdGlja3koZWwsIFwiY2xhc3Nlc1wiLCBjdXJyZW50RWwgPT4ge1xuICAgICAgICBjdXJyZW50RWwuY2xhc3NMaXN0LnJlbW92ZSguLi5uZXdSZW1vdmVzKVxuICAgICAgICBjdXJyZW50RWwuY2xhc3NMaXN0LmFkZCguLi5uZXdBZGRzKVxuICAgICAgICByZXR1cm4gW25ld0FkZHMsIG5ld1JlbW92ZXNdXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgc2V0T3JSZW1vdmVBdHRycyhlbCwgc2V0cywgcmVtb3Zlcyl7XG4gICAgbGV0IFtwcmV2U2V0cywgcHJldlJlbW92ZXNdID0gRE9NLmdldFN0aWNreShlbCwgXCJhdHRyc1wiLCBbW10sIFtdXSlcblxuICAgIGxldCBhbHRlcmVkQXR0cnMgPSBzZXRzLm1hcCgoW2F0dHIsIF92YWxdKSA9PiBhdHRyKS5jb25jYXQocmVtb3ZlcylcbiAgICBsZXQgbmV3U2V0cyA9IHByZXZTZXRzLmZpbHRlcigoW2F0dHIsIF92YWxdKSA9PiAhYWx0ZXJlZEF0dHJzLmluY2x1ZGVzKGF0dHIpKS5jb25jYXQoc2V0cylcbiAgICBsZXQgbmV3UmVtb3ZlcyA9IHByZXZSZW1vdmVzLmZpbHRlcigoYXR0cikgPT4gIWFsdGVyZWRBdHRycy5pbmNsdWRlcyhhdHRyKSkuY29uY2F0KHJlbW92ZXMpXG5cbiAgICBET00ucHV0U3RpY2t5KGVsLCBcImF0dHJzXCIsIGN1cnJlbnRFbCA9PiB7XG4gICAgICBuZXdSZW1vdmVzLmZvckVhY2goYXR0ciA9PiBjdXJyZW50RWwucmVtb3ZlQXR0cmlidXRlKGF0dHIpKVxuICAgICAgbmV3U2V0cy5mb3JFYWNoKChbYXR0ciwgdmFsXSkgPT4gY3VycmVudEVsLnNldEF0dHJpYnV0ZShhdHRyLCB2YWwpKVxuICAgICAgcmV0dXJuIFtuZXdTZXRzLCBuZXdSZW1vdmVzXVxuICAgIH0pXG4gIH0sXG5cbiAgaGFzQWxsQ2xhc3NlcyhlbCwgY2xhc3Nlcyl7IHJldHVybiBjbGFzc2VzLmV2ZXJ5KG5hbWUgPT4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpKSB9LFxuXG4gIGlzVG9nZ2xlZE91dChlbCwgb3V0Q2xhc3Nlcyl7XG4gICAgcmV0dXJuICF0aGlzLmlzVmlzaWJsZShlbCkgfHwgdGhpcy5oYXNBbGxDbGFzc2VzKGVsLCBvdXRDbGFzc2VzKVxuICB9LFxuXG4gIGZpbHRlclRvRWxzKGxpdmVTb2NrZXQsIHNvdXJjZUVsLCB7dG99KXtcbiAgICBsZXQgZGVmYXVsdFF1ZXJ5ID0gKCkgPT4ge1xuICAgICAgaWYodHlwZW9mKHRvKSA9PT0gXCJzdHJpbmdcIil7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRvKVxuICAgICAgfSBlbHNlIGlmKHRvLmNsb3Nlc3Qpe1xuICAgICAgICBsZXQgdG9FbCA9IHNvdXJjZUVsLmNsb3Nlc3QodG8uY2xvc2VzdClcbiAgICAgICAgcmV0dXJuIHRvRWwgPyBbdG9FbF0gOiBbXVxuICAgICAgfSBlbHNlIGlmKHRvLmlubmVyKXtcbiAgICAgICAgcmV0dXJuIHNvdXJjZUVsLnF1ZXJ5U2VsZWN0b3JBbGwodG8uaW5uZXIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0byA/IGxpdmVTb2NrZXQuanNRdWVyeVNlbGVjdG9yQWxsKHNvdXJjZUVsLCB0bywgZGVmYXVsdFF1ZXJ5KSA6IFtzb3VyY2VFbF1cbiAgfSxcblxuICBkZWZhdWx0RGlzcGxheShlbCl7XG4gICAgcmV0dXJuIHt0cjogXCJ0YWJsZS1yb3dcIiwgdGQ6IFwidGFibGUtY2VsbFwifVtlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCldIHx8IFwiYmxvY2tcIlxuICB9LFxuXG4gIHRyYW5zaXRpb25DbGFzc2VzKHZhbCl7XG4gICAgaWYoIXZhbCl7IHJldHVybiBudWxsIH1cblxuICAgIGxldCBbdHJhbnMsIHRTdGFydCwgdEVuZF0gPSBBcnJheS5pc0FycmF5KHZhbCkgPyB2YWwgOiBbdmFsLnNwbGl0KFwiIFwiKSwgW10sIFtdXVxuICAgIHRyYW5zID0gQXJyYXkuaXNBcnJheSh0cmFucykgPyB0cmFucyA6IHRyYW5zLnNwbGl0KFwiIFwiKVxuICAgIHRTdGFydCA9IEFycmF5LmlzQXJyYXkodFN0YXJ0KSA/IHRTdGFydCA6IHRTdGFydC5zcGxpdChcIiBcIilcbiAgICB0RW5kID0gQXJyYXkuaXNBcnJheSh0RW5kKSA/IHRFbmQgOiB0RW5kLnNwbGl0KFwiIFwiKVxuICAgIHJldHVybiBbdHJhbnMsIHRTdGFydCwgdEVuZF1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBKU1xuIiwgImltcG9ydCBKUyBmcm9tIFwiLi9qc1wiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5cbmNvbnN0IEhPT0tfSUQgPSBcImhvb2tJZFwiXG5cbmxldCB2aWV3SG9va0lEID0gMVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld0hvb2sge1xuICBzdGF0aWMgbWFrZUlEKCl7IHJldHVybiB2aWV3SG9va0lEKysgfVxuICBzdGF0aWMgZWxlbWVudElEKGVsKXsgcmV0dXJuIERPTS5wcml2YXRlKGVsLCBIT09LX0lEKSB9XG5cbiAgY29uc3RydWN0b3IodmlldywgZWwsIGNhbGxiYWNrcyl7XG4gICAgdGhpcy5lbCA9IGVsXG4gICAgdGhpcy5fX2F0dGFjaFZpZXcodmlldylcbiAgICB0aGlzLl9fY2FsbGJhY2tzID0gY2FsbGJhY2tzXG4gICAgdGhpcy5fX2xpc3RlbmVycyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlXG4gICAgRE9NLnB1dFByaXZhdGUodGhpcy5lbCwgSE9PS19JRCwgdGhpcy5jb25zdHJ1Y3Rvci5tYWtlSUQoKSlcbiAgICBmb3IobGV0IGtleSBpbiB0aGlzLl9fY2FsbGJhY2tzKXsgdGhpc1trZXldID0gdGhpcy5fX2NhbGxiYWNrc1trZXldIH1cbiAgfVxuXG4gIF9fYXR0YWNoVmlldyh2aWV3KXtcbiAgICBpZih2aWV3KXtcbiAgICAgIHRoaXMuX192aWV3ID0gKCkgPT4gdmlld1xuICAgICAgdGhpcy5saXZlU29ja2V0ID0gdmlldy5saXZlU29ja2V0XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX192aWV3ID0gKCkgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGhvb2sgbm90IHlldCBhdHRhY2hlZCB0byBhIGxpdmUgdmlldzogJHt0aGlzLmVsLm91dGVySFRNTH1gKVxuICAgICAgfVxuICAgICAgdGhpcy5saXZlU29ja2V0ID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIF9fbW91bnRlZCgpeyB0aGlzLm1vdW50ZWQgJiYgdGhpcy5tb3VudGVkKCkgfVxuICBfX3VwZGF0ZWQoKXsgdGhpcy51cGRhdGVkICYmIHRoaXMudXBkYXRlZCgpIH1cbiAgX19iZWZvcmVVcGRhdGUoKXsgdGhpcy5iZWZvcmVVcGRhdGUgJiYgdGhpcy5iZWZvcmVVcGRhdGUoKSB9XG4gIF9fZGVzdHJveWVkKCl7XG4gICAgdGhpcy5kZXN0cm95ZWQgJiYgdGhpcy5kZXN0cm95ZWQoKVxuICAgIERPTS5kZWxldGVQcml2YXRlKHRoaXMuZWwsIEhPT0tfSUQpIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9waG9lbml4ZnJhbWV3b3JrL3Bob2VuaXhfbGl2ZV92aWV3L2lzc3Vlcy8zNDk2XG4gIH1cbiAgX19yZWNvbm5lY3RlZCgpe1xuICAgIGlmKHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCl7XG4gICAgICB0aGlzLl9faXNEaXNjb25uZWN0ZWQgPSBmYWxzZVxuICAgICAgdGhpcy5yZWNvbm5lY3RlZCAmJiB0aGlzLnJlY29ubmVjdGVkKClcbiAgICB9XG4gIH1cbiAgX19kaXNjb25uZWN0ZWQoKXtcbiAgICB0aGlzLl9faXNEaXNjb25uZWN0ZWQgPSB0cnVlXG4gICAgdGhpcy5kaXNjb25uZWN0ZWQgJiYgdGhpcy5kaXNjb25uZWN0ZWQoKVxuICB9XG5cbiAgLyoqXG4gICAqIEJpbmRzIHRoZSBob29rIHRvIEpTIGNvbW1hbmRzLlxuICAgKlxuICAgKiBAcGFyYW0ge1ZpZXdIb29rfSBob29rIC0gVGhlIFZpZXdIb29rIGluc3RhbmNlIHRvIGJpbmQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEFuIG9iamVjdCB3aXRoIG1ldGhvZHMgdG8gbWFuaXB1bGF0ZSB0aGUgRE9NIGFuZCBleGVjdXRlIEphdmFTY3JpcHQuXG4gICAqL1xuICBqcygpe1xuICAgIGxldCBob29rID0gdGhpc1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogRXhlY3V0ZXMgZW5jb2RlZCBKYXZhU2NyaXB0IGluIHRoZSBjb250ZXh0IG9mIHRoZSBob29rIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGVuY29kZWRKUyAtIFRoZSBlbmNvZGVkIEphdmFTY3JpcHQgc3RyaW5nIHRvIGV4ZWN1dGUuXG4gICAgICAgKi9cbiAgICAgIGV4ZWMoZW5jb2RlZEpTKXtcbiAgICAgICAgaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0LmV4ZWNKUyhob29rLmVsLCBlbmNvZGVkSlMsIFwiaG9va1wiKVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBTaG93cyBhbiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGVsZW1lbnQgdG8gc2hvdy5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cz17fV0gLSBPcHRpb25hbCBzZXR0aW5ncy5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5kaXNwbGF5XSAtIFRoZSBDU1MgZGlzcGxheSB2YWx1ZSB0byBzZXQuIERlZmF1bHRzIFwiYmxvY2tcIi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy50cmFuc2l0aW9uXSAtIFRoZSBDU1MgdHJhbnNpdGlvbiBjbGFzc2VzIHRvIHNldCB3aGVuIHNob3dpbmcuXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdHMudGltZV0gLSBUaGUgdHJhbnNpdGlvbiBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMuIERlZmF1bHRzIDIwMC5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuYmxvY2tpbmddIC0gVGhlIGJvb2xlYW4gZmxhZyB0byBibG9jayB0aGUgVUkgZHVyaW5nIHRoZSB0cmFuc2l0aW9uLlxuICAgICAgICogIERlZmF1bHRzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgc2hvdyhlbCwgb3B0cyA9IHt9KXtcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy5zaG93KFwiaG9va1wiLCBvd25lciwgZWwsIG9wdHMuZGlzcGxheSwgb3B0cy50cmFuc2l0aW9uLCBvcHRzLnRpbWUsIG9wdHMuYmxvY2tpbmcpXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEhpZGVzIGFuIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byBoaWRlLlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzPXt9XSAtIE9wdGlvbmFsIHNldHRpbmdzLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLnRyYW5zaXRpb25dIC0gVGhlIENTUyB0cmFuc2l0aW9uIGNsYXNzZXMgdG8gc2V0IHdoZW4gaGlkaW5nLlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLiBEZWZhdWx0cyAyMDAuXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLmJsb2NraW5nXSAtIFRoZSBib29sZWFuIGZsYWcgdG8gYmxvY2sgdGhlIFVJIGR1cmluZyB0aGUgdHJhbnNpdGlvbi5cbiAgICAgICAqICAgRGVmYXVsdHMgYHRydWVgLlxuICAgICAgICovXG4gICAgICBoaWRlKGVsLCBvcHRzID0ge30pe1xuICAgICAgICBsZXQgb3duZXIgPSBob29rLl9fdmlldygpLmxpdmVTb2NrZXQub3duZXIoZWwpXG4gICAgICAgIEpTLmhpZGUoXCJob29rXCIsIG93bmVyLCBlbCwgbnVsbCwgb3B0cy50cmFuc2l0aW9uLCBvcHRzLnRpbWUsIG9wdHMuYmxvY2tpbmcpXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFRvZ2dsZXMgdGhlIHZpc2liaWxpdHkgb2YgYW4gZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBlbGVtZW50IHRvIHRvZ2dsZS5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cz17fV0gLSBPcHRpb25hbCBzZXR0aW5ncy5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5kaXNwbGF5XSAtIFRoZSBDU1MgZGlzcGxheSB2YWx1ZSB0byBzZXQuIERlZmF1bHRzIFwiYmxvY2tcIi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5pbl0gLSBUaGUgQ1NTIHRyYW5zaXRpb24gY2xhc3NlcyBmb3Igc2hvd2luZy5cbiAgICAgICAqICAgQWNjZXB0cyBlaXRoZXIgdGhlIHN0cmluZyBvZiBjbGFzc2VzIHRvIGFwcGx5IHdoZW4gdG9nZ2xpbmcgaW4sIG9yXG4gICAgICAgKiAgIGEgMy10dXBsZSBjb250YWluaW5nIHRoZSB0cmFuc2l0aW9uIGNsYXNzLCB0aGUgY2xhc3MgdG8gYXBwbHlcbiAgICAgICAqICAgdG8gc3RhcnQgdGhlIHRyYW5zaXRpb24sIGFuZCB0aGUgZW5kaW5nIHRyYW5zaXRpb24gY2xhc3MsIHN1Y2ggYXM6XG4gICAgICAgKlxuICAgICAgICogICAgICAgW1wiZWFzZS1vdXQgZHVyYXRpb24tMzAwXCIsIFwib3BhY2l0eS0wXCIsIFwib3BhY2l0eS0xMDBcIl1cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMub3V0XSAtIFRoZSBDU1MgdHJhbnNpdGlvbiBjbGFzc2VzIGZvciBoaWRpbmcuXG4gICAgICAgKiAgIEFjY2VwdHMgZWl0aGVyIHN0cmluZyBvZiBjbGFzc2VzIHRvIGFwcGx5IHdoZW4gdG9nZ2xpbmcgb3V0LCBvclxuICAgICAgICogICBhIDMtdHVwbGUgY29udGFpbmluZyB0aGUgdHJhbnNpdGlvbiBjbGFzcywgdGhlIGNsYXNzIHRvIGFwcGx5XG4gICAgICAgKiAgIHRvIHN0YXJ0IHRoZSB0cmFuc2l0aW9uLCBhbmQgdGhlIGVuZGluZyB0cmFuc2l0aW9uIGNsYXNzLCBzdWNoIGFzOlxuICAgICAgICpcbiAgICAgICAqICAgICAgIFtcImVhc2Utb3V0IGR1cmF0aW9uLTMwMFwiLCBcIm9wYWNpdHktMTAwXCIsIFwib3BhY2l0eS0wXCJdXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuYmxvY2tpbmddIC0gVGhlIGJvb2xlYW4gZmxhZyB0byBibG9jayB0aGUgVUkgZHVyaW5nIHRoZSB0cmFuc2l0aW9uLlxuICAgICAgICogICBEZWZhdWx0cyBgdHJ1ZWAuXG4gICAgICAgKi9cbiAgICAgIHRvZ2dsZShlbCwgb3B0cyA9IHt9KXtcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBvcHRzLmluID0gSlMudHJhbnNpdGlvbkNsYXNzZXMob3B0cy5pbilcbiAgICAgICAgb3B0cy5vdXQgPSBKUy50cmFuc2l0aW9uQ2xhc3NlcyhvcHRzLm91dClcbiAgICAgICAgSlMudG9nZ2xlKFwiaG9va1wiLCBvd25lciwgZWwsIG9wdHMuZGlzcGxheSwgb3B0cy5pbiwgb3B0cy5vdXQsIG9wdHMudGltZSwgb3B0cy5ibG9ja2luZylcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQWRkcyBDU1MgY2xhc3NlcyB0byBhbiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGVsZW1lbnQgdG8gYWRkIGNsYXNzZXMgdG8uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gbmFtZXMgLSBUaGUgY2xhc3MgbmFtZShzKSB0byBhZGQuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdHM9e31dIC0gT3B0aW9uYWwgc2V0dGluZ3MuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMudHJhbnNpdGlvbl0gLSBUaGUgQ1NTIHRyYW5zaXRpb24gcHJvcGVydHkgdG8gc2V0LlxuICAgICAgICogICBBY2NlcHRzIGEgc3RyaW5nIG9mIGNsYXNzZXMgdG8gYXBwbHkgd2hlbiBhZGRpbmcgY2xhc3NlcyBvclxuICAgICAgICogICBhIDMtdHVwbGUgY29udGFpbmluZyB0aGUgdHJhbnNpdGlvbiBjbGFzcywgdGhlIGNsYXNzIHRvIGFwcGx5XG4gICAgICAgKiAgIHRvIHN0YXJ0IHRoZSB0cmFuc2l0aW9uLCBhbmQgdGhlIGVuZGluZyB0cmFuc2l0aW9uIGNsYXNzLCBzdWNoIGFzOlxuICAgICAgICpcbiAgICAgICAqICAgICAgIFtcImVhc2Utb3V0IGR1cmF0aW9uLTMwMFwiLCBcIm9wYWNpdHktMFwiLCBcIm9wYWNpdHktMTAwXCJdXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5ibG9ja2luZ10gLSBUaGUgYm9vbGVhbiBmbGFnIHRvIGJsb2NrIHRoZSBVSSBkdXJpbmcgdGhlIHRyYW5zaXRpb24uXG4gICAgICAgKiAgIERlZmF1bHRzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgYWRkQ2xhc3MoZWwsIG5hbWVzLCBvcHRzID0ge30pe1xuICAgICAgICBuYW1lcyA9IEFycmF5LmlzQXJyYXkobmFtZXMpID8gbmFtZXMgOiBuYW1lcy5zcGxpdChcIiBcIilcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIG5hbWVzLCBbXSwgb3B0cy50cmFuc2l0aW9uLCBvcHRzLnRpbWUsIG93bmVyLCBvcHRzLmJsb2NraW5nKVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZW1vdmVzIENTUyBjbGFzc2VzIGZyb20gYW4gZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBlbGVtZW50IHRvIHJlbW92ZSBjbGFzc2VzIGZyb20uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gbmFtZXMgLSBUaGUgY2xhc3MgbmFtZShzKSB0byByZW1vdmUuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdHM9e31dIC0gT3B0aW9uYWwgc2V0dGluZ3MuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMudHJhbnNpdGlvbl0gLSBUaGUgQ1NTIHRyYW5zaXRpb24gY2xhc3NlcyB0byBzZXQuXG4gICAgICAgKiAgIEFjY2VwdHMgYSBzdHJpbmcgb2YgY2xhc3NlcyB0byBhcHBseSB3aGVuIHJlbW92aW5nIGNsYXNzZXMgb3JcbiAgICAgICAqICAgYSAzLXR1cGxlIGNvbnRhaW5pbmcgdGhlIHRyYW5zaXRpb24gY2xhc3MsIHRoZSBjbGFzcyB0byBhcHBseVxuICAgICAgICogICB0byBzdGFydCB0aGUgdHJhbnNpdGlvbiwgYW5kIHRoZSBlbmRpbmcgdHJhbnNpdGlvbiBjbGFzcywgc3VjaCBhczpcbiAgICAgICAqXG4gICAgICAgKiAgICAgICBbXCJlYXNlLW91dCBkdXJhdGlvbi0zMDBcIiwgXCJvcGFjaXR5LTEwMFwiLCBcIm9wYWNpdHktMFwiXVxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy50aW1lXSAtIFRoZSB0cmFuc2l0aW9uIGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcy5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuYmxvY2tpbmddIC0gVGhlIGJvb2xlYW4gZmxhZyB0byBibG9jayB0aGUgVUkgZHVyaW5nIHRoZSB0cmFuc2l0aW9uLlxuICAgICAgICogICBEZWZhdWx0cyBgdHJ1ZWAuXG4gICAgICAgKi9cbiAgICAgIHJlbW92ZUNsYXNzKGVsLCBuYW1lcywgb3B0cyA9IHt9KXtcbiAgICAgICAgb3B0cy50cmFuc2l0aW9uID0gSlMudHJhbnNpdGlvbkNsYXNzZXMob3B0cy50cmFuc2l0aW9uKVxuICAgICAgICBuYW1lcyA9IEFycmF5LmlzQXJyYXkobmFtZXMpID8gbmFtZXMgOiBuYW1lcy5zcGxpdChcIiBcIilcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBuYW1lcywgb3B0cy50cmFuc2l0aW9uLCBvcHRzLnRpbWUsIG93bmVyLCBvcHRzLmJsb2NraW5nKVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBUb2dnbGVzIENTUyBjbGFzc2VzIG9uIGFuIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byB0b2dnbGUgY2xhc3NlcyBvbi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBuYW1lcyAtIFRoZSBjbGFzcyBuYW1lKHMpIHRvIHRvZ2dsZS5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cz17fV0gLSBPcHRpb25hbCBzZXR0aW5ncy5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy50cmFuc2l0aW9uXSAtIFRoZSBDU1MgdHJhbnNpdGlvbiBjbGFzc2VzIHRvIHNldC5cbiAgICAgICAqICAgQWNjZXB0cyBhIHN0cmluZyBvZiBjbGFzc2VzIHRvIGFwcGx5IHdoZW4gdG9nZ2xpbmcgY2xhc3NlcyBvclxuICAgICAgICogICBhIDMtdHVwbGUgY29udGFpbmluZyB0aGUgdHJhbnNpdGlvbiBjbGFzcywgdGhlIGNsYXNzIHRvIGFwcGx5XG4gICAgICAgKiAgIHRvIHN0YXJ0IHRoZSB0cmFuc2l0aW9uLCBhbmQgdGhlIGVuZGluZyB0cmFuc2l0aW9uIGNsYXNzLCBzdWNoIGFzOlxuICAgICAgICpcbiAgICAgICAqICAgICAgIFtcImVhc2Utb3V0IGR1cmF0aW9uLTMwMFwiLCBcIm9wYWNpdHktMTAwXCIsIFwib3BhY2l0eS0wXCJdXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5ibG9ja2luZ10gLSBUaGUgYm9vbGVhbiBmbGFnIHRvIGJsb2NrIHRoZSBVSSBkdXJpbmcgdGhlIHRyYW5zaXRpb24uXG4gICAgICAgKiAgIERlZmF1bHRzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgdG9nZ2xlQ2xhc3MoZWwsIG5hbWVzLCBvcHRzID0ge30pe1xuICAgICAgICBvcHRzLnRyYW5zaXRpb24gPSBKUy50cmFuc2l0aW9uQ2xhc3NlcyhvcHRzLnRyYW5zaXRpb24pXG4gICAgICAgIG5hbWVzID0gQXJyYXkuaXNBcnJheShuYW1lcykgPyBuYW1lcyA6IG5hbWVzLnNwbGl0KFwiIFwiKVxuICAgICAgICBsZXQgb3duZXIgPSBob29rLl9fdmlldygpLmxpdmVTb2NrZXQub3duZXIoZWwpXG4gICAgICAgIEpTLnRvZ2dsZUNsYXNzZXMoZWwsIG5hbWVzLCBvcHRzLnRyYW5zaXRpb24sIG9wdHMudGltZSwgb3duZXIsIG9wdHMuYmxvY2tpbmcpXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEFwcGxpZXMgYSBDU1MgdHJhbnNpdGlvbiB0byBhbiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGVsZW1lbnQgdG8gYXBwbHkgdGhlIHRyYW5zaXRpb24gdG8uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gdHJhbnNpdGlvbiAtIFRoZSB0cmFuc2l0aW9uIGNsYXNzKGVzKSB0byBhcHBseS5cbiAgICAgICAqICAgQWNjZXB0cyBhIHN0cmluZyBvZiBjbGFzc2VzIHRvIGFwcGx5IHdoZW4gdHJhbnNpdGlvbmluZyBvclxuICAgICAgICogICBhIDMtdHVwbGUgY29udGFpbmluZyB0aGUgdHJhbnNpdGlvbiBjbGFzcywgdGhlIGNsYXNzIHRvIGFwcGx5XG4gICAgICAgKiAgIHRvIHN0YXJ0IHRoZSB0cmFuc2l0aW9uLCBhbmQgdGhlIGVuZGluZyB0cmFuc2l0aW9uIGNsYXNzLCBzdWNoIGFzOlxuICAgICAgICpcbiAgICAgICAqICAgICAgIFtcImVhc2Utb3V0IGR1cmF0aW9uLTMwMFwiLCBcIm9wYWNpdHktMTAwXCIsIFwib3BhY2l0eS0wXCJdXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzPXt9XSAtIE9wdGlvbmFsIHNldHRpbmdzLlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5ibG9ja2luZ10gLSBUaGUgYm9vbGVhbiBmbGFnIHRvIGJsb2NrIHRoZSBVSSBkdXJpbmcgdGhlIHRyYW5zaXRpb24uXG4gICAgICAgKiAgIERlZmF1bHRzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgdHJhbnNpdGlvbihlbCwgdHJhbnNpdGlvbiwgb3B0cyA9IHt9KXtcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBbXSwgSlMudHJhbnNpdGlvbkNsYXNzZXModHJhbnNpdGlvbiksIG9wdHMudGltZSwgb3duZXIsIG9wdHMuYmxvY2tpbmcpXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFNldHMgYW4gYXR0cmlidXRlIG9uIGFuIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byBzZXQgdGhlIGF0dHJpYnV0ZSBvbi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyIC0gVGhlIGF0dHJpYnV0ZSBuYW1lIHRvIHNldC5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWwgLSBUaGUgdmFsdWUgdG8gc2V0IGZvciB0aGUgYXR0cmlidXRlLlxuICAgICAgICovXG4gICAgICBzZXRBdHRyaWJ1dGUoZWwsIGF0dHIsIHZhbCl7IEpTLnNldE9yUmVtb3ZlQXR0cnMoZWwsIFtbYXR0ciwgdmFsXV0sIFtdKSB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZXMgYW4gYXR0cmlidXRlIGZyb20gYW4gZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBlbGVtZW50IHRvIHJlbW92ZSB0aGUgYXR0cmlidXRlIGZyb20uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0ciAtIFRoZSBhdHRyaWJ1dGUgbmFtZSB0byByZW1vdmUuXG4gICAgICAgKi9cbiAgICAgIHJlbW92ZUF0dHJpYnV0ZShlbCwgYXR0cil7IEpTLnNldE9yUmVtb3ZlQXR0cnMoZWwsIFtdLCBbYXR0cl0pIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogVG9nZ2xlcyBhbiBhdHRyaWJ1dGUgb24gYW4gZWxlbWVudCBiZXR3ZWVuIHR3byB2YWx1ZXMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byB0b2dnbGUgdGhlIGF0dHJpYnV0ZSBvbi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyIC0gVGhlIGF0dHJpYnV0ZSBuYW1lIHRvIHRvZ2dsZS5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWwxIC0gVGhlIGZpcnN0IHZhbHVlIHRvIHRvZ2dsZSBiZXR3ZWVuLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbDIgLSBUaGUgc2Vjb25kIHZhbHVlIHRvIHRvZ2dsZSBiZXR3ZWVuLlxuICAgICAgICovXG4gICAgICB0b2dnbGVBdHRyaWJ1dGUoZWwsIGF0dHIsIHZhbDEsIHZhbDIpeyBKUy50b2dnbGVBdHRyKGVsLCBhdHRyLCB2YWwxLCB2YWwyKSB9LFxuICAgIH1cbiAgfVxuXG4gIHB1c2hFdmVudChldmVudCwgcGF5bG9hZCA9IHt9LCBvblJlcGx5KXtcbiAgICBpZihvblJlcGx5ID09PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZWYgPSB0aGlzLl9fdmlldygpLnB1c2hIb29rRXZlbnQodGhpcy5lbCwgbnVsbCwgZXZlbnQsIHBheWxvYWQsIChyZXBseSwgX3JlZikgPT4gcmVzb2x2ZShyZXBseSkpXG4gICAgICAgICAgaWYocmVmID09PSBmYWxzZSl7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwidW5hYmxlIHRvIHB1c2ggaG9vayBldmVudC4gTGl2ZVZpZXcgbm90IGNvbm5lY3RlZFwiKSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKXtcbiAgICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9fdmlldygpLnB1c2hIb29rRXZlbnQodGhpcy5lbCwgbnVsbCwgZXZlbnQsIHBheWxvYWQsIG9uUmVwbHkpXG4gIH1cblxuICBwdXNoRXZlbnRUbyhwaHhUYXJnZXQsIGV2ZW50LCBwYXlsb2FkID0ge30sIG9uUmVwbHkpe1xuICAgIGlmKG9uUmVwbHkgPT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuX192aWV3KCkud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsICh2aWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlZiA9IHZpZXcucHVzaEhvb2tFdmVudCh0aGlzLmVsLCB0YXJnZXRDdHgsIGV2ZW50LCBwYXlsb2FkLCAocmVwbHksIF9yZWYpID0+IHJlc29sdmUocmVwbHkpKVxuICAgICAgICAgICAgaWYocmVmID09PSBmYWxzZSl7XG4gICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJ1bmFibGUgdG8gcHVzaCBob29rIGV2ZW50LiBMaXZlVmlldyBub3QgY29ubmVjdGVkXCIpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKXtcbiAgICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9fdmlldygpLndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCAodmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICByZXR1cm4gdmlldy5wdXNoSG9va0V2ZW50KHRoaXMuZWwsIHRhcmdldEN0eCwgZXZlbnQsIHBheWxvYWQsIG9uUmVwbHkpXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGV2ZW50LCBjYWxsYmFjayl7XG4gICAgbGV0IGNhbGxiYWNrUmVmID0gKGN1c3RvbUV2ZW50LCBieXBhc3MpID0+IGJ5cGFzcyA/IGV2ZW50IDogY2FsbGJhY2soY3VzdG9tRXZlbnQuZGV0YWlsKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGBwaHg6JHtldmVudH1gLCBjYWxsYmFja1JlZilcbiAgICB0aGlzLl9fbGlzdGVuZXJzLmFkZChjYWxsYmFja1JlZilcbiAgICByZXR1cm4gY2FsbGJhY2tSZWZcbiAgfVxuXG4gIHJlbW92ZUhhbmRsZUV2ZW50KGNhbGxiYWNrUmVmKXtcbiAgICBsZXQgZXZlbnQgPSBjYWxsYmFja1JlZihudWxsLCB0cnVlKVxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGBwaHg6JHtldmVudH1gLCBjYWxsYmFja1JlZilcbiAgICB0aGlzLl9fbGlzdGVuZXJzLmRlbGV0ZShjYWxsYmFja1JlZilcbiAgfVxuXG4gIHVwbG9hZChuYW1lLCBmaWxlcyl7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3KCkuZGlzcGF0Y2hVcGxvYWRzKG51bGwsIG5hbWUsIGZpbGVzKVxuICB9XG5cbiAgdXBsb2FkVG8ocGh4VGFyZ2V0LCBuYW1lLCBmaWxlcyl7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3KCkud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsICh2aWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgIHZpZXcuZGlzcGF0Y2hVcGxvYWRzKHRhcmdldEN0eCwgbmFtZSwgZmlsZXMpXG4gICAgfSlcbiAgfVxuXG4gIF9fY2xlYW51cF9fKCl7XG4gICAgdGhpcy5fX2xpc3RlbmVycy5mb3JFYWNoKGNhbGxiYWNrUmVmID0+IHRoaXMucmVtb3ZlSGFuZGxlRXZlbnQoY2FsbGJhY2tSZWYpKVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgQkVGT1JFX1VOTE9BRF9MT0FERVJfVElNRU9VVCxcbiAgQ0hFQ0tBQkxFX0lOUFVUUyxcbiAgQ09OU0VDVVRJVkVfUkVMT0FEUyxcbiAgUEhYX0FVVE9fUkVDT1ZFUixcbiAgUEhYX0NPTVBPTkVOVCxcbiAgUEhYX0NPTk5FQ1RFRF9DTEFTUyxcbiAgUEhYX0RJU0FCTEVfV0lUSCxcbiAgUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFLFxuICBQSFhfRElTQUJMRUQsXG4gIFBIWF9MT0FESU5HX0NMQVNTLFxuICBQSFhfRVJST1JfQ0xBU1MsXG4gIFBIWF9DTElFTlRfRVJST1JfQ0xBU1MsXG4gIFBIWF9TRVJWRVJfRVJST1JfQ0xBU1MsXG4gIFBIWF9IQVNfRk9DVVNFRCxcbiAgUEhYX0hBU19TVUJNSVRURUQsXG4gIFBIWF9IT09LLFxuICBQSFhfUEFSRU5UX0lELFxuICBQSFhfUFJPR1JFU1MsXG4gIFBIWF9SRUFET05MWSxcbiAgUEhYX1JFRl9MT0FESU5HLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX1JFRl9MT0NLLFxuICBQSFhfUk9PVF9JRCxcbiAgUEhYX1NFU1NJT04sXG4gIFBIWF9TVEFUSUMsXG4gIFBIWF9TVElDS1ksXG4gIFBIWF9UUkFDS19TVEFUSUMsXG4gIFBIWF9UUkFDS19VUExPQURTLFxuICBQSFhfVVBEQVRFLFxuICBQSFhfVVBMT0FEX1JFRixcbiAgUEhYX1ZJRVdfU0VMRUNUT1IsXG4gIFBIWF9NQUlOLFxuICBQSFhfTU9VTlRFRCxcbiAgUFVTSF9USU1FT1VULFxuICBQSFhfVklFV1BPUlRfVE9QLFxuICBQSFhfVklFV1BPUlRfQk9UVE9NLFxuICBNQVhfQ0hJTERfSk9JTl9BVFRFTVBUU1xufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBjbG9uZSxcbiAgY2xvc2VzdFBoeEJpbmRpbmcsXG4gIGlzRW1wdHksXG4gIGlzRXF1YWxPYmosXG4gIGxvZ0Vycm9yLFxuICBtYXliZSxcbiAgaXNDaWQsXG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IEJyb3dzZXIgZnJvbSBcIi4vYnJvd3NlclwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgRWxlbWVudFJlZiBmcm9tIFwiLi9lbGVtZW50X3JlZlwiXG5pbXBvcnQgRE9NUGF0Y2ggZnJvbSBcIi4vZG9tX3BhdGNoXCJcbmltcG9ydCBMaXZlVXBsb2FkZXIgZnJvbSBcIi4vbGl2ZV91cGxvYWRlclwiXG5pbXBvcnQgUmVuZGVyZWQgZnJvbSBcIi4vcmVuZGVyZWRcIlxuaW1wb3J0IFZpZXdIb29rIGZyb20gXCIuL3ZpZXdfaG9va1wiXG5pbXBvcnQgSlMgZnJvbSBcIi4vanNcIlxuXG5pbXBvcnQgbW9ycGhkb20gZnJvbSBcIm1vcnBoZG9tXCJcblxuZXhwb3J0IGxldCBwcmVwZW5kRm9ybURhdGFLZXkgPSAoa2V5LCBwcmVmaXgpID0+IHtcbiAgbGV0IGlzQXJyYXkgPSBrZXkuZW5kc1dpdGgoXCJbXVwiKVxuICAvLyBSZW1vdmUgdGhlIFwiW11cIiBpZiBpdCdzIGFuIGFycmF5XG4gIGxldCBiYXNlS2V5ID0gaXNBcnJheSA/IGtleS5zbGljZSgwLCAtMikgOiBrZXlcbiAgLy8gUmVwbGFjZSBsYXN0IG9jY3VycmVuY2Ugb2Yga2V5IGJlZm9yZSBhIGNsb3NpbmcgYnJhY2tldCBvciB0aGUgZW5kIHdpdGgga2V5IHBsdXMgc3VmZml4XG4gIGJhc2VLZXkgPSBiYXNlS2V5LnJlcGxhY2UoLyhbXlxcW1xcXV0rKShcXF0/JCkvLCBgJHtwcmVmaXh9JDEkMmApXG4gIC8vIEFkZCBiYWNrIHRoZSBcIltdXCIgaWYgaXQgd2FzIGFuIGFycmF5XG4gIGlmKGlzQXJyYXkpeyBiYXNlS2V5ICs9IFwiW11cIiB9XG4gIHJldHVybiBiYXNlS2V5XG59XG5cbmxldCBzZXJpYWxpemVGb3JtID0gKGZvcm0sIG9wdHMsIG9ubHlOYW1lcyA9IFtdKSA9PiB7XG4gIGNvbnN0IHtzdWJtaXR0ZXJ9ID0gb3B0c1xuXG4gIC8vIFdlIG11c3QgaW5qZWN0IHRoZSBzdWJtaXR0ZXIgaW4gdGhlIG9yZGVyIHRoYXQgaXQgZXhpc3RzIGluIHRoZSBET01cbiAgLy8gcmVsYXRpdmUgdG8gb3RoZXIgaW5wdXRzLiBGb3IgZXhhbXBsZSwgZm9yIGNoZWNrYm94IGdyb3VwcywgdGhlIG9yZGVyIG11c3QgYmUgbWFpbnRhaW5lZC5cbiAgbGV0IGluamVjdGVkRWxlbWVudFxuICBpZihzdWJtaXR0ZXIgJiYgc3VibWl0dGVyLm5hbWUpe1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpXG4gICAgaW5wdXQudHlwZSA9IFwiaGlkZGVuXCJcbiAgICAvLyBzZXQgdGhlIGZvcm0gYXR0cmlidXRlIGlmIHRoZSBzdWJtaXR0ZXIgaGFzIG9uZTtcbiAgICAvLyB0aGlzIGNhbiBoYXBwZW4gaWYgdGhlIGVsZW1lbnQgaXMgb3V0c2lkZSB0aGUgYWN0dWFsIGZvcm0gZWxlbWVudFxuICAgIGNvbnN0IGZvcm1JZCA9IHN1Ym1pdHRlci5nZXRBdHRyaWJ1dGUoXCJmb3JtXCIpXG4gICAgaWYoZm9ybUlkKXtcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImZvcm1cIiwgZm9ybUlkKVxuICAgIH1cbiAgICBpbnB1dC5uYW1lID0gc3VibWl0dGVyLm5hbWVcbiAgICBpbnB1dC52YWx1ZSA9IHN1Ym1pdHRlci52YWx1ZVxuICAgIHN1Ym1pdHRlci5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShpbnB1dCwgc3VibWl0dGVyKVxuICAgIGluamVjdGVkRWxlbWVudCA9IGlucHV0XG4gIH1cblxuICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKVxuICBjb25zdCB0b1JlbW92ZSA9IFtdXG5cbiAgZm9ybURhdGEuZm9yRWFjaCgodmFsLCBrZXksIF9pbmRleCkgPT4ge1xuICAgIGlmKHZhbCBpbnN0YW5jZW9mIEZpbGUpeyB0b1JlbW92ZS5wdXNoKGtleSkgfVxuICB9KVxuXG4gIC8vIENsZWFudXAgYWZ0ZXIgYnVpbGRpbmcgZmlsZURhdGFcbiAgdG9SZW1vdmUuZm9yRWFjaChrZXkgPT4gZm9ybURhdGEuZGVsZXRlKGtleSkpXG5cbiAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpXG5cbiAgY29uc3Qge2lucHV0c1VudXNlZCwgb25seUhpZGRlbklucHV0c30gPSBBcnJheS5mcm9tKGZvcm0uZWxlbWVudHMpLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGNvbnN0IHtpbnB1dHNVbnVzZWQsIG9ubHlIaWRkZW5JbnB1dHN9ID0gYWNjXG4gICAgY29uc3Qga2V5ID0gaW5wdXQubmFtZVxuICAgIGlmKCFrZXkpeyByZXR1cm4gYWNjIH1cblxuICAgIGlmKGlucHV0c1VudXNlZFtrZXldID09PSB1bmRlZmluZWQpeyBpbnB1dHNVbnVzZWRba2V5XSA9IHRydWUgfVxuICAgIGlmKG9ubHlIaWRkZW5JbnB1dHNba2V5XSA9PT0gdW5kZWZpbmVkKXsgb25seUhpZGRlbklucHV0c1trZXldID0gdHJ1ZSB9XG5cbiAgICBjb25zdCBpc1VzZWQgPSBET00ucHJpdmF0ZShpbnB1dCwgUEhYX0hBU19GT0NVU0VEKSB8fCBET00ucHJpdmF0ZShpbnB1dCwgUEhYX0hBU19TVUJNSVRURUQpXG4gICAgY29uc3QgaXNIaWRkZW4gPSBpbnB1dC50eXBlID09PSBcImhpZGRlblwiXG4gICAgaW5wdXRzVW51c2VkW2tleV0gPSBpbnB1dHNVbnVzZWRba2V5XSAmJiAhaXNVc2VkXG4gICAgb25seUhpZGRlbklucHV0c1trZXldID0gb25seUhpZGRlbklucHV0c1trZXldICYmIGlzSGlkZGVuXG5cbiAgICByZXR1cm4gYWNjXG4gIH0sIHtpbnB1dHNVbnVzZWQ6IHt9LCBvbmx5SGlkZGVuSW5wdXRzOiB7fX0pXG5cbiAgZm9yKGxldCBba2V5LCB2YWxdIG9mIGZvcm1EYXRhLmVudHJpZXMoKSl7XG4gICAgaWYob25seU5hbWVzLmxlbmd0aCA9PT0gMCB8fCBvbmx5TmFtZXMuaW5kZXhPZihrZXkpID49IDApe1xuICAgICAgbGV0IGlzVW51c2VkID0gaW5wdXRzVW51c2VkW2tleV1cbiAgICAgIGxldCBoaWRkZW4gPSBvbmx5SGlkZGVuSW5wdXRzW2tleV1cbiAgICAgIGlmKGlzVW51c2VkICYmICEoc3VibWl0dGVyICYmIHN1Ym1pdHRlci5uYW1lID09IGtleSkgJiYgIWhpZGRlbil7XG4gICAgICAgIHBhcmFtcy5hcHBlbmQocHJlcGVuZEZvcm1EYXRhS2V5KGtleSwgXCJfdW51c2VkX1wiKSwgXCJcIilcbiAgICAgIH1cbiAgICAgIHBhcmFtcy5hcHBlbmQoa2V5LCB2YWwpXG4gICAgfVxuICB9XG5cbiAgLy8gcmVtb3ZlIHRoZSBpbmplY3RlZCBlbGVtZW50IGFnYWluXG4gIC8vIChpdCB3b3VsZCBiZSByZW1vdmVkIGJ5IHRoZSBuZXh0IGRvbSBwYXRjaCBhbnl3YXksIGJ1dCB0aGlzIGlzIGNsZWFuZXIpXG4gIGlmKHN1Ym1pdHRlciAmJiBpbmplY3RlZEVsZW1lbnQpe1xuICAgIHN1Ym1pdHRlci5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGluamVjdGVkRWxlbWVudClcbiAgfVxuXG4gIHJldHVybiBwYXJhbXMudG9TdHJpbmcoKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcbiAgc3RhdGljIGNsb3Nlc3RWaWV3KGVsKXtcbiAgICBsZXQgbGl2ZVZpZXdFbCA9IGVsLmNsb3Nlc3QoUEhYX1ZJRVdfU0VMRUNUT1IpXG4gICAgcmV0dXJuIGxpdmVWaWV3RWwgPyBET00ucHJpdmF0ZShsaXZlVmlld0VsLCBcInZpZXdcIikgOiBudWxsXG4gIH1cblxuICBjb25zdHJ1Y3RvcihlbCwgbGl2ZVNvY2tldCwgcGFyZW50VmlldywgZmxhc2gsIGxpdmVSZWZlcmVyKXtcbiAgICB0aGlzLmlzRGVhZCA9IGZhbHNlXG4gICAgdGhpcy5saXZlU29ja2V0ID0gbGl2ZVNvY2tldFxuICAgIHRoaXMuZmxhc2ggPSBmbGFzaFxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50Vmlld1xuICAgIHRoaXMucm9vdCA9IHBhcmVudFZpZXcgPyBwYXJlbnRWaWV3LnJvb3QgOiB0aGlzXG4gICAgdGhpcy5lbCA9IGVsXG4gICAgRE9NLnB1dFByaXZhdGUodGhpcy5lbCwgXCJ2aWV3XCIsIHRoaXMpXG4gICAgdGhpcy5pZCA9IHRoaXMuZWwuaWRcbiAgICB0aGlzLnJlZiA9IDBcbiAgICB0aGlzLmxhc3RBY2tSZWYgPSBudWxsXG4gICAgdGhpcy5jaGlsZEpvaW5zID0gMFxuICAgIHRoaXMubG9hZGVyVGltZXIgPSBudWxsXG4gICAgdGhpcy5kaXNjb25uZWN0ZWRUaW1lciA9IG51bGxcbiAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gICAgdGhpcy5wZW5kaW5nRm9ybXMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnJlZGlyZWN0ID0gZmFsc2VcbiAgICB0aGlzLmhyZWYgPSBudWxsXG4gICAgdGhpcy5qb2luQ291bnQgPSB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmpvaW5Db3VudCAtIDEgOiAwXG4gICAgdGhpcy5qb2luQXR0ZW1wdHMgPSAwXG4gICAgdGhpcy5qb2luUGVuZGluZyA9IHRydWVcbiAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlXG4gICAgdGhpcy5qb2luQ2FsbGJhY2sgPSBmdW5jdGlvbihvbkRvbmUpeyBvbkRvbmUgJiYgb25Eb25lKCkgfVxuICAgIHRoaXMuc3RvcENhbGxiYWNrID0gZnVuY3Rpb24oKXsgfVxuICAgIHRoaXMucGVuZGluZ0pvaW5PcHMgPSB0aGlzLnBhcmVudCA/IG51bGwgOiBbXVxuICAgIHRoaXMudmlld0hvb2tzID0ge31cbiAgICB0aGlzLmZvcm1TdWJtaXRzID0gW11cbiAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5wYXJlbnQgPyBudWxsIDoge31cbiAgICB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF0gPSB7fVxuICAgIHRoaXMuZm9ybXNGb3JSZWNvdmVyeSA9IHt9XG4gICAgdGhpcy5jaGFubmVsID0gdGhpcy5saXZlU29ja2V0LmNoYW5uZWwoYGx2OiR7dGhpcy5pZH1gLCAoKSA9PiB7XG4gICAgICBsZXQgdXJsID0gdGhpcy5ocmVmICYmIHRoaXMuZXhwYW5kVVJMKHRoaXMuaHJlZilcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlZGlyZWN0OiB0aGlzLnJlZGlyZWN0ID8gdXJsIDogdW5kZWZpbmVkLFxuICAgICAgICB1cmw6IHRoaXMucmVkaXJlY3QgPyB1bmRlZmluZWQgOiB1cmwgfHwgdW5kZWZpbmVkLFxuICAgICAgICBwYXJhbXM6IHRoaXMuY29ubmVjdFBhcmFtcyhsaXZlUmVmZXJlciksXG4gICAgICAgIHNlc3Npb246IHRoaXMuZ2V0U2Vzc2lvbigpLFxuICAgICAgICBzdGF0aWM6IHRoaXMuZ2V0U3RhdGljKCksXG4gICAgICAgIGZsYXNoOiB0aGlzLmZsYXNoLFxuICAgICAgICBzdGlja3k6IHRoaXMuZWwuaGFzQXR0cmlidXRlKFBIWF9TVElDS1kpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHNldEhyZWYoaHJlZil7IHRoaXMuaHJlZiA9IGhyZWYgfVxuXG4gIHNldFJlZGlyZWN0KGhyZWYpe1xuICAgIHRoaXMucmVkaXJlY3QgPSB0cnVlXG4gICAgdGhpcy5ocmVmID0gaHJlZlxuICB9XG5cbiAgaXNNYWluKCl7IHJldHVybiB0aGlzLmVsLmhhc0F0dHJpYnV0ZShQSFhfTUFJTikgfVxuXG4gIGNvbm5lY3RQYXJhbXMobGl2ZVJlZmVyZXIpe1xuICAgIGxldCBwYXJhbXMgPSB0aGlzLmxpdmVTb2NrZXQucGFyYW1zKHRoaXMuZWwpXG4gICAgbGV0IG1hbmlmZXN0ID1cbiAgICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX1RSQUNLX1NUQVRJQyl9XWApXG4gICAgICAgIC5tYXAobm9kZSA9PiBub2RlLnNyYyB8fCBub2RlLmhyZWYpLmZpbHRlcih1cmwgPT4gdHlwZW9mICh1cmwpID09PSBcInN0cmluZ1wiKVxuXG4gICAgaWYobWFuaWZlc3QubGVuZ3RoID4gMCl7IHBhcmFtc1tcIl90cmFja19zdGF0aWNcIl0gPSBtYW5pZmVzdCB9XG4gICAgcGFyYW1zW1wiX21vdW50c1wiXSA9IHRoaXMuam9pbkNvdW50XG4gICAgcGFyYW1zW1wiX21vdW50X2F0dGVtcHRzXCJdID0gdGhpcy5qb2luQXR0ZW1wdHNcbiAgICBwYXJhbXNbXCJfbGl2ZV9yZWZlcmVyXCJdID0gbGl2ZVJlZmVyZXJcbiAgICB0aGlzLmpvaW5BdHRlbXB0cysrXG5cbiAgICByZXR1cm4gcGFyYW1zXG4gIH1cblxuICBpc0Nvbm5lY3RlZCgpeyByZXR1cm4gdGhpcy5jaGFubmVsLmNhblB1c2goKSB9XG5cbiAgZ2V0U2Vzc2lvbigpeyByZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pIH1cblxuICBnZXRTdGF0aWMoKXtcbiAgICBsZXQgdmFsID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NUQVRJQylcbiAgICByZXR1cm4gdmFsID09PSBcIlwiID8gbnVsbCA6IHZhbFxuICB9XG5cbiAgZGVzdHJveShjYWxsYmFjayA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICB0aGlzLmRlc3Ryb3lBbGxDaGlsZHJlbigpXG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlXG4gICAgZGVsZXRlIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXVxuICAgIGlmKHRoaXMucGFyZW50KXsgZGVsZXRlIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLnBhcmVudC5pZF1bdGhpcy5pZF0gfVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmxvYWRlclRpbWVyKVxuICAgIGxldCBvbkZpbmlzaGVkID0gKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKVxuICAgICAgZm9yKGxldCBpZCBpbiB0aGlzLnZpZXdIb29rcyl7XG4gICAgICAgIHRoaXMuZGVzdHJveUhvb2sodGhpcy52aWV3SG9va3NbaWRdKVxuICAgICAgfVxuICAgIH1cblxuICAgIERPTS5tYXJrUGh4Q2hpbGREZXN0cm95ZWQodGhpcy5lbClcblxuICAgIHRoaXMubG9nKFwiZGVzdHJveWVkXCIsICgpID0+IFtcInRoZSBjaGlsZCBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIHBhcmVudFwiXSlcbiAgICB0aGlzLmNoYW5uZWwubGVhdmUoKVxuICAgICAgLnJlY2VpdmUoXCJva1wiLCBvbkZpbmlzaGVkKVxuICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCBvbkZpbmlzaGVkKVxuICAgICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsIG9uRmluaXNoZWQpXG4gIH1cblxuICBzZXRDb250YWluZXJDbGFzc2VzKC4uLmNsYXNzZXMpe1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZShcbiAgICAgIFBIWF9DT05ORUNURURfQ0xBU1MsXG4gICAgICBQSFhfTE9BRElOR19DTEFTUyxcbiAgICAgIFBIWF9FUlJPUl9DTEFTUyxcbiAgICAgIFBIWF9DTElFTlRfRVJST1JfQ0xBU1MsXG4gICAgICBQSFhfU0VSVkVSX0VSUk9SX0NMQVNTXG4gICAgKVxuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKVxuICB9XG5cbiAgc2hvd0xvYWRlcih0aW1lb3V0KXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5sb2FkZXJUaW1lcilcbiAgICBpZih0aW1lb3V0KXtcbiAgICAgIHRoaXMubG9hZGVyVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2hvd0xvYWRlcigpLCB0aW1lb3V0KVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IobGV0IGlkIGluIHRoaXMudmlld0hvb2tzKXsgdGhpcy52aWV3SG9va3NbaWRdLl9fZGlzY29ubmVjdGVkKCkgfVxuICAgICAgdGhpcy5zZXRDb250YWluZXJDbGFzc2VzKFBIWF9MT0FESU5HX0NMQVNTKVxuICAgIH1cbiAgfVxuXG4gIGV4ZWNBbGwoYmluZGluZyl7XG4gICAgRE9NLmFsbCh0aGlzLmVsLCBgWyR7YmluZGluZ31dYCwgZWwgPT4gdGhpcy5saXZlU29ja2V0LmV4ZWNKUyhlbCwgZWwuZ2V0QXR0cmlidXRlKGJpbmRpbmcpKSlcbiAgfVxuXG4gIGhpZGVMb2FkZXIoKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5sb2FkZXJUaW1lcilcbiAgICBjbGVhclRpbWVvdXQodGhpcy5kaXNjb25uZWN0ZWRUaW1lcilcbiAgICB0aGlzLnNldENvbnRhaW5lckNsYXNzZXMoUEhYX0NPTk5FQ1RFRF9DTEFTUylcbiAgICB0aGlzLmV4ZWNBbGwodGhpcy5iaW5kaW5nKFwiY29ubmVjdGVkXCIpKVxuICB9XG5cbiAgdHJpZ2dlclJlY29ubmVjdGVkKCl7XG4gICAgZm9yKGxldCBpZCBpbiB0aGlzLnZpZXdIb29rcyl7IHRoaXMudmlld0hvb2tzW2lkXS5fX3JlY29ubmVjdGVkKCkgfVxuICB9XG5cbiAgbG9nKGtpbmQsIG1zZ0NhbGxiYWNrKXtcbiAgICB0aGlzLmxpdmVTb2NrZXQubG9nKHRoaXMsIGtpbmQsIG1zZ0NhbGxiYWNrKVxuICB9XG5cbiAgdHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUgPSBmdW5jdGlvbigpe30pe1xuICAgIHRoaXMubGl2ZVNvY2tldC50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSlcbiAgfVxuXG4gIC8vIGNhbGxzIHRoZSBjYWxsYmFjayB3aXRoIHRoZSB2aWV3IGFuZCB0YXJnZXQgZWxlbWVudCBmb3IgdGhlIGdpdmVuIHBoeFRhcmdldFxuICAvLyB0YXJnZXRzIGNhbiBiZTpcbiAgLy8gICogYW4gZWxlbWVudCBpdHNlbGYsIHRoZW4gaXQgaXMgc2ltcGx5IHBhc3NlZCB0byBsaXZlU29ja2V0Lm93bmVyO1xuICAvLyAgKiBhIENJRCAoQ29tcG9uZW50IElEKSwgdGhlbiB3ZSBmaXJzdCBzZWFyY2ggdGhlIGNvbXBvbmVudCdzIGVsZW1lbnQgaW4gdGhlIERPTVxuICAvLyAgKiBhIHNlbGVjdG9yLCB0aGVuIHdlIHNlYXJjaCB0aGUgc2VsZWN0b3IgaW4gdGhlIERPTSBhbmQgY2FsbCB0aGUgY2FsbGJhY2tcbiAgLy8gICAgZm9yIGVhY2ggZWxlbWVudCBmb3VuZCB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIG93bmVyIHZpZXdcbiAgd2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsIGNhbGxiYWNrLCBkb20gPSBkb2N1bWVudCwgdmlld0VsKXtcbiAgICAvLyBpbiB0aGUgZm9ybSByZWNvdmVyeSBjYXNlIHdlIHNlYXJjaCBpbiBhIHRlbXBsYXRlIGZyYWdtZW50IGluc3RlYWQgb2ZcbiAgICAvLyB0aGUgcmVhbCBkb20sIHRoZXJlZm9yZSB3ZSBvcHRpb25hbGx5IHBhc3MgZG9tIGFuZCB2aWV3RWxcblxuICAgIGlmKHBoeFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8IHBoeFRhcmdldCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQpe1xuICAgICAgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC5vd25lcihwaHhUYXJnZXQsIHZpZXcgPT4gY2FsbGJhY2sodmlldywgcGh4VGFyZ2V0KSlcbiAgICB9XG5cbiAgICBpZihpc0NpZChwaHhUYXJnZXQpKXtcbiAgICAgIGxldCB0YXJnZXRzID0gRE9NLmZpbmRDb21wb25lbnROb2RlTGlzdCh2aWV3RWwgfHwgdGhpcy5lbCwgcGh4VGFyZ2V0KVxuICAgICAgaWYodGFyZ2V0cy5sZW5ndGggPT09IDApe1xuICAgICAgICBsb2dFcnJvcihgbm8gY29tcG9uZW50IGZvdW5kIG1hdGNoaW5nIHBoeC10YXJnZXQgb2YgJHtwaHhUYXJnZXR9YClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKHRoaXMsIHBhcnNlSW50KHBoeFRhcmdldCkpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCB0YXJnZXRzID0gQXJyYXkuZnJvbShkb20ucXVlcnlTZWxlY3RvckFsbChwaHhUYXJnZXQpKVxuICAgICAgaWYodGFyZ2V0cy5sZW5ndGggPT09IDApeyBsb2dFcnJvcihgbm90aGluZyBmb3VuZCBtYXRjaGluZyB0aGUgcGh4LXRhcmdldCBzZWxlY3RvciBcIiR7cGh4VGFyZ2V0fVwiYCkgfVxuICAgICAgdGFyZ2V0cy5mb3JFYWNoKHRhcmdldCA9PiB0aGlzLmxpdmVTb2NrZXQub3duZXIodGFyZ2V0LCB2aWV3ID0+IGNhbGxiYWNrKHZpZXcsIHRhcmdldCkpKVxuICAgIH1cbiAgfVxuXG4gIGFwcGx5RGlmZih0eXBlLCByYXdEaWZmLCBjYWxsYmFjayl7XG4gICAgdGhpcy5sb2codHlwZSwgKCkgPT4gW1wiXCIsIGNsb25lKHJhd0RpZmYpXSlcbiAgICBsZXQge2RpZmYsIHJlcGx5LCBldmVudHMsIHRpdGxlfSA9IFJlbmRlcmVkLmV4dHJhY3QocmF3RGlmZilcbiAgICBjYWxsYmFjayh7ZGlmZiwgcmVwbHksIGV2ZW50c30pXG4gICAgaWYodHlwZW9mIHRpdGxlID09PSBcInN0cmluZ1wiIHx8IHR5cGUgPT0gXCJtb3VudFwiKXsgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBET00ucHV0VGl0bGUodGl0bGUpKSB9XG4gIH1cblxuICBvbkpvaW4ocmVzcCl7XG4gICAgbGV0IHtyZW5kZXJlZCwgY29udGFpbmVyLCBsaXZldmlld192ZXJzaW9ufSA9IHJlc3BcbiAgICBpZihjb250YWluZXIpe1xuICAgICAgbGV0IFt0YWcsIGF0dHJzXSA9IGNvbnRhaW5lclxuICAgICAgdGhpcy5lbCA9IERPTS5yZXBsYWNlUm9vdENvbnRhaW5lcih0aGlzLmVsLCB0YWcsIGF0dHJzKVxuICAgIH1cbiAgICB0aGlzLmNoaWxkSm9pbnMgPSAwXG4gICAgdGhpcy5qb2luUGVuZGluZyA9IHRydWVcbiAgICB0aGlzLmZsYXNoID0gbnVsbFxuICAgIGlmKHRoaXMucm9vdCA9PT0gdGhpcyl7XG4gICAgICB0aGlzLmZvcm1zRm9yUmVjb3ZlcnkgPSB0aGlzLmdldEZvcm1zRm9yUmVjb3ZlcnkoKVxuICAgIH1cbiAgICBpZih0aGlzLmlzTWFpbigpICYmIHdpbmRvdy5oaXN0b3J5LnN0YXRlID09PSBudWxsKXtcbiAgICAgIC8vIHNldCBpbml0aWFsIGhpc3RvcnkgZW50cnkgaWYgdGhpcyBpcyB0aGUgZmlyc3QgcGFnZSBsb2FkIChubyBoaXN0b3J5KVxuICAgICAgQnJvd3Nlci5wdXNoU3RhdGUoXCJyZXBsYWNlXCIsIHtcbiAgICAgICAgdHlwZTogXCJwYXRjaFwiLFxuICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAgcG9zaXRpb246IHRoaXMubGl2ZVNvY2tldC5jdXJyZW50SGlzdG9yeVBvc2l0aW9uXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmKGxpdmV2aWV3X3ZlcnNpb24gIT09IHRoaXMubGl2ZVNvY2tldC52ZXJzaW9uKCkpe1xuICAgICAgY29uc29sZS5lcnJvcihgTGl2ZVZpZXcgYXNzZXQgdmVyc2lvbiBtaXNtYXRjaC4gSmF2YVNjcmlwdCB2ZXJzaW9uICR7dGhpcy5saXZlU29ja2V0LnZlcnNpb24oKX0gdnMuIHNlcnZlciAke2xpdmV2aWV3X3ZlcnNpb259LiBUbyBhdm9pZCBpc3N1ZXMsIHBsZWFzZSBlbnN1cmUgdGhhdCB5b3VyIGFzc2V0cyB1c2UgdGhlIHNhbWUgdmVyc2lvbiBhcyB0aGUgc2VydmVyLmApXG4gICAgfVxuXG4gICAgQnJvd3Nlci5kcm9wTG9jYWwodGhpcy5saXZlU29ja2V0LmxvY2FsU3RvcmFnZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCBDT05TRUNVVElWRV9SRUxPQURTKVxuICAgIHRoaXMuYXBwbHlEaWZmKFwibW91bnRcIiwgcmVuZGVyZWQsICh7ZGlmZiwgZXZlbnRzfSkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlZCA9IG5ldyBSZW5kZXJlZCh0aGlzLmlkLCBkaWZmKVxuICAgICAgbGV0IFtodG1sLCBzdHJlYW1zXSA9IHRoaXMucmVuZGVyQ29udGFpbmVyKG51bGwsIFwiam9pblwiKVxuICAgICAgdGhpcy5kcm9wUGVuZGluZ1JlZnMoKVxuICAgICAgdGhpcy5qb2luQ291bnQrK1xuICAgICAgdGhpcy5qb2luQXR0ZW1wdHMgPSAwXG5cbiAgICAgIHRoaXMubWF5YmVSZWNvdmVyRm9ybXMoaHRtbCwgKCkgPT4ge1xuICAgICAgICB0aGlzLm9uSm9pbkNvbXBsZXRlKHJlc3AsIGh0bWwsIHN0cmVhbXMsIGV2ZW50cylcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGRyb3BQZW5kaW5nUmVmcygpe1xuICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHtQSFhfUkVGX1NSQ309XCIke3RoaXMucmVmU3JjKCl9XCJdYCwgZWwgPT4ge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUZfTE9BRElORylcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX1NSQylcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX0xPQ0spXG4gICAgfSlcbiAgfVxuXG4gIG9uSm9pbkNvbXBsZXRlKHtsaXZlX3BhdGNofSwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKXtcbiAgICAvLyBJbiBvcmRlciB0byBwcm92aWRlIGEgYmV0dGVyIGV4cGVyaWVuY2UsIHdlIHdhbnQgdG8gam9pblxuICAgIC8vIGFsbCBMaXZlVmlld3MgZmlyc3QgYW5kIG9ubHkgdGhlbiBhcHBseSB0aGVpciBwYXRjaGVzLlxuICAgIGlmKHRoaXMuam9pbkNvdW50ID4gMSB8fCAodGhpcy5wYXJlbnQgJiYgIXRoaXMucGFyZW50LmlzSm9pblBlbmRpbmcoKSkpe1xuICAgICAgcmV0dXJuIHRoaXMuYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKVxuICAgIH1cblxuICAgIC8vIE9uZSBkb3duc2lkZSBvZiB0aGlzIGFwcHJvYWNoIGlzIHRoYXQgd2UgbmVlZCB0byBmaW5kIHBoeENoaWxkcmVuXG4gICAgLy8gaW4gdGhlIGh0bWwgZnJhZ21lbnQsIGluc3RlYWQgb2YgZGlyZWN0bHkgb24gdGhlIERPTS4gVGhlIGZyYWdtZW50XG4gICAgLy8gYWxzbyBkb2VzIG5vdCBpbmNsdWRlIFBIWF9TVEFUSUMsIHNvIHdlIG5lZWQgdG8gY29weSBpdCBvdmVyIGZyb21cbiAgICAvLyB0aGUgRE9NLlxuICAgIGxldCBuZXdDaGlsZHJlbiA9IERPTS5maW5kUGh4Q2hpbGRyZW5JbkZyYWdtZW50KGh0bWwsIHRoaXMuaWQpLmZpbHRlcih0b0VsID0+IHtcbiAgICAgIGxldCBmcm9tRWwgPSB0b0VsLmlkICYmIHRoaXMuZWwucXVlcnlTZWxlY3RvcihgW2lkPVwiJHt0b0VsLmlkfVwiXWApXG4gICAgICBsZXQgcGh4U3RhdGljID0gZnJvbUVsICYmIGZyb21FbC5nZXRBdHRyaWJ1dGUoUEhYX1NUQVRJQylcbiAgICAgIGlmKHBoeFN0YXRpYyl7IHRvRWwuc2V0QXR0cmlidXRlKFBIWF9TVEFUSUMsIHBoeFN0YXRpYykgfVxuICAgICAgLy8gc2V0IFBIWF9ST09UX0lEIHRvIHByZXZlbnQgZXZlbnRzIGZyb20gYmVpbmcgZGlzcGF0Y2hlZCB0byB0aGUgcm9vdCB2aWV3XG4gICAgICAvLyB3aGlsZSB0aGUgY2hpbGQgam9pbiBpcyBzdGlsbCBwZW5kaW5nXG4gICAgICBpZihmcm9tRWwpeyBmcm9tRWwuc2V0QXR0cmlidXRlKFBIWF9ST09UX0lELCB0aGlzLnJvb3QuaWQpIH1cbiAgICAgIHJldHVybiB0aGlzLmpvaW5DaGlsZCh0b0VsKVxuICAgIH0pXG5cbiAgICBpZihuZXdDaGlsZHJlbi5sZW5ndGggPT09IDApe1xuICAgICAgaWYodGhpcy5wYXJlbnQpe1xuICAgICAgICB0aGlzLnJvb3QucGVuZGluZ0pvaW5PcHMucHVzaChbdGhpcywgKCkgPT4gdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBzdHJlYW1zLCBldmVudHMpXSlcbiAgICAgICAgdGhpcy5wYXJlbnQuYWNrSm9pbih0aGlzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vbkFsbENoaWxkSm9pbnNDb21wbGV0ZSgpXG4gICAgICAgIHRoaXMuYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvb3QucGVuZGluZ0pvaW5PcHMucHVzaChbdGhpcywgKCkgPT4gdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBzdHJlYW1zLCBldmVudHMpXSlcbiAgICB9XG4gIH1cblxuICBhdHRhY2hUcnVlRG9jRWwoKXtcbiAgICB0aGlzLmVsID0gRE9NLmJ5SWQodGhpcy5pZClcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCwgdGhpcy5yb290LmlkKVxuICB9XG5cbiAgLy8gdGhpcyBpcyBpbnZva2VkIGZvciBkZWFkIGFuZCBsaXZlIHZpZXdzLCBzbyB3ZSBtdXN0IGZpbHRlciBieVxuICAvLyBieSBvd25lciB0byBlbnN1cmUgd2UgYXJlbid0IGR1cGxpY2F0aW5nIGhvb2tzIGFjcm9zcyBkaXNjb25uZWN0XG4gIC8vIGFuZCBjb25uZWN0ZWQgc3RhdGVzLiBUaGlzIGFsc28gaGFuZGxlcyBjYXNlcyB3aGVyZSBob29rcyBleGlzdFxuICAvLyBpbiBhIHJvb3QgbGF5b3V0IHdpdGggYSBMViBpbiB0aGUgYm9keVxuICBleGVjTmV3TW91bnRlZChwYXJlbnQgPSB0aGlzLmVsKXtcbiAgICBsZXQgcGh4Vmlld3BvcnRUb3AgPSB0aGlzLmJpbmRpbmcoUEhYX1ZJRVdQT1JUX1RPUClcbiAgICBsZXQgcGh4Vmlld3BvcnRCb3R0b20gPSB0aGlzLmJpbmRpbmcoUEhYX1ZJRVdQT1JUX0JPVFRPTSlcbiAgICBET00uYWxsKHBhcmVudCwgYFske3BoeFZpZXdwb3J0VG9wfV0sIFske3BoeFZpZXdwb3J0Qm90dG9tfV1gLCBob29rRWwgPT4ge1xuICAgICAgaWYodGhpcy5vd25zRWxlbWVudChob29rRWwpKXtcbiAgICAgICAgRE9NLm1haW50YWluUHJpdmF0ZUhvb2tzKGhvb2tFbCwgaG9va0VsLCBwaHhWaWV3cG9ydFRvcCwgcGh4Vmlld3BvcnRCb3R0b20pXG4gICAgICAgIHRoaXMubWF5YmVBZGROZXdIb29rKGhvb2tFbClcbiAgICAgIH1cbiAgICB9KVxuICAgIERPTS5hbGwocGFyZW50LCBgWyR7dGhpcy5iaW5kaW5nKFBIWF9IT09LKX1dLCBbZGF0YS1waHgtJHtQSFhfSE9PS31dYCwgaG9va0VsID0+IHtcbiAgICAgIGlmKHRoaXMub3duc0VsZW1lbnQoaG9va0VsKSl7XG4gICAgICAgIHRoaXMubWF5YmVBZGROZXdIb29rKGhvb2tFbClcbiAgICAgIH1cbiAgICB9KVxuICAgIERPTS5hbGwocGFyZW50LCBgWyR7dGhpcy5iaW5kaW5nKFBIWF9NT1VOVEVEKX1dYCwgZWwgPT4ge1xuICAgICAgaWYodGhpcy5vd25zRWxlbWVudChlbCkpe1xuICAgICAgICB0aGlzLm1heWJlTW91bnRlZChlbClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKXtcbiAgICB0aGlzLmF0dGFjaFRydWVEb2NFbCgpXG4gICAgbGV0IHBhdGNoID0gbmV3IERPTVBhdGNoKHRoaXMsIHRoaXMuZWwsIHRoaXMuaWQsIGh0bWwsIHN0cmVhbXMsIG51bGwpXG4gICAgcGF0Y2gubWFya1BydW5hYmxlQ29udGVudEZvclJlbW92YWwoKVxuICAgIHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCBmYWxzZSwgdHJ1ZSlcbiAgICB0aGlzLmpvaW5OZXdDaGlsZHJlbigpXG4gICAgdGhpcy5leGVjTmV3TW91bnRlZCgpXG5cbiAgICB0aGlzLmpvaW5QZW5kaW5nID0gZmFsc2VcbiAgICB0aGlzLmxpdmVTb2NrZXQuZGlzcGF0Y2hFdmVudHMoZXZlbnRzKVxuICAgIHRoaXMuYXBwbHlQZW5kaW5nVXBkYXRlcygpXG5cbiAgICBpZihsaXZlX3BhdGNoKXtcbiAgICAgIGxldCB7a2luZCwgdG99ID0gbGl2ZV9wYXRjaFxuICAgICAgdGhpcy5saXZlU29ja2V0Lmhpc3RvcnlQYXRjaCh0bywga2luZClcbiAgICB9XG4gICAgdGhpcy5oaWRlTG9hZGVyKClcbiAgICBpZih0aGlzLmpvaW5Db3VudCA+IDEpeyB0aGlzLnRyaWdnZXJSZWNvbm5lY3RlZCgpIH1cbiAgICB0aGlzLnN0b3BDYWxsYmFjaygpXG4gIH1cblxuICB0cmlnZ2VyQmVmb3JlVXBkYXRlSG9vayhmcm9tRWwsIHRvRWwpe1xuICAgIHRoaXMubGl2ZVNvY2tldC50cmlnZ2VyRE9NKFwib25CZWZvcmVFbFVwZGF0ZWRcIiwgW2Zyb21FbCwgdG9FbF0pXG4gICAgbGV0IGhvb2sgPSB0aGlzLmdldEhvb2soZnJvbUVsKVxuICAgIGxldCBpc0lnbm9yZWQgPSBob29rICYmIERPTS5pc0lnbm9yZWQoZnJvbUVsLCB0aGlzLmJpbmRpbmcoUEhYX1VQREFURSkpXG4gICAgaWYoaG9vayAmJiAhZnJvbUVsLmlzRXF1YWxOb2RlKHRvRWwpICYmICEoaXNJZ25vcmVkICYmIGlzRXF1YWxPYmooZnJvbUVsLmRhdGFzZXQsIHRvRWwuZGF0YXNldCkpKXtcbiAgICAgIGhvb2suX19iZWZvcmVVcGRhdGUoKVxuICAgICAgcmV0dXJuIGhvb2tcbiAgICB9XG4gIH1cblxuICBtYXliZU1vdW50ZWQoZWwpe1xuICAgIGxldCBwaHhNb3VudGVkID0gZWwuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfTU9VTlRFRCkpXG4gICAgbGV0IGhhc0JlZW5JbnZva2VkID0gcGh4TW91bnRlZCAmJiBET00ucHJpdmF0ZShlbCwgXCJtb3VudGVkXCIpXG4gICAgaWYocGh4TW91bnRlZCAmJiAhaGFzQmVlbkludm9rZWQpe1xuICAgICAgdGhpcy5saXZlU29ja2V0LmV4ZWNKUyhlbCwgcGh4TW91bnRlZClcbiAgICAgIERPTS5wdXRQcml2YXRlKGVsLCBcIm1vdW50ZWRcIiwgdHJ1ZSlcbiAgICB9XG4gIH1cblxuICBtYXliZUFkZE5ld0hvb2soZWwpe1xuICAgIGxldCBuZXdIb29rID0gdGhpcy5hZGRIb29rKGVsKVxuICAgIGlmKG5ld0hvb2speyBuZXdIb29rLl9fbW91bnRlZCgpIH1cbiAgfVxuXG4gIHBlcmZvcm1QYXRjaChwYXRjaCwgcHJ1bmVDaWRzLCBpc0pvaW5QYXRjaCA9IGZhbHNlKXtcbiAgICBsZXQgcmVtb3ZlZEVscyA9IFtdXG4gICAgbGV0IHBoeENoaWxkcmVuQWRkZWQgPSBmYWxzZVxuICAgIGxldCB1cGRhdGVkSG9va0lkcyA9IG5ldyBTZXQoKVxuXG4gICAgdGhpcy5saXZlU29ja2V0LnRyaWdnZXJET00oXCJvblBhdGNoU3RhcnRcIiwgW3BhdGNoLnRhcmdldENvbnRhaW5lcl0pXG5cbiAgICBwYXRjaC5hZnRlcihcImFkZGVkXCIsIGVsID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50cmlnZ2VyRE9NKFwib25Ob2RlQWRkZWRcIiwgW2VsXSlcbiAgICAgIGxldCBwaHhWaWV3cG9ydFRvcCA9IHRoaXMuYmluZGluZyhQSFhfVklFV1BPUlRfVE9QKVxuICAgICAgbGV0IHBoeFZpZXdwb3J0Qm90dG9tID0gdGhpcy5iaW5kaW5nKFBIWF9WSUVXUE9SVF9CT1RUT00pXG4gICAgICBET00ubWFpbnRhaW5Qcml2YXRlSG9va3MoZWwsIGVsLCBwaHhWaWV3cG9ydFRvcCwgcGh4Vmlld3BvcnRCb3R0b20pXG4gICAgICB0aGlzLm1heWJlQWRkTmV3SG9vayhlbClcbiAgICAgIGlmKGVsLmdldEF0dHJpYnV0ZSl7IHRoaXMubWF5YmVNb3VudGVkKGVsKSB9XG4gICAgfSlcblxuICAgIHBhdGNoLmFmdGVyKFwicGh4Q2hpbGRBZGRlZFwiLCBlbCA9PiB7XG4gICAgICBpZihET00uaXNQaHhTdGlja3koZWwpKXtcbiAgICAgICAgdGhpcy5saXZlU29ja2V0LmpvaW5Sb290Vmlld3MoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGh4Q2hpbGRyZW5BZGRlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYmVmb3JlKFwidXBkYXRlZFwiLCAoZnJvbUVsLCB0b0VsKSA9PiB7XG4gICAgICBsZXQgaG9vayA9IHRoaXMudHJpZ2dlckJlZm9yZVVwZGF0ZUhvb2soZnJvbUVsLCB0b0VsKVxuICAgICAgaWYoaG9vayl7IHVwZGF0ZWRIb29rSWRzLmFkZChmcm9tRWwuaWQpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJ1cGRhdGVkXCIsIGVsID0+IHtcbiAgICAgIGlmKHVwZGF0ZWRIb29rSWRzLmhhcyhlbC5pZCkpeyB0aGlzLmdldEhvb2soZWwpLl9fdXBkYXRlZCgpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJkaXNjYXJkZWRcIiwgKGVsKSA9PiB7XG4gICAgICBpZihlbC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpeyByZW1vdmVkRWxzLnB1c2goZWwpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJ0cmFuc2l0aW9uc0Rpc2NhcmRlZFwiLCBlbHMgPT4gdGhpcy5hZnRlckVsZW1lbnRzUmVtb3ZlZChlbHMsIHBydW5lQ2lkcykpXG4gICAgcGF0Y2gucGVyZm9ybShpc0pvaW5QYXRjaClcbiAgICB0aGlzLmFmdGVyRWxlbWVudHNSZW1vdmVkKHJlbW92ZWRFbHMsIHBydW5lQ2lkcylcblxuICAgIHRoaXMubGl2ZVNvY2tldC50cmlnZ2VyRE9NKFwib25QYXRjaEVuZFwiLCBbcGF0Y2gudGFyZ2V0Q29udGFpbmVyXSlcbiAgICByZXR1cm4gcGh4Q2hpbGRyZW5BZGRlZFxuICB9XG5cbiAgYWZ0ZXJFbGVtZW50c1JlbW92ZWQoZWxlbWVudHMsIHBydW5lQ2lkcyl7XG4gICAgbGV0IGRlc3Ryb3llZENJRHMgPSBbXVxuICAgIGVsZW1lbnRzLmZvckVhY2gocGFyZW50ID0+IHtcbiAgICAgIGxldCBjb21wb25lbnRzID0gRE9NLmFsbChwYXJlbnQsIGBbJHtQSFhfQ09NUE9ORU5UfV1gKVxuICAgICAgbGV0IGhvb2tzID0gRE9NLmFsbChwYXJlbnQsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX0hPT0spfV0sIFtkYXRhLXBoeC1ob29rXWApXG4gICAgICBjb21wb25lbnRzLmNvbmNhdChwYXJlbnQpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBsZXQgY2lkID0gdGhpcy5jb21wb25lbnRJRChlbClcbiAgICAgICAgaWYoaXNDaWQoY2lkKSAmJiBkZXN0cm95ZWRDSURzLmluZGV4T2YoY2lkKSA9PT0gLTEpeyBkZXN0cm95ZWRDSURzLnB1c2goY2lkKSB9XG4gICAgICB9KVxuICAgICAgaG9va3MuY29uY2F0KHBhcmVudCkuZm9yRWFjaChob29rRWwgPT4ge1xuICAgICAgICBsZXQgaG9vayA9IHRoaXMuZ2V0SG9vayhob29rRWwpXG4gICAgICAgIGhvb2sgJiYgdGhpcy5kZXN0cm95SG9vayhob29rKVxuICAgICAgfSlcbiAgICB9KVxuICAgIC8vIFdlIHNob3VsZCBub3QgcHJ1bmVDaWRzIG9uIGpvaW5zLiBPdGhlcndpc2UsIGluIGNhc2Ugb2ZcbiAgICAvLyByZWpvaW5zLCB3ZSBtYXkgbm90aWZ5IGNpZHMgdGhhdCBubyBsb25nZXIgYmVsb25nIHRvIHRoZVxuICAgIC8vIGN1cnJlbnQgTGl2ZVZpZXcgdG8gYmUgcmVtb3ZlZC5cbiAgICBpZihwcnVuZUNpZHMpe1xuICAgICAgdGhpcy5tYXliZVB1c2hDb21wb25lbnRzRGVzdHJveWVkKGRlc3Ryb3llZENJRHMpXG4gICAgfVxuICB9XG5cbiAgam9pbk5ld0NoaWxkcmVuKCl7XG4gICAgRE9NLmZpbmRQaHhDaGlsZHJlbih0aGlzLmVsLCB0aGlzLmlkKS5mb3JFYWNoKGVsID0+IHRoaXMuam9pbkNoaWxkKGVsKSlcbiAgfVxuXG4gIG1heWJlUmVjb3ZlckZvcm1zKGh0bWwsIGNhbGxiYWNrKXtcbiAgICBjb25zdCBwaHhDaGFuZ2UgPSB0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIilcbiAgICBjb25zdCBvbGRGb3JtcyA9IHRoaXMucm9vdC5mb3Jtc0ZvclJlY292ZXJ5XG4gICAgLy8gU28gd2h5IGRvIHdlIGNyZWF0ZSBhIHRlbXBsYXRlIGVsZW1lbnQgaGVyZT9cbiAgICAvLyBPbmUgd2F5IHRvIHJlY292ZXIgZm9ybXMgd291bGQgYmUgdG8gaW1tZWRpYXRlbHkgYXBwbHkgdGhlIG1vdW50XG4gICAgLy8gcGF0Y2ggYW5kIHRoZW4gYWZ0ZXJ3YXJkcyByZWNvdmVyIHRoZSBmb3Jtcy4gSG93ZXZlciwgdGhpcyB3b3VsZFxuICAgIC8vIGNhdXNlIGEgZmxpY2tlciwgYmVjYXVzZSB0aGUgbW91bnQgcGF0Y2ggd291bGQgcmVtb3ZlIHRoZSBmb3JtIGNvbnRlbnRcbiAgICAvLyB1bnRpbCBpdCBpcyByZXN0b3JlZC4gVGhlcmVmb3JlIExWIGRlY2lkZWQgdG8gZG8gZm9ybSByZWNvdmVyeSB3aXRoIHRoZVxuICAgIC8vIHJhdyBIVE1MIGJlZm9yZSBpdCBpcyBhcHBsaWVkIGFuZCBkZWxheSB0aGUgbW91bnQgcGF0Y2ggdW50aWwgdGhlIGZvcm1cbiAgICAvLyByZWNvdmVyeSBldmVudHMgYXJlIGRvbmUuXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFxuICAgIC8vIGJlY2F1c2Ugd2Ugd29yayB3aXRoIGEgdGVtcGxhdGUgZWxlbWVudCwgd2UgbXVzdCBtYW51YWxseSBjb3B5IHRoZSBhdHRyaWJ1dGVzXG4gICAgLy8gb3RoZXJ3aXNlIHRoZSBvd25lciAvIHRhcmdldCBoZWxwZXJzIGRvbid0IHdvcmsgcHJvcGVybHlcbiAgICBjb25zdCByb290RWwgPSB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkXG4gICAgcm9vdEVsLmlkID0gdGhpcy5pZFxuICAgIHJvb3RFbC5zZXRBdHRyaWJ1dGUoUEhYX1JPT1RfSUQsIHRoaXMucm9vdC5pZClcbiAgICByb290RWwuc2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OLCB0aGlzLmdldFNlc3Npb24oKSlcbiAgICByb290RWwuc2V0QXR0cmlidXRlKFBIWF9TVEFUSUMsIHRoaXMuZ2V0U3RhdGljKCkpXG4gICAgcm9vdEVsLnNldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lELCB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmlkIDogbnVsbClcblxuICAgIC8vIHdlIGdvIG92ZXIgYWxsIGZvcm0gZWxlbWVudHMgaW4gdGhlIG5ldyBIVE1MIGZvciB0aGUgTFZcbiAgICAvLyBhbmQgbG9vayBmb3Igb2xkIGZvcm1zIGluIHRoZSBgZm9ybXNGb3JSZWNvdmVyeWAgb2JqZWN0O1xuICAgIC8vIHRoZSBmb3Jtc0ZvclJlY292ZXJ5IGNhbiBhbHNvIGNvbnRhaW4gZm9ybXMgZnJvbSBjaGlsZCB2aWV3c1xuICAgIGNvbnN0IGZvcm1zVG9SZWNvdmVyID1cbiAgICAgIC8vIHdlIGdvIG92ZXIgYWxsIGZvcm1zIGluIHRoZSBuZXcgRE9NOyBiZWNhdXNlIHRoaXMgaXMgb25seSB0aGUgSFRNTCBmb3IgdGhlIGN1cnJlbnRcbiAgICAgIC8vIHZpZXcsIHdlIGNhbiBiZSBzdXJlIHRoYXQgYWxsIGZvcm1zIGFyZSBvd25lZCBieSB0aGlzIHZpZXc6XG4gICAgICBET00uYWxsKHRlbXBsYXRlLmNvbnRlbnQsIFwiZm9ybVwiKVxuICAgICAgICAvLyBvbmx5IHJlY292ZXIgZm9ybXMgdGhhdCBoYXZlIGFuIGlkIGFuZCBhcmUgaW4gdGhlIG9sZCBET01cbiAgICAgICAgLmZpbHRlcihuZXdGb3JtID0+IG5ld0Zvcm0uaWQgJiYgb2xkRm9ybXNbbmV3Rm9ybS5pZF0pXG4gICAgICAgIC8vIGFiYW5kb24gZm9ybXMgd2UgYWxyZWFkeSB0cmllZCB0byByZWNvdmVyIHRvIHByZXZlbnQgbG9vcGluZyBhIGZhaWxlZCBzdGF0ZVxuICAgICAgICAuZmlsdGVyKG5ld0Zvcm0gPT4gIXRoaXMucGVuZGluZ0Zvcm1zLmhhcyhuZXdGb3JtLmlkKSlcbiAgICAgICAgLy8gb25seSByZWNvdmVyIGlmIHRoZSBmb3JtIGhhcyB0aGUgc2FtZSBwaHgtY2hhbmdlIHZhbHVlXG4gICAgICAgIC5maWx0ZXIobmV3Rm9ybSA9PiBvbGRGb3Jtc1tuZXdGb3JtLmlkXS5nZXRBdHRyaWJ1dGUocGh4Q2hhbmdlKSA9PT0gbmV3Rm9ybS5nZXRBdHRyaWJ1dGUocGh4Q2hhbmdlKSlcbiAgICAgICAgLm1hcChuZXdGb3JtID0+IHtcbiAgICAgICAgICByZXR1cm4gW29sZEZvcm1zW25ld0Zvcm0uaWRdLCBuZXdGb3JtXVxuICAgICAgICB9KVxuXG4gICAgaWYoZm9ybXNUb1JlY292ZXIubGVuZ3RoID09PSAwKXtcbiAgICAgIHJldHVybiBjYWxsYmFjaygpXG4gICAgfVxuXG4gICAgZm9ybXNUb1JlY292ZXIuZm9yRWFjaCgoW29sZEZvcm0sIG5ld0Zvcm1dLCBpKSA9PiB7XG4gICAgICB0aGlzLnBlbmRpbmdGb3Jtcy5hZGQobmV3Rm9ybS5pZClcbiAgICAgIC8vIGl0IGlzIGltcG9ydGFudCB0byB1c2UgdGhlIGZpcnN0RWxlbWVudENoaWxkIG9mIHRoZSB0ZW1wbGF0ZSBjb250ZW50XG4gICAgICAvLyBiZWNhdXNlIHdoZW4gdHJhdmVyc2luZyBhIGRvY3VtZW50RnJhZ21lbnQgdXNpbmcgcGFyZW50Tm9kZSwgd2Ugd29uJ3QgZXZlciBhcnJpdmUgYXRcbiAgICAgIC8vIHRoZSBmcmFnbWVudDsgYXMgdGhlIHRlbXBsYXRlIGlzIGFsd2F5cyBhIExpdmVWaWV3LCB3ZSBjYW4gYmUgc3VyZSB0aGF0IHRoZXJlIGlzIG9ubHlcbiAgICAgIC8vIG9uZSBjaGlsZCBvbiB0aGUgcm9vdCBsZXZlbFxuICAgICAgdGhpcy5wdXNoRm9ybVJlY292ZXJ5KG9sZEZvcm0sIG5ld0Zvcm0sIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsICgpID0+IHtcbiAgICAgICAgdGhpcy5wZW5kaW5nRm9ybXMuZGVsZXRlKG5ld0Zvcm0uaWQpXG4gICAgICAgIC8vIHdlIG9ubHkgY2FsbCB0aGUgY2FsbGJhY2sgb25jZSBhbGwgZm9ybXMgaGF2ZSBiZWVuIHJlY292ZXJlZFxuICAgICAgICBpZihpID09PSBmb3Jtc1RvUmVjb3Zlci5sZW5ndGggLSAxKXtcbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGdldENoaWxkQnlJZChpZCl7IHJldHVybiB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF1baWRdIH1cblxuICBnZXREZXNjZW5kZW50QnlFbChlbCl7XG4gICAgaWYoZWwuaWQgPT09IHRoaXMuaWQpe1xuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5bZWwuZ2V0QXR0cmlidXRlKFBIWF9QQVJFTlRfSUQpXT8uW2VsLmlkXVxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lEZXNjZW5kZW50KGlkKXtcbiAgICBmb3IobGV0IHBhcmVudElkIGluIHRoaXMucm9vdC5jaGlsZHJlbil7XG4gICAgICBmb3IobGV0IGNoaWxkSWQgaW4gdGhpcy5yb290LmNoaWxkcmVuW3BhcmVudElkXSl7XG4gICAgICAgIGlmKGNoaWxkSWQgPT09IGlkKXsgcmV0dXJuIHRoaXMucm9vdC5jaGlsZHJlbltwYXJlbnRJZF1bY2hpbGRJZF0uZGVzdHJveSgpIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBqb2luQ2hpbGQoZWwpe1xuICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGRCeUlkKGVsLmlkKVxuICAgIGlmKCFjaGlsZCl7XG4gICAgICBsZXQgdmlldyA9IG5ldyBWaWV3KGVsLCB0aGlzLmxpdmVTb2NrZXQsIHRoaXMpXG4gICAgICB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF1bdmlldy5pZF0gPSB2aWV3XG4gICAgICB2aWV3LmpvaW4oKVxuICAgICAgdGhpcy5jaGlsZEpvaW5zKytcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgaXNKb2luUGVuZGluZygpeyByZXR1cm4gdGhpcy5qb2luUGVuZGluZyB9XG5cbiAgYWNrSm9pbihfY2hpbGQpe1xuICAgIHRoaXMuY2hpbGRKb2lucy0tXG5cbiAgICBpZih0aGlzLmNoaWxkSm9pbnMgPT09IDApe1xuICAgICAgaWYodGhpcy5wYXJlbnQpe1xuICAgICAgICB0aGlzLnBhcmVudC5hY2tKb2luKHRoaXMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9uQWxsQ2hpbGRKb2luc0NvbXBsZXRlKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkFsbENoaWxkSm9pbnNDb21wbGV0ZSgpe1xuICAgIC8vIHdlIGNhbiBjbGVhciBwZW5kaW5nIGZvcm0gcmVjb3ZlcmllcyBub3cgdGhhdCB3ZSd2ZSBqb2luZWQuXG4gICAgLy8gVGhleSBlaXRoZXIgYWxsIHJlc29sdmVkIG9yIHdlcmUgYWJhbmRvbmVkXG4gICAgdGhpcy5wZW5kaW5nRm9ybXMuY2xlYXIoKVxuICAgIC8vIHdlIGNhbiBhbHNvIGNsZWFyIHRoZSBmb3Jtc0ZvclJlY292ZXJ5IG9iamVjdCB0byBub3Qga2VlcCBvbGQgZm9ybSBlbGVtZW50cyBhcm91bmRcbiAgICB0aGlzLmZvcm1zRm9yUmVjb3ZlcnkgPSB7fVxuICAgIHRoaXMuam9pbkNhbGxiYWNrKCgpID0+IHtcbiAgICAgIHRoaXMucGVuZGluZ0pvaW5PcHMuZm9yRWFjaCgoW3ZpZXcsIG9wXSkgPT4ge1xuICAgICAgICBpZighdmlldy5pc0Rlc3Ryb3llZCgpKXsgb3AoKSB9XG4gICAgICB9KVxuICAgICAgdGhpcy5wZW5kaW5nSm9pbk9wcyA9IFtdXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZShkaWZmLCBldmVudHMsIGlzUGVuZGluZz1mYWxzZSl7XG4gICAgaWYodGhpcy5pc0pvaW5QZW5kaW5nKCkgfHwgKHRoaXMubGl2ZVNvY2tldC5oYXNQZW5kaW5nTGluaygpICYmIHRoaXMucm9vdC5pc01haW4oKSkpe1xuICAgICAgLy8gZG9uJ3QgbXV0YXRlIGlmIHRoaXMgaXMgYWxyZWFkeSBhIHBlbmRpbmcgZGlmZlxuICAgICAgaWYoIWlzUGVuZGluZyl7XG4gICAgICAgIHRoaXMucGVuZGluZ0RpZmZzLnB1c2goe2RpZmYsIGV2ZW50c30pXG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICB0aGlzLnJlbmRlcmVkLm1lcmdlRGlmZihkaWZmKVxuICAgIGxldCBwaHhDaGlsZHJlbkFkZGVkID0gZmFsc2VcblxuICAgIC8vIFdoZW4gdGhlIGRpZmYgb25seSBjb250YWlucyBjb21wb25lbnQgZGlmZnMsIHRoZW4gd2FsayBjb21wb25lbnRzXG4gICAgLy8gYW5kIHBhdGNoIG9ubHkgdGhlIHBhcmVudCBjb21wb25lbnQgY29udGFpbmVycyBmb3VuZCBpbiB0aGUgZGlmZi5cbiAgICAvLyBPdGhlcndpc2UsIHBhdGNoIGVudGlyZSBMViBjb250YWluZXIuXG4gICAgaWYodGhpcy5yZW5kZXJlZC5pc0NvbXBvbmVudE9ubHlEaWZmKGRpZmYpKXtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50aW1lKFwiY29tcG9uZW50IHBhdGNoIGNvbXBsZXRlXCIsICgpID0+IHtcbiAgICAgICAgbGV0IHBhcmVudENpZHMgPSBET00uZmluZEV4aXN0aW5nUGFyZW50Q0lEcyh0aGlzLmVsLCB0aGlzLnJlbmRlcmVkLmNvbXBvbmVudENJRHMoZGlmZikpXG4gICAgICAgIHBhcmVudENpZHMuZm9yRWFjaChwYXJlbnRDSUQgPT4ge1xuICAgICAgICAgIGlmKHRoaXMuY29tcG9uZW50UGF0Y2godGhpcy5yZW5kZXJlZC5nZXRDb21wb25lbnQoZGlmZiwgcGFyZW50Q0lEKSwgcGFyZW50Q0lEKSl7IHBoeENoaWxkcmVuQWRkZWQgPSB0cnVlIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmKCFpc0VtcHR5KGRpZmYpKXtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50aW1lKFwiZnVsbCBwYXRjaCBjb21wbGV0ZVwiLCAoKSA9PiB7XG4gICAgICAgIGxldCBbaHRtbCwgc3RyZWFtc10gPSB0aGlzLnJlbmRlckNvbnRhaW5lcihkaWZmLCBcInVwZGF0ZVwiKVxuICAgICAgICBsZXQgcGF0Y2ggPSBuZXcgRE9NUGF0Y2godGhpcywgdGhpcy5lbCwgdGhpcy5pZCwgaHRtbCwgc3RyZWFtcywgbnVsbClcbiAgICAgICAgcGh4Q2hpbGRyZW5BZGRlZCA9IHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCB0cnVlKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLmxpdmVTb2NrZXQuZGlzcGF0Y2hFdmVudHMoZXZlbnRzKVxuICAgIGlmKHBoeENoaWxkcmVuQWRkZWQpeyB0aGlzLmpvaW5OZXdDaGlsZHJlbigpIH1cblxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICByZW5kZXJDb250YWluZXIoZGlmZiwga2luZCl7XG4gICAgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC50aW1lKGB0b1N0cmluZyBkaWZmICgke2tpbmR9KWAsICgpID0+IHtcbiAgICAgIGxldCB0YWcgPSB0aGlzLmVsLnRhZ05hbWVcbiAgICAgIC8vIERvbid0IHNraXAgYW55IGNvbXBvbmVudCBpbiB0aGUgZGlmZiBub3IgYW55IG1hcmtlZCBhcyBwcnVuZWRcbiAgICAgIC8vIChhcyB0aGV5IG1heSBoYXZlIGJlZW4gYWRkZWQgYmFjaylcbiAgICAgIGxldCBjaWRzID0gZGlmZiA/IHRoaXMucmVuZGVyZWQuY29tcG9uZW50Q0lEcyhkaWZmKSA6IG51bGxcbiAgICAgIGxldCBbaHRtbCwgc3RyZWFtc10gPSB0aGlzLnJlbmRlcmVkLnRvU3RyaW5nKGNpZHMpXG4gICAgICByZXR1cm4gW2A8JHt0YWd9PiR7aHRtbH08LyR7dGFnfT5gLCBzdHJlYW1zXVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRQYXRjaChkaWZmLCBjaWQpe1xuICAgIGlmKGlzRW1wdHkoZGlmZikpIHJldHVybiBmYWxzZVxuICAgIGxldCBbaHRtbCwgc3RyZWFtc10gPSB0aGlzLnJlbmRlcmVkLmNvbXBvbmVudFRvU3RyaW5nKGNpZClcbiAgICBsZXQgcGF0Y2ggPSBuZXcgRE9NUGF0Y2godGhpcywgdGhpcy5lbCwgdGhpcy5pZCwgaHRtbCwgc3RyZWFtcywgY2lkKVxuICAgIGxldCBjaGlsZHJlbkFkZGVkID0gdGhpcy5wZXJmb3JtUGF0Y2gocGF0Y2gsIHRydWUpXG4gICAgcmV0dXJuIGNoaWxkcmVuQWRkZWRcbiAgfVxuXG4gIGdldEhvb2soZWwpeyByZXR1cm4gdGhpcy52aWV3SG9va3NbVmlld0hvb2suZWxlbWVudElEKGVsKV0gfVxuXG4gIGFkZEhvb2soZWwpe1xuICAgIGxldCBob29rRWxJZCA9IFZpZXdIb29rLmVsZW1lbnRJRChlbClcblxuICAgIC8vIG9ubHkgZXZlciB0cnkgdG8gYWRkIGhvb2tzIHRvIGVsZW1lbnRzIG93bmVkIGJ5IHRoaXMgdmlld1xuICAgIGlmKGVsLmdldEF0dHJpYnV0ZSAmJiAhdGhpcy5vd25zRWxlbWVudChlbCkpeyByZXR1cm4gfVxuXG4gICAgaWYoaG9va0VsSWQgJiYgIXRoaXMudmlld0hvb2tzW2hvb2tFbElkXSl7XG4gICAgICAvLyBob29rIGNyZWF0ZWQsIGJ1dCBub3QgYXR0YWNoZWQgKGNyZWF0ZUhvb2sgZm9yIHdlYiBjb21wb25lbnQpXG4gICAgICBsZXQgaG9vayA9IERPTS5nZXRDdXN0b21FbEhvb2soZWwpIHx8IGxvZ0Vycm9yKGBubyBob29rIGZvdW5kIGZvciBjdXN0b20gZWxlbWVudDogJHtlbC5pZH1gKVxuICAgICAgdGhpcy52aWV3SG9va3NbaG9va0VsSWRdID0gaG9va1xuICAgICAgaG9vay5fX2F0dGFjaFZpZXcodGhpcylcbiAgICAgIHJldHVybiBob29rXG4gICAgfVxuICAgIGVsc2UgaWYoaG9va0VsSWQgfHwgIWVsLmdldEF0dHJpYnV0ZSl7XG4gICAgICAvLyBubyBob29rIGZvdW5kXG4gICAgICByZXR1cm5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbmV3IGhvb2sgZm91bmQgd2l0aCBwaHgtaG9vayBhdHRyaWJ1dGVcbiAgICAgIGxldCBob29rTmFtZSA9IGVsLmdldEF0dHJpYnV0ZShgZGF0YS1waHgtJHtQSFhfSE9PS31gKSB8fCBlbC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9IT09LKSlcbiAgICAgIGxldCBjYWxsYmFja3MgPSB0aGlzLmxpdmVTb2NrZXQuZ2V0SG9va0NhbGxiYWNrcyhob29rTmFtZSlcblxuICAgICAgaWYoY2FsbGJhY2tzKXtcbiAgICAgICAgaWYoIWVsLmlkKXsgbG9nRXJyb3IoYG5vIERPTSBJRCBmb3IgaG9vayBcIiR7aG9va05hbWV9XCIuIEhvb2tzIHJlcXVpcmUgYSB1bmlxdWUgSUQgb24gZWFjaCBlbGVtZW50LmAsIGVsKSB9XG4gICAgICAgIGxldCBob29rID0gbmV3IFZpZXdIb29rKHRoaXMsIGVsLCBjYWxsYmFja3MpXG4gICAgICAgIHRoaXMudmlld0hvb2tzW1ZpZXdIb29rLmVsZW1lbnRJRChob29rLmVsKV0gPSBob29rXG4gICAgICAgIHJldHVybiBob29rXG4gICAgICB9IGVsc2UgaWYoaG9va05hbWUgIT09IG51bGwpe1xuICAgICAgICBsb2dFcnJvcihgdW5rbm93biBob29rIGZvdW5kIGZvciBcIiR7aG9va05hbWV9XCJgLCBlbClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXN0cm95SG9vayhob29rKXtcbiAgICAvLyBfX2Rlc3Ryb3llZCBjbGVhcnMgdGhlIGVsZW1lbnRJRCBmcm9tIHRoZSBob29rLCB0aGVyZWZvcmVcbiAgICAvLyB3ZSBuZWVkIHRvIGdldCBpdCBiZWZvcmUgY2FsbGluZyBfX2Rlc3Ryb3llZFxuICAgIGNvbnN0IGhvb2tJZCA9IFZpZXdIb29rLmVsZW1lbnRJRChob29rLmVsKVxuICAgIGhvb2suX19kZXN0cm95ZWQoKVxuICAgIGhvb2suX19jbGVhbnVwX18oKVxuICAgIGRlbGV0ZSB0aGlzLnZpZXdIb29rc1tob29rSWRdXG4gIH1cblxuICBhcHBseVBlbmRpbmdVcGRhdGVzKCl7XG4gICAgLy8gVG8gcHJldmVudCByYWNlIGNvbmRpdGlvbnMgd2hlcmUgd2UgbWlnaHQgc3RpbGwgYmUgcGVuZGluZyBhIG5ld1xuICAgIC8vIG5hdmlnYXRpb24gb3IgdGhlIGpvaW4gaXMgc3RpbGwgcGVuZGluZywgYHRoaXMudXBkYXRlYCByZXR1cm5zIGZhbHNlXG4gICAgLy8gaWYgdGhlIGRpZmYgd2FzIG5vdCBhcHBsaWVkLlxuICAgIHRoaXMucGVuZGluZ0RpZmZzID0gdGhpcy5wZW5kaW5nRGlmZnMuZmlsdGVyKFxuICAgICAgKHtkaWZmLCBldmVudHN9KSA9PiAhdGhpcy51cGRhdGUoZGlmZiwgZXZlbnRzLCB0cnVlKSxcbiAgICApXG4gICAgdGhpcy5lYWNoQ2hpbGQoKGNoaWxkKSA9PiBjaGlsZC5hcHBseVBlbmRpbmdVcGRhdGVzKCkpXG4gIH1cblxuICBlYWNoQ2hpbGQoY2FsbGJhY2spe1xuICAgIGxldCBjaGlsZHJlbiA9IHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXSB8fCB7fVxuICAgIGZvcihsZXQgaWQgaW4gY2hpbGRyZW4peyBjYWxsYmFjayh0aGlzLmdldENoaWxkQnlJZChpZCkpIH1cbiAgfVxuXG4gIG9uQ2hhbm5lbChldmVudCwgY2Ipe1xuICAgIHRoaXMubGl2ZVNvY2tldC5vbkNoYW5uZWwodGhpcy5jaGFubmVsLCBldmVudCwgcmVzcCA9PiB7XG4gICAgICBpZih0aGlzLmlzSm9pblBlbmRpbmcoKSl7XG4gICAgICAgIHRoaXMucm9vdC5wZW5kaW5nSm9pbk9wcy5wdXNoKFt0aGlzLCAoKSA9PiBjYihyZXNwKV0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiBjYihyZXNwKSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYmluZENoYW5uZWwoKXtcbiAgICAvLyBUaGUgZGlmZiBldmVudCBzaG91bGQgYmUgaGFuZGxlZCBieSB0aGUgcmVndWxhciB1cGRhdGUgb3BlcmF0aW9ucy5cbiAgICAvLyBBbGwgb3RoZXIgb3BlcmF0aW9ucyBhcmUgcXVldWVkIHRvIGJlIGFwcGxpZWQgb25seSBhZnRlciBqb2luLlxuICAgIHRoaXMubGl2ZVNvY2tldC5vbkNoYW5uZWwodGhpcy5jaGFubmVsLCBcImRpZmZcIiwgKHJhd0RpZmYpID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgdGhpcy5hcHBseURpZmYoXCJ1cGRhdGVcIiwgcmF3RGlmZiwgKHtkaWZmLCBldmVudHN9KSA9PiB0aGlzLnVwZGF0ZShkaWZmLCBldmVudHMpKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHRoaXMub25DaGFubmVsKFwicmVkaXJlY3RcIiwgKHt0bywgZmxhc2h9KSA9PiB0aGlzLm9uUmVkaXJlY3Qoe3RvLCBmbGFzaH0pKVxuICAgIHRoaXMub25DaGFubmVsKFwibGl2ZV9wYXRjaFwiLCAocmVkaXIpID0+IHRoaXMub25MaXZlUGF0Y2gocmVkaXIpKVxuICAgIHRoaXMub25DaGFubmVsKFwibGl2ZV9yZWRpcmVjdFwiLCAocmVkaXIpID0+IHRoaXMub25MaXZlUmVkaXJlY3QocmVkaXIpKVxuICAgIHRoaXMuY2hhbm5lbC5vbkVycm9yKHJlYXNvbiA9PiB0aGlzLm9uRXJyb3IocmVhc29uKSlcbiAgICB0aGlzLmNoYW5uZWwub25DbG9zZShyZWFzb24gPT4gdGhpcy5vbkNsb3NlKHJlYXNvbikpXG4gIH1cblxuICBkZXN0cm95QWxsQ2hpbGRyZW4oKXsgdGhpcy5lYWNoQ2hpbGQoY2hpbGQgPT4gY2hpbGQuZGVzdHJveSgpKSB9XG5cbiAgb25MaXZlUmVkaXJlY3QocmVkaXIpe1xuICAgIGxldCB7dG8sIGtpbmQsIGZsYXNofSA9IHJlZGlyXG4gICAgbGV0IHVybCA9IHRoaXMuZXhwYW5kVVJMKHRvKVxuICAgIGxldCBlID0gbmV3IEN1c3RvbUV2ZW50KFwicGh4OnNlcnZlci1uYXZpZ2F0ZVwiLCB7ZGV0YWlsOiB7dG8sIGtpbmQsIGZsYXNofX0pXG4gICAgdGhpcy5saXZlU29ja2V0Lmhpc3RvcnlSZWRpcmVjdChlLCB1cmwsIGtpbmQsIGZsYXNoKVxuICB9XG5cbiAgb25MaXZlUGF0Y2gocmVkaXIpe1xuICAgIGxldCB7dG8sIGtpbmR9ID0gcmVkaXJcbiAgICB0aGlzLmhyZWYgPSB0aGlzLmV4cGFuZFVSTCh0bylcbiAgICB0aGlzLmxpdmVTb2NrZXQuaGlzdG9yeVBhdGNoKHRvLCBraW5kKVxuICB9XG5cbiAgZXhwYW5kVVJMKHRvKXtcbiAgICByZXR1cm4gdG8uc3RhcnRzV2l0aChcIi9cIikgPyBgJHt3aW5kb3cubG9jYXRpb24ucHJvdG9jb2x9Ly8ke3dpbmRvdy5sb2NhdGlvbi5ob3N0fSR7dG99YCA6IHRvXG4gIH1cblxuICBvblJlZGlyZWN0KHt0bywgZmxhc2gsIHJlbG9hZFRva2VufSl7IHRoaXMubGl2ZVNvY2tldC5yZWRpcmVjdCh0bywgZmxhc2gsIHJlbG9hZFRva2VuKSB9XG5cbiAgaXNEZXN0cm95ZWQoKXsgcmV0dXJuIHRoaXMuZGVzdHJveWVkIH1cblxuICBqb2luRGVhZCgpeyB0aGlzLmlzRGVhZCA9IHRydWUgfVxuXG4gIGpvaW5QdXNoKCl7XG4gICAgdGhpcy5qb2luUHVzaCA9IHRoaXMuam9pblB1c2ggfHwgdGhpcy5jaGFubmVsLmpvaW4oKVxuICAgIHJldHVybiB0aGlzLmpvaW5QdXNoXG4gIH1cblxuICBqb2luKGNhbGxiYWNrKXtcbiAgICB0aGlzLnNob3dMb2FkZXIodGhpcy5saXZlU29ja2V0LmxvYWRlclRpbWVvdXQpXG4gICAgdGhpcy5iaW5kQ2hhbm5lbCgpXG4gICAgaWYodGhpcy5pc01haW4oKSl7XG4gICAgICB0aGlzLnN0b3BDYWxsYmFjayA9IHRoaXMubGl2ZVNvY2tldC53aXRoUGFnZUxvYWRpbmcoe3RvOiB0aGlzLmhyZWYsIGtpbmQ6IFwiaW5pdGlhbFwifSlcbiAgICB9XG4gICAgdGhpcy5qb2luQ2FsbGJhY2sgPSAob25Eb25lKSA9PiB7XG4gICAgICBvbkRvbmUgPSBvbkRvbmUgfHwgZnVuY3Rpb24oKXt9XG4gICAgICBjYWxsYmFjayA/IGNhbGxiYWNrKHRoaXMuam9pbkNvdW50LCBvbkRvbmUpIDogb25Eb25lKClcbiAgICB9XG5cbiAgICB0aGlzLndyYXBQdXNoKCgpID0+IHRoaXMuY2hhbm5lbC5qb2luKCksIHtcbiAgICAgIG9rOiAocmVzcCkgPT4gdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4gdGhpcy5vbkpvaW4ocmVzcCkpLFxuICAgICAgZXJyb3I6IChlcnJvcikgPT4gdGhpcy5vbkpvaW5FcnJvcihlcnJvciksXG4gICAgICB0aW1lb3V0OiAoKSA9PiB0aGlzLm9uSm9pbkVycm9yKHtyZWFzb246IFwidGltZW91dFwifSlcbiAgICB9KVxuICB9XG5cbiAgb25Kb2luRXJyb3IocmVzcCl7XG4gICAgaWYocmVzcC5yZWFzb24gPT09IFwicmVsb2FkXCIpe1xuICAgICAgdGhpcy5sb2coXCJlcnJvclwiLCAoKSA9PiBbYGZhaWxlZCBtb3VudCB3aXRoICR7cmVzcC5zdGF0dXN9LiBGYWxsaW5nIGJhY2sgdG8gcGFnZSByZWxvYWRgLCByZXNwXSlcbiAgICAgIHRoaXMub25SZWRpcmVjdCh7dG86IHRoaXMucm9vdC5ocmVmLCByZWxvYWRUb2tlbjogcmVzcC50b2tlbn0pXG4gICAgICByZXR1cm5cbiAgICB9IGVsc2UgaWYocmVzcC5yZWFzb24gPT09IFwidW5hdXRob3JpemVkXCIgfHwgcmVzcC5yZWFzb24gPT09IFwic3RhbGVcIil7XG4gICAgICB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtcInVuYXV0aG9yaXplZCBsaXZlX3JlZGlyZWN0LiBGYWxsaW5nIGJhY2sgdG8gcGFnZSByZXF1ZXN0XCIsIHJlc3BdKVxuICAgICAgdGhpcy5vblJlZGlyZWN0KHt0bzogdGhpcy5yb290LmhyZWYsIGZsYXNoOiB0aGlzLmZsYXNofSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZihyZXNwLnJlZGlyZWN0IHx8IHJlc3AubGl2ZV9yZWRpcmVjdCl7XG4gICAgICB0aGlzLmpvaW5QZW5kaW5nID0gZmFsc2VcbiAgICAgIHRoaXMuY2hhbm5lbC5sZWF2ZSgpXG4gICAgfVxuICAgIGlmKHJlc3AucmVkaXJlY3QpeyByZXR1cm4gdGhpcy5vblJlZGlyZWN0KHJlc3AucmVkaXJlY3QpIH1cbiAgICBpZihyZXNwLmxpdmVfcmVkaXJlY3QpeyByZXR1cm4gdGhpcy5vbkxpdmVSZWRpcmVjdChyZXNwLmxpdmVfcmVkaXJlY3QpIH1cbiAgICB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtcInVuYWJsZSB0byBqb2luXCIsIHJlc3BdKVxuICAgIGlmKHRoaXMuaXNNYWluKCkpe1xuICAgICAgdGhpcy5kaXNwbGF5RXJyb3IoW1BIWF9MT0FESU5HX0NMQVNTLCBQSFhfRVJST1JfQ0xBU1MsIFBIWF9TRVJWRVJfRVJST1JfQ0xBU1NdKVxuICAgICAgaWYodGhpcy5saXZlU29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLmxpdmVTb2NrZXQucmVsb2FkV2l0aEppdHRlcih0aGlzKSB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKHRoaXMuam9pbkF0dGVtcHRzID49IE1BWF9DSElMRF9KT0lOX0FUVEVNUFRTKXtcbiAgICAgICAgLy8gcHV0IHRoZSByb290IHJldmlldyBpbnRvIHBlcm1hbmVudCBlcnJvciBzdGF0ZSwgYnV0IGRvbid0IGRlc3Ryb3kgaXQgYXMgaXQgY2FuIHJlbWFpbiBhY3RpdmVcbiAgICAgICAgdGhpcy5yb290LmRpc3BsYXlFcnJvcihbUEhYX0xPQURJTkdfQ0xBU1MsIFBIWF9FUlJPUl9DTEFTUywgUEhYX1NFUlZFUl9FUlJPUl9DTEFTU10pXG4gICAgICAgIHRoaXMubG9nKFwiZXJyb3JcIiwgKCkgPT4gW2BnaXZpbmcgdXAgdHJ5aW5nIHRvIG1vdW50IGFmdGVyICR7TUFYX0NISUxEX0pPSU5fQVRURU1QVFN9IHRyaWVzYCwgcmVzcF0pXG4gICAgICAgIHRoaXMuZGVzdHJveSgpXG4gICAgICB9XG4gICAgICBsZXQgdHJ1ZUNoaWxkRWwgPSBET00uYnlJZCh0aGlzLmVsLmlkKVxuICAgICAgaWYodHJ1ZUNoaWxkRWwpe1xuICAgICAgICBET00ubWVyZ2VBdHRycyh0cnVlQ2hpbGRFbCwgdGhpcy5lbClcbiAgICAgICAgdGhpcy5kaXNwbGF5RXJyb3IoW1BIWF9MT0FESU5HX0NMQVNTLCBQSFhfRVJST1JfQ0xBU1MsIFBIWF9TRVJWRVJfRVJST1JfQ0xBU1NdKVxuICAgICAgICB0aGlzLmVsID0gdHJ1ZUNoaWxkRWxcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25DbG9zZShyZWFzb24pe1xuICAgIGlmKHRoaXMuaXNEZXN0cm95ZWQoKSl7IHJldHVybiB9XG4gICAgaWYodGhpcy5pc01haW4oKSAmJiB0aGlzLmxpdmVTb2NrZXQuaGFzUGVuZGluZ0xpbmsoKSAmJiByZWFzb24gIT09IFwibGVhdmVcIil7XG4gICAgICByZXR1cm4gdGhpcy5saXZlU29ja2V0LnJlbG9hZFdpdGhKaXR0ZXIodGhpcylcbiAgICB9XG4gICAgdGhpcy5kZXN0cm95QWxsQ2hpbGRyZW4oKVxuICAgIHRoaXMubGl2ZVNvY2tldC5kcm9wQWN0aXZlRWxlbWVudCh0aGlzKVxuICAgIC8vIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgY2FuIGJlIG51bGwgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTFcbiAgICBpZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KXsgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCkgfVxuICAgIGlmKHRoaXMubGl2ZVNvY2tldC5pc1VubG9hZGVkKCkpe1xuICAgICAgdGhpcy5zaG93TG9hZGVyKEJFRk9SRV9VTkxPQURfTE9BREVSX1RJTUVPVVQpXG4gICAgfVxuICB9XG5cbiAgb25FcnJvcihyZWFzb24pe1xuICAgIHRoaXMub25DbG9zZShyZWFzb24pXG4gICAgaWYodGhpcy5saXZlU29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtcInZpZXcgY3Jhc2hlZFwiLCByZWFzb25dKSB9XG4gICAgaWYoIXRoaXMubGl2ZVNvY2tldC5pc1VubG9hZGVkKCkpe1xuICAgICAgaWYodGhpcy5saXZlU29ja2V0LmlzQ29ubmVjdGVkKCkpe1xuICAgICAgICB0aGlzLmRpc3BsYXlFcnJvcihbUEhYX0xPQURJTkdfQ0xBU1MsIFBIWF9FUlJPUl9DTEFTUywgUEhYX1NFUlZFUl9FUlJPUl9DTEFTU10pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRpc3BsYXlFcnJvcihbUEhYX0xPQURJTkdfQ0xBU1MsIFBIWF9FUlJPUl9DTEFTUywgUEhYX0NMSUVOVF9FUlJPUl9DTEFTU10pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGlzcGxheUVycm9yKGNsYXNzZXMpe1xuICAgIGlmKHRoaXMuaXNNYWluKCkpeyBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4OnBhZ2UtbG9hZGluZy1zdGFydFwiLCB7ZGV0YWlsOiB7dG86IHRoaXMuaHJlZiwga2luZDogXCJlcnJvclwifX0pIH1cbiAgICB0aGlzLnNob3dMb2FkZXIoKVxuICAgIHRoaXMuc2V0Q29udGFpbmVyQ2xhc3NlcyguLi5jbGFzc2VzKVxuICAgIHRoaXMuZGVsYXllZERpc2Nvbm5lY3RlZCgpXG4gIH1cblxuICBkZWxheWVkRGlzY29ubmVjdGVkKCl7XG4gICAgdGhpcy5kaXNjb25uZWN0ZWRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5leGVjQWxsKHRoaXMuYmluZGluZyhcImRpc2Nvbm5lY3RlZFwiKSlcbiAgICB9LCB0aGlzLmxpdmVTb2NrZXQuZGlzY29ubmVjdGVkVGltZW91dClcbiAgfVxuXG4gIHdyYXBQdXNoKGNhbGxlclB1c2gsIHJlY2VpdmVzKXtcbiAgICBsZXQgbGF0ZW5jeSA9IHRoaXMubGl2ZVNvY2tldC5nZXRMYXRlbmN5U2ltKClcbiAgICBsZXQgd2l0aExhdGVuY3kgPSBsYXRlbmN5ID9cbiAgICAgIChjYikgPT4gc2V0VGltZW91dCgoKSA9PiAhdGhpcy5pc0Rlc3Ryb3llZCgpICYmIGNiKCksIGxhdGVuY3kpIDpcbiAgICAgIChjYikgPT4gIXRoaXMuaXNEZXN0cm95ZWQoKSAmJiBjYigpXG5cbiAgICB3aXRoTGF0ZW5jeSgoKSA9PiB7XG4gICAgICBjYWxsZXJQdXNoKClcbiAgICAgICAgLnJlY2VpdmUoXCJva1wiLCByZXNwID0+IHdpdGhMYXRlbmN5KCgpID0+IHJlY2VpdmVzLm9rICYmIHJlY2VpdmVzLm9rKHJlc3ApKSlcbiAgICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCByZWFzb24gPT4gd2l0aExhdGVuY3koKCkgPT4gcmVjZWl2ZXMuZXJyb3IgJiYgcmVjZWl2ZXMuZXJyb3IocmVhc29uKSkpXG4gICAgICAgIC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiB3aXRoTGF0ZW5jeSgoKSA9PiByZWNlaXZlcy50aW1lb3V0ICYmIHJlY2VpdmVzLnRpbWVvdXQoKSkpXG4gICAgfSlcbiAgfVxuXG4gIHB1c2hXaXRoUmVwbHkocmVmR2VuZXJhdG9yLCBldmVudCwgcGF5bG9hZCl7XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSl7IHJldHVybiBQcm9taXNlLnJlamVjdCh7ZXJyb3I6IFwibm9jb25uZWN0aW9uXCJ9KSB9XG5cbiAgICBsZXQgW3JlZiwgW2VsXSwgb3B0c10gPSByZWZHZW5lcmF0b3IgPyByZWZHZW5lcmF0b3IoKSA6IFtudWxsLCBbXSwge31dXG4gICAgbGV0IG9sZEpvaW5Db3VudCA9IHRoaXMuam9pbkNvdW50XG4gICAgbGV0IG9uTG9hZGluZ0RvbmUgPSBmdW5jdGlvbigpe31cbiAgICBpZihvcHRzLnBhZ2VfbG9hZGluZyl7XG4gICAgICBvbkxvYWRpbmdEb25lID0gdGhpcy5saXZlU29ja2V0LndpdGhQYWdlTG9hZGluZyh7a2luZDogXCJlbGVtZW50XCIsIHRhcmdldDogZWx9KVxuICAgIH1cblxuICAgIGlmKHR5cGVvZiAocGF5bG9hZC5jaWQpICE9PSBcIm51bWJlclwiKXsgZGVsZXRlIHBheWxvYWQuY2lkIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLndyYXBQdXNoKCgpID0+IHRoaXMuY2hhbm5lbC5wdXNoKGV2ZW50LCBwYXlsb2FkLCBQVVNIX1RJTUVPVVQpLCB7XG4gICAgICAgIG9rOiAocmVzcCkgPT4ge1xuICAgICAgICAgIGlmKHJlZiAhPT0gbnVsbCl7IHRoaXMubGFzdEFja1JlZiA9IHJlZiB9XG4gICAgICAgICAgbGV0IGZpbmlzaCA9IChob29rUmVwbHkpID0+IHtcbiAgICAgICAgICAgIGlmKHJlc3AucmVkaXJlY3QpeyB0aGlzLm9uUmVkaXJlY3QocmVzcC5yZWRpcmVjdCkgfVxuICAgICAgICAgICAgaWYocmVzcC5saXZlX3BhdGNoKXsgdGhpcy5vbkxpdmVQYXRjaChyZXNwLmxpdmVfcGF0Y2gpIH1cbiAgICAgICAgICAgIGlmKHJlc3AubGl2ZV9yZWRpcmVjdCl7IHRoaXMub25MaXZlUmVkaXJlY3QocmVzcC5saXZlX3JlZGlyZWN0KSB9XG4gICAgICAgICAgICBvbkxvYWRpbmdEb25lKClcbiAgICAgICAgICAgIHJlc29sdmUoe3Jlc3A6IHJlc3AsIHJlcGx5OiBob29rUmVwbHl9KVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihyZXNwLmRpZmYpe1xuICAgICAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmFwcGx5RGlmZihcInVwZGF0ZVwiLCByZXNwLmRpZmYsICh7ZGlmZiwgcmVwbHksIGV2ZW50c30pID0+IHtcbiAgICAgICAgICAgICAgICBpZihyZWYgIT09IG51bGwpe1xuICAgICAgICAgICAgICAgICAgdGhpcy51bmRvUmVmcyhyZWYsIHBheWxvYWQuZXZlbnQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKGRpZmYsIGV2ZW50cylcbiAgICAgICAgICAgICAgICBmaW5pc2gocmVwbHkpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZihyZWYgIT09IG51bGwpeyB0aGlzLnVuZG9SZWZzKHJlZiwgcGF5bG9hZC5ldmVudCkgfVxuICAgICAgICAgICAgZmluaXNoKG51bGwpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogKHJlYXNvbikgPT4gcmVqZWN0KHtlcnJvcjogcmVhc29ufSksXG4gICAgICAgIHRpbWVvdXQ6ICgpID0+IHtcbiAgICAgICAgICByZWplY3Qoe3RpbWVvdXQ6IHRydWV9KVxuICAgICAgICAgIGlmKHRoaXMuam9pbkNvdW50ID09PSBvbGRKb2luQ291bnQpe1xuICAgICAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlbG9hZFdpdGhKaXR0ZXIodGhpcywgKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmxvZyhcInRpbWVvdXRcIiwgKCkgPT4gW1wicmVjZWl2ZWQgdGltZW91dCB3aGlsZSBjb21tdW5pY2F0aW5nIHdpdGggc2VydmVyLiBGYWxsaW5nIGJhY2sgdG8gaGFyZCByZWZyZXNoIGZvciByZWNvdmVyeVwiXSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICB1bmRvUmVmcyhyZWYsIHBoeEV2ZW50LCBvbmx5RWxzKXtcbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIH0gLy8gZXhpdCBpZiBleHRlcm5hbCBmb3JtIHRyaWdnZXJlZFxuICAgIGxldCBzZWxlY3RvciA9IGBbJHtQSFhfUkVGX1NSQ309XCIke3RoaXMucmVmU3JjKCl9XCJdYFxuXG4gICAgaWYob25seUVscyl7XG4gICAgICBvbmx5RWxzID0gbmV3IFNldChvbmx5RWxzKVxuICAgICAgRE9NLmFsbChkb2N1bWVudCwgc2VsZWN0b3IsIHBhcmVudCA9PiB7XG4gICAgICAgIGlmKG9ubHlFbHMgJiYgIW9ubHlFbHMuaGFzKHBhcmVudCkpeyByZXR1cm4gfVxuICAgICAgICAvLyB1bmRvIGFueSBjaGlsZCByZWZzIHdpdGhpbiBwYXJlbnQgZmlyc3RcbiAgICAgICAgRE9NLmFsbChwYXJlbnQsIHNlbGVjdG9yLCBjaGlsZCA9PiB0aGlzLnVuZG9FbFJlZihjaGlsZCwgcmVmLCBwaHhFdmVudCkpXG4gICAgICAgIHRoaXMudW5kb0VsUmVmKHBhcmVudCwgcmVmLCBwaHhFdmVudClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIERPTS5hbGwoZG9jdW1lbnQsIHNlbGVjdG9yLCBlbCA9PiB0aGlzLnVuZG9FbFJlZihlbCwgcmVmLCBwaHhFdmVudCkpXG4gICAgfVxuICB9XG5cbiAgdW5kb0VsUmVmKGVsLCByZWYsIHBoeEV2ZW50KXtcbiAgICBsZXQgZWxSZWYgPSBuZXcgRWxlbWVudFJlZihlbClcblxuICAgIGVsUmVmLm1heWJlVW5kbyhyZWYsIHBoeEV2ZW50LCBjbG9uZWRUcmVlID0+IHtcbiAgICAgIC8vIHdlIG5lZWQgdG8gcGVyZm9ybSBhIGZ1bGwgcGF0Y2ggb24gdW5sb2NrZWQgZWxlbWVudHNcbiAgICAgIC8vIHRvIHBlcmZvcm0gYWxsIHRoZSBuZWNlc3NhcnkgbG9naWMgKGxpa2UgY2FsbGluZyB1cGRhdGVkIGZvciBob29rcywgZXRjLilcbiAgICAgIGxldCBwYXRjaCA9IG5ldyBET01QYXRjaCh0aGlzLCBlbCwgdGhpcy5pZCwgY2xvbmVkVHJlZSwgW10sIG51bGwsIHt1bmRvUmVmOiByZWZ9KVxuICAgICAgY29uc3QgcGh4Q2hpbGRyZW5BZGRlZCA9IHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCB0cnVlKVxuICAgICAgRE9NLmFsbChlbCwgYFske1BIWF9SRUZfU1JDfT1cIiR7dGhpcy5yZWZTcmMoKX1cIl1gLCBjaGlsZCA9PiB0aGlzLnVuZG9FbFJlZihjaGlsZCwgcmVmLCBwaHhFdmVudCkpXG4gICAgICBpZihwaHhDaGlsZHJlbkFkZGVkKXsgdGhpcy5qb2luTmV3Q2hpbGRyZW4oKSB9XG4gICAgfSlcbiAgfVxuXG4gIHJlZlNyYygpeyByZXR1cm4gdGhpcy5lbC5pZCB9XG5cbiAgcHV0UmVmKGVsZW1lbnRzLCBwaHhFdmVudCwgZXZlbnRUeXBlLCBvcHRzID0ge30pe1xuICAgIGxldCBuZXdSZWYgPSB0aGlzLnJlZisrXG4gICAgbGV0IGRpc2FibGVXaXRoID0gdGhpcy5iaW5kaW5nKFBIWF9ESVNBQkxFX1dJVEgpXG4gICAgaWYob3B0cy5sb2FkaW5nKXtcbiAgICAgIGxldCBsb2FkaW5nRWxzID0gRE9NLmFsbChkb2N1bWVudCwgb3B0cy5sb2FkaW5nKS5tYXAoZWwgPT4ge1xuICAgICAgICByZXR1cm4ge2VsLCBsb2NrOiB0cnVlLCBsb2FkaW5nOiB0cnVlfVxuICAgICAgfSlcbiAgICAgIGVsZW1lbnRzID0gZWxlbWVudHMuY29uY2F0KGxvYWRpbmdFbHMpXG4gICAgfVxuXG4gICAgZm9yKGxldCB7ZWwsIGxvY2ssIGxvYWRpbmd9IG9mIGVsZW1lbnRzKXtcbiAgICAgIGlmKCFsb2NrICYmICFsb2FkaW5nKXsgdGhyb3cgbmV3IEVycm9yKFwicHV0UmVmIHJlcXVpcmVzIGxvY2sgb3IgbG9hZGluZ1wiKSB9XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX1JFRl9TUkMsIHRoaXMucmVmU3JjKCkpXG4gICAgICBpZihsb2FkaW5nKXsgZWwuc2V0QXR0cmlidXRlKFBIWF9SRUZfTE9BRElORywgbmV3UmVmKSB9XG4gICAgICBpZihsb2NrKXsgZWwuc2V0QXR0cmlidXRlKFBIWF9SRUZfTE9DSywgbmV3UmVmKSB9XG5cbiAgICAgIGlmKCFsb2FkaW5nIHx8IChvcHRzLnN1Ym1pdHRlciAmJiAhKGVsID09PSBvcHRzLnN1Ym1pdHRlciB8fCBlbCA9PT0gb3B0cy5mb3JtKSkpeyBjb250aW51ZSB9XG5cbiAgICAgIGxldCBsb2NrQ29tcGxldGVQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoYHBoeDp1bmRvLWxvY2s6JHtuZXdSZWZ9YCwgKCkgPT4gcmVzb2x2ZShkZXRhaWwpLCB7b25jZTogdHJ1ZX0pXG4gICAgICB9KVxuXG4gICAgICBsZXQgbG9hZGluZ0NvbXBsZXRlUHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGBwaHg6dW5kby1sb2FkaW5nOiR7bmV3UmVmfWAsICgpID0+IHJlc29sdmUoZGV0YWlsKSwge29uY2U6IHRydWV9KVxuICAgICAgfSlcblxuICAgICAgZWwuY2xhc3NMaXN0LmFkZChgcGh4LSR7ZXZlbnRUeXBlfS1sb2FkaW5nYClcbiAgICAgIGxldCBkaXNhYmxlVGV4dCA9IGVsLmdldEF0dHJpYnV0ZShkaXNhYmxlV2l0aClcbiAgICAgIGlmKGRpc2FibGVUZXh0ICE9PSBudWxsKXtcbiAgICAgICAgaWYoIWVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUpKXtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFLCBlbC5pbm5lclRleHQpXG4gICAgICAgIH1cbiAgICAgICAgaWYoZGlzYWJsZVRleHQgIT09IFwiXCIpeyBlbC5pbm5lclRleHQgPSBkaXNhYmxlVGV4dCB9XG4gICAgICAgIC8vIFBIWF9ESVNBQkxFRCBjb3VsZCBoYXZlIGFscmVhZHkgYmVlbiBzZXQgaW4gZGlzYWJsZUZvcm1cbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFRCwgZWwuZ2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFRCkgfHwgZWwuZGlzYWJsZWQpXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpXG4gICAgICB9XG5cbiAgICAgIGxldCBkZXRhaWwgPSB7XG4gICAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgICAgZXZlbnRUeXBlOiBldmVudFR5cGUsXG4gICAgICAgIHJlZjogbmV3UmVmLFxuICAgICAgICBpc0xvYWRpbmc6IGxvYWRpbmcsXG4gICAgICAgIGlzTG9ja2VkOiBsb2NrLFxuICAgICAgICBsb2NrRWxlbWVudHM6IGVsZW1lbnRzLmZpbHRlcigoe2xvY2t9KSA9PiBsb2NrKS5tYXAoKHtlbH0pID0+IGVsKSxcbiAgICAgICAgbG9hZGluZ0VsZW1lbnRzOiBlbGVtZW50cy5maWx0ZXIoKHtsb2FkaW5nfSkgPT4gbG9hZGluZykubWFwKCh7ZWx9KSA9PiBlbCksXG4gICAgICAgIHVubG9jazogKGVscykgPT4ge1xuICAgICAgICAgIGVscyA9IEFycmF5LmlzQXJyYXkoZWxzKSA/IGVscyA6IFtlbHNdXG4gICAgICAgICAgdGhpcy51bmRvUmVmcyhuZXdSZWYsIHBoeEV2ZW50LCBlbHMpXG4gICAgICAgIH0sXG4gICAgICAgIGxvY2tDb21wbGV0ZTogbG9ja0NvbXBsZXRlUHJvbWlzZSxcbiAgICAgICAgbG9hZGluZ0NvbXBsZXRlOiBsb2FkaW5nQ29tcGxldGVQcm9taXNlLFxuICAgICAgICBsb2NrOiAobG9ja0VsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgaWYodGhpcy5pc0Fja2VkKG5ld1JlZikpeyByZXR1cm4gcmVzb2x2ZShkZXRhaWwpIH1cbiAgICAgICAgICAgIGxvY2tFbC5zZXRBdHRyaWJ1dGUoUEhYX1JFRl9MT0NLLCBuZXdSZWYpXG4gICAgICAgICAgICBsb2NrRWwuc2V0QXR0cmlidXRlKFBIWF9SRUZfU1JDLCB0aGlzLnJlZlNyYygpKVxuICAgICAgICAgICAgbG9ja0VsLmFkZEV2ZW50TGlzdGVuZXIoYHBoeDpsb2NrLXN0b3A6JHtuZXdSZWZ9YCwgKCkgPT4gcmVzb2x2ZShkZXRhaWwpLCB7b25jZTogdHJ1ZX0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJwaHg6cHVzaFwiLCB7XG4gICAgICAgIGRldGFpbDogZGV0YWlsLFxuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjYW5jZWxhYmxlOiBmYWxzZVxuICAgICAgfSkpXG4gICAgICBpZihwaHhFdmVudCl7XG4gICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGBwaHg6cHVzaDoke3BoeEV2ZW50fWAsIHtcbiAgICAgICAgICBkZXRhaWw6IGRldGFpbCxcbiAgICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICAgIGNhbmNlbGFibGU6IGZhbHNlXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW25ld1JlZiwgZWxlbWVudHMubWFwKCh7ZWx9KSA9PiBlbCksIG9wdHNdXG4gIH1cblxuICBpc0Fja2VkKHJlZil7IHJldHVybiB0aGlzLmxhc3RBY2tSZWYgIT09IG51bGwgJiYgdGhpcy5sYXN0QWNrUmVmID49IHJlZiB9XG5cbiAgY29tcG9uZW50SUQoZWwpe1xuICAgIGxldCBjaWQgPSBlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpXG4gICAgcmV0dXJuIGNpZCA/IHBhcnNlSW50KGNpZCkgOiBudWxsXG4gIH1cblxuICB0YXJnZXRDb21wb25lbnRJRCh0YXJnZXQsIHRhcmdldEN0eCwgb3B0cyA9IHt9KXtcbiAgICBpZihpc0NpZCh0YXJnZXRDdHgpKXsgcmV0dXJuIHRhcmdldEN0eCB9XG5cbiAgICBsZXQgY2lkT3JTZWxlY3RvciA9IG9wdHMudGFyZ2V0IHx8IHRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwidGFyZ2V0XCIpKVxuICAgIGlmKGlzQ2lkKGNpZE9yU2VsZWN0b3IpKXtcbiAgICAgIHJldHVybiBwYXJzZUludChjaWRPclNlbGVjdG9yKVxuICAgIH0gZWxzZSBpZih0YXJnZXRDdHggJiYgKGNpZE9yU2VsZWN0b3IgIT09IG51bGwgfHwgb3B0cy50YXJnZXQpKXtcbiAgICAgIHJldHVybiB0aGlzLmNsb3Nlc3RDb21wb25lbnRJRCh0YXJnZXRDdHgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgY2xvc2VzdENvbXBvbmVudElEKHRhcmdldEN0eCl7XG4gICAgaWYoaXNDaWQodGFyZ2V0Q3R4KSl7XG4gICAgICByZXR1cm4gdGFyZ2V0Q3R4XG4gICAgfSBlbHNlIGlmKHRhcmdldEN0eCl7XG4gICAgICByZXR1cm4gbWF5YmUodGFyZ2V0Q3R4LmNsb3Nlc3QoYFske1BIWF9DT01QT05FTlR9XWApLCBlbCA9PiB0aGlzLm93bnNFbGVtZW50KGVsKSAmJiB0aGlzLmNvbXBvbmVudElEKGVsKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBwdXNoSG9va0V2ZW50KGVsLCB0YXJnZXRDdHgsIGV2ZW50LCBwYXlsb2FkLCBvblJlcGx5KXtcbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpKXtcbiAgICAgIHRoaXMubG9nKFwiaG9va1wiLCAoKSA9PiBbXCJ1bmFibGUgdG8gcHVzaCBob29rIGV2ZW50LiBMaXZlVmlldyBub3QgY29ubmVjdGVkXCIsIGV2ZW50LCBwYXlsb2FkXSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBsZXQgW3JlZiwgZWxzLCBvcHRzXSA9IHRoaXMucHV0UmVmKFt7ZWwsIGxvYWRpbmc6IHRydWUsIGxvY2s6IHRydWV9XSwgZXZlbnQsIFwiaG9va1wiKVxuICAgIHRoaXMucHVzaFdpdGhSZXBseSgoKSA9PiBbcmVmLCBlbHMsIG9wdHNdLCBcImV2ZW50XCIsIHtcbiAgICAgIHR5cGU6IFwiaG9va1wiLFxuICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgdmFsdWU6IHBheWxvYWQsXG4gICAgICBjaWQ6IHRoaXMuY2xvc2VzdENvbXBvbmVudElEKHRhcmdldEN0eClcbiAgICB9KS50aGVuKCh7cmVzcDogX3Jlc3AsIHJlcGx5OiBob29rUmVwbHl9KSA9PiBvblJlcGx5KGhvb2tSZXBseSwgcmVmKSlcblxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIGV4dHJhY3RNZXRhKGVsLCBtZXRhLCB2YWx1ZSl7XG4gICAgbGV0IHByZWZpeCA9IHRoaXMuYmluZGluZyhcInZhbHVlLVwiKVxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBlbC5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGlmKCFtZXRhKXsgbWV0YSA9IHt9IH1cbiAgICAgIGxldCBuYW1lID0gZWwuYXR0cmlidXRlc1tpXS5uYW1lXG4gICAgICBpZihuYW1lLnN0YXJ0c1dpdGgocHJlZml4KSl7IG1ldGFbbmFtZS5yZXBsYWNlKHByZWZpeCwgXCJcIildID0gZWwuZ2V0QXR0cmlidXRlKG5hbWUpIH1cbiAgICB9XG4gICAgaWYoZWwudmFsdWUgIT09IHVuZGVmaW5lZCAmJiAhKGVsIGluc3RhbmNlb2YgSFRNTEZvcm1FbGVtZW50KSl7XG4gICAgICBpZighbWV0YSl7IG1ldGEgPSB7fSB9XG4gICAgICBtZXRhLnZhbHVlID0gZWwudmFsdWVcblxuICAgICAgaWYoZWwudGFnTmFtZSA9PT0gXCJJTlBVVFwiICYmIENIRUNLQUJMRV9JTlBVVFMuaW5kZXhPZihlbC50eXBlKSA+PSAwICYmICFlbC5jaGVja2VkKXtcbiAgICAgICAgZGVsZXRlIG1ldGEudmFsdWVcbiAgICAgIH1cbiAgICB9XG4gICAgaWYodmFsdWUpe1xuICAgICAgaWYoIW1ldGEpeyBtZXRhID0ge30gfVxuICAgICAgZm9yKGxldCBrZXkgaW4gdmFsdWUpeyBtZXRhW2tleV0gPSB2YWx1ZVtrZXldIH1cbiAgICB9XG4gICAgcmV0dXJuIG1ldGFcbiAgfVxuXG4gIHB1c2hFdmVudCh0eXBlLCBlbCwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgbWV0YSwgb3B0cyA9IHt9LCBvblJlcGx5KXtcbiAgICB0aGlzLnB1c2hXaXRoUmVwbHkoKCkgPT4gdGhpcy5wdXRSZWYoW3tlbCwgbG9hZGluZzogdHJ1ZSwgbG9jazogdHJ1ZX1dLCBwaHhFdmVudCwgdHlwZSwgb3B0cyksIFwiZXZlbnRcIiwge1xuICAgICAgdHlwZTogdHlwZSxcbiAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgIHZhbHVlOiB0aGlzLmV4dHJhY3RNZXRhKGVsLCBtZXRhLCBvcHRzLnZhbHVlKSxcbiAgICAgIGNpZDogdGhpcy50YXJnZXRDb21wb25lbnRJRChlbCwgdGFyZ2V0Q3R4LCBvcHRzKVxuICAgIH0pXG4gICAgICAudGhlbigoe3JlcGx5fSkgPT4gb25SZXBseSAmJiBvblJlcGx5KHJlcGx5KSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IGxvZ0Vycm9yKFwiRmFpbGVkIHRvIHB1c2ggZXZlbnRcIiwgZXJyb3IpKVxuICB9XG5cbiAgcHVzaEZpbGVQcm9ncmVzcyhmaWxlRWwsIGVudHJ5UmVmLCBwcm9ncmVzcywgb25SZXBseSA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICB0aGlzLmxpdmVTb2NrZXQud2l0aGluT3duZXJzKGZpbGVFbC5mb3JtLCAodmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICB2aWV3LnB1c2hXaXRoUmVwbHkobnVsbCwgXCJwcm9ncmVzc1wiLCB7XG4gICAgICAgIGV2ZW50OiBmaWxlRWwuZ2V0QXR0cmlidXRlKHZpZXcuYmluZGluZyhQSFhfUFJPR1JFU1MpKSxcbiAgICAgICAgcmVmOiBmaWxlRWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSxcbiAgICAgICAgZW50cnlfcmVmOiBlbnRyeVJlZixcbiAgICAgICAgcHJvZ3Jlc3M6IHByb2dyZXNzLFxuICAgICAgICBjaWQ6IHZpZXcudGFyZ2V0Q29tcG9uZW50SUQoZmlsZUVsLmZvcm0sIHRhcmdldEN0eClcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKCh7cmVzcH0pID0+IG9uUmVwbHkocmVzcCkpXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IGxvZ0Vycm9yKFwiRmFpbGVkIHRvIHB1c2ggZmlsZSBwcm9ncmVzc1wiLCBlcnJvcikpXG4gICAgfSlcbiAgfVxuXG4gIHB1c2hJbnB1dChpbnB1dEVsLCB0YXJnZXRDdHgsIGZvcmNlQ2lkLCBwaHhFdmVudCwgb3B0cywgY2FsbGJhY2spe1xuICAgIGlmKCFpbnB1dEVsLmZvcm0pe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZm9ybSBldmVudHMgcmVxdWlyZSB0aGUgaW5wdXQgdG8gYmUgaW5zaWRlIGEgZm9ybVwiKVxuICAgIH1cblxuICAgIGxldCB1cGxvYWRzXG4gICAgbGV0IGNpZCA9IGlzQ2lkKGZvcmNlQ2lkKSA/IGZvcmNlQ2lkIDogdGhpcy50YXJnZXRDb21wb25lbnRJRChpbnB1dEVsLmZvcm0sIHRhcmdldEN0eCwgb3B0cylcbiAgICBsZXQgcmVmR2VuZXJhdG9yID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucHV0UmVmKFtcbiAgICAgICAge2VsOiBpbnB1dEVsLCBsb2FkaW5nOiB0cnVlLCBsb2NrOiB0cnVlfSxcbiAgICAgICAge2VsOiBpbnB1dEVsLmZvcm0sIGxvYWRpbmc6IHRydWUsIGxvY2s6IHRydWV9XG4gICAgICBdLCBwaHhFdmVudCwgXCJjaGFuZ2VcIiwgb3B0cylcbiAgICB9XG4gICAgbGV0IGZvcm1EYXRhXG4gICAgbGV0IG1ldGEgPSB0aGlzLmV4dHJhY3RNZXRhKGlucHV0RWwuZm9ybSwge30sIG9wdHMudmFsdWUpXG4gICAgbGV0IHNlcmlhbGl6ZU9wdHMgPSB7fVxuICAgIGlmKGlucHV0RWwgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCl7IHNlcmlhbGl6ZU9wdHMuc3VibWl0dGVyID0gaW5wdXRFbCB9XG4gICAgaWYoaW5wdXRFbC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpKSl7XG4gICAgICBmb3JtRGF0YSA9IHNlcmlhbGl6ZUZvcm0oaW5wdXRFbC5mb3JtLCBzZXJpYWxpemVPcHRzLCBbaW5wdXRFbC5uYW1lXSlcbiAgICB9IGVsc2Uge1xuICAgICAgZm9ybURhdGEgPSBzZXJpYWxpemVGb3JtKGlucHV0RWwuZm9ybSwgc2VyaWFsaXplT3B0cylcbiAgICB9XG4gICAgaWYoRE9NLmlzVXBsb2FkSW5wdXQoaW5wdXRFbCkgJiYgaW5wdXRFbC5maWxlcyAmJiBpbnB1dEVsLmZpbGVzLmxlbmd0aCA+IDApe1xuICAgICAgTGl2ZVVwbG9hZGVyLnRyYWNrRmlsZXMoaW5wdXRFbCwgQXJyYXkuZnJvbShpbnB1dEVsLmZpbGVzKSlcbiAgICB9XG4gICAgdXBsb2FkcyA9IExpdmVVcGxvYWRlci5zZXJpYWxpemVVcGxvYWRzKGlucHV0RWwpXG5cbiAgICBsZXQgZXZlbnQgPSB7XG4gICAgICB0eXBlOiBcImZvcm1cIixcbiAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgIHZhbHVlOiBmb3JtRGF0YSxcbiAgICAgIG1ldGE6IHtcbiAgICAgICAgLy8gbm8gdGFyZ2V0IHdhcyBpbXBsaWNpdGx5IHNlbnQgYXMgXCJ1bmRlZmluZWRcIiBpbiBMViA8PSAxLjAuNSwgdGhlcmVmb3JlXG4gICAgICAgIC8vIHdlIGhhdmUgdG8ga2VlcCBpdC4gSW4gMS4wLjYgd2Ugc3dpdGNoZWQgZnJvbSBwYXNzaW5nIG1ldGEgYXMgVVJMIGVuY29kZWQgZGF0YVxuICAgICAgICAvLyB0byBwYXNzaW5nIGl0IGRpcmVjdGx5IGluIHRoZSBldmVudCwgYnV0IHRoZSBKU09OIGVuY29kZSB3b3VsZCBkcm9wIGtleXMgd2l0aFxuICAgICAgICAvLyB1bmRlZmluZWQgdmFsdWVzLlxuICAgICAgICBfdGFyZ2V0OiBvcHRzLl90YXJnZXQgfHwgXCJ1bmRlZmluZWRcIixcbiAgICAgICAgLi4ubWV0YVxuICAgICAgfSxcbiAgICAgIHVwbG9hZHM6IHVwbG9hZHMsXG4gICAgICBjaWQ6IGNpZFxuICAgIH1cbiAgICB0aGlzLnB1c2hXaXRoUmVwbHkocmVmR2VuZXJhdG9yLCBcImV2ZW50XCIsIGV2ZW50KS50aGVuKCh7cmVzcH0pID0+IHtcbiAgICAgIGlmKERPTS5pc1VwbG9hZElucHV0KGlucHV0RWwpICYmIERPTS5pc0F1dG9VcGxvYWQoaW5wdXRFbCkpe1xuICAgICAgICAvLyB0aGUgZWxlbWVudCBjb3VsZCBiZSBpbnNpZGUgYSBsb2NrZWQgcGFyZW50IGZvciBvdGhlciB1bnJlbGF0ZWQgY2hhbmdlcztcbiAgICAgICAgLy8gd2UgY2FuIG9ubHkgc3RhcnQgdXBsb2FkcyB3aGVuIHRoZSB0cmVlIGlzIHVubG9ja2VkIGFuZCB0aGVcbiAgICAgICAgLy8gbmVjZXNzYXJ5IGRhdGEgYXR0cmlidXRlcyBhcmUgc2V0IGluIHRoZSByZWFsIERPTVxuICAgICAgICBFbGVtZW50UmVmLm9uVW5sb2NrKGlucHV0RWwsICgpID0+IHtcbiAgICAgICAgICBpZihMaXZlVXBsb2FkZXIuZmlsZXNBd2FpdGluZ1ByZWZsaWdodChpbnB1dEVsKS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgIGxldCBbcmVmLCBfZWxzXSA9IHJlZkdlbmVyYXRvcigpXG4gICAgICAgICAgICB0aGlzLnVuZG9SZWZzKHJlZiwgcGh4RXZlbnQsIFtpbnB1dEVsLmZvcm1dKVxuICAgICAgICAgICAgdGhpcy51cGxvYWRGaWxlcyhpbnB1dEVsLmZvcm0sIHBoeEV2ZW50LCB0YXJnZXRDdHgsIHJlZiwgY2lkLCAoX3VwbG9hZHMpID0+IHtcbiAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2socmVzcClcbiAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXdhaXRpbmdTdWJtaXQoaW5wdXRFbC5mb3JtLCBwaHhFdmVudClcbiAgICAgICAgICAgICAgdGhpcy51bmRvUmVmcyhyZWYsIHBoeEV2ZW50KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhyZXNwKVxuICAgICAgfVxuICAgIH0pLmNhdGNoKChlcnJvcikgPT4gbG9nRXJyb3IoXCJGYWlsZWQgdG8gcHVzaCBpbnB1dCBldmVudFwiLCBlcnJvcikpXG4gIH1cblxuICB0cmlnZ2VyQXdhaXRpbmdTdWJtaXQoZm9ybUVsLCBwaHhFdmVudCl7XG4gICAgbGV0IGF3YWl0aW5nU3VibWl0ID0gdGhpcy5nZXRTY2hlZHVsZWRTdWJtaXQoZm9ybUVsKVxuICAgIGlmKGF3YWl0aW5nU3VibWl0KXtcbiAgICAgIGxldCBbX2VsLCBfcmVmLCBfb3B0cywgY2FsbGJhY2tdID0gYXdhaXRpbmdTdWJtaXRcbiAgICAgIHRoaXMuY2FuY2VsU3VibWl0KGZvcm1FbCwgcGh4RXZlbnQpXG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG5cbiAgZ2V0U2NoZWR1bGVkU3VibWl0KGZvcm1FbCl7XG4gICAgcmV0dXJuIHRoaXMuZm9ybVN1Ym1pdHMuZmluZCgoW2VsLCBfcmVmLCBfb3B0cywgX2NhbGxiYWNrXSkgPT4gZWwuaXNTYW1lTm9kZShmb3JtRWwpKVxuICB9XG5cbiAgc2NoZWR1bGVTdWJtaXQoZm9ybUVsLCByZWYsIG9wdHMsIGNhbGxiYWNrKXtcbiAgICBpZih0aGlzLmdldFNjaGVkdWxlZFN1Ym1pdChmb3JtRWwpKXsgcmV0dXJuIHRydWUgfVxuICAgIHRoaXMuZm9ybVN1Ym1pdHMucHVzaChbZm9ybUVsLCByZWYsIG9wdHMsIGNhbGxiYWNrXSlcbiAgfVxuXG4gIGNhbmNlbFN1Ym1pdChmb3JtRWwsIHBoeEV2ZW50KXtcbiAgICB0aGlzLmZvcm1TdWJtaXRzID0gdGhpcy5mb3JtU3VibWl0cy5maWx0ZXIoKFtlbCwgcmVmLCBfb3B0cywgX2NhbGxiYWNrXSkgPT4ge1xuICAgICAgaWYoZWwuaXNTYW1lTm9kZShmb3JtRWwpKXtcbiAgICAgICAgdGhpcy51bmRvUmVmcyhyZWYsIHBoeEV2ZW50KVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGRpc2FibGVGb3JtKGZvcm1FbCwgcGh4RXZlbnQsIG9wdHMgPSB7fSl7XG4gICAgbGV0IGZpbHRlcklnbm9yZWQgPSBlbCA9PiB7XG4gICAgICBsZXQgdXNlcklnbm9yZWQgPSBjbG9zZXN0UGh4QmluZGluZyhlbCwgYCR7dGhpcy5iaW5kaW5nKFBIWF9VUERBVEUpfT1pZ25vcmVgLCBlbC5mb3JtKVxuICAgICAgcmV0dXJuICEodXNlcklnbm9yZWQgfHwgY2xvc2VzdFBoeEJpbmRpbmcoZWwsIFwiZGF0YS1waHgtdXBkYXRlPWlnbm9yZVwiLCBlbC5mb3JtKSlcbiAgICB9XG4gICAgbGV0IGZpbHRlckRpc2FibGVzID0gZWwgPT4ge1xuICAgICAgcmV0dXJuIGVsLmhhc0F0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0RJU0FCTEVfV0lUSCkpXG4gICAgfVxuICAgIGxldCBmaWx0ZXJCdXR0b24gPSBlbCA9PiBlbC50YWdOYW1lID09IFwiQlVUVE9OXCJcblxuICAgIGxldCBmaWx0ZXJJbnB1dCA9IGVsID0+IFtcIklOUFVUXCIsIFwiVEVYVEFSRUFcIiwgXCJTRUxFQ1RcIl0uaW5jbHVkZXMoZWwudGFnTmFtZSlcblxuICAgIGxldCBmb3JtRWxlbWVudHMgPSBBcnJheS5mcm9tKGZvcm1FbC5lbGVtZW50cylcbiAgICBsZXQgZGlzYWJsZXMgPSBmb3JtRWxlbWVudHMuZmlsdGVyKGZpbHRlckRpc2FibGVzKVxuICAgIGxldCBidXR0b25zID0gZm9ybUVsZW1lbnRzLmZpbHRlcihmaWx0ZXJCdXR0b24pLmZpbHRlcihmaWx0ZXJJZ25vcmVkKVxuICAgIGxldCBpbnB1dHMgPSBmb3JtRWxlbWVudHMuZmlsdGVyKGZpbHRlcklucHV0KS5maWx0ZXIoZmlsdGVySWdub3JlZClcblxuICAgIGJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xuICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQsIGJ1dHRvbi5kaXNhYmxlZClcbiAgICAgIGJ1dHRvbi5kaXNhYmxlZCA9IHRydWVcbiAgICB9KVxuICAgIGlucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShQSFhfUkVBRE9OTFksIGlucHV0LnJlYWRPbmx5KVxuICAgICAgaW5wdXQucmVhZE9ubHkgPSB0cnVlXG4gICAgICBpZihpbnB1dC5maWxlcyl7XG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQsIGlucHV0LmRpc2FibGVkKVxuICAgICAgICBpbnB1dC5kaXNhYmxlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9KVxuICAgIGxldCBmb3JtRWxzID0gZGlzYWJsZXMuY29uY2F0KGJ1dHRvbnMpLmNvbmNhdChpbnB1dHMpLm1hcChlbCA9PiB7XG4gICAgICByZXR1cm4ge2VsLCBsb2FkaW5nOiB0cnVlLCBsb2NrOiB0cnVlfVxuICAgIH0pXG5cbiAgICAvLyB3ZSByZXZlcnNlIHRoZSBvcmRlciBzbyBmb3JtIGNoaWxkcmVuIGFyZSBhbHJlYWR5IGxvY2tlZCBieSB0aGUgdGltZVxuICAgIC8vIHRoZSBmb3JtIGlzIGxvY2tlZFxuICAgIGxldCBlbHMgPSBbe2VsOiBmb3JtRWwsIGxvYWRpbmc6IHRydWUsIGxvY2s6IGZhbHNlfV0uY29uY2F0KGZvcm1FbHMpLnJldmVyc2UoKVxuICAgIHJldHVybiB0aGlzLnB1dFJlZihlbHMsIHBoeEV2ZW50LCBcInN1Ym1pdFwiLCBvcHRzKVxuICB9XG5cbiAgcHVzaEZvcm1TdWJtaXQoZm9ybUVsLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBzdWJtaXR0ZXIsIG9wdHMsIG9uUmVwbHkpe1xuICAgIGxldCByZWZHZW5lcmF0b3IgPSAoKSA9PiB0aGlzLmRpc2FibGVGb3JtKGZvcm1FbCwgcGh4RXZlbnQsIHtcbiAgICAgIC4uLm9wdHMsXG4gICAgICBmb3JtOiBmb3JtRWwsXG4gICAgICBzdWJtaXR0ZXI6IHN1Ym1pdHRlclxuICAgIH0pXG4gICAgLy8gc3RvcmUgdGhlIHN1Ym1pdHRlciBpbiB0aGUgZm9ybSBlbGVtZW50IGluIG9yZGVyIHRvIHRyaWdnZXIgaXRcbiAgICAvLyBmb3IgcGh4LXRyaWdnZXItYWN0aW9uXG4gICAgRE9NLnB1dFByaXZhdGUoZm9ybUVsLCBcInN1Ym1pdHRlclwiLCBzdWJtaXR0ZXIpXG4gICAgbGV0IGNpZCA9IHRoaXMudGFyZ2V0Q29tcG9uZW50SUQoZm9ybUVsLCB0YXJnZXRDdHgpXG4gICAgaWYoTGl2ZVVwbG9hZGVyLmhhc1VwbG9hZHNJblByb2dyZXNzKGZvcm1FbCkpe1xuICAgICAgbGV0IFtyZWYsIF9lbHNdID0gcmVmR2VuZXJhdG9yKClcbiAgICAgIGxldCBwdXNoID0gKCkgPT4gdGhpcy5wdXNoRm9ybVN1Ym1pdChmb3JtRWwsIHRhcmdldEN0eCwgcGh4RXZlbnQsIHN1Ym1pdHRlciwgb3B0cywgb25SZXBseSlcbiAgICAgIHJldHVybiB0aGlzLnNjaGVkdWxlU3VibWl0KGZvcm1FbCwgcmVmLCBvcHRzLCBwdXNoKVxuICAgIH0gZWxzZSBpZihMaXZlVXBsb2FkZXIuaW5wdXRzQXdhaXRpbmdQcmVmbGlnaHQoZm9ybUVsKS5sZW5ndGggPiAwKXtcbiAgICAgIGxldCBbcmVmLCBlbHNdID0gcmVmR2VuZXJhdG9yKClcbiAgICAgIGxldCBwcm94eVJlZkdlbiA9ICgpID0+IFtyZWYsIGVscywgb3B0c11cbiAgICAgIHRoaXMudXBsb2FkRmlsZXMoZm9ybUVsLCBwaHhFdmVudCwgdGFyZ2V0Q3R4LCByZWYsIGNpZCwgKF91cGxvYWRzKSA9PiB7XG4gICAgICAgIC8vIGlmIHdlIHN0aWxsIGhhdmluZyBwZW5kaW5nIHByZWZsaWdodHMgaXQgbWVhbnMgd2UgaGF2ZSBpbnZhbGlkIGVudHJpZXNcbiAgICAgICAgLy8gYW5kIHRoZSBwaHgtc3VibWl0IGNhbm5vdCBiZSBjb21wbGV0ZWRcbiAgICAgICAgaWYoTGl2ZVVwbG9hZGVyLmlucHV0c0F3YWl0aW5nUHJlZmxpZ2h0KGZvcm1FbCkubGVuZ3RoID4gMCl7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudW5kb1JlZnMocmVmLCBwaHhFdmVudClcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWV0YSA9IHRoaXMuZXh0cmFjdE1ldGEoZm9ybUVsLCB7fSwgb3B0cy52YWx1ZSlcbiAgICAgICAgbGV0IGZvcm1EYXRhID0gc2VyaWFsaXplRm9ybShmb3JtRWwsIHtzdWJtaXR0ZXJ9KVxuICAgICAgICB0aGlzLnB1c2hXaXRoUmVwbHkocHJveHlSZWZHZW4sIFwiZXZlbnRcIiwge1xuICAgICAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgICAgICB2YWx1ZTogZm9ybURhdGEsXG4gICAgICAgICAgbWV0YTogbWV0YSxcbiAgICAgICAgICBjaWQ6IGNpZFxuICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKCh7cmVzcH0pID0+IG9uUmVwbHkocmVzcCkpXG4gICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4gbG9nRXJyb3IoXCJGYWlsZWQgdG8gcHVzaCBmb3JtIHN1Ym1pdFwiLCBlcnJvcikpXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZighKGZvcm1FbC5oYXNBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpICYmIGZvcm1FbC5jbGFzc0xpc3QuY29udGFpbnMoXCJwaHgtc3VibWl0LWxvYWRpbmdcIikpKXtcbiAgICAgIGxldCBtZXRhID0gdGhpcy5leHRyYWN0TWV0YShmb3JtRWwsIHt9LCBvcHRzLnZhbHVlKVxuICAgICAgbGV0IGZvcm1EYXRhID0gc2VyaWFsaXplRm9ybShmb3JtRWwsIHtzdWJtaXR0ZXJ9KVxuICAgICAgdGhpcy5wdXNoV2l0aFJlcGx5KHJlZkdlbmVyYXRvciwgXCJldmVudFwiLCB7XG4gICAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgICBldmVudDogcGh4RXZlbnQsXG4gICAgICAgIHZhbHVlOiBmb3JtRGF0YSxcbiAgICAgICAgbWV0YTogbWV0YSxcbiAgICAgICAgY2lkOiBjaWRcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKCh7cmVzcH0pID0+IG9uUmVwbHkocmVzcCkpXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IGxvZ0Vycm9yKFwiRmFpbGVkIHRvIHB1c2ggZm9ybSBzdWJtaXRcIiwgZXJyb3IpKVxuICAgIH1cbiAgfVxuXG4gIHVwbG9hZEZpbGVzKGZvcm1FbCwgcGh4RXZlbnQsIHRhcmdldEN0eCwgcmVmLCBjaWQsIG9uQ29tcGxldGUpe1xuICAgIGxldCBqb2luQ291bnRBdFVwbG9hZCA9IHRoaXMuam9pbkNvdW50XG4gICAgbGV0IGlucHV0RWxzID0gTGl2ZVVwbG9hZGVyLmFjdGl2ZUZpbGVJbnB1dHMoZm9ybUVsKVxuICAgIGxldCBudW1GaWxlSW5wdXRzSW5Qcm9ncmVzcyA9IGlucHV0RWxzLmxlbmd0aFxuXG4gICAgLy8gZ2V0IGVhY2ggZmlsZSBpbnB1dFxuICAgIGlucHV0RWxzLmZvckVhY2goaW5wdXRFbCA9PiB7XG4gICAgICBsZXQgdXBsb2FkZXIgPSBuZXcgTGl2ZVVwbG9hZGVyKGlucHV0RWwsIHRoaXMsICgpID0+IHtcbiAgICAgICAgbnVtRmlsZUlucHV0c0luUHJvZ3Jlc3MtLVxuICAgICAgICBpZihudW1GaWxlSW5wdXRzSW5Qcm9ncmVzcyA9PT0gMCl7IG9uQ29tcGxldGUoKSB9XG4gICAgICB9KVxuXG4gICAgICBsZXQgZW50cmllcyA9IHVwbG9hZGVyLmVudHJpZXMoKS5tYXAoZW50cnkgPT4gZW50cnkudG9QcmVmbGlnaHRQYXlsb2FkKCkpXG5cbiAgICAgIGlmKGVudHJpZXMubGVuZ3RoID09PSAwKXtcbiAgICAgICAgbnVtRmlsZUlucHV0c0luUHJvZ3Jlc3MtLVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgbGV0IHBheWxvYWQgPSB7XG4gICAgICAgIHJlZjogaW5wdXRFbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpLFxuICAgICAgICBlbnRyaWVzOiBlbnRyaWVzLFxuICAgICAgICBjaWQ6IHRoaXMudGFyZ2V0Q29tcG9uZW50SUQoaW5wdXRFbC5mb3JtLCB0YXJnZXRDdHgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMubG9nKFwidXBsb2FkXCIsICgpID0+IFtcInNlbmRpbmcgcHJlZmxpZ2h0IHJlcXVlc3RcIiwgcGF5bG9hZF0pXG5cbiAgICAgIHRoaXMucHVzaFdpdGhSZXBseShudWxsLCBcImFsbG93X3VwbG9hZFwiLCBwYXlsb2FkKS50aGVuKCh7cmVzcH0pID0+IHtcbiAgICAgICAgdGhpcy5sb2coXCJ1cGxvYWRcIiwgKCkgPT4gW1wiZ290IHByZWZsaWdodCByZXNwb25zZVwiLCByZXNwXSlcbiAgICAgICAgLy8gdGhlIHByZWZsaWdodCB3aWxsIHJlamVjdCBlbnRyaWVzIGJleW9uZCB0aGUgbWF4IGVudHJpZXNcbiAgICAgICAgLy8gc28gd2UgZXJyb3IgYW5kIGNhbmNlbCBlbnRyaWVzIG9uIHRoZSBjbGllbnQgdGhhdCBhcmUgbWlzc2luZyBmcm9tIHRoZSByZXNwb25zZVxuICAgICAgICB1cGxvYWRlci5lbnRyaWVzKCkuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAgICAgaWYocmVzcC5lbnRyaWVzICYmICFyZXNwLmVudHJpZXNbZW50cnkucmVmXSl7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUZhaWxlZEVudHJ5UHJlZmxpZ2h0KGVudHJ5LnJlZiwgXCJmYWlsZWQgcHJlZmxpZ2h0XCIsIHVwbG9hZGVyKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLy8gZm9yIGF1dG8gdXBsb2Fkcywgd2UgbWF5IGhhdmUgYW4gZW1wdHkgZW50cmllcyByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgICAgLy8gZm9yIGZvcm0gc3VibWl0cyB0aGF0IGNvbnRhaW4gaW52YWxpZCBlbnRyaWVzXG4gICAgICAgIGlmKHJlc3AuZXJyb3IgfHwgT2JqZWN0LmtleXMocmVzcC5lbnRyaWVzKS5sZW5ndGggPT09IDApe1xuICAgICAgICAgIHRoaXMudW5kb1JlZnMocmVmLCBwaHhFdmVudClcbiAgICAgICAgICBsZXQgZXJyb3JzID0gcmVzcC5lcnJvciB8fCBbXVxuICAgICAgICAgIGVycm9ycy5tYXAoKFtlbnRyeV9yZWYsIHJlYXNvbl0pID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRmFpbGVkRW50cnlQcmVmbGlnaHQoZW50cnlfcmVmLCByZWFzb24sIHVwbG9hZGVyKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IG9uRXJyb3IgPSAoY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbC5vbkVycm9yKCgpID0+IHtcbiAgICAgICAgICAgICAgaWYodGhpcy5qb2luQ291bnQgPT09IGpvaW5Db3VudEF0VXBsb2FkKXsgY2FsbGJhY2soKSB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICB1cGxvYWRlci5pbml0QWRhcHRlclVwbG9hZChyZXNwLCBvbkVycm9yLCB0aGlzLmxpdmVTb2NrZXQpXG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4gbG9nRXJyb3IoXCJGYWlsZWQgdG8gcHVzaCB1cGxvYWRcIiwgZXJyb3IpKVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVGYWlsZWRFbnRyeVByZWZsaWdodCh1cGxvYWRSZWYsIHJlYXNvbiwgdXBsb2FkZXIpe1xuICAgIGlmKHVwbG9hZGVyLmlzQXV0b1VwbG9hZCgpKXtcbiAgICAgIC8vIHVwbG9hZFJlZiBtYXkgYmUgdG9wIGxldmVsIHVwbG9hZCBjb25maWcgcmVmIG9yIGVudHJ5IHJlZlxuICAgICAgbGV0IGVudHJ5ID0gdXBsb2FkZXIuZW50cmllcygpLmZpbmQoZW50cnkgPT4gZW50cnkucmVmID09PSB1cGxvYWRSZWYudG9TdHJpbmcoKSlcbiAgICAgIGlmKGVudHJ5KXsgZW50cnkuY2FuY2VsKCkgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1cGxvYWRlci5lbnRyaWVzKCkubWFwKGVudHJ5ID0+IGVudHJ5LmNhbmNlbCgpKVxuICAgIH1cbiAgICB0aGlzLmxvZyhcInVwbG9hZFwiLCAoKSA9PiBbYGVycm9yIGZvciBlbnRyeSAke3VwbG9hZFJlZn1gLCByZWFzb25dKVxuICB9XG5cbiAgZGlzcGF0Y2hVcGxvYWRzKHRhcmdldEN0eCwgbmFtZSwgZmlsZXNPckJsb2JzKXtcbiAgICBsZXQgdGFyZ2V0RWxlbWVudCA9IHRoaXMudGFyZ2V0Q3R4RWxlbWVudCh0YXJnZXRDdHgpIHx8IHRoaXMuZWxcbiAgICBsZXQgaW5wdXRzID0gRE9NLmZpbmRVcGxvYWRJbnB1dHModGFyZ2V0RWxlbWVudCkuZmlsdGVyKGVsID0+IGVsLm5hbWUgPT09IG5hbWUpXG4gICAgaWYoaW5wdXRzLmxlbmd0aCA9PT0gMCl7IGxvZ0Vycm9yKGBubyBsaXZlIGZpbGUgaW5wdXRzIGZvdW5kIG1hdGNoaW5nIHRoZSBuYW1lIFwiJHtuYW1lfVwiYCkgfVxuICAgIGVsc2UgaWYoaW5wdXRzLmxlbmd0aCA+IDEpeyBsb2dFcnJvcihgZHVwbGljYXRlIGxpdmUgZmlsZSBpbnB1dHMgZm91bmQgbWF0Y2hpbmcgdGhlIG5hbWUgXCIke25hbWV9XCJgKSB9XG4gICAgZWxzZSB7IERPTS5kaXNwYXRjaEV2ZW50KGlucHV0c1swXSwgUEhYX1RSQUNLX1VQTE9BRFMsIHtkZXRhaWw6IHtmaWxlczogZmlsZXNPckJsb2JzfX0pIH1cbiAgfVxuXG4gIHRhcmdldEN0eEVsZW1lbnQodGFyZ2V0Q3R4KXtcbiAgICBpZihpc0NpZCh0YXJnZXRDdHgpKXtcbiAgICAgIGxldCBbdGFyZ2V0XSA9IERPTS5maW5kQ29tcG9uZW50Tm9kZUxpc3QodGhpcy5lbCwgdGFyZ2V0Q3R4KVxuICAgICAgcmV0dXJuIHRhcmdldFxuICAgIH0gZWxzZSBpZih0YXJnZXRDdHgpe1xuICAgICAgcmV0dXJuIHRhcmdldEN0eFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIHB1c2hGb3JtUmVjb3Zlcnkob2xkRm9ybSwgbmV3Rm9ybSwgdGVtcGxhdGVEb20sIGNhbGxiYWNrKXtcbiAgICAvLyB3ZSBhcmUgb25seSByZWNvdmVyaW5nIGZvcm1zIGluc2lkZSB0aGUgY3VycmVudCB2aWV3LCB0aGVyZWZvcmUgaXQgaXMgc2FmZSB0b1xuICAgIC8vIHNraXAgd2l0aGluT3duZXJzIGhlcmUgYW5kIGFsd2F5cyB1c2UgdGhpcyB3aGVuIHJlZmVycmluZyB0byB0aGUgdmlld1xuICAgIGNvbnN0IHBoeENoYW5nZSA9IHRoaXMuYmluZGluZyhcImNoYW5nZVwiKVxuICAgIGNvbnN0IHBoeFRhcmdldCA9IG5ld0Zvcm0uZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcInRhcmdldFwiKSkgfHwgbmV3Rm9ybVxuICAgIGNvbnN0IHBoeEV2ZW50ID0gbmV3Rm9ybS5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9BVVRPX1JFQ09WRVIpKSB8fCBuZXdGb3JtLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIikpXG4gICAgY29uc3QgaW5wdXRzID0gQXJyYXkuZnJvbShvbGRGb3JtLmVsZW1lbnRzKS5maWx0ZXIoZWwgPT4gRE9NLmlzRm9ybUlucHV0KGVsKSAmJiBlbC5uYW1lICYmICFlbC5oYXNBdHRyaWJ1dGUocGh4Q2hhbmdlKSlcbiAgICBpZihpbnB1dHMubGVuZ3RoID09PSAwKXtcbiAgICAgIGNhbGxiYWNrKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIHdlIG11c3QgY2xlYXIgdHJhY2tlZCB1cGxvYWRzIGJlZm9yZSByZWNvdmVyeSBhcyB0aGV5IG5vIGxvbmdlciBoYXZlIHZhbGlkIHJlZnNcbiAgICBpbnB1dHMuZm9yRWFjaChpbnB1dCA9PiBpbnB1dC5oYXNBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpICYmIExpdmVVcGxvYWRlci5jbGVhckZpbGVzKGlucHV0KSlcbiAgICAvLyBwdXNoSW5wdXQgYXNzdW1lcyB0aGF0IHRoZXJlIGlzIGEgc291cmNlIGVsZW1lbnQgdGhhdCBpbml0aWF0ZWQgdGhlIGNoYW5nZTtcbiAgICAvLyBiZWNhdXNlIHRoaXMgaXMgbm90IHRoZSBjYXNlIHdoZW4gd2UgcmVjb3ZlciBmb3Jtcywgd2UgcHJvdmlkZSB0aGUgZmlyc3QgaW5wdXQgd2UgZmluZFxuICAgIGxldCBpbnB1dCA9IGlucHV0cy5maW5kKGVsID0+IGVsLnR5cGUgIT09IFwiaGlkZGVuXCIpIHx8IGlucHV0c1swXVxuXG4gICAgLy8gaW4gdGhlIGNhc2UgdGhhdCB0aGVyZSBhcmUgbXVsdGlwbGUgdGFyZ2V0cywgd2UgY291bnQgdGhlIG51bWJlciBvZiBwZW5kaW5nIHJlY292ZXJ5IGV2ZW50c1xuICAgIC8vIGFuZCBvbmx5IGNhbGwgdGhlIGNhbGxiYWNrIG9uY2UgYWxsIGV2ZW50cyBoYXZlIGJlZW4gcHJvY2Vzc2VkXG4gICAgbGV0IHBlbmRpbmcgPSAwXG4gICAgLy8gd2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsIGNhbGxiYWNrLCBkb20sIHZpZXdFbClcbiAgICB0aGlzLndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCAodGFyZ2V0VmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICBjb25zdCBjaWQgPSB0aGlzLnRhcmdldENvbXBvbmVudElEKG5ld0Zvcm0sIHRhcmdldEN0eClcbiAgICAgIHBlbmRpbmcrK1xuICAgICAgbGV0IGUgPSBuZXcgQ3VzdG9tRXZlbnQoXCJwaHg6Zm9ybS1yZWNvdmVyeVwiLCB7ZGV0YWlsOiB7c291cmNlRWxlbWVudDogb2xkRm9ybX19KVxuICAgICAgSlMuZXhlYyhlLCBcImNoYW5nZVwiLCBwaHhFdmVudCwgdGhpcywgaW5wdXQsIFtcInB1c2hcIiwge1xuICAgICAgICBfdGFyZ2V0OiBpbnB1dC5uYW1lLFxuICAgICAgICB0YXJnZXRWaWV3LFxuICAgICAgICB0YXJnZXRDdHgsXG4gICAgICAgIG5ld0NpZDogY2lkLFxuICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgIHBlbmRpbmctLVxuICAgICAgICAgIGlmKHBlbmRpbmcgPT09IDApeyBjYWxsYmFjaygpIH1cbiAgICAgICAgfVxuICAgICAgfV0pXG4gICAgfSwgdGVtcGxhdGVEb20sIHRlbXBsYXRlRG9tKVxuICB9XG5cbiAgcHVzaExpbmtQYXRjaChlLCBocmVmLCB0YXJnZXRFbCwgY2FsbGJhY2spe1xuICAgIGxldCBsaW5rUmVmID0gdGhpcy5saXZlU29ja2V0LnNldFBlbmRpbmdMaW5rKGhyZWYpXG4gICAgLy8gb25seSBhZGQgbG9hZGluZyBzdGF0ZXMgaWYgZXZlbnQgaXMgdHJ1c3RlZCAoaXQgd2FzIHRyaWdnZXJlZCBieSB1c2VyLCBzdWNoIGFzIGNsaWNrKSBhbmRcbiAgICAvLyBpdCdzIG5vdCBhIGZvcndhcmQvYmFjayBuYXZpZ2F0aW9uIGZyb20gcG9wc3RhdGVcbiAgICBsZXQgbG9hZGluZyA9IGUuaXNUcnVzdGVkICYmIGUudHlwZSAhPT0gXCJwb3BzdGF0ZVwiXG4gICAgbGV0IHJlZkdlbiA9IHRhcmdldEVsID8gKCkgPT4gdGhpcy5wdXRSZWYoW3tlbDogdGFyZ2V0RWwsIGxvYWRpbmc6IGxvYWRpbmcsIGxvY2s6IHRydWV9XSwgbnVsbCwgXCJjbGlja1wiKSA6IG51bGxcbiAgICBsZXQgZmFsbGJhY2sgPSAoKSA9PiB0aGlzLmxpdmVTb2NrZXQucmVkaXJlY3Qod2luZG93LmxvY2F0aW9uLmhyZWYpXG4gICAgbGV0IHVybCA9IGhyZWYuc3RhcnRzV2l0aChcIi9cIikgPyBgJHtsb2NhdGlvbi5wcm90b2NvbH0vLyR7bG9jYXRpb24uaG9zdH0ke2hyZWZ9YCA6IGhyZWZcblxuICAgIHRoaXMucHVzaFdpdGhSZXBseShyZWZHZW4sIFwibGl2ZV9wYXRjaFwiLCB7dXJsfSkudGhlbihcbiAgICAgICh7cmVzcH0pID0+IHtcbiAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgIGlmKHJlc3AubGlua19yZWRpcmVjdCl7XG4gICAgICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVwbGFjZU1haW4oaHJlZiwgbnVsbCwgY2FsbGJhY2ssIGxpbmtSZWYpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHRoaXMubGl2ZVNvY2tldC5jb21taXRQZW5kaW5nTGluayhsaW5rUmVmKSl7XG4gICAgICAgICAgICAgIHRoaXMuaHJlZiA9IGhyZWZcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYXBwbHlQZW5kaW5nVXBkYXRlcygpXG4gICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhsaW5rUmVmKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICAoe2Vycm9yOiBfZXJyb3IsIHRpbWVvdXQ6IF90aW1lb3V0fSkgPT4gZmFsbGJhY2soKVxuICAgIClcbiAgfVxuXG4gIGdldEZvcm1zRm9yUmVjb3ZlcnkoKXtcbiAgICBpZih0aGlzLmpvaW5Db3VudCA9PT0gMCl7IHJldHVybiB7fSB9XG5cbiAgICBsZXQgcGh4Q2hhbmdlID0gdGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpXG5cbiAgICByZXR1cm4gRE9NLmFsbCh0aGlzLmVsLCBgZm9ybVske3BoeENoYW5nZX1dYClcbiAgICAgIC5maWx0ZXIoZm9ybSA9PiBmb3JtLmlkKVxuICAgICAgLmZpbHRlcihmb3JtID0+IGZvcm0uZWxlbWVudHMubGVuZ3RoID4gMClcbiAgICAgIC5maWx0ZXIoZm9ybSA9PiBmb3JtLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0FVVE9fUkVDT1ZFUikpICE9PSBcImlnbm9yZVwiKVxuICAgICAgLm1hcChmb3JtID0+IHtcbiAgICAgICAgLy8gd2UgcGVyZm9ybSBhIHNoYWxsb3cgY2xvbmUgYW5kIG1hbnVhbGx5IGNvcHkgYWxsIGVsZW1lbnRzXG4gICAgICAgIGNvbnN0IGNsb25lZEZvcm0gPSBmb3JtLmNsb25lTm9kZShmYWxzZSlcbiAgICAgICAgLy8gd2UgbmVlZCB0byBjb3B5IHRoZSBwcml2YXRlIGRhdGEgYXMgaXQgY29udGFpbnNcbiAgICAgICAgLy8gdGhlIGluZm9ybWF0aW9uIGFib3V0IHRvdWNoZWQgZmllbGRzXG4gICAgICAgIERPTS5jb3B5UHJpdmF0ZXMoY2xvbmVkRm9ybSwgZm9ybSlcbiAgICAgICAgQXJyYXkuZnJvbShmb3JtLmVsZW1lbnRzKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIC8vIHdlIG5lZWQgdG8gY2xvbmUgYWxsIGNoaWxkIG5vZGVzIGFzIHdlbGwsXG4gICAgICAgICAgLy8gYmVjYXVzZSB0aG9zZSBjb3VsZCBhbHNvIGJlIHNlbGVjdHNcbiAgICAgICAgICBjb25zdCBjbG9uZWRFbCA9IGVsLmNsb25lTm9kZSh0cnVlKVxuICAgICAgICAgIC8vIHdlIGNhbGwgbW9ycGhkb20gdG8gY29weSBhbnkgc3BlY2lhbCBzdGF0ZVxuICAgICAgICAgIC8vIGxpa2UgdGhlIHNlbGVjdGVkIG9wdGlvbiBvZiBhIDxzZWxlY3Q+IGVsZW1lbnQ7XG4gICAgICAgICAgLy8gdGhpcyBzaG91bGQgYmUgcGxlbnR5IGZhc3QgYXMgd2UgY2FsbCBpdCBvbiBhIHNtYWxsIHN1YnNldCBvZiB0aGUgRE9NLFxuICAgICAgICAgIC8vIHNpbmdsZSBpbnB1dHMgb3IgYSBzZWxlY3Qgd2l0aCBjaGlsZHJlblxuICAgICAgICAgIG1vcnBoZG9tKGNsb25lZEVsLCBlbClcbiAgICAgICAgICBET00uY29weVByaXZhdGVzKGNsb25lZEVsLCBlbClcbiAgICAgICAgICBjbG9uZWRGb3JtLmFwcGVuZENoaWxkKGNsb25lZEVsKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gY2xvbmVkRm9ybVxuICAgICAgfSlcbiAgICAgIC5yZWR1Y2UoKGFjYywgZm9ybSkgPT4ge1xuICAgICAgICBhY2NbZm9ybS5pZF0gPSBmb3JtXG4gICAgICAgIHJldHVybiBhY2NcbiAgICAgIH0sIHt9KVxuICB9XG5cbiAgbWF5YmVQdXNoQ29tcG9uZW50c0Rlc3Ryb3llZChkZXN0cm95ZWRDSURzKXtcbiAgICBsZXQgd2lsbERlc3Ryb3lDSURzID0gZGVzdHJveWVkQ0lEcy5maWx0ZXIoY2lkID0+IHtcbiAgICAgIHJldHVybiBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIGNpZCkubGVuZ3RoID09PSAwXG4gICAgfSlcblxuICAgIGlmKHdpbGxEZXN0cm95Q0lEcy5sZW5ndGggPiAwKXtcbiAgICAgIC8vIHdlIG11c3QgcmVzZXQgdGhlIHJlbmRlciBjaGFuZ2UgdHJhY2tpbmcgZm9yIGNpZHMgdGhhdFxuICAgICAgLy8gY291bGQgYmUgYWRkZWQgYmFjayBmcm9tIHRoZSBzZXJ2ZXIgc28gd2UgZG9uJ3Qgc2tpcCB0aGVtXG4gICAgICB3aWxsRGVzdHJveUNJRHMuZm9yRWFjaChjaWQgPT4gdGhpcy5yZW5kZXJlZC5yZXNldFJlbmRlcihjaWQpKVxuXG4gICAgICB0aGlzLnB1c2hXaXRoUmVwbHkobnVsbCwgXCJjaWRzX3dpbGxfZGVzdHJveVwiLCB7Y2lkczogd2lsbERlc3Ryb3lDSURzfSkudGhlbigoKSA9PiB7XG4gICAgICAgIC8vIHdlIG11c3Qgd2FpdCBmb3IgcGVuZGluZyB0cmFuc2l0aW9ucyB0byBjb21wbGV0ZSBiZWZvcmUgZGV0ZXJtaW5pbmdcbiAgICAgICAgLy8gaWYgdGhlIGNpZHMgd2VyZSBhZGRlZCBiYWNrIHRvIHRoZSBET00gaW4gdGhlIG1lYW50aW1lICgjMzEzOSlcbiAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgIC8vIFNlZSBpZiBhbnkgb2YgdGhlIGNpZHMgd2Ugd2FudGVkIHRvIGRlc3Ryb3kgd2VyZSBhZGRlZCBiYWNrLFxuICAgICAgICAgIC8vIGlmIHRoZXkgd2VyZSBhZGRlZCBiYWNrLCB3ZSBkb24ndCBhY3R1YWxseSBkZXN0cm95IHRoZW0uXG4gICAgICAgICAgbGV0IGNvbXBsZXRlbHlEZXN0cm95Q0lEcyA9IHdpbGxEZXN0cm95Q0lEcy5maWx0ZXIoY2lkID0+IHtcbiAgICAgICAgICAgIHJldHVybiBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIGNpZCkubGVuZ3RoID09PSAwXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGlmKGNvbXBsZXRlbHlEZXN0cm95Q0lEcy5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgIHRoaXMucHVzaFdpdGhSZXBseShudWxsLCBcImNpZHNfZGVzdHJveWVkXCIsIHtjaWRzOiBjb21wbGV0ZWx5RGVzdHJveUNJRHN9KS50aGVuKCh7cmVzcH0pID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZC5wcnVuZUNJRHMocmVzcC5jaWRzKVxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiBsb2dFcnJvcihcIkZhaWxlZCB0byBwdXNoIGNvbXBvbmVudHMgZGVzdHJveWVkXCIsIGVycm9yKSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IGxvZ0Vycm9yKFwiRmFpbGVkIHRvIHB1c2ggY29tcG9uZW50cyBkZXN0cm95ZWRcIiwgZXJyb3IpKVxuICAgIH1cbiAgfVxuXG4gIG93bnNFbGVtZW50KGVsKXtcbiAgICBsZXQgcGFyZW50Vmlld0VsID0gZWwuY2xvc2VzdChQSFhfVklFV19TRUxFQ1RPUilcbiAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKFBIWF9QQVJFTlRfSUQpID09PSB0aGlzLmlkIHx8XG4gICAgICAocGFyZW50Vmlld0VsICYmIHBhcmVudFZpZXdFbC5pZCA9PT0gdGhpcy5pZCkgfHxcbiAgICAgICghcGFyZW50Vmlld0VsICYmIHRoaXMuaXNEZWFkKVxuICB9XG5cbiAgc3VibWl0Rm9ybShmb3JtLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBzdWJtaXR0ZXIsIG9wdHMgPSB7fSl7XG4gICAgRE9NLnB1dFByaXZhdGUoZm9ybSwgUEhYX0hBU19TVUJNSVRURUQsIHRydWUpXG4gICAgY29uc3QgaW5wdXRzID0gQXJyYXkuZnJvbShmb3JtLmVsZW1lbnRzKVxuICAgIGlucHV0cy5mb3JFYWNoKGlucHV0ID0+IERPTS5wdXRQcml2YXRlKGlucHV0LCBQSFhfSEFTX1NVQk1JVFRFRCwgdHJ1ZSkpXG4gICAgdGhpcy5saXZlU29ja2V0LmJsdXJBY3RpdmVFbGVtZW50KHRoaXMpXG4gICAgdGhpcy5wdXNoRm9ybVN1Ym1pdChmb3JtLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBzdWJtaXR0ZXIsIG9wdHMsICgpID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXN0b3JlUHJldmlvdXNseUFjdGl2ZUZvY3VzKClcbiAgICB9KVxuICB9XG5cbiAgYmluZGluZyhraW5kKXsgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC5iaW5kaW5nKGtpbmQpIH1cbn1cbiIsICIvKiogSW5pdGlhbGl6ZXMgdGhlIExpdmVTb2NrZXRcbiAqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGVuZFBvaW50IC0gVGhlIHN0cmluZyBXZWJTb2NrZXQgZW5kcG9pbnQsIGllLCBgXCJ3c3M6Ly9leGFtcGxlLmNvbS9saXZlXCJgLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBcIi9saXZlXCJgIChpbmhlcml0ZWQgaG9zdCAmIHByb3RvY29sKVxuICogQHBhcmFtIHtQaG9lbml4LlNvY2tldH0gc29ja2V0IC0gdGhlIHJlcXVpcmVkIFBob2VuaXggU29ja2V0IGNsYXNzIGltcG9ydGVkIGZyb20gXCJwaG9lbml4XCIuIEZvciBleGFtcGxlOlxuICpcbiAqICAgICBpbXBvcnQge1NvY2tldH0gZnJvbSBcInBob2VuaXhcIlxuICogICAgIGltcG9ydCB7TGl2ZVNvY2tldH0gZnJvbSBcInBob2VuaXhfbGl2ZV92aWV3XCJcbiAqICAgICBsZXQgbGl2ZVNvY2tldCA9IG5ldyBMaXZlU29ja2V0KFwiL2xpdmVcIiwgU29ja2V0LCB7Li4ufSlcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHNdIC0gT3B0aW9uYWwgY29uZmlndXJhdGlvbi4gT3V0c2lkZSBvZiBrZXlzIGxpc3RlZCBiZWxvdywgYWxsXG4gKiBjb25maWd1cmF0aW9uIGlzIHBhc3NlZCBkaXJlY3RseSB0byB0aGUgUGhvZW5peCBTb2NrZXQgY29uc3RydWN0b3IuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMuZGVmYXVsdHNdIC0gVGhlIG9wdGlvbmFsIGRlZmF1bHRzIHRvIHVzZSBmb3IgdmFyaW91cyBiaW5kaW5ncyxcbiAqIHN1Y2ggYXMgYHBoeC1kZWJvdW5jZWAuIFN1cHBvcnRzIHRoZSBmb2xsb3dpbmcga2V5czpcbiAqXG4gKiAgIC0gZGVib3VuY2UgLSB0aGUgbWlsbGlzZWNvbmQgcGh4LWRlYm91bmNlIHRpbWUuIERlZmF1bHRzIDMwMFxuICogICAtIHRocm90dGxlIC0gdGhlIG1pbGxpc2Vjb25kIHBoeC10aHJvdHRsZSB0aW1lLiBEZWZhdWx0cyAzMDBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5wYXJhbXNdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIGZvciBwYXNzaW5nIGNvbm5lY3QgcGFyYW1zLlxuICogVGhlIGZ1bmN0aW9uIHJlY2VpdmVzIHRoZSBlbGVtZW50IGFzc29jaWF0ZWQgd2l0aCBhIGdpdmVuIExpdmVWaWV3LiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgICAgKGVsKSA9PiB7dmlldzogZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1teS12aWV3LW5hbWVcIiwgdG9rZW46IHdpbmRvdy5teVRva2VufVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5iaW5kaW5nUHJlZml4XSAtIFRoZSBvcHRpb25hbCBwcmVmaXggdG8gdXNlIGZvciBhbGwgcGh4IERPTSBhbm5vdGF0aW9ucy5cbiAqIERlZmF1bHRzIHRvIFwicGh4LVwiLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLmhvb2tzXSAtIFRoZSBvcHRpb25hbCBvYmplY3QgZm9yIHJlZmVyZW5jaW5nIExpdmVWaWV3IGhvb2sgY2FsbGJhY2tzLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLnVwbG9hZGVyc10gLSBUaGUgb3B0aW9uYWwgb2JqZWN0IGZvciByZWZlcmVuY2luZyBMaXZlVmlldyB1cGxvYWRlciBjYWxsYmFja3MuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLmxvYWRlclRpbWVvdXRdIC0gVGhlIG9wdGlvbmFsIGRlbGF5IGluIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBhcHBseVxuICogbG9hZGluZyBzdGF0ZXMuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLmRpc2Nvbm5lY3RlZFRpbWVvdXRdIC0gVGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZVxuICogZXhlY3V0aW5nIHBoeC1kaXNjb25uZWN0ZWQgY29tbWFuZHMuIERlZmF1bHRzIHRvIDUwMC5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gW29wdHMubWF4UmVsb2Fkc10gLSBUaGUgbWF4aW11bSByZWxvYWRzIGJlZm9yZSBlbnRlcmluZyBmYWlsc2FmZSBtb2RlLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBbb3B0cy5yZWxvYWRKaXR0ZXJNaW5dIC0gVGhlIG1pbmltdW0gdGltZSBiZXR3ZWVuIG5vcm1hbCByZWxvYWQgYXR0ZW1wdHMuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLnJlbG9hZEppdHRlck1heF0gLSBUaGUgbWF4aW11bSB0aW1lIGJldHdlZW4gbm9ybWFsIHJlbG9hZCBhdHRlbXB0cy5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gW29wdHMuZmFpbHNhZmVKaXR0ZXJdIC0gVGhlIHRpbWUgYmV0d2VlbiByZWxvYWQgYXR0ZW1wdHMgaW4gZmFpbHNhZmUgbW9kZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnZpZXdMb2dnZXJdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGxvZyBkZWJ1ZyBpbmZvcm1hdGlvbi4gRm9yIGV4YW1wbGU6XG4gKlxuICogICAgICh2aWV3LCBraW5kLCBtc2csIG9iaikgPT4gY29uc29sZS5sb2coYCR7dmlldy5pZH0gJHtraW5kfTogJHttc2d9IC0gYCwgb2JqKVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5tZXRhZGF0YV0gLSBUaGUgb3B0aW9uYWwgb2JqZWN0IG1hcHBpbmcgZXZlbnQgbmFtZXMgdG8gZnVuY3Rpb25zIGZvclxuICogcG9wdWxhdGluZyBldmVudCBtZXRhZGF0YS4gRm9yIGV4YW1wbGU6XG4gKlxuICogICAgIG1ldGFkYXRhOiB7XG4gKiAgICAgICBjbGljazogKGUsIGVsKSA9PiB7XG4gKiAgICAgICAgIHJldHVybiB7XG4gKiAgICAgICAgICAgY3RybEtleTogZS5jdHJsS2V5LFxuICogICAgICAgICAgIG1ldGFLZXk6IGUubWV0YUtleSxcbiAqICAgICAgICAgICBkZXRhaWw6IGUuZGV0YWlsIHx8IDEsXG4gKiAgICAgICAgIH1cbiAqICAgICAgIH0sXG4gKiAgICAgICBrZXlkb3duOiAoZSwgZWwpID0+IHtcbiAqICAgICAgICAgcmV0dXJuIHtcbiAqICAgICAgICAgICBrZXk6IGUua2V5LFxuICogICAgICAgICAgIGN0cmxLZXk6IGUuY3RybEtleSxcbiAqICAgICAgICAgICBtZXRhS2V5OiBlLm1ldGFLZXksXG4gKiAgICAgICAgICAgc2hpZnRLZXk6IGUuc2hpZnRLZXlcbiAqICAgICAgICAgfVxuICogICAgICAgfVxuICogICAgIH1cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5zZXNzaW9uU3RvcmFnZV0gLSBBbiBvcHRpb25hbCBTdG9yYWdlIGNvbXBhdGlibGUgb2JqZWN0XG4gKiBVc2VmdWwgd2hlbiBMaXZlVmlldyB3b24ndCBoYXZlIGFjY2VzcyB0byBgc2Vzc2lvblN0b3JhZ2VgLiAgRm9yIGV4YW1wbGUsIFRoaXMgY291bGRcbiAqIGhhcHBlbiBpZiBhIHNpdGUgbG9hZHMgYSBjcm9zcy1kb21haW4gTGl2ZVZpZXcgaW4gYW4gaWZyYW1lLiAgRXhhbXBsZSB1c2FnZTpcbiAqXG4gKiAgICAgY2xhc3MgSW5NZW1vcnlTdG9yYWdlIHtcbiAqICAgICAgIGNvbnN0cnVjdG9yKCkgeyB0aGlzLnN0b3JhZ2UgPSB7fSB9XG4gKiAgICAgICBnZXRJdGVtKGtleU5hbWUpIHsgcmV0dXJuIHRoaXMuc3RvcmFnZVtrZXlOYW1lXSB8fCBudWxsIH1cbiAqICAgICAgIHJlbW92ZUl0ZW0oa2V5TmFtZSkgeyBkZWxldGUgdGhpcy5zdG9yYWdlW2tleU5hbWVdIH1cbiAqICAgICAgIHNldEl0ZW0oa2V5TmFtZSwga2V5VmFsdWUpIHsgdGhpcy5zdG9yYWdlW2tleU5hbWVdID0ga2V5VmFsdWUgfVxuICogICAgIH1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMubG9jYWxTdG9yYWdlXSAtIEFuIG9wdGlvbmFsIFN0b3JhZ2UgY29tcGF0aWJsZSBvYmplY3RcbiAqIFVzZWZ1bCBmb3Igd2hlbiBMaXZlVmlldyB3b24ndCBoYXZlIGFjY2VzcyB0byBgbG9jYWxTdG9yYWdlYC5cbiAqIFNlZSBgb3B0cy5zZXNzaW9uU3RvcmFnZWAgZm9yIGV4YW1wbGVzLlxuKi9cblxuaW1wb3J0IHtcbiAgQklORElOR19QUkVGSVgsXG4gIENPTlNFQ1VUSVZFX1JFTE9BRFMsXG4gIERFRkFVTFRTLFxuICBGQUlMU0FGRV9KSVRURVIsXG4gIExPQURFUl9USU1FT1VULFxuICBESVNDT05ORUNURURfVElNRU9VVCxcbiAgTUFYX1JFTE9BRFMsXG4gIFBIWF9ERUJPVU5DRSxcbiAgUEhYX0RST1BfVEFSR0VULFxuICBQSFhfSEFTX0ZPQ1VTRUQsXG4gIFBIWF9LRVksXG4gIFBIWF9MSU5LX1NUQVRFLFxuICBQSFhfTElWRV9MSU5LLFxuICBQSFhfTFZfREVCVUcsXG4gIFBIWF9MVl9MQVRFTkNZX1NJTSxcbiAgUEhYX0xWX1BST0ZJTEUsXG4gIFBIWF9MVl9ISVNUT1JZX1BPU0lUSU9OLFxuICBQSFhfTUFJTixcbiAgUEhYX1BBUkVOVF9JRCxcbiAgUEhYX1ZJRVdfU0VMRUNUT1IsXG4gIFBIWF9ST09UX0lELFxuICBQSFhfVEhST1RUTEUsXG4gIFBIWF9UUkFDS19VUExPQURTLFxuICBQSFhfU0VTU0lPTixcbiAgUkVMT0FEX0pJVFRFUl9NSU4sXG4gIFJFTE9BRF9KSVRURVJfTUFYLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX1JFTE9BRF9TVEFUVVNcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2xvbmUsXG4gIGNsb3Nlc3RQaHhCaW5kaW5nLFxuICBjbG9zdXJlLFxuICBkZWJ1ZyxcbiAgbWF5YmVcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgQnJvd3NlciBmcm9tIFwiLi9icm93c2VyXCJcbmltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcbmltcG9ydCBIb29rcyBmcm9tIFwiLi9ob29rc1wiXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuaW1wb3J0IFZpZXcgZnJvbSBcIi4vdmlld1wiXG5pbXBvcnQgSlMgZnJvbSBcIi4vanNcIlxuXG5leHBvcnQgbGV0IGlzVXNlZElucHV0ID0gKGVsKSA9PiBET00uaXNVc2VkSW5wdXQoZWwpXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpdmVTb2NrZXQge1xuICBjb25zdHJ1Y3Rvcih1cmwsIHBoeFNvY2tldCwgb3B0cyA9IHt9KXtcbiAgICB0aGlzLnVubG9hZGVkID0gZmFsc2VcbiAgICBpZighcGh4U29ja2V0IHx8IHBoeFNvY2tldC5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIk9iamVjdFwiKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICBhIHBob2VuaXggU29ja2V0IG11c3QgYmUgcHJvdmlkZWQgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB0byB0aGUgTGl2ZVNvY2tldCBjb25zdHJ1Y3Rvci4gRm9yIGV4YW1wbGU6XG5cbiAgICAgICAgICBpbXBvcnQge1NvY2tldH0gZnJvbSBcInBob2VuaXhcIlxuICAgICAgICAgIGltcG9ydCB7TGl2ZVNvY2tldH0gZnJvbSBcInBob2VuaXhfbGl2ZV92aWV3XCJcbiAgICAgICAgICBsZXQgbGl2ZVNvY2tldCA9IG5ldyBMaXZlU29ja2V0KFwiL2xpdmVcIiwgU29ja2V0LCB7Li4ufSlcbiAgICAgIGApXG4gICAgfVxuICAgIHRoaXMuc29ja2V0ID0gbmV3IHBoeFNvY2tldCh1cmwsIG9wdHMpXG4gICAgdGhpcy5iaW5kaW5nUHJlZml4ID0gb3B0cy5iaW5kaW5nUHJlZml4IHx8IEJJTkRJTkdfUFJFRklYXG4gICAgdGhpcy5vcHRzID0gb3B0c1xuICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShvcHRzLnBhcmFtcyB8fCB7fSlcbiAgICB0aGlzLnZpZXdMb2dnZXIgPSBvcHRzLnZpZXdMb2dnZXJcbiAgICB0aGlzLm1ldGFkYXRhQ2FsbGJhY2tzID0gb3B0cy5tZXRhZGF0YSB8fCB7fVxuICAgIHRoaXMuZGVmYXVsdHMgPSBPYmplY3QuYXNzaWduKGNsb25lKERFRkFVTFRTKSwgb3B0cy5kZWZhdWx0cyB8fCB7fSlcbiAgICB0aGlzLmFjdGl2ZUVsZW1lbnQgPSBudWxsXG4gICAgdGhpcy5wcmV2QWN0aXZlID0gbnVsbFxuICAgIHRoaXMuc2lsZW5jZWQgPSBmYWxzZVxuICAgIHRoaXMubWFpbiA9IG51bGxcbiAgICB0aGlzLm91dGdvaW5nTWFpbkVsID0gbnVsbFxuICAgIHRoaXMuY2xpY2tTdGFydGVkQXRUYXJnZXQgPSBudWxsXG4gICAgdGhpcy5saW5rUmVmID0gMVxuICAgIHRoaXMucm9vdHMgPSB7fVxuICAgIHRoaXMuaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgdGhpcy5wZW5kaW5nTGluayA9IG51bGxcbiAgICB0aGlzLmN1cnJlbnRMb2NhdGlvbiA9IGNsb25lKHdpbmRvdy5sb2NhdGlvbilcbiAgICB0aGlzLmhvb2tzID0gb3B0cy5ob29rcyB8fCB7fVxuICAgIHRoaXMudXBsb2FkZXJzID0gb3B0cy51cGxvYWRlcnMgfHwge31cbiAgICB0aGlzLmxvYWRlclRpbWVvdXQgPSBvcHRzLmxvYWRlclRpbWVvdXQgfHwgTE9BREVSX1RJTUVPVVRcbiAgICB0aGlzLmRpc2Nvbm5lY3RlZFRpbWVvdXQgPSBvcHRzLmRpc2Nvbm5lY3RlZFRpbWVvdXQgfHwgRElTQ09OTkVDVEVEX1RJTUVPVVRcbiAgICB0aGlzLnJlbG9hZFdpdGhKaXR0ZXJUaW1lciA9IG51bGxcbiAgICB0aGlzLm1heFJlbG9hZHMgPSBvcHRzLm1heFJlbG9hZHMgfHwgTUFYX1JFTE9BRFNcbiAgICB0aGlzLnJlbG9hZEppdHRlck1pbiA9IG9wdHMucmVsb2FkSml0dGVyTWluIHx8IFJFTE9BRF9KSVRURVJfTUlOXG4gICAgdGhpcy5yZWxvYWRKaXR0ZXJNYXggPSBvcHRzLnJlbG9hZEppdHRlck1heCB8fCBSRUxPQURfSklUVEVSX01BWFxuICAgIHRoaXMuZmFpbHNhZmVKaXR0ZXIgPSBvcHRzLmZhaWxzYWZlSml0dGVyIHx8IEZBSUxTQUZFX0pJVFRFUlxuICAgIHRoaXMubG9jYWxTdG9yYWdlID0gb3B0cy5sb2NhbFN0b3JhZ2UgfHwgd2luZG93LmxvY2FsU3RvcmFnZVxuICAgIHRoaXMuc2Vzc2lvblN0b3JhZ2UgPSBvcHRzLnNlc3Npb25TdG9yYWdlIHx8IHdpbmRvdy5zZXNzaW9uU3RvcmFnZVxuICAgIHRoaXMuYm91bmRUb3BMZXZlbEV2ZW50cyA9IGZhbHNlXG4gICAgdGhpcy5ib3VuZEV2ZW50TmFtZXMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnNlcnZlckNsb3NlUmVmID0gbnVsbFxuICAgIHRoaXMuZG9tQ2FsbGJhY2tzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBqc1F1ZXJ5U2VsZWN0b3JBbGw6IG51bGwsXG4gICAgICBvblBhdGNoU3RhcnQ6IGNsb3N1cmUoKSxcbiAgICAgIG9uUGF0Y2hFbmQ6IGNsb3N1cmUoKSxcbiAgICAgIG9uTm9kZUFkZGVkOiBjbG9zdXJlKCksXG4gICAgICBvbkJlZm9yZUVsVXBkYXRlZDogY2xvc3VyZSgpfSxcbiAgICBvcHRzLmRvbSB8fCB7fSlcbiAgICB0aGlzLnRyYW5zaXRpb25zID0gbmV3IFRyYW5zaXRpb25TZXQoKVxuICAgIHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvbiA9IHBhcnNlSW50KHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfSElTVE9SWV9QT1NJVElPTikpIHx8IDBcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2VoaWRlXCIsIF9lID0+IHtcbiAgICAgIHRoaXMudW5sb2FkZWQgPSB0cnVlXG4gICAgfSlcbiAgICB0aGlzLnNvY2tldC5vbk9wZW4oKCkgPT4ge1xuICAgICAgaWYodGhpcy5pc1VubG9hZGVkKCkpe1xuICAgICAgICAvLyByZWxvYWQgcGFnZSBpZiBiZWluZyByZXN0b3JlZCBmcm9tIGJhY2svZm9yd2FyZCBjYWNoZSBhbmQgYnJvd3NlciBkb2VzIG5vdCBlbWl0IFwicGFnZXNob3dcIlxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy8gcHVibGljXG5cbiAgdmVyc2lvbigpeyByZXR1cm4gTFZfVlNOIH1cblxuICBpc1Byb2ZpbGVFbmFibGVkKCl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX1BST0ZJTEUpID09PSBcInRydWVcIiB9XG5cbiAgaXNEZWJ1Z0VuYWJsZWQoKXsgcmV0dXJuIHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfREVCVUcpID09PSBcInRydWVcIiB9XG5cbiAgaXNEZWJ1Z0Rpc2FibGVkKCl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX0RFQlVHKSA9PT0gXCJmYWxzZVwiIH1cblxuICBlbmFibGVEZWJ1ZygpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX0RFQlVHLCBcInRydWVcIikgfVxuXG4gIGVuYWJsZVByb2ZpbGluZygpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX1BST0ZJTEUsIFwidHJ1ZVwiKSB9XG5cbiAgZGlzYWJsZURlYnVnKCl7IHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfREVCVUcsIFwiZmFsc2VcIikgfVxuXG4gIGRpc2FibGVQcm9maWxpbmcoKXsgdGhpcy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFBIWF9MVl9QUk9GSUxFKSB9XG5cbiAgZW5hYmxlTGF0ZW5jeVNpbSh1cHBlckJvdW5kTXMpe1xuICAgIHRoaXMuZW5hYmxlRGVidWcoKVxuICAgIGNvbnNvbGUubG9nKFwibGF0ZW5jeSBzaW11bGF0b3IgZW5hYmxlZCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoaXMgYnJvd3NlciBzZXNzaW9uLiBDYWxsIGRpc2FibGVMYXRlbmN5U2ltKCkgdG8gZGlzYWJsZVwiKVxuICAgIHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfTEFURU5DWV9TSU0sIHVwcGVyQm91bmRNcylcbiAgfVxuXG4gIGRpc2FibGVMYXRlbmN5U2ltKCl7IHRoaXMuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShQSFhfTFZfTEFURU5DWV9TSU0pIH1cblxuICBnZXRMYXRlbmN5U2ltKCl7XG4gICAgbGV0IHN0ciA9IHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfTEFURU5DWV9TSU0pXG4gICAgcmV0dXJuIHN0ciA/IHBhcnNlSW50KHN0cikgOiBudWxsXG4gIH1cblxuICBnZXRTb2NrZXQoKXsgcmV0dXJuIHRoaXMuc29ja2V0IH1cblxuICBjb25uZWN0KCl7XG4gICAgLy8gZW5hYmxlIGRlYnVnIGJ5IGRlZmF1bHQgaWYgb24gbG9jYWxob3N0IGFuZCBub3QgZXhwbGljaXRseSBkaXNhYmxlZFxuICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCJsb2NhbGhvc3RcIiAmJiAhdGhpcy5pc0RlYnVnRGlzYWJsZWQoKSl7IHRoaXMuZW5hYmxlRGVidWcoKSB9XG4gICAgbGV0IGRvQ29ubmVjdCA9ICgpID0+IHtcbiAgICAgIHRoaXMucmVzZXRSZWxvYWRTdGF0dXMoKVxuICAgICAgaWYodGhpcy5qb2luUm9vdFZpZXdzKCkpe1xuICAgICAgICB0aGlzLmJpbmRUb3BMZXZlbEV2ZW50cygpXG4gICAgICAgIHRoaXMuc29ja2V0LmNvbm5lY3QoKVxuICAgICAgfSBlbHNlIGlmKHRoaXMubWFpbil7XG4gICAgICAgIHRoaXMuc29ja2V0LmNvbm5lY3QoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5iaW5kVG9wTGV2ZWxFdmVudHMoe2RlYWQ6IHRydWV9KVxuICAgICAgfVxuICAgICAgdGhpcy5qb2luRGVhZFZpZXcoKVxuICAgIH1cbiAgICBpZihbXCJjb21wbGV0ZVwiLCBcImxvYWRlZFwiLCBcImludGVyYWN0aXZlXCJdLmluZGV4T2YoZG9jdW1lbnQucmVhZHlTdGF0ZSkgPj0gMCl7XG4gICAgICBkb0Nvbm5lY3QoKVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiBkb0Nvbm5lY3QoKSlcbiAgICB9XG4gIH1cblxuICBkaXNjb25uZWN0KGNhbGxiYWNrKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWxvYWRXaXRoSml0dGVyVGltZXIpXG4gICAgLy8gcmVtb3ZlIHRoZSBzb2NrZXQgY2xvc2UgbGlzdGVuZXIgdG8gYXZvaWQgdHJ5aW5nIHRvIGhhbmRsZVxuICAgIC8vIGEgc2VydmVyIGNsb3NlIGV2ZW50IHdoZW4gaXQgaXMgYWN0dWFsbHkgY2F1c2VkIGJ5IHVzIGRpc2Nvbm5lY3RpbmdcbiAgICBpZih0aGlzLnNlcnZlckNsb3NlUmVmKXtcbiAgICAgIHRoaXMuc29ja2V0Lm9mZih0aGlzLnNlcnZlckNsb3NlUmVmKVxuICAgICAgdGhpcy5zZXJ2ZXJDbG9zZVJlZiA9IG51bGxcbiAgICB9XG4gICAgdGhpcy5zb2NrZXQuZGlzY29ubmVjdChjYWxsYmFjaylcbiAgfVxuXG4gIHJlcGxhY2VUcmFuc3BvcnQodHJhbnNwb3J0KXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWxvYWRXaXRoSml0dGVyVGltZXIpXG4gICAgdGhpcy5zb2NrZXQucmVwbGFjZVRyYW5zcG9ydCh0cmFuc3BvcnQpXG4gICAgdGhpcy5jb25uZWN0KClcbiAgfVxuXG4gIGV4ZWNKUyhlbCwgZW5jb2RlZEpTLCBldmVudFR5cGUgPSBudWxsKXtcbiAgICBsZXQgZSA9IG5ldyBDdXN0b21FdmVudChcInBoeDpleGVjXCIsIHtkZXRhaWw6IHtzb3VyY2VFbGVtZW50OiBlbH19KVxuICAgIHRoaXMub3duZXIoZWwsIHZpZXcgPT4gSlMuZXhlYyhlLCBldmVudFR5cGUsIGVuY29kZWRKUywgdmlldywgZWwpKVxuICB9XG5cbiAgLy8gcHJpdmF0ZVxuXG4gIGV4ZWNKU0hvb2tQdXNoKGVsLCBwaHhFdmVudCwgZGF0YSwgY2FsbGJhY2spe1xuICAgIHRoaXMud2l0aGluT3duZXJzKGVsLCB2aWV3ID0+IHtcbiAgICAgIGxldCBlID0gbmV3IEN1c3RvbUV2ZW50KFwicGh4OmV4ZWNcIiwge2RldGFpbDoge3NvdXJjZUVsZW1lbnQ6IGVsfX0pXG4gICAgICBKUy5leGVjKGUsIFwiaG9va1wiLCBwaHhFdmVudCwgdmlldywgZWwsIFtcInB1c2hcIiwge2RhdGEsIGNhbGxiYWNrfV0pXG4gICAgfSlcbiAgfVxuXG4gIHVubG9hZCgpe1xuICAgIGlmKHRoaXMudW5sb2FkZWQpeyByZXR1cm4gfVxuICAgIGlmKHRoaXMubWFpbiAmJiB0aGlzLmlzQ29ubmVjdGVkKCkpeyB0aGlzLmxvZyh0aGlzLm1haW4sIFwic29ja2V0XCIsICgpID0+IFtcImRpc2Nvbm5lY3QgZm9yIHBhZ2UgbmF2XCJdKSB9XG4gICAgdGhpcy51bmxvYWRlZCA9IHRydWVcbiAgICB0aGlzLmRlc3Ryb3lBbGxWaWV3cygpXG4gICAgdGhpcy5kaXNjb25uZWN0KClcbiAgfVxuXG4gIHRyaWdnZXJET00oa2luZCwgYXJncyl7IHRoaXMuZG9tQ2FsbGJhY2tzW2tpbmRdKC4uLmFyZ3MpIH1cblxuICB0aW1lKG5hbWUsIGZ1bmMpe1xuICAgIGlmKCF0aGlzLmlzUHJvZmlsZUVuYWJsZWQoKSB8fCAhY29uc29sZS50aW1lKXsgcmV0dXJuIGZ1bmMoKSB9XG4gICAgY29uc29sZS50aW1lKG5hbWUpXG4gICAgbGV0IHJlc3VsdCA9IGZ1bmMoKVxuICAgIGNvbnNvbGUudGltZUVuZChuYW1lKVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIGxvZyh2aWV3LCBraW5kLCBtc2dDYWxsYmFjayl7XG4gICAgaWYodGhpcy52aWV3TG9nZ2VyKXtcbiAgICAgIGxldCBbbXNnLCBvYmpdID0gbXNnQ2FsbGJhY2soKVxuICAgICAgdGhpcy52aWV3TG9nZ2VyKHZpZXcsIGtpbmQsIG1zZywgb2JqKVxuICAgIH0gZWxzZSBpZih0aGlzLmlzRGVidWdFbmFibGVkKCkpe1xuICAgICAgbGV0IFttc2csIG9ial0gPSBtc2dDYWxsYmFjaygpXG4gICAgICBkZWJ1Zyh2aWV3LCBraW5kLCBtc2csIG9iailcbiAgICB9XG4gIH1cblxuICByZXF1ZXN0RE9NVXBkYXRlKGNhbGxiYWNrKXtcbiAgICB0aGlzLnRyYW5zaXRpb25zLmFmdGVyKGNhbGxiYWNrKVxuICB9XG5cbiAgdHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUgPSBmdW5jdGlvbigpe30pe1xuICAgIHRoaXMudHJhbnNpdGlvbnMuYWRkVHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUpXG4gIH1cblxuICBvbkNoYW5uZWwoY2hhbm5lbCwgZXZlbnQsIGNiKXtcbiAgICBjaGFubmVsLm9uKGV2ZW50LCBkYXRhID0+IHtcbiAgICAgIGxldCBsYXRlbmN5ID0gdGhpcy5nZXRMYXRlbmN5U2ltKClcbiAgICAgIGlmKCFsYXRlbmN5KXtcbiAgICAgICAgY2IoZGF0YSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2IoZGF0YSksIGxhdGVuY3kpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJlbG9hZFdpdGhKaXR0ZXIodmlldywgbG9nKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWxvYWRXaXRoSml0dGVyVGltZXIpXG4gICAgdGhpcy5kaXNjb25uZWN0KClcbiAgICBsZXQgbWluTXMgPSB0aGlzLnJlbG9hZEppdHRlck1pblxuICAgIGxldCBtYXhNcyA9IHRoaXMucmVsb2FkSml0dGVyTWF4XG4gICAgbGV0IGFmdGVyTXMgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4TXMgLSBtaW5NcyArIDEpKSArIG1pbk1zXG4gICAgbGV0IHRyaWVzID0gQnJvd3Nlci51cGRhdGVMb2NhbCh0aGlzLmxvY2FsU3RvcmFnZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCBDT05TRUNVVElWRV9SRUxPQURTLCAwLCBjb3VudCA9PiBjb3VudCArIDEpXG4gICAgaWYodHJpZXMgPj0gdGhpcy5tYXhSZWxvYWRzKXtcbiAgICAgIGFmdGVyTXMgPSB0aGlzLmZhaWxzYWZlSml0dGVyXG4gICAgfVxuICAgIHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBpZiB2aWV3IGhhcyByZWNvdmVyZWQsIHN1Y2ggYXMgdHJhbnNwb3J0IHJlcGxhY2VkLCB0aGVuIGNhbmNlbFxuICAgICAgaWYodmlldy5pc0Rlc3Ryb3llZCgpIHx8IHZpZXcuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9XG4gICAgICB2aWV3LmRlc3Ryb3koKVxuICAgICAgbG9nID8gbG9nKCkgOiB0aGlzLmxvZyh2aWV3LCBcImpvaW5cIiwgKCkgPT4gW2BlbmNvdW50ZXJlZCAke3RyaWVzfSBjb25zZWN1dGl2ZSByZWxvYWRzYF0pXG4gICAgICBpZih0cmllcyA+PSB0aGlzLm1heFJlbG9hZHMpe1xuICAgICAgICB0aGlzLmxvZyh2aWV3LCBcImpvaW5cIiwgKCkgPT4gW2BleGNlZWRlZCAke3RoaXMubWF4UmVsb2Fkc30gY29uc2VjdXRpdmUgcmVsb2Fkcy4gRW50ZXJpbmcgZmFpbHNhZmUgbW9kZWBdKVxuICAgICAgfVxuICAgICAgaWYodGhpcy5oYXNQZW5kaW5nTGluaygpKXtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpcy5wZW5kaW5nTGlua1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICB9XG4gICAgfSwgYWZ0ZXJNcylcbiAgfVxuXG4gIGdldEhvb2tDYWxsYmFja3MobmFtZSl7XG4gICAgcmV0dXJuIG5hbWUgJiYgbmFtZS5zdGFydHNXaXRoKFwiUGhvZW5peC5cIikgPyBIb29rc1tuYW1lLnNwbGl0KFwiLlwiKVsxXV0gOiB0aGlzLmhvb2tzW25hbWVdXG4gIH1cblxuICBpc1VubG9hZGVkKCl7IHJldHVybiB0aGlzLnVubG9hZGVkIH1cblxuICBpc0Nvbm5lY3RlZCgpeyByZXR1cm4gdGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSB9XG5cbiAgZ2V0QmluZGluZ1ByZWZpeCgpeyByZXR1cm4gdGhpcy5iaW5kaW5nUHJlZml4IH1cblxuICBiaW5kaW5nKGtpbmQpeyByZXR1cm4gYCR7dGhpcy5nZXRCaW5kaW5nUHJlZml4KCl9JHtraW5kfWAgfVxuXG4gIGNoYW5uZWwodG9waWMsIHBhcmFtcyl7IHJldHVybiB0aGlzLnNvY2tldC5jaGFubmVsKHRvcGljLCBwYXJhbXMpIH1cblxuICBqb2luRGVhZFZpZXcoKXtcbiAgICBsZXQgYm9keSA9IGRvY3VtZW50LmJvZHlcbiAgICBpZihib2R5ICYmICF0aGlzLmlzUGh4Vmlldyhib2R5KSAmJiAhdGhpcy5pc1BoeFZpZXcoZG9jdW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQpKXtcbiAgICAgIGxldCB2aWV3ID0gdGhpcy5uZXdSb290Vmlldyhib2R5KVxuICAgICAgdmlldy5zZXRIcmVmKHRoaXMuZ2V0SHJlZigpKVxuICAgICAgdmlldy5qb2luRGVhZCgpXG4gICAgICBpZighdGhpcy5tYWluKXsgdGhpcy5tYWluID0gdmlldyB9XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgdmlldy5leGVjTmV3TW91bnRlZCgpXG4gICAgICAgIC8vIHJlc3RvcmUgc2Nyb2xsIHBvc2l0aW9uIHdoZW4gbmF2aWdhdGluZyBmcm9tIGFuIGV4dGVybmFsIC8gbm9uLWxpdmUgcGFnZVxuICAgICAgICB0aGlzLm1heWJlU2Nyb2xsKGhpc3Rvcnkuc3RhdGU/LnNjcm9sbClcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgam9pblJvb3RWaWV3cygpe1xuICAgIGxldCByb290c0ZvdW5kID0gZmFsc2VcbiAgICBET00uYWxsKGRvY3VtZW50LCBgJHtQSFhfVklFV19TRUxFQ1RPUn06bm90KFske1BIWF9QQVJFTlRfSUR9XSlgLCByb290RWwgPT4ge1xuICAgICAgaWYoIXRoaXMuZ2V0Um9vdEJ5SWQocm9vdEVsLmlkKSl7XG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5uZXdSb290Vmlldyhyb290RWwpXG4gICAgICAgIC8vIHN0aWNraWVzIGNhbm5vdCBiZSBtb3VudGVkIGF0IHRoZSByb3V0ZXIgYW5kIHRoZXJlZm9yZSBzaG91bGQgbm90XG4gICAgICAgIC8vIGdldCBhIGhyZWYgc2V0IG9uIHRoZW1cbiAgICAgICAgaWYoIURPTS5pc1BoeFN0aWNreShyb290RWwpKXsgdmlldy5zZXRIcmVmKHRoaXMuZ2V0SHJlZigpKSB9XG4gICAgICAgIHZpZXcuam9pbigpXG4gICAgICAgIGlmKHJvb3RFbC5oYXNBdHRyaWJ1dGUoUEhYX01BSU4pKXsgdGhpcy5tYWluID0gdmlldyB9XG4gICAgICB9XG4gICAgICByb290c0ZvdW5kID0gdHJ1ZVxuICAgIH0pXG4gICAgcmV0dXJuIHJvb3RzRm91bmRcbiAgfVxuXG4gIHJlZGlyZWN0KHRvLCBmbGFzaCwgcmVsb2FkVG9rZW4pe1xuICAgIGlmKHJlbG9hZFRva2VuKXsgQnJvd3Nlci5zZXRDb29raWUoUEhYX1JFTE9BRF9TVEFUVVMsIHJlbG9hZFRva2VuLCA2MCkgfVxuICAgIHRoaXMudW5sb2FkKClcbiAgICBCcm93c2VyLnJlZGlyZWN0KHRvLCBmbGFzaClcbiAgfVxuXG4gIHJlcGxhY2VNYWluKGhyZWYsIGZsYXNoLCBjYWxsYmFjayA9IG51bGwsIGxpbmtSZWYgPSB0aGlzLnNldFBlbmRpbmdMaW5rKGhyZWYpKXtcbiAgICBjb25zdCBsaXZlUmVmZXJlciA9IHRoaXMuY3VycmVudExvY2F0aW9uLmhyZWZcbiAgICB0aGlzLm91dGdvaW5nTWFpbkVsID0gdGhpcy5vdXRnb2luZ01haW5FbCB8fCB0aGlzLm1haW4uZWxcblxuICAgIGNvbnN0IHN0aWNraWVzID0gRE9NLmZpbmRQaHhTdGlja3koZG9jdW1lbnQpIHx8IFtdXG4gICAgY29uc3QgcmVtb3ZlRWxzID0gRE9NLmFsbCh0aGlzLm91dGdvaW5nTWFpbkVsLCBgWyR7dGhpcy5iaW5kaW5nKFwicmVtb3ZlXCIpfV1gKVxuICAgICAgLmZpbHRlcihlbCA9PiAhRE9NLmlzQ2hpbGRPZkFueShlbCwgc3RpY2tpZXMpKVxuXG4gICAgY29uc3QgbmV3TWFpbkVsID0gRE9NLmNsb25lTm9kZSh0aGlzLm91dGdvaW5nTWFpbkVsLCBcIlwiKVxuICAgIHRoaXMubWFpbi5zaG93TG9hZGVyKHRoaXMubG9hZGVyVGltZW91dClcbiAgICB0aGlzLm1haW4uZGVzdHJveSgpXG5cbiAgICB0aGlzLm1haW4gPSB0aGlzLm5ld1Jvb3RWaWV3KG5ld01haW5FbCwgZmxhc2gsIGxpdmVSZWZlcmVyKVxuICAgIHRoaXMubWFpbi5zZXRSZWRpcmVjdChocmVmKVxuICAgIHRoaXMudHJhbnNpdGlvblJlbW92ZXMocmVtb3ZlRWxzKVxuICAgIHRoaXMubWFpbi5qb2luKChqb2luQ291bnQsIG9uRG9uZSkgPT4ge1xuICAgICAgaWYoam9pbkNvdW50ID09PSAxICYmIHRoaXMuY29tbWl0UGVuZGluZ0xpbmsobGlua1JlZikpe1xuICAgICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgIC8vIHJlbW92ZSBwaHgtcmVtb3ZlIGVscyByaWdodCBiZWZvcmUgd2UgcmVwbGFjZSB0aGUgbWFpbiBlbGVtZW50XG4gICAgICAgICAgcmVtb3ZlRWxzLmZvckVhY2goZWwgPT4gZWwucmVtb3ZlKCkpXG4gICAgICAgICAgc3RpY2tpZXMuZm9yRWFjaChlbCA9PiBuZXdNYWluRWwuYXBwZW5kQ2hpbGQoZWwpKVxuICAgICAgICAgIHRoaXMub3V0Z29pbmdNYWluRWwucmVwbGFjZVdpdGgobmV3TWFpbkVsKVxuICAgICAgICAgIHRoaXMub3V0Z29pbmdNYWluRWwgPSBudWxsXG4gICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobGlua1JlZilcbiAgICAgICAgICBvbkRvbmUoKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB0cmFuc2l0aW9uUmVtb3ZlcyhlbGVtZW50cywgY2FsbGJhY2spe1xuICAgIGxldCByZW1vdmVBdHRyID0gdGhpcy5iaW5kaW5nKFwicmVtb3ZlXCIpXG4gICAgbGV0IHNpbGVuY2VFdmVudHMgPSAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpXG4gICAgfVxuICAgIGVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgLy8gcHJldmVudCBhbGwgbGlzdGVuZXJzIHdlIGNhcmUgYWJvdXQgZnJvbSBidWJibGluZyB0byB3aW5kb3dcbiAgICAgIC8vIHNpbmNlIHdlIGFyZSByZW1vdmluZyB0aGUgZWxlbWVudFxuICAgICAgZm9yKGxldCBldmVudCBvZiB0aGlzLmJvdW5kRXZlbnROYW1lcyl7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIHNpbGVuY2VFdmVudHMsIHRydWUpXG4gICAgICB9XG4gICAgICB0aGlzLmV4ZWNKUyhlbCwgZWwuZ2V0QXR0cmlidXRlKHJlbW92ZUF0dHIpLCBcInJlbW92ZVwiKVxuICAgIH0pXG4gICAgLy8gcmVtb3ZlIHRoZSBzaWxlbmNlZCBsaXN0ZW5lcnMgd2hlbiB0cmFuc2l0aW9ucyBhcmUgZG9uZSBpbmNhc2UgdGhlIGVsZW1lbnQgaXMgcmUtdXNlZFxuICAgIC8vIGFuZCBjYWxsIGNhbGxlcidzIGNhbGxiYWNrIGFzIHNvb24gYXMgd2UgYXJlIGRvbmUgd2l0aCB0cmFuc2l0aW9uc1xuICAgIHRoaXMucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICBlbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgZm9yKGxldCBldmVudCBvZiB0aGlzLmJvdW5kRXZlbnROYW1lcyl7XG4gICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgc2lsZW5jZUV2ZW50cywgdHJ1ZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9KVxuICB9XG5cbiAgaXNQaHhWaWV3KGVsKXsgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pICE9PSBudWxsIH1cblxuICBuZXdSb290VmlldyhlbCwgZmxhc2gsIGxpdmVSZWZlcmVyKXtcbiAgICBsZXQgdmlldyA9IG5ldyBWaWV3KGVsLCB0aGlzLCBudWxsLCBmbGFzaCwgbGl2ZVJlZmVyZXIpXG4gICAgdGhpcy5yb290c1t2aWV3LmlkXSA9IHZpZXdcbiAgICByZXR1cm4gdmlld1xuICB9XG5cbiAgb3duZXIoY2hpbGRFbCwgY2FsbGJhY2spe1xuICAgIGxldCB2aWV3XG4gICAgY29uc3QgY2xvc2VzdFZpZXdFbCA9IGNoaWxkRWwuY2xvc2VzdChQSFhfVklFV19TRUxFQ1RPUilcbiAgICBpZihjbG9zZXN0Vmlld0VsKXtcbiAgICAgIC8vIGl0IGNhbiBoYXBwZW4gdGhhdCB3ZSBmaW5kIGEgdmlldyB0aGF0IGlzIGFscmVhZHkgZGVzdHJveWVkO1xuICAgICAgLy8gaW4gdGhhdCBjYXNlIHdlIERPIE5PVCB3YW50IHRvIGZhbGxiYWNrIHRvIHRoZSBtYWluIGVsZW1lbnRcbiAgICAgIHZpZXcgPSB0aGlzLmdldFZpZXdCeUVsKGNsb3Nlc3RWaWV3RWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXcgPSB0aGlzLm1haW5cbiAgICB9XG4gICAgcmV0dXJuIHZpZXcgJiYgY2FsbGJhY2sgPyBjYWxsYmFjayh2aWV3KSA6IHZpZXdcbiAgfVxuXG4gIHdpdGhpbk93bmVycyhjaGlsZEVsLCBjYWxsYmFjayl7XG4gICAgdGhpcy5vd25lcihjaGlsZEVsLCB2aWV3ID0+IGNhbGxiYWNrKHZpZXcsIGNoaWxkRWwpKVxuICB9XG5cbiAgZ2V0Vmlld0J5RWwoZWwpe1xuICAgIGxldCByb290SWQgPSBlbC5nZXRBdHRyaWJ1dGUoUEhYX1JPT1RfSUQpXG4gICAgcmV0dXJuIG1heWJlKHRoaXMuZ2V0Um9vdEJ5SWQocm9vdElkKSwgcm9vdCA9PiByb290LmdldERlc2NlbmRlbnRCeUVsKGVsKSlcbiAgfVxuXG4gIGdldFJvb3RCeUlkKGlkKXsgcmV0dXJuIHRoaXMucm9vdHNbaWRdIH1cblxuICBkZXN0cm95QWxsVmlld3MoKXtcbiAgICBmb3IobGV0IGlkIGluIHRoaXMucm9vdHMpe1xuICAgICAgdGhpcy5yb290c1tpZF0uZGVzdHJveSgpXG4gICAgICBkZWxldGUgdGhpcy5yb290c1tpZF1cbiAgICB9XG4gICAgdGhpcy5tYWluID0gbnVsbFxuICB9XG5cbiAgZGVzdHJveVZpZXdCeUVsKGVsKXtcbiAgICBsZXQgcm9vdCA9IHRoaXMuZ2V0Um9vdEJ5SWQoZWwuZ2V0QXR0cmlidXRlKFBIWF9ST09UX0lEKSlcbiAgICBpZihyb290ICYmIHJvb3QuaWQgPT09IGVsLmlkKXtcbiAgICAgIHJvb3QuZGVzdHJveSgpXG4gICAgICBkZWxldGUgdGhpcy5yb290c1tyb290LmlkXVxuICAgIH0gZWxzZSBpZihyb290KXtcbiAgICAgIHJvb3QuZGVzdHJveURlc2NlbmRlbnQoZWwuaWQpXG4gICAgfVxuICB9XG5cbiAgZ2V0QWN0aXZlRWxlbWVudCgpe1xuICAgIHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gIH1cblxuICBkcm9wQWN0aXZlRWxlbWVudCh2aWV3KXtcbiAgICBpZih0aGlzLnByZXZBY3RpdmUgJiYgdmlldy5vd25zRWxlbWVudCh0aGlzLnByZXZBY3RpdmUpKXtcbiAgICAgIHRoaXMucHJldkFjdGl2ZSA9IG51bGxcbiAgICB9XG4gIH1cblxuICByZXN0b3JlUHJldmlvdXNseUFjdGl2ZUZvY3VzKCl7XG4gICAgaWYodGhpcy5wcmV2QWN0aXZlICYmIHRoaXMucHJldkFjdGl2ZSAhPT0gZG9jdW1lbnQuYm9keSl7XG4gICAgICB0aGlzLnByZXZBY3RpdmUuZm9jdXMoKVxuICAgIH1cbiAgfVxuXG4gIGJsdXJBY3RpdmVFbGVtZW50KCl7XG4gICAgdGhpcy5wcmV2QWN0aXZlID0gdGhpcy5nZXRBY3RpdmVFbGVtZW50KClcbiAgICBpZih0aGlzLnByZXZBY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpeyB0aGlzLnByZXZBY3RpdmUuYmx1cigpIH1cbiAgfVxuXG4gIGJpbmRUb3BMZXZlbEV2ZW50cyh7ZGVhZH0gPSB7fSl7XG4gICAgaWYodGhpcy5ib3VuZFRvcExldmVsRXZlbnRzKXsgcmV0dXJuIH1cblxuICAgIHRoaXMuYm91bmRUb3BMZXZlbEV2ZW50cyA9IHRydWVcbiAgICAvLyBlbnRlciBmYWlsc2FmZSByZWxvYWQgaWYgc2VydmVyIGhhcyBnb25lIGF3YXkgaW50ZW50aW9uYWxseSwgc3VjaCBhcyBcImRpc2Nvbm5lY3RcIiBicm9hZGNhc3RcbiAgICB0aGlzLnNlcnZlckNsb3NlUmVmID0gdGhpcy5zb2NrZXQub25DbG9zZShldmVudCA9PiB7XG4gICAgICAvLyBmYWlsc2FmZSByZWxvYWQgaWYgbm9ybWFsIGNsb3N1cmUgYW5kIHdlIHN0aWxsIGhhdmUgYSBtYWluIExWXG4gICAgICBpZihldmVudCAmJiBldmVudC5jb2RlID09PSAxMDAwICYmIHRoaXMubWFpbil7IHJldHVybiB0aGlzLnJlbG9hZFdpdGhKaXR0ZXIodGhpcy5tYWluKSB9XG4gICAgfSlcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKXsgfSkgLy8gZW5zdXJlIGFsbCBjbGljayBldmVudHMgYnViYmxlIGZvciBtb2JpbGUgU2FmYXJpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlc2hvd1wiLCBlID0+IHtcbiAgICAgIGlmKGUucGVyc2lzdGVkKXsgLy8gcmVsb2FkIHBhZ2UgaWYgYmVpbmcgcmVzdG9yZWQgZnJvbSBiYWNrL2ZvcndhcmQgY2FjaGVcbiAgICAgICAgdGhpcy5nZXRTb2NrZXQoKS5kaXNjb25uZWN0KClcbiAgICAgICAgdGhpcy53aXRoUGFnZUxvYWRpbmcoe3RvOiB3aW5kb3cubG9jYXRpb24uaHJlZiwga2luZDogXCJyZWRpcmVjdFwifSlcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICB9XG4gICAgfSwgdHJ1ZSlcbiAgICBpZighZGVhZCl7IHRoaXMuYmluZE5hdigpIH1cbiAgICB0aGlzLmJpbmRDbGlja3MoKVxuICAgIGlmKCFkZWFkKXsgdGhpcy5iaW5kRm9ybXMoKSB9XG4gICAgdGhpcy5iaW5kKHtrZXl1cDogXCJrZXl1cFwiLCBrZXlkb3duOiBcImtleWRvd25cIn0sIChlLCB0eXBlLCB2aWV3LCB0YXJnZXRFbCwgcGh4RXZlbnQsIF9waHhUYXJnZXQpID0+IHtcbiAgICAgIGxldCBtYXRjaEtleSA9IHRhcmdldEVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0tFWSkpXG4gICAgICBsZXQgcHJlc3NlZEtleSA9IGUua2V5ICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgLy8gY2hyb21lIGNsaWNrZWQgYXV0b2NvbXBsZXRlcyBzZW5kIGEga2V5ZG93biB3aXRob3V0IGtleVxuICAgICAgaWYobWF0Y2hLZXkgJiYgbWF0Y2hLZXkudG9Mb3dlckNhc2UoKSAhPT0gcHJlc3NlZEtleSl7IHJldHVybiB9XG5cbiAgICAgIGxldCBkYXRhID0ge2tleTogZS5rZXksIC4uLnRoaXMuZXZlbnRNZXRhKHR5cGUsIGUsIHRhcmdldEVsKX1cbiAgICAgIEpTLmV4ZWMoZSwgdHlwZSwgcGh4RXZlbnQsIHZpZXcsIHRhcmdldEVsLCBbXCJwdXNoXCIsIHtkYXRhfV0pXG4gICAgfSlcbiAgICB0aGlzLmJpbmQoe2JsdXI6IFwiZm9jdXNvdXRcIiwgZm9jdXM6IFwiZm9jdXNpblwifSwgKGUsIHR5cGUsIHZpZXcsIHRhcmdldEVsLCBwaHhFdmVudCwgcGh4VGFyZ2V0KSA9PiB7XG4gICAgICBpZighcGh4VGFyZ2V0KXtcbiAgICAgICAgbGV0IGRhdGEgPSB7a2V5OiBlLmtleSwgLi4udGhpcy5ldmVudE1ldGEodHlwZSwgZSwgdGFyZ2V0RWwpfVxuICAgICAgICBKUy5leGVjKGUsIHR5cGUsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXRFbCwgW1wicHVzaFwiLCB7ZGF0YX1dKVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5iaW5kKHtibHVyOiBcImJsdXJcIiwgZm9jdXM6IFwiZm9jdXNcIn0sIChlLCB0eXBlLCB2aWV3LCB0YXJnZXRFbCwgcGh4RXZlbnQsIHBoeFRhcmdldCkgPT4ge1xuICAgICAgLy8gYmx1ciBhbmQgZm9jdXMgYXJlIHRyaWdnZXJlZCBvbiBkb2N1bWVudCBhbmQgd2luZG93LiBEaXNjYXJkIG9uZSB0byBhdm9pZCBkdXBzXG4gICAgICBpZihwaHhUYXJnZXQgPT09IFwid2luZG93XCIpe1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZXZlbnRNZXRhKHR5cGUsIGUsIHRhcmdldEVsKVxuICAgICAgICBKUy5leGVjKGUsIHR5cGUsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXRFbCwgW1wicHVzaFwiLCB7ZGF0YX1dKVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5vbihcImRyYWdvdmVyXCIsIGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpKVxuICAgIHRoaXMub24oXCJkcm9wXCIsIGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBsZXQgZHJvcFRhcmdldElkID0gbWF5YmUoY2xvc2VzdFBoeEJpbmRpbmcoZS50YXJnZXQsIHRoaXMuYmluZGluZyhQSFhfRFJPUF9UQVJHRVQpKSwgdHJ1ZVRhcmdldCA9PiB7XG4gICAgICAgIHJldHVybiB0cnVlVGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0RST1BfVEFSR0VUKSlcbiAgICAgIH0pXG4gICAgICBsZXQgZHJvcFRhcmdldCA9IGRyb3BUYXJnZXRJZCAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkcm9wVGFyZ2V0SWQpXG4gICAgICBsZXQgZmlsZXMgPSBBcnJheS5mcm9tKGUuZGF0YVRyYW5zZmVyLmZpbGVzIHx8IFtdKVxuICAgICAgaWYoIWRyb3BUYXJnZXQgfHwgZHJvcFRhcmdldC5kaXNhYmxlZCB8fCBmaWxlcy5sZW5ndGggPT09IDAgfHwgIShkcm9wVGFyZ2V0LmZpbGVzIGluc3RhbmNlb2YgRmlsZUxpc3QpKXsgcmV0dXJuIH1cblxuICAgICAgTGl2ZVVwbG9hZGVyLnRyYWNrRmlsZXMoZHJvcFRhcmdldCwgZmlsZXMsIGUuZGF0YVRyYW5zZmVyKVxuICAgICAgZHJvcFRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIsIHtidWJibGVzOiB0cnVlfSkpXG4gICAgfSlcbiAgICB0aGlzLm9uKFBIWF9UUkFDS19VUExPQURTLCBlID0+IHtcbiAgICAgIGxldCB1cGxvYWRUYXJnZXQgPSBlLnRhcmdldFxuICAgICAgaWYoIURPTS5pc1VwbG9hZElucHV0KHVwbG9hZFRhcmdldCkpeyByZXR1cm4gfVxuICAgICAgbGV0IGZpbGVzID0gQXJyYXkuZnJvbShlLmRldGFpbC5maWxlcyB8fCBbXSkuZmlsdGVyKGYgPT4gZiBpbnN0YW5jZW9mIEZpbGUgfHwgZiBpbnN0YW5jZW9mIEJsb2IpXG4gICAgICBMaXZlVXBsb2FkZXIudHJhY2tGaWxlcyh1cGxvYWRUYXJnZXQsIGZpbGVzKVxuICAgICAgdXBsb2FkVGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiaW5wdXRcIiwge2J1YmJsZXM6IHRydWV9KSlcbiAgICB9KVxuICB9XG5cbiAgZXZlbnRNZXRhKGV2ZW50TmFtZSwgZSwgdGFyZ2V0RWwpe1xuICAgIGxldCBjYWxsYmFjayA9IHRoaXMubWV0YWRhdGFDYWxsYmFja3NbZXZlbnROYW1lXVxuICAgIHJldHVybiBjYWxsYmFjayA/IGNhbGxiYWNrKGUsIHRhcmdldEVsKSA6IHt9XG4gIH1cblxuICBzZXRQZW5kaW5nTGluayhocmVmKXtcbiAgICB0aGlzLmxpbmtSZWYrK1xuICAgIHRoaXMucGVuZGluZ0xpbmsgPSBocmVmXG4gICAgdGhpcy5yZXNldFJlbG9hZFN0YXR1cygpXG4gICAgcmV0dXJuIHRoaXMubGlua1JlZlxuICB9XG5cbiAgLy8gYW55dGltZSB3ZSBhcmUgbmF2aWdhdGluZyBvciBjb25uZWN0aW5nLCBkcm9wIHJlbG9hZCBjb29raWUgaW4gY2FzZVxuICAvLyB3ZSBpc3N1ZSB0aGUgY29va2llIGJ1dCB0aGUgbmV4dCByZXF1ZXN0IHdhcyBpbnRlcnJ1cHRlZCBhbmQgdGhlIHNlcnZlciBuZXZlciBkcm9wcGVkIGl0XG4gIHJlc2V0UmVsb2FkU3RhdHVzKCl7IEJyb3dzZXIuZGVsZXRlQ29va2llKFBIWF9SRUxPQURfU1RBVFVTKSB9XG5cbiAgY29tbWl0UGVuZGluZ0xpbmsobGlua1JlZil7XG4gICAgaWYodGhpcy5saW5rUmVmICE9PSBsaW5rUmVmKXtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhyZWYgPSB0aGlzLnBlbmRpbmdMaW5rXG4gICAgICB0aGlzLnBlbmRpbmdMaW5rID0gbnVsbFxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBnZXRIcmVmKCl7IHJldHVybiB0aGlzLmhyZWYgfVxuXG4gIGhhc1BlbmRpbmdMaW5rKCl7IHJldHVybiAhIXRoaXMucGVuZGluZ0xpbmsgfVxuXG4gIGJpbmQoZXZlbnRzLCBjYWxsYmFjayl7XG4gICAgZm9yKGxldCBldmVudCBpbiBldmVudHMpe1xuICAgICAgbGV0IGJyb3dzZXJFdmVudE5hbWUgPSBldmVudHNbZXZlbnRdXG5cbiAgICAgIHRoaXMub24oYnJvd3NlckV2ZW50TmFtZSwgZSA9PiB7XG4gICAgICAgIGxldCBiaW5kaW5nID0gdGhpcy5iaW5kaW5nKGV2ZW50KVxuICAgICAgICBsZXQgd2luZG93QmluZGluZyA9IHRoaXMuYmluZGluZyhgd2luZG93LSR7ZXZlbnR9YClcbiAgICAgICAgbGV0IHRhcmdldFBoeEV2ZW50ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlICYmIGUudGFyZ2V0LmdldEF0dHJpYnV0ZShiaW5kaW5nKVxuICAgICAgICBpZih0YXJnZXRQaHhFdmVudCl7XG4gICAgICAgICAgdGhpcy5kZWJvdW5jZShlLnRhcmdldCwgZSwgYnJvd3NlckV2ZW50TmFtZSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZS50YXJnZXQsIHZpZXcgPT4ge1xuICAgICAgICAgICAgICBjYWxsYmFjayhlLCBldmVudCwgdmlldywgZS50YXJnZXQsIHRhcmdldFBoeEV2ZW50LCBudWxsKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHt3aW5kb3dCaW5kaW5nfV1gLCBlbCA9PiB7XG4gICAgICAgICAgICBsZXQgcGh4RXZlbnQgPSBlbC5nZXRBdHRyaWJ1dGUod2luZG93QmluZGluZylcbiAgICAgICAgICAgIHRoaXMuZGVib3VuY2UoZWwsIGUsIGJyb3dzZXJFdmVudE5hbWUsICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZWwsIHZpZXcgPT4ge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGUsIGV2ZW50LCB2aWV3LCBlbCwgcGh4RXZlbnQsIFwid2luZG93XCIpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgYmluZENsaWNrcygpe1xuICAgIHRoaXMub24oXCJtb3VzZWRvd25cIiwgZSA9PiB0aGlzLmNsaWNrU3RhcnRlZEF0VGFyZ2V0ID0gZS50YXJnZXQpXG4gICAgdGhpcy5iaW5kQ2xpY2soXCJjbGlja1wiLCBcImNsaWNrXCIpXG4gIH1cblxuICBiaW5kQ2xpY2soZXZlbnROYW1lLCBiaW5kaW5nTmFtZSl7XG4gICAgbGV0IGNsaWNrID0gdGhpcy5iaW5kaW5nKGJpbmRpbmdOYW1lKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZSA9PiB7XG4gICAgICBsZXQgdGFyZ2V0ID0gbnVsbFxuICAgICAgLy8gYSBzeW50aGV0aWMgY2xpY2sgZXZlbnQgKGRldGFpbCAwKSB3aWxsIG5vdCBoYXZlIGNhdXNlZCBhIG1vdXNlZG93biBldmVudCxcbiAgICAgIC8vIHRoZXJlZm9yZSB0aGUgY2xpY2tTdGFydGVkQXRUYXJnZXQgaXMgc3RhbGVcbiAgICAgIGlmKGUuZGV0YWlsID09PSAwKSB0aGlzLmNsaWNrU3RhcnRlZEF0VGFyZ2V0ID0gZS50YXJnZXRcbiAgICAgIGxldCBjbGlja1N0YXJ0ZWRBdFRhcmdldCA9IHRoaXMuY2xpY2tTdGFydGVkQXRUYXJnZXQgfHwgZS50YXJnZXRcbiAgICAgIC8vIHdoZW4gc2VhcmNoaW5nIHRoZSB0YXJnZXQgZm9yIHRoZSBjbGljayBldmVudCwgd2UgYWx3YXlzIHdhbnQgdG9cbiAgICAgIC8vIHVzZSB0aGUgYWN0dWFsIGV2ZW50IHRhcmdldCwgc2VlICMzMzcyXG4gICAgICB0YXJnZXQgPSBjbG9zZXN0UGh4QmluZGluZyhlLnRhcmdldCwgY2xpY2spXG4gICAgICB0aGlzLmRpc3BhdGNoQ2xpY2tBd2F5KGUsIGNsaWNrU3RhcnRlZEF0VGFyZ2V0KVxuICAgICAgdGhpcy5jbGlja1N0YXJ0ZWRBdFRhcmdldCA9IG51bGxcbiAgICAgIGxldCBwaHhFdmVudCA9IHRhcmdldCAmJiB0YXJnZXQuZ2V0QXR0cmlidXRlKGNsaWNrKVxuICAgICAgaWYoIXBoeEV2ZW50KXtcbiAgICAgICAgaWYoRE9NLmlzTmV3UGFnZUNsaWNrKGUsIHdpbmRvdy5sb2NhdGlvbikpeyB0aGlzLnVubG9hZCgpIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpID09PSBcIiNcIil7IGUucHJldmVudERlZmF1bHQoKSB9XG5cbiAgICAgIC8vIG5vb3AgaWYgd2UgYXJlIGluIHRoZSBtaWRkbGUgb2YgYXdhaXRpbmcgYW4gYWNrIGZvciB0aGlzIGVsIGFscmVhZHlcbiAgICAgIGlmKHRhcmdldC5oYXNBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpKXsgcmV0dXJuIH1cblxuICAgICAgdGhpcy5kZWJvdW5jZSh0YXJnZXQsIGUsIFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLndpdGhpbk93bmVycyh0YXJnZXQsIHZpZXcgPT4ge1xuICAgICAgICAgIEpTLmV4ZWMoZSwgXCJjbGlja1wiLCBwaHhFdmVudCwgdmlldywgdGFyZ2V0LCBbXCJwdXNoXCIsIHtkYXRhOiB0aGlzLmV2ZW50TWV0YShcImNsaWNrXCIsIGUsIHRhcmdldCl9XSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSwgZmFsc2UpXG4gIH1cblxuICBkaXNwYXRjaENsaWNrQXdheShlLCBjbGlja1N0YXJ0ZWRBdCl7XG4gICAgbGV0IHBoeENsaWNrQXdheSA9IHRoaXMuYmluZGluZyhcImNsaWNrLWF3YXlcIilcbiAgICBET00uYWxsKGRvY3VtZW50LCBgWyR7cGh4Q2xpY2tBd2F5fV1gLCBlbCA9PiB7XG4gICAgICBpZighKGVsLmlzU2FtZU5vZGUoY2xpY2tTdGFydGVkQXQpIHx8IGVsLmNvbnRhaW5zKGNsaWNrU3RhcnRlZEF0KSkpe1xuICAgICAgICB0aGlzLndpdGhpbk93bmVycyhlbCwgdmlldyA9PiB7XG4gICAgICAgICAgbGV0IHBoeEV2ZW50ID0gZWwuZ2V0QXR0cmlidXRlKHBoeENsaWNrQXdheSlcbiAgICAgICAgICBpZihKUy5pc1Zpc2libGUoZWwpICYmIEpTLmlzSW5WaWV3cG9ydChlbCkpe1xuICAgICAgICAgICAgSlMuZXhlYyhlLCBcImNsaWNrXCIsIHBoeEV2ZW50LCB2aWV3LCBlbCwgW1wicHVzaFwiLCB7ZGF0YTogdGhpcy5ldmVudE1ldGEoXCJjbGlja1wiLCBlLCBlLnRhcmdldCl9XSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGJpbmROYXYoKXtcbiAgICBpZighQnJvd3Nlci5jYW5QdXNoU3RhdGUoKSl7IHJldHVybiB9XG4gICAgaWYoaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbil7IGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSBcIm1hbnVhbFwiIH1cbiAgICBsZXQgc2Nyb2xsVGltZXIgPSBudWxsXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgX2UgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHNjcm9sbFRpbWVyKVxuICAgICAgc2Nyb2xsVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgQnJvd3Nlci51cGRhdGVDdXJyZW50U3RhdGUoc3RhdGUgPT4gT2JqZWN0LmFzc2lnbihzdGF0ZSwge3Njcm9sbDogd2luZG93LnNjcm9sbFl9KSlcbiAgICAgIH0sIDEwMClcbiAgICB9KVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgZXZlbnQgPT4ge1xuICAgICAgaWYoIXRoaXMucmVnaXN0ZXJOZXdMb2NhdGlvbih3aW5kb3cubG9jYXRpb24pKXsgcmV0dXJuIH1cbiAgICAgIGxldCB7dHlwZSwgYmFja1R5cGUsIGlkLCBzY3JvbGwsIHBvc2l0aW9ufSA9IGV2ZW50LnN0YXRlIHx8IHt9XG4gICAgICBsZXQgaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG5cbiAgICAgIC8vIENvbXBhcmUgcG9zaXRpb25zIHRvIGRldGVybWluZSBkaXJlY3Rpb25cbiAgICAgIGxldCBpc0ZvcndhcmQgPSBwb3NpdGlvbiA+IHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvblxuXG4gICAgICB0eXBlID0gaXNGb3J3YXJkID8gdHlwZSA6IChiYWNrVHlwZSB8fCB0eXBlKVxuXG4gICAgICAvLyBVcGRhdGUgY3VycmVudCBwb3NpdGlvblxuICAgICAgdGhpcy5jdXJyZW50SGlzdG9yeVBvc2l0aW9uID0gcG9zaXRpb24gfHwgMFxuICAgICAgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9ISVNUT1JZX1BPU0lUSU9OLCB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb24udG9TdHJpbmcoKSlcblxuICAgICAgRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBcInBoeDpuYXZpZ2F0ZVwiLCB7ZGV0YWlsOiB7aHJlZiwgcGF0Y2g6IHR5cGUgPT09IFwicGF0Y2hcIiwgcG9wOiB0cnVlLCBkaXJlY3Rpb246IGlzRm9yd2FyZCA/IFwiZm9yd2FyZFwiIDogXCJiYWNrd2FyZFwifX0pXG4gICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9ICgpID0+IHsgdGhpcy5tYXliZVNjcm9sbChzY3JvbGwpIH1cbiAgICAgICAgaWYodGhpcy5tYWluLmlzQ29ubmVjdGVkKCkgJiYgKHR5cGUgPT09IFwicGF0Y2hcIiAmJiBpZCA9PT0gdGhpcy5tYWluLmlkKSl7XG4gICAgICAgICAgdGhpcy5tYWluLnB1c2hMaW5rUGF0Y2goZXZlbnQsIGhyZWYsIG51bGwsIGNhbGxiYWNrKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmVwbGFjZU1haW4oaHJlZiwgbnVsbCwgY2FsbGJhY2spXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSwgZmFsc2UpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgIGxldCB0YXJnZXQgPSBjbG9zZXN0UGh4QmluZGluZyhlLnRhcmdldCwgUEhYX0xJVkVfTElOSylcbiAgICAgIGxldCB0eXBlID0gdGFyZ2V0ICYmIHRhcmdldC5nZXRBdHRyaWJ1dGUoUEhYX0xJVkVfTElOSylcbiAgICAgIGlmKCF0eXBlIHx8ICF0aGlzLmlzQ29ubmVjdGVkKCkgfHwgIXRoaXMubWFpbiB8fCBET00ud2FudHNOZXdUYWIoZSkpeyByZXR1cm4gfVxuXG4gICAgICAvLyBXaGVuIHdyYXBwaW5nIGFuIFNWRyBlbGVtZW50IGluIGFuIGFuY2hvciB0YWcsIHRoZSBocmVmIGNhbiBiZSBhbiBTVkdBbmltYXRlZFN0cmluZ1xuICAgICAgbGV0IGhyZWYgPSB0YXJnZXQuaHJlZiBpbnN0YW5jZW9mIFNWR0FuaW1hdGVkU3RyaW5nID8gdGFyZ2V0LmhyZWYuYmFzZVZhbCA6IHRhcmdldC5ocmVmXG5cbiAgICAgIGxldCBsaW5rU3RhdGUgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKFBIWF9MSU5LX1NUQVRFKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpIC8vIGRvIG5vdCBidWJibGUgY2xpY2sgdG8gcmVndWxhciBwaHgtY2xpY2sgYmluZGluZ3NcbiAgICAgIGlmKHRoaXMucGVuZGluZ0xpbmsgPT09IGhyZWYpeyByZXR1cm4gfVxuXG4gICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICBpZih0eXBlID09PSBcInBhdGNoXCIpe1xuICAgICAgICAgIHRoaXMucHVzaEhpc3RvcnlQYXRjaChlLCBocmVmLCBsaW5rU3RhdGUsIHRhcmdldClcbiAgICAgICAgfSBlbHNlIGlmKHR5cGUgPT09IFwicmVkaXJlY3RcIil7XG4gICAgICAgICAgdGhpcy5oaXN0b3J5UmVkaXJlY3QoZSwgaHJlZiwgbGlua1N0YXRlLCBudWxsLCB0YXJnZXQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBleHBlY3RlZCAke1BIWF9MSVZFX0xJTkt9IHRvIGJlIFwicGF0Y2hcIiBvciBcInJlZGlyZWN0XCIsIGdvdDogJHt0eXBlfWApXG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBoeENsaWNrID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJjbGlja1wiKSlcbiAgICAgICAgaWYocGh4Q2xpY2spe1xuICAgICAgICAgIHRoaXMucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB0aGlzLmV4ZWNKUyh0YXJnZXQsIHBoeENsaWNrLCBcImNsaWNrXCIpKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sIGZhbHNlKVxuICB9XG5cbiAgbWF5YmVTY3JvbGwoc2Nyb2xsKXtcbiAgICBpZih0eXBlb2Yoc2Nyb2xsKSA9PT0gXCJudW1iZXJcIil7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc2Nyb2xsKVxuICAgICAgfSkgLy8gdGhlIGJvZHkgbmVlZHMgdG8gcmVuZGVyIGJlZm9yZSB3ZSBzY3JvbGwuXG4gICAgfVxuICB9XG5cbiAgZGlzcGF0Y2hFdmVudChldmVudCwgcGF5bG9hZCA9IHt9KXtcbiAgICBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIGBwaHg6JHtldmVudH1gLCB7ZGV0YWlsOiBwYXlsb2FkfSlcbiAgfVxuXG4gIGRpc3BhdGNoRXZlbnRzKGV2ZW50cyl7XG4gICAgZXZlbnRzLmZvckVhY2goKFtldmVudCwgcGF5bG9hZF0pID0+IHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCwgcGF5bG9hZCkpXG4gIH1cblxuICB3aXRoUGFnZUxvYWRpbmcoaW5mbywgY2FsbGJhY2spe1xuICAgIERPTS5kaXNwYXRjaEV2ZW50KHdpbmRvdywgXCJwaHg6cGFnZS1sb2FkaW5nLXN0YXJ0XCIsIHtkZXRhaWw6IGluZm99KVxuICAgIGxldCBkb25lID0gKCkgPT4gRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBcInBoeDpwYWdlLWxvYWRpbmctc3RvcFwiLCB7ZGV0YWlsOiBpbmZvfSlcbiAgICByZXR1cm4gY2FsbGJhY2sgPyBjYWxsYmFjayhkb25lKSA6IGRvbmVcbiAgfVxuXG4gIHB1c2hIaXN0b3J5UGF0Y2goZSwgaHJlZiwgbGlua1N0YXRlLCB0YXJnZXRFbCl7XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSB8fCAhdGhpcy5tYWluLmlzTWFpbigpKXsgcmV0dXJuIEJyb3dzZXIucmVkaXJlY3QoaHJlZikgfVxuXG4gICAgdGhpcy53aXRoUGFnZUxvYWRpbmcoe3RvOiBocmVmLCBraW5kOiBcInBhdGNoXCJ9LCBkb25lID0+IHtcbiAgICAgIHRoaXMubWFpbi5wdXNoTGlua1BhdGNoKGUsIGhyZWYsIHRhcmdldEVsLCBsaW5rUmVmID0+IHtcbiAgICAgICAgdGhpcy5oaXN0b3J5UGF0Y2goaHJlZiwgbGlua1N0YXRlLCBsaW5rUmVmKVxuICAgICAgICBkb25lKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGhpc3RvcnlQYXRjaChocmVmLCBsaW5rU3RhdGUsIGxpbmtSZWYgPSB0aGlzLnNldFBlbmRpbmdMaW5rKGhyZWYpKXtcbiAgICBpZighdGhpcy5jb21taXRQZW5kaW5nTGluayhsaW5rUmVmKSl7IHJldHVybiB9XG5cbiAgICAvLyBJbmNyZW1lbnQgcG9zaXRpb24gZm9yIG5ldyBzdGF0ZVxuICAgIHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvbisrXG4gICAgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9ISVNUT1JZX1BPU0lUSU9OLCB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb24udG9TdHJpbmcoKSlcblxuICAgIC8vIHN0b3JlIHRoZSB0eXBlIGZvciBiYWNrIG5hdmlnYXRpb25cbiAgICBCcm93c2VyLnVwZGF0ZUN1cnJlbnRTdGF0ZSgoc3RhdGUpID0+ICh7Li4uc3RhdGUsIGJhY2tUeXBlOiBcInBhdGNoXCJ9KSlcblxuICAgIEJyb3dzZXIucHVzaFN0YXRlKGxpbmtTdGF0ZSwge1xuICAgICAgdHlwZTogXCJwYXRjaFwiLFxuICAgICAgaWQ6IHRoaXMubWFpbi5pZCxcbiAgICAgIHBvc2l0aW9uOiB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb25cbiAgICB9LCBocmVmKVxuXG4gICAgRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBcInBoeDpuYXZpZ2F0ZVwiLCB7ZGV0YWlsOiB7cGF0Y2g6IHRydWUsIGhyZWYsIHBvcDogZmFsc2UsIGRpcmVjdGlvbjogXCJmb3J3YXJkXCJ9fSlcbiAgICB0aGlzLnJlZ2lzdGVyTmV3TG9jYXRpb24od2luZG93LmxvY2F0aW9uKVxuICB9XG5cbiAgaGlzdG9yeVJlZGlyZWN0KGUsIGhyZWYsIGxpbmtTdGF0ZSwgZmxhc2gsIHRhcmdldEVsKXtcbiAgICBjb25zdCBjbGlja0xvYWRpbmcgPSB0YXJnZXRFbCAmJiBlLmlzVHJ1c3RlZCAmJiBlLnR5cGUgIT09IFwicG9wc3RhdGVcIlxuICAgIGlmKGNsaWNrTG9hZGluZyl7IHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoXCJwaHgtY2xpY2stbG9hZGluZ1wiKSB9XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSB8fCAhdGhpcy5tYWluLmlzTWFpbigpKXsgcmV0dXJuIEJyb3dzZXIucmVkaXJlY3QoaHJlZiwgZmxhc2gpIH1cblxuICAgIC8vIGNvbnZlcnQgdG8gZnVsbCBocmVmIGlmIG9ubHkgcGF0aCBwcmVmaXhcbiAgICBpZigvXlxcLyR8XlxcL1teXFwvXSsuKiQvLnRlc3QoaHJlZikpe1xuICAgICAgbGV0IHtwcm90b2NvbCwgaG9zdH0gPSB3aW5kb3cubG9jYXRpb25cbiAgICAgIGhyZWYgPSBgJHtwcm90b2NvbH0vLyR7aG9zdH0ke2hyZWZ9YFxuICAgIH1cbiAgICBsZXQgc2Nyb2xsID0gd2luZG93LnNjcm9sbFlcbiAgICB0aGlzLndpdGhQYWdlTG9hZGluZyh7dG86IGhyZWYsIGtpbmQ6IFwicmVkaXJlY3RcIn0sIGRvbmUgPT4ge1xuICAgICAgdGhpcy5yZXBsYWNlTWFpbihocmVmLCBmbGFzaCwgKGxpbmtSZWYpID0+IHtcbiAgICAgICAgaWYobGlua1JlZiA9PT0gdGhpcy5saW5rUmVmKXtcbiAgICAgICAgICAvLyBJbmNyZW1lbnQgcG9zaXRpb24gZm9yIG5ldyBzdGF0ZVxuICAgICAgICAgIHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvbisrXG4gICAgICAgICAgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9ISVNUT1JZX1BPU0lUSU9OLCB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb24udG9TdHJpbmcoKSlcblxuICAgICAgICAgIC8vIHN0b3JlIHRoZSB0eXBlIGZvciBiYWNrIG5hdmlnYXRpb25cbiAgICAgICAgICBCcm93c2VyLnVwZGF0ZUN1cnJlbnRTdGF0ZSgoc3RhdGUpID0+ICh7Li4uc3RhdGUsIGJhY2tUeXBlOiBcInJlZGlyZWN0XCJ9KSlcblxuICAgICAgICAgIEJyb3dzZXIucHVzaFN0YXRlKGxpbmtTdGF0ZSwge1xuICAgICAgICAgICAgdHlwZTogXCJyZWRpcmVjdFwiLFxuICAgICAgICAgICAgaWQ6IHRoaXMubWFpbi5pZCxcbiAgICAgICAgICAgIHNjcm9sbDogc2Nyb2xsLFxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvblxuICAgICAgICAgIH0sIGhyZWYpXG5cbiAgICAgICAgICBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4Om5hdmlnYXRlXCIsIHtkZXRhaWw6IHtocmVmLCBwYXRjaDogZmFsc2UsIHBvcDogZmFsc2UsIGRpcmVjdGlvbjogXCJmb3J3YXJkXCJ9fSlcbiAgICAgICAgICB0aGlzLnJlZ2lzdGVyTmV3TG9jYXRpb24od2luZG93LmxvY2F0aW9uKVxuICAgICAgICB9XG4gICAgICAgIC8vIGV4cGxpY2l0bHkgdW5kbyBjbGljay1sb2FkaW5nIGNsYXNzXG4gICAgICAgIC8vIChpbiBjYXNlIGl0IG9yaWdpbmF0ZWQgaW4gYSBzdGlja3kgbGl2ZSB2aWV3LCBvdGhlcndpc2UgaXQgd291bGQgYmUgcmVtb3ZlZCBhbnl3YXkpXG4gICAgICAgIGlmKGNsaWNrTG9hZGluZyl7IHRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoXCJwaHgtY2xpY2stbG9hZGluZ1wiKSB9XG4gICAgICAgIGRvbmUoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgcmVnaXN0ZXJOZXdMb2NhdGlvbihuZXdMb2NhdGlvbil7XG4gICAgbGV0IHtwYXRobmFtZSwgc2VhcmNofSA9IHRoaXMuY3VycmVudExvY2F0aW9uXG4gICAgaWYocGF0aG5hbWUgKyBzZWFyY2ggPT09IG5ld0xvY2F0aW9uLnBhdGhuYW1lICsgbmV3TG9jYXRpb24uc2VhcmNoKXtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRMb2NhdGlvbiA9IGNsb25lKG5ld0xvY2F0aW9uKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBiaW5kRm9ybXMoKXtcbiAgICBsZXQgaXRlcmF0aW9ucyA9IDBcbiAgICBsZXQgZXh0ZXJuYWxGb3JtU3VibWl0dGVkID0gZmFsc2VcblxuICAgIC8vIGRpc2FibGUgZm9ybXMgb24gc3VibWl0IHRoYXQgdHJhY2sgcGh4LWNoYW5nZSBidXQgcGVyZm9ybSBleHRlcm5hbCBzdWJtaXRcbiAgICB0aGlzLm9uKFwic3VibWl0XCIsIGUgPT4ge1xuICAgICAgbGV0IHBoeFN1Ym1pdCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJzdWJtaXRcIikpXG4gICAgICBsZXQgcGh4Q2hhbmdlID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcImNoYW5nZVwiKSlcbiAgICAgIGlmKCFleHRlcm5hbEZvcm1TdWJtaXR0ZWQgJiYgcGh4Q2hhbmdlICYmICFwaHhTdWJtaXQpe1xuICAgICAgICBleHRlcm5hbEZvcm1TdWJtaXR0ZWQgPSB0cnVlXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLndpdGhpbk93bmVycyhlLnRhcmdldCwgdmlldyA9PiB7XG4gICAgICAgICAgdmlldy5kaXNhYmxlRm9ybShlLnRhcmdldClcbiAgICAgICAgICAvLyBzYWZhcmkgbmVlZHMgbmV4dCB0aWNrXG4gICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICBpZihET00uaXNVbmxvYWRhYmxlRm9ybVN1Ym1pdChlKSl7IHRoaXMudW5sb2FkKCkgfVxuICAgICAgICAgICAgZS50YXJnZXQuc3VibWl0KClcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKFwic3VibWl0XCIsIGUgPT4ge1xuICAgICAgbGV0IHBoeEV2ZW50ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcInN1Ym1pdFwiKSlcbiAgICAgIGlmKCFwaHhFdmVudCl7XG4gICAgICAgIGlmKERPTS5pc1VubG9hZGFibGVGb3JtU3VibWl0KGUpKXsgdGhpcy51bmxvYWQoKSB9XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnRhcmdldC5kaXNhYmxlZCA9IHRydWVcbiAgICAgIHRoaXMud2l0aGluT3duZXJzKGUudGFyZ2V0LCB2aWV3ID0+IHtcbiAgICAgICAgSlMuZXhlYyhlLCBcInN1Ym1pdFwiLCBwaHhFdmVudCwgdmlldywgZS50YXJnZXQsIFtcInB1c2hcIiwge3N1Ym1pdHRlcjogZS5zdWJtaXR0ZXJ9XSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGZvcihsZXQgdHlwZSBvZiBbXCJjaGFuZ2VcIiwgXCJpbnB1dFwiXSl7XG4gICAgICB0aGlzLm9uKHR5cGUsIGUgPT4ge1xuICAgICAgICBpZihlIGluc3RhbmNlb2YgQ3VzdG9tRXZlbnQgJiYgZS50YXJnZXQuZm9ybSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAvLyB0aHJvdyBvbiBpbnZhbGlkIEpTLmRpc3BhdGNoIHRhcmdldCBhbmQgbm9vcCBpZiBDdXN0b21FdmVudCB0cmlnZ2VyZWQgb3V0c2lkZSBKUy5kaXNwYXRjaFxuICAgICAgICAgIGlmKGUuZGV0YWlsICYmIGUuZGV0YWlsLmRpc3BhdGNoZXIpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBkaXNwYXRjaGluZyBhIGN1c3RvbSAke3R5cGV9IGV2ZW50IGlzIG9ubHkgc3VwcG9ydGVkIG9uIGlucHV0IGVsZW1lbnRzIGluc2lkZSBhIGZvcm1gKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBsZXQgcGh4Q2hhbmdlID0gdGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpXG4gICAgICAgIGxldCBpbnB1dCA9IGUudGFyZ2V0XG4gICAgICAgIC8vIGRvIG5vdCBmaXJlIHBoeC1jaGFuZ2UgaWYgd2UgYXJlIGluIHRoZSBtaWRkbGUgb2YgYSBjb21wb3NpdGlvbiBzZXNzaW9uXG4gICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9LZXlib2FyZEV2ZW50L2lzQ29tcG9zaW5nXG4gICAgICAgIC8vIFNhZmFyaSBoYXMgaXNzdWVzIGlmIHRoZSBpbnB1dCBpcyB1cGRhdGVkIHdoaWxlIGNvbXBvc2luZ1xuICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3Bob2VuaXhmcmFtZXdvcmsvcGhvZW5peF9saXZlX3ZpZXcvaXNzdWVzLzMzMjJcbiAgICAgICAgaWYoZS5pc0NvbXBvc2luZyl7XG4gICAgICAgICAgY29uc3Qga2V5ID0gYGNvbXBvc2l0aW9uLWxpc3RlbmVyLSR7dHlwZX1gXG4gICAgICAgICAgaWYoIURPTS5wcml2YXRlKGlucHV0LCBrZXkpKXtcbiAgICAgICAgICAgIERPTS5wdXRQcml2YXRlKGlucHV0LCBrZXksIHRydWUpXG4gICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY29tcG9zaXRpb25lbmRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAvLyB0cmlnZ2VyIGEgbmV3IGlucHV0L2NoYW5nZSBldmVudFxuICAgICAgICAgICAgICBpbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCh0eXBlLCB7YnViYmxlczogdHJ1ZX0pKVxuICAgICAgICAgICAgICBET00uZGVsZXRlUHJpdmF0ZShpbnB1dCwga2V5KVxuICAgICAgICAgICAgfSwge29uY2U6IHRydWV9KVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBsZXQgaW5wdXRFdmVudCA9IGlucHV0LmdldEF0dHJpYnV0ZShwaHhDaGFuZ2UpXG4gICAgICAgIGxldCBmb3JtRXZlbnQgPSBpbnB1dC5mb3JtICYmIGlucHV0LmZvcm0uZ2V0QXR0cmlidXRlKHBoeENoYW5nZSlcbiAgICAgICAgbGV0IHBoeEV2ZW50ID0gaW5wdXRFdmVudCB8fCBmb3JtRXZlbnRcbiAgICAgICAgaWYoIXBoeEV2ZW50KXsgcmV0dXJuIH1cbiAgICAgICAgaWYoaW5wdXQudHlwZSA9PT0gXCJudW1iZXJcIiAmJiBpbnB1dC52YWxpZGl0eSAmJiBpbnB1dC52YWxpZGl0eS5iYWRJbnB1dCl7IHJldHVybiB9XG5cbiAgICAgICAgbGV0IGRpc3BhdGNoZXIgPSBpbnB1dEV2ZW50ID8gaW5wdXQgOiBpbnB1dC5mb3JtXG4gICAgICAgIGxldCBjdXJyZW50SXRlcmF0aW9ucyA9IGl0ZXJhdGlvbnNcbiAgICAgICAgaXRlcmF0aW9ucysrXG4gICAgICAgIGxldCB7YXQ6IGF0LCB0eXBlOiBsYXN0VHlwZX0gPSBET00ucHJpdmF0ZShpbnB1dCwgXCJwcmV2LWl0ZXJhdGlvblwiKSB8fCB7fVxuICAgICAgICAvLyBCcm93c2VycyBzaG91bGQgYWx3YXlzIGZpcmUgYXQgbGVhc3Qgb25lIFwiaW5wdXRcIiBldmVudCBiZWZvcmUgZXZlcnkgXCJjaGFuZ2VcIlxuICAgICAgICAvLyBJZ25vcmUgXCJjaGFuZ2VcIiBldmVudHMsIHVubGVzcyB0aGVyZSB3YXMgbm8gcHJpb3IgXCJpbnB1dFwiIGV2ZW50LlxuICAgICAgICAvLyBUaGlzIGNvdWxkIGhhcHBlbiBpZiB1c2VyIGNvZGUgdHJpZ2dlcnMgYSBcImNoYW5nZVwiIGV2ZW50LCBvciBpZiB0aGUgYnJvd3NlciBpcyBub24tY29uZm9ybWluZy5cbiAgICAgICAgaWYoYXQgPT09IGN1cnJlbnRJdGVyYXRpb25zIC0gMSAmJiB0eXBlID09PSBcImNoYW5nZVwiICYmIGxhc3RUeXBlID09PSBcImlucHV0XCIpeyByZXR1cm4gfVxuXG4gICAgICAgIERPTS5wdXRQcml2YXRlKGlucHV0LCBcInByZXYtaXRlcmF0aW9uXCIsIHthdDogY3VycmVudEl0ZXJhdGlvbnMsIHR5cGU6IHR5cGV9KVxuXG4gICAgICAgIHRoaXMuZGVib3VuY2UoaW5wdXQsIGUsIHR5cGUsICgpID0+IHtcbiAgICAgICAgICB0aGlzLndpdGhpbk93bmVycyhkaXNwYXRjaGVyLCB2aWV3ID0+IHtcbiAgICAgICAgICAgIERPTS5wdXRQcml2YXRlKGlucHV0LCBQSFhfSEFTX0ZPQ1VTRUQsIHRydWUpXG4gICAgICAgICAgICBKUy5leGVjKGUsIFwiY2hhbmdlXCIsIHBoeEV2ZW50LCB2aWV3LCBpbnB1dCwgW1wicHVzaFwiLCB7X3RhcmdldDogZS50YXJnZXQubmFtZSwgZGlzcGF0Y2hlcjogZGlzcGF0Y2hlcn1dKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLm9uKFwicmVzZXRcIiwgKGUpID0+IHtcbiAgICAgIGxldCBmb3JtID0gZS50YXJnZXRcbiAgICAgIERPTS5yZXNldEZvcm0oZm9ybSlcbiAgICAgIGxldCBpbnB1dCA9IEFycmF5LmZyb20oZm9ybS5lbGVtZW50cykuZmluZChlbCA9PiBlbC50eXBlID09PSBcInJlc2V0XCIpXG4gICAgICBpZihpbnB1dCl7XG4gICAgICAgIC8vIHdhaXQgdW50aWwgbmV4dCB0aWNrIHRvIGdldCB1cGRhdGVkIGlucHV0IHZhbHVlXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiaW5wdXRcIiwge2J1YmJsZXM6IHRydWUsIGNhbmNlbGFibGU6IGZhbHNlfSkpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGRlYm91bmNlKGVsLCBldmVudCwgZXZlbnRUeXBlLCBjYWxsYmFjayl7XG4gICAgaWYoZXZlbnRUeXBlID09PSBcImJsdXJcIiB8fCBldmVudFR5cGUgPT09IFwiZm9jdXNvdXRcIil7IHJldHVybiBjYWxsYmFjaygpIH1cblxuICAgIGxldCBwaHhEZWJvdW5jZSA9IHRoaXMuYmluZGluZyhQSFhfREVCT1VOQ0UpXG4gICAgbGV0IHBoeFRocm90dGxlID0gdGhpcy5iaW5kaW5nKFBIWF9USFJPVFRMRSlcbiAgICBsZXQgZGVmYXVsdERlYm91bmNlID0gdGhpcy5kZWZhdWx0cy5kZWJvdW5jZS50b1N0cmluZygpXG4gICAgbGV0IGRlZmF1bHRUaHJvdHRsZSA9IHRoaXMuZGVmYXVsdHMudGhyb3R0bGUudG9TdHJpbmcoKVxuXG4gICAgdGhpcy53aXRoaW5Pd25lcnMoZWwsIHZpZXcgPT4ge1xuICAgICAgbGV0IGFzeW5jRmlsdGVyID0gKCkgPT4gIXZpZXcuaXNEZXN0cm95ZWQoKSAmJiBkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGVsKVxuICAgICAgRE9NLmRlYm91bmNlKGVsLCBldmVudCwgcGh4RGVib3VuY2UsIGRlZmF1bHREZWJvdW5jZSwgcGh4VGhyb3R0bGUsIGRlZmF1bHRUaHJvdHRsZSwgYXN5bmNGaWx0ZXIsICgpID0+IHtcbiAgICAgICAgY2FsbGJhY2soKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgc2lsZW5jZUV2ZW50cyhjYWxsYmFjayl7XG4gICAgdGhpcy5zaWxlbmNlZCA9IHRydWVcbiAgICBjYWxsYmFjaygpXG4gICAgdGhpcy5zaWxlbmNlZCA9IGZhbHNlXG4gIH1cblxuICBvbihldmVudCwgY2FsbGJhY2spe1xuICAgIHRoaXMuYm91bmRFdmVudE5hbWVzLmFkZChldmVudClcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZSA9PiB7XG4gICAgICBpZighdGhpcy5zaWxlbmNlZCl7IGNhbGxiYWNrKGUpIH1cbiAgICB9KVxuICB9XG5cbiAganNRdWVyeVNlbGVjdG9yQWxsKHNvdXJjZUVsLCBxdWVyeSwgZGVmYXVsdFF1ZXJ5KXtcbiAgICBsZXQgYWxsID0gdGhpcy5kb21DYWxsYmFja3MuanNRdWVyeVNlbGVjdG9yQWxsXG4gICAgcmV0dXJuIGFsbCA/IGFsbChzb3VyY2VFbCwgcXVlcnksIGRlZmF1bHRRdWVyeSkgOiBkZWZhdWx0UXVlcnkoKVxuICB9XG59XG5cbmNsYXNzIFRyYW5zaXRpb25TZXQge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMudHJhbnNpdGlvbnMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnBlbmRpbmdPcHMgPSBbXVxuICB9XG5cbiAgcmVzZXQoKXtcbiAgICB0aGlzLnRyYW5zaXRpb25zLmZvckVhY2godGltZXIgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKVxuICAgICAgdGhpcy50cmFuc2l0aW9ucy5kZWxldGUodGltZXIpXG4gICAgfSlcbiAgICB0aGlzLmZsdXNoUGVuZGluZ09wcygpXG4gIH1cblxuICBhZnRlcihjYWxsYmFjayl7XG4gICAgaWYodGhpcy5zaXplKCkgPT09IDApe1xuICAgICAgY2FsbGJhY2soKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnB1c2hQZW5kaW5nT3AoY2FsbGJhY2spXG4gICAgfVxuICB9XG5cbiAgYWRkVHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUpe1xuICAgIG9uU3RhcnQoKVxuICAgIGxldCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy50cmFuc2l0aW9ucy5kZWxldGUodGltZXIpXG4gICAgICBvbkRvbmUoKVxuICAgICAgdGhpcy5mbHVzaFBlbmRpbmdPcHMoKVxuICAgIH0sIHRpbWUpXG4gICAgdGhpcy50cmFuc2l0aW9ucy5hZGQodGltZXIpXG4gIH1cblxuICBwdXNoUGVuZGluZ09wKG9wKXsgdGhpcy5wZW5kaW5nT3BzLnB1c2gob3ApIH1cblxuICBzaXplKCl7IHJldHVybiB0aGlzLnRyYW5zaXRpb25zLnNpemUgfVxuXG4gIGZsdXNoUGVuZGluZ09wcygpe1xuICAgIGlmKHRoaXMuc2l6ZSgpID4gMCl7IHJldHVybiB9XG4gICAgbGV0IG9wID0gdGhpcy5wZW5kaW5nT3BzLnNoaWZ0KClcbiAgICBpZihvcCl7XG4gICAgICBvcCgpXG4gICAgICB0aGlzLmZsdXNoUGVuZGluZ09wcygpXG4gICAgfVxuICB9XG59XG4iLCAiLypcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5QaG9lbml4IExpdmVWaWV3IEphdmFTY3JpcHQgQ2xpZW50XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5TZWUgdGhlIGhleGRvY3MgYXQgYGh0dHBzOi8vaGV4ZG9jcy5wbS9waG9lbml4X2xpdmVfdmlld2AgZm9yIGRvY3VtZW50YXRpb24uXG5cbiovXG5cbmltcG9ydCBMaXZlU29ja2V0LCB7aXNVc2VkSW5wdXR9IGZyb20gXCIuL2xpdmVfc29ja2V0XCJcbmltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcbmltcG9ydCBWaWV3SG9vayBmcm9tIFwiLi92aWV3X2hvb2tcIlxuaW1wb3J0IFZpZXcgZnJvbSBcIi4vdmlld1wiXG5cbi8qKiBDcmVhdGVzIGEgVmlld0hvb2sgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBlbGVtZW50IGFuZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byBhc3NvY2lhdGUgd2l0aCB0aGUgaG9vay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbY2FsbGJhY2tzXSAtIFRoZSBsaXN0IG9mIGhvb2sgY2FsbGJhY2tzLCBzdWNoIGFzIG1vdW50ZWQsXG4gKiAgIHVwZGF0ZWQsIGRlc3Ryb3llZCwgZXRjLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogY2xhc3MgTXlDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gKiAgIGNvbm5lY3RlZENhbGxiYWNrKCl7XG4gKiAgICAgbGV0IG9uTGl2ZVZpZXdNb3VudGVkID0gKCkgPT4gdGhpcy5ob29rLnB1c2hFdmVudCguLi4pKVxuICogICAgIHRoaXMuaG9vayA9IGNyZWF0ZUhvb2sodGhpcywge21vdW50ZWQ6IG9uTGl2ZVZpZXdNb3VudGVkfSlcbiAqICAgfVxuICogfVxuICpcbiAqICpOb3RlKjogYGNyZWF0ZUhvb2tgIG11c3QgYmUgY2FsbGVkIGZyb20gdGhlIGBjb25uZWN0ZWRDYWxsYmFja2AgbGlmZWN5Y2xlXG4gKiB3aGljaCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgdGhlIGVsZW1lbnQgaGFzIGJlZW4gYWRkZWQgdG8gdGhlIERPTS4gSWYgeW91IHRyeVxuICogdG8gY2FsbCBgY3JlYXRlSG9va2AgZnJvbSB0aGUgY29uc3RydWN0b3IsIGFuIGVycm9yIHdpbGwgYmUgbG9nZ2VkLlxuICpcbiAqIEByZXR1cm5zIHtWaWV3SG9va30gUmV0dXJucyB0aGUgVmlld0hvb2sgaW5zdGFuY2UgZm9yIHRoZSBjdXN0b20gZWxlbWVudC5cbiAqL1xubGV0IGNyZWF0ZUhvb2sgPSAoZWwsIGNhbGxiYWNrcyA9IHt9KSA9PiB7XG4gIGxldCBleGlzdGluZ0hvb2sgPSBET00uZ2V0Q3VzdG9tRWxIb29rKGVsKVxuICBpZihleGlzdGluZ0hvb2speyByZXR1cm4gZXhpc3RpbmdIb29rIH1cblxuICBsZXQgaG9vayA9IG5ldyBWaWV3SG9vayhWaWV3LmNsb3Nlc3RWaWV3KGVsKSwgZWwsIGNhbGxiYWNrcylcbiAgRE9NLnB1dEN1c3RvbUVsSG9vayhlbCwgaG9vaylcbiAgcmV0dXJuIGhvb2tcbn1cblxuZXhwb3J0IHtcbiAgTGl2ZVNvY2tldCxcbiAgaXNVc2VkSW5wdXQsXG4gIGNyZWF0ZUhvb2tcbn1cbiIsICIvLyBJZiB5b3Ugd2FudCB0byB1c2UgUGhvZW5peCBjaGFubmVscywgcnVuIGBtaXggaGVscCBwaHguZ2VuLmNoYW5uZWxgXG4vLyB0byBnZXQgc3RhcnRlZCBhbmQgdGhlbiB1bmNvbW1lbnQgdGhlIGxpbmUgYmVsb3cuXG4vLyBpbXBvcnQgXCIuL3VzZXJfc29ja2V0LmpzXCJcblxuLy8gWW91IGNhbiBpbmNsdWRlIGRlcGVuZGVuY2llcyBpbiB0d28gd2F5cy5cbi8vXG4vLyBUaGUgc2ltcGxlc3Qgb3B0aW9uIGlzIHRvIHB1dCB0aGVtIGluIGFzc2V0cy92ZW5kb3IgYW5kXG4vLyBpbXBvcnQgdGhlbSB1c2luZyByZWxhdGl2ZSBwYXRoczpcbi8vXG4vLyAgICAgaW1wb3J0IFwiLi4vdmVuZG9yL3NvbWUtcGFja2FnZS5qc1wiXG4vL1xuLy8gQWx0ZXJuYXRpdmVseSwgeW91IGNhbiBgbnBtIGluc3RhbGwgc29tZS1wYWNrYWdlIC0tcHJlZml4IGFzc2V0c2AgYW5kIGltcG9ydFxuLy8gdGhlbSB1c2luZyBhIHBhdGggc3RhcnRpbmcgd2l0aCB0aGUgcGFja2FnZSBuYW1lOlxuLy9cbi8vICAgICBpbXBvcnQgXCJzb21lLXBhY2thZ2VcIlxuLy9cblxuLy8gSW5jbHVkZSBwaG9lbml4X2h0bWwgdG8gaGFuZGxlIG1ldGhvZD1QVVQvREVMRVRFIGluIGZvcm1zIGFuZCBidXR0b25zLlxuaW1wb3J0IFwicGhvZW5peF9odG1sXCJcbi8vIEVzdGFibGlzaCBQaG9lbml4IFNvY2tldCBhbmQgTGl2ZVZpZXcgY29uZmlndXJhdGlvbi5cbmltcG9ydCB7U29ja2V0fSBmcm9tIFwicGhvZW5peFwiXG5pbXBvcnQge0xpdmVTb2NrZXR9IGZyb20gXCJwaG9lbml4X2xpdmVfdmlld1wiXG5pbXBvcnQgdG9wYmFyIGZyb20gXCIuLi92ZW5kb3IvdG9wYmFyXCJcblxubGV0IGNzcmZUb2tlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW25hbWU9J2NzcmYtdG9rZW4nXVwiKS5nZXRBdHRyaWJ1dGUoXCJjb250ZW50XCIpXG5sZXQgbGl2ZVNvY2tldCA9IG5ldyBMaXZlU29ja2V0KFwiL2xpdmVcIiwgU29ja2V0LCB7XG4gIGxvbmdQb2xsRmFsbGJhY2tNczogMjUwMCxcbiAgcGFyYW1zOiB7X2NzcmZfdG9rZW46IGNzcmZUb2tlbn1cbn0pXG5cbi8vIFNob3cgcHJvZ3Jlc3MgYmFyIG9uIGxpdmUgbmF2aWdhdGlvbiBhbmQgZm9ybSBzdWJtaXRzXG50b3BiYXIuY29uZmlnKHtiYXJDb2xvcnM6IHswOiBcIiMyOWRcIn0sIHNoYWRvd0NvbG9yOiBcInJnYmEoMCwgMCwgMCwgLjMpXCJ9KVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6cGFnZS1sb2FkaW5nLXN0YXJ0XCIsIF9pbmZvID0+IHRvcGJhci5zaG93KDMwMCkpXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBoeDpwYWdlLWxvYWRpbmctc3RvcFwiLCBfaW5mbyA9PiB0b3BiYXIuaGlkZSgpKVxuXG4vLyBjb25uZWN0IGlmIHRoZXJlIGFyZSBhbnkgTGl2ZVZpZXdzIG9uIHRoZSBwYWdlXG5saXZlU29ja2V0LmNvbm5lY3QoKVxuXG4vLyBleHBvc2UgbGl2ZVNvY2tldCBvbiB3aW5kb3cgZm9yIHdlYiBjb25zb2xlIGRlYnVnIGxvZ3MgYW5kIGxhdGVuY3kgc2ltdWxhdGlvbjpcbi8vID4+IGxpdmVTb2NrZXQuZW5hYmxlRGVidWcoKVxuLy8gPj4gbGl2ZVNvY2tldC5lbmFibGVMYXRlbmN5U2ltKDEwMDApICAvLyBlbmFibGVkIGZvciBkdXJhdGlvbiBvZiBicm93c2VyIHNlc3Npb25cbi8vID4+IGxpdmVTb2NrZXQuZGlzYWJsZUxhdGVuY3lTaW0oKVxud2luZG93LmxpdmVTb2NrZXQgPSBsaXZlU29ja2V0XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBTUEsT0FBQyxTQUFVQSxTQUFRQyxXQUFVO0FBQzNCO0FBRUEsWUFBSSxRQUNGLGlCQUNBLFNBQ0Esa0JBQWtCLE1BQ2xCLGNBQWMsTUFDZCxlQUFlLE1BQ2YsV0FBVyxTQUFVLE1BQU0sTUFBTSxTQUFTO0FBQ3hDLGNBQUksS0FBSztBQUFrQixpQkFBSyxpQkFBaUIsTUFBTSxTQUFTLEtBQUs7QUFBQSxtQkFDNUQsS0FBSztBQUFhLGlCQUFLLFlBQVksT0FBTyxNQUFNLE9BQU87QUFBQTtBQUMzRCxpQkFBSyxPQUFPLElBQUksSUFBSTtBQUFBLFFBQzNCLEdBQ0EsVUFBVTtBQUFBLFVBQ1IsU0FBUztBQUFBLFVBQ1QsY0FBYztBQUFBLFVBQ2QsV0FBVztBQUFBLFlBQ1QsR0FBRztBQUFBLFlBQ0gsT0FBTztBQUFBLFlBQ1AsT0FBTztBQUFBLFlBQ1AsT0FBTztBQUFBLFlBQ1AsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBLFlBQVk7QUFBQSxVQUNaLGFBQWE7QUFBQSxVQUNiLFdBQVc7QUFBQSxR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QUFFO0lBQUU7SUFFNUMsT0FBTTtBQUFFLGFBQU8sS0FBSyxZQUFZO0lBQUs7SUFFckMsa0JBQWlCO0FBQ2YsVUFBRyxLQUFLLEtBQUssSUFBSSxHQUFFO0FBQUU7TUFBTztBQUM1QixVQUFJLEtBQUssS0FBSyxXQUFXLE1BQU07QUFDL0IsVUFBRyxJQUFHO0FBQ0osV0FBRztBQUNILGFBQUssZ0JBQWdCO01BQ3ZCO0lBQ0Y7RUFDRjs7O0FFMy9CQSxzQkFBbUI7QUFFbkIsTUFBSSxZQUFZLFNBQVMsY0FBYyx5QkFBeUIsRUFBRSxhQUFhLFNBQVM7QUFDeEYsTUFBSSxhQUFhLElBQUksV0FBVyxTQUFTLFFBQVE7QUFBQSxJQUMvQyxvQkFBb0I7QUFBQSxJQUNwQixRQUFRLEVBQUMsYUFBYSxVQUFTO0FBQUEsRUFDakMsQ0FBQztBQUdELGdCQUFBQyxRQUFPLE9BQU8sRUFBQyxXQUFXLEVBQUMsR0FBRyxPQUFNLEdBQUcsYUFBYSxvQkFBbUIsQ0FBQztBQUN4RSxTQUFPLGlCQUFpQiwwQkFBMEIsV0FBUyxjQUFBQSxRQUFPLEtBQUssR0FBRyxDQUFDO0FBQzNFLFNBQU8saUJBQWlCLHlCQUF5QixXQUFTLGNBQUFBLFFBQU8sS0FBSyxDQUFDO0FBR3ZFLGFBQVcsUUFBUTtBQU1uQixTQUFPLGFBQWE7IiwKICAibmFtZXMiOiBbIndpbmRvdyIsICJkb2N1bWVudCIsICJ0b3BiYXIiLCAiQ3VzdG9tRXZlbnQiLCAiY2xvc3VyZSIsICJsaXZlU29ja2V0IiwgImNsb3N1cmUiLCAiZSIsICJpc0VtcHR5IiwgImZpbGUiLCAibW9ycGhBdHRycyIsICJtb3JwaGRvbSIsICJjaGlsZHJlbk9ubHkiLCAidGFyZ2V0Q29udGFpbmVyIiwgImNsb25lIiwgImVsIiwgImlucHV0c1VudXNlZCIsICJvbmx5SGlkZGVuSW5wdXRzIiwgImxvY2siLCAibG9hZGluZyIsICJlbnRyeSIsICJpbnB1dCIsICJjbG9zdXJlIiwgInRvcGJhciJdCn0K
