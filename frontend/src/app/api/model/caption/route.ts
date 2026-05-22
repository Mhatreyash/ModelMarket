import { NextResponse } from 'next/server';
import { validateTxHash } from '../helpers';

export async function POST(req: Request) {
  try {
    const { txHash, promptText } = await req.json();

    if (!promptText) {
      return NextResponse.json({ error: 'Missing prompt text' }, { status: 400 });
    }

    // 1. UGF Receipt Validation
    console.log(`[Backend UGF Guard] Verifying payment for Caption Gen...`);
    console.log(`[Backend UGF Guard] Transaction Hash: ${txHash}`);

    const validation = await validateTxHash(txHash);
    if (!validation.ok) {
      console.error(`[Backend UGF Guard] Verification failed: ${validation.error}`);
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    console.log(`[Backend UGF Guard] ${validation.message}`);

    // 2. Fetch Groq API Key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn('[Backend AI] Missing GROQ_API_KEY. Falling back to Demo Mode Sandbox.');
      return NextResponse.json({
        feedback: `[SYSTEM WORKAROUND]: No GROQ_API_KEY found in .env.local on server.
Here is your simulated Social Media Captions:

System: Formatting platform-optimized copy...

Feedback:
[-] Platform: X (Twitter)
"🔥 Rebuilding the core monolith into next-gen serverless microservices. Speed is up by 40%! What does your backend architecture look like? Let's discuss! #WebDev #CodingLife"

[-] Platform: LinkedIn
"Thrilled to share that my engineering team has successfully migrated our core monolith architecture to distributed microservices. This represents a 45% reduction in latency and a huge win for scalable engineering. Kudos to everyone involved!"

[+] Optimization Tip: Use custom emojis and targeted line spacing to maximize click-through rate.

Verdict: Ready. Pick your favorite platform and post!`
      });
    }

    try {
      // 3. Trigger live Llama 3.3 70B model via Groq API (OpenAI Compatible Endpoint)
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are an elite digital growth marketer and viral content copywriter.
Optimize content for LinkedIn, X (Twitter), and Instagram based on the user's prompt or topic.
Make them engaging, highly click-worthy, and natural (avoid generic AI corporate-speak).`
            },
            {
              role: 'user',
              content: `Generate 3 platforms captions for the following topic: "${promptText}"

Strictly format your response in professional Markdown as follows:
System: Formatting platform-optimized copy...

Feedback:
[-] Platform: X (Twitter)
"[Enter highly engaging Tweet here]"

[-] Platform: LinkedIn
"[Enter highly engaging, insightful LinkedIn post here]"

[+] Optimization Tip: [Insert 1 critical advice on hook/emoji styling to optimize engagement]

Verdict: Ready. Pick your favorite platform and post!`
            }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('[Groq API Response Error]:', errText);
        throw new Error(`Groq API returned status ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices[0]?.message?.content || 'No output generated.';

      return NextResponse.json({ feedback: text });
    } catch (apiError: any) {
      console.warn('[Backend AI] Live Groq Llama API failed. Falling back to Demo Mode Sandbox.', apiError);
      return NextResponse.json({
        feedback: `[SYSTEM WORKAROUND]: Live Groq API key rate-limited or quota exhausted.
Here is your simulated Social Media Captions:

System: Formatting platform-optimized copy...

Feedback:
[-] Platform: X (Twitter)
"🔥 Rebuilding the core monolith into next-gen serverless microservices. Speed is up by 40%! What does your backend architecture look like? Let's discuss! #WebDev #CodingLife"

[-] Platform: LinkedIn
"Thrilled to share that my engineering team has successfully migrated our core monolith architecture to distributed microservices. This represents a 45% reduction in latency and a huge win for scalable engineering. Kudos to everyone involved!"

[+] Optimization Tip: Use custom emojis and targeted line spacing to maximize click-through rate.

Verdict: Ready. Pick your favorite platform and post!`
      });
    }

  } catch (error: any) {
    console.error('[API Caption Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
