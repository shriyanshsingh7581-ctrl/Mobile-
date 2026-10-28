/**
 * Studio-Grade SVG Product & Storefront Visual Generator
 * Produces crisp, multi-angle vector studio renders for smartphones, tablets,
 * smartwatches, earbuds, chargers, power banks, accessories, and Charlie Mobile showroom photos.
 */

export type VisualAngle = 'front_back' | 'front_display' | 'back_camera' | 'side_profile';

export function generateProductStudioSvg(options: {
  title: string;
  brand: string;
  category: string;
  primaryHex?: string;
  secondaryHex?: string;
  angle?: VisualAngle;
  is5G?: boolean;
}): string {
  const {
    title,
    brand,
    category,
    primaryHex = '#2A2D34',
    secondaryHex = '#2563EB',
    angle = 'front_back',
  } = options;

  const cat = category.toLowerCase();
  const safeBrand = brand.replace(/[<>&"']/g, '');
  const safeTitle = title.replace(/[<>&"']/g, '').slice(0, 26);

  let deviceArtwork = '';

  if (cat.includes('watch') || cat.includes('wearable')) {
    // Smartwatch Studio Render
    deviceArtwork = `
      <!-- Watch Shadow -->
      <ellipse cx="300" cy="495" rx="95" ry="16" fill="#0F172A" opacity="0.14"/>
      <!-- Watch Band Top & Bottom -->
      <path d="M248 95 C252 65, 348 65, 352 95 L360 175 L240 175 Z" fill="${primaryHex}" stroke="#1E293B" stroke-width="2"/>
      <path d="M240 385 L360 385 L352 468 C348 495, 252 495, 248 468 Z" fill="${primaryHex}" stroke="#1E293B" stroke-width="2"/>
      <!-- Band Ribs -->
      <line x1="255" y1="120" x2="345" y2="120" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="3" stroke-linecap="round"/>
      <line x1="252" y1="142" x2="348" y2="142" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="3" stroke-linecap="round"/>
      <line x1="252" y1="418" x2="348" y2="418" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="3" stroke-linecap="round"/>
      <line x1="255" y1="440" x2="345" y2="440" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="3" stroke-linecap="round"/>
      <!-- Digital Crown & Side Button -->
      <rect x="386" y="218" width="14" height="44" rx="6" fill="#94A3B8" stroke="#475569" stroke-width="2"/>
      <rect x="388" y="226" width="10" height="4" fill="#F97316"/>
      <rect x="386" y="285" width="10" height="36" rx="4" fill="#64748B"/>
      <!-- Watch Titanium Case -->
      <rect x="206" y="162" width="184" height="236" rx="46" fill="url(#metalFrame)" stroke="#CBD5E1" stroke-width="4"/>
      <rect x="218" y="174" width="160" height="212" rx="38" fill="#090D16"/>
      <!-- Watch Face Graphics -->
      <circle cx="298" cy="280" r="64" stroke="${secondaryHex}" stroke-width="8" stroke-dasharray="290 120" stroke-linecap="round" fill="none" opacity="0.9"/>
      <circle cx="298" cy="280" r="48" stroke="#00C2FF" stroke-width="6" stroke-dasharray="210 100" stroke-linecap="round" fill="none"/>
      <text x="298" y="274" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="800" font-size="34">10:09</text>
      <text x="298" y="298" text-anchor="middle" fill="#00C2FF" font-family="sans-serif" font-weight="600" font-size="12" letter-spacing="1">CHARLIE PRO</text>
      <text x="298" y="320" text-anchor="middle" fill="#94A3B8" font-family="sans-serif" font-weight="600" font-size="11">98 BPM · 5G SYNC</text>
    `;
  } else if (cat.includes('earbud') || cat.includes('audio')) {
    // True Wireless Earbuds & Charging Case Render
    deviceArtwork = `
      <ellipse cx="300" cy="495" rx="135" ry="18" fill="#0F172A" opacity="0.13"/>
      <!-- Left Earbud -->
      <g transform="translate(155, 135) rotate(-14)">
        <rect x="28" y="45" width="24" height="72" rx="12" fill="${primaryHex}" stroke="#CBD5E1" stroke-width="2"/>
        <ellipse cx="48" cy="42" rx="36" ry="28" fill="${primaryHex}" stroke="#CBD5E1" stroke-width="2"/>
        <ellipse cx="74" cy="42" rx="14" ry="18" fill="#1E293B"/>
        <rect x="36" y="28" width="14" height="6" rx="3" fill="#0F172A"/>
      </g>
      <!-- Right Earbud -->
      <g transform="translate(355, 118) rotate(14)">
        <rect x="28" y="45" width="24" height="72" rx="12" fill="${primaryHex}" stroke="#CBD5E1" stroke-width="2"/>
        <ellipse cx="32" cy="42" rx="36" ry="28" fill="${primaryHex}" stroke="#CBD5E1" stroke-width="2"/>
        <ellipse cx="6" cy="42" rx="14" ry="18" fill="#1E293B"/>
        <rect x="30" y="28" width="14" height="6" rx="3" fill="#0F172A"/>
      </g>
      <!-- Charging Case -->
      <rect x="175" y="235" width="250" height="215" rx="68" fill="${primaryHex}" stroke="#CBD5E1" stroke-width="4"/>
      <path d="M177 312 L423 312" stroke="#94A3B8" stroke-width="2.5"/>
      <rect x="262" y="302" width="76" height="20" rx="10" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.5"/>
      <!-- Status LED -->
      <circle cx="300" cy="365" r="5" fill="#22C55E"/>
      <circle cx="300" cy="365" r="11" fill="#22C55E" opacity="0.25"/>
    `;
  } else if (cat.includes('charger') || cat.includes('power') || cat.includes('accessor')) {
    // GaN Charger / Power Bank / MagSafe Accessory Studio Render
    const isPowerBank = cat.includes('power') || title.toLowerCase().includes('power');
    deviceArtwork = isPowerBank
      ? `
        <ellipse cx="300" cy="500" rx="120" ry="16" fill="#0F172A" opacity="0.14"/>
        <!-- Power Bank Body -->
        <rect x="185" y="120" width="230" height="350" rx="32" fill="${primaryHex}" stroke="#CBD5E1" stroke-width="4"/>
        <!-- Digital Battery Display -->
        <rect x="215" y="155" width="170" height="80" rx="16" fill="#090D16" stroke="#334155" stroke-width="2"/>
        <text x="300" y="205" text-anchor="middle" fill="#00C2FF" font-family="monospace" font-weight="800" font-size="34">100%</text>
        <text x="300" y="224" text-anchor="middle" fill="#94A3B8" font-family="sans-serif" font-weight="600" font-size="10">20000mAh · 65W PD FAST</text>
        <!-- MagSafe Ring -->
        <circle cx="300" cy="335" r="56" stroke="#38BDF8" stroke-width="6" fill="none" opacity="0.7"/>
        <rect x="296" y="405" width="8" height="32" rx="4" fill="#38BDF8" opacity="0.7"/>
      `
      : `
        <ellipse cx="300" cy="495" rx="115" ry="15" fill="#0F172A" opacity="0.14"/>
        <!-- Prongs -->
        <rect x="262" y="96" width="14" height="58" rx="7" fill="#94A3B8" stroke="#64748B" stroke-width="2"/>
        <rect x="324" y="96" width="14" height="58" rx="7" fill="#94A3B8" stroke="#64748B" stroke-width="2"/>
        <rect x="242" y="142" width="116" height="24" rx="6" fill="#CBD5E1"/>
        <!-- GaN Charger Block -->
        <rect x="195" y="160" width="210" height="295" rx="34" fill="${primaryHex}" stroke="#CBD5E1" stroke-width="4"/>
        <!-- USB-C Ports -->
        <rect x="265" y="210" width="70" height="22" rx="11" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
        <rect x="280" y="219" width="40" height="4" rx="2" fill="#38BDF8"/>
        <rect x="265" y="252" width="70" height="22" rx="11" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
        <rect x="280" y="261" width="40" height="4" rx="2" fill="#38BDF8"/>
        <!-- Fast Charge Badge -->
        <text x="300" y="365" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="800" font-size="28">GaN Pro</text>
        <text x="300" y="392" text-anchor="middle" fill="#00C2FF" font-family="sans-serif" font-weight="700" font-size="13" letter-spacing="1.5">SUPERFAST USB-C</text>
      `;
  } else if (cat.includes('tablet') || cat.includes('ipad')) {
    // Tablet Studio Render
    deviceArtwork = `
      <ellipse cx="300" cy="505" rx="170" ry="16" fill="#0F172A" opacity="0.14"/>
      <!-- Back Tablet Frame -->
      <rect x="125" y="95" width="270" height="365" rx="26" fill="${primaryHex}" stroke="#94A3B8" stroke-width="3"/>
      <rect x="142" y="112" width="66" height="66" rx="16" fill="#1E293B" stroke="#64748B" stroke-width="2"/>
      <circle cx="162" cy="132" r="11" fill="#090D16" stroke="#38BDF8" stroke-width="2"/>
      <circle cx="162" cy="158" r="11" fill="#090D16" stroke="#38BDF8" stroke-width="2"/>
      <circle cx="188" cy="145" r="7" fill="#FDE047"/>
      <!-- Front Tablet Display -->
      <rect x="195" y="115" width="280" height="370" rx="26" fill="#0F172A" stroke="#CBD5E1" stroke-width="4"/>
      <rect x="207" y="127" width="256" height="346" rx="18" fill="url(#screenGlow)"/>
      <!-- Stylus Pen -->
      <rect x="488" y="140" width="12" height="310" rx="6" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2"/>
      <polygon points="488,450 500,450 494,472" fill="#334155"/>
    `;
  } else {
    // Smartphone Studio Render (Supports multiple angles)
    if (angle === 'front_display') {
      deviceArtwork = `
        <ellipse cx="300" cy="505" rx="115" ry="15" fill="#0F172A" opacity="0.15"/>
        <rect x="188" y="76" width="224" height="418" rx="38" fill="${primaryHex}" stroke="#94A3B8" stroke-width="4"/>
        <rect x="196" y="84" width="208" height="402" rx="32" fill="#090D16"/>
        <rect x="200" y="88" width="200" height="394" rx="29" fill="url(#screenGlow)"/>
        <!-- Wallpaper Abstract Waves -->
        <circle cx="300" cy="245" r="82" fill="${secondaryHex}" opacity="0.32"/>
        <circle cx="325" cy="295" r="65" fill="#00C2FF" opacity="0.28"/>
        <!-- Dynamic Island / Punch Hole -->
        <rect x="272" y="98" width="56" height="16" rx="8" fill="#05070B"/>
        <circle cx="316" cy="106" r="4" fill="#1E3A8A"/>
        <!-- Lockscreen Time -->
        <text x="300" y="168" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="800" font-size="42">09:41</text>
        <text x="300" y="190" text-anchor="middle" fill="#E2E8F0" font-family="sans-serif" font-weight="600" font-size="11" letter-spacing="1.2">${safeBrand.toUpperCase()} 5G</text>
      `;
    } else if (angle === 'back_camera') {
      deviceArtwork = `
        <ellipse cx="300" cy="505" rx="130" ry="16" fill="#0F172A" opacity="0.15"/>
        <!-- Zoomed Back Chassis -->
        <rect x="165" y="70" width="270" height="425" rx="44" fill="${primaryHex}" stroke="#94A3B8" stroke-width="4"/>
        <!-- Camera Island -->
        <rect x="188" y="94" width="136" height="142" rx="30" fill="#18181B" fill-opacity="0.7" stroke="#94A3B8" stroke-width="2.5"/>
        <!-- Pro Triple Camera Lenses -->
        <circle cx="226" cy="132" r="26" fill="#090D16" stroke="#CBD5E1" stroke-width="4"/>
        <circle cx="226" cy="132" r="11" fill="#1E3A8A"/>
        <circle cx="222" cy="128" r="4" fill="#38BDF8"/>
        <circle cx="226" cy="196" r="26" fill="#090D16" stroke="#CBD5E1" stroke-width="4"/>
        <circle cx="226" cy="196" r="11" fill="#1E3A8A"/>
        <circle cx="288" cy="164" r="26" fill="#090D16" stroke="#CBD5E1" stroke-width="4"/>
        <circle cx="288" cy="164" r="11" fill="#1E3A8A"/>
        <circle cx="288" cy="118" r="9" fill="#FEF08A"/>
        <circle cx="288" cy="210" r="10" fill="#334155"/>
      `;
    } else if (angle === 'side_profile') {
      deviceArtwork = `
        <ellipse cx="300" cy="505" rx="90" ry="14" fill="#0F172A" opacity="0.15"/>
        <!-- Angled Titanium Side Profile -->
        <rect x="242" y="75" width="38" height="420" rx="16" fill="${primaryHex}" stroke="#94A3B8" stroke-width="3"/>
        <rect x="280" y="75" width="85" height="420" rx="24" fill="url(#screenGlow)" opacity="0.9"/>
        <rect x="236" y="160" width="6" height="32" rx="3" fill="#CBD5E1"/>
        <rect x="236" y="210" width="6" height="52" rx="3" fill="#CBD5E1"/>
        <rect x="236" y="275" width="6" height="52" rx="3" fill="#CBD5E1"/>
      `;
    } else {
      // Default Dual Front + Back Flagship Presentation
      deviceArtwork = `
        <ellipse cx="300" cy="506" rx="155" ry="16" fill="#0F172A" opacity="0.14"/>
        <!-- Rear Smartphone Body (Left) -->
        <g transform="translate(-48, -8)">
          <rect x="165" y="88" width="198" height="398" rx="36" fill="${primaryHex}" stroke="#94A3B8" stroke-width="3.5"/>
          <!-- Camera Module -->
          <rect x="182" y="106" width="102" height="108" rx="24" fill="#0F172A" fill-opacity="0.55" stroke="#CBD5E1" stroke-width="2"/>
          <circle cx="210" cy="134" r="19" fill="#090D16" stroke="#CBD5E1" stroke-width="3"/>
          <circle cx="210" cy="134" r="8" fill="#1D4ED8"/>
          <circle cx="210" cy="184" r="19" fill="#090D16" stroke="#CBD5E1" stroke-width="3"/>
          <circle cx="210" cy="184" r="8" fill="#1D4ED8"/>
          <circle cx="256" cy="159" r="19" fill="#090D16" stroke="#CBD5E1" stroke-width="3"/>
          <circle cx="256" cy="159" r="8" fill="#0284C7"/>
          <circle cx="256" cy="122" r="7" fill="#FEF08A"/>
          <circle cx="256" cy="194" r="8" fill="#334155"/>
        </g>
        <!-- Front Smartphone Display (Right Overlapping) -->
        <g transform="translate(56, 8)">
          <rect x="172" y="82" width="198" height="398" rx="36" fill="#090D16" stroke="#CBD5E1" stroke-width="3.5"/>
          <rect x="180" y="90" width="182" height="382" rx="30" fill="url(#screenGlow)"/>
          <!-- Glowing Wallpaper Graphic -->
          <circle cx="271" cy="255" r="72" fill="${secondaryHex}" opacity="0.38"/>
          <circle cx="290" cy="295" r="56" fill="#00C2FF" opacity="0.32"/>
          <path d="M180 340 Q271 275 362 350 L362 472 L180 472 Z" fill="#0F172A" opacity="0.55"/>
          <!-- Dynamic Island -->
          <rect x="245" y="100" width="52" height="14" rx="7" fill="#030712"/>
          <circle cx="287" cy="107" r="3.5" fill="#1E40AF"/>
          <!-- Lockscreen Clock -->
          <text x="271" y="164" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="800" font-size="36">09:41</text>
          <text x="271" y="184" text-anchor="middle" fill="#BAE6FD" font-family="sans-serif" font-weight="600" font-size="10" letter-spacing="1">${safeBrand.toUpperCase()}</text>
        </g>
      `;
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" fill="none">
    <defs>
      <radialGradient id="studioBg" cx="50%" cy="42%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="70%" stop-color="#F8FAFC"/>
        <stop offset="100%" stop-color="#EEF2F6"/>
      </radialGradient>
      <linearGradient id="screenGlow" x1="180" y1="90" x2="380" y2="470" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#0F172A"/>
        <stop offset="45%" stop-color="#1E1B4B"/>
        <stop offset="100%" stop-color="#090D16"/>
      </linearGradient>
      <linearGradient id="metalFrame" x1="200" y1="150" x2="400" y2="400" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${primaryHex}"/>
        <stop offset="50%" stop-color="#475569"/>
        <stop offset="100%" stop-color="${primaryHex}"/>
      </linearGradient>
    </defs>
    <rect width="600" height="600" fill="url(#studioBg)"/>
    <!-- Subtle Studio Pedestal Line -->
    <line x1="80" y1="506" x2="520" y2="506" stroke="#E2E8F0" stroke-width="1.5"/>
    ${deviceArtwork}
    <!-- Subtle Bottom Studio Caption -->
    <text x="300" y="558" text-anchor="middle" fill="#64748B" font-family="sans-serif" font-weight="600" font-size="13" letter-spacing="0.5">${safeBrand} · ${safeTitle}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Generates High-Resolution Storefront & Showroom Photographs for CHARLIE MOBILE & ACCESSORIES
 */
export function generateStoreShowroomSvg(view: 'storefront' | 'interior_counter' | 'accessories_wall' | 'experience_zone'): string {
  let scene = '';
  if (view === 'storefront') {
    scene = `
      <!-- Fascia Signboard: CHARLIE MOBILE & ACCESSORIES -->
      <rect x="60" y="45" width="680" height="115" rx="14" fill="#101114" stroke="#2563EB" stroke-width="4"/>
      <rect x="85" y="65" width="75" height="75" rx="16" fill="#1E293B" stroke="#00C2FF" stroke-width="2.5"/>
      <text x="122" y="114" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="34">CM</text>
      <text x="415" y="98" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="34" letter-spacing="2">CHARLIE MOBILE</text>
      <text x="415" y="132" text-anchor="middle" fill="#00C2FF" font-family="sans-serif" font-weight="700" font-size="16" letter-spacing="4">&amp; ACCESSORIES</text>
      <!-- Glass Storefront & Illuminated Display Windows -->
      <rect x="75" y="170" width="650" height="270" rx="8" fill="#0F172A" stroke="#334155" stroke-width="4"/>
      <!-- Brand Headers inside Window -->
      <rect x="95" y="188" width="180" height="36" rx="6" fill="#1E293B"/>
      <text x="185" y="211" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="700" font-size="13">iPhone · Samsung · Vivo</text>
      <rect x="525" y="188" width="180" height="36" rx="6" fill="#1E293B"/>
      <text x="615" y="211" text-anchor="middle" fill="#00C2FF" font-family="sans-serif" font-weight="700" font-size="13">5G Experience Store</text>
      <!-- Glass Entrance Doors -->
      <rect x="310" y="188" width="180" height="252" fill="#1E293B" fill-opacity="0.55" stroke="#38BDF8" stroke-width="2"/>
      <line x1="400" y1="188" x2="400" y2="440" stroke="#38BDF8" stroke-width="2"/>
      <!-- Display Pedestals -->
      <rect x="115" y="330" width="140" height="90" rx="6" fill="#F8FAFC"/>
      <rect x="545" y="330" width="140" height="90" rx="6" fill="#F8FAFC"/>
    `;
  } else if (view === 'interior_counter') {
    scene = `
      <!-- Ceiling LED Cove Lighting -->
      <rect x="80" y="35" width="640" height="18" rx="9" fill="#00C2FF" opacity="0.45"/>
      <!-- Back Brand Wall -->
      <rect x="90" y="75" width="620" height="210" rx="12" fill="#101114" stroke="#334155" stroke-width="3"/>
      <text x="400" y="155" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="36" letter-spacing="2">CHARLIE MOBILE</text>
      <text x="400" y="190" text-anchor="middle" fill="#00C2FF" font-family="sans-serif" font-weight="700" font-size="15" letter-spacing="3">AUTHORIZED MULTI-BRAND SHOWROOM</text>
      <!-- Illuminated Glass Showcase Counter -->
      <rect x="110" y="305" width="580" height="145" rx="12" fill="#1E293B" stroke="#38BDF8" stroke-width="3"/>
      <rect x="130" y="322" width="540" height="55" rx="6" fill="#0F172A" stroke="#00C2FF" stroke-width="1.5"/>
      <!-- Demo Devices on Counter -->
      <rect x="180" y="272" width="28" height="34" rx="4" fill="#38BDF8"/>
      <rect x="280" y="272" width="28" height="34" rx="4" fill="#F8FAFC"/>
      <rect x="380" y="272" width="28" height="34" rx="4" fill="#38BDF8"/>
      <rect x="480" y="272" width="28" height="34" rx="4" fill="#F8FAFC"/>
      <rect x="580" y="272" width="28" height="34" rx="4" fill="#38BDF8"/>
    `;
  } else {
    scene = `
      <!-- Accessories & Audio Wall -->
      <rect x="70" y="55" width="660" height="390" rx="14" fill="#101114" stroke="#2563EB" stroke-width="3"/>
      <text x="400" y="102" text-anchor="middle" fill="#00C2FF" font-family="sans-serif" font-weight="800" font-size="22" letter-spacing="2">GENUINE ACCESSORIES &amp; WEARABLES ZONE</text>
      <!-- Pegboard Accessory Hooks -->
      <g fill="#1E293B" stroke="#475569" stroke-width="2">
        <rect x="115" y="135" width="120" height="130" rx="10"/>
        <rect x="260" y="135" width="120" height="130" rx="10"/>
        <rect x="405" y="135" width="120" height="130" rx="10"/>
        <rect x="550" y="135" width="120" height="130" rx="10"/>
        <rect x="115" y="285" width="120" height="130" rx="10"/>
        <rect x="260" y="285" width="120" height="130" rx="10"/>
        <rect x="405" y="285" width="120" height="130" rx="10"/>
        <rect x="550" y="285" width="120" height="130" rx="10"/>
      </g>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" fill="none">
    <rect width="800" height="500" fill="#090D16"/>
    ${scene}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
