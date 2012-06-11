/*
   OKFN-CAROUSEL
   =============
   A custom carousel script for the Open Knowledge Foundation.
   Requires jQuery.
   Loosely based upon the jquery flickr gallery plugin
	   (developed by J.P. Given (http://johnpatrickgiven.com))

   USAGE
   =====
   Just create a couple of elements on your page: An 'okfn-carousel' div for the carousel to 
   live in, and an 'okfn-carousel-data' table full of the data for the carousel to use.
   There is no need to insert Javascript into the page.

   EXAMPLE
   ======
  <div id="okfn-carousel" style="width: 500px; height: 200px;"></div>
  <table id="okfn-carousel-data" style="display: none;">
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

$(function() {
  var spinner_options = {
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

  // Detect the required page elements.
  var data = $('#okfn-carousel-data');
  var carousel = $('#okfn-carousel');
  if (data.length==0 || carousel.length==0) {
    // There is no carousel on this page.
    return;
  }
  // Load carousel data
  var imgs = [];
  $.each(data.find('tr'), function(i,row) {
    // Pull a data object out of each row
    var td = $(row).find('td');
    var obj = {
      url:     $(td[0]).html(),
      offset:  $(td[1]).html(),
      caption: $(td[2]).html()
    };
    imgs.push(obj);
  });
  // Build the DOM
  var captionBox = $('<div class="carousel-caption"/>').appendTo(carousel);
  var linkNext = $('<a href="#" class="carousel-control right"/>').html('›').appendTo(carousel);
  var linkPrev = $('<a href="#" class="carousel-control left" />').html('‹').appendTo(carousel);
  var spinner = null;
  carousel.css({
    'position'   : 'relative',
    'color'      : '#fff',
    'overflow'   : 'hidden'
  });
  captionBox.css({
    'overflow' : 'hidden',
    'padding'  : '10px 15px',
    'opacity'  : 0,
    'height'   : 0
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
    spinner_options.color = '#fff';

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
      if (!spinner) spinner = new Spinner(spinner_options).spin(carousel[0]);
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
    current = (current + offset + imgs.length) % imgs.length;
    setCarousel(imgs[current]);
  }
  linkNext.click(clickNav);
  linkPrev.click(clickNav);

  // Set up initial state
  setCarousel(imgs[current]);
});
