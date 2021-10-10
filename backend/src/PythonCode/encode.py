import image_deal as id
import sys

print('encode_begin')
id.encode(sys.argv[1], sys.argv[2])
print('encode_finished')
sys.stdout.flush()