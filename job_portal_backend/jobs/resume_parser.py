import pdfplumber

def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

import re

def extract_basic_details(text):
    email = re.findall(r'\S+@\S+', text)
    phone = re.findall(r'\+?\d[\d -]{8,12}\d', text)

    return {
        "email": email[0] if email else "",
        "phone": phone[0] if phone else "",
    }

def detect_job_role(text):
    text = text.lower()

    if "react" in text and "django" in text:
        return "Full Stack Developer"
    elif "react" in text and "node" in text:
        return "MERN Stack"
    elif "react" in text:
        return "Frontend Developer"
    elif "django" in text:
        return "Backend Developer"
    elif "data" in text:
        return "Data Analyst"

    return "General"

SKILLS = [
    "python", "react", "django", "mysql",
    "javascript", "html", "css", "tailwind", "bootstrap"
]

from .models import Skill

def normalize(text):
    print("🔥 NEW SKILL FUNCTION RUNNING")
    return text.lower().replace(".", "").replace(" ", "")

def extract_skills(text):
    text = normalize(text)

    db_skills = Skill.objects.all()

    found = []

    for skill in db_skills:
        skill_name = normalize(skill.name)

        if skill_name in text:
            found.append(skill.name)

    return list(set(found))

def extract_name(text):
    lines = text.strip().split("\n")

    for line in lines[:5]:  # check first 5 lines
        if len(line.split()) >= 2 and line.isupper():
            return line.title()

    return ""