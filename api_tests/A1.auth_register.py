import sys
import os
import time
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

# Endpoint Configuration
endpoint = "/auth/register"
url = f"{utils.BASE_URL}{endpoint}"

# Unique email generator for repeated testing
timestamp = int(time.time())
payload = {
    "email": f"user_{timestamp}@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "user",
}

# Execute
response = utils.send_and_print(
    url=url,
    method="POST",
    body=payload,
    headers={"Content-Type": "application/json"},
    output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
)

# Save tokens for future requests
if response.status_code == 201:
    data = response.json()
    if data:
        user = data.get('user', {})
        tokens = data.get('tokens', {})
        
        # Save to secrets.json
        utils.save_config("user_id", user.get('id'))
        utils.save_config("user_email", user.get('email'))
        utils.save_config("access_token", tokens.get('access', {}).get('token'))
        utils.save_config("refresh_token", tokens.get('refresh', {}).get('token'))
        print("\n[INFO] User credentials and tokens saved to secrets.json")