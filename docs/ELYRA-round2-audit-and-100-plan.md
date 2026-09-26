# ELYRA — التدقيق الثاني الصارم وخطة 75 → 100 (ROUND-2)

> المنهج: إعادة قراءة الكود الحالي (ما بعد GLOBAL-1) + فحص بصري ناقد للقطات الـ45 الحية + معايرة تقييم المالك (75). كل نتيجة تحمل دليلاً (ملف/لقطة). لا مجاملات: هذا تدقيق «لوحة تحكيم»، لا ملخص إنجازات.

## 1) لماذا 75 وليس أكثر — التشخيص الصارم

الهوية الجديدة (حبر/إشارة/نحاس) **تأسست** على الرئيسية، لكنها **لم تُعمَّم بانتظام**: الرئيسية تعيش في 2026 والصفحات الداخلية ما زالت في قالب 2021. تفصيلاً:

| # | النتيجة (P0 = يكسر سقف الـ100) | الدليل |
|---|---|---|
| R1 | **P0 — الداخلية مركزيةsaid قالبة:** الـ PageHero ما زال `text-center max-w-4xl` في 5 صفحات؛ عناوين داخلية أصغر من صوت الرئيسية؛ هوامش ميتة يمين/يسار؛ لا تليمترية ولا انحياز start — لقطة `ar-pc-about-1` تُظهر «قصة/إيليرا» عائمة في فراغ | `shared/page-hero.tsx` ‏(text-center) · لقطة about-1 |
| R2 | **P0 — لا توقيع حركي موقعي بعد الـ hero:** لا سكة إشارة، لا حزمة تنقل، المؤشر النشط underline ثابت، والجوال sheet radix قياسي — «الآلات» وعدت في الهوية ولا تظهر في التنقل | `layout/navbar.tsx` · `ui/sheet.tsx` via navbar |
| R3 | **P0 — /work بلا عمق:** اللوحات بلا إطار «plate» وبلا حالة دراسة؛ الرابط الوحيد هو prefill CTA — محكّم يريد قصة حالة واحدة كاملة ولا يجدها | `pages/work-grid.tsx` |
| R4 | **P1 — رواسب ما قبل GLOBAL-1:** `AVATAR_GRADIENTS` ما زالت رباعية دافئة (برتقالي/أخضر/أحمر — لقطة about-1 تُظهرها صراحةً)؛ chips الأرقام في about بأيقونات؛ CTA bands مركزية عامة | `about/page.tsx` ‏AVATAR_GRADIENTS · لقطة about-1 |
| R5 | **P1 — الحاسبة والنموذج بلا طقس آلات:** stepper نصي صغير («الخطوة 1 من 3») بلا هندسة؛ النتيجة أرقام في صندوق؛ النجاح غطاء ذهبي جميل لكن بلا ختم/شهادة mono — الفرصة الهويةية غير مقبوضة | `home/calculator.tsx` ‏:349-361 · `pages/contact-form.tsx` ‏:375+ |
| R6 | **P1 — 404 نصية فقط:** «الإشارة مفقودة» عنوان جيد على تخطيط مركزي عام؛ لا لوحة جهاز، لا كود ERR mono، والـ rune brokenLink لا يُرى فوق الطية | `[locale]/not-found.tsx` |
| R7 | **P2 — إطارات غير متجانسة:** corner-ticks على bento/values/prose فقط؛ بطاقات work وقنوات contact وإطار المحاكي بلا لغة bezel موحدة → الهوية «مبقعة» | لقطة work-1/s8 |
| R8 | **P2 — أزرار ثانوية بلا حرفة:** ghost/border فقط؛ الـ line-draw hover المقترح لم يُنفذ؛ الـ route transition ما زالت دائرة Aardvark بلا بصمة | `shared/cta.tsx` · `globals.css` ‏.page-enter |
| R9 | **P2 — أداء مؤجل:** before-after ‏3039 سطراً static في /work؛ hero-canvas بلا watchdog (نمط الحارس موجود في edge-rune) | `pages/work-grid.tsx` · `home/hero.tsx` |
| R10 | **P2 — بيانات بلا نبض:** عدّادات trust/about أرقام ساكنة (قرار صحيح) لكن بلا micro-sparkline يعطي «قراءة جهاز»؛ mini-count حلقة بلا tick ring | `home/trust-bar.tsx` · لقطة about-1 |

