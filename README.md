# instascript
Script to Download High-Resolution Images from Instagram’s Website

Read about it [on the blog](http://dsgnwrks.pro/plugins-and-scripts/script-to-download-high-resolution-images-from-instagrams-website).

If you just want to get started:
* 1. Go to your Instagram profile url (e.g. https://instagram.com/jtsternberg/)
* 2. Copy the below snippet to your javascript console. (only tested on chrome)

```js
!function(t,e,r){var s=t.createElement(e),n=t.getElementsByTagName(e)[0];
s.async=1,s.src=r,n.parentNode.insertBefore(s,n)}(document,"script"
,"https://cdn.rawgit.com/jtsternberg/instascript/master/instascript.js");
```
