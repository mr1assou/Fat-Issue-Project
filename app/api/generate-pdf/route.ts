import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

// To ensure images are loaded correctly from local files in Puppeteer, 
// we will embed them as base64 or construct localhost URLs.
// Since Next.js is running, we can just use full absolute URLs if we know the host, 
// but it's safer to use base64 for PDF generation so it doesn't depend on networking.
import fs from 'fs';
import path from 'path';

const DEFAULT_PLAN_TEXT = `INTRODUCTION

Achieving fat loss and enhancing metabolic health are essential for leading a vibrant, energetic life. Losing weight not only improves how you feel physically but also boosts your confidence and overall well-being. It’s important to adopt a sustainable approach, one that focuses on nourishing your body while addressing your weight loss goals. Together, we’ll create a plan tailored just for you!

USER PROFILE ANALYSIS

From the information you've shared, we understand that you’re a 30-year-old male with a height of 180 cm and current weight of 90 kg. You're aiming to reach a target weight of 75 kg. Your activity level is low, and while you typically eat three meals a day, you often consume fast food. This plan will focus on transitioning you toward healthier choices while gradually incorporating more movement, aiming to increase your energy levels along the way.

BODY & METABOLISM ANALYSIS

Your body needs a certain amount of calories to maintain its current weight, which comes from your Basal Metabolic Rate (BMR) combined with your activity level (Total Daily Energy Expenditure, TDEE). By consuming fewer calories than your body uses, you will start to lose weight. This works because your body taps into stored fat for energy.

CALORIE STRATEGY

To lose weight, you will be operating at a calorie deficit, which means you will consume fewer calories than your body requires to maintain its current weight. This deficit encourages your body to use stored fat for energy, which leads to weight loss over time.

FAT LOSS STRATEGY

Your journey towards your target weight will be gradual, focusing on around 0.5 kg of weight loss per week, making this sustainable. As you start making better food choices and increasing physical activity, you may notice increased energy levels and improvements in your overall health.

FULL 7-DAY DIET PLAN

We'll structure this for each day with specific focus areas for meals and activities.

DAY 1 - COMPLETE DAILY PLAN

Daily Objective

Today’s goal is to kickstart fat burning while introducing healthy habits. We’ll focus on balancing your meals with nutritious options to sustain your energy.

Full Meal Plan

Breakfast: Omelette with two eggs, tomatoes, and spinach. (High protein for energy and healthy fats.)

Lunch: Grilled chicken salad with mixed greens and vinaigrette. (Protein-rich to fuel your day with vitamins from vegetables.)

Dinner: Baked salmon with quinoa and steamed broccoli. (Great source of omega-3, fiber, and proteins.)

Snacks: A piece of fruit like an apple or a handful of nuts. (Healthy snack to avoid processed foods.)

Daily Routine

Morning: Start your day with the omelette, hydrate with water, and consider a 10-minute walk after breakfast to boost morning energy.

Midday: Enjoy your grilled chicken salad for lunch and stay hydrated.

Evening: Aim for dinner around 7 PM. Post-dinner light stretching can help relax your body.

Night: Try to get to bed around the same time each night, aiming for 7-9 hours of sleep to support recovery.

Physical Activity (Daily)

Consider a gentle walk for 20-30 minutes. This helps your body burn more calories and enhances weight loss.

Daily Tips

1. Start watching portion sizes, especially with fast food.

2. Drink plenty of water throughout the day.

3. Try to include at least one vegetable in every meal.

Explanation

Your body begins to tap into its stored fat for energy, which is essential for weight loss. This adaptation is crucial as you shift towards healthier eating and a more active lifestyle.

DAY 2 - COMPLETE DAILY PLAN

Daily Objective

Today focuses on sustaining energy levels while incorporating more whole foods into your diet.

Full Meal Plan

Breakfast: Greek yogurt with mixed berries and a sprinkle of granola. (Good source of protein and antioxidants.)

Lunch: Turkey wrap with whole grain tortilla, lettuce, and mustard. (Lean protein and whole grains will keep you full longer.)

Dinner: Stir-fried vegetables with tofu and brown rice. (Fiber-rich to promote digestion and vitamins for overall health.)

Snacks: Carrot sticks with hummus. (Healthy fats and fiber for snacking.)

Daily Routine

Morning: Enjoy Greek yogurt and hydrate to kickstart your metabolism.

Midday: Eat your turkey wrap and focus on hydration.

Evening: Have your stir-fry around 6:30 PM, and take a 15-minute light evening walk post-dinner to wind down.

Night: Maintain a consistent bedtime.

Physical Activity (Daily)

Engage in light stretching or yoga for about 20-30 minutes to enhance flexibility and relieve stress.

Daily Tips

1. Prep your meals in advance to avoid fast food temptations.

2. Choose whole grain options wherever possible.

3. Stay mindful when eating, focusing on your food.

Explanation

Your body is utilizing fat for energy, especially when you provide it with wholesome foods. Small consistent changes lead to significant results over time!

DAY 3 - COMPLETE DAILY PLAN

Daily Objective

Focus on satisfying meals that curb cravings and encourage balanced nutrition.

Full Meal Plan

Breakfast: Smoothie with spinach, banana, and peanut butter. (Nutritious and filling for a healthy start.)

Lunch: Quinoa bowl with black beans, avocado, and salsa. (Packed with protein and healthy fats.)

Dinner: Grilled chicken breast with sweet potatoes and green beans. (Combines proteins and complex carbs for energy balance.)

Snacks: Greek yogurt. (Light and high in protein.)

Daily Routine

Morning: Start with your smoothie, ensuring hydration.

Midday: Relish your quinoa bowl; it’s nutritious and satisfying.

Evening: Dinner around 7 PM, followed by light stretching.

Night: Focus on getting enough sleep tonight.

Physical Activity (Daily)

Consider a simple 30-minute walk after dinner to promote digestion and relaxation.

Daily Tips

1. Try to limit fast food to once or twice a week.

2. Experiment with new fruits and vegetables to keep meals exciting.

3. Focus on mindfulness during meals.

Explanation

Your body is adapting to using fat as a primary energy source, which is beneficial for weight loss when paired with healthier food choices!

DAY 4 - COMPLETE DAILY PLAN

Daily Objective

Reinforce focusing on nutrition and staying active while observing your body's responses.

Full Meal Plan

Breakfast: Overnight oats with chia seeds and sliced banana. (Rich in fiber and keeps you full.)

Lunch: Lentil soup with whole-grain bread. (High in fiber and protein to sustain energy.)

Dinner: Homemade vegetable stir fry with brown rice. (Packed with nutrients and low in calories.)

Snacks: A handful of almonds. (Healthy fats and protein for snacking.)

Daily Routine

Morning: Enjoy your overnight oats, hydrate, and aim for a short walk.

Midday: Savor your lentil soup for lunch while staying hydrated.

Evening: Have your stir fry at a reasonable hour, incorporating a light evening walk afterward.

Night: Strive for consistency in your sleep schedule.

Physical Activity (Daily)

A combination of a brisk walk and light stretches for 20-30 minutes will be beneficial.

Daily Tips

1. Keep nut portions in check as they are calorie-dense.

2. Explore new recipes to keep meals exciting and healthy.

3. Embrace eating slowly to appreciate your food more.

Explanation

Your body becomes more efficient at burning fat for energy, and by fueling it with quality nutrition, you're setting yourself up for long-term success!

DAY 5 - COMPLETE DAILY PLAN

Daily Objective

Enhance your focus on whole foods and maintain momentum.

Full Meal Plan

Breakfast: Scrambled eggs with avocado on whole-grain toast. (Healthy fats and protein set a great tone for the day.)

Lunch: Chicken Caesar salad (light dressing). (A good mix of protein and greens to meet your needs.)

Dinner: Baked tilapia with quinoa and a side of mixed vegetables. (Lean protein paired with nutritious grains and veggies.)

Snacks: Sliced cucumber with hummus. (Low-calorie, nutrient-dense snack.)

Daily Routine

Morning: Enjoy your breakfast, hydrate, and incorporate a short walk.

Midday: Savor your salad and maintain hydration.

Evening: Dinner around 7 PM, follow it up with light yoga.

Night: Stick to a consistent bedtime routine.

Physical Activity (Daily)

Engaging in a 30-minute home workout with bodyweight exercises can mix up your routine.

Daily Tips

1. Limit sugary drinks; opt for water or herbal tea instead.

2. Consider planning meals for the week to make it easier.

3. Take mindful breaks during the day to check in with your hunger levels.

Explanation

As your body gets accustomed to nutritious foods, you’ll find it easier to resist cravings, boosting your weight loss journey even further!

DAY 6 - COMPLETE DAILY PLAN

Daily Objective

Stay committed to your goals and continue cultivating healthy habits.

Full Meal Plan

Breakfast: Whole grain pancakes topped with fresh berries. (A delicious, energizing start to the day!)

Lunch: Grilled shrimp over a garden salad. (Light yet providing good proteins and vitamins.)

Dinner: Vegetable curry with chickpeas and brown rice. (A flavorful combination packed with fiber and protein.)

Snacks: A small serving of mixed nuts. (Nourishing and satisfying.)

Daily Routine

Morning: A hearty breakfast to fuel your day followed by hydration.

Midday: Relish your shrimp salad while staying hydrated.

Evening: Enjoy your dinner; try a short meditation to unwind afterward.

Night: Consistency in sleep helps proper recovery.

Physical Activity (Daily)

Try combining a walking and low-intensity workout for about 30 minutes for an effective routine.

Daily Tips

1. Find easy, healthy recipes to cook; this makes meal prep more enjoyable.

2. Reward yourself with non-food-related rewards for hitting small milestones.

3. Set a hydration goal for the day to ensure you drink enough water.

Explanation

Your metabolism is adapting to its new routine, utilizing energy from food better while burning stored fat effectively!

DAY 7 - COMPLETE DAILY PLAN

Daily Objective

Celebrate your week of commitment and reflection as it leads to positive change!

Full Meal Plan

Breakfast: Smoothie bowl topped with nuts and seeds. (Packed with nutrients and flavors!)

Lunch: Quinoa salad with greens, chickpeas, and a lemon vinaigrette. (Nutrition-dense and filling.)

Dinner: Grilled chicken fajitas with peppers served in lettuce wraps. (Lean protein and low-carb wrap.)

Snacks: Yogurt with sliced fruit. (High in protein and refreshing.)

Daily Routine

Morning: Kickstart your day with a flavorful smoothie bowl and hydrate.

Midday: Enjoy the refreshing quinoa salad and stay hydrated throughout the day.

Evening: Dinner paired with mindfulness as you enjoy each bite.

Night: Reflect on the week and plan for the next week, making adjustments as needed for continued success.

Physical Activity (Daily)

Take a relaxing 30-minute walk to normalize your end-of-week feelings while setting intentions.

Daily Tips

1. Acknowledge your progress over the week.

2. Share your journey with a friend to build accountability.

3. Keep experimenting with healthy recipes for variety.

Explanation

With consistent effort, your metabolic rate is improving, ensuring your body uses more stored fat for energy!

Summary: You've made an incredible decision by taking this step towards better health and weight loss. This structured plan will encourage your body to naturally lose weight while improving your overall energy and well-being. Stick to this plan and watch how small changes lead to impactful results. You've got this!`;

