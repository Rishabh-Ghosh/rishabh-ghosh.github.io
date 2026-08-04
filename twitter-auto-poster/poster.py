import json
import argparse
import sys
import tweepy

# Ensure UTF-8 output formatting on Windows terminals
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from config import X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
from generator import generate_macro_shitpost

QUEUE_FILE = "tweets.json"

def get_twitter_client():
    """Initializes and returns the Tweepy Twitter API v2 Client."""
    if not all([X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET]):
        raise ValueError("Missing X (Twitter) API credentials in environment or .env file.")

    return tweepy.Client(
        consumer_key=X_API_KEY,
        consumer_secret=X_API_SECRET,
        access_token=X_ACCESS_TOKEN,
        access_token_secret=X_ACCESS_TOKEN_SECRET
    )

def get_tweet_from_queue():
    """Fetches the next unposted tweet from tweets.json and marks it as posted."""
    try:
        with open(QUEUE_FILE, "r", encoding="utf-8") as f:
            tweets = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        print(f"Error loading {QUEUE_FILE}")
        return None, None

    for tweet_item in tweets:
        if not tweet_item.get("posted", False):
            tweet_text = tweet_item["text"]
            tweet_id = tweet_item["id"]
            return tweet_id, tweet_text, tweets
            
    return None, None, tweets

def mark_tweet_posted(tweet_id, tweets):
    """Marks a tweet as posted in tweets.json."""
    for tweet_item in tweets:
        if tweet_item["id"] == tweet_id:
            tweet_item["posted"] = True
            break
            
    with open(QUEUE_FILE, "w", encoding="utf-8") as f:
        json.dump(tweets, f, indent=2)

def run_poster(mode="ai", dry_run=True, topic=None):
    print("==========================================")
    print(f"🚀 TWITTER AUTO-POSTER (Mode: {mode.upper()}, Dry Run: {dry_run})")
    print("==========================================")
    
    tweet_text = None
    tweet_id = None
    tweets_list = None

    if mode == "ai":
        print("Generating fresh macro shitpost via Gemini AI...")
        tweet_text = generate_macro_shitpost(topic=topic)
    elif mode == "queue":
        print("Fetching next unposted tweet from tweets.json...")
        tweet_id, tweet_text, tweets_list = get_tweet_from_queue()
        if not tweet_text:
            print("⚠️ Queue is empty or all tweets have been posted! Switching to AI generation...")
            tweet_text = generate_macro_shitpost(topic=topic)

    if not tweet_text:
        print("❌ Failed to get tweet content.")
        sys.exit(1)

    print(f"\n📝 TWEET TO POST:\n----------------------------------------\n{tweet_text}\n----------------------------------------")

    if dry_run:
        print("\n✅ DRY RUN COMPLETE. Tweet was NOT sent to X (Twitter).")
        print("To actually post live, run without --dry-run when your API keys are set up.")
    else:
        print("\nSending tweet to X (Twitter) API...")
        try:
            client = get_twitter_client()
            response = client.create_tweet(text=tweet_text)
            print(f"🎉 SUCCESS! Tweet published live! Tweet ID: {response.data['id']}")
            
            if mode == "queue" and tweet_id is not None:
                mark_tweet_posted(tweet_id, tweets_list)
                print("Updated queue: marked tweet as posted.")
        except Exception as e:
            print(f"❌ Failed to publish tweet: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Twitter Auto-Poster")
    parser.add_argument("--mode", choices=["ai", "queue"], default="queue", help="Mode: 'ai' generated or 'queue' file")
    parser.add_argument("--topic", type=str, default=None, help="Custom topic for AI mode")
    parser.add_argument("--no-dry-run", action="store_true", help="Publish live tweet to X (Twitter)")

    args = parser.parse_args()
    
    # Dry run by default unless --no-dry-run is explicitly passed
    is_dry_run = not args.no_dry_run
    
    run_poster(mode=args.mode, dry_run=is_dry_run, topic=args.topic)
