function getCaretPositionInPixels(input, e) {
    let caretPosition = input.selectionStart;
    const style = window.getComputedStyle(input);
    const fontSize = style.fontSize;
    const fontFamily = style.fontFamily;
    const fontWeight = style.fontWeight;
    const lineHeight = style.lineHeight;

    // Create a hidden span to measure text width
    const measurementElement = document.createElement("span");
    measurementElement.className = "hidden-measurement";
    measurementElement.style.fontSize = fontSize;
    measurementElement.style.fontFamily = fontFamily;
    measurementElement.style.fontWeight = fontWeight;
    measurementElement.style.lineHeight = lineHeight;

    document.body.appendChild(measurementElement);

    // Set the span's text to be the input's text up to the caret position
    if (caretPosition < starterText.length) {
        input.setSelectionRange(starterText.length, starterText.length);
        caretPosition = starterText.length;
    }
    measurementElement.textContent = input.value.substring(0, caretPosition);

    // Measure the width of the text up to the caret position
    const caretPositionInPixels = measurementElement.offsetWidth;

    // Clean up
    document.body.removeChild(measurementElement);

    return caretPositionInPixels;
}

function syncCaretPosition(e) {
    const position = getCaretPositionInPixels(consoleText, e);
    document.getElementById("caret").style.left = position + 10 + "px";
    document.getElementById("caret").style.top =
        consoleText.offsetTop + 5 + "px";
}
