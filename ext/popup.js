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

/*NEW CODE 2
function generatePDF() {
  // Get the text from the textarea
  const text = document.getElementById("output").value;

  // Create a new jsPDF instance
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  // Add the text to the PDF
  pdf.text(text, 10, 10);

  // Save the PDF with a name
  pdf.save('output.pdf');
*/

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
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
