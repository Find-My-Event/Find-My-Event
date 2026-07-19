import os
from PIL import Image

gallery_dir = r"c:\Users\Lenovo\eventum\Find-My-Event\client\public\images\gallery"

def compress_images():
    for filename in os.listdir(gallery_dir):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            filepath = os.path.join(gallery_dir, filename)
            try:
                # Open image
                img = Image.open(filepath)
                
                # Convert to RGB if it's RGBA (for saving as JPEG)
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                
                # Resize if the image is too large (max width 1920)
                max_width = 1920
                if img.width > max_width:
                    ratio = max_width / img.width
                    new_size = (max_width, int(img.height * ratio))
                    img = img.resize(new_size, Image.Resampling.LANCZOS)
                
                # Save with optimization and lower quality
                img.save(filepath, "JPEG", optimize=True, quality=60)
                print(f"Successfully compressed {filename}. New size: {os.path.getsize(filepath) / (1024*1024):.2f} MB")
            except Exception as e:
                print(f"Failed to compress {filename}: {e}")

if __name__ == "__main__":
    print(f"Compressing images in {gallery_dir}...")
    compress_images()
