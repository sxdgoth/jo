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

# Get the current directory (which should be the 'test' folder)
current_dir = os.path.dirname(os.path.abspath(__file__))

# Set input and output directories relative to the current directory
input_dir = current_dir
output_dir = os.path.join(os.path.dirname(current_dir), 'output')

# Create output directory if it doesn't exist
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Process files
for filename in os.listdir(input_dir):
    if filename.endswith('.svg') and filename != 'svg_cleaner.py':
        input_path = os.path.join(input_dir, filename)
        output_path = os.path.join(output_dir, filename)
        clean_svg(input_path, output_path)
        print(f"Processed: {filename}")

print("SVG cleaning complete!")






