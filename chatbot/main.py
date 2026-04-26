from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from langchain_core.messages import HumanMessage, AIMessage
from silvertutor.agent import graph

app = FastAPI()


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    article_title: str
    article_content: str
    messages: List[ChatMessage]


class ChatResponse(BaseModel):
    reply: str


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    lc_messages = [
        HumanMessage(content=m.content) if m.role == "user"
        else AIMessage(content=m.content)
        for m in request.messages
    ]
    config = {
        "configurable": {
            "article_title": request.article_title,
            "article_content": request.article_content,
        }
    }
    result = await graph.ainvoke({"messages": lc_messages}, config=config)
    content = result["messages"][-1].content
    if isinstance(content, list):
        content = "".join(
            block.get("text", "") for block in content
            if isinstance(block, dict) and block.get("type") == "text"
        )
    return ChatResponse(reply=content)
