import os
import xml.etree.ElementTree as ET
import re
import hashlib

def get_file_hash(file_path):
    """Calculate the MD5 hash of a file."""
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def clean_svg(input_file, output_file):
    print(f"Processing file: {input_file}")
    
    # Parse the SVG file
    ET.register_namespace('', "http://www.w3.org/2000/svg")
    tree = ET.parse(input_file)
    root = tree.getroot()
    
    # Define the SVG namespace
    ns = {'svg': 'http://www.w3.org/2000/svg'}
    
    # Remove known body parts (adjust these selectors as needed)
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
    
    # Write the modified SVG to the output file
    tree.write(output_file, encoding='utf-8', xml_declaration=False)
    
    # Read the file content
    with open(output_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove namespace prefixes
    content = content.replace('ns0:', '')
    content = content.replace(':ns0', '')
    
    # Remove all existing XML declarations
    content = re.sub(r'<\?xml[^>]+\?>\s*', '', content)
    
    # Replace the opening svg tag
    new_svg_tag = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewBox="-40.94377899169922 -146.29818725585938 68.82828521728516 163.4471893310547" preserveAspectRatio="xMidYMid meet" width="300"  height="400" >'
    content = re.sub(r'<svg[^>]*>', new_svg_tag, content)
    
    # Write the corrected content back to the file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('<?xml version=\'1.0\' encoding=\'utf-8\'?>\n')
        f.write(content.strip())
    
    print(f"Saved processed file: {output_file}")
    print(f"Elements removed: {elements_removed}")

# Set up directories
script_dir = os.path.dirname(os.path.abspath(__file__))
repo_root = os.path.dirname(script_dir)
input_dir = script_dir
output_dir = os.path.join(repo_root, 'output')

print(f"Input directory: {input_dir}")
print(f"Output directory: {output_dir}")

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Process SVG files
svg_files = [f for f in os.listdir(input_dir) if f.endswith('.svg')]
print(f"SVG files found: {svg_files}")

for filename in svg_files:
    input_path = os.path.join(input_dir, filename)
    output_path = os.path.join(output_dir, filename)
    
    # Check if the file needs processing
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
