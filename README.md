# World Wide Wishlist

## Description
WWWishlist is a chrome extension that is able to save wishes from any website on the web to the local storage of the chrome browser. Your data stays completely private due to that.

The Extension is currently released unlisted and will go completely public once my friend tested it for 1-2 months.

For a more detailed description see the [Chrome Storepage Soon](https://www.google.com "Soon").

Below you'll find a brief overview on the inner workings, what's planned and if you want to become a contributor, some Docs and License stuff.

## How does it work?
The heart of WWWishlists is the popup (html, controller and view) together with the scraper.

The scraper injects code into the website from where the popup is opened to return the images. I tried grabbing the price but I quickly learned that the price is often not much more than a text field (or multiple).
The images are slightly filtered to remove images that are definately not product images. I have decided against injecting this into every iframe on a page because I ran [into issues on the amazon.de website](https://stackoverflow.com/questions/77901068/difference-in-behavior-when-injecting-javascript-code-into-frames-using-allfra "stackoverflow question"). If you know why that issue exists please make my day and tell me.
Once the user enters all data and saves, the selected image is painted to a canvas shrunk to 200x200 pixels and converted to base64 data since the chrome extension API only allows one big json file for local storage.
Should this process run into a CORS issue the image url is safed instead.

## What is planned?
I am not planning any big feature updates. I am very interested in any website where my extension fails to perform though.
The next thing I'll probably write up is proper unit tests for the functions. I did my test while getting everything to work and am regretting not automizing the pseudo tests I wrote up during that period.
I would really like a better price/currency saving (right now it's just a string), but to be happy with that I'd want to get use out of it, meaning I'd probably like the ability to add all items on the wishlist up to one total (for project wishlists). And for that I'd need to call a currency converter API.
The other big feature I miss is an easy way to share that doesn't involve me running a server.

## Contributors
If you want to work on a new feature please raise a github issue, I'd like to work with you in order to eventually approve your pull request.
If you just want to do bug fixes or update the docs pull requests are super welcome.
If you want to build/fork from this project:
This whole project is released under the GPL 2. I chose the GNU in order to make the code unattractive for commercialization without limiting non-comercial sharing and changing.
If you want to help but don't know with what, look above in the What's planned section.

## Docs

### How to install
In order to setup the project on your machine you need npm 10.5 or later. Once you have the code run
```
npm install
```
in order to install the dependencies **bulma** and **node-sass** specified in the package.json.
If you want to generate a new bulma file from your sass changes simply run
```
npm css-build
```
or if you want this to happen automatically while you are working on the sass run
```
npm start
```
to build the bulma continuously.

In order to add this chrome extension to your chrome store, click the puzzle icon in the top right -> manage extensions -> turn on developer mode -> load unpacked and select the world wide wishlist folder in your directory.

And thusly you have your developer version installed.

### The storage
The chrome storage api is evil because it only allows you to store to a big single .json file. This file is accessible through the dev tools, but more importantly in storageTemplate.json you can see the db structure.

The storage is only to be accessed from models and databaseHandling.

If you need/want to quickly seed or clear your database dbSeed.js is already exporting it's functionality into the dbManager.js

### Understanding the rest
I am currently not convinced people will want to contribute, so for now I'll not explain every single function, but more the structure of what is happening.
If you actually want to do that please let me know and I'll be glad to explain anything you don't understand (and write more thorough docs).

I mostly follow the [MVC pattern](https://www.geeksforgeeks.org/mvc-design-pattern/#advantages-of-the-mvc-design-pattern) in the code. To summarise every page has a controller and a view, while every datapoint has a model.
Each **Model** is responsible for the CRUD (create read update delete) actions belonging to it.
Each **View** only displays data to or retrieves data from the user. The Each **Controller** awaits user actions and calls upon the View and the models to do their respective jobs.
**Versioning** is done in accordance to [Semantic Versioning 2.0.0](https://semver.org/)

For now the program structure is as follows:

#### Background.js
On install or update the background.js calls the dbManager.js to setup the database. Apart from that the background.js makes the context menu entries happen that live in the right-click extension icon menu.

#### dbManager.js
Called from the background.js on install to setup the local storage json in order for the db to work.
If you want to change the functionality of the db structure, migrations on update also would happen here.

#### dbConfig.js
Here all the limits (min and max values) for database values live.

#### uuid7.js
The extension uses uuid v7 which means the id starts with a unix timestamp and continues with a random number. This is important for import data properly (i.e. unique data is actually unique).

#### dbExportImport.js
You guessed it this file rules how to import and export of data. It's the reason this extension uses the download permission. The user access that functionality only from the settings page.

#### wish.js & wishlist.js
These files are classes that handle the CRUD operations on wish and wishlist objects.

#### settingsController.js & settingsView.js
The settingsController.js right now only really serves to call the export import functionality (plus the button links). Currently there are no settings but maybe you could change that!

#### myWishlistController.js & myWishlistView.js
The user interacts with mywishlist.html via these 2 files. Editing, deleting, undo deleting, moving wishes, creating wishlists is all happening here.

#### popupController.js & popupView.js
If the popup is clicked, the controller calls the scraper.js and with the data the scraper retrieved the View then fills the popup so the user can decide which picture to save and what info to add.
Once the user has done that the view gets that data, converts the corresponding picture into base64 and responds back to the controller to save.

#### scraper.js
The scraper injects code into the website from where the popup is opened to return the images. I tried grabbing the price but I quickly learned that the price is often not much more than a text field (or multiple).
The images are slightly filtered to remove images that are definately not product images. I have decided against injecting this into every iframe on a page because I ran [into issues on the amazon.de website](https://stackoverflow.com/questions/77901068/difference-in-behavior-when-injecting-javascript-code-into-frames-using-allfra "stackoverflow question"). If you know why that issue exists please make my day and tell me.

## Acknowledgments
Thanks to Kjeld Schmidt for being a constant mentor and so patient teacher throughout this whole project. Without your guidance I wouldn't even have started coding.

Thanks to Huddel for providing me with an awesome image-not-found crocodile.

Thanks to all my other friends, family and internet strangers to help with testing.

Thanks to Thor for building an awesome community of programmers and for his permission to use his merch store as my tutorial screenshot material.
