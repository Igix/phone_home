/**
 * Created by SyrkovSV on 13.05.14.
 */
$(function()
    {
        $.fn.t.editor = $.fn.editor;
        var opt = {};
        $("div.container").t(opt);
    });

(function($)
    {
        $.fn.t = function(options)
            {
                $.fn.t.options = $.extend({}, $.fn.t.defaults, options);
                $.fn.t.inner_width = window.innerWidth;
                $.fn.t.overview_carousel_create($.fn.t.inner_width);

                $(window).resize($.fn.t.resize_end_detect(function(){
                    $.fn.t.overview_carousel._destroy();
                    $('#overview_carousel').hide();
                    $.fn.t.inner_width = this.innerWidth;
                    $.fn.t.overview_carousel_create($.fn.t.inner_width);
                }, 500));

                $(".product_photo div").lightGallery(
                    {
                        caption:true,
                        desc:true,
                        list:$("#overview_carousel")
                    });

                $("ul.menu_page li a").click(function()
                    {
                        var target = this.hash,
                        $target = $(target);
                        if($target.length > 0)
                            {
                                $("html, body").animate(
                                    {
                                        scrollTop: $target.offset().top + "px"
                                    },{duration: 500});
                                $(this).parents("ul").find("li").removeClass("active");
                                $(this).parent().addClass("active");
                            }
                       return false;
                   });

                $("button.btn_top").click(function()
                    {
                        $("body,html").animate({scrollTop: 0}, 100);
                        return false
                   });
                $("button.btn_bottom").click(function()
                    {
                        var height= $("body").height();
                        $("body,html").animate({scrollTop: height}, 100);
                        return false
                   });

                $('.unit_alike_more').click(function(e)
                    {
                        e.preventDefault();
                    })

                $('.unit_description_more').click(function(e)
                    {
                        e.preventDefault();
                        $("#div_unit_description_small").hide();
                        $("#div_unit_description_more").show();
                    })

                $('.unit_description_small').click(function(e)
                    {
                        e.preventDefault();
                        $("#div_unit_description_small").show();
                        $("#div_unit_description_more").hide();
                    })

                $("a.buy").click(function(e)
                    {
                        e.preventDefault();
                        $.fn.m.unit_name_current = $("div#product_name").find("h1.p-name").text();
                        $.fn.m.unit_id_current = $.fn.t.unit_id_current;
                    });
       	    };
        
        $.fn.t.overview_carousel_create = function(in_w)
            {
                var o='',i= 1,h= 0;
                if(in_w >=320 && in_w <= 480)
                    {
                        o = 'horizontal';
                        i = 4;
                        h=1;
                    }
                else if (in_w >480 && in_w < 992)
                    {
                        o = 'horizontal';
                        i = 4;
                        h=1;
                    }
                else if(in_w >= 992)
                    {
                        o = 'vertical';
                        i = 4;
                        h=0;
                    }
                $.fn.t.current_gallery = 0;
                $.fn.t.preview_gallery = $('.product_photo .u-photo');
                $.fn.t.overview_carousel_el = $( '#overview_carousel' );
                $.fn.t.overview_carousel_items = $.fn.t.overview_carousel_el.children();
                $.fn.t.overview_carousel = $.fn.t.overview_carousel_el.elastislide(
                    {
                        orientation : o,
                        current : $.fn.t.current_gallery,
                        minItems : i,
                        onClick : function( el, pos, evt ) {
        
                            $.fn.t.changeImage( el, pos );
                            evt.preventDefault();
                        },
                        onReady : function() {
        
                            $.fn.t.changeImage( $.fn.t.overview_carousel_items.eq($.fn.t.current_gallery),$.fn.t.current_gallery);
        
                        }
                    });
            }

        $.fn.t.resize_end_detect = function(fn, timeout, invokeAsap, ctx)
            {
	            if(arguments.length == 3 && typeof invokeAsap != 'boolean')
                    {
		                ctx = invokeAsap;
		                invokeAsap = false;
	                }
	            var timer;
	            return function()
                    {
		                var args = arguments;
                        ctx = ctx || this;
		                invokeAsap && !timer && fn.apply(ctx, args);
		                clearTimeout(timer);
		                timer = setTimeout(function()
                            {
			                    !invokeAsap && fn.apply(ctx, args);
			                    timer = null;
		                    }, timeout);
	                };
            }

        $.fn.t.changeImage = function(el, pos)
            {
                var src = el.data('src');
                $.fn.t.preview_gallery.attr('src',src);
                $.fn.t.overview_carousel_items.removeClass('current-img');
                el.addClass('current-img');
                $.fn.t.overview_carousel.setCurrent( pos );

                var title = el.data("title");
                var desc = el.data("desc");
                $.fn.t.preview_gallery.parent().attr("data-src",src);
                $.fn.t.preview_gallery.parent().attr("data-src_hash", $.md5(src));
                $.fn.t.preview_gallery.parent().attr("data-title",title);
                $.fn.t.preview_gallery.parent().attr("data-desc",desc);
            }

        $.fn.t.editor = {};

        $.fn.t.defaults = {};
        $.fn.t.options = {};

        $.fn.t.inner_width = 0;
        $.fn.t.overview_carousel = {};
        $.fn.t.current_gallery = 0;
        $.fn.t.preview_gallery = {};
        $.fn.t.overview_carousel_el = {};
        $.fn.t.overview_carousel_items = {};

        $.fn.t.users_id_current = 0;
        $.fn.t.unit_id_current = 0;

        $.fn.t.url_home = 0;
        $.fn.t.url_login = 0;

        $.fn.t.data = {};
    })($);