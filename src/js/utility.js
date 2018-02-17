const indexRange = function* (length) {
    let i = 0;

    while (i < length) {
        yield i;
        i += 1;
    }
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

const rangeValidate = function ({ min, max, test }) {
    if (typeof min !== "number" || typeof max !== "number" || typeof test !== "number") {
        throw new Error("min, max and test values must be numbers");
    }

    if (test <= min) {
        return min;
    } 
    if (test >= max) {
        return max;
    }
    return test;
};

const chg14bitToTwo7bit = function (dec14bit) {
    if (
        !Number.isInteger(dec14bit) || 
        dec14bit < 0 || dec14bit > 16383
    ) {
        throw new TypeError("input must a 14 bit integer");
    }
    const binaryStr = dec14bit.toString(2).padStart(14, 0);

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

const sendCC = function ({ controller, value, channel, output }) {
    controller = Array.isArray(controller) ? controller : [controller];
    value = Array.isArray(value) ? value : [value];

    for (let i of controller.keys()) {
        if (!output.sendControlChange) {
            return;
        }
        console.log("cc: ", controller[i], "val: ", value[i], "channel: ", channel);
        output.sendControlChange(controller[i], value[i], channel);
    }
};

const sendProgram = function ({ program, channel, output }) {
    if (!output.sendProgramChange) {
        return;
    }
    console.log("progam: ", program, "channel: ", channel);
    output.sendProgramChange(program, channel);
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

export {
    indexRange,
    renderSymbols,
    toClassName,
    rangeValidate,
    chg14bitToTwo7bit,
    chgTwo7bitTo14bit,
    sendCC,
    sendProgram,
    outlineBlink
};