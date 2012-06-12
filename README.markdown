zcarousel
=========
A crossfading carousel jQuery plugin.
Requires spin.js: ``http://fgnass.github.com/spin.js/``
Images are stretched to fit the width of the carousel, and vertically centered in that space. The 'offset' option adds a vertical offset.

Example 1: Javascript
=====================
    $('#carousel-div').zcarousel(
    [
      { caption: 'Here is the first image.',         
        url: 'http://somewhere.com/image1.jpg', 
        offset: '10px' 
      },
      { caption: 'Second image now appearing here.', 
        url: 'http://somewhere.com/image2.jpg', 
        offset: '0'    
      }
    ] );

Example 2: Pure HTML
====================
Create a <div id="zcarousel"> on the page to hold the carousel. Elsewhere, create 
a hidden <table id="zcarousel-data"> containing the data array.

    <div id="zcarousel" style="width: 500px; height: 200px;"></div>
    <table id="zcarousel-data" style="display: none;">
     <tr>
       <td>http://farm7.staticflickr.com/6102/6262968724_9c5b2be4b6_b_d.jpg</td>
       <td>-50px</td>
       <td>Here is my caption for the first image, which was shifted up the page by 50 pixels.</td>
     </tr>
     <tr>
       <td>http://farm8.staticflickr.com/7004/6554801395_476cf878b7_o_d.png</td>
       <td>0</td>
       <td>Here is another interesting caption.</td>
     </tr>
    </table>
