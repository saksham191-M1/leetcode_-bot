document.getElementById('scanBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = "🔍 Scanning page...";
  statusDiv.className = "";

  // 1. Find the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // 2. Inject the content script if it hasn't been loaded yet
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  } catch (e) {
    console.log("Script already loaded or error:", e);
  }

  // 3. Ask content.js to scrape
  chrome.tabs.sendMessage(tab.id, { action: "SCRAPE_DATA" }, async (response) => {
    
    if (!response) {
      statusDiv.textContent = "❌ Error: Could not read page. Refresh LeetCode.";
      statusDiv.className = "error";
      return;
    }

    statusDiv.textContent = "🚀 Sending to AI Brain...";

    // 4. Send data to n8n Webhook
    // REPLACE THIS URL with your actual n8n Production Webhook URL
    const N8N_WEBHOOK_URL = "https://primary-production-2b34.up.railway.app/webhook/leetcode-analyzer";

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemTitle: response.title,
          problemDescription: response.description,
          userCode: response.code,
          url: response.url
        })
      });

      const data = await res.json();
      
      // 5. Display Success
      statusDiv.innerHTML = `✅ <b>Success!</b><br>${data.message || "Saved to Notion."}`;
      statusDiv.className = "success";

    } catch (error) {
      statusDiv.textContent = "❌ Error sending to n8n: " + error.message;
      statusDiv.className = "error";
    }
  });
});