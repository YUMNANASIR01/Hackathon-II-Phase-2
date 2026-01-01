import os
os.environ["VERCEL"] = "1"  # Set environment variable to indicate Vercel deployment

from backend.main import app
from mangum import Mangum

# Create a Mangum adapter to handle Vercel/Serverless requests
# Disable lifespan to avoid issues with Vercel's runtime
mangum_handler = Mangum(app, lifespan="off")

# Default handler for Vercel Python serverless functions
def handler(event, context):
    """
    Vercel serverless function handler
    This function is called by Vercel to handle incoming requests
    """
    return mangum_handler(event, context)