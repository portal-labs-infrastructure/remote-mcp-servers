1. MCP Server to expose registry
1. Python package to expose registry

Inside apps:

1. Ask LLM: Is MCP server needed?
   a. If yes, then vector search server registry
   b. If no, return null

const res = await askLLM({
question: "Assistant: Hi, I'm AI assistant, how can I help?\nUser: Can you check my asana tickets?"
});

res === "{
'vector_search': true,
'vector_seach_query': "asana",
}"

const servers = await searchRegistry({
query: res.vector_search_query,
});

servers === "[
{
"name": "asana"
}
]"

// Send server connection request to our MCP client

// Tools will be available
