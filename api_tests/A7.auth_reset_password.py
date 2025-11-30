import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

# Endpoint Configuration
endpoint = "/auth/reset-password"
url = f"{utils.BASE_URL}{endpoint}"

# Retrieve token manually set in secrets.json or use a placeholder to test the payload format
reset_token = utils.load_config("reset_token") or "PLACEHOLDER_TOKEN_FROM_EMAIL"

payload = {
    "token": reset_token,
    "password": "newPassword456"
}

# Execute
utils.send_and_print(
    url=url,
    method="POST",
    body=payload,
    headers={"Content-Type": "application/json"},
    output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
)