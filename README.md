one-by-one-slider
=================

Responsive one-by-one slider supporting touch events. Animations are driven by Animate.css. See demo at http://www.onebyoneslider.com


# Example Usage

* Initialize the slider

```javascript
   $(function() {
                $('#one-by-one-slider').onebyoneslider({
                    slideshow_interval	: 5000,
		    easing: 'easeOutExpo'
                });


             });
```

* Add animated content

```html
 <div id="one-by-one-slider" class="one-by-one-slider">
                    <ul class="one-by-one-slider-large">
                        <li>
                            <img src="images/large/bg1.jpg" alt="image01" />
                            <div class="slider-content">
                                <div class="slider-image0" data-animation="bounceInRight" data-duration=3 data-delay=1><img src="images/large/1.png" alt="image01" /></div>
                                 <div class="slider-heading" style="top: 50%;" data-animation="bounceInUp" data-duration=3 data-delay=1>Responsive layout</div>
                                 <div class="slider-heading" style="top: 60%;" data-animation="bounceInLeft" data-duration=3 data-delay=1>Touch enabled</div>
                                 <div class="slider-heading" style="top: 70%;" data-animation="bounceInRight" data-duration=3 data-delay=1>Multiply animation effects</div>
                            </div>
                        </li>
                        <li>
                         ...
                        </li>
             

                        </ul>
                        <div class="one-by-one-slider-nav">
              <ul class="one-by-one-slider-thumbs">
                        <li class="one-by-one-slider-element"></li>
                        <li><a href="#"></a><img src="images/thumbs/1.png" alt="thumb01" /></li>
                        <li>...</li>
                    </ul></div><!-- one-by-one-slider-nav -->

                     </div><!-- one-by-one-slider -->

```

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/creat0r/one-by-one-slider/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

