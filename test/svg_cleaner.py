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
            parent = element.getparent()
            if parent is not None:
                parent.remove(element)
    tree.write(output_file, encoding='unicode', xml_declaration=True)
    print(f"Saved processed file: {output_file}")

current_dir = os.path.dirname(os.path.abspath(__file__))
input_dir = current_dir
output_dir = os.path.join(os.path.dirname(current_dir), 'output')

print(f"Current directory: {current_dir}")
print(f"Input directory: {input_dir}")
print(f"Output directory: {output_dir}")

if not os.path.exists(output_dir):
    os.makedirs(output_dir)
    print(f"Created output directory: {output_dir}")

for filename in os.listdir(input_dir):
    if filename.endswith('.svg') and filename != 'svg_cleaner.py':
        input_path = os.path.join(input_dir, filename)
        output_path = os.path.join(output_dir, filename)
        clean_svg(input_path, output_path)

print("SVG cleaning complete!")
print("Contents of output directory:")
print(os.listdir(output_dir))
