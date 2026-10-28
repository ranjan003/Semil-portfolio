#!/usr/bin/env python3
"""Generates the Semil multi-page site into ./web. Run: python3 build.py"""
import os, html

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "web")
FONT = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap">'
THREE = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'
e = html.escape
import re
slug = lambda t: re.sub(r'[^a-z0-9]+','-',t.lower()).strip('-')


def page(path, key, title, desc, body, crumbs=None, three=False, main_artifact=False):
    depth = path.count("/")
    root = "../" * depth
    attrs = f'data-page="{key}" data-root="{root}"' + (f" data-crumbs='{crumbs}'" if crumbs else "")
    clean_path = "" if path in ("index.html", "") else (path[:-5] if path.endswith(".html") else path)
    page_url = f"https://semil.in/{clean_path}" if clean_path else "https://semil.in/"
    canonical = f'<link rel="canonical" href="{page_url}">'
    meta_seo = (
        f'<meta name="google-site-verification" content="YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE">\n'
        f'<meta name="title" content="{e(title)} | Semil">\n'
        f'<meta name="keywords" content="Semil Retail Industries, digital commerce, multi-vendor marketplace, food delivery, logistics services, matchmaking platform, fintech, retail ecosystem">\n'
        f'<meta name="author" content="Semil Retail Industries Private Limited">\n'
        f'<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">\n'
        f'<meta name="theme-color" content="#315EFB">\n'
        f'<meta property="og:type" content="website">\n'
        f'<meta property="og:site_name" content="Semil Retail Industries">\n'
        f'<meta property="og:url" content="{page_url}">\n'
        f'<meta property="og:image" content="https://semil.in/og-image.png">\n'
        f'<meta property="og:image:width" content="1200">\n'
        f'<meta property="og:image:height" content="630">\n'
        f'<meta property="og:image:alt" content="{e(title)} - Semil Retail Industries">\n'
        f'<meta property="og:locale" content="en_IN">\n'
        f'<meta name="twitter:card" content="summary_large_image">\n'
        f'<meta name="twitter:title" content="{e(title)} | Semil">\n'
        f'<meta name="twitter:description" content="{e(desc)}">\n'
        f'<meta name="twitter:image" content="https://semil.in/og-image.png">\n'
        f'<meta name="twitter:image:alt" content="{e(title)} - Semil Retail Industries">\n'
        f'{canonical}'
    )
    schema_ld = f"""<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@graph": [
    {{
      "@type": "Organization",
      "@id": "https://semil.in/#organization",
      "name": "Semil Retail Industries Private Limited",
      "alternateName": "Semil",
      "url": "https://semil.in",
      "email": "admin@semilindustries.com",
      "logo": "https://semil.in/logo.png",
      "description": "Building a diverse ecosystem of businesses across digital commerce, food delivery, matchmaking, logistics and financial technology.",
      "address": {{
        "@type": "PostalAddress",
        "streetAddress": "101/57 A, Kalidhasar Street, Narayanan Nagar",
        "addressLocality": "Salem",
        "addressRegion": "Tamil Nadu",
        "postalCode": "636015",
        "addressCountry": "IN"
      }},
      "identifier": {{
        "@type": "PropertyValue",
        "name": "CIN",
        "value": "U47912TZ2025PTC035227"
      }}
    }},
    {{
      "@type": "WebApplication",
      "@id": "https://semil.in/#webapp",
      "name": "Semil Portal & Ecosystem Platform",
      "url": "https://semil.in",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All modern browsers",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "description": "Multi-business corporate portfolio and interactive portal featuring business discovery, logistics route exploration, payment gateway flow concepts, and Semil AI assistant.",
      "offers": {{
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      }},
      "provider": {{
        "@id": "https://semil.in/#organization"
      }}
    }},
    {{
      "@type": "WebSite",
      "@id": "https://semil.in/#website",
      "url": "https://semil.in",
      "name": "Semil Retail Industries",
      "publisher": {{
        "@id": "https://semil.in/#organization"
      }}
    }}
  ]
}}
</script>"""
    head = f'<title>{e(title)} | Semil</title>\n<meta name="description" content="{e(desc)}">\n<meta property="og:title" content="{e(title)} | Semil">\n<meta property="og:description" content="{e(desc)}">\n{meta_seo}\n{schema_ld}\n{FONT}\n<link rel="stylesheet" href="{root}site.css"><link rel="stylesheet" href="{root}ai.css">'
    scripts = f'<script type="module" src="{root}firebase-init.js"></script>\n<script src="{root}site.js"></script><script src="{root}fx.js"></script><script src="{root}games.js"></script><script src="{root}ai.js"></script>'
    if main_artifact:
        # variant for hosts that wrap the page in their own skeleton (published preview)
        pre = f"<script>document.body.dataset.page='{key}';document.body.dataset.root='{root}';</script>"
        open(os.path.join(OUT, "_wrapped_index.html"), "w", encoding="utf-8").write(f"{head}\n{pre}\n<main>{body}</main>\n{scripts}\n")
    if True:
        out = (f'<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n{head}\n'
               f'<style>html{{background:#fff}}body{{margin:0}}</style></head>\n<body {attrs}>\n<main>{body}</main>\n{scripts}\n</body></html>\n')
    full = os.path.join(OUT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, "w", encoding="utf-8").write(out)


