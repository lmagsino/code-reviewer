/**
 * Streaming Claude API Call
 * 
 * KEY DIFFERENCE FROM BASIC:
 * - Basic: client.messages.create() → wait for full response
 * - Streaming: client.messages.stream() → see tokens as they arrive
 * 
 * Why streaming matters:
 * - Better UX: User sees progress immediately (not waiting 5-10 seconds)
 * - Feels faster: Even though total time is similar
 * - Can cancel early: If you see it's going wrong
 * 
 * Run: npm run build && node dist/streaming-review.js
 */

import Anthropic from '@anthropic-ai/sdk';

// --- Configuration ---
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-20250514';

// --- Sample code to review ---
const sampleCode = `
function getUserData(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  return db.execute(query);
}
`;

// --- Main function ---
async function main() {
  if (!API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
    console.error('Run: export ANTHROPIC_API_KEY=your-key-here');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey: API_KEY });

  console.log('Sending code to Claude for review (streaming)...\n');
  console.log('=== Review Result ===\n');

  // --- KEY DIFFERENCE: .stream() instead of .create() ---
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Review this code and list any issues:

\`\`\`javascript
${sampleCode}
\`\`\`

For each issue, specify: severity (critical/warning/suggestion), line number, and what's wrong.`,
      },
    ],
  });

  // --- Handle each chunk of text as it arrives ---
  // Using process.stdout.write() instead of console.log() 
  // because we don't want newlines after each chunk
  stream.on('text', (text) => {
    process.stdout.write(text);
  });

  // --- Wait for completion and get final message with usage stats ---
  const finalMessage = await stream.finalMessage();

  // Add spacing after streamed content
  console.log('\n');

  // Token usage available after streaming completes
  console.log('=== Token Usage ===');
  console.log(`Input tokens:  ${finalMessage.usage.input_tokens}`);
  console.log(`Output tokens: ${finalMessage.usage.output_tokens}`);
}

main().catch(console.error);