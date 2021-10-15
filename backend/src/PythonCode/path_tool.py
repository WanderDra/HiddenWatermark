import os
import re

split = os.sep


# get cwd
def get_cwd():
    return os.getcwd()


# join path
def join_path(*args):
    path = ''
    for v in args:
        path = os.path.join(path, v)
    return path


# get file name by path containing suffix
def get_file_whole_name(path):
    return re.findall(r'[^\\/:*?"<>|\r\n]+$', path)[0]


# get file name by path without suffix
def get_file_name(path):
    whole_name = get_file_whole_name(path)
    if len(re.findall(r'(.+?)\.', whole_name)) == 0:
      return whole_name
    else:
      return re.findall(r'(.+?)\.', whole_name)[0]


# extract path before the last "/"
def get_file_path(path):
    # pattern = ""
    # if split == "\\" or split == "/":
    #     pattern = r"(.+\\).+?\."
    # else:
    #     pattern = "(.+" + split + ").+?\."
    # h = re.findall(r"" + pattern, path)
    # print(h)
    # print(path)
    return path.split('/')[-1].split('\\')[-1]

    # return re.findall(r"" + pattern, path)[0]


# change suffix
def change_suffix(path, suffix):
    name = get_file_name(path)
    new_name = name + "." + suffix
    new_path = get_file_path(path) + new_name
    return new_path, new_name
