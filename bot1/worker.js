export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("OK");
    }

    const body = await request.text();
    const signature = request.headers.get("x-chatworkwebhooksignature") || new URL(request.url).searchParams.get("chatwork_webhook_signature");

    if (!signature) {
      return new Response("Unauthorized", { status: 401 });
    }

    const key = await crypto.subtle.importKey(
      "raw",
      Uint8Array.from(atob(env.CHATWORK_WEBHOOK_TOKEN), c => c.charCodeAt(0)),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
    const expected = btoa(String.fromCharCode(...new Uint8Array(digest)));

    if (signature !== expected) {
      return new Response("Unauthorized", { status: 401 });
    }

    const data = JSON.parse(body);
    const message = data.webhook_event?.body;

    if (!message) {
      return new Response("OK");
    }

    const response = await fetch("https://api.chatwork.com/v2/rooms/446319897/messages", {
      method: "POST",
      headers: {
        "X-ChatWorkToken": env.CHATWORK_API_TOKEN,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ body: message })
    });

    return new Response(response.ok ? "OK" : "Chatwork API error", {
      status: response.ok ? 200 : 502
    });
  }
};
