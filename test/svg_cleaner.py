import os
import xml.etree.ElementTree as ET
import re
import hashlib

def get_file_hash(file_path):
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def clean_svg(input_file, output_file):
    print(f"Processing file: {input_file}")
    
    try:
        ET.register_namespace('', "http://www.w3.org/2000/svg")
        tree = ET.parse(input_file)
        root = tree.getroot()
        
        ns = {'svg': 'http://www.w3.org/2000/svg'}
        
        body_parts = [
            ".//svg:path[@fill='#F4D5BF']",
            ".//svg:path[@fill='#E6BBA8']",
        ]
        
        elements_removed = 0
        for selector in body_parts:
            for element in root.findall(selector, ns):
                for parent in root.iter():
                    if element in parent:
                        parent.remove(element)
                        elements_removed += 1
                        break
        
        tree.write(output_file, encoding='utf-8', xml_declaration=True)
        
        with open(output_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        content = re.sub(r'<svg[^>]*>', '<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">', content, 1)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(content.strip())
        
        print(f"Saved processed file: {output_file}")
        print(f"Elements removed: {elements_removed}")
    except Exception as e:
        print(f"Error processing {input_file}: {str(e)}")

script_dir = os.path.dirname(os.path.abspath(__file__))
repo_root = os.path.dirname(script_dir)
input_dir = script_dir
output_dir = os.path.join(repo_root, 'output')

print(f"Input directory: {input_dir}")
print(f"Output directory: {output_dir}")

os.makedirs(output_dir, exist_ok=True)

svg_files = [f for f in os.listdir(input_dir) if f.endswith('.svg')]
print(f"SVG files found: {svg_files}")

for filename in svg_files:
    input_path = os.path.join(input_dir, filename)
    output_path = os.path.join(output_dir, filename)
    
    if os.path.exists(output_path):
        input_hash = get_file_hash(input_path)
        output_hash = get_file_hash(output_path)
        
        if input_hash == output_hash:
            print(f"Skipping {filename} - already processed")
            continue
    
    clean_svg(input_path, output_path)

print("SVG cleaning complete!")
print("Contents of output directory:")
print(os.listdir(output_dir))
