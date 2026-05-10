import os

def clean_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        content = content.strip()
        if content.startswith('"') and content.endswith('"'):
            content = content[1:-1]
            content = content.replace('\\"', '"')
            content = content.replace('\\n', '\n') # Also handle escaped newlines if any
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Cleaned: {file_path}")
    except Exception as e:
        print(f"Failed to clean {file_path}: {e}")

def walk_and_clean(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if 'venv' in dirs:
            dirs.remove('venv')
        if '.git' in dirs:
            dirs.remove('.git')
        
        for file in files:
            if file.endswith(('.js', '.jsx', '.css', '.html', '.json', '.py', '.md', '.env')):
                clean_file(os.path.join(root, file))

walk_and_clean(r"d:\Odoo\app")
