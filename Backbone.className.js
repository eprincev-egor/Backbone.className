(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'backbone'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('backbone'));
    } else {
        // Browser globals
        factory((root.commonJsStrict = {}), root.backbone);
    }
}(this, function (exports, Backbone) {
    "use strict";
    
    var extend = function(className, protoProps, staticProps) {
        if ( typeof className != "string" ) {
            staticProps = protoProps;
            protoProps = className;
            className = "Child";
        }
        
        var parent = this;
        var child;
    
        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && _.has(protoProps, 'constructor')) {
          child = protoProps.constructor;
        } else {
            className = className.replace(/[^\w$]/, "");
          child = new Function("parent", "return function " + className + "(){return parent.apply(this, arguments)};")(parent);// jshint ignore: line
        }
    		
        // Add static properties to the constructor function, if supplied.
        _.extend(child, parent, staticProps);
    
        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();
    
        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);
    
        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;
    
        return child;
    };
    
    Backbone.Model.extend = Backbone.Collection.extend = Backbone.Router.extend = Backbone.View.extend = Backbone.History.extend = extend;
}));
