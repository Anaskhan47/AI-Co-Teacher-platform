import os
import streamlit as st
import ollama
import time
import pandas as pd
from datetime import datetime
import base64
import json

# Set page configuration with dark theme
st.set_page_config(
    page_title="Co-Teacher Assistant",
    page_icon="🧑‍🏫",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        'Get Help': 'https://www.schoolai.com/help',
        'About': "# Co-Teacher Assistant\nYour AI teaching partner"
    }
)

# Apply custom CSS for enhanced dark theme
st.markdown("""
<style>
    /* Base dark theme adjustments */
    .stApp {
        background-color: #1E1E1E;
        color: #E0E0E0;
    }
    
    /* Sidebar styling */
    .sidebar .sidebar-content {
        background-color: #252525;
    }
    
    /* Headers */
    h1, h2, h3 {
        color: #8ab4f8 !important;
    }
    
    /* Chat containers */
    .stChatMessage {
        background-color: #2D2D2D;
        border-radius: 10px;
        padding: 10px;
        margin: 10px 0;
    }
    
    /* User message styling */
    .stChatMessage[data-testid="stChatMessage"] div[data-testid="stChatMessageContent"] {
        background-color: #3a506b;
        border-radius: 8px;
        padding: 10px;
    }
    
    /* Assistant message styling */
    .stChatMessage[data-testid="stChatMessage"] div[data-testid="stChatMessageContent"] {
        background-color: #264653;
        border-radius: 8px;
        padding: 10px;
    }
    
    /* Button styling */
    .stButton>button {
        border-radius: 20px;
        background-color: #4a6fa5;
        color: white;
        border: none;
        padding: 8px 16px;
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        background-color: #5d8bbd;
        transform: translateY(-2px);
    }
    
    /* Card styling for features */
    .feature-card {
        background-color: #2D2D2D;
        border-radius: 10px;
        padding: 15px;
        margin: 10px 0;
        border-left: 4px solid #4a6fa5;
    }
    
    /* Input fields */
    .stTextInput>div>div>input {
        background-color: #333333;
        color: #FFFFFF;
        border-radius: 5px;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state variables
if "messages" not in st.session_state:
    st.session_state.messages = []
if "saved_conversations" not in st.session_state:
    st.session_state.saved_conversations = {}
if "current_subject" not in st.session_state:
    st.session_state.current_subject = "General"
if "first_visit" not in st.session_state:
    st.session_state.first_visit = True
if "response_style" not in st.session_state:
    st.session_state.response_style = "Balanced"
if "model" not in st.session_state:
    st.session_state.model = "llama3.2:latest"

# Function to handle streaming responses
def stream_response(user_query):
    # Generate chat history context for continuity
    chat_history = ""
    if st.session_state.messages:
        # Get the last 10 messages at most for context
        recent_messages = st.session_state.messages[-10:] if len(st.session_state.messages) > 10 else st.session_state.messages
        chat_history = "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in recent_messages])
    
    # Customize prompt based on selected subject and style
    subject_guidance = ""
    if st.session_state.current_subject != "General":
        subject_guidance = f"Focus specifically on {st.session_state.current_subject} education and curriculum."
    
    style_guidance = ""
    if st.session_state.response_style == "Concise":
        style_guidance = "Keep your responses very brief and to-the-point."
    elif st.session_state.response_style == "Detailed":
        style_guidance = "Provide comprehensive and detailed responses with examples when possible."
    
    # Fine-tuned prompt to mimic the SCHOOL.AI CoTeacher assistant
    formatted_prompt = f"""You are CoTeacher Assistant – a proactive, knowledgeable, and friendly helper dedicated to supporting teachers with their day-to-day tasks and classroom management. Your role is to provide clear, direct, and actionable answers to any questions that teachers ask.

Guidelines:
- Answer directly and concisely, but with enough detail to be helpful.
- If additional clarification is needed, ask targeted follow-up questions.
- When offering lesson plans, quizzes, training tips, timetables, or other assistance, provide detailed, practical advice.
- Maintain a friendly, professional, and supportive tone.
- Format your responses with clear headings, bullet points, and organization when appropriate.
{subject_guidance}
{style_guidance}

Previous conversation:
{chat_history}

Teacher's input: {user_query}

Now, please provide your response as a helpful teaching assistant.
"""
    # Stream response using Ollama model
    stream = ollama.chat(
        model=st.session_state.model,
        messages=[{"role": "user", "content": formatted_prompt}],
        stream=True
    )
    
    # Yield chunks for streaming
    for chunk in stream:
        if chunk.get("message") and chunk["message"].get("content"):
            yield chunk["message"]["content"]

# Function to save the current conversation
def save_conversation():
    if not st.session_state.messages:
        st.warning("No conversation to save!")
        return
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    name = st.sidebar.text_input("Conversation Name:", value=f"Conversation {timestamp}")
    
    if st.sidebar.button("Save"):
        st.session_state.saved_conversations[name] = {
            "timestamp": timestamp,
            "messages": st.session_state.messages.copy(),
            "subject": st.session_state.current_subject
        }
        st.sidebar.success(f"Saved as '{name}'!")

# Function to load a saved conversation
def load_conversation():
    if not st.session_state.saved_conversations:
        st.sidebar.info("No saved conversations yet.")
        return
    
    saved_names = list(st.session_state.saved_conversations.keys())
    selected_convo = st.sidebar.selectbox("Select a conversation:", saved_names)
    
    if st.sidebar.button("Load"):
        st.session_state.messages = st.session_state.saved_conversations[selected_convo]["messages"].copy()
        st.session_state.current_subject = st.session_state.saved_conversations[selected_convo]["subject"]
        st.sidebar.success(f"Loaded '{selected_convo}'!")
        st.rerun()

# Function to export conversation
def export_conversation():
    if not st.session_state.messages:
        st.sidebar.warning("No conversation to export!")
        return
    
    export_format = st.sidebar.selectbox("Export Format:", ["Text", "JSON", "HTML"], key="export_format")
    
    if st.sidebar.button("Export"):
        if export_format == "Text":
            content = "\n\n".join([f"{msg['role'].upper()}: {msg['content']}" for msg in st.session_state.messages])
            filename = f"conversation_{datetime.now().strftime('%Y%m%d_%H%M')}.txt"
            
        elif export_format == "JSON":
            content = json.dumps(st.session_state.messages, indent=2)
            filename = f"conversation_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
            
        elif export_format == "HTML":
            html_content = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>Co-Teacher Assistant Conversation</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
                    .user { background-color: #e6f7ff; padding: 10px; border-radius: 8px; margin: 10px 0; }
                    .assistant { background-color: #f0f5f9; padding: 10px; border-radius: 8px; margin: 10px 0; }
                    h1 { color: #2c3e50; }
                    .meta { color: #7f8c8d; font-size: 0.9em; }
                </style>
            </head>
            <body>
                <h1>Co-Teacher Assistant Conversation</h1>
                <p class="meta">Exported on: """ + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + """</p>
                <div class="conversation">
            """
            
            for msg in st.session_state.messages:
                class_name = "user" if msg["role"] == "user" else "assistant"
                html_content += f"""
                <div class="{class_name}">
                    <strong>{msg["role"].capitalize()}:</strong>
                    <p>{msg["content"].replace("\n", "<br>")}</p>
                </div>
                """
            
            html_content += """
                </div>
            </body>
            </html>
            """
            content = html_content
            filename = f"conversation_{datetime.now().strftime('%Y%m%d_%H%M')}.html"
        
        # Create download link
        b64 = base64.b64encode(content.encode()).decode()
        href = f'<a href="data:text/plain;base64,{b64}" download="{filename}">Download {export_format} File</a>'
        st.sidebar.markdown(href, unsafe_allow_html=True)

# Welcome screen for first-time users
def show_welcome():
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("# 👋 Welcome to your Co-Teacher Assistant!")
        st.markdown("""
        This AI-powered tool is designed to help you with various teaching tasks. Here's how it can assist you:
        
        - **Create lesson plans** that engage your students
        - **Generate quizzes and assessments** aligned with learning objectives
        - **Suggest classroom activities** for different subjects and age groups
        - **Help with classroom management** strategies
        - **Provide resources** for professional development
        
        Just type your question or request in the chat box below and get immediate assistance!
        """)
        
        st.info("💡 **Pro Tip:** Check out the sidebar for useful templates and customization options!")
        
        if st.button("Get Started", key="welcome_start"):
            st.session_state.first_visit = False
            st.rerun()
    
    with col2:
        st.image("https://placehold.co/400x300/2D2D2D/8ab4f8?text=Co-Teacher+AI&font=montserrat", use_column_width=True)

# Sidebar - Configuration and Templates
with st.sidebar:
    st.image("https://placehold.co/100x100/2D2D2D/8ab4f8?text=👩‍🏫&font=montserrat", width=100)
    st.markdown("## Co-Teacher Settings")
    
    # AI Model Selection
    st.markdown("### 🤖 AI Model")
    model_options = {
        "llama3.2:latest": "Llama 3.2 (Recommended)",
        "llama3:latest": "Llama 3",
        "llama3.2-vision": "llama3.2-vision"
    }
    selected_model = st.selectbox(
        "Select AI Model:",
        options=list(model_options.values()),
        format_func=lambda x: x,
        index=0
    )
    # Convert display name back to model name
    st.session_state.model = list(model_options.keys())[list(model_options.values()).index(selected_model)]
    
    # Subject Area
    st.markdown("### 📚 Subject Focus")
    subjects = ["General", "Mathematics", "Science", "Accountancy", "Social Studies", 
                "Foreign Languages", "Arts", "Physical Education", "Special Education"]
    st.session_state.current_subject = st.selectbox("Select Subject Area:", subjects)
    
    # Response Style
    st.markdown("### 🎯 Response Style")
    st.session_state.response_style = st.select_slider(
        "Response Detail Level:",
        options=["Concise", "Balanced", "Detailed"],
        value=st.session_state.response_style
    )
    
    # Template Suggestions
    st.markdown("### 📋 Quick Templates")
    templates = {
        "Create a Lesson Plan": "Create a 45-minute lesson plan for {subject} about {topic} for grade {grade} students.",
        "Generate a Quiz": "Generate a 10-question quiz on the subject {subject} and for the topic {topic} is for {grade} grade, including answer key.",
        "Classroom Management": "Suggest strategies for managing a classroom where students {issue}.",
        "Differentiated Instruction": "How can I differentiate my {subject} instruction for students who {need}?",
        "Parent Communication": "Draft an email to parents about {topic}."
    }
    
    selected_template = st.selectbox("Choose a template:", ["Select a template..."] + list(templates.keys()))
    
    if selected_template != "Select a template...":
        template = templates[selected_template]
        
        # Parse template and collect required fields
        import re
        fields = re.findall(r'\{([^}]+)\}', template)
        field_values = {}
        
        for field in fields:
            field_values[field] = st.text_input(f"{field.capitalize()}:")
        
        # Generate the prompt with field values
        prompt_template = template
        for field, value in field_values.items():
            prompt_template = prompt_template.replace(f"{{{field}}}", value)
        
        # Only show the "Use Template" button if all fields are filled
        if all(field_values.values()) and st.button("Use Template"):
            # This will be caught in the main section to set as the input
            st.session_state.template_message = prompt_template
    
    st.markdown("---")
    
    # Conversation management
    st.markdown("### 💾 Conversation Management")
    manage_option = st.radio("", ["Save Current", "Load Saved", "Export", "Clear"])
    
    if manage_option == "Save Current":
        save_conversation()
    elif manage_option == "Load Saved":
        load_conversation()
    elif manage_option == "Export":
        export_conversation()
    elif manage_option == "Clear":
        if st.button("Clear Chat History"):
            st.session_state.messages = []
            st.success("Chat history cleared!")
            st.rerun()

# Main Application
if st.session_state.first_visit:
    show_welcome()
else:
    # Main title with emoji
    st.title("💬 Co-Teacher Assistant")
    
    # Quick info about currently selected settings
    st.markdown(f"""
    <div style='background-color: #2D2D2D; padding: 10px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #4a6fa5;'>
        <small>Currently focusing on: <b>{st.session_state.current_subject}</b> | 
        Response style: <b>{st.session_state.response_style}</b> | 
        Model: <b>{selected_model}</b></small>
    </div>
    """, unsafe_allow_html=True)
    
    # Display conversation messages
    if not st.session_state.messages:
        st.info("👋 Hello! I'm your Co-Teacher Assistant. What can I help you with today?")
    else:
        for i, message in enumerate(st.session_state.messages):
            with st.chat_message(message["role"]):
                st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("Ask for teaching assistance..."):
        # Add user message to conversation history
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        # Display user message
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Display assistant response with streaming effect
        with st.chat_message("assistant"):
            message_placeholder = st.empty()
            full_response = ""
            
            # Show typing indicator
            with st.spinner("Thinking..."):
                for response_chunk in stream_response(prompt):
                    full_response += response_chunk
                    message_placeholder.markdown(full_response + "▌")
                    time.sleep(0.01)  # Delay for smoother streaming effect
            
            message_placeholder.markdown(full_response)
        
        # Save assistant response in conversation history
        st.session_state.messages.append({"role": "assistant", "content": full_response})
    
    # Check if a template has been selected and use it
    if "template_message" in st.session_state:
        # Add template message to conversation history
        st.session_state.messages.append({"role": "user", "content": st.session_state.template_message})
        
        # Display user message
        with st.chat_message("user"):
            st.markdown(st.session_state.template_message)
        
        # Process the response
        with st.chat_message("assistant"):
            message_placeholder = st.empty()
            full_response = ""
            
            with st.spinner("Generating response..."):
                for response_chunk in stream_response(st.session_state.template_message):
                    full_response += response_chunk
                    message_placeholder.markdown(full_response + "▌")
                    time.sleep(0.01)
            
            message_placeholder.markdown(full_response)
        
        # Save assistant response and clear the template
        st.session_state.messages.append({"role": "assistant", "content": full_response})
        del st.session_state.template_message
        st.rerun()

# Add a footer with helpful information
st.markdown("""
<div style='background-color: #2D2D2D; padding: 15px; border-radius: 5px; margin-top: 20px; text-align: center;'>
    <small>Co-Teacher Assistant can help with lesson planning, classroom management, assessments, and more. It uses AI to support your teaching needs but should complement your professional judgment.</small>
</div>
""", unsafe_allow_html=True)