function getBase64Image(filename: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'images', filename);
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filename).substring(1);
    const mime = ext === 'jpg' ? 'jpeg' : ext;
    return `data:image/${mime};base64,${data.toString('base64')}`;
  } catch (error) {
    console.error(`Failed to load image ${filename}`, error);
    return '';
  }
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Known day sub-section labels — match regardless of bullet/number prefix
const SECTION_NAME_RE = /^(Daily Objective|Full Meal Plan|Daily Routine|Physical Activity(\s*\(Daily\))?|Daily Tips|Explanation)$/i;
// Meal lines that start with Breakfast:/Lunch:/Dinner:/Snacks:
const MEAL_LINE_RE = /^(Breakfast|Lunch|Dinner|Snacks?):\s*(.*)/i;
// Strip any leading bullets, markdown #, or numbers from a line
function stripMarkers(line: string): string {
  return line
    .replace(/^[#]+\s*/, '')      // ## ### headings
    .replace(/^[•\-*]+\s*/, '')   // bullets • - *
    .replace(/^\d+\.\s*/, '')     // numbered: 1.
    .trim();
}

function formatPlanToHtml(planText: string) {
  const lines = planText.split('\n');
  const introParts: string[] = [];
  const daySections: string[] = [];
  const summaryParts: string[] = [];

  let currentTarget = introParts;
  let currentDayParts: string[] = [];
  let inList = false;
  let sectionNum = 0;

  const closeList = () => { if (inList) { currentTarget.push('</ul>'); inList = false; } };

  const ensureInDay = () => {
    if (currentTarget !== currentDayParts) {
      currentDayParts = []; currentTarget = currentDayParts; sectionNum = 0;
    }
  };

  const pushDay = () => {
    closeList();
    if (currentDayParts.length > 0) {
      daySections.push(`<section class="page-block day-block">${currentDayParts.join('\n')}</section>`);
      currentDayParts = []; sectionNum = 0;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) { closeList(); continue; }

    // Skip pure separator lines --- === ~~~
    if (/^[-=~]{3,}$/.test(line)) continue;

    // ── Day banner (DAY 1 - / DAY 1 – / ## DAY 1)
    if (/^(#+\s*)?DAY\s+\d+\s*[-–—]/i.test(line)) {
      pushDay();
      ensureInDay();
      const title = stripMarkers(line);
      currentTarget.push(`<h2 class="day-title">${escapeHtml(title)}</h2>`);
      continue;
    }

    // ── Summary page
    if (/^Summary:/i.test(line)) {
      closeList(); pushDay();
      currentTarget = summaryParts;
      currentTarget.push('<h1 class="section-title">SUMMARY</h1>');
      currentTarget.push(`<p class="para">${escapeHtml(line.replace(/^Summary:\s*/i, ''))}</p>`);
      continue;
    }

    // Strip all prefix markers to get the raw content
    const content = stripMarkers(line);
    const safeContent = escapeHtml(content);
    // Did this line originally have a bullet/number marker?
    const hadMarker = /^([#•\-*]|\d+\.)/.test(line);

    // ── ALL-CAPS intro headings (INTRODUCTION, USER PROFILE ANALYSIS…)
    //    Only on lines with NO bullet marker
    if (!hadMarker && /^[A-Z][A-Z\s&\-]{4,}$/.test(content)) {
      closeList();
      currentTarget.push(`<h1 class="section-title">${safeContent}</h1>`);
      continue;
    }

    // ── KNOWN SECTION NAMES → highlighted numbered strip
    //    Matches whether written as plain, bullet, or ## heading
    if (SECTION_NAME_RE.test(content)) {
      closeList();
      sectionNum++;
      currentTarget.push(
        `<div class="section-heading"><span class="section-num">${sectionNum}</span>${safeContent}</div>`
      );
      continue;
    }

    // ── Meal lines: "Breakfast: text" / "Lunch: text" etc.
    const mealMatch = content.match(MEAL_LINE_RE);
    if (mealMatch) {
      closeList();
      const label = escapeHtml(mealMatch[1]);
      const text  = escapeHtml(mealMatch[2]);
      currentTarget.push(
        `<div class="meal-row"><span class="meal-label">${label}</span><span class="meal-text">${text}</span></div>`
      );
      continue;
    }

    // ── Bullet / numbered items that are NOT section names → list
    if (hadMarker) {
      if (!inList) { currentTarget.push('<ul class="list">'); inList = true; }
      currentTarget.push(`<li>${safeContent}</li>`);
      continue;
    }

    // ── Everything else → paragraph
    closeList();
    currentTarget.push(`<p class="para">${safeContent}</p>`);
  }

  closeList(); pushDay();

  const blocks: string[] = [];
  if (introParts.length > 0)
    blocks.push(`<section class="page-block intro-block">${introParts.join('\n')}</section>`);
  blocks.push(...daySections);
  if (summaryParts.length > 0)
    blocks.push(`<section class="page-block summary-block">${summaryParts.join('\n')}</section>`);
  return blocks.join('\n');
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as any));
    const userName = typeof body?.userName === 'string' && body.userName.trim() ? body.userName.trim() : 'Guest';
    const planText =
      typeof body?.planText === 'string' && body.planText.trim()
        ? body.planText.trim()
        : DEFAULT_PLAN_TEXT;

    const img1Cover = getBase64Image('healthy.png');
    const planHtml = formatPlanToHtml(planText);

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FitlyAi Personalized Plan</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    @page {
      size: A4;
      margin: 10mm 13mm 10mm;
    }
    @page:first {
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Inter', sans-serif;
      background: #ffffff;
      color: #111827;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .cover-page {
      width: 100%;
      height: 297mm;
      page-break-after: always;
      position: relative;
    }
    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .cover-overlay {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 32px 42px;
      background: linear-gradient(to top, rgba(0,0,0,0.70), rgba(0,0,0,0.05));
      color: #fff;
    }
    .cover-heading {
      font-size: 34px;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 8px;
    }
    .cover-meta {
      font-size: 14px;
      opacity: 0.92;
    }
    .content {
      padding: 0;
    }
    .page-block {
      page-break-before: always;
    }
    .day-block {
      break-after: page;  /* force each day to fill exactly one page */
    }
    .intro-block {
      page-break-before: auto;
    }
    .section-title {
      font-size: 22px;
      font-weight: 800;
      margin: 18px 0 10px;
      color: #0f172a;
      letter-spacing: 0.2px;
      border-left: 4px solid #2563eb;
      padding-left: 10px;
      page-break-after: avoid;
    }
    .day-title {
      font-size: 21px;
      font-weight: 800;
      margin: 0 0 16px;
      padding: 14px 20px;
      color: #fff;
      background: linear-gradient(135deg, #1e3a8a, #2563eb);
      border-radius: 10px;
      page-break-after: avoid;
    }
    /* Day section numbered highlight strip */
    .section-heading {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13.5px;
      font-weight: 700;
      margin: 18px 0 8px;
      padding: 8px 14px;
      color: #1e40af;
      background: #eff6ff;
      border-left: 4px solid #2563eb;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      page-break-after: avoid;
    }
    .section-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      min-width: 22px;
      background: #2563eb;
      color: #fff;
      border-radius: 50%;
      font-size: 11px;
      font-weight: 800;
    }
    /* Meal row: Breakfast / Lunch / Dinner / Snacks */
    .meal-row {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin: 8px 0;
      padding: 10px 14px;
      background: #f8fafc;
      border-left: 3px solid #93c5fd;
      border-radius: 6px;
    }
    .meal-label {
      font-size: 13.5px;
      font-weight: 700;
      color: #1e40af;
      min-width: 72px;
      flex-shrink: 0;
    }
    .meal-text {
      font-size: 14px;
      line-height: 1.6;
      color: #374151;
    }
    .para {
      font-size: 14px;
      line-height: 1.7;
      color: #374151;
      margin: 0 0 10px;
    }
    .list {
      margin: 6px 0 14px 20px;
      padding: 0;
    }
    .list li {
      font-size: 13.5px;
      line-height: 1.65;
      color: #374151;
      margin: 4px 0;
    }
  </style>
</head>
<body>
  <div class="cover-page">
    <img src="${img1Cover}" alt="Cover image" class="cover-image" />
    <div class="cover-overlay">
      <div class="cover-heading">Personalized Fat Loss Plan</div>
      <div class="cover-meta">Prepared for: ${escapeHtml(userName)}</div>
    </div>
  </div>
  <div class="content">
    ${planHtml}
  </div>
</body>
</html>
    `;

    // Launch Puppeteer to generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      preferCSSPageSize: true,
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    });

    await browser.close();

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="FitlyAi-PersonalizedPlan.pdf"',
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