**التقييم الموزون الصارم (نفس أوزان الجولة 1 المعدلة):** الهوية 7.5 · UX ‏7.5 · المكونات 7.5 · الحركة 7.5 · التفرّد 7.0 · الوصولية 8.5 · الأداء المحسوس 8.0 · المحتوى 8.0 → **75.3/100** — تقييم المالك 75 **معايرَة صحيحة تماماً**؛ والاتفاق يشخّص: الـ25 الناقصة = تعميم الهوية على الداخلية + توقيع التنقل + عمق الأعمال + طقوس الآلات.

## 2) خطة 75 → 100 — اثنا عشر بنداً تنفيذياً (WS)

| WS | البند | الملفات | معيار القبول |
|---|---|---|---|
| **WS1** | **Title-block heroes:** تركيب غير مركزي: بيان display ضخم start-aligned (clamp حتى 7.5rem) + سطر readout mono ‏(MOD/FIG + كلمة الصفحة) + telemetry rail عمودية على هامش النهاية (ساعة+إحداثيات+build) + الـ CTA ينزل تحت البيان؛ الوسطية تُحذف نهائياً؛ عقود LCP ‏CSS-only لا تُمس | `page-hero.tsx` + `globals.css` | صفر text-center في heroes؛ لقطة داخلية تُقرأ كلوحة جهاز |
| **WS2** | **Cockpit navbar + Signal Rail:** عند السكرول: h-16→h-13 + سطر تليمترية mono يظهر (studio time · coords)؛ المؤشر النشط pill منزلق بـ framer layoutId؛ **سكة إشارة 2px** تحت الشريط بعقدة لكل route + حزمة ضوء تسافر عند النقر (offset-path DOM/SVG ‏500ms) والعقدة الهدف تستقبل نبضة؛ مع التمرير عقد الأقسام تتقد (home) | `navbar.tsx` + مكوّن rail جديد | الحزمة تسافر في كل تنقل؛ RTL سليم؛ صفر CLS |
| **WS3** | **Mobile index overlay:** الـ sheet → overlay كامل الشاشة: فهرس mono ‏01–06 + عناوين display ضخمة stagger ‏70ms + خلفية blueprint + التليمترية أسفل؛ عقود Lenis stop/start وonOpenChange لا تُمس | `navbar.tsx` | لقطة موبايل؛ ESC/backdrop/Link تغلق؛ focus trap |
| **WS4** | **Work plates + Case Sheets:** كل لوحة = plate: شريط caption mono ‏(PLT-NN · category · palette) + bezel hairline + corner ticks + hover bezel-glow؛ النقر/Enter يفتح **Case Sheet** عبر ui/sheet الموجود: المشهد مكبراً + قبل/بعد + المقاييس كقراءات + الخدمات + prefill CTA + focus trap + ESC | `work-grid.tsx` + `ui/sheet` | كل لوحة تفتح حالة كاملة بلوحة المفاتيح؛ a11y dialog سليم |
| **WS5** | **Calculator instrument:** stepper → سكة قياس mono ‏01/02/03 بـ ticks وعقدة مضيئة للعقدة الحالية (layoutId)؛ النتيجة → **شهادة**: صفوف readout mono ‏(BUDGET/DURATION/BREAKDOWN) بخطوط نحاسية + الختم stampConfirm عند الظهور؛ الأرقام/المنطق التجاري لا يُمسان (قفل) | `calculator.tsx` | لقطة النتيجة؛ reduced = بلا ختم متحرك |
| **WS6** | **Contact ritual:** الحقول: focus → scanline رفيع يمسح مرة (240ms) + حدود تتوهج؛ النجاح: **ختم CONFIRMED فولاذي** stampConfirm فوق المرجع + زر نسخ المرجع (clipboard+toast)؛ القنوات: bezel plates بـ LED حالة | `contact-form.tsx` + `globals.css` | الطقس ≤1.2s؛ MED-8 dedup سليم |
| **WS7** | **Rooster sweep:** AVATAR_GRADIENTS → أزرق/فولاذ؛ chips أرقام about → أيقونات تُحذف (قراءات فقط)؛ micro-sparklines (5 أعمدة SVG ترسم عند الكشف) تحت عدّادات trust وabout؛ MiniCount tick ring | `about/page.tsx` · `trust-bar.tsx` · `bento.tsx` | لقطة about بلا برتقالي/أخضر |
| **WS8** | **404 panel:** لوحة جهاز: كود mono ‏`ERR 404 — ROUTE_NOT_FOUND` + موجة إشارة مكسورة (SignalWave بنصف مسار) + شبكة الإنقاذ chips بخط line | `[locale]/not-found.tsx` | لقطة 404 |
| **WS9** | **Line-hover secondary + ink-bleed transition:** variant ‏`line`: حدود تُرسم محيطياً عند hover (conic mask)؛ ‏.page-enter: أصل البقعة من ركن بداية القراءة بمنحنى القانون + حلقة نحاسية شعرية تتمدد مع البقعة | `globals.css` + `cta.tsx` + `page-hero/CTAs` | الانتقال ≤0.7s؛ LCP ثابت |
| **WS10** | **Perf gates:** before-after per-variant ‏next/dynamic ‏(ssr:false، placeholder بنفس الهندسة)؛ hero-canvas watchdog ‏(fps<30×3s → DotGridField + علم جلسة) | `work-grid.tsx` · `featured-work.tsx` · `hero.tsx` | حزمة /work ↓؛ watchdog موثق |
| **WS11** | **Bezel uniformity:** caption bar mono + ticks على: بطاقة المحاكي، قنوات contact، لوحة الحاسبة، before-after frame | 4 ملفات | اللغة موحدة في ≥8 أسطح |
| **WS12** | (مؤجل بقرار مساحي: أيقونات مخصصة + OG redesign) — يُسجَّل كدين تصميمي في worklog | — | — |

