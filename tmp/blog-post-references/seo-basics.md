SEO Basics: Searching… Seek and Deploy
Kids, I'm gonna tell you an incredible story. The story of how I met your website.
João Victor Voglerby João Victor VoglerNovember 1, 2023
Last Updated on April 11, 2024

Oh, hi! I didn’t see you were already there! Today, I will be your wingman to help you and Google become best buddies. Ready? We will go over the basics of how search engines and SEO work and give you some practical tips to make a website more discoverable (or not discoverable, as we will see).

The Basics
You have probably heard of the term SEO, which stands for Search Engine Optimization, but do you understand what it is in practice? Many people think it is a tool or technology when, in reality, it is nothing but a strategy to increase how relevant a website is in the eyes of a search engine.

"Okay, but how does the process of searching even work?"

I’m glad you asked! There are three stages of a Google Search according to their docs:

Crawling: Automated programs called crawlers will download text, images, and videos from the pages they find.

Indexing: This data is then analyzed and stored inside a large database.

Serving search results: When you search for something, Google first tries to determine the intent behind the query to decide what to look for inside its database. Then, it returns results based on various criteria, such as how relevant the content might be based on your intent, the quality of the content, language, user device (desktop or phone), and many more.

In the end, crawling is all about having a link in the park so you get one step closer to breaking the habit of neglecting SEO. See what I’ve done there?

"So, if this analysis is automated, perhaps we can do something to help it out?"

That’s why I like you, you’re so clever!

Dream of Canonicalization
To understand what canonical tags are and their importance, it helps to learn the meaning of the word canonical in the first place. I could give you a dictionary entry, but let’s try something more fun instead.

What if I told you that the eagles took Frodo to Mordor, making the story of The Lord of the Rings end in 15 minutes? Also, did you know that Harry Potter was simply a normal teenager hallucinating about being a wizard to cope with his traumas?

Well, since I’m not the original author of any of these franchises, the plots I just told are not considered canonical. On the other hand, movies like The Last Jedi unfortunately are.

"Hm, okay, I get it, but can we get back to talking about tech stuff?"

Say less! Imagine that, for some reason or another, your website has duplicate pages or content that’s very similar:

https://yourwebsite.com/blog
https://yourwebsite.com/blog?page=1
We can assist search engines by telling them which one is supposed to be the main version like so:

<!-- Inside your HTML's <head> -->
<link rel="canonical" href="https://yourwebsite.com/blog" />
With just this single line of code, we are already contributing to higher rankings in searches. Why? Because it helps improve crawling efficiency, meaning fewer resources spent by them while also avoiding quality penalties due to having "duplicate content".

In fact, if you open your browser’s DevTools (F12 in Chrome) and expand the tag in the Elements section, you will find a canonical tag pointing to this very post!

The means you choose to add this tag are up to you and your creativity. I’ll give you an example of something that can be done in a Rails application, but remember that you should take your website’s specific needs into account when designing a solution.

But before we show a possible solution, let me quickly provide you with the context of a real case that I had to manage.

The Problem
I was assigned to fix some SEO problems we had in Codeminer42‘s main website, and the main issue our SEO report accused was that we had duplicate content.

Knowing that we didn’t actually have duplicate content, I realized what the problem was:

Since our pages can be translated into both Portuguese and English, we could have the following URLs:

https://codeminer42.com
https://codeminer42.com/?lang=en
https://codeminer42.com/?lang=pt-BR
Everything was fine for the Portuguese version of the website, but search engines were getting confused by the first two. They were both in English and are actually the same page, just with different URLs.

The fix would be trivial if we could just slap in a hard-coded canonical link tag, but it wouldn’t work for our specific situation since we also have dynamically generated pages for our careers.

The Solution
Helper tags to the rescue, boom!

# application_helper.rb

def canonical_tag
tag(:link, rel: "canonical", href: url_without_query)
end

private

def url_without_query
"#{request.base_url}#{request.path}"
end
The helper method url_without_query will return the current page’s URL even if it is dynamically generated and without any query parameters!

All that’s left now is to include the helper tag inside the head section of the layout:

<!-- jobs.erb -->
<head>
    <%= canonical_tag %>
</head>
This made https://codeminer42.com the canonical URL, so even if the page https://codeminer42.com/?lang=en looks identical to the former, search engines are now aware that it is not actually duplicated content.

Other Methods
Besides the link tag method, there are a few other ways of specifying canonical URLs. For instance:

Using rel="canonical" in HTTP Headers.

Redirecting duplicate pages to canonical pages.

