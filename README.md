# code-reviewer

AI-powered code review CLI using Claude. Get instant feedback on your code for security issues, performance problems, and readability improvements.

## How It Works
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Your Code     │────▶│   Claude API    │────▶│  Review Report  │
│   (files/dir)   │     │   (streaming)   │     │  (with fixes)   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
   Read files            Analyze for:            Output:
   Detect language       • Security              • Findings
   Add line numbers      • Performance           • Suggestions
                         • Readability           • Code fixes
```

## Features

- 🔍 Review files or directories
- 🎯 Focus modes: security, performance, readability, or all
- ⚡ Streaming output (see review as it generates)
- 🔧 Custom rules via `.codereviewrc` config file
- 🚦 Severity levels (critical, warning, suggestion) with CI exit codes
- 🤖 Model selection: Sonnet (fast) or Opus (thorough)

## Installation
```bash
npm install -g code-reviewer
```

## Setup

Set your Anthropic API key:
```bash
export ANTHROPIC_API_KEY=your-api-key-here
```

Get your API key from [console.anthropic.com](https://console.anthropic.com/)

## Usage
```bash
# Review a single file
code-reviewer src/auth.ts

# Review a directory
code-reviewer src/

# Focus on security issues only
code-reviewer src/ --focus=security

# Use Opus model for thorough review
code-reviewer src/ --model=opus

# Output as JSON (for CI pipelines)
code-reviewer src/ --output=json
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--focus` | Review focus: `security`, `performance`, `readability`, `all` | `all` |
| `--model` | Model: `sonnet` (fast), `opus` (thorough) | `sonnet` |
| `--output` | Output format: `text`, `json` | `text` |
| `--verbose` | Show detailed output including token usage | `false` |

## Exit Codes

For CI integration:

| Code | Meaning |
|------|---------|
| 0 | No issues found |
| 1 | Critical issues found |
| 2 | Warnings found (no criticals) |
| 3 | Tool error |

## License

MIT