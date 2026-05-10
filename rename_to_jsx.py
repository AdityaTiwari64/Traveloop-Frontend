import os

def rename_js_to_jsx(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.js') and file != 'vite.config.js': # Keep vite.config.js as is if it's there
                old_path = os.path.join(root, file)
                new_path = os.path.join(root, file[:-3] + '.jsx')
                
                # Check if it contains JSX
                with open(old_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if '<' in content and '>' in content: # Simple heuristic for JSX
                    os.rename(old_path, new_path)
                    print(f"Renamed: {old_path} -> {new_path}")

rename_js_to_jsx(r"d:\Odoo\app\frontend\src")
