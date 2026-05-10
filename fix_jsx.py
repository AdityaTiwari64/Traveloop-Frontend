import os
import re

def fix_jsx(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix tags: < div -> <div, </ div -> </div
        content = re.sub(r'<\s+([a-zA-Z])', r'<\1', content)
        content = re.sub(r'</\s+([a-zA-Z])', r'</\1', content)
        
        # Fix Tag > -> Tag>
        content = re.sub(r'([a-zA-Z0-9])\s+>', r'\1>', content)
        
        # Fix self-closing tags: / > -> />
        content = content.replace('/ >', '/>')

        # Fix data-testid: data - testid -> data-testid
        content = content.replace('data - testid', 'data-testid')
        
        # Fix attributes with spaces: attr = "val" or attr = {val}
        content = re.sub(r'([a-zA-Z0-9-]+)\s*=\s*([{"\'])', r'\1=\2', content)
        
        # Specific fixes for common components/attributes
        content = content.replace('Link to ="', 'Link to="')
        content = content.replace('Link to ={', 'Link to={')
        content = content.replace('data - testid ="', 'data-testid="')
        content = content.replace('data - testid ={', 'data-testid={')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed JSX: {file_path}")
    except Exception as e:
        print(f"Failed to fix {file_path}: {e}")

def walk_and_fix(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        
        for file in files:
            if file.endswith(('.jsx', '.js')):
                fix_jsx(os.path.join(root, file))

walk_and_fix(r"d:\Odoo\app\frontend\src")
