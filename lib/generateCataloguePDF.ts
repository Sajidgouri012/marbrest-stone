import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export type PDFType = 'full' | 'category' | 'shortlist'

export interface PDFProduct {
  id: string
  name: string
  category: string
  description: string
  shortDescription?: string
  images: string[]
  material?: string
  origin?: string
  dimensions?: string
  finish?: string | string[]
  minOrderQty?: string
  leadTime?: string
  exportReady?: boolean
}

const C = {
  gold: '#B8962E',
  charcoal: '#1A1A1A',
  white: '#FFFFFF',
  offWhite: '#F8F5F0',
  gray: '#666666',
  lightGray: '#E8E0D5',
  midGray: '#999999',
}

/* Truncate at last word boundary before maxLen chars */
function truncateAtWord(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  const cut = text.lastIndexOf(' ', maxLen)
  return text.substring(0, cut > 0 ? cut : maxLen) + '…'
}

export async function generateCataloguePDF(
  type: PDFType,
  products: PDFProduct[],
  categoryName?: string,
  onProgress?: (message: string) => void
): Promise<void> {
  onProgress?.('Preparing your catalogue...')

  const container = document.createElement('div')
  container.setAttribute('id', 'pdf-catalogue-container')
  container.style.cssText = `
    position: fixed;
    top: -99999px;
    left: -99999px;
    width: 794px;
    z-index: -9999;
    pointer-events: none;
  `

  container.innerHTML = [
    buildCoverPage(type, categoryName),
    buildAboutPage(),
    ...buildProductPages(products),
    buildContactPage(),
  ].join('')

  document.body.appendChild(container)

  onProgress?.('Loading product images...')
  const images = Array.from(container.querySelectorAll('img'))
  await Promise.allSettled(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) { resolve(); return }
          img.onload = () => resolve()
          img.onerror = () => resolve()
          setTimeout(resolve, 8000)
        })
    )
  )

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })

  const pages = Array.from(container.querySelectorAll('.pdf-page'))

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i] as HTMLElement
    onProgress?.(`Building page ${i + 1} of ${pages.length}...`)

    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: page.getAttribute('data-bg') || '#ffffff',
      logging: false,
      imageTimeout: 10000,
    })

    if (i > 0) pdf.addPage()
    const imgData = canvas.toDataURL('image/jpeg', 0.92)
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297)
  }

  pdf.setProperties({
    title: `Marbrest Stone — ${categoryName || 'Complete'} Catalogue`,
    subject: 'Premium Makrana Marble & Stone Products',
    author: 'Marbrest Stone',
    keywords: 'marble, stone, Makrana, luxury, craftsmanship, India',
    creator: 'Marbrest Stone — marbreststone.com',
  })

  const today = new Date().toISOString().split('T')[0]
  const label = (categoryName || 'Complete_Catalogue').replace(/\s+/g, '_')
  pdf.save(`MarbrestStone_${label}_${today}.pdf`)

  document.body.removeChild(container)
  onProgress?.('Done!')
}

