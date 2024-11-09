import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as _ from 'lodash';

export function shortUid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4();
}

export function shortMessage(message) {
    return message && message.length > 200 ? message.substring(0, 200) + '...' : message;
}

export function getDashboardUserFriendlyVersion(currentVersion, allVersions) {
    let sortedVersions = [].concat(allVersions);
    sortedVersions.sort(function (a, b) {
        if (a.timestamp === b.timestamp) {
            return 0;
        }
        let aDate = new Date(a.timestamp);
        let bDate = new Date(b.timestamp);
        return aDate > bDate ? 1 : -1;
    });
    for (let i = 0; i < sortedVersions.length; i++) {
        if (sortedVersions[i].tag === currentVersion.tag) {
            return i + 1;
        }
    }
    return 0;
}

export function findConfigItemsInExpression(expression, configItems) {
    let regex = /{(.*?)}/g;
    let result = [];
    let match = regex.exec(expression);
    while (match != null && configItems) {
        let matchingConfigItem = configItems.find(configItem => configItem.name === match[1]);
        if (matchingConfigItem) {
            result.push({ key: match[1], value: matchingConfigItem.value });
        }
        match = regex.exec(expression);
    }

    return result;
}

export function primitiveOrNull(value) {
    if (_.isBoolean(value)) {
        return value;
    }
    if (!_.isNaN(_.parseInt(value))) {
        return _.toFinite(value);
    }
    if (value) {
        return value;
    }

    return null;

}

export function downloadUrl(url, filename) {
    let a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

export function downloadFile(blob, filename) {
    let a = document.createElement("a"), url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

export function htmlToPDF(divId, filename) {
    if (!filename)
        filename = 'Dashboard';
    const input = document.getElementById(divId);
    html2canvas(input)
        .then((canvas) => {
            try {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(imgData, 'png', 0, 0, canvas.width, canvas.height);
                pdf.save(filename + ".pdf");
            } catch (e) {
                console.error('Failed to generate PDF. ' + e.text, e);
                alert('Failed to generate PDF. Please send the logs to dev.');
            }
        })
        ;
}

export function htmlToJPG(divId, filename) {
    if (!filename)
        filename = 'Dashboard';
    const input = document.getElementById(divId);
    html2canvas(input)
        .then((canvas) => {
            try {
                const url = canvas.toDataURL('image/jpeg');
                downloadUrl(url, filename);
            } catch (e) {
                console.error('Failed to generate JPG. ' + e.text, e);
                alert('Failed to generate JPG. Please send the logs to dev.');
            }
        })
        ;
}

export function setAMinusSetB(arrayA, arrayB) {
    let a = new Set(arrayA);
    let b = new Set(arrayB);
    return new Set([...a].filter(val => !b.has(val)));
}

export function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}