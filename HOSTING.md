# Hosting Yakshavahini on yakshavahini.com

This site is plain static HTML/CSS/JS + JSON - no build step, no server-side
code, no git repo required to deploy it. That means you can get a real,
public test URL in minutes, try everything on it, and only touch DNS once
you're happy.

## 1. Test it locally first (2 minutes, no account needed)

From this folder:

```
python -m http.server 8000
```

then open `http://localhost:8000` in a browser. This is exactly what I've
been using to verify the site - good for checking layout/content changes
fast, but the News and Videos sections need real internet access (they call
Blogger and YouTube), which works fine here since it's just your own
machine making the requests.

## 2. Get a free public test URL (before touching DNS at all)

This is the safest way to test "for real" - you get a live `https://`
address on the host's own subdomain, completely separate from
yakshavahini.com, so nothing about your current blog changes yet.

**Netlify Drop - fastest, zero signup friction**
1. Go to https://app.netlify.com/drop
2. Drag this whole project folder into the browser window (Netlify will
   ignore nothing automatically, so drag `index.html`, `css/`, `js/`,
   `content/`, `images/` - leave `supporting_content/` out of the folder
   you drag, since it's not part of the live site)
3. You instantly get a URL like `random-name-123.netlify.app` - open it,
   click through every section, check News/Videos load, try the language
   toggle. Share that URL with anyone else who wants to review it too.
4. Sign up (free) if you want the URL to stay permanent and be able to
   redeploy later; unclaimed drops expire.

**Cloudflare Pages - best pick for the long term**
1. Sign up free at https://dash.cloudflare.com → Workers & Pages → Create →
   Pages → **Upload assets** (this is the no-git path - no repo needed)
2. Upload the same set of files/folders as above
3. You get `your-project.pages.dev` - a permanent free URL you can keep
   redeploying to (drag a new folder anytime to update it)
4. This is also the one I'd point yakshavahini.com at later, since it's the
   free tier that scales best and has the simplest custom-domain flow

Either way: **test thoroughly on that free subdomain first.** Once it looks
right, move to the DNS step below.

## 3. Point yakshavahini.com at it - via Squarespace Domains

Since your domain moved from Google Domains to Squarespace Domains, DNS is
managed there, not in Google's console:

1. Log in at https://domains.squarespace.com (or via squarespace.com →
   account → Domains)
2. Select `yakshavahini.com` → **DNS Settings**
3. Add the records Cloudflare Pages shows you on its custom-domain screen -
   typically:

   | Type | Host | Value |
   |---|---|---|
   | A | `@` | Cloudflare's provided IP(s) |
   | CNAME | `www` | `your-project.pages.dev` |

   Squarespace's DNS panel lets you add/edit these directly; delete any
   conflicting existing A/CNAME record on `@`/`www` first (there will be one
   currently, since the blog lives there - see step 4).
4. DNS changes typically take effect within minutes to a few hours.

## 4. The blog is currently sitting on yakshavahini.com - move it first

Right now `yakshavahini.com` (the bare domain) **is** your Blogger blog -
confirmed live: real posts, an Atom feed, "Powered by Blogger" in the
footer. If you repoint the apex straight to the new static host without
doing anything else, that blog effectively disappears from the domain (the
posts still exist on Blogger, just not reachable at yakshavahini.com
anymore). To avoid that:

1. In Blogger, open Settings → **Publishing** for that blog → change its
   custom domain from `yakshavahini.com` to a subdomain, e.g.
   `news.yakshavahini.com`. Blogger shows you the exact CNAME to add - add
   it in Squarespace's DNS settings the same way as step 3 above.
2. Wait for `news.yakshavahini.com` to resolve and confirm the blog loads
   there correctly.
3. *Then* do step 3 above - point the apex `yakshavahini.com` (and `www`)
   at Cloudflare Pages.
4. The six project subdomains (`yakshaprasangakosha.yakshavahini.com` etc.)
   need **no changes** - each has its own independent CNAME record in
   Squarespace DNS, untouched by what you do to the apex.
5. Update `content/news.json` → the `"main"` source's `feedUrl` to
   `https://news.yakshavahini.com/feeds/posts/default` (or whichever
   subdomain you chose), so the site's News section keeps pulling those
   posts in too.

This sequencing (blog off the apex → free test URL confirmed good → apex
DNS repointed) means yakshavahini.com is never left broken at any point.

## Excluding non-live files from deployment

`supporting_content/` holds the old bundled-artifact site, duplicate
images, and reference screenshots - leave it out of whatever folder you
upload/drag to Netlify or Cloudflare Pages. Everything else at the project
root (`index.html`, `css/`, `js/`, `content/`, `images/`) is the live site.

## Blog integration (no redirect)

The site's News section (`content/news.json` → `blogger.sources`) pulls
posts live from Blogger's public JSON feeds and merges them into one
chronological list, tagged by which blog each post came from:

- **Main news blog** - currently `yakshavahini.com` itself (update its
  `feedUrl` once moved per step 4 above)
- Six project blogs, already wired up: `yakshaprasangakosha`,
  `prasangaprathisangraha`, `yakshamattukosha`, `yakshaprasangayaadi`,
  `yakshapusthakayaadi`, `yakshasanghatanakosha` - all on
  `*.yakshavahini.com` subdomains

This keeps one visual identity: visitors land on the custom static site,
and posts from all seven blogs appear inline in the same theme instead of
sending people to separately-styled Blogger pages. Each of the six project
blogs is also linked directly from its matching card on the Projects
section ("Visit blog →").
