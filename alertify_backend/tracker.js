(function () {
  const script = document.currentScript;
  const siteId = script.getAttribute("data-site-id");

  if (!siteId) {
    console.error("Tracking ID missing");
    return;
  }

  console.log("Tracking initialized:", siteId);

  // 👉 sessionId added (REQUIRED by backend)
  let sessionId = localStorage.getItem("alertify_session");

  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2);
    localStorage.setItem("alertify_session", sessionId);
  }

  function sendEvent(eventType, data = {}) {
    
    fetch("http://localhost:5000/api/collect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        trackingId: siteId,          // ✅ changed from siteId
        sessionId,                   // ✅ added
        eventType,                   // ✅ changed from type
        url: window.location.href,
        clicks: 1,                   // ✅ added (backend expects it)
        scrollDepth: data.scrollDepth || 0,
        requestsPerMinute: 0
      })
    }).catch(err => console.error("Tracking error:", err));
  }

  // Page load event
  sendEvent("pageview");

  // Click tracking
  document.addEventListener("click", (e) => {
    sendEvent("click", {
      element: e.target.tagName
    });
  });

  // Scroll tracking (basic)
  window.addEventListener("scroll", () => {
    const scrollDepth = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );

    if (scrollDepth > 0) {
      sendEvent("scroll", { scrollDepth });
    }
  });

})();