def hero(eyebrow, h1, lede, extra="", crumbs=True):
    return f'''<section class="hero" style="min-height:auto;padding-block:150px 70px"><div class="mesh"><div class="blob" style="width:340px;height:340px;background:#BFD3FF;right:8%;top:10%"></div><div class="blob" style="width:300px;height:300px;background:#DCCBFF;left:2%;top:30%;animation-delay:-5s"></div></div>
<div class="wrap" style="display:block">{'<div data-mount="crumbs"></div>' if crumbs else ''}<p class="eyebrow">{e(eyebrow)}</p><h1 class="xl split" style="margin-top:20px;font-size:clamp(40px,7vw,100px)">{h1}</h1><p class="lede">{e(lede)}</p>{extra}</div></section>'''


CTA = '''<section class="sec"><div class="wrap"><div class="formcard rv" style="text-align:center;background:linear-gradient(135deg,#F3F6FF,#F6F1FF)"><h2 class="lg" style="font-size:clamp(30px,4.4vw,60px)">Have an idea, a product or a partnership in mind?</h2><p class="lede" style="margin-inline:auto">Tell us what you are building. We read every enquiry.</p><p style="margin-top:28px"><a class="btn primary" href="{r}contact.html">Let's Connect <span class="ar">→</span></a></p></div></div></section>'''

# ---------------- HOME ----------------
home = f'''<section class="hero"><div class="mesh"><div class="blob" style="width:420px;height:420px;background:#BFD3FF;right:6%;top:6%"></div><div class="blob" style="width:340px;height:340px;background:#DCCBFF;left:-4%;top:40%;animation-delay:-6s"></div></div>
<div class="wrap"><div><p class="eyebrow">Semil Retail Industries Private Limited</p>
<h1 class="xl split" style="margin-top:22px">Building Today for a <span class="grad">Brighter Tomorrow.</span></h1>
<p class="sub">Semil Retail Industries Private Limited is building a diverse ecosystem of businesses designed to create opportunities, solve real problems and deliver lasting value.</p>
<div class="cta"><a class="btn primary mag" href="businesses.html">Explore Our Businesses <span class="ar">→</span></a><a class="btn mag" href="about.html">Discover Semil</a><a class="btn mag" href="play.html">Play the brain games</a><button class="btn mag" type="button" data-ai="1">Ask Semil AI</button></div></div>
<div class="stagebox" id="stage"><div data-mount="heroscene"></div></div></div></section>
<div data-mount="marquee"></div>
<section class="sec"><div class="wrap"><div data-mount="stats"></div></div></section>
<section class="sec alt" id="ecosystem"><div class="wrap"><p class="eyebrow rv">The Semil ecosystem</p><h2 class="lg rv split" style="margin-top:18px">One company. <span class="grad">Many possibilities.</span></h2>
<p class="lede rv">Semil sits at the centre of a growing portfolio. Hover a business to see how it connects, or select one to open its page.</p>
<div class="eco" data-mount="eco"></div><div class="rail ecom" data-mount="ecom" style="margin-top:36px"></div>
<p class="note rv" style="margin-top:40px">Business statuses are managed in one place and update across the site as the company confirms them.</p></div></section>
<section class="sec"><div class="wrap"><p class="eyebrow rv">Focus areas</p><h2 class="lg rv split" style="margin-top:18px">Where we are building.</h2><div data-mount="focus" style="margin-top:30px"></div></div></section>
<section class="sec alt"><div class="wrap"><p class="eyebrow rv">Upcoming</p><h2 class="lg rv split" style="margin-top:18px">The next chapter is taking shape.</h2>
<p class="lede rv">New initiatives appear here only after they are confirmed.</p><div class="grid" data-mount="cards" data-only="payments"></div>
<p style="margin-top:28px"><a class="btn" href="upcoming-projects.html">See upcoming projects <span class="ar">→</span></a></p></div></section>
<section class="sec"><div class="wrap"><div class="vm"><div class="rv"><p class="eyebrow">Vision</p><h3>To build sustainable businesses that solve real-world problems, create opportunities and deliver lasting value.</h3></div><div class="rv"><p class="eyebrow">Mission</p><h3>To turn promising ideas into meaningful services through innovation, customer focus and responsible execution.</h3></div></div>
<p style="margin-top:36px"><a class="btn" href="about.html">About Semil <span class="ar">→</span></a> <a class="btn" href="leadership.html">Meet our leadership</a> <a class="btn" href="company.html">Company details</a></p></div></section>
<section class="sec alt"><div class="wrap"><p class="eyebrow rv">Play</p><h2 class="lg rv split" style="margin-top:18px">A brain game for every business.</h2><p class="lede rv">Five short games, each inspired by one Semil business. Best scores stay in your own browser.</p><p style="margin-top:24px"><a class="btn primary mag" href="play.html">Open the game hub <span class="ar">→</span></a></p></div></section>
{CTA.format(r="")}'''
page("index.html", "home", "Semil Retail Industries", "Semil Retail Industries Private Limited is building a diverse ecosystem of businesses across digital commerce, food delivery, matchmaking, logistics and technology.", home, main_artifact=True)

