import jwt

SECRET_KEY = "your_secret_key_here"
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImV4cCI6MTc1MzI5MzAzNn0.yNViRcUxloYDAPA_MJ88pltsfYg_8QkM2rEezU_62Cg"
payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
print(payload)