(function () {
  const trackingId = document.currentScript.getAttribute("data-id");
  const apiUrl = "http://localhost:5000/api/collect";

  if (!trackingId) {
    console.error("Tracking ID missing");
    return;
  }

  // Generate or reuse session ID
  let sessionId = localStorage.getItem("alertify_session");

  if (!sessionId) {
    sessionId = "session_" + Math.random().toString(36).substring(2);
    localStorage.setItem("alertify_session", sessionId);
  }

  function sendEvent(eventType) {
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trackingId,
        sessionId,
        eventType,
        url: window.location.pathname,
      }),
    }).catch((err) => console.error("Tracking error:", err));
  }

  // Track page view on load
  window.addEventListener("load", function () {
    sendEvent("page_view");
  });

})();