# ---------------- ABOUT ----------------
about = hero("About Semil", "More than a company. A <span class='grad'>vision in motion.</span>", "Semil is building a diversified portfolio of businesses with an entrepreneurial mindset, starting from services that answer real needs.") + f'''
<section class="sec"><div class="wrap"><p class="eyebrow rv">Company overview</p><h2 class="lg rv" style="margin-top:18px">An idea, growing into an ecosystem.</h2>
<p class="lede rv">Semil Retail Industries Private Limited is an Indian private limited company working across digital commerce, food delivery, matchmaking, logistics and planned financial technology initiatives. Semil is the parent identity; each business has its own character.</p>
<div class="cols3"><div class="tile"><h4>Business philosophy</h4><ul><li>Innovation</li><li>Customer-focused thinking</li><li>Responsible execution</li></ul></div><div class="tile"><h4>How we grow</h4><ul><li>Sustainable growth</li><li>Long-term value creation</li><li>Services that address real needs</li></ul></div><div class="tile"><h4>What we share</h4><p class="slate">We do not publish revenue, customer numbers or achievements here. This site only states what the company has confirmed.</p></div></div></div></section>
<section class="sec"><div class="wrap"><p class="eyebrow rv">How the ecosystem grows</p><div data-mount="evo"></div></div></section>
<section class="sec alt"><div class="wrap"><p class="eyebrow rv">Vision and mission</p><div class="vm"><div class="rv"><p class="eyebrow" style="color:var(--lav)">Vision</p><h3>To build sustainable businesses that solve real-world problems, create opportunities and deliver lasting value.</h3></div><div class="rv"><p class="eyebrow" style="color:var(--lav)">Mission</p><h3>To turn promising ideas into meaningful services through innovation, customer focus and responsible execution.</h3></div></div></div></section>
<section class="sec"><div class="wrap"><p class="eyebrow rv">Core values</p><h2 class="lg rv" style="margin-top:18px">What guides us.</h2><div data-mount="values"></div></div></section>
<section class="sec alt"><div class="wrap"><p class="eyebrow rv">Company timeline</p><h2 class="lg rv" style="margin-top:18px">Milestones, as they are confirmed.</h2><p class="lede rv">Only events supported by company records are published. Select an entry to expand it.</p><div data-mount="timeline"></div></div></section>
<section class="sec"><div class="wrap"><p class="eyebrow rv">Corporate identity</p><h2 class="lg rv" style="margin-top:18px">Registered details.</h2><dl class="kv" data-mount="corp"></dl></div></section>
{CTA.format(r="")}'''
page("about.html", "about", "About Semil", "Company overview, philosophy, vision, mission, values and timeline of Semil Retail Industries Private Limited.", about, crumbs='[["About","about.html"]]')

