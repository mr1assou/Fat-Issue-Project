import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

// To ensure images are loaded correctly from local files in Puppeteer, 
// we will embed them as base64 or construct localhost URLs.
// Since Next.js is running, we can just use full absolute URLs if we know the host, 
// but it's safer to use base64 for PDF generation so it doesn't depend on networking.
import fs from 'fs';
import path from 'path';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      userName = 'Guest', 
      planType = 'premium', 
      dailyCalories = 2500, 
      weight = '80 kg',
      goal = 'lose weight',
      activity = 'active',
      /** When true (e.g. paid basic), include full 7-day meals like premium. */
      fullMealPlan = false,
    } = body;

    // Load images as base64
    const img1Cover = getBase64Image('healthy.png'); // Image 1
    const img2Intro = getBase64Image('fat.png'); // Image 2
    const img3Diet = getBase64Image('ready.png'); // Image 3
    const img4Tips = getBase64Image('after-refreshed.png'); // Image 4

    const isPremium = planType === 'premium' || fullMealPlan === true;
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your Personalized Weight Loss Plan</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      color: #1f2937;
      line-height: 1.6;
      background-color: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Page Breaks for PDF */
    .page-break {
      page-break-before: always;
    }
    
    .section {
      padding: 40px 50px;
    }

    /* --- Cover Page --- */
    .cover-page {
      position: relative;
      height: 100vh;
      width: 100%;
      background-image: url('${img1Cover}');
      background-size: cover;
      background-position: center;
    }
    .cover-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 60px 50px;
      color: white;
    }
    .cover-title {
      font-size: 48px;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 16px;
    }
    .cover-subtitle {
      font-size: 24px;
      font-weight: 400;
      margin-bottom: 40px;
      color: #d1d5db;
    }
    .cover-meta {
      font-size: 16px;
      font-weight: 500;
      color: #9ecaed;
      border-top: 1px solid rgba(255,255,255,0.2);
      padding-top: 16px;
    }

    /* --- Global Elements --- */
    h2 {
      font-size: 32px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 24px;
      padding-bottom: 8px;
      border-bottom: 3px solid #3b82f6; /* Soft blue */
      display: inline-block;
    }
    .text-muted {
      color: #4b5563;
      font-size: 18px;
    }
    .rounded-image {
      width: 100%;
      border-radius: 16px;
      margin: 24px 0;
      object-fit: cover;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    /* --- Introduction Section --- */
    .intro-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
    }
    
    /* --- Personalized Insights --- */
    .insights-container {
      background-color: #f0f9ff; /* Soft blue bg */
      border-radius: 16px;
      padding: 32px;
      margin-top: 24px;
      border: 1px solid #bae6fd;
    }
    .insights-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-top: 24px;
    }
    .insight-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .insight-value {
      font-size: 28px;
      font-weight: 800;
      color: #2563eb;
      margin-top: 8px;
    }
    .insight-label {
      font-size: 14px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* --- Diet Plan Section --- */
    .day-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-left: 6px solid #10b981; /* Soft green */
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .day-title {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 16px;
    }
    .meal-row {
      display: flex;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px dashed #f3f4f6;
    }
    .meal-row:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .meal-label {
      width: 100px;
      font-weight: 600;
      color: #374151;
    }
    .meal-desc {
      flex: 1;
      color: #4b5563;
    }
    .blur-overlay {
      position: relative;
    }
    .blur-overlay::after {
      content: "Unlock Premium to view Days 2-7";
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 700;
      color: #2563eb;
      border-radius: 12px;
      z-index: 10;
    }

    /* --- Tips Section --- */
    .tips-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 24px;
    }
    .tip-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      background: #f9fafb;
      padding: 20px;
      border-radius: 12px;
    }
    .tip-icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      background: #dbeafe;
      color: #2563eb;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 800;
    }
    .tip-content strong {
      display: block;
      font-size: 18px;
      color: #111827;
      margin-bottom: 4px;
    }
    .tip-content p {
      font-size: 14px;
      color: #4b5563;
    }
  </style>
