import json
import requests
import time
from datetime import datetime
import os

def fetch_reddit_posts(query, limit=100):
    """
    Fetches posts from Reddit using the public JSON endpoint.
    Note: Public endpoints are rate-limited and might require a custom User-Agent.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    posts = []
    after = None
    
    print(f"Fetching posts for '{query}'...")
    
    while len(posts) < limit:
        url = f"https://www.reddit.com/search.json?q={query}&sort=new&limit=100&restrict_sr=false"
        if after:
            url += f"&after={after}"
            
        try:
            response = requests.get(url, headers=headers)
            if response.status_code != 200:
                print(f"Error fetching data: {response.status_code}")
                break
                
            data = response.json()
            children = data.get('data', {}).get('children', [])
            
            if not children:
                break
                
            for child in children:
                post = child['data']
                posts.append({
                    'title': post.get('title'),
                    'url': post.get('url'),
                    'permalink': f"https://www.reddit.com{post.get('permalink')}",
                    'score': post.get('score', 0),
                    'num_comments': post.get('num_comments', 0),
                    'created_utc': post.get('created_utc'),
                    'subreddit': post.get('subreddit'),
                    'selftext': post.get('selftext', '')[:200] + "..." # Snippet
                })
                
            after = data['data'].get('after')
            if not after:
                break
                
            time.sleep(2) # Be polite to the API
            
        except Exception as e:
            print(f"Exception: {e}")
            break
            
    return posts[:limit]

def analyze_engagement(posts):
    """
    Calculates engagement score and returns sorted list.
    Score = upvotes + (comments * 2) - weighting comments higher as active engagement.
    """
    analyzed_posts = []
    for post in posts:
        engagement_score = post['score'] + (post['num_comments'] * 2)
        post['engagement_score'] = engagement_score
        analyzed_posts.append(post)
    
    # Sort by engagement score descending
    return sorted(analyzed_posts, key=lambda x: x['engagement_score'], reverse=True)

def main():
    topics = ["n8n", "automation"]
    limit_per_topic = 100
    top_n = 5
    
    report_lines = ["# Reddit Trend Analysis Report", f"Generated on: {datetime.now()}", ""]
    
    start_time = time.time()
    
    for topic in topics:
        raw_posts = fetch_reddit_posts(topic, limit_per_topic)
        sorted_posts = analyze_engagement(raw_posts)
        top_posts = sorted_posts[:top_n]
        
        print(f"\nTop {top_n} posts for '{topic}':")
        report_lines.append(f"## Top Trends for '{topic}'")
        
        for i, post in enumerate(top_posts, 1):
            line = f"{i}. **{post['title']}** (Score: {post['engagement_score']})"
            subline = f"   - Subreddit: r/{post['subreddit']} | Upvotes: {post['score']} | Comments: {post['num_comments']}"
            link = f"   - Link: {post['permalink']}"
            
            print(line)
            print(subline)
            
            report_lines.append(line)
            report_lines.append(subline)
            report_lines.append(link)
            report_lines.append("")
            
    # Save Report
    os.makedirs(".tmp", exist_ok=True)
    report_path = ".tmp/reddit_trends_report.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines))
        
    print(f"\nFull report saved to {report_path}")

if __name__ == "__main__":
    main()