# ---------------- LEADERSHIP ----------------
lead = hero("Leadership", "The people <span class='grad'>behind the vision.</span>", "Semil is led by its directors. Details are added here only once they are verified or supplied by the company.") + '''
<section class="sec" style="padding-top:0"><div class="wrap"><div data-mount="people"></div>
<p class="note" style="margin-top:36px">Titles are confirmed against official company records before being treated as final. Portraits and biographies are published only when supplied and approved. No personal contact details are shown.</p></div></section>''' + CTA.format(r="")
page("leadership.html", "leadership", "Leadership", "The directors of Semil Retail Industries Private Limited.", lead, crumbs='[["Leadership","leadership.html"]]')

# ---------------- BUSINESSES INDEX ----------------
biz_index = hero("Businesses", "Discover the Semil <span class='grad'>ecosystem.</span>", "Four businesses and one proposed initiative, each with its own identity. Filter by category and open any card to learn more.") + '''
<section class="sec" style="padding-top:0"><div class="wrap"><div data-mount="browse"></div><p class="note" style="margin-top:40px">Statuses come from one central list and are updated only after the company confirms them.</p></div></section>''' + CTA.format(r="")
page("businesses.html", "businesses", "Businesses", "Explore Neutags, Semil Food Delivery, Semil Matrimony, Semil Logistical Services and upcoming ventures.", biz_index, crumbs='[["Businesses","businesses.html"]]')

# ---------------- BUSINESS DETAIL (rendered by site.js from SEMIL.detail) ----------------
def bizpage(path, key, bid, name, trail, root="../"):
    body = f'<div data-mount="bizpage" data-id="{bid}"></div>' + CTA.format(r=root)
    page(path, key, name, f"{name} by Semil Retail Industries Private Limited.", body, crumbs=trail)
bizpage("businesses/neutags.html","business-neutags","neutags","Neutags",'[["Businesses","businesses.html"],["Neutags","businesses/neutags.html"]]')
bizpage("businesses/food-delivery.html","business-food","food","Semil Food Delivery",'[["Businesses","businesses.html"],["Semil Food Delivery","businesses/food-delivery.html"]]')
bizpage("businesses/matrimony.html","business-matrimony","matrimony","Semil Matrimony",'[["Businesses","businesses.html"],["Semil Matrimony","businesses/matrimony.html"]]')
bizpage("businesses/logistics.html","business-logistics","logistics","Semil Logistical Services",'[["Businesses","businesses.html"],["Semil Logistical Services","businesses/logistics.html"]]')

# ---------------- COMPANY ----------------
comp = hero("Company details", "Everything we can <span class='grad'>state, in one place.</span>", "Registered details, directors, businesses and projects.") + """
<section class="sec" style="padding-top:0"><div class="wrap"><p class="eyebrow rv">Registered details</p><dl class="kv" data-mount="corp"></dl></div></section>
<section class="sec alt"><div class="wrap"><p class="eyebrow rv">Directors</p><div data-mount="people"></div></div></section>
<section class="sec"><div class="wrap"><p class="eyebrow rv">Businesses and projects</p><div data-mount="focus" style="margin-top:20px"></div></div></section>
<section class="sec alt"><div class="wrap"><p class="eyebrow rv">Timeline</p><div data-mount="timeline"></div></div></section>""" + CTA.format(r="")
page("company.html","company","Company details","Registered details, directors, businesses and projects of Semil Retail Industries Private Limited.",comp,crumbs='[["Company details","company.html"]]')

# ---------------- PLAY ----------------
play = hero("Play", "A brain game for <span class='grad'>every business.</span>", "Five short games, one for each Semil business. Pure fun: no data is sent anywhere, and best scores are kept only in your browser.") + '<section class="sec" style="padding-top:0"><div class="wrap"><div data-mount="playhub"></div></div></section>' + CTA.format(r="")
page("play.html","play","Play","Brain games inspired by each Semil business.",play,crumbs='[["Play","play.html"]]')

