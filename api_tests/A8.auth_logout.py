import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

# Endpoint Configuration
endpoint = "/auth/logout"
url = f"{utils.BASE_URL}{endpoint}"

refresh_token = utils.load_config("refresh_token")

payload = {
    "refreshToken": refresh_token
}

# Execute
utils.send_and_print(
    url=url,
    method="POST",
    body=payload,
    headers={"Content-Type": "application/json"},
    output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
)