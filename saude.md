# GLM-4.6 Complete Setup and Configuration Guide

## Overview

This guide provides comprehensive instructions for setting up GLM-4.6 (Zhipu AI's flagship model) with all essential tools, MCP servers, and integrations for optimal performance in coding, reasoning, and agentic tasks.

## GLM-4.6 Model Specifications

- **Total Parameters**: 355B
- **Active Parameters**: 32B
- **Context Window**: 200K tokens (expanded from 128K)
- **Maximum Output Tokens**: 128K
- **Input/Output Modalities**: Text
- **Strengths**:
  - Superior coding performance
  - Advanced reasoning capabilities
  - Enhanced agentic applications
  - Real-world coding tasks
  - Long-context processing
  - Tool use during inference

## Currently Configured MCP Servers

### ✅ Active Servers

1. **Firecrawl** (`firecrawl-mcp`)
   - **Purpose**: Web scraping and data collection
   - **Status**: ✅ Connected
   - **Usage**: `mcp__firecrawl__firecrawl_*` functions

2. **Web Search Prime** (`web-search-prime`)
   - **Purpose**: Z.AI's enhanced web search service
   - **Status**: ✅ Connected
   - **Usage**: `mcp__web-search-prime__webSearchPrime` function

3. **ZAI MCP Server** (`zai-mcp-server`)
   - **Purpose**: Z.AI's comprehensive MCP server
   - **Status**: ✅ Connected
   - **Usage**: Various Z.AI specific functions

4. **Tavily** (`@mcptools/mcp-tavily`)
   - **Purpose**: Real-time web search with AI optimization
   - **API Key**: `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`
   - **Status**: ✅ Installed and configured
   - **Usage**: Advanced search and content extraction

### ⚙️ Available but Inactive Servers

The following MCP servers are configured in `mcp-config.json` but may need activation:

5. **Context7** (`@upstash/context7-mcp`)
   - **Purpose**: Enhanced context management
   - **Transport**: stdio

6. **Playwright** (`@playwright/mcp`)
   - **Purpose**: Web automation and testing
   - **Host**: 127.0.0.1:8808

7. **GitHub** (`@modelcontextprotocol/server-github`)
   - **Purpose**: Repository management and CI/CD
   - **Requires**: GitHub Personal Access Token

8. **PostgreSQL** (`@modelcontextprotocol/server-postgres`)
   - **Purpose**: Database connectivity
   - **Requires**: PostgreSQL connection string

9. **Filesystem** (`@modelcontextprotocol/server-filesystem`)
   - **Purpose**: File system operations
   - **Requires**: Directory path configuration

10. **Memory** (`@modelcontextprotocol/server-memory`)
    - **Purpose**: Memory management and persistence

11. **Puppeteer** (`@modelcontextprotocol/server-puppeteer`)
    - **Purpose**: Browser automation

12. **Sequential Thinking** (`sequential-thinking-mcp`)
    - **Purpose**: Enhanced reasoning workflows

## Installation Instructions

### 1. Tavily MCP Server (✅ Completed)

```bash
# Installation
npm install -g @mcptools/mcp-tavily

# Configuration included in mcp-config.json
# API key: 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
```

### 2. Additional MCP Servers

#### GitHub MCP Server
```bash
npm install -g @modelcontextprotocol/server-github
# Set GITHUB_PERSONAL_ACCESS_TOKEN in environment
```

#### PostgreSQL MCP Server
```bash
npm install -g @modelcontextprotocol/server-postgres
# Set POSTGRES_CONNECTION_STRING in environment
```

#### Filesystem MCP Server
```bash
npm install -g @modelcontextprotocol/server-filesystem
# Configure allowed directory path
```

#### Memory MCP Server
```bash
npm install -g @modelcontextprotocol/server-memory
```

## Built-in Claude Code Tools

### Core Tools
- **Bash** - Execute shell commands
- **Read** - Read files and directories
- **Edit** - Modify existing files
- **Write** - Create new files
- **Grep** - Search through code
- **Glob** - File pattern matching
- **WebFetch** - Basic web content fetching
- **WebSearch** - Basic web search
- **TodoWrite** - Task management
- **Task** - Launch specialized agents

### Specialized Agents (35+ Available)

#### Development & Coding
- **ai-engineer** - Build LLM applications and RAG systems
- **architect-review** - Software architecture review
- **backend-architect** - API and database design
- **code-reviewer** - Code quality and security analysis
- **frontend-developer** - React, Next.js, UI development
- **python-pro** - Python 3.12+ expert development
- **javascript-pro** - Modern JavaScript and Node.js
- **typescript-pro** - Advanced TypeScript patterns
- **rust-pro** - Systems programming with Rust
- **go-pro** - Go development and microservices

#### Data & Infrastructure
- **database-optimizer** - Database performance tuning
- **database-admin** - Cloud database management
- **data-engineer** - Data pipelines and warehouses
- **mlops-engineer** - ML pipeline and deployment
- **cloud-architect** - AWS/Azure/GCP infrastructure
- **devops-troubleshooter** - Incident response
- **kubernetes-architect** - K8s and GitOps workflows

#### Security & Quality
- **security-auditor** - Security assessment and compliance
- **test-automator** - Test automation and CI/CD
- **performance-engineer** - Performance optimization

#### Business & Content
- **business-analyst** - Data-driven insights
- **content-marketer** - SEO and content strategy
- **seo-content-writer** - Optimized content creation

## GLM-4.6 Usage Patterns

### 1. Coding Excellence
```python
# GLM-4.6 excels at:
- Complex algorithm implementation
- Full-stack development
- Database design and optimization
- API development and integration
- Code review and optimization
```

### 2. Agentic Workflows
```javascript
// GLM-4.6 agent capabilities:
- Multi-step task decomposition
- Tool invocation and coordination
- Dynamic adaptation to workflows
- Cross-tool collaboration
```

### 3. Advanced Reasoning
```
GLM-4.6 reasoning strengths:
- Complex problem solving
- Mathematical reasoning (AIME 25)
- Scientific analysis (GPQA)
- Code debugging and optimization
```

## Configuration Files

### mcp-config.json Structure
```json
{
  "mcpServers": {
    "server_name": {
      "command": "executable",
      "args": ["arguments"],
      "env": {
        "API_KEY": "your_key_here"
      }
    }
  }
}
```

### Environment Variables
```bash
# Required for full functionality:
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token
POSTGRES_CONNECTION_STRING=postgresql://user:pass@host:5432/db
TAVILY_API_KEY=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
BRAVE_API_KEY=your_brave_key
```

## Performance Optimization

### 1. GLM-4.6 Best Practices
- Utilize full 200K context window for complex tasks
- Leverage built-in reasoning capabilities
- Use specialized agents for domain-specific tasks
- Take advantage of tool use during inference

### 2. MCP Server Optimization
- Keep servers lightweight and focused
- Use appropriate timeout settings
- Monitor server health regularly
- Cache frequently accessed data

### 3. Resource Management
- Monitor token usage (GLM-4.6 is 30% more efficient)
- Use streaming for long responses
- Implement proper error handling
- Optimize database queries

## Streaming and Real-time Tools

### Recommended Integrations
1. **Apache Kafka** - Real-time data streaming
2. **WebSocket Connections** - Live data feeds
3. **Redis** - Fast data caching
4. **Airbyte** - Data pipeline orchestration
5. **Flink** - Stream processing

### CLI Tools
1. **Ollama** - Local model management
2. **Docker** - Container orchestration
3. **Kubernetes CLI** - Container management

## Troubleshooting

### Common Issues

1. **MCP Server Not Connecting**
   - Check API key configuration
   - Verify network connectivity
   - Ensure proper environment variables

2. **Token Limit Issues**
   - Monitor context usage
   - Implement context window management
   - Use chunking for large inputs

3. **Performance Issues**
   - Check server health
   - Optimize database queries
   - Use caching strategies

### Debug Commands
```bash
# Check MCP server status
claude mcp list

# Test individual server
claude mcp get <server_name>

# Reset configuration
claude mcp reset-project-choices
```

## Advanced Features

### 1. Custom Agent Creation
```bash
# Define custom agents
claude --agents '{"specialist": {"description": "Expert in X", "prompt": "You are..."}}'
```

### 2. Multi-Modal Capabilities
- Text processing and generation
- Code analysis and synthesis
- Document analysis
- Data extraction and transformation

### 3. Integration Patterns
- REST API development
- Database integration
- File system operations
- Web scraping and automation

## Security Considerations

### API Key Management
- Store keys securely in environment variables
- Rotate keys regularly
- Use key management services for production
- Monitor API usage and costs

### Data Privacy
- Understand data processing policies
- Use secure connections (HTTPS)
- Implement proper access controls
- Regular security audits

## Future Enhancements

### Planned Integrations
1. **Vector Databases** - Chroma, Pinecone
2. **Advanced Search** - Perplexity, Kagi
3. **Productivity Tools** - Notion, Slack
4. **Cloud Services** - AWS, Azure, GCP
5. **Advanced Analytics** - Real-time dashboards

### Performance Monitoring
- Token usage analytics
- Response time tracking
- Error rate monitoring
- Cost optimization

## Support and Resources

### Documentation
- [GLM-4.6 Official Docs](https://docs.z.ai/guides/llm/glm-4.6)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Code Documentation](https://docs.anthropic.com/claude/docs/claude-code)

### Community
- [GitHub Issues](https://github.com/anthropics/claude-code/issues)
- [Reddit r/ClaudeAI](https://reddit.com/r/ClaudeAI)
- [Discord Communities](https://discord.gg/anthropic)

### API References
- [Z.AI API](https://docs.z.ai/api-reference)
- [Tavily API](https://tavily.com/docs)
- [GitHub API](https://docs.github.com/en/rest)

---

**Last Updated**: 2025-10-01
**GLM-4.6 Version**: Latest
**Configuration Status**: Production Ready

This guide serves as the comprehensive reference for GLM-4.6 setup and usage. Regular updates will be made as new features and integrations become available.