# ---------------- UPCOMING ----------------
up = hero("Upcoming projects", "The next chapter is <span class='grad'>taking shape.</span>", "Direction, not announcement. Each initiative carries its status and moves only when the company confirms it.") + '''
<section class="sec" style="padding-top:0"><div class="wrap"><p class="eyebrow rv">Roadmap</p><h2 class="lg rv" style="margin-top:18px;font-size:clamp(30px,4.6vw,64px)">From planning to launch.</h2>
<p class="lede rv">Select a stage to see what sits in it. Statuses available: <span data-mount="statuses"></span></p><div data-mount="roadmap" style="margin-top:20px"></div></div></section>
<section class="sec alt"><div class="wrap"><p class="eyebrow rv">Featured project</p><div class="grid" data-mount="cards" data-only="payments"></div></div></section>
<section class="sec"><div class="wrap"><p class="eyebrow rv">Future ventures</p><h2 class="lg rv" style="margin-top:18px;font-size:clamp(30px,4.6vw,64px)">More possibilities ahead.</h2>
<p class="lede rv">We continue to explore opportunities to build useful businesses, create meaningful services and expand the Semil ecosystem.</p><div class="cols3" data-mount="future"></div>
<p class="note" style="margin-top:28px">No additional ventures have been announced. This area grows as projects are approved.</p></div></section>''' + CTA.format(r="")
page("upcoming-projects.html", "upcoming", "Upcoming Projects", "The roadmap and future ventures of Semil Retail Industries Private Limited.", up, crumbs='[["Upcoming Projects","upcoming-projects.html"]]')

pg = '<div data-mount="bizpage" data-id="payments"></div>' + CTA.format(r="../")
page("upcoming-projects/payment-gateway.html", "upcoming-payments", "Semil Payment Gateway", "A proposed fintech initiative by Semil, subject to regulatory requirements, approvals and partnerships.", pg, crumbs='[["Upcoming Projects","upcoming-projects.html"],["Semil Payment Gateway","upcoming-projects/payment-gateway.html"]]')

# ---------------- CAREERS ----------------
FORM_HP = '<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">'
careers = hero("Careers", "Build with <span class='grad'>us.</span>", "Semil is interested in people who want to build meaningful businesses. We list only roles that are confirmed.") + f'''
<section class="sec" style="padding-top:0"><div class="wrap"><div class="cols3"><div class="tile"><h4>Company culture</h4><p>Entrepreneurial, customer-focused and responsible. We value honesty, accountability and continuous learning.</p></div><div class="tile"><h4>Why work with Semil</h4><ul><li>Help shape a company in its early years</li><li>Work across a growing portfolio of businesses</li><li>Build services that address real needs</li></ul></div><div class="tile"><h4>How we hire</h4><p>Roles are published here only after approval. You can also introduce yourself with the form below.</p></div></div>
<h2 class="lg" style="margin-top:80px;font-size:clamp(30px,4.6vw,64px)">Current openings</h2><div data-mount="openings"></div></div></section>
<section class="sec alt" id="apply"><div class="wrap"><div class="contactgrid"><div><p class="eyebrow">Apply or introduce yourself</p><h2 class="lg" style="margin-top:18px;font-size:clamp(30px,4.2vw,56px)">Tell us what you would like to build.</h2><p class="lede">Share a short introduction and a link to your work or profile.</p></div>
<div class="formcard"><form data-form="careers" novalidate><div class="two"><div class="f"><label for="a-name">Full name</label><input id="a-name" name="name" autocomplete="name" required maxlength="80"><div class="err"></div></div><div class="f"><label for="a-email">Email</label><input id="a-email" name="email" type="email" autocomplete="email" required maxlength="120"><div class="err"></div></div></div>
<div class="f"><label for="a-role">Role or area of interest</label><input id="a-role" name="role" maxlength="100"><div class="err"></div></div><div class="f"><label for="a-link">Link to your work or profile (optional)</label><input id="a-link" name="link" type="url" maxlength="200"><div class="err"></div></div>
<div class="f"><label for="a-msg">About you</label><textarea id="a-msg" name="message" required maxlength="1500"></textarea><div class="err"></div></div>{FORM_HP}<div class="fstat" role="status" aria-live="polite"></div>
<button class="btn primary" type="submit" style="justify-self:start">Send application <span class="spin2"></span></button></form></div></div></div></section>'''
page("careers.html", "careers", "Careers", "Build with Semil. Confirmed openings and an application form.", careers, crumbs='[["Careers","careers.html"]]')