</head>
<body>

  <!-- 1. COVER PAGE -->
  <div class="cover-page">
    <div class="cover-overlay">
      <h1 class="cover-title">Your Personalized<br>Weight Loss Plan</h1>
      <p class="cover-subtitle">Designed specifically for your body and lifestyle</p>
      <div class="cover-meta">
        Prepared for: ${userName} &nbsp;&bull;&nbsp; Date: ${dateStr}
      </div>
    </div>
  </div>

  <!-- 2. INTRODUCTION & 3. INSIGHTS -->
  <div class="page-break section">
    <h2>Understanding Your Body</h2>
    
    <div class="intro-grid">
      <div>
        <p class="text-muted" style="margin-bottom: 16px;">
          Body fat is more than just stored energy. Excess visceral fat, particularly around the belly, can impact your energy levels, metabolism, and overall confidence. 
        </p>
        <p class="text-muted">
          Your personalized plan is designed to help you reduce this stubborn fat safely by creating a sustainable caloric deficit while providing the nutrients your body needs to thrive.
        </p>
      </div>
      <img src="${img2Intro}" alt="Body assessment" class="rounded-image" style="margin: 0;">
    </div>

    <div class="insights-container">
      <h3 style="font-size: 24px; color: #1e3a8a;">Your Profile & Goals</h3>
      <p style="color: #3b82f6; margin-top: 8px;">Based on your answers, here is your unique metabolic snapshot:</p>
      
      <div class="insights-grid">
        <div class="insight-card">
          <div class="insight-label">Target Calories</div>
          <div class="insight-value">${dailyCalories} <span style="font-size:16px;">kcal</span></div>
        </div>
        <div class="insight-card">
          <div class="insight-label">Primary Goal</div>
          <div class="insight-value" style="font-size: 22px; text-transform: capitalize;">${goal}</div>
        </div>
        <div class="insight-card">
          <div class="insight-label">Activity Level</div>
          <div class="insight-value" style="font-size: 20px; text-transform: capitalize;">${activity}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 4. DIET PLAN -->
  <div class="page-break section">
    <h2>Your Meal Plan</h2>
    <p class="text-muted" style="margin-bottom: 24px;">Follow these daily meals to reach your target of ${dailyCalories} kcal.</p>
    
    <img src="${img3Diet}" alt="Healthy meal prep" class="rounded-image" style="max-height: 250px;">

    <!-- Day 1 (Always Visible) -->
    <div class="day-card">
      <div class="day-title">Day 1 – Fresh Start</div>
      <div class="meal-row">
        <div class="meal-label">Breakfast</div>
        <div class="meal-desc">Greek yogurt with mixed berries, chia seeds, and a drizzle of honey</div>
      </div>
      <div class="meal-row">
        <div class="meal-label">Lunch</div>
        <div class="meal-desc">Grilled chicken salad with leafy greens, cherry tomatoes, and olive oil</div>
      </div>
      <div class="meal-row">
        <div class="meal-label">Dinner</div>
        <div class="meal-desc">Baked salmon with roasted asparagus and a side of quinoa</div>
      </div>
      <div class="meal-row">
        <div class="meal-label">Snack</div>
        <div class="meal-desc">A small handful of raw almonds and an apple</div>
      </div>
    </div>

    ${isPremium ? `
    <!-- Days 2-7 (Premium) -->
    <div class="day-card">
      <div class="day-title">Day 2 – Plant Power</div>
      <div class="meal-row">
        <div class="meal-label">Breakfast</div>
        <div class="meal-desc">Oatmeal topped with sliced bananas and walnuts</div>
      </div>
      <div class="meal-row">
        <div class="meal-label">Lunch</div>
        <div class="meal-desc">Hearty lentil soup with a slice of whole wheat bread</div>
      </div>
      <div class="meal-row">
        <div class="meal-label">Dinner</div>
        <div class="meal-desc">Tofu stir-fry with brown rice and steamed broccoli</div>
      </div>
    </div>
    
    <div class="day-card">
      <div class="day-title">Day 3 – Lean & Clean</div>
      <div class="meal-row">
        <div class="meal-label">Breakfast</div>
        <div class="meal-desc">Two scrambled eggs with spinach and avocado toast</div>
      </div>
      <div class="meal-row">
        <div class="meal-label">Lunch</div>
        <div class="meal-desc">Turkey wrap with mixed greens and a light vinaigrette</div>
      </div>
      <div class="meal-row">
        <div class="meal-label">Dinner</div>
        <div class="meal-desc">Grilled shrimp skewers with zucchini noodles</div>
      </div>
    </div>
    ` : `
    <!-- Blurred Days 2-7 (Basic) -->
    <div class="day-card blur-overlay">
      <div class="day-title">Day 2 – 7</div>
      <div class="meal-row">
        <div class="meal-label">Breakfast</div><div class="meal-desc">Hidden meal description goes here</div>
      </div>
      <div class="meal-row">
        <div class="meal-label">Lunch</div><div class="meal-desc">Hidden meal description goes here</div>
      </div>
      <div class="meal-row">
        <div class="meal-label">Dinner</div><div class="meal-desc">Hidden meal description goes here</div>
      </div>
    </div>
    `}
  </div>

  <!-- 5. TIPS & RECOMMENDATIONS -->
  <div class="page-break section">
    <h2>Tips for Success</h2>
    
    <img src="${img4Tips}" alt="Healthy lifestyle" class="rounded-image" style="max-height: 250px;">

    <div class="tips-grid">
      <div class="tip-item">
        <div class="tip-icon">💧</div>
        <div class="tip-content">
          <strong>Hydrate Constantly</strong>
          <p>Aim for at least 2.5 to 3 liters of water per day to boost metabolism and reduce false hunger.</p>
        </div>
      </div>
      <div class="tip-item">
        <div class="tip-icon">🚫</div>
        <div class="tip-content">
          <strong>Limit Added Sugars</strong>
          <p>Avoid sugary drinks and snacks. Opt for whole fruits when craving something sweet.</p>
        </div>
      </div>
      <div class="tip-item">
        <div class="tip-icon">💤</div>
        <div class="tip-content">
          <strong>Prioritize Sleep</strong>
          <p>Get 7-8 hours of quality sleep. Poor sleep increases cortisol, which signals your body to store fat.</p>
        </div>
      </div>
      <div class="tip-item">
        <div class="tip-icon">🔄</div>
        <div class="tip-content">
          <strong>Stay Consistent</strong>
          <p>Results take time. Stick to the plan 80% of the time, and allow 20% flexibility for life's events.</p>
        </div>
      </div>
    </div>
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
