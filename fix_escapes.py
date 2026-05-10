import os

def clean_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Replace escaped backticks and dollar signs if they exist
        # These are common in template literals that were stringified
        content = content.replace('\\`', '`')
        content = content.replace('\\$', '$')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned escapes: {file_path}")
    except Exception as e:
        print(f"Failed to clean {file_path}: {e}")

def walk_and_clean(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if 'venv' in dirs:
            dirs.remove('venv')
        
        for file in files:
            if file.endswith(('.jsx', '.js', '.css')):
                clean_file(os.path.join(root, file))

walk_and_clean(r"d:\Odoo\app\frontend\src")
