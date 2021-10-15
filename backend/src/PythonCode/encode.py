import image_deal as id
import sys

print('encode_begin')
id.encode(sys.argv[1], sys.argv[2], sys.argv[3])
# id.encode(
#   "uploads/anomynous/original/img-1634269305134",
#   "uploads/anomynous/wm/wm-1634269305172",
#   "uploads/anomynous/encoded")
# print('encode_finished')
sys.stdout.flush()
