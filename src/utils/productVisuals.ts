/**
 * Poorvika-Style High-Definition Studio Product, Category & Promotional Banner Visual Engine
 * Generates crisp, pure-white-background 3D studio product renders with brand-accurate camera modules
 * (Apple iPhone 16 Pro triple camera, Samsung S24 Ultra quad rings + S-Pen, Vivo ZEISS circular module,
 * OnePlus Hasselblad ring, Oppo Cosmos ring, Redmi/Realme/iQOO cameras, Apple Watch Ultra 2, AirPods Pro,
 * GaN Chargers, Power Banks) and Poorvika-style multi-product campaign banners.
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
  const brandLower = brand.toLowerCase();
  const titleLower = title.toLowerCase();
  const safeBrand = brand.replace(/[<>&"']/g, '');
  const safeTitle = title.replace(/[<>&"']/g, '').slice(0, 32);

  let deviceArtwork = '';

  if (cat.includes('watch') || cat.includes('wearable')) {
    // Smartwatch Studio Render (Apple Watch Ultra 2 / Galaxy Watch 7)
    const isRoundWatch = brandLower.includes('samsung') || titleLower.includes('galaxy');
    deviceArtwork = isRoundWatch
      ? `
      <ellipse cx="300" cy="510" rx="100" ry="14" fill="#0F172A" opacity="0.10"/>
      <!-- Top & Bottom Silicone Straps -->
      <path d="M245 80 L355 80 L365 190 L235 190 Z" fill="${primaryHex}" stroke="#334155" stroke-width="2"/>
      <path d="M235 390 L365 390 L355 500 L245 500 Z" fill="${primaryHex}" stroke="#334155" stroke-width="2"/>
      <!-- Circular Watch Case -->
      <circle cx="300" cy="290" r="118" fill="url(#metalFrame)" stroke="#94A3B8" stroke-width="5"/>
      <circle cx="300" cy="290" r="102" fill="#090D16"/>
      <!-- Galaxy AI Watch Face -->
      <circle cx="300" cy="290" r="86" stroke="#22C55E" stroke-width="7" stroke-dasharray="360 180" stroke-linecap="round" fill="none"/>
      <circle cx="300" cy="290" r="68" stroke="#00C2FF" stroke-width="6" stroke-dasharray="260 160" stroke-linecap="round" fill="none"/>
      <text x="300" y="282" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="800" font-size="40">10:08</text>
      <text x="300" y="308" text-anchor="middle" fill="#00C2FF" font-family="sans-serif" font-weight="700" font-size="13">GALAXY AI · LTE</text>
      <text x="300" y="332" text-anchor="middle" fill="#94A3B8" font-family="sans-serif" font-weight="600" font-size="12">♥ 96 BPM · 8,420 STEPS</text>
      `
      : `
      <ellipse cx="300" cy="510" rx="100" ry="14" fill="#0F172A" opacity="0.12"/>
      <!-- Ocean / Alpine Loop Band -->
      <path d="M244 82 C250 58, 350 58, 356 82 L364 170 L236 170 Z" fill="${primaryHex}" stroke="#1E293B" stroke-width="2"/>
      <path d="M236 400 L364 400 L356 485 C350 508, 250 508, 244 485 Z" fill="${primaryHex}" stroke="#1E293B" stroke-width="2"/>
      <line x1="252" y1="112" x2="348" y2="112" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="4" stroke-linecap="round"/>
      <line x1="252" y1="138" x2="348" y2="138" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="4" stroke-linecap="round"/>
      <line x1="252" y1="432" x2="348" y2="432" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="4" stroke-linecap="round"/>
      <line x1="252" y1="458" x2="348" y2="458" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="4" stroke-linecap="round"/>
      <!-- Orange Action Button & Digital Crown Guard -->
      <rect x="190" y="260" width="8" height="46" rx="4" fill="#F97316"/>
      <rect x="394" y="210" width="16" height="52" rx="7" fill="#94A3B8" stroke="#475569" stroke-width="2"/>
      <rect x="396" y="220" width="12" height="5" fill="#F97316"/>
      <!-- 49mm Titanium Case -->
      <rect x="198" y="158" width="200" height="254" rx="48" fill="url(#metalFrame)" stroke="#CBD5E1" stroke-width="5"/>
      <rect x="212" y="172" width="172" height="226" rx="38" fill="#05070B"/>
      <!-- Wayfinder Ultra Watchface -->
      <circle cx="298" cy="285" r="68" stroke="#F97316" stroke-width="8" stroke-dasharray="310 110" stroke-linecap="round" fill="none"/>
      <circle cx="298" cy="285" r="50" stroke="#00C2FF" stroke-width="6" stroke-dasharray="220 100" stroke-linecap="round" fill="none"/>
      <text x="298" y="278" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="38">09:41</text>
      <text x="298" y="304" text-anchor="middle" fill="#F97316" font-family="sans-serif" font-weight="800" font-size="12" letter-spacing="1">ULTRA 2 · 49MM</text>
      <text x="298" y="325" text-anchor="middle" fill="#94A3B8" font-family="sans-serif" font-weight="600" font-size="11">GPS + CELLULAR</text>
    `;
  } else if (cat.includes('earbud') || cat.includes('audio')) {
    // True Wireless Earbuds & MagSafe Charging Case
    deviceArtwork = `
      <ellipse cx="300" cy="510" rx="140" ry="15" fill="#0F172A" opacity="0.11"/>
      <!-- Left Earbud Floating -->
      <g transform="translate(145, 110) rotate(-12)">
        <rect x="32" y="48" width="26" height="82" rx="13" fill="${primaryHex}" stroke="#CBD5E1" stroke-width="2.5"/>
        <ellipse cx="52" cy="44" rx="40" ry="30" fill="${primaryHex}" stroke="#CBD5E1" stroke-width="2.5"/>
        <ellipse cx="80" cy="44" rx="15" ry="20" fill="#1E293B"/>
        <rect x="38" y="28" width="16" height="6" rx="3" fill="#0F172A"/>
      </g>
      <!-- Right Earbud Floating -->
      <g transform="translate(355, 92) rotate(12)">
        <rect x="30" y="48" width="26" height="82" rx="13" fill="${primaryHex}" stroke="#CBD5E1" stroke-width="2.5"/>
        <ellipse cx="34" cy="44" rx="40" ry="30" fill="${primaryHex}" stroke="#CBD5E1" stroke-width="2.5"/>
        <ellipse cx="6" cy="44" rx="15" ry="20" fill="#1E293B"/>
        <rect x="32" y="28" width="16" height="6" rx="3" fill="#0F172A"/>
      </g>
      <!-- Charging Case -->
      <rect x="165" y="230" width="270" height="235" rx="72" fill="${primaryHex}" stroke="#CBD5E1" stroke-width="4"/>
      <path d="M167 312 L433 312" stroke="#94A3B8" stroke-width="2.5"/>
      <rect x="258" y="302" width="84" height="20" rx="10" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.5"/>
      <circle cx="300" cy="372" r="5.5" fill="#22C55E"/>
      <circle cx="300" cy="372" r="13" fill="#22C55E" opacity="0.22"/>
      <text x="300" y="420" text-anchor="middle" fill="#64748B" font-family="sans-serif" font-weight="700" font-size="13" letter-spacing="1">${safeBrand.toUpperCase()} ANC PRO</text>
    `;
  } else if (cat.includes('charger') || cat.includes('power') || cat.includes('accessor')) {
    const isPowerBank = cat.includes('power') || titleLower.includes('power');
    const isCase = titleLower.includes('case') || titleLower.includes('kevlar') || titleLower.includes('glass');
    if (isPowerBank) {
      deviceArtwork = `
        <ellipse cx="300" cy="512" rx="125" ry="15" fill="#0F172A" opacity="0.12"/>
        <rect x="180" y="105" width="240" height="375" rx="34" fill="${primaryHex}" stroke="#94A3B8" stroke-width="4"/>
        <rect x="210" y="138" width="180" height="86" rx="18" fill="#05070B" stroke="#334155" stroke-width="2"/>
        <text x="300" y="192" text-anchor="middle" fill="#00C2FF" font-family="monospace" font-weight="800" font-size="38">100%</text>
        <text x="300" y="212" text-anchor="middle" fill="#94A3B8" font-family="sans-serif" font-weight="700" font-size="11">20000mAh · 65W PD FAST</text>
        <circle cx="300" cy="340" r="62" stroke="#38BDF8" stroke-width="7" fill="none" opacity="0.85"/>
        <rect x="296" y="414" width="8" height="34" rx="4" fill="#38BDF8" opacity="0.85"/>
      `;
    } else if (isCase) {
      deviceArtwork = `
        <ellipse cx="300" cy="512" rx="135" ry="15" fill="#0F172A" opacity="0.12"/>
        <!-- Tempered Glass Sheet Left -->
        <rect x="135" y="105" width="185" height="370" rx="32" fill="#E0F2FE" fill-opacity="0.55" stroke="#0284C7" stroke-width="3"/>
        <text x="227" y="290" text-anchor="middle" fill="#0369A1" font-family="sans-serif" font-weight="800" font-size="15">9H SAPPHIRE GLASS</text>
        <!-- Kevlar MagSafe Case Right -->
        <rect x="245" y="95" width="205" height="390" rx="36" fill="${primaryHex}" stroke="#64748B" stroke-width="4"/>
        <rect x="262" y="112" width="88" height="92" rx="20" fill="#090D16" stroke="#94A3B8" stroke-width="3"/>
        <circle cx="347" cy="300" r="54" stroke="#E2E8F0" stroke-width="6" fill="none" opacity="0.8"/>
        <rect x="343" y="366" width="8" height="28" rx="4" fill="#E2E8F0" opacity="0.8"/>
      `;
    } else {
      // Original Fast Charger Adapter
      deviceArtwork = `
        <ellipse cx="300" cy="510" rx="115" ry="14" fill="#0F172A" opacity="0.11"/>
        <rect x="260" y="88" width="15" height="64" rx="7.5" fill="#94A3B8" stroke="#64748B" stroke-width="2"/>
        <rect x="325" y="88" width="15" height="64" rx="7.5" fill="#94A3B8" stroke="#64748B" stroke-width="2"/>
        <rect x="238" y="138" width="124" height="24" rx="6" fill="#CBD5E1"/>
        <rect x="190" y="156" width="220" height="315" rx="38" fill="${primaryHex}" stroke="#CBD5E1" stroke-width="4"/>
        <rect x="262" y="210" width="76" height="24" rx="12" fill="#0F172A" stroke="#00C2FF" stroke-width="2.5"/>
        <rect x="278" y="220" width="44" height="4" rx="2" fill="#00C2FF"/>
        <rect x="262" y="254" width="76" height="24" rx="12" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
        <text x="300" y="365" text-anchor="middle" fill="${primaryHex === '#F8FAFC' ? '#0F172A' : '#FFFFFF'}" font-family="sans-serif" font-weight="900" font-size="28">${safeBrand.toUpperCase()}</text>
        <text x="300" y="395" text-anchor="middle" fill="#2563EB" font-family="sans-serif" font-weight="800" font-size="14" letter-spacing="1.5">SUPERFAST USB-C PD</text>
      `;
    }
  } else if (cat.includes('tablet') || cat.includes('ipad')) {
    // iPad Pro / Android Tablet + Pencil Studio Render
    deviceArtwork = `
      <ellipse cx="300" cy="512" rx="180" ry="15" fill="#0F172A" opacity="0.12"/>
      <rect x="115" y="85" width="275" height="385" rx="26" fill="${primaryHex}" stroke="#94A3B8" stroke-width="3.5"/>
      <rect x="134" y="104" width="70" height="70" rx="16" fill="#18181B" stroke="#64748B" stroke-width="2"/>
      <circle cx="154" cy="124" r="12" fill="#090D16" stroke="#38BDF8" stroke-width="2"/>
      <circle cx="154" cy="152" r="12" fill="#090D16" stroke="#38BDF8" stroke-width="2"/>
      <circle cx="182" cy="138" r="7" fill="#FDE047"/>
      <rect x="192" y="102" width="285" height="388" rx="26" fill="#090D16" stroke="#CBD5E1" stroke-width="4"/>
      <rect x="204" y="114" width="261" height="364" rx="18" fill="url(#screenGlow)"/>
      <circle cx="334" cy="296" r="95" fill="${secondaryHex}" opacity="0.38"/>
      <circle cx="360" cy="260" r="70" fill="#00C2FF" opacity="0.32"/>
      <text x="334" y="190" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="36">09:41</text>
      <text x="334" y="216" text-anchor="middle" fill="#BAE6FD" font-family="sans-serif" font-weight="700" font-size="12" letter-spacing="1.5">ULTRA RETINA XDR</text>
      <!-- Apple Pencil Pro -->
      <rect x="492" y="120" width="13" height="340" rx="6.5" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2"/>
      <polygon points="492,460 505,460 498.5,484" fill="#334155"/>
    `;
  } else {
    // SMARTPHONES — Brand-Authentic Camera Architecture (Poorvika Style)
    const isSamsungUltra =
      brandLower.includes('samsung') &&
      (titleLower.includes('ultra') || titleLower.includes('s24'));
    const isCircularCamera =
      brandLower.includes('vivo') ||
      brandLower.includes('oneplus') ||
      (brandLower.includes('oppo') && titleLower.includes('find')) ||
      (brandLower.includes('redmi') && titleLower.includes('pro+')) ||
      (brandLower.includes('realme') && titleLower.includes('pro'));
    const isDualVertical =
      (brandLower.includes('apple') && !titleLower.includes('pro')) ||
      brandLower.includes('samsung') ||
      brandLower.includes('nothing');

    if (angle === 'front_display') {
      deviceArtwork = `
        <ellipse cx="300" cy="512" rx="120" ry="14" fill="#0F172A" opacity="0.12"/>
        <rect x="184" y="68" width="232" height="432" rx="${isSamsungUltra ? '16' : '38'}" fill="${primaryHex}" stroke="#94A3B8" stroke-width="4"/>
        <rect x="192" y="76" width="216" height="416" rx="${isSamsungUltra ? '12' : '32'}" fill="#05070B"/>
        <rect x="196" y="80" width="208" height="408" rx="${isSamsungUltra ? '10' : '29'}" fill="url(#screenGlow)"/>
        <circle cx="300" cy="255" r="88" fill="${secondaryHex}" opacity="0.42"/>
        <circle cx="325" cy="305" r="70" fill="#00C2FF" opacity="0.34"/>
        <rect x="270" y="92" width="60" height="16" rx="8" fill="#030712"/>
        <text x="300" y="168" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="44">09:41</text>
        <text x="300" y="192" text-anchor="middle" fill="#E2E8F0" font-family="sans-serif" font-weight="700" font-size="12" letter-spacing="1.5">${safeBrand.toUpperCase()} 5G</text>
      `;
    } else if (angle === 'back_camera') {
      deviceArtwork = `
        <ellipse cx="300" cy="512" rx="130" ry="15" fill="#0F172A" opacity="0.13"/>
        <rect x="165" y="68" width="270" height="432" rx="${isSamsungUltra ? '18' : '42'}" fill="${primaryHex}" stroke="#94A3B8" stroke-width="4"/>
        ${
          isCircularCamera
            ? `
          <circle cx="300" cy="195" r="88" fill="#090D16" stroke="#CBD5E1" stroke-width="5"/>
          <circle cx="300" cy="195" r="76" fill="#111827" stroke="#334155" stroke-width="2"/>
          <circle cx="270" cy="165" r="22" fill="#030712" stroke="#64748B" stroke-width="3"/>
          <circle cx="330" cy="165" r="22" fill="#030712" stroke="#64748B" stroke-width="3"/>
          <circle cx="270" cy="225" r="22" fill="#030712" stroke="#64748B" stroke-width="3"/>
          <circle cx="330" cy="225" r="22" fill="#030712" stroke="#64748B" stroke-width="3"/>
          <rect x="282" y="186" width="36" height="16" rx="4" fill="#1D4ED8"/>
          <text x="300" y="198" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="10">ZEISS</text>
        `
            : `
          <rect x="188" y="92" width="136" height="142" rx="30" fill="#18181B" fill-opacity="0.72" stroke="#94A3B8" stroke-width="2.5"/>
          <circle cx="226" cy="130" r="26" fill="#090D16" stroke="#CBD5E1" stroke-width="4"/>
          <circle cx="226" cy="130" r="11" fill="#1E3A8A"/>
          <circle cx="226" cy="194" r="26" fill="#090D16" stroke="#CBD5E1" stroke-width="4"/>
          <circle cx="226" cy="194" r="11" fill="#1E3A8A"/>
          <circle cx="288" cy="162" r="26" fill="#090D16" stroke="#CBD5E1" stroke-width="4"/>
          <circle cx="288" cy="162" r="11" fill="#1E3A8A"/>
          <circle cx="288" cy="116" r="9" fill="#FEF08A"/>
          <circle cx="288" cy="208" r="10" fill="#334155"/>
        `
        }
      `;
    } else if (angle === 'side_profile') {
      deviceArtwork = `
        <ellipse cx="300" cy="512" rx="90" ry="14" fill="#0F172A" opacity="0.13"/>
        <rect x="242" y="72" width="38" height="425" rx="16" fill="${primaryHex}" stroke="#94A3B8" stroke-width="3"/>
        <rect x="280" y="72" width="85" height="425" rx="24" fill="url(#screenGlow)" opacity="0.92"/>
        <rect x="236" y="160" width="6" height="32" rx="3" fill="#CBD5E1"/>
        <rect x="236" y="210" width="6" height="52" rx="3" fill="#CBD5E1"/>
      `;
    } else {
      // DEFAULT POORVIKA CATALOG VIEW: Front + Back Overlapping Studio Render
      const cornerRx = isSamsungUltra ? '16' : '36';
      const screenRx = isSamsungUltra ? '12' : '30';

      let rearCameraMarkup = '';
      if (isSamsungUltra) {
        // Samsung S24 Ultra Individual Quad Camera Rings + S-Pen
        rearCameraMarkup = `
          <circle cx="198" cy="122" r="16" fill="#090D16" stroke="#CBD5E1" stroke-width="3"/>
          <circle cx="198" cy="122" r="6" fill="#1D4ED8"/>
          <circle cx="198" cy="162" r="16" fill="#090D16" stroke="#CBD5E1" stroke-width="3"/>
          <circle cx="198" cy="162" r="6" fill="#0284C7"/>
          <circle cx="198" cy="202" r="16" fill="#090D16" stroke="#CBD5E1" stroke-width="3"/>
          <circle cx="198" cy="202" r="6" fill="#1D4ED8"/>
          <circle cx="234" cy="138" r="11" fill="#090D16" stroke="#CBD5E1" stroke-width="2.5"/>
          <circle cx="234" cy="166" r="6" fill="#FEF08A"/>
          <circle cx="234" cy="192" r="11" fill="#090D16" stroke="#CBD5E1" stroke-width="2.5"/>
          <!-- S-Pen Stylus on Left -->
          <rect x="132" y="110" width="11" height="365" rx="5.5" fill="${primaryHex}" stroke="#94A3B8" stroke-width="2"/>
          <rect x="132" y="110" width="11" height="22" rx="3" fill="#CBD5E1"/>
          <polygon points="132,475 143,475 137.5,494" fill="#F8FAFC"/>
        `;
      } else if (isCircularCamera) {
        // Vivo ZEISS / OnePlus / Oppo Find Circular Flagship Camera Ring
        rearCameraMarkup = `
          <circle cx="264" cy="175" r="66" fill="#090D16" stroke="#CBD5E1" stroke-width="4"/>
          <circle cx="264" cy="175" r="56" fill="#111827" stroke="#334155" stroke-width="1.5"/>
          <circle cx="242" cy="153" r="16" fill="#030712" stroke="#64748B" stroke-width="2.5"/>
          <circle cx="286" cy="153" r="16" fill="#030712" stroke="#64748B" stroke-width="2.5"/>
          <circle cx="242" cy="197" r="16" fill="#030712" stroke="#64748B" stroke-width="2.5"/>
          <circle cx="286" cy="197" r="16" fill="#030712" stroke="#64748B" stroke-width="2.5"/>
          <rect x="249" y="168" width="30" height="13" rx="3" fill="#2563EB"/>
          <text x="264" y="177.5" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="8">${brandLower.includes('vivo') ? 'ZEISS' : 'PRO'}</text>
        `;
      } else if (isDualVertical) {
        // iPhone 16 / Galaxy A-Series Vertical Dual Pill Camera
        rearCameraMarkup = `
          <rect x="182" y="104" width="58" height="106" rx="29" fill="#0F172A" fill-opacity="0.45" stroke="#CBD5E1" stroke-width="2.5"/>
          <circle cx="211" cy="133" r="20" fill="#090D16" stroke="#CBD5E1" stroke-width="3"/>
          <circle cx="211" cy="133" r="8" fill="#1D4ED8"/>
          <circle cx="211" cy="180" r="20" fill="#090D16" stroke="#CBD5E1" stroke-width="3"/>
          <circle cx="211" cy="180" r="8" fill="#0284C7"/>
          <circle cx="254" cy="156" r="7" fill="#FEF08A"/>
        `;
      } else {
        // Pro Triple Camera Island (iPhone 16 Pro Max / Flagship)
        rearCameraMarkup = `
          <rect x="180" y="102" width="106" height="112" rx="26" fill="#0F172A" fill-opacity="0.52" stroke="#CBD5E1" stroke-width="2.5"/>
          <circle cx="208" cy="131" r="20" fill="#090D16" stroke="#CBD5E1" stroke-width="3"/>
          <circle cx="208" cy="131" r="8.5" fill="#1D4ED8"/>
          <circle cx="208" cy="183" r="20" fill="#090D16" stroke="#CBD5E1" stroke-width="3"/>
          <circle cx="208" cy="183" r="8.5" fill="#1D4ED8"/>
          <circle cx="256" cy="157" r="20" fill="#090D16" stroke="#CBD5E1" stroke-width="3"/>
          <circle cx="256" cy="157" r="8.5" fill="#0284C7"/>
          <circle cx="256" cy="119" r="7.5" fill="#FEF08A"/>
          <circle cx="256" cy="195" r="8.5" fill="#334155"/>
        `;
      }

      deviceArtwork = `
        <ellipse cx="300" cy="515" rx="165" ry="15" fill="#0F172A" opacity="0.12"/>
        <!-- Rear Smartphone Body (Left) -->
        <g transform="translate(-52, -10)">
          <rect x="162" y="82" width="204" height="412" rx="${cornerRx}" fill="${primaryHex}" stroke="#94A3B8" stroke-width="3.5"/>
          <!-- Subtle Satin Glass Sheen on Back -->
          <path d="M166 110 L362 290 L362 465 L166 465 Z" fill="#FFFFFF" opacity="0.06"/>
          ${rearCameraMarkup}
          <text x="264" y="445" text-anchor="middle" fill="#FFFFFF" fill-opacity="0.45" font-family="sans-serif" font-weight="800" font-size="13" letter-spacing="2">${safeBrand.toUpperCase()}</text>
        </g>
        <!-- Front Smartphone Display (Right Overlapping) -->
        <g transform="translate(58, 6)">
          <rect x="168" y="76" width="204" height="412" rx="${cornerRx}" fill="#090D16" stroke="#CBD5E1" stroke-width="3.5"/>
          <rect x="176" y="84" width="188" height="396" rx="${screenRx}" fill="url(#screenGlow)"/>
          <!-- Vibrant AMOLED Wallpaper Graphic -->
          <circle cx="270" cy="255" r="78" fill="${secondaryHex}" opacity="0.45"/>
          <circle cx="292" cy="298" r="60" fill="#00C2FF" opacity="0.38"/>
          <circle cx="245" cy="215" r="45" fill="#F97316" opacity="0.28"/>
          <path d="M176 340 Q270 272 364 348 L364 480 L176 480 Z" fill="#090D16" opacity="0.58"/>
          <!-- Dynamic Island / Punch Hole -->
          <rect x="242" y="95" width="56" height="15" rx="7.5" fill="#030712"/>
          <circle cx="286" cy="102.5" r="3.5" fill="#1E40AF"/>
          <!-- Lockscreen Clock & 5G Badge -->
          <text x="270" y="162" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="38">09:41</text>
          <text x="270" y="182" text-anchor="middle" fill="#BAE6FD" font-family="sans-serif" font-weight="700" font-size="10" letter-spacing="1.2">${safeBrand.toUpperCase()} 5G</text>
        </g>
      `;
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" fill="none">
    <defs>
      <radialGradient id="studioBg" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="80%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#F8FAFC"/>
      </radialGradient>
      <linearGradient id="screenGlow" x1="176" y1="84" x2="364" y2="480" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#0F172A"/>
        <stop offset="50%" stop-color="#1E1B4B"/>
        <stop offset="100%" stop-color="#090D16"/>
      </linearGradient>
      <linearGradient id="metalFrame" x1="180" y1="120" x2="420" y2="440" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${primaryHex}"/>
        <stop offset="50%" stop-color="#64748B"/>
        <stop offset="100%" stop-color="${primaryHex}"/>
      </linearGradient>
    </defs>
    <rect width="600" height="600" fill="url(#studioBg)"/>
    ${deviceArtwork}
    <text x="300" y="566" text-anchor="middle" fill="#64748B" font-family="sans-serif" font-weight="700" font-size="12" letter-spacing="0.4">${safeTitle}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Generates High-Resolution Storefront & Showroom Photographs for CHARLIE MOBILE & ACCESSORIES
 */
