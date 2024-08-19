import os
import xml.etree.ElementTree as ET
import urllib.request
import json

def clean_svg(input_url, output_file):
    print(f"Processing file from URL: {input_url}")
    
    # Fetch SVG content from URL
    with urllib.request.urlopen(input_url) as response:
        svg_content = response.read()
    
    # Parse the SVG content
    tree = ET.fromstring(svg_content)
    
    # Define the SVG namespace
    ns = {'svg': 'http://www.w3.org/2000/svg'}
    
    # Remove known body parts (adjust these selectors as needed)
    body_parts = [
        ".//svg:path[@fill='#FFFFFF']",
        ".//svg:path[@fill='#999999']",
        ".//svg:path[@fill='#F4D5BF']",
        ".//svg:path[@fill='#E6BBA8']",
    ]
    
    elements_removed = 0
    for selector in body_parts:
        for element in tree.findall(selector, ns):
            parent = element.find('..')
            if parent is not None:
                parent.remove(element)
                elements_removed += 1
    
    # Write the modified SVG to the output file
    ET.ElementTree(tree).write(output_file, encoding='unicode', xml_declaration=True)
    print(f"Saved processed file: {output_file}")
    print(f"Elements removed: {elements_removed}")

# Set up base URL and output directory
base_url = "https://sxdgoth.github.io/jo/test/"
output_dir = "output"

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Fetch list of files in the directory
index_url = base_url + "index.json"
with urllib.request.urlopen(index_url) as response:
    file_list = json.loads(response.read())

# Process each SVG file
for file in file_list:
    if file.endswith('.svg'):
        input_url = base_url + file
        output_file = os.path.join(output_dir, file)
        clean_svg(input_url, output_file)

print("SVG cleaning complete!")
print("Output directory:", output_dir)
