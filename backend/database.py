import sqlite3
from datetime import datetime, date

def init_db():
    conn = sqlite3.connect('matrix.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS activities
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  date TEXT,
                  intent TEXT,
                  task TEXT,
                  duration INTEGER)''')
    conn.commit()
    conn.close()

def add_activity(intent, task, duration):
    conn = sqlite3.connect('matrix.db')
    c = conn.cursor()
    today = date.today().isoformat()
    c.execute("INSERT INTO activities (date, intent, task, duration) VALUES (?, ?, ?, ?)",
              (today, intent, task, duration))
    conn.commit()
    conn.close()

def get_daily_summary():
    conn = sqlite3.connect('matrix.db')
    c = conn.cursor()
    today = date.today().isoformat()
    c.execute("""
        SELECT intent, SUM(duration) 
        FROM activities 
        WHERE date = ? 
        GROUP BY intent
    """, (today,))
    results = c.fetchall()
    conn.close()

    summary = {
        "work": 0,
        "break": 0,
        "errands": 0,
        "sleep": 0
    }
    for intent, duration in results:
        if intent in summary:
            summary[intent] = duration
    
    return summary

