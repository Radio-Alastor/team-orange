from langgraph.graph import StateGraph, END
from silvertutor.utils.nodes import call_model
from silvertutor.utils.state import AgentState

workflow = StateGraph(AgentState)
workflow.add_node("agent", call_model)
workflow.set_entry_point("agent")
workflow.add_edge("agent", END)

graph = workflow.compile()
