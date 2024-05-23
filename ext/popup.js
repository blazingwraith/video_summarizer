// Get references to the button and the output paragraph
const btn = document.getElementById("summarize");
const output = document.getElementById("output");

// Function to summarize and update the UI
btn.addEventListener("click", function () {
  // Update the UI to indicate work in progress
  btn.disabled = true;
  btn.innerHTML = "Summarizing...";

  // Get the current tab's URL and request a summary
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var url = tabs[0].url;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://127.0.0.1:5000/summary?url=" + url, true);

    xhr.onload = function () {
      var text = xhr.responseText;

      // Update the output paragraph with the summary
      output.innerHTML = text;

      // Reset the button
      btn.disabled = false;
      btn.innerHTML = "Summarize";

      // Save the state to chrome.storage.local
      savePopupState();
    };

    xhr.send();
  });
});

//doc part
// Function to export content to Word document
function Export2Word(element, filename = "") {
  var preHtml =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
  var postHtml = "</body></html>";
  var html = preHtml + document.getElementById(element).innerHTML + postHtml;

  var blob = new Blob(["\ufeff", html], {
    type: "application/msword",
  });

  // Specify link url
  var url =
    "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(html);

  // Specify file name
  filename = filename ? filename + ".doc" : "document.doc";

  // Create download link element
  var downloadLink = document.createElement("a");

  document.body.appendChild(downloadLink);

  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Create a link to the file
    downloadLink.href = url;

    // Setting the file name
    downloadLink.download = filename;

    // triggering the function
    downloadLink.click();
  }

  document.body.removeChild(downloadLink);
}

// Adding event listener to the Export button
document.getElementById("export").addEventListener("click", function () {
  Export2Word("out", "summary");
}); // Function to export content to Word document
function Export2Word(element, filename = "") {
  var preHtml =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
  var postHtml = "</body></html>";
  var html = preHtml + document.getElementById(element).innerHTML + postHtml;

  var blob = new Blob(["\ufeff", html], {
    type: "application/msword",
  });

  // Specify link url
  var url =
    "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(html);

  // Specify file name
  filename = filename ? filename + ".doc" : "document.doc";

  // Create download link element
  var downloadLink = document.createElement("a");

  document.body.appendChild(downloadLink);

  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Create a link to the file
    downloadLink.href = url;

    // Setting the file name
    downloadLink.download = filename;

    // triggering the function
    downloadLink.click();
  }

  document.body.removeChild(downloadLink);
}

//*PDF Part
let btn1 = document.getElementById("pdfButton");
let makepdf = document.getElementById("exportContent");

btn1.addEventListener("click", function () {
  let mywindow = window.open("", "PRINT", "height=400,width=600");

  mywindow.document.write(out.innerHTML);

  mywindow.document.close();
  mywindow.focus();

  mywindow.print();
  mywindow.close();

  return true;
});

// Function to save the state of the popup
function savePopupState() {
  chrome.storage.local.set(
    {
      popupState: {
        outputText: output.innerHTML,
        buttonDisabled: btn.disabled,
      },
    },
    () => {
      console.log("Popup state saved.");
    }
  );
}

// Function to retrieve the state when the popup is loaded
function restorePopupState() {
  chrome.storage.local.get("popupState", (result) => {
    const popupState = result.popupState || {};

    // Restore the output text
    output.innerHTML = popupState.outputText || "";

    // Restore the button state
    btn.disabled = popupState.buttonDisabled || false;
    btn.innerHTML = popupState.buttonDisabled ? "Summarising..." : "Summarise";
  });
}

//NEW CODE HERE
// Add an event listener to respond to messages
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (
    message.action === "url_changed" ||
    message.action === "content_changed"
  ) {
    // Reinitialize the popup
    restorePopupState(); // This will refresh the state based on your stored data
  }
});

// Restore the popup state when the popup is loaded
document.addEventListener("DOMContentLoaded", restorePopupState);
