import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

access_token = utils.load_config("access_token")
target_id = utils.load_config("target_user_id") 

if not target_id:
    print("No target_user_id found in secrets.json. Skipping delete to avoid deleting the main admin account.")
    sys.exit(0)

# Endpoint Configuration
endpoint = f"/users/{target_id}"
url = f"{utils.BASE_URL}{endpoint}"

headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}

# Execute
utils.send_and_print(
    url=url,
    method="DELETE",
    headers=headers,
    output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
)