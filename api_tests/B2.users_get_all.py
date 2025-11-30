import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

# Endpoint Configuration
endpoint = "/users"
# Adding query params for pagination
url = f"{utils.BASE_URL}{endpoint}?page=1&take=10&order=DESC"

access_token = utils.load_config("access_token")

headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}

# Execute
utils.send_and_print(
    url=url,
    method="GET",
    headers=headers,
    output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
)