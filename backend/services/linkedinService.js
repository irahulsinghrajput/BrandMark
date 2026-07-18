/**
 * linkedinService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * LinkedIn Developer API — Automated content posting for BrandMark Solutions.
 *
 * Free tier capabilities:
 *  - Share posts on LinkedIn Company Page (w/ text, links, images)
 *  - Post on Personal Profile
 *  - Read company analytics (impressions, clicks, engagement)
 *
 * Credentials required:
 *  - LINKEDIN_ACCESS_TOKEN (OAuth2 bearer token)
 *  - LINKEDIN_PERSON_URN   (urn:li:person:XXXX — for personal posts)
 *  - LINKEDIN_ORG_URN      (urn:li:organization:XXXX — for company posts)
 */

const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';

const getConfig = () => ({
  accessToken: process.env.LINKEDIN_ACCESS_TOKEN || '',
  personUrn:   process.env.LINKEDIN_PERSON_URN   || '',
  orgUrn:      process.env.LINKEDIN_ORG_URN       || ''
});

// ─── Shared API helper ────────────────────────────────────────────────────────
async function linkedInApiCall(endpoint, method = 'GET', body = null) {
  const { accessToken } = getConfig();

  if (!accessToken) {
    console.warn('[LinkedIn] LINKEDIN_ACCESS_TOKEN not configured — skipping');
    return { skipped: true, reason: 'LINKEDIN_ACCESS_TOKEN not configured' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${LINKEDIN_API_BASE}/${endpoint}`, {
      method,
      headers: {
        'Authorization':          `Bearer ${accessToken}`,
        'Content-Type':           'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body:   body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
    clearTimeout(timer);

    const data = await res.json();

    if (!res.ok) {
      console.error(`[LinkedIn] ❌ ${method} ${endpoint} — HTTP ${res.status}:`, data?.message || data);
      throw new Error(data?.message || `LinkedIn API error ${res.status}`);
    }

    return data;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error('LinkedIn API request timed out');
    throw err;
  }
}

// ─── Post Helpers ─────────────────────────────────────────────────────────────

/**
 * Build a UGC (User Generated Content) share post payload.
 * @param {object} opts
 * @param {string} opts.authorUrn - urn:li:person:XXX or urn:li:organization:XXX
 * @param {string} opts.text      - Post body text
 * @param {string} [opts.url]     - Optional URL to attach
 * @param {string} [opts.urlTitle] - Link title
 * @param {string} [opts.urlDesc]  - Link description
 * @returns {object} LinkedIn UGC post body
 */
function buildPostPayload({ authorUrn, text, url, urlTitle, urlDesc }) {
  const shareContent = {
    shareCommentary: { text },
    shareMediaCategory: url ? 'ARTICLE' : 'NONE'
  };

  if (url) {
    shareContent.media = [{
      status:       'READY',
      originalUrl:  url,
      title:        { text: urlTitle || 'BrandMark Solutions' },
      description:  { text: urlDesc  || 'Digital Marketing Agency' }
    }];
  }

  return {
    author:         authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': shareContent
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
    }
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Post content to LinkedIn Personal Profile.
 * @param {object} params
 * @param {string} params.text     - Post text content
 * @param {string} [params.url]    - Optional link to attach
 * @param {string} [params.urlTitle]
 * @param {string} [params.urlDesc]
 * @returns {Promise<object>} LinkedIn API response
 */
async function postToPersonalProfile({ text, url, urlTitle, urlDesc }) {
  const { personUrn } = getConfig();

  if (!personUrn) {
    console.warn('[LinkedIn] LINKEDIN_PERSON_URN not configured');
    return { skipped: true, reason: 'LINKEDIN_PERSON_URN not configured' };
  }

  console.log(`[LinkedIn] 📤 Posting to personal profile: "${text.substring(0, 60)}..."`);
  const payload = buildPostPayload({ authorUrn: personUrn, text, url, urlTitle, urlDesc });
  const result  = await linkedInApiCall('ugcPosts', 'POST', payload);

  console.log(`[LinkedIn] ✅ Personal post created: ${result?.id || 'unknown'}`);
  return result;
}

/**
 * Post content to LinkedIn Company Page.
 * @param {object} params - Same as postToPersonalProfile
 */
async function postToCompanyPage({ text, url, urlTitle, urlDesc }) {
  const { orgUrn } = getConfig();

  if (!orgUrn) {
    console.warn('[LinkedIn] LINKEDIN_ORG_URN not configured');
    return { skipped: true, reason: 'LINKEDIN_ORG_URN not configured' };
  }

  console.log(`[LinkedIn] 🏢 Posting to company page: "${text.substring(0, 60)}..."`);
  const payload = buildPostPayload({ authorUrn: orgUrn, text, url, urlTitle, urlDesc });
  const result  = await linkedInApiCall('ugcPosts', 'POST', payload);

  console.log(`[LinkedIn] ✅ Company post created: ${result?.id || 'unknown'}`);
  return result;
}

/**
 * Post to both Personal Profile AND Company Page simultaneously.
 * Returns results from both.
 */
async function postToBoth({ text, url, urlTitle, urlDesc }) {
  const results = await Promise.allSettled([
    postToPersonalProfile({ text, url, urlTitle, urlDesc }),
    postToCompanyPage({ text, url, urlTitle, urlDesc })
  ]);

  return {
    personal: results[0].status === 'fulfilled' ? results[0].value : { error: results[0].reason?.message },
    company:  results[1].status === 'fulfilled' ? results[1].value : { error: results[1].reason?.message }
  };
}

/**
 * Get the authenticated user's LinkedIn profile.
 */
async function getMyProfile() {
  return linkedInApiCall('me?projection=(id,localizedFirstName,localizedLastName,profilePicture)');
}

/**
 * Get company analytics (impressions, clicks, engagement) for the last N days.
 * @param {number} days - Number of days to look back (default: 30)
 */
async function getCompanyAnalytics(days = 30) {
  const { orgUrn } = getConfig();
  if (!orgUrn) return { skipped: true, reason: 'LINKEDIN_ORG_URN not configured' };

  const end   = Date.now();
  const start = end - (days * 24 * 60 * 60 * 1000);

  const endpoint = `organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${encodeURIComponent(orgUrn)}&timeIntervals.timeGranularityType=DAY&timeIntervals.startTime=${start}&timeIntervals.endTime=${end}`;

  return linkedInApiCall(endpoint);
}

/**
 * Health check — verify LinkedIn token is valid.
 */
async function checkLinkedInCredentials() {
  const { accessToken, personUrn, orgUrn } = getConfig();
  const status = {
    accessTokenConfigured: !!accessToken,
    personUrnConfigured:   !!personUrn,
    orgUrnConfigured:      !!orgUrn
  };

  if (accessToken) {
    try {
      const profile = await getMyProfile();
      status.tokenValid = !profile.skipped;
      status.profileName = profile.localizedFirstName
        ? `${profile.localizedFirstName} ${profile.localizedLastName}`
        : 'Unknown';
    } catch {
      status.tokenValid = false;
    }
  }

  return status;
}

module.exports = {
  postToPersonalProfile,
  postToCompanyPage,
  postToBoth,
  getMyProfile,
  getCompanyAnalytics,
  checkLinkedInCredentials
};
