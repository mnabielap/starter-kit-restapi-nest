import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

# Endpoint Configuration
endpoint = "/auth/login"
url = f"{utils.BASE_URL}{endpoint}"

payload = {
    "email": "admin@example.com",
    "password": "password123"
}

# Execute
response = utils.send_and_print(
    url=url,
    method="POST",
    body=payload,
    headers={"Content-Type": "application/json"},
    output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
)

# Update tokens in secrets.json
if response.status_code == 200:
    data = response.json()
    if data:
        tokens = data.get('tokens', {})
        utils.save_config("access_token", tokens.get('access', {}).get('token'))
        utils.save_config("refresh_token", tokens.get('refresh', {}).get('token'))
        print("\n[INFO] Tokens updated in secrets.json")