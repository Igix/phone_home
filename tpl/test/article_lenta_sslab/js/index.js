/**
 * Created by SyrkovSV on 26.06.14.
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
                $.fn.editor.url_ajax_set_f = $.fn.editor.url_ajax_set_f.replace(/&amp;/g, '&');

                $.fn.t.modal_tags_list = $("#tags_list");

                $(window).scroll(function () {if ($(this).scrollTop() > 0) {$('#scroller').fadeIn();} else {$('#scroller').fadeOut();}});
                $('#scroller').click(function () {$('body,html').animate({scrollTop: 0}, 400); return false;});
                $("[rel=tooltip]").tooltip();

                $("div.hentry").not(".hentry_pic").find(".entry-content").find("img").hide();

                var kc_name_str = $.fn.t.parseGetParams()["kc_name"];
                $.fn.t.kc_name_arr_current = (kc_name_str != undefined)?kc_name_str.split(","):[];
                var title = "";
                $.each($.fn.t.kc_name_arr_current,function(k,d)
                    {
                        var a = $("div.text_search_menu").find("a:contains('"+decodeURI(d)+"')");
                        $("h1.center").text(decodeURI(d));
                        window.document.title = decodeURI(d);
                        //a.addClass('tags_list_disabled');
                    });

                //оставим только одну строку с картинками
                var am_container = $("div.hentry_pic").find("div.am-container")
                $.each(am_container, function(k,d)
                    {
                        var imgs = $(this).find("img");
                        $.fn.t.check_loadimages(imgs,function()
                        {
                            var parent_width = parseInt($("div.hentry_pic").parent().width());
                            var current_width = 0;
                            $.each(imgs,function(i,img)
                                {
                                    var q = $(img).parent();
                                    current_width = current_width + parseInt(q.width());
                                    if(current_width >= parent_width)
                                        {
                                            q.remove();
                                        }
                                });
                        });
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
                        $.fn.t.kc_name_arr_current = [];
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

                $("#btn_article_more").click(function(e)
                    {
                        e.preventDefault();
                        var json_param = {};
                        json_param['fn'] = 'ga';
                        json_param['kc_name_arr'] = $.fn.t.kc_name_arr_current;
                        json_param['offset'] = $.fn.t.article_show_cnt;
                        json_param['terms'] = $("div#terms_article").text();
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
                                        $.fn.m.modal_confirm.find(".modal_confirm_block").text("Ошибка загрузки статей");
                                        $.fn.m.modal_confirm.modal('show');
                                        setTimeout(function()
                                            {
                                                $.fn.m.modal_confirm.modal('hide');
                                            }, 2000);
                                        return false;
                                    },
                                success: function(data)
                                    {
                                        $.fn.t.prepare_hentry(data);
                                        $.fn.t.article_show_cnt = $.fn.t.article_show_cnt * 2;
                                    }
                            });
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

        $.fn.t.prepare_hentry = function (in_data)
            {
                $.each(in_data,function(i,d)
                    {
                        var txt = d["txt"];
                        txt_small = txt.substring(0,300);
                        var content_box = $("div.content_box");
                        content_box.append('<div class="hentry" data-article_id="'+d["article_id"]+'" data-k_categories_id_1="'+d["k_categories_id_1"]+'" data-k_categories_id_2="'+d["k_categories_id_2"]+'" data-k_categories_id_3="'+d["k_categories_id_3"]+'">');
                        var hentry = content_box.find("div.hentry[data-article_id='"+d['article_id']+"']");
                        //hentry.append('<h2><span class="entry-title"><a href="http://ice-taxi.ru/phone_home/article?title='+d["title_translit"]+'&article_id='+d["article_id"]+'">'+d["h1"]+'</a></span></h2>');
                        hentry.append('<h2><span class="entry-title"><a href="'+$.fn.t.url_article_item+'&title='+d["title_translit"]+'&article_id='+d["article_id"]+'">'+d["h1"]+'</a></span></h2>');
                        hentry.append('<time class="updated" datetime="'+d["d_add_se"]+'" pubdate>'+d["d_add"]+'</time>');
                        hentry.append('<div class="entry-content"><p></p></div>');
                        var entry = hentry.find("div.entry-content p");
                        entry.append(txt_small + '... <span class="category"></span>');
                        var category = entry.find('span.category');
                        if(d["k_categories_id_1"] != undefined)
                            {
                                category.append('<a href="#" class="entry-related">'+d["kc_1_name"]+'</a> <span>('+d["unit_cnt_kc_1"]+')</span>');
                            }
                        if(d["k_categories_id_2"] != undefined)
                            {
                                category.append('<a href="#" class="entry-related">'+d["kc_2_name"]+'</a> <span>('+d["unit_cnt_kc_2"]+')</span>');
                            }
                        if(d["k_categories_id_3"] != undefined)
                            {
                                category.append('<a href="#" class="entry-related">'+d["kc_3_name"]+'</a> <span>('+d["unit_cnt_kc_3"]+')</span>');
                            }
                    });
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

        $.fn.t.prepare_hentry_pic_montage = function ()
            {
				var $container 	= $('#am-container'),
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

        $.fn.t.prepare_hentry_pic_collage = function ()
            {
                $('.am-container').removeWhitespace().collagePlus(
                    {
                        'fadeSpeed'     : 2000,
                        'targetHeight'  : 70
                    }
                );
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
        $.fn.t.unit_id_current = 0;

        $.fn.t.url_home = 0;
        $.fn.t.url_login = 0;
        $.fn.t.url_article_item = 0;
        $.fn.t.url_article_list = 0;
        $.fn.t.url_unit_list = 0;
        $.fn.t.url_lib = 0;

        $.fn.t.kc_name_arr_current = [];

        $.fn.t.modal_tags_list = {};

        $.fn.t.article_show_cnt = 5;

        $.fn.t.data = {};
    })($);