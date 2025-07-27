import { NextRequest, NextResponse } from 'next/server';

// Google Generative Language API endpoint and key
// Changed model from 'text-bison-001' to 'gemini-2.0-flash' for compatibility and availability.
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const { profile, jobDescription, jobSource, tone } = await req.json();

    // Validate incoming request data
    if (!profile || !jobDescription) {
      return NextResponse.json({ error: 'Missing profile or job description.' }, { status: 400 });
    }

    // Construct the prompt for the generative model
    // Improved prompt for better guidance to the model.
        const prompt = `
Write a clear, engaging, and personal cover letter for a job application.

✍️ **Instructions:**
1. Start with the applicant’s name, location, phone number, and email (one per line; omit any missing).
2. Use **natural, conversational language**. Avoid corporate jargon, clichés, or overly formal phrasing. Imagine you're talking to a supportive colleague.
3. Make the letter genuinely **personalized to the company's mission and values**, not just the job role. Show that you've done your research on *them*.
4. Clearly explain **why you're genuinely excited about this specific opportunity** and how your unique experiences, skills, and perspectives make you a great match for *their team and culture*.
5. Demonstrate a clear understanding of the job, but express your capabilities with **confident humility and a willingness to learn**, rather than just stating qualifications.
6. Maintain a **${tone} tone while also being friendly and professional**, and keep the letter concise, aiming for under 250 words.
7. Do not include greetings like “Hi there” or “Dear Hiring Manager.” Begin directly with the header and the letter's body.
8. Output only the final letter. No extra notes, explanations, or conversational filler.

---
📄 Applicant Profile:
${JSON.stringify(profile, null, 2)}

💼 Job Description:
${jobDescription}

🔎 Job Source:
${jobSource}
---
`;

    // Make a request to the Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    });

    // Handle API response errors
    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API Error:', error); // Log the error for debugging
      return NextResponse.json({ error: `Gemini API error: ${error}` }, { status: response.status });
    }

    // Parse the successful API response
    const data = await response.json();
    // Extract the generated text from the response structure
    const letter = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Return the generated cover letter
    return NextResponse.json({ letter });
  } catch (error) {
    // Catch and handle any unexpected errors during the process
    console.error('Server Error:', error); // Log the error for debugging
    return NextResponse.json({ error: error?.toString() || 'Unknown error' }, { status: 500 });
  }
}
