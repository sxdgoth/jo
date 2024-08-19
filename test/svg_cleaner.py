import os
import xml.etree.ElementTree as ET

def clean_svg(input_file, output_file):
    print(f"Processing file: {input_file}")
    tree = ET.parse(input_file)
    root = tree.getroot()
    ns = {'svg': 'http://www.w3.org/2000/svg'}
    body_parts = [
        ".//svg:path[@fill='#F4D5BF']",
        ".//svg:path[@fill='#E6BBA8']",
    ]
    for selector in body_parts:
        for element in root.findall(selector, ns):
            for parent in root.iter():
                if element in parent:
                    parent.remove(element)
                    break
    tree.write(output_file, encoding='unicode', xml_declaration=True)
    print(f"Saved processed file: {output_file}")

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
svg_files = [f for f in os.listdir(input_dir) if f.endswith('.svg') and f != 'svg_cleaner.py']
print(f"SVG files found: {svg_files}")

for filename in svg_files:
    input_path = os.path.join(input_dir, filename)
    output_path = os.path.join(output_dir, filename)
    clean_svg(input_path, output_path)

print("SVG cleaning complete!")
print("Contents of output directory:")
print(os.listdir(output_dir))
