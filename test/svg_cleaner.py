import os
import xml.etree.ElementTree as ET
import urllib.parse

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
            parent = element.getparent()
            if parent is not None:
                parent.remove(element)
    tree.write(output_file, encoding='unicode', xml_declaration=True)
    print(f"Saved processed file: {output_file}")

# Set up directories and URLs
base_url = "https://sxdgoth.github.io/jo"
input_dir = os.path.dirname(os.path.abspath(__file__))
output_dir = os.path.join(os.path.dirname(input_dir), 'output')

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
    
    # Generate URL for the processed file
    relative_path = os.path.relpath(output_path, os.path.dirname(input_dir))
    url_path = urllib.parse.quote(relative_path)
    full_url = f"{base_url}/{url_path}"
    print(f"Processed file URL: {full_url}")

print("SVG cleaning complete!")
print("Contents of output directory:")
print(os.listdir(output_dir))
