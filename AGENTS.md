# AGENTS.md - MCP Tool Usage Guidelines

This document defines rules and guidelines to maximize the effectiveness of MCP (Model Context Protocol) tools and ensure high-quality code generation.

## MCP Tool Usage Rules

### Context7 MCP
- **ALWAYS** use Context7 to retrieve latest library documentation before implementation
- Use for: API references, code examples, version-specific information
- Priority: **HIGH** for any external library usage
- Command: `mcp__context7__resolve-library-id` → `mcp__context7__get-library-docs`

### Codex MCP
- Use for complex, multi-file code generation tasks
- Ideal for: Refactoring, new feature implementation, architecture design
- Approval policies: Configure based on trust level (untrusted/on-failure/on-request/never)
- Command: `mcp__codex__codex` for new sessions, `mcp__codex__codex-reply` for continuations

#### Pair Programming with Codex MCP
**When Codex MCP is enabled:**
- **MUST** use Codex MCP for collaborative pair programming sessions
- Treat Codex as a pair programming partner for complex implementations
- Share context and decision-making process through Codex conversations
- Use Codex for:
  - Architecture discussions and design reviews
  - Complex refactoring with real-time feedback
  - Multi-step implementations requiring iterative refinement
  - Code review and optimization suggestions
- Workflow:
  1. Start Codex session with clear problem statement
  2. Iterate with Codex for solution design
  3. Implement with Codex guidance
  4. Review and refine together

**When Codex MCP is disabled:**
- Proceed with standard implementation workflow
- Use other available MCP tools as appropriate
- No requirement to use Codex MCP

### Sequential-thinking MCP
- Use for complex problem decomposition and step-by-step analysis
- Ideal for: Debugging complex issues, algorithm design, system architecture planning
- **ALWAYS** use when task requires >5 logical steps
- Use for hypothesis generation and verification cycles
- Command: `mcp__sequential-thinking__sequentialthinking`

### IDE MCP (VS Code Integration)
- Use for real-time diagnostics and code execution
- Priority for: Jupyter notebook operations, getting language server diagnostics
- Execute code in notebooks when validation needed
- Commands: `mcp__ide__getDiagnostics`, `mcp__ide__executeCode`

### Playwright MCP
- Use for browser automation, testing, web scraping
- **ALWAYS** take snapshots before interactions using `browser_snapshot`
- Use `browser_evaluate` for complex DOM queries
- Prefer batch operations with `browser_fill_form` over individual field updates

## Efficiency Rules

### Parallel Execution
- **CRITICAL**: Execute independent tools concurrently, not sequentially
- Send single message with multiple tool calls for parallel execution
- Example: Run `git status`, `git diff`, and `git log` simultaneously

### Batch Operations
- Use `MultiEdit` over sequential `Edit` calls for same file
- Group related file reads in single batch using parallel `Read` calls
- Use `browser_fill_form` for multiple form fields instead of individual fills

### Tool Selection Priority
1. Specialized MCP tools > Generic bash commands
2. `Grep`/`Glob` > bash `find`/`grep` commands
3. `MultiEdit` > Sequential `Edit` calls
4. `Task` tool for open-ended searches requiring multiple rounds

### Cache Utilization
- Leverage WebFetch 15-minute cache for repeated URL access
- Reuse Context7 documentation within same session

## Code Quality Rules

### Before Any Changes
- **MUST** read existing code with `Read` tool first
- Understand conventions from neighboring files
- Check `package.json`/`requirements.txt` for available dependencies

### Before Committing
- **MUST** run lint command (e.g., `npm run lint`, `ruff`, `eslint`)
- **MUST** run type check (e.g., `npm run typecheck`, `mypy`)
- **MUST** ensure all tests pass
- If commands unknown, ask user and document in AGENTS.md

### Code Standards
- Follow existing codebase conventions exactly
- Mimic existing code style and patterns
- Verify library availability before importing
- Use existing utilities over adding new dependencies
- NO unnecessary comments unless explicitly requested

## Security & Safety Rules

### NEVER Do
- Push directly to main/master branch
- Hardcode API keys, passwords, or secrets in code
- Commit code with failing tests or linting errors
- Use real email addresses (always use `example.com`)
- Log or expose sensitive information
- Create files unless absolutely necessary

### ALWAYS Do
- Review generated code for security vulnerabilities
- Use environment variables for sensitive configuration
- Validate and sanitize user input in web applications
- Check file permissions when creating new files
- Follow the principle of least privilege

## Project-Specific Commands

### Build & Development
```bash
# Build
npm run build

# Development server
npm run dev

# Watch mode
npm run watch
```

### Quality Checks
```bash
# Run tests
npm test

# Lint code
npm run lint

# Type checking
npm run typecheck

# Run all checks
npm run check
```

## Communication Principles

### Language Handling
- Think exclusively in English for processing
- Respond in Japanese when user communicates in Japanese
- Mark code references with `file_path:line_number` format

### Uncertainty & Decision Making
- Explicitly state when information is uncertain
- Present trade-offs clearly with pros/cons
- Suggest alternatives when better options exist
- Mark potentially outdated information

### Progress Management
- Use `TodoWrite` tool for tasks with 3+ steps
- Mark todos as `in_progress` BEFORE starting work
- Complete todos IMMEDIATELY after finishing
- Only one todo should be `in_progress` at a time

## Tool Failure Handling

### Fallback Strategies
- If MCP tool fails, document the error and try alternative approach
- If `Context7` unavailable, use `WebSearch` or `WebFetch`
- If `Codex` fails, break down task and implement manually
- Always inform user of tool failures and workarounds

### Error Recovery
- Retry failed operations once before switching strategies
- Document persistent failures in conversation
- Ask user for guidance if critical tool unavailable

## File Management Rules

### Creation Policy
- **NEVER** create files proactively
- **ALWAYS** prefer editing existing files
- **NEVER** create documentation/README unless explicitly requested
- Only create files when absolutely necessary for task

### Edit Best Practices
- Read file with `Read` tool before any edit
- Preserve exact indentation (tabs/spaces)
- Use `replace_all` for variable renaming
- Use `MultiEdit` for multiple changes in same file

## Import Management

### Team/Organization Imports
```markdown
# Include team-wide conventions if available
@/team/conventions.md

# Include project-specific rules
@./project-rules.md
```

## Testing Guidelines

### Test Execution
- Never assume test framework - check README or package.json
- Run tests after significant changes
- Create tests for new features when requested
- Verify test coverage for critical paths

### Browser Testing with Playwright
- Always start with `browser_snapshot` to understand page state
- Use explicit waits with `browser_wait_for`
- Clean up with `browser_close` after automation tasks

## Performance Optimization

### Tool Usage
- Minimize context usage by using `Task` tool for file searches
- Batch read operations to reduce tool calls
- Use specific line ranges in `Read` for large files
- Clear unused browser tabs with `browser_tabs` action

### Response Optimization
- Keep responses concise (< 4 lines when possible)
- Avoid unnecessary preambles or summaries
- Provide direct answers without elaboration unless requested

---

*This document should be regularly updated based on project requirements and discovered patterns.*