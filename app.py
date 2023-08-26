# from rembg import remove

# input_path = 'input.png'
# output_path = 'output.png'

# with open(input_path, 'rb') as i:
#     with open(output_path, 'wb') as o:
#         input_data = i.read()
#         output_data = remove(input_data)
#         o.write(output_data)

# print("Fondo removido y la imagen fue guardada en", output_path)


import sys
from rembg import remove


image_path = sys.argv[1]


with open(image_path, 'rb') as f:
    image_data = f.read()

output_path = './public/Imagen/output.png'
output_data = remove(image_data)

with open(output_path, 'wb') as o:
    o.write(output_data)

print("Fondo removido y la imagen fue guardada en", output_path)


