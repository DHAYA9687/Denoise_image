import cv2
import sys

def denoise_image(input_path, output_path):
    # Read the image
    img = cv2.imread(input_path)

    # Apply Non-Local Means Denoising
    denoised = cv2.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 21)

    # Save the denoised image
    cv2.imwrite(output_path, denoised)

if __name__ == "__main__":
    # Get file paths from command-line arguments
    input_path = sys.argv[1]
    output_path = sys.argv[2]

    # Process the image
    denoise_image(input_path, output_path)
