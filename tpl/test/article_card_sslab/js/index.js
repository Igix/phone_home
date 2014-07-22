/**
 * Created by SyrkovSV on 02.07.14.
 */
$(function()
    {
        $.fn.t.editor = $.fn.editor;
        $.fn.t.modal = $.fn.modal;
        var opt = {};
        $("div.container").t(opt);
    });

(function($)
    {
        $.fn.t = function(options)
            {
                $.fn.t.options = $.extend({}, $.fn.t.defaults, options);

                $.fn.t.modal_tags_list = $("#tags_list");

                $(window).scroll(function () {if ($(this).scrollTop() > 0) {$('#scroller').fadeIn();} else {$('#scroller').fadeOut();}});
                $('#scroller').click(function () {$('body,html').animate({scrollTop: 0}, 400); return false;});
                $("[rel=tooltip]").tooltip();

                var k_categories_id_str = $.fn.t.parseGetParams()["k_categories_id"];
                $.fn.t.k_categories_id_arr_current = (k_categories_id_str != undefined)?k_categories_id_str.split(","):[];
                var title = "";
                $.each($.fn.t.k_categories_id_arr_current,function(k,d)
                    {
                        var a = $("div.text_search_menu").find("a[data-k_categories_id='"+d+"']");
                        $("h1.center").text(a.text());
                        window.document.title = a.text();
                        //a.addClass('tags_list_disabled');
                    });

                var container_collage_plus = $("article:eq(0) p");
                //$.fn.t.prepare_hentry_pic_montage($("article:eq(0)"));
                $.fn.t.prepare_hentry_pic_collage(container_collage_plus);

                //подготовим скрытый блок картинок статьи для галереи
                var content_box = $("div.content_box");
                content_box.append('<ul id="overview_carousel" style="display: none;"></ul>');
                var overview_carousel = content_box.find("ul#overview_carousel");

                $("article:eq(0) p img").css("cursor","pointer");
                $.each($("article:eq(0) p img"),function(i,img)
                    {
                        var src = $(img).attr("src");
                        $(img).attr("data-src",src);
                        if(i == 0)
                            {
                                overview_carousel.append('<li data-title="" data-desc="" data-src="'+src+'" class="current-img"><img data-src="'+src+'" class="img-thumbnail" src="'+src+'"></li>');
                            }
                        else
                            {
                                overview_carousel.append('<li data-title="" data-desc="" data-src="'+src+'"><img class="img-thumbnail" src="'+src+'"></li>');
                            }

                    });

                $("article:eq(0) img").lightGallery(
                    {
                        caption:true,
                        desc:true,
                        list:$("#overview_carousel")
                    });

                $("a.favorite").click(function(e)
                    {
                        e.preventDefault();
                        $.fn.t.add_to_favorite(this);
                    });

                $("a.like").click(function(e)
                    {
                        e.preventDefault();
                        $(this).find("span").removeClass("like");
                        $(this).parent().find("a.dislike").find("span.dislike").removeClass("dislike");
                        var d = $.fn.t.prepare_like_dislike(1);
                        if(d.length != 0)
                            {
                                $(this).parent().attr("data-like_sum",d["like_sum"]);
                                $(this).parent().attr("data-like",d["like"]);
                                $(this).find("span").addClass("like");
                            }
                    });

                $("a.dislike").click(function(e)
                    {
                        e.preventDefault();
                        $(this).find("span").removeClass("dislike");
                        $(this).parent().find("a.like").find("span.like").removeClass("like");
                        var d = $.fn.t.prepare_like_dislike(-1);
                        if(d.length != 0)
                            {
                                $(this).parent().attr("data-like_sum",d["like_sum"]);
                                $(this).parent().attr("data-like",d["like"]);
                                $(this).find("span").addClass("dislike");
                            }
                    });

                /*$("a.tags_list").click(function(e)
                    {
                        e.preventDefault();
                        var k_categories_id = $(this).data("k_categories_id");
                        if($("div.box_filters").find("span.cons[data-k_categories_id='"+k_categories_id+"']").length == 0)
                            {
                                $(this).addClass('tags_list_disabled');
                                $.fn.t.prepare_box_filters(k_categories_id,$(this).text());
                                $.fn.t.prepare_hentry_filters();
                                $.fn.t.prepare_hentry_pic_filters(k_categories_id);
                            }
                    });*/

                /*$("div.box_filters span.clear_all a").click(function(e)
                    {
                        e.preventDefault();
                        $("div.box_filters").find("span.cons").remove();
                        var hentry = $("div.hentry");
                        $.each(hentry,function(k,d)
                            {
                                if($(this).css("display") == "none")
                                    {
                                        $(this).show();
                                    }
                            });
                        $("div.hentry_pic").remove();
                        $.fn.t.k_categories_id_arr_current = [];
                        $("span.clear_all").hide();
                        $('a.tags_list').removeClass('tags_list_disabled');
                    });*/

                $("button#btn_subscribe_save").click(function(e)
                    {
                        e.preventDefault();
                        var email = $.trim($("input#subscribe_email").val());
                        if(!$.fn.m.is_email(email))
                            {
                                $.fn.m.modal_confirm.find(".modal_confirm_header").text("Ошибка");
                                $.fn.m.modal_confirm.find(".modal_confirm_block").text("Не корректный адрес электронной почты");
                                $.fn.m.modal_confirm.modal('show');
                                setTimeout(function()
                                    {
                                        $.fn.m.modal_confirm.modal('hide');
                                    }, 2000);
                                return false;
                            }

                        var j_p = {};
                        j_p["fn"] = "ss";
                        if($("button#btn_subscribe_save").hasClass('subscribe'))
                            {
                                j_p["param"] = 1;
                            }
                        else if($("button#btn_subscribe_save").hasClass('unsubscribe'))
                            {
                                j_p["param"] = 0;
                            }
                        j_p["email"] = email;

                        $.fn.t.data = function(){$.fn.t.editor.set_subscribe(j_p); return $.fn.t.editor.data;}();
                        if($.fn.t.data.error != undefined)
                            {
                                $.fn.m.modal_confirm.find(".modal_confirm_header").text("Ошибка");
                                if($("button#btn_subscribe_save").hasClass('subscribe'))
                                    {
                                        $.fn.m.modal_confirm.find(".modal_confirm_block").text("Ошибка при подписке на рассылку с данного сайта");
                                    }
                                else if($("button#btn_subscribe_save").hasClass('unsubscribe'))
                                    {
                                        $.fn.m.modal_confirm.find(".modal_confirm_block").text("Ошибка при отписывании от рассылки с данного сайта");
                                    }
                                $.fn.m.modal_confirm.modal('show');
                                setTimeout(function()
                                    {
                                        $.fn.m.modal_confirm.modal('hide');
                                    }, 2000);
                                return false;
                            }
                        var id = $.fn.t.data.id;
                        var msg = ($.fn.t.data.msg == undefined)?"":$.fn.t.data.msg;
                        var success = $.fn.t.data.success;
                        if(success == 0)
                            {
                                $.fn.m.modal_confirm.find(".modal_confirm_header").text("Ошибка");
                                $.fn.m.modal_confirm.find(".modal_confirm_block").text(msg);
                                $.fn.m.modal_confirm.modal('show');
                                setTimeout(function()
                                    {
                                        $.fn.m.modal_confirm.modal('hide');
                                    }, 2000);
                                return false;
                            }
                        else if(success == 1)
                            {
                                $.fn.m.modal_confirm.find(".modal_confirm_header").text("Уведомление");
                                if($("button#btn_subscribe_save").hasClass('subscribe'))
                                    {
                                        $.fn.m.modal_confirm.find(".modal_confirm_block").text("Вы успешно подписались на рассылку.");
                                    }
                                else if($("button#btn_subscribe_save").hasClass('unsubscribe'))
                                    {
                                        $.fn.m.modal_confirm.find(".modal_confirm_block").text("Вы успешно отписались от рассылки.");
                                    }

                                $.fn.m.modal_confirm.modal('show');
                                setTimeout(function()
                                    {
                                        if($("button#btn_subscribe_save").hasClass('subscribe'))
                                            {
                                                $("button#btn_subscribe_save").addClass("unsubscribe").removeClass("subscribe").text("Отписаться");
                                            }
                                        else if($("button#btn_subscribe_save").hasClass('unsubscribe'))
                                            {
                                                $("button.unsubscribe").addClass("subscribe").removeClass("unsubscribe").text("Подписаться");
                                                $("input#subscribe_email").val('');
                                            }
                                        $.fn.m.modal_confirm.modal('hide');
                                    }, 2000);
                            }
                    });

                /*$.fn.t.modal_tags_list.on('shown', function()
                    {
                        $('body').modalmanager('loading');
                        $('body').modalmanager('removeLoading');

                        $(this).find("button#btn_tags_list_select").unbind("click").bind("click",function(e)
                            {
                                e.preventDefault();
                                var tags_list = $(this).parents("#tags_list").find(".tags_list_select");
                                var tags_list_arr = [];
                                $.each(tags_list,function(i,d)
                                    {
                                        var checked = this.checked;
                                        if(checked)
                                            {
                                                tags_list_arr.push(parseInt($(this).data("k_categories_id")));
                                            }
                                    });

                                $.each(tags_list_arr,function(i,k_categories_id)
                                    {
                                        if($("div.box_filters").find("span.cons[data-k_categories_id='"+k_categories_id+"']").length == 0)
                                            {
                                                var txt = $("input.tags_list_select[data-k_categories_id='"+k_categories_id+"']");
                                                $('a.tags_list[data-k_categories_id="'+k_categories_id+'"]').addClass('tags_list_disabled');
                                                $.fn.t.prepare_box_filters(k_categories_id,txt.val());
                                                $.fn.t.prepare_hentry_filters();
                                                $.fn.t.prepare_hentry_pic_filters(k_categories_id);
                                            }
                                    });
                                $.fn.t.modal_tags_list.modal('hide');
                            });
                    });*/
            }

        $.fn.t.check_loadimages = function ($images,callback)
            {
                //Keep track of the images that are loaded
                var imagesLoaded = 0;
                function _loadAllImages(callback)
                    {
                        //Create an temp image and load the url
                        var img = new Image();
                        $(img).attr('src', $images.eq(imagesLoaded).attr("src"));
                        if (img.complete || img.readyState === 4)
                            {
                                // image is cached
                                imagesLoaded++;
                                //Check if all images are loaded
                                if(imagesLoaded == $images.length) {
                                    //If all images loaded do the callback
                                    callback();
                                } else {
                                    //If not all images are loaded call own function again
                                    _loadAllImages(callback);
                                }
                            }
                        else
                            {
                                $(img).load(function()
                                    {
                                        //Increment the images loaded variable
                                        imagesLoaded++;
                                        //Check if all images are loaded
                                        if(imagesLoaded == $images.length) {
                                            //If all images loaded do the callback
                                            callback();
                                        } else {
                                            //If not all images are loaded call own function again
                                            _loadAllImages(callback);
                                        }
                                    });
                            }
                    };
                _loadAllImages(callback);
            }

        $.fn.t.prepare_like_dislike = function(in_param)
            {
                var json_param = {};
                json_param['fn'] = 'sld';
                json_param['article_id'] = $.fn.t.article_id_current;
                json_param['like'] = in_param;

                var res = [];
                $.ajax(
                    {
                        type: "POST",
                        url: $.fn.editor.url_ajax_set_f,
                        data: json_param,
                        dataType: 'json',
                        async: false,
                        error: function(xhr)
                            {
                                $.fn.m.modal_confirm.find(".modal_confirm_header").text("Ошибка");
                                $.fn.m.modal_confirm.find(".modal_confirm_block").text("Ошибка оценки статьи");
                                $.fn.m.modal_confirm.modal('show');
                                setTimeout(function()
                                    {
                                        $.fn.m.modal_confirm.modal('hide');
                                    }, 2000);
                                return false;
                            },
                        success: function(data)
                            {
                                if(data["success"] == 0)
                                    {
                                        $.fn.m.modal_confirm.find(".modal_confirm_header").text("Ошибка");
                                        $.fn.m.modal_confirm.find(".modal_confirm_block").text("Вы уже оценили статью ранее");
                                        $.fn.m.modal_confirm.modal('show');
                                        setTimeout(function()
                                            {
                                                $.fn.m.modal_confirm.modal('hide');
                                            }, 2000);
                                    }
                                else if(data["success"] == 1)
                                    {
                                        res = data;
                                        $.fn.m.modal_confirm.find(".modal_confirm_header").text("Уведомление");
                                        $.fn.m.modal_confirm.find(".modal_confirm_block").text("Вы успешно оценили статью.");
                                        $.fn.m.modal_confirm.modal('show');
                                        setTimeout(function()
                                            {
                                                $.fn.m.modal_confirm.modal('hide');
                                            }, 2000);
                                    }
                            }
                    });
                return res;
            }

        $.fn.t.prepare_hentry_pic_montage = function (in_container)
            {
				var $container 	= in_container,
					$imgs		= $container.find('img').hide(),
					totalImgs	= $imgs.length,
					cnt			= 0;

				$imgs.each(function(i) {
					var $img	= $(this);
					$('<img/>').load(function() {
						++cnt;
						if( cnt === totalImgs ) {
							$imgs.show();
							$container.montage({
								fillLastRow				: true,
								alternateHeight			: true,
								alternateHeightRange	: {
									min	: 90,
									max	: 240
								}
							});
							$('#overlay').fadeIn(300);
						}
					}).attr('src',$img.attr('src'));
				});
            }

        $.fn.t.prepare_hentry_pic_collage = function (in_container)
            {
                $(in_container).removeWhitespace().collagePlus(
                    {
                        'fadeSpeed'     : 2000,
                        'targetHeight'  : 70
                    }
                );
                //$(in_container).collageCaption();
            }

        $.fn.t.intersect = function (arr1, arr2) {
            var arr3 = [];
            for(i = 0; i < arr1.length; i++) {
                for(j = 0; j < arr2.length; j++) {
                    if (arr1[i] == arr2[j]) {
                        var is_duplicate = false;
                        for (k = 0; k < arr3.length; k++) {
                            if (arr1[i] == arr3[k]) {
                                is_duplicate = true;
                            }
                        }
                        if (is_duplicate == false) {
                            arr3.push(arr1[i]);
                        }
                    }
                }
            }
            return arr3;
        }

        $.fn.t.add_to_favorite = function(a)
            {
                var bookmark_url = a.href;
                var bookmark_title = a.title;

                try {
                    // Internet Explorer
                    window.external.AddFavorite( bookmark_url, bookmark_title );
                }
                catch (e) {
                    try {
                        // Mozilla
                        window.sidebar.addPanel( bookmark_title, bookmark_url, "" );
                    }
                    catch (e) {
                        // Opera
                        if( typeof( opera ) == "object" ) {
                            a.rel = "sidebar";
                            a.bookmark_title = bookmark_title;
                            a.bookmark_url = bookmark_url;
                            return true;
                        }
                        else {
                            // Unknown
                            alert( 'Press Ctrl-D to add page to your bookmarks' );
                        }
                    }
                }
                return false;
            }

        $.fn.t.parseGetParams = function()
            {
                var $_GET = {};
                var __GET = window.location.search.substring(1).split("&");
                for(var i=0; i<__GET.length; i++)
                    {
                        var getVar = __GET[i].split("=");
                        $_GET[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : getVar[1];
                    }
                return $_GET;
            }

        $.fn.t.parseGetHash = function()
            {
                var $_GET = {};
                var __GET = window.location.hash.substring(1).split("&");
                for(var i=0; i<__GET.length; i++)
                    {
                        var getVar = __GET[i].split("=");
                        $_GET[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : getVar[1];
                    }
                return $_GET;
            }

        $.fn.t.editor = {};
        $.fn.t.modal = {};

        $.fn.t.defaults = {};
        $.fn.t.options = {};

        $.fn.t.users_id_current = 0;
        $.fn.t.article_id_current = 0;

        $.fn.t.url_home = 0;
        $.fn.t.url_login = 0;
        $.fn.t.url_item = 0;
        $.fn.t.url_lib = 0;
        $.fn.t.url_unit_list = 0;
        $.fn.t.url_article_list = 0;

        $.fn.t.k_categories_id_arr_current = [];

        $.fn.t.modal_tags_list = {};

        $.fn.t.data = {};
    })($);