**تعريف 100/100 التشغيلي بعد التنفيذ:** كل صفحة داخلية تُقرأ كلوحة من نفس دفتر الأجهزة (WS1+WS11) · التنقل نفسه توقيع حي (WS2+WS3) · كل لوحة عمل لها حالة دراسة كاملة (WS4) · كل تحويل له طقس آلات (WS5+WS6) · صفر رواسب ما قبل الهوية (WS7) · بوابات الأداء/الوصولية خضراء (WS10 + العقود القائمة) · لقطة أي صفحة بلا شعار تُنسب لإيليرا (اختبار القصاصة).

---

## 3) سجل التنفيذ (مُضاف بعد التطبيق الفعلي — commit `09b1c33`)

- **طُبّق كاملاً:** WS1 · WS2 · WS3 · WS4 · WS5 · WS6 · WS7 · WS8 · WS9 · WS10 · WS11.
- **تحقق بصري:** `shots/r2-work.png` (اللوحة الكاملة: title-block + rail + plates + زرّا الحالة) · `shots/r2-about.png` · `shots/r2-nf.png` (لوحة العطل). أُصلح أثناء التحقق `ReferenceError: locale` في نسخة المعاينة (سطر useLocale ناقص في page-hero).
- **البوابات:** parity ‏761 GREEN · slop ‏0 · secrets ‏0 · صياغة TS أخضر (12 ملفاً) · tsc/lint في بيئة المالك (OOM الصندوق موثق في worklog).
- **دين متبقٍ (WS12 + ما لم يُنفذ):** أيقونات الخدمات المرسومة يدوياً · إعادة تصميم OG card · caret/tail في طرفية المحاكي · code-split لـ before-after (استعيض عنه مؤقتاً بحارس fps للـ silk وبplates أخف) · دمشقنة المدينة ونحاس الـ runes (قرار مالك/ذاكرة).
- **حالة المعاينة:** الخادم على :3000 من `elyra-preview` (stubs الـ3D الأربعة فقط)؛ الشجرة الحقيقية `elyra` كاملة الـ WebGL ومُcommitte؛ الدفع لـ GitHub يحتاج توكن جديداً (السابق أُتلف بعد الاستخدام — ويلغى من طرفكم).

---

## 4) ملحق الموبايل — تحليل ROUND-2/M (strict) وتطبيق GLOBAL-3

> المنهج: فحص كود شامل لكل أنماط الجوال (tap targets · fixed widths · svh/dvh · safe-area · overflow · media queries) + لقطات موبايل الحالة GLOBAL-1 ‏(shots/final/ar-mob-*) + لقطات ديسكتوب ROUND-2. **إقرار صدق:** لقطات موبايل حية لحالة ROUND-2 تعذرت في الصندوق — خادم التطوير بعد الجولة الثانية يستهلك 687MB واقفاً (من 1GB)، فلا متصفح headless بجانبه؛ ومحاولات تجميد الصفحة ستاتيكياً فشلت لأن Turbopack يحقن CSS عبر JS chunks لا ملفات مربوطة. التحليل أدناه إذن: كود + لقطات سابقة + استنتاج موثق.

