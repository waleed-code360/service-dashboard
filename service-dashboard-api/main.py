import uvicorn
# Import the actual app instance from the Vercel entry point
# This ensures local development uses the exact same code as production
from api.index import app

if __name__ == "__main__":
    uvicorn.run("api.index:app", host="0.0.0.0", port=8000, reload=True)
