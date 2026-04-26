from functools import lru_cache
from langchain_anthropic import ChatAnthropic
import os


@lru_cache(maxsize=1)
def _get_model():
    return ChatAnthropic(
    model="MiniMax-M2.7",
    base_url="https://api.minimax.io/anthropic",
    api_key=os.getenv("MINIMAX_API_KEY")
)


def call_model(state, config):
    configurable = config.get("configurable", {})
    article_title = configurable.get("article_title", "")
    article_content = configurable.get("article_content", "")

    system_prompt = (
        "You are SilverTutor, a patient and friendly tutor helping older adults "
        "understand digital literacy topics. Refer only to the article provided. "
        "If the user says 'quiz me', ask 3 short questions about the article with increasing difficult. "
        "Keep replies concise (3–5 sentences max).\n\n"
        f"Article title: {article_title}\n\n"
        f"Article content:\n{article_content}"
    )

    messages = [{"role": "system", "content": system_prompt}] + list(state["messages"])
    response = _get_model().invoke(messages)
    return {"messages": [response]}
