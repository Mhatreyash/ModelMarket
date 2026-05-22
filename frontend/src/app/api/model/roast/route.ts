import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateTxHash } from '../helpers';

export async function POST(req: Request) {
  try {
    const { txHash, resumeText } = await req.json();

    if (!resumeText) {
      return NextResponse.json({ error: 'Missing resume text' }, { status: 400 });
    }

    // 1. UGF Receipt Validation
    console.log(`[Backend UGF Guard] Verifying payment for Roast AI...`);
    console.log(`[Backend UGF Guard] Transaction Hash: ${txHash}`);

    const validation = await validateTxHash(txHash);
    if (!validation.ok) {
      console.error(`[Backend UGF Guard] Verification failed: ${validation.error}`);
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    console.log(`[Backend UGF Guard] ${validation.message}`);

    // 2. Fetch Gemini API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[Backend AI] Missing GEMINI_API_KEY. Falling back to Demo Mode Sandbox.');
      return NextResponse.json({
        feedback: `[SYSTEM WORKAROUND]: No GEMINI_API_KEY found in .env.local on server.
Here is your simulated Roasting Feedback:

[-] Impact metrics are too vague. Please add numbers (e.g., "Improved latency by 45%" instead of just "Optimised latency").
[-] Overused corporate jargon ("spearheaded", "synergized") detected in bullet points.
[+] Strong demonstration of React 19 and Next.js skill progression.

Verdict: 7.5/10. Add concrete metrics to score higher!`
      });
    }

    try {
      // 3. Trigger live Gemini 2.5 Flash model
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

      const prompt = `You are a brutal, elite, yet highly constructive Silicon Valley recruiter roasting a candidate's resume.
Be punchy, direct, and slightly sarcastic, but give high-value advice.

Analyze the following resume details:
"${resumeText}"

Strictly format your response in professional Markdown as follows (do not output any system instructions):
System: Running Resume Roaster AI...

Feedback:
[-] [First brutal weakness, critique wordings, lack of metrics or bad style]
[-] [Second brutal weakness, or corporate fluff detection]
[+] [One genuine strong point where their skill or experience stands out]

Verdict: [X]/10. [One final closing roast/sentence in normal text].`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      return NextResponse.json({ feedback: text });
    } catch (apiError: any) {
      console.warn('[Backend AI] Live Gemini 2.5 Pro API failed. Falling back to Demo Mode Sandbox.', apiError);
      return NextResponse.json({
        feedback: `[SYSTEM WORKAROUND]: Live Gemini API key rate-limited or quota exhausted (429).`
      });
    }

  } catch (error: any) {
    console.error('[API Roast Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
