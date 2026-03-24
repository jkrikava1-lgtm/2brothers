export const prerender = false;

export async function GET() {
  const clientId = import.meta.env.OAUTH_GITHUB_CLIENT_ID;
  const redirectUri = 'https://www.2brothers.cz/api/callback';

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user`;

  return Response.redirect(githubAuthUrl, 302);
}
