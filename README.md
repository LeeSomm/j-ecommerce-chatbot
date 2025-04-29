# 🛒 J-Ecommerce Chatbot

A multilingual AI-powered chatbot that recommends products in **English** by referencing a structured **Japanese NoSQL product database**. Built with FastAPI, LangChain, and OpenAI, this proof-of-concept bridges the language and search gap for global shoppers interested in Japanese goods.

---

## 🚀 Features

- 🔍 **Conversational Product Search**  
  Users can ask for product recommendations in natural English (e.g., "Are there any specialty items from Kumamoto, Japan?").

- 🇯🇵➡️🇺🇸 **Cross-Language Retrieval**  
  Japanese product data is indexed and queried using RAG (Retrieval-Augmented Generation), with results surfaced in fluent English.

- 📊 **Structured Product Info**  
  Returns include key specs, price, and purchase links—parsed and summarized from Japanese websites.

- 💬 **Context-Aware Conversations**  
  Remembers the conversation state to refine or narrow product recommendations dynamically.

---

## 🧱 Tech Stack

- **Frontend**: SvelteKit 
- **Backend**: FastAPI, LangChain, OpenAI API (see j-ecommerce-api)
- **Database**: Firestore NoSQL Document Database
- **Parsed Data**: Utilized Parsel to acquire structured data from HTML 
