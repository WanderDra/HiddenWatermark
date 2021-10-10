import image_deal as id
import sys

print('decode_begin')
id.decode(sys.argv[1], sys.argv[2])
print('decode_finished')
sys.stdout.flush()