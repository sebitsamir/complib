import { def, wrapRoot, type CatalogComponentDef } from "@/lib/catalog/shared";

export const COMMERCE: CatalogComponentDef[] = [
  def({
    slug: "template-ecommerce",
    name: "E-commerce Store",
    layer: "templates",
    category: "commerce",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Online store layout with category nav, hero promo, product grid, and newsletter CTA.",
    html: wrapRoot(`
  <div class="cl-page t-shop">
    <header class="cl-page__bar">
      <span class="cl-page__brand">Atelier Home</span>
      <nav class="cl-page__nav" aria-label="Shop">
        <a href="#">New arrivals</a>
        <a href="#">Furniture</a>
        <a href="#">Lighting</a>
        <a href="#">Sale</a>
      </nav>
      <div class="t-shop__bar-actions">
        <button type="button" class="cl-btn cl-btn--ghost">Search</button>
        <button type="button" class="cl-btn cl-btn--secondary">Cart (2)</button>
      </div>
    </header>
    <div class="cl-page__body">
      <section class="t-shop__hero">
        <div class="t-shop__hero-copy">
          <span class="cl-kicker">Summer collection</span>
          <h1 class="t-shop__title">Curated pieces for modern living</h1>
          <p class="cl-muted">Handcrafted furniture and lighting with free shipping on orders over $150.</p>
          <button type="button" class="cl-btn cl-btn--primary">Shop collection</button>
        </div>
        <div class="t-shop__hero-media" role="img" aria-label="Living room showcase"></div>
      </section>
      <section class="t-shop__products">
        <h2 class="cl-section__title">Bestsellers</h2>
        <div class="cl-grid-3">
          <article class="t-shop__product">
            <div class="t-shop__product-img"></div>
            <div class="t-shop__product-body">
              <h3>Oak lounge chair</h3>
              <p class="cl-muted">Solid oak · Linen upholstery</p>
              <div class="t-shop__price-row">
                <span class="t-shop__price">$489</span>
                <button type="button" class="cl-btn cl-btn--primary">Add to cart</button>
              </div>
            </div>
          </article>
          <article class="t-shop__product">
            <div class="t-shop__product-img"></div>
            <div class="t-shop__product-body">
              <h3>Arc floor lamp</h3>
              <p class="cl-muted">Brushed brass · Dimmable LED</p>
              <div class="t-shop__price-row">
                <span class="t-shop__price">$219</span>
                <button type="button" class="cl-btn cl-btn--primary">Add to cart</button>
              </div>
            </div>
          </article>
          <article class="t-shop__product">
            <div class="t-shop__product-img"></div>
            <div class="t-shop__product-body">
              <h3>Ceramic vase set</h3>
              <p class="cl-muted">Set of 3 · Matte glaze</p>
              <div class="t-shop__price-row">
                <span class="t-shop__price">$64</span>
                <button type="button" class="cl-btn cl-btn--primary">Add to cart</button>
              </div>
            </div>
          </article>
        </div>
      </section>
      <section class="t-shop__newsletter cl-card">
        <h2 class="cl-section__title" style="font-size:1.2rem;margin:0 0 8px">Get 10% off your first order</h2>
        <p class="cl-muted" style="margin:0 0 16px">Join our list for early access to new drops and exclusive offers.</p>
        <form class="t-shop__form" onsubmit="return false">
          <input type="email" class="cl-input" placeholder="Email address" aria-label="Email" />
          <button type="submit" class="cl-btn cl-btn--primary">Subscribe</button>
        </form>
      </section>
    </div>
  </div>`),
    css: `
.t-shop__bar-actions{display:flex;gap:8px}
.t-shop__hero{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center;margin-bottom:40px}
.t-shop__title{margin:10px 0 12px;font-size:clamp(1.5rem,2.6vw,2rem);letter-spacing:-.03em;line-height:1.15}
.t-shop__hero-media{height:240px;border-radius:var(--cl-radius);background:linear-gradient(145deg,color-mix(in srgb,var(--cl-primary) 10%,#fff),var(--cl-surface-muted));border:1px solid var(--cl-border)}
.t-shop__products{margin-bottom:32px}
.t-shop__product{background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);overflow:hidden}
.t-shop__product-img{height:140px;background:linear-gradient(180deg,var(--cl-surface-muted),color-mix(in srgb,var(--cl-primary) 6%,var(--cl-surface)))}
.t-shop__product-body{padding:16px;display:flex;flex-direction:column;gap:6px}
.t-shop__product h3{margin:0;font-size:1rem}
.t-shop__price-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:8px}
.t-shop__price{font-size:1.15rem;font-weight:800}
.t-shop__form{display:flex;gap:10px}
.t-shop__form .cl-input{flex:1}
@media(max-width:640px){.t-shop__hero{grid-template-columns:1fr}}`,
  }),

  def({
    slug: "template-marketplace",
    name: "Marketplace",
    layer: "templates",
    category: "commerce",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Multi-vendor marketplace with search bar, category filters, listing cards, and seller CTA.",
    html: wrapRoot(`
  <div class="cl-page t-market">
    <header class="cl-page__bar">
      <span class="cl-page__brand">TradeHive</span>
      <nav class="cl-page__nav" aria-label="Marketplace">
        <a href="#">Browse</a>
        <a href="#">Categories</a>
        <a href="#">Sellers</a>
        <a href="#">How it works</a>
      </nav>
      <button type="button" class="cl-btn cl-btn--primary">List an item</button>
    </header>
    <div class="cl-page__body">
      <section class="t-market__search">
        <h1 class="t-market__title">Find verified suppliers &amp; goods</h1>
        <div class="t-market__search-bar">
          <input type="search" class="cl-input" placeholder="Search products, brands, or sellers…" aria-label="Search marketplace" />
          <button type="button" class="cl-btn cl-btn--primary">Search</button>
        </div>
        <div class="t-market__filters">
          <span class="cl-badge">Electronics</span>
          <span class="cl-badge">Home &amp; garden</span>
          <span class="cl-badge">Industrial</span>
          <span class="cl-badge">Verified sellers</span>
        </div>
      </section>
      <section class="t-market__listings">
        <h2 class="cl-section__title">Featured listings</h2>
        <div class="cl-grid-3">
          <article class="cl-card t-market__listing">
            <div class="t-market__thumb"></div>
            <span class="cl-badge">Verified</span>
            <h3>Industrial servo motors (lot of 50)</h3>
            <p class="cl-muted">Seller: Apex Manufacturing · Ships from Ohio</p>
            <div class="t-market__meta">
              <span class="t-market__price">$4,200</span>
              <button type="button" class="cl-btn cl-btn--secondary">View listing</button>
            </div>
          </article>
          <article class="cl-card t-market__listing">
            <div class="t-market__thumb"></div>
            <span class="cl-badge">Top rated</span>
            <h3>Organic cotton fabric rolls</h3>
            <p class="cl-muted">Seller: GreenThread Co · MOQ 10 rolls</p>
            <div class="t-market__meta">
              <span class="t-market__price">$890/roll</span>
              <button type="button" class="cl-btn cl-btn--secondary">View listing</button>
            </div>
          </article>
          <article class="cl-card t-market__listing">
            <div class="t-market__thumb"></div>
            <span class="cl-badge">New</span>
            <h3>Refurbished MacBook Pro M2</h3>
            <p class="cl-muted">Seller: TechCycle · 12-month warranty</p>
            <div class="t-market__meta">
              <span class="t-market__price">$1,149</span>
              <button type="button" class="cl-btn cl-btn--secondary">View listing</button>
            </div>
          </article>
        </div>
      </section>
      <section class="t-market__seller cl-card">
        <div>
          <h2 class="cl-section__title" style="font-size:1.15rem;margin:0 0 6px;text-align:left">Start selling on TradeHive</h2>
          <p class="cl-muted" style="margin:0">Reach 50,000+ buyers with escrow payments and built-in logistics.</p>
        </div>
        <button type="button" class="cl-btn cl-btn--primary">Become a seller</button>
      </section>
    </div>
  </div>`),
    css: `
.t-market__search{text-align:center;max-width:640px;margin:0 auto 36px}
.t-market__title{margin:0 0 20px;font-size:clamp(1.5rem,2.6vw,2rem);letter-spacing:-.03em}
.t-market__search-bar{display:flex;gap:10px;margin-bottom:16px}
.t-market__search-bar .cl-input{flex:1}
.t-market__filters{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.t-market__listings{margin-bottom:28px}
.t-market__listing{display:flex;flex-direction:column;gap:8px}
.t-market__thumb{height:120px;border-radius:calc(var(--cl-radius)*.8);background:var(--cl-surface-muted);margin:-4px -4px 4px}
.t-market__listing h3{margin:0;font-size:1rem}
.t-market__meta{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:8px}
.t-market__price{font-size:1.1rem;font-weight:800}
.t-market__seller{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;background:color-mix(in srgb,var(--cl-primary) 5%,var(--cl-surface))}`,
  }),
];