function buildCoverPage(type: PDFType, categoryName?: string): string {
  const subtitle = {
    full: 'Complete Collection',
    category: categoryName || 'Product Collection',
    shortlist: 'Your Custom Selection',
  }[type]

  return `
  <div class="pdf-page" data-bg="${C.charcoal}" style="
    width:794px; height:1123px; background:${C.charcoal};
    display:flex; flex-direction:column;
    padding:64px; box-sizing:border-box; position:relative;
    font-family: Georgia, 'Times New Roman', serif;
  ">
    <div style="width:100%; height:5px; background:${C.gold}; margin-bottom:40px;"></div>

    <!-- Brand name top -->
    <div style="margin-bottom:auto;">
      <div style="font-size:26px; font-weight:700; color:${C.white}; letter-spacing:8px; text-transform:uppercase;">MARBREST STONE</div>
      <div style="font-size:11px; color:${C.gold}; letter-spacing:4px; text-transform:uppercase; margin-top:8px;">Specialists in Marble &amp; Fine Stone Craftsmanship</div>
      <div style="width:48px; height:2px; background:${C.gold}; margin-top:16px;"></div>
    </div>

    <!-- Logo centred on the page -->
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 0;">
      <img
        src="/marbrest_logo.png"
        crossorigin="anonymous"
        alt="Marbrest Stone Logo"
        style="width:320px; height:320px; object-fit:contain; filter:drop-shadow(0 8px 24px rgba(184,150,46,0.35));"
      />
    </div>

    <!-- Title block -->
    <div style="padding:32px 0;">
      <div style="font-size:48px; font-weight:300; color:${C.white}; line-height:1.15; letter-spacing:1px;">PRODUCT<br>CATALOGUE</div>
      <div style="font-size:20px; color:${C.gold}; margin-top:14px; font-style:italic;">${subtitle}</div>
      <div style="width:64px; height:3px; background:${C.gold}; margin-top:20px;"></div>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid rgba(255,255,255,0.15); padding-top:20px; display:flex; justify-content:space-between; align-items:flex-end;">
      <div>
        <div style="color:rgba(255,255,255,0.4); font-size:10px; letter-spacing:3px; text-transform:uppercase; margin-bottom:6px;">FROM THE MINES OF THE TAJ MAHAL</div>
        <div style="color:rgba(255,255,255,0.6); font-size:12px;">Makrana, Rajasthan — 341505, India</div>
      </div>
      <div style="text-align:right;">
        <div style="color:rgba(255,255,255,0.6); font-size:12px; margin-bottom:4px;">www.marbreststone.com</div>
        <div style="color:rgba(255,255,255,0.4); font-size:11px;">${new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
    </div>
  </div>`
}

function buildAboutPage(): string {
  const stats = [
    { num: '600+', label: 'Projects\nCompleted' },
    { num: '30+', label: 'Years of\nHeritage' },
    { num: '50+', label: 'Master\nCraftsmen' },
    { num: '30+', label: 'Countries\nServed' },
  ]

  return `
  <div class="pdf-page" data-bg="${C.white}" style="
    width:794px; height:1123px; background:${C.white};
    padding:64px; box-sizing:border-box;
    font-family: Georgia, 'Times New Roman', serif;
    display:flex; flex-direction:column;
  ">
    ${pdfPageHeader('About Us', 2)}
    <div style="margin-top:32px; margin-bottom:40px;">
      <div style="font-size:28px; font-weight:700; color:${C.charcoal}; margin-bottom:16px; line-height:1.2;">Crafting Excellence<br>Since Generations</div>
      <div style="font-size:13px; color:${C.gray}; line-height:1.8; max-width:580px;">At Marbrest Stone, we source exclusively from the legendary Makrana quarries of Rajasthan — the same mines that supplied marble for the Taj Mahal. With over 30 years of heritage and 50+ master craftsmen, we deliver bespoke marble products to luxury hotels, private residences, sacred spaces, and international buyers across 30+ countries.</div>
    </div>
    <div style="display:flex; gap:0; margin-bottom:48px; border:1px solid ${C.lightGray}; border-radius:8px; overflow:hidden;">
      ${stats
        .map(
          (s, i) => `
        <div style="flex:1; padding:24px 16px; text-align:center; ${i < stats.length - 1 ? `border-right:1px solid ${C.lightGray};` : ''} background:${i % 2 === 0 ? C.white : C.offWhite};">
          <div style="font-size:32px; font-weight:700; color:${C.gold}; line-height:1;">${s.num}</div>
          <div style="font-size:10px; color:${C.gray}; margin-top:8px; letter-spacing:1px; text-transform:uppercase; white-space:pre-line; line-height:1.4;">${s.label}</div>
        </div>`
        )
        .join('')}
    </div>
    <div style="margin-bottom:40px;">
      <div style="font-size:16px; font-weight:700; color:${C.charcoal}; margin-bottom:16px; letter-spacing:1px; text-transform:uppercase;">Why Makrana Marble?</div>
      ${[
        'Unmatched purity — naturally white, minimal veining, exceptional clarity',
        'Extraordinary durability — used in the Taj Mahal for 400+ years',
        'Versatile application — flooring, carvings, facades, sacred spaces',
        'Export-ready — compliant with international shipping and quality standards',
      ]
        .map(
          (point) => `
        <div style="display:flex; gap:12px; margin-bottom:10px; align-items:flex-start;">
          <div style="color:${C.gold}; font-size:14px; flex-shrink:0; margin-top:1px;">✦</div>
          <div style="font-size:13px; color:${C.gray}; line-height:1.6;">${point}</div>
        </div>`
        )
        .join('')}
    </div>
    <div style="margin-top:auto; padding-top:24px; border-top:2px solid ${C.gold}; display:flex; justify-content:space-between; align-items:center;">
      <div style="font-size:11px; color:${C.midGray};">All products fully customizable · Export worldwide · Min order varies by product</div>
      <div style="font-size:11px; color:${C.gold}; font-weight:600;">marbreststone.com</div>
    </div>
  </div>`
}

