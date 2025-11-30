import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

# Endpoint Configuration
endpoint = "/auth/verify-email"

# Retrieve token manually set in secrets.json or use a placeholder
verify_token = utils.load_config("verify_token") or "PLACEHOLDER_TOKEN_FROM_EMAIL"

url = f"{utils.BASE_URL}{endpoint}?token={verify_token}"

# Execute
utils.send_and_print(
    url=url,
    method="GET",
    headers={"Content-Type": "application/json"},
    output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
)