export function generateStoreShowroomSvg(
  view: 'storefront' | 'interior_counter' | 'accessories_wall' | 'experience_zone'
): string {
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
      <rect x="95" y="188" width="180" height="36" rx="6" fill="#1E293B"/>
      <text x="185" y="211" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="700" font-size="13">iPhone · Samsung · Vivo</text>
      <rect x="525" y="188" width="180" height="36" rx="6" fill="#1E293B"/>
      <text x="615" y="211" text-anchor="middle" fill="#00C2FF" font-family="sans-serif" font-weight="700" font-size="13">Call: 8818850488</text>
      <rect x="310" y="188" width="180" height="252" fill="#1E293B" fill-opacity="0.55" stroke="#38BDF8" stroke-width="2"/>
      <line x1="400" y1="188" x2="400" y2="440" stroke="#38BDF8" stroke-width="2"/>
      <rect x="115" y="330" width="140" height="90" rx="6" fill="#F8FAFC"/>
      <rect x="545" y="330" width="140" height="90" rx="6" fill="#F8FAFC"/>
    `;
  } else if (view === 'interior_counter') {
    scene = `
      <rect x="80" y="35" width="640" height="18" rx="9" fill="#00C2FF" opacity="0.45"/>
      <rect x="90" y="75" width="620" height="210" rx="12" fill="#101114" stroke="#334155" stroke-width="3"/>
      <text x="400" y="155" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="36" letter-spacing="2">CHARLIE MOBILE</text>
      <text x="400" y="190" text-anchor="middle" fill="#00C2FF" font-family="sans-serif" font-weight="700" font-size="15" letter-spacing="3">AUTHORIZED MULTI-BRAND SHOWROOM</text>
      <rect x="110" y="305" width="580" height="145" rx="12" fill="#1E293B" stroke="#38BDF8" stroke-width="3"/>
      <rect x="130" y="322" width="540" height="55" rx="6" fill="#0F172A" stroke="#00C2FF" stroke-width="1.5"/>
      <rect x="180" y="272" width="28" height="34" rx="4" fill="#38BDF8"/>
      <rect x="280" y="272" width="28" height="34" rx="4" fill="#F8FAFC"/>
      <rect x="380" y="272" width="28" height="34" rx="4" fill="#38BDF8"/>
      <rect x="480" y="272" width="28" height="34" rx="4" fill="#F8FAFC"/>
      <rect x="580" y="272" width="28" height="34" rx="4" fill="#38BDF8"/>
    `;
  } else {
    scene = `
      <rect x="70" y="55" width="660" height="390" rx="14" fill="#101114" stroke="#2563EB" stroke-width="3"/>
      <text x="400" y="102" text-anchor="middle" fill="#00C2FF" font-family="sans-serif" font-weight="800" font-size="22" letter-spacing="2">GENUINE ACCESSORIES &amp; WEARABLES ZONE</text>
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
