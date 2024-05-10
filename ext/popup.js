// Get references to the button and the output paragraph
const btn = document.getElementById("summarize");
const output = document.getElementById("output");

// Function to summarise and update the UI
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

// Restore the popup state when the popup is loaded
document.addEventListener("DOMContentLoaded", restorePopupState);
