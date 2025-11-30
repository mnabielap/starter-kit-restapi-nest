import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

# Endpoint Configuration
endpoint = "/auth/refresh-tokens"
url = f"{utils.BASE_URL}{endpoint}"

refresh_token = utils.load_config("refresh_token")

payload = {
    "refreshToken": refresh_token
}

# Execute
response = utils.send_and_print(
    url=url,
    method="POST",
    body=payload,
    headers={"Content-Type": "application/json"},
    output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
)

# Update tokens
if response.status_code == 200:
    data = response.json()
    if data:
        # Structure is { access: {...}, refresh: {...} } directly
        utils.save_config("access_token", data.get('access', {}).get('token'))
        utils.save_config("refresh_token", data.get('refresh', {}).get('token'))
        print("\n[INFO] Refreshed tokens updated in secrets.json")