/**
 * Simple localStorage with Cookie Fallback
 * v.1.0.0
 *
 * USAGE:
 * ----------------------------------------
 * Set New / Modify:
 *   store('my_key', 'some_value');
 *
 * Retrieve:
 *   store('my_key');
 *
 * Delete / Remove:
 *   store('my_key', null);
 */

function store(key, value) {

    // If value is detected, set new or modify store
    if (typeof value !== "undefined" && value !== null) {
        // Convert object values to JSON
        if ( typeof value === 'object' ) {
            value = JSON.stringify(value);
        }
        // Set the store
        if (store.lsSupport) { // Native support
            localStorage.setItem(key, value);
        } else { // Use Cookie
            store.createCookie(key, value, 30);
        }
    }

    // No value supplied, return value
    if (typeof value === "undefined") {
        var data = null;

        // Get value
        if (store.lsSupport) { // Native support
            data = localStorage.getItem(key);
        } else { // Use cookie
            data = store.readCookie(key);
        }

        // Try to parse JSON...
        try {
            data = JSON.parse(data);
        }
        catch(e) {
            data = data;
        }

        return data;

    }

    // Null specified, remove store
    if (value === null) {
        if (store.lsSupport) { // Native support
            localStorage.removeItem(key);
        } else { // Use cookie
            store.createCookie(key, '', -1);
        }
    }

}

store.lsSupport = (function () {
    try {
        var key = 'aKey', value = 'aValue';
        localStorage.setItem(key, value);
        var ret = localStorage.getItem(key) === value;
        localStorage.removeItem(key);
        return ret;
    } catch (e) {
        return false;
    }
})();

/**
 * Creates new cookie or removes cookie with negative expiration
 * @param  key       The key or identifier for the store
 * @param  value     Contents of the store
 * @param  exp       Expiration - creation defaults to 30 days
 */
store.createCookie = function createCookie(key, value, exp) {
    var date = new Date();
    date.setTime(date.getTime() + (exp * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
    document.cookie = key + "=" + value + expires + "; path=/";
};

/**
 * Returns contents of cookie
 * @param  key       The key or identifier for the store
 */
store.readCookie = function readCookie(key) {
    var nameEQ = key + "=";
    var ca = document.cookie.split(';');
    for (var i = 0, max = ca.length; i < max; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

store.clear = function () {
    if (store.lsSupport) {
        localStorage.clear();
    } else {
        var ca = document.cookie.split(';');
        for (var i = 0, max = ca.length; i < max; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            store.createCookie(c, '', -1);
        }
    }
};