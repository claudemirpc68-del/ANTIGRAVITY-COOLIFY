# Analyze Reddit Trends

**Goal:** Fetch recent Reddit posts regarding specific topics, analyze engagement, and extract the top performing posts.

**Inputs:**
- Keywords: List of topics to search (e.g., "n8n", "automation")
- Limit: Number of recent posts to fetch (Default: 100)
- Top N: Number of top posts to extract per topic (Default: 5)

**Tools/Scripts:**
- `execution/analyze_reddit_trends.py`

**Steps:**
1.  Define the keywords ("n8n", "automation").
2.  Run `execution/analyze_reddit_trends.py` with these keywords.
    - Script should search Reddit (using `.json` endpoints or API).
    - Fetch 100 most recent posts for each keyword.
    - Calculate an engagement score (Score + NumComments).
    - Sort and filter the top 5.
3.  Generate a report in `.tmp/reddit_trends_report.md`.

**Outputs:**
- Report file: `.tmp/reddit_trends_report.md`
- Console output covering the top posts.
