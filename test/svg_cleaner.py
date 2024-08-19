import os
import xml.etree.ElementTree as ET

def clean_svg(input_file, output_file):
    # Parse the SVG file
    tree = ET.parse(input_file)
    root = tree.getroot()

    # Define the SVG namespace
    ns = {'svg': 'http://www.w3.org/2000/svg'}

    # Remove known body parts
    body_parts = [
        ".//svg:path[@fill='#F4D5BF']",
        ".//svg:path[@fill='#E6BBA8']",
    ]

    for selector in body_parts:
        for element in root.findall(selector, ns):
            parent = element.getparent()
            if parent is not None:
                parent.remove(element)

    # Save the modified SVG
    tree.write(output_file, encoding='unicode', xml_declaration=True)

# Process files
input_dir = 'input'
output_dir = 'output'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

for filename in os.listdir(input_dir):
    if filename.endswith('.svg'):
        input_path = os.path.join(input_dir, filename)
        output_path = os.path.join(output_dir, filename)
        clean_svg(input_path, output_path)
        print(f"Processed: {filename}")

print("SVG cleaning complete!")