# ---------------- CONTACT ----------------
contact = hero("Contact and partnerships", "Let's <span class='grad'>connect.</span>", "Businesses, sellers, restaurants, logistics providers, technology providers and prospective partners are welcome to start a conversation.") + f'''
<section class="sec" style="padding-top:0"><div class="wrap"><div class="contactgrid"><div><p class="eyebrow">Enquiry type</p><div class="cats">{''.join(f'<button type="button" data-cat="{c}" aria-pressed="false">{c}<span>→</span></button>' for c in ["General corporate enquiry","Business partnership","Technology partnership","Seller or merchant enquiry","Careers","Other enquiries"])}</div>
<div style="margin-top:36px"><p class="eyebrow">Registered office</p><dl class="kv" data-mount="corp"></dl><p class="slate" style="margin-top:14px;font-size:14px">Official email: <a href="mailto:admin@semilindustries.com" style="color:var(--cobalt);font-weight:600">admin@semilindustries.com</a></p></div></div>
<div class="formcard"><form data-form="contact" novalidate><div class="two"><div class="f"><label for="f-name">Name</label><input id="f-name" name="name" autocomplete="name" required maxlength="80"><div class="err"></div></div><div class="f"><label for="f-email">Work email</label><input id="f-email" name="email" type="email" autocomplete="email" required maxlength="120"><div class="err"></div></div></div>
<div class="two"><div class="f"><label for="f-org">Company (optional)</label><input id="f-org" name="org" autocomplete="organization" maxlength="120"><div class="err"></div></div><div class="f"><label for="f-cat">Enquiry type</label><select id="f-cat" name="category" required><option value="">Select a type</option><option>General corporate enquiry</option><option>Business partnership</option><option>Technology partnership</option><option>Seller or merchant enquiry</option><option>Careers</option><option>Other enquiries</option></select><div class="err"></div></div></div>
<div class="f"><label for="f-msg">Message</label><textarea id="f-msg" name="message" required maxlength="1500"></textarea><div class="err"></div></div>{FORM_HP}<div class="fstat" role="status" aria-live="polite"></div>
<button class="btn primary" type="submit" style="justify-self:start">Send message <span class="spin2"></span></button></form></div></div></div></section>'''
page("contact.html", "contact", "Contact", "Contact Semil for corporate, partnership, seller, technology and careers enquiries.", contact, crumbs='[["Contact","contact.html"]]')

# ---------------- LEGAL ----------------
def legal(path, key, title, paras):
    b = hero("Legal", e(title), "Draft text. It must be reviewed by the company's legal adviser before launch.") + '<section class="sec" style="padding-top:0"><div class="wrap legal">' + "".join(f"<h2>{e(h)}</h2><p>{e(p)}</p>" for h, p in paras) + "</div></section>"
    page(path, key, title, title + " of Semil Retail Industries Private Limited.", b, crumbs=f'[["{e(title)}","{path}"]]')

legal("privacy.html", "privacy", "Privacy policy", [
    ("What we collect", "Only what you enter in our enquiry and application forms, such as your name, email address, organisation and message."),
    ("How we use it", "To respond to your enquiry or application. We do not sell visitor data."),
    ("Who sees it", "Our team and service providers who help run this website and handle enquiries, and authorities where the law requires."),
    ("Analytics", "Analytics are not enabled. If they are added, this page will say so first.")])
legal("terms.html", "terms", "Terms and conditions", [
    ("About this website", "This website provides general information about Semil Retail Industries Private Limited and its businesses and initiatives."),
    ("Planned initiatives", "Initiatives described as planned, proposed or upcoming have not launched and may change. Nothing here is an offer of financial, payment or matrimonial services."),
    ("External links", "Links to other websites, such as Neutags, are provided for convenience. Those sites have their own terms.")])

# ---------------- 404 (for static hosts; assumes the site is served from the domain root) ----------------
nf = hero("Page not found", "That page <span class='grad'>isn't here.</span>", "The link may be old or mistyped. Try one of these instead.", crumbs=False) + """
<section class="sec" style="padding-top:0"><div class="wrap"><p><a class="btn primary" href="/">Go to the home page</a> <a class="btn" href="/businesses.html">Businesses</a> <a class="btn" href="/company.html">Company details</a> <a class="btn" href="/contact.html">Contact</a></p></div></section>"""
page("404.html", "notfound", "Page not found", "Page not found.", nf)
_p = os.path.join(OUT, "404.html"); _t = open(_p, encoding="utf-8").read()
_t = _t.replace('data-root=""', 'data-root="/"').replace('href="site.css"', 'href="/site.css"').replace('href="ai.css"', 'href="/ai.css"')
for _j in ("site", "fx", "games", "ai", "firebase-init"): _t = _t.replace(f'src="{_j}.js"', f'src="/{_j}.js"')
open(_p, "w", encoding="utf-8").write(_t)

print("built", sum(len(f) for _, _, f in os.walk(OUT)), "files")
