#!/usr/bin/env python
# -*- coding: utf8 -*-

import cv2
import numpy as np
import random
from PythonCode.path_tool import path_tool as pt


# align image config
MAX_FEATURES = 500
GOOD_MATCH_PERCENT = 0.15


# load image
def load_image(path):
    img = cv2.imread(path)
    return img


def load_image_grey(path):
    img = cv2.imread(path, 0)
    return img


# save image
def save_image(img, path):
    cv2.imwrite(path, img, [int(cv2.IMWRITE_PNG_STRATEGY_DEFAULT), 100])


# save image as png
def save_image_with_new_suffix(img, path, suffix="png"):
    new_path, new_name = pt.change_suffix(path, suffix)
    cv2.imwrite(new_path, img)
    return new_name


# complement of original img
def complement(img):
    # return img, img
    # b, g, r = cv2.split(img)
    # ic = [255 - b, 255 - g, 255 - r]
    # ic_merged = cv2.merge([ic[0], ic[1], ic[2]])
    return 255 - img


# 3D to 1D
def three2one(img):
    one = img.flatten()
    return one


# im2double
def im2double(img):
    info = np.iinfo(img.dtype)
    return img.astype(np.float) / info.max


# transform bgr to rgb
def bgr_to_rgb(img):
    b, g, r = cv2.split(img)
    return cv2.merge([r, g, b])


# get real part of image
def real(img):
    return np.real(img)


# get abs
def abs(img):
    return np.abs(img)


# show image
def show_image(img):
    # plt.subplot(111), plt.imshow(bgr_to_rgb(img)), \
    # plt.title('img')
    # plt.xticks([]), plt.yticks([])
    # plt.show()
    cv2.imshow('img', img)
    cv2.waitKey()
    cv2.destroyAllWindows()


# Fourier transform
def fft(img):
    # f = np.fft.fft2(img)
    f = cv2.dft(np.float32(img), flags=cv2.DFT_COMPLEX_OUTPUT)
    return f


# inverse Fourier transform
def ifft(img):
    # iff = np.fft.ifft2(img)
    iff = cv2.idft(img, flags=cv2.DFT_SCALE | cv2.DFT_REAL_OUTPUT)
    return iff


def log(img):
    return np.log(img)


# shift image
def shift(img):
    s = np.fft.fftshift(img)
    return s


def ishift(img):
    s = np.fft.ifftshift(img)
    return s


# shuffle image
def shuffle_image(img, seed=8888):
    img2 = np.zeros(img.shape)
    random.seed(seed)
    m = list(range(img.shape[0]))
    n = list(range(img.shape[1]))
    random.shuffle(m)
    random.shuffle(n)
    for i in range(img.shape[0]):
        for j in range(img.shape[1]):
            img2[i][j] = img[m[i]][n[j]]
    return img2


# shuffle image with reshape
def shuffle_image_with_shape(img, shape, seed=8888):
    img2 = np.zeros(shape)
    for i in range(img.shape[0]):
        for j in range(img.shape[1]):
            img2[i][j] = img[i][j]
    return shuffle_image(img2, seed)


# reverse shuffle
def reverse_shuffle(img, seed=8888):
    random.seed(seed)
    m = list(range(img.shape[0]))
    n = list(range(img.shape[1]))
    random.shuffle(m)
    random.shuffle(n)
    img2 = np.zeros(img.shape)
    for i in range(img.shape[0]):
        for j in range(img.shape[1]):
            # img2[m[i]][n[j]] = np.uint8(img[i][j])
            img2[m[i]][n[j]] = img[i][j]
    return img2


# optimal shape
def optimal_shape(img):
    rows = img.shape[0]
    cols = img.shape[1]
    nrows = cv2.getOptimalDFTSize(rows)
    ncols = cv2.getOptimalDFTSize(cols)
    nimg = np.zeros([nrows, ncols, img.shape[2]])
    nimg[:rows, :cols] = img
    return nimg


def optimal_shape_gray(img):
    rows = img.shape[0]
    cols = img.shape[1]
    nrows = cv2.getOptimalDFTSize(rows)
    ncols = cv2.getOptimalDFTSize(cols)
    nimg = np.zeros([nrows, ncols])
    nimg[:rows, :cols] = img
    return nimg


# resize image
def resize(img, size):
    s_img = cv2.resize(img, size, interpolation=cv2.INTER_CUBIC)
    return s_img


# flip image by x and y
def flip(img):
    f_img = cv2.flip(img, -1)
    return f_img


# fill zero in blank area
def fill_image(img, img_shape):
    img2 = np.zeros(img_shape)
    for i in range(img.shape[0]):
        for j in range(img.shape[1]):
            img2[i][j] = img[i][j]
    return img2


# align image
def alignImages(img1, img2):
    # change images into grayscale
    img1_gray = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    img2_gray = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

    # extract ORB features and get descriptors.
    orb = cv2.ORB_create(MAX_FEATURES)  # using max feature
    feature1, descriptors1 = orb.detectAndCompute(img1_gray, None)
    feature2, descriptors2 = orb.detectAndCompute(img2_gray, None)

    # match features.
    matcher = cv2.DescriptorMatcher_create(cv2.DESCRIPTOR_MATCHER_BRUTEFORCE_HAMMING)
    matches = matcher.match(descriptors1, descriptors2, None)

    # sort matches by score
    matches.sort(key=lambda x: x.distance, reverse=False)

    # remove some bad matches
    bad_matches = int(len(matches) * GOOD_MATCH_PERCENT)
    matches = matches[:bad_matches]

    # connect good matches
    img_matches = cv2.drawMatches(img1, feature1, img2, feature2, matches, None)
    basic_path = pt.join_path(pt.get_cwd(), 'catalog', 'media')
    final_path = pt.join_path(basic_path, "matches.png")
    save_image(img_matches, final_path)
    #cv2.imwrite("matches.png", img_matches)

    # extract location of good matches
    points1 = np.zeros((len(matches), 2), dtype=np.float32)
    points2 = np.zeros((len(matches), 2), dtype=np.float32)

    for i, match in enumerate(matches):
        points1[i, :] = feature1[match.queryIdx].pt
        points2[i, :] = feature2[match.trainIdx].pt

    # find homography
    h, mask = cv2.findHomography(points1, points2, cv2.RANSAC)

    # use homography
    height, width, channels = img2.shape
    img1_reg = cv2.warpPerspective(img1, h, (width, height))

    return img1_reg, h


# split tube of image
def split(img):
    b, g, r = cv2.split(img)
    return [b, g, r]


# merge tube of image
def merge(b, g, r):
    img = cv2.merge([b, g, r])
    return img


# bgr to gray
def bgr_to_gray(img):
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return img


# gray to bgr
def gray_to_bgr(img):
    img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    return img


def magnitude(i, j):
    return cv2.magnitude(i, j)


def save_fft_and_dfft(s_img, path):
    for i, tube in enumerate(s_img):
        ft = fft(tube)
        dft = shift(ft)[:, :, 0]
        ft = ft[:, :, 0]
        save_image(ft, pt.join_path(path, "ft_" + str(i) + ".png"))
        save_image(dft, pt.join_path(path, "dft_" + str(i) + ".png"))
