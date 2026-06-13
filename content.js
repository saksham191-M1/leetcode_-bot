// Listen for messages from the sidepanel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SCRAPE_DATA") {
    
    // 1. Get Title
    const title = document.title.split("-")[0].trim();

    // 2. Get Description (Try generic meta tag first, then specific LeetCode class)
    let description = "";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        description = metaDesc.content;
    } else {
        // Fallback to body text if meta is missing (simplified)
        description = document.body.innerText.substring(0, 500) + "...";
    }

    // 3. Get Code
    // LeetCode uses the Monaco Editor. The text is hidden in lines.
    // We select all lines in the view-lines class.
    const codeLines = document.querySelectorAll('.view-lines .view-line');
    let code = "";
    codeLines.forEach(line => {
        code += line.textContent + "\n";
    });

    if (!code || code.trim() === "") {
        code = "Could not auto-scrape code. Please ensure code is visible.";
    }

    sendResponse({
        title: title,
        description: description,
        code: code,
        url: window.location.href
    });
  }
});