function buildProductPages(products: PDFProduct[]): string[] {
  const pages: string[] = []
  for (let i = 0; i < products.length; i += 2) {
    pages.push(buildProductPage(products[i], products[i + 1] || null, Math.floor(i / 2) + 3))
  }
  return pages
}

function buildProductPage(p1: PDFProduct, p2: PDFProduct | null, pageNum: number): string {
  return `
  <div class="pdf-page" data-bg="${C.white}" style="
    width:794px; height:1123px; background:${C.white};
    padding:48px; box-sizing:border-box;
    font-family: Georgia, 'Times New Roman', serif;
    display:flex; flex-direction:column;
  ">
    ${pdfPageHeader(p1.category, pageNum)}
    <div style="display:flex; gap:24px; flex:1; margin-top:24px;">
      ${buildPDFProductCard(p1)}
      ${p2 ? buildPDFProductCard(p2) : buildCTASlot()}
    </div>
    ${pdfPageFooter()}
  </div>`
}

/* CTA block shown in the empty right slot on the last page when product count is odd */
function buildCTASlot(): string {
  return `
  <div style="flex:1; display:flex; flex-direction:column; border:1px solid ${C.lightGray}; border-radius:8px; overflow:hidden; background:${C.charcoal};">
    <!-- Gold top bar -->
    <div style="height:6px; background:${C.gold};"></div>

    <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 32px; text-align:center;">
      <!-- Logo -->
      <img
        src="/marbrest_logo.png"
        crossorigin="anonymous"
        alt="Marbrest Stone"
        style="width:160px; height:160px; object-fit:contain; margin-bottom:32px; filter:drop-shadow(0 4px 12px rgba(184,150,46,0.4));"
      />

      <div style="font-size:11px; color:${C.gold}; letter-spacing:4px; text-transform:uppercase; margin-bottom:12px;">BESPOKE CREATIONS</div>
      <div style="font-size:22px; font-weight:300; color:${C.white}; line-height:1.4; margin-bottom:20px;">Can't Find<br>What You Need?</div>
      <div style="width:40px; height:2px; background:${C.gold}; margin-bottom:20px;"></div>
      <div style="font-size:12px; color:rgba(255,255,255,0.65); line-height:1.8; max-width:240px; margin-bottom:32px;">
        Every piece is fully customizable. Share your vision — dimensions, finish, pattern, stone type — and our master craftsmen will bring it to life.
      </div>

      <div style="background:${C.gold}; padding:12px 28px; margin-bottom:24px;">
        <div style="font-size:11px; font-weight:700; color:${C.white}; letter-spacing:2px; text-transform:uppercase;">REQUEST A QUOTE</div>
      </div>

      <div style="font-size:11px; color:${C.gold}; margin-bottom:6px;">info@marbreststone.com</div>
      <div style="font-size:11px; color:rgba(255,255,255,0.5);">+91 80004 85312</div>
    </div>

    <div style="padding:16px 24px; border-top:1px solid rgba(255,255,255,0.1); text-align:center;">
      <div style="font-size:10px; color:rgba(255,255,255,0.35); letter-spacing:2px; text-transform:uppercase;">www.marbreststone.com</div>
    </div>
  </div>`
}

