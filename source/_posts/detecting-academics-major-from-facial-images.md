---
title: Detecting academics' major from facial images
date: 2019-01-02 11:02:21
tags:
---

# The Idea
A few months ago I read a paper with the title ["Deep Neural Networks Are More Accurate Than Humans at Detecting Sexual Orientation From Facial Images"](https://www.gsb.stanford.edu/faculty-research/publications/deep-neural-networks-are-more-accurate-humans-detecting-sexual), which caused a lot of [controversy](https://news.ycombinator.com/item?id=15198997). While I don't want to comment on the methodology and quality of the paper (that was already done, e.g. in [an article by Jeremy Howard](https://www.fast.ai/2017/09/13/kosinski/)), I found it very interesting and inspiring. In a nutshell, the researchers collected face pictures from dating websites and built a machine learning model to classify people's sexual orientation and reached quite an impressive accuracy with their approach.

[This guest post](https://scatter.wordpress.com/2017/09/10/guest-post-artificial-intelligence-discovers-gayface-sigh/) summarizes the results as: 

> AI Can’t Tell if You’re Gay… But it Can Tell if You’re a Walking Stereotype.

 And indeed, we often see people who look very stereotypical. I tried to think of more such scenarios and came to the conclusion that another environment, where this phenomenon can be found quite often, is a university campus. So often you walk around the campus and see students, who just look like a law student, a computer science nerd, a sportsman, etc. Sometimes I'm so curious that I almost want to ask them whether my assumption is correct.
 
 After having read the above paper, I wondered if some machine learning model might be able to quantify these latent assumptions and find out a stereotypical-looking student's profession or major. 

Although I only have a little more than basic knowledge in machine learning, especially in image classification using deep neural nets, I took it as a personal challenge to **build a classifier, that detects academics' major based on an image of their face**. 

# Disclaimer
Please don't take this article too serious. I'm not a machine learning expert or a professional scientist. There might be some mistakes in my methodology or implementation. However, I'd love to hear your thoughts and feedback.

# Approach
My first (and final) approach was to **(1.) collect face pictures of students** or other academics, **(2.) label them** with a small, limited set of classes, corresponding to their major, and eventually **(3.) fit a convolutional neural net (CNN)** as a classifier. I thought of fields of study, whose students might potentially look a bit stereotypical and came up with four classes: **(1) computer science**, **(2) economics**, **(3)** (German) **linguistics** and **(4) mechanical engineering**. Please note that this is not meant to be offending by any means! (I'm a computer science nerd myself 😉).

# Getting the data
The very first prerequisite is training data - as usual, when doing machine learning. And since I aimed at training a convolutional neural net (CNN), there should be a lot of data, preferably.

While it would have been a funny approach to walk around my campus and ask students for their major and a picture of their face, I would probably not have ended up with a lot of data. Instead, I decided to **crawl pictures from university websites**. Almost every department at every university has a page called "[Staff](http://dbis.ipd.kit.edu/english/722.php)", "People", "Researchers" or the like on their websites. While these are not particularly lists of students, but of professors, research assistants and PhD candidates, I presumed that those pictures should still be sufficient as training data. 

I wrote a bunch of **crawler scripts** using Python and [Selenium WebDriver](https://www.seleniumhq.org/) to crawl **57** different websites, including the websites of various departments of the following universities:

* Karlsruhe Institute of Technology
* TU Munich
* University of Munich
* University of Würzburg
* University of Siegen
* University of Bayreuth
* University of Feiburg
* University of Heidelberg
* University of Erlangen
* University of Bamberg
* University of Mannheim

After a bit of manual data cleaning (removing pictures without faces, rotating pictures, ...), I ended up with a total of **1369** labeled images from four different classes. While this is not very much data for training a CNN, I decided to give it a try anyway.

## Examples
### Images

**An excerpt from the folder containing all raw images after crawling:**
![Excerpt from all crawled raw images](images/academic_faces1.png)
(If you are in one of these pictures and want to get removed, please contact me.)

### Labels
**An excerpt from `index.csv` containing labels and meta-data for every image:**
```csv
id,category,image_url,name
c35464fd,mechanical,http://www.fast.kit.edu/lff/1011_1105.php,Prof. Dr. rer. nat. Frank Gauterin
a73d11a7,cs,http://h2t.anthropomatik.kit.edu/21_1784.php,Kevin Liang
97e230ff,econ,http://marketing.iism.kit.edu/21_371.php,Dr. Hanna Schumacher
cde71a5c,german,https://www.germanistik.uni-muenchen.de/personal/ndl/mitarbeiter/bach/index.html,Dr. Oliver Bach
```

# Preprocessing the data
Before the images could be used as training data for a learning algorithm, a bit of preprocessing needed to be applied. Mainly, I did two major steps of preprocessing.

1. **Cropping** images to faces - As you can see, pictures are taken from different angles, some of them contain a lot of background, some are not centered, etc. To get better training data, the pictures have to be cropped to only the face and nothing else. 
2. **Scaling** - All pictures come in different resolutions, but eventually need to be of exactly the same size in order to be used as input to a neural network. 

To achieve both of these preprocessing steps I used a great, little, open-source, OpenCV-based Python tool called [autocrop](https://github.com/leblancfg/autocrop) with the following command:

`autocrop -i raw -o preprocessed -w 128 -H 128 > autocrop.log`.

This detects the face in every picture in `raw` folder, crops the picture to that face, re-scales the resulting image to 128 x 128 pixels and saves it to `preprocessed` folder. Of course, there are some pictures in which the algorithm can not detect a face. Those are logged to stdout and persisted to `autocrop.log`.

In addition, I wrote a script that parses `autocrop.log` to get the failed images and subsequently split the images into _train_ (70 %), _test_ (20 %) and _validation_ (10 %) and copy them to a folder structure that is compatible to the format required by [Keras ImageDataGenerator](https://keras.io/preprocessing/image/) to read training data.

```
- raw
    - index.csv
    - c35464fd.jpg
    - a73d11a7.jpg
    - ...
- preprocessed 
    - train
        - cs
            - a73d11a7.jpg
            - ...
        - econ
            - 97e230ff.jpg
            - ...
        - german
            - cde71a5c.jpg
            - ...
        - mechanical
            - c35464fd.jpg
            - ...
    - test
        - cs
            - ...
        - ...
    - validation
        - cs
            - ...
        - ...
```

# Building a model
## Approach 1: Simple, custom CNN

**Code**
* [custom_model.ipynb](html/custom_model.html)


I decided to start simple and see if anything can be learned from the data at all. I defined the following simple CNN architecture in Keras: 

```
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
conv2d_1 (Conv2D)            (None, 62, 62, 32)        320       
_________________________________________________________________
max_pooling2d_1 (MaxPooling2 (None, 31, 31, 32)        0         
_________________________________________________________________
conv2d_2 (Conv2D)            (None, 29, 29, 32)        9248      
_________________________________________________________________
max_pooling2d_2 (MaxPooling2 (None, 14, 14, 32)        0         
_________________________________________________________________
conv2d_3 (Conv2D)            (None, 12, 12, 32)        9248      
_________________________________________________________________
max_pooling2d_3 (MaxPooling2 (None, 6, 6, 32)          0         
_________________________________________________________________
flatten_1 (Flatten)          (None, 1152)              0         
_________________________________________________________________
dense_1 (Dense)              (None, 64)                73792     
_________________________________________________________________
dropout_1 (Dropout)          (None, 64)                0         
_________________________________________________________________
dense_2 (Dense)              (None, 4)                 260       
=================================================================
Total params: 92,868
Trainable params: 92,868
Non-trainable params: 0
```

I used Keras' [ImageDataGenerator](https://keras.io/preprocessing/image/) (great tool!) to read images into NumPy arrays, re-scale them to a shape of `(64, 63, 3)` (64 x 64 pixels, RGB) and perform some data augmentation using transformations like rotations, zooming, horizontal flipping, etc. to blow up my training data and hopefully build more robust, less overfitted models.

I let the model train for **100 epochs**, using the **Adam optimizer** with default parameters and **categorical crossentropy loss**, a mini-batch size of **32** and **3x augmentation** (use transformations to blow up training data by a factor of three). 

### Results (57.1 % accuracy)
The maximum **validation accuracy of 0.66** was reached after 74 epochs. **Test accuracy** turned out to be **0.571**. Considering that a quite simple model was trained completely from scratch with less than 1000 training examples, I am quite impressed by that result. It means that on average the model predicts more than every second student's major correctly. The **a-priori probability** of a correct classification **is 0.25**, so the model has definitely learned at least something.

## Approach 2: Fine-tuning VGGFace

**Code**
* [vggfaces_bottleneck_model.ipynb](html/vggfaces_bottleneck_model.html)
* [vggfaces_finetuned_model.ipynb](html/vggfaces_finetuned_model.html)


As an alternative to a simple, custom-defined CNN model, that is trained from scratch, I wanted to follow the common approach of fine-tuning the weights of an existing, pre-trained model. The basic idea of such an approach is to not "re-invent the wheel", but take advantage of what was already learned before and only slightly adapt that "knowledge" (in form of weights) to a certain problem. Latent features in images, which a learning algorithm had already extracted from a giant set of training data before, can just be leveraged. ["Image Classification using pre-trained models in Keras"](https://www.learnopencv.com/keras-tutorial-using-pre-trained-imagenet-models/) gives an excellent overview of how **fine-tuning** works and how it is different from **transfer learning** and custom models. Expectations are that my given classification problem can be solved more accurately with less data. 

 I decided to take a **VGG16** model architecture trained on [**VGGFace**](http://www.robots.ox.ac.uk/~vgg/data/vgg_face2/) as a base (using the [keras-vggface](https://github.com/rcmalli/keras-vggface) implementation) and followed [this guide](https://blog.keras.io/building-powerful-image-classification-models-using-very-little-data.html) to fine-tune it. VGGFace is a dataset published by the University of Oxford that contains more than 3.3 million face images. Accordingly, I expected it to have extracted very robust facial features and to be quite well-suited for face classification. 

### Step 1: Transfer-learning to initialize weights
My implementation consists of two steps, since [it is recommended](https://blog.keras.io/building-powerful-image-classification-models-using-very-little-data.html) that

> in order to perform fine-tuning, all layers should start with properly trained weights.

In this first step, transfer-learning is used to find proper weights for a set of a few newly added, custom, fully-connected classification layers. These are used as the initial weights in step 2 later on. To perform this initialization, a pre-trained VGGFace model, with the final classification layers cut off, is used to extract 128 _bottleneck features_ for every image. Subsequently, another tiny model, consisting of fully-connected layers, is trained on these features to perform the eventual classification. The weights are persisted to a file and loaded again in step 2.

The model architecture looks like this:

```
________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
dense_1 (Dense)              (None, 128)               65664     
_________________________________________________________________
dropout_1 (Dropout)          (None, 128)               0         
_________________________________________________________________
dense_2 (Dense)              (None, 4)                 516       
=================================================================
Total params: 66,180
Trainable params: 66,180
Non-trainable params: 0
```

### Step 2: Fine-tuning 
In this second step, a pre-trained VGGFace model (with the first n - 3 layers freezed) is used in combination with the pre-trained top layers from step 1 to fine-tune weights for our specific classification task. It takes mini-batches of (128, 128, 3)-shaped tensors (128 x 128 pixels, RGB) as input and predicts probabilities for each of our four target classes.

The architecture of the combined model looks like this:
```
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
vggface_vgg16 (Model)        (None, 512)               14714688  
_________________________________________________________________
top (Sequential)             (None, 4)                 66180     
=================================================================
Total params: 14,780,868
Trainable params: 2,425,988
Non-trainable params: 12,354,880
```

`top` is the model described in step 1, `vggface_vgg16` is a VGG16 model and looks like this:
```
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
input_3 (InputLayer)         (None, 128, 128, 3)       0         
_________________________________________________________________
conv1_1 (Conv2D)             (None, 128, 128, 64)      1792      
_________________________________________________________________
conv1_2 (Conv2D)             (None, 128, 128, 64)      36928     
_________________________________________________________________
pool1 (MaxPooling2D)         (None, 64, 64, 64)        0         
_________________________________________________________________
conv2_1 (Conv2D)             (None, 64, 64, 128)       73856     
_________________________________________________________________
conv2_2 (Conv2D)             (None, 64, 64, 128)       147584    
_________________________________________________________________
pool2 (MaxPooling2D)         (None, 32, 32, 128)       0         
_________________________________________________________________
conv3_1 (Conv2D)             (None, 32, 32, 256)       295168    
_________________________________________________________________
conv3_2 (Conv2D)             (None, 32, 32, 256)       590080    
_________________________________________________________________
conv3_3 (Conv2D)             (None, 32, 32, 256)       590080    
_________________________________________________________________
pool3 (MaxPooling2D)         (None, 16, 16, 256)       0         
_________________________________________________________________
conv4_1 (Conv2D)             (None, 16, 16, 512)       1180160   
_________________________________________________________________
conv4_2 (Conv2D)             (None, 16, 16, 512)       2359808   
_________________________________________________________________
conv4_3 (Conv2D)             (None, 16, 16, 512)       2359808   
_________________________________________________________________
pool4 (MaxPooling2D)         (None, 8, 8, 512)         0         
_________________________________________________________________
conv5_1 (Conv2D)             (None, 8, 8, 512)         2359808   
_________________________________________________________________
conv5_2 (Conv2D)             (None, 8, 8, 512)         2359808   
_________________________________________________________________
conv5_3 (Conv2D)             (None, 8, 8, 512)         2359808   
_________________________________________________________________
pool5 (MaxPooling2D)         (None, 4, 4, 512)         0         
_________________________________________________________________
global_max_pooling2d_3 (Glob (None, 512)               0         
=================================================================
Total params: 14,714,688
Trainable params: 2,359,808
Non-trainable params: 12,354,880
```


I was using Keras _ImageDataGenerator_ again for loading the data, augmenting (3x) and resizing it. As [recommended](https://blog.keras.io/building-powerful-image-classification-models-using-very-little-data.html), _stochastic gradient descent_ is used with a small learning rate (10^-4) to carefully adapt weights. The model was trained for **100 epochs** on **batches of 32 images** and, again, used **categorical cross entropy** as a loss function. 

### Results (54.6 % accuracy)
The maximum **validation accuracy of 0.64** was reached after 38 epochs already. **Test accuracy** turned out to be **0.546**, which is a quite disappointing result, considering that even our simple, custom CNN-model achieved a higher accuracy. Maybe the model's complexity is too high for the small amount of training data?

# Inspecting the model
To get better insights on how the model performs, I briefly inspected it with regards to several criteria. This is a short summary of my finding. 

## Code
* [inspection.ipynb](html/inspection.html) 

## Class distribution
The first thing I looked at was the class distribution. How are the four study major subjects represented in our data and what does the model predict?

cs | econ | german | mechanical
- | - | - | -
0.2510 | 0.2808 | 0.2127 | 0.2553
0.2595 | 0.2936 | 0.1361 | 0.3106

Apparently, the model neglects the class of _german linguists_ a bit. That is also the class for which we have the least training data. Probably I should collect more.

## Examples of false classifications
I wanted to get an idea of what the model does wrong and what it does right. Consequently, I took a look at the top (with respect to confidence) five **(1) false negatives**, **(2) false positives** and **(3) true positives**. 

Here is an excerpt for class _econ_:

![](images/academic_faces2.png)

The top row shows examples of economists, who the model didn't recognize as such.
The center row depicts examples of what the model "thinks" economists look like, but who are actually students / researchers with a different major.
Finally, the bottom row shows examples of good matches, i.e. people for whom the model had a very high confidence for their actual class.

Again, if you are in one of these pictures and want to get removed, please contact me.

## Confusion matrix
To see which profession the model is unsure about, I calculated the confusion matrix.

```
array([[12.76595745,  5.95744681,  0.        ,  6.38297872],
       [ 3.40425532, 12.76595745,  3.82978723,  8.08510638],
       [ 3.82978723,  5.53191489,  8.5106383 ,  3.40425532],
       [ 5.95744681,  5.10638298,  1.27659574, 13.19148936]])
```

![](images/academic_faces3.png)
**Legend:**
* 0 = cs, 1 = econ, 2 = german, 3 = mechanical
* Brighter colors ~ higher value

What we can read from the confusion matrix is that, for instance, the model tends to classify economists as mechanical engineers quite often. 

# Conclusion
First of all, this is not a scientific study, but rather a small hobby project of mine. Also, it does not have a lot of real-world importance, since one might rarely want to classify students into four categories.

Although the results are not spectacular, I am still quite happy about them and at least my model was able to do a lot better than random guessing. Given an **accuracy of 57 %** with four classes, you could definitely say that it is, to some extent, possible to learn a stereotypical-looking person's study major from only in image of their face. Of course, this only holds true within a bounded context and under a set of restrictions, but it is still an interesting insight to me. 

Moreover, I am quite sure that there is still a lot of room for improvements to the model, which could yield a better performance. Those might include:
* More training data from a wider range of sources
* More thorough preprocessing (e.g. filter out images of secretaries)
* Different model architecture
* Hyper-parameter tuning
* Manual feature engineering
* ...

Please let me know what you think of this project. I would love to get some feedback!