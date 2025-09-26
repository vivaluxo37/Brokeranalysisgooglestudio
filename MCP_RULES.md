# MCP Rules and Guidelines

## Web Search Protocol

### IMPORTANT: Web Search Rule
When performing any web search operations, **ALWAYS** use both of the following MCP servers simultaneously:

1. **Z AI Server** (`zai-mcp-server`)
   - Package: `@z_ai/mcp-server`
   - Purpose: AI-powered search and analysis
   - Provides intelligent search results with AI analysis
   - Environment Variables:
     - `Z_AI_API_KEY`: `a07915db87b34f96aa53f89fab692b20.2bW7A4gPqZMAnfgb`
     - `Z_AI_MODE`: `ZAI`

2. **Web Search Prime** (`web-search-prime`)
   - Package: HTTP-based MCP server
   - Purpose: Comprehensive web search functionality
   - URL: `https://api.z.ai/api/mcp/web_search_prime/mcp`
   - Authentication: Bearer token authentication
   - Provides real-time web search capabilities

### Implementation Protocol

When a user requests any web search:

1. **Activate both MCP servers** simultaneously
2. **Cross-reference results** from both servers
3. **Combine insights** for comprehensive coverage
4. **Prioritize current information** from Web Search Prime
5. **Apply AI analysis** from Z AI Server
6. **Present unified results** to the user

### Example Web Search Workflow

```typescript
// When user asks: "Search for latest forex trading regulations"
// 1. Use Web Search Prime for current regulatory information
// 2. Use Z AI Server for AI analysis of regulatory trends
// 3. Combine both sources for comprehensive answer
```

### Benefits of Dual-Server Approach

- **Comprehensive Coverage**: Maximum search result coverage
- **AI-Enhanced Analysis**: Intelligent processing of search results
- **Real-Time Information**: Current data from web sources
- **Cross-Validation**: Verification through multiple sources
- **Enhanced Accuracy**: Reduced risk of outdated or incorrect information

### Server Priority

1. **Web Search Prime**: Primary source for current web information
2. **Z AI Server**: Secondary source for AI analysis and insights
3. **Combined Results**: Final output should integrate both sources

### Error Handling

If one server is unavailable:
- Continue with the available server
- Note the limitation in the response
- Attempt to use the alternative server if possible

This rule ensures maximum effectiveness and reliability for all web-based research tasks.