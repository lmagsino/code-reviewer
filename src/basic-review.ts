/**
 * Basic Claude API Call (Non-Streaming)
 * 
 * This demonstrates:
 * - Creating an Anthropic client
 * - Sending a message to Claude
 * - Getting the response
 * - Tracking token usage
 * 
 * Run: npm run build && node dist/basic-review.js
 */

import Anthropic from '@anthropic-ai/sdk';

// --- Configuration ---
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-20250514';

// --- Sample code to review (has a SQL injection vulnerability) ---
const sampleCode = `
function getUserData(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  return db.execute(query);
}
`;

// --- Main function ---
async function main() {
  // 1. Check for API key
  if (!API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
    console.error('Run: export ANTHROPIC_API_KEY=your-key-here');
    process.exit(1);
  }

  // 2. Create the Anthropic client
  const client = new Anthropic({ apiKey: API_KEY });

  console.log('Sending code to Claude for review...\n');

  // 3. Make the API call
  const response = await client.messages.create({
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

  // 4. Extract and display the response
  const textBlock = response.content[0];
  if (textBlock.type === 'text') {
    console.log('=== Review Result ===\n');
    console.log(textBlock.text);
  }

  // 5. Show token usage (important for cost tracking)
  console.log('\n=== Token Usage ===');
  console.log(`Input tokens:  ${response.usage.input_tokens}`);
  console.log(`Output tokens: ${response.usage.output_tokens}`);
}

// Run
main().catch(console.error);