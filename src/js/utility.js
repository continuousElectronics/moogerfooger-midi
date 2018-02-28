/**
 * Contains general utility functions used througout various parts of the application
 * @module utility
 * @see ./state-options.js, ./effect.js, ../App.vue, ../components/effect.vue, 
 * ../components/continuous.vue, ../components/global/midi-clock.vue
 */

/**
  * Generator function to iterate lazily over zero indexed array where Array[i] = i
  * @function rangeI
  * @param {Number} length - length of zero indexed array
  */
const rangeI = function* (length) {
    let i = 0;

    while (i < length) {
        yield i;
        i += 1;
    }
};

/**
  * Generates and returns a zero indexed array of desired length where Array[i] = i
  * @function rangeA
  * @param {Number} length - length of zero indexed array
  * @returns {Array}
  */
const rangeA = function (length) {
    return Array.from(rangeI(length));
};

/**
  * returns boolean of whether or not the input is an integer
  * @function isInt
  * @param {Any} input - input to check
  * @returns {Boolean}
  */
const isInt = function (input) {
    return Number.isInteger(input);
};

/**
  * returns boolean of whether or not the input is an Array
  * @function isArray
  * @param {Any} input - input to check
  * @returns {Boolean}
  */
const isArray = function (input) {
    return Array.isArray(input);
};

/**
  * returns boolean of whether or not the input is an Array or an Integer
  * @function isIntOrArray
  * @param {Any} input - input to check
  * @returns {Boolean}
  */
const isIntOrArray = function (input) {
    return isInt(input) || isArray(input);
};

/**
  * Returns any number of UTF-8 musical note symbols wrapped in span.symbol 
  * @function renderSymbols
  * @param {String} - string representing a musical note symbol
  * @returns {String}
  */
const renderSymbols = function () {
    const notes = {
        whole:        "&#119133;",
        half:         "&#119134;",
        quarter:      "&#119135;",
        eighth:       "&#119136;",
        sixteenth:    "&#119137;",
        thirtysecond: "&#119138;",
        dot:          "&#119149;"
    };
    
    let string = "";

    for (let prop of arguments) {
        string += notes[prop] || "";
    }

    return "<span class=\"symbol\">" + string + "</span>";
};

/**
  * Trims spaces, replaces inner spaces with "-", and converts to lowercase  
  * @function toClassName
  * @param {String} string - string to be transformed to classname
  * @returns {String}
  */
const toClassName = function (string) {
    if (typeof string !== "string") {
        throw new TypeError("input must be string");
    }
    return string
        .replace(/\//, "")
        .replace(/\s{2,}/g, " ")
        .trim()
        .split(" ")
        .join("-")
        .toLowerCase();
};

/**
  * Takes a 14 bit integer and transforms into an array with two 7 bit numbers
  * @function chg14bitToTwo7bit
  * @param {Number} int - integer that is >= 0 and <= 16383 (14 bit)
  * @returns {Array}
  */
const chg14bitToTwo7bit = function (int) {
    if (!isInt(int) || int < 0 || int > 16383) {
        throw new TypeError("input must a 14 bit integer");
    }
    const binaryStr = int.toString(2).padStart(14, 0);

    return [
        parseInt(binaryStr.substr(0, 7), 2),
        parseInt(binaryStr.substr(7, 7), 2)
    ];
};

/**
  * Takes an array of two 7 bit numbers and transforms it into a 14 bit integer
  * @function chgTwo7bitTo14bit
  * @param {Array} two7bitArr - Array of two 7 bit numbers >= 0 and <= 127
  * @returns {Number}
  */
const chgTwo7bitTo14bit = function (two7bitArr) {
    if (
        !Array.isArray(two7bitArr)               || 
        two7bitArr.length !== 2                  || 
        !Number.isInteger(two7bitArr[0])         ||
        !Number.isInteger(two7bitArr[1])         ||
        two7bitArr[0] < 0 || two7bitArr[0] > 127 ||
        two7bitArr[1] < 0 || two7bitArr[1] > 127
    ) {
        throw new TypeError("input must be array of two 7 bit integers");
    }
    const 
        first  = two7bitArr[0].toString(2).padStart(7, 0),
        second = two7bitArr[1].toString(2).padStart(7, 0);

    return parseInt(first + second, 2);
};

/**
  * Blinks an outline around a DOM element
  * @function outlineBlink
  * @param {Object} el - DOM element object to blink outline around
  * @param {Number} startMs - [ optional ] starting time of blink in ms
  * @param {Number} endMS - [ optional ] ending time of blink in ms
  * @returns {void}
  */
const outlineBlink = function (el, startMs = 0, endMs = 100) {
    if ( !(el instanceof Element) ) {
        return;
    }

    const 
        blinkOutline = "1px solid rgb(89, 109, 140)",
        noOutline    = "none";

    setTimeout(() => el.style.outline = blinkOutline, startMs);
    setTimeout(() => el.style.outline = noOutline,      endMs);
};

/**
  * Mark in the Vue instance data whether or not a file has been changed 
  * so we know how to deal with certain file operations
  * @function markIfFileChanged
  * @param {Object} vm - Vue instance where data can be accessed
  * @param {String} fileopen - [ optional ] string indicating if the context is a file open operation
  * @returns {void}
  */
const markIfFileChanged = function (vm, fileopen) {
    if (vm.filepath && !vm.fileChanged && !fileopen) {
        vm.fileChanged = true;
    }
};

export {
    rangeI,
    rangeA,
    isInt,
    isArray,
    isIntOrArray,
    renderSymbols,
    toClassName,
    chg14bitToTwo7bit,
    chgTwo7bitTo14bit,
    outlineBlink,
    markIfFileChanged
};