Listing only canonical URLs in your sitemap.

Instead of multiples, pick a single one that suits you better, as not doing so will most likely confuse our robot friends.

Cans of Canonical URLs
Self-Referencing Canonicals
While not strictly necessary, it allows crawlers to pick the exact canonical URL you intended. It also prevents unintentional duplication due to unforeseen circumstances. Last but not least, it mitigates scrapers that are naive enough to republish your content without changing the canonical tag.

Favor HTTPS over HTTP
Specifying the correct domain protocol matters. Note that Google prefers HTTPS pages unless there are conflicting issues, such as an invalid SSL certificate, redirects through or to an HTTP page, etc.

Similar URLs
When specifying the canonical URL, the following could be perceived as different pages by search engines:

Trailing Slash / Non-Trailing Slash
Trailing slash: https://yourwebsite.com/

Non-trailing slash: https://yourwebsite.com

WWW / Non-WWW
WWW: https://www.yourwebsite.com/

Non-WWW: https://yourwebsite.com/

Be consistent with your choices of which one to use as canonical.

Use Only Absolute URLs
Good

<link rel="canonical" href="https://nomeucrossfox.com/blog/" />
Bad
<link rel="canonical" href="/blog/" />
Common Pitfalls
Here are a few other best practices you should follow:

When linking within your site, use the canonical URLs rather than the duplicates.

Don’t point canonical tags to redirected pages.

Don’t use the robots.txt file for canonicalization (try to say this word three times really fast).

Don’t use Google’s URL removal tool for canonicalization (seriously, try to say it out loud).

Hiding Pages from Search Results
So now the search engines love your website and are listing it everywhere, but there will be scenarios where you want to ignore specific pages and not show them in search results, like a page of a currently inactive job listing, for example.

Luckily, the fix is simple enough:

<!-- Inside your HTML's <head> -->
<meta name="robots" content="noindex">
Remember step two of a Google Search we saw moments ago? When we add this meta tag, it tells crawlers: "Hey bud, don’t worry about this page", and voilà, it will (eventually) stop showing in search results!

You can also combine it with other indexing rules like this:

<meta name="robots" content="noindex, nofollow" />
One important caveat is that for the noindex rule to be effective, your page must not be blocked by a robots.txt and has to be accessible by the crawler, or it will still appear in search results.

Dealing With Localized Versions of a Page
"Let me guess, will we solve this problem with yet another tag?"

Correct! If your website has multiple versions of a page for different languages or regions, we can also indicate that through our code. Here are a few cases where this comes in handy:

Fully translated pages. For example, you have both English and Portuguese versions of each page.

Small Regional Variations in a single language. For example, Portuguese-language content targeting both Brazil and Portugal.

The main content is in a single language where only the template gets translated. For example, a forum page with user-generated content that translates only the navigation and footer.

Like the canonical tags, we have different options to indicate multiple language/locale versions. We can use HTML, HTTP Headers, and Sitemap, but we will focus on the first. Here are a few examples:

<!-- Inside your HTML's <head> -->
<link rel="alternate" hreflang="<lang_code>" href="<url_of_the_page>" />
<link rel="alternate" hreflang="pt-BR" href="https://yourwebsite.com/?lang=pt-BR" />
<link rel="alternate" hreflang="en" href="https://en.yourwebsite.com/" />
Guidelines
Each page version must list itself as well as all other language versions. Also, like the canonical tags, the alternate URLs should be absolute, and include the protocol.

An interesting aspect of alternate URLs is that they don’t necessarily need to be in the same domain, but if two pages don’t both point to each other, the tags will be ignored. This happens to prevent random people from creating a tag naming their website’s page as an alternative version of yours.

"What about fallb…"

Fallbacks? That’s easy! You can set x-default as the value to indicate a fallback page for unmatched languages like this:

<link rel="alternate" href="https://yourwebsite.com/country-selector" hreflang="x-default" />
If your website has multiple languages, it is definitely a good idea to remember and add this fallback alongside the other tags on each page.

Conclusion
"So, you’re saying that after implementing everything, my website will guarantee a higher rank in searches, right?"

Although the techniques we discussed can serve to make your website more discoverable, there is no guarantee that it will go from rank 100 all the way up to 10. All we can do is try our best to optimize it as much as possible and hope for the best.

We also have barely scratched the surface of the universe that is SEO, but hopefully, we covered enough to get you started. It is quite a journey to learn about the magic that happens under the hood when you ask Google if the correct spelling is "lose" or "loose".
