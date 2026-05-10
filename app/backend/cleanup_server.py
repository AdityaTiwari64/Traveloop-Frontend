import os

file_path = r"d:\Odoo\app\backend\server.py"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove leading and trailing quotes if they exist
content = content.strip()
if content.startswith('"') and content.endswith('"'):
    content = content[1:-1]

# Replace escaped quotes
content = content.replace('\\"', '"')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Cleaned up server.py")
