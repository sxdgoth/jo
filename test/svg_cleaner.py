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
        ".//svg:g[svg:path[@fill='#F4D5BF']]",
        ".//svg:g[svg:path[@fill='#E6BBA8']]"
    ]

    for selector in body_parts:
        for element in root.findall(selector, ns):
            element.getparent().remove(element)

    # Adjust viewBox
    viewBox = root.attrib['viewBox'].split()
    viewBox[1] = str(float(viewBox[1]) * 0.7)  # Adjust top
    viewBox[3] = str(float(viewBox[3]) * 0.5)  # Reduce height
    root.attrib['viewBox'] = ' '.join(viewBox)

    # Save the modified SVG
    tree.write(output_file, encoding='unicode', xml_declaration=True)

def process_directory(input_dir, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for filename in os.listdir(input_dir):
        if filename.endswith('.svg'):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, filename)
            clean_svg(input_path, output_path)
            print(f"Processed: {filename}")

# Usage
input_directory = 'input'
output_directory = 'output'
process_directory(input_directory, output_directory)
print("SVG cleaning complete!")