function buildPDFProductCard(p: PDFProduct): string {
  const finishList = Array.isArray(p.finish)
    ? p.finish.join(', ')
    : p.finish || null

  const specs: [string, string | undefined | null][] = [
    ['Origin', p.origin],
    ['Dimensions', p.dimensions],
    ['Finish', finishList],
    ['Min. Order', p.minOrderQty],
    ['Lead Time', p.leadTime],
    ['Export', p.exportReady ? '✓ Export Ready' : null],
  ]

  const visibleSpecs = specs.filter(([, v]) => v)
  const description = truncateAtWord(p.shortDescription || p.description || '', 320)

  return `
  <div style="flex:1; display:flex; flex-direction:column; border:1px solid ${C.lightGray}; border-radius:8px; overflow:hidden;">
    <!-- Product image with logo watermark -->
    <div style="height:360px; overflow:hidden; background:${C.lightGray}; flex-shrink:0; position:relative;">
      <img
        src="${p.images?.[0] || ''}"
        alt="${p.name}"
        crossorigin="anonymous"
        style="width:100%; height:100%; object-fit:cover; display:block;"
      />
      <!-- Centred logo watermark on the photo -->
      <div style="
        position:absolute; inset:0;
        display:flex; align-items:center; justify-content:center;
        pointer-events:none;
      ">
        <img
          src="/marbrest_logo.png"
          crossorigin="anonymous"
          alt=""
          style="width:72px; height:72px; object-fit:contain; opacity:0.45; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));"
        />
      </div>
    </div>

    <!-- Category label -->
    <div style="background:${C.gold}; padding:6px 16px;">
      <span style="font-size:9px; color:${C.white}; letter-spacing:2px; text-transform:uppercase; font-weight:700;">${p.category}</span>
    </div>

    <!-- Card body -->
    <div style="padding:20px; flex:1; display:flex; flex-direction:column; gap:10px;">
      <div style="font-size:17px; font-weight:700; color:${C.charcoal}; line-height:1.3;">${p.name}</div>
      <div style="font-size:11px; color:${C.midGray}; letter-spacing:0.5px;">${p.material || 'Makrana White Marble'}</div>
      <div style="height:1px; background:${C.lightGray};"></div>

      ${visibleSpecs.length > 0 ? `
      <div style="display:flex; flex-direction:column; gap:5px;">
        ${visibleSpecs.map(([label, val]) => `
          <div style="display:flex; gap:8px; font-size:11px; line-height:1.6;">
            <span style="color:${C.midGray}; min-width:72px; flex-shrink:0;">${label}:</span>
            <span style="color:${C.charcoal}; font-weight:600;">${val}</span>
          </div>`).join('')}
      </div>
      <div style="height:1px; background:${C.lightGray};"></div>
      ` : ''}

      <div style="font-size:11px; color:${C.gray}; line-height:1.75; flex:1; overflow:hidden;">
        ${description}
      </div>

      <div style="margin-top:auto; padding-top:12px; border-top:1px solid ${C.lightGray}; font-size:10px; color:${C.midGray}; line-height:1.7;">
        ✉ info@marbreststone.com &nbsp;&nbsp; ✆ +91 80004 85312<br>
        🌐 www.marbreststone.com
      </div>
    </div>
  </div>`
}

