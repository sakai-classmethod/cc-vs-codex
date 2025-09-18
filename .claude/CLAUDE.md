# CLAUDE.md - MCP Tool Usage Guidelines

This document defines rules and guidelines to maximize the effectiveness of MCP (Model Context Protocol) tools and ensure high-quality code generation.

## HIGHEST PRIORITY RULE
**When Codex MCP is available, engage in ACTIVE COLLABORATION, not passive delegation.**
- **CRITICAL**: Never dump entire tasks on Codex - you must actively participate
- **MANDATE**: Provide specific context and your initial approach before asking for feedback
- **REQUIREMENT**: Iterate based on feedback, don't just accept suggestions blindly
- **QUALITY FOCUS**: Use diverse perspectives to enhance solution quality
- User can override with "don't use Codex" or "skip Codex"

## MCP Tool Usage Rules

### Context7 MCP
- **ALWAYS** use Context7 to retrieve latest library documentation before implementation
- Use for: API references, code examples, version-specific information
- Priority: **HIGH** for any external library usage
- Command: `mcp__context7__resolve-library-id` → `mcp__context7__get-library-docs`

### Codex MCP - TRUE PAIR PROGRAMMING COLLABORATION

#### CRITICAL REQUIREMENT
**Codex is your PEER REVIEWER and CO-DEVELOPER, not your task executor.**

#### Core Principles
- **NO TASK DUMPING**: Present your solution approach BEFORE asking for Codex input
- **MUTUAL FEEDBACK**: Engage in iterative refinement, not one-way delegation
- **SHARED OWNERSHIP**: You implement, Codex reviews; Codex suggests, you evaluate
- **QUALITY THROUGH DIVERSITY**: Different AI models catch different issues
- **ACTIVE PARTICIPATION**: Maintain 60/40 contribution ratio (you/Codex)

#### Collaboration Guidelines
- **REQUIREMENT**: Check Codex MCP availability at conversation start
- **COLLABORATIVE APPROACH** for:
  - Complex architectural decisions (discuss trade-offs together)
  - Critical code implementations (iterative refinement)
  - Security-sensitive changes (cross-validation)
  - Performance optimizations (multiple perspectives)
  - Test strategy design (comprehensive coverage)

#### Division of Responsibilities
1. **Claude Code (You) - Primary Developer**:
   - ALWAYS provide initial implementation or approach
   - Execute all file operations and tool usage
   - Explain your reasoning and design choices
   - Evaluate and integrate feedback critically
   - Make final implementation decisions

2. **Codex - Peer Reviewer & Advisor**:
   - Review your proposed solutions
   - Identify blind spots and edge cases
   - Suggest alternative patterns when beneficial
   - Validate security, performance, and best practices
   - Provide different perspective on problem-solving

#### Mandatory Collaborative Workflow
1. **PREPARATION** (Your responsibility):
   - Analyze the problem independently first
   - Draft initial approach or pseudocode
   - Identify potential challenges

2. **COLLABORATIVE REFINEMENT**:
   - Present YOUR solution to Codex with rationale
   - Request specific feedback (not "implement this for me")
   - Discuss trade-offs of different approaches
   - Iterate based on constructive criticism

3. **IMPLEMENTATION** (Your lead):
   - You write the actual code
   - Request targeted reviews on specific aspects
   - Address identified issues proactively

4. **VALIDATION**:
   - Cross-check edge cases together
   - Verify security and performance implications
   - Ensure code meets all requirements

#### Commands
- Start new session: `mcp__codex__codex`
- Continue conversation: `mcp__codex__codex-reply`
- Approval policies: Configure based on trust level (untrusted/on-failure/on-request/never)

#### When to Use Codex Collaboration
- **MANDATORY COLLABORATION**:
  - Security-critical implementations
  - Complex architectural decisions
  - Performance-critical algorithms
  - API design and data models

- **RECOMMENDED COLLABORATION**:
  - New feature implementation (> 50 lines)
  - Significant refactoring
  - Complex bug fixes
  - Test strategy design

- **OPTIONAL/SKIP CODEX**:
  - Simple bug fixes (< 20 lines)
  - Documentation updates
  - Configuration changes
  - Formatting and typos
  - Straightforward CRUD operations

#### Effective Collaboration Patterns

**GOOD - Active Collaboration**:
```
You: "I plan to implement user authentication using JWT tokens stored in httpOnly cookies. Here's my approach: [details]. What security considerations am I missing?"
Codex: "Consider CSRF protection and token rotation strategy"
You: "Good points. I'll add CSRF tokens and implement refresh token rotation with 15-min access tokens"
```

**BAD - Task Dumping**:
```
You: "Implement user authentication for me"
Codex: [provides full implementation]
You: [copies without understanding]
```

**GOOD - Iterative Refinement**:
```
You: "Here's my implementation of the cache layer: [code]. I'm concerned about memory leaks"
Codex: "The WeakMap approach could help, also consider TTL cleanup"
You: "I'll refactor using WeakMap and add a background cleanup task"
```

**BAD - Blind Acceptance**:
```
You: "How should I do this?"
Codex: [provides suggestion]
You: "OK" [implements without evaluation]
```

#### Benefits of True Pair Programming
- Diverse perspectives lead to robust solutions
- Real-time error prevention through cross-validation
- Knowledge exchange between different AI models
- Higher code quality through iterative refinement
- Reduced blind spots in implementation

#### Anti-Patterns to Avoid
1. **Task Dumping**: "Write this entire feature for me"
2. **Blind Delegation**: Accepting suggestions without understanding
3. **Passive Participation**: Not providing initial approach
4. **One-Way Communication**: Not iterating on feedback
5. **Over-Reliance**: Using Codex for trivial tasks

**REMINDER: You are the primary developer. Codex enhances quality through review and alternative perspectives, not by doing the work for you.**

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
- **FIRST**: Read and understand existing code with `Read` tool
- **SECOND**: Formulate your approach independently
- **THIRD**: Start Codex session for complex tasks with YOUR initial solution
- **ALWAYS**: Check conventions from neighboring files
- **VERIFY**: Available dependencies in `package.json`/`requirements.txt`

### Before Committing
- **MUST** run lint command (e.g., `npm run lint`, `ruff`, `eslint`)
- **MUST** run type check (e.g., `npm run typecheck`, `mypy`)
- **MUST** ensure all tests pass
- If commands unknown, ask user and document in CLAUDE.md

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