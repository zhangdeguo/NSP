var steelonline = {
    base: null,
    browser: null,
    loader: null,
    config: {
        resourceRoot: "$ResourceSiteDomain$"
    }
};


(function () {
    var Base = {
        emputyFun:function(){},
        delay: function (callbackfun,time,scope)
        {
            var lazycleanup = setTimeout(function () {
                clearTimeout(lazycleanup);
                lazycleanup = null;
                if (callbackfun)
                    callbackfun.call(scope);
            }, 1000);
        }
    }
    steelonline.base = Base;
}());



(function () {
    var userAgent = navigator.userAgent.toLowerCase();
    var check = function (regex) {
        return regex.test(userAgent);
    },
        isStrict = document.compatMode == "CSS1Compat",
        version = function (is, regex) {
            var m;
            return (is && (m = regex.exec(userAgent))) ? parseFloat(m[1]) : 0;
        },
        docMode = document.documentMode,
        isOpera = check(/opera/),
        isOpera10_5 = isOpera && check(/version\/10\.5/),
        isChrome = check(/\bchrome\b/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/),
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isSafari5_0 = isSafari && check(/version\/5\.0/),
        isSafari5 = isSafari && check(/version\/5/),
        isIE = !isOpera && (check(/msie/) || check(/trident/)),
        isIE7 = isIE && ((check(/msie 7/) && docMode != 8 && docMode != 9 && docMode != 10) || docMode == 7),
        isIE8 = isIE && ((check(/msie 8/) && docMode != 7 && docMode != 9 && docMode != 10) || docMode == 8),
        isIE9 = isIE && ((check(/msie 9/) && docMode != 7 && docMode != 8 && docMode != 10) || docMode == 9),
        isIE10 = isIE && ((check(/msie 10/) && docMode != 7 && docMode != 8 && docMode != 9) || docMode == 10),
        isIE11 = isIE && ((check(/trident\/7\.0/) && docMode != 7 && docMode != 8 && docMode != 9 && docMode != 10) || docMode == 11),
        isIE6 = isIE && check(/msie 6/),
        isGecko = !isWebKit && !isIE && check(/gecko/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isGecko4 = isGecko && check(/rv:2\.0/),
        isGecko5 = isGecko && check(/rv:5\./),
        isGecko10 = isGecko && check(/rv:10\./),
        isFF3_0 = isGecko3 && check(/rv:1\.9\.0/),
        isFF3_5 = isGecko3 && check(/rv:1\.9\.1/),
        isFF3_6 = isGecko3 && check(/rv:1\.9\.2/),
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isLinux = check(/linux/),
        scrollbarSize = null,
        chromeVersion = version(true, /\bchrome\/(\d+\.\d+)/),
        firefoxVersion = version(true, /\bfirefox\/(\d+\.\d+)/),
        ieVersion = version(isIE, /msie (\d+\.\d+)/),
        operaVersion = version(isOpera, /version\/(\d+\.\d+)/),
        safariVersion = version(isSafari, /version\/(\d+\.\d+)/),
        webKitVersion = version(isWebKit, /webkit\/(\d+\.\d+)/),
        isSecure = /^https/i.test(window.location.protocol);

    try {
        document.execCommand("BackgroundImageCache", false, true);
    } catch (e) { }

    steelonline.browser = {

        SSL_SECURE_URL: isSecure && isIE ? 'javascript:\'\'' : 'about:blank',

        enableNestedListenerRemoval: false,

        USE_NATIVE_JSON: false,

        isStrict: isStrict,

        isIEQuirks: isIE && (!isStrict && (isIE6 || isIE7 || isIE8 || isIE9)),

        isOpera: isOpera,

        isOpera10_5: isOpera10_5,

        isWebKit: isWebKit,

        isChrome: isChrome,

        isSafari: isSafari,

        isSafari3: isSafari3,

        isSafari4: isSafari4,

        isSafari5: isSafari5,

        isSafari5_0: isSafari5_0,

        isSafari2: isSafari2,

        isIE: isIE,

        isIE6: isIE6,

        isIE7: isIE7,

        isIE7m: isIE6 || isIE7,

        isIE7p: isIE && !isIE6,

        isIE8: isIE8,

        isIE8m: isIE6 || isIE7 || isIE8,

        isIE8p: isIE && !(isIE6 || isIE7),

        isIE9: isIE9,


        isIE9m: isIE6 || isIE7 || isIE8 || isIE9,


        isIE9p: isIE && !(isIE6 || isIE7 || isIE8),


        isIE10: isIE10,


        isIE10m: isIE6 || isIE7 || isIE8 || isIE9 || isIE10,


        isIE10p: isIE && !(isIE6 || isIE7 || isIE8 || isIE9),


        isIE11: isIE11,


        isIE11m: isIE6 || isIE7 || isIE8 || isIE9 || isIE10 || isIE11,


        isIE11p: isIE && !(isIE6 || isIE7 || isIE8 || isIE9 || isIE10),


        isGecko: isGecko,


        isGecko3: isGecko3,


        isGecko4: isGecko4,


        isGecko5: isGecko5,


        isGecko10: isGecko10,


        isFF3_0: isFF3_0,


        isFF3_5: isFF3_5,


        isFF3_6: isFF3_6,


        isFF4: 4 <= firefoxVersion && firefoxVersion < 5,


        isFF5: 5 <= firefoxVersion && firefoxVersion < 6,


        isFF10: 10 <= firefoxVersion && firefoxVersion < 11,


        isLinux: isLinux,


        isWindows: isWindows,


        isMac: isMac,


        chromeVersion: chromeVersion,


        firefoxVersion: firefoxVersion,


        ieVersion: ieVersion,


        operaVersion: operaVersion,


        safariVersion: safariVersion,


        webKitVersion: webKitVersion,


        isSecure: isSecure,


        BLANK_IMAGE_URL: (isIE6 || isIE7) ? '/' + '/www.sencha.com/s.gif' : 'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',

        escapeRe: function (s) {
            return s.replace(/([-.*+?\^${}()|\[\]\/\\])/g, "\\$1");
        },
        useShims: isIE6
    }
}());


(function () {
    var Loader = {
        documentHead:null,
        config: {
            enabled: false,
            scriptChainDelay: false,
            disableCaching: true,
            disableCachingParam: '_dc',
            garbageCollect: false,
            paths: {
                'Eos': '.'
            },
            preserveScripts: true,
            scriptCharset: undefined
        },

        loadScript: function (url, onLoad)
        {
            Loader.injectScriptElement(url, onLoad, null, this, 'utf-8');
        },

        injectScriptElement: function (url, onLoad, onError, scope, charset) {
            if (!onLoad)
                onLoad = steelonline.base.emputyFun;
            var script = document.createElement('script'),
                dispatched = false,
                config = Loader.config,
                onLoadFn = function () {

                    if (!dispatched) {
                        dispatched = true;
                        script.onload = script.onreadystatechange = script.onerror = null;

                        config.scriptChainDelay = 20;
                        if (typeof config.scriptChainDelay == 'number') {
                            steelonline.base.delay(onLoad, 1000, scope);
                        } else {
                            onLoad.call(scope);
                        }
                        Loader.cleanupScriptElement(script, config.preserveScripts === false, config.garbageCollect);
                    }

                },
                onErrorFn = function (arg) {
                    steelonline.base.delay(function () {
                        Loader.cleanupScriptElement(script, config.preserveScripts === false, config.garbageCollect);
                    }, 1000, this);
                };

            script.type = 'text/javascript';
            script.onerror = onErrorFn;
            charset = charset || config.scriptCharset;
            if (charset) {
                script.charset = charset;
            }

            if ('addEventListener' in script) {
                script.onload = onLoadFn;
            } else if ('readyState' in script) {
                script.onreadystatechange = function () {
                    if (this.readyState == 'loaded' || this.readyState == 'complete') {
                        onLoadFn();
                    }
                };
            } else {
                script.onload = onLoadFn;
            }
            script.src = url;
            (Loader.documentHead || document.getElementsByTagName('head')[0]).appendChild(script);
            return script;
        },

        cleanupScriptElement: function (script, remove, collect) {
            var prop;
            script.onload = script.onreadystatechange = script.onerror = null;
            if (remove) {
                script.parentNode.removeNode(script);

                if (collect) {
                    for (prop in script) {
                        try {
                            if (prop != 'src') {
                                script[prop] = null;
                            }
                            delete script[prop];
                        } catch (cleanEx) {
                        }
                    }
                }
            }
            return Loader;
        }
    };
    steelonline.loader = Loader;
}());


//if (steelonline.browser.isIE9m)
//    steelonline.loader.loadScript("http://" + steelonline.config.resourceRoot + "/Content/js/easyui135/jquery-2.1.3.min.js?version=1.0");
//else
//    steelonline.loader.loadScript("http://" + steelonline.config.resourceRoot + "/Content/js/easyui135/jquery-2.1.3.min.js?version=1.0");