function buildContactPage(): string {
  const steps = [
    ['01', 'Browse & Select', 'Choose products from our catalogue'],
    ['02', 'Share Your Vision', 'Tell us dimensions, finish, and quantity'],
    ['03', 'Custom Quote', 'We send a detailed quote within 24hrs'],
    ['04', 'Production', 'Master craftsmen craft your order'],
    ['05', 'Quality Check', 'Rigorous inspection before dispatch'],
    ['06', 'Global Delivery', 'Packed and shipped to your door'],
  ]

  return `
  <div class="pdf-page" data-bg="${C.charcoal}" style="
    width:794px; height:1123px; background:${C.charcoal};
    padding:64px; box-sizing:border-box;
    font-family: Georgia, 'Times New Roman', serif;
    display:flex; flex-direction:column;
  ">
    <div style="margin-bottom:48px;">
      <div style="font-size:11px; color:${C.gold}; letter-spacing:4px; text-transform:uppercase; margin-bottom:12px;">GET IN TOUCH</div>
      <div style="font-size:36px; font-weight:300; color:${C.white}; line-height:1.2;">Ready to Start<br>Your Project?</div>
      <div style="width:48px; height:3px; background:${C.gold}; margin-top:20px;"></div>
    </div>
    <div style="margin-bottom:48px;">
      <div style="font-size:13px; color:${C.gold}; letter-spacing:3px; text-transform:uppercase; margin-bottom:20px;">HOW TO ORDER</div>
      <div style="display:flex; flex-wrap:wrap; gap:16px;">
        ${steps
          .map(
            ([num, title, desc]) => `
          <div style="flex: 0 0 calc(33% - 8px); background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:6px; padding:16px;">
            <div style="font-size:20px; font-weight:700; color:${C.gold}; margin-bottom:6px;">${num}</div>
            <div style="font-size:12px; font-weight:700; color:${C.white}; margin-bottom:4px;">${title}</div>
            <div style="font-size:11px; color:rgba(255,255,255,0.5); line-height:1.5;">${desc}</div>
          </div>`
          )
          .join('')}
      </div>
    </div>
    <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end;">
      <div style="background:rgba(184,150,46,0.15); border:1px solid rgba(184,150,46,0.3); border-radius:8px; padding:32px; display:flex; gap:48px;">
        <div>
          <div style="font-size:11px; color:${C.gold}; letter-spacing:3px; text-transform:uppercase; margin-bottom:16px;">CONTACT</div>
          ${[['✉', 'info@marbreststone.com'], ['✆', '+91 80004 85312'], ['💬', 'WhatsApp: +91 80004 85312'], ['🌐', 'www.marbreststone.com']]
            .map(
              ([icon, val]) => `
            <div style="font-size:12px; color:${C.white}; margin-bottom:8px; display:flex; gap:10px;">
              <span style="color:${C.gold};">${icon}</span><span>${val}</span>
            </div>`
            )
            .join('')}
        </div>
        <div>
          <div style="font-size:11px; color:${C.gold}; letter-spacing:3px; text-transform:uppercase; margin-bottom:16px;">ADDRESS</div>
          <div style="font-size:12px; color:${C.white}; line-height:1.8;">
            Marbrest Stone<br>Makrana, Rajasthan<br>341505, India<br><br>
            <span style="color:rgba(255,255,255,0.5);">Mon–Fri: 9:00 AM – 6:00 PM IST<br>International Inquiries Welcome</span>
          </div>
        </div>
      </div>
      <div style="margin-top:32px; padding-top:24px; border-top:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center;">
        <div style="font-size:20px; font-weight:700; color:${C.white}; letter-spacing:4px;">MARBREST STONE</div>
        <div style="font-size:10px; color:rgba(255,255,255,0.3);">© ${new Date().getFullYear()} Marbrest Stone. All rights reserved.</div>
      </div>
    </div>
  </div>`
}

function pdfPageHeader(sectionName: string, pageNum: number): string {
  return `
  <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:16px; border-bottom:2px solid ${C.gold};">
    <div style="font-size:11px; letter-spacing:3px; color:${C.gold}; text-transform:uppercase;">${sectionName}</div>
    <div style="display:flex; align-items:center; gap:16px;">
      <div style="font-size:10px; color:${C.midGray}; letter-spacing:1px;">MARBREST STONE</div>
      <div style="font-size:10px; color:${C.midGray};">${pageNum}</div>
    </div>
  </div>`
}

function pdfPageFooter(): string {
  return `
  <div style="margin-top:20px; padding-top:12px; border-top:1px solid ${C.lightGray}; display:flex; justify-content:space-between; font-size:10px; color:${C.midGray};">
    <span>info@marbreststone.com · +91 80004 85312</span>
    <span>www.marbreststone.com</span>
  </div>`
}
