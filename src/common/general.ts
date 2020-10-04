

/**
 * Downloads a file to the users computer with the given filename and contents
 * @param filename Name of the file to download
 * @param contents Contents of the file to download
 */
export function downloadFile(filename: string, contents: string) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contents));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

/**
 * Copy the given value to the OS Clipboard
 * @param value String to copy to the clipboard
 */
export function copyToClipboard(value: string) {
    const el = document.createElement('textarea'); // Create a <textarea> element
    el.value = value; // Set its value to the string that you want copied
    el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px'; // Move outside the screen to make it invisible
    document.body.appendChild(el); // Append the <textarea> element to the HTML document
    // Check if there is any content selected previously
    const selected =
        document.getSelection().rangeCount > 0
            ? document.getSelection().getRangeAt(0) // Store selection if found
            : false; // Mark as false to know no selection existed before
    // Select the <textarea> content
    el.select();
    // Copy - only works as a result of a user action (e.g. click events)
    document.execCommand('copy');
    document.body.removeChild(el); // Remove the <textarea> element
    if (selected) {
        // If a selection existed before copying
        // Unselect everything on the HTML document
        document.getSelection().removeAllRanges();
        // Restore the original selection
        document.getSelection().addRange(selected);
    }
}