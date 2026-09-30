import sys
from PIL import Image, ImageChops

def trim(im):
    bg = Image.new(im.mode, im.size, im.getpixel((0,0)))
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        return im.crop(bbox)
    return im

def process_cert(input_path, output_path):
    print(f"Cropping {input_path}...")
    try:
        im = Image.open(input_path)
        # Using a fixed color (black) for border removal assuming letterboxing
        bg = Image.new(im.mode, im.size, (0, 0, 0))
        diff = ImageChops.difference(im, bg)
        diff = ImageChops.add(diff, diff, 2.0, -100)
        bbox = diff.getbbox()
        
        if bbox:
            print(f"Found bounding box: {bbox}")
            cropped = im.crop(bbox)
            cropped.save(output_path, quality=95)
            print(f"Saved cropped image to {output_path}")
        else:
            print("No black border detected.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python crop_certs.py <input> <output>")
    else:
        process_cert(sys.argv[1], sys.argv[2])
