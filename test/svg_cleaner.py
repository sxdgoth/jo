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
        
        # Replace the opening svg tag with the desired format
        new_svg_tag = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewBox="-40.94377899169922 -146.29818725585938 68.82828521728516 163.4471893310547" preserveAspectRatio="xMidYMid meet" width="300"  height="400" >'
        content = re.sub(r'<svg[^>]*>', new_svg_tag, content, 1)
        
        # Add the g tag with transform
        g_tag = '<g transform="translate(0, -27) scale(0.7)" preserveAspectRatio="none">'
        content = content.replace(new_svg_tag, new_svg_tag + '\n' + g_tag)
        
        # Close the g tag at the end of the SVG
        content = content.replace('</svg>', '</g></svg>')
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(content.strip())
        
        print(f"Saved processed file: {output_file}")
        print(f"Elements removed: {elements_removed}")
    except Exception as e:
        print(f"Error processing {input_file}: {str(e)}")

# The rest of your script remains the same
