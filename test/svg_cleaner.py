import os
import xml.etree.ElementTree as ET
import urllib.request

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
        ".//svg:path[@fill='#FFFFFF']",  # Assuming the body is white
        ".//svg:path[@fill='#999999']",  # Assuming some parts might be grey
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

# Set up input URL and output path
input_url = "https://sxdgoth.github.io/jo/test/trollface.svg"
output_dir = "output"
output_file = os.path.join(output_dir, "cleaned_trollface.svg")

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Process the SVG file
clean_svg(input_url, output_file)

print("SVG cleaning complete!")
print("Output file:", output_file)
