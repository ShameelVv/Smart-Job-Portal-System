def calculate_match_score(user_skills, job_skills):
    if not job_skills:
        return 0

    # convert to lowercase for safety
    user_skills = [s.lower().replace(".js", "") for s in user_skills]
    job_skills = [s.lower().replace(".js", "") for s in job_skills]

    matched = set(user_skills) & set(job_skills)

    score = len(matched) / len(job_skills)

    return round(score, 2)  