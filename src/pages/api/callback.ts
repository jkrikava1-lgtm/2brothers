export const prerender = false;

export async function GET({ url }: { url: URL }) {
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing code parameter', { status: 400 });
  }

  const clientId = import.meta.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.OAUTH_GITHUB_CLIENT_SECRET;

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const tokenData = await tokenRes.json();
  const token = tokenData.access_token || '';

  const content = `<!DOCTYPE html>
<html>
<head><title>CMS Auth</title></head>
<body>
<script>
(function() {
  var token = "${token}";
  var data = JSON.stringify({ token: token, provider: "github" });
  function receiveMessage(e) {
    window.opener.postMessage("authorization:github:success:" + data, e.origin);
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
</body>
</html>`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/html' },
  });
}
