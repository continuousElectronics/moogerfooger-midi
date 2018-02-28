/**
 * Contains general utility functions used througout various parts of the application
 * @module utility
 * @see ./state-options.js, ./effect.js, ../App.vue, ../components/effect.vue, 
 * ../components/continuous.vue, ../components/global/midi-clock.vue
 */

const rangeI = function* (length) {
    let i = 0;

    while (i < length) {
        yield i;
        i += 1;
    }
};

const rangeA = function (length) {
    return Array.from(rangeI(length));
};

const isInt = function (input) {
    return Number.isInteger(input);
};

const isArray = function (input) {
    return Array.isArray(input);
};

const isIntOrArray = function (input) {
    return isInt(input) || isArray(input);
};

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