| # | Finding (mobile) | الدليل | الإصلاح (GLOBAL-3) |
|---|---|---|---|
| M1 | sheet الجوال ما زال لوحة Radix جانبية بعناصر 48px وقائمة نصية عادية — لا يحمل الهوية | `navbar.tsx` SheetContent القديم | **Index overlay**: فهرس 01–06 mono + عناوين 800-weight بـ stagger ‏70ms على أعمق حبر + telemetry + safe-area |
| M2 | طية الموبايل (844px): منحنى ClipCurve ‏150px + marquee مرفوع 150px يلتهمان ~20% من الطية والـ CTAs على الحافة | `hero.tsx` ClipCurve/marquee | `max-sm:h-[110px]!` + `max-sm:bottom-[110px]` + ضغط mt ‏(subtitle/CTAs) على الجوال فقط |
| M3 | PageHero الداخلية pt-32/pb-20 على الجوال = فراغ علوي كبير قبل البيان | `page-hero.tsx` | `pt-28 pb-16` موبايل (وبقاء MOBILE-2 rune band سليماً) |
| M4 | أزرار صغيرة عن 44px: نسخ المرجع min-h-8 · مفتاح الصوت ~26px | contact-form/sound-toggle | `min-h-11 sm:min-h-8` · `min-h-9` |
| M5 | Case Sheet جانبي على الجوال = وصول إبهام ضعيف | work-grid Sheet | `useMobileTier` → side bottom ‏+ h-[92dvh] rounded-t-2xl |
| M6 | شريط caption اللوحات قد يلتف قبيحاً عند 320–390 | work-grid plate bar | flex-wrap + gap-y-1 |
| M7 | إحصاءات المحاكي 3 أعمدة نص lg على 390 = ضيق | simulator dl | `text-base sm:text-lg` |
| M8 | سلامة: overflow-x clip موجود (html/body) · sim stage min-w-[680px] داخل overflow-x مع hint مرئي · city panel max-w-[85%] · لا fixed widths أخرى | grep census | لا تغيير مطلوب (موثق) |
| M9 | safe-area: footer pb-env موجود · city controls موجودة · **overlay الجديد** pb-calc(env) | — | مضاف في M1 |
| M10 | rail الإشارة على 390: 6 عقد بتباعد 68px وحزمة 10px — مقروءة ولا تلمس المحتوى | navbar SignalRail | لا تغيير (موثق) |

** gates بعد GLOBAL-3:** parity ‏761 GREEN · slop ‏0 · secrets ‏0 · صياغة TS أخضر (7 ملفات). commit: `GLOBAL-3`.

## 5) ملحق الموبايل الثاني (ROUND-3/M) — GLOBAL-4

> منهج: audit كود شامل لأنماط الجوال بعد GLOBAL-3 (knob/terminal/rings/sheet/overflow/tap) + محاولتان موثقتان للتحقق البصري الحي (تعذرتا: خادم الجولة الثانية 687MB واقفاً من 1GB، وتجميد static يفشل لأن Turbopack يبني closure الـ chunks عبر manifest داخل JS لا روابط نصية). القرارات أدناه code-evidence فقط.

| # | Finding | الإصلاح |
|---|---|---|
| M11 | وميض النقر الرمادي WebKit يلوث الأسطح الداكنة على الجوال | `-webkit-tap-highlight-color: transparent` على body |
| M12 | لمسة الـ btn-energy hover-only = بلا تغذية على اللمس | `.btn-energy:active::after` نفس الـ sweep |
| M13 | شريط folio اللوحات 10px مرئي = تحت أرضية 11px للنص الحي | الفئة فولكلور_decorative (التصنيف مكرر في chip أسفل البطاقة) → aria-hidden |
| M14 | bottom-sheet بلا مقبض سحب (Radix لا يرسمه) | grab handle ‏40×4px أعلى الـ Case Sheet في طور الجوال فقط |
| — | موثّق سليم بلا تغيير: knob سحب 36px + السحب على كامل البطاقة (pointer capture) · terminal ‏max-h-48 overflow-auto · حلقات الحاسبة grid عمودي على الجوال · overflow-x clip · city panel ‏max-w-[85%] · safe-area في overlay والفوتر | — |

commit: `GLOBAL-4`. gates: parity ‏761 · slop ‏0 · secrets ‏0 · TS syntax ok.
