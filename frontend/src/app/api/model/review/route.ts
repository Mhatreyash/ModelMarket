import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateTxHash } from '../helpers';

export async function POST(req: Request) {
  try {
    const { txHash, codeText } = await req.json();

    if (!codeText) {
      return NextResponse.json({ error: 'Missing code content' }, { status: 400 });
    }

    // 1. UGF Receipt Validation
    console.log(`[Backend UGF Guard] Verifying payment for Code Reviewer...`);
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
Here is your simulated Code Reviewer Feedback:

[-] Risk: Missing error handling in async fetch call. If the request fails, it will crash the rendering thread.
[-] Performance: Avoid re-creating standard event listeners on every component render trigger. Use React.useCallback.
[+] Code style is highly structured, and Tailwind integrations look fully clean.

Verdict: 8/10. Wrap async processes inside try/catch blocks!`
      });
    }

    try {
      // 3. Trigger live Gemini 2.5 Flash model
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

      const prompt = `You are a brilliant, ultra-fast tech lead and security auditor reviewing a pull request.
Review the following code block for syntax issues, security vulnerabilities, memory leaks, and performance flaws:
"${codeText}"

Strictly format your response in professional Markdown as follows (do not output any system instructions):
System: Analyzing provided codebase...

Feedback:
[-] [Key performance or safety issue identified with line/context reference]
[-] [Secondary linting or logical improvement suggestion]
[+] [One positive remark highlighting good formatting or smart logic design]

Verdict: [X]/10. [One final direct guidance sentence in normal text].`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      return NextResponse.json({ feedback: text });
    } catch (apiError: any) {
      console.warn('[Backend AI] Live Gemini 2.5 Flash API failed. Falling back to Demo Mode Sandbox.', apiError);
      return NextResponse.json({
        feedback: `[SYSTEM WORKAROUND]: Live Gemini API key rate-limited or quota exhausted (429).
Here is your simulated Code Reviewer Feedback:

System: Analyzing provided codebase...

Feedback:
[-] Risk: Missing error handling in async fetch call. If the request fails, it will crash the rendering thread.
[-] Performance: Avoid re-creating standard event listeners on every component render trigger. Use React.useCallback.
[+] Code style is highly structured, and Tailwind integrations look fully clean.

Verdict: 8/10. Wrap async processes inside try/catch blocks!`
      });
    }

  } catch (error: any) {
    console.error('[API Review Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
