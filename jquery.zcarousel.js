/*
   [ Requires spin.js: http://fgnass.github.com/spin.js/ ]

   zcarousel
   =========
   A crossfading carousel jQuery plugin.
   Images are stretched to fit the width of the carousel, and vertically
   centered in that space. The 'offset' option adds a vertical offset.

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
   // Create a <div id="zcarousel"> on the page to hold the carousel. Elsewhere, create 
   // a hidden <table id="zcarousel-data"> containing the data array.
   
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
 */

jQuery.fn.zcarousel = function(dataArray) {
  var spinner_settings = {
    lines: 13, // The number of lines to draw
    length: 7, // The length of each line
    width: 4, // The line thickness
    radius: 10, // The radius of the inner circle
    rotate: 0, // The rotation offset
    color: '#000', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
  };

  // Build the DOM
  var carousel = this;
  var captionBox = $('<div/>').appendTo(carousel);
  var linkNext = $('<a href="#"/>').html('›').appendTo(carousel);
  var linkPrev = $('<a href="#"/>').html('‹').appendTo(carousel);
  var spinner = null;
  carousel.css({
    'position'   : 'relative',
    'color'      : '#fff',
    'overflow'   : 'hidden'
  });
  captionBox.css({
    'position'   : 'absolute',
    'left'       : '0',
    'right'      : '0',
    'bottom'     : '0',
    'background' : 'rgba(0,0,0,0.75)',
    'overflow'   : 'hidden',
    'padding'    : '10px 15px',
    'opacity'    : 0,
    'height'     : 0
  });
  linkNext.add(linkPrev).css({
    'position' : 'absolute',
    'top' : '40%',
    'left' : '15px',
    'width' : '40px',
    'height' : '40px',
    'margin-top' : '-20px',
    'font-size' : '60px',
    'font-weight' : '100',
    'line-height' : '30px',
    'color' : '#ffffff',
    'text-align' : 'center',
    'background' : '#222222',
    'border' : '3px solid #ffffff',
    '-webkit-border-radius' : '23px',
    '-moz-border-radius' : '23px',
    'border-radius' : '23px',
    'opacity' : '0.5',
    'filter' : 'alpha(opacity=50)',
    'text-decoration' : 'none'
  }).hover(
      function(e) { $(e.target).css({opacity:1}); },
      function(e) { $(e.target).stop().animate({opacity:0.5}, 200); }
  );
  linkNext.css({
    'left'  : 'auto',
    'right' : '15px'
  });

  // Called when an image has downloaded
  function imgLoaded(e) {
    var img = $(e.target);

    // Set the aspect ratio
    var w = img.width();
    var h = img.height();
    
    // Resize the image to fit in width
    var fRatio = w/h;
    img.css({
      'width'  : carousel.width(),
      'height' : Math.round(carousel.width() * (1/fRatio))
    });
    
    if (spinner) {
      spinner.stop();
      spinner = null;
    }
    spinner_settings.color = '#fff';

    // Vertically center the image
    var vOffset = Math.min(0, (carousel.height() - img.height()) / 2);
    img.css('top',vOffset+'px');

    img.fadeIn('fast', function() {
      $('.carousel-image').hide();
      img.show();
    });
  };

  // Set the carousel state
  function setCarousel(obj) {
    var oldCaption = captionBox.find('div');
    var caption = $('<div/>').html(obj.caption).appendTo(captionBox);
    var targetHeight = caption.height();
    caption.hide();

    // Cross fade the caption
    var fadeSpeed = 100;
    var heightSpeed = 500;
    if (oldCaption.length) {
      oldCaption.stop().fadeOut( 
          fadeSpeed, 
          'linear', 
          function() { 
            oldCaption.remove(); 
            caption.fadeIn( fadeSpeed ) 
          } 
      );
    }
    else {
      caption.fadeIn( fadeSpeed );
    }
    // Animate the box height
    captionBox.stop().animate( 
        { 'opacity': 1, 'height':targetHeight }, 
        heightSpeed 
    );

    // Fade out old items
    if (obj.domElement) {
      obj.domElement.hide();
      obj.domElement.remove().appendTo(carousel);
      obj.domElement.fadeIn('fast', function() {
        $('.carousel-image').hide();
        obj.domElement.show();
      });
      if (spinner) {
        spinner.stop();
        spinner = null;
      }
    }
    else {
      if (!spinner) spinner = new Spinner(spinner_settings).spin(carousel[0]);
      // Add the new image
      var img = $('<img class="carousel-image"/>');
      img.css({
        'position' : 'absolute',
        'z-index'  : -1,
        'left'     : 0,
        'top'      : 0,
        'display'  : 'none'
      });
      img.load(imgLoaded);
      img.attr('src',obj.url).appendTo(carousel);
      obj.domElement = img;
    }
  }

  // Handle state changes
  var current = 0;
  function clickNav(e) {
    e.preventDefault();
    var offset = $(e.target).hasClass('left') ? -1 : 1;
    current = (current + offset + dataArray.length) % dataArray.length;
    setCarousel(dataArray[current]);
  }
  linkNext.click(clickNav);
  linkPrev.click(clickNav);

  // Set up initial state
  setCarousel(dataArray[current]);
};


$(function() {
  // Detect the required page elements.
  var dataTable = $('#zcarousel-data');
  var carouselDiv = $('#zcarousel');
  if (dataTable.length==0 || carouselDiv.length==0) {
    // There is no carousel on this page.
    return;
  }
  // Parse the data table
  var dataArray = [];
  $.each(dataTable.find('tr'), function(i,row) {
    // Pull a JSON object out of each row
    var td = $(row).find('td');
    var obj = {
      url:     $(td[0]).html(),
      offset:  $(td[1]).html(),
      caption: $(td[2]).html()
    };
    dataArray.push(obj);
  });
  carouselDiv.zcarousel(dataArray);
});

