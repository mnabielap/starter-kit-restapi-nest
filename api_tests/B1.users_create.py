import sys
import os
import time
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

# Endpoint Configuration
endpoint = "/users"
url = f"{utils.BASE_URL}{endpoint}"

access_token = utils.load_config("access_token")

headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}

# Create a unique sub-user
timestamp = int(time.time())
payload = {
    "name": "Sub User",
    "email": f"subuser_{timestamp}@example.com",
    "password": "password123",
    "role": "user"
}

# Execute
response = utils.send_and_print(
    url=url,
    method="POST",
    body=payload,
    headers=headers,
    output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
)

# Save this new user ID to delete/update later
if response.status_code == 201:
    data = response.json()
    if data:
        utils.save_config("target_user_id", data.get('id'))
        print("\n[INFO] Target user ID saved to secrets.json for Update/Delete tests")