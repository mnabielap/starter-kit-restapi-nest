import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

# Endpoint Configuration
endpoint = "/auth/forgot-password"
url = f"{utils.BASE_URL}{endpoint}"

email = utils.load_config("user_email") or "user_example@example.com"

payload = {
    "email": email
}

# Execute
utils.send_and_print(
    url=url,
    method="POST",
    body=payload,
    headers={"Content-Type": "application/json"},
    output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
)